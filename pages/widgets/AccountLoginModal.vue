<template>
  <view>
    <view v-if="switch2Display || defaultDisplay"
          class="layer">
      <!-- @click="closeModal" -->
      <view class="modal">
        <view class="modal-upper-back">
          <!-- <image style="z-index:-1"
                 src="@/static/img/gwb-img/grzx_bg.png"></image> -->
          <!-- <view class="close-btn"
                @click="closeModal">X</view> -->
          <view class="modal-text">需要授权登录才可以进行后续的操作</view>
          <view class="png_btn-group">
            <view class="getPhoneNumBtn">
              <view class="gpnb_box">
                <text>授权登录</text>
                <button open-type="getUserInfo"
                        @getuserinfo="getWxUserInf"
                        withCredentials="true">
                  授权登录
                </button>
                <!-- <button open-type="getPhoneNumber"
                        style="width:100%;height:100%;position:absolute;top:0;opacity:0"
                        @getphonenumber="bindGetphonenumber"
                        withCredentials="true">
                </button> -->
              </view>
            </view>
            <view class="back_btn"
                  @tap="closeModal">
              <view class="bt_box">
                <text>返回</text>
              </view>
            </view>
          </view>

          <view>
            <!-- <button open-type="getUserInfo"
                    @getuserinfo="getWxUserInf"
                    withCredentials="true">
              授权登录
            </button> -->
          </view>

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
            let copyObj = JSON.parse(JSON.stringify(obj))
            copyObj.avatar = copyObj.avatarUrl
            copyObj.nickname = copyObj.nickName
            Util.setCurrentUserInf(copyObj);
            this.closeModal()
            // uni.reLaunch({
            //   url: '../home/home'
            // })
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
