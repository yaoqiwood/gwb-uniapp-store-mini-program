<template>
  <view>
    <view class="icon">
      <image src="/static/img/success.png"></image>
    </view>
    <view class="tis">
      订单支付成功
    </view>
    <view class="pay-amount">
      支付金额:{{amount}}元
    </view>
    <view class="back">
      <view class="btn"
            @tap="toUser">个人中心</view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      amount: 0
    };
  },
  onLoad (e) {
    this.amount = parseFloat(e.amount).toFixed(2);
  },
  methods: {
    toUser () {
      uni.switchTab({
        url: '../../tabBar/user/user'
      })
    }
  },
}
</script>

<style lang="scss">
@import "./css/success";
</style>
