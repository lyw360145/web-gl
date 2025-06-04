import * as d3 from "d3"
import { computed, ref } from "vue"

export default function useTimePartitionedAxis(props = { startTime: '', endTime: '', associationVOList: [] }) {
  const containerRef = ref(null)
  const zoomTransform = ref(d3.zoomIdentity)
  const currentTime = ref(null)
  const anchorRef = ref(null)
  const w = computed(() => containerRef.value?.clientWidth || 800)

  const isPlaying = ref(false) // **播放状态**
  let animationFrameId = null
  // **播放方法**
  const play = () => {
    if (isPlaying.value) return
    isPlaying.value = true

    const step = () => {
      if (!isPlaying.value) return
      currentTime.value += 10000 // **每帧增加 100ms（可调速度）**

      if (currentTime.value >= props.endTime) {
        currentTime.value = props.endTime
        isPlaying.value = false
        return
      }

      updateAnchorPosition()
      animationFrameId = requestAnimationFrame(step)
    }

    step()
  }

  // **暂停方法**
  const pause = () => {
    isPlaying.value = false
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }


  // **时间比例尺**
  const scale = computed(() =>
    d3.scaleTime().domain([new Date(props.startTime), new Date(props.endTime)]).range([40, w.value - 40])
  )

  // **中文格式化**
  const { zhYearFormat, zhMonthFormat, zhDayFormat, zhHourFormat, zhMinuteFormat } = useZhLocale()

  function createTimeAxis() {
    const { startTime, endTime } = props

    const minTime = new Date(startTime)
    const maxTime = new Date(endTime)

    // **获取 `startTime` 的整点**
    const firstTick = new Date(minTime)
    firstTick.setMinutes(0, 0, 0) // **归零分钟、秒，确保是整点**

    const canvas = document.createElement("canvas")
    canvas.width = w.value
    canvas.height = 50
    const ctx = canvas.getContext("2d")
    containerRef.value.appendChild(canvas)

    ctx.font = "12px 'Microsoft YaHei', SimSun, sans-serif"

    // **初始化锚点位置**
    currentTime.value = minTime.getTime()
    updateAnchorPosition()

    // **计算时间跨度**
    const timeSpan = maxTime.getTime() - minTime.getTime()
    const oneDayMs = 24 * 60 * 60 * 1000

    // **默认刻度间隔**
    let defaultTickInterval = timeSpan <= oneDayMs ? 10 : 60 // **24h 内 10 分钟，否则 1 小时**
    const tickIntervals = [60, 30, 10, 5, 1] // **1h → 30m → 10m → 5m → 1m**
    const maxScale = tickIntervals.length + 1 // **最大缩放比例**
    let currentScaleIndex = tickIntervals.indexOf(defaultTickInterval)

    const zoom = d3.zoom()
      .scaleExtent([1, maxScale])
      .on("zoom", (event) => {
        zoomTransform.value = event.transform
        const scaleStep = (event.transform.k - 1) / (maxScale - 1)
        currentScaleIndex = Math.max(0, Math.min(tickIntervals.length - 1, Math.floor(scaleStep * (tickIntervals.length - 1))))
        redraw()
      })

    d3.select(canvas).call(zoom).call(zoom.transform, d3.zoomIdentity.scale(1))

    // function redraw() {
    //   ctx.clearRect(0, 0, w.value, 50)
    //   const scaled = zoomTransform.value.rescaleX(scale.value)

    //   // **计算 `tickInterval` 并确保 `startTime` 整点**
    //   let tickInterval = tickIntervals[currentScaleIndex]
    //   console.log('👊 ~ tickInterval', tickInterval)
    //   let tickMinutes = scaled.ticks(d3.timeMinute.every(tickInterval))

    //   // **保证 `startTime` 的 `HH:00` 作为起点**
    //   tickMinutes = tickMinutes.filter((t) => t >= firstTick)

    //   // **确保 `startTime` & `endTime` 只出现一次**
    //   const tickSet = new Set(tickMinutes.map((t) => t.getTime()))
    //   tickSet.add(minTime.getTime())
    //   tickSet.add(maxTime.getTime())

    //   tickMinutes = Array.from(tickSet).map((t) => new Date(t)).sort((a, b) => a.getTime() - b.getTime())

    //   // **绘制刻度**
    //   ctx.strokeStyle = "white"
    //   tickMinutes.forEach((t) => {
    //     const x = scaled(t)
    //     ctx.beginPath()
    //     ctx.moveTo(x, 10)
    //     ctx.lineTo(x, 20)
    //     ctx.stroke()
    //   })

    //   // **绘制 `label`**
    //   ctx.textAlign = "center"
    //   ctx.textBaseline = "top"
    //   ctx.fillStyle = "white"

    //   let lastLabelX = -Infinity
    //   tickMinutes.forEach((t) => {
    //     const x = scaled(t)
    //     let label = zhMinuteFormat(t)

    //     if (tickInterval === 60 && t.getHours() === 0 && t.getMinutes() === 0) {
    //       label = zhDayFormat(t) // **显示 `日期`**
    //     }

    //     if (x - lastLabelX >= 50) {
    //       ctx.fillText(label, x, 25)
    //       lastLabelX = x
    //     }
    //   })

    //   updateVideoThumbnails() // **在缩放时更新视频缩略图**
    // }

    function redraw() {
      ctx.clearRect(0, 0, w.value, 50)
      const scaled = zoomTransform.value.rescaleX(scale.value)

      // **计算时间跨度**
      const timeSpan = props.endTime - props.startTime // **毫秒级时间跨度**
      const oneHour = 60 * 60 * 1000
      const oneDay = 24 * oneHour
      const threeDays = 3 * oneDay

      let tickInterval
      if (timeSpan <= oneDay) tickInterval = 1 // **≤1天，1小时**
      else if (timeSpan <= 3 * oneDay) tickInterval = 3 // **>1天，≤3天，3小时**
      else if (timeSpan <= 7 * oneDay) tickInterval = 6 // **>3天，≤7天，6小时**
      else if (timeSpan <= 15 * oneDay) tickInterval = 12 // **>7天，≤15天，12小时**
      else if (timeSpan <= 30 * oneDay) tickInterval = 24 // **>15天，≤30天，24小时**
      else tickInterval = threeDays // **>30天，3天**

      console.log('🔹 选定的 tickInterval:', tickInterval, '小时')

      // **计算刻度**
      let tickTimes = []
      let tickTime = new Date(props.startTime).getTime()
      while (tickTime <= props.endTime) {
        tickTimes.push(new Date(tickTime))
        tickTime += tickInterval * oneHour // **递增 `tickInterval` 小时**
      }

      // **绘制刻度**
      ctx.strokeStyle = "white"
      tickTimes.forEach((t) => {
        const x = scaled(t)
        ctx.beginPath()
        ctx.moveTo(x, 10)
        ctx.lineTo(x, 20)
        ctx.stroke()
      })

      // **绘制 `label`**
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillStyle = "white"

      tickTimes.forEach((t, index) => {
        const x = scaled(t)

        // **每 `4` 个刻度显示 `label`**
        if (index % 4 === 0) {
          let label
          if (t.getHours() === 0) {
            label = zhDayFormat(t) // **00:00 显示日期**
          } else {
            label = zhHourFormat(t) // **其他时间显示小时**
          }

          ctx.fillText(label, x, 25)
        }
      })

      updateVideoThumbnails()
    }




    redraw()
  }



  // **更新锚点位置**
  const updateAnchorPosition = () => {
    if (!anchorRef.value || !currentTime.value) return
    const x = scale.value(new Date(currentTime.value))
    anchorRef.value.style.transform = `translateX(${x}px)`
  }



  const videoThumbnails = ref([])

  const generateThumbnails = async () => {
    // const videos = props.associationVOList.map(a => a.videoGroupList).flat(999)
    // videoThumbnails.value = videos.map((video) => ({
    //   url: video.url,
    //   image: null, // 不再获取第一帧，改用色块
    //   start: video.start,
    //   end: video.end
    // }))
    videoThumbnails.value = props.associationVOList.map(a => a.videoGroupList).flat(999)
  }


  const getThumbnailWidth = (video) => {
    const scaled = zoomTransform.value.rescaleX(scale.value)
    return scaled(new Date(video.end)) - scaled(new Date(video.start))
  }

  const getThumbnailPosition = (video) => {
    const scaled = zoomTransform.value.rescaleX(scale.value)
    return scaled(new Date(video.start))
  }


  const rowHeight = 25 // **每个轨道的高度**

  // const updateVideoThumbnails = () => {
  //   videoThumbnails.value = props.associationVOList.map(a => a.videoGroupList).flat(999)

  //   // 排序
  //   videoThumbnails.value.forEach(v => {
  //     const keys = Object.keys(v)
  //     keys.forEach(k => {
  //       v[k] = v[k].sort((a, b) => a.start - b.start)
  //     })
  //   })

  //   videoThumbnails.value
  //     .forEach((v, index) => {
  //       const keys = Object.keys(v)
  //       keys.forEach(k => {
  //         v[k] = v[k].map(v => {
  //           const left = getThumbnailPosition(v)
  //           const width = Math.max(getThumbnailWidth(v), 5)
  //           const top = index * rowHeight + 70 + index * 10 // **直接使用 `index` 计算 `top`**
  //           return { left, width, top, ...v }
  //         })
  //       })
  //     })
  // }

  const updateVideoThumbnails = () => {
    // 保持响应式更新的核心修改点
    videoThumbnails.value = props.associationVOList
      .map(a => ({
        // 创建新对象保持引用更新
        ...a,
        videoGroupList: a.videoGroupList.map(group => {
          // 对每个视频组进行排序
          const sorted = Object.entries(group).reduce((acc, [key, items]) => {
            acc[key] = [...items].sort((a, b) => a.start - b.start) // 创建新数组
            return acc
          }, {})
          return sorted
        })
      }))
      .flatMap(a => a.videoGroupList) // 替代 flat(999) 更安全

    // 转换为新数组结构触发响应式
    videoThumbnails.value = videoThumbnails.value.map((v, index) => {
      const newGroups = {}
      Object.entries(v).forEach(([key, items]) => {
        newGroups[key] = items.map(item => {
          // 创建新对象而不是修改原对象
          return {
            ...item,
            left: getThumbnailPosition(item),
            width: Math.max(getThumbnailWidth(item), 5),
            top: index * rowHeight + 100 + index * 10
          }
        })
      })
      return newGroups
    })
  }






  return {
    createTimeAxis,
    containerRef,
    scale,
    currentTime,

    updateAnchorPosition,
    anchorRef,

    videoThumbnails,
    generateThumbnails,
    getThumbnailWidth,
    getThumbnailPosition,

    isPlaying,
    play,
    pause,
  }
}

// **中文格式化**
function useZhLocale() {
  const zhLocale = d3.timeFormatLocale({
    dateTime: "%Y年%m月%d日 %H时%M分%S秒",
    date: "%Y年%m月%d日",
    time: "%H:%M:%S",
    periods: ["上午", "下午"],
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    shortDays: ["日", "一", "二", "三", "四", "五", "六"],
    months: [
      "一月", "二月", "三月", "四月", "五月", "六月",
      "七月", "八月", "九月", "十月", "十一月", "十二月",
    ],
    shortMonths: [
      "1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月",
    ],
  })

  return {
    zhYearFormat: zhLocale.format("%Y年"),
    zhMonthFormat: zhLocale.format("%m月"),
    zhDayFormat: zhLocale.format("%m月%d日"),
    zhHourFormat: zhLocale.format("%H时"),
    zhMinuteFormat: zhLocale.format("%H:%M"),
  }
}

function useTimeSpan() {
  const TIME_MS = {
    year: 365 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  }

  const TIME_MS_TO_LABEL = {
    '1day': TIME_MS.day,
    '3day': TIME_MS.day * 3,
    '7day': TIME_MS.day * 7,
    '1month': TIME_MS.month,
    '3month': TIME_MS.month * 3,
    '6month': TIME_MS.month * 6,
    '1year': TIME_MS.year,
    '1hour': TIME_MS.hour,
    '3hour': TIME_MS.hour * 3,
    '12hour': TIME_MS.hour * 12,
    '24hour': TIME_MS.hour * 24,
    '1minute': TIME_MS.minute,
    '5minute': TIME_MS.minute * 5,
    '30minute': TIME_MS.minute * 30,
  }

  const D3_TIME_EVERY = {
    '1day': d3.timeDay.every(1),
    '3day': d3.timeDay.every(3),
    '7day': d3.timeDay.every(7),
    '1month': d3.timeMonth.every(1),
    '3month': d3.timeMonth.every(3),
    '6month': d3.timeMonth.every(6),
    '1year': d3.timeYear.every(1),
    '1hour': d3.timeHour.every(1),
    '3hour': d3.timeHour.every(3),
    '12hour': d3.timeHour.every(12),
    '24hour': d3.timeHour.every(24),
    '1minute': d3.timeMinute.every(1),
    '5minute': d3.timeMinute.every(5),
    '30minute': d3.timeMinute.every(30),
  }

  const DEFAULT_TICK_INTERVAL = {
    '1day': 10,
    '3day': 30,
    '7day': 60,
    '1month': 120,
    '3month': 360,
    '6month': 720,
    '1year': 1440,
    '1hour': 10,
    '3hour': 30,
    '12hour': 60,
    '24hour': 120,
    '1minute': 1,
    '5minute': 5,
    '30minute': 30,
  }


  return {
    TIME_MS,
    TIME_MS_TO_LABEL,
    D3_TIME_EVERY,
    DEFAULT_TICK_INTERVAL,
  }
}
