<template>
	<view class="container">
		<view class="itemView" style="margin-top:20rpx;">
			<view class="itemView1" style="border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);">
				<text>设置密码</text>
				<input class="telInput" v-model="pwd1" maxlength="16" password="true"
					placeholder-style="font-size: 26rpx;" type="number"></input>
			</view>
		</view>
		<view class="itemView">
			<view class="itemView1">
				<text>确认密码</text>
				<input class="telInput" v-model="pwd2" maxlength="16" password="true"
					placeholder-style="font-size: 26rpx;" type="number"></input>
			</view>
		</view>
		<view class="btnView" @click="clickRegBtn">确认修改</view>
	</view>
</template>

<script>
	const util = require("@/utils/jym-utils/util.js");
	var api = require("@/config/api.js");
	export default {
		data() {
			return {
				pwd1: "",
				pwd2: "",
			}
		},
		methods: {
			clickRegBtn: function () {
				let that = this;
				if (!that.pwd1) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return;
				}
				if (that.pwd1 !== that.pwd2) {
					uni.showToast({
						title: '两次输入密码不一致',
						icon: 'none'
					})
					return
				}
				if (!/^\d{6}$/.test(this.pwd1)) {
					uni.showToast({
						title: '仅支持6位纯数字密码',
						icon: 'none'
					})
					return;
				}
				// if (that.pwd1.length < 6) {
				// 	uni.showToast({
				// 		title: '密码仅支持6位数字',
				// 		icon: 'none'
				// 	})
				// 	return;
				// }
				var parm1 = {
					payPassword: that.pwd1,
				}
				util.postRequest(api.setPayPwd, parm1).then(function (res) {
					console.log(res)
					if (res.retCode == "0000000") {
						console.log('密码设置成功以后')
						let driverInfo = uni.getStorageSync('driverInfo');
						driverInfo.attrs.hasPayPassword = 1
						uni.setStorageSync('driverInfo', driverInfo);
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
	.itemView {
		height: 100rpx;
		width: 100vw;
		background: white;
	}

	.itemView1 {
		/* background: red; */
		height: 99rpx;
		margin-left: 30rpx;
		display: flex;
		flex-direction: row;
	}

	.itemView1 text {
		height: 100rpx;
		/* width: 30vw; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #333333;
		font-size: 34rpx;
	}

	.itemView1 input {
		width: 60vw;
		margin-left: 30rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.itemView1 span {
		position: fixed;
		right: 30rpx;
		margin-left: 30rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.contractView {
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

	.contractView label {
		color: #469DFC;
	}

	.btnView {
		position: fixed;
		bottom: 0rpx;
		left: 0;
		right: 0;
		height: 94rpx;
		background: #469DFC;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: white;
		font-size: 36rpx;
	}

	.codeBtn {
		width: 250rpx;
		height: 98rpx;
		font-size: 30rpx;
		background-color: transparent;
		color: #008AFC;
		text-align: center;
		line-height: 100rpx;
		border: none;
	}

	.sendcodebtn[disabled][type="default"],
	wx-button[disabled]:not([type]) {

		background-color: white;

		color: #999999;

	}

	.codeWhole {
		display: flex;
		flex-direction: row;
	}

	button::after {
		border: none;
	}

	.plcStyle {
		font-size: 26rpx;

	}
</style>