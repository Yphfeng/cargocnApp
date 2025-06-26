<template>
	<view style="padding-bottom: 150rpx;">
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>服务站名称</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="text" :value="providerName" @input="inputName" placeholder="请输入" />
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">地理位置</view>
			</view>
			<view :class="['input-box', !address?'placeholder-class':'']" @click="chooseLocation">{{address?address:'请选择地址或点击定位'}}</view>
			<view class="address" @click="getLocation(1)">
				<image mode="widthFix" class="screen-img"
					src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/address.png"></image>
				<view class="">定位</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">所属类别</view>
			</view>
			<view class="lable-box">
				<view :class="[labelId==item.id?'lable-select-child':'lable-child']" v-for="(item, index) in labelArr" @click="labelEvent(item)">{{item.typeName}}</view>
			</view>
		</view>
		<view class="content-box" v-if="labelChild.length>0">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">所属标签</view>
			</view>
			<view class="lable-box">
				<view :class="[item.isSelect==true?'lable-select-child':'lable-child']" v-for="(item, index) in labelChild" @click="labelSelectEvent(index)">{{item.labelName}}</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">服务站门照</view>
			</view>
			<view class="photos">
				<view class="select-img">
					<view :class="['selected-box', index%2==0?'selected-box1':'']" v-for="(item, index) in imagesArr">
						<image class="selected-img" :src="item.url" @click="previewImage(item.url)" mode="aspectFill"></image>
						<!-- <image class="select-cancel" @click="cancelEvent(index, 1)" src="/static/images/cancel.png"></image> -->
						<view class="select-cancel" @click="cancelEvent(index, 1)">
							<image src="/static/images/newCancel.png"></image>
						</view>
					</view>
					<view v-if="imagesArr.length<4" class="photo-box" @click="chooseImage(1)">
						<image class="photo-img" src="/static/images/photo.png"></image>
					</view>
				</view>
				<view class="remind">你反馈的信息非常重要，请现场拍摄门脸或建筑物外观照片，最多可添加四张</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">营业执照</view>
			</view>
			<view class="photos">
				<view class="select-img">
					<view class="selected-box" v-if="businessLicense">
						<image class="selected-img" :src="businessLicense" @click="previewImage(businessLicense)" mode="aspectFill"></image>
						<!-- <image class="select-cancel" @click="cancelEvent(2, 2)" src="/static/images/cancel.png"></image> -->
						<view class="select-cancel" @click="cancelEvent(2, 2)">
							<image src="/static/images/newCancel.png"></image>
						</view>
					</view>
					<view v-if="!businessLicense" class="photo-box" @click="chooseImage(2)">
						<image class="photo-img" src="/static/images/photo.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>营业时间</view>
			</view>
			<view class="input-box1">
				<view class="start-time" :style="selectTime ? 'color:#333' : 'color:#909399'" @click="startEvent">{{selectTime?selectTime:'开始时间'}}</view>
				<view class="">-</view>
				<view class="end-time" :style="selectTime1 ? 'color:#333' : 'color:#909399'" @click="endEvent">{{selectTime1?selectTime1:'结束时间'}}</view>
			</view>
			<!-- <input class="input-box" type="text" :value="concatName" @input="inputContact" placeholder="请输入" /> -->
		</view>
		<view class="content-box align-box" v-if="businessLicense">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>企业名称</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="text" :value="compName" @input="inputCompBankName" placeholder="请输入" />
		</view>
		<view class="content-box align-box" v-if="businessLicense">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>法定代表人</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="text" :value="legalRepresentative" @input="inputCompBankName" placeholder="请输入" />
		</view>
		<view class="content-box align-box" v-if="businessLicense">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>统一信用代码</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="text" :value="taxNo" @input="inputCompBankName" placeholder="请输入" />
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>开户银行</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="text" :value="compBankName" @input="inputCompBankName" placeholder="请输入" />
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>银行账号</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="number" :value="compBankAccount" @input="inputCompBankAccount" placeholder="请输入" />
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>服务站联系人</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="text" :value="concatName" @input="inputContact" placeholder="请输入" />
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>服务站电话</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="number" :value="concatPhone" @input="inputConcatPhone"
				placeholder="用户需要时可联系" />
		</view>
		<view class="content-box">
			<view class="content-name">
				<view>服务站描述</view>
			</view>
		</view>
		<view class="content-box" style="border-bottom: 1rpx solid #fff;">
			<textarea class="describe" placeholder-class="placeholder-class" :value="providerDescription" @input="inputDescription" placeholder="请输入" />
		</view>
		<view class="btn-box">
			<view class="btn" @click="reverseGeocoder">提交</view>
		</view>
		<view class="picker-box" v-if="show">
			<view class="picker-btn-box">
				<view class="picker-btn">
					<view class="picker-text" @click="cancelTap">取消</view>
				</view>
				<view class="picker-btn1">
					<view class="picker-text1" @click="okTap">确定</view>
				</view>
			</view>
			<picker-view indicator-class="indicator" :value="value" @change="bindChange" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in hours" :key="index">{{item}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in minutes" :key="index">{{item}}分</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js"
	var QQMapWX = require("../../../utils/qqmap-wx-jssdk.min.js");
	var tentCentMapKey = "EXDBZ-LL436-BRDSW-EUJA2-XD46Z-4EF54";
	var qqmapsdk = new QQMapWX({
	  key: tentCentMapKey
	});
	var commonHtmlTitle = '服务站认证';
	export default {
		data() {
			return {
				providerName: '',
				address: '',
				concatName: '',
				concatPhone: '',
				providerDescription: '',
				imagesArr: [],
				longitude: 0,
				latitude: 0,
				labelArr: [],
				labelChild: [],
				labelId: '',
				labelChildId: 0,
				hours: [],
				minutes: [],
				value: [0, 0],
				show: false,
				selectTime: '',
				selectTime1: '',
				timeType: 1,
				businessLicense: '',
				compBankName: '',
				compBankAccount: '',
				codeObj: '',
				regionData: [],
				adcode: '',
				labelVOS: [], //服务端返回所属标签
				taxNo: '',
				compName: '',
				legalRepresentative: '',
			}
		},
		onLoad(options){
			console.log(options.id,'122')
			this.serviceId = options.id;
			if(this.serviceId){
				this.serviceDetail();
			}
			// this.getLocation(0);
			this.hoursEvent();
			this.minutesEvent();
			this.getList();
			let that = this;
			uni.getStorage({ // 检查地区数据，服务站、路况、互助上报时均需匹配地区code
			    key: 'regionData',
			    success: function (rRes) {
			        console.log('本地地区数据无误！');
					that.regionData = rRes.data;
			    },
				fail: function (rErr) {
					console.log('本地缓存无地区数据！', rErr);
					that.getRegionInfo();
				}
			});
		},
		methods: {
			serviceDetail(){
				let that = this;
				utils.postRequest('/mu/provider/detail', {
					commonHtmlTitle: commonHtmlTitle,
					id: that.serviceId
				})
				.then(res=>{
					if(res.retCode == '0000000'){
						that.providerName = res.rspBody.providerName;
						that.address = res.rspBody.address;
						that.labelId = res.rspBody.typeId;
						that.labelVOS = res.rspBody.labelVOS;
						that.compBankName = res.rspBody.compBankName?res.rspBody.compBankName:'';
						that.compBankAccount = res.rspBody.compBankAccount?res.rspBody.compBankAccount:'';
						that.concatName = res.rspBody.concatName?res.rspBody.concatName:'';
						that.concatPhone = res.rspBody.concatPhone? res.rspBody.concatPhone:'';
						that.providerDescription = res.rspBody.providerDescription?res.rspBody.providerDescription:'';
						that.compName = res.rspBody.compName?res.rspBody.compName:'';
						that.taxNo = res.rspBody.taxNo?res.rspBody.taxNo:'';
						that.legalRepresentative = res.rspBody.legalRepresentative?res.rspBody.legalRepresentative:'';
						if(res.rspBody.businessHours){
							var businessHours  = res.rspBody.businessHours.split('-');
							that.selectTime = businessHours[0];
							that.selectTime1 = businessHours[1];
						}
						that.businessLicense = res.rspBody.businessLicense;
						if(res.rspBody.facadeImgs && res.rspBody.facadeImgs.indexOf(',') > -1){
							var facadeImgs = res.rspBody.facadeImgs.split(',');
							facadeImgs.map(val=>{
								facadeImgs.push({url: val})
							})
							that.imagesArr = facadeImgs;
						} else if(res.rspBody.facadeImgs && res.rspBody.facadeImgs.indexOf(',') == -1){
							that.imagesArr.push({url: res.rspBody.facadeImgs})
						} 
						that.selectByProviderId(that.labelId);
					}
					console.log('res========>', res)
				})
				.catch(err=>{
					console.log(err)
				})
			},
			chooseLocation(){
				var that = this;
				uni.chooseLocation({
				    success: function (res) {
				        console.log('位置名称：' + res.name);
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.address = res.address;
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
						that.getAddressDetails();
				    }
				});
			},
			getAddressDetails() {
				console.log('执行定位解析');
				let that = this;
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780' + '&location=' + that.longitude + ',' + that.latitude;
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo?' + parameters, //仅为示例，并非真实接口地址。
					method: 'GET',
					data: {},
					header: {},
					success: (aRes) => {
						console.log('成功', aRes);
						that.adcode = aRes.data.regeocode.addressComponent.adcode;
						that.getCodeObj(that.adcode);
					},
					fail: (err) => {
						console.log('失败', err);
					},
				});
			},
			getRegionInfo() {
				let that = this;
				utils.postRequest('/au/nationDict/getBasicData', {commonHtmlTitle: commonHtmlTitle})
				.then(res=>{
					if(res.retCode == "0000000"){
						console.log('省市区code获取成功');
						that.regionData = res.rspBody;
						uni.setStorage({
							key: 'regionData',
							data: res.rspBody,
							success: function (saveRes) {
								console.log('地区数据缓存成功！', saveRes);
							},
							fail: function (saveErr) {
								console.log('地区数据缓存失败！', saveErr);
							}
						});
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			getCodeObj(areaCode) {
				console.log('开始匹配省市区code');
				let region = this.regionData;
				for(let a in region) {
					for(let b in region[a].cities) {
						for(let c in region[a].cities[b].areas) {
							if(region[a].cities[b].areas[c].code == areaCode) {
								this.codeObj = region[a].code + ',' + region[a].cities[b].code + ',' + region[a].cities[b].areas[c].code
								console.log('匹配的code', this.codeObj);
								break;
							}
						}
					}
				}
			},
			previewImage(image){
				console.log(image);
				uni.previewImage({
					urls: [image],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			startEvent(){
				this.show = true;
				this.timeType = 1;
			},
			endEvent(){
				this.show = true;
				this.timeType = 2;
			},
			cancelTap(){
				this.show = false;
			},
			okTap(){
				this.cancelTap();
				var num = 0;
				var num1 = 0;
				if(this.value[0]<10){
					num = 0 + '' + this.value[0]
				} else{
					num = this.value[0];
				}
				if(this.value[1]<10){
					num1 = 0 + '' + this.value[1]
				} else{
					num1 = this.value[1];
				}
				if(this.timeType==1){
					this.selectTime = num + ':' + num1
				} else{
					this.selectTime1 = num + ':' + num1
				}
			},
			hoursEvent(){
				var hours = [];
				for(var i=0; i<24; i++){
					hours.push(i)
				}
				this.hours = hours;
			},
			minutesEvent(){
				var minutes = [];
				for(var i=0; i<60; i++){
					minutes.push(i)
				}
				this.minutes = minutes;
			},
			bindChange(e){
				console.log(e);
				this.value = e.detail.value;
			},
			inputName(e) {
				this.providerName = e.detail.value;
			},
			inputAddress(e) {
				this.address = e.detail.value;
			},
			inputContact(e) {
				this.concatName = e.detail.value;
			},
			inputConcatPhone(e) {
				this.concatPhone = e.detail.value;
			},
			inputDescription(e) {
				this.providerDescription = e.detail.value;
			},
			inputCompBankName(e){
				this.compBankName = e.detail.value;
			},
			inputCompBankAccount(e){
				this.compBankAccount = e.detail.value;
			},
			getList(){
				var that = this;
				utils.postRequest('/mu/providerType/list', {commonHtmlTitle: commonHtmlTitle}).then(res=>{
					var newItems = res.rspBody;
					that.labelArr = newItems;
					if(!that.serviceId){
						that.selectByProviderId(res.rspBody[0].id)
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			selectByProviderId(id){
				utils.postRequest('/mu/providerLabel/selectByTypeId', {typeId: id, commonHtmlTitle: commonHtmlTitle}).then(res=>{
					this.labelChild = res.rspBody;
					console.log(res.rspBody);
					if(this.serviceId){
						var labelChild = [];
						res.rspBody.map(val=>{
							this.labelVOS.map(data=>{
								if(val.id == data.id){
									val.isSelect = true;
								}
							})
							labelChild.push(val);
						})
						this.labelChild = labelChild;
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			labelEvent(item){
				if(!item.id){
					uni.showToast({
						title: '此类型正在维护',
						icon: 'none'
					})
				} else{	
					this.labelId = item.id;
					this.selectByProviderId(item.id);
				}
			},
			labelSelectEvent(index){
				var arr = this.labelChild;
				if(!arr[index].isSelect){
					arr[index].isSelect = true;
				} else{
					arr[index].isSelect = false;
				}
				this.labelChild = arr;
				this.$forceUpdate();
			},
			//定义方法
			reverseGeocoder(){
				var that = this;
				that.save();
				// qqmapsdk.geocoder({
				// 	// location: {
				// 	// 	latitude: that.latitude,
				// 	// 	longitude: that.longitude
				// 	// },
				// 	address: that.address,
				// 	success: function(res) {
				// 		console.log(res)
				// 		that.longitude = res.result.location.lng;
				// 		that.latitude = res.result.location.lat;
				// 		that.save();
				// 	},
				// 	fail: function(res) {
				// 		uni.showToast({
				// 			title: '定位失败',
				// 			icon: 'none'
				// 		});
				// 		console.log(res);
				// 	}
				// });
			},
			getLocation(type) {
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						console.log(res);
						// console.log('当前位置的经度：' + res.longitude);
						// console.log('当前位置的纬度：' + res.latitude);
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						if(type==1){
							that.address = res.address.province + res.address.city + res.address.district + res.address.poiName
						}
					},
					fail: function(err) {
						console.log(err)
					}
				});
			},
			chooseImage(type) {
				var that = this;
				uni.chooseImage({
					count: 1,
					// 默认9  
					sizeType: ['original', 'compressed'],
					// 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['camera', 'album'],
					// 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
						var tempFilePaths = res.tempFilePaths;
						// var obj = {url: tempFilePaths[0]}
						// that.imagesArr.push(obj);
						that.uploadImg(tempFilePaths[0], type);
					}
				});
			},
			cancelEvent(index, type){
				if(type == 1){
					this.imagesArr.splice(index, 1);
				} else{
					this.businessLicense = "";
				}
			},
			uploadImg(image, type) {
				uni.showLoading({
					title: '请稍候...'
				});
				var that = this;
				if (type == 2) {
					var url = '/file/ocr2/bizlicense'
				} else {
					var url = '/file/upload'
				}
				uni.uploadFile({
					url: utils.ApiRootUrl + url,
					filePath: image,
					name: 'file',
					formData: {
						userType: '84'
					},
					success: function(res) {
						uni.hideLoading();
						console.log(res, 'assaaaaa')
						var result = JSON.parse(res.data);
						console.log(result);
						if(result.retCode == '0000000'){
							if(type==1){
								var obj = {url: result.rspBody[0].url}
								that.imagesArr.push(obj);
							} else{
								if(result.rspBody.words_result.companyName == '无' || !result.rspBody.words_result.socialCreditCode){
									that.businessLicense = '';
									that.taxNo = '';
									that.compName = '';
									that.legalRepresentative = '';
									uni.showToast({
										title: '请确认营业执照是否有效',
										icon: 'none'
									});
									return
								}
								that.businessLicense = result.rspBody.url;
								that.taxNo = result.rspBody.words_result.socialCreditCode;
								that.compName = result.rspBody.words_result.companyName;
								that.legalRepresentative = result.rspBody.words_result.legalPerson;
							}
						} else{
							uni.showToast({
								title: result.retDesc,
								icon: 'none'
							});
						}
					},
					fail: function(res) {
						uni.showToast({
							title: '网络错误!',
							icon: 'none'
						});
						uni.hideLoading();
					},
				});
			},
			save() {
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, 'assa')
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						success: function(res) {
							if (res.confirm) {
								utils.loginSelf()
							}
						}
					})
					return;
				}
				var isDriveAC = JSON.parse(userInfo).attrs.driverVerify;
				
				var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
				if (!isDriveAC && !vehicleVerify) {
					uni.showModal({
						title: '请认证驾驶证或行驶证',
						content: '货运中国社区只允许真实卡友发布信息，您必须认证驾驶证或行驶证后，才能使用上报功能。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../../my/driverVerify/newDriverVerify'
								})
							}
						}
					})
					return false;
				}
				// if (!isDriveAC) {
				// 	uni.showModal({
				// 		title: '请认证驾驶证',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				uni.navigateTo({
				// 					url: '../../my/driverVerify/newDriverVerify'
				// 				})
				// 			}
				// 		}
				// 	})
				// 	return;
				// } 
				// if (!vehicleVerify) {
				// 	uni.showModal({
				// 		title: '请认证行驶证',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				uni.navigateTo({
				// 					url: '../../my/carVerify/newCarVerify'
				// 				})
				// 			}
				// 		}
				// 	})
				// 	return;
				// }
				if (!this.providerName) {
					uni.showToast({
						title: '请输入服务站名称',
						icon: 'none'
					})
					return
				}
				if (!this.address) {
					uni.showToast({
						title: '请输入服务站地址',
						icon: 'none'
					})
					return
				}
				if(!this.labelId){
					uni.showToast({
						title: '请选择所属类别',
						icon: 'none'
					})
					return
				}
				var isSelectId = 0;
				var labelVOS = [];
				this.labelChild.map(val=>{
					if(val.isSelect){
						isSelectId = 1;
						var obj = {
							id: val.id
						}
						labelVOS.push(obj)
					}
				})
				if(!isSelectId && this.labelChild.length > 0){
					uni.showToast({
						title: '请选择所属标签',
						icon: 'none'
					})
					return
				}
				if (this.imagesArr.length==0) {
					uni.showToast({
						title: '请拍摄服务站门照',
						icon: 'none'
					})
					return
				}
				if (!this.businessLicense) {
					uni.showToast({
						title: '请拍摄营业执照',
						icon: 'none'
					})
					return
				}
				if (!this.compName) {
					uni.showToast({
						title: '请输入企业名称',
						icon: 'none'
					})
					return
				}
				if (!this.legalRepresentative) {
					uni.showToast({
						title: '请输入法定代表人',
						icon: 'none'
					})
					return
				}
				if (!this.taxNo) {
					uni.showToast({
						title: '请输入统一信用代码',
						icon: 'none'
					})
					return
				}
				if(!this.selectTime || !this.selectTime1){
					uni.showToast({
						title: '请选择开始时间或结束时间',
						icon: 'none'
					})
					return
				}
				if(!this.compBankName){
					uni.showToast({
						title: '请填写开户银行',
						icon: 'none'
					})
					return
				}
				if(!this.compBankAccount){
					uni.showToast({
						title: '请填写银行账号',
						icon: 'none'
					})
					return
				}
				if(!this.concatName){
					uni.showToast({
						title: '请填写服务站联系人',
						icon: 'none'
					})
					return
				}
				console.log(this.concatPhone, '电话')
				if(!this.concatPhone){
					uni.showToast({
						title: '请填写服务站电话',
						icon: 'none'
					})
					return
				}
				var facadeImgs = "";
				this.imagesArr.map((val, index)=>{
					if(index==0){
						facadeImgs = val.url;
					} else {
						facadeImgs = facadeImgs + ',' + val.url;
					}
				})
				var businessHours = this.selectTime + '-' + this.selectTime1;
				let code = this.codeObj ? this.codeObj.split(',') : [];
				if(!this.codeObj) {
					var provinceCode = this.adcode.substring(0,2) + '0000';
					var cityCode = this.adcode.substring(0,4) + '00';
				}
				var data = {
					providerName: this.providerName,
					address: this.address,
					concatName: this.concatName,
					concatPhone: this.concatPhone,
					providerDescription: this.providerDescription,
					longitude: this.longitude,
					latitude: this.latitude,
					labelVOS: labelVOS,
					typeId: this.labelId,
					facadeImgs: facadeImgs,
					businessLicense: this.businessLicense,
					businessHours: businessHours,
					compBankName: this.compBankName,
					compBankAccount: this.compBankAccount,
					isVerify: 1,
					provinceCode: this.codeObj ? code[0] : provinceCode,
					cityCode: this.codeObj ? code[1] : cityCode,
					areaCode: this.codeObj ? code[2] : this.adcode,
					commonHtmlTitle: commonHtmlTitle,
					compName: this.compName,
					legalRepresentative: this.legalRepresentative,
					taxNo: this.taxNo,
				}
				if (this.serviceId) {
					data.id = this.serviceId
				}
				console.log(data);
				uni.showLoading({
					title: '请稍候...',
					mask: true,
				})
				utils.postRequest('/mu/provider/save', data)
					.then(function(res) {
						uni.hideLoading();
						console.log(res);
						if(res.retCode == "0000000"){
							uni.showToast({
								title: '提交成功',
								icon: 'none',
							})
							uni.$emit("refreshApi");
							setTimeout(()=>{
								uni.navigateBack({})
							}, 1500)
						} else{
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						console.log((err))
						uni.hideLoading();
					})
			},
		}
	}
</script>

<style>
	.content-box {
		display: flex;
		font-size: 28rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		color: #333;
		align-items: flex-start;
		border-bottom: 1rpx solid #f3f3f3;
	}
	.placeholder-class{
		color: #999;
	}

	.content-name {
		display: flex;
		align-items: center;
		width: 200rpx;
		font-weight: 500;
	}
	
	.align-box{
		align-items: center;
	}

	.mandatory {
		color: #FF021F;
	}

	.address {
		display: flex;
		align-items: center;
	}

	.screen-img {
		width: 20rpx;
		margin-right: 10rpx;
	}

	.input-box {
		width: 400rpx;
	}
	.input-box1 {
		width: 400rpx;
		height: 40rpx;
		line-height: 40rpx;
		color: #b9b9b9;
		font-size: 30rpx;
		display: flex;
		align-items: center;
	}
	.start-time{
		background-color: #f3f3f3;
		width: 200rpx;
		margin-right: 10rpx;
		border-radius: 10rpx;
		padding: 10rpx 0;
		text-align: center;
	}
	.end-time{
		background-color: #f3f3f3;
		width: 200rpx;
		margin-left: 10rpx;
		border-radius: 10rpx;
		padding: 10rpx 0;
		text-align: center;
	}

	.lable-box {
		display: flex;
		flex-wrap: wrap;
		width: 520rpx;
		font-size: 26rpx;
	}

	.lable-child {
		width: 121rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background-color: #E5E5E5;
		color: #3B3B3B;
		margin-right: 8rpx;
		margin-bottom: 15rpx;
		border-radius: 8rpx;
	}
	.lable-select-child{
		width: 121rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background-color: #D0E4FA;
		color: #3876EB;
		margin-right: 8rpx;
		margin-bottom: 15rpx;
		border-radius: 8rpx;
	}

	.photos {
		width: 490rpx;
	}
	.select-img{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.photo-box {
		width: 190rpx;
		height: 160rpx;
		background-color: #E5E5E5;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 10rpx;
	}
	.selected-box {
		width: 240rpx;
		height: 160rpx;
		background-color: #E5E5E5;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 10rpx;
		position: relative;
	}
	/* .select-cancel{
		position: absolute;
		top: -5rpx;
		right: -5rpx;
		width: 20rpx;
		height: 20rpx;
	} */
	.select-cancel{
		position: absolute;
		top: -5rpx;
		right: -5rpx;
		width: 20rpx;
		height: 20rpx;
		padding: 0 0 20rpx 20rpx;
	}	
	.select-cancel image {
		max-width: 100%;
		max-height: 100%;
	}
	.selected-box1{
		margin-right: 10rpx;
	}
	.selected-img{
		width: 240rpx;
		height: 160rpx;
		border-radius: 10rpx;
	}
	.photo-img {
		width: 190rpx;
		height: 160rpx;
		border-radius: 10rpx;
	}

	.remind {
		color: #FF021F;
		font-size: 24rpx;
		margin-top: 10rpx;
	}

	.describe {
		box-sizing: border-box;
		width: 100%;
		border: 1rpx solid #AAAAAA;
		;
		height: 160rpx;
		border-radius: 10rpx;
	}

	.btn-box {
		display: flex;
		font-size: 28rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		color: #333;
		align-items: flex-start;
		justify-content: center;
		position: fixed;
		bottom: 30rpx;
		left: 0;
		right: 0;
	}

	.btn {
		width: 612rpx;
		height: 64rpx;
		background-color: #FF8D02;
		border-radius: 32rpx;
		color: #fff;
		text-align: center;
		line-height: 64rpx;
	}
	.picker-btn-box{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 30rpx;
	}
	.picker-btn{
		flex: 1;
		display: flex;
		align-items: center;
	}
	.picker-btn1{
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.picker-text{
		border: 1rpx solid #999;
		width: 100rpx;
		border-radius: 10rpx;
		padding: 8rpx 0;
		text-align: center;
		color: #333;
		font-size: 25rpx;
	}
	.picker-text1{
		background-color: #3375F6;
		width: 100rpx;
		border-radius: 10rpx;
		padding: 8rpx 0;
		text-align: center;
		color: #fff;
		font-size: 25rpx;
	}
	.picker-box{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 99;
		border-top: 1rpx solid #999;
		padding-top: 20rpx;
	}
	.picker-view{
		width: 750rpx;
		height: 300rpx;
	}
	.item{
		height: 60rpx;
		line-height: 60rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.indicator{
		height: 60rpx;
	}
</style>
