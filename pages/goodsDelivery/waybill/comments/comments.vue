<template>
	<view>
		<view class="box">
			<view class="title">
				<view class="driverAvatar">
					<view class="avatarBox">
						<image class="avatar" src="../../../../static/logo.png"></image>
					</view>
					<view class="driverLevelBox">
						<image class="driverBadge" src="../../../../static/images/goodsDelivery/driverBadge.png"></image>
					</view>
				</view>
				<view class="text">
					夏师傅
				</view>
				<view class="startWhole">
					<image src="../../../../static/images/goodsDelivery/start.png" class="start"></image>
					<text>4.9</text>
				</view>
			</view>
			<view class="subBoxTitle">
				<view class="subQus">
					您对司机的服务是否满意？
				</view>
				<view class="qusItem">
					司机态度差
				</view>
				<view class="qusItem">
					货物受损
				</view>
			</view>
			<view class="starList">
				<view class="starItem">
					<image src="../../../../static/images/goodsDelivery/start.png" class="starIcon" mode="aspectFit"></image>
				</view>
				<view class="starItem">
					<image src="../../../../static/images/goodsDelivery/unStart.png" class="starIcon" mode="aspectFit"></image>
				</view>
				<view class="starItem">
					<image src="../../../../static/images/goodsDelivery/unStart.png" class="starIcon" mode="aspectFit"></image>
				</view>
				<view class="starItem">
					<image src="../../../../static/images/goodsDelivery/unStart.png" class="starIcon" mode="aspectFit"></image>
				</view>
				<view class="starItem last">
					<image src="../../../../static/images/goodsDelivery/unStart.png" class="starIcon" mode="aspectFit"></image>
				</view>
			</view>
			<view class="starRel">
				不满意
			</view>
			<view class="textArea">
				<textarea class="textAreaContent" placeholder="有什么想法就说出来吧…">
				</textarea>
				<view class="areaBottom">
					<view class="upFileWhole">
						<image src="../../../../static/images/goodsDelivery/carame.png" class="carameImg"></image>
						<text class="carameText">添加照片/视频</text>
						<view class="tips">0/3</view>
					</view>
					<view class="extra">0/200</view>
				</view>
			</view>
		</view>
		<view class="fix-bottom">
			<view class="sendBtn">
				提交
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
	.box {
		background-color: rgba(255, 255, 255, 1);
		border-radius: 12rpx;
		margin: 40rpx 16rpx;
		padding: 32rpx;
		.title {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			.text {
				font-size: 28rpx;
				color: rgba(51, 51, 51, 1);
				font-weight: bold;
				margin-right: 24rpx;
			}
			.startWhole {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				color: rgba(136, 136, 136, 1);
				font-size: 28rpx;
				.start {
					width: 28rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}
			}
		}
		.subBoxTitle {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			margin-top: 20rpx;
			.subQus {
				font-size: 24rpx;
				color: rgba(119, 119, 119, 1);
				margin-right: 8rpx;
			}
			.qusItem {
				color: rgba(242, 147, 71, 1);
				font-size: 20rpx;
				border-radius: 20rpx;
				border: 1px solid rgba(242, 147, 71, 1);
				padding: 6rpx 20rpx;
				margin-right: 20rpx;
				
			}
		}
		.starList {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin: 60rpx 0 24rpx;
			.starItem {
				margin-right: 48rpx;
				&.last {
					margin-right: 0;
				}
			}
			.starIcon {
				width: 60rpx;
				height: 62rpx;
			}
		}
		.starRel {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			color: rgba(242, 147, 71, 1);
			font-size: 24rpx;
			margin-bottom: 32rpx;
		}
		.textArea {
			background-color: rgba(249, 250, 249, 1);
			border-radius: 12rpx;
			height: 416rpx;
			padding: 32rpx;
			font-size: 24rpx;
			display: flex;
			flex-direction: column;
			.textAreaContent {
				flex: 1;
			}
			.areaBottom {
				height: 180rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;
				.upFileWhole {
					width: 180rpx;
					height: 180rpx;
					border-radius: 12rpx;
					border: 1px dashed rgba(151, 151, 151, 1);
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 20rpx;
					color: rgba(170, 170, 170, 1);
					position: relative;
					.tips {
						position: absolute;
						right: 8rpx;
						bottom: 8rpx;
						color: rgba(170, 170, 170, 1);
						font-size: 20rpx;
					}
				}
				.carameImg {
					width: 44rpx;
					height: 42rpx;
				}
				.extra {
					font-size: 24rpx;
					color: rgba(170, 170, 170, 1);
				}
			}
		}
	}
	.driverAvatar {
		width:70rpx;
		padding-right:30rpx;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.avatarBox {
			width:70rpx;
			height: 70rpx;
			box-shadow: 0px 0px 12rpx 0px rgba(0,0,0,0.24);
			border-radius:100%;
			overflow: hidden;
			.avatar {
				width:70rpx;
				height: 70rpx;
			}
		}
		.driverLevelBox {
			width:135rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			margin-top: -10rpx;
			.driverBadge {
				width:26rpx;
				height: 20rpx;
			}
		}
	}
	.fix-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #FFFFFF;
		height: 136rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.sendBtn {
			margin: 0 52rpx;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #4AA2F3;
			box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
			color: #FFFFFF;
			height: 104rpx;
			border-radius: 44rpx;
		}
	}
</style>
