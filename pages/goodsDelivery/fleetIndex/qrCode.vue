<template>
	<view class="all">
		<image class="share-background" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/fleetShare.jpg" mode=""></image>
		<view class="fleet-img-head">
			<view class="fleet-child">
				<image class="fleet-back" src="/static/images/arrow_left_white.png" @click="backTap" mode="widthFix"></image>
			</view>
			<view class="fleet-child fleet-text">二维码分享</view>
			<view class="fleet-child"></view>
		</view>
		<canvas v-if="isCanvas" canvas-id="imgCanvasFleet" style="width: 750rpx;top: 0; bottom: 0; height: 100%; position: fixed; z-index: -1;">
			<view class="canvas-text"></view>
		</canvas>
		<!-- <image :src="imgUrl" mode="" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; width: 100%; height: 100%;"></image> -->
		<view class="content-box">
			<view class="shareContent-box">
				<image class="content-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/shareContent.png" mode=""></image>
				<view class="share-box">
					<image class="user-img" :src="info.badgeImage?info.badgeImage:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/fleet-head.png'"></image>
					<view class="user-name">{{info.name}}</view>
					<view class="num-box">
						<view class="share-num">车队号：{{info.code}}</view>
					</view>
					<view class="share-line"></view>
					<image class="code-img" :src="qrImg" mode=""></image>
					<view class="tips">请使用“货运中国”App</view>
					<view class="tips">扫码加入车队</view>
					<view class="btn-box">
						<view class="share-save" @click="saveImageToPhotosAlbumTap">保存</view>
						<view class="share-tap" @click="shareEventTap">分享</view>
					</view>
					
				</view>
			</view>
		</view>
		<view class="popup-box" v-if="isShare">
			<view class="black-box"></view>
			<view class="popup-content">
				<view class="popup-head">分享到</view>
				<view class="popup-row">
					<view class="popup-child" @click="shareEvent('WXSceneSession')">
						<image class="popup-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/weChat.png" mode=""></image>
						<view class="">微信好友</view>
					</view>
					<view class="popup-child" @click="shareEvent('WXSenceTimeline')">
						<image class="popup-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/circleFriends.png" mode=""></image>
						<view class="">朋友圈</view>
					</view>
				</view>
				<view class="popup-row">
					<view class="popup-child" @click="saveImageToPhotosAlbumTap">
						<image class="popup-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/saveImg.png" mode=""></image>
						<view class="">保存到手机</view>
					</view>
				</view>
				<view class="cancel-btn" @click="cancelShare">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
	import QRCode from '@/config/qrcode';
	import { pathToBase64, base64ToPath } from '@/js_sdk/mmmm-image-tools/index.js'
	export default {
		data() {
			return {
				isShare: false,
				userInfo: {},
				isCanvas: false,
				systemWidth: 0,
				systemHeight: 0,
				imgUrl: '',
				qrImg: '',
				info: {},
			}
		},
		onLoad(options) {
			var that = this;
			var userInfo = uni.getStorageSync("userInfo");
			if(userInfo){
				that.userInfo = JSON.parse(userInfo)
			}
			that.info = options.info?JSON.parse(options.info):{}
			uni.getSystemInfo({
			    success: function (res) {
					that.systemWidth = res.screenWidth;
					that.systemHeight = res.screenHeight;
					that.qrCodeFun();
			    }
			});
		},
		onReady() {
			
		},
		methods: {
			qrCodeFun() {
				let that = this;
				var qrData = {
					fleetId: that.info.id,
					code: that.info.code,
					// name: that.info.name,
				};
				base64ToPath(QRCode.createQrCodeImg(encodeURI(JSON.stringify(qrData))))
				.then(path => {
					that.qrImg = path;
					that.generate();
				})
				.catch(error => {
					console.error(error)
				})
			},
			saveImageToPhotosAlbumTap(){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '保存将获取您的存储权限',
					success(res) {
						if (res.confirm) {
							uni.saveImageToPhotosAlbum({
								filePath: that.imgUrl,
								success: function () {
									console.log('save success');
									uni.showToast({
										title: '保存成功',
										icon: 'success'
									})
								}
							});
						}
					}
				})
				
			},
			backTap(){
				uni.navigateBack()
			},
			cancelShare(){
				this.isShare = false;
			},
			shareEventTap(){
				this.isShare = true;
			},
			shareEvent(type){
				var that = this;
				this.isShare = false;
				uni.share({
				    provider: "weixin",
				    scene: type,
				    type: 2,
				    imageUrl: that.imgUrl,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			},
			generate(){
				var that = this;
				that.isCanvas = true;
				// uni.showLoading({
				// 	title: '请稍候...',
				// 	mask: true
				// });
				setTimeout(()=>{
					const ctx = uni.createCanvasContext('imgCanvasFleet');
					console.log(that.systemWidth);
					const canvasHeight = (that.systemHeight-400)/2
					ctx.setFillStyle("#FFFFFF");
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/fleetShare.jpg', 0, 0, uni.upx2px(750), that.systemHeight);
					ctx.restore();
					ctx.setLineWidth(10);
					ctx.setTextAlign('center');
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/shareContent.png', (that.systemWidth-301)/2, canvasHeight, 301, 420);
					ctx.setFillStyle("#0171F9");
					ctx.setFontSize(17);
					var name = that.info.name;
					ctx.fillText(name, that.systemWidth/2, canvasHeight + 62);
					var shareText = '请使用"货运中国"App';
					ctx.setFillStyle("#666666");
					ctx.setFontSize(14);
					ctx.fillText(shareText, that.systemWidth/2, canvasHeight + 375);
					var shareText = '扫码加入车队';
					ctx.setFillStyle("#666666");
					ctx.setFontSize(14);
					ctx.fillText(shareText, that.systemWidth/2, canvasHeight + 395);
									
					ctx.setFillStyle("#333333");
					ctx.setFontSize(17);
					var shareCode = '车队号：' + that.info.code;
					ctx.fillText(shareCode, that.systemWidth/2, canvasHeight + 98);
					//画二维码
					ctx.drawImage(that.qrImg, (that.systemWidth-206)/2, canvasHeight + 140, 206, 206);
					ctx.setFontSize(15);
					//画头像
					ctx.arc((that.systemWidth-80)/2 + 35, canvasHeight, 35, 0, 2 * Math.PI);
					ctx.clip();
					var badgeImage = that.info.badgeImage?that.info.badgeImage:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/fleet-head.png';
					ctx.drawImage(badgeImage,(that.systemWidth-80)/2, canvasHeight - 35, 70, 70)
					
					ctx.draw(true, () => {
						uni.canvasToTempFilePath({
							canvasId: 'imgCanvasFleet',
							// fileType: 'png',
							// x: 0,
							// y: 0,
							// width: 300,
							// height: 300,
							// destWidth: 300,
							// quality: 1,
							success: function(res) {
								that.imgUrl = res.tempFilePath;
								console.log(that.imgUrl);
								// that.uploadImg(res.tempFilePath);
							},
							fail: function(error) {
								uni.hideLoading();
								console.log(error)
							},							
						})
					})
				}, 500)
			},
			setClipboardData(){
				var that = this;
				uni.setClipboardData({
					data: that.userInfo.attrs.userCode.toString(),//要被复制的内容
					success:()=>{//复制成功的回调函数
					  uni.showToast({//提示
						title:"复制成功"
					  })
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.all{
		.share-background{
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
		}
		.fleet-img-head{
			position: fixed;
			top: 100rpx;
			left: 40rpx;
			right: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			z-index: 9999;
			.fleet-child{
				flex: 1;
				.fleet-back{
					width: 40rpx;
				}
			}
			.fleet-text{
				text-align: center;
				color: #fff;
			}
		}
		.content-box{
			position: fixed;
			top: 10rpx;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			z-index: 9;
			.shareContent-box{
				display: flex;
				justify-content: center;
				margin-top: 114rpx;
				position: relative;
				width: 620rpx;
				.content-img{
					width: 620rpx;
					height: 984rpx;
				}
				.share-box{
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					.user-img{
						width: 144rpx;
						height: 144rpx;
						border-radius: 70rpx;
						margin-top: -70rpx;
					}
					.user-name{
						font-size: 28rpx;
						color: #333;
						margin-top: 48rpx;
						font-size: 34rpx;
						color: #0171F9;
						font-weight: 500;
					}
					.num-box{
						display: flex;
						align-items: center;
						justify-content: center;
						.share-num{
							color: #333;
							font-size: 28rpx;
							margin-top: 24rpx;
							font-family: Arial;
						}
					}
					.share-line{
						border-bottom: 1rpx dashed #4C9AFA;
						width: 516rpx;
						margin: 62rpx 0;
					}
					.code-img{
						width: 412rpx;
						height: 412rpx;
						margin-bottom: 20rpx;
					}
					.scan-box{
						color: #777;
						font-size: 24rpx;
						margin: 12rpx 0;
					}
					.btn-box{
						display: flex;
						align-items: center;
						padding: 0 54rpx;
						box-sizing: border-box;
						justify-content: space-between;
						width: 620rpx;
						margin-top: 20rpx;
						.share-save{
							width: 240rpx;
							height: 80rpx;
							line-height: 80rpx;
							text-align: center;
							border-radius: 40rpx;
							border: 2rpx solid #0171F9;
							color: #0171F9;
						}
						.share-tap{
							width: 240rpx;
							height: 80rpx;
							line-height: 80rpx;
							text-align: center;
							border-radius: 40rpx;
							background: linear-gradient(270deg, #1E52C4 0%, #497FFB 100%);
							color: #fff;
						}
					}
					.share-top{
						width: 548rpx;
						height: 144rpx;
						font-size: 26rpx;
						color: #333;
						line-height: 36rpx;
						margin-top: 20rpx;
					}
				}
			}
		}
		.popup-box{
			.black-box{
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: #000;
				opacity: 0.6;
				z-index: 99;
			}
			.popup-content{
				position: fixed;
				bottom: 30rpx;
				left: 24rpx;
				right: 24rpx;
				// height: 330rpx;
				height: 500rpx;
				background-color: #fff;
				z-index: 999;
				border-radius: 40rpx;
				padding: 30rpx 40rpx;
				.popup-head{
					color: #333;
					font-size: 28rpx;
					font-weight: bold;
				}
				.popup-row{
					display: flex;
					align-items: center;
					border-bottom: 2rpx solid #F6F6F6;
					padding: 30rpx 10rpx;
					.popup-child{
						font-size: 22rpx;
						color: #333;
						margin-right: 70rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						.popup-img{
							width: 88rpx;
							height: 88rpx;
							margin-bottom: 14rpx;
						}
					}
				}
				.cancel-btn{
					display: flex;
					align-items: flex-end;
					justify-content: center;
					color: #777;
					height: 90rpx;
					font-size: 32rpx;
				}
			}
		}
	}
	.tips {
		font-size: 28rpx;
		color: #666666;
		line-height: 40rpx;
	}
</style>
