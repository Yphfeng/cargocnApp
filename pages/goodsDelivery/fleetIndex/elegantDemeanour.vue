<template>
	<view class="elegantDemeanour">
		<view class="elegantBox">
			<view class="elegantList" v-for="(item, index) in imgAry" :key="index" @click="prevImage(index)">
				<image class="listImg" :src="item.fleetImage"></image>
			</view>
		</view>
		
		<view class="loadingBox" v-show="noData">
			<image class="noDataIcon" src="/static/images/vehicleOptions/newNodata.png"></image>
		</view>
		<view class="loadingBox" v-show="noData">
			当前车队暂无图片～
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship.js";
	export default {
		data() {
			return {
				imgAry: [],
				noData: false
			};
		},
		onLoad(options) {
			let fleetId = options.id
			this.fetchFleetPic(fleetId);
		},
		methods: {
			fetchFleetPic(fleetId) {
				uni.showLoading();
				var that = this;
				ship.newQueryPostRequest("/cd/fleetImage/list", { fleetId: fleetId, verifyStatuses: [1, 3] })
				.then(res=>{
					console.log('车队风采', res);
					if(res.retCode == "0000000"){
						that.imgAry = res.rspBody;
						if(!that.imgAry || that.imgAry.length == 0) {
							that.noData = true;
						}
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.hideLoading();
					console.log('请求失败', err);
				})
			},
			prevImage(index) {
				var fleetImageArr = [];
				this.imgAry.map(val=>{
					fleetImageArr.push(val.fleetImage)
				})
				uni.previewImage({
					current: index,
					urls: fleetImageArr
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #FAFAFA;
	}
	.elegantDemeanour {
		.elegantBox {
			padding: 40rpx 34rpx;
			display: flex;
			flex-wrap: wrap;
			.elegantList:nth-child(3n) {
				margin-right:0;
			}
			.elegantList {
				width: 186rpx;
				height: 246rpx;
				margin-right: 62rpx;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				.listImg {
					max-width: 186rpx;
					max-height: 246rpx;
				}
			}
		}
		
		.loadingBox {
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.noDataIcon {
				width: 252rpx;
				height: 252rpx;
				margin-top:50rpx;
			}
		}
	}
</style>
