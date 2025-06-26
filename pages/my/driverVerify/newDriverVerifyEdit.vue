<template>
	<view class="newDriverVerify">
		<view class="unauthorizedBox" v-if="certified == 1">
			<view class="mainTitle">上传驾驶证（必填）</view>
			<view class="upLoadContent">
				<view class="upLoadBtn driverLicenseFont" v-if="!params.licenseMainImg" @click="showPopup('blF')">
					<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传驾驶证主页</view>
				</view>
				<image class="upLoadBtn" v-else @click="showPopup('blF')" :src="params.licenseMainImg"></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn driverLicenseBack" @click="showPopup('blB')" v-if="!params.licenseSubImg">
					<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传驾驶证副页</view>
				</view>
				<image class="upLoadBtn" v-else @click="showPopup('blB')" :src="params.licenseSubImg"></image>
			</view>
			<view class="submitBtn" @click="toSubmit()">提交</view>
		</view>
		
		<view class="certified" v-if="certified == 2">
			<view class="licenseImageBox">
				<view class="aduitBox" v-if="driverVerifyInfo">
					<view class="auditMsg">未认证原因：{{driverVerifyInfo}}</view>
				</view>
				<view class="title">
					认证状态
					<image v-if="driverStatus" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/success.png" class="successIcon"></image>
				</view>
				<view class="imageGroup">
					
					<image :src="stepParams.licenseMainImg" class="img" @click="faceSelect(3)"></image>
				
					<image :src="stepParams.licenseSubImg" class="img" @click="faceSelect(4)"></image>
					
				</view>
				<view class="subTitle">驾驶证</view>
			</view>
			<view class="detailsList">
				<view class="certificationDetails">
					<view class="subTitle">姓名</view>
					<input class="detailsMsg"  :disabled="true" v-model="stepParams.userName" placeholder-style="color: #66666" placeholder="请输入姓名" />
				</view>
				<view class="certificationDetails">
					<view class="subTitle">驾驶证号</view>
					<input class="detailsMsg" :disabled="!isEdit" v-model="stepParams.licenseId" placeholder-style="color: #66666" placeholder="请输入驾驶证号" />
				</view>
				<view class="certificationDetails">
					<view class="subTitle">准驾车型</view>
					<input class="detailsMsg" :disabled="!isEdit" v-model="stepParams.permitType" placeholder-style="color: #66666" placeholder="请输入准驾车型" />
				</view>
				<view class="certificationDetails">
					<view class="subTitle">有效期起</view>
					<uni-datetime-picker
						type="date"
						:disabled="!isEdit"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择有效期起'"
						v-model="stepParams.validFrom"
						@change="changeValidFromDate"
						style="text-align: right;color:#666666;font-size: 24rpx;"
					/>
					<!-- <view class="detailsMsg">{{stepParams.validFrom}}</view> -->
				</view>
				<view class="certificationDetails">
					<view class="subTitle">有效期止</view>
					<uni-datetime-picker
						type="date"
						:disabled="!isEdit"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择有效期止'"
						v-model="stepParams.validTo"
						@change="changeValidToDate"
						style="text-align: right;color:#666666;font-size: 24rpx;"
					/>
					<!-- <view class="detailsMsg">{{stepParams.validTo}}</view> -->
				</view>
			</view>
			<view class="submitBtn" @click="toConfirm()">{{driverStatus && !isEdit ? '编辑' : '保存'}}</view>
		</view>
		
		<!-- 拍照弹窗 -->
		<uni-popup ref="takePicturePopup" type="center">
			<view class="picturePopupBox">
				<view class="popupTitle">请按照示例上传</view>
				<image class="upLoadSampleTrue" src="../../../static/images/newDriverVerify/dlSampleT.png"></image>
				<image class="upLoadSampleFalse" src="../../../static/images/newDriverVerify/dlSampleF.png"></image>
				<view class="popupBtn" @click="sendPhoto">拍照</view>
				<view class="popupBtn" @click="chooseFromAlb">从手机相册选择</view>
				<view class="popupBtn" @click="closePicturePopup()">取消</view>
			</view>
		</uni-popup>
		
		<!--返回提示-->
		<uni-popup ref="backPopup" type="center">
			<view class="backPopup">
				<view class="cont">您还没有保存，是否退出</view>
				<view class="optbtn">
					<view class="cancel opt" @click="cancelBack">取消</view>
					<view class="confirm opt" @click="confirmBack">确定</view>
				</view>
			</view>
		</uni-popup>
		
		
		<!-- 拍照弹窗 -->
		<uni-popup ref="simpleTakePicturePopup" type="center">
			<view class="picturePopupBox">
				<view class="popupTitle">请按照示例上传</view>
				<image class="upLoadSampleTrue" src="../../../static/images/newDriverVerify/dlSampleT.png"></image>
				<image class="upLoadSampleFalse" src="../../../static/images/newDriverVerify/dlSampleF.png"></image>
				<view class="popupBtn" @click="sendPhoto1">拍照</view>
				<view class="popupBtn" @click="chooseFromAlb1">从手机相册选择</view>
				<view class="popupBtn" @click="closePicturePopup1()">取消</view>
			</view>
		</uni-popup>
		
		<!-- 保存弹窗 -->
		<uni-popup ref="confirmPopup" type="center">
			<view class="popupConfirmBox">
				<view class="content">是否保存驾驶证证信息</view>
				<view class="btnGroup">
					<view class="btn" @click="closeConfirmPopup()">取消</view>
					<view class="btn" @click="saveInfo">保存</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	var PhotoModule = uni.requireNativePlugin("PhotoModule");
	var platform = uni.getSystemInfoSync().platform;
	import * as ship from "@/utils/ship";
	export default {
		data() {
			return {
				certified: 0, // 1未认证、2已认证
				upLoadType: '', // blF驾驶证主页、blB驾驶证副页
				defaultMainImg: "",
				params: {
					licenseMainImg: '',
					licenseSubImg: '',
				},
				driverStatus: 0,
				driverVerifyInfo: '',
				isEdit: true,
				stepParams: {
					licenseMainImg: '',
					licenseSubImg: '',
					userName: '',
					licenseId: '',
					permitType: '',
					validFrom: '',
					validTo: ''
					
				},
				
			};
		},
		onLoad(options) {
			// 未认证this.certified = 1;已认证this.certified = 2;认证状态在storage的userInfo里取
			var result = options.result;
			if (result) {
				result = JSON.parse(result);
				this.params.licenseMainImg = result.licenseMainImg;
				this.params.licenseSubImg = result.licenseSubImg;
				this.defaultMainImg = result.licenseMainImg;
				this.stepParams = {
					...result
				}
				this.certified = 1;
			}
		},
		onBackPress(e) {
			if (e.from == "backbutton") {
				if (this.driverStatus && this.isEdit) {
					this.$refs.backPopup.open();
					return true;
				}
				
			}
		},
		methods: {
			cancelBack() {
				this.$refs.backPopup.close()
			},
			confirmBack() {
				this.$refs.backPopup.close();
				uni.navigateBack({
					delta: 1
				})
			},
			async toSubmit() {
				//驾驶证主页ocr
				let that = this;
				var image = that.params.licenseMainImg;
				var subImage = that.params.licenseSubImg;
				if (!image) {
					uni.showToast({
						title: '请上传驾驶证主页',
						icon: 'none'
					})
					return;
				}
				if (!subImage) {
					uni.showToast({
						title: '请上传驾驶证副页',
						icon: 'none'
					})
					return;
				}
				uni.showLoading();
				try{
					console.log(image, '主页驾驶证');
					if (this.defaultMainImg == image) {
						var res = await ship.postRequest("/baidu/ocr/v1/driver/front?url=" + image)
					} else {
						var res = await ship.upLoadFile("/baidu/ocr/v1/driver/front", image);
					}
					
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var body = res.rspBody;
						
						//驾驶证主页
						that.stepParams.licenseMainImg = body.image;
						that.stepParams.licenseSubImg = that.params.licenseSubImg;
						
						that.stepParams.licenseId = body.idNo;
						that.stepParams.permitType = body.permitType;
						that.stepParams.issuingOrganizations = body.issuingOrganizations;
						that.stepParams.userName = body.name;
						
						var validFrom = body.validFrom;
						var validTo = body.validTo;
						
						var isRecognize1 = that.hanleCheckDate(validFrom);
						if (isRecognize1) {
							that.stepParams.validFrom = body.validFrom;
						} else {
							that.stepParams.validFrom = "";
						}
						var isRecognize2 = that.hanleCheckDate(validTo);
						if (isRecognize2) {
							that.stepParams.validTo = body.validTo;
						} else {
							that.stepParams.validTo = "";
						}
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.$nextTick(function(){
						that.certified = 2;
					})
				}catch(e){
					//TODO handle the exception
					uni.hideLoading();
					uni.showToast({
						title: '未识别出有效信息，请重试',
						icon: 'none',
					})
				}
			},
			hanleCheckDate(time) {
			    var date = time;
			   if (date != null && date != "") {
			     if (date.length != 10 || date.substr(4, 1) != "-"
			         || date.substr(7, 1) != "-") {
			       return false;
			     } 
			     var result = date
			         .match(/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig);
			     if (result == null || result == "") {
			       return false;
			     }else{
			        return true;
			     }
			   }else{
			     return false;
			   }
			},
			showPopup(type) {
				console.log(type, 'a');
				
				if (this.driverStatus && !this.isEdit) {
					return;
				};
				this.upLoadType = type;
				this.$refs.takePicturePopup.open();
			},
			closePicturePopup() {
				this.$refs.takePicturePopup.close();
			},
			closePicturePopup1() {
				this.$refs.simpleTakePicturePopup.close();
			},
			toConfirm() {
				if (this.driverStatus && !this.isEdit) {
					this.isEdit = true;
					return;
				}
				this.$refs.confirmPopup.open();
			},
			closeConfirmPopup() {
				this.$refs.confirmPopup.close();
			},
			sendPhoto1() {
				//打开相机
				var that = this;
				this.$refs.simpleTakePicturePopup.close();
				var type = this.upLoadType;
				if (platform == "android") {
					PhotoModule.sendForCarema({
						type: type
					}, rest => {
						//副页获取图片后上传阿里云
						if (type == "blB") {
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
								
									that.stepParams.licenseSubImg = res.rspBody[0].url
									
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
						} else {
							that.shipOcrUpfile(rest.uri)
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
							console.log(rest, '数据', tempFilePaths[0])
							//获取图片后上传阿里云
							
							if (type == "blB") {
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
										
										that.stepParams.licenseSubImg = res.rspBody[0].url
										
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
							} else {
								that.shipOcrUpfile(tempFilePaths[0])
							}
							
					    }
					});
				}
			},
			sendPhoto() {
				//打开相机
				var that = this;
				this.$refs.takePicturePopup.close();
				var type = this.upLoadType;
				if (platform == "android") {
					PhotoModule.sendForCarema({
						type: type
					}, rest => {
						//获取图片后上传阿里云
						if (type == "blB") {
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
								
									that.params.licenseSubImg = res.rspBody[0].url
									
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
						} else {
							that.params.licenseMainImg = rest.uri
						}
						
						// uni.showToast({
						// 	title: '成功获取图片' +res.uri,
						// 	icon: 'none'
						// })
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
							console.log(rest, '数据', tempFilePaths[0])
							//获取图片后上传阿里云
							
							if (type == "blB") {
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
										
										that.params.licenseSubImg = res.rspBody[0].url
										
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
							} else {
								that.params.licenseMainImg = tempFilePaths[0]
							}
							
					    }
					});
				}
			},
			chooseFromAlb1() {
				//从相册选择
				var that = this;
				this.$refs.simpleTakePicturePopup.close();
				var type = this.upLoadType;
				 
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
						
						if (type == "blB") {
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
									that.stepParams.licenseSubImg = res.rspBody[0].url
									
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
						} else {
							that.shipOcrUpfile(tempFilePaths[0])
						}
						
					}
				});
				
			},
			chooseFromAlb() {
				//从相册选择
				var that = this;
				this.$refs.takePicturePopup.close();
				var type = this.upLoadType;
				 
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
						
						if (type == "blB") {
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
									that.params.licenseSubImg = res.rspBody[0].url
									
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
						} else {
							that.params.licenseMainImg = tempFilePaths[0]
						}
						
					}
				});
				
			},
			saveInfo() {
				var that = this;
				that.$refs.confirmPopup.close();		
				if (!that.stepParams.licenseMainImg) {
					uni.showToast({
						title: '驾驶证正面为空',
						icon: 'none'
					})
					return;
				}
				if (!that.stepParams.licenseSubImg) {
					uni.showToast({
						title: '驾驶证副页为空',
						icon: 'none'
					})
					return;
				}
				if (!that.stepParams.licenseId) {
					uni.showToast({
						title: '驾驶证号为空',
						icon: 'none'
					})
					return;
				}
				if (!that.stepParams.userName) {
					uni.showToast({
						title: '姓名为空',
						icon: 'none'
					})
					return;
				}
					
				uni.showLoading();
				console.log('驾驶证认证信息', that.stepParams);
				ship.postRequest("/yh/driver/driving/licence/upload", that.stepParams).then(function(res) {
					console.log(res);
					uni.hideLoading();
					if (res.retCode == '0000000') {
						uni.showToast({
							title: '驾驶证认证成功',
							icon: 'success'
						})
						var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
						userInfo.attrs.driverVerify = 1;
						uni.setStorageSync("userInfo", JSON.stringify(userInfo));
						that.getUserInfo();
						if (userInfo.attrs.vehicleVerify !== 1) {
							setTimeout(() => {
								uni.navigateTo({
									url: '../carVerify/newCarVerify'
								})
							}, 1000)
						} else {
							setTimeout(() => {
								uni.switchTab({
									url: '../index/index'
								})
							}, 1000)
						}
					} else {
						uni.showModal({
							title: '提示',
							content: res.retDesc,
							showCancel: false
						})
					}
				})
			},
			getUserInfo() {
				let that = this;
				var userInfo = uni.getStorageSync('userInfo');
				console.log('个人信息缓存', userInfo)
				if (!userInfo) {
					return
				}
				this.stepParams.userCode = JSON.parse(userInfo).attrs.userCode;
				
				ship.postRequest("/yh/driver/get/detail")
				.then(res=>{
					console.log('驾驶证信息', res)
					if(res.retCode == '0000000'){
						if (res.rspBody) {
							this.certified = res.rspBody.licenseId ? 2 : 1;
							
							if (res.rspBody.licenseMainImg) {
								this.stepParams.licenseMainImg = res.rspBody.licenseMainImg;
							}
							if (res.rspBody.licenseSubImg) {
								this.stepParams.licenseSubImg = res.rspBody.licenseSubImg;
							}
							this.stepParams.userName = res.rspBody.userName;
							this.stepParams.licenseId = res.rspBody.licenseId;
							this.stepParams.permitType = res.rspBody.permitType;
							this.stepParams.issuingOrganizations = res.rspBody.issuingOrganizations;
						
							var validFrom = res.rspBody.validFrom;
							var validTo = res.rspBody.validTo;
							
							var isRecognize1 = that.hanleCheckDate(validFrom);
							if (isRecognize1) {
								that.stepParams.validFrom = res.rspBody.validFrom;
							} else {
								that.stepParams.validFrom = "";
							}
							var isRecognize2 = that.hanleCheckDate(validTo);
							if (isRecognize2) {
								that.stepParams.validTo = res.rspBody.validTo;
							} else {
								that.stepParams.validTo = "";
							}
							console.log(validFrom, validTo, '1轻武器');
							
							
							//认证状态
							var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
							userInfo.attrs.driverVerify = res.rspBody.driverVerify;
							this.driverStatus = res.rspBody.driverVerify;
							this.isEdit = res.rspBody.driverVerify ? false : true;
							uni.setStorageSync("userInfo", JSON.stringify(userInfo));
							if (res.rspBody.driverVerify != 1) {
								this.driverVerifyInfo = res.rspBody.driverVerifyInfo
							} else {
								this.driverVerifyInfo = ""
							}
						} else {
							//未认证
							this.certified = 1;
						}
						this.$forceUpdate();
					} else{
						uni.showToast({
						  title: res.retDesc,
						  icon: 'none'
						})
					}
				})
				.catch(err => {
					console.log(err, 'aaa')
				})
			},
			faceSelect(flag) {
				var that = this;
				if (that.driverStatus && !this.isEdit) {
					//预览
					var urlArr = [];
					if (flag == 3) {
						urlArr.push(that.stepParams.licenseMainImg)
					} else {
						urlArr.push(that.stepParams.licenseSubImg)
					}
					uni.previewImage({
						current: 1, //预览图片的下标
						urls: urlArr //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
					})
					return;
				};
				if (flag == 3) {
					this.upLoadType = "blF";
				} else {
					this.upLoadType = "blB";
				}
				this.$refs.simpleTakePicturePopup.open();
				
				// uni.chooseImage({
				// 	count: 1, // 默认9  
				// 	sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
				// 	sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
				// 	success: function(res) {
				// 		console.log(res, '驾驶证')
				// 		// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
				// 		var tempFilePaths = res.tempFilePaths
				// 		if (flag == 3) {
				// 			that.shipOcrUpfile(tempFilePaths[0])
				// 		} else {
				// 			that.uploadIdcard(tempFilePaths[0], flag);
				// 		}
						
				// 	},
				// 	fail: function(err) {
				// 		console.log(err, 'asd')
				// 	}
				// })
			},
			shipOcrUpfile(image) {
				//驾驶证主页ocr百度识别
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/baidu/ocr/v1/driver/front", image)
				.then(res => {
					uni.hideLoading();
					console.log('驾驶证识别信息', res)
					if (res.retCode == "0000000") {
						var body = res.rspBody;
						
						//驾驶证主页
						this.stepParams.licenseMainImg = body.image;
						
						this.stepParams.licenseId = body.idNo;
						this.stepParams.permitType = body.permitType;
						this.stepParams.issuingOrganizations = body.issuingOrganizations;
						this.stepParams.userName = body.name;
						
						var validFrom = body.validFrom;
						var validTo = body.validTo;
						var isRecognize1 = this.hanleCheckDate(validFrom);
						if (isRecognize1) {
							this.stepParams.validFrom = body.validFrom;
						} else {
							this.stepParams.validFrom = "";
						}
						var isRecognize2 = this.hanleCheckDate(validTo);
						if (isRecognize2) {
							this.stepParams.validTo = body.validTo;
						} else {
							this.stepParams.validTo = "";
						}
						this.$forceUpdate();
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					
				}).catch(err => {
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						title: '未识别出有效信息，请重试',
						icon: 'none',
					})
				})
			},
			uploadIdcard: function(image, flag) {
				var that = this;
				var params = new Object();
				
				var url = '/file/upload'; 
				
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile(url, image, params)
				.then(res => {
					uni.hideLoading();
					console.log('驾驶证识别信息', res)
					if (res.retCode == "0000000") {
						var body = res.rspBody;
						this.stepParams.licenseSubImg =  body.url
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					
				}).catch(err => {
					console.log(err)
					uni.hideLoading();
					uni.showToast({
						title: '未识别出有效信息，请重试',
						icon: 'none',
					})
				})
			},
			changeValidFromDate(e) {
				this.stepParams.validFrom = e;
				console.log("选择的有效期:", e);
			},
			changeValidToDate(e) {
				this.stepParams.validTo = e;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F8F8;
	}
	.newDriverVerify {
		.backPopup {
			width: 480rpx;
			height: 282rpx;
			display: flex;
			flex-direction: column;
			background-color: #FFFFFF;
			.cont {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				font-weight: 500;
				
			}
			.optbtn {
				border-top: 1px solid #F1F1F1;
				display: flex;
				flex-direction: row;
				height: 90rpx;
				.opt {
					flex: 1;
					font-size: 28rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					&.confirm {
						color: #B2B2B2;
					}
					&.cancel {
						color: #4EADF1;
						border-right: 1px solid #F1F1F1;
					}
				}
			}
			
		}
		.aduitBox {
			display: flex;
			justify-content: center;
			padding: 12rpx 36rpx 20rpx 36rpx;
			.auditMsg {
				padding: 8rpx 26rpx;
				background-color: rgba(235, 100, 100, 1);
				box-shadow: 0 0 14rpx 4rpx rgba(235, 100, 100, 0.63);
				font-size: 22rpx;
				color: #FFFFFF;
				border-radius: 48rpx;
			}
		}
		.uni-icons {
			display: none !important;
		}
		.uni-date-x {
			padding: 0 !important;
		}
		.uni-date__x-input {
			height: 56rpx !important;
			line-height: 56rpx !important;
			padding: 0 !important;
			font-size: 24rpx !important;
			font-weight: 400;
		}
	
		.uni-date-editor--x__disabled {
			opacity: 1;
		}
		.input-placeholder {
			font-size: 28rpx !important;
			color: #666666 !important;
		}
		.uni-input-input {
			color:#666666;
		}
		.unauthorizedBox {
			min-height: 100vh;
			box-sizing: border-box;
			padding-top: 80rpx;
			background-color: #FFF;
			.mainTitle {
				height: 44rpx;
				line-height: 44rpx;
				font-size: 32rpx;
				font-weight: 600;
				color: #333333;
				text-align: center;
			}
			.upLoadContent {
				width: 600rpx;
				height: 360rpx;
				border-radius: 10rpx;
				margin: 50rpx auto 0 auto;
				.driverLicenseFont {
					background-image: url('../../../static/images/newDriverVerify/driverLicenseFont.png');
				}
				.driverLicenseBack {
					background-image: url('../../../static/images/newDriverVerify/driverLicenseBack.png');
				}
				.upLoadBtn {
					width: 600rpx;
					height: 360rpx;
					background-repeat: no-repeat;
					background-size: 100%;
					box-sizing: border-box;
					padding-top: 96rpx;
					.upLoadIcon {
						width: 118rpx;
						height: 118rpx;
						display: block;
						margin:0 auto 16rpx auto;
					}
					.upLoadText {
						height: 34rpx;
						line-height: 34rpx;
						font-size: 24rpx;
						color: #333333;
						text-align: center;
					}
				}
			}
		}
		.certified {
			.licenseImageBox {
				padding: 16rpx 0;
				background-color: #FFF;
				.title {
					height: 44rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
					padding-left: 36rpx;
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
				}
				.successIcon {
					width: 28rpx;
					height: 28rpx;
					margin-left: 8rpx;
				}
				.subTitle {
					height: 40rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
					text-align: right;
					padding-right: 50rpx;
				}
				.imageGroup {
					padding: 24rpx 50rpx 18rpx 50rpx;
					display: flex;
					justify-content: space-between;
					.img {
						width: 308rpx;
						height: 180rpx;
						border-radius: 4rpx;
					}
				}
			}
			.detailsList {
				background-color: #FFF;
				padding-bottom: 20rpx;
				margin-top: 12rpx;
				.certificationDetails + .certificationDetails {
					border-top: 2rpx solid #F0F0F0;
				}
				.certificationDetails {
					margin: 0 0 0 36rpx;
					padding: 26rpx 58rpx 26rpx 10rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.subTitle {
						font-size: 28rpx;
						color: #333333;
						line-height: 33rpx;
						flex-shrink: 0;
					}
					.detailsMsg {
						flex: 1;
						text-align: right;
						font-size: 24rpx;
						font-weight: 400;
						color: #666666;
					}
				}
			}
		}
		.submitBtn {
			position: fixed;
			left: 135rpx;
			bottom: 74rpx;
			width: 480rpx;
			height: 90rpx;
			line-height: 90rpx;
			background: #4EADF1;
			border-radius: 24rpx;
			text-align: center;
			font-size: 28rpx;
			color:#FFF;
		}
		.picturePopupBox {
			background-color: #FFF;
			width: 508rpx;
			padding: 42rpx 0 0 0;
			box-sizing: border-box;
			.popupTitle {
				height: 44rpx;
				line-height: 44rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #000000;
				text-align: center;
			}
			.upLoadSampleTrue {
				width: 260rpx;
				height: 166rpx;
				display: block;
				margin: 14rpx auto 26rpx auto;
			}
			.upLoadSampleFalse {
				width: 438rpx;
				height: 104rpx;
				display: block;
				margin: 0 auto 4rpx auto;
			}
			.popupBtn + .popupBtn {
				border-top: 1rpx solid #DFDFDF;
			}
			.popupBtn {
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #4EADF1;
				text-align: center;
				padding: 18rpx 0;
			}
		}
		.popupConfirmBox {
			width: 480rpx;
			background-color: #FFF;
			.content {
				padding: 82rpx 0 70rpx 0;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				text-align: center;
			}
			.btnGroup {
				display: flex;
				border-top: 2rpx solid #F1F1F1;
				.btn + .btn {
					border-left: 2rpx solid #F1F1F1;
				}
				.btn {
					flex: 0 0 50%;
					padding: 22rpx 0 28rpx 0;
					font-size: 28rpx;
					color: #4EADF1;
					line-height: 33rpx;
					text-align: center;
				}
			}
		}
	}
</style>
