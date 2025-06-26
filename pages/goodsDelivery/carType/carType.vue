<template>
	<view class="carType">
		<view class="titleBox">
			<view class="mainTitle">
				用车量
				<text class="subTitle">（必填，单选）</text>
			</view>
		</view>
		<view class="goodsTypeBox">
			<view
				class="goodsBox"
				v-for="(item, index) in carNumDate"
				:key="index"
				@click="chooseCarNum(item.value)"
				:style="checkedCarNum == item.value ? 'background: #4396F8;color: #FFF;' : 'background: #FFF;color: #333;'">
				{{item.value + '车'}}
			</view>
			<view
				class="goodsBox isInputBox"
				@click="checkedCarNum = 99, inputOnFocus = true"
				:style="'background: #FFF;color: #333;'">
				<input type="number" placeholder-style="font-size:32rpx;color:#AAA" maxlength="4" :focus="inputOnFocus" placeholder="请输入" v-model="carNumVal" @input="toCarNum"/>
			</view>
		</view>
		<view class="titleBox">
			<view class="mainTitle">
				车长
				<text class="subTitle">（必填，最多2项）</text>
			</view>
		</view>
		<view class="goodsTypeBox">
			<view
				class="goodsBox"
				v-for="(item, index) in carLongData"
				:key="index"
				@click="chooseCarLongData(item)"
				:style="checkCarLongRepeat(item.sid) ? 'background: #4396F8;color: #FFF;' : 'background: #FFF;color: #333;'">
				{{item.typeName}}
			</view>
		</view>
		<view class="titleBox">
			<view class="mainTitle">
				车型
				<text class="subTitle">（必填，最多2项）</text>
			</view>
		</view>
		<view class="goodsTypeBox">
			<view
				class="goodsBox"
				v-for="(item, index) in carTypeData"
				:key="index"
				@click="chooseCarTypeData(item)"
				:style="checkCarTypeRepeat(item.sid) ? 'background: #4396F8;color: #FFF;' : 'background: #FFF;color: #333;'">
				{{item.typeName}}
			</view>
		</view>
		<view class="comfirmBtn" @click="saveOrderCarMsg()">确定</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				userInfo: {},
				carTypeData: [],
				checkedCarTypeAry: [],
				carTypeCollapse: [1],
				carLongData: [],
				checkedCarLongAry: [],
				carLongCollapse: [1],
				carNumDate: [{
					value: 1
				}, {
					value: 2
				}, {
					value: 3
				}],
				checkedCarNum: 1,
				carNumVal: '',
				inputOnFocus: false
			};
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) {
				uni.navigateBack()
			}else {
				this.userInfo = JSON.parse(userInfo);
				console.log(this.userInfo);
				uni.showLoading();
				this.getCarTypeData();
				this.getCarLengthData();
			}
		},
		onReady() {
			let ary = {};
			ary = getApp().globalData.carTypeVo;
			console.log('本地数据车型车长', ary);
			this.checkedCarTypeAry = [];
			if(ary.vehicleModel.length > 0) {
				for(let i in ary.vehicleModel) {
					this.checkedCarTypeAry.push(ary.vehicleModel[i]);
				}
			}
			this.checkedCarLongAry = [];
			if(ary.vehicleLength.length > 0) {
				for(let b in ary.vehicleLength) {
					this.checkedCarLongAry.push(ary.vehicleLength[b]);
				}
			}
			let vehicleNumber = getApp().globalData.carTypeVo.vehicleNumber;
			if(vehicleNumber) {
				if(Number(vehicleNumber) > this.carNumDate.length) {
					this.checkedCarNum = 99;
					this.carNumVal =  Number(vehicleNumber);
				}else {
					this.checkedCarNum = Number(vehicleNumber);
				}
			}
		},
		methods: {
			getCarTypeData() { // 获取车型
				let that = this;
				utils.postRequest('/ts/vehicle/type/get')
				.then(res=>{
					console.log('车型', res);
					if(res.retCode == '0000000') {
						that.carTypeData = res.rspBody.items;
						that.carTypeData.push({
							typeName: '不限车型',
							sid: 'typeNoLimit'
						});
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
				
			},
			getCarLengthData() { // 获取车长
				let that = this;
				utils.postRequest('/ts/vehicle/length/get')
				.then(res=>{
					console.log('车长', res);
					if(res.retCode == '0000000') {
						that.carLongData = res.rspBody.items;
						that.carLongData.push({
							typeName: '不限车长',
							sid: 'longNoLimit'
						});
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			// 基本多选逻辑：数组内是否存在重复的值，重复则去重、不重复则添加
			chooseCarLongData(item) { // 选择车长
				if(item.sid == 'longNoLimit') {
					this.checkedCarLongAry = [];
					this.checkedCarLongAry.push(item);
				}else {
					if(this.checkedCarLongAry && this.checkedCarLongAry.length > 0 && this.checkedCarLongAry[0].sid == 'longNoLimit') {
						this.checkedCarLongAry = []
					}
					if(this.checkCarLongRepeat(item.sid)) {
						for(let i in this.checkedCarLongAry) {
							if(this.checkedCarLongAry[i].sid == item.sid) {
								this.checkedCarLongAry.splice(i, 1);
								break;
							}
						}
					}else {
						
						if(this.checkedCarLongAry.length == 2) {
							uni.showToast({
								title: '最多选择2种车长',
								icon: 'none',
								duration: 2000
							});
						}else {
							this.checkedCarLongAry.push(item);
						}
					}
				}
				this.$forceUpdate();
			},
			checkCarLongRepeat(val) { // 车长重复判断
				for(let i in this.checkedCarLongAry) {
					if(this.checkedCarLongAry[i].sid == val) {
						return true;
					}
				}
			},
			chooseCarTypeData(item) { // 选择车型
				if(item.sid == 'typeNoLimit') {
					this.checkedCarTypeAry = [];
					this.checkedCarTypeAry.push(item);
				}else {
					if(this.checkedCarTypeAry && this.checkedCarTypeAry.length > 0 && this.checkedCarTypeAry[0].sid == 'typeNoLimit') {
						this.checkedCarTypeAry = []
					}
					if(this.checkCarTypeRepeat(item.sid)) {
						for(let i in this.checkedCarTypeAry) {
							if(this.checkedCarTypeAry[i].sid == item.sid) {
								this.checkedCarTypeAry.splice(i, 1);
								break;
							}
						}
					}else {
						if(this.checkedCarTypeAry.length == 2) {
							uni.showToast({
								title: '最多选择2种车型',
								icon: 'none',
								duration: 2000
							});
						}else {
							this.checkedCarTypeAry.push(item);
						}
					}
				}
				this.$forceUpdate();
			},
			checkCarTypeRepeat(val) { // 车型重复判断
				for(let i in this.checkedCarTypeAry) {
					if(this.checkedCarTypeAry[i].sid == val) {
						return true;
					}
				}
			},
			chooseCarNum(val) { // 选择用车量
				this.checkedCarNum = val;
			},
			toCarNum(e) {
				this.$nextTick(function(){
					if(e.detail.value) {
						if(e.detail.value == 0 || e.detail.value == '0') {
							this.carNumVal = 1;
						}else {
							this.carNumVal = parseInt(e.detail.value);
						}
					}
				})
			},
			saveOrderCarMsg() { // 保存用车信息
				let vehicleNumber = '';
				if(this.checkedCarNum == 99) {
					if(!this.carNumVal) {
						uni.showToast({
							title: '请填写用车数量！',
							icon: 'none',
							duration: 3000
						})
						return false;
					}else {
						vehicleNumber = this.carNumVal;
					}
				}else {
					vehicleNumber = this.checkedCarNum;
				}
				// console.log('历史用车数', this.historyNum);
				// console.log('现有用车数', vehicleNumber);
				if(this.checkedCarTypeAry.length == 0) {
					uni.showToast({
						title: '请选择车型！',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.checkedCarLongAry.length == 0) {
					uni.showToast({
						title: '请选择车长！',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				console.log('选择的车型', this.checkedCarTypeAry);
				getApp().globalData.carTypeVo = {};
				getApp().globalData.carTypeVo = {
					vehicleLength: this.checkedCarLongAry,
					vehicleModel: this.checkedCarTypeAry,
					vehicleNumber: vehicleNumber,
				};
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.carType {
		min-height:100vh;
		background-color: #FAFAFA;
		box-sizing: border-box;
		padding-bottom: 164rpx;
		.toRolate {
			transform-origin:center center;
			transform: rotate(180deg);
			transition: transform 0.2s;
		}
		.rolateRecovery {
			transform-origin:center center;
			transform: rotate(0deg);
			transition: transform 0.2s;
		}
		.goodsTypeBox {
			padding: 16rpx 36rpx 0 36rpx;
			display: flex;
			flex-wrap: wrap;
			background-color: #FAFAFA;
			.isInputBox {
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.goodsBox:nth-child(4n) {
				margin-right:0;
			}
			.goodsBox {
				width: 150rpx;
				height: 72rpx;
				line-height: 72rpx;
				margin-right: 26rpx;
				margin-bottom: 20rpx;
				box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.22);
				border-radius: 8rpx;
				font-size: 32rpx;
				font-weight: 500;
				text-align: center;
			}
		}
		.titleBox {
			padding: 48rpx 42rpx 0 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #FAFAFA;
			.mainTitle {
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
				line-height: 44rpx;
				.subTitle {
					font-size: 24rpx;
					color: #666666;
				}
			}
			.showAllBoxContent {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #666666;
				line-height: 44rpx;
				.showMoreIcon {
					width: 31rpx;
					height: 18rpx;
					display: block;
					margin-left: 18rpx;
				}
			}
		}
		.comfirmBtn {
			position: fixed;
			bottom: 64rpx;
			left: 175rpx;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #2B72F0;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
