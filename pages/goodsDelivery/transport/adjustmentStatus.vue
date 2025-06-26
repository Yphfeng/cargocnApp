<template>
	<view class="container">
		<view class="title">当前状态：{{statusText}}</view>
		<view class="sub">
			<text class="sub-text">调整为：</text>
			<view class="arrow" @click.stop="showPop">
				<text>{{willText}}</text>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_down.png" class="arrow_down"></image>
				<view class="status" :class="{active: isActive}">
					<view class="item" v-for="item in statusArr" :key="item.id" @click.stop="switchIndex(item)">{{item.statusText2}}</view>
				</view>
			</view>
		</view>
		<view class="content">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/bg_logo.png" class="bg_logo"></image>
		</view>
		<view class="bottom-box">
			<view class="btn cancel" @click="back">取消</view>
			<view class="btn confirm" @click="confirm">保存</view>
		</view>
	<!-- 	<uni-popup ref="popup" type="bottom">
			<scroll-view class="list" scroll-y="true">
				<view class="item" v-for="item in statusArr" :key="item.id" @click="switchIndex(item)">{{item.statusText2}}</view>
			</scroll-view>
		</uni-popup> -->
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				statusArr: [],
				statusText: "已下单",
				willText: "已下单",
				sid: '',
				isActive: false,
			}
		},
		onLoad(options) {
			var sid = options.sid;
			//获取状态列表
			this.sid = sid;
			this.getStatusList();
			this.init(sid)
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			async getStatusList() {
				try{
					var res = await ship.postRequest("/ld/ldeccred/getStatusList")
					console.log(res, 'asa')
					if (res.retCode == "0000000") {
						this.statusArr = res.rspBody
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			async init(sid) {
				try{
					var res = await ship.postRequest("/ld/ldeccred/getStatusById", {
						sid
					})
					console.log(res, '面单的状态', sid)
					if (res.retCode == "0000000") {
						this.statusText = res.rspBody.statusText2;
						this.willText = res.rspBody.statusText2;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			switchIndex(item) {
				this.isActive = false;
				this.willText = item.statusText2
			},
			showPop() {
				this.isActive = !this.isActive;
				console.log(this.isActive, 'aa');
				this.$forceUpdate();
			},
			async confirm() {
				console.log('qq');
				if (!ship.btnRepeat()) return;
				
				uni.showLoading({
					title: '调整中...'
				})
				try{
					var willText = this.willText;
					var statusArr = this.statusArr;
					
					var findIndex = statusArr.findIndex(item => {
						return item.statusText2 == willText
					})
					var status2 = statusArr[findIndex].id;
					var res = await ship.postRequest("/ld/ldeccred/updateStatus", {
						sid: this.sid,
						"status2": status2
					})
					uni.hideLoading();
					console.log(res, 'a')
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '调整成功',
							icon: 'none'
						})
						this.statusText = willText
						//状态调整后刷新状态
						
						uni.$emit("LingdanListRefresh");
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					console.log(e)
					uni.hideLoading();
					//TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: #F1F4F9;
		display: flex;
		flex-direction: column;
		
	}
	.content {
		width: 100vw;
		flex: 1;
		margin-bottom: 452rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
		.bg_logo {
			width: 572rpx;
			height: 340rpx;
		}
	}
	.title {
		font-size: 36rpx;
		font-weight: bold;
		padding: 20rpx 32rpx;
		color: #333333;
	}
	.arrow_down {
		width: 28rpx;
		height: 28rpx;
	}
	.sub {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding: 0 32rpx 20rpx;
		margin-top: 50rpx;
		.sub-text {
			color: #333333;
			font-size: 36rpx;
			font-weight: 600;
		}
		.arrow {
			padding: 0 18rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			box-shadow: 0px 0px 14px 2px rgba(202, 222, 255, 0.4);
			border-radius: 10rpx 10rpx 0 0;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color: #333333;
			font-weight: 400;
			height: 80rpx;
			width: 322rpx;
			position: relative;
			.status {
				position: absolute;
				top: 80rpx;
				left: 0;
				width: 322rpx;
				background-color: #FFFFFF;
				z-index: -1;
				&.active {
					z-index: 99;
				}
				.item {
					height: 80rpx;
					width: 322rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-top: 1px solid #EFEFEF;
					color: #444444;
					font-size: 32rpx;
				}
			}
		}
	}
	.list {
		padding: 20rpx 32rpx;
		height: 500rpx;
		width: 100vw;
		overflow-y: scroll;
		.item {
			height: 100rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
	}
	.bottom-box {
		position: fixed;
		bottom: 150rpx;
		left: 0;
		width: 100vw;
		z-index: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom); 
		.cancel {
			border-color: #999999;
			color: #FFFFFF;
			background-color: #999999;
		}
		.confirm {
			border-color: #0171F9;
			background-color: #0171F9;
			color: #FFFFFF;
		}
		.btn {
			width: 280rpx;
			height: 86rpx;
			border-radius: 8rpx;
			border-width: 2rpx;
			border-style: solid;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
