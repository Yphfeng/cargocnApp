<template>
	<view class="container">
	  <view class="itemView" style="margin-top:20rpx;">
	    <view class="itemView1" style="border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);">
	      <text>设置支付密码</text>
	      <input class="telInput" v-model="pwd1" maxlength="16" placeholder="仅支持纯六位数字密码" password="true" placeholder-style="font-size: 26rpx;" type="number"></input>
	    </view>
	  </view>
	  <view class="itemView">
	    <view class="itemView1">
	      <text>确认支付密码</text>
	      <input class="telInput" v-model="pwd2" maxlength="16" password="true" placeholder="仅支持纯六位数字密码"  placeholder-style="font-size: 26rpx;" type="number"></input>
	    </view>
	  </view>
	  <view class="btnView" @click="clickRegBtn">确认修改</view>
	</view>
</template>

<script>
	import * as utils from "../../../../utils/utils.js"
	import {postRequest} from "../../../../utils/service.js"
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
			}
		},
		beforeDestroy() {
			interval && clearInterval(interval);
			this.time = '发送';
			this.currentTime = 60;
			this.disabled = false;
		},
		methods: {
		
			clickRegBtn: function () {
			    let that = this;
			   
			    var pwd = this.pwd1;
				var testCode = this.testCode;
			
			
				if(!this.pwd1) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return;
				}
				if (!/^\d{6}$/.test(this.pwd1)) {
					uni.showToast({
						title: '仅支持6位纯数字密码',
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
				// if(this.pwd1.length < 6) {
				// 	uni.showToast({
				// 		title: '密码仅支持6-16位、字母数字符号组合',
				// 		icon: 'none'
				// 	})
				// 	return;
				// }
				  //验证类型：1 - 未注册手机号；2 - 已注册手机号
				  uni.showLoading({
					title: '加载中...',
				  });
				  var parm1 = {
					payPassword: this.pwd2,
					commonHtmlTitle: commonHtmlTitle
				  }
				 postRequest("/au/user/pay/password/init", parm1).then(function (res) {
					uni.hideLoading();
					console.log(res);
					if (res.retCode == "0000000") {
					  uni.showModal({
						title: '提示',
						content: '设置密码成功',
						showCancel: false,
						success: function () {
						  uni.navigateBack({})
						}
					  })
					} else {
					  uni.showModal({
						title: '提示',
						content: res.retDesc,
						showCancel: false
					  })
					}
				  });
			  },
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
