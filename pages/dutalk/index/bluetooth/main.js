import errors from './error.js';
let app = null;
export default class blueth {
	bluethState = 0;//蓝牙程序状态 0断开 1打开适配器
	adapterState = {
		discovering:false,//是否正在搜索设备
		available:false // 蓝牙适配器是否可用
	}//适配器状态
	writeBuffArr = []
	constructor(arg) {
	    app = arg;
		console.log(arg);
		this.sysinfo = uni.getSystemInfoSync();
		this.sysinfo.andr = (this.sysinfo.system.indexOf('Android')!=-1);
		this.sysinfo.ios = (this.sysinfo.system.indexOf('ios')!=-1);
	}
	init(){
		const self = this;
		return new Promise((reslove)=>{
			uni.openBluetoothAdapter({
				success(res) {
					let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
					if(msg!==true){
						uni.showModal({
							title:'提示',
							content:msg,
							showCancel:!1
						});
						uni.hideLoading();
						return
					}
					self.bluethState = 1;
					reslove();
				},
				fail(err) {
					let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
					if(msg!==true){
						uni.showModal({
							title:'提示',
							content:msg,
							showCancel:!1
						});
						uni.hideLoading();
						return
					}
				}
			})
		})
	}
	closeBlueth(){
		const self = this;
		return new Promise((reslove)=>{
			uni.closeBluetoothAdapter({
				success(res) {
					let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
					if(msg!==true){
						uni.showModal({
							title:'提示',
							content:msg,
							showCancel:!1
						});
						uni.hideLoading();
						return
					}
					self.bluethState = 0;
					reslove();
				},
				fail(err) {
					let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
					if(msg!==true){
						uni.showModal({
							title:'提示',
							content:msg,
							showCancel:!1
						});
						uni.hideLoading();
						return
					}
				}
			})
		});
	}
	getBluethSatate(){
		const self = this;
		return new Promise((reslove)=>{
			uni.getBluetoothAdapterState({
				success(res) {
					let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
					if(msg!==true){
						uni.showModal({
							title:'提示',
							content:msg,
							showCancel:!1
						});
						uni.hideLoading();
						return
					}
					self.adapterState.available = res.available;
					self.adapterState.discovering = res.discovering;
					reslove();
				},
				fail(err) {
					let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
					if(msg!==true){
						uni.showModal({
							title:'提示',
							content:msg,
							showCancel:!1
						});
						uni.hideLoading();
						return
					}
					
				}
			})
		})
	}//获取蓝牙适配器状态
	onListenhAdapterStateChange(){
		const self = this;
		return new Promise((reslove)=>{
			uni.onBluetoothAdapterStateChange((res)=>{
				console.log(res)
				let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
				if(msg!==true){
					uni.showModal({
						title:'提示',
						content:msg,
						showCancel:!1
					});
					uni.hideLoading();
					return
				}
				self.adapterState.available = res.available;
				self.adapterState.discovering = res.discovering;
				reslove();
			})
		})
	}//监听蓝牙适配器状态变化事件
	startBluethSearch(arr = []){
		return new Promise((reslove)=>{
			uni.startBluetoothDevicesDiscovery({
			  services: arr,
			  success(res) {
				  let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
				  if(msg!==true){
				  	uni.showModal({
				  		title:'提示',
				  		content:msg,
				  		showCancel:!1
				  	});
					uni.hideLoading();
				  	return
				  }
				  reslove(res);
			  },
			  fail(err) {
				let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
				if(msg!==true){
					uni.showModal({
						title:'提示',
						content:msg,
						showCancel:!1
					});
					uni.hideLoading();
					return
				}
			  }
			})
		})
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
	onSearching(callback){
		const self = this;
		uni.onBluetoothDeviceFound(function (divs) {
		  let devices = divs.devices;
		  // console.log('正在搜寻嘟嘟蓝牙设备')
		  // console.dir(devices)
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
	getDeviceState(deviceId){
		return new Promise((reslove)=>{
			uni.getConnectedBluetoothDevices({
			  success(res) {
				  let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
				  if(msg!==true){
				  	uni.showModal({
				  		title:'提示',
				  		content:msg,
				  		showCancel:!1
				  	});
					uni.hideLoading();
				  	return
				  }
				  reslove(res);
			  },
			  fail(err) {
				let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
				if(msg!==true){
					uni.showModal({
						title:'提示',
						content:msg,
						showCancel:!1
					});
					uni.hideLoading();
					return
				}
			  }
			})
		})
	}
	connectBlueth(deviceId){
		const self = this;
		return new Promise((reslove)=>{
			uni.createBLEConnection({
			  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			  deviceId,
			  success(res) {
			    let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
			    if(msg!==true){
			    	uni.showModal({
			    		title:'提示',
			    		content:msg,
			    		showCancel:!1
			    	});
					uni.hideLoading();
			    	return
			    }
				reslove(res);
			  },
			  fail(err) {
				let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
				if(msg!==true){
					uni.showModal({
						title:'提示',
						content:msg,
						showCancel:!1
					});
					uni.hideLoading();
					return
				}
			  }
			})
		}) 
	}
	dislinkBlueth(deviceId,callback){
		console.log(deviceId,'222');
		uni.closeBLEConnection({
		    deviceId,
		    success(res) {
			  let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
			  if(msg!==true){
				uni.showModal({
					title:'提示',
					content:msg,
					showCancel:!1
				});
				uni.hideLoading();
				return
			  }
			  callback();
		    },
		    fail(err) {
				let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
				if(msg!==true){
					uni.showModal({
						title:'提示',
						content:msg,
						showCancel:!1
					});
					uni.hideLoading();
					return
				}
		  }
		})
	}
	stopBluethSearch(){
		return new Promise((reslove)=>{
			uni.stopBluetoothDevicesDiscovery({
			  services: ['dudu'],
			  success(res) {
				  let msg = new errors({type:'blueth',code:res.errCode}).errmsg;
				  if(msg!==true){
				  	uni.showModal({
				  		title:'提示',
				  		content:msg,
				  		showCancel:!1
				  	});
					uni.hideLoading();
				  	return
				  }
				  reslove();
			  },
			  fail(err) {
				let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
				if(msg!==true){
					uni.showModal({
						title:'提示',
						content:msg,
						showCancel:!1
					});
					uni.hideLoading();
					return
				}
			  }
			})
		})
	}
	instruction(value){
		const self = this;
		console.log(value,'<<<<<<<<<<<<<<<<<<<<<<<<');
		switch (value) {
			case 'a5420491000301': //侧键
				app.globalData.user_action = 3;
			break;

			case 'a5420491000401': //主键
				app.globalData.user_action = 4;
			break;

			case 'a5420491000201': //上键
				app.globalData.user_action = 2;
				break;
			case 'a5420491000101': //下键
				app.globalData.user_action = 1;
			break;
			case 'a5420491000403': //长按键下
				app.globalData.user_action = 5;
			break;
			case 'a5420491000404': //长按键上
				app.globalData.user_action = 6;
			break;
			default:
				break;
		}
	}
	rewrite(callback){
		const buffer = new ArrayBuffer(1)
		const dataView = new DataView(buffer)
		const { characteristicId,
		deviceId,
		serviceId } = uni.getStorageSync('emit_character_write');
		uni.writeBLECharacteristicValue({
			characteristicId,
			deviceId,
			serviceId,
			value:buffer,
			success(res) {
				console.log('writeBLECharacteristicValue:', res)
				callback();
			},
			fail(err) {
				let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
				if(msg!==true){
					uni.showModal({
						title:'提示',
						content:msg,
						showCancel:!1
					});
					uni.hideLoading();
					return
				}
			}
		});//可以写入的特征值
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
	reread(callback){
		const { characteristicId,
		deviceId,
		serviceId } = uni.getStorageSync('emit_character_read');
		uni.readBLECharacteristicValue({
			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			deviceId,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId,
			// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
			characteristicId,
			success(res3) {
			  console.log('readBLECharacteristicValue:', res3);
			  callback();
			},
			fail(err) {
				let msg = new errors({type:'blueth',code:err.errCode}).errmsg;
				if(msg!==true){
					uni.showModal({
						title:'提示',
						content:msg,
						showCancel:!1
					});
					uni.hideLoading();
					return
				}
			}
		});//可以读的特征值
	}
	readBlueBuffer(deviceId){
		// 必须在这里的回调才能获取
		const self = this;
		console.log(deviceId,'当前设备id');
		uni.onBLECharacteristicValueChange(function (res) {
		  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
		  console.log(self.ab2hex(res.value),self.hexChangeTostr(self.ab2hex(res.value)),'<<<<<<<<	')
			self.instruction(self.ab2hex(res.value));
			let bind_blueth = uni.getStorageSync('bind_blueth');
			if((res.characteristicId == '00002A19-0000-1000-8000-00805F9B34FB')&&bind_blueth){
				let val =parseInt(self.ab2hex(res.value), 16);
				if((val>=0)&&(val<=25)){
					bind_blueth.electricity = 3;
				}else if((val>25)&&(val<=50)){
					bind_blueth.electricity = 2;
				}else if((val>50)&&(val<=75)){
					bind_blueth.electricity = 1;
				}else if((val>75)){
					bind_blueth.electricity = 0;
				}
				uni.setStorageSync('bind_blueth', bind_blueth);
			}
			if(res.characteristicId == '00002A28-0000-1000-8000-00805F9B34FB'){
				(self.hexChangeTostr(self.ab2hex(res.value)) != app.globalData.blueActionVersion)&&setTimeout(()=>{
					// setTimeout(()=>{
					// 	// self.upgrades();
					// },3000)
					app.globalData.diffVersion = true;
				},3000);
			}
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
		  res.connected&&uni.setStorageSync('blue_timeout',false);
		  console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)//蓝牙状态改变
		})
		// ArrayBuffer转16进度字符串示例
		uni.getBLEDeviceServices({
		  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
		  deviceId,
		  success(res1) {
		    console.log('device services:', res1.services)
			res1.services.map((item)=>{
				uni.getBLEDeviceCharacteristics({
				  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
				  deviceId,
				  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
				  serviceId:item.uuid,
				  success(res2) {
					const buffer = new ArrayBuffer(1)
					const dataView = new DataView(buffer)
					dataView.setUint8(0, 0);
					  res2.characteristics.map((it)=>{
						  it.properties.read&&uni.readBLECharacteristicValue({
						      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						      deviceId,
						      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
						      serviceId:item.uuid,
						      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
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
								 uni.showModal({
									title:'提示',
									content:err.errMsg,
									showCancel:!1
								 });
							  }
						  });//可以读的特征值
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
								self.writeBuffArr.push({
									deviceId,
									serviceId:item.uuid,
									characteristicId:it.uuid
								});
								uni.setStorageSync('emit_character_write', {
									deviceId,
									serviceId:item.uuid,
									characteristicId:it.uuid
								});
							  console.log('writeBLECharacteristicValue:', res3)
							},
							fail(err) {
							   uni.showModal({
								  title:'提示',
								  content:err.errMsg,
								  showCancel:!1
							   });
							}
						});//可以写入的特征值
						  (it.properties.notify || it.properties.indicate)&&(uni.notifyBLECharacteristicValueChange({
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
				 	  })//注册所有特征值
				  },
				  fail(err) {
					 uni.showModal({
						title:'提示',
						content:err.errMsg,
						showCancel:!1
					 });
				  }
				})
			});//注册所有服务
		  }
		})
	}
	getBinaryData(message) {       //将数据转为二进制数组
        let buffer = new ArrayBuffer(6);
        let dataView = new DataView(buffer);
        var numTitle = 0;
        for (var i = 0; i < message.length; i = i + 2) {
            var numStr16 = message.substr(i, 2);
            var num = parseInt(numStr16, 16);
            dataView.setUint8(numTitle, num);
            numTitle++;
        }
        return buffer;
    }
	upgrades(cb){
		let self = this;
		console.log('硬件版本不匹配 升级中...',self.writeBuffArr);
		uni.writeBLECharacteristicValue({
			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			deviceId:self.writeBuffArr[0].deviceId,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId:self.writeBuffArr[0].serviceId,
			// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
			characteristicId:self.writeBuffArr[0].characteristicId,
			value: self.getBinaryData('0102'),
			success(res) {
				console.log('写入成功',res);
				setTimeout(() => {
					uni.closeBLEConnection({
						deviceId:self.writeBuffArr[0].deviceId,
						success(){
							uni.closeBluetoothAdapter({
								success(){
									console.log( '门锁即将进入dfu模式，蓝牙会重新连接',);
									cb();
								}
							}) //关闭adapter,否则后面会在部分Android机上搜不到dfu
							// uni.showToast({
							// 	title: '连接成功，门锁即将进入dfu模式，蓝牙会重新连接',
							// 	icon: 'success',
							// });
							// uni.navigateTo({
							// 	url:'/pages/dfu/dfu'
							// })
						}
					})
					//接下来门锁进入dfu 模式,蓝牙会自动断开
					//that.callbackStep(STEP.SCANDEVICE, true)
				}, 5000)
			  console.log('writeBLECharacteristicValue:', res)
			},
			fail(err) {
			   uni.showModal({
				  title:'提示',
				  content:err.errMsg,
				  showCancel:!1
			   });
			}
		});//可以写入的特征值
	}//硬件升级
}