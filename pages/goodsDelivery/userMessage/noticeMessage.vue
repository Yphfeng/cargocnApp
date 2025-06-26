<template>
	<view class="noticeMessage">
		<view class="noticeBox" v-for="(item, index) in userArr" :key="index">
			<view class="contentBox">
				<view class="title">{{item.opTypeName}}<text class="msgDate">{{item.createdDt}}</text></view>
				<view class="msg">{{item.content}}</view>
			</view>
			<view class="detailsBtn" v-if="item.opType == 73 || item.opType == 92" @click="jumpToFleetDetails(item)">查看车队</view>
			<view class="detailsBtn" v-if="item.opType == 74" @click="jumpToOrderDetails(item)">查看货源</view>
			<view class="detailsBtn" v-if="item.opType == 75" @click="jumpToOrderList">查看平台货源</view>
			<view class="detailsBtn" v-if="item.opType == 76" @click="jumpToOrderDetails(item)">查看货源</view>
			<view class="detailsBtn" v-if="item.opType == 80" @click="loginCheckIdNo()">查看身份证</view>
			<view class="detailsBtn" v-if="item.opType == 81" @click="loginCheck('/pages/my/driverVerify/newDriverVerify')">查看驾驶证</view>
			<view class="detailsBtn" v-if="item.opType == 82" @click="loginCheck('/pages/my/carVerify/carList')">查看行驶证</view>
			<view class="detailsBtn" v-if="item.opType == 83" @click="loginCheck('/pages/my/transportVerify/transportVerify')">查看道路运输证</view>
			<view class="detailsBtn" v-if="item.opType == 84" @click="loginCheck('/pages/my/transportVerify/transportVerify')">查看从业资格证</view>
			<view class="detailsBtn" v-if="item.opType == 20" @click="goPurchase()">查看钱包</view>
			<!-- <view class="detailsBtn" v-if="item.opType == 90" @click="jumpToBusinessCard()">查看名片</view>
			<view class="detailsBtn" v-if="item.opType == 91" @click="jumpToBusinessCard()">查看名片</view> -->
			<!-- <view class="detailsBtn" v-if="item.opType == 93" @click="jumpToRedPackage()">查看红包雨</view> -->
			
		</view>
		<view class="loadingBox" v-show="listNoData">
			<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
		</view>
		<view class="loadingBox" v-show="listNoData">
			暂无最新消息
		</view>
		<view class="loadingBox" v-show="noMore">
			没有更多了～
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
			努力加载中…
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData"
	export default {
		data() {
			return {
				pageNum: 1,
				userArr: [],
				listNoData: false,
				noMore: false,
				isLoading: false
			};
		},
		onLoad() {
			this.getNoticeMsg();
		},
		onPullDownRefresh() {
			this.pageNum = 1;
			this.userArr = [];
			this.listNoData = false;
			this.noMore = false;
			this.getNoticeMsg();
		},
		onReachBottom() {
			if(!this.listNoData && !this.noMore){
				this.isLoading = true;
				this.pageNum = this.pageNum + 1;
				this.getNoticeMsg();
			}
		},
		methods: {
			getNoticeMsg() {
				let that = this;
				utils.postRequest("/td/msg/select", { pageNum: that.pageNum, pageSize: 10, types: [6] })
				.then(res=>{
					console.log('小助手消息', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody.items ? res.rspBody.items : [];
						if(that.pageNum == 1 && rspBody && rspBody.length == 0) {
							that.listNoData = true;
						}
						if(rspBody && rspBody.length > 0) {
							for(let i in rspBody) {
								that.userArr.push(rspBody[i]);
							}
						}
						if(rspBody.length < that.pageSize) {
							that.noMore = true;
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.stopPullDownRefresh();
					that.isLoading = false;
				})
				.catch(err=>{
					uni.stopPullDownRefresh();
					that.isLoading = false;
					console.log(err)
				})
			},
			jumpToFleetDetails(data) {
				let obj = {
					id: data.note
				}
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(obj)
				})
				// uni.navigateTo({
				// 	url: '/pages/goodsDelivery/fleetIndex/fleetDetails?info=' + JSON.stringify(obj)
				// })
				
			},
			jumpToOrderList() {
				//跳转平台货源首页
				uni.$emit("switchIndex1");
				uni.switchTab({
					url: '/pages/ship/index/index1'
				})
			},
			async jumpToOrderDetails(item) {
				let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
				if(Number(userRole) == 1) {
					uni.showLoading();
					var supplyDetails = await this.getDriverOrder(item.note);
					if (!supplyDetails) return;
					uni.hideLoading();
					if (supplyDetails.orderSecondState == 15) {
						uni.showToast({
							title: '货源已下架，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					if (supplyDetails.orderSecondState == 18) {
						uni.showToast({
							title: '货源已关闭，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					if (supplyDetails.orderSecondState != 11 && supplyDetails.orderSecondState != 13 && supplyDetails.orderSecondState != 14 && supplyDetails.orderQuotationStatus == undefined && supplyDetails.multiTruck < 2) {
						uni.showToast({
							title: '货源已关闭，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					var multiTruck = supplyDetails.multiTruck;
					var orderQuoation = supplyDetails.orderQuotationStatus;
					if (multiTruck > 1) {
						if ((orderQuoation !== undefined && orderQuoation <= 2)) {
							uni.showToast({
								title: '当前货源已报价',
								icon: 'none'
							})
							return;
						}
					} else {
						if ((orderQuoation !== undefined && orderQuoation <= 2) || orderQuoation > 4) {
							uni.showToast({
								title: '当前货源已报价',
								icon: 'none'
							})
							return;
						}
					}
					
					// uni.navigateTo({
					// 	url: '/pages/ship/quotedPrice/quotedPrice?quoteDetails=' + JSON.stringify(supplyDetails)
					// })
					uni.navigateTo({
						url: '/pages/ship/supplyDetails/supplyDetails?sid=' + item.note + '&status=3'
					})
					
				}else {
					uni.navigateTo({
					    url: '../orderDetails/manyCarsDetail?sid=' + item.note
					});
				}
			},
			async getDriverOrder(sid) {
				console.log('货源的sid', sid)
				var that = this;
				try {
					// that.$refs.bandAlert.open();
					var response = await utils.newQueryPostRequest('/td/circuit/getOrderRecord', {
						sid,
					});
					console.log(response, '详情')
					var supplyDetails = {};
					if (response.retCode == "0000000") {
						var details = response.rspBody;
						supplyDetails = details;
						supplyDetails.needInvoiceFlag = details.needInvoiceFlag;
			
						var platformOrderStatus = 0;
						var platformOrderText = '';
						supplyDetails.sid = details.sid;
						supplyDetails.orderDriverBidSid = details.orderDriverBidSid;
						try {
							//报价状态
							var multiTruck = details.multiTruck;
							var quoteStatus = this.quoteStatus;
							var orderQuotationStatus = details.orderQuotationStatus;
							var orderSecondState = details.orderSecondState;
							if (multiTruck > 1) {
								if (orderQuotationStatus == 2 || orderQuotationStatus > 4) {
									supplyDetails.orderStateText = '货源有效中'
								} else if (orderQuotationStatus == 1 || orderQuotationStatus == 0) {
									supplyDetails.orderStateText = "已接单"
								}  else  {
									supplyDetails.orderStateText = '货源有效中'
								}
							} else {
								if (orderQuotationStatus == undefined || (orderQuotationStatus == 3 && orderSecondState == 13) ) {
									supplyDetails.orderStateText = details.fixPriceFlag == 1 ? "货源有效中" : "报价中"
								} else if (orderQuotationStatus == 1 || orderQuotationStatus == 0) {
									supplyDetails.orderStateText = details.fixPriceFlag == 1 ? '已接单' : "已报价"
								} else if (orderQuotationStatus == 2 || orderQuotationStatus > 4) {
									supplyDetails.orderStateText = "已成交"
								} else if ( (orderQuotationStatus == 3 && orderSecondState != 13) || orderQuotationStatus == 4) {
									supplyDetails.orderStateText = "货源有效中"
								}
							}
							
							supplyDetails.orderQuotationStatus = orderQuotationStatus;
							
							//货源状态
							supplyDetails.orderSecondState = details.orderSecondState;
				
							//报价截止时间
							var endData = details.child.orderQuoteVO.quotePriceFinishDt;
							if (endData) {
								endData = endData.replace(/-/g, "/");
								var date1 = new Date(endData);
								var now1 = new Date();
								var nowStr = new Date().getTime();
								var dateStr = date1.getTime();
								var minuteDis = details.child.orderQuoteVO.quotePriceTime;
								var month = date1.getMonth() + 1;
								var nowDay = now1.getDate();
								var day = date1.getDate();
								var hour = date1.getHours();
								var minutes = date1.getMinutes();
								if (hour < 10) {
									hour = '0' + hour
								}
				
								if (minutes < 10) {
									minutes = '0' + minutes
								}
								console.log(day, nowDay, '当前的天1111');
								if (day != nowDay) {
									month = month < 10 ? '0' + month : month;
									day = day < 10 ? '0' + day : day;
									supplyDetails.quotePriceFinishDt = month + '-' + day + ' ' + hour + ":" + minutes
								} else {
									supplyDetails.quotePriceFinishDt = hour + ":" + minutes
								}
								supplyDetails.minuteDis = minuteDis;
							}
				
							//装卸地址
							var orderAddressVOS = details.child.orderAddressVOS,
								LoadingAndUnloadingMethods = "",
								loadingMethods = "";
							var startAddr = '',
								endAddr = "",
								unLoadingMethods = "",
								zhuangAddress = "",
								xieAddress = "",
								startSerialnumber = "",
								endSerialnumber = "";
							var startDistance = [], endDistance = [];
							orderAddressVOS.forEach(atem => {
								if (atem.serialnumber == 1) {
									if (atem.latitude) {
										startDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										startDistance.push(atem.longitude)
									}
									var province = atem.province;
									if (province.indexOf('市') > -1) {
										//直辖市
										startAddr = atem.province + '-' + atem.city
										zhuangAddress = atem.province + atem.city + atem.address;
									} else {
										startAddr = atem.province + '-' + atem.city + '-' + atem.area;
										zhuangAddress = atem.province + atem.city + atem.area + atem.address;
									}
									loadingMethods = "一装"
									startSerialnumber = 1
								} else if (atem.serialnumber == 2) {
									loadingMethods = "二装"
								} else if (atem.serialnumber == 4) {
									endSerialnumber = 4
									if (atem.latitude) {
										endDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										endDistance.push(atem.longitude)
									}
									var province = atem.province;
									if (province.indexOf('市') > -1) {
										//直辖市
										endAddr = atem.province + '-' + atem.city
										xieAddress = atem.province + atem.city + atem.address;
									} else {
										endAddr = atem.province + '-' + atem.city + '-' + atem.area;
										xieAddress = atem.province + atem.city + atem.area + atem.address;
									}
									unLoadingMethods = "两卸"
								} else if (atem.serialnumber == 3) {
									endSerialnumber = 3
									if (atem.latitude) {
										endDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										endDistance.push(atem.longitude)
									}
									var province = atem.province;
									if (province.indexOf('市') > -1) {
										//直辖市
										endAddr = atem.province + '-' + atem.city
										xieAddress = atem.province + atem.city + atem.address;
									} else {
										endAddr = atem.province + '-' + atem.city + '-' + atem.area;
										xieAddress = atem.province + atem.city + atem.area + atem.address;
									}
				
									unLoadingMethods = "一卸"
								}
							})
							LoadingAndUnloadingMethods = loadingMethods + unLoadingMethods;
							supplyDetails.LoadingAndUnloadingMethods = LoadingAndUnloadingMethods;
							supplyDetails.startAddr = startAddr;
							supplyDetails.endAddr = endAddr;
							supplyDetails.zhuangAddress = zhuangAddress;
							supplyDetails.xieAddress = xieAddress;
							supplyDetails.startSerialnumber = startSerialnumber;
							supplyDetails.endSerialnumber = endSerialnumber;
							supplyDetails.orderAddressVOS = orderAddressVOS;
							//距离装货点的距离
							//当前位置离装货点的距离
							var distance = 0;
							if (this.latitude) {
								distance = publicData.getFlatternDistance(startDistance[0], startDistance[1], this.latitude, this.longitude);
							} else {
								distance = details.distance ? ((details.distance)/1000).toFixed(0) : 0;
							}
							supplyDetails.distance = Number(distance) || 0;
							
							//货主用户信息
							var orderContactsVOS = details.child.orderContactsVOS;
							var orderState = details.orderState;
							var orderQuoation = details.orderQuoation;
							var goodsUserName = '',
								enterpriseName;
							orderContactsVOS.forEach(item => {
								if (item.serialnumber == 1) {
									goodsUserName = item.userName;
								}
							})
							enterpriseName = details.enterpriseName;
							if (this.multiTruck < 2) {
								if (orderState !== 3) {
									goodsUserName = goodsUserName.substring(0, 1) + '**';
									enterpriseName = enterpriseName ? enterpriseName.substring(0, 2) + '****' : '';
								}
							} else {
								if (orderQuoation !== 2) {
									goodsUserName = goodsUserName.substring(0, 1) + '**';
									enterpriseName = enterpriseName ? enterpriseName.substring(0, 2) + '****' : '';
								}
							}
							this.orderContactsVOS = orderContactsVOS;
							supplyDetails.goodsUserName = goodsUserName;
							supplyDetails.enterpriseName = enterpriseName;
							//货物信息相关
							var goodsTypeVO = details.cargoChild.goodsTypeVO,
								goodArr = [];
							var cargoChild = details.cargoChild;
							goodsTypeVO.forEach(atem => {
								var firstName = atem.typeName
								if (atem.children) {
									var atem1 = atem.children;
									atem1.forEach(atem01 => {
										var atem2 = atem01.children;
										if (atem2) {
											atem2.forEach(atem02 => {
												var atem3 = atem02.children;
												if (atem3) {
													atem3.forEach(atem03 => {
														var typeName = atem03.typeName;
														var name = firstName + '-' +
															typeName
														goodArr.push(name)
													})
												}
											})
										}
									})
								}
							})
							var goods = goodArr.join(",");
				
							//单位
							var weight = cargoChild.weight;
							var volume = cargoChild.volume;
							supplyDetails.goods = goods;
							supplyDetails.weight = weight;
							supplyDetails.volume = volume;
							//车长
				
							var cargoChild = details.cargoChild;
							var orderVehicleLengthVOS = details.child.orderVehicleLengthVOs,
								orderVehicleLength = [];
							if (orderVehicleLengthVOS) {
								orderVehicleLengthVOS.forEach(atem => {
									orderVehicleLength.push(atem.vehicleLength)
								})
							}
				
							//车型
							var orderVehicleModelVOS = details.child.orderVehicleModelVOS,
								orderVehicleModel = [];
							if (orderVehicleModelVOS) {
								orderVehicleModelVOS.forEach(atem => {
									orderVehicleModel.push(atem.vehicleModel)
								})
							}
				
				
							orderVehicleLength = orderVehicleLength ? orderVehicleLength.join('/') : '';
							orderVehicleModel = orderVehicleModel ? orderVehicleModel.join("/") : '';
				
							supplyDetails.orderVehicleLength = orderVehicleLength;
							supplyDetails.orderVehicleModel = orderVehicleModel;
				
							//信息费用,默认是分，转化为元
							var orderQuoteVO = details.child.orderQuoteVO;
							var informationPrice = orderQuoteVO.informationPrice / 100;
							//备注
							var remark = details.cargoChild.remark;
							//是否需要回单
							var receiptTypeText = details.receiptType == 1 ? '需要回单' : '不需要回单';
							//图片
				
							var goodsUrl = details.cargoChild.goodsUrl;
							if (goodsUrl) {
								goodsUrl = goodsUrl.split(',')
							}
							supplyDetails.informationPrice = informationPrice;
							supplyDetails.remark = remark;
							supplyDetails.receiptTypeText = receiptTypeText;
							supplyDetails.goodsUrl = goodsUrl;
				
							//最早，最晚装卸货时间
							var orderLoadTimeRecordVO = details.child.orderLoadTimeRecordVO;
							var earlyLoadDt = '',
								earlyUnLoadDt = "",
								endLoadDt = '',
								endUnLoadDt = '';
							orderLoadTimeRecordVO.forEach(item => {
								if (item.serialnumber == 1) {
									var startDt = item.startDt;
									startDt = startDt.replace(/-/g, '/');
									var endDt = item.endDt;
									endDt = endDt.replace(/-/g, '/');
									var nowDate = new Date().getDate();
									var startDate = new Date(startDt).getDate();
									var endDate = new Date(endDt).getDate();
									var hour = new Date(startDt).getHours();
									var minutes = new Date(startDt).getMinutes();
									if (hour < 10) {
										hour = '0' + hour
									}
									if (minutes < 10) {
										minutes = '0' + minutes
									}
				
									var endHour = new Date(endDt).getHours();
									var endMinutes = new Date(endDt).getMinutes();
									if (endHour < 10) {
										endHour = '0' + endHour
									}
									if (endMinutes < 10) {
										endMinutes = '0' + endMinutes
									}
				
									console.log(nowDate, startDate, '日期');
									if (nowDate - startDate == 0) {
										if (hour < 12) {
											earlyLoadDt = "今天上午" + hour + ':' + minutes;
										} else {
											earlyLoadDt = "今天下午" + hour + ':' + minutes;
										}
										
										
									} else if (nowDate - startDate == -1) {
										if (hour < 12) {
											earlyLoadDt = "明天上午" + hour + ':' + minutes;
										} else {
											earlyLoadDt = "明天下午" + hour + ':' + minutes;
										}
									} else if (nowDate - startDate == -2) {
										if (hour < 12) {
											earlyLoadDt = "后天上午" + hour + ':' + minutes;
										} else {
											earlyLoadDt = "后天下午" + hour + ':' + minutes;
										}
									} else {
										earlyLoadDt = item.startDt;
									}
									if (nowDate - endDate == 0) {
										endLoadDt = "今天" + endHour + ':' + endMinutes
									} else if (nowDate - endDate == -1) {
										endLoadDt = "明天" + endHour + ':' + endMinutes
									} else if (nowDate - endDate == -2) {
										endLoadDt = "后天" + endHour + ':' + endMinutes
									} else {
										endLoadDt = item.endDt
									}
				
								} else if (item.serialnumber == 4) {
									earlyUnLoadDt = item.startHours;
									endUnLoadDt = item.endHours
				
								} else if (item.serialnumber == 3) {
									earlyUnLoadDt = item.startHours;
									endUnLoadDt = item.endHours
				
								}
							})
				
							//支付方式
							var payType = details.child.orderQuoteVO.payType;
							supplyDetails.payType = payType;
							supplyDetails.earlyLoadDt = earlyLoadDt;
							supplyDetails.endLoadDt = endLoadDt;
							supplyDetails.earlyUnLoadDt = earlyUnLoadDt;
							supplyDetails.endUnLoadDt = endUnLoadDt;
							//温控
							supplyDetails.temperature = details.temperature;
				
							//是否固定价格货源
							supplyDetails.fixPriceFlag = details.fixPriceFlag;
							supplyDetails.fixPrice = details.fixPrice;
							//是否是冷藏
							supplyDetails.orderType = details.orderType;
							//装卸是否禁区
							supplyDetails.forbiddenZoneType = details.forbiddenZoneType;
							//报价的货物单位
							supplyDetails.quotePriceTypeName = details.child.orderQuoteVO.quotePriceTypeName;
							try {
								if (details.fleetSids) {
									var fleetSids = JSON.parse(supplyDetails.fleetSids);
									var fleetSidsArr = [];
									fleetSids.forEach(item => {
										fleetSidsArr.push(item.name)
									})
									supplyDetails.fleetSids = fleetSidsArr.join(";");
								}
							} catch (e) {
								//TODO handle the exception
							}
							//判断是否是车队货源
							supplyDetails.supply = details.supply;
				
							//判断是否是多车
							supplyDetails.multiTruck = details.multiTruck;
							
							//判断报价单的状态
							supplyDetails.orderQuoation = details.orderQuoation;
							
							var startAddress = details.child.orderAddressVOS[0].address;
							var endAddress = '';
							details.child.orderAddressVOS.map(val => {
								if (!endAddress && val.serialnumber == 3) {
									endAddress = val.address
								}
							})
							var startDt = details.child.orderLoadTimeRecordVO[0].startDt;
							var endDt = details.child.orderLoadTimeRecordVO[0].endDt;
							var startDt1 = '';
							var endDt1 = '';
							console.log(details)
							details.child.orderLoadTimeRecordVO.map(data => {
								if (!startDt1 && data.serialnumber == 3) {
									startDt1 = data.startHours;
									endDt1 = data.endHours;
								}
							})
							var receiptType = details.receiptType;
							var fixPrice = details.fixPrice;
							var remark = details.cargoChild.remark;
							var loadFactor = [];
							details.child.orderLoadFactorVOS.map((data, index) => {
								if (data.loadFactorCode == "diyHeight") {
									loadFactor.push("限高" + data.loadFactor + '米')
								} else if  (data.loadFactorCode == "diyLayer") {
									loadFactor.push("堆垛" + data.loadFactor + '层')
								} else if (data.loadFactorCode == "diyOther") {
									loadFactor.push(data.loadFactor)
								} else {
									loadFactor.push(data.loadFactor)
								}
							})
							loadFactor = loadFactor.join("、");
				
							//在途时效
							supplyDetails.estimatedTime = details.estimatedTime;
							//货源发布时间
							var pushDt = details.pushDt;
							pushDt = pushDt.replace(/-/g, "/");
				
							var mon = new Date(pushDt).getMonth() + 1;
							var day = new Date(pushDt).getDate()
							var hour = new Date(pushDt).getHours() < 10 ? '0' + new Date(pushDt).getHours() : new Date(
								pushDt).getHours();
							var minute = new Date(pushDt).getMinutes() < 10 ? '0' + new Date(pushDt).getMinutes() :
								new Date(pushDt).getMinutes();
							supplyDetails.pushDate = mon + '月' + day + '日';
							supplyDetails.pushTime = hour + ':' + minute;
							supplyDetails.startAddress = startAddress;
							supplyDetails.endAddress = endAddress;
							supplyDetails.startDt = startDt;
							supplyDetails.endDt = endDt;
							supplyDetails.startDt1 = startDt1;
							supplyDetails.endDt1 = endDt1;
							supplyDetails.receiptType = receiptType;
							supplyDetails.remark = remark;
							supplyDetails.loadFactor = loadFactor;
							console.log(supplyDetails, 'aaa')
							return supplyDetails;
							
						} catch (e) {
							//TODO handle the exception
							return null;
						}
					} else {
						uni.showToast({
							title: response.retDesc,
							icon: 'none'
						})
						return null;
					}
					uni.hideLoading();
				} catch (e) {
					//TODO handle the exception
					console.log(e)
					uni.hideLoading();
					return null;
				}
				
			},
			goPurchase() {
				//进入钱包
				if(!publicData.getUserPermissions(1)) {
					uni.showToast({
						title: '请实名认证后再进行操作',
						icon: 'none',
						duration: 2000,
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/userWallet/userWallet'
				})
			},
			loginCheckIdNo() {
				//进入实名认证页面判断是否有身份证信息
				let that = this;
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					var userCode = that.userInfo.attrs.userCode;
				} else {
					var userCode = that.userInfo.attrs.userCode
				}
				uni.showLoading();
				// console.log('用户详细信息参数', params);
				ship.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
				.then(res=>{
					console.log('用户详细信息', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						if (res.rspBody.idNo) {
							uni.navigateTo({
								url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
							})
						} else {
							uni.navigateTo({
								url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
							})
						}
					} else {
						uni.navigateTo({
							url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
				})
				
			},
			loginCheck(pathName) {
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								loginSelf('/pages/my/index/index');
							}
						}
					})
					return false;
				}
				uni.navigateTo({
					url: pathName
				})
			},
			jumpToBusinessCard() {
				console.log('名片跳转');
				// uni.navigateTo({
				// 	url: '/pages/redPacket/index/index'
				// })
			},
			// jumpToRedPackage() {
			// 	uni.navigateTo({
			// 		url: '/pages/redPacket/index/index'
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.noticeMessage {
		padding-top: 38rpx;
		.noticeBox + .noticeBox {
			margin-top: 20rpx;
		}
		.noticeBox {
			margin-left: 38rpx;
			margin-right: 38rpx;
			border-radius: 24rpx;
			box-shadow: 0px 0px 30rpx 2rpx rgba(184,209,251,0.26);
			padding: 18rpx 38rpx 18rpx 28rpx;
			display: flex;
			align-items: center;
			.contentBox {
				flex: 1;
				.title {
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
					line-height: 44rpx;
					.msgDate {
						font-size: 20rpx;
						font-weight: 400;
						color: #646464;
						padding-left:8rpx;
					}
				}
				.msg {
					font-size: 24rpx;
					color: #333333;
					line-height: 44rpx;
				}
			}
			.detailsBtn {
				flex-shrink: 0;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
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
	}
</style>
