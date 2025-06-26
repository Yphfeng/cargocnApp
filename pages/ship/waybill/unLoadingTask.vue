<template>
	<view class="content">
		
		<view class="input-whole">
			<view>卸货完成时间：</view>
			<picker class="picker" mode="multiSelector" :value="dateTime" @change="changeDateTime"  @columnchange="changeDateTimeColumn" :range="dateTimeArray">
				<view class='lableBox'>
					<view class="choose-value">{{params.receiverDt}}</view>
				</view> 
			</picker>
		</view>
		<view class="fix-bottom" @click="loadPan">
			卸货完成
		</view>
	</view>
</template>

<script>
	const { dateTimePicker,getMonthDay} = require('@/utils/date.js');
	import * as ship from "@/utils/ship";
	export default {
		data() {
			return {
				dateTime: null,
				dateTimeArray: null,
				startYear: 2000,
				params: {
					sid: '',
				}
			}
		},
		onLoad(options) {
			this.waybillDetails = JSON.parse(options.item);
			this.pageFrom = options.pageFrom;
			this.initTime();
		},
		methods: {
			input(e) {
				console.log(e, 'aaa');
				var val = e.detail.value;
				var text = val.replace(/-/g, "");
				console.log(text)
				this.params.unloadAmount = text;
			},
			blur(e) {
				console.log(e);
				var val = e.detail.value;
				if (val == false) {
					this.params.unloadAmount = "";
					this.$forceUpdate();
				}
			}, 
			initTime(){
				let date = new Date();
				let endYear = date.getFullYear();
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let obj = dateTimePicker(this.startYear, endYear);
				// 精确到分的处理，将数组的秒去掉
				// let lastArray = obj.dateTimeArray.pop();
				// let lastTime = obj.dateTime.pop();
			 
				this.dateTimeArray=obj.dateTimeArray
				this.dateTime=obj.dateTime
				this.params.receiverDt= this.createTimeStr(this.dateTimeArray,this.dateTime);
			},
			
			changeDateTime(e) {
				this.dateTime = e.detail.value;
				this.params.receiverDt= this.createTimeStr(this.dateTimeArray,this.dateTime);
				//ios时间不能用'-'解析成时间戳
			 },
			 
			/*年,月切换时重新更新计算*/
			changeDateTimeColumn(e) {
				//let {id} = e.target;
				let {column,value} = e.detail;
				if(column==0 || column==1){
					//直接修改数组下标视图不更新,用深拷贝之后替换数组
					let dateTime = JSON.parse(JSON.stringify(this.dateTime));
					let dateTimeArray = JSON.parse(JSON.stringify(this.dateTimeArray));
					dateTime[column] = value;
					dateTimeArray[2] = getMonthDay(dateTimeArray[0][dateTime[0]], dateTimeArray[1][dateTime[1]]);
					this.dateTime = dateTime;
					this.dateTimeArray = dateTimeArray;
				}
			},
			
			createTimeStr(dateTimeArray,dateTime){
				let timeStr = dateTimeArray[0][dateTime[0]]+'-'+dateTimeArray[1][dateTime[1]]+'-'+dateTimeArray[2][dateTime[2]]+' '+dateTimeArray[3][dateTime[3]]+":"+dateTimeArray[4][dateTime[4]]+":"+dateTimeArray[5][dateTime[5]];
				console.log(timeStr)
				return timeStr
			},
			async loadPan() {
				if (!ship.btnRepeat()) return;
				
				var params = this.params;
				if (!params.receiverDt) {
					uni.showToast({
						title: '请选择卸货完成时间',
						icon: 'none'
					})
					return;
				}
				params.unloadDt = params.receiverDt;
				uni.showLoading();
				try{
					var sid = this.waybillDetails.sid;
			
					params.sid = sid;
					console.log(params, '参数')
					var res = await ship.postRequest("/yd/task/finishYdTask", params)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '卸货完成',
							icon: 'none'
						})
						if (this.pageFrom == 'detail') {
							uni.navigateBack({
								delta: 2
							})
						} else {
							uni.navigateBack({
								delta: 1
							})
						}
						
					} else {
						console.log(res)
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.input-whole {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 0 30rpx;
		border-top: 1px solid #F1F1F1;
		padding: 24rpx 0;
		font-size: 32rpx;
		color: #333333;
		font-weight: 500;
		.input {
			flex: 1;
			text-align: right;
		}
		.picker {
			flex: 1;
			.lableBox {
				flex: 1;
				text-align: right;
				font-size: 28rpx;
				color: #333333;
				font-weight: 400;
			}
		}
	}
	.fix-bottom {
		position: fixed;
		bottom: 24rpx;
		left: 70rpx;
		width: calc(100vw - 140rpx);
		height: 84rpx;
		border-radius: 42rpx;
		background-color: #0171F9;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.bg-default {
		width: 100%;
		flex: 1;
		height: 228rpx;
		background-color: #F1F6FF;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 12rpx;
		.bg {
			width: 198rpx;
			height: 172rpx;
			background-image: url(https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/loadBgImg.png);
			background-size: cover;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.btn {
			width: 132rpx;
			height: 68rpx;
			background-color: #0171F9;
			border-radius: 34rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			font-size: 28rpx;
		}
	}
	.dun {
		padding-left: 20rpx;
		font-size: 28rpx;
		color: #707071;
	}
</style>
