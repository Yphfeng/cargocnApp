<template>
	<view class="userInfo">
		<view class="newHeader">
			<i class="uni-btn-icon" @click="backToFromPage()" style="color: rgb(0, 0, 0); font-size: 27px;"></i>
			<view class="pageTitle">编辑资料</view>
			<view></view>
		</view>
		<view class="userAvatar">
			<view class="avatarBox" @tap="powerImage">
				<view class="avatarImg">
					<image  mode="aspectFill" v-if="!userInfo.avatarUrl" :src="dafaultAvatar"></image>
					<image  mode="aspectFill" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl"></image>
				</view>
				<view class="cameraIcon">
					<image src="../../../../static/images/cameraIcon.png"></image>
				</view>
			</view>
		</view>
		<view class="userModelList">
			<view class="title">昵称</view>
			<view class="contentBox" @click="jumpToEditMsg('./editNickName', 1)">
				<view class="nickName">{{userInfo.name ? userInfo.name : '请输入昵称'}}</view>
				<view class="rightIcon"><image src="../../../../static/images/newRightIcon.png"></image></view>
			</view>
		</view>
		<view class="userModelList">
			<view class="title">性别</view>
			<picker mode="selector" :range="genderData" :value="genderVal" @change="genderChange">
				<view class="contentBox">
					<view class="nickName">{{userInfo.gender ? userInfo.gender : '请选择性别'}}</view>
					<view class="rightIcon"><image src="../../../../static/images/newRightIcon.png"></image></view>
				</view>
			</picker>	
		</view>
		<view class="userModelList">
			<view class="title">生日</view>
			<!-- <picker mode="date" fields="day" :value="birthdayVal" @change="birthdayChange">
				<view class="contentBox">
					<view class="nickName">{{userInfo.birthday ? userInfo.birthday : '请选择生日'}}</view>
					<view class="rightIcon"><image src="../../../../static/images/newRightIcon.png"></image></view>
				</view>
			</picker> -->
			<view class="contentBox">
				<uni-datetime-picker
				    type="date"
					:border="false"
					:clear-icon="false"
					:placeholder="'请选择时间'"
				    v-model="userInfo.birthday"
				    @change="changeLog"
					style="text-align: right;color:#333;"
				/>
				<view class="rightIcon"><image src="../../../../static/images/newRightIcon.png"></image></view>
			</view>
			
		</view>
		<view class="userModelList">
			<view class="title">地区</view>
			<view class="contentBox" @tap="openRegionPopup()">
				<view class="nickName">{{userInfo.region ? userInfo.region : '选择你所在的地区'}}</view>
				<view class="rightIcon"><image src="../../../../static/images/newRightIcon.png"></image></view>
			</view>	
		</view>
		<view class="userModelList">
			<view class="title">个人简介</view>
			<view class="contentBox" @click="jumpToEditMsg('./userIntroduce', 2)">
				<view class="nickName">{{userInfo.introduce?userInfo.introduce:'修改个人简介'}}</view>
				<view class="rightIcon"><image src="../../../../static/images/newRightIcon.png"></image></view>
			</view>
		</view>
		<view class="saveBtn" @click="toSave()">保存</view>
		<uni-popup ref="regionPopup" type="bottom">
			<view class="popupBox">
				<view class="popupBtnGroup">
					<view class="cancleBtn" @click="closePopup()">取消</view>
					<view class="confirmBtn" @click="toChooseRegion()">确定</view>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="regionVal" @change="regionChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item,index) in region" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in secondAry" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in thirdAry" :key="index">{{item.name}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		
		<uni-popup ref="newRegionPopup" type="bottom">
			<chooseRegion></chooseRegion>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	import * as ship from "@/utils/ship"
	import chooseRegion from "../../../../components/chooseRegion.vue"
	var commonHtmlTitle = '编辑资料';
	export default {
		data() {
			return {
				genderData: ['男','女'],
				genderVal: '',
				userInfo: {
					avatarUrl: '',
					name: '',
					gender: '',
					birthday: '',
					region: '',
					introduce: ''
				},
				birthdayVal: '',
				region: [],
				regionVal: [0,0,0],
				secondAry: [],
				thirdAry: [],
				indicatorStyle: 'height:60rpx;',
				dafaultAvatar: ''
			}
		},
		components: { chooseRegion },
		onLoad(option) {
			var userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
			this.dafaultAvatar = userRole == 1 ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png' : '../../../../static/images/goodsDelivery/shipUserLogo.png';
			console.log(this.dafaultAvatar);
			if(uni.getStorageSync("userData")) {
				var userInfo = uni.getStorageSync("userData");
				this.userInfo = JSON.parse(userInfo);
			}
			console.log('用户信息', this.userInfo);
			this.getRegionInfo();
			uni.$on("checkStartRegion", item => {
				console.log('装货地', item);
				this.userInfo.region = item.provinceName + '-' + item.cityName + '-' + item.areaName;
				this.$refs.newRegionPopup.close();
				this.$forceUpdate();
			})
			uni.$on("closeRegionPopup", item => {
				this.$refs.newRegionPopup.close();
			})
		},
		onShow() {
			var userInfo =  JSON.parse(uni.getStorageSync("userData"));
			this.userInfo.name = userInfo.name ? userInfo.name : '';
			this.userInfo.gender = userInfo.gender ? userInfo.gender : '';
			this.userInfo.birthday = userInfo.birthday ? userInfo.birthday : '';
			this.userInfo.region = userInfo.region ? userInfo.region : '';
			this.userInfo.introduce = userInfo.introduce ? userInfo.introduce : '';
			this.userInfo.avatarUrl = userInfo.avatarUrl ? userInfo.avatarUrl : '';
		},
		methods: {
			changeLog(e) {
			    this.userInfo.birthday = e;
			    console.log("选择的起运时间:", e);
			},
			showPhone() {
				var userInfo = this.userInfo;
				if (userInfo) {
					var mobile = userInfo.mobile;
					return mobile.substring(0, 3) + '****' + mobile.substring(-4)
				} else {
					return ''
				}
			},
			backToFromPage() {
				// uni.redirectTo({
				// 	url: '../index',
				// })
				uni.navigateBack({});
			},
			powerImage() {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '为保证您的资料完整，需获取您的相册和拍照权限，请点击确定允许',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮的文字  
					success: function(res) {
						if(res.confirm) { 
							that.chooseImage();
						}
					}
				})
			},
			chooseImage() {
				var that = this;
				uni.chooseImage({
					count: 1,
					// 默认9  
					sizeType: ['compressed'],
					sourceType: ['camera', 'album'],
					success: function(res) {
						console.log('选择完图片', res);
						var tempFilePaths = res.tempFilePaths;
						// var obj = {url: tempFilePaths[0]}
						// that.imagesArr.push(obj);
						that.uploadImg(tempFilePaths[0]);
					},
					fail: function(err) {
						console.log(that.userInfo);
						console.log('返回的头像', err);
					}
				});
			},
			uploadImg(image) {
				// uni.showLoading({
				// 	title: '请稍候...'
				// });
				var that = this;
				var url = '/file/upload'
				uni.uploadFile({
					url: utils.ApiRootUrl + url,
					filePath: image,
					name: 'file',
					formData: {
						userType: '84'
					},
					success: function(res) {
						var result = JSON.parse(res.data);
						console.log('上传成功', result)
						if(result.retCode == '0000000'){
							that.userInfo.avatarUrl = result.rspBody[0].url;
						} else{
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							});
						}
						that.$forceUpdate();
					},
					fail: function(res) {
						uni.showToast({
							title: '网络错误!',
							icon: 'none'
						});
					},
					complete: function(done) {
						// uni.hideLoading();
					}
				});
			},
			getRegionInfo() {
				let that = this;
				utils.postRequest('/au/nationDict/getBasicData', {commonHtmlTitle: commonHtmlTitle})
				.then(res=>{
					that.region = res.rspBody;
					that.secondAry = that.region[0].cities;
					that.thirdAry = that.region[0].cities[0].areas;
				})
				.catch(err=>{
					console.log(err);
				})
			},
			genderChange(e){
				console.log(e);
				this.genderVal = e.detail.value;
				this.userInfo.gender = this.genderData[this.genderVal];
			},
			birthdayChange(e){
				console.log(e);
				this.birthdayVal = e.detail.value;
				this.userInfo.birthday = this.birthdayVal;
			},
			regionChange(e) {
				console.log(e);
				this.regionVal = e.detail.value;
				let key1 = this.regionVal[0];
				this.secondAry = this.region[key1].cities;
				let key2 = this.regionVal[1];
				this.thirdAry = this.region[key1].cities[key2].areas;
			},
			openRegionPopup() {
				this.$refs.newRegionPopup.open();
			},
			closePopup() {
				this.regionVal = [0, 0, 0];
				this.$refs.regionPopup.close();
			},
			toChooseRegion() { // 选择地区
				let key1 = this.regionVal[0];
				let key2 = this.regionVal[1];
				let key3 = this.regionVal[2];
				this.userInfo.region = this.region[key1].name + '-' + this.region[key1].cities[key2].name + '-' + this.region[key1].cities[key2].areas[key3].name;
				this.$refs.regionPopup.close();
				this.$forceUpdate();
			},
			jumpToEditMsg(url, flag) {
				let query = '';
				uni.setStorageSync('userData', JSON.stringify(this.userInfo));
				switch(flag) {
					case 1:
						query = '?nickName=' + this.userInfo.name;
						break;
					case 2:
						query = '?introduce=' + this.userInfo.introduce;
						break;
				}
				uni.navigateTo({
					url: url + query
				})
			},
			async toSave() { // 请求完成接口后，修改缓存userInfo的数据
				uni.showLoading({
					title: '请稍候...',
					mask: true,
				})
				let params = {
					userName: this.userInfo.name ? this.userInfo.name : null,
					avatar: this.userInfo.avatarUrl ? this.userInfo.avatarUrl : null,
					userBirthday: this.userInfo.birthday ? this.userInfo.birthday : null,
					userGender: this.userInfo.gender ? this.userInfo.gender : null,
					userValidity: this.userInfo.introduce ? this.userInfo.introduce : null,
					userDistrict: this.userInfo.region ? this.userInfo.region : null,
					commonHtmlTitle: commonHtmlTitle
				}
				let that = this;
				try{
					
				
					var userInfo = uni.getStorageSync("userInfo");
					var userRole = uni.getStorageSync("userRole"), url = "",res = null;
					console.log(userInfo, '阿萨说', {
							nickname: this.userInfo.name,
							district: this.userInfo.region,
							avatar: this.userInfo.avatarUrl,
							birthday: this.userInfo.birthday,
							sex: this.userInfo.gender,
							intro: this.userInfo.introduce,
							userBusinessId: userBusinessId
						});
					
					var userBusinessId = JSON.parse(userInfo).attrs.userBusinessId;
					url = "/yh/business/user/update/base/info"
					res = await ship.postRequest(url, {
						nickname: this.userInfo.name,
						district: this.userInfo.region,
						avatar: this.userInfo.avatarUrl,
						birthday: this.userInfo.birthday,
						sex: this.userInfo.gender,
						intro: this.userInfo.introduce,
						userBusinessId: userBusinessId
					})
					
			
					console.log(res, url);
					uni.hideLoading();
					if(res.retCode == "0000000"){
						uni.showToast({
							title: '保存成功',
							duration: 1500,
							icon: 'none',
						})
						
							// avatarUrl: JSON.parse(userInfo).attrs.avatar,
							// name:  JSON.parse(userInfo).userName,
							// gender:  JSON.parse(userInfo).attrs.userGender,
							// birthday:  JSON.parse(userInfo).attrs.userBirthday,
							// region:  JSON.parse(userInfo).attrs.userDistrict,
							// introduce:  JSON.parse(userInfo).attrs.userValidity
						let userInfo = uni.getStorageSync("userInfo");
						userInfo = JSON.parse(userInfo);
					
						userInfo.attrs.avatar = that.userInfo.avatarUrl;
						userInfo.attrs.nickname = that.userInfo.name;
						userInfo.attrs.sex = that.userInfo.gender;
						userInfo.attrs.birthday = that.userInfo.birthday;
						userInfo.attrs.district = that.userInfo.region;
						userInfo.attrs.intro = that.userInfo.introduce;
					
						
						uni.setStorageSync('userInfo', JSON.stringify(userInfo));
						uni.setStorageSync("userData", JSON.stringify(that.userInfo))
						if (userRole == 1) {
							setTimeout(()=>{
								uni.switchTab({
								    url: '/pages/my/index/index'
								});
							}, 1500)
						} else {
							setTimeout(()=>{
								uni.switchTab({
								    url: '/pages/goodsDelivery/userCenter/userCenter'
								});
							}, 1500)
						}
						
					} else{
						uni.showToast({
							title: '保存失败',
							duration: 1500,
							icon: 'none',
						});
					}
				}catch(e){
					//TODO handle the exception
					uni.hideLoading();
				}
			}
		}
	}
</script>

<style lang="scss">
	.userInfo {
		min-height: 100vh;
		background-color: #F2F2F2;
		image {
			max-width: 100%;
			max-height: 100%;
		}
		.newHeader {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:100rpx 20rpx 14rpx 20rpx;
			background-color: #FFF;
			.pageTitle {
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size:36rpx;
				color:#000;
			}
			.headerSaveBtn {
				height: 60rpx;
				line-height: 60rpx;
				font-size:28rpx;
				color:#000;
			}
		}
		.userAvatar {
			padding: 66rpx 0;
			background-color: #FFF;
			.avatarBox {
				width:200rpx;
				height: 200rpx;
				margin:0 auto;
				.avatarImg {
					width:200rpx;
					height: 200rpx;
					border-radius:100%;
					overflow: hidden;
				}
				.cameraIcon {
					width:50rpx;
					height: 50rpx;
					margin-left:150rpx;
					margin-top:-50rpx;
				}
			}
		}
		.userModelList {
			background-color: #FFF;
			margin-top:2rpx;
			padding:34rpx 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				font-size:30rpx;
				color:#333;
				height: 42rpx;
				line-height: 42rpx;
			}
			.contentBox {
				flex: 1;
				min-width:300rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.nickName {
					font-size:30rpx;
					color:#777;
					width: 400rpx;
					text-align: right;
					height: 42rpx;
					line-height: 42rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-weight: normal;
				}
				.rightIcon {
					width:15rpx;
					height: 28rpx;
					margin-left: 30rpx;
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
				font-size: 28rpx !important;
			}
			.input-placeholder {
				font-size: 30rpx !important;
				color: #777 !important;
			}
			.uni-input-input {
				font-size: 30rpx;
				color:#777;
			}
		}	
		.saveBtn {
			margin:210rpx 64rpx 0 64rpx;
			height: 64rpx;
			line-height: 64rpx;
			background-color: #FF8D02;
			border-radius: 32rpx;
			text-align: center;
			color:#fff;
			font-size: 32rpx;
		}
		.popupBox {
			background-color: #FFF;
			.popupBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:20rpx 40rpx;
				.cancleBtn {
					font-size: 30rpx;
					color:#F56C6C;
					font-weight:bold;
				}
				.confirmBtn {
					font-size: 30rpx;
					color:#409EFF;
					font-weight:bold;
				}
			}
			.picker-view{
				width: 750rpx;
				height: 400rpx;
			}
			.item{
				height:60rpx;
				line-height: 60rpx;
				align-items: center;
				justify-content: center;
				text-align: center;
			}
		}
	}
</style>
