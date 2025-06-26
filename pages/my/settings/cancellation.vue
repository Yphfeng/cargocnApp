<template>
	<view class="cancellation">
		<view class="mainTitle">尊敬的用户：</view>
		<view class="mainMsg">一旦注销货运中国账号，您将无法通过货运中国APP查看及找回账户等级、积分、优惠券等数据。注销后，如涉及金融账号相关问题，请通过致电查询及处理。</view>
		<view class="tipsBox">
			<view class="confirmAgreement">
				<view v-show="!agreementFlag" class="btn" @tap="agreementFlag = !agreementFlag"></view>
				<image v-show="agreementFlag" class="confirmAgreementIcon" src="../../../static/images/goodsDelivery/payCheckedIcon.png" @tap="agreementFlag = !agreementFlag"></image>
				<view class="agreementHint" @tap="agreementFlag = !agreementFlag">我已阅读并同意</view>
				<view class="agreementDetails" @tap="jumpTocancellationA">《注销协议》</view>
			</view>
			<view class="confirmBtn" @tap="showHintBox()">注销账号</view>
		</view>
		
		<uni-popup ref="confirmPopup" type="center">
			<view class="hintBox">
				<view class="title">是否注销？</view>
				<view class="msg">注销后清空账号的所有会员信息，注销后将无法恢复，请您审慎做出决定，您是否确认注销账号并同意放弃与会员账号绑定的相关资产？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="toCancellationUser()">注销</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @tap="closeConfirmPopup()">取消</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as service from "@/utils/service.js";
	import * as publicData from "@/utils/publicData.js";
	import * as longLink from "@/longLink/consignorlongLink";
	export default {
		data() {
			return {
				agreementFlag: false,
				userInfo: {},
				userRole: ''
			};
		},
		onLoad() {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = JSON.parse(userInfo);
			this.userRole = uni.getStorageSync('userRole'); // 1为司机 2为货主
			console.log(this.userInfo, '用户信息11');
		},
		methods: {
			jumpTocancellationA() {
				uni.navigateTo({
					url: '../../allAgreement/cancellationA'
				})
			},
			toCancellationUser() {
				if(!utils.btnRepeat()) return false; // 防抖
				let that = this;
				if(that.userRole == 1) {
					let url = '/yh/user/logout';
					let params = {
						userCode: that.userInfo.attrs.userCode
					};
					console.log('司机注销参数', params);
					utils.postRequest(url, params)
					.then(res=>{
						if(res.retCode == "0000000") {
							console.log('司机注销成功', res);
							// that.toSaveLog();
							uni.showToast({
								title: '注销成功',
								icon: 'success'
							})
							that.logout(); // 退出goeasy链接
							//关闭socket
							var app = getApp();
							if (app.globalData.consignorSocketTask) {
								app.globalData.consignorSocketTask.close();
							}
							uni.hideTabBarRedDot({
								index: 3
							})
							uni.removeStorageSync("isFirstShow");
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('driverInfo');
							uni.removeStorageSync('token');
							uni.removeStorageSync('driverVerify');
							uni.removeStorageSync('userRole');
							setTimeout(() => {
								uni.reLaunch({
								    url: '../../defaultMainIndex/defaultMainIndex'
								});
							}, 1000);
							//登录后注销推送信息
							// var cid = plus.push.getClientInfo().clientid;
							
							// '注册推送信息'
							// utils.postRequest("/xxq/device/exp", {cid: cid});
							//  console.log(cid, '设计推送');
						}else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						console.log('注销错误', err);
					})
				}else {
					let url = '/yh/user/logout';
					let params = {
						userCode: that.userInfo.attrs.userCode
					};
					console.log('货主注销参数', params);
					utils.postRequest(url, params)
					.then(res=>{
						if(res.retCode == "0000000") {
							console.log('货主注销成功', res);
							// that.toSaveLog();
							uni.showToast({
								title: '注销成功',
								icon: 'success'
							})
							// that.logout(); // 退出goeasy链接
							var app = getApp();
							// if (app.globalData.consignorSocketTask) {
							// 	app.globalData.consignorSocketTask.close();
							// }
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('driverInfo');
							uni.removeStorageSync('token');
							uni.removeStorageSync('driverVerify');
							uni.removeStorageSync('userRole');
							setTimeout(() => {
								uni.reLaunch({
								    url: '../../defaultMainIndex/defaultMainIndex'
								});
							}, 1000);
						}else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						console.log('注销错误', err);
					})
				}
			},
			logout () { // 进入登录页需先退出断开goEasy链接
			if(this.goEasy.getConnectionStatus() == 'disconnected') {
				
			} else {
				let im = this.goEasy;
				let that = this;
				im.disconnect({
				    onSuccess: function(){
				        console.log('断连成功')
				        getApp().globalData.imService = null;
				    },
				    onFailed: function(error){
				        uni.showToast({
				            title:'断连失败'
				        })
				    }
				});
			}
				
			},
			toSaveLog() { //记录日志
				let that = this;
				let params = {
					primaryTableId: that.userInfo.userId,
					pageName: '用户注销',
					changeInfo: '用户注销',
				};
				console.log('记录日志参数', params);
				service.postRequest("/au/page/change/log/insert", params)
				.then(res=>{
					console.log('记录日志结果', res);
					uni.hideLoading();
					that.closeConfirmPopup();
					if(res.retCode == "0000000") {
						uni.showToast({
							title: '注销成功',
							icon: 'success'
						})
						uni.removeStorageSync('userInfo');
						uni.removeStorageSync('driverInfo');
						uni.removeStorageSync('token');
						uni.removeStorageSync('driverVerify');
						uni.removeStorageSync('userRole');
						setTimeout(() => {
							uni.switchTab({
								url: '../../defaultMainIndex/defaultMainIndex'
							})
						}, 1000);
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('记录日志错误', err);
				})
			},
			closeConfirmPopup() {
				this.$refs.confirmPopup.close();
			},
			showHintBox() {
				if(!this.agreementFlag) {
					uni.showToast({
						title: '请阅读并同意注销协议',
						icon: 'none'
					})
					return false;
				}
				this.$refs.confirmPopup.open();
			}
		}
	}
</script>

<style lang="scss">
	.cancellation {
		.mainTitle {
			font-size:34rpx;
			color:#333;
			font-weight:bold;
			padding: 32rpx;
		}
		.mainMsg {
			font-size:28rpx;
			color:#333;
			padding: 0 48rpx;
			line-height: 36rpx;
		}
		.tipsBox {
			padding: 32rpx;
			box-sizing: border-box;
			width:100vw;
			position: fixed;
			bottom:24rpx;
			.confirmAgreement {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 32rpx;
				.confirmAgreementIcon {
					width:36rpx;
					height: 36rpx;
				}
				.btn {
					width:32rpx;
					height: 32rpx;
					border-radius:100%;
					border:2rpx solid #C2C2C9;
				}
				.agreementHint {
					padding-left:20rpx;
					font-size: 26rpx;
					color: #707071;
					font-weight:bold;
				}
				.agreementDetails {
					font-size: 26rpx;
					color: #4AA2F3;
					font-weight:bold;
				}
			}
			.confirmBtn {
				margin-top:16rpx;
				background: #4AA2F3;
				height: 96rpx;
				line-height: 96rpx;
				border-radius: 48rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
		}
		.hintBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			.title {
				width:560rpx;
				font-size: 32rpx;
				color: #333;
				font-weight:500;
				text-align: center;
				padding: 40rpx 0 34rpx 0;
				line-height: 44rpx;
			}
			.msg {
				width:560rpx;
				font-size: 28rpx;
				color: #777777;
				padding: 0 16rpx 34rpx 16rpx;
				line-height: 40rpx;
			}
			.confirmBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top:2rpx solid #F3F3F3;
				.cancelBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #777777;
					text-align: center;
				}
				.groupLine {
					width: 2rpx;
					height: 94rpx;
					background-color: #F3F3F3;
				}
				.confirmBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #4AA2F3;
					text-align: center;
				}
			}
		}
	}
</style>
