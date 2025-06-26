<template>
	<view>
		<image class="cancel-box" src="../../../static/images/cancel.png" @click="goback"></image>
		<image class="background-box" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/loginBackground.png"></image>
		<view class="content-all">
			<view class="login-box" @click="loginSelf">本机号码一键登录</view>
			<view class="skip-box" @click="goLogin">其他手机号码登录</view>
		</view>
		<view class="agreement-box">
			<view class="">登录即同意</view>
			<view class="agreement-content">《服务协议》</view>
		</view>
	</view>
</template>

<script>
	import {newRegisterLoginRequest} from "../../../utils/service.js"
	export default {
		data() {
			return {
				
			}
		},
		
		methods: {
			goback(){
				uni.navigateBack({
					
				})
			},
			goLogin(){
				uni.navigateTo({
					url: '/pages/login/login/login'
				})
			},
			loginSelf() {
				uni.login({
				    provider: 'univerify',
				    univerifyStyle: { 
				       fullScreen: true,
					   backgroundImage: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/loginBackground.png",
					   "icon": {  
					         "path": "" // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo   
					     },  
					   
				    },
					success: function(res) {
						console.log(res, '返回接口')
						newRegisterLoginRequest("/au/login", {
							loginType: '840',
							appAccessToken: res.authResult.access_token,
							appOpenId: res.authResult.openid,
						}).then(response => {
							console.log(response, 'adsa')
						}).catch(err => {
							console.log(err)
						})
					},
					fail: function(err) {
						console.log(err, '返回错误')
						if (err.errCode == "30002") {
							//用户点击了其他登录方式
							uni.closeAuthView();
							uni.navigateTo({
								url: '../login/login'
							})
						}
					}
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
	.login-box{
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
