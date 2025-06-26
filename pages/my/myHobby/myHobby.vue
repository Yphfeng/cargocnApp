<template>
	<view class="source-setting">
		<view class="navbar">
			<view class="status-barHeight" :style="{height: statusBarHeight + 'rpx'}" />
			<view class="navBar-center">
			<!-- 	<view class="back" @click="back">
					<image src="/static/images/ship/back-black.png" mode="widthFix" class="back-black"></image>
				</view> -->
			<!-- 	<view class="search-content">
					<input type="text" class="search-input" value="" placeholder="搜索"placeholder-class="placeholderStyle" />
					<image src="/static/images/ship/car-source-search-icon.png" mode="widthFix" class="car-source-search-icon"></image>
				</view> -->
			</view>
			
		</view>
		
		<view class="search-source-item">
			<view class="search-source-title">搜索车辆</view>
			<view class="search-content-center" v-if="hasSearchedVehicleArr.length > 0">
				<view class="search-content-item" v-for="(item, index) in hasSearchedVehicleArr">
					<view class="search-item-inner" :class="{active: isSelectedVehicleIndex == index}" @click="switchVehicle(index)">
						<text>{{item.carLen.typeName}}{{item.carType.typeName}}</text>
						<image src="/static/images/ship/close-ed.png" mode="widthFix" class="close" v-if="isSelectedVehicleIndex == index" @click.stop="delCar(index)"></image>
						<image src="/static/images/ship/car-close.png" mode="widthFix" class="close" v-else  @click.stop="delCar(index)"></image>
					</view>
					
				</view>
			</view>
			<view class="search-add" @click="showNewCarAlert">
				<image src="/static/images/ship/source-add.png" mode="widthFix" class="source-add"></image>
				新增车辆</view>
		</view>
		<view class="search-source-item search-router">
			<view class="search-source-title router">搜索线路</view>
			<view class="search-content-router-center" v-if="hasSearchedRouterArr.length > 0">
				<view class="search-item-router-inner" v-for="(item, index) in hasSearchedRouterArr">
					<view class="addr">{{item.startAddr.subName}}</view>
					<image src="/static/images/ship/source-settings-arrow-right.png" mode="widthFix" class="arrow-right"></image>
					<view class="addr">{{item.arriveAddr.subName}}</view>
					<image src="/static/images/ship/close-router.png" mode="widthFix" class="close-router" @click="delRouter(index)"></image>
				</view>
			</view>
			<view class="router-add" @click="addRoute">
				<image src="/static/images/ship/source-add.png" mode="widthFix" class="router-add-icon"></image>
				新增线路
			</view>
		</view>
		<view class="fix-bottom">
			<view class="send-btn" @click="confirmBack">确定</view>
		</view>
		<uni-popup ref="deletePopUp" type="center" :maskClick="false">
			<!--是否删除-->
			<view class="del">
				<view class="del-content" v-if="willDelData && willDelData.carLen">
					<text>确定删除</text>
					<text>{{willDelData.carLen.typeName}}米{{willDelData.carType.typeName}}吗？</text>
				</view>
				<view class="del-btn">
					<view class="del-btn-item cancel" @click="cancelDel">取消</view>
					<view class="del-btn-item confirm" @click="confirmDel">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="delRouterPopUp" type="center" :maskClick="false">
			<!--是否删除-->
			<view class="del">
				<view class="del-content" v-if="willDelData && willDelData.startAddr">
					<text>确定删除</text>
					<text>{{willDelData.startAddr.name}}-{{willDelData.arriveAddr.name}}线路吗？</text>
				</view>
				<view class="del-btn">
					<view class="del-btn-item cancel" @click="cancelRouterDel">取消</view>
					<view class="del-btn-item confirm" @click="confirmRouterDel">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="newVehiclePopUp" type="bottom">
			<!--新增车辆-->
			<view class="newCar-pop">
				<view class="pop-newCar-title">选择车型</view>
				<view class="pop-newCar-subTitle">
					<text class="main">车长</text>
					<text class="sub">(单选)</text>
				</view>
				<scroll-view :scroll-y="true" :show-scrollbar="true" class="carLen-content">
					<view class="carLen-item" v-for="(item, index) in carLenArr" :key="item.id">
						<view class="carLen-item-inner" @click="switchCarLen(item, index)" :class="{active: index == params.alertVehicleIndex}">{{item.typeName}}</view>
					</view>
				</scroll-view>
				<view class="randBox" />
				<view class="pop-newCar-subTitle">
					<text class="main">车型</text>
					<text class="sub">(单选)</text>
				</view>
				<scroll-view :scroll-y="true" :show-scrollbar="true" class="carLen-content">
					<view class="carLen-item" v-for="(item,index) in carTypeArr" :key="item.id">
						<view class="carLen-item-inner" @click="switchCarType(item, index)" :class="{active: index == params.alertCarTypeIndex}">{{item.typeName}}</view>
					</view>
				</scroll-view>
				<view class="addAlertCar"><view class="addAlertCar-btn" @click="addCarLenAndType">新增</view></view>
			</view>
		</uni-popup>
		<carAddr ref="carAddrRef" @toSearchResult="toSearchResult"></carAddr>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	import carAddr from "@/pages/ship/carSource/carAddr.vue"
	import { mapActions } from 'vuex'
	import * as publicData from "@/utils/publicData"
	export default {
		components: {
			carAddr,
		},
		data() {
			return {
				statusBarHeight: 0,
				hasSearchedVehicleArr: [],
				hasSearchedRouterArr: [],
				isSelectedVehicleIndex: 0,
				isSelectedRouterIndex: 0,
				carLenArr: [],
				carTypeArr: [],
				params: {
					alertVehicleIndex: -1,
					alertCarTypeIndex: -1,
					selectedCarLen: null,
					selectedCarType: null,
				},
				willDelData: null,
				willDelIndex: 0,
				userInfo: null,
				
			}
		},
		onLoad() {
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			console.log(statusBarHeight, '11');
			this.statusBarHeight = statusBarHeight * 2;
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = JSON.parse(userInfo);
			uni.showLoading();
			this.init(); //车型车长
			this.getVehicleDetail();
		},
		methods: {
			...mapActions(['getSettingsInfo', "getVehicleSettingsInfo", "getRouterSettingsInfo"]),
			async init() {
				//初始化数据
				try{
					
					var carLen = await ship.postRequest("/ts/vehicle/length/get")
					var carType = await ship.postRequest("/ts/vehicle/type/get");
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
			async initVehicleSettings() {
				var that = this;
				try{
					var userInfo = uni.getStorageSync("userInfo");
					if (!userInfo) return;
					
					var userCode = JSON.parse(userInfo).attrs.userCode;
					console.log(userCode, 'aa11')
					var res = await ship.postRequest("/ts/myVehicle/show", {
						userCode: userCode
					})
					console.log(res, 'aa')
					if (res.retCode == "0000000") {
						var rspBody = res.rspBody;
						var arr = [];
						var vehicleSid = uni.getStorageSync("car-source-vehicle-sid");
						rspBody.forEach((item, index) => {
							if (vehicleSid && item.sid == vehicleSid) {
								that.isSelectedVehicleIndex = index
							}
							arr.push({
								sid: item.sid,
								carLen: {
									typeName: item.carLength
								},
								carType: {
									typeName: item.carModel
								}
							})
						})
						this.hasSearchedVehicleArr = arr;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			async initRouterSettings() {
				try {
					var userInfo = uni.getStorageSync("userInfo");
					if (!userInfo) return;
					
					var userCode = JSON.parse(userInfo).attrs.userCode;
					console.log(userCode, 'aa11')
					var res = await ship.postRequest("/ts/myCircuit/show", {
						userCode: userCode
					})
					console.log(res, 'aa')
					if (res.retCode == "0000000") {
						var rspBody = res.rspBody;
						var arr = [];
						rspBody.forEach(item => {
							var senderAddr = item.senderAddr;
							var receiverAddr = item.receiverAddr;
							senderAddr = senderAddr.replace(/省|市/, "");
							receiverAddr = receiverAddr.replace(/省|市/, "");
							arr.push({
								sid: item.sid,
								startAddr: {
									subName: senderAddr,
									name: item.senderAddr,
								},
								arriveAddr: {
									subName: receiverAddr,
									name: item.receiverAddr,
								}
							})
						})
						this.hasSearchedRouterArr = arr;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			async getVehicleDetail() {
				//获取车辆相关配置信息
				try{
					var that = this;
					var userInfo = uni.getStorageSync("userInfo");
					if (!userInfo) {
						uni.hideLoading();
						return;
					};
					var userCode = JSON.parse(userInfo).attrs.userCode;
					console.log(userCode, 'aa11')
					var res = await ship.postRequest("/ts/myVehicle/show", {
						userCode: userCode
					})
					console.log(res, 'aa')
					if (res.retCode == "0000000") {
						var rspBody = res.rspBody;
						var arr = [];
						var vehicleSid = uni.getStorageSync("car-source-vehicle-sid");
						rspBody.forEach((item, index) => {
							if (vehicleSid && item.sid == vehicleSid) {
								that.isSelectedVehicleIndex = index
							}
							arr.push({
								sid: item.sid,
								carLen: {
									typeName: item.carLength,
								},
								carType: {
									typeName: item.carModel
								}
							})
						})
						this.hasSearchedVehicleArr = arr;
					}
					var rsp = await ship.postRequest("/ts/myCircuit/show", {
						userCode: userCode
					})
					console.log(rsp, 'aaaaaaa')
					if (rsp.retCode == "0000000") {
						var rspBody = rsp.rspBody;
						var arrRouter = [];
						rspBody.forEach(item => {
							var senderAddr = item.senderAddr;
							var receiverAddr = item.receiverAddr;
							senderAddr = senderAddr.replace(/省|市/, "");
							receiverAddr = receiverAddr.replace(/省|市/, "");
							arrRouter.push({
								sid: item.sid,
								startAddr: {
									name: item.senderAddr,
									subName: senderAddr,
								},
								arriveAddr: {
									name: item.receiverAddr,
									subName: receiverAddr
								}
							})
						})
						console.log(arrRouter, '12qw')
						this.hasSearchedRouterArr = arrRouter;
					} else {
						uni.showToast({
							title: rsp.retDesc,
							icon: 'none'
						})
					}
					uni.hideLoading();
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			switchCarLen(item, index) {
				this.params.selectedCarLen = item;
				this.params.alertVehicleIndex = index;
			},
			switchCarType(item, index) {
				this.params.selectedCarType = item;
				this.params.alertCarTypeIndex = index;
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			delCar(index) {
				this.$refs.deletePopUp.open();
				var hasSearchedVehicleArr = this.hasSearchedVehicleArr;
				this.willDelData = hasSearchedVehicleArr[index];
				this.willDelIndex = index;
			},
			cancelDel() {
				this.$refs.deletePopUp.close();
			},
			cancelRouterDel() {
				this.$refs.delRouterPopUp.close();
			},
			confirmRouterDel() {
				this.cancelRouterDel();
				var willDelIndex = this.willDelIndex;
				var hasSearchedRouterArr = this.hasSearchedRouterArr;
				var willDelData = this.willDelData;
				//线路删除
				uni.showLoading();
				ship.postRequest("/ts/myCircuit/remove", {
					sid: willDelData.sid
				})
				.then(res => {
					uni.hideLoading();
					console.log(res, 'aaaaaa')
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						hasSearchedRouterArr.splice(willDelIndex, 1);
						this.hasSearchedRouterArr = hasSearchedRouterArr;
						this.getRouterSettingsInfo();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
				})
			},
			confirmDel() {
				var willDelIndex = this.willDelIndex;
				var hasSearchedVehicleArr = this.hasSearchedVehicleArr;
				var willDelData = this.willDelData;
				this.$refs.deletePopUp.close();
				var isSelectedVehicleIndex = this.isSelectedVehicleIndex;
				uni.showLoading();
				//确认删除该车辆配置
				ship.postRequest("/ts/myVehicle/remove", {
					sid: willDelData.sid
				}).then(res => {
					console.log(res, willDelData, '删除的参数')
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						hasSearchedVehicleArr.splice(willDelIndex, 1);
						this.hasSearchedVehicleArr = hasSearchedVehicleArr;
						if (isSelectedVehicleIndex == willDelIndex) {
							uni.removeStorageSync("car-source-vehicle-sid");
						}
						this.getVehicleSettingsInfo(); //刷新首页的展示
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
				})
				
			},
			showNewCarAlert() {
				this.$refs.newVehiclePopUp.open();
			},
			addCarLenAndType() {
				//新增车辆
				var that = this;
				if (this.params.alertVehicleIndex < 0 || this.params.alertCarTypeIndex < 0)  {
					uni.showToast({
						title: '请选择车型车长',
						icon: 'none'
					})
					return;
				};
				var selectedCarLen = this.params.selectedCarLen;
				var selectedCarType = this.params.selectedCarType;
				var hasSearchedVehicleArr = this.hasSearchedVehicleArr;
				if (hasSearchedVehicleArr.length < 1) {
					//如果是新增则走这里
					that.$refs.newVehiclePopUp.close();
					uni.showLoading();
					var params = {
						userCode: that.userInfo.attrs.userCode,
						userId: that.userInfo.userId,
						personId: that.userInfo.attrs.personId,
						driverId: that.userInfo.attrs.driverId,
						carModel: selectedCarType.typeName,
						carLength: selectedCarLen.typeName,
					}
					console.log(params, '参数')
					ship.postRequest("/ts/myVehicle/add", params)
					.then(res => {
						console.log(res, 'aa');
						uni.hideLoading();
						if (res.retCode == "0000000") {
							uni.showToast({
								title: '新增成功',
								icon: 'none'
							})
							that.initVehicleSettings();
							that.getVehicleSettingsInfo();
							
							
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						uni.hideLoading();
					})
					
					return;
				} 
				//判断是否有重复的
				var findIndex = hasSearchedVehicleArr.findIndex(item => {
					return item.carLen.typeName == selectedCarLen.typeName && item.carType.typeName == selectedCarType.typeName
				})
				if (findIndex > -1) {
					uni.showToast({
						title: '已添加该车辆，不能重复添加',
						icon: 'none'
					})
					return;
				}
				this.$refs.newVehiclePopUp.close();
				uni.showLoading();
				var params = {
					userCode: that.userInfo.attrs.userCode,
					userId: that.userInfo.userId,
					personId: that.userInfo.attrs.personId,
					driverId: that.userInfo.attrs.driverId,
					carModel: selectedCarType.typeName,
					carLength: selectedCarLen.typeName,
				}
				console.log(params, '参数')
				ship.postRequest("/ts/myVehicle/add", params)
				.then(res => {
					console.log(res, 'aa');
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '新增成功',
							icon: 'none'
						})
						that.initVehicleSettings();
						that.getVehicleSettingsInfo();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
				})
		
			},
			//新增线路
			addRoute() {
				this.$refs.carAddrRef.showPopUp();
			},
			toSearchResult(params) {
				//新增线路确认
				let that = this;
				uni.showLoading();
				//判断是否有重复
				var hasSearchedRouterArr = that.hasSearchedRouterArr;
				var findIndex = hasSearchedRouterArr.findIndex(item => {
					return item.startAddr.name == params.startAddr.name && item.arriveAddr.name == params.arriveAddr.name
				})
				if (findIndex > -1) {
					uni.hideLoading();
					uni.showToast({
						title: '您已新增该线路，无法继续新增',
						icon: 'none'
					})
					return;
				}
				
				var dataParams = {
					userCode: that.userInfo.attrs.userCode,
					userId: that.userInfo.userId,
					personId: that.userInfo.attrs.personId,
					driverId: that.userInfo.attrs.driverId,
					senderAddr: params.startAddr.name,
					receiverAddr: params.arriveAddr.name,
					senderCode: params.startAddr.code,
					receiverCode: params.arriveAddr.code,
					circuitSource: 1,
				}
				console.log(dataParams, '数据11');
				ship.postRequest("/ts/myCircuit/add", dataParams)
				.then(res => {
					uni.hideLoading();
					console.log(res, '新增线路结果')
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '新增成功',
							icon: 'none'
						})
						that.initRouterSettings();
						that.getRouterSettingsInfo(); //更新
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
				})
				
				// this.hasSearchedRouterArr.push(params)
			},
			delRouter(index) {
				//删除线路
				var hasSearchedRouterArr = this.hasSearchedRouterArr;
				this.willDelData = hasSearchedRouterArr[index];
				this.willDelIndex = index;
				this.$refs.delRouterPopUp.open();
			},
			switchVehicle(index) {
				//车辆配置载首页排序
				this.isSelectedVehicleIndex = index;
			},
			confirmBack() {
				//排序确认后返回
				var hasSearchedVehicleArr = this.hasSearchedVehicleArr;
				if (hasSearchedVehicleArr.length < 1) {
					uni.removeStorageSync("car-source-vehicle-sid");
					//存储之后更新存储；
					this.getSettingsInfo();
					setTimeout(() => {
						publicData.setTabbarItem(1);
					}, 500)
					return;
				}
				var isSelectedVehicleIndex = this.isSelectedVehicleIndex;
				var selectedVehicle = hasSearchedVehicleArr[isSelectedVehicleIndex];
				uni.setStorageSync("car-source-vehicle-sid", selectedVehicle.sid);
				//存储之后更新存储；
				this.getSettingsInfo();
				
				setTimeout(() => {
					// uni.navigateBack({
					// 	delta: 1
					// })
					// uni.switchTab({
					// 	url: '/pages/ship/index/index1'
					// })
					publicData.setTabbarItem(1);
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.source-setting {
		background-color: rgba(241, 244, 249, 1);
		min-height: 100vh;
		padding-bottom: 172rpx;
		box-sizing: border-box;
		.newCar-pop {
			height: 80vh;
			display: flex;
			flex-direction: column;
			width: 100vw;
			background-color: #FFFFFF;
			.randBox {
				flex: 1;
			}
			.addAlertCar {
				margin: 92rpx 0 126rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.addAlertCar-btn {
					width: 400rpx;
					height: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #2B72F0;
					border-radius: 16rpx;
					color: #FFFFFF;
					font-weight: 500;
					font-size: 32rpx;
				}
			}
			.pop-newCar-title {
				font-size: 40rpx;
				color: #333333;
				font-weight: 600;
				margin: 68rpx 0 14rpx;
				width: 100vw;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.pop-newCar-subTitle {
				width: 100vw;
				padding: 0 36rpx;
				box-sizing: border-box;
				.main {
					font-size: 36rpx;
					color: #333333;
					font-weight: 500;
				}
				.sub {
					color: #666666;
					font-size: 24rpx;
					font-weight: 400;
				}
			}
			.carLen-content {
				height: 21vh;
				width: 100vw;
				padding: 0 10rpx;
				box-sizing: border-box;
				flex-wrap: wrap;
				margin-top: 30rpx;
				.carLen-item {
					width: 25%;
					height: 72rpx;
					padding: 0 26rpx;
					margin-bottom: 30rpx;
					display: inline-block;
					box-sizing: border-box;
					.carLen-item-inner {
						width: 100%;
						height: 72rpx;
						border-radius: 8rpx;
						box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.22);
						color: #333333;
						font-size: 28rpx;
						font-weight: 400;
						display: flex;
						justify-content: center;
						align-items: center;
						&.active {
							background-color: #4396F8;
							color: #FFFFFF;
						}
					}
					
				}
			}
			
		}
		.del {
			width: 480rpx;
			height: 282rpx;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			.del-content {
				flex: 1;
				width: 480rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				font-weight: 500;
				line-height: 33rpx;
			}
			.del-btn {
				width: 480rpx;
				height: 90rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				border-top: 1px solid #F1F1F1;
				font-size: 28rpx;
				.del-btn-item {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 90rpx;
					&.cancel {
						color: #666666;
						border-right: 1px solid #F1F1F1;
					}
					&.confirm {
						color: #4EADF1;
					}
				}
			}
		}
		.fix-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			height: 172rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 99;
			.send-btn {
				width: 400rpx;
				height: 80rpx;
				border-radius: 8rpx;
				background-color: #2973FA;
				color: #FFFFFF;
				font-weight: 600;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.navBar {
			display: flex;
			flex-direction: column;
			.status-barHeight {
				background-color: rgba(241, 244, 249, 1);
			}
		}
		.navBar-center {
			display: flex;
			flex-direction: row;
			margin-top: 24rpx;
			margin-bottom: 40rpx;
			.placeholderStyle {
				color: rgba(202, 202, 202, 1);
				font-size: 24rpx;
			}
			.back {
				width: 106rpx;
				height: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.back-black {
					width: 16rpx;
				}
			}
			.search-content {
				flex: 1;
				margin-right: 78rpx;
				height: 60rpx;
				border-radius: 12rpx;
				background-color: #FFFFFF;
				box-shadow: 0 0 14rpx 2rpx rgba(202, 222, 255, 0.34);
				position: relative;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				padding-right: 72rpx;
				.search-input {
					flex: 1;
					padding-left: 32rpx;
					box-sizing: border-box;
					font-size: 24rpx;
					color: #666666;
				}
				.car-source-search-icon {
					position: absolute;
					right: 18rpx;
					top: 12rpx;
					width: 36rpx;
				}
			}
		}
		.search-source-item {
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			&.search-router {
				margin-top: 228rpx;
			}
			.search-source-title {
				font-size: 40rpx;
				font-weight: 600;
				line-height: 44rpx;
				padding: 0 34rpx;
				margin-bottom: 30rpx;
				color: #333333;
				&.router {
					margin-bottom: 40rpx;
				}
			}
			.search-content-router-center {
				display: flex;
				flex-direction: column;
				width: 100vw;
				padding: 0 36rpx;
				box-sizing: border-box;
				.search-item-router-inner {
					display: flex;
					background-color: #FFFFFF;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					height: 140rpx;
					width: calc(100vw - 72rpx);
					margin-bottom: 40rpx;
					position: relative;
					border-radius: 24rpx;
					box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.19);
					font-weight: 500;
					font-size: 32rpx;
					color: #333333;
					.close-router {
						position: absolute;
						right: 10rpx;
						top: 10rpx;
						width: 48rpx;
						z-index: 99;
					}
					.arrow-right {
						width: 61rpx;
					}
					.addr {
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						
					}
				}
			}
			.router-add {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				background-color: #FFFFFF;
				border-radius: 24rpx;
				height: 140rpx;
				width: calc(100vw - 72rpx);
				margin-left: 36rpx;
				color: #333333;
				font-size: 32rpx;
				font-weight: 500;
				line-height: 44rpx;
				.router-add-icon {
					width: 40rpx;
					margin-right: 8rpx;
				}
			}
			.search-content-center {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 0 13rpx;
				box-sizing: border-box;
				.search-content-item {
					width: 33.33%;
					padding: 0 23rpx;
					box-sizing: border-box;
					margin-bottom: 30rpx;
					.search-item-inner {
						width: 100%;
						height: 64rpx;
						background-color: rgba(255, 255, 255, 1);
						color: rgba(51, 51, 51, 1);
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 8rpx;
						font-weight: 400;
						box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.19);
						&.active {
							background-color: rgba(67, 150, 248, 1);
							color: #FFFFFF;
							font-weight: 500;
							box-shadow: 0 0 16rpx 2rpx rgba(67, 150, 248, 0.28);
						}
						.close {
							width: 25rpx;
							position: absolute;
							top: -5rpx;
							right: -5rpx;
						}
					}
					
				}
			}
			.search-add {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				width: 198rpx;
				height: 64rpx;
				background-color: #FFFFFF;
				box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.19);
				border-radius: 8rpx;
				color: rgba(51, 51, 51, 1);
				font-size: 26rpx;
				font-weight: 500;
				margin: 0 36rpx;
				.source-add {
					width: 23rpx;
					margin-right: 8rpx;
				}
			}
		}
	}
</style>
