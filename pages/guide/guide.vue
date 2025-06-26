<template>
	<view class="">
		<swiper class="swiper" indicator-dots="false" indicator-active-color="#3375F6">
			<block v-for="(item, index) in movies" :key="index">
				<swiper-item class="swiper-child">
					<image :src="item.url" class="swiper" mode="aspectFill" />
					<view class="skip-box" @click="backTap">跳过</view>
					<view class="swiper-text" v-if="index==0">
						<view class="swiper-title">服务站</view>
						<view class="swiper-content">服务赞不赞 卡友说了算</view>
					</view>
					<view class="swiper-text" v-if="index==1">
						<view class="swiper-title">路况</view>
						<view class="swiper-content">分享路况 共享畅通</view>
					</view>
					<view class="swiper-text" v-if="index==2">
						<view class="swiper-title">互助</view>
						<view class="swiper-content">困难时刻 卡友相助</view>
						<view class="btn-box" @click="backTap">立即体验</view>
					</view>
				</swiper-item>
			</block>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图
				movies: [
					{ url: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/guide1.png' },
					{ url: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/guide2.png' },
					{ url: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/guide3.png' }
				],
			}
		},
		onUnload(){
			uni.setStorage({
			    key: 'is-login',
			    data: '1',
			    success: function () {
			        uni.$emit('is-login', 1)
			    }
			});
		},
		methods: {
			backTap(){
				uni.navigateBack({
					
				})
			},
		}
	}
</script>
<style>
	.skip-box{
		position: absolute;
		top: 144rpx;
		right: 65rpx;
		color: #8D8D8D;
		background-color: #EAEAEA;
		height: 60rpx;
		line-height: 60rpx;
		width: 110rpx;
		font-size: 28rpx;
		border-radius: 50rpx;
		text-align: center;
	}
	.btn-box{
		width: 180rpx;
		background-color: #3375F6;
		color: #fff;
		font-size: 30rpx;
		text-align: center;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		margin-top: 60rpx;
	}
	.swiper{
		width: 750rpx;
		height: 100vh;
	}
	.swiper-child{
		position: relative;
	}
	.swiper-text{
		position: absolute;
		bottom: 0;
		height: 30%;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		align-items: center;
	}
	.swiper-title{
		color: #333;
		font-weight: bold;
		font-size: 40rpx;
	}
	.swiper-content{
		color: #777;
		font-size: 28rpx;
		margin-top: 60rpx;
	}
	/deep/ .uni-swiper-dots{ bottom: 50px!important; }
</style>
