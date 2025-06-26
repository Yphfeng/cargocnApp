<template>
	<view class="newHeader" :style="{'padding-top': paddingTop}">
		<view :style="{height: statusBarHeight}" />
		<view class="headBox">
			<i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777777; font-size: 27px;"></i>
			{{title}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"CommonHead",
		props: {
			title: {
				type: String,
				default: '去报价'
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				paddingTop: 0
			}
		},
		mounted() {
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			var paddingTop = statusBarHeight
			this.statusBarHeight = statusBarHeight + 'rpx'
			this.paddingTop = paddingTop + 'rpx'
		},
		methods: {
			backToFromPage() {
				uni.navigateBack({
					delta:1
				})
			}
			
		}
	}
</script>

<style scoped lang="scss">
.newHeader {
	width: 750rpx;
	position: fixed;
	top: 0;
	left: 0;
	background-color: #FFFFFF;
	z-index: 99;
	.headBox {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size:32rpx;
		color:#333333;
		font-weight: 500;
		.uniIcon {
			position: absolute;
			left:40rpx;
			bottom: 20rpx;
		}
	}
}
</style>
