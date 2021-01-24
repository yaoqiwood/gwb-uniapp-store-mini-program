<template>
  <view>
    <image class="user-bg"
           src="@/static/img/gwb-img/grzx_bg.png"></image>
    <!-- <image src="@/static/img/gwb-img/default_avatar_back.png"></image> -->
    <view style="width:100%;display:flex;justify-content: center;">
      <view class="phoneNumGetter-Box"
            style="text-align: center">
        <view class="png_inner_title">
          <text class="png-box_font">广挖宝希望您能够提供我们需要的信息</text>
        </view>
        <view class="png_inner_second_title">
          <text class="png-box_font small_font">您绑定微信的手机号</text>
        </view>
        <view class="png_btn-group">
          <view class="getPhoneNumBtn">
            <view class="gpnb_box">
              <text>获取联系方式</text>
              <button open-type="getPhoneNumber"
                      style="width:100%;height:100%;position:absolute;top:0;opacity:0"
                      @getphonenumber="bindGetphonenumber"
                      withCredentials="true">
              </button>
            </view>
          </view>
          <view class="back_btn"
                @tap="navigateBack">
            <view class="bt_box">
              <text>返回</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Util from '@/util/Util'
import SystemApi from '@/api/system/System'
export default {
  data: () => {
    return {

    }
  },
  onShow () {

  },
  methods: {
    navigateBack () {
      uni.navigateBack({
        delta: 1
      })
    },
    bindGetphonenumber (e) {
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          // console.log(e)
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
              // obj.status = ENUM_STATUS.ENABLE.code
              Util.setCurrentUserInf(obj)
              uni.showToast({
                title: '绑定成功'
              })
              this.navigateBack()
              // this.switch2Display = false
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
  }
}
</script>

<style lang="scss" scoped>
@import "css/PhoneNumGetter";
</style>