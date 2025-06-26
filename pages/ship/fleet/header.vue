<template>
	<view class="top">
		<view :style="{height: statusBarHeight*2 + 'rpx'}" />
		<view class="sendBox" />
		<view class="tabs">
			<view v-for="(item, index) in tabsTitle" :id="index">
				<!-- <text>{{item}}</text> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "FleetHeader",
		props: {
			
		},
		data() {
			return {
				tabIndex: 0,
				tabsTitle: ["平台车队", "物流车队", "创建的车队", "加入的车队"],
				statusBarHeight: 0,
			}
		},
		created() {
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight;
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.sendBox {
		height: 40rpx;
	}
	.top {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 550rpx;
		background: linear-gradient(360deg, #1E52C4 0%, #497FFB 100%);
		.tabs {
			padding: 0 32rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			color: #C8D4EF;
		}
	}
</style>
