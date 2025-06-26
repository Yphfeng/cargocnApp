<template>
	<view class="car-source">
		<!-- 广告图 -->
		<view class="imgContent" v-if="sourceSmallBanner.length > 0">
			<swiper class="swiperBanner" :autoplay="true">
				<swiper-item v-if="sourceSmallBanner[0] && sourceSmallBanner[0].advUrl" >
					<image :src="sourceSmallBanner[0].advUrl"  class="img-source-adv" @click="showBigBanner(sourceSmallBanner[0])"></image>
				</swiper-item>
				<swiper-item  v-if="sourceSmallBanner[1] && sourceSmallBanner[1].advUrl">
					<image :src="sourceSmallBanner[1].advUrl"  class="img-source-adv" @click="showBigBanner(sourceSmallBanner[1])"></image>
				</swiper-item>
				<swiper-item  v-if="sourceSmallBanner[2] && sourceSmallBanner[2].advUrl">
					<image :src="sourceSmallBanner[2].advUrl"  class="img-source-adv" @click="showBigBanner(sourceSmallBanner[2])"></image>
				</swiper-item>
			</swiper>
			
		</view>
		<!--公告栏 -->
		<view class="notice" @click="showNoticePopup">
			<image src="/static/images/ship/notice-icon.png" mode="widthFix" class="notice-icon"></image>
			<view class="swiperHint-source" id="hintSwiper1">
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
		</view>
		<!--车辆配置项 -->
		<view class="settings">
			<view class="my-settings">
				<view class="set-list">
					<view class="set-type-title set-title">
						使用车型<text class="require-text">*</text>
					</view>
					<view class="car-source-list noCar" v-if="vehicleArr.length < 1">您还没配置车辆，快去配置吧</view>
					
						<scroll-view :scroll-x="true" class="car-source-list" v-else>
							<view class="car--source-list-item" v-for="(item, index) in vehicleArr" :class="{active: myCarSettingIndex == index}" @click="switchMyCarSettings(index)">
								{{item.carLength}}米{{item.carModel}}
							</view>
						</scroll-view>
					
					
					<view class="set-title">
						货源线路<text class="require-text">*</text>
					</view>
					<view class="car-source-list car-router noCar" v-if="routerArr.length < 1 && !centerAddr">您还没配置线路，快去配置吧</view>
					<scroll-view :scroll-x="true" class="car-source-list car-router" v-else>
						<view class="car--router-list-item" :class="{active: myRouterSettingIndex == -1}" @click="switchMyRouterSettings(-1)" v-if="centerAddr">
							{{centerAddr.subName}}到全国
						</view>
						<view class="car--router-list-item" v-for="(item, index) in routerArr" :class="{active: myRouterSettingIndex == index}" @click="switchMyRouterSettings(index)">
							{{item.subSenderAddr}}到{{item.subReceiverAddr}}
						</view>
					</scroll-view>
				</view>
				<view class="go-settings" @click="goSetting">去配置</view>
			</view>
			<view class="car--source-line" />
			
			<!--价格配置-->
			<view class="car-price-info">
				<view class="info-label">期望价格</view>
				<view class="input-label">
					<input v-model="publishParams.expectedPrice" @input="handleInput" type="number" maxlength="5" class="car-source-price-input" placeholder="请输入" placeholder-class="price-placeholder-class" />
					<view class="car-source-price-label">元</view>
				</view>
				<view class="unit-list">
					
					<view class="unit-list-item" :class="{active: uniChooseIndex == index}" v-for="(item, index) in unitList" @click="uniChoose(index)">
						<text>{{item}}</text>
					</view>
				</view>
			</view>
			<!--车源有效时间配置-->
			<view class="car-source-info" v-if="!publishParams.longTimeFlag">
				<view>车源从</view>
				<view class="car-source-date-input" @click="showStartPopUp(0)">{{indateStart}}</view>
				<view>至</view>
				<view class="car-source-date-input"  @click="showStartPopUp(1)">{{indateEnd}}</view>
				<view>天内有效</view>
			</view>
			<view class="car-source-long" v-else>
				<view>车源</view>
				<view class="car-source-long-time" @click="showStartPopUp(0)">长期有效</view>
			</view>
			<!--发布按钮 -->
			<view class="publish">
				<view class="pub-btn" @click="publish">
					<view class="pub-text">发布</view>
					<view class="bg-gradient" />
				</view>
			</view>
		</view>
		<!--车源列表-->
		<view class="car-source-tabs">
			<view class="car-source-tabs-title" :class="[carListSourceIndex == 0 ? 'first' : 'second']">
				<view class="car-source-tabs-title-item" :class="{active: index == carListSourceIndex}" v-for="(item, index) in carListSourceTitleArr" @click="switchTab(index)">{{item}}</view>
			</view>
			<view class="car-source-tabs-content">
				<view class="car-source-tabs-content-tab" v-if="carListSourceIndex == 0">
					<view class="car-source-tabs-content-tab-noData" v-if="myCarSourceArr.length < 1">
						<image src="/static/images/ship/car-source-no-data.png" mode="widthFix" class="car-source-no-data"></image>
						快去发布车源吧
					</view>
					<view class="car-source-tabs-content-tab-item" v-for="(item, index) in myCarSourceArr" @click="goDetail(item)">
						<view class="car-addr">
							<view class="source-addr">
								<view class="addr-detail">{{showCity(item.sender)}}</view>
								<view class="addr-pub-date">
									<view>{{showTime(item.refDt)}}发布</view>
									<image src="../../../static/images/ship/car-source-line.png" mode="widthFix" class="car-source-line"></image>
									<view>{{showDate(item.refDt)}}</view>
								</view>
								<view class="addr-detail">{{showCity(item.receiver)}}</view>
							</view>
							<view class="will-get-price" v-if="item.expectedPrice">
								<text>期望价格</text>
								<view class="price-text">
									<text>{{item.expectedPrice}}</text>
									<text>/</text>
									<text>{{item.unit}}</text>
								</view>
							</view>
						</view>
						<view class="car-info-get">
							<view class="car-info-date">
								<text class="get-detail">求{{item.carModel}}/{{item.carLength}}米货源</text>
							<!-- 	<text class="date-period" v-if="item.longTimeFlag">长期有效</text>
								<text class="date-period" v-else>{{showZhuanghuoTime(item.indateEnd)}}点前可以装货</text> -->
							</view>
							<view class="car-info-btn">
								<view class="info-opt" @click.stop="refershPushDt(item, index)">
									刷新
								</view>
								<view class="info-opt" @click.stop="close(item, index)">
									关闭
								</view>
							</view>
						</view>
					</view>
					<uni-morebox :isMore="isMyMore" style="padding-bottom: 10rpx"></uni-morebox>
				</view>
				<view class="car-source-tabs-content-tab" v-if="carListSourceIndex == 1">
					<!--平台车源的搜索 -->
					<view class="car-platform-search-content">
						<view class="search-start" @click="showAddrPopUp" v-if="platFormSearchParams.subStartAddr">
							<view class="search-start-text">{{platFormSearchParams.subStartAddr}}</view>
							<view class="line" />
						</view>
						<view class="search-start search-start-default" @click="showAddrPopUp" v-else>
							<view class="search-start-text">请选择</view>
							<view class="line" />
						</view>
						<text class="search-li">至</text>
						<view class="search-start" @click="showAddrPopUp" v-if="platFormSearchParams.subEndAddr">
							<view class="search-start-text">{{platFormSearchParams.subEndAddr}}</view>
							<view class="line" />
						</view>
						<view class="search-start search-start-default" @click="showAddrPopUp" v-else>
							<view class="search-start-text">请选择</view>
							<view class="line" />
						</view>
						
						<view class="seperate" />
						<view class="all-type" @click="popVehicleAlert">
							<text v-if="!platFormSearchParams.carModel">全部车型</text>
							<text v-else>{{platFormSearchParams.carLength}}米{{platFormSearchParams.carModel}}</text>
							<image src="/static/images/ship/down-arrow.png" mode="widthFix" class="down-arrow"></image>
						</view>
						<!-- <view class="maps" @click="goCarSourceMap">
							<image src="/static/images/ship/map-icon.png" mode="widthFix" class="map-icon"></image>
							地图
						</view> -->
						<view class="search-btn" @click="searchResult">
							搜索
						</view>
						<!-- <image src="/static/images/ship/search-icon.png" mode="widthFix" class="search-icon" @click="searchResult"></image> -->
					</view>
					 <!--搜索结果-->
					 <view class="searchResult" v-if="platFormSearchTotal">
						<view class="searchResult-text">
					<!-- 		 <text v-if="platFormSearchParams.carLength" class="searchResult-text-item">{{platFormSearchParams.carLength}}米</text>
							 <text v-if="platFormSearchParams.carModel" class="searchResult-text-item">{{platFormSearchParams.carModel}}</text>
							 <text v-if="platFormSearchParams.startAddr" class="searchResult-text-item">{{platFormSearchParams.startAddr}}到{{platFormSearchParams.endAddr}}</text> -->
							 <text class="searchResult-text-item">为您优选以下车源</text>
						</view>
					 </view>
					<view class="car-source-tabs-content-tab-noData" v-if="platFormCarSourceArr.length < 1">
						<image src="/static/images/ship/car-source-no-data.png" mode="widthFix" class="car-source-no-data"></image>
						快去搜索车源吧
					</view>
					<view class="car-source-tabs-content-tab-item-second" v-for="item in platFormCarSourceArr"  @click="goDetail(item)">
						<view class="plat-user">
							<image :src="item.driverImage" class="avatar" v-if="item.driverImage"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png" class="avatar" v-else></image>
							<view class="userInfo">
								<view class="user-row">
									<view v-if="item.driverName">
										<text class="name">{{showUserName(item.driverName)}}</text>
										<text class="mobile">{{showMobile(item.driverPhone)}}</text>
									</view>
									<view v-else>
										<text class="name">{{showMobile(item.driverPhone)}}</text>
									</view>
								<!-- 	<view class="icon-total">
										<view class="icon-box" @click.stop="driverMap(item)">
											<image src="/static/images/ship/location-center.png" mode="widthFix" class="location-center"></image>
											定位
										</view>
										<view class="icon-box" @click.stop="toGoEasy(item)">
											<image src="/static/images/ship/car-news.png" mode="widthFix" class="car-news"></image>
											私信
										</view>
									</view> -->
								</view>
								<view class="user-pub-date">
									<view class="user-pub-date-item">
										<text>{{showDate(item.refDt)}}</text>
										<view class="pl-16">{{showTime(item.refDt)}}发布</view>
									</view>
								<!-- 	<view class="user-pub-date-item">
										<view class="pub-date" v-if="item.longTimeFlag">长期有效</view>
										<view class="pub-date" v-else>
											{{showZhuanghuoTime(item.indateEnd)}}
											<text class="pub-date-normal">点前可以装货</text>
										</view>
									</view> -->
									
									
									
								</view>
							</view>
						</view>
					</view>
					<uni-morebox :isMore="isPlateFormMore" style="padding-bottom: 10rpx"></uni-morebox>
				</view>
			</view>
		</view>
		<uni-popup type="center" :maskClick="false" ref="closePopup">
			<view class="popup-box">
				<view class="popup-content">确定要关闭车源吗？</view>
				<view class="pop-bottom">
					<view class="pop-cancel pop-bootom-btn" @click="cancel">取消</view>
					<view class="pop-confirm pop-bootom-btn" @click="confirmClose">确定</view>
				</view>
			</view>
		</uni-popup>
		<!--最新的弹框-->
		<uni-popup type="center" :maskClick="false" ref="noticePopup">
			<view class="notice-content">
				<image src="/static/images/ship/lingdang.png" mode="widthFix" class="lingdang"></image>
				<view class="notice-content-inner">
					<text class="notice-content-inner-text">{{noticeTitle}}</text>
					<text class="notice-content-inner-text">发布公告：{{noticeDescription}}</text>
				</view>
				<view class="my-know" @click="clickMyKnow">我知道了</view>
			</view>
		</uni-popup>
		<!--选择开始时间-->
		<uni-popup ref="startTimePopUp" type="bottom">
			<view class="startTimePopUp-content">
				<view class="startTime-title">选择开始时间</view>
				<view class="time-list">
					<view class="time-item" v-for="(item, index) in startTimeArr" :key="index" >
						<view class="time-item-content" :class="{active: index == pickStartIndex}" @click="switchStartTime(index)">{{item}}</view>
					</view>
				</view>
				<view class="startTime-subTitle">备注：开始时间为第一天</view>
				<view class="startTime-content">
					<!-- <view class="all-time" :class="{active: isAllTime}" @click="switchLongTimeFlag">
						长期有效
						<image src="/static/images/ship/car-source-date-noConfirm.png" mode="widthFix" class="all-time-checked" v-if="!isAllTime"></image>
						<image src="/static/images/ship/all-time-checked.png" mode="widthFix" class="all-time-checked" v-if="isAllTime"></image>
					</view> -->
				</view>
				<view class="startTime-btn">
					<view class="startTime-btn-item cancel" @click="cancelStartTime">稍后再说</view>
					<view class="startTime-btn-item confirm" @click="confirmStartTime">确认开始时间</view>
				</view>
			</view>
		</uni-popup>
		
		
		<!--截止时间-->
		<uni-popup ref="endTimePopUp" type="bottom">
			<view class="startTimePopUp-content">
				<view class="startTime-title end-title">选择截止时间</view>
				<view class="time-list">
					<view class="time-item time-item-end" v-for="(item, index) in endTimeArr" :key="index">
						<view class="time-item-content" :class="{active: index == pickEndIndex}" @click="switchEndTime(index)">{{item.name}}</view>
					</view>
				</view>
				<view class="startTime-content">
				</view>
				<view class="startTime-btn">
					<view class="startTime-btn-item cancel" @click="cancelStartTime">稍后再说</view>
					<view class="startTime-btn-item confirm" @click="confirmEndTime">确认截止时间</view>
				</view>
			</view>
		</uni-popup>
		<carSearchAddr ref="carAddrRef" @toSearchResult="toSearchResult"></carSearchAddr>
		<carVehicleAlert ref="carVehicleAlertRef"  @searchVehicle="searchVehicle"></carVehicleAlert>
	</view>
</template>

<script>
	import IMService from "@/utils/imservice.js";
	import carSearchAddr from "../carSource/carSearchAddr.vue"
	import carVehicleAlert from "../carSource/carVehicleAlert.vue"
	import { mapActions } from 'vuex'
	import * as utils from "@/utils/utils"
	import * as ship from "@/utils/ship"
	import  UniMorebox from "@/components/uni-morebox.vue"
	 import {WX_ORIGIN_ID} from "@/utils/baseUrl.js"
	export default {
		name: "carSource",
		props: {
			
		},
		components: {
			carSearchAddr,
			carVehicleAlert,
			UniMorebox
		},
		data() {
			return {
				current: 0,
				isPickerShow: false,
				boxTransform: '',
				hintRef: '',
				hintSwiperText: "新增发布车源公告：卡车师傅们，【货运中国】独创货找车模式上线啦，一键发布车源，让货主来找你！",
				noticeTitle: '',
				noticeDescription: '',
				startTimeArr: ["今天", "明天", "后天"],
				endTimeArr: [
					{name: '1', value: 0},
					{name: '2', value: 1},
					{name: '3', value: 2},
					{name: '4', value: 3},
					{name: '5', value: 4},
					{name: '6', value: 5},
					{name: '7', value: 6},
					{name: '15', value: 14},
					{name: '30', value: 29},
				],
				isAllTime: false, //是否长期
				unitList: ["趟", "吨", "公里"],
				uniChooseIndex: 0, //期望价格单位选择
				carListSourceTitleArr: ["我发布的车源", "平台全部车源"],
				myCarSourceArr: [], //我发布的车源list
				platFormCarSourceArr: [], //平台发布车源list
				carListSourceIndex: 0, //显示哪一个车源list
				myCarSettingIndex: 0, //我的车辆
				myRouterSettingIndex: -1, //我的路线配置
				pickStartIndex: 0,
				pickEndIndex: 2,
				indateStart: '今天',
				indateEnd: '3',
				publishParams: {
					userCode: '',
					userId: '',
					personId: '',
					driverId: '',
					driverName: '',
					driverPhone: '',
					senderCode: '',
					sender: '',
					receiverCode: '',
					receiver: '',
					circuitCombo: '',
					carModel: '',
					carLength: '',
					carCombo: '',
					expectedPrice: '',
					unit: '',
					indateStart: '',
					indateEnd: '',
					longTimeFlag: 0,
					indateCount: '',
				},
				mySearchParams: {
					userCode: '',
					pageSize: 10,
					pageNum: 1,
				},
				allPlatFormCarSourceArr: [],
				platFormSearchParams: {
					subEndAddr: '',
					subStartAddr: '',
					startAddr: '',
					endAddr: '',
					circuitCombo: '',
					carCombo: '',
					carLength: '',
					carModel: '',
					senderCode: '',
					receiverCode: '',
					pageSize: 10,
					pageNum: 1,
				},
				platFormSearchTotal: 0, //平台车源的列表总数
				refreshing: false,
				isMyMore: 'more',
				isPlateFormMore: "more",
				willCloseCarSource: null, //将关闭的车源
				willCloseCarIndex: 0,
			}
		},
		mounted() {
			//更新车源信息
			this.initDate(); //初始化发布配置
			this.advHintScroll(); //广告初始化
			this.noticeInit(); //跑马灯初始化
			
		},
		computed:{
			vehicleArr() {
				return this.$store.state.ShipInfo.vehicleArr
			},
			routerArr() {
				var locationAddr = this.$store.state.ShipInfo.locationAddr;
				var routerArr = this.$store.state.ShipInfo.routerArr;
				if (!locationAddr) {
					return routerArr
				} else {
					var findIndex = routerArr.findIndex(item => {
						return item.senderAddr == locationAddr.name && item.receiverAddr == "全国"
					})
					if (findIndex > -1) {
						routerArr.splice(findIndex, 1);
					}
					return routerArr
				}
				
			},
			centerAddr() {
				return this.$store.state.ShipInfo.locationAddr
			},
			sourceBigBanner() {
				var bigBannerItem = this.$store.state.vehicleSourceBanner.bigBannerItem;
				return bigBannerItem;
				
			},
			sourceSmallBanner() {
				var smallBannerItem = this.$store.state.vehicleSourceBanner.smallBannerItem;
				return smallBannerItem;
			}
		},
		watch: {
			centerAddr(newVal, oldVal) {
				console.log(newVal, oldVal, "中心121212212");
				if (newVal && !oldVal) {
					this.myRouterSettingIndex = -1
				}
			}
		},
		
		methods: {
			...mapActions(['getSettingsInfo', 'getCenterLocationInfo']),
			// 判断是否三证认证
			  isThreeAuth(index){
				let that = this
				console.log("三证校验结果")
				var userInfo = uni.getStorageSync("userInfo");
				let flag = false
					  if (userInfo) {
				  var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				  var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				  var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				  if (identityVerify !== 1 ) {
					uni.showToast({
					  title: '请您先完成身份证认证再参与现金奖励活动哦~',
					  icon: 'none'
					})
					return flag
				  }
				if (driverVerify!== 1 ) {
					uni.showToast({
					  title: '请您先完成驾驶证认证再参与现金奖励活动哦~',
					  icon: 'none'
					})
								return flag
				  }
				if (vehicleVerify !== 1 ) {
					uni.showToast({
					  title: '请您先完成车辆认证再参与现金奖励活动哦~',
					  icon: 'none'
					})
								return flag
				  }
							if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
					flag = false
				  } else {
					flag = true
				  }
				}
				return flag
			},
			//app长按跳转小程序
			toWxApplet() {
				console.log("长按121");
				var that = this;
				let userInfo = uni.getStorageSync("userInfo");
				var mobile = JSON.parse(userInfo).mobile;
				var usercode = JSON.parse(userInfo).attrs.userCode;
				var qrValue = "pages/index/index/index";
				plus.share.getServices(res => {
					console.log(res, '服务')
					this.sweixin = res.find(i => i.id === 'weixin')
					if (this.sweixin) {
						// 跳转到微信小程序
						this.sweixin.launchMiniProgram({
							id: WX_ORIGIN_ID, // 	关联微信小程序的原始ID（"g_"开头的字符串）
							path: qrValue, //	打开小程序的页面路径，不传默认跳转首页
							type: 0 // 	微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
						}, res => {
							console.log('成功唤起微信小程序');
						}, err => {
							console.log('失败');
						})
					} else {
						// 没有获取到微信分享服务
					}
				}, err => {
					// 获取分享服务列表失败
				});
			},
			showBigBanner(i) {
				var bigBannerItem = this.$store.state.vehicleSourceBanner.bigBannerItem;
				console.log("bigBannerItem", bigBannerItem, i);
				var findIndex = bigBannerItem.findIndex(atem => {
					return atem.sType == i.sType
				})
				if (findIndex < 0) {
					uni.previewImage({
						urls: [i.advUrl],
						success: function(data) {
							console.log(data);
						},
						fail: function(err) {
							console.log(err);
						}
					});
					return;
				}
				var item = bigBannerItem[findIndex];
				if (item.sType == 3) {
					//跳转小程序
					this.toWxApplet();
					return;
				}
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
			goReport(){
				let that = this
				if(!that.isThreeAuth()){
					return
				}
				uni.navigateTo({
					url: '/pages/index/report/report'
				})
			},
			advHintScroll() {
				let distance = '';
				var query = uni.createSelectorQuery().in(this);
				query.select('#hintSwiper1').boundingClientRect(data => {
					console.log("节点信息" + JSON.stringify(data));
					// let dataObj = JSON.parse(JSON.stringify(data));
					distance = Number(data.width) * 2;
					console.log(distance);
					if(!distance) {
						return false;
					}
					let that = this;
					that.hintRef && clearInterval(that.hintRef);
					that.hintRef = setInterval(() => {
						distance = distance - 2;
						  // console.log(distance, 'aaa')
						// 如果位移超出最大可滑动距离，则回到起点
						  if((distance + (Number(data.width) * 2 + 200)) == 0) {
							distance = Number(data.width) * 2;
						  }
						 
						  that.boxTransform = 'transform:translateX(' + distance + 'rpx)';
						  that.$forceUpdate();
					}, 200)
				}).exec();
			},
			
			showNoticePopup() {
				//显示广告
				this.$refs.noticePopup.open();
			},
			switchStartTime(index) {
				this.pickStartIndex = index;
				
			},
			switchEndTime(index) {
				this.pickEndIndex = index
			},
			toGoEasy(item) {
				//私信跳转goeasy，只要点击。关联撩过的
				console.log(this.goEasy, '啊啊啊啊啊');
				let userData = uni.getStorageSync("userInfo");
				console.log('用户信息', JSON.parse(userData)); 
				var userInfo = userData ? JSON.parse(userData) : {};
				let avatarObj = JSON.parse(userData);
				var selfUserCode = userInfo.attrs.userCode;
				
				if(selfUserCode == item.userCode){
					uni.showToast({
						title: '您不能给自己发私信',
						icon: 'none'
					})
					return
				}
				
				
				var params = [{
					nowdataSid: item.sid,
					batchNumber: item.batchNumber,
					userCode: userInfo.attrs.userCode,
					userId: userInfo.userId,
					personId: userInfo.attrs.personId,
					name: userInfo.userName,
					phone: userInfo.mobile,
					imgUrl: avatarObj.attrs.avatar,
				}]
				console.log(params, 'aaa')
				//非自己才添加撩人信息
				ship.postRequest("/cy/carSourceInteraction/add", params)
				.then(res => {
					console.log(res)
				})
				
				uni.showLoading({
				 title: '加载中'
				})
				
				
				
				userInfo.attrs.avatar = avatarObj.attrs.avatar;
			   
				let userName = item.driverName ? item.driverName.substr(0, 1) + '**' : '';
				let avatar = item.driverImage ? item.driverImage : '/static/images/goodsDelivery/shipUserLogo.png';
				if(this.goEasy.getConnectionStatus() == 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/goodsDelivery/userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
					})
				}else {
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/goodsDelivery/userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
					})
				}
				    

				
				
			},
			handleInput(e) {
				//期望价格首位数字不能为0
				console.log(e, 'aaa');
				var val = e.detail.value;
				this.$nextTick(function(){
					this.publishParams.expectedPrice = val.replace(/^[^1-9]/g, '');
				})

				console.log(val ,'aa')
			},
			showCity(city) {
				var subCity = city.replace(/省|市|区/, "");
				return subCity;
			},
			popVehicleAlert() {
				//判断车型列表和车长列表是否存在
				var isVehicleInfo = this.$refs.carVehicleAlertRef.isVehicleInfo();
				if (!isVehicleInfo) {
					this.$refs.carVehicleAlertRef.init();
				}
				this.$refs.carVehicleAlertRef.showNewCarAlert();
			},
			clickMyKnow() {
				this.$refs.noticePopup.close();
			},
			showUserName(name) {
				return name.substr(0, 1) + '师傅'
			},
			showMobile(mobile) {
				return mobile.substr(0, 3) + '****' + mobile.substr(-4)
			},
			showTime(date) {
				if (!date) return "";
				var newD = date.replace(/-/g, '/');
				var dateParse = new Date(newD);
				var hour = dateParse.getHours() < 10 ? '0' + dateParse.getHours() : dateParse.getHours();
				var minutes = dateParse.getMinutes() < 10 ? '0' + dateParse.getMinutes() : dateParse.getMinutes();
				return hour + ':' + minutes
			},
			showDate(date) {
				if (!date) return "";
				var newD = date.replace(/-/g, '/');
				var dateParse = new Date(newD);
				var month = (dateParse.getMonth()+1) < 10 ? '0' + (dateParse.getMonth() + 1) : dateParse.getMonth() + 1;
				var day = dateParse.getDate() < 10 ? '0' + dateParse.getDate() : dateParse.getDate();
				return month + '-' + day
			},
			showZhuanghuoTime(date) {
				if (!date) return "";
				var newD = date.replace(/-/g, '/');
				var dateParse = new Date(newD);
				var month = (dateParse.getMonth()+1) < 10 ? '0' + (dateParse.getMonth() + 1) : dateParse.getMonth() + 1;
				var day = dateParse.getDate() < 10 ? '0' + dateParse.getDate() : dateParse.getDate();
				var hour = (dateParse.getHours() + 1) < 10 ? '0' + (dateParse.getHours() + 1) : dateParse.getHours() + 1;
				var minutes = dateParse.getMinutes() < 10 ? '0' + dateParse.getMinutes() : dateParse.getMinutes();
				return month + '-' + day + ' ' + hour
			},
			close(item, index) {
				this.$refs.closePopup.open();
				//关闭车源
				this.willCloseCarSource = item;
				this.willCloseCarIndex = index;
			},
			refershPushDt(item, index) {
				//刷新发布时间为当前时间
				let that = this;
				if (!ship.btnRepeat()) return;
				uni.showLoading();
				ship.postRequest("/cy/carSource/refresh", {
					sid: item.sid,
					batchNumber: item.batchNumber
				}).then(res => {
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: "刷新成功",
							icon: 'none'
						})
						
						var myCarSourceArr = that.myCarSourceArr;
						var delItem = myCarSourceArr.splice(index, 1);
						var now = new Date();
						var indateCount = item.indateCount;
						var end = utils.fun_date(indateCount);
						var nowDate = utils.dateFormat("YYYY-mm-dd HH:MM:SS", now);
						delItem[0].refDt = nowDate;
						delItem[0].indateEnd = end + ' ' + '23:59:59';
						var arr = delItem.concat(myCarSourceArr);
						that.myCarSourceArr = arr;
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
			cancel() {
				this.$refs.closePopup.close();
			},
			confirmClose() {
				var that = this;
				var willCloseCarSource = this.willCloseCarSource;
				if (!ship.btnRepeat()) return;
				this.cancel();
				uni.showLoading();
				ship.postRequest("/cy/carSource/remove", {
					sid: willCloseCarSource.sid,
					circuitCombo: willCloseCarSource.circuitCombo,
					carCombo: willCloseCarSource.carCombo,
					longTimeFlag: willCloseCarSource.longTimeFlag,
				}).then(res => {
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '关闭成功',
							icon: 'none'
						})
						var myCarSourceArr = this.myCarSourceArr;
						var willCloseCarIndex = this.willCloseCarIndex;
						myCarSourceArr.splice(willCloseCarIndex, 1);
						this.myCarSourceArr = myCarSourceArr;
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
			switchMyCarSettings(index) {
				this.myCarSettingIndex = index;
				var vehicleArr = this.vehicleArr;
				var selectItem = vehicleArr[index];
				this.publishParams.carModel = selectItem.carModel;
				this.publishParams.carLength = selectItem.carLength;
				this.publishParams.carCombo = selectItem.carCombo;
				//切换车辆相关
				
			},
			switchMyRouterSettings(index) {
				this.myRouterSettingIndex = index;
				var routerArr = this.routerArr;
				if (index == -1) {
					this.publishParams.senderCode = this.centerAddr.code;
					this.publishParams.sender = this.centerAddr.name;
					this.publishParams.receiverCode = "100000";
					this.publishParams.receiver = "全国";
					this.publishParams.circuitCombo = this.centerAddr.name + '-全国'
				} else {
					this.publishParams.senderCode = routerArr[index].senderCode;
					this.publishParams.sender = routerArr[index].senderAddr;
					this.publishParams.receiverCode = routerArr[index].receiverCode;
					this.publishParams.receiver = routerArr[index].receiverAddr;
					this.publishParams.circuitCombo = routerArr[index].circuitCombo;
				}
			},
			switchTab(index) {
				if (index == this.carListSourceIndex) return;
				this.carListSourceIndex = index;
				this.refresh();
			},
			async goDetail(item) {
				//判断是否过期
				var carListSourceIndex = this.carListSourceIndex; 
				if (carListSourceIndex == 1) return;
				try{
					uni.showLoading();
					var userInfo = uni.getStorageSync("userInfo");
					if (!userInfo) return;
					var userCode = JSON.parse(userInfo).attrs.userCode;
					var res = await ship.postRequest("/cy/carSource/show", {
						userCode: userCode,
						sid: item.sid
					})
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.navigateTo({
							url: '../carSource/sourceDetail?detail=' + JSON.stringify(item)
						})
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					
				}catch(e){
					console.log(e)
					uni.hideLoading();
					//TODO handle the exception
				}
				
			},
			goSetting() {
				//去配置
				uni.navigateTo({
					url: '../carSource/sourceSettings'
				})
			},
			goCarSourceMap() {
				//跳转车源地图
				//获取当前位置
				if (!ship.btnRepeat()) return;
				uni.showLoading();
				uni.getLocation({
					altitude: true,
					type: "gcj02",
					success(res) {
						uni.hideLoading();
						console.log(res, 'aaaa');
					
						var userInfo = uni.getStorageSync("userInfo");
						if (!userInfo) return;
						var Authorization = JSON.parse(userInfo).attrs.token;
						
						
							var params = {
								latitude: res.latitude,
								longitude: res.longitude,
								Authorization: Authorization,
								ApiRootUrl: ship.ApiRootUrl,
							}
							uni.navigateTo({
								url: '/pages/ship/carSource/carSourceMap?params=' + JSON.stringify(params)
							})
						
						
					},
					fail() {
						uni.hideLoading();
						uni.showToast({
							title: '定位获取失败',
							icon: 'none'
						})
					}
				})
				
			},
			showStartPopUp(index) {
				if (index == 0) {
					this.$refs.startTimePopUp.open();
				} else {
					this.$refs.endTimePopUp.open();
				}

			},
			cancelStartTime() {
				this.$refs.startTimePopUp.close();
				this.$refs.endTimePopUp.close();
			},
			confirmStartTime() {
				var pickStartIndex = this.pickStartIndex;
				if (this.isAllTime) {
					this.publishParams.longTimeFlag = 1;
				} else {
					var start = utils.fun_date(pickStartIndex);
					var pickEndIndex = this.pickEndIndex; 
					var endTimeArr = this.endTimeArr;
					var indexEnd = endTimeArr[pickEndIndex].value;
					this.indateStart = this.startTimeArr[pickStartIndex];
					var endDayDiff = indexEnd + pickStartIndex;
					var end = utils.fun_date(endDayDiff);
					this.publishParams.indateStart = start + ' ' + '00:00:00';
					this.publishParams.indateEnd = end + ' ' + '23:59:59';
					this.publishParams.longTimeFlag = 0;
				}
				this.cancelStartTime();
				this.$forceUpdate();
	
			},
			confirmEndTime() {
				var pickEndIndex = this.pickEndIndex;
				var pickStartIndex = this.pickStartIndex; 
				var endTimeArr = this.endTimeArr;
				
				var endDay = endTimeArr[pickEndIndex].value + pickStartIndex; //车源有效时间从开始到结束的时间
				var start = utils.fun_date(endDay);
				this.publishParams.indateEnd = start + ' ' + '23:59:59';
				this.indateEnd = this.endTimeArr[pickEndIndex].name;
				this.publishParams.indateCount = endTimeArr[pickEndIndex].value + 1;
				this.cancelStartTime();
				this.$forceUpdate();
			},
			driverMap(item) {
				//跳转司机定位
				let that = this;
				var userCode = item.userCode;
				 
				//司机定位
				uni.navigateTo({
					url: '/pages/ship/carSource/driverMap?driverDetail=' + JSON.stringify(item)
				})
			},
			showAddrPopUp() {
				console.log("开始11")
				this.$refs.carAddrRef.showPopUp();
			},
			toSearchResult(params) {
				console.log(params, "搜索结果");
				var startAddrName = params.startAddr.name;
				var arriveAddrName = params.arriveAddr.name;
				this.platFormSearchParams.subStartAddr = startAddrName.replace(/省|市|区/, "");
				this.platFormSearchParams.subEndAddr = arriveAddrName.replace(/省|市|区/, "");
				this.platFormSearchParams.startAddr = params.startAddr.name;
				this.platFormSearchParams.endAddr = params.arriveAddr.name;
				this.platFormSearchParams.senderCode = params.startAddr.code;
				this.platFormSearchParams.receiverCode = params.arriveAddr.code;
				this.platFormSearchParams.circuitCombo = params.startAddr.name + '-' + params.arriveAddr.name
				// this.refresh();
			},
			uniChoose(index) {
				//发货单位变化
				this.uniChooseIndex = index;
				var unitList = this.unitList;
				this.publishParams.unit = unitList[index]
			},
			// initSearchData() {
			// 	if (this.centerAddr) {
			// 		this.platFormSearchParams.startAddr = this.centerAddr.name;
			// 		this.platFormSearchParams.endAddr = "全国"
			// 		this.platFormSearchParams.circuitCombo = this.centerAddr.name + '-全国';
			// 	} else {
			// 		this.platFormSearchParams.circuitCombo = "";
			// 		this.platFormSearchParams.startAddr = "";
			// 		this.platFormSearchParams.endAddr = "";
			// 	}
			// },
			initPubshDate() {
				//发布成功后初始化的配置
				let that = this;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				that.isPickerShow = false;
				userInfo = JSON.parse(userInfo);
				console.log(userInfo, '铜壶')
				this.mySearchParams.userCode = userInfo.attrs.userCode;
				var nowDate = utils.fun_date(0);
				var date_3 = utils.fun_date(2);
				var vehicleArr = this.vehicleArr;
				var routerArr = this.routerArr;
				
				this.publishParams.indateStart = nowDate + ' ' + '00:00:00';
				this.publishParams.indateEnd = date_3 + ' ' + '23:59:59';
				// this.publishParams.userCode = userInfo.attrs.userCode;
				// this.publishParams.userId = userInfo.userId;
				// this.publishParams.personId = userInfo.attrs.personId;
				// this.publishParams.driverId = userInfo.attrs.driverId;
				// this.publishParams.driverName = userInfo.userName;
				// this.publishParams.driverPhone = userInfo.mobile;
				// this.publishParams.driverImage = userInfo.attrs.avatar;
				
				if (this.centerAddr) {
					this.publishParams.senderCode = this.centerAddr.code;
					this.publishParams.sender = this.centerAddr.name;
					this.publishParams.receiverCode = "100000";
					this.publishParams.receiver = "全国";
					this.publishParams.circuitCombo = this.centerAddr.name + '-全国';
				} else {
					this.publishParams.senderCode = routerArr.length > 0 ? routerArr[0].senderCode : '';
					this.publishParams.sender = routerArr.length > 0 ? routerArr[0].senderAddr : '';
					this.publishParams.receiverCode = routerArr.length > 0 ? routerArr[0].receiverCode : '';
					this.publishParams.receiver = routerArr.length > 0 ? routerArr[0].receiverAddr : '';
					this.publishParams.circuitCombo = routerArr.length > 0 ? routerArr[0].circuitCombo : '';
				}
				
				this.publishParams.longTimeFlag = 0;
				this.publishParams.carModel = vehicleArr.length > 0 ? vehicleArr[0].carModel : '';
				this.publishParams.carLength = vehicleArr.length > 0 ? vehicleArr[0].carLength : '';
				this.publishParams.carCombo = vehicleArr.length > 0 ? vehicleArr[0].carCombo : '';
				this.publishParams.unit = "趟";
				this.publishParams.expectedPrice = "";
				this.myCarSettingIndex = 0; //我的车辆
				this.uniChooseIndex = 0; //单位
				this.indateStart = "今天";
				this.indateEnd = "3";
				this.publishParams.indateCount = 3;
				this.isAllTime = false;
				
				console.log(this.centerAddr, '11111111111111111111111111111111111111');
				that.pickStartIndex = 0;
				that.pickEndIndex = 2;
				that.$forceUpdate();
			},
			initDate() {
				//初始化配置
				let that = this;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				that.isPickerShow = false;
				userInfo = JSON.parse(userInfo);
				console.log(userInfo, '铜壶')
				this.mySearchParams.userCode = userInfo.attrs.userCode;
				var nowDate = utils.fun_date(0);
				var date_3 = utils.fun_date(2);
				var vehicleArr = this.vehicleArr;
				var routerArr = this.routerArr;
				
				this.publishParams.indateStart = nowDate + ' ' + '00:00:00';
				this.publishParams.indateEnd = date_3 + ' ' + '23:59:59';
				// this.publishParams.userCode = userInfo.attrs.userCode;
				// this.publishParams.userId = userInfo.userId;
				// this.publishParams.personId = userInfo.attrs.personId;
				// this.publishParams.driverId = userInfo.attrs.driverId;
				// this.publishParams.driverName = userInfo.userName;
				// this.publishParams.driverPhone = userInfo.mobile;
				// this.publishParams.driverImage = userInfo.attrs.avatar;
				setTimeout(() => {
					if (this.centerAddr) {
						this.publishParams.senderCode = this.centerAddr.code;
						this.publishParams.sender = this.centerAddr.name;
						this.publishParams.receiverCode = "100000";
						this.publishParams.receiver = "全国";
						this.publishParams.circuitCombo = this.centerAddr.name + '-全国';
						this.myRouterSettingIndex = -1;
					} else {
						this.publishParams.senderCode = routerArr.length > 0 ? routerArr[0].senderCode : '';
						this.publishParams.sender = routerArr.length > 0 ? routerArr[0].senderAddr : '';
						this.publishParams.receiverCode = routerArr.length > 0 ? routerArr[0].receiverCode : '';
						this.publishParams.receiver = routerArr.length > 0 ? routerArr[0].receiverAddr : '';
						this.publishParams.circuitCombo = routerArr.length > 0 ? routerArr[0].circuitCombo : '';
						this.myRouterSettingIndex = 0;
					}
				}, 500)
				
				this.publishParams.longTimeFlag = 0;
				this.publishParams.carModel = vehicleArr.length > 0 ? vehicleArr[0].carModel : '';
				this.publishParams.carLength = vehicleArr.length > 0 ? vehicleArr[0].carLength : '';
				this.publishParams.carCombo = vehicleArr.length > 0 ? vehicleArr[0].carCombo : '';
				this.publishParams.unit = "趟";
				this.publishParams.expectedPrice = "";
				this.myCarSettingIndex = 0; //我的车辆
				this.uniChooseIndex = 0; //单位
				this.indateStart = "今天";
				this.indateEnd = "3";
				this.publishParams.indateCount = 3;
				this.isAllTime = false;
				
				console.log(this.centerAddr, '11111111111111111111111111111111111111');
				that.pickStartIndex = 0;
				that.pickEndIndex = 2;
				that.$forceUpdate();
			},
			switchLongTimeFlag() {
				this.isAllTime = this.isAllTime ? 0 : 1;
			},
			getUserInfo() {
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				userInfo = JSON.parse(userInfo);
				this.publishParams.userCode = userInfo.attrs.userCode;
				this.publishParams.userId = userInfo.userId;
				this.publishParams.personId = userInfo.attrs.personId;
				this.publishParams.driverId = userInfo.attrs.driverId;
				this.publishParams.driverName = userInfo.userName;
				this.publishParams.driverPhone = userInfo.mobile;
				this.publishParams.driverImage = userInfo.attrs.avatar;
			},
			publish() {
				//发布车源
				this.getUserInfo(); //获取最新的用户信息
				if (this.vehicleArr.length < 1) {
					uni.showToast({
						title: '请先配置车辆',
						icon: 'none'
					})
					return;
				};
				if (this.routerArr.length < 1 && !this.centerAddr) {
					uni.showToast({
						title: '请先配置线路',
						icon: 'none'
					})
					return;
				};
				//配置参数
				var vehicleArr = this.vehicleArr;
				var routerArr = this.routerArr;
				
				var myCarSettingIndex = this.myCarSettingIndex; //我的车辆
				
				var centerAddr = this.centerAddr;
				
				var myRouterSettingIndex = this.myRouterSettingIndex; //我的路线配置
				if (!centerAddr && myRouterSettingIndex  == -1) {
					this.myRouterSettingIndex = 0;
					myRouterSettingIndex = 0;
				}
				console.log(routerArr, '线路111')
				if (myRouterSettingIndex == -1) {
					this.publishParams.senderCode = this.centerAddr.code;
					this.publishParams.sender = this.centerAddr.name;
					this.publishParams.receiverCode = "100000";
					this.publishParams.receiver = "全国";
					this.publishParams.circuitCombo = this.centerAddr.name + '-全国'
				} else {
					this.publishParams.senderCode = routerArr.length > 0 ? routerArr[myRouterSettingIndex].senderCode : '';
					this.publishParams.sender = routerArr.length > 0 ? routerArr[myRouterSettingIndex].senderAddr : '';
					this.publishParams.receiverCode = routerArr.length > 0 ? routerArr[myRouterSettingIndex].receiverCode : '';
					this.publishParams.receiver = routerArr.length > 0 ? routerArr[myRouterSettingIndex].receiverAddr : '';
					this.publishParams.circuitCombo = routerArr.length > 0 ? routerArr[myRouterSettingIndex].circuitCombo : '';
				}
				
				this.publishParams.carModel = vehicleArr.length > 0 ? vehicleArr[myCarSettingIndex].carModel : '';
				this.publishParams.carLength = vehicleArr.length > 0 ? vehicleArr[myCarSettingIndex].carLength : '';
				this.publishParams.carCombo = vehicleArr.length > 0 ? vehicleArr[myCarSettingIndex].carCombo : '';
				
				if (!ship.btnRepeat()) return;
				var publishParams = this.publishParams;
				console.log(publishParams, '参数发布')
				uni.showLoading({
					title: '发布中...',
				})
				ship.postRequest("/cy/carSource/add", publishParams)
				.then(res => {
					uni.hideLoading();
					console.log(res, '发不出1212')
					if (res.retCode == "0000000") {
						//发布成功后选择的变成第一个排序
						var vehicleArr = this.vehicleArr;
						var routerArr = this.routerArr;
						var myCarSettingIndex = this.myCarSettingIndex; //我的车辆
						var myRouterSettingIndex = this.myRouterSettingIndex; //我的路线配置
						if (myRouterSettingIndex > -1) {
							var router_sid = routerArr[myRouterSettingIndex].sid;
							uni.setStorageSync("car-source-router-sid", router_sid);
						} else {
							uni.removeStorageSync("car-source-router-sid");
						}
						var vehicle_sid =  vehicleArr[myCarSettingIndex].sid;
						uni.setStorageSync("car-source-vehicle-sid", vehicle_sid);
						//更新展示
						this.getSettingsInfo();
						
						uni.showToast({
							title: '发布成功',
							icon: 'none'
						})
						this.initPubshDate();
						if (myRouterSettingIndex != -1) {
							this.myRouterSettingIndex = 0;
						}
						//刷新列表
						setTimeout(() => {
							this.refresh();
						}, 500)
						
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
			searchVehicle(params) {
				//车型车长搜索
				console.log(params, '搜索111111')
				if (params.carModel) {
					this.platFormSearchParams.carLengths = [params.carLength];
					this.platFormSearchParams.carModels = [params.carModel];
					this.platFormSearchParams.carLength = params.carLength;
					this.platFormSearchParams.carModel = params.carModel;
					this.platFormSearchParams.carCombo = params.carLength + '-' + params.carModel
				} else {
					this.platFormSearchParams.carLength = "";
					this.platFormSearchParams.carModel = "";
					this.platFormSearchParams.carCombo = "";
					this.platFormSearchParams.carModels && delete this.platFormSearchParams.carModels
					this.platFormSearchParams.carLengths && delete this.platFormSearchParams.carLengths
				}
				this.$forceUpdate();
				// this.refresh();
			},
			//用户身份切换后刷新
			switchRefresh() {
				this.initDate();
				this.refresh();
			},
			
			refresh() {
				var carListSourceIndex = this.carListSourceIndex;
				var params = new Object();
				if (carListSourceIndex == 0) {
					//刷新我的车源信息
					var mySearchParams = this.mySearchParams;
					mySearchParams.pageNum = 1;
					this.mySearchParams = mySearchParams;
					params = {
						...mySearchParams
					}
				} else {
					//刷新平台全部车源信息
					var isAllow = this.isAllowSearch();
					if (isAllow.status == 0) return;
					var platFormSearchParams = this.platFormSearchParams;
					platFormSearchParams.pageNum = 1;
					this.platFormSearchParams = platFormSearchParams;
					var userInfo = uni.getStorageSync("userInfo");
					
					params = {
						...platFormSearchParams,
						userCode: JSON.parse(userInfo).attrs.userCode,
						type: 2,
					}
				}
				console.log(params, 'aaaa');
				var url = "";
				if (carListSourceIndex == 0) {
					url = "/cy/carSource/driver_car_source";
					console.log(params, url, '我的车源列表参数1111111')
					ship.postRequest(url, params)
					.then(res => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
						console.log(res, '车源11111')
						if (res.retCode == "0000000") {
							
							if (carListSourceIndex == 0) {
								var list = res.rspBody.items;
								this.myCarSourceArr = list;
								this.isMyMore = (list.length < this.mySearchParams.pageSize && list.length > 0) ? 'noMore' : 'more'
							} else {
								//刷新全平台的数据
								var list = res.rspBody.carSourceVOS;
								this.platFormSearchTotal = res.rspBody.total;
								// this.platFormCarSourceArr = list;
								this.allPlatFormCarSourceArr = list;
								this.platFormCarSourceArr = [];
								if (list.length > 0) {
									this.toLoadCarInfo('hasLoad');
								}
								
							}
							
						}
					})
					.catch(err => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					})
				} else {
					// url = "/cy/carSource/select"
					url = "/olnanas/recommend/getCarSource"
					console.log(params, url, '我的车源列表参数1111111')
					ship.newQueryPostRequest(url, params)
					.then(res => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
						console.log(res, '车源11111')
						if (res.retCode == "0000000") {
							
							if (carListSourceIndex == 0) {
								var list = res.rspBody.items;
								this.myCarSourceArr = list;
								this.isMyMore = (list.length < this.mySearchParams.pageSize && list.length > 0) ? 'noMore' : 'more'
							} else {
								//刷新全平台的数据
								var list = res.rspBody.carSourceVOS;
								this.platFormSearchTotal = res.rspBody.total;
								// this.platFormCarSourceArr = list;
								this.allPlatFormCarSourceArr = list;
								this.platFormCarSourceArr = [];
								if (list.length > 0) {
									this.toLoadCarInfo('hasLoad');
								}
								
							}
							
						}
					})
					.catch(err => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					})
				}
				///cy/carSource/show
				
			},
			toLoadCarInfo(flag) {
				var that = this;
				var platFormCarSourceArr = that.platFormCarSourceArr;
				var allPlatFormCarSourceArr = that.allPlatFormCarSourceArr;
				
				that.isPlateFormMore = "loading";
				
				if (allPlatFormCarSourceArr.length < that.platFormSearchParams.pageSize) {
					var arr = allPlatFormCarSourceArr.splice(0, allPlatFormCarSourceArr.length);
					that.platFormCarSourceArr = that.platFormCarSourceArr.concat(arr);
					that.isPlateFormMore = "noMore";
					that.allPlatFormCarSourceArr = allPlatFormCarSourceArr;
					console.log(that.platFormCarSourceArr,that.allPlatFormCarSourceArr, 'aasasaqw')
				} else {
					var arr = allPlatFormCarSourceArr.splice(0, that.platFormSearchParams.pageSize);
					that.platFormCarSourceArr = that.platFormCarSourceArr.concat(arr);
					that.isPlateFormMore = "more";
					that.allPlatFormCarSourceArr = allPlatFormCarSourceArr;
				}
			
			},
			loadMore() {
				var that = this;
				var carListSourceIndex = this.carListSourceIndex;
				var params = new Object();
				if (carListSourceIndex == 0) {
					//下一页我的车源信息
					if (this.isMyMore == "loading" || this.isMyMore == "noMore" || this.myCarSourceArr.length < 1) {
						return;
					}
					this.isMyMore = "loading";
					var mySearchParams = this.mySearchParams;
					mySearchParams.pageNum ++;
					this.mySearchParams = mySearchParams;
					params = {
						...mySearchParams
					}
				} else {
					//下一页平台全部车源信息
					if (this.isPlateFormMore == "loading" || this.isPlateFormMore == "noMore" || this.allPlatFormCarSourceArr.length < 1) {
						return;
					}
					this.toLoadCarInfo("hasLoad");
					return;
					this.isPlateFormMore = "loading";
					var platFormSearchParams = this.platFormSearchParams;
					platFormSearchParams.pageNum ++;
					this.platFormSearchParams = platFormSearchParams;
					params = {
						...platFormSearchParams
					}
				}
				console.log(params, 'aaaa');
				var url = "";
				if (carListSourceIndex == 0) {
					url = "/cy/carSource/driver_car_source";
				} else {
					url = "/cy/carSource/select"
					// url = "/cy/carSource/show"
				}
				///cy/carSource/show
				ship.postRequest(url, params)
				.then(res => {
					uni.stopPullDownRefresh();
					console.log(res, '车源11111')
					if (res.retCode == "0000000") {
						var list = res.rspBody.items;
						if (carListSourceIndex == 0) {
							this.isMyMore = list.length < this.mySearchParams.pageSize ? 'noMore' : 'more';
							this.myCarSourceArr = that.myCarSourceArr.concat(list);
						} else {
							this.isPlateFormMore = res.rspBody.items.length < this.platFormSearchParams.pageSize ? 'noMore' : 'more';
							this.platFormSearchTotal = res.rspBody.total;
							this.platFormCarSourceArr = that.platFormCarSourceArr.concat(list);
						}
						
					}
				})
				.catch(err => {
					uni.stopPullDownRefresh();
				})
			},
			resetFresh() {
				//初始化清空所有数据
				this.platFormSearchParams = {
					subEndAddr: '',
					subStartAddr: '',
					startAddr: '',
					endAddr: '',
					circuitCombo: '',
					carCombo: '',
					carLength: '',
					carModel: '',
					senderCode: '',
					receiverCode: '',
					pageSize: 30,
					pageNum: 1,
					
				};
				this.$refs.carVehicleAlertRef.clearType();
				this.platFormCarSourceArr = [];
				this.platFormSearchTotal = 0;
				this.initDate();
				this.refresh();
			},
			isAllowSearch() {
				//判断是否允许搜索
				var carLength = this.platFormSearchParams.carLength;
				var carModel = this.platFormSearchParams.carModel;
				var carCombo = this.platFormSearchParams.carCombo;
				if (!carLength || !carModel || !carCombo) {
		
					return {status: 0, msg: '请输入查询条件再搜索'};
				}
				var startAddr = this.platFormSearchParams.startAddr;
				var endAddr = this.platFormSearchParams.endAddr;
				if (!startAddr || !endAddr) {
					uni.showToast({
						title: '请输入查询条件再搜索',
						icon: 'none'
					})
					return {status: 0, msg: '请输入查询条件再搜索'};
				}
				return {status: 1, msg: '请选择起始地和目的地'};;
			},
			searchResult() {
				//点击搜索按钮开始搜索
				var isAllow = this.isAllowSearch();
				if (isAllow.status == 0) {
					uni.showToast({
						title: isAllow.msg,
						icon: 'none'
					})
				} else {
					uni.showLoading();
					this.refresh();
				}
			},
			noticeInit() {
				//跑马灯初始化
				var that = this;
				ship.postRequest("/xxq/notice/list", {
					noticeRole : 'driver',
					noticeChannel : 'app',
					effective : 1
				}).then(res => {
					console.log("跑马灯数据", res)
					if (res.retCode == "0000000") {
						var item = res.rspBody.items[0];
						that.hintSwiperText = item.noticeTitle + '：' + item.noticeDescription;
						that.noticeTitle = item.noticeTitle;
						that.noticeDescription = item.noticeDescription;
					}
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.car-source {
		background-color: #F1F4F9;
		display: flex;
		flex-direction: column;
		width: 100vw;
		padding: 30rpx 36rpx 0;
		box-sizing: border-box;
		::-webkit-scrollbar{
			  display: none;
		}
		.pl-16 {
			padding-left: 16rpx;
		}
		.swiperHint-source {
			height: 60rpx;
			flex: 1;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			.uni-noticebar__content--scrollable {
				height: 100%;
			}
			.hintScrollBox {
				overflow-x: auto;
				overflow-y: hidden;
			}
			.hint {
				line-height: 60rpx;
				font-size: 24rpx;
				color: #F78B30;
				white-space:nowrap;
			}
		}
		.price-placeholder-class {
			color: #EE6502;
			font-size: 32rpx;
		}
		.car-source-tabs-content-tab-noData {
			height: 400rpx;
			width: calc(100vw - 72rpx);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #8A8A8A;
			font-weight: 500;
			font-size: 28rpx;
			.car-source-no-data {
				width: 252rpx;
			}
		}
		
		.startTimePopUp-content {
			background-color: #FFFFFF;
			border-radius: 24rpx 24rpx 0 0;
			width: 100vw;
			height: 874rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.startTime-title {
				color: rgba(51, 51, 51, 1);
				font-size: 40rpx;
				font-weight: 600;
				line-height: 44rpx;
				margin-top: 60rpx;
				margin-bottom: 52rpx;
			}
			.time-list {
				width: 100vw;
				padding: 0 10rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.time-item {
					width: 33.33%;
					padding: 0 30rpx;
					box-sizing: border-box;
					&.time-item-end {
						margin-bottom: 30rpx;
					}
					.time-item-content {
						height: 82rpx;
						width: 100%;
						color: rgba(51, 51, 51, 1);
						font-size: 32rpx;
						font-weight: 400;
						box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.43);
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 8rpx;
						box-sizing: border-box;
						&.active {
							background-color: rgba(67, 150, 248, 1);
							color: #FFFFFF;
							box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.22);
							font-weight: 600;
						}
					}
					
				}
			}
			.startTime-subTitle {
				width: 100vw;
				padding: 36rpx 36rpx 0;
				color: rgba(102, 102, 102, 1);
				font-size: 28rpx;
				font-weight: 400;
				line-height: 44rpx;
				box-sizing: border-box;
			}
			.startTime-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.picker-box {
					height: 284rpx;
					width: 500rpx;
					.item {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
					}
					&.indicatorStyle {
						color: #333333;
						font-size: 50rpx;
						font-weight: 500;
					}
					
				}
				.all-time {
					font-size: 28rpx;
					color: #666666;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					margin-top: 40rpx;
					&.active {
						color: rgba(74, 205, 27, 1);
					}
					.all-time-checked {
						width: 28rpx;
						margin-left: 4rpx;
					}
				}
			}
			.startTime-btn {
				width: 100vw;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				padding-bottom: 126rpx;
				box-sizing: border-box;
				.startTime-btn-item {
					height: 80rpx;
					border-radius: 16rpx;
					padding: 0 36rpx;
					font-size: 32rpx;
					font-weight: 500;
					box-sizing: border-box;
					display: flex;
					justify-content: center;
					align-items: center;
					&.cancel {
						background-color: RGBA(242, 243, 245, 1);
						color: rgba(92, 92, 92, 1);
						margin-right: 72rpx;
					}
					&.confirm {
						background-color: RGBA(43, 114, 240, 1);
						color: #FFFFFF;
					}
				}
			}
			
		}
		.notice-content {
			border-radius: 24rpx;
			width: 564rpx;
			height: 520rpx;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			.lingdang {
				width: 139rpx;
				position: absolute;
				left: 214rpx;
				top: -78rpx;
			}
			.notice-content-inner {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-top: 100rpx;
				align-items: center;
				color: #333333;
				font-size: 36rpx;
				font-weight: 500;
				box-sizing: border-box;
				line-height: 42rpx;
				margin: 0 46rpx;
				.notice-content-inner-text {
					line-height: 42rpx;
				}
			}
			.my-know {
				height: 102rpx;
				text-align: center;
				line-height: 102rpx;
				color: #4EADF1;
				font-size: 32rpx;
				font-weight: 500;
				border-top: 1px solid #F1F1F1;
			}
		}
		.imgContent {
			height: 150rpx;
			border-radius: 24rpx;
			width: calc(100vw - 72rpx);
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: flex-start;
			overflow: hidden;
			.swiperBanner {
				height: 150rpx;
				width: calc(100vw - 72rpx);
			}
			.img-source-adv {
				width: 100%;
				height: 150rpx;
			}
		}
		.notice {
			padding-right: 58rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			background-color: #FFEBBE;
			border-radius: 8rpx;
			box-shadow: 0 0 38rpx 2rpx rgba(255, 193, 63, 0.44);
			box-sizing: border-box;
			height: 60rpx;
			margin: 28rpx 0 40rpx;
			.notice-icon {
				width: 27rpx;
				margin: 0 26rpx;
			}
		}
		.settings {
			display: flex;
			flex-direction: column;
			background-color: #FFFFFF;
			width: calc(100vw - 72rpx);
			padding: 0 36rpx;
			box-sizing: border-box;
			border-radius: 18rpx;
			box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.19);
			.my-settings {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.go-settings {
					width: 106rpx;
					height: 52rpx;
					background-color: #FF6161;
					border-radius: 8rpx;
					color: #FFFFFF;
					font-size: 28rpx;
					font-weight: 600;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 0 8rpx 0 20rpx;
				}
				.set-list {
					.set-title {
						color: #000000;
						font-size: 28rpx;
						font-weight: 600;
						line-height: 44rpx;
						&.set-type-title {
							margin-top: 38rpx;
						}
						.require-text {
							color: #C11F1F;
							padding-left: 10rpx;
						}
					}
					.car-source-list {
						
						width: calc(100vw - 300rpx);
						overflow-x: scroll;
						margin-bottom: 14rpx;
						font-size: 24rpx;
						white-space: nowrap;
						height: 50rpx;
						line-height: 50rpx;
						margin-top: 14rpx;
						&.car-router {
							margin-bottom: 20rpx;
							color: #666666;
						}
						&.noCar {
							color: #666666;
							margin-top: 0;
						}
						.noData {
							color: #000000;
						}
						.car--source-list-item {
							color: rgba(70, 70, 70, 1);
							padding: 10rpx 16rpx;
							border-radius: 8rpx;
							box-shadow: 0 0rpx 8rpx 1rpx rgba(67, 150, 248, 0.28);
							margin-right: 20rpx;
							display: inline-block;
							&.active {
								background-color: rgba(67, 150, 248, 1);
								color: #FFFFFF;
							}
							&:last-child {
								margin-right: 0;
							}
						}
						.car--router-list-item {
							color: rgba(70, 70, 70, 1);
							padding: 10rpx 10rpx;
							border-radius: 8rpx;
							margin-right: 20rpx;
							box-shadow: 0 0rpx 8rpx 1rpx rgba(67, 150, 248, 0.28);
							display: inline-block;
							&.active {
								background-color: rgba(67, 150, 248, 1);
								color: #FFFFFF;
							}
							&:last-child {
								margin-right: 0;
							}
						}
					}
					
				}
			}
			.car--source-line {
				height: 1rpx;
				background-color: #E3E3E3;
				margin-bottom: 20rpx;
			}
			.car-price-info {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 26rpx;
				margin-right: 6rpx;
				.info-label {
					color: #333333;
					font-size: 28rpx;
				}
				.input-label {
					display: flex;
					flex-direction: row;
					height: 44rpx;
					justify-content: center;
					align-items: center;
					.car-source-price-input {
						text-align: center;
						width: 110rpx;
						color: #EE6502;
						font-size: 32rpx;
						font-weight: 600;
						line-height: 44rpx;
						border-bottom: 1px solid #D8D8D8;
					}
					.car-source-price-label {
						color: #666666;
						font-size: 24rpx;
					}
				}
				.unit-list {
					display: flex;
					flex-direction: row;
					.unit-list-item {
						width: 80rpx;
						height: 40rpx;
						border-radius: 8rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background-color: #DEDEDE;
						border: 1px solid #BDBDBD;
						color: #BDBDBD;
						font-size: 26rpx;
						margin-left: 14rpx;
						font-weight: 400;
						&.active {
							background-color: #2973FA;
							border-color: #2973FA;
							color: #FFFFFF;
							font-weight: 500;
						}
						&:first-child {
							margin-left: 0;
						}
					}
				}
			}
			.car-source-long {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				margin-bottom: 58rpx;
				margin-right: 6rpx;
				height: 46rpx;
				.car-source-long-time {
					color: #000000;
					height: 46rpx;
					font-size: 32rpx;
					font-weight: 600;
					line-height: 44rpx;
					border-bottom: 1px solid #D8D8D8;
					margin-left: 20rpx;
				}
			}
			.car-source-info {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				margin-bottom: 58rpx;
				margin-right: 6rpx;
				height: 46rpx;
				.car-source-date-input {
					width: 64rpx;
					color: #000000;
					height: 46rpx;
					font-size: 32rpx;
					font-weight: 600;
					line-height: 44rpx;
					border-bottom: 1px solid #D8D8D8;
					text-align: center;
				}
			}
			.publish {
				width: calc(100vw - 148rpx);
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 46rpx;
				.pub-btn {
					width: calc(100vw - 348rpx);
					height: 80rpx;
					background-color: #2973FA;
					border-radius: 16rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #FFFFFF;
					font-size: 32rpx;
					position: relative;
					font-weight: 600;
					position: relative;
					.pub-text {
						position: absolute;
						left: 0;
						top: 0;
						z-index: 2;
						width: calc(100vw - 348rpx);
						height: 80rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						
					}
					.bg-gradient {
						position: absolute;
						top: 40rpx;
						left: 68rpx;
						width: calc(100vw - 484rpx);
						height: 40rpx;
						z-index: 1;
						box-shadow: 0 5rpx 30rpx 1rpx rgba(41, 115, 250, 0.6);
									
					}
				}
			}
		}
		.car-source-tabs {
			display: flex;
			flex-direction: column;
			margin-top: 40rpx;
			.car-source-tabs-title {
				
				background-size: cover;
				height: 78rpx;
				display: flex;
				flex-direction: row;
				width: calc(100vw - 72rpx);
				&.first {
					background-image: url(../../../static/images/ship/car-source-tabs-bg.png);
				}
				&.second {
					background-image: url(../../../static/images/ship/car-source-tabs-bg-second.png);
				}
				.car-source-tabs-title-item {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
					&.active {
						font-size: 32rpx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
					}
				}
			}
			.searchResult {
				height: 90rpx;
				border-bottom: 1px solid rgba(227, 227, 227, 1);
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				background-color: #FFFFFF;
				width: calc(100vw - 72rpx);
				.searchResult-text {
					margin: 0 108rpx;
					height: 44rpx;
					line-height: 44rpx;
					background-color: rgba(255, 235, 190, 1);
					font-size: 24rpx;
					color: rgba(247, 139, 48, 1);
					padding: 0 42rpx;
					box-sizing: border-box;
					border-radius: 8rpx;
					
					.searchResult-text-item {
						letter-spacing: 4rpx;
					}
					.num {
						color: rgba(243, 69, 58, 1);
						font-weight: bold;
					}
				}
			}
			.car-source-tabs-content {
				display: flex;
				flex-direction: column;
				align-items: center;
				.car-platform-search-content {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					padding: 0 18rpx;
					box-sizing: border-box;
					background-color: #FFFFFF;
					height: 72rpx;
					.search-start {
						color: rgba(41, 115, 250, 1);
						font-size: 32rpx;
						font-weight: 600;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						&.search-start-default {
							color: #666666;
							font-size: 28rpx;
							font-weight: 400;
						}
						.search-start-text {
							line-height: 44rpx;
							height: 44rpx;
							width: 100rpx;
							text-align: center;
							white-space: nowrap;
							lines: 1;
							text-overflow: ellipsis;
							overflow: hidden;
						}
						.line {
							width: 70%;
							height: 2rpx;
							background-color: rgba(216, 216, 216, 1);
						}
					}
					.search-li {
						flex: 1;
						color: rgba(51, 51, 51, 1);
						font-size: 28rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.seperate {
						height: 26rpx;
						width: 1px;
						background-color: rgba(227, 227, 227, 1);
						margin: 0 40rpx;
					}
					.all-type {
						display: flex;
						flex-direction: row;
						color: rgba(51, 51, 51, 1);
						font-size: 24rpx;
						width: 146rpx;
						height: 40rpx;
						justify-content: center;
						align-items: center;
						.down-arrow {
							width: 16rpx;
							margin-left: 6rpx;
						}
					}
					.maps {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						color: rgba(51, 51, 51, 1);
						font-size: 24rpx;
						.map-icon {
							width: 30rpx;
							margin-right: 8rpx;
							margin-left: 18rpx;
						}
					}
					.search-icon {
						width: 34rpx;
						margin-left: 18rpx;
						margin-right: 28rpx;
					}
					.search-btn {
						margin-left: 50rpx;
						margin-right: 20rpx;
						font-size: 28rpx;
						color: rgba(51, 51, 51, 1);
						color: #2973FA;
						font-weight: 500;
					}
					
					
					
					
				}
				.car-source-tabs-content-tab-item-second {
					margin-bottom: 20rpx;
					background-color: #FFFFFF;
					display: flex;
					flex-direction: column;
					padding: 24rpx 32rpx;
					box-sizing: border-box;
					justify-content: space-between;
					border-radius: 16rpx;
					width: calc(100vw - 72rpx);
					&:first-child {
						border-top-left-radius: 0;
						border-top-right-radius: 0;
					}
					.plat-user {
						display: flex;
						flex-direction: row;
						align-items: flex-start;
						.avatar {
							width: 88rpx;
							height: 88rpx;
						}
						.userInfo {
							flex: 1;
							display: flex;
							flex-direction: column;
							margin-left: 12rpx;
							.user-row {
								display: flex;
								flex-direction: row;
								justify-content: space-between;
								align-items: center;
								height: 88rpx;
								margin-bottom: 22rpx;
								.name {
									color: rgba(51, 51, 51, 1);
									font-size: 32rpx;
									font-weight: 500;
								}
								.mobile {
									color: rgba(102, 102, 102, 1);
									font-size: 28rpx;
									margin-left: 22rpx;
								}
								.icon-total {
									display: flex;
									flex-direction: row;
									.icon-box {
										display: flex;
										flex-direction: column;
										justify-content: center;
										align-items: center;
										font-size: 20rpx;
										color: rgba(0, 0, 0, 1);
										&:last-child {
											margin-left: 50rpx;
										}
										.location-center {
											width: 48rpx;
										}
										.car-news {
											width: 48rpx;
										}
									}
								}
							}
							.user-pub-date {
								display: flex;
								flex-direction: row;
								justify-content: space-between;
								align-items: center;
								font-size: 24rpx;
								font-weight: 600;
								letter-spacing: 1.5rpx;
								.user-pub-date-item {
									display: flex;
									flex-direction: row;
								}
								.ml-15 {
									margin-left: 15rpx;
								}
								.pub-date {
									color: rgba(41, 115, 250, 1);
									margin-left: 26rpx;
									.pub-date-normal {
										color: #333333;
									}
								}
							}
						}
					}
				}
				
				.car-source-tabs-content-tab-item {
					margin-bottom: 20rpx;
					background-color: #FFFFFF;
					display: flex;
					flex-direction: column;
					padding: 26rpx 24rpx 18rpx;
					box-sizing: border-box;
					justify-content: space-between;
					height: 210rpx;
					border-radius: 16rpx;
					width: calc(100vw - 72rpx);
					&:first-child {
						border-top-left-radius: 0;
						border-top-right-radius: 0;
					}
					
					.car-addr {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						.source-addr {
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							.addr-detail {
								font-size: 32rpx;
								color: #000000;
								font-weight: 600;
							}
							.addr-pub-date {
								display: flex;
								flex-direction: column;
								color: rgba(102, 102, 102, 1);
								font-size: 24rpx;
								justify-content: center;
								align-items: center;
								.car-source-line {
									width: 114rpx;
									margin: 0 16rpx;
								}
							}
							
						}
						.will-get-price {
							position: relative;
							color: rgba(51, 51, 51, 1);
							font-size: 28rpx;
							.price-text {
								position: absolute;
								top: 44rpx;
								right: 0;
								color: rgba(215, 72, 72, 1);
								display: flex;
								flex-direction: row;
								justify-content: center;
								align-items: center;
								flex-wrap: nowrap;
								white-space: nowrap;
								
							}
						}
					}
					.car-info-get {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						.car-info-date {
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: flex-start;
							line-height: 44rpx;
						}
						.get-detail {
							font-size: 28rpx;
							color: #000000;
							font-weight: 500;
						}
						.date-period {
							font-size: 24rpx;
							color: rgba(114, 114, 114, 1);
						}
						.car-info-btn {
							display: flex;
							flex-direction: row;
							align-items: center;
						}
						.info-opt {
							width: 118rpx;
							height: 42rpx;
							color: #2973FA;
							border: 1px solid #2973FA;
							border-radius: 8rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 24rpx;
							&:last-child {
								margin-left: 22rpx;
							}
						}
					}
				}
			}
		}
		.popup-box {
			background-color: #FFFFFF;
			width: 480rpx;
			height: 282rpx;
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			.popup-content {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				color: rgba(51, 51, 51, 1);
				font-size: 28rpx;
				font-weight: 500;
			}
			.pop-bottom {
				display: flex;
				flex-direction: row;
				width: 480rpx;
				height: 90rpx;
				border-top: 1px solid rgba(241, 241, 241, 1);
				.pop-cancel {
					color: rgba(102, 102, 102, 1);
					border-right: 1px solid rgba(241, 241, 241, 1);
				}
				.pop-confirm {
					color: rgba(78, 173, 241, 1);
				}
				.pop-bootom-btn {
					font-size: 28rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex: 1;
				}
			}
		}
	}
</style>
