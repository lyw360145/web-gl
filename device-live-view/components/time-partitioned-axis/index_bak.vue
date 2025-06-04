<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue'
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
}>(), {
  timeData: () => ({ startTime: 0, endTime: 0 }),
  associationVOList: () => [],
  h: 300,
})





const {
  containerRef, createTimeAxis, scale, currentTime, zoomTransform,
  updateAnchorPosition, anchorRef, setPlaybackSpeed,

  videoThumbnails, generateThumbnails, getThumbnailWidth, getThumbnailPosition,
  isPlaying, play, pause,
} = useTimePartitionedAxis({ ...props.timeData, associationVOList: props.associationVOList,  })

defineExpose({
  isPlaying, play, pause,
  setPlaybackSpeed, videoThumbnails
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






const captureFirstFrame = async (videoUrl: string) => {
  return new Promise<{ url: string; image: string | null }>((resolve, reject) => {
    const video = document.createElement("video")
    video.src = videoUrl
    video.crossOrigin = "anonymous" // 处理 CORS
    video.muted = true
    video.autoplay = false
    video.playsInline = true
    video.preload = "auto" // 确保数据加载
    video.currentTime = 0.1 // 直接跳转到 0.1 秒，防止黑屏

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = 0.1 // 移动到第一帧
    })

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return resolve({ url: videoUrl, image: null })

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageUrl = canvas.toDataURL("image/png")

      console.log("👊 First frame captured:", { url: videoUrl, image: imageUrl })
      resolve({ url: videoUrl, image: imageUrl })
    })

    video.addEventListener("error", (err) => {
      console.error("🚨 Video error:", err)
      reject({ url: videoUrl, image: null })
    })

    video.load()
  })
}


</script>

<template>
  <div class="relative flex flex-col h-full gap-2">
    <div class="flex items-center gap-4">
      <div class="text-[12px]">锚点时间：{{ dayjs(currentTime || timeData.startTime).format('YYYY-MM-DD HH:mm:ss') }} </div>
      <div class="text-[12px]">开始时间：{{ dayjs(timeData.startTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
      <div class="text-[12px]">结束时间：{{ dayjs(timeData.endTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
    </div>
    <div class="h-full px-2 timeline-container" ref="containerRef">
      <div class="anchor" ref="anchorRef" @mousedown="onDragStart" :style="{ height: h + 'px' }"></div>
    </div>
    <template v-for="(thumbnail, index) in videoThumbnails" :key="index">
      <template v-for="(videos, key) in thumbnail" :key="key">
        <div v-for="video in videos" :key="video.url" class="video-thumbnail" :style="{
          left: `${video.left}px`,
          top: `${video.top}px`,
          width: `${video.width}px`,
          height: '14px',
          backgroundColor: '#3498db',
          borderRadius: '0px'
        }">
        </div>
      </template>
    </template>
  </div>
</template>


<style scoped>
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
  border: 1px solid #444;
}

.video-thumbnail {
  position: absolute;
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
