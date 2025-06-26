<template>
	<view class="nSourceIndex">
	<!-- 	<view class="splash-btn" v-if="isShowSplashScreen">
			<text>{{splashNum}}</text>
			<view @click="toNextStep" style="padding-left: 16rpx;">跳过</view>
		</view>
		<image :src="splashScreen" class="splashScreen" v-if="isShowSplashScreen"></image> -->
		<view class="optionsHead">
			<view class="userPositioning">
				<image class="pIcon" @click="checkLocation1" src="/static/images/vehicleOptions/UserPositioning.png"></image>
				<view class="msg" @click="checkLocation1">{{addressLocation ? addressLocation : '请定位'}}</view>
			</view>
			<!-- <view class="testBtn" @click="jumpToTestPage">测试跳转</view> -->
		</view>
		<view class="luck_draw" @mousemove="move" @touchmove.stop="move" :style="{ top: position.y + 'px', left: position.x + 'px' }" :class="hideFixedIcon ? 'hide_icon':''" v-if="avticeIconObj.luckDrawFlag" >
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/cargo_index_vip.GIF" @click="goVip" class="advers-close"></image>
			<image class="close_act" src="/static/images/ChinaTravel/close.png" @click="closeLuckDrawlAct"></image>
		</view>
		<swiper class="swiperBox" v-if="(advImgList && advImgList[0].advUrl) || (memberImgList && memberImgList[0].advUrl)" :autoplay="true">
			<swiper-item v-if="advImgList && advImgList[0].advUrl">
				<view class="advertisingBox" @click="jumpToAdvertising(advImgList[1])">
					<image class="advImg" :src="advImgList[0].advUrl"></image>
				</view>
			</swiper-item>
			<swiper-item v-if="memberImgList && memberImgList[0].advUrl">
				<view class="advertisingBox" @click="jumpToAdvertising(memberImgList[1])">
					<image class="advImg" :src="memberImgList[0].advUrl"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="noticeBox">
			<image class="noticeIcon" src="/static/images/vehicleOptions/noticeIcon.png"></image>
			<uni-notice-bar
				v-if="hintSwiperText"
				background-color="transparent"
				color="#F78B30"
				:speed="50"
				scrollable="true"
				single="true"
				:text="hintSwiperText">
			</uni-notice-bar>
		</view>
		
		<view class="mainSearchDataBox">
			<view class="searchDataContent">
				<view class="settingBtn" @click="goSetting">去配置</view>
				<view class="dataBox">
					<view class="title">使用车型</view>
					<view class="noSettingAry" v-if="carAry.length == 0">您还没配置车辆，快去配置吧</view>
					<view style="padding: 0 0 0 34rpx;">
						<view class="scrollDataGroup" v-if="carAry.length > 0">
							<view class="dataGroup">
								<view class="dataBtn carBtn" v-for="(item, cIndex) in carAry" :key="cIndex" @click="checkCar(item)" :class="checkedCar == item.sid ? 'checkedDataBtn' : 'defaultDataBtn'">
									{{item.tagName}}
								</view>
							</view>
						</view>
					</view>
					
					<view class="title" style="margin-top: 14rpx;">货源线路</view>
					<view class="noSettingAry" v-if="lineAry.length == 0">您还没配置线路，快去配置吧</view>
					<view style="padding: 0 0 0 34rpx;">
						<view class="scrollDataGroup" v-if="lineAry.length > 0">
							<view class="dataGroup">
								<view class="dataBtn carBtn" v-for="(item, lIndex) in lineAry" :key="lIndex" @click="checkLine(item)" :class="checkedLine == item.sid ? 'checkedDataBtn' : 'defaultDataBtn'">
									{{showSenderAddr(item.senderAddr)}}到{{showReceiverAddr(item.receiverAddr)}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="searchBtn" @click="checkSearchMsg()">
				<view class="btn-msg">搜车源</view>
				<view class="bg-gradient" />
			</view>
		</view>
		<view class="listBtnGroup" id="listSelect" :style="selectBoxSticky">
			<view class="selectBtnGroup" v-if="carInfo.length > 0 || noData">
				<view class="selectBox" @click="showSelectPopup()" style="min-width: 168rpx;margin-right:20rpx;">
					<view class="msg" :style="selectCityParams.name ? 'color: #3489E9;' : 'color: #333;'">{{selectCityParams.name ? showSelectAddr(selectCityParams.name) : '地区'}}</view>
					<image class="selectIcon" :src="selectCityParams.name ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
				</view>
			</view>
			<view class="rightBtnBox">
				<view class="mapBtn" @click="goMap" v-if="carInfo.length > 0 || noData">
					<image class="mapIcon" src="/static/images/newIndex/mapIcon.png"></image>
					<view class="msg">地图</view>
				</view>
				<view class="mapBtn" @click="jumpToSourceHistory()">
					<view class="msg">已查看车辆</view>
				</view>
			</view>
		</view>
		
		<view class="carOptionList" v-for="(item, index) in carInfo" :key="index">
			<view class="listMsgBox">
				<view class="leftContent">
					<view class="avatar-icon">
						<image class="avatar" :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
						<image class="vipIcon" src="/static/images/newFleetDetails/redVip.png" v-if="beidouList[index] && beidouList[index].isBeiDou == 1 && showAddr(index)"></image>
						<image class="vipIcon" src="/static/images/newFleetDetails/blueVip.png" v-if="beidouList[index] && (beidouList[index].isBeiDou == 2 || beidouList[index].isBeiDou == 3 || beidouList[index].isBeiDou == 4) && showAddr(index)"></image>
					</view>
					<view class="driverStatusBox">
						<view class="statusIcon" :style="item.taskStatus == 1 ? 'background-color: #4ACD1B;' : 'background-color: #E2633B;'"></view>
						<view class="statusMsg" :style="item.taskStatus == 1 ? 'color: #4ACD1B;' : 'color: #E2633B;'">{{item.taskStatus == 1 ? '可接单' : '忙碌'}}</view>
					</view>
				</view>
				<view class="rightContent">
					<view class="itemDriver">
						<text class="driverName" v-if="item.driverName">{{showName(item.driverName)}}</text>
						<text class="driverMobile" v-if="!item.driverName">{{showPhone(item.driverPhone)}}</text>
						<text class="driverCar">{{item.carLength ? item.carLength + '米' : ''}}{{item.carModel ? item.carModel : ''}}</text>
					</view>
					<view class="driverMsg">
						<view class="itemAddress" v-if="item.sender && item.receiver">{{showListSenderAddr(item.sender)}} - {{showListReceiverAddr(item.receiver)}}</view>
						<view class="detailsBtn" @click="jumpToDriverDetails(item.userId, item.checkStatus)">
							<text class="msg">详情</text>
							<image class="icon" src="/static/images/newFleetDetails/blueRightIcon.png"></image>
						</view>
					</view>
					<view class="itemDetails">
						<view class="addressDetailsBox" v-if="beidouList.length > 0">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_beidou.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 4 && showAddr(index)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_wx.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 3 && showAddr(index)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_box.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 1 && showAddr(index)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_app.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 2 && showAddr(index)"></image>
							<view class="addr_text">{{showAddr(index)}}</view>
						</view>
						<view class="sourceCheckedMsg">{{showDate(index)}}</view>
					</view>
					<view class="driverSyb" v-if="item.tagList.ROAD_TYPE || item.tagList.OFTEN_AREA || item.tagList.FAVORITE_CARGO || item.checkStatus == 1">
						<view class="sybBox">
							<view class="sybList" v-if="item.tagList.FAVORITE_CARGO">{{item.tagList.FAVORITE_CARGO}}</view>
							<view class="sybList" v-if="item.tagList.OFTEN_AREA">{{item.tagList.OFTEN_AREA}}</view>
							<view class="sybList" v-if="item.tagList.ROAD_TYPE">{{item.tagList.ROAD_TYPE}}</view>
						</view>
						<view class="hasWatch">{{item.checkStatus == 1 ? '您查看过' : ''}}</view>
					</view>
				</view>
			</view>
			<view class="listBtnBox">
				<view class="groupLine"></view>
				<view class="userListBtnGroup">
					<view class="btnBox" @click="toTrackSimple(item)">
						<image class="icon" src="/static/images/newFleetDetails/trajectory.png"></image>
						<view class="msg">轨迹</view>
					</view>
					<view class="btnBox" v-if="!item.isCollect" @click="checkCollectNum(item, index)">
						<image class="icon" src="/static/images/newFleetDetails/collection.png"></image>
						<view class="msg collectionMsg">收藏TA</view>
					</view>
					<view class="btnBox" v-if="item.isCollect == 1">
						<image class="icon" src="/static/images/newFleetDetails/collectioned.png"></image>
						<view class="msg collectionMsg">已收藏</view>
					</view>
					<view class="btnBox" @click="toCallUser(item, index)">
						<image class="icon" src="/static/images/newFleetDetails/mobile.png"></image>
						<view class="msg">联系TA</view>
					</view>
				</view>
			</view>
		</view>
		<view class="loadingBox" v-show="noData">
			<image class="noDataIcon" src="/static/images/vehicleOptions/newNodata.png"></image>
		</view>
		<view class="loadingBox" v-show="noData">
			暂无当前范围的车源～
		</view>
		<view class="loadingBox" v-show="noMore">没有更多了～</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="/static/images/listLoading.png"></image>
			努力加载中…
		</view>
		
		<uni-popup ref="mainRspMsgPopup" type="center">
			<view class="rspMsgBox">
				<view class="msgText">{{rspMsg}}</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="noSourceNumPopup" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle">提示</view>
					<view class="mainContent">您今天剩余可查询车辆条数为{{remainingNum}}条，可点击下面了解详情</view>
					<view class="singleTouUpBtn" @click="jumpToSingleTopup()">
						<view class="msg" v-if="firstTouUp == 1">充值{{couponAccountObj.pointFirstPrice ? couponAccountObj.pointFirstPrice / 1000 : 0}}元，查看{{couponAccountObj.pointNum ? couponAccountObj.pointNum : 0}}条最新车源，去充值</view>
						<view class="msg" v-if="!firstTouUp">充值{{couponAccountObj.pointPrice ? couponAccountObj.pointPrice / 1000 : 0}}元，查看{{couponAccountObj.pointNum ? couponAccountObj.pointNum : 0}}条最新车源，去充值</view>
						<image class="sigleRightIcon" src="/static/images/vehicleOptions/sigleRight.png"></image>
					</view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">
						<view class="msg">开通会员，享{{mealBaseInfo ? mealBaseInfo : 0}}条车源/天推荐</view>
						<view class="toBuyBtn">
							<view class="btnText">去购买</view>
							<image class="membersRightIcon" src="/static/images/vehicleOptions/membersRight.png"></image>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="noFleetNumPopup" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoFleetNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle">提示</view>
					<view class="mainContent">您车队人数已经达到上限啦，快来点击下面了解详情吧</view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">
						<view class="msg">开通会员，可邀请{{fleetBaseInfo ? fleetBaseInfo : 0}}位司机加入您的车队</view>
						<view class="toBuyBtn">
							<view class="btnText">去购买</view>
							<image class="membersRightIcon" src="/static/images/vehicleOptions/membersRight.png"></image>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="locationPermissionsPopup" type="center">
			<view class="sweetHintBox">
				<image class="sweetHintIcon" src="../../../static/images/newIndex/sweetHint.png"></image>
				<view class="sweetHintContent">
					<view class="title">温馨提示</view>
					<view class="msg">为了更好向您基于地理位置的服务，将向您申请开启定位权限，相关服务包括：推荐附近的服务、包括适合的线路、货源等。</view>
					<view class="btn" @click="getSupperFleetProcess">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="sourceSelectPopup" type="top">
			<view class="sourceSelectBox">
				<view class="selectHead">
					<view class="selectBox" @click="showPopupDetails(1)" style="min-width: 168rpx;margin-right:20rpx;">
						<view class="msg" :style="popupDetails == 1 ? 'color: #3489E9;' : 'color: #333;'">{{popupCityParams.name ? popupCityParams.name : '地区'}}</view>
						<image class="selectIcon" :class="popupDetails == 1 ? 'toRolate' : ''" :src="popupDetails == 1 ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
					</view>
				</view>
				<view class="selectBody" v-if="popupDetails == 1">
					<view class="selectTitleItem">
						<view class="title">省份</view>
						<view class="title">城市</view>
					</view>
					<view class="selectAddressBox">
						<scroll-view class="province-item" style="flex: 0 0 260rpx;" :scroll-y="true">
							<view class="selectMsg" v-for="(item, index) in provinceArr" @click.stop="switchProIndex(index)">
								<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="selectedProvinceIndex == index"></image>
								<text class="msg" :style="selectedProvinceIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{replaceProvince(item.name)}}</text>
							</view>
						</scroll-view>
						<scroll-view class="province-item" :scroll-y="true">
							<view class="selectMsg" v-for="(item, index) in cityArr" @click.stop="switchCityIndex(index)">
								<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="selectedCityIndex == index"></image>
								<text class="msg" :style="selectedCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{item.shwowName ? item.shwowName : item.name}}</text>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="pop-btn">
					<view class="pop-btn-item reset" @click.stop="toResetSelectData()">重置</view>
					<view class="pop-btn-item look" @click.stop="toSelectSouce()">查看</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="driverPop" type="center">
			<view class="driverPop">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/driver-pop-close.png" class="driver-pop-close" @click="popClose"></image>
				<view class="driverPop-title">
					在您的周边有1345名{{chooseCar}}活跃司机
				</view>
				<view class="driverPop-sub-title">
					<text class="driverPop-sub-title-text">输入卸货地，会更精准为您匹配。</text>
				</view>
				<view class="driverPop-label-item">
					<text class="driverPop-label">装货地</text>
					<view class="driverPop-input" @click="openNewRegionPopup(0)">
						<text>{{zhuangLocation.senderAddr || '请选择'}}</text>
					</view>
				</view>
				<view class="driverPop-label-item driverPop-label-item-last">
					<text class="driverPop-label">卸货地</text>
					<view class="driverPop-input" @click="openNewRegionPopup(1)">
						<text>{{xieLocation.receiverAddr || "请选择"}}</text>
					</view>
				</view>
				<view class="driver-publish">
					<view class="driver-publish-btn" @click="toSearchCarSource">
						<text class="driver-publish-btn-text">搜车源</text>
					</view>
				</view>
			</view>
		</uni-popup>
		<carAddr ref="carAddrRef" @toSearchResult="toSearchResult"></carAddr>
		
	</view>
</template>

<script>
	const PACKAGE_INFO_KEY = '__package_info__';
	import IMService from "@/utils/imservice.js";
	import * as utils from "@/utils/ship.js";
	import * as utilDate from "@/utils/utils";
	import carAddr from "./carAddr.vue";
	import * as publicData from "@/utils/publicData.js";
	import { apkUrl } from "@/utils/baseUrl.js";
	const { dateTimePicker} = require('@/utils/date.js');
	const PemissionModule = uni.requireNativePlugin("PemissionModule");
	var screenWidth;
	var screenHeight;
	export default {
		components: {
			carAddr,
		},
		data() {
			return {
				userInfo: {},
				addressLocation: '',
				isLocationFlag: false,
				hintSwiperText: '尊敬的用户：【货运中国】独创货找车模式上线啦，一键搜索车源，组建数字车队。',
				carAry: [], // 我的配置车辆
				checkedCar: '',
				lineAry: [], // 我的配置线路
				checkedLine: '',
				carInfo: [], // 车源列表
				showItemCheckBtn: false,
				myFleetData: [], // 我的车队
				noData: false,
				noMore: false,
				isLoading: false,
				pageNum: 1,
				pageSize: 10,
				infoTotal: 0,
				carModel: '',
				carLength: '',
				carCombo: '',
				senderCode: '',
				receiverCode: '',
				circuitCombo: '',
				searchCarHint: '',
				searchAreaHint: '',
				rspMsg: '',
				checkedCarItem: [],
				smsObj: {
					amount: 0,
					noteVOS: [],
				},
				userInfoName: '',
				advImgList: '',
				memberImgList: '',
				allCarSourceList: [],
				allCarSourceListToMap: [],
				newCheckedItem: [],
				remainingNum: 0,
				couponAccountObj: {},
				mealBaseInfo: 0,
				fleetmemsize: '',
				fleetBaseInfo: 0,
				firstTouUp: 0,
				scrollTopHeight: '',
				selectBoxSticky: '',
				beidouList: [],
				hasLoadCar: false,
				left: '',
				top: '',
				isShowSplashScreen: false,
				splashScreen: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/shipHzLogo.png',
				provinceArr: [],
				cityArr: [],
				selectedProvinceIndex: -1,
				selectedCityIndex: -1,
				popupDetails: 1,
				popupCityParams: {},
				selectCityParams: {},
				zhuangAddress: '',
				chooseCar: '',
				zhuangLocation: {},
				xieLocation: {},
				chooseIndex: 0,
				processStatus: 1,
				mapParams: {},
				hideFixedIcon: false, // 是否隐藏活动图标
				position: {
					x: 280,
					y: 560,
					x2: 0,
					y2: 0,
				},
				avticeIconObj: {
					luckDrawFlag: true,
				},
				splashNum: 5,
			};
		},
		async onLoad() {
			this.getUserInfo();
			this.showAdvs(); //超级车队流程
		
			var screenHeight = uni.getSystemInfoSync().windowHeight;
			var screenWidth = uni.getSystemInfoSync().windowWidth;
			this.top = screenHeight - 170;
			this.left = screenWidth - 60;
			uni.$on("refreshData_source", (data) => {
				this.carAry = []; // 我的配置车辆
				this.checkedCar = '';
				this.lineAry = []; // 我的配置线路
				this.checkedLine = '';
				this.carInfo = []; // 车源列表
				this.showItemCheckBtn = false;
				this.myFleetData = []; // 我的车队
				this.noData = false;
				this.noMore = false;
				this.isLoading = false;
				this.pageNum = 1;
				this.infoTotal = 0;
				this.carModel = '';
				this.carLength = '';
				this.carCombo = '';
				this.senderCode = '';
				this.receiverCode = '';
				this.circuitCombo = '';
				this.allCarSourceList = [];
				this.newCheckedItem = [];
				this.allCheckedFlag = false;
				this.selectedProvinceIndex = 0;
				this.selectedCityIndex = -1;
				this.popupDetails = 1;
				this.popupCityParams = {};
				this.selectCityParams = {};
				this.getUserInfo();
			});
			uni.$on("refresCarLine", (data) => {
				console.log('车源配置更新');
				this.getMyVehicle(true);
			});
			uni.$on("refresCarEmit", (data) => {
				//超级车队搜车源
				this.getMyVehicle();
			});
			uni.$on("signleTopupDone", (data) => {
				this.openRspMsgPopup('充值成功～', 1);
			});
			this.getAdvertising();
			this.getProvince();
			//抽奖和点亮中国行拖拽
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					// console.log(res, 'resres')
					//抽奖
					that.position.x = res.safeArea.width - 80;
					that.position.y = res.safeArea.height - 100;
					screenWidth = res.safeArea.width * 2;
					screenHeight = res.safeArea.height;
					// console.log(screenWidth, screenHeight)
				}
			});
		},
		onShow() {
		
			this.avticeIconObj.luckDrawFlag = true
			this.$forceUpdate();
			this.getConnectionStatus();
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getOptionInfo();
		},
		onReachBottom() { // 上拉加载
			if(this.noData || this.noMore || this.isLoading) {
				return false;
			}
			this.toLoadCarInfo();
		},
		onPageScroll : function(e) {
			// 当滑动距离达到一定数值时动态修改模块样式，并调整列表与顶部的距离
			if(e.scrollTop > this.scrollTopHeight) {
				this.selectBoxSticky = 'position: fixed;top: 0;z-index: 100;transition: all 0.2s;padding-top:100rpx;';
			}else {
				this.selectBoxSticky = '';
			}
		},
		onReady() {
			let that = this;
			var query = uni.createSelectorQuery().in(this);
			query.select('#listSelect').boundingClientRect(data => {
				that.scrollTopHeight = data.top
			}).exec();
		},
		methods: {
      closeLuckDrawlAct(){
        let that = this
        that.avticeIconObj.luckDrawFlag = false
      },
      goVip(){
        uni.navigateTo({
          url: '/pages/goodsDelivery/userCenter/member/memberPage'
        })
      },
      move(event) {
				console.log(event,'eventevent')
			      let vm = this;
				// console.log(event)
			      // if (vm.flags) {
			        var touch;
			        if (event.touches) {
			          touch = event.touches[0];
			        } else {
			          touch = event;
			        }
					console.log(event.touches)
			        // 定位滑块的位置
			        // vm.position.x = touch.screenX -25; 
			        // vm.position.y = touch.screenY -25;
					vm.position.x = touch.clientX -25;
					vm.position.y = touch.clientY -25;
									 // 限制滑块超出页面
			        // console.log('屏幕大小', screenWidth, screenHeight )
									 
					 console.log(vm.position.x,'vm.position.x')
					 // console.log(screenWidth - touch.clientX,'screenWidth - touch.clientX')
			        if (vm.position.x < 0) {
			          vm.position.x = 0;
			        } else if (vm.position.x > screenWidth - touch.clientX) {
			          vm.position.x = screenWidth - touch.clientX ;
			        }
					console.log(vm.position.x,'vm.position.x结束')
			    },
			renderLocation(addr) {
				let that = this;
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780' + '&address=' + addr;
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/geo?' + parameters, //仅为示例，并非真实接口地址。
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						// console.log("获取经纬度", res)
						var geocodesData = res.data.geocodes;
						if(geocodesData && geocodesData.length == 0) {
							uni.showToast({
								title: '未查询到此地址！',
								duration: 2000,
								icon: 'none'
							});
							return;
						}
						var geocodes = geocodesData[0];
						//初始化设置code和name
						var adcode = geocodes.adcode;
						adcode = adcode.toString();
						var provinceCode = adcode.slice(0, 2) + "0000";
						var cityCode = adcode.slice(0, 4) + "00";
						if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
							that.zhuangLocation.senderCode = geocodes.adcode;
							that.zhuangLocation.senderAddr = geocodes.district;
						} else {
							that.zhuangLocation.senderCode = cityCode;
							that.zhuangLocation.senderAddr = geocodes.city;
							
						}
						// console.log("装货地址" ,that.zhuangLocation);
					},
					fail: (err) => {
						
					},
					complete: (com) => {
						uni.hideLoading();
						if (that.processStatus != 1) {
							// that.supperpProcess(); //超级车队流程
						}
					},
				})
			},
			popClose() {
				this.$refs.driverPop.close();
			},
			async toSearchCarSource() {
				try{
					var that = this;
					uni.showLoading();
					//搜索车源,把线路写入车源配置页面
					var zhuangLocation = this.zhuangLocation;
					var xieLocation = this.xieLocation;
					if (!zhuangLocation.senderAddr) {
						uni.showToast({
							title: '请选择装货地',
							icon: 'none'
						})
						return;
					}
					if (!xieLocation.receiverAddr) {
						uni.showToast({
							title: '请选择卸货地',
							icon: 'none'
						})
						return;
					}
					
					var newParams = {
						tagTypeCode: "MY_CIRCUIT",
						tagTypeName: "我的线路",
						tagName: zhuangLocation.senderAddr + '-' + xieLocation.receiverAddr,
						personId: that.userInfo.attrs.personId,
						userCode: that.userInfo.attrs.userCode,
						userId: that.userInfo.userId,
						userPhone: that.userInfo.mobile,
						ext1: zhuangLocation.senderCode,
						ext2: xieLocation.receiverCode,
					}
					
					var res = await utils.postRequest("/yh/upd/tags/save", newParams);
					uni.hideLoading();
					if (res.retCode != "0000000") {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
						return;
					}
					uni.$emit("refresCarEmit");
					this.$refs.driverPop.close();
				}catch(e){
					console.log(e)
					//TODO handle the exception
				}
			},
			openNewRegionPopup(index) {
				this.chooseIndex = index;
				this.$refs.carAddrRef.showPopUp(index);
			},
			toSearchResult(params) {
				if (this.chooseIndex == 0) {
					this.zhuangLocation.senderAddr = params.startAddr.name;
					this.zhuangLocation.senderCode = params.startAddr.code;
				} else {
					this.xieLocation.receiverAddr = params.arriveAddr.name;
					this.xieLocation.receiverCode = params.arriveAddr.code;
				}
				this.$forceUpdate();
			},
			async showAdvs() {
				//判断是否弹出闪屏页
				try{
					var userInfo = uni.getStorageSync("userInfo");
					userInfo = JSON.parse(userInfo);
					var userId = userInfo.userId;
					// console.log("userId", userId);
					var res = await utils.newQueryPostRequest("/cd/popup/log/check", {
						userId: userId
					});
					// console.log("检查闪屏页", res)
					if (res.retCode != "0000000") {
						this.processStatus =  1;
						return;
					};
					var rspBody = res.rspBody;
					this.processStatus = rspBody;
					if (rspBody != 0) {
						this.checkVersion();
						return;
					};
					//未弹框则弹出闪屏页面
					var res = await utils.postRequest("/cd/popup/config/get", {
						role: 'cargo',
					})
					//获取闪屏图片
					if (res.retCode != "0000000") return;
					uni.hideTabBar();
					var image = res.rspBody.imgUrl;
					this.splashScreen = image;
					this.isShowSplashScreen = true;
					var splashNum = this.splashNum;
					// console.log("定时时间",splashNum)
					this.splashTimeout = setInterval(() => {
						splashNum--
						if (splashNum < 1) {
							clearInterval(this.splashTimeout);
							this.isShowSplashScreen = false;
							uni.showTabBar();
							//弹出权限框
							this.checkVersion();
							this.splashNum = 5;
							return;
						}
						this.splashNum = splashNum;
					}, 1000)
				}catch(e){
					uni.showTabBar();
					//TODO handle the exception
					console.log(e)
				}
			},
			toNextStep() {
				//跳过引导图
				this.splashTimeout && clearInterval(this.splashTimeout);
				this.isShowSplashScreen = false;
				uni.showTabBar();
				//弹出权限框
				this.checkVersion();
				this.splashNum = 5;
			}, 
			goMap(){
				//跳转地图
				var senderCode = this.senderCode;
				var carCombo = this.carCombo;
				var circuitCombo = this.circuitCombo;
				var mapParams = this.mapParams;
				console.log('跳转地图参数', this.senderCode, this.carCombo, this.circuitCombo, this.mapParams);
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "ios") {
					uni.getLocation({
						type: 'gcj02',
						success: function(res) {
							var longitude = res.longitude;
							var latitude = res.latitude;
							uni.navigateTo({ 
								url: '../orderDetails/driverMap?longitude=' + longitude + '&latitude=' + latitude + '&mapParams=' + JSON.stringify(mapParams) + '&senderCode=' + senderCode
							})
						},
						fail: function() {
							uni.showToast({
								title: '请打开定位',
								icon: 'none'
							})
						}
					})
					return;
				}
				if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '为了根据您的位置显示附近的车辆信息，将获取您的位置权限',
						success(res) {
							if (res.confirm) {
								uni.getLocation({
									type: 'gcj02',
									success: function(res) {
										var longitude = res.longitude;
										var latitude = res.latitude;
										uni.navigateTo({ 
											url: '../orderDetails/driverMap?longitude=' + longitude + '&latitude=' + latitude + '&mapParams=' + JSON.stringify(mapParams) + '&senderCode=' + senderCode
										})
									},
									fail: function() {
										uni.showToast({
											title: '请打开定位',
											icon: 'none'
										})
									}
								})
							}
						}
					})
				} else {
					uni.getLocation({
						type: 'gcj02',
						success: function(res) {
							var longitude = res.longitude;
							var latitude = res.latitude;
							uni.navigateTo({ 
								url: '../orderDetails/driverMap?longitude=' + longitude + '&latitude=' + latitude + '&mapParams=' + JSON.stringify(mapParams) + '&senderCode=' + senderCode
							})
						},
						fail: function() {
							uni.showToast({
								title: '请打开定位',
								icon: 'none'
							})
						}
					})
				}
			},
			showDate(index) {
				var beidouList = this.beidouList;
				if (!beidouList) return;
				if (!beidouList[index]) return '';
				var locationDate = beidouList[index].locationDate;
				if (!locationDate) return '';
				return utilDate.findBeidouDateDesc(locationDate)
			},
			showAddr(index) {
				var beidouList = this.beidouList;
				var carInfo = this.carInfo;
				var userId = carInfo[index].userId;
				if (beidouList.length < 1) return '';
				var findIndex = beidouList.findIndex(item => {
					return item.userId == userId
				})
				if (findIndex > -1) {
					var address = beidouList[findIndex].address;
					if (address) {
						var reg = /.+?(县|区)/g
						var addr = address.match(reg);
						if (addr) {
							return addr[0]
						} else {
							return address
						}
					} else {
						return address || ""
					}
				} else {
					return ""
				}
			},
			isBeidou(index) {
				//判断是否是北斗定位
				var beidouList = this.beidouList;
				if (beidouList.length < 1) return false;
				if (!beidouList[index]) return false; 
				return beidouList[index].isBeiDou;
			},
			getBroadcastByDriver() {// 消息通告
				let that = this;
				utils.postRequest('/ts/finance/broadcast/getBroadcastByShipper')
				.then(res=>{
					// console.log('货源广场', res);
					if(res.retCode == '0000000') {
						that.hintSwiperText = res.rspBody.broadcast;
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			checkCar(item) {
				if(this.checkedCar != item.sid) {
					let carObj = item.tagName.split('米');
					this.checkedCar = item.sid;
					this.carCombo = carObj[0] + '-' + carObj[1];
					this.carModel = carObj[1];
					this.carLength = carObj[0];
				}
			},
			checkLine(item) {
				console.log('选中的线路', item);
				if(this.checkedLine != item.sid) {
					this.checkedLine = item.sid;
					this.circuitCombo = item.tagName;
					this.senderCode = item.ext1;
					this.receiverCode = item.ext2;
				}
			},
			getUserInfo() { // 获取用户信息
				this.userInfo = {};
				let userData = uni.getStorageSync("userInfo");
				// console.log('用户信息', JSON.parse(userData));
				this.userInfo = userData ? JSON.parse(userData) : {};
				if(userData) {
					this.getMyVehicle();
					this.getMealBaseList();
				}
			},
			getMyVehicle(flag) { // 我的车辆配置
				if(this.hasLoadCar) return false;
				this.hasLoadCar = true;
				let params = {
					userId: this.userInfo.userId,
					typeCodeList: ['MY_VEHICLE', 'MY_CIRCUIT'],
					status: 1
				}
				// console.log('配置列表请求参数', params);
				let that = this;
				utils.postRequest('/yh/upd/tags/find', params)
				.then(function (res) {
					// console.log('新的已配置列表', res);
					if(res.retCode == '0000000'){
						let itemAry = res.rspBody.items;
						let carItems = [];
						let lineItems = [];
						for(let i in itemAry) {
							if(itemAry[i].tagTypeCode == 'MY_VEHICLE') {
								carItems.push(itemAry[i]);
							}
							if(itemAry[i].tagTypeCode == 'MY_CIRCUIT') {
								let addressAry = itemAry[i].tagName.split('-');
								itemAry[i].senderAddr = addressAry[0];
								itemAry[i].receiverAddr = addressAry[1];
								lineItems.push(itemAry[i]);
							}
						}
						that.carAry = carItems;
						if(that.carAry && that.carAry.length > 0) {
							if(!that.carCombo || that.carAry.length == 1) {
								let carObj = that.carAry['0'].tagName.split('米');
								that.carCombo = carObj[0] + '-' + carObj[1];
								that.carModel = carObj[1];
								that.carLength = carObj[0];
								that.checkedCar = that.carAry['0'].sid;
							}else if(getApp().globalData.defaultContact.shipVehicleEditFlag == true) {
								let carObj = that.carAry['0'].tagName.split('米');
								that.carCombo = carObj[0] + '-' + carObj[1];
								that.carModel = carObj[1];
								that.carLength = carObj[0];
								that.checkedCar = that.carAry['0'].sid;
								getApp().globalData.defaultContact.shipVehicleEditFlag = false;
							}
							// let carObj = that.carAry['0'].tagName.split('米');
							// that.carCombo = carObj[0] + '-' + carObj[1];
							// that.carModel = carObj[1];
							// that.carLength = carObj[0];
							// that.checkedCar = that.carAry['0'].sid;
						}else {
							that.carCombo = '';
							that.carModel = '';
							that.carLength = '';
							that.checkedCar = '';
						}
						that.lineAry = lineItems;
						if(that.lineAry && that.lineAry.length > 0) {
							if(!that.circuitCombo || that.lineAry.length == 1) {
								that.circuitCombo = that.lineAry['0'].tagName;
								that.senderCode = that.lineAry['0'].ext1;
								that.receiverCode = that.lineAry['0'].ext2;
								that.checkedLine = that.lineAry['0'].sid;
							}else if(getApp().globalData.defaultContact.shipCircultEditFlag == true) {
								that.circuitCombo = that.lineAry['0'].tagName;
								that.senderCode = that.lineAry['0'].ext1;
								that.receiverCode = that.lineAry['0'].ext2;
								that.checkedLine = that.lineAry['0'].sid;
								getApp().globalData.defaultContact.shipCircultEditFlag = false;
							}
							
							// that.circuitCombo = that.lineAry['0'].tagName;
							// that.senderCode = that.lineAry['0'].ext1;
							// that.receiverCode = that.lineAry['0'].ext2;
							// that.checkedLine = that.lineAry['0'].sid;
						}else {
							that.circuitCombo = '';
							that.senderCode = '';
							that.receiverCode = '';
							that.checkedLine = '';
						}
						if(!flag) {
							that.getOptionInfo();
						}
						that.$forceUpdate();
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.hideLoading();
					that.hasLoadCar = false;
				})
				.catch(err=>{
					uni.hideLoading();
					that.hasLoadCar = false;
					console.log(err);
					// uni.showToast({
					// 	title: err,
					// 	icon: 'none'
					// })
				})
			},
			checkSearchMsg() { // 判断搜索条件是否满足
				if(!this.carModel || !this.carLength || !this.senderCode || !this.receiverCode) {
					uni.showToast({
						title: '请选择查询条件再搜索',
						icon: 'none'
					})
					return false;
				}else {
					this.getOptionInfo();
				}
			},
			getOptionInfo() { // 车源列表
				if(this.isLoading) return false;
				if(!this.carModel || !this.carLength || !this.senderCode || !this.receiverCode) {
					uni.stopPullDownRefresh();
					return false;
				}
				this.noMore = false;
				this.noData = false;
				this.isLoading = true;
				this.pageNum = 1;
				this.infoTotal = 0;
				this.carInfo = [];
				this.allCarSourceList = [];
				this.newCheckedItem = [];
				this.allCheckedFlag = false;
				let params = {
					"carModels": [this.carModel],
					"carLengths": [this.carLength],
					"senderCode": this.senderCode ? this.senderCode : undefined,
					"receiverCode": this.receiverCode ? this.receiverCode : undefined,
					"userCode": this.userInfo.attrs.userCode,
					"cargoSid": undefined,
					"type": 2,
					"locationCode": this.selectCityParams.code ? this.selectCityParams.code : undefined,
					"locationName": this.selectCityParams.name ? this.selectCityParams.name : undefined,
				}
				this.mapParams = Object.assign({}, params, {
					carCombo: this.carCombo,
					circuitCombo: this.circuitCombo,
				});
				this.searchCarHint = this.checkedCar ? this.showCheckedCar() : '';
				this.searchAreaHint = this.checkedLine ? this.showCheckedLine() : '全国到全国';
				// console.log('列表查询参数', params);
				let that = this;
				utils.newQueryPostRequest('/olnanas/recommend/getCarSource', params)
				// utils.postRequest('/cy/carSource/select', params)
				// utils.postRequest('/cy/carSource/show', params)
				.then(function (res) {
					// console.log('车源列表数据', res);
					if(res.retCode == '0000000'){
						// that.infoTotal = res.rspBody.total;
						let items = res.rspBody.carSourceVOS;
						if(items && items.length > 0) {
							that.allCarSourceList = items;
							var arr = [];
							that.allCarSourceListToMap = arr.concat(items);
							//获取北斗或app定位的地址
							var addrAddress = [];
							items.forEach(atem => {
								addrAddress.push(atem.userId)
							})
							
							console.log(addrAddress, '北斗查询参数')
							utils.newQueryPostRequest("/olnanas/recommend/beidouPositioning", {
								userIds: addrAddress
							}).then(res => {
								// console.log(res, '北斗定位')
								if (res.retCode == "0000000") {
									that.beidouList = res.rspBody;
								} else {
									that.beidouList = [];
									// uni.showToast({
									// 	title: res.retDesc,
									// 	icon: 'none'
									// })
								}
								that.toLoadCarInfo();
							}).catch(e => {
								console.log(e)
							})
						}else {
							that.noData = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					console.log(err, '报错')
					that.isLoading = false;
				})
				uni.stopPullDownRefresh();
				
			},
			toLoadCarInfo() { // 懒加载
				// console.log('懒加载开始');
				this.isLoading = true;
				let userIds = [];
				for(var i = 0; i < this.pageSize; i++) {
					if(this.allCarSourceList.length > 0) {
						this.allCarSourceList['0'].checked = false;
						this.carInfo.push(this.allCarSourceList['0']);
						userIds.push(this.allCarSourceList['0'].userId);
						this.allCarSourceList.splice('0', 1);
						this.allCheckedFlag = false;
					}else {
						this.noMore = true;
						break;
					}
				}
				if(userIds.length > 0) {
					this.toSendMessageEvent(userIds);
				}else {
					this.isLoading = false;
				}
				// console.log('加载完后', this.allCarSourceList);
				
			},
			toSendMessageEvent(userIds) { // 货主翻页向司机推送查看消息
				let params = {
					eventType: 1,
					userIds: userIds
				}
				// console.log('查看消息参数', params);
				let that = this;
				utils.postRequest('/xxq/message/event', params)
				.then(function (res) {
					// console.log('查看消息结果', res);
					if(res.retCode == '0000000'){
						
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			loadOptionInfo() {
				if(this.noData || this.noMore || this.isLoading) {
					return false;
				}
				this.isLoading = true;
				this.pageNum++;
				let params = {
					senderCode: this.senderCode ? this.senderCode : undefined,
					receiverCode: this.receiverCode ? this.receiverCode : undefined,
					carModel: this.carModel ? this.carModel : undefined,
					carLength: this.carLength ? this.carLength : undefined,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				console.log('懒加载列表查询参数', params);
				let that = this;
				utils.postRequest('/cy/carSource/select', params)
				.then(function (res) {
					console.log('懒加载列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								items[i].checked = false;
								that.carInfo.push(items[i]);
							}
						}else {
							that.noMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			openRspMsgPopup(msg, repeatFlag) {
				if(!repeatFlag) {
					for(let c in this.carInfo) {
						this.carInfo[c].checked = false;
					}
					this.newCheckedItem = [];
					this.allCheckedFlag = false;
				}
				this.rspMsg = msg;
				this.$refs.mainRspMsgPopup.open();
				setTimeout(()=>{
					this.$refs.mainRspMsgPopup.close();
				},3000)
			},
			jumpToSingleTopup() { // 单次充值
				getApp().globalData.smsObj = {
					amount: this.firstTouUp == 1 ? this.couponAccountObj.pointFirstPrice / 1000 : this.couponAccountObj.pointPrice / 1000,
					noteVOS: [],
					point: Number(this.couponAccountObj.pointNum)
				}
				this.$refs.noSourceNumPopup.close();
				uni.navigateTo({
					url: '../smsTopUp?typeNum=54'
				})
			},
			showName(str) {
				if(str) {
					return str.substr(0, 1) + '师傅';
				}
			},
			showPhone(str) {
				if(str) {
					let fir = str.substr(0, 3);
					let sec = str.substr(7, 4);
					return fir + '****' + sec;
				}
			},
			showCreatDate(time) {
				let str = time;
				str = str.slice(5);
				str = str.substring(0, str.length - 3);
				return str;
			},
			showLoadDate(time) {
				let str = time;
				str = str.slice(5);
				str = str.substring(0, str.length - 9);
				return str;
			},
			goSetting() {
				//去配置
				uni.navigateTo({
					url: '../sourceIndex/sourceSetting'
				})
			},
			showSenderAddr(str) {
				return str.substr(0, 2);
			},
			showReceiverAddr(str) {
				return str.substr(0, 2);
			},
			showListSenderAddr(str) {
				return str.substr(0, 4);
			},
			showListReceiverAddr(str) {
				return str.substr(0, 4);
			},
			showSelectAddr(str) {
				return str.substr(0, 6);
			},
			showCheckedCar() {
				for(let i in this.carAry) {
					if(this.carAry[i].sid == this.checkedCar) {
						return this.carAry[i].carLength + '米' + this.carAry[i].carModel;
					}
				}
			},
			showCheckedLine() {
				for(let i in this.lineAry) {
					if(this.lineAry[i].sid == this.checkedLine) {
						return this.showSenderAddr(this.lineAry[i].senderAddr) + '到' + this.showReceiverAddr(this.lineAry[i].receiverAddr);
					}
				}
			},
			jumpToAdvertising(item) { // 广告页跳转
				
				
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
			getAdvertising() { // 获取广告页
				let params = {
					"locationCodeS": [
						"EXTENTION_MONEY_SMALL",
						"EXTENTION_MONEY_BIG",	
					]
				};
				let that = this;
				utils.postRequest('/ts/advertising/get_to_shipper', params)
				.then(function (res) {
					// console.log('广告数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody;
						
						
						if(items && items.length > 0) {
							that.advImgList = items;
						}
					} else{
						console.log('广告图获取失败', res.retDesc);
					}
				})
				.catch(err=>{
					console.log('广告图请求失败', err);
				})
				let data = {
					"locationCodeS": [
						"SHIP_MEMBER_PROMOTE_SMALL",
						"SHIP_MEMBER_PROMOTE_BIG",
					]
				};
				utils.postRequest('/ts/advertising/get_to_shipper', data)
				.then(function (mRes) {
					// console.log('广告数据', mRes);
					if(mRes.retCode == '0000000'){
						let items = mRes.rspBody;
						if(items && items.length > 0) {
							that.memberImgList = items;
						}
					} else{
						console.log('广告图获取失败', mRes.retDesc);
					}
				})
				.catch(mErr=>{
					console.log('广告图请求失败', mErr);
				})
			},
			getLocationPermissions() { // 是否第一次登录为授权地址
				let hasLocationPermissionsShow = uni.getStorageSync('hasLocationPermissionsShow');
				let hasLocationPermissionsChecked = uni.getStorageSync('hasLocationPermissionsChecked');
				if(hasLocationPermissionsShow || hasLocationPermissionsChecked) {
					// this.getLocationMsg(); //过华为审核，首次打开首页不弹出位置授权框
					
				}else {
					uni.setStorageSync('hasLocationPermissionsShow', true);
					// this.$refs.locationPermissionsPopup.open();
				}
			},
			getSupperFleetProcess() {
				//点击我知道了后开始判断
				this.getLocationMsg();
			},
			async supperpProcess() {
				//超级车队流程
				//1.判断货主是否配置了车型车长
				var that = this;
				var carAry = this.carAry;
				if (carAry.length < 1) {
					//没有配置弹出车型车长配置页面
					uni.navigateTo({
						url: './carSettings'
					})
					return;
				}
				var chooseCar = carAry[0].tagName;
				that.chooseCar = chooseCar;
				//已配置，判断用户的车型车长中是否有超级车队
				var modelList = [], cartLengthList = [];
				carAry.forEach(item => {
					var tagNameArr = item.tagName.split('米');
					modelList.push(tagNameArr[1])
					cartLengthList.push(tagNameArr[0])
				})
				console.log("是否配置了超级车辆",modelList, cartLengthList)
				var res = await utils.newQueryPostRequest("/cd/fleet/list", {
					isSuperFleet: 1,
					modelList: modelList,
					cartLengthList: cartLengthList,
				})
				if (res.retCode != "0000000") return;
				console.log("配置了超级车队",carAry, res);
				var rsp = res.rspBody.items;
				
				if (rsp.length >0) {
					//有超级车队
					var info = rsp[0];
					uni.navigateTo({
						url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(info) + '&pageSource=carSettings&zhuangAddress=' + that.zhuangAddress
					})
					// uni.navigateTo({
					// 	url: '/pages/goodsDelivery/fleetIndex/fleetDetails?info=' + JSON.stringify(info) + '&pageSource=carSettings&zhuangAddress=' + that.zhuangAddress
					// })
					
				} else {
					//无超级车队,则判断是否有线路
					var lineAry = this.lineAry;
					if (lineAry.length > 0) return;
					// this.$refs.driverPop.open();
					console.log("asasasasasas",that.zhuangLocation, chooseCar)
					uni.navigateTo({
						url: './carSourceTips?zhuangLocation=' + JSON.stringify(that.zhuangLocation) + '&chooseCar=' + chooseCar
					})
				}
				
			},
			checkLocation() { // 是否已同意授权
				let hasLocationPermissionsChecked = uni.getStorageSync('hasLocationPermissionsChecked');
				if(hasLocationPermissionsChecked) {
					this.getLocationMsg();
				}else {
					// this.$refs.locationPermissionsPopup.open();
				}
			},
			checkLocation1() {
				let hasLocationPermissionsChecked = uni.getStorageSync('hasLocationPermissionsChecked');
				if(hasLocationPermissionsChecked) {
					this.getLocationMsg();
				}else {
					this.$refs.locationPermissionsPopup.open();
				}
			},
			getLocationMsg() {
				if(this.isLocationFlag) return false;
				this.isLocationFlag = true;
				//获取定位
				var that = this;
				// uni.showLoading({
				// 	title: '定位中'
				// })
				var system = uni.getSystemInfoSync();
				var platform = system.platform; 
				if (platform == "android") {
					PemissionModule.applyPemission(res => {
						if (res.status == 1) {
							uni.getLocation({
								type: 'gcj02',
								geocode: true,
								success: function(res) {
									// uni.hideLoading();
									// console.log('定位成功', res)
									var address = res.address;
									that.addressLocation = res.address.city;
									var zhuangAddress = address.province + address.city + address.district + '人民政府';
									that.zhuangAddress = address.province + address.city + address.district + '人民政府';
									uni.$emit("srevice-index", 1);
									that.renderLocation(zhuangAddress);
									
								},
								fail: function(err) {
									console.log('定位失败', err)
									if (that.processStatus != 1) {
										// that.supperpProcess(); //超级车队流程
									}
								},
								complete: function(com) {
									uni.setStorageSync('hasLocationPermissionsChecked', true);
									that.$refs.locationPermissionsPopup.close();
									setTimeout(() => {
										that.isLocationFlag = false;
									}, 10000)
								},
							})
						} else {
							uni.setStorageSync('hasLocationPermissionsChecked', true);
							that.$refs.locationPermissionsPopup.close();
							setTimeout(() => {
								that.isLocationFlag = false;
							}, 10000)
							
						}
					})
				} else {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: function(res) {
							// uni.hideLoading();
							// console.log('定位成功', res)
							var address = res.address;
							that.addressLocation = res.address.city;
							var zhuangAddress = address.province + address.city + address.district + '人民政府';
							that.zhuangAddress = address.province + address.city + address.district + '人民政府';
							uni.$emit("srevice-index", 1);
							that.renderLocation(zhuangAddress);
							
						},
						fail: function(err) {
							console.log('定位失败', err)
							if (that.processStatus != 1) {
								// that.supperpProcess(); //超级车队流程
							}
						},
						complete: function(com) {
							uni.setStorageSync('hasLocationPermissionsChecked', true);
							that.$refs.locationPermissionsPopup.close();
							setTimeout(() => {
								that.isLocationFlag = false;
							}, 10000)
						},
					})
				}
				
				
			},
			// openGps(){
			//     let system = uni.getSystemInfoSync();// 获取系统信息
			//     if (system.platform === 'android') { // 判断平台
			// 			var context = plus.android.importClass("android.content.Context");
			// 		var locationManager = plus.android.importClass("android.location.LocationManager");
			// 		var main = plus.android.runtimeMainActivity();
			// 		var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
			// 		if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
			// 			uni.showModal({
			// 			title: '提示',
			// 			content: '请打开定位服务功能',
			// 			showCancel: false, // 不显示取消按钮
			// 			success() {
			// 				var Intent = plus.android.importClass('android.content.Intent');
			// 				var Settings = plus.android.importClass('android.provider.Settings');
			// 				var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS); 
			// 				main.startActivity(intent); // 打开系统设置GPS服务页面
				
			// 				}
			// 			});	
			//         }
			//     }else if(system.platform === 'ios'){
			//         var cllocationManger = plus.ios.import("CLLocationManager");
			// 		var enable = cllocationManger.locationServicesEnabled();
			// 		var status = cllocationManger.authorizationStatus();
			// 		plus.ios.deleteObject(cllocationManger);
			// 		console.log("手机系统的定位没有打开");
			// 		uni.showModal({
			// 			title: '提示',
			// 			content: '请打开定位服务功能',
			// 			showCancel: false, // 不显示取消按钮
			// 			success() {
			// 			var UIApplication = plus.ios.import("UIApplication");
			// 			var application2 = UIApplication.sharedApplication();
			// 			var NSURL2 = plus.ios.import("NSURL");				
			// 			var setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION");
			// 			application2.openURL(setting2);
			// 			plus.ios.deleteObject(setting2);
			// 			plus.ios.deleteObject(NSURL2);
			// 			plus.ios.deleteObject(application2);
			// 			}
			// 		});
			//     }
			// },
			async checkVersion() {
			    try{
					var version = plus.runtime.version;
					// console.log(version, '版本号');
					var res = await utils.postRequest("/yh/version/vc/check", {
						serviceType: 20,
						versionNo: version
					});
					// console.log(res, 'asasaaa');
					if (res.retCode == "0000000") {
						if (res.rspBody.resultFlag == 1) { //说明版本不一致，有新版本
							var result = res.rspBody;
							var tipNote = res.rspBody.tipNote;
							result.type = "whole";
							result.message = tipNote.split("&&&");
							result.url = "https://hyzg-app.oss-cn-beijing.aliyuncs.com/cargoChina-appTest/hyzg.apk";
							result.platform = uni.getSystemInfoSync().platform;
							result.is_mandatory = res.rspBody.forceFlag;
							result.version = res.rspBody.versionNo;
							result.contents = tipNote.split("&&&");
							uni.setStorageSync(PACKAGE_INFO_KEY, result);
							setTimeout(() => {
								uni.navigateTo({
									url: `/uni_modules/uni-upgrade-center-app/pages/upgrade-popup?local_storage_key=${PACKAGE_INFO_KEY}`,
									success: res =>{},
									fail: (err) => {
										console.error('更新弹框跳转失败', err)
										uni.removeStorageSync(PACKAGE_INFO_KEY)
									}
								})
						   }, 2000)
						}else {
							this.getLocationPermissions();
						}
					}
			    }catch(e){
					console.log(e)
			    }
			},
			toCallUser(item, index) { // 联系TA
				if(item.checkStatus == 1) {
					this.checkCallPermissions(item, index);
				}else {
					uni.showLoading();
					let params = {
						"ownerUserCode": this.userInfo.attrs.userCode,
						"userId": this.userInfo.userId,
						"type": 1,
						"carSourceSid": [item.sid]
					}
					console.log('消费参数', params);
					let that = this;
					utils.postRequest('/olnanas/recommend/consumeNumber', params)
					.then(function (res) {
						console.log('消费结果', res);
						if(res.retCode == '0000000'){
							uni.hideLoading();
							if(res.rspBody < 0) {
								that.carInfo[index].checkStatus = 1;
								that.checkCallPermissions(item, index);
							}else {
								console.log('消费次数失败');
								that.getRemainingPoint();
							}
						} else{
							uni.hideLoading();
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						uni.hideLoading();
						console.log('消费请求失败', res.retDesc);
					})
				}
			},
			checkCallPermissions(item, index) {
				console.log(item.driverPhone);
				this.carSourceInteraction(item);
				this.toSendDriverMsg(item);
				let platformMsg = uni.getSystemInfoSync().platform;
				if(platformMsg == 'android') {
					let that = this;
					uni.showModal({
						title: '提示',
						content: '为了获取您的手机号码以调取系统通话，将申请您的电话权限',
						success: function(res) {
							if (res.confirm) {
								plus.android.requestPermissions(
									['android.permission.CALL_PHONE'],
									function(resultObj) {
										var result = 0;
										for(let i = 0; i < resultObj.granted.length; i++) {
											var grantedPermission = resultObj.granted[i];
											console.log('已获取的权限', grantedPermission);
											result = 1;
										}
										for(let i = 0; i < resultObj.deniedPresent.length; i++) {
											var deniedPresentPermission = resultObj.deniedPresent[i];
											console.log('拒绝本次申请的权限', deniedPresentPermission);
											result = 0;
										}
										for(let i = 0; i < resultObj.deniedAlways.length; i++) {
											var deniedAlwaysPermission = resultObj.deniedAlways[i];
											console.log('永久拒绝申请的权限', deniedAlwaysPermission);
											result = -1;
										}
										console.log(result);
										that.makePhoneCall(result, item, index);
									}
								)
							}
						}
					})
				}else {
					this.makePhoneCall(1, item, index);
				}
			},
			makePhoneCall(result, item, index) {
				console.log('触发');
				if(result == 1) {
					uni.makePhoneCall({
					    phoneNumber: item.driverPhone,
					});
					publicData.addBuried("货主搜索车源拨打司机电话")
				}else {
					uni.showToast({
						title: '请开启拨号权限',
						icon: 'none'
					})
				}
			},
			carSourceInteraction(item) { // 互动接口
				let params = [{
					nowdataSid: item.sid,
					batchNumber: item.batchNumber,
					userCode: this.userInfo.attrs.userCode ? this.userInfo.attrs.userCode : undefined,
					userId: this.userInfo.userId ? this.userInfo.userId : undefined,
					personId: this.userInfo.attrs.personId ? this.userInfo.attrs.personId : undefined,
					name: this.userInfo.userName ? this.userInfo.userName : undefined,
					phone: this.userInfo.mobile ? this.userInfo.mobile : undefined,
					imgUrl: this.userInfo.attrs.avatar ? this.userInfo.attrs.avatar : undefined,
					
				}]
				console.log('互动参数', params);
				utils.postRequest('/cy/carSourceInteraction/add', params)
				.then(function (res) {
					console.log('互动结果', res);
					if(res.retCode == '0000000'){
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('互动失败', err);
				})
			},
			toSendDriverMsg(item) { // 发送消息
				let userIdAry = [];
				userIdAry.push(item.userId);
				let params = {
					"ownerUserCode": this.userInfo.attrs.userCode ? this.userInfo.attrs.userCode : undefined,
					"userIds": userIdAry,
				}
				console.log('发消息参数', params);
				utils.postRequest('/olnanas/recommend/iconMessage', params)
				.then(function (res) {
					console.log('发消息结果', res);
					if(res.retCode == '0000000'){
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('互动失败', err);
				})
			},
			getRemainingPoint() { // 消费次数失败则获取消费次数并打开弹窗
				let params = {
					"usersid": this.userInfo.userId,
					"setmchannel": "app"
				}
				console.log('剩余条数费参数', params);
				let that = this;
				utils.postRequest('/cp/member/queryByUser', params)
				.then(function (res) {
					console.log('剩余条数结果', res);
					if(res.retCode == '0000000'){
						let noteStr = res.rspBody.setmitems;
						noteStr = noteStr.replace(/\//g, '');
						noteStr = JSON.parse(noteStr);
						console.log('JSON剩余条数结果', noteStr);
						that.remainingNum = Number(noteStr.carsourcenum.nowsurnum);
						that.firstTouUp = Number(noteStr.carsourcenum.firstRecharge);
						that.getCouponAccountType(); // 单次充值配置
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('剩余条数请求失败', res.retDesc);
				})
			},
			jumpToSourceHistory() {
				uni.navigateTo({
					url: './sourceHistory'
				})
			},
			closeNoNumPopup() { // 关闭充值弹窗
				this.$refs.noSourceNumPopup.close();
			},
			closeNoFleetNumPopup() { // 关闭充值弹窗
				this.$refs.noFleetNumPopup.close();
			},
			
			getCouponAccountType() { // 单次充值配置
				let params = {
					"level1": "车源",
				}
				console.log('单次充值费参数', params);
				let that = this;
				utils.postRequest('/cp/couponAccountType/list', params)
				.then(function (res) {
					console.log('单次充值结果', res);
					if(res.retCode == '0000000'){
						that.couponAccountObj = {};
						that.couponAccountObj = res.rspBody && res.rspBody.length > 0 ? res.rspBody['0'] : {};
						that.$refs.noSourceNumPopup.open();
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('单次充值配置请求失败', res.retDesc);
				})
			},
			getMealBaseList() { // 会员套餐列表
				let params = {
					"setmfree": "0",
					"setmrole": "cargo",
					"setmchannel": "app",
					setmdisp: 1,
				}
				// console.log('会员套餐参数', params);
				let that = this;
				utils.postRequest('/cp/set/meal/base/list', params)
				.then(function (res) {
					// console.log('会员套餐结果', res);
					if(res.retCode == '0000000'){
						let rspBody = res.rspBody;
						that.mealBaseInfo = 0;
						that.fleetBaseInfo = 0;
						if(rspBody && rspBody.length > 0) {
							let items = rspBody[rspBody.length - 1];
							let setmitemsJson = items.setmitems.replace(/\//g, '');
							let obj = JSON.parse(setmitemsJson);
							that.mealBaseInfo = Number(obj.carsourcenum.defval);
							that.fleetBaseInfo = Number(obj.fleetmemsize.defval);
							uni.hideLoading();
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('会员套餐请求失败', res.retDesc);
				})
			},
			toSorting(arr){
			    var interval = parseInt(arr.length / 2);  //分组间隔设置
			    while(interval > 0){
			        for(var i = 0 ; i < arr.length ; i ++){
			            var n = i;
			            while(arr[n] < arr[n - interval] && n > 0){
			                var temp = arr[n];
			                arr[n] = arr[n - interval];
			                arr[n - interval] = temp;
			                n = n - interval;
			            }
			        }
			        interval = parseInt(interval / 2);
			    }
			    return arr;
			},
			jumpToUserMember() { // 跳转会员列表
				this.$refs.noSourceNumPopup.close();
				this.$refs.noFleetNumPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage?pageName=sourceIndex'
				})
			},
			getConnectionStatus() {
				let userData = uni.getStorageSync("userInfo");
				if(userData) {
					if(!getApp().globalData.nvueGoeasy) {
						getApp().globalData.nvueGoeasy = this.GoEasy;
						getApp().globalData.nvuegoeasy = this.goEasy;
					}
					var userInfo = JSON.parse(userData);
					// console.log('用户信息', userInfo);
					// console.log(this.goEasy.getConnectionStatus() == 'disconnected' ? 'GoEasy未连接' : 'GoEasy连接');
					if(this.goEasy.getConnectionStatus() === 'disconnected') {
						getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
						getApp().globalData.imService.connect(userInfo);
					}
				}
			},
			showSelectPopup() { // 打开筛选弹窗
				this.$refs.sourceSelectPopup.open();
			},
			getProvince() { // 从本地缓存获取省市区数据，本地缓存没有则从接口获取，再存入缓存
				var provinceLocal = uni.getStorageSync("regionData");
				if(provinceLocal) {
					this.provinceArr = provinceLocal;
					// this.pushDiyCityItem(this.provinceArr[0].code, 0);
				}else {
					let that = this;
					utils.postRequest('/ts/nationDict/getBasicData')
					.then(res => {
						if (res.retCode == "0000000") {
							var provinceArr = res.rspBody;
							that.provinceArr = provinceArr;
							// that.pushDiyCityItem(provinceArr[0].code, 0);
							uni.setStorage({
								key: 'regionData',
								data: res.rspBody,
								success: function(saveRes) {
									// console.log('地区数据缓存成功！', saveRes);
									uni.setStorageSync('regionUpdate', 1)
								},
								fail: function(saveErr) {
									// console.log('地区数据缓存失败！', saveErr);
								}
							});
						} else {
							// console.log('地区接口异常：', res.retDesc);
						}
					})
					.catch(err => {
						// console.log('地区接口请求异常：', err);
					})
				}
			},
			pushDiyCityItem(provinceName, provinceCode, index) { // 根据传入的省或市code判断塞入 全市/全省
				var cities = this.provinceArr[index].cities;
				if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
					var coties = [{
						shwowName: '全市',
						name: provinceName,
						code: provinceCode
					}, ...cities]
				} else {
					var coties = [{
						showName: '全省',
						name: provinceName,
						code: provinceCode
					}, ...cities]
				}
				this.cityArr = coties;
			},
			switchProIndex(index) { // 选择省
				if (index == this.selectedProvinceIndex) return;
				this.selectedProvinceIndex = index;
				this.selectedCityIndex = -1;
				//切换城市
				var provinceArr = this.provinceArr;
				var provinceCode = provinceArr[index].code;
				var provinceName = provinceArr[index].name;
				this.popupCityParams = {
					code: provinceCode,
					name: provinceName,
				}
				this.pushDiyCityItem(provinceName, provinceCode, index);
			},
			switchCityIndex(index) { // 选择市
				this.selectedCityIndex = index;
				console.log(this.cityArr[index]);
				this.popupCityParams = {
					code: this.cityArr[index].code,
					name: this.cityArr[index].name,
				}
			},
			toResetSelectData() { // 重置选择的省市区
				if(this.selectedCityIndex != -1) { // 选择过市才重置
					this.selectedProvinceIndex = -1;
					this.selectedCityIndex = -1;
					this.cityArr = [];
					this.popupCityParams = {};
				}
			},
			toSelectSouce() { // 保存省市区数据
				if(this.selectedProvinceIndex == -1 && this.selectedCityIndex == -1) {
					this.selectCityParams = {};
				}else if(this.selectedProvinceIndex != -1 && this.selectedCityIndex == -1) {
					this.selectCityParams = {
						code: this.provinceArr[this.selectedProvinceIndex].code,
						name: this.provinceArr[this.selectedProvinceIndex].name,
					}
				}else {
					this.selectCityParams = {
						code: this.cityArr[this.selectedCityIndex].code,
						name: this.cityArr[this.selectedCityIndex].name,
					}
				}
				this.$refs.sourceSelectPopup.close();
				this.getOptionInfo();
			},
			replaceProvince(name) { // 去除省的，省、市、自治区、维吾尔、壮族、回族
				let returnName = name.replace('省', '');
				returnName = returnName.replace('市', '');
				returnName = returnName.replace('自治区', '');
				returnName = returnName.replace('维吾尔', '');
				returnName = returnName.replace('壮族', '');
				returnName = returnName.replace('回族', '');
				return returnName;
			},
			showPopupDetails(flag) { // 切换popup展示
				this.popupDetails = flag;
			},
			jumpToDriverDetails(id, checkStatus) { // 跳转司机详情
				uni.navigateTo({
					url: '../driverDetails/driverDetails?id=' + id + '&encryption=' + 0
				})
			},
			jumpToTestPage() {
				uni.navigateTo({
					url: '../testModelPage'
				})
			},
			createTimeStr(dateTimeArray,dateTime){
				let timeStr = dateTimeArray[0][dateTime[0]]+'-'+dateTimeArray[1][dateTime[1]]+'-'+dateTimeArray[2][dateTime[2]]+' '+dateTimeArray[3][dateTime[3]]+":"+dateTimeArray[4][dateTime[4]];
				console.log(timeStr)
				return timeStr
			},
			toTrackSimple(item) {
				if (!utils.btnRepeat()) return;
				var obj = this.getPickerArr();		 
				var dateTimeArray=obj.dateTimeArray;
				var endTimeArray = obj.dateTimeArray;
				var dateTime = obj.dateTime;
				var startTime = [dateTime[0], dateTime[1], dateTime[2], 0, 0];
				var endTime = [dateTime[0], dateTime[1], dateTime[2], 23, 59];
				//获取当前日期
				var dateTime = this.createTimeStr(dateTimeArray,startTime);
				var endTime= this.createTimeStr(endTimeArray,endTime);
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "ios") {
					uni.navigateTo({
						url: '/pages/goodsDelivery/fleetIndex/map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + item.checkStatus
					})
					return;
				}
				if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '将获取您的定位权限以查看轨迹',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/goodsDelivery/fleetIndex/map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + item.checkStatus
								})
							}
						}
					})
					
				} else {
					uni.navigateTo({
						url: '/pages/goodsDelivery/fleetIndex/map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + item.checkStatus
					})
				}
			
			},
			//获取日期的picker显示
			getPickerArr(date) {
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let datenow = new Date();
				let endYear = datenow.getFullYear();
				let obj = dateTimePicker(this.startYear, endYear, date);
				// 精确到分的处理，将数组的秒去掉
				let lastArray = obj.dateTimeArray.pop();
				let lastTime = obj.dateTime.pop();
				return obj
			},
			toCollectUser(item, index) { // 收藏用户
				uni.showLoading();
				let cardFleetItem = getApp().globalData.cardFleetItem;
				if(cardFleetItem.id) {
					let params = {
						"commonUserId": this.userInfo.userId,
						"commonUserName": this.userInfo.userName ? this.userInfo.userName : this.userInfo.mobile,
						"fleetId": cardFleetItem.id,
						"fleetName": cardFleetItem.name,
						"userId": item.userId,
						"userCode": item.userCode
					}
					console.log('收藏', params);
					let that = this;
					utils.postRequest('/cd/fleetWithUser/invite', [params])
					.then(function (res) {
						console.log('收藏结果', res);
						if(res.retCode == '0000000'){
							uni.showToast({
								title: '收藏成功',
								icon: 'none'
							})
							that.carInfo[index].isCollect = 1;
							that.$forceUpdate();
						} else{
							uni.hideLoading();
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						uni.hideLoading();
						console.log('收藏请求失败', res.retDesc);
					})
				}else {
					this.getMyCardFleetInfo(item, index);
				}
			},
			getMyCardFleetInfo(item, index) {
				let params = {
					"commonUserId": this.userInfo.userId,
					"currentUserCode": this.userInfo.attrs.userCode,
					"isOwner": 1,
					"isMyFleet": 1,
					"isCardFleet": 1
				}
				let that = this;
				utils.postRequest('/cd/fleet/list', params)
				.then(function (res) {
					console.log('卡片车队结果', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							getApp().globalData.cardFleetItem = items[0];
							that.toCollectUser(item, index);
						}else {
							uni.hideLoading();
							uni.showToast({
								title: '名片夹查询异常，请联系管理员',
								icon: 'none'
							})
						}
					} else{
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log('卡片车队请求失败', res.retDesc);
				})
			},
			checkCollectNum(item, index) { // 检查消费次数
				if(item.checkStatus == 1) {
					this.checkFleetNumPopup(item, index);
				}else {
					uni.showLoading();
					let params = {
						"ownerUserCode": this.userInfo.attrs.userCode,
						"userId": this.userInfo.userId,
						"type": 1,
						"carSourceSid": [item.sid]
					}
					console.log('消费参数', params);
					let that = this;
					utils.postRequest('/olnanas/recommend/consumeNumber', params)
					.then(function (res) {
						console.log('消费结果', res);
						if(res.retCode == '0000000'){
							if(res.rspBody < 0) {
								that.carInfo[index].checkStatus = 1;
								that.checkFleetNumPopup(item, index);
							}else {
								uni.hideLoading();
								console.log('消费次数失败');
								that.getRemainingPoint();
							}
						} else{
							uni.hideLoading();
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						uni.hideLoading();
						console.log('消费请求失败', res.retDesc);
					})
				}
			},
			checkFleetNumPopup(item, index) { // 检查车队人数
				let params = {
					"usersid": this.userInfo.userId,
					"setmchannel": "app"
				}
				console.log('剩余条数费参数', params);
				let that = this;
				utils.postRequest('/cp/member/queryByUser', params)
				.then(function (res) {
					console.log('剩余条数结果', res);
					if(res.retCode == '0000000'){
						let noteStr = res.rspBody.setmitems;
						noteStr = noteStr.replace(/\//g, '');
						noteStr = JSON.parse(noteStr);
						console.log('JSON剩余条数结果', noteStr);
						that.fleetmemsize = Number(noteStr.fleetmemsize.nowsurnum);
						if(that.fleetmemsize < 1) {
							uni.hideLoading();
							that.$refs.noFleetNumPopup.open();
						}else {
							that.toCollectUser(item, index);
						}
					} else{
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log('剩余条数请求失败', res.retDesc);
				})
			},
		}
	}
</script>

<style lang="scss">
.hide_icon{
    right: -80rpx !important;
    opacity: 0.6 !important;
  }
	.luck_draw{
		position: fixed;
		// right: 0;
		// bottom: 300rpx;
		
		z-index: 999 !important;
		opacity: 1;
		transition-property: opacity , right; 
		transition-duration:0.6s , 0.6s;
		image{
		  width: 160rpx;
		  height: 160rpx;
		}
		.close_act{
			width: 30rpx;
			height: 30rpx;
			position: absolute;
			z-index: 10;
			right: 20rpx;
			top: -20rpx;
		}
	}
	page {
		background-color: #F1F4F9;
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
		display: none;
	}
	.nSourceIndex {
		padding-bottom: 50rpx;
		.splashScreen {
			width: 100vw;
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999999;
		}
		.optionsHead {
			padding:122rpx 36rpx 34rpx 36rpx;
			background-color: #FFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.userPositioning {
				display: flex;
				align-items: center;
				.pIcon {
					width: 34rpx;
					height: 40rpx;
					display: block;
					margin-right: 6rpx;
				}
				.msg {
					font-size: 24rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
				}
			}
			.codeBox {
				flex-shrink: 0;
				image {
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
		.swiperBox {
			height: 150rpx;
			margin-top:40rpx;
			width: 100vw;
			.advertisingBox {
				height: 150rpx;
				position: relative;
				padding: 0 36rpx;
				.advImg {
					height: 150rpx;
					width: 100%;
					border-radius: 24rpx;
				}
			}
		}
		.noticeBox {
			margin: 40rpx 36rpx 0 36rpx;
			padding: 8rpx 58rpx 8rpx 26rpx;
			background: #FFEBBE;
			box-shadow: 0px 0px 38rpx 2rpx rgba(255,193,63,0.44);
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			.noticeIcon {
				flex-shrink: 0;
				width: 27rpx;
				height: 35rpx;
				margin-right:24rpx;
			}
		}
		.mainSearchDataBox {
			margin: 36rpx 36rpx 0 36rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
			border-radius: 24rpx;
			padding: 38rpx 0 46rpx 0;
			.searchDataContent {
				// display: flex;
				// justify-content: space-between;
				// align-items: center;
				
				.dataBox {
					flex:1;
					overflow: hidden;
					padding-right: 38rpx;
					padding-top: 24rpx;
					.title {
						font-size: 32rpx;
						font-weight: 600;
						color: #000000;
						line-height: 44rpx;
						padding-left: 38rpx;
					}
					.dataGroup {
						display: flex;
						align-items: center;
						padding: 10rpx 0 10rpx 4rpx;
					}
					.scrollDataGroup {
						display: -webkit-box;
						overflow-x: scroll;
						overflow-y: hidden;
						// white-space: nowrap;
					}
					.scrollDataGroup, .dataGroup {
						.carBtn {
							width: 200rpx;
						}
						.lineBtn {
							width: 136rpx;
						}
						.dataBtn + .dataBtn {
							margin-left: 28rpx;
						}
						.dataBtn {
							height: 60rpx;
							line-height: 60rpx;
							box-shadow: 0px 0px 12rpx 2rpx rgba(67,150,248,0.28);
							border-radius: 8rpx;
							font-size: 32rpx;
							font-weight: 400;
							text-align: center;
						}
						.checkedDataBtn {
							background: #4396F8;
							color: #FFFFFF;
						}
						.defaultDataBtn {
							background: #FFFFFF;
							color: #464646;
						}
					}
					.noSettingAry {
						font-size: 24rpx;
						font-weight: 400;
						color: #666666;
						line-height: 44rpx;
						padding-left: 38rpx;
					}
				}
				.settingBtn {
					// flex-shrink: 0;
					// margin-right: 40rpx;
					width: 106rpx;
					height: 52rpx;
					line-height: 52rpx;
					background: #FF6161;
					border-radius: 8rpx;
					font-size: 28rpx;
					font-weight: 600;
					color: #FFFFFF;
					text-align: center;
					
					position: absolute;
					right:72rpx;
				}
			}
			.searchBtn {
				width: 400rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #2973FA;
				border-radius: 16rpx;
				margin: 38rpx auto 0 auto;
				.btn-msg {
					width: 400rpx;
					height: 80rpx;
					line-height: 80rpx;
					background: #2973FA;
					border-radius: 16rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #FFFFFF;
					text-align: center;
					position: relative;
					z-index: 2;
				}
				.bg-gradient {
					position: absolute;
					width: 264rpx;
					height: 44rpx;
					z-index: 1;
					box-shadow: 0 5rpx 30rpx 1rpx rgba(41, 115, 250, 0.6);
					margin: -44rpx 0 0 68rpx;
				}
			}
		}
		.searchInfoBox {
			padding:0 56rpx;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			.infoContent {
				flex: 1;
				height: 64rpx;
				line-height: 64rpx;
				padding: 0 26rpx;
				background: #FFEABE;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #EE3E02;
				.infoDefault {
					font-size: 28rpx;
					color:#AA7300;
					font-weight: 400;
				}
			}
			.mapBox {
				flex-shrink: 0;
				margin-left: 22rpx;
				display: flex;
				align-items: center;
				.mapIcon {
					width: 30rpx;
					height: 40rpx;
					margin-right: 8rpx;
					display: block;
				}
				.mapMsg {
					font-size: 24rpx;
					font-weight: 400;
					color: #333333;
					line-height: 28rpx;
				}
			}
		}
		.listBtnGroup {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 674rpx;
			height: 64rpx;
			padding: 20rpx 38rpx 0 38rpx;
			background-color: #F1F4F9;
			.selectBtnGroup {
				display: flex;
				align-items: center;
				.selectBox + .selectBox {
					// margin-left: 80rpx;
				}
				.selectBox {
					display: flex;
					align-items: center;
					.msg {
						font-size: 36rpx;
						font-weight: 500;
						line-height: 42rpx;
						margin-right: 12rpx;
					}
					.selectIcon {
						width: 27rpx;
						height: 15rpx;
					}
				}
			}
			.rightBtnBox {
				display: flex;
			}
			.mapBtn + .mapBtn {
				margin-left: 32rpx;
			}
			.mapBtn {
				padding: 0 24rpx;
				height: 64rpx;
				background: linear-gradient(90deg, #EA8E43 0%, #EA6A3A 100%);
				border-radius: 90rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.mapIcon {
					width: 46rpx;
					height: 46rpx;
					display: block;
					margin-right:6rpx;
				}
				.msg {
					font-size: 36rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}
		.carOptionList {
			margin: 24rpx 34rpx 0 34rpx;
			background-color: #FFF;
			box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
			border-radius: 24rpx;
			.listMsgBox {
				display: flex;
				padding: 18rpx 32rpx 32rpx 0;
				.leftContent {
					flex-shrink: 0;
					flex: 0 0 148rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					.avatar-icon {
					    margin-top: 12rpx;
					    width: 80rpx;
					    height: 86rpx;
					    flex-direction: column;
					    justify-content: center;
					    position: relative;
						.avatar {
							width: 80rpx;
							height: 80rpx;
							border-radius: 100%;
							z-index: 9;
						}
						.vipIcon {
							width: 34rpx;
							height: 34rpx;
							position: absolute;
							z-index: 10;
							margin: 52rpx 0 0 -36rpx;
						}
					}
					.driverStatusBox {
						display: flex;
						align-items: center;
						margin-top:8rpx;
						.statusIcon {
							width: 14rpx;
							height: 14rpx;
							border-radius: 100%;
							margin-right: 6rpx
						}
						.statusMsg {
							font-size: 28rpx;
							line-height: 33rpx;
						}
					}
				}
				.rightContent {
					flex: 1;
					.itemDriver {
						line-height: 44rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
						.driverName {
							font-size: 35rpx;
							font-weight: 600;
							color: #333333;
							padding-right: 13rpx;
						}
						.driverMobile {
							font-size: 28rpx;
							font-weight: 400;
							color: #333333;
							padding-right: 13rpx;
						}
						.driverCar {
							font-size: 35rpx;
							color: #333333;
						}
					}
					.driverMsg {
						margin-top: 16rpx;
						height: 48rpx;
						display:flex;
						justify-content: space-between;
						align-items: center;
						.itemAddress {
							font-size: 35rpx;
							font-weight: 500;
							color: #3888FF;
						}
						.detailsBtn {
							display:flex;
							align-items: center;
							padding-top: 6rpx;
							.msg {
								font-size: 28rpx;
								font-weight: 500;
								color: #5283FF;
								padding-right:10rpx;
							}
							.icon {
								width: 10rpx;
								height: 20rpx;
							}
						}
					}
					.itemDetails {
						margin-top: 16rpx;
						display: flex;
						.addressDetailsBox {
							flex: 1;
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: center;
							.beidou_icon {
								width: 34rpx;
								height: 34rpx;
								flex-shrink: 0;
								padding-right:10rpx;
							}
							.addr_text {
								font-size: 35rpx;
								color: #333333;
								line-height: 41rpx;
								// flex: 0 0 345rpx;
								// white-space: pre-wrap;
								width: 345rpx;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								word-break: break-all;
							}
						}
						.sourceCheckedMsg {
							flex-shrink: 0;
							font-size: 26rpx;
							color: #666666;
							line-height: 41rpx;
						}
					}
					.driverSyb {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 22rpx;
						.sybBox {
							display: flex;
							.sybList + .sybList {
								margin-left: 22rpx
							}
							.sybList {
								width: 108rpx;
								height: 46rpx;
								line-height: 46rpx;
								border-radius: 9rpx;
								border: 2rpx solid #5283FF;
								font-size: 26rpx;
								font-weight: 500;
								color: #5283FF;
								text-align: center;
								box-sizing: border-box;
							}
						}
						.hasWatch {
							font-size: 26rpx;
							color: #E8520D;
							line-height: 48rpx;
						}
					}
				}
			}
			.listBtnBox {
				.groupLine {
					margin: 0 28rpx 0 92rpx;
					height: 2rpx;
					background-color: #E0E0E0;
				}
				.userListBtnGroup {
					padding: 30rpx 52rpx;
					display: flex;
					justify-content: space-between;
					.btnBox {
						display: flex;
						align-items: center;
						.icon {
							width: 48rpx;
							height: 48rpx;
						}
						.msg {
							font-size: 28rpx;
							color: #333333;
							padding-left: 8rpx;
						}
						.collectionMsg {
							min-width: 92rpx;
						}
					}
				}
			}
		}
		.smsBox {
			width: 552rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			.smsContent {
				padding: 44rpx 80rpx 0 80rpx;
				text-align: center;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				line-height: 33rpx;
			}
			.smsPrice {
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 28rpx;
				text-align: center;
				margin-top: 16rpx;
			}
			.popupBtnGroup {
				display: flex;
				border-top: 2rpx solid #F1F1F1;
				margin-top:34rpx;
				.btn + .btn {
					border-left: 2rpx solid #F1F1F1;
				}
				.btn {
					flex: 1;
					padding: 18rpx 0 26rpx 0;
					text-align: center;
					font-size: 32rpx;
					font-weight: 400;
					color: #666666;
					line-height: 38rpx;
				}
				.cancel {
					color:#666;
				}
				.confirm {
					color:#4EADF1;
				}
			}
		}
		@keyframes rotating {
		    0% {
		        transform:rotate(0deg);
		    }
		    100% {
		        transform:rotate(360deg);
		    }
		}
		.loadingBox {
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 1.5s linear infinite;
		        animation: rotating 1.5s linear infinite;
			}
			.noDataIcon {
				width: 252rpx;
				height: 252rpx;
				margin-top:50rpx;
			}
		}
		.rspMsgBox {
			width: 410rpx;
			padding: 20rpx;
			box-sizing: border-box;
			height: 222rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 20rpx 2rpx rgba(56,136,255,0.18);
			border-radius: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.msgText {
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #000000;
				line-height: 44rpx;
				letter-spacing: 2rpx;
			}
		}
		.noSourceNumBox {
			width: 630rpx;
			.closeIcon {
				width: 48rpx;
				height: 48rpx;
				display: block;
				margin: 0 0 10rpx 582rpx;
			}
			.msgBox {
				width: 630rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				box-sizing: border-box;
				padding: 38rpx 0;
				.mainTitle {
					font-size: 40rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
				}
				.mainContent {
					margin-top: 30rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
					padding: 0 54rpx;
				}
				.singleTouUpBtn {
					height: 80rpx;
					padding: 0 18rpx 0 26rpx;
					margin: 44rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #E55516 0%, #EE9456 100%);
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 44rpx;
					}
					.sigleRightIcon {
						height: 30rpx;
						width: 30rpx;
						display: block;
					}
				}
				.memberTouUpBtn {
					height: 92rpx;
					padding: 0 18rpx 0 12rpx;
					margin: 20rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #31313F 0%, #1F1F28 100%);
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #F0AB88;
						line-height: 44rpx;
					}
					.toBuyBtn {
						width: 128rpx;
						height: 48rpx;
						border-radius: 228rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: linear-gradient(90deg, #F1D7C8 0%, #F0A27C 100%);
						.btnText {
							font-size: 28rpx;
							font-weight: 500;
							color: #422507;
						}
						.membersRightIcon {
							width: 28rpx;
							height: 28rpx;
							display: block;
						}
					}
				}
			}
		}
		.sweetHintBox {
			padding: 0 92rpx;
			.sweetHintIcon {
				width: 139rpx;
				height: 135rpx;
				display: block;
				margin: 0 auto -58rpx auto;
			}
			.sweetHintContent {
				width: 564rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				padding-top: 74rpx;
				.title {
					font-size: 36rpx;
					font-weight: 500;
					color: #333333;
					line-height: 42rpx;
					text-align: center;
				}
				.msg {
					font-size: 32rpx;
					color: #333333;
					line-height: 38rpx;
					padding: 32rpx 35rpx;
					text-align: center;
				}
				.btn {
					border-top: 2rpx solid #F1F1F1;
					padding: 22rpx 0 24rpx 0;
					font-size: 32rpx;
					font-weight: 500;
					color: #4EADF1;
					line-height: 38rpx;
					text-align: center;
				}
			}
		}
		.testBtn {
			width: 150rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: #2973FA;
			border-radius: 16rpx;
			font-size: 28rpx;
			color:#fff;
			text-align: center;
		}
		.sourceSelectBox {
			background-color: #FFF;
			padding:100rpx 0 66rpx 0;
			border-bottom-left-radius: 24rpx;
			border-bottom-right-radius: 24rpx;
			.selectHead {
				padding: 36rpx 34rpx;
				border-bottom: 2rpx solid #EAEAEA;
				display: flex;
				align-items: center;
				// .selectBox + .selectBox {
				// 	margin-left: 80rpx;
				// }
				.selectBox {
					display: flex;
					align-items: center;
					.msg {
						font-size: 36rpx;
						font-weight: 500;
						line-height: 42rpx;
						margin-right: 12rpx;
					}
					.selectIcon {
						width: 27rpx;
						height: 15rpx;
					}
				}
			}
			.selectBody {
				padding: 32rpx 34rpx 20rpx 34rpx;
				.selectTitleItem {
					display: flex;
					.title {
						width: 260rpx;
						font-size: 36rpx;
						font-weight: 500;
						color: #333333;
						line-height: 42rpx;
					}
				}
				.selectAddressBox {
					display: flex;
					padding: 50rpx 0;
					// 
					.province-item {
						height: 670rpx;
						.selectMsg + .selectMsg {
							margin-top:26rpx;
						}
					}
				}
			}
			.selectBody {
				.selectMsg {
					line-height: 38rpx;
					.check {
						width: 30rpx;
						height: 22rpx;
						margin-right: 10rpx;
					}
					.msg {
						font-size: 32rpx;
					}
				}
			}
			.pop-btn {
				height: 78rpx;
				width: 666rpx;
				display: flex;
				flex-direction: row;
				background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_pop_bg.png");
				background-size: cover;
				background-repeat: no-repeat;
				background-position: 100%;
				border-radius: 25rpx;
				margin: 0 auto;
				.pop-btn-item {
					width: 50vw;
					display: flex;
					justify-content: center;
					align-items: center;
					font-weight: 500;
					&.reset {
						color: rgba(43, 114, 240, 1);
					}
					&.look {
						color: #FFFFFF;
						
					}
				}
			}
		}
		.driverPop {
			width: 620rpx;
			height: 506rpx;
			border-radius: 24rpx;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.driverPop-title {
			margin: 38rpx 36rpx 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			font-size: 40rpx;
			color: rgba(51, 51, 51, 1);
			font-weight: 500;
		}
		.driverPop-sub-title {
			margin-bottom: 40rpx;
		}
		.driverPop-sub-title-text {
			color: rgba(51, 51, 51, 1);
			font-size: 36rpx;
		}
		.driverPop-label-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}
		.driverPop-label-item-last {
			margin-top: 36rpx;
		}
		.driverPop-label {
			font-size: 40rpx;
			color: rgba(51, 51, 51, 1);
			padding-right: 20rpx;
		}
		.driverPop-input {
			width: 166rpx;
			height: 60rpx;
			border-radius: 8rpx;
			border: 2rpx solid rgba(51, 51, 51, 1);
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			text-align: center;
		}
		.driver-publish {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.driver-publish-btn {
			width: 320rpx;
			height: 68rpx;
			background-color: rgba(0, 150, 235, 1);
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.driver-publish-btn-text {
			color: #FFFFFF;
			font-weight: 500;
			font-size: 32rpx;
		}
		.driver-pop-close {
			position: absolute;
			top: -80rpx;
			right: 0;
			width: 58rpx;
			height: 58rpx;
		}
		.splash-btn {
			position: fixed;
			top: 112rpx;
			right: 30rpx;
			z-index: 99999999;
			width: 132rpx;
			height: 60rpx;
			background-color: rgba(30, 119, 219, 1);
			border-radius: 78rpx;
			color: #FFFFFF;
			font-weight: 500;
			font-size: 28rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
		.toRolate {
			transform-origin:center center;
			transform: rotate(180deg);
			transition: transform 0.2s;
		}
	}
</style>