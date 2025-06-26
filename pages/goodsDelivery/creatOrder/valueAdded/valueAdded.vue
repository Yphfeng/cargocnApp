<template>
	<view class="valueAdded">
		<view class="inputBox">
			<view class="leftTitle">Test装卸时间<text class="titleHint">*</text></view>
			<view class="goodsContent" @tap="showTimePopup()">
				<text class="contentMsg" v-if="!newLoadTimeMsg" style="font-size: 28rpx;color:#C2C2C9;">请填写</text>
				<view class="loadTimeMsgBox" v-if="newLoadTimeMsg">
					<view class="loadTimeMsg">{{newLoadTimeMsg}}</view>
				</view>
				<image class="arrowIcon" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		
		<view class="footBtnGroup">
			<view class="externalBtn" @tap="openConfirmPopup()">submit</view>
		</view>
		
		<!-- 时间选择弹窗 -->
		<uni-popup ref="timePopup" type="bottom">
			<view class="timeBottomPopupBox">
				<view class="popupHead">
					<text class="title">请选择装货时间</text>
					<view class="cancelIconBox" @tap="closeTimePopup()">
						<image class="cancelIcon" src="../../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="timePopup">
					<scroll-view class="leftCol" scroll-y="true">
						<view
							class="monthBox"
							v-for="(item, index) in monthData"
							:key="index"
							@tap="checkmonth(index)"
							:style="monthCheckVal == index ? 'background-color:#FFF;color:#4AA2F3;' : 'background-color:#F3F3F3;color:#777;'">
							{{showYearMsg(index, item.label, item.dateType)}}
						</view>
					</scroll-view>
					<scroll-view class="rightCol" scroll-y="true">
						<view
							class="hourBox"
							v-for="(item, index) in hourData"
							:key="index"
							@tap="chooseHour(index)"
							v-if="showHours(item)">
							<text class="msg" :style="startCheckedMonth == monthCheckVal && startHourCheckVal == index ? 'color:#4AA2F3;font-size: 30rpx;' : 'color:#333;font-size: 28rpx;'">{{item.hour}}{{item.syb}}{{item.min}}</text>
							<image v-show="startCheckedMonth == monthCheckVal && startHourCheckVal == index" class="checkHourIcon" src="../../../../static/images/goodsDelivery/checkHour.png"></image>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				// 以下为测试装卸时间模块
				newLoadTimeMsg: '',
				monthCheckVal: '0',
				monthData: [],
				hourData: [{
					hour: '全天',
					syb: '',
					min: ''
				}, {
					hour: '上午6:00-12:00',
					syb: '',
					min: ''
				}, {
					hour: '下午12:00-18:00',
					syb: '',
					min: ''
				}, {
					hour: '晚上18:00-24:00',
					syb: '',
					min: ''
				}],
				nowHours: 0, // 当前时间
				startCheckedMonth: '0',
				startHourCheckVal: '0',
			};
		},
		onLoad() {
			this.getDateInfo(); // 小时数据直接获取
		},
		onShow() {
			
		},
		methods: {
			showTimePopup() { // 展示装卸时间弹唱
				this.$refs.timePopup.open();
			},
			closeTimePopup() {
				this.$refs.timePopup.close();
			},
			getDateInfo() { // 获取日期时间数据
				var date1 = new Date();
				// console.log(date1);
				for(let i = 0, maxData = 5; i < maxData; i++) { // 装货时间长度限制5天
					let date2 = new Date(date1);
					date2.setDate(date1.getDate() + i);
					let year = date2.getFullYear() + '';
					let month = (date2.getMonth() + 1);
					month = month < 10 ? '0' + month : month;
					let date = date2.getDate();
					date = date < 10 ? '0' + date : date;
					let timeData = year + '年' + month + '月' + date + '日';
					let monthObj = {
						label: timeData
					}
					this.monthData.push(monthObj);
				}
				this.nowHours = date1.getHours();
				// console.log('当前', this.nowHours);
				let obj = { // today,tomorrow
					label: "今天或明天",
					dateType: 'tt'
				}
				this.monthData.splice(1, 0, obj);
				// if(this.nowHours == 24) {
				// 	this.monthData.splice('0', 1);
				// 	this.monthData.unshift(obj);
				// }else {
				// 	this.monthData.splice(1, 0, obj);
				// }
				
				// console.log('年月日数据', this.monthData);
				for(let i = 0; i < 25; i++) {
					let hours = i < 10 ? '0' + i : i;
					let monthObj1 = {
						hour: hours,
						syb: ':',
						min: '00'
					}
					this.hourData.push(monthObj1);
				}
				let monthMsg = this.showYearMsg(this.startCheckedMonth, this.monthData[this.startCheckedMonth].label);
				this.newLoadTimeMsg = monthMsg + ' ' + this.hourData[this.startHourCheckVal].hour + this.hourData[this.startHourCheckVal].syb + this.hourData[this.startHourCheckVal].min;
			},
			showYearMsg(key, year) { // 删除年份前2位
				// console.log(key);
				let msg;
				switch(Number(key)) {
					case 0:
						msg = '今天';
						return msg;
					case 1:
						return year;
					case 2:
						msg = '明天' + year.slice(5);
						return msg;
					case 3:
						msg = '后天' + year.slice(5);
						return msg;
					case 4:
						return year.slice(5);
					case 5:
						return year.slice(5);
				}
			},
			showHours(item) { // 若选择今天，则不展示小于当前小时的数据
				if(this.nowHours == 24) {
					return true;
				}
				if(!item.syb) {
					if(this.monthCheckVal == '0') {
						let timeMsg = item.hour.substring(0,2);
						switch(timeMsg) {
							case '上午':
								if(this.nowHours > 12) {
									return false;
								}else {
									return true;
								}
								break;
							case '下午':
								if(this.nowHours > 18) {
									return false;
								}else {
									return true;
								}
								break;
							case '晚上':
								if(this.nowHours > 23) {
									return false;
								}else {
									return true;
								}
							default:
								return true;
						}
					}else if(this.monthCheckVal == '1') {
						if(item.hour == '全天') {
							return true;
						}else {
							return false;
						}
					}else {
						return true;
					}
				}else {
					if(this.monthCheckVal == '0') {
						if(item.hour < this.nowHours) {
							return false;
						}else {
							if(item.hour > this.nowHours) {
								return true;
							}else {
								return false;
							}
						}
					}else if(this.monthCheckVal == '1') {
						return false;
					}else  {
						return true;
					}
				}
			},
			chooseHour(key) { // 选择时分
				var platform = uni.getSystemInfoSync().platform;
				
				let startTime;
				startTime = this.monthData[this.monthCheckVal].label + ' ' + this.hourData[key].hour + ':' + this.hourData[key].min;
				startTime = startTime.replace(/年/, '-');
				startTime = startTime.replace(/月/, '-');
				startTime = startTime.replace(/日/, '');
				startTime = startTime + ':00';
				if (platform == "ios") { // 低版本的Safari无法解析new Date('XXXX-XX-XX')，但可以解析new Date('XXXX/XX/XX')格式的时间所以需要把“-”替换为“/”。
					startTime = startTime.replace(/-/g, '/');
				}
				let date = new Date(startTime);
				this.checkHour(key);
				this.$refs.timePopup.close();
			},
			checkHour(checkedKey) { // 匹配时分数据
				// console.log(checkedKey);
				// console.log(this.monthCheckVal);
				// console.log(this.startCheckedMonth);
				// if(this.startHourCheckVal != key) {
					
				// }
				this.startHourCheckVal = checkedKey.toString();
				this.startCheckedMonth = this.monthCheckVal;
				let monthMsg = this.showYearMsg(this.startCheckedMonth, this.monthData[this.startCheckedMonth].label);
				this.newLoadTimeMsg = monthMsg + ' ' + this.hourData[this.startHourCheckVal].hour + this.hourData[this.startHourCheckVal].syb + this.hourData[this.startHourCheckVal].min;
				console.log(this.newLoadTimeMsg);
			},
			checkmonth(key) { // 选择月日
				if(this.monthCheckVal != key) {
					this.monthCheckVal = key;
				}
			},
			openConfirmPopup() {
				console.log('年==>', this.monthData[this.startCheckedMonth].label);
				console.log('时==>', this.hourData[this.startHourCheckVal].hour);
				console.log('分==>', this.hourData[this.startHourCheckVal].min);
				let startDate, endDate;
				if(this.monthData[this.startCheckedMonth].dateType == 'tt') { // 今天或明天
					startDate = this.monthData['0'].label + ' 00:00:00';
					endDate = this.monthData['2'].label + ' 23:59:59';
					let submitAry = {
						"startDt": this.changeDate(startDate),
						"serialnumber": 1,
						"endDt": this.changeDate(endDate)
					};
					console.log('选择的日期=>', submitAry);
				}else {
					if(this.hourData[this.startHourCheckVal].syb) {
						startDate = this.monthData[this.startCheckedMonth].label + ' ' + this.hourData[this.startHourCheckVal].hour + ':00';
						endDate = this.monthData[this.startCheckedMonth].label + ' ' + this.hourData[this.startHourCheckVal].hour + ':00';
						let submitAry = {
							"startDt": this.changeDate(startDate),
							"serialnumber": 1,
							"endDt": this.changeDate(endDate)
						};
						console.log('选择的日期=>', submitAry);
					}else { // 全天或上午、下午、晚上时间范围区间
						let checkedHour = this.hourData[this.startHourCheckVal].hour;
						if(checkedHour.length == 2) { // 全天
							startDate = this.monthData[this.startCheckedMonth].label + ' 00:00:00';
							endDate = this.monthData[this.startCheckedMonth].label + ' 23:59:59';
							let submitAry = {
								"startDt": this.changeDate(startDate),
								"serialnumber": 1,
								"endDt": this.changeDate(endDate)
							};
							console.log('选择的日期=>', submitAry);
						}else { // 上午、下午、晚上时间范围区间
							let hour = checkedHour.slice(2);
							let hourAry = hour.split('-');
							startDate = this.monthData[this.startCheckedMonth].label + ' ' + hourAry['0'] + ':00';
							endDate = this.monthData[this.startCheckedMonth].label + ' ' + hourAry['1'] + ':00';
							let submitAry = {
								"startDt": this.changeDate(startDate),
								"serialnumber": 1,
								"endDt": this.changeDate(endDate)
							};
							console.log('选择的日期=>', submitAry);
						}
					}
				}
			},
			changeDate(str) {
				let dateMsg = str.replace(/年/g, '-');
				dateMsg = dateMsg.replace(/月/g, '-');
				return dateMsg = dateMsg.replace(/日/g, '');
			}
		}
	}
</script>

<style lang="scss">
	.valueAdded {
		.inputBox {
			margin:0 30rpx;
			padding:24rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.leftTitle {
				font-size: 28rpx;
				color: #707071;
				height: 40rpx;
				line-height: 40rpx;
				flex-shrink: 0;
				margin-right:32rpx;
				.titleHint {
					color:#FF3838;
					font-size: 32rpx;
					padding-left:8rpx;
					font-weight:bold;
					height: 44rpx;
				}
			}
			.textContent {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				overflow: hidden;
				.checkedText {
					flex: 1;
					line-height: 40rpx;
					white-space:nowrap;
					overflow:hidden;
					text-overflow:ellipsis;
					word-break: break-all;
					text-align: right;
					.text + .text {
						margin-left: 8rpx;
					}
					.text {
						font-size: 28rpx;
						color: #333333;
						font-weight: 400;
						line-height: 40rpx;
					}
				}
				.goodsMsg {
					font-size: 28rpx;
					line-height: 40rpx;
				}
				.arrowIcon {
					width:22rpx;
					height: 22rpx;
					margin-left:20rpx;
				}
			}
			.goodsContent {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.goodsMsg {
					font-size: 28rpx;
					line-height: 40rpx;
				}
				.arrowIcon {
					width:22rpx;
					height: 22rpx;
					margin-left:20rpx;
				}
				.loadTimeMsgBox {
					padding-left: 32rpx;
					.loadTimeMsg {
						font-size: 26rpx;
						line-height: 40rpx;
					}
				}
			}
			.rightContent {
				flex: 1;
				text-align: right;
				padding-left: 32rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
				line-height: 40rpx;
				.contentMsg {
					font-size:28rpx;
				}
				.arrowIcon {
					width:22rpx;
					height: 22rpx;
					margin-left:20rpx;
				}
				.hopePriceInput {
					font-size:28rpx;
					color:#F29347;
					border: none;
					flex: 1;
				}
				.servicePriceNum {
					color:#4AA2F3;
					font-size:28rpx;
					padding-left:4rpx;
				}
			}
		}
		.footBtnGroup {
			padding: 24rpx 60rpx;
			width:630rpx;
			background-color: #FFF;
			position: fixed;
			bottom:0;
			// display: flex;
			// justify-content: center;
			// align-items: center;
			.internalBtn {
				width:280rpx;
				height: 90rpx;
				line-height: 90rpx;
				border-radius:44rpx;
				background-color: #F29347;
				box-shadow: 0 4rpx 8rpx 0 rgba(255, 147, 27, 0.5);
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				margin-right:60rpx;
			}
			.externalBtn {
				// width:280rpx;
				height: 90rpx;
				line-height: 90rpx;
				border-radius:44rpx;
				background-color: #4AA2F3;
				box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
		.timeBottomPopupBox {
			background: #FFFFFF;
			overflow: hidden;
			.popupHead {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 36rpx;
				border-bottom: 2rpx solid #EAEAEA;
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
			.timePopup {
				display: flex;
				height: 560rpx;
				.leftCol {
					width: 240rpx;
					height: 560rpx;
					background-color:#F3F3F3;
					.monthBox {
						height: 140rpx;
						line-height: 140rpx;
						text-align: center;
						font-size: 30rpx;
						font-weight: 500;
					}
				}
				.rightCol {
					flex: 1;
					height: 560rpx;
					.hourBox {
						height: 90rpx;
						padding: 0 46rpx 0 68rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.msg {
							font-weight: 500;
						}
						.checkHourIcon {
							width: 26rpx;
							height: 20rpx;
						}
					}
				}
			}
		}
	}
</style>
