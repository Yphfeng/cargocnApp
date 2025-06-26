<template>
	<view class="editNickName">
		<view class="newHeader">
			<i class="uni-btn-icon" @click="backToFromPage()" style="color: rgb(0, 0, 0); font-size: 27px;"></i>
			<view class="pageTitle">昵称</view>
			<view  class="headerSaveBtn" @tap="toSave()">保存</view>
		</view>
		<view class="editBox">
			<view class="inputBox">
				<view class="title">昵称</view>
				<input maxlength="10" class="input" v-model="userInfo.name" type="text" placeholder="请输入" />
			</view>
			<view class="deleteIcon" @tap="userInfo.name = ''"><image src="../../../../static/images/inputdelete.png"></image></view>
		</view>
		<view class="hintMsg">
			设置后，其他人将看到你的昵称。
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
			}
		},
		onLoad(option) {
			let userInfo = uni.getStorageSync("userData");
			this.userInfo = JSON.parse(userInfo);
			console.log(this.userInfo);
		},
		onShow() {
			
		},
		methods: {
			backToFromPage() {
				uni.navigateBack({});
			},
			toSave() {
				console.log(this.userInfo.name);
				if(!this.userInfo.name) {
					uni.showToast({
					    title: '请输入昵称！',
					    duration: 2000,
						icon: 'none'
					});
				}else {
					let userRole = uni.getStorageSync("userRole");
					let userInfo = uni.getStorageSync("userInfo");
					userInfo = JSON.parse(userInfo);
					if (userRole == 1) {
						userInfo.userName = this.userInfo.name
					} else {
						userInfo.attrs.nickname = this.userInfo.name
					}
					uni.setStorageSync('userInfo', JSON.stringify(userInfo));
					uni.setStorageSync('userData', JSON.stringify(this.userInfo));
					uni.navigateBack({});
				}
			}
		}
	}
</script>

<style lang="scss">
	.editNickName {
		min-height: 100vh;
		background-color: #f2f2f2;
		image {
			max-width: 100%;
			max-height: 100%;
		}
		.newHeader {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:100rpx 20rpx 14rpx 20rpx;
			background-color: #FFF;
			.pageTitle {
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size:36rpx;
				color:#000;
			}
			.headerSaveBtn {
				height: 60rpx;
				line-height: 60rpx;
				font-size:28rpx;
				color:#000;
			}
		}
		.editBox {
			background-color: #FFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.inputBox {
				padding:32rpx 0 32rpx 30rpx;
				height: 44rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.input {
					height: 44rpx;
					color:#333;
					font-size:32rpx;
					min-width:500rpx;
					flex: 1;
				}
				.title {
					height: 44rpx;
					line-height: 44rpx;
					font-size:32rpx;
					color:#333;
					width:100rpx;
				}
			}
			.deleteIcon {
				padding:36rpx 30rpx;
				width:36rpx;
				height: 36rpx;
			}
		}
		.hintMsg {
			font-size:28rpx;
			color:#777;
			padding:20rpx 30rpx;
			height: 40rpx;
			line-height: 40rpx;
		}
	}
</style>
