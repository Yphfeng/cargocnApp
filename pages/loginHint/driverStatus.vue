<template>
	<view class="driverStatusPage">
		<view class="pageHead" @click="jumpToSendSource">
			<image class="backIcon" src="/static/images/loginHint/newBack.png"></image>
		</view>
		<view class="largeTitle" v-if="greeting">{{greeting}}</view>
		<view class="mainContent" v-if="description">{{description}}</view>
		<view class="mainContent" style="margin-top:78rpx;">请问今天接单吗？</view>
		<view class="btnGroup">
			<view class="btn" style="background-color: #FFB661;" @click.stop="switchOnLine(2)">忙碌</view>
			<view class="btn" style="background-color: #64BD70;" @click.stop="switchOnLine(1)">可接单</view>
		</view>
		
		<uni-popup ref="locationPermissionsPopup" type="center">
			<view class="sweetHintBox">
				<image class="sweetHintIcon" src="/static/images/newIndex/sweetHint.png"></image>
				<view class="sweetHintContent">
					<view class="title">温馨提示</view>
					<view class="msg">为了更好向您基于地理位置的服务，请您开启定位权限，相关服务包括：推荐附近的服务、包括适合的线路、货源等。</view>
					<view class="btn" @click="getLocationMsg">我知道了</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "../../utils/ship";
	import * as publicData from "@/utils/publicData.js";
	export default {
		data() {
			return {
				userInfo: {},
				greeting: '',
				description: '',
				carParams: [],
				carLenParams: [],
				locationFlag: '',
				carSourceFlag: 1, // 1是有车源 0是没有车源
				hasLocationPermissionsShow: '',
				hasLocationPermissionsChecked: ''
			};
		},
		onLoad() {
			let userData = uni.getStorageSync("userInfo");
			console.log('用户信息', JSON.parse(userData));
			this.userInfo = userData ? JSON.parse(userData) : {};
			this.greetingConfig();
			this.changeLogAdd();
		},
		onBackPress(event){
			return true; //阻止默认返回行为
		},
		onReady() {
			// 以下为获取弹窗
			this.hasLocationPermissionsShow = uni.getStorageSync('hasLocationPermissionsShow');
			this.hasLocationPermissionsChecked = uni.getStorageSync('hasLocationPermissionsChecked');
			if(this.hasLocationPermissionsShow || this.hasLocationPermissionsChecked) {
				this.getLocationMsg();
			}else {
				uni.setStorageSync('hasLocationPermissionsShow', true);
				this.$refs.locationPermissionsPopup.open();
			}
		},
		methods: {
			changeLogAdd() { // 调用此接口表示今日已弹出过此页面
				let that = this;
				let params = {
					userId: this.userInfo.userId,
					userCode: this.userInfo.attrs.userCode,
					taskStatus: this.userInfo.attrs.taskStatus,
				}
				ship.postRequest('/yh/user/task/status/change/log/add', params)
				.then(res => {
					console.log('请求结果', res);
					if(res.retCode == '0000000') {
						
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err => {
					console.log(err);
				})
			},
			greetingConfig() { // 问候语
				let that = this;
				uni.showLoading();
				ship.postRequest('/yh/daily/greeting/config/get', {})
				.then(res => {
					console.log('问候语', res);
					uni.hideLoading();
					if (res.retCode == '0000000') {
						that.greeting = res.rspBody.greeting ? res.rspBody.greeting : '';
						that.description = res.rspBody.description ? res.rspBody.description : '';
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err => {
					console.log(err);
					uni.hideLoading();
				})
			},
			async switchOnLine(status) {
				var that = this;
				uni.showLoading();
				try{
					var res = await ship.postRequest("/yh/user/verify/change/user/task/status", {
						taskStatus: status
					})
					uni.hideLoading();
					console.log('修改接单参数', status);
					if (res.retCode == "0000000") {
						var userInfo = uni.getStorageSync("userInfo");
						if (userInfo) {
							var user = JSON.parse(userInfo);
							user.attrs.taskStatus = status;
							uni.setStorageSync("userInfo",JSON.stringify(user));
							that.jumpToSendSource();
						}
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
			personasGetCheck() {
				let that = this;
				ship.postRequest("/yh/personas/getCheck", {
					userCode: userCode
				}).then(res => {
					uni.hideLoading();
					var carParams = [], carLenParams = [];
					if (res.retCode == "0000000") {
						var data = res.rspBody;
						console.log('喜好是否已配置', data);
						that.carParams = data.carModelList;
						that.carLenParams = data.carLengthList;
					}
				})
			},
			jumpToSendSource() { // 跳转规则，1.是否未设置车型车长，2.是否定位成功 && 没有发布包含当前市的车源
				// if (this.userInfo.attrs.vehicleVerify != 1 && (this.carParams.length < 1 || this.carLenParams.length < 1)) {
				// 	console.log('跳转阿飒飒飒飒')
				// 	setTimeout(() => {
				// 		uni.reLaunch({
				// 			url: '/pages/my/myHobby/myHoby_driver'
				// 		})
				// 	}, 1000)
				// }else {
				// 	if(!this.carSourceFlag) {
				// 		uni.navigateTo({
				// 			url: './sendSource'
				// 		})
				// 	}else {
				// 		publicData.setTabbarItem(1);
				// 	}
				// }
				
				// uni.navigateTo({
				// 	url: './sendSource'
				// })
				let that = this;
				let cParams = {
					"userId": that.userInfo.userId,
					"typeCodeList": ['MY_VEHICLE', 'OFTEN_AREA', 'ROAD_TYPE', 'FAVORITE_CARGO']
				};
				ship.postRequest("/yh/upd/tags/tag/check/by/type", cParams)
				.then(res => {
					console.log('请求结果', res);
					if(res.retCode == '0000000') {
						let typeLengthAreacheckFlag = res.rspBody.allTypeCountFlag;
						if(typeLengthAreacheckFlag == 1) {
							if(that.carSourceFlag == 1) {
								publicData.setTabbarItem(1);
							}else {
								uni.navigateTo({
									url: './sendSource'
								})
							}
						}else {
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/my/myHobby/myHoby_driver'
								})
							}, 1000)
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err => {
					publicData.setTabbarItem(1);
					console.log(err);
				})
			},
			getLocationMsg() { //获取定位
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						console.log('定位信息', res);
						that.locationFlag = res.address.city;
						that.getPopUpWindowsCarSource();
					},
					fail: function(err) {
						console.log('定位失败', err)
					},
					complete: function(com) {
						uni.setStorageSync('hasLocationPermissionsChecked', true);
						that.$refs.locationPermissionsPopup.close();
						// setTimeout(() => {
						// 	that.isLocationFlag = false;
						// }, 10000)
					},
				})
			},
			getPopUpWindowsCarSource() { // 已发布车源是否包含当前市
				let params = {
					"userCode": this.userInfo.attrs.userCode,
					"sender": this.locationFlag
				}
				let that = this;
				ship.postRequest('/olnanas/recommend/popUpWindowsCarSource', params)
				.then(function (res) {
					console.log('已发布车源是否包含', res);
					if(res.retCode == '0000000'){
						that.carSourceFlag = res.rspBody;
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err, '报错')
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.driverStatusPage {
		height: 100vh;
		background-image: url('/static/images/loginHint/driverStatusBc.png');
		background-repeat: no-repeat;
		background-size: 100%;
		.pageHead {
			padding: 120rpx 0 0 38rpx;
			.backIcon {
				width: 16rpx;
				height: 30rpx;
			}
		}
		.largeTitle {
			font-size: 100rpx;
			font-weight: 500;
			color: #FFFFFF;
			letter-spacing: 2rpx;
			text-shadow: 0px 4rpx 14rpx rgba(10, 100, 205, 0.54);
			padding: 0 28rpx;
			margin: 70rpx 0 20rpx 0;
			
		}
		.mainContent {
			font-size: 40rpx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 63rpx;
			letter-spacing: 2rpx;
			text-shadow: 0px 4rpx 6rpx rgba(10, 100, 205, 0.54);
			padding: 0 12rpx 0 26rpx;
		}
		.btnGroup {
			margin: 40rpx 0 0 0;
			padding: 0 26rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.btn {
				width: 300rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 16rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
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
	}
</style>
