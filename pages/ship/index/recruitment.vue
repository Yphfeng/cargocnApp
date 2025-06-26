<template>
	<view class="bag_box">
		<image class="image" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/cardFriend_Poster.png"></image>
		<view class="btn_box" @click="joinFleet">
			加入超级车队
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		methods:{
			joinFleet(){
				uni.switchTab({
					url:'../fleet/index'
				})
				uni.$emit('SuperFleet','SUPER_FLEET')
			}
		}
	}
</script>

<style lang="scss">
	.bag_box {
		width: 100vw;
		height: 100vh;
		position: relative;
		.image {
			width: 100vw;
			height: 100vh;
			position: absolute;
			top: 0;
			bottom:0;
			right: 0;
			left: 0;
		}
		
		.btn_box {
			z-index: 2;
			position: absolute;
			bottom: 146rpx;
			left: 174rpx;
			width: 400rpx;
			right: 176rpx;
			height: 80rpx;
			background: #2973FA;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			opacity: 1;
			font-size: 32rpx;
			font-family: PingFang SC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
