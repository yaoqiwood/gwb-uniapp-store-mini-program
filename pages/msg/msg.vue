<template>
  <view>
    <view class="chat-list">
      <view class="chat"
            v-for="(chat,index) in chatList"
            :key="index">
        <view class="row">
          <view class="left">
            <image :src="chat.face"></image>
          </view>
          <view class="right">
            <view class="top">
              <view class="username">{{chat.username}}</view>
              <view class="time">{{chat.time}}</view>
            </view>
            <view class="bottom">
              <view class="msg">{{chat.msg}}</view>
              <view class="tis"
                    v-if="chat.tisNum>0">{{chat.tisNum}}</view>
            </view>
          </view>
          <button open-type="contact"
                  class="button-msg">
            咨询
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      chatList: [
        {
          uid: 1,
          username: "售前咨询",
          face: "/static/img/im/face/face_3.jpg",
          time: "8:30-18:30",
          msg: "",
          tisNum: 0
        },
        {
          uid: 2,
          username: "售后咨询",
          face: "/static/img/im/face/face_2.jpg",
          time: "8:30-18:30",
          msg: "",
          tisNum: 0
        }
      ]
    }
  },
  //下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
  onPullDownRefresh () {
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onLoad () {

  },
  methods: {
    toChat (chat) {
      uni.navigateTo({
        url: "chat/chat?name=" + chat.username
      })
    }
  }
}
</script>

<style  lang="scss">
@import "./css/Msg";
</style>
