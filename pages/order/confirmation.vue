<template>
  <view>
    <!-- 收货地址 -->
    <view class="addr"
          @tap="chooseAddress">
      <view class="icon">
        <image src="../../static/img/addricon.png"
               mode=""></image>
      </view>
      <view class="right"
            v-if="noneDefaultAddressKey">
        <view style="position:relative;top:50%;transform:translateY(-50%)">
          <span>请选择收获地址</span>
        </view>
      </view>
      <view class="right"
            v-else>
        <view class="tel-name">
          <view class="name">
            {{recinfo.userName}}
          </view>
          <view class="tel">
            {{recinfo.telNumber}}
          </view>
        </view>
        <view class="addres">
          {{recinfo.provinceName + recinfo.cityName}}
          {{recinfo.detailInfo}}
        </view>
      </view>

    </view>
    <!-- 购买商品列表 -->
    <view class="buy-list">
      <view class="row"
            v-for="(row,index) in buylist"
            :key="index">
        <view class="goods-info">
          <view class="img">
            <image :src="row.img"></image>
          </view>
          <view class="info">
            <view class="title">{{row.name}}</view>
            <!-- 选择{{row.spec}} -->
            <view class="spec"> 数量:{{row.number}}</view>
            <view class="price-number">
              <view class="price">￥{{row.price*row.number}}</view>
              <view class="number">
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="order">
      <view class="row">
        <view class="uni-list-cell-left left">
          配送方式：
        </view>
        <view class="uni-list-cell-db right">
          <!-- @change="bindPickerChange" -->
          <!-- :range-key="index" -->
          <picker :value="expressIndex"
                  :range="expressArray"
                  range-key="name"
                  mode="selector"
                  @change="bindPickerChange">
            <view style="text-align:right">{{expressArray[expressIndex].name}}</view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 提示-备注 -->
    <view class="order">
      <!-- <view class="row">
        <view class="left">
          积分 :
        </view>
        <view class="right">
          已扣除{{int}}积分抵扣{{deduction|toFixed}}元
        </view>
      </view> -->
      <view class="row">
        <view class="left">
          备注 :
        </view>
        <view class="right">
          <input placeholder="选填,备注内容"
                 v-model="note" />
        </view>
      </view>
    </view>
    <!-- 明细 -->
    <view class="detail">
      <view class="row">
        <view class="nominal">
          商品金额
        </view>
        <view class="content">
          ￥{{goodsPrice|toFixed}}
        </view>
      </view>
      <view class="row">
        <view class="nominal">
          运费
        </view>
        <view class="content">
          <!-- +￥{{freight|toFixed}} -->
          到付
        </view>
      </view>
      <!-- <view class="row">
        <view class="nominal">
          积分抵扣
        </view>
        <view class="content">
          -￥{{deduction|toFixed}}
        </view>
      </view> -->
    </view>
    <view class="blck">
    </view>
    <view class="footer">
      <view class="settlement">
        <view class="sum">合计:<view class="money">￥{{sumPrice|toFixed}}</view>
        </view>
        <view class="btn"
              @tap="toPay">提交订单</view>
      </view>
    </view>
  </view>
</template>

<script>
import Util from '@/util/Util'
import OrderApi from '@/api/order/Order'
import { ENUM_SHIPPING_METHOD } from '@/util/Constants'
export default {
  data () {
    return {
      buylist: [],		//订单列表
      goodsPrice: 0.0,	//商品合计价格
      sumPrice: 0.0,	//用户付款价格
      freight: 12.00,	//运费
      note: '',		//备注
      int: 1200,		//抵扣积分
      deduction: 0,	//抵扣价格
      // id: 1, name: "大黑哥", 
      // head: "大", tel: "18816881688", address: { region: { "label": "广东省-深圳市-福田区", "value": [18, 2, 1], 
      // "cityCode": "440304" }, detailed: '深南大道1111号无名摩登大厦6楼A2' }, isDefault: true
      recinfo: {},
      noneDefaultAddressKey: true,
      // expressArray: ['请选择', '物流托运部', '顺丰', '邮政', '圆通', '同城送货', '大巴快运', '上门自提'],
      expressArray: this.getExpressArray(),
      expressIndex: 0
    }
  },
  onShow () {
    //页面显示时，加载订单信息
    uni.getStorage({
      key: 'buylist',
      success: (ret) => {
        this.buylist = ret.data
        this.goodsPrice = 0
        //合计
        let len = this.buylist.length
        for (let i = 0; i < len; i++) {
          this.goodsPrice = this.goodsPrice + (this.buylist[i].number * this.buylist[i].price)
        }
        this.deduction = this.int / 100
        this.sumPrice = this.goodsPrice - this.deduction + this.freight
      }
    })
    uni.getStorage({
      key: 'selectAddress',
      success: (e) => {
        this.recinfo = e.data;
        uni.removeStorage({
          key: 'selectAddress'
        })
      }
    })
    // 获取地址
    this.getDefaultAddress()
  },
  onLoad () {
    // this.getExpressArray()
  },
  onHide () {

  },
  onBackPress () {
    //页面后退时候，清除订单信息
    this.clearOrder();
  },
  filters: {
    toFixed: function (x) {
      return parseFloat(x).toFixed(2);
    }
  },
  methods: {
    bindPickerChange: function (e) {
      // console.log('picker发送选择改变，携带值为', e.target.value)
      this.expressIndex = parseInt(e.target.value)
    },
    clearOrder () {
      uni.removeStorage({
        key: 'buylist',
        success: (res) => {
          this.buylist = [];
          // console.log('remove buylist success');
        }
      });
    },
    toPay () {
      if (this.expressIndex === 0) {
        uni.showToast({ title: '请选择物流方式后尝试重新提交订单', icon: 'none' })
        return
      }
      if (this.noneDefaultAddressKey) {
        uni.showToast({ title: '缺少收货地址信息,请填写收货地址后重试提交订单', icon: 'none' })
        return
      }
      //商品列表
      let paymentOrder = []
      let goodsid = []
      let len = this.buylist.length
      for (let i = 0; i < len; i++) {
        paymentOrder.push(this.buylist[i])
        goodsid.push(this.buylist[i].id)
      }
      if (paymentOrder.length == 0) {
        uni.showToast({ title: '订单信息有误，请重新购买', icon: 'none' })
        return
      }
      //本地模拟订单提交UI效果
      uni.showLoading({
        title: '正在提交订单...'
      })
      this.confirmOrder().then(resp => {
        if (!resp) {
          uni.hideLoading()
          uni.showToast({ title: '服务端出错，请联系管理员解决', icon: 'none' })
          return
        }
        for (const iterator of paymentOrder) {
          iterator.id = resp.mallOrderItemList[0].moiId
        }
        Util.setMallOrderMainSession(resp)
        uni.setStorage({
          key: 'paymentOrder',
          data: paymentOrder,
          success: () => {
            uni.hideLoading()
            uni.redirectTo({
              url: "../pay/payment/payment?amount=" + this.sumPrice
            })
          }
        })
      })
    },
    //选择收货地址
    selectAddress () {
      uni.navigateTo({
        url: '../user/address/address?type=select'
      })
    },
    getDefaultAddress () {
      if (Util.getDefaultAddress() === null) {
        return
      }
      this.recinfo = Util.getDefaultAddress()
      this.noneDefaultAddressKey = false
    },
    chooseAddress () {
      let that = this
      uni.chooseAddress({
        success: (res) => {
          that.noneDefaultAddressKey = false
          that.recinfo = res
          Util.setDefaultAddress(res)
        }
      })
    },
    confirmOrder () {
      return new Promise((resolve, reject) => {
        let params = {}
        // sumPrice
        params.orderSumPrice = this.sumPrice
        params.mallOrderItemList = this.buylist.map(item => {
          return {
            ptypeId: item.id,
            ptypePfullname: item.name,
            ptypeCover: item.img,
            price: item.price,
            totalPrice: item.price * item.number,
            quantity: item.number
          }
        })
        params.mallOrderShipping = {
          shippingType: this.expressArray[this.expressIndex].code,
          shippingName: this.expressArray[this.expressIndex].name
        }
        // 姓名地址电话填入
        params.address = this.recinfo.provinceName + this.recinfo.cityName + this.recinfo.detailInfo
        params.phoneNum = this.recinfo.telNumber
        params.userName = this.recinfo.userName
        OrderApi.confirmOrder(params).then(resp => {
          resolve(resp)
        })
      })
    },
    getExpressArray () {
      let expressArray = []
      for (const i in ENUM_SHIPPING_METHOD) {
        expressArray.push({ name: ENUM_SHIPPING_METHOD[i].name, code: ENUM_SHIPPING_METHOD[i].code })
      }
      return expressArray
    }
  }
}
</script>

<style lang="scss">
@import "./css/Confirmation";
</style>
