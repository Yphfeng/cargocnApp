<template>
	<view class="textModel">
		<view class="jumpToSendGoods">
			<view class="jumpBtn" @click="showAddressPopup()">组件测试</view>
		</view>
		
		<uni-popup ref="editAddressPopup" type="bottom">
			<view class="addressPopupBox">
				<view class="popupHeadBox">
					<view class="cancelBtn" @click="closeAddressPopup()">取消</view>
					<view class="popupTitle">编辑装货地</view>
					<view class="confirmBtn" @click="saveAddressEdit()">确定</view>
				</view>
				<view class="popupBodyBox">
					<view class="chooseRow" @click="jumpToChooseArea()">
						<view class="chooseTitle">
							<view class="areaMsg" :style="addressPopupObj.province ? 'color: #000;' : 'color: #666;'">
								{{addressPopupObj.province ? addressPopupObj.province + ' ' + addressPopupObj.city + ' ' + addressPopupObj.area : '请选择地区'}}
							</view>
							<view class="areaHint">必填</view>
						</view>
						<view class="chooseBtn">
							点击选择
							<image class="chooseIcon" src="/static/images/newOrderDetails/rightArrow.png"></image>
						</view>
					</view>
					<view class="chooseRow">
						<input class="addressInput flexInput" type="text" placeholder="输入详情地址" :placeholder-style="placeholderStyle" v-model="addressPopupObj.address"/>
						<view class="mapChooseBtn" @click="chooseLocation">地图选择</view>
					</view>
					<view class="chooseRow">
						<input class="addressInput colInput" type="text" maxlength="5" placeholder="输入姓名" :placeholder-style="placeholderStyle" v-model="addressPopupObj.name"/>
						<view class="inputLine"></view>
						<input class="addressInput flexInput" type="number" maxlength="11" placeholder="输入手机号" :placeholder-style="placeholderStyle" v-model="addressPopupObj.mobile"/>
					</view>
					<view class="historyAddressTitle">历史装货地址</view>
					<scroll-view style="height: 400rpx;" :scroll-y="true">
						<view class="historyAddressList" v-for="(item, index) in historyAddressInfo" :key="index">
							<image class="historyAddrIcon" src="/static/images/newFleetDetails/beidou.png"></image>
							<view class="historyAddrContent">
								<view class="hAArea">
									<text class="areaMsg">{{item.province + ' ' + item.city + ' ' + item.area}}</text>
									<text class="nameMobile" v-if="item.name">{{item.name}}</text>
									<text class="nameMobile" v-if="item.mobile">{{item.mobile}}</text>
								</view>
								<view class="hADetail" v-if="item.address">{{item.address}}</view>
							</view>
						</view>
						<view class="noHistoryAddress" v-if="historyAddressInfo.length == 0">暂无历史地址～</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				userInfo: {},
				addressPopupObj: {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
					address: '',
					name: '',
					mobile: '',
					longitude: '',
					latitude: ''
				},
				placeholderStyle: 'font-size: 36rpx;font-weight: 500;color: #666;',
				historyAddressInfo: []
			};
		},
		onLoad() {
			this.getUserDetail();
		},
		onShow() {
			let newAddressChooseSerial = getApp().globalData.newChooseAddressObj;
			if(newAddressChooseSerial) {
				let newChooseAddressObj = getApp().globalData.newChooseAddressObj;
				this.addressPopupObj.province = newChooseAddressObj.province ? newChooseAddressObj.province : '';
				this.addressPopupObj.provinceCode = newChooseAddressObj.provinceCode ? newChooseAddressObj.provinceCode : '';
				this.addressPopupObj.city = newChooseAddressObj.city ? newChooseAddressObj.city : '';
				this.addressPopupObj.cityCode = newChooseAddressObj.cityCode ? newChooseAddressObj.cityCode : '';
				this.addressPopupObj.area = newChooseAddressObj.area ? newChooseAddressObj.area : '';
				this.addressPopupObj.areaCode = newChooseAddressObj.areaCode ? newChooseAddressObj.areaCode : '';
				getApp().globalData.newChooseAddressObj = '';
			}
		},
		onReady() {},
		methods: {
			getUserDetail() { // 获取用户信息
				var userInfo = uni.getStorageSync("userInfo");
				if (userInfo) {
					this.userInfo = JSON.parse(userInfo);
				}
			},
			jumpToChooseArea() {
				uni.navigateTo({
					url: '/pages/chooseAera/chooseAera'
				})
			},
			showAddressPopup() {
				this.$refs.editAddressPopup.open();
			},
			closeAddressPopup() {
				this.$refs.editAddressPopup.close();
			},
			getAddressLocation() {
				let geoMsg = this.addressPopupObj.province;
				geoMsg = this.addressPopupObj.city ? geoMsg + this.addressPopupObj.city : geoMsg;
				geoMsg = this.addressPopupObj.area ? geoMsg + this.addressPopupObj.area : geoMsg;
				let that = this;
				uni.request({
					url: '	https://restapi.amap.com/v5/place/text?' + 'key=6ae872d0bc86389b263ecdf64521a42a&keywords=' + geoMsg + this.addressPopupObj.address,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('第一次地址解析成功', res);
						let rspBody = res.data;
						if(rspBody.status == '1' && Number(rspBody.count) > 0) {
							let ary = res.data.pois;
							let locationAry = ary[0].location.split(',');
							let returnObj = {
								latitude: locationAry['1'],
								longitude: locationAry['0'],
							}
							return returnObj
						}else {
							if(geoMsg) {
								uni.request({
									url: '	https://restapi.amap.com/v5/place/text?' + 'key=6ae872d0bc86389b263ecdf64521a42a&keywords=' + geoMsg,
									method: 'GET',
									data: {},
									header: {},
									success: (resSec) => {
										console.log('第二次地址解析成功', resSec);
										let rspBody = resSec.data;
										if(rspBody.status == '1' && Number(rspBody.count) > 0) {
											let ary = resSec.data.pois;
											let locationAry = ary[0].location.split(',');
											let returnObj = {
												latitude: locationAry['1'],
												longitude: locationAry['0'],
											}
											return returnObj
										}else {
											return '';
										}
									},
									fail: (errSec) => {
										return '';
									},
								});
							}
						}
					},
					fail: (err) => {
						console.log('失败', err);
						return '';
					},
				});
			},
			chooseLocation() { //地图选点
				let that = this;
				if(that.addressPopupObj.latitude && that.addressPopupObj.longitude) { // 有经纬度则直接调用api
					uni.chooseLocation({
						latitude: that.addressPopupObj.latitude,
						longitude: that.addressPopupObj.longitude,
						success: function(res) {
							console.log('地图选择的地址1', JSON.stringify(res))
							that.addrToDetail(res.address, res.longitude, res.latitude);
						},
					});
				}else { // 没有经纬度则拼接省市区及详细地址去获取经纬度
					if(that.addressPopupObj.province || that.addressPopupObj.address) {
						let locationObj = that.getAddressLocation();
						if(locationObj) {
							uni.chooseLocation({
								latitude: locationObj.latitude,
								longitude: locationObj.longitude,
								success: function(res) {
									console.log('地图选择的地址2', JSON.stringify(res))
									that.addrToDetail(res.address, res.longitude, res.latitude);
								},
							});
						}else {
							uni.chooseLocation({
								success: function(res) {
									console.log('地图选择的地址3', JSON.stringify(res))
									that.addrToDetail(res.address, res.longitude, res.latitude);
								},
							});
						}
					}else {
						uni.chooseLocation({
							success: function(res) {
								console.log('地图选择的地址4', JSON.stringify(res))
								that.addrToDetail(res.address, res.longitude, res.latitude);
							},
						});
					}
				}
			},
			addrToDetail(address, longitude, latitude) {
				uni.showLoading();
				console.log('地址', address);
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
							that.addressPopupObj.province = regeocode.addressComponent.province;
							that.addressPopupObj.provinceCode = provinceCode;
							that.addressPopupObj.area = regeocode.addressComponent.district;
							that.addressPopupObj.areaCode = regeocode.addressComponent.adcode;
							that.addressPopupObj.longitude = longitude;
							that.addressPopupObj.latitude = latitude;
							that.addressPopupObj.address = address;
							console.log(that.addressPopupObj);
							if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
								that.addressPopupObj.city = '';
								that.addressPopupObj.cityCode = '';
							}else {
								let cityCode = (regeocode.addressComponent.adcode.substr(0,2)) + regeocode.addressComponent.citycode
								that.addressPopupObj.city = regeocode.addressComponent.city;
								that.addressPopupObj.cityCode = cityCode;
							}
						}else {
							uni.showToast({
							    title: '地址解析失败，请更换地址或重新选择！',
								icon: 'none',
							    duration: 3000
							});
						}
					},
					fail: (err) => {
						console.log('失败', err);
						uni.showToast({
						    title: '地址解析失败，请更换地址或重新选择！',
							icon: 'none',
						    duration: 3000
						});
					},
					complete: (com) => {
						uni.hideLoading();
					}
				});
			},
			saveAddressEdit() {
				if(!this.addressPopupObj.longitude || !this.addressPopupObj.latitude) {
					let locationObj = that.getAddressLocation();
					if(locationObj) {
						this.addressPopupObj.longitude = locationObj.longitude;
						this.addressPopupObj.latitude = locationObj.latitude;
					}
					this.$refs.editAddressPopup.close();
				}else {
					this.$refs.editAddressPopup.close();
				}
				console.log(this.addressPopupObj);
			}
		}
	}
</script>

<style lang="scss">
	.textModel {
		.jumpToSendGoods {
			width: 100vw;
			box-sizing: border-box;
			padding: 44rpx;
			background-color: #FFF;
			z-index: 99;
			position: fixed;
			bottom: 0;
			left: 0;
			.jumpBtn {
				width: 400rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #2B72F0;
				border-radius: 16rpx;
				margin: 0 auto;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
		}
		.addressPopupBox {
			background-color: #FFF;
			border-top-left-radius: 24rpx;
			border-top-right-radius: 24rpx;
			padding: 48rpx 36rpx;
			.popupHeadBox {
				display:flex;
				align-items: center;
				justify-content: space-between;
				.cancelBtn {
					font-size: 32rpx;
					color: #2B72F0;
					line-height: 40rpx;
				}
				.popupTitle {
					font-size: 40rpx;
					font-weight: 600;
					color: #333333;
				}
				.confirmBtn {
					width: 154rpx;
					height: 62rpx;
					line-height: 62rpx;
					background: #2B72F0;
					border-radius: 8rpx;
					font-size: 32rpx;
					color: #FFFFFF;
					text-align:center;
				}
			}
			.popupBodyBox {
				padding-top: 58rpx;
				.chooseRow + .chooseRow {
					border-top: 2rpx solid #E7E7E7;
				}
				.chooseRow {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 32rpx 0;
					.chooseTitle {
						flex: 1;
						display: flex;
						align-items: center;
						.areaMsg {
							font-size: 36rpx;
							font-weight: 500;
							line-height: 40rpx;
						}
						.areaHint {
							flex-shrink: 0;
							margin-left: 8rpx;
							width: 64rpx;
							height: 32rpx;
							line-height: 32rpx;
							border-radius: 56rpx;
							border: 2rpx solid #2B72F0;
							font-size: 16rpx;
							color: #2B72F0;
							text-align: center;
						}
					}
					.chooseBtn {
						padding-left: 32rpx;
						flex-shrink: 0;
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: #333333;
						line-height: 44rpx;
						.chooseIcon {
							width: 14rpx;
							height: 24rpx;
							padding-left: 20rpx;
						}
					}
					.addressInput {
						height: 44rpx;
						font-size: 36rpx;
						font-weight: 500;
						color:#000;
					}
					.colInput {
						flex: 0 0 208rpx;
					}
					.flexInput {
						flex: 1;
					}
					.inputLine {
						flex-shrink: 0;
						width: 2rpx;
						height: 36rpx;
						background-color: #E7E7E7;
						margin-right: 80rpx;
					}
					.mapChooseBtn {
						flex-shrink: 0;
						font-size: 28rpx;
						font-weight: 500;
						color: #2B72F0;
						line-height: 44rpx;
						margin-left: 32rpx;
					}
				}
				.historyAddressTitle {
					margin-top: 48rpx;
					font-size: 36rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
				}
				.historyAddressList {
					height: 168rpx;
					background: #FAFAFA;
					border-radius: 16rpx;
					padding: 0 40rpx;
					display: flex;
					align-items: center;
					margin-top: 32rpx;
					.historyAddrIcon {
						flex-shrink: 0;
						width: 33rpx;
						height: 44rpx;
					}
					.historyAddrContent {
						flex: 1;
						box-sizing: border-box;
						padding-left: 30rpx;
						.hAArea {
							line-height: 32rpx;
							.areaMsg {
								font-size: 32rpx;
								font-weight: 500;
								color: #333333;
								padding-right: 24rpx;
							}
							.nameMobile + .nameMobile {
								padding-left: 12rpx;
							}
							.nameMobile {
								font-size: 24rpx;
								color: #333333;
							}
						}
						.hADetail {
							margin-top: 24rpx;
							font-size: 24rpx;
							color: #333333;
							line-height: 28rpx;
						}
					}
				}
				.noHistoryAddress {
					margin-top: 32rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
				}
			}
		}
	}
</style>
