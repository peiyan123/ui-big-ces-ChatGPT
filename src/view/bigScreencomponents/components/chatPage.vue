<template>
  <div id="big_jinma"  
    v-loading="loadingStatue"
    element-loading-text="登陆中，请稍等..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="screenContainer">
    <el-container>
      <el-aside width="0px"></el-aside>
      <el-container>
        <el-header >
          <svg @click="getBack()" style="width: 20px; position: absolute; left: 35px; top: 12px; color: #fff; cursor: pointer;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"></path><path fill="currentColor" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"></path></svg>
          <div @click="getBack()" style="top: 14px; color: #fff; left: 70px;font-weight: bold; position: absolute; cursor: pointer;">
            Back Home
          </div>
          <div class="list-header">
            <img width="35" height="25" style="margin-top: 12p4; margin-right: 8px; display: block;margin-top: 11px;" src="/src/assets/video.png" alt="">
            <div>Intelligent Surveillance</div>
          </div>
        </el-header>
        <el-main style="margin-left: 100px;">
          <div class="list-item">
            <div v-if="itemObj" class="list-left">
              <div class="list-left-top">
                <div v-if="!videoShow" class="play-icon" @click="videoPlay()">
                  <img width="60" height="60" style="margin-top: 4px" src="/src/assets/play.png" alt="">
                </div>
                <div class="video-img">
                  <img :src="itemObj!.videoImg" onerror="this.src='/src/assets/nopic.png';" alt="">
                </div>
              </div>
              <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: start;margin-bottom: 10px;"><img width="15" height="15" style="margin-top: 4px; display: block;" src="/src/assets/local.png" alt="">：{{itemObj.location}}</div>
                <div style="display: flex; justify-content: start;margin-bottom: 10px"><img width="15" height="15" style="margin-top: 4px; display: block;" src="/src/assets/time.png" alt="">：{{itemObj.time}}</div>
                <div style="display: flex; justify-content: start;"><img width="17" height="15" style="margin-top: 4px; display: block;" src="/src/assets/channel.png" alt="">：{{itemObj.channel}}</div>
              </div>
              <div class="list-left-bottom">
                <p style="font-weight: bold;">Summary：</p>
                <div style="display: -webkit-box;-webkit-line-clamp: 7; -webkit-box-orient: vertical; overflow: hidden;word-break: break-all;line-height: 22px;color: darkgrey;">{{itemObj.summary}}</div>
                <p style="font-weight: bold;">Some key points：</p>
                <div style="display: -webkit-box;-webkit-line-clamp: 7; -webkit-box-orient: vertical; overflow: hidden;word-break: break-all;line-height: 22px;color: darkgrey;">{{itemObj.keyPoints}}</div>
              </div>
            </div>
            <el-divider style="height: 100%; margin-left: 25px;" direction="vertical" />
            <div class="list-right">
              <div id="list-right-bottom" class="list-right-bottom">
                <div class="chat-input">
                  <el-input
                    v-model="chatMessage"
                    placeholder="Please input"
                    class="input-with-select"
                    style="height: 50px;"
                  >
                    <template #prepend>
                      <img :class="sendMessageLoading ? 'not-send' : 'can-send'" style="background-color: #409eff; color: #fff; height: 50px; border-radius: 25px;" src="/src/assets/clear.png" @click="delMessage()" alt="">
                    </template>
                    <template #suffix>
                      <!-- <el-button class="btn-send"  @click="sendChatMessage()" :icon="ArrowRightBold" /> -->
                      <img @click="sendChatMessage()" style="color: #fff; height: 30px; margin-top: 10px;" :class="sendMessageLoading ? 'not-send' : 'can-send'" src="/src/assets/send.png" alt="">
                    </template>
                  </el-input>
                </div>
                <div id="chat-message" class="chat-message">
                  <div v-for="(item, index) in chatMessageList" :key="index">
                    <div v-if="item.userMessage" class="user-question">
                      <div style="max-width: 500px; background: #37A5FF; border-radius: 10px; color: #fff; padding: 10px;margin-right: 5px; border-top-right-radius: 0px; margin-top: 20px;">
                       {{ item.userMessage }}
                      </div>
                      <div>
                        <el-avatar :size="50" src="/src/assets/user.png" />
                      </div>
                    </div>    
                    <div class="rubit-response">
                      <div>
                        <el-avatar :size="50" src="/src/assets/Rubik-talk.png" />
                      </div>
                      <div  style="max-width: 500px; border-radius: 10px; color: #fff; padding: 10px;margin-left: 5px;">
                        <div v-if="sendMessageLoading && index == chatMessageList.length - 1" style="color: #000000; display: flex;">
                          <div class="loading">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                          </div>
                          <div style="color: darkgrey;">
                            Generating answers for you...
                          </div>
                        </div>
                        <div style="display: inline-block; width: auto; background: #37A5FF; border-radius: 10px; color: #fff; border-top-left-radius: 0px;margin-top: 10px; padding: 10px;">
                          {{ item.rubitMessage }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
        <el-footer style="height: 0px;">
          <!-- <div style="width: calc(90% + 37px); text-align: right;">
            <el-button type="primary" @click="getBack()">返回列表</el-button>
          </div> -->
        </el-footer>
      </el-container>
    </el-container>
    <el-dialog
      v-model="videoShow"
      width="600px"
      z-index="0"
      :modal="false"
      :draggable="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
        <video ref="videoPlayer" width="600" height="340" controls>
          <source :src="itemObj.httpVideoUrlPlay" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      <template #footer>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import { ArrowRightBold, CaretRight, Delete, Back } from '@element-plus/icons-vue'
import moment from 'moment'
import { get, post } from '@/utils/axios'
import router from '@/router'
import axios from 'axios'
import { useRoute } from 'vue-router'
import videoList from '../../../../public/videoList.json'
import config from '../../../../public/config.json'
import { ElMessage } from 'element-plus'
export default defineComponent({
  components: {
  },
  setup() {
    const scale = ref(0)
    const loadingStatue = ref(true)
    const videoShow = ref(false)
    const sendMessageLoading = ref(false)
    const chatMessage = ref('')
    const chatMessageList = ref<any>([])
    const videoPlayer = ref(null)
    const route = useRoute();
    const itemObj = reactive({
      videoImg: '',
      videoUrl: '',
      videoId: '',
      summary: '',
      keyPoints: '',
      location: '',
      time: '',
      channel: '',
      httpVideoUrlPlay: ''
    })
    initData()
    onMounted(() => {
      //initData()
      setScale()
      window.addEventListener('resize', setScale)
      chatMessageList.value.push({
        rubitMessage: 'You can try asking me: What happened in the 4s of this video',
        userMessage: ''
      })
      //监听窗口刷新、关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      const id = route.query.id;
      itemObj.videoImg = videoList.filter((v: any) => v.videoId == id)[0].videoImg
      itemObj.videoUrl = videoList.filter((v: any) => v.videoId == id)[0].videoUrl
      itemObj.videoId = videoList.filter((v: any) => v.videoId == id)[0].videoId
      itemObj.summary = videoList.filter((v: any) => v.videoId == id)[0].summary
      itemObj.keyPoints = videoList.filter((v: any) => v.videoId == id)[0].keyPoints
      itemObj.location = videoList.filter((v: any) => v.videoId == id)[0].location
      itemObj.time = videoList.filter((v: any) => v.videoId == id)[0].time
      itemObj.channel = videoList.filter((v: any) => v.videoId == id)[0].channel
      itemObj.httpVideoUrlPlay = videoList.filter((v: any) => v.videoId == id)[0].httpVideoUrlPlay
      console.log(videoList.filter((v: any) => v.videoId == id)[0])
    })
    function videoPlay() {
      videoShow.value = true
      setTimeout(() => {
        if (videoPlayer.value) videoPlayer.value.play()
      }, 200)
    }
    function initData() {
      loadingStatue.value = false
    }
    function getBack() {
      router.push('/')
    }
    function sendChatMessage() {
      if (!sendMessageLoading.value && chatMessage.value !== '') {
        sendMessageLoading.value = true
        let params = {
          rubitMessage: '',
          userMessage: chatMessage.value
        }
        chatMessageList.value.push(params)
        var targetElement = document.getElementById("chat-message");
        // 计算目标元素相对于文档顶部的高度
        var elementTopPosition = targetElement!.getBoundingClientRect().top + window.pageYOffset;
        // 设置页面滚动距离
        targetElement!.scrollTo({ top: elementTopPosition });
        let sendParams = {
          video: itemObj.videoUrl,
          question: chatMessage.value,
          'vlm-endpoint': config['vlm-endpoint'],
          'ob-endpoint': config['ob-endpoint'],
          threshold: config.threshold
        }
        post('/prod/generation', sendParams, {
          'x-api-key': 'BYJGCfxTJ21LGlX4wobQGljMcTIQuTF59lYrsZm8'
        }).then(
          (res: any) => {
            let params2 = { 
              video_id: res.video_id,
              questions: chatMessage.value,
              "prompts_input": config['prompts_input'],
              "vlm-endpoint": config['vlm-endpoint'],  //部署endpoint节点生成
              "answer_path": config['answer_path'],
              "embedding_endpoint": config['embedding_endpoint'] //部署endpoint节点生成
            }
            post('/prod/inference', params2, {
              'x-api-key': 'BYJGCfxTJ21LGlX4wobQGljMcTIQuTF59lYrsZm8'
            }).then(
              (res: any) => {
                chatMessageList.value[chatMessageList.value.length-1].rubitMessage = res
                sendMessageLoading.value = false
                chatMessage.value = ''
                var targetElement = document.getElementById("chat-message");
                // 计算目标元素相对于文档顶部的高度
                var elementTopPosition = targetElement!.getBoundingClientRect().top + window.pageYOffset;
                // 设置页面滚动距离
                targetElement!.scrollTo({ top: elementTopPosition });
              },
              (err) => {
                ElMessage.error(err)
              }
            )
          },
          (err) => {
            ElMessage.error(err)
          }
        )
      }
    }
    function delMessage() {
      if (!sendMessageLoading.value) {
        chatMessageList.value = [{
        rubitMessage: 'You can try asking me: What happened in the 4s of this video',
        userMessage: ''
      }]
      } 
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
      window.removeEventListener('resize', setScale)
    })
    return {
      getScale,
      setScale,
      sendChatMessage,
      delMessage,
      loadingStatue,
      initData,
      videoPlay,
      videoShow,
      chatMessage,
      ArrowRightBold,
      Delete,
      Back,
      CaretRight,
      videoPlayer,
      sendMessageLoading,
      chatMessageList,
      getBack,
      videoList,
      config,
      itemObj
    }
  },
})
</script>
<style lang="less" scoped>
.not-send {
  cursor: not-allowed;
}
.can-send {
  cursor: pointer;
}
.screenContainer {
  transform-origin: 0 0;
  position: absolute;
  width: 100%;
  height: 100%;
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
.list-item {
  display: flex;
  height: calc(100% - 60px);
  .list-left {
    width: 20%;
    .list-left-top {
      border-radius: 5px;
      height: 40%;
      min-height: 280px;
      position: relative;
      .play-icon {
        cursor: pointer;
        width: 100%;
        height: 100%;
        position: absolute;
        margin-top: 30%;
      }
      .video-img {
        width: 100%;
        height: 100%;
        margin-bottom: 5px;
        line-height: 350px;
      }
      div {
        text-align: center;
      }
    }
    .list-left-bottom {
      margin-top: 25px;
      height: 50%;
      word-break: break-word;
    }
  }
  .list-right {
    width: 70%;
    height: 100%;
    margin-left: 15px;
    padding-left: 20px;
    .list-right-top {
      height: 40%;
      margin-bottom: 15px;
      text-align: center;
    }
    .list-right-bottom {
      height: calc(100% + 15px);
      border-radius: 5px;
      position: relative;
      .chat-input {
        position: absolute;
        bottom: -30px;
        width: 100%;
        z-index: 99999999;
        background-color: #fff;
        padding: 5px 0;
      }
      .chat-message {
        height: calc(100% - 50px);
        overflow-y: auto;
        padding: 15px;
        .user-question {
         display: flex;
         justify-content: end; 
        }
        .rubit-response {
          display: flex;
          justify-content: start; 
          margin-top: 10px;
          margin-bottom: 30px;
        }
      }
    }
  }
}
/deep/.el-input-group--prepend .el-input__inner {
  height: 50px !important;
  border-radius: 25px !important;
  z-index: 2002 !important;
}
/deep/.el-input-group__append, .el-input-group__prepend {
  background-color: #fff !important;
  border: 0px !important;
  z-index: 2002 !important;
}
/deep/.el-input-group__prepend {
  background-color: #fff !important;
  border: 0px !important;
}
/deep/.el-dialog, 
.is-draggable {
  z-index: 2002 !important;
}
/deep/.el-dialog__body {
  padding: 0px !important;
}
/deep/.el-dialog__footer {
  display: none;
}
/deep/.el-dialog__headerbtn {
  margin-top: -10px;
}
.btn-send {
  height: 44px;
  margin-top: 3px;
  border: 0px;
}
.btn-send:focus,
.btn-send:hover {
  background-color: #fff
}
.loading {
  display: flex;
  justify-content: space-between;
}
.dot {
  width: 5px;
  height: 5px;
  background: #000;
  border-radius: 50%;
  animation: wave 1s infinite;
  margin-right: 5px;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
  background-color: aqua;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
  background-color:cadetblue;
}
.dot:nth-child(4) {
  animation-delay: 0.6s;
  background-color:blueviolet;
}
.dot:nth-child(5) {
  animation-delay: 0.8s;
  background-color:chartreuse;
}

@keyframes wave {
  0% { transform: translateY(3px); }
  50% { transform: translateY(10px); }
  100% { transform: translateY(3px); }
}
</style>
