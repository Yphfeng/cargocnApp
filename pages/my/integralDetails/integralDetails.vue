<template>
	<view class="integralDetails">
		<view class="integralList" v-for="(item, index) in integraList" :key="index">
			<view class="msgBox">
				<view class="msgMainBox">
					<view class="msg">{{item.changeReason}}</view>
					<view class="sec">
						<view class="time">{{item.createdDt}}</view>
						<view class="integralBox">
							<view class="integral">+{{item.changeValue}}</view>
							<image class="integralIcon" src="../../../static/images/pointsStart.png"></image>
						</view>
					</view>
					
				</view>
				<view class="msgContent" v-if="item.remark">
					<view class="msg">{{item.remark}}</view>
				</view>
			</view>
		</view>
		<view class="loadingBox" v-show="noMore">
			没有更多了~
		</view>
		<view class="noData-box" v-show="noData">
			<image class="noData" src="/static/images/noData.png" mode="widthFix"></image>
			<view class="">暂无数据</view>
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
			正在加载中…
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	export default {
		data() {
			return {
				integraList: [],
				pageNum: 1,
				pageSize: 10,
				isLoading: false,
				noMore: false,
				noData: false,
				userInfo: {}
			};
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = JSON.parse(userInfo);
			console.log(this.userInfo);
			this.getListInfo();
		},
		onShow() {
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getListInfo();
		},
		onReachBottom() { // 上拉加载
		
			this.loadMore();
		},
		methods: {
			getListInfo() {
				this.pageNum = 1;
				this.noData = false;
				this.noMore = false;
				let params = {
					// userId: 1221,
					userId: this.userInfo.userId,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					changeType: 1
				}
				let that = this;
				utils.postRequest('/au/driverPointLevelLog/findVO', params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						that.integraList = res.rspBody.items;
						if(that.integraList && that.integraList.length == 0) {
							that.noData = true;
						}
						if(that.integraList && that.integraList.length > 0 && that.integraList.length < that.pageSize) {
							that.noMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
				})
				uni.stopPullDownRefresh();
			},
			loadMore() {
				if(this.noMore || this.isLoading) {
					return false;
				}
				this.isLoading = true;
				this.pageNum++;
				let params = {
					userId: this.userInfo.userId,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					changeType: 1
				}
				let that = this;
				utils.postRequest('/au/driverPointLevelLog/findVO', params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								that.integraList.push(items[i]);
							}
						}else {
							that.noMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			}
		}
	}
</script>

<style lang="scss">
	.integralDetails {
		min-height: 100vh;
		overflow-y: scroll;
		.integralList + .integralList {
			margin-top:10rpx;
		}
		.integralList {
			padding:40rpx;
			background-color: #FFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom:10rpx solid #F2F2F2;
			.msgBox {
				width: 100%;
				.msgMainBox {
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.sec {
						display: flex;
						flex-direction: row;
						align-items: center;
					}
				}
				.time {
					font-size:28rpx;
					color:#999;
					margin-right: 20rpx;
				}
				.msgContent {
					margin-top: 20rpx;
					font-size:28rpx;
					color:#333;
				}
			}
			.integralBox {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.integral {
					font-size:32rpx;
					color:#333;
					font-weight:bold;
					margin-right:16rpx;
					height: 26rpx;
				}
				.integralIcon {
					width:48rpx;
					height: 48rpx;
				}
			}
		}
		.loadingBox {
			padding:30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
                -webkit-animation: rotating 2s infinite;
                animation: rotating 2s infinite;
			}
		}
	.noData-box{
		width: 750rpx; 
		display: flex; 
		flex-direction: column; 
		color: #777; 
		align-items: center; 
		justify-content: center;
		background-color: #FFF;
		padding-bottom:50px;
		.noData{
			width: 400rpx;
			margin-bottom: 30rpx;
		}
	}
	
	}
</style>
