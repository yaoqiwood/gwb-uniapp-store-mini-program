<template>
  <view>
    <!-- 明细 -->
    <view class="detail">
      <view class="row">
        <view class="nominal">
          订单金额
        </view>
        <view class="content">
          ￥{{orderPrice}}
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
    </view>
    <view class="order">
      <view class="row">
        <view class="uni-list-cell-left left">
          申请方式：
        </view>
        <view class="uni-list-cell-db right">
          <!-- @change="bindPickerChange" -->
          <!-- :range-key="index" -->
          <picker :value="reTypeIndex"
                  :range="reTypeArray"
                  range-key="name"
                  mode="selector"
                  @change="bindRePickerChange">
            <view style="text-align:right">{{reTypeArray[reTypeIndex].name}}</view>
          </picker>
        </view>
      </view>
    </view>
    <view class="order">
      <view class="row">
        <view class="uni-list-cell-left left">
          回寄物流：
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
    <view class="order">
      <view class="row">
        <view class="left">
          物流号码 :
        </view>
        <view class="right"
              style="width:69%">
          <input placeholder="认真填写,以便我们审核您的退款信息"
                 v-model="expressNo" />
        </view>
      </view>
    </view>
    <!-- 提示-备注 -->
    <view class="order">
      <view class="row">
        <view class="left">
          申请退款金额 :
        </view>
        <view class="right">
          <!-- @blur="onMoneyBlur" -->
          <input placeholder="必填"
                 type="digit"
                 @blur="onMoneyBlur"
                 v-model="applyRefundAmount" />
        </view>
      </view>
    </view>
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
    <view class="blck">
    </view>
    <view class="footer">
      <view class="settlement">
        <view class="sum">合计:<view class="money">￥{{sumPrice}}</view>
        </view>
        <view class="btn"
              @tap="toPay">提交申请</view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  ENUM_SHIPPING_METHOD,
  ENUM_RE_TYPE
} from '@/util/Constants'
export default {
  data () {
    return {
      orderPrice: 0,
      expressIndex: 0,
      expressArray: this.getExpressArray(),
      reTypeIndex: 0,
      reTypeArray: this.getReTypeArray(),
      applyRefundAmount: 0,
      expressNo: ''
    }
  },
  onShow () {

  },
  onLoad () {
    // this.getExpressArray()
  },
  onHide () {

  },
  onBackPress () {

  },
  filters: {

  },
  methods: {
    getExpressArray () {
      let expressArray = []
      for (const i in ENUM_SHIPPING_METHOD) {
        expressArray.push({ name: ENUM_SHIPPING_METHOD[i].name, code: ENUM_SHIPPING_METHOD[i].code })
      }
      return expressArray
    },
    getReTypeArray () {
      let reTypeArray = []
      for (const i in ENUM_RE_TYPE) {
        if (i != 'getName') {
          reTypeArray.push({ name: ENUM_RE_TYPE[i].name, code: ENUM_RE_TYPE[i].code })
        }
      }
      return reTypeArray
    },
    bindPickerChange: function (e) {
      // console.log('picker发送选择改变，携带值为', e.target.value)
      this.expressIndex = parseInt(e.target.value)
    },
    bindRePickerChange (e) {
      this.reTypeIndex = parseInt(e.target.value)
    },
    onMoneyBlur (e) {
      this.applyRefundAmount = parseFloat(this.applyRefundAmount).toFixed(2)
      if ('NaN' == this.applyRefundAmount) {
        this.applyRefundAmount = 0
      }
    }
    // onMoneyChange (e) {
    //   this.applyRefundAmount = parseFloat(this.applyRefundAmount).toFixed(2)
    //   console.log(this.applyRefundAmount)
    // }
  }
}
</script>

<style lang="scss">
@import "./css/RefundOrReturnPage";
</style>
