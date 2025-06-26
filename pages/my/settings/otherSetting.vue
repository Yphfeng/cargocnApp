<template>
	<view class="otherSettings">
		<!-- <view class="newHeader">
			<i class="uni-btn-icon" @click="backToFromPage()" style="color: rgb(0, 0, 0); font-size: 27px;"></i>
			<view class="pageTitle">其他设置</view>
			<view></view>
		</view> -->
		<view class="itemView" @click="toFreeze()">
			<view class="leftIcon">
				<image src="../../../static/images/freezeicon.png" class="icon1"></image>
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>注销账户</text>
				<image class="righImageView" src="../../../static/images/icon_right.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {loginSelf} from "../../../utils/service.js";
	import * as utils from "@/utils/service.js";
	import * as ship from "@/utils/ship"
	export default {
		data (){
			return {
				version: ''
			}
		},
		onLoad() {
			var that = this;
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
				console.log(JSON.stringify(wgtinfo));
				console.log(wgtinfo.version);//应用版本号
				that.version = wgtinfo.version;
			})
		},
		methods: {
			backToFromPage() {
				uni.switchTab({
				    url: '/pages/my/index/index'
				});
			},
			toFreeze() { // 注销账户（冻结）
				uni.navigateTo({
					url: './cancellation'
				})
				// uni.showModal({
				// 	title: '确认注销吗？',
				// 	content: '注销后将无法使用货运中国提供的服务！',
				// 	success: function(res) {
				// 		if (res.confirm) {
				// 			let userInfo = uni.getStorageSync("userInfo");
				// 			let params = {
				// 				id: JSON.parse(userInfo).userId,
				// 				examReason: '用户注销'
				// 			}
				// 			console.log('注销参数', params);
				// 			var userRole = uni.getStorageSync("userRole");
				// 			if (!userInfo) return;
				// 			var url;
				// 			if (userRole == 1) {
				// 				utils.postRequest('/au/user/lock', params)
				// 				.then(res=>{
				// 					console.log('注销结果', res);
				// 					if(res.retCode=="0000000"){
				// 						uni.removeStorageSync('userInfo');
				// 						uni.switchTab({
				// 						    url: '/pages/my/index/index'
				// 						});
				// 					} else{
				// 						uni.showToast({
				// 							title: res.retDesc,
				// 							icon: 'none'
				// 						})
				// 					}
				// 				})
				// 				.catch(err=>{})
				// 			} else {
				// 				ship.postRequest('/yh/user/logout', {
				// 					userCode: JSON.parse(userInfo).attrs.userCode,
				// 				})
				// 				.then(res=>{
				// 					console.log('注销结果', res);
				// 					if(res.retCode=="0000000"){
				// 						uni.removeStorageSync('userInfo');
				// 						uni.switchTab({
				// 						    url: '/pages/my/index/index'
				// 						});
				// 					} else{
				// 						uni.showToast({
				// 							title: res.retDesc,
				// 							icon: 'none'
				// 						})
				// 					}
				// 				})
				// 				.catch(err=>{})
				// 			}
							
				// 		}
				// 	},
				// })
			},
			clickToDetail(index) {
				
				if (index == '1') {
					uni.navigateTo({
						url: './pwdManager',
					})
				} else if (index == '2') {
					uni.showModal({
						title: '提示',
						content: '是否确定退出登录?',
						success: function(res) {
							console.log(res);
							if (res.confirm) {
								// uni.clearStorageSync();
								uni.removeStorageSync('userInfo');
								// loginSelf();
								uni.switchTab({
								    url: '/pages/my/index/index'
								});
							}
						},
					})
				} else if (index == '3') {
					let userInfo = uni.getStorageSync("userInfo");
					let userData = {
						avatarUrl: JSON.parse(userInfo).attrs.avatar,
						name:  JSON.parse(userInfo).userName,
						gender:  JSON.parse(userInfo).attrs.userGender,
						birthday:  JSON.parse(userInfo).attrs.userBirthday,
						region:  JSON.parse(userInfo).attrs.userDistrict,
						introduce:  JSON.parse(userInfo).attrs.userValidity
					};
					uni.setStorageSync('userData', JSON.stringify(userData));
					uni.navigateTo({
						url: './userInfo/userInfo',
					})
				} else if(index == '4'){
					let userInfo = uni.getStorageSync("userInfo");
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
			}
		}
	}
</script>

<style lang="scss">
	.otherSettings {
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
