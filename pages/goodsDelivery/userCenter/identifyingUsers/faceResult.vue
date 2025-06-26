<template>
	<view class="faceResult">
		<view class="img_content">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/face_success.png" class="img" v-if="type == 'success'"></image>
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/face_error.png" class="img" v-else></image>
		</view>

		<view class="bootom-msg">
			<view class="msg">
				{{msg}}
			</view>
			<view class="btn" @click="backTo()">
				关闭
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '',
				msg: '',
			}
		},
		onLoad(options) {
			
			this.type = options.type;
			this.msg = options.msg;
			this.source = options.source;
			
		},
		onBackPress(e) {
			
			var platForm = uni.getSystemInfoSync().platform;
			var source = this.source;
			if (source == "edit") {
				if (e.from == 'backbutton') {
					if (platForm == 'ios') {
						uni.navigateBack({
							delta: 4 
						}); 
					} else {
						uni.navigateBack({
							delta: 3
						}); 
					}
					return true;
				}
			} else {
				if (e.from == 'backbutton') {
					if (platForm == 'ios') {
						uni.navigateBack({
							delta: 2  
						}); 
					} else {
						uni.navigateBack({
							delta: 1
						}); 
					}
					return true;
				}
			}
			
			
			
		},
		methods: {
			backTo() {
				var platForm = uni.getSystemInfoSync().platform;
				var source = this.source;
				if (source == "edit") {
					if (platForm == "ios") {
						 uni.navigateBack({
						 	delta: 4
						 })
					} else {
						 uni.navigateBack({
						 	delta: 3
						 })
					}
				} else {
					if (platForm == "ios") {
						 uni.navigateBack({
						 	delta: 2
						 })
					} else {
						 uni.navigateBack({
						 	delta: 1
						 })
					}
				}
				
				 
			}
		}
	}
</script>

<style scoped lang="scss">
	.faceResult {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		.img_content {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			.img {
				width: 162rpx;
				height: 162rpx;
			}
		}
		
		.bootom-msg {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			.msg {
				font-size: 44rpx;
				color: #333333;
				font-weight: 600;
				margin-bottom: 172rpx;
			}
			.btn {
				width: 480rpx;
				height: 90rpx;
				background-color: #4EADF1;
				border-radius: 16rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				font-size: 32rpx;
				font-weight: 500;
				margin-bottom: 140rpx;
			}
		}
		
	}
</style>
