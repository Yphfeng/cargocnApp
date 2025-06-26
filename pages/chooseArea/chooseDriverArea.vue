<template>
	<view class="chooseArea">
		<view class="searchBox">
			<image class="searchIcon" @click="searchArea" src="/static/images/newOrderDetails/addressSearch.png"></image>
			<input
				class="searchInput"
				maxlength="20"
				:placeholder="placeholderText"
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
			<view class="userLocationMsg" v-if="userLocationObj.provinceName" @click="chooseUserLocation()">选择当前定位：{{showUserLocation()}}</view>
			<view class="choose-things">
				<text class="hasChoose">已选</text>
				<scroll-view scroll-x="true" class="choose-content">
					<view class="choose-scroll">
						<view v-for="(item, index) in chooseArea" class="choose-item" @click="delHas(index)">
							<view>{{item.chooseName}}</view>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/del1.png" class="del-icon"></image>
						</view>
					</view>
					
				</scroll-view>
			</view>
			<view class="addressScrollBox">
				<scroll-view class="scrollCol" :scroll-y="true">
					<view class="selectMsg" v-for="(item, index) in provinceArr" @click.stop="switchProIndex(item, index)">
						<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="findProIndex(item) > -1"></image>
						<text class="msg" :class="index == 0 ? 'firstRow' : ''" :style="findProIndex(item) > -1 ? 'color: #2B72F0;' : 'color: #333333;'">{{replaceProvince(item.name)}}</text>
					</view>
				</scroll-view>
				<scroll-view class="scrollCol" :scroll-y="true" v-if="!showCommonlyAddress">
					<view class="selectMsg" v-for="(item, index) in cityArr" @click.stop="switchCityIndex(item, index)">
						<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="findCityIndex(item)>-1"></image>
						<text class="msg" :class="item.showName ? 'firstRow' : ''" :style="findCityIndex(item)>-1 ? 'color: #2B72F0;' : 'color: #333333;'">{{item.showName ? item.showName : item.name}}</text>
					</view>
				</scroll-view>
				<scroll-view class="scrollCol" :scroll-y="true" v-if="!showCommonlyAddress">
					<view class="selectMsg" v-for="(item, index) in areaArr" @click.stop="switchAreaIndex(item, index)">
						<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="findAreaIndex(item) > -1"></image>
						<text class="msg" :class="item.showName ? 'firstRow' : ''" :style="findAreaIndex(item) > -1 ? 'color: #2B72F0;' : 'color: #333333;'">{{item.showName ? item.showName : item.name}}</text>
					</view>
				</scroll-view>
				<scroll-view class="commonlyCol" :scroll-y="true" v-if="showCommonlyAddress">
					<!-- <view class="commonlyAddressList">常用地址</view> -->
					<view class="historyAddr">
						<view v-for="item in historyAddr" class="his-item" @click="userCommonAddr(item)">
							{{item.chooseName}}
						</view>
					</view>
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
					{{item.chooseName}}
				</view>
			</view>
			<view class="searchInfoTitle" v-if="areaData && areaData.length> 0">县/区</view>
			<view class="searchContent">
				<view class="searchList" v-for="(item, index) in areaData" :key="index" @click="checkSearchItem(item)">
					{{item.areaName ? item.cityName + '-' + item.areaName : item.provinceName + '-' + item.cityName}}
				</view>
			</view>
			<view v-if="noSearchData" class="noSearchMsg">暂无搜索结果</view>
		</scroll-view>
	</view>
</template>
 
<script>
	import * as utils from "@/utils/ship.js"
	export default {
		data() {
			return {
				placeholderText: '',
				historyAddr: [],
				searchVal: '',
				placeholderStyle: 'font-size: 24rpx;color: #BEBEBE;',
				userLocationObj: {
					provinceName: '',
					provinceCode: '',
					cityName: '',
					cityCode: '',
					areaName: '',
					areaCode: '',
					selectedAreaIndex: -1,
					selectedCityIndex: -1,
					selectedProIndex: -1,
					chooseName: '',
				},
				provinceArr: [],
				cityArr: [],
				areaArr: [],
				chooseArea: [],
				showCommonlyAddress: false,
				showSearchData: false,
				citiesData: [],
				areaData: [],
				checkedAddressKey: '',
				searchScrollTop: 0,
				noSearchData: false,
				saveLoading: false,
				addressTypeKey: '',
			};
		},
		onLoad(options) {
			console.log('选择地址页面的参数',options);
			this.addressTypeKey = options.addressTypeKey ? Number(options.addressTypeKey) : ''; //判断是装还是卸货地址
			let areaMsg = options.areaMsg ? JSON.parse(options.areaMsg) : [];
			console.log('选择的地址', areaMsg);
			if (options.addressTypeKey == 1) {
				this.placeholderText = "请输入名称查询，最多可选择1个装货地"
			} else {
				this.placeholderText = "请输入名称查询，最多可选择三个卸货地"
			}
			this.chooseArea = areaMsg
			// console.log('选择的地址', this.chooseArea);
			uni.showLoading();
			this.getUserLocationInfo();
			var historyAddr = uni.getStorageSync("historyAddr");
			console.log("historyAddr", historyAddr);
			if (historyAddr) {
				this.historyAddr = JSON.parse(historyAddr);
			}
			
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
						uni.hideLoading();
						// that.getProvince();
					}
				})
			},
			showUserLocation() {
				let msg = this.userLocationObj.provinceName;
				msg = this.userLocationObj.cityName ? msg + '-' + this.userLocationObj.cityName : msg;
				msg = this.userLocationObj.areaName ? msg + '-' + this.userLocationObj.areaName : msg;
				return msg;
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
							that.userLocationObj.provinceName = regeocode.addressComponent.province;
							that.userLocationObj.provinceCode = provinceCode;
					
							if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
								that.userLocationObj.cityName = regeocode.addressComponent.district;
								that.userLocationObj.cityCode = regeocode.addressComponent.adcode;
								that.userLocationObj.chooseName = regeocode.addressComponent.province + regeocode.addressComponent.district;
							}else {
								let cityCode = (regeocode.addressComponent.adcode.substr(0,2)) + regeocode.addressComponent.citycode
								that.userLocationObj.cityName = regeocode.addressComponent.city;
								that.userLocationObj.cityCode = cityCode;
								that.userLocationObj.areaName = regeocode.addressComponent.district;
								that.userLocationObj.areaCode = regeocode.addressComponent.adcode;
								that.userLocationObj.chooseName = regeocode.addressComponent.province + regeocode.addressComponent.city + regeocode.addressComponent.district;
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
			renderList(item) {
				
			},
			getProvince() { // 从本地缓存获取省市区数据，本地缓存没有则从接口获取，再存入缓存
				console.log("chooseArea", this.chooseArea);
				var provinceLocal = uni.getStorageSync("regionData");
				var chooseArea = this.chooseArea;
				if(provinceLocal) {
					this.provinceArr = [{code: '000000', name: '常用线路'}, ...provinceLocal];
					
					if(this.chooseArea.length > 0) {
						var len = chooseArea.length;
						var item = this.chooseArea[len - 1];
						this.pushDiyCityItem(item.provinceCode, item.selectedProIndex);
						if (item.cityCode) {
							
							this.pushAreaItem(item.cityCode, item.selectedCityIndex);
							
						}
						// this.switchAllArea();
					}
					uni.hideLoading();
				}else {
					let that = this;
					utils.postRequest('/ts/nationDict/getBasicData')
					.then(res => {
						if (res.retCode == "0000000") {
							var provinceArr = res.rspBody;
							that.provinceArr = [{code: '000000', name: '常用线路'}, ...provinceArr];
							if(this.chooseArea.length > 0) {
								var len = chooseArea.length;
								var item = this.chooseArea[len - 1];
								this.pushDiyCityItem(item.provinceCode, item.selectedProIndex);
								if (item.cityCode) {
									this.pushAreaItem(item.cityCode, item.selectedCityIndex);
								}
								// this.switchAllArea();
							}
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
				var chooseArea = this.chooseArea;
				var userLocationObj = this.userLocationObj;
				var addressTypeKey = this.addressTypeKey;
				var provinceArr = this.provinceArr;
				//判断是否有重复，有重复不管
				var findIndex = chooseArea.findIndex(item => {
					return item.provinceCode == userLocationObj.provinceCode && item.cityCode == userLocationObj.cityCode && item.areaCode == userLocationObj.areaCode
				})
				if (findIndex > -1) return;
				var findProIndex = provinceArr.findIndex(atem => {
					return atem.code == userLocationObj.provinceCode
				})
				if (findProIndex > -1) {
					userLocationObj.selectedProIndex = findProIndex;
					userLocationObj.areaFlag = this.addressTypeKey;
					userLocationObj.typeFlag = 1;
					var cityArr = provinceArr[findProIndex].cities;
					var findCityIndex = cityArr.findIndex(item => {
						return item.code == userLocationObj.cityCode
					})
					if (findCityIndex > -1) {
						userLocationObj.selectedCityIndex = findCityIndex;
						userLocationObj.areaFlag = this.addressTypeKey;
						userLocationObj.typeFlag = 2;
						var areas = cityArr[findCityIndex].areas;
						var findAreaIndex = cityArr.findIndex(item => {
							return item.code == userLocationObj.areaCode
						})
						if (findAreaIndex > -1) {
							userLocationObj.selectedAreaIndex = findAreaIndex;
							userLocationObj.areaFlag = this.addressTypeKey;
							userLocationObj.typeFlag = 3;
						}
					}
				}
				if (addressTypeKey == 1) {
					this.chooseArea = [userLocationObj]
				} else {
					if (chooseArea.length == 3) {
						uni.showToast({
							title: '卸货地只可选择三项',
							icon: 'none'
						})
						return;
					}
					if (userLocationObj.areaCode) {
						//删除chooseArea中全省
						var findIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == userLocationObj.provinceCode && !atem.cityCode
						})
						if (findIndex > -1) {
							chooseArea.splice(findIndex, 1)
						}
						//删除chooseArea中全市
						var findCIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == userLocationObj.provinceCode && atem.cityCode == userLocationObj.cityCode && !atem.areaCode
						})
						if (findCIndex > -1) {
							chooseArea.splice(findCIndex, 1)
						}
						
					} else if (userLocationObj.cityCode) {
						//删除chooseArea中全省
						var findIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == userLocationObj.provinceCode && !atem.cityCode
						})
						if (findIndex > -1) {
							chooseArea.splice(findIndex, 1)
						}
					}
					this.chooseArea = chooseArea.concat(userLocationObj);
				}
				this.switchAllArea();
			},
			switchAllArea() { // 编辑
				console.log('编辑');
				var chooseArea = this.chooseArea;
				var len = chooseArea.length;
				var provinceCode = chooseArea[len - 1].provinceCode
				let toSetAreaAry = this.isMunicipalitiesDirectly(provinceCode) ? 1 : 2;
				for(let i in this.provinceArr) {
					if(this.provinceArr[i].code == provinceCode) {
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
					var coties = [{
						showName: '全省',
						name: this.provinceArr[index].name,
						code: provinceCode
					}, ...cities]
				}
				this.cityArr = coties;
				uni.hideLoading()
				if(toSetAreaAry && toSetAreaAry == 2) {
					var chooseArea = this.chooseArea;
					var len = chooseArea.length;
					var cityCode = chooseArea[len - 1].cityCode;
					for(let i in cities) {
						if(cities[i].code == chooseArea[len - 1].cityCode) {
							this.pushAreaItem(cityCode, i);
							break;
						}
					}
				}
			},
			findProIndex(item) {
				var chooseArea = this.chooseArea;
				
				var findIndex = chooseArea.findIndex(atem => {
					return atem.provinceCode == item.code
				})
				
				return findIndex
			},
			delProArr(item) {
				var chooseArea = this.chooseArea;
				var arr = [];
				chooseArea.forEach(atem => {
					if (atem.provinceCode != item.code) {
						arr.push(atem)
					}
				})
				return arr
			},
			delCityArr(item) {
				var chooseArea = this.chooseArea;
				var arr = [];
				chooseArea.forEach(atem => {
					if (atem.cityCode != item.code) {
						arr.push(atem)
					}
				})
				return arr
			},
			delAreaArr(item) {
				var chooseArea = this.chooseArea;
				var arr = [];
				chooseArea.forEach(atem => {
					if (atem.cityCode != item.code) {
						arr.push(atem)
					}
				})
				return arr
			},
			
			findCityIndex(item) {
				var chooseArea = this.chooseArea;
				var findIndex = chooseArea.findIndex(atem => {
					return (atem.cityCode == item.code || atem.showCode == item.code)
				})
				return findIndex
			},
			findAreaIndex(item) {
				var chooseArea = this.chooseArea;
				var findIndex = chooseArea.findIndex(atem => {
					return (atem.areaCode == item.code || atem.showCode == item.code)
				})
				return findIndex
			},
			isNumPro(item) {
				var chooseArea = this.chooseArea;
				var num = 0;
				chooseArea.forEach(atem => {
					if (atem.provinceCode == item.provinceCode) {
						num ++
					}
				})
				return num
			},
			isNumCity(item) {
				var chooseArea = this.chooseArea;
				var num = 0;
				chooseArea.forEach(atem => {
					if (atem.cityCode == item.cityCode) {
						num ++
					}
				})
				return num
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
					if (this.addressTypeKey == 1) {
						//装货地址
						var chooseArea = [];
						var findIndex = this.findProIndex(item);
						if (findIndex > -1) {
							chooseArea.splice(findIndex, 1);
							this.areaArr = [];
							this.cityArr = [];
						} else {
							chooseArea.push({
								provinceName: item.name,
								provinceCode: item.code,
								chooseName: item.name,
								typeFlag: 1,
								areaFlag: this.addressTypeKey,
								selectedProIndex: index,
								selectedCityIndex: -1,
								selectedAreaIndex: -1,
								
							})
							this.areaArr = [];
							this.pushDiyCityItem(item.code, index);
						}
						this.chooseArea = chooseArea;
						this.showCommonlyAddress = false;
						this.$forceUpdate();
					} else {
						var chooseArea = this.chooseArea;
						var findIndex = this.findProIndex(item);
						if (findIndex > -1) {
							chooseArea = this.delProArr(item);
							this.areaArr = [];
							this.cityArr = [];
						} else {
							if (chooseArea.length ==3) {
								uni.showToast({
									title: '最多选择三项',
									icon: 'none'
								})
								return;
							}
							chooseArea.push({
								provinceName: item.name,
								provinceCode: item.code,
								chooseName: item.name,
								typeFlag: 1,
								areaFlag: this.addressTypeKey,
								selectedProIndex: index,
								selectedCityIndex: -1,
								selectedAreaIndex: -1,
								
							})
							this.areaArr = [];
							this.pushDiyCityItem(item.code, index);
						}
						this.chooseArea = chooseArea;
						this.showCommonlyAddress = false;
						this.$forceUpdate();
						
					}
				}
			},
			switchCityIndex(item, index) { // 选择市
				console.log(item);
				var chooseArea = this.chooseArea;
				var chooseLen = chooseArea.length;
				var selectedProIndex = this.chooseArea[chooseLen - 1].selectedProIndex;
				if (index == 0) {
					//表示点击了全省，全市
					var hasArr = this.delProArr(item);
					hasArr.push({
						provinceName: item.name,
						provinceCode: item.code,
						cityName: '',
						cityCode: '',
						showCode: item.code,
						chooseName: item.name,
						typeFlag: 1,
						areaFlag: this.addressTypeKey,
						areaName: '',
						areaCode: '',
						selectedCityIndex: 0,
						selectedAreaIndex: -1,
						selectedProIndex: selectedProIndex,
					})
					this.chooseArea = hasArr;
					this.areaArr = [];
					return;
				}; //默认不选择全市，只是展示
				
				if (this.addressTypeKey == 1) {
					var findCityIndex = this.findCityIndex(item);
					//装货地
					if (findCityIndex > -1) {
						chooseArea[findCityIndex].areaName = "";
						chooseArea[findCityIndex].areaCode = "";
						chooseArea[findCityIndex].selectedAreaIndex = -1;
						chooseArea[findCityIndex].selectedCityIndex = -1;
						chooseArea[findCityIndex].cityName = "";
						chooseArea[findCityIndex].cityCode = "";
						chooseArea[findCityIndex].showCode = "";
						chooseArea[findCityIndex].typeFlag = 1;
						chooseArea[findCityIndex].areaFlag = this.addressTypeKey
						chooseArea[findCityIndex].chooseName = chooseArea[findCityIndex].provinceName;
						this.areaArr = [];
					} else {
						chooseArea[chooseLen - 1].cityName = item.name;
						chooseArea[chooseLen - 1].cityCode = item.code;
						chooseArea[chooseLen - 1].chooseName = chooseArea[chooseLen - 1].provinceName + item.name;
						chooseArea[chooseLen - 1].typeFlag = 2;
						chooseArea[chooseLen - 1].areaFlag = this.addressTypeKey
						chooseArea[chooseLen - 1].showCode = "";
						chooseArea[chooseLen - 1].areaName = "";
						chooseArea[chooseLen - 1].areaCode = "";
						chooseArea[chooseLen - 1].selectedAreaIndex = -1;
						chooseArea[chooseLen - 1].selectedCityIndex = index;
						var proCode = chooseArea[chooseLen - 1].provinceCode;
						var isMunicipalitiesDirectly = this.isMunicipalitiesDirectly(proCode);
						if (!isMunicipalitiesDirectly) {
							this.pushAreaItem(item.code, index);
						}
						
					}
					this.chooseArea = chooseArea;
				} else {
					//卸货地
					var provinceName = chooseArea[chooseLen - 1].provinceName;
					var provinceCode = chooseArea[chooseLen - 1].provinceCode;
					console.log("11",chooseArea[chooseLen - 1]);
					if (!chooseArea[chooseLen - 1].cityCode) {
						//表示选择了城市，清除全省。
						//最后一个是全省，则清除
						chooseArea.splice(chooseLen - 1, 1);
						this.chooseArea = chooseArea;
					}
					var findCityIndex = this.findCityIndex(item);
					if (findCityIndex > -1) {
						//判断该省的数据有几条
						var num = this.isNumPro(chooseArea[findCityIndex]);
						if (num == 1) {
							chooseArea[findCityIndex].areaName = "";
							chooseArea[findCityIndex].areaCode = "";
							chooseArea[findCityIndex].selectedAreaIndex = -1;
							chooseArea[findCityIndex].selectedCityIndex = -1;
							chooseArea[findCityIndex].cityName = "";
							chooseArea[findCityIndex].cityCode = "";
							chooseArea[findCityIndex].showCode = "";
							chooseArea[findCityIndex].typeFlag = 1;
							chooseArea[findCityIndex].areaFlag = this.addressTypeKey
							chooseArea[findCityIndex].chooseName = chooseArea[findCityIndex].provinceName;
						} else {
							chooseArea.splice(findCityIndex, 1)
						}
						this.areaArr = [];
					} else {
						if (chooseArea.length == 3) {
							uni.showToast({
								title: '卸货地最多选择三项',
								icon: 'none'
							})
							return;
						}
						chooseArea.push({
							provinceName: provinceName,
							provinceCode: provinceCode,
							cityName: item.name,
							cityCode: item.code,
							chooseName: provinceName + item.name,
							typeFlag: 2,
							areaFlag: this.addressTypeKey,
							showCode: '',
							areaName: '',
							areaCode: '',
							selectedAreaIndex: -1,
							selectedCityIndex: index,
							selectedProIndex: selectedProIndex,
						})
					
						var proCode = chooseArea[chooseLen - 1].provinceCode;
						var isMunicipalitiesDirectly = this.isMunicipalitiesDirectly(proCode);
						if (!isMunicipalitiesDirectly) {
							this.pushAreaItem(item.code, index);
						}
						
					}
					this.chooseArea = chooseArea;
				}
				
			},
			pushAreaItem(cityCode, index) {
				var cityArr = this.cityArr;
				var areas = cityArr[index].areas;
				console.log("asaa", cityArr[index], cityCode, index)
				var newAreas = [{
					showName: '全市',
					name: this.cityArr[index].name,
					code: cityCode,
					showCode: cityCode,
				}, ...areas];
				console.log("newAreas", newAreas)
				this.areaArr = newAreas;
			},
			
			switchAreaIndex(item, index) { // 选择区
				var chooseArea = this.chooseArea;
				var chooseLen = chooseArea.length;
				var provinceName = chooseArea[chooseLen - 1].provinceName;
				var provinceCode = chooseArea[chooseLen - 1].provinceCode;
				var cityName =  chooseArea[chooseLen - 1].cityName;
				var cityCode =  chooseArea[chooseLen - 1].cityCode;
				var selectedProIndex = chooseArea[chooseLen - 1].selectedProIndex;
				var selectedCityIndex = chooseArea[chooseLen - 1].selectedCityIndex;
				var findAreaIndex = this.findAreaIndex(item);
				console.log(item.showName)
				if (index == 0) {
					//表示选择的是全市
					var hasArr = this.delCityArr(item);
					hasArr.push({
						provinceName: provinceName,
						provinceCode: provinceCode,
						cityName: item.name,
						cityCode: item.code,
						showCode: item.code,
						chooseName: provinceName + item.name,
						typeFlag: 2,
						areaFlag: this.addressTypeKey,
						areaName: '',
						areaCode: '',
						selectedCityIndex: selectedCityIndex,
						selectedAreaIndex: -1,
						selectedProIndex: selectedProIndex,
					})
					this.chooseArea = hasArr;
					return;
				}
				
				if (this.addressTypeKey == 1) {
					if (findAreaIndex > -1) {
						chooseArea[findAreaIndex].selectedAreaIndex = -1;
						chooseArea[findAreaIndex].areaName = "";
						chooseArea[findAreaIndex].areaCode = "";
						chooseArea[findAreaIndex].showCode = "";
						chooseArea[findAreaIndex].chooseName = chooseArea[findAreaIndex].provinceName + chooseArea[findAreaIndex].cityName;
						chooseArea[findAreaIndex].typeFlag = 2;
						chooseArea[findAreaIndex].areaFlag = this.addressTypeKey
					} else {
						chooseArea[chooseLen - 1].areaName = item.name;
						chooseArea[chooseLen - 1].areaCode = item.code;
						chooseArea[chooseLen - 1].chooseName = chooseArea[chooseLen - 1].provinceName + chooseArea[chooseLen - 1].cityName + item.name;
						chooseArea[chooseLen - 1].typeFlag = 3;
						chooseArea[chooseLen - 1].selectedAreaIndex = index;
						chooseArea[chooseLen - 1].areaFlag = this.addressTypeKey
						chooseArea[chooseLen - 1].showCode = "";
					}
					this.$forceUpdate();
					this.chooseArea = chooseArea;
					
				} else {
					
					
					if (!chooseArea[chooseLen - 1].areaCode) {
						//表示选择了区域，清除全市。
						//最后一个是全市，则清除
						chooseArea.splice(chooseLen - 1, 1);
						this.chooseArea = chooseArea;
					}
					if (findAreaIndex > -1) {
						var num = this.isNumCity(chooseArea[findAreaIndex]);
						if (num == 1) {
							chooseArea[findAreaIndex].selectedAreaIndex = -1;
							chooseArea[findAreaIndex].areaName = "";
							chooseArea[findAreaIndex].areaCode = "";
							chooseArea[findAreaIndex].showCode = "";
							chooseArea[findAreaIndex].chooseName = chooseArea[findAreaIndex].provinceName + chooseArea[findAreaIndex].cityName;
							chooseArea[findAreaIndex].typeFlag = 2;
							chooseArea[findAreaIndex].areaFlag = this.addressTypeKey
						} else {
							chooseArea.splice(findAreaIndex, 1)
						}
						
					} else {
						if (chooseArea.length == 3) {
							uni.showToast({
								title: '卸货地最多选择三项',
								icon: 'none'
							})
							return;
						}
						chooseArea.push({
							provinceName: provinceName,
							provinceCode: provinceCode,
							cityName: cityName,
							cityCode: cityCode,
							chooseName: provinceName + cityName + item.name,
							typeFlag: 3,
							areaFlag: this.addressTypeKey,
							showCode: '',
							areaName: item.name,
							areaCode: item.code,
							selectedAreaIndex: index,
							selectedCityIndex: selectedCityIndex,
							selectedProIndex: selectedProIndex,
						})
					}
					this.$forceUpdate();
					this.chooseArea = chooseArea;
				}
			},
			toResetSelectData() { // 重置选择的省市区
				this.searchVal = '';
				this.cityArr = [];
				this.areaArr = [];
				this.chooseArea = [];
				this.showCommonlyAddress = false;
			},
			toSaveArea() { // 保存省市区数据
				if(this.saveLoading) return;
				this.saveLoading = true;
				var newChooseAddressObj = this.chooseArea || [];
				console.log("newChooseAddressObj", newChooseAddressObj);
				uni.$emit("saveAreaData", newChooseAddressObj);
				var historyAddr = this.historyAddr;
				
				newChooseAddressObj.forEach(atem => {
					var findIndex = historyAddr.findIndex(item => {
						return atem.provinceCode == item.provinceCode && atem.cityCode == item.cityCode && atem.areaCode == item.areaCode
					})
					if (findIndex > -1) {
						historyAddr.splice(findIndex, 1)
					}
				})
				var restArr = newChooseAddressObj.concat(historyAddr);
				if (restArr.length > 10) {
					restArr.splice(10)
				}
				console.log("restArr",restArr)
				this.historyAddr = restArr;
				uni.setStorageSync("historyAddr", JSON.stringify(restArr))
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
									provinceName: this.provinceArr[i].name,
									provinceCode: this.provinceArr[i].code,
									cityName: "",
									cityCode: "",
									chooseName: this.provinceArr[i].name,
									areaName: '',
									areaCode: '',
								}
								citiesData.push(provinceObj);
							}
						}
						for(let c in cityItem) { // 市搜索，市搜索结果为 某省-某市-全市
							if(cityItem[c].name.indexOf(this.searchVal) > -1) {
								if(this.provinceArr[i].code == '310000' || this.provinceArr[i].code == '110000' || this.provinceArr[i].code == '500000' || this.provinceArr[i].code == '120000') {
									let newCitiesObj = {
										provinceName: this.provinceArr[i].name,
										provinceCode: this.provinceArr[i].code,
										cityName: cityItem[c].name,
										cityCode: cityItem[c].code,
										areaName: '',
										areaCode: '',
										chooseName: cityItem[c].name,
									}
									areaData.push(newCitiesObj);
								}else {
									let citiesObj = {
										provinceName: this.provinceArr[i].name,
										provinceCode: this.provinceArr[i].code,
										cityName: cityItem[c].name,
										cityCode: cityItem[c].code,
										areaName: "",
										areaCode: "",
										chooseName: cityItem[c].name,
									}
									citiesData.push(citiesObj);
								}
							}
							
							if(cityItem[c].areas && cityItem[c].areas.length > 0) { // 区搜索
								let areaItem = cityItem[c].areas;
								for(let a in areaItem) {
									if(areaItem[a].name.indexOf(this.searchVal) > -1) {
										let areaObj = {
											provinceName: this.provinceArr[i].name,
											provinceCode: this.provinceArr[i].code,
											cityName: cityItem[c].name,
											cityCode: cityItem[c].code,
											areaName: areaItem[a].name,
											areaCode: areaItem[a].code,
											chooseName: areaItem[a].name,
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
				console.log("checkSearchItem", item);
				if(this.saveLoading) return;
				this.saveLoading = true;
				var chooseArea = this.chooseArea;
				var findIndex = chooseArea.findIndex(atem => {
					return atem.provinceCode == item.provinceCode && atem.cityCode == item.cityCode && atem.areaCode == item.areaCode
				})
				if (findIndex > -1) {
					this.saveLoading = false;
					uni.showToast({
						title: '您已选择该地址',
						icon: 'none'
					})
					return;
				};
				var provinceArr = this.provinceArr;
				var newData = {
					...item,
					selectedProIndex: -1,
					selectedCityIndex: -1,
					selectedAreaIndex: -1,
				}
				var selectedProIndex = provinceArr.findIndex(atem => {
					return atem.code == item.provinceCode
				})
				newData.selectedProIndex = selectedProIndex
				newData.areaFlag = this.addressTypeKey;
				newData.typeFlag = 1;
				var cities = provinceArr[selectedProIndex].cities;
				var selectedCityIndex = cities.findIndex(atem => {
					return atem.code == item.cityCode
				})
				if (selectedCityIndex > -1) {
					newData.selectedCityIndex = selectedCityIndex + 1; 
					newData.areaFlag = this.addressTypeKey;
					newData.typeFlag = 2;
					var areas = cities[selectedCityIndex].areas;
					console.log("areas",areas)
					var selectedAreaIndex = areas.findIndex(atem => {
						return atem.code == item.areaCode
					})
					if (selectedAreaIndex > -1) {
						newData.selectedAreaIndex = selectedAreaIndex + 1; 
						newData.areaFlag = this.addressTypeKey;
						newData.typeFlag = 3;
					}
				}
				this.saveLoading = false;
				var addressTypeKey = this.addressTypeKey;
				console.log("newData", newData);
				if (addressTypeKey == 1) {
					this.chooseArea = [newData];
					this.toSaveArea();
				} else {
					if (chooseArea.length == 3) {
						uni.showToast({
							title: '最多可选择三个卸货地',
							icon: 'none'
						})
						return;
						
					}
					
					if (newData.areaCode) {
						//删除chooseArea中全省
						var findIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == newData.provinceCode && !atem.cityCode
						})
						if (findIndex > -1) {
							chooseArea.splice(findIndex, 1)
						}
						//删除chooseArea中全市
						var findCIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == newData.provinceCode && atem.cityCode == newData.cityCode && !atem.areaCode
						})
						if (findCIndex > -1) {
							chooseArea.splice(findCIndex, 1)
						}
						
					} else if (newData.cityCode) {
						//删除chooseArea中全省
						var findIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == newData.provinceCode && !atem.cityCode
						})
						if (findIndex > -1) {
							chooseArea.splice(findIndex, 1)
						}
					}
					
					var proCode = newData.provinceCode;
					this.pushDiyCityItem(item.provinceCode, newData.selectedProIndex);
					if (newData.cityCode) {
						this.pushAreaItem(item.cityCode, newData.selectedCityIndex);
					}
					chooseArea.push(newData)
					this.chooseArea = chooseArea;
					this.deleteSearchVal();
				}
			
			},
			delHas(index) {
				//删除已经选择的
				var chooseArea= this.chooseArea;
				
				chooseArea.splice(index , 1);
				 this.chooseArea = chooseArea;
			},
			userCommonAddr(item) {
				var chooseArea = this.chooseArea;
				var addressTypeKey = this.addressTypeKey;
				if (addressTypeKey == 1) {
					this.chooseArea = [item];
					this.toSaveArea();
				} else {
					//判断是否有重复,有重复不处理
					var findIndex = chooseArea.findIndex(atem => {
						return atem.provinceCode == item.provinceCode && atem.cityCode == item.cityCode && atem.areaCode == item.areaCode
					})
					if (findIndex > -1) {
						uni.showToast({
							title: '您已选择该地址',
							icon: 'none'
						})
						return
					};
					if (chooseArea.length == 3) {
						uni.showToast({
							title: '最多选择三项',
							icon: 'none'
						})
						return;
					}
					
					if (item.areaCode) {
						//删除chooseArea中全省
						var findIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == item.provinceCode && !atem.cityCode
						})
						if (findIndex > -1) {
							chooseArea.splice(findIndex, 1)
						}
						//删除chooseArea中全市
						var findCIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == item.provinceCode && atem.cityCode == item.cityCode && !atem.areaCode
						})
						if (findCIndex > -1) {
							chooseArea.splice(findCIndex, 1)
						}
						
					} else if (item.cityCode) {
						//删除chooseArea中全省
						var findIndex = chooseArea.findIndex(atem => {
							return atem.provinceCode == item.provinceCode && !atem.cityCode
						})
						if (findIndex > -1) {
							chooseArea.splice(findIndex, 1)
						}
					}
					
					
					chooseArea.push(item)
					this.chooseArea = chooseArea;
				}
			}
		}
	}
</script>

<style lang="scss">
	scroll-view ::-webkit-scrollbar {  
		display: none !important;  
		width: 0 !important;  
		height: 0 !important;  
		-webkit-appearance: none;  
		background: transparent;  
	}
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
		.choose-things {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 30rpx 36rpx 0;
			box-sizing: border-box;
			min-height: 108rpx;
			.hasChoose {
				font-size: 32rpx;
				color: #333333;
				margin-right: 30rpx;
			}
			.choose-content {
				width: calc(100vw - 200rpx);
				white-space: nowrap;
				.choose-scroll {
					display: flex;
					flex-direction: row;
				}
				.choose-item {
					height: 48rpx;
					background: #FFFFFF;
					border-radius: 4rpx;
					border: 1px solid #2B72F0;
					box-sizing: border-box;
					padding: 0 16rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					color: rgba(0,0,0,0.65);
					font-size: 24rpx;
					margin-right: 10rpx;
				
					.del-icon {
						width: 32rpx;
						height: 32rpx;
						margin-left: 8rpx;
					}
				}
			}
		}
		.addressScrollBox {
			height: calc(100vh - 510rpx); // 340 32 28
			margin: 32rpx 0 0 36rpx;
			border-top: 2rpx solid #EAEAEA;
			box-sizing: border-box;
			display: flex;
			.scrollCol + .scrollCol {
				border-left: 2rpx solid #EAEAEA;
			}
			.scrollCol {
				height: calc(100vh - 510rpx); // 340 32 28
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
					.firstRow {
						font-weight: bold;
					}
				}
			}
			.commonlyCol {
				border-left: 2rpx solid #EAEAEA;
				height: calc(100vh - 510rpx); // 340 32 28
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
				.historyAddr {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.his-item {
						height: 80rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28rpx;
						font-weight: 500;
						color: #2B72F0;
					}
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
