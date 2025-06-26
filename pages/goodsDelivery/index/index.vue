<template>
	<view class="newIndex">
		<view class="topModelBox">
			<view class="indexHead">
				<view class="positioning"@click="getLocation">
					<image class="positioningIcon" src="/static/images/newOrderDetails/whitePositioningIcon.png"></image>
					<view class="msg">{{addressLocation ? addressLocation : '请定位'}}</view>
				</view>
				<view class="messageBtn">
					<!-- <image class="msgIcon" src="/static/images/newOrderDetails/newMessageIcon.png"></image> -->
				</view>
			</view>
			<view class="selectShowModel">
				<view class="selectBtn" @click="changeShowModel(1)">
					<view class="selectMsg" :class="showModelFlag == 1 ? 'btnOnSelected' : 'btnDefault'">发货中</view>
					<view class="selectLine" :class="showModelFlag == 1 ? 'lineOnSelected' : 'lineDefault'"></view>
				</view>
				<view class="selectBtn" @click="changeShowModel(2)">
					<view class="selectMsg" :class="showModelFlag == 2 ? 'btnOnSelected' : 'btnDefault'">发货历史</view>
					<view class="selectLine" :class="showModelFlag == 2 ? 'lineOnSelected' : 'lineDefault'"></view>
				</view>
				<view class="selectBtn" @click="changeShowModel(3)">
					<view class="selectMsg" :class="showModelFlag == 3 ? 'btnOnSelected' : 'btnDefault'">常发货源</view>
					<view class="selectLine" :class="showModelFlag == 3 ? 'lineOnSelected' : 'lineDefault'"></view>
				</view>
			</view>
		</view>
		
		<view class="contentModelBox" style="padding-bottom: 196rpx;" v-if="showModelFlag == 1">
			<swiper class="swiperBox" v-if="advImgList && advImgList[0].advUrl" :autoplay="true">
				<swiper-item>
					<view class="advertisingBox" @click="jumpToAdvertising(advImgList[1])">
						<image class="advImg" :src="advImgList[0].advUrl"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="noticeBox" v-if="hintSwiperText">
				<image class="noticeIcon" src="/static/images/vehicleOptions/noticeIcon.png"></image>
				<uni-notice-bar
					v-if="hintSwiperText"
					background-color="transparent"
					color="#F78B30"
					:speed="50"
					scrollable="true"
					single="true"
					:text="hintSwiperText">
				</uni-notice-bar>
			</view>
			<view class="mainListBox" v-for="(item, index) in newOrderInfo" :key="index">
				<view class="orderBox" @click="jumpToOrderDetails(item)">
					<view class="orderFirstRow">
						<view class="addressCol">
							<text class="addressMsg">{{showSendAddress(item)}}</text>
							<view class="orderDistance">
								<image class="distanceIcon" src="/static/images/newOrderDetails/blueRightArrow.png"></image>
								<view class="distanceMsg">{{item.estimatedDistance}}km</view>
							</view>
							<text class="addressMsg">{{showArriveAddress(item)}}</text>
						</view>
						
					</view>
					<view class="orderSecondRow">
						<text class="orderDetailsMsg">{{showItemLength(item)}}</text>
						<text class="orderDetailsMsg">{{showItemCar(item)}}</text>
						<text class="orderDetailsMsg"> {{item.cargoTypeName4}} {{item.cargoWeight ? ' ' + item.cargoWeight + showCargoUnit(item.cargoUnit) : ''}} {{item.cargoVolume ? ' ' + item.cargoVolume + '方' : ''}} </text>
					</view>
					<view class="orderFleetAndRemark" v-if="showFleet(item) || showRemark(item)">
						<view class="msg" v-if="showFleet(item)">{{showFleet(item)}}</view>
						<view class="msg" style="font-weight: bold;" v-if="showRemark(item)">{{showRemark(item)}}</view>
					</view>
					<view class="orderThridRow">
						<view class="leftContentBox">
							<view class="orderPrice">{{showItemPrice(item)}}</view>
						</view>
						<view class="rightContentBox">
							<view class="sendDate">{{showOrderLoadDate(item)}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="noDataBox" v-if="orderNoData">
				<image class="noOrder" src="/static/images/newOrderDetails/noOrder.png"></image>
			</view>
			<view class="noDataBox" v-show="orderLoading">
				<image class="loadingImg" src="/static/images/listLoading.png"></image>
				努力加载中…
			</view>
			<view class="noDataBox" v-show="orderNoMore">
				没有更多了～
			</view>
			<view class="jumpToSendGoods">
				<view class="jumpBtn" @click="jumpToCreatOrder1()">发货</view>
			</view>
		</view>
		
		<view class="contentModelBox" v-if="showModelFlag == 2">
			<view class="showSelectMsgBox">
				<view class="selectContent" @click="jumpToChooseArea(1, 1, historyLoadAddress)">
					<view class="addressMsg" :style="historyLoadAddress.province ? 'color:#2B72F0;' : 'color:#333;'">
						{{historyLoadAddress.province ? showSelectAddress(historyLoadAddress) : '装货城市'}}
					</view>
					<image class="blueArrow" v-if="historyLoadAddress.province" src="/static/images/newIndex/checkDown.png"></image>
				</view>
				<image class="selectMiddleIcon" src="/static/images/newOrderDetails/blackRightArrow.png"></image>
				<view class="selectContent" @click="jumpToChooseArea(2, 2, historyUnLoadAddress)">
					<view class="addressMsg" :style="historyUnLoadAddress.province ? 'color:#2B72F0;' : 'color:#333;'">
						{{historyUnLoadAddress.province ? showSelectAddress(historyUnLoadAddress) : '卸货城市'}}
					</view>
					<image class="blueArrow" v-if="historyUnLoadAddress.province" src="/static/images/newIndex/checkDown.png"></image>
				</view>
			</view>
			<view class="mainListBox">
				<view class="orderBox" v-for="(item, index) in historyList" :key="index">
					<view class="orderFirstRow">
						<view class="addressCol">
							<text class="addressMsg">{{showSendAddress(item)}}</text>
							<view class="orderDistance">
								<image class="distanceIcon" src="/static/images/newOrderDetails/blueRightArrow.png"></image>
								<view class="distanceMsg">{{item.estimatedDistance}}km</view>
							</view>
							<text class="addressMsg">{{showArriveAddress(item)}}</text>
						</view>
						<view class="orderStatus" v-if="item.orderSecondState">{{showOrderStatus(item.orderSecondState)}}</view>
					</view>
					<view class="orderSecondRow">
						<text class="orderDetailsMsg">{{showItemLength(item)}}</text>
						<text class="orderDetailsMsg">{{showItemCar(item)}}</text>
						<text class="orderDetailsMsg"> {{item.cargoTypeName4}} {{item.cargoWeight ? ' ' + item.cargoWeight + showCargoUnit(item.cargoUnit) : ''}} {{item.cargoVolume ? ' ' + item.cargoVolume + '方' : ''}} </text>
					</view>
					<view class="orderFleetAndRemark" v-if="showFleet(item) || showRemark(item)">
						<view class="msg" v-if="showFleet(item)">{{showFleet(item)}}</view>
						<view class="msg" style="font-weight: bold;" v-if="showRemark(item)">{{showRemark(item)}}</view>
					</view>
					<view class="orderThridRow">
						<view class="leftContentBox">
							<view class="orderPrice">{{showItemPrice(item)}}</view>
							<view class="orderDate">{{showOrderDate(item.createdDt)}}</view>
						</view>
						<view class="rightContentBox" v-if="!item.cargoSource || item.cargoSource != 'HHY'">
							<view class="orderBtn" @click="getOrderAgain(item)">再来一单</view>
						</view>
					</view>
				</view>
			</view>
			<view class="noDataBox" v-if="hisNoData">
				<image class="noOrder" src="/static/images/newOrderDetails/noOrder.png"></image>
			</view>
			<view class="noDataBox" v-show="hisLoading">
				<image class="loadingImg" src="/static/images/listLoading.png"></image>
				努力加载中…
			</view>
			<view class="noDataBox" v-show="hisNoMore">
				没有更多了～
			</view>
		</view>
		
		<view class="contentModelBox" v-if="showModelFlag == 3">
			<view class="showSelectMsgBox">
				<view class="selectContent" @click="jumpToChooseArea(1, 3, commonlyLoadAddress)">
					<view class="addressMsg" :style="commonlyLoadAddress.province ? 'color:#2B72F0;' : 'color:#333;'">
						{{commonlyLoadAddress.province ? showSelectAddress(commonlyLoadAddress) : '装货城市'}}
					</view>
					<image class="blueArrow" v-if="commonlyLoadAddress.province" src="/static/images/newIndex/checkDown.png"></image>
				</view>
				<image class="selectMiddleIcon" src="/static/images/newOrderDetails/blackRightArrow.png"></image>
				<view class="selectContent" @click="jumpToChooseArea(2, 4, commonlyUnLoadAddress)">
					<view class="addressMsg" :style="commonlyUnLoadAddress.province ? 'color:#2B72F0;' : 'color:#333;'">
						{{commonlyUnLoadAddress.province ? showSelectAddress(commonlyUnLoadAddress) : '卸货城市'}}
					</view>
					<image class="blueArrow" v-if="commonlyUnLoadAddress.province" src="/static/images/newIndex/checkDown.png"></image>
				</view>
			</view>
			<view class="mainListBox">
				<view class="orderBox" v-for="(item, index) in commonlyList" :key="index">
					<view class="orderFirstRow">
						<view class="addressCol">
							<text class="addressMsg">{{showSendAddress(item)}}</text>
							<view class="orderDistance">
								<image class="distanceIcon" src="/static/images/newOrderDetails/blueRightArrow.png"></image>
								<view class="distanceMsg">{{item.estimatedDistance}}km</view>
							</view>
							<text class="addressMsg">{{showArriveAddress(item)}}</text>
						</view>
					</view>
					<view class="orderSecondRow">
						<text class="orderDetailsMsg">{{showItemLength(item)}}</text>
						<text class="orderDetailsMsg">{{showItemCar(item)}}</text>
						<text class="orderDetailsMsg"> {{item.cargoTypeName4}} {{item.cargoWeight ? ' ' + item.cargoWeight + showCargoUnit(item.cargoUnit) : ''}} {{item.cargoVolume ? ' ' + item.cargoVolume + '方' : ''}} </text>
					</view>
					<view class="orderFleetAndRemark" v-if="showFleet(item) || showRemark(item)">
						<view class="msg" v-if="showFleet(item)">{{showFleet(item)}}</view>
						<view class="msg" style="font-weight: bold;" v-if="showRemark(item)">{{showRemark(item)}}</view>
					</view>
					<view class="orderThridRow">
						<view class="leftContentBox">
							<view class="orderPrice">{{showItemPrice(item)}}</view>
						</view>
						<view class="rightContentBox">
							<view class="orderBtn" @click="openConfirmPopup(item, index)">取消常发</view>
							<view class="orderBtn" @click="getOrderAgain(item)" v-if="!item.cargoSource || item.cargoSource != 'HHY'">再来一单</view>
						</view>
					</view>
				</view>
			</view>
			<view class="noDataBox" v-if="comNoData">
				<image class="noOrder" src="/static/images/newOrderDetails/noOrder.png"></image>
			</view>
			<view class="noDataBox" v-show="comLoading">
				<image class="loadingImg" src="/static/images/listLoading.png"></image>
				努力加载中…
			</view>
			<view class="noDataBox" v-show="comNoMore">
				没有更多了～
			</view>
		</view>
		
		<!-- 弹出框 -->
		<uni-popup ref="certificationPopup" type="center">
			<view class="hintPopup">
				<view class="hintTitle">温馨提示</view>
				<view class="hintMsg">
					需完成实名认证后，才能发货。
				</view>
				<view class="btn" @click="jumpToCertification()">前往认证</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="deletePopup" type="center">
			<view class="comHintBox">
				<view class="title">是否删除该常发货源？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="closeConfirmPopup()">取消</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @tap="changeCommonState()">确认删除</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	import { longEvent } from "../../../longLink/consignorlongLink.js";
	import * as utilsData from "@/utils/utils.js";
	export default {
		data() {
			return {
				userInfo: {},
				addressLocation: '',
				isLocationFlag: false,
				showModelFlag: 1,
				advImgList: '',
				hintSwiperText: '',
				provinceArr: [],
				pageSize: 10,
				historyList: [],
				hisPageNum: 1,
				hisLoading: false,
				hisNoData: false,
				hisNoMore: false,
				historyLoadAddress: {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				},
				historyUnLoadAddress: {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				},
				commonlyList: [],
				comPageNum: 1,
				comLoading: false,
				comNoData: false,
				comNoMore: false,
				commonlyLoadAddress: {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				},
				commonlyUnLoadAddress: {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				},
				orderPageNum: 1,
				orderSendDate: '',
				orderLoading: false,
				orderNoData: false,
				orderNoMore: false,
				newOrderInfo: [],
				popupObj: {},
				popupKey: '',
			};
		},
		onLoad() {
			this.$emit("ship-index");
			this.getUserDetail();
			// this.getLocation();
			this.getAdvertising();
			this.getBroadcastByDriver();
			this.getProvince();
			this.getOrderListInfo();
			this.getCommonlyListInfo();
			this.getHistoryListInfo();
			
			uni.$on("changeUserRefresh", (data) => {
				this.showModelFlag = 1;
				this.orderPageNum = 1;
				this.newOrderInfo = [];
				this.orderNoData = false;
				this.orderNoMore = false;
				this.getOrderListInfo();
				this.hisPageNum = 1;
				this.historyList = [];
				this.hisNoData = false;
				this.hisNoMore = false;
				this.historyLoadAddress = {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				};
				this.historyUnLoadAddress = {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				};
				this.getHistoryListInfo();
				this.comPageNum = 1;
				this.commonlyList = [];
				this.comNoData = false;
				this.comNoMore = false;
				this.commonlyLoadAddress = {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				};
				this.commonlyUnLoadAddress = {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				};
				this.getCommonlyListInfo();
			});
		},
		onShow() {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : '';
			if (this.userInfo) {
				longEvent(this, () => {});
				var app = getApp();
				let that = this;
				app.globalData.consignorSocketTask.onMessage((res) => {
					console.log("收到服务器内容：" + res.data);
					let data = res.data;
					if (data.length > 10) {
						data = JSON.parse(data);
						if (data.business_type == 'order_message') {
							data.msgContent = JSON.parse(data.msgContent);
							console.log(data);
							if (data.msgContent.userType == "货主") {
								that.changeOrderList(data.msgContent.orderSid, data.msgContent.status);
							}
						}
					}
				});
			}
			this.getPopupAddressInfo();
		},
		onReady() {},
		onPullDownRefresh() { // 下拉刷新
			// this.getOptionInfo();
			switch(this.showModelFlag) {
				case 1:
					this.newOrderInfo = [];
					this.orderPageNum = 1;
					this.orderNoData = false;
					this.orderNoMore = false;
					this.getOrderListInfo();
					break;
				case 2:
					this.historyList = [];
					this.hisPageNum = 1;
					this.hisNoData = false;
					this.hisNoMore = false;
					this.getHistoryListInfo();
					break;
				case 3:
					this.commonlyList = [];
					this.comPageNum = 1;
					this.comNoData = false;
					this.comNoMore = false;
					this.getCommonlyListInfo();
					break;
			}
		},
		onReachBottom() { // 上拉加载
			// if(this.noData || this.noMore || this.isLoading) {
			// 	return false;
			// }
			// this.toLoadCarInfo();
			switch(this.showModelFlag) {
				case 1:
					if(this.orderLoading || this.orderNoData || this.orderNoMore) return false;
					this.orderPageNum = this.orderPageNum + 1;
					this.getOrderListInfo();
					break;
				case 2:
					if(this.hisLoading || this.hisNoData || this.hisNoMore) return false;
					this.hisPageNum = this.hisPageNum + 1;
					this.getHistoryListInfo();
					break;
				case 3:
					if(this.comLoading || this.comNoData || this.comNoMore) return false;
					this.comPageNum = this.comPageNum + 1;
					this.getCommonlyListInfo();
					break;
			}
		},
		methods: {
			showCargoUnit(cargoUnit) {
				return utilsData.showCargoUnit(cargoUnit);
			},
			getUserDetail() { // 获取用户信息
				var userInfo = uni.getStorageSync("userInfo");
				if (userInfo) {
					this.userInfo = JSON.parse(userInfo);
				}
			},
			getLocation() {
				if (this.isLocationFlag) return false;
				this.isLocationFlag = true;
				//获取定位
				var that = this;
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "ios") {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: function(res) {
							// console.log('定位成功', res)
							that.addressLocation = res.address.city
						},
						fail: function(err) {
							console.log('定位失败', err)
						},
						complete: function(com) {
							setTimeout(() => {
								that.isLocationFlag = false;
							}, 10000)
						},
					})
					return;
				}
				if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '将获取您的定位权限以向您展示距离最近的货源信息',
						success: function(res) {
							if (res.confirm) {
								uni.getLocation({
									type: 'gcj02',
									geocode: true,
									success: function(res) {
										// console.log('定位成功', res)
										that.addressLocation = res.address.city
									},
									fail: function(err) {
										console.log('定位失败', err)
									},
									complete: function(com) {
										setTimeout(() => {
											that.isLocationFlag = false;
										}, 10000)
									},
								})
							}
						}
					})
				} else {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: function(res) {
							// console.log('定位成功', res)
							that.addressLocation = res.address.city
						},
						fail: function(err) {
							console.log('定位失败', err)
						},
						complete: function(com) {
							setTimeout(() => {
								that.isLocationFlag = false;
							}, 10000)
						},
					})
				}
				
			},
			changeShowModel(flag) { // 切换展示model
				this.showModelFlag = this.showModelFlag == flag ? this.showModelFlag : flag;
			},
			jumpToAdvertising(item) { // 广告页跳转
				console.log(item);
				if(item.linkType == 'not'){
					uni.previewImage({
						urls: [item.advUrl],
						success: function(data) {
							console.log(data);
						},
						fail: function(err) {
							console.log(err);
						}
					});
				}else if(item.linkType == 'route'){
					uni.navigateTo({
						url: item.linkUrl
					})
				}else{
					getApp().globalData.promoteLinkUrl = item.linkUrl;
					uni.navigateTo({
						url: '/pages/advertisingH5/advertisingH5'
					})
				}
			},
			getAdvertising() { // 获取广告页
				let params = {
					"locationCodeS": [
						"FIRST_SMALL_BANNER",
						"FIRST_BIG_BANNER",
					]
				};
				let that = this;
				utils.postRequest('/ts/advertising/get_to_shipper', params)
				.then(function(res) {
					// console.log('广告数据', res);
					if (res.retCode == '0000000') {
						let items = res.rspBody;
						if (items && items.length > 0) {
							that.advImgList = items;
						}
					} else {
						console.log('广告图获取失败', res.retDesc);
					}
				})
				.catch(err => {
					console.log('广告图请求失败', res.retDesc);
				})
			},
			getBroadcastByDriver() {// 消息通告
				let that = this;
				utils.postRequest('/ts/finance/broadcast/getBroadcastByShipper')
				.then(res=>{
					// console.log('货源广场', res);
					if(res.retCode == '0000000') {
						that.hintSwiperText = res.rspBody.broadcast;
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			getProvince() { // 从本地缓存获取省市区数据，本地缓存没有则从接口获取，再存入缓存
				var provinceLocal = uni.getStorageSync("regionData");
				if(provinceLocal) {
					this.provinceArr = provinceLocal;
					// this.pushDiyCityItem(this.provinceArr[0].code, 0);
				}else {
					let that = this;
					utils.postRequest('/ts/nationDict/getBasicData')
					.then(res => {
						if (res.retCode == "0000000") {
							var provinceArr = res.rspBody;
							that.provinceArr = provinceArr;
							// that.pushDiyCityItem(provinceArr[0].code, 0);
							uni.setStorage({
								key: 'regionData',
								data: res.rspBody,
								success: function(saveRes) {
									// console.log('地区数据缓存成功！', saveRes);
									uni.setStorageSync('regionUpdate', 1)
								},
								fail: function(saveErr) {
									// console.log('地区数据缓存失败！', saveErr);
								}
							});
						} else {
							// console.log('地区接口异常：', res.retDesc);
						}
					})
					.catch(err => {
						// console.log('地区接口请求异常：', err);
					})
				}
			},
			getOrderListInfo() { // 货源列表
				if(this.orderLoading) return;
				this.orderLoading = true;
				let params = {
					"pageNum": this.orderPageNum,
					"pageSize": this.pageSize,
				}
				console.log('货源查询参数', params);
				let that = this;
				utils.newQueryPostRequest('/td/order/new/findList', params)
				.then(res=>{
					that.orderLoading = false;
					// console.log('货源列表', res);
					if(res.retCode == '0000000') {
						that.orderSendDate = res.timestamp;
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							that.newOrderInfo = [...that.newOrderInfo, ...items];
							if(items.length < that.pageSize) {
								that.orderNoMore = true;
							}
						}
						console.log('货源列表',that.newOrderInfo['0']);
						if(that.newOrderInfo.length == 0) {
							that.orderNoData = true;
						}
						that.$forceUpdate();
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					that.orderLoading = false;
					console.log(err);
				})
				uni.stopPullDownRefresh();
			},
			getCommonlyListInfo() { // 常发列表
				if(this.comLoading) return;
				this.comLoading = true;
				let loadCityCode = this.commonlyLoadAddress.cityCode && this.commonlyLoadAddress.cityCode != this.commonlyLoadAddress.provinceCode ? this.commonlyLoadAddress.cityCode : '';
				let loadAreaCode = this.commonlyLoadAddress.areaCode && this.commonlyLoadAddress.areaCode != this.commonlyLoadAddress.cityCode ? this.commonlyLoadAddress.areaCode : '';
				let unloadCityCode = this.commonlyUnLoadAddress.cityCode && this.commonlyUnLoadAddress.cityCode != this.commonlyUnLoadAddress.provinceCode ? this.commonlyUnLoadAddress.cityCode : '';
				let unloadAreaCode = this.commonlyUnLoadAddress.areaCode && this.commonlyUnLoadAddress.areaCode != this.commonlyUnLoadAddress.cityCode ? this.commonlyUnLoadAddress.areaCode : '';
				let params = {
					"pageNum": this.comPageNum,
					"pageSize": this.pageSize,
					"loadProvinceCode": this.commonlyLoadAddress.provinceCode ? this.commonlyLoadAddress.provinceCode : undefined,
					"loadCityCode": loadCityCode ? loadCityCode : undefined,
					"loadAreaCode": loadAreaCode ? loadAreaCode : undefined,
					"unloadProvinceCode": this.commonlyUnLoadAddress.provinceCode ? this.commonlyUnLoadAddress.provinceCode : undefined,
					"unloadCityCode": unloadCityCode ? unloadCityCode : undefined,
					"unloadAreaCode": unloadAreaCode ? unloadAreaCode : undefined,
					// "newCargoFlag": 1
				}
				// console.log('常发查询参数', params);
				let that = this;
				utils.newQueryPostRequest('/td/order/getCommonUseStateList', params)
				.then(res=>{
					that.comLoading = false;
					// console.log('常发列表', res);
					if(res.retCode == '0000000') {
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							that.commonlyList = [...that.commonlyList, ...items];
							console.log('常发列表', that.commonlyList[0]);
							if(items.length < that.pageSize) {
								that.comNoMore = true;
							}
						}
						if(that.commonlyList.length == 0) {
							that.comNoData = true;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					that.comLoading = false;
					console.log(err);
				})
				uni.stopPullDownRefresh();
			},
			getHistoryListInfo() { // 历史列表
				if(this.hisLoading) return;
				this.hisLoading = true;
				let loadCityCode = this.historyLoadAddress.cityCode && this.historyLoadAddress.cityCode != this.historyLoadAddress.provinceCode ? this.historyLoadAddress.cityCode : '';
				let loadAreaCode = this.historyLoadAddress.areaCode && this.historyLoadAddress.areaCode != this.historyLoadAddress.cityCode ? this.historyLoadAddress.areaCode : '';
				let unloadCityCode = this.historyUnLoadAddress.cityCode && this.historyUnLoadAddress.cityCode != this.historyUnLoadAddress.provinceCode ? this.historyUnLoadAddress.cityCode : '';
				let unloadAreaCode = this.historyUnLoadAddress.areaCode && this.historyUnLoadAddress.areaCode != this.historyUnLoadAddress.cityCode ? this.historyUnLoadAddress.areaCode : '';
				let params = {
					"pageNum": this.hisPageNum,
					"pageSize": this.pageSize,
					"loadProvinceCode": this.historyLoadAddress.provinceCode ? this.historyLoadAddress.provinceCode : undefined,
					"loadCityCode": loadCityCode ? loadCityCode : undefined,
					"loadAreaCode": loadAreaCode ? loadAreaCode : undefined,
					"unloadProvinceCode": this.historyUnLoadAddress.provinceCode ? this.historyUnLoadAddress.provinceCode : undefined,
					"unloadCityCode": unloadCityCode ? unloadCityCode : undefined,
					"unloadAreaCode": unloadAreaCode ? unloadAreaCode : undefined,
				}
				// console.log('历史查询参数', params);
				let that = this;
				utils.newQueryPostRequest('/td/order/getSupplyHistoryList', params)
				.then(res=>{
					that.hisLoading = false;
					// console.log('历史列表', res);
					if(res.retCode == '0000000') {
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							that.historyList = [...that.historyList, ...items];
							console.log('历史列表', that.historyList[2]);
							if(items.length < that.pageSize) {
								that.hisNoMore = true;
							}
						}
						// console.log('历史列表',that.historyList['0']);
						if(that.historyList.length == 0) {
							that.hisNoData = true;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					that.hisLoading = false;
					console.log(err);
				})
				uni.stopPullDownRefresh();
			},
			jumpToCreatOrder() { // 下一步跳转创建订单页
				if (!utils.btnRepeat()) return false; // 防抖
				if (!publicData.getUserPermissions(1)) { // 认证信息验证
					this.$refs.certificationPopup.open();
					return false;
				}
				uni.navigateTo({
					url: '../creatOrder/creatOrder?orderAgain=1'
				});
			},
			jumpToCreatOrder1() {
				//发货
				if (!utils.btnRepeat()) return false; // 防抖
				if (!publicData.getUserPermissions(1)) { // 认证信息验证
					this.$refs.certificationPopup.open();
					return false;
				}
				uni.navigateTo({
					url: '../creatOrder/creatOrder'
				});
			},
			jumpToCertification() { // 前往认证
				if (!utils.btnRepeat()) return false; // 防抖
				this.$refs.certificationPopup.close();
				//判断是新增认证还是编辑认证
				var userInfo = uni.getStorageSync("userInfo");
				var userCode = JSON.parse(userInfo).attrs.userCode;
				utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
				.then(res=>{
					console.log('用户详细信息', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						var idNo = res.rspBody.idNo;
						if (idNo) {
							uni.navigateTo({
								url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
							})
						} else {
							uni.navigateTo({
								url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
							})
						}
						
					}
				})
			},
			showItemLength(item) { // 展示车长
				let returnMsg = item.vehicleLength1 ? item.vehicleLength1 : '';
				returnMsg = returnMsg == '-1.0' || returnMsg == -1 ? '不限车长' : returnMsg + '米';
				returnMsg = item.vehicleLength2 ? returnMsg + '/' + item.vehicleLength2 + '米' : returnMsg;
				return returnMsg;
			},
			showItemCar(item) { // 展示车型
				let returnMsg = item.vehicleModel1 ? item.vehicleModel1 : '';
				returnMsg = item.vehicleModel2 ? returnMsg + '/' + item.vehicleModel2 : returnMsg;
				return returnMsg;
			},
			showItemPrice(item) { // 展示货源价格
				if(item.fixPriceFlag == '1') {
					let fixPrice = item.fixPrice ? Number(item.fixPrice) / 100 : 0;
					return '¥' + fixPrice + '元/' + item.quotePriceTypeName
				}else {
					return '价格电议';
				}
			},
			showOrderLoadDate(item) { // 展示发货时间
				let startTime = item.pushDt.replace(/-/g, '/');
				let systemTimeAry = this.orderSendDate.split('.');
				let systemTime = systemTimeAry && systemTimeAry[0] ? systemTimeAry[0].replace(/-/g, '/') : '';
				if(startTime && systemTime) {
					var finishDate = new Date(startTime);
					var nowDate = new Date(systemTime);
					var dateDiff = nowDate - finishDate;//时间差的毫秒数
					//计算出相差天数
					var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
					//计算出小时数
					var leave1=dateDiff%(24*3600*1000); //计算天数后剩余的毫秒数
					var hours=Math.floor(leave1/(3600*1000));
					//计算相差分钟数
					var leave2=leave1%(3600*1000); //计算小时数后剩余的毫秒数
					var minutes=Math.floor(leave2/(60*1000));
					//计算相差秒数
					var leave3=leave2%(60*1000); //计算分钟数后剩余的毫秒数
					var seconds=Math.round(leave3/1000);
					if(Number(dayDiff) && Number(dayDiff) > 0) {
						return dayDiff + "天前" 
					}else if(Number(hours && Number(hours) > 0)) {
						return hours + "小时前" 
					}else if(Number(minutes) && Number(minutes) > 0) {
						return minutes + "分钟前" 
					}else{
						return '刚刚'
					}
				}
			},
			jumpToOrderDetails(item) {
				if(item.cargoSource == 'WX_ZKC') {
					uni.showToast({
						title: '该货源暂无详情',
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '../orderDetails/orderDetails?sid=' + item.sid
				})
			},
			showSendAddress(item) { // 发货地
				let obj = {
					province: item.provinceName1,
					provinceCode: item.provinceCode1,
					city: item.cityName1,
					cityCode: item.cityCode1,
					area: item.areaName1,
					areaCode: item.areaCode1,
				}
				return this.showAddressMsg(obj);
			},
			showAddressMsg(obj) { // 展示地区
				if(obj.provinceCode == '310000' || obj.provinceCode == '110000' || obj.provinceCode == '500000' || obj.provinceCode == '120000') {
					if(obj.provinceCode == obj.cityCode) {
						return obj.province;
					}else {
						let returnMsg = obj.province;
						returnMsg = obj.city ? returnMsg + ' ' + obj.city : returnMsg;
						return returnMsg;
					}
				}else {
					if(!obj.cityCode) {
						return obj.province
					}else if(obj.cityCode == obj.areaCode) {
						return obj.city;
					}else {
						let returnMsg = obj.city;
						returnMsg = obj.area ? returnMsg + ' ' + obj.area : returnMsg;
						return returnMsg;
					}
				}
			},
			showArriveAddress(item) { // 目的地
				let obj = {};
				if(item.provinceName10) {
					obj = {
						province: item.provinceName10,
						provinceCode: item.provinceCode10,
						city: item.cityName10,
						cityCode: item.cityCode10,
						area: item.areaName10,
						areaCode: item.areaCode10,
					}
				}else if(item.provinceName9){
					obj = {
						province: item.provinceName9,
						provinceCode: item.provinceCode9,
						city: item.cityName9,
						cityCode: item.cityCode9,
						area: item.areaName9,
						areaCode: item.areaCode9,
					}
				}
				else if(item.provinceName8){
					obj = {
						province: item.provinceName8,
						provinceCode: item.provinceCode8,
						city: item.cityName8,
						cityCode: item.cityCode8,
						area: item.areaName8,
						areaCode: item.areaCode8,
					}
				}
				else if(item.provinceName4){
					obj = {
						province: item.provinceName4,
						provinceCode: item.provinceCode4,
						city: item.cityName4,
						cityCode: item.cityCode4,
						area: item.areaName4,
						areaCode: item.areaCode4,
					}
				}
				else if(item.provinceName3){
					obj = {
						province: item.provinceName3,
						provinceCode: item.provinceCode3,
						city: item.cityName3,
						cityCode: item.cityCode3,
						area: item.areaName3,
						areaCode: item.areaCode3,
					}
				}
				return this.showAddressMsg(obj);
			},
			changeOrderList(sid, status) { // 收到websocket状态变更消息后本地删除匹配数据
				for (let i in this.newOrderInfo) {
					if (this.newOrderInfo[i].sid == sid && (Number(status) != 13 && Number(status) != 14)) {
						this.newOrderInfo.splice(i, 1);
						break;
					}
				}
				for (let a in this.historyList) {
					if (this.historyList[a].sid == sid) {
						this.historyList[a].orderSecondState = Number(status);
						break;
					}
				}
				this.$forceUpdate();
			},
			getPopupAddressInfo() { // 将地址选择页保存的全局舒服赋值到弹窗地址
				let newAddressChooseSerial = getApp().globalData.newChooseAddressObj;
				if(this.setTypeNum) {
					switch(this.setTypeNum) {
						case 1:
							this.historyLoadAddress = {...newAddressChooseSerial};
							console.log('历史装货', this.historyLoadAddress);
							this.historyList = [];
							this.hisPageNum = 1;
							this.hisNoData = false;
							this.hisNoMore = false;
							this.getHistoryListInfo();
							break;
						case 2:
							this.historyUnLoadAddress = {...newAddressChooseSerial};
							console.log('历史卸货', this.historyUnLoadAddress);
							this.historyList = [];
							this.hisPageNum = 1;
							this.hisNoData = false;
							this.hisNoMore = false;
							this.getHistoryListInfo();
							break;
						case 3:
							this.commonlyLoadAddress = {...newAddressChooseSerial};
							console.log('常发装货', this.historyLoadAddress);
							this.commonlyList = [];
							this.comPageNum = 1;
							this.comNoData = false;
							this.comNoMore = false;
							this.getCommonlyListInfo();
							break;
						case 4:
							this.commonlyUnLoadAddress = {...newAddressChooseSerial};
							console.log('常发卸货', this.historyUnLoadAddress);
							this.commonlyList = [];
							this.comPageNum = 1;
							this.comNoData = false;
							this.comNoMore = false;
							this.getCommonlyListInfo();
							break;
					}
						
					// this.addressPopupObj.province = newAddressChooseSerial.province ? newAddressChooseSerial.province : '';
					// this.addressPopupObj.provinceCode = newAddressChooseSerial.provinceCode ? newAddressChooseSerial.provinceCode : '';
					// this.addressPopupObj.city = newAddressChooseSerial.city ? newAddressChooseSerial.city : '';
					// this.addressPopupObj.cityCode = newAddressChooseSerial.cityCode ? newAddressChooseSerial.cityCode : '';
					// this.addressPopupObj.area = newAddressChooseSerial.area ? newAddressChooseSerial.area : '';
					// this.addressPopupObj.areaCode = newAddressChooseSerial.areaCode ? newAddressChooseSerial.areaCode : '';
					this.setTypeNum = '';
					getApp().globalData.newChooseAddressObj = {};
				}
			},
			jumpToChooseArea(typeKey, typeNum, obj) {
				this.setTypeNum = typeNum;
				let areaObj = {
					province: obj.province,
					provinceCode: obj.provinceCode,
					city: obj.city,
					cityCode: obj.cityCode,
					area: obj.area,
					areaCode: obj.areaCode,
				}
				let areaMsg = JSON.stringify(areaObj);
				uni.navigateTo({ // 创建地址需根据点击的装货地或卸货地改变地址选择页的页面名称
					url: '/pages/chooseArea/chooseArea?addressTypeKey=' + typeKey + '&addressTypeNum=' + typeNum + '&areaMsg=' + areaMsg + '&pageFlag=indexSearch'
				})
			},
			showSelectAddress(item) { // 展示地址
				if(item.provinceCode == item.cityCode) {
					return item.province
				}else if(item.cityCode == item.areaCode) {
					return item.province + item.city;
				}else {
					let returnMsg = item.province;
					returnMsg = item.city ? returnMsg + item.city : returnMsg;
					returnMsg = item.area ? returnMsg + item.area : returnMsg;
					return returnMsg;
				}
			},
			showOrderStatus(status) { // 展示订单状态
				switch(status) {
					case 11:
						return '待接单';
					case 12:
						return '已接单';
					case 13:
						return '已接单' ; // 询价中
					case 14:
						return '已成交' ; // 已报价
					case 15:
						return '已下架' ;
					case 16:
						return '已成交' ;
					case 17:
						return '未成交';
					case 18:
						return '未成交';
					case 19:
						return '待发布' ;
					default:
						return '未成交' ;
				}
			},
			closeConfirmPopup() { // 关闭确认取消的弹出框
				this.$refs.deletePopup.close()
			},
			openConfirmPopup(item, key) {
				if(!utils.btnRepeat()) return false; // 防抖
				this.popupObj = item;
				this.popupKey = key;
				this.$refs.deletePopup.open()
			},
			changeCommonState() { // 取消常发货源
				let item = this.popupObj;
				let key = this.popupKey;
				let params = {
					sid: item.sid,
					commonUseState: 0,
				}
				let that = this;
				utils.postRequest('/td/order/commonUseState', params)
				.then(function (res) {
					console.log('常发结果', res);
					if(res.retCode == '0000000'){
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						that.$refs.deletePopup.close()
						that.commonlyList.splice(key, 1);
						that.$forceUpdate();
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
				})
			},
			showOrderDate(str) {
				return str.substring(5, 16)
			},
			getOrderAgain(item) { // 再来一单
				console.log(item);
				uni.showLoading();
				let vehicleLength = item.child.orderVehicleLengthVOs;
				var vehicleLengthAry = [];
				for(let i in vehicleLength) {
					let obj = {
						"sid": vehicleLength[i].vehicleLengthCode,
						"typeName": vehicleLength[i].vehicleLength == '-1' ? '不限车长' : vehicleLength[i].vehicleLength,
					}
					vehicleLengthAry.push(obj);
				}
				let vehicleModel = item.child.orderVehicleModelVOS;
				var vehicleModelAry = [];
				for(let i in vehicleModel) {
					let obj = {
						"sid": vehicleModel[i].vehicleModelCode,
						"typeName": vehicleModel[i].vehicleModel,
					}
					vehicleModelAry.push(obj);
				}
				getApp().globalData.carTypeVo = {
					vehicleLength: vehicleLengthAry,
					vehicleModel: vehicleModelAry,
					vehicleNumber: item.multiTruck ? item.multiTruck : 1,
				};
				let addressAry = item.child.orderAddressVOS;
				let orderContactsVOS = item.child.orderContactsVOS;
				for(let i in addressAry) {
					switch(addressAry[i].serialnumber) {
						case 1:
							getApp().globalData.addressObject.loadGoods1 = {
								address: addressAry[i].address ? addressAry[i].address : '',
								area: addressAry[i].area ? addressAry[i].area : '',
								areaCode: addressAry[i].areaCode ? addressAry[i].areaCode : '',
								city: addressAry[i].city ? addressAry[i].city : '',
								cityCode: addressAry[i].cityCode ? addressAry[i].cityCode : '',
								province: addressAry[i].province ? addressAry[i].province : '',
								provinceCode: addressAry[i].provinceCode ? addressAry[i].provinceCode : '',
								longitude: addressAry[i].longitude ? addressAry[i].longitude : '',
								latitude: addressAry[i].latitude ? addressAry[i].latitude : '',
								mobile: addressAry[i].mobile ? addressAry[i].mobile : '',
								userName: addressAry[i].userName ? addressAry[i].userName : '',
							};
							getApp().globalData.contactUser.user1 = {
								mobile: orderContactsVOS[i].mobile,
								userIds: undefined,
								serialnumber: 1,
								userName: orderContactsVOS[i].userName,
							};
							break;
						case 2:
							getApp().globalData.addressObject.loadGoods2 = {
								address: addressAry[i].address ? addressAry[i].address : '',
								area: addressAry[i].area ? addressAry[i].area : '',
								areaCode: addressAry[i].areaCode ? addressAry[i].areaCode : '',
								city: addressAry[i].city ? addressAry[i].city : '',
								cityCode: addressAry[i].cityCode ? addressAry[i].cityCode : '',
								province: addressAry[i].province ? addressAry[i].province : '',
								provinceCode: addressAry[i].provinceCode ? addressAry[i].provinceCode : '',
								longitude: addressAry[i].longitude ? addressAry[i].longitude : '',
								latitude: addressAry[i].latitude ? addressAry[i].latitude : '',
								mobile: addressAry[i].mobile ? addressAry[i].mobile : '',
								userName: addressAry[i].userName ? addressAry[i].userName : '',
							};
							break;
						case 3:
							getApp().globalData.addressObject.unloadGoods1 = {
								address: addressAry[i].address ? addressAry[i].address : '',
								area: addressAry[i].area ? addressAry[i].area : '',
								areaCode: addressAry[i].areaCode ? addressAry[i].areaCode : '',
								city: addressAry[i].city ? addressAry[i].city : '',
								cityCode: addressAry[i].cityCode ? addressAry[i].cityCode : '',
								province: addressAry[i].province ? addressAry[i].province : '',
								provinceCode: addressAry[i].provinceCode ? addressAry[i].provinceCode : '',
								longitude: addressAry[i].longitude ? addressAry[i].longitude : '',
								latitude: addressAry[i].latitude ? addressAry[i].latitude : '',
								mobile: addressAry[i].mobile ? addressAry[i].mobile : '',
								userName: addressAry[i].userName ? addressAry[i].userName : '',
							};
							break;
						case 4:
							getApp().globalData.addressObject.unloadGoods2 = {
								address: addressAry[i].address ? addressAry[i].address : '',
								area: addressAry[i].area ? addressAry[i].area : '',
								areaCode: addressAry[i].areaCode ? addressAry[i].areaCode : '',
								city: addressAry[i].city ? addressAry[i].city : '',
								cityCode: addressAry[i].cityCode ? addressAry[i].cityCode : '',
								province: addressAry[i].province ? addressAry[i].province : '',
								provinceCode: addressAry[i].provinceCode ? addressAry[i].provinceCode : '',
								longitude: addressAry[i].longitude ? addressAry[i].longitude : '',
								latitude: addressAry[i].latitude ? addressAry[i].latitude : '',
								mobile: addressAry[i].mobile ? addressAry[i].mobile : '',
								userName: addressAry[i].userName ? addressAry[i].userName : '',
							};
							break;
					}
				}
				// console.log('再来一单地址信息', getApp().globalData.addressObject);
				let orderValueAddedVOS = item.child.orderValueAddedVOS;
				getApp().globalData.orderOtherData = {
					needReceipt: item.receiptType == 1 ? true : false,
					declaredValue: orderValueAddedVOS && orderValueAddedVOS.declaredValue ? orderValueAddedVOS.declaredValue / 100 : undefined,
					guaranteeFlag: orderValueAddedVOS && orderValueAddedVOS.declaredValue ? 1 : 2,
				};
				let orderQuoteVO = item.child.orderQuoteVO;
				getApp().globalData.costInformation = {
					infoPrice: orderQuoteVO.informationPrice ? orderQuoteVO.informationPrice / 100 : '',
					hopePrice: item.fixPriceFlag == 1 ||  item.fixPriceFlag == '1' ? item.fixPrice / 100 : '',
					hopePriceSyb: orderQuoteVO.quotePriceTypeName,
					quotationWay: item.fixPriceFlag == 1 || item.fixPriceFlag == '1' ? 1 : 2,
					needInvoiceFlag: item.needInvoiceFlag ? item.needInvoiceFlag : 2,
					informationFlag: item.informationFlag ? item.informationFlag : 2,
				};
				let checkedCarGroup = [];
				if(item.fleetSids) {
					checkedCarGroup = JSON.parse(item.fleetSids);
				}
				getApp().globalData.creatScope = { // 发布范围
					creatScopeType: item.supply == 9 ? [1, 2] : checkedCarGroup.length > 0 ? [2] : [1],
					checkedGroup: checkedCarGroup
				};
				getApp().globalData.defaultContact.monthCheckVal = '0';
				getApp().globalData.defaultContact.startCheckedMonth = '0';
				getApp().globalData.defaultContact.startHourCheckVal = '0';
				getApp().globalData.handlingInstructions = {
					handingRequiredVal: [],
					orderRemark: item.remark ? item.remark : '',
				};
				let orderLoadFactorVOS = item.child.orderLoadFactorVOS;
				if(orderLoadFactorVOS) {
					var orderLoadFactorVOSAry = [];
					for(let i in orderLoadFactorVOS) {
						let obj = {
							typeName: orderLoadFactorVOS[i].loadFactor,
							sid: orderLoadFactorVOS[i].loadFactorCode,
						}
						orderLoadFactorVOSAry.push(obj);
					}
					getApp().globalData.handlingInstructions.handingRequiredVal = orderLoadFactorVOSAry;
				}
				getApp().globalData.newGoodsObj = {
					id: item.cargoId ? item.cargoId : '',
					name: item.cargoId ? item.cargoTypeName4 : '',
					goodsWeight: item.cargoWeight ? item.cargoWeight : '',
					goodsVolume: item.cargoVolume ? item.cargoVolume : '',
				}
				getApp().globalData.newGoodsObj = {
					id: item.cargoId ? item.cargoId : '',
					name: item.cargoId ? item.cargoTypeName4 : '',
					goodsWeight: item.cargoWeight ? item.cargoWeight : '',
					goodsVolume: item.cargoVolume ? item.cargoVolume : '',
				}
				var orderFenceVOS = item.child.orderFenceVOS;
				if (orderFenceVOS && orderFenceVOS.length > 0) {
					var zhuang = orderFenceVOS.find(atem => {
						return atem.fenceType == 1
					})
					var xie = orderFenceVOS.find(atem => {
						return atem.fenceType == 2
					})
					var electronInfo = {
						zhuang: zhuang,
						xie: xie,
					}
					getApp().globalData.electronInfo = electronInfo
				} else {
					getApp().globalData.electronInfo = null
				}
				
				uni.hideLoading();
				
				this.jumpToCreatOrder();
			},
			showFleet(item) {
				if(!item.supply) {
					return '全平台';
				}else {
					let returnMsg = '';
					if(item.supply == 9 || item.supply == 1) {
						returnMsg = '全平台';
					}
					if(item.fleetSids) {
						let checkedCarGroup = [];
						checkedCarGroup = JSON.parse(item.fleetSids);
						if(checkedCarGroup.length > 0) {
							let nameStr = [];
							for(let i in checkedCarGroup) {
								nameStr.push(checkedCarGroup[i].name);
							}
							nameStr = nameStr.toString();
							nameStr = nameStr.replace(/,/g, ";");
							nameStr = returnMsg ? returnMsg + '，' + nameStr : nameStr;
							return nameStr;
						}
					}
					return returnMsg;
				}
				// if(item.fleetSids) {
				// 	let checkedCarGroup = [];
				// 	checkedCarGroup = JSON.parse(item.fleetSids);
				// 	if(checkedCarGroup.length > 0) {
				// 		let nameStr = [];
				// 		for(let i in checkedCarGroup) {
				// 			nameStr.push(checkedCarGroup[i].name);
				// 		}
				// 		nameStr = nameStr.toString();
				// 		nameStr = nameStr.replace(/,/g, ";");
				// 		return nameStr;
				// 	}else {
				// 		return '';
				// 	}
				// }else {
				// 	return '';
				// }
			},
			showRemark(item) {
				let msg = item.remark ? item.remark : '';
				let loadFactors = item.loadFactors ? item.loadFactors.replace(/,/g, '、') : '';
				msg = msg && loadFactors ? msg + '、' + loadFactors : msg + loadFactors;
				// let ary = item.orderChild.orderLoadFactorVOS;
				// if(ary && ary.length > 0) {
				// 	for(let i in ary) {
				// 		msg = msg + ary[i].loadFactor + '、';
				// 	}
				// 	msg = msg.substring(0, msg.length -1);
				// }
				// let receiptTypeMsg = item.receiptType == 1 ? '需要回单' : '不需要回单';
				// msg = msg ? msg + '、' + receiptTypeMsg : receiptTypeMsg;
				msg = msg ? '备注：' + msg : '';
				return msg;
			},
		}
	}
</script>

<style lang="scss">
	.newIndex {
		min-height: calc(100vh - 270rpx);
		padding-top: 270rpx;
		.topModelBox {
			position: fixed;
			top:0;
			left: 0;
			width: 100vw;
			height: 270rpx;
			background: linear-gradient(135deg, #5994FE 0%, #2055C6 100%);
			box-sizing: border-box;
			padding: 98rpx 0 0 0;
			z-index: 100;
			.indexHead {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.positioning {
					display: flex;
					align-items: center;
					padding: 0 34rpx;
					.positioningIcon {
						width: 35rpx;
						height: 40rpx;
					}
					.msg {
						font-size: 24rpx;
						color: #FFFFFF;
						padding-left: 6rpx
					}
				}
				.messageBtn {
					padding: 0 32rpx;
					.msgIcon {
						width: 48rpx;
						height: 48rpx;
					}
				}
			}
			.selectShowModel {
				padding: 40rpx 10rpx 0 10rpx;
				display: flex;
				.btnOnSelected{
					font-size: 36rpx;
					font-weight: 500;
					color: #FFFFFF;
					animation: onSelectedAnimate 0.1s;
				}
				@keyframes onSelectedAnimate {
					0% {
						font-size: 32rpx;
						font-weight: 400;
						color: rgba(255,255,255,0.66);
					}
				
					100% {
						font-size: 36rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
				.btnDefault {
					font-size: 32rpx;
					font-weight: 400;
					color: rgba(255,255,255,0.66);
					animation: onDefaultAnimate 0.1s;
				}
				@keyframes onDefaultAnimate {
					0% {
						font-size: 36rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
				
					100% {
						font-size: 32rpx;
						font-weight: 400;
						color: rgba(255,255,255,0.66);
					}
				}
				.selectBtn {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 190rpx;
					.selectMsg {
						line-height: 44rpx;
					}
					.selectLine {
						height: 6rpx;
						border-radius: 26rpx;
						margin-top: 8rpx;
					}
				}
				.lineOnSelected{
					width: 78rpx;
					background: #FFFFFF;
					animation: onSelectedLineAnimate 0.2s;
				}
				@keyframes onSelectedLineAnimate {
					0% {
						width: 1rpx;
						background-color: transparent;
					}
				
					100% {
						width: 78rpx;
						background: #FFFFFF;
					}
				}
				.lineDefault {
					width: 1rpx;
					background-color: transparent;
					animation: onDefaultLineAnimate 0.2s;
				}
				@keyframes onDefaultLineAnimate {
					0% {
						width: 78rpx;
						background: #FFFFFF;
					}
				
					100% {
						width: 1rpx;
						background-color: transparent;
					}
				}
			}
		}
		.contentModelBox {
			padding-top: 24rpx;
			.swiperBox {
				height: 150rpx;
				width: 100vw;
				.advertisingBox {
					height: 150rpx;
					position: relative;
					padding: 0 36rpx;
					.advImg {
						height: 150rpx;
						width: 100%;
						border-radius: 24rpx;
					}
				}
			}
			.noticeBox {
				margin: 16rpx 36rpx 0 36rpx;
				padding: 8rpx 58rpx 8rpx 26rpx;
				background: #FFEBBE;
				box-shadow: 0px 0px 38rpx 2rpx rgba(255,193,63,0.44);
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				.noticeIcon {
					flex-shrink: 0;
					width: 27rpx;
					height: 35rpx;
					margin-right:24rpx;
				}
			}
			.showSelectMsgBox {
				width: 674rpx;
				height: 64rpx;
				background: #F8F8F8;
				border-radius: 114rpx;
				box-sizing: border-box;
				margin: 0 auto;
				padding: 0 48rpx;
				display: flex;
				align-items: center;
				.selectContent {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					.addressMsg {
						max-width: 193rpx;
						height: 44rpx;
						line-height: 44rpx;
						font-size: 32rpx;
						font-weight: 500;
						color: #2B72F0;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
						padding-right: 8rpx;
						box-sizing: border-box;
					}
					.blueArrow {
						width: 27rpx;
						height: 15rpx;
					}
				}
				.selectMiddleIcon {
					flex-shrink: 0;
					width: 50rpx;
					height: 16rpx;
					padding: 0 48rpx;
				}
			}
			.mainListBox {
				margin: 12rpx 0 0 0;
				.orderBox {
					padding: 28rpx 48rpx 24rpx 0;
					margin-left: 36rpx;
					border-bottom: 2rpx solid #979797;
					.orderFirstRow {
						display: flex;
						justify-content: space-between;
						.addressCol {
							flex: 1;
							line-height: 42rpx;
							.addressMsg {
								font-size: 36rpx;
								font-weight: 600;
								color: #333333;
							}
							.orderDistance {
								width: 104rpx;
								display: inline-block;
								vertical-align:-6rpx;
								.distanceIcon {
									width: 50rpx;
									height: 16rpx;
									padding: 0 26rpx;
								}
								.distanceMsg {
									height: 20rpx;
									font-size: 24rpx;
									line-height: 20rpx;
									color: #EE6502;
									text-align: center;
								}
							}
						}
						.orderStatus {
							flex-shrink: 0;
							font-size: 32rpx;
							color: #EE6502;
							line-height: 36rpx;
							padding-left: 64rpx;
						}
					}
					.orderSecondRow {
						margin-top: 24rpx;
						min-height: 32rpx;
						line-height: 32rpx;
						.orderDetailsMsg + .orderDetailsMsg {
							padding-left: 24rpx;
						}
						.orderDetailsMsg {
							font-size: 32rpx;
							color: #666666;
						}
					}
					.orderFleetAndRemark {
						margin-top: 24rpx;
						// min-height: 28rpx;
						// line-height: 28rpx;
						// display:flex;
						.msg + .msg {
							padding-top: 16rpx;
						}
						.msg {
							line-height: 28rpx;
							font-size: 28rpx;
							font-weight: 500;
							color: #333333;
							box-sizing: border-box;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							word-break: break-all;
						}
					}
					.orderThridRow {
						margin-top: 24rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.leftContentBox {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							align-items: center;
							.orderPrice {
								font-size: 32rpx;
								font-weight: 600;
								color: #EE6502;
								line-height: 44rpx;
							}
							.orderDate {
								font-size: 24rpx;
								color: #666666;
								line-height: 24rpx;
								margin-top: 8rpx;
							}
						}
						.rightContentBox {
							display: flex;
							.orderBtn + .orderBtn {
								margin-left: 24rpx;
							}
							.orderBtn {
								width: 208rpx;
								height: 72rpx;
								line-height: 72rpx;
								border-radius: 8rpx;
								border: 2rpx solid #2B72F0;
								box-sizing: border-box;
								font-size: 32rpx;
								font-weight: 500;
								color: #2B72F0;
								text-align: center;
							}
							.sendDate {
								font-size: 24rpx;
								color: #666666;
							}
						}
					}
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
			.noDataBox {
				padding-top: 52rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.noOrder {
					width: 708rpx;
					height: 532rpx;
				}
				.loadingImg {
					width:36rpx;
					height: 36rpx;
					margin-right:20rpx;
				    -webkit-animation: rotating 1.5s linear infinite;
				    animation: rotating 1.5s linear infinite;
				}
			}
			.jumpToSendGoods {
				width: 100vw;
				box-sizing: border-box;
				padding: 44rpx;
				background-color: #FFF;
				z-index: 99;
				position: fixed;
				bottom: 0;
				left: 0;
				.jumpBtn {
					width: 400rpx;
					height: 80rpx;
					line-height: 80rpx;
					background: #2B72F0;
					border-radius: 16rpx;
					margin: 0 auto;
					font-size: 32rpx;
					font-weight: 500;
					color: #FFFFFF;
					text-align: center;
				}
			}
		}
		.hintPopup {
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 32rpx 28rpx 48rpx 28rpx;
			margin: 0 32rpx;
			.hintTitle {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				text-align: center;
				margin-bottom: 32rpx;
			}
			.hintMsg {
				font-size: 28rpx;
				color: #707071;
				line-height: 40rpx;
				padding: 0 42rpx;
		
				.num {
					font-size: 28rpx;
					color: #4AA2F3;
				}
			}
			.btn {
				height: 88rpx;
				line-height: 88rpx;
				background-color: #4AA2F3;
				border-radius: 12rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				margin-top: 112rpx;
			}
		}
		.comHintBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			.title {
				width:560rpx;
				font-size: 32rpx;
				color: #777777;
				text-align: center;
				padding: 40rpx 0 34rpx 0;
				line-height: 44rpx;
			}
			.confirmBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top:2rpx solid #F3F3F3;
				.cancelBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #777777;
					text-align: center;
				}
				.groupLine {
					width: 2rpx;
					height: 94rpx;
					background-color: #F3F3F3;
				}
				.confirmBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #4AA2F3;
					text-align: center;
				}
			}
		}
	}
</style>