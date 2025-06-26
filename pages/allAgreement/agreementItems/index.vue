<template>
	<view class="all-box">
		<view class="content">
			<view class="content-child content-line" @tap="transportAgreement">
				<view class="">运输合同</view> 
				<image class="icon-right" src="/static/images/goodsDelivery/icon_right.png" mode=""></image>
			</view>
			<view class="content-child" @tap="jumpToPlatformAgreement">
				<view class="">平台服务协议</view>
				<image class="icon-right" src="/static/images/goodsDelivery/icon_right.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				taskId: '',
				quoteDetails: {},
				userRole: ''
			}
		},
		onLoad(options) {
			console.log(options)
			if(options.taskId){
				this.taskId = options.taskId
			}
			if(options.quoteDetails){
				this.quoteDetails = options.quoteDetails
			}
			
			this.userRole = uni.getStorageSync('userRole');
		},
		methods:{
			transportAgreement(){
				if(!utils.btnRepeat()) return false; // 防抖
				if(this.taskId){
					uni.navigateTo({
						url: "/pages/allAgreement/agreementItems/transportAgreement?taskId=" + this.taskId
					})
				} else {
					uni.navigateTo({
						url: "/pages/allAgreement/agreementItems/transportAgreement?quoteDetails=" + this.quoteDetails
					})
				}
			},
			jumpToPlatformAgreement() {
				if(!utils.btnRepeat()) return false; // 防抖
				console.log(this.userRole);
				switch(Number(this.userRole)) {
					case 1:
						uni.navigateTo({
							url: './driverPlatform'
						})
						break;
					case 2:
						uni.navigateTo({
							url: './shipPlatform'
						})
						break;
				}
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: #F3F3F3;
	}
	.all-box{
		display: flex;
		justify-content: center;
		align-items: center;
		.content{
			margin-top: 32rpx;
			width: 718rpx;
			background: #FFF;
			box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(0, 0, 0, 0.16);
			border-radius: 12rpx;
			.content-child{
				height: 106rpx;
				line-height: 106rpx;
				margin: 0 32rpx;
				color: #222;			
				font-weight: 500;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.icon-right{
					width:22rpx;
					height: 22rpx;
				}
			}
			.content-line{
				border-bottom: 2rpx solid #F2F3F3;;
			}
		}
	}
</style>
