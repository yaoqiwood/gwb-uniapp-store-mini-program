<template>
  <view>
    <view class="status"
          :style="{ opacity: afterHeaderOpacity }"></view>
    <view class="header">
      <!-- 头部-默认显示 -->
      <view class="before"
            :style="{ opacity: 1 - afterHeaderOpacity, zIndex: beforeHeaderzIndex }">
        <view class="back">
          <view class="icon xiangqian"
                @tap="back"
                v-if="showBack"></view>
        </view>
        <view class="middle"></view>
        <!-- <view class="icon-btn">
          <view class="icon tongzhi"
                @tap="toMsg"></view>
          <view class="icon cart"
                @tap="joinCart"></view>
        </view> -->
      </view>
      <!-- 头部-滚动渐变显示 -->
      <view class="after"
            :style="{ opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex }">
        <view class="back">
          <view class="icon xiangqian"
                @tap="back"
                v-if="showBack"></view>
        </view>
        <view class="middle">
          <view v-if="false"
                v-for="(anchor,index) in anchorlist"
                :class="[selectAnchor==index ?'on':'']"
                :key="index"
                @tap="toAnchor(index)">{{anchor.name}}</view>
        </view>
        <view class="icon-btn">
          <view class="icon tongzhi"
                @tap="toMsg"></view>
          <view class="icon cart"
                @tap="joinCart"></view>
        </view>
      </view>
    </view>
    <!-- 底部菜单 -->
    <view class="footer">
      <view class="icons">
        <view class="box"
              @tap="share">
          <view class="icon fenxiang"></view>
          <view class="text">分享</view>
        </view>
        <view class="box"
              @tap="toChat">
          <view class="icon kefu"></view>
          <view class="text">客服</view>
        </view>
        <view class="box"
              @tap="keep">
          <view class="icon"
                :class="[isKeep?'shoucangsel':'shoucang']"></view>
          <view class="text">{{isKeep?'已':''}}收藏</view>
        </view>
      </view>
      <view class="btn">
        <view class="joinCart"
              @tap="joinCart">加入购物车</view>
        <view class="buy"
              @tap="buy">立即购买</view>
      </view>
    </view>
    <!-- share弹窗 -->
    <view class="share"
          :class="shareClass"
          @touchmove.stop.prevent="discard"
          @tap="hideShare">
      <view class="mask"></view>
      <view class="layer"
            @tap.stop="discard">
        <view class="h1">分享</view>
        <view class="list">
          <view class="box">
            <image src="../../static/img/share/wx.png"></image>
            <view class="title">
              微信好友
            </view>
          </view>
          <view class="box">
            <image src="../../static/img/share/pyq.png"></image>
            <view class="title">
              朋友圈
            </view>
          </view>
          <view class="box">
            <image src="../../static/img/share/wb.png"></image>
            <view class="title">
              新浪微博
            </view>
          </view>
          <view class="box">
            <image src="../../static/img/share/qq.png"></image>
            <view class="title">
              QQ
            </view>
          </view>
        </view>
        <view class="btn"
              @tap="hideShare">
          取消
        </view>
      </view>

    </view>
    <!-- 服务-模态层弹窗 -->
    <view class="popup service"
          :class="serviceClass"
          @touchmove.stop.prevent="discard"
          @tap="hideService">
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer"
            @tap.stop="discard">
        <view class="content">
          <view class="row"
                v-for="(item,index) in goodsData.service"
                :key="index">
            <view class="title">{{item.name}}</view>
            <view class="description">{{item.description}}</view>
          </view>
        </view>
        <view class="btn">
          <view class="button"
                @tap="hideService">完成</view>
        </view>
      </view>
    </view>
    <!-- 规格-模态层弹窗 -->
    <view class="popup spec"
          :class="specClass"
          @touchmove.stop.prevent="discard"
          @tap="hidePop()">
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer"
            @tap.stop="discard">
        <view class="content">
          <view class="title"
                v-if="false">选择规格：</view>
          <view class="sp">
            <view v-for="(item,index) in goodsData.spec"
                  :class="[index==selectSpec?'on':'']"
                  @tap="setSelectSpec(index)"
                  :key="index">{{item}}</view>
          </view>
          <view class="length">
            <view class="text">数量</view>
            <view class="number">
              <view class="sub"
                    @tap.stop="sub">
                <view class="icon jian"></view>
              </view>
              <view class="input"
                    @tap.stop="discard">
                <input type="number"
                       v-model="goodsData.number" />
              </view>
              <view class="add"
                    @tap.stop="add">
                <view class="icon jia"></view>
              </view>
            </view>
          </view>
        </view>
        <view class="btn">
          <view class="button"
                v-if="checkCartEnum(confirmType)"
                @tap="hideSpec">完成</view>
          <view class="button"
                v-else
                @tap="tapToBuy">完成</view>
        </view>
      </view>
    </view>
    <!-- 商品主图轮播 -->
    <view class="swiper-box">
      <swiper circular="true"
              autoplay="true"
              @change="swiperChange">
        <swiper-item v-for="swiper in swiperList"
                     :key="swiper.saciId">
          <image :src="getMinioImg(swiper.storagePath,swiper.newAnnexName)"></image>
        </swiper-item>
      </swiper>
      <view class="indicator">{{currentSwiper+1}}/{{swiperList.length}}</view>
    </view>
    <!-- 标题 价格 -->
    <view class="info-box goods-info">
      <view class="price">￥{{goodsData.price}}</view>
      <view class="title">
        {{goodsData.name}}
      </view>
    </view>
    <!-- 服务-规则选择 -->
    <view class="info-box spec">
      <view class="row"
            @tap="showService">
        <view class="text">服务</view>
        <view class="content">
          <view class="serviceitem"
                v-for="(item,index) in goodsData.service"
                :key="index">{{item.name}}</view>
        </view>
        <view class="arrow">
          <view class="icon xiangyou"></view>
        </view>
      </view>
      <view class="row"
            @tap="showSpec(false)"
            v-if="false">
        <view class="text">选择</view>
        <view class="content">
          <view>选择规格：</view>
          <view class="sp">
            <view v-for="(item,index) in goodsData.spec"
                  :key="index"
                  :class="[index==selectSpec?'on':'']">{{item}}</view>
          </view>
        </view>
        <view class="arrow">
          <view class="icon xiangyou"></view>
        </view>
      </view>
    </view>
    <!-- 评价 -->
    <view v-if="false"
          class="info-box comments"
          id="comments">
      <view class="row">
        <view class="text">商品评价({{goodsData.comment.number}})</view>
        <view class="arrow"
              @tap="toRatings">
          <view class="show"
                @tap="showComments(goodsData.id)">
            查看全部
            <view class="icon xiangyou"></view>
          </view>
        </view>
      </view>
      <view class="comment"
            @tap="toRatings">
        <view class="user-info">
          <view class="face">
            <image :src="goodsData.comment.userface"></image>
          </view>
          <view class="username">{{goodsData.comment.username}}</view>
        </view>
        <view class="content">
          {{goodsData.comment.content}}
        </view>
      </view>
    </view>
    <!-- 详情 -->
    <view class="description">
      <view class="title">———— 商品详情 ————</view>
      <!-- {{enumWxUserRoleType.STAFF.code}} -->
      <view style="background-color:white;"
            v-if="userInfObj.role == enumWxUserRoleType.STAFF.code">
        <view style="display:flex; justify-content:center">
          <u-upload ref="uUpload"
                    :action="uploadAction"
                    name="file"
                    :max-size="8388608"
                    :show-progress="true"
                    :max-count="5"
                    @on-list-change="onListChange"
                    @on-uploaded="onImgSuccess"
                    :auto-upload="false"
                    :header="headerObj" />
        </view>
        <view style="display:flex;justify-content:center"
              v-if="photoList.length > 0">
          <u-button type="success"
                    @click="uploadPhotos"
                    size="medium">上传照片</u-button>
        </view>
      </view>
      <view class="content">
        <rich-text :nodes="descriptionStr"></rich-text>
      </view>
      <view class="holdPlace" />
    </view>
    <wx-user-phone-modal ref="wxUserPhoneModal" />
    <u-modal v-model="showConfirmModal"
             content="是否要进行照片上传"
             :show-cancel-button="true"
             @confirm="submitForm"></u-modal>
    <u-toast ref="uToast" />
  </view>
</template> 

<script>
import WxUserPhoneModal from '@/pages/widgets/WxUserPhoneModal'
import GoodsApi from '@/api/goods/Goods'
import MinioApi from '@/api/system/System'
import SystemApi from '@/api/system/System'
import PtypeApi from '@/api/ptype/PtypeApi'
import MallFavoritesApi from '@/api/favorites/MallFavorites'
import Util from '@/util/Util'
import { ENUM_CONFIRM_TYPE, ENUM_STATUS, ENUM_WX_USER_ROLE_TYPE } from '@/util/Constants'
export default {
  components: { WxUserPhoneModal },
  data () {
    return {
      //控制渐变标题栏的参数
      beforeHeaderzIndex: 11,//层级
      afterHeaderzIndex: 10,//层级
      beforeHeaderOpacity: 1,//不透明度
      afterHeaderOpacity: 0,//不透明度
      //是否显示返回按钮
      // #ifndef MP
      showBack: true,
      // #endif
      //轮播主图数据
      swiperList: [
        // { id: 1, img: 'https://ae01.alicdn.com/kf/HTB1Mj7iTmzqK1RjSZFjq6zlCFXaP.jpg' },
        // { id: 2, img: 'https://ae01.alicdn.com/kf/HTB1fbseTmzqK1RjSZFLq6An2XXaL.jpg' },
        // { id: 3, img: 'https://ae01.alicdn.com/kf/HTB1dPUMThnaK1RjSZFtq6zC2VXa0.jpg' },
        // { id: 4, img: 'https://ae01.alicdn.com/kf/HTB1OHZrTXzqK1RjSZFvq6AB7VXaw.jpg' }
      ],
      //轮播图下标
      currentSwiper: 0,
      anchorlist: [],//导航条锚点
      selectAnchor: 0,//选中锚点
      serviceClass: '',//服务弹窗css类，控制开关动画
      specClass: '',//规格弹窗css类，控制开关动画
      shareClass: '',//分享弹窗css类，控制开关动画
      // 商品信息
      goodsData: {
        id: '',
        name: "",
        price: "",
        number: 1,
        service: [
          { name: "正品保证", description: "此商品官方保证为正品" },
          { name: "极速退款", description: "此商品享受退货极速退款服务" },
          { name: "7天退换", description: "此商品享受7天无理由退换服务" }
        ],
        spec: [],
        comment: {}
      },
      selectSpec: null,//选中规格
      isKeep: false,//收藏
      ptypeId: '',
      //商品描述html
      // descriptionStr: '<div style="text-align:center;"><img width="100%" src="https://ae01.alicdn.com/kf/HTB1t0fUl_Zmx1VjSZFGq6yx2XXa5.jpg"/><img width="100%" src="https://ae01.alicdn.com/kf/HTB1LzkjThTpK1RjSZFKq6y2wXXaT.jpg"/><img width="100%" src="https://ae01.alicdn.com/kf/HTB18dkiTbvpK1RjSZPiq6zmwXXa8.jpg"/></div>'
      descriptionStr: '',
      confirmType: ENUM_CONFIRM_TYPE.CART.code,
      userInfObj: Util.getCurrentUserInf(),
      enumWxUserRoleType: ENUM_WX_USER_ROLE_TYPE,
      uploadAction: SystemApi.minioUploadAction,
      photoList: [],
      headerObj: { 'X-Access-Token': Util.getToken() },
      showConfirmModal: false
    }
  },
  onLoad (option) {
    // #ifdef MP
    //小程序隐藏返回按钮
    this.showBack = false;
    this.ptypeId = option.ptypeId
    this.selectPtypeById(option.ptypeId)
    this.checkPhoneNum()
    // console.log(this.ptypeId)
    // #endif
    //option为object类型，会序列化上个页面传递的参数
    // console.log(option.cid); //打印出上个页面传递的参数。
  },
  onUnload () {
    this.addOrCancelFavoritesItem()
  },
  onReady () {
    // this.calcAnchor();//计算锚点高度，页面数据是ajax加载时，请把此行放在数据渲染完成事件中执行以保证高度计算正确
  },
  onPageScroll (e) {
    //锚点切换
    // this.selectAnchor = e.scrollTop >= this.anchorlist[2].top ? 2 : e.scrollTop >= this.anchorlist[1].top ? 1 : 0;
    // //导航栏渐变
    // let tmpY = 375;
    // e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
    // this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
    // this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
    // //切换层级
    // this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
    // this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
  },
  //上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
  onReachBottom () {
    // uni.showToast({ title: '触发上拉加载' });
  },
  mounted () {

  },
  methods: {
    //轮播图指示器
    swiperChange (event) {
      this.currentSwiper = event.detail.current;
    },
    //消息列表
    toMsg () {
      uni.navigateTo({
        url: '../msg/msg'
      })
    },
    // 客服
    toChat () {
      uni.navigateTo({
        url: "../msg/chat/chat?name=客服008"
      })
    },
    // 分享
    share () {
      this.shareClass = 'show';
    },
    hideShare () {
      this.shareClass = 'hide';
      setTimeout(() => {
        this.shareClass = 'none';
      }, 150);
    },
    //收藏
    keep () {
      this.isKeep = this.isKeep ? false : true;
    },
    // 加入购物车
    joinCart () {
      this.confirmType = ENUM_CONFIRM_TYPE.CART.code
      if (this.selectSpec == null) {
        return this.showSpec(() => {
          uni.showToast({ title: "已加入购物车" });
        });
      }
      uni.showToast({ title: "已加入购物车" });
    },
    //立即购买
    buy () {
      this.confirmType = ENUM_CONFIRM_TYPE.BUY.code
      if (this.selectSpec == null) {
        return this.showSpec(() => {
          this.toConfirmation()
        })
      }
      this.toConfirmation()
    },
    //商品评论
    toRatings () {
      uni.navigateTo({
        url: 'ratings/ratings'
      })
    },
    //跳转确认订单页面
    toConfirmation () {
      // if (!Util.getCurrentUserInf().phoneNum) {
      //   this.$refs['wxUserPhoneModal'].openModal()
      //   this.hidePop()
      //   return
      // }
      let tmpList = [];
      let swiper = this.swiperList[0]
      // console.log(this.goodsData.id)
      let goods = { id: this.goodsData.id, img: this.getMinioImg(swiper.storagePath, swiper.newAnnexName), name: this.goodsData.name, price: this.goodsData.price, number: this.goodsData.number };
      tmpList.push(goods)
      uni.setStorage({
        key: 'buylist',
        data: tmpList,
        success: () => {
          uni.navigateTo({
            url: '../order/confirmation'
          })
        }
      })
    },
    //跳转评论列表
    showComments (goodsid) {

    },
    //选择规格
    setSelectSpec (index) {
      this.selectSpec = index;
    },
    //减少数量
    sub () {
      if (this.goodsData.number <= 1) {
        return;
      }
      this.goodsData.number--;
    },
    //增加数量
    add () {
      this.goodsData.number++;
    },
    //跳转锚点
    // toAnchor (index) {
    //   this.selectAnchor = index;
    //   uni.pageScrollTo({ scrollTop: this.anchorlist[index].top, duration: 200 });
    // },
    //计算锚点高度
    calcAnchor () {
      this.anchorlist = [
        { name: '主图', top: 0 },
        { name: '详情', top: 0 }
      ]
      let commentsView = uni.createSelectorQuery().select("#comments");
      commentsView.boundingClientRect((data) => {
        let statusbarHeight = 0;
        //APP内还要计算状态栏高度
        // #ifdef APP-PLUS
        statusbarHeight = plus.navigator.getStatusbarHeight()
        // #endif
        let headerHeight = uni.upx2px(100);
        this.anchorlist[1].top = data.top - headerHeight - statusbarHeight;
        this.anchorlist[2].top = data.bottom - headerHeight - statusbarHeight;

      }).exec()
    },
    //返回上一页
    back () {
      uni.navigateBack();
    },
    //服务弹窗
    showService () {
      // console.log('show');
      this.serviceClass = 'show';
    },
    //关闭服务弹窗
    hideService () {
      this.serviceClass = 'hide';
      setTimeout(() => {
        this.serviceClass = 'none';
      }, 200);
    },
    //规格弹窗
    showSpec (fun) {
      // console.log('show');
      this.specClass = 'show';
      this.specCallback = fun;
    },
    specCallback () {
      return;
    },
    hidePop () {
      this.specClass = 'hide'
      //回调
      this.selectSpec && this.specCallback && this.specCallback();
      this.specCallback = false
      setTimeout(() => {
        this.specClass = 'none'
      }, 200)
    },
    //关闭规格弹窗
    hideSpec () {
      this.specClass = 'hide';
      //回调
      this.selectSpec && this.specCallback && this.specCallback();
      this.specCallback = false;
      setTimeout(() => {
        this.specClass = 'none';
      }, 200);

      let sw = true
      let repeatJSON = Util.getShoppingCartInf()
      // 检测是否超过
      if (repeatJSON.length >= 100) {
        uni.showToast({
          title: "购物不可以种类超过100",
          icon: "none"
        })
        return
      }
      // console.log(repeatJSON)
      repeatJSON.forEach(element => {
        if (element.id == this.goodsData.id) {
          element.number += this.goodsData.number
          sw = false
        }
      })
      if (sw) {
        repeatJSON.push(this.goodsData)
      }
      Util.setShopingCartInf(repeatJSON)
      uni.showToast({
        title: '添加购物车成功',
        duration: 1000
      })
    },
    discard () {
      //丢弃
    },
    selectPtypeById (ptypeId) {
      let that = this
      GoodsApi.selectPtypeById({ "ptypeId": ptypeId }).then(resp => {
        this.swiperList = resp.swipeAnnexConfigInfoList
        let storagePath = resp.swipeAnnexConfigInfoList[0].storagePath
        let newName = resp.swipeAnnexConfigInfoList[0].newAnnexName
        let json = {
          id: resp.ptypeid,
          name: resp.pfullname,
          price: resp.price,
          service: [
            { name: "正品保证", description: "此商品官方保证为正品" },
            { name: "极速退款", description: "此商品享受退货极速退款服务" },
            { name: "7天退换", description: "此商品享受7天无理由退换服务" }
          ],
          spec: '',
          comment: [],
          number: 1,
          imgUrl: that.getMinioImg(storagePath, newName)
        }
        this.goodsData = json
        this.descriptionStr = resp.ptypeDetail.detail
        this.isKeep = resp.isFavorite
      })
    },
    getMinioImg (storagePath, newName) {
      return MinioApi.getMinioImg(storagePath + newName)
    },
    getShoppingCartInf () {
      return Util.getShoppingCartInf()
    },
    checkCartEnum (code) {
      return code === ENUM_CONFIRM_TYPE.CART.code
    },
    checkBuyEnum (code) {
      return code === ENUM_CONFIRM_TYPE.BUY.code
    },
    tapToBuy () {
      this.toConfirmation()
    },
    addOrCancelFavoritesItem () {
      let params = {
        ptypeid: this.goodsData.id,
        pfullname: this.goodsData.name,
        pcover: this.getMinioImg(this.swiperList[0].storagePath, this.swiperList[0].newAnnexName),
        price: this.goodsData.price,
        bool: this.isKeep
      }
      MallFavoritesApi.addOrCancelFavoritesItem(params).then(resp => {
      })
    },
    checkPhoneNum () {
      if (ENUM_STATUS.NOT_PHONE_NUM.code === Util.getCurrentUserInf().status.trim()) {
        this.$refs['wxUserPhoneModal'].openModal()
        // this.hidePop()
        return
      }
    },
    onListChange (lists, name) {
      this.photoList = lists
    },
    onImgSuccess (lists, name) {
      this.submitingShow = true
      this.uploadList = lists
      let params = {}
      params.sysAnnexConfigInfoList = []
      // console.log(lists)
      lists.forEach(element => {
        let obj = element.response.result
        params.sysAnnexConfigInfoList.push(obj)
      })

      params.ptypeId = this.ptypeId

      uni.showLoading({
        title: '提交中...',
        mask: true
      })

      PtypeApi.wxPtypeDetailUpdate(params).then(resp => {
        if (!resp) {
          this.$refs['uToast'].show({
            title: '提交失败',
            type: 'error'
          })
          uni.hideLoading()
          return
        }
        this.$refs['uToast'].show({
          title: '提交成功 2秒后跳转',
          type: 'success'
        })
        setTimeout(() => {
          uni.reLaunch({
            url: './goods?ptypeId=' + this.ptypeId
          })
        }, 2000)
      })
    },
    uploadPhotos () {
      this.showConfirmModal = true
    },
    submitForm () {
      this.$refs['uUpload'].upload()
    }
  }
};
</script>
<style lang="scss">
@import "./css/Goods";
</style>
