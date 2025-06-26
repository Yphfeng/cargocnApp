<template>
	<view class="newCarVerify">
		<view class="aduitBox" v-if="showErrMsg()">
			<view class="auditMsg">未认证原因：{{showErrMsg()}}</view>
		</view>
		
		<view class="mainTitle">
			<view class="title">上传行驶证（必填）</view>
			<image class="auditIcon" src="../../../static/images/newCarVerify/auditT.png" v-if="isDetail && params.status === 1"></image>
			<image class="auditIcon" src="../../../static/images/newCarVerify/auditF.png" v-if="isDetail && params.status === 0"></image>
		</view>
		<view class="mainUpLoadBox">
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseFont" @click="showPopup('vlF')" v-if="!params.licenseMainImg">
					<image class="upLoadIcon" src="../../../static/images/newCarVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传行驶证主页</view>
				</view>
				<image :src="params.licenseMainImg" v-else class="upLoadBtn" @click="showPopup('vlF')"></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseBack" @click="showPopup('vlB')" v-if="!params.licenseSubImg">
					<image class="upLoadIcon" src="../../../static/images/newCarVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传行驶证副页</view>
				</view>
				<image :src="params.licenseSubImg" v-else class="upLoadBtn" @click="showPopup('vlB')"></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseDate" v-if="!params.licenseBackImg" @click="showPopup('vlD')">
					<image class="upLoadIcon" src="../../../static/images/newCarVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传行驶证年审有效期页</view>
				</view>
				<image :src="params.licenseBackImg" v-else class="upLoadBtn" @click="showPopup('vlD')"></image>
			</view>
		</view>
		
		<view v-show="isEdit">
			<view class="certificationDetails" @click="toCarView">
				<view class="subTitle">车长车型<text class="syb">*</text></view>
				<view class="detailsMsg" v-if="params.ext1 && params.vehicleLength">{{params.ext1}}/{{params.vehicleLength}}</view>
				<view v-else class="detailsMsg">请选择车型车长</view>
			</view>
			<view class="certificationDetails" @click="toCarNoPage('1')">
				<view class="subTitle">车辆牌照号<text class="syb">*</text></view>
				<view class="detailsMsg">{{params.plateNo}}</view>
			</view>
			<view class="certificationDetails">
				<view class="subTitle">行驶证有效期至</view>
				<view class="detailsMsg">
					<uni-datetime-picker
					  type="date"
						:disabled="isDetail"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择'"
						v-model="params.vehicleValidTo"
						@change="val => changeVehicleValidToDate(val,'1')"
						style="text-align: right;color:#666666;"
					/>
				</view>
				
			</view>
		</view>
		
		<view class="mainTitle">
			<view class="title">挂车行驶证</view>
			<image class="auditIcon" src="../../../static/images/newCarVerify/auditF.png" v-if="isDetail && params.guaDlStatus === 0"></image>
			<image class="auditIcon" src="../../../static/images/newCarVerify/auditT.png" v-if="isDetail && params.guaDlStatus === 1"></image>
		</view>
		<view class="mainUpLoadBox">
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseFont" v-if="!params.gLicenseMainImg" @click="showPopup('trailerF')">
					<image class="upLoadIcon" src="../../../static/images/newCarVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传行驶证主页</view>
				</view>
				<image :src="params.gLicenseMainImg" v-else class="upLoadBtn" @click="showPopup('trailerF')"></image>
				
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseBack" v-if="!params.gLicenseSubImg" @click="showPopup('trailerB')">
					<image class="upLoadIcon" src="../../../static/images/newCarVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传行驶证副页</view>
				</view>
				<image :src="params.gLicenseSubImg" v-else class="upLoadBtn" @click="showPopup('trailerB')"></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseDate" v-if="!params.guaLicenseBackImg" @click="showPopup('trailerD')">
					<image class="upLoadIcon" src="../../../static/images/newCarVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传行驶证年审有效期页</view>
				</view>
				<image :src="params.guaLicenseBackImg" v-else class="upLoadBtn" @click="showPopup('trailerD')"></image>
			</view>
		</view>
		
		<view v-show="gIsEdit">
			<view class="certificationDetails" @click="toCarNoPage('2')">
				<view class="subTitle">挂车牌照号<text class="syb">*</text></view>
				<view class="detailsMsg">{{params.gPlateNo}}</view>
			</view>
			<view class="certificationDetails">
				<view class="subTitle">行驶证有效期至</view>
				<view class="detailsMsg">
					<uni-datetime-picker
					  type="date"
						:disabled="isDetail"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择'"
						v-model="params.guaValidTo"
						@change="val => changeVehicleValidToDate(val,'2')"
						style="text-align: right;color:#666666;"
					/>
				</view>
				
			</view>
		</view>
		
		
		<view class="mainTitle">
			<view class="title">车辆照片</view>
		</view>
		<view class="mainUpLoadBox">
			<view class="upLoadContent">
				<view class="upLoadBtn groupPhoto" v-if="!params.vehicleImg" @click="showPopup('gpF')">
					<image class="upLoadIcon" src="../../../static/images/newCarVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传车头人车合影</view>
				</view>
				<image :src="params.vehicleImg" class="upLoadBtn" @click="showPopup('gpF')"></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn groupPhoto" v-if="!params.guaImg" @click="showPopup('gpB')">
					<image class="upLoadIcon" src="../../../static/images/newCarVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传车挂人车合影</view>
				</view>
				<image :src="params.guaImg" class="upLoadBtn" @click="showPopup('gpB')"></image>
			</view>
		</view>
		<view class="submitBtn" @click="toConfirm()">保存</view>
		
		<!-- 拍照弹窗 -->
		<uni-popup ref="takePicturePopup" type="center">
			<view class="picturePopupBox">
				<view class="popupTitle">请按照示例上传</view>
				<image class="upLoadSampleTrue" v-if="upLoadType == 'vlF' || upLoadType == 'trailerF'" src="../../../static/images/newCarVerify/vlSampleT.png"></image>
				<image class="upLoadSampleFalse" v-if="upLoadType == 'vlF' || upLoadType == 'trailerF'" src="../../../static/images/newCarVerify/vlSampleF.png"></image>
				<image class="upLoadSampleTrue" v-if="upLoadType == 'vlB' || upLoadType == 'trailerB'" src="../../../static/images/newCarVerify/vlSampleT1.png"></image>
				<image class="upLoadSampleFalse" v-if="upLoadType == 'vlB' || upLoadType == 'trailerB'" src="../../../static/images/newCarVerify/vlSampleF1.png"></image>
				<image class="upLoadSampleTrue" v-if="upLoadType == 'vlD' || upLoadType == 'trailerD'" src="../../../static/images/newCarVerify/vlSampleT1.png"></image>
				<image class="upLoadSampleFalse" v-if="upLoadType == 'vlD' || upLoadType == 'trailerD'" src="../../../static/images/newCarVerify/vlSampleF1.png"></image>
				<image class="upLoadSampleTrue" v-if="upLoadType == 'gpF' || upLoadType == 'gpB'" src="../../../static/images/newCarVerify/gpSampleT.png"></image>
				<image class="upLoadSampleFalse" v-if="upLoadType == 'gpF' || upLoadType == 'gpB'" src="../../../static/images/newCarVerify/gpSampleF.png"></image>
				
				<view class="popupBtn" @click="sendPhoto">拍照</view>
				<view class="popupBtn" @click="sendFromAl">从手机相册选择</view>
				<view class="popupBtn" @click="closePicturePopup()">取消</view>
			</view>
		</uni-popup>
		<!-- 保存弹窗 -->
		<uni-popup ref="confirmPopup" type="center">
			<view class="popupConfirmBox">
				<view class="content">是否保存行驶证信息</view>
				<view class="btnGroup">
					<view class="btn" @click="closeConfirmPopup()">取消</view>
					<view class="btn" @click="saveInfo">保存</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="backPopup" type="center">
			<view class="backPopup">
				<view class="cont">您还没保存信息，是否退出</view>
				<view class="optbtn">
					<view class="cancel opt" @click="cancelBack">取消</view>
					<view class="confirm opt" @click="confirmBack">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	var PhotoModule = uni.requireNativePlugin("PhotoModule");
	let platForm = uni.getSystemInfoSync().platform;
	export default {
		data() {
			return {
				isUpLoading: false, //是否正在上传
				// vlF行驶证主页、vlB行驶证副页、vlD行驶证有效期、trailerF挂车主页、trailerB挂车副页、trailerD挂车有效期、gpF车头合影、gpB车挂合影
				upLoadType: '',
				isDetail: false,
				isEdit: false,
				gIsEdit: false,
				params: {
					licenseMainImg: '',
					licenseSubImg: '',
					licenseBackImg: '',
					gLicenseMainImg: '',
					guaLicenseBackImg: '',
					gLicenseSubImg: '',
					vehicleImg: '',
					guaImg: '',
					vehicleLength: '',
					ext1: '',
					vehicleIdNo: '',
					guaVehicleIdNo: '',
					plateNo: '',
					gPlateNo: '',
					guaVehicleLength: '',
					guaModel: '',
					ownerName: '',
					guaOwnerName: '',
					vehicleType: '',
					guaVehicleType: '',
					gabarite: '',
					guaGabarite: '',
					vehiclePlateColor: '',
					guaPlateColor: '',
					vehicleEnergyType: '',
					guaEnergyType: '',
					totalWeight: '',
					gTotalWeight: '',
					fullWeight: '',
					guaCapacity: '',
					checkWeight: '',
					gRatifiedLoadWeight: '',
					is_hang: 0,
					useFor: '',
					guaUseFor: '',
					model: '',
					guaModel: '',
					issuingOrganizations: '',
					guaIssuingOrganizations: '',
					regDate: '',
					guaRegDate: '',
					checkDate: '',
					guaCheckDate: '',
					vehicleValidTo: '',
					guaValidTo: '',
					recordCode: '',
					guaRecordCode: '',
					
				}
			}
		},
		onLoad(options) {
			var _this = this;
			var result = options.result;
			console.log(result, '编辑参数111');
			var params = this.params;
			if (result) {
				result = JSON.parse(result);
				this.params = Object.assign({}, params, result);
				this.$forceUpdate();
			}
			
			uni.$on("driverVal", data => {
				console.log(data, 'aa')
				var vehicleLength = data.vehicleLength;
				var vehicleModel = data.vehicleModel;
				if (vehicleLength) {
					this.params.ext1 = vehicleModel[0].typeName;
					this.commonCarModelCode = vehicleModel[0].typeCode;
				}
				if (vehicleModel) {
					this.params.vehicleLength = vehicleLength[0].typeName
					this.commonCarLengthCode = vehicleLength[0].typeCode
				}
				this.$forceUpdate();
				
			})
			uni.$on('acceptSelectedPlateNo', function(plateNo) {
			    _this.params.plateNo = plateNo;
			});
			
			uni.$on('acceptSelectedPlateNoGua', function(plateNo) {
			    _this.params.gPlateNo = plateNo;
			});
			
			
		},
		onUnload() {
		    uni.$off('acceptSelectedPlateNo');
			uni.$off('acceptSelectedPlateNoGua');
		},
		
		onBackPress(e) {
			
			// if (e.from == 'backbutton') {
			// 	//已认证，点击编辑后返回弹框提示
			// 	if (this.isDetail && this.params.status == 1) {
			// 		this.$refs.backPopup.open();
			// 		// this.$refs.mobilePopup.open();
			// 		return true
			// 	}
			// }
		},
	
		
		methods: {
			cancelBack() {
				this.$refs.backPopup.close()
			},
			confirmBack() {
				this.$refs.backPopup.close();
				
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 1000)
			},
			showErrMsg() {
				var dlStatus = this.params.dlStatus;
				var guaDlStatus = this.params.guaDlStatus;
				var msg = [];
				if (dlStatus === 0) {
					msg.push('该行驶证已过期')
				}
				if (guaDlStatus === 0) {
					msg.push('该挂车行驶证已过期')
				}
				return msg.join(',')
			},
			changeVehicleValidToDate(e,index) {
				console.log(e,index)
				if(index == 1) {
					this.params.vehicleValidTo = e;
				}else {
					this.params.guaValidTo = e;
				}
				
				
			},
			toCarNoPage(index) {
				if (this.isDetail) return;
				//车牌号选择
				uni.navigateTo({
					url: './carNo?flag=' + index
				})
			},
			toCarView() {
				if (this.isDetail) return;
				var carLen = this.commonCarLength;
				var carModel = this.commonCarModel;
				if (carLen && carModel) {
					var obj = {
						carModel: carModel,
						carLen: carLen,
					}
					uni.navigateTo({
						url: '/pages/my/carVerify/carType?source=driver&carData=' + JSON.stringify(obj)
					})
				} else {
					uni.navigateTo({
						url: '/pages/my/carVerify/carType?source=driver'
					})
				}
			},
			showPopup(type) {
				var that = this;
				if (this.isDetail) {
					//预览vlF行驶证主页、vlB行驶证副页、vlD行驶证有效期、trailerF挂车主页、trailerB挂车副页、trailerD挂车有效期、gpF车头合影、gpB车挂合影
					var urlArr = [];
					if (type == "vlF") {
						that.params.licenseMainImg && urlArr.push(that.params.licenseMainImg)
					} else if (type == "vlB") {
						that.params.licenseSubImg && urlArr.push(that.params.licenseSubImg)
					} else if (type == "vlD") {
						that.params.licenseBackImg && urlArr.push(that.params.licenseBackImg)
					} else if (type == "trailerF"){
						that.params.gLicenseMainImg && urlArr.push(that.params.gLicenseMainImg)
					} else if (type == "trailerB") {
						that.params.gLicenseSubImg && urlArr.push(that.params.gLicenseSubImg)
					} else if (type == "trailerD") {
						that.params.guaLicenseBackImg && urlArr.push(that.params.guaLicenseBackImg)
					} else if (type == "gpF") {
						that.params.vehicleImg && urlArr.push(that.params.vehicleImg)
					} else {
						that.params.guaImg && urlArr.push(that.params.guaImg)
					}
					if (urlArr.length > 0) {
						uni.previewImage({
							current: 1, //预览图片的下标
							urls: urlArr //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
						})
					}
					return;
				}
				
				if (this.isUpLoading) return ;
				
				this.upLoadType = type;
				this.$refs.takePicturePopup.open();
			},
			closePicturePopup() {
				this.$refs.takePicturePopup.close();
			},
			toConfirm() {
				var that = this;
				
				var params = this.params;
				if (!that.params.plateNo){
					uni.showToast({
						title: '请输入车牌号',
						icon: 'none'
					})
					return;
				}
				
				if (!that.params.licenseMainImg) {
					uni.showToast({
						title: '请上传行驶证正页',
						icon: 'none'
					})
					return;
				}
				if (!that.params.licenseSubImg) {
					uni.showToast({
						title: '请上传行驶证副页',
						icon: 'none'
					})
					return;
				}
				if (!this.params.vehicleLength) {
					uni.showToast({
						title: '请选择车长',
						icon: 'none'
					})
					return;
				}
				if (!this.params.ext1) {
					uni.showToast({
						title: '请选择车型',
						icon: 'none'
					})
					return;
				}
				
				
				var vehicleValidTo = this.params.vehicleValidTo;
				var nowStr = new Date().getTime();
				var validStr = vehicleValidTo.replace(/-/g, '/');
				var calid = new Date(validStr).getTime();
				if (!this.isConfirmVilid) {
					if (calid < nowStr) {
						this.isConfirmVilid = true;
						uni.showToast({
							title: '您的行驶证有效期已过，会影响认证状态，请确认是否重新填写',
							icon: 'none',
							duration: 4000
						})
						return;
					}
				}
				this.$refs.confirmPopup.open();
			},
			closeConfirmPopup() {
				this.$refs.confirmPopup.close();
			},
			sendFromAl() {
				//从手机相册选择
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
						that.isUpLoading = true;
						if (type == "vlF" || type == "trailerF") {
							//主页
							that.uploadFrontImage(tempFilePaths[0])
						} else if (type == "vlB" || type == "trailerB") {
							//副业
							that.uploadBackImage(tempFilePaths[0])
						} else {
							that.uploadFile(tempFilePaths[0])
						}
					}
				});
				
			},
			sendPhoto() {
				//拍照
				var that = this;
				this.$refs.takePicturePopup.close();
				var type = this.upLoadType;
				if (platForm == "android") {
					PhotoModule.sendForCarema({
						type: type
					}, rest => {
						//获取图片后上传阿里云
						that.isUpLoading = true;
						if (type == "vlF" || type == "trailerF") {
							//主页
							that.uploadFrontImage(rest.uri)
						} else if (type == "vlB" || type == "trailerB") {
							//副业
							that.uploadBackImage(rest.uri)
						} else {
							that.uploadFile(rest.uri)
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
							that.isUpLoading = true;
							if (type == "vlF" || type == "trailerF") {
								//主页
								that.uploadFrontImage(tempFilePaths[0])
							} else if (type == "vlB" || type == "trailerB") {
								//副业
								that.uploadBackImage(tempFilePaths[0])
							} else {
								that.uploadFile(tempFilePaths[0])
							}
							
					    }
					});
				}
			},
			//行驶证主页识别
			uploadFrontImage: function(path) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/baidu/ocr/v1/vehicle/front", path)
				.then(result => {
					that.isUpLoading = false;
					uni.hideLoading()
					if (result.retCode == '0000000') {
						var rspBody = result.rspBody;
						if (that.upLoadType == "vlF") {
							//行驶证主页识别
							that.isEdit = true; // 行驶证编辑
							that.params.licenseMainImg = rspBody.image;
							that.params.plateNo = rspBody.plateNo;
							that.params.vehicleIdNo = rspBody.vin;
							that.params.ownerName = rspBody.owner;
							that.params.vehicleType = rspBody.type;
							that.params.engineNo = rspBody.engineNo;
							that.params.regDate = rspBody.registerDate;
							that.params.checkDate = rspBody.issueDate;
							that.params.issuingOrganizations = rspBody.issuingOrganizations;
							that.params.useFor = rspBody.useCharacter;
							that.params.model = rspBody.model;
							that.params.address = rspBody.address;
							
							//行驶证有效期
							 var validData = rspBody.registerDate;
							 var vehicleValidTo = "";
							 var vehicleValidEdit = that.params.vehicleValidTo;
							 var isVehicleValid = vehicleValidEdit.split("-");
							 if (!validData) {
								vehicleValidTo = ""
							 } else {
								var day = validData.split('-')[2];
								var record = that.params.record;
								if (!record) {
									if (vehicleValidEdit && isVehicleValid.length >= 2) {
										var dateStr = vehicleValidEdit.split("-")[0] + '-' + vehicleValidEdit.split("-")[1] + '-' + day
										vehicleValidTo = dateStr
									} else {
										vehicleValidTo = ""
									}

								} else {
								  var newStr = record.replace("年", "-");
								  var newStr2 = newStr.replace("月", "-");
								  var resultStr = newStr2 + day;
								  vehicleValidTo = resultStr;
								}
							}
							that.params.vehicleValidTo = vehicleValidTo;
						} else {
							//挂车行驶证主页识别
							that.gIsEdit = true; //挂车行驶证编辑
							that.params.gLicenseMainImg = rspBody.image;
							that.params.gPlateNo = rspBody.plateNo;
							that.params.guaVehicleIdNo = rspBody.vin;
							that.params.guaOwnerName = rspBody.owner;
							that.params.guaVehicleType = rspBody.type;
							that.params.guaEngineNo = rspBody.engineNo;
							that.params.guaRegDate = rspBody.registerDate;
							that.params.guaCheckDate = rspBody.issueDate;
							that.params.guaIssuingOrganizations = rspBody.issuingOrganizations;
							that.params.guaUseFor = rspBody.useCharacter;
							that.params.guaModel = rspBody.model;
							that.params.guaAddress = rspBody.address;
							
							//行驶证有效期
							 var validData = rspBody.registerDate;
							 var vehicleValidEdit = that.params.guaValidTo;
							 var isVehicleValid = vehicleValidEdit.split("-");
							 var vehicleValidTo = "";
							 if (!validData) {
								 
								vehicleValidTo = ""
							 } else {
								var day = validData.split('-')[2];
								var record = that.params.guaRecord;
								if (!record) {
									if (vehicleValidEdit && isVehicleValid.length >= 2) {
										var dateStr = vehicleValidEdit.split("-")[0] + '-' + vehicleValidEdit.split("-")[1] + '-' + day
										vehicleValidTo = dateStr
									} else {
										vehicleValidTo = ""
									}
								} else {
								  var newStr = record.replace("年", "-");
								  var newStr2 = newStr.replace("月", "-");
								  var resultStr = newStr2 + day;
								  vehicleValidTo = resultStr;
								}
							}
							console.log(vehicleValidTo,'vehicleValidTo')
							that.params.guaValidTo = vehicleValidTo;
						}
						that.$forceUpdate();
					} else {
						uni.showToast({
							title: '识别失败',
							icon: 'none'
						})
					}
					
				}).catch(err => {
					that.isUpLoading = false;
					uni.hideLoading()
					uni.showToast({
						title: '未识别出有效的行驶证',
						icon: 'none'
					})
				})
			},
			//行驶证副业识别
			uploadBackImage: function(path) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/baidu/ocr/v1/vehicle/back", path)
				.then(result => {
					that.isUpLoading = false;
					console.log(result, '行驶证副页')
					console.log(that.upLoadType,'that.upLoadType')
					uni.hideLoading();
					if (result.retCode == '0000000') {
						
						var rsp = result.rspBody;
						if (that.upLoadType == "vlB") {
							that.isEdit = true;
							that.params.licenseSubImg = rsp.image;
							that.params.recordCode = rsp.recordCode;
							if (rsp.passengersNum) {
								var passengersNum = rsp.passengersNum.slice(0, -1);
								that.params.passengersNum = passengersNum;
							}
							
							that.params.fullWeight = rsp.prepareQuality;
							//核定载质量-》准牵引质量有就取，没有取核定载质量
							if (rsp.leadQuality) {
								that.params.vehicleCapacity = rsp.leadQuality;
							} else {
								that.params.vehicleCapacity = rsp.checkQuality;
							}
							
							that.params.gabarite = rsp.overallSize;
							that.params.remark = rsp.remark;
							that.params.record = rsp.record;
							that.params.vehicleEnergyType = rsp.energy;
							that.params.totalWeight = Number(that.params.vehicleCapacity) + Number(that.params.fullWeight);
							
							//行驶证有效期
							 var validData = this.params.regDate;
							 
							 var vehicleValidTo = "";
							 if (!validData) {
							 vehicleValidTo = ""
							 } else {
								var day = validData.split('-')[2];
								var record = rsp.record;
								if (!record) {
								  vehicleValidTo = ""
								} else {
								  var newStr = record.replace("年", "-");
								  var newStr2 = newStr.replace("月", "-");
								  var resultStr = newStr2 + day;
								  vehicleValidTo = resultStr;
								}
							 }
							that.params.vehicleValidTo = vehicleValidTo;
							that.$forceUpdate();
						} else {
							that.gIsEdit = true;
							that.params.gLicenseSubImg = rsp.image;
							that.params.guaRecordCode = rsp.recordCode;
							if (rsp.passengersNum) {
								var passengersNum = rsp.passengersNum.slice(0, -1);
								that.params.guaPassengersNum = passengersNum;
							}
							
							that.params.guaCapacity = rsp.prepareQuality;
							//核定载质量-》准牵引质量有就取，没有取核定载质量
							if (rsp.leadQuality) {
								that.params.gRatifiedLoadWeight = rsp.leadQuality;
							} else {
								that.params.gRatifiedLoadWeight = rsp.checkQuality;
							}
							
							that.params.guaGabarite = rsp.overallSize;
							that.params.guaRemark = rsp.remark;
							that.params.guaRecord = rsp.record;
							that.params.guaEnergyType = rsp.energy;
							that.params.gTotalWeight = Number(that.params.gRatifiedLoadWeight) + Number(that.params.guaCapacity);
							
							//行驶证有效期
							 var validData = this.params.guaRegDate;
							 console.log(validData,'validDatavalidData')
							 var vehicleValidTo = "";
							 if (!validData) {
							 vehicleValidTo = ""
							 } else {
								var day = validData.split('-')[2];
								console.log(day,'dayday')
								var record = rsp.record;
								if (!record) {
								  vehicleValidTo = ""
								} else {
									var newStr2;
								  var newStr = record.replace("年", "-");
								  console.log(newStr,'newStr')
								  if(newStr.indexOf('月') != -1 ) {
									  newStr2 = newStr.replace("月", "-");
								  }else {
									  newStr2 = newStr + '-'
								  }
								  var resultStr = newStr2 + day;
								  vehicleValidTo = resultStr;
								}
							 }
							 console.log(vehicleValidTo,'vehicleValidTo')
							that.params.guaValidTo = vehicleValidTo;
							that.$forceUpdate();
						}
					} else {
						uni.showToast({
							title: '未识别出有效行驶证副页',
							icon: 'none',
							duration: 3000
						})
					}
					
				}).catch(err => {
					that.isUpLoading = false;
					console.log(err)
					uni.showToast({
						title: err.retDesc,
						icon: 'none',
						duration: 3000
					})
					uni.hideLoading();
				})
			},
			//普通上传
			uploadFile(path) {
				var that = this;
				var flag = this.upLoadType;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/file/upload", path)
				.then(result => {
					that.isUpLoading = false;
					uni.hideLoading();
					if (result.retCode == '0000000') {
						console.log(flag, result, 'upfile');
						if (flag == "vlD") {
							//行驶证年审有效期页主页
							that.params.licenseBackImg = result.rspBody[0].url;
						} else if (flag == "trailerD") {
							//挂车行驶证年审有效期页
							that.params.guaLicenseBackImg = result.rspBody[0].url;
						} else if (flag == "gpF") {
							//车头人车合影
							that.params.vehicleImg = result.rspBody[0].url;
						} else {
							//车挂人车合影
							that.params.guaImg = result.rspBody[0].url;
						}
						that.$forceUpdate();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					
				}).catch(err => {
					console.log(err)
					that.isUpLoading = false;
					uni.hideLoading();
				})
			},
			async getVehicleDetail(plateNo) {
				try{
					var userInfo = uni.getStorageSync("userInfo");
					if (!userInfo) {
						uni.hideLoading();
						return;
					};
					var driverId = JSON.parse(userInfo).attrs.driverId;
					var res = await ship.postRequest("/yh/vehicle/select/vehicle/detail", {
						driverId,
						plateNo
					})
					uni.hideLoading();
					console.log(res, '车辆详情')
					if (res.retCode == "0000000") {
						if (res.rspBody) {
							this.isDetail = true;
							
						} else {
							this.isDetail = false;
							
						}
						this.params = res.rspBody;
						this.commonCarModel = res.rspBody.ext1
						this.commonCarLength = res.rspBody.vehicleLength
						
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
					console.log(e)
				}
			},
			saveInfo() {
				var that = this;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				this.$refs.confirmPopup.close();
				var driverId = JSON.parse(userInfo).attrs.driverId;
				uni.showLoading({
					title: '请稍候...',
				})
				var parm = this.params;
				parm.carModelDictCode = this.commonCarModelCode;
				parm.carLengthDictCode = this.commonCarLengthCode;
				//司机的driverId
				parm.driverId = driverId;
				console.log(parm, '参数');
							
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var userCode = JSON.parse(userInfo).attrs.userCode;
				parm.userCode = userCode;
				ship.postRequest("/yh/vehicle/license/upload/save", parm).then(function(res) {
					console.log(res);
					if (res.retCode == '0000000') {
						uni.showToast({
							title: '车辆保存成功'
						})
						var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
						userInfo.attrs.vehicleVerify = 1;
						console.log(userInfo, 'aa')
						uni.setStorageSync("userInfo", JSON.stringify(userInfo));
						uni.$emit("vehicleRefresh", parm.plateNo);
						uni.navigateBack({
							delta: 1
						})
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.newCarVerify {
		padding-bottom: 194rpx;
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
		}
		.uni-date-editor--x__disabled {
			opacity: 1;
		}
		.input-placeholder {
			font-size: 24rpx !important;
			color: #666666 !important;
		}
		.uni-input-input {
			color:#666666;
		}
		.aduitBox {
			display: flex;
			justify-content: center;
			padding: 12rpx 36rpx 20rpx 36rpx;
			.auditMsg {
				padding: 8rpx 26rpx;
				background-color: rgba(235, 100, 100, 1);
				box-shadow: 0 0 14rpx 4rpx rgba(235, 100, 100, 0.63);
				height: 30rpx;
				line-height: 30rpx;
				font-size: 22rpx;
				color: #FFFFFF;
				border-radius: 48rpx;
			}
		}
		.mainTitle {
			height: 44rpx;
			padding: 0 36rpx;
			display: flex;
			align-items: center;
			margin-top: 10rpx;
			.title {
				line-height: 44rpx;
				font-size: 32rpx;
				font-weight: 600;
				color: #333333;
			}
			.auditIcon {
				width: 30rpx;
				height: 29rpx;
				margin-left: 12rpx;
			}
		}
		.mainUpLoadBox {
			padding: 20rpx 36rpx 0 36rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			// .upLoadContent:nth-child(2n) {
			// 	margin-right:0;
			// }
			.upLoadContent {
				width: 324rpx;
				height: 190rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
				.vehicleLicenseFont {
					background-image: url('../../../static/images/newCarVerify/vehicleLicenseFont.png');
				}
				.vehicleLicenseBack {
					background-image: url('../../../static/images/newCarVerify/vehicleLicenseBack.png');
				}
				.vehicleLicenseDate {
					background-image: url('../../../static/images/newCarVerify/vehicleLicenseDate.png');
				}
				.groupPhoto {
					background-image: url('../../../static/images/newCarVerify/groupPhoto.png');
				}
				.upLoadBtn {
					width: 324rpx;
					height: 190rpx;
					background-repeat: no-repeat;
					background-size: 100%;
					box-sizing: border-box;
					margin-bottom: 38rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.upLoadIcon {
						width: 70rpx;
						height: 70rpx;
						display: block;
						margin:0 auto 8rpx auto;
					}
					.upLoadText {
						height: 28rpx;
						line-height: 28rpx;
						font-size: 20rpx;
						color: #333333;
						text-align: center;
					}
				}
			}
		}
		.certificationDetails + .certificationDetails {
			border-top: 2rpx solid #F0F0F0;
		}
		.certificationDetails {
			margin: 0 0 0 38rpx;
			padding: 16rpx 36rpx 16rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.subTitle {
				font-size: 30rpx;
				color: #333333;
				line-height: 33rpx;
				flex-shrink: 0;
				.syb {
					font-size: 32rpx;
					color:#EF3A3A;
				}
			}
			.detailsMsg {
				flex: 1;
				text-align: right;
				font-size: 26rpx;
				font-weight: 300;
				color: #666666;
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
