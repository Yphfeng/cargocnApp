<template>
	<view class="assignedDriver">
		<view class="headSearch">
			<view class="searchBox">
				<input
					class="searchInput"
					type="text" v-model="searchVal"
					placeholder="车牌号搜索"
					placeholder-style="font-size: 26rpx; color:#919191;"
					confirm-type="send"
					maxlength="11"
					@confirm="searchDriver()"/>
				<image class="searchIcon" src="../../../static/images/goodsDelivery/assignedSearch.png" @click="searchDriver()"></image>
			</view>
		</view>
		<view class="driverDetails" v-if="driverInfo" style="padding-top: 20rpx;">
			
			<view class="carBox">
				<view class="mainTitle">{{driverList && driverList.length > 0 ? '选择车牌号' : ''}}</view>
				<view class="carList" v-for="(item, vIndex) in driverList" :key="vIndex" @click="chooseVehicle(item)">
					<view class="defaultCheck" v-if="!item.checkedFlag"></view>
					<image class="checkedDriverCar" src="../../../static/images/goodsDelivery/checkedDriverCar.png" v-if="item.checkedFlag"></image>
					<view class="carNumber">{{item.plateNo}}</view>
				</view>
			</view>
		
			<view class="driverBox">
				<view class="avatar"><image class="userImage" :src="driverInfo.avatar ? driverInfo.avatar  : '../../../static/images/goodsDelivery/shipUserLogo.png'"></image></view>
				<view class="driverContent">
					<view class="name">{{driverInfo.plateNo ? driverInfo.userName : driverInfo.mobile}}</view>
					<!-- <view class="msg">卡友号：{{driverInfo.userCode}}</view> -->
				</view>
			</view>
			<view class="carBox">
				<view class="mainTitle">{{vehicleList && vehicleList.length > 0 ? '选择司机' : '该司机未绑定车辆，不可指派'}}</view>
				<view class="carList" v-for="(item, vIndex) in vehicleList" :key="vIndex" @click="chooseCar(item)">
					<view class="defaultCheck" v-if="!item.checkedFlag"></view>
					<image class="checkedDriverCar" src="../../../static/images/goodsDelivery/checkedDriverCar.png" v-if="item.checkedFlag"></image>
					<view class="carNumber">{{item.userName || item.mobile}}</view>
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
				driverList: [],
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
			async searchDriver() { // 搜索司机
				if(!this.searchVal) return false;
				uni.showLoading({
					title: '搜索中'
				})
				var searchVal = this.trimAll(this.searchVal);
				let params = { plateNo: searchVal };
				console.log('司机查询参数', params);
				let that = this;
				try{
					var res = await utils.postRequest('/td/circuit/driver/order/detail/select/car', params)
					console.log('车辆数据', res);
					if(res.retCode != '0000000') {
						that.driverInfo = '';
						that.vehicleList = [];
						that.bankList = [];
						that.searchNoData = true;
						uni.hideLoading()
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
						return;
					}
					var vehicleList = res.rspBody.vehicleList;
					if (!vehicleList || vehicleList.length < 1) {
						that.driverInfo = '';
						that.vehicleList = [];
						that.bankList = [];
						that.searchNoData = true;
						uni.hideLoading()
						return;
					}
					that.searchNoData = false;
					
					let rspBody = res.rspBody.vehicleList;
					rspBody[0].checkedFlag = true;
					that.driverList = rspBody;
					
					that.driverInfo = rspBody[0];
					//车辆查司机
					var response = await utils.postRequest("/td/circuit/driver/order/detail/by/car", {id: rspBody[0].id});
					console.log('司机数据', response);
					if (response.retCode != "0000000") {
						that.vehicleList = [];
						that.bankList = [];
						uni.hideLoading()
						uni.showToast({
							title: response.retDesc,
							icon: 'none'
						})
						return;
					}
					var driverRsp = response.rspBody;
					if (!driverRsp.driverList) {
						// that.driverInfo = '';
						that.vehicleList = [];
						that.bankList = [];
						uni.hideLoading()
						return;
					}
					var driverList = response.rspBody.driverList;
					if (!driverList || driverList.length < 1) {
						// that.driverInfo = '';
						that.vehicleList = [];
						that.bankList = [];
						uni.hideLoading()
						return;
					};
					driverList.forEach(item => {
						item.id = item.userId
					})
					driverList[0].checkedFlag = true;
					that.vehicleList = driverList;
					
					//司机查银行卡
					let rsp = driverList[0];
					var result = await utils.postRequest("/td/circuit/driver/bank/detail", {userId: rsp.userId})
					console.log('银行卡集合',result);
					if (result.retCode != "0000000") {
						that.bankList = [];
						uni.hideLoading()
						uni.showToast({
							title: result.retDesc,
							icon: 'none'
						})
						return;
					}
					let bankList = result.rspBody.bankList;
					if(that.needInvoiceFlag == 1) { // 不需要开运输增值发票的货源，不处理银行卡类字段
						that.bankList = bankList && bankList.length> 0 ? bankList : [];
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
				}catch(e){
					//TODO handle the exception
					uni.hideLoading()
				}
				
			},
			async chooseVehicle(item) {
				let that = this;
				//选择车牌号
				if(this.driverList.length == 1) return false;
				for(let i in this.driverList) {
					if(item.id == this.driverList[i].id) {
						this.driverList[i].checkedFlag = true;
					}else {
						this.driverList[i].checkedFlag = false;
					}
				}
				that.driverInfo = item;
				//车辆查司机
				var response = await utils.postRequest("/td/circuit/driver/order/detail/by/car", {id: item.id});
				console.log('司机数据', response);
				if (response.retCode != "0000000") {
					that.vehicleList = [];
					that.bankList = [];
					that.searchNoData = true;
					uni.hideLoading()
					uni.showToast({
						title: response.retDesc,
						icon: 'none'
					})
					return;
				}
				var driverListArr = response.rspBody.driverList;
				var driverList = [];
				driverListArr.forEach(atem => {
					if (atem && atem.identityVerify == 1) {
						driverList.push(atem);
					}
				})
				if (!driverList || driverList.length < 1) {
					that.driverInfo = '';
					that.vehicleList = [];
					that.bankList = [];
					that.searchNoData = true;
					uni.hideLoading()
					uni.showToast({
						title: response.retDesc,
						icon: 'none'
					})
					return;
				};
				driverList.forEach(item => {
					if(item) {
						item.id = item.userId
					}
				})
				driverList[0].checkedFlag = true;
				that.vehicleList = driverList;
				
				//司机查银行卡
				let rsp = driverList[0];
				var result = await utils.postRequest("/td/circuit/driver/bank/detail", {userId: rsp.userId})
				console.log('银行卡集合',result);
				if (result.retCode != "0000000") {
					that.bankList = [];
					that.searchNoData = true;
					uni.hideLoading()
					uni.showToast({
						title: result.retDesc,
						icon: 'none'
					})
					return;
				}
				let bankList = result.rspBody.bankList;
				if(that.needInvoiceFlag == 1) { // 不需要开运输增值发票的货源，不处理银行卡类字段
					that.bankList = bankList && bankList.length> 0 ? bankList : [];
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
			},
			async chooseCar(item) { // 选择司机
				let that = this;
				if(this.vehicleList.length == 1) return false;
				for(let i in this.vehicleList) {
					if(item.userId == this.vehicleList[i].userId) {
						this.vehicleList[i].checkedFlag = true;
					}else {
						this.vehicleList[i].checkedFlag = false;
					}
				}
				//切换银行卡
				let rsp = item;
				var result = await utils.postRequest("/td/circuit/driver/bank/detail", {userId: rsp.userId})
				console.log('银行卡集合',result);
				if (result.retCode != "0000000") {
					that.bankList = [];
					that.searchNoData = true;
					uni.hideLoading()
					uni.showToast({
						title: result.retDesc,
						icon: 'none'
					})
					return;
				}
				let bankList = result.rspBody.bankList;
				if(that.needInvoiceFlag == 1) { // 不需要开运输增值发票的货源，不处理银行卡类字段
					that.bankList = bankList && bankList.length> 0 ? bankList : [];
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
						title: '请选择车辆',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				var vehicleList = this.vehicleList;
				var findItem = vehicleList.find(item => {
					return item.checkedFlag == true
				})
				if (!findItem) {
					uni.showToast({
						title: '请选择司机',
						icon: 'none',
						duration: 3000
					})
					return;
				}
				if(!findItem.identityVerify) {
					uni.showToast({
						title: '当前司机未认证身份证，暂不可接单',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!findItem.driverVerify) {
					uni.showToast({
						title: '当前司机未认证驾驶证，暂不可接单',
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
						title: '请选择司机',
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
					driverInfo: carInfo,
					carInfo: this.driverInfo,
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
