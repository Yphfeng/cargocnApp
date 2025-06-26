<template>
	<view>
		<view class="fleetIndex">
			<view class="flleetHead">
				
				<view class="headBtnGroup">
					<search-box ref="searchBoxRef" :keyword="keyWord0" :fleetHotkeyInfo="hotkeyList"></search-box>
					<view class="selectBox" @click="showSelectPopup">
						<view class="msg">筛选</view>
						<view class="selectNum" v-if="selectNum">{{selectNum}}</view>
						<image class="selectFlleetIcon" src="../../../static/images/goodsDelivery/selectFlleetIcon.png" v-else></image>
					</view>
					<view class="creatBox" @click="toCreatFleet">
						<!-- <image class="creatFlleetIcon" src="../../../static/images/goodsDelivery/creatFlleetIcon.png"></image> -->
						<image class="creatFlleetIcon" src="../../../static/images/goodsDelivery/creatFlleetIcon2.png"></image>
						新建
					</view>
				</view>
				
				<scroll-view class="headTagList" :scroll-with-animation="true" :scroll-left="scrollLeft" scroll-x>
					<view style="display: inline-flex;">
						<view class="tagBtn" :style="{order: item.order}" :id="'headTag' + tagKey" v-for="(item, tagKey) in tagInfo" :key="tagKey" @click="changeTag(item, tagKey)">
							<view :class="selectTag == tagKey ? 'checkedTag' : 'tagMsg'">{{item.typeName}}</view>
							<view :class="selectTag == tagKey ? 'checkedLine' : 'tagLine'"></view>
						</view>
					</view>
					
				</scroll-view>
			</view>
			<view class="advs" v-if="activeAdvObj && activeAdvObj.info[0].advUrl">
				<image :src="activeAdvObj.info[0].advUrl" mode="aspectFill" @click="showBigBanner(activeAdvObj.info[1], activeAdvObj.info[1].advUrl)" class="mainBanner"></image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adverties.gif"  class="advertiesGif"></image>
			</view>
			<fleet-container
				:dataArr="platformFleetArr0" 
				:selectTag="0" 
				:activeAdvObj="activeAdvObj"
				:isNoMore="isNoMore0"
				:isNoData="isNoData0"
				v-show="selectTag == 0"
				:swiperFleet="swiperFleet0"
				:userRole="2"
				
			>
				<view slot="swiper">
					<view class="swiper-container" v-if="swiperFleet0.length > 0">
						<view class="swiper-icon">推荐车队</view>
						<swiper class="swiper" :circular="true" autoplay="true" @change="changeIndicator0">
							<swiper-item v-for="(item, index) in swiperFleet0" class="swiper-item" :key="index">
								<image :src="item.recommendImg" class="img-fleet" @click="goFleetDetail(item)"></image>
							</swiper-item>
						</swiper>
						<view class="swiper-indicator">
							<view class="indicator" v-for="(item, index) in swiperFleet0" :class="{active: indicatorIndex0 == index}" />
						</view>
					</view>
				</view>
			</fleet-container>
			
			<fleet-container
				:dataArr="platformFleetArr6" 
				:selectTag="6" 
				:activeAdvObj="activeAdvObj"
				:isNoMore="isNoMore6"
				:isNoData="isNoData6"
				v-show="selectTag == 6"
				:swiperFleet="swiperFleet6"
				:userRole="2"
			>
				<view slot="swiper">
					<view class="swiper-container" v-if="swiperFleet6.length > 0">
						<view class="swiper-icon">推荐车队</view>
						<swiper class="swiper" :circular="true" autoplay="true" @change="changeIndicator6">
							<swiper-item v-for="(item, index) in swiperFleet6" class="swiper-item" :key="index">
								<image :src="item.recommendImg" class="img-fleet" @click="goFleetDetail(item)"></image>
							</swiper-item>
						</swiper>
						<view class="swiper-indicator">
							<view class="indicator" v-for="(item, index) in swiperFleet6" :class="{active: indicatorIndex6 == index}" />
						</view>
					</view>
				</view>
			
			</fleet-container>
			
			
			<fleet-container
				:dataArr="platformFleetArr1" 
				:selectTag="1" 
				:activeAdvObj="activeAdvObj"
				:isNoMore="isNoMore1"
				:isNoData="isNoData1"
				v-show="selectTag == 1"
				:swiperFleet="swiperFleet1"
				:userRole="2"
				
			>
				<view slot="swiper">
					<view class="swiper-container" v-if="swiperFleet1.length > 0">
						<view class="swiper-icon">推荐车队</view>
						<swiper class="swiper" :circular="true" autoplay="true" @change="changeIndicator1">
							<swiper-item v-for="(item, index) in swiperFleet1" class="swiper-item" :key="index">
								<image :src="item.recommendImg" class="img-fleet" @click="goFleetDetail(item)"></image>
							</swiper-item>
						</swiper>
						<view class="swiper-indicator">
							<view class="indicator" v-for="(item, index) in swiperFleet1" :class="{active: indicatorIndex1 == index}" />
						</view>
					</view>
				</view>
			</fleet-container>
			<fleet-container
				:dataArr="platformFleetArr2" 
				:selectTag="2" 
				:activeAdvObj="activeAdvObj"
				:isNoMore="isNoMore2"
				:isNoData="isNoData2"
				v-show="selectTag == 2"
				:swiperFleet="swiperFleet2"
				:userRole="2"
				
			>
				<view slot="swiper">
					<view class="swiper-container" v-if="swiperFleet2.length > 0">
						<view class="swiper-icon">推荐车队</view>
						<swiper class="swiper" :circular="true" autoplay="true" @change="changeIndicator2">
							<swiper-item v-for="(item, index) in swiperFleet2" class="swiper-item" :key="index">
								<image :src="item.recommendImg" class="img-fleet" @click="goFleetDetail(item)"></image>
							</swiper-item>
						</swiper>
						<view class="swiper-indicator">
							<view class="indicator" v-for="(item, index) in swiperFleet2" :class="{active: indicatorIndex2 == index}" />
						</view>
					</view>
				</view>
			</fleet-container>
			<fleet-container
				:dataArr="platformFleetArr3" 
				:selectTag="3" 
				:activeAdvObj="activeAdvObj"
				:isNoMore="isNoMore3"
				:isNoData="isNoData3"
				v-show="selectTag == 3"
				:swiperFleet="swiperFleet3"
				:userRole="2"
				
			>
				<view slot="swiper">
					<view class="swiper-container" v-if="swiperFleet3.length > 0">
						<view class="swiper-icon">推荐车队</view>
						<swiper class="swiper" :circular="true" autoplay="true" @change="changeIndicator3">
							<swiper-item v-for="(item, index) in swiperFleet3" class="swiper-item" :key="index">
								<image :src="item.recommendImg" class="img-fleet" @click="goFleetDetail(item)"></image>
							</swiper-item>
						</swiper>
						<view class="swiper-indicator">
							<view class="indicator" v-for="(item, index) in swiperFleet3" :class="{active: indicatorIndex3 == index}" />
						</view>
					</view>
				</view>
			</fleet-container>
			<fleet-container
				:dataArr="platformFleetArr4" 
				:selectTag="4" 
				:activeAdvObj="activeAdvObj"
				:isNoMore="isNoMore4"
				:isNoData="isNoData4"
				v-show="selectTag == 4"
				:swiperFleet="swiperFleet4"
				:userRole="2"
				
			>
				<view slot="swiper">
					<view class="swiper-container" v-if="swiperFleet4.length > 0">
						<view class="swiper-icon">推荐车队</view>
						<swiper class="swiper" :circular="true" autoplay="true" @change="changeIndicator4">
							<swiper-item v-for="(item, index) in swiperFleet4" class="swiper-item" :key="index">
								<image :src="item.recommendImg" class="img-fleet" @click="goFleetDetail(item)"></image>
							</swiper-item>
						</swiper>
						<view class="swiper-indicator">
							<view class="indicator" v-for="(item, index) in swiperFleet4" :class="{active: indicatorIndex4 == index}" />
						</view>
					</view>
				</view>
			</fleet-container>
			<fleet-container
				v-show="selectTag == 5" 
				:activeAdvObj="activeAdvObj"
				:dataArr="logisticsFleetArr" 
				:selectTag="5"
				:isNoMore="isNoMore5"
				:isNoData="isNoData5"
				:myFlagShow="myFlagShow"
				:userRole="2"
			>
			</fleet-container>
		
		</view>
		
		<uni-popup ref="rightSelectPopup" type="right" id="popup">
			<selected :params="platformParams" :typeArr="typeArr"></selected>
		</uni-popup>
		
		<uni-popup ref="popupOut" type="center" :maskClick="true">
			<view class="out">
				<view class="title">温馨提示</view>
				<view class="text">确定取消关注车队吗？</view>
				<view class="bot">
					<view class="cancel" @click="cancelOut">取消</view>
					<view class="confirm" @click="confirmOut">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import FleetContainer from "../../ship/fleet/FleetContainer.vue";
	import FleetItem from "../../ship/fleet/item.vue"
	import Selected from "../../ship/fleet/selected.vue"
	import SearchBox from "../../ship/fleet/searchBox.vue"
	import * as ship from "@/utils/ship"
	export default {
		components: {
			FleetContainer,
			FleetItem,
			Selected,
			SearchBox
		},
		data() {
			return {
				scrollLeft: 0,
				myFlagShow: false, //我的车队中吸顶
				selectTag: '0',
				tagInfo: [
					{typeName: '车型', order: 0},
					{typeName: '行业', order: 2},
					{typeName: '货主', order: 4},
					{typeName: '物流', order: 6},
					{typeName: '司机', order: 8},
					{typeName: '我的', order: 10},
					{typeName: '线路', order: 1},
				],
				advList: [
					{typeName: '车型', key: 'PLATFORM', info: []},
					{typeName: '行业', key: 'CARGO', info: []},
					{typeName: '货主', key: 'TRIPARTITE', info: []},
					{typeName: '物流', key: 'LINE', info: []},
					{typeName: '司机', key: 'DRIVER', info: []},
					{typeName: '我的', key: 'MY', info: []},
					{typeName: '线路', key: 'ROUTER', info: []},
				],
				activeAdvObj: null,
				carTypeFlag: '0',
				detailsFlag: '0',
				platformFleetArr: [], //平台车队
				logisticsFleetArr: [], //物流车队
				addFleetArr: [], //合作的车队
				myFleetArr: [], //我的车队
				scrollTopHeight: '',
				
				params0: {
					pageSize: 10,
					pageNum: 1,
					roleList: [3],
					count: false,
				},
				params1: {
					pageSize: 10,
					pageNum: 1,
					count: false,
				},
				params2: {
					pageSize: 10,
					pageNum: 1,
					count: false,
				},
				params3: {
					pageSize: 10,
					pageNum: 1,
					count: false,
				},
				isNoMore0: "more",
				isNoMore1: "more",
				isNoMore2: "more",
				isNoMore3: "more",
				isNoData0: "loading",
				isNoData1: "loading",
				isNoData2: "loading",
				isNoData3: "loading",
				platformParams: {}, //平台参数
				keyWord0: "",
				hotkeyList: [], // 热搜词
				requestLoading: false, // 接口是否请求中
				typeArr: [
					{
						label: 'B',
						title: '规模',
						subTitle: '可多选',
						data: [
							{typeName: '1-20人', start: 1, end: 20},
							{typeName: '20-50人', start: 20, end: 50},
							{typeName: '50-100人', start: 50, end: 100},
							{typeName: '100人以上', start: 100, end: 100000},
						],
					},
					{
						label: 'C',
						title: '车长',
						subTitle: '可多选',
						data: [],
					},
					{
						label: 'D',
						title: '车型',
						subTitle: '可多选',
						data: [],
					},
					{
						label: 'E',
						title: '优势区域',
						subTitle: '可多选',
						data: [],
					},
					{
						label: 'F',
						title: '优势行业',
						subTitle: '可多选',
						data: [],
					},
					{
						label: 'G',
						title: '省份',
						subTitle: '可多选',
						data: [],
					},
				],
				isScan: 0, //判断是否是扫面二维码进行的筛选
			};
		},
		onPullDownRefresh() {
			var selectTag = this.selectTag;
			var isScanForResult = this.isScanForResult;
			if (isScanForResult) {
				this.isScanForResult = false;
				this.keyWord0 = "";
			}
			uni.$emit("fleetList", "refresh", selectTag);
		},
		onReachBottom() {
			var selectTag = this.selectTag;
			var isNoMore = "isNoMore" + selectTag;
			if (this[isNoMore] == "loading") return;
			this[isNoMore] = "loading";
			uni.$emit("fleetList", "more", selectTag);
		},
		computed: {
			selectNum() {
				var platformParams = this.platformParams;
				var keys = Object.keys(platformParams);
				if (platformParams.length < 1) return;
				var num = 0;
				keys.forEach(item => {
					var len = platformParams[item].length;
					num += len
				})
				return num;
				
			}
		},
		onPageScroll(e) {
			var selectTag = this.selectTag;
			if (selectTag != 1) return;
			var swiperFleet = this.swiperFleet1;
			var scrollTop = e.scrollTop*2;
			var willTop = 0
			if (swiperFleet.length > 0) {
				willTop = 274
				if (scrollTop >= willTop) {
					if (this.myFlagShow) return;
					this.myFlagShow = true
				} else {
					if (!this.myFlagShow) return;
					this.myFlagShow = false
				}
			}
			
		},
		async onLoad() {
			//获取车型车长数据
			var that = this;
			// 获取车队广告
			that.$store.dispatch('getFleetAdvertise').then(fleetAdvRes => {
				that.advList.forEach((itemOne) => {
					fleetAdvRes.forEach(itemTwo =>{
						if(itemTwo.advLocation.indexOf(itemOne.key) != -1){
							itemOne.info.push(itemTwo)
						}
					})
				})
				that.setActiveAdv('车型')
				// console.log("车队广告图片车队广告图片车队广告图片车队广告图片车队广告图片车队广告图片车队广告图片车队广告图片",that.advList)
			})
			//初始化数据
			for (var index = 0; index < 10; index ++) {
				var paramsName = 'params' + index;
				var isNoData = 'isNoData' + index;
				var isNoMore = 'isNoMore' + index;
				var swiperFleet = 'swiperFleet' + index;
				var indicatorIndex = 'indicatorIndex' + index;
				var params = {
					pageSize: 10,
					pageNum: 1,
					count: false,
				}
				that[paramsName] = params;
				that[isNoData] = "loading";
				that[isNoMore] = "more";
				
				var platformFleetArr = 'platformFleetArr' + index;
				that[platformFleetArr] = [];
				that[swiperFleet] = [];
				that[indicatorIndex] = 0;
			}
			var typeArr = this.typeArr;
			var res = await ship.postRequest("/ts/vehicle/length/get");
			// console.log(res, '车长')
			if (res.retCode == "0000000") {
				var carLen = res.rspBody.items;
				typeArr[1].data = carLen;
			}
			var res = await ship.postRequest("/ts/vehicle/type/get");
			// console.log(res, '车型')
			if (res.retCode == "0000000") {
				var carType = res.rspBody.items;
				typeArr[2].data = carType;
			}
			
			//优势区域
			var area = await ship.newQueryPostRequest("/cd/fleetAdvantageArea/list");
			// console.log(area, '优势区域');
			// console.log("更新",  this.params);
			if (area.retCode == "0000000") {
				var areaType = area.rspBody;
				areaType.forEach(item => {
					item.typeName = item.areaName
				})
				typeArr[3].data = areaType;
			}
			
			//优势行业
			var area1 = await ship.newQueryPostRequest("/cd/fleetAdvantageIndustry/list");
			// console.log(area, '优势区域');
			// console.log("更新",  this.params);
			if (area1.retCode == "0000000") {
				var area1Type = area1.rspBody;
				area1Type.forEach(item => {
					item.typeName = item.industryName
				})
				typeArr[4].data = area1Type;
			}
			// console.log("更新",  this.params);
			// var motorcadeRes = await ship.postRequest("/ts/motorcade/type/get");
			// console.log(motorcadeRes, '类型')
			// if (motorcadeRes.retCode == "0000000") {
			// 	var motorcadeType = motorcadeRes.rspBody.items;
			// 	typeArr[0].data = motorcadeType;
			// 	that.typeArr = typeArr;
			// }
			
			//获取省市数据
			var provinceLocal = uni.getStorageSync("provinceLocal");
			if (provinceLocal.length > 0) {
				provinceLocal = JSON.parse(provinceLocal);
				// console.log(provinceLocal, '省市数据');
				provinceLocal.forEach(item => {
					typeArr[5].data.push({
						typeName: item.name,
						code: item.code
					})
				})
			} else {
				var result = await ship.postRequest("/ts/nationDict/getBasicData");
				provinceLocal = result.rspBody;
				provinceLocal.forEach(item => {
					typeArr[5].data.push({
						typeName: item.name,
						code: item.code
					})
				})
				uni.setStorageSync("provinceLocal", JSON.stringify(provinceLocal));
			}
			
			that.typeArr = typeArr;
			
			//获取车队属性
			// var responseAttr = await ship.postRequest("/ts/motorcade/type/get");
			// var attrArr = responseAttr.rspBody.items;
			// console.log(responseAttr, '车队属性')
			// attrArr.unshift({typeName: '平台'})
			// attrArr.push({typeName: '我的'})
			// that.tagInfo = attrArr;
			
			this.getHotkeyData(); // 获取热搜词
			uni.$on("fleetList", (type, flag) => {
				console.log(type, flag, "刷新参数")
				var myFleetIndex = this.myFleetIndex;
				if (type == "refresh") {
					if (flag == 5) {
						if (myFleetIndex == 0 || !myFleetIndex) {
							this.getMyFleetList("refresh");
						} else if (myFleetIndex == 1) {
							this.getAddFleetList("refresh")
						} else {
							this.getMyCompanyList("refresh")
						}
					} else {
						this.getPlatformFleet("refresh")
					}
				} else {
					if (flag == 5) {
						if (myFleetIndex == 0 || !myFleetIndex) {
							this.getMyFleetList("more")
						} else if (myFleetIndex == 1) {
							this.getAddFleetList("more")
						} else {
							this.getMyCompanyList("more")
						}
					} else {
						this.getPlatformFleet("more")
					}
					
				}
			})
			
			//重置搜索条件
			uni.$on("resetSearch", params => {
				this.platformParams = params;
			})
			uni.$on("searchResult", params => {
				//筛选搜索框搜索
				this.$refs.rightSelectPopup.close();
				uni.showLoading({
					title:'加载中'
				})
				console.log(params, '搜索参数')
				var selectTag = this.selectTag;
				var myFleetIndex = this.myFleetIndex;
				this.platformParams = params;
				if (selectTag == 5) {
					if (myFleetIndex == 0 || !myFleetIndex) {
						this.getMyFleetList("refresh")
					} else if (myFleetIndex == 1) {
						this.getAddFleetList("refresh")
					} else {
						this.getMyCompanyList("refresh")
					}
				} else {
					this.getPlatformFleet("refresh")
				}
				
			})
			uni.$on("keywordChange", keyword => {
				this.keyWord0 = keyword;
			})
			uni.$on("keyWordSearch", keyWord => {
				console.log(keyWord, '参数11')
				uni.showLoading({
					title:'加载中'
				})
				this.keyWord0 = keyWord.name;
				this.isScan = keyWord.isScan;
				var selectTag = this.selectTag;
				var myFleetIndex = this.myFleetIndex;
				if (selectTag == 5) {
					if (myFleetIndex == 0 || !myFleetIndex) {
						this.getMyFleetList("refresh")
					} else if (myFleetIndex == 1) {
						this.getAddFleetList("refresh")
					} else {
						this.getMyCompanyList("refresh")
					}
				} else {
					this.getPlatformFleet("refresh")
				}
			})
			//扫码查询车队信息
			uni.$on("scanForResult", param => {
				this.getScanResult(param);
			})
			//登录登录清空搜索条件
			uni.$on("refreshData_fleet", () => {
				this.platformParams = new Object();
				this.params0.pageNum = 1;
				this.params1.pageNum = 1;
				this.params2.pageNum = 1;
				this.params3.pageNum = 1;
				this.selectTag = 0;
				this.keyWord0 = "";
				this.$refs.searchBoxRef.refreshMsg()
				//获取平台车队
				this.getPlatformFleet("refresh")
			})
			//退出车队
			uni.$on("fleetOut", item => {
				this.outItem = item;
				this.$refs.popupOut.open();
			})
			//加入车队
			uni.$on("fleetAdd", item => {
				this.addFleet(item);
			})
			
			//查询我的页签中的列表
			uni.$on("fetchMyFleet", index => {
				this.logisticsFleetArr = [];
				this.myFleetIndex = index;
				this.isNoData5 = "loading";
				this.isNoMore5 = "more";
				if (index == 0) {
					//查询我创建的
					this.getMyFleetList("refresh");
				} else if (index == 1) {
					//查询我的
					this.getAddFleetList("refresh");
				} else {
					this.getMyCompanyList("refresh");
				}
			})
			
			//获取平台车队
			this.getPlatformFleet("refresh")
		},
		onUnload() {
			uni.$off("fleetList");
			uni.$off("searchResult");
			uni.$off("keyWordSearch");
			uni.$off("fleetOut");
			uni.$off("fleetAdd");
			uni.$off("keywordChange");
			uni.$off("resetSearch");
			uni.$off("fetchMyFleet");
			uni.$off("scanForResult");
		},
		onReady() {
			let that = this;
			uni.getSystemInfo({
			    success: function (res) {
					that.scrollTopHeight = 'padding-top:' + res.statusBarHeight * 2 + 'rpx;';
			    }
			});
			
			console.log(that.scrollTopHeight);
		},
		methods: {
			setActiveAdv(typeName){
				let that = this 
				let activeAdvObj = {}
				that.advList.some(item => {
					if(item.typeName == typeName){
						// console.log(item)
						activeAdvObj.typeName = item.typeName
						activeAdvObj.key = item.key
						activeAdvObj.info = ['','']
						item.info.forEach(infoItem => {
							if(infoItem.advLocation.indexOf('SMALL') != -1){
								// console.log(infoItem)
								activeAdvObj.info[0] = JSON.parse(JSON.stringify(infoItem))
							}
							if(infoItem.advLocation.indexOf('BIG') != -1){
								// console.log(infoItem)
								activeAdvObj.info[1] = JSON.parse(JSON.stringify(infoItem))
							}
						})
						// console.log('当前显示的广告当前显示的广告当前显示的广告当前显示的广告当前显示的广告',that.activeAdvObj)
						return true
					}
				})
				that.activeAdvObj = activeAdvObj
				// console.log('当前显示的广告当前显示的广告当前显示的广告当前显示的广告当前显示的广告',that.activeAdvObj)
			},
			showBigBanner(item, img) {
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
						url: '../../advertisingH5/advertisingH5'
					})
				}
			},
			getHotkeyData() { // 获取热搜词
				let that = this;
				ship.newQueryPostRequest('/cd/fleetHotkey/list')
				.then(res=>{
					// console.log('热搜词', res);
					if(res.retCode == '0000000') {
						that.hotkeyList = res.rspBody;
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			toCreatFleet() { // 创建车队
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify != 1 || faceVerify != 1) {
					uni.showToast({
						title: '请先实名认证',
						icon: 'none'
					})
					return;
				}
				uni.navigateTo({
					url: '/pages/my/fleet/fleetCreate/fleetCreate?type=create'
				})
			},
			cancelOut() {
				this.$refs.popupOut.close();
			},
			async addFleet(item) {
				try{
					uni.showLoading();
					var fleetId = item.id;
					var res = await ship.postRequest("/cd/fleetWithUser/save", {fleetId: fleetId, status: 3});
					console.log(res, '关注的车队', fleetId)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '关注成功',
							icon: 'none'
						})
						this.refresh(); //刷新
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			refresh() {
				var selectTag = this.selectTag;
				var myFleetIndex = this.myFleetIndex;
				if (selectTag == 5) {
					if (myFleetIndex == 0 || !myFleetIndex) {
						//查询我创建的
						this.getMyFleetList("refresh");
					} else {
						//查询我加入的
						this.getAddFleetList("refresh");
					}
				} else {
					this.getPlatformFleet("refresh");	
				}
			},
			confirmOut() {
				this.$refs.popupOut.close();
				var outItem = this.outItem;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo || !outItem) return;
				var userCode = JSON.parse(userInfo).attrs.userCode;
				var fleetId = outItem.id;
				var status = 3;
				var params = {
					userCode,
					status,
					fleetId,
				}
				uni.showLoading();
				ship.postRequest("/cd/fleetWithUser/remove", params)
				.then(res => {
					console.log(res, 'asa')
					uni.hideLoading();
					if (res.retCode == '0000000') {
						uni.showToast({
							title: "成功",
							icon: 'none',
						})
						var myFleetIndex = this.myFleetIndex;
						var selectTag = this.selectTag;
						setTimeout(() => {
							if (selectTag == 5) {
								if (myFleetIndex == 0 || !myFleetIndex) {
									this.getMyFleetList("refresh")
								} else if (myFleetIndex == 1) {
									this.getAddFleetList("refresh")
								} else {
									this.getMyCompanyList("refresh")
								}
							} else {
								this.getPlatformFleet("refresh")
							}
						}, 1000)
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.hideLoading();
				})
			},
			showSelectPopup() {
				this.$refs.rightSelectPopup.open();
			},
			changeTag(item, key) {
				let that = this
				this.selectTag = key;
				var id = '#headTag' + key;
				
				var isScanForResult = this.isScanForResult;
				if (isScanForResult) {
					this.isScanForResult = false;
					this.keyWord0 = "";
				}
				console.log('车队类别', item, key)
				console.log('车队类别', item, key)
				that.setActiveAdv(item.typeName)
				const query = uni.createSelectorQuery().in(this);
				query.select(id).boundingClientRect(data => {
					console.log(data, '位置信息');
					var left = data.left*2;
					var tagInfo = this.tagInfo;
					var eleAllWidth = tagInfo.length * 135;
					var windowWidth = uni.getSystemInfoSync().windowWidth * 2;
					var itemWidth = 135;
					var scrollWidth = (left - windowWidth/2 + itemWidth/2);
					console.log(scrollWidth, '宽度');
					if (scrollWidth < 0) {
						this.scrollLeft = 0;
					};
					if (eleAllWidth - windowWidth > scrollWidth) {
						this.scrollLeft = scrollWidth/2
					}
					if (eleAllWidth - windowWidth <= scrollWidth) {
						this.scrollLeft = 10000
					}
				}).exec();
				if (key == 5) {
					this.isNoData1 = "loading";
					this.logisticsFleetArr = [];
					if (this.myFleetIndex == 0 || !this.myFleetIndex) {
						this.getMyFleetList("refresh");
					} else if (this.myFleetIndex == 1) {
						this.getAddFleetList("refresh");
					} else {
						this.getMyCompanyList("refresh");
					}
					
				} else {
					console.log('aasa');
					var isNoData = 'isNoData' + key;
					this[isNoData] = "loading";
					var platformFleetArr = 'platformFleetArr' + key;
					this[platformFleetArr] = [];
					this.getPlatformFleet("refresh")
				}
				
			},
			async getMyCompanyList(type) {
				//获取合作的车队
				var pageSize = this.params5.pageSize;
				var params = 'params' + this.selectTag;
				if (type == "refresh") {
					this.params5.pageNum = 1;
				} else {
					this.params5.pageNum ++;
				}
				this.params5.isMyCooperateFleet = 1;
				this.params5.isOwner != undefined && delete this.params5.isOwner
				this.params5.isMyFleet != undefined && delete this.params5.isMyFleet
				
				//判断是否有关键字
				var keyWord2 = this.keyWord0;
				if (keyWord2) {
					this.params5.keyword = keyWord2;
				} else {
					this.params5.keyword && delete this.params5.keyword
				}
				
				//筛选是否有值
				var platformParams = this.platformParams;
				if (platformParams.cartLengthList) {
					this.params5.cartLengthList = platformParams.cartLengthList;
				} else {
					this.params5.cartLengthList && delete this.params5.cartLengthList
				}
				if (platformParams.modelList) {
					this.params5.modelList = platformParams.modelList;
				} else {
					this.params5.modelList && delete this.params5.modelList
				}
				
				if (platformParams.memberRangeList) {
					this.params5.memberRangeList = platformParams.memberRangeList;
				} else {
					this.params5.memberRangeList && delete this.params5.memberRangeList
				}
				
				if (platformParams.advantageAreaList) {
					this[params].advantageAreaList = platformParams.advantageAreaList;
				} else {
					this[params].advantageAreaList && delete this[params].advantageAreaList
				}
				if (platformParams.advantageIndustryList) {
					this[params].advantageIndustryList = platformParams.advantageIndustryList;
				} else {
					this[params].advantageIndustryList && delete this[params].advantageIndustryList
				}
				if (platformParams.provinceNameList) {
					this[params].provinceNameList = platformParams.provinceNameList;
				} else {
					this[params].provinceNameList && delete this[params].provinceNameList
				}
				this.params5.fleetAttributesList && delete this.params5.fleetAttributesList 
				
				console.log(this.params5, '搜索的参数');
				try{
					var res = await ship.newQueryPostRequest("/cd/fleet/list", this.params5);
					console.log(res);
					uni.hideLoading();
					uni.stopPullDownRefresh();
					if (res.retCode == "0000000") {
						var len = res.rspBody.items.length;
						if (type == "refresh") {
							this.logisticsFleetArr = res.rspBody.items;
							this.triggered5 = false;
							this.freshing5 = false;
							this.isNoData5 = "loadingComplete";
							this.isNoMore5 = (len < pageSize && len > 0)  ? 'noMore' : 'more'
						} else {
							var items = res.rspBody.items; 
							this.logisticsFleetArr = this.logisticsFleetArr.concat(items);
							this.isNoMore5 = len < pageSize ? 'noMore' : 'more'
						}
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
						this.isNoMore5 = "more";
						this.isNoData5 = "loadingComplete";
					}
				}catch(e){
					uni.stopPullDownRefresh();
					uni.hideLoading();
					
					this.isNoMore5 = "more";
					this.isNoData5 = "loadingComplete";
					//TODO handle the exception
				}
			},
			async getAddFleetList(type) {
				//获取我加入的车队
				console.log(type);
				var pageSize = this.params5.pageSize;
				var params = 'params' + this.selectTag;
				this.params5.isOwner = 0;
				this.params5.isMyFleet = 1;
				this.params5.isMyCooperateFleet && delete this.params5.isMyCooperateFleet;
				
				if (type == "refresh") {
					this.params5.pageNum = 1;
				} else {
					this.params5.pageNum ++;
				}
				
				//判断是否有关键字
				var keyWord2 = this.keyWord0;
				if (keyWord2) {
					this.params5.keyword = keyWord2;
				} else {
					this.params5.keyword && delete this.params5.keyword
				}
				
				//筛选是否有值
				var platformParams = this.platformParams;
				if (platformParams.cartLengthList) {
					this.params5.cartLengthList = platformParams.cartLengthList;
				} else {
					this.params5.cartLengthList && delete this.params5.cartLengthList
				}
				if (platformParams.modelList) {
					this.params5.modelList = platformParams.modelList;
				} else {
					this.params5.modelList && delete this.params5.modelList
				}
				
				if (platformParams.memberRangeList) {
					this.params5.memberRangeList = platformParams.memberRangeList;
				} else {
					this.params5.memberRangeList && delete this.params5.memberRangeList
				}
				
				if (platformParams.advantageAreaList) {
					this[params].advantageAreaList = platformParams.advantageAreaList;
				} else {
					this[params].advantageAreaList && delete this[params].advantageAreaList
				}
				if (platformParams.advantageIndustryList) {
					this[params].advantageIndustryList = platformParams.advantageIndustryList;
				} else {
					this[params].advantageIndustryList && delete this[params].advantageIndustryList
				}
				if (platformParams.provinceNameList) {
					this[params].provinceName = platformParams.provinceNameList[0];
				} else {
					this[params].provinceName && delete this[params].provinceName
				}
				this.params5.fleetAttributesList && delete this.params5.fleetAttributesList 
				this.params5.isCardFleet = 0;
				console.log(this.params5, '参数')
				try{
					var res = await ship.newQueryPostRequest("/cd/fleet/list", this.params5);
					console.log(res);
					uni.hideLoading();
					uni.stopPullDownRefresh();
					if (res.retCode == "0000000") {
						var len = res.rspBody.items.length;
						if (type == "refresh") {
							this.logisticsFleetArr = res.rspBody.items;
							this.isNoData5 = "loadingComplete";
							this.isNoMore5 = (len < pageSize && len > 0)  ? 'noMore' : 'more'
						} else {
							var items = res.rspBody.items; 
							this.logisticsFleetArr = this.logisticsFleetArr.concat(items);
							this.isNoMore5 = len < pageSize ? 'noMore' : 'more'
						}
						
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
						
						this.isNoMore5 = "more";
						this.isNoData5 = "loadingComplete";
					}
				}catch(e){
					console.log(e)
					uni.stopPullDownRefresh();
					uni.hideLoading();
					
					this.isNoMore5 = "more";
					this.isNoData5 = "loadingComplete";
					//TODO handle the exception
				}
				
			},
			async getMyFleetList(type) {
				//获取我的车队
				var pageSize = this.params5.pageSize;
				var params = 'params' + this.selectTag;
				if (type == "refresh") {
					this.params5.pageNum = 1;
				} else {
					this.params5.pageNum ++;
				}
				this.params5.isOwner = 1;
				this.params5.isMyFleet = 1;
				this.params5.isMyCooperateFleet && delete this.params5.isMyCooperateFleet;
				//判断是否有关键字
				var keyWord3 = this.keyWord0;
				if (keyWord3) {
					this.params5.keyword = keyWord3;
				} else {
					this.params5.keyword && delete this.params5.keyword
				}
				
				//筛选是否有值
				var platformParams = this.platformParams;
				if (platformParams.cartLengthList) {
					this.params5.cartLengthList = platformParams.cartLengthList;
				} else {
					this.params5.cartLengthList && delete this.params5.cartLengthList
				}
				if (platformParams.modelList) {
					this.params5.modelList = platformParams.modelList;
				} else {
					this.params5.modelList && delete this.params5.modelList
				}
				
				if (platformParams.memberRangeList) {
					this.params5.memberRangeList = platformParams.memberRangeList;
				} else {
					this.params5.memberRangeList && delete this.params5.memberRangeList
				}
				
				if (platformParams.advantageAreaList) {
					this[params].advantageAreaList = platformParams.advantageAreaList;
				} else {
					this[params].advantageAreaList && delete this[params].advantageAreaList
				}
				if (platformParams.advantageIndustryList) {
					this[params].advantageIndustryList = platformParams.advantageIndustryList;
				} else {
					this[params].advantageIndustryList && delete this[params].advantageIndustryList
				}
				if (platformParams.provinceNameList) {
					this[params].provinceName = platformParams.provinceNameList[0];
				} else {
					this[params].provinceName && delete this[params].provinceName
				}
				this.params5.fleetAttributesList && delete this.params5.fleetAttributesList 
				this.params5.isCardFleet = 0;
				
				try{
					var res = await ship.newQueryPostRequest("/cd/fleet/list", this.params5);
					console.log(res, '我的车队', this.params5)
					uni.hideLoading();
					uni.stopPullDownRefresh();
					if (res.retCode == "0000000") {
						var len = res.rspBody.items.length;
						if (type == "refresh") {
							this.logisticsFleetArr = res.rspBody.items;
							this.isNoData5 = "loadingComplete";
							this.isNoMore5 = (len < pageSize && len > 0)  ? 'noMore' : 'more'
						} else {
							var items = res.rspBody.items; 
							this.logisticsFleetArr = this.logisticsFleetArr.concat(items);
							this.isNoMore5 = len < pageSize ? 'noMore' : 'more'
						}
						
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
						
						this.isNoMore5 = "more";
						this.isNoData5 = "loadingComplete";
					}
				}catch(e){
					uni.stopPullDownRefresh();
					uni.hideLoading();
					
					this.isNoMore5 = "more";
					this.isNoData5 = "loadingComplete";
					//TODO handle the exception
				}
			},
			async getPlatformFleet(type) {
				//获取平台车队
				var that = this;
				var selectTag = this.selectTag;
				var params = 'params' + selectTag;
				var isNoMore = 'isNoMore' + selectTag;
				var swiperFleet = 'swiperFleet' + selectTag;
				var tagInfo = this.tagInfo;
				console.log(this[params], 'can1')
				var pageSize = this[params].pageSize;
				console.log(pageSize,'aa')
				if (type == "refresh") {
					this[params].pageNum = 1;
				} else {
					this[isNoMore] = "loading";
					this[params].pageNum ++;
				}
				console.log(this[params], 'asaa')
				var typeName = tagInfo[selectTag].typeName;
				console.log(typeName, 'asa', this[params]);
				this[params].fleetAttributesList = [typeName];
				//判断是否有关键字
				var keyWord0 = this.keyWord0;
				if (keyWord0) {
					this[params].keyword = keyWord0;
				} else {
					this[params].keyword && delete this[params].keyword
				}
				var platformParams = this.platformParams;
				//筛选是否有值
				if (platformParams.cartLengthList) {
					this[params].cartLengthList = platformParams.cartLengthList;
				} else {
					this[params].cartLengthList && delete this[params].cartLengthList
				}
				if (platformParams.modelList) {
					this[params].modelList = platformParams.modelList;
				} else {
					this[params].modelList && delete this[params].modelList
				}
				
				if (platformParams.memberRangeList) {
					this[params].memberRangeList = platformParams.memberRangeList;
				} else {
					this[params].memberRangeList && delete this[params].memberRangeList
				}
				
				if (platformParams.advantageAreaList) {
					this[params].advantageAreaList = platformParams.advantageAreaList;
				} else {
					this[params].advantageAreaList && delete this[params].advantageAreaList
				}
				if (platformParams.advantageIndustryList) {
					this[params].advantageIndustryList = platformParams.advantageIndustryList;
				} else {
					this[params].advantageIndustryList && delete this[params].advantageIndustryList
				}
				if (platformParams.provinceNameList) {
					this[params].provinceName = platformParams.provinceNameList[0];
				} else {
					this[params].provinceName && delete this[params].provinceName
				}
				
				console.log(this[params], '搜索的参数');
				
				var triggered = 'triggered' + selectTag;
				var freshing = 'freshing' + selectTag;
				var isNoData = 'isNoData' + selectTag;
				var platformFleetArr = 'platformFleetArr' + selectTag;
				try{
					//获取轮播图
					var paramsServal = new Object();
					paramsServal.fleetAttributesList = this[params].fleetAttributesList;
					paramsServal.pageSize && delete paramsServal.pageSize;
					paramsServal.pageNum && delete paramsServal.pageNum;
					paramsServal.isRecommend = 1;
					// console.log(paramsServal, '轮播图的1121');
					var resServal = await ship.newQueryPostRequest("/cd/fleet/list", paramsServal);
					var res = await ship.newQueryPostRequest("/cd/fleet/list", this[params]);
					// console.log(res, '平台车队')
					uni.hideLoading();
					uni.stopPullDownRefresh();
					// console.log(resServal, '轮播图片');
					if (resServal.retCode == "0000000") {
						var swiperServal = resServal.rspBody.items;
						if (swiperServal.length > 0) {
							swiperServal.sort((x, y) => {
								return x.recommendIndex > y.recommendIndex
							})
						}
						that[swiperFleet] = swiperServal;
					} else {
						that[swiperFleet] = [];
					}
					if (res.retCode == "0000000") {
						var len = res.rspBody.items.length;
						if (type == "refresh") {
							that[platformFleetArr] = res.rspBody.items;
							that[triggered] = false;
							that[freshing] = false;
							that[isNoData] = "loadingComplete";
							that[isNoMore] = (len < pageSize && len > 0)  ? 'noMore' : 'more';
							console.log(that[isNoData], 'aasas', isNoData)
						} else {
							var items = res.rspBody.items; 
							that[platformFleetArr] = that[platformFleetArr].concat(items);
							that[isNoMore] = len < pageSize ? 'noMore' : 'more'
						}
						
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
						this[triggered] = false;
						this[freshing] = false;
						this[isNoMore] = "more";
						this[isNoData] = "loadingComplete";
					}
					that.$forceUpdate();
				}catch(e){
					console.log(e)
					uni.stopPullDownRefresh();
					uni.hideLoading();
					this[triggered] = false;
					this[freshing] = false;
					this[isNoMore] = "more";
					this[isNoData] = "loadingComplete";
					//TODO handle the exception
				}
				
			},
			async getLogisticsFleet(type) {
				//物流车队
				var pageSize = this.params1.pageSize;
				if (type == "refresh") {
					this.params1.pageNum = 1;
				} else {
					this.isNoMore1 = "loading";
					this.params1.pageNum ++;
				}
				
				//判断是否有关键字
				var keyWord0 = this.keyWord0;
				if (keyWord0) {
					this.params1.keyword = keyWord0;
				} else {
					this.params1.keyword && delete this.params1.keyword
				}
				
				//筛选是否有值
				var platformParams = this.platformParams;
				if (platformParams.fleetAttributesList) {
					this.params1.fleetAttributesList = platformParams.fleetAttributesList;
				} else {
					this.params1.fleetAttributesList && delete this.params1.fleetAttributesList
				}
				if (platformParams.cartLengthList) {
					this.params1.cartLengthList = platformParams.cartLengthList;
				} else {
					this.params1.cartLengthList && delete this.params1.cartLengthList
				}
				if (platformParams.modelList) {
					this.params1.modelList = platformParams.modelList;
				} else {
					this.params1.modelList && delete this.params1.modelList
				}
				
				if (platformParams.memberRangeList) {
					this.params1.memberRangeList = platformParams.memberRangeList;
				} else {
					this.params1.memberRangeList && delete this.params1.memberRangeList
				}
				console.log(this.params1, '搜索的参数');
				
				
				try{
					var res = await ship.newQueryPostRequest("/cd/fleet/list", this.params1);
					console.log(res, '物流车队')
					uni.hideLoading();
					uni.stopPullDownRefresh();
					if (res.retCode == "0000000") {
						var len = res.rspBody.items.length;
						if (type == "refresh") {
							this.logisticsFleetArr = res.rspBody.items;
							this.triggered1 = false;
							this.freshing1 = false;
							this.isNoData1 = "loadingComplete";
							this.isNoMore1 = (len < pageSize && len > 0)  ? 'noMore' : 'more'
						} else {
							var items = res.rspBody.items; 
							this.logisticsFleetArr = this.logisticsFleetArr.concat(items);
							this.isNoMore1 = len < pageSize ? 'noMore' : 'more'
						}
						
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
						this.triggered1 = false;
						this.freshing1 = false;
						this.isNoMore1 = "more";
						this.isNoData1 = "loadingComplete";
					}
				}catch(e){
					uni.stopPullDownRefresh();
					uni.hideLoading();
					this.triggered1 = false;
					this.freshing1 = false;
					this.isNoMore1 = "more";
					this.isNoData1 = "loadingComplete";
					//TODO handle the exception
				}
			},
			//扫码获取车队信息
			async getScanResult(param) {
				try{
					var fleetId = param.fleetId;
					uni.showLoading({
						title: '加载中...'
					})
					var res = await ship.newQueryPostRequest("/cd/fleet/list", {
						id: fleetId,
					});
					console.log(res);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var len = res.rspBody.items.length;
						if (len < 1) {
							uni.showToast({
								title: "此二维码无效",
								icon: 'none',
							})
						}
						var fleetAttributes = res.rspBody.items[0].fleetAttributes;
						var tagInfo = this.tagInfo;
						var findIndex = tagInfo.findIndex(item => {
							return item.typeName == fleetAttributes;
						})
						if (findIndex < 0) {
							findIndex = 0
						}
						this.isScanForResult = true;
						this.keyWord0 = res.rspBody.items[0].code;
						var  platformFleetArr = 'platformFleetArr' + findIndex;
						var isNoMore = 'isNoMore' + findIndex;
						var isNoData = 'isNoData' + findIndex;
						this.selectTag = findIndex;
						this[platformFleetArr] = res.rspBody.items;
						this[isNoMore] = "noMore";
						this[isNoData] = "loadingComplete";
						console.log(res.rspBody.items, '扫码数据');
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				}catch(e){
					uni.stopPullDownRefresh();
					uni.hideLoading();
					//TODO handle the exception
				}
				
			},
			changeCartype(item, key) {
				this.carTypeFlag = key;
			},
			changeDetails(item, key) {
				this.detailsFlag = key;
			},
			changeIndicator0(e) {
				// console.log(e);
				this.indicatorIndex0 = e.detail.current;
				this.$forceUpdate();
			},
			changeIndicator1(e) {
				console.log(e);
				this.indicatorIndex1 = e.detail.current;
				this.$forceUpdate();
			},
			changeIndicator2(e) {
				console.log(e);
				this.indicatorIndex2 = e.detail.current;
				this.$forceUpdate();
			},
			changeIndicator3(e) {
				console.log(e);
				this.indicatorIndex3 = e.detail.current;
				this.$forceUpdate();
			},
			changeIndicator4(e) {
				console.log(e);
				this.indicatorIndex4 = e.detail.current;
				this.$forceUpdate();
			},
			changeIndicator5(e) {
				console.log(e);
				this.indicatorIndex5 = e.detail.current;
				this.$forceUpdate();
			},
			changeIndicator6(e) {
				console.log(e);
				this.indicatorIndex6 = e.detail.current;
				this.$forceUpdate();
			},
			changeIndicator7(e) {
				console.log(e);
				this.indicatorIndex7 = e.detail.current;
				this.$forceUpdate();
			},
			goFleetDetail(data) {
				console.log('qqq',data);
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(data)
				})
				// uni.navigateTo({
				// 	url: '/pages/goodsDelivery/fleetIndex/fleetDetails?info=' + JSON.stringify(data)
				// })
				
			},
		}
	}
</script>

<style lang="scss" >
.advs {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 0;
		margin-bottom: 20rpx;
		margin-left: 24rpx;
		width: calc(100vw - 48rpx);
		height: 140rpx;
		box-sizing: border-box;
		border-radius: 10rpx;
		overflow: hidden;
		position: relative;
		.mainBanner {
			width: 100%;
			height: 140rpx;
		}
		.advertiesGif {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			height: 100rpx;
			width: 100rpx;
		}
	}
	/deep/.headTagList::-webkit-scrollbar {
	　　display: none;
		width: 0;
		height: 0; 
		background-color: transparent;
	}
	.headTagList::-webkit-scrollbar {
	　　display: none;
		width: 0; 
		height: 0; 
		background-color: transparent;
	}
	.fleetIndex {
		padding-top:304rpx; // 280 + 24
		.flleetHead {
			background: linear-gradient(0deg, #1E52C4 0%, #497FFB 100%);
			padding-bottom: 12rpx;
			position: fixed;
			width: 100vw;
			top: 0;
			left: 0;
			height: 280rpx;
			z-index: 99;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			.headTagList {
				padding:18rpx 0;
				width: 100vw;
				white-space: nowrap;
				box-sizing: border-box;
				.tagBtn {
					display: inline-block;
					width: 108rpx;
					text-align: center;
					.checkedTag {
						font-size: 32rpx;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 44rpx;
					}
					.tagMsg {
						font-size: 30rpx;
						font-weight: 500;
						color: #C8D4EF;
						line-height: 42rpx;
					}
					.checkedLine {
						width: 68rpx;
						height: 8rpx;
						background: linear-gradient(347deg, #FF3034 0%, #FF9F21 100%);
						box-shadow: 0px 2rpx 6rpx 0px rgba(0,0,0,0.11);
						border-radius: 4rpx;
						margin: 4rpx auto 0 auto;
					}
					.tagLine {
						
					}
				}
			}
			.headBtnGroup {
				padding: 108rpx 32rpx 0 32rpx;
				display: flex;
				align-items: center;
				
				.selectBox {
					width: 100rpx;
					height: 70rpx;
					flex-shrink: 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					margin-left: 18rpx;
					.selectNum {
						border-radius: 12rpx;
						background-color: rgba(208, 229, 255, 1);
						width: 42rpx;
						height: 32rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						color: rgba(1, 113, 249, 1);
						font-size: 24rpx;
					}
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
					.selectFlleetIcon {
						width: 22rpx;
						height: 24rpx;
						margin-left: 4rpx;
					}
				}
				.creatBox {
					flex-shrink: 0;
					height: 58rpx;
					width: 144rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 22rpx;
					background: #FF7700;
					// border-radius: 8rpx;
					border-radius: 30rpx;
					color: #FFFFFF;
					font-size: 28rpx;
					.creatFlleetIcon {
						height: 36rpx;
						width: 36rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
		
	}
	.out {
		width: calc(100vw - 64rpx);
		background-color: #FFFFFF;
		height: 352rpx;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		.title {
			font-size: 36rpx;
			color: #333333;
			font-weight: 500;
			padding: 48rpx 60rpx 0;
			box-sizing: border-box;
		}
		.text {
			padding: 0 60rpx;
			flex: 1;
			font-size: 32rpx;
			color: #333333;
			box-sizing: border-box;
			display: flex;
			align-items: center;
		}
		
		.bot {
			display: flex;
			flex-direction: row;
			height: 92rpx;
			border-top: 1px solid #F3F3F3;
			font-size: 32rpx;
			.cancel {
				flex: 1;
				border-right: 1px solid #F3F3F3;
				color: #777777;
				font-weight: 500;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.confirm {
				flex: 1;
				font-weight: 500;
				color: #4AA2F3;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.swiper-indicator {
		position: absolute;
		right: 48rpx;
		bottom: 18rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		.indicator {
			width: 8upx;
			height: 6upx;
			border-radius: 3rpx;
			background-color: rgba(119, 119, 119, 1);
			&+.indicator {
				margin-left: 10upx;
			}
			&.active {
				background: rgba(255, 255, 255, 1);
				width: 26upx !important;
			}
		}
	}
	.swiper-container {
		margin-left: 24rpx;
		position: relative;
		.swiper-icon {
			position: absolute;
			left: 0;
			top: 0;
			width: 144rpx;
			height: 66rpx;
			text-align: center;
			line-height: 66rpx;
			background-color: rgba(34, 34, 34, .74);
			color: rgba(254, 187, 127, 1);
			font-size: 24rpx;
			z-index: 9;
			border-radius: 12rpx 0 12rpx 0;
		}
		.swiper {
			width: calc(100vw - 48rpx);
			height: 252rpx;
			overflow: hidden;
			border-radius: 12rpx;
			transform: translateY(0);
		}
		.img-fleet {
			width: calc(100vw - 48rpx);
			height: 252rpx;
		}
	}
	scroll-view ::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}
</style>
