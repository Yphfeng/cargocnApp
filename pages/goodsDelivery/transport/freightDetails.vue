<template>
	<view class="costInformation">
		<view class="contentBox">
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">提货费</view>
					<!-- <view class="syb">*</view> -->
				</view>
				<view class="rightContent">
					<view class="priceInput">{{costA}}</view>
					<view class="priceSyb">元</view>
				</view>
			</view>
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">送货费</view>
				</view>
				<view class="rightContent">
					<view class="priceInput">{{costC}}</view>
					<view class="priceSyb">元</view>
				</view>
			</view>
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">运费</view>
				</view>
				<view class="rightContent">
					<view class="priceInput">{{costB}}</view>
					<view class="priceSyb">元</view>
				</view>
			</view>
			<view class="contentRow flexRow" v-for="item in costList">
				<view class="leftTitle">
					<view class="msg">{{item.name}}</view>
				</view>
				<view class="rightContent">
					<view class="priceInput">{{item.price}}</view>
					<view class="priceSyb">元</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				costA: '', //提货费
				costB: '', //运费
				costC: '', //送货费
				costList: [],
			};
		},
		onLoad(options) {
			this.costA = options.costA;
			this.costB = options.costB;
			this.costC = options.costC;
			this.costList = JSON.parse(options.costList);
			console.log(this.costList);
		},
		onShow() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.costInformation {
		padding-bottom:134rpx;
		.contentBox {
			margin: 16rpx 16rpx 0 16rpx;
			padding: 0 42rpx 0 42rpx;
			background: #FFFFFF;
			border-radius: 12rpx;
			.flexRow {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.contentRow + .contentRow {
				border-top: 2rpx solid #F2F3F3;
			}
			.contentRow {
				padding: 30rpx 0 30rpx 0;
				.leftTitle {
					display: flex;
					.msg {
						font-size: 28rpx;
						color: #707071;
						line-height: 40rpx;
					}
					.syb {
						color:#FF3838;
						font-size: 32rpx;
						padding-left:8rpx;
						font-weight:bold;
					}
					.customInput{
						width: 160rpx;
						height: 56rpx;
						background: #F4F4F4;
						border-radius: 12rpx;
						font-size: 28rpx;
						color:#333;
						padding: 0 10rpx;
					}
				}
				.selectChecked {
					background: #E0EFFD;
					border: 2rpx solid #4AA2F3;
					color: #4AA2F3;
				}
				.selectDefault {
					border: 2rpx solid #C2C2C9;
					color: #777777;
				}
				.selectBtn {
					border-radius: 8rpx;
					height: 52rpx;
					line-height: 52rpx;
					font-size: 28rpx;
					padding: 0 32rpx;
				}
				.rightContent {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					.rightSelect + .rightSelect {
						margin-left: 20rpx;
					}
					.priceInput {
						width: 160rpx;
						height: 56rpx;
						line-height: 56rpx;
						background: #F4F4F4;
						border-radius: 12rpx;
						font-size: 28rpx;
						color:#333;
						text-align: center;
						padding: 0 10rpx;
					}
					.priceSyb {
						height: 56rpx;
						line-height: 56rpx;
						margin-left: 24rpx;
						font-size: 28rpx;
						color: #707071;
					}
					.listBtn:nth-child(3n) {
						margin-right:0;
					}
					.listBtn {
						width: 152rpx;
						margin-top:20rpx;
						margin-right:82rpx;
						.selectBtn {
							text-align: center;
						}
					}
				}
			}
		}
		.saveBtn {
			position: fixed;
			bottom: 24rpx;
			left:60rpx;
			right:60tpx;
			width: 630rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius:44rpx;
			background-color: #4AA2F3;
			box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
</style>
