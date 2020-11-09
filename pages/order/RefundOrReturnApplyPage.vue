<template>
  <view>
    <view class="order">
      <view class="row"
            style="height:auto">
        <view class="uni-list-cell-left left">
          申请商品：
        </view>
        <view class="uni-list-cell-db right">
          <view class="uni-list">
            <u-checkbox-group @change="checkboxGroupChange">
              <view class="uni-list-cell uni-list-cell-pd"
                    v-for="item in items"
                    :key="item.ptypeId">
                <view style="padding-bottom:5px"
                      v-if="item.moiStatus != reTypeEnum.TEMPORALLY_NOT_SHIPPED.code">
                  <u-checkbox v-model="item.checked"
                              :name="item.moiId">
                    {{item.ptypePfullname}}
                  </u-checkbox>
                  <view style="padding-top:8px"
                        v-if="item.checked">
                    <!-- <radio-group @change="radioChange">
                      <label class="radio">
                        <input type="radio"
                               :value="reTypeEnum.REQ_RETURN.code"
                               v-model="item.moiStatus" />
                        退货
                      </label>
                      <label class="radio"
                             style="padding-left:8px">
                        <input type="radio"
                               :value="reTypeEnum.REQ_EXCHANG.code"
                               v-model="item.moiStatus" />
                        换货
                      </label>
                    </radio-group> -->
                    <view>
                      <u-radio-group v-model="item.moiStatus"
                                     @change="radioChange">
                        <view style="height:100upx" />
                        <u-radio :name="reTypeEnum.REQ_RETURN.code">
                          退货
                        </u-radio>
                        <u-radio :name="reTypeEnum.REQ_EXCHANG.code">
                          换货
                        </u-radio>
                      </u-radio-group>
                    </view>
                  </view>
                </view>
              </view>
            </u-checkbox-group>
          </view>
        </view>
      </view>
    </view>

    <!-- <view class="order">
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
    </view> -->

    <view class="order">
      <view class="row">
        <view class="left">
          备注:
        </view>
        <view class="right">
          <input placeholder="申请原因"
                 v-model="reqReason" />
        </view>
      </view>
    </view>
    <view class="blck">
    </view>
    <view class="footer">
      <view class="settlement">
        <!-- <view class="sum">合计:<view class="money">￥{{sumPrice}}</view>
        </view> -->
        <view class="btn"
              @tap="toApplyRet">提交申请</view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  ENUM_SHIPPING_METHOD,
  ENUM_RE_TYPE
} from '@/util/Constants'
import Util from '@/util/Util'
import RefundOrReturnApplyPageApi from '@/api/order/RefundOrReturnApplyPage'
export default {
  data () {
    return {
      orderPrice: 0,
      expressIndex: 0,
      expressArray: this.getExpressArray(),
      reTypeIndex: 0,
      reTypeArray: this.getReTypeArray(),
      applyRefundAmount: 0,
      reTypeEnum: this.getEnumReType(),
      expressNo: '',
      items: [],
      reqReason: '',
      momId: '',
      current: ''
    }
  },
  onShow () {

  },
  onLoad (e) {
    this.momId = e.momId
    this.items = Util.getSession('chooseMallOrderList')
    this.items.forEach(element => {
      element.checked = false
    })
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
    getEnumReType () {
      return ENUM_RE_TYPE
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
    },
    checkboxChange (e) {
      var items = this.items
      let values = e.detail.value
      for (var i = 0, lenI = items.length; i < lenI; ++i) {
        const item = items[i]
        if (values.includes(item.ptypeId)) {
          this.$set(item, 'checked', true)
        } else {
          this.$set(item, 'checked', false)
        }
      }
    },
    toApplyRet () {
      let that = this
      uni.showModal({
        title: '提示',
        content: '是否确定提交?',
        success: function (res) {
          if (res.confirm) {
            let params = {}
            params.momId = that.momId
            params.reqReason = that.reqReason
            params.reqList = []
            that.items.forEach(element => {
              if (element.checked) {
                params.reqList.push({
                  moiId: element.moiId,
                  moiStatus: element.moiStatus
                })
              }
            })
            uni.showLoading({ title: '提交中......' })
            RefundOrReturnApplyPageApi.reqExchangeOrReturn(params).then(resp => {
              // console.log(resp)
              uni.showToast({
                title: '提交成功',
                duration: 2000
              })
              uni.hideLoading()
              setTimeout(() => {
                uni.reLaunch({
                  url: '../tabBar/user/user'
                })
              }, 2000)
            })
          }
        }
      })
    },
    radioChange (e) {
      // console.log(e)
    },
    checkboxGroupChange (e) {
      e.forEach(no => {
        this.items.forEach(element => {
          if (element.moiId === no && element.moiStatus == ENUM_RE_TYPE.NORMAL.code) {
            element.moiStatus = ENUM_RE_TYPE.REQ_RETURN.code
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import "./css/RefundOrReturnApplyPage";
// @import "uview-ui/libs/css/common.scss";
@import "uview-ui/libs/css/style.mp.scss";

// @import "uview-ui/index.scss";
</style>
