<template>
	<view class="container">
		<view class="item">
			<view class="subItem">
				<view class="label">
					持卡人
				</view>
				<view class="input_whole">
					<input type="text"  @blur="checkeAccount" v-model="params.accountName" data-item="accountName" maxlength="20" placeholder="请输入持卡人姓名" placeholder-class="placeClass" />
				</view>
			</view>
		</view>
		<view class="item">
			<view class="subItem">
				<view class="label">
					身份证
				</view>
				<view class="input_whole">
					<input type="text"  @blur="checkeAccount" maxlength="18" v-model="params.idNo" data-item="idNo" placeholder="请输入身份证号" placeholder-class="placeClass" />
				</view>
			</view>
		</view>
		<view class="item">
			<view class="subItem">
				<view class="label">
					手机号
				</view>
				<view class="input_whole">
					<input type="number"  @blur="checkeAccount" maxlength="11" v-model="params.mobile" data-item="mobile" placeholder="请输入手机号" placeholder-class="placeClass" />
				</view>
			</view>
		</view>
		<view class="item">
			<view class="subItem">
				<view class="label">
					开户行
				</view>
				<view class="input_whole">
					<input type="text"  @blur="checkeAccount" v-model="params.bank" data-item="bank" placeholder="请输入开户行名称" placeholder-class="placeClass" />
				</view>
			</view>
		</view>
		<view class="item">
			<view class="subItem">
				<view class="label">
					卡号
				</view>
				<view class="input_whole">
					<input type="text"  @blur="checkeAccount" v-model="params.account" data-item="account" placeholder="请输入银行卡号" placeholder-class="placeClass" />
				</view>
			</view>
		</view>
		<view class="sendBtn" @click="send">
			确认
		</view>
		<view v-if="msg" class="msgBox">
			<view class="msg">{{msg}}</view>
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				params: {
					accountName: '',
					idNo: '',
					mobile: '',
					bank: '',
					account: '',
					ext5: 2,
				},
				msg:"",
			}
		},
		onLoad() {
			var userRole = uni.getStorageSync("userRole");
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.params.userId = userRole == 1 ?  JSON.parse(userInfo).userId : JSON.parse(userInfo).userId;
				this.params.userCode = JSON.parse(userInfo).attrs.userCode;
			}
		},
		methods: {
			send() {
				let that = this;
				//添加银行卡
				if(!ship.btnRepeat()) return false; // 防抖
				var params = this.params;
				if (!params.accountName) {
					uni.showToast({
						title: '请输入持卡人姓名',
						icon: 'none'
					})
					return
				}
				// var accountName = params.accountName;
				// var re1 = /^(\w|[\u4E00-\u9FA5]){2,15}$/;
				
				// if (!accountName.match(re1)) {
				// 	uni.showToast({
				// 		title: '持卡人姓名只允许输入汉字，字母，数组2-15位',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				if (!params.idNo) {
					uni.showToast({
						title: '请输入身份证号',
						icon: 'none'
					})
					return
				}
				var format = /^\d{17}(\d|x)$/i;
				var idNo = params.idNo;
				if (!idNo.match(format)) {
					uni.showToast({
						title: '请输入正确的身份证号',
						icon: 'none'
					})
					return
				}
				if (!params.mobile) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return
				}
				var mobile = params.mobile;
				var phoneMatch = /^((13|15|18|14|16|17|12|19)+\d{9})$/;
				if (!mobile.match(phoneMatch)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return
				}
				if (!params.bank) {
					uni.showToast({
						title: '请输入开户行名称',
						icon: 'none'
					})
					return
				}
				var bank = params.bank;
				var bankNameMatch = /^[a-zA-Z\u4E00-\u9FA5]{1,20}$/;   
				var objExp = new RegExp(bankNameMatch);
				if (!objExp.test(bank)) {
					uni.showToast({
						title: '银行名称为1到20位汉字或英文字母',
						icon: 'none'
					})
					return
				}
				if (!params.account) {
					uni.showToast({
						title: '请输入银行卡号',
						icon: 'none'
					})
					return
				}
				var account = params.account;
				var bankAccountMatch = /[0-9]+$/;
				var objExp1 = new RegExp(bankAccountMatch);
				if (!objExp1.test(account)) {
					uni.showToast({
						title: '请输入正确的银行卡号',
						icon: 'none'
					})
					return;
				}
				console.log(params, '参数')
				uni.showLoading();
				ship.postRequest("/md/user-bank/userBankSave", params)
				.then(res => {
					uni.hideLoading();
					console.log(res)
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '添加成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
					} else {
						// uni.showToast({
						// 	title: res.retDesc,
						// 	icon: 'none'
						// })
						that.msg = res.retDesc;
					}
				})
			},
			stripscript(s) {
				//去掉字符串中的特殊字符
				var pattern = new RegExp("[`~!%@#$^&*()=|{}':;',\\[\\].<>/?~！@%#￥……&*（）——|{}【】‘；：”“'。，、？]"); 
				var rs = ""; 
				for (var i = 0; i < s.length; i++) {
					rs = rs+s.substr(i, 1).replace(pattern, ''); 
				} 
				rs = rs.replace(/-/g, "");
				
				return rs;
			},
			checkeAccount(e){
				// var val = e.detail.value;
				var item = e.currentTarget.dataset.item;
				// val = val.replace(/\s+/g, '');
				// if (!val) return;
				if (item == "accountName") {
					this.params.accountName = this.params.accountName.replace(/\s+/g, '');
				} else if (item == "idNo") {
					var format = /^\d{17}(\d|x)$/i;
					if (!this.params.idNo.match(format)) {
						uni.showToast({
						title: '请输入正确的身份证号',
						icon: 'none',
						duration: 2000
						})
					}
					this.params.idNo = this.params.idNo.replace(/\s+/g, '');
				} else if (item == "mobile") {
					var phoneMatch = /^(\d{11})$/;
					if (!this.params.mobile.match(phoneMatch)) {
						uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 2000
						})
					}
					this.params.mobile = this.params.mobile.replace(/\s+/g, '');
				} else if (item == "bank") {
					this.params.bank = this.params.bank.replace(/\s+/g, '');
				} else if (item == "account") {
					var bankAccountMatch = /[0-9]+$/;
					var objExp1 = new RegExp(bankAccountMatch);
					let account = this.params.account;
					let mont = account.replace(/\s/g, "");
					let strips = this.stripscript(mont);
					if (!objExp1.test(strips)) {
						uni.showToast({
						title: '请输入正确的银行卡号',
						icon: 'none',
						duration: 2000
						})
					}
					this.params.account = strips;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background-color: #F3F3F3;
		display: flex;
		flex-direction: column;
		width: 100vw;
		.item {
			background-color: #FFFFFF;
			padding-left: 48rpx;
			.subItem {
				border-bottom: 1rpx solid #D9D9D9;
				display: flex;
				flex-direction: row;
				height: 80rpx;
				align-items: center;
				font-size: 28rpx;
				color: #333333;
				.label {
					width: 200rpx;
					text-align: left;
				}
				.input_whole {
					flex: 1;
				}
			}
			&:last-child {
				.subItem {
					border-bottom: none;
				}
			}
			
		}
	}
	.placeClass {
		font-size: 28rpx;
	}
	.sendBtn {
		height: 96rpx;
		width: calc(100vw - 52rpx);
		margin-left: 26rpx;
		margin-top: 46rpx;
		background-color: #4AA2F3;
		border-radius: 48rpx;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.msgBox{
		margin-left: 8rpx;
		background-color: #FFFFFF;
		font-weight: 500;
		margin-top: 32rpx;
		// text-align: center;
		padding: 14rpx 36rpx;
		.msg{
			color: #eb6464;
			font-size: 28rpx;
		}
	}
</style>
