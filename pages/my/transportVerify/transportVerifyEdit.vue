<template>
	<view class="transportVerify">
		<view class="aduitBox" v-if="msg">
			<view class="auditMsg">{{msg}}</view>
		</view>
		
		<view class="mainTitle">
			<view class="title">上传车辆道路运输证4.5吨以上必填</view>
			<image v-if="msg && verifyStatus" class="auditIcon" src="../../../static/images/newCarVerify/auditF.png"></image>
			<image v-if="!msg && verifyStatus" class="auditIcon" src="../../../static/images/newCarVerify/auditT.png"></image>
		</view>
		<view class="viewList" v-for="(dataItem, index) in params">
			<view class="mainUpLoadBox" >
				<view class="upLoadContent">
					<view class="upLoadBtn transportVerifyFont" @click="showPopup('tlF', index)" v-if="!dataItem.transPermitMainImg && !dataItem.guaTransMainImg">
						<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
						<view class="upLoadText">上传车辆道路运输证主页</view>
					</view>
					<image v-else :src="dataItem.transPermitMainImg || dataItem.guaTransMainImg" class="upLoadBtn" @click="showPopup('tlF', index)" />
				</view>
				<view class="upLoadContent">
					<view class="upLoadBtn transportVerifyBack" @click="showPopup('tlB', index)" v-if="!dataItem.transPermitSubImg && !dataItem.guaTransSubImg">
						<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
						<view class="upLoadText">上传车辆道路运输证副页</view>
					</view>
					<image :src="dataItem.transPermitSubImg || dataItem.guaTransSubImg" v-else class="upLoadBtn" @click="showPopup('tlB', index)"></image>
				</view>
			</view>
			
			<view class="certificationDetails">
				<view class="subTitle">车牌号：<text class="syb">*</text></view>
				
				<view class="detailsMsg">
					<picker :range="vehicleArr" range-key="plateNo" :value="dataItem.index || 0" @change="chooseVehicle($event, dataItem, index)">
						<view v-if="dataItem.selectPlateNo">{{dataItem.selectPlateNo}}</view>
						<view v-else>请选择</view>
					</picker>
				</view>
			</view>
		</view>
		
		
		<view class="addBtn" @click="addTrans">添加车辆道路通行证</view>
		
		<view class="mainTitle">
			<view class="title">上传从业资格证4.5吨以上车辆必填</view>
			<image class="auditIcon" v-if="qualificationsParams.qualificationsUrl && isQEdit" src="../../../static/images/newCarVerify/auditT.png"></image>
		</view>
		<view class="mainUpLoadBox">
			<view class="upLoadContent">
				<view class="upLoadBtn certificateVerifyFont" @click="showPopup('clF')" v-if="!qualificationsParams.qualificationsUrl">
					<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传从业资格证主页</view>
				</view>
				<image :src="qualificationsParams.qualificationsUrl" class="upLoadBtn"  @click="showPopup('clF')" v-else></image>
			</view>
			<view class="upLoadContent">
				<view class="upLoadBtn certificateVerifyBack" @click="showPopup('clB')" v-if="!qualificationsParams.qualificationsSubUrl">
					<image class="upLoadIcon" src="../../../static/images/newDriverVerify/upLoadIcon.png"></image>
					<view class="upLoadText">上传从业资格证有效期页</view>
				</view>
				<image :src="qualificationsParams.qualificationsSubUrl" class="upLoadBtn" @click="showPopup('clB')" v-else></image>
			</view>
		</view>
		
		<!-- <view class="certificationDetails">
			<view class="subTitle">姓名<text class="syb">*</text></view>
			<view class="detailsMsg">李大嘴</view>
		</view> -->
		
		<view class="submitBtn" @click="toConfirm()">提交</view>
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
				<view class="popupBtn" @click="sendPhoto">拍照</view>
				<view class="popupBtn" @click="sendFromAl">从手机相册选择</view>
				<view class="popupBtn" @click="closePicturePopup()">取消</view>
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
				<view class="cont">您还没保存信息，是否退出</view>
				<view class="optbtn">
					<view class="cancel opt" @click="cancelBack">取消</view>
					<view class="confirm opt" @click="confirmBack">确定</view>
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
				qualificationsParams: {
					validStatus: 0,
					qualificationsUrl: '',
					qualificationsSubUrl: '',
					userCode: ''
				},
				oriVehicleList: [],
				recogLizeMsg: '',
				driverId: '',
				vehicleArr: [],
				index: 0,
				optIndex: 0,
				msg: '',
				verifyStatus: false,
				isQEdit: false,
				
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
			
			// if (e.from == 'backbutton') {
			// 	if (!this.msg && this.verifyStatus) {
			// 		this.$refs.backPopup.open();
			// 		return true;
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
			async init () {
				var that = this;
				try{
				
					var res = await ship.postRequest("/yh/vehicle/select/list/with/gua/by/driver", {
						driverId: that.driverId
					})
					var rsp = await ship.postRequest("/yh/vehicle/transport/driver/select", {
						driverId: that.driverId
					});
					console.log(res, '车辆', that.driverId);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var items = res.rspBody.items;
						var vehicleArr = [];
						items.forEach(atem => {
							if (atem.status == 1) {
								atem.plateNo = atem.guaType == 1 ? atem.gPlateNo : atem.plateNo
								vehicleArr.push(atem)
							}
						})
						that.vehicleArr = vehicleArr;
						if (rsp.retCode == "0000000") {
							var vehicleList = rsp.rspBody.vehicleList;
							that.oriVehicleList = vehicleList;
							that.verifyStatus = vehicleList.length > 0 ? true : false;
							
							var msg = [];
							//判断是否过期
							var findI = vehicleList.findIndex(atem => {
								return atem.rtStatus === 0 || atem.guaRtStatus === false
							})
							if (findI > -1) {
								msg.push("道路运输证已过期")
							}
							findI = vehicleList.findIndex(atem => {
								return atem.bcStatus === 0 || atem.guaBcStatus === false
							})
							if (findI > -1) {
								msg.push("经营许可证已过期")
							}
							if (msg.length > 0) {
								that.msg = msg.join(",");
							}
							
							
							vehicleList.forEach(item => {
								item.selectPlateNo = item.gPlateNo || item.plateNo
								item.guaType = item.guaType || 0
							})
							console.log(vehicleList, '啊啊啊', vehicleArr);
							if (vehicleList.length > 0) {
								that.params = vehicleList;
							}
							
							that.qualificationsParams = rsp.rspBody.driverVO
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
				var params = this.params;
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
					params[optIndex].gPlateNo = vehicleArr[index].gPlateNo;
				} else {
					params[optIndex].plateNo = vehicleArr[index].plateNo;
				}
				this.params = params;
				this.$forceUpdate();
			},
			showPopup(type, optIndex) {
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
				
				var params = this.params;
				var findIndex = params.findIndex(item => {
					return item.transPermitMainImg == '' && item.guaTransMainImg == ""
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
				this.$refs.confirmPopup.open();
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
							that.uploadTransportImage(tempFilePaths[0])
						} else {
							//从业资格证识别
							that.uploadBackImage(tempFilePaths[0])
						}
						
					}
				});
				
				
			},
			sendFromAl() {
				var that = this;
				//从手机相册选择
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
						if (type == "tlB" || type == "clB") {
							//副业不需要ocr识别
							uni.showLoading({
								title: '上传中...'
							})
							that.uploadFile(tempFilePaths[0]);
						} else if (type == "tlF") {
							that.uploadTransportImage(tempFilePaths[0])
						} else {
							//从业资格证识别
							that.uploadBackImage(tempFilePaths[0])
						}
					}
				});
				
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
				var params = that.params;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/baidu/ocr/v1/vehicle/road/transport", path)
				.then(result => {
					uni.hideLoading();
					var rspBody = result.rspBody;
					if (result.retCode == '0000000') {
						
						params[optIndex].transPermitMainImg = rspBody.image;
						params[optIndex].operationNo = rspBody.operationNo;
						params[optIndex].operationExpire = rspBody.operationExpire || "";
						params[optIndex].transPermitValid = rspBody.transPermitValid || "";
						params[optIndex].transPermitNo = rspBody.transPermitNo || "";
						
						params[optIndex].guaTransMainImg = rspBody.image;
						params[optIndex].guaOperationNo = rspBody.operationNo;
						params[optIndex].guaOperationExpire = rspBody.operationExpire || "";
						params[optIndex].guaTransValid = rspBody.transPermitValid || "";
						params[optIndex].guaTransNo = rspBody.transPermitNo || "";
						
						console.log(result, '识别结果')
						that.$forceUpdate();
					} else {
						params[optIndex].recogLizeImage = rspBody.image;
						that.recogLizeMsg = result.retDesc;
						setTimeout(() => {
							that.$refs.msgPopup.open();
						}, 500)
						
					}
					
				}).catch(err => {
					
					uni.hideLoading();
					params[optIndex].recogLizeImage = err.rspBody.image;
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
					} else {
						that.qualificationsParams.validStatus = 0
						that.recogLizeMsg = "您的从业资格证存在错误，继续将进入人工审核。"
						that.qualificationsParams.recogLizeImage = result.rspBody.image;
						setTimeout(() => {
							that.$refs.msgPopup.open();
						}, 1000)
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
				var params = that.params;
				var optIndex = that.optIndex;
				var qualificationsParams = this.qualificationsParams;
				ship.upLoadFile("/file/upload", path)
				.then(result => {
					uni.hideLoading();
					if (result.retCode == '0000000') {
						console.log(flag, result, 'upfile');
						if (flag == "tlB") {
							//运输证副业
							params[optIndex].transPermitSubImg = result.rspBody[0].url;
							params[optIndex].guaTransSubImg = result.rspBody[0].url;
						} else {
							//从业资格证副业
							qualificationsParams.qualificationsSubUrl = result.rspBody[0].url;
						}
						that.params = params;
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
				var params = this.params;
				var optIndex = this.optIndex;
				var qualificationsParams = that.qualificationsParams;
				if (that.upLoadType == "tlF") {
					var recogLizeImage = params[optIndex].recogLizeImage;
					params[optIndex].transPermitMainImg = recogLizeImage;
				} else {
					var recogLizeImage = qualificationsParams.recogLizeImage;
					qualificationsParams.qualificationsUrl = recogLizeImage;
				}
				that.$forceUpdate();
			
				
			},
			addTrans() {
				//添加道路运输证
				var that = this;
				
				var params = that.params;
				var findIndex = -1;
				findIndex = params.findIndex(item => {
					return item.transPermitMainImg == ""
					
				})
				
				if (findIndex > -1) {
					uni.showToast({
						title: '请上传道路运输证主页',
						icon: 'none'
					})
					return;
				}
				
				findIndex = params.findIndex(item => {
					return item.transPermitSubImg == ""
					
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
					"id":"",
					"transPermitNo":"",
					"transPermitValid":"",
					"operationNo":"",
					"operationExpire":"",
					"transPermitMainImg":"",
					"transPermitSubImg":"",
					"guaTransNo":"",
					"guaTransValid":"",
					"guaOperationNo":"",
					"guaOperationExpire":"",
					"guaTransMainImg":"",
					"guaTransSubImg":"",
					selectPlateNo: '',
					guaType: 0,
				})
				that.params = params;
			},
			saveInfo() {
				//保存信息
				this.$refs.confirmPopup.close();
				var params = this.params;
				var findIndex = params.findIndex(item => {
					return item.transPermitMainImg == ''
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
				uni.showLoading();
				var qualificationsParams = this.qualificationsParams;
				var objParams = {
					vehicleList: params,
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
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.hideLoading();
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.transportVerify {
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
			margin: 0 0 0 38rpx;
			padding: 16rpx 36rpx 16rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #F0F0F0;
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
		.addBtn {
			margin: 22rpx auto 42rpx auto;
			border-radius: 16rpx;
			background-color: #4EADF1;
			width: 380rpx;
			height: 72rpx;
			line-height: 72rpx;
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
</style>
