<template>
	<view class="complaintsRecord">
		<view class="searchBox" v-if="!noData">
			<view class="searchInputBox">
				<image class="searchIcon" src="../../../../static/images/goodsDelivery/search.png"></image>
				<input class="searchInput" v-model="searchVal" placeholder="运单号搜索" placeholder-style="font-size: 28rpx;color: #AAAAAA;" />
			</view>
		</view>
		<view class="complaintsList" v-if="!noData" v-for="item in 10" @click="toComplaintsDetails()">
			<view class="title">运单号：Y1231231234</view>
			<view class="content">
				<view class="msg">货物损失</view>
				<view class="details">
					<view class="time">发起2020-08-12 13:16</view>
					<view class="status">已提交</view>
				</view>
			</view>
		</view>
		<view class="onLoadBox" v-show="noMore">没有更多记录啦～</view>
		<view class="noData" v-if="noData">
			<image class="icon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/noComplaints.png"></image>
			<view class="msg">暂无投诉申请记录哦～</view>
			<view class="hint">感谢您选择货运中国</view>
		</view>
		<view class="toComplaints" @click="toChooseWaybill()">我要投诉</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	export default {
		data() {
			return {
				noData: false,
				noMore: false,
				searchVal: ''
			}
		},
		methods: {
			toChooseWaybill() { // 选择运单
				if(!utils.btnRepeat()) return false; // 防抖
				uni.navigateTo({
				    url: './chooseWaybill'
				});
			},
			toComplaintsDetails() { // 选择运单
				if(!utils.btnRepeat()) return false; // 防抖
				uni.navigateTo({
				    url: './complaintsDetails'
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.complaintsRecord {
		min-height: 100vh;
		padding-top:130rpx;
		padding-bottom:134rpx;
		box-sizing:border-box;
		.searchBox {
			position: fixed;
			top: 0;
			width:100vw;
			z-index: 999;
			background-color: #FFF;
			padding: 0 0 36rpx 0;
			.searchInputBox {
				margin: 0 32rpx;
				padding: 0 20rpx;
				background: #F0EFEF;
				border-radius: 35rpx;
				height: 70rpx;
				display: flex;
				align-items: center;
				.searchIcon {
					width: 36rpx;
					height: 36rpx;
					margin-right:26rpx;
				}
				.searchInput {
					flex: 1;
					height: 40rpx;
					font-size: 28rpx;
					color:#333;
				}
			}
		}
		.complaintsList + .complaintsList {
			margin-top: 24rpx;
		}
		.complaintsList {
			margin-left:16rpx;
			margin-right:16rpx;
			padding-left:24rpx;
			border:12rpx;
			background-color: #FFF;
			.title {
				padding:20rpx 40rpx 20rpx 0;
				font-size: 26rpx;
				font-weight: bold;
				color: #333333;
				line-height: 36rpx;
				border-bottom: 2rpx solid #EDEDED;
			}
			.content {
				padding:30rpx 40rpx 34rpx 0;
				.msg {
					font-size: 34rpx;
					font-weight: bold;
					color: #333333;
					line-height: 48rpx;
				}
				.details {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top:2rpx;
					.time {
						font-size: 24rpx;
						font-weight: 500;
						color: #AAAAAA;
						line-height: 34rpx;
					}
					.status {
						font-size: 28rpx;
						font-weight: bold;
						color: #4AA2F3;
						line-height: 40rpx;
					}
				}
			}
		}
		.onLoadBox {
			font-size: 28rpx;
			font-weight: 500;
			color: #AAAAAA;
			line-height: 40rpx;
			text-align: center;
			margin-top:48rpx;
		}
		.noData {
			padding-top:200rpx;
			.icon {
				width: 244rpx;
				height: 256rpx;
				display: block;
				margin: 0 auto;
			}
			.msg {
				font-size: 42rpx;
				font-weight: 500;
				color: #333333;
				line-height: 58rpx;
				text-align: center;
				margin: 92rpx 0 8rpx 0;
			}
			.hint {
				font-size: 28rpx;
				font-weight: 500;
				color: #AAAAAA;
				line-height: 40rpx;
				text-align: center;
			}
		}
		.toComplaints {
			width: 640rpx;
			border-radius: 44rpx;
			height: 90rpx;
			line-height: 90rpx;
			box-shadow:  0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
			background-color: #4AA2F3;
			position: fixed;
			bottom: 24rpx;
			left:55rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
