<template>
	<view class="container">
		<view class="searchItem">
			<view class="label">装货地</view>
			<view class="inputVal" @click="showPopUp(1)">
				<view v-if="startAddr.length > 0">
					<text class="addr">{{showAddr(startAddr)}}</text>
				</view>
				<view v-else>
					<text>请选择装货地</text>
				</view>
				<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
			</view>
		</view>
		<view class="searchItem">
			<view class="label">卸货地</view>
			<view class="inputVal" @click="showPopUp(2)">
				<view v-if="arriveAddr.length > 0">
					<text class="addr">{{showAddr(arriveAddr)}}</text>
				</view>
				<view v-else>
					<text>请选择卸货地</text>
				</view>
				<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
			</view>
		</view>
		<view class="searchItem">
			<view class="label">发布日期</view>
			<view class="inputVal" @click="showPopUp(3)">
				<view v-if="dateStr">
					<text class="addr">{{dateStr}}</text>
				</view>
				<view v-else>
					<text>请选择发布日期</text>
				</view>
				<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
				
			</view>
		</view>
		<view class="searchBtn">
			<view class="btnItem reset" @click="reset">重置</view>
			<view class="btnItem find" @click="find">查询</view>
		</view>
		<uni-popup ref="startPopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">选择地区</text>
					<view class="cancelIconBox" @tap="closePopup()">
						<image class="cancelIcon" src="../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="listWhole">
					<picker-view   :value="goodsVal" @change="bindGoodsChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in provinceArr" :key="index">{{item.name}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in cityArr" :key="index">{{item.name}}</view>
						</picker-view-column>
					</picker-view>
					
				</view>
				<view class="popupBtnGroup">
					<view class="comfirmBtn" @tap="selectType()">确认</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="datePopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">选择日期</text>
					<view class="cancelIconBox" @tap="closePopup()">
						<image class="cancelIcon" src="../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="listWhole">
					<picker-view   :value="dateValue" @change="bindDateChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in years" :key="index">{{item}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in months" :key="index">{{item}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in days" :key="index">{{item}}</view>
						</picker-view-column>
					</picker-view>
					
				</view>
				<view class="popupBtnGroup">
					<view class="comfirmBtn" @tap="selectType()">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				provinceArr: [],
				cityArr: [],
				areaArr: [],
				goodsVal: [0, 0],
				startAddr: [],
				arriveAddr: [],
				addrType: 1,
				years: [],
				months: [],
				days: [],
				dateValue: [],
				dateStr: '',
			}
		},
		onLoad(options) {
			console.log(options, '参数')
			if (options.searchParams) {
				var searchParams = JSON.parse(options.searchParams);
				console.log(searchParams, '参数')
				var goodsVal = this.goodsVal;
				var dateStr = searchParams.dateStr;
				var startAddr = searchParams.startAddr;
				var arriveAddr = searchParams.arriveAddr;
				this.dateStr = dateStr;
				this.startAddr = startAddr;
				this.arriveAddr = arriveAddr;
				console.log(this.startAddr, this.arriveAddr, 'asasa');
			}
			
			this.init();
			
			
		},
		methods: {
			async init() {
				try{
					//获取日期
				
					const date = new Date()
					const years = []
					const year = date.getFullYear()
					const months = []
					const month = date.getMonth() + 1
					const days = []
					const day =  date.getDate()
					for (let i = 1990; i <= date.getFullYear(); i++) {
						years.push(i)
					}
					for (let i = 1; i <= 12; i++) {
						months.push(i)
					}
					
					var dayNum = this.getDaysInMonth(year, month);
					for (let i = 1; i <= dayNum; i++) {
						days.push(i)
					}
					
					
					this.years = years
					this.year = year;
					this.months = months
					this.month = month
					this.days = days
					this.day = day
					console.log(year, month, day, 'aaaa')
					this.dateValue = [year - 1990, month - 1, day - 1];
					this.$forceUpdate()
					
					//初始化装卸货地，日期删选条件
					var result = await ship.postRequest("/ts/nationDict/getBasicData");
					var provinceArr = result.rspBody;
					var cityArr = provinceArr[0].cities
					this.provinceArr = provinceArr;
					this.cityArr = cityArr;
					console.log(provinceArr[0].name, cityArr[0].name,areaArr[0].name, 'asas')
					this.$forceUpdate()
				}catch(e){
					console.log(e)
					//TODO handle the exception
				}
			},
			initDate(yea, mont, day) {
				console.log(yea, mont)
				const date = new Date()
				const years = []
				const year = yea !== undefined ? yea : date.getFullYear()
				const months = []
				const month = mont !== undefined ? mont : date.getMonth() + 1
				const days = [];
				var day;
				if (day) {
					day = day
				} else {
					day = mont !== undefined ? 1 : date.getDate()
				}
				for (let i = 1990; i <= date.getFullYear(); i++) {
					years.push(i)
				}
				for (let i = 1; i <= 12; i++) {
					months.push(i)
				}
				if (yea && mont) {
					var dayNum = this.getDaysInMonth(yea, mont);
					for (let i = 1; i <= dayNum; i++) {
						days.push(i)
					}
				} else {
					for (let i = 1; i <= 31; i++) {
						days.push(i)
					}
				}
				
				
				this.years = years
				this.year = year;
				this.months = months
				this.month = month
				this.days = days
				this.day = day
				console.log(year, month, day, 'aaaa')
				this.dateValue = [year - 1990, month - 1, day - 1];
				this.$forceUpdate()
			},
			getDaysInMonth(year, month) { 
			    let date = new Date(year, month, 1); 
			    return new Date(date.getTime() - 864e5).getDate(); 
			},
			closePopup() {
				if (this.addrType !== 3) {
					this.$refs.startPopup.close();
				} else {
					this.$refs.datePopup.close();
				}
				
			},
			showPopUp(index) {
				this.addrType = index;
				if (index !== 3) {
					// this.goodsVal = [0, 0, 0];
					this.$refs.startPopup.open();
				} else {
					this.$refs.datePopup.open();
				}
			
				
			},
			bindDateChange(e) {
				
				//日期更新
				console.log(e)
				var dateValue = this.dateValue;
				var dateVal = e.detail.value;
				console.log(dateValue, dateVal)
				var years = this.years;
				var months = this.months;
				var days = this.days;
				if (dateValue[0] !== dateVal[0]) {
					this.initDate(years[dateVal[0]], 1);
				} else if (dateValue[1] !== dateVal[1]) {
					this.initDate(years[dateVal[0]], months[dateVal[1]]);
				} else if (dateValue[2] !== dateVal[2]) {
					this.initDate(years[dateVal[0]], months[dateVal[1]], days[dateVal[2]]);
				}
				this.$forceUpdate();
			},
			bindGoodsChange(e) {
				console.log(e)
				var provinceArr = this.provinceArr;
				var goodsVal = this.goodsVal;
				var val = e.detail.value;
				var proIndex = val[0];
				var cityIndex = val[1];
				if (goodsVal[0] !== proIndex) {
					this.cityArr = provinceArr[proIndex].cities;
					this.goodsVal = [proIndex, 0]
				} else if (goodsVal[1] !== cityIndex) {
					this.goodsVal = [proIndex, cityIndex]
				} else {
					this.goodsVal = [proIndex, cityIndex]
				}
			},
			showAddr(addr) {
				var str = [];
				addr.forEach(item => {
					str.push(item.name)
				})
				return str.join("-")
			},
			selectType() {
				var index = this.addrType;
				this.closePopup();
				if (index == 1) {
					//装货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					this.startAddr = [{
						name: provinceArr[goodsVal[0]].name,
						code: provinceArr[goodsVal[0]].code
					},{
						name: cityArr[goodsVal[1]].name,
						code: cityArr[goodsVal[1]].code
					}]
				} else if (index == 2) {
					//表示是卸货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					
					this.arriveAddr = [{
						name: provinceArr[goodsVal[0]].name,
						code: provinceArr[goodsVal[0]].code
					},{
						name: cityArr[goodsVal[1]].name,
						code: cityArr[goodsVal[1]].code
					}]
				} else {
					//日期选择
					var year = this.year;
					var month = this.month;
					var day = this.day;
					this.dateStr = year + '-' + month + '-' + day;
				}
			},
			reset() {
				this.startAddr = [];
				this.arriveAddr = [];
				this.dateStr = "";
				this.goodsVal = [0, 0, 0];
				this.initDate();
				this.find();
			},
			find() {
				var dateStr = this.dateStr;
				var arriveAddr = this.arriveAddr;
				var startAddr = this.startAddr;
				var params = new Object();
				if (dateStr) {
					params.pushTime = dateStr
				}
				if (startAddr.length > 0) {
					params.loadProvinceCode = startAddr[0].code;
					params.loadCityCode = startAddr[1].code;
				}
				if (arriveAddr.length > 0) {
					params.unloadProvinceCode = arriveAddr[0].code;
					params.unloadCityCode = arriveAddr[1].code;
				}
				console.log(params, 'asas')
				uni.navigateBack({
					delta: 1
				})
				var data = {
					startAddr: startAddr,
					arriveAddr: arriveAddr,
					dateStr: dateStr,
				}
				setTimeout(() => {
					uni.$emit("search_index", params, data);
				}, 500)
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		padding: 20rpx 40rpx;
		.searchItem {
			height: 76rpx;
			width: calc(100vw - 80rpx);
			border: 1px solid #979797;
			border-radius: 24rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 28rpx;
			margin-bottom: 24rpx;
			.label {
				font-size: 28rpx;
				color: #222222;
				font-weight: 500;
			}
			.inputVal {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				color: #AAAAAA;
				font-size: 28rpx;
				.addr {
					color: #333333;
				}
				.arrow_down {
					width: 34rpx;
					height: 30rpx;
					padding-left: 10rpx;
				}
			}
		}
		.searchBtn {
			height: 72rpx;
			width: calc(100vw - 80rpx);
			border-radius: 36rpx;
			display: flex;
			overflow: hidden;
			margin-top: 8rpx;
			.btnItem {
				flex: 1;
				width: 100rpx;
				height: 72rpx; 
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #FFFFFF;
				&.reset {
					background-color: #F29347;
				}
				&.find {
					background-color: #4AA2F3;
				}
			}
		}
	}
	.bottomPopupBox {
		background: #FFFFFF;
		border-radius: 36rpx 36rpx 0px 0px;
		overflow: hidden;
		.popupHead {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 36rpx;
			.title {
				height: 110rpx;
				line-height: 110rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}
			.cancelIconBox {
				height: 110rpx;
				width: 110rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.cancelIcon {
					width:18rpx;
					height: 18rpx;
				}
			}
		}
		.picker-view {
			height: 400rpx;
			.item {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.popupBtnGroup {
			padding: 24rpx 36rpx;
			.comfirmBtn {
				height: 96rpx;
				line-height: 96rpx;
				background: #4AA2F3;
				border-radius: 48rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
</style>
