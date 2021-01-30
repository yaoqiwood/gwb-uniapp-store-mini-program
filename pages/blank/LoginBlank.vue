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
import { ENUM_PAGE_TYPE } from '@/util/Constants'

export default {
  data () {
    return {}
  },
  onLoad (option) {
    uni.showLoading({
      title: '正在登录......',
      mask: true
    })
    SystemApi.checkLoginStatus().then(resp => {
      if (resp.status) {
				// console.log(option)
				if (JSON.stringify(option) == '{}'){
					Util.goto('/pages/tabBar/home/home')
				} else {
					switch(option.pageType){
						case ENUM_PAGE_TYPE.CATEGORY.code :
							Util.goto('/pages/tabBar/category/category')
							break
						case ENUM_PAGE_TYPE.PRODUCT.code:
							Util.goto('/pages/goods/goods?ptypeId=' + option.ptypeId)
					}
				}
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
