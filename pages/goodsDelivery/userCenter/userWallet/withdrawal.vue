<template>
	<view class="withdrawal">
		<view class="walletHead">
			<view class="headBox">
				<image @tap="toBack" class="backIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/white_left_icon.png"></image>
				提现
			</view>
		</view>
		
		<view class="withdrawalDetails">
			<view class="withdrawalInputBox">
				<view class="title">提现金额</view>
				<input class="priceInput" :placeholder="placeholder" :focus="focus"   placeholder-style="font-size: 24rpx;color: #AAA;" type="digit" v-model="withdrawalPrice" />
			</view>
			<view class="withdrawalInputBox">
				<view class="title">收款账户</view>
				<view class="userAccount" @click="showCountPopUp">
					<view class="accountMsg" v-if="!isWx">
						<!-- <view class="msg">{{isSelectedbrandName}}</view> -->
						<view class="msg"></view>
					</view>
					<view v-else class="accountMsg">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx.png" mode="widthFix" class="wxIcon"></image>
						<text style="padding-left: 20rpx;">{{vxNick}}</text>
					</view>
					<image class="icon_right" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
			<view class="servicePriceBox">
				<view class="title">服务费</view>
				<view class="price">{{servicePrice}}</view>
			</view>
		</view>
		
		<view class="withdrawalHint">提现会产生{{rate}}%的服务费</view>
		
		<view class="confirmBtn" @click="confirm">确认</view>
		
		<uni-popup ref="hintPopup" type="center" :mask-click="false" background-color="rgba(0,0,0,0)">
			<view class="hintToast">
				<image class="toastIcon" :src="topUpStatus ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/toastSuccess.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/toastError.png'"></image>
				<view class="toastMsg">{{toastMsg}}</view>
			</view>
		</uni-popup>
		<uni-popup ref="tipsPopup" type="center">
			<view class="popupContent">
				<view class="title">提现提示</view>
				<view class="content">您当前提现金额已超最大可提现值</view>
			</view>
		</uni-popup>
		<uni-popup ref="tipsPopup1" type="center">
			<view class="popupContent">
				<view class="title">提现提示</view>
				<view class="content">提现金额不在有效范围内。提现金额不得低于0.3元，不得高于20000元。</view>
			</view>
		</uni-popup>
		<uni-popup ref="wxPopup" type="center">
			<view class="popupContent">
				<view class="title">提现提示</view>
				<view class="content">您将提现到微信零钱</view>
				<view class="btnWx">
					<view class="btnItem cancel" @click="cancelWx">取消</view>
					<view class="btnItem confirm" @click="setWxOpenId">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="typePopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">请选择提现账号</text>
					<view class="cancelIconBox" @click="closePopUp()">
						<image class="cancelIcon" src="../../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="wxContent" @click="getWxInfo">
					<view class="countType">
						微信账户
					</view>
					<view class="wxCountContent">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx.png" mode="widthFix" class="wxIcon"></image>
						<text style="padding-left: 20rpx;">{{vxNick}}</text>
					</view>
					
				</view>
			<!-- 	<view class="listWhole" v-if="brandArr.length > 0 && userRole == 1">
					<view class="countType">
						银行卡账户
					</view>
					<scroll-view class="countContent"  scroll-y>
						<view class="list" v-for="(item, index) in brandArr"  @click="switchIndex(index)">
							
							<view class="name">
								<text>{{showBankAccount(item)}}</text>
								<text class="sub">预计两小时内到账</text>
							</view>
							<view class="opt" @click="unBind(item)">解绑</view>
						</view>
					</scroll-view>
					
				</view>
				<view class="popupBtnGroup" v-if="userRole == 1">
					<view class="comfirmBtn" @tap="addBand()">添加新的银行卡</view>
				</view> -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as md5 from "@/utils/md5.js";
	import * as publicData from "@/utils/publicData";
	export default {
		data() {
			return {
				marginPrice: 0,
				willDoPrice: 0,
				withdrawalPrice: '',
				topUpStatus: false,
				toastMsg: '',
				placeholder: '',
				brandArr: [],
				focus: true,
				brandAccountInfo: null,
				errMsg: '',
				userRole: 1,
				isWx: false,
				vxNick: '',
				isSepportWx: false,
				servicePrice: "计算中",
				rate: 0.6,
			};
		},
		computed: {
			isSelectedbrandName() {
				if (!this.brandAccountInfo) {
					return ''
				}
				var brandAccountInfo = this.brandAccountInfo;
				var brandName = brandAccountInfo.accountName;
				var bankAccount = brandAccountInfo.account;
				return brandName + '(' + bankAccount.substring(bankAccount.length - 4) + ')'
			},
		},
		watch: {
			withdrawalPrice(newVal, oldVal) {
				if (!newVal) {
					this.servicePrice = "计算中"
				} else {
				
					var num = newVal * this.rate/100;
					if (num  ==  0) {
						this.servicePrice = '¥0.00'
					} else if (num < 0.01) {
						this.servicePrice = '¥0.01'
					} else {
						this.servicePrice = '¥' + num.toFixed(2)
					}
							
						
					
				}
			}
		},
		async onLoad() {
			
			var that = this;
			var userInfo = uni.getStorageSync('userInfo');
			var userRole = uni.getStorageSync("userRole");
			this.userRole = userRole;
			
			//获取司机/货主最低保证金
			this.getMarginVO();
			//获取是否已经有微信绑定
			var userId, roleId;
			if (this.userRole == 1) {
				userId = JSON.parse(userInfo).userId
				roleId = JSON.parse(userInfo).serviceType
			} else {
				userId = JSON.parse(userInfo).userId
				roleId = JSON.parse(userInfo).serviceType
			}
			this.userId = userId;
			
			if (userRole == 1) {
				this.getBankList();
				uni.$on("refreshBank", () => {
					this.getBankList();
				})
			}
			
			if (userRole == 1) {
				//获取费率
				utils.postRequest("/ts/extSerFee/get_to_driver", {})
				.then(res => {
					if (res.retCode == "0000000") {
						this.rate = res.rspBody.extServiceCharge * 100;	
					}
				})
			} else {
				//获取费率
				utils.postRequest("/ts/extSerFee/get_to_shipper", {})
				.then(res => {
					if (res.retCode == "0000000") {
						this.rate = res.rspBody.extServiceCharge * 100;	
					}
				})
			}
			
			
			
			var res = await utils.postRequest("/dw/user/get", {
				userId: userId,
				roleId: roleId,
				appId: 'wxff21ca63335c4c42'
			})
			if (!res.rspBody) {
				this.isWx = false
			} else {
				this.isWx = true
				this.vxNick = res.rspBody.vxNick;
			}
			
			 uni.getProvider({
		        service: 'payment',
		        success: function(res) {
		            console.log(res.provider);
		            //支持微信、qq和微博等
		            if (res.provider.indexOf('wxpay') > -1) {
		               that.isSepportWx = true
		            } else {
						that.isSepportWx = false
					}
		        }
		    });
			
		},
		methods: {
			cancelWx() {
				this.$refs.wxPopup.close();
			},
			setWxOpenId() {
				var that = this;
				this.$refs.wxPopup.close();
				uni.showLoading();
				var userInfo = uni.getStorageSync("userInfo");
				var userId, roleId, bindingKey, openId;
				if (this.userRole == 1) {
					userId = JSON.parse(userInfo).userId
					roleId = JSON.parse(userInfo).serviceType
					bindingKey = JSON.parse(userInfo).attrs.userBusinessAccount
				} else {
					userId = JSON.parse(userInfo).userId
					roleId = JSON.parse(userInfo).serviceType
					bindingKey = JSON.parse(userInfo).attrs.userBusinessAccount
				}
			
				uni.login({
				  provider: 'weixin',
				  scopes: "auth_user",
				  success: function (loginRes) {
					console.log(loginRes, '1212');
					// 获取用户信息
					uni.getUserInfo({
						  provider: 'weixin',
						  success: function (infoRes) {
							console.log(infoRes, '用户昵称为：' + infoRes.userInfo.nickName);
							var openId = infoRes.userInfo.openId;
							var vxNick = infoRes.userInfo.nickName;
							//设置用户的openId
							utils.postRequest("/dw/user/add", {
								userId,
								roleId,
								bindingKey,
								openId,
								vxNick,
								appId: "wxff21ca63335c4c42"
							}).then(response => {
								console.log(response, 'asa');
								if (response.rspBody == 1) {
									uni.hideLoading();
									setTimeout(() => {
										uni.showToast({
											title: '授权成功',
											icon: 'none',
										})
										that.isWx = true;
										that.vxNick = vxNick;
									}, 1000)
								} else {
									uni.showToast({
										title: response.retDesc,
										icon: 'none'
									})
								}
								that.$forceUpdate();
							}).catch(err => {
								uni.showToast({
									title: '接口报错',
									icon: 'none',
								})
								uni.hideLoading();
							})
							
						  },
						  fail: function() {
							  uni.showToast({
								title: '微信获取用户信息失败',
								icon: 'none'
							  })
							   uni.hideLoading();
						  }
					});
				  },
				  fail: function(err) {
					  uni.hideLoading();
				  }
				});
				
				
			},
			async getWxInfo() {
				var that = this;
				var userInfo = uni.getStorageSync("userInfo");
				var userId, roleId, bindingKey, openId;
				if (this.userRole == 1) {
					userId = JSON.parse(userInfo).userId
					roleId = JSON.parse(userInfo).serviceType
					bindingKey = JSON.parse(userInfo).attrs.userBusinessId
				} else {
					userId = JSON.parse(userInfo).userId
					roleId = JSON.parse(userInfo).serviceType
					bindingKey = JSON.parse(userInfo).attrs.userBusinessId
				}
				console.log(userId, roleId,bindingKey)
				this.closePopUp();
				var res = await utils.postRequest("/dw/user/get", {
					userId: userId,
					roleId: roleId,
					appId: "wxff21ca63335c4c42",
				})
				if (res.retCode == '0000000') {
					if (!res.rspBody) {
						var isSepportWx = that.isSepportWx;
						if (!isSepportWx) {
							uni.showToast({
								title: '请先安装微信',
								icon: 'none'
							})
							return;
						};
						//获取微信权限
						this.$refs.wxPopup.open();
					} else {
						this.isWx = true;
					}
				} else {
					uni.showToast({
						title: res.retDesc,
						icon: 'none'
					})
				}
				
				console.log(res)
			},
			priceChange(e) {
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
				     if(e.detail.value.length > 6){
				      let num  = Number(e.detail.value.length) - 6;
				      e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				     }else{
				      e.detail.value = parseFloat(e.detail.value);
				     }
				    }else if (e.detail.value.indexOf(".") == 0) {
				     // console.log('首位小数点情况')
				     e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
				     e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				    }else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
				        //去掉最后一位
				     let ary = e.detail.value.split('.');
				     let num = ary['1'].length - 2;
				     e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				    }
				    this.$nextTick(function(){
				     this.withdrawalPrice = e.detail.value
				    })
			
			},
			async getMarginVO() {
				try{
					var userRole = this.userRole;
					var url = userRole == 1 ? '/td/driver/home/getMarginVODriver' : '/td/driver/home/getMarginVOShipper';
					var amountPlaceholder = "";
					var res = await utils.postRequest(url);
					console.log(res, '最低保证金')
					if (res.retCode == "0000000") {
						var marginVal = res.rspBody.margin;
						amountPlaceholder = "已锁定¥" + marginVal.toFixed(2) + ',最多可提¥';
						var response = await utils.postRequest("/dw/wallet/getAmount");
						console.log(response, '余额')
						if (response.retCode == "0000000") {
							var amount = response.rspBody.amount;
							if (userRole == 1) {
								amountPlaceholder = "最多可提¥" + publicData.showPrice(amount, 1000)
								this.willDoPrice = publicData.showPrice(amount, 1000);
							} else {
								var checkUserExt = await utils.postRequest("/dw/wallet/checkUserExt");
								console.log(checkUserExt, '是否锁定')
								if (checkUserExt.rspBody != 0) {
									var willDoPrice = amount - marginVal*1000;
									if (willDoPrice < 0) {
										willDoPrice = 0
									}
									this.willDoPrice = publicData.showPrice(willDoPrice, 1000);
									amountPlaceholder += publicData.showPrice(willDoPrice, 1000)
								} else {
									this.willDoPrice = publicData.showPrice(amount, 1000);
									amountPlaceholder = "最多可提¥" + publicData.showPrice(amount, 1000)
								}
							
							}
						
						} else {
							amountPlaceholder += '0.00'
						}
					}
					this.placeholder = amountPlaceholder
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
				
			
			},
			getBankList() {
				//获取银行卡列表
				utils.postRequest("/md/user-bank/userBankListByUserId", {
					userId: this.userId
				})
				.then(res => {
					console.log(res, '银行卡')
					if (res.retCode == "0000000") {
						var brandArr = res.rspBody;
						this.brandArr = brandArr;
						if (this.brandAccountInfo) {
							var findIndex = brandArr.findIndex(item => {
								return item.id == this.brandAccountInfo.id
							})
							if (findIndex < 0) {
								this.brandAccountInfo = res.rspBody.length > 0 ? res.rspBody[0] : null;
							}
						} else {
							this.brandAccountInfo = res.rspBody.length > 0 ? res.rspBody[0] : null;
						}
						
					}
					
				})
			},
			showPopup() {
				var errMsg = this.errMsg;
				var titleText = errMsg ? errMsg : '提现失败';
				this.toastMsg = this.topUpStatus ? '提现成功' : titleText;
			    this.$refs.hintPopup.open()
				setTimeout(()=>{
					this.$refs.hintPopup.close()
				}, 3000)
			},
			showCountPopUp() {
				this.$refs.typePopup.open();
			},
			closePopUp() {
				this.$refs.typePopup.close();
			},
			switchIndex(index) {
				this.isWx = false;
				var brandArr = this.brandArr;
				this.brandAccountInfo = brandArr[index];
				this.$refs.typePopup.close();
			},
			showBankAccount(bank) {
				var bankName = bank.accountName;
				var bankAccount = bank.account;
				return bankName + '(' + bankAccount.substring(bankAccount.length - 4) + ')';
			},
			addBand() {
				this.$refs.typePopup.close();
				uni.navigateTo({
					url: './addBand'
				})
			},
 			toBack() {
				uni.navigateBack();
			},
			confirm() {
				var userRole = this.userRole;
				console.log(this.withdrawalPrice, this.willDoPrice);
				var withdrawalPrice = parseFloat(this.withdrawalPrice);
				var willDoPrice = parseFloat(this.willDoPrice);
				
				//11是司机，21货主
				if (!withdrawalPrice) {
					uni.showToast({
						title: '请输入提现金额',
						icon: 'none'
					})
					return
				}
				
				if (willDoPrice <= 0) {
					uni.showToast({
						title: '提现余额不足',
						icon: 'none'
					})
				}
				
				if (withdrawalPrice > willDoPrice) {
					this.$refs.tipsPopup.open();
					return
				}
				
				
				if (this.isWx) {
					if (withdrawalPrice <= 0.3 || withdrawalPrice > 20000) {
						this.$refs.tipsPopup1.open();
						return;
					}
				}
				
				
				if (withdrawalPrice < 0.1) {
					uni.showToast({
						title: '提现金额不能少于1毛钱',
						icon: 'none'
					})
					return;
				}
				
				var isWx = this.isWx;
				var params = new Object();
				if (isWx) {
					params = {
						"amount": this.withdrawalPrice,
						"typeNum":userRole == 1 ? 11 : 21,
						payeeType: '微信零钱',
					}
				} else {
					var brandAccountInfo = this.brandAccountInfo;
					if (!brandAccountInfo) {
						uni.showToast({
							title: '请选择收款账户',
							icon: 'none'
						})
						return;
					}
					params = {
						"amount": this.withdrawalPrice,
						"typeNum":userRole == 1 ? 11 : 21,
						bankIdNo: brandAccountInfo.idNo,
						bankName: brandAccountInfo.accountName,
						bankAccountName: brandAccountInfo.bank,
						bankAccount: brandAccountInfo.account,
						bankPhone: brandAccountInfo.mobile,
						payeeType: '银行卡',
					}
				}
				
				uni.showLoading({
					title: '提现中'
				})
				utils.postRequest("/dw/order/withdraw", params).then(res => {
					uni.hideLoading();
					console.log(res, '提醒1')
					if (res.retCode == "0000000") {
						this.topUpStatus = true
						this.withdrawalPrice = "";
						this.$store.dispatch("getBalance");
						uni.$emit("refreshData_index");
						this.showPopup();
						this.getMarginVO();
					} else {
						this.topUpStatus = false;
						this.errMsg = res.retDesc;
						this.showPopup();
					}
				}).catch(err => {
					uni.hideLoading();
					this.topUpStatus = false
					this.showPopup();
				})
			},
			unBind(item) {
				//解绑银行卡
				var that = this;
				uni.showModal({
					title: '确定解绑吗',
					success: function(res) {
						if (res.confirm) {
							that.$refs.typePopup.close();
							uni.showLoading({
								title: '解绑中'
							})
							
							utils.postRequest("/md/user-bank/unbind/relation", {
								id: item.id,
								userId: that.userId,
								account: item.account,
								idNo: item.idNo,
							}).then(res => {
								uni.hideLoading()
								if (res.retCode == "0000000") {
									uni.showToast({
										title: '解绑成功',
										icon: 'success'
									})
									uni.$emit("refreshBank")
								} else {
									uni.showToast({
										title: res.retDesc,
										icon: 'none'
									})
								}
							}).catch(err => {
								uni.hideLoading()
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.withdrawal {
		min-height: 100vh;
		background-color: #FFF;
		overflow: hidden;
		.walletHead {
			width: 100vw;
			height: 276rpx;
			position: relative;
			z-index: 1;
			overflow: hidden;
			&::after {
				content: '';
				width: 140%;
				height: 276rpx;
				position: absolute;
				left: -20%;
				top: 0;
				z-index: 1;
				border-radius: 0 0 25% 25%;
				background: #4AA2F3;
			}
			.headBox {
				padding: 106rpx 40rpx 0 30rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 50rpx;
				text-align: center;
				position: relative;
				z-index: 2;
				.backIcon {
					width: 22rpx;
					height: 40rpx;
					position: absolute;
					left: 30rpx;
				}
			}
		}
		.withdrawalDetails {
			background: #FFFFFF;
			box-shadow: 0px 4rpx 16rpx 0px rgba(0,0,0,0.18);
			border-radius: 12rpx;
			margin: 0 32rpx;
			padding-top:40rpx;
			margin-top: -70rpx;
			position: relative;
			z-index: 2;
			.withdrawalInputBox + .withdrawalInputBox {
				margin-top: 34rpx;
			}
			.withdrawalInputBox {
				margin: 0 38rpx;
				display: flex;
				align-items: center;
				.title {
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
					margin-right:34rpx;
				}
				.priceInput {
					flex: 1;
					padding: 0 24rpx;
					height: 56rpx;
					border-radius: 12rpx;
					border: 2rpx solid rgba(170, 170, 170, 0.67);
				}
				.userAccount {
					flex: 1;
					padding: 0 24rpx;
					height: 56rpx;
					border-radius: 12rpx;
					border: 2rpx solid rgba(170, 170, 170, 0.67);
					display: flex;
					justify-content: space-between;
					align-items: center;
					.accountMsg {
						display: flex;
						align-items: center;
						.accountIcon {
							width: 32rpx;
							height: 26rpx;
							margin-right:10rpx
						}
						.msg {
							font-size: 28rpx;
							color: #333333;
							line-height: 40rpx;
						}
					}
					.icon_right {
						width: 24rpx;
						height: 24rpx;
					}
				}
			}
			.servicePriceBox {
				margin: 32rpx 38rpx 0 38rpx;
				padding: 34rpx 0 28rpx 0;
				border-top: 2rpx solid #EAEBEE;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title {
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
				}
				.price {
					font-size: 32rpx;
					color: #F29347;
					line-height: 44rpx;
				}
			}
		}
		.withdrawalHint {
			margin: 20rpx 70rpx;
			font-size: 26rpx;
			color: #AAAAAA;
			line-height: 36rpx;
		}
		.confirmBtn {
			margin: 0 32rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: #4AA2F3;
			border-radius: 48rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
		.hintToast {
			min-width: 450rpx;
			background-color: rgba(51, 51, 51, 0.9);
			padding: 60rpx 0 40rpx 0;
			.toastIcon {
				width: 64rpx;
				height: 64rpx;
				display: block;
				margin:0 auto;
			}
			.toastMsg {
				margin-top:36rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				line-height: 40rpx;
				text-align: center;
			}
		}
	}
	.popupContent {
		background-color: #FFFFFF;
		overflow: hidden;
		border-radius: 13rpx;
		width: calc(100vw - 160rpx);
		
		.title {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 40rpx 0 48rpx;
			font-size: 36rpx;
			color: #333333;
			font-weight: 500;
		}
		.content {
			height: 200rpx;
			width: 416rpx;
			text-align: center;
			line-height: 44rpx;
			margin: 0 auto;
			color: #777777;
			font-size: 32rpx;
			
		}
	}
	.bottomPopupBox {
		background: #FFFFFF;
		border-radius: 36rpx 36rpx 0px 0px;
		overflow: hidden;
		.popupHead {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 36rpx;
			.title {
				height: 110rpx;
				line-height: 110rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}
			.cancelIconBox {
				height: 110rpx;
				width: 110rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.cancelIcon {
					width:18rpx;
					height: 18rpx;
				}
			}
		}
		.popupBtnGroup {
			padding: 24rpx 36rpx;
			.comfirmBtn {
				height: 96rpx;
				line-height: 96rpx;
				background: #4AA2F3;
				border-radius: 48rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
	.wxContent {
		padding: 0 36rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #D9D9D9;
		height: 120rpx;
		.countType {
			width: 180rpx;
		}
		.wxCountContent {
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
		}
		.countContent {
			flex: 1;
		}
	}
	.listWhole {
		padding: 0 36rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #D9D9D9;
		border-bottom: 1px solid #D9D9D9;
		.countType {
			width: 180rpx;
		}
		.countContent {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width:calc(100vw - 252rpx);
			max-height: 50vh;
			.list {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				width:calc(100vw - 252rpx);
				padding: 28rpx 0;
				border-bottom: 1px solid #D9D9D9;
				&:last-child {
					border-bottom: none;
				}
				.name {
					flex: 1;
					display: flex;
					flex-direction: column;
					.sub {
						font-size: 26rpx;
						color: #AAAAAA;
						padding-top: 10rpx;
					}
				}
				.opt {
					width: 100rpx;
					color: #333333;
					font-size: 30rpx;
				}
				
			}
		}
	}
	.wxIcon {
		width: 46rpx;
	}
	.btnWx {
		display: flex;
		flex-direction: row;
		padding: 0 32rpx 20rpx;
		.btnItem {
			flex: 1;
			padding: 20rpx 0;
			border-radius: 12rpx;
			font-size: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			&.cancel {
				background-color: #CCCCCC;
				color: #FFFFFF;
				margin-right: 32rpx;
			}
			&.confirm {
				background-color: #4AA2F3;
				color: #FFFFFF;
			}
		}
	}
</style>
