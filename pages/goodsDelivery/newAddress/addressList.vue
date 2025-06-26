<template>
	<view class="addressList">
		<view class="flleetHead">
			<view class="headBtnGroup">
				<view class="searchInputBox">
					<input class="searchInput" v-model="searchVal" @confirm="getAddressInfo()" placeholder-style="font-size:28rpx;color:#AEAEAE" placeholder="搜索姓名、电话、地址"/>
					<image class="clearIcon" v-if="searchVal" @click="clearSearch()" src="../../../static/images/close2.png"></image>
				</view>
				
				<view class="searchIconBox" @click="getAddressInfo()">
					<image class="searchIcon" src="../../../static/images/goodsDelivery/search.png"></image>
				</view>
			</view>
		</view>
		
		<uni-swipe-action>
		    <uni-swipe-action-item style="margin-bottom: 10rpx;"  v-for="(item, index) in addressData" :key="index" :disabled="false" :right-options="options" @click="deleteAddress($event, index)">
				<view class="addressBox">
					<view class="addressDetails" @click="checkAddress(item)">
						<view class="nameBox">
							<text class="name">{{item.userName}}</text>
							<text class="msg">{{item.mobile}}</text>
						</view>
						<view class="contentBox">
							<text class="defaultSyb" v-if="item.isDefault == 1">默认{{item.purpose == 1 ? '装货点' : '卸货点'}}</text>
							<text class="msg">{{showAddressMsg(item, 'area')}} {{item.address}}</text>
						</view>
					</view>
					<view class="editIconBox" @click="jumpToEdit(item)">
						<image class="editIcon" src="../../../static/images/goodsDelivery/editAddress.png"></image>
					</view>
				</view>
		    </uni-swipe-action-item>
		</uni-swipe-action>
		
		<view class="loadingBox" v-show="noData">
			<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
		</view>
		<view class="loadingBox" style="padding: 0;" v-show="noData">
			暂无数据～
		</view>
		<view class="loadingBox" v-show="noMoreData">
			没有更多了~
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/goodsDelivery/listLoading.png"></image>
			正在加载中…
		</view>
		
		<view class="footBtnGroup">
			<view class="saveBtn" @tap="jumpToNewAddress()">添加新地址</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				searchVal: '',
				options:[{
				    text: '删除',
				    style: {
				        backgroundColor: '#F56C6C'
				    }
				}],
				pageNum: 1,
				pageSize: 20,
				addressData: [],
				noData: false,
				noMoreData: false,
				isLoading: false,
				purpose: '',
				statusFlag: '',
				checkedNum: '',
				serialNumber: '',
				addressType: 0, //判断是否是零担下单
				userInfo: ''
			};
		},
		onLoad(options) {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : '';
			this.purpose = Number(options.purpose); // 1为装货点，2为卸货点
			this.serialNumber = Number(options.serialNumber); // 1为装货点1，2为装货点2，3为卸货点1，4为卸货点2
			this.statusFlag = options.flag; // edit为编辑，detail为查看详情
			this.checkedNum = Number(options.checkedNum); // 1为装卸点1，2为装卸点2
			this.pageFrom = options.pageFrom; //从新增跳转或者是从首页跳转过来
			if(options.type){
				this.addressType = Number(options.type); //有值代表是零担下单的地址
			}
			console.log(this.purpose);
			this.getAddressInfo();
			uni.$on("refreshData_addressList", (data) => {
				this.searchVal = '';
				this.getAddressInfo();
			});
		},
		onShow() {},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getAddressInfo();
		},
		onReachBottom() { // 上拉加载
			this.addressOnLoad();
		},
		methods: {
			clearSearch() {
				this.searchVal = '';
				this.getAddressInfo();
			},
			getAddressInfo() { // 获取地址列表
				uni.showLoading({
					title: '加载中'
				});
				if(this.searchVal) {
					this.searchVal = this.searchVal.replace(/ /g,'');
				}
				this.noData = false;
				this.noMoreData = false;
				this.isLoading = false;
				this.pageNum = 1;
				let params = {
					userId: this.userInfo.userId,
					// purpose: this.purpose,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					condition: this.searchVal ? this.searchVal : undefined,
				}
				console.log('地址列表请求参数', params);
				utils.postRequest('/ts/user/address/get', params)
				.then(res=>{
					console.log('地址列表', res);
					if(res.retCode == '0000000') {
						this.addressData = res.rspBody.items;
						if(this.addressData && this.addressData.length == 0) {
							this.noData = true;
						}else if(this.addressData && this.addressData.length < this.pageSize) {
							this.noMoreData = true;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
				uni.stopPullDownRefresh();
			},
			addressOnLoad() { // 地址列表加载
				if(this.noData || this.noMoreData || this.isLoading) {
					return false;
				}
				this.isLoading = true;
				this.pageNum++;
				let params = {
					userId: this.userInfo.userId,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					condition: this.searchVal ? this.searchVal : undefined,
				}
				let that = this;
				utils.postRequest('/ts/user/address/get', params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								that.addressData.push(items[i]);
							}
						}else {
							that.noMoreData = true;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			jumpToNewAddress() { // 新增地址
				uni.navigateTo({
					url: '../newAddress/newAddress?' + 'purpose=' + this.purpose + '&serialNumber=' + this.serialNumber
				});
			},
			checkAddress(item) { // 非edit状态无法选中
				if(this.addressType){
					switch(this.serialNumber) {
						case 1:
							getApp().globalData.pransportGoods.startAddress = item;
							break;
						case 3:
							getApp().globalData.pransportGoods.endAddress = item;
							break;
					}
				} else {
					switch(this.serialNumber) {
						case 1:
							getApp().globalData.addressObject.loadGoods1 = item;
							break;
						case 2:
							getApp().globalData.addressObject.loadGoods2 = item;
							break;
						case 3:
							getApp().globalData.addressObject.unloadGoods1 = item;
							break;
						case 4:
							getApp().globalData.addressObject.unloadGoods2 = item;
							break;
					}
				}
				if (this.pageFrom == "newAddress") {
					uni.navigateBack({
						delta: 2
					})
				} else {
					uni.navigateBack();
				}

			},
			jumpToEdit(item) {
				uni.navigateTo({
					url: '../newAddress/newAddress?' + 'purpose=' + this.purpose + '&serialNumber=' + this.serialNumber + '&addressItem=' + JSON.stringify(item)
				});
			},
			deleteAddress(e, index) { // 地址删除
				console.log(this.addressData[index].sid);
				let ids = [];
				ids.push(this.addressData[index].sid);
				let params = {
					ids: ids
				}
				console.log('删除参数', params);
				utils.postRequest('/ts/user/address/remove', params)
				.then(res=>{
					console.log('删除结果', res);
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '删除成功',
							icon: 'success',
							duration: 3000
						})
						this.addressData.splice(index, 1);
						console.log(getApp().globalData.addressObject);
						let startAddress1 = getApp().globalData.addressObject.loadGoods1;
						let endAddress1 = getApp().globalData.addressObject.unloadGoods1;
						let startAddress2 = getApp().globalData.addressObject.loadGoods2;
						let endAddress2 = getApp().globalData.addressObject.unloadGoods2;
						//零担地址也需要重置
						let startPransportGoods = getApp().globalData.pransportGoods.startAddress;
						let endPransportGoods = getApp().globalData.pransportGoods.endAddress;
						
						if (startPransportGoods.sid == ids['0']) {
							getApp().globalData.pransportGoods.startAddress = {}
						}
						if (endPransportGoods.sid == ids['0']) {
							getApp().globalData.pransportGoods.endAddress = {}
						}
						
						
						if(startAddress1.sid == ids['0']) {
							getApp().globalData.addressObject.loadGoods1 = {};
						}
						if(startAddress2.sid == ids['0']) {
							getApp().globalData.addressObject.loadGoods2 = {};
						}
						if(endAddress1.sid == ids['0']) {
							getApp().globalData.addressObject.unloadGoods1 = {};
						}
						if(endAddress2.sid == ids['0']) {
							getApp().globalData.addressObject.unloadGoods2 = {};
						}
						// 默认地址处理
						let defaultAddressLoadGoods1 = getApp().globalData.defauleAddress.loadGoods1;
						if(defaultAddressLoadGoods1.sid == ids['0']) {
							getApp().globalData.defauleAddress.loadGoods1 = {};
						}
						let defaultAddressUnloadGoods1 = getApp().globalData.defauleAddress.unloadGoods1;
						if(defaultAddressUnloadGoods1.sid == ids['0']) {
							getApp().globalData.defauleAddress.unloadGoods1 = {};
						}
						uni.$emit('transportRefresh');
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
			},
			showAddressMsg(item, flag) {
				switch(flag) {
					case 'name':
						return item.userName + '  ' + item.mobile;
					case 'area':
						if(item.areaCode == item.cityCode) {
							return item.province + '-' +item.area;
						}else {
							return item.province + '-' + item.city + '-' +item.area;
						}
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2;
	}
	.addressList {
		padding-top: 10rpx;
		padding-bottom:168rpx;
		.addressBox {
			padding: 32rpx;
			background-color: #FFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.addressDetails {
				flex: 1;
				padding-right: 28rpx;
				.msg {
					font-size: 28rpx;
					color: #777777;
				}
				.nameBox {
					.name {
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
						margin-right: 40rpx;
					}
				}
				.contentBox {
					padding-top: 12rpx;
					line-height: 40rpx;
					.defaultSyb {
						border-radius: 8rpx;
						background-color: #59B0F8;
						font-size: 28rpx;
						color: #FFF;
						padding: 4rpx 16rpx;
						margin-right:10rpx;
					}
				}
			}
			.editIconBox {
				padding-left: 32rpx;
				border-left: 2rpx solid #F2F3F3;
				display: flex;
				align-items: center;
			}
			.editIcon {
				width:40rpx;
				height: 44rpx;
			}
		}
		.addAddressBtn {
			position: fixed;
			bottom: 32rpx;
			margin: 0 32rpx;
			width: 686rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			background: #59B0F8;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
		.footBtnGroup {
			padding: 24rpx 60rpx;
			width:630rpx;
			background-color: #FFF;
			position: fixed;
			bottom: 0;
			box-shadow: 0px -2rpx 8rpx 0px rgba(0,0,0,0.1);
			border-radius: 24rpx 24rpx 0px 0px;
			.saveBtn {
				height: 90rpx;
				line-height: 90rpx;
				border-radius:44rpx;
				background-color: #4AA2F3;
				box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
		@keyframes rotating {
		    0% {
		        transform:rotate(0deg);
		    }
		    100% {
		        transform:rotate(360deg);
		    }
		}
		.loadingBox {
			padding:30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 2s infinite;
		        animation: rotating 2s infinite;
			}
			.noDataIcon {
				width: 244rpx;
				height: 246rpx;
				margin-top:200rpx;
			}
		}
		.flleetHead {
			margin-bottom: 10rpx;
			height: 70rpx;
			display: flex;
			align-items: center;
			.headBtnGroup {
				flex: 1;
				height: 70rpx;
				background: #FFFFFF;
				border-radius: 8rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.scanBox{
					display: flex;
					align-items: center;
					flex-shrink: 0;
					.scanCode{
						width: 40rpx;
						height: 40rpx;
						margin: 0 0 0 24rpx;
					}
					.scanLine{
						margin: 0 0 0 24rpx;
						width: 2rpx;
						height: 30rpx;
						background-color: #AEAEAE;
					}
				}
				.searchIconBox {
					height: 70rpx;
					padding: 0 24rpx;
					border-left: 2rpx solid #AEAEAE;
					flex-shrink: 0;
					display: flex;
					align-items: center;
					.searchIcon {
						width: 40rpx;
						height: 40rpx;
					}
				}
				.searchInputBox {
					height: 70rpx;
					padding: 0 24rpx;
					flex: 1;
					display: flex;
					align-items: center;
					.searchInput {
						flex: 1;
						font-size: 28rpx;
						color:#333;
					}
					.clearIcon {
						height: 40rpx;
						width: 40rpx;
						flex-shrink: 0;
					}
				}
			}
		}
	}
</style>
