<template>
  <view>
    <view class="order">
      <view class="row">
        <view style="font-size:28upx">
          订单号：{{orderData.orderNo}}
        </view>
      </view>
      <view class="row"
            style="height:auto">
        <view class="uni-list-cell-left left">
          订单状态:
        </view>
        <view class="uni-list-cell-db right">
          {{viewStatus}}
          <!-- {{orderData.status}} -->
        </view>
      </view>
      <view class="row"
            style="height:auto;font-size: 28upx;"
            v-if="returnBoolean">
        <view>
          确认收货倒计时:
          <u-count-down separator="zh"
                        style="padding-left:20upx"
                        :timestamp="confirmReceiveTimestamp" />
        </view>
      </view>
    </view>

    <view class="order">
      <view class="row"
            style="font-size: 28upx;">
        订单商品列表：
      </view>
      <view v-for="(item,i) in orderData.mallOrderItemList"
            :key="item.moiId"
            style="border-bottom:1px solid #F4F4F4">
        <view class="row"
              style="height:auto;justify-content:space-between"
              @tap="toGoods(item)">
          <image :src="item.ptypeCover"
                 style="width:80px;height:70px" />
          <view>
            <text>{{item.ptypePfullname}}</text>
            <view style="text-align:right">
              <text>{{item.price}} 元</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="order">
      <view class="row">
        <view style="font-size:28upx">
          订单详情
        </view>
      </view>
      <view class="row">
        <view class="uni-list-cell-left left">
          创建时间：
        </view>
        <view class="uni-list-cell-db right">
          {{orderData.createTime}}
        </view>
      </view>
      <view class="row"
            v-if="orderData.paymentTime">
        <view class="uni-list-cell-left left">
          付款时间：
        </view>
        <view class="uni-list-cell-db right">
          {{orderData.paymentTime}}
        </view>
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
      orderData: {
        orderNo: '',
        mallOrderItemList: [],
        status: ''
      },
      viewStatus: '',
      returnBoolean: false,
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
        let expressTime = new Date(resp.expressTime)
        this.confirmReceiveTimestamp = ((expressTime.getTime() / 1000) + 10 * 24 * 60 * 60) - (new Date().getTime() / 1000)
        this.viewStatus = this.getEnumOrderStauts(resp.status) == 'getName' ? '加载中' : this.getEnumOrderStauts(resp.status)
        this.returnBoolean = this.hasShippedStatus(resp.status)
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
    },
    toGoods (row) {
      uni.navigateTo({ url: '../goods/goods?ptypeId=' + row.ptypeId })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./css/StatusPage";
</style>