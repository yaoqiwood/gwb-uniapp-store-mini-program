<template>
  <view>
    <view class="order">
      <view class="row">
        <view class="uni-list-cell-left left">
          订单状态：
        </view>
        <view class="uni-list-cell-db right">
          {{orderInf.viewStatus}}
        </view>
      </view>
    </view>
    <view class="order"
          v-if="orderInf.status == ORDER_STATUS.RETURN.code">
      <view class="row"
            style="height:auto;font-size:12px">
        商家剩余处理售后申请时间：
        <view>
          <u-count-down :timestamp="countDownTimeStamp"
                        separator="zh"
                        :show-days="true"
                        :show-hours="true" />
        </view>
      </view>
    </view>
    <view class="order"
          v-if="orderInf.status == ORDER_STATUS.AGREE_TO_REFUND.code">
      <view class="row">
        <view class="uni-list-cell-left left"
              style="height:auto;font-size:12px">
          商家已经同意您的<span style="color:red">售后申请</span> ,
          请在<span style="color:red">规定时间</span>内填写您的<span style="color:red">售后信息</span>,否则将
          <span style="color:red">撤销售后申请</span>：
        </view>
      </view>
      <view class="row"
            style="font-size:13px;padding-top:10px">
        剩余时间：
        <u-count-down :timestamp="countDownReturnTimeStamp"
                      separator="zh"
                      :show-days="true"
                      :show-hours="true" />
      </view>
      <view class="row"
            style="height:auto">
        <view style="height:auto;font-size:12px">
          <br />
          请按照以下信息回寄退回货物<br />
          <view style="padding-bottom:5px" />
          姓名：{{retInf.returnPersonName}}<br />
          联系电话：{{retInf.returnPersonPhone}}</br>
          回寄收货地址：{{retInf.returnAddress}}
        </view>
      </view>
      <view class="row">
        <view class="uni-list-cell-left left">
          <span style="color:red">*</span>回退物流：
        </view>
        <view class="uni-list-cell-db right">
          <u-input v-model="shippingType"
                   placeholder="请选择回寄方式："
                   @click="shippingShow = true"
                   :height="5"
                   type="select" />
        </view>
      </view>
      <view class="row">
        <view class="uni-list-cell-left left"
              style="line-height:23px">
          <span style="color:red">*</span>物流号码：
        </view>
        <view class="uni-list-cell-db right">
          <u-input v-model="shippingNo"
                   placeholder="请输入物流编号或者车牌号"
                   :height="5" />
        </view>
      </view>
      <view class="row"
            style="height:auto">
        <view class="uni-list-cell-left left"
              style="line-height:100px">
          <span style="color:red">*</span>照片：
        </view>
        <view class="uni-list-cell-db right">
          <u-upload ref="uUpload"
                    :action="uploadAction"
                    name="file"
                    :max-size="8388608"
                    :show-progress="true"
                    :max-count="5"
                    @on-list-change="onListChange"
                    @on-uploaded="onImgSuccess"
                    style="position:relative;left:20px"
                    :auto-upload="false"
                    :header="headerObj" />
        </view>
      </view>
      <view v-if="orderInf.status == ORDER_STATUS.AGREE_TO_REFUND.code"
            style="height:100upx;width:100%" />
      <view class="fixed-bottom-block"
            v-if="orderInf.status == ORDER_STATUS.AGREE_TO_REFUND.code">
        <view class="handle-btn"
              @tap="openConfirmModal"
              v-if="!submitingShow">提交</view>
        <view class="handle-btn"
              style="background-color:#999999"
              v-else>提交中...</view>
      </view>
      <u-toast ref="uToast" />
      <u-picker mode="selector"
                v-model="shippingShow"
                :default-selector="[0]"
                :range="shippingTypeArray"
                range-key="name"
                @confirm="shippingConfirm" />
    </view>
    <u-modal v-model="showConfirmModal"
             :content="content"
             :show-cancel-button="true"
             @confirm="submitForm"></u-modal>
  </view>
</template>

<script>
import Util from '@/util/Util'
import { ENUM_ORDER_STAUTS, ENUM_SHIPPING_METHOD } from '@/util/Constants'
import SystemApi from '@/api/system/System'
import AfterSaleReviewApi from '@/api/afterSaleReview/AfterSaleReview'
export default {
  data: () => {
    return {
      orderInf: {
        status: '',
        viewStatus: '加载中...'
      },
      retInf: {
        returnPersonName: '',
        returnPersonPhone: '',
        returnAddress: ''
      },
      countDownTimeStamp: 0,
      countDownReturnTimeStamp: 0,
      ORDER_STATUS: ENUM_ORDER_STAUTS,
      shippingTypeArray: [],
      shippingMethods: [],
      form: {},
      shippingShow: false,
      shippingType: '',
      shippingTypeValue: '',
      shippingNo: '',
      uploadAction: SystemApi.minioUploadAction,
      photoList: [],
      headerObj: { 'X-Access-Token': Util.getToken() },
      uploadList: [],
      showConfirmModal: false,
      content: '确认要提交?',
      submitingShow: false
    }
  },
  onLoad (option) {
    this.initAllData()
    this.getOrderInf()
    this.getRetAddressInf()
  },
  methods: {
    initAllData () {
      this.shippingTypeArray = this.getEnumShippingArray()
    },
    getOrderInf () {
      let orderSession = Util.getSelectMallOrderMainSession()
      ENUM_ORDER_STAUTS.RETURN.name = '申请售后'
      this.findMallMainAfterSaleDtoByOrderNo(orderSession.orderNo)
    },
    getOrderStatusName (status) {
      return ENUM_ORDER_STAUTS.getName(status)
    },
    findMallMainAfterSaleDtoByOrderNo (orderNo) {
      uni.showLoading({ title: '加载中...' })
      AfterSaleReviewApi.findMallMainAfterSaleDtoByOrderNo(orderNo).then(resp => {
        this.orderInf = resp.mallOrderMain
        this.orderInf.viewStatus = ENUM_ORDER_STAUTS.getName(parseInt(this.orderInf.status))
        // let timeStamp = Date.parse(new Date(resp.mallOrderMain.returnReqTime))
        // timeStamp = timeStamp + (2 * 24 * 3600 * 1000)
        // let nowStamp = Date.parse(new Date())
        // this.countDownTimeStamp = (timeStamp - nowStamp) / 1000
        this.countDownTimeStamp = this.countDownParseTimeStamp(resp.mallOrderMain.returnReqTime, 2)
        this.countDownReturnTimeStamp = this.countDownParseTimeStamp(resp.mallOrderMain.confirmReturnTime, 7)
        uni.hideLoading()
      })
    },
    countDownParseTimeStamp (time, day) {
      let timeStamp = Date.parse(new Date(time))
      timeStamp = timeStamp + (day * 24 * 3600 * 1000)
      let nowStamp = Date.parse(new Date())
      return (timeStamp - nowStamp) / 1000
    },
    getEnumShippingArray () {
      let array = []
      let i = 0
      for (const key in ENUM_SHIPPING_METHOD) {
        if (ENUM_SHIPPING_METHOD[key] != 'getName') {
          array.push({ name: ENUM_SHIPPING_METHOD[key].name, code: ENUM_SHIPPING_METHOD[key].code, id: i })
        }
        i++
      }
      return array
    },
    shippingConfirm (val) {
      this.shippingType = this.shippingTypeArray[val[0]].name
      this.shippingTypeValue = this.shippingTypeArray[val[0]].code
    },
    submitForm () {
      this.$refs['uUpload'].upload()
    },
    onListChange (lists, name) {
      this.photoList = lists
    },
    getRetAddressInf () {
      AfterSaleReviewApi.getRetAddressInf().then(resp => {
        this.retInf.returnPersonName = resp.returnPersonName
        this.retInf.returnPersonPhone = resp.returnPersonPhone
        this.retInf.returnAddress = resp.returnAddress
      })
    },
    onImgSuccess (lists, name) {
      this.submitingShow = true
      this.uploadList = lists
      let params = {}
      params.mallOrderMainInf = {
        returnExpressType: this.shippingTypeValue,
        returnExpressId: this.shippingNo,
        momId: this.orderInf.momId
      }
      params.retPhotoList = []
      // console.log(lists)
      lists.forEach(element => {
        let obj = element.response.result
        obj.annexType = ''
        obj.storagePath = ''
        params.retPhotoList.push(obj)
      })
      uni.showLoading({
        title: '提交中...',
        mask: true
      })
      AfterSaleReviewApi.userRetGoodsInfEnter(params).then(resp => {
        if (resp === null) {
          this.$refs['uToast'].show({
            title: '提交失败',
            type: 'error'
          })
          uni.hideLoading()
          this.submitingShow = false
          return
        }
        this.$refs['uToast'].show({
          title: '提交成功 2秒后跳转',
          type: 'success'
        })
        setTimeout(() => {
          uni.navigateTo({
            url: '../user/order_list/order_list'
          })
        }, 2000)
      })
    },
    openConfirmModal () {
      if (this.shippingTypeValue == '' || this.shippingTypeValue == null) {
        this.$refs.uToast.show({
          title: '请选择物流方式',
          type: 'warning'
        })
        return
      }
      if (this.shippingNo == '' || this.shippingNo == null) {
        this.$refs.uToast.show({
          title: '请填写物流号码',
          type: 'warning'
        })
        return
      }
      if (this.photoList.length === 0) {
        this.$refs.uToast.show({
          title: '请添加照片',
          type: 'warning'
        })
        return
      }
      this.showConfirmModal = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./css/AfterSaleReview";
@import "uview-ui/libs/css/style.mp.scss";
</style>