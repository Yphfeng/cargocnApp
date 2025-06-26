<template>
	<view class="container" id="containerId1" :style="{'padding-top': titleHeight}">
		<view class="header" :style="{height: (isLogin && !identityVerify) ? '360rpx' : '286rpx'}">
			<view class="headerImg" @click="loginCheck('../settings/index')">
				<view class="imgBox">
					<image src="../../../static/images/icon_5.png"></image>
				</view>
			</view>
			<view class="header-content">
				<view  class="avatar" @tap="jumpToEditUserInfo()">
					<image mode="aspectFill" v-if="!userAvatar || !isLogin" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png"></image>
					<image mode="aspectFill" v-if="userAvatar && isLogin" :src="userAvatar"></image>
				</view>
				 
				 <view class="header-title" v-if="isLogin" @tap="jumpToEditUserInfo()">
					<view class="sub-title">
						<view class="userName" :style="identityVerify ? 'color:#FF8D02;' : 'color:#333;'">{{userName ? userName : '匿名用户'}}</view>
						<view class="rz" v-if="identityVerify">
							<image src="../../../static/images/certification.png" class="rz-icon"></image>
							<text class="no-text" style="color: #FFC013">已认证</text>
						</view>
						<view class="rz" v-else>
							<image src="../../../static/images/certification-no.png" class="rz-icon"></image>
							<text class="no-text" style="color: #AAAAAA">未认证</text>
						</view>
						<text class="userLevel" v-if="countObj.levelName" :style="countObj.driverLevelId && countObj.driverLevelId > 2 ? 'color:#40A9FF;' : 'color:#BD806B;'">{{countObj.levelName}}认证</text>
					</view>
					<view class="mobileBox">
						<view class="onLine" @click.stop="switchOnLine" :class="{active: taskStatus == 2}">
							<view class="onLine-text" :class="{active: taskStatus == 2}">{{(taskStatus == 1 || taskStatus == undefined)  ? '可接单' : '忙碌'}}</view>
						</view>
						<text class="mobile" @click="setClipboardData(userCode)">卡友号：{{userCode}}</text>
						<text class="mobile">{{mobileSet}}</text>
					</view>
				 </view>
				 <view class="header-title" v-else @click="login">
				 	未登录
				 </view>
			</view>
			<!-- <image src="../../../static/images/scan.png"  class="qrCode" mode="widthFix"></image> -->
			<view class="certificationBox" v-if="isLogin && !identityVerify" @click="loginCheck('/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers')">上传身份证进行认证，点击认证 ></view>
			<view class="private-box">
				<view class="private-child" @tap="jumpToMyrelease()">
					<view class="private-num">{{countObj.publishNum?countObj.publishNum:0}}</view>
					<view class="private-text bold">我的发布</view>
				</view>
				<view class="private-child">
					<view class="private-num">{{countObj.likeNum?countObj.likeNum:0}}</view>
					<view class="private-text">获赞</view>
				</view>
				<view class="private-child">
					<view class="private-num">{{countObj.commentNum?countObj.commentNum:0}}</view>
					<view class="private-text">收到评论</view>
				</view>
				<view class="private-child">
					<view class="private-num">{{countObj.points?countObj.points:0}}</view>
					<view class="private-text">贡献值</view>
				</view>
			</view>
		</view>
		<view :style="{'padding-top':(isLogin && !identityVerify) ? '450rpx' : '376rpx'}">
			
			<view class="priceWhole">
				<view class="title">
					<text class="text">我的钱包</text>
					<view class="subText" @click="goPurchase">进入钱包<image src="../../../static/images/icon_right.png" class="arraw_right"></image></view>
				</view>
				<view class="subContent">
					<view class="contentItem left" @click="goPurchase">
						<text class="price">{{isLogin ? allAmountWithIn : '-'}}</text>
						<text class="label">余额（元）</text>
					</view>
					<view class="contentItem" @tap="jumpToIntegralDetails()">
						<text class="price">{{isLogin ? points : '-'}}</text>
						<text class="label">积分</text>
					</view>
				</view>
			</view>
			<view class="activity-box" v-if="advertisingBanner.length > 0">
				<view class="activity-box-sub" v-if="advertisingBanner[0].advUrl || advertisingBanner[1].advUrl">
					<view class="activity-child">
						<image v-if="advertisingBanner[0].advUrl"  class="activity-img" :src="advertisingBanner[0].advUrl" mode="widthFix" @tap="previewImage(0)"></image>
					</view>
					<view class="activity-child">
						<image v-if="advertisingBanner[1].advUrl" class="activity-img" :src="advertisingBanner[1].advUrl" mode="widthFix" @tap="previewImage(1)"></image>
					</view>
				</view>
				<view class="seperateLine" v-if="advertisingBanner[2].advUrl && (advertisingBanner[0].advUrl || advertisingBanner[1].advUrl)" />
				<view class="activity-child-whole" v-if="advertisingBanner[2].advUrl">
					<image class="activity-img" :src="advertisingBanner[2].advUrl" mode="widthFix" @tap="previewImage(2)"></image>
				</view>
			</view>
			
			<view class="common-box">
				<view class="common-title">常用功能</view>
				<view class="common-content">
					<view class="common-child" @click="loginCheckIdNo">
						<view class="imgTotal">
							<image class="common-img" src="/static/images/ship/myImgs/my_info1.png" mode="widthFix"></image>
						</view>
						<view class="common-text">实名认证</view>
					</view>
					<view class="common-child" @click="loginCheck('../driverVerify/newDriverVerify')">
						<view class="imgTotal">
							<image class="common-img6" src="/static/images/ship/myImgs/my_info2.png" mode="widthFix"></image>
						</view>
						<view class="common-text">驾驶证认证</view>
					</view>
					<view class="common-child" @click="$noMultipleClicks(loginCheck,'../carVerify/carList')">
						<view class="imgTotal">
							<image class="common-img6" src="/static/images/ship/myImgs/my_info3.png" mode="widthFix"></image>
						</view>
						<view class="common-text">车辆认证</view>
					</view>
					<view class="common-child" @click="$noMultipleClicks(goTransport)">
						<view class="imgTotal">
							<image class="common-img6" src="/static/images/ship/myImgs/my_info2.png" mode="widthFix"></image>
						</view>
						<view class="common-text">承运资质认证</view>
					</view>
					<!-- <view class="common-child" @click="loginCheck('../driverVerify/index')"> -->
					
					
					
				<!-- 	<view class="common-child" @click="loginCheckUser('../serviceStationCertification/index')">
						<view class="">
							<image class="common-img1" src="/static/images/ship/myImgs/my_info5.png" mode="widthFix"></image>
						</view>
						<view class="common-text">服务站认证</view>
					</view> -->
					<!-- <view class="common-child" @click="loginCheck('/pages/mutual/index/newIndex')">
						<view class="">
							<image class="common-img6" src="../../../static/images/mutual.png" mode="widthFix"></image>
						</view>
						<view class="common-text">卡友互助</view>
					</view> -->
					<view class="common-child" @click="loginCheck('/pages/ship/waybill/waybill')">
						<view class="imgTotal">
							<image class="common-my-order" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/my-order-icon.png" mode=""></image>
						</view>
						<view class="common-text">我的运单</view>
					</view>
					
					
					<!-- <view class="common-child" @click="goRoad">
						<view class="">
							<image class="common-img5" src="../../../static/images/roadIcon.png" mode="widthFix"></image>
						</view>
						<view class="common-text">路况</view>
					</view>
					<view class="common-child" @click="goService">
						<view class="imgTotal">
							<image class="common-img3" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/service_station.png" mode="widthFix"></image>
						</view>
						<view class="common-text">服务站</view>
					</view> -->
					<!-- <view class="common-child" @click="goJym">
						<view class="">
							<image class="common-img" src="../../../static/images/hygc.png" mode=""></image>
						</view>
						<view class="common-text">优惠加油</view>
					</view> -->
					<!-- <view class="common-child" @click="isDevelopment(1)">
						<view class="">
							<image class="common-img" src="../../../static/images/yhjy.png" mode=""></image>
						</view>
						<view class="common-text">货源广场</view>
					</view> -->
					<!-- <view class="common-child" @click="goFleetCreate">
						<view class="imgTotal">
							<view class="dotted" v-if="!isCreateDot"></view>
							<image class="common-img3" src="../../../static/images/creatCarTeam.png" mode="widthFix"></image>
						</view>
						<view class="common-text">创建车队</view>
					</view> -->
					<!-- <view class="common-child" @click="goFleetAdd">
						<view class="imgTotal">
							<view class="dotted" v-if="!isAddDot"></view>
							<image class="common-img3" src="../../../static/images/myCarTeam.png" mode="widthFix"></image>
						</view>
						<view class="common-text">加入车队</view>
					</view> -->
					<view class="common-child" @click="goMineLike">
						<view class="imgTotal">
							<view class="dotted" v-if="!isMineLikeDot"></view>
							<image class="common-img4" src="../../../static/images/myLike.png" mode="widthFix"></image>
						</view>
						<view class="common-text">我的喜好</view>
					</view>
					<view class="common-child" @click="goMineBand">
						<view class="imgTotal">
							<image class="common-img4" src="../../../static/images/myBank.png" mode="widthFix"></image>
						</view>
						<view class="common-text">我的银行卡</view>
					</view>
					
			<!-- 		<view class="common-child" @click="goInvite">
						<view class="imgTotal">
							<image class="common-img" src="/static/images/ship/myImgs/my_info6.png" mode=""></image>
						</view>
						<view class="common-text">邀请好友</view>
					</view>
					<view class="common-child" @click="inviteCode">
						<view class="imgTotal">
							<image class="common-img2" src="/static/images/ship/myImgs/my_info7.png" mode=""></image>
						</view>
						<view class="common-text">输入邀请码</view>
					</view> -->
					<view class="common-child" @click="goHelpService">
						<view class="imgTotal">
							<image class="common-img" src="/static/images/ship/myImgs/my_info4.png" mode=""></image>
						</view>
						<view class="common-text">帮助与客服</view>
					</view>
				<!-- 	<view class="common-child" @click="goMedal">
						<view class="imgTotal">
							<image class="common-img" src="/static/images/ship/myImgs/chinaTravel_image.png" mode=""></image>
						</view>
						<view class="common-text">勋章墙</view>
					</view>
					
					<view class="common-child" @click="goTreasure">
						<view class="imgTotal">
							<image class="common-img" src="/static/images/ship/myImgs/treasure.png" mode=""></image>
						</view>
						<view class="common-text">宝藏箱</view>
					</view> -->
					<!-- <view class="common-child" @click="goUserLocation">
						<view class="imgTotal">
							<image class="common-img" src="/static/images/ChinaTravel/positionIcon.png" mode=""></image>
						</view>
						<view class="common-text">我的轨迹</view>
					</view> -->
					<view class="common-child" @click="showWxCode">
						<view class="imgTotal">
							<image class="common-img" style="width: 40rpx;height: 40rpx;margin-top: 10rpx" src="/static/images/wx-driver.png" mode=""></image>
						</view>
						<view class="common-text" style="margin-top: 20rpx">客服微信</view>
					</view>
				<!-- 	<view class="common-child" @click="loginCheck('../mutualAssistance/index')">
						<view class="imgTotal">
							<image class="common-img" src="../../../static/images/myMutual.png" mode=""></image>
						</view>
						<view class="common-text">我的互助</view>
					</view> -->
					<!-- <view class="common-child" @click="goServiceList">
						<view class="imgTotal">
							<image class="common-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/service_icon.png" mode=""></image>
						</view>
						<view class="common-text">服务站</view>
					</view> -->
			<!-- 		<view class="common-child" @click="toOrderBox">
						<view class="imgTotal">
							<image class="common-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/driver_member.png" mode=""></image>
						</view>
						<view class="common-text">智能卡车盒</view>
					</view>
					<view class="common-child" @click="toExtension">
						<view class="imgTotal">
							<image class="common-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/driver_1.png" mode=""></image>
						</view>
						<view class="common-text">推广赚钱</view>
					</view> -->
				
				</view>
				
			</view>
			<!-- <view class="modelList" @click="loginCheck('../mutualAssistance/index')">
				<view class="listIcon"><image src="../../../static/images/icon_help.png"></image></view>
				<view class="modelListTitle">
					<view class="msg">我的互助</view>
					<view class="rightIcon"><image src="../../../static/images/newRightIcon.png"></image></view>
				</view>
			</view>
			<view class="modelList" @click="loginCheck('../userVerify/index')" style="margin-top: 16rpx;">
				<view class="listIcon"><image src="../../../static/images/icon_1.png"></image></view>
				<view class="modelListTitle line-box">
					<view class="msg">实名认证</view>
					<view class="rightIcon"><image src="../../../static/images/newRightIcon.png"></image></view>
				</view>
			</view>
			<view class="modelList" @click="loginCheck('../carVerify/carList')">
				<view class="listIcon"><image src="../../../static/images/icon_2.png"></image></view>
				<view class="modelListTitle line-box">
					<view class="msg">车辆认证</view>
					<view class="rightIcon"><image src="../../../static/images/newRightIcon.png"></image></view>
				</view>
			</view>
			<view class="modelList" @click="loginCheck('../driverVerify/index')">
				<view class="listIcon"><image src="../../../static/images/icon_3.png"></image></view>
				<view class="modelListTitle line-box">
					<view class="msg">驾驶证认证</view>
					<view class="rightIcon"><image src="../../../static/images/newRightIcon.png"></image></view>
				</view>
			</view>
			<view class="modelList" @click="loginCheck('../serviceStationCertification/index')">
				<view class="listIcon"><image src="../../../static/images/icon_6.png"></image></view>
				<view class="modelListTitle">
					<view class="msg">服务站认证</view>
					<view class="rightIcon"><image src="../../../static/images/newRightIcon.png"></image></view>
				</view>
			</view>
			<view class="modelList" @click="jumpTocontactUs('./onlineService')" style="margin-top: 16rpx;">
				<view class="listIcon"><image src="../../../static/images/icon_4.png"></image></view>
				<view class="modelListTitle line-box">
					<view class="msg">在线客服</view>
					<view class="rightIcon"><image src="../../../static/images/newRightIcon.png"></image></view>
				</view>
			</view>
			<view class="modelList" @click="jumpTocontactUs('./contactUs')">
				<view class="listIcon"><image src="../../../static/images/icon_7.png"></image></view>
				<view class="modelListTitle">
					<view class="msg">联系我们</view>
					<view class="rightIcon"><image src="../../../static/images/newRightIcon.png"></image></view>
				</view>
			</view> -->
			
			<view class="serviceMobile" style="color: #338fe5" @click="requestPower">客服电话：400-016-0606</view>
		</view>
		<view
      @click="closeMask"
      class="mask"
      :style="{ opacity: isShowTran ? 1 : 0 }"
      v-if="isShowWxCode"
    >
      <view
        class="dialog"
        @click.stop
        :style="{ bottom: isShowDialog ? '0' : '-100vh' }"
      >
        <image
          @click="closeMask"
          class="close_btn"
          src="../../../static/images/uploadReport/close.png"
        ></image>
        <image
          class="head_img"
          src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/head.png"
        ></image>
        <view class="dialog_nickname">团团</view>
        <view class="dialog_text">保存到手机后，打开微信扫码添加</view>
        <image
          class="qr_code"
          :src="serviceImage"
        ></image>
        <view class="dialog_save_btn" @click="saveImg">保存</view>
				<view style="height: 50rpx"></view>
      </view>
    </view>
	</view>
</template>

<script>
	import md5 from 'js-md5';
	import {loginSelf, postRequest} from "../../../utils/service.js"
	import * as publicData from "@/utils/publicData"
	import * as ship from "@/utils/ship";
	// const GotheModule = uni.requireNativePlugin("GotheModule");
	// var globalEvent = uni.requireNativePlugin('globalEvent');
	var wxScanModule = uni.requireNativePlugin("WxScanModule");
	var globalEvent = uni.requireNativePlugin('globalEvent');
	var speakModule = uni.requireNativePlugin("SpeakModule");
	var isClicking = false;
	export default {
		data() {
			return {
				noClick: true,
				userInfo: null,
				isCreateDot: false,
				isAddDot: false,
				isMineLikeDot: false,
				userName: '',
				mobile: '',
				mobileSet: '',
				driverVerify: false,
				isLogin: false,
				userCode: '',
				identityVerify: false,
				userAvatar: '',
				countObj: {},
				showModalFlag: true,
				currentIndex: 0,
				points: 0,
				faceAuthStatus: "", // 人脸认证状态
				onLineText: "可接单",
				onLineStatus: 0,
				ChinaTravelObj: { // 中国行对象
				  address: {}, // 地址
				  show: false, // 是否有活动
				  ChinaTravelInfo: {}, // 活动信息
				}, 
				codeArr: [],
				isShowWxCode: false,
				isShowTran: false,
				isShowDialog: false,
				serviceImage: '',
			}
		},
		onLoad() {
			let that = this;
		},
		onShow() {
			var that = this
			var hasNet = this.$store.state.hasNet;
			if (!hasNet) {
				uni.showToast({
					title: '网络异常，请检查后重试',
					icon: 'none'
				})
			}
			//获取设备id
			var deviceId = plus.push.getClientInfo().clientid;
			var token = plus.push.getClientInfo();
			console.log(deviceId, 　token, 'qwqw12')
			
			
			var isCreateDot = uni.getStorageSync("isCreateDot");
			var isAddDot = uni.getStorageSync("isAddDot");
			var isMineLikeDot = uni.getStorageSync('isMineLikeDot');
			this.isAddDot = isAddDot;
			this.isCreateDot = isCreateDot;
			this.isMineLikeDot = isMineLikeDot;
			let systemInfo = uni.getSystemInfoSync();
			const system = systemInfo.platform
			var statusBarHeight = systemInfo.statusBarHeight
			console.log(statusBarHeight, 'asaaaaaaa')
			var titleHeight = 0;
			if (system === 'android') {
				titleHeight =  statusBarHeight*2 + 'rpx'
			} else if (system === 'ios') {
				titleHeight = statusBarHeight*2 + 'rpx'
			}
			this.titleHeight = titleHeight;
			var userInfo = uni.getStorageSync("userInfo");
			console.log(userInfo, 'asa')
			if (userInfo) {
				
				this.isLogin = true;
				this.userName = JSON.parse(userInfo).userName;
				this.taskStatus = JSON.parse(userInfo).attrs.taskStatus;
				console.log(this.taskStatus, '状态11111111111')
				this.userAvatar = JSON.parse(userInfo).attrs.avatar;
				this.mobile = JSON.parse(userInfo).mobile;
				var mobile = JSON.parse(userInfo).mobile;
				var str1 = mobile.substring(0, 3);
				var str2 = mobile.substring(7);
				this.mobileSet = str1 + '****' + str2;
				this.userCode = JSON.parse(userInfo).attrs.userCode;
				this.identityVerify = JSON.parse(userInfo).attrs.identityVerify ? true : false;
				this.getCountInfo();
				this.$store.dispatch("getBalance"); //获取余额
				//获取广告图片
				this.$store.dispatch("getAdvertise");
				//获取积分信息
				var userId = JSON.parse(userInfo).userId;
				ship.postRequest("/yh/business/user/select/by/user/id?userId=" + userId, {
					userId: JSON.parse(userInfo).userId
				})
				.then(res => {
					console.log(res, '积分')
					if (res.retCode == "0000000") {
						this.points = res.rspBody.points;
					}
				}).catch(err => {
					console.log(err)
				})
				this.userInfo = JSON.parse(userInfo);
			} else {
				this.identityVerify = false
				this.isLogin = false
			}
			
			
			console.log('用户信息', this.userAvatar);
			if(getApp().globalData.sceneIndex==1){
				uni.getSystemInfo({
					success: (res) => {
						if (res.platform == 'ios') {
							const query = uni.createSelectorQuery().in(this);
							var isRecovery = true;
							query
								.select('#containerId1')
								.boundingClientRect(data => {
									isRecovery = false;
								})
								.exec();
							getApp().globalData.sceneIndex= 2;
							var timer = setTimeout(() => {
								if (isRecovery) {
									uni.reLaunch({
										url:'/pages/my/index/index'
									})
									clearTimeout(timer);
									timer = null;
								}
							}, 500)
						}
					},
				})
			}
			// that.getChinaTravel() // 判断是否有中国行活动
			console.log('判断是否有中国行活动')
		},
		onPullDownRefresh() {
			var that = this
			//获取设备id
			var deviceId = plus.push.getClientInfo().clientid;
			var token = plus.push.getClientInfo();
			console.log(deviceId, 　token, 'qwqw12')
			
			
			var isCreateDot = uni.getStorageSync("isCreateDot");
			var isAddDot = uni.getStorageSync("isAddDot");
			var isMineLikeDot = uni.getStorageSync('isMineLikeDot');
			this.isAddDot = isAddDot;
			this.isCreateDot = isCreateDot;
			this.isMineLikeDot = isMineLikeDot;
			let systemInfo = uni.getSystemInfoSync();
			const system = systemInfo.platform
			var statusBarHeight = systemInfo.statusBarHeight
			console.log(statusBarHeight, 'asaaaaaaa')
			var titleHeight = 0;
			if (system === 'android') {
				titleHeight =  statusBarHeight*2 + 'rpx'
			} else if (system === 'ios') {
				titleHeight = statusBarHeight*2 + 'rpx'
			}
			this.titleHeight = titleHeight;
			var userInfo = uni.getStorageSync("userInfo");
			console.log(userInfo, 'asa')
			if (userInfo) {
				this.isLogin = true;
				this.userName = JSON.parse(userInfo).userName;
				this.taskStatus = JSON.parse(userInfo).attrs.taskStatus;
				console.log(this.taskStatus, '状态11111111111')
				this.userAvatar = JSON.parse(userInfo).attrs.avatar;
				this.mobile = JSON.parse(userInfo).mobile;
				var mobile = JSON.parse(userInfo).mobile;
				var str1 = mobile.substring(0, 3);
				var str2 = mobile.substring(7);
				this.mobileSet = str1 + '****' + str2;
				this.userCode = JSON.parse(userInfo).attrs.userCode;
				this.identityVerify = JSON.parse(userInfo).attrs.identityVerify ? true : false;
				this.getCountInfo();
				this.$store.dispatch("getBalance"); //获取余额
				//获取广告图片
				this.$store.dispatch("getAdvertise");
				//获取积分信息
				var userId = JSON.parse(userInfo).userId;
				ship.postRequest("/yh/business/user/select/by/user/id?userId=" + userId, {
					userId: JSON.parse(userInfo).userId
				})
				.then(res => {
					console.log(res, '积分')
					if (res.retCode == "0000000") {
						this.points = res.rspBody.points;
					}
				}).catch(err => {
					console.log(err)
				})
				this.userInfo = JSON.parse(userInfo);
			} else {
				this.identityVerify = false
				this.isLogin = false
			}
			
			
			console.log('用户信息', this.userAvatar);
			if(getApp().globalData.sceneIndex==1){
				uni.getSystemInfo({
					success: (res) => {
						if (res.platform == 'ios') {
							const query = uni.createSelectorQuery().in(this);
							var isRecovery = true;
							query
								.select('#containerId1')
								.boundingClientRect(data => {
									isRecovery = false;
								})
								.exec();
							getApp().globalData.sceneIndex= 2;
							var timer = setTimeout(() => {
								if (isRecovery) {
									uni.reLaunch({
										url:'/pages/my/index/index'
									})
									clearTimeout(timer);
									timer = null;
								}
							}, 500)
						}
					},
				})
			}
			that.getChinaTravel() // 判断是否有中国行活动
			console.log('判断是否有中国行活动')
			uni.stopPullDownRefresh();
		},
		computed: {
			allAmountWithIn() {
				return this.$store.state.allAmountWithIn || 0
			},
			advertisingBanner() {
				return this.$store.state.advertiseImg
			},
		},
		onUnload() {
			isClicking = false;
		},
		
		methods: {
			toOrderBox() {
				uni.navigateTo({
					url: '/pages/extension/order_receiving_box/orderBoxBuy'
				})
			},
			toExtension() {
				uni.navigateTo({
					url: '/pages/extension/extension_report/extension_report'
				})
			},
			speak() {
				//语音播报
				speakModule.speak({text: "早上好吗，味道去阿我的伟大"}, res => {
					console.log(res, '播报结果')
				})
			},
			saveImg() {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '将获取您的存储权限，以将二维码保存到您的相册',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: "请稍候...",
								mask: true,
							});
							uni.saveImageToPhotosAlbum({
								filePath:
									"https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/downImg.png",
								success: function () {
									console.log("save success");
									uni.hideLoading();
									uni.showToast({
										title: "保存成功",
										icon: "success",
									});
									that.closeMask();
								},
							});
						}
					},
				})	
			
			},
			closeMask() {
				let that = this;
				that.isShowDialog = false;
				setTimeout(() => {
					that.isShowTran = false;
					setTimeout(() => {
						that.isShowWxCode = false;
					}, 100);
				}, 200);
			},
			showWxCode() {
				
				let that = this;
				that.isShowWxCode = true;
				setTimeout(() => {
					that.isShowTran = true;
					setTimeout(() => {
						that.isShowDialog = true;
						that.serviceImage = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/qrcode.png' + '?pid=' + Math.random()
					}, 100);
				}, 100);
			},
			requestPower() {
				var text = "我们将收集您的电话号码，便于您联系客服";
				publicData.requestPower(text, this.makePhone);
			},
			makePhone(){
				uni.makePhoneCall({
					phoneNumber:'400-016-0606' //仅为示例
				});
			},
			async goUserLocation(){
				let that = this;
				let userInfo = uni.getStorageSync('userInfo')
				var mobile = JSON.parse(userInfo).mobile;
				uni.showModal({
					title:'提示',
					content: '同意将获取您的定位用于显示您的定位轨迹信息',
					success: function(result) {
						if (result.confirm) {
							uni.getLocation({
								geocode: true,
								type: 'gcj02',
								success: function(res) {
									console.log(res,'resres')
									let lat = res.latitude
									let lng  = res.longitude
									uni.navigateTo({
										url: '../historyLocation/index?lat=' + lat + '&lng=' + lng
									})
								},
								fail: function(res) {
													
								}
							})
						}
					}
				})
								
			    return;
				
				// let res = await ship.postRequest("/locationNew/get_infos_to_PC", {
				// 	interfaces: 1,
				// 	mobile: mobile,
				// 	// mobile:'18186243297',
				// 	pageNum: 1,
				// 	pageSize: 10
				// })
				// console.log(res,'resresres')
				// console.log(res.rspBody.items.length,'resresres')
				// var details;
				// if(res.rspBody.items.length != 0) {
				// 	details = res.rspBody.items[0]
				// }
				//   uni.getLocation({
				//   	geocode: true,
				//   	type: 'gcj02',
				//   	success: function(res) {
				// 		console.log(res,'resres')
				//   		let lat = res.latitude
				//   		let lng  = res.longitude
				// 		//返回是否有车牌信息
				// 		uni.navigateTo({
				// 			url: '../historyLocation/index?details=' +JSON.stringify(details)  + '&lat=' + lat + '&lng=' + lng
				// 		})
						
				//   		console.log("获取用户当前位置")
				//   	},
				//   	fail: function(res) {
						
				//   	}
				//   })	
			},
			goScan() {
				wxScanModule.scanActivity({}, (data) => {
					console.log('扫描结果', data)
				})
				// uni.navigateTo({
				// 	url: '/pages/my/index/wssScan'
				// })
			},
      // 中国行获取定位
      getChinaTravelLocation(){
        let that = this
        return new Promise((resolve,reject) => {
          uni.getLocation({
          geocode: true,
          type: 'gcj02',
          success: function(res) {
            // console.log(that.ChinaTravelObj)
            if (!that.ChinaTravelObj.address) {
              that.ChinaTravelObj.address = {}
            }
            let address = res.address
            that.ChinaTravelObj.address.province = address.province.replace("市","");
            that.ChinaTravelObj.address.city = address.city
            that.ChinaTravelObj.address.district = address.district
            that.ChinaTravelObj.address.latitude = res.latitude
            that.ChinaTravelObj.address.longitude  = res.longitude
            resolve(true)
            // console.log("中国行活动标识",that.ChinaTravelObj)
            // console.log("中国行活动标识",res)
          },
          fail: function(res) {
            console.log('中国行获取定位失败')
            console.log(res)
            that.ChinaTravelObj.address = null
            resolve(false)
            uni.showToast({
              title: '请打开定位',
              icon: 'none'
            })
          }
        })
        })
        
      },
      // 判断是否三证认证
      isThreeAuth(){
        let that = this
        console.log("三证校验结果")
        var userInfo = uni.getStorageSync("userInfo");
        let flag = false
			  if (userInfo) {
          var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
          var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
          var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
          if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
            uni.showToast({
              title: '请在“我的”里面完成三项认证后参与活动',
              icon: 'none'
            })
            flag = false
          } else {
            flag = true
          }
        }
        return flag
      },
      // 判断是否有中国行活动
      async getChinaTravel(){
        let that = this
        let TravelRes = await ship.newRegisterPostRequest("/dlzg/lightenchina/getgame", {})
        if(TravelRes.rspBody){
          that.ChinaTravelObj.show = true
          that.ChinaTravelObj.ChinaTravelInfo = TravelRes.rspBody 
          console.log("获取用户位置信息")
          await that.getChinaTravelLocation()
        }else{
          that.ChinaTravelObj.show = false
          that.ChinaTravelObj.ChinaTravelInfo = {}
        }
        // console.log("中国行活动标识",that.ChinaTravelObj)
        
      },
      // 按钮跳转到点亮中国行页面
      async goBtnChinaTravel(){
        let that = this
        if(!ship.btnRepeat()) return false; // 防抖
        // if(!that.isThreeAuth()){
        //   return false
        // }
        let info = that.ChinaTravelObj
        let loactionFlag = await that.getChinaTravelLocation()
        if(!loactionFlag){
          return
        }
        console.log(info)
        let userInfo = uni.getStorageSync("userInfo");
        let userCode = JSON.parse(userInfo).attrs.userCode;
        let data = {
          userCode: userCode, // 卡友号码
          gameId: info.ChinaTravelInfo.sid, // 活动ID
          latitude: info.address.latitude, // 经纬度
          longitude: info.address.longitude,
          province: info.address.province, // 省市区
          city: info.address.city,
          county: info.address.district
        }
        let res = await ship.newRegisterPostRequest("/dlzg/lightenchina/getgame", {province: info.address.province})
        res.rspBody.province = info.address.province
        res.rspBody.city = info.address.city
        res.rspBody.county = info.address.district
        res.rspBody.image = res.rspBody.medalImage
        res.rspBody.data = data
        uni.navigateTo({
          url: '../../index/ChinaTravel/index?info=' + JSON.stringify(res.rspBody)
        })
      },
			goMedal(){
				uni.navigateTo({
				  url: '../../index/ChinaTravel/medal?isMy=1'
				})
			},
			
			goTreasure(){
				console.log('宝藏箱')
				uni.navigateTo({
					url:'./treasureNav'
				})
			},
			async switchOnLine() {
				var that = this;
				uni.showLoading();
				try{
					var res = await ship.postRequest("/yh/user/verify/change/user/task/status", {
						taskStatus: that.taskStatus == 2 ? 1 : 2
					})
					uni.hideLoading();
					console.log(res, '更高')
					if (res.retCode == "0000000") {
						var userInfo = uni.getStorageSync("userInfo");
						if (userInfo) {
							var user = JSON.parse(userInfo);
							user.attrs.taskStatus = that.taskStatus == 2 ? 1 : 2;
							uni.setStorageSync("userInfo",JSON.stringify(user));
						}
						that.taskStatus = that.taskStatus == 2 ? 1 : 2;
						that.$forceUpdate();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			getCountInfo(){
				var that = this;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var userId = JSON.parse(userInfo).userId;
				ship.postRequest('/yh/business/user/select/by/user/id?userId=' + userId, {
					userId: userId
				})
				.then(res=>{
					console.log('获赞数', res);
					if(res.retCode == "0000000"){
						var countObj = res.rspBody;
						var publishProviderNum = countObj.publishProviderNum || 0;
						var publishSituationNum = countObj.publishSituationNum || 0;
						var publishHelpNum = countObj.publishHelpNum || 0;
						countObj.publishNum = publishProviderNum + publishSituationNum + publishHelpNum;
						that.countObj = countObj;
					} else{
						
					}
				})
				.catch(err=>{
					
				})
			},
			clickTo() {
				console.log('开始请求')
				//初始化
				GotheModule.startWork();
				GotheModule.initLocation();
				setTimeout(() => {
					GotheModule.startLocation({},res => {
						console.log(res, '是否开启')
					})
				}, 3000)
				
			},
			goRoad() {
				if (!ship.btnRepeat()) return;
				uni.navigateTo({
					url: '/pages/roadCondition/index/newIndex'
				})
			},
			setClipboardData(value){
				uni.setClipboardData({
					data: value.toString(),//要被复制的内容
					success:()=>{//复制成功的回调函数
					  uni.showToast({//提示
						title:"复制成功"
					  })
					}
				});
			},
			goHZ() {
				uni.navigateTo({
					url:"../mutualAssistance/index"
				})
			},
			login() {
				loginSelf('/pages/my/index/index');
			},
			loginCheck(pathName) {
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return false;
				}
				uni.navigateTo({
					url: pathName
				})
			},
			
			goTransport() {
			      //判断是否有车辆
			      var userInfo = wx.getStorageSync("userInfo");
			      var driverId = JSON.parse(userInfo).attrs.driverId;
			      ship.postRequest("/yh/vehicle/select/list/by/driver", {
			        pageSize: 10,
			        pageNum: 1,
			        driverId: driverId
			      }, 'POST', false, false).then(res => {
			        if (res.retCode == "0000000") {
			          var total = res.rspBody.total;
			          if (total < 1) {
			            uni.showToast({
			              title: '请先进行车辆认证',
			              icon: 'none'
			            })
			            return;
			          }
			          uni.navigateTo({
			            url: '../transportVerify/transportVerify',
			          })
			        } else {
			          uni.showToast({
			            title: res.retDesc,
			            icon: 'none'
			          })
			        }
			      })
			},
			loginCheckIdNo() {
				//进入实名认证页面判断是否有身份证信息
				let that = this;
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					var userCode = that.userInfo.attrs.userCode;
				} else {
					var userCode = that.userInfo.attrs.userCode
				}
				uni.showLoading();
				// console.log('用户详细信息参数', params);
				ship.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
				.then(res=>{
					console.log('用户详细信息', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						if (res.rspBody.idNo) {
							uni.navigateTo({
								url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers?pageFrom=my'
							})
						} else {
							uni.navigateTo({
								url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
							})
						}
					} else {
						uni.navigateTo({
							url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
				})
				
			},
			//跳转服务站列表
			goServiceList() {
				uni.navigateTo({
					url: "/pages/index/srevice/srevice"
				})
			},
			goService() {
				getApp().globalData.serviceSearch.searchCondition = 1; //按地址搜索
				getApp().globalData.serviceSearch.latitude = "";
				getApp().globalData.serviceSearch.longitude = "";
				getApp().globalData.serviceSearch.searchVal = "";
				let query = "?type=" + "service";
				uni.navigateTo({
				  url: "/pages/index/mapView/mapView1" + query,
				});
			},
			goJym(){
				// var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return false;
				}
				userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				let checkInfo = userInfo.attrs;
				if(!checkInfo.identityVerify || !checkInfo.driverVerify || !checkInfo.vehicleVerify){
					uni.showModal({
						title: '温馨提示',
						content: '您必须认证信息后，才能使用优惠加油功能。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (checkInfo.identityVerify !== 1) {
									uni.navigateTo({
										url: '../userVerify/index'
									})
								} else if (checkInfo.driverVerify !== 1) {
									uni.navigateTo({
										url: '../driverVerify/index'
									})
								} else if (checkInfo.vehicleVerify !== 1) {
									uni.navigateTo({
										url: '../carVerify/index'
									})
								}
								
							}
							// that.showModalFlag = true;
						}
					})
					return false;
				}
				console.log(23423423423423)
				postRequest('/yh/user/login2/oilsir')
				.then(res=>{
					console.log(23423423423423)
					console.log(res)
					// var userData = {"attrs":{"remindStatus":0,"isAdmin":0,"isBindWx":0,"driverStatus":1,"idNo":"410822198704132516","randomNum":"112","driverId":538,"registerDT":"2021-04-29","personId":3299,"driverVerify":1,"userCarType":1,"vehicleVerify":1,"hasPayPassword":1,"status":1,"token":"eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSMjS3sDS0NDQwMbJU0lEqLU4t8kxRsjI2tLDUUcrJT8_MC6ksSFWysjAx0FFKrShQsjI0MzI3sDSxNDavBQDJt0OrRAAAAA.PGRARsCmhDo5WjmeNn7QuQ3ruZ3vHjsaduQGMuPfIKk"},"userId":3189,"userType":84,"loginId":"17891910429","mobile":"17891910429","userName":"马小伟","loginType":840,"password":"96e79218965eb72c92a549dd5a330112"}
					
					uni.setStorageSync('driverInfo', res.rspBody);
					// uni.setStorageSync('driverInfo', userData);
					uni.setStorageSync('token', res.rspBody.attrs.token);
					// uni.setStorageSync('token', userData.attrs.token);
					uni.setStorageSync('driverVerify', res.rspBody.attrs.driverVerify);
					// uni.setStorageSync('driverVerify', userData.attrs.driverVerify);
					if(res.retCode == '0000000'){
						uni.setTabBarItem({
							index: 0,
							text: '加油',
							iconPath: 'static/images/jym/icon_oilstation_nomal.png',
							selectedIconPath: 'static/images/jym/icon_oilstation_press.png',
							pagePath: '/pages/jymPages/oilstation/oilstationIndex/oilstationIndex',
							success: res =>{
								uni.switchTab({
									url: '/pages/jymPages/oilstation/oilstationIndex/oilstationIndex'
								})
							}
						})
						uni.setTabBarItem({
							index: 1,
							text: '订单',
							iconPath: 'static/images/jym/icon_order_nomal.png',
							selectedIconPath: 'static/images/jym/icon_order_press.png',
							pagePath: '/pages/jymPages/order/orderIndex/orderIndex'
						})
						uni.setTabBarItem({
							index: 2,
							text: '油卡',
							iconPath: 'static/images/cargo.png',
							selectedIconPath: 'static/images/cargo_solid.png',
							pagePath: '/pages/jymPages/oilcardPage/oilcardPage'
						})
						uni.setTabBarItem({
							index: 3,
							text: '优惠券',
							iconPath: 'static/images/jym/coupons.png',
							selectedIconPath: 'static/images/jym/selectCoupons.png',
							pagePath: '/pages/jymPages/coupon/coupon'
						})
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				// .catch(err=>{
				// 	console.log(err)
				// 	uni.showModal({
				// 		title: '温馨提示',
				// 		content: '货运中国社区只允许真实卡友优惠加油，您必须认证信息后，才能使用优惠功能。',
				// 		showCancel: false,
				// 		confirmText: '我知道了',
				// 		success: function(res) {
				// 			// that.showModalFlag = true;
				// 		}
				// 	})
				// 	return false;
				// })
			},
			goFleetCreate() {
				//创建车队列表
				//判断三证是否认证
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
					uni.showModal({
						title: '请认证驾驶证，行驶证和身份证',
						content: '您必须认证驾驶证，行驶证和身份证后，才能创建车队。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (identityVerify !== 1) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else if (driverVerify !== 1) {
									uni.navigateTo({
										url: '../driverVerify/index'
									})
								} else if (vehicleVerify !== 1) {
									uni.navigateTo({
										url: '../carVerify/index'
									})
								}
								
							}
						}
					})
					return
				}
				uni.setStorageSync("isCreateDot", true);
				uni.navigateTo({
					url: '../fleet/fleetDriverList/fleetDriverList'
				})
			},
			goFleetAdd() {
				//加入车队
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
					uni.showModal({
						title: '请认证驾驶证，行驶证和身份证',
						content: '您必须认证驾驶证，行驶证和身份证后，才能加入车队。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (identityVerify !== 1) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else if (driverVerify !== 1) {
									uni.navigateTo({
										url: '../driverVerify/index'
									})
								} else if (vehicleVerify !== 1) {
									uni.navigateTo({
										url: '../carVerify/index'
									})
								}
								
							}
						}
					})
					return
				}
				uni.setStorageSync("isAddDot", true);
				
				uni.navigateTo({
					url: '../fleet/fleetAddList/fleetAddList'
				})
			},
			loginCheckUser(pathName) {
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return false;
				}
				var isDriveAC = JSON.parse(userInfo).attrs.driverVerify;
				
				var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
				if (!isDriveAC && !vehicleVerify) {
					uni.showModal({
						title: '请认证驾驶证或行驶证',
						content: '货运中国社区只允许真实卡友发布信息，您必须认证驾驶证或行驶证后，才能使用上报功能。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../../my/driverVerify/newDriverVerify'
								})
							}
						}
					})
					return false;
				}
				uni.navigateTo({
					url: pathName
				})
			},
			jumpTocontactUs(pathName) {
				uni.navigateTo({
					url: pathName
				})
			},
			jumpToEditUserInfo() {
				console.log('跳转');
				if(this.isLogin) {
					let userInfo = uni.getStorageSync("userInfo");
					let userData = {
						avatarUrl: JSON.parse(userInfo).attrs.avatar,
						name:  JSON.parse(userInfo).userName,
						gender:  JSON.parse(userInfo).attrs.userGender,
						birthday:  JSON.parse(userInfo).attrs.userBirthday,
						region:  JSON.parse(userInfo).attrs.userDistrict,
						introduce:  JSON.parse(userInfo).attrs.userValidity
					};
					uni.setStorageSync('userData', JSON.stringify(userData));
					uni.navigateTo({
						url: '../settings/userInfo/userInfo',
					})
				}
			},
			goHelpService(){
				uni.navigateTo({
					url: '../helpService/index',
				})
			},
			goInvite(){
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return false;
				}
				//社区
				// uni.navigateTo({
				// 	url: '/pages/my/invite/index'
				// })
				//司机
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/invite/index'
				})
			},
			isDevelopment(flag) {
				let that = this;
				if(!that.showModalFlag) {
					return false;
				}
				that.showModalFlag = false
				uni.showModal({
					title: '温馨提示',
					content: '货源广场找货功能，预计将于9月上线，敬请期待！',
					showCancel: false,
					confirmText: '我知道了',
					success: function(res) {
						that.showModalFlag = true;
					}
				})
			},
			inviteCode(){
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return
				}
				// var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				// var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				// var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				// if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
				// 	uni.showModal({
				// 		title: '请认证驾驶证，行驶证和身份证',
				// 		content: '您必须认证驾驶证，行驶证和身份证后，才能使用邀请码功能。',
				// 		confirmText: '去认证',
				// 		cancelText: '再看看',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				if (identityVerify !== 1) {
				// 					uni.navigateTo({
				// 						url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
				// 					})
				// 				} else if (driverVerify !== 1) {
				// 					uni.navigateTo({
				// 						url: '../driverVerify/index'
				// 					})
				// 				} else if (vehicleVerify !== 1) {
				// 					uni.navigateTo({
				// 						url: '../carVerify/index'
				// 					})
				// 				}
								
				// 			}
				// 		}
				// 	})
				// 	return
				// }
				//司机
				uni.navigateTo({
					url: '/pages/my/invite/inviteCode?type=1'
				})
			},
			jumpToMyrelease() {
				uni.navigateTo({
					url: '/pages/my/myRelease/myRelease'
				})
			},
			jumpToIntegralDetails() {
				uni.navigateTo({
					url: '/pages/my/integralDetails/integralDetails'
				})
			},
			async previewImage(flag){
				let that = this;
				console.log(flag,'flagflag')
				// var images = [];
				// var advertisingBanner = this.advertisingBanner;
				// var img = advertisingBanner[flag].bigAdvUrl;
				// images.push(img);
				// uni.previewImage({
				// 	urls: images,
				// 	indicator: 'none',
				// 	longPressActions: {
				// 		itemList: ['发送给朋友', '保存图片', '收藏'],
				// 		success: function(data) {
				// 			console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				// 		},
				// 		fail: function(err) {
				// 			console.log(err.errMsg);
				// 		}
				// 	}
				// });
				var advertisingBanner = this.advertisingBanner;
				var item = advertisingBanner[flag];
				console.log(item);
				if(item.bigLinkUrl) {
					if(item.bigLinkType == 'route') {
						uni.navigateTo({
							url: item.bigLinkUrl
						})
					}
					if(item.bigLinkType == 'web') {
						getApp().globalData.promoteLinkUrl = item.bigLinkUrl;
						uni.navigateTo({
							url: '../../advertisingH5/advertisingH5'
						})
					}
				}else {
				    if(flag == 1) {						
						uni.navigateTo({
							url: './game'
						})
					}else{
						uni.previewImage({
							urls: [item.bigAdvUrl],
							longPressActions: {
								itemList: ['保存图片'],
								success: function(data) {
									uni.showModal({
										title: '提示',
										content: '将获取您的存储权限以保存图片',
										success: function(res) {
											if (res.confirm) {
												that.downFile(item.bigAdvUrl);
											}
										}
									})
								},
								fail: function(err) {
									console.log(err.errMsg);
								}
							},
							success: function(data) {
								console.log(data);
							},
							fail: function(err) {
								console.log(err);
							}
						});
					}
					
					
				}
			},
			downFile(imageUrl) {
				// 首先下载图片
				uni.downloadFile({
				  url: imageUrl,
				  success: downloadResult => {
				    if (downloadResult.statusCode === 200) {
				      // 下载成功，保存图片到系统相册
				      uni.saveImageToPhotosAlbum({
				        filePath: downloadResult.tempFilePath,
				        success: () => {
				          uni.showToast({
				            title: '图片保存成功'
				          });
				        },
				        fail: () => {
				          uni.showToast({
				            title: '图片保存失败',
				            icon: 'none'
				          });
				        }
				      });
				    }
				  },
				  fail: () => {
				    uni.showToast({
				      title: '图片下载失败',
				      icon: 'none'
				    });
				  }
				});
			},
			goMineBand() {
				//我的银行卡
				uni.navigateTo({
					url: '/pages/my/myBank/myBankList'
				})
			},
			goMineLike() {
				//进入我的喜好
				if (isClicking) {
					return;
				}
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return;
				}
				isClicking = true;
				uni.setStorageSync("isMineLikeDot", true);
				
				uni.navigateTo({
					url: '/pages/my/myHobby/myHoby_driver?routerString=userCenter'
				})
				setTimeout(() => {
					isClicking = false;
				}, 1000)
			},
			goPurchase() {
				//进入钱包
				if(!publicData.getUserPermissions(1)) {
					uni.showToast({
						title: '请实名认证后再进行操作',
						icon: 'none',
						duration: 2000,
					})
					return false;
				}
				uni.navigateTo({
					url: '../../goodsDelivery/userCenter/userWallet/userWallet'
				})
			},
			swiperChange(e) {
				console.log(e)
				this.currentIndex = e.detail.current
			},
		}
	}
</script>

<style lang="scss">
.mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
    width: 100vw;
    height: 100vh;
    background: rgba(84, 84, 84, 0.58);
    opacity: 0;
    transition: opacity 0.2s;
    .dialog {
      position: absolute;
      width: 100vw;
			bottom: -100vh;
      left: 0;
      transition: bottom 0.2s;
      border-top-left-radius: 30rpx;
      border-top-right-radius: 30rpx;
      background: #ffffff;
      box-shadow: 0px 0px 16rpx 2rpx rgba(172, 203, 255, 0.19);
      text-align: center;
      .close_btn {
        position: absolute;
        width: 48rpx;
        height: 48rpx;
        top: 28rpx;
        right: 34rpx;
      }
      .head_img {
        margin-top: 50rpx;
        width: 136rpx;
        height: 136rpx;
        box-shadow: 0px 0px 12rpx 2rpx rgba(0, 0, 0, 0.14);
        border-radius: 50%;
        border: 6rpx solid #ffffff;
      }
      .dialog_nickname {
        margin-top: 20rpx;
        font-size: 40rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
      }
      .dialog_text {
        margin-top: 60rpx;
        font-size: 36rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .qr_code {
        margin-top: 66rpx;
        width: 240rpx;
        height: 240rpx;
      }
      .dialog_save_btn {
        margin: 66rpx auto 0 auto;
        width: 528rpx;
        height: 80rpx;
        background: #F75347;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        display: flex;
        justify-content: center;
        align-items: center;
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
      }
    }
  }
	page {
		background-color: #F2F2F2;
	}
	.go_China_travel{
		position: fixed;
		top: 300rpx;
		right: 20rpx;
		z-index: 9999;
		font-size: 26rpx;
	}
	.img {
		width: 60px;
		height: 60px;
		border-radius: 100%;
		margin-top: 10px;
	}
	image {
		max-width: 100%;
		max-height: 100%;
	}
	.header {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 99;
		background-color: #FFF;
		// display: flex;
		// flex-direction: row;
		// justify-content: space-between;
		// align-items: center;
		// height: 350rpx;
		padding: 120rpx 40rpx 30rpx 40rpx;
		background: linear-gradient(#FFFFFF 70%, #F2F2F2);
		.headerImg {
			display: flex;
			justify-content: flex-end;
			.imgBox {
				width:40rpx;
				height:40rpx;
			}
		}
		.qrCode {
			width: 56rpx;
			height: 56rpx;
			
		}
		.certificationBox {
			font-size: 32rpx;
			color: #FF8D02;
			font-weight:bold;
			line-height: 44rpx;
			padding-top: 30rpx;
		}
		.private-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top: 40rpx;
			.private-child{
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.private-num{
					font-size: 32rpx;				
					color: #333;
					padding-bottom: 10rpx;
				}
				.private-text{
					font-size: 26rpx;
					color: #777;
					&.bold {
						color: #0171F9;
					}
				}
			}
		}
		.header-content {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			padding-top: 34rpx;
			.avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 100%;
				margin-right: 24rpx;
				overflow: hidden;
			}
			.header-title {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				.mobileBox {
					margin-top: 10rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.onLine {
						width: 130rpx;
						height: 40rpx;
						border-radius: 8rpx;
						border: 2rpx solid rgba(55, 202, 124, 1);
						margin-right: 10rpx;
						.onLine-text {
							width: 88rpx;
							background-color: rgba(55, 202, 124, 1);
							color: #FFFFFF;
							font-size: 24rpx;
							height: 40rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							transition: all .2s ease;
							&.active {
								background-color: rgba(252, 45, 45, 1);
								transform: translateX(42rpx);
							}
						}
						&.active {
							border-color: rgba(252, 45, 45, 1);
						}
					}
					.mobile + .mobile {
						margin-left:40rpx;
					}
					.mobile {
						font-size: 24rpx;
						color: #777;
					}
				}
				.sub-title {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					.userName {
						font-size:36rpx;
						margin-right:20rpx;
						height: 50rpx;
						line-height: 50rpx;
						max-width: 200rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.userLevel {
						font-size: 22rpx;
						margin-left:20rpx;
					}
					.rz {
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						.no-text {
							font-size: 22rpx;
						}
						.rz-icon {
							width: 34rpx;
							height: 30rpx;
							margin: 0 8rpx;
						}
					}
				}
			}
			.subText {
				padding-top: 14rpx;
			}
		}
	}
	.tabs {
		background-color: #fff;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding-left: 40rpx;
		align-items: center;
		height: 164rpx;
		.tab-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-right: 40rpx;
		}
		.tab-avatar {
			width: 70rpx;
			height: 70rpx;
		}
	}
	.list-whole {
		margin-top: 16rpx;
	}
	.list-header {
		justify-content: center;
		align-items: center;
		display: flex;
		margin-right: 20rpx;
	}
	.icon_toll {
		width: 40rpx;
		height: 32rpx;
	}
	.uni-list--border:after {
		background-color: #eee;
	}
	.uni-list--border-bottom {
		background-color: #eee;
	}
	.uni-list--border-top {
		background-color: #EEEEEE;
	}
	.uni-list-item__container {
		padding: 32rpx 40rpx;
		height: 88rpx;
	}
	.rz-center {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 98rpx;
		margin: 0 30rpx;
		background-color: #4F5779;
		background-image: linear-gradient(to bottom, #4F5779, #272C44);
		border-radius: 10rpx;
		margin-bottom: 10rpx;
		.rz-img {
			width: 48rpx;
			height: 42rpx;
			margin-left: 30rpx;
			margin-right: 12rpx;
		}
		.rz-item {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			.text-pm {
				font-family: PangMenZhengDaoBiaoTiTi;
				color: #E7C085;
				font-size: 32rpx;
			}
			.rz-info {
				font-size: 24rpx;
				color: #E7C085;
			}
			.btn-rz {
				width: 104rpx;
				height: 46rpx;
				justify-content: center;
				align-items: center;
				display: flex;
				color: #6A4A31;
				background-color: #E7C085;
				border-radius: 23rpx;
				margin-right: 20rpx;
				margin-left: 14rpx;
				font-size: 24rpx;
			}
		}
		
	}
	.modelList {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:14rpx 0 14rpx 22rpx;
		background-color: #FFF;
		.listIcon {
			width:80rpx;
			height:80rpx;
			margin-right:22rpx;
		}
		.modelListTitle {
			flex: 1;
			padding: 32rpx 40rpx 32rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.msg {
				font-size:32rpx;
				color:#333;
			}
			.rightIcon {
				width:17rpx;
				height: 32rpx;
			}
		}
		.line-box{
			border-bottom: 2rpx solid #F2F2F2;
		}
	}
	.swiperWhole {
		background-color: #FFFFFF;
		margin: 0 20rpx;
		border-radius: 10rpx;
		height: 186rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.dots {
		height: 50rpx;
		width: calc(100vw - 40rpx);
		display: flex;
		justify-content: center;
		align-items: center;
		.dotsImg {
			width: 100rpx;
			height: 10rpx;
		}
		
	}
	.swiper {
		height: 136rpx;
		width: calc(100vw - 40rpx);
		
	}
	.info-box{
		height: 136rpx;
		display: flex;
		justify-content: center;
		&.last {
			justify-content: flex-start;
		}
		.info-child{
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			.info-img{
				width: 58rpx;
				height: 44rpx;
			}
			.info-img2 {
				width: 58rpx;
				height: 58rpx;
				margin-top: -6rpx;
			}
			.info-text{
				margin-top: 20rpx;
				font-size: 26rpx;
				color: #333;
			}
			.info-text2 {
				margin-top: 12rpx;
				font-size: 26rpx;
				color: #333;
			}
		}
	}
	.activity-box{
		margin: 0 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		.seperateLine {
			height: 20rpx;
		}
		.activity-box-sub {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			width: 100%;
		}
		.activity-child{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 12rpx;
			overflow: hidden;
			.activity-img{
				width: 100%;
				
			}
			&:first-child {
				margin-right: 20rpx;
			}
		}
		.activity-child-whole {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 12rpx;
			overflow: hidden;
			.activity-img{
				width: 100%;
			}
		}
	}
	.common-box{
		// height: 580rpx;
		background: #FFF;
		border-radius: 10rpx;
		margin: 20rpx 20rpx 0 20rpx;
		.common-title{
			padding: 40rpx 30rpx;
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
		}
		.common-content{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.common-child{
				flex: 0 0 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-bottom:40rpx;
				height: 100rpx;
				.imgTotal {
					flex: 1;
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					.dotted {
						position: absolute;
						width: 20rpx;
						height: 20rpx;
						background-color: red;
						border-radius: 20rpx;
						right: 0;
						top: -10rpx;
						
					}
				}
				.common-img5 {
					width: 36rpx;
					
	
				}
				.common-img6 {
					width: 50rpx;
					
				}
				.common-img{
					width: 50rpx;
					height: 50rpx;
				}
				.common-img1{
					width: 50rpx;
				}
				.common-img2{
					width: 38rpx;
					height: 50rpx;
				}
				.common-text{
					font-size: 26rpx;
					margin-top: 20rpx;
					color: #333;
				}
				.common-img3 {
					width: 50rpx;
					
				}
				.common-img4 {
					width: 50rpx;
				}
				.common-my-order {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}
	.priceWhole {
		display: flex;
		flex-direction: column;
		width: calc(100vw - 32rpx);
		background-color: #FFFFFF;
		margin-left: 16rpx;
		margin-bottom: 20rpx;
		padding: 0 28rpx;
		box-sizing: border-box;
		height: 234rpx;
		border-radius: 12rpx;
		.title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding-top: 28rpx;
			.text {
				font-size: 30rpx;
				color: #333333;
				font-weight: 500;
			}
			.subText {
				font-size: 26rpx;
				color: #AAAAAA;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.arraw_right {
				width: 25rpx;
				height: 25rpx;
			}
		}
		.subContent {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			.contentItem {
				height: 82rpx;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				&.left {
					border-right: 1px solid #CAD4DA;
				}
				.price {
					font-size: 52rpx;
					color: #333333;
					line-height: 60rpx;
					font-weight: bold;
				}
				.label {
					font-size: 26rpx;
					color: #AAAAAA;
					line-height: 36rpx;
				}
			}
		}
	}
			.serviceMobile {
				padding: 20rpx 20rpx 6rpx 20rpx;
				height: 50rpx;
				text-align: center;
				color:#777;
				font-size: 32rpx;
			}
</style>
