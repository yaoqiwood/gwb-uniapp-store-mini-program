<template>
  <view>
    <view class="block">
      <view class="content">
        <view class="orderinfo">
          <view class="row"
                style="align-items: center">
            <text>
              订单已提交,请在时间 <text style="color:#FF4D4D">{{leftTimeText}}</text> 内完成支付,逾时未支付将关闭订单
            </text>
          </view>
        </view>
      </view>
    </view>
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
import OrderApi from '@/api/order/main/OrderMain'
export default {
  data () {
    return {
      amount: 0,
      orderName: '',
      paytype: 'wxpay',//支付类型
      payOrderInf: [],
      leftTimeText: ''
    }
  },
  onLoad (e) {
    this.amount = parseFloat(e.amount).toFixed(2);
    uni.getStorage({
      key: 'paymentOrder',
      success: (e) => {
        this.payOrderInf = e.data
        // console.log(e.data)
        if (this.payOrderInf.length > 1) {
          this.orderName = '多商品合并支付'
        } else {
          this.orderName = this.payOrderInf[0].name
        }
        uni.removeStorage({
          key: 'paymentOrder'
        })
        uni.getStorage({
          key: 'mallOrderMain',
          success: (e) => {
            this.queryByItemNum(this.payOrderInf[0].id).then(resp => {
              let desTime = new Date(resp.createTime)
              // desTime = desTime.getTime() + 3600 * 1000
              desTime = desTime.getTime() + 1800 * 1000
              // console.log(desTime)
              // desTime = moment(desTime).format('YYYY-MM-DD HH:mm:ss')
              this.clock(desTime)
            })
          }
        })
      }
    })

  },
  methods: {
    doDeposit () {
      let that = this
      //模板模拟支付，实际应用请调起微信/支付宝
      uni.showLoading({
        title: '支付中...'
      })
      let obj = Util.getMallOrderMainSession()
      let params = {
        momId: obj.momId,
        orderNo: obj.orderNo,
        orderSumPrice: parseFloat(obj.orderSumPrice).toFixed(2)
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
            // console.log('success:' + JSON.stringify(res));
            uni.showLoading({
              title: '正在等待返回订单支付结果'
            })
            that.checkOrderMainPaidStatus(3000, params)
          },
          fail: function (err) {
            console.log('fail:' + JSON.stringify(err));
          }
        })
      })
    },
    /**
     * 轮询查当前是否支付成功,若没成功则double时间询问
     */
    checkOrderMainPaidStatus (timeOut, params) {
      let that = this
      uni.showLoading({
        title: '等待支付结果'
      })
      setTimeout(() => {
        OrderApi.checkOrderMainPaidStatus(params.orderNo).then(resp => {
          if (!resp.payStatus) {
            that.checkOrderMainPaidStatus(timeOut * 2, params)
            return
          }
          uni.hideLoading()
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.redirectTo({
              url: "../success/success?amount=" + params.orderSumPrice
            })
          }, 200)
        })
      }, timeOut)
    },
    queryByItemNum (id) {
      return new Promise((resolve, reject) => {
        OrderApi.queryByItemNum(id).then(resp => {
          resolve(resp)
        })
      })
    },
    clock (desDateTime) {
      let that = this
      let interval = setInterval(() => {
        var today = new Date() //当前时间
        let h = today.getHours()
        let m = today.getMinutes()
        let s = today.getSeconds()
        var stopTime = new Date(desDateTime)//结束时间
        let stopH = stopTime.getHours()
        let stopM = stopTime.getMinutes()
        let stopS = stopTime.getSeconds()
        var timeLeft = stopTime.getTime() - today.getTime() //倒计时毫秒数
        let timeLeftD = parseInt(timeLeft / (60 * 60 * 24 * 1000)) //转换为天

        let D = parseInt(timeLeft) - parseInt(timeLeftD * 60 * 60 * 24 * 1000) //除去天的毫秒数
        let timeLeftH = parseInt(D / (60 * 60 * 1000)) //除去天的毫秒数转换成小时
        let H = D - timeLeftH * 60 * 60 * 1000 //除去天、小时的毫秒数
        let timeLeftM = parseInt(H / (60 * 1000)) //除去天的毫秒数转换成分钟z
        let M = H - timeLeftM * 60 * 1000 //除去天、小时、分的毫秒数

        let S = parseInt((timeLeft - timeLeftD * 60 * 60 * 24 * 1000 - timeLeftH * 60 * 60 * 1000 - timeLeftM * 60 * 1000) / 1000) //除去天、小时、分的毫秒数转化为秒
        if (timeLeftM <= 0 && S <= 0) {
          that.leftTimeText = (0 + "分" + 0 + "秒")
          clearInterval(interval)
          uni.reLaunch({
            url: '../../tabBar/home/home'
          })
          return
        }
        // timeLeftD + "天" + timeLeftH + "小时" +
        that.leftTimeText = (timeLeftM + "分" + S + "秒")
      }, 500)
      // let that = this
      // setTimeout("clock()",500);
      // setTimeout(that.clock(desDateTime), 500)
    }

  }
}
</script>

<style lang="scss">
@import "./css/Payment";
</style>
