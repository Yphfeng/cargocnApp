<template>
	<view class="alert-content">
		<view class="alert">
			<view class="alertContent" v-if="type == 1">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/notice_close_icon.png" class="notice_close_icon" @click="hidePop"></image>
				<view class="title">提示</view>
				<view class="content">{{content}}</view>
				<view class="btn" @click="opt()">去详情</view>
			</view>
			<view class="alertContent" v-if="type == 2">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/notice_close_icon.png" class="notice_close_icon" @click="hidePop"></image>
				<view class="title">提示</view>
				<view class="content">{{content}}</view>
				<view class="btn" @click="opt()">点击查看</view>
			</view>
			<view class="alertContent" v-if="type == 3">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/notice_close_icon.png" class="notice_close_icon" @click="hidePop"></image>
				<view class="title">提示</view>
				<view class="content">{{content}}</view>
				<view class="btn" @click="opt()">点击查看</view>
			</view>
			<view class="alertContent" v-if="type == 4">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/notice_close_icon.png" class="notice_close_icon" @click="hidePop"></image>
				<view class="title">提示</view>
				<view class="content">{{content}}</view>
				<view class="btn" @click="opt()">点击查看</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	import * as publicData from "@/utils/publicData";
	export default {
		data() {
			return {
				
			}
		},
		onLoad(options) {
			this.type = options.type;
			var details = options.details;
			if (details) {
				this.details = JSON.parse(details)
			}
			
		},
		onBackPress() {
			
		},
		computed: {
			content() {
				if (this.details && this.details.content) {
					return this.details.content
				} else {
					return ''
				}
			}
		},
		methods: {
			hidePop() {
				uni.navigateBack()
			},
			async opt() {
				uni.navigateBack()
				var details = this.details;
				var newsAlertType = this.type;
				try{
					if (newsAlertType == 1) {
						//货源推送消息
						uni.showLoading();
						var rsp = await publicData.getDriverOrder(details.note);
						console.log("弹框消息112112",rsp, details);
						uni.hideLoading();
						if (!rsp) return;
							var supply = rsp.supply;
							var unbrokenFlag = rsp.unbrokenFlag;
							var cargoSource = rsp.cargoSource;
							if (cargoSource == "WX_ZKC" || unbrokenFlag == 1) {
								uni.switchTab({
									url: '/pages/ship/index/index1'
								})
								console.log("supply", supply)
								setTimeout(() => {
									uni.$emit("switchIndex1", supply == 2 ? 1 : 0);
								}, 1000);
								return;
							} 
							uni.switchTab({
								url: '/pages/ship/index/index'
							})
							this.goDetail(rsp);
						
					} else if (newsAlertType == 2) {
						//新车源消息，跳转平台货源列表
						uni.switchTab({
							url: '/pages/ship/index/index1'
						})
						setTimeout(() => {
							uni.$emit("switchIndex1");
						}, 1000);
					} else if (newsAlertType == 3) {
						//跳转车队详情
						var obj = {
							id: details.note
						}
						console.log(obj, '车队邀请的参数')
						uni.navigateTo({
							url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(obj)
						})
						// uni.navigateTo({
						// 	url: '/pages/goodsDelivery/fleetIndex/fleetDetails?info=' + JSON.stringify(obj)
						// })
						
					} else if (newsAlertType == 4) {
						var id = details.note;
						console.log(obj, '撩一撩参数')
						uni.navigateTo({
							url: '/pages/ship/carSource/sourceDetail?carSourceNewsSid=' + id
						})
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
				
			},
			goDetail(item) {
				if (!ship.btnRepeat()) return;
				//判断是否三证认证
				//去认证
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								ship.loginSelf(1);
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 || faceVerify != 1 ) {
					
					uni.showModal({
						title: '请认证驾驶证，行驶证和身份证',
						content: '未完成认证，请认证后操作。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (identityVerify !== 1 || faceVerify != 1) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else if (driverVerify !== 1) {
									uni.navigateTo({
										url: '/pages/my/driverVerify/newDriverVerify'
									})
								} else if (vehicleVerify !== 1) {
									uni.navigateTo({
										url: '/pages/my/carVerify/newCarVerify'
									})
								}
								
							}
						}
					})
					return
				}
				console.log(item, "阿萨达撒上打双打")
				var orderQuotationStatus = item.orderQuotationStatus;
				var supply = item.supply;
				if (item.cargoSource == "WX_ZKC") {
					uni.switchTab({
						url: '/pages/ship/index/index'
					})
					setTimeout(() => {
						uni.$emit("switchIndex1", supply == 2 ? 1 : 0);
					}, 1000)
					return;
				}
				
				if (item.orderSecondState == 15) {
					uni.showToast({
						title: '货源已下架，请查看其它货源吧~',
						icon: 'none'
					})
					return;
				}
				if (item.orderSecondState == 18) {
					uni.showToast({
						title: '货源已关闭，请查看其它货源吧~',
						icon: 'none'
					})
					return;
				}
				if (item.orderSecondState != 11 && item.orderSecondState != 13 && item.orderSecondState != 14 && item.orderQuotationStatus == undefined && item.multiTruck < 2) {
					uni.showToast({
						title: '货源已关闭，请查看其它货源吧~',
						icon: 'none'
					})
					return;
				}
				
				//判断是否已报价或已成交
				var multiTruck = item.multiTruck;
				var orderQuoation = item.orderQuotationStatus;
				if (multiTruck > 1) {
					if ((orderQuoation !== undefined && orderQuoation <= 2)) {
						uni.navigateTo({
							url: '/pages/ship/supplyDetails/supplyGoods?sid=' + item.sid + '&distance=' + item.distance
						})
					} else {
						uni.navigateTo({
							url: '/pages/ship/supplyDetails/supplyDetails?sid=' + item.sid + '&status=3' + '&distance=' + item.distance
						})
					}
				} else {
					if ((orderQuoation !== undefined && orderQuoation <= 2) || orderQuoation > 4) {
						uni.navigateTo({
							url: '/pages/ship/supplyDetails/supplyGoods?sid=' + item.sid + '&distance=' + item.distance
						})
					} else {
						uni.navigateTo({
							url: '/pages/ship/supplyDetails/supplyDetails?sid=' + item.sid + '&status=3' + '&distance=' + item.distance
						})
					}
				}
				
			}
		}
	}
</script>

<style>
	page {
		background: transparent;
	}
	.alert-content {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(84, 84, 84, 0.71);
	}
	.alert {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.alertContent {
		width: 480rpx;
		height: 290rpx;
		background-color: #FFFFFF;
		border-radius: 24rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 34rpx;
		box-sizing: border-box;
	}
		.notice_close_icon {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			top: 10rpx;
			right: 18rpx;
		}
		.title {
			font-size: 36rpx;
			color: rgba(51, 51, 51, 1);
			padding: 28rpx 0 6rpx;
			line-height: 42rpx;
			font-weight: 500;
		}
		.content {
			flex: 1;
			width: 330rpx;
			text-align: center;
			font-size: 28rpx;
			line-height: 33rpx;
			
		}
		.btn {
			width: 312rpx;
			height: 62rpx;
			background-color: rgba(43, 114, 240, 1);
			border-radius: 16rpx;
			color: #FFFFFF;
			font-weight: 500;
			display: flex;
			justify-content: center;
			align-items: center;
		}

	
</style>
