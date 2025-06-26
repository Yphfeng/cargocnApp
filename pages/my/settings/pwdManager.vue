<template>
	<view class="container">
	  <view class="itemView" style="border-top: 1rpx solid rgba(0, 0, 0, 0.15);">
	    <view class="itemView1" style="border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);">
	      <text>手&ensp;机&ensp;号</text>
	      <input class="telInput" v-model="phone" maxlength="11" type="phone"></input>
	    </view>
	  </view>
	  <view class="itemView">
	    <view class="itemView1 codeWhole" style="border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);">
	      <text>验&ensp;证&ensp;码</text>
	      <input v-model="testCode" style="flex: 1;" maxlength="6" type="number"></input>
	      <button class="codeBtn" :disabled='disabled' @click='getVerificationCode'>{{time}}</button>
	    </view>
	  </view>
	  <view class="itemView">
	    <view class="itemView1" style="border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);">
	      <text>设置密码</text>
	      <input class="telInput" v-model="pwd1" maxlength="16" password="true" placeholder-style="font-size: 26rpx;" @input="onKeyUpInput1"></input>
	    </view>
	  </view>
	  <view class="itemView">
	    <view class="itemView1">
	      <text>确认密码</text>
	      <input class="telInput" v-model="pwd2" maxlength="16" password="true"  placeholder-style="font-size: 26rpx;" @input="onKeyUpInput2"></input>
	    </view>
	  </view>
	  <view class="btnView" @click="clickRegBtn">确认修改</view>
	</view>
</template>

<script>
	import * as utils from "../../../utils/ship.js"
	import {postRequest} from "../../../utils/service.js"
	import * as service from "@/utils/service";
	var interval = null;
	var commonHtmlTitle = '密码管理';
	export default {
		data() {
			return {
				phone: "",
				testCode: "",
				username: "",
				pwd1: "",
				pwd2: "",
				time: '获取验证码', //倒计时 
				currentTime: 60,
				checkStatus: true,
				checkMobileStatus: false,
				checkUsernameStatus: false,
				checkCodeStatus: false,
				disabled: false,
				fronUrl: ''
			}
		},
		onLoad(option) {
			this.fronUrl = option.url;
		},
		beforeDestroy() {
			interval && clearInterval(interval);
			this.time = '发送';
			this.currentTime = 60;
			this.disabled = false;
		},
		methods: {
			onKeyUpInput1(e){ // 输入框剔除中文
				var value = e.detail.value;
				var reg =/[\u4e00-\u9fa5]|\s/g;
				this.$nextTick(function () {
					this.pwd1 = value.replace(reg,'');
				})
			},
			onKeyUpInput2(e){ // 输入框剔除中文
				var value = e.detail.value;
				var reg =/[\u4e00-\u9fa5]|\s/g;
				this.$nextTick(function () {
					this.pwd2 = value.replace(reg,'');
				})
			},
			getVerificationCode: function () {
				var phone1 = this.phone;
				// var isCheck = utils.checkPhone(phone1);
				// if (!phone1) {
				// 	uni.showToast({
				// 		title: '请输入手机号',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				
				// if (!isCheck) {
				// 	uni.showToast({
				// 		title: '请输入正确的手机号',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				if (!(/^1[3456789]\d{9}$/.test(phone1)) || phone1.length != 11){//手机正则表达式
					uni.showToast({
						title: '请输入正确的手机号！',
						icon: 'none'
					})
					return;
				}
				
				 this.requestTestCode();
				
			},
			requestTestCode: function () {
			    var parm = {
			      mobile: this.phone,
			      userType: '84',
			      verifyMode: 3,
				  commonHtmlTitle: commonHtmlTitle,
			    }
			    //	验证类型：1 - 未注册手机号；2 - 已注册手机号
			    uni.showLoading({
			      title: '加载中...',
			    });
				var userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
			    let that = this;
				if (userRole == 1) {
					service.postRequest("/verification/mobile", parm).then(function (res) {
					  console.log(res, "发送验证码成功");
					  uni.hideLoading();
					  if (res.retCode == "0000000") {
					    that.getCode();
					    that.disabled = true
					    
					    uni.showToast({
					      title: '发送成功',
					      icon: 'success',
					      duration: 1500
					    })
					  } else {
					    uni.showToast({
					      title: res.retDesc,
					      icon: 'none'
					    })
					  }
					}).catch(err => {
						uni.hideLoading();
					})
				}else {
					utils.postRequest("/verification/mobile", parm).then(function (res) {
					  console.log(res, "发送验证码成功");
					  uni.hideLoading();
					  if (res.retCode == "0000000") {
					    that.getCode();
					    that.disabled = true
					    
					    uni.showToast({
					      title: '发送成功',
					      icon: 'success',
					      duration: 1500
					    })
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
			},
			getCode: function (options) {
			    var that = this;
			    var currentTime = that.currentTime
			    interval = setInterval(function () {
			      currentTime--;
			      that.time = currentTime + '秒'
			      if (currentTime <= 0) {
			        clearInterval(interval)
			        that.time = '重新发送';
			        that.currentTime = 60;
			        that.disabled = false;
			      }
			    }, 1000)
			},
			clickRegBtn: function () {
			    let that = this;
			   
			    var phone1 = this.phone;
			    var code1 = this.testCode;
			    var pwd = this.pwd1;
				var testCode = this.testCode;
				// var isCheck = utils.checkPhone(phone1);
				// if (!phone1) {
				// 	uni.showToast({
				// 		title: '请输入手机号',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				// if (!isCheck) {
				// 	uni.showToast({
				// 		title: '请输入正确的手机号',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				if (!(/^1[3456789]\d{9}$/.test(phone1)) || phone1.length != 11){//手机正则表达式
					uni.showToast({
						title: '请输入正确的手机号！',
						icon: 'none'
					})
					return;
				}
				if (!code1) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
					return
				}
				if(!this.pwd1) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return;
				}
			    if (this.pwd1 !== this.pwd2) {
					uni.showToast({
						title: '两次输入密码不一致',
						icon: 'none'
					})
					return
				}
				if(this.pwd1.length < 6) {
					uni.showToast({
						title: '密码仅支持6-16位、字母数字符号组合',
						icon: 'none'
					})
					return;
				}
				var userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
				
				  //验证类型：1 - 未注册手机号；2 - 已注册手机号
				uni.showLoading({
					title: '加载中...',
				});
				var parm1 = {
					mobile: this.phone,
					verifyCode: this.testCode,
					// userType: '84',
					password: this.pwd2,
					// commonHtmlTitle: commonHtmlTitle
				}
				
				if(this.fronUrl == 'login') {
					this.editPassword(parm1);
				}else {
					this.resetPassword(parm1);
				}
				
			},
			editPassword(parm1) {
				console.log('重置参数', parm1);
				 utils.loginRequest('/yh/user/forget/password', parm1)
				 .then(function (res) {
					uni.hideLoading();
					console.log(res);
					if (res.retCode == "0000000") {
						uni.showModal({
							title: '提示',
							content: '修改密码成功',
							showCancel: false,
							success: function () {
								uni.navigateBack({})
							}
						})
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				});
			},
			resetPassword(parm1) {
				console.log('重置参数', parm1);
				 utils.postRequest('/yh/user/remake/password', parm1)
				 .then(function (res) {
					uni.hideLoading();
					console.log(res);
					if (res.retCode == "0000000") {
					  uni.showModal({
						title: '提示',
						content: '修改密码成功',
						showCancel: false,
						success: function () {
						  uni.navigateBack({})
						}
					  })
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log(err, "重置")
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.itemView{
	  height: 100rpx;
	  width: 100vw;
	  background: white;
	}
	.itemView1{
	  /* background: red; */
	  height: 99rpx;
	  margin-left: 30rpx;
	  display: flex;
	  flex-direction: row;
	}
	.itemView1 text{
	  height: 100rpx;
	  /* width: 30vw; */
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  color: #333333;
	  font-size: 34rpx;
	}
	.itemView1 input{
	  width: 60vw;
	  margin-left: 30rpx;
	  height: 100rpx;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	}
	.itemView1 span{
	  position: fixed;
	  right: 30rpx;
	  margin-left: 30rpx;
	  height: 100rpx;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	}
	.contractView{
	  padding-left: 30rpx;
	    position: fixed;
	  bottom: 94rpx;
	  left: 0;
	  right: 0;
	  height: 94rpx;
	  font-size: 24rpx;
	  color: #666666;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	}
	/*checkbox 选项框大小  */
	checkbox .wx-checkbox-input {
	  width: 26rpx;
	  height: 26rpx;
	  border-radius: 15rpx;
	}
	.contractView label{
	  color: #469DFC;
	}
	.btnView{
	  position: fixed;
	  bottom: 0rpx;
	  left: 0;
	  right: 0;
	  height: 94rpx;
	  background:  #469DFC;
	  text-align: center;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  color: white;
	  font-size: 36rpx;
	}
	.codeBtn{
	  width: 250rpx;
	  height: 98rpx;
	  font-size: 30rpx;
	  background-color: transparent;
	  color:  #008AFC;
	  text-align: center;
	  line-height: 100rpx;
	  border: none;
	}
	.sendcodebtn[disabled][type="default"],wx-button[disabled]:not([type])
	
	{
	
	  background-color: white;
	
	  color: #999999;
	
	}
	.codeWhole {
		display: flex;
		flex-direction: row;
	}
	button::after { border: none; }
	.plcStyle{
	  font-size: 26rpx;
	
	}
</style>
