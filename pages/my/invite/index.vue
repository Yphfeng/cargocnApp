<template>
	<view class="all">
		<canvas v-if="isCanvas" canvas-id="imgCanvas" style="width: 750rpx;top: 0; bottom: 0; height: 100%; position: fixed; z-index: -1;">
			<view class="canvas-text"></view>
			<!-- <image class="img-box" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/invite.png" mode=""></image> -->
		</canvas>
		<!-- <image style="width: 100vw;height: 50vh;" :src="imgUrl" mode=""></image> -->
		<view class="background-box">
			<image class="img-box" :src="selectImgUrl" mode=""></image>
		</view>
		<view class="refresh-box">
			<view class="box-child" @click="nextEvent()">
				<image class="refresh-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/refresh1.png" mode=""></image>
				<view class="">换一换</view>
			</view>
		</view>
		<view class="content-box">
			<view class="title-box">
				<view class="title">货运中国</view>
				<view class="title-child">卡车人的家 温暖 安全 信任 互助</view>
			</view>
			<view class="shareContent-box">
				<image class="content-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/shareContent.png" mode=""></image>
				<view class="share-box">
					<image class="user-img" :src="userInfo.attrs.avatar?userInfo.attrs.avatar:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
					<view class="user-name">{{userInfo.userName}}的邀请码</view>
					<view class="share-num">{{userInfo.attrs.userCode}}</view>
					<view class="share-btn">
						<!-- 复制更 改成 我的邀请 -->
						<!-- <view class="btn-child" style="margin-right: 70rpx;" @click="setClipboardData()">复制</view> -->
						<view class="btn-child" style="margin-right: 70rpx;" @click="goMyInvitationList">我的邀请</view>
						<!-- <view class="btn-child" @click="rankingList">排行榜</view> -->
					</view>
					<image class="code-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/code.png" mode=""></image>
					<view class="scan-box">扫码下载货运中国</view>
					<view class="share-tap" @click="generate">分享</view>
					<view class="share-top">“货运中国”是全体卡车人自己的平台！我们鼓励卡友介绍您身边的司机朋友加入平台。经您推荐加入平台的新卡友，我们将为您发放相应奖励。我为人人，人人为我！</view>
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
					<view class="popup-child" @click="downloadFile">
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
	import * as utils from "@/utils/service.js"
	export default {
		data() {
			return {
				imgUrl: '',
				systemWidth: 0,
				isShare: false,
				userInfo: {},
				isCanvas: false,
				selectImg: 0,
				imgMax: 0,
				selectImgUrl: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/invite1.png',
			}
		},
		onLoad() {
			let that = this;
			var userInfo = uni.getStorageSync("userInfo");
			if(userInfo){
				that.userInfo = JSON.parse(userInfo)
			}
			uni.getSystemInfo({
			    success: function (res) {
					that.systemWidth = res.screenWidth;
			        // console.log(res.model);
			        // console.log(res.pixelRatio);
			        // console.log(res.windowWidth);
			        // console.log(res.windowHeight);
			        // console.log(res.language);
			        // console.log(res.version);
			        // console.log(res.platform);
			    }
			});
		},
		onReady() {
			// setTimeout(()=>{
			// 	this.generate();
			// }, 1000)
			// this.generate();
		},
		methods: {
			// 获取我的邀请列表
			goMyInvitationList(){
				let that = this;
				uni.navigateTo({
					url: './invitationList'
				})
			},
			nextEvent(){
				var that = this;
				if(that.imgMax == 4){
					that.selectImg = 0;
				} else{
					that.selectImg = that.selectImg + 1;
				}
				if(that.selectImg == 4){
					that.imgMax = 4
				}
				if(that.selectImg == 0){
					that.imgMax = 0
				}
				that.selectImgUrl = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/invite' + (that.selectImg + 1) + '.png';
				console.log(that.selectImg);
			},
			downloadFile(){
				var that = this;
				uni.downloadFile({
					url: that.shareImg,//图片地址
					success: (res) =>{
						if (res.statusCode === 200){
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									that.isShare = false;
									uni.showToast({
										title: "保存成功",
										icon: "none"
									});
								},
								fail: function() {
									uni.showToast({
										title: "保存失败",
										icon: "none"
									});
								}
							});
						} 
					}
				})
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
			openShare(){
				this.generate();
			},
			cancelShare(){
				this.isShare = false;
			},
			shareEvent(type){
				var that = this;
				this.isShare = false;
				uni.share({
				    provider: "weixin",
				    scene: type,
				    type: 2,
				    imageUrl: that.shareImg,
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
				uni.showLoading({
					title: '请稍候...',
					mask: true
				});
				setTimeout(()=>{
					const ctx = uni.createCanvasContext('imgCanvas');
					console.log(that.systemWidth);
					let xCoordinates = (this.systemWidth - 301) / 2;
					ctx.setFillStyle("#FFFFFF");
					console.log(that.selectImgUrl);
					ctx.drawImage(that.selectImgUrl, 0, 0, uni.upx2px(750), uni.upx2px(1530));
					ctx.restore();
					ctx.setFontSize(36);
					ctx.setLineWidth(10);
					ctx.setTextAlign('center');
					ctx.fillText('货运中国', that.systemWidth/2, 92, that.systemWidth);
					ctx.setFontSize(15);
					ctx.fillText('卡车人的家 温暖 安全 信任 互助', that.systemWidth/2, 120, that.systemWidth+200);
					ctx.setTextAlign('center');
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/shareContent.png', (that.systemWidth-301)/2, 171, 301, 405);
					ctx.setFillStyle("#333333");
					var name = that.userInfo.userName + '的邀请码'
					ctx.fillText(name, that.systemWidth/2, 240, 375);
					ctx.setFillStyle("#0077FF");
					ctx.font = 'bold 60px Arial';
					var shareCode = that.userInfo.attrs.userCode;
					ctx.fillText(shareCode, that.systemWidth/2, 320, that.systemWidth+200);
					//画线条
					// ctx.setLineWidth(1);
					// ctx.setStrokeStyle("#AAAAAA");
					// ctx.lineTo(68, 350);
					// ctx.lineTo(uni.upx2px(630), 350);
					// ctx.stroke();
					//画二维码
					ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/code.png', (that.systemWidth-150)/2, 370, 150, 150);
					ctx.setFontSize(15);
					ctx.setFillStyle("#777777");
					ctx.fillText('扫码下载货运中国', that.systemWidth/2, 550, 375);
					//画头像
					ctx.arc((that.systemWidth-80)/2 + 35, 170, 35, 0, 2 * Math.PI);
					ctx.clip();
					var userImg = that.userInfo.attrs.avatar?that.userInfo.attrs.avatar:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png';
					ctx.drawImage(userImg,(that.systemWidth-80)/2, 135, 70, 70)
					ctx.draw(true, () => {
						uni.canvasToTempFilePath({
							canvasId: 'imgCanvas',
							// fileType: 'png',
							// x: 0,
							// y: 0,
							// width: 300,
							// height: 300,
							// destWidth: 300,
							// quality: 1,
							success: function(res) {
								console.log(res.tempFilePath)
								that.imgUrl = res.tempFilePath;
								console.log(that.imgUrl);
								that.uploadImg(res.tempFilePath);
							},
							fail: function(error) {
								uni.hideLoading();
								console.log(error)
							},							
						})
					})
				}, 500)
			},
			uploadImg(image) {
				var that = this;
				uni.uploadFile({
					url: utils.ApiRootUrl + '/file/upload',
					filePath: image,
					name: 'file',
					formData: {
						userType: '84'
					},
					success: function(res) {
						that.isCanvas = false;
						uni.hideLoading();
						var result = JSON.parse(res.data);
						that.shareImg = result.rspBody[0].url;
						that.isShare = true;
						console.log(result)
					},
					fail: function(res) {
						uni.showToast({
							title: '网络错误!',
							icon: 'none'
						});
						uni.hideLoading();
					},
				});
			},
			rankingList(){
				uni.navigateTo({
					url: './rankingList'
				})
			}
		}
	}
</script>

<style lang="scss">
	.all{
		border-top: 10rpx solid #f2f2f2;
		box-sizing: border-box;
		.background-box{
			position: fixed;
			top: 10rpx;
			left: 0;
			right: 0;
			bottom: 0;
			.img-box{
				height: 100%;
				width: 100%;
			}
		}
		.refresh-box{
			position: fixed;
			top: 46rpx;
			right: 46rpx;
			z-index: 99;
			.box-child{
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 24rpx;
				color: #fff;
				.refresh-img{
					width: 40rpx;
					height: 40rpx;
				}
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
			.title-box{
				display: flex;
				flex-direction: column;
				align-items: center;
				.title{
					font-weight: 900;
					font-size: 72rpx;
					color: #fff;
				}
				.title-child{
					font-size: 30rpx;
					color: #fff;
					margin-top: 40rpx;
				}
			}
			.shareContent-box{
				display: flex;
				justify-content: center;
				margin-top: 94rpx;
				position: relative;
				.content-img{
					width: 604rpx;
					height: 860rpx;
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
						width: 140rpx;
						height: 140rpx;
						border-radius: 70rpx;
						margin-top: -70rpx;
					}
					.user-name{
						font-size: 28rpx;
						color: #333;
						margin-top: 30rpx;
					}
					.share-num{
						color: #0077FF;
						font-size: 100rpx;
						font-weight: bold;
						margin-top: 8rpx;
						line-height: 140rpx;
						font-family: Arial;
					}
					.share-btn{
						display: flex;
						align-items: center;
						justify-content: center;
						margin-top: 10rpx;
						margin-bottom: 20rpx;
						.btn-child{
							color: #fff;
							font-size: 30rpx;
							width: 160rpx;
							height: 60rpx;
							background-color: #83B2F7;
							border-radius: 4rpx;
							text-align: center;
							line-height: 60rpx;
						}
					}
					.share-tip{
						font-size: 24rpx;
						color: #777;
						margin-top: 32rpx;
					}
					.code-img{
						width: 200rpx;
						height: 200rpx;
					}
					.scan-box{
						color: #777;
						font-size: 24rpx;
						margin: 12rpx 0;
					}
					.share-tap{
						color: #fff;
						font-size: 30rpx;
						width: 160rpx;
						height: 60rpx;
						background-color: #83B2F7;
						border-radius: 4rpx;
						text-align: center;
						line-height: 60rpx;
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
</style>
