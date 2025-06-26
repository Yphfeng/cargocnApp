<template>
	<view class="newDriverVerify">
		<view class="unauthorizedBox" v-if="certified == 1">
			<view class="mainTitle">上传驾驶证（必填）</view>
			<view class="upLoadContent">
				<view class="red">*</view>
				<view class="upLoadBtn driverLicenseFont" v-if="!params.licenseMainImg" @click="showPopup('blF')">
					<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传驾驶证主页</view>
				</view>
				
				<image class="upLoadBtn" v-else @click="showPopup('blF')" :src="params.licenseMainImg"></image>
			</view>
			<view class="upLoadContent">
				<view class="red">*</view>
				<view class="upLoadBtn driverLicenseBack" @click="showPopup('blB')" v-if="!params.licenseSubImg">
					<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传驾驶证副页</view>
				</view>
				<image class="upLoadBtn" v-else @click="showPopup('blB')" :src="params.licenseSubImg"></image>
			</view>
			<view class="submitBtn" :class="{active: isSetAll}" @click="toSubmit()">提交</view>
		</view>
		
		<view class="certified" v-if="certified == 2">
			<view class="licenseImageBox">
				<view class="licenseTitle" v-if="isEdit">
					点击图片可重新上传驾驶证照片
				</view>
				<view v-else>
					<view class="title" v-if="!isEdit">
						认证状态
						<image v-if="driverStatus" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/success.png" class="successIcon"></image>
						<text v-if="driverStatus" class="subTitle success">已认证</text>
						<image v-if="!driverStatus" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/recognizeNo.png" class="successIcon"></image>
						<text v-if="!driverStatus" class="subTitle error">未认证</text>
					</view>
					<view class="aduitBox" v-if="driverVerifyInfo">
						<view class="auditMsg">{{driverVerifyInfo}}</view>
					</view>
				</view>
			
				<view class="imageGroup">
					
					<view class="idCardImg" @click='faceSelect(3)' style="background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newDriverVerify/driverLicenseFont.png');">
						<image class="img1" v-if="stepParams.licenseMainImg" :src="stepParams.licenseMainImg"></image>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png" v-else class="addImage"></image>
						<view v-if="!stepParams.licenseMainImg" class="upLoadHint">上传驾驶证主页</view>
					</view>
					<view class="idCardImg" @click='faceSelect(4)' style="background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newDriverVerify/driverLicenseBack.png');">
						<image class="img" v-if="stepParams.licenseSubImg" :src="stepParams.licenseSubImg"></image>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png" v-else class="addImage"></image>
						<view v-if="!stepParams.licenseSubImg" class="upLoadHint">上传驾驶证副页</view>
					</view>
				</view>
				<view class="driverTitle">驾驶证</view>
			</view>
			<view class="detailsList">
				<view class="certificationDetails">
					<view class="subTitle">姓名<text class="red" v-if="isEdit">*</text></view>
					<input class="detailsMsg" :class="{active:isEdit}" :disabled="!isEdit" v-model="stepParams.driverName" placeholder-style="color: #66666" placeholder="请输入姓名" />
				</view>
				<view class="certificationDetails">
					<view class="subTitle">驾驶证号<text class="red" v-if="isEdit">*</text></view>
					<input class="detailsMsg" :class="{active:isEdit}" :disabled="!isEdit" v-model="stepParams.licenseId" placeholder-style="color: #66666" placeholder="请输入驾驶证号" />
				</view>
				<view class="certificationDetails">
					<view class="subTitle">准驾车型</view>
					<input class="detailsMsg" :class="{active:isEdit}" :disabled="!isEdit" v-model="stepParams.permitType" placeholder-style="color: #66666" placeholder="请输入准驾车型" />
				</view>
				<view class="certificationDetails">
					<view class="subTitle">有效期起</view>
					<view class="detailsMsg" v-if="!isEdit" style="color: #666;">
						<text v-if="stepParams.validFrom">{{stepParams.validFrom || ""}}</text>
						<text v-else>请选择</text>
					</view>
					<view class="detailsMsg" :class="{active:isEdit}" v-else>
						<!-- <uni-datetime-picker
							:bgClass="isEdit ? 'bgClass' : 'defaultStyle'"
							type="date"
							:showIcon="false"
							:disabled="!isEdit"
							:border="false"
							:clear-icon="false"
							:placeholder="'请选择有效期起'"
							v-model="stepParams.validFrom"
							@change="changeValidFromDate"
						/> -->
						<picker mode="date"  :value="stepParams.validFrom" start="1970-01-01" data-selectDateType="start"  end="2100-01-01" @change="changeValidFromDate" fields="day">
							<text class="subTitle" :class="{active:isEdit}" v-if="stepParams.validFrom">{{stepParams.validFrom}}</text>
							<text class="subTitle" :class="{active:isEdit}" v-else>请选择</text>
						</picker>
					</view>
				</view>
				<view class="certificationDetails">
					<view class="subTitle">有效期止</view>
					<view class="detailsMsg" v-if="!isEdit" style="color: #666;">
						<text v-if="stepParams.validTo" :class="{errorRed: (stepParams.dlStatus != 1 || isUpdateEnd)}">{{stepParams.validTo || ""}}</text>
						<text v-else>请选择</text>
					</view>
					<view class="detailsMsg" v-else :class="{active:isEdit}">
						<!-- <uni-datetime-picker
							:bgClass="isEdit ? 'bgClass' : 'defaultStyle'"
							type="date"
							:border="false"
							:disabled="!isEdit"
							:clear-icon="false"
							:placeholder="'请选择有效期止'"
							v-model="stepParams.validTo"
							@change="changeValidToDate"
						/> -->
					<!-- 	<picker mode="date"  :class="{active:isEdit}"  :value="stepParams.validTo" start="1970-01-01" data-selectDateType="start"  end="2100-01-01" @change="changeValidToDate" fields="day">
							<text class="subTitle" :class="{active:isEdit}" v-if="stepParams.validTo">{{stepParams.validTo}}</text>
							<text class="subTitle" :class="{active:isEdit}" v-else>请选择</text>
						</picker> -->
						<view class="msgInput" :class="{active: isEdit}" @click="showDatePop">
							<view v-if="stepParams.validTo" class="subTitle" :class="{active:isEdit, errorRed: isUpdateEnd}">{{stepParams.validTo == "长期" ? '长期' : stepParams.validTo}}</view>
							<view v-else class="subTitle" :class="{active:isEdit}" >请选择</view>
						</view>
					</view>
				</view>
			</view>
			<view class="submitBtn" :class="{active: isEditAll, submitBtnActive: !isEdit}" @click="toConfirm()">{{!isEdit ? '修改驾驶证信息' : '保存'}}</view>
		</view>
		
		<!-- 拍照弹窗 -->
		<uni-popup ref="takePicturePopup" type="center">
			<view class="picturePopupBox">
				<view class="popupTitle">请按照示例上传</view>
				<view v-if="upLoadType == 'blF'">
					<image class="upLoadSampleTrue" src="../../../static/images/newDriverVerify/dlSampleT.png"></image>
					<image class="upLoadSampleFalse" src="../../../static/images/newDriverVerify/dlSampleF.png"></image>
				</view>
				<view v-else>
					<image class="upLoadSampleTrue" src="../../../static/images/newDriverVerify/dlSampleTF.png"></image>
					<image class="upLoadSampleFalse" src="../../../static/images/newDriverVerify/dlSampleFF.png"></image>
				</view>
				<view class="photo-content">
					为了使用驾驶证的相关功能或服务，您需上传驾驶证证照，点击拍照会申请相机权限，点击从手机相册选择会申请存储权限。
				</view>

				<view class="optAlertItem">
					<view class="alertItem" @click="sendPhotoPower">拍照</view>
					<view class="alertLine" />
					<view class="alertItem" @click="chooseFromPhoto">从手机相册选择</view>
					<view class="alertLine cancel" />
					<view class="alertItem" @click="closePicturePopup">取消</view>
				</view>
			</view>
		</uni-popup>
		
		<!--返回提示-->
		<uni-popup ref="backPopup" type="center">
			<view class="backPopup1">
			  <view class="backTitle1">提示</view>
			  <view class="cont1">退出后，您上传的资料将清除，需要重新上传!</view>
			  <view class="optbtn1">
			    <view class="cancel1 opt1" @click="confirmBack">退出</view>
			     <view class="confirm1 opt1" @click="cancelBack">继续认证</view>
			  </view>
			</view>
		</uni-popup>
		
		
		<!-- 拍照弹窗 -->
		<uni-popup ref="simpleTakePicturePopup" type="center">
			<view class="picturePopupBox">
				<view class="popupTitle">请按照示例上传</view>
				<view v-if="upLoadType == 'blF'">
					<image class="upLoadSampleTrue" src="../../../static/images/newDriverVerify/dlSampleT.png"></image>
					<image class="upLoadSampleFalse" src="../../../static/images/newDriverVerify/dlSampleF.png"></image>
				</view>
				<view v-else>
					<image class="upLoadSampleTrue" src="../../../static/images/newDriverVerify/dlSampleTF.png"></image>
					<image class="upLoadSampleFalse" src="../../../static/images/newDriverVerify/dlSampleFF.png"></image>
				</view>
				<view class="photo-content">
					为了使用驾驶证的相关功能或服务，您需上传驾驶证证照，点击拍照会申请相机权限，点击从手机相册选择会申请存储权限。
				</view>
				<view class="optAlertItem">
					<view class="alertItem" @click="sendPhoto1Power">拍照</view>
					<view class="alertLine" />
					<view class="alertItem" @click="chooseFromPhoto1">从手机相册选择</view>
					<view class="alertLine cancel" />
					<view class="alertItem" @click="closePicturePopup1">取消</view>
				</view>
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
		
		<uni-popup ref="datePopup" type="bottom">
			<view class="datePopUp">
				<view class="opt">
					<view class="cancel item" @click="cancelTo">取消</view>
					<view class="confirm item" @click="confirmTo">确定</view>
				</view>
				<view class="cont" @click="chooseLong" :class="{active: isChooseLong}">长期</view>
				<picker-view :value="dateValue" :indicator-style="indicatorStyle" @change="bindChange" class="picker-view">
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in months" :key="index">{{item}}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in days" :key="index">{{item}}日</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	var PhotoModule = uni.requireNativePlugin("PhotoModule");
	var platform = uni.getSystemInfoSync().platform;
	import * as ship from "@/utils/ship";
	import * as commonUtils from "@/utils/utils"
	
	export default {
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			var once = year - 1990;
			for (let i = 1990; i <= 2099; i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i < 10 ? '0' + i : i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i < 10 ? '0' + i : i)
			}
			return {
				certified: 0, // 1未认证、2已认证
				upLoadType: '', // blF驾驶证主页、blB驾驶证副页
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
					driverName: '',
					licenseId: '',
					permitType: '',
					validFrom: '',
					validTo: ''
					
				},
				pageName:"",
				recognizing: false, //表示在认证过程中
				dateValue: [once, month - 1, day - 1],
				years,
				year,
				months,
				month,
				days,
				day,
				isChooseLong: false,
				indicatorStyle: `height: 40px;`
				
			};
		},
		onLoad(options) {
			// 未认证this.certified = 1;已认证this.certified = 2;认证状态在storage的userInfo里取
			this.getUserInfo();
			if(options.pageName){
				this.pageName=options.pageName;
			}
		},
		onBackPress(e) {
			console.log(this.isEdit)
			if (e.from == "backbutton") {
				if (this.isEdit && this.certified == 2) {
					this.$refs.backPopup.open();
					return true;
				}
			}
		},
		computed: {
			isSetAll() {
				var licenseMainImg = this.params.licenseMainImg;
				var licenseSubImg = this.params.licenseSubImg;
				if (licenseMainImg && licenseSubImg) {
					return true
				}
				return false
			},
			isEditAll() {
				var licenseMainImg = this.stepParams.licenseMainImg;
				var licenseSubImg = this.stepParams.licenseSubImg; 
				var driverName = this.stepParams.driverName;
				var licenseId = this.stepParams.licenseId;
				if (licenseMainImg && licenseSubImg && driverName && licenseId) {
					return true
				}
				return false
			},
			isUpdateEnd() {
				var validTo = this.stepParams.validTo
				if (validTo == "长期" || !validTo) return false;
				var nowTime = new Date().getTime();
				var fromTime = new Date(validTo).getTime();
				if (fromTime - nowTime < 0) {
					return true
				}
				return false
			},
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
					var res = await ship.upLoadFile("/baidu/ocr/v1/driver/front", image)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var body = res.rspBody;
						
						//驾驶证主页
						that.stepParams.licenseMainImg = body.image;
						that.stepParams.licenseSubImg = that.params.licenseSubImg;
						that.stepParams.licenseId = body.idNo;
						that.stepParams.permitType = body.permitType;
						that.stepParams.issuingOrganizations = body.issuingOrganizations;
						that.stepParams.driverName = body.name;
						
						var validFrom = body.validFrom;
						var validTo = body.validTo;
						
						var isRecognize1 = that.hanleCheckDate(validFrom);
						if (isRecognize1) {
							that.stepParams.validFrom = body.validFrom;
						} else {
							that.stepParams.validFrom = "";
						}
						if (validTo == "长期") {
							that.stepParams.validTo = body.validTo;
						} else {
							var isRecognize2 = that.hanleCheckDate(validTo);
							if (isRecognize2) {
								that.stepParams.validTo = body.validTo;
							} else {
								that.stepParams.validTo = "";
							}
						}
					
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.$nextTick(function(){
						that.recognizing = true;
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
				let that = this;
				if (!this.isEdit) {
					this.isEdit = true;
					return;
				}
				//校验是否必填
				var stepParams = this.stepParams;
				if (!stepParams.licenseMainImg) {
				  wx.showToast({
					title: '请上传驾驶证主页',
					icon: 'none'
				  })
				  return;
				}
				if (!stepParams.licenseSubImg) {
				  wx.showToast({
					title: '请上传驾驶证副页',
					icon: 'none'
				  })
				  return;
				}
				if (!stepParams.driverName) {
				  wx.showToast({
					title: '请输入姓名',
					icon: 'none'
				  })
				  return;
				}
				if (!stepParams.licenseId) {
				  wx.showToast({
					title: '请输入驾驶证号',
					icon: 'none'
				  })
				  return;
				}
				if (this.isUpdateEnd) {
					uni.showModal({
						content: '驾驶证有效期不可用，请修改!',
						confirmText: "继续保存",
						cancelText: '去修改',
						success:function(res) {
							if (res.confirm) {
								that.saveInfo();
							}
						}
					})
					return;
				};
				this.$refs.confirmPopup.open();
			},
			closeConfirmPopup() {
				this.$refs.confirmPopup.close();
			},
			sendPhoto1Power() {
				let that = this;
				commonUtils.caramePower(() => {
					console.log("执行")
					that.sendPhoto1();
				})
			},
			sendPhoto1() {
				//打开相机
				var that = this;
				this.$refs.simpleTakePicturePopup.close();
				var type = this.upLoadType;
				var platform = uni.getSystemInfoSync().platform;
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
			sendPhotoPower() {
				let that = this;
				commonUtils.caramePower(() => {
					that.sendPhoto();
				})
			},
			sendPhoto() {
				//打开相机
				var that = this;
				this.$refs.takePicturePopup.close();
				var type = this.upLoadType;
				var platform = uni.getSystemInfoSync().platform;
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
			chooseFromPhoto1() {
				let that = this;
				commonUtils.savePower(() => {
					that.chooseFromAlb1();
				})
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
			chooseFromPhoto() {
				let that = this;
				commonUtils.savePower(() => {
					that.chooseFromAlb();
				})
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
				if (!that.stepParams.driverName) {
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
						that.getUserInfo();
						if (userInfo.attrs.vehicleVerify !== 1) {
							//carType = add 标记跳转到行驶证认证页面时候不显示解除绑定按钮
							setTimeout(() => {
								uni.navigateTo({
									url: '../carVerify/newCarVerify?carType=' + 'add'
								})
							}, 1000)
						} else {
							if(that.pageName=='redPacket'){
								uni.navigateBack()
							}else{
								setTimeout(() => {
									uni.switchTab({
										url: '../index/index'
									})
								}, 1000)
							}
							
						}
						this.recognizing = false;
					} else {
						that.getUserInfo();
						if (res.retDesc == "当前驾驶证信息存在错误，请联系客服人工认证。"){
							this.recognizing = false;
						} else {
							this.recognizing = true;
						}
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
							this.stepParams.driverName = res.rspBody.driverName;
							this.stepParams.licenseId = res.rspBody.licenseId;
							this.stepParams.permitType = res.rspBody.permitType;
							this.stepParams.issuingOrganizations = res.rspBody.issuingOrganizations;
							this.stepParams.dlStatus = res.rspBody.dlStatus;
							var validFrom = res.rspBody.validFrom;
							var validTo = res.rspBody.validTo;
							
							var isRecognize1 = that.hanleCheckDate(validFrom);
							if (isRecognize1) {
								that.stepParams.validFrom = res.rspBody.validFrom;
							} else {
								that.stepParams.validFrom = "";
							}
							if (validTo == "长期") {
								that.stepParams.validTo = validTo;
								that.isChooseLong = true;
							} else {
								that.isChooseLong = false;
								var isRecognize2 = that.hanleCheckDate(validTo);
								if (isRecognize2) {
									that.stepParams.validTo = res.rspBody.validTo;
									if (res.rspBody.validTo && res.rspBody.validTo == "2999-12-29") {
										this.isChooseLong = true
									}
								} else {
									that.stepParams.validTo = "";
								}
							}
						
							console.log(validFrom, validTo, '1轻武器');
							
							
							//认证状态
							var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
							userInfo.attrs.driverVerify = res.rspBody.driverVerify;
							this.driverStatus = res.rspBody.driverVerify;
							this.isEdit = res.rspBody.licenseId  ? false : true;
							this.isDetail = res.rspBody.licenseId  ? true : false;
							uni.setStorageSync("userInfo", JSON.stringify(userInfo));
							if (res.rspBody.driverVerify != 1) {
								var driverVerifyInfo = res.rspBody.driverVerifyInfo;
								var licenseMainImg = res.rspBody.licenseMainImg;
								var licenseSubImg = res.rspBody.licenseSubImg;
								this.driverVerifyInfo = res.rspBody.driverVerifyInfo;
								if (driverVerifyInfo) {
									if (!licenseMainImg) {
										this.driverVerifyInfo = this.driverVerifyInfo + ',' + "驾驶证主页未上传"
									}
									if (!licenseSubImg) {
										this.driverVerifyInfo = this.driverVerifyInfo + '，' + "驾驶证副页未上传"
									}
								} else {
									var infoArr = [];
									if (!licenseMainImg) {
										infoArr.push("驾驶证主页未上传")
									}
									if (!licenseSubImg) {
										infoArr.push("驾驶证副页未上传")
									}
									this.driverVerifyInfo = infoArr.join(',')
								}
								
							} else {
								this.driverVerifyInfo = ""
							}
						} else {
							//未认证
							this.certified = 1;
							this.isEdit = true;
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
				if (!this.isEdit) {
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
						this.stepParams.driverName = body.name;
						
						var validFrom = body.validFrom;
						var validTo = body.validTo;
						var isRecognize1 = this.hanleCheckDate(validFrom);
						if (isRecognize1) {
							this.stepParams.validFrom = body.validFrom;
						} else {
							this.stepParams.validFrom = "";
						}
						if (validTo == "长期") {
							this.stepParams.validTo = validTo;
							this.isChooseLong = true;
						} else {
							this.isChooseLong = false;
							var isRecognize2 = this.hanleCheckDate(validTo);
							if (isRecognize2) {
								this.stepParams.validTo = body.validTo;
							} else {
								this.stepParams.validTo = "";
							}
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
				this.stepParams.validFrom = e.detail.value;
				console.log("选择的有效期:", e);
				this.$forceUpdate();
			},
			changeValidToDate(e) {
				this.stepParams.validTo = e.detail.value;
				this.$forceUpdate();
			},
			showDatePop() {
				this.$refs.datePopup.open();
			},
			chooseLong() {
				this.isChooseLong = !this.isChooseLong;
			},
			cancelTo() {
				this.$refs.datePopup.close()
			},
			confirmTo() {
				this.$refs.datePopup.close()
				var isChooseLong = this.isChooseLong;
				if (isChooseLong) {
					this.stepParams.validTo = "长期" 
				} else {
					this.stepParams.validTo = this.year + '-' + this.month + '-' + this.day
				}
			},
			bindChange(e) {
				const val = e.detail.value
				var year = this.years[val[0]]
				var month = this.months[val[1]]
				var day = this.days[val[2]]
				this.year = year;
				this.month = month;
				this.day = day;
				this.isChooseLong = false;
				this.dateValue = val;
				this.$forceUpdate();
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F8F8F8;
	}
	.newDriverVerify {
		.datePopUp {
			width: 100vw;
			height: 550rpx;
			display: flex;
			flex-direction: column;
			background-color: #ffffff;
			border-radius: 12rpx 12rpx 0 0;
		
			.opt {
				width: 100vw;
				padding: 0 36rpx;
				height: 100rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.item {
					font-size: 32rpx;
		
					&.cancel {
						color: #666;
					}
		
					&.confirm {
						color: #5283FF;
					}
				}
			}
			.cont {
				width: calc(100vw - 72rpx);
				height: 84rpx;
				border-radius: 8rpx;
				color: #464646;
				margin: 10rpx 36rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				box-shadow: 0 0 16rpx 2rpx rgba(67,150,248,0.28);
				background-color: #FFF;
				&.active {
					background-color: #4396F8;
					color: #ffffff;
				}
			}
			.picker-view {
				width: 750rpx;
				flex: 1;
				margin-top: 20rpx;
			}
			.picker-item {
				height: 40px;
				line-height: 40px;
				text-align: center;
			}
		}
		.backPopup {
			width: 618rpx;
			height: 416rpx;
			display: flex;
			flex-direction: column;
			background-color: #FFFFFF;
			padding: 48rpx;
			box-sizing: border-box;
			border-radius: 24rpx;
			.backTitle {
				font-size: 44rpx;
				font-weight: 500;
				color: #000000;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.cont {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 36rpx;
				padding: 0 48rpx;
				line-height: 48rpx;
				box-sizing: border-box;
				color: #000000;
				
			}
			.optbtn {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				.opt {
					font-weight: 500;
					width: 270rpx;
					height: 80rpx;
					font-size: 32rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 16rpx;
					&.confirm {
						width: 270rpx;
						color: #FFFFFF;
						background-color: rgba(252, 92, 6, 1);
					}
					&.cancel {
						width: 208rpx;
						background-color: rgba(200, 200, 200, 1);
						color: #FFFFFF;
						margin-right: 44rpx;
					}
				}
			}
			
		}
		.aduitBox {
			margin-top: 16rpx;
			padding        : 16rpx 50rpx;
			background-color: #f8f8f8;
			.auditMsg {
			  font-size       : 28rpx;
			  color           : #EB6464;
			  font-weight: 500;
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
				position: relative;
				.driverLicenseFont {
					background-image: url('../../../static/images/newDriverVerify/driverLicenseFont.png');
				}
				.driverLicenseBack {
					background-image: url('../../../static/images/newDriverVerify/driverLicenseBack.png');
				}
				.red {
					position: absolute;
					top: -30rpx;
					right: 0;
					z-index: 1;
					color: red;
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
				.licenseTitle {
					font-size: 44rpx;
					font-weight: 500;
					color: #000000;
					margin-left: 36rpx;
				}
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
				.driverTitle {
					text-align: right;
					padding: 0 50rpx;
					box-sizing: border-box;
					font-weight: 500;
					color: #333333;
					font-size: 28rpx;
				}
				.subTitle {
					font-size    : 24rpx;
					font-weight  : 600;
					color        : #333333;
					margin-left: 10rpx;
					&.success {
					  color: #56B836;
					}
					&.error {
					  color: #EB6464;
					}
				}
				.imageGroup {
					padding: 24rpx 50rpx 18rpx 50rpx;
					display: flex;
					justify-content: space-between;
					
					.idCardImg {
					  width            : 308rpx;
					  height           : 182rpx;
					  border           : 2rpx dashed #E9EDF5;
					  background-repeat: no-repeat;
					  background-size  : 100%;
					  display: flex;
					  flex-direction: column;
					  justify-content: center;
					  align-items: center;
					  .upLoadHint {
					    font-size  : 28rpx;
					    color      : #000000;
					    text-align : center;
					    line-height: 40rpx;
					    font-weight: 500;
					  }
					  .addImage {
					    width        : 48rpx;
					    height       : 48rpx;
					    margin-bottom: 16rpx;
					  }
					
					  .img1 {
					    width : 308rpx;
					    height: 182rpx;
					  }
					}
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
				padding-top: 12rpx;
				.certificationDetails {
					padding: 12rpx 36rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					.subTitle {
						font-size: 32rpx;
						color: #666;
					}
					.detailsMsg {
						text-align: right;
						font-size: 32rpx;
						font-weight: 400;
						color: #333;
						width: 444rpx;
						height: 40px;
						padding: 0 16rpx;
						box-sizing: border-box;
						border-radius: 12rpx;
						display:flex;
						flex-direction: row;
						justify-content: flex-end;
						align-items: center;
						&.active {
							background-color: #F8F8F8;
							font-weight: 500;
						}
						text {
							font-weight: 400;
						}
						.errorRed {
							color: red;
						}
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
			background: rgba(151, 181, 255, 1);
			border-radius: 24rpx;
			text-align: center;
			font-size: 28rpx;
			color:#FFF;
			&.active {
				background-color: #5283FF;
			} 
			&.submitBtnActive {
				background: rgba(252,92,6,.7);
			}
			&.submitBtnActive.active {
				background: #FC5C06;
			}
		}
		
		.picturePopupBox {
			background-color: #FFF;
			width: 508rpx;
			padding: 42rpx 0 36rpx 0;
			box-sizing: border-box;
			border-radius: 24rpx;
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
			line-height: 40rpx;
	    }
	    .optbtn1 {
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
	.photo-content {
		height: 100rpx;
		font-size: 26rpx;
		padding: 20rpx
		
	}
</style>
