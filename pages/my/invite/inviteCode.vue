<template>
	<view class="all">
		<view class="title">输入邀请码</view>
		<input class="content" type="text" :value="referenceUserCode" @input="inputCode" :disabled="banInput" maxlength="6" />
		<view class="btn" v-if="!banInput" @click="reference">确认提交</view>
		<view class="btn1" v-else>已加入邀请</view>
		<view class="inviteCodeHint">
			请输入介绍您加入平台的邀请人的邀请码，他将获得平台的推广奖励。<br/>
			您也可以加入有奖推荐活动，到“邀请卡友”页面获取您自己的专属推荐码。<br/>
			（邀请码只能输入一次，不可修改）
		</view>
	</view>
</template>

<script>
	import * as shipUtils from "@/utils/ship.js"
	export default {
		data(){
			return {
				userInfo: {},
				referenceUserCode: '',
				banInput: false,
				codeType: 0,
				userRole: '',
			}
		},
		onLoad(options) {
			var userInfo = uni.getStorageSync("userInfo");
			if(userInfo){
				this.userInfo = JSON.parse(userInfo);
				this.referenceUserCode = this.userInfo.attrs.referenceUserCode?this.userInfo.attrs.referenceUserCode:'';
				this.banInput = this.referenceUserCode?true: false
				console.log(this.userInfo);
			}
			this.userRole = uni.getStorageSync('userRole');
			this.codeType = options.type;
			if(!this.referenceUserCode){
				this.getCode();
			}
		},
		methods:{
			inputCode(e){
				this.referenceUserCode = e.detail.value.toLocaleUpperCase();
			},
			getCode(){
				var that = this;
				
				var serviceType = that.userRole == 1 ? 10 : 20;
				console.log(serviceType, that.userInfo.attrs.userCode)
				shipUtils.postRequest('/yh/business/user/get/business/invitation/code?userCode=' + that.userInfo.attrs.userCode + '&serviceType=' + serviceType, {}, 'GET')
				.then(res=>{
					console.log(res)
					if(res.retCode == "0000000"){
						that.referenceUserCode = res.rspBody?res.rspBody.invitationCode:'';
						that.banInput = that.referenceUserCode?true: false
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err)
				})
				
			},
			reference(){
				var that = this;
				
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return
				}
				
				if(!that.referenceUserCode){
					uni.showToast({
						title: '请输入邀请码',
						icon: 'none',
					})
					return;
				}
				if (escape(that.referenceUserCode).indexOf("%u") !=-1){
					uni.showToast({
						title: '请输入正确的邀请码',
						icon: 'none',
					})
					return
				}
				uni.showLoading({
					title: '请稍后',
					mask: true,
				})
				shipUtils.postRequest('/yh/business/user/binding/business/invitation/code', {
					serviceType: that.userRole == 1 ? 10 : 20,
					userCode: that.userInfo.attrs.userCode,
					invitationCode: that.referenceUserCode
				})
				.then(res=>{
					uni.hideLoading()
					console.log(res, "交易环境");
					if(res.retCode == "0000000"){
						that.banInput = true;
						uni.showToast({
							title: '成功',
							icon: 'none',
						})
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.all{
		border-top: 10rpx solid #f2f2f2;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.title{
			margin: 90rpx 0 40rpx 0;
			font-size: 28rpx;
			color: #333;
		}
		.content{
			width: 448rpx;
			height: 82rpx;
			border-radius: 42rpx;
			background-color: #F5F5F5;
			line-height: 82rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			box-sizing: border-box;
			text-align: center;
		}
		.btn{
			width: 448rpx;
			height: 82rpx;
			line-height: 82rpx;
			border-radius: 42rpx;
			background-color: #527AFE;
			font-size: 28rpx;
			margin-top: 60rpx;
			color: #fff;
			text-align: center;
		}
		.btn1{
			width: 448rpx;
			height: 82rpx;
			line-height: 82rpx;
			border-radius: 42rpx;
			background-color: #999;
			font-size: 28rpx;
			margin-top: 60rpx;
			color: #fff;
			text-align: center;
		}
		.inviteCodeHint {
			margin-top:100rpx;
			line-height: 40rpx;
			font-size:24rpx;
			color:#909399;
			padding:40rpx;
		}
	}
</style>
