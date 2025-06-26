<template>
	<view class="chooseArea">
		<view class="searchBox">
			<image class="searchIcon" @click="searchArea" src="/static/images/newOrderDetails/addressSearch.png"></image>
			<input
				class="searchInput"
				maxlength="20"
				placeholder="请输入名称查询，最多可选择1个起始地"
				:placeholder-style="placeholderStyle"
				v-model="searchVal"
				@confirm="searchArea"
				@blur="searchInputBlur"
				@focus="searchInputFocus"
				@input="toSearch"
			/>
			<image v-if="showSearchData && searchVal" class="searchDeleteIcon" src="/static/images/close2.png" @click="deleteSearchVal()"></image>
		</view>
		<view v-if="!showSearchData">
			<view class="userLocationMsg" v-if="userLocationObj.province" @click="chooseUserLocation()">选择当前定位：{{showUserLocation()}}</view>
			<view class="addressScrollBox">
				<scroll-view class="scrollCol" :scroll-y="true">
					<view class="selectMsg" v-for="(item, index) in provinceArr" @click.stop="switchProIndex(item, index)">
						<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="chooseArea.provinceCode == item.code"></image>
						<text class="msg" :style="chooseArea.provinceCode == item.code ? 'color: #2B72F0;' : 'color: #333333;'">{{replaceProvince(item.name)}}</text>
					</view>
				</scroll-view>
				<scroll-view class="scrollCol" :scroll-y="true" v-if="!showCommonlyAddress">
					<view class="selectMsg" v-for="(item, index) in cityArr" @click.stop="switchCityIndex(item, index)">
						<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="chooseArea.cityCode == item.code"></image>
						<text class="msg" :style="chooseArea.cityCode == item.code ? 'color: #2B72F0;' : 'color: #333333;'">{{item.showName ? item.showName : item.name}}</text>
					</view>
				</scroll-view>
				<scroll-view class="scrollCol" :scroll-y="true" v-if="!showCommonlyAddress">
					<view class="selectMsg" v-for="(item, index) in areaArr" @click.stop="switchAreaIndex(item, index)">
						<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="chooseArea.areaCode == item.code"></image>
						<text class="msg" :style="chooseArea.areaCode == item.code ? 'color: #2B72F0;' : 'color: #333333;'">{{item.showName ? item.showName : item.name}}</text>
					</view>
				</scroll-view>
				<scroll-view class="commonlyCol" :scroll-y="true" v-if="showCommonlyAddress">
					<view class="commonlyAddressList">常用地址</view>
				</scroll-view>
			</view>
			
			<view class="btnGroup">
				<view class="cancelBtn" @click="toResetSelectData()">清空</view>
				<view class="confirmBtn" @click="toSaveArea()">确认</view>
			</view>
		</view>
		
		<scroll-view class="searchInfoBox" :scroll-y="true" v-if="showSearchData">
			<view class="searchInfoTitle" v-if="citiesData && citiesData.length> 0">市/自治区</view>
			<view class="searchContent">
				<view class="searchList" v-for="(item, index) in citiesData" :key="index" @click="checkSearchItem(item)">
					{{item.city}}
				</view>
			</view>
			<view class="searchInfoTitle" v-if="areaData && areaData.length> 0">县/区</view>
			<view class="searchContent">
				<view class="searchList" v-for="(item, index) in areaData" :key="index" @click="checkSearchItem(item)">
					{{item.area ? item.city + '-' + item.area : item.province + '-' + item.city}}
				</view>
			</view>
			<view v-if="noSearchData" class="noSearchMsg">暂无搜索结果</view>
		</scroll-view>
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				searchVal: '',
				placeholderStyle: 'font-size: 24rpx;color: #BEBEBE;',
				userLocationObj: {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				},
				provinceArr: [],
				cityArr: [],
				areaArr: [],
				chooseArea: {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				},
				showCommonlyAddress: false,
				showSearchData: false,
				citiesData: [],
				areaData: [],
				checkedAddressKey: '',
				searchScrollTop: 0,
				noSearchData: false,
				saveLoading: false,
				addressTypeKey: '',
				pageFlag: ''
			};
		},
		onLoad(options) {
			this.addressTypeKey = options.addressTypeKey ? Number(options.addressTypeKey) : '';
			this.pageFlag = options.pageFlag ? options.pageFlag : '';
			let areaMsg = options.areaMsg ? JSON.parse(options.areaMsg) : {};
			console.log('选择的地址', areaMsg);
			this.chooseArea = {
				province: areaMsg.province ? areaMsg.province : '',
				provinceCode: areaMsg.provinceCode ? areaMsg.provinceCode : '',
				city: areaMsg.city ? areaMsg.city : '',
				cityCode: areaMsg.cityCode ? areaMsg.cityCode : '',
				area: areaMsg.area ? areaMsg.area : '',
				areaCode: areaMsg.areaCode ? areaMsg.areaCode : '',
			}
			// console.log('选择的地址', this.chooseArea);
			uni.showLoading();
			this.getUserLocationInfo();
		},
		onReady() {
			let msg = '';
			console.log(this.addressTypeKey);
			switch(this.addressTypeKey) {
				case 1:
					msg = '选择装货地';
					break;
				case 2:
					msg = '选择卸货地';
					break;
				default:
					msg = '选择地址';
					break;
			};
			console.log(msg);
			uni.setNavigationBarTitle({
			    title: msg
			});
		},
		methods: {
			getUserLocationInfo() { // 获取用户当前定位
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						console.log( '当前定位', res);
						that.getLocationArea(res.longitude, res.latitude);
					},
					fail: function(err) {
						console.log(err);
						// uni.hideLoading();
						that.getProvince();
					}
				})
			},
			showUserLocation() {
				let obj = this.userLocationObj;
				if(obj.provinceCode == '310000' || obj.provinceCode == '110000' || obj.provinceCode == '500000' || obj.provinceCode == '120000') {
					if(obj.provinceCode == obj.cityCode) {
						return obj.province;
					}else {
						let returnMsg = obj.province;
						returnMsg = obj.city ? returnMsg + ' ' + obj.city : returnMsg;
						return returnMsg;
					}
				}else {
					if(!obj.cityCode) {
						return obj.province
					}else if(obj.cityCode == obj.areaCode) {
						return obj.city;
					}else {
						let returnMsg = obj.city;
						returnMsg = obj.area ? returnMsg + ' ' + obj.area : returnMsg;
						return returnMsg;
					}
				}
			},
			getLocationArea(longitude, latitude) {
				console.log('经纬度', longitude, latitude);
				let that = this;
				//根据地址搜索
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&location=' + longitude + ',' + latitude;
				console.log('搜索参数', parameters);
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('成功', res);
						if (res.statusCode == 200 && res.data.status == '1') {
							let regeocode = res.data.regeocode;
							let provinceCode = (regeocode.addressComponent.adcode.substr(0,3)) + '000';
							that.userLocationObj.province = regeocode.addressComponent.province;
							that.userLocationObj.provinceCode = provinceCode;
							
							if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
								that.userLocationObj.city = regeocode.addressComponent.district;
								that.userLocationObj.cityCode = regeocode.addressComponent.adcode;
								that.userLocationObj.area = '';
								that.userLocationObj.areaCode = '';
							}else {
								let cityCode = (regeocode.addressComponent.adcode.substr(0,2)) + regeocode.addressComponent.citycode
								that.userLocationObj.city = regeocode.addressComponent.city;
								that.userLocationObj.cityCode = cityCode;
								that.userLocationObj.area = regeocode.addressComponent.district;
								that.userLocationObj.areaCode = regeocode.addressComponent.adcode;
							}
							console.log('当前定位的地址', that.userLocationObj);
							that.getProvince();
						}else {
							uni.hideLoading();
							uni.showToast({
							    title: '地址解析失败，请更换地址或重新选择！',
								icon: 'none',
							    duration: 3000
							});
							that.getProvince();
						}
					},
					fail: (err) => {
						console.log('失败', err);
						uni.hideLoading();
						uni.showToast({
						    title: '地址解析失败，请更换地址或重新选择！',
							icon: 'none',
						    duration: 3000
						});
						that.getProvince();
					},
				});
			},
			getProvince() { // 从本地缓存获取省市区数据，本地缓存没有则从接口获取，再存入缓存
				var provinceLocal = uni.getStorageSync("regionData");
				if(provinceLocal) {
					// this.provinceArr = [{code: '000000', name: '常用线路'}, ...provinceLocal];
					this.provinceArr = [...provinceLocal];
					if(this.chooseArea.province) {
						this.switchAllArea();
					}
					// else {
					// 	this.switchProIndex(this.provinceArr[0], 0);
					// }
					uni.hideLoading();
				}else {
					let that = this;
					utils.postRequest('/ts/nationDict/getBasicData')
					.then(res => {
						if (res.retCode == "0000000") {
							var provinceArr = res.rspBody;
							// that.provinceArr = [{code: '000000', name: '常用线路'}, ...provinceArr];
							that.provinceArr = [...provinceArr];
							if(that.chooseArea.province) {
								that.switchAllArea();
							}
							// else {
							// 	that.switchProIndex(that.provinceArr[0], 0);
							// }
							uni.setStorage({
								key: 'regionData',
								data: res.rspBody,
								success: function(saveRes) {
									// console.log('地区数据缓存成功！', saveRes);
									uni.setStorageSync('regionUpdate', 1)
								},
								fail: function(saveErr) {
									// console.log('地区数据缓存失败！', saveErr);
								}
							});
							uni.hideLoading();
						} else {
							uni.hideLoading();
							// console.log('地区接口异常：', res.retDesc);
						}
					})
					.catch(err => {
						uni.hideLoading();
						// console.log('地区接口请求异常：', err);
					})
				}
			},
			chooseUserLocation() {
				this.chooseArea = {...this.userLocationObj};
				this.switchAllArea();
			},
			switchAllArea() { // 编辑
				console.log('编辑');
				let toSetAreaAry = this.isMunicipalitiesDirectly(this.chooseArea.provinceCode) ? 1 : 2;
				for(let i in this.provinceArr) {
					if(this.provinceArr[i].code == this.chooseArea.provinceCode) {
						this.pushDiyCityItem(this.provinceArr[i].code, i, toSetAreaAry);
						break;
					}
				}
			},
			pushDiyCityItem(provinceCode, index, toSetAreaAry) { // 根据传入的省或市code判断塞入 全市/全省
				var cities = this.provinceArr[index].cities;
				if(this.isMunicipalitiesDirectly(provinceCode)) {
					var coties = [{
						showName: '全市',
						name: this.provinceArr[index].name,
						code: provinceCode
					}, ...cities]
				}else {
					var coties = cities;
				}
				this.cityArr = coties;
				uni.hideLoading()
				if(toSetAreaAry && toSetAreaAry == 2) {
					for(let i in cities) {
						if(cities[i].code == this.chooseArea.cityCode) {
							this.pushAreaItem(this.chooseArea.cityCode, i);
							break;
						}
					}
				}
			},
			switchProIndex(item, index) { // 选择省
				if(item.code == '000000') { // 常用地址
					this.showCommonlyAddress = true;
					this.cityArr = [];
					this.chooseArea.city = '';
					this.chooseArea.cityCode = '';
					this.areaArr = [];
					this.chooseArea.area = '';
					this.chooseArea.areaCode = '';
				}else {
					if(this.chooseArea.provinceCode == item.code) return;
					this.areaArr = [];
					this.chooseArea.area = '';
					this.chooseArea.areaCode = '';
					this.chooseArea.province = item.name;
					this.chooseArea.provinceCode = item.code;
					this.pushDiyCityItem(this.chooseArea.provinceCode, index);
					this.showCommonlyAddress = false;
					this.$forceUpdate();
				}
			},
			switchCityIndex(item, index) { // 选择市
				console.log(item);
				if(this.chooseArea.cityCode == item.code) return;
				this.chooseArea.city = item.name;
				this.chooseArea.cityCode = item.code;
				let provinceCode = this.chooseArea.provinceCode;
				this.areaArr = [];
				this.chooseArea.area = '';
				this.chooseArea.areaCode = '';
				if(item.code == this.chooseArea.provinceCode || this.isMunicipalitiesDirectly(provinceCode)) {
					// 是否选择 全省 || 全市 || 直辖市
					
				}else {
					this.pushAreaItem(this.chooseArea.cityCode, index);
				}
			},
			pushAreaItem(cityCode, index) {
				var areas = this.cityArr[index].areas;
				var newAreas = [{
					showName: '全市',
					name: this.cityArr[index].name,
					code: cityCode
				}, ...areas]
				this.areaArr = newAreas;
			},
			switchAreaIndex(item, index) { // 选择区
				if(this.chooseArea.areaCode == item.code) return;
				this.chooseArea.area = item.name;
				this.chooseArea.areaCode = item.code;
			},
			toResetSelectData() { // 重置选择的省市区
				if(this.pageFlag == 'indexSearch') {
					getApp().globalData.newChooseAddressObj = {
						province: '',
						provinceCode: '',
						city: '',
						cityCode: '',
						area: '',
						areaCode: '',
					}
					uni.navigateBack();
					return;
				}
				this.searchVal = '';
				this.cityArr = [];
				this.areaArr = [];
				this.chooseArea = {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
				};
				this.showCommonlyAddress = false;
			},
			toSaveArea() { // 保存省市区数据
				if(!this.chooseArea.province) {
					uni.showToast({
						title: '请选择地区！',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if(!this.chooseArea.city) {
					uni.showToast({
						title: '请选择市！',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				let provinceCode = this.chooseArea.provinceCode;
				if(provinceCode != '310000' && provinceCode != '110000' && provinceCode != '500000' && provinceCode != '120000') {
					if(!this.chooseArea.area) {
						uni.showToast({
							title: '请选择区！',
							icon: 'none',
							duration: 2000
						})
						return false;
					}
				}
				if(this.saveLoading) return;
				this.saveLoading = true;
				console.log(this.chooseArea);
				getApp().globalData.newChooseAddressObj = {
					province: this.chooseArea.province ? this.chooseArea.province : '',
					provinceCode: this.chooseArea.provinceCode ? this.chooseArea.provinceCode : '',
					city: this.chooseArea.city ? this.chooseArea.city : '',
					cityCode: this.chooseArea.cityCode ? this.chooseArea.cityCode : '',
					area: this.chooseArea.area ? this.chooseArea.area : '',
					areaCode: this.chooseArea.areaCode ? this.chooseArea.areaCode : '',
				}
				uni.navigateBack();
				this.saveLoading = false;
			},
			isMunicipalitiesDirectly(code) { // 是否直辖市
				if(code == '310000' || code == '110000' || code == '500000' || code == '120000') {
					this.$forceUpdate();
					return true;
				}
			},
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
					this.citiesData = [];
					this.areaData = [];
					this.checkedAddressKey = '';
					// this.noSearchData = false;
					// this.showSearchData = false;
				}else {
					this.showSearchData = true;
					this.searchArea();
				}
			},
			searchInputBlur(e) {
				if(this.searchVal) {
					this.showSearchData = true;
				}else {
					this.showSearchData = false;
					this.citiesData = [];
					this.areaData = [];
					this.checkedAddressKey = '';
				}
			},
			searchInputFocus(e) {
				// this.showSearchData = true;
			},
			deleteSearchVal() {
				this.searchVal = '';
				this.citiesData = [];
				this.areaData = [];
				this.checkedAddressKey = '';
				this.noSearchData = false;
				this.showSearchData = false;
			},
			searchArea() { // 搜索
				console.log('搜索开始开始');
				if(!this.searchVal) return;
				console.log('搜索参数', this.searchVal);
				uni.showLoading();
				let citiesData = [];
				this.citiesData = [];
				let areaData = [];
				this.areaData = [];
				this.checkedAddressKey = '';
				this.noSearchData = false;
				try{
					for(let i in this.provinceArr) {
						let cityItem = this.provinceArr[i].cities
						// 搜索仅匹配市 || 区，省数组仅直辖市进行匹配,且相当于上海市-全市
						if(this.provinceArr[i].code == '310000' || this.provinceArr[i].code == '110000' || this.provinceArr[i].code == '500000' || this.provinceArr[i].code == '120000') {
							// console.log(this.provinceArr[i]);
							if(this.provinceArr[i].name.indexOf(this.searchVal) > -1) {
								let provinceObj = {
									province: this.provinceArr[i].name,
									provinceCode: this.provinceArr[i].code,
									city: this.provinceArr[i].name,
									cityCode: this.provinceArr[i].code,
									area: '',
									areaCode: '',
								}
								citiesData.push(provinceObj);
							}
						}
						for(let c in cityItem) { // 市搜索，市搜索结果为 某省-某市-全市
							if(cityItem[c].name.indexOf(this.searchVal) > -1) {
								if(this.provinceArr[i].code == '310000' || this.provinceArr[i].code == '110000' || this.provinceArr[i].code == '500000' || this.provinceArr[i].code == '120000') {
									let newCitiesObj = {
										province: this.provinceArr[i].name,
										provinceCode: this.provinceArr[i].code,
										city: cityItem[c].name,
										cityCode: cityItem[c].code,
										area: '',
										areaCode: '',
									}
									areaData.push(newCitiesObj);
								}else {
									let citiesObj = {
										province: this.provinceArr[i].name,
										provinceCode: this.provinceArr[i].code,
										city: cityItem[c].name,
										cityCode: cityItem[c].code,
										area: cityItem[c].name,
										areaCode: cityItem[c].code,
									}
									citiesData.push(citiesObj);
								}
							}
							
							if(cityItem[c].areas && cityItem[c].areas.length > 0) { // 区搜索
								let areaItem = cityItem[c].areas;
								for(let a in areaItem) {
									if(areaItem[a].name.indexOf(this.searchVal) > -1) {
										let areaObj = {
											province: this.provinceArr[i].name,
											provinceCode: this.provinceArr[i].code,
											city: cityItem[c].name,
											cityCode: cityItem[c].code,
											area: areaItem[a].name,
											areaCode: areaItem[a].code,
										}
										areaData.push(areaObj);
									}
								}
							}
						}
					}
					console.log('市/自治区搜索结果', citiesData);
					if(citiesData.length > 0) {
						let obj = {};
						this.citiesData = citiesData.reduce((arr,next) => {
						    arr.push(next);
						    return arr;
						},[]) //设置arr默认类型为数组，并且初始值为空的数组
						console.log('市/自治区搜索集合', this.citiesData);
					}
					console.log('县/区搜索结果', areaData);
					if(areaData.length > 0) {
						let obj = {};
						this.areaData = areaData.reduce((arr,next) => {
						    arr.push(next);
						    return arr;
						},[]) //设置arr默认类型为数组，并且初始值为空的数组
						console.log('县/区搜索集合', this.areaData);
					}
				}catch(err){
					console.log('搜索异常', err);
				}finally{
					uni.hideLoading();
					// this.searchScrollTop = 0;
					if(citiesData.length == 0 && areaData.length == 0) {
						this.noSearchData = true;
					}
				}
			},
			checkSearchItem(item) {
				if(this.saveLoading) return;
				this.saveLoading = true;
				getApp().globalData.newChooseAddressObj = {
					province: item.province ? item.province : '',
					provinceCode: item.provinceCode ? item.provinceCode : '',
					city: item.city ? item.city : '',
					cityCode: item.cityCode ? item.cityCode : '',
					area: item.area ? item.area : '',
					areaCode: item.areaCode ? item.areaCode : '',
				}
				uni.navigateBack();
				this.saveLoading = false;
			}
		}
	}
</script>

<style lang="scss">
	.chooseArea {
		height: 100vh;
		background-color: #FFF;
		.searchBox {
			margin: 0 36rpx;
			padding: 0 26rpx;
			box-sizing: border-box;
			height: 80rpx;
			background: #F3F3F3;
			border-radius: 150rpx;
			display: flex;
			align-items: center;
			.searchIcon {
				width: 48rpx;
				height: 48rpx;
				flex-shrink: 0;
				padding-right: 20rpx;
			}
			.searchInput {
				flex: 1;
				font-size: 24rpx;
				color: #000;
			}
			.searchDeleteIcon {
				width: 36rpx;
				height: 36rpx;
				flex-shrink: 0;
			}
		}
		.userLocationMsg {
			height: 28rpx;
			line-height: 28rpx;
			padding: 32rpx 36rpx 0 36rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #2B72F0;
		}
		.addressScrollBox {
			height: calc(100vh - 410rpx); // 340 32 28
			margin: 32rpx 0 0 36rpx;
			border-top: 2rpx solid #EAEAEA;
			box-sizing: border-box;
			display: flex;
			.scrollCol + .scrollCol {
				border-left: 2rpx solid #EAEAEA;
			}
			.scrollCol {
				height: calc(100vh - 410rpx); // 340 32 28
				box-sizing: border-box;
				flex: 0 0 33.3%;
				padding-top: 28rpx;
				.selectMsg + .selectMsg {
					margin-top:32rpx;
				}
				.selectMsg {
					line-height: 38rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.check {
						width: 30rpx;
						height: 22rpx;
						margin-right: 10rpx;
					}
					.msg {
						font-size: 32rpx;
					}
				}
			}
			.commonlyCol {
				border-left: 2rpx solid #EAEAEA;
				height: calc(100vh - 410rpx); // 340 32 28
				box-sizing: border-box;
				flex: 0 0 66.6%;
				padding: 8rpx 24rpx 0 24rpx;
				.commonlyAddressList {
					font-size: 28rpx;
					font-weight: 500;
					color: #2B72F0;
					line-height: 28rpx;
					padding: 20rpx 0;
					text-align: center;
				}
			}
		}
		.btnGroup {
			height: 200rpx;
			width: 100vw;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			.cancelBtn {
				width: 204rpx;
				height: 80rpx;
				line-height: 80rpx;
				background-color: #F2F3F5;
				border-radius: 16rpx;
				font-size: 32rpx;
				color: #5C5C5C;
				text-align: center;
			}
			.confirmBtn {
				width: 278rpx;
				height: 80rpx;
				line-height: 80rpx;
				background-color: #2B72F0;
				border-radius: 16rpx;
				font-size: 32rpx;
				color: #FFF;
				text-align: center;
				margin-left: 72rpx;
			}
		}
		.searchInfoBox {
			height: calc(100vh - 80rpx);
			box-sizing: border-box;
			padding: 32rpx 36rpx;
			.searchInfoTitle {
				margin: 0 0 24rpx 0;
				font-size: 32rpx;
				color: #333333;
				line-height: 38rpx;
			}
			.searchContent {
				display: flex;
				flex-wrap: wrap;
				.searchList {
					margin-bottom: 24rpx;
					margin-right: 18rpx;
					padding: 16rpx 24rpx;
					background: #F3F3F3;
					border-radius: 4rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: rgba(0,0,0,0.65);
					line-height: 40rpx;
				}
			}
			.noSearchMsg {
				padding: 20rpx 0;
				text-align: center;
				font-size: 28rpx;
				color:#333;
			}
		}
	}
</style>
