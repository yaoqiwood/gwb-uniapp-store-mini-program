<template>
  <view>
    <view class="order">
      <view class="row"
            style="height:auto">
        <view class="uni-list-cell-left left">
          订单状态:
        </view>
        <view class="uni-list-cell-db right">
          {{getEnumOrderStauts(orderData.status) == 'getName' ? '加载中': getEnumOrderStauts(orderData.status)}}
        </view>
      </view>
      <view class="row"
            style="height:auto;font-size: 28upx;"
            v-if="hasShippedStatus(orderData.status)">
        <view>
          确认收货倒计时:
          <u-count-down style="padding-left:20upx"
                        :timestamp="confirmReceiveTimestamp" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import OrderMainApi from '@/api/order/main/OrderMain'
import { ENUM_ORDER_STAUTS } from '@/util/Constants'
export default {
  onLoad (option) {
    this.getMallOrderMainDetailById(option.momId)
  },
  data: () => {
    return {
      orderData: {},
      confirmReceiveTimestamp: 0,
      enumOrderStauts: ENUM_ORDER_STAUTS
    }
  },
  methods: {
    getMallOrderMainDetailById (id) {
      uni.showLoading({
        title: '加载中...'
      })
      OrderMainApi.getMallOrderMainDetailById(id).then(resp => {
        this.orderData = resp
        this.confirmReceiveTimestamp
      })
    },
    getEnumOrderStauts (status) {
      return ENUM_ORDER_STAUTS.getName(status)
    },
    countDownParseTimeStamp (time, day) {
      let timeStamp = Date.parse(new Date(time))
      timeStamp = timeStamp + (day * 24 * 3600 * 1000)
      let nowStamp = Date.parse(new Date())
      return (timeStamp - nowStamp) / 1000
    },
    hasShippedStatus (status) {
      return ENUM_ORDER_STAUTS.SHIPPED.code == status
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./css/StatusPage";
</style>