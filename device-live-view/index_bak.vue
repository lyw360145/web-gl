<script setup lang='ts'>
import { computed, ref } from 'vue'
import TimePartitionedAxis from './components/time-partitioned-axis/index.vue'


const props = withDefaults(defineProps<{
  result?: any
}>(), {
  result: undefined
})


const resultComputed = computed(() => {
  if (props.result) {
    return props.result
  }
  return {
    "createTime": 1741172452000,
    "updateTime": null,
    "createUser": "测试",
    "updateUser": "测试",
    "id": 1,
    "name": "测试",
    "urgency": null,
    "lon": null,
    "lat": null,
    "status": "2",
    "introduction": null,
    "content": null,
    "startTime": 1741172452000,
    "endTime": 1741186852000,
    "type": null,
    "supervisor": null,
    "no": null,
    "bigRoute": null,
    "associationVOList": [
      {
        "info": {
          "createTime": 1741778962794,
          "updateTime": null,
          "createUser": null,
          "updateUser": null,
          "id": 139780,
          "equipId": "131002",
          "name": "长航时无人船",
          "model": "V30-002",
          "company": "珠海云洲",
          "type": "无人艇",
          "spec": null,
          "crs": "WGS84",
          "lon": "110.268942",
          "lat": "20.026723",
          "date": 1741778962000,
          "hxLon": "110.268942",
          "hxLat": "20.026723",
          "taskId": 49,
          "lastUpdate": 1741778962794,
          "online": false,
          "unmannedBoat": {
            "usvMode": "船长模式",
            "prop": [
              {
                "index": 0,
                "rpm": 0
              },
              {
                "index": 1,
                "rpm": 0
              }
            ],
            "battery": [],
            "fuel": [
              {
                "index": 0,
                "name": "",
                "capacity": 18
              }
            ],
            "generator": [],
            "status": {
              "heading": "10.116855",
              "yaw": "0.176572",
              "pitch": "-0.000498",
              "roll": "-0.006236",
              "speed": "0.043474"
            }
          },
          "unmannedShip": null,
          "rov": null,
          "rov2": null,
          "droneVO": null,
          "szlROV": null,
          "waveBoat": null,
          "nfchUnmannedBoatVO": null,
          "orcaUnmannedBoatVO": null,
          "videoPush": "rtmp://livepush.spido.net/20250219/20250219",
          "videoPull": "https://live.spido.net/20250219/20250219.m3u8?auth_key=1739934957-0-0-265456841a3e7d719b8cdd4ba0bb749d",
          "equipVideoList": [
            {
              "name": "https://live.spido.net/20250219/20250219.m3u8?auth_key=1739934957-0-0-265456841a3e7d719b8cdd4ba0bb749d",
              "label": "rtmp://livepush.spido.net/20250219/20250219",
              "children": null
            }
          ]
        },
        "videoList": [
          {
            "url": "https://spido-live.oss-cn-shenzhen.aliyuncs.com/equipment/record/20250219/20250219/2025-03-05-20-33-57_2025-03-05-21-03-43.mp4",
            "start": 1741178037000,
            "end": 1741179823000
          },
          {
            "url": "https://spido-live.oss-cn-shenzhen.aliyuncs.com/equipment/record/20250219/20250219/2025-03-05-20-03-57_2025-03-05-20-33-57.mp4",
            "start": 1741176237000,
            "end": 1741178037000
          },
          {
            "url": "https://spido-live.oss-cn-shenzhen.aliyuncs.com/equipment/record/20250219/20250219/2025-03-05-19-33-57_2025-03-05-20-03-57.mp4",
            "start": 1741174437000,
            "end": 1741176237000
          },
          {
            "url": "https://spido-live.oss-cn-shenzhen.aliyuncs.com/equipment/record/20250219/20250219/2025-03-05-19-16-23_2025-03-05-19-17-02.mp4",
            "start": 1741173383000,
            "end": 1741173422000
          }
        ],
        "videoGroupList": [
          {
            "摄像头1": [
              {
                "url": "https://spido-live.oss-cn-shenzhen.aliyuncs.com/equipment/record/20250219/20250219/2025-03-05-20-33-57_2025-03-05-21-03-43.mp4",
                "start": 1741178037000,
                "end": 1741179823000
              },
              {
                "url": "https://spido-live.oss-cn-shenzhen.aliyuncs.com/equipment/record/20250219/20250219/2025-03-05-20-03-57_2025-03-05-20-33-57.mp4",
                "start": 1741176237000,
                "end": 1741178037000
              },
              {
                "url": "https://spido-live.oss-cn-shenzhen.aliyuncs.com/equipment/record/20250219/20250219/2025-03-05-19-33-57_2025-03-05-20-03-57.mp4",
                "start": 1741174437000,
                "end": 1741176237000
              },
              {
                "url": "https://spido-live.oss-cn-shenzhen.aliyuncs.com/equipment/record/20250219/20250219/2025-03-05-19-16-23_2025-03-05-19-17-02.mp4",
                "start": 1741173383000,
                "end": 1741173422000
              }
            ]
          }
        ],
        "routes": [],
        "tipsTaskName": "314测试任务等9个任务",
        "taskList": [
          {
            "id": 49,
            "name": "314测试任务"
          },
          {
            "id": 56,
            "name": "3131"
          },
          {
            "id": 57,
            "name": "316测试任务"
          },
          {
            "id": 58,
            "name": "“海空潜”无人装备智能协同演示"
          },
          {
            "id": 47,
            "name": "国家海洋综合试验场（深海）共享航次第一期"
          },
          {
            "id": 60,
            "name": "317测试任务"
          },
          {
            "id": 61,
            "name": "4月份任务测试"
          },
          {
            "id": 62,
            "name": "31"
          },
          {
            "id": 1,
            "name": "测试"
          }
        ]
      }
    ],
    "routes": []
  }
})

const associationVOList = computed(() => {
  return resultComputed.value.associationVOList
})

/**
 * md: 一个任务下会有N个设备，每个设备下会有N个探头，每个探头下会有N段视频
 * resultComputed: 任务列表
 */
const devices = computed(() => {
  return resultComputed.value.associationVOList
})

const timePartitionedAxisRef = ref()
const isPlaying = computed(() => {
  return timePartitionedAxisRef.value?.isPlaying
})

const deviceLiveViewRef = ref()
const h = computed(() => {
  return deviceLiveViewRef.value?.scrollHeight
})


const playbackSpeed = ref(1)
const playbackSpeedList = ref([
  { label: '1倍', value: 1 },
  { label: '2倍', value: 2 },
  { label: '4倍', value: 4 },
  { label: '8倍', value: 8 },
  { label: '16倍', value: 16 },
  { label: '32倍', value: 32 },
])

const videoThumbnails = computed(() => {
  return timePartitionedAxisRef.value?.videoThumbnails || []
})

</script>

<template>
  <div class="flex gap-2 px-4 py-2 overflow-hidden relative h-[260px]" ref="deviceLiveViewRef">
    <div class="text-[10px] w-[140px]">
      <!-- 播放器占位 -->
      <div class="w-[140px] h-[80px]  flex  gap-2 flex-col">
        <a-button @click="isPlaying ? timePartitionedAxisRef.pause() : timePartitionedAxisRef.play()"
          class="h-[30px] bg-blue-500 ">
          {{ isPlaying ? "暂停" : "播放" }}
        </a-button>
        <!-- 倍速选择 -->
        <a-select placeholder="请选择播放倍速" v-model="playbackSpeed" class="h-[30px]"
          @change="timePartitionedAxisRef.setPlaybackSpeed(playbackSpeed)">
          <a-option v-for="item in playbackSpeedList" :value="item.value">{{ item.label }}</a-option>
        </a-select>
      </div>

      <!-- <div class="absolute top-[87px] left-0 w-full  overflow-auto h-[200px] pl-4" >
        <div v-for="(device, index) in devices" :key="index">
          <div class="text-[14px] font-medium border-b border-gray-600 ">
            <span>{{ device.info.name }}</span>
          </div>
          <template v-for="(camears, cIndex) in device.videoGroupList" :key="cIndex">
            <div v-for="(videos, camear) in camears" :key="camear"
              class="text-[14px] ml-2 text-gray-300 border-b border-gray-600">- {{ camear }}
            </div>
          </template>
        </div>
      </div> -->


    </div>

    <div class="flex flex-col flex-1 gap-2 overflow-hidden">
      <TimePartitionedAxis ref="timePartitionedAxisRef"
        :timeData="{ startTime: resultComputed.startTime, endTime: resultComputed.endTime }"
        :associationVOList="associationVOList" :h="h" />
    </div>
  </div>
</template>
