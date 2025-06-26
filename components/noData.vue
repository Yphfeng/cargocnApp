<template>
	<view class="noData">
		<image src="../static/images/goodsDelivery/noDataIcon.png" class="noDataImg"></image>
		<text class="noDataText">{{text}}</text>
	</view>
</template>

<script>
	export default {
		name:"noData",
		props: {
			text: {
				type: String,
				default: '暂无数据'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
	.noData {
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.noDataImg {
		width: 400rpx;
		height: 400rpx;
	}
	.noDataText {
		padding-top: 20rpx;
		font-size: 28rpx;
		color: #666666;
	}
</style>
