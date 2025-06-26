<template>
	<view class="assignedDriver">
		<view class="headSearch">
			<view class="searchBox">
				<input
					class="searchInput"
					type="number" v-model="searchVal"
					placeholder="手机号搜索"
					placeholder-style="font-size: 26rpx; color:#919191;"
					confirm-type="send"
					maxlength="11"
					@confirm="searchDriver()"/>
				<image class="searchIcon" src="../../../static/images/goodsDelivery/assignedSearch.png" @click="searchDriver()"></image>
			</view>
		</view>
		
		<view class="driverDetails" v-if="driverInfo">
			<view class="driverBox">
				<view class="avatar"><image class="userImage" :src="driverInfo.avatar ? driverInfo.avatar  : '../../../static/images/goodsDelivery/shipUserLogo.png'"></image></view>
				<view class="driverContent">
					<view class="name">{{driverInfo.userName ? driverInfo.userName : driverInfo.mobile}}</view>
					<view class="msg">卡友号：{{driverInfo.userCode}}</view>
				</view>
			</view>
			<view class="carBox">
				<view class="mainTitle">{{vehicleList && vehicleList.length > 0 ? '选择车辆' : '该司机未绑定车辆，不可指派'}}</view>
				<view class="carList" v-for="(item, vIndex) in vehicleList" :key="vIndex" @click="chooseCar(item)">
					<view class="defaultCheck" v-if="!item.checkedFlag"></view>
					<image class="checkedDriverCar" src="../../../static/images/goodsDelivery/checkedDriverCar.png" v-if="item.checkedFlag"></image>
					<view class="carNumber">{{item.plateNo}}</view>
				</view>
			</view>
		</view>
		
		<view class="bankDetails" v-if="driverInfo && needInvoiceFlag == 1">
			<view class="mainTitle">{{bankList && bankList.length > 0 ? '选择银行卡' : '该司机未绑定银行卡，不可指派'}}</view>
			<view class="bankList" v-for="(item, bankIndex) in bankList" :key="bankIndex" :class="item.listBc.bcImage" @click="chooseBack(item)">
				<view class="leftCheckBox" :style="item.checkedFlag ? item.listBc.bcColor : 'background: #E4E8ED;'">
					<view class="defaultCheck" v-if="!item.checkedFlag"></view>
					<image class="checkedDriverCar" :src="item.listBc.checkedIcon" v-if="item.checkedFlag"></image>
				</view>
				<view class="rightContent">
					<view class="bankName">{{item.bank}}  {{checkName(item.accountName)}}</view>
					<view class="bankType"></view>
					<view class="bankNum">{{item.account}}</view>
				</view>
			</view>
		</view>
		
		<view class="loadingBox" v-show="searchNoData">
			<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
		</view>
		<view class="loadingBox" v-show="searchNoData">
			暂无数据～
		</view>
		
		<view class="btnGroup">
			<view class="cancelBtn" @click="toBack()">取消</view>
			<view class="confirmBtn" @click="toAssigned()">确定指派</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				searchVal: '',
				rspBody: '',
				driverInfo: '',
				vehicleList: [],
				bankList: [],
				backBcList: [{
					bcImage: 'bankBc1',
					bcColor: 'background-color: #0171F9',
					checkedIcon: '../../../static/images/goodsDelivery/checkedBankBlue.png'
				}, {
					bcImage: 'bankBc3',
					bcColor: 'background-color: #FC2D2D',
					checkedIcon: '../../../static/images/goodsDelivery/checkedBankRed.png'
				}, {
					bcImage: 'bankBc2',
					bcColor: 'background-color: #333',
					checkedIcon: '../../../static/images/goodsDelivery/checkedBankBlack.png'
				}],
				searchNoData: false,
				needInvoiceFlag: ''
			};
		},
		onLoad(option) {
			this.needInvoiceFlag = option.needInvoiceFlag;
		},
		methods: {
			checkName(msg) {
				if (!msg) return "";
				if (msg.length < 3) {
					let fontMsg = msg.substring(0,1)
					return fontMsg + '*'
				} 
				
				let fontMsg = msg.substring(0,1) + '*' + msg.substring(msg.length - 1, msg.length)
				return fontMsg;
			},
			trimAll(ele){
				ele = ele.toString();
			    return ele.split(/[\t\r\f\n\s]*/g).join('');
			},
			searchDriver() { // 搜索司机
				if(!this.searchVal || this.searchVal.length < 11) return false;
				uni.showLoading({
					title: '搜索中'
				})
				var searchVal = this.trimAll(this.searchVal);
				let params = { mobile: searchVal };
				console.log('司机查询参数', params);
				let that = this;
				utils.postRequest('/td/circuit/driver/order/detail', params)
				.then(res=>{
					console.log('司机数据', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody ? res.rspBody : '';
						console.log('数据集合', rspBody);
						if(!rspBody) {
							that.driverInfo = '';
							that.vehicleList = [];
							that.bankList = [];
							that.searchNoData = true;
							uni.hideLoading()
							return false;
						}
						that.driverInfo = rspBody.userInfo ? rspBody.userInfo : '';
						that.searchNoData = that.driverInfo && that.driverInfo.id ? false : true;
						
						that.vehicleList = rspBody.vehicleList && rspBody.vehicleList.length> 0 ? rspBody.vehicleList : [];
						if(that.vehicleList && that.vehicleList.length > 0) {
							for(let i in that.vehicleList) {
								that.vehicleList[i].checkedFlag = false;
							}
							if(that.vehicleList.length == 1) {
								that.vehicleList[0].checkedFlag = true;
							}
						}
						console.log('车辆', that.bankList);
						
						if(that.needInvoiceFlag == 1) { // 不需要开运输增值发票的货源，不处理银行卡类字段
							that.bankList = rspBody.bankList && rspBody.bankList.length> 0 ? rspBody.bankList : [];
							if(that.bankList && that.bankList.length > 0) {
								for(let b in that.bankList) {
									that.bankList[b].checkedFlag = false;
									let bcKey = Number(b) % 3;
									that.bankList[b].listBc = that.backBcList[bcKey];
								}
								if(that.bankList.length == 1) {
									that.bankList[0].checkedFlag = true;
								}
							}
							console.log('银行卡', that.bankList);
						}
						uni.hideLoading()
					}else {
						uni.hideLoading()
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err)
					uni.hideLoading()
				})
			},
			chooseCar(item) { // 选择车辆
				if(this.vehicleList.length == 1) return false;
				for(let i in this.vehicleList) {
					if(item.id == this.vehicleList[i].id) {
						this.vehicleList[i].checkedFlag = true;
					}else {
						this.vehicleList[i].checkedFlag = false;
					}
				}
				this.$forceUpdate();
			},
			chooseBack(item) { // 选择银行卡
				if(this.bankList.length == 1) return false;
				for(let i in this.bankList) {
					if(item.id == this.bankList[i].id) {
						this.bankList[i].checkedFlag = true;
					}else {
						this.bankList[i].checkedFlag = false;
					}
				}
				this.$forceUpdate();
			},
			toBack() { // 返回上一页
				if(!utils.btnRepeat()) return false; // 防抖
				uni.navigateBack();
			},
			toAssigned() { // 确定指派
				if(!utils.btnRepeat()) return false; // 防抖
				if(!this.driverInfo.id) {
					uni.showToast({
						title: '请选择司机',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.driverInfo.identityVerify) {
					uni.showToast({
						title: '当前司机未认证身份证，暂不可接单',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.driverInfo.driverVerify) {
					uni.showToast({
						title: '当前司机未认证驾驶证，暂不可接单',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.vehicleList.length == 0) {
					uni.showToast({
						title: '该司机未上传车辆信息',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				let carInfo = '';
				for(let i in this.vehicleList) {
					if(this.vehicleList[i].checkedFlag) {
						carInfo = this.vehicleList[i];
					}
				}
				if(!carInfo) {
					uni.showToast({
						title: '请选择司机车辆',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				let bankInfo = '';
				if(this.needInvoiceFlag == 1) {
					if(this.bankList.length == 0) {
						uni.showToast({
							title: '该司机未上传银行卡信息',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
					for(let i in this.bankList) {
						if(this.bankList[i].checkedFlag) {
							bankInfo = this.bankList[i];
						}
					}
					console.log();
					if(!bankInfo) {
						uni.showToast({
							title: '请选择司机银行卡',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
				}
				getApp().globalData.assignedDriverObj = {
					driverInfo: this.driverInfo,
					carInfo: carInfo,
					bankInfo: this.needInvoiceFlag == 1 ? bankInfo : undefined
				}
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.assignedDriver {
		min-height: 100vh;
		box-sizing: border-box;
		padding-bottom: 140rpx;
		.headSearch {
			padding: 30rpx 32rpx;
			background-color: #FFF;
			.searchBox {
				height: 70rpx;
				background: #F1F1F1;
				border-radius: 37rpx;
				padding: 0 32rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.searchInput {
					font-size: 26rpx;
					color:#333;
					flex: 1;
				}
				.searchIcon {
					height: 32rpx;
					width: 32rpx;
					margin-left: 32rpx;
					flex-shrink: 0;
				}
			}
		}
		.driverDetails {
			padding: 0 32rpx;
			margin-top: 16rpx;
			background-color: #FFF;
			.driverBox {
				display: flex;
				align-items: center;
				padding: 32rpx 0;
				.avatar {
					width: 86rpx;
					height: 86rpx;
					border-radius: 100%;
					flex-shrink: 0;
					.userImage {
						width: 86rpx;
						height: 86rpx;
						border-radius: 100%;
					}
				}
				.driverContent {
					flex: 1;
					padding-left: 18rpx;
					.name {
						font-size: 28rpx;
						color: #333333;
						line-height: 40rpx;
					}
					.msg {
						font-size: 24rpx;
						color: #777777;
						line-height: 34rpx;
						margin-top: 4rpx;
					}
				}
			}
			.carBox {
				padding-bottom: 12rpx;
				.carList + .carList {
					border-top: 2rpx solid #F2F3F3;
				}
				.carList {
					display: flex;
					align-items: center;
					padding: 22rpx 0;
					
					.carNumber {
						font-size: 28rpx;
						color: #333333;
						line-height: 40rpx;
						padding-left: 60rpx;
					}
				}
			}
		}
		.mainTitle {
			font-size: 28rpx;
			color: #333333;
			line-height: 40rpx;
		}
		.defaultCheck {
			width: 36rpx;
			height: 36rpx;
			box-sizing: border-box;
			border: 2rpx solid #707071;
			border-radius: 100%;
			flex-shrink: 0;
		}
		.checkedDriverCar {
			width: 36rpx;
			height: 36rpx;
			flex-shrink: 0;
		}
		.bankDetails {
			background-color: #FFF;
			margin-top: 16rpx;
			padding: 20rpx 32rpx;
			.bankBc1 {
				background-image: url('../../../static/images/goodsDelivery/bankBc1.png');
			}
			.bankBc2 {
				background-image: url('../../../static/images/goodsDelivery/bankBc2.png');
			}
			.bankBc3 {
				background-image: url('../../../static/images/goodsDelivery/bankBc3.png');
			}
			.bankList {
				margin-top: 24rpx;
				display: flex;
				border-radius: 8rpx;
				overflow: hidden;
				background-repeat: no-repeat;
				background-size: 100% 100%;
				.leftCheckBox {
					width: 96rpx;
					height: 228rpx;
					flex-shrink: 0;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.rightContent {
					flex: 1;
					height: 228rpx;
					box-sizing: border-box;
					padding: 34rpx 32rpx;
					.bankName {
						font-size: 32rpx;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 44rpx;
					}
					.bankType {
						font-size: 28rpx;
						color: #BBD1E3;
						height: 40rpx;
						line-height: 40rpx;
						margin: 2rpx 0 16rpx 0;
					}
					.bankNum {
						font-size: 32rpx;
						color: #FFFFFF;
						line-height: 44rpx;
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
		.loadingBox {
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 1.5s linear infinite;
		        animation: rotating 1.5s linear infinite;
			}
			.noDataIcon {
				width: 244rpx;
				height: 246rpx;
				margin-top:50rpx;
			}
		}
	}
</style>
