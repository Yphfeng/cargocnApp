<template>
	<view class="settings">
		<!-- <view class="newHeader">
			<i class="uni-btn-icon" @click="backToFromPage()" style="color: rgb(0, 0, 0); font-size: 27px;"></i>
			<view class="pageTitle">设置</view>
			<view></view>
		</view> -->
		<view class="itemView" @click="clickToDetail(3)">
			<view class="leftIcon">
				<image src="../../../static/images/icon_pwd.png" class="icon"></image>
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>个人资料</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView" @click="clickToDetail(1)">
			<view class="leftIcon">
				<image src="../../../static/images/editPassword.png" class="icon1"></image>
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>密码管理</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView" @click="clickToDetail(4)">
			<view class="leftIcon">
				<image src="../../../static/images/goodsAddress.png" class="icon1"></image>
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>收货地址</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView" @click="jumpToPushSetting()">
			<view class="leftIcon">
				<image src="../../../static/images/settingImg/push.png" style="width: 48rpx;height: 48rpx;" class="icon1"></image>
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>推送消息设置</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView" @click="jumpToVehicleSetting()" v-if="!isIos" >
			<view class="leftIcon">
				<image src="../../../static/images/settingImg/vehicleRecord.png" style="width: 48rpx;height: 48rpx;" class="icon1"></image>
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>车辆记录设置</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView" @click="jumpToSDKList()" >
				<view class="leftIcon">
					<image src="../../../static/images/settingImg/sdkList.png" style="width: 48rpx;height: 48rpx;" class="icon1"></image>
				</view>
				<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
					<text>第三方信息共享清单</text>
					<image class="righImageView" src="../../../static/images/icon_right.png"></image>
				</view>
			</view>
		<view class="itemView" @click="jumpToOtherSetting()">
			<view class="leftIcon">
				<image src="../../../static/images/settingImg/qita.png" style="width: 48rpx;height: 48rpx;" class="icon1"></image>
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>其他设置</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView" @click="clickTozhengce()">
			<view class="leftIcon">
				<image src="../../../static/images/icon_yinsi.png" class="icon icon5"></image>
			</view>
			<view class="rightMsgBox">
				<text>隐私政策</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView" @click="clickToXieyi()">
			<view class="leftIcon">
				<image src="../../../static/images/icon_xieyi.png" class="icon icon5"></image>
			</view>
			<view class="rightMsgBox">
				<text>用户协议</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView" @click="clickToDetail(2)">
			<view class="leftIcon">
				<image src="../../../static/images/icon_loginout.png" class="icon"></image>
			</view>
			<view class="rightMsgBox">
				<text>退出登录</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="operation">
			当前版本：{{version}}
		</view>
	</view>
</template>

<script>
	import {loginSelf, postRequest} from "../../../utils/ship.js";
	import * as utils from "@/utils/service.js";
	const locationModule = uni.requireNativePlugin("LocationModule");
	export default {
		data (){
			return {
				version: '',
				userRole: '',
				isIos: true
			}
		},
		onLoad() {
			this.userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
			let platform=uni.getSystemInfoSync().platform
			if(this.userRole ==1){
			  this.isIos = false
			}else{
			  this.isIos = true
			}
			if(platform=='ios'){
				  this.isIos = true
			}else if(platform=='android'){
				  this.isIos = false
			}
          
			var that = this;
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
				console.log(JSON.stringify(wgtinfo));
				console.log(wgtinfo.version);//应用版本号
				that.version = wgtinfo.version;
			})
		},
		methods: {
			jumpToSDKList(){
				let that = this
				uni.navigateTo({
							url: './SDKList/SDKList'
				});
			},
			jumpToVehicleSetting(){
				uni.navigateTo({
						url: './vehicleRecord'
					});
			},
			jumpToPushSetting(){
				uni.navigateTo({
					url: './push'
				});
			},
			clickTozhengce() {
				uni.navigateTo({
					url: '/pages/allAgreement/privacy'
				});
			},
			clickToXieyi() {
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					uni.navigateTo({
						url: '/pages/allAgreement/driverService'
					})
				} else {
					uni.navigateTo({
						url: '/pages/allAgreement/service'
					})
				}
				
			},
			backToFromPage() {
				uni.switchTab({
				    url: '/pages/my/index/index'
				});
			},
			clickToDetail(index) {
				if (index == '1') {
					uni.navigateTo({
						url: './pwdList/pwdList?url=setting', //密码管理
					})
				} else if (index == '2') {
					let that = this;
					console.log('用户角色', that.userRole);
					uni.showModal({
						title: '提示',
						content: '是否确定退出登录?',
						success: function(res) {
							console.log(res);
							if (res.confirm) {
								//登录后注销推送信息
								let userInfo = uni.getStorageSync("userInfo");
								var cid = plus.push.getClientInfo().clientid;	
								var userId = JSON.parse(userInfo).userId;
								postRequest("/xxq/device/exp", {cid: cid, userId: userId }).then(res => {
									console.log(res)
									console.log("设备注销")
								})
								uni.removeStorageSync('userInfo');
								uni.removeStorageSync('driverInfo');
								uni.removeStorageSync('token');
								uni.removeStorageSync('driverVerify');	 
								 // uni.clearStorageSync();
								if(that.userRole == 1) {
									//关闭socket
									var app = getApp();
									try{
										app.globalData.consignorSocketTask.close();
										app.globalData.socketTask.close();
									}catch(e){
										//TODO handle the exception
									}	
									loginSelf(that.userRole);
								}else {
									loginSelf(that.userRole);
								}
							}
						},
					})
				} else if (index == '3') {
			
					let userInfo = uni.getStorageSync("userInfo");
					console.log(JSON.parse(userInfo), 'aa')
					var userRole = uni.getStorageSync("userRole");
					var userData = {
						avatarUrl: JSON.parse(userInfo).attrs.avatar,
						name:  JSON.parse(userInfo).attrs.nickname,
						gender:  JSON.parse(userInfo).attrs.sex,
						birthday:  JSON.parse(userInfo).attrs.birthday,
						region:  JSON.parse(userInfo).attrs.district,
						introduce:  JSON.parse(userInfo).attrs.intro
					};
					
					
					uni.setStorageSync('userData', JSON.stringify(userData));
					uni.navigateTo({
						url: './userInfo/userInfo',
					})
				} else if(index == '4'){
					let userInfo = uni.getStorageSync("userInfo");
					console.log(userInfo, '用户1')
					if(userInfo){
						uni.navigateTo({
							url: './addressItems',
						})
					} else{
						uni.showModal({
							title: '请登录后操作',
							confirmText: '去登录',
							success: function(res) {
								if (res.confirm) {
									loginSelf('/pages/my/index/index');
								}
							}
						})
					}
				}
			},
			clearMyStorage() {
				
				// var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				// uni.clearStorageSync();
				// uni.setStorageSync('userData', JSON.stringify(userInfo));
				// uni.setStorageSync('firstGetInApp', 'second');
				uni.removeStorageSync('regionData');
				uni.showToast({
					title: '清除成功！'
				})
				uni.getStorageInfo({
				    success: function (res) {
				        console.log(res);
				    }
				});
			},
			jumpToOtherSetting() {
				uni.navigateTo({
					url: './otherSetting',
				})
			}
		}
	}
</script>

<style lang="scss">
	.settings {
		width: 100vw;
		height: 100vh;
		overflow: scroll;
		padding-bottom: 200rpx;
		box-sizing: border-box;
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
		.itemView{
		  background: white;
		  display: flex;
		  align-items: center;
		  .leftIcon {
			  flex: 0 0 100rpx;
			  display: flex;
			  justify-content: center;
		  }
		  .icon{
		    height: 40rpx;
		    width: 40rpx;
		  }
		  .icon5 {
			  height: 30rpx;
			  width: 30rpx;
		  }
		  .icon1{
		    height: 32rpx;
		    width: 34rpx;
		  }
		  .rightMsgBox{
		    flex: 1;
		    display: flex;
		    justify-content: space-between;
		    align-items: center;
		    padding-right: 30rpx;
			height: 120rpx;
		    text{
		      color: #666666;
		      font-size: 32rpx;
		    }
		    image{
		      height: 30rpx;
		      width: 30rpx;
		    }
		  }
		}
		.operation{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 88rpx;
			line-height: 88rpx;
			background-color: #FFF;
			color:  #666666;
			font-size: 32rpx;
			text-align: center;
		}
	}
</style>
