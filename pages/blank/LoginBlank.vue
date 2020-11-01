<template>
  <view></view>
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
<style lang="scss">
</style>
