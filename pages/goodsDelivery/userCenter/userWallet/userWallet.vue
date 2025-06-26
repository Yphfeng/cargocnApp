<template>
	<view class="userWallet">
		<view class="walletHead">
			<view class="headBox">
				<image @tap="toBack" class="backIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/white_left_icon.png"></image>
				我的钱包
			</view>
			<view class="walletDetails driver">
				<view class="detailsBox">
					<image class="balanceIconBox" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/wellet.png"></image>
					<view class="hintBox">余额（元）</view>
				</view>
				<view class="price">¥{{walletAmount}}</view>
			</view>
		</view>
		<view class="btnList">
			<view class="btnGroup" @click="toTopUp()">
				<view class="btnTitle">
					<image class="btnIcon1" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/walletIcon1.png"></image>
					<view class="btnMsg">充值</view>
				</view>
				<image class="rightIcon" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
			<view class="btnGroup" @click="toSithdrawal()">
				<view class="btnTitle">
					<image class="btnIcon2" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/walletIcon2.png"></image>
					<view class="btnMsg">提现</view>
				</view>
				<image class="rightIcon" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
			<view class="btnGroup" @click="priceSerial()">
				<view class="btnTitle">
					<image class="btnIcon3" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/walletIcon3.png"></image>
					<view class="btnMsg">资金流水</view>
				</view>
				<image class="rightIcon" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	import * as md5 from "@/utils/md5.js";
	export default {
		data() {
			return {
				walletAmount: 0,
				frozenAmount: 0,
				userRole: 0,
				
			};
		},
		onLoad(options) {
			this.userRole = uni.getStorageSync("userRole");
			
		},
		onShow() {
			this.getAmountInfo();
		},
		methods: {
			async getAmountInfo() { // 余额列表
				let that = this;
				var res = await utils.postRequest('/dw/wallet/getAmount')
				console.log('钱包', res);
				if(res.retCode == '0000000') {
					that.walletAmount = publicData.showPrice(res.rspBody.amount, 1000);
				}else {
					uni.showToast({
						title: res.retDesc,
						icon: 'none',
						duration: 3000
					})
				}
				var userRole = uni.getStorageSync('userRole');
				var url = userRole == 1 ? '/td/driver/home/getMarginVODriver' : '/td/driver/home/getMarginVOShipper';
				var response = await utils.postRequest(url);
				if (response.retCode == "0000000") {
					var marginVal = response.rspBody.margin;
					if (parseFloat(res.rspBody.amount) > parseFloat(marginVal*1000)) {
						this.frozenAmount = marginVal.toFixed(2);
					} else {
						this.frozenAmount = publicData.showPrice(res.rspBody.amount, 1000);
					}
					
				}
				
			},
			showPrice(price) { // 金额展示
				return publicData.showPrice(price, 1000);
			},
			toTopUp() {
				var userRole = uni.getStorageSync('userRole');
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								utils.loginSelf(userRole);
							}
						}
					})
					return
				}
				if (userRole == 1) {
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
				} else {
					if (JSON.parse(userInfo).attrs.faceVerify != 1 || JSON.parse(userInfo).attrs.identityVerify != 1) {
						uni.showModal({
							title: '请实名认证',
							content: '未完成认证，请认证后操作。',
							confirmText: '去认证',
							cancelText: '再看看',
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								}
							}
						})
						
						return
					}
				}
				
				uni.navigateTo({
					url: './topUp'
				})
			},
			toSithdrawal() {
				uni.navigateTo({
					url: './withdrawal'
				})
			},
			priceSerial() {
				uni.navigateTo({
					url: './priceSerial'
				})
			},
			toBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.userWallet {
		min-height: 100vh;
		background-color: #FFF;
		.walletHead {
			height: 406rpx;
			background: #4AA2F3;
			display: flex;
			flex-direction: column;
			.headBox {
				padding: 106rpx 40rpx 0 30rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 50rpx;
				text-align: center;
				.backIcon {
					width: 22rpx;
					height: 40rpx;
					position: absolute;
					left: 30rpx;
				}
			}
			.walletDetails {
				padding-top:60rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				align-items: center;
				&.driver {
					flex: 1;
					align-items: flex-end;
					color: #FFFFFF;
					.detailsBox {
						display: flex;
						flex-direction: row;
						align-items: center;
						height: 150rpx;
						.balanceIconBox {
							width: 56rpx;
							height: 50rpx;
						}
						.hintBox {
							padding-left: 26rpx;
							font-size: 28rpx;
							color: #C8E5FF;
						}
					}
					.price {
						height: 150rpx;
						line-height: 150rpx;
						font-size: 60rpx;
						font-weight: bolder;
					}
				}
				.detailsBox {
					.balanceIcon {
						width: 44rpx;
						height: 46rpx;
						margin:0 auto 16rpx auto;
						display: block;
					}
					.lockedBalanceIcon {
						width: 36rpx;
						height: 44rpx;
						margin:0 auto 18rpx auto;
						display: block;
					}
					.price {
						font-size: 40rpx;
						font-weight: 600;
						color: #FFFFFF;
						line-height: 56rpx;
						text-align: center;
					}
					.hint {
						font-size: 26rpx;
						color: #C8E5FF;
						line-height: 36rpx;
						text-align: center;
					}
				}
			}
		}
		.btnList {
			padding: 0 36rpx;
			.btnGroup {
				height: 112rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #EAEBEE;
				.btnTitle {
					display: flex;
					align-items: center;
					.btnMsg {
						font-size: 28rpx;
						color: #333333;
						line-height: 40rpx;
					}
					.btnIcon1 {
						width: 32rpx;
						height: 32rpx;
						margin-right:32rpx;
					}
					.btnIcon2 {
						width: 34rpx;
						height: 34rpx;
						margin-right:30rpx;
					}
					.btnIcon3 {
						width: 34rpx;
						height: 32rpx;
						margin-right:30rpx;
					}
				}
				.rightIcon {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
	}
</style>
