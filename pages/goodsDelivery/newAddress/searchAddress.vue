<template>
	<view class="searchAddress">
		<view class="searchInputBox">
			<view class="inputBox">
				<image class="rightSearch" src="../../../static/images/goodsDelivery/search.png" @tap="toSearch()"></image>
				<input class="searchInput" type="text" confirm-type="search" v-model="searchVal" placeholder="请输入" @confirm="toSearch()" />
			</view>
			<view class="myLocationBtn" @click="getUserLocation()">
				<image class="locationicon" src="../../../static/images/goodsDelivery/searchPositioning.png" ></image>
				定位
			</view>
		</view>
		<view class="searchContent" v-for="(item, index) in searchData" :key="index" @click="chooseAddress(item)" v-show="item.address && item.address.length > 0">
			<view class="title">{{item.name}}</view>
			<view class="msg">{{item.address}}</view>
		</view>
		
		<view class="loadingBox" v-show="noMoreData">
			没有更多了~
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/goodsDelivery/listLoading.png"></image>
			正在加载中…
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				searchVal: '',
				searchData: [],
				pageNum: 1,
				isLoading: false,
				noMoreData: false,
				addressHistory: [],
				searchFlag: '',
				regionData: []
			}
		},
		onLoad(option) {
			// uni.showLoading({
			// 	mask: true,
			// 	title: '加载中'
			// });
			// this.getBatchNumber();
			this.searchFlag = option.flag;
			if(this.searchFlag == 1 || this.searchFlag == 2) {
				this.addressHistory = uni.getStorageSync('sendAddressHistory') ? uni.getStorageSync('sendAddressHistory') : [];
			}else {
				this.addressHistory = uni.getStorageSync('receivedAddressHistory') ? uni.getStorageSync('receivedAddressHistory') : [];
			}
			this.regionData = uni.getStorageSync('regionData');
			// uni.hideLoading();
			// console.log('本地地区数据', this.regionData);
		},
		onShow() {
			
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.toSearch();
		},
		onReachBottom() { // 上拉加载
			this.addressOnload();
		},
		methods: {
			getUserLocation() {
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function (res) {
						that.searchVal = res.address.poiName;
						that.toSearch();
					},
					fail: function (err) {
						uni.hideLoading();
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
			toSearch() { // 搜索
				if(!this.searchVal) {
					uni.showToast({
						title: '请输入地址',
						icon: 'none',
					})
					return false;
				}
				this.pageNum = 1;
				this.isLoading = false;
				this.noMoreData = false;
				uni.showLoading({
					mask: true,
					title: '加载中'
				});
				let that = this;
				//根据地址搜索
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&offset=20&extensions=all&' + 'page=' + that.pageNum + '&keywords=' + that.searchVal;
				uni.request({
					url: 'https://restapi.amap.com/v3/place/text?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						// console.log('成功', res);
						let poisAry = res.data.pois;
						if(poisAry && poisAry.length < 20) {
							that.noMoreData = true;
						}
						if(poisAry && poisAry.length > 0) {
							var newArr = poisAry.filter(item => item.name.indexOf("公交站") == -1);
							var newArr1 = newArr.filter(item => item.location);
							that.searchData = newArr1;
						}
						// console.log(that.searchData);
					},
					fail: (err) => {
						console.log('失败', err);
					},
					complete: (com) => {
						uni.hideLoading();
					}
				});
				uni.stopPullDownRefresh();
			},
			addressOnload() { // 懒加载
				if(this.isLoading || this.noMoreData) {
					return false;
				}
				this.isLoading = true;
				let that = this;
				that.pageNum = that.pageNum + 1;
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&offset=20&extensions=all&' + 'page=' + that.pageNum + '&keywords=' + that.searchVal;
				uni.request({
					url: 'https://restapi.amap.com/v3/place/text?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('成功', res);
						let ary =  [];
						ary = res.data.pois;
						if(ary && ary.length < 20) {
							that.noMoreData = true;
						}
						if(ary && ary.length > 0) {
							var newArr = ary.filter(item => item.name.indexOf('公交站') == -1);
							var newArr1 = newArr.filter(item => item.location);
							// console.log(newArr);
							for(let i in newArr1) {
								that.searchData.push(newArr[i]);
							}
						}
					},
					fail: (err) => {
						console.log('失败', err);
					},
					complete: (com) => {
						that.isLoading = false;
						uni.hideLoading();
					}
				});
			},
			chooseAddress(item) { // 选择地址，填充数据、保存数据、存入全局、存入本地
				console.log('选择的地址', item);
				uni.showLoading({
					title: '加载中'
				});
				let locationAry = item.location.split(',');
				let cityCode = '';
				let cityName = '';
				if(item.pcode == '310000' || item.pcode == '110000' || item.pcode == '500000' || item.pcode == '120000') {
					cityCode = item.adcode;
					cityName = item.adname;
				}else {
					for(let i in this.regionData) {
						if(this.regionData[i].code == item.pcode) {
							for(let a in this.regionData[i].cities) {
								for(let b in this.regionData[i].cities[a].areas) {
									if(this.regionData[i].cities[a].areas[b].code == item.adcode) {
										cityCode = this.regionData[i].cities[a].code;
									}
								}
							}
						}
					}
					cityName = item.cityname;
				}
				let params = {
					batchNumber: getApp().globalData.batchNumber,
					address: item.address,
					area: item.adname,
					areaCode: item.adcode,
					city: cityName,
					cityCode: cityCode,
					province: item.pname,
					provinceCode: item.pcode,
					serialnumber: this.searchFlag,
					longitude: locationAry['0'],
					latitude: locationAry['1'],
				}
				console.log('地址保存参数', params);
				if(this.searchFlag == 1 || this.searchFlag == 2) {
					uni.setStorageSync('sendAddressHistory', this.addressHistory);
					if(this.searchFlag == 1) {
						getApp().globalData.addressObject.loadGoods1 = params;
					}else if(this.searchFlag == 2) {
						getApp().globalData.addressObject.loadGoods2 = params;
					}
				}else {
					if(this.searchFlag == 3) {
						getApp().globalData.addressObject.unloadGoods1 = params;
					}else if(this.searchFlag == 4) {
						getApp().globalData.addressObject.unloadGoods2 = params;
					}
					uni.setStorageSync('receivedAddressHistory', this.addressHistory);
				}
				uni.navigateBack();
			},
			getBatchNumber() { // 是否有批次号，无则重新获取
				let batchNumber = getApp().globalData.batchNumber ? getApp().globalData.batchNumber : '';
				if(!batchNumber) {
					utils.postRequest('/td/deliver-good/get-batch-number')
					.then(res=>{
						console.log('批次号', res);
						if(res.retCode == '0000000') {
							getApp().globalData.batchNumber = res.rspBody.batchNumber;
							uni.navigateBack();
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
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF;
	}
	.searchAddress {
		.searchInputBox {
			height: 100rpx;
			background: #F5F6F8;
			border-radius: 12rpx;
			margin: 0 32rpx 16rpx 32rpx;
			padding: 0 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.inputBox {
				flex: 1;
				display: flex;
				align-items: center;
				padding-right:16rpx;
				.rightSearch {
					width: 34rpx;
					height: 34rpx;
					margin-right:16rpx;
				}
			}
			.searchInput {
				flex: 1;
				height: 100rpx;
				font-size: 30rpx;
				color: #333333;
			}
			.myLocationBtn {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				color: #4AA2F3;
				.locationicon {
					margin-right:14rpx;
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
		.searchContent + .searchContent {
			border-top: 2rpx solid #F2F3F3;
		}
		.searchContent {
			padding: 24rpx 0;
			margin-left: 32rpx;
			.title {
				font-size: 30rpx;
				color: #333333;
			}
			.msg {
				font-size: 26rpx;
				color: #999999;
				margin-top: 10rpx;
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
	}
</style>
