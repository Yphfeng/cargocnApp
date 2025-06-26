<template>
	<view class="transportVerify">
		<view class="mainTitle">
			<view class="title">上传车辆道路运输证4.5吨以上必填</view>
			<view class="recognize-status" v-if="isDetail && !isEdit">
				<image v-if="!verifyStatus" class="auditIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/auditF.png"></image>
				<text v-if="!verifyStatus" class="auditF">未认证</text>
				<image v-if="verifyStatus" class="auditIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/auditT.png"></image>
				<text v-if="verifyStatus" class="auditT">已认证</text>
			</view>
		</view>
		<view class="aduitBox" v-if="rtMsg && isDetail && !isEdit">
			<view class="auditMsg">{{rtMsg}}</view>
		</view>
	 
		<view class="viewList" v-for="(dataItem, index) in transmitParams">
			<view class="mainUpLoadBox" >
				<view class="upLoadContent">
					<view class="red" v-if="isEdit">*</view>
					<view class="upLoadBtn transportVerifyFont" @click="showPopup('tlF', index)" v-if="!dataItem.mainImg">
						<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
						<view class="upLoadText">上传车辆道路运输证主页</view>
					</view>
					<image v-else :src="dataItem.mainImg" class="upLoadBtn" @click="showPopup('tlF', index)" />
				</view>
				<view class="upLoadContent">
					<view class="red" v-if="isEdit">*</view>
					<view class="upLoadBtn transportVerifyBack" @click="showPopup('tlB', index)" v-if="!dataItem.subImg">
						<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
						<view class="upLoadText">上传车辆道路运输证副页</view>
					</view>
					<image :src="dataItem.subImg" v-else class="upLoadBtn" @click="showPopup('tlB', index)"></image>
				</view>
			</view>
			
			<view class="certificationDetails">
				<view class="subTitle">车辆牌照号<text class="syb" v-if="isEdit">*</text></view>
				<picker :range="vehicleArr" :disabled="!isEdit" range-key="plateNo" :value="dataItem.index || 0" @change="chooseVehicle($event, dataItem, index)">
					<view class="detailsMsg" :class="{active: isEdit}" v-if="dataItem.selectPlateNo">{{dataItem.selectPlateNo}}</view>
					<view class="detailsMsg" :class="{active: isEdit}" v-else>请选择</view>
				</picker>
			</view>
			<view class="certificationDetails">
				<view class="subTitle">道路运输证号</view>
				<input class="detailsMsg" :class="{active: isEdit}" :disabled="!isEdit" placeholder="请输入"
					placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="dataItem.transPermitNo" />
			</view>
			<view class="certificationDetails" :ref="'dl' + index" :id="'dl' + index">
				<view class="subTitle">道路运输证有效期</view>
				<view>
					<!-- <uni-datetime-picker
						type="date"
						:bgClass="isEdit ? 'bgClass' : 'defaultStyle'"
						:border="false"
						:showIcon="false"
						:clear-icon="false"
						:placeholder="'请选择'"
						v-model="dataItem.transPermitValid"
						@change="val => changeValidToDate(val, index)"
					/> -->
					<picker :disabled="!isEdit" :class="{active: isEdit}"  mode="date" start="1970-01-01" end="2100-01-01" :value="dataItem.transPermitValid" @change="val => changeValidToDate(val, index)" fields="day">
						<view v-if="dataItem.transPermitValid" class="detailsMsg" :class="{'active': isEdit, errorRed: isUpdateEnd(dataItem.transPermitValid)}" :style="'color:'+ getTransPermitValid(dataItem)">{{dataItem.transPermitValid}}</view>
						<view v-else class="detailsMsg" :class="{active: isEdit}">请选择</view>
					</picker>
				</view>
				
			</view>
			
		</view>
		
		
		<view class="addBtn" @click="addTrans">添加车辆道路通行证</view>
		<view class="mainTitle">
			<view class="title">上传从业资格证4.5吨以上车辆必填</view>
			<view class="recognize-status" v-if="isDetail && !isEdit">
			  <image v-if="!qualificationsParams.qcStatus || !qualificationsParams.qualificationsUrl" class="auditIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/auditF.png"></image>
			  <text v-if="!qualificationsParams.qcStatus || !qualificationsParams.qualificationsUrl" class="auditF">未认证</text>
				<image v-if="qualificationsParams.qcStatus && qualificationsParams.qualificationsUrl" class="auditIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/auditT.png"></image>
			  <text v-if="qualificationsParams.qcStatus && qualificationsParams.qualificationsUrl" class="auditT">已认证</text>
			</view>
		</view>
		<view class="aduitBox" v-if="qcMsg && isDetail && !isEdit">
			<view class="auditMsg">{{qcMsg}}</view>
		</view>
		
		<view class="mainUpLoadBox">
			<view class="upLoadContent">
				<view class="red" v-if="isEdit">*</view>
				<view class="upLoadBtn certificateVerifyFont" @click="showPopup('clF')" v-if="!qualificationsParams.qualificationsUrl">
					<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传从业资格证主页</view>
				</view>
				<image :src="qualificationsParams.qualificationsUrl" class="upLoadBtn"  @click="showPopup('clF')" v-else></image>
			</view>
			<view class="upLoadContent">
				<view class="red" v-if="isEdit">*</view>
				<view class="upLoadBtn certificateVerifyBack" @click="showPopup('clB')" v-if="!qualificationsParams.qualificationsSubUrl">
					<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传从业资格证有效期页</view>
				</view>
				<image :src="qualificationsParams.qualificationsSubUrl" class="upLoadBtn" @click="showPopup('clB')" v-else></image>
			</view>
		</view>
		<!-- <view class="certificationDetails">
		  <view class="subTitle">姓名<text class="syb" v-if="isEdit">*</text></view>
		  <input class="detailsMsg" :class="{active: isEdit}" :disabled="!isEdit" type="text" maxlength="8" placeholder="请输入" v-model="qualificationsParams.qualificationsUserName"/>
		</view> -->
		<view class="certificationDetails">
			<view class="subTitle">从业资格证号</view>
			<input class="detailsMsg" :class="{active: isEdit}" :disabled="!isEdit" placeholder="请输入" type="text" maxlength="30"
				placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="qualificationsParams.qualificationCertificate" />
		</view>
		<view class="certificationDetails">
			<view class="subTitle">有效期起</view>
			<view>
				<picker :disabled="!isEdit" :class="{active: isEdit}"  mode="date" start="1970-01-01" end="2100-01-01" :value="qualificationsParams.qcValidFrom" @change="changeQcValidFromDate" fields="day">
					<view v-if="qualificationsParams.qcValidFrom" class="detailsMsg" :class="{'active': isEdit}" >{{qualificationsParams.qcValidFrom}}</view>
					<view v-else class="detailsMsg" :class="{active: isEdit}">请选择</view>
				</picker>
			</view>
			
		</view>
		<view class="certificationDetails" id="congy" ref="congy">
			<view class="subTitle">有效期止</view>
			<view>
				<picker :disabled="!isEdit" :class="{active: isEdit}"  mode="date" start="1970-01-01" end="2100-01-01" :value="qualificationsParams.qcValidTo" @change="changeQcValidToDate" fields="day">
					<view v-if="qualificationsParams.qcValidTo" class="detailsMsg" :class="{'active': isEdit, errorRed: isUpdateCyEnd}" :style="'color:'+getQualificationsParams">{{qualificationsParams.qcValidTo}}</view>
					<view v-else class="detailsMsg" :class="{active: isEdit}">请选择</view>
				</picker>
			</view>
			
		</view>
		
		<view class="submitBtn" :class="{'active': isSetAll(), isEditAll: !isEdit}" @click="toConfirm" v-if="isDetail">{{!isEdit ? '修改承运资质照片' : '保存'}}</view>
		<view class="submitBtn" :class="{'active': isSetAll()}" v-else @click="toConfirm()">提交</view>
		<!-- 拍照弹窗 -->
		<uni-popup ref="takePicturePopup" type="center">
			<view class="picturePopupBox">
				<view class="popupTitle">请按照示例上传</view>
				<image class="upLoadSampleTrue" v-if="upLoadType == 'tlF'" src="../../../static/images/transportVerify/tlSampleT.png"></image>
				<image class="upLoadSampleFalse" v-if="upLoadType == 'tlF'" src="../../../static/images/transportVerify/tlSampleF.png"></image>
				<image class="upLoadSampleTrue" v-if="upLoadType == 'tlB'" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/daolu_1.png"></image>
				<image class="upLoadSampleFalse" v-if="upLoadType == 'tlB'" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/daolu_2.png"></image>
				
				<image class="upLoadSampleTrue" v-if="upLoadType == 'clB' || upLoadType == 'clF'" src="../../../static/images/transportVerify/cfSampleT.png"></image>
				<image class="upLoadSampleFalse" v-if="upLoadType == 'clB' || upLoadType == 'clF'" src="../../../static/images/transportVerify/cfSampleF.png"></image>
				<view class="optAlertItem">
					<view class="alertItem" @click="sendPhoto">拍照</view>
					<view class="alertLine" />
					<view class="alertItem" @click="sendFromAl">从手机相册选择</view>
					<view class="alertLine cancel" />
					<view class="alertItem" @click="closePicturePopup">取消</view>
				</view>
			</view>
		</uni-popup>
		<!-- 保存弹窗 -->
		<uni-popup ref="confirmPopup" type="center">
			<view class="popupConfirmBox">
				<view class="content">是否保存承运证信息</view>
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
		<!-- 识别错误，是否继续 -->
		<uni-popup ref="msgPopup" type="center">
			<view class="popupConfirmBox">
				<view class="content" style="width: 400rpx;">{{recogLizeMsg}}</view>
				<view class="btnGroup">
					<view class="btn" @click="closeConfirmPopup()">取消</view>
					<view class="btn" @click="toRecgLize">继续</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	var platForm = uni.getSystemInfoSync().platform;
	export default {
		data() {
			return {
				
				// tlF运输证主页、tlB运输证副页、clF从业资格证主页、clB从业资格证副页
				upLoadType: '',
				params: [{
					"id":"",
					"transPermitNo":"",
					"transPermitValid":"",
					"operationNo":"",
					"operationExpire":"",
					"transPermitMainImg":"",
					"transPermitSubImg":"",
					"selectPlateNo": '',
					"guaTransNo":"",
					"guaTransValid":"",
					"guaOperationNo":"",
					"guaOperationExpire":"",
					"guaTransMainImg":"",
					"guaTransSubImg":"",
					guaType: 0,
				}],
				transmitParams: [
					{
						"id":"",
						mainImg: '',
						subImg: '',
						transPermitValid: '',
						guaType: 0,
						plateNo: '',
						transPermitNo: '',
					}
				],
				qualificationsParams: {
					validStatus: 0,
					qualificationsUrl: '',
					qualificationsSubUrl: '',
					userCode: '',
					qcValidTo:"",
					qualificationCertificate: '',
				},
				oriVehicleList: [],
				recogLizeMsg: '',
				driverId: '',
				vehicleArr: [],
				index: 0,
				optIndex: 0,
				msg: '',
				isEdit: false, //是否编辑，认证；
				isDetail: false,
				verifyStatus: false,
				isQEdit: false,
				rtMsg: '',
				qcMsg: '',
				
			}
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) return;
			this.qualificationsParams.userCode = JSON.parse(userInfo).attrs.userCode;
			this.driverId = JSON.parse(userInfo).attrs.driverId;
			uni.showLoading({
				title: '加载中...'
			})
			this.init();//初始化
		},
		onBackPress(e) {
			
			if (e.from == 'backbutton') {
				var isEdit = this.isEdit;
				var isDetail = this.isDetail;
				if (isEdit) {
				  this.$refs.backPopup.open();
				} else {
				  uni.navigateBack({
					delta: 1,
				  })
				}
				return true
			}
		},
		computed: {
			getTransPermitValid(){
				let that = this;
				console.log(that.isEdit);
				
				return function (dataItem){
					console.log((dataItem.transStatus != 1 && dataItem.guaType != 1));
				console.log(dataItem.guaTransStatus != 1 && dataItem.guaType == 1)
					if(!that.isEdit && (dataItem.transStatus != 1 && dataItem.guaType != 1) || (dataItem.transStatus != 1 && dataItem.guaType == 1)){
						return 'red'
					}else{
						return "#333"
					}
				}
			},
			getQualificationsParams(){
				if(!this.isEdit && this.qualificationsParams.qcStatus != 1){
					return 'red'
				}else{
					return '#333'
				}
			},
			isUpdateCyEnd() {
				var qcValidTo = this.qualificationsParams.qcValidTo;
				if (!qcValidTo) return false;
				var nowTime = new Date().getTime();
				var fromTime = new Date(qcValidTo).getTime();
				if (fromTime - nowTime < 0) {
					return true
				}
				return false
			}
		},
		methods: {
			isUpdateEnd(date) {
				if (!date) return false;
				var nowTime = new Date().getTime();
				var fromTime = new Date(date).getTime();
				if (fromTime - nowTime < 0) {
					return true
				}
				return false
			},
			isSetAll() {
				var data = this;
				var params = data.transmitParams;
				var qualificationsParams = data.qualificationsParams;
				var findIndex = params.findIndex(atem => {
					return atem.mainImg == "" || atem.subImg == "" || atem.plateNo == ""
				})
				var findIndex2 = (qualificationsParams.qualificationsUrl && qualificationsParams.qualificationsSubUrl && qualificationsParams.qualificationsUserName) ? -1 : 0;
			
				if (findIndex > -1 || findIndex2 > -1) {
					return false
				}
				return true
			},
			changeQcValidToDate(e) {
				this.qualificationsParams.qcValidTo = e.detail.value;
				this.$forceUpdate();
			},
			changeQcValidFromDate(e) {
				this.qualificationsParams.qcValidFrom = e.detail.value;
				this.$forceUpdate();
			},
			changeValidToDate(val,index) {
				var params = this.transmitParams;
				console.log(params);
				console.log(val,index)
				params[index].transPermitValid = val.detail.value;
				this.transmitParams = params;
				this.$forceUpdate();
			},
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
			async init () {
				var that = this;
				try{
				
					var res = await ship.postRequest("/yh/vehicle/select/list/with/gua/by/driver", {
						driverId: that.driverId
					})
					var rsp = await ship.postRequest("/yh/vehicle/transport/driver/select", {
						driverId: that.driverId
					});
					console.log(res, '车辆', rsp);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var items = res.rspBody.items;
						var vehicleArr = [];
						items.forEach(atem => {
							atem.plateNo = atem.guaType == 1 ? atem.gPlateNo : atem.plateNo
							vehicleArr.push(atem)
						})
						that.vehicleArr = vehicleArr;
						if (rsp.retCode == "0000000") {
							var vehicleList = rsp.rspBody.vehicleList;
							var driverVO = rsp.rspBody.driverVO; 
							console.log(vehicleList, "vehicleList"); //承运车辆信息
							that.oriVehicleList = vehicleList;
							
							var findIndex = vehicleList.findIndex(atem => {
								if (atem.guaType == 1) {
									return atem.guaTransStatus != 1
								} else {
									return atem.transStatus  != 1
								}
							})
							if (findIndex > -1) {
								this.verifyStatus = false
							} else {
								this.verifyStatus = true
							}
							
							var nowParse = new Date().getTime();
							var rtIndex = vehicleList.findIndex(atem => {
								var transPermitValid = atem.transPermitValid;
								if (transPermitValid) {
								  transPermitValid = transPermitValid.replace(/-/g, '/');
								  var rtParse = new Date(transPermitValid).getTime();
								  if (rtParse < nowParse) {
									return true
								  } else {
									return false
								  }
								} else {
								  return false
								}
							})
							console.log(rtIndex)
							if (rtIndex > -1) {
								this.rtMsg = '您的道路运输证已过期！'
								
							}
						  
							var  qcValidTo =  driverVO.qcValidTo;  
							var qcMsg = ""
							if (qcValidTo) {
								qcValidTo = qcValidTo.replace(/-/g, '/');
								var qcParse = new Date(qcValidTo).getTime();
								if (qcParse < nowParse) {
									qcMsg = "您的从业资格证已过期！"
								}
							}
							this.qcMsg = qcMsg;
							var transmitParams = [];
							vehicleList.forEach(item => {
								if (item.guaType == 1) {
									transmitParams.push({
										id: item.id,
										mainImg: item.guaTransMainImg,
										subImg: item.guaTransSubImg,
										plateNo: item.gPlateNo,
										guaType: item.guaType || 0,
										selectPlateNo: item.gPlateNo,
										transPermitValid: item.guaTransValid,
										transStatus: item.guaTransStatus,
										transPermitNo: item.guaTransNo || ""
									})
								} else {
									transmitParams.push({
										id: item.id,
										mainImg: item.transPermitMainImg,
										subImg: item.transPermitSubImg,
										plateNo: item.plateNo,
										guaType: item.guaType || 0,
										selectPlateNo: item.plateNo,
										transPermitValid: item.transPermitValid,
										transStatus: item.transStatus,
										transPermitNo: item.transPermitNo || ""
									})
								}
							})
							console.log(vehicleList, '啊啊啊', vehicleArr);
							if (vehicleList.length > 0) {
								that.params = vehicleList;
								that.transmitParams = transmitParams;
							}
							if (rsp.rspBody.driverVO.identityVerify == 1) {
								rsp.rspBody.driverVO.qualificationsUserName = rsp.rspBody.driverVO.qualificationsUserName ? rsp.rspBody.driverVO.qualificationsUserName : rsp.rspBody.driverVO.userName ;
							}
							that.qualificationsParams = rsp.rspBody.driverVO;
							
							if (vehicleList.length > 0) {
								that.isDetail = true;
								that.isEdit = false;
							  } else {
								that.isDetail = false;
								that.isEdit = true;
							}
							that.$forceUpdate();
						}
					
						
					}
					
				}catch(e){
					console.log(e)
					//TODO handle the exception
					uni.hideLoading();
				}
			},
		
			chooseVehicle(e, dataItem, index1) {
				
				
				console.log(e, '选择', index1, dataItem);
				this.optIndex = index1;
				var optIndex = this.optIndex;
				var params = this.transmitParams;
				var vehicleArr = this.vehicleArr;
				var index = e.detail.value;
				var guaType = vehicleArr[index].guaType;
				var plateNo = vehicleArr[index].plateNo; 
				var gPlateNo = vehicleArr[index].gPlateNo;
				var plateNoId = vehicleArr[index].id;
				
				//已选择的车牌号
				var selectedPlateNo = guaType == 1 ? vehicleArr[index].gPlateNo : vehicleArr[index].plateNo;
				var findIndex = params.findIndex(item => {
					return item.id == plateNoId && guaType == item.guaType
				})
				
				if (findIndex > -1) {
					uni.showToast({
						title: '您已经添加了相同的车辆，不能重复添加',
						icon: 'none'
					})
					return;
				}
				
				params[index1].index = index
				params[optIndex].selectPlateNo = guaType == 1 ? vehicleArr[index].gPlateNo : vehicleArr[index].plateNo;
				params[optIndex].id = vehicleArr[index].id;
				params[optIndex].guaType = guaType || 0;
				if (guaType == 1) {
					params[optIndex].plateNo = vehicleArr[index].gPlateNo;
				} else {
					params[optIndex].plateNo = vehicleArr[index].plateNo;
				}
				this.transmitParams = params;
				this.$forceUpdate();
			},
			showPopup(type, optIndex) {
				console.log(this.isEdit, this.msg, 'a')
				if (!this.isEdit) {
					//预览
					var urlArr = [];
					var params = this.transmitParams;
					if (type == "tlF") {
						//道路主页
						var mainImg = params[optIndex].mainImg
						urlArr.push(mainImg)
					} else if (type == "tlB") {
						//道路副页
						var backImg = params[optIndex].subImg;
						urlArr.push(backImg)
					} else if (type == "clF") {
						//从业主页
						var qualificationsUrl = this.qualificationsParams.qualificationsUrl
						urlArr.push(qualificationsUrl)
					} else if (type == "clB") {
						//从业副页
						var qualificationsSubUrl = this.qualificationsParams.qualificationsSubUrl
						urlArr.push(qualificationsSubUrl)
					}
					if (urlArr.length > 0) {
						uni.previewImage({
							current: 1, //预览图片的下标
							urls: urlArr //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
						})
					}
					return;
				};
				
				this.upLoadType = type;
				if (optIndex !== undefined) {
					this.optIndex = optIndex;
				}
				
				this.$refs.takePicturePopup.open();
			},
			closePicturePopup() {
				this.$refs.takePicturePopup.close();
			},
			toConfirm() { 
				let that = this;
				if (!this.isEdit) {
					// uni.navigateTo({
					// 	url: './transportVerifyEdit'
					// })
					this.isEdit = true;
					return;
				};
				var params = this.transmitParams;
				var qualificationsParams = this.qualificationsParams;
				var findIndex = params.findIndex(item => {
					return item.mainImg == ''
				})
				if (findIndex > -1) {
					uni.showToast({
						title: '请上传车辆道路运输证主页',
						icon: 'none'
					})
					return;
				}
				var findIndex2 = params.findIndex(item => {
				  return item.subImg == ''
				})
				if (findIndex2 > -1) {
				  wx.showToast({
					title: '请上传车辆道路运输证副页',
					icon: 'none'
				  })
				  return;
				}
				
				var findIndex1 = params.findIndex(item => {
					return item.id == ''
				})
				if (findIndex1 > -1) {
					uni.showToast({
						title: '请选择车辆',
						icon: 'none'
					})
					return;
				}
				if (!qualificationsParams.qualificationsUrl) {
				  uni.showToast({
					title: '请上传从业资格证主页',
					icon: 'none'
				  })
				  return;
				}
				if (!qualificationsParams.qualificationsSubUrl) {
				  uni.showToast({
					title: '请上传从业资格证有效期页',
					icon: 'none'
				  })
				  return;
				}
				var findIndexTime = params.findIndex(item => {
					var transPermitValid = item.transPermitValid;
					return transPermitValid && that.isUpD(transPermitValid)
				})
				if (findIndexTime > -1) {
					uni.showModal({
						content: '道路运输证有效期不可用，请修改!',
						confirmText: "继续保存",
						cancelText: '去修改',
						success:function(res) {
							if (res.confirm) {
								that.checkUpdate();
							} else {
								var id = "#dl" + findIndexTime
								console.log("id", id);
								that.scrollToTarget(id)
							}
						}
					})
					return;
				}
				//从也资格证判断
				if (this.isUpdateCyEnd) {
					uni.showModal({
						content: '从页资格证证有效期不可用，请修改!',
						confirmText: "继续保存",
						cancelText: '去修改',
						success:function(res) {
							if (res.confirm) {
								that.saveInfo();
							} else {
								that.scrollToTarget("#congy")
							}
						}
					})
					return;
				}
				// if (!qualificationsParams.qualificationsUserName) {
				//   uni.showToast({
				// 	title: '请输入姓名',
				// 	icon: 'none'
				//   })
				//   return;
				// }
				this.$refs.confirmPopup.open();
			},
			checkUpdate() {
				let that = this;
				//判断从也资格证
				if (this.isUpdateCyEnd) {
					uni.showModal({
						content: '从页资格证证有效期不可用，请修改!',
						confirmText: "继续保存",
						cancelText: '去修改',
						success:function(res) {
							if (res.confirm) {
								that.saveInfo();
							} else {
								that.scrollToTarget("#congy")
							}
						}
					})
					return;
				}
				that.saveInfo();
				
				
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
			isUpD(date) {
				if (!date) return false
				var nowTime = new Date().getTime();
				var fromTime = new Date(date).getTime();
				if (fromTime - nowTime < 0) {
					return true
				}
				return false
			},
			closeConfirmPopup() {
				this.$refs.confirmPopup.close();
				this.$refs.msgPopup.close();
			},
			sendPhoto() {
				//拍照
				var that = this;
				this.$refs.takePicturePopup.close();
				var type = this.upLoadType;
				uni.showModal({
					title: '提示',
					content: '将获取相机权限以拍摄照片',
					success: function(res) {
						if (res.confirm) {
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
									
									if (type == "tlB" || type == "clB") {
										//副业不需要ocr识别
										uni.showLoading({
											title: '上传中...'
										})
										that.uploadFile(tempFilePaths[0]);
									} else if (type == "tlF") {
										//道路运输证ocr识别
										that.uploadTransportImage(tempFilePaths[0])
										// that.uploadFrontImage(tempFilePaths[0])
									} else {
										//从业资格证识别
										that.uploadBackImage(tempFilePaths[0])
									}
									
								}
							});
						}
					}
				})
			
				
				
			},
			sendFromAl() {
				var that = this;
				//从手机相册选择
				this.$refs.takePicturePopup.close();
				var type = this.upLoadType;
				
				uni.showModal({
					title: '提示',
					content: '将获取您的相册权限以选择照片',
					success: function(res) {
						if (res.confirm) {
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
									if (type == "tlB" || type == "clB") {
										//副业不需要ocr识别
										uni.showLoading({
											title: '上传中...'
										})
										that.uploadFile(tempFilePaths[0]);
									} else if (type == "tlF") {
										// that.uploadFrontImage(tempFilePaths[0])
										that.uploadTransportImage(tempFilePaths[0])
									} else {
										//从业资格证识别
										that.uploadBackImage(tempFilePaths[0])
									}
								}
							});
						}
					}
				})	
			},
			uploadTransportImage(path) {
				var that = this;
				var optIndex = that.optIndex;
				var params = that.transmitParams;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/baidu/ocr/v1/vehicle/road/transport", path)
				.then(result => {
					uni.hideLoading();
					console.log('识别结果1111', result)
					var rspBody = result.rspBody;
					if (result.retCode == '0000000') {
						var mainImg = rspBody.image;
						params[optIndex].mainImg = mainImg;
						var licenseDate = rspBody.licenseDate;
						if (!licenseDate) {
						  params[optIndex].transPermitValid = ""
						} else {
						  var dateRegex = /^\d{4}年\d{2}月\d{2}日$/;
						  var isValid = dateRegex.test(licenseDate);
						  var transPermitValid = licenseDate.replace("年", '-')
						  transPermitValid = transPermitValid.replace("月", '-')
						  transPermitValid = transPermitValid.replace("日", '')
						  params[optIndex].transPermitValid = isValid ? transPermitValid : ''
						}
						params[optIndex].transPermitNo = rspBody.roadTransportNo || ""
						that.transmitParams = params;
						console.log('识别结果', that.transmitParams)
					} else {
						params[optIndex].recogLizeImage = rspBody.image;
						that.transmitParams = params;
						that.recogLizeMsg = result.retDesc
						setTimeout(() => {
							that.$refs.msgPopup.open();
						}, 500)
					}
					
				}).catch(err => {
					
					uni.hideLoading();
					params[optIndex].recogLizeImage = err.rspBody.image;
					that.transmitParams = params;
					that.recogLizeMsg = err.retDesc;
					setTimeout(() => {
						that.$refs.msgPopup.open();
					}, 500)
				})
			},
			//道路运输证主页识别
			uploadFrontImage: function(path) {
				var that = this;
				var optIndex = that.optIndex;
				var params = that.transmitParams;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/baidu/ocr/v1/general/basic/info", path, {
					basicType: 'CYZG'
				})
				.then(result => {
					uni.hideLoading();
					var rspBody = result.rspBody;
					if (result.retCode == '0000000') {
						var keywords = rspBody.basicResult;
						
						if (keywords.indexOf("道路") > -1) {
						params[optIndex].mainImg = rspBody.image;
						that.transmitParams = params;
						that.$forceUpdate();
						  
						} else {
							params[optIndex].recogLizeImage = rspBody.image;
							that.transmitParams = params;
							that.recogLizeMsg = '您的道路运输证存在错误，继续将进入人工审核。';
						  
							setTimeout(() => {
								that.$refs.msgPopup.open();
							}, 1000)
						}
						console.log(result, '识别结果', that.transmitParams)
						that.$forceUpdate();
					} else {
						params[optIndex].recogLizeImage = rspBody.image;
						that.transmitParams = params;
						that.recogLizeMsg = result.retDesc
						setTimeout(() => {
							that.$refs.msgPopup.open();
						}, 500)
					}
					
				}).catch(err => {
					
					uni.hideLoading();
					params[optIndex].recogLizeImage = err.rspBody.image;
					that.transmitParams = params;
					that.recogLizeMsg = err.retDesc;
					setTimeout(() => {
						that.$refs.msgPopup.open();
					}, 500)
				})
			},
			//从业资格证识别
			uploadBackImage: function(path) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				var qualificationsParams = that.qualificationsParams;
				ship.upLoadFile("/baidu/ocr/v1/general/basic/info", path, {
					basicType: 'CYZG'
				})
				.then(result => {
					console.log(result, '从业资格证主页')
					uni.hideLoading();
					if (result.retCode == '0000000') {
						var rsp = result.rspBody;
						var keywords = rsp.basicResult;
						if (keywords.indexOf("从业") > -1) {
							that.qualificationsParams.validStatus = 1;
							that.qualificationsParams.qualificationsUrl = rsp.image;
						} else {
							that.qualificationsParams.validStatus = 0
							that.recogLizeMsg = "您的从业资格证存在错误，继续将进入人工审核。";
							that.qualificationsParams.recogLizeImage = rsp.image;
							setTimeout(() => {
								that.$refs.msgPopup.open();
							}, 1000)
						}
						that.$forceUpdate();
					} else {
						that.qualificationsParams.validStatus = 0
						that.recogLizeMsg = "您的从业资格证存在错误，继续将进入人工审核。"
						that.qualificationsParams.recogLizeImage = result.rspBody.image;
						setTimeout(() => {
							that.$refs.msgPopup.open();
						}, 1000)
						that.$forceUpdate();
					}
					
				}).catch(err => {
					console.log(err, 'asaa');
					uni.hideLoading();
					that.qualificationsParams.validStatus = 0
					that.recogLizeMsg = "您的从业资格证存在错误，继续将进入人工审核。";
					that.qualificationsParams.recogLizeImage = err.rspBody.image;
					 setTimeout(() => {
					 	that.$refs.msgPopup.open();
					 }, 1000)
					that.$forceUpdate();
					
				})
			},
			//普通上传
			uploadFile(path) {
				var that = this;
				var flag = this.upLoadType;
				uni.showLoading({
					title: '请稍候...',
				})
				var params = that.transmitParams;
				var optIndex = that.optIndex;
				var qualificationsParams = this.qualificationsParams;
				ship.upLoadFile("/file/upload", path)
				.then(result => {
					uni.hideLoading();
					if (result.retCode == '0000000') {
						console.log(flag, result, 'upfile');
						if (flag == "tlB") {
							//运输证副业
							params[optIndex].subImg = result.rspBody[0].url;
						} else {
							//从业资格证副业
							qualificationsParams.qualificationsSubUrl = result.rspBody[0].url;
						}
						that.transmitParams = params;
						that.qualificationsParams = qualificationsParams;
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
					uni.hideLoading();
				})
			},
			toRecgLize() {
				var that = this;
				that.$refs.msgPopup.close();
				var params = this.transmitParams;
				var optIndex = this.optIndex;
				var qualificationsParams = that.qualificationsParams;
				if (that.upLoadType == "tlF") {
					var recogLizeImage = params[optIndex].recogLizeImage;
					
					params[optIndex].mainImg = recogLizeImage;
					  
					this.transmitParams = params;
				} else {
					var recogLizeImage = qualificationsParams.recogLizeImage;
					this.qualificationsParams.qualificationsUrl = recogLizeImage;
					
				}
				that.$forceUpdate();
			
				
			},
			addTrans() {
				//添加道路运输证
				var that = this;
				
				if (!that.isEdit) return;
				
				
				var params = that.transmitParams;
				var findIndex = -1;
				findIndex = params.findIndex(item => {
					return item.mainImg == ""
					
				})
				
				if (findIndex > -1) {
					uni.showToast({
						title: '请上传道路运输证主页',
						icon: 'none'
					})
					return;
				}
				
				findIndex = params.findIndex(item => {
					return item.subImg == ""
					
				})
				
				if (findIndex > -1) {
					uni.showToast({
						title: '请上传道路运输证副页',
						icon: 'none'
					})
					return;
				}
				findIndex = params.findIndex(item => {
					return item.id == ""
					
				})
				
				if (findIndex > -1) {
					uni.showToast({
						title: '请选择车牌号',
						icon: 'none'
					})
					return;
				}
				
				
				params.push({
					id: "",
					mainImg: '',
					subImg: '',
					plateNo: '',
					transPermitValid: "",
					selectPlateNo: '',
					guaType: 0,
				})
				that.transmitParams = params;
			},
			saveInfo() {
				//保存信息
				this.$refs.confirmPopup.close();
				var params = this.transmitParams;
				var findIndex = params.findIndex(item => {
					return item.mainImg == ''
				})
				if (findIndex > -1) {
					uni.showToast({
						title: '请上传车辆道路运输证主页',
						icon: 'none'
					})
					return;
				}
				var findIndex1 = params.findIndex(item => {
					return item.id == ''
				})
				if (findIndex1 > -1) {
					uni.showToast({
						title: '请选择车辆',
						icon: 'none'
					})
					return;
				}
				var vehicleParmas = [];
				params.forEach(atem => {
					if (atem.guaType == 1) {
						vehicleParmas.push({
							id: atem.id,
							guaTransMainImg: atem.mainImg,
							guaTransSubImg: atem.subImg,
							gPlateNo: atem.plateNo,
							guaTransValid: atem.transPermitValid,
							guaType: atem.guaType,
							guaTransNo: atem.transPermitNo
						})
					} else {
						vehicleParmas.push({
							transPermitMainImg: atem.mainImg,
							transPermitSubImg: atem.subImg,
							id: atem.id,
							plateNo: atem.plateNo,
							transPermitValid: atem.transPermitValid,
							guaType: atem.guaType,
							transPermitNo: atem.transPermitNo,
						})
					}
				})
				
				uni.showLoading();
				var qualificationsParams = this.qualificationsParams;
				var objParams = {
					vehicleList: vehicleParmas,
					driverVO: qualificationsParams,
					oriVehicleList: this.oriVehicleList,
				}
				console.log(objParams, '参数121212121');
				ship.postRequest("/yh/vehicle/transport/upload/save", objParams)
				.then(res => {
					uni.hideLoading();
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						})
						this.rtMsg = "";
						this.init();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.hideLoading();
				})
				
			},
			
		}
	}
</script>

<style lang="scss">
	.transportVerify {
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
		    padding: 14rpx 36rpx;
		    background-color: #f8f8f8;
		    margin-bottom: 30rpx;
		    .auditMsg {
		      color: #EB6464;
		      font-weight: 500;
		      line-height: 30rpx;
		      font-size: 28rpx;
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
			padding: 20rpx 74rpx 0 74rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			// .upLoadContent:nth-child(2n) {
			// 	margin-right:0;
			// }
			.upLoadContent {
				width: 290rpx;
				height: 360rpx;
				border-radius: 24rpx;
				margin-bottom: 20rpx;
				position: relative;
				.red {
					position: absolute;
					top: -30rpx;
					right: 0;
					color: rgba(255, 0, 0, 1);
				}
				.transportVerifyFont {
					background-image: url('../../../static/images/transportVerify/transportVerifyFont.png');
				}
				.transportVerifyBack {
					background-image: url('../../../static/images/transportVerify/transportVerifyBack.png');
				}
				.certificateVerifyFont {
					background-image: url('../../../static/images/transportVerify/certificateVerifyFont.png');
				}
				.certificateVerifyBack {
					background-image: url('../../../static/images/transportVerify/certificateVerifyBack.png');
				}
				.upLoadBtn {
					width: 290rpx;
					height: 360rpx;
					background-repeat: no-repeat;
					background-size: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.upLoadIcon {
						width: 118rpx;
						height: 118rpx;
						display: block;
						margin:0 auto 8rpx auto;
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
		.certificationDetails {
			padding: 16rpx 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
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
				width: 444rpx;
			  height: 80rpx;
			  line-height: 80rpx;
			  text-align: right;
			  font-size: 32rpx;
			  color: #333;
			  padding: 0 16rpx;
			  border-radius: 12rpx;
			  display: flex;
			  flex-direction: row;
			  justify-content: flex-end;
			  align-items: center;
			  box-sizing: border-box;
			  &.active {
				font-weight: 500;
				background-color: #F8F8F8;
			  }
			}
		}
		.addBtn {
			margin: 22rpx auto 42rpx auto;
			border-radius: 16rpx;
			background-color: rgba(127, 212, 122, 1);
			width: 380rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			font-size: 26rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
		.submitBtn {
			position: fixed;
			left: 135rpx;
			bottom: 74rpx;
			width: 480rpx;
			height: 90rpx;
			line-height: 90rpx;
			background-color: rgba(151, 181, 255, 1);
			border-radius: 16rpx;
			text-align: center;
			font-size: 28rpx;
			color:#FFF;
			&.active {
			  background-color: rgba(82, 131, 255, 1);
			}
			&.isEditAll {
			  background-color: rgba(252, 92, 6, 1);
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
				width: 120rpx;
				height: 146rpx;
				display: block;
				margin: 24rpx auto 38rpx auto;
			}
			.upLoadSampleFalse {
				width: 406rpx;
				height: 152rpx;
				display: block;
				margin: 0 auto 6rpx auto;
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
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 350rpx;
			.content {
				flex: 1;
				width: 450rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}
			.btnGroup {
				display: flex;
				width: 480rpx;
				border-top: 2rpx solid #F1F1F1;
				.btn + .btn {
					border-left: 2rpx solid #F1F1F1;
				}
				.btn {
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
	.recognize-status {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  margin-left: 36rpx;
	  .auditIcon {
	    width: 30rpx;
	    height: 29rpx;
	    margin-right: 12rpx;
	  }
	  .auditF {
	    font-weight: 600;
	    color: red;
	    font-size: 24rpx;
	  }
	  .auditT {
	    font-weight: 600;
	    color: #56B836;
	    font-size: 24rpx;
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
	.errorRed {
		color: red !important;
	}
</style>
