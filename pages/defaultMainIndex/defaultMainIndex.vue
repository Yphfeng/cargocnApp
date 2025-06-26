<template>
	<view class="defaultMainIndex">
		<view class="largeHeadTitle" v-if="!userRole">请选择您的身份</view>
		<view class="subHeadTitle" v-if="!userRole">欢迎使用货运中国</view>
		<view class="defaultRoleBox" v-if="!userRole">
			<view class="chooseRoleBtn" style="background-color:#4AA2F3;" @tap="changeUserRole(2)">
				<image class="roleIcon" src="../../static/images/goodsDelivery/shipIcon.png"></image>
				<view class="btnBox">
					<view class="btnMsg">我是货主</view>
					<image class="btnIcon" src="../../static/images/goodsDelivery/shipRIghtIcon.png"></image>
				</view>
			</view>
			<view class="roleHint">包含货站、个人发货人、企业发货人、信息部、三方物流发货</view>
			<view class="chooseRoleBtn" style="background-color:#F29347;" @tap="changeUserRole(1)">
				<image class="roleIcon" src="../../static/images/goodsDelivery/driverIcon.png"></image>
				<view class="btnBox">
					<view class="btnMsg">我是司机</view>
					<image class="btnIcon" src="../../static/images/goodsDelivery/driverRIghtIcon.png"></image>
				</view>
			</view>
		</view>
		
		<view class="footHint" v-if="!userRole">请审慎选择，选中后不可更换</view>
		
		<!-- 弹窗模块 -->
		<uni-popup ref="confirmPopup" type="center" @change="popupStatusChange">
			<view class="hintBox">
				<view class="confirmRoletitle">您当前选择身份：<text class="msg">{{checkedFlag == 1 ? '司机' : '货主'}}</text></view>
				<view class="confirmRoleMsg">请您审慎选择！选中后不可更改！</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="confirmToCancel()">重新选择</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" :class="canNext ? 'canConfirm' : 'canNotConfirm'" @tap="closeConfirmPopup()">确认选择<text class="watingMsg" v-if="isWating">{{'（' + watingTime + 's）'}}</text></view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="agreementPopup" type="center">
			<view class="hintBox">
				<!-- <view class="agreementDetails">您将开始使用的[货运中国]应用，是由上海货耘网络科技有限公司开发、拥有并运营的物流交易平台。</view> -->
				<view class="agreementBox">点击同意，视为您已阅读并同意货运中国<text class="agreement" @tap="jumpToAgreement(1)">《货运中国隐私政策》</text>，<text class="agreement" @tap="jumpToAgreement(2)">《货运中国用户服务协议》</text>，<text class="agreement" @tap="jumpToAgreement(3)">《货运中国用户授权协议》</text></view>
				
				<!-- <view class="confirmRole">请谨慎选择您的身份，一旦确认身份后不可更改。</view> -->
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="agreementToCancel()">拒绝</view>
					<view class="groupLine"></view>
					<view class="confirmBtn canConfirm" @tap="closeAgreementPopup()">同意</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="confirmCancelPopup" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="content">我们非常重视对您个人信息的保护，值得您的信赖，如不同意该政策，很遗憾我们将无法为您提供服务。</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="exitApp()">退出应用</view>
					<view class="groupLine"></view>
					<view class="confirmBtn canConfirm" @tap="closeConfirmCancelPopup()">我再看看</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="firstPrivacyPopup" type="center">
			<view class="hintBox" style="background: linear-gradient(30deg, #fff 0%, #E5F0F9 100%);">
				<view class="title" style="text-align: center;">温馨提示</view>
				<view class="content" style="padding-bottom: 0 !important;">感谢您的信任并使用货运中国！<br/>我们非常重视您的个人信息保护。特向您说明如下：<br/>1、我们会采取业界先进的安全措施保护您的信息安全，您也有权拒绝或取消授权。<br/>2、未经您同意，我们不会从第三方处获取、共享或向其提供您的信息。<br/>3、您可以查询、更正您的个人信息，我们也提供账户注销的渠道。</view>
				<view class="agreementBox" style="padding-top: 32rpx !important;">点击同意即表示您已阅读并同意我们的<text class="agreement" @tap="jumpToAgreement(1)">《货运中国隐私政策》</text>，<text class="agreement" @tap="jumpToAgreement(2)">《货运中国用户服务协议》</text>，<text class="agreement" @tap="jumpToAgreement(3)">《货运中国用户授权协议》</text></view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="exitApp()">拒绝</view>
					<view class="groupLine"></view>
					<view class="confirmBtn canConfirm" @tap="closeFirstPrivacyPopup()">同意</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	export default {
		data() {
			return {
				checkedFlag: '',
				pagePadding: '',
				headHeight: '',
				swiperHeight: '',
				footHeight: '',
				userRole: '',
				isWating: false,
				watingTime: 3,
				interval: '',
				canNext: false,
				setTimeoutObj: '',
				firstPrivacyAgree: ''
			};
		},
		onLoad() {
			uni.hideTabBar();
		},
		onShow() {
			this.firstPrivacyAgree = uni.getStorageSync('firstPrivacyAgree');
			uni.hideTabBar();
			this.userRole = uni.getStorageSync('userRole');
			if(this.userRole) {
				let that = this;
				that.setTimeoutObj = setTimeout(function(){
					publicData.setTabbarItem(userRole);
				},4000);
			}
		},
		onReady() {
			var platform = uni.getSystemInfoSync().platform;
			if(platform == "ios"){
				if(!this.userRole && !this.firstPrivacyAgree) {
					this.$refs.firstPrivacyPopup.open();
				}
			}
		},
		onUnload() {
			clearTimeout(this.setTimeoutObj);
		},
		methods: {
			changeUserRole(flag) { // 选择身份后打开确认弹窗，并在3秒后才可同意身份
				this.canNext = true;
				// this.isConfirmRole();
				this.checkedFlag = flag;
				this.$refs.confirmPopup.open()
			},
			popupStatusChange(e) {
				console.log(e);
				if(e.show == false) {
					clearInterval(this.interval);
					this.isWating = false;
					this.watingTime = 3;
				}
			},
			isConfirmRole() {
				this.isWating = true;
				let that = this;
				that.interval = setInterval(function(){
					that.watingTime = that.watingTime - 1;
					if(that.watingTime == 0) {
						clearInterval(that.interval);
						that.isWating = false;
						that.watingTime = 3;
						that.canNext = true;
					}
				},1000);
			},
			closeConfirmPopup() { // 关闭确认取消的弹框
				if(!utils.btnRepeat()) return false; // 防抖
				if(this.isWating) return false;
				// uni.showToast({
				// 	title: '执行一键登录',
				// 	icon: 'none'
				// })
				// this.$refs.agreementPopup.open();
				// this.$refs.confirmPopup.close();
				
			
				//获取司机广告页
				if(this.checkedFlag == 1) {
					this.$store.dispatch("getMainAdvertise"); //获取首页banner图片
					utils.loginSelf(this.checkedFlag);
				}else {
					this.$store.dispatch("getShipAdvertise"); //获取首页banner图片--货主
					utils.loginSelf(this.checkedFlag);
				}
				// uni.navigateTo({
				// 	url: '../login/login/login?userRole=' + this.checkedFlag
				// })
			},
			confirmToCancel() { // 打开确认取消的弹框
				this.$refs.confirmPopup.close();
				// this.$refs.confirmCancelPopup.open();
			},
			closeAgreementPopup() {
				if(!utils.btnRepeat()) return false; // 防抖
				utils.loginSelf(this.checkedFlag);
			},
			agreementToCancel() {
				this.$refs.confirmCancelPopup.open();
			},
			closeConfirmCancelPopup() {
				this.$refs.confirmCancelPopup.close();
				this.$refs.agreementPopup.close();
			},
			closeFirstPrivacyPopup() {
				uni.setStorageSync('firstPrivacyAgree', 1);
				this.$refs.firstPrivacyPopup.close();
			},
			exitApp() { // 退出app
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "android") {
					plus.runtime.quit();
				}else {
					plus.ios.import("UIApplication").sharedApplication().performSelector("exit");
				}
			},
			jumpToAgreement(flag) {
				switch(flag) {
					case 1:
						uni.navigateTo({
							url: '../allAgreement/privacy'
						});
						break;
					case 2:
						uni.navigateTo({
							url: '../allAgreement/plateformService'
						});
						break;
					case 3:
						uni.navigateTo({
							url: '../allAgreement/authorization'
						});
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.defaultMainIndex {
		padding-top:120rpx;
		min-height: 100vh;
		background-color: #FFF;
		box-sizing: border-box;
		.largeHeadTitle {
			font-size: 56rpx;
			color:#333;
			font-weight:bold;
			padding-left:48rpx;
			line-height: 80rpx;
		}
		.subHeadTitle {
			font-size:36rpx;
			color:#777;
			padding-left:48rpx;
			line-height: 54rpx;
		}
		.footHint {
			width: 100vw;
			font-size: 32rpx;
			color: #333333;
			line-height: 44rpx;
			text-align: center;
			position: absolute;
			bottom:80rpx;
		}
		.defaultRoleBox {
			padding-top:48rpx;
			// background-image: url(../../static/images/goodsDelivery/defaultRoleBc.png);
			// background-repeat: no-repeat;
			// background-size: 100%;
			// width: 100vw;
			// height: 1068rpx;
			// box-sizing: border-box;
			// padding-top:110rpx;
			// margin-top:-48rpx;
		}
		.shipRoleBox {
			padding: 48rpx 0 60rpx 0;
			background: linear-gradient(134deg, rgba(255, 255, 255, 0) 0%, #DDF3FF 100%);
			border-radius: 12rpx 12rpx 18rpx 2rpx;
		}
		.driverRoleBox {
			padding: 60rpx 0 48rpx 0;
			background: linear-gradient(134deg, rgba(255, 255, 255, 0) 0%, #FFEDDD 100%, #FFF0E3 100%);
			border-radius: 12rpx 12rpx 12rpx 2rpx;
		}
		.chooseRoleBtn {
			margin: 0 48rpx;
			padding: 62rpx 34rpx;
			border-radius:16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.roleIcon {
				width: 152rpx;
				height: 152rpx;
				margin-right:40rpx;
			}
			.btnBox {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.btnMsg {
					font-size: 52rpx;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 74rpx;
				}
				.btnIcon {
					width: 108rpx;
					height: 108rpx;
				}
			}
		}
		.roleHint {
			font-size: 28rpx;
			color: #777777;
			line-height: 40rpx;
			padding: 20rpx 74rpx 60rpx 74rpx;
		}
		.hintBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			margin: 0 32rpx;
			width:686rpx;
			.confirmRoletitle {
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
				line-height: 50rpx;
				text-align: center;
				padding: 64rpx 0 0 0;
				.msg {
					font-size: 48rpx;
					font-weight: 500;
					color: #4AA2F3;
				}
			}
			.confirmRoleMsg {
				font-size: 32rpx;
				color: #333333;
				line-height: 44rpx;
				text-align: center;
				margin: 66rpx 0;
				padding: 0 98rpx;
			}
			.agreementDetails {
				font-size: 30rpx;
				color: #333333;
				line-height: 42rpx;
				padding: 64rpx 82rpx 80rpx 82rpx;
			}
			.confirmRole {
				font-size: 32rpx;
				color: #333333;
				font-weight:bold;
				line-height: 42rpx;
				padding: 0 64rpx 32rpx 64rpx;
			}
			.agreementBox {
				font-size: 26rpx;
				color: #707071;
				line-height: 36rpx;
				padding: 64rpx 64rpx 48rpx 64rpx;
				.agreement {
					font-size: 26rpx;
					color:#4AA2F3;
				}
			}
			.title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
				line-height: 50rpx;
				padding: 46rpx 66rpx 32rpx 66rpx;
			}
			.content {
				font-size: 30rpx;
				color: #333333;
				line-height: 42rpx;
				padding: 0 66rpx 112rpx 66rpx;
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
					text-align: center;
					.watingMsg {
						font-size: 32rpx;
						font-weight: 500;
						color: #999;
					}
				}
				.canConfirm {
					font-size: 32rpx;
					font-weight: 500;
					color: #4AA2F3;
				}
				.canNotConfirm {
					font-size: 32rpx;
					font-weight: 500;
					color: #999;
				}
			}
		}
	}
</style>
