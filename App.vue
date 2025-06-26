<script>
	import * as shipUtils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	import checkVersion from "@/uni_modules/uni-upgrade-center-app/utils/check-update";
	import IMService from "@/utils/imservice.js";
	import {longEvent} from "@/longLink/consignorlongLink.js";
	import * as utils from "@/utils/utils";
	import * as dateFormat from "@/utils/date.js";
	
	const PemissionModule = uni.requireNativePlugin("PemissionModule");
	
	const SpeakModule = uni.requireNativePlugin("SpeakModule");
	
	// const pushLive = uni.requireNativePlugin('push-live');
	var globalEvent = uni.requireNativePlugin('globalEvent');
	const serviceLive = uni.requireNativePlugin("PhotoModule")
	
	const locationModule = uni.requireNativePlugin("LocationModule");
	// var KsModule;
	// if (uni.getSystemInfoSync().platform == "android") {
	// 	KsModule = uni.requireNativePlugin("KsModule");
	// }
	// const KsModule = uni.requireNativePlugin("KsModule");
	
	export default {
		globalData: {
			electronInfo: null,
			reqRate: 0,
			imService: null,
			memberImService: null,
			latitude: '',
			longitude: '',
			address: '',
			setLocationFlag: false,
			locationStatus: false, // 定位权限状态
			serviceSearch: {
				latitude: '',
				longitude: '',
				searchVal: ''
			},
			roadConditionSearch: {
				latitude: '',
				longitude: '',
				searchVal: ''
			},
			mutualSearch: {
				latitude: '',
				longitude: '',
				searchVal: ''
			},
			getlocation: null,
			checkLocationTimer:null,
			timeNum: 1800000,
			commonPhoneModel: '',
			commonSystemVersion: '',
			appVersion: '',
			sceneIndex: 0,
			firstInApp: true,
			
			//加油么相关全局参数
			userInfo: null,
			shopId: "",
			mchId: '1601983318',
			mchKey: 'Cargocn2020qaszxcdssdafadsfwefew',
			openid: '',
			ddlist: {},
			loading: false,
			activity: 0,
			//是否是从活动入口登录
			otherUser: {},
			socketTask: null,
			//长链接
			payShow: false,
			//万金油支付后，支付凭证控制
			payImg: '',
			//万金油支付后，支付凭证图片
			sceneNum: 0,
			
			newToFixed(s, d) {
			  var d = parseInt(d);
			  s = s.toString();
			  if (!d) d = 0;
			  if (s.indexOf(".") == -1) s += ".";
			  s += new Array(d + 1).join("0");
			
			  if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
			    var s = "0" + RegExp.$2,
			        pm = RegExp.$1,
			        a = RegExp.$3.length,
			        b = true;
			
			    if (a == d + 2) {
			      a = s.match(/\d/g);
			
			      if (parseInt(a[a.length - 1]) > 4) {
			        for (var i = a.length - 2; i >= 0; i--) {
			          a[i] = parseInt(a[i]) + 1;
			
			          if (a[i] == 10) {
			            a[i] = 0;
			            b = i != 1;
			          } else break;
			        }
			      }
			
			      s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
			    }
			
			    if (b) s = s.substr(1);
			    return (pm + s).replace(/\.$/, "");
			  }
			
			  return this + "";
			},
			
			consignorSocketTask: null,
			//货主端全局变量
			// 其他订单字段
			orderOtherData: {
				quotationWay: '',
				declaredValue: '',
				guaranteeFlag: '',
			},
			otherShipping: { // 货源托运人
				userName: '',
				userId: ''
			},
			creatScope: { // 发布范围
				creatTimeType: 1,
				dateVal: 1,
				hourVal: '',
				minVal: '',
				creatScopeType: [1],
				checkedGroup: []
			},
			costInformation: { // 费用信息
				infoPrice: '',
				hopePrice: '',
				hopePriceSyb: '',
				checkedTimeVal: {},
				quotationWay: 2,
				payType: '',
				oilRate: '',
				needConfirm: '',
				needInvoiceFlag: 2,
				informationFlag: 2,
			},
			handlingInstructions: { // 装卸说明
				handingRequiredVal: [],
				restrictedZoneVal: '',
				checkedLimit: 1,
				agingTime: '',
				checkedTemperature: '',
				lowTemperature: '',
				highTemperature: '',
				temperatureMonitor: '',
				orderRemark: '',
			},
			
			// 装载时间
			loadTimeData: {
				loadTimeObj1: {}, // 装1
				loadTimeObj2: {}, //装2
				loadTimeObj3: {}, //卸1
				loadTimeObj4: {}, //卸2
			},
			loadTimeCheckInfo: {
				startHourCheckVal: '0',
				endHourCheckVal: '0',
				startCheckedMonth: '',
				endCheckedMonth: '',
			},
			
			batchNumber: '',
			temperatureFlag: 1, // 是否冷藏车, 2为冷藏车
			editAddressItem: {},
			goodsVo: {}, // 货源信息
			goodsTypeVo: [], // 物品信息
			newGoodsObj: {}, // NEW货物参数
			hopePriceSyb: '', // 期望价格单位
			carTypeVo: { // 车型车长
				vehicleLength: '',
				vehicleModel: '',
				vehicleNumber: 1,
			},
			showLoadGoods2: false,
			showUnloadGoods2: false,
			addressObject: { // 装卸货地址
				loadGoods1: {},
				loadGoods2: {},
				unloadGoods1: {},
				unloadGoods2: {},
			},
			defauleAddress: {
				loadGoods1: {},
				unloadGoods1: {},
			},
			
			// 联系人
			defaultContact: {
				userName: '',
				mobile: ''
			},
			contactUser: {
				user1: {},
				user2: {},
				user3: {},
				user4: {},
			},
			
			orderValueAddedVOS: {}, // 增值服务
			showTemperatureVal: [], // 自选温控范围下标
			userTemperatureVal: [], // 自选温控范围值
			indexSearchObj: undefined, // 首页搜索对象
			
			preLoginFlag: false, // 是否可以一键登录
			commonObj: {}, // 埋点对象
			userCommon: null,
			regionUpdate: '',
			isHide: false,
			assignedDriverObj: '',
			monthCheckVal: '0', // 选择的装卸货时间
			startCheckedMonth: '0', // 选择的装卸货时间
			startHourCheckVal: '0', // 选择的装卸货时间
			promoteLinkUrl: '', // 广告页的weburl
			indexSelectFlag: 1,
			pransportGoods: {
				shippingUser: {}, //上游托运
				carrierUser: {}, //下游承运
				goodsArr: [], //物品信息
				pransportGoodsType: [], //货物信息
				pransportGoodsVo: {}, //零担货源信息
				allGoodsDetails: [],
				startAddress: {}, //装货地址
				endAddress: {}, //卸货地址
				costRecord: [], //费用信息数组,
				assignPrice: {}, //指定的费用
				originalNumber: '', //货物单号
				remake: '', //备注
				needReceipt: false, //是否需要回单
			}, //零担下单信息
			pransportCodeArr: [], //零担扫描结果
			isScanAli: 0,
			smsObj: {
				amount: 0,
				noteVOS: [],
			},
			driverMarkers: [],
			confirmTotViewAry: [], // 确定查看列表
			sendOrder: {},
			goEasyJump: false,
			nvueGoeasy: '',
			nvuegoeasy: '',
			shipCircultEditFlag: false,
			shipVehicleEditFlag: false,
			newChooseAddressObj: {},
			newAddressChooseSerial: '',
			cardFleetItem: {}, // 当前登录用户的名片夹车队
			businessCardSharePop: false,
		},
		onLaunch: function() {
			let system = uni.getSystemInfoSync();
			//语音播报初始化
			// if (system.platform == "android") {
				
			// 		SpeakModule.init({}, res => {
						
			// 		})
			// }
			// uni.clearStorage();
			this.goEasy.onClickNotification((message) => {
				// getApp().globalData.goEasyJump = true;
				let name = message.senderData.name ? message.senderData.name : message.senderData.nickname ? message.senderData.nickname : '';
				if(message.toType == 'group') {
					let groupId = message.groupId ? message.groupId : '';
					// uni.navigateTo({
					// 	url: 'groupChat?groupId=' + groupId + '&avatar=' + message.senderData.avatar + '&nickname=' + name
					// })
					getApp().globalData.goEasyJump = false;
					setTimeout(()=>{
						
						uni.navigateTo({
							url: '/pages/goodsDelivery/userMessage/groupChat?groupId=' + groupId + '&avatar=' + message.senderData.avatar + '&nickname=' + name
						})
					},1500)
				}else {
					let userId = message.senderData.userId ? message.senderData.userId : '';
					// uni.navigateTo({
					// 	url: 'chatDetails?receiverId=' + message.userId + '&avatar=' + message.senderData.avatar + '&nickname=' + name + '&userId=' + userId
					// })
					getApp().globalData.goEasyJump = false;
					setTimeout(()=>{
						uni.navigateTo({
							url: '/pages/goodsDelivery/userMessage/chatDetails?receiverId=' + message.senderId + '&avatar=' + message.senderData.avatar + '&nickname=' + name + '&userId=' + userId
						})
					},1000)
				}
			    //  message 
			    // {
			    //     "messageId": "8f0e27a0c7e111eab347b726da4416bd",
			    //     "timestamp": 1594958217087,
			    //     "type": "text",
			    //     "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649",
			    //     "senderData": {"avatar": "/www/xxx.png", "nickname": "Neo"},
			    //     "toType: 'group',
			    //     "groupId: 'group001',
			    //     "groupData: {"avatar": "group - 1.png", "name": "区块链交流群"},
			    // }
			    // console.log('Clicked notification message - ', message);
			});
			
			var that = this;
			//获取设备id
			if(uni.getStorageSync('pushFlag') != '20'){
				var userInfo = uni.getStorageSync("userInfo");
				if (userInfo){
					var deviceId = plus.push.getClientInfo().clientid;
					var userId = JSON.parse(userInfo).userId
					shipUtils.postRequest("/xxq/device/reg", {cid: deviceId, userId: userId}).then(res => {
						// console.log(deviceId, 'qwqw12')
						// console.log('向后端推送设备ID')
					})
				}
			}
			
			//监听在线消息事件 收到透传消息时,执行该事件 
			plus.push.addEventListener('receive',msg => {
			    // ios 透传
			    if (system.platform == 'ios') {
			       return
			    }
			    // android透传
			    if (system.platform == 'android') {
					console.log(msg, '监听收到的消息内容') 
			    }
			  },false);
			
			//监听uni-push的推送消息
			let timer = false;
			plus.push.addEventListener("click",(msg)=>{
				console.log('推送消息================>', msg);
				timer && clearTimeout(timer);
				console.log(getApp().globalData.goEasyJump, '判断是否是goEasy消息')
				if(getApp().globalData.goEasyJump == true) { // 如果通知栏为goeasy消息通知栏，则不执行以下操作
					return false;
				}
				timer = setTimeout(()=>{
					var userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
					console.log("消息1212121", userRole, msg);
					if(userRole == 1){
						var payload = msg.payload;
						var str = payload.toString();
						console.log(payload, typeof payload, '消息111')
						if (typeof payload == 'string') {
							var page = payload.split('|');
							console.log(page, '阿萨说');
							if (page.length > 0) {
								if (page[0] == 'supplyDetail') {
									uni.setStorageSync("isNotificationNews", true);
									//货源消息
									shipUtils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 10, types: [6], "opTypes": [76]})
									.then(res => {
										console.log(res, '货源消息返回');
										if (res.retCode == "0000000") {
											var total = res.rspBody.total;
											uni.setStorageSync("goodsNewsStorage", total);
											//设置货源条数长度，过滤首页消息弹框
										}
									})
									var sid = page[1];
									//请求货源详情接口
									shipUtils.newQueryPostRequest("/td/circuit/getOrderRecord", {
										sid: sid,
									}).then(res => {
										console.log(res, '货源详情');
										if (res.retCode == "0000000") {
											var unbrokenFlag = res.rspBody.unbrokenFlag;
											var cargoSource = res.rspBody.cargoSource;
											var supply = res.rspBody.supply;
											if (unbrokenFlag == 1 || cargoSource == "WX_ZKC") {
												uni.switchTab({
													url: '/pages/ship/index/index1'
												})
												//车队货源跳转到车队货源列表，平台货源跳转到平台货源列表
												uni.$emit("switchIndex1", supply == 2 ? 1 : 0);
												return;
											}
											var orderState = res.rspBody.orderState;
											if (orderState == 2) {
												uni.showToast({
													title: '此货源已失效，您可查看其他货源',
													icon: 'none',
													duration: 3000,
												})
												uni.switchTab({
													url: '/pages/ship/index/index1'
												})
												uni.$emit("switchIndex1", supply == 2 ? 1 : 0);
											} else {
												uni.navigateTo({
													url: '/pages/ship/supplyDetails/supplyDetails?sid=' + sid + '&status=3'
												})
											}
										} else {
											uni.showToast({
												title: '此货源已失效，您可查看其他货源',
												icon: 'none',
												duration: 3000,
											})
											uni.switchTab({
												url: '/pages/ship/index/index1?index=1'
											})
										}
									}).catch(err => {
										uni.switchTab({
											url: '/pages/ship/index/index1'
										})
									})
								} else if (page[0] == 'fleetDetail') {
									//车队邀请消息
									uni.setStorageSync("isNotificationNews", true);
									//获取车队消息列表接口
									shipUtils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 10, types: [6], "opTypes": [73]})
									.then(res => {
										if (res.retCode == "0000000") {
											var total = res.rspBody.total;
											uni.setStorageSync("fleetsNewsStorage", total);
											//设置车队邀请消息长度，过滤首页消息弹框
										}
									})
									
									var sid = page[1];
									shipUtils.newQueryPostRequest("/cd/fleet/list", {
										id: sid,
									}).then(res => {
										if (res.retCode == "0000000") {
											var info = res.rspBody.items[0];
											uni.navigateTo({
												url: "/pages/goodsDelivery/fleetIndex/newFleetDetails?info=" + JSON.stringify(info)
											})
											// uni.navigateTo({
											// 	url: "/pages/goodsDelivery/fleetIndex/fleetDetails?info=" + JSON.stringify(info)
											// })
											
										} else {
											uni.showToast({
												title: res.retDesc,
												icon: 'none',
												duration: 3000,
											})
											uni.switchTab({
												url: '/pages/ship/index/index1'
											})
										}
									}).catch(err => {
										uni.switchTab({
											url: '/pages/ship/index/index1'
										})
									})
									
								} else if (page[0] == 'supply') {
									//车源消息.跳平台货源
									uni.setStorageSync("isNotificationNews", true);
									shipUtils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 10, types: [6], "opTypes": [75]})
									.then(res => {
										if (res.retCode == "0000000") {
											var total = res.rspBody.total;
											uni.setStorageSync("carSourceNewsStorage", total);
											//设置车队邀请消息长度，过滤首页消息弹框
										}
									})
									uni.$emit("switchIndex1"); //车源消息跳平台货源页面
									uni.switchTab({
										url: '/pages/ship/index/index1'
									})
								} else if (page[0] == 'fleetWithUserVerify') {
									//车队审核
									var sid = page[1];
									shipUtils.newQueryPostRequest("/cd/fleet/list", {
										id: sid,
									}).then(res => {
										if (res.retCode == "0000000") {
											var info = res.rspBody.items[0];
											uni.navigateTo({
												url: "/pages/goodsDelivery/fleetIndex/newFleetDetails?info=" + JSON.stringify(info)
											})
											// uni.navigateTo({
											// 	url: "/pages/goodsDelivery/fleetIndex/fleetDetails?info=" + JSON.stringify(info)
											// })
											
										} else {
											uni.showToast({
												title: res.retDesc,
												icon: 'none',
												duration: 3000,
											})
											uni.switchTab({
												url: '/pages/ship/index/index1'
											})
										}
									}).catch(err => {
										uni.switchTab({
											url: '/pages/ship/index/index1'
										})
									})
								}else if(page[0] == 'PersonCertificate') {
									console.log('证件消息');
									console.log(page);
									let userInfo = uni.getStorageSync("userInfo");
									if(userInfo) {
										userInfo = JSON.parse(userInfo);
										let userCode = userInfo.attrs.userCode;
										console.log(page[1]);
										switch(Number(page[1])) {
											case 80:
												console.log('身份证过期');
												shipUtils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
												.then(res=>{
													console.log('用户详细信息', res);
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
												.catch(err => {})
												break;
											case 81:
												console.log('驾驶证过期');
												uni.navigateTo({
													url: '/pages/my/driverVerify/newDriverVerify'
												})
												break;
											case 82:
												console.log('行驶证过期');
												uni.navigateTo({
													url: '/pages/my/carVerify/carList'
												})
												break;
											case 83:
												console.log('道路运输证过期');
												uni.navigateTo({
													url: '/pages/my/transportVerify/transportVerify'
												})
												break;
											case 84:
												console.log('从业资格证过期');
												uni.navigateTo({
													url: '/pages/my/transportVerify/transportVerify'
												})
												break;
										}
									}
								}else if(page[0] == 'redPacketShareSuccess'){
									let userInfo = uni.getStorageSync("userInfo");
									if(userInfo) {
										uni.switchTab({
											url: '/pages/ship/index/index1'
										})
										// uni.navigateTo({
										// 	url: '/pages/redPacket/index/index'
										// })
										// userInfo = JSON.parse(userInfo);
										// let userCode = userInfo.attrs.userCode;
										// console.log(page[1]);
										// switch(Number(page[1])) {
										// 	case 93:
										// 		console.log('红包雨');
										// 		uni.navigateTo({
										// 			url: '/pages/redPacket/index/index'
										// 		})
										// 		break;
										// }
									}
								}
							}else {
								uni.switchTab({
									url: '/pages/ship/index/index1'
								})
							}
						}
						
					}else{
						uni.switchTab({
							url: '/pages/goodsDelivery/sourceIndex/sourceIndex'
						})
					}
					console.log("跳转到首页");
					
					// if(msg.payload){
					// 	uni.navigateTo({
					// 		url:msg.payload
					// 	})
					// }
				},1500)
			},false)
			
			
			//定时执行
			globalEvent.addEventListener('doJobEvent', function() {
				console.log("---------", '定时回调')
				if (that.globalData.reqRate == 1) {
					var system = uni.getSystemInfoSync();
					var platform = system.platform;
					var userInfo = uni.getStorageSync("userInfo");
					if (platform == "android") {
						if (userInfo) {
							PemissionModule.applyPemission(res => {
								if (res.status == 1) {
									publicData.getLocationInfo();
								}
							})
						}
					} else {
						publicData.getLocationInfo();
					}
					
				}
				
				// 定时器回调
				// 执行你的定时逻辑
				//uni.request({.....})
			});
			that.setUserCode()
			uni.setStorageSync("isOilIn", false); //判断是否已进入油或已退出油
			var userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
			// let ab = JSON.parse(uni.getStorageSync('userInfo'))// 1为司机2为货主
			// console.log(ab)
			console.log('用户角色', userRole)
			
			if(userRole) {
				//获取司机广告页
				if(Number(userRole) == 1) {
					this.$store.dispatch("getMainAdvertise"); //获取首页banner图片
				}else {
					this.$store.dispatch("getShipAdvertise"); //获取首页banner图片--货主
				}
				// checkVersion(res => {
				// 	//检查更新
				// 	// console.log(res, 'aaa')
				// });
				
				let userInfo = uni.getStorageSync("userInfo");
				if(!userInfo) {
					publicData.setTabbarItem(userRole);
					setTimeout(() => {
						// shipUtils.loginSelf(userRole);
					}, 2000);
				}else {
					userInfo = JSON.parse(userInfo);
					//已经登录后包活
					var platform = uni.getSystemInfoSync().platform;
					if (platform == "android") {
						var userId = userInfo.userId;
						var userCode = userInfo.attrs.userCode;
						var token = userInfo.attrs.token;
						shipUtils.postRequest('/tm/track/tr/location/getRedisConfig', { dataSrcs: 2 }).then(res => {
							if (res.retCode == "0000000") {
								let state = res.rspBody.state
								let reqRate = res.rspBody.reqRate
								if (state == 1) {
									locationModule.startService({
										userId: userId,
										userCode: userCode,
										token: token,
										intNumber: reqRate*60
									}, rsp => {
										
									})
								}
							}
						})
						
					}
					
					getApp().globalData.defaultContact = {
						userName: userInfo.userName ? userInfo.userName : '',
						mobile: userInfo.mobile ? userInfo.mobile : '',
					};
					if(this.goEasy.getConnectionStatus() === 'disconnected') {
						getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
						getApp().globalData.imService.connect(Number(userRole) == 1 ? userInfo : userInfo);
					}
					if(Number(userRole) == 1) {
						var userCode = userInfo.attrs.userCode;
						shipUtils.postRequest('/yh/user/task/status/change/log/today/check', {userCode: userInfo.attrs.userCode})
						.then(res => {
							console.log('接单状态', res);
							if (res.retCode == '0000000') {
								if(!res.rspBody) {
									setTimeout(() => {
										/* uni.reLaunch({
											url: '/pages/loginHint/driverStatus'
										}) */
										uni.switchTab({
											url: '/pages/ship/index/index_car_source'
										})
									}, 1000)
								}else {
									let cParams = {
										"userId": userInfo.userId,
										"typeCodeList": ['MY_VEHICLE', 'OFTEN_AREA', 'ROAD_TYPE', 'FAVORITE_CARGO']
									};
									shipUtils.postRequest("/yh/upd/tags/tag/check/by/type", cParams)
									.then(res => {
										let typeLengthAreacheckFlag = res.rspBody.allTypeCountFlag;
										if(typeLengthAreacheckFlag == 1) {
											publicData.setTabbarItem(userRole);
										}else {
											setTimeout(() => {
												uni.reLaunch({
													url: '/pages/my/myHobby/myHoby_driver'
												})
											}, 1000)
										}
									})
									.catch(err => {
										console.log(err);
										publicData.setTabbarItem(userRole);
									})
								}
							} else {
								uni.showToast({
									title: res.retDesc,
									icon: 'none',
									duration: 3000
								})
							}
						})
						.catch(err => {
							console.log(err);
							publicData.setTabbarItem(userRole);
						})
					}else {
						shipUtils.postRequest('/yh/enterprise/select/detail', {userCode: userInfo.attrs.userCode})
						.then(res=>{
							console.log('初始已登录企业认证详情', res);
							if(res.retCode == "0000000") {
								if(res.rspBody && res.rspBody.contractNum && res.rspBody.contractNum != '0') {
									getApp().globalData.costInformation.needInvoiceFlag = 1;
									console.log('初始已登录costInformation', getApp().globalData.costInformation);
								}
							}
						})
						.catch(err=>{})
						publicData.setTabbarItem(userRole);
						// setTimeout(() => {
						// 	uni.reLaunch({
						// 		url: '/pages/loginHint/driverStatus',
						// 		// url: '/pages/goodsDelivery/newHobby/newHobby',
						// 		success: function(res) {
						// 			console.log('跳转成功', res)
						// 		},
						// 		fail: function(err) {
						// 			console.log('跳转失败', err)
						// 		},
						// 	})
						// }, 1000)
					}
					
					var plat = uni.getSystemInfoSync().platform;
					console.log(plat)
					if (plat == "ios") {
						// 跳转到APP带参数
						plus.globalEvent.addEventListener('newintent', e => {
							
						　　this.checkArguments(); // 检测启动参数
						　console.log('newintent123123123检测启动参数', e)
						
						});
					}
					// shipUtils.postRequest("/yh/personas/getCheck", {
					// 	userCode: userCode
					// }).then(res => {
					// 	uni.hideLoading();
					// 	var carParams = [], carLenParams = [];
					// 	if (res.retCode == "0000000") {
					// 		var data = res.rspBody;
					// 		console.log('喜好是否已配置', data);
					// 		carParams = data.carModelList;
					// 		carLenParams = data.carLengthList;
							
					// 	}
					// 	if (Number(userRole) == 1) {
					// 		publicData.setTabbarItem(userRole);
					// 		if (userInfo.attrs.vehicleVerify != 1 && (carParams.length < 1 || carLenParams.length < 1)) {
					// 			console.log('跳转阿飒飒飒飒')
					// 			setTimeout(() => {
					// 				uni.reLaunch({
					// 					url: '/pages/my/myHobby/myHoby_driver'
					// 				})
					// 			}, 1000)
					// 		}
					// 	}else if(Number(userRole) == 2) {
					// 		// publicData.setTabbarItem(userRole);
					// 		// if (carParams.length < 1 || carLenParams.length < 1) {
					// 		// 	console.log('跳转阿飒飒飒飒')
					// 		// 	setTimeout(() => {
					// 		// 		uni.reLaunch({
					// 		// 			url: 'pages/goodsDelivery/newHobby/newHobby'
					// 		// 		})
					// 		// 	}, 1000)
					// 		// }else {
					// 		// 	publicData.setTabbarItem(userRole);
					// 		// }
					// 		setTimeout(() => {
					// 			uni.reLaunch({
					// 				url: '/pages/loginHint/driverStatus',
					// 				// url: '/pages/goodsDelivery/newHobby/newHobby',
					// 				success: function(res) {
					// 					console.log('跳转成功', res)
					// 				},
					// 				fail: function(err) {
					// 					console.log('跳转失败', err)
					// 				},
					// 			})
					// 		}, 1000)
					// 	}
					// })
				}
			}
			// switch (uni.getSystemInfoSync().platform) {
			// 	case 'android':
			// 		//console.log('运行Android上') 
					
			// 		setTimeout(() => {
			// 			plus.navigator.closeSplashscreen();
			// 		}, 2000);
			// 		break;
			// 	case 'ios':
			// 		setTimeout(() => {
			// 			plus.navigator.closeSplashscreen();
			// 		}, 2000);
			// 		break;
			// 	default:
			// 		setTimeout(() => {
			// 			plus.navigator.closeSplashscreen();
			// 		}, 2000);
			// 		//console.log('运行在开发者工具上') 
			// 		break;
			// }
			// console.log('开始启动1');
			setTimeout(() => { // 设置启动页关闭时间
				plus.navigator.closeSplashscreen();
			}, 2000);
			
			// 防止部分安卓手机启用页由于设备延迟弹出的系统自带Nav功能栏的弹出而导致页面的变形，需要在app启动时强制弹出系统栏
			plus.navigator.showSystemNavigation();
			// var platform = uni.getSystemInfoSync().platform;
			// if (platform == "android") {
			// 	//快手sdk初始化
			// 	KsModule.initKs();
			// 	setTimeout(() => {
			// 		KsModule.onAppActive();
			// 	}, 3000)
				
			// 	setTimeout(() => {
			// 		plus.navigator.closeSplashscreen();
			// 	}, 3000);
			// }
			plus.screen.lockOrientation("portrait-primary");
			// =====================================================
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
				// var appVersion = wgtinfo.version;
				that.globalData.appVersion = wgtinfo.version;
				// console.log('版本号', that.globalData.appVersion);
			})
			this.getUserCommon();
			this.getCommonStr();
			
			// uni.$on("locationSend", () => {
			// 	this.getLocationInfo();
			// });
			//过华为审核，不允许首次打开app弹授权位置框
			uni.$on("ship-index", () => {
				this.getLocationInfo();
			});
			
		},
		onShow: function() {
			var that = this;
			// uni.clearStorage()
			// console.log(plus.runtime.arguments,'H5传来的数据', this.getCommonStr)
			var userRole = uni.getStorageSync("userRole");
			if (userRole == 1) {
				uni.setStorageSync("isNewsGlobalStorage", false);
				publicData.checkDriverNews();//检查消息弹窗的顺序
			}
			
			console.log('App Show', plus.runtime.arguments)
			

			
			//获取广告图片
			var userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
			// console.log(userRole);
			// 每次启动app时检查本地数据
	
			// if (platform == 'android') {
			// 	pushLive.closeService(function(res) {
			// 		console.log(res)
			// 	});
			// 	setTimeout(() => {
			// 		//启动服务
			// 		that.goStartService();
			// 	}, 2000)
			// }
			
			
			var platform = uni.getSystemInfoSync().platform;
			if (platform != "android") {
				that.getlocation = null;
				that.getLocationInfo();
			} else {
				// that.getlocation = null;
				// that.getLocationInfo();
				// var isOpen = PemissionModule.isLocationOpen();
				// if (isOpen) {
				// 	this.getlocation = null;
				// 	this.getLocationInfo();
				// }
			}
		
			uni.$on('srevice-index', (data) => {
				that.getlocation = null;
				that.getLocationInfo();
			})
			var userInfo = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : '';
			if(userInfo) {
				if(!getApp().globalData.nvueGoeasy) {
					getApp().globalData.nvueGoeasy = this.GoEasy;
					getApp().globalData.nvuegoeasy = this.goEasy;
				}
				setTimeout(() => {
					longEvent(this, () => {});
				}, 1000);
				
				// setTimeout(() => {
				// 	this.checkArguments();
				// }, 200)
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "android") {
					this.checkArguments();
				} else {
					setTimeout(() => {
						this.checkArguments();
					}, 10)
				}
			}
			
			if(plus.runtime.arguments && that.isHide && userInfo){
				var str = plus.runtime.arguments;
				var navPage = str.split('/')[0]
				// console.log(navPage,'是否是H5跳转回来')
				// console.log(str)
				
				var arr = str.split('?');
				var params = that.getArgs(str)
				// console.log(params)
				var sid = params.sid;
				var multiTruck = params.multiTruck;
				var supply = params.supply;
				that.setUserCode()
				that.isHide = false;
				plus.runtime.arguments = null;
				plus.runtime.arguments = ''
				if (sid) {
					if(navPage == 'pages'){
						if(userRole == 1){
							
							if(supply == 2){
								console.log("车队货源跳转")
								let pages = getCurrentPages() // 获取栈实例
								let page = pages[pages.length - 1]
								let isJym = page.route.split('/')[1]
								if(isJym == 'jymPages'){
									publicData.goDriverApp();
									// that.setBar()
								}else{
									uni.switchTab({
										url: '/pages/ship/index/index1'
									})
									uni.$emit("shareRefresh");
								}
								
							}else{
								uni.navigateTo({
									url: '/pages/ship/supplyDetails/supplyDetails?sid=' + sid +
										'&status=3&multiTruck='+multiTruck +'&quoteState=0'
								});
							}
							
						}else{
							uni.switchTab({
									url: '/pages/goodsDelivery/sourceIndex/sourceIndex'
								})
						}
					}
				}
			}
			this.checkLocalData();
			
			
			
			//判断是否联网
			uni.getNetworkType({
				success: function(res) {
					// console.log(res)
					var nt = res.networkType;
					if (nt == 'unknown' || nt == 'none') {
						that.$store.commit("changeNetStatus", false);
					} else {
						that.$store.commit("changeNetStatus", true);
					}
				}
			});
			
			uni.onNetworkStatusChange(function(res){
				// console.log(res, '网络问题11111')
				if (res.isConnected) {
					that.$store.commit("changeNetStatus", true)
				} else {
					that.$store.commit("changeNetStatus", false);
					uni.showToast({
						title: '暂无网络',
						icon: 'none'
					})
				}
			})
			
		},
		onHide: function() {
			console.log('App Hide')
			this.isHide = true;
			var pla = uni.getSystemInfoSync().platform;
			if (pla == "ios") {
				plus.runtime.arguments = "";
			}
			
			this.globalData.sceneIndex = 1;
			if(this.globalData.consignorSocketTask) {
				this.globalData.consignorSocketTask.close();
			}
			if (this.globalData.socketTask) {
				this.globalData.socketTask.close();
			}
			
		},
		onUnload(){
			console.log('onUnload')
		},
		methods: {
			setUserCode(){
				let that = this;
				if(plus.runtime.arguments){
				  var str = plus.runtime.arguments;
				  var params = that.getArgs(str)
				  console.log('H5数据参数',params)
				  if(params.userCode){
				    var userInfo = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : '';
				    var userRole = uni.getStorageSync("userRole")
					if(userInfo){
					  let data = {
						userCode: userInfo.attrs.userCode,
						invitationCode: params.userCode,
						serviceType: userRole == 1 ? '10' : '20'
					  }
						console.log(data,'发送请求的参数')
					  shipUtils.postRequest("/yh/business/user/binding/business/invitation/code", data).then(res => {
						console.log(res,'绑定用户邀请码返回数据----交易')
					  })
					  if(userRole == 1){
						shipUtils.postRequest('/au/user/reference', {
							referenceUserCode: params.userCode
						}).then(res => {
						  console.log(res,'绑定用户邀请码返回数据----社区')
						})
					  }
					  
					}
				  }		
				}
			},
			getArgs(str) {
				let args = {};
				let query = str.split("?")[1]
				if (query) {
				  let pairs = query.split("&");
				  pairs.forEach(item => {
					let key = item.split('=')[0]
					let value = item.split('=')[1]
					args[key] = value
				  })
				}
				return args
			 },
			checkArguments() {
				console.log("跳转app接收的参数", plus.runtime.arguments);
				
				if (plus.runtime.arguments) {
				  var str = plus.runtime.arguments;
				  var arr = str.split('?');
				  var sid = arr[1];
				  var typeNumber = arr[0];
				  if (typeNumber.indexOf("orderNumber") < 0) return;
				  console.log('跳转的Sid跳转的Sid跳转的Sid跳转的Sid跳转的Sid')
				  if (sid == "index") {
					  //跳转首页
					  if (userRole == 2) {
						setTimeout(() => {
							uni.navigateTo({
							  url: '/pages/goodsDelivery/index/index'
							});
						}, 2500)  
					  	
					  } else {
						setTimeout(() => {
							uni.navigateTo({
							  url: '/pages/ship/index/index1'
							});
						}, 2500)
					  
					  }
					  return;
				  }
				  if (sid) {
					console.log('跳转到货源详情')
					console.log('货源的sid',sid);
					//判断该货源是否有效
					shipUtils.newQueryPostRequest("/td/order/findListRecord", {
						sid: sid
					}).then(res => {
						if (res.retCode == "0000000") {
							var details = res.rspBody;
							if (details.orderState == 1) {
								var userRole = uni.getStorageSync("userRole");
								if (userRole == 1) {
									setTimeout(() => {
										uni.navigateTo({
										  url: '/pages/ship/supplyDetails/supplyDetails?sid=' + sid
										});
									}, 2500)
									
								} else {
									setTimeout(() => {
										uni.navigateTo({
										  url: '/pages/goodsDelivery/orderDetails/orderDetails?sid=' + sid
										});
									}, 2500)
									
								}
							} else {
								uni.showToast({
									title: '该货源已关闭',
									icon: 'none'
								})
								var userRole = uni.getStorageSync("userRole");
								if (userRole == 1) {
									setTimeout(() => {
										uni.switchTab({
										  url: '/pages/ship/index/index1'
										});
									}, 2500)
									
								} else {
									setTimeout(() => {
										uni.switchTab({
										  url: '/pages/goodsDelivery/index/index'
										});
									}, 2500)
									
								}
							}
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					}).catch(err => {
						
					})
					
					console.log('货源的货源号',sid)
									
				  }
				}
			},
			getUserCommon() {
				
				var userRole = uni.getStorageSync('userRole');
				var that = this;
				// console.log("获取埋点字段-------------",userRole)
				if(userRole) {
					var systemInfo = uni.getSystemInfoSync();
					that.globalData.commonPhoneModel = systemInfo.model;
					that.globalData.commonSystemVersion = systemInfo.system;
				}else {
					that.userCommon = setTimeout(() => {
						that.getUserCommon();
					}, 30000);
				}
				
			},
			getCommonStr() { // 获取埋点必要字段
				var platform = uni.getSystemInfoSync();
				// console.log('机型', platform);
				let userInfo = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : '';
				// console.log('用户信息', JSON.parse(userInfo));
				var userRole = uni.getStorageSync('userRole');
				var commonFrontLabel = '';
				if(userRole == 1) {
					commonFrontLabel = 'driver';
				}else if(userRole == 2) {
					commonFrontLabel = 'sender';
				}
				// console.log('用户信息', );
				this.globalData.commonObj = {
					commonFrontLabel: commonFrontLabel ? commonFrontLabel : undefined,
					commonPhoneModel: platform.brand + ' ' + platform.model,
					commonSystemVersion: platform.system,
					commonUserName: userInfo ? userInfo.userName : undefined,
					commonUserId: userInfo ? userInfo.userId : undefined,
				}
				// console.log('埋点必要字段', this.globalData.commonObj);
			},
			// 若本地无数据，则对个别数据量较大的接口做单次请求，减轻服务器压力
			checkLocalData() {
				let regionUpdate = uni.getStorageSync('regionUpdate');
				let oldVersion = uni.getStorageSync("version") || 0;
				let newVersion = plus.runtime.version;
				let that = this;
				uni.getStorage({ // 检查地区数据，服务站、路况、互助上报时均需匹配地区code
				    key: 'regionData',
				    success: function (rRes) {
				        // console.log('本地地区数据无误！');
						//每次启动判断是否版本已升级
						if(!regionUpdate || newVersion != oldVersion) {
							uni.setStorageSync("version", newVersion)
							publicData.getRegionInfo();
						}
				    },
					fail: function (rErr) {
						// console.log('本地缓存无地区数据！', rErr);
						publicData.getRegionInfo();
					}
				});
			},
			//判断应用是否添加在白名单之中
			isIgnoringBattery() {
				pushLive.isIgnoringBatteryOptimizations(function(res) {
					console.log(res);
					let flag = res.flag;
					if (flag == false) {
						pushLive.requestIgnoreBatteryOptimizations(function(res) {
							console.log(res)
						});
					}
				})
			},
			//设置app自启动
			whiteListSetting() {
				pushLive.gotoWhiteListSetting()
			},
			goStartService() {
				//执行定时任务 5秒执行 一次
				pushLive.startPollingTask(5);
				
				let obj = {
					title: "货运中国",
					content: "正在后台运行",
					mode: 1
				}
				pushLive.startService(obj, function(res) {
					console.log(res)
				});
				this.isIgnoringBattery();
			},
			stopService() {
				pushLive.closeService(function(res) {
					console.log(res)
				});
			},
			gotoBackstageWhiteListAutStart() {
				pushLive.gotoBackstage_WhiteList_autStart()
			},
			
			// getLocationInfo() { // 每分钟检查一次定位
			// 	let that = this;
			// 	let userInfo = 	uni.getStorageSync('userInfo')
			// 	that.checkLocationTimer = setInterval(() => {
			// 	if(!userInfo) {
			// 		that.getlocation && clearInterval(that.getlocation);
			// 		that.getlocation = null;
			// 		console.log('用户未登录')
			// 		return;
			// 	}else {
			// 		console.log('已登录')
			// 		that.checkLocationTimer && clearInterval(that.checkLocationTimer);
			// 		that.checkLocationTimer = null;
			// 		shipUtils.postRequest('/tm/track/tr/location/getRedisConfig',{dataSrcs:2}).then(res=>{
			// 			console.log(res,'检查定位')
			// 			let state = res.rspBody.state;
			// 			let reqRate = res.rspBody.reqRate;
			// 			if(state) {			
							
			// 				//打开app先上报一下位置
			// 				// setTimeout(() => {
			// 					  let nowDate = Date.parse("2022/01/01 " + dateFormat.dateFormat(new Date()).allDate.split(' ')[1])
			// 					  let startDate = Date.parse("2022/01/01 " + res.rspBody.startDate)
			// 					  let endDate = Date.parse("2022/01/01 " + res.rspBody.endDate)
			// 					  console.log(nowDate > endDate)
			// 					  console.log(nowDate < startDate)
			// 					  if (nowDate > endDate) return false
			// 					  if (nowDate < startDate) return false
			// 					  publicData.getLocationInfo();
			// 				// }, 10000);
							
			// 				that.getlocation = setInterval(() => { 
			// 				  console.log('位置上报位置上报')
			// 				  let nowDate = Date.parse("2022/01/01 " + dateFormat.dateFormat(new Date()).allDate.split(' ')[1])
			// 				  let startDate = Date.parse("2022/01/01 " + res.rspBody.startDate)
			// 				  let endDate = Date.parse("2022/01/01 " + res.rspBody.endDate)
			// 				  console.log(nowDate > endDate)
			// 				  console.log(nowDate < startDate)
			// 				  if (nowDate > endDate) return false
			// 				  if (nowDate < startDate) return false
   //                            publicData.getLocationInfo();
			// 				}, reqRate * 1000 * 60);
			// 			}
			// 		})
			// 		}
			// 	}, 3000);
				
			// 	// publicData.getLocationInfo();
			// 	// if(!that.globalData.timeNum) {
			// 	// 	that.globalData.timeNum = 1800000;
			// 	// }
			// 	// console.log('定位是否成功', that.globalData.locationStatus);
			// 	// console.log('延迟时间', that.globalData.timeNum);
				
				
			// 	// that.getlocation && clearTimeout(that.getlocation);
			// 	// that.getlocation = setTimeout(() => {
			// 	// 	that.getLocationInfo();
			// 	// }, that.globalData.timeNum);
			// },
			
			async getLocationInfo(){
				let that = this;
				let userInfo = uni.getStorageSync('userInfo')
				if (!userInfo) {
					that.getlocation && clearInterval(that.getlocation);
					this.clearGetLocationInfo = setTimeout(() => {
						   this.getLocationInfo();
					}, 2000)
					return;
				};
				var system = uni.getSystemInfoSync();
				var platform = system.platform;
				this.clearGetLocationInfo && clearTimeout(this.clearGetLocationInfo);
				var res = await shipUtils.postRequest('/tm/track/tr/location/getRedisConfig', { dataSrcs: 2 });
				if (res.retCode == "0000000") {
					let state = res.rspBody.state
					let reqRate = res.rspBody.reqRate
					that.globalData.reqRate = state;
					if (state == 1) {			  
						let nowDate = Date.parse("2022/01/01 " + dateFormat.dateFormat(new Date()).allDate.split(' ')[1])
						let startDate = Date.parse("2022/01/01 " + res.rspBody.startDate)
						let endDate = Date.parse("2022/01/01 " + res.rspBody.endDate)
						// console.log(nowDate > endDate)
						// console.log(nowDate < startDate)
						if (nowDate > endDate) return false
						if (nowDate < startDate) return false
						if (platform == "android") {
							PemissionModule.applyPemission(res => {
								if (res.status == 1) {
									publicData.getLocationInfo();
								}
							})
						} else {
							publicData.getLocationInfo();
						}
						
						that.getlocation && clearInterval(that.getlocation);
						that.getlocation = setInterval(() => {
							var userInfo = uni.getStorageSync('userInfo')
							if (!userInfo) {
								that.getlocation && clearInterval(that.getlocation);
								return;
							}
							// console.log('位置上报位置上报')
							let nowDate = Date.parse("2022/01/01 " + dateFormat.dateFormat(new Date()).allDate.split(' ')[1])
							let startDate = Date.parse("2022/01/01 " + res.rspBody.startDate)
							let endDate = Date.parse("2022/01/01 " + res.rspBody.endDate)
							// console.log(nowDate > endDate)
							// console.log(nowDate < startDate)
							if (nowDate > endDate) return false
							if (nowDate < startDate) return false
							if (platform == "android") {
								PemissionModule.applyPemission(res => {
									if (res.status == 1) {
										publicData.getLocationInfo();
									}
								})
							} else {
								publicData.getLocationInfo();
							}
						}, reqRate * 1000 * 60);
						return;
					}
					that.getlocation && clearInterval(that.getlocation);
				} else {
					 that.getlocation && clearInterval(that.getlocation);
				}
				   //  that.checkLocationTimer = setInterval(() => {
				   //    let userInfo = uni.getStorageSync('userInfo')
				   //    if (!userInfo) {
				   //      clearInterval(that.getlocation)
				   //      that.getlocation = null
				   //      console.log('没有用户信息')
				   //      return;
				   //    }
						  
				   //      console.log( that.checkLocationTimer, '12有了用户信息, 先上传一次定位,然后开始定时回调')
				   //      clearInterval(that.checkLocationTimer)
				   //      that.checkLocationTimer = null;
				   //      shipUtils.postRequest('/tm/track/tr/location/getRedisConfig', { dataSrcs: 2 }).then(res => {
							// console.log(res,'检查定位')
				   //        let state = res.rspBody.state
				   //        let reqRate = res.rspBody.reqRate
							// that.globalData.reqRate = state;
				   //        if (state == 1) {
							  
				   //          // setTimeout(() => {
				   //            let nowDate = Date.parse("2022/01/01 " + dateFormat.dateFormat(new Date()).allDate.split(' ')[1])
				   //            let startDate = Date.parse("2022/01/01 " + res.rspBody.startDate)
				   //            let endDate = Date.parse("2022/01/01 " + res.rspBody.endDate)
				   //            console.log(nowDate > endDate)
				   //            console.log(nowDate < startDate)
				   //            if (nowDate > endDate) return false
				   //            if (nowDate < startDate) return false
				   //            publicData.getLocationInfo();
				   //          // },10000)
							
							
				   //          that.getlocation = setInterval(() => {
							//   console.log('位置上报位置上报')
				   //            let nowDate = Date.parse("2022/01/01 " + dateFormat.dateFormat(new Date()).allDate.split(' ')[1])
				   //            let startDate = Date.parse("2022/01/01 " + res.rspBody.startDate)
				   //            let endDate = Date.parse("2022/01/01 " + res.rspBody.endDate)
				   //            console.log(nowDate > endDate)
				   //            console.log(nowDate < startDate)
				   //            if (nowDate > endDate) return false
				   //            if (nowDate < startDate) return false
				   //            publicData.getLocationInfo();
				   //          }, reqRate * 1000 * 60)
				   //        }
				   //      })
				      
				   //  }, 3000)

			},
		},
	}
</script>
<style lang="scss">
  /* #ifndef APP-NVUE */
  @import "./common/index.scss";

  /*每个页面公共css */
  uni-view {
    line-height: 1;
  }

  /* #endif */
</style>