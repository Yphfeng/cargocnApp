<template>
	<view class="content">
		<view class="title">附近的蓝牙设备...</view>
		<!-- <button class="btn" type="primary" :loading="isSearching" @tap="startSearch">开始搜索 </button> -->
		<!-- <button class="btn" type="warn" @tap="stopSearch">停止搜索</button>
		 -->
		<scroll-view class="scroll-box">
			<view v-for="(item) in list" :data-title="item.deviceId" :data-name="item.name" :data-advertisData="item.advertisServiceUUIDs"
			 :key="item.deviceId" @tap="bindViewTap">
				<view class="item">
					<view class="name">{{item.name}}</view>
					<view class="btn" :class="{active: item.isSupport > -1}">{{item.isSupport > -1 ? '支持' : '暂不支持'}}</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="tips">
			<view class="tips-title">温馨提示:</view>
			<view class="tipsItem">1、您需要连接货运中国汉印A300通用版，蓝牙打印机; </view>
			<view class="tipsItem">2、打开手机蓝牙开关，将蓝牙热敏打印机插上电源，打开电源开关; </view>
			<view class="tipsItem">3、打开手机蓝牙设置，部分安卓手机需要打开手机“定位”设置 ;</view>
			<view class="tipsItem">4、首次请添加打印机设置，输入打印机品牌、打印机编号、打印机密码，点击“去添加”;</view>
			<view class="tipsItem">5、添加完毕后，软件将自动搜索周围开启蓝牙的设备找到你的蓝牙打印机; </view>
			<view class="tipsItem">6、如果操作都已尝试，还是无法找到打印机，请重启打印机再次搜索</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				isSearching: false, //是否正在搜索中
				list: [],
				services: [],
				serviceId: 0,
				writeCharacter: false,
				readCharacter: false,
				notifyCharacter: false
			};
		},
		computed: mapState(['sysinfo', 'Bluetooth']),
		onLoad() {
			// console.log(this.Bluetooth)
			this.startSearch();
		},
		onUnload() {
			//停止搜索蓝牙设备
			if (this.isSearching) {
				uni.stopBluetoothDevicesDiscovery();
			}
		},
		methods: {
			//错误码提示
			errorCodeTip(code) {
				if (code == 0) {
					//正常
				} else if (code == 10000) {
					uni.showToast({
						title: '未初始化蓝牙适配器',
						icon: 'none'
					})
				} else if (code == 10001) {
					uni.showToast({
						title: '当前蓝牙适配器不可用',
						icon: 'none'
					})
				} else if (code == 10002) {
					uni.showToast({
						title: '没有找到指定设备',
						icon: 'none'
					})
				} else if (code == 10003) {
					uni.showToast({
						title: '连接失败',
						icon: 'none'
					})
				} else if (code == 10004) {
					uni.showToast({
						title: '没有找到指定服务',
						icon: 'none'
					})
				} else if (code == 10005) {
					uni.showToast({
						title: '没有找到指定特征值',
						icon: 'none'
					})
				} else if (code == 10006) {
					uni.showToast({
						title: '当前连接已断开',
						icon: 'none'
					})
				} else if (code == 10007) {
					uni.showToast({
						title: '当前特征值不支持此操作',
						icon: 'none'
					})
				} else if (code == 10008) {
					uni.showToast({
						title: '其余所有系统上报的异常',
						icon: 'none'
					})
				} else if (code == 10009) {
					uni.showToast({
						title: 'Android 系统特有，系统版本低于 4.3 不支持 BLE',
						icon: 'none'
					})
				}
			},
			//开始搜索蓝牙
			startSearch() {
				let that = this
				uni.openBluetoothAdapter({
					success(res) {
						uni.getBluetoothAdapterState({
							success(res2) {
								console.log('getBluetoothAdapterState:', res2)
								if (res2.available) {
									that.isSearching = true;
									if (res2.discovering) {
										uni.showToast({
											title: '正在搜索附近打印机设备',
											icon: "none"
										})
										return;
									}
			
									//获取蓝牙设备信息
									that.getBluetoothDevices()
			
									// that.checkPemission()
								} else {
									uni.showToast({
										title: '本机蓝牙不可用',
										icon: 'none'
									})
								}
							}
						});
					},
					fail() {
						uni.showToast({
							title: '蓝牙初始化失败，请打开蓝牙',
							icon: 'none'
						})
					}
				})
			},
			stopSearch() {
				uni.stopBluetoothDevicesDiscovery({
					success: (res) => {
						this.isSearching = false;
						console.log('stop:', res)
					},
					fail: (e) => {
						console.log('stop:', e)
						this.errorCodeTip(e.errCode);
					}
				})
			},
			//校验权限
			checkPemission() {
				let that = this
				let {
					BLEInformation
				} = that.Bluetooth;
				let platform = BLEInformation.platform;
				that.getBluetoothDevices();
			},
			//获取蓝牙设备信息
			getBluetoothDevices() {
				let that = this
				that.list = [];
				uni.startBluetoothDevicesDiscovery({
					success(res) {
						// console.log(res)
						//蓝牙设备监听 uni.onBluetoothDeviceFound
						plus.bluetooth.onBluetoothDeviceFound((result) => {
							console.log('onBluetoothDeviceFound:', result)
							let arr = that.list;
							let devices = [];
							let list = result.devices;
							for (let i = 0; i < list.length; ++i) {
								if (list[i].name && list[i].name != "未知设备" && list[i].name.indexOf("DL") > -1) {
									let arrNew = arr.filter((item) => {
										return item.deviceId == list[i].deviceId;
									});
									// console.log('arrNew:',arrNew.length)
									if (arrNew.length == 0) {
										list[i].isSupport = list[i].name.indexOf("DL");
										devices.push(list[i]);
									}
								}
							}
			
							that.list = arr.concat(devices);
						});
						that.time = setTimeout(() => {
							// uni.getBluetoothDevices
							plus.bluetooth.getBluetoothDevices({
								success(res2) {
									let devices = [];
									let list = res2.devices;
									for (let i = 0; i < list.length; ++i) {
										if (list[i].name && list[i].name != "未知设备" && list[i].name.indexOf("DL") > -1) {
											list[i].isSupport = list[i].name.indexOf("DL");
											devices.push(list[i]);
										}
									}
			
									that.list = devices;
									console.log('getBluetoothDevices:',res2);
								},
							})
			
							clearTimeout(that.time);
						}, 3000);
					}
				});
			
			},
			//绑定蓝牙
			bindViewTap(e) {
				let that = this;
				let {
					title
				} = e.currentTarget.dataset;
				let {
					BLEInformation
				} = that.Bluetooth;
				this.stopSearch();
				
				that.serviceId = 0;
				that.writeCharacter = false;
				that.readCharacter = false;
				that.notifyCharacter = false;
				uni.showLoading({
					title: '正在连接',
				})
				console.log('deviceId:', title)
				// uni.createBLEConnection
				plus.bluetooth.createBLEConnection({
					deviceId: title,
					success(res) {
						console.log('createBLEConnection success:', res)
						BLEInformation.deviceId = title;
						that.$store.commit('BLEInformationSet', BLEInformation);
						uni.hideLoading()
						that.getSeviceId()
					},
					fail(e) {
						that.errorCodeTip(e.errCode);
						uni.hideLoading()
					}
				})
			},
			//获取蓝牙设备所有服务(service)。
			getSeviceId() {
				let that = this;
				let {
					BLEInformation
				} = that.Bluetooth;
				console.log('BLEInformation.deviceId:',BLEInformation.deviceId)
				// uni.getBLEDeviceServices
				let t=setTimeout(()=>{
					plus.bluetooth.getBLEDeviceServices({
						deviceId: BLEInformation.deviceId,
						success(res) {
							console.log('getBLEDeviceServices success:',res)
							that.services = res.services;
							that.getCharacteristics()
						},
						fail: function(e) {
							that.errorCodeTip(e.code);	
							console.log('getBLEDeviceServices fail:',e)
						}
					})
					clearTimeout(t);
				},1500)
			},
			getCharacteristics() {
				var that = this
				let {
					services: list,
					serviceId: num,
					writeCharacter: write,
					readCharacter: read,
					notifyCharacter: notify
				} = that;
				let {
					BLEInformation
				} = that.Bluetooth;
				// uni.getBLEDeviceCharacteristics
				plus.bluetooth.getBLEDeviceCharacteristics({
					deviceId: BLEInformation.deviceId,
					serviceId: list[num].uuid,
					success(res) {
						// console.log(res)
						for (var i = 0; i < res.characteristics.length; ++i) {
							var properties = res.characteristics[i].properties
							var item = res.characteristics[i].uuid
							if (!notify) {
								if (properties.notify) {
									BLEInformation.notifyCharaterId = item;
									BLEInformation.notifyServiceId = list[num].uuid;
									that.$store.commit('BLEInformationSet', BLEInformation);
									notify = true
								}
							}
							if (!write) {
								if (properties.write) {
									BLEInformation.writeCharaterId = item;
									BLEInformation.writeServiceId = list[num].uuid;
									that.$store.commit('BLEInformationSet', BLEInformation);
									write = true
								}
							}
							if (!read) {
								if (properties.read) {
									BLEInformation.readCharaterId = item;
									BLEInformation.readServiceId = list[num].uuid;
									that.$store.commit('BLEInformationSet', BLEInformation);
									read = true
								}
							}
						}
						if (!write || !notify || !read) {
							num++
							that.writeCharacter = write;
							that.readCharacter = read;
							that.notifyCharacter = notify;
							that.serviceId = num;
							if (num == list.length) {
								uni.showModal({
									title: '提示',
									content: '找不到该读写的特征值',
								})
							} else {
								that.getCharacteristics()
							}
						} else {
							that.openControl()
						}
					},
					fail: function(e) {
						console.log("getBLEDeviceCharacteristics fail：",e);
						that.errorCodeTip(e.errCode);	
					}
				})
			},
			openControl: function() {
				//连接成功后跳转首页
				uni.showToast({
					title: '连接成功',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 1000)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		width: 100vw;
		background-color: #F1F4F9;
		.title {
			font-size: 28rpx;
			color: #333333;
			padding: 28rpx 56rpx;
		}
		.scroll-box {
			height: 30vh;
			overflow-y: scroll;
			width: calc(100vw - 72rpx);
			background-color: #FFFFFF;
			border-radius: 24rpx;
			margin-left: 36rpx;
		}
		.tips {
			color: #999999;
			font-size: 24rpx;
			padding: 20rpx 40rpx;
			.tipsItem {
				line-height: 45rpx;
			}
		}
	}
	.btn {
		background-color: #CACACA;
		height: 48rpx;
		width: 142rpx;
		color: #FFFFFF;
		font-weight: 500;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 44rpx;
		&.active {
			background-color: #5CD360;
			box-shadow: 0px 0px 16px 2px rgba(105, 240, 167, 0.65);
		}
	}
	.name {
		color: #333333;
	}

	.item {
		border-bottom: 1px solid #EFEFEF;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 32rpx;
		height: 102rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		&:last-child {
			border: none;
		}
	}
</style>
