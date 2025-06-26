<template>
	<view>
		<image class="cancel-box" src="../../../static/images/cancel.png" @click="goback"></image>
		<image class="background-box" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/loginBackground.png"></image>
		<view class="content-all">
			<view class="user-info">
				<view class="">
					<image class="user-img" src="../../../static/logo.png"></image>
				</view>
				<view class="">张三</view>
			</view>
			<view class="login-box">本机号码一键登录</view>
			<view class="skip-box">其他手机号码登录</view>
		</view>
		<view class="agreement-box">
			<view class="">登录即同意</view>
			<view class="agreement-content">《服务协议》</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goback(){
				uni.navigateBack({
					
				})
			}
		}
	}
</script>

<style>
	.background-box{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	.cancel-box{
		position: fixed;
		width: 24rpx;
		height: 24rpx;
		top: 98rpx;
		left: 40rpx;
		z-index: 9;
	}
	.content-all{
		height: 100vh;
		margin: 0 68rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.user-info{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #333333;
		font-size: 26rpx;
		font-weight: 800;
	}
	.user-img{
		width: 160rpx;
		height: 160rpx;
		border-radius: 80rpx;
	}
	.login-box{
		margin-top: 56rpx;
		width: 100%;
		background-color: #0077FF;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		text-align: center;
		border-radius: 10rpx;
		font-size: 30rpx;
	}
	.skip-box{
		margin-top: 36rpx;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		color: #666;
		text-align: center;
		border-radius: 10rpx;
		font-size: 30rpx;
		border: 1rpx solid #AAAAAA;
		box-sizing: border-box;
		background-color: #fff;
	}
	.agreement-box{
		position: fixed;
		bottom: 26rpx;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #fff;
	}
	.agreement-content{
		color: #FF5001;
	}
</style>
