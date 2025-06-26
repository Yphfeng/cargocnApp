import { BASEURL_HJ, BASEURL_OIL, MAP_URL } from "./baseUrl";
const ApiRootUrl = BASEURL_HJ // 生产环境
const ApiRootUrlJY = BASEURL_HJ // 生产环境

var JymRootUrl = '';
var webUrl = '';
var fleetUrl = '';
var helpUrl = '';


	webUrl = MAP_URL + '/webView.html';
	fleetUrl = MAP_URL + '/locationView.html'
	helpUrl = MAP_URL + '/helpService.html';
	JymRootUrl = BASEURL_OIL; //油的测试环境
// console.log(webUrl);
const tentCentMapKey = "EXDBZ-LL436-BRDSW-EUJA2-XD46Z-4EF54";
var supportTime;
// import {token} from "./config.js";


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
		var obj = JSON.parse(JSON.stringify(data));
		var commonHtmlTitle = '';
		if(data.commonHtmlTitle){
			commonHtmlTitle = data.commonHtmlTitle?data.commonHtmlTitle:'';
		}
		var pages = getCurrentPages();  
		var prevPage = pages[pages.length - 1]; 
		var buriedPoint = {
			commonFrontLabel: 'driver',
			commonPhoneModel: getApp().globalData.commonPhoneModel,
			commonFrontType: 'mobile',
			commonApplication: 'app',
			commonUserName: '',
			commonUserId: '',
			commonHtmlTitle: commonHtmlTitle,
			commonFunctionName: url,
			commonNowVersion: getApp().globalData.appVersion,
			commonSystemVersion: getApp().globalData.commonSystemVersion,
			commonFrontPath: prevPage.route
		}
		var newData = Object.assign(data, buriedPoint);
		if(obj.commonHtmlTitle){
			delete obj.commonHtmlTitle;
		}
		newData.commonRequestParams = JSON.stringify(obj);
		console.log(ApiRootUrl + url, "url一键登录1", JSON.stringify(newData))
		uni.request({
			url: ApiRootUrl + url,
			data: newData,
			method: method,
			header: {
				'Content-Type': 'application/json',
			},
			success: function(res) {
				console.log(res, 'ass')
				if (res.statusCode == 200) {
					console.log(res, 'ass11111111111')
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
var Authorization = "";

function postJymRequest(url, data = {}, method = "POST") {
	return new Promise(function(resolve, reject) {
		var userInfo = uni.getStorageSync("userInfo");
		var token = uni.getStorageSync("token");
		if (token) {
			Authorization = token
		} else {
			Authorization = ""
		}
		var commonHtmlTitle = '';
		var obj = JSON.parse(JSON.stringify(data));
		if(data.commonHtmlTitle){
			commonHtmlTitle = data.commonHtmlTitle?data.commonHtmlTitle:'';
		}
		var pages = getCurrentPages();  
		var prevPage = pages && pages.length ? pages[pages.length - 1] : {};
		// console.log('route信息===================>', pages.length);
		var myRoute = prevPage.route ? prevPage.route : 'pages/index/srevice/srevice';
		var buriedPoint = {
			commonFrontLabel: 'driver',
			commonPhoneModel: getApp().globalData.commonPhoneModel,
			commonFrontType: 'mobile',
			commonApplication: 'app',
			commonUserName: userInfo?JSON.parse(userInfo).userName:'',
			commonUserId: userInfo?JSON.parse(userInfo).userId:'',
			commonHtmlTitle: commonHtmlTitle,
			commonFunctionName: url,
			commonNowVersion: getApp().globalData.appVersion,
			commonSystemVersion: getApp().globalData.commonSystemVersion,
			commonFrontPath: myRoute
		}
		// console.log('埋点===================>', buriedPoint);
		var newData = Object.assign(data, buriedPoint);
		if(obj.commonHtmlTitle){
			delete obj.commonHtmlTitle;
		}
		newData.commonRequestParams = JSON.stringify(obj);
		uni.request({
			url: JymRootUrl + url,
			data: newData,
			method: method,
			header: {
				'Content-Type': 'application/json',
				'Authorization': Authorization
			},
			timeout: 30000,
			success: function(res) {
				// console.log('21111', res);
				if (res.statusCode == 200) {
					if (res.data.retCode == '401') {
						// uni.showToast({
						// 	title: '登录信息已失效，请重新登录',
						// 	icon: 'none',
						// })
						uni.removeStorageSync('userInfo');
						loginSelf();
						reject('未登录')
					} else {
						resolve(res.data);
					}
				} else {
					console.log(JymRootUrl + url)
					console.log(res)
					reject(res);
				}
			},
			fail: function(err) {
				// console.log('uniPost超时', err)
				uni.showToast({
					title: '当前您的网络不稳定，请稍后再试~',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	});
} //并发请求


function postRequest(url, data = {}, method = "POST") {
	return new Promise(function(resolve, reject) {
		var userInfo = uni.getStorageSync("userInfo");
		if (userInfo) {
			Authorization = JSON.parse(userInfo).attrs.token;
			mmobile = JSON.parse(userInfo).mobile;
		} else {
			Authorization = ""
			mmobile = ''
		}
		// console.log(Authorization, 'token社区')
		var commonHtmlTitle = '';
		var obj = data;
		if(data.commonHtmlTitle){
			commonHtmlTitle = data.commonHtmlTitle?data.commonHtmlTitle:'';
		}
		var pages = getCurrentPages();  
		var prevPage = pages && pages.length ? pages[pages.length - 1] : {};
		// console.log('route信息===================>', pages.length);
		var myRoute = prevPage.route ? prevPage.route : 'pages/index/srevice/srevice';
		var buriedPoint = {
			commonFrontLabel: 'driver',
			commonPhoneModel: getApp().globalData.commonPhoneModel,
			commonFrontType: 'mobile',
			commonApplication: 'app',
			commonUserName: userInfo?JSON.parse(userInfo).userName:'',
			commonUserId: userInfo?JSON.parse(userInfo).userId:'',
			commonHtmlTitle: commonHtmlTitle,
			commonFunctionName: url,
			commonNowVersion: getApp().globalData.appVersion,
			commonSystemVersion: getApp().globalData.commonSystemVersion,
			commonFrontPath: myRoute
		}
		// console.log('埋点===================>', buriedPoint);
		var newData = Object.assign(data, buriedPoint);
		// console.log(newData, 'aaaaaa参数')
		if(obj.commonHtmlTitle){
			delete obj.commonHtmlTitle;
		}
		newData.commonRequestParams = JSON.stringify(obj);
		// console.log(ApiRootUrl + url, '请求参数', obj)
		// console.log(newData, '请求参数', obj, ApiRootUrl + url )
		uni.request({
			url: ApiRootUrl + url,
			data: newData,
			method: method,
			header: {
				'Content-Type': 'application/json',
				'Authorization': Authorization,
				'mmobile': mmobile
			},
			timeout: 30000,
			success: function(res) {
				console.log('21111', newData, url);
				if (res.statusCode == 200) {
					if (res.data.retCode == '401') {
						uni.showToast({
							title: '登录信息已失效，请重新登录',
							icon: 'none',
						})
						uni.removeStorageSync('userInfo');
						loginSelf();
						reject('未登录')
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
				console.log(ApiRootUrl + url, '请求参数', obj)
				uni.showToast({
					title: '当前您的网络不稳定，请稍后再试~',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	});
} //并发请求
var mmobile = "";
function postRequestJY(url, data = {}, method) {
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
		data.currentUserCode = JSON.parse(userInfo).attrs.userCode
		
		var buriedPoint = {};
		buriedPoint = {
			commonFrontLabel: getApp().globalData.commonObj.commonFrontLabel,
			commonPhoneModel: getApp().globalData.commonObj.commonPhoneModel,
			commonFrontType: 'mobile',
			commonApplication: 'app',
			commonUserName: getApp().globalData.commonObj.commonUserName,
			commonUserId: getApp().globalData.commonObj.commonUserId,
			commonFunctionName: url,
			commonNowVersion: getApp().globalData.appVersion,
			commonSystemVersion: getApp().globalData.commonObj.commonSystemVersion,
			commonRequestParams: JSON.stringify(data),
		}
		var newData = {};
		newData = Object.assign({}, data, buriedPoint);
		// console.log('token交易', Authorization);
		uni.request({
			url: ApiRootUrlJY + url,
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

//文件上传
function upLoadFile(url, filePath, params) {
	console.log('接口', url)
	console.log('图片', filePath)
	console.log('字段', params)
	var userInfo = uni.getStorageSync('userInfo');
	var data = new Object();
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
	console.log(userInfo, data)
	if (!userInfo) {
		return
	}
	console.log(userInfo, data)
	return new Promise(function(resolve, reject) {
		console.log(ApiRootUrl + url, '路径', data)
		uni.uploadFile({
			url: ApiRootUrl + url,
			method: 'POST',
			header: {
				'Authorization': JSON.parse(userInfo).attrs.token
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
				console.log(err, 'asd')
				reject(err);
			}
		});
	});
}
function toRadians(degree) {
  return degree * Math.PI / 180;
}

function getDistance(lat1, long1, lat2, long2) {
  //计算坐标点之间的距离
  // 地球的半径（单位：公里）
  var R = 6371; //角度转换为弧度
  var deltaLat = toRadians(lat2 - lat1);
  var deltaLong = toRadians(long2 - long1);
  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2); //计算过程

  var h = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2); //求距离

  var d = 2 * R * Math.asin(Math.sqrt(h));
  return d;
}

function newGetDistance(lat1, long1) {
	let lat2 = getApp().globalData.latitude;
	let long2 = getApp().globalData.longitude;
  //计算坐标点之间的距离
  // 地球的半径（单位：公里）
  var R = 6371; //角度转换为弧度
  var deltaLat = toRadians(lat2 - lat1);
  var deltaLong = toRadians(long2 - long1);
  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2); //计算过程

  var h = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2); //求距离

  var d = 2 * R * Math.asin(Math.sqrt(h));
  return d;
}
//登录失败一键登录
var jumpLoginFlag = false;
var isLoginIng = false;
function loginSelf(switchTabUrl) {
	
		// uni.navigateTo({
		// 	url: '/pages/login/login/login?userRole=' + 1
		// })
		// return;
		if (isLoginIng) {
			true
		}
		isLoginIng = true
		if(supportTime){
			clearTimeout(supportTime);
		} 
		// supportTime = setTimeout(() => {
		// 	isLoginIng = false
		// 	uni.closeAuthView();
		// 	uni.showToast({
		// 		title: '暂不支持一键登录，请使用其他登录方式',
		// 		icon: 'none'
		// 	})
			
		// 	uni.navigateTo({
		// 		// url: '/pages/login/loginSelect/loginSelect',
		// 		url: '/pages/login/login/login',
		// 	});
				
			
		// }, 6000)
		uni.setStorageSync('aKey', 0);
		// console.log(uni.getStorageSync('aKey'))
		uni.preLogin({
			provider: 'univerify',
			success: function(res) {
				console.log(res, '预登录返回')
				supportTime && clearTimeout(supportTime);
				isLoginIng = false
				uni.login({
					provider: 'univerify',
					univerifyStyle: {
					   "fullScreen": true,
					   "backgroundImage": "https://hyzg-app.oss-cn-beijing.aliyuncs.com/cargoChina-appTest/loginBackground.png",
					   // "privacyTerms": {
						  //   "url": "https://", // 点击跳转的协议详情页面  
						  //   "title": "用户服务协议" // 协议名称  
					   // }
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
								   "url": "https://www.hyzgapp.com/akpdownload/privacyPolicy.html", // 点击跳转的协议详情页面  
								   "title": "隐私政策" // 协议名称  
							   }  
						   ]  
					   }
					},
					success: function(res) {
						console.log(res, '返回接口')
						var params = {
							userRole: 1,
							loginType: 70,
							userType: 7,
							businessType: 10,
							appAccessToken: res.authResult.access_token,
							appOpenId: res.authResult.openid,
							commonHtmlTitle: '一键登录',
							consentProtocol: 1
						}
						console.log(params, '一键登录的参数')
						loginRequest("/au/login", params).then(response => {
							uni.hideLoading();
							console.log(response, 'adsa');
							console.log(response.retCode, '登录结果');
							umengEvent();
							if (response.retCode == "0000000") {
								console.log('登录成功');
								var rspBody = response.rspBody;
								if (response.retCode == "0000000") {
									 
									var data = rspBody;
									data.attrs.avatar = data.attrs.avatar ? data.attrs.avatar : '';
									data = JSON.stringify(data);
									uni.setStorageSync("userInfo", data);
									uni.closeAuthView();
									uni.showToast({
										title: '登录成功',
										icon: 'success'
									})
									uni.setStorageSync('userRole', 1);
									uni.$emit("refreshData_source");
									uni.$emit("refreshData_index");
									uni.$emit("changeUserRefresh");
									uni.$emit("refreshData_fleet");
									uni.$emit("goEasyChangeUser");
									//判断是否首次登录
									if (response.rspBody.remindStatus == 0) {
										uni.setStorageSync("remindStatus", 0)
										uni.reLaunch({
											url: '/pages/my/myHobby/myHobby_driver'
										})
									} else {
										uni.switchTab({
											url: '/pages/ship/index/index_car_source'
										})
									}
									
									//登录后注册推送信息
									// var cid = plus.push.getClientInfo().clientid;
									
									// '注册推送信息'
									// postRequest("/xxq/device/reg", {cid: cid});
									//  console.log(cid, '设计推送');
								} else {
									console.log(response.retDesc);
									supportTime && clearTimeout(supportTime);
									uni.hideLoading();
									uni.closeAuthView()
									uni.showToast({
										title: response.retDesc,
										icon: 'none',
										duration: 4000
									})
									loginSelf();
									// uni.getSystemInfo({
									// 	success: (res) => {
									// 		if (res.platform == 'ios') {
									// 			uni.closeAuthView();
									// 			uni.showToast({
									// 				title: rspBody.thirdTokenUser.retDesc,
									// 				icon: 'none',
									// 				duration: 4000
									// 			})
									// 		}else {
									// 			uni.showToast({
									// 				title: rspBody.thirdTokenUser.retDesc,
									// 				icon: 'none',
									// 				duration: 3000
									// 			})
									// 			setTimeout(()=>{
									// 				uni.closeAuthView();
									// 			}, 3000)
									// 		}
									// 	},
									// 	fail: (err) => {
									// 		uni.showToast({
									// 			title: rspBody.thirdTokenUser.retDesc,
									// 			icon: 'none',
									// 			duration: 3000
									// 		})
									// 		setTimeout(()=>{
									// 			uni.closeAuthView();
									// 		}, 3000)
									// 	}
									// })
								}
								
								
								// var pages = getCurrentPages();
								
								// var Page = pages[pages.length - 1];
								
								// if (Page.onLoad) {Page.onLoad();}
							}else {
								console.log(response.retDesc);
								supportTime && clearTimeout(supportTime);
								uni.hideLoading();
								uni.closeAuthView();
								uni.showToast({
									title: response.retDesc,
									icon: 'none',
									duration: 4000
								})
								setTimeout(() => {
									loginSelf();
								}, 3000)
							}
							
						}).catch(err => {
							console.log(err)
						})
					},
					fail: function(err) {
						isLoginIng = false
						console.log(err, '返回错误');
						uni.setStorageSync('aKey', 1);
						supportTime && clearTimeout(supportTime);
						uni.closeAuthView();
						// if (err.code == "30002") {
						// 	//表示点击了其他登录操作
						// 	console.log('qwqwq')
						uni.navigateTo({
							url: '/pages/login/login/login?userRole=1'
						})
						// }
						// '/pages/index/srevice/srevice'
						// let jumpUrl = switchTabUrl ? switchTabUrl : '/pages/index/srevice/srevice';
						// if(err.errCode == 30003) {
						// 	uni.switchTab({
						// 		url: jumpUrl
						// 	})
						// }else {
						// 	uni.navigateTo({
						// 		url: '/pages/login/login/login'
						// 	})
						// }
					},
					complete: function(data){
						console.log('data')
					}
				})
			},
			fail: function(err) {
				isLoginIng = false
				//不支持一键登录则手动登录
				// console.log('一键登录' ,err);
				console.log('社区js', jumpLoginFlag);
				if(!jumpLoginFlag) {
					jumpLoginFlag = true;
					supportTime && clearTimeout(supportTime);
					uni.showToast({
						title: '一键登录失效，系统将转为验证码方式登录',
						icon: 'none',
						duration: 4000
					})
					setTimeout(()=>{
						uni.navigateTo({
							url: '/pages/login/login/login?userRole=' + 1
						})
						jumpLoginFlag = false;
					}, 2500)
				}
			}
		})
	}

function umengEvent(){
	// var platform = uni.getSystemInfoSync().platform;
	// if(platform == "android"){
	// 	console.log('xiaoxiaoxiao')
	// 	UmengModule.init({appkey: "607da1965844f15425ddf306"}, res => {
			
	// 	})
	// } else{
	// 	UmengModule.init({appkey: "6098dca153b6726499f59e4a"}, res => {
			
	// 	})
	// }
	// setTimeout(()=>{
	// 	console.log('llllllllllll')
	// 	UmengModule.setPageCollectionMode({modeType: 'auto'}, res => {
	// 		//设置采集模式
	// 	})
	// }, 2000)
}

function postOnesRequest(url, data = {}, method = "POST") {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: url,
			data: data,
			method: method,
			header: {
				'Content-Type': 'application/json',
				"Ones-User-ID": 'WSrPAG9o',
				"Ones-Auth-Token": 'yovanuZOVNb7cYyeXLXHE03i5zoNcljRk5pY4F3BPx4XbH84pwwyAlgOGvltQ9Qk'
			},
			timeout: 30000,
			success: function(res) {
				// console.log('21111', res);
				resolve(res);
			},
			fail: function(err) {
				// console.log('uniPost超时', err)
				uni.showToast({
					title: '当前您的网络不稳定，请稍后再试~',
					icon: 'none',
					duration: 3000,
				})
				reject(err);
			}
		});
	});
} //并发请求

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



module.exports = {
	checkLocation,
	postRequest,
	loginRequest,
	upLoadFile,
	ApiRootUrl,
	getDistance,
	newGetDistance,
	tentCentMapKey,
	loginSelf,
	webUrl,
	fleetUrl,
	helpUrl,
	umengEvent,
	postJymRequest,
	postOnesRequest,
	postRequestJY,
	btnRepeat
};
