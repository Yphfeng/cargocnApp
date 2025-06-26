<template>
	<view class="indexSearch">
		<view class="topPopupBox">
			<view class="item">
				<view class="label">装货地</view>
				<view class="selectWhole" @click="showPopUp(1)">
					
					<view v-if="startAddr.length > 0">
						<text class="addr">{{showAddr(startAddr)}}</text>
					</view>
					<view v-else>
						<text>请选择装货地</text>
					</view>
					<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
				</view>
			</view>
			<view class="item">
				<view class="label">卸货地</view>
				<view class="selectWhole" @click="showPopUp(2)">
					<view v-if="arriveAddr.length > 0">
						<text class="addr">{{showAddr(arriveAddr)}}</text>
					</view>
					<view v-else>
						<text>请选择卸货地</text>
					</view>
					<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
				</view>
			</view>
			<!-- <view class="item">
				<view class="label">发布日期</view>
				<view class="selectWhole">
					<picker mode="date" fields="day" :value="createdDt" :start="startDate" :end="endDate" @change="bindDateChange">
						<view :class="createdDt ? 'addr' : ''">{{createdDt ? createdDt : '请选择发布时间'}}</view>
					</picker>
					<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
				</view>
			</view> -->
			<view class="item">
				<view class="label">发布日期</view>
				<view class="selectWhole">
					<uni-datetime-picker
					    type="date"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择发布时间'"
					    v-model="createdDt"
					    @change="changeLog"
						style="text-align: right;color:#333;"
					/>
					<image src="../../../static/images/arrow_down.png" class="arrow_down"></image>
				</view>
			</view>
			<view class="popupBtnGroup">
				<view class="btnItem reset" @tap="reset()">重置</view>
				<view class="btnItem find" @tap="find()">查询</view>
			</view>
		</view>
		
		<uni-popup ref="startPopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">选择地区</text>
					<view class="cancelIconBox" @tap="closePopup()">
						<image class="cancelIcon" src="../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="listAlertWhole">
					<picker-view   :value="goodsVal" @change="bindGoodsChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in provinceArr" :key="index">{{item.name}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in cityArr" :key="index">{{item.name}}</view>
						</picker-view-column>
						<!-- <picker-view-column>
							<view class="item" v-for="(item,index) in areaArr" :key="index">{{item.name}}</view>
						</picker-view-column> -->
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
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	export default {
		data() {
			return {
				popupObj: {},
				popupKey: '',
				provinceArr: [],
				cityArr: [],
				areaArr: [],
				goodsVal: [0, 0, 0],
				startAddr: [],
				arriveAddr: [],
				timeArr: [],
				addrType: 1,
				params: {
					sendAddress: [],
					receiverAddress: [],
					createdDt: '',
				},
				createdDt: '',
			};
		},
		onLoad() {
			this.getAreaData();
			if(getApp().globalData.indexSearchObj) {
				this.params = getApp().globalData.indexSearchObj;
				if(this.params.sendAddress.length > 0) {
					this.startAddr = this.params.sendAddress;
				}
				if(this.params.receiverAddress.length > 0) {
					this.arriveAddr = this.params.receiverAddress;
				}
				if(this.params.createdDt) {
					this.createdDt = this.params.createdDt;
				}
			}
		},
		onShow() {
			
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			changeLog(e) {
			    this.createdDt = e;
			    console.log("选择的起运时间:", e);
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindDateChange: function(e) {
			    this.createdDt = e.target.value;
				console.log(this.createdDt);
			},
			async getAreaData() {
				var result = await utils.postRequest("/ts/nationDict/getBasicData");
				var provinceArr = result.rspBody;
				for(let i in provinceArr) {
					if(provinceArr[i].code == '310000' || provinceArr[i].code == '110000' || provinceArr[i].code == '500000' || provinceArr[i].code == '120000') {
						console.log(provinceArr[i]);
						let obj = {
							"code": provinceArr[i].code,
							"name": "全市",
							"areas": []
						}
						provinceArr[i].cities.unshift(obj);
					}
				}
				var cityArr = provinceArr[0].cities
				var areaArr = provinceArr[0].cities[0].areas
				this.provinceArr = provinceArr;
				this.cityArr = cityArr;
				this.areaArr = areaArr;
			},
			showPopUp(index) {
				this.addrType = index;
				if (index !== 3) {
					this.goodsVal = [0, 0, 0];
					this.$refs.startPopup.open();
				}
			},
			showAddr(addr) {
				var str = [];
				addr.forEach(item => {
					str.push(item.name)
				})
				return str.join("-")
			},
			bindGoodsChange(e) {
				console.log(e)
				var provinceArr = this.provinceArr;
				var goodsVal = this.goodsVal;
				var val = e.detail.value;
				var proIndex = val[0];
				var cityIndex = val[1];
				var areaIndex = val[2];
				if (goodsVal[0] !== proIndex) {
					this.cityArr = provinceArr[proIndex].cities;
					this.areaArr = provinceArr[proIndex].cities[0].areas
					this.goodsVal = [proIndex, 0, 0]
				} else if (goodsVal[1] !== cityIndex) {
					this.areaArr = provinceArr[proIndex].cities[cityIndex].areas;
					this.goodsVal = [proIndex, cityIndex, 0]
				} else {
					this.goodsVal = [proIndex, cityIndex, areaIndex]
				}
			},
			selectType() {
				var index = this.addrType;
				this.closePopup();
				if (index == 1) {
					//装货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					var areaArr = this.areaArr;
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
					var areaArr = this.areaArr;
					this.arriveAddr = [{
						name: provinceArr[goodsVal[0]].name,
						code: provinceArr[goodsVal[0]].code
					},{
						name: cityArr[goodsVal[1]].name,
						code: cityArr[goodsVal[1]].code
					}]
				
				} else {
					
				}
			},
			reset() {
				this.startAddr = [];
				this.arriveAddr = [];
				this.createdDt = '';
				this.goodsVal = [0, 0, 0];
				this.params = {
					sendAddress: this.startAddr,
					receiverAddress: this.arriveAddr,
					createdDt: '',
				}
			},
			find() {
				if(!utils.btnRepeat()) return false; // 防抖
				var startAddr = this.startAddr;
				var arriveAddr = this.arriveAddr;
				var params = this.params;
				if(startAddr.length == 0 && arriveAddr.length == 0 && !this.createdDt) {
					getApp().globalData.indexSearchObj = undefined;
				}else {
					if(startAddr.length > 0) {
						this.params.sendAddress = startAddr;
					}
					if(arriveAddr.length > 0) {
						this.params.receiverAddress = arriveAddr;
					}
					if(this.createdDt) {
						this.params.createdDt = this.createdDt;
					}
					getApp().globalData.indexSearchObj = this.params;
				}
				uni.switchTab({
					url: './index'
				})
				uni.$emit("search_index");
			},
			closePopup() {
				if (this.addrType !== 3) {
					this.$refs.startPopup.close();
				}
				
			},
		}
	}
</script>

<style lang="scss">
	.indexSearch {
		.topPopupBox {
			background: #FFFFFF;
			overflow: hidden;
			padding: 20rpx 40rpx 40rpx;
			display: flex;
			flex-direction: column;
			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 76rpx;
				border: 1px solid #979797;
				border-radius: 24rpx;
				box-sizing: border-box;
				margin-bottom: 24rpx;
				padding: 0 28rpx;
				.label {
					color: #222222;
					font-weight: 500;
					font-size: 28rpx;
				}
				.selectWhole {
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
						width: 30rpx;
						height: 30rpx;
					}
					.uni-icons {
						display: none !important;
					}
					.uni-date-x {
						padding: 0 !important;
					}
					.uni-date__x-input {
						height: 56rpx !important;
						line-height: 56rpx !important;
						padding: 0 !important;
						font-size: 28rpx !important;
					}
					.input-placeholder {
						font-size: 28rpx !important;
						color: #AAAAAA !important;
					}
					.uni-input-input {
						color:#333;
					}
				}
			}
			.popupBtnGroup {
				padding: 0;
				margin-top: 8rpx;
				display: flex;
				overflow: hidden;
				border-radius: 36rpx;
				.btnItem {
					flex: 1;
					height: 72rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					display: flex;
					justify-content: center;
					align-items: center;
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
	}
</style>
