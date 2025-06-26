<template>
	<view class="container">
		<image class="loginLogo" src="../../../static/images/loginLogo.png"></image>
		<view class="mobileBox">
			<input class="mobileInput" type="number" maxlength="11" v-model="mobile" placeholder="请输入手机号" placeholder-class="inputHint" />
		</view>
		<view class="mobileBox" v-if="loginStatus == 1">
			<input class="mobileInput" v-model="verifyCode" type="number" maxlength="4" placeholder-class="inputHint" placeholder="请输入验证码" />
			<view class="btn-box" :class="{'active': !disabled}" @click="checkMobile">{{time}}</view>
		</view>
		<view class="mobileBox" v-if="loginStatus == 2">
			<image v-show="showPasswordFlag" :style="password ? 'opacity: 1;' : 'opacity: 0;'" @tap="showPasswordFlag = false" class="hiddenPsd" src="../../../static/images/hiddenPsd.png"></image>
			<image v-show="!showPasswordFlag" :style="password ? 'opacity: 1;' : 'opacity: 0;'" @tap="showPasswordFlag = true" class="showPsd" src="../../../static/images/showPsd.png"></image>
			<input class="mobileInput" v-model="password" maxlength="16" :password="showPasswordFlag" placeholder="请输入密码" placeholder-class="inputHint" @input="onKeyUpInput"/>
			<image :style="password ? 'opacity: 1;' : 'opacity: 0;'" @tap="password = ''" class="clearPsd" src="../../../static/images/clearPsd.png"></image>
		</view>
		
		<!-- <view class="content-all">
			<view class="input-box">
				<view class="phone-box">
					<image class="input-img" src="../../../static/images/phone.png"></image>
					<input type="number" maxlength="11" v-model="mobile" placeholder-class="placeholder-class"
						placeholder="请输入手机号" />
				</view>
				<view class="phone-box">
					<view class="">
						<image class="input-img" src="../../../static/images/password.png"></image>
					</view>
					<view class="code-btn" v-if="loginStatus == 1">
						<input v-model="verifyCode" :maxlength="4" placeholder-class="placeholder-class" placeholder="请输入验证码" />
						<view class="btn-box" :class="{'active': !disabled}" @click="checkMobile">{{time}}</view>
					</view>
					<view class="psw-box" v-if="loginStatus == 2">
						<input :value="password" :maxlength="16" password="true" @input="inputPassword" placeholder-class="placeholder-class" placeholder="请输入密码" />
						
					</view>
				</view>
			</view>
			<view class="content-placeholder"></view>
		</view> -->
		<view class="switch-box">
			<view class="changeLoginModelBtn" @click="loginStatus = 2, resetInfo()" v-if="loginStatus == 1">使用密码登录</view>
			<view class="changeLoginModelBtn" @click="loginStatus = 1, resetInfo()" v-if="loginStatus == 2">使用验证码登录</view>
			<view class="resetPasswordBtn" @click="forgetPwd" v-if="loginStatus == 2">忘记密码</view>
		</view>
		<view class="login-box" :style="canLogin() ? 'background: linear-gradient(86deg, #82C5FA 0%, #4AA2F3 100%);' : 'background: #E9EBF2;'" @click="toLogin">
			<image class="toLoginIcon" src="../../../static/images/toLoginIcon.png"></image>
		</view>
		<view class="tips">
			<checkbox-group @change="checkboxChange">
				<checkbox :checked="checked" value="a" style="transform:scale(0.7);" />
			</checkbox-group>	
			<view class="tips-view">
				<text>我已阅读并同意</text>
				<text class="hyChina" @tap="jumpToAgreement(1)">《货先生隐私政策》</text>
				<text>和</text>
				<text class="hyChina" @tap="jumpToAgreement(2)">《货先生平台服务协议》</text>
				<text>和</text>
				<text class="hyChina" @tap="jumpToAgreement(3)">《货先生用户服务协议》</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js"
	import * as publicData from "@/utils/publicData.js";
	import * as service from "@/utils/service";
	var interval = null; //倒计时函数
	var commonHtmlTitle = '登录';
	import IMService from "@/utils/imservice.js";
	export default {
		data() {
			return {
				checked: false,
				showPasswordFlag: true,
				mobile: '',
				verifyCode: '',
				disabled: true,
				isCheckPhone: false,
				time: '获取验证码', //倒计时 
				currentTime: 60,
				loginStatus: 1, // 登录方式: 1--验证码、2--密码
				password: '',
				userRole: '',
				userInfo: ''
			}
		},
		onLoad(option) {
			if(option.userRole) {
				this.userRole = option.userRole;
			}else {
				this.userRole = uni.getStorageSync('userRole');
			}
			console.log(this.userRole);
		},
		onShow() {
			// this.logout();
			// uni.getSystemInfo({
			//     success: function (res) {
			//         console.log('设备系统信息', res);
			//     }
			// });
		},
		watch: {
			mobile(newValue, oldValue) {
				if (newValue.length == 11) {
					this.disabled = false
				} else {
					this.disabled = true
				}
			}
		},
		onBackPress(event){
			return true; //阻止默认返回行为
		},
		methods: {
			checkboxChange(e) {
				console.log(e, 'aa');
				var value = e.detail.value;
				
				if (value.length > 0) {
					this.checked = true
				} else {
					this.checked = false
				}
			},
			getArgs(str) {
			  let args = {};
			  let query = str.split("?")[1]
			  if (query) {
			    let pairs = query.split("&");
			    pairs.forEach(item => {
			    let key = item.split('=')[0]
			    let value = item.split('=')[1]
			    args[key] = value
			    })
			  }
			  return args
			 },
			onKeyUpInput(e){
				var value = e.detail.value;
				var reg =/[\u4e00-\u9fa5]|\s/g;
				this.$nextTick(function () {
					this.password = value.replace(reg,'');
				})
			},
			canLogin() { // 是否可以登录
				if(this.loginStatus == 1) {
					if(this.mobile && this.verifyCode) {
						return true;
					}else {
						return false;
					}
				}else if(this.loginStatus == 2) {
					if(this.mobile && this.password) {
						return true;
					}else {
						return false;
					}
				}
			},
			inputPassword(e){
				this.password = e.detail.value;
			},
			toLogin() {
			
				if (!(/^1[3456789]\d{9}$/.test(this.mobile)) || this.mobile.length != 11){//手机正则表达式
					uni.showToast({
						title: '请输入正确的手机号！',
						icon: 'none'
					})
					return;
				}
				if (this.loginStatus == 1 && !this.verifyCode) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
					return;
				}
				if(this.loginStatus == 2){
					if(!this.password) {
						uni.showToast({
							title: '请输入密码',
							icon: 'none'
						})
						return;
					}
					// else if(this.password.length < 6) {
					// 	uni.showToast({
					// 		title: '密码仅支持6-16位、字母数字符号组合',
					// 		icon: 'none'
					// 	})
					// 	return;
					// }
				}
				
				if (!this.checked) {
					uni.showToast({
						title: '请您先同意服务条款',
						icon: 'none'
					})
					return;
				}
				if(!utils.btnRepeat()) return false; // 防抖
				
				uni.showLoading({
					title: '登录中',
					mask: true,
				})
				let that = this;
				if (that.userRole == 1) {
					//司机
					var parm = that.loginStatus == 1 ? {
						loginType: 70,
						userType: 7,
						businessType: that.userRole == 1 ? 10 : 20,
						mobile: that.mobile,
						verifyCode: that.verifyCode,
						consentProtocol: 1,
					} : {
						loginType: 70,
						userType: 7,
						businessType: that.userRole == 1 ? 10 : 20,
						mobile: that.mobile,
						password: that.password,
						consentProtocol: 1,
					};
					console.log('登录参数', parm);
					utils.newRegisterLoginRequest('/au/login', parm)
					.then(function(res) {
						// utils.umengEvent()
						uni.hideLoading();
						console.log('登录结果', res)
						if (res.retCode == "0000000") {
							var rspBody = res.rspBody;
							
							getApp().globalData.defaultContact.userName = res.rspBody.userName ? res.rspBody.userName : '';
							getApp().globalData.defaultContact.mobile = res.rspBody.mobile ? res.rspBody.mobile : '';
							
							that.userInfo = rspBody;
							uni.setStorageSync('userRole', that.userRole)
							uni.setStorageSync('userInfo', JSON.stringify(rspBody));
			
							if(uni.getStorageSync('pushFlag') != '20'){
								var deviceId = plus.push.getClientInfo().clientid;
								var userId = res.rspBody.userId;
								utils.postRequest("/xxq/device/reg", {cid: deviceId, userId: userId}).then(res => {
									console.log(deviceId, 'qwqw12')
									console.log('向后端推送设备ID')
								})
							}
							
							// 新用户填写邀请码
							if(plus.runtime.arguments){
								var str = plus.runtime.arguments;
								var params = that.getArgs(str)
								console.log('H5数据参数',params)
								if(params.userCode){
								  let data = {
									userCode: res.rspBody.attrs.userCode,
									invitationCode: params.userCode,
									serviceType: that.userRole == 1 ? '10' : '20'
								  }
								  utils.postRequest("/yh/business/user/binding/business/invitation/code", data).then(res => {
									console.log(res,'绑定用户邀请码返回数据')
								  })
								}
							}
							
							uni.$emit("refreshData_index");
							uni.$emit("refreshData_fleet");
							uni.$emit("refreshData_message"); // 更新会话列表，并重新订阅群聊
							// uni.$emit("locationSend");
							that.getConnectionStatus();
							//判断是否首次登录，是则展示偏好
							// if (rspBody.remindStatus == 0) {
							// 	uni.setStorageSync("remindStatus", 0)
							// 	uni.reLaunch({
							// 		url: '../../my/myHobby/myHobby'
							// 	})
							// }else {
							// 	publicData.setTabbarItem(1);
							// }
							that.driverNewLogin(rspBody);
							
						}else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						uni.hideLoading();
						console.log((err))
					})
				} else {
					var parm = that.loginStatus == 1 ? {
						loginType: 70,
						userType: 7,
						businessType: that.userRole == 1 ? 10 : 20,
						mobile: that.mobile,
						verifyCode: that.verifyCode,
						consentProtocol: 1,
					} : {
						loginType: 70,
						userType: 7,
						businessType: that.userRole == 1 ? 10 : 20,
						mobile: that.mobile,
						password: that.password,
						consentProtocol: 1,
					};
					console.log('登录参数', parm);
					utils.newRegisterLoginRequest('/au/login', parm)
					.then(function(res) {
						// utils.umengEvent()
						uni.hideLoading();
						console.log('登录结果', res)
						if (res.retCode == "0000000") {
							getApp().globalData.defaultContact.userName = res.rspBody.userName;
							getApp().globalData.defaultContact.mobile = res.rspBody.mobile;
							uni.setStorageSync('userRole', that.userRole)
							that.userInfo = res.rspBody;
							uni.setStorageSync('userInfo', JSON.stringify(res.rspBody));
							if(uni.getStorageSync('pushFlag') != '20'){
								var userId = res.rspBody.userId;
								var deviceId = plus.push.getClientInfo().clientid;
								utils.postRequest("/xxq/device/reg", {cid: deviceId, userId: userId}).then(res => {
								  console.log(deviceId, 'qwqw12')
								  console.log('向后端推送设备ID')
								})
							}
							if(plus.runtime.arguments){
								var str = plus.runtime.arguments;
								var params = that.getArgs(str)
								console.log('H5数据参数',params)
								if(params.userCode){
								  let data = {
									userCode: res.rspBody.attrs.userCode,
									invitationCode: params.userCode,
									serviceType: that.userRole == 1 ? '10' : '20'
								  }
								  utils.postRequest("/yh/business/user/binding/business/invitation/code", data).then(res => {
									console.log(res,'绑定用户邀请码返回数据')
								  })
								}
							}
							utils.postRequest('/yh/enterprise/select/detail', {userCode: that.userInfo.attrs.userCode})
							.then(res=>{
								console.log('登录页企业认证详情', res);
								if(res.retCode == "0000000") {
									if(res.rspBody && res.rspBody.contractNum && res.rspBody.contractNum != '0') {
										getApp().globalData.costInformation.needInvoiceFlag = 1;
										console.log('登录页costInformation', getApp().globalData.costInformation);
									}
									// if(res.rspBody) {
									// 	if(res.rspBody.taxNo) {
									// 		getApp().globalData.costInformation.needInvoiceFlag = 1;
									// 		console.log('登录页costInformation', getApp().globalData.costInformation);
									// 	}
									// }
								}
							})
							getApp().globalData.cardFleetItem = {};
							publicData.deleteShipOrderDetails();
							var isFirstShow = uni.getStorageSync("isFirstShow");
							uni.$emit("refreshData_source");
							uni.$emit("changeUserRefresh");
							uni.$emit("refreshData_fleet");
							uni.$emit("refreshData_message"); // 更新会话列表，并重新订阅群聊
							// uni.$emit("locationSend");
							publicData.setTabbarItem(2);
							that.getConnectionStatus();
						}else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						uni.hideLoading();
						console.log((err))
					})
				}
				
			},
			driverNewLogin(rspBody) {
				var userRole = uni.getStorageSync("userRole");
				var userCode = rspBody.attrs.userCode;
				utils.postRequest('/yh/user/task/status/change/log/today/check', {userCode: userCode})
				.then(res => {
					console.log('接单状态', res);
					if (res.retCode == '0000000') {
						if(!res.rspBody) {
							setTimeout(() => {
								publicData.setTabbarItem(1);
								/* uni.reLaunch({
									url: '/pages/loginHint/driverStatus'
									
								}) */
								// uni.switchTab({
								// 	url: '/pages/ship/index/index_car_source'
								// })
							}, 1000)
						}else {
							let params = {
								"userId": rspBody.userId,
								"typeCodeList": ['MY_VEHICLE', 'OFTEN_AREA', 'ROAD_TYPE', 'FAVORITE_CARGO']
							};
							utils.postRequest("/yh/upd/tags/tag/check/by/type", params)
							.then(res => {
								let typeLengthAreacheckFlag = res.rspBody.allTypeCountFlag;
								if(typeLengthAreacheckFlag == 1) {
									publicData.setTabbarItem(1);
								}else {
									setTimeout(() => {
										uni.reLaunch({
											url: '/pages/my/myHobby/myHoby_driver'
										})
									}, 1000)
								}
							})
							.catch(err => {
								console.log(err);
								publicData.setTabbarItem(1);
							})
							// utils.postRequest("/yh/personas/getCheck", {
							// 	userCode: userCode
							// }).then(res => {
							// 	uni.hideLoading();
							// 	var carParams = [], carLenParams = [];
							// 	if (res.retCode == "0000000") {
							// 		var data = res.rspBody;
							// 		console.log('喜好是否已配置', data);
							// 		carParams = data.carModelList;
							// 		carLenParams = data.carLengthList;
							// 	}
								
							// 	if (rspBody.attrs.vehicleVerify != 1 && (carParams.length < 1 || carLenParams.length < 1)) {
							// 		console.log('跳转阿飒飒飒飒')
							// 		setTimeout(() => {
							// 			uni.reLaunch({
							// 				url: '/pages/my/myHobby/myHoby_driver'
							// 			})
										
							// 		}, 1000)
							// 	} else {
							// 		publicData.setTabbarItem(userRole);
							// 	}
							// })
						}
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err => {
					console.log(err);
					publicData.setTabbarItem(1);
				})
			},
			getConnectionStatus() {
				console.log('用户信息', this.userInfo);
				if(this.goEasy.getConnectionStatus() === 'disconnected') {
					if(!getApp().globalData.nvueGoeasy) {
						getApp().globalData.nvueGoeasy = this.GoEasy;
						getApp().globalData.nvuegoeasy = this.goEasy;
					}
					getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(this.userInfo);
				}
			},
			logout () { // 进入登录页需先退出断开goEasy链接
				if(this.goEasy.getConnectionStatus() == 'disconnected') {
					
				} else {
					this.goEasy.disconnect({
					    onSuccess: function(){
					        console.log('断连成功')
					        getApp().globalData.imService = null;
					    },
					    onFailed: function(error){
					        uni.showToast({
					            title:'断连失败'
					        })
					    }
					});
				}
			   
			},
			resetInfo() {
				this.verifyCode = '';
				this.password = '';
			},
			forgetPwd() {
				uni.navigateTo({
					url: '../../my/settings/pwdManager?url=login'
				})
			},
			jumpToAgreement(flag) {
				switch(flag) {
					case 1:
						uni.navigateTo({
							url: '../../allAgreement/privacy'
						});
						break;
					case 2:
						var userRole = this.userRole;
						if (userRole == 1) {
							uni.navigateTo({
								url: '../../allAgreement/driverService'
							});
						} else {
							uni.navigateTo({
								url: '../../allAgreement/service'
							});
						}
						break;
					case 3:
					uni.navigateTo({
						url: '../../allAgreement/plateformService'
					});
				}
			},
			checkMobile: function() {
				if (!(/^1[3456789]\d{9}$/.test(this.mobile)) || this.mobile.length != 11){//手机正则表达式
					uni.showToast({
						title: '请输入正确的手机号！',
						icon: 'none'
					})
					return;
				}
				var that = this;
				if (that.disabled && that.currentTime > 0) {
					return;
				}
				var parm = {
					mobile: that.mobile,
					userType: '84',
					verifyMode: 3,
					commonHtmlTitle: commonHtmlTitle,
				}
				uni.showLoading({
					title: '加载中...',
				});
				// console.log(parm, '发送验证码')
				// that.getCode();
				var userRole = this.userRole;
				if (userRole == 1) {
					
					service.loginRequest('/verification/mobile', parm)
						.then(function(res) {
							console.log(res);
							uni.hideLoading();
							if (res.retCode == '0000000') {
								that.getCode();
								uni.showToast({
									title: '验证码发送成功',
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: res.retDesc,
									icon: 'none'
								})
							}
						}).catch(function(err) {
							console.error(err)
						});
				} else {
					utils.loginRequest('/verification/mobile', parm)
						.then(function(res) {
							console.log(res);
							uni.hideLoading();
							if (res.retCode == '0000000') {
								that.getCode();
								uni.showToast({
									title: '验证码发送成功',
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: res.retDesc,
									icon: 'none'
								})
							}
						}).catch(function(err) {
							console.error(err)
						});
				}
				
			},
			getCode() {
				var that = this;
				var currentTime = that.currentTime
				interval = setInterval(function() {
					currentTime--;
					that.time = currentTime + '秒'
					that.disabled = true;
					if (currentTime <= 0) {
						clearInterval(interval)
						that.time = '重新发送',
						that.currentTime = 60,
						that.disabled = false;
					}
				}, 1000)
				that.$forceUpdate();
			},

		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #FFF;
		padding-top:120rpx;
		box-sizing: border-box;
		.loginLogo {
			width: 156rpx;
			height: 156rpx;
			display: block;
			margin: 0 auto 80rpx auto;
		}
		.inputHint {
			font-size: 32rpx;
			font-weight: 400;
			color: #B0B3BF;
		}
		.mobileBox + .mobileBox {
			margin-top: 32rpx;
		}
		.mobileBox {
			width: 590rpx;
			height: 130rpx;
			margin: 0 auto;
			background: #F2F3F6;
			border-radius: 65rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.mobileInput {
				flex: 1;
				height: 130rpx;
				text-align: center;
				font-size: 42rpx;
				font-weight: 500;
				color: #333333;
			}
			.hiddenPsd {
				width: 36rpx;
				height: 14rpx;
				padding: 0 32rpx;
			}
			.clearPsd {
				width: 26rpx;
				height: 26rpx;
				padding: 0 32rpx;
			}
			.showPsd {
				width: 36rpx;
				height: 24rpx;
				padding: 0 32rpx;
			}
			.btn-box {
				width: 150rpx;
				height: 30rpx;
				line-height: 30rpx;
				border-left: 2rpx solid #777777;
				padding:0 32rpx 0 24rpx;
				text-align: center;
				color: #333;
				font-size: 28rpx;
			}
		}
		.switch-box {
			width: 590rpx;
			margin: 0 auto;
			padding: 32rpx 0 68rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.changeLoginModelBtn {
				font-size: 24rpx;
				color: #4AA2F3;
			}
			.resetPasswordBtn {
				font-size: 24rpx;
				color: #333333;
			}
		}
	}
	.content-all {
	}

	.input-box {
		flex: 8.3;
		margin: 0 68rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.content-placeholder {
		flex: 1;
	}

	.phone-box {
		height: 88rpx;
		width: 616rpx;
		border: 2rpx solid #AAAAAA;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		color: #000;
		font-size: 28rpx;
		background-color: #fff;
	}

	.input-img {
		width: 28rpx;
		height: 40rpx;
		margin: 0 26rpx;
	}

	.placeholder-class {
		color: #AAAAAA;
		font-size: 28rpx;
	}

	.code-btn {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		justify-content: space-between;
		padding-right: 24rpx;
		width: 100%;
		color: #000;
	}
	.psw-box {
		font-size: 24rpx;
		width: 100%;
		color: #000;
	}

	

	.login-box {
		width: 164rpx;
		height: 164rpx;
		margin:0 auto;
		border-radius:100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.toLoginIcon {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.tips {
		position: fixed;
		bottom: 60rpx;
		width: 100%;
		font-size: 24rpx;
		padding: 0 20rpx;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		align-items: flex-start;
		.tips-view {
			flex: 1;
			text-align: left;
			line-height: 50rpx;
		}
	}

	.hyChina {
		color: #007AFF;
	}
</style>
