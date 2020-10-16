<template>
  <view>
    <!-- 顶部导航 -->
    <view class="topTabBar"
          :style="{position:headerPosition,top:headerTop}">
      <view class="grid"
            v-for="(grid,tbIndex) in orderType"
            :key="tbIndex"
            @tap="showType(tbIndex)">
        <view class="text"
              :class="[tbIndex==tabbarIndex?'on':'']">{{grid}}</view>
      </view>
    </view>
    <!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
    <view class="order-list">
      <view class="list">
        <view class="onorder"
              v-if="list.length==0">
          <image src="../../../static/img/noorder.png"></image>
          <view class="text">
            没有相关订单
          </view>
        </view>
        <view class="row"
              v-for="(row,index) in list"
              :key="index">
          <view>订单号：{{row.orderNo}}</view>
          <view class="type">{{typeText[row.type]}}</view>
          <view class="order-info"
                v-for="(rowSecond,rowIndex) in row.mallOrderItemList"
                :key="rowIndex">
            <view class="left">
              <!-- <image :src="row.img"></image> -->
              <image style="width:90px;height:90px"
                     :src="rowSecond.ptypeCover"></image>
            </view>
            <view class="right">
              <view class="name">
                <!-- {{row.name}} -->
                {{rowSecond.ptypePfullname}}
              </view>
              <!-- <view class="spec">{{rowSecond.spec}}</view> -->
              <view class="price-number">
                ￥<view class="price">{{rowSecond.price}}</view>
                x<view class="number">{{rowSecond.quantity}}</view>
              </view>
            </view>
          </view>
          <view class="detail">
            <view class="number">共{{row.mallOrderItemList.length}}件商品</view>
            <view class="sum">合计￥<view class="price">{{row.orderSumPrice}}元</view>
            </view>
            <!-- <view class="nominal">(含运费 ￥{{row.postage}})</view> -->
          </view>
          <view class="btns">
            <block v-if="checkUnpayEnum(row.status)">
              <view class="default"
                    @tap="cancelOrder(row)">取消订单</view>
              <view class="pay"
                    @tap="toPayment(row)">付款</view>
            </block>
            <block v-if="checkPaidEnum(row.status)">
              <view class="default"
                    @tap="remindDeliver(row)">提醒发货</view>
            </block>
            <block v-if="checkShippedEnum(row.status)">
              <view class="default"
                    @tap="showLogistics(row)">查看物流</view>
              <view class="pay">确认收货</view>
              <view class="pay">我要退货</view>
            </block>
            <block v-if="checkSuccessEnum(row.status)">
              <!-- <view class="default">评价</view> -->
              <view class="default">再次购买</view>
            </block>
            <!-- <block v-if="row.type=='completed'">
              <view class="default">再次购买</view>
            </block> -->
            <block v-if="checkReturnEnum(row.status)">
              <view class="default">查看进度</view>
            </block>
            <block v-if="checkCanceledEnum(row.status)">
              <view class="default">已关闭</view>
            </block>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import OrderListApi from '@/api/orderList/OrderList'
import { ENUM_ORDER_STAUTS } from '@/util/Constants'
import Util from '@/util/Util'
export default {
  data () {
    return {
      headerPosition: "fixed",
      headerTop: "0px",
      typeText: {
        unpaid: '等待付款',
        back: '等待商家发货',
        unreceived: '商家已发货',
        received: '等待用户评价',
        completed: '交易已完成',
        refunds: '商品退货处理中',
        cancelled: '订单已取消'
      },
      orderType: ['全部', '待付款', '待发货', '待收货', '退换货', '已关闭'],
      //订单列表 演示数据
      orderList: [],
      list: [],
      tabbarIndex: 0,
      pageStep: 1,
      pageSize: 10
    };
  },
  onLoad (option) {
    //option为object类型，会序列化上个页面传递的参数
    let tbIndex = parseInt(option.tbIndex);
    // this.list = this.orderList[tbIndex];
    this.tabbarIndex = tbIndex;
    //兼容H5下排序栏位置
    // #ifdef H5
    let Timer = setInterval(() => {
      let uniHead = document.getElementsByTagName('uni-page-head');
      if (uniHead.length > 0) {
        this.headerTop = uniHead[0].offsetHeight + 'px';
        clearInterval(Timer);//清除定时器
      }
    }, 1);
    // #endif
    this.getMallOrderMainDto()
  },
  onPageScroll (e) {
    return;
    //兼容iOS端下拉时顶部漂移
    this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
  },
  methods: {
    showType (tbIndex) {
      this.tabbarIndex = tbIndex;
      for (let i in ENUM_ORDER_STAUTS) {
        if (ENUM_ORDER_STAUTS[i].index === tbIndex) {
          this.loadData(this.pageStep, this.pageSize, ENUM_ORDER_STAUTS[i].code)
        }
      }
      // this.list = this.orderList[tbIndex];
    },
    showLogistics (row) { },
    remindDeliver (row) {
      uni.showToast({
        title: '已提醒商家发货'
      })
    },
    cancelOrder (row) {
      uni.showModal({
        title: '取消订单',
        content: '确定取消此订单？',
        success: (res) => {
          if (res.confirm) {
            // console.log('用户点击确定');
            this.doCancelOrder(row.ordersn);
          } else if (res.cancel) {
            // console.log('用户点击取消');
          }
        }
      });
    },
    doCancelOrder (ordersn) {
      let typeNum = this.orderList.length;
      // for (let i = 0; i < typeNum; i++) {
      //   let list = this.orderList[i];
      //   let orderNum = list.length;
      //   if (orderNum > 0 && list[0].type == 'unpaid') {
      //     for (let j = 0; j < orderNum; j++) {
      //       if (this.orderList[i][j].ordersn == ordersn) {
      //         this.orderList[i][j].type = 'cancelled';
      //         break;
      //       }
      //     }
      //   }
      // }
    },
    toPayment (row) {
      //本地模拟订单提交UI效果
      uni.showLoading({
        title: '正在获取订单...'
      })
      let paymentOrder = []
      let map = row.mallOrderItemList.map(item => {
        return {
          moiId: item.moiId,
          name: item.ptypePfullname,
          number: item.quantity,
          price: item.price
        }
      })
      Util.setMallOrderMainSession(row)
      paymentOrder = map
      setTimeout(() => {
        uni.setStorage({
          key: 'paymentOrder',
          data: paymentOrder,
          success: () => {
            uni.hideLoading();
            uni.navigateTo({
              url: '../../pay/payment/payment?amount=' + row.orderSumPrice
            })
          }
        })
      }, 500)
    },
    getMallOrderMainDto () {
      let type = ENUM_ORDER_STAUTS.ALL.code
      for (let index in ENUM_ORDER_STAUTS) {
        if (ENUM_ORDER_STAUTS[index].index === this.tabbarIndex) {
          type = ENUM_ORDER_STAUTS[index].code
        }
      }
      uni.showLoading({
        title: '正在获取订单...'
      })
      this.loadData(this.pageStep, this.pageSize, type)
    },
    loadData (pageStep, pageSize, status) {
      OrderListApi.getMallOrderMainDto(pageStep, pageSize, status).then(resp => {
        if (resp.records.length > 0) {
          this.list = resp.records
        } else {
          this.list = []
        }
        //延时关闭  加载中的 loading框
        uni.hideLoading()
      })
    },
    checkUnpayEnum (code) {
      return ENUM_ORDER_STAUTS.UN_PAY.code === parseInt(code)
    },
    checkPaidEnum (code) {
      return ENUM_ORDER_STAUTS.PAID.code === parseInt(code)
    },
    checkShippedEnum (code) {
      return ENUM_ORDER_STAUTS.SHIPPED.code === parseInt(code)
    },
    checkSuccessEnum (code) {
      return ENUM_ORDER_STAUTS.SUCCESS.code === parseInt(code)
    },
    checkReturnEnum (code) {
      return ENUM_ORDER_STAUTS.RETURN.code === parseInt(code)
    },
    checkCanceledEnum (code) {
      return ENUM_ORDER_STAUTS.CLOSED.code === parseInt(code)
    }

  }
}
</script>

<style lang="scss">
@import "./css/OrderList";
</style>
