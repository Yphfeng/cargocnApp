<template>
	<view class="all">
		<view class="content-box" v-for="item in addressItems" @longpress="deleteAdderss(item.id)">
			<view class="">
				<view class="content-head">
					<view class="user-name">{{item.cargoReceiver}}</view>
					<view class="user-phone">{{setPhone(item.phone)}}</view>
				</view>
				<text class="address-box">
					<text class="address-default" v-if="item.useDefault==1">默认</text>
					<text class="address-text">{{item.provinceName + ' ' + item.cityName + ' ' + item.areaName + ' ' + item.detailAddress}}</text>
				</text>
			</view>
			<view class="editor-box" @click="editorAddress(item)">
				<image class="editor-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/editor.png" mode=""></image>
			</view>
		</view>
		<view style="height:160rpx;">
			<view class="loading-more" v-if="noData && addressItems.length != 0">
				<text class="loading-more-text">没有更多数据了</text>
			</view>
		</view>
		<view class="add-address" @click="addAddress">添加新地址</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	import * as ship from "@/utils/ship"
	export default {
		data(){
			return {
				addressItems: [],
				pageSize: 10,
				pageNum: 1,
				isLoad: false,
				noData: false,
				userRole: 1,
			}
		},
		onLoad() {
			this.userRole = uni.getStorageSync("userRole");
		},
		onShow(){
			this.getAddress();
		},
		onPullDownRefresh() {
			this.pageNum = 1;
			this.getAddress();
		},
		onReachBottom() { // 上拉加载
			if(this.noData || this.isLoad) {
				return false;
			}
			console.log('上拉加载');
			this.isLoad = true;
			this.pageNum++;
		},
		methods:{
			deleteAdderss(id){
				var that = this;
				uni.showModal({
					title: '提示',
					content: '是否删除该地址?',
					success: function(res) {
						console.log(res);
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后...',
								mask: true,
							})
							utils.postRequest('/au/shipping/address/remove', {
								idList: [id]
							})
							.then(res=>{
								uni.hideLoading();
								if(res.retCode == '0000000'){
									that.getAddress();
								} else{
									uni.showToast({
										title: res.resDesc,
										icon: 'none'
									})
								}
							})
						}
					},
				})
			},
			setPhone(tel){
				if(!tel){
					return;
				}
				tel = "" + tel;
				var ary = tel.split("");
				ary.splice(3,4,"****");
				var tel1=ary.join("");
				return tel1
			},
			getAddress(){
				let that = this;
				var userRole = this.userRole, url = "";
				if (userRole == 1) {
					utils.postRequest('/au/shipping/address/findVO', {
						pageSize: that.pageSize,
						pageNum: that.pageNum,
					})
					.then(res=>{
						uni.stopPullDownRefresh();
						console.log(res.rspBody.items);
						if(res.retCode == '0000000'){
							let total = res.rspBody.total;
							that.addressItems = res.rspBody.items;
							if(total == that.addressItems.length) {
								that.noData = true;
							}
							that.isLoad = false;
						} else{
							that.isLoad = false;
							uni.showToast({
								title: res.resDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						
					})
				} else {
					var userInfo = uni.getStorageSync("userInfo");
					var userBusinessId = JSON.parse(userInfo).attrs.userBusinessId;
					console.log(userBusinessId, '用户userBusinessId')
					ship.postRequest('/business/shipping/address/select?userBusinessId=' + userBusinessId, {
						userBusinessId: userBusinessId
					}, 'GET')
					.then(res=>{
						console.log(res, 'aaa')
						uni.stopPullDownRefresh();
						console.log(res.rspBody.items);
						if(res.retCode == '0000000'){
							let total = res.rspBody.total;
							that.addressItems = res.rspBody;
							if(total == that.addressItems.length) {
								that.noData = true;
							}
							that.isLoad = false;
						} else{
							that.isLoad = false;
							uni.showToast({
								title: res.resDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						
						console.log(err)
					})
				}
			},
			editorAddress(map){
				uni.navigateTo({
					url: '/pages/my/settings/newAddress?map=' + JSON.stringify(map)
				})
			},
			addAddress(){
				uni.navigateTo({
					url: '/pages/my/settings/newAddress'
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F2F2F2;
	}
	.all{
		padding-bottom: 150rpx;
		.content-box{
			background-color: #fff;
			margin-top: 10rpx;
			padding: 30rpx 40rpx;
			display: flex;
			align-items: center;
			.content-head{
				display: flex;
				align-items: center;
				.user-name{
					font-size: 32rpx;
					color: #333;
					margin-right: 40rpx;
				}
				.user-phone{
					color: #777;
					font-size: 28rpx;
				}
			}
			.address-box{
				margin-top: 12rpx;
				display: flex;
				align-items: center;
				width: 600rpx;
				line-height: 40rpx;
				.address-default{
					background-color: #FF7D4A;
					border-radius: 4rpx;
					color: #fff;
					font-size: 24rpx;
					padding: 3rpx 10rpx;
					margin-right: 2rpx;
				}
				.address-text{
					color: #777;
					font-size: 28rpx;
				}
			}
			.editor-box{
				width: 150rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.editor-img{
					width: 40rpx;
					height: 44rpx;
				}
			}
		}
		.add-address{
			position: fixed;
			bottom: 30rpx;
			left: 30rpx;
			right: 30rpx;
			height: 80rpx;
			background-color: #FF7D4A;
			color: #fff;
			text-align: center;
			line-height: 80rpx;
			border-radius: 40rpx;
		}
		.loading-more {
			display: flex;
		    align-items: center;
		    justify-content: center;
		    padding: 14px 0;
		    text-align: center;
		    flex-direction: row;
			.loading-more-text {
			    font-size: 28upx;
			    color: #999;
			}
		}
	}
</style>
