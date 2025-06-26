<template>
	<view class="driverVerifyMainPage">
	  <view v-if="showMsg()" class="error">{{showMsg()}}</view>
	  <view class='inputView'>
		  <view class="subTitle">
				<text style='font-size: 32rpx; font-weight: bold;'>上传驾驶证，完善身份信息。</text>
				<image src="/static/images/verify.png" class="verify" v-if="params.id"></image>
				<text class="active" v-if="params.id && params.driverVerify == 1">已认证</text>
			    <text class="active" v-if="params.id && params.driverVerify != 1">未认证</text>
		  </view>
	    <text style='font-size: 24rpx;color:#999999;margin-top: 10rpx;'>确保图片清晰，四角完整</text>
	  </view>
	  <view class='cardView1'>
	    <rich-text>
	    <!-- {{type?'传驾驶证照片':'请上传驾驶证主页和副页'}} -->
	      <text style="color:red;">*</text>请上传驾驶证主页和副页</rich-text>
	    <view v-if="isEdit">
			<view class='imageView'>
			  <image class='card' style='border: 1rpx dashed #999999;' :src="driverFrontImage" @click='faceSelect(3)' ></image>
			  <image class='card' style='border: 1rpx dashed #999999;' :src="driverBackImage" @click='faceSelect(4)'></image>
			</view>
		</view>
		
	  <!-- 	<view class='imageView' v-else>
			<image class='card' style='border: 1rpx dashed #999999;' :src="driverFrontImage" @click='prevImage(driverFrontImage)' ></image>
			<image class='card' style='border: 1rpx dashed #999999;' :src="driverBackImage" @click='prevImage(driverBackImage)'></image>
	  	</view> -->
		<view v-else>
			<view class='imageView'>
				<view class="cardBox" @click='prevImage(driverFrontImage)'>
					<image class='newCard' :src="driverFrontImage"></image>
				</view>
				<view class="cardBox" @click='prevImage(driverBackImage)'>
					<image class='newCard' :src="driverBackImage"></image>
				</view>
			</view>
		</view>
		
	  </view>
	  <view class="infoView">
		
		<view class='nameView'>
		  <text>姓名<text class="red">*</text></text>
		  <input class="viewInput" placeholder='请输入姓名' placeholder-style="color:#999" :disabled="!isEdit" v-model="params.userName"></input>
		</view>
	    <view class='nameView'>
	      <text>驾驶证号<text class="red">*</text></text>
	      <input class="viewInput" placeholder='请输入驾驶证号' placeholder-style="color:#999" :disabled="!isEdit" v-model="params.licenseId"></input>
	    </view>
		<view class='nameView'>
		  <text>准驾车型<text class="red">*</text></text>
		  <input class="viewInput" placeholder='请输入准驾车型' placeholder-style="color:#999" :disabled="!isEdit" v-model="params.permitType"></input>
		</view>
		<view class='nameView'>
		  <text>驾驶证发证机关<text class="red">*</text></text>
		  <input class="viewInput" placeholder='请输入驾驶证发证机关' placeholder-style="color:#999" :disabled="!isEdit" v-model="params.issuingOrganizations"></input>
		</view>
		<view class='nameView newTimePicker'>
		  <text>初次领证时间<text class="red">*</text></text>
		 <!-- <picker mode="date" :value="params.licenseDate" :start="startDate" :end="endDate" @change="bindDateChange">
			  <view v-if="params.licenseDate">{{params.licenseDate}}</view>
			  <view class="noMsgHint" v-else>请选择领证时间</view>
		  </picker> -->
		  <uni-datetime-picker
		    type="date"
		  	:border="false"
		  	:clear-icon="false"
		  	:placeholder="'请选择领证时间'"
		    v-model="params.licenseDate"
		    @change="changeLicenseDate"
		  	style="text-align: right;color:#333;"
		  />
		</view>
		<view class='nameView newTimePicker'>
		  <text>有效期起<text class="red">*</text></text>
		<!--  <picker mode="date" :value="params.validFrom" :start="startDate" :end="endDate" @change="bindDateChange1">
			  <view v-if="params.validFrom">{{params.validFrom}}</view>
			  <view class="noMsgHint" v-else>请选择有效期起</view>
		  </picker> -->
		  <uni-datetime-picker
		    type="date"
		  	:border="false"
		  	:clear-icon="false"
		  	:placeholder="'请选择有效期起'"
		    v-model="params.validFrom"
		    @change="changeValidFromDate"
		  	style="text-align: right;color:#333;"
		  />
		</view>
		<view class='nameView newTimePicker'>
		  <text>有效期止<text class="red">*</text></text>
		 <!-- <picker mode="date" :value="params.validTo" :start="startDate" :end="endDate" @change="bindDateChange2">
			  <view v-if="params.validTo">{{params.validTo}}</view>
			  <view class="noMsgHint" v-else>请选择有效期止</view>
		  </picker> -->
		  <uni-datetime-picker
		    type="date"
		  	:border="false"
		  	:clear-icon="false"
		  	:placeholder="'请选择有效期止'"
		    v-model="params.validTo"
		    @change="changeValidToDate"
		  	style="text-align: right;color:#333;"
		  />
		</view>
	</view>
	<view class="tips" @click="switchCollapse" v-if="!isCollapse">
		<text>若需承接网络货运货源，请完善以下信息</text>
		<image src="/static/images/down_spand.png" class="down-icon"></image>
	</view>
	<view class="tips-up" @click="switchCollapse" v-else>
		<text>若需承接网络货运货源，请完善以下信息</text>
		<image src="/static/images/up-icon.png" class="down-icon"></image>
	</view>
	<view class='cardView1' v-if="isCollapse">
		<view v-if="isEdit">
			
			<view class='imageView'>
				<image class='card' style='border: 1rpx dashed #999999;' :src="qualificationsUrl1" @click='faceSelect(6)' ></image>
				<!-- 去掉司机签名 -->
				<!-- <image class='card' style='border: 1rpx dashed #999999;' :src="signatureImage1" @click='faceSelect(5)' ></image> -->
				
			 
			</view>
		</view>
				
		<!-- 	<view class='imageView' v-else>
					<image class='card' style='border: 1rpx dashed #999999;' :src="driverFrontImage" @click='prevImage(driverFrontImage)' ></image>
					<image class='card' style='border: 1rpx dashed #999999;' :src="driverBackImage" @click='prevImage(driverBackImage)'></image>
			</view> -->
		<view v-else>
		
			<view class='imageView'>
				<!-- <view class="cardBox" @click='prevImage(qualificationsUrl1)'>
					<image class='newCard' :src="signatureImage1"></image>
				</view> -->
				<view class="cardBox" @click='prevImage(qualificationsUrl1)'>
					<image class='newCard' :src="qualificationsUrl1"></image>
				</view>
				
			</view>
		</view>
	</view>
	<view class="infoView" v-if="isCollapse">
	   
		<view class='nameView'>
		  <text>驾驶员从业资格证号</text>
		  <input class="viewInput" placeholder='请输入驾驶员从业资格证号' placeholder-style="color:#999" :disabled="!isEdit" v-model="params.qualificationCertificate"></input>
		</view>
		<view class='nameView newTimePicker'>
		  <text>从业资格证有效期起</text>
		  <!-- <picker mode="date" :value="params.qcValidFrom" :start="startDate" :end="endDate" @change="bindDateChange3">
			  <view v-if="params.qcValidFrom">{{params.qcValidFrom}}</view>
			  <view class="noMsgHint" v-else>请选择从业资格证有效期起</view>
		  </picker> -->
		  <uni-datetime-picker
		    type="date"
		  	:border="false"
		  	:clear-icon="false"
		  	:placeholder="'请选择从业资格证有效期起'"
		    v-model="params.qcValidFrom"
		    @change="changeQcValidFromDate"
		  	style="text-align: right;color:#333;"
		  />
		</view>
		<view class='nameView newTimePicker'>
		  <text>从业资格证有效期止</text>
		  <!-- <picker mode="date" :value="params.qcValidTo" :start="startDate" :end="endDate" @change="bindDateChange4">
			  <view v-if="params.qcValidTo">{{params.qcValidTo}}</view>
			  <view class="noMsgHint" v-else>请选择从业资格证有效期止</view>
		  </picker> -->
		  <uni-datetime-picker
		    type="date"
		  	:border="false"
		  	:clear-icon="false"
		  	:placeholder="'请选择从业资格证有效期止'"
		    v-model="params.qcValidTo"
		    @change="changeQcValidToDate"
		  	style="text-align: right;color:#333;"
		  />
		</view>
		<view class="sendBottom" />
		
	  </view>
	  <view class='SaveView' v-if="isEdit">
	    <button class="SaveView_button" @click='saveInfoSelect'>{{saveBtnTitle}}</button>
	  </view>
	</view>
</template>

<script>
	import {upLoadFile, postRequest} from "../../../utils/service.js";
	import * as ship from "@/utils/ship";
	var commonHtmlTitle = '驾驶证认证';
	export default {
		data() {
			return {
				isEdit: true,
				driverFrontImage: "https://cargocn.oss-cn-beijing.aliyuncs.com/20200904165121.png",
				driverBackImage: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/driverBackImage.png",
				signatureImage1: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/signatureImage.png",
				qualificationsUrl1: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/qualificationsUrl.png',
				params: {
					userCode: "",
					licenseId: '',
					permitType: '',
					licenseDate: '',
					licenseMainImg: '',
					licenseSubImg: '',
					qualificationsUrl: '',
					qualificationCertificate: '',
					commonHtmlTitle: commonHtmlTitle,
				},
				saveBtnTitle: '确认',
				driverVerifyInfo: "",
				isCollapse: false,
			}
		},
		onLoad() {
			this.getUserInfo(); //获取用户信息,判断是否已认证
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
		},
		methods: {
			changeLicenseDate(e) {
			    this.params.licenseDate = e;
			    console.log("选择的领证时间:", e);
			},
			changeValidFromDate(e) {
				this.params.validFrom = e;
				console.log("选择的有效期:", e);
			},
			changeValidToDate(e) {
				this.params.validTo = e;
				console.log("选择的有效期:", e);
			},
			changeQcValidFromDate(e) {
				this.params.qcValidFrom = e;
				console.log("请选择从业资格证有效期起:", e);
			},
			changeQcValidToDate(e) {
				this.params.qcValidTo = e;
				console.log("请选择从业资格证有效期止:", e);
			},
			showMsg() {
				var params = this.params;
				var driverVerifyInfo = this.driverVerifyInfo;
				if (params.id) {
					if (params.dlStatus == 1 && params.qcStatus == 1 && !driverVerifyInfo) {
						return ""
					} else {
						var str = "提醒：", arr = [];
						if (params.dlStatus == 0) {
							arr.push("您的驾驶证已到期")
						}
						if (params.qcStatus == 0) {
							arr.push("您的从业资格证已到期")
						}
						if (driverVerifyInfo) {
							arr.push(driverVerifyInfo);
						}
						var ms = arr.join(",");
						return str + ms
					}
				}
			},
			prevImage(path) {
				var imgs = [];
				imgs.push(path);
				uni.previewImage({
					current:0, //预览图片的下标
					urls: imgs//预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			bindDateChange: function(e) {
				this.params.licenseDate = e.target.value
				this.$forceUpdate();
			},
			bindDateChange1: function(e) {
				this.params.validFrom = e.target.value
				this.$forceUpdate();
			},
			bindDateChange2: function(e) {
				this.params.validTo = e.target.value
				this.$forceUpdate();
			},
			bindDateChange3: function(e) {
				this.params.qcValidFrom = e.target.value
				this.$forceUpdate();
			},
			bindDateChange4: function(e) {
				this.params.qcValidTo = e.target.value
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
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
		   faceSelect(flag) {
				var that = this;
				if (!that.isEdit) {
					return;
				}

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
						console.log(res, '驾驶证')
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
						var tempFilePaths = res.tempFilePaths
						if (flag == 3) {
							that.shipOcrUpfile(tempFilePaths[0])
						} else {
							that.uploadIdcard(tempFilePaths[0], flag);
						}
						
					},
					fail: function(err) {
						console.log(err, 'asd')
					}
				})
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
						this.driverFrontImage = body.image;
						
						this.params.licenseId = body.idNo;
						this.params.permitType = body.permitType;
						this.params.issuingOrganizations = body.issuingOrganizations;
						this.params.userName = body.name;
						var licenseDate = body.issueDate;
						var validFrom = body.validFrom;
						var validTo = body.validTo;
						var isRecognize = this.hanleCheckDate(licenseDate);
						if (isRecognize) {
							this.params.licenseDate = licenseDate
						} else {
							this.params.licenseDate = ""
						}
						var isRecognize1 = this.hanleCheckDate(validFrom);
						if (isRecognize1) {
							this.params.validFrom = body.validFrom;
						} else {
							this.params.validFrom = "";
						}
						var isRecognize2 = this.hanleCheckDate(validTo);
						if (isRecognize2) {
							this.params.validTo = body.validTo;
						} else {
							this.params.validTo = "";
						}
						this.params.licenseMainImg = body.image;
						
						
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
			uploadIdcard: function(image, flag) {
				var that = this;
				var params = new Object();
				var url = ""; 
				if (flag == 1) {
					url = "/file/ocr/idCard";  //身份证
					params = {
						side: 'front'
					}
				} else if (flag == 2) {
					url = "/file/ocr/idCard"; //反面
					params = {
						side: 'back'
					}
				} else if (flag == 3) {
					url = "/baidu/ocr/v1/driver/front"; //驾驶证
				} else if (flag >3) {
					var url = '/file/upload'; 
				}
				uni.showLoading({
					title: '请稍候...',
				})
				upLoadFile(url, image, params)
				.then(res => {
					uni.hideLoading();
					console.log('驾驶证识别信息', res)
					if (res.retCode == "0000000") {
						var body = res.rspBody;
						if (flag == 1) {
							//身份证正面
							this.username = body.name || '';
							this.idcardnum = body.id || '';
							this.address = body.addr || '';
							this.date = body.birthday;
							this.faceImage = this.faceImageUrl = body.url || "";
						} else if (flag == 2) {
							//身份证副页
							this.backImage = this.backImageUrl = body.url || "";
							
						} else if (flag == 3) {
							//驾驶证主页
							this.driverFrontImage = body.url;
							
							this.params.licenseId = body.words_result.idNo;
							this.params.permitType = body.words_result.permitType;
							this.params.licenseDate = body.words_result.issueDate;
							this.params.validFrom = body.words_result.validFrom;
							this.params.validTo = body.words_result.validTo;
							this.params.address = body.words_result.address;
							var licenseDate = body.words_result.issueDate;
							// if (licenseDate.length < 8) {
							// 	this.params.licenseDate = ""
							// } else {
							// 	this.params.licenseDate = licenseDate.slice(0, 4) + "-" + licenseDate.slice(4, 6) + '-' + licenseDate.slice(6);
							// }
							this.params.licenseMainImg = body.url;
							
						} else if (flag == 4) {
							this.params.licenseSubImg =  body.url
							this.driverBackImage = body.url
						} else if (flag == 6) {
							this.params.qualificationsUrl = body.url;
							this.qualificationsUrl1 = body.url;
						} else if (flag == 5) {
							this.params.signImg = body.url;
							this.signatureImage1 = body.url;
						}
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
			goHZ() {
				uni.navigateTo({
					url:"../mutualAssistance/index"
				})
			},
			saveInfoSelect() {
				var that = this;
			
				if (!that.params.licenseMainImg) {
					uni.showToast({
						title: '驾驶证正面为空',
						icon: 'none'
					})
					return;
				}
				if (!that.params.licenseSubImg) {
					uni.showToast({
						title: '驾驶证副页为空',
						icon: 'none'
					})
					return;
				}
				if (!that.params.licenseId) {
					uni.showToast({
						title: '驾驶证号为空',
						icon: 'none'
					})
					return;
				}
				if (!that.params.userName) {
					uni.showToast({
						title: '姓名为空',
						icon: 'none'
					})
					return;
				}
				
				if (this.isCollapse) {
					if (!that.params.permitType) {
						uni.showToast({
							title: '准驾车型为空',
							icon: 'none'
						})
						return;
					}
					if (!that.params.licenseDate) {
						uni.showToast({
							title: '领证时间为空',
							icon: 'none'
						})
						return;
					}
					
					if (!that.params.issuingOrganizations) {
						uni.showToast({
							title: '发证机关为空',
							icon: 'none'
						})
						return;
					}
					if (!that.params.validFrom) {
						uni.showToast({
							title: '有效期起为空',
							icon: 'none'
						})
						return;
					}
					if (!that.params.validTo) {
						uni.showToast({
							title: '有效期止为空',
							icon: 'none'
						})
						return;
					}
				}
				
				
	
				uni.showLoading();
				console.log('驾驶证认证信息', that.params);
				ship.postRequest("/yh/driver/driving/licence/upload", that.params).then(function(res) {
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
									url: '../carVerify/index'
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
			getUserInfo(){
				var userInfo = uni.getStorageSync('userInfo');
				console.log('个人信息缓存', userInfo)
				if (!userInfo) {
					return
				}
				this.params.userCode = JSON.parse(userInfo).attrs.userCode;
				var personId = JSON.parse(userInfo).attrs.personId;
				var data = {
					personId: personId,
					commonHtmlTitle: commonHtmlTitle,
				}
				ship.postRequest("/yh/driver/get/detail").then(res=>{
					console.log('驾驶证信息', res)
					if(res.retCode == '0000000'){
						if (res.rspBody) {
							this.params = res.rspBody;
							if (res.rspBody.licenseMainImg) {
								this.driverFrontImage = res.rspBody.licenseMainImg;
							}
							if (res.rspBody.licenseSubImg) {
								this.driverBackImage = res.rspBody.licenseSubImg;
							}
							if (res.rspBody.qualificationsUrl) {
								this.qualificationsUrl1 = res.rspBody.qualificationsUrl;
							}
							if (res.rspBody.signImg) {
								this.signatureImage1 = res.rspBody.signImg;
							}
							//认证状态
							var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
							userInfo.attrs.driverVerify = res.rspBody.driverVerify;
							uni.setStorageSync("userInfo", JSON.stringify(userInfo));
							if (res.rspBody.driverVerify != 1) {
								this.driverVerifyInfo = res.rspBody.driverVerifyInfo
							} else {
								this.driverVerifyInfo = ""
							}
							
							this.$forceUpdate();
						} else {
							//未认证，可以修改
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
			},
			switchCollapse() {
				this.isCollapse = !this.isCollapse
			}
			
		}
	}
</script>

<style lang="scss">
	.driverVerifyMainPage {
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
		
		.backgroundView {
			overflow-x: hidden;
			padding-bottom: 0;  
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			
		}
		.sendBottom {
			height: 94rpx;
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
		    padding:0 20rpx;
		    background: white;
		    display: flex;
		    flex-direction: column;
		    justify-content: flex-start;
			.subTitle {
				display: flex;
				flex-direction: row;
				align-items: center;
				.verify {
					width: 28rpx;
					height: 28rpx;
				}
				.normal {
					font-size: 26rpx;
					color: #777777;
					margin-left: 20rpx;
				}
				.active {
					color: #0171F9;
				}
			}
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
				font-size: 32rpx !important;
			}
			.input-placeholder {
				font-size: 32rpx !important;
				color: #777 !important;
			}
			.uni-input-input {
				font-size: 32rpx !important;
				color:#000 !important;
			}
		}
		.nameView {
		    background: white;
		    display: flex;
		    flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx;
			height: 80rpx;
		}
		.noMsgHint {
			color: #999;
			font-size: 28rpx;
		}
		.nameView .viewInput {
		    font-size: 28rpx;
			flex: 1;
			text-align: right;
		}
		
		.bankAddBtn {
		    margin-top: 4vh;
		    background: white;
		    display: flex;
		    flex-direction: row;
		    justify-content: center;
		    font-size: 32rpx;
		    color: #469DFC;
		    height: 10vh;
		}
		
		.bankAddBtn image {
		    /* margin-top: 34rpx; */
		    width: 68rpx;
		    height: 10vh;
		}
		
		.bankAddBtn text {
		    height: 10vh;
		    display: flex;
		    flex-direction: column;
		    justify-content: center;
		}
		
		.bankItemView {
		    height: 140rpx;
		    border-top-left-radius: 15rpx;
		    border-top-right-radius: 15rpx;
		    box-shadow: 0 6rpx 10rpx 2rpx #E9ECF2;
		    /*for Android*/
		    -webkit-box-shadow: 0px 3px 5px 1px #E9ECF2;
		    /*for IOS*/
		    display: flex;
		    flex-direction: row;
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
		    width: 100%;
		    height: 200rpx;
		    /* background: red; */
		    display: flex;
		    flex-direction: row;
		    justify-content: flex-start;
		}
		
		.card {
		    width: 50%;
		    height: 200rpx;
		    /* background: blue;  */
		    margin-right: 40rpx;
		}
		.cardBox {
			height: 200rpx;
			width: 50%;
			border: 1rpx dashed #999999;
			display: flex;
			justify-content: center;
			align-items: center;
		    margin-right: 40rpx;
		}
		.newCard {
		    height: 200rpx;
			width: 100%;
		}
		.checkView {
		    margin: 20rpx 20rpx 0rpx 20rpx;
		    font-size: 24rpx;
		    display: flex;
		    flex-direction: row;
		}
		
		.checkView checkBox {
		    width: 24rpx;
		    height: 24rpx;
		    zoom: 60%;
		}
		
		.checkView rich-text {
		    margin-left: 20rpx;
		    height: 30rpx;
		}
		
		.SaveView {
		    width: 100%;
		    height: 94rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			background-color: #FFFFFF;
		}
		
		.SaveView_button {
		    width: 80%;
		    color: white;
		    display: flex;
		    flex-direction: column;
		    justify-content: center;
		    font-size: 36rpx;
		    border-radius: 47rpx;
			background-color: #469DFC;
		}
		
		.show {
		    display: block;
		}
		.red {
			color: red;
		}
		.error {
			padding: 10rpx 16rpx;
			color: red;
			background-color: #CCCCCC;
			margin-bottom: 20rpx;
		}
		.tips {
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
