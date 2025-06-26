import { BASEURL_HJ, MAP_URL, ENV, QUERYURL_HJ, REGISTERURL_HJ } from "./baseUrl";
const ApiRootUrl = BASEURL_HJ;
const QueryApiRootUrl = QUERYURL_HJ;
const RegisterApiRootUrl = REGISTERURL_HJ;

const env = ENV != "PRO" ? 'dev' : 'pro';

const hhyApiRootUrl = ApiRootUrl == 'https://hyjy-test.hyzgapp.com:8600/api' ? "https://hhy-test.cargocn.com:8600/api":"https://hhy.cargocn.com/api";
// const ApiRootUrl = 'http://172.16.10.97:10183'; //陈瑞

// const ApiRootUrl = 'http://iqlee.asuscomm.com:10183/api'; //益俊
// const ApiRootUrl = 'http://172.16.10.67:10183'   //卢
// const ApiRootUrl = 'http://172.16.10.114:10183'; // 晗
// const ApiRootUrl = 'http://3419w32r88.qicp.vip/api'; // 鑫伟
// const ApiRootUrl = 'http://172.16.10.67:10183'; // 现争
// const ApiRootUrl = 'http://192.168.0.110:10183'; //任佳
// const ApiRootUrl = 'http://172.16.10.73:10183/api'; // 后端本地
// const ApiRootUrl = 'http://192.168.10.82:10183/api'; // 开发环境
// const ApiUrl = "https://hyjy.hyzgapp.com";
const ApiUrl = MAP_URL;
// const ApiUrl = "http://192.168.10.70:85";
// const ApiRootUrl = 'http://192.168.10.82/api'; // 开发环境
var webUrl = '', fleetUrl="", fleetMap = "", lingdanMap = "", carSourceMap = "", trackMapUrl = "", memberPolicy = "", pointAggregationUrl = "", fleetLocationMap = "";
var fleetTrack = "", carSourceTrack = "", fleetDetailMap = "";

webUrl = MAP_URL + '/webView.html';
fleetUrl = MAP_URL + '/locationView.html';
fleetMap = MAP_URL + '/fleeterMap.html';
lingdanMap = MAP_URL + '/lingdanMap.html';
carSourceMap = MAP_URL + '/carSourceMap.html';
trackMapUrl = MAP_URL + '/trackMap.html';
memberPolicy = MAP_URL + "/memberPolicy.html";
pointAggregationUrl = MAP_URL + "/pointAggregation.html"; //点聚合地图
fleetLocationMap = MAP_URL + "/fleetLocationMap.html"; //车队地图
fleetDetailMap = MAP_URL + "/fleetDetailMap.html";
fleetTrack =  MAP_URL + "/fleetTrack.html"; //车队司机地图
carSourceTrack = MAP_URL + "/carSourceTrack.html"; //车源司机地图


// console.log(webUrl);
var supportTime;
// import {token} from "./config.js";

// 测试token
var testToken = 'eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSMlTSUSotTi3yTFGyMtRRyslPz8wLqSxIBfKMdJRSKwqADDMjS1NDAzNzk1oA4BGknTYAAAA.pr81FfKnQQTYIFa0gH09Z7oB-cvWotyMn6ankBuwuUA';

function checkLocation() { // 检查是否可以获取定位信息
	uni.getLocation({
	    type: 'wgs84',
	    success: function (res) {
			return true;
	    },
		fail: function (err) {
	        console.log('定位失败' + err);
			uni.showModal({
				showCancel: false,
				title: '提示',
				content: '没有开启定位或定位失败,请检查手机授权！',
				success: function(res) {
					return false;
				}
			})
			return false;
	    },
	});
}

function loginRequest(url, data = {}, method = "POST") {
	return new Promise(function(resolve, reject) {
		// console.log('请求路径', ApiRootUrl + url)
		// var obj = JSON.parse(JSON.stringify(data));
		// var buriedPoint = {
		// 	commonFrontLabel: getApp().globalData.commonObj.commonFrontLabel,
		// 	commonPhoneModel: getApp().globalData.commonObj.commonPhoneModel,
		// 	commonFrontType: 'mobile',
		// 	commonApplication: 'app',
		// 	commonUserName: '',
		// 	commonUserId: '',
		// 	commonFunctionName: url,
		// 	commonNowVersion: getApp().globalData.appVersion,
		// 	commonSystemVersion: getApp().globalData.commonObj.commonSystemVersion,
		// }
		// var newData = Object.assign(data, buriedPoint);
		// newData.commonRequestParams = JSON.stringify(obj);
		// console.log('请求url', ApiRootUrl + url);
		// console.log('请求参数', data);
		
		data.tflg = '1';
		// console.log(ApiRootUrl)
		uni.request({
			url: ApiRootUrl + url,
			data: data,
			method: method,
			header: {
				'Content-Type': 'application/json',
			},
			success: function(res) {
				console.log('登录Post', res)
				if (res.statusCode == 200) {
					resolve(res.data);
				} else {
					reject(res.errMsg);
				}
			},
			fail: function(err) {
				console.log(err)
				// if(err.statusCode == -1) {
				// 	uni.showModal({
				// 		showCancel: false,
				// 		title: '提示',
				// 		content: '当前网络状况不稳定，请连接Wifi或稍后再试。',
				// 		success: function(res) {
				// 			return false;
				// 		}
				// 	})
				// }
				reject(err);
			}
		});
	});
}
function newRegisterLoginRequest(url, data = {}, method = "POST") {
	return new Promise(function(resolve, reject) {
		// console.log('请求路径', ApiRootUrl + url)
		// var obj = JSON.parse(JSON.stringify(data));
		// var buriedPoint = {
		// 	commonFrontLabel: getApp().globalData.commonObj.commonFrontLabel,
		// 	commonPhoneModel: getApp().globalData.commonObj.commonPhoneModel,
		// 	commonFrontType: 'mobile',
		// 	commonApplication: 'app',
		// 	commonUserName: '',
		// 	commonUserId: '',
		// 	commonFunctionName: url,
		// 	commonNowVersion: getApp().globalData.appVersion,
		// 	commonSystemVersion: getApp().globalData.commonObj.commonSystemVersion,
		// }
		// var newData = Object.assign(data, buriedPoint);
		// newData.commonRequestParams = JSON.stringify(obj);
		// console.log('请求url', RegisterApiRootUrl + url);
		// console.log('请求参数', data);
		
		data.tflg = '1';
		// console.log(RegisterApiRootUrl)
		uni.request({
			url: RegisterApiRootUrl + url,
			data: data,
			method: method,
			header: {
				'Content-Type': 'application/json',
			},
			success: function(res) {
				console.log('登录Post', res)
				if (res.statusCode == 200) {
					resolve(res.data);
				} else {
					reject(res.errMsg);
				}
			},
			fail: function(err) {
				console.log(err)
				// if(err.statusCode == -1) {
				// 	uni.showModal({
				// 		showCancel: false,
				// 		title: '提示',
				// 		content: '当前网络状况不稳定，请连接Wifi或稍后再试。',
				// 		success: function(res) {
				// 			return false;
				// 		}
				// 	})
				// }
				reject(err);
			}
		});
	});
}
var Authorization = "", mmobile = "";
function postRequest(url, data = {}, method) {
	// console.log(url, '定位11');
	return new Promise(function(resolve, reject) {
		var userInfo = uni.getStorageSync("userInfo");
		var userRole = uni.getStorageSync("userRole");
		if (userInfo) {
			// console.log(userInfo, 'asa');
			mmobile = JSON.parse(userInfo).mobile;
			Authorization = JSON.parse(userInfo).attrs.token
			
		} else {
			Authorization = '';
			mmobile = "";
		}
		data.tflg = 1;
		
		//当前用户的卡友号
		data.currentUserCode = userInfo ? JSON.parse(userInfo).attrs.userCode : undefined;
		var newData = {};
		//判断data是否是数组或对象，是对象则增加埋点
		if (!Array.isArray(data)) {
			var buriedPoint = {};
			buriedPoint = {
				commonFrontLabel: getApp().globalData.commonObj.commonFrontLabel,
				commonPhoneModel: getApp().globalData.commonObj.commonPhoneModel,
				commonFrontType: 'mobile',
				commonApplication: 'app',
				commonUserName: userInfo ? JSON.parse(userInfo).userName : '',
				commonUserId: userInfo ? JSON.parse(userInfo).userId : '',
				commonFunctionName: url,
				commonNowVersion: getApp().globalData.appVersion,
				commonSystemVersion: getApp().globalData.commonObj.commonSystemVersion,
				appVersion: getApp().globalData.appVersion,
				osVersion: getApp().globalData.commonObj.commonSystemVersion,
				clientModel: getApp().globalData.commonObj.commonPhoneModel,
				
				// commonRequestParams: JSON.stringify(data),
			}
			
			newData = Object.assign({}, data, buriedPoint);
		} else {
			newData = data;
		}
		// var newData = Object.assign(data);
		
		// console.log('newobj', newData);
		// console.log('请求url', ApiRootUrl + url);
		// console.log('token交易', Authorization);
		uni.request({
			url: ApiRootUrl + url,
			data: newData,
			// data: data,
			method: method ? method : 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': Authorization,
				'mmobile': mmobile,
			},
			timeout: 30000,
			success: function(res) {
				console.log('21111', res);
				if (res.statusCode == 200) {
					if (res.data.retCode == '401') {
						// console.log('Token', Authorization);
						// console.log('Api', url);
						// console.log('用户信息', userInfo);
						// console.log('用户角色', userRole);
						var at = Authorization + url + JSON.stringify(userInfo);
						reject('未登录' + at)
						uni.removeStorageSync('userInfo');
						loginSelf(userRole);
					} else {
						resolve(res.data);
					}
				} else {
					console.log(res)
					reject(res);
				}
			},
			fail: function(err) {
				// console.log('uniPost超时', err)
				console.log('异常接口', ApiRootUrl + url, err);
				uni.showToast({
					title: '网络异常，请检查后重试',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	});
} //并发请求
function postRequestGetAll(url, data = "", method) {
	// console.log(url, '定位11');
	return new Promise(function(resolve, reject) {
		var userInfo = uni.getStorageSync("userInfo");
		var userRole = uni.getStorageSync("userRole");
		if (userInfo) {
			// console.log(userInfo, 'asa');
			mmobile = JSON.parse(userInfo).mobile;
			Authorization = JSON.parse(userInfo).attrs.token
			
		} else {
			Authorization = '';
			mmobile = "";
		}
		// var newData = Object.assign(data);
		
		// console.log('newobj', newData);
		// console.log('请求url', ApiRootUrl + url);
		// console.log('token交易', Authorization);
		uni.request({
			url: ApiRootUrl + url,
			data: data,
			method: method ? method : 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': Authorization,
				'mmobile': mmobile,
			},
			timeout: 30000,
			success: function(res) {
				// console.log('21111', res);
				if (res.statusCode == 200) {
					if (res.data.retCode == '401') {
						// console.log('Token', Authorization);
						// console.log('Api', url);
						// console.log('用户信息', userInfo);
						// console.log('用户角色', userRole);
						var at = Authorization + url + JSON.stringify(userInfo);
						reject('未登录' + at)
						uni.removeStorageSync('userInfo');
						loginSelf(userRole);
					} else {
						resolve(res.data);
					}
				} else {
					console.log(res)
					reject(res);
				}
			},
			fail: function(err) {
				// console.log('uniPost超时', err)
				console.log('异常接口', ApiRootUrl + url);
				uni.showToast({
					title: '网络异常，请检查后重试',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	});
} //并发请求
function newQueryPostRequest(url, data = {}, method) {
	// console.log(url, '定位11');
	return new Promise(function(resolve, reject) {
		var userInfo = uni.getStorageSync("userInfo");
		var userRole = uni.getStorageSync("userRole");
		if (userInfo) {
			// console.log(userInfo, 'asa');
			mmobile = JSON.parse(userInfo).mobile;
			Authorization = JSON.parse(userInfo).attrs.token
			
		} else {
			Authorization = '';
			mmobile = "";
		}
		data.tflg = 1;
		
		//当前用户的卡友号
		data.currentUserCode = userInfo ? JSON.parse(userInfo).attrs.userCode : undefined;
		var newData = {};
		//判断data是否是数组或对象，是对象则增加埋点
		if (!Array.isArray(data)) {
			var buriedPoint = {};
			buriedPoint = {
				commonFrontLabel: getApp().globalData.commonObj.commonFrontLabel,
				commonPhoneModel: getApp().globalData.commonObj.commonPhoneModel,
				commonFrontType: 'mobile',
				commonApplication: 'app',
				commonUserName: userInfo ? JSON.parse(userInfo).userName : '',
				commonUserId: userInfo ? JSON.parse(userInfo).userId : '',
				commonFunctionName: url,
				commonNowVersion: getApp().globalData.appVersion,
				commonSystemVersion: getApp().globalData.commonObj.commonSystemVersion,
				appVersion: getApp().globalData.appVersion,
				osVersion: getApp().globalData.commonObj.commonSystemVersion,
				clientModel: getApp().globalData.commonObj.commonPhoneModel,
				
				// commonRequestParams: JSON.stringify(data),
			}
			
			newData = Object.assign({}, data, buriedPoint);
		} else {
			newData = data;
		}
		// var newData = Object.assign(data);
		
		// console.log('newobj', newData);
		// console.log('请求url', QueryApiRootUrl + url);
		// console.log('token交易', Authorization);
		uni.request({
			url: QueryApiRootUrl + url,
			data: newData,
			// data: data,
			method: method ? method : 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': Authorization,
				'mmobile': mmobile,
			},
			timeout: 30000,
			success: function(res) {
				// console.log('21111', res);
				if (res.statusCode == 200) {
					if (res.data.retCode == '401') {
						// console.log('Token', Authorization);
						// console.log('Api', url);
						// console.log('用户信息', userInfo);
						// console.log('用户角色', userRole);
						var at = Authorization + url + JSON.stringify(userInfo);
						reject('未登录' + at)
						uni.removeStorageSync('userInfo');
						loginSelf(userRole);
					} else {
						resolve(res.data);
					}
				} else {
					console.log(res)
					reject(res);
				}
			},
			fail: function(err) {
				// console.log('uniPost超时', err)
				console.log('异常接口', QueryApiRootUrl + url);
				uni.showToast({
					title: '网络异常，请检查后重试',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	});
} //并发请求
function newRegisterPostRequest(url, data = {}, method) {
	// console.log(url, '定位11');
	return new Promise(function(resolve, reject) {
		var userInfo = uni.getStorageSync("userInfo");
		var userRole = uni.getStorageSync("userRole");
		if (userInfo) {
			// console.log(userInfo, 'asa');
			mmobile = JSON.parse(userInfo).mobile;
			Authorization = JSON.parse(userInfo).attrs.token
			
		} else {
			Authorization = '';
			mmobile = "";
		}
		data.tflg = 1;
		
		//当前用户的卡友号
		data.currentUserCode = userInfo ? JSON.parse(userInfo).attrs.userCode : undefined;
		var newData = {};
		//判断data是否是数组或对象，是对象则增加埋点
		if (!Array.isArray(data)) {
			var buriedPoint = {};
			buriedPoint = {
				commonFrontLabel: getApp().globalData.commonObj.commonFrontLabel,
				commonPhoneModel: getApp().globalData.commonObj.commonPhoneModel,
				commonFrontType: 'mobile',
				commonApplication: 'app',
				commonUserName: userInfo ? JSON.parse(userInfo).userName : '',
				commonUserId: userInfo ? JSON.parse(userInfo).userId : '',
				commonFunctionName: url,
				commonNowVersion: getApp().globalData.appVersion,
				commonSystemVersion: getApp().globalData.commonObj.commonSystemVersion,
				appVersion: getApp().globalData.appVersion,
				osVersion: getApp().globalData.commonObj.commonSystemVersion,
				clientModel: getApp().globalData.commonObj.commonPhoneModel,
				
				// commonRequestParams: JSON.stringify(data),
			}
			
			newData = Object.assign({}, data, buriedPoint);
		} else {
			newData = data;
		}
		// var newData = Object.assign(data);
		
		// console.log('newobj', newData);
		// console.log('请求url', RegisterApiRootUrl + url);
		// console.log('token交易', Authorization);
		uni.request({
			url: RegisterApiRootUrl + url,
			data: newData,
			// data: data,
			method: method ? method : 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': Authorization,
				'mmobile': mmobile,
			},
			timeout: 30000,
			success: function(res) {
				// console.log('21111', res);
				if (res.statusCode == 200) {
					if (res.data.retCode == '401') {
						// console.log('Token', Authorization);
						// console.log('Api', url);
						// console.log('用户信息', userInfo);
						// console.log('用户角色', userRole);
						var at = Authorization + url + JSON.stringify(userInfo);
						reject('未登录' + at)
						uni.removeStorageSync('userInfo');
						loginSelf(userRole);
					} else {
						resolve(res.data);
					}
				} else {
					console.log(res)
					reject(res);
				}
			},
			fail: function(err) {
				// console.log('uniPost超时', err)
				console.log('异常接口', RegisterApiRootUrl + url);
				uni.showToast({
					title: '网络异常，请检查后重试',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	});
} //并发请求

function getForjw(url, data) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: url,
			// data: newData,
			data: data,
			method: "GET",
			header: {
				'Content-Type': 'application/json',
			},
			timeout: 30000,
			success: function(res) {
				// console.log('21111', res);
				if (res.statusCode == 200) {
						resolve(res.data);
				} else {
					console.log(res)
					reject(res);
				}
			},
			fail: function(err) {
				// console.log('uniPost超时', err)
				console.log('异常接口', ApiRootUrl + url);
				uni.showToast({
					title: '网络异常，请检查后重试',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	})
}
function postForhhy(url, data) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: hhyApiRootUrl + url,
			// data: newData,
			data: data,
			method: "POST",
			header: {
				'Content-Type': 'application/json',
			},
			timeout: 30000,
			success: function(res) {
				// console.log('21111', res);
				if (res.statusCode == 200) {
						resolve(res.data);
				} else {
					console.log(res)
					reject(res);
				}
			},
			fail: function(err) {
				// console.log('uniPost超时', err)
				console.log('异常接口', ApiRootUrl + url);
				uni.showToast({
					title: '网络异常，请检查后重试',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	})
}

var jumpLoginFlag = false;
//文件上传
function upLoadFile(url, filePath, params) {
	// console.log('接口', url)
	// console.log('图片', filePath)
	// console.log('字段', params)
	var userInfo = uni.getStorageSync('userInfo');
	var data = new Object();
	// if (params) {
	// 	data = {
	// 		userType: '84',
	// 		...params
	// 	}
	// } else {
	// 	data = {
	// 		userType: '84',
	// 	}
	// }
	if (params && params.side) {
			data = {
				userType: '84',
				side: params.side,
			}
		} else {
			data = {
				userType: '84',
			}
		}

	// if (!userInfo) {
	// 	return
	// }
	console.log('文件上传参数', data)
	var useRole = uni.getStorageSync("userRole");
	return new Promise(function(resolve, reject) {
		console.log(ApiRootUrl + url, filePath, "请求参数")
		uni.uploadFile({
			url: ApiRootUrl + url,
			method: 'POST',
			header: {
				'Authorization': useRole == 1 ? JSON.parse(userInfo).attrs.token : JSON.parse(userInfo).attrs.token
			},
			formData: data,
			name: 'file',
			filePath: filePath,
			success: function(res) {
				console.log(res, '文件上传成功')
				var response = JSON.parse(res.data)
				if (response.retCode == "0000000") {
					resolve(response);
				} else {
					reject(response);
				}
			},
			fail: function(err) {
				console.log('失败失败', err)
				reject(err);
			}
		});
	});
}
function loginSelf(userRole) {
	// uni.navigateTo({
	// 	url: '/pages/login/login/login?userRole=' + userRole
	// })
	// return;
	//https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/loginBackground.png
	let univerifyStyle = { // 一件登录页面配置
		"fullScreen": true,
		"backgroundImage": "https://hyzg-app.oss-cn-beijing.aliyuncs.com/cargoChina-appTest/loginBackground.png",
		"privacyTerms": {
			"checkBoxSize":"18px",
			"defaultCheckBoxState":"false", // 条款勾选框初始状态 默认值： true   
			"textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB  
			"termsColor": "#5496E3", //  协议文字颜色 默认值： #5496E3  
			"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”  
			"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”  
			"privacyItems": [  
				// 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效  
				{  
					// "url": "https://www.hyzgapp.com/akpdownload/privacyPolicy.html", // 点击跳转的协议详情页面
					"url": "https://m-test.hyzgapp.com/#/privacy", // 点击跳转的协议详情页面
					
					"title": "隐私政策" // 协议名称  
				}  
			]  
		}
	};
	// console.log('用户角色', userRole);
	// console.log('预登录');
	uni.preLogin({
	    provider: 'univerify',
	    success(res){
			console.log(res, '预登录成功')
	        uni.login({
	        	provider: 'univerify',
	        	univerifyStyle: univerifyStyle,
	        	success: function(res) {
	        		console.log(res, '返回接口')
	        		// var params = {
	        		// 	userRole: userRole,
	        		// 	loginType: 70,
	        		// 	userType: 7,
	        		// 	businessType: userRole == 1 ? 10 : 20,
	        		// 	appAccessToken: res.authResult.access_token,
	        		// 	appOpenId: res.authResult.openid,
	        		// 	consentProtocol: 1
	        		// }
	        		// console.log(params, '一键登录的参数')
					// console.log(userRole, 'aaaa111')
					
					var params = {
						userRole: userRole,
						loginType: 70,
						userType: 7,
						businessType: userRole == 1 ? 10 : 20,
						appAccessToken: res.authResult.access_token,
						appOpenId: res.authResult.openid,
						consentProtocol: 1
					}
					console.log(params);
					newRegisterLoginRequest("/au/login", params).then(response => {
						uni.hideLoading();
						// console.log('登录结果', response);
						// umengEvent();
						if (response.retCode == "0000000") {
							
							var data = JSON.stringify(response.rspBody);
							console.log(response.rspBody)
							uni.setStorageSync("userInfo", data);
							uni.setStorageSync('userRole', userRole)
							uni.$emit("refreshData_source");
							uni.$emit("refreshData_index");
							uni.$emit("changeUserRefresh");
							uni.$emit("refreshData_fleet");
							uni.$emit("goEasyChangeUser");
							// uni.$emit("locationSend");
							if (userRole == 1) {
								uni.setStorageSync("remindStatus", 0)
								// uni.reLaunch({
								// 	url: '/pages/my/myHobby/myHobby'
								// })
								var userCode = response.rspBody.attrs.userCode;
								postRequest('/yh/user/task/status/change/log/today/check', {userCode: response.rspBody.attrs.userCode})
								.then(res => {
									console.log('接单状态', res);
									if (res.retCode == '0000000') {
										if(!res.rspBody) {
											setTimeout(() => {
												uni.closeAuthView();
												// uni.reLaunch({
												// 	url: '/pages/loginHint/driverStatus'
												// })
												// uni.switchTab({
												// 	url: '/pages/ship/index/index_car_source'
												// })
												setTabbarItem(userRole);
											}, 1000)
										}else {
											let cParams = {
												"userId": response.rspBody.userId,
												"typeCodeList": ['MY_VEHICLE', 'OFTEN_AREA', 'ROAD_TYPE', 'FAVORITE_CARGO']
											}
											postRequest("/yh/upd/tags/tag/check/by/type", cParams)
											.then(res => {
												let typeLengthAreacheckFlag = res.rspBody.allTypeCountFlag;
												// let typeLengthAreacheckFlag = res && res.rspBody ? res.rspBody : '';
												if(typeLengthAreacheckFlag == 1) {
													uni.closeAuthView();
													setTabbarItem(userRole);
												}else {
													uni.closeAuthView();
													setTimeout(() => {
														uni.reLaunch({
															url: '/pages/my/myHobby/myHoby_driver'
														})
													}, 1000)
												}
											})
											.catch(err => {
												console.log(err);
												uni.closeAuthView();
												setTabbarItem(userRole);
											})
	// 										postRequest("/yh/personas/getCheck", {
	// 											userCode: userCode
	// 										}).then(res => {
	// 											uni.hideLoading();
	// 											var carParams = [], carLenParams = [];
	// 											if (res.retCode == "0000000") {
	// 												var data = res.rspBody;
	// 												console.log('喜好是否已配置', data);
	// 												carParams = data.carModelList;
	// 												carLenParams = data.carLengthList;
	// 											}
	// 											console.log(userRole, '角色');
	
	// 											if (response.rspBody.attrs.vehicleVerify != 1 && (carParams.length < 1 || carLenParams.length < 1)) {
	// 												console.log('跳转阿飒飒飒飒')
	// 												setTimeout(() => {
	// 													uni.closeAuthView();
	// 													uni.reLaunch({
	// 														url: '/pages/my/myHobby/myHoby_driver'
	// 													})
	// 												}, 1000)
	// 											} else {
	// 												uni.closeAuthView();
	// 												setTabbarItem(userRole);
	// 											}
	// 										})
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
									uni.closeAuthView();
									setTabbarItem(userRole);
									console.log(err);
								})
							} else {
								postRequest('/yh/enterprise/select/detail', {userCode: response.rspBody.attrs.userCode})
								.then(res=>{
									console.log('企业认证详情一键登录', res);
									if(res.retCode == "0000000") {
										if(res.rspBody && res.rspBody.contractNum && res.rspBody.contractNum != '0') {
											getApp().globalData.costInformation.needInvoiceFlag = 1;
											console.log('一键登录costInformation', getApp().globalData.costInformation);
										}
									}
								})
								uni.closeAuthView();
								setTabbarItem(userRole);
							}
						}else {
							console.log(response.retDesc);
							uni.hideLoading();
							uni.getSystemInfo({
								success: (res) => {
									if (res.platform == 'ios') {
										uni.closeAuthView();
										uni.showToast({
											title: response.retDesc,
											icon: 'none',
											duration: 5000
										})
										uni.navigateTo({
											url: '/pages/login/login/login?userRole=' + userRole
										})
									}else {
										uni.showToast({
											title: response.retDesc,
											icon: 'none',
											duration: 5000
										})
										setTimeout(()=>{
											uni.closeAuthView();
											uni.navigateTo({
												url: '/pages/login/login/login?userRole=' + userRole
											})
										}, 4000)
									}
								},
								fail: (err) => {
									uni.showToast({
										title: response.retDesc,
										icon: 'none',
										duration: 5000
									})
									setTimeout(()=>{
										uni.closeAuthView();
										uni.navigateTo({
											url: '/pages/login/login/login?userRole=' + userRole
										})
									}, 4000)
								}
							})
						}
					}).catch(err => {
						console.log(err)
					})
					
	        		
	        	},
	        	fail: function(err) {
	        		uni.closeAuthView();
	        		uni.navigateTo({
	        			url: '/pages/login/login/login?userRole=' + userRole
	        		})
	        	}
	        })
	    },
	    fail(err){
			console.log(err, '预登录失败')
			if(!jumpLoginFlag) {
				jumpLoginFlag = true;
				uni.showToast({
					title: '一键登录失效，系统将转为验证码方式登录',
					icon: 'none',
					duration: 4000
				})
				setTimeout(()=>{
					uni.navigateTo({
						url: '/pages/login/login/login?userRole=' + userRole
					})
					jumpLoginFlag = false;
				}, 2500)
			}
	    }
	})
	
}

// 防抖
var repeatFlag = false;
function btnRepeat() {
	if(!repeatFlag) {
	    repeatFlag = true;
	    changeFlag();
	    return true;
	}else {
	    return false;
	}
}

function changeFlag() {
	setTimeout(() => {
	    repeatFlag = false;
	}, 1500);
}

function setTabbarItem(userRole) { // 修改tabbar
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
				console.log('设置红点');
				uni.showTabBarRedDot({
				  index: 3,
				});
				// uni.switchTab({
				// 	url: '/pages/goodsDelivery/userMessage/userMessage'
				// })
			}
		})
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

module.exports = {
	setTabbarItem,
	postRequest,
	loginRequest,
	upLoadFile,
	ApiRootUrl,
	env,
	postForhhy,
	ApiUrl,
	webUrl,
	trackMapUrl,
	loginSelf,
	btnRepeat,
	fleetUrl,
	fleetMap,
	lingdanMap,
	carSourceMap,
	getForjw,
	memberPolicy,
	pointAggregationUrl,
	fleetLocationMap,
	fleetDetailMap,
	fleetTrack,
	carSourceTrack,
	newQueryPostRequest,
	newRegisterPostRequest,
	newRegisterLoginRequest,
	QueryApiRootUrl,
	RegisterApiRootUrl,
	postRequestGetAll
};
