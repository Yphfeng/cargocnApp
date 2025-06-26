<template>
	<view class="container">
		<image class="cancel-box" src="../../../static/images/cancel.png" @click="goback"></image>
		<view class="content-all">
			<view class="input-box">
				<view class="phone-box">
					<image class="input-img" src="../../../static/images/phone.png"></image>
					<input type="number" @input="inputTel" maxlength="11" :value="mobile" placeholder-class="placeholder-class" placeholder="请输入手机号" />
				</view>
				<view class="phone-box">
					<view class="">
						<image class="input-img" src="../../../static/images/password.png"></image>
					</view>
					<view class="code-btn">
						<input :value="password" password="true" @input="inputPassword" placeholder-class="placeholder-class" placeholder="请输入密码" />
						<!-- <view class="btn-box">获取验证码</view> -->
					</view>
				</view>
				<view class="switch-box">
					<view class="" @click="loginCode">使用验证码登录</view>
					<view class="" @click="forgetPwd">忘记密码</view>
				</view>
				<view class="login-box" @click="login">登录</view>
			</view>
			<view class="content-placeholder"></view>
			
			<view class="tips">
				<checkbox-group @change="checkboxChange">
					<checkbox :checked="isCheck" class="checkbox" />
				</checkbox-group>
				<text>我已阅读并同意</text>
				<view class="hyChina" @click="goCheckDetail">《服务协议》</view>
				<text>及</text>
				<view class="hyChina" @click="goPrivacyPolicy">《隐私政策》</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js"
	export default {
		data() {
			return {
				mobile: '',
				password: '',
				isCheck: false,
			}
		},
		methods: {
			checkboxChange(e) {
				this.isCheck = !this.isCheck
			},
			goCheckDetail() {
				uni.navigateTo({
					url: './checkDetail'
				})
			},
			goPrivacyPolicy(){
				uni.navigateTo({
					url: './privacyPolicy'
				})
			},
			goback(){
				uni.switchTab({
					url: '../../index/srevice/srevice'
				})
			},
			loginCode() {
				uni.navigateTo({
					url: './login'
				})
			},
			inputTel(e) {
				this.mobile = e.detail.value;
			},
			inputPassword(e){
				this.password = e.detail.value;
			},
			forgetPwd() {
				uni.navigateTo({
					url: '../../my/settings/pwdManager?url=login'
				})
			},
			login(){
				if(!this.mobile){
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return
				}
				if(!this.password){
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return;
				}
				if (!this.isCheck) {
					uni.showToast({
						title: '请同意服务协议',
						icon: 'none'
					})
					return;
				}
				var parm = {
				  mobile: this.mobile,
				  password: this.password,
				  loginType: "840"
				};
				uni.showLoading({
					title: '登录中',
					mask: true,
				})
				console.log(parm);
				utils.newRegisterLoginRequest('/au/login', parm)
				.then(function (res) {
					uni.hideLoading();
					if(res.retCode == "0000000"){
						uni.setStorageSync('userInfo', JSON.stringify(res.rspBody));
						//判断是否首次登录
						if (res.rspBody.attrs.remindStatus == 0) {
							uni.reLaunch({
								url: '../../my/myHobby/myHobby'
							})
						} else {
							uni.switchTab({
								url: '/pages/index/srevice/srevice'
							})
						}
						
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log((err))
				})
			},
		}
	}
</script>

<style>
	.container {
		background-image: url(../../../static/images/loginBackground1.png);
		background-size: cover;
		width: 750rpx;
		background-size: 100% 100%
	}
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
	}
	.input-box{
		flex: 8.3;
		margin: 0 68rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.content-placeholder{
		flex: 1;
	}
	.phone-box{
		height: 88rpx;
		width: 616rpx;
		border: 2rpx solid #AAAAAA;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		color: #000;
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
	.code-btn{
		display: flex;
		align-items: center;
		font-size: 24rpx;
		justify-content: space-between;
		padding-right: 24rpx;
		width: 100%;
		color: #000;
	}
	.btn-box{
		width: 154rpx;
		height: 48rpx;
		background-color: #DEDEDE;
		line-height: 48rpx;
		text-align: center;
		border-radius: 10rpx;
	}
	.switch-box{
		color: #0077FF;
		font-size: 24rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.login-box{
		margin-top: 70rpx;
		width: 100%;
		background-color: #0077FF;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		text-align: center;
		border-radius: 10rpx;
	}
	.tips {
		position: fixed;
		bottom: 20rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 24rpx;
		align-items: center;
	}
	
	.hyChina {
		color: #007AFF;
	}
</style>
