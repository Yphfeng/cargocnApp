<template>
	<view class="all">
		<view class="input-box">
			<input class="input-content" type="text" maxlength="30" :value="inputManualCode" @input="inputCode" confirm-type="search" @blur="reference" placeholder="手动输入条码" />
			<view class="" @click="goScan">
				<image class="manualScan" src="/static/images/goodsDelivery/manualScan.png" mode=""></image>
			</view>
		</view>
		<view class="status-box">
			<view class="status-tips">选择你当前运输的类型</view>
			<view class="status-content">
				<view class="status-child" :class="statusId == item.id?'status-select':''" v-for="(item, index) in statusArr" :key="index" @click="switchStatus(item.id)">{{item.statusText}}</view>
			</view>
		</view>
		<view class="user-box">
			<view class="">
				<view class="user-child">
					<view class="user-title">操作员</view>
					<view class="user-info">{{userInfo.userName}} {{userInfo.mobile}}</view>
				</view>
				<view class="user-child">
					<view class="user-title">时间</view>
					<view class="user-info">{{showTime()}}</view>
				</view>
				<view class="user-child">
					<view class="user-title">地址</view>
					<view class="user-info">{{addressText}}</view>
				</view>
			</view>
			<view class="">
				<image class="userInfo-img" src="/static/images/goodsDelivery/userInfo.png" mode=""></image>
			</view>
		</view>
		
		<view class="table-box">
			<view class="table-child" v-for="(item, index) in tableArr">
				<view class="table-title">
					<view class="table-left">
						<view class="">{{item.surfaceNumber}}</view>
						<view class="table-num">（扫描成功{{item.sumNum}}件）</view>
					</view>
					<view class="table-right" :class="!item.isDelete?'table-backgroud':''" @click="deleteEvent(index)">删除</view>
				</view>
				<view class="table-all">
					<view class="table-head">
						<view class="head-child">货物</view>
						<view class="head-child">数量</view>
						<view class="head-child">标签数</view>
						<view class="head-child">扫描成功数</view>
					</view>
					<view class="table-content" :class="atem.isSelect?'table-row':''" v-for="(atem, idx) in item.goodsObj" @click="selectEvent(index, idx)">
						<view class="content-child">{{atem.gdName}}</view>
						<view class="content-child">{{atem.gdNumber}}</view>
						<view class="content-child">{{atem.shouldPrintCount}}</view>
						<view class="content-child">{{atem.sucNum}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-box" @click="scanEvent">确定</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	var wxScanModule = uni.requireNativePlugin("WxScanModule");
	export default {
		data(){
			return {
				statusArr: [],
				transportIdArr: [],
				tableArr: [],
				surfaceNumberArr: [],
				userInfo: {},
				addressText: '',
				lat: 0,
				lng: 0,
				province: '',
				city: '',
				county: '',
				address: '',
				statusId: 0,
				inputManualCode: '',
				userRole: 0,
			}
		},
		onLoad(options) {
			this.getStatusList();
			this.transportIdArr = JSON.parse(options.transportIdArr);
			this.surfaceNumberArr = JSON.parse(options.surfaceNumberArr);
			this.transportIdArr.map((val, index)=>{
				this.getFindVO(val, index);
			});
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			this.userRole = uni.getStorageSync("userRole");
			console.log(this.userInfo);
			// this.getStatusList();
			this.getUserLocation();
		},
		methods: {
			inputCode(e){
				this.inputManualCode = e.detail.value.toLocaleUpperCase();
			},
			reference(){
				let that = this;
				if(!that.inputManualCode){
					uni.showToast({
						title: '请输入条形码',
						icon: 'none'
					})
					return
				}
				if(that.inputManualCode.length <18){
					uni.showToast({
						title: '请输入正确的条形码',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '请稍后',
					mask: true,
				})
				utils.postRequest('/ld/ldebarcode/verify', {
					userId: that.userInfo.userId,
					serviceType: that.userRole == 1 ? 10 : 20,
					barCode: that.inputManualCode,
				}).then(res => {
					uni.hideLoading();
					console.log('getCheckData', res)
					if (res.retCode == "0000000") {
						that.inputManualCode = "";
						if(that.transportIdArr.indexOf(res.rspBody.ldeId) == -1){
							var obj = {
								ldeId: res.rspBody.ldeId,
							}
							var goodsArr = [];
							goodsArr.push(res.rspBody);
							obj.goodsArr = goodsArr;
							that.transportIdArr.push(res.rspBody.ldeId);
							that.surfaceNumberArr.push(res.rspBody.surfaceNumber);
							getApp().globalData.pransportCodeArr.push(obj);
							this.getFindVO(res.rspBody.ldeId, that.transportIdArr.length-1);
						} else {
							var isRepeat = 0;
							var numIndex = 0;
							var ldeIdIndex = 0;
							getApp().globalData.pransportCodeArr.map((val, index)=>{
								if(val.ldeId == res.rspBody.ldeId){
									ldeIdIndex = index;
									val.goodsArr.map(item=>{
										if(item.barCode == res.rspBody.barCode){
											isRepeat = 1;
											numIndex = index;
										}
									})
								}
							})
							if(!isRepeat){
								getApp().globalData.pransportCodeArr[numIndex].goodsArr.push(res.rspBody);
							}
							var deleteIndex = 0;
							that.tableArr.map((val, index)=>{
								if(val.surfaceNumber == res.rspBody.surfaceNumber){
									deleteIndex = index;
								}
							})
							that.tableArr.splice(deleteIndex, 1);
							this.getFindVO(res.rspBody.ldeId, ldeIdIndex);
						}
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err => {
			
				})
			},
			goScan(){
				var platForm = uni.getSystemInfoSync().platform;
				if (platForm == "ios") {
					uni.navigateBack({
						
					})
				} else {
					wxScanModule.scanActivity({}, (data) => {
						console.log('扫描结果', data)
					})
					setTimeout(()=>{
						uni.navigateBack({
							
						})
					}, 500)
				}
			},
			deleteEvent(index){
				var newGoodsArr = [];
				this.tableArr[index].goodsObj.map(val=>{
					if(!val.isSelect){
						newGoodsArr.push(val);
					}
				})
				if(newGoodsArr.length == 0){
					this.tableArr.splice(index, 1);
				} else {
					this.tableArr[index].goodsObj = newGoodsArr;
				}
			},
			selectEvent(index, idx){
				this.tableArr.map((val, i)=>{
					if(index == i){
						val.goodsObj.map((item, j)=>{
							if(idx == j){
								item.isSelect = !item.isSelect;
								val.isDelete = item.isSelect;
							} else {
								item.isSelect = false;
							}
						})
					}
				})
			},
			switchStatus(id){
				this.statusId = id;
			},
			showTime() {
				var date = new Date();     //1. js获取当前时间
				// console.log(date);
				var y = date.getFullYear();
				var m = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
				var d = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
				var h = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
				var f = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
				var s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				var formatdate = y + '-' + m + '-' + d + ' ' + h + ":" + f;
				return formatdate;
			},
			getUserLocation(){
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function (res) {
						console.log(res)
						that.addressText = res.latitude?res.address.province + res.address.city + res.address.district + res.address.poiName:'';
						that.lat = res.latitude?res.latitude:0;
						that.lng = res.longitude?res.longitude:0;
						that.province = res.address.province?res.address.province:'';
						that.city = res.address.city?res.address.city:'';
						that.county = res.address.district?res.address.district:'';
						that.address = res.address.poiName?res.address.poiName:'';
					},
					fail: function (err) {
						uni.showModal({
						    title: '网络定位失败',
						    content: '请检查设备是否插入sim卡，是否开启移动网络或开启了wifi模块，请检查是否授予APP定位权限',
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
						            console.log('用户点击确定');
						        }
						    }
						});
					}
				});
			},
			getFindVO(id, index){
				console.log(id, index);
				let that = this;
				let goodsArr = getApp().globalData.pransportCodeArr[index].goodsArr;
				console.log(goodsArr);
				utils.postRequest('/ld/cargogoods/findVO', {
					ldeSid: id
				}).then(res=>{
					if(res.retCode == "0000000"){
						var sumNum = 0;
						res.rspBody.map(val=>{
							val.sucNum = 0;
							val.isSelect = false;
							var arr = [];
							goodsArr.map(item=>{
								if(val.gdName == item.gdName){
									val.sucNum = val.sucNum + 1;
									arr.push(item);
								}
							})
							val.allArr = arr;
							sumNum = sumNum + val.sucNum;
						})
						var obj = {
							goodsObj: res.rspBody,
							isDelete: false,
							sumNum: sumNum,
							surfaceNumber: this.surfaceNumberArr[index],
						}
						that.tableArr.push(obj);
						console.log(that.tableArr);
					}
				})
				.catch(err=>{
					
				})
			},
			getStatusList(){
				utils.postRequest('/ld/ldeccred/getStatusList', {
					isShow: 1
				}).then(res=>{
					console.log(res)
					if(res.retCode == "0000000"){
						this.statusArr = res.rspBody
					}
				})
				.catch(err=>{
					
				})
			},
			scanEvent(){
				let that = this;
				if(!that.statusId){
					uni.showToast({
						title: '请选择运输类型',
						icon: 'none'
					})
					return
				}
				if(!that.lng){
					uni.showToast({
						title: '未获取到地理位置',
						icon: 'none'
					})
					return
				}
				var allCode = getApp().globalData.pransportCodeArr;
				console.log(allCode);
				var updataArr = [];
				// allCode.map(val=>{
				// 	val.goodsArr.map(item=>{
				// 		var obj = {
				// 			barCode: item.barCode,
				// 			reqLtde: that.lng,
				// 			reqLgde: that.lat,
				// 			province: that.province,
				// 			city: that.city,
				// 			county: that.county,
				// 			address: that.address,
				// 			reqBy: that.userInfo.userId,
				// 			reqName: that.userInfo.userName,
				// 			mobile: that.userInfo.mobile,
				// 			ldeccredStatus2: that.statusId,
				// 		}
				// 		updataArr.push(obj);
				// 	})
				// });
				console.log(that.tableArr);
				that.tableArr.map(val=>{
					val.goodsObj.map(item=>{
						item.allArr.map(atem=>{
							var obj = {
								barCode: atem.barCode,
								reqLtde: that.lng,
								reqLgde: that.lat,
								province: that.province,
								city: that.city,
								county: that.county,
								address: that.address,
								reqBy: that.userInfo.userId,
								reqName: that.userInfo.userName,
								mobile: that.userInfo.mobile,
								ldeccredStatus2: that.statusId,
							}
							updataArr.push(obj);
						})
					})
				})
				console.log(updataArr);
				utils.postRequest('/ld/ldebarcode/scan', updataArr).then(res=>{
					console.log(res)
					if(res.retCode == "0000000"){
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						})
						getApp().globalData.isScanAli = 0;
						var platForm = uni.getSystemInfoSync().platform;
						if (platForm == "ios") {
							setTimeout(()=>{
								uni.navigateBack({
									delta: 2
								})
							}, 1000)
						} else {
							setTimeout(()=>{
								uni.navigateBack()
							}, 1000)
						}
						
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err=>{
					
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F1F4F9;
	}
	.all{
		padding-bottom: 140rpx;
		.input-box{
			padding: 0 36rpx;
			margin-top: 15rpx;
			position: relative;
			.input-content{
				background-color: #fff;
				box-shadow: 0rpx 0rpx 14rpx 2rpx rgba(202, 222, 255, 0.34);
				border-radius: 16rpx;
				height: 80rpx;
				line-height: 80rpx;
				color: #333;
				font-size: 24rpx;
				padding: 18rpx 38rpx;
				box-sizing: border-box;
			}
			.manualScan{
				position: absolute;
				width: 40rpx;
				height: 40rpx;
				right: 66rpx;
				top: 20rpx;
			}
		}
		.user-box{
			margin: 20rpx 36rpx;
			padding: 0 38rpx;
			background-color: #fff;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.user-child{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 0;
				.user-title{
					width: 144rpx;
					font-size: 28rpx;
					font-weight: 600;
					color: #333;
				}
				.user-info{
					width: 294rpx;
					font-size: 24rpx;
					color: #666;
				}
			}
			.userInfo-img{
				width: 136rpx;
				height: 202rpx;
			}
		}
		.status-box{
			padding: 40rpx 34rpx 0 34rpx;
			.status-tips{
				color: #333;
				font-weight: 600;
				font-size: 28rpx;
			}
			.status-content{
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				margin-top: 30rpx;
				padding: 0 50rpx;
				.status-child{
					color: #666;
					font-size: 22rpx;
					width: 160rpx;
					text-align: center;
					height: 60rpx;
					line-height: 60rpx;
					box-shadow: 0rpx 0rpx 14rpx 2rpx rgba(202, 222, 255, 0.4);
					margin-bottom: 20rpx;
					border-radius: 110rpx;
					background-color: #fff;
				}
				.status-select{
					color: #6CA1FF;
					font-size: 22rpx;
					width: 160rpx;
					text-align: center;
					height: 60rpx;
					line-height: 60rpx;
					margin-bottom: 20rpx;
					border-radius: 110rpx;
					border: 2rpx solid #6CA1FF;
				}
			}
		}
		.table-box{
			margin: 44rpx 0;
			.mar-box{
				margin-top: 30rpx;
			}
			.table-child{
				background: linear-gradient(180deg, #FFFFFF 0%, #F1F4F9 100%);
				margin-bottom: 44rpx;
				.table-title{
					padding: 34rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.table-left{
						display: flex;
						align-items: center;
						font-size: 32rpx;
						font-weight: 600;
						color: #333;
						.table-num{
							color: #666;
							font-size: 24rpx;
						}
					}
					.table-right{
						width: 112rpx;
						height: 44rpx;
						line-height: 44rpx;
						text-align: center;
						border-radius: 30rpx;
						color: #fff;
						font-size: 26rpx;
						background-color: #D05D40;
						margin-right: 20rpx;
					}
					.table-backgroud{
						background-color: #D7D7D7;
					}
				}
				.table-all{
					.table-head{
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: #444;
						font-weight: 500;
						border-bottom: 2rpx solid #ECECEC;
						padding: 20rpx 0;
						.head-child{
							flex: 1;
							text-align: center;
						}
					}
					.table-content{
						display: flex;
						align-items: center;
						font-size: 24rpx;
						color: #444;
						border-bottom: 2rpx solid #ECECEC;
						padding: 22rpx 0;
						.content-child{
							flex: 1;
							text-align: center;
							border-right: 1rpx solid #F3F3F3;
						}
					}
					.table-row{
						background-color: #DDE9FF;
					}
				}
			}
		}
		.btn-box{
			position: fixed;
			bottom: 40rpx;
			left: 175rpx;
			right: 175rpx;
			background-color: #2B72F0;
			color: #fff;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			text-align: center;
		}
	}
</style>
