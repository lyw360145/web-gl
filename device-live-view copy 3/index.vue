<script setup lang='ts'>
import { computed, ref, watch } from 'vue'
import TimePartitionedAxis from './components/time-partitioned-axis/index.vue'


const props = withDefaults(defineProps<{
  result?: any
}>(), {
  result: undefined
})


const resultComputed = computed(() => {
  console.log('👊 ~ props.result', props.result)
  if (props.result) {
    return props.result
  }
  return {
    startTime: new Date().getTime(),
    endTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 30
  }
})

const associationVOList = computed(() => {
  return resultComputed.value.associationVOList
})



const timePartitionedAxisRef = ref()
const deviceLiveViewRef = ref()
const h = computed(() => {
  return deviceLiveViewRef.value?.scrollHeight
})


const currentTime = computed(() => {
  return timePartitionedAxisRef.value?.currentTime || 0
})


const emits = defineEmits(['update:currentTime', 'update:anchorVideoList'])
const updateVideoList = (newVal: any) => {
  console.log('👊 ~ newVal-update:anchorVideoList', newVal)
  emits('update:anchorVideoList', newVal)
}
// update the currentTime to the parent component
// watch(currentTime, (newVal) => {
//   update(newVal)
// })

</script>

<template>
  <div class="overflow-hidden h-[260px]">
    <TimePartitionedAxis v-if="resultComputed.startTime && resultComputed.endTime" ref="timePartitionedAxisRef"
      :timeData="{ startTime: resultComputed.startTime, endTime: resultComputed.endTime }"
      :associationVOList="associationVOList" :h="h" :resultComputed="resultComputed" @update:anchorVideoList="updateVideoList"/>
  </div>

</template>
