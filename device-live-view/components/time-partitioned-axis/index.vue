<script setup lang='ts'>
import { computed, nextTick, onMounted, ref } from 'vue'
//@ts-ignore
import useTimePartitionedAxis from './useTimePartitionedAxis'
import dayjs from 'dayjs'


const props = withDefaults(defineProps<{
  timeData: {
    startTime: number
    endTime: number
  }
  associationVOList: any
  h: number
  resultComputed: any
}>(), {
  timeData: () => ({ startTime: 0, endTime: 0 }),
  associationVOList: () => [],
  h: 300,
  resultComputed: undefined
})

const timePartitionedAxisRef = ref<HTMLDivElement | null>(null)
const w = computed(() => {
  return timePartitionedAxisRef.value?.clientWidth
})
/**
 * md: 一个任务下会有N个设备，每个设备下会有N个探头，每个探头下会有N段视频
 * resultComputed: 任务列表
 */

const devices = computed(() => {
  if (props.resultComputed?.associationVOList?.length) {
    const res = JSON.parse(JSON.stringify(props.resultComputed))
    const devicesRes = res.associationVOList.map((item: any) => {
      // 创建新对象而不是修改原对象
      item.videoList = item.videoList.map((video: any) => {
        return {
          ...video,
          left: getThumbnailPosition(video) ,
          width: Math.max(getThumbnailWidth(video), 5),
          // top: index * rowHeight + 105 + index * 10
          top: 0
        }
      })
      item.videoList = item.videoList.sort((a: any, b: any) => a.start - b.start)

      item.videoGroupList = item.videoGroupList.map((group: any) => {
        return Object.entries(group).reduce((acc: any, [key, items]) => {
          acc[key] = (items as any[]).map((item: any) => {
            return { ...item, left: getThumbnailPosition(item) , width: Math.max(getThumbnailWidth(item), 5), top: 0 }
          })
          return acc
        }, {})
      })

      item.videoGroupList.forEach((group: any) => {
        console.log('👊 ~ group', group)
        const keys = Object.keys(group)
        keys.forEach((key: any) => {
          group[key] = group[key].sort((a: any, b: any) => a.start - b.start)
        })
      })

      return item
    })
    return devicesRes
  }
  return []
})



const {
  containerRef, createTimeAxis, scale, currentTime, zoomTransform,
  updateAnchorPosition, anchorRef, setPlaybackSpeed, playbackSpeedList, playbackSpeed,
  scaleFactor, setScaleFactor, minZoom, maxZoom,

  videoThumbnails, generateThumbnails, getThumbnailWidth, getThumbnailPosition,
  isPlaying, play, pause,
} = useTimePartitionedAxis({ ...props.timeData, associationVOList: props.associationVOList, })
console.log('👊 ~ props.associationVOList', props.associationVOList)

defineExpose({
  isPlaying, play, pause,
  setPlaybackSpeed, videoThumbnails, currentTime
})

onMounted(async () => {
  createTimeAxis()

  await nextTick() // 等待 DOM 渲染

  updateAnchorPosition()

  // BUG：无法自动获取第一帧
  await generateThumbnails()

})


// **拖动锚点**
const onDragStart = (event: MouseEvent) => {
  const startX = event.clientX
  const startValue = currentTime.value ?? props.timeData.startTime

  const onMouseMove = (moveEvent: MouseEvent) => {
    const dx = moveEvent.clientX - startX
    const newTime = scale.value.invert(scale.value(new Date(startValue)) + dx).getTime()

    if (newTime >= props.timeData.startTime && newTime <= props.timeData.endTime) {
      currentTime.value = newTime
      updateAnchorPosition()
    }
  }

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
  }

  document.addEventListener("mousemove", onMouseMove)
  document.addEventListener("mouseup", onMouseUp)
}

</script>

<template>

  <div class="flex flex-col w-full h-full gap-2 px-4" ref="timePartitionedAxisRef">
    <div class="flex w-full gap-4  h-[80px]">
      <div class="">
        <div class="w-[140px]  flex  gap-2 flex-col">
          <a-button @click="isPlaying ? pause() : play()" class="h-[34px] bg-blue-500">
            {{ isPlaying ? "暂停" : "播放" }}
          </a-button>
          <!-- 倍速选择 -->
          <a-select placeholder="请选择播放倍速" v-model="playbackSpeed" class="h-[34px]">
            <a-option v-for="item in playbackSpeedList" :value="item.value">{{ item.label }}</a-option>
          </a-select>
        </div>
      </div>

      <div class="relative flex flex-col flex-1 h-full gap-2">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="text-[12px]">锚点时间：{{ dayjs(currentTime || timeData.startTime).format('YYYY-MM-DD HH:mm') }}
            </div>
            <div class="text-[12px]">开始时间：{{ dayjs(timeData.startTime).format('YYYY-MM-DD HH:mm') }}</div>
            <div class="text-[12px]">结束时间：{{ dayjs(timeData.endTime).format('YYYY-MM-DD HH:mm') }}</div>
          </div>

          <div class="flex items-center gap-2">
            <div>缩放时间线</div>
            <a-slider :show-tooltip="false" v-model="scaleFactor" :min="minZoom" :max="maxZoom" :step="1"
              :style="{ width: '200px' }" @change="setScaleFactor" />
          </div>
        </div>

        <!-- 锚点 -->
        <div class="h-full px-2 timeline-container" ref="containerRef">
          <div class="anchor" ref="anchorRef" @mousedown="onDragStart" :style="{ height: h + 'px' }"></div>
        </div>

      </div>
    </div>

    <div class="flex-1 overflow-x-hidden overflow-y-auto h-[200px] pl-4" :style="{ width: w + 'px' }">
      <div v-for="(device, index) in devices" :key="index" class="w-full overflow-hidden">
        <div
          class="text-[14px]  font-medium border-b border-gray-600 py-1 relative items-center flex w-full overflow-hidden">
          <div class="w-[160px]">{{ device.info.name }}</div>
          <div class="relative flex flex-1 w-full overflow-hidden">
            <div v-for="(video, vIndex) in device.videoList" :key="vIndex" class="video-thumbnail" :style="{
              left: `${video.left}px`,
              top: `${video.top}px`,
              width: `${video.width}px`,
              height: '14px',
              backgroundColor: '#33977b',
              borderRadius: '0px',
            }">
            </div>
          </div>
        </div>
        <div v-for="(camears, cIndex) in device.videoGroupList" :key="cIndex"
          class="text-[14px] pl-2   border-b border-gray-600 py-1 relative items-center flex w-full overflow-hidden">
          <template v-for="(videos, camear) in camears" :key="camear">
            <div class="w-[152px]">- {{ camear }}</div>
            <div class="relative flex flex-1 w-full overflow-hidden">
              <div v-for="(video) in videos" :key="video.url" class="video-thumbnail" :style="{
                left: `${video.left}px`,
                top: `${video.top}px`,
                width: `${video.width}px`,
                height: '14px',
                backgroundColor: '#3498db',
                borderRadius: '0px'
              }">
              </div>
            </div>

          </template>

        </div>
      </div>
    </div>

  </div>


</template>


<style scoped>
::-webkit-scrollbar {
  width: 5px;
  position: absolute;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d2d4;
  border-radius: 25px;
}

.anchor {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  background-color: red;
  z-index: 1000;

}

.anchor:hover {
  cursor: move;
}

.timeline-container {
  position: relative;
  width: 100%;
  height: 50px;
  background: #222;
}

.video-thumbnail {
  position: relative;
  top: 20px;
  /* 让它们对齐 */
  width: 20px;
  height: 20px;
  border-radius: 4px;
}



.anchor {
  position: absolute;
  top: 0;
  width: 1px;
  background: red;
  cursor: grab;
  transition: transform 0.05s linear;
}
</style>
