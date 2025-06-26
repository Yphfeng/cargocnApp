<template>
	<view class="extension_reported">
		<view class="tips">
			<view class="tips-item">
				已上报：{{hasReport}}人
			</view>
		</view>
		<view v-if="listArr.length < 1 && !requesting">
			<noData></noData>
		</view>
		<view class="list-item" v-for="item in listArr">
			<view class="row row-first">
				<view class="name">{{item.purchaseUserName || "匿名用户"}}</view>
				<view class="status" v-if="item.isValid">已购买{{item.reportedType == 1 ? '(硬件盒子)' : '(货主会员)'}}</view>
				<view class="status" v-else>未购买</view>
			</view>
			<view class="row">
				<view class="phone">{{item.purchaseUserMobile}}</view>
				<view class="date">{{showDate(item.reportedTime)}}</view>
			</view>
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
				tabs: ["智能卡车盒", "货主会员"],
				activeIndex: 0,
				reportedActiveImg: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/reported_active_bg.png",
				reportedImg: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/reported_bg.png',
				listArr: [],
				isMore: 'more',
				requesting: false,
				hasReport: 0,
				hasInstall: 0,
				params: {
					pageNum: 1,
					pageSize: 10,
					reportedPhone: '',
				}
			}
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.params.reportedPhone = JSON.parse(userInfo).mobile
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
					console.log(this.params);
					var res = await ship.postRequest("/dw/reported/get_by_phone", this.params);
					console.log(res)
					uni.hideLoading();
					uni.stopPullDownRefresh();
					this.requesting = false;
					if (res.retCode == "0000000") {
						this.listArr = res.rspBody.items;
						this.hasReport = res.rspBody.total;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					this.requesting = false;
					uni.hideLoading();
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			async more() {
				this.params.pageNum ++
				try{
					var res = await ship.postRequest("/dw/reported/get_by_phone", this.params);
					console.log(res)
					uni.hideLoading();
					uni.stopPullDownRefresh();
					this.requesting = false;
					if (res.retCode == "0000000") {
						this.listArr = this.listArr.concat(res.rspBody.items);
						this.hasReport = res.rspBody.total;
						this.isMore = res.rspBody.items.length < this.params.pageSize ? 'noMore' : 'more'
					} else {
						this.isMore = "more";
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					this.requesting = false;
					this.isMore = "more";
					uni.hideLoading();
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			showDate(date) {
				if (!date) return "";
				var da = date.replace(/-/g, "/");
				var nowDate = new Date(da);
				return utils.dateFormat("YY-mm-dd HH:MM",nowDate)
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
		.tips {
			margin-top: 20rpx;
			width: calc(100vw - 72rpx);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.tips-item {
				font-size: 36rpx;
				color: rgba(51, 51, 51, 1);
				font-weight: 500;
			}
		}
		.list-item {
			margin-top: 24rpx;
			height: 160rpx;
			width: calc(100vw - 72rpx);
			border-radius: 24rpx;
			box-shadow: 0 0 34rpx 0 rgba(0,0,0,0.0600);
			display: flex;
			flex-direction: column;
			padding: 0 40rpx;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			.row {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				width: calc(100vw - 152rpx);
				&.row-first {
					margin-bottom: 14rpx;
				}
				.name {
					font-size: 40rpx;
					color: rgba(51, 51, 51, 1);
					font-weight: 600;
					line-height: 40rpx;
				}
				.status {
					font-size: 32rpx;
					color: rgba(51, 51, 51, 1);
					font-weight: 500;
					line-height: 40rpx;
				}
				.phone {
					font-size: 32rpx;
					color: rgba(51, 51, 51, 1);
					font-weight: 400;
					line-height: 32rpx;
				}
				.date {
					font-size: 24rpx;
					color: #666666;
					font-weight: 400;
					line-height: 24rpx;
					
				}
			}
		}
	}
</style>