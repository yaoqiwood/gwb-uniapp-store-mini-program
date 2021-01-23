<template>
  <view>
    <image style="position:absolute;left:50%;top:50%;transform: translate(-50%,-50%);"
           src="/static/img/gwb-img/default_avatar_back.png"></image>
    <!-- <view class="loadEffect">
      <text></text>
      <text></text>
      <text></text>
      <text></text>
      <text></text>
      <text></text>
      <text></text>
      <text></text>
    </view> -->
    <!-- <image style="position:absolute;left:50%;top:48%;transform:translate(-52%,-100%)"
           mode="widthFix"
           src="/static/img/loading/replayLoadingGif.gif"></image> -->
  </view>
</template>

<script>
import Util from '@/util/Util'
import SystemApi from '@/api/system/System'

export default {
  data () {
    return {}
  },
  onLoad () {
    uni.showLoading({
      title: '正在登录......',
      mask: true
    })
    SystemApi.checkLoginStatus().then(resp => {
      if (resp.status) {
        Util.goto('/pages/tabBar/home/home')
      }
      uni.hideLoading()
    })
  },
  methods: {
    reNewUserInf () {
      SystemApi.getWxUserInf().then(resp => {
        Util.setCurrentUserInf(resp)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// @import "./css/LoginBlank";
</style>
