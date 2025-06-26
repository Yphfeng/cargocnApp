<template>
	<view class="orderGoods">
		<!-- <view class="statusBar" :style="{height: statusBarHeight*2 + 'rpx'}" /> -->
		<view class="backContent" :style="{'padding-top': statusBarHeight*2 + 'rpx'}">
			<image src="../../../static/images/back.png" class="back" @click="back"></image>
			<view style="color: #000000;">货源详情</view>
			<view style="color: #000000;" @click="generate">分享</view>
		</view>
		<view class="orderAddressBox">
			<view class="addressModel" v-for="(item, index) in orderChild.orderAddressVOS" :key="index">
				<view class="addressType"
					:style="item.serialnumber == 1 || item.serialnumber == 2 ? 'background-color: #4AA2F3;' : 'background-color: #F29347;'">
					{{item.serialnumber == 1 || item.serialnumber == 2 ? '装' : '卸'}}
				</view>
				<view class="addressDetails" :style="index != '0' ? 'border-top:2rpx solid #D7D7D7' : ''">
					<view class="addressMsg">
						<view class="nameBox">
							<view>
								<!-- <text class="msg name">{{item.userName}}</text>
									<text class="msg tel">{{item.mobile}}</text> -->
								<text class="msg name">{{showAddressMsg(item, 'name')}}</text>
							</view>
							<view class="orderCreated" v-if="index == '0'">{{orderDetailInfo.pushDt}}发布</view>
						</view>
						<view class="address">{{showAddressMsg(item, 'area')}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg8" src="../../../static/images/goodsDelivery/box08.png"></image>
			<view class="msgContent">
				<view class="msgRow" v-for="(item, index) in orderContactsVOS" :key="index" style="display: flex;align-items: center;margin-bottom:12rpx;">
					<view class="msgCol" style="line-height: 40rpx;">{{item.userName}}</view>
					<image class="msgIcon" src="../../../static/images/goodsDelivery/callIcon.png" @click.stop="call(item.mobile)"></image>
				</view>
			</view>
		</view>
		<view class="msgLine"></view>
		<view class="msgBox" v-if="showCarGroupName()">
			<image class="boxImg12" src="../../../static/images/goodsDelivery/box12.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">发布至{{showCarGroupName()}}</text>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg1" src="../../../static/images/goodsDelivery/box01.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">{{goodsListData}}</text>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg2" src="../../../static/images/goodsDelivery/box02.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">{{vehicleModel ? vehicleModel : orderDetailInfo.orderType == 1 ? '' : '冷藏车'}}</text>
					<text class="msgCol">{{vehicleLength}}</text>
				</view>
				<view class="msgRow">
					<!-- <text class="msgCol">{{orderDetailInfo.forbiddenZoneType ? '装卸禁区' : '装卸非禁区'}}</text> -->
					<text class="msgCol">{{showAddressMsgType()}}</text>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg3" src="../../../static/images/goodsDelivery/box03.png"></image>
			<view class="msgContent">
				<view class="msgRow" v-for="(item, index) in orderChild.orderLoadTimeRecordVO" :key="index">
					<text class="msgCol"
						v-if="item.serialnumber == 1">最早装货时间{{item.startDt}}，最晚装货时间{{item.endDt}}</text>
					<text class="msgCol"
						v-if="item.serialnumber == 2">最早装货2时间{{item.startHours}}小时，最晚装货2时间{{item.endHours}}小时</text>
					<text class="msgCol"
						v-if="item.serialnumber == 3">最早卸车1时间抵达后{{item.startHours}}小时，最晚卸货1时间抵达后{{item.endHours}}小时</text>
					<text class="msgCol"
						v-if="item.serialnumber == 4">最早卸车2时间抵达后{{item.startHours}}小时，最晚卸货2时间抵达后{{item.endHours}}小时</text>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg4" src="../../../static/images/goodsDelivery/box04.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol" v-if="showHanding()">要求：{{showHanding()}}</text>
				</view>
				<view class="msgRow" v-if="orderDetailInfo.orderType == 2">
					<text class="msgCol">温控：{{showTemperatureMsg('temperature')}}</text>
				</view>
				<view class="msgRow" v-if="orderDetailInfo.orderType == 2">
					<text class="msgCol">{{showTemperatureMsg('other')}}</text>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg11" src="../../../static/images/goodsDelivery/box11.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">{{orderDetailInfo.fixPriceFlag == '1' ? ' 固价货源，' : ' 询价货源，'}}{{!orderDetailInfo.multiTruck || orderDetailInfo.multiTruck == 1 ? '单车' : orderDetailInfo.multiTruck + '车'}}</text>
				</view>
			</view>
		</view>
		<view class="msgBox" v-if="orderDetailInfo.firstShipperSid">
			<image class="boxImg11" src="../../../static/images/goodsDelivery/box11.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">托运人：{{orderDetailInfo.firstShipperName}}</text>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg6" src="../../../static/images/goodsDelivery/box06.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">{{orderDetailInfo.fixPriceFlag == '1' ? '固定运费：' + orderDetailInfo.fixPrice / 100 + '元/' + orderQuoteVO.quotePriceTypeName : '按' + orderQuoteVO.quotePriceTypeName + '询价'}}</text>
					<text class="msgCol" v-if="orderQuoteVO.payType != 3">线下支付{{orderQuoteVO.oilCardRatio && orderQuoteVO.oilCardRatio > 0 ? '含油卡' + orderQuoteVO.oilCardRatio + '%' : ''}}</text>
					<text class="msgCol" v-if="orderQuoteVO.payType == 3">线上支付{{orderDetailInfo.needInvoiceFlag == 1 ? '需要运输增值发票' : '不需要运输增值发票'}}</text>
					<text class="msgCol">{{orderDetailInfo.fixPriceFlag == '1' ? '司机接单不需要确认' : '司机接单需要确认'}}</text>
				</view>
				<view class="msgRow">
					<text class="msgCol">信息费{{orderQuoteVO.informationPrice && orderQuoteVO.informationPrice > 0 ? orderQuoteVO.informationPrice / 100 : 0}}元</text>
				</view>
			</view>
		</view>
		<view class="msgBox" v-if="orderValueAddedVOS.cargoDamageFlag == 1">
			<image class="boxImg10" src="../../../static/images/goodsDelivery/box10.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">需要平台担保 声明价值{{orderValueAddedVOS.declaredValue / 100}}元</text>
				</view>
				<view class="msgRow">
					<text class="msgCol">服务费{{orderValueAddedVOS.cargoDamagePrice / 100}}元</text>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg9" src="../../../static/images/goodsDelivery/box09.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">{{orderDetailInfo.receiptType ? '需要回单' : '不需要回单'}}</text>
				</view>
			</view>
		</view>
		<view class="msgBox">
			<image class="boxImg9" src="../../../static/images/goodsDelivery/box05.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<text class="msgCol">备注：{{cargoChild.remark ? cargoChild.remark : '无'}}</text>
				</view>
			</view>
		</view>
		<view class="msgBox" v-if="cargoChild.goodsUrl">
			<image class="boxImg7" src="../../../static/images/goodsDelivery/box07.png"></image>
			<view class="msgContent">
				<view class="msgRow">
					<image class="goodsUrl" @click.stop="prevImage(cargoChild.goodsUrl)" mode="aspectFit"
						:src="cargoChild.goodsUrl"></image>
				</view>
			</view>
		</view>
		<view class="popup-box" v-if="isShare">
			<view class="black-box"></view>
			<view class="popup-content">
				<view class="popup-head">分享到</view>
				<view class="popup-row">
					<view class="popup-child" @click="shareEvent('WXSceneSession')">
						<image class="popup-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/weChat.png"
							mode="">
						</image>
						<view class="">微信好友</view>
					</view>
					<!-- <view class="popup-child" @click="shareEvent('WXSenceTimeline')">
						<image class="popup-img"
							src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/circleFriends.png" mode="">
						</image>
						<view class="">朋友圈</view>
					</view> -->
				</view>
				<view class="cancel-btn" @click="cancelShare">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				orderDetailInfo: {},
				orderChild: {},
				cargoChild: {},
				goodsListData: '',
				sid: '',
				vehicleModel: '',
				isShare: false,
				statusBarHeight: '',
				vehicleLength: '',
				orderContactsVOS: [],
				orderQuoteVO: {},
				orderValueAddedVOS: {},
				multiTruck: '', // 用车数量
			}
		},
		onLoad(option) {
			// 分享需传--------'multiTruck=1'
			this.sid = option.sid;
			this.multiTruck = option.multiTruck ? option.multiTruck : 1;
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight
			this.getListRecord();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			generate() {
				let that = this;
				that.isShare = true;
			},
			// 取消分享
			cancelShare() {
				let that = this;
				that.isShare = false;
			},
			// 分享到微信好友或者朋友圈
			shareEvent(type) {
				var that = this;
				that.isShare = false;
				var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				console.log(userInfo)
				var token = userInfo.attrs.token
				let userCode = userInfo.attrs.userCode
				// 微信好友
				let summary = that.goodsListData
				if (that.orderDetailInfo.fixPriceFlag == '1') {
					if(that.orderDetailInfo.fixPrice){
						summary = summary + that.orderDetailInfo.fixPrice / 100 + '元/' + that.orderQuoteVO.quotePriceTypeName
					}
				} else {
					// summary = summary + '按' + that.orderQuoteVO.quotePriceTypeName + '询价'
					summary = summary + ', 询价货源'
				}
				var api = '';
				var shareUrl = ""
				if(utils.ApiRootUrl.indexOf('test')>-1){
					api = 'test'
					shareUrl = "http://m.hyzgapp.com/#/testShare?sid="
				} else {
					api = 'pord'
					shareUrl = "http://m.hyzgapp.com/#/share?sid="
				}
				uni.getLocation({
					geocode: true,
					success: function(res) {
						console.log(res, '定位地址');
						var longitude = (res.longitude).toFixed(6)
						var latitude = (res.latitude).toFixed(6)
						var supply = 1;
						console.log(that.orderDetailInfo)
						if(that.orderDetailInfo.fleetSids){
							let checkedCarGroup = [];
							checkedCarGroup = JSON.parse(that.orderDetailInfo.fleetSids);
							if(checkedCarGroup.length > 0) {
								supply = 2
							}
						}
						console.log("http://m.hyzgapp.com/#/share?sid=" + that.sid + "&token=" + token + '&api=' + api + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode);
						uni.share({
							provider: "weixin",
							scene: type,
							type: 0,
							href: shareUrl + that.sid + "&supply=" + supply +"&multiTruck=" + that.multiTruck + "&token=" + token + '&api=' + api + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode, //
							title: "从  "+ that.showAddressMsg(that.orderChild.orderAddressVOS[0], 'area') + '  到  ' + that.showAddressMsg(that
								.orderChild
								.orderAddressVOS[that.orderChild.orderAddressVOS.length - 1], 'area'),
							summary: summary,
							imageUrl: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/share_image.png",
							success: function(res) {
								console.log("success:" + JSON.stringify(res));
							},
							fail: function(err) {
								console.log("fail:" + JSON.stringify(err));
							}
						});
					},
					fail: function(res) {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
					}
				})
			},
			getListRecord() {
				uni.showLoading({
					title: '加载中'
				});
				let that = this;
				let params = {
					sid: that.sid
				}
				console.log('询价详情查询参数', params);
				utils.newQueryPostRequest('/td/order/findListRecord', params)
					.then(res => {
						console.log('询价详情', res);
						if (res.retCode == '0000000') {
							that.orderDetailInfo = res.rspBody;
							that.cargoChild = that.orderDetailInfo.cargoChild;
							that.orderChild = that.orderDetailInfo.orderChild;
							let orderContactsVOS = that.orderChild.orderContactsVOS;
							let orderAddressVOS = that.orderChild.orderAddressVOS;
							for (let i in orderAddressVOS) {
								// if (orderAddressVOS[i].serialnumber == orderContactsVOS[i].serialnumber) {
								// 	orderAddressVOS[i].userName = orderAddressVOS[i].userName ? orderAddressVOS[i].userName : orderContactsVOS[i].userName;
								// 	orderAddressVOS[i].mobile = orderAddressVOS[i].mobile ? orderAddressVOS[i].mobile : orderContactsVOS[i].mobile;
								// }
								orderAddressVOS[i].userName = orderAddressVOS[i].userName ? orderAddressVOS[i].userName : orderContactsVOS[0].userName;
								orderAddressVOS[i].mobile = orderAddressVOS[i].mobile ? orderAddressVOS[i].mobile : orderContactsVOS[0].mobile;
							}
							that.orderContactsVOS = that.orderChild.orderContactsVOS;
							that.orderQuoteVO = that.orderChild.orderQuoteVO;
							that.orderValueAddedVOS = that.orderChild.orderValueAddedVOS;
							that.showGoodsMsg();
							that.showCarMsg();
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none',
								duration: 3000
							})
						}
						uni.hideLoading();
					})
					.catch(err => {
						console.log(err);
						uni.hideLoading();
					})
			},
			showGoodsMsg() { // 展示货物信息 
				let ary = this.cargoChild.goodsTypeVO;
				// console.log(ary);
				let goodsTypeName = [];
				if (ary && ary.length > 0) {
					for (let i in ary) {
						let typeName = ary[i].children['0'].children['0'].children['0'].typeName;
						typeName = ary[i].typeName + '-' + typeName;
						goodsTypeName.push(typeName)
					}
					// console.log(goodsTypeName);
					let newAry = Array.from(new Set(goodsTypeName));
					// console.log(newAry);
					for (let i in newAry) {
						this.goodsListData = this.goodsListData + newAry[i] + '/';
					}
					this.goodsListData = this.goodsListData.slice(0, this.goodsListData.length - 1);
					if (this.cargoChild.weight) {
						var cargoUnit = this.orderDetailInfo.cargoUnit || "吨";
						this.goodsListData = this.goodsListData + ',' + this.cargoChild.weight + cargoUnit;
					}
					if (this.cargoChild.volume) {
						this.goodsListData = this.goodsListData + ',' + this.cargoChild.volume + '方';
					}
				}
			},
			showCarMsg() { // 展示车辆信息
				let orderVehicleModelVOS = this.orderChild.orderVehicleModelVOS;
				let orderVehicleLengthVOs = this.orderChild.orderVehicleLengthVOs;
				// console.log(orderVehicleModelVOS);
				// console.log(orderVehicleLengthVOs);
				if (orderVehicleModelVOS && orderVehicleModelVOS.length > 0) {
					for (let z in orderVehicleModelVOS) {
						this.vehicleModel = this.vehicleModel + orderVehicleModelVOS[z].vehicleModel + '/';
					}
					this.vehicleModel = this.vehicleModel.slice(0, this.vehicleModel.length - 1);
				}
				if (orderVehicleLengthVOs && orderVehicleLengthVOs.length > 0) {
					for (let z in orderVehicleLengthVOs) {
						this.vehicleLength = this.vehicleLength + orderVehicleLengthVOs[z].vehicleLength + '/';
					}
					this.vehicleLength = this.vehicleLength.slice(0, this.vehicleLength.length - 1);
				}
			},
			showAddressMsgType() { // 展示几装几卸
				let orderAddressVOS = this.orderChild.orderAddressVOS;
				if (orderAddressVOS && orderAddressVOS.length == 2) {
					return '一装一卸';
				} else if (orderAddressVOS && orderAddressVOS.length == 4) {
					return '二装二卸';
				} else if (orderAddressVOS && orderAddressVOS.length == 4) {
					if (orderAddressVOS['1'].serialnumber == 2) {
						return '二装一卸';
					} else {
						return '一装二卸';
					}
				}
			},
			showHanding() {
				let handingRequiredVal = this.orderChild.orderLoadFactorVOS;
				let estimatedTime = this.orderDetailInfo.estimatedTime;
				let msg = '';
				if (handingRequiredVal && handingRequiredVal.length > 0) {
					for (let a in handingRequiredVal) {
						if (handingRequiredVal[a].loadFactorCode == 'diyHeight') {
							msg = msg + '限高' + handingRequiredVal[a].loadFactor + '米、';
						} else if (handingRequiredVal[a].loadFactorCode == 'diyLayer') {
							msg = msg + '堆垛' + handingRequiredVal[a].loadFactor + '层、';
						} else {
							msg = msg + handingRequiredVal[a].loadFactor + '、';
						}
					}
				}
				// msg = msg + (estimatedTime && Number(estimatedTime) > 0 ? '要求在途时效' + estimatedTime + '小时' : '无在途时效要求');
				return msg;
			},
			showTemperatureMsg(status) {
				let temperatureMonitor = this.orderDetailInfo.temperatureMonitor ? Number(this.orderDetailInfo
					.temperatureMonitor) : 3;
				let msg = '';
				switch (status) {
					case 'temperature':
						msg = msg + this.orderDetailInfo.temperature;
						return msg;
					case 'other':
						switch (temperatureMonitor) {
							case 1:
								msg = msg + '货主提供温度监控仪'
								break;
							case 2:
								msg = msg + '承运车提供温度监控仪'
								break;
							case 3:
								msg = msg + '不需要温度监控仪'
								break;
						}
						return msg;
				}
			},
			showCarGroupName() { // 展示发布车队名
				if(this.orderDetailInfo.fleetSids) {
					let checkedCarGroup = [];
					checkedCarGroup = JSON.parse(this.orderDetailInfo.fleetSids);
					if(checkedCarGroup.length > 0) {
						let nameStr = [];
						for(let i in checkedCarGroup) {
							nameStr.push(checkedCarGroup[i].name);
						}
						nameStr = nameStr.toString();
						nameStr = nameStr.replace(/,/g, ";");
						return nameStr;
					}else {
						return false;
					}
				}else {
					return false;
				}
			},
			showHandingRequiredMsg() { // 展示装卸要求
				let orderLoadFactorVOS = this.orderChild.orderLoadFactorVOS;
				if (!orderLoadFactorVOS || orderLoadFactorVOS.length == 0) {
					return false;
				} else {
					let msg = '';
					for (let i in orderLoadFactorVOS) {
						msg = msg + orderLoadFactorVOS[i].loadFactor + '、'
					}
					return msg.slice(0, msg.length - 1);
				}
			},
			prevImage(url) { //预览
				uni.previewImage({
					current: 0,
					urls: [url]
				})
			},
			showAddressMsg(item, flag) {
				switch(flag) {
					case 'name':
						return item.userName + '  ' + item.mobile;
					case 'area':
						if(item.areaCode == item.cityCode) {
							return item.province + '-' +item.area + ' ' + item.address;
						}else {
							return item.province + '-' + item.city + '-' +item.area + ' ' + item.address;
						}
				}
			},
			timeOperation(startTime, endTime) {
				if (!startTime || !endTime) {
					return false;
				}
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "ios") {
					startTime = startTime.replace(/-/g, '/');
					endTime = endTime.replace(/-/g, '/');
				}
				console.log(startTime);
				console.log(endTime);
				var nowDate = new Date(startTime);
				var finishDate = new Date(endTime);
				var dateDiff = finishDate - nowDate; //时间差的毫秒数
				var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
				var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
				var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
				//计算相差分钟数
				var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
				var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
				//计算相差秒数
				var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
				var seconds = Math.round(leave3 / 1000)

				var leave4 = leave3 % (60 * 1000) //计算分钟数后剩余的毫秒数
				var timeFn = '';
				timeFn = dayDiff ? dayDiff + "天 " : '';
				timeFn = timeFn + (hours ? hours + "小时 " : '');
				timeFn = timeFn + (minutes ? minutes + "分钟 " : '');
				timeFn = timeFn + (seconds ? seconds + "秒" : '');
				return timeFn;
				console.log(timeFn);
			},
			call(mobile) {
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.popup-box {
		.black-box {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #000;
			opacity: 0.6;
			z-index: 99;
		}
		.popup-content {
			position: fixed;
			bottom: 30rpx;
			left: 24rpx;
			right: 24rpx;
			height: 330rpx;
			// height: 500rpx;
			background-color: #fff;
			z-index: 999;
			border-radius: 40rpx;
			padding: 30rpx 40rpx;

			.popup-head {
				color: #333;
				font-size: 28rpx;
				font-weight: bold;
			}

			.popup-row {
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #F6F6F6;
				padding: 30rpx 10rpx;

				.popup-child {
					font-size: 22rpx;
					color: #333;
					margin-right: 70rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					.popup-img {
						width: 88rpx;
						height: 88rpx;
						margin-bottom: 14rpx;
					}
				}
			}

			.cancel-btn {
				display: flex;
				align-items: flex-end;
				justify-content: center;
				color: #777;
				height: 90rpx;
				font-size: 32rpx;
			}
		}
	}

	.backContent {
		height: 88rpx;
		line-height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #FFFFFF;

		.back {
			width: 22rpx;
			height: 40rpx;
		}
	}
	page {
		background-color: #F3F3F3;
	}
	.orderGoods {
		padding: 32rpx 24rpx;
		
		.msgIcon {
			width: 40rpx;
			height: 40rpx;
			margin-left: 32rpx;
		}
		.orderAddressBox {
			.addressModel {
				width: 670rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.addressType {
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					border-radius: 12rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #FFFFFF;
					margin-right: 18rpx;
					text-align: center;
				}
				.addressDetails {
					flex: 1;
					padding: 26rpx 0;
					.addressMsg {
						.nameBox {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.name {
								width: 150rpx;
							}
							.tel {
								padding-left: 32rpx;
							}
							.msg {
								font-size: 30rpx;
								font-weight: bold;
								color: #222222;
							}
							.orderCreated {
								font-size: 24rpx;
								font-weight: bold;
								color: #222222;
							}
						}
						.address {
							margin-top: 28rpx;
							line-height: 36rpx;
							font-size: 26rpx;
							color: #777777;
						}
					}
				}
			}
		}
		.msgLine {
			height: 2rpx;
			background-color: #777777;
			margin: 24rpx 0;
		}
		.msgBox+.msgBox {
			margin-top: 28rpx;
		}
		.msgBox {
			display: flex;
			.msgContent {
				flex: 1;
				padding-right: 120rpx;
				.msgRow+.msgRow {
					margin-top: 2rpx;
				}
				.msgRow {
					line-height: 36rpx;
					.msgCol+.msgCol {
						margin-left: 8rpx;
					}
					.msgCol {
						font-size: 26rpx;
						color: #777777;
						word-break: break-all;
					}
				}
			}
			.boxImg1 {
				flex-shrink: 0;
				width: 36rpx;
				height: 34rpx;
				margin-right: 44rpx;
			}
			.boxImg2 {
				flex-shrink: 0;
				width: 44rpx;
				height: 28rpx;
				margin-right: 36rpx;
			}
			.boxImg3 {
				flex-shrink: 0;
				width: 38rpx;
				height: 34rpx;
				margin-right: 32rpx;
			}
			.boxImg4 {
				flex-shrink: 0;
				width: 36rpx;
				height: 38rpx;
				margin-right: 44rpx;
			}
			.boxImg6 {
				flex-shrink: 0;
				width: 36rpx;
				height: 36rpx;
				margin-right: 44rpx;
			}
			.boxImg8 {
				flex-shrink: 0;
				width: 36rpx;
				height: 42rpx;
				margin-right: 44rpx;
			}
			.boxImg9 {
				flex-shrink: 0;
				width: 36rpx;
				height: 34rpx;
				margin-right: 44rpx;
			}
			.boxImg7 {
				flex-shrink: 0;
				width: 38rpx;
				height: 34rpx;
				margin-right: 42rpx;
			}
			.boxImg10 {
				flex-shrink: 0;
				width: 36rpx;
				height: 42rpx;
				margin-right: 44rpx;
			}
			.boxImg11 {
				flex-shrink: 0;
				width: 36rpx;
				height: 40rpx;
				margin-right: 44rpx;
			}
			.boxImg12 {
				flex-shrink: 0;
				width: 36rpx;
				height: 34rpx;
				margin-right: 44rpx;
			}
			.goodsUrl {
				width: 166rpx;
				height: 112rpx;
				background: #FFFFFF;
				border-radius: 12rpx;
			}
		}
	}
</style>
