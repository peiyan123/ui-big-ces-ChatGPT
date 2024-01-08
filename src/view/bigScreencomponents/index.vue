<template>
  <div id="big_jinma"  
    v-loading="loadingStatue"
    element-loading-text="加载中，请稍等..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="screenContainer">
    <el-container>
      <el-aside style="width: 0px;"></el-aside>
      <el-container>
        <el-header>
          <div class="list-header">
            <img width="35" height="25" style="margin-top: 11px; margin-right: 8px; display: block;" src="/src/assets/video.png" alt="">
            <div>Intelligent Surveillance</div>
          </div>
        </el-header>
        <el-main style="margin-left: 100px;">
          <div class="search-list">
            <div style="font-weight: bold;">
              Search by date
            </div>
            <div>
              <el-date-picker
                v-model="dataRanger"
                type="daterange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
              />
              <el-button @click="handleSearch()" style="margin-top: -5px; margin-left: 5px;" type="primary">Search</el-button>
              <el-button @click="handleReaset()" style="margin-top: -5px;">Reset</el-button>
            </div>
          </div>
          <div v-for="(item, index) in tableData" :key="index" >
            <div class="list-item">
              <div class="list-left" @click="gotoChat(item.videoId)">
                <div class="play-icon">
                  <img width="60" height="60" style="margin-top: 4px" src="/src/assets/play.png" alt="">
                </div>
                <div style="line-height: 350px;">
                  <img :src="item.videoImg" onerror="this.src='/src/assets/nopic.png';" alt="">
                </div>
              </div>
              <div class="list-right">
                <p style="font-weight: bold;">Summary：</p>
                <div style="display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;word-break: break-all;">
                  {{ item.summary }}
                </div>
                <p style="font-weight: bold;">Some key points：</p>
                <div style="display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;word-break: break-all;">
                  {{ item.keyPoints }}
                </div>
                <div class="list-right-message">
                  <div style="display: flex; justify-content: start;"><img width="14" height="15" style="margin-top: 4px; display: block;" src="/src/assets/local.png" alt=""><div>： {{ item.location }}</div></div>
                  <div style="display: flex; justify-content: start;"><img width="15" height="15" style="margin-top: 4px; display: block;" src="/src/assets/time.png" alt=""><div>：{{ item.time }}</div></div>
                  <div style="display: flex; justify-content: start;"><img width="17" height="15" style="margin-top: 4px; display: block;" src="/src/assets/channel.png" alt=""><div>：{{ item.channel }}</div></div>
                </div>
              </div>
            </div>
          <el-divider style="width: calc(90% + 37px); clear: both;"/>
          </div>
          <el-pagination
            style="width: calc(90% + 37px); display: flex; justify-content: end;"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, prev, pager, next, sizes"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, ref } from 'vue'
import moment from 'moment'
import { MapLocation, Clock, VideoCameraFilled } from '@element-plus/icons-vue'
import { get, post } from '@/utils/axios'
import { useUserStore } from '@/store/moudules/appStore'
import videoList from '../../../public/videoList.json'
import router from '@/router'
export default defineComponent({
  components: {
  },
  setup() {
    const momentStr = ref('')
    const energy = ref()
    const regional = ref()
    const onMessageList: any = inject('onMessageList') // 接收注入
    const scale = ref(0)
    const dialogVisible = ref(false)
    const tableData = ref<any>([])
    const dataRanger = ref()
    const userStore = useUserStore()
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(100)
    const loginInfo = {
      username: 'jinma@qq.com',
      password: '123456',
    }
    let socket: WebSocket
    const loadingStatue = ref(true)
    let timer: any = null
    initData()
    onMounted(() => {
      //initData()
      setScale()
      window.addEventListener('resize', setScale)
      //监听窗口刷新、关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function () {
        socket.close()
      }
    })
    function handleSizeChange(val: number) {
      pageSize.value = val
      initData()
    }
    function handleCurrentChange(val: number) {
      currentPage.value = val
      initData()
    }
    function gotoChat(id: any) {
      router.push(`/chat?id=${id}`)
    }
    function handleSearch() {
      let startData
      if (dataRanger.value) {
        startData = moment(dataRanger.value[0]).format('YYYY-MM-DD')
      }
      initData()
      console.log(startData)
    }
    function handleReaset() {
      dataRanger.value = null
      initData()
    }
    function resetToken() {
      if (socket) {
        socket.close()
      }
      post('/auth/login', loginInfo).then((res: any) => {
        userStore.setToken(res.token)
        localStorage.setItem('token', res.token)
        const socketUrl =
          'ws://ib.thundercomm.com/api/ws/plugins/telemetry?token=' +
          userStore.getToken
        // const socketUrl =
        //   'ws://10.4.13.44:8080/api/ws/plugins/telemetry?token=' +
        //   userStore.getToken
        // let socketUrl =
        //   'ws://10.0.79.130:8888/api/ws/plugins/telemetry?token=' +
        //   userStore.getToken
        socket = new WebSocket(socketUrl)
        //连接发生错误刷新token重新链接
        // socket.onerror = function (event) {
        //   console.log('WebSocket:发生错误', event)
        //   socket.close()
        // }
        socket.onclose = function (event) {
          setTimeout(() => {
            resetToken()
          }, 5000)
        }
      })
    }
    function searchTime(date: any) {
      if (!dataRanger.value) {
        return true;
      }
      var dateObj = new Date(moment(date).format('YYYY-MM-DD'));
      let startData = new Date(moment(dataRanger.value[0]).format('YYYY-MM-DD'))
      let endData = new Date(moment(dataRanger.value[1]).format('YYYY-MM-DD'))
      console.log(dateObj, startData, endData)
      if (dateObj >= startData && dateObj <= endData) {
        return true;
      } else {
        return false;
      }
    }
    async function initData() {
      loadingStatue.value = true
      // 获取tokan
      // post('/auth/login', loginInfo).then((res: any) => {
      //   userStore.setToken(res.token)
      //   localStorage.setItem('token', res.token)
      //   createSocket()
      //   loadingStatue.value = false
      //   momentStr.value = moment().format('YYYYMMDD')
      //   // 初始化会议室数据
      //   get('/aiot/screen/meetingRoom/rooms/getInitRoom').then((res: any) => {
      //     loadingStatue.value = false
      //   })
      // })
      console.log(videoList)
      const start = (currentPage.value - 1) * pageSize.value
      const end = currentPage.value * pageSize.value
      tableData.value = videoList.filter((v) => searchTime(v.time)).slice(start, end)
      total.value = videoList.filter((v) => searchTime(v.time)).length
      loadingStatue.value = false
    }
    function onMessage() {
    }
    function sendWSRequest() {
      // let typeList = [
      //   'MEETING_ROOM_REQUEST',
      //   'OFFICE_ZONE_AIR_REQUEST',
      //   'SENSOR_REQUEST',
      //   'SHARED_STATION_REQUEST',
      //   'TOILET_SEAT_REQUEST',
      //   'WEATHER_REQUEST',
      //   'AIR_CONDITIONING_REQUEST',
      // ]
      // typeList.forEach((item) => {
      //   let params
      //   if (item === 'WEATHER_REQUEST') {
      //     params = {
      //       type: item,
      //       body: { cityName: dataJson.cityName },
      //       wsType: 'jinma',
      //     }
      //   } else {
      //     params = {
      //       type: item,
      //       body: { nowDate: momentStr.value },
      //       wsType: 'jinma',
      //     }
      //   }
      //   if (socket.readyState === 1) {
      //     socket.send(JSON.stringify(params))
      //   }
      // })
      // var breakers = {
      //   tsSubCmds: [
      //     {
      //       entityType: 'DEVICE',
      //       entityId: '71a86d80-c503-11ec-884d-9f9fd290dbfc',
      //       scope: 'LATEST_TELEMETRY',
      //       cmdId: 123,
      //     },
      //   ],
      // }
      // socket.send(JSON.stringify(breakers))
      // onMessage()
    }
    function getScale() {
      const width = 1920,
        height = 1080
      let ww = window.innerWidth / width
      let wh = window.innerHeight / height
      return ww < wh ? wh : ww
    }
    function setScale() {
      scale.value = getScale()
      // console.log(scale.value)
      let dom = document.getElementById('app')
      dom!.style.width = window.innerWidth + 'px'
      dom!.style.height = window.innerHeight + 'px'
    }
    onUnmounted(() => {
      window.clearInterval(timer)
      timer = null
      window.removeEventListener('resize', setScale)
      if (socket) {
        socket.close()
      }
    })
    return {
      getScale,
      setScale,
      dialogVisible,
      tableData,
      dataRanger,
      onMessageList,
      momentStr,
      onMessage,
      sendWSRequest,
      loadingStatue,
      energy,
      regional,
      initData,
      resetToken,
      gotoChat,
      handleSearch,
      handleReaset,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      total,
      MapLocation,
      Clock,
      VideoCameraFilled,
      videoList
    }
  },
})
</script>
<style lang="less" scoped>
.screenContainer {
  transform-origin: 0 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fbfdfe;
  .el-container {
    width: 100%;
    height: 100%;
  }
}
.list-header {
  height: 50px;
  background-color: cornflowerblue;
  margin-bottom: 10px;
  color: #fff;
  line-height: 50px;
  text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
.search-list {
  width: calc(90% + 37px);
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.list-item {
  display: flex;
  width: 100%;
  margin-bottom: 30px;
  .list-left {
    width: 20%;
    height: 250px;
    cursor: pointer;
    position: relative;
    .play-icon {
      cursor: pointer;
      width: 60px;
      height: 60px;
      position: absolute;
      top: 37%;
      left: 41%;
      z-index: 10;
    }
    img {
      margin-bottom: 5px;
      width: 100%;
      height: 100%;
      position: relative;
    }
    div {
      text-align: center;
    }
  }
  .list-right {
    width: 70%;
    height: 250px;
    margin-left: 15px;
    padding-left: 20px;
    position: relative;
    .list-right-message {
      position: absolute;
      bottom: 5px;
      width: 100%;
      display: flex;
      justify-content: start;
      div {
        margin-right: 50px;
      }
    }
  }
}
</style>
