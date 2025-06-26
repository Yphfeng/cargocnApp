<template>
	<view class="chooseRegion">
		<view class="areaPopupHead">
			<view class="cancelBtn" @click="closePopup()">取消</view>
			<view class="title">选择地址</view>
			<view class="confirm" @click="toCheckAddress()">确定</view>
		</view>
		<view class="popupSearchBox">
			<view class="searchBox" :style="showSearchData ? 'background-color: #FFF;' : 'background-color: #F3F3F3;'">
				<image class="searchIcon" src="../static/images/search.png" @click="searchArea"></image>
				<input
					class="searchInput"
					maxlength="20"
					v-model="searchVal"
					placeholder="搜索城市名称"
					placeholder-style="font-size:32rpx;color:#999;"
					@confirm="searchArea"
					@blur="searchInputBlur"
					@focus="searchInputFocus"
					@input="toSearch"
				/>
				<image v-if="showSearchData && searchVal" class="searchDeleteIcon" src="../static/images/close2.png" @click="deleteSearchVal()"></image>
			</view>
		</view>
		<view class="areaBox" v-if="!showSearchData">
			<scroll-view class="mainAreaBox" :scroll-y="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="provinceScrollKey">
				<view class="areaBtn" v-for="(item, provinceIndex) in allAreaInfo" :key="provinceIndex" :id="'province' + provinceIndex" @click="checkProvince(item, provinceIndex)" :style="checkedProvince == provinceIndex ? 'background: #FFF;color:#0171F9;' : 'background: #F3F3F3;color:#333;'">
					{{replaceProvince(item.name)}}
				</view>
			</scroll-view>
			<scroll-view :scroll-top="cityScrollTop" class="mainAreaBox" :scroll-y="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="cityScrollKey">
				<view class="areaBtn" v-for="(item, cityIndex) in showCityInfo" :key="cityIndex" :id="'city' + cityIndex" @click="checkCity(item, cityIndex)" :style="checkedCity == cityIndex ? 'color:#0171F9;' : 'color:#333;'">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view :scroll-top="areaScrollTop" class="mainAreaBox areaItem" :scroll-y="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="areaScrollKey">
				<view class="areaBtn" v-for="(item, areaIndex) in showAreaInfo" :key="areaIndex" :id="'area' + areaIndex" @click="checkArea(item, areaIndex)" :style="checkedArea == areaIndex ? 'color:#0171F9;' : 'color:#333;'">
					{{item.name}}
				</view>
			</scroll-view>
		</view>
		<view class="searchDataBox" v-if="showSearchData">
			<scroll-view :scroll-top="searchScrollTop" style="height:800rpx;" :scroll-y="true" :show-scrollbar="false">
				<view
					v-for="(item, index) in searchData"
					:key="index"
					class="searchDataList"
					@click="chooseAddress(index)"
					:style="checkedAddressKey == index.toString() ? 'background-color: #E0EFFD;' : 'background-color: #FFF;'">
					{{item.showSearchAddress}}
				</view>
				<view v-if="noSearchData" class="noSearchMsg">暂无搜索结果</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			regionFlag: {
				type: String,
				default: 'checkStartRegion'
			},
			checkedRegionObj: {
				type: Object
			}
		},
		name:"chooseRegion",
		data() {
			return {
				addressItem: '',
				searchVal: '',
				showSearchData: false,
				allAreaInfo: [],
				checkedProvince: '0', // 选中的省
				showCityInfo: [],
				checkedCity: '0', // 选中的市
				showAreaInfo: [],
				checkedArea: '0', // 选中的区
				region: [],
				secondAry: [],
				thirdAry: [],
				cityScrollTop: 0,
				areaScrollTop: 0,
				searchData: [],
				checkedAddressKey: '',
				searchScrollTop: 0,
				noSearchData: false,
				provinceScrollKey: 'province0',
				cityScrollKey: 'city0',
				areaScrollKey: 'area0',
			};
		},
		created() {
			console.log('onLoad');
			this.allAreaInfo = uni.getStorageSync('regionData');
			if(this.allAreaInfo && this.allAreaInfo.length > 0) {
				for(let i in this.allAreaInfo) {
					// if(this.allAreaInfo[i].code == '310000' || this.allAreaInfo[i].code == '110000' || this.allAreaInfo[i].code == '500000' || this.allAreaInfo[i].code == '120000') {
					// 	this.allAreaInfo[i].name = this.allAreaInfo[i].name + '市';
					// }
					// new搜索逻辑：将省市区字段拼接，塞入省市下area各个对象,key命名为'searchMsg'。
					let cityItem = this.allAreaInfo[i].cities;
					for(let c in cityItem) {
						if(cityItem[c].areas && cityItem[c].areas.length > 0) {
							let areaItem = cityItem[c].areas;
							for(let a in areaItem) {
								this.allAreaInfo[i].cities[c].areas[a].searchMsg = cityItem[c].name + areaItem[a].name;
							}
						}else {
							this.allAreaInfo[i].cities[c].searchMsg = this.allAreaInfo[i].name + cityItem[c].name;
						}
					}
				}
				this.showCityInfo = this.allAreaInfo[this.checkedProvince].cities;
				this.showAreaInfo = this.showCityInfo[this.checkedCity].areas;
				if(this.checkedRegionObj && this.checkedRegionObj.provinceCode) {
					console.log('子组件接收已有数据', this.checkedRegionObj);
					this.addressItem = {
						"provinceName": this.checkedRegionObj.province,
						"provinceCode": this.checkedRegionObj.provinceCode,
						"cityName": this.checkedRegionObj.city,
						"cityCode": this.checkedRegionObj.cityCode,
						"areaName": this.checkedRegionObj.area,
						"areaCode": this.checkedRegionObj.areaCode,
					}
					this.showAreaPopup();
				}
			}
		},
		mounted() {
			
		},
		methods: {
			replaceProvince(name) { // 去除省的，省、市、自治区、维吾尔、壮族、回族
				let returnName = name.replace('省', '');
				returnName = returnName.replace('市', '');
				returnName = returnName.replace('自治区', '');
				returnName = returnName.replace('维吾尔', '');
				returnName = returnName.replace('壮族', '');
				returnName = returnName.replace('回族', '');
				return returnName;
			},
			toSearch(e) {
				console.log(e);
				if(!this.searchVal) {
					this.searchData = [];
					this.checkedAddressKey = '';
					// this.noSearchData = false;
					// this.showSearchData = false;
				}else {
					this.showSearchData = true;
					this.searchArea();
				}
			},
			deleteSearchVal() {
				this.searchVal = '';
				this.searchData = [];
				this.checkedAddressKey = '';
				this.noSearchData = false;
				this.showSearchData = false;
			},
			chooseAddress(key) {
				this.checkedAddressKey = key.toString();
				this.addressItem = {
					provinceName: this.searchData[this.checkedAddressKey].provinceName,
					provinceCode: this.searchData[this.checkedAddressKey].provinceCode,
					cityName: this.searchData[this.checkedAddressKey].cityName,
					cityCode: this.searchData[this.checkedAddressKey].cityCode,
					areaName: this.searchData[this.checkedAddressKey].areaName,
					areaCode: this.searchData[this.checkedAddressKey].areaCode,
				}
				// console.log(this.addressItem);
				uni.$emit(this.regionFlag, this.addressItem);
				this.refrushData();
			},
			searchInputBlur(e) {
				if(this.searchVal) {
					this.showSearchData = true;
				}else {
					this.showSearchData = false;
					this.searchData = [];
					this.checkedAddressKey = '';
				}
			},
			searchInputFocus(e) {
				// this.showSearchData = true;
			},
			searchArea() { // 搜索
				console.log('搜索开始开始');
				if(!this.searchVal) return;
				console.log('搜索参数', this.searchVal);
				uni.showLoading();
				let searchData = [];
				this.searchData = [];
				this.checkedAddressKey = '';
				this.noSearchData = false;
				try{
					// var searchProvinceCode = '';
					for(let i in this.allAreaInfo) {
						let cityItem = this.allAreaInfo[i].cities
						for(let c in cityItem) {
							if(cityItem[c].areas && cityItem[c].areas.length > 0) {
								let areaItem = cityItem[c].areas;
								for(let a in areaItem) {
									if(areaItem[a].searchMsg.indexOf(this.searchVal) > -1) {
										// searchProvinceCode = this.allAreaInfo[i].code;
										let provinceMsg3 = this.allAreaInfo[i].name;
										let checkedCity3 = this.allAreaInfo[i].cities;
										let cityMsg3 = checkedCity3[c].name;
										let checkedArea3 = checkedCity3[c].areas;
										let areaMsg3 = checkedArea3[a].name;
										let addressName3 = provinceMsg3 + '-' + cityMsg3 + '-' + areaMsg3;
										let obj3 = {
											provinceName: this.allAreaInfo[i].name,
											provinceCode: this.allAreaInfo[i].code,
											cityName: checkedCity3[c].name,
											cityCode: checkedCity3[c].code,
											areaName: checkedArea3[a].name,
											areaCode: checkedArea3[a].code,
											address: addressName3,
											showSearchAddress: checkedCity3[c].name + ' ' + checkedArea3[a].name
										}
										searchData.push(obj3)
									}
								}
							}else {
								if(cityItem[c].searchMsg.indexOf(this.searchVal) > -1) {
									// searchProvinceCode = this.allAreaInfo[i].code;
									let provinceMsg3 = this.allAreaInfo[i].name;
									let checkedCity3 = this.allAreaInfo[i].cities;
									let cityMsg3 = checkedCity3[c].name;
									// let checkedArea3 = checkedCity3[c].areas;
									// let areaMsg3 = checkedArea3[a].name;
									let addressName3 = provinceMsg3 + '-' + cityMsg3;
									let obj3 = {
										provinceName: this.allAreaInfo[i].name,
										provinceCode: this.allAreaInfo[i].code,
										cityName: checkedCity3[c].name,
										cityCode: checkedCity3[c].code,
										// areaName: checkedArea3[a].name,
										// areaCode: checkedArea3[a].code,
										address: addressName3,
										showSearchAddress: provinceMsg3 + ' ' + checkedCity3[c].name
									}
									searchData.push(obj3)
								}
							}
						}
					}
					console.log('搜索结果', searchData);
					if(searchData.length > 0) {
						let obj = {};
						// if(searchProvinceCode == '310000' || searchProvinceCode == '110000' || searchProvinceCode == '500000' || searchProvinceCode == '120000') {
						// 	this.searchData = searchData.reduce((arr,next) => {
						// 	    obj[next.cityCode] ? "" : obj[next.cityCode] = true && arr.push(next);
						// 	    return arr;
						// 	},[]) //设置arr默认类型为数组，并且初始值为空的数组
						// }else {
						// 	this.searchData = searchData.reduce((arr,next) => {
						// 	    obj[next.cityCode] ? "" : obj[next.cityCode] = true && arr.push(next);
						// 	    return arr;
						// 	},[]) //设置arr默认类型为数组，并且初始值为空的数组
						// }
						this.searchData = searchData.reduce((arr,next) => {
						    arr.push(next);
						    return arr;
						},[]) //设置arr默认类型为数组，并且初始值为空的数组
						console.log('搜索集合', this.searchData);
					}
				}catch(err){
					console.log('搜索异常', err);
				}finally{
					uni.hideLoading();
					this.searchScrollTop = 0;
					if(searchData.length == 0) {
						this.noSearchData = true;
					}
				}
				// for(let t in this.allAreaInfo) {
				// 	if(this.allAreaInfo[t].code == '310000' || this.allAreaInfo[t].code == '110000' || this.allAreaInfo[t].code == '500000' || this.allAreaInfo[t].code == '120000') {
				// 		console.log('直辖市', this.allAreaInfo[t]);
				// 	}
				// }
			},
			showAddressMsg() {
				if(!this.addressItem) return;
				// return this.allAreaInfo[this.checkedProvince].name + '-' + this.showCityInfo[this.checkedCity].name + '-' + this.showAreaInfo[this.checkedArea].name;
				return this.addressItem.provinceName + '-' + this.addressItem.cityName + '-' + this.addressItem.areaName
			},
			showAreaPopup() {
				// 打开弹窗，如果地址有数据，则匹配省市区对应key
				if(this.showAddressMsg()) {
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == this.addressItem.provinceCode) {
							let cityItem = this.allAreaInfo[i].cities;
							if(cityItem.length == 1) {
								let areaItem = cityItem[0].areas;
								for(let a in areaItem) {
									if(areaItem[a].code == this.addressItem.areaCode) {
										this.checkedProvince = i.toString();
										this.checkedCity = '0';
										this.checkedArea = a.toString();
										this.showCityInfo = this.allAreaInfo[this.checkedProvince].cities;
										this.showAreaInfo = this.showCityInfo[this.checkedCity].areas;
										this.provinceScrollKey = 'province' + i;
										this.cityScrollKey = 'city0';
										this.areaScrollKey = 'area' + a;
										// 省模块滚动位置为高度（模块高度为120rpx，取值为rpx/2）*key
										break;
									}
								}
							}else {
								for(let c in cityItem) {
									if(cityItem[c].code == this.addressItem.cityCode) {
										let areaItem = cityItem[c].areas;
										for(let a in areaItem) {
											if(areaItem[a].code == this.addressItem.areaCode) {
												this.checkedProvince = i.toString();
												this.checkedCity = c.toString();
												this.checkedArea = a.toString();
												this.showCityInfo = this.allAreaInfo[this.checkedProvince].cities;
												this.showAreaInfo = this.showCityInfo[this.checkedCity].areas;
												this.provinceScrollKey = 'province' + i;
												this.cityScrollKey = 'city' + c;
												this.areaScrollKey = 'area' + a;
												// 省模块滚动位置为高度（模块高度为120rpx，取值为rpx/2）*key
												break;
											}
										}
									}
								}
							}
						}
					}
				}
				// this.$refs.areaPopup.open();
			},
			closePopup() {
				// this.$refs.areaPopup.close();
				uni.$emit('closeRegionPopup');
			},
			refrushData() {
				this.searchVal = '';
				this.searchData = [];
				this.checkedAddressKey = '';
				this.noSearchData = false;
				this.showSearchData = false;
			},
			getRegionInfo() { // 在本地缓存有地区数据的情况下使用本地缓存数据，若本地无数据则请求接口
				let that = this;
				uni.getStorage({
				    key: 'regionData',
				    success: function (rRes) {
				        that.region = rRes.data;
				    },
					fail: function (rErr) {
						that.getRegionData();
					}
				});
				
			},
			getRegionData() { // 获取地区数据 ,并存入缓存
				let that = this;
				utils.postRequest('/ts/nationDict/getBasicData')
				.then(res=>{
					uni.setStorage({
					    key: 'regionData',
					    data: res.rspBody,
					    success: function (saveRes) {
							that.region = res.rspBody;
					    },
						fail: function (saveErr) {
						}
					});
				})
				.catch(err=>{
					console.log(err);
				})
			},
			checkProvince(item, key) { // 选择省
			// console.log(key);
				if(key != this.checkedProvince) {
					this.checkedProvince = key;
					this.provinceScrollKey = 'province' + key;
					this.showCityInfo = item.cities;
					this.checkedCity = '0';
					this.cityScrollTop = 1;
					this.$nextTick(function() {
						this.cityScrollTop = 0;
					});
					this.showAreaInfo = this.showCityInfo[this.checkedCity].areas;
					this.checkedArea = '0';
					this.areaScrollTop = 1;
					this.$nextTick(function() {
						this.areaScrollTop = 0;
					});
				}
			},
			checkCity(item, key) { // 选择市
				console.log('选择的市', item);
				if(key != this.checkedCity) {
					this.checkedCity = key;
					this.showAreaInfo = item.areas;
					this.cityScrollKey = 'city' + key;
					this.checkedArea = '0';
					this.areaScrollTop = 1;
					this.$nextTick(function() {
						this.areaScrollTop = 0;
					});
				}
				if(!this.showAreaInfo || this.showAreaInfo.length == 0) {
					this.toCheckAddress();
				}
			},
			checkArea(item, key) { // 选择区
				console.log('选择的区', item);
				if(key != this.checkedArea) {
					this.checkedArea = key;
				}
				this.toCheckAddress();
			},
			toSaveArea() {
				this.checkedAreaData = [];
				this.checkedAreaData = this.chooseAreaPopupData;
				this.addressArea = '';
				for(let i in this.checkedAreaData) {
					this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
				}
				this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
				this.address = '';
				this.msgDone = false;
				// this.$refs.chooseAreaPopup.close();
			},
			toCheckAddress() {
				console.log(this.showAreaInfo);
				if(this.showSearchData) {
					if(!this.checkedAddressKey) {
						uni.showToast({
							title: '请选择地址',
							icon: 'none',
							duration: 2000
						})
						return false;
					}
					this.addressItem = {
						provinceName: this.searchData[this.checkedAddressKey].provinceName,
						provinceCode: this.searchData[this.checkedAddressKey].provinceCode,
						cityName: this.searchData[this.checkedAddressKey].cityName,
						cityCode: this.searchData[this.checkedAddressKey].cityCode,
						areaName: this.searchData[this.checkedAddressKey].areaName ? this.searchData[this.checkedAddressKey].areaName : '',
						areaCode: this.searchData[this.checkedAddressKey].areaCode ? this.searchData[this.checkedAddressKey].areaCode : '',
					}
				}else {
					this.addressItem = {
						provinceName: this.allAreaInfo[this.checkedProvince].name,
						provinceCode: this.allAreaInfo[this.checkedProvince].code,
						cityName: this.showCityInfo[this.checkedCity].name,
						cityCode: this.showCityInfo[this.checkedCity].code,
						areaName: this.showAreaInfo[this.checkedArea] && this.showAreaInfo[this.checkedArea].name ? this.showAreaInfo[this.checkedArea].name : '',
						areaCode: this.showAreaInfo[this.checkedArea] && this.showAreaInfo[this.checkedArea].code ? this.showAreaInfo[this.checkedArea].code : '',
					}
				}
				uni.$emit(this.regionFlag, this.addressItem);
				this.refrushData();
			},
		}
	}
</script>

<style lang="scss">
	.chooseRegion {
		background-color: #FFF;
		.addressList {
			padding: 40rpx 30rpx;
			background-color: #FFF;
			display: flex;
			justify-content: space-between;
			border-bottom: 2rpx solid #AAA;
			.title {
				font-size: 28rpx;
				color:#333;
				flex-shrink: 0;
				margin-right: 30rpx;
			}
			.msg {
				font-size: 28rpx;
			}
		}
		.areaPopupHead {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			.cancelBtn {
				font-size: 36rpx;
				color:#777;
			}
			.title {
				font-size: 36rpx;
				font-weight: bold;
				color:#333;
			}
			.confirm {
				color:#FFF;
				background: #0171F9;
				font-size: 40rpx;
				text-align: center;
				padding: 0 32rpx;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 52rpx;
			}
		}
		.popupSearchBox {
			border-top: 1rpx solid #E3E3E3;
			border-bottom: 1rpx solid #E3E3E3;
			padding: 20rpx 30rpx;
			.searchBox {
				border-radius: 35rpx;
				padding: 0 20rpx;
				display: flex;
				align-items: center;
				border: 2rpx solid #F3F3F3;
				.searchIcon {
					width: 36rpx;
					height: 36rpx;
					flex-shrink: 0;
				}
				.searchDeleteIcon {
					width: 36rpx;
					height: 36rpx;
					flex-shrink: 0;
				}
				.searchInput {
					flex: 1;
					height: 70rpx;
					font-size: 32rpx;
					color:#333;
					margin: 0 10rpx;
				}
			}
		}
		.areaBox {
			height: 800rpx;
			display: flex;
			.areaItem {
				border-left: 1rpx solid #E3E3E3;
			}
			.mainAreaBox {
				flex: 0 0 33.33%;
				.areaBtn {
					height: 120rpx;
					line-height: 120rpx;
					padding: 0 20rpx;
					font-size: 32rpx;
					text-align: center;
					display: -webkit-box;
					overflow: hidden;
					word-break: break-all;  /* break-all(允许在单词内换行。) */
					text-overflow: ellipsis;  /* 超出部分省略号 */
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1; /** 显示的行数 **/
				}
			}
		}
		.searchDataBox {
			height: 800rpx;
			.noSearchMsg {
				padding: 20rpx 30rpx;
				text-align: center;
				font-size: 28rpx;
				color:#333;
			}
			.searchDataList {
				padding: 30rpx 30rpx;
				font-size: 32rpx;
				color:#333;
				border-bottom: 2rpx solid #F3F3F3;
			}
			.defaultAdddressBtn, .checkedAdddressBtn {
				font-size: 28rpx;
				text-align: center;
				padding: 0 32rpx;
				height: 64rpx;
				line-height: 64rpx;
				border-radius: 52rpx;
				border: 2rpx solid #0171F9;
				margin-bottom: 20rpx;
				margin-right: 30rpx;
			}
			.defaultAdddressBtn {
				color:#0171F9;
				background: #FFF;
			}
			.checkedAdddressBtn {
				color:#FFF;
				background: #0171F9;
			}
		}
	}
</style>
