<template>
	<view class="chooseWaybill">
		<view class="searchBox" v-if="!noData">
			<view class="searchInputBox">
				<image class="searchIcon" src="../../../../static/images/goodsDelivery/search.png"></image>
				<input class="searchInput" v-model="searchVal" placeholder="运单号搜索" placeholder-style="font-size: 28rpx;color: #AAAAAA;" />
			</view>
			<view class="searchHint">您的哪个运单出现了问题？</view>
		</view>
		
		<view class="orderListBox" v-for="(item, index) in listData" :key="index" @click="toSendAbnormal()">
			<view class="orderHead" :style="showOrderStatusBc()">
				<view class="waybillNumBox">
					<view class="waybillNum">货源号：HY202106110001</view>
					<image class="orderHeadIcon" src="../../../../static/images/goodsDelivery/orderListIcon.png"></image>
				</view>
				<view class="payDone" v-if="selectFlag == 4">支付完成</view>
			</view>
			<view class="orderBody">
				<view class="orderDriverBox">
					<view class="driverMsg">
						<view class="title">夏治理</view>
						<image class="msgIcon" style="margin-right: 8rpx;" src="../../../../static/images/goodsDelivery/start.png"></image>
						<view class="msg">4.9</view>
						<image class="msgIcon" src="../../../../static/images/goodsDelivery/phone.png"></image>
					</view>
					<view class="driverMsg">
						<text class="subTitle">豫Q01B69</text>
						<text class="msg">6.9米</text>
						<text class="msg">高栏</text>
					</view>
				</view>
				<view class="orderContentBox">
					<view class="orderAddressBox">
						<view class="addressMsg">武汉-洪山</view>
						<view class="orderStatus">
							<image class="statusIcon" src="../../../../static/images/goodsDelivery/ongoing.png"></image>
							<view class="statusMsg">已确认用车</view>
						</view>
						<view class="addressMsg">重庆-高明</view>
					</view>
					<view class="orderGoods">
						<view class="goodsMsg">
							<view class="msgBox">
								<text class="title">装货时间：</text>
								<text class="msg">2021-06-11  19:43</text>
							</view>
							<view class="msgBox">
								<text class="title">货物信息：</text>
								<text class="msg">大闸蟹 10吨 10方</text>
							</view>
						</view>
						<view class="goodsPrice">¥2045</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="onLoadBox" v-show="noMore">没有更多记录啦～</view>
		<view class="noData" v-if="noData">
			<image class="icon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/noComplaints.png"></image>
			<view class="msg">暂无运单哦～</view>
			<view class="hint">感谢您选择货运中国</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	export default {
		data() {
			return {
				selectFlag: 4,
				listData: [{
					val: 1
				}, {
					val: 1
				}, {
					val: 1
				}, {
					val: 1
				}, {
					val: 1
				}, {
					val: 1
				}],
				noData: false,
				noMore: false,
				searchVal: ''
			}
		},
		methods: {
			
			showOrderStatusBc() { // 根据不同的订单状态展示不同的头部颜色
				if(this.selectFlag == 5) {
					return 'background: linear-gradient(-180deg, #AAAAAA 0%, #777777 100%);';
				}else {
					return 'background: linear-gradient(-180deg, #74C1FD 0%, #4AA2F3 100%);';
				}
			},
			toSendAbnormal() { //上报异常
				uni.navigateTo({
					url: '../../waybill/sendAbnormal/sendAbnormal'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.chooseWaybill {
		min-height: 100vh;
		padding-top:216rpx;
		padding-bottom:20rpx;
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
			.searchHint {
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
				line-height: 50rpx;
				margin: 36rpx 0 0 48rpx;
			}
		}
		.orderListBox + .orderListBox {
			margin-top:20rpx;
		}
		.orderListBox {
			margin-left:16rpx;
			margin-right:16rpx;
			.orderHead {
				height: 78rpx;
				display: flex;
				justify-content: space-between;
				border-radius: 24rpx 24rpx 0px 0px;
				padding-bottom:10rpx;
				.waybillNumBox {
					flex: 1;
					height: 78rpx;
					padding:0 32rpx;
					display: flex;
					align-items: center;
					.waybillNum {
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 34rpx;
					}
					.orderHeadIcon {
						width: 22rpx;
						height: 22rpx;
						margin:0 0 0 16rpx;
					}
				}
				.payDone {
					background: linear-gradient(180deg, #6CE3AD 0%, #4DD0A1 100%);
					border-radius: 24rpx 24rpx 0px 0px;
					padding: 0 30rpx;
					font-size: 24rpx;
					height: 78rpx;
					line-height: 78rpx;
					color: #FFFFFF;
				}
			}
			.orderBody {
				background-color: #FFF;
				box-shadow: 0px 0px 18rpx 0px rgba(0,0,0,0.19);
				border-radius: 12rpx;
				margin-top:-10rpx;
				.orderDriverBox {
					padding: 40rpx 18rpx 38rpx 18rpx;
					margin: 0 30rpx;
					border-bottom: 2rpx solid #F2F3F3;
					.driverMsg {
						height: 44rpx;
						display: flex;
						align-items: center;
						.title {
							font-size: 32rpx;
							color:#333;
							font-weight: bold;
						}
						.subTitle {
							font-size: 28rpx;
							color:#333;
							font-weight: bold;
							margin-right: 32rpx;
						}
						.msg + .msg {
							margin-left: 32rpx;
						}
						.msg {
							font-size: 28rpx;
							color:#888;
						}
						.msgIcon {
							height: 28rpx;
							width: 28rpx;
							margin-left: 32rpx;
						}
					}
				}
				.orderContentBox {
					padding: 32rpx;
					.orderAddressBox {
						padding: 0 32rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.orderStatus {
							width:120rpx;
							.statusIcon {
								width:88rpx;
								height: 16rpx;
								margin:0 16rpx 8rpx 16rpx;
							}
							.statusMsg {
								font-size: 20rpx;
								font-weight: 400;
								color: #777;
								text-align: center;
							}
						}
						.addressMsg {
							font-size: 32rpx;
							font-weight: 400;
							color: #333333;
						}
					}
					.orderGoods {
						padding-top:32rpx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						.goodsMsg {
							flex: 1;
							.msgBox + .msgBox {
								margin-top: 24rpx;
							}
							.msgBox {
								line-height: 34rpx;
								.title {
									font-size: 24rpx;
									font-weight: 400;
									color: #777;
								}
								.msg {
									font-size: 24rpx;
									font-weight: 400;
									color: #333;
								}
							}
						}
					}
					.goodsPrice {
						text-align: right;
						font-size: 48rpx;
						font-weight: 500;
						color: #F29347;
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
	}
</style>
