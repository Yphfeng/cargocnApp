<template>
  <view>
    <view class="jym-container">
      <view class="topContainer" :style="{height: activeAdvObj && activeAdvObj.info[0].advUrl ? '466rpx' : '306rpx'}">
        <!-- 轮播图 -->
        <swiper class="swiper" indicator-dots="false" interval="5000" duration="1000" autoplay="true">
          <block v-for="(item, index) in movies" :key="index">
            <swiper-item :data-url="item.url" @tap="changeURL">
              <image :src="item.url" class="slide-image" mode="aspectFill"></image>
            </swiper-item>
          </block>
        </swiper>
		
        <view class="topSearchContainer" :style="'width:' + '650rpx' + ';top:' + statusBarHeight">
          <view class="scanContainer" @tap="clickScan">
            <image class="scanImage" src="/static/images/jym/icon_black_scan.png"></image>
          </view>
          <view class="inputContainer weui-search-bar__box">
            <input :value="keyword" type="text" :maxlength="30" confirm-type="search" @confirm="startSearch"
              @input="updateKeyword"></input>
            <icon class="inputContainer_icon" type="search" style="margin-left:450rpx ;" size="17" color="#B5CCF6">
            </icon>
          </view>
        </view>
		<view class="advs" v-if="activeAdvObj && activeAdvObj.info[0].advUrl">
			<image :src="activeAdvObj.info[0].advUrl" mode="aspectFill" @click="showBigBanner(activeAdvObj.info[1], activeAdvObj.info[1].advUrl)" class="mainBanner"image>
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adverties.gif"  class="advertiesGif"></image>
		</view>
        <view class="topView" :style="{top: activeAdvObj && activeAdvObj.info[0].advUrl ? '467rpx' : '307rpx'}">
          <view class="topView_btm">
            <view class="itemView" @tap.stop="selectTap" data-flag="1">
              <text :style="'color:' + item1SelectedColor">{{item1SelectText}}</text>
              <image :class="['select_img', show1&&'select_img_rotate']" :src="item1SelectImg"></image>
            </view>
            <view class="itemView" @tap.stop="selectTap" data-flag="2">
              <text :style="'color:' + item2SelectedColor">{{item2SelectText}}</text>
              <image :class="['select_img', show2&&'select_img_rotate']" :src="item2SelectImg"></image>
            </view>
            <view class="itemView" @tap.stop="selectTap" data-flag="4">
              <!-- <text>站点类型</text> -->
              <text :style="'color:' + item3SelectedColor">{{item3SelectText}}</text>
              <image :class="['select_img', show4&&'select_img_rotate']" :src="item3SelectImg"></image>
            </view>
            <view class="itemView" @tap.stop="selectTap" data-flag="5">
              <!-- <text>优惠类型</text> -->
              <text :style="'color:' + item5SelectedColor">{{item5SelectText}}</text>
              <image :class="['select_img', show5&&'select_img_rotate']" :src="item5SelectImg"></image>
            </view>
            <!-- <view class="itemView" catchtap='selectTap' data-flag="3">
          <text>显示地图</text>
        </view> -->

          </view>
        </view>
        <view class="select_box" @tap="clickDisappear"
          :style="'height:' + (show1 || show2 || show5 || show4?100:0) + 'vh;'">
          <view class="option_box" :style="'height:' + (show1?160:0) + 'rpx;'">
            <view :style="'color:' + (item1Status==0?item1SelectedColor:item1Color)" @tap.stop="clickItem"
              data-flag="0">
              距离最近
            </view>
            <view :style="'color:' + (item1Status==1?item1SelectedColor:item1Color)" @tap.stop="clickItem"
              data-flag="1">
              价格最低
            </view>
          </view>
          <!-- 油品类型 -->
          <view class="option_box  PreferenceType" :style="'height:' + (show2?210:0) + 'rpx;'">
            <block v-for="(item, bindex) in item2Arr" :key="bindex">
              <view :style="'color:' + (item2Status==bindex?item2SelectedColor:item2Color)" :value="fuelName"
                @tap.stop="clickOilItem" :data-flag="bindex">
                {{item.fuelName}}
              </view>
            </block>
          </view>
          <!-- 站点 -->
          <view class="option_box1" :style="'height:' + (show4?350:0) + 'rpx; background-color: #fff'">
            <!-- <block wx:for-items="{{item3Arr}}" wx:key="index" wx:for-index="bindex" wx:for-item='item'>
          <view style="color:{{item3Status==bindex?item3SelectedColor:item3Color}}" catchtap="clickKMItem"
            data-flag="{{bindex}}">
            {{item.type}}
          </view>
        </block> -->
            <view style="height: 250rpx">
              <picker-view indicator-class="indicator-class" style="width: 100%; height: 250rpx;"
                :data-index="pickerIndex" :value="pickerValue" @change="bindPickerChange">
                <picker-view-column>
                  <view v-for="(item, index) in areaData" :key="index" class="picker-box">{{item.name}}</view>
                </picker-view-column>
                <picker-view-column>
                  <view v-for="(item, index) in cityArr" :key="index" class="picker-box">{{item.name}}</view>
                </picker-view-column>
              </picker-view>
            </view>
            <view class="picker-btn-box">
              <view class="picker-btn-child">
                <view class="picker-btn" @tap.stop="cancelEvent">全国</view>
              </view>
              <view class="picker-btn-child">
                <view class="picker-btn1" @tap.stop="confirmEvent">确定</view>
              </view>
            </view>
          </view>
          <!-- 优惠类型 -->
          <!-- <view class='option_box PreferenceType' style='height:{{show5?170:0}}rpx;'>
        <block wx:for-items="{{item5Arr}}" wx:key="index" wx:for-index="bindex" wx:for-item='item'>
          <view style="color:{{item5Status==bindex?item5SelectedColor:item5Color}}" catchtap="clickType"
            data-flag="{{item.value}}">
            {{item.type}}
          </view>
        </block>
      </view> -->
          <view class="option_box" :style="'height:' + (show5?240:0) + 'rpx;'">
            <view :style="'color:' + (isHighway==-1?item5SelectedColor:item1Color)" @tap.stop="highWayEvent"
              data-type="-1">
              全部类型
            </view>
            <view :style="'color:' + (isHighway==1?item5SelectedColor:item1Color)" @tap.stop="highWayEvent"
              data-type="1">
              高速站点
            </view>
            <view :style="'color:' + (isHighway==0?item5SelectedColor:item1Color)" @tap.stop="highWayEvent"
              data-type="0">
              非高速站
            </view>
          </view>

          <view class="option_box" :style="'height:' + (show3?180:0) + 'rpx;'"></view>
        </view>
      </view>

      <!-- <scroll class="scrollView" :requesting="requesting" :empty-show="emptyShow" :end="end" :listCount="listData.length" :has-top="hasTop" :enable-back-to-top="enableBackToTop" :refresh-size="80" :top-size="395" @refresh="refresh" @more="more">

		
	</scroll> -->
      <view class="cellViewBox" :style="{'padding-top': activeAdvObj && activeAdvObj.info[0].advUrl ? '580rpx' : '420rpx'}">
        <!-- <view class="activity-box" bindtap="activityEvent" wx:if="{{token=='' || origin==1}}">
				<image mode="widthFix" class="activity"
					src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/activity.png?1"></image>
				<view class="activity-btn" wx:if="{{token=='' && showActivity==1}}">我要参与</view>
				<view class="activity-btn" wx:if="{{origin==1 && showActivity==1}}">查看结果</view>
			</view> -->
        <!-- <scroll-view refresher-enabled="true" :refresher-triggered="requesting"  scroll-y="true" @refresherrefresh="refresh" @scrolltolower="more" style="height:72vh"> -->
        <view v-for="(item, index) in listData" :key="index" class="cellView" @tap="selectItem" :data-map="item">
          <view class="oilInfoView1">
            <!-- 列表右侧图片 -->
            <view class="oilInfoView">
              <view class="oilInfo">
                <view class="oilInfoView_oilName">{{item.compSecondName}}</view>
              </view>

              <view class="oilInfoLine3 publicStyle">
                <view class="prictView">
                  <text class="text">{{item2SelectText}}</text>
                  <span><text>￥</text>{{item.fuelPrice}}</span>
                </view>
              </view>

              <view class="gear-box publicStyle">
                <view class="location-box publicStyle">
                  <image src="/static/images/jym/icon_location.png"></image>
                  <text>{{item.distance}}km</text>
                </view>
                <view class="gear-right" v-if="item.tagList">
                  {{item.tagList[0]}}
                </view>
                <view class="gear-right1" v-if="item.tagList && item.tagList.length>1">
                  ...
                </view>
              </view>

              <view class="oilInfoLine2 publicStyle">
                <view class="oilInfoLine2Left">{{item.compAddress}}</view>
              </view>

            </view>

            <!-- 左侧列表数据 -->
            <view class="oilInfoView_img">
              <image class="service_station"
                src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/service_station.png">
              </image>
              <view class="oilInfoLine2Right" @tap.stop="onTapNav" hover-stop-propagation="true" :data-map="item">
                <image style="width: 27rpx;height: 25rpx;" src="/static/images/jym/icon_navigation.png">
                </image>
                <text>导航</text>
                <!-- <text>{{item.distance}}km</text> -->
              </view>
            </view>
          </view>
          <!-- <view class="lineView"></view> -->
          <view class="voucher-identification" v-if="item.couponFlag == true">
            <image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/coupons_icon.png">
            </image>
          </view>
        </view>
        <view v-show="requesting" class="more-Box">
          <image class="moreLoading" src="../../../../static/images/listLoading.png"></image>加载中～
        </view>
        <!-- <view v-if="end">
          <view class="more-Box">没有更多了～
          </view>
        </view> -->
        <!-- </scroll-view> -->

      </view>
      <!-- <image class="couponImage" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_coupon.png" bindtap="onTap2" /> -->
    </view>
    <!-- 遮罩层 -->
    <view class="mask" catchtouchmove="preventTouchMove" v-if="showModal2"></view>
    <!-- 弹出层 -->
    <view class=" modalDlg1" v-if="showModal2">
      <view class="modal_top modal_top1">提示</view>
      <view class="modal_select">
        <text>您不是本站会员，请选择要开通的会员卡类型</text>
      </view>
      <checkbox-group v-if="typeList.length!=0" class="checkboxlabel" @change="checkboxChange">
        <block v-for="(item, index) in typeList" :key="index" :data-map="item">
          <view class="modal_oil_card"
            :style="'background: ' + (item.id==1?itemColor:item.id==2?itemColor1:itemColor2) + ';'">
            <image :style="'width:' + (item.id==2?'112rpx':item.id==3?'82rpx':'92rpx')"
              :src="item.id==1?itemImg:item.id==2?itemImg1:itemImg2"></image>
            <view :style="'color: ' + (item.id==1?textColor:item.id==2?textColor1:textColor2) + ';'">
              油站{{item.typeName}}卡
            </view>
            <view>
              <checkbox :value="index" :checked="item.checked"></checkbox>
            </view>
          </view>
        </block>
      </checkbox-group>
      <view v-else class="modal_oil_card" style="background-color: #F7F7F7;">暂无油卡</view>
      <view class="modal_btm">
        <view @tap="cancel">取消</view>
        <view @tap="confirm">确认</view>
      </view>
    </view>


    <view class="map-box" :style="'left:' + left + 'px;top:' + top + 'px;'" @touchmove="viewTouchMove" @tap="goMap">
      <image class="map-img" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_map.png"></image>
    </view>
    <view style="position: fixed; bottom: 80rpx; right: 10rpx" @click="goApp">
      <image style="width: 80px; height: 80px;" src="/static/images/jym/community.png"></image>
    </view>
  </view>
</template>

<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>

<script>
  // pages/oilstation/oilstationIndex/oilstationIndex.js
  var api = require("@/config/api.js");
  import * as service from "@/utils/service";
  var util = require("@/utils/jym-utils/util.js");
  import * as longLink from '@/longLink/longLink';
  let pageStart = 1;
  const app = getApp();
  var QQMapWX = require("@/utils/jym-utils/qqmap-wx-jssdk.min.js");
  var qqmapsdk = new QQMapWX({
    key: api.tentCentMapKey
  });
  var noStationType = false;
  import scroll from "@/components/jym-components/scroll/index";
  import * as publicData from "@/utils/publicData";
  const PemissionModule = uni.requireNativePlugin("PemissionModule");
  export default {
    data() {
      return {
		isHasPower: false,
        pickerValue: [0,0],
        showActivity: 0,
        origin: "",
        //是否是参与过活动
        token: "",
        userCarType: "",
        phone: '',
        password: '',
        requesting: false,
        end: false,
        emptyShow: false,
        page: pageStart,
        listData: [],
        hasTop: true,
        enableBackToTop: false,
        isMembership: true,
        refreshSize: 80,
        bottomSize: 0,
        stationId: "",
        typeList: [],
        fuelTypes: [],
        hide: false,
        showModal2: false,
        show1: false,
        //控制下拉列表的显示隐藏，false隐藏、true显示
        show2: false,
        //控制下拉列表的显示隐藏，false隐藏、true显示
        show3: false,
        //控制下拉列表的显示隐藏，false隐藏、true显示
        show4: false,
        show5: false,
        index: 0,
        //选择的下拉列表下标
        item1Arr: ["距离最近", "价格最低"],
        item1Color: "#696969",
        item1SelectedColor: "#6D9AED",
        item3SelectedColor: "#6D9AED",
        item5SelectedColor: "#6D9AED",
        item1Status: 0,
        item1SelectText: "距离最近",
        item1SelectImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png",
        item3Arr: [ // { type: "6km内", value: 6 },
          // { type: "10km内", value: 10 },
          // { type: "15km内", value: 15 },
          // { type: "20km内", value: 20 },
          // { type: "50km内", value: 50 },
          {
            type: "全部站点",
            value: 0
          }, {
            type: "国营油站",
            value: 1
          }, {
            type: "优质民营",
            value: 2
          }, {
            type: "三方合作",
            value: 3
          }
        ],
        item5Arr: [{
          type: "全部类型",
          value: 0
        }, {
          type: "A档",
          value: 1
        }, {
          type: "B档",
          value: 2
        }, {
          type: "C档",
          value: 3
        }, {
          type: "D档",
          value: 4
        }, {
          type: "E档",
          value: 5
        }, {
          type: "F档",
          value: 6
        }, {
          type: "G档",
          value: 7
        }],
        flagIndex: 0,
        item3Color: "#696969",
        item3SelectedColor: "#696969",
        item5SelectedColor: "#469DFC",
        item1Color: "#696969",
        item3Status: 0,
        // item3SelectText: "50km内",
        item3SelectText: "全国",
        item5Status: 0,
        item5SelectText: '全部类型',
        item3SelectImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png",
        item2Arr: [],
        item2Color: "#696969",
        item2SelectedColor: "#696969",
        item2Status: 0,
        item2SelectText: "",
        item2ShowText: '0#',
        item2SelectImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png",
        item5SelectImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png",
        isHighway: -1,
        item2Id: '',
        fuelName: {},
        dataArr: ["0", "1", "2", "2", "2", "2", "2", "2", "2"],
        currentPage: 1,
        keyword: "",
        itemColor1: "#E6ECF7",
        itemColor: "#F7F1DF",
        itemColor2: "#D5EDEF",
        textColor1: "#90B1F0",
        textColor: "#F7A129",
        textColor2: "#40BDCA",
        itemImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasolineCard.png",
        itemImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_dieselCard.png",
        itemImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasCard.png",
        // 轮播图
        movies: [{
            url: 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/banner1.png'
          }, {
            url: 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/banner2.png'
          },
          // {
          //      url: 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/banner3.png'
          //    },
        ],
        navBarWidth: 0,
        //动态获取顶部搜索栏宽度，每个手机适配
        navBarHight: 0,
        //动态获取顶部搜索栏高度，每个手机适配
        top: '',
        left: '',
        personId: "",
        cityArr: "",
        stationPicker: "",
        stationValue: [],
        areaData: [],
        selected: 0,
        item3Id: "",
        empty: false,
        pickerIndex: 0,
		activeAdvObj: null,
		advList: [
			{typeName: '加油么', key: 'JYM', info: []}
		],
      };
    },

    components: {
      scroll
    },
    props: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // var userData = {"attrs":{"remindStatus":0,"isAdmin":0,"isBindWx":0,"driverStatus":1,"idNo":"410822198704132516","randomNum":"112","driverId":538,"registerDT":"2021-04-29","personId":3299,"driverVerify":1,"userCarType":1,"vehicleVerify":1,"hasPayPassword":1,"status":1,"token":"eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSMjS3sDS0NDQwMbJU0lEqLU4t8kxRsjI2tLDUUcrJT8_MC6ksSFWysjAx0FFKrShQsjI0MzI3sDSxNDavBQDJt0OrRAAAAA.PGRARsCmhDo5WjmeNn7QuQ3ruZ3vHjsaduQGMuPfIKk"},"userId":3189,"userType":84,"loginId":"17891910429","mobile":"17891910429","userName":"马小伟","loginType":840,"password":"96e79218965eb72c92a549dd5a330112"}
      //   uni.setStorageSync('driverInfo', userData);
      // uni.setStorageSync('token', userData.attrs.token);
      // uni.setStorageSync('driverVerify', 1);
	  
      // this.longEvent();
      let that = this; //获取系统信息
	// 获取车队广告
	that.$store.dispatch('getJymAdv').then(fleetAdvRes => {
		console.log(fleetAdvRes, '油的阿萨德说');
		that.advList.forEach((itemOne) => {
			fleetAdvRes.forEach(itemTwo =>{
				if(itemTwo.advLocation.indexOf(itemOne.key) != -1){
					itemOne.info.push(itemTwo)
				}
			})
		})
		that.setActiveAdv('加油么')
		console.log("车队广告图片车队广告图片车队广告图片车队广告图片车队广告图片车队广告图片车队广告图片车队广告图片",that.advList)
	})
      var systemInfo = uni.getSystemInfoSync(); // 胶囊按钮位置信息
      // this.statusBarHeight = systemInfo.statusBarHeight + 'px';
      this.statusBarHeight = systemInfo.statusBarHeight + 'px';
      //计算胶囊按钮到顶部的高度 
      // uni.showShareMenu({
      //   withShareTicket: true,
      //   menus: ['shareAppMessage', 'shareTimeline']
      // });
      uni.getStorage({
        key: 'driverInfo',
        success: function (res) {
          that.userCarType = res.data.attrs.userCarType;
          that.personId = res.data.attrs.personId;
        }
      });
      this.phone = uni.getStorageSync('phone');
      this.password = uni.getStorageSync('testCode');
      uni.hideLoading();
      uni.$on('long-event', (data) => {
        that.longEvent();
      })
    },
    onPullDownRefresh: function () {
      this.refresh()
      // setTimeout(() => {
      // 	uni.stopPullDownRefresh()
      // },3000)
    },
    onReachBottom(e) {
      this.more()
      // console.log('触底加载更多');

    },
	onBackPress(e) {
		if (e.from == "backbutton") {
			//说明如果点击的是物理返回键或导航栏的返回键返回货运中国
			this.goApp();
		}
		return true;
	},
    onShow: function () {
		var isOilIn = uni.getStorageSync("isOilIn");
		if (!isOilIn) {
			uni.setStorageSync("isOilIn", true)
			//设置tabbar底部
			publicData.goJJMApp();
		}
	
	
		if (this.cityArr.length < 1) {
			setTimeout(() => {
				this.getFuelitem();
				this.getNationDict();
			}, 1000)
		}
      var screenHeight = uni.getSystemInfoSync().windowHeight;
      var screenWidth = uni.getSystemInfoSync().windowWidth; // console.log(screenHeight);
      // console.log(screenWidth);

      this.top = screenHeight - 170;
      this.left = screenWidth - 60;

      if (uni.getStorageSync('token')) {
        this.token = uni.getStorageSync('token');
        this.origin = uni.getStorageSync('driverInfo').attrs.origin;
      }

      setTimeout(() => {
        this.showActivity = 1;
      }, 100);
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().selected = 0;
      }
	  console.log("加油show", app.globalData.otherUser.phone, app.globalData.otherUser.password)
	  setTimeout(() => {
		  if (!app.globalData.otherUser.phone && !app.globalData.otherUser.password) {
		    this.cardCountEvent();
		  }
	  }, 200)
    
    },
    methods: {
		showBigBanner(item, img) {
			if(item.linkType == 'not'){
				uni.previewImage({
					urls: [item.advUrl],
					success: function(data) {
						console.log(data);
					},
					fail: function(err) {
						console.log(err);
					}
				});
			}else if(item.linkType == 'route'){
				uni.navigateTo({
					url: item.linkUrl
				})
			}else{
				getApp().globalData.promoteLinkUrl = item.linkUrl;
				uni.navigateTo({
					url: '../../advertisingH5/advertisingH5'
				})
			}
		},
		setActiveAdv(typeName){
			let that = this 
			let activeAdvObj = {}
			that.advList.some(item => {
				if(item.typeName == typeName){
					activeAdvObj.typeName = item.typeName
					activeAdvObj.key = item.key
					activeAdvObj.info = ['','']
					item.info.forEach(infoItem => {
						if(infoItem.advLocation.indexOf('SMALL') != -1){
							activeAdvObj.info[0] = JSON.parse(JSON.stringify(infoItem))
						}
						if(infoItem.advLocation.indexOf('BIG') != -1){
							activeAdvObj.info[1] = JSON.parse(JSON.stringify(infoItem))
						}
					})
					return true
				}
			})
			that.activeAdvObj = activeAdvObj
			console.log('当前显示的广告当前显示的广告当前显示的广告当前显示的广告当前显示的广告',that.activeAdvObj)
		},
      goApp() {
        publicData.goDriverApp()
      },
	  

      highWayEvent(e) {
        var type = e.currentTarget.dataset.type;
        let distinguish = 1;
        this.isHighway = type;
        this.show5 = false;

        if (type == -1) {
          this.item5SelectText = '全部类型';
        } else if (type == 1) {
          this.item5SelectText = '高速站点';
        } else {
          this.item5SelectText = '非高速站';
        }

        console.log(this.keyword, "keyword");
        this.getList('refresh', pageStart, this.keyword, distinguish);
      },

      activityEvent() {
        if (this.origin == 1) {
          uni.navigateTo({
            url: '/pages/activity/activity?origin=1'
          });
        } else {
          uni.navigateTo({
            url: '/pages/activity/activity'
          });
        }
      },

      updateKeyword: function (e) {
        this.keyword = e.detail.value;
      },

      startSearch(e) {
        var that = this;
        var discountName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value;
        console.log('e.detail.value', discountName);
        that.getList('refresh', pageStart, discountName);
      },

      clickScan() {
        let that = this;

        if (uni.getStorageSync('token') == "") {
          uni.showModal({
            title: "当前为未登录状态，请登录后操作,跳转登录页",
            // content:"跳转登录页？",
            icon: 'none',

            success(res) {
              if (res.confirm) {
                uni.reLaunch({
                  url: '/pages/login/login/loginSelect/loginSelect'
                });
              }
            }

          });
          return;
        }
		uni.showModal({
			title: '提示',
			content: '扫码将获取您的相机和存储权限',
			success: function(res) {
				if (res.confirm) {
					uni.scanCode({
					  success: function (res) {
					    console.log(res.result);
					    let secret = that.getQueryString(res.result, 'result');
					
					    if (secret > 0) {
					      uni.navigateTo({
					        url: "../addVip/addVip?stationId=" + secret
					      });
					    } else {
					      qqmapsdk.reverseGeocoder({
					        success: function (res1) {
					          var parm = {
					            secret: secret,
					            latitude: res1.result.address_reference.landmark_l2.location.lat,
					            longitude: res1.result.address_reference.landmark_l2.location.lng
					          };
					          util.postRequest(api.getoilstationInfoByQrcode, parm).then(function (res) {
					            console.log('res', res);
					
					            if (res.retCode == '0000000') {
					              let isMembership = res.rspBody.isMembership;
					              let data = res.rspBody;
					              that.isMembership = isMembership;
					              util.postRequest(api.driverOilcardList, {}).then(function (res) {
					                if (res.retCode == '0000000') {
					                  let list = res.rspBody;
					
					                  for (let i in list) {
					                    if (list[i].cardType == 1) {
					                      that.isMembership = true;
					                    }
					                  }
					
					                  if (data.stationDetail.stationType == 1 && that.isMembership == false) {
					                    uni.showModal({
					                      title: '提示',
					                      content: "您的账户没有车队卡，暂无法在主营油站加油，请与车队联系开卡事宜",
					                      showCancel: false
					                    });
					                    return;
					                  }
					
					                  if (that.isMembership == true) {
					                    uni.navigateTo({
					                      url: '../addOilPage/addOilIndex/addOilIndex?map=' + JSON
					                        .stringify(data) + '&sign=' + 1
					                    });
					                  } else {
					                    let parma = {
					                      "stationId": data.stationDetail.id
					                    };
					                    that.stationId = data.stationDetail.id;
					                    util.postRequest(api.getSiteInfo, parma).then(function (res) {
					                      if (res.retCode == '0000000') {
					                        const list = res.rspBody.FUEL_TYPE;
					                        that.typeList = list;
					                        that.showModal2 = true;
					                      }
					                    });
					                  }
					                } else {
					                  uni.showToast({
					                    title: res.retDesc,
					                    icon: 'none'
					                  });
					                }
					              });
					            } else {
					              uni.showModal({
					                title: '提示',
					                content: res.retDesc,
					                showCancel: false
					              });
					            }
					          });
					        }
					      });
					    }
					  }
					});
				}
			}
		})
      },
      getQueryString(url, name) {
        var reg = new RegExp('(^|&|/?)' + name + '=([^&|=?]*)(&|=?|$)', 'i')
        var r = url.substr(1).match(reg)
        if (r != null) {
          return r[2] + '='
        }
        return null;
      },
      confirm() {
        this.requestVip(this.fuelTypes);
      },

      checkboxChange(e) {
        let arr = [];

        for (let i in e.detail.value) {
          arr.push(Number(e.detail.value[i]) + 1);
        }

        this.fuelTypes = arr;
      },

      cancel() {
        this.showModal2 = false;
      },

      // 开通油卡会员
      requestVip(fuelTypes) {
        let that = this;
        uni.showLoading({
          title: '请稍候...'
        });
        const parma = {
          "personId": this.personId,
          "compId": this.stationId,
          "fuelTypes": fuelTypes
        };
        util.postRequest(api.addVip, parma).then(function (res) {
          console.log(res);
          uni.hideLoading();

          if (res.retCode == '0000000') {
            uni.showModal({
              title: '提示',
              content: "恭喜！油卡已开通成功！",
              showCancel: false,
              success: function () {
                that.showModal2 = false;
              }
            });
          } else {
            uni.showToast({
              title: res.retDesc,
              icon: 'none'
            });
          }
        });
      },

      onTapNav(e) {
        const map = e.currentTarget.dataset.map;
        uni.getLocation({
          type: 'gcj02',
          //返回可以用于wx.openLocation的经纬度
          success: function (res) {
            uni.openLocation({
              latitude: map.latitude,
              longitude: map.longitude,
              name: map.compSecondName,
              scale: 28
            });
            console.log(map.latitude, map.longitude, map.compSecondName);
          }
        });
      },

      onTap1(e) {
        const id = e.currentTarget.dataset.id;
        uni.navigateTo({
          url: '../luckDraw/luckDraw?id=' + id
        });
      },

      onTap2(e) {
        let flag = e.currentTarget.dataset.flag;
        let that = this;

        if (flag != 1) {
          if (uni.getStorageSync('token') == "") {
            uni.showModal({
              title: "当前为未登录状态，请登录后操作,跳转登录页",
              icon: 'none',

              success(res) {
                if (res.confirm) {
                  uni.reLaunch({
                    url: '/pages/login/login/loginSelect/loginSelect'
                  });
                }
              }

            });
            return;
          }
        }

        switch (flag) {
          case '1':
            uni.navigateTo({
              url: '../couponIndex/couponIndex'
            });
            break;

          case '2':
            uni.navigateTo({
              url: '../../my/coupon/coupon'
            });
            break;

          case '3':
            uni.navigateTo({
              url: '../../my/oilcardPage/oilcardPage?type=1'
            });
            break;

          case '4':
            uni.navigateTo({
              url: '../../my/profit/profit'
            });
            break;

          case '5':
            var driverVerify = uni.getStorageSync("driverVerify");

            if (driverVerify == 1) {
              uni.navigateToMiniProgram({
                appId: 'wx12d7b716e2e36bf0',
                path: 'pages/cargo/index/index?phone=' + that.phone + '&password=' + that.password,
                extraData: {
                  phone: that.phone,
                  password: that.password
                },
                envVersion: 'trial',

                success(res) { // 打开成功
                }

              });
            } else {
              uni.showToast({
                title: '请先进行司机认证',
                icon: 'none'
              });
            }

            break;

          default:
            return "未知";
        }
      },

      getUserInfo() {
        var data = {
          mobile: uni.getStorageSync('phone'),
          userType: 84
        };
        util.postRequest(api.getUserInfo, data).then(res => {
          if (res.retCode == '0000000') {
            uni.setStorageSync('driverInfo', res.rspBody);

            if (!res.rspBody.password) {
              uni.showModal({
                title: '提示',
                content: '请先设置密码后再去找货',
                confirmText: '设置密码',

                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    uni.navigateTo({
                      url: '/pages/login/loginPwd/loginPwd?title=设置密码'
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                }

              });
            } else {
              uni.showModal({
                title: '提示',
                content: '请使用手机号+密码登录，才能使用本功能',
                confirmText: '去登录',

                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    uni.navigateTo({
                      url: '/pages/login/login/loginSelect/loginSelect?jump=1'
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                }

              });
            }
          } else {
            uni.showToast({
              title: res.retDesc
            });
          }
        });
      },

      // 点击banner去找货
      changeURL(e) {
        let that = this;
        let url = e.currentTarget.dataset.url;
        var driverVerify = uni.getStorageSync("driverVerify"); //判断是否登录

        if (uni.getStorageSync('token') == "") {
          uni.showModal({
            title: "当前为未登录状态，请登录后操作,跳转登录页",
            icon: 'none',

            success(res) {
              if (res.confirm) {
                uni.reLaunch({
                  url: '/pages/login/login/loginSelect/loginSelect'
                });
              }
            }

          });
          return;
        } //跳转


        if (url == 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/banner3.png') {
          if (driverVerify == 1) {
            if (uni.getStorageSync('wechtDriverInfo') || uni.getStorageSync('loginType') != 2) {
              that.getUserInfo();
              return;
            }

            uni.navigateToMiniProgram({
              appId: 'wx12d7b716e2e36bf0',
              path: 'pages/cargo/index/index?phone=' + that.phone + '&password=' + that.password,
              extraData: {
                phone: that.phone,
                password: that.password
              },
              envVersion: 'trial',

              success(res) { // 打开成功
              }

            });
          } else {
            uni.showToast({
              title: '请先进行实名认证',
              icon: 'none'
            });
          }
        }
      },

      // 点击下拉显示框
      selectTap(e) {
        var flag = e.currentTarget.dataset.flag;

        if (flag == 1) {
          this.show1 = !this.show1;
          this.show2 = false;
          this.show3 = false;
          this.show4 = false;
          this.show5 = false;
          this.item1SelectedColor = "#469DFC";
          this.item2SelectedColor = "#666666";
          this.item3SelectedColor = '#666666';
          this.item5SelectedColor = '#666666';
          this.item1SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png";
          this.item2SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
          this.item3SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
          this.item5SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
        } else if (flag == 2) {
          this.show1 = false;
          this.show2 = !this.show2;
          this.show3 = false;
          this.show4 = false;
          this.show5 = false;
          this.item1SelectedColor = "#666666";
          this.item2SelectedColor = "#469DFC";
          this.item3SelectedColor = '#666666';
          this.item5SelectedColor = '#666666';
          this.item2SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png";
          this.item1SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
          this.item3SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
          this.item5SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
        } else if (flag == 3) {
          if (noStationType) {
            uni.navigateTo({
              url: '../mapView/mapView?noStationType=[1,4]'
            });
          } else {
            uni.navigateTo({
              url: '../mapView/mapView'
            });
          }
        } else if (flag == 4) {
          this.show1 = false;
          this.show2 = false;
          this.show3 = false;
          this.show5 = false;
          this.show4 = !this.show4;
          this.item1SelectedColor = "#666666";
          this.item2SelectedColor = "#666666";
          this.item3SelectedColor = '#469DFC';
          this.item5SelectedColor = '#666666';
          this.item2SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
          this.item1SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
          this.item3SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png";
          this.item5SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
        } else if (flag == 5) {
          this.show1 = false;
          this.show2 = false;
          this.show3 = false;
          this.show4 = false;
          this.show5 = !this.show5;
          this.item1SelectedColor = "#666666";
          this.item2SelectedColor = "#666666";
          this.item3SelectedColor = '#666666';
          this.item5SelectedColor = '#469DFC';
          this.item2SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
          this.item1SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
          this.item3SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png";
        }
      },

      //拖动圆点 查看地图
      goMap(e) {
        if (noStationType) {
          uni.navigateTo({
            url: '../mapView/mapView?noStationType=[1,4]'
          });
        } else {
          uni.navigateTo({
            url: '../mapView/mapView'
          });
        }
      },

      bindPickerChange(e) {
        console.log(e, "切换省份");
        var value = e.detail.value;
        // console.log(this.areaData[value[0]].children);
        if (value[0] != null) {
          this.cityArr = this.areaData[value[0]].children;
          this.stationPicker = value;
		  console.log(this.stationPicker,"选中的值")
        }

      },

      confirmEvent() {
        var areaData = this.areaData;
        var stationPicker = this.stationPicker;
        let distinguish = 1;
        this.show4 = false;

        if (stationPicker) {
			console.log(areaData[stationPicker[0]].code)
          this.stationValue = [areaData[stationPicker[0]].code, areaData[stationPicker[0]].children[stationPicker[1]]
            .code
          ];
          this.item3SelectText = areaData[stationPicker[0]].children[stationPicker[1]].name.length <= 4 ? areaData[
              stationPicker[0]].children[stationPicker[1]].name : areaData[stationPicker[0]].children[stationPicker[1]]
            .name.substring(0, 3) + '...'
        } else {
          this.stationValue = [areaData[0].code, areaData[0].children[0].code];
          this.item3SelectText = areaData[0].children[0].name.length <= 4 ? areaData[0].children[0].name : areaData[0]
            .children[0].name.substring(0, 3) + '...'
        }
        console.log(this.keyword,"测试搜索")
        this.getList('refresh', pageStart, this.keyword, distinguish);
      },

      cancelEvent() {
        this.stationValue = [];
        this.show4 = false;
        this.item3SelectText = '全国';
        this.getList('refresh', pageStart, this.keyword);
      },

      getNationDict() {
        var params = {
          scope: 2
        };
        var that = this;
        util.postRequest(api.getNationDict, params).then(res => {
			// console.log(res, '省市区111111')
          if (res.retCode == "0000000") {
            that.areaData = res.rspBody.children;
            that.cityArr = res.rspBody.children[0].children;
          } else {

          }
        }).catch(err => {

        });
      },

      longEvent: function () {
        var that = this;
		if (app.globalData.socketTask) {
			app.globalData.socketTask.close();
		}
        longLink.longEvent(this, function (res) {
          console.log(res);

          if (res.sn == 2) { //that.updata()
          }
        });
      },

      cardCountEvent() {
		  let that = this;
        util.postRequest(api.cardCount, {
          cardType: 1
        }).then(res => {
          if (res.retCode == "0000000") {
            if (res.rspBody == 0) {
              noStationType = true;
            } else {
              noStationType = false;
            } // console.log(444);
			var isOpen = that.checkOpenGPSService();
			if (isOpen) {
				that.isHasPower = true;
				that.getList('refresh', pageStart, that.keyword);
			} else {
				uni.showModal({
				  title: "提示",
				  content:"将获取您的定位权限以向您显示附近的电站",
				  icon: 'none',
				  success(res) {
					if (res.confirm) {
						that.isHasPower = true;
						that.getList('refresh', pageStart, that.keyword);
					} else {
						that.isHasPower = false;
						that.getList('refresh', pageStart, that.keyword);
					}
				    
				  }
				
				});
			}
		
		
          } else {
            uni.showToast({
              title: res.retDesc,
              icon: 'none'
            });
          }
        });
      },

      viewTouchMove: function (e) {
        var screenWidth = uni.getSystemInfoSync().windowWidth;
        var screenHeight = uni.getSystemInfoSync().windowHeight;

        if (e.touches[0].clientX > 0 && e.touches[0].clientY > 0 && e.touches[0].clientX < screenWidth - 30 && e
          .touches[0].clientY < screenHeight - 100) {
          this.left = e.touches[0].clientX;
          this.top = e.touches[0].clientY;
        } else {
          this.left = screenWidth - 60;
          this.top = screenHeight - 150;
        }
      },
      clickItem: function (e) {
        var flag = e.currentTarget.dataset.flag;
        var that = this;
        console.log(this.item1Arr[flag]);
        let distinguish = 1;
        that.item1Status = flag;
        that.item1SelectText = this.item1Arr[flag];
        that.show1 = !this.show1;
        that.listData = [];
        that.getList('refresh', pageStart, that.keyword, distinguish);
      },
      clickOilItem: function (e) {
        var flag = e.currentTarget.dataset.flag;
        var that = this;
        let distinguish = 1;
        that.item2Status = flag;
        that.item2SelectText = this.item2Arr[flag].fuelName;
        that.show2 = !this.show2;
        that.item2Id = this.item2Arr[flag].id;
        that.listData = [];
        that.getList('refresh', pageStart, this.keyword, distinguish);
      },

      clickKMItem(e) {
        var flag = e.currentTarget.dataset.flag;
        console.log(flag);
        var that = this;
        that.item3Status = flag;
        that.item3SelectText = this.item3Arr[flag].type;
        that.show4 = !this.show4;
        that.item3Id = this.item3Arr[flag].id;
        that.listData = [];
        that.flagIndex = flag;
        that.getList('refresh', pageStart);
      },

      //优惠类型选中事件
      clickType(e) {
        var flag = e.currentTarget.dataset.flag;
        var that = this;
        that.item5Status = flag;
        that.item5SelectText = this.item5Arr[flag].type;
        that.show5 = !this.show5;
        that.listData = []; // flagIndex: flag,
        that.getList('refresh', pageStart);
      },

      selectItem: function (e) {
        const map = e.currentTarget.dataset.map;
        const lotteryOpen = map.lotteryOpen;
        const id = map.id;
        const stationType = map.stationType;
        const couponFlag = map.couponFlag;
        console.log(e);
        console.log(map);
        uni.navigateTo({
          url: '../oilstationDetail/oilstationDetail?id=' + id + '&stationType=' + stationType + "&lotteryOpen=" +
            lotteryOpen + '&couponFlag=' + couponFlag
        });
      },
      getFuelitem: function () {
        var that = this;
        var parm = {};
        util.postRequest(api.fuelitem, parm).then(function (res) {
          // console.log(res);
          uni.hideLoading();
          console.log('============>', res)
          if (res.retCode == '0000000') {
            if (res.rspBody.length > 0) {
              let index = res.rspBody.findIndex(element => element.fuelName == "0#柴油");
              that.item2Status = index;
              that.item2Arr = res.rspBody;
              that.item2Id = res.rspBody[index].id;
              that.fuelName = res.rspBody[index];
              that.item2SelectText = res.rspBody[index].fuelName;
              that.getList('refresh', pageStart, that.keyword);
            }
          } else {
            uni.showToast({
              title: res.retDesc,
              icon: 'none'
            });
          }
        });
      },
	  checkOpenGPSService(){
	  	//定位权限判断
	  	let systemType = uni.getSystemInfoSync().platform;
	  	if(systemType ==='android'){
	  		var isOpen = PemissionModule.isLocationOpen();
	  		return isOpen;
	  		// return true;
	  	} else {
	  		return true;
	  	}
	  },

		
      getList(type, currentPage, compName, distinguish) {
        // console.log(distinguish,"distinguish");
        // console.log(type, currentPage, compName, distinguish);
        // console.log(type, currentPage, compName)
        this.requesting = true;
        var that = this; // console.log(this.data.item1Status)

        var item1 = parseInt(this.item1Status) + 1;
        var item2 = this.item2Id;
        var flag = this.flagIndex; // console.log(flag);
		
        var distanceLimit = this.item3Arr[flag].value; // console.log(distanceLimit);
		if (this.isHasPower) {
			qqmapsdk.reverseGeocoder({
			  success: function (res) {
			    // console.log(res);
			    var parm = {
			      pageSize: 10,
			      pageNum: currentPage,
			      fuelItemId: item2,
			      latitude: res.result.address_reference.landmark_l2.location.lat,
			      longitude: res.result.address_reference.landmark_l2.location.lng,
			      sortType: item1,
			      // compName: compName,
			      searchParam: compName,
			      // distanceLimit: distinguish ? '' : 50
				  distanceLimit: '',
			    };
			
			    if (compName) {
			      delete parm.distanceLimit;
			    }
			
			    if (distanceLimit) {
			      parm.siteType = distanceLimit;
			    } // if (noStationType) {
			    //     parm.noStationType = [1, 4];
			    // } else {
			    //     delete parm.noStationType;
			    // }
			
			
			    var driverInfo = uni.getStorageSync('driverInfo');
			    if (driverInfo) {
			      parm.userId = driverInfo.userId;
			    } else {
			      delete parm.userId;
			    }
			
			    if (that.item5Status) {
			      parm.levelId = that.item5Status;
			    }
			
			    if (that.stationValue) {
			      parm.provinceName = that.stationValue[0];
			      parm.cityName = that.stationValue[1] == 0 ? '' : that.stationValue[1];
			    }
			
			    if (that.isHighway > -1) {
			      parm.isHighway = that.isHighway;
			    } //如果是高速站点 去掉默认5000米限制
			    // if(that.data.isHighway != -1) {
			    //     parm.distanceLimit = ''
			    // }
			
			
			    console.log(parm, "parm");
			    util.postRequest(api.oilstationList, parm).then(function (res) {
			      uni.stopPullDownRefresh()
				  console.log(res, '油站吧数据11')
			      if (res.retCode == '0000000') {
			        that.requesting = false;
			        var list = res.rspBody.items;
			        if (type == 'refresh') {
			          if (list.length > 0) {
			            that.listData = list;
			            that.page = currentPage + 1;
			            that.end = false;
			            that.requesting = false;
			          } else {
			            that.listData = [];
			            that.end = false;
			            that.requesting = false;
			            uni.showToast({
			              title: '暂无数据',
			              icon: 'none'
			            });
			          }
			        } else {
			          if (list.length > 0) {
			            that.listData = that.listData.concat(list);
			            that.page = currentPage + 1;
			            that.end = false;
			          } else {
			            that.end = true;
			            uni.showToast({
			              title: '暂无更多数据',
			              icon: 'none'
			            });
			          }
			        }
			      } else {
			        that.end = false;
			        that.requesting = false;
			        uni.showToast({
			          title: res.retDesc,
			          icon: 'none'
			        });
			      }
			    });
			  },
			  fail: function (err) {
			    console.log(err);
				uni.showToast({
					title: '请打开定位',
					icon: 'none'
				})
			  }
			});
		} else {
		
			    // console.log(res);
			    var parm = {
			      pageSize: 10,
			      pageNum: currentPage,
			      fuelItemId: item2,
			      latitude: 39.91667,
			      longitude: 116.41667,
			      sortType: item1,
			      // compName: compName,
			      searchParam: compName,
			      // distanceLimit: distinguish ? '' : 50
				  distanceLimit: '',
			    };
			
			    if (compName) {
			      delete parm.distanceLimit;
			    }
			
			    if (distanceLimit) {
			      parm.siteType = distanceLimit;
			    } // if (noStationType) {
			    //     parm.noStationType = [1, 4];
			    // } else {
			    //     delete parm.noStationType;
			    // }
			
			
			    var driverInfo = uni.getStorageSync('driverInfo');
			    if (driverInfo) {
			      parm.userId = driverInfo.userId;
			    } else {
			      delete parm.userId;
			    }
			
			    if (that.item5Status) {
			      parm.levelId = that.item5Status;
			    }
			
			    if (that.stationValue) {
			      parm.provinceName = that.stationValue[0];
			      parm.cityName = that.stationValue[1] == 0 ? '' : that.stationValue[1];
			    }
			
			    if (that.isHighway > -1) {
			      parm.isHighway = that.isHighway;
			    } //如果是高速站点 去掉默认5000米限制
			    // if(that.data.isHighway != -1) {
			    //     parm.distanceLimit = ''
			    // }
			
			
			    console.log(parm, "parm");
			    util.postRequest(api.oilstationList, parm).then(function (res) {
			      uni.stopPullDownRefresh()
				  console.log(res, '油站吧数据11')
			      if (res.retCode == '0000000') {
			        that.requesting = false;
			        var list = res.rspBody.items;
			        if (type == 'refresh') {
			          if (list.length > 0) {
			            that.listData = list;
			            that.page = currentPage + 1;
			            that.end = false;
			            that.requesting = false;
			          } else {
			            that.listData = [];
			            that.end = false;
			            that.requesting = false;
			            uni.showToast({
			              title: '暂无数据',
			              icon: 'none'
			            });
			          }
			        } else {
			          if (list.length > 0) {
			            that.listData = that.listData.concat(list);
			            that.page = currentPage + 1;
			            that.end = false;
			          } else {
			            that.end = true;
			            uni.showToast({
			              title: '暂无更多数据',
			              icon: 'none'
			            });
			          }
			        }
			      } else {
			        that.end = false;
			        that.requesting = false;
			        uni.showToast({
			          title: res.retDesc,
			          icon: 'none'
			        });
			      }
			    });
			  
			 
		
		}
		
		
      },

      // 刷新数据
      refresh() {
        let distinguish = 1;
        if (!this.requesting) {
          this.getList('refresh', pageStart, this.keyword, distinguish);
          this.empty = false;
        }

      },

      // 加载更多
      more() {
        let distinguish = 1;
        console.log("加载更多");
        if (!this.requesting && !this.end) {
          this.getList('more', this.page, this.keyword, distinguish);
        }
      },

      clickDisappear: function () {
        this.show1 = false;
        this.show2 = false;
        this.show5 = false;
        this.show4 = false;
      }
    }
  };
</script>
<style>
  @import "./oilstationIndex.css";
</style>