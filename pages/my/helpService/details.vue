<template>
	<view class="all">
		<view class="title">
			<view class="title-child">{{title}}</view>
		</view>
		<view class="content-box">
			<view class="content-child" v-for="item in items">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				content: {},
				title: '',
				items: [],
			}
		},
		onLoad(options) {
			this.content = JSON.parse(options.map)
			this.title = this.content.title;
			if(Array.isArray(this.content.content)) {
				this.items = this.content.content;
			} else{
				this.items[0] = this.content.content;
			}
		}
	}
</script>

<style lang="scss">
	.all{
		border-top: 10rpx solid #f2f2f2;
		padding: 0 26rpx;
		.title{
			height: 122rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #EAEAEA;
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			.title-child{
				padding: 0 14rpx;
			}
		}
		.content-box{
			padding: 22rpx 4rpx;
			.content-child{
				line-height: 42rpx;
				font-size: 30rpx;
			}
		}
	}
</style>
