<template>
	<view class="newHobby">
		<view class="noticeBox">
			<image class="noticeIcon" src="/static/images/vehicleOptions/noticeIcon.png"></image>
			<uni-notice-bar
				v-if="hintSwiperText"
				background-color="transparent"
				color="#F78B30"
				:speed="50"
				scrollable="true"
				single="true"
				:text="hintSwiperText">
			</uni-notice-bar>
		</view>
		<view class="mainTitle">
			<text class="large">车长</text>
			<text class="small">（单选）</text>
		</view>
		<view class="checkedBox">
			<view
				class="checkedBtnList"
				v-for="(item, lengthKey) in carLenArr"
				:key="lengthKey"
				:class="checkedLength == item.sid ? 'checkedBtn' : 'btnDefault'"
				@click="checkedLength = item.sid">
				{{item.typeName}}
			</view>
		</view>
		
		<view class="mainTitle">
			<text class="large">车型</text>
			<text class="small">（单选）</text>
		</view>
		<view class="checkedBox">
			<view
				class="checkedBtnList"
				v-for="(item, typehKey) in carTypeArr"
				:key="typehKey"
				:class="checkedType == item.sid ? 'checkedBtn' : 'btnDefault'"
				@click="checkedType = item.sid">
				{{item.typeName}}
			</view>
		</view>
		
		<view class="checkedHobbyBtn" @click="toSaveHobby">我选好了</view>
	</view>
</template>

<script>
	import * as publicData from "@/utils/publicData.js";
	import * as service from "@/utils/service";
	export default {
		data() {
			return {
				carLenArr: [],
				carTypeArr: [],
				hintSwiperText: '请选择您关注的车长车型，我们将为您推荐优质车源',
				checkedLength: '',
				checkedType: ''
			};
		},
		onLoad() {
			this.init();
		},
		methods: {
			async init() {
				//初始化数据
				try{
					var carLen = await service.postRequest("/ts/vehicle/length/get")
					var carType = await service.postRequest("/ts/vehicle/type/get");
					console.log('车长', carLen);
					console.log('车形', carType);
					console.log(carLen, carType)
					if (carLen.retCode == "0000000") {
						this.carLenArr = carLen.rspBody.items;
						if (carType.retCode == "0000000") {
							this.carTypeArr = carType.rspBody.items;
						} else {
							uni.showToast({
								title: carType.retDesc,
								icon: 'none'
							})
						}
					} else {
						uni.showToast({
							title: carLen.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					//TODO handle the exception
					
				}
			},
			toSaveHobby() {
				if(!this.checkedLength) {
					uni.showToast({
						title: '请选择车长',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if(!this.checkedType) {
					uni.showToast({
						title: '请选择车型',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				publicData.setTabbarItem(2);
				
				this.userInfo.remindStatus = 0;
				uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
			}
		}
	}
</script>

<style lang="scss">
	.newHobby {
		min-height: 100vh;
		background-color: #FFF;
		.noticeBox {
			margin: 40rpx 36rpx 0 36rpx;
			padding: 8rpx 58rpx 8rpx 26rpx;
			background: #FFEBBE;
			box-shadow: 0px 0px 38rpx 2rpx rgba(255,193,63,0.44);
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			.noticeIcon {
				flex-shrink: 0;
				width: 27rpx;
				height: 35rpx;
				margin-right:24rpx;
			}
		}
		.mainTitle {
			margin: 24rpx 0 0 0;
			padding: 0 36rpx;
			height: 44rpx;
			line-height: 44rpx;
			.large {
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
			}
			.small {
				font-size: 24rpx;
				color: #666666;
			}
		}
		.checkedBox {
			margin: 10rpx 0 0 0;
			padding: 0 36rpx;
			display: flex;
			flex-wrap: wrap;
			.checkedBtnList:nth-child(4n) {
				margin-right:0;
			}
			.checkedBtnList {
				margin-top: 20rpx;
				margin-right: 26rpx;
				width: 150rpx;
				height: 72rpx;
				line-height: 72rpx;
				box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.22);
				border-radius: 8rpx;
				font-size: 28rpx;
				text-align: center;
			}
			.btnDefault {
				background: #FFF;
				color: #333;
			}
			.checkedBtn {
				background: #4396F8;
				color: #FFF;
			}
		}
		.checkedHobbyBtn {
			margin: 86rpx auto 0 auto;
			background-color: #3b75e8;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
