<template>
	<view class="selection">
		<view class="bg" @click="closeAlert" :class="{active: isAlertShow}" />
		<view class="alertContent" :class="{active: isAlertShow}">
				<view class="title">
					<view @click="cancel">取消</view>
					<view class="mainText">
						<view class="dot" :class="{active: isLoading}" />
						<text>{{isLoading ? '请选择装货地' : '请选择卸货地'}}</text>
					</view>
					<view class="next" @click="goNext()">
						{{isSelectedCityIndex > -1  ? '确定' : '下一步'}}
					</view>
				</view>
				<view class="info">
					<swiper class="swiper" :autoplay="false" :current="currentIndex" :disable-touch="true">
						<swiper-item>
							<scroll-view scroll-y="true" class="swiper-item">
						
								<view class="subMain">{{isLoading ? '请选择装货地' : '请选择卸货地'}}</view>
								<view class="con">
									<view class="item province" v-for="(item, index) in provinceArr">
										<view class="itemBtn" :class="{active: isSelectedProvince == index}" @click="chooseProvince(index)">{{item.provinceNamed}}</view>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item>
							<scroll-view scroll-y="true" class="swiper-item">
								<view class="subMain next1">
									<view class="subTitle" v-if="provinceArr[isSelectedProvince]">
										<text>{{provinceArr[isSelectedProvince].provinceNamed}}</text>
										<view class="line" />
										<view class="area_1">
											请选择市
										</view>
									</view>
									<view class="back" @click="backSwiper">返回上一级</view>
								</view>
							
								<view class="con">
									<view class="item area" v-for="(item, index) in cityArr">
										<view class="itemBtn" :class="{active: isSelectedCityIndex == index}" @click="chooseCity(index)">{{item.cityNamed}}</view>
									</view>
								</view>
								
								
							</scroll-view>
						</swiper-item>
						<swiper-item>
								<scroll-view scroll-y="true" class="swiper-item">
									<view class="subMain next1">
										<text>已选择区</text>
									</view>
									<view class="main">
										<view class="item" v-for="(item, index) in isSelectedArea" @click="closeArea(index)">
											<text>{{item.areaNamed}}</text>
											<image src="../static/images/newCancel.png" class="close"></image>
										</view>
									</view>
									<view class="subMain">
										<view class="subTitle" v-if="isSelectedCityArr.length == 1">
											<text>{{provinceArr[isSelectedProvince].provinceNamed}}</text>
											<view class="line" /> 
											<text>{{isSelectedCityArr[0].cityNamed}}</text>
											<view class="line" />
											<view class="area_1">
												请选择区
											</view>
										</view>
										<view class="back" @click="backSwiper">返回上一级</view>
										
									</view>
									<view class="con">
										<view class="item area" v-for="(item, index) in areaArr">
											<view class="itemBtn" :class="{active: item.isSelected}" @click="chooseArea(index)">{{item.areaNamed}}</view>
										</view>
									</view>
								</scroll-view>
						</swiper-item>
					</swiper>
				</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "UniSelection",
		props: {
			provinceArr: {
				type: Array,
				default: [],
			},
			isAlertShow: {
				type: Boolean,
				default: false,
			},
			isLoading: {
				type: Boolean,
				default: true, //默认是装货地
			},
			loadingArray: {
				type: Array,
				default: []
			},
			unLoadingArray: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				cityArr: [],
				areaArr: [],
				isSelectedCityIndex: -1,
				isSelectedProvince: -1,
				isSelectedAreaIndex: -1,
				isSelectedArea: [],
				currentIndex: 0,
				isSelectedCityArr: [],
				
			}
		},
		watch: {
			isLoading(newVal, oldVal) {
				if (newVal != oldVal) {
					this.unLoadingInit();
				}
			}
		},
		updated() {
			var provinceArr = this.provinceArr;
			if (provinceArr.length > 0) {
				provinceArr.forEach((item, index, arr) => {
					var provinceNamed = item.name;
					var cities = item.cities;
					provinceNamed = provinceNamed.split('省')[0];
					 if (provinceNamed.indexOf("内蒙古自治区") > -1) {
						 provinceNamed = "内蒙古"
					 } else if (provinceNamed.indexOf("自治区") > -1) {
						 provinceNamed = provinceNamed.substring(0 ,2);
					 } else if (provinceNamed.indexOf("特别行政区") > -1) {
						 provinceNamed = provinceNamed.substring(0 ,2);
					 }
					 arr[index].provinceNamed = provinceNamed
					 //处理市
					 cities.forEach(atem => {
						 var cityNamed = atem.name;
						 var areas = atem.areas;
						 if (cityNamed.indexOf("回族自治州") > -1) {
							 cityNamed = cityNamed.split('回族自治州')[0];
						 } else if (cityNamed.indexOf("蒙古自治州") > -1) {
							 cityNamed = cityNamed.split('蒙古自治州')[0];
						 } else if (cityNamed.indexOf("自治州") > -1) {
							 cityNamed = cityNamed.split('自治州')[0];
						 } else if (cityNamed.indexOf("地区") > -1) {
							 cityNamed = cityNamed.split('地区')[0];
						 } else if (cityNamed.indexOf("土家族苗族") > -1) {
							 cityNamed = cityNamed.split('土家族苗族')[0];
						 } else if (cityNamed.indexOf("市") > -1) {
							 cityNamed = cityNamed.split('市')[0];
						 }
						 
						 atem.cityNamed = cityNamed;
						 //处理区
						 areas.forEach(i => {
							 var areaNamed = i.name;
							 if (areaNamed.length <= 3) {
								 i.areaNamed = areaNamed
							 } else {
								 if (areaNamed.indexOf("新区") > -1) {
								 								 areaNamed = areaNamed.split("新区")[0]
								 } else if (areaNamed.indexOf("区") > -1) {
								 								 areaNamed = areaNamed.split("区")[0]
								 } else if (areaNamed.indexOf("县")> -1) {
								 								 areaNamed = areaNamed.split("县")[0]
								 } else if (areaNamed.indexOf("市") > -1) {
								 								 areaNamed = areaNamed.split("市")[0]
								 }
								 i.areaNamed = areaNamed
							 }
						 })
					 })
				})
			}
			this.provinceArr = provinceArr;
		},
		methods: {
			backSwiper() {
				var currentIndex = this.currentIndex;
				if (currentIndex == 1) {
					//清除选择的市
					this.clearCity();
				} else if (currentIndex == 2) {
					//清除选择的区
					this.clearArea();
				}
				this.currentIndex = currentIndex - 1;
			},
			clearCity() {
				this.isSelectedCityIndex = -1;
				this.isSelectedCityArr = [];
				var cityArr = this.cityArr;
				cityArr.forEach(item => {
					item.isSelected = false;
				})
				this.cityArr = cityArr;
			},
			clearArea() {
				this.isSelectedArea = [];
				this.isSelectedAreaIndex = -1;
				var areaArr = this.areaArr;
				areaArr.forEach(item => {
					item.isSelected = false;
				})
				this.areaArr = areaArr;
			},
			closeArea(index) {
				var areaArr = this.areaArr;
				var isSelectedArea = this.isSelectedArea;
				var code = isSelectedArea[index].code;
				
				var findIndex = areaArr.findIndex(item => {
					return item.code == code
				})
				if (findIndex > -1) {
					areaArr[findIndex].isSelected = false;
				}
				isSelectedArea.splice(index, 1)
				this.isSelectedArea = isSelectedArea;
				this.areaArr = areaArr;
			},
			closeAlert() {
				this.$emit('closeAlert');
			},
			goNext() {
				var index = this.isLoading;
				var loadingArray = this.loadingArray;
				var unLoadingArray = this.unLoadingArray;
				var currentIndex = this.currentIndex;
				var isSelectedProvince = this.isSelectedProvince;
				var isSelectedCityArr = this.isSelectedCityArr;
				var isSelectedCityIndex = this.isSelectedCityIndex;
				var provinceArr = this.provinceArr;
				var cityArr = this.cityArr;
				var arr = [];
				var currentIndex = this.currentIndex;
				if (currentIndex == 0) {
					if (isSelectedProvince < 0) {
						uni.showToast({
							title: '请选择省',
							icon: 'none'
						})
						return;
					}
				} else if (currentIndex == 1) {
					if (isSelectedCityArr.length < 1) {
						uni.showToast({
							title: '请选择市',
							icon: 'none'
						})
						return;
					}
				}
				 
				if (index) {
					//装货确定
					var isSelectedCityArr = this.isSelectedCityArr;
					if (isSelectedCityIndex == 0) {
						//选择了全省
						arr = [{
							name: provinceArr[isSelectedProvince].name,
							code: provinceArr[isSelectedProvince].code,
							provinceName: provinceArr[isSelectedProvince].name,
							provinceCode: provinceArr[isSelectedProvince].code,
						}]
						console.log(arr, '参数')
						loadingArray = arr;
						
						this.unLoadingInit();
					} else {
						//选择的是市
						arr = [{
							name: cityArr[isSelectedCityIndex].name,
							code: cityArr[isSelectedCityIndex].code,
							provinceName: provinceArr[isSelectedProvince].name,
							provinceCode: provinceArr[isSelectedProvince].code,
							cityName: isSelectedCityArr[0].name,
							cityCode: isSelectedCityArr[0].code
							
						}]
						console.log(arr, '参数')
						loadingArray = arr;
						
						this.unLoadingInit();
					}
					console.log(loadingArray, '阿山山水水')
					this.$emit("confirmSelection", loadingArray)
					
				} else {
					//卸货确定
					if (isSelectedCityIndex == 0) {
						//选择的是全省
						arr = [{
							name: cityArr[isSelectedCityIndex].subName,
							code: cityArr[isSelectedCityIndex].code,
							provinceName: cityArr[isSelectedCityIndex].subName,
							provinceCode: cityArr[isSelectedCityIndex].code,
						}]
						unLoadingArray = arr;
						this.unLoadingInit();
						
					} else {
						
						arr = [{
							name: cityArr[isSelectedCityIndex].name,
							code: cityArr[isSelectedCityIndex].code,
							provinceName: provinceArr[isSelectedProvince].name,
							provinceCode: provinceArr[isSelectedProvince].code,
							cityName: isSelectedCityArr[0].name,
							cityCode: isSelectedCityArr[0].code
							
						}]
						unLoadingArray = arr;
						this.unLoadingInit();
						
					}
					
					this.$emit("confirmSelection", unLoadingArray)
					
				}
			},
			unLoadingInit() {
				this.isSelectedCityArr = [];
				this.isSelectedProvince = -1;
				this.isSelectedCityIndex = -1;
				this.currentIndex = 0;
			},
			chooseProvince(index) {
				if (index == this.isSelectedProvince) {
					return;
				}
				var cities = this.provinceArr[index].cities;
				var cityWhole = [{
					name: "全省",
					subName: this.provinceArr[index].name,
					code: this.provinceArr[index].code,
					cityNamed: "全省",
				}]
				this.cityArr = cityWhole.concat(cities);
				console.log(this.cityArr, 'aaaa')
				this.isSelectedProvince = index;
				this.currentIndex = 1
			},
			chooseCity(index) {
				var cityArr = this.cityArr;
				var isSelectedCityArr = this.isSelectedCityArr;
				var isSelectedProvince = this.isSelectedProvince;
				isSelectedCityArr = [cityArr[index]];
				if (index != 0) {
					var areaArr = cityArr[index].areas;
					var areaWhole = [{
						name: "全市",
						areaNamed: '全市',
						subName: cityArr[index].name,
						code: cityArr[index].code				
					}]
					this.areaArr = areaWhole.concat(areaArr);
				}
				this.isSelectedCityIndex = index;
				this.isSelectedCityArr = isSelectedCityArr;
				this.cityArr = cityArr;
			},
			chooseArea(index) {
				var areaArr = this.areaArr;
				var isSelectedArea = this.isSelectedArea;
				var isSelected = areaArr[index].isSelected;
				if (isSelected) {
					return
				} else {
					if (index == 0) {
						isSelectedArea = [areaArr[index]]
						areaArr.forEach((item, i) => {
							if(i !== 0) {
								item.isSelected = false
							} else {
								item.isSelected = true
							}
						})
					} else {
						if (isSelectedArea.length >= 2) {
							uni.showToast({
								title: '最多选择两项',
								icon: 'none',
							})
							return;
						}
						
						areaArr[0].isSelected = false;
						var findIndex = isSelectedArea.findIndex(item => {
							return item.code == areaArr[0].code
						})
						if (findIndex > -1) {
							isSelectedArea.splice(findIndex, 1);
						}
						
						var provinceArr = this.provinceArr;
						var cityArr = this.isSelectedCityArr;
						var isSelectedProvince = this.isSelectedProvince;
						var isSelectedCity = this.isSelectedCity;
						isSelectedArea.push({
							...areaArr[index],
							provinceName: provinceArr[isSelectedProvince].name,
							provinceCode: provinceArr[isSelectedProvince].code,
							cityName: cityArr[0].name,
							cityCode: cityArr[0].code,
							areaName: areaArr[index].name,
							areaCode: areaArr[index].code,
						});
						areaArr[index].isSelected = true;
					}
					this.isSelectedAreaIndex = index;
					
				}
				this.isSelectedArea = isSelectedArea;
				this.areaArr = areaArr;
			},
			cancel() {
				this.unLoadingInit();
				this.$emit('closeAlert');
			},
		}
	}
</script>

<style scoped lang="scss">
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9;
		display: none;
		background-color: rgba(34, 34, 34, 0.8);
		&.active {
			display: block;
		}
	}
	.alertContent {
		position: fixed;
		bottom: -50rpx;
		left: 0;
		width: 100vw;
		height: 0;
		background-color: rgba(34, 34, 34, 0.8);
		z-index: 99;
		background-color: #FFFFFF;
		transition: all .3s ease-out;
		display: flex;
		flex-direction: column;
		&.active {
			height: calc(100vh - 158rpx);
		}
			.title {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 0 40rpx;
				align-items: center;
				height: 100rpx;
				z-index: 9999;
				box-sizing: border-box;
				.cancel {
					font-size: 32rpx;
					color: rgba(119, 119, 119, 1);
				}
				.mainText {
					display: flex;
					flex-direction: row;
					font-size: 30rpx;
					align-items: center;
					justify-content: center;
					color: rgba(0, 0, 0, 1);
					.dot {
						width: 16rpx;
						height: 16rpx;
						background-color: rgba(74, 162, 243, 1);
						border-radius: 4rpx;
						margin-right: 10rpx;
						&.active {
							background-color: rgba(242, 147, 71, 1);
						}
					}
				}
				.next {
					width: 126rpx;
					height: 60rpx;
					border-radius: 30rpx;
					background-color: rgba(74, 162, 243, 1);
					color: #FFFFFF;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.info {
				.swiper {
					height: calc(100vh - 350rpx);
				}
				.swiper-item {
					height: calc(100vh - 350rpx);
					padding: 16rpx 0;
					.main {
						display: flex;
						flex-direction: row;
						padding: 0 32rpx;
						.item {
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
					.con {
						width: calc(100vw - 42rpx);
						box-sizing: border-box;
						margin-left: 21rpx;
						.item {
							padding: 0 11rpx;
							margin-bottom: 24rpx;
							box-sizing: border-box;
							float:left;
							&.province {
								width: 25%;
								
							}
							&.area {
								min-width: 25%;
							}
							.itemBtn {
								display: flex;
								justify-content: center;
								align-items: center;
								height: 66rpx;
								line-height: 66rpx;
								font-size: 30rpx;
								color: rgba(51, 51, 51, 1);
								background-color: rgba(240, 241, 242, 1);
								border-radius: 12rpx;
								border: 1px solid rgba(240, 241, 242, 1);
								box-sizing: border-box;
								&.active {
									background-color: rgba(74, 162, 243, 0.15);
									color: rgba(74, 162, 243, 1);
									border-color: rgba(74, 162, 243, 1);
								}
							}
						}
					}
					.subMain {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						padding: 0 32rpx;
						height: 80rpx;
						&.next1 {
							border-top: 1px solid rgba(231, 233, 234, 1);
						} 
						.back {
							font-size: 26rpx;
							color: rgba(74, 162, 243, 1);
						}
					}
					.subTitle {
						font-size: 28rpx;
						color: rgba(0, 0, 0, 1);
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-start;
						
						.line {
							width: 18rpx;
							height: 4rpx;
							background-color: rgba(0, 0, 0, 1);
							margin: 0 22rpx;
						}
						.area_1 {
							color: rgba(74, 162, 243, 1);
							border-bottom: 4rpx solid rgba(74, 162, 243, 1);
							font-size: 28rpx;
							padding: 10rpx 0;
							margin-left: 10rpx;
						}
					}
				}
			}
		
	}
</style>
