<template>
	<view class="addrPopUp">
		<uni-popup ref="vehicleAlert" type="bottom" backgroundColor="#ffffff">
			<!--新增车辆-->
			<view class="newCar-pop">
				<view class="pop-newCar-title">选择车型</view>
				<view class="pop-newCar-subTitle">
					<text class="main">车长</text>
					<text class="sub">(单选)</text>
				</view>
				<scroll-view :scroll-y="true" :show-scrollbar="true" class="carLen-content">
					<view class="carLen-item" v-for="(item, index) in carLenArr" :key="item.id">
						<view class="carLen-item-inner" @click="switchCarLen(item, index)" :class="{active: index == params.alertVehicleIndex}">{{item.typeName}}米</view>
					</view>
				</scroll-view>
				<view class="randBox" />
				<view class="pop-newCar-subTitle">
					<text class="main">车型</text>
					<text class="sub">(单选)</text>
				</view>
				<scroll-view :scroll-y="true" :show-scrollbar="true" class="carLen-content">
					<view class="carLen-item" v-for="(item,index) in carTypeArr" :key="item.id">
						<view class="carLen-item-inner" @click="switchCarType(item, index)" :class="{active: index == params.alertCarTypeIndex}">{{item.typeName}}</view>
					</view>
				</scroll-view>
				<view class="addAlertCar">
					<view class="addAlertCar-btn cancel" @click="clearType">清空</view>
					<view class="addAlertCar-btn" @click="addCarLenAndType">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<!--车型车长删选-->
		
		
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		name: 'carVehicle',
		props: {
	
		},
		data() {
			return {
				carLenArr: [],
				carTypeArr: [],
				params: {
					alertVehicleIndex: -1,
					alertCarTypeIndex: -1,
					selectedCarLen: null,
					selectedCarType: null,
				},
			}
		},
		created() {
			this.init(); //车型车长
		},
		mounted() {
		},
		methods: {
			isVehicleInfo() {
				var carLenArr = this.carLenArr;
				var carTypeArr = this.carTypeArr;
				if (carTypeArr.length < 1 || carLenArr.length < 1) {
					return false
				}
				return true
 			},
			async init() {
				//初始化数据
				try{
					
					var carLen = await ship.postRequest("/ts/vehicle/length/get")
					var carType = await ship.postRequest("/ts/vehicle/type/get");
					console.log(carLen, carType)
					if (carLen.retCode == "0000000") {
						this.carLenArr = carLen.rspBody.items;
						if (carType.retCode == "0000000") {
							this.carTypeArr = carType.rspBody.items;
						} else {
							uni.showToast({
								title: carType.retDesc,
								icon: 'none'
							})
						}
					} else {
						uni.showToast({
							title: carLen.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					//TODO handle the exception
					
				}
			},
			switchCarLen(item, index) {
				this.params.selectedCarLen = item;
				this.params.alertVehicleIndex = index;
			},
			switchCarType(item, index) {
				this.params.selectedCarType = item;
				this.params.alertCarTypeIndex = index;
			},
			showNewCarAlert() {
				this.$refs.vehicleAlert.open();
			},
			addCarLenAndType() {
				//搜索确认
				var that = this;
				var selectedCarLen = this.params.selectedCarLen;
				var selectedCarType = this.params.selectedCarType;
				if (!selectedCarType && selectedCarLen) {
					uni.showToast({
						title: '请选择车型',
						icon: 'none'
					})
					return;
				}
				if (!selectedCarLen && selectedCarType) {
					uni.showToast({
						title: '请选择车长',
						icon: 'none'
					})
					return;
				}
				this.$refs.vehicleAlert.close();
				var params = {
					carModel: selectedCarType ? selectedCarType.typeName : null,
					carLength: selectedCarLen ? selectedCarLen.typeName : null,
				}
				this.$emit("searchVehicle", params);
			},
			clearType() {
				//清空搜索条件
				this.params = {
					alertVehicleIndex: -1,
					alertCarTypeIndex: -1,
					selectedCarLen: null,
					selectedCarType: null,
				};
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.newCar-pop {
		height: 80vh;
		display: flex;
		flex-direction: column;
		width: 100vw;
		background-color: #FFFFFF;
		border-radius: 24rpx 24rpx 0 0;
		.randBox {
			flex: 1;
		}
		.addAlertCar {
			margin: 92rpx 0 126rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.addAlertCar-btn {
				width: 250rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #2B72F0;
				border-radius: 16rpx;
				color: #FFFFFF;
				font-weight: 500;
				font-size: 32rpx;
				&.cancel {
					color: 2B72F0;
					background-color: #cccccc;
				}
			}
		}
		.pop-newCar-title {
			font-size: 40rpx;
			color: #333333;
			font-weight: 600;
			margin: 68rpx 0 14rpx;
			width: 100vw;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.pop-newCar-subTitle {
			width: 100vw;
			padding: 20rpx 36rpx 0;
			box-sizing: border-box;
			.main {
				font-size: 36rpx;
				color: #333333;
				font-weight: 500;
			}
			.sub {
				color: #666666;
				font-size: 24rpx;
				font-weight: 400;
			}
		}
		.carLen-content {
			height: 24vh;
			width: 100vw;
			padding: 0 10rpx;
			box-sizing: border-box;
			flex-wrap: wrap;
			margin-top: 30rpx;
			.carLen-item {
				width: 25%;
				height: 72rpx;
				padding: 0 26rpx;
				margin-bottom: 30rpx;
				display: inline-block;
				box-sizing: border-box;
				.carLen-item-inner {
					width: 100%;
					height: 72rpx;
					border-radius: 8rpx;
					box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.22);
					color: #333333;
					font-size: 28rpx;
					font-weight: 400;
					display: flex;
					justify-content: center;
					align-items: center;
					&.active {
						background-color: #4396F8;
						color: #FFFFFF;
					}
				}
				
			}
		}
	}
</style>
