import * as d3 from "d3"
import dayjs from "dayjs"
import { computed, ref } from "vue"
const THRESHOLDS = {
  YEAR: 31536000000, // 365天
  MONTH: 2592000000, // 30天
  WEEK: 604800000, // 7天
  DAY: 86400000, // 1天
  HOUR: 10800000, // 3小时
  MINUTE: 60000, // 1分钟
}
export default function useTimePartitionedAxis(props = { startTime: '', endTime: '', associationVOList: [], }) {

  const containerRef = ref(null)
  const zoomTransform = ref(d3.zoomIdentity)
  const currentTime = ref(null)
  const anchorRef = ref(null)
  const w = computed(() => containerRef.value?.clientWidth || 800)

  const zoom = d3.zoom()

  const scaleFactor = ref(1) // 初始缩放比例
  const minZoom = 1
  const maxZoom = computed(() => {
    const timeRange = props.endTime - props.startTime // 总时间跨度（毫秒）
    const baseZoomFactor = 1000 // **改为秒单位（1000ms = 1秒），防止数值过大**
    return Math.min(Math.max(timeRange / baseZoomFactor, 5), 300) // 限制 zoom 最大值
  })
  const setScaleFactor = (value) => {
    scaleFactor.value = value
    d3.select(containerRef.value)
      .transition()
      .duration(200)
      .call(zoom.scaleTo, value) // ✅ 手动调整缩放
  }

  const playbackSpeed = ref(1)
  const playbackSpeedList = ref([
    { label: '1倍', value: 1 },
    { label: '2倍', value: 2 },
    { label: '4倍', value: 4 },
    { label: '8倍', value: 8 },
    { label: '16倍', value: 16 },
    { label: '32倍', value: 32 },
  ])
  const setPlaybackSpeed = (speed) => {
    playbackSpeed.value = speed
  }

  const minTime = new Date(props.startTime)
  const maxTime = new Date(props.endTime)

  // **时间比例尺**
  const scale = computed(() =>
    d3.scaleTime().domain([new Date(props.startTime), new Date(props.endTime)]).range([40, w.value - 40])
  )

  // 中文本地化格式
  const { zhFormat, zhYearFormat, zhMonthFormat, zhDayFormat, zhWeekFormat, zhHourFormat, zhMinuteFormat, zhSecondFormat } = useZhLocale()
  function createTimeAxis() {
    const canvas = document.createElement("canvas")
    canvas.width = w.value
    canvas.height = 80 // 预留足够的高度

    const ctx = canvas.getContext("2d")
    containerRef.value.appendChild(canvas)
    ctx.font = "12px 'Microsoft YaHei', SimSun, sans-serif" // 适配中文字体

    // **初始化锚点位置**
    currentTime.value = minTime.getTime()

    // 绑定缩放
    zoom
      .scaleExtent([1, 5000])
      .on("zoom", (event) => {
        zoomTransform.value = event.transform
        scaleFactor.value = event.transform.k // ✅ 记录缩放比例

        const scaled = zoomTransform.value.rescaleX(scale.value)

        // **更新 currentTime 以匹配锚点**
        // currentTime.value = scaled.invert(anchorRef.value?.offsetLeft || 0).getTime()

        // **更新锚点位置**
        updateAnchorPosition()

        redraw()
      })
    d3.select(canvas)
      .call(zoom)
      .call(zoom.transform, zoomTransform.value)
      .on("click", onAxisClick)

    // redraw
    function redraw() {
      ctx.clearRect(0, 0, w.value, 50)
      const scaled = zoomTransform.value.rescaleX(scale.value)
      // **绘制 X 轴主线**
      ctx.save()
      ctx.translate(0, 10)
      // **计算刻度**
      const ticks = scaled.ticks()
      let timeIntervalMs = ticks.length > 1 ? ticks[1] - ticks[0] : THRESHOLDS.YEAR
      // **层级判断**
      const isYearLevel = timeIntervalMs >= THRESHOLDS.YEAR
      const isMonthLevel = !isYearLevel && timeIntervalMs >= THRESHOLDS.MONTH
      const isDayLevel = !isMonthLevel && timeIntervalMs >= THRESHOLDS.DAY
      const isHourLevel = !isDayLevel && timeIntervalMs >= THRESHOLDS.HOUR
      const isMinuteLevel = !isHourLevel && timeIntervalMs >= THRESHOLDS.MINUTE


      // **动态格式选择**
      const format = isYearLevel
        ? zhYearFormat
        : isMonthLevel
          ? zhMonthFormat
          : isDayLevel
            ? (d) => zhFormat("%m月%d日")(d)
            : isHourLevel
              ? zhHourFormat
              : isMinuteLevel
                ? zhMinuteFormat
                : (d) => zhFormat("%S")(d)

      // **绘制 X 轴主线**
      ctx.beginPath()
      ctx.moveTo(0, 0.5)
      ctx.lineTo(w.value, 0.5)
      ctx.strokeStyle = "transparent" // **主轴线变白色**
      ctx.stroke()
      // **绘制刻度 & 标签**
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillStyle = "white" // **文本颜色变白色**

      // **更新锚点位置**
      if (currentTime.value) {
        let closestTick = ticks.reduce((prev, curr) =>
          Math.abs(curr.getTime() - currentTime.value) < Math.abs(prev.getTime() - currentTime.value) ? curr : prev
        )

        const anchorX = scaled(closestTick) // 计算锚点位置

        if (anchorRef.value) {
          anchorRef.value.style.transform = `translateX(${anchorX + 7.5}px)`
        }
      }

      ticks.forEach((t, index) => {
        const x = scaled(t)
        // **绘制刻度线**
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, isYearLevel ? 15 : 10)
        ctx.strokeStyle = "white" // **刻度线变白色**
        ctx.stroke()
        // **格式化刻度标签**
        let label = format(t)
        if (isMonthLevel && t.getMonth() === 0) {
          label = `${zhYearFormat(t)}${zhMonthFormat(t)}`
        }

        else if (isDayLevel) {
          if (index % 4 === 0) {
            ctx.fillText(label, x, 20)
          }
        } else if (isHourLevel) {
          if (t.getHours() === 0 && t.getMinutes() === 0) {
            label = zhDayFormat(t) // **显示 `日期`**
            ctx.fillText(label, x, 20)
          }
          else if (index % 4 === 0) {
            ctx.fillText(label, x, 20)
          }
        } else if (isMinuteLevel) {
          ctx.fillText(label, x, 20)
        }


        else {
          // **绘制刻度文本**
          // ctx.fillText(label, x, 20)
          if (index % 4 === 0) {
            ctx.fillText(label, x, 20)
          }
        }
      })
      ctx.restore()

      updateVideoThumbnails()

    }
    redraw()
  }


  const onAxisClick = (event) => {
    if (!containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const clickX = event.clientX - rect.left // ✅ 获取点击相对 canvas 的位置

    const scaled = zoomTransform.value.rescaleX(scale.value) // ✅ 使用缩放后的比例尺
    const clickedTime = scaled.invert(clickX).getTime() // ✅ 计算点击时间

    // **确保 ticks 严格对齐 scale**
    const ticks = scaled.ticks()

    // **查找 ticks 中最接近 clickedTime 的刻度**
    let closestTick = ticks.reduce((prev, curr) =>
      Math.abs(curr.getTime() - clickedTime) < Math.abs(prev.getTime() - clickedTime) ? curr : prev
    )

    // **计算刻度的精确像素位置**
    const closestX = scaled(closestTick)

    // **强制 currentTime 对齐刻度**
    currentTime.value = closestTick.getTime()
    console.log('👊 ~ currentTime.value', currentTime.value)

    // **平滑移动锚点**
    if (anchorRef.value) {
      requestAnimationFrame(() => {
        anchorRef.value.style.transform = `translateX(${closestX + 7.5}px)`
      })
    }
  }




  // **更新锚点位置**
  const updateAnchorPosition = () => {
    if (!anchorRef.value || !currentTime.value) return
    const x = scale.value(new Date(currentTime.value))
    anchorRef.value.style.transform = `translateX(${x}px)`
  }

  const videoThumbnails = ref([])

  const generateThumbnails = async () => {
    updateVideoThumbnails()
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
  const updateVideoThumbnails = () => {
    // 保持响应式更新的核心修改点
    videoThumbnails.value = JSON.parse(JSON.stringify(props.associationVOList))
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
        }),
        // videoList: a.videoList.sort((a, b) => a.start - b.start)
      }))
      // .flatMap(a => a.videoGroupList) // 替代 flat(999) 更安全
      console.log('👊 ~ videoThumbnails.value', videoThumbnails.value)
    // 转换为新数组结构触发响应式
    videoThumbnails.value = videoThumbnails.value.map((v, index) => {
      // const newGroups = {}

      // Object.entries(v).forEach(([key, items]) => {
      //   newGroups[key] = items.map(item => {
      //     // 创建新对象而不是修改原对象
      //     return {
      //       ...item,
      //       left: getThumbnailPosition(item) + 160,
      //       width: Math.max(getThumbnailWidth(item), 5),
      //       // top: index * rowHeight + 105 + index * 10
      //       top: 0
      //     }
      //   })
      // })
      // console.log('👊 ~ newGroups', { newGroups, videoThumbnails: videoThumbnails.value })
      // return newGroups
      v.videoGroupList = v.videoGroupList.map((group) => {
        return Object.entries(group).reduce((acc, [key, items]) => {
          acc[key] = items.map(item => {
            return { ...item, left: getThumbnailPosition(item) + 160, width: Math.max(getThumbnailWidth(item), 5), top: 0 }
          })
          return acc
        }, {})
      })

      return v



    })
    console.log('👊 ~ videoThumbnails.value', videoThumbnails.value)
  }

  const isPlaying = ref(false) // **播放状态**
  let animationFrameId = null
  // **播放方法**
  const play = () => {
    if (isPlaying.value) return
    isPlaying.value = true

    const scaled = zoomTransform.value.rescaleX(scale.value) // ✅ 计算缩放后的比例尺
    const baseStep = 1000 // ✅ 基础步长 1 分钟（60秒）

    // **获取当前缩放级别下的刻度**
    const ticks = scaled.ticks()
    if (!ticks.length) {
      isPlaying.value = false
      return
    }

    // **找到最后一个刻度的时间**
    const lastTickTime = ticks[ticks.length - 1].getTime()

    const step = () => {
      if (!isPlaying.value) return
      const timeStep = baseStep * playbackSpeed.value // ✅ 按倍速调整时间步长
      currentTime.value += timeStep // **根据倍速增加播放时间**

      // **计算当前时间对应的像素位置**
      const x = scaled(new Date(currentTime.value))

      // **更新锚点位置**
      if (anchorRef.value) {
        anchorRef.value.style.transform = `translateX(${x}px)`
      }

      if (currentTime.value >= lastTickTime) {
        pause()
        console.log("✅ 已到达时间轴最后一个刻度，播放停止")
      } else {
        animationFrameId = requestAnimationFrame(step)
      }
    }

    step()
  }

  // **暂停方法**
  const pause = () => {
    isPlaying.value = false
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }


  return {
    createTimeAxis,
    containerRef,
    scale,
    currentTime,
    zoomTransform,

    updateAnchorPosition,
    anchorRef,

    videoThumbnails,
    generateThumbnails,
    getThumbnailWidth,
    getThumbnailPosition,

    isPlaying,
    play,
    pause,
    setPlaybackSpeed,
    playbackSpeedList,
    playbackSpeed,

    scaleFactor,
    setScaleFactor,
    minZoom,
    maxZoom,
  }
}
// 中文格式化
function useZhLocale() {
  const zhLocale = d3.timeFormatLocale({
    dateTime: "%Y年%m月%d日 %H时%M分%S秒",
    date: "%Y年%m月%d日",
    time: "%H:%M:%S",
    periods: ["上午", "下午"],
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    shortDays: ["日", "一", "二", "三", "四", "五", "六"],
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
    shortMonths: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
  })
  return {
    zhFormat: zhLocale.format,
    zhYearFormat: zhLocale.format("%Y年"),
    zhMonthFormat: zhLocale.format("%b"),
    zhWeekFormat: zhLocale.format("%A"),
    zhDayFormat: zhLocale.format("%m月%d日"),
    zhHourFormat: zhLocale.format("%H:%M"),  // ✅ 修正小时格式，确保显示 `12:30`
    zhMinuteFormat: zhLocale.format("%H:%M"), // ✅ 修正分钟格式，确保 `00分` 变成 `12:30`
  }
}
