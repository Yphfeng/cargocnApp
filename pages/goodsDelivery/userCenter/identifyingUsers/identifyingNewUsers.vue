<template>
	<view class="container">
		<!-- <idUp></idUp> -->
		<view class="title">上传身份证（必填）</view>
		<view class="pic">
			<view class="front item" @click="showPopup(0)">
				<view class="red">*</view>
				<image :src="params.frontUrl ? params.frontUrl : defaultFrontUrl" class="picFront"></image>
				<view class="picAdd" v-if="!params.frontUrl">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png" class="addImage"></image>
					<text class="text">上传身份证主页</text>
				</view>
				
			</view>
			<view class="back item" @click="showPopup(1)">
				<view class="red">*</view>
				<image :src="params.backUrl ? params.backUrl : defaultBackUrl" class="picFront"></image>
				<view class="picAdd" v-if="!params.backUrl">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png" class="addImage"></image>
					<text class="text">上传身份证国徽页</text>
				</view>
			
			</view>
		</view>
		<view class="bottom">
			<view class="send" :class="{active: isSetAll}" @click="send">提交</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="alertUp" v-if="type == 'front'">
				<view class="alertTitle">请按照示例上传</view>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/exp_id_1.png" class="exp_id_1"></image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/exp_id_2.png" class="exp_id_2"></image>
				<view class="photo-content">
					为了使用身份认证的相关功能或服务，您需上传身份证证照，点击拍照会调起手机拍照权限，点击从手机相册选择会访问您的相册权限
				</view>
				<view class="optAlertItem">
					<view class="alertItem" @click="sendPhotoPower">拍照</view>
					<view class="alertLine" />
					<view class="alertItem" @click="chooseFromPhoto">从手机相册选择</view>
					<view class="alertLine cancel" />
					<view class="alertItem" @click="cancel">取消</view>
				</view>
			
			</view>
			<view class="alertUp" v-else>
				<view class="alertTitle">请按照示例上传</view>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/id_back_1.png" class="exp_id_1"></image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/id_back_2.png" class="exp_id_2"></image>
				<view class="photo-content">
					为了使用身份认证的相关功能或服务，您需上传身份证证照，点击拍照会调起手机拍照权限，点击从手机相册选择会访问您的相册权限
				</view>
				<view class="optAlertItem">
					<view class="alertItem" @click="sendPhotoPower">拍照</view>
					<view class="alertLine" />
					<view class="alertItem" @click="chooseFromPhoto">从手机相册选择</view>
					<view class="alertLine cancel" />
					<view class="alertItem" @click="cancel">取消</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="backPopup2" type="center">
		    <view class="backPopup1">
		      <view class="backTitle1">提示</view>
		      <view class="cont1">退出后，您上传的资料将清除，需要重新上传!</view>
		      <view class="optbtn1">
		        <view class="cancel1 opt1" @click="confirmBack2">退出</view>
		         <view class="confirm1 opt1" @click="cancelBack2">继续认证</view>
		      </view>
		    </view>
		</uni-popup>
	</view>
</template>

<script>
	var PhotoModule = uni.requireNativePlugin("PhotoModule");
	var platform = uni.getSystemInfoSync().platform;
	
	import * as ship from '@/utils/ship';
	import * as commonUtils from "@/utils/utils"
	export default {
	
		data() {
			return {
				isClick: false,
				type: 'front',
				defaultFrontUrl: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/idCard.png',
				defaultBackUrl: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/idbackCard.png',
				params: {
					frontUrl: '',
					backUrl: '',
				}
			}
		},
		onLoad(options) {
			console.log("options")
			this.isClick = false;
			var type = options.type;
			this.type =  type;
			if (type == "edit") {
				//编辑身份证信息
				this.init();
			}
		},
		computed: {
			isSetAll() {
				var frontUrl = this.params.frontUrl;
				var backUrl = this.params.backUrl;
				if (frontUrl && backUrl) return true;
				return false
			}
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				var frontUrl = this.params.frontUrl;
				var backUrl = this.params.backUrl;
				if (frontUrl || backUrl) {
					this.$refs.backPopup2.open();
				} else {
					uni.navigateBack({
						delta: 1
					})
				};
				return true;
			}
		},
		methods: {
			init() {
				let that = this;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				userInfo = JSON.parse(userInfo);
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					var userCode = userInfo.attrs.userCode;
				} else {
					var userCode = userInfo.attrs.userCode
				}
				
				// console.log('用户详细信息参数', params);
				ship.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
				.then(res=>{
					console.log('用户详细信息', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						this.params.frontUrl = res.rspBody.idFrontImg;
						this.params.backUrl = res.rspBody.idBackImg;
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
				
			},
			showPopup(index) {
				var that = this;
				if (index == 0) {
					this.type = "front"
				} else {
					this.type = "back"
				}
				
				this.$nextTick(function(){
					that.$refs.popup.open();
				})
				
				
			},
			cancel() {
				this.$refs.popup.close();
			},
			sendPhotoPower() {
				let that = this;
				commonUtils.caramePower(() => {
					console.log("执行")
					that.sendPhoto();
				})
			},
			sendPhoto() {
				var that = this;
				var platform = uni.getSystemInfoSync().platform;
				this.$refs.popup.close();
				var type = this.type;
				if (platform == "android" && plus.navigator.checkPermission('android.permission.CAMERA') === 'undetermined' && plus.navigator.checkPermission('android.permission.READ_EXTERNAL_STORAGE') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '同意将申请您的相机权限,用于您拍照识别',
						success: function(res) {
							if (res.confirm) {
								PhotoModule.sendForCarema({
									type: type
								}, rest => {
									//获取图片后上传阿里云
									uni.showLoading({
										title: '上传中...'
									})
									ship.upLoadFile("/file/upload", rest.uri)
									.then(res => {
										uni.hideLoading();
										if (res.retCode == "0000000") {
											uni.showToast({
												title: "上传成功",
												icon: 'none'
											})
											if (type == "front") {
												that.params.frontUrl = res.rspBody[0].url
											} else {
												that.params.backUrl = res.rspBody[0].url
											}
										} else {
											uni.showToast({
												title: res.retDesc,
												icon: 'none'
											})
										}
									})
									.catch(err => {
										uni.hideLoading();
									})
									// uni.showToast({
									// 	title: '成功获取图片' +res.uri,
									// 	icon: 'none'
									// })
								})
							}
						}
					})
					
				} else {
					uni.chooseImage({
					  	count: 1,
					    sizeType: ['compressed'],
					    sourceType: ['camera'], //这要注意，camera掉拍照，album是打开手机相册
					    success: (rest)=> {
							var tempFiles = rest.tempFiles;
							var size = tempFiles[0].size;
							if (size - 1024*1024*2 > 0) {
								uni.showToast({
									title:"上传文件过大，请重新上传！",
									icon: 'none'
								})
								return;
							}
							
							const tempFilePaths = rest.tempFilePaths;
							console.log(tempFilePaths, '数据')
							//获取图片后上传阿里云
							uni.showLoading({
								title: '上传中...'
							})
							ship.upLoadFile("/file/upload", tempFilePaths[0])
							.then(res => {
								uni.hideLoading();
								if (res.retCode == "0000000") {
									uni.showToast({
										title: "上传成功",
										icon: 'none'
									})
									if (type == "front") {
										that.params.frontUrl = res.rspBody[0].url
									} else {
										that.params.backUrl = res.rspBody[0].url
									}
								} else {
									uni.showToast({
										title: res.retDesc,
										icon: 'none'
									})
								}
								console.log(res, 'asa');
							})
							.catch(err => {
								uni.hideLoading();
								console.log(err, 'asa1');
							})
					    }
					});
				}
				
			},
			chooseImage1(type) {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'], //这要注意，camera掉拍照，album是打开手机相册
					success: (rest)=> {
						var tempFiles = rest.tempFiles;
						var size = tempFiles[0].size;
						if (size - 1024*1024*2 > 0) {
							uni.showToast({
								title:"上传文件过大，请重新上传！",
								icon: 'none'
							})
							return;
						}
						const tempFilePaths = rest.tempFilePaths;
						console.log(tempFilePaths, '数据')
						//获取图片后上传阿里云
						uni.showLoading({
							title: '上传中...'
						})
						ship.upLoadFile("/file/upload", tempFilePaths[0])
						.then(res => {
							uni.hideLoading();
							if (res.retCode == "0000000") {
								uni.showToast({
									title: "上传成功",
									icon: 'none'
								})
								if (type == "front") {
									that.params.frontUrl = res.rspBody[0].url
								} else {
									that.params.backUrl = res.rspBody[0].url
								}
							} else {
								uni.showToast({
									title: res.retDesc,
									icon: 'none'
								})
							}
							console.log(res, 'asa');
						})
						.catch(err => {
							uni.hideLoading();
							console.log(err, 'asa1');
						})
					}
				});
			},
			chooseFromPhoto() {
				let that = this;
				commonUtils.savePower(() => {
					that.checkFrom();
				})
			},
			checkFrom() {
				//从相册选择
				var that = this;
				this.$refs.popup.close();
				var type = this.type;
				var system = uni.getSystemInfoSync();
				var platform = system.platform;
				if (platform == "ios") {
					this.chooseImage1(type);
					return;
				}
				if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '同意将申请您的存储权限，用于选择您的照片',
						success: function(res) {
							if (res.confirm) {
								
								that.chooseImage1(type);
							}
						}
					})
				} else {
					that.chooseImage1(type);
				}
			},
			confirmBack2 () {
			    this.$refs.backPopup2.close();
			    uni.navigateBack({
			      delta: 1
			    })
			},
			cancelBack2 () {
			     this.$refs.backPopup2.close();
			},
			send() {
				//上传信息
				let that = this;
				if (this.isClick) return;
				this.isClick = true;
				uni.showLoading({
					title: '提交中...'
				})
				var params = this.params;
				if (!params.frontUrl) {
					uni.showToast({
						title: '请上传身份证主页',
						icon: 'none'
					})
					this.isClick = false;
					return;
				}
				if (!params.backUrl) {
					uni.showToast({
						title: '请上传身份证国徽页',
						icon: 'none'
					})
					this.isClick = false;
					return;
				}
				console.log(params, '参数111');
				ship.postRequest("/baidu/ocr/v1/user/front_back?frontUrl=" + params.frontUrl + '&backUrl=' + params.backUrl)
				.then(res => {
					uni.hideLoading();
					
					if (res.retCode == "0000000") {
						if (res.rspBody.userFront.status != 1) {
							this.isClick = false;
							uni.showToast({
								title: '未识别到身份证，请更换',
								icon: 'none'
							})
							return;
						}
						if (res.rspBody.userBack.status != 1) {
							this.isClick = false;
							uni.showToast({
								title: '未识别到身份证，请更换',
								icon: 'none'
							})
							return;
						}
						uni.showToast({
							title: "提交成功",
							icon: 'none'
						})
						var result = res.rspBody;
						
						console.log(result, 'as');
						if (this.type == "edit") {
							uni.navigateTo({
								url: './identifyingUsersEdit?result=' + JSON.stringify(result)
							})
						} else {
							uni.navigateTo({
								url: './identifyingUsers?result=' + JSON.stringify(result) + '&pageFrom=new'
							})
						}
						this.isClick = false;
					} else {
						console.log(res)
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
						this.isClick = false;
					}
				})
				.catch(err => {
					this.isClick = false;
					uni.hideLoading();
					uni.showToast({
						title: err.retDesc,
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		.alertUp {
			width: 508rpx;
			height: 504rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			.alertTitle {
				font-size: 32rpx;
				color: #000000;
				font-weight: 500;
				margin: 24rpx 0 14rpx;
			}
			.photo-content {
				height: 100rpx;
				font-size: 26rpx;
				padding: 20rpx
				
			}
			.exp_id_1 {
				width: 260rpx;
				height: 166rpx;
				margin-bottom: 24rpx;
			}
			.exp_id_2 {
				width: 438rpx;
				height: 106rpx;
			}
		}
		.title {
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
			margin: 100rpx 0 44rpx;
		}
		.pic {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			.item {
				width: 600rpx;
				height: 360rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;
				&.front {
					margin-bottom: 62rpx;
				}
				.red {
					position: absolute;
					top: -30rpx;
					right: 0;
					color: #FF0000;
				}
				.picFront {
					width: 600rpx;
					height: 360rpx;
				}
				.picAdd {
					position: absolute;
					left: 0;
					top: 0;
					width: 600rpx;
					height: 360rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.addImage {
						width: 118rpx;
						height: 118rpx;
						margin-bottom: 16rpx;
					}
					.text {
						font-size: 24rpx;
						color: #333333;
					}
				}
				
			}
		}
		.bottom {
			width: 480rpx;
			height: 90rpx;
			box-sizing: border-box;
			margin-bottom: 138rpx;
			color: #FFFFFF;
			padding-bottom: 0;  
			padding-bottom: constant(safe-area-inset-bottom);  
			padding-bottom: env(safe-area-inset-bottom); 
			.send {
				height: 90rpx;
				width: 480rpx;
				background-color: rgba(151, 181, 255, 1);
				border-radius: 24rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				&.active {
					background-color: rgba(82, 131, 255, 1);
				}
			}
		}
	}
	.optAlertItem {
		z-index: 9999;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 100vw;
	  background-color: #FFFFFF;
	  border-radius: 23rpx 24rpx 0 0;
	  padding-bottom: 0;
	  padding-bottom: constant(safe-area-inset-bottom);
	  padding-bottom: env(safe-area-inset-bottom);
	  .alertLine {
	    height: 2rpx;
	    background-color: #EDEDED;
	    width: 100vw;
	    &.cancel {
	      height: 12rpx;
	      background-color: #F8F8F8;
	    }
	  }
	  .alertItem {
	    width          : 100vw;
	    height         : 110rpx;
	    display        : flex;
	    justify-content: center;
	    align-items    : center;
	    color          : #333333;
	    font-size      : 32rpx;
	    font-weight    : 500;
	  }
	
	}
	.backPopup1 {
	    width: 618rpx;
	    height: 416rpx;
	    padding-bottom: 48rpx;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    border-radius: 24rpx;
	    background-color: #FFFFFF;
	    box-sizing: border-box;
	    .backTitle1 {
	      font-weight: 500;
	      color: #000000;
	      font-size: 44rpx;
	      padding-top: 48rpx; 
	      text-align: center;
	    }
	    .cont1 {
	      width: 424rpx;
	      flex: 1;
	      display: flex;
	      justify-content: center;
	      align-items: center;
	      text-align: center;
	      font-size: 36rpx;
	      color: #000000;      
	    }
	    .optbtn1 {
	      border-top: 1px solid #F1F1F1;
	      display: flex;
	      flex-direction: row;
	      height: 80rpx;
	      .opt1 {
	        flex: 1;
	        font-size: 32rpx;
	        display: flex;
	        justify-content: center;
	        align-items: center;
	        border-radius: 16rpx;
	        font-weight: 500;
	        &.confirm1 {
	          color: #ffffff;
	          width: 270rpx;
	          background-color: rgba(252, 92, 6, 1);
	          margin-left: 44rpx;
	        }
	        &.cancel1 {
	          width: 208rpx;
	          background-color: rgba(200, 200, 200, 1);
	          color: #ffffff;
	          border-right: 1px solid #F1F1F1;
	        }
	      }
	    }
	    
	}
</style>
