<template>
	<view class="shipSource-setting">
		<view class="navbar">
			<view class="status-barHeight" :style="{height: statusBarHeight + 'rpx',backgroundColor: '#ffffff'}" />
			<view class="navBar-center">
				<view class="back" @click="back">
					<image src="/static/images/ship/back-black.png" mode="widthFix" class="back-black"></image>
				</view>
				<view>配置</view>
			<!-- 	<view class="search-content">
					<input type="text" class="search-input" value="" placeholder="搜索"placeholder-class="placeholderStyle" />
					<image src="/static/images/ship/car-source-search-icon.png" mode="widthFix" class="car-source-search-icon"></image>
				</view> -->
			</view>
			
		</view>
		
		<view class="search-source-item" :style="{height: contentHeight + 'rpx'}">
			<view class="search-source-item-main">
				<view class="search-source-title">搜索车辆</view>
				<view class="search-add" @click="showNewCarAlert">
					<image src="/static/images/ship/source-add-1.png" mode="widthFix" class="source-add"></image>
					新增车辆</view>
			</view>
			<scroll-view class="search-content-center" :scroll-y="true" :style="{height: (contentHeight - 110) + 'rpx'}" v-if="hasSearchedVehicleArr.length > 0">
				<view class="search-content-router-scroll">
					<view class="search-content-item" v-for="(item, index) in hasSearchedVehicleArr">
						<view class="search-item-inner">
							<text>{{item.tagName}}</text>
							<image src="/static/images/ship/car-close.png" mode="widthFix" class="close" @click.stop="delCar(index)"></image>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="search-content-center" :style="{height: (contentHeight - 110) + 'rpx'}" v-else/>
		</view>
		<view class="search-source-item" :style="{height: contentHeight + 'rpx'}">
			<view class="search-source-item-main">
				<view class="search-source-title">搜索线路</view>
				<view class="search-add" @click="addRoute">
					<image src="/static/images/ship/source-add-1.png" mode="widthFix" class="source-add"></image>
					新增线路
				</view>
			</view>
			<scroll-view class="search-content-router-center" :scroll-y="true" :style="{height: (contentHeight - 110) + 'rpx'}" v-if="hasSearchedRouterArr.length > 0">
			
				<view class="search-content-router-scroll">
					<view class="search-item-router-inner" v-for="(item, index) in hasSearchedRouterArr">
						<view class="search-item-router-inner-item">
							<view class="addr">{{item.senderName}}</view>
							<image src="/static/images/ship/source-settings-arrow-right.png" mode="widthFix" class="arrow-right"></image>
							<view class="addr">{{item.receiverName}}</view>
							<image src="/static/images/ship/car-close.png" mode="widthFix" class="close-router" @click="delRouter(index)"></image>			
						</view>
						
					</view>
				</view>
				
			</scroll-view>
			<view v-else class="search-content-router-center" :style="{height: (contentHeight - 110) + 'rpx'}" />
		</view>
		<view class="fix-bottom">
			<view class="send-btn" @click="confirmBack">确定</view>
		</view>
		<uni-popup ref="deletePopUp" type="center" :maskClick="false">
			<!--是否删除-->
			<view class="del">
				<view class="del-content" v-if="willDelData && willDelData.tagName">
					<text>确定删除</text>
					<text>{{willDelData.tagName}}吗？</text>
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
				<view class="del-content" v-if="willDelData && willDelData.senderName">
					<text>确定删除</text>
					<text>{{willDelData.senderName}}-{{willDelData.receiverName}}线路吗？</text>
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
						<view class="carLen-item-inner" @click="switchCarLen(item, index)" :class="{active: index == params.alertVehicleIndex}">{{item.typeName + '米'}}</view>
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
	import carAddr from ".//carAddr.vue"
	// import { mapActions } from 'vuex'
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
				hasEdit: false,
				contentHeight: 0,
			}
		},
		onLoad() {
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			console.log(statusBarHeight, '11');
			this.statusBarHeight = statusBarHeight * 2;
			this.contentHeight = ((windowHeight - statusBarHeight)*2 - 356)/2
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = JSON.parse(userInfo);
			uni.showLoading();
			this.init(); //车型车长
			this.getNewSourceSettingInfo();
		},
		methods: {
			// ...mapActions(['getSettingsInfo', "getVehicleSettingsInfo", "getRouterSettingsInfo"]),
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
			getNewSourceSettingInfo(typeCode) { // 新的已配置列表
				if(this.hasLoadCar) return false;
				this.hasLoadCar = true;
				let typeCodeList = [];
				if(typeCode) {
					typeCodeList.push(typeCode);
				}else {
					typeCodeList = ['MY_VEHICLE', 'MY_CIRCUIT'];
				}
				let params = {
					userId: this.userInfo.userId,
					typeCodeList: typeCodeList,
					status: 1
				}
				let that = this;
				ship.postRequest('/yh/upd/tags/find', params)
				.then(function (res) {
					console.log('新的已配置列表', res);
					if(res.retCode == '0000000'){
						let itemAry = res.rspBody.items;
						if(typeCode == 'MY_VEHICLE') {
							that.hasSearchedVehicleArr = itemAry;
						}
						if(typeCode == 'MY_CIRCUIT') {
							let routerArr = [];
							for(let i in itemAry) {
								let addressAry = itemAry[i].tagName.split('-');
								let senderAddr = addressAry[0].replace(/省|市/, "");
								let receiverAddr = addressAry[1].replace(/省|市/, "");
								let obj = {
									sid: itemAry[i].sid,
									tagName: itemAry[i].tagName,
									senderName: senderAddr,
									receiverName: receiverAddr
								}
								routerArr.push(obj);
							}
							that.hasSearchedRouterArr = routerArr;
						}
						if(!typeCode) {
							for(let i in itemAry) {
								if(itemAry[i].tagTypeCode == 'MY_VEHICLE') {
									that.hasSearchedVehicleArr.push(itemAry[i]);
								}
								if(itemAry[i].tagTypeCode == 'MY_CIRCUIT') {
									let addressAry = itemAry[i].tagName.split('-');
									let senderAddr = addressAry[0].replace(/省|市/, "");
									let receiverAddr = addressAry[1].replace(/省|市/, "");
									let obj = {
										sid: itemAry[i].sid,
										tagName: itemAry[i].tagName,
										senderName: senderAddr,
										receiverName: receiverAddr
									}
									that.hasSearchedRouterArr.push(obj);
								}
							}
						}
						that.$forceUpdate();
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.hideLoading();
					that.hasLoadCar = false;
				})
				.catch(err=>{
					uni.hideLoading();
					that.hasLoadCar = false;
					// that.hasLoadCar = false;
					console.log(err);
					uni.showToast({
						title: err,
						icon: 'none'
					})
				})
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
				let that = this;
				var newParams = {
					userId: that.userInfo.userId,
					tagName: willDelData.tagName,
					// tagSidList: [willDelData.sid],
					typeCodeList: ["MY_CIRCUIT"],
				}
				console.log('new参数', newParams);
				ship.postRequest("/yh/upd/tags/remove/tag/by/user/id", newParams)
				.then(res => {
					console.log(res, 'aa');
					uni.hideLoading();
					if (res.retCode == "0000000") {
						that.getNewSourceSettingInfo('MY_CIRCUIT');
						uni.$emit("refresCarLine");
						getApp().globalData.defaultContact.shipCircultEditFlag = true;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
					console.log('删除车辆失败', err);
				})
			},
			confirmDel() {
				var willDelIndex = this.willDelIndex;
				var hasSearchedVehicleArr = this.hasSearchedVehicleArr;
				var willDelData = this.willDelData;
				this.$refs.deletePopUp.close();
				var isSelectedVehicleIndex = this.isSelectedVehicleIndex;
				console.log('删除的数据', willDelData);
				uni.showLoading();
				// //确认删除该车辆配置
				
				let that = this;
				var newParams = {
					userId: that.userInfo.userId,
					tagName: willDelData.tagName,
					// tagSidList: [willDelData.sid],
					typeCodeList: ["MY_VEHICLE"],
				}
				console.log('new参数', newParams);
				ship.postRequest("/yh/upd/tags/remove/tag/by/user/id", newParams)
				.then(res => {
					console.log(res, 'aa');
					uni.hideLoading();
					if (res.retCode == "0000000") {
						that.getNewSourceSettingInfo('MY_VEHICLE');
						uni.$emit("refresCarLine");
						getApp().globalData.defaultContact.shipVehicleEditFlag = true;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
					console.log('删除车辆失败', err);
				})
			},
			showNewCarAlert() {
				this.$refs.newVehiclePopUp.open();
			},
			addCarLenAndType() {
				//新增车辆
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
				if (hasSearchedVehicleArr && hasSearchedVehicleArr.length > 0) {
					//判断是否有重复的
					var findIndex = hasSearchedVehicleArr.findIndex(item => {
						return item.tagName == selectedCarLen.typeName  + '米' + selectedCarType.typeName
					})
					if (findIndex > -1) {
						uni.showToast({
							title: '已添加该车辆，不能重复添加',
							icon: 'none'
						})
						return;
					}
				}
				this.$refs.newVehiclePopUp.close();
				uni.showLoading();
				let that = this;
				var newParams = {
					tagTypeCode: "MY_VEHICLE",
					tagTypeName: "我的车辆",
					tagName: selectedCarLen.typeName + '米' + selectedCarType.typeName,
					personId: that.userInfo.attrs.personId,
					userCode: that.userInfo.attrs.userCode,
					userId: that.userInfo.userId,
					userPhone: that.userInfo.mobile,
				}
				console.log('new参数', newParams);
				ship.postRequest("/yh/upd/tags/save", newParams)
				.then(res => {
					console.log(res, 'aa');
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '新增成功',
							icon: 'none'
						})
						that.getNewSourceSettingInfo('MY_VEHICLE');
						uni.$emit("refresCarLine");
						getApp().globalData.defaultContact.shipVehicleEditFlag = true;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
					console.log('新增车辆失败', err);
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
					return item.tagName == params.startAddr.name + '-' + params.arriveAddr.name
				})
				if (findIndex > -1) {
					uni.hideLoading();
					uni.showToast({
						title: '您已新增该线路，无法继续新增',
						icon: 'none'
					})
					return;
				}
				var newParams = {
					tagTypeCode: "MY_CIRCUIT",
					tagTypeName: "我的线路",
					tagName: params.startAddr.name + '-' + params.arriveAddr.name,
					personId: that.userInfo.attrs.personId,
					userCode: that.userInfo.attrs.userCode,
					userId: that.userInfo.userId,
					userPhone: that.userInfo.mobile,
					ext1: params.startAddr.code,
					ext2: params.arriveAddr.code,
				}
				console.log('new参数', newParams);
				ship.postRequest("/yh/upd/tags/save", newParams)
				.then(res => {
					console.log(res, 'aa');
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '新增成功',
							icon: 'none'
						})
						that.getNewSourceSettingInfo('MY_CIRCUIT');
						uni.$emit("refresCarLine");
						getApp().globalData.defaultContact.shipCircultEditFlag = true;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
					console.log('新增车辆失败', err);
				})
			},
			delRouter(index) {
				//删除线路
				var hasSearchedRouterArr = this.hasSearchedRouterArr;
				this.willDelData = hasSearchedRouterArr[index];
				console.log(this.willDelData);
				this.willDelIndex = index;
				this.$refs.delRouterPopUp.open();
			},
			confirmBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shipSource-setting {
		background-color: #F1F4F9;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.newCar-pop {
			height: 80vh;
			display: flex;
			flex-direction: column;
			width: 100vw;
			background-color: #FFFFFF;
			border-radius: 24rpx 24rpx 0 0;
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
				padding: 20rpx 36rpx 0;
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
			width: 100vw;
			height: 172rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 99;
			.send-btn {
				width: 400rpx;
				height: 80rpx;
				border-radius: 16rpx;
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
			background-color: #FFFFFF;
			.status-barHeight {
				background-color: #FFFFFF;
				width: 100vw;
			}
		}
		.navBar-center {
			background-color: #FFFFFF;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			height: 82rpx;
			width: 100vw;
			position: relative;
			.back {
				position: absolute;
				left: 4rpx;
				top: 0;
				width: 106rpx;
				height: 82rpx;
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
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
			flex: 1;
			margin-top: 40rpx;
			background-color: #FFFFFF;
			width: calc(100vw - 72rpx);
			margin-left: 34rpx;
			box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.19);
			border-radius: 24rpx;
			.search-source-item-main {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				width: calc(100vw - 72rpx);
				align-items: center;
				margin-bottom: 4rpx;
				padding: 30rpx 26rpx 2rpx 22rpx;
				box-sizing: border-box;
				.search-source-title {
					font-size: 40rpx;
					font-weight: 600;
					line-height: 44rpx;
					color: #333333;
				}
				.search-add {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					background-color: #FFFFFF;
					box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.19);
					border-radius: 8rpx;
					font-size: 32rpx;
					font-weight: 400;
					border-radius: 12rpx;
					color: #2973FA;
					.source-add {
						width: 32rpx;
						margin-right: 8rpx;
					}
				}
			}
			.search-content-router-center {
				flex: 1;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				box-sizing: border-box;
				font-size: 28rpx;
				width: calc(100vw - 72rpx);
				.search-content-router-scroll {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					padding: 0 4rpx 20rpx;
					box-sizing: border-box;
				}
				.search-item-router-inner {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					width: 50%;
					margin-top: 30rpx;
					font-weight: 500;
					font-size: 30rpx;
					color: #333333;
					padding: 0 25rpx;
					box-sizing: border-box;
					.search-item-router-inner-item {
						width: 100%;
						min-height: 86rpx;
						position: relative;
						border-radius: 12rpx;
						display: flex;
						background-color: #FFFFFF;
						flex-direction: row;
						align-items: center;
						justify-content: center;
						box-shadow: 0 0 8rpx 2rpx rgba(131, 177, 255, 0.67);
						padding: 20rpx 10rpx;
						.close-router {
							width: 25rpx;
							position: absolute;
							top: -10rpx;
							right: 0rpx;
							z-index: 9;
						}
						.arrow-right {
							width: 46rpx;
						}
						.addr {
							flex: 1;
							display: flex;
							justify-content: center;
							align-items: center;
							
						}
					}
					
				}
			}
			.search-content-center {
				flex: 1;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				box-sizing: border-box;
				font-size: 28rpx;
				width: calc(100vw - 72rpx);
				.search-content-router-scroll {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					padding: 0 4rpx 20rpx;
					box-sizing: border-box;
				}
				.search-content-item {
					width: 33.33%;
					padding: 0 23rpx;
					box-sizing: border-box;
					margin-top: 30rpx;
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
						box-shadow: 0 0 8rpx 2rpx rgba(131, 177, 255, 0.67);
						&.active {
							background-color: rgba(67, 150, 248, 1);
							color: #FFFFFF;
							font-weight: 500;
							box-shadow: 0 0 16rpx 2rpx rgba(67, 150, 248, 0.28);
						}
						.close {
							width: 25rpx;
							position: absolute;
							top: -10rpx;
							right: 0rpx;
							z-index: 9;
							
						}
					}
					
				}
			}
		}
	}
</style>
