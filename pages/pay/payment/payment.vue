<template>
  <view>
    <view class="block">
      <view class="content">
        <view class="orderinfo">
          <view class="row">
            <view class="nominal">订单名称:</view>
            <view class="text">{{orderName}}</view>
          </view>
          <view class="row">
            <view class="nominal">订单金额:</view>
            <view class="text">{{amount}}元</view>
          </view>
        </view>
      </view>
    </view>
    <view class="block">
      <view class="title">
        选择支付方式
      </view>
      <view class="content">
        <view class="pay-list">
          <!-- <view class="row" @tap="paytype='alipay'">
							<view class="left">
								<image src="/static/img/alipay.png"></image>
							</view>
							<view class="center">
								支付宝支付
							</view>
							<view class="right">
								<radio :checked="paytype=='alipay'" color="#f06c7a" />
							</view>
					</view> -->
          <view class="row"
                @tap="paytype='wxpay'">
            <view class="left">
              <image src="/static/img/wxpay.png"></image>
            </view>
            <view class="center">
              微信支付
            </view>
            <view class="right">
              <radio :checked="paytype=='wxpay'"
                     color="#f06c7a" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="pay">
      <view class="btn"
            @tap="doDeposit">立即支付</view>
      <view class="tis">
        点击立即支付，即代表您同意<view class="terms">
          《条款协议》
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Util from '@/util/Util'
import PaymentApi from '@/api/wxPayment/WxPayment'
export default {
  data () {
    return {
      amount: 0,
      orderName: '',
      paytype: 'wxpay',//支付类型
      payOrderInf: []
    }
  },
  onLoad (e) {
    this.amount = parseFloat(e.amount).toFixed(2);
    uni.getStorage({
      key: 'paymentOrder',
      success: (e) => {
        this.payOrderInf = e.data
        // console.log(this.payOrderInf)
        if (this.payOrderInf.length > 1) {
          this.orderName = '多商品合并支付'
        } else {
          this.orderName = this.payOrderInf[0].name
        }
        uni.removeStorage({
          key: 'paymentOrder'
        })
      }
    })
  },
  methods: {
    doDeposit () {
      //模板模拟支付，实际应用请调起微信/支付宝
      uni.showLoading({
        title: '支付中...'
      })
      let obj = Util.getMallOrderMainSession()
      let params = {
        momId: obj.momId,
        orderNo: obj.orderNo,
        orderSumPrice: obj.orderSumPrice
      }
      PaymentApi.doOrderUnifiedorder(params).then(resp => {
        // console.log(resp)\
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: resp.timeStamp,
          nonceStr: resp.nonceStr,
          package: 'prepay_id=' + resp.prepayId,
          signType: 'MD5',
          paySign: resp.paySign,
          success: function (res) {
            console.log('success:' + JSON.stringify(res));
          },
          fail: function (err) {
            console.log('fail:' + JSON.stringify(err));
          }
        });
      })
      // setTimeout(() => {
      //   uni.hideLoading();
      //   uni.showToast({
      //     title: '支付成功'
      //   });
      //   setTimeout(() => {
      //     uni.redirectTo({
      //       url: '../../pay/success/success?amount=' + this.amount
      //     });
      //   }, 300);
      // }, 700)
    }
  }
}
</script>

<style lang="scss">
@import "./css/Payment";
</style>
