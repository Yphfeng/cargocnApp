<template>
	<view class="toDriverList">
		<view class="header">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/head_back_white.png" class="head_back" @click="back"></image>
			<text>精选车型司机</text>
		</view>
		
		<view class="sub-title">在您周边有1000多名{{chooseCar}}活跃司机，输入货源目的地，我们会更精准多为您推荐司机～</view>
		<view class="search-content">
			<text class="search-label">装货地</text>
			<view class="search-input search-input-first" @click="openNewRegionPopup(0)">{{zhuangLocation.senderAddr ? zhuangLocation.senderAddr : '请选择'}}</view>
			<text class="search-label">卸货地</text>
			<view class="search-input" @click="openNewRegionPopup(1)">{{xieLocation.receiverAddr ? xieLocation.receiverAddr : '请选择'}}</view>
		</view>
		<view class="toDriverList-content">
			<scroll-view class="list" scroll-y="true" :style="{height: (windowHeight*2 - 772) + 'rpx'}">
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
							<text class="title-model">{{setModel(item)}}</text>
						</view>
						<view class="list-sub-title" v-if="showRoute(item)">
							<text class="list-sub-title-label">常跑:</text>
							<text class="list-sub-title-text">{{showRoute(item)}}</text>
						</view>
						<view class="address" v-if="item.address">
							<view class="addr-icon-label">
								<image src="/static/images/ship/beidou_icon.png" class="addr-icon" v-if="item.dataSrc == 4"></image>
								<image src="/static/images/ship/beidou_no_icon.png" class="addr-no-icon" v-else></image>
							</view>
							<text class="address-text">{{item.address}}</text>
						</view>
						<view class="type-list" v-if="item.tagList">
							<view class="type-list-item" v-for="atem in item.tagList">{{atem}}</view>
						</view>
						<view class="contact">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/driver_call_icon.png" class="driver_call_icon"></image>
							<text>电话</text>
						</view>
						<view class="date">{{showDate(item.createTime)}}</view>
						
					</view>
				</view>
			</scroll-view>
			<view class="opt-content">
				<view class="opt-btn" @click="toSearchCarSource">保存</view>
			</view>
			
		</view>
		<carAddr ref="carAddrRef" @toSearchResult="toSearchResult"></carAddr>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship.js"
	import * as utils from "@/utils/utils"
	import carAddr from "./carAddr.vue"
	export default {
		components: {
			carAddr,
		},
		data() {
			return {
				driverList: [{
					"batchNumber": "20220613102607957tsttrad0001",
					"userCode": "319605",
					"ownerUserCode": "H64330",
					"userId": 6337,
					"personId": 6484,
					"driverId": 5315,
					"driverName": "安洪旭",
					"driverPhone": "13564287724",
					"driverImage": "",
					"sender": "上海市",
					"receiver": "上海市",
					"carModel": "高栏",
					"carLength": "13",
					"unit": "趟",
					"indateStart": "2022-06-13 00:00:00",
					"indateEnd": "2022-06-26 23:59:59",
					"indateCount": 3,
					"longTimeFlag": 0,
					"createdDt": "2022-06-13 10:26:08",
					"refDt": "2022-06-27 00:00:01",
					"sid": "20220613102607999tsttrad0001",
					"taskStatus": 1,
					"signed": 0,
					"tagList": {},
					"createDt": "2022-06-13 10:26:08",
					"createTime": "2022-06-13 10:26:08",
					"longitude": "114.734631",
					"latitude": "29.977640",
					"address": "湖北省黄石市大冶市",
					"tagList": {
						"FAVORITE_CARGO": "绿通",
						"OFTEN_AREA": "华北",
						"ROAD_TYPE": "长途",
					},
				}, {
					"batchNumber": "20220531170003371tsttrad0001",
					"userCode": "H97017",
					"ownerUserCode": "H64330",
					"userId": 5753,
					"personId": 5900,
					"driverName": "Wh",
					"driverPhone": "13673564815",
					"driverImage": "",
					"sender": "上海市",
					"receiver": "上海市",
					"carModel": "平板",
					"carLength": "15",
					"unit": "",
					"indateStart": "2022-05-31 00:00:00",
					"indateEnd": "2022-06-30 23:59:59",
					"indateCount": 30,
					"createdDt": "2022-05-31 17:00:03",
					"refDt": "2022-05-31 17:00:03",
					"sid": "20220531170003371tsttrad0002",
					"signed": 0,
					"tagList": {},
					"createDt": "2022-05-31 17:00:03",
					"createTime": "2022-05-31 17:00:03",
					"longitude": "121.318123",
					"latitude": "31.203128",
					"address": "上海市上海市闵行区虹桥正荣中心",
					"tagList": {
						"FAVORITE_CARGO": "大宗",
						"OFTEN_AREA": "东北",
						"ROAD_TYPE": "短途",
					},
				}, {
					"batchNumber": "20220624165321237tsttrad0001",
					"userCode": "474208",
					"ownerUserCode": "H64330",
					"userId": 4385,
					"personId": 4532,
					"driverName": "向清波",
					"driverPhone": "18888888841",
					"driverImage": "",
					"sender": "苏州市",
					"receiver": "苏州市",
					"carModel": "高栏",
					"carLength": "13",
					"expectedPrice": 1111,
					"unit": "趟",
					"indateStart": "2022-06-24 00:00:00",
					"indateEnd": "2022-07-24 23:59:59",
					"indateCount": 30,
					"createdDt": "2022-06-24 16:53:21",
					"refDt": "2022-06-24 16:53:21",
					"sid": "20220624165321237tsttrad0002",
					"taskStatus": 1,
					"signed": 0,
					"tagList": {
						"FAVORITE_CARGO": "大宗",
						"OFTEN_AREA": "华北",
						"ROAD_TYPE": "长途",
					},
					"createDt": "2022-06-24 16:53:21",
					"createTime": "2022-06-24 16:53:21",
					"longitude": "120.950889",
					"latitude": "31.353140",
					"address": "江苏省苏州市昆山高铁站"
				}, {
					"batchNumber": "20220616110439592tsttrad0001",
					"userCode": "312186",
					"ownerUserCode": "H64330",
					"userId": 5876,
					"personId": 6023,
					"driverId": 4868,
					"driverName": "",
					"driverPhone": "15555555555",
					"driverImage": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIUvTgGArBpPxZ57rZmOqtFPEBe6z6yEnibB18IX5rQbLovsDHZ9b7iau8U422TibibA88UVPVUEXOcgw/132",
					"sender": "无锡市",
					"receiver": "无锡市",
					"carModel": "自卸",
					"carLength": "13.7",
					"unit": "趟",
					"indateStart": "2022-06-16 00:00:00",
					"indateEnd": "2022-06-26 23:59:59",
					"indateCount": 3,
					"longTimeFlag": 0,
					"createdDt": "2022-06-16 11:04:40",
					"refDt": "2022-06-27 00:00:01",
					"sid": "20220616110439592tsttrad0002",
					"taskStatus": 2,
					"signed": 0,
					"tagList": {},
					"createDt": "2022-06-16 11:04:40",
					"createTime": "2022-06-16 11:04:40",
					"longitude": "114.756925",
					"latitude": "29.983531",
					"address": "湖北省黄石市大冶市",
					"tagList": {
						"FAVORITE_CARGO": "大宗",
						"OFTEN_AREA": "西北",
						"ROAD_TYPE": "短途",
					},
				}],
				params: {
					status: 1,
					isFeatured: 1,
				},
				driverNum: 0,
				zhuangLocation: {},
				xieLocation: {},
				userInfo: null,
				chooseIndex: 0,
				chooseCar: '',
				windowHeight: 750,
			}
		},
		
		onLoad(options) {
			var that = this;
			this.source = options.source;
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			this.windowHeight = windowHeight;
			this.chooseCar = options.chooseCar;
			console.log("信息",options);
			if (options.zhuangLocation != 'undefined' && options.zhuangLocation) {
				that.zhuangLocation = JSON.parse(options.zhuangLocation)
			}
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : null;
			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					that.params.longitude = res.longitude;
					that.params.latitude = res.latitude;
					
				},
				fail: function(err) {
	
				}
			})
		},
		methods: {
			makePhone(mobile) {
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
			},
			showName(item) {
				var userName = item.driverName;
				var userCode = item.userCode;
				if (userName) {
					return userName.substring(0, 1) + '师傅'
				} else {
					return "李师傅"
				}
			},
			showDate(date) {
				if (!date) return '';
				return utils.findBeidouDateDesc(date)
			},
			back() {
				if (this.source == 'carSettings') {
					uni.navigateBack({
						delta: 2,
					})
					return;
				}
				uni.navigateBack({
					delta: 1,
					success: function() {
						console.log("返回成功");
						uni.$emit("alertDriverBack")
					}
				})
			},
			setModel(item) {
				var carModel = item.carModel;
				var carLength = item.carLength;
				if (!item.carModel) return "";
				if (!item.carLength) return "";
				
				return carLength + "米" + carModel
			},
			showRoute(item) {
				var sender = item.sender;
				var receiver = item.receiver;
				if (!item.sender) return "";
				if (!item.receiver) return "";
				
				return sender + "-" + receiver
			},
			
			async toSearchCarSource() {
				try{
					var that = this;
					uni.showLoading();
					//搜索车源,把线路写入车源配置页面
					var zhuangLocation = this.zhuangLocation;
					var xieLocation = this.xieLocation;
					if (!zhuangLocation.senderAddr) {
						uni.showToast({
							title: '请选择装货地',
							icon: 'none'
						})
						return;
					}
					if (!xieLocation.receiverAddr) {
						uni.showToast({
							title: '请选择卸货地',
							icon: 'none'
						})
						return;
					}
					
					var dataParams = {
						tagTypeCode: "MY_CIRCUIT",
						tagTypeName: "我的线路",
						tagName:  zhuangLocation.senderAddr + '-' + xieLocation.receiverAddr,
						personId: that.userInfo.attrs.personId,
						userCode: that.userInfo.attrs.userCode,
						userId: that.userInfo.userId,
						userPhone: that.userInfo.mobile,
						ext1: zhuangLocation.senderCode,
						ext2: xieLocation.receiverCode,
					}
					console.log("chooseCar", dataParams)
					var res = await ship.postRequest("/yh/upd/tags/save", dataParams);
					uni.hideLoading();
					if (res.retCode != "0000000") {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
						return;
					}
					uni.$emit("refresCarEmit");
					if (this.source == "carSettings") {
						uni.navigateBack({
							delta: 2,
						})
					} else {
						uni.navigateBack({
							delta: 1,
						})
					}
					
				}catch(e){
					console.log(e)
					//TODO handle the exception
				}
			},
			
			toSearchResult(params) {
				if (this.chooseIndex == 0) {
					this.zhuangLocation.senderAddr = params.startAddr.name;
					this.zhuangLocation.senderCode = params.startAddr.code;
				} else {
					this.xieLocation.receiverAddr = params.arriveAddr.name;
					this.xieLocation.receiverCode = params.arriveAddr.code;
				}
				this.$forceUpdate();
			},
			openNewRegionPopup(index) {
				this.chooseIndex = index;
				this.$refs.carAddrRef.showPopUp(index);
			},
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
		.header {
			height: 62rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			margin: 10rpx 0 44rpx;
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
		.search-content {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin: 52rpx 0 64rpx;
			.search-label {
				font-size: 40rpx;
				color: rgba(255, 255, 255, 1);
			}
			.search-input {
				flex: 1;
				border: 2rpx solid #ffffff;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #ffffff;
				margin-left: 36rpx;
				box-sizing: border-box;
				border-radius: 8rpx;
				height: 60rpx;
				&.search-input-first {
					margin-right: 36rpx;
				}
			}
		}
		.sub-title {
			font-size: 36rpx;
			color: rgba(255, 255, 255, 1);
			font-weight: 400;
			line-height: 42rpx;
			text-shadow: 2rpx 8rpx 6rpx #0061CF;
			padding-bottom: 12rpx;
			box-sizing: border-box;
			&.sub-title-last {
				padding-bottom: 60rpx;
			}
		}
		.main-title {
			font-size: 52rpx;
			color: rgba(255, 255, 255, 1);
			font-weight: 500;
			line-height: 61rpx;
			text-shadow: 2rpx 8rpx 6rpx #0061CF;
			padding-bottom: 44rpx;
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
						.contact {
							position: absolute;
							top: 64rpx;
							right: 26rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							color: rgba(0, 0, 0, 1);
							font-size: 20rpx;
							z-index: 2;
							.driver_call_icon {
								width: 48rpx;
								height: 48rpx;
								margin-bottom: 10rpx;
							}
							
						}
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
							line-height: 38rpx;
							.title-name {
								color: rgba(51, 51, 51, 1);
								font-size: 32rpx;
								font-weight: 600;
							}
							.title-model {
								color: rgba(51, 51, 51, 1);
								font-size: 32rpx;
								margin-left: 10rpx;
							}
						}
						.list-sub-title {
							display: flex;
							flex-direction: row;
							align-items: center;
							padding-top: 12rpx;
							box-sizing: border-box;
							line-height: 35rpx;
							.list-sub-title-label {
								color: rgba(51, 51, 51, 1);
								font-size: 30rpx;
								font-weight: 500;
								margin-right: 10rpx;
							}
							.list-sub-title-text {
								color: rgba(52, 137, 233, 1);
								font-size: 30rpx;
								font-weight: 500;
							}
						}
						.address {
							display: flex;
							flex-direction: row;
							margin-top: 14rpx;
							.addr-icon-label {
								margin-right: 10rpx;
								height: 44rpx;
								line-height: 44rpx;
								.addr-icon {
									width: 20rpx;
									height: 20rpx;
								}
								.addr-no-icon {
									width: 28rpx;
									height: 28rpx;
								}
							}
							.address-text {
								color: rgba(51, 51, 51, 1);
								font-size: 32rpx;
								line-height: 38rpx;
							}
						}
						.type-list {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: flex-start;
							.type-list-item {
								width: 98rpx;
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
								&:nth-child(3n + 1) {
									margin-left: 0;
								}
							}
						}
					}
				}
			}
			.opt-content {
				margin-top: 20rpx;
				width: calc(100vw - 68rpx);
				display: flex;
				justify-content: center;
				align-items: center;
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