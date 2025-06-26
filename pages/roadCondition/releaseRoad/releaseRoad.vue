<template>
	<view style="padding-bottom: 150rpx;">
		<!-- <view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>标题</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="text" :value="title" @input="inputTitle" placeholder="请输入" />
		</view> -->
		<view class="headBox">
			<!-- <i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777; font-size: 27px;"></i> -->
			<image class="uniIcon" @tap="backToFromPage()" src="../../../static/images/back.png"></image>
			{{pageName ? pageName : '发布路况'}}
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">地理位置</view>
			</view>
			<!-- <input class="input-box" type="text" :value="address" @input="inputAddress" placeholder="请输入" /> -->
			<view :class="['input-box', !address?'placeholder-class':'']" @click="chooseLocation">{{address?address:'请选择地址或点击定位'}}</view>
			<view class="address" @click="getLocation(1)">
				<image mode="widthFix" class="screen-img" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/address.png"></image>
				<view class="">定位</view> 
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">路况类型</view>
			</view>
			<view class="lable-box">
				<view :class="[classificationType==item.id?'lable-select-child':'lable-child']" v-for="(item, index) in newTypeListArr" @click="checkType(item)">{{item.typeName}}</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">路况状况</view>
			</view>
			<view class="lable-box">
				<view :class="[item.isSelect==true?'lable-select-child':'lable-child']" v-for="(item, index) in typeListArr" @click="labelEvent(index)">{{item.labelName}}</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">路况时效</view>
			</view>
			<!-- <view class="input-box1" @click="timeEvent">{{agingText?agingText:'请选择'}}</view> -->
			<view class="lable-box">
				<view :class="[deadType==item.id?'lable-select-child':'lable-child']" v-for="(item, index) in agingArr" @click="lagingEvent(item)">{{item.type==1?item.hour+'小时':'长期'}}</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="">路况照片</view>
			</view>
			<view class="photos">
				<view class="select-img">
					<view class="selected-box" v-if="facadeImage">
						<image class="selected-img" :src="facadeImage" @click="previewImage" mode="aspectFill"></image>
						<view class="select-cancel" @click="cancelEvent()">
							<image src="/static/images/newCancel.png"></image>
						</view>
					</view>
					<view v-if="!facadeImage" class="photo-box" @click="chooseImage()">
						<image class="photo-img" src="/static/images/photo.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>路况说明</view>
			</view>
		</view>
		<view class="content-box">
			<textarea class="describe" placeholder-class="placeholder-class" :value="description" @input="inputDescription" placeholder="请输入"/>
		</view>
		<view class="btn-box">
			<view class="btn" @click="reverseGeocoder">发布</view>
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
					<view class="item" v-for="(item,index) in agingArr" :key="index">{{item.type==1?item.hour+'小时':'长期'}}</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	import * as ship from "@/utils/ship"
	var QQMapWX = require("../../../utils/qqmap-wx-jssdk.min.js");
	var qqmapsdk = new QQMapWX({
	  key: utils.tentCentMapKey
	});
	var commonHtmlTitle = '发布路况'
	export default {
		data() {
			return {
				isClicking: false,
				pageName: '',
				title: '',
				address: '',
				longitude: 0,
				latitude: 0,
				typeListArr: [],
				show: false,
				agingArr: [],
				agingText: '',
				value: [0],
				facadeImage: '',
				description: '',
				situationType: 0,
				deadType: 0,
				newTypeListArr: [],
				classificationType: '',
				codeObj: '',
				regionData: [],
				adcode: ''
			}
		},
		async onLoad(options){
			var that = this;
			this.isClicking = false
			var newTypeListArr = [], typeListArr = [], id = "", labelVOS = [];
			var pageName = options.pageName;
			var detailsObj = options.detailsObj ? JSON.parse(options.detailsObj) : null;
			if (detailsObj) {
				this.pageName = pageName;
				this.detailsObj = detailsObj;
			}
			console.log(detailsObj, 'aa')
			
			
			var res = await utils.postRequest('/mu/situationType/list', {commonHtmlTitle: commonHtmlTitle});
			if(res.retCode == "0000000"){
				newTypeListArr = res.rspBody;
				
				if(newTypeListArr && newTypeListArr.length > 0) {
					
					if (detailsObj) {
						id = detailsObj.typeId;
						labelVOS = detailsObj.labelVOS;
					} else {
						id = newTypeListArr[0].id
					}
					
					var response = await utils.postRequest('/mu/situationLabel/selectByTypeId', { typeId: id, commonHtmlTitle: commonHtmlTitle });
					if(response.retCode == "0000000"){
						typeListArr = response.rspBody;
						console.log(typeListArr, 'type数组', labelVOS)
						
						if (labelVOS.length > 0) {
							labelVOS.forEach(item => {
								
								var findIndex = typeListArr.findIndex(atem => {
									return atem.id == item.id
								})
								if (findIndex > -1) {
									typeListArr[findIndex].isSelect = true
								}
							})
						}
					} 		
					
				}
				
				this.newTypeListArr = newTypeListArr;
				this.typeListArr = typeListArr;
				
				if (detailsObj) {
					//表示是编辑
					this.classificationType = detailsObj.typeId;
					this.deadType = detailsObj.deadId;
					this.facadeImage = detailsObj.facadeImage;
					this.description = detailsObj.description;
					this.address = detailsObj.address;
					this.latitude = detailsObj.latitude;
					this.longitude = detailsObj.longitude;
					this.codeObj = [detailsObj.provinceCode, detailsObj.cityCode, detailsObj.areaCode].join(',');
				}
			}
			this.agingEvent();
			
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
			previewImage(image){
				console.log(this.facadeImage);
				var that = this;
				uni.previewImage({
					urls: [that.facadeImage],
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
			chooseLocation(){
				var that = this;
				uni.chooseLocation({
				    success: function (res) {
						console.log('定位地址',res);
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.address = res.address;
						that.getAddressDetails();
						
						
				    }
				});
			},
			getAddressDetails() {
				console.log('执行定位解析');
				let that = this;
				let parameters = 'key=6ae872d0bc86389b263ecdf64521a42a' + '&location=' + that.longitude + ',' + that.latitude;
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
			inputTitle(e){
				this.title = e.detail.value;
			},
			inputAddress(e) {
				this.address = e.detail.value;
			},
			inputDescription(e){
				this.description = e.detail.value;
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
						that.getAddressDetails();
					},
					fail: function(err) {
						console.log(err)
					}
				});
			},
			getNewTypeList() {
				var that = this;
				utils.postRequest('/mu/situationType/list', {commonHtmlTitle: commonHtmlTitle})
				.then(res=>{
					if(res.retCode == "0000000"){
						that.newTypeListArr = res.rspBody;
						console.log('新路况类型',that.newTypeListArr)
						if(that.newTypeListArr && that.newTypeListArr.length > 0) {
							for(let i in that.newTypeListArr) {
								that.classificationType = that.newTypeListArr[0].id;
								that.getTypeList(that.classificationType);
								break;
							}
						}
					} else{
						
					}
				})
				.catch(err=>{
					console.log('新路况标签',err);
				})
			},
			checkType(item) {
				let that = this;
				that.classificationType = item.id;
				that.getTypeList(that.classificationType);
			},
			getTypeList(id){
				var that = this;
				utils.postRequest('/mu/situationLabel/selectByTypeId', { typeId: id, commonHtmlTitle: commonHtmlTitle })
				.then(res=>{
					console.log('新路况标签',res)
					if(res.retCode == "0000000"){
						that.typeListArr = res.rspBody;
					} else{
						
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			agingEvent(){
				var that = this;
				utils.postRequest('/mu/situation/dead-type/list', {commonHtmlTitle: commonHtmlTitle})
				.then(res=>{
					if(res.retCode == "0000000"){
						that.agingArr = res.rspBody;
						console.log(res.rspBody)
					} else{
						
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			cancelTap(){
				this.show = false;
			},
			okTap(){
				this.cancelTap();
				console.log(this.value)
				this.agingText = this.agingArr[this.value[0]].type==1?this.agingArr[this.value[0]].hour+'小时':'长期';
			},
			timeEvent(){
				this.show = true;
			},
			bindChange(e){
				this.value = e.detail.value;
			},
			labelEvent(index){
				var arr = this.typeListArr;
				if(!arr[index].isSelect){
					arr[index].isSelect = true;
				} else{
					arr[index].isSelect = false;
				}
				this.typeListArr = arr;
				this.$forceUpdate();
			},
			lagingEvent(item){
				this.deadType = item.id
			},
			chooseImage() {
				var that = this;
				uni.chooseImage({
					count: 1,
					// 默认9  
					sizeType: ['compressed'],
					// 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['camera', 'album'],
					// 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
						var tempFilePaths = res.tempFilePaths;
						// var obj = {url: tempFilePaths[0]}
						// that.imagesArr.push(obj);
						that.uploadImg(tempFilePaths[0]);
					}
				});
			},
			cancelEvent(){
				this.facadeImage = "";
			},
			uploadImg(image) {
				uni.showLoading({
					title: '请稍候...'
				});
				var that = this;
				uni.uploadFile({
					url: utils.ApiRootUrl + '/file/upload',
					filePath: image,
					name: 'file',
					formData: {
						userType: '84'
					},
					success: function(res) {
						uni.hideLoading();
						console.log(res)
						var result = JSON.parse(res.data);
						if(result.retCode == '0000000'){
							console.log(result.rspBody.url);
							that.facadeImage = result.rspBody[0].url;
						} else{
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						console.log(err)
						uni.showToast({
							title: '网络错误!',
							icon: 'none'
						});
						uni.hideLoading();
					},
				});
			},
			//定义方法
			reverseGeocoder(){
				var that = this;
				if(!that.address){
					uni.showToast({
						title: '请获取地理位置',
						icon: 'none'
					})
					return;
				}
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
			save(){
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
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../../my/driverVerify/newDriverVerify'
								})
							}
						}
					})
					return;
				} 
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
				// if(!this.title){
				// 	uni.showToast({
				// 		title: '请输入标题',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				if(!this.address){
					uni.showToast({
						title: '请输入地址',
						icon: 'none'
					});
					return;
				}
				var isSelectId = 0;
				var labelVOS = [];
				this.typeListArr.map(val=>{
					if(val.isSelect){
						isSelectId = 1;
						var obj = {
							id: val.id
						}
						labelVOS.push(obj)
					}
				})
				if(!isSelectId && this.typeListArr.length > 0){
					uni.showToast({
						title: '请选择路况状态',
						icon: 'none'
					})
					return
				}
				// if(!this.situationType){
				// 	uni.showToast({
				// 		title: '请选择路况状态',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				if(!this.deadType){
					uni.showToast({
						title: '请选择路况时效',
						icon: 'none'
					});
					return;
				}
				if(!this.description){
					uni.showToast({
						title: '请输入路况说明',
						icon: 'none'
					});
					return;
				}
				let code = this.codeObj ? this.codeObj.split(',') : [];
				if(!this.codeObj) {
					var provinceCode = this.adcode.substring(0,2) + '0000';
					var cityCode = this.adcode.substring(0,4) + '00';
				}
				var data = {
					// title: this.title,
					address: this.address,
					situationType: this.situationType,
					deadType: this.deadType,
					facadeImage: this.facadeImage,
					description: this.description,
					longitude: this.longitude,
					latitude: this.latitude,
					labelVOS: labelVOS,
					typeId: this.classificationType,
					provinceCode: this.codeObj ? code[0] : provinceCode,
					cityCode: this.codeObj ? code[1] : cityCode,
					areaCode: this.codeObj ? code[2] : this.adcode,
					commonHtmlTitle: commonHtmlTitle
				};
				if (this.detailsObj) {
					data.id = this.detailsObj.id;
				}
				console.log('路况发布', data)
				if (this.isClicking) {
					return
				}
				this.isClicking = true;
				uni.showLoading({
					title: '请稍候...',
					mask: true,
				})
				var that = this;
				utils.postRequest('/mu/situation/save', data)
				.then(res=>{
					uni.hideLoading();
					if(res.retCode == "0000000"){
						uni.showToast({
							title: '提交成功',
							icon: 'none',
						})
						if (this.pageName) {
							uni.$emit("refreshApi")
						}
						setTimeout(()=>{
							that.isClicking = false;
							uni.navigateBack({
								delta: 1,
								success: function(ret) {
									uni.$emit("refreshData_road");
								}
							})
						}, 1500)
					} else{
						that.isClicking = false;
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				})
				.catch(err=>{
					that.isClicking = false;
					uni.hideLoading();
				})
			},
			backToFromPage() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-box{
		display: flex;
		font-size: 30rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		color: #333;
		align-items: flex-start;
		border-bottom: 1rpx solid #f3f3f3;
	}
	.placeholder-class{
		color: #999;
	}
	.content-name{
		display: flex;
		align-items: center;
		width: 170rpx;
		padding-top: 8rpx;
		font-weight: 500;
	}
	.mandatory{
		color: #FF021F;
	}
	.address{
		display: flex;
		align-items: center;
	}
	.screen-img{
		width: 20rpx;
		margin-right: 10rpx;
	}
	.input-box{
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
	.lable-box{
		display: flex;
		flex-wrap: wrap;
		width: 520rpx;
		font-size: 28rpx;
	}
	.lable-child{
		width: 122rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background-color: #E5E5E5;
		color: #3B3B3B;
		margin-right: 8rpx;
		margin-bottom: 15rpx;
	}
	.lable-select-child{
		width: 122rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background-color: #D0E4FA;
		color: #3876EB;
		margin-right: 8rpx;
		margin-bottom: 15rpx;
	}
	.photos{
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
	.photo-img{
		width: 190rpx;
		height: 160rpx;
	}
	.remind{
		color: #FF021F;
		font-size: 24rpx;
		margin-top: 10rpx;
	}
	.describe{
		box-sizing: border-box;
		width: 100%;
		border: 1rpx solid #AAAAAA;
		padding: 10rpx;
		height: 328rpx;
		border-radius: 10rpx;
	}
	.btn-box{
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
	.btn{
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
	.headBox {
		padding:70rpx 0 0 0;
		background-color: #FFFFFF;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size:34rpx;
		font-weight: 500;
		color:#333;
		// box-sizing: border-box;
		.headRight {
			position: absolute;
			right: 0;
			top:  70rpx;
		}
		.uniIcon {
			width: 22rpx;
			height: 40rpx;
			position: absolute;
			left:40rpx;
			margin-top:10rpx;
		}
		.memberMoreIcon {
			width: 42rpx;
			height: 42rpx;
			position: absolute;
			right:40rpx;
			margin-top:10rpx;
		}
	}
</style>
