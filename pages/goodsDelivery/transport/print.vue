<template>
	<view class="all">
		<view class="body-box">
			<view class="select-goods">选择货物</view>
			<view class="table-box">
				<view class="table-head">
					<view class="head-text" style="width: 250rpx;">货物</view>
					<view class="head-text" style="width: 150rpx;">数量</view>
					<view class="head-text" style="width: 150rpx;">标签数</view>
					<view class="head-text" style="width: 150rpx;">已打印</view>
					<!-- <view class="head-text" style="width: 172rpx;">标签编码</view> -->
				</view>
				<view class="table-content">
					<radio-group @change="checkboxChange">
						<view class="table-arr" v-for="(item, index) in goodsArr">
							<view class="content-text">
								<view class="content-child" style="width: 250rpx;text-align: left;">
									<view class="child_first">
										<radio :value="index" :checked="index == currentIndex"></radio>
										{{item.gdName}}
									</view>
									
								</view>
								<view class="content-child" style="width: 150rpx;">{{item.gdNumber}}</view>
								<view class="content-child" style="width: 150rpx;">{{item.shouldPrintCount}}</view>
								<view class="content-child" style="width: 150rpx;">{{item.hasPrintCount || 0}}</view>
								<!-- <view class="content-child" style="width: 172rpx;">{{item.batchNumber}}</view> -->
							</view>
							<view class="content-line" v-if="index != (goodsArr.length-1)"></view>
						</view>
					</radio-group>	
				</view>
			</view>
			<view class="scope-box">
				<view class="scope-text">打印范围</view>
				<view class="input-box">
					<input class="input-child" type="number" v-model="startVal" placeholder="请输入" />
					<view class="input-line"></view>
					<input class="input-child" type="number" v-model="endVal" placeholder="请输入" />
				</view>
			</view>
			<view class="btn-box">
				<view class="btn-text" @click="printOne">打印</view>
				<view class="btn-text" @click="printAll">全部打印</view>
			</view>
		</view>
		<!-- <canvas  canvas-id='edit_area_canvas' :style="{width:canvasWidth+'px',height:canvasHeight+'px'}"></canvas> -->
	</view>
</template>

<script>
	var tsc = require("../LtlOrder/bleManager/util/ble/tsc.js");
	var util = require("../LtlOrder/bleManager/util/ble/util.js");
	import * as utils from "@/utils/ship.js";
	import { mapState } from 'vuex';
	export default {
		data() {
			return {
				goodsArr: [],
				currentIndex: 0,
				//蓝牙参数
				looptime: 0,   //需完整发送20个字节多少次
				currentTime: 1,  //发送次数
				lastData: 0,    //最后发送的蓝牙数据大小
				oneTimeData: 20,  //蓝牙发送数据大小20字节
				currentPrint: 1, //当前打印第几个标签
				startVal: '',  //打印标签起始位置
				endVal: '',   //打印标签结束位置
				willPrintArr: [], //需打印的码数据arr
				printNum: 1, //需打印的总标签
				printTotalIndex: 0, //全部打印的货物index
				printType: 'All', //打印类别
				sendOk: false,
				imageSrc: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/driverLog.png', //打印的logo
				canvasWidth: 180,
				canvasHeight: 180,
			}
		},
		onLoad(options) {
			var ldeSid = options.ldeSid;
			var info = options.info;
			this.info = JSON.parse(info);
			this.ldeSid = ldeSid;
			this.init(ldeSid);
		},
		onShow() {
			var that = this;
			let width;
			let height;
			uni.getImageInfo({
			  src: that.imageSrc,
			  success(res) {
				console.log(res.width)
				console.log(res.height)
				width = res.width/4
				height = res.height/4
				that.canvasWidth = res.width/4;
				that.canvasHeight = res.height/4;
				const ctx = uni.createCanvasContext("edit_area_canvas", that);
				ctx.drawImage(that.imageSrc, 0, 0, width, height);
				ctx.draw();
			  }
			})
			
		},
		computed: mapState(['sysinfo', 'Bluetooth']),
		methods: {
			async init(ldeSid) {
				try{
					var response = await utils.postRequest("/ld/cargogoods/findVO", {
						ldeSid
					})
					console.log(response, '返回');
					if (response.retCode == "0000000") {
						this.goodsArr = response.rspBody
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			checkboxChange(e) {
				console.log(e)
				var that = this;
				that.currentIndex = e.detail.value;
			},
			printAll() {
				//打印所有
				this.printType = "All";
				let {BLEInformation} = this.Bluetooth;
				if (!BLEInformation.deviceId) {
					uni.showToast({
						title: '请连接蓝牙',
						icon: 'none'
					})
					return;
					
				}
				if (!utils.btnRepeat()) return;
				//构造打印arr
				var goodsArr = this.goodsArr;
				var goodsIndex = goodsArr.length;
				var printTotalIndex = this.printTotalIndex;
				var selectedData = this.goodsArr[printTotalIndex];
				var labelLen = selectedData.ldebarcodes.length;
				this.labelLen = labelLen;
				this.willPrintArr = selectedData.ldebarcodes;
				this.printNum = labelLen;
				this.selectedData = selectedData;
				uni.showLoading({
					title: '打印中...'
				})
				this.printLabel();
			
				
			},
			printOne() {
				this.printType = "Simple";
				let {BLEInformation} = this.Bluetooth;
				if (!BLEInformation.deviceId) {
					uni.showToast({
						title: '请连接蓝牙',
						icon: 'none'
					})
					return;
					
				}
				if (!utils.btnRepeat()) return;
				if (!this.startVal || !this.endVal) {
					uni.showToast({
						title: '请输入打印范围',
						icon: 'none'
					})
					return;
				}
				if (this.startVal == 0) {
					uni.showToast({
						title: '打印起始范围需大于0',
						icon: 'none'
					})
					return;
				}
				if (this.startVal > this.endVal) {
					uni.showToast({
						title: '打印范围有误',
						icon: 'none'
					})
					return;
				}
				var currentIndex = this.currentIndex;
				var selectedData = this.goodsArr[currentIndex];
				var labelLen = selectedData.ldebarcodes.length;
				if (this.endVal > labelLen) {
					uni.showToast({
						title: '单次可打印数量必须≤这个面单的标签数',
						icon: 'none'
					})
					return;
				}
				var ldebarcodes = selectedData.ldebarcodes;
				var printArr = ldebarcodes.slice(this.startVal - 1, this.endVal);
				this.willPrintArr = printArr;
				this.printNum = printArr.length;
				this.selectedData = selectedData;
			
				console.log(printArr, '要打印的数据', this.startVal, this.endVal)
				uni.showLoading({
					title: '打印中...'
				})
				
				this.printLabel();
				
 			},
			printLabel() {
				
				var that = this;
				var info = this.info;
				let canvasWidth = that.canvasWidth
				let canvasHeight = that.canvasHeight
				var willPrintArr = this.willPrintArr;
				var currentPrint = this.currentPrint;
				var printDetail = willPrintArr[currentPrint - 1];
				var selectedData = this.selectedData;
				console.log(printDetail, selectedData, '打印数据')
				//打印条形码
				let command = tsc.jpPrinter.createNew()
				var now = new Date();
				var date = util.formatTime(now);
				command.setSize(750, 1125)
				
				command.setGap(20)
				command.setCls()
				command.setBox(100, 80, 750, 1125, 2);
				
				
				
				command.setBarCode(130, 130, "128", 120, 0, 3, 3, printDetail.barCode)
				command.setText(340, 260, "TSS24.BF2", 1, 1, printDetail.barCode)
				command.setBar(100, 320, 650, 2);
				var len = info.shipAddress ? info.shipAddress.length : 0;
				var addrSize = 30 * len;
				var labelSize_x = 420;
				if (addrSize  > 0) {
					command.setText(140, 360, "TSS24.BF2", 1, 1, info.shipAddress);
				}
				if (addrSize < 320) {
					command.setBar(420, 320, 2, 100);
				} else {
					command.setBar(addrSize + 100, 320, 2, 100);
				}
				
				if (this.printType = "Simple") {
					var startVal = this.startVal;
					var selectedData = this.selectedData;
					var label = (Number(currentPrint) + Number(startVal) - 1) + '/' + selectedData.ldebarcodes.length;
				} else {
					var label = currentPrint + '/' + willPrintArr.length;
				}
				
				command.setText(680, 360, "TSS24.BF2", 1, 1, label)
				
				command.setBar(100, 420, 650, 2);
				command.setText(140, 460, "TSS24.BF2", 1, 1, "收")
				var arriveNameLen = info.arriveName.length;
				command.setText(240, 440, "TSS24.BF2", 1, 1, info.arriveName)
				if (arriveNameLen > 0) {
					command.setText(240 + 30*arriveNameLen, 440, "TSS24.BF2", 1, 1, info.arrivePhone)
				} else {
					command.setText(320, 440, "TSS24.BF2", 1, 1, info.arrivePhone)
				}
				
				
				command.setText(240, 480, "TSS24.BF2", 1, 1, info.arriveAddress)
				
				command.setBar(100, 520, 650, 2);
				
				command.setText(140, 560, "TSS24.BF2", 1, 1, "货物")
				
				command.setBar(220, 520, 2, 100);
				command.setText(280, 560, "TSS24.BF2", 1, 1, selectedData.gdName);
				command.setBar(100, 620, 650, 2);
				//重量
				command.setText(140, 660, "TSS24.BF2", 1, 1, "重量")
				command.setBar(220, 620, 2, 100);
				var gdWeight = selectedData.gdWeight + '千克';
				if (selectedData.gdWeight) {
					command.setText(260, 660, "TSS24.BF2", 1, 1, gdWeight)
				} else {
					command.setText(260, 660, "TSS24.BF2", 1, 1, "")
				}
				
				command.setBar(360, 620, 2, 100);
				
				//体积
				command.setText(400, 660, "TSS24.BF2", 1, 1, "体积")
				command.setBar(480, 620, 2, 100);
				var gdVolume = selectedData.gdVolume + '吨';
				if (selectedData.gdVolume) {
					command.setText(580, 660, "TSS24.BF2", 1, 1, gdVolume)
				} else {
					command.setText(580, 660, "TSS24.BF2", 1, 1, "")
				}

				
				command.setBar(100, 720, 650, 2);
				
				
				command.setText(140, 760, "TSS24.BF2", 1, 1, "备注")
				command.setText(200, 760, "TSS24.BF2", 1, 1, info.remake)
				command.setBar(100, 820, 650, 2);
				
				command.setText(340, 860, "TSS24.BF2", 1, 1, "请使用货运中国App")
				command.setText(310, 900, "TSS24.BF2", 1, 1, "或者零担扫码小程序扫码")
				// command.setText(30, 150, "TSS24.BF2", 1, 1, date)
				// command.setText(150, 150, "TSS24.BF2", 1, 1, "第1/2")
				
				// command.setText(60, 90, "TSS24.BF2", 1, 1, "佳博智汇")
				// command.setText(170, 50, "TSS24.BF2", 1, 1, "小程序测试")
				// command.setText(170, 90, "TSS24.BF2", 1, 1, "测试数字12345678")
				// command.setText(170, 120, "TSS24.BF2", 1, 1, "测试英文abcdefg")
				// command.setText(170, 150, "TSS24.BF2", 1, 1, "测试符号/*-+!@#$")
				
				//打印图片
				// uni.canvasGetImageData({
				//   canvasId: 'edit_area_canvas',
				//   x: 0,
				//   y: 0,
				//   width: canvasWidth,
				//   height: canvasHeight,
				//   success: function(res) {
				// 	console.log(res, '啊')
				// 	command.setBitmap(310, 940, 2, res)
				//   },
				//   complete: function() {
				// 	that.isLabelSend = true;
				// 	command.setPagePrint()
				// 	command.setAdjust();
				// 	command.setEop();
				// 	that.prepareSend(command.getData())
				//   }
				// })
				command.setPagePrint()
				command.setAdjust();
				command.setEop();
				that.prepareSend(command.getData())
				
				
			},
			//准备发送，根据每次发送字节数来处理分包数量
			prepareSend(buff){
				console.log(buff);
				let that = this
				let time = that.oneTimeData
				let looptime = parseInt(buff.length / time);
				let lastData = parseInt(buff.length % time);
				console.log(looptime + "---" + lastData)
				this.looptime = looptime + 1;
				this.lastData = lastData;
				this.currentTime = 1;
				that.Send(buff)
			},
			//分包发送
			Send(buff){
				let that = this
				let {currentTime,looptime:loopTime,lastData,oneTimeData:onTimeData,printNum,currentPrint}=that;
				let buf;
				let dataView;
				if (currentTime < loopTime) {
				  buf = new ArrayBuffer(onTimeData)
				  dataView = new DataView(buf)
				  for (var i = 0; i < onTimeData; ++i) {
					dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
				  }
				} else {
				  buf = new ArrayBuffer(lastData)
				  dataView = new DataView(buf)
				  for (var i = 0; i < lastData; ++i) {
					dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
				  }
				}
				console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
				let {
					BLEInformation
				} = that.Bluetooth;
				
				plus.bluetooth.writeBLECharacteristicValue({
					deviceId: BLEInformation.deviceId,
					serviceId: BLEInformation.writeServiceId,
					characteristicId: BLEInformation.writeCharaterId,
					value: buf,
					success: function(res) {
						console.log(res)
						if (res.code == "10007") {
							that.sendOk = false;
							setTimeout(() => {
								that.Send(buff);
							}, 500)
							
						}
						if (res.code == 0) {
							that.sendOk = true;
						}
					},
					fail: function(e) {
						console.log(e)
						if (e.code == "10007") {
							that.sendOk = false;
							setTimeout(() => {
								that.Send(buff);
							}, 500)
						} else {
							uni.hideLoading();
							uni.showToast({
								title: '打印出错，请重试',
								icon: 'none'
							})
							
						}
					},
					complete: function() {
						if (!that.sendOk) return;
						currentTime++
						if (currentTime <= loopTime) {
							that.currentTime = currentTime;
							that.Send(buff)
						} else {
						// uni.showToast({
						// 	title: '已打印第' + currentPrint + '张',
						// })
					  //已打印多少张
						console.log(currentPrint,printNum, '打印第几张');
						if (currentPrint == printNum) {
							//打印完成，上报服务器
							that.looptime = 0;
							that.lastData = 0;
							that.currentTime = 1;
							that.currentPrint = 1;
							if (that.printType == "Simple") {
								var willPrintArr = that.willPrintArr;
								var sidArr = [];
								willPrintArr.forEach(item => {
									sidArr.push({
										sid: item.sid
									})
								})
								console.log(sidArr, '数组11');
								utils.postRequest("/ld/ldebarcode/print", sidArr)
								.then(res => {
									console.log(res, '上报成功');
									uni.hideLoading();
									uni.showToast({
										title: "打印完成",
									})
									that.init(that.ldeSid);
								})
								.catch(err => {
									console.log(err)
								})
							} else {
								//打印一个货物后接下来打印第二个货物
								console.log(that.printTotalIndex, that.goodsArr.length)
								var printTotalIndex = that.printTotalIndex;
								var goodsArr = that.goodsArr;
								if (printTotalIndex == goodsArr.length - 1) {
									//全部打印完成,上报服务器
									var sidArr = [];
									goodsArr.forEach(atem => {
										var ldebarcodes = atem.ldebarcodes;
										ldebarcodes.forEach(i => {
											sidArr.push({
												sid: i.sid
											})
										})
									})
									utils.postRequest("/ld/ldebarcode/print", sidArr)
									.then(res => {
										console.log(res, '上报成功');
										that.printTotalIndex = 0;
										uni.hideLoading();
										uni.showToast({
											title: "打印完成",
										})
										that.init(that.ldeSid);
									})
									.catch(err => {
										console.log(err)
									})
									
								} else {
									printTotalIndex ++;
									that.printTotalIndex = printTotalIndex;
									var selectedData = that.goodsArr[printTotalIndex];
									var labelLen = selectedData.ldebarcodes.length;
									that.selectedData = selectedData;
									that.labelLen = labelLen;
									that.willPrintArr = selectedData.ldebarcodes;
									that.printNum = labelLen;
									console.log(printTotalIndex, labelLen, '阿飒飒');
									that.printLabel();
									
								}
								
							}
					
						} else {
							currentPrint++;
							that.currentPrint = currentPrint;
							that.currentTime = 1;
							// that.Send(buff)
							//连续打印
							that.printLabel();
							

					  }
					}
				  }
				})
			},
		}
	}
</script>

<style lang="scss">
	.all{
		.body-box{
			padding: 20rpx 18rpx;
			.select-goods{
				font-size: 32rpx;
				font-weight: 500;
				color: #222;
			}
			.table-box{
				margin-top: 20rpx;
				border-radius: 8rpx;
				border: 2rpx solid #EAEAEA;
				.table-head{
					display: flex;
					align-items: center;
					padding: 28rpx 0;
					.head-text{
						color: #707071;
						font-size: 28rpx;
						text-align: center;
					}
				}
				.table-content{
					.table-arr{
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						.content-text{
							padding: 28rpx 0;
							font-size: 26rpx;
							color: #333;
							display: flex;
							align-items: center;
							.content-child{
								text-align: center;
								.child_first {
									display: flex;
									flex-direction: row;
									align-items: center;
								}
							}
						}
						.content-line{
							width: 606rpx;
							height: 2rpx;
							background-color: #EAEAEA;
						}
					}
				}
			}
			.scope-box{
				font-size: 30rpx;
				color: #333;
				margin-top: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.scope-text{
					margin-right: 80rpx;
				}
				.input-box{
					display: flex;
					align-items: center;
					.input-line{
						width: 70rpx;
						height: 2rpx;
						background-color: #333;
						margin: 0 20rpx;
					}
					.input-child{
						width: 178rpx;
						height: 56rpx;
						border-radius: 8rpx;
						border: 2rpx solid #7F7F7F;
						font-size: 32rpx;
						text-align: center;
						line-height: 56rpx;
					}
				}
			}
			.btn-box{
				position: fixed;
				bottom: 28rpx;
				left: 54rpx;
				right: 54rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.btn-text{
					width: 296rpx;
					text-align: center;
					height: 88rpx;
					line-height: 88rpx;
					border-radius: 50rpx;
					color: #3372F0;
					font-weight: 500;
					font-size: 32rpx;
					border: 2rpx solid #3372F0;
				}
			}
		}
	}
</style>
