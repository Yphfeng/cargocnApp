<template>
	<view class="extension_reported">
		<view v-if="listArr.length < 1 && !requesting">
			<noData></noData>
		</view>
		<view class="list-item" v-for="item in listArr">
			<view class="title">{{item.consigneeProvince + item.consigneeCity + item.consigneeArea + item.consigneeAddr}}</view>
			<view class="row row-service">
				<view class="service">{{item.goodsName}}</view>
				<text class="num">{{item.goodsNum || 0}}件</text>
				<text class="phone">{{item.consigneePhone}}</text>
			</view>
			<view class="row">快递单号：{{item.courierNumber || "待发货"}}</view>
			<view class="date">{{showDate(item.createTime)}}</view>
		</view>
		<uni-more-box :isMore="isMore" :containerStyle="{'margin-top': '20rpx'}"></uni-more-box>
		<view style="height: 40rpx;" />
		
	</view>
</template>


<script>
	import noData from "@/components/noData.vue"
	import UniMoreBox from "@/components/uni-morebox.vue"
	import * as ship from "@/utils/ship.js"
	import * as utils from "@/utils/utils.js"
	export default {
		components: {
			noData,
			UniMoreBox,
		},
		data() {
			return {
				listArr: [],
				requesting: false,
				isMore: 'more',
				params: {
					pageNum: 1,
					pageSize: 10,
					userId: ''
				}
			}
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			
			if (userInfo) {
				this.params.userId = JSON.parse(userInfo).userId
			}
			uni.showLoading();
			this.requesting = true;
			this.refresh();
		},
		onPullDownRefresh() {
			this.isMore = "more";
			this.refresh();
		},
		onReachBottom() {
			if (this.requesting) return;
			if (this.isMore == "loading" || this.isMore == "noMore") return;
			this.isMore = "loading";
			this.more();
			
		},
		methods: {
			async refresh() {
				this.params.pageNum = 1;
				try{
					var res = await ship.postRequest("/dw/buy/box/get_by_user", this.params);
					uni.hideLoading();
					uni.stopPullDownRefresh();
					this.requesting = false;
					console.log(res)
					if (res.retCode == "0000000") {
						this.listArr = res.rspBody.items;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					this.requesting = false;
					uni.stopPullDownRefresh();
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			async more() {
				this.params.pageNum ++;
				try{
					var res = await ship.postRequest("/dw/buy/box/get_by_user", this.params);
					uni.hideLoading();
					this.requesting = false;
					console.log(res)
					if (res.retCode == "0000000") {
						var listArr = res.rspBody.items;
						this.listArr = this.listArr.concat(listArr);
						this.isMore = listArr.length < this.params.pageSize ? 'noMore' : 'more';
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					this.requesting = false;
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			showDate(date) {
				if (!date) return '';
				var da = date.replace(/-/g, "/");
				var no = new Date(da);
				return utils.dateFormat("YY-mm-dd HH:MM:SS", no)
			}
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.extension_reported {
		min-height: 100vh;
		width: 100vw;
		background-color: rgba(250, 250, 250, 1);
		padding-top: 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);
		
		.list-item {
			margin-top: 24rpx;
			width: calc(100vw - 72rpx);
			border-radius: 24rpx;
			box-shadow: 0 0 34rpx 0 rgba(0,0,0,0.0600);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			.title {
				width: calc(100vw - 72rpx);
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				font-size: 44rpx;
				font-weight: 500;
				color: #333333;
				line-height: 40rpx;
				margin: 38rpx 0 32rpx;
				padding: 0 40rpx;
				box-sizing: border-box;
				
			}
			.row {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-start;
				width: calc(100vw - 72rpx);
				box-sizing: border-box;
				padding: 0 40rpx;
				&.row-service {
					margin-bottom: 32rpx;
				
				}
				.service {
					width: 300rpx;
					font-size: 36rpx;
					font-weight: 500;
					color: #2B72F0;
					line-height: 32rpx;
			
				}
				.num {
					font-size: 32rpx;
					
					font-weight: 500;
					color: #333333;
					line-height: 32rpx;
					
				}
				.phone {
					
					font-size: 32rpx;
					
					font-weight: 400;
					color: #333333;
					line-height: 32rpx;
			
				}
			}
			.date {
				width: calc(100vw - 72rpx);
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				
				font-size: 24rpx;
				
				font-weight: 400;
				color: #666666;
				line-height: 24rpx;
				padding-bottom: 14rpx;
				box-sizing: border-box;
				margin-top: 30rpx;
				padding-right: 16rpx;
				
			}
		}
	}
</style>