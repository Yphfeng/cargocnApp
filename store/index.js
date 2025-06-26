import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import * as ship from "@/utils/ship"; 


//蓝牙设置
import Bluetooth from '@/store/bluetooth.js'

//司机信息
import ShipInfo from "@/store/ship.js";//司机


const store = new Vuex.Store({
	modules: {
		Bluetooth,
		ShipInfo
	},
    state: {
		isGlobalAlert: false, //全局弹框控制
		hasNet: true,
		sysinfo: uni.getSystemInfoSync(),//系统信息
		marginPrice: 0, //保证金
		allAmountWithIn: 0, //余额
		advertiseImg: [], //我的广告图片
		mainBanner: [], //首页banner广告图片
		vehicleSourceBanner: {
			smallBannerItem: [],
			bigBannerItem: [],
		}, //车源banner广告图片
		splashBanner: [], //引导图
		isHaveSplashBanner: false,
		shipAdvertiseImg: '', //我的广告图片--货主
		fleetAdv: [],
		communityAdv: [],
		jymAdv: [],
		
		
	},
    mutations: {
		getGlobalAlertState(state, isAlert) {
			state.isGlobalAlert = isAlert;
		},
		getBalance(state, allAmountWithIn) {
			state.allAmountWithIn = allAmountWithIn;
		},
		getAdvertise(state, advertiseArr) {
			state.advertiseImg = advertiseArr;
			
		},
		getMainAdvertise(state, params) {
			//首页广告图和引导图
			console.log(params, '广告状态111')
			state.mainBanner = params.mainBanner;
			state.splashBanner = params.splashBanner;
			state.vehicleSourceBanner.smallBannerItem = params.sourceSmallItem;
			state.vehicleSourceBanner.bigBannerItem = params.sourceBigItem;
		},
		getShipAdvertise(state, params) {
			//首页广告图和引导图
			state.shipAdvertiseImg = params.shipAdvertiseImg;
		},
		getFleetAdvertise(state, params){
			state.fleetAdv = params;
		},
		getCommunityAdv(state, params){
			state.communityAdv = params;
		},
		getJymAdv(state, params){
			state.jymAdv = params;
		},
		setSplashBannerStatus(state, status) {
			state.isHaveSplashBanner = status;
		},
		changeNetStatus(state, status) {
			state.hasNet = status
		}
	},
    actions: {
		//获取余额
		async getBalance({ commit, state }) {
			try{
				var res = await  ship.postRequest("/dw/wallet/getAmount")
				console.log(res, '钱包余额数据11')
				if (res.retCode == "0000000") {
					var allAmountWithIn = ((res.rspBody.amount)/1000).toFixed(2);
					commit("getBalance", allAmountWithIn)
				}
			}catch(e){
				//TODO handle the exception
			}
			
		},
		//获取我的广告图片
		async getAdvertise({commit, state}) {
			try{
				var params = {
					"locationCodeS": [
						"MY_SMALL_LEFT",
						"MY_BIG_LEFT",
						"MY_SMALL_RIGHT",
						"MY_BIG_RIGHT",
						"MY_SMALL_BANNER",
						"MY_BIG_BANNER",
					]
				}
				var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				console.log(res, '广告图片')
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					var arr = [];
					rspBody.forEach(item => {
						if (item.advLocation == "MY_SMALL_LEFT") {
							arr.push(item)
						}
						if (item.advLocation == "MY_SMALL_RIGHT") {
							arr.push(item)
						}
						if (item.advLocation == "MY_SMALL_BANNER") {
							arr.push(item)
						}
					})
					commit("getAdvertise", arr)
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		//获取首页banner广告图片和引导图片
		async getMainAdvertise({commit, state}) {
			try{
				var params = {
					"locationCodeS": [
						"FIRST_SMALL_BANNER",
						"FIRST_BIG_BANNER",
						"APP_OPEN_INIT",
						"EXTENTION_MONEY_SMALL",
						"EXTENTION_MONEY_BIG",
						"RECEIVING_ORDER_SMALL",
						"RECEIVING_ORDER_BIG",
						"EXTENTION_CARD_BIG",
						"EXTENTION_CARD_SMALL"
					]
				}
				var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				console.log('首页广告图片', res)
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					var arr = [], mainArr = [], sourceSmallItem = [], sourceBigItem = [], obj = new Object();
					rspBody.forEach(item => {
						if (item.advLocation == "APP_OPEN_INIT") {
							if (item.advUrl) {
								arr.push(item)
							}
						} else if (item.advLocation == "EXTENTION_MONEY_SMALL") {
							item.sType = 1
							sourceSmallItem.push(item);
						} else if (item.advLocation == "RECEIVING_ORDER_SMALL") {
							item.sType = 2
							sourceSmallItem.push(item)
						} else if (item.advLocation == "EXTENTION_CARD_SMALL") {
							item.sType = 3
							sourceSmallItem.push(item)
						} else if (item.advLocation == "EXTENTION_MONEY_BIG") {
							item.sType = 1
							sourceBigItem.push(item);
						} else if (item.advLocation == "RECEIVING_ORDER_BIG") {
							item.sType = 2
							sourceBigItem.push(item)
						} else if (item.advLocation == "EXTENTION_CARD_BIG") {
							item.sType = 3
							sourceBigItem.push(item)
						} else {
							if (item.advUrl) {
								mainArr.push(item)
							}
						}
						
					})
					obj.splashBanner = arr;
					obj.mainBanner = mainArr;
					obj.sourceBigItem = sourceBigItem;
					obj.sourceSmallItem = sourceSmallItem;
					commit("getMainAdvertise", obj);
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		
		//获取首页banner广告图片和引导图片--货主
		async getShipAdvertise({commit, state}) {
			try{
				var params = {
					"locationCodeS": [
						"APP_OPEN_INIT"
					]
				}
				var res = await ship.postRequest("/ts/advertising/get_to_shipper", params)
				// console.log('货主首页广告图片', res)
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					var arr = [], mainArr = [], obj = new Object();
					rspBody.forEach(item => {
						if (item.advLocation == "APP_OPEN_INIT") {
							if (item.advUrl) {
								arr.push(item)
							}
						}
					})
					obj.shipAdvertiseImg = arr;
					commit("getShipAdvertise", obj);
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		//获取加油么广告
		async getJymAdv({commit, state}) {
			let userRole = uni.getStorageSync('userRole')
			try{
				var params = {
					"locationCodeS": [
						"COMMUNITY_JYM_SMALL",
						"COMMUNITY_JYM_BIG",
					]
				}
				if(userRole == 1){
					var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				}else{
					var res = await ship.postRequest("/ts/advertising/get_to_shipper", params)
				}
				console.log(res, '获取加油么广告');
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					commit("getJymAdv", rspBody);
					console.log(rspBody)
					return rspBody
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		//获取加油么订单广告
		async getJymDDAdv({commit, state}) {
			let userRole = uni.getStorageSync('userRole')
			try{
				var params = {
					"locationCodeS": [
						"COMMUNITY_JYDD_BIG",
						"COMMUNITY_JYDD_SMALL",
					]
				}
				if(userRole == 1){
					var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				}else{
					var res = await ship.postRequest("/ts/advertising/get_to_shipper", params)
				}
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					// commit("getJymAdv", rspBody);
					console.log(rspBody)
					return rspBody
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		//获取加油么领券广告
		async getJymLQAdv({commit, state}) {
			let userRole = uni.getStorageSync('userRole')
			try{
				var params = {
					"locationCodeS": [
						"COMMUNITY_JYLQ_BIG",
						"COMMUNITY_JYLQ_SMALL",
					]
				}
				if(userRole == 1){
					var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				}else{
					var res = await ship.postRequest("/ts/advertising/get_to_shipper", params)
				}
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					// commit("getJymAdv", rspBody);
					console.log(rspBody)
					return rspBody
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		//获取加油么油卡广告
		async getJymYKAdv({commit, state}) {
			let userRole = uni.getStorageSync('userRole')
			try{
				var params = {
					"locationCodeS": [
						"COMMUNITY_JYYK_BIG",
						"COMMUNITY_JYYK_SMALL",
					]
				}
				if(userRole == 1){
					var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				}else{
					var res = await ship.postRequest("/ts/advertising/get_to_shipper", params)
				}
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					// commit("getJymAdv", rspBody);
					console.log(rspBody)
					return rspBody
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		//获取加油么优惠券广告
		async getJymYHQAdv({commit, state}) {
			let userRole = uni.getStorageSync('userRole')
			try{
				var params = {
					"locationCodeS": [
						"COMMUNITY_JYYHQ_BIG",
						"COMMUNITY_JYYHQ_SMALL",
					]
				}
				if(userRole == 1){
					var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				}else{
					var res = await ship.postRequest("/ts/advertising/get_to_shipper", params)
				}
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					// commit("getJymAdv", rspBody);
					console.log(rspBody)
					return rspBody
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		//获取社区服务站
		async getCommunityAdv({commit, state}) {
			let userRole = uni.getStorageSync('userRole')
			try{
				var params = {
					"locationCodeS": [
						"COMMUNITY_FWZ_BIG",
						"COMMUNITY_FWZ_SMALL",
						"COMMUNITY_LK_BIG",
						"COMMUNITY_LK_SMALL",
						"COMMUNITY_HZ_BIG",
						"COMMUNITY_HZ_SMALL"
					]
				}
				if(userRole == 1){
					var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				}else{
					var res = await ship.postRequest("/ts/advertising/get_to_shipper", params)
				}
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					commit("getCommunityAdv", rspBody);
					console.log(rspBody)
					return rspBody
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		//获取车队广告页面
		async getFleetAdvertise({commit, state}) {
			let userRole = uni.getStorageSync('userRole')
			try{
				var params = {
					"locationCodeS": [
						"FLEET_PLATFORM_SMALL",
						"FLEET_PLATFORM_BIG",
						"FLEET_CARGO_SMALL",
						"FLEET_CARGO_BIG",
						"FLEET_TRIPARTITE_SMALL",
						"FLEET_TRIPARTITE_BIG",
						"FLEET_LINE_SMALL",
						"FLEET_LINE_BIG",
						"FLEET_DRIVER_SMALL",
						"FLEET_DRIVER_BIG",
						"FLEET_MY_SMALL",
						"FLEET_MY_BIG"
					]
				}
				if(userRole == 1){
					var res = await ship.postRequest("/ts/advertising/get_to_driver", params)
				}else{
					var res = await ship.postRequest("/ts/advertising/get_to_shipper", params)
				}
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody;
					commit("getFleetAdvertise", rspBody);
					console.log(rspBody)
					return rspBody
				}
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
	}
})
export default store