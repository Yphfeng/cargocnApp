<template>
	<view class="search">
		<view class="searchHeader">
			<view class="backIcon" @tap="backToFromPage()">
				<image src="../../static/images/searchIcon/back.png"></image>
			</view>
			<view class="searchInputBox">
				<view class="searchIcon" @tap="toSearch">
					<image src="../../static/images/searchIcon/search.png"></image>
				</view>
				<input :focus="onFocus" type="text" :value="searchVal" placeholder="搜索地址" class="searchInput" @input="inputName" @confirm="toSearch()" />
				<view v-if="searchVal.length>0" @click="cleanValue">
					<image style="width: 25rpx; height: 25rpx;" src="../../static/images/newCancel.png" mode=""></image>
				</view>
			</view>
			<view @tap="toSearch">
				<image class="search-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/searchIcon.png"></image>
			</view>
		</view>
		<!-- 分割线 -->
		<view style="height: 10rpx;background-color: #F2F2F2;"></view>
		<!-- 分割线 -->
		<view class="searchBody">
			<view class="searchDetails" v-for="(item, index) in searchData" :key="index" :class="index == 0 ? 'firstDetails' : 'otherDetails'" @click="jumpToMap(item.address, item.title)">
				<view class="leftMsg">
					<view :class="index == 0 ? 'firstMsgIcon' : 'otherMsgIcon'">
						<image v-if="index == 0" src="../../static/images/searchIcon/positioning.png"></image>
						<image v-if="index > 0" src="../../static/images/searchIcon/search.png"></image>
					</view>
					<view class="msgBox">
						<view class="title">{{item.title}}</view>
						<view v-if="index == 0" class="address">{{item.address ? item.address.formatted_address : ""}}</view>
					</view>
				</view>
				<view class="rightBtn"v-if="index == 0" @tap="toNavigate()">
					<image src="../../static/images/searchIcon/navigation.png"></image>
				</view>
			</view>
			<view class="clearHistoryBtn" @tap="clearHistory()">清空搜索历史</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js"
	export default {
		data() {
			return {
				searchVal: '',
				searchData: [],
				searchType: '',
				geocodesData: {},
				storageKeyName: '',
				onFocus: true,
				searchCondition: 0, //默认按地址搜索
			};
		},
		onLoad(option) {
			uni.showLoading({
				mask: true,
				title: '加载中'
			});
			this.searchType = option.type;
			switch(this.searchType) {
				case 'service':
					this.storageKeyName = 'serviceHistoryData';
					break;
				case 'roadCondition':
					this.storageKeyName = 'roadConditionHistoryData';
					break;
				case 'mutual':
					this.storageKeyName = 'mutualHistoryData';
					break;
			}
			console.log(this.searchType);
		},
		onShow() {
			this.getSearchHistory();
		},
		methods: {
			cleanValue(){
				this.searchVal = '';
			},
			backToFromPage() {
				uni.navigateBack();
			},
			clearHistory() { // 清空搜索历史本地数据
				console.log('清空搜索历史');
				let that = this;
				uni.removeStorage({
				    key: that.storageKeyName,
				    success: function (res) {
				        that.getSearchHistory();
				    },
					fail: function(err){
						console.log(err)
					}
				});
			},
			inputName(e) {
				this.searchVal = e.detail.value;
			},
			getSearchHistory() { // 获取搜索历史本地数据
				let that = this;
				uni.getStorage({
				    key: that.storageKeyName,
				    success: function (res) {
						that.searchData = res.data;
						console.log('本地搜索记录', that.searchData);
				    },
					fail: function(err){
						that.searchData = [];
					}
				});
				setTimeout(function () {
				    uni.hideLoading();
				}, 1000);
			},
			toSearch() { // 搜索成功后先将搜索内容存入缓存中后再进行地图跳转
				if(!this.searchVal) {
					uni.showToast({
					    title: '请输入要搜索地址！',
					    duration: 2000,
						icon: 'none'
					});
					return false;
				}
				uni.showLoading({
					mask: true,
					title: '加载中'
				});
				let that = this;
			
				let parameters = 'key=6ae872d0bc86389b263ecdf64521a42a' + '&address=' + that.searchVal;
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/geo?' + parameters, //仅为示例，并非真实接口地址。
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('成功', res);
						that.geocodesData = res.data.geocodes;
						if(that.geocodesData && that.geocodesData.length == 0) {
							uni.showToast({
								title: '未查询到此地址！',
								duration: 2000,
								icon: 'none'
							});
						}else {
							let params = {
								title: that.searchVal,
								address: that.geocodesData[0],
								searchCondition: 1,
							}
							that.searchData.unshift(params);
							uni.setStorage({
								key: that.storageKeyName,
								data: that.searchData,
								success: function (res) {
									that.getSearchHistory();
									that.jumpToMap(that.geocodesData[0]);
								}
							});
							console.log('查询到的地址信息', that.geocodesData);
						}
					},
					fail: (err) => {
						console.log('失败', err);
					},
					complete: (com) => {
						uni.hideLoading();
					}
				});
				
				
				
			},
			
			jumpToMap(item, title) { // 跳转地图
				console.log('跳转参数111111', item, title, this.searchCondition);
		
				//按地址搜索
				let location = item.location.split(',');
				let query = '?longitude=' + location[0] + '&latitude=' + location[1] + '&type=' + this.searchType;
				console.log('定位经纬度', query);
				switch(this.searchType) {
					case 'service':
						getApp().globalData.serviceSearch.latitude = location[1];
						getApp().globalData.serviceSearch.longitude = location[0];
						getApp().globalData.serviceSearch.searchVal = title ? title : this.searchVal;
						uni.$emit("refreshData_service");
						uni.navigateBack({
							delta: 1
						})
						break;
					case 'roadCondition':
						getApp().globalData.roadConditionSearch.latitude = location[1];
						getApp().globalData.roadConditionSearch.longitude = location[0];
						getApp().globalData.roadConditionSearch.searchVal =  title ? title : this.searchVal;
						uni.$emit("refreshData_road");
						uni.navigateBack({
							delta: 1
						})
						break;
					case 'mutual':
						getApp().globalData.mutualSearch.latitude = location[1];
						getApp().globalData.mutualSearch.longitude = location[0];
						getApp().globalData.mutualSearch.searchVal = title ? title : this.searchVal;
						uni.$emit("refreshData_mutual");
						uni.navigateBack({
							delta: 1
						})
						break;
				}
				
			
				// uni.navigateTo({
				// 	url:'/pages/index/mapView/mapView1' + query
				// })
			},
			toNavigate() {
				console.log('导航');
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF;
	}
	.search {
		image {
			max-width: 100%;
			max-height: 100%;
		}
		.searchHeader {
			padding:100rpx 40rpx 24rpx 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.backIcon {
				width:22rpx;
				height:40rpx;
				padding-right: 20rpx;
				margin-right:20rpx;
			}
			.searchInputBox {
				flex: 1;
				height: 36rpx;
				padding: 14rpx 26rpx;
				background: rgba(245, 246, 246, 0.75);
				border-radius: 32rpx;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.searchIcon {
					width:36rpx;
					height: 36rpx;
					margin-right:20rpx;
				}
				.searchInput {
					font-size: 28rpx;
					color:#333;
					height: 36rpx;
					flex: 1;
				}
			}
			.search-img{
				width: 116rpx;
				height: 64rpx;
				margin-left: 40rpx;
			}
		}
		.searchBody {
			padding:0 40rpx;
			.searchDetails {
				border-bottom:2rpx solid #F2F2F2;
				display: flex;
				justify-content: space-between;
				.leftMsg {
					display: flex;
					justify-content: flex-start;
					.firstMsgIcon {
						width: 30rpx;
						height: 36rpx;
						margin-right: 22rpx;
					}
					.otherMsgIcon {
						width: 32rpx;
						height: 32rpx;
						margin-right: 20rpx;
					}
					.msgBox {
						.title {
							font-size:30rpx;
							color:#333;
							line-height:42rpx;
						}
						.address {
							margin-top:4rpx;
							font-size:28rpx;
							color:#777;
							line-height:40rpx;
						}
					}
				}
				.rightBtn {
					padding-top: 14rpx;
					width:48rpx;
					height: 48rpx;
				}
			}
			.firstDetails {
				padding: 14rpx 0 20rpx 0;
			}
			.otherDetails {
				padding: 26rpx 0;
			}
			.clearHistoryBtn {
				height: 40rpx;
				line-height: 40rpx;
				font-size:28rpx;
				text-align: center;
				color:#777;
				margin-top:26rpx;
			}
		}
	}
</style>
