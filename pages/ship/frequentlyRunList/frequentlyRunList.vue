<template>
	<view class="container" :class="{active: isAlert}" :style="{'padding-top': pdTop}" v-if="isLoaded">
		
		<view class="newHeader">
			<view :style="{height: statusBarHeight*2 + 'rpx'}" />
			<view class="headBox">
				<view class="icon_left">
					<i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777777; font-size: 27px;"></i>
				</view>
				<view class="text">
					{{navigateTitle}}
				</view>
				<view class="" />
			</view>
		</view>
		<view class="noData" v-if="dataList.length < 1">
			<noData></noData>
		</view>
		<view class="content" v-else :style="{'min-height': windowHeight}">
			<view class="inner">
				<view class="itemWhole" v-for="item in dataList" @click="goDetail(item)">
					<view class="item" v-if="item.cargoSource != 'WX_ZKC' && item.unbrokenFlag != 1">
						<view class="orderListHead">
							<view class="orderAddress">
								<view class="address_1">
									<text class="addressMsg" :class="{addressWrap: item.startAddr1.length > 2}">{{item.startAddr1}}</text>
									<text class="line-row">-</text>
									<text class="addressMsg" :class="{addressWrap: item.startAddr2.length > 2}">{{item.startAddr2}}</text>
								</view>
								<view class="notOngoing">
									<text class="notOngoing-text" v-if="item.disTanceAll && item.disTanceAll != 0">{{item.disTanceAll}}km</text>
									<image class="addressStatus" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/notOngoing_1.png"></image>
									
								</view>
								<view class="address_1">
									<text class="addressMsg" :class="{addressWrap: item.endAddr1.length > 2}">{{item.endAddr1}}</text>
									<text>-</text>
									<text class="addressMsg" :class="{addressWrap: item.endAddr2.length > 2}">{{item.endAddr2}}</text>
								</view>
								
							</view>
						</view>
						<view class="subItem">
							<view class="contentText">
								<view class="goodsItem first">
									<text class="pr-24 zhuanghuo-text">{{item.zhuanghuoDtText}}</text>
									<text class="pr-8">共</text>
									<text class="pr-8">{{item.multiTruck ? item.multiTruck : 1}}</text>
									<text class="pr-8">车</text>
									<text class="pr-24">{{item.fixPriceFlag == 1 ? '固价' : '询价'}}</text>
									<text>{{item.LoadingAndUnloadingMethods}}</text>
								</view>
								<view class="goodsItem second" v-if="item.goods || item.goodsPlate">
									<image src="/static/images/ship/goods_icon_1.png" class="goods_icon_1"></image>
									<view class="goodsItem_second_content">
										<view class="mr-16 goodsType" v-if="item.goodsType == '绿通'">{{item.goodsType}}</view>
										<view class="mr-16 goodsType" v-if="item.goodsType == '普货'">{{item.goodsType}}</view>
										<view class="mr-16 goodsType" v-if="item.goodsType == '大宗'">{{item.goodsType}}</view>
										<text class="pr-16 goodsType">{{item.goodsType == '自定义' ? item.goods : item.goodsPlate}}</text> 
										<text  v-if="item.weight" class="pr-16 goodsType">{{item.weight}}吨</text> 
										<text v-if="item.volume" class="pr-16 goodsType">{{item.volume}}方</text>
									</view>
									
								</view>
							</view>
							
						</view>
						<view class="subItem  mb-20">
							<view class="contentText">
								<text class="pr-10">{{item.orderVehicleLength}}米</text>
								<text class="pr-10">{{item.orderVehicleModel}}</text>
								
							</view>
							
						</view>
						<view class="subItem addr">
							<view class="contentText">
								<view class="addr-content1">
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/positioningIcon-back_1.png" class="address"></image>
									<text class="km">{{item.distance}}km</text>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/eye_1.png" class="eyePlate"></image>
									<text class="pr-16">{{item.viewCountForClient}}人</text>
									
									<text class="shipperVerify">{{item.shipperVerify ? '货主已认证' : '货主未认证'}}</text>
								</view>
								<!-- <image src="../../../static/images/ship/clock.png" class="clock"></image>
								<text class="num">{{(showPushDt(item.pushDt))[0]}}</text>
								<text v-if="showPushDt(item.pushDt)">{{(showPushDt(item.pushDt))[1]}}</text> -->
							</view>
						</view>
						
						
						
						<view v-if="item.orderSecondState == 15">
							<view class="goOpt close">
								<text>已下架</text>
							</view>
						</view>
						<view v-else-if="item.orderSecondState == 18">
							<view class="goOpt close">
								<text>已关闭</text>
							</view>
						</view>
						<view v-else>
							<view class="fixedPrice" v-if="item.fixPriceFlag == 1">
								<text>¥</text>
								<text class="price-2">{{showPrice(item.fixPrice)}}</text>
								<text>/{{item.quotePriceTypeName}}</text>
							</view>
							<view v-if="item.multiTruck > 1">
								<view class="goOpt" v-if="item.orderState == 2">
									<text>已成交</text>
								</view>
								<view class="goOpt" v-else-if="item.orderState == 0 || item.orderState == 1">
									已接单
								</view>
								<view @click.stop="goDetail(item)" class="goOpt fixPrice" v-else>
									我要接单
								</view>	
							</view>
							<view v-else>
								<view @click.stop="goDetail(item, 3)" class="goOpt close" v-if="(item.orderSecondState != 11 && item.orderSecondState != 13 && item.orderSecondState != 14) && item.orderQuotationStatus == undefined">已关闭</view>
								
								<view @click.stop="goDetail(item)" class="goOpt fixPrice" v-if="item.orderState == undefined && (item.orderSecondState == 11 || item.orderSecondState == 13 || item.orderSecondState == 14)">
									{{item.fixPriceFlag == 1 ? '我要接单' : '我要报价'}}
								</view>	
								<view @click.stop="goDetail(item, 3)" class="goOpt fixPrice" v-if="item.orderState == 3 && item.orderSecondState == 13">我要报价</view>
								
								<view class="goOpt" v-if="item.orderState == 2 || item.orderState > 4">
									<text>已成交</text>
								</view>
								<view class="goOpt fixPrice" v-if="(item.orderState == 3 && item.orderSecondState != 13) || item.orderState == 4">
									<text>{{item.fixPriceFlag == 1 ? '我要接单' : '我要报价'}}</text>
								</view>
								<view class="goOpt" v-if="item.orderState == 0 || item.orderState == 1">
									{{item.fixPriceFlag == 1 ? '已接单' : '已报价'}}
								</view>
							</view>
							
						</view>
					</view>
					<view v-else class="item">
						<view class="orderListHead">
							<view class="orderAddress">
								<view class="address_1">
									<text class="addressMsg" :class="{addressWrap: item.startAddr1.length > 2}">{{item.startAddr1}}</text>
									<text class="line-row">-</text>
									<text class="addressMsg" :class="{addressWrap: item.startAddr2.length > 2}">{{item.startAddr2}}</text>
								</view>
								<view class="notOngoing">
									<text class="notOngoing-text" v-if="item.disTanceAll && item.disTanceAll != 0">{{item.disTanceAll}}km</text>
									<image class="addressStatus" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/notOngoing_1.png"></image>
									
								</view>
								<view class="address_1">
									<text class="addressMsg" :class="{addressWrap: item.endAddr1.length > 2}">{{item.endAddr1}}</text>
									<text>-</text>
									<text class="addressMsg" :class="{addressWrap: item.endAddr2.length > 2}">{{item.endAddr2}}</text>
								</view>
								
							</view>
						</view>
						<view class="subItem">
							
							<view class="contentText">
								<view class="goodsItem first">
									<text class="pr-24 zhuanghuo-text">{{item.zhuanghuoDtText}}</text>
									<text class="pr-10">{{item.orderVehicleLength}}米</text>
									<text class="pr-10">{{item.orderVehicleModel}}</text>
								</view>
								
							</view>
							
						</view>
						<view class="subItem second">
							<view class="goodsRemark">
								<text class="goodsRemark_text">
									
									备注：{{item.remark ? item.remark : '暂无备注'}}
								</text>
							</view>
						</view>
						<view class="subItem">
							<view class="msg-wx" v-if="item.shipperVerify">
								{{item.unbrokenFlag == 1 ? "App货源，货主已认证" : '小程序货源，货主已认证'}}
							</view>
							<view class="msg-wx" v-else>
								{{item.unbrokenFlag == 1 ? "App货源，货主未实名认证，请谨慎核实" : "小程序货源，货主未实名认证，请谨慎核实" }}
							</view>
						</view>
						
				
						<view v-if="item.orderSecondState == 15">
							<view class="goOpt close">
								<text>已下架</text>
							</view>
						</view>
						<view v-else-if="item.orderSecondState == 18">
							<view class="goOpt close">
								<text>已关闭</text>
							</view>
						</view>
						<view v-else>
							<view class="fixedPrice" v-if="item.fixPriceFlag == 1">
								<text>¥</text>
								<text class="price-2">{{showPrice(item.fixPrice)}}</text>
								<text>/{{item.quotePriceTypeName}}</text>
							</view>
							<view @click.stop="contactShip(item)" class="goOpt fixPrice">联系货主</view>
						</view>
					</view>
				</view>
				
				<uni-morebox :isMore="isNoMore" :containerStyle="{'margin-top': '28rpx'}"></uni-morebox>
				
			</view>
		</view>
		<view class="bg" v-if="isAlert"  @click="closeAlert"/>
		<view class="scroller" :class="{active: isAlert}">
			<view class="contentLeft">
				<scroll-view scroll-y="true" class="alertScroller" :scroll-into-view="scrollView" scroll-with-animation="true">
					<view class="scroll_item scroll_1" v-for="item in typeArr" :id="item.label">
						<view class="scroll_title">
							<text>{{item.title}}</text>
							<text class="sub" v-if="item.label !== 'A'">（可多选）</text>
						</view>
						<view class="list">
							<view class="item">
								不限
							</view>
							<view class="item">
								火车
							</view>
							<view class="item">
								冷藏车
							</view>
						</view>
						
					</view>
				</scroll-view>
				
			</view>
			<view class="contentRight">
				<view class="top" :style="{height: (144 + isRightIndex*100 + 'rpx')}"></view>
				<view class="bottom" :style="{height: (totalHeight*2 - 144 - (isRightIndex + 1)*100 + 'rpx')}"></view>
				<view class="rightList">
					
					<view class="listItem" v-for="(item, index) in listTilArr" @click="changeScrollView(item, index)" :class="{active: item.isSelect}">
						<view class="text">{{item.title}}</view>
						<view class="dot" v-if="isRightIndex !== index && isRightIndex - 1 !== index"></view>
						<view class="line" v-if="item.isSelect" />
					</view>
				</view>
			
			</view>
			<view class="fix-scroll-bottom">
				<view class="cancel btn">
					取消
				</view>
				<view class="confirm btn">
					确定
				</view>
			</view>
		</view>
		<uni-popup ref="confirmPopup1" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent1">
					<view class="text">平台最低保证金为<text class="blue">{{marginPrice}}</text>元，您当前余额为<text class="blue">{{allAmountWithIn}}</text>元。请充值后再报价。</view>
				</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="goCharge()">前往充值</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="shipAlertPopup" type="center">
			<view class="shipAlertContext">
				<view class="text">提示</view>
				<view class="subText">{{shipData.unbrokenFlag == 1 ? 'App' : '小程序'}}发布货源，快去与货主确认信息吧</view>
				<view class="shipContent">货源备注：{{shipData.remark || '暂无备注'}}</view>	
				<view class="confirmBtn" @tap="contactShip(shipData)">联系货主</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "../../../utils/ship"
	import noData from "../../../components/noData.vue"
	import UniMorebox from "../../../components/uni-morebox.vue";
	import *  as publicData from "@/utils/publicData"
	export default {
		components: {
			noData,
			UniMorebox
		},
		data() {
			return {
				shipData: new Object(),
				allAmountWithOut: 0,
				allAmountWithIn: 0,
				marginPrice: 0,
				isNoMore: 'more',
				isNoMoreText: '',
				isLoaded: false,
				params: {
					pageNum: 1,
					pageSize: 20,
				},
				navigateTitle: '线路订单',
				totalHeight: 0,
				isRightIndex: 0,
				scrollView: '', // 锚点
				isAlert: false,
				statusBarHeight: 0,
				windowHeight: 0,
				pdTop: 0,
				dataList: [],
				dataTotalList: [],
				total: 0,
				listTilArr: [
					{
						label: 'B',
						title: '装货时间',
						isSelect: true
					},
					{
						label: 'C',
						title: '重量范围',
					},
					{
						label: 'D',
						title: '车长',
					},
					{
						label: 'E',
						title: '车型',
					},
					{
						label: 'F',
						title: '货物类型',
					}],
				typeArr: [
					{
						label: 'B',
						title: '装货时间',
						data: [
							{typeName: '不限',},
							{typeName: '今天'},
							{typeName: '明天'}
						],
					},
					{
						label: 'C',
						title: '重量范围',
						data: [
							{typeName: ''}
						],
					},
					{
						label: 'D',
						title: '车长',
						data: [1,2,2,2,2,2,,2],
					},
					{
						label: 'E',
						title: '车型',
						data: [1,2,2,2,2,2,,2],
					},
					{
						label: 'F',
						title: '货物类型',
						data: [1,2,2,2,2,2,,2],
					},
					
				],
				userId: '',
				fleetSids: [],
				dataParams02: {},
			}
		},
		async onLoad(options) {
			
			var that = this;
			that.isLoaded = false;
			
			uni.getLocation({
				geocode: true,
				type: 'gcj02',
				success: function(res) {
					console.log(res, '定位地址');
					that.dataParams02.longitude = (res.longitude).toFixed(6)
					that.dataParams02.latitude = (res.latitude).toFixed(6)
				},
				fail: function(res) {
					uni.showToast({
						title: '请打开定位',
						icon: 'none'
					})
				}
			})
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userId = JSON.parse(userInfo).userId;
			}
			//获取关联的车队和我的车队
			//获取我的所有车队和关联的车队
			var fleet = await utils.newQueryPostRequest("/cd/fleet/list", {pageSize:100,pageNum:1,isMyFleet:1,isOwner:1, verificationStatus: 1});
			var relateFleet = await utils.newQueryPostRequest("/cd/fleet/list", {pageSize:100,pageNum:1,isMyFleet:1,isOwner:0, verificationStatus: 1});
			// console.log(fleet, relateFleet, '嗷嗷')
			var fleetsArr = fleet.rspBody.items;
			var fleetsArr1 = relateFleet.rspBody.items;
			var fleetSids = fleetsArr.concat(fleetsArr1);
			this.fleetSids = fleetSids;
			
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			this.statusBarHeight = statusBarHeight;
			var pdTop = (statusBarHeight * 2 + 88) + 'rpx';
			this.pdTop = pdTop;
			this.windowHeight = (windowHeight*2 - statusBarHeight * 2 - 88) + 'rpx';
			this.totalHeight = windowHeight;
			this.navigateTitle = options.navigateTitle;
		    this.routeData = JSON.parse(options.routeData);
			var routeData =  JSON.parse(options.routeData);
			that.init(routeData, 'refresh');
		},
		onShow() {
			
			this.getMarginVODriver();
			this.getRestPrice();
		},
		onPullDownRefresh() {
			var that = this;
			that.init(that.routeData, 'refresh')
		},
		onReachBottom() {
			var that = this;
			var isNoMore = this.isNoMore;
			if (isNoMore != "more") {
				return
			}
			that.onReachBottom();
		},
		methods: {
			contactShip(data) {
				this.$refs.shipAlertPopup.close();
				if (!data.shipMobile) return;
				//判断权限是否禁止
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "android") {
					plus.android.requestPermissions(
						["android.permission.CALL_PHONE"], 
						function(resultObj) {
							var result = 0;
							for (var i = 0; i < resultObj.granted.length; i++) {
								var grantedPermission = resultObj.granted[i];
								console.log('已获取的权限：' + grantedPermission);
								result = 1
							}
							for (var i = 0; i < resultObj.deniedPresent.length; i++) {
								var deniedPresentPermission = resultObj.deniedPresent[i];
								console.log('拒绝本次申请的权限：' + deniedPresentPermission);
								result = 0
							}
							for (var i = 0; i < resultObj.deniedAlways.length; i++) {
								var deniedAlwaysPermission = resultObj.deniedAlways[i];
								console.log('永久拒绝申请的权限：' + deniedAlwaysPermission);
								result = -1
							}
							console.log(result);
							if(result == 1 || result == 0){
								uni.makePhoneCall({
									 phoneNumber: data.shipMobile,//电话号码
								});
								publicData.addBuried("司机搜索货源拨打货主电话")
							}else{
								uni.showToast({
									title:"请开启拨号权限",
									icon:"none",
								})
							}
						},
						function(error) {
							console.log('申请权限错误：' + error.code + " = " + error.message);
						}
					);
				} else {
					uni.makePhoneCall({
						phoneNumber: data.shipMobile,
					})
					publicData.addBuried("司机搜索货源拨打货主电话")
				}
				// uni.makePhoneCall({
				// 	phoneNumber: data.shipMobile
				// })
			},
			getMarginVODriver() {
				utils.postRequest("/td/driver/home/getMarginVODriver", {
					version: 1
				}).then(res => {
					
					if (res.retCode == "0000000") {
						this.marginPrice = res.rspBody.margin;
					}
				})
			},
			getRestPrice() {
				utils.postRequest("/td/driver/home/getAccountBkDriver", {
					version: 1
				}).then(res => {
					
					if (res.retCode == "0000000") {
						this.allAmountWithIn = (res.rspBody.allAmountWithIn)/1000;
						this.allAmountWithOut = (res.rspBody.allAmountWithOut)/1000;
					}
				})
			},
			debounce(func, wait, params) {
			    var that = this;
			    if (that.timer) clearTimeout(that.timer);
			    that.timer = setTimeout(() => {
			        func(params)
			      }, wait)
			    
			},
			
			formatData(dataList, type) {
				//处理数据
				var dataArr = [];
				try{
					dataList.forEach(item => {
						var startAddr1 = ''; //装货地址
						var startAddr2 = ''; //装货地址
						var endAddr1 = ''; //卸货地址
						var endAddr2 = ''; //卸货地址
						var LoadingAndUnloadingMethods = "";
						var orderAddressVOS = item.child.orderAddressVOS;
						
						//装卸方式
						var loadingMethods = "", unLoadingMethods = "";
						var startDistance = [], endDistance = [];
						var cargoSource = item.cargoSource;
						orderAddressVOS.forEach(atem => {
							if (atem.serialnumber == 1) {
								if (atem.latitude) {
									startDistance.push(atem.latitude)
								}
								if (atem.longitude) {
									startDistance.push(atem.longitude)
								}
								loadingMethods = "一装"
							} else if (atem.serialnumber == 2) {
								loadingMethods = "二装"
							} else if (atem.serialnumber == 4) {
								if (atem.latitude) {
									endDistance.push(atem.latitude)
								}
								if (atem.longitude) {
									endDistance.push(atem.longitude)
								}
								unLoadingMethods = "两卸"
							} else if (atem.serialnumber == 3) {
								if (atem.latitude) {
									endDistance.push(atem.latitude)
								}
								if (atem.longitude) {
									endDistance.push(atem.longitude)
								}
								unLoadingMethods = "一卸"
							}
						})
						LoadingAndUnloadingMethods = loadingMethods + unLoadingMethods;
						//设置装卸地址
						var orderAddressVOSLen = orderAddressVOS.length;
						if (orderAddressVOSLen) {
							var start_orderAddressVOS = orderAddressVOS[0];
							var end_orderAddressVOS = orderAddressVOS[orderAddressVOSLen - 1];
							var start_province = start_orderAddressVOS.province;
							var start_city = start_orderAddressVOS.city;
							var start_area = start_orderAddressVOS.area;
							var end_province = end_orderAddressVOS.province;
							var end_city = end_orderAddressVOS.city;
							var end_area = end_orderAddressVOS.area;
							var proText, cityText, areaText;
							if (start_province.indexOf("市") > -1) {
								proText = start_province.slice(0,-1);
								if (start_city.indexOf("区") > -1) {
									cityText = start_city.slice(0,-1)
								} else {
									cityText = start_city
								}
								
								startAddr1 = proText
								startAddr2 = cityText
							} else {
								if (start_province.indexOf("省") > -1) {
									proText = start_province.slice(0,-1);
								} else {
									proText = start_province
								}
								if (start_city.indexOf("市") > -1) {
									cityText = start_city.slice(0,-1);
								} else {
									cityText = start_city
								}
								if (start_area.indexOf("区") > -1) {
									areaText = start_area.slice(0,-1)
								} else {
									areaText = start_area
								}
								if (cargoSource == "WX_ZKC") {
									startAddr1 = proText;
									startAddr2 = cityText;
								} else {
									startAddr1 = cityText;
									startAddr2 = areaText;
								}
							}
							if (end_province.indexOf('市') > -1) {
								//直辖市
								
								proText = end_province.slice(0,-1);
								
								if (end_city.indexOf("区") > -1) {
									cityText = end_city.slice(0,-1)
								} else {
									cityText = end_city
								}
								endAddr1 = proText
								endAddr2 = cityText
								
							} else {
								if (end_province.indexOf("省") > -1) {
									proText = end_province.slice(0,-1);
								} else {
									proText = end_province
								}
								if (end_city.indexOf("市") > -1) {
									cityText = end_city.slice(0,-1);
								} else {
									cityText = end_city
								}
								if (end_area.indexOf("区") > -1) {
									areaText = end_area.slice(0,-1)
								} else {
									areaText = end_area
								}
								if (cargoSource == 'WX_ZKC') {
									endAddr1 = proText;
									endAddr2 = cityText;
								} else {
									endAddr1 = cityText;
									endAddr2 = areaText;
								}
							}
						}
						
						
						
						var disTanceAll = 0;
						if (startDistance.length == 2 && endDistance.length == 2) {
							disTanceAll = publicData.getFlatternDistance(startDistance[0], startDistance[1], endDistance[0], endDistance[1]);
						}
						var estimatedDistance = item.estimatedDistance;
						if (estimatedDistance) {
							disTanceAll = estimatedDistance
						}
						
						//当前位置离装货点的距离
						var distance = 0;
						if (this.dataParams02.latitude) {
							distance = publicData.getFlatternDistance(startDistance[0], startDistance[1], this.dataParams02.latitude, this.dataParams02.longitude);
						} else {
							distance = item.distance ? ((item.distance)/1000).toFixed(0) : 0;
						}
						
						//货主发布货源的时间
						var pushDt = item.pushDt;
						pushDt = pushDt.replace(/-/g, "/");
						var newDate = new Date();
						var nowDataYear = new Date().getFullYear();
						var nowDataMonth = new Date().getMonth() + 1;
						var nowDataDay = new Date().getDate();
						//明天的时间戳
						var day2 = new Date();
						day2.setTime(day2.getTime()+24*60*60*1000);
						var will2Year = day2.getFullYear();
						var will2Month = day2.getMonth() + 1;
						var will2Day = day2.getDate();
						//后天
						var day3 = new Date();
						day3.setTime(day3.getTime()+24*60*60*1000);
						var will3Year = day3.getFullYear();
						var will3Month = day3.getMonth() + 1;
						var will3Day = day3.getDate();
						var dateType = 0; //表示是今天
						var dateTime = "";
						var willDoData = new Date(pushDt);
						var willYear = willDoData.getFullYear();
						var willMonth = willDoData.getMonth() + 1;
						var willDay = willDoData.getDate();
						
						if (nowDataYear == willYear && nowDataMonth == willMonth && nowDataDay == willDay ) {
							//是今天
							dateType = 0;
						} else if (will2Year == willYear && will2Month == willMonth && will2Day == willDay) {
							dateType = 1; //明天
						} else if (will3Year == willYear && will3Month == willMonth && will3Day == willDay) {
							dateType = 2; //后天
						} else {
							dateType = 3; //其他时间
						}
						var hour = new Date(pushDt).getHours();
						var minutes = new Date(pushDt).getMinutes()
						if (hour < 10) {
							hour = '0' + hour
						}
						if (minutes < 10) {
							minutes = '0' + minutes
						}
						dateTime = hour + ':' +  minutes;
						if (dateType == 3) {
							dateTime = item.pushDt;
						}
						//装货时间
						var zhuanghuoDtText = "", startDt = "";
						var earlyLoadDt = '', earlyUnLoadDt = "", endLoadDt = '', endUnLoadDt = '';
						var orderLoadTimeRecordVO = item.child.orderLoadTimeRecordVO;
						if (orderLoadTimeRecordVO.length > 0) {
							orderLoadTimeRecordVO.forEach(atem => {
								if (atem.serialnumber == 1) {
									startDt = atem.startDt;
									startDt = startDt.replace(/-/g, '/');
									var nowDt =new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();;
									var dt = new Date(startDt).getFullYear() + '/' + (new Date(startDt).getMonth() + 1) + '/' + new Date(startDt).getDate();
									var startParse = new Date(dt).getTime();
									var nowParse = new Date(nowDt).getTime();
									//判断两个日期之间相差的天数
									var dayBetween = (startParse - nowParse)/(1000 * 60 * 60 * 24);
									console.log(dayBetween, '日期之差')
									if (dayBetween == 0) {
										zhuanghuoDtText = "今天装货"
									} else if (dayBetween == 1) {
										zhuanghuoDtText = "明天装货"
									} else if (dayBetween == 2) {
										zhuanghuoDtText = "后天装货"
									}else if (dayBetween < 0) { 
										zhuanghuoDtText = "今天装货"
									} else {
										var month = new Date(startDt).getMonth() + 1;
										var day = new Date(startDt).getDate();
										zhuanghuoDtText = month + '月' + day + '日装货'
									}
								}
							})
						}
						
						//车长
						var orderVehicleLengthVOS = item.child.orderVehicleLengthVOs, orderVehicleLength = [];
						if (orderVehicleLengthVOS) {
							orderVehicleLengthVOS.forEach(atem => {
								orderVehicleLength.push(atem.vehicleLength)
							})
						}
						
						//车型
						var orderVehicleModelVOS = item.child.orderVehicleModelVOS, orderVehicleModel = [];
						if (orderVehicleModelVOS) {
							orderVehicleModelVOS.forEach(atem => {
								orderVehicleModel.push(atem.vehicleModel)
							})
						}
						
						
						orderVehicleLength = orderVehicleLength ? orderVehicleLength.join('/') : '';
						orderVehicleModel = orderVehicleModel ? orderVehicleModel.join("/") : '';
						
						//货物相关
						var goodsTypeVO = item.cargoChild ? item.cargoChild.goodsTypeVO : null, goodArr = [],goodsType = "", goodsPlate = "";
						var cargoChild = item.cargoChild;
						if (goodsTypeVO) {
							goodsTypeVO.forEach(atem => {
								var firstName = atem.typeName;
								goodsType = firstName;
								if (atem.children) {
									var atem1 = atem.children;
									atem1.forEach(atem01 => {
										var atem2 = atem01.children;
										if (atem2) {
											atem2.forEach(atem02 => {
												var atem3 = atem02.children;
												if (atem3) {
													atem3.forEach(atem03 => {
														var typeName = atem03.typeName;
														var name = firstName + '-' + typeName
														goodArr.push(name)
														goodsPlate = typeName
													})  
												}
											})
										}
									}) 
								}
							})
						}
						
						var goods = goodArr.join(",");
						
						//单位
						var weight = '', volume = '';
						if (cargoChild) {
							weight = cargoChild.weight;
							volume = cargoChild.volume;
						}
						
						
						var orderState = item.orderQuotationStatus, orderStateText = "";
						var orderSecondState = item.orderSecondState;
						var driverSid = item.driverSid;
						
						//信息费用,默认是分，转化为元
						var orderQuoteVO = item.child.orderQuoteVO;
						var informationPrice = orderQuoteVO.informationPrice / 100;
						
						//报价截止时间
						var endData = item.child.orderQuoteVO.quotePriceFinishDt, quotePriceFinishDt = "";
						if (endData) {
							endData = endData.replace(/-/g, "/");
							var date = new Date(endData);
							var hour = date.getHours();
							var minutes = date.getMinutes();
							if (hour < 10) {
								hour = '0' + hour
							}
							if (minutes < 10) {
								minutes = '0' + minutes
							}
							quotePriceFinishDt = hour +":" + minutes
							
						}
					
						var startAddress =  item.child.orderAddressVOS[0].address;
						var endAddress = '';
						item.child.orderAddressVOS.map(val=>{
							if(!endAddress && val.serialnumber==3){
								endAddress = val.address
							}
						})
						var orderLoadTimeRecordVO = item.child.orderLoadTimeRecordVO;
						var startDt = "";
						var endDt = "";
						var startDt1 = '';
						var endDt1 = '';
						if (orderLoadTimeRecordVO.length > 0) {
							startDt = item.child.orderLoadTimeRecordVO[0].startDt;
							endDt = item.child.orderLoadTimeRecordVO[0].endDt;
	
							item.child.orderLoadTimeRecordVO.map(data=>{
								if(!startDt1 && data.serialnumber==3){
									startDt1 = data.startHours;
									endDt1 = data.endHours;
								}
							})
						}
						
						var receiptType = item.receiptType;
						var fixPrice = item.fixPrice;
						var remark = item.remark;
						var loadFactor = '';
						item.child.orderLoadFactorVOS.map((data, index)=>{
							if(index==0){
								loadFactor = data.loadFactor
							} else{
								loadFactor = loadFactor + ',' +data.loadFactor
							}
						})
						//货主的用户信息
						//货主信息
						var goodsUserName = '匿名用户';
						var gender = item.sex;
						var shipMobile = "";
						var orderContactsVOS = item.child.orderContactsVOS;
						var findIndex = orderContactsVOS.findIndex(item => {
							return item.serialnumber == 1 || item.serialnumber == 2
						})
						if (findIndex > -1) {
							var name  = orderContactsVOS[findIndex].userName;
							var subName = gender == "男" ? '先生' : '女士'
							goodsUserName = name ? name.substring(0, 1) + subName : '';
							shipMobile = orderContactsVOS[findIndex].mobile;
						}
						var fixPriceFlag = item.fixPriceFlag;
						var fixPrice = item.fixPrice;
						var orderNumber = item.orderNumber;
						
						//多车
						var multiTruck = item.multiTruck;
						//多车货源的报价单状态
						var orderQuoation = item.orderQuation || "";
						
						var viewCountForClient = item.viewCountForClient || 0;
						var cargoSource = item.cargoSource;
						var shipperVerify = item.shipperVerify;
						//货物单位
						var quotePriceTypeName = item.child.orderQuoteVO.quotePriceTypeName;
						var unbrokenFlag = item.unbrokenFlag;
						dataArr.push({
							unbrokenFlag,
							shipMobile,
							viewCountForClient,
							orderQuoation,
							driverSid,
							quotePriceTypeName,
							earlyLoadDt,
							earlyUnLoadDt,
							endLoadDt,
							endUnLoadDt,
							orderNumber,
							startAddress,
							endAddress,
							startDt,
							endDt,
							startDt1,
							endDt1,
							receiptType,
							remark,
							loadFactor,
							startAddr1,
							startAddr2,
							endAddr1,
							endAddr2,
							dateTime,
							dateType,
							zhuanghuoDtText,
							goods,
							goodsPlate,
							goodsType,
							orderVehicleModel,
							orderVehicleLength,
							LoadingAndUnloadingMethods,
							volume,
							weight,
							sid: item.sid,
							orderStateText,
							orderState,
							orderSecondState,
							informationPrice,
							quotePriceFinishDt,
							goodsUserName,
							distance,
							disTanceAll,
							fixPriceFlag,
							fixPrice,
							pushDt,
							multiTruck,
							cargoSource,
							shipperVerify,
						})
						
					})
				
					// dataArr = [
					// 	{
					// 		startAddress: '上海',
					// 		endAddress: '北京',
					// 		startDt: '5:12',
					// 		endDt: '2:11',
					// 		startDt1: '3:12',
					// 		endDt1: '3:15',
					// 		receiptType: 1,
					// 		remark: '12313',
					// 		loadFactor: "1212",
					// 		startAddr: '阿萨',
					// 		endAddr: '阿萨1',
					// 		dateTime: '2-12',
					// 		dateType: 1,
					// 		zhuanghuoDtText: '轻武器',
					// 		zhuanghuoDt: '阿萨',
					// 		goods: '阿萨气温气温企鹅我问请问前往',
					// 		orderVehicleModel: '是',
					// 		orderVehicleLength: '11',
					// 		LoadingAndUnloadingMethods: '12',
					// 		volume: '1',
					// 		weight: 2,
					// 		sid: 1212,
					// 		orderStateText: 'as1',
					// 		orderState: 1,
					// 		informationPrice: 11,
					// 		quotePriceFinishDt: '2:44',
					// 		quoteState: 1,
					// 		goodsUserName: '下女士',
					// 		distance: '2.5',
					// 		fixPriceFlag: 0,
					// 		fixPrice: '500'
					// 	}
					// ]
					console.log(dataArr, '处理后的数据')
					var data = this.dataList;
					this.dataTotalList = dataArr;
					var dataList = [
						...dataArr
					]
					this.dataList = dataList.splice(0, 20);
					uni.stopPullDownRefresh();
				}catch(e){
					//TODO handle the exception
					console.log(e)
					uni.stopPullDownRefresh();
				}
			},
			copy(text) {
				//复制货源号
				uni.setClipboardData({
					data: text,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功',
							icon: 'none'
						})
					}
				});
					
			},
			onReachBottom() {
				//下拉刷新
				var dataTotalList = this.dataTotalList;
				var dataList = this.dataList;
				var pageNum = this.params.pageNum;
				pageNum ++;
				this.params.pageNum = pageNum;
				var dataArr = dataTotalList.splice(pageNum*20, pageNum*20 + 20);
				if (dataArr.length < this.params.pageSize) {
					this.isNoMore = 'noMore';
				} else {
					this.isNoMore = 'more';
				}
				dataList = dataList.concat([...dataArr]);
				this.dataList = dataList
			},
			async init(options, type) {
					//初始化数据
					try{
						if (type == 'refresh') {
							this.params.pageNum = 1
						} else {
							this.params.pageNum ++
						}
						var params = this.params;
						if (!options.startOffArea) { 
							delete options.startOffArea;
							delete options.startOffAreaCode
						}
						if (!options.startOffCity) {
							delete options.startOffCity;
							delete options.startOffCityCode
						}
						if (!options.startOffProvince) {
							delete options.startOffProvince;
							delete options.startOffProvinceCode
						}
						
						if (!options.arriveArea) {
							delete options.arriveArea;
							delete options.arriveAreaCode
						}
						if (!options.arriveCity) {
							delete options.arriveCity;
							delete options.arriveCityCode
						}
						if (!options.arriveProvince) {
							delete options.arriveProvince;
							delete options.arriveProvinceCode
						}
						
						var data = Object.assign(options, params);
						data.fleetSids = this.fleetSids.length > 0 ? JSON.stringify(this.fleetSids) : null;
						// console.log(data, '路线参数');
						
						var response = await utils.newQueryPostRequest("/td/circuit/getOrders", data)
						uni.stopPullDownRefresh();
						console.log(response.rspBody, '订单列表')
						if (response.retCode == "0000000") {
							var dataList = response.rspBody.items;
							if (type == 'refresh') {
								if (dataList.length == 0) {
									this.isNoMore = 'more';
									this.isNoMoreText = '暂无数据'
								} else if (dataList.length < 20){
									this.isNoMore = 'noMore';
									this.isNoMoreText = '暂无更多数据'
								} else {
									this.isNoMore = 'more';
									this.isNoMoreText = ''
								}
								this.formatData(dataList, type);
							} else {
								if (dataList.length < 20){
									this.isNoMore = 'noMore';
									this.isNoMoreText = '暂无更多数据'
								} else {
									this.isNoMore = 'more';
									this.isNoMoreText = ''
								}
							}
							
							this.total = response.rspBody.total;
							this.isLoaded = true;
						}
					}catch(e){
						uni.stopPullDownRefresh();
						//TODO handle the exception
					}
			},
			backToFromPage() {
				uni.navigateBack({
					delta:1
				})
			},
			selectType() {
				//删选
				this.isAlert = !this.isAlert
			},
			closeAlert() {
				this.isAlert = false
			},
			showPrice(price) {
				return publicData.showPrice(price, 100)
			},
			changeScrollView(item, index) { // 锚点定位
				var  listTilArr = this.listTilArr;
				var isSelect = listTilArr[index].isSelect;
				if (isSelect) {
					return
				}
				listTilArr[index].isSelect = !isSelect;
				for (var i =0; i < listTilArr.length; i ++) {
					if (index !== i) {
						listTilArr[i].isSelect = false
					}
				}
				this.listTilArr = listTilArr;
				this.scrollView = item.label;
				this.isRightIndex = index;
				console.log(this.scrollView);
				this.$forceUpdate();
			},
			goQuotation(item) {
				//去报价
				if (item.quoteState == 1) {
					return;
				}
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								service.loginSelf(1);
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 || faceVerify != 1 ) {
					uni.showModal({
						title: '请认证驾驶证，行驶证和身份证',
						content: '未完成认证，请认证后操作。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (identityVerify !== 1 || faceVerify != 1) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else if (driverVerify !== 1) {
									uni.navigateTo({
										url: '../../my/driverVerify/newDriverVerify'
									})
								} else if (vehicleVerify !== 1) {
									uni.navigateTo({
										url: '../../my/carVerify/newCarVerify'
									})
								}
								
							}
						}
					})
					return
				}
				
				var marginPrice = this.marginPrice;
				var allAmountWithIn = this.allAmountWithIn;
				//保证金判断
				if (allAmountWithIn < marginPrice) {
					//保证金判断
					this.$refs.confirmPopup1.open();
					return
				}
				
				uni.navigateTo({
					url: '../quotedPrice/quotedPrice?quoteDetails=' + JSON.stringify(item)
				})
			},
			goCharge() {
				//去充值
				this.$refs.confirmPopup1.close();
				uni.navigateTo({
					url: '../../goodsDelivery/userCenter/userWallet/topUp'
				})
			},
			goDetail(item) {
				//去货源详情
				//去认证
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								utils.loginSelf(1);
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 || faceVerify != 1 ) {
					
					uni.showModal({
						title: '请认证驾驶证，行驶证和身份证',
						content: '未完成认证，请认证后操作。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (identityVerify !== 1 || faceVerify != 1) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else if (driverVerify !== 1) {
									uni.navigateTo({
										url: '../../my/driverVerify/newDriverVerify'
									})
								} else if (vehicleVerify !== 1) {
									uni.navigateTo({
										url: '../../my/carVerify/newCarVerify'
									})
								}
								
							}
						}
					})
					return
				}
				
				
				if (item.cargoSource == "WX_ZKC" || item.unbrokenFlag == 1) {
					this.shipData = item;
					this.$refs.shipAlertPopup.open();
					return;
				}
				
				var orderState = item.orderState;
				var multiTruck = item.multiTruck;
				if (item.orderSecondState == 15) {
					uni.showToast({
						title: '货源已下架，请查看其它货源吧~',
						icon: 'none'
					})
					return;
				}
				if (item.orderSecondState == 18) {
					uni.showToast({
						title: '货源已关闭，请查看其它货源吧~',
						icon: 'none'
					})
					return;
				}
				if ((item.orderSecondState != 11 && item.orderSecondState != 13 && item.orderSecondState != 14) && item.orderState == undefined && item.multiTruck < 2) {
					uni.showToast({
						title: '货源已关闭，请查看其它货源吧~',
						icon: 'none'
					})
					return;
				}
				
				if (multiTruck > 1) {
					if (orderState <= 2 && orderState !== undefined) {
						uni.navigateTo({
							url: '../supplyDetails/supplyGoods?sid=' + item.sid
						})
					} else {
						uni.navigateTo({
							url: '../supplyDetails/supplyDetails?sid=' + item.sid + '&status=3'
						})
					}
				} else {
					if (orderState == 2 || orderState > 4) {
						uni.navigateTo({
							url: '../supplyDetails/supplyGoods?sid=' + item.sid
						})
					} else {
						uni.navigateTo({
							url: '../supplyDetails/supplyDetails?sid=' + item.sid + '&status=3'
						})
					}
				}
				
				
				
				
			},
			showPushDt(time) {
				return publicData.showPushDt(time);
			},
		}
	}
</script>

<style scoped lang="scss">
	.pr-20 {
		padding-right: 20rpx;
	}
	.pr-10 {
		padding-right: 10rpx;
	}
	.pr-16 {
		padding-right: 16rpx;
	}
	.mr-16 {
		margin-right: 16rpx;
	}
	.mb-20 {
		margin-bottom: 20rpx;
	}
	.pr-34 {
		padding-right: 34rpx;
	}
	.pr-24 {
		padding-right: 24rpx;
	}
	.pr-8 {
		padding-right: 8rpx;
	}
	.bg {
		width: 100vw;
		height: 100vh;
		background-color: rgba(34, 34, 34, 0.8);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.scroller {
		width: calc(100vw - 118rpx);
		position: fixed;
		top: 0;
		left: 100vw;
		height: 100vh;
		padding-left: 0;
		z-index: 99999;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		transition: all .3s ease-out;
		&.active {
			left: 118rpx;
		}
		.fix-scroll-bottom {
			position: absolute;
			bottom: 0;
			right: 0;
			z-index: 99;
			width: calc(100vw - 118rpx);
			height: 168rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			background-color: #FFFFFF;
			padding: 0 32rpx;
			box-sizing: border-box;
			.btn {
				flex: 1;
				height: 80rpx;
				border-radius: 8rpx;
				font-size: 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				&.cancel {
					margin-right: 32rpx;
					background-color: #EDEFF1;
					color: #969FB2;
				}
				&.confirm {
					background-color: #4AA2F3;
					color: #FFFFFF;
				}
				
			}
			
			
		}
		.contentRight {
			background-color: #FFFFFF;
			padding-top: 144rpx;
			width: 180rpx;
			display: flex;
			flex-direction: column;
			position: relative;
			.top {
				position: absolute;
				top: 0;
				right: 0;
				width: 180rpx;
				height: 144rpx;
				z-index: 9;
				background-color: #F2F2F2;
				border-radius: 0 0 0 20rpx;
				
			}
			.bottom {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 180rpx;
				height: calc(100vh - 244rpx);
				z-index: 9;
				background-color: #F2F2F2;
				border-radius: 20rpx 0 0 0;
				
			}
			.rightList {
				position: absolute;
				top: 144rpx;
				right: 0;
				z-index: 9;
				width: 180rpx;
			}
			.listItem {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: #999999;
				font-size: 28rpx;
				height: 100rpx;
				position: relative;
				.line {
					position: absolute;
					right: 0;
					top: 26rpx;
					height: 44rpx;
					width: 8rpx;
					background-color: #4AA2F3;
					border-radius: 0 4rpx 4rpx 0;
					
				}
				&.active {
					background-color: #FFFFFF;
					color: #4AA2F3;
					
				}
				.text {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.dot {
					width: 40rpx;
					background-color: #D3D3D3;
					height: 1px;
				}
			}
		}
		.contentLeft {
			flex: 1;
			padding: 140rpx 0;
			box-sizing: border-box;
			background-color: #FFFFFF;
			.alertScroller {
				height: calc(100vh - 308rpx);
			}
			.scroll_item {
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;
				.list {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
				}
				.item {
					width: 190rpx;
					height: 60rpx;
					border: 1px solid #DDDDDD;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #969FB2;
					font-size: 24rpx;
					margin-left: 24rpx;
					margin-bottom: 24rpx;
				}
			}
			.scroll_title {
				font-size: 28rpx;
				color: #333333;
				padding: 16rpx 26rpx 40rpx;
				.sub {
					font-size: 26rpx;
					color: #999999;
				}
			}
		}
	}
	.newHeader {
		width: 750rpx;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #FFFFFF;
		z-index: 9;
		.headBox {
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			font-size:32rpx;
			color:#333333;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			position: relative;
			.icon_left {
				position: absolute;
				left:0;
				width: 80rpx;
				height: 88rpx;
				top: 0;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				
			}
			.text {
				font-weight: 500;
				width: calc(100vw - 100rpx);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.container {
		.active {
			overflow: hidden;
		}
	}
	.content {
		padding: 0 36rpx;
		color: #333333;
		background-color: rgba(241, 244, 249, 1);
	}
	.searchCondition {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 26rpx;
		color: #606872;
		padding: 28rpx 0;
		.searchItem {
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		.arrow_down {
			width: 40rpx;
			height: 40rpx;
		}
	}
	.inner {
		display: flex;
		flex-direction: column;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);
		padding-top: 20rpx;
		.itemWhole {
			background-color: #FFFFFF;
			box-shadow: 0 0 14rpx 2rpx rgba(202, 222, 255, 0.34);
			margin-bottom: 20rpx;
			border-radius: 16rpx;
			overflow: hidden;
		}
		.item {
			display: flex;
			flex-direction: column;
			position: relative;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			.goBtn {
				position: absolute;
				right: 32rpx;
				bottom: 32rpx;
				background-color: #4AA2F3;
				height: 52rpx;
				width: 154rpx;
				border-radius: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				color: #FFFFFF;
			}
			.orderListHead {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 0 26rpx;
				flex-wrap: nowrap;
			}
			.orderAddress {
				width: calc(100vw - 88rpx);
				margin: 30rpx 0 16rpx;
				line-height: 44rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				.notOngoing {
					color: rgba(242, 147, 71, 1);
					font-weight: 500;
					font-size: 24rpx;
					margin: 0 24rpx;
					width: 113rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					position: relative;
					.notOngoing-text {
						position: absolute;
						left: 16rpx;
						top: -20rpx;
					}
					
				}
				.address_1 {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-start;
					.line-row {
						font-weight: 600;
					}
				}
				.addressMsg {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					line-height: 44rpx;
					font-size: 36rpx;
					color: rgba(51, 51, 51, 1);
					font-weight: 600;
					&.addressWrap {
						width: 120rpx;
					}
					
				}
				.addressStatus {
					width: 113rpx;
					height: 35rpx;
				
				}
			}
			.subItem {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				flex-wrap: wrap;
				font-size: 28rpx;
				color: #333333;
				padding: 0 26rpx;
				.msg-wx {
					font-size: 20rpx;
					margin: 20rpx 0 30rpx;
					line-height: 44rpx;
				}
				.icon {
					width: 80rpx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					line-height: 45rpx;
					height: 45rpx;
					
					.box01 {
						height: 28rpx;
						width: 24rpx;
						
					}
					.box2 {
						height: 24rpx;
						width: 27rpx;
					}
					.box03 {
						width: 28rpx;
						height: 24rpx;
					}
					.box05 {
						width: 30rpx;
						height: 28rpx;
					}
				}
				.goodsRemark {
					padding: 8rpx 10rpx;
					background-color: rgba(248, 249, 251, 1);
					border-radius: 8rpx;
					line-height: 45rpx;
					width: calc(100vw - 400rpx);
					color: rgba(229, 80, 14, 1);
					font-size: 28rpx;
					.goodsRemark_text {
						display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
						overflow: hidden;
						word-break: break-all;  /* break-all(允许在单词内换行。) */
						text-overflow: ellipsis;  /* 超出部分省略号 */
						-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
						-webkit-line-clamp: 4; /** 显示的行数 **/
					}
				}
				.contentText {
					flex: 1;
					flex-wrap: wrap;
					line-height: 44rpx;
					padding-right: 15rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					
					.goodsItem {
						line-height: 44rpx;
						&.first {
							margin-bottom: 14rpx;
						}
						&.second {
							margin-bottom: 8rpx;
							display: flex;
							flex-direction: row;
							align-items: flex-start;
							justify-content: flex-start;
						}
						.zhuanghuo-text {
							color: #FF7700;
							font-weight: 600;
						}
						.goods_icon_1 {
							width: 28rpx;
							height: 28rpx;
							margin-right: 16rpx;
							padding-top: 8rpx;
						}
						.goodsItem_second_content {
							flex: 1;
						}
					}
					.goodsType {
						font-weight: 500;
						display: inline-block;
						padding: 0 10rpx;
						line-height: 44rpx;
					}
					.goodsType-01 {
						display: inline-block;
						border: 1px solid rgba(45, 169, 85, 1);
						color: rgba(45, 169, 85, 1);
						border-radius: 19rpx;
						padding: 4rpx 10rpx;
					}
					.goodsType-02 {
						display: inline-block;
						border: 1px solid rgba(51, 51, 51, 1);
						color: rgba(51, 51, 51, 1);
						border-radius: 19rpx;
						padding: 4rpx 10rpx;
					}
					.goodsType-03 {
						display: inline-block;
						border: 1px solid rgba(1, 113, 249, 1);
						color: rgba(1, 113, 249, 1);
						border-radius: 19rpx;
						padding: 4rpx 10rpx;
					}
				}
			}
			.avatar {
				padding: 12rpx 32rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				.user {
					font-size: 28rpx;
				}
				.star {
					width: 28rpx;
					height: 26rpx;
					margin: 0 10rpx 0 32rpx;
				}
				.scole {
					color: #888888;
					font-size: 28rpx;
					margin-right: 16rpx;
				}
				.status {
					width: 98rpx;
					height: 34rpx;
					color: #7792AF;
					font-size: 16rpx;
					border: 1px solid #A4C3E7;
					border-radius: 17rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.addr-content1 {
				line-height: 44rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #333333;
				.address {
					width: 30rpx;
					height: 40rpx;
					margin-right: 8rpx;
				}
				.km {
					margin-right: 20rpx;
				}
				.eyePlate {
					width: 48rpx;
					height: 48rpx;
					margin-right: 8rpx;
				}
				.shipperVerify {
					font-size: 24rpx;
					color: #666666;
				}
				
			}
			.addr {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: rgba(51, 51, 51, 1);
				padding-bottom: 22rpx;
				.clock {
					width: 26rpx;
					height: 26rpx;
				}
				.num {
					color: rgba(242, 147, 71, 1);
					margin: 0 8rpx 0 15rpx;
				}
			}
			
			.commonts {
				padding-bottom: 32rpx;
				font-size: 24rpx;
				
				.commonts-icon {
					width: 20rpx;
					height: 24rpx;
					margin-right: 16rpx;
					margin-left: 4rpx;
				}
			}
		}
	}
	.noData {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 200rpx);
	}
	.hintBox {
		background: #FFFFFF;
		border-radius: 12rpx;
		margin: 0 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 436rpx;
		.title {
			font-size: 30rpx;
			color: #777777;
			text-align: center;
			padding: 32rpx 0;
			font-weight: bold;
		}
		.alertContent1 {
			padding: 0 62rpx;
			font-size: 28rpx;
			color: rgba(112, 112, 113, 1);
			flex: 1;
			.text {
				display: flex;
				height: 84rpx;
				flex-wrap: wrap;
			}
			.blue {
				color: rgba(74, 162, 243, 1);
			}
		}
		.confirmBtnGroup {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 46rpx;
			.cancelBtn {
				width: calc(100vw - 120rpx);
				background-color: rgba(74, 162, 243, 1);
				flex: 1;
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 12rpx;
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
	.fixedPrice {
		font-size: 28rpx;
		color: rgba(255, 119, 0, 1);
		position: absolute;
		right: 22rpx;
		bottom: 90rpx;
		.price-2 {
			font-family: 'Price font';
			font-size: 48rpx;
			
		}
	}
	.goOpt {
		width: 154rpx;
		height: 56rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		background-color: #ffffff;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 22rpx;
		bottom: 22rpx;
		font-weight: 500;
		&.fixPrice {
			color: #558DF2;
			border: 2rpx solid #558DF2;
			
		}
		&.close {
			background-color: #CCCCCC;
		}
		
	}
	.shipAlertContext {
		width: calc(100vw - 196rpx);
		min-height: 336rpx;
		border-radius: 24rpx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;
		padding-top: 32rpx;
		.confirmBtn {
			height: 88rpx;
			width: calc(100vw - 196rpx);
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 1px solid rgba(241, 241, 241, 1);
			font-size: 32rpx;
			font-weight: 500;
			color: rgba(78, 173, 241, 1);
		}
		.text {
			line-height: 50rpx;
			color: rgba(51, 51, 51, 1);
			font-size: 36rpx;
		}
		.subText {
			font-size: 28rpx;
			color: rgba(51, 51, 51, 1);
			margin: 8rpx 0 16rpx;
		}
		.shipContent {
			width: calc(100vw - 196rpx);
			text-align: left;
			flex: 1;
			line-height: 30rpx;
			font-size: 24rpx;
			color: rgba(102, 102, 102, 1);
			padding: 0 24rpx;
			box-sizing: border-box;
		}
	}
</style>
