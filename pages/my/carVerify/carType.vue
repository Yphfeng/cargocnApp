<template>
	<view class="carType">
		<view class="typeBox" v-if="temperatureFlag == 1">
			<view class="title">
				车型
				<text class="subTitle">（必填，最多{{source == "driver" ? 1 : 3}}项）</text>
			</view>
			<view class="content">
				<view class="carContent" v-for="(item, index) in carTypeData" :key="index">
					<view
						class="carList"
						@tap="chooseCarTypeData(item)"
						:class="checkCarTypeRepeat(item.sid) ? 'isChecked' : 'isDefault'">
						{{item.typeName}}
					</view>
				</view>	
			</view>
		</view>
		<view class="typeBox">
			<view class="title">
				车长
				<text class="subTitle">（必填，最多{{source == "driver" ? 1 : 3}}项）</text>
			</view>
			<view class="content">
				<view class="carContent" v-for="(item, index) in carLongData" :key="index">
					<view
						class="carList"
						@tap="chooseCarLongData(item)"
						:class="checkCarLongRepeat(item.sid) ? 'isChecked' : 'isDefault'">
						{{item.typeName}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="footBtnGroup">
			<view class="saveBtn" @tap="saveCarType()">确认信息</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				source: '',
				temperatureFlag: '',
				// 车长
				carLongData: [],
				checkedCarLongAry: [],
				// 车型
				carTypeData: [],
				checkedCarTypeAry: [],
				userRole: ''
			};
		},
		onLoad(options) {
			this.userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
			uni.showLoading({
			    title: '加载中'
			});
			console.log(options,'asas')
			if (this.userRole == 1) {
				if (options.carData) {
					var carData = JSON.parse(options.carData);
					this.carData = carData;
				}
				
			}
			this.source = options.source;
			this.temperatureFlag = getApp().globalData.temperatureFlag;
			this.getCarTypeData();
			this.getCarLengthData();
			
		},
		onShow() {
			if (this.userRole == 2) {
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
						if(that.userRole == 2) {
							that.carTypeData = that.carTypeData.filter(item => item.sid != '20210916122739069pro4tpst0001');
						}
						if (that.userRole == 1) {
							var carData = that.carData;
							if (carData) {
								var carTypeData = res.rspBody.items;
								var findIndex = carTypeData.findIndex(item => {
									return item.typeName == carData.carModel
								})
								if (findIndex > -1) {
									that.checkedCarTypeAry = [carTypeData[findIndex]]
								}
							}
							
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
				uni.hideLoading();
			},
			getCarLengthData() { // 获取车长
				let that = this;
				utils.postRequest('/ts/vehicle/length/get')
				.then(res=>{
					console.log('车长', res);
					if(res.retCode == '0000000') {
						that.carLongData = res.rspBody.items;
						if (that.userRole == 1) {
							var carData = that.carData;
							if (carData) {
								var carLongData = res.rspBody.items;
								var findIndex = carLongData.findIndex(item => {
									return item.typeName == carData.carLen
								})
								console.log(findIndex,carData, 'asasa1')
								if (findIndex > -1) {
									that.checkedCarLongAry = [carLongData[findIndex]]
								}
							}
							
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
				uni.hideLoading();
			},
			// 基本多选逻辑：数组内是否存在重复的值，重复则去重、不重复则添加
			// 车长
			chooseCarLongData(item) { // 选择车长
				if (this.source == "driver") {
					if(this.checkCarLongRepeat(item.sid)) {
						return
					}else {
						this.checkedCarLongAry = [item];
					}
				} else {
					if(this.checkCarLongRepeat(item.sid)) {
						for(let i in this.checkedCarLongAry) {
							if(this.checkedCarLongAry[i].sid == item.sid) {
								this.checkedCarLongAry.splice(i, 1);
								break;
							}
						}
					}else {
						
						if(this.checkedCarLongAry.length == 3) {
							uni.showToast({
								title: '最多选择3种车长',
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
				// this.$forceUpdate();
			},
			
			// 车型
			chooseCarTypeData(item) { // 选择车型
			
				var source = this.source;
				if (source == 'driver') {
					if(this.checkCarTypeRepeat(item.sid)) {
						return;
					}else {
						this.checkedCarTypeAry = [item];
					}
				} else {
					if(this.checkCarTypeRepeat(item.sid)) {
						for(let i in this.checkedCarTypeAry) {
							if(this.checkedCarTypeAry[i].sid == item.sid) {
								this.checkedCarTypeAry.splice(i, 1);
								break;
							}
						}
					}else {
					
						if(this.checkedCarTypeAry.length == 3) {
							uni.showToast({
								title: '最多选择3种车型',
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
				// this.$forceUpdate();
			},
			saveCarType() { // 保存车型车长
				if(this.temperatureFlag == 1) {
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
					getApp().globalData.carTypeVo = {};
					getApp().globalData.carTypeVo = {
						vehicleLength: this.checkedCarLongAry,
						vehicleModel: this.checkedCarTypeAry
					};
					if (this.source == "driver") {
						var data = {
							vehicleLength: this.checkedCarLongAry,
							vehicleModel: this.checkedCarTypeAry
						}
						uni.$emit("driverVal", data)
					}
				}else {
					if(this.checkedCarLongAry.length == 0) {
						uni.showToast({
							title: '请选择车长！',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
					getApp().globalData.carTypeVo = {};
					getApp().globalData.carTypeVo = {
						vehicleLength: this.checkedCarLongAry,
						vehicleModel: this.checkedCarTypeAry
					};
					console.log(this.source)
					if (this.source == "driver") {
						var data = {
							vehicleLength: this.checkedCarLongAry,
							vehicleModel: this.checkedCarTypeAry
						}
						uni.$emit("driverVal", data)
					}
				}
				uni.navigateBack();
				
				// uni.showLoading({
				// 	title: '加载中'
				// });
				// let that = this;
				// let params = {"orderVehicleLengthVOs":[{"batchNumber":"qqw","vehicleLength":1.19,"vehicleLengthCode":"车长的code"}],"orderVehicleModelVOS":[{"batchNumber":"qqw","vehicleModel":"货车","vehicleModelCode":"车型的code"}]}
				// console.log('保存参数', params);
				// utils.postRequest('/td/vehicle-model/add', params)
				// .then(res=>{
				// 	if(res.retCode == '0000000') {
				// 		console.log('保存成功', res);
				// 		getApp().globalData.carTypeVo = {
				// 			vehicleLength: that.checkedCarLongAry,
				// 			vehicleModel: that.checkedCarTypeAry
				// 		};
				// 		uni.navigateBack();
				// 	}else{
				// 		uni.showToast({
				// 			title: res.retDesc,
				// 			icon: 'none',
				// 			duration: 3000
				// 		})
				// 	}
				// })
				// .catch(err=>{
				// 	console.log(err);
				// })
				// uni.hideLoading();
			},
		}
	}
</script>

<style lang="scss">
	.carType {
		padding-top: 20rpx;
		padding-bottom:168rpx;
		.typeBox + .typeBox {
			margin-top: 20rpx;
		}
		.typeBox {
			margin-left:16rpx;
			margin-right:16rpx;
			border-radius: 12rpx;
			background-color: #FFF;
			padding: 32rpx 24rpx;
			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #222222;
				.subTitle {
					font-size: 24rpx;
					color: #777777;
				}
			}
			.content {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				.carContent {
					padding: 22rpx 16rpx 0 16rpx;
					width: 33.33%;
					box-sizing: border-box;
				}
				.carList {
					border-radius: 8rpx;
					text-align: center;
					font-size:28rpx;
					box-sizing: border-box;
					height: 64rpx;
					line-height: 64rpx;
					border: 2rpx solid #979797;
				}
				.isDefault {
					border-color: #979797;
					color:#777;
				}
				.isChecked {
					color:#fff;
					background-color: #4AA2F3;
					border-color: #4AA2F3;
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
