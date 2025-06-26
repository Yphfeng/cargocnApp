<template>
	<view class="newHobby">
		<view  :style="{height: (statusBarHeight + 60) + 'rpx'}" />
		<view class="navBar" :style="{height: (statusBarHeight + 60) + 'rpx'}">
			<view class="status-barHeight" :style="{height: statusBarHeight + 'rpx'}" />
			<view class="navBar-center">
				<view class="back" @click="back">
					<image src="/static/images/ship/back-black.png" mode="widthFix" class="back-black"></image>
				</view>
				<view>{{routerString ? '我的喜好' : ''}}</view>
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
		<view class="newFlexBox">
			<view class="mainTitle" style="margin-top:0;">
				<text class="large">车长车型</text>
				<text class="small">（最多可添加10个）</text>
			</view>
			<view class="addCarBtn" @click="showNewCarAlert">
				<image class="addIcon" src="/static/images/ship/source-add-1.png" mode="widthFix"></image>
				<text class="addMsg">新增</text>
			</view>
		</view>
		<view class="search-content-router-scroll">
			<view class="search-content-item" v-for="(item, index) in hasSearchedVehicleArr">
				<view class="search-item-inner">
					<text>{{item.tagName}}</text>
					<image src="/static/images/ship/car-close.png" mode="widthFix" class="close"  @click.stop="delCar(index)"></image>
				</view>
			</view>
			<view class="noVehicleHint" v-if="hasSearchedVehicleArr && hasSearchedVehicleArr.length == 0">请添加车型车长组合</view>
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
					:class="checkItemRepeat(item.id) > -1 ? 'checkedBtn' : 'btnDefault'"
					@click="toSwitchItem('OFTEN_AREA', '常跑区域', item.id, item.tagValue)">
					{{item.tagValue}}
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
					:class="checkItemRepeat(item.id) > -1 ? 'checkedBtn' : 'btnDefault'"
					@click="toSwitchItem('ROAD_TYPE', '长短途', item.id, item.tagValue)">
					{{item.tagValue}}
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
					:class="checkItemRepeat(item.id) > -1 ? 'checkedBtn' : 'btnDefault'"
					@click="toSwitchItem('FAVORITE_CARGO', '喜好货物', item.id, item.tagValue)">
					{{item.tagValue}}
				</view>
			</view>
		</view>
		<view class="checkedHobbyBoot">
			<view class="checkedHobbyBtn" @click="newSave">我选好了</view>
		</view>
		
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
				routerString: '',
				params: {
					alertVehicleIndex: -1,
					alertCarTypeIndex: -1,
					selectedCarLen: null,
					selectedCarType: null,
				},
				hasSearchedVehicleArr: [],
				willDelData: null,
				willDelIndex: 0,
				hasCheckedItem: []
			};
		},
		onLoad(options) {
			this.routerString = options && options.routerString ? options.routerString : '';
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			// console.log(statusBarHeight, '11');
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userInfo = JSON.parse(userInfo);
				console.log('用户信息', this.userInfo)
				this.init();
				this.getNewBaseInfo();
			}
			this.statusBarHeight = statusBarHeight * 2;
		},
		methods: {
			back() {
				this.newSave();
			},
			toSwitchItem(tagTypeCode, tagTypeName, sid, name) { // 检查是否有重复项，有则删除，无则添加
				let index = this.checkItemRepeat(sid);
				if(index > -1) {
					this.hasCheckedItem.splice(index, 1);
				}else {
					let obj = {
						tagName: name,
						tagSid: sid,
						tagTypeName: tagTypeName,
						tagTypeCode: tagTypeCode,
					}
					this.hasCheckedItem.push(obj);
				}
				this.$forceUpdate();
			},
			checkItemRepeat(sid) { // 检查是否有重复值，若有则返回下标
				let index = this.hasCheckedItem.findIndex(item => item.tagSid == sid);
				return index;
			},
			getMySetting(flag) { // 我的车辆配置
				let params = {
					userId: this.userInfo.userId,
					typeCodeList: ['MY_VEHICLE', 'OFTEN_AREA', 'ROAD_TYPE', 'FAVORITE_CARGO'],
					status: 1
				}
				let that = this;
				ship.postRequest('/yh/upd/tags/find', params)
				.then(function (res) {
					// console.log('新的已配置列表', res);
					if(res.retCode == '0000000'){
						let itemAry = res.rspBody.items;
						if(itemAry && itemAry.length > 0) {
							for(let i in itemAry) {
								if(itemAry[i].tagTypeCode == 'MY_VEHICLE') {
									let obj = {
										tagName: itemAry[i].tagName,
										tagTypeName: itemAry[i].tagTypeName,
										tagTypeCode: itemAry[i].tagTypeCode,
									}
									that.hasSearchedVehicleArr.push(obj);
								}else {
									let obj = {
										tagName: itemAry[i].tagName,
										tagSid: itemAry[i].tagSid,
										tagTypeName: itemAry[i].tagTypeName,
										tagTypeCode: itemAry[i].tagTypeCode,
									}
									that.hasCheckedItem.push(obj);
								}
							}
							// console.log('选中的车型车长', that.hasSearchedVehicleArr);
							// console.log('选中的数据', that.hasCheckedItem);
							that.$forceUpdate();
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
					uni.showToast({
						title: err,
						icon: 'none'
					})
				})
			},
			getNewBaseInfo() { // New配置列表
				let that = this;
				ship.postRequest('/ts/platformTag/get_to_pc')
				.then(function (res) {
					console.log('New配置列表', res);
					if(res.retCode == '0000000'){
						let itemAry = res.rspBody;
						for(let i in itemAry) {
							switch(itemAry[i].tagTypeCode) {
								case 'OFTEN_AREA':
									that.areaList.push(itemAry[i]);
									break;
								case 'ROAD_TYPE':
									that.roadList.push(itemAry[i]);
									break;
								case 'FAVORITE_CARGO':
									that.goodsList.push(itemAry[i]);
									break;
							}
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			async init() {
				//初始化数据
				try{
					var carLen = await ship.postRequest("/ts/vehicle/length/get")
					var carType = await ship.postRequest("/ts/vehicle/type/get");
					// var areaRsp = await ship.postRequest("/ts/area/dict/list"); //长跑区域
					// var roadRsp = await ship.postRequest("/ts/road/type/dict/list"); //长短途
					// var goodsRsp = await ship.postRequest("/ts/favorite/cargo/dict/list"); //喜好货物
					// console.log('长跑区域', areaRsp);
					// console.log('长短途', roadRsp);
					// console.log("喜好货物", goodsRsp)
					if (carLen.retCode == "0000000") {
						var carLenArr = carLen.rspBody.items;
						this.carLenArr = carLenArr;
					} else {
						uni.showToast({
							title: carLen.retDesc,
							icon: 'none'
						})
					}
					if (carType.retCode == "0000000") {
						var carTypeArr = carType.rspBody.items;
						this.carTypeArr = carTypeArr;
					} else {
						uni.showToast({
							title: carType.retDesc,
							icon: 'none'
						})
					}
							
					// if (areaRsp.retCode == "0000000") {
					// 	var areaList = areaRsp.rspBody;
					// 	this.areaList = areaList;
					// } else {
					// 	uni.showToast({
					// 		title: areaRsp.retDesc,
					// 		icon: 'none'
					// 	})
					// }
					// //长短途
					// if (roadRsp.retCode == "0000000") {
					// 	var roadList = roadRsp.rspBody;
					// 	this.roadList = roadList;
					// } else {
					// 	uni.showToast({
					// 		title: roadRsp.retDesc,
					// 		icon: 'none'
					// 	})
					// }
					// //我的喜好货物
					// if (goodsRsp.retCode == "0000000") {
					// 	var goodsList = goodsRsp.rspBody;
					// 	this.goodsList = goodsList;
					// } else {
					// 	uni.showToast({
					// 		title: roadRsp.retDesc,
					// 		icon: 'none'
					// 	})
					// }
					this.getMySetting();
				}catch(e){
					//TODO handle the exception
				}
			},
			newSave() {
				// ("","常跑区域"), ("ROAD_TYPE","长短途"), ("","喜好货物"), ("MY_VEHICLE","我的车辆")
				if(this.hasSearchedVehicleArr.length == 0) {
					uni.showToast({
						title: '请选择车型车长',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				// console.log('已选择数据', this.hasCheckedItem);
				let oIndex = this.hasCheckedItem.findIndex(item => item.tagTypeCode == 'OFTEN_AREA');
				// console.log('常跑区域', oIndex);
				if(oIndex < 0) {
					uni.showToast({
						title: '请选择常跑区域',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				let rIndex = this.hasCheckedItem.findIndex(item => item.tagTypeCode == 'ROAD_TYPE');
				// console.log('长短途', rIndex);
				if(rIndex < 0) {
					uni.showToast({
						title: '请选择长短途',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				let fIndex = this.hasCheckedItem.findIndex(item => item.tagTypeCode == 'FAVORITE_CARGO');
				// console.log('喜好货物', fIndex);
				if(fIndex < 0) {
					uni.showToast({
						title: '请选择喜好货物',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				let params = {
					updTagsVOList: [...this.hasSearchedVehicleArr, ...this.hasCheckedItem],
					typeCodeList: ['OFTEN_AREA', 'ROAD_TYPE', 'FAVORITE_CARGO', 'MY_VEHICLE'],
					personId: this.userInfo.attrs.personId,
					userCode: this.userInfo.attrs.userCode,
					userId: this.userInfo.userId,
					userPhone: this.userInfo.mobile,
				}
				let that = this;
				console.log('保存参数', params);
				ship.postRequest("/yh/upd/tags/edit/with/type", params)
				.then(res => {
					console.log('保存结果', res);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						if(that.routerString) {
							uni.navigateBack({
								delta: 1
							})
						}else {
							var userRole = uni.getStorageSync("userRole");
							publicData.setTabbarItem(userRole);
						}
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
			showNewCarAlert() {
				if(this.hasSearchedVehicleArr > 9) {
					uni.showToast({
						title: '最多添加10个车型车长组合',
						icon: 'none'
					})
				}
				this.$refs.newVehiclePopUp.open();
			},
			switchCarLen(item, index) {
				this.params.selectedCarLen = item;
				this.params.alertVehicleIndex = index;
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
				let obj = {
					tagName: selectedCarLen.typeName  + '米' + selectedCarType.typeName,
					tagTypeName: '我的车辆',
					tagTypeCode: 'MY_VEHICLE',
				}
				this.hasSearchedVehicleArr.unshift(obj);
			},
			delCar(index) {
				var hasSearchedVehicleArr = this.hasSearchedVehicleArr;
				this.willDelData = hasSearchedVehicleArr[index];
				this.willDelIndex = index;
				console.log('删除的车型车长', this.willDelData);
				let carObj = this.willDelData.tagName.split('米');
				let params = {
					"ext1": carObj[1],
					"vehicleLength": carObj[0],
					"driverId": this.userInfo.attrs.driverId
				}
				let that = this;
				ship.postRequest('/yh/vehicle/get/by/model/and/length', params)
				.then(res=>{
					console.log('是否车型车长可删除', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody;
						if(rspBody && rspBody.length > 0) {
							uni.showToast({
								title: '请去车辆管理删除车辆！',
								icon: 'none'
							})
						}else {
							that.$refs.deletePopUp.open();
						}
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			cancelDel() {
				this.$refs.deletePopUp.close();
			},
			confirmDel() {
				this.$refs.deletePopUp.close();
				this.hasSearchedVehicleArr.splice(this.willDelIndex, 1);
			},
			switchCarType(item, index) {
				this.params.selectedCarType = item;
				this.params.alertCarTypeIndex = index;
			},
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
		.newFlexBox {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top:24rpx;
			.addCarBtn {
				padding: 0 36rpx 0 0;
				display: flex;
				align-items: center;
				.addIcon {
					width: 32rpx;
					height: 32rpx;
				}
				.addMsg {
					font-size: 28rpx;
					color: #2973FA;
					line-height: 44rpx;
					padding-left:8rpx;
				}
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
		.search-content-router-scroll {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 0 4rpx 36rpx;
			box-sizing: border-box;
			.noVehicleHint {
				flex: 1;
				padding: 30rpx 0;
				font-size:28rpx;
				color:#999;
				text-align: center;
			}
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
				.close {
					width: 25rpx;
					position: absolute;
					top: -10rpx;
					right: 0rpx;
					z-index: 9;
					
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
	}
</style>
