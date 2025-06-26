<template>
	<view class="addrPopUp">
		<!--地址删选-->
		<uni-popup ref="addrPopUp" type="bottom" :maskClick="false">
			<view class="alert-content">
				<swiper :current="currentIndex" class="swiper-box" :disable-touch="true">
					<swiper-item>
						<view class="swiper-content">
							<view class="alert-content-title">
								<image src="/static/images/ship/back-black.png" mode="widthFix" class="back-black" @click="goBack(0)"></image>
								<text>选择起始地</text>
							</view>
							<view class="search-content">
									<image src="/static/images/ship/car-source-search-icon.png" mode="widthFix" class="car-search"></image>
							
									<input type="text" v-model="startInputVal" @input="startInput" placeholder="请输入市/直辖市" class="search-input" />
								
									<image src="/static/images/ship/car-search-clear.png" mode="widthFix" class="car-search-clear" @click="clearStart"></image>
								
							</view>
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
									<picker-view :value="pickStartVal" @change="bindStartChange" class="pick-view">
										<picker-view-column>
											<view class="item" v-for="(item,index) in provinceLocal" :key="index">{{item.name}}</view>
										</picker-view-column>
										<picker-view-column>
											<view class="item" v-for="(item,index) in pickStartCity" :key="index">{{item.name}}</view>
										</picker-view-column>
									</picker-view> 
								</view>
								
								<view class="nextStep-step">
									<view @click="toConfirmStartSearch" class="nextStep">下一步</view>
								</view>
							</view>
							
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-content">
							<view class="alert-content-title">
								<image src="/static/images/ship/back-black.png" mode="widthFix" class="back-black" @click="goBack(1)"></image>
								<text>选择目的地</text>
							</view>
							<view class="search-content">
									<image src="/static/images/ship/car-source-search-icon.png" mode="widthFix" class="car-search"></image>
							
									<input type="text" v-model="arriveInputVal" @input="arriveInput"  placeholder="请输入市/直辖市" class="search-input" />
								
									<image src="/static/images/ship/car-search-clear.png" mode="widthFix" class="car-search-clear" @click="clearEnd"></image>
								
							</view>
							
							<view class="scroller-content" v-if="arriveInputVal">
								<scroll-view class="search-result-list" :scroll-y="true">
									<view class="search-result-list-item" v-for="item in searchArriveResultArr" @click="toSearchResult(item)">
										{{item.name}}
									</view>
								</scroll-view>
							</view>
							<view v-else class="search-extend">
								<!-- <view class="search-history-common" @click="toSearchCommon">全国</view> -->
														
								<view class="search-history" v-if="arriveHistory.length > 0">
									<view class="search-history-title">最近搜索</view>
									<view class="search-history-list">
										<view class="search-history-item" v-for="(item, index) in arriveHistory" @click="clickHistory(index, 1)">
											<view class="search-item-inner">{{item.name}}</view>
										</view>
									</view>
									<view class="outLine" />
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
									<view @click="toConfirmEndSearch" class="nextStep">下一步</view>
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
	import * as ship from "@/utils/ship"
	export default {
		name: 'carSearchAddr',
		props: {
		
		},
		data() {
			return {
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
			}
		},
		created() {
			console.log("生命周期created", "!1");
			//判断缓存中是否有地址
			var provinceLocal = uni.getStorageSync("provinceLocal");
			
			if (!provinceLocal) {
				this.getAllArea();
			} else {
				this.provinceLocal = JSON.parse(provinceLocal);
				//判断目的地是否是直辖
				var provinceName = this.provinceLocal[0].name;
				var provinceCode = this.provinceLocal[0].code;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
					var cities = this.provinceLocal[0].cities;
					var coties = [{
						name: provinceName,
						code: provinceCode,
					}]
					this.pickEndCity = coties;
					this.pickStartCity = coties;
				} else {
					var cities = this.provinceLocal[0].cities;
				
					this.pickEndCity = cities;
					this.pickStartCity = cities;
					
				}
			}
			
		},
		mounted() {
			
			
		},
		methods: {
			toConfirmEndSearch() {
				var that = this;
				this.pickEndConfirm[0] = this.pickEndVal[0];
				this.pickEndConfirm[1] = this.pickEndVal[1];
				var pickEndCity = this.pickEndCity;
				 //处理起始地址和经纬度
				 this.params.arriveAddr = pickEndCity[that.pickEndConfirm[1]];
				 this.currentIndex = 1;
				 this.hidePopUp();
				 this.$emit("toSearchResult", that.params);
				 setTimeout(() => {
					 that.clear();
				 }, 500)
			},
			toConfirmStartSearch() {
				var that = this;
				this.pickStartConfirm[0] = this.pickStartVal[0];
				this.pickStartConfirm[1] = this.pickStartVal[1];
				var pickStartCity = this.pickStartCity;
				 //处理起始地址和经纬度
				 this.params.startAddr = pickStartCity[that.pickStartConfirm[1]];
				 this.currentIndex = 1;
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
					}]
					
					this.pickEndCity = coties;
					
					
				} else {
				
					var cities = provinceLocal[index].cities;
					
					
					this.pickEndCity = cities;
					
					
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
					}]
					
					this.pickStartCity = coties;
				} else {
				
					this.pickStartCity =  provinceLocal[index].cities
					
					
				}
				
			},
			goBack(index) {
				if (index == 0) {
					this.clear();
					this.hidePopUp()
				} else {
					this.currentIndex = 0
				}
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
					//判断目的地
					var provinceName = provinceArr[0].name;
					var provinceCode = provinceArr[0].code;
					if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
						var cities = provinceArr[0].cities;
						var coties = [{
							name: provinceName,
							code: provinceCode,
						}]
						this.pickEndCity = coties;
						this.pickStartCity = coties;
					} else {
						var cities = provinceArr[0].cities;
						this.pickEndCity = cities;
						this.pickStartCity = cities;
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
				var startHistory = uni.getStorageSync("startSearchHistory");
				var arriveHistory = uni.getStorageSync("arriveSearchHistory");
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
						
					} else {
						cities.forEach(atem => {
							var name = atem.name;
							if (name.indexOf(val) > -1) {
								searchResultArr.push({
									name: name,
									code: atem.code
								})
							}
						})
					}
					
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
					} else {
						cities.forEach(atem => {
							var name = atem.name;
							if (name.indexOf(val) > -1) {
								searchResultArr.push({
									name: name,
									code: atem.code
								})
							}
						})
					}
				
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
				var findIndex = startHistory.findIndex(atem => {
					return atem.code == item.code
				})
				if (findIndex > -1) {
					startHistory.splice(findIndex, 1);
				}
				startHistory.unshift(item);
				if (startHistory.length > 6) {
					startHistory.splice(5);
				} 
				this.startHistory = startHistory;
				uni.setStorageSync("startSearchHistory", JSON.stringify(startHistory));
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
				if (arriveHistory.length > 6) {
					arriveHistory.splice(5);
				} 
				this.arriveHistory = arriveHistory;
				uni.setStorageSync("arriveSearchHistory", JSON.stringify(arriveHistory));
				
				
				setTimeout(() => {
					that.clear(); //搜索结束后初始化
				})
			},
			clear() {
				this.pickStartVal = [0, 0];
				this.pickEndVal = [0, 0];
				this.pickStartConfirm = [0, 0];
				this.pickEndConfirm = [0, 0];
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
					uni.setStorageSync("startSearchHistory", JSON.stringify(startHistory));
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
					uni.setStorageSync("arriveSearchHistory", JSON.stringify(arriveHistory));
					
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
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.alert-content {
		width: 100vw;
		height: 68vh;
		background-color: #FFFFFF;
		border-radius: 24rpx 24rpx 0 0;
		.swiper-box {
			height: 68vh;
			width: 100vw;
		}
		.swiper-content {
			display: flex;
			flex-direction: column;
			height: 68vh;
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
				left: 40rpx;
				top: 10rpx;
				width: 16rpx;
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
		.scroller-content {
			height: calc(65vh - 214rpx);
			padding-left: 36rpx;
			box-sizing: border-box;
		}
		.search-extend {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.search-result-list {
			height: calc(65vh - 214rpx);
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
			width: 750rpx;
			height: 300rpx;
			margin-top: 20rpx;
			.item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
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
</style>
