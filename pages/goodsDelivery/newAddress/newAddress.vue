<template>
	<view class="newAddress">
		<view class="addressInputBox">
			<view class="mainTitle">
				<view class="mainText">联系人信息</view>
				<view class="subText" @tap="jumpToNewAddress()">
					<image src="../../../static/images/goodsDelivery/addressListIcon1.png" class="aListIcon" ></image>
					<text>地址簿</text>
				</view>
			</view>
			<view class="addressCol">
				<input class="msgInput" style="width:220rpx" type="text" placeholder="真实姓名" :maxlength="5" v-model="userName" @input="checkMsgDone()"/>
				<input class="msgInput" style="flex: 1;" type="number" placeholder="电话" :maxlength="11" v-model="mobile" @input="checkMsgDone()"/>
			</view>
		<!-- 	<view class="addressCol" @tap="openRegionPopup()">
				<view class="inputTitle" :style="addressArea ? 'color:#333;' : 'color:#777'">
					{{addressArea ? addressArea : '城市 / 区域'}}
				</view>
				<image class="downIcon" src="../../../static/images/goodsDelivery/areaDown.png"></image>
			</view> -->
			<view class="addressCol" @tap="openNewRegionPopup()">
				<view class="inputTitle" :style="addressArea ? 'color:#333;' : 'color:#777'">
					{{addressArea ? addressArea : '城市 / 区域'}}
				</view>
				<view class="addressTextLabel">
					<image class="downIcon" src="../../../static/images/goodsDelivery/areaDown.png"></image>
					<view class="locationText" @click.stop="chooseLocation">地图定位</view>
				</view>
			
			</view>
			<view class="addressCol">
				<input class="msgInput" style="flex: 1;" type="text" placeholder="详细地址（例如：**街**号**）" v-model="addressDetailsMsg" @input="checkMsgDone()"/>
				<!-- <view class="msgInput" style="flex: 1;" :class="{defaultStyle: !addressDetailsMsg}" @click="chooseLocation()">{{addressDetailsMsg ? addressDetailsMsg : '详细地址（例如：**街**号**）'}}</view> -->
				<!-- <view class="inputTitle" :style="areaVal ? 'color:#333;' : 'color:#777'">详细地址（例如：**街**号**）</view> -->
				
			</view>
			<view class="addressCol">
				<view class="checkBoxGroup">
					<view class="checkDefaultBtn" @tap="checkFlag = 1">
						<image class="checkIcon" :src="checkFlag == 1 ? '../../../static/images/goodsDelivery/isDefault.png' : '../../../static/images/goodsDelivery/notDefault.png'"></image>
						<text class="checkMsg" :style="checkFlag == 1 ? 'color: #333;' : 'color: #777777;'">设为默认装货地</text>
					</view>
					<view class="checkDefaultBtn" @tap="checkFlag = 2">
						<image class="checkIcon" :src="checkFlag == 2 ? '../../../static/images/goodsDelivery/isDefault.png' : '../../../static/images/goodsDelivery/notDefault.png'"></image>
						<text class="checkMsg" :style="checkFlag == 2 ? 'color: #333;' : 'color: #777777;'">设为默认卸货地</text>
					</view>
				</view>
				<view class="checkMsg" @tap="clearAllData()">清空当前信息</view>
			</view>
		</view>
		<view class="footBtnGroup">
			<view class="externalBtn" :class="msgDone ? 'isDone' : 'isDefault'" @tap="saveAddressMsg()">确定</view>
		</view>
		
		<!-- 选择地址 -->
		<uni-popup ref="regionPopup" type="bottom">
			<view class="popupBox">
				<view class="popupBtnGroup">
					<view class="cancleBtn" @click="closePopup()">取消</view>
					<view class="confirmBtn" @click="chooseRegion()">确定</view>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="regionVal" @change="regionChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item,index) in region" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in secondAry" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in thirdAry" :key="index">{{item.name}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		
		<uni-popup ref="chooseAreaPopup" type="bottom">
			<view class="chooseAreaBox">
				<view class="areaPopupHead">
					<view class="checkedAreaBox">
						<view class="areaList" v-if="chooseAreaPopupData.length == 0">
							<view class="areaMsg checkedArea">全国</view>
							<view class="checkedLine"></view>
						</view>
						<view class="areaList" v-if="chooseAreaPopupData.length > 0" v-for="(item, selectindex) in chooseAreaPopupData" :key="selectindex" @tap="changeSelectFlag(selectindex)">
							<view class="areaMsg" :class="selectAreaFlag == selectindex ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
							<view :class="selectAreaFlag == selectindex ? 'checkedLine' : 'defaultLine'"></view>
						</view>
					</view>
					<image class="closeAreaPopupIcon" @tap="toCloseAreaPopup()" src="../../../static/images/goodsDelivery/closeAreaPopupIcon.png"></image>
				</view>
				<scroll-view :scroll-top="scrollTop" class="areaPopupBody" scroll-y="true" :show-scrollbar="true">
					<view v-if="areaSetp == '0'" class="detailsList" v-for="(item, provinceIndex) in allAreaInfo" :key="provinceIndex" @click="checkProvince(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[0] && chooseAreaPopupData[0].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="../../../static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
					<view v-if="areaSetp == '1'" class="detailsList" v-for="(item, cityIndex) in showCityInfo" :key="cityIndex" @click="checkCity(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[1] && chooseAreaPopupData[1].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="../../../static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
					<view v-if="areaSetp == '2'" class="detailsList" v-for="(item, areaIndex) in showAreaInfo" :key="areaIndex" @click="checkArea(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[2] && chooseAreaPopupData[2].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="../../../static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
		<uni-popup ref="newRegionPopup" type="bottom">
			<chooseRegion :checkedRegionObj="checkedRegionObj"></chooseRegion>
		</uni-popup>
		
		<uni-popup ref="locationPopup" type="center">
			<view class="locationAddressBox">
				<view class="locationPopupHead">
					<image class="locationBackIcon" @tap="toCloseLocationPopup()" src="../../../static/images/goodsDelivery/icon_right.png"></image>
					<view class="locationInputBox">
						<input class="locationInput" v-model="locationSearchVal" type="text" confirm-type="search" @confirm="checkSearchValThenSearch()"/>
						<view class="addressLocationBox" @click="checkSearchValThenSearch()">
							<image class="locationIcon" src="../../../static/images/goodsDelivery/AddressPopupIcon.png"></image>
							<view class="msg">定位</view>
						</view>
					</view>
				</view>
				<scroll-view class="locationScroll" :scroll-y="!searchBoxLoading" :show-scrollbar="true" @scrolltolower="addressOnload">
					<view class="addressSearchList" v-for="(item, index) in searchData" :key="index" @click="chooseAddress(item)" v-show="item.address && item.address.length > 0">
						<view class="listContent">
							<view class="name">{{item.name}}</view>
							<view class="msg">{{item.address}}</view>
						</view>
						<image class="searchComfirmIcon" src="../../../static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
					<view class="loadingBox" v-show="searchNoMoreData">没有更多了~</view>
				</scroll-view>
				<view class="popupLoadingBox" v-if="searchBoxLoading">
					<image class="loadingIcon" src="../../../static/images/goodsDelivery/listLoading.png"></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import chooseRegion from "../../../components/chooseRegion.vue"
	export default {
		data() {
			return {
				msgDone: false,
				areaVal: '',
				checkFlag: '',
				region: [],
				regionVal: [0,0,0],
				secondAry: [],
				thirdAry: [],
				indicatorStyle: 'height:60rpx;',
				userId: '',
				userName: '',
				mobile: '',
				areaData: {
					provinceCode: '',
					provinceName: '',
					cityCode: '',
					cityName: '',
					districtCode: '',
					districtName: '',
				},
				searchPageNum: 1,
				searchNoMoreData: false,
				searchData: [],
				searchBoxLoading: false,
				saveAddressObj: {},
				locationSearchVal: '',
				serialNumber: '',
				purpose: '',
				addressArea: '', // 地区msg
				addressDetailsMsg: '', // 详细地址
				allAreaInfo: [], // 所有省市区
				checkedAreaData: [], // 选中的省市区
				chooseAreaPopupData: [],
				selectAreaFlag: '', // 选中的省、市、区，标签
				showCityInfo: [], // 省市区弹出框展示的市
				showAreaInfo: [], // 省市区弹出框展示的区
				areaSetp: '0',
				scrollTop: 0,
				addressItem: '',
				globalAddress: [],
				checkedRegionObj: {},
				routeAddr: '',
				pageTitle: '新增地址',
				optNumber: 1,
			};
		},
		components: { chooseRegion },
		onLoad(options) {
			this.pageFrom = options.pageFrom;
			this.type = options.type;
			this.optNumber = options.serialNumber;
			console.log(options.addressItem, '参数是11')
			if(options.addressItem) {
				this.pageTitle = '编辑地址';
				this.addressItem = JSON.parse(options.addressItem);
				console.log('已有数据', this.addressItem);
				this.checkedRegionObj = {
					"provinceName": this.addressItem.province,
					"provinceCode": this.addressItem.provinceCode,
					"cityName": this.addressItem.city,
					"cityCode": this.addressItem.cityCode,
					"areaName": this.addressItem.area,
					"areaCode": this.addressItem.areaCode,
				}
				if(this.addressItem && this.addressItem.sid) {
					this.msgDone = true;
				}
				this.saveAddressObj.longitude = this.addressItem.longitude;
				this.saveAddressObj.latitude = this.addressItem.latitude;
				this.saveAddressObj.address = this.addressItem.address;
				this.saveAddressObj.area = this.addressItem.area;
				this.saveAddressObj.areaCode = this.addressItem.areaCode;
				this.saveAddressObj.city = this.addressItem.city;
				this.saveAddressObj.cityCode = this.addressItem.cityCode;
				this.saveAddressObj.province = this.addressItem.province;
				this.saveAddressObj.provinceCode = this.addressItem.provinceCode;
				this.addressArea = this.addressItem.province + '-' + this.addressItem.city + '-' + this.addressItem.area;
				this.addressDetailsMsg = this.addressItem.address;
				this.userName = this.addressItem.userName;
				this.mobile = this.addressItem.mobile;
				// this.checkFlag = this.addressItem.isDefault ? true : false;
				if(this.addressItem.isDefault) {
					this.checkFlag = this.addressItem.purpose == 1 ? 1 : 2;
				}else {
					this.checkFlag = '';
				}
				this.purpose = Number(this.addressItem.purpose);
				this.serialNumber = Number(this.addressItem.serialNumber); // 1为装货点1，2为装货点2，3为卸货点1，4为卸货点2
				this.routeAddr = options.routeAddr ? options.routeAddr : '';
			}else {
				this.purpose = Number(options.purpose);
				this.serialNumber = Number(options.serialNumber); // 1为装货点1，2为装货点2，3为卸货点1，4为卸货点2
				this.routeAddr = options.routeAddr ? options.routeAddr : '';
			}
			this.getRegionInfo();
			uni.$on("checkStartRegion", item => {
				console.log('装货地', item);
				this.checkedRegionObj = {
					"provinceName": item.provinceName,
					"provinceCode": item.provinceCode,
					"cityName": item.cityName,
					"cityCode": item.cityCode,
					"areaName": item.areaName,
					"areaCode": item.areaCode,
				}
				this.chooseAreaPopupData = [];
				let provinceObj = {
					code: item.provinceCode,
					name: item.provinceName,
				}
				this.chooseAreaPopupData.push(provinceObj);
				let cityObj = {
					code: item.cityCode,
					name: item.cityName,
				}
				let areaObj = {
					code: item.areaCode,
					name: item.areaName,
				}
				if(item.provinceCode == '310000' || item.provinceCode == '110000' || item.provinceCode == '500000' || item.provinceCode == '120000') {
					this.chooseAreaPopupData.push(cityObj);
				}else {
					this.chooseAreaPopupData.push(cityObj);
					this.chooseAreaPopupData.push(areaObj);
				}
				this.toSaveArea();
				this.$refs.newRegionPopup.close();
			})
			
			uni.$on("closeRegionPopup", item => {
				this.$refs.newRegionPopup.close();
			})
			
			console.log(this.serialNumber, 'aaaa')
		},
		onUnload() {
			uni.$off('checkStartRegion');
		},
		onShow() {
			
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.pageTitle
			});
			this.allAreaInfo = uni.getStorageSync('regionData');
			if(this.allAreaInfo && this.allAreaInfo.length > 0) {
				for(let i in this.allAreaInfo) {
					if(this.allAreaInfo[i].code == '310000' || this.allAreaInfo[i].code == '110000' || this.allAreaInfo[i].code == '500000' || this.allAreaInfo[i].code == '120000') {
						this.allAreaInfo[i].name = this.allAreaInfo[i].name + '市';
					}
				}
			}
			if(this.addressItem) {
				var item;
				item = this.saveAddressObj;
				this.checkedAreaData = [];
				if(item.address) {
					let cityCode = '';
					let cityName = '';
					let provinceObj = {
						name: this.saveAddressObj.province,
						code: this.saveAddressObj.provinceCode,
					}
					this.checkedAreaData.push(provinceObj);
					if(this.saveAddressObj.provinceCode == '310000' || this.saveAddressObj.provinceCode == '110000' || this.saveAddressObj.provinceCode == '500000' || this.saveAddressObj.provinceCode == '120000') {
						let cityObj = {
							name: this.saveAddressObj.city,
							code: this.saveAddressObj.cityCode,
						};
						this.checkedAreaData.push(cityObj);
					}else {
						for(let i in this.allAreaInfo) {
							if(this.allAreaInfo[i].code == this.saveAddressObj.provinceCode) {
								for(let a in this.allAreaInfo[i].cities) {
									for(let b in this.allAreaInfo[i].cities[a].areas) {
										if(this.allAreaInfo[i].cities[a].areas[b].code == this.saveAddressObj.areaCode) {
											cityCode = this.allAreaInfo[i].cities[a].code;
											break;
										}
									}
								}
							}
						}
						cityName = this.saveAddressObj.city;
						let cityObj = {
							name: cityName,
							code: cityCode,
						};
						this.checkedAreaData.push(cityObj);
						let areaObj = {
							name: this.saveAddressObj.area,
							code: this.saveAddressObj.areaCode,
						};
						this.checkedAreaData.push(areaObj);
					}
					this.addressArea = '';
					for(let i in this.checkedAreaData) {
						this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
					}
					this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
					
					this.addressDetailsMsg = this.saveAddressObj.address;
				}else {
					this.addressArea = '';
					this.addressDetailsMsg = '';
				}
			}
		},
		methods: {
			jumpToNewAddress() {
				if(!utils.btnRepeat()) return false; // 防抖
				console.log(this.serialNumber, '参数山山水水');
				if (this.pageFrom == "index" || this.pageFrom == "creatOrder") {
					//从首页跳转地址簿
					uni.navigateTo({
					    url: '../newAddress/addressList?purpose=' + this.purpose + '&serialNumber=' + this.optNumber + '&pageFrom=newAddress' + '&type=' + this.type
					});
					
				} else {
					//从地址簿列表跳转新增或编辑
					uni.navigateBack({
						delta: 1
					})
				}
				
			},
			saveAddressMsg() { // 保存地址
				if(!this.msgDone) {
					uni.showToast({
					    title: '请将信息填写完整！',
						icon: 'none',
					    duration: 3000
					});
					return false;
				}
				uni.showLoading({
				    title: '保存中...'
				});
				this.saveAddressObj.address = this.addressDetailsMsg;
				this.saveAddressObj.area = this.checkedAreaData['2'] && this.checkedAreaData['2'].code ? this.checkedAreaData['2'].name : this.checkedAreaData['1'].name;
				this.saveAddressObj.areaCode = this.checkedAreaData['2'] && this.checkedAreaData['2'].code ? this.checkedAreaData['2'].code : this.checkedAreaData['1'].code;
				this.saveAddressObj.city = this.checkedAreaData['1'].name;
				this.saveAddressObj.cityCode = this.checkedAreaData['1'].code;
				this.saveAddressObj.province = this.checkedAreaData['0'].name;
				this.saveAddressObj.provinceCode = this.checkedAreaData['0'].code;
				console.log('保存的地址参数', this.saveAddressObj);
				// if(!this.saveAddressObj.longitude || !this.saveAddressObj.latitude) {
				// 	this.getAddressLocation();
				// }else {
				// 	this.submitAddress();
				// }
				this.getAddressLocation();
			},
			getAddressLocation() {
				let geoMsg = this.saveAddressObj.province;
				geoMsg = geoMsg + (this.saveAddressObj.cityCode == this.saveAddressObj.areaCode ? this.saveAddressObj.city : this.saveAddressObj.city + this.saveAddressObj.area);
				geoMsg = geoMsg + this.saveAddressObj.address;
				let parameters = 'key=6ae872d0bc86389b263ecdf64521a42a&keywords=' + geoMsg;
				// console.log('解析传参', parameters);
				let that = this;
				uni.request({
					url: '	https://restapi.amap.com/v5/place/text?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('第一次地址解析成功', res);
						let rspBody = res.data;
						if(rspBody.status == '1' && Number(rspBody.count) > 0) {
							let ary = res.data.pois;
							let locationAry = ary[0].location.split(',');
							that.saveAddressObj.longitude = locationAry['0'];
							that.saveAddressObj.latitude = locationAry['1'];
							that.submitAddress();
						}else {
							parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&keywords=' + that.saveAddressObj.province + that.saveAddressObj.city + that.saveAddressObj.area;
							uni.request({
								url: '	https://restapi.amap.com/v5/place/text?' + parameters,
								method: 'GET',
								data: {},
								header: {},
								success: (res) => {
									console.log('第二次地址解析成功', res);
									let rspBody = res.data;
									if(rspBody.status == '1' && Number(rspBody.count) > 0) {
										let ary = res.data.pois;
										let locationAry = ary[0].location.split(',');
										that.saveAddressObj.longitude = locationAry['0'];
										that.saveAddressObj.latitude = locationAry['1'];
										that.submitAddress();
									}else {
										that.submitAddress();
									}
								},
								fail: (err) => {
									console.log('失败', err);
									that.submitAddress();
								},
							});
						}
					},
					fail: (err) => {
						console.log('失败', err);
						that.submitAddress();
					},
				});
			},
			submitAddress() { // 保存/编辑地址
				let params = {
					"sid": this.addressItem ? this.addressItem.sid : undefined,
					"userId": this.userId ? this.userId : undefined,
					"userName": this.userName,
					"mobile": this.mobile,
					"province": this.saveAddressObj.province,
					"provinceCode": this.saveAddressObj.provinceCode,
					"city": this.saveAddressObj.city,
					"cityCode": this.saveAddressObj.cityCode,
					"area": this.saveAddressObj.area,
					"areaCode": this.saveAddressObj.areaCode,
					"address": this.saveAddressObj.address,
					"longitude": this.saveAddressObj.longitude ? this.saveAddressObj.longitude : undefined,
					"latitude": this.saveAddressObj.latitude ? this.saveAddressObj.latitude : undefined,
					"serialNumber":this.serialNumber,
					"isDefault": this.checkFlag ? 1 : 0,
					"purpose": this.checkFlag ? this.checkFlag : this.purpose,
				}
				console.log('保存参数', params);
				let that = this;
				utils.postRequest('/ts/user/address/add', params)
				.then(res=>{
					console.log('地址保存', res);
					uni.hideLoading();
					if(res.retCode == '0000000') {
						if(that.addressItem && that.addressItem.sid) {
							let startAddress1 = getApp().globalData.addressObject.loadGoods1;
							let endAddress1 = getApp().globalData.addressObject.unloadGoods1;
							let startAddress2 = getApp().globalData.addressObject.loadGoods2;
							let endAddress2 = getApp().globalData.addressObject.unloadGoods2;
							let startPransportGoods = getApp().globalData.pransportGoods.startAddress;
							let endPransportGoods = getApp().globalData.pransportGoods.endAddress;
							//零担信息的编辑也需要同步
							if (startPransportGoods.sid == that.addressItem.sid) {
								getApp().globalData.pransportGoods.startAddress = {};
								getApp().globalData.pransportGoods.startAddress = res.rspBody
							}
							if (endPransportGoods.sid == that.addressItem.sid) {
								getApp().globalData.pransportGoods.endAddress = {};
								getApp().globalData.pransportGoods.endAddress = res.rspBody
							}
							
							
							if(startAddress1.sid == that.addressItem.sid) {
								getApp().globalData.addressObject.loadGoods1 = {};
								getApp().globalData.addressObject.loadGoods1 = res.rspBody;
							}
							if(startAddress2.sid == that.addressItem.sid) {
								getApp().globalData.addressObject.loadGoods2 = {};
								getApp().globalData.addressObject.loadGoods2 = res.rspBody;
							}
							if(endAddress1.sid == that.addressItem.sid) {
								getApp().globalData.addressObject.unloadGoods1 = {};
								getApp().globalData.addressObject.unloadGoods1 = res.rspBody;
							}
							if(endAddress2.sid == that.addressItem.sid) {
								getApp().globalData.addressObject.unloadGoods2 = {};
								getApp().globalData.addressObject.unloadGoods2 =  res.rspBody;
							}
							
							// 默认地址处理
							let defaultAddressLoadGoods1 = getApp().globalData.defauleAddress.loadGoods1;
							if(defaultAddressLoadGoods1.address && defaultAddressLoadGoods1.sid == that.addressItem.sid) {
								if(that.checkFlag == 1) {
									getApp().globalData.defauleAddress.loadGoods1 = {};
									getApp().globalData.defauleAddress.loadGoods1 =  res.rspBody;
								}else {
									getApp().globalData.defauleAddress.loadGoods1 = {};
								}
							}
							let defaultAddressUnloadGoods1 = getApp().globalData.defauleAddress.unloadGoods1;
							if(defaultAddressUnloadGoods1.address && defaultAddressUnloadGoods1.sid == that.addressItem.sid) {
								if(that.checkFlag == 2) {
									getApp().globalData.defauleAddress.unloadGoods1 = {};
									getApp().globalData.defauleAddress.unloadGoods1 =  res.rspBody;
								}else {
									getApp().globalData.defauleAddress.unloadGoods1 = {};
								}
							}
						} else {
							//新增，且是从首页点击过来新增的
							if (this.pageFrom == "index") {
								if (this.type == 2) { //表示是零担的
									if (this.serialNumber == 1) {
										getApp().globalData.pransportGoods.startAddress = {};
										getApp().globalData.pransportGoods.startAddress = res.rspBody;
									} else {
										getApp().globalData.pransportGoods.endAddress = {};
										getApp().globalData.pransportGoods.endAddress = res.rspBody;
									}
								} else {
									if (this.serialNumber == 1) {
										getApp().globalData.addressObject.loadGoods1 = {};
										getApp().globalData.addressObject.loadGoods1 = res.rspBody;
									} else {
										getApp().globalData.addressObject.unloadGoods1 = {};
										getApp().globalData.addressObject.unloadGoods1 = res.rspBody;
									}
								}
							}
							if(that.routeAddr == 'creatOrder') {
								switch(that.serialNumber) {
									case 1:
										getApp().globalData.addressObject.loadGoods1 = res.rspBody;
										break;
									case 2:
										getApp().globalData.addressObject.loadGoods2 = res.rspBody;
										break;
									case 3:
										getApp().globalData.addressObject.unloadGoods1 = res.rspBody;
										break;
									case 4:
										getApp().globalData.addressObject.unloadGoods2 = res.rspBody;
										break;
								}
							}
						}
						if(params.isDefault) {
							if(that.checkFlag == 1) {
								getApp().globalData.defauleAddress.loadGoods1 = {};
								getApp().globalData.defauleAddress.loadGoods1 =  res.rspBody;
							}else if(that.checkFlag == 2) {
								getApp().globalData.defauleAddress.unloadGoods1 = {};
								getApp().globalData.defauleAddress.unloadGoods1 =  res.rspBody;
							}
						}
						console.log('创建订单传递参数', that.routeAddr, that.serialNumber);
						
						
						uni.navigateBack();
						uni.$emit("refreshData_addressList");
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
					uni.hideLoading();
				})
			},
			checkMsgDone() { // 判断信息是否已填写完整
				if(this.userName && this.mobile && this.addressDetailsMsg && this.addressArea) {
					this.msgDone = true;
				}else {
					this.msgDone = false;
				}
			},
			getRegionInfo() { // 在本地缓存有地区数据的情况下使用本地缓存数据，若本地无数据则请求接口
				let that = this;
				uni.getStorage({
				    key: 'regionData',
				    success: function (rRes) {
				        that.region = rRes.data;
				        that.secondAry = that.region[0].cities;
				        that.thirdAry = that.region[0].cities[0].areas;
				    },
					fail: function (rErr) {
						that.getRegionData();
					}
				});
				
			},
			clearAllData() { // 清空所有变量
				this.userName = '';
				this.mobile = '';
				this.addressDetailsMsg = '';
				this.checkedAreaData = [];
				this.addressArea = '';
				this.saveAddressObj = {};
				this.msgDone = false;
				this.checkFlag = '';
				// this.areaData.provinceCode = '';
				// this.areaData.provinceName = '';
				// this.areaData.cityCode = '';
				// this.areaData.cityName = '';
				// this.areaData.districtCode = '';
				// this.areaData.districtName = '';
				// this.regionVal = [0, 0, 0];
				this.$forceUpdate();
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
							that.secondAry = that.region[0].cities;
							that.thirdAry = that.region[0].cities[0].areas;
					    },
						fail: function (saveErr) {
						}
					});
				})
				.catch(err=>{
					console.log(err);
				})
			},
			regionChange(e) { // 当选择器值发生改变时
				console.log(e);
				this.regionVal = e.detail.value;
				let key1 = this.regionVal[0];
				this.secondAry = this.region[key1].cities;
				let key2 = this.regionVal[1];
				this.thirdAry = this.region[key1].cities[key2].areas;
			},
			closePopup() { // 关闭地址选择器并重置地址值
				this.regionVal = [0, 0, 0];
				this.$refs.regionPopup.close();
			},
			chooseRegion() { // 选择地区
				let key1 = this.regionVal[0];
				let key2 = this.regionVal[1];
				let key3 = this.regionVal[2];
				this.areaData.provinceCode = this.region[key1].code;
				this.areaData.provinceName = this.region[key1].name;
				this.areaData.cityCode = this.region[key1].cities[key2].code;
				this.areaData.cityName = this.region[key1].cities[key2].name;
				this.areaData.districtCode = this.region[key1].cities[key2].areas[key3].code;
				this.areaData.districtName = this.region[key1].cities[key2].areas[key3].name;
				console.log(this.areaData);
				this.checkMsgDone();
				this.$refs.regionPopup.close();
				this.$forceUpdate();
			},
			openRegionPopup() { // 打开地址选择器
				this.areaSetp = '0';
				this.selectAreaFlag = '';
				this.chooseAreaPopupData = this.checkedAreaData;
				console.log(this.chooseAreaPopupData);
				if(this.chooseAreaPopupData.length == 2) {
					this.areaSetp = '1';
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == this.chooseAreaPopupData['0'].code) {
							if(this.chooseAreaPopupData['0'].code == '310000' || this.chooseAreaPopupData['0'].code == '110000' || this.chooseAreaPopupData['0'].code == '500000' || this.chooseAreaPopupData['0'].code == '120000') {
								this.showCityInfo = this.allAreaInfo[i].cities['0'].areas;
								this.selectAreaFlag = 1;
								break;
							}else {
								this.showCityInfo = this.allAreaInfo[i].cities;
								this.selectAreaFlag = 1;
								break;
							}
						}
					}
				}else if(this.chooseAreaPopupData.length == 3) {
					this.areaSetp = '2';
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == this.chooseAreaPopupData['0'].code) {
							if(this.allAreaInfo[i].code == this.chooseAreaPopupData['0'].code) {
								if(this.chooseAreaPopupData['0'].code == '310000' || this.chooseAreaPopupData['0'].code == '110000' || this.chooseAreaPopupData['0'].code == '500000' || this.chooseAreaPopupData['0'].code == '120000') {
									this.showCityInfo = this.allAreaInfo[i].cities['0'].areas;
									this.selectAreaFlag = 1;
								}else {
									this.showCityInfo = this.allAreaInfo[i].cities;
									this.selectAreaFlag = 1;
								}
							}
							for(let a in this.allAreaInfo[i].cities) {
								if(this.allAreaInfo[i].cities[a].code == this.chooseAreaPopupData['1'].code) {
									this.showAreaInfo = this.allAreaInfo[i].cities[a].areas;
									this.selectAreaFlag = 2;
									break;
								}
							}
						}
					}
				}
				this.$refs.chooseAreaPopup.open();
			},
			openNewRegionPopup() {
				this.$refs.newRegionPopup.open();
			},
			chooseLocation() {
				//地图选点
				var that = this;
				var saveAddressObj = that.saveAddressObj;
				console.log(saveAddressObj, 'aaa');
				var keyword = "";
				if (saveAddressObj.latitude) {
					// var provinceObjCode = saveAddressObj.provinceCode;
					// if(provinceObjCode == '310000' || provinceObjCode == '110000' || provinceObjCode == '500000' || provinceObjCode == '120000') {
					// 	keyword = saveAddressObj.province + saveAddressObj.city + saveAddressObj.address
					// }else {
					// 	keyword =  saveAddressObj.province + saveAddressObj.city + saveAddressObj.area + saveAddressObj.address
					// }
					// console.log(keyword, 'guanjianzi1')
					uni.chooseLocation({
						latitude: saveAddressObj.latitude,
						longitude: saveAddressObj.longitude,
						success: function(res) {
							console.log('==='+JSON.stringify(res))
							that.locationSearchVal = res.address;
							that.addrToDetail();
							// console.log('位置名称：' + res.name);
							// console.log('详细地址：' + res.address);
							console.log('纬度：' + that.str_chu_latitude);
							console.log('经度：' + that.str_chu_longitude);
							// console.log('出发地=='+that.str_chu)
						},
						fail: function(err) {
							console.log(err)
						}
					});
				} else {
					uni.chooseLocation({
						success: function(res) {
							console.log('==='+JSON.stringify(res))
							that.locationSearchVal = res.address;
							that.addrToDetail();
							// console.log('位置名称：' + res.name);
							// console.log('详细地址：' + res.address);
							console.log('纬度：' + that.str_chu_latitude);
							console.log('经度：' + that.str_chu_longitude);
							// console.log('出发地=='+that.str_chu)
						},
					});
				}
				
				
			},
			addrToDetail() {
				let that = this;
				//根据地址搜索
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&address=' + that.locationSearchVal;
				console.log('搜索参数', parameters);
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/geo?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('成功', res);
						if (res.statusCode == 200) {
							let geocodes = res.data.geocodes;
							let chooseAddr = geocodes[0];
							let adcode = chooseAddr.adcode;
							let provinceObjCode = adcode.slice(0, 2) + '0000';
							let cityCode = '';
							let cityName = '';
							that.checkedAreaData = [];
							console.log(provinceObjCode, '省代码');
							if(provinceObjCode == '310000' || provinceObjCode == '110000' || provinceObjCode == '500000' || provinceObjCode == '120000') {
								let provinceObj = {
									name: chooseAddr.province,
									code: provinceObjCode,
								}
								
								this.checkedAreaData.push(provinceObj);
								let cityObj = {
									name: chooseAddr.district,
									code: adcode,
								};
								this.checkedAreaData.push(cityObj);
							}else {
								//判断是否获取到三级数据
								if (!chooseAddr.city || chooseAddr.city.length < 1) {
									let provinceObj = {
										name: chooseAddr.province,
										code: provinceObjCode,
									}
									this.checkedAreaData.push(provinceObj);
									let areaObj = {
										name: chooseAddr.district,
										code: chooseAddr.adcode,
									};
									this.checkedAreaData.push(areaObj);
									
									
									this.addressArea = '';
									for(let i in this.checkedAreaData) {
										this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
									}
									this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
									let formatted_address = chooseAddr.formatted_address;
									let addressDetailsMsg = formatted_address
								
									this.addressDetailsMsg = addressDetailsMsg;
									this.saveAddressObj.address = addressDetailsMsg;
								
									if(chooseAddr.location) {
										let locationAry = chooseAddr.location.split(',');
										this.saveAddressObj.longitude = locationAry && locationAry['0'] ? locationAry['0'] : '';
										this.saveAddressObj.latitude = locationAry && locationAry['1'] ? locationAry['1'] : '';
									}
									this.checkMsgDone();
									return;
								}
								
								if (!chooseAddr.district || chooseAddr.district.length < 1) {	
									let provinceObj = {
										name: chooseAddr.province,
										code: provinceObjCode,
									}
									this.checkedAreaData.push(provinceObj);
									let cityObj = {
										name: chooseAddr.city,
										code: adcode,
									};
									this.checkedAreaData.push(cityObj);
									
									this.addressArea = '';
									for(let i in this.checkedAreaData) {
										this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
									}
									this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
									let formatted_address = chooseAddr.formatted_address;
									let addressDetailsMsg = formatted_address
									if (!addressDetailsMsg) {
										this.addressDetailsMsg = chooseAddr.district;
										this.saveAddressObj.address = chooseAddr.district;
									} else {
										this.addressDetailsMsg = addressDetailsMsg;
										this.saveAddressObj.address = addressDetailsMsg;
									}
									if(chooseAddr.location) {
										let locationAry = chooseAddr.location.split(',');
										this.saveAddressObj.longitude = locationAry && locationAry['0'] ? locationAry['0'] : '';
										this.saveAddressObj.latitude = locationAry && locationAry['1'] ? locationAry['1'] : '';
									}
									this.checkMsgDone();
									return;
								}
								let provinceObj = {
									name: chooseAddr.province,
									code: provinceObjCode,
								}
								this.checkedAreaData.push(provinceObj);
								for(let i in this.allAreaInfo) {
									if(this.allAreaInfo[i].code == provinceObjCode) {
										for(let a in this.allAreaInfo[i].cities) {
											for(let b in this.allAreaInfo[i].cities[a].areas) {
												if(this.allAreaInfo[i].cities[a].areas[b].code == adcode) {
													cityCode = this.allAreaInfo[i].cities[a].code;
													break;
												}
											}
										}
									}
								}
								cityName = chooseAddr.city;
								cityCode = cityCode ? cityCode : chooseAddr.adcode.substr(0, 3) + '00';
								let cityObj = {
									name: cityName,
									code: cityCode,
								};
								this.checkedAreaData.push(cityObj);
								let areaObj = {
									name: chooseAddr.district,
									code: chooseAddr.adcode,
								};
								this.checkedAreaData.push(areaObj);
							}
							console.log(this.checkedAreaData, '阿森纳啊', this.saveAddressObj);
							this.addressArea = '';
							for(let i in this.checkedAreaData) {
								this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
							}
							this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
							let formatted_address = chooseAddr.formatted_address;
							let addressDetailsMsg = formatted_address.split(chooseAddr.district)[1]
							if (!addressDetailsMsg) {
								this.addressDetailsMsg = chooseAddr.district;
								this.saveAddressObj.address = chooseAddr.district;
							} else {
								this.addressDetailsMsg = addressDetailsMsg;
								this.saveAddressObj.address = addressDetailsMsg;
							}
							if(chooseAddr.location) {
								let locationAry = chooseAddr.location.split(',');
								this.saveAddressObj.longitude = locationAry && locationAry['0'] ? locationAry['0'] : '';
								this.saveAddressObj.latitude = locationAry && locationAry['1'] ? locationAry['1'] : '';
							}
							this.checkMsgDone();
							console.log('选择的地址', this.saveAddressObj);
						} else {
							uni.showToast({
								title: '地址转经纬度失败，请重新选择地址',
								icon: 'none'
							})
						}
						
					},
					fail: (err) => {
						console.log('失败', err);
					},
					complete: (com) => {
						console.log('完成', com);
					}
				});
				
			},
			showLocationPopup() {
				this.searchBoxLoading = false;
				this.locationSearchVal = '';
				if(this.addressArea || this.addressDetailsMsg) {
					if(this.addressArea) {
						this.locationSearchVal = this.addressArea.replace(/-/g, '');
					}
					this.locationSearchVal = this.locationSearchVal + this.addressDetailsMsg;
					this.toSearch();
				}else {
					this.getUserLocation();
				}
				this.$refs.locationPopup.open();
			},
			toCloseLocationPopup() {
				this.$refs.locationPopup.close();
			},
			checkSearchValThenSearch() { // 有搜索信息则直接搜索，无则定位本地后搜索
				if(this.locationSearchVal) {
					this.toSearch();
				}else {
					this.getUserLocation();
				}
			},
			getUserLocation() {
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function (res) {
						that.locationSearchVal = res.address.poiName;
						that.toSearch();
					},
					fail: function (err) {
						uni.hideLoading();
						uni.showModal({
						    title: '网络定位失败',
						    content: '请检查设备是否插入sim卡，是否开启移动网络或开启了wifi模块，请检查是否授予APP定位权限',
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
						            console.log('用户点击确定');
						        }
						    }
						});
					}
				});
			},
			toSearch() { // 搜索
				if(this.searchBoxLoading) {
					return false;
				}
				this.searchPageNum = 1;
				this.searchBoxLoading = true;
				this.searchNoMoreData = false;
				
				let that = this;
				//根据地址搜索
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&offset=30&extensions=all&' + 'page_num=' + that.searchPageNum + '&keywords=' + that.locationSearchVal;
				console.log('搜索参数', parameters);
				uni.request({
					url: 'https://restapi.amap.com/v5/place/text?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('成功', res);
						let poisAry = res.data.pois;
						if(poisAry && poisAry.length < 20) {
							that.searchNoMoreData = true;
						}
						if(poisAry && poisAry.length > 0) {
							var newArr = poisAry.filter(item => item.name.indexOf("公交站") == -1);
							var newArr1 = newArr.filter(item => item.location);
							that.searchData = newArr1;
						}else {
							that.searchData = [];
						}
					},
					fail: (err) => {
						console.log('失败', err);
					},
					complete: (com) => {
						setTimeout(() => {
							that.searchBoxLoading = false;
						}, 500);
					}
				});
			},
			addressOnload() { // 懒加载
				if(this.searchBoxLoading || this.searchNoMoreData) {
					return false;
				}
				this.searchBoxLoading = true;
				let that = this;
				that.searchPageNum = that.searchPageNum + 1;
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&offset=30&extensions=all&' + 'page_num=' + that.searchPageNum + '&keywords=' + that.locationSearchVal;
				uni.request({
					url: 'https://restapi.amap.com/v5/place/text?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('成功', res);
						let ary =  [];
						ary = res.data.pois;
						if(ary && ary.length < 20) {
							that.searchNoMoreData = true;
						}
						if(ary && ary.length > 0) {
							var newArr = ary.filter(item => item.name.indexOf('公交站') == -1);
							var newArr1 = newArr.filter(item => item.location);
							// console.log(newArr);
							for(let i in newArr1) {
								that.searchData.push(newArr[i]);
							}
						}
					},
					fail: (err) => {
						console.log('失败', err);
					},
					complete: (com) => {
						setTimeout(() => {
							that.searchBoxLoading = false;
						}, 500);
					}
				});
			},
			chooseAddress(item) { // 保存地址并覆盖省市区
				let cityCode = '';
				let cityName = '';
				this.checkedAreaData = [];
				let provinceObj = {
					name: item.pname,
					code: item.pcode,
				}
				this.checkedAreaData.push(provinceObj);
				if(item.pcode == '310000' || item.pcode == '110000' || item.pcode == '500000' || item.pcode == '120000') {
					let cityObj = {
						name: item.adname,
						code: item.adcode,
					};
					this.checkedAreaData.push(cityObj);
				}else {
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == item.pcode) {
							for(let a in this.allAreaInfo[i].cities) {
								for(let b in this.allAreaInfo[i].cities[a].areas) {
									if(this.allAreaInfo[i].cities[a].areas[b].code == item.adcode) {
										cityCode = this.allAreaInfo[i].cities[a].code;
										break;
									}
								}
							}
						}
					}
					cityName = item.cityname;
					let cityObj = {
						name: cityName,
						code: cityCode,
					};
					this.checkedAreaData.push(cityObj);
					let areaObj = {
						name: item.adname,
						code: item.adcode,
					};
					this.checkedAreaData.push(areaObj);
				}
				this.addressArea = '';
				for(let i in this.checkedAreaData) {
					this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
				}
				this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
				this.addressDetailsMsg = item.address;
				if(item.location) {
					let locationAry = item.location.split(',');
					this.saveAddressObj.longitude = locationAry && locationAry['0'] ? locationAry['0'] : '';
					this.saveAddressObj.latitude = locationAry && locationAry['1'] ? locationAry['1'] : '';
				}
				this.$refs.locationPopup.close();
				this.checkMsgDone();
				console.log('选择的地址', this.saveAddressObj);
			},
			changeSelectFlag(key) { // 切换选中的tab
				// console.log(key);
				// for(let i in this.checkedAreaData) {
				// 	console.log(i);
				// }
				if(this.selectAreaFlag != key){
					this.scrollTop = 1;
					this.$nextTick(function() {
						this.scrollTop = 0;
						console.log(this.scrollTop)
					});
				}
				this.selectAreaFlag = key;
				this.areaSetp = key.toString();
			},
			toCloseAreaPopup() {
				this.$refs.chooseAreaPopup.close();
			},
			checkProvince(item) { // 选择省
				console.log('选择的省', item);
				this.chooseAreaPopupData = [];
				if(item.code == '310000' || item.code == '110000' || item.code == '500000' || item.code == '120000') {
					this.showCityInfo = item.cities['0'].areas;
				}else {
					this.showCityInfo = item.cities;
				}
				let obj = {
					"code": item.code,
					"name": item.name,
				};
				this.chooseAreaPopupData.push(obj);
				this.selectAreaFlag = 0;
				this.areaSetp = '1';
				this.scrollTop = 1;
				this.$nextTick(function() {
					this.scrollTop = 0;
					console.log(this.scrollTop)
				});
			},
			checkCity(item) { // 选择市
				console.log('选择的市', item);
				if(this.chooseAreaPopupData.length == 1) {
					let obj = {
						"code": item.code,
						"name": item.name,
					};
					this.chooseAreaPopupData.push(obj);
				}else {
					this.chooseAreaPopupData.pop();
					this.chooseAreaPopupData['1'] = {
						"code": item.code,
						"name": item.name,
					};
				}
				this.selectAreaFlag = 1;
				if(
					this.chooseAreaPopupData['0'].code == '310000' ||
					this.chooseAreaPopupData['0'].code == '110000' ||
					this.chooseAreaPopupData['0'].code == '500000' ||
					this.chooseAreaPopupData['0'].code == '120000'
				) {
					if(this.chooseAreaPopupData.length == 3) {
						this.chooseAreaPopupData.pop();
					}
					this.toSaveArea();
				}else {
					this.areaSetp = '2';
					this.showAreaInfo = item.areas;
				}
				this.scrollTop = 1;
				this.$nextTick(function() {
					this.scrollTop = 0;
					console.log(this.scrollTop)
				});
			},
			checkArea(item) {
				console.log('选择的区', item);
				if(this.chooseAreaPopupData.length == 2) {
					let obj = {
						"code": item.code,
						"name": item.name,
					};
					this.chooseAreaPopupData.push(obj);
				}else {
					this.chooseAreaPopupData['2'] = {
						"code": item.code,
						"name": item.name,
					};
				}
				this.selectAreaFlag = 2;
				this.toSaveArea();
			},
			toSaveArea() {
				let checkAreaData = '';
				let newAreaData = '';
				if(this.checkedAreaData.length > 0) {
					for(let i in this.checkedAreaData) {
						checkAreaData = checkAreaData + this.checkedAreaData[i].code;
					}
				}
				console.log('选中的省市区', this.chooseAreaPopupData);
				this.checkedAreaData = [];
				this.checkedAreaData = this.chooseAreaPopupData;
				this.addressArea = '';
				for(let i in this.checkedAreaData) {
					newAreaData = newAreaData + this.checkedAreaData[i].code;
					this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
				}
				console.log('原省市区', this.checkedAreaData);
				this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
				this.addressDetailsMsg = checkAreaData == newAreaData ? this.addressDetailsMsg : '';
				this.saveAddressObj = checkAreaData == newAreaData ? this.saveAddressObj : {}; //改变省市时清空已选择的参数
				this.checkMsgDone();
				this.$refs.chooseAreaPopup.close();
			},
		}
	}
</script>

<style lang="scss">
	.newAddress {
		padding-top:16rpx;
		padding-bottom:150rpx;
		input::-webkit-input-placeholder{
			font-size: 30rpx;
			color: #777777;
		}
		.addressInputBox {
			margin:0 16rpx;
			padding: 32rpx 22rpx 0 22rpx;
			background-color: #FFF;
			border-radius: 12rpx;
			.mainTitle {
				display: flex;
				flex-direction: row;
				align-items: center;
				.mainText {
					font-size: 36rpx;
					font-weight: bold;
					color: #333333;
					margin-right: 36rpx;
				}
				.subText {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
					color: #333333;
					.aListIcon {
						flex-shrink: 0;
						margin-right: 20rpx;
						width: 36rpx;
						height: 34rpx;
						
					}
				}
			}
			.addressCol + .addressCol {
				border-top: 2rpx solid rgba(247, 248, 248, 1);
			}
			.addressCol {
				padding: 32rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				.msgInput + .msgInput {
					margin-left:40rpx;
				}
				.msgInput {
					font-size: 30rpx;
					color: #333;
					&.defaultStyle {
						color: #b2b2b2;
					}
				}
				.inputTitle {
					font-size: 30rpx;
				}
				.checkBoxGroup {
					display: flex;
					align-items: center;
				}
				.checkDefaultBtn + .checkDefaultBtn {
					margin-left: 20rpx;
				}
				.checkDefaultBtn {
					display: flex;
					align-items: center;
					.checkIcon {
						height: 28rpx;
						width: 28rpx;
						margin-right:8rpx;
						margin-top:-2rpx;
					}
				}
				.checkMsg {
					font-size: 26rpx;
					color: #777777;
				}
				.locationIcon {
					width: 40rpx;
					height: 48rpx;
				}
				.addressTextLabel {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
				}
				.locationText {
					color: #2973FA;
					font-size: 28rpx;
					margin-left: 20rpx;
				}
				.downIcon {
					width: 29rpx;
					height: 16rpx;
				}
			}
		}
		.historyAddress {
			padding-top:48rpx;
			.historyTitle {
				padding:0 38rpx;
				font-size: 30rpx;
				color: #777777;
			}
			.historyList {
				margin:16rpx;
				padding: 32rpx;
				background-color: #FFF;
				border-radius: 10rpx;
				.nameMsgBox {
					display: flex;
					.msg + .msg {
						margin-left: 20rpx;
					}
					.msg {
						font-size: 28rpx;
						color: #333333;
					}
				}
				.addressMsg {
					padding-top:10rpx;
					line-height: 34rpx;
					font-size: 24rpx;
					color: #777777;
				}
			}
		}
		.footBtnGroup {
			position: fixed;
			bottom:0;
			padding: 24rpx 60rpx;
			width:630rpx;
			background-color: #FFF;
			border-radius: 24rpx 24rpx 0px 0px;
			.externalBtn {
				height: 90rpx;
				line-height: 90rpx;
				border-radius:44rpx;
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
			.isDone {
				background-color: #4AA2F3;
				box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
			}
			.isDefault {
				background-color: #CCCCCC;
			}
		}
		.popupBox {
			background-color: #FFF;
			.popupBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:20rpx 40rpx;
				.cancleBtn {
					font-size: 30rpx;
					color:#F56C6C;
					font-weight:bold;
				}
				.confirmBtn {
					font-size: 30rpx;
					color:#409EFF;
					font-weight:bold;
				}
			}
			.picker-view{
				width: 750rpx;
				height: 400rpx;
			}
			.item{
				height:60rpx;
				line-height: 60rpx;
				align-items: center;
				justify-content: center;
				text-align: center;
			}
		}
		@keyframes rotating {
		    0% {
		        transform:rotate(0deg);
		    }
		    100% {
		        transform:rotate(360deg);
		    }
		}
		.locationAddressBox {
			margin-left: 54rpx;
			margin-right: 54rpx;
			background-color: #FFF;
			border-radius: 16rpx;
			width: 642rpx;
			.locationPopupHead {
				display: flex;
				align-items: center;
				padding: 20rpx 18rpx 20rpx 24rpx;
				border-bottom: 1rpx solid #E3E3E3;
				.locationBackIcon {
					width: 32rpx;
					height: 32rpx;
					transform:rotate(180deg);
					margin-right:32rpx;
				}
				.locationInputBox {
					flex: 1;
					height: 66rpx;
					background: #F5F6F8;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					padding: 0 24rpx;
					box-sizing: border-box;
					.locationInput{
						flex: 1;
						font-size: 28rpx;
						color:#333;
					}
					.addressLocationBox {
						padding-left: 30rpx;
						display: flex;
						align-items: center;
						.locationIcon {
							width: 30rpx;
							height: 30rpx;
							margin-right:14rpx;
						}
						.msg {
							font-size: 26rpx;
							color: #4AA2F3;
							line-height: 36rpx;
						}
					}
				}
			}
			.locationScroll {
				height: 700rpx;
				.addressSearchList + .addressSearchList {
					border-top: 1rpx solid #E3E3E3;
				}
				.addressSearchList {
					padding: 18rpx 24rpx 20rpx 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.listContent {
						flex: 1;
						.name {
							font-size: 32rpx;
							color: #333333;
							line-height: 44rpx;
							letter-spacing: 2rpx;
						}
						.msg {
							font-size: 24rpx;
							color: #777777;
							line-height: 34rpx;
						}
					}
					.searchComfirmIcon {
						width: 18rpx;
						height: 32rpx;
						margin-left: 30rpx;
					}
				}
			}
			.popupLoadingBox {
				height: 700rpx;
				width: 642rpx;
				margin-top:-700rpx;
				position: absolute;
				z-index: 999;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: rgba(255,255,255,0.6);
				border-bottom-right-radius: 16rpx;
				border-bottom-left-radius: 16rpx;
				.loadingIcon {
					width:36rpx;
					height: 36rpx;
					-webkit-animation: rotating 1.5s linear infinite;
					animation: rotating 1.5s linear infinite;
				}
			}
		}
		.chooseAreaBox {
			background-color: #FFF;
			height: 900rpx;
			.checkedArea {
				color:#4AA2F3;
			}
			.defaultArea {
				color:#333;
			}
			.areaPopupHead {
				padding: 0 36rpx 0 28rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #E3E3E3;
				height: 92rpx;
				.checkedAreaBox {
					display: flex;
					align-items: center;
					.areaList + .areaList {
						margin-left: 36rpx;
					}
					.areaList {
						min-width:100rpx;
						text-align: center;
						padding-top: 22rpx;
						.areaMsg {
							font-size: 28rpx;
							line-height: 40rpx;
							margin-bottom:22rpx;
							max-width:200rpx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							word-break: break-all;
						}
						.checkedLine {
							height: 6rpx;
							background: #4AA2F3;
							border-radius: 2rpx;
						}
						.defaultLine {
							height: 6rpx;
							background: #FFF;
							border-radius: 2rpx;
						}
					}
				}
				.closeAreaPopupIcon {
					width: 24rpx;
					height: 24rpx;
				}
			}
			
			.areaPopupBody {
				height: 808rpx;
				.detailsList + .detailsList {
					border-top: 2rpx solid #E3E3E3;
				}
				.detailsList {
					height: 72rpx;
					padding: 0 36rpx 0 28rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.detailsMsg {
						font-size: 28rpx;
						line-height: 40rpx;
					}
					.areaRightIcon {
						width: 18rpx;
						height: 32rpx;
					}
				}
			}
		}
		@keyframes rotating {
		    0% {
		        transform:rotate(0deg);
		    }
		    100% {
		        transform:rotate(360deg);
		    }
		}
		.loadingBox {
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 1.5s linear infinite;
		        animation: rotating 1.5s linear infinite;
			}
			.noDataIcon {
				width: 244rpx;
				height: 246rpx;
				margin-top:50rpx;
			}
		}
	}
</style>
