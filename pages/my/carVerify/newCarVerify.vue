<template>
	<view class="newCarVerify">	
		<view class="mainTitle">
			<view class="title">上传行驶证（必填）</view>
			<view v-if="!isEdit" class="row">
			  <image class="auditIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newCarVerify/auditT.png" v-if="isDetail && params.status === 1"></image>
			  <text v-if="isDetail && params.status === 1" class="sub success" style="width:100rpx">已认证</text>
			  <image class="auditIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newCarVerify/auditF.png" v-if="isDetail && params.status === 0"></image>
			  <text v-if="isDetail && params.status === 0" class="sub error" style="width:100rpx">未认证</text>
			</view>
		</view>
		<view v-if="!isEdit && params.status === 0 && showErrMsg()" class="errorRow">
		    <text class="sub error">{{showErrMsg()}}</text>
		</view>
		<view class="mainUpLoadBox">
			<view class="upLoadContent">
				<view class="red" v-if="isEdit">*</view>
				<view class="upLoadBtn vehicleLicenseFont" @click="showPopup('vlF')" v-if="!params.licenseMainImg">
					<image class="upLoadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png"></image>
					<view class="upLoadText">上传行驶证主页</view>
				</view>
				<image :src="params.licenseMainImg" v-else class="upLoadBtn" @click="showPopup('vlF')"></image>
			</view>
			<view class="upLoadContent">
				<view class="red" v-if="isEdit">*</view>
				<view class="upLoadBtn vehicleLicenseBack" @click="showPopup('vlB')" v-if="!params.licenseSubImg">
					<image class="upLoadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png"></image>
					<view class="upLoadText">上传行驶证副页</view>
				</view>
				<image :src="params.licenseSubImg" v-else class="upLoadBtn" @click="showPopup('vlB')"></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseDate" v-if="!params.licenseBackImg" @click="showPopup('vlD')">
					<image class="upLoadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png"></image>
					<view class="upLoadText">上传行驶证年审有效期页</view>
				</view>
				<image :src="params.licenseBackImg" v-else class="upLoadBtn" @click="showPopup('vlD')"></image>
			</view>
		</view>
		
		<view v-if="isOcrRight">
			<view class="certificationDetails" @click="toCarView">
				<view class="subTitle">车长车型<text class="syb" v-if="isEdit">*</text></view>
				<view class="detailsMsg" :class="{'active': isEdit}" v-if="params.ext1 && params.vehicleLength">{{params.ext1}}/{{params.vehicleLength}}</view>
				<view v-else class="detailsMsg" :class="{'activeRed': isEdit}">请选择></view>
			</view>
			<view class="certificationDetails" @click="toCarNoPage('1')">
				<view class="subTitle">车辆牌照号<text class="syb" v-if="isEdit">*</text></view>
				<view class="detailsMsg" :class="{'active': isEdit}">{{params.plateNo}}</view>
			</view>
			<view class="certificationDetails" id="certificationDetails" ref="certificationDetails">
				<view class="subTitle">行驶证有效期至</view>
				<view class="detailsMsg" :class="{errorRed: (params.dlStatus != 1 && !isEdit) || isUpdateEnd}" v-if="!isEdit">{{params.vehicleValidTo || "请选择"}}</view>
				<view class="detailsMsg active" v-else>
					<!-- <uni-datetime-picker
						type="date"
						:bgClass="isEdit ? 'bgClass' : 'defaultStyle'"
						:disabled="!isEdit"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择'"
						v-model="params.vehicleValidTo"
						@change="val => changeVehicleValidToDate(val,'1')"
						style="text-align: right;color:#666666;"
					/> -->
					<picker mode="date" :disabled="!isEdit" :value="params.vehicleValidTo" start="1970-01-01" data-selectDateType="1"  end="2100-01-01" @change="val => changeVehicleValidToDate(val,'1')" fields="day">
						<view class="detailsMsg" :class="{'active': isEdit, errorRed: isUpdateEnd}">
						<text v-if="params.vehicleValidTo" >{{params.vehicleValidTo}}</text>
						<text v-else>请选择</text>
						</view>
					</picker>
				</view>
				
			</view>
		</view>
		
		<view class="mainTitle">
			<view class="title">挂车行驶证</view>
			<view v-if="!isEdit" class="row">
			  <image class="auditIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newCarVerify/auditF.png" v-if="isDetail && params.guaDlStatus === 0"></image>
			  <text v-if="isDetail && params.guaDlStatus === 0" class="sub error">未认证</text>
			  <image class="auditIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newCarVerify/auditT.png" v-if="isDetail && params.guaDlStatus === 1"></image>
			  <text v-if="isDetail && params.guaDlStatus === 1" class="sub success">已认证</text>
			</view>
		</view>
		<view class="mainUpLoadBox">
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseFont" v-if="!params.gLicenseMainImg" @click="showPopup('trailerF')">
					<image class="upLoadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png"></image>
					<view class="upLoadText">上传行驶证主页</view>
				</view>
				<image :src="params.gLicenseMainImg" v-else class="upLoadBtn" @click="showPopup('trailerF')"></image>
				
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseBack" v-if="!params.gLicenseSubImg" @click="showPopup('trailerB')">
					<image class="upLoadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png"></image>
					<view class="upLoadText">上传行驶证副页</view>
				</view>
				<image :src="params.gLicenseSubImg" v-else class="upLoadBtn" @click="showPopup('trailerB')"></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn vehicleLicenseDate" v-if="!params.guaLicenseBackImg" @click="showPopup('trailerD')">
					<image class="upLoadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png"></image>
					<view class="upLoadText">上传行驶证年审有效期页</view>
				</view>
				<image :src="params.guaLicenseBackImg" v-else class="upLoadBtn" @click="showPopup('trailerD')"></image>
			</view>
		</view>
		
		<view v-if="isOcrRightG">
			<view class="certificationDetails" @click="toCarNoPage('2')">
				<view class="subTitle">挂车牌照号</view>
				<view class="detailsMsg" :class="{'active': isEdit}">{{params.gPlateNo}}</view>
			</view>
			<view class="certificationDetails">
				<view class="subTitle">行驶证有效期至</view>
				<view class="detailsMsg" :class="{errorRed: params.guaDlStatus != 1 && !isEdit}" v-if="!isEdit">{{params.guaValidTo || "请选择"}}</view>
				<view class="detailsMsg active" v-else>
					<!-- <uni-datetime-picker
						type="date"
						:bgClass="isEdit ? 'bgClass' : 'defaultStyle'"
						:disabled="!isEdit"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择'"
						v-model="params.guaValidTo"
						@change="val => changeVehicleValidToDate(val,'2')"
						style="text-align: right;color:#666666;"
					/> -->
					<picker mode="date" :disabled="!isEdit" :value="params.guaValidTo" start="1970-01-01" data-selectDateType="1"  end="2100-01-01" @change="val => changeVehicleValidToDate(val,'2')" fields="day">
						<view class="detailsMsg" :class="{'active': isEdit}">
						<text v-if="params.guaValidTo" >{{params.guaValidTo}}</text>
						<text v-else>请选择</text>
						</view>
					</picker>
				</view>
				
			</view>
		</view>
		
		
		<view class="mainTitle">
			<view class="title">车辆照片</view>
		</view>
		<view class="mainUpLoadBox">
			<view class="upLoadContent">
				<view class="upLoadBtn groupPhoto" v-if="!params.vehicleImg" @click="showPopup('gpF')">
					<image class="upLoadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png"></image>
					<view class="upLoadText">上传车头人车合影</view>
				</view>
				<image :src="params.vehicleImg" class="upLoadBtn" @click="showPopup('gpF')"></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn groupPhoto" v-if="!params.guaImg" @click="showPopup('gpB')">
					<image class="upLoadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png"></image>
					<view class="upLoadText">上传车挂人车合影</view>
				</view>
				<image :src="params.guaImg" class="upLoadBtn" @click="showPopup('gpB')"></image>
			</view>
		</view>
		<view class="btn_box">
			<view class="btn_content">
				<!-- <view class="relieveBtn" @click="unbindEvent()" v-if="carType != 'add' ">解除绑定</view> -->
				<view class="submitBtn" :class="{'activeEdit': !isEdit, 'active': isSetAll}" @click="toConfirm()" v-if="isDetail">{{!isEdit ? '修改行驶证信息' : '保存'}}</view>
				<view class="submitBtn new" :class="{'active': isSetAll}" @click="toConfirm()" v-else>提交</view>
			</view>
			
		</view>
		
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
				<view class="photo-content">
					为了使用行驶证的相关功能或服务，您需上传身份证证照，点击拍照会调起手机拍照权限，点击从手机相册选择会访问您的相册权限
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
			  <view class="backTitle">提示</view>
			  <view class="cont">退出后，您上传的资料将清除，需要重新上传!</view>
			  <view class="optbtn">
				<view class="cancel opt" @click="confirmBack">退出</view>
				<view class="confirm opt" @click="cancelBack">继续认证</view>
			  </view>
			</view>
		</uni-popup>
		
		<uni-popup ref="unbindPopup" type="center">
			<view class="popupConfirmBox">
				<view class="content">默认车辆不可解除绑定，若需要解除绑定，请设置其他车辆为默认车辆后解除</view>
				<view class="btnGroup">
					<view class="btn2" @click="closeUnbindPopup()">确定</view>
					<!-- <view class="btn" @click="saveInfo">保存</view> -->
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="confirmRelieve" type="center">
			<view class="popupConfirmBox">
				<view class="content">确认解除绑定？</view>
				<view class="btnGroup">
					<view class="btn cancel" @click="closeRelieve()">取消</view>
					<view class="btn confirm" @click="confirmUnBind">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	import * as commonUtils from "@/utils/utils"
	var PhotoModule = uni.requireNativePlugin("PhotoModule");
	import { mapActions } from 'vuex'
	let platForm = uni.getSystemInfoSync().platform;
	export default {
		data() {
			return {
				isOcrRightG: false,
				isOcrRight: false,
				isUpLoading: false, //是否正在上传
				// vlF行驶证主页、vlB行驶证副页、vlD行驶证有效期、trailerF挂车主页、trailerB挂车副页、trailerD挂车有效期、gpF车头合影、gpB车挂合影
				upLoadType: '',
				isEdit: true,
				isVehEdit: false,
				isDetail: false,
				isHaveDefault: false, // 是否有默认车辆
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
					
				},
				vehicleInfor:{},
				carType:'',  //添加车辆标识
				pageSign:"",
			}
		},
		onLoad(options) {
			var _this = this;
			console.log(options, '页面传参')
			var carInfo = options.carInfo;
			let pageSign=options.pageSign;
			if(pageSign){
				this.pageSign=pageSign;
			}
			if(options.isHaveDefault == 1){
				_this.isHaveDefault =  true
			}
			console.log(_this.isHaveDefault)
			//添加车辆
			if(options.carType) {
				_this.carType = options.carType
			}
			if (carInfo) {
				var car = JSON.parse(carInfo);
				_this.vehicleInfor = car;
				_this.isVehEdit = true
				var plateNo = car.plateNo;
				uni.showLoading({
					title: '加载中...'
				})
				this.getVehicleDetail(plateNo);
			}
			console.log(_this.vehicleInfor,'_this.vehicleInfor')
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
			uni.$on("vehicleRefresh", (plateNo) => {
				this.getVehicleDetail(plateNo);
			})
		},
		onUnload() {
		    uni.$off('acceptSelectedPlateNo');
			uni.$off('acceptSelectedPlateNoGua');
		},
		
		onBackPress(e) {
			if (e.from == 'backbutton') {
				var params = this.params;
				var values = Object.values(params);
				var index = values.findIndex(item => {
				  return item != "" && item != undefined
				})
				console.log(index, 'assa', values);
				if (this.isEdit && index > -1) {
				  this.$refs.backPopup.open()
				} else {
				  uni.navigateBack({
					delta: 1,
				  })
				}
				return true;
			}
		},
		computed: {
			isSetAll() {
				var data = this;
				var licenseMainImg = data.params.licenseMainImg;
				var licenseSubImg = data.params.licenseSubImg;
				var ext1 = data.params.ext1;
				var vehicleLength = data.params.vehicleLength;
				var plateNo = data.params.plateNo;
				if (licenseMainImg && licenseSubImg && ext1 && vehicleLength && plateNo) {
					return true
				}
				return false
			},
			isUpdateEnd() {
				var vehicleValidTo = this.params.vehicleValidTo;
				if (!vehicleValidTo) return false
				var nowTime = new Date().getTime();
				var fromTime = new Date(vehicleValidTo).getTime();
				if (fromTime - nowTime < 0) {
					return true
				}
				return false
			}
		},
	
		
		methods: {
			...mapActions(['getSettingsInfo', "getVehicleSettingsInfo", "getRouterSettingsInfo"]),
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
				var msg = [];
				var validData = this.params.validData;
				if (validData) {
				    msg.push(validData)
				}
				var licenseMainImg = this.params.licenseMainImg;
				var licenseSubImg  = this.params.licenseSubImg;
				if (!licenseMainImg) {
					msg.push("行驶证主页未上传")
				}
				if (!licenseSubImg) {
					msg.push("行驶证副页未上传")
				}
				return msg.join(',')
			},
			changeVehicleValidToDate(e,index) {
				console.log(e,index)
				if(index == 1) {
					this.params.vehicleValidTo = e.detail.value;
				}else {
					this.params.guaValidTo = e.detail.value;
				}
				this.$forceUpdate();
				
				
			},
			toCarNoPage(index) {
				if (this.isDetail && !this.isEdit) return;
				//车牌号选择
				uni.navigateTo({
					url: './carNo?flag=' + index
				})
			},
			toCarView() {
				if (this.isDetail && !this.isEdit) return;
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
				if (this.isDetail && !this.isEdit) {
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
				
				if (this.isDetail && !this.isEdit) {
					// uni.navigateTo({
					// 	url: './newCarVerifyEdit?result=' + JSON.stringify(this.params)
					// })
					this.isEdit = true;
					return;
				}
				
				var params = this.params;
				
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
				
				if (!that.params.plateNo){
					uni.showToast({
						title: '请输入车牌号',
						icon: 'none'
					})
					return;
				}
				if (that.params.plateNo > 8){
					uni.showToast({
						title: '车牌号格式不正确',
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
				
				if (this.isUpdateEnd) {
					
					uni.showModal({
						content: '行驶证有效期不可用，请修改!',
						confirmText: "继续保存",
						cancelText: '去修改',
						success:function(res) {
							if (res.confirm) {
								that.saveInfo();
							} else {
								that.scrollToTarget("#certificationDetails")
							}
						}
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
			scrollToTarget(id) {
			// 使用 uni.createSelectorQuery 获取元素位置
			  const query = uni.createSelectorQuery();
			  query.select(id).boundingClientRect(function(rect) {
				// rect 是获取到的元素位置信息
				// 在这里计算需要滚动的距离，例如：
				const scrollTop = rect.top; // 根据需要可能需要调整这里的计算方式，例如加上页面的scrollTop等
				uni.pageScrollTo({
				  scrollTop: scrollTop, // 滚动到指定位置
				  duration: 100 // 滚动动画持续时间
				});
			  }).exec();
			},
			unbindEvent(){
				//默认车辆 不允许解绑
				if(this.vehicleInfor.isDefault == 1) {
					this.$refs.unbindPopup.open();
				}else {
					this.$refs.confirmRelieve.open();
					
				}				
			},
			
			confirmUnBind() {
				//确认解除绑定
				this.closeRelieve();
				if (!ship.btnRepeat()) return;
				uni.showLoading();
				var userInfo = uni.getStorageSync("userInfo");
				var driverId = JSON.parse(userInfo).attrs.driverId
				let params = {
					driverId:driverId,
					id:this.vehicleInfor.id,
					plateNo:this.vehicleInfor.plateNo
				}
				console.log(params,'paramsparams')
				ship.postRequest("/yh/vehicle/remove/bidding", params).then(res => {
					console.log(res, '解除111')
					if (res.rspBody == 1) {
						uni.hideLoading();
						uni.showToast({
							title: '解绑成功',
							icon: 'none'
						})
						// setTimeout(() => {
							uni.navigateTo({
								url:'./carList'
							})
						// }, 1000)
					}else {
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err)
					uni.showToast({
						title: err.retDesc,
						icon: 'none'
					})
				})
			
			},
			
			closeUnbindPopup(){
				this.$refs.unbindPopup.close();
			},
			
			closeConfirmPopup() {
				this.$refs.confirmPopup.close();
			},
			closeRelieve(){
				this.$refs.confirmRelieve.close();
			},
			chooseFromPhoto() {
				let that = this;
				commonUtils.savePower(() => {
					that.sendFromAl();
				})
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
			sendPhotoPower() {
				let that = this;
				commonUtils.caramePower(() => {
					console.log("执行")
					that.sendPhoto();
				})
			},
			sendPhoto() {
				//拍照
				var that = this;
				var platForm = uni.getSystemInfoSync().platform;
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
						console.log("行驶证主页识别",result)
						var rspBody = result.rspBody;
						if (that.upLoadType == "vlF") {
							this.isOcrRight = true;
							var plateNo = rspBody.plateNo;
							if (plateNo.indexOf('挂') > -1) {
							  uni.showToast({
								title: '您上传的是挂车行驶证，此处请上传行驶证！',
								icon: 'none'
							  })
							  return;
							}
							//行驶证主页识别
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
							 if (!validData) {
								vehicleValidTo = ""
							 } else {
								var day = validData.split('-')[2];
								var record = that.params.record;
								if (!record) {
								  vehicleValidTo = ""
								} else {
								  var newStr = record.replace("年", "-");
								  var newStr2 = newStr.replace("月", "-");
								  var resultStr = newStr2 + day;
								  var month = resultStr.split('-')[1];
								  if (month > 12) {
								  	vehicleValidTo = ""
								  } else {
								  	vehicleValidTo = resultStr;
								  }
								}
							}
							that.params.vehicleValidTo = vehicleValidTo;
						} else {
							this.isOcrRightG = true;
							//挂车行驶证主页识别
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
							 var vehicleValidTo = "";
							 if (!validData) {
								vehicleValidTo = ""
							 } else {
								var day = validData.split('-')[2];
								var record = that.params.guaRecord;
								if (!record) {
								  vehicleValidTo = ""
								} else {
								  var newStr = record.replace("年", "-");
								  var newStr2 = newStr.replace("月", "-");
								  var resultStr = newStr2 + day;
								  var month = resultStr.split('-')[1];
								  if (month > 12) {
								  	vehicleValidTo = ""
								  } else {
								  	vehicleValidTo = resultStr;
								  }
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
							this.isOcrRight = true;
							var plateNo = rsp.plateNo;
							if (plateNo.indexOf('挂') > -1) {
							  uni.showToast({
								title: '您上传的是挂车行驶证，此处请上传行驶证！',
								icon: 'none'
							  })
							  return;
							}
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
								  var month = resultStr.split('-')[1];
								  if (month > 12) {
									  vehicleValidTo = ""
								  } else {
									  vehicleValidTo = resultStr;
								  }
								  
								}
							 }
							 
							 console.log("行驶证副业",validData, vehicleValidTo)
							that.params.vehicleValidTo = vehicleValidTo;
							that.$forceUpdate();
						} else {
							this.isOcrRightG = true;
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
								  
								  var month = resultStr.split('-')[1];
								  if (month > 12) {
								  	vehicleValidTo = ""
								  } else {
								  	vehicleValidTo = resultStr;
								  }
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
					console.log(res.rspBody.status,'状态')
					if (res.retCode == "0000000") {
						if (res.rspBody) {
							this.isOcrRight = true;
							this.isOcrRightG = true;
							this.isDetail = true;
							// this.isEdit = res.rspBody.status ? false : true;
							this.isEdit = false
						} else {
							this.isDetail = false;
							this.isEdit = false; //默认不允许编辑
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
				if(!that.isVehEdit && !that.isHaveDefault){
					parm.isDefault = 1
				}
				console.log(parm, '参数');
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
						that.getVehicleSettingsInfo();
						setTimeout(() => {
							if(that.pageSign){
								// uni.reLaunch({
								// 	url:"/pages/redPacket/index/index"
								// })
								uni.switchTab({
									url: '/pages/ship/index/index1'
								})
							}else{
								uni.navigateBack({
									delta: 1
								})
							}
							
						}, 1000)
						
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
				text-align: center;
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
			.row {
			  display: flex;
			  flex-direction: row;
			  align-items: center;
			}
			.sub {
			  font-weight: 600;
			  font-size: 24rpx;
			  margin-left: 8rpx;
			  &.success {
				color: rgba(86, 184, 54, 1);
			  }
			  &.error {
				color: rgba(235, 100, 100, 1);
			  }
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
				position: relative;
				.red {
					position: absolute;
					top: -30rpx;
					right: 0;
					color: #FF0000;
				}
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
						width: 220rpx;
						line-height: 38rpx;
						font-size  : 32rpx;
						color      : #333333;
						text-align : center;
					}
				}
			}
		}
		.certificationDetails {
			margin: 0 0 0 38rpx;
			padding: 16rpx 36rpx 16rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.subTitle {
				font-size: 32rpx;
				color: #333333;
				line-height: 38rpx;
				flex-shrink: 0;
				.syb {
					font-size: 32rpx;
					color:#EF3A3A;
				}
			}
			.detailsMsg {
				width: 444rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 12rpx;
				padding: 0 16rpx;
				text-align : right;
				font-size  : 32rpx;
				color      : #333333;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				align-items: center;
				&.active {
					font-weight: 500;
					background-color: #F8F8F8;
				}
				&.activeRed {
					color: #FC5C06;
					background-color: #F8F8F8;
					font-weight: 500;
				}
				&.errorRed {
					color: #FC5C06;
				}
			}
		}
		.submitBtn {
			// position: fixed;
			// left: 135rpx;
			// width: 480rpx;		
			// right: 72rpx;
			bottom: 74rpx;
			width: 480rpx;
			height: 90rpx;
			line-height: 90rpx;
			background   : rgba(151, 181, 255, 1);
			border-radius: 24rpx;
			text-align: center;
			font-size: 28rpx;
			color:#FFF;
			&.new {
				width: 480rpx;
			}
			&.active {
			  background-color: rgba(82, 131, 255, 1);
			}
			&.activeEdit {
			  background-color: rgba(252, 92, 6, 1);
			}
		}
		.btn_box {
			position: fixed;
			bottom: 74rpx;		
			.btn_content {
				width: 100vw;
				display: flex;
				justify-content: space-around;
				
			}
		}
		.relieveBtn {
			// position: fixed;
			// left: 76rpx;
			bottom: 74rpx;
			width: 278rpx;
			height: 90rpx;
			line-height: 90rpx;
			background: #BABABA;
			border-radius: 24rpx;
			text-align: center;
			font-size: 28rpx;
			color:#FFF;
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
				.btn2 {
					flex: 1;
					padding: 22rpx 0 28rpx 0;
					font-size: 28rpx;
					color: #4EADF1;
					line-height: 33rpx;
					text-align: center;
				}
			}
			
		}
	}
	 .errorRow {
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	    padding: 14rpx 36rpx;
	    margin-top: 16rpx;
	    background-color: #F8F8F8;
	    .sub {
	      font-weight: 500;
	      font-size: 28rpx;
	      margin-left: 8rpx;
	      &.success {
	        color: rgba(86, 184, 54, 1);
	      }
	      &.error {
	        color: rgba(235, 100, 100, 1);
	      }
	    }
	    .auditIcon {
	      width      : 30rpx;
	      height     : 29rpx;
	      margin-left: 12rpx;
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
	.photo-content {
		height: 100rpx;
		font-size: 26rpx;
		padding: 20rpx
		
	}
</style>
