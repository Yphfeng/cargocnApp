<template>
	<view class="assignedDetails">
		<view class="driverDetailsBox">
			<view class="detailsList" @click="jumpToChooseDriver()">
				<view class="title">选择司机</view>
				<image class="arrowIcon" v-if="!driverInfo || !driverInfo.driverInfo.id" src="../../../static/images/goodsDelivery/icon_right.png"></image>
				<view class="hint" v-if="driverInfo && driverInfo.driverInfo.id">{{driverInfo.driverInfo.userName}}</view>
			</view>
			<view class="detailsList" @click="jumpToChoosePlatNo()">
				<view class="title">车辆</view>
				<image class="arrowIcon" v-if="!driverInfo || !driverInfo.driverInfo.id" src="../../../static/images/goodsDelivery/icon_right.png"></image>
				<view class="hint" v-if="driverInfo && driverInfo.driverInfo.id">{{driverInfo.carInfo.plateNo}}</view>
			</view>
			<view class="detailsList" v-if="needInvoiceFlag == 1">
				<view class="title">收款人</view>
				<view class="bankDetail" v-if="driverInfo && driverInfo.driverInfo.id">
					<view class="msg">{{driverInfo.bankInfo.accountName}}</view>
					<view class="msg">{{driverInfo.bankInfo.mobile}}</view>
					<view class="msg">{{driverInfo.bankInfo.bank}}{{driverInfo.bankInfo.account}}</view>
				</view>
				<view class="hint" v-if="!driverInfo || !driverInfo.driverInfo.id">待选择司机</view>
			</view>
		</view>
		<view class="btnGroup">
			<view class="cancelBtn" @click="toBack()">取消</view>
			<view class="confirmBtn" @click="quoteFixedSend()">确定指派</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				enterpriseName: '',
				driverInfo: '',
				needInvoiceFlag: '',
				orderSid: '',
				multiTruck: ''
			};
		},
		onLoad(option) {
			this.needInvoiceFlag = option.needInvoiceFlag ? option.needInvoiceFlag : '';
			this.orderSid = option.orderNumber ? option.orderNumber : '';
			this.multiTruck = option.multiTruck ? option.multiTruck : '';
			this.enterpriseName = option.enterpriseName || "";
		},
		onShow() {
			this.driverInfo = getApp().globalData.assignedDriverObj;
			console.log('选择的司机', this.driverInfo);
		},
		methods: {
			jumpToChooseDriver() {
				uni.navigateTo({
					url: './assignedDriver?needInvoiceFlag=' + this.needInvoiceFlag
				})
			},
			jumpToChoosePlatNo() {
				uni.navigateTo({
					url: './assignedPlateNo?needInvoiceFlag=' + this.needInvoiceFlag
				})
			},
			toBack() { // 返回上一页
				if(!utils.btnRepeat()) return false; // 防抖
				uni.navigateBack();
			},
			async quoteFixedSend() { // 指派司机
				if(!utils.btnRepeat()) return false; // 防抖
				if(!this.driverInfo || !this.driverInfo.driverInfo.id) {
					uni.showToast({
						title: '请选择司机后再指派',
						icon: 'none',
						duration: 3000
					})
					return false
				};
				//网络货运判断收款人是否一致
				var needInvoiceFlag = this.needInvoiceFlag;
				console.log(needInvoiceFlag, "needInvoiceFlag")
				if (needInvoiceFlag == 1) {
				  //网络货运判断收款人和银行卡是否一致
				  var userInfo = uni.getStorageSync("userInfo");
				  var driverId = JSON.parse(userInfo).attrs.driverId;
				  var plateNo = this.driverInfo.carInfo.plateNo;
				  var result  = await utils.postRequest("/yh/vehicle/select/vehicle/detail", {
					driverId: driverId,
					plateNo: plateNo
				  })
				  if (result.retCode == "0000000") {
					var ownerName = result.rspBody.ownerName;
					if (ownerName == this.enterpriseName) {
					  uni.showToast({
						title: '该车辆为货源发布托运公司车辆，不可指派！',
						icon: 'none'
					  })
					  return;
					}
				  } else {
					wx.showToast({
					  title: result.retDesc,
					  icon: 'none'
					})
					return;
				  }
				}
				var app = getApp();
				if(app.globalData.consignorSocketTask) {
					app.globalData.consignorSocketTask.close();
				}
				uni.showLoading({
					title: '加载中'
				})
				let note = {
					ext1: this.driverInfo.carInfo.ext1,
					ext2: this.driverInfo.carInfo.vehicleLength, 
					ext3: this.driverInfo.carInfo.model,
				}
				let params = {
					// longitude: params.longitude,
					// latitude: params.latitude,
					// platformPriceFlag: params.platformPriceFlag,
					// emptyPriceFlag: params.emptyPriceFlag,
					multiTruck: this.multiTruck,
					driverSid: this.driverInfo.driverInfo.id,
					vehicleNo: this.driverInfo.carInfo.plateNo,
					orderSid: this.orderSid,
					note: note ? JSON.stringify(note) : note,
					idNo: this.driverInfo.driverInfo.idNo,
					payeeBankAccount: this.needInvoiceFlag == 1 ? this.driverInfo.bankInfo.account : undefined,
					payeeBank: this.needInvoiceFlag == 1 ? this.driverInfo.bankInfo.bank : undefined,
					payeeName: this.needInvoiceFlag == 1 ? this.driverInfo.bankInfo.accountName : undefined,
					payeeMobile: this.needInvoiceFlag == 1 ? this.driverInfo.bankInfo.mobile : undefined,
					payeeIdNo: this.needInvoiceFlag == 1 ? this.driverInfo.bankInfo.idNo : undefined,
				};
				console.log('指派参数', params);
				let that = this;
				utils.postRequest('/td/circuit/appoint/order', params)
				.then(res=>{
					console.log('指派结果', res);
					if(res.retCode == '0000000') {
						uni.hideLoading();
						uni.showToast({
							title: '您已成功指派',
							icon: 'success',
							duration: 3000
						})
						setTimeout(() => {
							uni.navigateBack();
							uni.$emit("refreshData_orderDetails");
						}, 2000);
					}else {
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 5000
						})
					}
				})
				.catch(err=>{
					console.log(err)
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.assignedDetails {
		height: 100vh;
		.driverDetailsBox {
			margin-top: 16rpx;
			background-color: #FFF;
			padding-left: 40rpx;
			.detailsList + .detailsList {
				border-top: 2rpx solid #F2F3F3;
			}
			.detailsList {
				padding: 32rpx 42rpx 32rpx 0;
				display: flex;
				justify-content: space-between;
				.title {
					font-size: 28rpx;
					color: #222222;
					line-height: 40rpx;
					flex-shrink: 0;
				}
				.hint {
					font-size: 28rpx;
					color: #777777;
					line-height: 40rpx;
				}
				.arrowIcon {
					width:28rpx;
					height: 28rpx;
					margin-top: 6rpx
				}
				.bankDetail {
					flex: 1;
					padding-left: 32rpx;
					box-sizing: border-box;
					.msg + .msg {
						margin-top: 6rpx;
					}
					.msg {
						font-size: 28rpx;
						color: #222222;
						line-height: 40rpx;
						text-align: right;
					}
				}
			}
		}
		.btnGroup {
			position: fixed;
			bottom: 32rpx;
			padding: 0 54rpx;
			box-sizing: border-box;
			width: 100vw;
			display: flex;
			justify-content: space-between;
			.cancelBtn {
				box-sizing: border-box;
				border: 2rpx solid  #0171F9;
				border-radius: 44rpx;
				width: 296rpx;
				height: 88rpx;
				line-height: 88rpx;
				background-color: #FFF;
				font-size: 36rpx;
				font-weight: 500;
				color: #0171F9;
				text-align: center;
			}
			.confirmBtn {
				border-radius: 44rpx;
				width: 296rpx;
				height: 88rpx;
				line-height: 88rpx;
				background-color: #0171F9;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFF;
				text-align: center;
				box-shadow: 0px 4rpx 8rpx 0px rgba(1, 113, 249, 0.37);
			}
		}
	}
</style>
