<template>
	<view class="sendSourcePage">
		<view class="pageHead" @click="jumpToSendSource">
			<image class="backIcon" src="/static/images/loginHint/newBack.png"></image>
		</view>
		<view class="largeTitle">您现在在{{nowLocationCity}}</view>
		<view class="largeTitle">下一个目的地您期待去哪呢？</view>
		<view class="mainContent">快来更新您的车源，我们会给您推荐更精准的货源哦！</view>
		<view class="sendSourceBox">
			<view class="sendAddressBox">
				<view class="title">起始地</view>
				<view class="content" @click="showAddrPopUp(0)">{{publishParams.sender || ""}}</view>
			</view>
			<view class="sendAddressBox">
				<view class="title">目的地</view>
				<view class="content" @click="showAddrPopUp(1)">{{publishParams.receiver || ""}}</view>
			</view>
			<view class="sendAddressBox">
				<view class="title">我的车辆</view>
				<view style="padding-right: 40rpx;">
					<view class="scrollDataGroup" v-if="carAry.length > 0">
						<view class="dataGroup">
							<view class="dataBtn carBtn" v-for="(item, cIndex) in carAry" :key="cIndex" @click="checkCar(item)" :class="checkedCar == item.sid ? 'checkedDataBtn' : 'defaultDataBtn'">
								{{item.tagName}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="car-source-info" v-if="!longTimeFlag">
				<view class="title">车源从</view>
				<view class="car-source-date-input" @click="showStartPopUp(0)">{{indateStart}}</view>
				<view>至</view>
				<view class="car-source-date-input"  @click="showStartPopUp(1)">{{indateEnd}}</view>
				<view>天内有效</view>
			</view>
			<view class="car-source-long" v-if="longTimeFlag">
				<view class="title">车源从</view>
				<view class="car-source-long-time" @click="showStartPopUp(0)">长期有效</view>
			</view>
		</view>
		<view class="sendBtn" @click="toSendOrder()">发布</view>
		
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
		
		<!--地址删选-->
		<uni-popup ref="addrPopUp" type="bottom" :maskClick="false">
			<view class="alert-content">
				<swiper :current="currentIndex" class="swiper-box" :disable-touch="true">
					<swiper-item>
						<view class="swiper-content">
							<view class="alert-content-title">
								<image src="/static/images/uploadReport/close.png" mode="widthFix" class="back-black" @click="goBack(0)"></image>
								<text>选择起始地</text>
							</view>
							<view class="search-content">
									<image src="/static/images/ship/car-source-search-icon.png" mode="widthFix" class="car-search"></image>
							
									<input type="text" v-model="startInputVal" @input="startInput" placeholder="请输入市/直辖市" class="search-input" />
								
									<image src="/static/images/ship/car-search-clear.png" mode="widthFix" class="car-search-clear" @click="clearStart"></image>
								
							</view>
							<view class="search-history-common" />
							<view class="scroller-content" v-if="startInputVal">
								<scroll-view class="search-result-list" :scroll-y="true">
									<view class="search-result-list-item" v-for="item in searchResultArr" @click="toArrive(item)">
										{{item.name}}
									</view>
								</scroll-view>
							</view>	
							<view v-else class="search-extend">
								<view class="search-history" v-if="startHistory.length > 0">
									<view class="search-history-title">最近搜索</view>
									<view class="search-history-list">
										<view class="search-history-item" v-for="(item, index) in startHistory" @click="clickHistory(index, 0)">
											<view class="search-item-inner">{{item.name}}</view>
										</view>
									</view>
									<view class="outLine" />
								</view>
								<view class="pick-content">
									<picker-view :value="pickStartVal" @change="bindStartChange" class="pick-view" indicator-class="indicatorClass">
										<picker-view-column>
											<view class="item" v-for="(item,index) in provinceLocal" :key="index">{{item.name}}</view>
										</picker-view-column>
										<picker-view-column>
											<view class="item" v-for="(item,index) in pickStartCity" :key="index">{{item.isFour ? '全市' : item.name}}</view>
										</picker-view-column>
									</picker-view>
								</view>
								<view class="nextStep-step">
									<view @click="toConfirmStartSearch" class="nextStep">确定</view>
								</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-content">
							<view class="alert-content-title">
								<image src="/static/images/uploadReport/close.png" mode="widthFix" class="back-black" @click="goBack(1)"></image>
								<text>选择目的地</text>
							</view>
							<view class="search-content">
									<image src="/static/images/ship/car-source-search-icon.png" mode="widthFix" class="car-search"></image>
							
									<input type="text" v-model="arriveInputVal" @input="arriveInput"  placeholder="请输入市/直辖市" class="search-input" />
								
									<image src="/static/images/ship/car-search-clear.png" mode="widthFix" class="car-search-clear" @click="clearEnd"></image>
								
							</view>
							<view class="search-history-common" />
							<!-- <view class="search-history-common" @click="toSearchCommon">全国</view> -->
							<view class="scroller-content end" v-if="arriveInputVal">
								<scroll-view class="search-result-list" :scroll-y="true">
									<view class="search-result-list-item" v-for="item in searchArriveResultArr" @click="toSearchResult(item)">
										{{item.name}}
									</view>
								</scroll-view>
							</view>	
							<view v-else class="search-extend">
								<view class="search-history" v-if="arriveHistory.length > 0">
									<view class="search-history-title endHistory">最近搜索</view>
									<view class="search-history-list">
										<view class="search-history-item" v-for="(item, index) in arriveHistory" @click="clickHistory(index, 1)">
											<view class="search-item-inner">{{item.name}}</view>
										</view>
									</view>
									<view class="outLine"/>
								</view>
								<view class="pick-content">
									<picker-view :value="pickEndVal" @change="bindEndChange" class="pick-view">
										<picker-view-column>
											<view class="item" v-for="(item,index) in provinceLocal" :key="index">{{item.name}}</view>
										</picker-view-column>
										<picker-view-column>
											<view class="item" v-for="(item,index) in pickEndCity" :key="index">
												<text v-if="item.isProvince == 1">全省</text>
												<text v-else-if="item.isProvince == 2">全市</text>
												<text v-else>{{item.name}}</text>
											</view>
										</picker-view-column>
									</picker-view>
								</view>
								<view class="nextStep-step">
									<view @click="toConfirmEndSearch" class="nextStep">确定</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/utils"
	import * as ship from "@/utils/ship"
	import * as publicData from "@/utils/publicData.js";
	export default {
		data() {
			return {
				driverAddress: '',
				startingAddress: '', // 起始地
				endAddress: '', // 目的地
				longTimeFlag: false, // 是否长期有效
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
				indateStart: '今天',
				indateEnd: '3',
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
				pickStartIndex: 0,
				pickEndIndex: 2,
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
				pickEndCity: [],
				pickEndVal: [0, 0],
				pickEndConfirm: [0, 0],
				pickStartConfirm: [0, 0],
				pickStartVal: [0, 0],
				pickStartProvince: [],
				pickStartCity: [],
				currentIndex: 0,
				provinceLocal: [],
				searchResultArr: [],
				searchArriveResultArr: [],
				params: {
					startAddr: null,
					arriveAddr: null,
				},
				startHistory: [],
				arriveHistory: [],
				isStartShowZuijinSearch: true,
				isArriveShowZuijinSearch: true,
				startInputVal: '',
				arriveInputVal: '',
				nowLocationCity: '', // 当前定位市
				checkedCar: '',
				carAry: [],
				userInfo: {}
			};
		},
		onLoad() {
			let userData = uni.getStorageSync("userInfo");
			this.userInfo = userData ? JSON.parse(userData) : {};
			this.initDate();
			this.getCarInfo();
			this.getLocationMsg();
			
			var provinceLocal = uni.getStorageSync("provinceLocal");
			if (!provinceLocal) {
				this.getAllArea();
			} else {
				this.provinceLocal = JSON.parse(provinceLocal);
				this.pickStartCity = this.provinceLocal[0].cities;
				//判断目的地是否是直辖
				var provinceName = this.provinceLocal[0].name;
				var provinceCode = this.provinceLocal[0].code;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
					var cities = this.provinceLocal[0].cities;
					var coties = [{
						name: provinceName,
						code: provinceCode,
						isProvince: 2,
					}, ...cities]
					this.pickEndCity = coties;
				} else {
					var cities = this.provinceLocal[0].cities;
					var coties = [{
						name: provinceName,
						code: provinceCode,
						isProvince: 1,
					}, ...cities]
					this.pickEndCity = coties;
				}
			}
		},
		onBackPress(event){
			return true; //阻止默认返回行为
		},
		watch: {
			'publishParams.sender'(newVal, oldVal) {
				console.log(newVal, oldVal, 'as');
				var arriveName = this.publishParams.receiver;
				
				if (!arriveName) {
					this.publishParams.circuitCombo = '';
				} else {
					this.publishParams.circuitCombo = newVal + '-' + arriveName
				}
			},
			'publishParams.receiver'(newVal, oldVal) {
				console.log(newVal, oldVal, 'as');
				var snedName = this.publishParams.sender;
				if (!snedName) {
					this.publishParams.circuitCombo = ''
				} else {
					this.publishParams.circuitCombo = snedName + '-' + newVal
				}
			},
		},
		methods: {
			initDate() {
				var nowDate = utils.fun_date(0);
				var date_3 = utils.fun_date(2);
				this.publishParams.indateStart = nowDate + ' ' + '00:00:00';
				this.publishParams.indateEnd = date_3 + ' ' + '23:59:59';
				this.publishParams.indateCount = 3;
			},
			getCarInfo() { //获取车辆信息
				let params = {
					userId: this.userInfo.userId,
					typeCodeList: ['MY_VEHICLE'],
					status: 1
				}
				let that = this;
				ship.postRequest('/yh/upd/tags/find', params)
				.then(function (res) {
					console.log('新的已配置列表', res);
					if(res.retCode == '0000000'){
						that.carAry = res.rspBody.items;
						if(that.carAry && that.carAry.length > 0) {
							let carObj = that.carAry['0'].tagName.split('米');
							that.publishParams.carModel = carObj[1];
							that.publishParams.carLength = carObj[0];
							that.publishParams.carCombo = carObj[0] + '-' + carObj[1];
							that.checkedCar = that.carAry['0'].sid;
						}
						that.$forceUpdate();
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
					uni.showToast({
						title: err,
						icon: 'none'
					})
				})
			},
			getLocationMsg() { //获取定位
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						console.log('定位信息', res);
						that.nowLocationCity = res.address.city;
						that.getGaoDeAddress(res.address.city);
					},
					fail: function(err) {
						console.log('定位失败', err)
					},
				})
			},
			getGaoDeAddress(city) { // 根据uniapp api走高德行政区域查询后，获取code再走本地地址区域查询
				var that = this;
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&keywords=' + city
				uni.request({
					url: 'https://restapi.amap.com/v3/config/district?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('行政区域查询', res);
						if (res.data.status == 1) {
							var districts = res.data.districts[0];
							// var cityCode = districts.adcode;
							// var cityName = districts.name;
							// that.publishParams.sender = cityName;
							// that.publishParams.senderCode = cityCode;
							var provinceCode, provinceName, cityCode, cityName;
							provinceCode = districts.adcode;
							provinceName = districts.name;
							cityCode = districts.districts && districts.districts.length > 0 ? districts.districts[0].adcode : '';
							cityName = districts.districts && districts.districts.length > 0 ? districts.districts[0].name : '';
							that.searchAddressCode(provinceCode, provinceName, cityCode, cityName);
						} else {
							uni.showToast({
								title: '经纬度获取失败',
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.log('驾车路线规划失败', err);
					},
					complete: (com) => {}
				});
			},
			searchAddressCode(provinceCode, provinceName, cityCode, cityName) { // 根据获取的code查询
				if(provinceCode && cityCode) {
					if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
						for(let i in this.provinceLocal) {
							if(this.provinceLocal[i].code == provinceCode) {
								this.publishParams.sender = this.provinceLocal[i].name;
								this.publishParams.senderCode = this.provinceLocal[i].code;
								break;
							}
						}
					}else {
						for(let i in this.provinceLocal) {
							if(this.provinceLocal[i].code == provinceCode) {
								let cityItem = this.provinceLocal[i].cities;
								for(let c in cityItem) {
									if(cityItem[c].code == cityCode) {
										this.publishParams.sender = cityItem[c].name;
										this.publishParams.senderCode = cityItem[c].code;
										break;
									}
								}
							}
						}
					}
				}
			},
			jumpToSendSource() {
				publicData.setTabbarItem(1);
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
			switchStartTime(index) {
				this.pickStartIndex = index;
			},
			switchEndTime(index) {
				this.pickEndIndex = index
			},
			showStartPopUp(index) {
				if (index == 0) {
					this.$refs.startTimePopUp.open();
				} else {
					this.$refs.endTimePopUp.open();
				}
			},
			showAddrPopUp(key) {
				this.currentIndex = key;
				this.$refs.addrPopUp.open();
			},
			goBack(index) {
				this.$refs.addrPopUp.close();
			},
			clearStart() {
				//清除起始地
				var that = this;
				this.$nextTick(function(){
					that.startInputVal = "";
					that.searchResultArr = [];
				})
				
			},
			clearEnd() {
				//清除目的地
				var that = this;
				this.$nextTick(function(){
					that.arriveInputVal = "";
					that.searchArriveResultArr = [];
				})
			},
			async getAllArea() {
				try{
					var res = await ship.postRequest("/ts/nationDict/getBasicData");
					console.log(res, '地址信息')
					var provinceArr = res.rspBody;
					this.provinceLocal = provinceArr;
					this.pickStartCity = provinceArr[0].cities;
					//判断目的地
					var provinceName = provinceArr[0].name;
					var provinceCode = provinceArr[0].code;
					if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
						var cities = provinceArr[0].cities;
						var coties = [{
							name: provinceName,
							code: provinceCode,
							isProvince: 2,
						}, ...cities]
						this.pickEndCity = coties;
					} else {
						var cities = provinceArr[0].cities;
						var coties = [{
							name: provinceName,
							code: provinceCode,
							isProvince: 1,
						}, ...cities]
						this.pickEndCity = coties;
					}
					uni.setStorageSync("provinceLocal", JSON.stringify(provinceArr));
				}catch(e){
					//TODO handle the exception
				}
			},
			showPopUp() {
				//判断缓存中是否有历史搜索记录,否则每次打开更新历史记录
				this.showHistory();
				this.$refs.addrPopUp.open()
			},
			hidePopUp() {
				this.$refs.addrPopUp.close()
			},
			showHistory() {
				var startHistory = uni.getStorageSync("startHistory");
				var arriveHistory = uni.getStorageSync("arriveHistory");
				this.startHistory = startHistory ? JSON.parse(startHistory) : [];
				this.arriveHistory = arriveHistory ? JSON.parse(arriveHistory) : [];
			},
			searchStartList(val) {
				var provinceLocal = this.provinceLocal;
				var searchResultArr = [];
				provinceLocal.forEach(item => {
					var cities = item.cities;
					var name = item.name;
					if (name.indexOf("北京") > -1 || name.indexOf("天津") > -1 || name.indexOf("上海") > -1 || name.indexOf("重庆") > -1) {
						if (name.indexOf(val) > -1) {
							searchResultArr.push({
								name: name,
								code: item.code,
							})
						}
						
					}
					cities.forEach(atem => {
						var name = atem.name;
						if (name.indexOf(val) > -1) {
							searchResultArr.push({
								name: name,
								code: atem.code
							})
						}
					})
				})
				this.searchResultArr = searchResultArr;
			},
			searchEndList(val) {
				var provinceLocal = this.provinceLocal;
				var searchResultArr = [];
				provinceLocal.forEach(item => {
					var cities = item.cities;
					var name = item.name;
					if (name.indexOf("北京") > -1 || name.indexOf("天津") > -1 || name.indexOf("上海") > -1 || name.indexOf("重庆") > -1) {
						if (name.indexOf(val) > -1) {
							searchResultArr.push({
								name: name,
								code: item.code,
							})
						}
						
					}
					cities.forEach(atem => {
						var name = atem.name;
						if (name.indexOf(val) > -1) {
							searchResultArr.push({
								name: name,
								code: atem.code
							})
						}
					})
				})
				this.searchArriveResultArr = searchResultArr;
			},
			startInput(e) {
				//启运地搜索市或直辖市
				console.log(e)
				var val = e.detail.value;
				if (!val) {
					this.searchResultArr = [];
					return;
				}
				this.searchStartList(val);
			},
			arriveInput(e) {
				//目的地搜索全国，省或市
				console.log(e)
				var val = e.detail.value;
				if (!val) {
					this.searchArriveResultArr = [];
					return;
				}
				this.searchEndList(val);
			},
			toArrive(item) {
				//点击起始地搜索跳转目的地,且存储到历史记录
				this.currentIndex = 1;
				this.params.startAddr = item;
				var startHistory = this.startHistory;
				console.log(startHistory,'startHistory')
				console.log(startHistory.length,'startHistory.length')
				var findIndex = startHistory.findIndex(atem => {
					return atem.code == item.code
				})
				if (findIndex > -1) {
					startHistory.splice(findIndex, 1);
				}
				startHistory.unshift(item);
				if (startHistory.length > 12) {
					startHistory.splice(11);
				} 
				this.startHistory = startHistory;
				uni.setStorageSync("startHistory", JSON.stringify(startHistory));
				this.searchStartList(item.name);
				this.startInputVal = item.name;
			},
			toSearchResult(item) {
				//目的地搜索结束
				var that = this;
				this.params.arriveAddr = item;
				this.arriveInputVal = item.name;
				this.hidePopUp();
				this.$emit("toSearchResult", that.params);
				var arriveHistory = this.arriveHistory;
				var findIndex = arriveHistory.findIndex(atem => {
					return atem.code == item.code
				})
				if (findIndex > -1) {
					arriveHistory.splice(findIndex, 1);
				}
				arriveHistory.unshift(item);
				if (arriveHistory.length > 12) {
					arriveHistory.splice(11);
				} 
				this.arriveHistory = arriveHistory;
				uni.setStorageSync("arriveHistory", JSON.stringify(arriveHistory));
				
				
				setTimeout(() => {
					that.clear(); //搜索结束后初始化
				})
			},
			clear() {
				this.currentIndex = 0;
				this.searchResultArr = [];
				this.searchArriveResultArr = [];
				this.arriveInputVal = "";
				this.startInputVal = "";
				this.params =  {
					startAddr: null,
					arriveAddr: null,
				}
			},
			clickHistory(index, i) {
				var that = this;
				//点击搜索记录跳转
				if (i== 0) {
					//点击起始地
					var startHistory = this.startHistory;
					var clickItem = startHistory[index];
					this.params.startAddr = clickItem;
					startHistory.splice(index, 1);
					startHistory.unshift(clickItem);
					this.startHistory = startHistory;
					uni.setStorageSync("startHistory", JSON.stringify(startHistory));
					this.currentIndex = 1;
					this.searchStartList(clickItem.name);
					this.startInputVal = clickItem.name;
				} else {
					//点击目的地
					var arriveHistory = this.arriveHistory;
					var clickItem = arriveHistory[index];
					this.params.arriveAddr = clickItem;
					arriveHistory.splice(index, 1);
					arriveHistory.unshift(clickItem);
					this.arriveHistory = arriveHistory;
					uni.setStorageSync("arriveHistory", JSON.stringify(arriveHistory));
					
					this.arriveInputVal = clickItem.name;
					this.$emit("toSearchResult", that.params);
					this.hidePopUp();
					setTimeout(() => {
						that.clear(); //搜索结束后初始化
					})
				}
			},
			toSearchCommon() {
				//目的地是全国搜索
				let that = this;
				this.arriveInputVal = "全国";
				this.params.arriveAddr = {
					name: '全国',
					code: 100000,
				};
				this.hidePopUp();
				this.$emit("toSearchResult", that.params);
				setTimeout(() => {
					that.clear(); //搜索结束后初始化
				})
			},
			toConfirmStartSearch() {
				var that = this;
				this.pickStartConfirm[0] = this.pickStartVal[0];
				this.pickStartConfirm[1] = this.pickStartVal[1];
				var pickStartCity = this.pickStartCity;
				//处理起始地址和经纬度
				this.params.startAddr = pickStartCity[that.pickStartConfirm[1]];
				var pickerVal = pickStartCity[that.pickStartConfirm[1]];
				console.log(pickerVal, '阿萨说');
				this.publishParams.senderCode =  pickerVal.code;
				this.publishParams.sender = pickerVal.name;
				// this.currentIndex = 1;
				console.log('目的地', that.params);
				this.hidePopUp();
			},
			toConfirmEndSearch() {
				var that = this;
				this.pickEndConfirm[0] = this.pickEndVal[0];
				this.pickEndConfirm[1] = this.pickEndVal[1];
				var pickEndCity = this.pickEndCity;
				//处理起始地址和经纬度
				this.params.arriveAddr = pickEndCity[that.pickEndConfirm[1]];
				var pickerVal = pickEndCity[that.pickEndConfirm[1]];
				console.log(pickerVal, '阿萨说');
				this.publishParams.receiverCode = pickerVal.code;
				this.publishParams.receiver = pickerVal.name;
				// this.currentIndex = 1;
				this.hidePopUp();
				console.log('目的地', that.params);
				// this.$emit("toSearchResult", that.params);
				// setTimeout(() => {
				//  that.clear();
				// }, 500)
			},
			bindStartChange(e) {
				var pickStartVal = this.pickStartVal;
				 const val = e.detail.value;
				 if (pickStartVal[0] !== val[0]) {
					 //选择不同的省份更新城市
					 this.changeCity(val[0]);
					  this.pickStartVal = [val[0], 0];
				 } else {
					  this.pickStartVal = val;
				 }
				
			},
			bindEndChange(e) {
				var pickEndVal = this.pickEndVal;
				 const val = e.detail.value;
				 if (pickEndVal[0] !== val[0]) {
					 //选择不同的省份更新城市
					 this.changeEndCity(val[0]);
					  this.pickEndVal = [val[0], 0];
				 } else {
					  this.pickEndVal = val;
				 }
			},
			changeEndCity(index) {
				var provinceLocal = this.provinceLocal;
				var provinceName = provinceLocal[index].name;
				var provinceCode = provinceLocal[index].code;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
					var cities = provinceLocal[index].cities;
					var coties = [{
						name: provinceName,
						code: provinceCode,
						isProvince: 2,
					}, ...cities]
					this.pickEndCity = coties;
				} else {
					var cities = provinceLocal[index].cities;
					var coties = [{
						name: provinceName,
						code: provinceCode,
						isProvince: 1,
					}, ...cities]
					this.pickEndCity = coties;
				}
			},
			changeCity(index) {
				var provinceLocal = this.provinceLocal;
				var provinceName = provinceLocal[index].name;
				var provinceCode = provinceLocal[index].code;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
					var cities = provinceLocal[index].cities;
					var coties = [{
						name: provinceName,
						code: provinceCode,
						isFour: true,
					}, ...cities]
					this.pickStartCity = coties;
				} else {
					this.pickStartCity =  provinceLocal[index].cities
				}
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
			async toSendOrder() {
				//发布车源
				try{
					this.getUserInfo();
					console.log(this.publishParams, '参数');
					if (!this.publishParams.receiver || !this.publishParams.sender) {
						uni.showToast({
							title: '请选择装卸地',
							icon: 'none'
						})
						return;
					}
					if (!this.publishParams.carLength) {
						uni.showToast({
							title: '请选择车辆',
							icon: 'none'
						})
						return;
					}
					
					if (!ship.btnRepeat()) return;
					var publishParams = this.publishParams;
					console.log(publishParams, '参数发布')
					uni.showLoading({
						title: '发布中...',
					})
					var res = await ship.postRequest("/cy/carSource/add", publishParams);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '发布成功',
							icon: 'none'
						})
						publicData.setTabbarItem(1);
					} else {
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
			checkCar(item) { // 选择车辆
				console.log('选中的车辆', item);
				// this.checkedCar = item.sid;
				// this.publishParams.carModel = item.carModel;
				// this.publishParams.carLength = item.carLength;
				// this.publishParams.carCombo = item.carModel + '-' + item.carLength;
				if(this.checkedCar != item.sid) {
					let carObj = item.tagName.split('米');
					this.checkedCar = item.sid;
					this.publishParams.carModel = carObj[1];
					this.publishParams.carLength = carObj[0];
					this.publishParams.carCombo = carObj[0] + '-' + carObj[1];
				}
			},
		}
	}
</script>

<style lang="scss">
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
		display: none;
	}
	.sendSourcePage {
		height: 100vh;
		background-image: url('/static/images/loginHint/sendSourceBc.png');
		background-repeat: no-repeat;
		background-size: 100%;
		.pageHead {
			padding: 120rpx 0 0 38rpx;
			.backIcon {
				width: 16rpx;
				height: 30rpx;
			}
		}
		.largeTitle {
			font-size: 52rpx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 63rpx;
			letter-spacing: 2rpx;
			padding: 0 12rpx 0 38rpx;
			margin: 48rpx 0 54rpx 0;
			
		}
		.mainContent {
			font-size: 40rpx;
			color: #FFFFFF;
			line-height: 53rpx;
			letter-spacing: 4rpx;
			padding: 0 100rpx 0 38rpx;
		}
		.sendSourceBox {
			width: 678rpx;
			margin: 66rpx 36rpx 0 36rpx;
			padding: 54rpx 40rpx 54rpx 0;
			background-color: #FFF;
			border-radius: 16rpx;
			box-sizing: border-box;
			.sendAddressBox + .sendAddressBox {
				margin-top: 52rpx;
			}
			.sendAddressBox {
				display: flex;
				align-items: center;
				overflow: hidden;
				.title {
					font-size: 28rpx;
					color: #333333;
					line-height: 47rpx;
					margin-right:22rpx;
					width: 138rpx;
					text-align: right;
					flex-shrink: 0;
				}
				.content {
					width: 166rpx;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 8rpx;
					border: 2rpx solid #C5C5C5;
					box-sizing: border-box;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					text-align: center;
				}
				.dataGroup {
					display: flex;
					align-items: center;
					padding: 10rpx 0 10rpx 4rpx;
				}
				.scrollDataGroup {
					width:518rpx;
					display: -webkit-box;
					overflow-x: scroll;
					overflow-y: hidden;
					// white-space: nowrap;
				}
				.scrollDataGroup, .dataGroup {
					.carBtn {
						width: 156rpx;
					}
					.dataBtn + .dataBtn {
						margin-left: 20rpx;
					}
					.dataBtn {
						height: 44rpx;
						line-height: 44rpx;
						box-shadow: 0px 0px 12rpx 2rpx rgba(67,150,248,0.28);
						border-radius: 8rpx;
						font-size: 24rpx;
						font-weight: 400;
						text-align: center;
					}
					.checkedDataBtn {
						background: #4396F8;
						color: #FFFFFF;
					}
					.defaultDataBtn {
						background: #FFFFFF;
						color: #464646;
					}
				}
			}
			.car-source-info {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				margin-top: 60rpx;
				height: 46rpx;
				.title {
					font-size: 28rpx;
					color: #333333;
					line-height: 47rpx;
					width: 138rpx;
					text-align: right;
					flex-shrink: 0;
				}
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
			.car-source-long {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				margin-top: 60rpx;
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
		}
		.sendBtn {
			position: fixed;
			bottom: 130rpx;
			left: 175rpx;
			right: 175rpx;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 16rpx;
			background-color: #FFF;
			font-size: 32rpx;
			font-weight: 500;
			color: #0096EB;
			text-align: center;
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
		.alert-content {
			width: 100vw;
			height: 65vh;
			background-color: #FFFFFF;
			border-radius: 24rpx 24rpx 0 0;
			.swiper-box {
				height: 65vh;
				width: 100vw;
			}
			.swiper-content {
				display: flex;
				flex-direction: column;
				height: 65vh;
			}
			.alert-content-title {
				display: flex;
				flex-direction: row;
				position: relative;
				justify-content: center;
				align-items: center;
				color: rgba(51, 51, 51, 1);
				font-size: 40rpx;
				font-weight: 500;
				margin: 42rpx 0 36rpx;
				.back-black {
					position: absolute;
					z-index: 999999;
					right: 40rpx;
					width: 48rpx;
					height: 48rpx;
				}
			}
			.search-history-common {
				padding: 20rpx 46rpx 0;
				color: #333333;
				font-size: 32rpx;
			}
			.search-history {
				display: flex;
				flex-direction: column;
				.outLine {
					margin-top: 16rpx;
					height: 8rpx;
					background-color: rgba(240, 240, 240, 1);
					width: 100%;
				}
				.search-history-title {
					padding: 42rpx 36rpx 20rpx;
					box-sizing: border-box;
					color: #333333;
					font-size: 36rpx;
					&.endHistory {
						padding-top: 18rpx;
					}
					
				}
				.search-history-list {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					padding: 0 36rpx;
					box-sizing: border-box;
					width: 100vw;
					.search-history-item {
						width: 25%;
						padding: 0 24rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: row;
						margin-bottom: 30rpx;
						.search-item-inner {
							flex: 1;
							height: 56rpx;
							border-radius: 120rpx;
							background-color: #F3F3F3;
							color: #333333;
							font-size: 28rpx;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
				}
			}
			.search-extend {
				flex: 1;
				display: flex;
				flex-direction: column;
			}
			.scroller-content {
				height: calc(65vh - 214rpx);
				padding-left: 36rpx;
				box-sizing: border-box;
				&.end {
					height: calc(65vh - 254rpx);
				}
			}
			.search-result-list {
				height: calc(65vh - 214rpx);
				padding-left: 36rpx;
				box-sizing: border-box;
				&.end {
					height: calc(65vh - 254rpx);
				}
				.search-result-list-item {
					height: 100rpx;
					border-bottom: 1px solid #ECECEC;
					line-height: 100rpx;
					font-size: 32rpx;
					color: #333333;
				}
			}
			.search-content {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				height: 72rpx;
				border-radius: 16rpx;
				box-shadow: 0 0 14rpx 2rpx rgba(202, 222, 255, 0.34);
				margin: 0 36rpx;
				.car-search {
					width: 36rpx;
					margin-left: 12rpx;
				}
				.car-search-clear {
					width: 36rpx;
					margin: 0 26rpx;
				}
				.search-input {
					flex: 1;
					padding-left: 12rpx;
					height: 36rpx;
					font-size: 24rpx;
				}
			}
			.pick-content {
				width: 750rpx;
				flex: 1;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
			}
			.pick-view {
				height: 300rpx;
				width: 750rpx;
				.item {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 36rpx;
				}
			}
			.nextStep-step {
				height: 152rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: flex-end;
				box-sizing: border-box;
				padding-bottom: 50rpx;
				padding-top: 22rpx;
				
			}
			.nextStep {
				width: 400rpx;
				height: 80rpx;
				border-radius: 24rpx;
				color: #FFFFFF;
				font-size: 28rpx;
				background-color: #2973FA;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
