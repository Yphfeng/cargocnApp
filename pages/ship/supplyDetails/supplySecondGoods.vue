<template>
	<view class="orderGoods">
		<view class="orderBox" v-if="orderChild.orderAddressVOS">
			<view class="orderAddressBox">
				<view class="addressModel" v-for="(item, index) in orderChild.orderAddressVOS" :key="index">
					<view class="addressType" :style="item.serialnumber == 1 || item.serialnumber == 2 ? 'background-color: #4AA2F3;' : 'background-color: #F29347;'">
						{{item.serialnumber == 1 || item.serialnumber == 2 ? '装' : '卸'}}
					</view>
					<view class="addressDetails" :style="index != '0' ? 'border-top:2rpx solid #D7D7D7' : ''">
						<view class="addressMsg">
							<view class="nameBox">
								<view class="startAddr">
									<text class="msg name">{{showDetailAddr(item)}}</text>
								</view>	
							</view>
							<view class="address">{{showAddr(item)}}</view>
						</view>
					</view>
				</view>
				<view class="supplyItem02">
					
					<image src="../../../static/images/user.png" class="box0Img box"></image>
					<view class="supplyWhole userRole">
						<view class="comp">
							<text class="supplyText">{{orderDetailInfo.enterpriseName ? orderDetailInfo.enterpriseName : showGoodsUserName(orderDetailInfo)}}</text>
							<image class="msgIcon" v-if="orderDetailInfo.orderState != 3 && orderDetailInfo.orderState != 4" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone.png" @click.stop="call(orderChild.orderContactsVOS, 1)"></image>
						</view>
						<view class="date">
							<text class="pr-10">{{orderDetailInfo.pushDate}}</text>
							<text>{{orderDetailInfo.pushTime}}发布</text>
						</view>
					</view>
					<!-- <text class="mobile">134****456</text> -->
				</view>
			</view>
			<view class="supplyItem" v-if="orderDetailInfo.supply == 2">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/addow.png" class="addow"></image>
				<text class="supplyText">发布至{{orderDetailInfo.fleetSids}}车队</text>
			</view>
			<view class="supplyItem">
				<image src="../../../static/images/goodsDelivery/box01.png" class="boxImg box"></image>
				<text class="supplyText">货源号：{{orderDetailInfo.orderNumber}}</text>
			</view>
			<view class="supplyItem">
				<image src="../../../static/images/goodsDelivery/box01.png" class="boxImg box"></image>
				<text class="supplyText">{{goodsListData}}</text>
			</view>
			<view class="supplyItem02">
				<view class="box">
					<image src="../../../static/images/goodsDelivery/box02.png" class="box02Img"></image>
				</view>
				<view class="supplyWhole">
					<text class="supplyText">{{orderDetailInfo.orderType == 1 ? vehicleModel : '冷藏车'}} {{vehicleLength}}米</text>
					<text class="supplyText">{{orderDetailInfo.forbiddenZoneType ? '装卸禁区' : '装卸非禁区'}} {{showAddressMsg()}}</text>
				</view>
			</view>
			<view class="supplyItem02">
				<image src="../../../static/images/goodsDelivery/box03.png" class="box03Img box"></image>
				<view class="supplyWhole">
					<view v-for="(item, index) in orderChild.orderLoadTimeRecordVO" :key="index">
						<view class="supplyText" v-if="item.serialnumber == 1 || item.serialnumber == 2">最早装货时间{{item.earlyLoadDt}}，最晚装货时间{{item.endLoadDt}}</view>
						<view class="supplyText" v-if="item.serialnumber == 3 || item.serialnumber == 4">最早卸货时间抵达后{{item.earlyUnLoadDt}}小时，最晚卸货时间抵达后{{item.endUnLoadDt}}小时</view>
					</view>
					
				</view>
			</view>
			<view class="supplyItem02" v-if="showHandingRequiredMsg() || orderDetailInfo.orderType == 2">
				<image src="../../../static/images/goodsDelivery/box04.png" class="boxImg05 box"></image>
				<view class="supplyWhole">
					<text class="supplyText" v-if="showHandingRequiredMsg()">要求：{{showHandingRequiredMsg()}}</text>
					<text class="supplyText" v-if="orderDetailInfo.orderType == 2">温控 {{orderDetailInfo.temperature}}</text>
				</view>
			</view>
			<view class="supplyItem02" v-if="orderDetailInfo.multiTruck < 2">
				<image src="../../../static/images/ship/box07.png" class="boxImg07 box"></image>
				<view class="supplyWhole" v-if="orderDetailInfo.fixPriceFlag == 1">
					<text class="supplyText">货源有效时长：{{orderDetailInfo.minuteDis}}分钟，报价方式固价货源</text>
				</view>
				<view class="supplyWhole" v-else-if="orderDetailInfo.fixPriceFlag == 2">
					<text class="supplyText">报价方式价格电议</text>
				</view>
				<view class="supplyWhole" v-else>
					<text class="supplyText">货源有效时长：{{orderDetailInfo.minuteDis}}分钟，报价方式询价货源，按{{orderChild.orderQuoteVO.quotePriceTypeName}}询价</text>
				</view>
			</view>
			<view class="supplyItem">
				<image src="../../../static/images/ship/box03.png" class="boxImg04 box"></image>
				<text class="supplyText">{{orderDetailInfo.fixPriceFlag == 2 ? '价格电议' : '固价货源'}}  {{orderDetailInfo.multiTruck}}车</text>
			</view>
			<view class="supplyItem02">
				<image src="../../../static/images/goodsDelivery/box06.png" class="boxImg06 box"></image>
				<view class="supplyWhole">
					<view class="supplyText">
						<text v-if="orderDetailInfo.fixPriceFlag == 1" class="pr-20">固定运费{{showQuotePrice(orderDetailInfo.fixPrice)}}元/{{orderChild.orderQuoteVO.quotePriceTypeName}}</text>
						<text class="pr-20">运费{{orderQuoteVO.payType == 3 ? '线上支付' : '线下支付'}}</text>
						<text class="pr-20" v-if="orderDetailInfo.needInvoiceFlag == 1">需要运输增值发票</text>
						<text class="pr-20" v-if="orderDetailInfo.needInvoiceFlag == 2">不需要运输增值发票</text>
						<text v-if="orderQuoteVO.oilCardRatio">线下支付含{{orderQuoteVO.oilCardRatio}}%油卡</text>
					</view>
					
					<view class="supplyText">信息费{{showQuotePrice(orderChild.orderQuoteVO.informationPrice)}}元线上支付</view>
				</view>
			</view>
			
			<view class="supplyItem">
				<image src="../../../static/images/box08.png" class="boxImg04 box"></image>
				<text class="supplyText">{{orderDetailInfo.receiptType ? '需要回单' : '不需要回单'}}</text>
			</view>
			<view class="supplyItem">
				<image src="../../../static/images/goodsDelivery/box05.png" class="boxImg box"></image>
				<text class="supplyText">备注：{{orderDetailInfo.remark ? orderDetailInfo.remark : '无'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship";
	import * as publicData from "@/utils/publicData"
	export default {
		data() {
			return {
				orderDetailInfo: {},
				orderChild: {},
				cargoChild: {},
				goodsListData: '',
				sid: '',
				vehicleModel: '',
				vehicleLength: '',
			}
		},
		onLoad(option) {
			this.sid = option.sid;
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userId = JSON.parse(userInfo).userId;
			}
			this.getListRecord();
		},
		methods: {
			showGoodsUserName(orderInfo) {
				var orderState = orderInfo.orderState;
				var nameArr = orderInfo.child.orderContactsVOS;
				var findIndex = nameArr.findIndex(item => {
					return item.serialnumber == 1 || item.serialnumber == 2
				})
				if (findIndex > -1) {
					var name = nameArr[findIndex].userName;
					var subName = name.substring(0, 1) + '**';
					return orderState == 3 ? name : subName 
				}
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
				utils.newQueryPostRequest('/td/circuit/getOrderRecord', params)
				.then(res=>{
					console.log('报价详情', res);
					
					if(res.retCode == '0000000') {
						that.orderDetailInfo = res.rspBody;
						that.orderValueAddedVOS = that.orderDetailInfo.child.orderValueAddedVOS;
						that.cargoChild = that.orderDetailInfo.cargoChild;
		
						that.orderChild = that.orderDetailInfo.child;
						that.orderQuoteVO = that.orderDetailInfo.child.orderQuoteVO;
						let orderContactsVOS = that.orderChild.orderContactsVOS;
						let orderAddressVOS = that.orderChild.orderAddressVOS;
						for(let i in orderAddressVOS) {
							if(orderContactsVOS[i] && orderAddressVOS[i].serialnumber == orderContactsVOS[i].serialnumber) {
								orderAddressVOS[i].userName = orderContactsVOS[i].userName;
								orderAddressVOS[i].mobile = orderContactsVOS[i].mobile;
							}
						}
						
						//车队
						var fleetSids = that.orderDetailInfo.fleetSids;
						if (fleetSids) {
							fleetSids = JSON.parse(fleetSids);
							var fleetSidsArr = [];
							fleetSids.forEach(item => {
								fleetSidsArr.push(item.name)
							})
							that.orderDetailInfo.fleetSids = fleetSidsArr.join(";");
						}
						
						
						//货源有效时长
						//报价截止时间
						var endData = that.orderDetailInfo.child.orderQuoteVO.quotePriceFinishDt;
						console.log(endData, '当前的天1')
						if (endData) {
							endData = endData.replace(/-/g, "/");
							var date1 = new Date(endData);
							var now1 = new Date();
							var nowStr = new Date().getTime();
							var dateStr = date1.getTime();
							var minuteDis = that.orderDetailInfo.child.orderQuoteVO.quotePriceTime;
							
							that.orderDetailInfo.minuteDis = minuteDis;
						}
						
						var pushDt = that.orderDetailInfo.pushDt;
						var date = pushDt.replace(/-/g, '/');
						var pushMonth = new Date(date).getMonth() + 1 > 9 ? new Date(date).getMonth() + 1 : '0' + (new Date(date).getMonth() + 1);
						var pushDay = new Date(date).getDate() > 9 ? new Date(date).getDate() : '0' + new Date(date).getDate();
						var pushHour = new Date(date).getHours() > 9 ? new Date(date).getHours() : '0' + new Date(date).getHours();
						var pushMunite = new Date(date).getMinutes() > 9 ? new Date(date).getMinutes() : '0' + new Date(date).getMinutes();
						console.log(pushMonth, pushDay, pushHour, pushMunite, '日期发布')
						that.orderDetailInfo.pushDate = pushMonth + '-' + pushDay;
						that.orderDetailInfo.pushTime = pushHour + ':' + pushMunite;
						//最早，最晚装货时间
						var orderLoadTimeRecordVO = that.orderChild.orderLoadTimeRecordVO;
						var earlyLoadDt = '', earlyUnLoadDt = "", endLoadDt = '', endUnLoadDt = '';
						orderLoadTimeRecordVO.forEach(item => {
							if (item.serialnumber == 1) {
								var startDt = item.startDt;
								startDt = startDt.replace(/-/g, '/');
								var endDt = item.endDt;
								endDt = endDt.replace(/-/g, '/');
								var nowDate = new Date().getDate();
								var startDate = new Date(startDt).getDate();
								var endDate = new Date(endDt).getDate();
								var hour = new Date(startDt).getHours();
								var minutes = new Date(startDt).getMinutes();
								if (hour < 10) {
									hour = '0' + hour
								}
								if (minutes < 10) {
									minutes = '0' + minutes
								}
								
								var endHour = new Date(endDt).getHours();
								var endMinutes = new Date(endDt).getMinutes();
								if (endHour < 10) {
									endHour = '0' + endHour
								}
								if (endMinutes < 10) {
									endMinutes = '0' + endMinutes
								}
								
								console.log(nowDate, startDate, '日期');
								if (nowDate - startDate == 0) {
									item.earlyLoadDt = "今天" + hour + ':' + minutes
								} else if (nowDate - startDate == -1) {
									item.earlyLoadDt = "明天" + hour + ':' + minutes
								} else if (nowDate - startDate == -2) {
									item.earlyLoadDt = "后天" + hour + ':' + minutes
								} else {
									item.earlyLoadDt = item.startDt
								}
								if (nowDate - endDate == 0) {
									item.endLoadDt = "今天" + endHour + ':' + endMinutes
								} else if (nowDate - endDate == -1) {
									item.endLoadDt = "明天" + endHour + ':' + endMinutes
								} else if (nowDate - endDate == -2) {
									item.endLoadDt = "后天" + endHour + ':' + endMinutes
								} else {
									item.endLoadDt = item.endDt
								}
								
							} else if (item.serialnumber == 4) {
								item.earlyUnLoadDt = item.startHours;
								item.endUnLoadDt = item.endHours
								
							} else if (item.serialnumber == 3) {
								item.earlyUnLoadDt = item.startHours;
								item.endUnLoadDt = item.endHours
								
							}
						})
						that.orderChild.orderLoadTimeRecordVO = orderLoadTimeRecordVO;
						
						that.showGoodsMsg();
						that.showCarMsg();
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
			},
			showGoodsMsg() { // 展示货物信息 
				let orderDetailInfo = this.orderDetailInfo;
				
					
				this.goodsListData = orderDetailInfo.cargoTypeName4;
				if(orderDetailInfo.cargoWeight) {
					this.goodsListData = this.goodsListData + '/' + orderDetailInfo.cargoWeight + '吨';
				}
				if(orderDetailInfo.cargoVolume) {
					this.goodsListData = this.goodsListData + '/' + orderDetailInfo.cargoVolume + '方';
				}
				
			},
			showQuotePrice(price) {
				return publicData.showPrice(price, 100);
			},
			showCarMsg() { // 展示车辆信息
				let orderVehicleModelVOS = this.orderChild.orderVehicleModelVOS;
				let orderVehicleLengthVOs = this.orderChild.orderVehicleLengthVOs;
				// console.log(orderVehicleModelVOS);
				// console.log(orderVehicleLengthVOs);
				if(orderVehicleModelVOS && orderVehicleModelVOS.length > 0) {
					for(let z in orderVehicleModelVOS) {
						this.vehicleModel = this.vehicleModel + orderVehicleModelVOS[z].vehicleModel + '/';
					}
					this.vehicleModel = this.vehicleModel.slice(0, this.vehicleModel.length - 1);
				}
				if(orderVehicleLengthVOs && orderVehicleLengthVOs.length > 0) {
					for(let z in orderVehicleLengthVOs) {
						this.vehicleLength = this.vehicleLength + orderVehicleLengthVOs[z].vehicleLength + '/';
					}
					this.vehicleLength = this.vehicleLength.slice(0, this.vehicleLength.length - 1);
				}
			},
			showAddressMsg() { // 展示几装几卸
				let orderAddressVOS = this.orderChild.orderAddressVOS;
				if(orderAddressVOS.length == 2) {
					return '一装一卸';
				}else if(orderAddressVOS.length == 4) {
					return '二装二卸';
				}else if(orderAddressVOS.length == 3) {
					if(orderAddressVOS['1'].serialnumber == 2) {
						return '二装一卸';
					}else {
						return '一装二卸';
					}
				}
			},
			showDetailAddr(item) {
				var province = item.province;
				var addr = '';
				if (province.indexOf('市') > -1) {
					addr = item.province + '-' + item.city;
				} else {
					addr = item.province + '-' + item.city + '-' + item.area;
				}
				return addr;
			},
			showAddr(item) {
				var province = item.province;
				var addr = '';
				if (province.indexOf('市') > -1) {
					addr = item.province + item.city + item.address;
				} else {
					addr = item.province + item.city + item.area + item.address;
				}
				var orderQuotationStatus = this.orderDetailInfo.orderState;
				if (orderQuotationStatus == 2 || orderQuotationStatus > 4) {
					return addr
				} else {
					var str = addr.substring(0, 3) + '*********'
					return str
				}
				
			},
			call(orderContactsVOS, number) {
				var findIndex = orderContactsVOS.findIndex(item => {
					return item.serialnumber == number
				})
				if (findIndex > -1) {
					var mobile = orderContactsVOS[findIndex].mobile;
					uni.makePhoneCall({
					    phoneNumber: mobile //仅为示例
					});
					publicData.addBuried("司机搜索货源拨打货主电话")
				}
			},
			showHandingRequiredMsg() { // 展示装卸要求
				let orderLoadFactorVOS = this.orderChild.orderLoadFactorVOS;
				var estimatedTime = this.orderDetailInfo.child.estimatedTime;
				var msg = "";
				if(orderLoadFactorVOS.length == 0) {
					msg = '';
				}else {
					for(let i in orderLoadFactorVOS) {
						if (orderLoadFactorVOS[i].loadFactorCode == "diyHeight") {
							msg = msg + '限高' + orderLoadFactorVOS[i].loadFactor + '米' + ' '
						} else if (orderLoadFactorVOS[i].loadFactorCode == "diyLayer") {
							msg = msg + '堆垛' + orderLoadFactorVOS[i].loadFactor + '层' + ' '
						} else {
							msg = msg + orderLoadFactorVOS[i].loadFactor + ' '
						}
						
					}
				}
				if (estimatedTime) {
					msg = msg + "在途时效" + estimatedTime + '小时'
				} else {
					msg = msg + '无在途时效要求'
				}
				return msg
			},
			prevImage(url) {
				//预览
				uni.previewImage({
					current: 0,
					urls: [url]
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.pr-20 {
		padding-right: 20rpx;
	}
	.pr-10 {
		padding-right: 10rpx;
	}
	.orderGoods {
		.orderBox {
			border-radius: 12rpx;
			background-color: #F3F3F3;
			padding: 32rpx 24rpx;
			min-height: 100vh;
			box-sizing: border-box;
			.orderAddressBox {
				border-bottom: 2rpx solid #777777;
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
						margin-right:18rpx;
						text-align: center;
					}
					.addressDetails {
						flex: 1;
						padding: 26rpx 0;
						.addressMsg {
							.nameBox {
								display: flex;
								justify-content: space-between;
								align-items: flex-start;
								.startAddr {
									line-height: 40rpx;
								}
								.name {
									width:150rpx;
								}
								.tel {
									padding-left:32rpx;
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
									line-height: 40rpx;
								}
							}
							.address {
								margin-top:28rpx;
								line-height: 36rpx;
								font-size: 26rpx;
								color: #777777;
							}
						}
					}
				}
			}
			.supplyItem {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				margin: 30rpx 0;
				.boxImg {
					width: 36rpx;
					height: 34rpx;
				}
				.boxImg04 {
					width: 36rpx;
					height: 38rpx;
				}
				.boxImg06 {
					width: 36rpx;
					height: 38rpx;
				}
				.boxImg07 {
					width: 36rpx;
					height: 38rpx;
				}
				.addow {
					width: 36rpx;
					height: 34rpx;
				}
				
				.supplyText {
					font-size: 26rpx;
					color: #777777;
					padding-left: 52rpx;
				}
			}
			.supplyItem02 {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				margin-bottom: 30rpx;
				.box {
					line-height: 40rpx;
				}
				.box0Img {
					width: 36rpx;
					height: 40rpx;
				}
				.boxImg {
					width: 36rpx;
					height: 34rpx;
				}
				.box02Img {
					width: 44rpx;
					height: 28rpx;
				}
				.box03Img {
					width: 38rpx;
					height: 34rpx;
				}
				.boxImg04 {
					width: 36rpx;
					height: 38rpx;
				}
				.boxImg05 {
					width: 36rpx;
					height: 42rpx;
				}
				.boxImg06 {
					width: 36rpx;
					height: 38rpx;
				}
				.boxImg07 {
					width: 36rpx;
					height: 38rpx;
				}
				.supplyWhole {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding-left: 44rpx;
					font-size: 26rpx;
					color: #777777;
					.supplyText {
						line-height: 35rpx;
						
					}
					&.userRole {
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						.comp {
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: center;
						}
						.date {
							color: rgba(34, 34, 34, 1);
						}
						.msgIcon {
							height: 28rpx;
							width: 28rpx;
							margin-left: 16rpx;
						}
					}
				}
			}
		}
	}
	.userInfo {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		color: #333333;
		font-size: 28rpx;
		padding: 32rpx 0 20rpx 0;
		.userIcon {
			width: 150rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.userImg {
				width: 36rpx;
				height: 42rpx;
			}
		}
	}
</style>
