<template>
	<view class="settings">
		<!-- <view class="itemView" @click="clickToDetail(2)">
			<view class="leftIcon">
				
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>设置支付登录密码</text>
				<image class="righImageView" src="../../../../static/images/icon_right.png"></image>
			</view>
		</view> -->
		<view class="itemView" @click="clickToDetail(3)">
			<view class="leftIcon">
				
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>重置登录密码</text>
				<image class="righImageView" src="../../../../static/images/icon_right.png"></image>
			</view>
		</view>
		<view class="itemView"@click="clickToDetail(1)" v-if="userRole == 1">
			<view class="leftIcon">
				
			</view>
			<view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
				<text>重置支付密码</text>
				<image class="righImageView" src="../../../../static/images/icon_right.png"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {loginSelf} from "../../../../utils/service.js";
	import * as utils from "@/utils/service.js";
	import * as publicData from '@/utils/publicData';
	export default {
		data (){
			return {
				version: ''
			}
		},
		onLoad() {
			var that = this;
			this.userRole = uni.getStorageSync("userRole");
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
				console.log(JSON.stringify(wgtinfo));
				console.log(wgtinfo.version);//应用版本号
				that.version = wgtinfo.version;
			})
		},
		methods: {
			toFreeze() { // 注销账户（冻结）
				uni.showModal({
					title: '确认注销吗？',
					content: '注销后将无法使用货运中国提供的服务！',
					success: function(res) {
						if (res.confirm) {
							let userInfo = uni.getStorageSync("userInfo");
							let params = {
								id: JSON.parse(userInfo).userId,
								examReason: '用户注销'
							}
							console.log('注销参数', params);
							utils.postRequest('/au/user/lock', params)
							.then(res=>{
								console.log('注销结果', res);
								if(res.retCode=="0000000"){
									uni.removeStorageSync('userInfo');
									uni.switchTab({
									    url: '/pages/my/index/index'
									});
								} else{
									uni.showToast({
										title: res.retDesc,
										icon: 'none'
									})
								}
							})
							.catch(err=>{})
						}
					},
				})
			},
			clickToDetail(index) {
				
				if (index == '1') {
					//如果三证没有认证无法修改
					var userInfo = uni.getStorageSync("userInfo");
					var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
					var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
					var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
					if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
						
						uni.showModal({
							title: '请认证驾驶证，行驶证和身份证',
							content: '未完成认证，请认证后操作。',
							confirmText: '去认证',
							cancelText: '再看看',
							success: function(res) {
								if (res.confirm) {
									if (identityVerify !== 1) {
										uni.navigateTo({
											url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
										})
									} else if (driverVerify !== 1) {
										uni.navigateTo({
											url: '../../my/driverVerify/newDriverVerify'
										})
									} else if (vehicleVerify !== 1) {
										uni.navigateTo({
											url: '../../my/carVerify/newCarVerify'
										})
									}
									
								}
							}
						})
						return
					} else {
						//设置token后跳转
						publicData.setOilToken()
						.then(() => {
							uni.navigateTo({
								url: '../payPwd/payPwd', //密码管理
							})
						})
						
					}
				}else if (index == '3') {
					uni.navigateTo({
						url: "../pwdManager"
					})
				} else if (index == 2) {
					uni.navigateTo({
						url: '../payPwdSet/payPwdSet'
					})
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
	.settings {
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
			  flex: 0 0 20rpx;
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
