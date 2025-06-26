<template>
	<view class="newHobby">
		<view  :style="{height: (statusBarHeight + 60) + 'rpx'}" />
		<view class="navBar" :style="{height: (statusBarHeight + 60) + 'rpx'}">
			<view class="status-barHeight" :style="{height: statusBarHeight + 'rpx'}" />
			<view class="navBar-center">
				<view class="back" @click="back">
					<image src="/static/images/ship/back-black.png" mode="widthFix" class="back-black"></image>
				</view>
				<view>我的喜好</view>
			<!-- 	<view class="search-content">
					<input type="text" class="search-input" value="" placeholder="搜索"placeholder-class="placeholderStyle" />
					<image src="/static/images/ship/car-source-search-icon.png" mode="widthFix" class="car-source-search-icon"></image>
				</view> -->
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
		<view class="mainTitle">
			<text class="large">车长</text>
			<text class="small">（多选）</text>
		</view>
		<view class="checkedBox" :scroll-y="true">
			<view class="checkedBox_container">
				<view
					class="checkedBtnList"
					v-for="(item, lengthKey) in carLenArr"
					:key="lengthKey"
					:class="item.active ? 'checkedBtn' : 'btnDefault'"
					@click="switchCarLen(lengthKey)">
					{{item.typeName}}
				</view>
			</view>
			
		</view> 
		
		<view class="mainTitle">
			<text class="large">车型</text>
			<text class="small">（多选）</text>
		</view>
		<view class="checkedBox">
			<view class="checkedBox_container">
				<view
					class="checkedBtnList"
					v-for="(item, typehKey) in carTypeArr"
					:key="typehKey"
					:class="item.active ? 'checkedBtn' : 'btnDefault'"
					@click="switchCarType(typehKey)">
					{{item.typeName}}
				</view>
			</view>
			
		</view>
		<view class="mainTitle">
			<text class="large">常跑区域</text>
			<text class="small">（多选）</text>
		</view>
		<view class="checkedBox">
			<view class="checkedBox_container">
				<view
					class="checkedBtnList"
					v-for="(item, typehKey) in areaList"
					:key="typehKey"
					:class="item.active ? 'checkedBtn' : 'btnDefault'"
					@click="switchArea(typehKey)">
					{{item.areaName}}
				</view>
			</view>
		</view>
		<view class="mainTitle">
			<text class="large">长短途</text>
			<text class="small">（多选）</text>
		</view>
		<view class="checkedBox">
			<view class="checkedBox_container">
				<view
					class="checkedBtnList"
					v-for="(item, typehKey) in roadList"
					:key="typehKey"
					:class="item.active ? 'checkedBtn' : 'btnDefault'"
					@click="switchRoad(typehKey)">
					{{item.roadTypeName}}
				</view>
			</view>
		</view>
		<view class="mainTitle">
			<text class="large">喜好货物</text>
			<text class="small">（多选）</text>
		</view>
		<view class="checkedBox" :scroll-y="true">
			<view class="checkedBox_container">
				<view
					class="checkedBtnList"
					v-for="(item, typehKey) in goodsList"
					:key="typehKey"
					:class="item.active ? 'checkedBtn' : 'btnDefault'"
					@click="switchGoods(typehKey)">
					{{item.favoriteCargoName}}
				</view>
			</view>
		</view>
		<view class="checkedHobbyBoot">
			<view class="checkedHobbyBtn" @click="toSaveHobby">我选好了</view>
		</view>

	</view>
</template>

<script>
	import * as publicData from "@/utils/publicData.js";
	import * as ship from "@/utils/ship";
	export default {
		data() {
			return {
				statusBarHeight: 0,
				areaList: [],
				roadList: [],
				goodsList: [],
				carLenArr: [],
				carTypeArr: [],
				hintSwiperText: '请选择您关注的车长车型，我们将为您推荐优质货主',
				checkedLength: '',
				checkedType: '',
				checkedArea: '',
				
			};
		},
		onLoad() {
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			console.log(statusBarHeight, '11');
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userInfo = JSON.parse(userInfo);
				this.init();
			}
			this.statusBarHeight = statusBarHeight * 2;
		},
		methods: {
			back() {
				this.toSaveHobby();
			},
			switchCarLen(index) {
				var carLenArr = this.carLenArr;
				var active = carLenArr[index].active;
				carLenArr[index].active = !active;
				this.carLenArr = carLenArr;
				this.$forceUpdate();
			},
			switchCarType(index) {
				var carTypeArr = this.carTypeArr;
				var active = carTypeArr[index].active;
				carTypeArr[index].active = !active;
				this.carTypeArr = carTypeArr;
				this.$forceUpdate();
			},
			switchArea(index) {
				var areaList = this.areaList;
				var active = areaList[index].active;
				areaList[index].active = !active;
				this.areaList = areaList;
				this.$forceUpdate();
			},
			switchRoad(index) {
				var roadList = this.roadList;
				var active = roadList[index].active;
				roadList[index].active = !active;
				this.roadList = roadList;
				this.$forceUpdate();
			},
			switchGoods(index) {
				var goodsList = this.goodsList;
				var active = goodsList[index].active;
				goodsList[index].active = !active;
				this.goodsList = goodsList;
				this.$forceUpdate();
			},
			async init() {
				//初始化数据
				try{
					var carLen = await ship.postRequest("/ts/vehicle/length/get")
					var carType = await ship.postRequest("/ts/vehicle/type/get");
					var areaRsp = await ship.postRequest("/ts/area/dict/list"); //长跑区域
					var roadRsp = await ship.postRequest("/ts/road/type/dict/list"); //长短途
					var goodsRsp = await ship.postRequest("/ts/favorite/cargo/dict/list"); //喜好货物
					var hasCarInfo = await ship.postRequest("/yh/personas/select", {
						userCode: this.userInfo.attrs.userCode,
						userId: this.userInfo.userId,
					}) //我的车辆信息
					var hasArea = await ship.postRequest("/ts/my/area/dict/queryByUser", {
						userCode: this.userInfo.attrs.userCode,
					}) //我的区域信息
					
					var hasRoad = await ship.postRequest("/ts/my/road/type/dict/queryByUser", {
						userCode: this.userInfo.attrs.userCode,
					}) //我的长短途信息
					var hasGoods = await ship.postRequest("/ts/my/favorite/cargo/dict/queryByUser", {
						userCode: this.userInfo.attrs.userCode,
					}); //我的喜好货物信息
					console.log("区域信息", hasArea);
					console.log("用户信息", hasCarInfo);
					console.log('车长', carLen);
					console.log('车形', carType);
					console.log("长短途", hasRoad, roadRsp)
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
							
					if (areaRsp.retCode == "0000000") {
						var areaList = areaRsp.rspBody;
						if (hasArea.retCode == "0000000") {
							var fetchAreaList = hasArea.rspBody;
							if (fetchAreaList.length > 0) {
								fetchAreaList.forEach(item => {
									var area = item.area;
									var findIndex = areaList.findIndex(i => {
										return i.areaName == area
									})
									if (findIndex > -1) {
										areaList[findIndex].active = true
									}
								})
								
							}
						} else {
							uni.showToast({
								title: hasArea.retDesc,
								icon: 'none'
							})
						}
						this.areaList = areaList;
					} else {
						uni.showToast({
							title: areaRsp.retDesc,
							icon: 'none'
						})
					}
					//长短途
					if (roadRsp.retCode == "0000000") {
						var roadList = roadRsp.rspBody;
						console.log('长短途', roadList, hasRoad);
						if (hasRoad.retCode == "0000000") {
							
							var fetchRoadList = hasRoad.rspBody;
							if (fetchRoadList.length > 0) {
								fetchRoadList.forEach(item => {
									var roadTypeName = item.roadType;
									var findIndex = roadList.findIndex(i => {
										return i.roadTypeName == roadTypeName
									})
									if (findIndex > -1) {
										roadList[findIndex].active = true
									}
								})
								
							}
						} else {
							uni.showToast({
								title: hasRoad.retDesc,
								icon: 'none'
							})
						}
						this.roadList = roadList;
					} else {
						uni.showToast({
							title: roadRsp.retDesc,
							icon: 'none'
						})
					}
						
						
					//我的喜好货物
					if (goodsRsp.retCode == "0000000") {
						var goodsList = goodsRsp.rspBody;
						console.log('货物', goodsRsp, hasGoods);
						if (hasGoods.retCode == "0000000") {
							
							var fetchGoodsList = hasGoods.rspBody;
							if (fetchGoodsList.length > 0) {
								fetchGoodsList.forEach(item => {
									var favoriteCargoName = item.favoriteCargo;
									var findIndex = goodsList.findIndex(i => {
										return i.favoriteCargoName == favoriteCargoName
									})
									if (findIndex > -1) {
										goodsList[findIndex].active = true
									}
								})
								
							}
						} else {
							uni.showToast({
								title: hasRoad.retDesc,
								icon: 'none'
							})
						}
						this.goodsList = goodsList;
					} else {
						uni.showToast({
							title: roadRsp.retDesc,
							icon: 'none'
						})
					}
						
					
				}catch(e){
					//TODO handle the exception
					
				}
			},
			async toSaveHobby() {
				var carModelList = [], carLengthList = [], areas = [],roadTypes = [], favoriteCargos = [];
				var carTypeArr = this.carTypeArr;
				var  carLenArr = this.carLenArr;
				var areaList = this.areaList;
				var roadList = this.roadList;
				var goodsList = this.goodsList;
				
				carTypeArr.forEach(item => {
					if (item.active) {
						carModelList.push(item.typeName)
					}
				})
				carLenArr.forEach(item => {
					if (item.active) {
						carLengthList.push(item.typeName)
					}
				})
				areaList.forEach(item => {
					if (item.active) {
						areas.push(item.areaName)
					}
				})
				roadList.forEach(item => {
					if (item.active) {
						roadTypes.push(item.roadTypeName)
					}
				})
				goodsList.forEach(item => {
					if (item.active) {
						favoriteCargos.push(item.favoriteCargoName)
					}
				})
				
				
				if (carLengthList.length < 1) {
					uni.showToast({
						title: '请选择车长',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if(carModelList.length < 1) {
					uni.showToast({
						title: '请选择车型',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if(areas.length < 1) {
					uni.showToast({
						title: '请选择常跑区域',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if(roadTypes.length < 1) {
					uni.showToast({
						title: '请选择长短途',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if(favoriteCargos.length < 1) {
					uni.showToast({
						title: '请选择喜好货物',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
				
				if (!this.userInfo) return;
				var userCode = this.userInfo.attrs.userCode;
				
				try{
					uni.showLoading();
					var rsp = await ship.postRequest("/ts/my/area/dict/set", {
						userCode: userCode,
						areas: areas
					})
					console.log(rsp, 'asas');
					if (rsp.retCode != "0000000") {
						uni.hideLoading();
						uni.showToast({
							title: rsp.retDesc,
							icon: 'none'
						})
						return;
					}
					
					
					console.log({
						userCode: userCode,
						userId: this.userInfo.userId,
						personId: this.userInfo.attrs.personId,
						driverId: this.userInfo.attrs.driverId
					}, '保存的用户信息')
					var ret = await ship.postRequest("/yh/personas/save", {
						userCode: userCode,
						userId: this.userInfo.userId,
						personId: this.userInfo.attrs.personId,
						driverId: this.userInfo.attrs.driverId,
						carModelList: carModelList,
						carLengthList: carLengthList,
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
					//保存长短途
					var retRoad = await ship.postRequest("/ts/my/road/type/dict/set", {
						userCode: userCode,
						roadTypes,
					})
					console.log(retRoad, 'assa111');
					if (retRoad.retCode != "0000000") {
						uni.hideLoading();
						uni.showToast({
							title: retRoad.retDesc,
							icon: 'none'
						})
						return;
					}
					
					
					//保存喜好货物
					var retGoods = await ship.postRequest("/ts/my/favorite/cargo/dict/set", {
						userCode: userCode,
						favoriteCargos,
					})
					console.log(retGoods, 'assa111222', {userCode: userCode,
						favoriteCargos,});
					if (retGoods.retCode != "0000000") {
						uni.hideLoading();
						uni.showToast({
							title: retGoods.retDesc,
							icon: 'none'
						})
						return;
					}
					uni.hideLoading();
					uni.navigateBack({
						delta: 1
					})
					// this.userInfo.remindStatus = 1;
					uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
				}catch(e){
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
	}
</style>
