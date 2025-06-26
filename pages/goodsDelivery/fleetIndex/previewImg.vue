<template>
	<view class="all">
		<view class="fleet-img-box" v-for="item in imgArr">
			<image class="img-box" :src="item.fleetImage" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				imgArr: [],
			}
		},
		onLoad(options) {
			this.imgArr = options.imgArr?JSON.parse(options.imgArr):[];
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F2F2F2;
	}
	.all{
		.fleet-img-box{
			margin: 0 20rpx 20rpx 20rpx;
			.img-box{
				width: 710rpx;
			}
		}
	}
</style>
