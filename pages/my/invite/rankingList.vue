<template>
	<view class="all" :style="rankData && rankData.length>0 ? 'padding-bottom:168rpx;' : ''">
		<view class="line-box"></view>
		<view class="content-box">
			<view class="rankListTitleBox" v-if="rankData && rankData.length > 0">
				<view class="title">排名</view>
				<view class="title" style="margin-right:60rpx;">卡友昵称</view>
				<view class="title">成功邀请次数</view>
			</view>
			<view class="content-child" v-for="(item, index) in rankData" :key="index" v-if="index<rankData.length-1">
				<image class="content-num" v-if="item.src" :src="item.src" mode=""></image>
				<view class="content-num-text" v-else>{{index+1}}</view>
				<image class="user-img" :src="item.avatar?item.avatar:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
				<view class="user-name">{{item.userName}}</view>
				<view class="">{{item.countNum}}次</view>
			</view>
		</view>
		<view class="rankHint">备注：当前排行榜非实时数据，每日定时更新</view>
		<view class="oneself-box" v-if="rankData && rankData.length>0">
			<image v-if="mySrc" class="content-num" :src="mySrc" mode=""></image>
			<view v-else class="">{{myIndex<=10?myIndex:'未上榜'}}</view>
			<image class="user-img" :src="rankData[rankData.length-1].avatar?rankData[rankData.length-1].avatar:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
			<view class="user-name">{{rankData[rankData.length-1].userName}}</view>
			<view class="oneself-num">{{rankData[rankData.length-1].countNum}}次</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js"
	export default {
		data() {
			return {
				rankData: [],
				myIndex: '',
				userInfo: {},
				mySrc: '',
			}
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			if(userInfo){
				this.userInfo = JSON.parse(userInfo)
			}
			this.rankItems();
		},
		methods:{
			rankItems(){
				var that = this;
				utils.postRequest('/au/user/reference/rank', {
					pageSize: 10,
					pageNum: 1
				})
				.then(res=>{
					console.log(res);
					if(res.retCode == "0000000"){
						that.rankData = res.rspBody.items;
						var userCode = that.userInfo.attrs.userCode;
						console.log(res.rspBody.items.length)
						res.rspBody.items.map((val, index)=>{
							if(index<3){
								if(index==0){
									val.src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/firstName.png'
								} else if(index==1){
									val.src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/secondName.png'
								} else{
									val.src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/thirdName.png'
								}
							}
							if(that.myIndex === '' && userCode == val.referenceUserCode){
								if(index<3){
									if(index==0){
										that.mySrc = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/firstName.png'
									} else if(index==1){
										that.mySrc = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/secondName.png'
									} else{
										that.mySrc = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/thirdName.png'
									}
								} else{
									that.myIndex = index+1
								}
							}
						})
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	.all{
		.line-box{
			height: 10rpx;
			width: 750rpx;
			background-color: #f2f2f2;
		}
		.rankHint {
			position: fixed;
			bottom: 118rpx;
			left: 0;
			right: 0;
			font-size:24rpx;
			color:#999;
			height: 40rpx;
			line-height: 40rpx;
			padding: 0 0 0 50rpx;
		}
		.content-box{
			margin-top: 10rpx;
			.rankListTitleBox {
				padding: 24rpx 50rpx;
				display: flex;
				justify-content: space-between;
				.title {
					font-size:28rpx;
					color:#333;
				}
			}
			.content-child{
				display: flex;
				align-items: center;
				padding: 0 50rpx;
				color: #333;
				font-size: 28rpx;
				.content-num{
					width: 59.78rpx;
					height: 59.78rpx;
					margin-right: 26rpx;
				}
				.content-num-text{
					width: 59.78rpx;
					height: 59.78rpx;
					margin-right: 26rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.user-img{
					width: 80rpx;
					height: 80rpx;
					border-radius: 40rpx;
					margin: 20rpx;
				}
				.user-name{
					flex: 1;
				}
			}
		}
		.oneself-box{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 118rpx;
			background-color: #FCFCF2;
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			color: #333;
			font-size: 26rpx;
			.user-img{
				width: 80rpx;
				height: 80rpx;
				border-radius: 40rpx;
				margin: 20rpx;
			}
			.user-name{
				flex: 1;
				font-size: 28rpx;
				font-weight: bold;
			}
			.oneself-num{
				padding-right: 32rpx;
			}
			.content-num{
				width: 59.78rpx;
				height: 59.78rpx;
				margin-right: 26rpx;
			}
		}
	}
</style>
