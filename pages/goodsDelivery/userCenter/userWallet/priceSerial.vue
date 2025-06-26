<template>
	<view class="priceSerial">
		<view class="walletHead">
			<view class="tradingType" @click="showPopup(1)">
				<view class="msg">{{typeVal == '全部' ? '全部交易类型' : typeVal}}</view>
				<image class="dropDownIcon" src="../../../../static/images/dropDown.png"></image>
			</view>
		</view>
		<view class="timeSelectBox">
			<view class="msg" @tap="showPopup(2)">{{timeDate ? timeDate : '请选择'}}</view>
			<image class="areaDownicon" src="../../../../static/images/goodsDelivery/icon_down.png"></image>
		</view>
		
		<!-- 流水列表 -->
		<view v-if="isNoData" class="noDataContent">
			<noData></noData>
		</view>
		<view class="container" v-else>
			<view class="serialList" v-for="(item, index) in listInfo" :key="index">
				<view class="content">
					<view class="title">{{item.opName}}</view>
					<view class="timeDate">{{item.createdDt}}</view>
				</view>
				<view class="price" :style="item.amount > 0 ? 'color: #F29347;' : 'color: #333;'">
					¥ {{showPrice(item.amount)}}
				</view>
			</view>
		</view>
		<uni-more-box :isMore="isNoMore" ></uni-more-box>
		<uni-popup ref="timePopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">请选择日期</text>
					<view class="cancelIconBox" @tap="closePopup(2)">
						<image class="cancelIcon" src="../../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="timeSelectVal" @change="timeChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item,index) in yearInfo" :key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in mounthInfo" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
				<view class="popupBtnGroup">
					<view class="comfirmBtn" @tap="selectTime()">确认</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="typePopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">请选择交易类型</text>
					<view class="cancelIconBox" @tap="closePopup(2)">
						<image class="cancelIcon" src="../../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="listWhole">
					<view class="list" v-for="(item, index) in typeArr">
						<view class="item" @click="switchIndex(index)" :class="{active: index == currentIndex}">{{item.name}}</view>
					</view>
					
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
	import noData from "@/components/noData";
	import UniMoreBox from "@/components/uni-morebox";
	export default {
		components: {
			noData,
			UniMoreBox
		},
		data() {
			return {
				typeVal: '全部交易类型',
				isNoData: false,
				isNoMore: "more",
				indicatorStyle: 'height:60rpx;',
				pageNum: 1,
				pageSize: 20,
				opType: '',
				listInfo: [],
				yearInfo: [],
				mounthInfo: [],
				timeSelectVal: [0,0],
				timeDate: '',
				typeArr: [],
					
				currentIndex: -1,
			};
		},
		onLoad() {
			uni.showLoading({
			    title: '加载中'
			});
			var userRole = uni.getStorageSync("userRole");
			if (userRole == 1) {
				this.typeArr = [
					{name: '全部', type: ''},
					{name: '提现', type: 5}, 
					{name: '充值', type: 1}, 
					{name: '支付-违约金', type: 2}, 
					{name: '收入-违约金', type: 3}, 
					// {name: '收入-信息费', type: 9},
					// {name: '支付-技术服务费', type: 6},
					{name: '支付-运费担保服务费', type: 7},
					{name: '支付-放空担保服务费', type: 10}, 
					{name: '支付-订金', type: 8},
					{name: '退回-订金', type: 11},
				]
			} else {
				this.typeArr = [
					{name: '全部', type: ''},
					{name: '提现', type: 5}, 
					{name: '充值', type: 1}, 
					{name: '支付-违约金', type: 2}, 
					{name: '收入-违约金', type: 3}, 
					{name: '收入-订金', type: 9},
					{name: '支付-技术服务费', type: 6},
					{name: '支付-担保服务费', type: 7}, 
					{name: '支付-订金', type: 8},
				]
			}
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			this.yearInfo = years;
			this.mounthInfo = months;
			var timeSelectVal = [years.length - 1, month - 1];
			this.timeSelectVal = timeSelectVal;
			this.timeDate = years[timeSelectVal[0]] + '-' + months[timeSelectVal[1]]
			this.getCapitalDetail("refresh");
			this.$forceUpdate()
		},
		
		onShow() {
			
		},
		onPullDownRefresh() {
			this.pageNum = 1;
			this.getCapitalDetail('refresh');
		},
		onReachBottom() {
			if (this.isNoMore == "noMore" || this.isNoData) {
				return
			}
			this.pageNum ++;
			this.getCapitalDetail('more');
			
		},
		methods: {
			getCapitalDetail(type) {
				var timeSelectVal = this.timeSelectVal;
				var years = this.yearInfo;
				var months = this.mounthInfo;
				var month = parseInt(months[timeSelectVal[1]], 10); 
				var year = years[timeSelectVal[0]];
				var date = year +'-' + month + '-1' + ' ' + '23:59:59';
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					createdDt: date,
					opType: this.opType ? this.opType : undefined
				}
				console.log(params, '日期111')
				let that = this;
				utils.postRequest('/dw/wallet/capitalDetail', params)
				.then(res=>{
					console.log('钱包', res);
					if(res.retCode == '0000000') {
						var items = res.rspBody.items;
						if (type == 'refresh') {
							if (items.length == 0) {
								that.isNoData = true;
								that.isNoMore = "more";
							} else {
								that.isNoData = false
								that.isNoMore = items.length < this.pageSize ? "noMore" : "more";
							}
							that.listInfo = res.rspBody.items;
							uni.stopPullDownRefresh();
						} else {
							that.isNoData = false
							that.isNoMore = items.length < this.pageSize ? "noMore" : "more";
							
							that.listInfo = that.listInfo.concat(res.rspBody.items);
							uni.stopPullDownRefresh();
						}
						
					}else {
						uni.stopPullDownRefresh();
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.stopPullDownRefresh();
					uni.hideLoading();
					console.log(err);
				})
			},
			offerTimeChange(e) { // 报价时长滑动
				console.log(e);
				this.timeSelectVal = e.detail.value;
			},
			selectTime() { // 日期筛选
				var  timeSelectVal = this.timeSelectVal;
				var years = this.yearInfo;
				var months = this.mounthInfo;
				this.timeDate = years[timeSelectVal[0]] + '-' + months[timeSelectVal[1]]
				this.$refs.timePopup.close()
				uni.showLoading({
					title: '加载中'
				})
				this.pageNum = 1;
				this.getCapitalDetail('refresh');
			},
			selectType() {
				this.$refs.typePopup.close();
				var typeArr = this.typeArr;
				var currentIndex = this.currentIndex;
				this.typeVal = typeArr[currentIndex].name
				uni.showLoading({
					title: '加载中'
				})
				this.pageNum = 1;
				this.getCapitalDetail('refresh');
			},
			showPopup(flag) { // 打开弹窗
				switch(flag) {
					case 1:
						this.$refs.typePopup.open()
						break;
					case 2:
						this.$refs.timePopup.open()
						break;
				}
			},
			closePopup(flag) { // 关闭弹窗
				switch(flag) {
					case 1:
						this.$refs.restrictedZonePopup.close()
						break;
					case 2:
						this.$refs.timePopup.close()
						break;
				}
			},
			switchIndex(index) {
				var currentIndex = this.currentIndex;
				var typeArr = this.typeArr;
				if (currentIndex == index) {
			
				} else {
					this.currentIndex = index;
					this.opType = typeArr[index].type;
				}
			},
			timeChange(e) {
				console.log(e, '参数');
				this.timeSelectVal = e.detail.value;
				
			},
			showPrice(price) { // 金额展示
				var priceStr = price.toString();
				if (priceStr.indexOf("-") > -1) {
					return publicData.showPrice(price, 1000)
				} else {
					return  '+' + publicData.showPrice(price, 1000);
				}
			},
			toBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.priceSerial {
		min-height: 100vh;
		background-color: #FFF;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: border-box;
		.walletHead {
			.tradingType {
				padding: 40rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				.msg {
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
				}
				.dropDownIcon {
					width: 18rpx;
					height: 11rpx;
					margin-left:8rpx;
				}
			}
		}
		.timeSelectBox {
			height: 62rpx;
			padding: 0 20rpx;
			background: #F3F3F3;
			display: flex;
			align-items: center;
			.msg {
				font-size: 26rpx;
				color: #AAAAAA;
			}
			.areaDownicon {
				width: 32rpx;
				height: 32rpx;
				margin-left: 12rpx;
			}
		}
		.serialList {
			height: 132rpx;
			margin: 0 0 0 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid rgba(217, 217, 217, 0.85);
			.content {
				.title {
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
				}
				.timeDate {
					font-size: 24rpx;
					color: #AAAAAA;
					line-height: 34rpx;
					margin-top:12rpx;
				}
			}
			.price {
				font-size: 32rpx;
				line-height: 44rpx;
				padding-right:32rpx;
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
	.picker-view {
		height: 300rpx;
		.item {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.listWhole {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		padding: 0 22rpx 20rpx;
		.list {
			width: 33.33%;
			height: 124rpx;
			padding: 8rpx;
			box-sizing: border-box;
			
			.item {
				height: 100%;
				border-radius: 12rpx;
				border: 1px solid #777777;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #777777;
				font-size: 28rpx;
				&.active {
					background-color: #4AA2F3;
					color: #FFFFFF;
				}
			}
		}
	}
	.noDataContent {
		height: calc(100vw - 100rpx);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.container {
		margin-bottom: 40rpx;  
	}
</style>
