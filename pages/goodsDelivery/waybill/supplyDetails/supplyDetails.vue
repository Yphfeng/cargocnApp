<template>
	<view>
		<view class="orderBox">
			<view class="info">
				<view class="info-icon">
					<view class="zhuang">装</view>
					<view class="icon-box" />
					<view class="icon-box" />
					<view class="icon-box" />
					<view class="icon-box" />
					<view class="icon-box" />
					<view class="icon-box" />
					<view class="xie">卸</view>
				</view>
				<view class="info-content">
					<view class="title">
						<view>
							<text class="name">许多鱼</text>
							<text class="phone">166210545635</text>
						</view>
						<view class="">
							<text class="pubDate">7月8日</text>
							<text class="pubTime">12：04发布</text>
						</view>
						
					</view>
					
					<view class="subTitle">
						上海上海市青浦区E通世界B座
					</view>
					<view class="title">
						<view>
							<text class="name">刘云</text>
							<text class="phone last">166210545635</text>
						</view>
					</view>
					<view class="subTitle last">
						<text>上海上海市青浦区E通世界B座</text>
						<text>233E通世界B座</text>
					</view>
				</view>
			</view>
			<view class="supplyItem">
				<image src="../../../../static/images/goodsDelivery/box01.png" class="boxImg"></image>
				<text class="supplyText">绿通大白菜/55方/10吨</text>
			</view>
			<view class="supplyItem02">
				<image src="../../../../static/images/goodsDelivery/box02.png" class="box02Img"></image>
				<view class="supplyWhole">
					<text class="supplyText">平板货车/高栏货车/厢式货车</text>
					<text class="supplyText">8.7/9.7/11.7</text>
					<text class="supplyText">装卸非禁区 装车3小时 卸车2小时</text>
				</view>
			</view>
			<view class="supplyItem03">
				<image src="../../../../static/images/goodsDelivery/box03.png" class="box03Img"></image>
				<view class="supplyWhole03">
					<view class="date">
						<view class="dateItem">
							<view class="dateText">7月8日</view>
							<view class="">
								13:50前
							</view>
						</view>
						<view class="dateItem">
							<view class="dateText">7月8日</view>
							<view class="">
								13:50前
							</view>
						</view>
						<view class="dateItem">
							<view class="dateText">7月8日</view>
							<view class="">
								13:50前
							</view>
						</view>
						<view class="dateItem">
							<view class="dateText">7月8日</view>
							<view class="">
								13:50前
							</view>
						</view>
					</view>
					<view class="line">
						<view class="text">
							装
						</view>
						<view class="dot">
							<view class="dotText">
								1小时装车
							</view>
						</view>
						<view class="text">
							发
						</view>
						<view class="dot">
							
						</view>
						<view class="text">
							抵
						</view>
						<view class="dot">
							<view class="dotText">
								2小时卸车
							</view>
						</view>
						<view class="text">
							卸
						</view>
						
					</view>
				</view>
			</view>
			<view class="supplyItem">
				<image src="../../../../static/images/goodsDelivery/box04.png" class="boxImg"></image>
				<text class="supplyText">要求：堆垛3层 带雨布</text>
			</view>
			<view class="supplyItem">
				<image src="../../../../static/images/goodsDelivery/box05.png" class="boxImg"></image>
				<text class="supplyText">备注：这个货物很重，需要妥善运输</text>
			</view>
			<view class="supplyItem">
				<image src="../../../../static/images/goodsDelivery/box06.png" class="boxImg"></image>
				<text class="supplyText">期望：3000元/趟 在线支付</text>
			</view>
			<view class="supplyItem03">
				<image src="../../../../static/images/goodsDelivery/box07.png" class="box03Img"></image>
				<view class="imgArr">
					<view class="imgBox">
						
					</view>
					<view class="imgBox">
						
					</view>
					<view class="imgBox">
						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.orderBox {
		border-radius: 12rpx;
		background-color: #F3F3F3;
		padding: 32rpx 24rpx;
		.info {
			display: flex;
			flex-direction: row;
			border-bottom: 1px solid #777777;
			.info-icon {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				margin-top: 40rpx;
				.zhuang, .xie {
					width: 40rpx;
					height: 40rpx;
					justify-content: center;
					align-items: center;
					display: flex;
					color: #fff;
					font-size: 28rpx;
					border-radius: 12rpx;
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
					background-color: #D7D7D7;
					margin:  5rpx 0;
					
				}
			}
			.info-content {
				flex: 1;
				margin-left: 20rpx;
				.title {
					color: #222222;
					font-weight: bold;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					.name {
						font-size: 32rpx;	
					}
					.phone {
						font-size: 30rpx;
						margin-left: 48rpx;
						&.last {
							margin-left: 84rpx;
						}
					}
					.pubDate {
						font-size: 24rpx;
						font-weight: bold;
						padding-left: 32rpx;
					}
					.pubTime {
						font-size: 24rpx;
						font-weight: bold;
						padding-left: 20rpx;
					}
				}
				.subTitle {
					margin-top: 28rpx;
					font-size: 26rpx;
					color: #777777;
					padding-bottom: 30rpx;
					margin-bottom: 20rpx;
					border-bottom: 1px solid #D7D7D7;
					&.last {
						border-bottom: 0;
						display: flex;
						margin-bottom: 0;
						flex-direction: column;
					}
					
				}
			}
		}
		.supplyItem {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			margin: 30rpx 0;
			.boxImg {
				width: 36rpx;
				height: 34rpx;
			}
			.supplyText {
				font-size: 24rpx;
				color: #777777;
				padding-left: 52rpx;
			}
		}
		.supplyItem02 {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;
			margin-bottom: 30rpx;
			line-height: 1;
			.box02Img {
				width: 44rpx;
				height: 28rpx;
			}
			.supplyWhole {
				display: flex;
				flex-direction: column;
				padding-left: 44rpx;
				font-size: 24rpx;
				color: #777777;
				.supplyText {
					padding-bottom: 10rpx;
				}
			}
		}
		.supplyItem03 {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;
			margin-bottom: 30rpx;
			line-height: 1;
			.box03Img {
				width: 38rpx;
				height: 34rpx;
			}
			.imgArr {
				flex: 1;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				height: 112rpx;
				padding: 0 36rpx;
				.imgBox {
					width: 166rpx;
					height: 112rpx;
					margin-right: 24rpx;
					background-color: #FFFFFF;
				}
			}
			.supplyWhole03 {
				display: flex;
				flex-direction: column;
				width: 100%;
				padding: 0 52rpx 10rpx;
				box-sizing: border-box;
				
				.date {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items:center;
					font-size: 24rpx;
					color: #777777;
					.dateItem {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.dateText {
							padding-bottom: 10rpx;
						}
					}
				}
				.line {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items:center;
					font-size: 20rpx;
					padding: 10rpx 20rpx;
					
					.text {
						background-color: #D8D8D8;
						padding: 8rpx;
						border-radius: 100%;
						color: #777777;
					}
					.dot {
						flex: 1;
						height: 1px;
						background-color: #979797;
						position: relative;
						.dotText {
							position: absolute;
							top: 10rpx;
							left: 0;
							width: 100%;
							justify-content: center;
							align-items: center;
							display: flex;
							color: #777777;
							font-size: 20rpx;
						}
					}
				}
			}
		}
	}
</style>
