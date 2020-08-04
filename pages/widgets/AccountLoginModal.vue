<template>
  <view>
    <view v-if="switch2Display"
          class="layer"
          @click="closeModal">
      <view class="modal">
        <view class="modal-upper-back">
          <image src="@/static/img/gwb-img/grzx_bg.png"></image>
          <view class="modal-text">需要授权登录才可以进行后续的操作</view>
          <button type="primary"
                  open-type="getUserInfo"
                  @getuserinfo="getWxUserInf"
                  withCredentials="true">
            授权登录
          </button>
          <!-- @click="getWxUserInf" -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Util from '@/util/Util'
import SystemApi from '@/api/system/System'

export default {
  props: {

  },
  data: () => {
    return {
      switch2Display: false
    }
  },
  onLoad () {

  },
  methods: {
    checkUserStatus () {
      return Util.getObtainedStatus()
    },
    closeModal () {
      this.switch2Display = false
    },
    openModal () {
      this.switch2Display = true
    },
    getWxUserInf (e) {
      if (!e.detail.userInfo) {
        return
      }
      uni.getUserInfo({
        provider: 'weixin',
        success: (infoRes) => {
          let obj = {
            uid: Util.getCurrentUid(),
            avatarUrl: infoRes.userInfo.avatarUrl,
            city: infoRes.userInfo.city,
            country: infoRes.userInfo.country,
            gender: infoRes.userInfo.gender,
            nickName: infoRes.userInfo.nickName,
            province: infoRes.userInfo.province
          }
          SystemApi.wxUserInfUpdate(obj).then(resp => {
            Util.setCurrentUserInf(JSON.stringify(obj))
            Util.setObtainedStatus(true)
            uni.showToast({
              title: '授权成功'
            })
            this.$emit("setWxUserInf", obj)
          })
        }
      })
    }
  },
  watch: {

  }
}
</script>

<style lang="scss">
@import "css/AccountLoginModal.scss";
</style>
