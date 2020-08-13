<template>
  <view>
    <!-- 状态栏 -->
    <view class="status"
          :style="{position:headerPosition}"></view>
    <view class="header"
          :style="{position:headerPosition}">
      <view class="addr">
        <view class="icon location"></view>{{city}}
      </view>
      <view class="input-box">
        <input placeholder="默认关键字"
               placeholder-style="color:#c0c0c0;"
               @tap="toSearch()" />
        <view class="icon search"></view>
      </view>
      <view class="icon-btn">
        <view class="icon tongzhi"
              @tap="toMsg"></view>
      </view>
    </view>
    <!-- 占位 -->
    <view class="place"></view>
    <view class="category-list">
      <!-- 左侧分类导航 -->
      <scroll-view scroll-y="true"
                   class="left">
        <view class="row"
              v-for="(category,index) in categoryList"
              :key="category.ptypeid"
              :class="[index==showCategoryIndex?'on':'']"
              @tap="showCategory(index)">
          <view class="text">
            <view class="block"></view>
            {{category.pfullname}}
          </view>
        </view>

      </scroll-view>
      <!-- 右侧子导航 -->
      <scroll-view scroll-y="true"
                   class="right">
        <view class="category"
              v-for="(category,index) in categoryList"
              :key="category.ptypeid"
              v-show="index==showCategoryIndex">
          <view class="banner">
            <image mode="aspectFit"
                   :src="getMinioImgUrl(category.sysAnnexConfigInfo)"></image>
          </view>
          <view class="list">
            <view class="box"
                  v-for="(box,i) in category.children"
                  :key="i"
                  @tap="toCategory(box)">
              <image :src="getMinioImgUrl(box.sysAnnexConfigInfo)"></image>
              <view class="text">
                {{box.pfullname.substring(0,18)}}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
//高德SDK
import amap from '@/common/SDK/amap-wx.js';
import CategoryApi from '@/api/category/Category'
import SystemApi from '@/api/system/System'

export default {
  data () {
    return {
      showCategoryIndex: 0,
      headerPosition: "fixed",
      city: "北京",
      //分类列表
      categoryList: [
        // {
        //   id: 1, title: '家用电器', banner: '/static/img/category/banner.jpg', list: [
        //     { name: '冰箱', img: '1.jpg' },
        //     { name: '电视', img: '2.jpg' },
        //     { name: '空调', img: '3.jpg' },
        //     { name: '洗衣机', img: '4.jpg' },
        //     { name: '风扇', img: '5.jpg' },
        //     { name: '燃气灶', img: '6.jpg' },
        //     { name: '热水器', img: '7.jpg' },
        //     { name: '电吹风', img: '8.jpg' },
        //     { name: '电饭煲', img: '9.jpg' }
        //   ]
        // },
        // {
        //   id: 2, title: '办公用品', banner: '/static/img/category/banner.jpg', list: [
        //     { name: '打印机', img: '1.jpg' },
        //     { name: '路由器', img: '2.jpg' },
        //     { name: '扫描仪', img: '3.jpg' },
        //     { name: '投影仪', img: '4.jpg' },
        //     { name: '墨盒', img: '5.jpg' },
        //     { name: '纸类', img: '6.jpg' }
        //   ]
        // },
        // {
        //   id: 3, title: '日常用品', banner: '/static/img/category/banner.jpg', list: [
        //     { name: '茶具', img: '1.jpg' },
        //     { name: '花瓶', img: '2.jpg' },
        //     { name: '纸巾', img: '3.jpg' },
        //     { name: '毛巾', img: '4.jpg' },
        //     { name: '牙膏', img: '5.jpg' },
        //     { name: '保鲜膜', img: '6.jpg' },
        //     { name: '保鲜袋', img: '7.jpg' }
        //   ]
        // },
        // {
        //   id: 4, title: '蔬菜水果', banner: '/static/img/category/banner.jpg', list: [
        //     { name: '苹果', img: '1.jpg' },
        //     { name: '芒果', img: '2.jpg' },
        //     { name: '椰子', img: '3.jpg' },
        //     { name: '橙子', img: '4.jpg' },
        //     { name: '奇异果', img: '5.jpg' },
        //     { name: '玉米', img: '6.jpg' },
        //     { name: '百香果', img: '7.jpg' }
        //   ]
        // }
      ]
    }
  },
  onPageScroll (e) {
    //兼容iOS端下拉时顶部漂移
    if (e.scrollTop >= 0) {
      this.headerPosition = "fixed";
    } else {
      this.headerPosition = "absolute";
    }
  },
  onLoad () {
    this.amapPlugin = new amap.AMapWX({
      //高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
      key: '3bf4eeb9a4c33220b2c4c24d2931b9eb'
    })
    //定位地址
    this.amapPlugin.getRegeo({
      success: (data) => {
        this.city = data[0].regeocodeData.addressComponent.city.replace(/市/g, '');//把"市"去掉
      }
    })
    this.getPtypeDtoMiniProgramMenu()
  },
  methods: {
    //消息列表
    toMsg () {
      uni.navigateTo({
        url: '../../msg/msg'
      })
    },
    //分类切换显示
    showCategory (index) {
      this.showCategoryIndex = index;
    },
    toCategory (e) {
      uni.setStorageSync('catName', e.name);
      uni.navigateTo({
        url: '../../goods/goods-list/goods-list?cid=' + e.id + '&name=' + e.name
      });
    },
    //搜索跳转
    toSearch () {
      uni.showToast({ title: "建议跳转到新页面做搜索功能" });
    },
    getPtypeDtoMiniProgramMenu () {
      CategoryApi.getPtypeDtoMiniProgramMenu().then(resp => {
        this.categoryList = resp
        // console.log(resp)
        // id: 1, title: '家用电器', banner: '/static/img/category/banner.jpg', list: [
        //     { name: '冰箱', img: '1.jpg' },

      })
    },
    getMinioImgUrl (sysAnnex) {
      return SystemApi.getMinioImg(sysAnnex.storagePath + sysAnnex.newAnnexName)
    }
  }
}
</script>
<style lang="scss">
@import "./css/Category";
</style>
