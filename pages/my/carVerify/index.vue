<template>
	<view class="carVerifyMainPage backgroundView">
	
	  <view class='inputView'>
		<text style='font-size: 30rpx;'>拍摄行驶证，完善车辆信息</text>
		<text style='font-size: 24rpx;color:#999999;padding-bottom: 20rpx;margin-top: 10rpx;color: #999999;'>确保图片清晰，四角完整</text>
	  </view>
	  <view class='cardView1'>
	    <view>行驶证照片</view>
	    <view class='imageView'>
	      <image class='card' style='border: 1rpx dashed #999999;' :src="faceImage" @click='faceSelect(1)'></image>
	      <image class='card' style='border: 1rpx dashed #999999;' :src="backImage" @click='faceSelect(2)'></image>
	    </view>
	  </view>
	  <view class="infoView">
	  		<view class='nameView' @click="toCarView">
	  		  <span style='color:red;'>*</span>
	  		  <text class="text">车型车长</text>
	  		  <view class="arrow_right">
	  			  <view>{{commonCarModel}}</view>
	  			  <view>{{commonCarLength}}</view>
	  			  <image src="../../../static/images/newRightIcon.png" class="rightIcon"></image>
	  			</view>
	  		</view>
	    <view class='nameView'>
	      <span style='color:red;'>*</span>
	      <text class="text">车牌号</text>
	      <input placeholder="车牌号" placeholder-style="font-size:28rpx;" maxlength="7" v-model="params.plateNo"></input>
	    </view>
	  </view>
	  <view class="infoView" v-if="isMainOcr">
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">车辆识别码</text>
		    <input placeholder="车辆识别码" placeholder-style="font-size:28rpx;" maxlength="17" v-model="params.vehicleIdNo"></input>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">车辆所有人</text>
		    <input placeholder="车辆所有人" placeholder-style="font-size:28rpx;" v-model="params.ownerName"></input>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">车辆类型</text>
		    <picker class="pickerDate" mode="selector" :range="vehicleTypeArr" range-key="name" :value="vehicleTypeIndex"  @change="bindVehicleType">
		    	<view v-if="params.vehicleType">{{ params.vehicleType }}</view>
		  	<view v-else class="defaultDate">
		  		<text>请选择车辆类型 ></text>
		  	</view>
		    </picker>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">外廓尺寸</text>
		    <input placeholder="外廓尺寸" placeholder-style="font-size:28rpx;" v-model="params.gabarite"></input>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">车牌颜色</text>
		    <picker class="pickerDate" mode="selector" :range="vehicleColorArr" range-key="name" :value="vehicleColorIndex"  @change="bindVehicleColor">
		    	<view v-if="params.vehiclePlateColor">{{ params.vehiclePlateColor }}</view>
		    			<view v-else class="defaultDate">
		  				<text>请选择车牌颜色 ></text>
		  			</view>
		    </picker>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">车辆能源类型</text>
		    <picker class="pickerDate" mode="selector" :range="vehicleEnergyArr" range-key="name" :value="vehicleEnergyIndex"  @change="bindVehicleEnergy">
		    	<view v-if="params.vehicleEnergyType">{{ params.vehicleEnergyType }}</view>
		    			<view v-else class="defaultDate">
		  				<text>请选择车辆能源类型 ></text>
		  			</view>
		    </picker>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">车辆总质量(kg)</text>
		    <input placeholder="整备+牵引" type="digit" placeholder-style="font-size:28rpx;" maxlength="8" v-model="params.totalWeight"></input>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">整备质量(kg)</text>
		    <input placeholder="整备质量" type="digit" placeholder-style="font-size:28rpx;" maxlength="8" v-model="params.fullWeight"></input>
		  </view>
		  <view class='nameView'>
		    <text class="text">核定载质量(kg)</text>
		    <input placeholder="核定载质量" type="digit" placeholder-style="font-size:28rpx;" maxlength="8" v-model="params.vehicleCapacity"></input>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">使用性质</text>
		    <input placeholder="使用性质" maxlength="24" placeholder-style="font-size:28rpx;" v-model="params.useFor"></input>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">品牌型号</text>
		    <input placeholder="品牌型号" maxlength="50" placeholder-style="font-size:28rpx;" v-model="params.model"></input>
		  </view>
		  <view class='nameView'>
		    <span style='color:red;'>*</span>
		    <text class="text">行驶证发证机关</text>
		    <input placeholder="行驶证发证机关" placeholder-style="font-size:28rpx;" v-model="params.issuingOrganizations"></input>
		  </view>
		  <view class='nameView newTimePicker'>
		  	<span style='color:red;'>*</span>
		  	<text class="text">行驶证注册日期</text>
		  	<!-- <picker class="pickerDate" mode="date" :value="params.regDate" :start="startDate" :end="endDate" @change="bindDateChange">
		  		<view v-if="params.regDate">{{ params.regDate }}</view>
		  		<view v-else class="defaultDate">行驶证注册日期</view>
		  	</picker> -->
			<uni-datetime-picker
			  type="date"
				:border="false"
				:clear-icon="false"
				:placeholder="'行驶证注册日期'"
			  v-model="params.regDate"
			  @change="changeRegDateDate"
				style="text-align: right;color:#333;"
			/>
		  </view>
		  <view class='nameView newTimePicker'>
		    <span style='color:red;'>*</span>
		    <text class="text">行驶证发证日期</text>
		   <!-- <picker class="pickerDate" mode="date" :value="params.checkDate" :start="startDate" :end="endDate" @change="bindDateChange1">
		    	<view v-if="params.checkDate">{{ params.checkDate }}</view>
		    	<view v-else class="defaultDate">行驶证发证日期</view>
		    </picker> -->
			<uni-datetime-picker
			  type="date"
				:border="false"
				:clear-icon="false"
				:placeholder="'行驶证发证日期'"
			  v-model="params.checkDate"
			  @change="changeCheckDateDate"
				style="text-align: right;color:#333;"
			/>
		  </view>
		  <view class='nameView newTimePicker'>
		    <text class="text">行驶证有效期至</text>
		    <!-- <picker class="pickerDate" mode="date" :value="params.vehicleValidTo" :start="startDate" :end="endDate" @change="bindDateChange2">
		    	<view v-if="params.vehicleValidTo">{{ params.vehicleValidTo }}</view>
		    	<view v-else class="defaultDate">行驶证有效期至</view>
		    </picker> -->
			<uni-datetime-picker
			  type="date"
				:border="false"
				:clear-icon="false"
				:placeholder="'行驶证有效期至'"
			  v-model="params.vehicleValidTo"
			  @change="changeVehicleValidToDate"
				style="text-align: right;color:#333;"
			/>
		  </view>
		  <view class='nameView'>
		    <text class="text">行驶证档案编号</text>
		    <input placeholder="行驶证档案编号" placeholder-style="font-size:28rpx;" maxlength="12" v-model="params.recordCode"></input>
		  </view>
	  </view>
	  <view class="tips-note" v-if="!isCollapse" @click="switchCollapse">
		  <text>若需承接网络货运货源，请完善以下信息</text>
		  <image src="/static/images/down_spand.png" class="down-icon"></image>
	  </view>
	  <view class="tips-up" v-else @click="switchCollapse">
	  		  <text>若需承接网络货运货源，请完善以下信息</text>
	  		  <image src="/static/images/up-icon.png" class="down-icon"></image>
	  </view>
	  
		<view class='cardView1' v-if="isCollapse">
			<view>车辆道路运输证</view>
			<view class='imageView'>
				<image class='card' style='border: 1rpx dashed #999999;' :src="transPermitMainImg1" @click='faceSelect(3)'></image>
				<image class='card' style='border: 1rpx dashed #999999;' :src="transPermitSubImg1" @click='faceSelect(6)'></image>
			</view>
			<view class='imageView'>
				<image class='card' style='border: 1rpx dashed #999999;' :src="vehicleImg1" @click='faceSelect(4)'></image>
				<image class='card' style='border: 1rpx dashed #999999;' :src="sideImage" @click='faceSelect(5)'></image>
			</view>
		</view>
		<view class='cardView1' v-if="isCollapse">
			<view>挂车行驶证</view>
			<view class='imageView'>
					<image class='card' style='border: 1rpx dashed #999999;' :src="gVehicleMainImg1" @click='faceSelect(7)'></image>
					<image class='card' style='border: 1rpx dashed #999999;' :src="gVehicleSubImg1" @click='faceSelect(8)'></image>
			</view>
		</view>
	  
	  <view class="infoView" v-if="isCollapse">
	   
		<view class='nameView'>
		 
		  <text class="text">道路运输证号</text>
		  <input placeholder="道路运输证号" @blur="blur1" maxlength="20" placeholder-style="font-size:28rpx;" v-model="params.transPermitNo"></input>
		</view>
		<view class='nameView newTimePicker'>
		 
		  <text class="text">道路运输证有效期至</text>
		 <!-- <picker class="pickerDate" mode="date" :value="params.transPermitValid" :start="startDate" :end="endDate" @change="bindDateChange5">
		  	<view v-if="params.transPermitValid">{{ params.transPermitValid }}</view>
		  	<view v-else class="defaultDate">道路运输证有效期至</view>
		  </picker> -->
		  <uni-datetime-picker
		    type="date"
		  	:border="false"
		  	:clear-icon="false"
		  	:placeholder="'道路运输证有效期至'"
		    v-model="params.transPermitValid"
		    @change="changeTransPermitValidDate"
		  	style="text-align: right;color:#333;flex: 1;"
		  />
		</view>
		<view class='nameView'>
		  
		  <text class="text">经营许可证号</text>
		  <input placeholder="经营许可证号" @blur="blur" maxlength="20" placeholder-style="font-size:28rpx;" v-model="params.operationNo"></input>
		</view>
		<view class='nameView newTimePicker'>
		  
		  <text class="text">经营许可证有效期至</text>
		 <!-- <picker class="pickerDate" mode="date" :value="params.operationExpire" :start="startDate" :end="endDate" @change="bindDateChange3">
		  	<view v-if="params.operationExpire">{{ params.operationExpire }}</view>
		  	<view v-else class="defaultDate">经营许可证有效期至</view>
		  </picker> -->
		  <uni-datetime-picker
		    type="date"
		  	:border="false"
		  	:clear-icon="false"
		  	:placeholder="'经营许可证有效期至'"
		    v-model="params.operationExpire"
		    @change="changeOperationExpireDate"
		  	style="text-align: right;color:#333;flex: 1;"
		  />
		</view>
		<view class='nameView'>
		  <text class="text">挂车牌照号</text>
		  <input placeholder="挂车牌照号" placeholder-style="font-size:28rpx;" maxlength="20" v-model="params.gPlateNo"></input>
		</view>
		<view class='nameView'>
		  <text class="text">是否挂靠</text>
		  <picker class="pickerDate" mode="selector" :range="isHangArr" :value="index"  @change="bindDateChange4">
		  	<view>{{ isHangArr[index] }}</view>
		  </picker>
		</view>
	  </view>
	  <view class='SaveBtn' @click='saveInfoSelect'>{{saveBtnTitle}}</view>
	  <view style='display: flex;flex-direction: row;width: 100%;padding-bottom: 20rpx;'>
	    <text style='text-align: center;font-size: 20rpx;width:100%;color:#999999;'>您的信息我们将严格为您保管，请您放心</text>
	  </view>
	  
	  
	  
	</view>
</template>

<script>
	import {postRequest, upLoadFile} from "../../../utils/service.js";
	import * as utils from "@/utils/utils";
	import * as ship from "@/utils/ship";
	var commonHtmlTitle = '车辆认证';
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			});
			return {
				isMainOcr: false,
				isCollapse: false,
				date: currentDate,
				faceImage: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/driverMainImage.jpg",
				backImage: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/drivingLicense.jpg",
				sideImage: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/drivingSide.png",
				backImageUrl: '',
				username: '',
				saveBtnTitle: '提交',
				carNo: '',
				vinCode: '',
				carName: '',
				driverName: '',
				frontImageInfo: '',
				frontImageStatus: 0,
				backImageStatus: 0,
				driverInfo: "",
				commonCarModel: '',
				commonCarLength: '',
				transPermitMainImg: '',
				transPermitMainImg1: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/transPermitMainImg.jpg',
				transPermitSubImg1: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/transPermitSubImg.jpg",
				transPermitSubImg: "",
				vehicleImg: '',
				vehicleImg1: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/vehicleImg1.png',
				gVehicleSubImg1: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/gVehicleSubImg.png",
				gVehicleMainImg1: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/gVehicleMainImg.png",
				params: {
					licenseMainImg: "",
					licenseBackImg: "",
					plateNo: "",
					isHang: 0,
					vehiclePlateColor: '黄色',
					fullWeight: '',
					vehicleCapacity: '',
				},
				isHangArr: ["否", "是"],
				vehicleTypeArr: [],
				index: 0,
				userInfo: null,
				vehicleTypeIndex: 0,
				vehicleColorArr: [],
				vehicleColorIndex: 0,
				vehicleEnergyArr: [],
				vehicleEnergyIndex: 0,
			}
		},
		onLoad() {
			this.isConfirmVilid = false;
			var userInfo = uni.getStorageSync("userInfo");
			console.log(userInfo, 'aaaaa')
			this.userInfo = userInfo;
			uni.$on("driverVal", data => {
				console.log(data, 'aa')
				var vehicleLength = data.vehicleLength;
				var vehicleModel = data.vehicleModel;
				if (vehicleLength) {
					this.commonCarModel = vehicleModel[0].typeName;
					this.commonCarModelCode = vehicleModel[0].typeCode;
				}
				if (vehicleModel) {
					this.commonCarLength = vehicleLength[0].typeName
					this.commonCarLengthCode = vehicleLength[0].typeCode
				}
				this.$forceUpdate();
				
			})
			
			//获取车辆类型
			this.getVehicleType();
			//获取车辆能源类型
			this.getVehicle_energy_type();
			//获取车牌颜色
			this.getVehicleColor();
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
		},
		watch: {
			'params.fullWeight': {
				handler(newVal, oldVal) {
					this.params.totalWeight = Number(newVal) + Number(this.params.vehicleCapacity)
				},
			},
			'params.vehicleCapacity': {
				handler(newVal, oldVal) {
					console.log(newVal, oldVal, '1111')
					this.params.totalWeight = Number(newVal) + Number(this.params.fullWeight)
				},
			}
		},
		methods: {
			changeRegDateDate(e) {
			    this.params.regDate = e;
			    console.log("行驶证注册日期:", e);
			},
			changeCheckDateDate(e) {
				this.params.checkDate = e;
				console.log("道路运输证有效期至:", e);
			},
			changeVehicleValidToDate(e) {
				this.params.vehicleValidTo = e;
				console.log("道路运输证有效期至:", e);
			},
			changeTransPermitValidDate(e) {
				this.params.transPermitValid = e;
				console.log("道路运输证有效期至:", e);
			},
			changeOperationExpireDate(e) {
				this.params.operationExpire = e;
				console.log("经营许可证有效期至:", e);
			},
			blur(e) {
				var val = e.detail.value;
				var value = utils.filterEnmo(val);
				console.log(value, 'aaa');
				this.params.operationNo = value;
				this.$forceUpdate();
			},
			blur1(e) {
				var val = e.detail.value;
				var value = utils.filterEnmo(val);
				console.log(value, 'aaa');
				this.params.transPermitNo = value;
				this.$forceUpdate();
			},
			async getVehicleType() {
				try{
					var res = await ship.postRequest("/type/set/traf/dict/find/type", {
						type: 30
					}, 'GET')
					console.log(res, '车辆类型')
					if (res.retCode == "0000000") {
						this.vehicleTypeArr = res.rspBody;
					}
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			async getVehicleColor() {
				try{
					var res = await ship.postRequest("/type/set/traf/dict/find/type", {
						type: 20
					}, "GET")
					console.log(res, '车牌颜色')
					if (res.retCode == "0000000") {
						this.vehicleColorArr = res.rspBody;
					}
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			async getVehicle_energy_type() {
				
				try{
					var res = await ship.postRequest("/type/set/traf/dict/find/type", {
						type: 40
					}, 'GET')
					console.log(res, '车辆能源类型')
					if (res.retCode == "0000000") {
						this.vehicleEnergyArr = res.rspBody;
					}
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			bindDateChange: function(e) {
				//注册日期
					this.params.regDate = e.target.value;
					this.$forceUpdate();
			},
			bindDateChange1(e) {
				//发证日期
				this.params.checkDate = e.target.value;
				this.$forceUpdate();
			},
			bindDateChange2(e) {
				//行驶证有效期至
				this.params.vehicleValidTo = e.target.value;
				this.$forceUpdate();
			},
			bindDateChange3(e) {
				//经营许可证有效期至
				this.params.operationExpire = e.target.value;
				this.$forceUpdate();
			},
			bindDateChange4(e) {
				//是否挂靠
				console.log(e, "Aaaaa");
				this.params.isHang = e.target.value;
				this.index = e.target.value;
				
				this.$forceUpdate();
			},
			bindDateChange5(e) {
				//道路运输许可证有效期止
				this.params.transPermitValid = e.target.value;
				this.$forceUpdate();
			},
			bindVehicleType(e) {
				//车辆类型选择
				console.log(e, "Aaaaa");
				var vehicleTypeArr = this.vehicleTypeArr;
				this.vehicleTypeIndex = e.target.value;
				this.params.vehicleType = vehicleTypeArr[this.vehicleTypeIndex].name;
				this.$forceUpdate();
			},
			bindVehicleColor(e) {
				//车牌颜色
				var vehicleColorArr = this.vehicleColorArr;
				this.vehicleColorIndex = e.target.value;
				this.params.vehiclePlateColor = vehicleColorArr[this.vehicleColorIndex].name;
				this.$forceUpdate();
			},
			bindVehicleEnergy(e) {
				var vehicleEnergyArr = this.vehicleEnergyArr;
				this.vehicleEnergyIndex = e.target.value;
				this.params.vehicleEnergyType = vehicleEnergyArr[this.vehicleEnergyIndex].name;
				this.$forceUpdate();
			},
			
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
		
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 60;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			goHZ() {
				uni.navigateTo({
					url:"../mutualAssistance/index"
				})
			},
			faceSelect(flag) {
				var that = this;
				uni.chooseImage({
					count: 1, // 默认9  
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						var tempFiles = res.tempFiles;
						var size = tempFiles[0].size;
						if (size - 1024*1024*2 > 0) {
							uni.showToast({
								title:"上传文件过大，请重新上传！",
								icon: 'none'
							})
							return;
						}
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
						var tempFilePaths = res.tempFilePaths
						if (flag == 1) {
							that.uploadFrontImage(tempFilePaths[0]); //行驶证主页
						} else if (flag == 2) {
							that.uploadBackImage(tempFilePaths[0]); //行驶证副业
						} else {
							that.uploadFile(tempFilePaths[0], flag);
						}
					}
				})
			},
		   uploadFrontImage: function(path) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/baidu/ocr/v1/vehicle/front", path)
				.then(result => {
					uni.hideLoading()
					if (result.retCode == '0000000') {
						this.isMainOcr = true;
						var rspBody = result.rspBody;
						that.params.licenseMainImg = rspBody.image;
						that.faceImage = rspBody.image;
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
							  vehicleValidTo = resultStr;
							}
						}
						that.params.vehicleValidTo = vehicleValidTo;
						
						
						that.$forceUpdate();
					} else {
						uni.showToast({
							title: '识别失败',
							icon: 'none'
						})
					}
					
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '未识别出有效的行驶证',
						icon: 'none'
					})
				})
			},
			hanleCheckDate(time,flag) {
			    var date = time;
			   if (date != null && date != "") {
			     if (date.length != 10 || date.substr(4, 1) != "-"
			         || date.substr(7, 1) != "-") {
			           if(flag==1){
						  this.tipsMsg = '注册日期识别失败!';
			           }else{
						  this.tipsMsg = '发证日期识别失败!';
			           }
			       time = "";
			       return false;
			     } 
			     var result = date
			         .match(/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig);
			     if (result == null || result == "") {
			      if(flag==1){
			        this.tipsMsg = '注册日期识别失败!';
			      }else{
			        this.tipsMsg = '发证日期识别失败!';
			      }
			       time = "";
			       return false;
			     }else{
			        return true;
			     }
			   }else{
			     return false;
			   }
			 },
			uploadBackImage: function(path) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/baidu/ocr/v1/vehicle/back", path)
				.then(result => {
					console.log(result, '行驶证副页')
					uni.hideLoading();
					if (result.retCode == '0000000') {
						var rsp = result.rspBody;
						that.backImage = rsp.image;
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
						uni.showToast({
							title: '未识别出有效行驶证副页',
							icon: 'none',
							duration: 3000
						})
					}
					
				}).catch(err => {
					console.log(err)
					uni.hideLoading();
				})
			},
			uploadFile(path, flag) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				upLoadFile("/file/upload", path)
				.then(result => {
					uni.hideLoading();
					if (result.retCode == '0000000') {
						
						if (flag == 3) {
							//道路运输证主页
							that.params.transPermitMainImg = result.rspBody.url;
							that.transPermitMainImg1 = result.rspBody.url;
						} else if (flag == 4) {
							// 车辆照片
							that.vehicleImg1 = result.rspBody.url;
							that.params.vehicleImg = result.rspBody.url;
						} else if (flag == 5) {
							//行驶证反面
							that.sideImage = result.rspBody.url;
							that.params.licenseBackImg = result.rspBody.url;
						} else if (flag == 6) {
							//道路运输许可证反面
							that.transPermitSubImg1 = result.rspBody.url;
							that.params.transPermitSubImg = result.rspBody.url;
						} else if (flag == 7) {
							//挂车行驶证主页
							that.gVehicleMainImg1 = result.rspBody.url;
							that.params.gLicenseMainImg = result.rspBody.url;
						} else if (flag == 8) {
							//挂车行驶证副业
							that.gVehicleSubImg1 = result.rspBody.url;
							that.params.gLicenseSubImg = result.rspBody.url;
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
					uni.hideLoading();
				})
			},
			saveInfoSelect() {
				var that = this;
				var isCollapse = this.isCollapse;
				var commonCarLength = this.commonCarLength;
				var params = this.params;
				if (!that.params.plateNo){
					uni.showToast({
						title: '请输入车牌号',
						icon: 'none'
					})
					return;
				}
				if (!that.params.vehicleIdNo) {
					uni.showToast({
						title: '请输入车辆识别码',
						icon: 'none'
					})
					return;
				}
				if (!that.params.ownerName){
					uni.showToast({
						title: '请输入车辆所有人',
						icon: 'none'
					})
					return;
				}
				if (!that.params.vehicleType){
					uni.showToast({
						title: '请选择车辆类型',
						icon: 'none'
					})
					return;
				}
				if (!that.params.gabarite){
					uni.showToast({
						title: '请输入外廓尺寸',
						icon: 'none'
					})
					return;
				}
				if (!that.params.vehiclePlateColor){
					uni.showToast({
						title: '请选择车牌颜色',
						icon: 'none'
					})
					return;
				}
				if (!that.params.vehicleEnergyType){
					uni.showToast({
						title: '请选择车辆能源类型',
						icon: 'none'
					})
					return;
				}
				if (!that.params.totalWeight){
					uni.showToast({
						title: '请输入车辆总质量',
						icon: 'none'
					})
					return;
				}
				if (!that.params.fullWeight){
					uni.showToast({
						title: '请输入车辆整备质量',
						icon: 'none'
					})
					return;
				}
				// if (!that.params.vehicleCapacity){
				// 	uni.showToast({
				// 		title: '请输入车辆核定载质量',
				// 		icon: 'none'
				// 	})
				// 	return;
				// }
				if (!that.params.useFor){
					uni.showToast({
						title: '请输入车辆使用性质',
						icon: 'none'
					})
					return;
				}
				
				if (!that.params.model){
					uni.showToast({
						title: '请输入车辆品牌',
						icon: 'none'
					})
					return;
				}
				if (!that.params.issuingOrganizations){
					uni.showToast({
						title: '请输入发证机关',
						icon: 'none'
					})
					return;
				}
				if (!that.params.regDate){
					uni.showToast({
						title: '请输入行驶证注册日期',
						icon: 'none'
					})
					return;
				}
				if (!that.params.checkDate){
					uni.showToast({
						title: '请输入行驶证发证日期',
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
				if (!this.commonCarLength) {
					uni.showToast({
						title: '请选择车长',
						icon: 'none'
					})
					return;
				}
				if (!this.commonCarModel) {
					uni.showToast({
						title: '请选择车型',
						icon: 'none'
					})
					return;
				}
				if (isCollapse) {
					if (commonCarLength !== undefined && commonCarLength > 4.5) {
						if (!that.params.transPermitMainImg) {
							uni.showToast({
								title: '请上传道路运输证主页',
								icon: 'none'
							})
							return;
						}
						if (!that.params.transPermitSubImg) {
							uni.showToast({
								title: '请上传道路运输证副页',
								icon: 'none'
							})
							return;
						}
						// if (!params.operationNo) {
						// 	uni.showToast({
						// 		title: '请输入经营许可证号',
						// 		icon: 'none'
						// 	})
						// 	return;
						// }
						// if (!params.operationExpire) {
						// 	uni.showToast({
						// 		title: '请选择经营许可证有效期至',
						// 		icon: 'none'
						// 	})
						// 	return;
						// }
					}
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
				
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var driverId = JSON.parse(userInfo).attrs.driverId;
				uni.showLoading({
					title: '请稍候...',
				})
				var parm = this.params;
				parm.vehicleLength = this.commonCarLength;
				parm.ext1 = this.commonCarModel;
				parm.carModelDictCode = this.commonCarModelCode;
				parm.carLengthDictCode = this.commonCarLengthCode;
				//司机的driverId
				parm.driverId = driverId;
				console.log(parm, '参数');
			
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var userCode = JSON.parse(userInfo).attrs.userCode;
				ship.postRequest("/yh/vehicle/license/upload?userCode=" + userCode, parm).then(function(res) {
					console.log(res);
					if (res.retCode == '0000000') {
						uni.showToast({
							title: '车辆认证成功'
						})
						var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
						userInfo.attrs.vehicleVerify = 1;
						console.log(userInfo, 'aa')
						uni.setStorageSync("userInfo", JSON.stringify(userInfo));
						setTimeout(() => {
							uni.switchTab({
								url: '../index/index'
							})
						}, 1000)
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				});
			},
			getDriverInfo: function() {
				var that = this;
				postRequest("/au/user/detail", {commonHtmlTitle: commonHtmlTitle}).then(function(res) {
					console.log(res);
					if (res.retCode == '0000000') {
						var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
						console.log(userInfo, user, 'asa')
						userInfo.attrs.vehicleVerify = 1;
						uni.setStorageSync("userInfo", JSON.stringify(userInfo));
					
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				});
			},
			toCarView() {
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
			switchCollapse() {
				this.isCollapse = !this.isCollapse
			}
			
		}
	}
</script>

<style lang="scss">
	.backgroundView {
	    width: 100vw;
	    height: 100vh;
		overflow-x: hidden;
	    background: #F4F4F4;
	}
	.carVerifyMainPage {
		.navTop {
		    background: #fff;
		    height: 130rpx;
		    display: flex;
		    flex-direction: column;
		    justify-content: center;
		    align-items: center;
		}
		
		.navTop view {
		    height: 65rpx;
		}
		
		.navTop view image {
		    width: 33rpx;
		    height: 33rpx;
		    position: absolute;
		    left: 10rpx;
		    top: 75rpx;
		}
		
		.topView {
		    height: 120rpx;
		    width: 100%;
		    margin-top: 0;
		    /* width: 200rpx; */
		    background: #F4F4F4;
		    display: flex;
		    flex-direction: column;
		    align-items: center;
		}
		
		
		
		.roundView1 {
		    margin-top: 30rpx;
		    width: 20rpx;
		    height: 20rpx;
		    background: #FF7142;
		    border-radius: 20rpx;
		}
		.newTimePicker {
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
				font-size: 28rpx !important;
			}
			.input-placeholder {
				font-size: 28rpx !important;
				color: #ccc !important;
			}
			.uni-input-input {
				font-size: 28rpx !important;
				color:#000 !important;
			}
		}
		.roundView2 {
		    margin-top: 30rpx;
		    width: 16rpx;
		    height: 16rpx;
		    /* background:  red ; */
		    border-radius: 16rpx;
		    border: 1px solid gray;
		}
		
		.lineView {
		    margin-top: 38rpx;
		    width: 140rpx;
		    height: 2rpx;
		    background: #999999;
		}
		
		.topView text {
		    margin-top: 10rpx;
		    font-size: 20rpx;
		    color: #999999;
		    width: 170rpx;
		    text-align: center;
		}
		
		.inputView {
		    padding-left: 20rpx;
		    padding-top: 20rpx;
		    background: white;
		    width: 100%;
		    height: 120rpx;
		    text-align: left;
		    display: flex;
		    flex-direction: column;
		    justify-content: center;
		}
		
		.infoView {
		    width: 100vw;
		}
		
		.nameView {
		   padding-left: 20rpx;
		   padding-right: 20rpx;
		   background: white;
		   height: 100rpx;
		   align-items: center;
		   display: flex;
		   flex-direction: row;
		   /* justify-content: space-between; */
		   border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
		   /* background: red; */
		   box-sizing: border-box;
		}
		
		.nameView .text {
		    margin-right: 20rpx;
		    font-size: 28rpx;
		    height: 100rpx;
		    display: flex;
		    flex-direction: column;
		    justify-content: center;
		    color: #333333;
		    width: 40%;
		    line-height: 100rpx;
		    /* background: red; */
		}
		
		.nameView input {
		   text-align: right;
		   font-size: 28rpx;
		   flex: 1;
		   height: 100rpx;
		}
		
		.cardView1 {
		    width: 100%;
		    margin-top: 20rpx;
		    background: white;
		    padding-left: 20rpx;
		    padding-top: 20rpx;
			padding-bottom: 20rpx;
		}
		
		.cardView1 rich-text {
		    font-size: 28rpx;
		}
		
		.imageView {
		    margin-top: 20rpx;
		    width: 100%;
		    height: 200rpx;
		    /* background: red; */
		    display: flex;
		    flex-direction: row;
		    justify-content: center;
		}
		
		.card {
		    width: 50%;
		    height: 200rpx;
		    /* background: blue;  */
		    margin-right: 40rpx;
		}
		
		.contractView {
		    margin-left: 20rpx;
		    margin-top: 20rpx;
		    height: 50rpx;
		    width: 90vw;
		    /* background-color: red; */
		}
		
		.contractView text {
		    height: 30rpx;
		    margin-top: 18rpx;
		    font-size: 22rpx;
		    color: #333;
		    /* background-color: rebeccapurple; */
		}
		
		
		/*checkbox 选项框大小  */
		
		checkbox .wx-checkbox-input {
		    width: 30rpx;
		    height: 30rpx;
		    border-radius: 16rpx;
		    /* border: none; */
		}
		
		
		/*checkbox选中后样式  */
		
		checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		    background: #09BB07;
		}
		
		checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		    width: 28rpx;
		    height: 28rpx;
		    line-height: 28rpx;
		    text-align: center;
		    font-size: 22rpx;
		    color: white;
		    background: transparent;
		    transform: translate(-50%, -50%) scale(1);
		    -webkit-transform: translate(-50%, -50%) scale(1);
		}
		
		.checkView rich-text {
		    margin-left: 20rpx;
		    height: 30rpx;
		}
		
		.SaveBtn {
		    margin: 68rpx 60rpx 20rpx 60rpx;
		    width: calc(100vw - 120rpx);
		    height: 94rpx;
		    color: white;
		    display: flex;
		    flex-direction: column;
		    justify-content: center;
			align-items: center;
		    font-size: 36rpx;
		    border-radius: 47rpx;
		    border: none;
			background-color: #469DFC;
		}
		
		.show {
		    display: block;
		}
		
		.disappear {
		    display: none;
		}
		
		.user-type{
		    padding: 20rpx;
		    background-color: #fff;
		    margin-bottom: 20rpx;
		}
		.arrow_right {
			width: calc(100vw - 100rpx);
			height: 100rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding-right: 30rpx;
		}
		.text {
			font-size: 24rpx;
			padding: 0;
			margin: 0;
			color: #333333;
		}
		.text:first-child {
			
			padding-right: 10rpx;
			
		}
		.rightIcon {
			width: 25rpx;
			height: 35rpx;
		}
		.pickerDate {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			flex: 1;
			font-size: 28rpx;
		}
		.defaultDate {
			color: #ccc;
			font-size: 28rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		.tips-note {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			font-size: 26rpx;
			color: #C6DEFF;
			padding: 0 32rpx;
			height: 68rpx;
			background-color: #0171F9;
			box-sizing: border-box;
			.down-icon {
				width: 22rpx;
				height: 24rpx;
			}
		}
		.tips-up {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			font-size: 26rpx;
			color: #0171F9;
			padding: 0 32rpx;
			height: 68rpx;
			box-sizing: border-box;
			.down-icon {
				width: 22rpx;
				height: 24rpx;
			}
		}
	}
</style>
