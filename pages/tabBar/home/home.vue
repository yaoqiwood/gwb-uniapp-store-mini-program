<template>
  <view>
    <!-- 状态栏 -->
    <view v-if="showHeader"
          class="status"
          :style="{ position: headerPosition,top:statusTop,opacity: afterHeaderOpacity}"></view>
    <!-- 顶部导航栏 -->
    <view v-if="showHeader"
          class="header"
          :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
      <!-- 定位城市 -->
      <view class="addr">
        <view class="icon location"></view>
        {{ city }}
      </view>
      <!-- 搜索框 -->
      <view class="input-box">
        <input placeholder="请输入关键字"
               placeholder-style="color:#c0c0c0;"
               v-model="searchWord"
               @confirm="toSearch" />
        <view class="icon search"
              @tap="toSearch()"></view>
      </view>
      <!-- 右侧图标按钮 -->
      <view class="icon-btn">
        <view class="icon">
          <!--					<contact-button></contact-button>-->
          <image open-type="contact"
                 src="/static/img/gwb-img/customer_service.png"></image>
          <button open-type="contact"
                  class="button-msg">
            咨询
          </button>
        </view>
        <!-- <view class="icon tongzhi"></view> -->
      </view>
    </view>
    <!-- 占位 -->
    <view v-if="showHeader"
          class="place"></view>
    <!-- 轮播图 -->
    <view class="swiper">
      <view class="swiper-box">
        <swiper circular="true"
                autoplay="true"
                @change="swiperChange">
          <swiper-item v-for="swiper in swiperList"
                       :key="swiper.id">
            <!--						<image mode="aspectFit" :src="swiper.img"></image>-->
            <image mode="aspectFit"
                   :src="swiper.img"></image>
            <!--						<view :style="imgStyle(swiper)"></view>-->
          </swiper-item>
        </swiper>
        <view class="indicator">
          <view class="dots"
                v-for="(swiper, index) in swiperList"
                :class="[currentSwiper >= index ? 'on' : '']"
                :key="index">
          </view>
        </view>
      </view>
    </view>
    <!-- 分类列表 -->
    <!--		<view class="category-list">-->
    <!--			<view-->
    <!--							class="category"-->
    <!--							v-for="(row, index) in categoryList"-->
    <!--							:key="index"-->
    <!--							@tap="toCategory(row)">-->
    <!--				<view class="img">-->
    <!--					<image :src="row.img"></image>-->
    <!--				</view>-->
    <!--				<view class="text">{{ row.name }}</view>-->
    <!--			</view>-->
    <!--		</view>-->
    <!-- 广告图 -->
    <!--		<view class="banner">-->
    <!--			<image src="/static/img/banner.jpg"></image>-->
    <!--		</view>-->
    <!-- 活动区 -->
    <view class="promotion">
      <!--			<view class="text">优惠专区</view>-->
      <!--			<view class="list">-->
      <!--				<view-->
      <!--								class="column"-->
      <!--								v-for="(row, index) in Promotion"-->
      <!--								@tap="toPromotion(row)"-->
      <!--								:key="index">-->
      <!--					<view class="top">-->
      <!--						<view class="title">{{ row.title }}</view>-->
      <!--						<view class="countdown" v-if="row.countdown">-->
      <!--							<view>{{ row.countdown.h }}</view>-->
      <!--							:-->
      <!--							<view>{{ row.countdown.m }}</view>-->
      <!--							:-->
      <!--							<view>{{ row.countdown.s }}</view>-->
      <!--						</view>-->
      <!--					</view>-->
      <!--					<view class="left">-->
      <!--						<view class="ad">{{ row.ad }}</view>-->
      <!--						<view class="into">点击进入</view>-->
      <!--					</view>-->
      <!--					<view class="right">-->
      <!--						<image :src="row.img"></image>-->
      <!--					</view>-->
      <!--				</view>-->
      <!--			</view>-->
      <!--		</view>-->
      <view>
        <!--		大标题		-->
        <view class="hot_goods">
          <image src="/static/img/gwb-img/shouye_rmsp.png"></image>
        </view>
        <!--
               内容
               -->
        <view class="hot_goods_frame">
          <view class="hot_items"
                v-for="item in hotItemArray"
                :key="item.itemId"
                @tap="toGoodsNav(item.itemId)">
            <image :src="item.img"
                   mode="heightFix"
                   style="height:80px"></image>
            <view class="hot_item_text">
              <text>{{item.itemName}}</text>
            </view>
            <view class="hot_item_gray_frame">
              <text class="hot_item_gray_text">{{item.itemName}}</text>
            </view>
            <view class="hot_item_price_frame">
              <view class="hot_item_price_item">
                <text class="red">￥{{item.price}}</text>
                <!--								<text style="text-decoration: line-through;color: #999999;font-size: 11px">￥{{item.oldPrice}}</text>-->
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="goods-list">
        <view class="title">
          <!-- <image src="/static/img/hua.png"></image> -->
          精选
          <!-- <image src="/static/img/hua.png"></image> -->
        </view>
        <view class="product-list">
          <view class="product"
                v-for="product in productList"
                :key="product.goodsId"
                @tap="toGoods(product)">
            <image mode="widthFix"
                   :src="product.img"></image>
            <view class="name">{{ product.name }}</view>
            <view class="info">
              <view class="price">￥{{ product.price }}</view>
              <view class="slogan">{{ product.slogan }}</view>
            </view>
          </view>
        </view>
        <view class="loading-text">{{ loadingText }}</view>
      </view>
    </view>
    <account-login-modal ref="accountLoginModal" />
		<view class="previewImg"
					v-if="previewMode">
			<image src="../../../static/img/gwb-img/default_avatar.png"></image>
		</view>
  </view>
</template>

<script>
//高德SDK
import amap from '@/common/SDK/amap-wx.js'
// util
import Util from '@/util/Util'
import HomeApi from '@/api/home/Home'
import SystemApi from '@/api/system/System'
import { ENUM_STATUS, ENUM_PAGE_TYPE } from '@/util/Constants'
import AccountLoginModal from '@/pages/widgets/AccountLoginModal'

export default {
  data () {
    return {
      // userToken: this.$store.token,
      showHeader: true,
      afterHeaderOpacity: 1,//不透明度
      headerPosition: 'fixed',
      headerTop: null,
      statusTop: null,
      nVueTitle: null,
      city: '北京',
      currentSwiper: 0,
      stocksSiftCount: 0,
      currentStep: 0,
      stepSize: 8,
      searchWord: '',
      // 轮播图片
      swiperList: [
        // {id: 1, src: 'url1', img: '/static/img/gwb-img/gwb_logo_swiper.jpg'}
        // {id: 1, src: 'url1', img: SystemApi.getAnnexImg("1")}
        // {id: 2, src: 'url2', img: '/static/img/2.jpg'},
        // {id: 3, src: 'url3', img: '/static/img/3.jpg'}
      ],
      // 分类菜单
      categoryList: [
        { id: 1, name: '办公', img: '/static/img/category/1.png' },
        { id: 2, name: '家电', img: '/static/img/category/2.png' },
        { id: 3, name: '服饰', img: '/static/img/category/3.png' },
        { id: 4, name: '日用', img: '/static/img/category/4.png' },
        { id: 5, name: '蔬果', img: '/static/img/category/5.png' },
        { id: 6, name: '运动', img: '/static/img/category/6.png' },
        { id: 7, name: '书籍', img: '/static/img/category/7.png' },
        { id: 8, name: '文具', img: '/static/img/category/8.png' }
      ],
      Promotion: [],
      //猜你喜欢列表
      productList: [
        // {
        // 	goods_id: 0,
        // 	img: '/static/img/goods/p1.jpg',
        // 	name: '商品名称商品名称商品名称商品名称商品名称',
        // 	price: '168',
        // 	slogan: '1235人付款'
        // },
      ],
      loadingText: '正在加载...',
      hotItemArray: [
        // {
        // 	itemId: 0,
        // 	img: '/static/img/gwb-img/mobil_cover1.jpg',
        // 	itemName: '正品保障Mobil美孚黑霸王15W-40机油4L',
        // 	price: 95,
        // 	oldPrice: 120
      ],
			previewMode:false
    }
  },
  onPageScroll (e) {
    //兼容iOS端下拉时顶部漂移
    this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
    this.headerTop = e.scrollTop >= 0 ? null : 0;
    this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
  },
  //下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
  onPullDownRefresh () {
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000)
  },
  //上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
  onReachBottom () {
    // uni.showToast({title: '触发上拉加载'});
    let len = this.productList.length
    if (len >= this.stocksSiftCount) {
      this.loadingText = '完毕'
      return false;
    }
    this.currentStep += 1
    HomeApi.selectPTypePriceByPage(this.currentStep).then(resp => {
      this.respFillProductList(resp)
    })
    // let end_goods_id = this.productList[len - 1].goods_id;
    // for (let i = 1; i <= 10; i++) {
    // 	let goods_id = end_goods_id + i;
    // 	let p = {
    // 		goods_id: goods_id,
    // 		img:
    // 			'/static/img/goods/p' + (goods_id % 10 == 0 ? 10 : goods_id % 10) + '.jpg',
    // 		name: '商品名称商品名称商品名称商品名称商品名称',
    // 		price: '￥168',
    // 		slogan: '1235人付款'
    // 	};
    // 	this.productList.push(p);
    // }
  },
  beforeCreate () {

    // 登录
    // if (!Util.getToken()) {
    // 	// this.login()
    // 	Util.login()
    // }
  },
  onLoad (option) {
    if (!Util.getToken()) {
			switch(option.viewType){
				case ENUM_PAGE_TYPE.PREVIEW.code:
					this.previewMode = true
					// uni.reLaunch({
					// 	url: '../../blank/LoginBlank'
					// })
					break;
			}
    }
    // uni.reLaunch({
    // 	url: '../../blank/LoginBlank'
    // })
    // 定位
    this.loadLocation()
    //开启定时器
    this.Timer()
    //加载活动专区
    this.loadPromotion()
    // 加载list
    this.getSwipeImgList()
    // 加载热门商品
    this.getGoodStocksSaleTopThree()
    // 加载商品列表
    this.getCountAndStocksList()
    // 加载用户信息
    this.reNewUserInf()
  },
	onShareAppMessage(res) {
		return {
			title: '广挖宝',
			path: '/pages/blank/LoginBlank'
		}
	},
	onShareTimeline(res){
		return {
			title: '广挖宝',
			query: 'viewType=' + ENUM_PAGE_TYPE.PREVIEW.code
		}
	},
  methods: {
    //加载Promotion 并设定倒计时,,实际应用中应该是ajax加载此数据。
    loadPromotion () {
      let cutTime = new Date();
      let yy = cutTime.getFullYear(),
        mm = cutTime.getMonth() + 1,
        dd = cutTime.getDate();
      let tmpcountdown = yy + '/' + mm + '/' + dd + ' 23:59:59';
      let tmpPromotion = [
        {
          title: '整点秒杀',
          ad: '整天秒杀专区',
          img: '/static/img/s1.jpg',
          countdown: false
        },
        {
          title: '限时抢购',
          ad: '每天23点上线',
          img: '/static/img/s2.jpg',
          countdown: tmpcountdown
        } //countdown为目标时间，程序会获取当前时间倒数
      ];
      //检查倒计时
      for (let i = 0; i < tmpPromotion.length; i++) {
        let row = tmpPromotion[i];
        if (row.countdown) {
          let h = '00',
            m = '00',
            s = '00';
          let currentTime = new Date();
          let cutoffTime = new Date(tmpcountdown);
          if (!(currentTime >= cutoffTime)) {
            let countTime = parseInt(
              (cutoffTime.getTime() - currentTime.getTime()) / 1000
            );
            h = parseInt(countTime / 3600);
            m = parseInt((countTime % 3600) / 60);
            s = countTime % 60;
            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
          }
          tmpPromotion[i].countdown = { h: h, m: m, s: s };
        }
      }
      this.Promotion = tmpPromotion;
    },
    //定时器
    Timer () {
      setInterval(() => {
        if (this.Promotion.length > 0) {
          for (let i = 0; i < this.Promotion.length; i++) {
            let row = this.Promotion[i];
            if (row.countdown) {
              if (
                !(
                  row.countdown.h == 0 &&
                  row.countdown.m == 0 &&
                  row.countdown.s == 0
                )
              ) {
                if (row.countdown.s > 0) {
                  row.countdown.s--;
                  row.countdown.s =
                    row.countdown.s < 10
                      ? '0' + row.countdown.s
                      : row.countdown.s;
                } else if (row.countdown.m > 0) {
                  row.countdown.m--;
                  row.countdown.m =
                    row.countdown.m < 10
                      ? '0' + row.countdown.m
                      : row.countdown.m;
                  row.countdown.s = 59;
                } else if (row.countdown.h > 0) {
                  row.countdown.h--;
                  row.countdown.h =
                    row.countdown.h < 10
                      ? '0' + row.countdown.h
                      : row.countdown.h;
                  row.countdown.m = 59;
                  row.countdown.s = 59;
                }
                this.Promotion[i].countdown = row.countdown;
              }
            }
          }
        }
      }, 1000);
    },
    //消息列表
    toMsg () {
      uni.navigateTo({
        url: '../../msg/msg'
      })
    },
    //轮播图跳转
    toSwiper (e) {
      uni.showToast({ title: e.src, icon: 'none' });
    },
    //分类跳转
    toCategory (e) {
      //uni.showToast({title: e.name,icon:"none"});
      uni.setStorageSync('catName', e.name);
      uni.navigateTo({
        url: '../../goods/goods-list/goods-list?cid=' + e.id + '&name=' + e.name
      })
    },
    //推荐商品跳转
    toPromotion (e) {
      uni.showToast({ title: e.title, icon: 'none' });
    },
    //商品跳转
    toGoods (e) {
      // console.log(Util.getCurrentUserInf())
      // if (ENUM_STATUS.NOT_OBTAINED.code === Util.getCurrentUserInf().status.trim()) {
      //   this.$refs['accountLoginModal'].openModal()
      //   return
      // }
      this.toGoodsNav(e.goodsId)
    },
    toGoodsNav (id) {
      // console.log(Util.getCurrentUserInf())
      // if (ENUM_STATUS.NOT_OBTAINED.code === Util.getCurrentUserInf().status.trim()) {
      //   this.$refs['accountLoginModal'].openModal()
      //   return
      // }
      uni.navigateTo({
        url: '../../goods/goods?ptypeId=' + id
      })
    },
    //轮播图指示器
    swiperChange (event) {
      this.currentSwiper = event.detail.current;
    },
    getSwipeImgList () {
      HomeApi.getSwipeImgList().then(resp => {
        for (const respElement of resp) {
          let item = {
            id: respElement.id,
            img: SystemApi.getMinioImg(`${respElement.storagePath}${respElement.newAnnexName}`)
          }
          this.swiperList.push(item)
        }
        // {id: 1, src: 'url1', img: '/static/img/gwb-img/gwb_logo_swiper.jpg'}
        // let
        // this.swiperList.push(item)
      })
    },
    getGoodStocksSaleTopThree () {
      HomeApi.getGoodStocksSaleTopThree().then(resp => {
        for (const respElement of resp) {
          let annexConfigInfo = JSON.parse(respElement.annexConfigInfo)
          // console.log(annexConfigInfo.storagePath + annexConfigInfo.newAnnexName)
          let item = {
            itemId: respElement.PtypeId,
            img: SystemApi.getMinioImg(annexConfigInfo.storagePath + annexConfigInfo.newAnnexName),
            itemName: respElement.pfullname,
            price: respElement.Price
          }
          this.hotItemArray.push(item)
        }
      })
    },
    loadLocation () {
      // #ifdef APP-PLUS
      this.nVueTitle = uni.getSubNVueById('homeTitleNvue');
      this.nVueTitle.onMessage(res => {
        let type = res.data.type;
        if (type == 'focus') {
          this.toSearch();
        }
      });
      this.showHeader = false;
      this.statusHeight = plus.navigator.getStatusbarHeight();
      // #endif
      this.amapPlugin = new amap.AMapWX({
        //高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
        // key: '7c235a9ac4e25e482614c6b8eac6fd8e'
        key: '3bf4eeb9a4c33220b2c4c24d2931b9eb'
      });
      //定位地址
      this.amapPlugin.getRegeo({
        success: data => {
          this.city = data[0].regeocodeData.addressComponent.city.replace(/市/g, ''); //把"市"去掉
          // #ifdef APP-PLUS
          this.nVueTitle.postMessage({ type: 'location', city: this.city });
          // #endif
        }
      })
    },
    login () {
    },
    checkSession () {
    },
    getCountAndStocksList () {
      HomeApi.selectPTypePriceByPage().then(resp => {
        this.stocksSiftCount = resp.total
        this.currentStep = 1
        this.respFillProductList(resp)
      })
    },
    getGoodStockSiftCount () {
      HomeApi.getGoodStockSiftCount().then(resp => { })
    },
    selectPTypePriceByPage () {
      HomeApi.selectPTypePriceByPage().then(resp => { })
    },
    respFillProductList (resp) {
      for (const argument of resp.records) {
        let respElement = argument.sysAnnexConfigInfo
        let product = {
          goodsId: argument.ptypeid,
          img: SystemApi.getMinioImg(`${respElement.storagePath}${respElement.newAnnexName}`),
          name: argument.pfullname,
          price: argument.price,
          slogan: (argument.saleCount === null ? 0 : argument.saleCount) + '次付款'
        }
        this.productList.push(product)
      }
    },
    //搜索跳转
    toSearch () {
      let pfullname = this.searchWord
      uni.navigateTo({
        url: '../../goods/goods-list/goods-list?pfullname=' + pfullname
      })
      // uni.showToast({ title: "建议跳转到新页面做搜索功能" });
    },
    reNewUserInf () {
      uni.showLoading({ title: "加载中..." })
      SystemApi.getWxUserInf().then(resp => {
        Util.setCurrentUserInf(resp)
        // 加载退货地址
        this.getRetAddressInf()
      })
    },
    getRetAddressInf () {
      SystemApi.getRetAddressInf().then(resp => {
        Util.setRetAddressInf(resp)
        uni.hideLoading()
      })
    }
  },
  computed: {
    imgStyle: (item) => {
      return 'background-img:url:(' + item.img + ')'
    }
  },
  components: { AccountLoginModal }
}
</script>
<style lang="scss">
@import "./css/home";
</style>
