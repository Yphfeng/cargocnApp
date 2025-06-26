<template>
	<view class="carType">
		<view class="typeBox">
			<view class="title">
				车型
				<text class="subTitle">（必填，最多3项）</text>
			</view>
			<view class="content">
				<view
					class="carList"
					v-for="(item, index) in carTypeData"
					:key="index"
					@tap="chooseCarTypeData(item)"
					:class="checkCarTypeRepeat(item.sid) ? 'isChecked' : 'isDefault'">
					{{item.typeName}}
				</view>
			</view>
		</view>
		<view class="typeBox">
			<view class="title">
				车长
				<text class="subTitle">（必填，最多1项）</text>
			</view>
			<view class="content">
				<view
					class="carList"
					v-for="(item, index) in newCarLongData"
					:key="index"
					@tap="newChooseCarLongData(item)"
					:class="item.typeName == checkedCarLongVal? 'isChecked' : 'isDefault'">
					{{item.typeName}}
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
				// 车长
				carLongData: [],
				checkedCarLongAry: [],
				// 车型
				carTypeData: [],
				checkedCarTypeAry: [],
				newCarLongData: [],
				checkedCarLongVal: 0,
				fleetModel: [],
			};
		},
		onLoad(options) {
			uni.showLoading({
			    title: '加载中'
			});
			console.log(options,'asas')
			this.checkedCarLongVal = options.checkedCarLongVal?options.checkedCarLongVal:0,
			this.fleetModel = options.model?options.model.split(","):[],
			this.getCarTypeData();
			this.getCarLengthData();
		},
		onShow() {
		
		},
		methods: {
			newChooseCarLongData(val){
				this.checkedCarLongVal = val.typeName;
			},
			getCarLengthData() { // 获取车长
				let that = this;
				utils.postRequest('/ts/vehicle/length/get')
				.then(res=>{
					console.log('车长', res);
					if(res.retCode == '0000000') {
						that.newCarLongData = res.rspBody.items;
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
			getCarTypeData() { // 获取车型
				let that = this;
				utils.postRequest('/ts/vehicle/type/get')
				.then(res=>{
					console.log('车型', res);
					if(res.retCode == '0000000') {
						that.carTypeData = res.rspBody.items;
						res.rspBody.items.map(val=>{
							that.fleetModel.map(data=>{
								if(val.typeName == data){
									that.checkedCarTypeAry.push(val);
								}
							})
						})
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
				console.log(this.checkedCarTypeAry);
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
				if(this.checkedCarTypeAry.length == 0) {
					uni.showToast({
						title: '请选择车型！',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.checkedCarLongVal == 0){
					uni.showToast({
						title: '请选择车长！',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				console.log(this.checkedCarLongVal);
				var data = {
					vehicleLength: this.checkedCarLongAry,
					vehicleModel: this.checkedCarTypeAry,
					checkedCarLongVal: this.checkedCarLongVal
				}
				uni.$emit("driverVal", data)
				uni.navigateBack();
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
				.carList {
					margin: 22rpx 16rpx 0 16rpx;
					border-radius: 8rpx;
					text-align: center;
					font-size:24rpx;
				}
				.isDefault {
					width: 124rpx;
					height: 46rpx;
					line-height: 46rpx;
					border: 2rpx solid #979797;
					color:#777;
				}
				.isChecked {
					width: 128rpx;
					line-height: 50rpx;
					color:#fff;
					background-color: #4AA2F3;
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
