<template>
    <view class="all">
		<canvas v-if="isCanvas" canvas-id="imgCanvasBarCode" :style="'width: '+ changeWidth + 'rpx;' + 'height: ' + changeHeight + ';top: 0; bottom: 0; position: fixed; z-index: -1; background-color: #fff;'">
			<view class="canvas-text"></view>
			<!-- <image class="img-box" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/invite.png" mode=""></image> -->
		</canvas>
		<!-- <image style="width: 100vw;height: 100vh;" :src="imgUrl" mode=""></image> -->
		<view class="searchHead">
			<view style="width: 150rpx; flex-direction: row; align-items: center;" @click="backToFromPage">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/back.png" style="width: 22rpx;" mode="widthFix"></image>
			</view>
			<view class="" style="font-weight: 500; font-size: 32rpx; color: #333; flex: 1; justify-content: center; display: flex; align-items: center;">
				<view class="">货运中国</view>
				<view class="head-dot"></view>
				<view class="">标签码</view>
			</view>
			<view style="width: 150rpx; flex-direction: row; text-align: right; align-items: center;"></view>
		</view>
		<swiper class="swiper" duration="500" :circular="isCircular" @change="swiperChange">
			<swiper-item v-for="(item, index) in displaySwiperList" :key="index">
				<view class="code-box">
					<view class="code-table">
						<view class="code-img">
							<view class="" style="display: flex; flex-direction: column; align-items: center;" v-if="isBarCode">
								<tki-barcode
									ref="barcode"
									:onval="true"
									:cid="item.barCode"
									:val="item.barCode"
									:load-make="true"
									@result="barresult($event, index)"
									:opations="barOpations"/>
								<view class="code-font">{{item.barCode}}</view>
							</view>
						</view>
						<view class="code-info">
							<view class="code-user-box">
								<view class="address-status">发</view>
								<view class="code-user">
									<view class="user-name">{{addressObj.shipmentsAddress.userName}}</view>
									<view class="user-city">{{addressObj.shipmentsAddress.city}}</view>
								</view>
							</view>
							<view class="arrow-box">
								<image class="arrow-right" src="/static/images/goodsDelivery/arrowRight.png" mode=""></image>
							</view>
							<view class="code-user-box">
								<view class="address-status1">收</view>
								<view class="arrive-user-box">
									<view class="arrive-box">
										<view class="user-name">{{addressObj.arriveAddress.userName}}</view>
										<view class="user-city">{{addressObj.arriveAddress.city}}</view>
									</view>
									<image class="more-img" src="/static/images/goodsDelivery/icon_right.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="save-box" @click="generate(item)">保存至相册</view>
				</view>
				<view class="code-tips">
					<!-- <view class="tips-text">请使用货运中国APP,</view>
					<view class="tips-text">或者零担扫码小程序扫码。</view>
					<view class="tips-text">“零担一码通，货物号跟踪”</view> -->
					<image class="scanBackground" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/scanBackground.png" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
    </view>
</template>

<script>
    import tkiBarcode from '@/components/tki-barcode/tki-barcode'
	import * as utils from "@/utils/ship.js";
    
    export default {
        components: {
            tkiBarcode
        },
        data() {
            return {
     //            code: '',
     //            barOpations: {
     //                height: 130,
					// width: 3,
     //                displayValue: false
     //            },
				code: '',
				cid: 'cidIndex',
				barOpations: {
					height: 130,
					width: 3,
					displayValue: false
				},
				ldeId: 0,
				addressObj: {},
				codeArr: [],
				currentIndex: 0,
				imgUrl: '', //保存的图片
				systemWidth: 0,
				systemHeight: 0,
				isCanvas: false,
				isBarCode: false,
				
				originList: [], // 源数据
				displaySwiperList: [], // swiper需要的数据
				displayIndex: 0, // 用于显示swiper的真正的下标数值只有：0，1，2。
				originIndex: 0, // 记录源数据的下标
				changeWidth: 750,
				changeHeight: '100%',
				isCircular: true,
            }
        },
		onLoad(options) {
			let that = this;
			// this.init();
			this.ldeId = options.ldeId;
			this.getBarCode();
			this.addressObj = JSON.parse(options.addressObj);
			uni.getSystemInfo({
			    success: function (res) {
					console.log(res);
					that.systemWidth = res.screenWidth;
					that.systemHeight = res.screenHeight;
			    }
			});
			setTimeout(()=>{
				this.isBarCode = true;
			}, 1000)
		},
        methods: {
			initSwiperData(originIndex = this.originIndex) {
				const originListLength = this.codeArr.length; // 源数据长度
				const displayList = [];
				displayList[this.displayIndex] = this.codeArr[originIndex];
				displayList[this.displayIndex - 1 == -1 ? 2 : this.displayIndex - 1] =
				this.codeArr[
					originIndex - 1 == -1 ? originListLength - 1 : originIndex - 1
				];
				displayList[this.displayIndex + 1 == 3 ? 0 : this.displayIndex + 1] =
				this.codeArr[
					originIndex + 1 == originListLength ? 0 : originIndex + 1
				];
				console.log(this.displayIndex);
				if((displayList[0].barCode == this.codeArr[0].barCode)){
					this.isCircular = false;
				} else {
					this.isCircular = true;
				}
				console.log(this.isCircular);
				this.displaySwiperList = displayList;
				console.log(displayList);
				this.isBarCode = false;
				setTimeout(()=>{
					this.isBarCode = true;
				}, 300)
			},
			/**
			 * swiper滑动时候
			 */
			swiperChange(event) {
				const { current } = event.detail;
				const originListLength = this.codeArr.length; // 源数据长度
				// =============向后==========
				if (this.displayIndex - current == 2 || this.displayIndex - current == -1) {
					this.originIndex =
					  this.originIndex + 1 == originListLength ? 0 : this.originIndex + 1;
					this.displayIndex = this.displayIndex + 1 == 3 ? 0 : this.displayIndex + 1;
					console.log(this.displayIndex, this.originIndex);
					this.initSwiperData(this.originIndex);
				}
				  // ======如果两者的差为-2或者1则是向前滑动============
				else if (this.displayIndex - current == -2 || this.displayIndex - current == 1) {
					this.originIndex = this.originIndex - 1 == -1 ? originListLength - 1 : this.originIndex - 1;
					this.displayIndex = this.displayIndex - 1 == -1 ? 2 : this.displayIndex - 1;
					this.initSwiperData(this.originIndex);
				}
			},
            init () {
				this.code = '12345678905678111222' // 生成一维码和二维码
     //            setTimeout(() => {
     //                this.code = '12345678905678111222' // 生成一维码和二维码
					// console.log('llllllllll')
     //            }, 500)
            },
			generate(item){
				var that = this;
				that.isCanvas = true;
				uni.showLoading({
					title: '请稍候...',
					mask: true
				});
				that.changeWidth = 750;
				that.changeHeight = '100%';
				setTimeout(()=>{
					const ctx = uni.createCanvasContext('imgCanvasBarCode');
					console.log(ctx);
					ctx.setLineWidth(0.5);
					ctx.setStrokeStyle('#EAEAEA');
					ctx.moveTo(20, 106);
					ctx.lineTo(that.systemWidth-20, 106);
					
					ctx.moveTo(20, 339);
					ctx.lineTo(that.systemWidth-20, 339);
					
					ctx.moveTo(20, 106);
					ctx.lineTo(20, 339);
					
					ctx.moveTo(that.systemWidth-20, 106);
					ctx.lineTo(that.systemWidth-20, 339);
					ctx.stroke();
					
					ctx.setFillStyle("#333333");
					ctx.setTextAlign('center');
					ctx.setFontSize(15);
					console.log(item.codeImg);
					ctx.drawImage(item.codeImg, (that.systemWidth-273)/2, 106+16, 273, 100);
					ctx.fillText(item.barCode, that.systemWidth/2, 100+16+120);
					ctx.moveTo(that.systemWidth-20, 249);
					ctx.lineTo(20, 249);
					ctx.stroke();
					
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/codeSend.png', 40, 280, 24, 24);
					ctx.setFillStyle("#333333");
					ctx.fillText(that.addressObj.shipmentsAddress.userName, (that.systemWidth-163)/2, 288);
					ctx.setFillStyle("#999999");
					ctx.fillText(that.addressObj.shipmentsAddress.city, (that.systemWidth-163)/2, 308);
					
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrowRight.png', (that.systemWidth-44)/2, 285, 44, 9);
					
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/codeClosed.png', (that.systemWidth+80)/2, 280, 24, 24);
					ctx.setFillStyle("#333333");
					ctx.fillText(that.addressObj.arriveAddress.userName, (that.systemWidth+230)/2, 288);
					ctx.setFillStyle("#999999");
					ctx.fillText(that.addressObj.arriveAddress.city, (that.systemWidth+230)/2, 308);
					
					var logoNum = that.systemHeight - 249 - 116;
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/codeImg.png', (that.systemWidth-267)/2, logoNum, 267, 147);
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/scanBackground.png', 20, that.systemHeight-116, that.systemWidth-40, 98);
					ctx.draw(true, () => {
						uni.canvasToTempFilePath({
							canvasId: 'imgCanvasBarCode',
							fileType: 'jpg',
							// x: 0,
							// y: 0,
							// width: 300,
							// height: 300,
							// destWidth: 300,
							// quality: 1,
							success: function(res) {
								uni.hideLoading();
								that.imgUrl = res.tempFilePath;
								console.log(that.imgUrl);
								that.changeWidth = 0;
								that.changeHeight = '0%';
								that.saveImageToPhotosAlbumTap();
								// that.uploadImg(res.tempFilePath);
							},
							fail: function(error) {
								uni.hideLoading();
								console.log(error)
							},							
						})
					})
				}, 800)
			},
			saveImageToPhotosAlbumTap(){
				let that = this;
				uni.saveImageToPhotosAlbum({
					filePath: that.imgUrl,
					success: function () {
						console.log('save success');
						that.isCanvas = false;
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						})
					}
				});
			},
			backToFromPage() {
				uni.navigateBack({
					
				})
			},
			barresult(e, index){
				this.displaySwiperList[index].codeImg = e;
			},
			changeEvent(e){
				console.log(e.detail.current)
				this.currentIndex = e.detail.current;
			},
			finishEvent(){
				console.log('xxxxxxx')
				// this.code = '12345678905678111222' // 生成一维码和二维码
				// this.$refs.barcode.clearCode();
				this.code = this.codeArr[this.currentIndex].barCode;
				console.log(this.code);
			},
			getBarCode(){
				utils.postRequest('/ld/ldeccred/getBarCode', {
					ldeId: this.ldeId,
				})
				.then(res=>{
					console.log(res.rspBody)
					if(res.retCode == '0000000') {
						this.codeArr = res.rspBody;
						this.code = res.rspBody[0].barCode;
						if(this.codeArr.length<3){
							this.displaySwiperList = this.codeArr;
						} else {
							this.initSwiperData();
						}
					}else{
						
					}
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
			},
        }
    }
</script>

<style lang="scss" scoped>
    .all {
		.searchHead {
			padding:0 40rpx 14rpx 40rpx;
			justify-content: space-between;
			display: flex;
			align-items: flex-end;
			z-index: 99;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			height: 135rpx;
			box-sizing: border-box;
			background-color: #fff;
			.head-dot{
				width: 5rpx;
				height: 5rpx;
				border-radius: 50%;
				background-color: #333;
				margin: 0 5rpx;
			}
		}
		.swiper{
			height: 100vh;
			width: 100vw;
			background-color: #fff;
			.code-box{
				margin-top: 135rpx;
				padding: 34rpx 40rpx;
				.code-table{
					border: 2rpx solid #EAEAEA;
					border-radius: 8rpx;
					.code-img{
						height: 210rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						border-bottom: 2rpx solid #EAEAEA;
						.code-font{
							font-size: 25rpx;
							color: #333;
						}
					}
					.code-info{
						height: 178rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						.code-user-box{
							display: flex;
							align-items: center;
							justify-content: center;
							flex: 1;
							.address-status{
								background-color: #0171F9;
								font-size: 28rpx;
								font-weight: 500;
								color: #fff;
								width: 48rpx;
								height: 48rpx;
								line-height: 48rpx;
								text-align: center;
								border-radius: 10rpx;
								margin-right: 15rpx;
							}
							.address-status1{
								background-color: #FF7700;
								font-size: 28rpx;
								font-weight: 500;
								color: #fff;
								width: 48rpx;
								height: 48rpx;
								line-height: 48rpx;
								text-align: center;
								border-radius: 10rpx;
								margin-right: 15rpx;
							}
							.code-user{
								display: flex;
								flex-direction: column;
								align-items: center;
								.user-name{
									font-size: 30rpx;
									font-weight: 500;
									color: #333;
								}
								.user-city{
									font-size: 30rpx;
									color: #777;
									margin-top: 5rpx;
								}
							}
							.arrive-user-box{
								display: flex;
								align-items: center;
								justify-content: center;
								.arrive-box{
									display: flex;
									flex-direction: column;
									align-items: center;
									margin-right: 34rpx;
									.user-name{
										font-size: 30rpx;
										font-weight: 500;
										color: #333;
									}
									.user-city{
										font-size: 30rpx;
										color: #777;
										margin-top: 5rpx;
									}
								}
								.more-img{
									width: 22rpx;
								}
							}
						}
						.arrow-box{
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: center;
							.arrow-right{
								width: 88rpx;
								height: 18rpx;
							}
						}
					}
				}
				.save-box{
					width: 100%;
					text-align: center;
					height: 88rpx;
					line-height: 88rpx;
					color: #fff;
					margin-top: 32rpx;
					font-size: 32rpx;
					font-weight: 500;
					border-radius: 8rpx;
					background-color: #0171F9;
				}
			}
			.code-tips{
				position: fixed;
				bottom: 40rpx;
				left: 40rpx;
				right: 40rpx;
				height: 198rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: 8rpx;
				font-size: 30rpx;
				color: #333;
				font-weight: 500;
				.tips-text{
					line-height: 42rpx;
				}
				.scanBackground{
					width: 670rpx;
					height: 196rpx;
				}
			}
		}
    }
</style>