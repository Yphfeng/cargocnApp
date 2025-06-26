<template>
	<view class="identifyingUsers">
		<view v-show="pageStep != 3" class="certificationStatus">
			<view class="statusBox" :class="activity == 1 ? 'statusCss2' : 'statusCss3'" >
				<text class="statusMsg" style="color:#FFF;">身份证验证</text>
				<!-- <image class="statusIcon" :src="activity == 1 ? statusIcon1 : statusIcon2"></image> -->
			</view>
			<view class="line-left" :class="activity == 1 ? 'lineLeftStatusCss2' : 'lineLeftStatusCss3'"></view>
			<view class="line-right" :class="activity == 1 ? 'lineRightStatusCss1' : activity == 2 ? 'lineRightStatusCss2' : 'lineRightStatusCss3'"></view>
			<view class="statusBox" :class="activity == 1 ? 'statusCss1' : activity == 2 ? 'statusCss2' : 'statusCss3'">
				<text class="statusMsg" style="color:#FFF;">人脸验证</text>
			</view>
		</view>
		
		<!-- 第一步 -->
		<view v-show="pageStep == 1" class="step-1">
			<view class="error" v-if="showMsg()">提醒：{{showMsg()}}</view>
			<view class="imageUploadBox">
				<view class="idCardImg" @click='faceSelect(1)' style="background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/idCardFront.png');">
					<image class="img" v-if="faceImageUrl" :src="faceImageUrl"></image>
					<view v-if="!faceImageUrl" class="upLoadHint">上传身份证正面</view>
				</view>
				<view class="idCardImg" @click='faceSelect(2)' style="background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/idCardBack.png');">
					<image class="img" v-if="backImage"  :src="backImage"></image>
					<view v-if="!backImage" class="upLoadHint">上传身份证反面</view>
				</view>
			</view>
			<view  class="line" />
			<view class="inputBox">
				<view class="title">姓名</view>
				<input class="msgInput" :disabled="isEdit2" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="name" />
			</view>
			<view class="inputBox">
				<view class="title">身份证号</view>
				<!--  @click="showKeyBoard()" -->
				<input class="msgInput" :disabled="isEdit2" placeholder-style="font-size:28rpx;color:#C2C2C9" placeholder="请填写" v-model="cardNum"/>
			</view>
			<view class="inputBox">
				<view class="title">身份证地址</view>
				<input class="msgInput" :disabled="true"  placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="address" />
			</view>
			<view class="inputBox">
				<view class="title">有效期</view>
				<input class="msgInput" :disabled="isEdit2" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="date" />
			</view>
			<!-- <view class="inputBox" v-if="isEdit">
				<view class="title">认证状态</view>
				<view>{{showStatus()}}</view>
			</view> -->
		</view>
		
		<!-- 第二步 -->
		<view v-show="pageStep == 2">
			<view class="identifyTitle">
				<image class="identifyLogo" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/identifyLogo.png"></image>
				货运中国+申请使用
			</view>
			<view class="identifyHint">人脸识别验证你的身份信息，</view>
			<view class="identifyHint">请确保为 {{userRole == 1 ? userInfo.userName : userInfo.userName}} 本人操作</view>
		</view>
		
		<!-- 第三步 -->
		<view v-show="pageStep == 3">
			<image class="identifyStatusIcon" :src="identifyStatus ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/identifySuccess.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/identifyError.png'"></image>
			<view class="identifyStatusMsg">{{identifyStatus ? '识别完成' : '您已进行人脸认证，正等待校验返回，请稍后刷新或退出重新登录'}}</view>
		</view>
		
		<!-- 操作按钮 -->
		
		<view v-show="showEditBtn()" class="nextStepBtn" @click="changePageStep()">下一步</view>
		<view class="identifyBtnGroup" v-show="pageStep == 2">
			<view class="agreementBox">
				<view class="agreeBtn" v-show="!isAgree" @click="isAgree = true"></view>
				<image class="agreeBtnIcon" v-show="isAgree" src="../../../../static/images/goodsDelivery/payCheckedIcon.png" @click="isAgree = false"></image>
				<view class="agreeMsg">
					您同意服务提供者及货运中国使用并传送相关数据用于身份核验。
					<text class="agreeDetails" @click="jumpToDigitalCertificate()">数字证书使用协议</text>
				</view>
			</view>
			<view class="startBtn" @click="getFaceUrl()">开始人脸识别验证</view>
		</view>
		<view v-show="pageStep == 3" class="nextStepBtn" @click="backToCenter()">确定</view>
		
		
		<!-- 测试模块 -->
		<!-- <view class="testBtnGroup">
			<view v-show="activity != 3" class="changeStatusBtn" @click="changeStatus(1)">重置</view>
			<view v-show="activity != 3" class="changeStatusBtn" @click="changeStatus(3)">人脸已认证</view>
			
			<view class="changeStatusBtn" @click="identifyStatus = !identifyStatus">改变认证状态</view>
		</view> -->
		
		<!-- 自定义软键盘 -->
		<uni-popup ref="keyboardPopup" type="bottom">
			<view class="keyboardPopupBox">
				<view class="keyCol">
					<view class="keyRow">1</view>
					<view class="keyRow">4</view>
					<view class="keyRow">7</view>
					<view class="keyRow">X</view>
				</view>
				<view class="keyCol">
					<view class="keyRow">2</view>
					<view class="keyRow">5</view>
					<view class="keyRow">8</view>
					<view class="keyRow">0</view>
				</view>
				<view class="keyCol">
					<view class="keyRow">3</view>
					<view class="keyRow">6</view>
					<view class="keyRow">9</view>
					<view class="keyRow"></view>
				</view>
				<view class="keyCol">
					<view class="keyBoardDelete">
						<image class="deleteIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/keyBoardDelete.png"></image>
					</view>
					<view class="keyBoardConfirm">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="backPopup" type="center">
			<view class="backPopup">
				<view class="cont">您还没完成人脸验证，是否退出</view>
				<view class="optbtn">
					<view class="cancel opt" @click="cancelBack">取消</view>
					<view class="confirm opt" @click="confirmBack">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="backPopup1" type="center">
			<view class="backPopup">
				<view class="cont">您还没保存信息，是否退出</view>
				<view class="optbtn">
					<view class="cancel opt" @click="cancelBack1">取消</view>
					<view class="confirm opt" @click="confirmBack1">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="mobilePopup" type="center">
			<view class="mobilePopup">
				<view class="mobile-title">提示</view>
				<view class="cont">当前身份证号已被手机号为{{willUpPhone}}的用户占用</view>
				
				<view class="optItem" @click="switchBack">切换账号</view>
				<view class="optItem" @click="confirmSwitchBack">修改手机号</view>
				<view class="optItem" @click="cancelSwitchBack">取消</view>
			
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="center">
			<view class="alertUp" v-if="photoType == 'front'">
				<view class="alertTitle">请按照示例上传</view>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/exp_id_1.png" class="exp_id_1"></image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/exp_id_2.png" class="exp_id_2"></image>
				<view class="alertItem" @click="sendPhoto">拍照</view>
				<view class="alertItem" @click="checkFrom">从手机相册选择</view>
				<view class="alertItem" @click="cancel">取消</view>
			</view>
			<view class="alertUp" v-else>
				<view class="alertTitle">请按照示例上传</view>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/id_back_1.png" class="exp_id_1"></image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/id_back_2.png" class="exp_id_2"></image>
				<view class="alertItem" @click="sendPhoto">拍照</view>
				<view class="alertItem" @click="checkFrom">从手机相册选择</view>
				<view class="alertItem" @click="cancel">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as service from "@/utils/service";
	import IMService from "@/utils/imservice.js";
	const bdFaceLive = uni.requireNativePlugin('liyahong-BDFace-v4');
	var platForm = uni.getSystemInfoSync().platform;
	var PhotoModule = uni.requireNativePlugin("PhotoModule");
	export default {
		data() {
			return {
				activity: '',
				pageStep: 1,
				statusIcon1: '../../../../static/images/goodsDelivery/certificationStatus2.png',
				statusIcon2: '../../../../static/images/goodsDelivery/certificationStatus1.png',
				name: '',
				cardNum: '',
				address: '',
				date: '',
				dataFrom: '',
				dataTo: '',
				isAgree: false,
				identifyStatus: true,
				isEdit: true,
				faceImageUrl: '',
				backImage: '',
				birthday: '',
				gender: '',
				userInfo: {},
				userRole: '',
				
				webviewStyles: {
				    progress: false
				},
				webUrl: '',
				hasUrl: false,
				hasJump: false,
				userCanEdit: true,
				idStatus: 0,
				identityVerifyInfo: "",
				pageFromNewUsers: false,
				isEdit2: false,
				photoType: 'front',
				willUpPhone: '',
				isClickSave: false,
			};
		},
		onLoad(options) {
			var that = this;
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			this.userRole = uni.getStorageSync('userRole');
			console.log('用户信息', options); 
			var result = options.result;
			if (result) {
				this.pageFromNewUsers = true;
				this.isEdit = false;
				this.activity = 1;
				this.userCanEdit = true;
				var jsonResult = JSON.parse(result);
				this.faceImageUrl = jsonResult.userFront.image;
				this.backImage = jsonResult.userBack.image;
				this.name = jsonResult.userFront.name;
				this.cardNum = jsonResult.userFront.idNo;
				this.address = jsonResult.userFront.addr;
				this.dataFrom = jsonResult.userBack.validFrom;
				this.dataTo = jsonResult.userBack.validTo;
				this.birthday = jsonResult.userFront.birthday;
				this.gender = jsonResult.userFront.gender;
				if(jsonResult.userBack.validFrom && jsonResult.userBack.validTo) {
					that.date = jsonResult.userBack.validFrom + '-' + jsonResult.userBack.validTo;
				}
				
			} else {
				if(this.userRole == 1) {
					var identityVerify = this.userInfo.attrs.identityVerify;
					var thirdTokenUser = this.userInfo;
					if(thirdTokenUser.attrs.faceVerify == 1 && identityVerify == 1) {
						this.identifyStatus = true;
						this.activity = 3;
					}else if(identityVerify == 1) {
						this.activity = 2;
						this.getUserInfo();
					}else if(!identityVerify) {
						this.activity = 1;
						this.userCanEdit = true;
					}
				} else {
					if(this.userInfo.attrs.faceVerify == 1 && this.userInfo.attrs.identityVerify == 1) {
						this.identifyStatus = true;
						this.activity = 3;
					}else if(this.userInfo.attrs.identityVerify == 1 || this.userInfo.attrs.identityVerify == 2) {
						this.activity = 2;
						this.getUserInfo();
					}else if(!this.userInfo.attrs.identityVerify) {
						this.activity = 1;
						this.userCanEdit = true;
					}
				}
				
				this.getIdentifyingDetails();
			}
			
			
			
		},
		watch: {
			date(newval, oldval) {
				var dateArr = newval.split('-');
				this.dataFrom = (dateArr[0] || 1) + '-' + (dateArr[1] || 1) + '-' + (dateArr[2] || 1);
				this.dataTo = (dateArr[3] || 1) + '-' + (dateArr[4] || 1) + '-' + (dateArr[5] || 1);
				console.log(newval, '新的', oldval, this.dataFrom, this.dataTo);
			}
		},
		onBackPress(e) {
			
			if (e.from == 'backbutton') {
				if (this.pageStep == 3) {
					this.pageStep = 2
				} else if (this.pageStep == 2) {
					this.pageStep = 1
				} else {
					uni.navigateBack({
						 delta: 1
					})
				}
				return true
				
			}
		},
		
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getUserInfo();
		},
		methods: {
			cancelBack() {
				this.$refs.backPopup.close()
			},
			confirmBack() {
				this.$refs.backPopup.close();
				var pageFromNewUsers = this.pageFromNewUsers;
				setTimeout(() => {
					uni.navigateBack({
						delta: pageFromNewUsers ? 2 : 1
					})
				}, 1000)
			},
			cancelBack1() {
				this.$refs.backPopup1.close()
			},
			confirmBack1() {
				this.$refs.backPopup1.close();
				uni.navigateBack({
					delta: 1
				})
				
			},
			switchBack() {
				this.$refs.mobilePopup.close()
				//切换账户，跳转登录页面
				this.logout();
				
			},
			logout() {
				var cid = plus.push.getClientInfo().clientid;
				let userInfo = uni.getStorageSync("userInfo");
				var userId = JSON.parse(userInfo).userId;
				utils.postRequest("/xxq/device/exp", {cid: cid, userId: userId}).then(res => {
					console.log(res)
					console.log("设备注销")
				})
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('driverInfo');
				uni.removeStorageSync('token');
				uni.removeStorageSync('driverVerify');	 
				 // uni.clearStorageSync();
				if(that.userRole == 1) {
					//关闭socket
					var app = getApp();
					try{
						app.globalData.consignorSocketTask.close();
						app.globalData.socketTask.close();
					}catch(e){
						//TODO handle the exception
					}	
					uni.reLaunch({
						url: '/pages/login/login/login'
					})
				}else {
					uni.reLaunch({
						url: '/pages/login/login/login'
					})
				}
			},
			confirmSwitchBack() {
				this.$refs.mobilePopup.close();
				// this.changePageStep(1);
				//修改手机号跳转人脸识别
				//开始人脸认证
				var plateForm = uni.getSystemInfoSync().platform;
				if (plateForm == "android") {
					this.updateMobile = true;
					this.scan();
				} else {
					uni.navigateTo({
						url: './face?type=updateMobile'
					})
				}
				
			},
			cancelSwitchBack() {
				this.$refs.mobilePopup.close()
			},
			
			showMsg() {
				var isEdit = this.isEdit;
				var idStatus = this.idStatus;
				var identityVerifyInfo = this.identityVerifyInfo;
				var arr = [];
				if (isEdit) {
					if (idStatus != 1) {
						arr.push("身份证已过期")
					}
					if (identityVerifyInfo) {
						arr.push(identityVerifyInfo)
					}
					return arr.join(",")
				} else {
					return ""
				}
			},
			showStatus() {
				//认证状态
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					if(this.userInfo.attrs.faceVerify == 1 && this.userInfo.attrs.identityVerify == 1) {
						return '已认证';
					} else {
						return '未认证';
					}
					
				} else {
					if(this.userInfo.attrs.faceVerify == 1 && this.userInfo.attrs.identityVerify == 1) {
						return '已认证';
					} else {
						return '未认证';
					}
				}
			},
			showEditBtn() {
				if(this.pageStep == 1) {
					// if(this.userCanEdit) {
					// 	return true;
					// }
					return true;
				}else {
					return false;
				}
			},
			getUserInfo() { // 货主状态 
				let that = this;
				utils.postRequest('/yh/user/get/face/result', {})
				.then(res=>{
					console.log('获取人脸认证url', res);
					if(res.retCode == '0000000') {
						let faceVerify = res.rspBody;
						if(faceVerify) {
							var userRole = uni.getStorageSync("userRole");
							var identityVerify = that.userInfo.attrs.identityVerify;
							if (userRole == 1) {
								that.userInfo.attrs.faceVerify = 1;
								if (identityVerify == 1) {
									that.isEdit2 = true;
								} else {
									that.isEdit2 = false;
								}
								
							} else {
								that.userInfo.attrs.faceVerify = 1;
								var identityVerify = that.userInfo.attrs.identityVerify;
								if (identityVerify == 1) {
									that.isEdit2 = true;
								} else {
									that.isEdit2 = false;
								}
							}
							uni.setStorageSync('userInfo', JSON.stringify(that.userInfo));
							that.activity = 3;
							that.pageStep = 1;
						
							
						}
					}
				})
				.catch(err=>{})
				uni.stopPullDownRefresh();
			},
			getIdentifyingDetails() { // 获取已认证的详情
				let that = this;
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					var userCode = that.userInfo.attrs.userCode;
				} else {
					var userCode = that.userInfo.attrs.userCode
				}
				
				// console.log('用户详细信息参数', params);
				utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
				.then(res=>{
					console.log('用户详细信息', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						var body = res.rspBody;
						that.name = body.userName ? body.userName : '';
						that.cardNum = body.idNo ? body.idNo : '';
						that.address = body.addr ? body.addr : '';
						that.faceImageUrl = body.idFrontImg ? body.idFrontImg : '';
						that.birthday = body.birth ? body.birth : '';
						that.gender = body.gender ? body.gender : '';
						that.dataFrom = body.userValidFrom ? body.userValidFrom : '';
						that.dataTo = body.userValidTo ? body.userValidTo : '';
						if (body.userName) {
							that.isEdit = true;
							that.idStatus = body.idStatus;
							that.identityVerifyInfo = body.identityVerifyInfo;
							var userRole = uni.getStorageSync("userRole");
							if (userRole == 1) {
								that.userInfo.attrs.identityVerify = body.identityVerify;
								that.userInfo.attrs.identityVerify = body.identityVerify;
								that.userInfo.userName = that.name;
								that.userInfo.attrs.faceVerify = body.faceVerify;
								if (!body.identityVerify) {
									that.activity = 1
								} else if (!body.faceVerify) {
									that.activity = 2
								} else {
									that.isEdit2 = true;
									that.activity = 3
								}
								
							} else {
								that.userInfo.attrs.identityVerify = body.identityVerify;
								that.userInfo.attrs.faceVerify = body.faceVerify;
								that.userInfo.userName = that.name;
								if (!body.identityVerify) {
									that.activity = 1
								} else if (!body.faceVerify) {
									that.activity = 2
								} else {
									that.isEdit2 = true;
									that.activity = 3
								}
							}
													
							getApp().globalData.defaultContact = {
								userName: that.name,
								mobile: that.userInfo.mobile,
							};
							uni.setStorageSync('userInfo', JSON.stringify(that.userInfo));
							console.log('更新后的用户信息', that.userInfo);
							that.$forceUpdate();
						} else {
							that.isEdit = false;
							that.identityVerifyInfo = "";
						}
						
						if(that.dataFrom && that.dataTo) {
							that.date = that.dataFrom + '-' + that.dataTo;
						}
						that.backImage = body.idBackImg ? body.idBackImg : '';
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
			cancel() {
				this.$refs.popup.close();
			},
			checkFrom() {
				//安卓从相册选择
				var that = this;
				var photoType = that.photoType;
				that.$refs.popup.close();
				if (photoType == "front") {
					//身份证主页识别
					
					uni.chooseImage({
						count: 1, // 默认9  
						sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
						sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有  
						success: function(res) {
							console.log('选择的图片', res);
							console.log('选择的图片大小', res.tempFiles['0'].size);
							var tempFiles = res.tempFiles;
							var size = tempFiles[0].size;
							if (size - 1024*1024*2 > 0) {
								uni.showToast({
									title:"上传文件过大，请重新上传！",
									icon: 'none'
								})
								return;
							}
							var tempFilePaths = res.tempFilePaths
							that.uploadIdcard(tempFilePaths[0], 1);
						},
						fail: function(err) {
							console.log(err, 'asd')
							
							
						}
					})
					
					
				} else {
					//身份证副业识别
					
					uni.chooseImage({
						count: 1, // 默认9  
						sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
						sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有  
						success: function(res) {
							console.log('选择的图片', res);
							console.log('选择的图片大小', res.tempFiles['0'].size);
							var tempFiles = res.tempFiles;
							var size = tempFiles[0].size;
							if (size - 1024*1024*2 > 0) {
								uni.showToast({
									title:"上传文件过大，请重新上传！",
									icon: 'none'
								})
								return;
							}
							var tempFilePaths = res.tempFilePaths
							that.uploadIdcard(tempFilePaths[0], 2);
						},
						fail: function(err) {
							console.log(err, 'asd')
							
							
						}
					})
					
					
				}
			},
			//安卓拍照
			sendPhoto() {
				var that = this;
				that.$refs.popup.close();
				var photoType = that.photoType;
				if (photoType == "front") {
					if (platForm == "android") {
						//身份证主页识别
						PhotoModule.sendForCarema({
							type: 'front'
						}, res => {
							that.uploadIdcard(res.uri, 1);
						})
					} else {
						uni.chooseImage({
							count: 1, // 默认9  
							sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
							sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  
							success: function(res) {
								console.log('选择的图片', res);
								console.log('选择的图片大小', res.tempFiles['0'].size);
								var tempFiles = res.tempFiles;
								var size = tempFiles[0].size;
								if (size - 1024*1024*2 > 0) {
									uni.showToast({
										title:"上传文件过大，请重新上传！",
										icon: 'none'
									})
									return;
								}
								var tempFilePaths = res.tempFilePaths
								that.uploadIdcard(tempFilePaths[0], 1);
							},
							fail: function(err) {
								console.log(err, 'asd')
								
								
							}
						})
					}
					
				} else {
					//身份证副业识别
					if (platForm == "android") {
						PhotoModule.sendForCarema({
							type: 'back'
						}, res => {
							that.uploadIdcard(res.uri, 2);
						})
					} else {
						uni.chooseImage({
							count: 1, // 默认9  
							sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
							sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  
							success: function(res) {
								console.log('选择的图片', res);
								console.log('选择的图片大小', res.tempFiles['0'].size);
								var tempFiles = res.tempFiles;
								var size = tempFiles[0].size;
								if (size - 1024*1024*2 > 0) {
									uni.showToast({
										title:"上传文件过大，请重新上传！",
										icon: 'none'
									})
									return;
								}
								var tempFilePaths = res.tempFilePaths
								that.uploadIdcard(tempFilePaths[0], 2);
							},
							fail: function(err) {
								console.log(err, 'asd')
								
								
							}
						})
					}
					
				}
			},
			faceSelect(flag) {
				var that = this;
				if (this.isEdit2) {
					//预览
					var urlArr = [];
					if (flag == 1) {
						urlArr.push(that.faceImageUrl)
					} else {
						urlArr.push(that.backImage)
					}
					uni.previewImage({
						current: 1, //预览图片的下标
						urls: urlArr //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
					})
					return;
				};
				var that = this;
				if (flag == 1) {
					this.photoType = "front";
				} else {
					this.photoType = "back";
				}
				that.$refs.popup.open();
			},
			uploadIdcard: function(image, flag) {
				var url = flag == 1 ? '/baidu/ocr/v1/user/front' : '/baidu/ocr/v1/user/back';
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				let params = {'file': image};
				console.log('身份证参数', params)
				utils.upLoadFile(url, image, params)
				.then(res => {
					console.log('身份证信息', res)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var body = res.rspBody;
						if (flag == 1) {
							//身份证正面
							that.name = body.name ? body.name : '';
							that.cardNum = body.idNo ? body.idNo : '';
							that.address = body.addr ? body.addr : '';
							that.faceImageUrl = body.image ? body.image : '';
							that.birthday = body.birthday ? body.birthday : '';
							that.gender = body.gender ? body.gender : '';
						} else if (flag == 2) {
							//身份证副页
							that.dataFrom = body.validFrom ? body.validFrom : '';
							that.dataTo = body.validTo ? body.validTo : '';
							if(that.dataFrom && that.dataTo) {
								that.date = that.dataFrom + '-' + that.dataTo;
							}
							that.backImage = body.image ? body.image : '';
						}
						that.$forceUpdate();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					uni.showToast({
						title: '未识别出有效信息，请重试',
						icon: 'none'
					})
				})
				
			
			},
			changeStatus(flag) {
				this.activity = this.activity == flag ? this.activity : flag;
			},
			mobileUp() {
				//修改手机号
				
				uni.showLoading({
					title: '请稍候...',
				})
				let that = this;
				var userRole = uni.getStorageSync("userRole");
				console.log(that.userInfo, 'aaa');
				var url = "";
				if (userRole == 1) {
					var params = {
						id: that.userInfo.attrs.personId,
						userId: that.userInfo.userId,
						idFrontImg: that.faceImageUrl,
						idBackImg: that.backImage,
						userValidFrom: that.dataFrom,
						userValidTo: that.dataTo,
						idAddress: that.address,
						addr: that.address,
						idNo: that.cardNum,
						userName: that.name,
						birthday: that.birthday,
						gender: that.gender,
						userCode: that.userInfo.attrs.userCode,
					}
					url = "/yh/person/identity/upload"
				} else {
					var params = {
						id: that.userInfo.attrs.personId,
						userId: that.userInfo.userId,
						idFrontImg: that.faceImageUrl,
						idBackImg: that.backImage,
						userValidFrom: that.dataFrom,
						userValidTo: that.dataTo,
						idAddress: that.address,
						addr: that.address,
						idNo: that.cardNum,
						userName: that.name,
						birthday: that.birthday,
						gender: that.gender,
						userCode: that.userInfo.attrs.userCode,
					}
					url = "/yh/person/authorization/of/identity"
				}
				
				params.updatePhoneFlag = 1;
				
				
				console.log('修改手机号成功', url, params);
				utils.postRequest(url, params)
				.then(res=>{
					console.log('修改手机号成功', res);
					uni.hideLoading();
					that.updateMobile = false;
					if(res.retCode == "0000000") {
						if (userRole == 1) {
							that.userInfo.attrs.identityVerify = 1;
							that.userInfo.attrs.identityVerify = 1;
							that.userInfo.userName = that.name;
							that.toChangeGoEasyStatus(that.userInfo);
						} else {
							that.userInfo.attrs.identityVerify = 1;
							that.userInfo.userName = that.name;
							that.toChangeGoEasyStatus(that.userInfo);
						}
					
						getApp().globalData.defaultContact = {
							userName: that.name,
							mobile: that.userInfo.mobile,
						};
						uni.setStorageSync('userInfo', JSON.stringify(that.userInfo));
						
						setTimeout(() => {
							uni.showToast({
								title: '修改成功',
								icon: 'success'
							})
						}, 100)
						
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					that.updateMobile = false;
					uni.hideLoading();
					console.log(err);
				})
				
					
				
				
			},
			changePageStep(type) {
				
				if(this.name && this.cardNum && this.address && this.date && this.faceImageUrl && this.backImage) {
					uni.showLoading({
						title: '请稍候...',
					})
					let that = this;
					var userRole = uni.getStorageSync("userRole");
					console.log(that.userInfo, 'aaa');
					var url = "";
					if (userRole == 1) {
						var params = {
							id: that.userInfo.attrs.personId,
							userId: that.userInfo.userId,
							idFrontImg: that.faceImageUrl,
							idBackImg: that.backImage,
							userValidFrom: that.dataFrom,
							userValidTo: that.dataTo,
							idAddress: that.address,
							addr: that.address,
							idNo: that.cardNum,
							userName: that.name,
							birthday: that.birthday,
							gender: that.gender,
							userCode: that.userInfo.attrs.userCode,
						}
						url = "/yh/person/identity/upload"
					} else {
						var params = {
							id: that.userInfo.attrs.personId,
							userId: that.userInfo.userId,
							idFrontImg: that.faceImageUrl,
							idBackImg: that.backImage,
							userValidFrom: that.dataFrom,
							userValidTo: that.dataTo,
							idAddress: that.address,
							addr: that.address,
							idNo: that.cardNum,
							userName: that.name,
							birthday: that.birthday,
							gender: that.gender,
							userCode: that.userInfo.attrs.userCode,
						}
						url = "/yh/person/authorization/of/identity"
					}
					
					params.updatePhoneFlag = type ? type : 0;
					
					
					console.log('认证信息', url, params);
					utils.postRequest(url, params)
					.then(res=>{
						console.log('认证信息保存', res);
						that.isClickSave = true;
						uni.hideLoading();
						if(res.retCode == "0000000") {
						
							that.userInfo.attrs.identityVerify = 1;
							that.userInfo.userName = that.name;
							that.toChangeGoEasyStatus(that.userInfo);
						
						
							getApp().globalData.defaultContact = {
								userName: that.name,
								mobile: that.userInfo.mobile,
							};
							uni.setStorageSync('userInfo', JSON.stringify(that.userInfo));
						
							that.activity = 2;
							that.pageStep = 2;
							
						}else {
							
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
							// if (res.retCode == "100002") {
							// 	//修改手机号
							// 	var willUpPhone = res.rspBody.phone;
							// 	if (willUpPhone) {
							// 		that.willUpPhone = willUpPhone.substr(0, 3) + '****' + willUpPhone.substr(-4)
							// 	}
							// 	// that.$refs.mobilePopup.open();
							// } else {
							// 	uni.showToast({
							// 		title: res.retDesc,
							// 		icon: 'none'
							// 	})
							// }
							
						}
					})
					.catch(err=>{
						uni.hideLoading();
						console.log(err);
					})
				
					
				}else {
					uni.showToast({
						title: '请将信息填写完整',
						icon: 'none',
					})
				}
			},
			toChangeGoEasyStatus(userInfo) {
				// if (!userInfo) return;
				// if(this.goEasy.getConnectionStatus() == 'disconnected') {
				// 	getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
				// 	getApp().globalData.imService.connect(userInfo);
				// 	uni.$emit("refreshData_message"); // 更新会话列表，并重新订阅群聊
				// }else {
				// 	this.logout();
				// }
				
			},
			logout () { // 进入登录页需先退出断开goEasy链接
				// let im = this.goEasy;
				// let that = this;
			 //    im.disconnect({
			 //        onSuccess: function(){
			 //            console.log('断连成功')
			 //            getApp().globalData.imService = null;
				// 		that.toChangeGoEasyStatus();
			 //        },
			 //        onFailed: function(error){
			 //            uni.showToast({
			 //                title:'断连失败'
			 //            })
			 //        }
			 //    });
			},
			getFaceUrl() { // 获取人脸认证url
				if(!utils.btnRepeat()) return false; // 防抖
				if(!this.isAgree) {
					uni.showToast({
						title: '请同意身份核验协议',
						icon: 'none',
					})
					return false;
				};
				// let that = this;
				//开始人脸认证
				var plateForm = uni.getSystemInfoSync().platform;
				if (plateForm == "android") {
					this.scan();
				} else {
					uni.navigateTo({
						url: './face?type=edit'
					})
				}
				// uni.showLoading({
				// 	title: '人脸识别启动中',
				// 	mask: true
					
				// })
				// setTimeout(() => {
				// 	uni.hideLoading();
				// 	uni.navigateTo({
				// 		url: 'face',
				// 		success: function(res){
				// 		},
				// 		fail: function(error){
				// 		    uni.showToast({
				// 		    	title: error,
				// 		    	icon: 'none',
				// 		    })
				// 		}
				// 	})
				// }, 1000)
			},
			//安卓人脸识别
			scan() {
				let that = this;
				// 调用插件开始采集人脸
				bdFaceLive.liveFace({
					liveRandom: true, // 选填【动作是否随机】，默认有序，false：有序|true：随机
					sound: 0, // 选填【是否有声】，默认有声，0：有声|1：无声
					camera: 0, // 选填【前置|后置摄像头】，默认前置，0：前置|1：后置
					openMask: true, // 选填【是否开启戴口罩采集】，默认false不开启
					hintTextColor: '#333333', // 选填【提示文字颜色】，默认#333333
					backgroundColor: '#FFFFFF',
				}, result => {
						console.log(result, 'renliande1212')  
						that.doResult(result);
					}
				)	
					  
			},
			doResult(result) {
					//安卓处理结果
				var that = this;
				console.log(result, '认证结果11');
				console.log(result.code, '认证的状态');
				console.log(result.base64ImageResult, 'base64ImageResult认证');
				console.log(result.otherBase64Image, 'otherBase64Image认证');
				
				switch (result.code) {
				case 1: // 人脸采集成功
					uni.showLoading({
						title: '人脸识别中...'
					})
					let userInfo = JSON.parse(uni.getStorageSync("userInfo"));
					let userCode = userInfo.attrs.userCode
					let data = {
						frontImage: result.base64ImageResult,
						userCode: userCode,
						sideImage: result.otherBase64Image
					}
					
					var updateMobile = that.updateMobile;
					var willUpPhone = that.willUpPhone;
					var url = '';
					if (updateMobile) {
						data.userName = that.name;
						data.idNo = that.cardNum;
						url = "/yh/person/doing/face/verify/by/baidu/no_check"
					} else {
						url = '/yh/person/doing/face/verify/by/baidu'
					}
					
					console.log(data, 'ocr人脸');
					
					utils.postRequest(url, data).then(faceRes => {
						console.log(faceRes, '返回值')
						uni.hideLoading();
						if (faceRes.retCode == "0000000") {
						  console.log(faceRes, "认证成功")
							// uni.showToast({
							// 	title: '认证成功',
							// 	icon: 'success',
							// 	duration: 3000,
							// })
							//认证成功后修改手机号
							var updateMobile = that.updateMobile;
							var willUpPhone = that.willUpPhone;
							if (updateMobile) {
								that.mobileUp();
							}

							
							uni.navigateTo({
								url: './faceResult?type=success&msg=认证成功&source=edit'
							})
						
							var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
							var userRole = uni.getStorageSync("userRole");
							console.log(userInfo, userRole, 'aaa');
							if (userRole == 1) {
								if (userInfo) {
									userInfo.attrs.faceVerify = 1;
									uni.setStorageSync('userInfo', JSON.stringify(userInfo))
								}
							} else {
								if (userInfo) {
									userInfo.attrs.faceVerify = 1;
									uni.setStorageSync('userInfo', JSON.stringify(userInfo))
								}
							}
							//刷新当前页面
							that.getUserInfo();
							
						} else {
							console.log(faceRes, "认证失败")
							that.getFaceResult(0, faceRes.retDesc)
						}
					  })
					
					return
				}
			},
			//获取人脸识别认证结果
			getFaceResult(status, msg="") {
				this.pageStep = 1;
				if (status == 1) {
					var userInfo = uni.getStorageSync("userInfo");
					var userRole = uni.getStorageSync("userRole");
					console.log(userInfo, userRole, 'aaa');
					if (userRole == 1) {
						if (userInfo) {
							var userInfo1 = JSON.parse(userInfo);
							userInfo1.attrs.faceVerify = 1;
							this.userInfo.attrs.faceVerify = 1;
							uni.setStorageSync(userInfo, JSON.stringify(userInfo1))
						}
						
					} else {
						if (userInfo) {
							var userInfo1 = JSON.parse(userInfo);
							userInfo1.attrs.faceVerify = 1;
							this.userInfo.attrs.faceVerify = 1;
							uni.setStorageSync(userInfo, JSON.stringify(userInfo1))
						}
					}
					this.identifyStatus = true;
					this.activity = 3;
					setTimeout(() => {
						uni.showToast({
							title: '认证成功',
							icon: 'success',
						})
					}, 1000)
				} else {
					
					uni.navigateTo({
						url: './faceResult?type=error&msg=' + msg
					})
					
					// setTimeout(() => {
					// 	uni.showToast({
					// 		title: msg,
					// 		icon: 'none',
					// 		duration: 3000,
					// 	})
					// }, 1000)
					
				}
			},
			backToCenter() {
				if (this.userRole == 1) {
					uni.switchTab({
						url: '/pages/my/index/index'
					})
				} else {
					uni.switchTab({
						url: '../userCenter'
					})
				}
            },
			jumpToDigitalCertificate() {
				uni.navigateTo({
					url: '../../../allAgreement/digitalCertificate'
				})
			},
			showKeyBoard() {
				this.$refs.keyboardPopup.open();
			}
		}
	}
</script>

<style lang="scss">
	.identifyingUsers {
		background-color: #f8f8f8;
		height: 100vh;
		.alertUp {
			width: 508rpx;
			height: 604rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #FFFFFF;
			.alertTitle {
				font-size: 32rpx;
				color: #000000;
				font-weight: 500;
				margin: 24rpx 0 14rpx;
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
			.alertItem {
				width: 508rpx;
				height: 76rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-bottom: 1px solid #DFDFDF;
				color: #4EADF1;
				font-size: 28rpx;
				font-weight: 500;
				&:last-child {
					border-bottom: none;
				}
			}
		}
		.step-1 {
			background-color: #FFFFFF;
		}
		.mobilePopup {
			width: 568rpx;
			height: 492rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #FFFFFF;
			.mobile-title{
				font-size: 48rpx;
				color: #333333;
				font-weight: 600;
				margin: 56rpx 0 32rpx;
			}
			.cont {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #666666;
				padding: 0 26rpx;
			}
			.optItem {
				height: 74rpx;
				color: #4EADF1;
				font-weight: 500;
				font-size: 28rpx;
				border-bottom: 1px solid #DFDFDF;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 568rpx;
				&:last-child {
					border: none
				}
			}
			
			
		}
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
		.line-left {
			width: 0;
			height: 0;
			border-top:70rpx solid red;
			border-right: 70rpx solid transparent;
		}
		.line-right {
			width: 0;
			height: 0;
			border-bottom: 70rpx solid red;
			border-left: 70rpx solid transparent;
			margin-left: -66rpx;
		}
		.testBtnGroup {
			padding:120rpx 32rpx 0 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.changeStatusBtn {
				padding: 0 20rpx;
				border-radius: 12rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: #4AA2F3;
				color:#FFF;
				font-size: 24rpx;
				margin-right:32rpx;
			}
		}
		.statusCss1 {
			background: #8AC8F4;
			text-align:center;
		}
		.statusCss2 {
			background: #8AC8F4;
		}
		.statusCss3 {
			background: #4EADF1;
		}
		.lineLeftStatusCss2 {
			border-top-color: #8AC8F4;
		}
		.lineLeftStatusCss3 {
			border-top-color: #4EADF1;
		}
		.lineRightStatusCss1 {
			border-bottom-color: #8AC8F4;
		}
		.lineRightStatusCss2 {
			border-bottom-color: #8AC8F4;
		}
		.lineRightStatusCss3 {
			border-bottom-color: #4EADF1;
		}
		
		.certificationStatus {
			display: flex;
			align-items: center;
			.statusBox {
				flex: 1;
				height: 70rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.statusMsg {
					padding: 0 0 0 100rpx;
					font-size: 28rpx;
				}
				.statusIcon {
					width: 24rpx;
					height: 24rpx;
					margin-right: 32rpx;
				}
			}
		}
		.line {
			height: 12rpx;
			background-color: #F8F8F8;
			width: 100vw;
		}
		.imageUploadBox {
			padding: 38rpx 48rpx;
			display: flex;
			justify-content: space-between;
			
			.idCardImg {
				width: 308rpx;
				height: 182rpx;
				border: 2rpx dashed #E9EDF5;
				background-repeat: no-repeat;
				background-size: 100%;
				.upLoadHint {
					font-size: 28rpx;
					color: #333333;
					text-align: center;
					line-height: 40rpx;
					padding-top:136rpx;
				}
				.img {
					width: 308rpx;
					height: 182rpx;
				}
			}
		}
		.inputBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 36rpx;
			height: 92rpx;
			padding: 0 58rpx 0 10rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #F0F0F0;
			&:last-child {
				border: none;
			}
			.title {
				font-size: 28rpx;
				color: #333333;
			}
			.msgInput {
				flex: 1;
				text-align: right;
				font-size: 24rpx;
				color: #666666;
			}
		}
		.nextStepBtn {
			position: absolute;
			bottom: 138rpx;
			left: 135rpx;
			width: 480rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius:16rpx;
			background-color: #4AA2F3;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
		.identifyTitle {
			padding: 92rpx 0 24rpx 64rpx;
			font-size: 28rpx;
			color: #777777;
			display: flex;
			align-items: center;
			.identifyLogo {
				width: 48rpx;
				height: 48rpx;
				margin-right:20rpx;
			}
		}
		.identifyHint {
			font-size: 44rpx;
			font-weight: 500;
			color: #333333;
			line-height: 60rpx;
			padding-left:64rpx;
		}
		.identifyBtnGroup {
			position: absolute;
			bottom: 24rpx;
			padding: 0 58rpx;
			width: 634rpx;
			.agreementBox {
				padding: 0 30rpx 44rpx 30rpx;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				.agreeBtn {
					width: 32rpx;
					height: 32rpx;
					border: 2rpx solid #C2C2C9;
					border-radius:100%;
				}
				.agreeBtnIcon {
					width: 36rpx;
					height: 36rpx;
				}
				.agreeMsg {
					flex: 1;
					padding-left:24rpx;
					font-size: 26rpx;
					color: #777777;
					line-height: 36rpx;
					.agreeDetails {
						font-size: 26rpx;
						color: #4AA2F3;
					}
				}
			}
			.startBtn {
				height: 90rpx;
				line-height: 90rpx;
				border-radius:44rpx;
				background-color: #4AA2F3;
				box-shadow: 0px 4rpx 8rpx 0px rgba(38, 158, 255, 0.5);
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
		}
		.identifyStatusIcon {
			width: 88rpx;
			height: 88rpx;
			display: block;
			margin:160rpx auto 56rpx auto;
		}
		.identifyStatusMsg {
			padding: 0 56rpx;
			text-align: center;
			font-size: 40rpx;
			font-weight: 500;
			color: #333333;
		}
		.keyboardPopupBox {
			background-color: #FFF;
			display: flex;
			.keyCol + .keyCol {
				border-left: 2rpx solid #C2C2C9;
			}
			.keyCol {
				flex: 0 0 25%;
				display: flex;
				flex-direction: column;
				.keyRow {
					border-bottom: 2rpx solid #C2C2C9;
					height: 120rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.keyBoardDelete {
					border-bottom: 2rpx solid #C2C2C9;
					height: 240rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.deleteIcon {
						width: 32rpx;
						height: 32rpx;
					}
				}
				.keyBoardConfirm {
					border-bottom: 2rpx solid #C2C2C9;
					height: 240rpx;
					line-height: 240rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #4AA2F3;
				}
			}
		}
	}
	.error {
		color: red;
		padding-top: 20rpx;
		padding-left: 20rpx;
	}
</style>
