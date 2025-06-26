<template>
	<view class="buyHistory">
		<view v-if="isNoData" class="noDataContent">
			<noData></noData>
		</view>
		<view class="list" v-for="item in listInfo">
			<view class="item">
				<view class="date">{{item.createdDt}}</view>
				<view class="status">交易成功</view>
			</view>
			
			<view class="item">
				<view class="remark">{{item.opName}}</view>
				<view class="price">{{showPrice(item.amount)}}</view>
			</view>
		</view>
		<uni-more-box :isMore="isNoMore" style="margin-top: 20rpx;"></uni-more-box>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	import noData from "@/components/noData";
	import UniMoreBox from "@/components/uni-morebox";
	export default {
		components: {
			noData,
			UniMoreBox
		},
		data() {
			return {
				params: {
					pageNum: 1, 
					pageSize: 20,
					opTypes: [56, 57, 58],
				},
				isNoData: false,
				isNoMore: 'more',
				listInfo: [],
				
			}
		},
		onLoad() {
			uni.showLoading();
			this.refresh('refresh')
		},
		onPullDownRefresh() {
			this.params.pageNum = 1;
			this.refresh('refresh');
		},
		onReachBottom() {
			if (this.isNoMore == "noMore" || this.isNoData) {
				return
			}
			this.params.pageNum ++;
			this.refresh('more');
		},
		methods: {
			showPrice(price) {
					if (!price) {
						return '¥0'
					} else {
						return '¥' + (price/1000)
					}
			},
			refresh(type) {
				this.params.pageNum = 1;
				console.log(this.params, '日期111')
				let that = this;
				ship.postRequest('/dw/wallet/capitalDetail', this.params)
				.then(res=>{
					console.log('钱包', res);
					if(res.retCode == '0000000') {
						var items = res.rspBody.items;
						if (type == 'refresh') {
							if (items.length == 0) {
								that.isNoData = true;
								that.isNoMore = "more";
							} else {
								that.isNoData = false
								that.isNoMore = items.length < this.params.pageSize ? "noMore" : "more";
							}
							that.listInfo = res.rspBody.items;
							uni.stopPullDownRefresh();
						} else {
							that.isNoData = false
							that.isNoMore = items.length < this.params.pageSize ? "noMore" : "more";
							
							that.listInfo = that.listInfo.concat(res.rspBody.items);
							uni.stopPullDownRefresh();
						}
						
					}else {
						uni.stopPullDownRefresh();
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.stopPullDownRefresh();
					uni.hideLoading();
					console.log(err);
				})
			},
			loadMore() {
				
			},
		}
	}
</script>

<style scoped lang="scss">
	.buyHistory {
		background-color: #F1F4F9;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.noDataContent {
			height: calc(100vw - 100rpx);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.list {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			height: 188rpx;
			background-color: #FFFFFF;
			padding: 30rpx 0;
			box-sizing: border-box;
			border-radius: 24rpx;
			.item {
				width: calc(100vw - 72rpx);
				padding: 0 36rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.date {
					color: #333333;
					font-size: 36rpx;
					font-weight: 500;
				}
				.status {
					font-size: 36rpx;
					color: #58C615;
					font-weight: 500;
				}
				.remark {
					font-size: 36rpx;
					color: #333333;
				}
				.price {
					font-size: 36rpx;
					color: #E51919;
				}
			}
		}
	}
</style>
