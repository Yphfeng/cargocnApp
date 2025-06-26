<template>
	<view class="userIntroduce">
		<view class="newHeader">
			<i class="uni-btn-icon" @click="backToFromPage()" style="color: rgb(0, 0, 0); font-size: 27px;"></i>
			<view class="pageTitle">个性签名</view>
			<view  class="headerSaveBtn" @tap="toSave()">保存</view>
		</view>
		<view class="editBox">
			<textarea class="textarea" v-model="userInfo.introduce" placeholder="请输入" @input="inputChange" :maxlength="30" />
			<view class="hint">{{inputHint}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				inputHint: 30
			}
		},
		onLoad(option) {
			let userInfo = uni.getStorageSync("userData");
			this.userInfo = JSON.parse(userInfo);
			this.inputHint = this.userInfo.introduce ? 30 - this.userInfo.introduce.length : 30;
			console.log(this.userInfo);
		},
		onShow() {
			
		},
		methods: {
			inputChange(e) {
				console.log(e.target.cursor);
				this.inputHint = 30 - Number(e.target.cursor);
			},
			backToFromPage() {
				uni.navigateBack({});
			},
			toSave() {
				console.log(this.userInfo.introduce);
				if(!this.userInfo.introduce) {
					uni.showToast({
					    title: '请输入简介！',
					    duration: 2000,
						icon: 'none'
					});
				}else {
					uni.setStorage({
					    key: 'userData',
					    data: JSON.stringify(this.userInfo),
					    success: function () {
							uni.navigateBack({});
					    }
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.userIntroduce {
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
			margin-top:2rpx;
			padding:30rpx;
			.textarea {
				font-size:32rpx;
				color:#333;
				min-height:240rpx;
			}
			.hint {
				text-align: right;
				font-size:28rpx;
				color:#777;
				padding-top:20rpx;
			}
		}
	}
</style>
