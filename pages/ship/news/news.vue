<template>
	<view class="container">
		<view class="noDataContent" v-if="isNoData">
			<noData></noData>
		</view>
		<view class="item" v-for="(item, index) in listArr" :key="index">
			<view class="title">
				<view class="newsImg">
					<image src="../../../static/images/ship/news01.png" class="newsIcon" v-if="item.type == 1"></image>
					<image src="../../../static/images/goodsDelivery/accountMsgIcon.png" class="newsIcon" v-else></image>
					<text v-if="item.type == 1">物流消息</text>
					<text v-if="item.type == 2">短信消息</text>
					<text v-if="item.type == 3">账户消息</text>
					<text v-if="item.type == 4">保活消息</text>
					<text v-if="item.type == 5">福利消息</text>
				</view>
				<text class="sub">{{item.createdDt}}</text>
			</view>
			<view class="content">
				{{item.content}}
			</view>
		</view>
		<view class="moreBox">
			<uni-more-box :isMore="isNoMore"></uni-more-box>
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	import noData from "@/components/noData"
	import UniMoreBox from "@/components/uni-morebox"
	export default {
		components: {
			noData,
			UniMoreBox,
		},
		data() {
			return {
				isNoData: false,
				isNoMore: "more",
				listArr: [],
				index: 1,
				params: {
					pageNum: 1,
					pageSize: 10,
					msgType:1,
					types: [1]
				}
			}
		},
		onPullDownRefresh() {
			this.params.pageNum = 1;
			this.getNews("refresh")
		},
		onLoad(options) {
			var index = options.index;
			this.index = index;
			this.getNews("refresh");
			
			
		},
		onReachBottom() {
			if (this.isNoMore == "noMore") return;
			this.params.pageNum ++;
			this.isNoMore = "loading";
			this.getNews("more")
			
		},
		methods: {
			async getNews(type) {
				try{
					var index = this.index;
					var params = this.params;
					if (index == 1) {
						params.types = [1]
					} else if (index == 2) {
						params.types = [3,5]
					} else {
						params.types = [1]
					}
					var res = await ship.postRequest("/td/msg/select", params);
					console.log(res, 'asa')
					var total = res.rspBody.total;
					uni.setStorageSync("newsTotal", total)
					
					if (type == "refresh") {
						this.listArr = res.rspBody.items;
						this.isNoData = res.rspBody.items.length < 1 ? true : false;
						this.isNoMore = "more";
					} else {
						this.listArr = this.listArr.concat(res.rspBody.items);
						this.isNoData = false
						this.isNoMore = res.rspBody.items.length < this.params.pageSize ? 'noMore' : 'more'
					}
					uni.stopPullDownRefresh();
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.noDataContent {
		height: 80vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.moreBox {
		padding-top: 20rpx;
	}
	.container {
		width: 100vw;
		display: flex;
		flex-direction: column;
		padding: 12rpx 24rpx;
		min-height: 100vh;
		background-color: #F3F3F3;
		box-sizing: border-box;
		.item {
			&+.item {
				margin-top: 20rpx;
			}
			display: flex;
			flex-direction: column;
			padding: 32rpx 40rpx;
			background-color: #FFFFFF;
			.title {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 24rpx;
				font-size: 30rpx;
				color: #222222;
				font-weight: 500;
				.sub {
					font-size: 24rpx;
					color: #777777;
				}
				.newsImg {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					.newsIcon {
						width: 40rpx;
						height: 40rpx;
						margin-right: 10rpx;
					}
				}
			}
			.content {
				font-size: 26rpx;
				color: #333333;
				line-height: 36rpx;
			}
		}
	}
</style>
