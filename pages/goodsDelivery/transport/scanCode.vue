<template>
	<view class="app-scan-container">
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				value: '',
				timer: null,
				barcode: null,
				scanGoods: [],
				viewContent: null,
				viewContent2: null,
				viewContent3: null,
				viewContent4: null,
				codeType: [
					plus.barcode.CODE128,
					// plus.barcode.QR,
					plus.barcode.EAN13,
					plus.barcode.EAN8,
					plus.barcode.UPCA,
					plus.barcode.UPCE,
					plus.barcode.CODABAR,
					plus.barcode.CODE39,
					plus.barcode.CODE93,
					plus.barcode.ITF,
				],
				codeArr: [],
				userInfo: {},
				userRole: 0,
				transportIdArr: [],
				allArr: [],
				surfaceNumberArr: [],
				ldeId: '',
				Audio: null,
				currentWebview: null,
			}
		},
		mounted() {
			this.Audio = uni.createInnerAudioContext();
			this.Audio.autoplay = true;
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : '';
			this.userRole = uni.getStorageSync("userRole");
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			// plus.navigator.setFullscreen(true); //全屏
			this.currentWebview = page.$getAppWebview();
			this.initBarcode(this.currentWebview)
			this.createView(this.currentWebview)
			let that = this;
			uni.$on('codeRefresh', res => {
				console.log(res)
				if(!res.barCode){
					return
				}
				if (that.codeArr.indexOf(res.barCode) > -1) {
					return;
				}
				that.codeArr.push(res.barCode);
				that.ldeId = res.ldeId;
				getApp().globalData.pransportCodeArr.push(res);
				if (that.transportIdArr.indexOf(res.ldeId) == -1) {
					that.transportIdArr.push(res.ldeId);
					that.surfaceNumberArr.push(res.surfaceNumber);
				}
				that.allArr.push(res);
			})
			uni.setKeepScreenOn({
			    keepScreenOn: true
			});
		},
		onShow() {

		},
		onUnload() {
			uni.setKeepScreenOn({
			    keepScreenOn: false
			});
		},
		methods: {
			playMusic(){
				let src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/success.mp3';
				//实例化声音  
				this.Audio.src = src; //音频地址  
				this.Audio.play(); //执行播放
			},
			playFaliMusic(){
				let src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/fail.mp3';
				this.Audio.src = src; //音频地址  
				this.Audio.play(); //执行播放
			},
			playMusic(){
				let src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/success.mp3';
				//实例化声音  
				const Audio = uni.createInnerAudioContext();
				Audio.autoplay = true;
				Audio.src = src; //音频地址  
				Audio.play(); //执行播放
			},
			playFaliMusic(){
				let src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/fail.mp3';
				//实例化声音  
				const Audio = uni.createInnerAudioContext();
				Audio.autoplay = true;
				Audio.src = src; //音频地址  
				Audio.play(); //执行播放
			},
			getFindLde(){
				let that = this;
				utils.postRequest("/ld/ldeccred/findLde", {
					sid: that.ldeId
				}).then(res => {
					console.log(res)
					if(res.retCode == "0000000"){
						var goodsArr = [];
						var labelNum = 0;
						res.rspBody.items[0].cargo.map(val=>{
							var goodText = val.gdName;
							if(val.gdWeight){
								goodText = goodText + ' ' + val.gdWeight + '吨';
							}
							if(val.gdVolume){
								goodText = goodText + ' ' + val.gdVolume + '方';
							}
							if(val.gdNumber){
								goodText = goodText + ' ' + val.gdNumber + '件';
							}
							if(val.printNumber){
								goodText = goodText + ' ' + val.printNumber + '张';
							}
							goodsArr.push(goodText);
							labelNum = labelNum + val.printNumber;
						});
						var map = {
							sid: res.rspBody.items[0].sid,
							surfaceNumber: res.rspBody.items[0].surfaceNumber,
							status2Text: res.rspBody.items[0].status2Text,
							originalNumber: res.rspBody.items[0].originalNumber,
							createdDt: res.rspBody.items[0].createdDt,
							updatedDt: res.rspBody.items[0].updatedDt,
							labelNum: labelNum,
							goodsArr: goodsArr,
							ldeId: res.rspBody.items[0].sid,
							batchNumber: res.rspBody.items[0].batchNumber,
							costA: res.rspBody.items[0].costA?res.rspBody.items[0].costA:'',
							costB: res.rspBody.items[0].costB?res.rspBody.items[0].costB:'',
							costC: res.rspBody.items[0].costC?res.rspBody.items[0].costC:'',
							costList: res.rspBody.items[0].costList?res.rspBody.items[0].costList:[],
							shipmentsAddress: {
								userName: res.rspBody.items[0].shipmentsAddress.userName,
								mobile: res.rspBody.items[0].shipmentsAddress.mobile,
								city: res.rspBody.items[0].shipmentsAddress.city,
								addressText: res.rspBody.items[0].shipmentsAddress.province + '-' + res.rspBody.items[0].shipmentsAddress.city + '-' + res.rspBody.items[0].shipmentsAddress.area + ' ' + res.rspBody.items[0].shipmentsAddress.address,
							},
							arriveAddress: {
								userName: res.rspBody.items[0].arriveAddress.userName,
								mobile: res.rspBody.items[0].arriveAddress.mobile,
								city: res.rspBody.items[0].arriveAddress.city,
								addressText: res.rspBody.items[0].arriveAddress.province + '-' + res.rspBody.items[0].arriveAddress.city + '-' + res.rspBody.items[0].arriveAddress.area + ' ' + res.rspBody.items[0].arriveAddress.address,
							},
						};
						uni.navigateTo({
							url: '/pages/goodsDelivery/transport/transportMap?map=' + JSON.stringify(map)
						})
					}else{
					  
					}
				})
			},
			getCheckData(code) {
				let that = this;
				utils.postRequest('/ld/ldebarcode/verify', {
						userId: that.userInfo.userId,
						serviceType: that.userRole == 1 ? 10 : 20,
						barCode: code,
					}).then(res => {
						console.log('getCheckData', res)
						if (res.retCode == "0000000") {
							that.ldeId = res.rspBody.ldeId;
							getApp().globalData.pransportCodeArr.push(res.rspBody);
							if (that.transportIdArr.indexOf(res.rspBody.ldeId) == -1) {
								that.transportIdArr.push(res.rspBody.ldeId);
								that.surfaceNumberArr.push(res.rspBody.surfaceNumber);
							}
							that.allArr.push(res.rspBody);
							console.log(that.surfaceNumberArr);
							console.log(that.transportIdArr);
							that.viewContent4 && that.viewContent4.close()
							that.viewContent4 = null
							that.viewContent4 = new plus.nativeObj.View(
								'content2', {
									left: '0px',
									left: '0px',
									bottom: '70px',
									height: '40px',
								},
								[{
									tag: 'font',
									id: 'scanTips',
									text: '已经成功扫描' + that.allArr.length + '件',
									textStyles: {
										size: '16px',
										color: '#ffffff',
										whiteSpace: 'normal',
									},
									position: {
										left: '0px',
										right: '0px',
										width: '100%',
									}
								}]
							);
							that.currentWebview.append(that.viewContent4);
							that.playMusic();
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none',
							})
							that.playFaliMusic();
						}
					})
					.catch(err => {

					})
			},
			initBarcode() {
				this.barcode = plus.barcode.create('barcode', this.codeType, {
					top: '0px',
					left: '0px',
					right: '0px',
					bottom: '0px',
					// width: '200%',
					// height: 500, //设置扫码框的高度
					position: 'absolute',
					scanbarColor: '#28E153',
					frameColor: '#28E153'
				});
				this.barcode.onmarked = this.onmarked;
				this.currentWebview.append(this.barcode);
				const res = uni.getSystemInfoSync();
				if (res.platform == 'android') { //安卓机
					this.barcode.start();
				}
			},
			async onmarked(type, result) {
				let that = this;
				// 播放音频
				console.log('Success: type=' + type + ', result=' + result);
				if (!result) return this.barcode && this.barcode.start();
				this.timer = setTimeout(() => {
					this.barcode && this.barcode.start();
				}, 1500)
				// 通过扫码返回的结果，调用后台接口获取该规格商品信息添加到购物车
				if (result && result.length >= 18) {
					if (result.substring(0, 2) === "HY") {
						if (that.codeArr.indexOf(result) > -1) {
							uni.showToast({
								title: '重复扫描',
								icon: 'none',
							})
							return;
						}
						that.codeArr.push(result);
						that.getCheckData(result);
					}
				} else {
					uni.showToast({
						title: '请确认条形码是否正确',
						icon: 'none',
					})
					that.playFaliMusic();
				}
				// this.$emit('getGoodsInfo')
			},
			closeBarcode() {
				this.barcode && this.barcode.close();
				this.viewContent && this.viewContent.close()
				this.barcode = null
				this.viewContent = null
				this.viewContent2 && this.viewContent2.close()
				this.viewContent2 = null
				this.viewContent3 && this.viewContent3.close()
				this.viewContent3 = null
				this.viewContent4 && this.viewContent4.close()
				this.viewContent4 = null
			},
			// 创建展示类内容组件
			createView() {
				this.viewContent = new plus.nativeObj.View(
					'content', {
						left: '0px',
						bottom: '0px',
						height: '60px',
						width: '33.3%',
						backgroundColor: '#5E98CB',
					},
					[{
						tag: 'font',
						id: 'scanTips',
						text: '查单',
						textStyles: {
							size: '16px',
							color: '#ffffff',
							whiteSpace: 'normal',
						},
						position: {
							left: '0px',
							right: '0px',
							width: '100%',
						}
					}]
				);
				this.viewContent2 = new plus.nativeObj.View(
					'content2', {
						left: '33.3%',
						bottom: '0px',
						height: '60px',
						width: '33.3%',
						backgroundColor: '#0171F9',
					},
					[{
						tag: 'font',
						id: 'scanTips',
						text: '扫码装卸车',
						textStyles: {
							size: '16px',
							color: '#ffffff',
							whiteSpace: 'normal',
						},
						position: {
							left: '0px',
							right: '0px',
							width: '100%',
						}
					}]
				);
				this.viewContent3 = new plus.nativeObj.View(
					'content2', {
						left: '66.5%',
						bottom: '0px',
						height: '60px',
						width: '33.4%',
						backgroundColor: '#FF7D4A',
					},
					[{
						tag: 'font',
						id: 'scanTips',
						text: '手动输入',
						textStyles: {
							size: '16px',
							color: '#ffffff',
							whiteSpace: 'normal',
						},
						position: {
							left: '0px',
							right: '0px',
							width: '100%',
						}
					}]
				);
				
				this.currentWebview.append(this.viewContent);
				this.currentWebview.append(this.viewContent2);
				this.currentWebview.append(this.viewContent3);
				this.viewContent.addEventListener("click", e => { //返回按钮
					if(this.transportIdArr.length == 0){
						uni.showToast({
							title: '没有扫描结果，请重新扫描',
							icon: 'none'
						})
						return
					}
					this.getFindLde();
					// this.closeBarcode()
				}, false);
				this.viewContent2.addEventListener("click", e => { //返回按钮
					if(this.transportIdArr.length == 0){
						uni.showToast({
							title: '没有扫描结果，请重新扫描',
							icon: 'none'
						})
						return
					}
					var newArr = [];
					this.transportIdArr.map(val => {
						var obj = {
							ldeId: val,
						}
						var goodsArr = [];
						this.allArr.map(item => {
							if (val == item.ldeId) {
								goodsArr.push(item);
							}
						})
						obj.goodsArr = goodsArr;
						newArr.push(obj);
					})
					getApp().globalData.pransportCodeArr = newArr;
					console.log(newArr);
					uni.navigateTo({
						url: '/pages/goodsDelivery/transport/scanDetail?transportIdArr=' + JSON.stringify(this.transportIdArr) + '&surfaceNumberArr=' + JSON.stringify(this.surfaceNumberArr)
					});
					// this.closeBarcode()
				}, false);
				this.viewContent3.addEventListener("click", e => { //返回按钮
					uni.navigateTo({
						url: "/pages/goodsDelivery/transport/inputCode"
					})
				}, false);
			}
		},
		destroyed() {
			this.closeBarcode()
		}
	}
</script>

<style scoped>
	.app-scan-container {
		height: 100%;
		overflow: hidden;
	}
</style>
