<template>
	<view class="toDriverList">
		<view class="header">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/head_back_white.png" class="head_back" @click="back"></image>
			<text>精选车型司机</text>
		</view>
		<view class="sub-title" v-if="info">欢迎来到{{info.cartLength}}米{{info.model}}超级车队，您可以通过以下方式精准找车：</view>
		<view class="main-box">
			<view class="main-row">
				<view class="main-row-item main-row-item-1">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/main-driver-1.png" class="main-driver-icon"></image>
					<text class="main-item-text">查看司机</text>
					<text class="main-item-text">AI名片</text>
				</view>
				<view class="main-row-item main-row-item-1">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/main-driver-2.png" class="main-driver-icon"></image>
					<text class="main-item-text">查看司机</text>
					<text class="main-item-text">最新定位、轨迹</text>
				</view>
			</view>
			<view class="main-row">
				<view class="main-row-item main-row-item-2">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/main-driver-3.png" class="main-driver-icon"></image>
					<text class="main-item-text">查看司机</text>
					<text class="main-item-text">常跑线路</text>
				</view>
				<view class="main-row-item main-row-item-2">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/main-driver-4.png" class="main-driver-icon"></image>
					<text class="main-item-text">把司机加</text>
					<text class="main-item-text">入自己的车队</text>
				</view>
			</view>
		</view>
		
		<view class="toDriverList-content">
			
			<scroll-view class="list" :scroll-y="true" :style="{height: (windowheight*2 - 1290) + 'rpx'}">
				<view class="list-item" v-for="(item, index) in driverList">
					<view class="avatar-content">
						<view class="avatar-inner">
							<image src="/static/logo.png" class="avatar"></image>
							<view class="label">{{item.isSigned ? '签约' : '未签约'}}</view>
						</view>
						<view class="status" :class="{active: item.taskStatus != 2}">
							<view class="dot" :class="{active: item.taskStatus != 2}" />
							<text>{{item.taskStatus == 2 ? '忙碌' : '可接单'}}</text>
						</view>
					</view>
					<view class="list-content">
						<view class="title">
							<text class="title-name">{{showName(item)}}</text>
							<text class="title-model">{{setModel(item.model)}}</text>
						</view>
						<view class="list-sub-title" v-if="item.circuitCombo">
							<text class="list-sub-title-label">常跑:</text>
							<text class="list-sub-title-text">{{item.circuitCombo}}</text>
						</view>
						<view class="address" v-if="item.address">
							
							<image src="/static/images/ship/beidou_icon.png" class="addr-icon" v-if="item.dataSrc != 2"></image>
							<image src="/static/images/ship/beidou_no_icon.png" class="addr-no-icon" v-else></image>
							
							<view class="address-text">{{item.address}}</view>
						</view>
						<view class="type-list" v-if="item.tagShowArr">
							<view class="type-list-item" v-for="atem in item.tagShowArr">{{atem.tagName}}</view>
						</view>
						<view class="date">{{showDate(item.locationUpdatedDt)}}</view>
						
					</view>
				</view>
			</scroll-view>
			
			
			<view class="opt-content">
				<view class="opt-btn" @click="back">查看更多</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship.js"
	import * as utils from "@/utils/utils"
	export default {
		data() {
			return {
				driverList: [],
				params: {
					status: 1,
					isFeatured: 1,
					count: false
				},
				driverNum: 0,
				info: null,
			}
		},
		onLoad(options) {
			var that = this;
			var windowheight = uni.getSystemInfoSync().windowHeight;
			this.windowheight = windowheight;
			
			var info = options.info;
			this.params.fleetId = JSON.parse(info).id;
			this.info = JSON.parse(info);
			console.log("车队信息", info)
			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					that.params.longitude = res.longitude;
					that.params.latitude = res.latitude;
					that.init();
				},
				fail: function(err) {
					that.init();
				}
			})
		},
		methods: {
			showName(item) {
				var userName = item.userName;
				var userCode = item.userCode;
				if (userName) {
					return userName.substring(0, 1) + '师傅'
				} else {
					return "张师傅"
				}
			},
			makePhone(mobile) {
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
			},
			showDate(date) {
				if (!date) return '';
				return utils.findBeidouDateDesc(date)
			},
			back() {
				uni.navigateBack({
					delta: 1,
					success: function() {
						console.log("返回成功");
						uni.$emit("alertDriverBack")
					}
				})
			},
			setModel(model) {
				if (!model) return "";
				var model = model.split(',')[0]
				return model
			},
			async init() {
				//获取司机信息
				var res = await ship.newQueryPostRequest("/cd/fleetWithUser/list", this.params)
				console.log("车队成员", res)
				if (res.retCode != "0000000") {
					uni.showToast({
						title: res.retDesc,
						icon: 'none'
					})
					return;
				}
				var driverList = res.rspBody.items;
				driverList.forEach(item => {
					var tagList = item.tagList;
					var tagShowArr = []
					tagList.forEach(item => {
						if (item.tagTypeCode == "FAVORITE_CARGO") {
							tagShowArr.push(item)
						}
						if (item.tagTypeCode == "OFTEN_AREA") {
							tagShowArr.push(item)
						}
						if (item.tagTypeCode == "ROAD_TYPE") {
							tagShowArr.push(item)
						}
					})
					item.tagShowArr = tagShowArr;
					
				})
				this.driverList = driverList;
				this.driverNum = res.rspBody.items.length;
			}
		}
	}
</script>

<style lang="scss">
	.toDriverList {
		background-image: linear-gradient(to bottom, rgba(74, 158, 253, 1), rgba(21, 131, 250, 1));
		height: 100vh;
		width: 100vw;
		padding: 88rpx 34rpx 54rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.main-box {
			display: flex;
			flex-direction: column;
			background-image: linear-gradient(to top, rgba(99, 167, 250, 1), rgba(5, 114, 255, 1));
			padding: 38rpx 52rpx;
			box-sizing: border-box;
			width: calc(100vw - 68rpx);
			height: 414rpx;
			border-radius: 24rpx;
			margin-bottom: 48rpx;
			.main-row {
				flex: 1;
				width: calc(100vw - 172rpx);
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				height: 168rpx;
				&:first-child {
					border-bottom: 1rpx solid rgba(255, 255, 255, 1);
				}
				.main-row-item {
					height: 168rpx;
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					color: rgba(255, 255, 255, 1);
					&:first-child {
						border-right: 1rpx solid rgba(255, 255, 255, 1);
					}
					&.main-row-item-1 {
						justify-content: flex-start;
					}
					&.main-row-item-2 {
						justify-content: flex-end;
					}
					.main-driver-icon {
						width: 60rpx;
						height: 60rpx;
						margin-bottom: 8rpx;
					}
					.main-item-text {
						line-height: 40rpx;
						font-weight: 400;
						font-size: 28rpx;
					} 
				}
			}
		}
		.header {
			height: 62rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			margin: 10rpx 0 72rpx;
			font-size: 44rpx;
			color: rgba(255, 255, 255, 1);
			font-weight: 500;
			.head_back {
				position: absolute;
				left: 38rpx;
				top: 10rpx;
				width: 16rpx;
				height: 30rpx;
			}
		}
		.sub-title {
			font-size: 36rpx;
			color: rgba(255, 255, 255, 1);
			font-weight: 400;
			line-height: 42rpx;
			text-shadow: 2rpx 8rpx 6rpx #0061CF;
			padding-bottom: 38rpx;
			box-sizing: border-box;
		}
		.toDriverList-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-self: center;
			width: calc(100vw - 68rpx);
			background-color: rgba(255, 255, 255, 0.65);
			border-radius: 24rpx;
			padding: 30rpx 0 26rpx;
			box-sizing: border-box;
			.list {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 28rpx;
				box-sizing: border-box;
				.list-item {
					display: flex;
					flex-direction: row;
					background-color: rgba(255, 255, 255, 1);
					border-radius: 12rpx;
					box-shadow: 0 0 18rpx 2rpx rgba(106, 106, 106, 0.09);
					margin-bottom: 20rpx;
					.avatar-content {
						width: 118rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						box-sizing: border-box;
						padding-bottom: 26rpx;
						padding-top: 30rpx;
						.avatar-inner {
							width: 80rpx;
							height: 80rpx;
							position: relative;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							.avatar {
								width: 80rpx;
								height: 80rpx;
								border-radius: 80rpx;
							}
							.label {
								z-index: 2;
								width: 62rpx;
								height: 20rpx;
								border-radius: 70rpx;
								background-image: linear-gradient(to bottom, rgba(81, 162, 254, 1), rgba(16, 129, 249, 1));
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 16rpx;
								color: rgba(255, 255, 255, 1);
								margin-top: -10rpx;
							}
						}
						.status {
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							color: rgba(226, 99, 59, 1);
							font-size: 28rpx;
							padding-top: 10rpx;
							box-sizing: border-box;
							&.active {
								color: rgba(74, 205, 27, 1);
							}
							.dot {
								width: 14rpx;
								height: 14rpx;
								background-color: rgba(226, 99, 59, 1);
								border-radius: 14rpx;
								margin-right: 6rpx;
								box-sizing: border-box;
								&.active {
									background-color: rgba(74, 205, 27, 1);
								}
							}
							
						}
					}
					.list-content {
						flex: 1;
						display: flex;
						flex-direction: column;
						padding-right: 100rpx;
						box-sizing: border-box;
						position: relative;
						padding-bottom: 26rpx;
						.date {
							position: absolute;
							bottom: 26rpx;
							right: 26rpx;
							color: rgba(102, 102, 102, 1);
							font-size: 28rpx;
							z-index: 3;
							line-height: 44rpx;
						}
						.title {
							display: flex;
							flex-direction: row;
							align-items: center;
							padding-top: 26rpx;
							box-sizing: border-box;
							.title-name {
								color: rgba(51, 51, 51, 1);
								font-size: 32rpx;
								font-weight: 600;
								line-height: 38rpx;
							}
							.title-model {
								color: rgba(51, 51, 51, 1);
								font-size: 32rpx;
								margin-left: 10rpx;
								line-height: 38rpx;
							}
						}
						.list-sub-title {
							display: flex;
							flex-direction: row;
							align-items: center;
							padding-top: 12rpx;
							box-sizing: border-box;
							.list-sub-title-label {
								color: rgba(51, 51, 51, 1);
								font-size: 30rpx;
								font-weight: 500;
								margin-right: 10rpx;
								line-height: 35rpx;
							}
							.list-sub-title-text {
								color: rgba(52, 137, 233, 1);
								font-size: 30rpx;
								font-weight: 500;
								line-height: 35rpx;
							}
						}
						.address {
							display: flex;
							flex-direction: row;
							margin-top: 14rpx;
							align-items: center;
							justify-content: flex-start;
							.addr-icon {
								width: 20rpx;
								height: 20rpx;
							}
							.addr-no-icon {
								width: 28rpx;
								height: 28rpx;
							}
							.address-text {
								margin-left: 8rpx;
								width: calc(100vw - 400rpx);
								color: rgba(51, 51, 51, 1);
								font-size: 32rpx;
								line-height: 38rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
						.type-list {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: flex-start;
							.type-list-item {
								padding: 0 26rpx;
								height: 42rpx;
								border-radius: 8rpx;
								border: 2rpx solid rgba(82, 131, 255, 1);
								color: rgba(82, 131, 255, 1);
								font-size: 24rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								margin-top: 22rpx;
								margin-left: 20rpx;
								font-weight: 500;
								&:nth-child(3n + 1) {
									margin-left: 0;
								}
							}
						}
					}
				}
			}
			.opt-content {
				width: calc(100vw - 68rpx);
				padding-top: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
			.opt-btn {
				width: 400rpx;
				height: 80rpx;
				background-color: rgba(43, 114, 240, 1);
				border-radius: 16rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #ffffff;
				font-size: 32rpx;
				font-weight: 500;
				
			}
		}
	}
	
</style>