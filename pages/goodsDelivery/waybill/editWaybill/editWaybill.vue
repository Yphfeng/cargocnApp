<template>
	<view catchtouchmove="true">
		<view class="orderListBox">
		
			<view class="orderBox">
				<view class="boxTitle">
					<view class="title">
						运费
					</view>
					<view class="subTitle">
						<text>查看明细</text>
						<image class="rightIcon" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
					</view>
				</view>
				<view class="boxTitle">
					<view class="title">
						<image class="waybillAddr" src="../../../../static/images/goodsDelivery/waybillAddr.png"></image>
					</view>
					<view class="subTitle">
						<text>上海-徐汇</text>
						<image src="../../../../static/images/goodsDelivery/notOngoing.png" class="locationShow"></image>
						<text>武汉-武昌</text>
					</view>
				</view>
				<view class="boxTitle">
					<view class="title">
						总金额
					</view>
					<view class="title">
						5000元
					</view>
				</view>
				<view class="subBoxTitle">
					<view class="subBoxItem">
						<text>运费</text>
						<text>5000元</text>
					</view>
					<view class="subBoxItem last">
						<text>平台服务费</text>
						<text>45元</text>
					</view>
					<view class="line" />
					<view class="subBoxItem">
						<text>已支付司机运费</text>
						<text>5000元</text>
					</view>
					<view class="subBoxItem last">
						<text>待支付司机</text>
						<text>45元</text>
					</view>	
				</view>
				<view class="payTotal">
					<view class="payTotalText">
						<text class="payText">支付司机运费修改为</text>
						<text class="payMoneyText">5000</text>
						<text class="payText">元</text>
						<image src="../../../../static/images/goodsDelivery/tips.png" class="tipsImg"></image>
					</view>
					<view class="tips">
						总金额6045元：6000元运费+45元平台服务费
					</view>
				</view>
				
			</view>
		</view>
		<view class="fix-bottom">
			
			<view class="fixItem pay">
				<view class="pay" @click="payWaybill()">
					确认修改为500.00元
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageArr: [1, 2, 3, 4],
				trackArr: [
					{isSected: true},
					{isSected: false}
				],
			}
		},
		onLoad() {
			this.mainHeight = uni.getSystemInfoSync().windowHeight - 144;
			console.log(this.mainHeight, '屏幕的高度')
		},
		methods: {
			payWaybill() {
				//支付运费
				uni.navigateTo({
					url: '../waybillPay/waybillPay'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.rightIcon {
		width: 25rpx;
		height: 25rpx;
	}
	.fix-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 136rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		background-color: #FFFFFF;
		.fixItem {
			width: 100%;
			padding: 0 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
			.pay {
				height: 96rpx;
				flex: 1;
				background-color: #4AA2F3;
				font-weight: bold;
				border-radius: 48rpx;
				color: #FFFFFF;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				
			}
		}
	}
	.orderBox {
		border-radius: 12rpx;
		background-color: #FFFFFF;
		padding: 32rpx 24rpx;
		margin-bottom: 20rpx;
		.payTotal {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-end;
			padding-right: 40rpx;
			.payTotalText {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				align-items: center;
				.payText {
					font-size: 28rpx;
					color: #222222;
					font-weight: bold;
				}
				.payMoneyText {
					color: #F29347;
					font-size: 56rpx;
					margin: 0 36rpx;
				}
				.tipsImg {
					width: 26rpx;
					height: 26rpx;
					padding-left: 16rpx;
				}
			}
			
			
		}
		.tips {
			font-size: 20rpx;
			color: #777777;
			background-color: #F3F3F3;
			padding: 5rpx 20rpx;
		}
		.infoExtra {
			display: flex;
			flex-direction: row;
			.extra {
				flex: 1;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				padding-left: 20rpx;
			}
			.other {
				font-size: 22rpx;
				color: #777777;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				.iconRight {
					width: 25rpx;
					height: 25rpx;
				}
			}
			.extraItem {
				border: 1px solid #7F7F7F;
				border-radius: 12rpx;
				width: 86rpx;
				height: 36rpx;
				font-size: 22rpx;
				color: #333333;
				text-align: center;
				margin-right: 20rpx;
			}
		}
		.info {
			display: flex;
			flex-direction: row;
			.info-icon {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				margin-top: 40rpx;
				.zhuang, .xie {
					padding:  4rpx 6rpx;
					color: #fff;
					font-size: 28rpx;
				}
				.zhuang {
					background-color: #4AA2F3;
					margin-bottom: 20rpx;
				}
				.xie {
					background-color: #F29347;
					margin-top: 20rpx;
				}
				.icon-box {
					width: 6rpx;
					height: 6rpx;
					background-color: #F2F3F3;
					margin:  5rpx 0;
					
				}
			}
			.info-content {
				flex: 1;
				margin-left: 20rpx;
				.title {
					color: #222222;
					font-weight: bold;
					.name {
						font-size: 32rpx;	
					}
					.phone {
						font-size: 30rpx;
						margin-left: 48rpx;
					}
				}
				.subTitle {
					margin-top: 28rpx;
					font-size: 26rpx;
					color: #777777;
					padding-bottom: 26rpx;
					margin-bottom: 24rpx;
					border-bottom: 1px solid #F2F3F3;
					&.last {
						border-bottom: 0;
						display: flex;
						flex-direction: column;
					}
					
				}
			}
		}
		.boxImgWhole {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.boxItem {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.boxImage {
					width: 148rpx;
					height: 128rpx;
					background-color: #C0C0C0;
				}
				.imgText {
					font-size: 26rpx;
					color: #777777;
					margin-top: 22rpx;
				}
				
			}
		}
	}
	.subBoxTitle {
		flex-direction: column;
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;
		.subBoxItem {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 24rpx;
			color: #777777;
			margin-bottom: 10rpx;
			&.last {
				margin-bottom: 0;
			}
		}
		.line {
			height: 2rpx;
			background-color: #F2F3F3;
			margin-bottom: 32rpx;
			margin-top: 24rpx;
		}
	}
	.boxTitle {
		flex-direction: row;
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		&.last {
			margin-bottom: 0;
		}
		.title {
			font-size: 32rpx;
			color: #222222;
			font-weight: bold;
			.waybillAddr {
				width: 100rpx;
				height: 25rpx;
			}
		}
		.subTitle {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			color: #777777;
			.rightIcon {
				margin-left: 8rpx;
			}
			.locationShow {
				width: 42rpx;
				height: 10rpx;
				margin: 0 10rpx;
			}
		}
	}
	.orderListBox {
		animation: showList 0.3s;
		margin:20rpx 16rpx 0 16rpx;
		padding-bottom: 144rpx;
		.orderHead {
			height: 78rpx;
			padding:0 32rpx;
			border-radius: 24rpx 24rpx 0px 0px;
			font-size: 28rpx;
			color:#FFF;
			display: flex;
			align-items: center;
			padding-bottom:10rpx;
			background: linear-gradient(-180deg, #74C1FD 0%, #4AA2F3 100%);
			.orderHeadIcon {
				width: 22rpx;
				height: 22rpx;
				margin:0 0 0 16rpx;
			}
		}
		.orderBody {
			background-color: #FFF;
			box-shadow: 0px 0px 18rpx 0px rgba(0,0,0,0.19);
			border-radius: 12rpx;
			margin-top:-10rpx;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
			.driverTitle {
				color: #222222;
				font-size: 32rpx;
				font-weight: bold;
				padding: 32rpx 24rpx 18rpx;
			}
			.orderDriverBox {
				margin: 0 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.driverMsgBox {
					.driverMsg, .carMsg {
						.title {
							font-size: 28rpx;
							color:#333;
							font-weight: bold;
						}
						.subTitle {
							font-size: 28rpx;
							color:#333;
							font-weight: bold;
							margin-right: 32rpx;
						}
						.msg {
							font-size: 26rpx;
							color:#888;
							margin-left:10rpx;
						}
						.msgIcon {
							height: 28rpx;
							width: 28rpx;
						}
					}
					.driverMsg {
						height: 44rpx;
						display: flex;
						align-items: center;
					}
					.carMsg {
						margin-top: 12rpx;
						height: 40rpx;
						display: flex;
						align-items: center;
						.msg + .msg {
							margin-left:20rpx;
						}
					}
				}
				.driverAvatar {
					width:88rpx;
					padding-right:30rpx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					.avatarBox {
						width:88rpx;
						height: 88rpx;
						box-shadow: 0px 0px 12rpx 0px rgba(0,0,0,0.24);
						border-radius:100%;
						overflow: hidden;
						.avatar {
							width:88rpx;
							height: 88rpx;
						}
					}
					.driverLevelBox {
						width:135rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						margin-top: -22rpx;
						.driverBadge {
							width:57rpx;
							height: 45rpx;
						}
						.level {
							width:135rpx;
							height: 39rpx;
							line-height: 39rpx;
							text-align: center;
							font-size:24rpx;
							color:#FFF;
							transform: scale(0.667);
							border-radius: 13rpx;
							background: linear-gradient(180deg, #CEE5F9 0%, #8AA9CC 100%);
							box-shadow: 0px 0px 6rpx 0px rgba(0,0,0,0.1);
							margin-top: -8rpx;
						}
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
						font-size: 20rpx;
						font-weight: 400;
						color: #777;
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
						.msgBox + .msgBox {
							margin-top: 10rpx;
						}
						.msgBox {
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
					.goodsPrice {
						text-align: right;
						font-size: 48rpx;
						font-weight: 500;
						color: #F29347;
					}
				}
			}
		}
	}
	.listLoadingBox {
		height: 48rpx;
	}
</style>
