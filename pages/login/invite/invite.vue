<template>
	<view>
		<image class="cancel-box" src="../../../static/images/cancel.png" @click="goback"></image>
		<view class="content-all">
			<view class="input-box">
				<view class="invite-title">邀请人手机号</view>
				<view class="phone-box">
					<image class="input-img" src="../../../static/images/phone.png"></image>
					<input type="text" value="" placeholder-class="placeholder-class" placeholder="请输入手机号或用户ID" />
				</view>
				<view class="login-box">登录</view>
				<view class="skip-box">跳过</view>
			</view>
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
	.cancel-box{
		position: fixed;
		width: 24rpx;
		height: 24rpx;
		top: 98rpx;
		left: 40rpx;
	}
	.content-all{
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.input-box{
		flex: 3.3;
		margin: 0 68rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.invite-title{
		color: #FF8D02;
		font-size: 32rpx;
		margin-bottom: 36rpx;
	}
	.phone-box{
		height: 88rpx;
		width: 616rpx;
		border: 2rpx solid #AAAAAA;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		color: #AAAAAA;
		font-size: 28rpx;
	}
	.input-img{
		width: 28rpx;
		height: 40rpx;
		margin: 0 26rpx;
	}
	.placeholder-class{
		color: #AAAAAA;
		font-size: 28rpx;
	}
	.login-box{
		margin-top: 116rpx;
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
	}
	
</style>
