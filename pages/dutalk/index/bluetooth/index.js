let app = null;
class blueth {
	constructor(arg) {
		this.app = arg;
		console.log(arg);
	}
	init(){
		app = getApp();
		return new Promise((reslove)=>{
			uni.openBluetoothAdapter({
			  success(res) {
			    console.log('初始化适配器' ,res);
				reslove();
			  }
			});
		})
	}
	startBluethSearch(arr = []){
		return new Promise((reslove)=>{
			uni.startBluetoothDevicesDiscovery({
			  services: arr,
			  success(res) {
				  console.log(res);
				  reslove(res);
			  },
			  fail(err) {
				  
			  }
			})
		})
	}
	onSearching(callback){
		const self = this;
		console.log(uni.onBluetoothDeviceFound,'<-----');
		uni.onBluetoothDeviceFound(function (divs) {
		  console.log(divs,'<-----');
		  let currrentPage = getCurrentPages()[getCurrentPages().length - 1].route;
		  console.log(currrentPage,'当前页面');
		  if(currrentPage != 'pages/dutalk/room/blueth'){
			  console.log('-----停止搜索------');
			  self.stopBluethSearch();
			  return;
		  }
		  let devices = divs.devices;
		  uni.getBluetoothDevices({
		    success(res) {
			  let list = [];
			  res.devices.map((item)=>{
				self.ab2hex(item.advertisData);
				((item.name.indexOf('dudu')!=-1)||(item.name.indexOf('OTA')!=-1))&&list.push(item);
			  });
			  callback(list)
		    }
		  })
		})
	}
	closeBlueth(){
		const self = this;
		return new Promise((reslove)=>{
			uni.closeBluetoothAdapter({
				success(res) {
					reslove();
				}
			})
		});
	}
	ab2hex(buffer) {
	  // ArrayBuffer转16进度字符串示例
	  const hexArr = Array.prototype.map.call(
	    new Uint8Array(buffer),
	    function (bit) {
	      return ('00' + bit.toString(16)).slice(-2)
	    }
	  )
	  return hexArr.join('')
	}
	instruction(value){
		console.log(value,'<<<<<这里');
		const self = this;
		console.log(value,app.globalData.user_action,'<<<<<<');
		switch (value.toString()) {
			case 'a5420491000301': //侧键
				console.log(app.globalData.user_action);
				app.globalData.user_action(3);
			break;
			case 'a5420491000401': //主键
				app.globalData.user_action(4);
			break;
			case 'a5420491000201': //上键
				app.globalData.user_action(2);
				break;
			case 'a5420491000101': //下键
				app.globalData.user_action(1);
			break;
			case 'a5420491000403': //长按键下
				app.globalData.user_action(5);
			break;
			case 'a5420491000404': //长按键上
				app.globalData.user_action(6);
			break;
			default:
				break;
		}
	}
	stopBluethSearch(){
		return new Promise((reslove)=>{
			uni.stopBluetoothDevicesDiscovery({
			  services: ['dudu'],
			  success(res) {
				  reslove();
			  }
			})
		})
	}
	getDeviceState(deviceId){
		return new Promise((reslove)=>{
			uni.getConnectedBluetoothDevices({
			  success(res) {
				reslove(res);
			  }
			})
		})
	}
	connectBlueth(deviceId){
		const self = this;
		console.log('------>',deviceId);
		return new Promise((reslove)=>{
			uni.createBLEConnection({
			  deviceId,
			  success(res) {
				setTimeout(()=>{
					console.log('--连接成功--');
					reslove(res);
				},2500);
			  },
			  fail(err) {
				  uni.showToast({
				  	title:err.errMsg,
					icon:'none'
				  });
				  uni.navigateBack({});
			  	console.log(err,'<------蓝牙连接错误');
			  }
			})
		}) 
	}
	dislinkBlueth(deviceId,callback){
		uni.closeBLEConnection({
		    deviceId,
		    success(res) {
			  callback();
		    }
		})
	}
	hexChangeTostr(hexCharCodeStr) {
	　　var trimedStr = hexCharCodeStr.trim();
	　　var rawStr = 
	　　trimedStr.substr(0,2).toLowerCase() === "0x"
	　　? 
	　　trimedStr.substr(2) 
	　　: 
	　　trimedStr;
	　　var len = rawStr.length;
	　　if(len % 2 !== 0) {
	　　　　alert("Illegal Format ASCII Code!");
	　　　　return "";
	　　}
	　　var curCharCode;
	　　var resultStr = [];
	　　for(var i = 0; i < len;i = i + 2) {
	　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
	　　　　resultStr.push(String.fromCharCode(curCharCode));
	　　}
	　　return resultStr.join("");
	}
	readBlueBuffer(deviceId){
		// 必须在这里的回调才能获取
		const self = this;
		console.log(deviceId,'当前设备id');
		uni.onBLECharacteristicValueChange(function (res) {
		  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`);
			self.instruction(self.ab2hex(res.value));
			// let bind_blueth = uni.getStorageSync('bind_blueth');
			// if((res.characteristicId == '00002A19-0000-1000-8000-00805F9B34FB')&&bind_blueth){
			// 	let val =parseInt(self.ab2hex(res.value), 16);
			// 	if((val>=0)&&(val<=25)){
			// 		bind_blueth.electricity = 3;
			// 	}else if((val>25)&&(val<=50)){
			// 		bind_blueth.electricity = 2;
			// 	}else if((val>50)&&(val<=75)){
			// 		bind_blueth.electricity = 1;
			// 	}else if((val>75)){
			// 		bind_blueth.electricity = 0;
			// 	}
			// 	uni.setStorageSync('bind_blueth', bind_blueth);
			// }
			// if(res.characteristicId == '00002A28-0000-1000-8000-00805F9B34FB'){
			// 	(self.hexChangeTostr(self.ab2hex(res.value)) != app.globalData.blueActionVersion)&&setTimeout(()=>{
			// 		// setTimeout(()=>{
			// 		// 	// self.upgrades();
			// 		// },3000)
			// 		app.globalData.diffVersion = true;
			// 	},3000);
			// }
		})
		uni.onBLEConnectionStateChange(function (res) {
			let bind_blueth = uni.getStorageSync('bind_blueth');
		  // 该方法回调中可以用于处理连接意外断开等异常情况
		    if(bind_blueth&&(bind_blueth.deviceId == res.deviceId)){
				bind_blueth.link_status = res.connected;
				uni.setStorageSync('bind_blueth', bind_blueth);
		    }
		    app.globalData.blue_status = res.connected;
		    res.connected&&self.stopBluethSearch();//停止查询
		    // res.connected&&uni.setStorageSync('blue_timeout',false);
		    console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)//蓝牙状态改变
		})
		// ArrayBuffer转16进度字符串示例
		setTimeout(()=>{
			uni.getBLEDeviceServices({
			  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			  deviceId,
			  success(res1) {
			    console.log('device services:', JSON.stringify(res1),'<<<<<<<', res1.services)
				for(let xx=0;xx<res1.services.length;xx++){
					let item = res1.services[xx];
					setTimeout(()=>{
						uni.getBLEDeviceCharacteristics({
						  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						  deviceId,
						  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
						  serviceId:item.uuid,
						  success(res2) {
							const buffer = new ArrayBuffer(1)
							const dataView = new DataView(buffer)
							dataView.setUint8(0, 0);
							  for(let x = 0;x<res2.characteristics.length;x++){
								  let it = res2.characteristics[x];
								  setTimeout(()=>{
										if(it.properties.read){
											console.log(it,'《《《可读取');
											uni.readBLECharacteristicValue({
											  deviceId,
											  serviceId:item.uuid,
											  characteristicId:it.uuid,
											  success(res3) {
												uni.setStorageSync('emit_character_read', {
													deviceId,
													serviceId:item.uuid,
													characteristicId:it.uuid
												});
												console.log('readBLECharacteristicValue:', res3)
											  },
											  fail(err) {
												 // uni.showModal({
													// title:'提示',
													// content:err.errMsg,
													// showCancel:!1
												 // });
												 console.log(err,'<<<<-出错');
											  }
											});//可以读的特征值
										}
									    if(it.properties.write){
										   console.log(it,'《《《可写入');
									    }
									    it.properties.write&&uni.writeBLECharacteristicValue({
									  	// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
									  	deviceId,
									  	// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
									  	serviceId:item.uuid,
									  	// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
									  	characteristicId:it.uuid,
									  	value: buffer,
									  	success(res3) {
									  		console.log(res3,'<<<<<<<写入');
									  	    console.log('writeBLECharacteristicValue:', res3)
									  	},
									  	fail(err) {
											console.log(err);
									  	   // uni.showModal({
									  		  // title:'提示',
									  		  // content:err.errMsg,
									  		  // showCancel:!1
									  	   // });
									  	},
										complete(re) {
											console.log(re,'<<<<<<');
										}
									  });//可以写入的特征值
									  (it.properties.notify || it.properties.indicate)&&it.uuid&&(uni.notifyBLECharacteristicValueChange({
										  state: true, // 启用 notify 功能
										  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
										  deviceId,
										  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
										  serviceId:item.uuid,
										  // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
										  characteristicId:it.uuid,
										  success(res) {
											console.log('notifyBLECharacteristicValueChange success', res.errMsg)
										  }
									  }));//可订阅的
								  },200)
								  
							  }
							 //  res2.characteristics.map((it)=>{
								  
								// //   it.properties.write&&uni.writeBLECharacteristicValue({
								// // 	// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
								// // 	deviceId,
								// // 	// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
								// // 	serviceId:item.uuid,
								// // 	// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
								// // 	characteristicId:it.uuid,
								// // 	value: buffer,
								// // 	success(res3) {
								// // 		console.log(res3,'<<<<<<<写入');
								// // 		self.writeBuffArr.push({
								// // 			deviceId,
								// // 			serviceId:item.uuid,
								// // 			characteristicId:it.uuid
								// // 		});
								// // 		uni.setStorageSync('emit_character_write', {
								// // 			deviceId,
								// // 			serviceId:item.uuid,
								// // 			characteristicId:it.uuid
								// // 		});
								// // 	  console.log('writeBLECharacteristicValue:', res3)
								// // 	},
								// // 	fail(err) {
								// // 	   uni.showModal({
								// // 		  title:'提示',
								// // 		  content:err.errMsg,
								// // 		  showCancel:!1
								// // 	   });
								// // 	}
								// // });//可以写入的特征值
								  
						 	//   })//注册所有特征值
						  },
						  fail(err) {
							 uni.showModal({
								title:'提示',
								content:err.errMsg,
								showCancel:!1
							 });
						  }
						})
					},0);
					
				}
			  }
			})
		},0);
		
	}
	
}
export default blueth;