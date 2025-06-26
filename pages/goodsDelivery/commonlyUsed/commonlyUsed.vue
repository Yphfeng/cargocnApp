<template>
	<view class="commonlyUsed">
		<view class="searchHeader">
			<view class="searchBox" @click="showPopUp(3)">
				<image class="searchIcon" src="../../../static/images/goodsDelivery/search.png"></image>
				<view class="searchMsg">{{searchVal ? searchVal : '筛选查询'}}</view>
			</view>
		</view>
		<view class="listBox">
			<view class="contentBorder" v-for="(item, index) in commonlyList" :key="index">
				<view class="commonlyList">
					<view class="addressBox">
						<view class="msg">{{showAddress(item.child.orderAddressVOS, 1)}}</view>
						<view class="addressDistanceBox">
							<view class="distanceMsg" v-if="item.estimatedDistance && item.estimatedDistance > 0">预估里程{{item.estimatedDistance}}km</view>
							<view class="distanceMsg" v-if="!item.estimatedDistance && Number(getDistance(item.child).toFixed(0)) > 0">预估里程{{getDistance(item.child).toFixed(0)}}km</view>
							<image class="icon" src="../../../static/images/goodsDelivery/commonlyAddressIcon.png"></image>
						</view>
						<view class="msg">{{showAddress(item.child.orderAddressVOS, 3)}}</view>
					</view>
					<view class="contentBox">
						<view class="title"><image class="icon1" src="../../../static/images/goodsDelivery/commonlyGoods.png"></image></view>
						<view class="msg">
							<text class="msgText">{{showGoodsName(item)}}</text>
							<text class="msgText">|</text>
							<text class="msgText">{{item.multiTruck == 1 || !item.multiTruck ? '单车' : item.multiTruck + '车'}}</text>
							<text class="msgText">{{item.fixPriceFlag == '1' ? '固价' : '按' + item.child.orderQuoteVO.quotePriceTypeName + '询价'}}</text>
							<text class="msgText">{{showAddressMsg(item.child)}}</text>
						</view>
					</view>
					<view class="contentBox">
						<view class="title"><image class="icon2" src="../../../static/images/goodsDelivery/commonlyCar.png"></image></view>
						<view class="msg">
							<text class="msgText">{{showCarMsg('model', item)}}</text>
							<text class="msgText">{{showCarMsg('length', item)}}</text>
						</view>
					</view>
					<view class="btnGroup">
						<view class="btn" @click="openConfirmPopup(item, index)">取消常发</view>
						<view class="priceBtnBox">
							<view class="priceBox" v-if="item.fixPriceFlag == '1'">
								<text class="syb">¥</text>
								<text class="price">{{item.fixPrice / 100}}/</text>
								<text class="syb">{{item.child.orderQuoteVO.quotePriceTypeName}}</text>
							</view>
							<view class="btn" @click="getOrderAgain(item, index)">再来一单</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loadingBox" v-show="noData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
			</view>
			<view class="loadingBox" v-show="noMore">
				没有更多了~
			</view>
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
			努力加载中…
		</view>
		
		<uni-popup ref="deletePopup" type="center">
			<view class="hintBox">
				<view class="title">是否删除该常发货源？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="closeConfirmPopup()">取消</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @tap="changeCommonState()">确认删除</view>
				</view>
			</view>
		</uni-popup>
		
		
		<uni-popup ref="goodsPopup" type="top">
			<view class="topPopupBox">
				<view class="searchContent">
					<view class="searchBox" @click="showPopUp(3)">
						<image class="searchIcon" src="../../../static/images/goodsDelivery/search.png"></image>
						<text class="searchMsg">运单号查询</text>
					</view>
				</view>
				<view class="item">
					<view class="label">装货地</view>
					<view class="selectWhole" @click="showPopUp(1)">
						
						<view v-if="startAddr.length > 0">
							<text class="addr">{{showAddr(startAddr)}}</text>
						</view>
						<view v-else>
							<text>请选择装货地</text>
						</view>
						<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">卸货地</view>
					<view class="selectWhole" @click="showPopUp(2)">
						<view v-if="arriveAddr.length > 0">
							<text class="addr">{{showAddr(arriveAddr)}}</text>
						</view>
						<view v-else>
							<text>请选择卸货地</text>
						</view>
						<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
					</view>
				</view>
				<view class="popupBtnGroup">
					<view class="btnItem reset" @tap="reset()">重置</view>
					<view class="btnItem find" @tap="find()">查询</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="startPopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">选择地区</text>
					<view class="cancelIconBox" @tap="closePopup()">
						<image class="cancelIcon" src="../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="listAlertWhole">
					<picker-view   :value="goodsVal" @change="bindGoodsChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in provinceArr" :key="index">{{item.name}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in cityArr" :key="index">{{item.name}}</view>
						</picker-view-column>
						<!-- <picker-view-column>
							<view class="item" v-for="(item,index) in areaArr" :key="index">{{item.name}}</view>
						</picker-view-column> -->
					</picker-view>
					
				</view>
				<view class="popupBtnGroup">
					<view class="comfirmBtn" @tap="selectType()">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as service from "@/utils/service.js";
	import * as publicData from "@/utils/publicData.js";
	import {longEvent} from "../../../longLink/consignorlongLink.js";
	export default {
		data() {
			return {
				searchVal: '',
				commonlyList: [],
				isLoading: true,
				pageNum: 1,
				pageSize: 20,
				noData: false,
				noMore: false,
				popupObj: {},
				popupKey: '',
				provinceArr: [],
				cityArr: [],
				areaArr: [],
				goodsVal: [0, 0, 0],
				startAddr: [],
				arriveAddr: [],
				addrType: 1,
				params: {
					senderProvince: '',
					senderCity: '',
					senderArea: '',
					receiverProvince: '',
					receiverCity: '',
					receiverArea: '',
					createdDt: '',
				},
			};
		},
		onLoad() {
			this.getListInfo();
			uni.$on("refreshData_commonlyUsed", (data) => {
				this.getListInfo();
			});
			this.getAreaData();
		},
		onShow() {
			// longEvent(this, () => {});
			// var app = getApp();
			// let that = this;
			// app.globalData.consignorSocketTask.onMessage((res) => {
			// 	console.log("收到服务器内容：" + res.data);
			// });
		},
		onHide() {
			// console.log('tabbar on hide');
			// app.globalData.consignorSocketTask.close({
			// 	success: function (res) {
			// 		console.log('关闭成功', res);
			// 	},
			// 	fail: function (err) {
			// 	  console.log('关闭失败', err);
			// 	}
			// });
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getListInfo();
		},
		onReachBottom() { // 上拉加载
			console.log('上拉加载');
			this.getMoreListInfo();
		},
		methods: {
			async getAreaData() {
				var result = await utils.postRequest("/ts/nationDict/getBasicData");
				var provinceArr = result.rspBody;
				var cityArr = provinceArr[0].cities
				var areaArr = provinceArr[0].cities[0].areas
				this.provinceArr = provinceArr;
				this.cityArr = cityArr;
				this.areaArr = areaArr;
			},
			getListInfo() {
				this.isLoading = true;
				this.noData = false;
				this.noMore = false;
				this.pageNum = 1;
				let params = {
					"pageNum": this.pageNum,
					"pageSize": this.pageSize,
					"loadProvinceCode": this.params.senderProvince ? this.params.senderProvince : undefined,
					"loadCityCode": this.params.senderCity ? this.params.senderCity : undefined,
					"loadAreaCode": this.params.senderArea ? this.params.senderArea : undefined,
					"unloadProvinceCode": this.params.receiverProvince ? this.params.receiverProvince : undefined,
					"unloadCityCode": this.params.receiverCity ? this.params.receiverCity : undefined,
					"unloadAreaCode": this.params.receiverArea ? this.params.receiverArea : undefined,
					"pushTime": undefined,
				}
				console.log('常发查询参数', params);
				let that = this;
				utils.newQueryPostRequest('/td/order/getCommonUseStateList', params)
				.then(res=>{
					that.isLoading = false;
					// console.log('常发列表', res);
					if(res.retCode == '0000000') {
						that.commonlyList = res.rspBody.items;
						console.log(that.commonlyList['0']);
						if(that.commonlyList.length == 0) {
							that.noData = true;
							that.noMore = true;
						}else if(that.commonlyList.length < that.pageSize) {
							that.noMore = true;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					that.isLoading = false;
					console.log(err);
				})
				uni.stopPullDownRefresh();
			},
			getMoreListInfo() {
				if(this.noMore || this.isLoading) {
					return false;
				}
				this.isLoading = true;
				this.pageNum++;
				let params = {
					"pageNum": this.pageNum,
					"pageSize": this.pageSize,
					"loadProvinceCode": this.params.senderProvince ? this.params.senderProvince : undefined,
					"loadCityCode": this.params.senderCity ? this.params.senderCity : undefined,
					"loadAreaCode": this.params.senderArea ? this.params.senderArea : undefined,
					"unloadProvinceCode": this.params.receiverProvince ? this.params.receiverProvince : undefined,
					"unloadCityCode": this.params.receiverCity ? this.params.receiverCity : undefined,
					"unloadAreaCode": this.params.receiverArea ? this.params.senderArea : undefined,
					"pushTime": undefined,
				}
				let that = this;
				utils.newQueryPostRequest('/td/order/getCommonUseStateList', params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								that.commonlyList.push(items[i]);
							}
						}else {
							that.noMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			closeConfirmPopup() { // 关闭确认取消的弹出框
				this.$refs.deletePopup.close()
			},
			openConfirmPopup(item, key) {
				if(!utils.btnRepeat()) return false; // 防抖
				this.popupObj = item;
				this.popupKey = key;
				this.$refs.deletePopup.open()
			},
			changeCommonState() { // 取消常发货源
				let item = this.popupObj;
				let key = this.popupKey;
				let params = {
					sid: item.sid,
					commonUseState: 0,
				}
				let that = this;
				utils.postRequest('/td/order/commonUseState', params)
				.then(function (res) {
					console.log('常发结果', res);
					if(res.retCode == '0000000'){
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						that.commonlyList.splice(key, 1);
						that.$refs.deletePopup.close()
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
				})
			},
			getOrderAgain(item, index) { // 再来一单
				if(!utils.btnRepeat()) return false; // 防抖
				console.log('订单参数', item);
				uni.showLoading({
					title: '加载中'
				});
				this.getBatchNumber();
				setTimeout(()=>{
					let vehicleLength = item.child.orderVehicleLengthVOs;
					var vehicleLengthAry = [];
					for(let i in vehicleLength) {
						let obj = {
							"sid": vehicleLength[i].vehicleLengthCode,
							"typeName": vehicleLength[i].vehicleLength,
						}
						vehicleLengthAry.push(obj);
					}
					let vehicleModel = item.child.orderVehicleModelVOS;
					var vehicleModelAry = [];
					for(let i in vehicleModel) {
						let obj = {
							"sid": vehicleModel[i].vehicleModelCode,
							"typeName": vehicleModel[i].vehicleModel,
						}
						vehicleModelAry.push(obj);
					}
					getApp().globalData.carTypeVo = {
						vehicleLength: vehicleLengthAry,
						vehicleModel: vehicleModelAry,
						vehicleNumber: item.multiTruck ? item.multiTruck : 1,
					};
					let addressAry = item.child.orderAddressVOS;
					let orderContactsVOS = item.child.orderContactsVOS;
					for(let i in addressAry) {
						switch(addressAry[i].serialnumber) {
							case 1:
								getApp().globalData.addressObject.loadGoods1 = {
									batchNumber: addressAry[i].batchNumber,
									address: addressAry[i].address,
									area: addressAry[i].area,
									areaCode: addressAry[i].areaCode,
									city: addressAry[i].city,
									cityCode: addressAry[i].cityCode,
									province: addressAry[i].province,
									provinceCode: addressAry[i].provinceCode,
									serialNumber: 1,
									serialnumber: 1,
									longitude: addressAry[i].longitude,
									latitude: addressAry[i].latitude,
									mobile: addressAry[i].mobile ? addressAry[i].mobile : orderContactsVOS[i].mobile,
									userName: addressAry[i].userName ? addressAry[i].userName : orderContactsVOS[i].userName,
								};
								getApp().globalData.contactUser.user1 = {
									mobile: orderContactsVOS[i].mobile,
									userIds: undefined,
									serialnumber: 1,
									userName: orderContactsVOS[i].userName,
								};
								break;
							case 2:
								getApp().globalData.addressObject.loadGoods2 = {
									batchNumber: addressAry[i].batchNumber,
									address: addressAry[i].address,
									area: addressAry[i].area,
									areaCode: addressAry[i].areaCode,
									city: addressAry[i].city,
									cityCode: addressAry[i].cityCode,
									province: addressAry[i].province,
									provinceCode: addressAry[i].provinceCode,
									serialNumber: 2,
									serialnumber: 2,
									longitude: addressAry[i].longitude,
									latitude: addressAry[i].latitude,
									mobile: addressAry[i].mobile ? addressAry[i].mobile : orderContactsVOS[i].mobile,
									userName: addressAry[i].userName ? addressAry[i].userName : orderContactsVOS[i].userName,
								};
								// getApp().globalData.contactUser.user2 = {
								// 	mobile: orderContactsVOS[i].mobile,
								// 	userIds: undefined,
								// 	serialnumber: 2,
								// 	userName: orderContactsVOS[i].userName,
								// };
								break;
							case 3:
								getApp().globalData.addressObject.unloadGoods1 = {
									batchNumber: addressAry[i].batchNumber,
									address: addressAry[i].address,
									area: addressAry[i].area,
									areaCode: addressAry[i].areaCode,
									city: addressAry[i].city,
									cityCode: addressAry[i].cityCode,
									province: addressAry[i].province,
									provinceCode: addressAry[i].provinceCode,
									serialNumber: 3,
									serialnumber: 3,
									longitude: addressAry[i].longitude,
									latitude: addressAry[i].latitude,
									mobile: addressAry[i].mobile ? addressAry[i].mobile : orderContactsVOS[i].mobile,
									userName: addressAry[i].userName ? addressAry[i].userName : orderContactsVOS[i].userName,
								};
								// getApp().globalData.contactUser.user3 = {
								// 	mobile: orderContactsVOS[i].mobile,
								// 	userIds: undefined,
								// 	serialnumber: 3,
								// 	userName: orderContactsVOS[i].userName,
								// };
								break;
							case 4:
								getApp().globalData.addressObject.unloadGoods2 = {
									batchNumber: addressAry[i].batchNumber,
									address: addressAry[i].address,
									area: addressAry[i].area,
									areaCode: addressAry[i].areaCode,
									city: addressAry[i].city,
									cityCode: addressAry[i].cityCode,
									province: addressAry[i].province,
									provinceCode: addressAry[i].provinceCode,
									serialNumber: 4,
									serialnumber: 4,
									longitude: addressAry[i].longitude,
									latitude: addressAry[i].latitude,
									mobile: addressAry[i].mobile ? addressAry[i].mobile : orderContactsVOS[i].mobile,
									userName: addressAry[i].userName ? addressAry[i].userName : orderContactsVOS[i].userName,
								};
								// getApp().globalData.contactUser.user4 = {
								// 	mobile: orderContactsVOS[i].mobile,
								// 	userIds: undefined,
								// 	serialnumber: 4,
								// 	userName: orderContactsVOS[i].userName,
								// };
								break;
						}
					}
					console.log('再来一单地址信息', getApp().globalData.addressObject);
					let orderLoadTimeRecordVO = item.child.orderLoadTimeRecordVO;
					for(let i in orderLoadTimeRecordVO) {
						switch(orderLoadTimeRecordVO[i].serialnumber) {
							case 1:
								getApp().globalData.loadTimeData.loadTimeObj1 = {
									startTime: '',
									endTime: ''
								};
								break;
							case 2:
								getApp().globalData.loadTimeData.loadTimeObj2 = {
									startTime: orderLoadTimeRecordVO[i].startHours,
									endTime: orderLoadTimeRecordVO[i].endHours,
								};
								break;
							case 3:
								getApp().globalData.loadTimeData.loadTimeObj3 = {
									startTime: orderLoadTimeRecordVO[i].startHours,
									endTime: orderLoadTimeRecordVO[i].endHours,
								};
								break;
							case 4:
								getApp().globalData.loadTimeData.loadTimeObj4 = {
									startTime: orderLoadTimeRecordVO[i].startHours,
									endTime: orderLoadTimeRecordVO[i].endHours,
								};
								break;
						}
					}
					let orderQuoteVO = item.child.orderQuoteVO;
					let orderValueAddedVOS = item.child.orderValueAddedVOS;
					// console.log('11111', orderValueAddedVOS);
					getApp().globalData.orderOtherData = {
						needReceipt: item.receiptType == 1 ? true : false,
						declaredValue: orderValueAddedVOS && orderValueAddedVOS.declaredValue ? orderValueAddedVOS.declaredValue / 100 : undefined,
						guaranteeFlag: orderValueAddedVOS && orderValueAddedVOS.declaredValue ? 1 : 2,
					};
					// console.log(getApp().globalData.orderOtherData);
					getApp().globalData.costInformation = {
						hopePriceSyb: orderQuoteVO.quotePriceTypeName,
						checkedTimeVal: {
							quotationTime: orderQuoteVO.quotePriceTime,
							unitName: '分钟'
						},
						infoPrice: orderQuoteVO.informationPrice / 100,
						quotationWay: item.fixPriceFlag == 1 ||  item.fixPriceFlag == '1' ? 1 : 2,
						hopePrice: item.fixPriceFlag == 1 ||  item.fixPriceFlag == '1' ? item.fixPrice / 100 : orderQuoteVO.quotePrice / 100,
						payType: orderQuoteVO.payType ? orderQuoteVO.payType : '',
						needInvoiceFlag: orderQuoteVO.needInvoiceFlag ? orderQuoteVO.needInvoiceFlag : '',
						oilRate: orderQuoteVO.oilCardRatio,
						needConfirm: item.confirmType ? item.confirmType : 2,
						needInvoiceFlag: orderQuoteVO.payType != 3 ? '' : item.needInvoiceFlag == 1 ? 1 : 2,
					};
					let checkedCarGroup = [];
					if(item.fleetSids) {
						checkedCarGroup = JSON.parse(item.fleetSids);
					}
					getApp().globalData.creatScope = { // 发布范围
						creatTimeType: item.postpone ? item.postpone : 1,
						dateVal: 1,
						hourVal: '',
						minVal: '',
						creatScopeType: checkedCarGroup.length > 0 ? 2 : 1,
						checkedGroup: checkedCarGroup
					};
					getApp().globalData.defaultContact.monthCheckVal = '0';
					getApp().globalData.defaultContact.startCheckedMonth = '0';
					getApp().globalData.defaultContact.startHourCheckVal = '0';
					getApp().globalData.handlingInstructions = {
						handingRequiredVal: [],
						restrictedZoneVal: item.forbiddenZoneType == 1 ? 1 : 2,
						checkedLimit: item.estimatedTime ? 2 : 1,
						agingTime: item.estimatedTime ? item.estimatedTime : '',
						lowTemperature:'',
						highTemperature:'',
						checkedTemperature: item.temperatureSid ? item.temperatureSid : '',
						temperatureMonitor: item.temperatureMonitor ? Number(item.temperatureMonitor) : 3,
					};
					if(item.firstShipperSid) {
						getApp().globalData.otherShipping = { // 货源托运人
							userName: item.firstShipperName,
							userId: item.firstShipperSid
						};
					}
					let orderLoadFactorVOS = item.child.orderLoadFactorVOS;
					if(orderLoadFactorVOS) {
						var orderLoadFactorVOSAry = [];
						for(let i in orderLoadFactorVOS) {
							let obj = {
								typeName: orderLoadFactorVOS[i].loadFactor,
								sid: orderLoadFactorVOS[i].loadFactorCode,
							}
							orderLoadFactorVOSAry.push(obj);
						}
						getApp().globalData.handlingInstructions.handingRequiredVal = orderLoadFactorVOSAry;
					}
					getApp().globalData.temperatureFlag = item.orderType;
					this.getGoodsSid(item.cargoChild);
				}, 500)
			},
			getBatchNumber() { // 是否有批次号，无则重新获取
				let batchNumber = getApp().globalData.batchNumber;
				if(!batchNumber) {
					utils.postRequest('/td/deliver-good/get-batch-number')
					.then(res=>{
						// console.log('批次号', res);
						getApp().globalData.batchNumber = res.rspBody.batchNumber;
					})
					.catch(err=>{
						// console.log(err);
					})
				}
			},
			getGoodsSid(item) { // 货物需重新走一遍保存接口
				let params  = {
					batchNumber: getApp().globalData.batchNumber,
					goodsVO: {
						goodsTypeVO: item.goodsTypeVO,
						goodsPackingVO: item.goodsPackingVO,
						remark: item.remark,
						specify: undefined,
						weight: item.weight,
						volume: item.volume,
						goodsUrl: item.goodsUrl
					}
				}
				// console.log('保存参数', params);
				utils.postRequest('/hy/cargo/addCargo', params)
				.then(res=>{
					// console.log('保存成功', res);
					uni.hideLoading()
					if(res.retCode == '0000000') {
						getApp().globalData.goodsTypeVo = [];
						getApp().globalData.goodsVo = [];
						getApp().globalData.goodsVo = res.rspBody;
						console.log('保存参数', getApp().globalData.goodsVo);
						uni.hideLoading();
						uni.navigateTo({
							url: '../creatOrder/creatOrder?orderAgain=' + 1
						})
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					uni.hideLoading()
					console.log(err);
				})
			},
			showAddress(ary, flag) { // 展示地址
				for(let i in ary) {
					if(ary[i].serialnumber == flag) {
						if(ary[i].cityCode == ary[i].areaCode) {
							return ary[i].province + '-' + ary[i].area;
						}else {
							return ary[i].city + '-' + ary[i].area;
						}
					}
				}
			},
			showGoodsName(item) { // 展示货物信息
				if(!item || !item.cargoChild || !item.cargoChild.goodsTypeVO) {
					return '/';
				}else {
					let returnMsg = '';
					let goodsTypeVo = [];
					let ary = item.cargoChild.goodsTypeVO
					for(let i in ary) {
						if(ary[i].sid == 'diy1') {
							goodsTypeVo.push(ary[i].children['0'].children['0'].children['0'].typeName);
						}else {
							for(let a in ary[i].children) {
								let msg = ary[i].typeName + '-' + ary[i].children['0'].children['0'].children['0'].typeName;
								goodsTypeVo.push(msg);
								
							}
						}
					}
					// console.log(goodsTypeVo);
					let newAry = Array.from(new Set(goodsTypeVo)); // 利用数据结构SET 无重复值特性
					for(let i in newAry) {
						returnMsg = returnMsg + newAry[i] + '/';
					}
					returnMsg = returnMsg.slice(0, returnMsg.length - 1);
					if(item.cargoChild.weight) {
						returnMsg = returnMsg+ ',' + item.cargoChild.weight + '吨';
					}
					if(item.cargoChild.volume) {
						returnMsg = returnMsg + ',' + item.cargoChild.volume + '方';
					}
					return returnMsg;
				}
			},
			showAddressMsg(childObj) {
				let orderAddressVOS = childObj.orderAddressVOS;
				if(orderAddressVOS.length == 2) {
					return '一装一卸';
				}else if(orderAddressVOS.length == 4) {
					return '二装二卸';
				}else if(orderAddressVOS.length == 3) {
					for(let i in orderAddressVOS) {
						if(orderAddressVOS[i].serialnumber == 2) {
							return '二装一卸';
						}else if(orderAddressVOS[i].serialnumber == 4) {
							return '一装二卸';
						}
					}
				}
			},
			showCarMsg(type, item) {
				let ary = [];
				let typeName = '';
				switch(type) {
					case 'model':
						ary = item.child.orderVehicleModelVOS;
						if(ary && ary.length > 0) {
							for(let i in ary) {
								typeName = typeName + ary[i].vehicleModel + '/';
							}
							return typeName.slice(0, typeName.length - 1);
						}else {
							return '冷藏车';
						}
					case 'length':
						ary = item.child.orderVehicleLengthVOs;
						for(let i in ary) {
							typeName = typeName + ary[i].vehicleLength + '米/';
						}
						return typeName.slice(0, typeName.length - 1);
				}
			},
			showPopUp(index) {
				if(!utils.btnRepeat()) return false; // 防抖
				this.addrType = index;
				if (index !== 3) {
					this.goodsVal = [0, 0, 0];
					this.$refs.startPopup.open();
				} else {
					this.$refs.goodsPopup.open();
				}
				
			},
			showAddr(addr) {
				var str = [];
				addr.forEach(item => {
					str.push(item.name)
				})
				return str.join("-")
			},
			bindGoodsChange(e) {
				console.log(e)
				var provinceArr = this.provinceArr;
				var goodsVal = this.goodsVal;
				var val = e.detail.value;
				var proIndex = val[0];
				var cityIndex = val[1];
				var areaIndex = val[2];
				if (goodsVal[0] !== proIndex) {
					this.cityArr = provinceArr[proIndex].cities;
					this.areaArr = provinceArr[proIndex].cities[0].areas
					this.goodsVal = [proIndex, 0, 0]
				} else if (goodsVal[1] !== cityIndex) {
					this.areaArr = provinceArr[proIndex].cities[cityIndex].areas;
					this.goodsVal = [proIndex, cityIndex, 0]
				} else {
					this.goodsVal = [proIndex, cityIndex, areaIndex]
				}
			},
			selectType() {
				var index = this.addrType;
				this.closePopup();
				if (index == 1) {
					//装货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					var areaArr = this.areaArr;
					this.startAddr = [{
						name: provinceArr[goodsVal[0]].name,
						code: provinceArr[goodsVal[0]].code
					},{
						name: cityArr[goodsVal[1]].name,
						code: cityArr[goodsVal[1]].code
					}]
				} else if (index == 2) {
					//表示是卸货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					var areaArr = this.areaArr;
					this.arriveAddr = [{
						name: provinceArr[goodsVal[0]].name,
						code: provinceArr[goodsVal[0]].code
					},{
						name: cityArr[goodsVal[1]].name,
						code: cityArr[goodsVal[1]].code
					}]
				
				} else {
					
				}
			},
			getDistance(item) {
				let lat1, lng1, lat2, lng2;
				let addressAry = item.orderAddressVOS;
				for(let i in addressAry) {
					if(addressAry[i].serialnumber == 1) {
						lat1 = addressAry[i].latitude;
						lng1 = addressAry[i].longitude;
					}
					if(addressAry[i].serialnumber == 3) {
						lat2 = addressAry[i].latitude;
						lng2 = addressAry[i].longitude;
					}
				}
				if(!lat1 || !lng1 || !lat2 || !lng2) {
					return 0;
				}
				// 获取距离公里数
				return service.getDistance(lat1, lng1, lat2, lng2);
			},
			reset() {
				if(!utils.btnRepeat()) return false; // 防抖
				this.startAddr = [];
				this.arriveAddr = [];
				this.goodsVal = [0, 0, 0];
				this.params = {
					senderProvince: '',
					senderCity: '',
					senderArea: '',
					receiverProvince: '',
					receiverCity: '',
					receiverArea: '',
					createdDt: '',
				}
			},
			find() {
				if(!utils.btnRepeat()) return false; // 防抖
				this.$refs.goodsPopup.close();
				var startAddr = this.startAddr;
				var arriveAddr = this.arriveAddr;
				var params = this.params;
				if (startAddr.length > 0) {
					this.params.senderProvince = startAddr[0].code;
					this.params.senderCity = startAddr[1].code;
				}
				if (arriveAddr.length > 0) {
					this.params.receiverProvince = arriveAddr[0].code;
					this.params.receiverCity = arriveAddr[1].code;
				}
				this.getListInfo();
			},
			closePopup() {
				if (this.addrType !== 3) {
					this.$refs.startPopup.close();
				} else {
					this.$refs.goodsPopup.close();
				}
				
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F3F3;
	}
	.commonlyUsed {
		.searchHeader {
			position: fixed;
			top: 0;
			z-index: 1;
			box-sizing: border-box;
			padding: 0 40rpx 32rpx 40rpx;
			height: 86rpx;
			width: 100vw;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 12rpx -2rpx rgba(152,152,152,0.36);
			border-radius: 0px 0px 24rpx 24rpx;
			.searchBox {
				height: 54rpx;
				background: #F5F5F5;
				border-radius: 35rpx;
				padding: 0 18rpx;
				display: flex;
				align-items: center;
				.searchIcon {
					width: 34rpx;
					height: 34rpx;
					margin-right: 18rpx;
				}
				.searchMsg {
					font-size: 24rpx;
					color: #AAAAAA;
					line-height: 34rpx;
				}
			}
		}	
		.listBox {
			padding: 128rpx 16rpx 32rpx 16rpx;
			.contentBorder {
				margin: 0 14rpx;
				padding:2rpx;
				background: linear-gradient(to bottom, rgba(185, 231, 254, 1) 0%, rgba(255, 255, 255, 0) 100%);
				border-radius: 12rpx;
				box-shadow: 0px 6rpx 16rpx 0px rgba(180,219,243,0.39);
			}
			.contentBorder + .contentBorder {
				margin-top: 24rpx;
			}
			.commonlyList {
				background: #FFFFFF;
				border-radius: 12rpx;
				padding: 40rpx 0 26rpx 0;
				.addressBox {
					padding: 0 28rpx 28rpx 28rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					height: 62rpx;
					.msg {
						padding-top:12rpx;
						font-size: 36rpx;
						color: #333333;
						line-height: 50rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
					}
					.addressDistanceBox {
						flex-shrink: 0;
						width: 202rpx;
						margin: 0 26rpx 0 26rpx;
						.icon {
							width:202rpx;
							height: 20rpx;
						}
						.distanceMsg {
							font-size: 22rpx;
							color: #F29347;
							line-height: 32rpx;
							text-align: center;
							margin-bottom:-12rpx;
						}
					}
				}
				.contentBox + .contentBox {
					margin-top:18rpx;
				}
				.contentBox {
					padding: 0 28rpx;
					display: flex;
					.title {
						width: 56rpx;
						height: 40rpx;
						display: flex;
						align-items: center;
						.icon1 {
							width: 26rpx;
							height: 30rpx;
						}
						.icon2 {
							width: 30rpx;
							height: 26rpx;
						}
					}
					.msg {
						flex: 1;
						font-size: 28rpx;
						color: #333;
						line-height: 40rpx;
						.msgText {
							font-size: 28rpx;
							color: #333;
							line-height: 40rpx;
							margin-right: 20rpx;
						}
					}
				}
				.btnGroup {
					padding: 32rpx 28rpx 0 28rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.btn {
						width: 154rpx;
						height: 54rpx;
						line-height: 54rpx;
						border-radius: 35rpx;
						border: 2rpx solid #C6C6C6;
						font-size: 24rpx;
						color: #333333;
						text-align: center;
					}
					.priceBtnBox {
						display: flex;
						align-items: center;
						.priceBox {
							margin-right:16rpx;
							.syb {
								font-size: 24rpx;
								color: #F29347;
							}
							.price {
								font-size: 36rpx;
								color: #F29347;
							}
						}
					}
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
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 1.5s linear infinite;
		        animation: rotating 1.5s linear infinite;
			}
			.noDataIcon {
				width: 244rpx;
				height: 246rpx;
				margin-top:50rpx;
			}
		}
		.hintBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			.title {
				width:560rpx;
				font-size: 32rpx;
				color: #777777;
				text-align: center;
				padding: 40rpx 0 34rpx 0;
				line-height: 44rpx;
			}
			.confirmBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top:2rpx solid #F3F3F3;
				.cancelBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #777777;
					text-align: center;
				}
				.groupLine {
					width: 2rpx;
					height: 94rpx;
					background-color: #F3F3F3;
				}
				.confirmBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #4AA2F3;
					text-align: center;
				}
			}
		}
		.topPopupBox {
			background: #FFFFFF;
			overflow: hidden;
			padding: 0rpx 40rpx 40rpx;
			display: flex;
			flex-direction: column;
			.searchBox {
				background-color: red;
				flex: 1;
				background: #F5F5F5;
				border-radius: 35rpx;
				height: 54rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 0 24rpx;
				margin-bottom: 28rpx;
				margin-left: 0;
				.searchIcon {
					width:34rpx;
					height: 34rpx;
				}
				.searchMsg {
					font-size: 24rpx;
					color:#AAA;
				}
			}
			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 76rpx;
				border: 1px solid #979797;
				border-radius: 24rpx;
				box-sizing: border-box;
				margin-bottom: 24rpx;
				padding: 0 28rpx;
				.label {
					color: #222222;
					font-weight: 500;
					font-size: 28rpx;
				}
				.selectWhole {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					color: #AAAAAA;
					font-size: 28rpx;
					.addr {
						color: #333333;
					}
					.arrow_down {
						width: 30rpx;
						height: 30rpx;
					}
				}
			}
			.popupBtnGroup {
				padding: 0;
				margin-top: 8rpx;
				display: flex;
				overflow: hidden;
				border-radius: 36rpx;
				.btnItem {
					flex: 1;
					height: 72rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					display: flex;
					justify-content: center;
					align-items: center;
					&.reset {
						background-color: #F29347;
					}
					&.find {
						background-color: #4AA2F3;
					}
				}
			}
		}
		.bottomPopupBox {
			background: #FFFFFF;
			border-radius: 36rpx 36rpx 0px 0px;
			overflow: hidden;
			.popupHead {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 36rpx;
				.title {
					height: 110rpx;
					line-height: 110rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
				}
				.cancelIconBox {
					height: 110rpx;
					width: 110rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.cancelIcon {
						width:18rpx;
						height: 18rpx;
					}
				}
			}
			.picker-view {
				height: 400rpx;
				.item {
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.popupBtnGroup {
				padding: 24rpx 36rpx;
				.comfirmBtn {
					height: 96rpx;
					line-height: 96rpx;
					background: #4AA2F3;
					border-radius: 48rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #FFFFFF;
					text-align: center;
				}
			}
		}
		@keyframes rotating {
		    0% {
		        transform:rotate(0deg);
		    }
		    100% {
		        transform:rotate(360deg);
		    }
		}
	}
</style>
