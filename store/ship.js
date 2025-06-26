let sysinfo = uni.getSystemInfoSync();
import * as ship from "@/utils/ship";

//司机的信息
const ShipInfo = {
	state: {
		vehicleArr: [],
		routerArr: [],
		locationAddr: null,
	},
	mutations:{
		getVehicleInfo(state, vehicleArr) {
			state.vehicleArr = vehicleArr;
		},
		getRouterInfo(state, routerArr) {
			state.routerArr = routerArr;
		},
		getLocationAddr(state, locationAddr) {
			state.locationAddr = locationAddr;
		}
	},
	actions: {
		//更新车辆配置
		async getVehicleSettingsInfo({ commit, state }) {
			try{
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var res = await ship.postRequest("/yh/upd/tags/find",{
					userId: JSON.parse(userInfo).userId,
					typeCodeList: ['MY_VEHICLE'],
					status: 1
				});
				
				if (res.retCode == "0000000") {
					var rspBody = res.rspBody.items;
					rspBody.forEach(item => {
						var tagNameArr = item.tagName.split("米");
						item.carLength = tagNameArr[0];
						item.carModel = tagNameArr[1];
					})
					var vehicleSid = uni.getStorageSync("car-source-vehicle-sid");
					if (vehicleSid) {
						var findIndex = rspBody.findIndex(item => {
							return item.sid == vehicleSid
						})
						if (findIndex > -1) {
							var select = rspBody.splice(findIndex, 1);
							
							var arr = select.concat(rspBody);
							commit("getVehicleInfo", arr)
						} else {
							uni.removeStorageSync("car-source-vehicle-sid");
							commit("getVehicleInfo", rspBody)
						}
					} else {
						commit("getVehicleInfo", rspBody)
					}	
				}
				
			}catch(e){
				//TODO handle the exception
			}
			
		},
		async getRouterSettingsInfo({ commit, state }) {
			try{
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var rsp = await ship.postRequest("/yh/upd/tags/find", {
					userId: JSON.parse(userInfo).userId,
					typeCodeList: ["MY_CIRCUIT"],
					status: 1
				})
				
				if (rsp.retCode == "0000000") {
					var rspResult = rsp.rspBody.items;
					rspResult.forEach(item => {
						var tagName = item.tagName.split('-');
						var senderAddr = tagName[0];
						var receiverAddr = tagName[1];
						item.senderCode = item.ext1;
						item.receiverCode = item.ext2;
						item.subSenderAddr = senderAddr.replace(/省|市/, "");
						item.subReceiverAddr = receiverAddr.replace(/省|市/, "");
					})
					commit("getRouterInfo", rspResult)
				}
				
			}catch(e){
				//TODO handle the exception
			}
		},
		async getSettingsInfo({ commit, state }) {
			try{
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var res = await ship.postRequest("/yh/upd/tags/find",{
					userId: JSON.parse(userInfo).userId,
					typeCodeList: ["MY_VEHICLE", "MY_CIRCUIT"],
					status: 1
				});
				let carItems = [];
				let lineItems = [];
				if (res.retCode == "0000000") {
					var itemAry = res.rspBody.items;
					for(let i in itemAry) {
					    if(itemAry[i].tagTypeCode == 'MY_VEHICLE') {
							var tagNameArr = itemAry[i].tagName.split("米");
							itemAry[i].carLength = tagNameArr[0];
							itemAry[i].carModel = tagNameArr[1];
							
					        carItems.push(itemAry[i]);
					    }
					    if(itemAry[i].tagTypeCode == 'MY_CIRCUIT') {
					        let addressAry = itemAry[i].tagName.split('-');
							var senderAddr = addressAry[0];
							var receiverAddr = addressAry[1];
							itemAry[i].senderAddr = addressAry[0];
							itemAry[i].receiverAddr = addressAry[1];
							itemAry[i].senderCode = itemAry[i].ext1;
							itemAry[i].receiverCode = itemAry[i].ext2;
							itemAry[i].subSenderAddr = senderAddr.replace(/省|市/, "");
							itemAry[i].subReceiverAddr = receiverAddr.replace(/省|市/, "");
					        lineItems.push(itemAry[i]);
						}
					}

					var vehicleSid = uni.getStorageSync("car-source-vehicle-sid");
					if (vehicleSid) {
						var findIndex = carItems.findIndex(item => {
							return item.sid == vehicleSid
						})
						if (findIndex > -1) {
							var select = carItems.splice(findIndex, 1);
							
							var arr = select.concat(carItems);
							commit("getVehicleInfo", arr)
						} else {
							uni.removeStorageSync("car-source-vehicle-sid");
							commit("getVehicleInfo", carItems)
						}
					} else {
						commit("getVehicleInfo", carItems)
					}
				}
				
				var routerSid = uni.getStorageSync("car-source-router-sid");
				console.log("路线111111111111111",routerSid);
				if (routerSid) {
					var findIndex1 = lineItems.findIndex(item => {
						return item.sid == routerSid
					})
					console.log(findIndex1, 'findIndex11111', lineItems);
					if (findIndex1 > -1) {
						var select1 = lineItems.splice(findIndex1, 1);
						
						var arr1 = select1.concat(lineItems);
						console.log(arr1, 'aaaaaaa11111111')
						commit("getRouterInfo", arr1)
					} else {
						uni.removeStorageSync("car-source-router-sid");
						commit("getRouterInfo", lineItems)
					}
					
				} else {
					console.log("lineItems1111111", lineItems);
					commit("getRouterInfo", lineItems)
				}
					
				
				
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
			
		},
		
		getCenterLocationInfo({ commit, state }) {
			var provinceLocal = uni.getStorageSync("provinceLocal");
			if (!provinceLocal) {
				var setInerval = setInterval(() => {
					provinceLocal = uni.getStorageSync("provinceLocal");
					if (provinceLocal) {
						clearInterval(setInerval);
						uni.getLocation({
							type: 'gcj02',
							geocode:true,
							success: function(res) {
								console.log(res, '定12312123123123123123111位新消息')
								if (res.address) {
									
									var city = res.address.city;
									
									var provinceLocalArr = JSON.parse(provinceLocal);
									provinceLocalArr.forEach(item => {
										var cities = item.cities;
										var findIndex = cities.findIndex(atem => {
											return atem.name == city
										})
										if (findIndex > -1) {
											var subName = city.replace(/省|市/, "");
											var obj = {
												name: city,
												code: cities[findIndex].code,
												subName: subName,
											};
											commit("getLocationAddr", obj);
										}
									})
								}
							}
						})
					}
				}, 500)
			} else {
				uni.getLocation({
					type: 'gcj02',
					geocode:true,
					success: function(res) {
						console.log(res, '定12312123123123123123111位新消息')
						if (res.address) {
							var city = res.address.city;
							var provinceLocalArr = JSON.parse(provinceLocal);
							// console.log(provinceLocalArr, 'aaa');
							provinceLocalArr.forEach(item => {
								var cities = item.cities;
								
								if (item.name == "上海市" || item.name == "重庆市" || item.name == "天津市" || item.name == "北京市") {
									if (city == item.name) {
										var subName = city.replace(/省|市/, "");
										var obj = {
											name: city,
											code: item.code,
											subName: subName,
										};
										commit("getLocationAddr", obj);
									}
								} else {
									var findIndex = cities.findIndex(atem => {
										return atem.name == city
									})
									if (findIndex > -1) {
										var subName = city.replace(/省|市/, "");
										var obj = {
											name: city,
											code: cities[findIndex].code,
											subName,
										};
										commit("getLocationAddr", obj);
									}
								}
								
							})
							
						}
					}
				})
			}
			
		}
	}
}

export default ShipInfo;
