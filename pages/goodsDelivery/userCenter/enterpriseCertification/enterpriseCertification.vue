<template>
	<view class="enterpriseCertification">
		<view>
			<view class="imageUploadBox">
				<view class="upLoadView">
					<view class="idCardImg" @click='faceSelect(1)'>
						<image class="img" v-if="faceImageUrl" :src="faceImageUrl"></image>
						<view v-if="!faceImageUrl" class="toUpLoadBox businessLicenseBc">
							<view class="toUpLoadBtn">去上传</view>
						</view>
					</view>
					<view class="upLoadTitle">上传营业执照*</view>
				</view>
				<view class="upLoadView">
					<view class="idCardImg" @click='faceSelect(2)'>
						<image class="img" v-if="sealUrl" :src="sealUrl"></image>
						<view v-if="!sealUrl" class="toUpLoadBox businessLicenseBc">
							<view class="toUpLoadBtn">去上传</view>
						</view>
					</view>
					<view class="upLoadTitle">上传营业执照*(盖章）</view>
				</view>
				
				<view class="upLoadView">
					<view class="idCardImg" @click='faceSelect(3)'>
						<image class="img" v-if="idCardPositive" :src="idCardPositive"></image>
						<view v-if="!idCardPositive" class="toUpLoadBox icCardBc">
							<view class="toUpLoadBtn">去上传</view>
						</view>
					</view>
					<view class="upLoadTitle">法人身份证正面</view>
				</view>
				<view class="upLoadView">
					<view class="idCardImg" @click='faceSelect(4)'>
						<image class="img" v-if="idCardBack" :src="idCardBack"></image>
						<view v-if="!idCardBack" class="toUpLoadBox icCardBc">
							<view class="toUpLoadBtn">去上传</view>
						</view>
					</view>
					<view class="upLoadTitle">法人身份证反面</view>
				</view>
				
			</view>
			<view class="inputBox">
				<view class="title">企业名称</view>
				<input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.enterpriseName" />
			</view>
			<view class="inputBox">
				<view class="title">统一信用代码</view>
				<input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.taxNo" @input="taxNoInput"/>
			</view>
			<view class="inputBox">
				<view class="title">开户行</view>
				<input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.bankName" />
			</view>
			<view class="inputBox">
				<view class="title">银行账号</view>
				<input class="msgInput" type="number" maxlength="32" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.bankAccount" @input="bankAccountInput"/>
			</view>
			<view class="inputBox">
				<view class="title">企业地址</view>
				<input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.address" />
			</view>
			<view class="inputBox">
				<view class="title">联系电话</view>
				<input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.enterprisePhone" @input="enterprisePhoneInput"/>
			</view>
			<view class="inputBox">
				<view class="title">企业法人</view>
				<input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.legalRepresentative" />
			</view>
			<view class="inputBox">
				<view class="title">法人身份证</view>
				<input class="msgInput" maxlength="18" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.legalIdNo" />
			</view>
			<view class="inputBox">
				<view class="title">法人手机号</view>
				<input class="msgInput" type="number" maxlength="11" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.legalPhone" @input="legalPhoneInput"/>
			</view>
			<view class="inputBox">
				<view class="title">注册资本</view>
				<input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.registeredCapital" />
			</view>
			<view class="inputBox">
				<view class="title">注册时间</view>
				<!-- <input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.registeredDate" /> -->
				<picker mode="date" fields="day" :value="rspBody.registeredDate" @change="birthdayChange">
					<view  class="msgInput">
						<view class="nickName">{{rspBody.registeredDate ? rspBody.registeredDate : ''}}</view>
					</view>
				</picker>
			</view>
			<view class="inputBox">
				<view class="title">企业类型</view>
				<input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.type" />
			</view>
			<view class="inputBox">
				<view class="title">经营范围</view>
				<!-- <input class="msgInput" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="rspBody.businessScope" /> -->
				<textarea class="msgTextarea" max-length="200" placeholder-style="font-size:28rpx;color:#C2C2C9"  v-model="rspBody.businessScope"/>
			</view>
		</view>
		
		<view class="nextStepBtn" @tap="openConfirmPopup()">提交</view>
		
		<uni-popup ref="confirmPopup" type="center">
			<view class="hintBox">
				<view class="msg">是否确认提交</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="closeConfirmPopup()">返回</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @tap="saveCertificationMsg()">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as service from "@/utils/service";
	export default {
		data() {
			return {
				
				faceImageUrl: '',
				sealUrl: '',
				idCardPositive: '',
				idCardBack: '',
				userInfo: {},
				userRole: '',
				rspBody: {},
			};
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			console.log('用户信息', this.userInfo);
			this.getUserInfo();
		},
		methods: {
			getUserInfo() { // 企业认证详情 
				let params = {
					userCode: this.userInfo.attrs.userCode
				}
				console.log('参数', params);
				let that = this;
				utils.postRequest('/yh/enterprise/select/detail', params)
				.then(res=>{
					console.log('企业认证详情', res);
					if(res.retCode == "0000000") {
						if(res.rspBody) {
							that.rspBody = res.rspBody;
							that.faceImageUrl = that.rspBody.imgUrl ? that.rspBody.imgUrl : '';
							that.sealUrl = that.rspBody.sealImgUrl ? that.rspBody.sealImgUrl : '';
							that.idCardPositive = that.rspBody.legalFrontImg ? that.rspBody.legalFrontImg : '';
							that.idCardBack = that.rspBody.legalBackImg ? that.rspBody.legalBackImg : '';
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{})
			},
			chooseImage1(flag) {
				var that = this;
				uni.chooseImage({
					count: 1, // 默认9  
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						console.log('选择的图片', res);
						console.log('选择的图片大小', res.tempFiles['0'].size);
						if(res.tempFiles['0'].size > (1048576 * 10)) { // 图片大于10mb则无法上传
							uni.showToast({
							    title: '上传的图片不能大于10MB',
								icon: 'none',
							    duration: 2000
							});
							return false;
						}
						var tempFilePaths = res.tempFilePaths
						switch(flag) {
							case 1:
								that.uploadIdcard(tempFilePaths[0]);
								break;
							case 2:
								that.uploadFrontImage(tempFilePaths[0], flag);
								break;
							case 3:
								that.legalUpload(tempFilePaths[0]);
								break;
							case 4:
								that.uploadFrontImage(tempFilePaths[0], flag);
								break;
								
						}
					},
					fail: function(err) {
						console.log(err, 'asd')
					}
				})
			},
			faceSelect(flag) {
				var that = this;
				var platform = uni.getSystemInfoSync().platform
				if (platform == "ios") {
					that.chooseImage1(flag);
					return;
				}
				if (plus.navigator.checkPermission('android.permission.CAMERA') === 'undetermined' && plus.navigator.checkPermission('android.permission.READ_EXTERNAL_STORAGE') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '为了从相册选择照片或相机拍照，将申请您的相机、存储权限',
						success(res) {
							if (res.confirm) {
								that.chooseImage1(flag);
							} 
						}
					})
				} else {
					that.chooseImage1(flag);
				}
			
			},
			legalUpload: function(image, flag) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				let params = {'file': image};
				console.log('身份证参数', params)
				utils.upLoadFile('/baidu/ocr/v1/user/front', image, params)
				.then(res => {
					console.log('身份证信息', res)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var body = res.rspBody;
						that.rspBody.legalRepresentative = body.name ? body.name : '';
						that.rspBody.legalIdNo = body.idNo ? body.idNo : '';
						that.idCardPositive = body.image ? body.image : '';
						
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
			uploadIdcard: function(image) {
				var that = this;
				var params = new Object();
				var url = "/baidu/ocr/v1/business/license/info"; 
				uni.showLoading({
					title: '请稍候...',
				})
				utils.upLoadFile(url, image, params)
				.then(res => {
					console.log('企业认证上传', res)
					uni.hideLoading();
					if(res.retCode == "0000000") {
						let rspBody = res.rspBody.words_result;
						that.rspBody.taxNo = rspBody.socialCreditCode ? rspBody.socialCreditCode : '';
						that.rspBody.enterpriseName = rspBody.companyName ? rspBody.companyName : '';
						that.rspBody.type = rspBody.type ? rspBody.type : '';
						that.rspBody.address = rspBody.address ? rspBody.address : '';
						that.rspBody.legalRepresentative = rspBody.legalPerson ? rspBody.legalPerson : '';
						that.rspBody.registeredCapital = rspBody.registeredCapital ? rspBody.registeredCapital : '';
						let registeredDate = rspBody.dateOfEstablishment ? rspBody.dateOfEstablishment : '';
						if(registeredDate) {
							registeredDate = registeredDate.replace('年', '-');
							registeredDate = registeredDate.replace('月', '-');
							registeredDate = registeredDate.replace('日', '');
						}
						that.rspBody.registeredDate = registeredDate;
						that.rspBody.businessScope = rspBody.businessScope ? rspBody.businessScope : '';
						that.faceImageUrl = rspBody.imgUrl ? rspBody.imgUrl : '';
						that.$forceUpdate();
					}else {
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
						icon: 'none'
					})
				})
			},
			uploadFrontImage(path, flag) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				utils.upLoadFile("/file/upload", path)
				.then(result => {
					console.log('上传结果', result);
					uni.hideLoading()
					if (result.retCode == '0000000') {
						switch(flag) {
							case 2:
								that.sealUrl = result.rspBody[0].url;
								break;
							case 4:
								that.idCardBack = result.rspBody[0].url;
								break;
						}	
					} else {
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						})
					}
					
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '上传失败，请重试',
						icon: 'none'
					})
				})
			},
			openConfirmPopup() {
				if(!this.faceImageUrl) {
					uni.showToast({
						title: '请上传营业执照',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.rspBody.enterpriseName) {
					uni.showToast({
						title: '请输入企业名称',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.rspBody.taxNo) {
					uni.showToast({
						title: '请输入企业税号',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.rspBody.bankName) {
					uni.showToast({
						title: '请输入开户行',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.rspBody.bankAccount) {
					uni.showToast({
						title: '请输入银行账号',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.rspBody.address) {
					uni.showToast({
						title: '请输入企业地址',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.rspBody.enterprisePhone) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				this.$refs.confirmPopup.open();
			},
			closeConfirmPopup() {
				this.$refs.confirmPopup.close();
			},
			saveCertificationMsg() { // 保存认证信息
				uni.showLoading({
					title: '请稍候...',
				})
				let params = {
					"userCode": this.userInfo.attrs.userCode,
					"enterpriseName": this.rspBody.enterpriseName,
					"enterprisePhone": this.rspBody.enterprisePhone,
					"taxNo": this.rspBody.taxNo,
					"imgUrl": this.faceImageUrl,
					"legalBackImg": this.idCardBack,
					"legalFrontImg": this.idCardPositive,
					"type": this.rspBody.type,
					"bankName": this.rspBody.bankName,
					"bankAccount": this.rspBody.bankAccount,
					"address": this.rspBody.address,
					"legalIdNo": this.rspBody.legalIdNo,
					"legalPhone": this.rspBody.legalPhone,
					"sealImgUrl": this.sealUrl,
					"legalRepresentative": this.rspBody.legalRepresentative,
					"registeredCapital": this.rspBody.registeredCapital,
					"registeredDate": this.rspBody.registeredDate,
					"businessScope": this.rspBody.businessScope,
					"title": this.rspBody.title,
					"status": this.rspBody.status,
				};
				let that = this;
				console.log('企业认证保存参数', params);
				utils.postRequest('/yh/enterprise/replace', params)
				.then(res=>{
					console.log('企业认证保存结果', res);
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '认证成功',
							icon: 'success',
							duration: 2000
						})
						utils.postRequest('/yh/enterprise/select/detail', {userCode: this.userInfo.attrs.userCode})
						.then(newRes=>{
							console.log('认证企业认证详情', newRes);
							if(newRes.retCode == "0000000") {
								if(newRes.rspBody && newRes.rspBody.contractNum  && newRes.rspBody.contractNum != '0') {
									getApp().globalData.costInformation.needInvoiceFlag = 1;
									console.log('认证costInformation', getApp().globalData.costInformation);
								}else  {
									getApp().globalData.costInformation.needInvoiceFlag = 2;
									console.log('认证costInformation', getApp().globalData.costInformation);
								}
								// if(newRes.rspBody) {
								// 	if(newRes.rspBody.taxNo) {
								// 		getApp().globalData.costInformation.needInvoiceFlag = 1;
								// 		console.log('认证costInformation', getApp().globalData.costInformation);
								// 	}
								// }
							}
						})
						.catch(newErr=>{})
						setTimeout(() => {
							uni.navigateBack();
						}, 2000)
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{})
			},
			backToCenter() {
				uni.switchTab({
					url: '../userCenter'
				})
            },
			birthdayChange(e){
				console.log(e);
				this.rspBody.registeredDate = e.detail.value;
			},
			taxNoInput(e){
				var value = e.detail.value;
				var reg =/[\u4e00-\u9fa5]|\s/g;
				this.$nextTick(function () {
					this.rspBody.taxNo = value.replace(reg,'');
				})
			},
			bankAccountInput(e) {
				if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}
				this.$nextTick(function(){
					let msg = e.detail.value;
					this.rspBody.bankAccount = msg ? msg.replace(/\./g,"") : msg;
				})
			},
			enterprisePhoneInput(e) {
				this.$nextTick(function(){
					this.rspBody.enterprisePhone = e.detail.value;
				})
			},
			legalPhoneInput(e) {
				this.$nextTick(function(){
					if(e.detail.value) {
						if(e.detail.value == 0 || e.detail.value == '0') {
							this.rspBody.legalPhone = 1;
						}else {
							this.rspBody.legalPhone = parseInt(e.detail.value);
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.enterpriseCertification {
		padding-bottom: 156rpx;
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
			background: #F2F3F6;
			text-align:center;
		}
		.statusCss2 {
			border-radius:0px 65rpx 65rpx 0px;
			background: #4AA2F3;
		}
		.statusCss3 {
			border-radius:0px 65rpx 65rpx 0px;
			background: #4DD0A1;
		}
		.imageUploadBox {
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.upLoadView:nth-child(2n) {
				margin-right:0;
			}
			.upLoadView {
				margin-right: 18rpx;	
				.idCardImg {
					width: 332rpx;
					height: 224rpx;
					background: #F1F6FF;
					border-radius: 12rpx;
					border: 2rpx solid #0171F9;
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: hidden;
					.icCardBc {
						width: 230rpx;
						height: 172rpx;
						background-image: url('../../../../static/images/goodsDelivery/icCardBc.png');
					}
					.businessLicenseBc {
						width: 198rpx;
						height: 180rpx;
						background-image: url('../../../../static/images/goodsDelivery/businessLicenseBc.png');
					}
					.toUpLoadBox {
						display: flex;
						justify-content: center;
						align-items: center;
						background-repeat: no-repeat;
						background-size: 100%;
						.toUpLoadBtn {
							width: 132rpx;
							height: 68rpx;
							line-height: 68rpx;
							background: #0171F9;
							border-radius: 34rpx;
							font-size: 28rpx;
							color: #FFFFFF;
							text-align: center;
						}
					}
					.upLoadHint {
						font-size: 28rpx;
						color: #333333;
						text-align: center;
						line-height: 40rpx;
						padding-top:136rpx;
					}
					.img {
						width: 334rpx;
						height: 224rpx;
					}
				}
				.upLoadTitle {
					font-size: 28rpx;
					color: #707071;
					line-height: 40rpx;
					text-align: center;
					margin: 16rpx 0 32rpx 0;
				}
			}
		}
		.borderInput {
			height: 2rpx;
			background-color: #CCCCCC;
		}
		.inputBox {
			display: flex;
			justify-content: space-between;
			// align-items: center;
			padding: 24rpx 0;
			margin: 0 32rpx;
			border-top: 2rpx solid #F1F1F1;
			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				line-height: 44rpx;
				flex-shrink: 0;
				margin-right: 32rpx;
			}
			.msgInput {
				flex: 1;
				text-align: right;
				font-size: 28rpx;
				color: #333333;
				height: 44rpx;
				.nickName {
					text-align: right;
					font-size: 28rpx;
					color: #333333;
					line-height: 44rpx;
				}
			}
			.msgTextarea {
				flex: 1;
				text-align: right;
				font-size: 28rpx;
				color: #333333;
				min-height: 44rpx;
			}
		}
		.nextStepBtn {
			position: fixed;
			bottom: 24rpx;
			left: 58rpx;
			width: 634rpx;
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
		.hintBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			.msg {
				width:560rpx;
				font-size: 28rpx;
				color: #777777;
				padding: 80rpx 16rpx 72rpx 16rpx;
				line-height: 40rpx;
				text-align: center;
			}
			.confirmBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top:2rpx solid #F3F3F3;
				.cancelBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #777777;
					text-align: center;
				}
				.groupLine {
					width: 2rpx;
					height: 94rpx;
					background-color: #F3F3F3;
				}
				.confirmBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #4AA2F3;
					text-align: center;
				}
			}
		}
	}
</style>
