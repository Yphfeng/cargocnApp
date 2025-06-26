<template>
	<view class="all">
		<view class="title">手动输入条形码</view>
		<input class="content" type="text" :value="inputManualCode" maxlength="30" @input="inputCode" placeholder="请输入" />
		<view class="btn" @click="reference">确认提交</view>
		<!-- <view class="inviteCodeHint">
			请输入介绍您加入平台的邀请人的邀请码，他将获得平台的推广奖励。<br/>
			您也可以加入有奖推荐活动，到“邀请卡友”页面获取您自己的专属推荐码。<br/>
			（邀请码只能输入一次，不可修改）
		</view> -->
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js"
	export default {
		data(){
			return {
				inputManualCode: '',
				userInfo: {},
				userRole: 0,
				goodsObj: {},
			}
		},
		onLoad(options) {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : '';
			this.userRole = uni.getStorageSync("userRole");
		},
		onUnload() {
			uni.$emit('codeRefresh', this.goodsObj);
		},
		methods:{
			inputCode(e){
				this.inputManualCode = e.detail.value.toLocaleUpperCase();
			},
			reference(){
				let that = this;
				if(!that.inputManualCode){
					uni.showToast({
						title: '请输入条形码',
						icon: 'none'
					})
					return
				}
				if(that.inputManualCode.length <18){
					uni.showToast({
						title: '请输入正确的条形码',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '请稍后',
					mask: true,
				})
				utils.postRequest('/ld/ldebarcode/verify', {
					userId: that.userInfo.userId,
					serviceType: that.userRole == 1 ? 10 : 20,
					barCode: that.inputManualCode,
				}).then(res => {
					uni.hideLoading();
					console.log('getCheckData', res)
					if (res.retCode == "0000000") {
						that.goodsObj = res.rspBody;
						setTimeout(()=>{
							uni.navigateBack({
								
							})
						}, 100)
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err => {
			
				})
			},
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
