<template>
  <view>
    <view v-if="switch2Display"
          class="layer"
          @click="closeModal">
    </view>
    <view class="modal"
          v-if="switch2Display"
          style="z-index:100">
      <view class="modal-upper-back">
        <image src="@/static/img/gwb-img/grzx_bg.png"></image>
        <!-- <view class="modal-text">X</view> -->
        <view class="modal-text">需要授权手机号码才可以进行后续的操作</view>
        <button type="primary"
                open-type="getPhoneNumber"
                style="font-size:14px"
                @getphonenumber="bindGetphonenumber"
                withCredentials="true">
          授权获取号码
        </button>
        <!-- @click="getWxUserInf" -->
      </view>
    </view>
  </view>
</template>

<script>
import Util from '@/util/Util'
import SystemApi from '@/api/system/System'
import AccountUtil from '@/util/AccountUtil'
import { ENUM_STATUS } from '@/util/Constants'

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
      this.navToHome()
      this.switch2Display = false
    },
    openModal () {
      this.switch2Display = true
    },
    bindGetphonenumber (e) {
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          console.log(e)
          // TODO  更改接口 修改直接发送请求 更换CODE SESSIONKEY
          if (e.detail.errMsg == "getPhoneNumber:ok") {
            SystemApi.decodePhoneNum(
              e.detail.encryptedData,
              e.detail.iv,
              loginRes.code
            ).then(resp => {
              if (!resp) {
                uni.showToast({
                  title: '失败,请重试'
                })
                return
              }
              let respObj = JSON.parse(resp)
              let obj = Util.getCurrentUserInf()
              obj.phoneNum = respObj.phoneNumber
              obj.status = ENUM_STATUS.ENABLE.code
              Util.setCurrentUserInf(obj)
              uni.showToast({
                title: '绑定成功'
              })
              this.switch2Display = false
            })
          } else if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            this.navToHome()
          }
        }
      })
    },
    navToHome () {
      uni.reLaunch({
        url: '../tabBar/home/home'
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
