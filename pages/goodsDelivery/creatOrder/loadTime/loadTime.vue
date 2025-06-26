<template>
	<view class="loadTime">
		<view class="timeBox">
			<view class="mainTitle">装车1开始时间</view>
			<view class="contentRow">
				<view class="subTitle">最早装货时间</view>
				<view class="rightCol" @tap="showTimePopup(1)">
					<text class="msg" :style="loadTimeData1.startTime ? 'color:#777;' : 'color:#C2C2C9;'">{{loadTimeData1.startTime ? loadTimeData1.startTime : '请选择'}}</text>
					<image class="rightIcon" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
			<view class="contentRow">
				<view class="subTitle">最晚装货时间</view>
				<view class="rightCol" @tap="showTimePopup(2)">
					<text class="msg" :style="loadTimeData1.endTime ? 'color:#777;' : 'color:#C2C2C9;'">{{loadTimeData1.endTime ? loadTimeData1.endTime : '请选择'}}</text>
					<image class="rightIcon" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
		</view>
		<view class="timeBox" v-if="addressDetail.loadGoods2.address">
			<view class="mainTitle">装车2开始时间</view>
			<view class="contentRow">
				<view class="subTitle">最早装货时间</view>
				<view class="rightCol">
					<text class="inputHint">抵达装货地后</text>
					<input class="timeInput" type="number" :style="loadTimeData2.startTime ? 'border: 2rpx solid #4AA2F3;color: #4AA2F3;' : 'border: 2rpx solid #aaa;color: #777;'" v-model="loadTimeData2.startTime" maxlength="5" @input="changeHopePrice1"/>
					<text class="inputHint">小时</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="subTitle">最晚装货时间</view>
				<view class="rightCol">
					<text class="inputHint">抵达装货地后</text>
					<input class="timeInput" type="number" :style="loadTimeData2.endTime ? 'border: 2rpx solid #4AA2F3;color: #4AA2F3;' : 'border: 2rpx solid #aaa;color: #777;'" v-model="loadTimeData2.endTime" maxlength="5" @input="changeHopePrice2"/>
					<text class="inputHint">小时</text>
				</view>
			</view>
		</view>
		<view class="timeBox">
			<view class="mainTitle">卸车1开始时间</view>
			<view class="contentRow">
				<view class="subTitle">最早卸货时间</view>
				<view class="rightCol">
					<text class="inputHint">抵达卸货地后</text>
					<input class="timeInput" type="number" :style="loadTimeData3.startTime ? 'border: 2rpx solid #4AA2F3;color: #4AA2F3;' : 'border: 2rpx solid #aaa;color: #777;'" v-model="loadTimeData3.startTime" maxlength="5" @input="changeHopePrice3"/>
					<text class="inputHint">小时</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="subTitle">最晚卸货时间</view>
				<view class="rightCol">
					<text class="inputHint">抵达卸货地后</text>
					<input class="timeInput" type="number" :style="loadTimeData3.endTime ? 'border: 2rpx solid #4AA2F3;color: #4AA2F3;' : 'border: 2rpx solid #aaa;color: #777;'" v-model="loadTimeData3.endTime" maxlength="5" @input="changeHopePrice4"/>
					<text class="inputHint">小时</text>
				</view>
			</view>
		</view>
		<view class="timeBox" v-if="addressDetail.unloadGoods2.address">
			<view class="mainTitle">卸车2开始时间</view>
			<view class="contentRow">
				<view class="subTitle">最早卸货时间</view>
				<view class="rightCol">
					<text class="inputHint">抵达卸货地后</text>
					<input class="timeInput" type="number" :style="loadTimeData4.startTime ? 'border: 2rpx solid #4AA2F3;color: #4AA2F3;' : 'border: 2rpx solid #aaa;color: #777;'" v-model="loadTimeData4.startTime" maxlength="5" @input="changeHopePrice5"/>
					<text class="inputHint">小时</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="subTitle">最晚卸货时间</view>
				<view class="rightCol">
					<text class="inputHint">抵达卸货地后</text>
					<input class="timeInput" type="number" :style="loadTimeData4.endTime ? 'border: 2rpx solid #4AA2F3;color: #4AA2F3;' : 'border: 2rpx solid #aaa;color: #777;'" v-model="loadTimeData4.endTime" maxlength="5" @input="changeHopePrice6"/>
					<text class="inputHint">小时</text>
				</view>
			</view>
		</view>
		
		<view class="footBtnGroup">
			<view class="saveBtn" @tap="saveLoadData()">确认信息</view>
		</view>
		
		<!-- 弹窗模块 -->
		<!-- 时间选择弹窗 -->
		<uni-popup ref="timePopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">请选择最{{popupFlag == 1 ? '早' : '晚'}}装货时间</text>
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
							{{showYearMsg(item.label)}}
						</view>
					</scroll-view>
					<scroll-view class="rightCol" scroll-y="true">
						<view
							class="hourBox"
							v-for="(item, index) in hourData"
							:key="index"
							@tap="chooseHour(index)"
							v-if="showHours(item.hour, item.min) && popupFlag == 1">
							<text class="msg" :style="startCheckedMonth == monthCheckVal && startHourCheckVal == index ? 'color:#4AA2F3;font-size: 30rpx;' : 'color:#333;font-size: 28rpx;'">{{item.hour}}:{{item.min}}</text>
							<image v-show="startCheckedMonth == monthCheckVal && startHourCheckVal == index" class="checkHourIcon" src="../../../../static/images/goodsDelivery/checkHour.png"></image>
						</view>
						<view
							class="hourBox"
							v-for="(item, index) in hourData"
							:key="index"
							@tap="chooseHour(index)"
							v-if="showHours(item.hour, item.min) && popupFlag == 2">
							<text class="msg" :style="endCheckedMonth == monthCheckVal && endHourCheckVal == index ? 'color:#4AA2F3;font-size: 30rpx;' : 'color:#333;font-size: 28rpx;'">{{item.hour}}:{{item.min}}</text>
							<image v-show="endCheckedMonth == monthCheckVal && endHourCheckVal == index" class="checkHourIcon" src="../../../../static/images/goodsDelivery/checkHour.png"></image>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupFlag: 1,
				loadTimeData1: {
					startTime: '',
					endTime: '',
				},
				loadTimeData2: {
					startTime: '',
					endTime: '',
				},
				loadTimeData3: {
					startTime: '',
					endTime: '',
				},
				loadTimeData4: {
					startTime: '',
					endTime: '',
				},
				monthCheckVal: '0',
				monthData: [],
				startHourCheckVal: '',
				endHourCheckVal: '',
				hourData: [],
				nowHours: 0, // 当前时间
				nowMins: 0, // 当前分钟
				startCheckedMonth: '',
				endCheckedMonth: '',
				addressDetail: {}
			};
		},
		onLoad() {
			uni.showLoading({
			    title: '加载中'
			});
			this.addressDetail =  getApp().globalData.addressObject;
			this.getDateInfo(); // 小时数据直接获取
			if(getApp().globalData.loadTimeData.loadTimeObj2.startTime) {
				this.loadTimeData2.startTime = getApp().globalData.loadTimeData.loadTimeObj2.startTime;
				this.loadTimeData2.endTime = getApp().globalData.loadTimeData.loadTimeObj2.endTime;
			}
			if(getApp().globalData.loadTimeData.loadTimeObj3.startTime) {
				this.loadTimeData3.startTime = getApp().globalData.loadTimeData.loadTimeObj3.startTime;
				this.loadTimeData3.endTime = getApp().globalData.loadTimeData.loadTimeObj3.endTime;
			}
			if(getApp().globalData.loadTimeData.loadTimeObj4.startTime) {
				this.loadTimeData4.startTime = getApp().globalData.loadTimeData.loadTimeObj4.startTime;
				this.loadTimeData4.endTime = getApp().globalData.loadTimeData.loadTimeObj4.endTime;
			}
		},
		onShow() {
			
		},
		methods: {
			saveLoadData() { // 保存
				let num = '';
				console.log(num.toString());
				if(!this.loadTimeData1.startTime || !this.loadTimeData1.endTime) {
					uni.showToast({
						title: '请选择装车1开始时间和结束时间',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.addressDetail.loadGoods2.address) {
					if(!this.loadTimeData2.startTime.toString() || !this.loadTimeData2.endTime.toString()) {
						uni.showToast({
							title: '请选择装车2开始时间和结束时间',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
				}
				if(!this.loadTimeData3.startTime.toString() || !this.loadTimeData3.endTime.toString()) {
					uni.showToast({
						title: '请选择卸车1开始时间和结束时间',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.addressDetail.unloadGoods2.address) {
					if(!this.loadTimeData4.startTime.toString() || !this.loadTimeData4.endTime.toString()) {
						uni.showToast({
							title: '请选择卸车2开始时间和结束时间',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
				}
				if(this.addressDetail.loadGoods2.address) {
					if(Number(this.loadTimeData2.startTime) > Number(this.loadTimeData2.endTime)) {
						uni.showToast({
							title: '最早装车2时间不能晚于最晚装车2时间',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
				}
				if(Number(this.loadTimeData3.startTime) > Number(this.loadTimeData3.endTime)) {
					uni.showToast({
						title: '最早卸车时间不能晚于最晚卸车时间',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.addressDetail.unloadGoods2.address) {
					if(Number(this.loadTimeData4.startTime) > Number(this.loadTimeData4.endTime)) {
						uni.showToast({
							title: '最早卸车2时间不能晚于最晚卸车2时间',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
				}
				uni.showLoading({
					mask: true,
					title: '加载中'
				});
				getApp().globalData.loadTimeData.loadTimeObj1 = {
					startTime: this.loadTimeData1.startTime,
					endTime: this.loadTimeData1.endTime,
				};
				if(this.addressDetail.loadGoods2.address) {
					getApp().globalData.loadTimeData.loadTimeObj2 = {
						startTime: this.loadTimeData2.startTime.toString(),
						endTime: this.loadTimeData2.endTime.toString(),
					};
				}
				
				getApp().globalData.loadTimeData.loadTimeObj3 = {
					startTime: this.loadTimeData3.startTime.toString(),
					endTime: this.loadTimeData3.endTime.toString(),
				};
				if(this.addressDetail.unloadGoods2.address) {
					getApp().globalData.loadTimeData.loadTimeObj4 = {
						startTime: this.loadTimeData4.startTime.toString(),
						endTime: this.loadTimeData4.endTime.toString(),
					};
				}
				getApp().globalData.loadTimeCheckInfo.startHourCheckVal = this.startHourCheckVal;
				getApp().globalData.loadTimeCheckInfo.endHourCheckVal = this.endHourCheckVal;
				getApp().globalData.loadTimeCheckInfo.startCheckedMonth = this.startCheckedMonth;
				getApp().globalData.loadTimeCheckInfo.endCheckedMonth = this.endCheckedMonth;
				console.log('时间', getApp().globalData.loadTimeData);
				uni.navigateBack();
			},
			showYearMsg(year) { // 删除年份前2位
				let msg = year.slice(2, year.length);
				return msg;
			},
			showHours(hour, min) { // 若选择今天，则不展示小于当前小时的数据
				if(this.nowHours == 23 && this.nowMins > 30) {
					return true;
				}else {
					if(this.monthCheckVal == '0') {
						if(hour < this.nowHours) {
							return false;
						}else {
							if(hour > this.nowHours) {
								return true;
							}else if(hour == this.nowHours && Number(min) > this.nowMins) {
								return true;
							}else {
								return false;
							}
						}
					}else {
						return true;
					}
				}
			},
			showTimePopup(val) { // 获取当前时、分后展示时间弹窗
				this.popupFlag = Number(val);
				var date = new Date();
				this.nowHours = date.getHours();
				this.nowMins = date.getMinutes();
				
				if(this.popupFlag == 1) {
					this.monthCheckVal = this.startCheckedMonth ? this.startCheckedMonth : this.monthCheckVal;
				}else {
					this.monthCheckVal = this.endCheckedMonth ? this.endCheckedMonth : this.monthCheckVal;
				}
				this.$refs.timePopup.open();
			},
			checkmonth(key) { // 选择月日
				if(this.monthCheckVal != key) {
					this.monthCheckVal = key;
				}
			},
			checkHour(checkedKey) { // 匹配时分数据
				console.log(checkedKey);
				var key = checkedKey.toString();
				console.log(this.monthCheckVal);
				// console.log(key);
				if(this.popupFlag == 1) {
					console.log(this.startCheckedMonth);
					// console.log(this.startHourCheckVal);
					// console.log(this.startCheckedMonth != this.monthCheckVal);
					// console.log(this.startHourCheckVal != key);
					if(this.startHourCheckVal != key) {
						this.startHourCheckVal = key;
						this.startCheckedMonth = this.monthCheckVal;
						this.loadTimeData1.startTime = this.monthData[this.startCheckedMonth].label + ' ' + this.hourData[this.startHourCheckVal].hour + ':' + this.hourData[this.startHourCheckVal].min;
						// console.log(this.loadTimeData1.startTime);
					}
					
				}else {
					// console.log(this.endCheckedMonth);
					// console.log(this.endHourCheckVal);
					// console.log(this.endCheckedMonth != this.monthCheckVal);
					// console.log(this.endHourCheckVal != key);
					if(this.endHourCheckVal != key) {
						this.endHourCheckVal = key;
						this.endCheckedMonth = this.monthCheckVal;
						this.loadTimeData1.endTime = this.monthData[this.endCheckedMonth].label + ' ' + this.hourData[this.endHourCheckVal].hour + ':' + this.hourData[this.endHourCheckVal].min;
						// console.log(this.loadTimeData1.endTime);
					}
				}
				
			},
			chooseHour(key) { // 选择时分
				var platform = uni.getSystemInfoSync().platform;
				
				let startTime, endTime;
				if(this.popupFlag == 1 && this.loadTimeData1.endTime) {
					console.log(this.popupFlag, this.loadTimeData1.endTime);
					startTime = this.monthData[this.monthCheckVal].label + ' ' + this.hourData[key].hour + ':' + this.hourData[key].min;
					endTime = this.loadTimeData1.endTime;
					startTime = startTime.replace(/年/, '-');
					startTime = startTime.replace(/月/, '-');
					startTime = startTime.replace(/日/, '');
					startTime = startTime + ':00';
					if (platform == "ios") { // 低版本的Safari无法解析new Date('XXXX-XX-XX')，但可以解析new Date('XXXX/XX/XX')格式的时间所以需要把“-”替换为“/”。
						startTime = startTime.replace(/-/g, '/');
					}
					endTime = endTime.replace(/年/, '-');
					endTime = endTime.replace(/月/, '-');
					endTime = endTime.replace(/日/, '');
					endTime = endTime + ':00';
					if (platform == "ios") { // 低版本的Safari无法解析new Date('XXXX-XX-XX')，但可以解析new Date('XXXX/XX/XX')格式的时间所以需要把“-”替换为“/”。
						endTime = endTime.replace(/-/g, '/');
					}
					let date = new Date(startTime);
					let date1 = new Date(endTime);
					console.log(date);
					console.log(date1);
					if(date1.getTime() - date.getTime() < 0) {
						uni.showToast({
							title: '最早的装货时间不能晚于最晚的装货时间',
							icon: 'none',
							duration: 2000
						})
						return false;
					}
				}
				if(this.popupFlag == 2 && this.loadTimeData1.startTime) {
					console.log(this.popupFlag, this.loadTimeData1.startTime);
					endTime = this.monthData[this.monthCheckVal].label + ' ' + this.hourData[key].hour + ':' + this.hourData[key].min;
					startTime = this.loadTimeData1.startTime;
					startTime = startTime.replace(/年/, '-');
					startTime = startTime.replace(/月/, '-');
					startTime = startTime.replace(/日/, '');
					startTime = startTime + ':00';
					if (platform == "ios") { // 低版本的Safari无法解析new Date('XXXX-XX-XX')，但可以解析new Date('XXXX/XX/XX')格式的时间所以需要把“-”替换为“/”。
						startTime = startTime.replace(/-/g, '/');
					}
					endTime = endTime.replace(/年/, '-');
					endTime = endTime.replace(/月/, '-');
					endTime = endTime.replace(/日/, '');
					endTime = endTime + ':00';
					if (platform == "ios") { // 低版本的Safari无法解析new Date('XXXX-XX-XX')，但可以解析new Date('XXXX/XX/XX')格式的时间所以需要把“-”替换为“/”。
						endTime = endTime.replace(/-/g, '/');
					}
					let date = new Date(startTime);
					let date1 = new Date(endTime);
					if(date1.getTime() - date.getTime() < 0) {
						uni.showToast({
							title: '最晚的装货时间不能早于最早的装货时间',
							icon: 'none',
							duration: 2000
						})
						return false;
					}
				}
				this.checkHour(key);
				this.$refs.timePopup.close();
			},
			closeTimePopup() { // 关闭日期弹窗
				this.$refs.timePopup.close();
			},
			getDateInfo() { // 获取日期时间数据
				var date1 = new Date();
				console.log(date1);
				for(let i = 0, maxData = 5; i < maxData; i++) {
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
				this.nowMins = date1.getMinutes();
				console.log(this.nowHours, this.nowMins);
				if(this.nowHours == 23 && this.nowMins > 29) {
					this.monthData.splice('0', 1);
				}
				
				// console.log('年月日数据', this.monthData);
				for(let i = 0; i < 24; i++) {
					let hours = i < 10 ? '0' + i : i;
					let monthObj1 = {
						hour: hours,
						min: '00'
					}
					let monthObj2 = {
						hour: hours,
						min: '30'
					}
					this.hourData.push(monthObj1);
					this.hourData.push(monthObj2);
				}
				
				// console.log('时分秒数据', this.hourData);
				if(getApp().globalData.loadTimeCheckInfo.startCheckedMonth && getApp().globalData.loadTimeCheckInfo.endCheckedMonth) {
					this.startCheckedMonth = getApp().globalData.loadTimeCheckInfo.startCheckedMonth;
					this.startHourCheckVal = getApp().globalData.loadTimeCheckInfo.startHourCheckVal;
					this.loadTimeData1.startTime = this.monthData[this.startCheckedMonth].label + ' ' + this.hourData[this.startHourCheckVal].hour + ':' + this.hourData[this.startHourCheckVal].min;
				}
				if(getApp().globalData.loadTimeCheckInfo.startCheckedMonth && getApp().globalData.loadTimeCheckInfo.endCheckedMonth) {
					this.endCheckedMonth = getApp().globalData.loadTimeCheckInfo.endCheckedMonth;
					this.endHourCheckVal = getApp().globalData.loadTimeCheckInfo.endHourCheckVal;
					this.loadTimeData1.endTime = this.monthData[this.endCheckedMonth].label + ' ' + this.hourData[this.endHourCheckVal].hour + ':' + this.hourData[this.endHourCheckVal].min;
				}
				uni.hideLoading();
			},
			changeHopePrice1(e) {
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 3){
						let num  = Number(e.detail.value.length) - 3;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,1})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 1;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.loadTimeData2.startTime = e.detail.value
				})
			},
			changeHopePrice2(e) {
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 3){
						let num  = Number(e.detail.value.length) - 3;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,1})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 1;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.loadTimeData2.endTime = e.detail.value
				})
			},
			changeHopePrice3(e) {
				console.log(e)
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 3){
						let num  = Number(e.detail.value.length) - 3;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,1})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 1;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.loadTimeData3.startTime = e.detail.value
				})
			},
			changeHopePrice4(e) {
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 3){
						let num  = Number(e.detail.value.length) - 3;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,1})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 1;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.loadTimeData3.endTime = e.detail.value
				})
			},
			changeHopePrice5(e) {
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 3){
						let num  = Number(e.detail.value.length) - 3;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,1})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 1;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.loadTimeData4.startTime = e.detail.value
				})
			},
			changeHopePrice6(e) {
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 3){
						let num  = Number(e.detail.value.length) - 3;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,1})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 1;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.loadTimeData4.endTime = e.detail.value
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.loadTime {
		padding-bottom:168rpx;
		.timeBox {
			background-color: #FFF;
			border-radius: 12rpx;
			padding: 32rpx 32rpx 0 32rpx;
			margin: 16rpx 16rpx 0 16rpx;
			.mainTitle {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
			}
			.contentRow + .contentRow {
				border-top: 2rpx solid rgba(151, 151, 151, 0.16);
			}
			.contentRow {
				padding: 24rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 50rpx;
				.subTitle {
					font-size: 28rpx;
					color: #707071;
					text-align: left;
				}
				.rightCol {
					display: flex;
					align-items: center;
					.msg {
						font-size: 28rpx;
						font-weight: bold;
					}
					.rightIcon {
						width: 22rpx;
						height: 22rpx;
						margin-left:20rpx;
					}
					.inputHint {
						font-size: 26rpx;
						color: #777777;
					}
					.timeInput {
						width:96rpx;
						height: 46rpx;
						border-radius: 8rpx;
						margin: 0 16rpx;
						text-align: center;
						font-size: 26rpx;
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
		.footBtnGroup {
			padding: 24rpx 60rpx;
			width:630rpx;
			background-color: #FFF;
			position: fixed;
			bottom: 0;
			box-shadow: 0px -2rpx 8rpx 0px rgba(0,0,0,0.1);
			border-radius: 24rpx 24rpx 0px 0px;
			.saveBtn {
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
	}
</style>
