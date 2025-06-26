<template>
	<view class="scanCode_box">
			<view class="scanBox">
				<image class="scanCode" src="/static/images/goodsDelivery/scanCode2.png" mode="" @click="requestPower"></image>
				<!-- <view class="scanLine"></view> -->
			</view>
		
		<view class="searchBox">		
			<swiper class="swiperBox" :autoplay="!inputFocus" :interval="5000" :circular="true" @change="currentChange" :current="current" :vertical="true" v-if="!searchVal && !inputFocus && fleetHotkeyInfo.length > 0">
				<swiper-item v-for="(item, searchKey) in fleetHotkeyInfoArr" :key="searchKey">
					<view class="swiperMsg" @click="chooseHotKey(item.hotkeyName)">{{item.hotkeyName}}</view>
				</swiper-item>
			</swiper>
			<input class="searchInput" @input="changeSearchVal" :value="searchVal" @confirm="confirm" :focus="inputFocus" @focus="focus" placeholder-style="font-size:28rpx;color:#AEAEAE" :placeholder="inputPlaceholder" v-if="inputFocus || searchVal" @blur="inputBlur"/>
			<!-- <image class="searchIcon" src="../../../static/images/goodsDelivery/search.png" @click="toSearch()" v-if="!searchVal || !inputFocus"></image> -->
			<image class="searchIcon" src="../../../static/images/goodsDelivery/search.png" @click="chooseHotKey()" v-if="!searchVal || !inputFocus"></image>
			<view class="clearBox" @click.stop="clear" v-show="inputFocus && searchVal">
				<image class="clearIcon" src="../../../static/images/close2.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import * as ship from "../../../utils/ship.js";
	import * as publicData from "../../../utils/publicData.js"
	export default {
		props: {
			fleetHotkeyInfo: {
				type: Array,
				default: [],
			},
			keyword: {
				type: String,
				default: ''
			}
		},
		created() {
			console.log(this.fleetHotkeyInfo, 'aasasasasa')
		},
		onShow() {
			console.log('热搜词', this.keyword)
		},
		data() {
			return {
				inputFocus: false,
				current: 0,
				inputPlaceholder: ''
			}
		},
		computed: {
			fleetHotkeyInfoArr() {
				return this.fleetHotkeyInfo
			},
			searchVal() {
				return this.keyword
			},
		},
		methods: {
			GetQueryString(data, name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = data.split('?')[1].match(reg); //search,查询？后面的参数，并匹配正则
				if (r != null) return unescape(r[2]);
				return null;
			},
			requestPower() {
				var text = "为了您能通过拍照或相册扫码来访问车队或货源信息，我们将申请您的存储和相机权限"
				publicData.requestPower(text, this.scanCodeEvent)
			},
			scanCodeEvent(){
				var that = this;
				uni.scanCode({
					onlyFromCamera: false,
					success: function(res) {
						console.log(res)
						var data = decodeURIComponent(res.result);
						//判断是否扫的是货源二维码
						var searchObj = data.split("?")[1];
						var searchType = searchObj ?  searchObj.split('=')[0] : '';
						if (searchType == "orderNumber") {
							//确认扫描的是货源码，跳转货源详情
							var orderNumber = searchObj.split('=')[1];
							console.log(orderNumber, "orderNumber");
							ship.newQueryPostRequest("/td/order/findListRecord", {
								orderNumber: orderNumber
							}).then(res => {
								console.log("res", res);
								if (res.retCode == "0000000") {
									var details = res.rspBody;
									var sid = details.sid;
									if (details.orderState == 1) {
										var userRole = uni.getStorageSync("userRole");
										if (userRole == 1) {
											uni.navigateTo({
											  url: '/pages/ship/supplyDetails/supplyDetails?sid=' + sid
											});
										} else {
											uni.navigateTo({
											  url: '/pages/goodsDelivery/orderDetails/orderDetails?sid=' + sid
											});
										}
									} else {
										uni.showToast({
											title: '该货源已关闭',
											icon: 'none'
										})
										var userRole = uni.getStorageSync("userRole");
										if (userRole == 1) {
											uni.switchTab({
											  url: '/pages/ship/index/index1'
											});
										} else {
											uni.switchTab({
											  url: '/pages/goodsDelivery/index/index'
											});
										}
									}
								} else {
									uni.showToast({
										title: res.retDesc,
										icon: 'none'
									})
								}
							})
							
							
						} else {
							//扫描的是其他码
							var resultObj = eval('('+data+')');
							console.log(resultObj, '扫码111111');
							
							if(resultObj.fleetId){
								uni.$emit("scanForResult", {
									fleetId: resultObj.fleetId,
									isScan: 1
								});
							}
						}
						
						
					},
					fail: function(err) {
						console.log(err)
					}
				});
			},
			changeSearchVal(e) {
				//更新keyword
				
				this.inputFocus = true;
				var searchVal = e.detail.value;
				uni.$emit("keywordChange", searchVal);
					// if(!this.searchVal) {
					// 	uni.$emit("keywordChange", '');
					// }
				
			},
			
			clear() {
				//点击清除并全局搜索
				console.log('清除你剖天');
				this.inputFocus = false;
				uni.$emit("keyWordSearch", {
					name: "",
					isScan: 0,
				});
			},
			confirm(e) {
				console.log(e, '阿萨')
				var searchVal = "";
				if(!this.searchVal) {
					searchVal = this.fleetHotkeyInfo[this.current].hotkeyName;
				} else {
					searchVal = this.searchVal;
				}
				this.inputFocus = false;
				// let searchMsg = e.detail.value ? e.detail.value : this.inputPlaceholder;
				uni.$emit("keyWordSearch", {
					name: searchVal,
					isScan: 0,
				});
			},
			chooseHotKey(msg) {
				// console.log(msg);
				uni.navigateTo({
					url: '../../goodsDelivery/fleetIndex/fleetSearch?hotKey=' + this.fleetHotkeyInfo[this.current].hotkeyName
				})
				
				
				// this.inputFocus = true;
				
				
				// this.inputPlaceholder = this.fleetHotkeyInfo[this.current].hotkeyName;
				// if(!this.searchVal) {
				// 	this.searchVal = this.fleetHotkeyInfo[this.current].hotkeyName;
				// }
			},
			inputBlur() {
				this.inputFocus = false;
			},
			focus() {
				this.inputFocus = true;
			},
			currentChange(e) {
				this.current = e.detail.current;
			},
			toSearch() {
				var searchVal = "";
				if(!this.searchVal) {
					searchVal = this.fleetHotkeyInfo[this.current].hotkeyName;
				} else {
					searchVal = this.searchVal;
				}
				this.inputFocus = false;
				// let searchMsg = this.searchVal ? this.searchVal : this.inputPlaceholder;
				uni.$emit("keyWordSearch", {
					name: searchVal,
					isScan: 0,
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.scanCode_box {
		flex: 1;
		display: flex;
		align-items: center;
		position: relative;	
		.scanBox{
			display: flex;
			align-items: center;
			margin: 0 24rpx;
			.scanCode{
				width: 40rpx;
				height: 40rpx;
			}
			// .scanLine{
			// 	margin: 0 24rpx;
			// 	width: 2rpx;
			// 	height: 30rpx;
			// 	background-color: #AEAEAE;
			// }
		}
	}
	.searchBox {
		flex: 1;
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 22rpx;
		height: 70rpx;
		background: #FFFFFF;
		border-radius: 8rpx;		
		// .scanBox{
		// 	display: flex;
		// 	align-items: center;
		// 	.scanCode{
		// 		width: 40rpx;
		// 		height: 40rpx;
		// 	}
		// 	.scanLine{
		// 		margin: 0 24rpx;
		// 		width: 2rpx;
		// 		height: 30rpx;
		// 		background-color: #AEAEAE;
		// 	}
		// }
		.searchInput {
			flex: 1;
			font-size: 28rpx;
			color:#333;
		}
		.searchIcon {
			height: 40rpx;
			width: 40rpx;
			margin-left: 22rpx;
		}
		
		.clearBox {
			position: absolute;
			top: 0;
			right: 20rpx;
			z-index: 99;
			height: 70rpx;
			width: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.clearIcon {
			height: 40rpx;
			width: 40rpx;
		}
		.swiperBox {
			flex: 1;
			height: 70rpx;
			.swiperMsg {
				font-size: 28rpx;
				font-weight: 400;
				color: #AEAEAE;
				line-height: 70rpx;
			}
		}
	}
</style>
