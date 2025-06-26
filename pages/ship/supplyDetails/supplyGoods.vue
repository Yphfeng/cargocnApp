<template>
	<view>
	<view class="container" v-if="supplyDetails">
		<view :style="{height: statusBarHeight*2 + 'rpx'}" /> 
		<view class="head1"  :style="{height: '118rpx'}"/>
		<view class="head">
			<view :style="{height: statusBarHeight*2 + 'rpx'}" /> 
			<view class="backContent">
				<image src="../../../static/images/back.png" class="back" @click="back"></image>
				<text class="head-text">货源详情</text>
				<view @click="generate" class="share-whole">
					分享
				</view>
			</view>
		</view>
		<view class="content">
			<view class="notice">{{supplyDetails.LoadingAndUnloadingMethods}}</view>
			<view class="addrContent">
				<view class="addrIcon">
					<view class="addrIcon-item"  :class="{active: index + 1 == supplyDetails.child.orderAddressVOS.length}" v-for="(item, index) in supplyDetails.child.orderAddressVOS">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/zhuang_icon_round.png" class="start" v-if="item.serialnumber < 3"></image>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/xie_icon_2.png" class="end" v-else></image>
						<view class="dot" v-if="index < supplyDetails.child.orderAddressVOS.length - 1">
							<view class="dotted" />
							<view class="dotted" />
							<view class="dotted" />
							<view class="dotted" />
							<view class="dotted" />
						</view>
					</view>
				</view>
				<view class="addrInfo">
					<view class="title"  :class="{active: index + 1 == supplyDetails.child.orderAddressVOS.length}" v-for="(item, index) in supplyDetails.child.orderAddressVOS">
						<view class="addr">{{showSendAddress(supplyDetails, item.serialnumber)}}</view>
						<view class="address">
							{{showAddress(item)}}
						</view>
					</view>
					
				</view>
			</view>
			<view class="pub-date">
					发布时间：{{supplyDetails.pushDate}}  {{supplyDetails.pushTime}}
			</view>
			<view class="userInfo">
				<view class="userContent" @click.stop="call(orderContactsVOS, supplyDetails.startSerialnumber)">
					联系人：
					<view class="pr-16 userName">{{supplyDetails.enterpriseName ? supplyDetails.enterpriseName : supplyDetails.goodsUserName}}</view>
				</view>
				<view class="call" @click="call(orderContactsVOS, supplyDetails.startSerialnumber)">
					点击拨号
					<image class="msgIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone1.png"></image>
				</view>
			</view>
			<view class="km-content">
				<view class="km-item">
					<text class="km-text">{{supplyDetails.estimatedDistance || 0}}km</text>
					<view class="flex-row">
						<text class="black">运输里程</text>
					</view>
				</view>
				<view class="seperate"/>
				<view class="km-item">
					<text class="km-text">{{supplyDetails.distance || 0}}km</text>
					<view class="flex-row">
						<text class="black">距装货地</text>
					</view>
					
				</view>
			</view>
		</view>
		<view class="content">	
			<view class="subTitle">
				车货信息
				<view class="copy" @click="copy(supplyDetails.orderNumber)">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/copy.png" class="copy-icon"></image>
					<text class="copy-title">复制</text>
					<text>{{supplyDetails.orderNumber}}</text>
				</view>
			</view>
			<view class="line"></view>
			<view class="item">
				<view class="label">
					车辆
				</view>
				<view class="labelContent">
					<view class="sub">
						{{supplyDetails.orderVehicleLength}} {{supplyDetails.orderVehicleModel}}
					</view>
					<view class="sub pl-10">
						<text>{{supplyDetails.multiTruck}}车</text>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">
					货物
				</view>
				<view class="labelContent">
					<view class="sub">
						<text class="goods">{{supplyDetails.goods}}</text>
						<text v-if="supplyDetails.volume">{{supplyDetails.volume || 0}}方</text>
						<text v-if="supplyDetails.weight">{{supplyDetails.weight || 0}}{{(supplyDetails.cargoUnit || '吨')}}</text>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">
					装货时间
				</view>
				<view class="labelContent">
					<view class="sub">
						<text>{{supplyDetails.loadDt}}</text>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">
					备注
				</view>
				<view class="labelContent">
					<view class="sub">
						<text>{{supplyDetails.hasRemark || "暂无"}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="content">
			<view class="subTitle">
				支付信息
			</view>
			<view class="line"></view>
			<view class="item">
				<view class="label">
					运费
				</view>
				<view class="labelContent">
					<view class="sub pay">
						<text v-if="supplyDetails.fixPriceFlag == 2">价格电议</text>
						<text v-if="supplyDetails.fixPriceFlag == 1">
							{{showQuotePrice(supplyDetails.fixPrice)}}元/{{orderQuoteVO.quotePriceTypeName}}
						</text>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">
					信息费
				</view>
				<view class="labelContent">
					<view class="sub pay">
						<text>{{supplyDetails.informationPrice || 0}}元</text>
					</view>
				</view>
			</view>
		</view>
	<!-- 	<view class="fix-bottom">
			<view class="phone btn" @click="call(orderContactsVOS, supplyDetails.startSerialnumber)">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone2.png" class="fix-phone-icon"></image>
				电话联系
			</view>
			<view class="price btn" @click="goQuotation">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/fix-icon2.png" class="fix-phone-icon"></image>
				我要接单
			</view>
		</view> -->
		
			
		
	

		<uni-popup ref="confirmPopup1" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent">
					<view class="text">平台最低保证金为<text class="blue">{{marginPrice}}</text>元，您当前余额为<text
							class="blue">{{allAmountWithIn}}</text>元。请充值后再{{supplyDetails.fixPriceFlag == 1 ? '接单' : '报价'}}。
					</view>
					<view class="tips">
						<view class="subTitle">您充值到平台履约保证金账户的资金将用于：</view>
						<view class="tipItem">1.支付信息费（如有）</view>
						<view class="tipItem">2.支付运费担保金（可选）</view>
						<view class="tipItem">3.支付放空担保金（可选）</view>
						<view class="tipItem">4.支付违约金（如发生）</view>
					</view>
				</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="goCharge()">前往充值</view>
				</view>
			</view>
		</uni-popup>
		<view class="popup-box" v-if="isShare">
			<view class="black-box"></view>
			<view class="popup-content">
				<view class="popup-head">分享到</view>
				<view class="popup-row">
					<view class="popup-child" @click="shareEvent('WXSceneSession')">
						<image class="popup-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/weChat.png"
							mode=""></image>
						<view class="">微信好友</view>
					</view>
					<view class="popup-child" @click="shareEvent('WXSenceTimeline')">
						<image class="popup-img"
							src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/circleFriends.png" mode="">
						</image>
						<view class="">朋友圈</view>
					</view>
				</view>
				<view class="cancel-btn" @click="cancelShare">取消</view>
			</view>
		</view>
	</view>
	<uni-popup ref="bandAlert" type="center" :maskClick="false">
		<view class="hintBox verifyHintBox">
			<view class="title">温馨提示</view>
			<view class="alertContent">
				<view class="text">您有已过期的证件，请重新上传！</view>
			</view>
			<view class="bandBtnGroup">
				<view class="cancelBtn" @tap="cancelBand()">取消</view>
				<view class="cancelBtn" @tap="goRecharge()">确定</view>
			</view>
		</view>
	</uni-popup>
	</view>
</template>

<script>
	import * as utils from "../../../utils/ship"
	import * as publicData from "@/utils/publicData";
	import * as dateUtil from "@/utils/utils"
	export default {
		data() {
			return {
				userId: '',
				statusBarHeight: 0,
				hasNotchInScreen: false,
				supplyDetails: null,
				allAmountWithOut: 0,
				allAmountWithIn: 0,
				marginPrice: 0,
				isShare: false,
				orderSid: "",
				isClose: true,
				imgArr: [],
				waybillStatus: 0,
			}
		},
		onLoad(options) {
			var that = this;
			console.log("options",options);
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight;
			//判断是否是全面屏
			var hasNotchInScreen = plus.navigator.hasNotchInScreen();
			this.hasNotchInScreen = hasNotchInScreen;
			//从我的常跑线路进来的
			var sid = options.sid;
			var status = options.status;
			that.waybillStatus = status;
			that.orderSid = options.sid;
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userId = JSON.parse(userInfo).userId;
			}
			uni.getLocation({
				geocode: true,
				type: 'gcj02',
				success: function(res) {
					console.log(res, '定位地址');
					that.longitude = (res.longitude).toFixed(6)
					that.latitude = (res.latitude).toFixed(6)
					that.init(sid);
				},
				fail: function(res) {
					uni.showToast({
						title: '请打开定位',
						icon: 'none'
					})
					that.init(sid);
				}
			})
			
			
			//10人随机
			var quoteNum = Math.floor(Math.random()*10+1);
			this.quoteNum = quoteNum;
			var images = [
				"/static/images/ship/avatar/avatar1.png",
				"/static/images/ship/avatar/avatar2.png",
				"/static/images/ship/avatar/avatar3.png",
				"/static/images/ship/avatar/avatar4.png",
				"/static/images/ship/avatar/avatar5.png",
				"/static/images/ship/avatar/avatar6.png",
				"/static/images/ship/avatar/avatar7.png",
				"/static/images/ship/avatar/avatar8.png",
				"/static/images/ship/avatar/avatar9.png",
				"/static/images/ship/avatar/avatar10.png",
				"/static/images/ship/avatar/avatar11.png",
				"/static/images/ship/avatar/avatar12.png",
			];
			var imgArr = [images[quoteNum], images[quoteNum + 1]];
			this.imgArr = imgArr;
		},
		onShow() {
			this.getRestPrice(); //获取钱包余额
			this.getMarginVODriver(); //获取最低保证金
		},
		methods: {
			showPushDtStyle() {
				var pushDt = this.supplyDetails.pushDt;
				var now = new Date();
				pushDt = pushDt.replace(/-/g, "/");
				pushDt = new Date(pushDt);
				var days = dateUtil.getDaysBetween(pushDt, now);
				if (days > 5) {
					return "font-weight: 600;color: red"
				}
				
			},
			cancelBand() {
				this.$refs.bandAlert.close();
				uni.navigateBack({
					delta: 1
				})
			},
			goRecharge() {
				this.$refs.bandAlert.close();
				uni.navigateBack();
				// var userInfo = uni.getStorageSync("userInfo");
				// if (!userInfo) {
				// 	uni.showModal({
				// 		title: '请登录后操作',
				// 		confirmText: '去登录',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				service.loginSelf(1);
				// 			}
				// 		}
				// 	})
				// 	return
				// }
				// var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				// var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				// var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				// var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				// if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 || faceVerify != 1 ) {
				// 	if (identityVerify !== 1 || faceVerify != 1) {
				// 		uni.navigateTo({
				// 			url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
				// 		})
				// 	} else if (driverVerify !== 1) {
				// 		uni.navigateTo({
				// 			url: '../../my/driverVerify/newDriverVerify'
				// 		})
				// 	} else if (vehicleVerify !== 1) {
				// 		uni.navigateTo({
				// 			url: '../../my/carVerify/newCarVerify'
				// 		})
				// 	}
						
					
				// }
			},
			showName(orderContactsVOS, number) {
				var orderAddress = this.supplyDetails.orderAddressVOS;
				var orderState = this.supplyDetails.orderState;
				var waybillStatus = this.waybillStatus;
				var findIndex = orderAddress.findIndex(item => {
					return item.serialnumber == number
				})
				if (findIndex > -1) {
					var userName = orderAddress[findIndex].userName;
					if (!userName) {
						findIndex = orderContactsVOS.findIndex(item => {
							return item.serialnumber == number
						})
						
						 if (findIndex > -1) {
							var userName = orderContactsVOS[findIndex].userName;
							return waybillStatus != 0 ? userName : userName.substring(0, 1) + '**' 
						 }
						
					} else {
						return waybillStatus != 0 ? userName : userName.substring(0, 1) + '**' 
					}
					
				}
				
				
				
			},
			call(orderContactsVOS, number) {
				var findIndex = orderContactsVOS.findIndex(item => {
					return item.serialnumber == number
				})
				if (findIndex > -1) {
					var mobile = orderContactsVOS[findIndex].mobile;
					uni.makePhoneCall({
					    phoneNumber: mobile //仅为示例
					});
					publicData.addBuried("司机搜索货源拨打货主电话")
				}
			},
			// 点击分享
			generate() {
				let that = this;
				that.isShare = true;
			},
			// 取消分享
			cancelShare() {
				let that = this;
				that.isShare = false;
			},
			// 分享到微信好友或者朋友圈
			shareEvent(type) {
				var that = this;
				that.isShare = false;
				var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				console.log(userInfo)
				var token = userInfo.attrs.token
				let userCode = userInfo.attrs.userCode
				var api = '';
        var shareUrl = ""
				if(utils.ApiRootUrl.indexOf('test')>-1){
					api = 'test'
          shareUrl = "http://m-test.hyzgapp.com/#/share?sid="
				} else {
					api = 'pord'
          shareUrl = "http://m.hyzgapp.com/#/share?sid="
				}
				// 微信好友
				let summary = that.supplyDetails.goods + ','
				if (that.supplyDetails.volume) {
					summary += that.supplyDetails.volume + '方 '
				}
				if (that.supplyDetails.weight) {
					summary = summary + that.supplyDetails.weight + (that.supplyDetails.cargoUnit || '吨') + ' '
				}
				if(that.supplyDetails.fixPriceFlag == '1'){
					summary = summary + that.showQuotePrice(that.supplyDetails.fixPrice) + '元/' + that.orderQuoteVO
					.quotePriceTypeName
				}else{
					// summary = summary + '按' + that.orderQuoteVO.quotePriceTypeName + '询价'
					summary = summary + ', 询价货源'
				}
				
				var orderAddressVOS = this.supplyDetails.orderAddressVOS;
				uni.getLocation({
					geocode: true,
					type: 'gcj02',
					success: function(res) {
						console.log(res, '定位地址');
						var longitude = (res.longitude).toFixed(6)
						var latitude = (res.latitude).toFixed(6)
						console.log("http://m.hyzgapp.com/#/share?sid=" + that.orderSid + "&multiTruck=" + that.supplyDetails.multiTruck + "&token=" + token + '&api=' + api  + '&longitude=' + longitude + '&latitude=' + latitude+ "&userCode=" + userCode )
						uni.share({
							provider: "weixin",
							scene: type,
							type: 0,
							href: shareUrl + that.orderSid + "&supply=" + that.supplyDetails.supply + "&multiTruck=" + that.supplyDetails.multiTruck + "&token=" + token + '&api=' + api  + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode, //
							// title: that.supplyDetails.startAddr + ' ' + that.supplyDetails.endAddr,
							title: "从  "+ that.showAddressMsg(orderAddressVOS[0], 'area') + '  到  ' + that.showAddressMsg(orderAddressVOS[orderAddressVOS.length - 1], 'area'),
							summary: summary,
							imageUrl: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/share_image.png",
							success: function(res) {
								console.log("success:" + JSON.stringify(res));
							},
							fail: function(err) {
								console.log("fail:" + JSON.stringify(err));
							}
						});
					},
					fail: function(res) {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
					}
				})
			},
			debounce(func, wait, params) {
				var that = this;
				if (that.timer) clearTimeout(that.timer);
				that.timer = setTimeout(() => {
					func(params)
				}, wait)

			},
			getMarginVODriver() {
				utils.postRequest("/td/driver/home/getMarginVODriver", {
					version: 1
				}).then(res => {
					console.log(res, '最低保证金')
					if (res.retCode == "0000000") {
						this.marginPrice = res.rspBody.margin;
					}
				})
			},
			showSendAddress(item, index) { // 发货地
				if (index == 1) {
					var obj = {
					 province: item.provinceName1,
					 provinceCode: item.provinceCode1,
					 city: item.cityName1,
					 cityCode: item.cityCode1,
					 area: item.areaName1,
					 areaCode: item.areaCode1,
					}
				} else if (index == 2) {
					var obj = {
					 province: item.provinceName2,
					 provinceCode: item.provinceCode2,
					 city: item.cityName2,
					 cityCode: item.cityCode2,
					 area: item.areaName2,
					 areaCode: item.areaCode2,
					}
				} else if (index == 3) {
					var obj = {
					 province: item.provinceName3,
					 provinceCode: item.provinceCode3,
					 city: item.cityName3,
					 cityCode: item.cityCode3,
					 area: item.areaName3,
					 areaCode: item.areaCode3,
					}
				} else if (index == 4) {
					var obj = {
					 province: item.provinceName4,
					 provinceCode: item.provinceCode4,
					 city: item.cityName4,
					 cityCode: item.cityCode4,
					 area: item.areaName4,
					 areaCode: item.areaCode4,
					}
				}
				
				return this.showAddressMsg(obj);
			},
			showAddressMsg(obj) { // 展示地区
				if(obj.provinceCode == obj.cityCode) {
				 return obj.province
				}else if(obj.cityCode == obj.areaCode) {
				 return obj.province + ' ' +obj.city;
				}else {
				 let returnMsg = obj.province;
				 returnMsg = obj.city ? returnMsg + ' ' + obj.city : returnMsg;
				 returnMsg = obj.area ? returnMsg + ' ' + obj.area : returnMsg;
				 return returnMsg;
				}
			},
			showAddress(obj) { // 展示地址
				let msg = '';
				var address = obj.address || "";
				return address
			},
			getRestPrice() {
				utils.postRequest("/td/driver/home/getAccountBkDriver", {
					version: 1
				}).then(res => {
					console.log(res, '钱包余额')
					if (res.retCode == "0000000") {
						this.allAmountWithIn = (res.rspBody.allAmountWithIn) / 1000;
						this.allAmountWithOut = (res.rspBody.allAmountWithOut) / 1000;
					}
				})
			},
			showQuotePrice(price) {
				return publicData.showPrice(price, 100);
			},
			showAllPrice(price, info) {
				var allPrice = price - info*100;
				var quotePriceTypeName = this.orderQuoteVO.quotePriceTypeName;
				if (quotePriceTypeName == "趟") {
					return publicData.showPrice(allPrice, 100);
				} else {
					return publicData.showPrice(price, 100);
				}
			},
			async init(sid) {
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
						var userId = this.userId;
						var platformOrderStatus = 0;
						var platformOrderText = '';
						var cargoSource = details.cargoSource;
						supplyDetails.sid = details.sid;
						supplyDetails.orderDriverBidSid = details.orderDriverBidSid;
						try {
							//报价状态
							var multiTruck = details.multiTruck;
							var orderQuotationStatus = details.orderQuotationStatus;
							this.orderQuotationStatus = orderQuotationStatus;
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
								
									unLoadingMethods = "两卸"
								} else if (atem.serialnumber == 3) {
									endSerialnumber = 3
									if (atem.latitude) {
										endDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										endDistance.push(atem.longitude)
									}
		

									unLoadingMethods = "一卸"
								}
							})
							//装卸货地址修改
							var orderAddressVOSLen = orderAddressVOS.length;
							if (orderAddressVOSLen) {
								var start_orderAddressVOS = orderAddressVOS[0];
								var end_orderAddressVOS = orderAddressVOS[orderAddressVOSLen - 1];
								var start_province = start_orderAddressVOS.province;
								var start_city = start_orderAddressVOS.city;
								var start_area = start_orderAddressVOS.area;
								var end_province = end_orderAddressVOS.province;
								var end_city = end_orderAddressVOS.city;
								var end_area = end_orderAddressVOS.area;
								var proText, cityText, areaText, startAddr1, startAddr2, endAddr1, endAddr2;
								if (start_province.indexOf("市") > -1) {
									proText = start_province.slice(0,-1);
									if (start_city.indexOf("区") > -1) {
										cityText = start_city.slice(0,-1)
									} else {
										cityText = start_city
									}
									
									startAddr1 = proText 
									startAddr2 = cityText
									startAddr = proText + '-' + cityText
									zhuangAddress = start_orderAddressVOS.province || "" + start_orderAddressVOS.city || "" + start_orderAddressVOS.address || ""
								} else {
									if (start_province.indexOf("省") > -1) {
										proText = start_province.slice(0,-1);
									} else {
										proText = start_province
									}
									if (start_city && start_city.indexOf("市") > -1) {
										cityText = start_city.slice(0,-1);
									} else {
										cityText = start_city
									}
									if (start_area && start_area.indexOf("区") > -1) {
										areaText = start_area.slice(0,-1)
									} else {
										areaText = start_area
									}
									if (cargoSource == "WX_ZKC") {
										startAddr1 = proText;
										startAddr2 = cityText;
										startAddr = proText + '-' + cityText
									} else {
										startAddr1 = cityText;
										startAddr2 = areaText;
										startAddr = cityText + '-' + areaText
									}
									zhuangAddress = start_orderAddressVOS.province || "" + start_orderAddressVOS.city || "" + start_orderAddressVOS.area || "" + start_orderAddressVOS.address || ""
								}
								if (end_province.indexOf('市') > -1) {
									//直辖市
									
									proText = end_province.slice(0,-1);
									
									if (end_city.indexOf("区") > -1) {
										cityText = end_city.slice(0,-1)
									} else {
										cityText = end_city
									}
									endAddr1 = proText
									endAddr2 = cityText
									endAddr = proText + '-' + cityText
									xieAddress = end_orderAddressVOS.province || "" + end_orderAddressVOS.city || "" + end_orderAddressVOS.address || ""
									
								} else {
									if (end_province.indexOf("省") > -1) {
										proText = end_province.slice(0,-1);
									} else {
										proText = end_province
									}
									if (end_city && end_city.indexOf("市") > -1) {
										cityText = end_city.slice(0,-1);
									} else {
										cityText = end_city
									}
									if (end_area && end_area.indexOf("区") > -1) {
										areaText = end_area.slice(0,-1)
									} else {
										areaText = end_area
									}
									if (cargoSource == 'WX_ZKC') {
										endAddr1 = proText;
										endAddr2 = cityText;
										endAddr = proText + '-' + cityText
									} else {
										endAddr1 = cityText;
										endAddr2 = areaText;
										endAddr = cityText + '-' + areaText
									}
									xieAddress = end_orderAddressVOS.province || "" + end_orderAddressVOS.city || "" + end_orderAddressVOS.area || "" + end_orderAddressVOS.address || ""
								}
							}
							
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
							enterpriseName = details.enterpriseName || "";
							this.orderContactsVOS = orderContactsVOS;
							supplyDetails.goodsUserName = goodsUserName;
							supplyDetails.enterpriseName = enterpriseName;
							//货物信息相关
							var goodsTypeVO = details.cargoChild ? details.cargoChild.goodsTypeVO : [],
								goodArr = [];
							var cargoChild = details.cargoChild;
							// if (goodsTypeVO && goodsTypeVO.length > 0) {
							// 	goodsTypeVO.forEach(atem => {
							// 		var firstName = atem.typeName
							// 		if (atem.children) {
							// 			var atem1 = atem.children;
							// 			atem1.forEach(atem01 => {
							// 				var atem2 = atem01.children;
							// 				if (atem2) {
							// 					atem2.forEach(atem02 => {
							// 						var atem3 = atem02.children;
							// 						if (atem3) {
							// 							atem3.forEach(atem03 => {
							// 								var typeName = atem03.typeName;
							// 								var name = firstName + '-' +
							// 									typeName
							// 								goodArr.push(name)
							// 							})
							// 						}
							// 					})
							// 				}
							// 			})
							// 		}
							// 	})
							// }
							
							// var goods = goodArr.join(",");
							var goods = details.cargoTypeName4;
							

							//单位
							var weight = 0;
							var volume = 0;
							//车长
							var cargoChild = details.cargoChild;
							// if (cargoChild) {
							// 	weight = cargoChild.weight;
							// 	volume = cargoChild.volume;
							// }
							weight = details.cargoVolume || 0;
							volume = details.cargoWeight || 0;
							supplyDetails.goods = goods;
							supplyDetails.weight = weight;
							supplyDetails.volume = volume;
							//车长
							var vehicleLength1 = details.vehicleLength1;
							var vehicleLength2 = details.vehicleLength2;
							// 展示车长
							let orderVehicleLength = details.vehicleLength1 ? details.vehicleLength1 : '';
							if (vehicleLength1) {
								orderVehicleLength = vehicleLength1 == '-1' ? '不限车长' : orderVehicleLength + '米';
							}
							if (vehicleLength2) {
								orderVehicleLength = orderVehicleLength + '/' + vehicleLength2 + '米';
							}
							
							var vehicleModel1 = details.vehicleModel1;
							var vehicleModel2 = details.vehicleModel2;
							var vehicleModelArr = [];
							//判断是否有车型
							if (vehicleModel1) {
								vehicleModelArr.push(vehicleModel1);
							}
							if (vehicleModel2) {
								vehicleModelArr.push(vehicleModel2);
							}
							var orderVehicleModel = vehicleModelArr.join("/");

							supplyDetails.orderVehicleLength = orderVehicleLength;
							supplyDetails.orderVehicleModel = orderVehicleModel;

							//信息费用,默认是分，转化为元
							var orderQuoteVO = details.child.orderQuoteVO;
							var informationPrice = orderQuoteVO.informationPrice / 100;
				
							//最早，最晚装卸货时间
							var orderLoadTimeRecordVO = details.child.orderLoadTimeRecordVO;
							var earlyLoadDt = '',
								endLoadDt = "";
							if (orderLoadTimeRecordVO && orderLoadTimeRecordVO.length > 0) {
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
										var type = "", endType = "";
										if (nowDate - startDate == 0) {
											type = "今天"
											earlyLoadDt = hour + ':' + minutes;
										} else if (nowDate - startDate == -1) {
											type = "明天"
											earlyLoadDt = hour + ':' + minutes;
											
										} else if (nowDate - startDate == -2) {
											type = "后天"
											earlyLoadDt = hour + ':' + minutes;
											
										} else {
											earlyLoadDt = item.startDt;
										}
										
										if (nowDate - endDate == 0) {
											endType = "今天"
											endLoadDt = endHour + ':' + endMinutes
										} else if (nowDate - endDate == -1) {
											endType = "明天"
											endLoadDt = endHour + ':' + endMinutes
										} else if (nowDate - endDate == -2) {
											endType = "后天"
											endLoadDt = endHour + ':' + endMinutes
										} else {
											endLoadDt = item.endDt
										}
										if (type == endType) {
											supplyDetails.loadDt = type + earlyLoadDt + '-' + endLoadDt;
										} else {
											supplyDetails.loadDt = type + earlyLoadDt + '-' + endType + endLoadDt;
										}
								
									}
								})
								
							}
							
							//支付方式
							var payType = details.child.orderQuoteVO.payType;
							supplyDetails.payType = payType;
							
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
							var startDt = "";
							var endDt = "";
							var startDt1 = '';
							var endDt1 = '';
							if (orderLoadTimeRecordVO && orderLoadTimeRecordVO.length > 0) {
								startDt = details.child.orderLoadTimeRecordVO[0].startDt;
								endDt = details.child.orderLoadTimeRecordVO[0].endDt;
								console.log(details)
								details.child.orderLoadTimeRecordVO.map(data => {
									if (!startDt1 && data.serialnumber == 3) {
										startDt1 = data.startHours;
										endDt1 = data.endHours;
									}
								})
							}
							
							var receiptType = details.receiptType;
							var fixPrice = details.fixPrice;
							var loadFactor = [];
							//备注
							var remark = details.remark || '';			
							//是否需要回单
							var receiptTypeText = details.receiptType == 1 ? '需要回单' : '不需要回单';
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
							
							var hasRemark = [];
							if (remark) {
								hasRemark.push(remark)
							}
							if (loadFactor) {
								hasRemark.push(loadFactor)
							}
							hasRemark.push(receiptTypeText);
							var hasRemarkStr = hasRemark.join(",")
							supplyDetails.hasRemark = hasRemarkStr;
							
							//在途时效
							supplyDetails.estimatedTime = details.estimatedTime;
							//货源发布时间
							var pushDt = details.pushDt;
							pushDt = pushDt.replace(/-/g, "/");

							var mon = new Date(pushDt).getMonth() < 9 ? '0' + (new Date(pushDt).getMonth() + 1) : new Date(pushDt).getMonth() + 1;
							var year = new Date(pushDt).getFullYear();
							var day = new Date(pushDt).getDate() < 10 ? '0' + new Date(pushDt).getDate() : new Date(pushDt).getDate();
							
							var hour = new Date(pushDt).getHours() < 10 ? '0' + new Date(pushDt).getHours() : new Date(
								pushDt).getHours();
							var minute = new Date(pushDt).getMinutes() < 10 ? '0' + new Date(pushDt).getMinutes() :
								new Date(pushDt).getMinutes();
							supplyDetails.pushDate = year + '-' + mon + '-' + day;
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
							this.supplyDetails = supplyDetails;
							this.orderQuoteVO = orderQuoteVO;
						} catch (e) {
							//TODO handle the exception
							console.log(e)
						}
					} else {
						this.bandMsg = response.retDesc;
						
						this.$refs.bandAlert.open();
						
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e)
				}


			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			goQuotation() {
				//去报价
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								utils.loginSelf(1);
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify !== 1 || driverVerify !== 1 || vehicleVerify !== 1 || faceVerify != 1) {

					uni.showModal({
						title: '请认证驾驶证，行驶证和身份证',
						content: '未完成认证，请认证后操作。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (identityVerify !== 1 || faceVerify != 1) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else if (driverVerify !== 1) {
									uni.navigateTo({
										url: '../../my/driverVerify/newDriverVerify'
									})
								} else if (vehicleVerify !== 1) {
									uni.navigateTo({
										url: '../../my/carVerify/newCarVerify'
									})
								}

							}
						}
					})
					return
				}

				var marginPrice = parseFloat(this.marginPrice);
				var allAmountWithIn = parseFloat(this.allAmountWithIn);

				//判断保证金是否满足最低保证金
				if (allAmountWithIn < marginPrice) {
					//保证金判断
					this.$refs.confirmPopup1.open();
					return
				}
				uni.navigateTo({
					url: '../quotedPrice/quotedPrice?quoteDetails=' + JSON.stringify(this.supplyDetails)
				})
			},
			clearQuotation() {
				//取消报价
				var sid = this.supplyDetails.sid;
				var orderDriverBidSid = this.supplyDetails.orderDriverBidSid;
				uni.showModal({
					title: '确定取消吗？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading();
							utils.postRequest("/td/circuit/cancelBidding", {
									orderSid: sid,
									sid: orderDriverBidSid
								})
								.then(res => {
									console.log(res, '取消')
									uni.hideLoading();
									if (res.retCode == "0000000") {
										uni.showToast({
											title: '取消成功',
											icon: 'success'
										})
										uni.navigateBack({
											delta: 1
										})
										uni.$emit("refreshIndex1");
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
						}
					}
				})
			},
			prevImage(item) {
				//图片预览
				var i = [item];
				uni.previewImage({
					current: 0, //预览图片的下标
					urls: i //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			goCharge() {
				//去充值
				this.$refs.confirmPopup1.close();
				uni.navigateTo({
					url: '../../goodsDelivery/userCenter/userWallet/topUp'
				})
			},
			copy(number) {
				uni.setClipboardData({
					data: number, //要被复制的内容
					success: function() {
							uni.showToast({
								title: '复制成功',
								duration: 2000,
								icon: 'none'
							});
							//以下就可自定义操作了~
						},
						fail: function(err) {
							uni.showToast({
								title: '复制失败',
								duration: 2000,
								icon: 'none'
							});
						}
				});
			},
			close() {
				this.isClose = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.statusBar {
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}
	.pr-48 {
		padding-right: 48rpx;
	}

	.pl-20 {
		padding-left: 20rpx;
	}
	.pr-10 {
		padding-right: 10rpx;
	}
	.pl-10 {
		padding-left: 10rpx;
	}

	.pr-20 {
		padding-right: 20rpx;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	.yellow {
		color: #FF7700;
	}

	.container {
		background-color: #F3F3F3;
		padding-bottom: 200rpx;
		.fix-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			height: 184rpx;
			display: flex;
			justify-content: center;
			align-items: flex-start;
			background-color: #FFFFFF;
			padding-top :24rpx;
			box-sizing: border-box;
			font-size: 32rpx;
			.btn {
				width: 278rpx;
				height: 80rpx;
				background-color: #0171F9;
				border-radius: 16rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				&.phone {
					background-color: #FC5C06;
					margin-right: 46rpx;
				}
			}
			.fix-phone-icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 12rpx;
			}
		}
	}
	.head {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: 999;
		background-color: #FFFFFF;
		.backContent {
			padding: 0 30rpx;
			height: 88rpx;
			line-height: 88rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFFFFF;
			box-sizing: border-box;
			.head-text {
				color: #333333;
				font-size: 40rpx;
				font-weight: 600;
			}
			.share-whole {
				position: relative;
				color: #333333;
				font-weight: 500;
				font-size: 32rpx;
			}
			.share {
				width: 40rpx;
				height: 42rpx;
			}
			.back {
				width: 25rpx;
				height: 35rpx;
			}
		}
	}
	.content {
		background-color: #FFFFFF;
		margin: 0 36rpx 24rpx;
		display: flex;
		flex-direction: column;
		border-radius: 24rpx;
		padding: 22rpx 0 22rpx 30rpx;
		box-sizing: border-box;
		position: relative;
		.subTitle {
			color: #333;
			font-size: 32rpx;
			font-weight: 600; 
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.copy {
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #000000;
				font-size: 28rpx;
				padding-right: 30rpx;
				box-sizing: border-box;
				font-weight: 400;
				.copy-icon {
					width: 36rpx;
					height: 36rpx;
				}
				.copy-title {
					color: #2B72F0;
					font-size: 24rpx;
					padding-right: 8rpx;
				}
			}
		}
		.line {
			width: calc(100vw - 102rpx);
			margin: 16rpx 0 32rpx 0;
			height: 1rpx;
			background-color: #E7E7E7;
		}
		.notice {
			position: absolute;
			top: 22rpx;
			right: 32rpx;
			z-index: 1;
			font-size: 28rpx;
			color: #333333;
		}
		.addrContent {
			display: flex;
			flex-direction: row;
			.addrIcon {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 40rpx;
				margin-right: 20rpx;
				.addrIcon-item {
					height: 130rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-top: 0;
				}
				.start {
					width: 40rpx;
					height: 44rpx;
				}
			
				.end {
					width: 40rpx;
					height: 44rpx;
				}
			
				.dotted {
					width: 6rpx;
					height: 6rpx;
					background-color: #D7D7D7;
					margin: 10rpx 0;
				}
			}

			.addrInfo {
				flex: 1;
				display: flex;
				flex-direction: column;
				.title {
					height: 130rpx;
					padding-top: 6rpx;
					box-sizing: border-box;
				}
				.addr {
					font-size: 30rpx;
					color: #222222;
					font-weight: 500;
					padding: 0 32rpx 16rpx 0;
					width: 430rpx;
					box-sizing: border-box;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.address {
					font-size: 26rpx;
					color: #777777;
					line-height: 35rpx;
					padding-right: 40rpx;
					overflow: hidden;
					-webkit-line-clamp: 2;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}
			}
		}
		.pub-date {
			font-weight: bold;
			color: #333;
			font-size: 28rpx;
		}
		.userInfo {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
			color: #333333;
			font-size: 28rpx;
			padding-top: 32rpx;
			box-sizing: border-box;
			font-weight: 500;
			padding-right: 30rpx;
			line-height: 32rpx;
			.userContent {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				color: #333333;
				line-height: 32rpx;
				.userName {
					width: 300rpx;
					line-height: 32rpx;
				} 
			}
			.call {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 36rpx;
				color: #10AB32;
				.msgIcon {
					width: 36rpx;
					height: 36rpx;
					margin-left: 22rpx;
				}
			}
		}
		
		.km-content {
			flex: 1;
			height: 102rpx;
			background-color: #fafafa;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-top: 32rpx;
			margin-right: 30rpx;
			border-radius: 8rpx;
			padding: 10rpx 0;
			box-sizing: border-box;
			.seperate {
				width: 1px;
				height: 63rpx;
				background-color: #CBCBCB;
			}
			.km-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				.flex-row {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: baseline;
				}
				.km-text {
					padding-bottom: 10rpx;
					font-weight: 500;
					color: #000;
				}
				.black {
					color: #666;
					font-weight: bold;
					padding-right: 5rpx;
				}
			}
		}
		
		.item {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			font-size: 28rpx;
			&+.item {
				margin-top: 32rpx;
			}
			.label {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				color: #333333;
				width: 112rpx;
				margin-right: 82rpx;
			}
			.labelContent {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				.sub {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					font-weight: 500;
					&.pay {
						color: #FC5C06;
					}
				}
				.goods {
					padding-right: 10rpx;
				}
				.row {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					flex-wrap: wrap;
					.text {
						line-height: 40rpx;

						&:first-child {
							padding-right: 20rpx;
						}
					}
				}

			}

		}
	}

	.pl-20 {
		padding-left: 20rpx;
	}

	.hintBox {
		background: #FFFFFF;
		border-radius: 12rpx;
		margin: 0 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		&.verifyHintBox {
			margin: 0 36rpx;
		}
		.title {
			font-size: 30rpx;
			color: #777777;
			text-align: center;
			padding: 32rpx 0;
			font-weight: bold;
		}

		.alertContent1 {
			flex: 1;
			width: 456rpx;
			padding: 0 114rpx;
			font-size: 32rpx;
			color: rgba(112, 112, 113, 1);

			.text {
				text-align: center;
				height: 92rpx;
				line-height: 40rpx;
			}
		}

		.alertContent {
			padding: 0 62rpx;
			font-size: 28rpx;
			color: rgba(112, 112, 113, 1);
			flex: 1;

			.text {
				display: flex;
				height: 84rpx;
				flex-wrap: wrap;
			}

			.blue {
				color: rgba(74, 162, 243, 1);
			}
		}
		.bandBtnGroup {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 32rpx 46rpx;
			box-sizing: border-box;
			.cancelBtn {
				width: calc(50vw - 50rpx);
				background-color: rgba(74, 162, 243, 1);
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 12rpx;
				&:first-child {
					margin-right: 20rpx;
				}
			}
		}
		.confirmBtnGroup {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 46rpx;

			.cancelBtn {
				width: calc(100vw - 120rpx);
				background-color: rgba(74, 162, 243, 1);
				flex: 1;
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 12rpx;
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

	.tips {
		display: flex;
		flex-direction: column;
		padding: 20rpx 0;
		color: #666666;

		.subTitle {
			font-size: 28rpx;
		}

		.tipItem {
			font-size: 26rpx;
			padding-top: 16rpx;
		}
	}

	.popup-box {
		.black-box {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #000;
			opacity: 0.6;
			z-index: 99;
		}

		.popup-content {
			position: fixed;
			bottom: 30rpx;
			left: 24rpx;
			right: 24rpx;
			height: 330rpx;
			// height: 500rpx;
			background-color: #fff;
			z-index: 999;
			border-radius: 40rpx;
			padding: 30rpx 40rpx;

			.popup-head {
				color: #333;
				font-size: 28rpx;
				font-weight: bold;
			}

			.popup-row {
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #F6F6F6;
				padding: 30rpx 10rpx;

				.popup-child {
					font-size: 22rpx;
					color: #333;
					margin-right: 70rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					.popup-img {
						width: 88rpx;
						height: 88rpx;
						margin-bottom: 14rpx;
					}
				}
			}

			.cancel-btn {
				display: flex;
				align-items: flex-end;
				justify-content: center;
				color: #777;
				height: 90rpx;
				font-size: 32rpx;
			}
		}
	}

	.pr-20 {
		padding-right: 20rpx;
	}
	.name {
		font-size: 30rpx;
		font-weight: bold;
		color: #222222;
		margin-left: 16rpx;
	}
</style>
