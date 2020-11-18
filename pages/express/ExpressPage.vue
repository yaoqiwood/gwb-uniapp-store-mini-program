<template>
  <view>
    <view style="width:95%;margin:0 auto">
      <uni-segmented-control :current="current"
                             :values="items"
                             @clickItem="onClickItem"
                             style-type="button"
                             active-color="#4cd964" />
    </view>
    <view v-for="(item,i) in expressPackagesInf"
          :key="i">
      <view v-if="current === i">
        <view style="margin:3.5%">
          <view style="height:25px">
            <view>物流方式：{{getName(item.expressInf.expressType.trim())}}</view>
          </view>
          <view>
            <span>物流单号：{{item.expressInf.expressId.trim()}}</span>
          </view>
        </view>
        <view style="width:80%;margin:0 auto">
          <button v-if="item.expressInf.expressId != null &&  item.expressInf.expressId.trim()!=''"
                  @click="navExpressInf(item.expressInf.expressId)">快递细节追踪</button>
        </view>
        <!-- <lee-logistics :no="item.expressInf.expressId" /> -->
      </view>
    </view>
    <view style="text-align:center">
      <text v-if="expressPackagesInf.length === 0">
        当前暂无物流信息
      </text>
    </view>
  </view>
</template>

<script>
// import LeeLogistics from '@/components/lee-logistics/lee-logistics.vue'
import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
import OrderItemApi from '@/api/orderItem/OrderItem'
import { ENUM_SHIPPING_METHOD } from '@/util/Constants'
export default {
  components: { uniSegmentedControl },
  data: () => {
    return {
      no: '',
      items: [],
      current: 0,
      expressType: '',
      expressNo: '',
      expressPackagesInf: []
    }
  },
  onLoad (row) {
    this.orderItemList(row.orderNo)
  },
  methods: {
    orderItemList (orderNo) {
      let that = this
      OrderItemApi.getOrderItemExpressInfo(orderNo).then(resp => {
        this.expressPackagesInf = resp
        resp.forEach((item, i) => {
          that.items.push('包裹' + (i + 1))
        })
        // console.log(this.expressPackagesInf)
      })
    },
    onClickItem (e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    getExpressType (type) {

    },
    getName (code) {
      for (let i in ENUM_SHIPPING_METHOD) {
        if (ENUM_SHIPPING_METHOD[i].code === code) {
          return ENUM_SHIPPING_METHOD[i].name
        }
      }
      return ''
    },
    navExpressInf (no) {
      // uni.navigateTo({
      //   url: "pages/index/index?source=" + no
      // })
      wx.navigateToMiniProgram({
        appId: 'wx6885acbedba59c14',
        path: "pages/index/index?source=" + no,
        extraData: {
        },
        success (res) {
          // 打开成功
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>