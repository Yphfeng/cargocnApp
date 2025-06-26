<template>
	<view class="container-box">
		<image class="container" src="../../../static/images/conTact-img.png"></image>
	</view>
	<!-- <web-view src="https://www.hyzgapp.com/services/hyzgcs.html"></web-view> -->
</template>

<script>
	export default {
		data() {
			return {
				height: 0,
			}
		},
		onLoad() {
			this.height = uni.getSystemInfoSync().windowHeight*2 + 'rpx';
			console.log(this.height, 'assa')
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.container-box{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.container {
		// background-image: url(../../../static/images/conTact-img.png);
		// width: 750rpx;
		// background-size: 100% 100%
		width: 100%;
		height: 100%;
	}
</style>
