<template>
  <view>
    <image class="user-bg"
           src="@/static/img/gwb-img/grzx_bg.png"></image>
    <view v-if="showHeader"
          class="status"
          :style="{position:headerPosition,top:statusTop}"></view>
    <view v-if="showHeader"
          class="header"
          :style="{position:headerPosition,top:headerTop}">
      <view class="addr"></view>
      <view class="input-box">
      </view>
      <view class="icon-btn">
        <!-- <view class="icon tongzhi"
              @tap="toMsg"></view> -->
        <view class="icon setting"
              @tap="toSetting"></view>
      </view>
    </view>
    <!-- 占位 -->
    <view v-if="showHeader"
          class="place"></view>
    <!-- 用户信息 -->
    <view class="user">
      <!-- 头像 -->
      <view class="left">
        <image mode="aspectFill"
               :src="user.face"></image>
      </view>
      <!-- 昵称,个性签名 -->
      <view class="right">
        <view class="username">{{user.username}}</view>
        <view class="signature"
              v-if="user.signature"
              @tap="toSetting">{{user.signature}}</view>
      </view>
      <!-- 二维码按钮 -->
      <view v-if="false"
            class="erweima"
            @tap="toMyQR">
        <view class="icon qr"></view>
      </view>
    </view>
    <!-- VIP banner -->
    <view v-if="false"
          class="VIP">
      <view class="img">
        <image src="/static/img/VIP.png"></image>
      </view>
      <view class="title">开通VIP会员</view>
      <view class="tis">会员特权</view>
    </view>
    <!-- 订单-余额 -->
    <view class="order">
      <!-- 订单类型 -->
      <view class="list">
        <view class="box"
              v-for="(row,index) in orderList"
              :key="index"
              @tap="toOrderList(index)">
          <view class="img">
            <view class="icon"
                  :class="row.icon"></view>
          </view>
          <view class="text">{{row.text}}</view>
        </view>
      </view>
      <!-- 余额 -->
      <view v-if="false"
            class="balance-info">
        <view class="left">
          <view class="box"
                v-if="false">
            <view class="num">{{user.integral}}</view>
            <view class="text">积分</view>
          </view>
          <view class="box"
                v-if="false">
            <view class="num">{{user.envelope}}</view>
            <view class="text">佣金</view>
          </view>
          <view class="box">
            <view class="num">{{user.balance}}</view>
            <view class="text">余额</view>
          </view>
        </view>
        <view v-if="false"
              class="right">
          <view class="box"
                @tap="toDeposit">
            <view class="img">
              <view class="icon chongzhi"></view>
            </view>
            <view class="text">充值</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 工具栏 -->
    <view class="toolbar">
      <view class="title">我的工具栏</view>
      <view class="list">
        <view class="box"
              v-for="(row,index) in mytoolbarList"
              :key="index"
              @tap="toPage(row.url)">
          <view class="img">
            <image :src="row.img"></image>
          </view>
          <view class="text">{{row.text}}</view>
        </view>
      </view>
    </view>
    <!-- 占位 -->
    <view class="place-bottom"></view>
    <account-login-modal ref="accountLoginModal"
                         @setWxUserInf="setWxUserInf" />
  </view>
</template>
<script>
import Util from '@/util/Util'
import SystemApi from '@/api/system/System'
import AccountLoginModal from '../../widgets/AccountLoginModal'
import { ENUM_STATUS } from '@/util/Constants'

export default {
  data () {
    return {
      switch2DisplayProp: false,
      isfirst: true,
      headerPosition: "fixed",
      headerTop: null,
      statusTop: null,
      showHeader: true,
      //个人信息,
      user: {
        username: '游客',
        face: '/static/img/gwb-img/default_avatar.png',
        // face: '/static/img/face.jpg',
        signature: '点击昵称以授权登录',
        integral: 0,
        balance: 0,
        envelope: 0
      },
      // 订单类型
      orderList: [
        { text: '全部订单', icon: "allOrder" },
        { text: '待付款', icon: "fukuan" },
        { text: '待发货', icon: "fahuo" },
        { text: '待收货', icon: "shouhuo" },
        // { text: '待评价', icon: "pingjia" },
        { text: '退换货', icon: "tuihuo" }
      ],
      // 工具栏列表
      mytoolbarList: [
        { url: '../../user/keep/keep', text: '我的收藏', img: '/static/img/user/point.png' },
        // { url: '../../user/coupon/coupon', text: '优惠券', img: '/static/img/user/quan.png' },
        // { url: '', text: '新客豪礼', img: '/static/img/user/renw.png' },
        // { url: '', text: '领红包', img: '/static/img/user/momey.png' },

        // { url: '../../user/address/address', text: '收货地址', img: '/static/img/user/addr.png' }
        { url: 'address', text: '收货地址', img: '/static/img/user/addr.png' }
        // { url: '', text: '账户安全', img: '/static/img/user/security.png' },
        // { url: '', text: '银行卡', img: '/static/img/user/bank.png' },
        // { url: '', text: '抽奖', img: '/static/img/user/choujiang.png' },
        // {text:'客服',img:'/static/img/user/kefu.png'},
        // {text:'签到',img:'/static/img/user/mingxi.png'}
      ]
    }
  },
  //下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
  onPullDownRefresh () {
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onPageScroll (e) {
    //兼容iOS端下拉时顶部漂移
    this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
    this.headerTop = e.scrollTop >= 0 ? null : 0;
    this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
  },
  onLoad () {
    this.statusHeight = 0
    // #ifdef APP-PLUS
    this.showHeader = false
    this.statusHeight = plus.navigator.getStatusbarHeight()

    // #endif
  },
  onReady () {
    //此处，演示,每次页面初次渲染都把登录状态重置
    if (!Util.getObtainedStatus()) {
      // 还未授权的情况
    } else {
      // 检查本地是否已经存在的用户信息
      this.getSessionUserInf()
    }
    // uni.setStorage({
    //   key: 'UserInfo',
    //   data: false,
    //   success: function () {
    //   },
    //   fail: function (e) {
    //   }
    // });
  },
  onShow () {
    //  检查用户状态
    this.checkUserInfStatus()
    // uni.getStorage({
    //   key: 'UserInfo',
    //   success: (res) => {
    //     if (!res.data) {
    //       if (this.isfirst) {
    //         //this.toLogin();
    //       }
    //       return;
    //     }
    //     this.user = res.data;
    //   },
    //   fail: (e) => {
    //     //this.toLogin();
    //   }
    // });
  },
  methods: {
    //消息列表
    toMsg () {
      uni.navigateTo({
        url: '../../msg/msg'
      })
    },
    toOrderList (index) {
      uni.setStorageSync('tbIndex', index);
      uni.navigateTo({ url: '../../user/order_list/order_list?tbIndex=' + index })
    },
    toSetting () {
      uni.navigateTo({
        url: '../../user/setting/setting'
      })
    },
    toMyQR () {
      uni.navigateTo({
        url: '../../user/myQR/myQR'
      })
    },
    toLogin () {
      // uni.showToast({ title: '请授权登录', icon: "none" });
      this.controlAccountLoginModal(true)
      // uni.navigateTo({
      //   url: '../../login/login'
      // })
      // this.isfirst = false;
    },
    isLogin () {
      //实际应用中,用户登录状态应该用token等方法去维持登录状态.
      const value = uni.getStorageSync('UserInfo');
      if (value) {
        return true;
      }
      return false
    },
    toDeposit () {
      uni.navigateTo({
        url: '../../user/deposit/deposit'
      })
    },
    toPage (url) {
      if (!url) {
        uni.showToast({ title: '模板未包含此页面', icon: "none" });
        return;
      }

      // address 不跳转 查找依赖微信
      if (url === 'address') {
        uni.chooseAddress()
      } else {
        uni.navigateTo({
          url: url
        })
      }

    },
    getSessionUserInf () {
      let obj = null
      if (Util.getCurrentUserInf()) {
        obj = Util.getCurrentUserInf()
        this.userObj(obj)
      } else {
        SystemApi.getWxUserInf().then(resp => {
          obj = resp
          Util.setCurrentUserInf(obj)
          this.userObj(obj)
        })
      }
    },
    userObj (obj) {
      this.user.username = obj.nickname
      this.user.face = obj.avatar
      this.user.signature = false
    },
    controlAccountLoginModal (bool) {
      if (bool) {
        this.$refs['accountLoginModal'].openModal()
      } else {
        this.$refs['accountLoginModal'].closeModal()
      }
    },
    setWxUserInf (obj) {
      let tempObj = {
        nickname: obj.nickName,
        avatar: obj.avatarUrl
      }
      this.userObj(tempObj)
    },
    checkUserInfStatus () {
      if (ENUM_STATUS.NOT_OBTAINED.code === Util.getCurrentUserInf().status.trim()) {
        this.$refs['accountLoginModal'].openModal(true)
        return false
      }
      return true
    }
  },
  components: {
    AccountLoginModal
  }
}
</script>
<style lang="scss">
@import "css/User";
</style>
