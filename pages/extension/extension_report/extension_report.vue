<template>
	<view class="extension_report">
		<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/back_white.png" class="back" @click="back"></image>
		<view class="tips">
			<view class="tips_item" @click="activityRule">活动规则</view>
			<view class="tips_item" @click="toReportedList">上报记录</view>
		</view>
		<view class="title"></view>
		<view class="content">
			<view class="list">
				<view class="list-item">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/extension_content_icon_1.png" class="icon"></image>
					<view class="list_label">产品推广</view>
				</view>
				<view class="list-item">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/extension_content_icon_2.png" class="icon"></image>
					<view class="list_label">
						<text>使用人</text>
						<text>手机上报</text>
					</view>
				</view>
				<view class="list-item">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/extension_content_icon_3.png" class="icon"></image>
					<view class="list_label">等待审核</view>
				</view>
				<view class="list-item">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/extension_content_icon_4.png" class="icon"></image>
					<view class="list_label">领取奖励</view>
				</view>
			</view>
			<view class="main_text">轻松获得现金奖励与神秘小礼品</view>
			<view class="sub_text">比例返现金</view>
			<view class="sub_text">首单必得神秘小礼品</view>
			<view class="sub_text">每售卖成功5单，还可获得额外奖励</view>
		</view>
		<view class="sub_content">
			<view class="sub_con_title">上报产品使用人手机</view>
			<view class="input_whole">
				<view class="label">使用人手机*</view>
				<input type="number" v-model="value" placeholder="请输入实际使用人手机号" placeholder-class="placeholder" class="input">
			</view>
			<view class="send_btn">
				<view class="btn" @click="toSend">提交</view>
			</view>
		</view>
		<view class="bottom" />
		<uni-popup ref="certificationPopup" type="center">
			<view class="hintPopup">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/close_white_pop_icon.png" class="close" @click="closePop(1)"></image>
				<view class="hintTitle">温馨提示</view>
				<view class="hintMsg">
					请完成实名认证
				</view>
				<view class="hintBtn" @click="jumpToNextPage(1)">前往认证</view>
			</view>
		</uni-popup>
		<uni-popup ref="confirmPopup" type="center">
			<view class="hintPopup">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/close_white_pop_icon.png" class="close" @click="closePop(2)"></image>
				<view class="hintTitle">温馨提示</view>
				<view class="hintMsg">
					<text>恭喜您，上报成功！</text>
					<text>请等待审核</text>
				</view>
				<view class="hintBtn" @click="closePop(2)">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	import * as publicData from "@/utils/publicData.js"
	export default {
		data() {
			return {
				userInfo: null,
				value: '',
			}
		},
		onShow() {
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userInfo = JSON.parse(userInfo)
			}
		},
		methods: {
			activityRule() {
				uni.navigateTo({
					url: './activityRule'
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			closePop(index) {
				if (index == 1) {
					this.$refs.certificationPopup.close();
				} else {
					this.$refs.confirmPopup.close();
				}
			},
			async toSend() {
				if (!ship.btnRepeat()) return;
				if (!publicData.getUserPermissions(1)) {
					this.$refs.certificationPopup.open();
					return;
				}; // 认证信息验证
				var value = this.value;
				var userInfo = this.userInfo;
				if (!value) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return;
				}
				let aa = /^1[35789]\d{9}$/;
				if (aa.test(value) == false) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					})
					return;
				}
				//上报
				try{
					var params = {
						reportedName: userInfo.userName,
						reportedPhone: userInfo.mobile,
						userPhone: value
					}
					uni.showLoading();
					var res = await ship.postRequest("/dw/reported/add", params);
					console.log(res);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						this.$refs.confirmPopup.open();
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
			jumpToNextPage() {
				this.$refs.certificationPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
				});
			},
			toReportedList() {
				uni.navigateTo({
					url: '/pages/extension/extension_reported_list/extension_reported_list'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.extension_report {
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);  
		width: 100vw;
		min-height: 100vh;
		background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/extension_report_bg.png");
		background-size: cover;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		box-sizing: border-box;
		.back {
			position: absolute;
			top: 100rpx;
			left: 50rpx;
			width: 16rpx;
			height: 30rpx;
		}
		.tips {
			
			position: absolute;
			top: 520rpx;
			right: 0;
			.tips_item {
				border-radius: 12rpx 0 0 12rpx;
				width: 88rpx;
				height: 88rpx;
				background-color: rgba(220, 251, 243, 1);
				box-shadow: 0 0 8rpx 0 #0271D7;
				margin-bottom: 32rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: rgba(2, 105, 206, 1);
				font-weight: 500;
				letter-spacing: 3rpx;
				line-height: 36rpx;
				padding: 10rpx 10rpx 10rpx 16rpx;
				box-sizing: border-box;
			}
		}
		.title {
			margin-top: 900rpx;
			margin-bottom: 40rpx;
			width: 338rpx;
			height: 50rpx;
			background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/extension_title_icon.png");
			background-size: cover;
		}
		.content {
			width: calc(100vw - 76rpx);
			height: 484rpx;
			padding: 0 21rpx;
			box-sizing: border-box;
			background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/extension_content_bg.png");
			background-size: cover;
			margin-bottom: 40rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.list {
				display: flex;
				flex-direction: row;
				margin-bottom: 46rpx;
				.list-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: #ffffff;
					font-weight: 500;
					font-size: 24rpx;
					margin: 0 21rpx;
				}
				.list_label {
					height: 60rpx;
					flex-direction: column;
					display: flex;
					justify-content: center;
					align-items: center;
					line-height: 36rpx;
					letter-spacing: 1rpx;
				}
				.icon {
					width: 116rpx;
					height: 116rpx;
				}
			}
			.main_text {
				font-size: 36rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				letter-spacing: 2rpx;
				margin-bottom: 16rpx;
			}
			.sub_text {
				color: rgba(255, 255, 255, 1);
				font-size: 28rpx;
				font-weight: 400;
				letter-spacing: 2rpx;
				line-height: 42rpx;
			}
		}
		.sub_content {
			width: calc(100vw - 76rpx);
			height: 356rpx;
			background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/extension_subcontent_bg.png");
			background-size: cover;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.sub_con_title {
				margin-top: 38rpx;
				font-size: 36rpx;
				color: #ffffff;
				font-weight: 500;
				letter-spacing: 2rpx;
			}
			.input_whole {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				width: calc(100vw - 176rpx);
				.label {
					width: 100%;
					font-size: 28rpx;
					margin-top: 40rpx;
					margin-bottom: 10rpx;
					letter-spacing: 1rpx;
					color: rgba(255, 255, 255, 1);
					font-weight: 400;
				}
				.placeholder {
					color: rgba(109, 101, 221, 1);
					font-size: 24rpx;
					letter-spacing: 1rpx;
				}
				.input {
					width: 100%;
					border-bottom: 1rpx solid rgba(109, 101, 221, 1);
					font-size: 24rpx;
					font-weight: 400;
					letter-spacing: 1rpx;
					padding-bottom: 10rpx;
					color: rgba(109, 101, 221, 1);
					
				}
			}
			.send_btn {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				.btn {
					width: 324rpx;
					height: 64rpx;
					background: #5145E0;
					box-shadow: 2rpx 6rpx 12rpx 2rpx #0B0281, -2rpx -8rpx 8rpx -2rpx #4F42E4;
					border-radius: 114rpx;
					color: #ffffff;
					font-weight: 500;
					letter-spacing: 2rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
		.bottom {
			height: 70rpx;
		}
		.hintPopup {
			width: 524rpx;
			height: 360rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #ffffff;
			padding-bottom: 24rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			position: relative;
			.close {
				position: absolute;
				top: -64rpx;
				right: 0;
				width: 48rpx;
				height: 48rpx;
			}
			.hintTitle {
				height: 90rpx;
				width: 524rpx;
				background-image: linear-gradient(to bottom, rgba(115, 103, 241, 1), rgba(44, 62, 159, 1));
				display: flex;
				justify-content: center;
				align-items: center;
				color: #ffffff;
				font-size: 36rpx;
				font-weight: 500;
				border-radius: 16rpx 16rpx 0 0;
			}
			.hintMsg {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 36rpx;
				color: rgba(51, 51, 51, 1);
				line-height: 44rpx;
			}
			.hintBtn {
				width: 296rpx;
				height: 70rpx;
				display: flex;justify-content: center;
				align-items: center;
				background-image: linear-gradient(to bottom, rgba(112, 101, 237, 1), rgba(48, 65, 164, 1));
				border-radius: 100rpx;
				color: #ffffff;
				font-weight: 500;
			}
			
		}
	}
</style>