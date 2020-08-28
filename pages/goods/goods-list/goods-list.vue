<template>
  <view>
    <view class="header"
          :style="{position:headerPosition,top:headerTop}">
      <!-- 搜索框 -->
      <view class="input-box">
        <input placeholder="请输入关键字"
               placeholder-style="color:#c0c0c0;"
               v-model="searchWord"
               @confirm="toSearch" />
        <view class="icon search"
              @tap="toSearch()"></view>
      </view>
      <view class="target"
            v-for="(target,index) in orderbyList"
            @tap="select(index)"
            :key="index"
            :class="[target.selected?'on':'']">
        <!-- 商品列表 -->
        {{target.text}}
        <view v-if="target.orderbyicon"
              class="icon"
              :class="target.orderbyicon[target.orderby]"></view>
      </view>
    </view>
    <!-- 占位 -->
    <view class="place"></view>
    <!-- 商品列表 -->
    <view class="goods-list">
      <view class="product-list">
        <view class="product"
              v-for="(goods) in goodsList"
              :key="goods.ptypeid"
              @tap="toGoods(goods)">
          <image mode="widthFix"
                 :src="getMinioImgUrl(goods.sysAnnexConfigInfo)"></image>
          <view class="name">{{goods.pfullname}}</view>
          <view class="info">
            <view class="price">￥{{goods.price}}</view>
            <view class="slogan">{{goods.saleNum}}人付款</view>
          </view>
        </view>
      </view>
      <view class="loading-text">{{loadingText}}</view>
    </view>
  </view>
</template>

<script>
import GoodListApi from '@/api/goodList/GoodListApi'
import MinioApi from '@/api/system/System'
import { ENUM_GOODS_COLUMN, ENUM_ORDER, ENUM_TASK_BAR } from '@/util/Constants'
export default {
  created () {
  },
  data () {
    return {
      goodsList: [
        // { goods_id: 0, img: '/static/img/goods/p1.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 1, img: '/static/img/goods/p2.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 2, img: '/static/img/goods/p3.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 3, img: '/static/img/goods/p4.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 4, img: '/static/img/goods/p5.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 5, img: '/static/img/goods/p6.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 6, img: '/static/img/goods/p7.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 7, img: '/static/img/goods/p8.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 8, img: '/static/img/goods/p9.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
        // { goods_id: 9, img: '/static/img/goods/p10.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' }
      ],
      loadingText: "正在加载...",
      headerTop: "0px",
      headerPosition: "fixed",
      orderbyList: [
        { text: "销量", selected: true, orderbyicon: false, orderby: ENUM_ORDER.ASC.code, column: ENUM_GOODS_COLUMN.SALE_NUM.code },
        { text: "价格", selected: false, orderbyicon: [ENUM_ORDER.ASC.code, ENUM_ORDER.DESC.code], orderby: ENUM_ORDER.ASC.code, column: ENUM_GOODS_COLUMN.PRICE.code },
        // { text: "好评", selected: false, orderbyicon: false, orderby: 0 }
      ],
      orderby: "sheng",
      orderListCount: 0,
      currentStep: 1,
      pfullname: undefined,
      parId: undefined,
      orderColumn: ENUM_GOODS_COLUMN.PRICE.code,
      order: ENUM_ORDER.ASC.code,
      currentType: ENUM_GOODS_COLUMN.PRICE.code,
      searchWord: '',
      stepSize: 8
    }
  },
  onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
    // console.log(option.cid); //打印出上个页面传递的参数。
    if (option.pfullname && option.type === ENUM_TASK_BAR.CATEGORY.code) {
      uni.setNavigationBarTitle({
        title: '(' + option.pfullname + ') 商品列表'
      })
    }

    if (option.pfullname && option.type !== ENUM_TASK_BAR.CATEGORY.code) {
      // uni.setNavigationBarTitle({
      //   title: '(' + option.pfullname + ') 商品列表'
      // })
      this.searchWord = option.pfullname
      this.pfullname = this.searchWord
    }
    this.parId = option.ptypeid
    this.loadData(this.currentStep, this.pfullname, this.parId, this.orderColumn, this.order)
    //兼容H5下排序栏位置
    // #ifdef H5
    //定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
    let Timer = setInterval(() => {
      let uniHead = document.getElementsByTagName('uni-page-head');
      if (uniHead.length > 0) {
        this.headerTop = uniHead[0].offsetHeight + 'px';
        clearInterval(Timer);//清除定时器
      }
    }, 1);
    // #endif
  },
  onPageScroll (e) {
    //兼容iOS端下拉时顶部漂移
    if (e.scrollTop >= 0) {
      this.headerPosition = "fixed";
    } else {
      this.headerPosition = "absolute";
    }
  },
  //下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
  onPullDownRefresh () {
    setTimeout(() => {
      this.reload();
      uni.stopPullDownRefresh();
    }, 1000);
  },
  //上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
  onReachBottom () {
    // uni.showToast({ title: '触发上拉加载' });
    let len = this.goodsList.length;
    if (len >= this.orderListCount) {
      this.loadingText = "完毕";
      return false;
    } else {
      this.loadingText = "正在加载...";
    }

    this.currentStep++
    GoodListApi.searchPtypeByPage(this.currentStep, this.stepSize, this.pfullname, this.parId, this.orderColumn, this.order).then(resp => {
      this.orderListCount = resp.total
      this.goodsList.push(...resp.records)
    })
    // let end_goods_id = this.goodsList[len - 1].goods_id;
    // for (let i = 1; i <= 10; i++) {
    //   let goods_id = end_goods_id + i;
    //   let p = { goods_id: goods_id, img: '/static/img/goods/p' + (goods_id % 10 == 0 ? 10 : goods_id % 10) + '.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' };
    //   this.goodsList.push(p);
    // }
  },
  methods: {
    reload () {
      let tmpArr = []
      this.goodsList = [];
      let end_goods_id = 0;
      for (let i = 1; i <= 10; i++) {
        let goods_id = end_goods_id + i;
        let p = { goods_id: goods_id, img: '/static/img/goods/p' + (goods_id % 10 == 0 ? 10 : goods_id % 10) + '.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' };
        this.goodsList.push(p);
      }
    },
    //商品跳转
    toGoods (e) {
      // uni.showToast({ title: '商品' + e.goods_id, icon: "none" });
      uni.navigateTo({
        url: '../goods?ptypeId=' + e.ptypeid
      })
    },
    //排序类型
    select (index) {
      this.orderbyList.forEach(element => {
        element.selected = false
      });
      this.orderbyList[index].selected = true;
      // let len = this.orderbyList.length;
      // for (let i = 0; i < len; i++) {
      //   if (i != index) {
      //     this.orderbyList[i].selected = false;
      //   }
      // }

      let tmpTis = this.orderbyList[index].text + "排序 "
      let type = this.orderbyList.filter(item => item.selected === true)[0]
      this.goodsList = []
      this.currentStep = 1
      // this.pfullname = ''
      // this.parId = undefined
      // 升序逻辑
      this.orderColumn = type.column
      if (type.orderby === ENUM_ORDER.ASC.code) {
        this.order = ENUM_ORDER.DESC.code
        type.orderby = ENUM_ORDER.DESC.code
        tmpTis += ' 升序'
      } else {
        this.order = ENUM_ORDER.ASC.code
        type.orderby = ENUM_ORDER.ASC.code
        tmpTis += ' 降序'
      }
      this.loadData(this.currentStep, this.pfullname, this.parId, this.orderColumn, this.order)

      // let type = this.orderbyList[index].orderby == 0 ? '升序' : '降序';

      // if (this.orderbyList[index].selected) {
      //   type = this.orderbyList[index].orderby == 0 ? '降序' : '升序';
      //   this.orderbyList[index].orderby = this.orderbyList[index].orderby == 0 ? 1 : 0;
      // }
      // tmpTis += type
      uni.showToast({ title: tmpTis, icon: "none" });
    },
    toSearch () {
      this.pfullname = this.searchWord
      this.loadData(this.currentStep, this.pfullname, this.parId, this.orderColumn, this.order)
    },
    loadData (currentStep, pfullname, parId, orderColumn, order) {
      GoodListApi.searchPtypeByPage(currentStep, this.stepSize, pfullname, parId, orderColumn, order).then(resp => {
        // 暂时定为5
        if (resp.records.length < this.stepSize) {
          this.loadingText = '完毕'
        }
        this.goodsList = resp.records
        this.orderListCount = resp.total
      })
    },
    getMinioImgUrl (annexInfo) {
      return MinioApi.getMinioImg(annexInfo.storagePath + annexInfo.newAnnexName)
    },
    toGoodsNav (id) {
      uni.navigateTo({
        url: '../../goods/goods?ptypeId=' + id
      })
    }
  }

}
</script>

<style lang="scss">
@import "./css/goods-list";
</style>
