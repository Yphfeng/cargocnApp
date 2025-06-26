<template>
<view>
<scroll-view class="container" scroll-y="true" v-if="isLoading">
	<view class="midView">
		<view>
			<image mode="scaleToFill" style="margin: 0rpx;" src="https://cargocn-hhy.oss-cn-beijing.aliyuncs.com/20200810160934.png"></image>
		</view>
	</view>
	<view class="oilInfoView">
		<view class="voucher-identification" v-if="couponFlag == 'true'">
			<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/coupons_icon.png">
			</image>
		</view>
		<view class="oilInfoView_box">
			<text class="oilInfoView_name">{{textData.secondName}}
			</text>
			<view class="statusView">
				<image src="/static/images/jym/icon_oil_business.png"></image>
				<text>
					<span v-if="textData.status==0" class="locking">已锁定</span>
					<span v-else>营业中</span>
					<span v-if="textData.businessHours" style="margin-left: 10rpx">{{textData.businessHours}}</span>
				</text>
				<!-- <image style="margin-left:40rpx;" src="../../../images/icon_oil_phone.png"></image>
				<rich-text bindtap="clickToTel" data-tel="{{textData.compContactPhone}}">{{textData.compContactPhone}}</rich-text> -->
			</view>
			<view class="oilInfoView_Address">{{textData.address}}</view>
			<view class="oilInfoView_Distance" @tap.stop="onTapNav" hover-stop-propagation="true" :data-map="textData">
				<image src="/static/images/jym/icon_oil_location.png"></image>距离位置{{textData.distance}}km
			</view>
			<view class="oilInfoView_Distance1 wrap-box" @tap.stop="onTapNav" hover-stop-propagation="true">
				<view v-for="(item, index) in oilStationInfo.stationDetail.tagList" :key="index" class="gear-right">{{item}}
				</view>
			</view>
		</view>
		<image class="oilInfoView_Img" src="/static/images/jym/bj_station.png"></image>
		<view class="getluck" @tap.stop="clickBtn2" v-if="lotteryOpen=='1'?true:false">
			<view>去抽奖 </view>
		</view>
	
	</view>

	<view class="groupView" v-if="oilStationInfo.grouponList==''?false:true">
		<view class="groupView_Top">
			<view class="groupView_Top1">
				<text>{{oilStationInfo.makeGroupNowIngNum}}人正在拼团，可直接参与</text>
			</view>
			<view class="groupView_Top2" @tap="seeAll">
				<text>查看全部</text>
				<image src="/static/images/jym/icon_right.png"></image>
			</view>
		</view>
		<block v-for="(item, index) in grouponList" :key="index" :data-map="item">
			<view class="groupView_content">
				<view class="groupView_content1">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_user.png"></image>
					<view class="groupView_user">
						<text>{{phone.toHide(item.mobile)}}</text>
					</view>
				</view>
				<view class="groupView_oil" style="color: rgb(255, 153, 0);">{{item.fuelName}}</view>
				<view class="groupView_content2">
					<view class="groupView_oil" style="color: rgb(255, 51, 0)">￥{{item.fuelAmount}}元</view>
					<view class="groupView_content3" :data-item="item.grouponNo" @tap="addGroup">参与</view>
				</view>
			</view>
		</block>
	</view>
	<view class="priceView">
		<view class="title1" v-if="groupStatus==1?false:true">
			<view>油品型号</view>
			<view style="text-align: center;">标准价</view>
		</view>
		<view class="title1" v-if="groupStatus==1?true:false">
			<view>油品型号</view>
			<view>标准价</view>
			<!-- <view>拼团价</view> -->
		</view>
		<view class="fuelListView">
			<block v-for="(item, index) in fuelsList" :key="index">
				<view class="price">
					<view>{{item.fuelName}}</view>
					<text>{{item.fuelPrice}}
						<text> 元/{{item.fuelUnit}}</text>
					</text>
					<!-- <rich-text wx:if="{{groupStatus==1&&item.fuelGrouponPrice!=0?true:false}}">{{item.fuelGrouponPrice}}
						<text> 元/{{item.fuelUnit}}</text>
					</rich-text>
					<rich-text wx:elif="{{groupStatus==1?true:false}}">
						<text>不可拼团</text>
					</rich-text> -->
				</view>
			</block>
		</view>
	</view>
	<view class="bottomBtnContainer">
		<view class="btnLeftContainer" :style="'background:' + (textData.status==2?bgColor3:bgColor4)" @tap="clickBtn1">
			<text> 我要加油</text>
		</view>
		<!-- <view wx:if="{{groupStatus==1&&fo!=2?true:false}}" class="btnLeftContainer btnLeftContainer1"
			style="background:{{fo==0?bgColor:fo==1?bgColor:fo==2?bgColor1:fo==3?bgColor2:bgColor3}}"
			bindtap="clickBtn3" data-item="{{minConsumeAmount}}">
			<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_spell.png"></image>
			<text> {{fo==0?text:fo==1?text1:fo==2?text2:fo==3?text3:text4}}</text>
		</view>
		<button wx:elif="{{groupStatus==1&&fo==2?true:false}}" open-type="share"
			class="btnLeftContainer btnLeftContainer1"
			style="background:{{fo==0?bgColor:fo==1?bgColor:fo==2?bgColor1:fo==3?bgColor2:bgColor3}}"
			bindtap="clickBtn3">
			<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_spell.png"></image>
			<text> {{fo==0?text:fo==1?text:fo==2?text2:fo==3?text3:text4}}</text>
		</button> -->
	</view>
</scroll-view>
<!-- 遮罩层 -->
<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal"></view>
<!-- 弹出层 -->
<view class="modalDlg" v-if="showModal">
	<view class="modal_top">
		正在拼团
		<image @tap="close" class="modalDlg_close" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_close.png"></image>
	</view>
	<scroll-view class="modalDlg_content" scroll-y="true">
		<view v-for="(item, index) in oilStationInfo.grouponList" :key="index" class="groupView_content popupView" :data-map="item">
			<view class="groupView_content1 popupView1">
				<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_user.png"></image>
				<view class="groupView_user"><text>{{phone.toHide(item.mobile)}}</text>
					<view> <text class="groupView_oil" style="color: rgb(255, 153, 0);">{{item.fuelName}}</text>
						<text class="groupView_oil" style="color: rgb(255, 51, 0);margin-left: 20rpx;">￥{{item.fuelAmount}}元</text></view>
				</view>
			</view>

			<view class="groupView_content2">
				<view class="groupView_content3 popupView3" :data-item="item.grouponNo" @tap="addGroup">参与</view>
			</view>
		</view>
	</scroll-view>
</view>

<!-- 遮罩层 -->
<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal2"></view>
<!-- 弹出层 -->
<view class="modalDlg1" v-if="showModal2">
	<view class="modal_top modal_top1">
		提示
	</view>
	<!-- <view class="modal_select">
		<text>您不是本站会员，请选择要开通的会员卡类型</text>
	</view>
	<checkbox-group wx:if="{{typeList.length!=0}}" class="checkboxlabel" bindchange="checkboxChange">
		<block   wx:for="{{typeList}}" wx:key="id" data-map="{{item}}">
			<view class="modal_oil_card" style="background: {{item.id==1?itemColor:item.id==2?itemColor1:itemColor2}};">
				<image style="width:{{item.id==2?'112rpx':item.id==3?'82rpx':'92rpx'}}" src="{{item.id==1?itemImg:item.id==2?itemImg1:itemImg2}}"></image>
				<text style="color: {{item.id==1?textColor:item.id==2?textColor1:textColor2}};">油站{{item.typeName}}卡</text>
				<view>
					<checkbox value="{{index}}" checked="{{item.checked}}" />
				</view>
			</view>
		</block>
		
	</checkbox-group> -->

	<view class="modal_oil_tips" v-if="typeList.length!=0">
		<text>您还没有加油么车队卡或平台卡，暂无法加油。
			请联系车队为您开卡，或致电：400 856 5886 咨询</text>
	</view>

	<view v-else class="modal_oil_card" style="background-color: #F7F7F7;">
		暂无油卡
	</view>
	<view class="modal_btm">
		<view @tap="cancel">取消</view>
		<view @tap="confirm">确认</view>
	</view>
</view>

<view class="bounced-box" v-if="showStation">
	<view class="black-box" @tap="cancelTap"></view>
	<view class="bounced-content">
		<view class="content-box">
			<!-- <image class="cancel-box" bindtap="cancelTap" src="/images/icon_cancel.png"></image> -->
			<view class="content-name">{{oilStationInfo.stationDetail.compName}}</view>
			<view class="contetn-reset">
				<img class="content-img" :src="refuel_img_url"></img>
				<view class="cover-box" v-if="refuelTime==0 && refuelShow==0"></view>
				<view class="reset-box" v-if="refuelTime==0 && refuelShow==0" @tap="getRefuelInfo">
					<image class="refresh-img" src="/static/images/jym/refresh.png"></image>
					<view class="refresh-text">请刷新</view>
				</view>
			</view>
			<view class="refresh-text" v-if="refuelTime!=0">{{refuelTime}}秒</view>
			<view class="content-prompt">请提醒加油员使用万金油扫码结算</view>
		</view>
		<view class="ok-btn" @tap="cancelTap">关闭</view>
	</view>
</view>
<view class="bounced-box" v-if="showPay || pushType">
	<view class="black-box" @tap="cancelTap"></view>
	<view class="bounced-content">
		<view class="content-box">
			<view class="content-name">油品信息确认</view>
			<view class="content-child price-type">{{popUpOrderInfo.fuelName}}</view>
			<view class="content-child price-num" v-if="popUpOrderInfo.fuelCouponAmount">¥{{popUpOrderInfo.fuelCouponAmount}}</view>
			<view class="content-child price-num" v-else>¥{{popUpOrderInfo.fuelAmount}}</view>
			<view class="price-content">
				<view class="price-child">
					<view>单价：{{popUpOrderInfo.fuelPrice}}</view>
					<view>加油量：{{popUpOrderInfo.fuelNum}}</view>
				</view>
				<view class="price-child">
					<!-- <view>现金折扣：{{couponInfor.cash ? couponInfor.cash : 0}}</view>
					<view>红包折扣：{{couponInfor.redPacket ? couponInfor.redPacket : 0}}</view> -->
					<view>现金优惠：{{couponInfor.cash ? couponInfor.cash : 0}}</view>
					<view v-if="couponInfor.redPacket">红包优惠：{{couponInfor.redPacket ? couponInfor.redPacket : 0}}</view>
					<view v-if="couponInfor.discount">折扣优惠：{{couponInfor.discount ? couponInfor.discount : 0}}</view>
				</view>
				<!-- <view class="price-child">枪号</view> -->
			</view>
		</view>
		<view class="operation-box">
			<view class="operation-child">
				<view class="cancel-btn" @tap="cancelPay">取消</view>
			</view>
			<view class="operation-child">
				<view class="pay-btn" @tap="payTap">确认支付</view>
			</view>
		</view>
	</view>
</view>
</view>
</template>

<script module="Amount" lang="wxs" src="./Amount.wxs"></script>
<script module="phone" lang="wxs" src="./phone.wxs"></script>

<script>
	
var api = require("@/config/api.js");
var util = require("@/utils/jym-utils/util.js");
var QQMapWX = require("@/utils/jym-utils/qqmap-wx-jssdk.min.js");

import * as longLink from "@/longLink/longLink"
var qqmapsdk = new QQMapWX({
  key: api.tentCentMapKey
});
const app = getApp(); //进入页面用户自己的经纬度
//进入页面用户自己的经纬度
var selfLatitude, selfLongitude;
var refuelTimer;
var socketTask;

export default {
  data() {
    return {
      isLoading: false,
      fuelsList: [],
      grouponList: [],
      minConsumeAmount: 0,
      bgColor: "#85C7C2",
      bgColor1: "#31B5BC",
      bgColor2: "#6C75DE",
      bgColor3: "#C3C3C3",
      bgColor4: "#6D9AED",
      groupStatus: 0,
      textData: {},
      oilStationInfo: '',
      fo: 0,
      stationId: 0,
      userId: 0,
      lotteryOpen: true,
      show1: false,
      show3: true,
      showModal: false,
      showModal2: false,
      typeList: [],
      fuelTypes: [],
      selfProcessOrder: {},
      text: "我要拼团",
      text1: "我要拼团",
      text2: "拼团中，可邀请",
      text3: "已拼团，去支付",
      text4: "拼团中",
      itemColor1: "#CEDFFD",
      itemColor: "#F8EABC",
      itemColor2: "#CFE9EB",
      textColor1: "#567BC3",
      textColor: "#EDA137",
      textColor2: "#3CADB9",
      itemImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasolineCard.png",
      itemImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_dieselCard.png",
      itemImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasCard.png",
      ddlist: {},
      showStation: false,
      refuel_img_url: '',
      refuelTime: 0,
      refuelShow: 1,
      showPay: false,
      popUpOrderInfo: {},
      //万金油支付返回信息
      couponInfor: {},
      //万金油支付用券折扣信息
      pushType: 0,
      couponFlag: false,
      stationType: "",
      personId: "",
      refuelTimer: 0,
	  straightDown: 0, //团油直降金额
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
	console.log('油站11111111')
	uni.setStorageSync("longLink", 1);
    console.log(options.id);
    console.log(options);
    uni.getStorage({
      key: 'driverInfo',
      success: function (res) {
        that.userId = res.data.userId;
      }
    });
    this.stationId = options.id;
      this.stationType = options.stationType;
      this.couponFlag = options.couponFlag; //券标识
    console.log(that.couponFlag, "couponFlag"); //万金油推送的油站信息，不是通过列表进入的本页面

    if (options.push) {
      var stationInfo = JSON.parse(options.stationInfo);
      console.log(stationInfo, "stationInfo");
      this.stationId = stationInfo.id;
        this.pushType = options.push;
        this.popUpOrderInfo = JSON.parse(options.pushInfo);
        this.couponInfor = JSON.parse(options.couponInfo);
        this.stationType = stationInfo.stationType;
    }

    uni.getStorage({
      key: 'driverInfo',
      success: function (res) {
        that.personId = res.data.attrs.personId;
      }
    });

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
    } 
	
	// this.init(options.id);
	
	
	uni.$on("refresh_socket", () => {
		
		console.log(app.globalData.socketTask, '111212121212121212121212')
		that.longEvent();
		
	})
  },
  
  onShow() {
	let that = this;
   // 获取当前的页面栈
	let pages = getCurrentPages();
	// 数组中索引最大的页面--当前页面
	let currentPage = pages[pages.length-1];
	console.log(currentPage.route)
	// 打印出当前页面中的 options
	let options = currentPage.options
	console.log(options.id);
	console.log(options);
	uni.getStorage({
	  key: 'driverInfo',
	  success: function (res) {
	    that.userId = res.data.userId;
	  }
	});
	this.stationId = options.id;
	  this.stationType = options.stationType;
	  this.couponFlag = options.couponFlag; //券标识
	console.log(that.couponFlag, "couponFlag"); //万金油推送的油站信息，不是通过列表进入的本页面
	
	if (options.push) {
	  var stationInfo = JSON.parse(options.stationInfo);
	  console.log(stationInfo, "stationInfo");
	  this.stationId = stationInfo.id;
	    this.pushType = options.push;
	    this.popUpOrderInfo = JSON.parse(options.pushInfo);
	    this.couponInfor = JSON.parse(options.couponInfo);
	    this.stationType = stationInfo.stationType;
	}
	
	uni.getStorage({
	  key: 'driverInfo',
	  success: function (res) {
	    that.personId = res.data.attrs.personId;
	  }
	});
	
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
	} // this.init(options.id);
	
	
	this.init(that.stationId);
	
	//每次启动连接socket
	uni.setStorageSync("longLink", false);
	if (app.globalData.socketTask) {
		app.globalData.socketTask.close();
	}
	if (app.globalData.consignorSocketTask) {
		app.globalData.consignorSocketTask.close();
	}
	setTimeout(() => {
		console.log('socket先关闭')
		longLink.longEvent();
		uni.setStorageSync("longLink", true)
	}, 2000)
		
  },
  // 转发
  onShareAppMessage: function (res) {
    let that = this;

    if (res.from === 'button') {}

    console.log(this.selfProcessOrder);
    var listData = {
      fuelType: this.selfProcessOrder.fuelType,
      fuelDictId: this.selfProcessOrder.fuelDictId,
      fuelGunId: this.selfProcessOrder.fuelGunId,
      grouponNo: this.selfProcessOrder.grouponNo,
      fuelName: encodeURIComponent(this.selfProcessOrder.fuelName),
      stationId: this.selfProcessOrder.stationId,
      opId: this.selfProcessOrder.opId,
      fuelPrice: this.selfProcessOrder.fuelPrice,
      fuelUnit: this.selfProcessOrder.fuelUnit,
      fuelCouponPrice: this.selfProcessOrder.fuelCouponPrice,
      fuelNum: this.selfProcessOrder.fuelNum,
      fuelAmount: this.selfProcessOrder.fuelAmount,
      fuelCouponNum: this.selfProcessOrder.fuelCouponNum,
      couponAmount: this.selfProcessOrder.couponAmount,
      oneOrderId: this.selfProcessOrder.id,
      grouponUserType: 2,
      groupOnEndDt: this.selfProcessOrder.groupOnEndDt
    };
    return {
      title: '您的好友邀请您参加拼团加油',
      path: 'pages/forward/group/group?data=' + JSON.stringify(listData),
      imageUrl: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_group.png",
      success: function (res) {
        uni.navigateBack({
          changed: true
        });
      }
    };
  },

  onUnload() {
    clearInterval(refuelTimer);
  },

  methods: {
    seeAll() {
      this.showModal = true;
    },

    close() {
      this.showModal = false;
    },

    checkboxChange(e) {
      let arr = [];

      for (let i in e.detail.value) {
        arr.push(Number(e.detail.value[i]) + 1);
      }

      this.fuelTypes = arr;
    },

    confirm() {
      this.requestVip(this.fuelTypes);
    },

    // 开通油卡会员
    requestVip(fuelTypes) {
      if (fuelTypes.length == 0) {
        this.showModal2 = false;
      } else {
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
                uni.navigateBack({
                  delta: 1
                });
              }
            });
          } else {
            uni.showToast({
              title: res.retDesc,
              icon: 'none'
            });
          }
        });
      }
    },

    // 加入拼团
    addGroup(e) {
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

      let that = this;
      console.log(e.target.dataset.item);
      let list = {
        grouponNo: e.target.dataset.item
      };
      util.postRequest(api.getGroupon, list).then(function (res) {
        if (res.retCode == '0000000') {
          const list = res.rspBody;
          that.ddlist = list;
          var listData = {
            fuelType: that.ddlist.fuelType,
            fuelDictId: that.ddlist.fuelDictId,
            fuelGunId: that.ddlist.fuelGunId,
            grouponNo: e.target.dataset.item,
            // cardId: that.data.ddlist.cardId,
            stationId: that.ddlist.stationId,
            opId: that.userId,
            fuelPrice: that.ddlist.fuelPrice,
            stationId: that.ddlist.stationId,
            fuelUnit: that.ddlist.fuelUnit,
            fuelNum: that.ddlist.fuelNum,
            fuelAmount: that.ddlist.fuelAmount,
            oneOrderId: that.ddlist.oneOrderId,
            grouponUserType: 2,
            fuelCouponPrice: that.ddlist.fuelCouponPrice,
            fuelCouponNum: that.ddlist.fuelCouponNum,
            couponAmount: that.ddlist.couponAmount
          };
          console.log(listData);
          util.postRequest(api.launchAgroup, listData).then(function (res) {
            console.log(res);

            if (res.retCode == '0000000') {
              let list = res.rspBody;
              let id = list.orderEntity.id;
              list.orderEntity = that.ddlist;
              list.orderEntity.id = id;
              getApp().ddlist = list; // let arr1=arr.orderEntity;
              // that.setData({
              // 	showModal:false,
              // 	showModal1:true,
              // 	ddlist:arr1
              // })	

              uni.reLaunch({
                url: '/pages/oilstation/addOilPage/addOilIndex2/addOilIndex?group=' + 2 + "&flag=" + 2
              });
            } else {
              uni.showToast({
                title: res.retDesc,
                icon: 'none'
              });
            }
          });
        }
      });
    },

    longEvent() {
      var page = getCurrentPages();
	  console.log('jjjjjjhhhhhhhh')
      // var indexPage = page[0];
	  uni.$emit('long-event', 1);
      // indexPage.longEvent();
    },

    init(id) {
      var that = this;
      uni.showLoading({
        title: '请稍候'
      });
      console.log('xxxxxxx'); //初始化数据

      qqmapsdk.reverseGeocoder({
        success: function (res) {
          // console.log(res);
          selfLatitude = res.result.address_reference.landmark_l2.location.lat;
          selfLongitude = res.result.address_reference.landmark_l2.location.lng;
          var params = [{
            url: api.oilstationDetail,
            data: {
              id: id,
              stationType: that.stationType,
              userId: that.userId,
              latitude: selfLatitude,
              longitude: selfLongitude
            }
          }, {
            url: api.getSiteInfo,
            data: {
              stationId: id
            }
          }];
          util.postRequestAll(params).then(response => {
            that.isLoading = true;
            // console.log(response, '数据11');
            that.getOilstationDetail(response[0]);
            that.requestOilType(response[1]);
          }).catch(err => {
            that.isLoading = true;
            uni.hideLoading();
          });
        },
        fail: function (err) {
          console.log('lllllllllllllllll', err);
          that.isLoading = true;
          uni.hideLoading();
        }
      });
    },

    requestOilType(res) {
      const that = this;

      if (res.retCode == '0000000') {
        const list = res.rspBody.FUEL_TYPE;
        that.typeList = list;
      }
    },

    getOilstationDetail: function (res) {
      var that = this;

      if (res.retCode == '0000000') {
        that.fuelsList = res.rspBody.fuelsList;
		console.log(res.rspBody)
          that.oilStationInfo = res.rspBody;
          that.grouponList = res.rspBody.grouponList.slice(0, 2);
          that.fo = res.rspBody.makeGroupStatus;
          that.groupStatus = res.rspBody.isComOpenGroupon;
          that.minConsumeAmount = res.rspBody.minConsumeAmount;
          that.selfProcessOrder = res.rspBody.selfProcessOrder;
          that.textData = {
            name: res.rspBody.stationDetail.compName,
            secondName: res.rspBody.stationDetail.compSecondName,
            address: res.rspBody.stationDetail.compAddress,
            businessHours: res.rspBody.stationDetail.businessHours,
            status: res.rspBody.stationDetail.status,
            compContactPhone: res.rspBody.stationDetail.compContactPhone,
            licenseImgUrl: res.rspBody.stationDetail.licenseImgUrl,
            latitude: res.rspBody.stationDetail.latitude,
            longitude: res.rspBody.stationDetail.longitude,
            distance: res.rspBody.stationDetail.distance
          };
		  
        let lotteryOpenStatus = res.rspBody.lotteryOpenStatus;

        if (lotteryOpenStatus == undefined) {
          that.lotteryOpen = 0;
        } else {
          that.lotteryOpen = lotteryOpenStatus;
        }

        if (that.selfProcessOrder != undefined) {
          if (that.selfProcessOrder.orderStatus == 3 && that.fo == 4) {
            that.fo = that.selfProcessOrder.orderStatus;
          }
        }

        uni.setNavigationBarTitle({
          title: res.rspBody.stationDetail.compSecondName //页面标题为路由参数

        });
      } else {
        uni.showToast({
          title: res.retDesc,
          icon: 'none'
        });
      }
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

    // 拼团
    clickBtn3() {
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

      var oilStationInfo = this.oilStationInfo;

      if (oilStationInfo.stationDetail.status == 2) {
        uni.showToast({
          title: '该油站已锁定',
          icon: 'none'
        });
        return;
      }

      let that = this;
      util.postRequest(api.driverOilcardList, {}).then(function (res) {
        if (res.retCode == '0000000') {
          let list = res.rspBody;

          for (let i in list) {
            if (list[i].cardType == 1) {
              that.oilStationInfo.isOpenFuleCard = true;
            }
          }

          if (that.oilStationInfo.stationDetail.stationType == 1 && that.oilStationInfo.isOpenFuleCard == false) {
            uni.showModal({
              title: '提示',
              content: "您的账户没有车队卡，暂无法在主营油站加油，请与车队联系开卡事宜",
              showCancel: false
            });
            return;
          }

          if (that.oilStationInfo.isOpenFuleCard == true) {
            console.log(that.fo);

            if (that.fo == 4) {
              return;
            }

            if (that.fo == 3) {
              uni.navigateTo({
                url: '../addOilPage/payOil/payOil?map=' + JSON.stringify(that.selfProcessOrder) + "&group=" + 1
              });
            }

            if (that.fo == 2) {
              console.log(222);
            } else if (that.fo == 0 || that.fo == 1) {
              let parm = {
                id: Number(that.stationId)
              };
              let minConsumeAmount = that.minConsumeAmount;
              util.postRequest(api.getById, parm).then(function (res) {
                console.log('res', res);

                if (res.retCode == '0000000') {
                  uni.navigateTo({
                    url: '../addOilPage/addOilIndex/addOilIndex?map=' + JSON.stringify(res.rspBody) + "&flag=" + 2 + "&minConsumeAmount=" + minConsumeAmount + "&sign=" + 1
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
          } else {
            that.showModal2 = true;
          }
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    cancel() {
      this.showModal2 = false;
    },

    // 抽奖
    clickBtn2() {
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

      uni.navigateTo({
        url: '../luckDraw/luckDraw?id=' + this.stationId
      });
    },

    // 加油
    clickBtn1: function () {
      let that = this;
	  // var data = {
		 //  cardId: 900,
		 //  fuelAccuracyNum: "0.094251",
		 //  fuelAmount: "0.94",
		 //  fuelBeforePrice: 10,
		 //  fuelDictId: 11,
		 //  fuelGunId: 0,
		 //  fuelNum: "0.094",
		 //  fuelPrice: 10,
		 //  fuelType: 1,
		 //  isGroupon: 0,
		 //  opId: 0,
		 //  payToken: "7789ef6f08bd42a09ed19599bfb2443a",
		 //  payType: 4,
		 //  stationId: "21135",
		 //  userCouponIds: [""],
		 //  // wxCode: "043aBo1w3NrNCW2eYP0w3kUm2p0aBo1-",
	  // }
	  // console.log(data);
	  // util.postRequest(api.payForOil, data).then(res=>{
		 //  console.log(res)
		 //  var orderInfo = {
			//   appid: res.rspBody.order.wxParams.appid,
			//   noncestr: res.rspBody.order.wxParams.nonce_str,
			//   package:'Sign=WXPay',
			//   partnerid: res.rspBody.order.wxParams.mch_id,
			//   prepayid: res.rspBody.order.wxParams.prepay_id,
			//   timestamp: res.rspBody.order.wxParams.timestamp,
			//   sign: res.rspBody.order.wxParams.sign,
		 //  }
		 //  console.log(orderInfo);
		 //  uni.requestPayment({
		 //  	provider: 'wxpay',
		 //  	orderInfo: orderInfo,
		 //  	success: res1 => {
		 //  		console.log(res1)
		 //  	//  支付成功跳转
		  		
		 //  	},
		 //  	fail: (err) => {
		 //  		console.log(err)
		 //  		uni.showToast({
		 //  			title: "支付失败",
		 //  			icon: 'none'
		 //  		})
		 //  	},
		 //  	complete: (res2) => {
		 //  		// console.log(res2)
		 //  	}
		 //  });
	  // })
	  // return;
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

      var oilStationInfo = this.oilStationInfo;

      if (oilStationInfo.stationDetail.status == 2) {
        uni.showToast({
          title: '该油站已锁定',
          icon: 'none'
        });
        return;
      }

      var lat = this.textData.latitude;
      var lng = this.textData.longitude;
      var km = util.getDistance(lat, lng, selfLatitude, selfLongitude);

      if (km > 0.5) {
        uni.showModal({
          title: '提示',
          content: '您距离油站大于500m，确定加油吗?',
          success: function (res) {
            console.log(res);

            if (res.confirm) {
              if (that.stationType == 5 && that.oilStationInfo.stationDetail.isInputMoney == 0) {
                // if(that.data.oilStationInfo.isHaveFleetCard){
                //     that.getRefuelInfo();
                // } else{
                //     wx.showModal({
                //         title: '提示',
                //         content: "您的账户没有车队卡，暂无法在万金油加油，请与车队联系开卡事宜",
                //         showCancel: false,
                //     })
                // }
                that.getRefuelInfo();
              } else {
                that.addOil();
              }
            }
          }
        });
      } else {
        if (that.stationType == 5 && that.oilStationInfo.stationDetail.isInputMoney == 0) {
          that.getRefuelInfo();
        } else {
          that.addOil();
        }
      }
    },

    addOil() {
      var that = this;
      util.postRequest(api.driverOilcardList, {}).then(function (res) {
        if (res.retCode == '0000000') {
          let list = res.rspBody;

          for (let i in list) {
            if (list[i].cardType == 1 || list[i].cardType == 3) {
              that.oilStationInfo.isOpenFuleCard = true;
            }
          }

          if (that.stationType == 1 && that.oilStationInfo.isOpenFuleCard == false) {
            uni.showModal({
              title: '提示',
              content: "您的账户没有车队卡，暂无法在主营油站加油，请与车队联系开卡事宜",
              showCancel: false
            });
            return;
          }

          console.log(that.oilStationInfo.isOpenFuleCard);

          if (that.oilStationInfo.isOpenFuleCard == true) {
            var stationId = that.stationId;
            var stationType = that.stationType;
            var isInputMoney = that.oilStationInfo.stationDetail.isInputMoney;
            uni.navigateTo({
              url: '../addOilPage/addOilIndex/addOilIndex?stationId=' + stationId + '&stationType=' + stationType + '&isInputMoney=' + isInputMoney
            });
          } else {
            that.showModal2 = true;
          }
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    clickToTel: function (e) {
      console.log(e.currentTarget.dataset.tel);
      uni.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel
      });
    },

    getRefuelInfo() {
      var that = this;
      uni.showLoading({
        title: '请稍后',
        mask: true
      });
      util.postRequest(api.getRefuelInfo, {
        thirdPartyId: that.oilStationInfo.stationDetail.thirdPartyId,
        latitude: selfLatitude,
        longitude: selfLongitude
      }).then(function (res) {
        uni.hideLoading();
		console.log(res)
        if (res.retCode == '0000000') {
          that.showStation = true;
            that.refuel_img_url = res.rspBody.refuel_img_url;
            that.refuelShow = 1;
            that.refuelTime = 180;
			that.$forceUpdate();
          if (!app.globalData.socketTask) {
            that.longEvent();
			console.log('aasasa1121212')
			
          }

          var time_out = 10;
          refuelTimer = setInterval(function () {
            that.refuelTime = res.rspBody.time_out-- // refuelTime: time_out--
            if (that.refuelTime == 0) {
              that.refuelShow = 0;
              clearInterval(refuelTimer);
            }
          }, 1000);
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    cancelTap() {
      clearInterval(refuelTimer);
      this.showStation = false;
        this.refuelTimer = 0;
        this.refuelShow = 0;
    },

    payTap() {
      var data = this.popUpOrderInfo;
      console.log(data, "data");
      data.stationType = 5; 
	  data.straightDown=this.straightDown;
	  console.log(data);
	  this.showPay = false;
        this.pushType = 0;
      uni.navigateTo({
        url: '/pages/jymPages/oilstation/addOilPage/payOil/payOil?map=' + JSON.stringify(data)
      });
    },

    cancelPay() {
		uni.navigateBack({
			delta: 1
		});
      this.showPay = false;
        this.pushType = 0;
    }

  }
};
</script>
<style>
@import "./oilstationDetail.css";
</style>