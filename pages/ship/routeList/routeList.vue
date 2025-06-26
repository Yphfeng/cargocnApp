<template>
	<view class="container" :style="{'padding-top': pdTop, height: windowHeight}" :class="{active: isAlertShow}">
		<view class="newHeader">
			<view :style="{height: statusBarHeight*2 + 'rpx'}" />
			<view class="headBox">
				<view class="icon_left">
					<i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777777; font-size: 27px;"></i>
				</view>
				<view class="text">
					{{navigateTitle ? navigateTitle : '添加线路'}}
				</view>
				<view class="" />
			</view>
		</view>
		<view class="addr">
			<view class="startContent">
				<view class="title">
					<view class="dotted" />
					<view class="main">请选择装货地</view>
				</view>
				<view class="loadArr">
					<view class="btnAdd" @click="showPopUp(1)" v-if="loadingArray.length < 1">
						<image src="../../../static/images/added.png" class="addIcon"></image>
						选择
					</view>
					<view class="item" v-else v-for="(item, index) in loadingArray" @click="clearLoadingArr(index)">
						<text>{{item.name}}</text>
						<image src="../../../static/images/newCancel.png" class="close"></image>
					</view>
				</view>
				
			</view>
			<view class="line" />
			<view class="startContent">
				<view class="title">
					<view class="dotted end" />
					<view class="main">请选择卸货地</view>
				</view>
				<view class="loadArr">
					
					<view class="btnAdd" @click="showPopUp(2)" v-if="unLoadingArray.length < 1">
						<image src="../../../static/images/added.png" class="addIcon"></image>
						选择
					</view>
					<view class="item" v-else v-for="(item, index) in unLoadingArray" @click="clearunLoadingArr(index)">
						<text>{{item.name}}</text>
						<image src="../../../static/images/newCancel.png" class="close"></image>
					</view>
				</view>
				
			</view>
		</view>
		<view class="item">
			<view class="title">
				<view class="main">车长</view>
				<view class="sub">（必填，最多3项）</view>
			</view>
			<view class="list">
				<view class="listE" v-for="(item, index) in carLen" :key="index" @click="setLen(index)" :class="{active: item.isSelected}">
					{{item.typeName}}
				</view>
			</view>
		</view>
		
		<view class="item">
			<view class="title">
				<view class="main">车型</view>
				<view class="sub">（必填，最多3项）</view>
			</view>
			<view class="list">
				<view class="listE" v-for="(item, index) in carType" :key="index" @click="setCarType(index)" :class="{active: item.isSelected}">
					{{item.typeName}}
				</view>
			</view>
		</view>
		<view class="fix-bottom">
			<view class="send" @click="send">
				确认信息
			</view>
		</view>
		<!-- <uni-selection :provinceArr="provinceArr" :loadingArray="loadingArray" :unLoadingArray="unLoadingArray" :isAlertShow="isAlertShow" @closeAlert="closeAlert" @confirmSelection="confirmSelection" :isLoading="isLoading"></uni-selection> -->
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
							<view class="itemPicker" v-for="(item,index) in provinceArr" :key="index">{{item.name}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="itemPicker" v-for="(item,index) in cityArr" :key="index">{{item.name}}</view>
						</picker-view-column>
					</picker-view>
					
				</view>
				<view class="popupBtnGroup">
					<view class="comfirmBtn" @tap="selectArea()">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as service from "../../../utils/ship";
	export default {
		data() {
			return {
				isLoading: true,
				navigateTitle: '',
				timer: null,
				currentIndex: 0,
				isAlertShow: false,
				statusBarHeight: 0,
				pdTop: 0,
				windowHeight: 0,
				
				isSelectedCity: -1,
				isSelectedAreaIndex: -1,
				provinceArr: [],
				cityArr: [],
				isSelectedArea: [],
				unLoadingArray: [],
				loadingArray: [],
				carLen: [],
				carType: [],
				isSelectedCarLen: [],
				isSelectedCarType: [],
				goodsVal: [0,0],
			}
		},
		onLoad(options) {
			var that = this;
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			this.statusBarHeight = statusBarHeight;
			var pdTop = (statusBarHeight * 2 + 88) + 'rpx';
				this.windowHeight = (windowHeight*2 - statusBarHeight * 2 - 88) + 'rpx';
			this.pdTop = pdTop;
			uni.showLoading({
				title: '加载中'
			})
			if (options.routeData) {
				this.navigateTitle = options.navigateTitle
				this.routeData = JSON.parse(options.routeData);
				that.debounce(that.init, 500, JSON.parse(options.routeData));
			} else {
				this.navigateTitle = "";
				that.debounce(that.init, 500);
			}
			
			
			
		},
		methods: {
			debounce(func, wait, params) {
			    var that = this;
			    if (that.timer) clearTimeout(that.timer);
			    that.timer = setTimeout(() => {
			        func(params)
			      }, wait)
			    
			},
			async init(options) {
				//获取车长和车型列表
				console.log(options, '编辑的数据')
				var that = this;
				try{
					var response = await service.postRequest("/ts/vehicle/length/get");
					var res = await service.postRequest("/ts/vehicle/type/get");
					//获取地区数据
					var result = await service.postRequest("/ts/nationDict/getBasicData");
					var carLen = response.rspBody.items;
					var carType = res.rspBody.items;
					var provinceArr = result.rspBody;
					// console.log(carLen, '车长', result)
					if (!options) {
						that.carLen = carLen;
						that.carType = carType;
						//新增
						that.provinceArr = provinceArr;
						var cities = provinceArr[0].cities;
						if (cities[0].name != "全省") {
							cities.unshift({
								name: '全省',
							})
						}
						that.cityArr = cities;
					} else {
						var isSelectedCarType = [];
						var isSelectedCarLen = [];
						var vehicleLength = (options.vehicleLength).split(',');
						var vehicleModel = (options.vehicleModel).split(",");
						
						var isSelectedCarType = [];
						vehicleModel.forEach(item => {
							var findIndex = carType.findIndex(atem => {
								return atem.typeName == item
							})
							if (findIndex > -1) {
								carType[findIndex].isSelected = true
								isSelectedCarType.push(carType[findIndex])
							}
						})
						vehicleLength.forEach(item => {
							var findIndex = carLen.findIndex(atem => {
								return atem.typeName == item
							})
							if (findIndex > -1) {
								carLen[findIndex].isSelected = true
								isSelectedCarLen.push(carLen[findIndex])
							}
						})
						
						var loadingArray = [], unLoadingArray = [];
						//装货点
						if (options.startOffCity) {
							loadingArray = [
								{
									provinceName: options.startOffProvince,
									provinceCode: options.startOffProvinceCode,
									cityName: options.startOffCity,
									cityCode: options.startOffCityCode,
									name: options.startOffCity,
									code: options.startOffCityCode,
								}
							]
						} else {
							loadingArray = [
								{
									provinceName: options.startOffProvince,
									provinceCode: options.startOffProvinceCode,
									name: options.startOffProvince,
									code: options.startOffProvinceCode,
								}
							]
						}
						//卸货点
						if (options.arriveCity) {
							unLoadingArray = [
								{
									provinceName: options.arriveProvince,
									provinceCode: options.arriveProvinceCode,
									cityName: options.arriveCity,
									cityCode: options.arriveCityCode,
									name: options.arriveCity,
									code: options.arriveCityCode,
								}
							]
						} else {
							unLoadingArray = [
								{
									provinceName: options.arriveProvince,
									provinceCode: options.arriveProvinceCode,
									name: options.arriveProvince,
									code: options.arriveProvinceCode,
								}
							]
						}
						
						
						that.loadingArray = loadingArray;
						that.unLoadingArray = unLoadingArray;
						that.isSelectedCarLen = isSelectedCarLen;
						that.isSelectedCarType = isSelectedCarType;
						that.carLen = carLen;
						that.carType = carType;
						//新增
						that.provinceArr = provinceArr;
						var cities = provinceArr[0].cities;
						if (cities[0].name != "全省") {
							cities.unshift({
								name: '全省',
							})
						}
						that.cityArr = cities;
					}
					uni.hideLoading();
				}catch(e){
					console.log(e)
					//TODO handle the exception
					uni.hideLoading();
				}
			},
			cancel() {
				this.isAlertShow = false
			},
			showPopUp(index) {
				this.addrType = index;
					// this.goodsVal = [0, 0, 0];
				this.$refs.startPopup.open();
			},
			closePopup() {
				
				this.$refs.startPopup.close();
	
			},
			selectArea() {
				var index = this.addrType;
				this.closePopup();
				if (index == 1) {
					//装货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					if (goodsVal[1] == 0) {
						this.loadingArray = [{
							name: provinceArr[goodsVal[0]].name,
							code: provinceArr[goodsVal[0]].code,
							provinceName: provinceArr[goodsVal[0]].name,
							provinceCode: provinceArr[goodsVal[0]].code
						}]
					} else {
						this.loadingArray = [{
							provinceName: provinceArr[goodsVal[0]].name,
							provinceCode: provinceArr[goodsVal[0]].code,
							cityName: cityArr[goodsVal[1]].name,
							cityCode: cityArr[goodsVal[1]].code,
							name: cityArr[goodsVal[1]].name,
							code: cityArr[goodsVal[1]].code,
						}]
					}
					
				} else {
					//表示是卸货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					
					if (goodsVal[1] == 0) {
						this.unLoadingArray = [{
							name: provinceArr[goodsVal[0]].name,
							code: provinceArr[goodsVal[0]].code,
							provinceName: provinceArr[goodsVal[0]].name,
							provinceCode: provinceArr[goodsVal[0]].code
						}]
					} else {
						this.unLoadingArray = [{
							provinceName: provinceArr[goodsVal[0]].name,
							provinceCode: provinceArr[goodsVal[0]].code,
							cityName: cityArr[goodsVal[1]].name,
							cityCode: cityArr[goodsVal[1]].code,
							name: cityArr[goodsVal[1]].name,
							code: cityArr[goodsVal[1]].code,
						}]
					}
				}
			},
			bindGoodsChange(e) {
				console.log(e)
				var provinceArr = this.provinceArr;
				var goodsVal = this.goodsVal;
				var val = e.detail.value;
				var proIndex = val[0];
				var cityIndex = val[1];
				if (goodsVal[0] !== proIndex) {
					var cities = provinceArr[proIndex].cities;
					var proName = provinceArr[proIndex].name;
					if (cities[0].name != "全省" && cities[0].name != "全市") {
						if (proName.indexOf('市') > -1) {
							cities.unshift({
								name: '全市'
							})
						} else {
							cities.unshift({
								name: '全省'
							})
						}
					}
					this.cityArr = cities;
					this.goodsVal = [proIndex, 0]
				} else if (goodsVal[1] !== cityIndex) {
					this.goodsVal = [proIndex, cityIndex]
				} else {
					this.goodsVal = [proIndex, cityIndex]
				}
			},

	
			confirmSelection(data) {
				//确定后
				console.log(data, '参数1')
				this.isAlertShow = false;
				var unLoadingArray = this.unLoadingArray;
				var isLoading = this.isLoading;
				if (isLoading) {
					//装货
					this.loadingArray = data;
					if (unLoadingArray.length < 1) {
						this.isLoading = false;
						this.isAlertShow = true
					}
					
				} else {
					this.unLoadingArray = data
				}
			},
			
			backToFromPage() {
				uni.navigateBack({
					delta: 1
				})
			},
			setLen(index) {
				var carLen = this.carLen;
				var isSelectedCarLen = this.isSelectedCarLen;
				var isSelected = carLen[index].isSelected;
				var sid =  carLen[index].sid;
				if (isSelected) {
					var findIndex = isSelectedCarLen.findIndex(item => {
						return item.sid == sid
					})
					if (findIndex > -1) {
						isSelectedCarLen.splice(findIndex, 1);
					}
				} else {
					if (isSelectedCarLen.length > 2) {
						uni.showToast({
							title: '最多选择三项',
							icon: 'none'
						})
						return;
					}
					isSelectedCarLen.push(carLen[index]);
				}
				carLen[index].isSelected = !isSelected;
				this.carLen = carLen;
				this.isSelectedCarLen = isSelectedCarLen
				this.$forceUpdate();
			},
			setCarType(index) {
				var carType = this.carType;
				var isSelectedCarType = this.isSelectedCarType;
				var isSelected = carType[index].isSelected;
				var sid =  carType[index].sid;
				if (isSelected) {
					var findIndex = isSelectedCarType.findIndex(item => {
						return item.sid == sid
					})
					if (findIndex > -1) {
						isSelectedCarType.splice(findIndex, 1);
					}
				} else {
					if (isSelectedCarType.length > 2) {
						uni.showToast({
							title: '最多选择三项',
							icon: 'none'
						})
						return;
					}
					isSelectedCarType.push(carType[index]);
				}
				carType[index].isSelected = !isSelected;
				this.carType = carType;
				this.isSelectedCarType = isSelectedCarType;
				this.$forceUpdate();
			},
			chooseInfo() {
				//选择装货地
				
				this.isLoading = true
				
				this.isAlertShow = !this.isAlertShow
			},
			chooseUnInfo() {
				//选择卸货地
				
				this.isLoading = false
				
				this.isAlertShow = !this.isAlertShow
			},
			closeAlert() {
				this.isAlertShow = false
			},
		
			clearLoadingArr(index) {
				var loadingArray = this.loadingArray;
				loadingArray.splice(index, 1);
				this.loadingArray = loadingArray
			},
			clearunLoadingArr(index) {
				var unLoadingArray = this.unLoadingArray;
				unLoadingArray.splice(index, 1);
				this.unLoadingArray = unLoadingArray
			},
			
			async sendParams(params) {
				try{
					uni.showLoading({
						title: '提交中'
					})
					var url = "";
					var navigateTitle = this.navigateTitle;
					if (navigateTitle) {
						url = "/td/circuit/update"
					} else {
						url = '/td/circuit/add'
					}
					
					
					var response = await service.postRequest(url, params);
					uni.hideLoading();
					console.log(response, 'asaaa')
					if (response.retCode == "0000000") {
						var title = this.navigateTitle ? '编辑线路成功！' : '添加线路成功！';
						uni.showToast({
							title: title,
							icon: 'success'
						})
						uni.$emit("refreshRoute");
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
					} else {
						uni.showToast({
							title: response.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					//TODO handle the exception
					uni.hideLoading();
				}
				
			},
			send() {
				//确认提交线路
				var that = this;
				if (!service.btnRepeat()) return;
				var loadingArray = this.loadingArray;
				var unLoadingArray = this.unLoadingArray;
				var isSelectedCarLen = this.isSelectedCarLen;
				var isSelectedCarType = this.isSelectedCarType;
				if (loadingArray.length < 1) {
					uni.showToast({
						title: '请选择装货地',
						icon: 'none'
					})
					return
				}
				if (unLoadingArray.length < 1) {
					uni.showToast({
						title: '请选择卸货地',
						icon: 'none'
					})
					return
				}
				if (isSelectedCarLen.length < 1) {
					uni.showToast({
						title: '请选择车长',
						icon: 'none'
					})
					return
				}
				if (isSelectedCarType.length < 1) {
					uni.showToast({
						title: '请选择车型',
						icon: 'none'
					})
					return
				}
				var params = new Object,
				startOffProvince = loadingArray[0].provinceName,
				startOffProvinceCode = loadingArray[0].provinceCode,
				startOffCity = "",
				startOffCityCode = "",
				arriveProvinceCode = unLoadingArray[0].provinceCode,
				arriveProvince = unLoadingArray[0].provinceName,
				arriveCityCode = "",
				arriveCity = "",
				vehicleLength = [],
				vehicleModel = [];
				if (loadingArray[0].cityName) {
					startOffCity = loadingArray[0].cityName;
					startOffCityCode = loadingArray[0].cityCode;
				}
				
				if (unLoadingArray[0].cityName) {
					arriveCity = unLoadingArray[0].cityName;
					arriveCityCode = unLoadingArray[0].cityCode;
					
				}
				
				isSelectedCarLen.forEach(item => {
					vehicleLength.push(item.typeName)
				})
				isSelectedCarType.forEach(item => {
					vehicleModel.push(item.typeName)
				})
				var circuitType = "";
				if (startOffCity) {
					circuitType += "2-"
				} else {
					circuitType += "1-"
				}
				if (arriveCity.length > 0) {
					circuitType += "2"
				} else {
					circuitType += "1";
				}
				var params = {
					vehicleLength: vehicleLength.join(","),
					vehicleModel: vehicleModel.join(','),
					startOffProvince,
					startOffProvinceCode,
					startOffCity: startOffCity || null,
					startOffCityCode: startOffCityCode || null,
					arriveProvinceCode,
					arriveProvince,
					arriveCityCode: arriveCityCode || null,
					arriveCity: arriveCity || null,
					circuitType: circuitType
				}
				console.log(this.routeData, '参数11')
				if (this.navigateTitle) {
					params.sid = this.routeData.sid;
				}
				console.log(JSON.stringify(params), '参数11');
				
				that.debounce(that.sendParams, 500, params)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.newHeader {
		width: 750rpx;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #FFFFFF;
		z-index: 9;
		.headBox {
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			font-size:32rpx;
			color:#333333;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			position: relative;
			.icon_left {
				position: absolute;
				left:0;
				width: 80rpx;
				height: 88rpx;
				top: 0;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				
			}
			.text {
				font-weight: 500;
			}
		}
	}
	.container {
		min-height: 100vh;
		background-color: rgba(243, 243, 243, 1);
		padding: 20rpx 16rpx 202rpx 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		overflow: auto;
		&.active {
			overflow: hidden;
		}
		
		.addr {
			background-color: #FFFFFF;
			border-radius: 12rpx;
			padding: 32rpx 0 10rpx;
			display: flex;
			flex-direction: column;
			margin-bottom: 20rpx;
			margin-top: 20rpx;
			.startContent {
				padding: 0 58rpx;
			}
			.title {
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #333333;
				.dotted {
					width: 16rpx;
					height: 16rpx;
					background-color: #4AA2F3;
					border-radius: 4rpx;
					margin-right: 20rpx;
					&.end {
						background-color: #F29347;
					}
				}
				.main {
					font-size: 28rpx;
					font-weight: 500;
				}
				.sub {
					color: #777777;
					font-size: 28rpx;
				}
			}
			.btnAdd {
				width: 152rpx;
				height: 64rpx;
				color: #777777;
				border-radius: 12rpx;
				border: 1px solid #AAAAAA;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 24rpx 0 30rpx;
				.addIcon {
					width: 22rpx;
					height: 22rpx;
				}
			}
			.line {
				width: calc(100vw - 32rpx);
				height: 0;
				border-bottom: 1px solid #F2F3F3;
				margin-bottom: 32rpx;
			}
		}
		.item {
			background-color: #FFFFFF;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			.title {
				padding: 32rpx 24rpx 32rpx 20rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				.main {
					color: #222222;
					font-weight: 500;
					font-size: 32rpx;
				}
				.sub {
					font-size: 24rpx;
					color: #777777;
				}
			}
			.list {
				margin: 0 56rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.listE {
					margin-right: 26rpx;
					margin-bottom: 24rpx;
					width: 126rpx;
					height: 52rpx;
					border: 2rpx solid #979797;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #777777;
					font-size: 24rpx;
					&:nth-child(4n + 4) {
						margin-right: 0;
					}
					&.active {
						background-color: #4AA2F3;
						color: #FFFFFF;
						border-color: #4AA2F3;
					}
				}
			}
		}
		.fix-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			height: 136rpx;
			background-color: #FFFFFF;
			border-radius: 24rpx 24rpx 0 0;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);  
			padding-bottom: env(safe-area-inset-bottom);  
			.send {
				flex: 1;
				height: 104rpx;
				border-radius: 44rpx;
				background-color: #4AA2F3;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 52rpx;
			}
		}
		
	}
	.loadArr {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		.item {
			margin-top: 20rpx;
			padding: 0 20rpx;
			height: 66rpx;
			background-color: rgba(74, 162, 243, 0.16);
			border: 1px solid rgba(74, 162, 243, 1);
			border-radius: 12rpx;
			color: rgba(74, 162, 243, 1);font-size: 30rpx;
			display: flex;
			justify-content: center;align-items: center;
			margin-right: 24rpx;
			
			.close {
				width: 18rpx;
				height: 18rpx;
				margin-left: 10rpx;
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
			.itemPicker {
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
