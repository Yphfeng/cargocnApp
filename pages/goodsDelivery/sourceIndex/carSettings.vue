<template>
	<view class="newHobby">
		<view  :style="{height: (statusBarHeight + 60) + 'rpx'}" />
		<view class="navBar" :style="{height: (statusBarHeight + 60) + 'rpx'}">
			<view class="status-barHeight" :style="{height: statusBarHeight + 'rpx'}" />
			<view class="navBar-center">
				<!-- <view class="back" @click="back">
					<image src="/static/images/ship/back-black.png" mode="widthFix" class="back-black"></image>
				</view> -->
				<view></view>
			</view>
			
		</view>
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
		
		<view class="checkedBox">
			<view class="checkedBox_container">
				<view
					class="checkedBtnList"
					v-for="(item, lengthKey) in carSimples"
					:key="lengthKey"
					:class="item.active ? 'checkedBtn' : 'btnDefault'"
					@click="switchCarSimples(lengthKey)">
					{{item.name}}
				</view>
			</view>
			
		</view> 
		
		<view class="sub-main">我需要选择其他车型</view>
		<view class="mainTitle">
			<text class="large">车长</text>
			<text class="small">（单选）</text>
		</view>
		<view class="checkedBox">
			<view class="checkedBox_container">
				<view
					class="checkedBtnList"
					v-for="(item, lengthKey) in carLenArr"
					:key="lengthKey"
					:class="lengthKey == selectCarLenIndex ? 'checkedBtn' : 'btnDefault'"
					@click="switchCarLen(lengthKey)">
					{{item.typeName}}米
				</view>
			</view>
			
		</view> 
		
		<view class="mainTitle">
			<text class="large">车型</text>
			<text class="small">（单选）</text>
		</view>
		<view class="checkedBox">
			<view class="checkedBox_container">
				<view
					class="checkedBtnList"
					v-for="(item, typehKey) in carTypeArr"
					:key="typehKey"
					:class="typehKey == selectedTypeIndex ? 'checkedBtn' : 'btnDefault'"
					@click="switchCarType(typehKey)">
					{{item.typeName}}
				</view>
			</view>
			
		</view>
		
		<view class="checkedHobbyBoot">
			<view class="checkedHobbyBtn" @click="toSaveHobby">我选好了</view>
		</view>
		
		<uni-popup ref="popup" type="center">
			<view class="pop-content" v-if="popContent">
				<view class="pop-text">根据您的用车需求，我们一起去</view>
				<view class="pop-sub-title">“{{popContent.name || ""}}”</view>
				<view class="pop-btn-content">
					<view class="pop-btn" @click="toFleet">去看看</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="driverPop" type="center">
			<view class="driverPop">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/driver-pop-close.png" class="driver-pop-close" @click="popClose"></image>
				<view class="driverPop-title">
					在您的周边有1345名{{chooseCar}}活跃司机
				</view>
				<view class="driverPop-sub-title">
					<text class="driverPop-sub-title-text">输入卸货地，会更精准为您匹配。</text>
				</view>
				<view class="driverPop-label-item">
					<text class="driverPop-label">装货地</text>
					<view class="driverPop-input" @click="openNewRegionPopup(0)">
						<text>{{zhuangLocation.senderAddr || '请选择'}}</text>
					</view>
				</view>
				<view class="driverPop-label-item driverPop-label-item-last">
					<text class="driverPop-label">卸货地</text>
					<view class="driverPop-input" @click="openNewRegionPopup(1)">
						<text>{{xieLocation.receiverAddr || "请选择"}}</text>
					</view>
				</view>
				<view class="driver-publish">
					<view class="driver-publish-btn" @click="toSearchCarSource">
						<text class="driver-publish-btn-text">搜车源</text>
					</view>
				</view>
			</view>
		</uni-popup>
		<carAddr ref="carAddrRef" @toSearchResult="toSearchResult"></carAddr>
			
	</view>
</template>

<script>
	import * as publicData from "@/utils/publicData.js";
	import * as ship from "@/utils/ship";
	import carAddr from "./carAddr.vue"
	export default {
		components: {
			carAddr,
		},
		data() {
			return {
				statusBarHeight: 0,
				carSimples: [],
				carLenArr: [],
				carTypeArr: [],
				hintSwiperText: '请选择您关注的车长车型，我们将为您推荐优质司机',
				checkedLength: '',
				checkedType: '',
				selectCarLenIndex: -1,
				selectedTypeIndex: -1,
				selectedCarSimples: -1,
				popContent: null,
				zhuangAddress: '',
				zhuangLocation: {},
				xieLocation: {},
				chooseCar: "",
				chooseIndex: 0,
			}
		},
		onLoad() {
			var that = this;
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			console.log(statusBarHeight, '11');
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userInfo = JSON.parse(userInfo);
				this.init();
			}
			this.statusBarHeight = statusBarHeight * 2;
			//获取定位信息
			uni.getLocation({
				type: 'gcj02',
				geocode:true,
				success: function(res) {
					console.log("定位信息", res);
					var address = res.address;
					if (address) {
						var zhuangAddress = address.province + address.city + address.district + '人民政府';
						that.zhuangAddress = address.province + address.city + address.district + '人民政府';
						console.log("人民政府", zhuangAddress)
						that.renderLocation(zhuangAddress);
					}
					
				}
			})
		},
		methods: {
			popClose() {
				this.$refs.driverPop.close();
			},
			toSearchResult(params) {
				console.log("选择的装卸地址",params);
				if (this.chooseIndex == 0) {
					this.zhuangLocation.senderAddr = params.startAddr.name;
					this.zhuangLocation.senderCode = params.startAddr.code;
				} else {
					this.xieLocation.receiverAddr = params.arriveAddr.name;
					this.xieLocation.receiverCode = params.arriveAddr.code;
				}
				this.$forceUpdate();
			},
			renderLocation(addr) {
				let that = this;
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780' + '&address=' + addr;
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/geo?' + parameters, //仅为示例，并非真实接口地址。
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log("获取经纬度", res)
						var geocodesData = res.data.geocodes;
						if(geocodesData && geocodesData.length == 0) {
							uni.showToast({
								title: '未查询到此地址！',
								duration: 2000,
								icon: 'none'
							});
							return;
						}
						var geocodes = geocodesData[0];
						//初始化设置code和name
						var adcode = geocodes.adcode;
						adcode = adcode.toString();
						var provinceCode = adcode.slice(0, 2) + "0000";
						var cityCode = adcode.slice(0, 4) + "00";
						if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
							that.zhuangLocation.senderCode = geocodes.adcode;
							that.zhuangLocation.senderAddr = geocodes.district;
						} else {
							that.zhuangLocation.senderCode = cityCode;
							that.zhuangLocation.senderAddr = geocodes.city;
							
						}
							console.log("装货地址" ,that.zhuangLocation);
						that.$forceUpdate();
					},
					fail: (err) => {
						
					},
					complete: (com) => {
						uni.hideLoading();
					},
				})
			},
			openNewRegionPopup(index) {
				this.chooseIndex = index;
				this.$refs.carAddrRef.showPopUp(index);
			},
			switchCarLen(index) {
				var selectCarLenIndex = this.selectCarLenIndex;
				if (selectCarLenIndex == index) {
					this.selectCarLenIndex = -1;
					return;
				}
				this.selectCarLenIndex = index;
				var carSimples = this.carSimples;
				carSimples.forEach(item => {
					item.active = false
				})
				this.carSimples = carSimples;
			},
			switchCarType(index) {
				var selectedTypeIndex = this.selectedTypeIndex;
				if (selectedTypeIndex == index) {
					this.selectedTypeIndex = -1;
					return;
				}
				this.selectedTypeIndex = index;
				var carSimples = this.carSimples;
				carSimples.forEach(item => {
					item.active = false
				})
				this.carSimples = carSimples;
				
			},
			switchCarSimples(index) {
				var carSimples = this.carSimples;
				var active = carSimples[index].active;
				carSimples[index].active = !active;
				this.carSimples = carSimples;
				this.$forceUpdate();
				this.selectCarLenIndex = -1;
				this.selectedTypeIndex = -1;
			},
			
			async init() {
				//初始化数据
				try{
					var carLen = await ship.postRequest("/ts/vehicle/length/get")
					var carType = await ship.postRequest("/ts/vehicle/type/get");
					var carCustom = await ship.postRequest("/yh/upd/tags/find", {
						userId: this.userInfo.attrs.userId,
						typeCodeList: ["MY_VEHICLE"],
						"status": 1

					});
					
					var carSimples = await ship.postRequest("/ts/car/model/length/dict/select");
					
					
					var hasCarInfo = await ship.postRequest("/yh/personas/select", {
						userCode: this.userInfo.attrs.userCode,
						userId: this.userInfo.userId,
					}) //我的车辆信息
					
					
					console.log("用户信息", hasCarInfo);
					console.log('车长', carLen);
					console.log('车形', carType);
					console.log('车辆配置', carCustom);
					console.log('车辆配置1', carSimples);
					
					if (carSimples.retCode == "0000000") {
						this.carSimples = carSimples.rspBody.items
					}
					if (carLen.retCode == "0000000") {
						var carLenArr = carLen.rspBody.items;
						if (hasCarInfo.retCode == '0000000') {
							var carInfoUser = hasCarInfo.rspBody;
							if (carInfoUser.length > 0) {
								carInfoUser.forEach(item => {
									var carLength = item.carLength;
									var findIndex = carLenArr.findIndex(i => {
										return i.typeName == carLength
									})
									if (findIndex > -1) {
										carLenArr[findIndex].active = true
									}
								})
							}
						} else {
							uni.showToast({
								title: hasCarInfo.retDesc,
								icon: 'none'
							})
						}
						this.carLenArr = carLenArr;
					} else {
						uni.showToast({
							title: carLen.retDesc,
							icon: 'none'
						})
					}
						
					if (carType.retCode == "0000000") {
						var carTypeArr = carType.rspBody.items;
						if (hasCarInfo.retCode == '0000000') {
							var carInfoUser = hasCarInfo.rspBody;
							if (carInfoUser.length > 0) {
								carInfoUser.forEach(item => {
									var carModel = item.carModel;
									var findIndex = carTypeArr.findIndex(i => {
										return i.typeName == carModel
									})
									if (findIndex > -1) {
										carTypeArr[findIndex].active = true
									}
								})
							}
						} else {
							uni.showToast({
								title: hasCarInfo.retDesc,
								icon: 'none'
							})
						}
						this.carTypeArr = carTypeArr;
					} else {
						uni.showToast({
							title: carType.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					console.log(e)
					//TODO handle the exception
					
				}
			},
			toFleet() {
				//跳转车队详情页面
				var that = this;
				var popContent = this.popContent;
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(popContent) + '&pageSource=carSettings&zhuangAddress=' + that.zhuangAddress
				})
				// uni.navigateTo({
				// 	url: '/pages/goodsDelivery/fleetIndex/fleetDetails?info=' + JSON.stringify(popContent) + '&pageSource=carSettings&zhuangAddress=' + that.zhuangAddress
				// })
				
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
					
					
					var newParams = {
						tagTypeCode: "MY_CIRCUIT",
						tagTypeName: "我的线路",
						tagName: zhuangLocation.senderAddr + '-' + xieLocation.receiverAddr,
						personId: that.userInfo.attrs.personId,
						userCode: that.userInfo.attrs.userCode,
						userId: that.userInfo.userId,
						userPhone: that.userInfo.mobile,
						ext1: zhuangLocation.senderCode,
						ext2: xieLocation.receiverCode,
					}
					
					
					var res = await ship.postRequest("/yh/upd/tags/save", newParams);
					uni.hideLoading();
					if (res.retCode != "0000000") {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
						return;
					}
					uni.$emit("refresCarEmit");
					uni.navigateBack({
						delta: 1
					})
				}catch(e){
					console.log(e)
					//TODO handle the exception
				}
			},
			async toSaveHobby() {
				var that = this;
				var carModelList = [], carLengthList = [];
				var carTypeArr = this.carTypeArr;
				var  carLenArr = this.carLenArr;
				var selectCarLenIndex = this.selectCarLenIndex;
				var selectedTypeIndex = this.selectedTypeIndex;
				var carSimples = this.carSimples;
				var selectCarLenIndex = this.selectCarLenIndex;
				var selectedTypeIndex = this.selectedTypeIndex;
				var selectedItems = [], cartLengthList = [], modelList = [];
				if (selectedTypeIndex < 0 && selectCarLenIndex < 0) {
					carSimples.forEach(item => {
						if (item.active) {
							var name = item.name;
							var nameArr = name.split("米");
							cartLengthList.push(nameArr[0]);
							modelList.push(nameArr[1]);
							selectedItems.push({
								tagName: item.name,
								tagTypeName: "我的车辆",
								tagTypeCode: "MY_VEHICLE"
							})
						}
					})
				} else {
					if (selectedTypeIndex < 0) {
						uni.showToast({
							title: '请选择车型',
							icon: 'none'
						})
						return;
					}
					if (selectCarLenIndex < 0) {
						uni.showToast({
							title: '请选择车长',
							icon: 'none'
						})
						return;
					}
					var carType = carTypeArr[selectedTypeIndex].typeName;
					var carLen = carLenArr[selectCarLenIndex].typeName;
					selectedItems.push({
						tagName: carLen + '米' + carType,
						tagTypeName: "我的车辆",
						tagTypeCode: "MY_VEHICLE"
					})
					cartLengthList.push(carLen);
					modelList.push(carType);
					
				}
				if (selectedItems.length < 1) {
					uni.showToast({
						title: '请选择组合',
						icon: 'none'
					})
					return;
				}
				this.chooseCar = selectedItems[0].tagName;
				if (!this.userInfo) return;
				var userCode = this.userInfo.attrs.userCode;
				try{
					uni.showLoading();
					console.log({
						userCode: userCode,
						userId: this.userInfo.userId,
						personId: this.userInfo.attrs.personId,
						driverId: this.userInfo.attrs.driverId,
						userPhone: this.userInfo.mobile,
						typeCodeList: ["MY_VEHICLE"],
						updTagsVOList: selectedItems
					}, '保存的用户信息')
					
					var ret = await ship.postRequest("/yh/upd/tags/edit/with/type", {
						userCode: userCode,
						userId: this.userInfo.userId,
						personId: this.userInfo.attrs.personId,
						driverId: this.userInfo.attrs.driverId,
						userPhone: this.userInfo.mobile,
						typeCodeList: ["MY_VEHICLE"],
						updTagsVOList: selectedItems
					})
					console.log(ret, 'sss');
					if (ret.retCode != "0000000") {
						uni.hideLoading();
						uni.showToast({
							title: ret.retDesc,
							icon: 'none'
						})
						return;
					}
					//判断选择的车型车长是否在哪个超级车队
					var superRes = await ship.newQueryPostRequest("/cd/fleet/list", {
						isSuperFleet: 1,
						modelList: modelList,
						cartLengthList: cartLengthList,
					})
					console.log("超级车队萧嫣", superRes)
					if (superRes.retCode != "0000000") {
						uni.hideLoading();
						uni.showToast({
							title: superRes.retDesc,
							icon: 'none'
						})
						return;
					}
					uni.hideLoading();
					
					//判断选择的车长车型是否在配置中
					// let params = {
					// 	userId: this.userInfo.userId,
					// 	typeCodeList: ['MY_VEHICLE'],
					// 	status: 1
					// }
					// var resCar = await ship.postRequest("/yh/upd/tags/find", params)
					// var resCarBody = resCar.rspBody.items;
					// console.log("车辆配置",resCarBody);
					// var findCarIndex = resCarBody.findIndex(item => {
					// 	var tagNameArr = item.tagName.split("米");
					// 	return tagNameArr[0] == carLen && tagNameArr[1] == carType
					// })
					// if (findCarIndex < 0) {
					// 	//选择的车长车型不在配置，需要加入配置
					// 	var newParams = {
					// 		tagTypeCode: "MY_VEHICLE",
					// 		tagTypeName: "我的车辆",
					// 		tagName: carLen + '米' + carType,
					// 		personId: that.userInfo.attrs.personId,
					// 		userCode: that.userInfo.attrs.userCode,
					// 		userId: that.userInfo.userId,
					// 		userPhone: that.userInfo.mobile,
					// 	}
					// 	await ship.postRequest("/yh/upd/tags/save", newParams);
					// }
					var superItems = superRes.rspBody.items;
					
					//判断是否有相应的超级车队
					if (superItems.length  > 0) {
						this.popContent = superItems[0];
						this.$forceUpdate();
						this.$refs.popup.open();
						
					} else {
						//没有超级车队，判断是否有线路
						let params = {
							userId: this.userInfo.userId,
							typeCodeList: ['MY_CIRCUIT'],
							status: 1
						}
						var res = await ship.postRequest("/yh/upd/tags/find", params)
						console.log("线路配置", res);
						if (res.retCode != "0000000") {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
							return;
						}
						var rspCarSource = res.rspBody.items;
						// var findSourceIndex = rspCarSource.findIndex(item => {
						// 	return item.
						// })
						if (rspCarSource.length > 0) {
							//有配置线路，直接跳转首页写入配置
							//触发搜索并设置车长车型
							
							uni.navigateBack({
								delta: 1
							})
							setTimeout(() => {
								uni.$emit("refresCarEmit");
							}, 500)
						} else {
							var chooseCar = that.chooseCar;
							//没有配置车源
							// this.$refs.driverPop.open();
							uni.navigateTo({
								url: './carSourceTips?zhuangLocation=' + JSON.stringify(that.zhuangLocation) + '&chooseCar=' + chooseCar + "&source=carSettings"
							})
						}
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

<style lang="scss">
	.newHobby {
		background-color: #FFF;
		display: flex;
		flex-direction: column;
		padding-bottom: 200rpx;
		box-sizing: border-box;
		.pop-content {
			width: calc(100vw - 67rpx);
			height: 456rpx;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 0 40rpx;
			box-sizing: border-box;
			.pop-text {
				font-size: 36rpx;
				color: rgba(0, 0, 0, 1);
				line-height: 58rpx;
				margin: 54rpx 0 42rpx;
			}
			.pop-sub-title {
				color: rgba(43, 114, 240, 1);
				font-size: 48rpx;
				line-height: 70rpx;
			}
			.pop-btn-content {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				.pop-btn {
					width: 344rpx;
					height: 72rpx;
					background-color: rgba(43, 114, 240, 1);
					color: #FFFFFF;
					border-radius: 12rpx;
					font-size: 32rpx;
					font-weight: 500;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
		.navBar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			z-index: 2;
			display: flex;
			flex-direction: column;
			background-color: #FFFFFF;
			.status-barHeight {
				background-color: #FFFFFF;
			}
			.navBar-center {
				display: flex;
				flex-direction: row;
				position: relative;
				justify-content: center;
				align-items: center;
				height: 60rpx;
				.back {
					position: absolute;left: 0;
					top: 0;
					z-index: 2;
					width: 106rpx;
					height: 60rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.back-black {
						width: 16rpx;
					}
				}
			}
		}
		.noticeBox {
			margin: 40rpx 36rpx 30rpx 36rpx;
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
		.sub-main {
			font-size: 48rpx;
			color: rgba(51, 51, 51, 1);
			font-weight: 500;
			margin: 86rpx 36rpx 62rpx;
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
			width: 100vw;
			.checkedBox_container {
				min-height: 50rpx;
				width: 100vw;
				padding: 0 36rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
			}
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
		.checkedHobbyBoot {
			position: fixed;
			bottom: 0;
			left: 0;
			height: 200rpx;
			width: 100vw;
			display: flex;
			justify-content: center;
			align-items: center;
			.checkedHobbyBtn {
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
		.driverPop {
			width: 620rpx;
			height: 506rpx;
			border-radius: 24rpx;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.driverPop-title {
			margin: 38rpx 36rpx 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			font-size: 40rpx;
			color: rgba(51, 51, 51, 1);
			font-weight: 500;
		}
		.driverPop-sub-title {
			margin-bottom: 40rpx;
		}
		.driverPop-sub-title-text {
			color: rgba(51, 51, 51, 1);
			font-size: 36rpx;
		}
		.driverPop-label-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}
		.driverPop-label-item-last {
			margin-top: 36rpx;
		}
		.driverPop-label {
			font-size: 40rpx;
			color: rgba(51, 51, 51, 1);
			padding-right: 20rpx;
		}
		.driverPop-input {
			width: 166rpx;
			height: 60rpx;
			border-radius: 8rpx;
			border: 2rpx solid rgba(51, 51, 51, 1);
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			text-align: center;
		}
		.driver-publish {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.driver-publish-btn {
			width: 320rpx;
			height: 68rpx;
			background-color: rgba(0, 150, 235, 1);
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.driver-publish-btn-text {
			color: #FFFFFF;
			font-weight: 500;
			font-size: 32rpx;
		}
		.driver-pop-close {
			position: absolute;
			top: -80rpx;
			right: 0;
			width: 58rpx;
			height: 58rpx;
		}
	}
</style>
