import * as utils from "@/utils/ship";
// var utils = require("./ship.js");
import * as service from "@/utils/service";

import * as utilData from "@/utils/utils";

import { ENV, apkUrl } from "./baseUrl"

export function getRegionInfo() { // 获取地区后存入缓存，

	utils.postRequest('/ts/nationDict/getBasicData')
		.then(res => {
			if (res.retCode == "0000000") {
				uni.setStorage({
					key: 'regionData',
					data: res.rspBody,
					success: function(saveRes) {
						// console.log('地区数据缓存成功！', saveRes);
						uni.setStorageSync('regionUpdate', 1)
					},
					fail: function(saveErr) {
						// console.log('地区数据缓存失败！', saveErr);
					}
				});
			} else {
				// console.log('地区接口异常：', res.retDesc);
			}
		})
		.catch(err => {
			// console.log('地区接口请求异常：', err);
		})
}

export function getLocationInfo(callback) { // 每分钟检测一次定位权限，若无定位权限则在特殊位置给出无权限提示
	// var data = {
 //    longitude: "111.11",
 //    latitude: "111.11",
 //    userId: 1868,
 //    address: "哈哈哈测试",
 //    provinceName: "哈哈哈",
 //    provinceCode: "哈哈哈",
 //    cityName: "哈哈哈",
 //    cityCode: "哈哈哈",
 //    areaName: "哈哈哈",
 //    areaCode: "哈哈哈",
 //    commonHtmlTitle: '实时上报定位'
 //  };
  
 //  service.postRequest('/au/user/location/save', data)
 //  .then(res => {
    
 //  })
	// return
	uni.getLocation({
		type: 'gcj02',
		geocode: true,
		accuracy: 'best',
		isHighAccuracy: true,
		success: function(res) {
			// console.log("打卡121212", res);
			var longitude = getApp().globalData.longitude;
			var latitude = getApp().globalData.latitude;
			// console.log(longitude,latitude)
			if (longitude == res.longitude && latitude == res.latitude) return; //最新的经纬度如果和上一个经纬度一致则不上传
			getApp().globalData.longitude = res.longitude;
			getApp().globalData.latitude = res.latitude;
			getApp().globalData.locationStatus = true;
			getApp().globalData.address = res.address.province + res.address.city + res.address.district +
				res.address.poiName;
			// callback()
			if (uni.getStorageSync("userInfo")) {
				locationSave();
			}
		},
		fail: function(err) {
			// 若定位获取失败则定位北京，避免请求个别需要经纬度的接口失败！
			// console.log('全局定位失败', err)
			// getApp().globalData.longitude = 116.405285;
			// getApp().globalData.latitude = 39.904989;
			getApp().globalData.longitude = '';
			getApp().globalData.latitude = '';
			getApp().globalData.locationStatus = false;
			if (getApp().globalData.firstInApp) {
				uni.$emit("firstInApp");
			}
			getApp().globalData.firstInApp = false;
		},
	});
}

export function locationSave() { // 定位保存
	var userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
	// console.log(userRole);
	var longitude = getApp().globalData.longitude;
	if (!longitude) return;
	
	var that = this;
	var userInfo = uni.getStorageSync("userInfo");
	if (!userInfo) return;
	// console.log('执行定位保存');
	userInfo = JSON.parse(userInfo);
	var userId = userInfo.userId;
	var userCode = userInfo.attrs.userCode;
	var address = getApp().globalData.address;
	getCityCode(address).then(res => {
		// console.log(res,'getCityCode')
		
		var adcode = res[0].adcode;
		var provinceCode = adcode.slice(0, 2) + "0000";
		var cityCode = adcode.slice(0, 4) + '00';
		
		if (!res[0].province) return;
		if (!res[0].city) return;
		if (!res[0].district) return;
		if (!res[0].adcode) return;
		var data = {
			longitude: getApp().globalData.longitude,
			latitude: getApp().globalData.latitude,
			userId: userId,
			userCode: userCode,
			address: getApp().globalData.address,
			provinceName: res[0].province,
			provinceCode: provinceCode,
			cityName: res[0].city,
			cityCode: cityCode,
			areaName: res[0].district,
			areaCode: res[0].adcode,
			commonHtmlTitle: '实时上报定位'
		};
		// console.log(data,'实时上报定位data')
		utils.newRegisterPostRequest('/cd/user/location/save', data).then(response => {
			// console.log(response, '上报定位response')
		}).catch(err => {
			// console.log(err, '上报出错')
		})
	})
	
}
export function setTabbarItem(userRole) { // 修改tabbar
	console.log(userRole)
	if (userRole == 2) {
		// console.log('setTabbarItem');
		uni.setTabBarItem({
			index: 0,
			pagePath: "/pages/goodsDelivery/sourceIndex/sourceIndex",
			iconPath: "static/images/goodsDelivery/carSource.png",
			selectedIconPath: "static/images/goodsDelivery/carSourceC.png",
			text: '找车',
			success: function(res) {
				// console.log('跳转index');
				uni.switchTab({
					url: '/pages/goodsDelivery/sourceIndex/sourceIndex'
				})
				// uni.navigateTo({
				// 	url: '/pages/goodsDelivery/fleetIndex/newFleetDetails'
				// })
			},
			fail: function(err) {
				console.log(err);
				
			}
		})
		uni.setTabBarItem({
			index: 1,
			pagePath: "/pages/goodsDelivery/index/index",
			iconPath: "static/images/goodsDelivery/commonlyUsed.png",
			selectedIconPath: "static/images/goodsDelivery/commonlyUsedC.png",
			text: '发货',
			success: function(res) {
				// console.log('跳转index');
				// uni.switchTab({
				// 	url: '/pages/goodsDelivery/index/index'
				// })
			},
			fail: function(err) {
				console.log(err);
				
			}
		})
		// uni.setTabBarItem({
		// 	index: 1,
		// 	pagePath: "/pages/goodsDelivery/waybill/waybill",
		// 	iconPath: "static/images/goodsDelivery/waybill.png",
		// 	selectedIconPath: "static/images/goodsDelivery/waybillC.png",
		// 	text: '运单',
		// 	success: function(res) {
		// 		// uni.switchTab({
		// 		// 	url: '/pages/goodsDelivery/waybill/waybill'
		// 		// })
		// 	}
		// })
		// uni.setTabBarItem({
		// 	index: 2,
		// 	pagePath: "/pages/goodsDelivery/commonlyUsed/commonlyUsed",
		// 	iconPath: "static/images/goodsDelivery/commonlyUsed.png",
		// 	selectedIconPath: "static/images/goodsDelivery/commonlyUsedC.png",
		// 	text: '常用'
		// })
		uni.setTabBarItem({
			index: 2,
			pagePath: "/pages/goodsDelivery/fleetIndex/fleetIndex",
			iconPath: "static/images/goodsDelivery/index.png",
			selectedIconPath: "static/images/goodsDelivery/indexC.png",
			text: '车队',
			success: function(res) {
				// uni.switchTab({
				// 	url: '/pages/goodsDelivery/fleetIndex/fleetIndex'
				// })
			}
		})
		uni.setTabBarItem({
			index: 3,
			pagePath: "/pages/goodsDelivery/userMessage/userMessage",
			iconPath: "static/images/goodsDelivery/message.png",
			selectedIconPath: "static/images/goodsDelivery/messageC.png",
			text: '消息',
			success: function(res) {
				// console.log('设置红点');
				uni.showTabBarRedDot({
				  index: 3,
				});
				// uni.switchTab({
				// 	url: '/pages/goodsDelivery/userMessage/userMessage'
				// })
			}
		})
  //   uni.setTabBarItem({
		// 	index: 3,
		// 	pagePath: "/pages/goodsDelivery/businessCard/businessCard",
		// 	iconPath: "static/images/goodsDelivery/message.png",
		// 	selectedIconPath: "static/images/goodsDelivery/messageC.png",
		// 	text: '名片机',
		// 	success: function(res) {
		// 		// console.log('设置红点');
		// 		uni.showTabBarRedDot({
		// 		  index: 3,
		// 		});
		// 		// uni.switchTab({
		// 		// 	url: '/pages/goodsDelivery/userMessage/userMessage'
		// 		// })
		// 	}
		// })
		uni.setTabBarItem({
			index: 4,
			pagePath: "/pages/goodsDelivery/userCenter/userCenter",
			iconPath: "static/images/goodsDelivery/userCenter.png",
			selectedIconPath: "static/images/goodsDelivery/userCenterC.png",
			text: '我的',
			success: function(res) {
				// uni.switchTab({
				// 	url: '/pages/goodsDelivery/userCenter/userCenter'
				// })
			}
		})
	} else {
		uni.setTabBarItem({
			index: 0,
			pagePath: "/pages/ship/index/index_car_source",
			iconPath: "static/images/ship/tab1.png",
			selectedIconPath: "static/images/ship/tab1_selected.png",
			text: '车源',
			success: function(res) {
				uni.switchTab({
					url: '/pages/ship/index/index_car_source'
				})
			}
		})
		// uni.setTabBarItem({
		// 	index:0,
		// 	pagePath:"/pages/ship/index/businessCard/businessCard",
		// 	iconPath:"static/images/ship/index.png",
		// 	selectedIconPath:"static/images/ship/index_select.png",
		// 	text:"名片",
		// 	success:function(res){
		// 		console.log(res);
		// 		uni.switchTab({
		// 			url:"/pages/ship/index/businessCard/businessCard"
		// 		})
		// 	}
		// })
		uni.setTabBarItem({
			index: 1,
			pagePath: "/pages/ship/index/index1",
			iconPath: "static/images/ship/tab3.png",
			selectedIconPath: "static/images/ship/tab3_selected.png",
			text: '找货',
			success: function(res) {

			},
			fail: function(err) {
				console.log('优惠加油error', err);
			},
		})
		// uni.setTabBarItem({
		// 	index: 2,
		// 	pagePath: "/pages/index/srevice/srevice",
		// 	iconPath: "static/images/ship/tab2.png",
		// 	selectedIconPath: "static/images/ship/tab2_selected.png.png",
		// 	text: '服务站',
		// 	success: function(res) {
		// 		console.log('服务站success', res);
		// 	},
		// 	fail: function(err) {
		// 		console.log('服务站error', err);
		// 	},
		// })
		uni.setTabBarItem({
			index: 2,
			pagePath: "/pages/ship/fleet/index",
			iconPath: "static/images/ship/tab5.png",
			selectedIconPath: "static/images/ship/tab5_selected.png",
			text: '车队',
			success: function(res) {}
		})
		uni.setTabBarItem({
			index: 3,
			pagePath: "/pages/jymPages/oilstation/oilstationIndex/oilstationIndex",
			iconPath: "static/images/ship/tab2.png",
			selectedIconPath: "static/images/ship/tab2_selected.png",
			text: '加油',
			success: function(res) {
				console.log('设置红点');
				
				// uni.switchTab({
				// 	url: '/pages/goodsDelivery/userMessage/userMessage'
				// })
			}
		})
		uni.setTabBarItem({
			index: 4,
			pagePath: "/pages/my/index/index",
			iconPath: "static/images/ship/tab4.png",
			selectedIconPath: "static/images/ship/tab4_selected.png",
			text: '我的',
			success: function(res) {}
		})
	}
}

//加油么跳转司机端App
export function goDriverApp() {

	//关闭油先生socket链接
	uni.setStorageSync("longLink", false);
	uni.setStorageSync("isOilIn", false); //判断是否已进入油或已退出油
	var app = getApp();
	try {
		app.globalData.socketTask.close();
	} catch (e) {
		//TODO handle the exception
	}

	uni.setTabBarItem({
		index: 0,
		pagePath: "/pages/ship/index/index_car_source",
		iconPath: "static/images/ship/tab1.png",
		selectedIconPath: "static/images/ship/tab1_selected.png",
		text: '车源',
		success: function(res) {
			uni.switchTab({
				url: '/pages/ship/index/index_car_source'
			})
		}
	})
	uni.setTabBarItem({
		index: 1,
		text: '找货',
		iconPath: 'static/images/ship/tab3.png',
		selectedIconPath: 'static/images/ship/tab3_selected.png',
		pagePath: '/pages/ship/index/index1',
		success: function(res) {
			
		}
	})
	// uni.setTabBarItem({
	// 	index: 2,
	// 	text: '服务站',
	// 	iconPath: 'static/images/ship/tab2.png',
	// 	selectedIconPath: 'static/images/ship/tab2_selected.png',
	// 	pagePath: '/pages/index/srevice/srevice',
	// })
	uni.setTabBarItem({
		index: 2,
		pagePath: "/pages/ship/fleet/index",
		iconPath: "static/images/ship/tab5.png",
		selectedIconPath: "static/images/ship/tab5_selected.png",
		text: '车队',
		success: function(res) {}
	})
	uni.setTabBarItem({
		index: 3,
		pagePath: "/pages/jymPages/oilstation/oilstationIndex/oilstationIndex",
		iconPath: "static/images/ship/tab2.png",
		selectedIconPath: "static/images/ship/tab2_selected.png",
		text: '加油',
		success: function(res) {
		}
	})

	uni.setTabBarItem({
		index: 4,
		text: '我的',
		iconPath: 'static/images/ship/tab4.png',
		selectedIconPath: 'static/images/ship/tab4_selected.png',
		pagePath: '/pages/my/index/index'
	})

}

//司机跳转加油么
export function goJJMApp() {
	//判断是否三证认证
	var userInfo = uni.getStorageSync("userInfo");
	var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
	var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
	var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
	var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
	if (identityVerify !== 1 || driverVerify !== 1 || vehicleVerify !== 1 || faceVerify != 1) {
		uni.setStorageSync("isOilIn", false);
		uni.showModal({
			title: '请认证驾驶证，行驶证和身份证',
			content: '未完成认证，请认证后操作。',
			confirmText: '去认证',
			cancelText: '再看看',
			success: function(res) {
				if (res.confirm) {
					uni.setTabBarItem({
						index: 3,
						text: '加油',
						pagePath: "/pages/jymPages/oilstation/oilstationIndex/oilstationIndex",
						iconPath: "static/images/ship/tab2.png",
						selectedIconPath: "static/images/ship/tab2_selected.png",
						success: function() {
							uni.hideTabBarRedDot({
								index: 3
							})
							uni.switchTab({
								url: '/pages/ship/index/index_car_source'
							})
						}
					})
					if (identityVerify !== 1 || faceVerify != 1) {
						//判断身份证是新增还是编辑
						var userCode = JSON.parse(userInfo).attrs.userCode;
						utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
						.then(res=>{
							console.log('用户详细信息', res);
							uni.hideLoading();
							if(res.retCode == "0000000") {
								var idNo = res.rspBody.idNo;
								if (idNo) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
									})
								}
								
							}
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

				} else {
					uni.setTabBarItem({
						index: 3,
						text: '加油',
						pagePath: "/pages/jymPages/oilstation/oilstationIndex/oilstationIndex",
						iconPath: "static/images/ship/tab2.png",
						selectedIconPath: "static/images/ship/tab2_selected.png",
						success: function() {
							uni.switchTab({
								url: '/pages/ship/index/index_car_source'
							})
						}
					})
				}
			}
		})
		return
	}
	console.log('设置油底部111')
	uni.removeTabBarBadge({ //隐藏数字标
	  index: 3
	})
	uni.setTabBarItem({
		index: 0,
		text: '加油',
		iconPath: 'static/images/jym/icon_oilstation_nomal.png',
		selectedIconPath: 'static/images/jym/icon_oilstation_press.png',
		pagePath: '/pages/jymPages/oilstation/oilstationIndex/oilstationIndex',
		success: response => {
			//设置token
			var app = getApp();
			console.log(app.globalData.consignorSocketTask, 'aaaaa111111111111')
			if (app.globalData.consignorSocketTask) {
				app.globalData.consignorSocketTask.close();
			}
			service.postRequest('/yh/user/login2/oilsir')
				.then(res => {
					console.log(23423423423423)
					console.log(res)
					uni.setStorageSync('driverInfo', res.rspBody);
					// uni.setStorageSync('driverInfo', userData);
					uni.setStorageSync('token', res.rspBody.attrs.token);
					// uni.setStorageSync('token', userData.attrs.token);
					uni.setStorageSync('driverVerify', res.rspBody.attrs.driverVerify);
					// uni.setStorageSync('driverVerify', userData.attrs.driverVerify);
					if (res.retCode == '0000000') {
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/jymPages/oilstation/oilstationIndex/oilstationIndex'
							})
						}, 500)

					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
		}
	})

	uni.setTabBarItem({
		index: 1,
		text: '订单',
		iconPath: 'static/images/jym/icon_order_nomal.png',
		selectedIconPath: 'static/images/jym/icon_order_press.png',
		pagePath: '/pages/jymPages/order/orderIndex/orderIndex',
	})
	uni.setTabBarItem({
		index: 2,
		text: '领劵',
		iconPath: 'static/images/jym/icon_coupons_nomal.png',
		selectedIconPath: 'static/images/jym/icon_coupons_press.png',
		pagePath: '/pages/jymPages/coupon/market/market',
	})
	uni.setTabBarItem({
		index: 3,
		text: '油卡',
		iconPath: 'static/images/jym/cargo.png',
		selectedIconPath: 'static/images/jym/cargo_solid.png',
		pagePath: '/pages/jymPages/oilcardPage/oilcardPage'
	})
	uni.setTabBarItem({
		index: 4,
		text: '优惠券',
		iconPath: 'static/images/jym/coupons.png',
		selectedIconPath: 'static/images/jym/selectCoupons.png',
		pagePath: '/pages/jymPages/coupon/coupon'
	})

}

//司机权限校验,是否需要人脸识别
export function getDriverUserPermissions(type) {
	//去认证
	var userInfo = uni.getStorageSync("userInfo");
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
		return false
	}
	var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
	var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
	var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
	if (type == 1) {
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
			return false
		}
	} else {
		if (identityVerify !== 1 || driverVerify !== 1 || vehicleVerify !== 1) {

			uni.showModal({
				title: '请认证驾驶证，行驶证和身份证',
				content: '未完成认证，请认证后操作。',
				confirmText: '去认证',
				cancelText: '再看看',
				success: function(res) {
					if (res.confirm) {
						if (identityVerify !== 1) {
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
			return false
		}
	}

	return true
}

export function getUserPermissions(type) { // 权限验证，type 1为需要实名认证
	let userInfo = uni.getStorageSync('userInfo');
	userInfo = userInfo ? JSON.parse(userInfo) : userInfo;
	if (!userInfo) {
		uni.showToast({
			title: '请登录后再进行操作',
			icon: 'none',
			duration: 2000,
		})
		let userRole = uni.getStorageSync('userRole');
		utils.loginSelf(userRole);
		return false;
	}
	if (type == 1) {
		if (userInfo.attrs.identityVerify == 0 || userInfo.attrs.faceVerify == 0) {
			// uni.showToast({
			// 	title: '请实名认证后再进行操作',
			// 	icon: 'none',
			// 	duration: 2000,
			// })
			return false;
		}
	}
	if (type == 2) {
		if (userInfo.attrs.identityVerify == 0 || userInfo.attrs
			.faceVerify == 0) {
			return false
		}
	}
	return true;
}

export function showPrice(price, units) { // 数量, 单位: 元0、毛10、分100、厘1000
	if (!price) {
		return 0;
	} else {
		price = units ? Number(price) / units : Number(price);
		return price.toFixed(2);
	}
}

//设置油的token
export function setOilToken() {
	return new Promise(function(resolve, reject) {
		service.postRequest('/yh/user/login2/oilsir')
			.then(res => {
				console.log(23423423423423)
				console.log(res)
				uni.setStorageSync('driverInfo', res.rspBody);
				// uni.setStorageSync('driverInfo', userData);
				uni.setStorageSync('token', res.rspBody.attrs.token);
				// uni.setStorageSync('token', userData.attrs.token);
				uni.setStorageSync('driverVerify', res.rspBody.attrs.driverVerify);
				// uni.setStorageSync('driverVerify', userData.attrs.driverVerify);
				if (res.retCode == '0000000') {
					resolve()
				} else {
					uni.showToast({
						title: res.retDesc,
						icon: 'none'
					})
				}
			})
	})
}

export function showPushDt(time) {
	var now = new Date().getTime();
	var timeParse = new Date(time).getTime();
	var distance = now - timeParse;
	var days = parseInt(distance / (1000 * 60 * 60 * 24));
	if (days < 1) {
		var hours = parseInt((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		if (hours < 1) {
			return ['刚刚']
		} else {
			return [hours, '小时前']
		}

	} else {
		return [days, '天前']
	}
}


var EARTH_RADIUS = 6378137.0; //单位M
var PI = Math.PI;

function getRad(d) {
	return d * PI / 180.0;
}


//计算两点之间的经纬度距离
export function getFlatternDistance(lat1, lng1, lat2, lng2) {
	// var f = getRad((lat1 + lat2)/2);
	// var g = getRad((lat1 - lat2)/2);
	// var l = getRad((lng1 - lng2)/2);

	// var sg = Math.sin(g);
	// var sl = Math.sin(l);
	// var sf = Math.sin(f);

	// var s,c,w,r,d,h1,h2;
	// var a = EARTH_RADIUS;
	// var fl = 1/298.257;

	// sg = sg*sg;
	// sl = sl*sl;
	// sf = sf*sf;

	// s = sg*(1-sl) + (1-sf)*sl;
	// c = (1-sg)*(1-sl) + sf*sl;

	// w = Math.atan(Math.sqrt(s/c));
	// r = Math.sqrt(s*c)/w;
	// d = 2*w*a;
	// h1 = (3*r -1)/2/c;
	// h2 = (3*r +1)/2/s;

	// return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
	var radLat1 = lat1 * Math.PI / 180.0;
	var radLat2 = lat2 * Math.PI / 180.0;
	var a = radLat1 - radLat2;
	var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math
		.sin(b / 2), 2)));
	s = s * 6378.137;
	s = Math.round(s * 10000) / 10000;
	return s.toFixed(0)
}
function getArgs(str) {
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
}
export function deleteShipOrderDetails() { // 清空本地保存的货源数据
	getApp().globalData.orderOtherData = {};
	let newUserInfo = uni.getStorageSync('userInfo');
	newUserInfo = newUserInfo ? JSON.parse(newUserInfo) : newUserInfo;
	if(newUserInfo) {
		utils.postRequest('/yh/enterprise/select/detail', {userCode: newUserInfo.attrs.userCode})
		.then(newRes=>{
			console.log('清空本地认证详情', newRes);
			if(newRes.retCode == "0000000") {
				if(newRes.rspBody && newRes.rspBody.contractNum && newRes.rspBody.contractNum != '0') {
					getApp().globalData.costInformation = {
						infoPrice: '',
						hopePrice: '',
						hopePriceSyb: '',
						checkedTimeVal: {},
						quotationWay: 2,
						payType: '',
						oilRate: '',
						needConfirm: '',
						needInvoiceFlag: 1,
						informationFlag: 2
					};
					console.log('清空本地costInformation', getApp().globalData.costInformation);
				}else {
					getApp().globalData.costInformation = {
						infoPrice: '',
						hopePrice: '',
						hopePriceSyb: '',
						checkedTimeVal: {},
						quotationWay: 2,
						payType: '',
						oilRate: '',
						needConfirm: '',
						needInvoiceFlag: 2,
						informationFlag: 2
					};
				}
			}else {
				getApp().globalData.costInformation = {
					infoPrice: '',
					hopePrice: '',
					hopePriceSyb: '',
					checkedTimeVal: {},
					quotationWay: 2,
					payType: '',
					oilRate: '',
					needConfirm: '',
					needInvoiceFlag: 2,
					informationFlag: 2
				};
			}
		})
		.catch(newErr=>{})
	}else {
		getApp().globalData.costInformation = {
			infoPrice: '',
			hopePrice: '',
			hopePriceSyb: '',
			checkedTimeVal: {},
			quotationWay: 2,
			payType: '',
			oilRate: '',
			needConfirm: '',
			needInvoiceFlag: 2,
			informationFlag: 2
		};
	}
	
	let userInfo = JSON.parse(uni.getStorageSync("userInfo"));
	getApp().globalData.defaultContact = {
		userName: userInfo.userName,
		mobile: userInfo.mobile,
	};
	getApp().globalData.contactUser = {
		user1: {},
		user2: {},
		user3: {},
		user4: {},
	};
	getApp().globalData.loadTimeData = {
		loadTimeObj1: {},
		loadTimeObj2: {},
		loadTimeObj3: {},
		loadTimeObj4: {},
	};
	getApp().globalData.loadTimeCheckInfo = {
		startHourCheckVal: '0',
		endHourCheckVal: '0',
		startCheckedMonth: '',
		endCheckedMonth: '',
	};
	getApp().globalData.batchNumber = '';
	getApp().globalData.temperatureFlag = 1;
	getApp().globalData.editAddressItem = {};
	getApp().globalData.goodsVo = [];
	getApp().globalData.goodsTypeVo = [];
	getApp().globalData.carTypeVo = {
		vehicleLength: '',
		vehicleModel: '',
		vehicleNumber: 1,
	};
	getApp().globalData.showLoadGoods2 = false;
	getApp().globalData.showUnloadGoods2 = false;
	getApp().globalData.addressObject = {
		loadGoods1: {},
		loadGoods2: {},
		unloadGoods1: {},
		unloadGoods2: {},
	};
	getApp().globalData.Val = [];
	getApp().globalData.orderValueAddedVOS = {};
	getApp().globalData.showTemperatureVal = [];
	getApp().globalData.creatScope = {
		creatTimeType: 1,
		dateVal: 1,
		hourVal: '',
		minVal: '',
		creatScopeType: [1],
		checkedGroup: []
	};
	getApp().globalData.handlingInstructions = { // 装卸说明
		handingRequiredVal: [],
		restrictedZoneVal: '',
		checkedLimit: 1,
		agingTime: '',
		checkedTemperature: '',
		lowTemperature: '',
		highTemperature: '',
		temperatureMonitor: '',
		orderRemark: '',
	};
	getApp().globalData.otherShipping = { // 货源托运人
		userName: '',
		userId: ''
	};
	// 将装货时间设为默认
	getApp().globalData.defaultContact.monthCheckVal = '0';
	getApp().globalData.defaultContact.startCheckedMonth = '0';
	getApp().globalData.defaultContact.startHourCheckVal = '0';
	getApp().globalData.defaultContact.newChooseAddressObj = {};
	getApp().globalData.defaultContact.newAddressChooseSerial = '';
	getApp().globalData.defaultContact.newGoodsObj = {};
}



// 推荐再App.vue中使用
const PACKAGE_INFO_KEY = '__package_info__'

//检查版本号
export async function checkVersion() {
	if (ENV == "development") return;
	try{
		if (!utils.btnRepeat()) return false;
		var version = plus.runtime.version;
		var userRole = uni.getStorageSync("userRole");
		console.log(version, '版本号');
		var res = await utils.postRequest("/yh/version/vc/check", {
			serviceType: userRole == 1 ? 10 : 20,
			versionNo: version
		});
		console.log(res, 'asasaaa');
		if (res.retCode == "0000000") {
			if (res.rspBody.resultFlag == 1) {
				//说明版本不一致，有新版本
				var result = res.rspBody;
				var tipNote = res.rspBody.tipNote;
				result.type = "whole";
				result.message = tipNote.split("&&&");
				result.url = "https://hyzg-app.oss-cn-beijing.aliyuncs.com/cargoChina-appTest/hyzg.apk";
				result.platform = uni.getSystemInfoSync().platform;
				result.is_mandatory = res.rspBody.forceFlag;
				result.version = res.rspBody.versionNo;
				result.contents = tipNote.split("&&&");
				uni.setStorageSync(PACKAGE_INFO_KEY, result);
				setTimeout(() => {
					uni.navigateTo({
						url: `/uni_modules/uni-upgrade-center-app/pages/upgrade-popup?local_storage_key=${PACKAGE_INFO_KEY}`,
						success: res =>{
						},
						fail: (err) => {
							console.error('更新弹框跳转失败', err)
							uni.removeStorageSync(PACKAGE_INFO_KEY)
							
						}
					})
					
				}, 2000)
				return true;
				
			} else {
				return false;
			}
		} else {
			return false;
		}
	}catch(e){
		return false
	}
	
}

//判断版本不弹窗
export async function checkVersionNoAlert() {
	try{
		if (!utils.btnRepeat()) return false;
		var version = plus.runtime.version;
		var userRole = uni.getStorageSync("userRole");
		console.log(version, '版本号');
		var res = await utils.postRequest("/yh/version/vc/check", {
			serviceType: userRole == 1 ? 10 : 20,
			versionNo: version
		});
		console.log(res, 'asasaaa');
		if (res.retCode == "0000000") {
			if (res.rspBody.resultFlag == 1) {
				return true;
				
			} else {
				return false;
			}
		} else {
			return false;
		}
	}catch(e){
		return false
	}
	
}

//地理编码获取区划编码
export function getCityCode(searchVal) {
	return new Promise((resolve, reject) => {
		let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780' + '&address=' + searchVal;
		console.log("parameters",parameters)
		uni.request({
			url: 'https://restapi.amap.com/v3/geocode/geo?' + parameters, //仅为示例，并非真实接口地址。
			method: 'GET',
			data: {},
			header: {},
			success: (res) => {
				console.log("地理11",res)
				var geocodesData = res.data.geocodes;
				if(geocodesData && geocodesData.length == 0) {
					uni.showToast({
						title: '未查询到此地址！',
						duration: 2000,
						icon: 'none'
					});
				} else {
					resolve(geocodesData)
				}
			},
			fail: (err) => {
				
			},
			complete: (com) => {
	
			}
		});
	})
}

//关键字搜索api
export function getNearbyPOI(searchVal, pageNum) {
	return new Promise((resolve, reject) => {
		let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780' + '&keywords=' + searchVal + '&page_size=20&page_num=' + pageNum;
		console.log("cans", parameters);
		uni.request({
			url: 'https://restapi.amap.com/v5/place/text?' + parameters, //仅为示例，并非真实接口地址。
			method: 'GET',
			data: {},
			header: {},
			success: (res) => {
				console.log("获取搜索PIO信息", res)
				var geocodesData = res.data.pois;
				if(geocodesData && geocodesData.length == 0) {
					resolve({
						status: 3,
					})
				} else {
					resolve({
						status: 2,
						geocodesData: geocodesData
					})
				}
			},
			fail: (err) => {
				
			},
			complete: (com) => {
	
			}
		});
	})
}

//搜索附近的信息Api
export function getCityPOI(searchVal, locations, pageNum) {
	return new Promise((resolve, reject) => {
		let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780' + '&keywords=' + searchVal + '&location=' + locations + '&page_size=20&page_num=' + pageNum;
		uni.request({
			url: 'https://restapi.amap.com/v5/place/around?' + parameters, //仅为示例，并非真实接口地址。
			method: 'GET',
			data: {},
			header: {},
			success: (res) => {
				console.log("获取搜索PIO信息", res)
				var geocodesData = res.data.pois;
				if(geocodesData && geocodesData.length == 0) {
					resolve({
						status: 3,
						
					})
				} else {
					resolve({
						status: 2,
						geocodesData: geocodesData
					})
				}
			},
			fail: (err) => {
				
			},
			complete: (com) => {
	
			}
		});
	})
}

// 订阅群聊消息（在创建车队、加入车队时调用此方法）
export function subscribeGroup(fleetCode) {
	var groupIds = [];
	groupIds.push(fleetCode);
	this.goEasy.im.subscribeGroup({
	    groupIds: groupIds,
	    onSuccess: function () {  //订阅成功
	       console.log("订阅成功");
	    },
	    onFailed: function (error) { //订阅失败
	       console.log("订阅失败", error);
	    }
	});
}

// 取消订阅群聊消息（在退出车队时调用此方法）
export function unsubscribeGroup(fleetId) {
	var groupIds = [fleetId];
	this.goEasy.im.unsubscribeGroup({
	    groupIds: groupIds,
	    onSuccess: function () {  //订阅成功
	       console.log("订阅成功");
	    },
	    onFailed: function (error) { //订阅失败
	       console.log("订阅失败", error);
	    }
	});
}

// 进入私聊页面
export function jumpToChatDetails(item) {
	let name = item.data.name ? item.data.name : item.data.nickname;
	uni.navigateTo({
		url: 'chatDetails?receiverId=' + item.userId + '&avatar=' + item.data.avatar + '&nickname=' + name
	})
}

var newsAlert = null;
export function checkDriverNews() {
	//判断是否弹窗过
	var isNewsGlobalStorage = uni.getStorageSync("isNewsGlobalStorage");
	if (isNewsGlobalStorage) return;
	uni.setStorageSync("isNewsGlobalStorage", true);
	//监听消息弹框顺序
	newsAlert && clearTimeout(newsAlert);
	newsAlert = setTimeout(() => {
		findNews();
	}, 4000)
}
export async function findNews() {
	//判断是否登录，是否授权
	var userInfo = uni.getStorageSync("userInfo");
	if (!userInfo) return;
	let isOpenLocation = checkOpenGPSService();
	if (!isOpenLocation) return;
	var isNewVersion = await checkVersionNoAlert();
	console.log(isNewVersion, 'aaaaawqw');
	if (isNewVersion) return;
	setAlertOrder();
	
}
export function checkOpenGPSService(){
	//定位权限判断
	let systemType = uni.getSystemInfoSync().platform;
	if(systemType ==='android'){
		// var isOpen = PemissionModule.isLocationOpen();
		// return isOpen;
		return true;
	} else {
		return true;
	}
}
export async function setAlertOrder() {		
	
	try{
		var isNotificationNews = uni.getStorageSync("isNotificationNews"); 
		if (isNotificationNews) {
			uni.setStorageSync("isNotificationNews", false);
			return;
		}; //如果是通知栏消息进来则不执行
		var goodsNews = await utils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 10, types: [6], "opTypes": [76]});
		console.log(goodsNews, '新货源推送消息111');
		if (goodsNews.retCode != "0000000") return;
		var total = goodsNews.rspBody.total;
		var goodsNewsStorage = uni.getStorageSync("goodsNewsStorage"); //货源推送消息的弹窗
			console.log(goodsNews,goodsNewsStorage, '新货源推送消息');
		if (total != goodsNewsStorage && total > 0) {
			var item = goodsNews.rspBody.items[0];
			//有新的货源推送消息
			//判断该货源是否有效
			var isHasE = await isHasEffective(item);
			console.log(isHasE, '是否有效1')
			if (isHasE) {
				//货源有效则弹框
				uni.navigateTo({
					url: '/pages/ship/index/newsAlert?type=1&details=' + JSON.stringify(item)
				})
			}
			uni.setStorageSync("goodsNewsStorage", total);
			return
		}
		var userInfo = uni.getStorageSync("userInfo");
		if (!userInfo) return;
		var userId = JSON.parse(userInfo).userId;
		// var carSourceRsp = await utils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 10, types: [6], "opTypes": [75]});
		// console.log(carSourceRsp, '车源消息数据')
		// if (carSourceRsp.retCode != "0000000") return;
		// var countNumber = carSourceRsp.rspBody.total;
		// var carSourceNewsStorage = uni.getStorageSync("carSourceNewsStorage");
		// console.log(carSourceNewsStorage,countNumber, '车源消息12121');
		// if (countNumber != carSourceNewsStorage) {
		// 	var item = carSourceRsp.rspBody.items[0];
		// 	//有新的车源消息
			
		// 	// this.$refs.newsAlert.showPop();
		// 	uni.navigateTo({
		// 		url: '/pages/ship/index/newsAlert?type=2&details=' + JSON.stringify(item)
		// 	})
		// 	uni.setStorageSync("carSourceNewsStorage", countNumber);
		// 	return;
		// }
		//撩一撩新消息
		var liaoRsp = await utils.postRequest("/cy/carSourceInteraction/get_count_by_user_id", {
			userId: userId
		})
		if (liaoRsp.retCode != "0000000") return;
		var liaoNum = liaoRsp.rspBody.countNumber;
		var carSourceLiaoNewsStorage = uni.getStorageSync("carSourceLiaoNewsStorage");
		console.log(liaoNum, carSourceLiaoNewsStorage, userId, 'aasas');
		if (liaoNum != carSourceLiaoNewsStorage && liaoNum > 0) {
			//有新的撩一撩数据
			var nowdataSid = liaoRsp.rspBody.nowdataSid;
			var items = {
				content: '有货主对您的车源有兴趣',
				note: nowdataSid,
			}
			uni.navigateTo({
				url: '/pages/ship/index/newsAlert?type=4&details=' + JSON.stringify(items)
			})
			uni.setStorageSync("carSourceLiaoNewsStorage", liaoNum);
			return;
		}
		//车队邀请消息
		var fleetRsp = await utils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 10, types: [6], "opTypes": [73]});
		console.log(fleetRsp, '车队邀请消息')
		if (fleetRsp.retCode == "0000000") {
			var total = fleetRsp.rspBody.total;
			var fleetsNewsStorage = uni.getStorageSync("fleetsNewsStorage");
			console.log(total, fleetsNewsStorage, '数量')
			if (total != fleetsNewsStorage && total > 0) {
				//有新的车队邀请消息
				
				var item = fleetRsp.rspBody.items[0];
			
				// this.$refs.newsAlert.showPop();
				uni.navigateTo({
					url: '/pages/ship/index/newsAlert?type=3&details=' + JSON.stringify(item)
				})
				uni.setStorageSync("fleetsNewsStorage", total);
				return;
			}
		}
	}catch(e){
		//TODO handle the exception
	}
	
	
}
export async function getDriverOrder(sid) {
	console.log('货源的sid', sid)
	
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
				var longitude = getApp().globalData.longitude;
				var latitude = getApp().globalData.latitude;
				console.log("定位地址", startDistance)
				var distance = 0;
				if (longitude && latitude) {
					distance = getFlatternDistance(startDistance[0], startDistance[1], latitude, longitude);
					distance = Number(distance) ? distance : 0;
				} else {
					distance = details.distance ? ((details.distance)/1000).toFixed(0) : 0;
				}
				console.log(distance)
				supplyDetails.distance = distance;
				
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
				
				if (orderState !== 3) {
					goodsUserName = goodsUserName.substring(0, 1) + '**';
					enterpriseName = enterpriseName ? enterpriseName.substring(0, 2) + '****' : '';
				}
				
				supplyDetails.goodsUserName = goodsUserName;
				supplyDetails.enterpriseName = enterpriseName;
				//货物信息相关
				var goodsTypeVO = details.cargoChild ? details.cargoChild.goodsTypeVO : [],
					goodArr = [];
				var cargoChild = details.cargoChild;
				if (goodsTypeVO && goodsTypeVO.length > 0) {
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
				}
				
				var goods = goodArr.join(",");
			
				//单位
				var weight = 0;
				var volume = 0;
				//车长
				var cargoChild = details.cargoChild;
				if (cargoChild) {
					weight = cargoChild.weight;
					volume = cargoChild.volume;
				}
				supplyDetails.goods = goods;
				supplyDetails.weight = weight;
				supplyDetails.volume = volume;
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
				var remark = details.cargoChild ? details.cargoChild.remark : '';
				//是否需要回单
				var receiptTypeText = details.receiptType == 1 ? '需要回单' : '不需要回单';
				//图片
			
				var goodsUrl = details.cargoChild ? details.cargoChild.goodsUrl : '';
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
					
				}
				
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
				supplyDetails.cargoSource = details.cargoSource;
				supplyDetails.unbrokenFlag = details.unbrokenFlag;
				console.log(supplyDetails, 'aaa')
				
				return supplyDetails
			} catch (e) {
				//TODO handle the exception
				console.log(e)
				return null
			}
		} else {
			uni.showToast({
				title: response.retDesc,
				icon: 'none'
			})
			return null;
		}
	} catch (e) {
		//TODO handle the exception
		console.log(e)
		return null;
	}
	
}
export async function isHasEffective(item) {
	let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
	
		var supplyDetails = await getDriverOrder(item.note);
		if (!supplyDetails) return;
		if (supplyDetails.orderSecondState == 15) {
			// uni.showToast({
			// 	title: '货源已下架，请查看其它货源吧~',
			// 	icon: 'none'
			// })
			return false;
		}
		if (supplyDetails.orderSecondState == 18) {
			// uni.showToast({
			// 	title: '货源已关闭，请查看其它货源吧~',
			// 	icon: 'none'
			// })
			return false;
		}
		if (supplyDetails.orderSecondState != 11 && supplyDetails.orderSecondState != 13 && supplyDetails.orderSecondState != 14 && supplyDetails.orderQuotationStatus == undefined && supplyDetails.multiTruck < 2) {
			// uni.showToast({
			// 	title: '货源已关闭，请查看其它货源吧~',
			// 	icon: 'none'
			// })
			return false;
		}
		var multiTruck = supplyDetails.multiTruck;
		var orderQuoation = supplyDetails.orderQuotationStatus;
		if (multiTruck > 1) {
			if ((orderQuoation !== undefined && orderQuoation <= 2)) {
				// uni.showToast({
				// 	title: '当前货源已报价',
				// 	icon: 'none'
				// })
				return false;
			}
		} else {
			if ((orderQuoation !== undefined && orderQuoation <= 2) || orderQuoation > 4) {
				// uni.showToast({
				// 	title: '当前货源已报价',
				// 	icon: 'none'
				// })
				return false; 
			}
		}
		
		return true;
}

export function checkUserFleetPermissions(checkType, fleetType, isOwner, isAdmin, isMember, hasPaid) { // 检查用户在车队内的权限，用于判断信息是否加密
	// 已知判断条件{
	// 	checkType: 'sensitiveInformation', // 需要判断的类型，sensitiveInformation=需要脱敏的判断，hasPaidInformation=需要付费查看的信息，driverDetails=司机详情
	// 	userRole: 1, // 1:司机，2:货主
	// 	fleetType: 1, // 1:超级车队，2:普通车队
	// 	isOwner: 0, // 1:是创建者，0:非创建者
	// 	isAdmin: 0, // 1:是管理员，0:非管理员
	// 	isMember: 0, // 1:是成员，0:是游客
	// 	hasPaid: 0, // 1:已付费，0:未付费
	// }
	let userInfo = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : '';
	let userRole = uni.getStorageSync('userRole') ? Number(uni.getStorageSync('userRole')) : '';
	switch(checkType) {
		case 'sensitiveInformation':
			break;
		case 'hasPaidInformation':
			break;
		case 'driverDetails':
			if(userRole == 1) { // 司机角色不可查看司机详情
				return false;
			}else {
				if(fleetType == 1) {
					
				}else {
					
				}
				// if(hasPaid == 1) { // 货主角色付费后可查看司机详情
				// 	return true;
				// }else {
				// 	return false;
				// }
			}
		default:
			return false;
	}
}


//埋点统计
//type：埋点类型
//params： 埋点参数
export function addBuried(pageName) {
	var userInfo = uni.getStorageSync("userInfo");
	if (!userInfo) return;
	var userId = JSON.parse(userInfo).userId;
	var now = new Date();
	var viewDt = utilData.dateFormat("YYYY-mm-dd HH:MM:SS", now);
	var clientType = 2;
	var sendParams = {
		userSid: userId,
		clientType,
		pageName,
		viewDt
	}	
	utils.postRequest("/danas/pageViewLog/add", sendParams);
	
}


//获取高德的路线规划距离
/*
 * 
 * @param {经度在前，纬度在后，经度和纬度用","分割，经纬度小数点后不得超过6位。} origin 
 * @param {经度在前，纬度在后，经度和纬度用","分割，经纬度小数点后不得超过6位。} destination 
 */
export function getDrivingRouter(origin, destination) {
	if (!origin) return;
	if (!destination) return;
	let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780' + '&origin=' + origin + '&destination=' + destination;
	return new Promise((resolve, reject) => {
		uni.request({
			url: "https://restapi.amap.com/v5/direction/driving?" + parameters,
			method: 'GET',
			data: {},
			header: {},
			success: (res) => {
				console.log("驾车获取路线", res)
				resolve(res)
			},
			fail: function(err) {
				console.log("驾车获取路线失败", err)
				reject(err)
			}
		})
	})
}

//全局权限申请提示
export function requestPower(content, callback) {
	uni.showModal({
		title: '提示',
		content: content,
		success: function(res) {
			if(res.confirm) {  
				callback();
			} else {  
				console.log('cancel') //点击取消之后执行的代码 
			} 
		}
	})
}