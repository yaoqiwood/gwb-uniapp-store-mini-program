<template>
  <view>
    <view v-if="switch2Display || defaultDisplay"
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
import { ENUM_STATUS } from "@/util/Constants"

export default {
  props: {

  },
  data: () => {
    return {
      switch2Display: false,
      defaultDisplay: false
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
    openModal (mode = false) {
      this.switch2Display = true
      this.defaultDisplay = mode
    },
    getWxUserInf (e) {
      if (!e.detail.userInfo) {
        return
      }
      uni.getUserInfo({
        provider: 'weixin',
        success: (infoRes) => {
          let obj = Util.getCurrentUserInf()
          // console.log(Util.getCurrentUserInf())
          obj.uid = Util.getCurrentUid()
          obj.avatarUrl = infoRes.userInfo.avatarUrl
          obj.city = infoRes.userInfo.city
          obj.country = infoRes.userInfo.country
          obj.gender = infoRes.userInfo.gender
          obj.nickName = infoRes.userInfo.nickName
          obj.province = infoRes.userInfo.province
          SystemApi.wxUserInfUpdate(obj).then(resp => {
            obj.status = ENUM_STATUS.NOT_PHONE_NUM.code
            Util.setCurrentUserInf(obj)
            Util.setObtainedStatus(true)
            uni.showToast({
              title: '授权成功'
            })
            this.defaultDisplay = false
            this.$emit("setWxUserInf", obj)
            uni.reLaunch({
              url: '../home/home'
            })
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
