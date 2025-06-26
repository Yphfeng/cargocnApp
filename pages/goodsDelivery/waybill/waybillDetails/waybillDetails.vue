<template>
	<view class="waybillDetails" :style="(waybillDetails.informationFlag && waybillDetails.informationFlag == 1 && waybillDetails.informationRefundFlag != 1) || waybillDetails.status == 1 ? 'padding-bottom: 204rpx' : 'padding-bottom: 20rpx;'">
		<view class="waybillHead">
			<view class="headTitle">当前状态：</view>
			<view class="headStatus" @click="showLogisticsPopup()">
				<text class="msg">{{waybillDetails.statusDesc ? waybillDetails.statusDesc : showOrderStatusMsg()}}</text>
				<image v-if="waybillDetails.status" class="rightIcon" src="../../../../static/images/goodsDelivery/whiteRightIcon.png"></image>
			</view>
		</view>
		<view class="orderDetailsBox" v-if="orderDetailInfo && orderDetailInfo.sid">
			<view class="orderAddressContent" v-for="(item, index) in newOrderAddressVOS" :key="index">
				<view class="addressLine" v-if="index != 0"></view>
				<view class="addressBox">
					<view class="addressType" :style="item.serialnumber == 1 || item.serialnumber == 2 || item.serialnumber == 5 || item.serialnumber == 6 || item.serialnumber == 7 ? 'background: #0C0C0C;' : 'background: #F43A3A;'">
						{{item.serialnumber == 1 || item.serialnumber == 2 || item.serialnumber == 5 || item.serialnumber == 6 || item.serialnumber == 7 ? '装' : '卸'}}
					</view>
					<view class="addressMsg">
						<view class="area">{{showAddressArea(item)}}</view>
						<view class="addressDetails">
							<text class="msg" v-if="item.address">{{item.address}}</text>
							<text class="msg" v-if="item.userName">{{item.userName}}</text>
							<text class="msg" style="color:#10AB32;" @click="toCallUser(item.mobile)" v-if="item.mobile">{{item.mobile}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="orderDetailsBox" v-if="orderDetailInfo && orderDetailInfo.sid">
			<view class="boxTitle">
				<view class="leftMsg">车货信息</view>
				<view class="rightMsg" @click="copyOrderNumber(orderDetailInfo.orderNumber)">
					<image class="copyIcon" src="/static/images/newOrderDetails/newCopyIcon.png"></image>
					<text class="copyMsg">复制</text>
					<text class="showOrderNumber">{{orderDetailInfo.orderNumber}}</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="contentTitle">司机</view>
				<view class="contentMsg" style="display: flex;justify-content: space-between;align-items: center;">
					<view class="msgCol">{{showDriverName(waybillDetails.ydTaskDriverVO.userName)}}</view>
					<view class="callCol" @click="toCallUser(waybillDetails.ydTaskDriverVO.phone)">
						<text class="callMsg">点击拨号</text>
						<image class="callIcon" src="/static/images/newOrderDetails/callIcon.png"></image>
					</view>
				</view>
			</view>
			<view class="contentRow">
				<view class="contentTitle">车辆</view>
				<view class="contentMsg">
					<text class="msgCol">{{waybillDetails.ydTaskDriverVO.vehicleNo ? showDriverVehicle(waybillDetails.ydTaskDriverVO.vehicleNo) : '暂无车牌'}}</text>
				</view>
			</view>
			<view class="contentRow" v-if="waybillDetails.account || waybillDetails.accountName">
				<view class="contentTitle">银行卡</view>
				<view class="contentMsg">
					<text class="msgCol">{{waybillDetails.accountName}}</text>
					<text class="msgCol">{{waybillDetails.account}}</text>
				</view>
			</view>
			
			<view class="contentRow">
				<view class="contentTitle">货物</view>
				<view class="contentMsg">
					<text class="msgCol">{{waybillDetails.goodsName}}</text>
					<text class="msgCol" v-if="orderDetailInfo.cargoWeight">{{orderDetailInfo.cargoWeight}}{{orderDetailInfo.cargoUnit || "吨"}}</text>
					<text class="msgCol" v-if="orderDetailInfo.cargoVolume">{{orderDetailInfo.cargoVolume}}方</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="contentTitle">备注</view>
				<view class="contentMsg">{{showRemark()}}</view>
			</view>
		</view>
		<view class="orderDetailsBox" v-if="orderDetailInfo && orderDetailInfo.sid">
			<view class="boxTitle">
				<view class="leftMsg">支付信息</view>
			</view>
			<view class="contentRow">
				<view class="contentTitle">运费</view>
				<view class="contentMsg">
					<text class="msgCol">{{showPayType()}}</text>
					<text class="msgCol importMsg">{{showPayPrice()}}</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="contentTitle">订金</view>
				<view class="contentMsg">
					<text class="msgCol importMsg" v-if="showInformationPrice() && showInformationPrice() != 0">{{showInformationPrice()}}元</text>
					<text class="msgCol importMsg" v-else>无订金</text>
					<text class="msgCol importMsg" v-if="showInformationPrice() && showInformationPrice() != 0">{{showInformationType()}}</text>
					<text class="msgCol hintMsg" v-if="showInformationPrice() && showInformationPrice() != 0">{{showPirceHint()}}</text>
				</view>
			</view>
			<!-- <view class="contentRow">
				<view class="contentTitle">平台担保</view>
				<view class="contentMsg">
					{{orderDetailInfo.child.orderValueAddedVOS.cargoDamageFlag == 1 ? '需要平台担保' : '不需要平台担保'}}
					<text class="msgCol importMsg" v-if="orderDetailInfo.child.orderValueAddedVOS.cargoDamageFlag == 1">
						{{orderDetailInfo.child.orderValueAddedVOS.cargoDamagePrice ? orderDetailInfo.child.orderValueAddedVOS.cargoDamagePrice / 100 : 0}}元
					</text>
					{{orderDetailInfo.child.orderValueAddedVOS.cargoDamageFlag == 1 ? '担保费' : ''}}
				</view>
			</view> -->
		</view>
		<view class="orderDetailsBox" v-if="waybillDetails.senderDt || waybillDetails.receiverDt || waybillDetails.loadAmount || waybillDetails.unloadAmount">
			<view class="boxTitle">
				<view class="leftMsg">运输信息</view>
			</view>
			<view class="contentRow" v-if="waybillDetails.senderDt">
				<view class="contentTitle">起始时间</view>
				<view class="contentMsg">
					<text class="msgCol">{{waybillDetails.senderDt}}</text>
				</view>
			</view>
			<view class="contentRow" v-if="waybillDetails.receiverDt">
				<view class="contentTitle">到达时间</view>
				<view class="contentMsg">
					<text class="msgCol">{{waybillDetails.receiverDt}}</text>
				</view>
			</view>
			<view class="contentRow" v-if="waybillDetails.loadAmount">
				<view class="contentTitle">起运量</view>
				<view class="contentMsg">
					<text class="msgCol">{{waybillDetails.loadAmount}}吨</text>
				</view>
			</view>
			<view class="contentRow" v-if="waybillDetails.unloadAmount">
				<view class="contentTitle">到达量</view>
				<view class="contentMsg">
					<text class="msgCol">{{waybillDetails.unloadAmount}}吨</text>
				</view>
			</view>
		</view>
		<view class="orderDetailsBox" v-if="waybillDetails.loadImg || waybillDetails.loadPoundImg || waybillDetails.unloadImg || waybillDetails.unloadPoundImg">
			<view class="boxTitle">
				<view class="leftMsg">图片</view>
			</view>
			<view class="imageGroup">
				<view class="imageBox" v-if="waybillDetails.loadImg" @click="showLargeImage(waybillDetails.loadImg)">
					<image class="orderImage" :src="waybillDetails.loadImg"></image>
					<view class="imageMsg">装车图片</view>
				</view>
				<view class="imageBox" v-if="waybillDetails.loadPoundImg" @click="showLargeImage(waybillDetails.loadPoundImg)">
					<image class="orderImage" :src="waybillDetails.loadPoundImg"></image>
					<view class="imageMsg">装车磅单</view>
				</view>
				<view class="imageBox" v-if="waybillDetails.unloadImg" @click="showLargeImage(waybillDetails.unloadImg)">
					<image class="orderImage" :src="waybillDetails.unloadImg"></image>
					<view class="imageMsg">卸车图片</view>
				</view>
				<view class="imageBox" v-if="waybillDetails.unloadPoundImg" @click="showLargeImage(waybillDetails.unloadPoundImg)">
					<image class="orderImage" :src="waybillDetails.unloadPoundImg"></image>
					<view class="imageMsg">卸车磅单</view>
				</view>
				<view class="imageBox" v-if="waybillDetails.receiptImg" @click="showLargeImage(waybillDetails.receiptImg)">
					<image class="orderImage" :src="waybillDetails.receiptImg"></image>
					<view class="imageMsg">卸车回单</view>
				</view>
			</view>
		</view>
		<view class="agreementBox" v-if="waybillDetails.status && waybillDetails.shipperUserId == userInfo.userId" @click="agreementDetails">
			<view class="title">货物运输协议</view>
			<view class="statusBox">
				<view class="msg">已签署</view>
				<image class="rightIcon" src="../../../../static/images/newIndex/defaultRight.png"></image>
			</view>
		</view>
		
		<view class="footBtnGroup" v-if="showFootBtn()">
			<!-- <view class="cancelBtn" v-if="waybillDetails.isSync == 1 && waybillDetails.status == 1" @click.stop="jumpToBeginTask(waybillDetails)">起运</view>
			<view class="cancelBtn" v-if="waybillDetails.isSync == 1 && waybillDetails.status == 2" @click.stop="jumpToArriveTask(waybillDetails)">到达</view> -->
			<view class="cancelBtn" style="background-color: #FC5C06;" v-if="waybillDetails.status != 0 && waybillDetails.informationFlag && waybillDetails.informationFlag == 1 && waybillDetails.informationRefundFlag != 1" @click="toRefund">退还押金/订金</view>
			<view class="cancelBtn" style="background-color: #2B72F0;" v-if="waybillDetails.status == 1" @click="cancelOrder">取消运单</view>
			<view class="cancelBtn" style="background-color: #2B72F0;" v-if="waybillDetails.status != 1 && settmentStatus != 1 && waybillDetails.orderDetailVO.needInvoiceFlag && waybillDetails.orderDetailVO.needInvoiceFlag == 1" @click="jumpToEditWaybill">修改</view>
		</view>
		
		<uni-popup ref="logisticsPopup" type="center">
			<scroll-view class="logisticsBox" scroll-y="true" :show-scrollbar="true">
				<view class="listItem" v-for="(item, index) in trackArr" :key="index" :style="{'margin-bottom': (item.operation=='已完成' || item.operation=='已取消') ? '0' : '80rpx'}">
					<view class="arriveStatus" :style="{'color': index == 0 ? '#4AA2F3' : '#777777'}">
						{{item.operation}}
					</view>
					<view class="arriveView">
						<view class="arriveIcon" :style="item.isSected ? 'border-radius: 10rpx;width:32rpx;height:32rpx;background-color:#4AA2F3;' : 'border-radius: 6rpx;width:24rpx;height:24rpx;background-color:#CECECE;'">
							<image src="../../../../static/images/goodsDelivery/receive_selected.png" class="receiveIcon" v-if="item.isSected"></image>
						</view>
						<view class="line"  v-if="index !== 0">
							<view class="dot" />
							<view class="dot" />
							<view class="dot" />
							<view class="dot" />
						</view>
					</view>
					<view class="receiveNote">
						<text class="date">{{item.createdDt}}</text>
						<text class="note">{{item.nextOperation}}</text>
					</view>
				</view>
			</scroll-view>
		</uni-popup>
		
		<uni-popup ref="cancelPopup" type="center">
			<view class="hintBox">
				<view class="title">确定取消运单吗？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="closeConfirmPopup()">再看看</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @tap="calcelOrder()">确认取消</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	export default {
		data() {
			return {
				settmentStatus: 2, // 结算状态 0未结算、1已结算
				imageArr: [1, 2, 3, 4],
				trackArr: [],
				waybillDetails: {},
				goodsTypeVO: [],
				cargoChild: {},
				score: '',
				userInfo: {},
				driverUserCode: '',
				newOrderAddressVOS: [],
				orderDetailInfo: {}
			}
		},
		onLoad(options) {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			console.log('用户信息', this.userInfo);
			var detailsInfo = JSON.parse(options.detailsInfo);
			this.waybillDetails = detailsInfo;
			this.cargoChild = this.waybillDetails.orderDetailVO.cargoChild;
			// this.goodsTypeVO = this.cargoChild.goodsTypeVO[0];
			this.getOrderDetails();
			var shipperSid = detailsInfo.orderDetailVO.driverSid;
			console.log('运单详情', this.waybillDetails);
			//获取评分
			// utils.postRequest("/pf/scmd-account/list", {
			// 	userId: shipperSid,
			// 	scoreType: 0
			// }).then(res => {
			// 	if (res.retCode == "0000000" && res.rspBody.length > 0) {
					
			// 	} else {
			// 		this.score = 0;
			// 	}
			// })
			if(this.waybillDetails.isSync == 1) {
				this.getSettmentStatus(); // 获取结算状态
			}
			utils.postRequest("/yd/task/getLog", {
				nowdataSid: this.waybillDetails.sid
			}).then(res => {
				console.log('运单日志', res)
				if (res.retCode == "0000000") {
					this.trackArr = res.rspBody
				}
			})
			
			//查询司机的userCode
			utils.postRequest("/yh/driver/select_detail_by_param", {
				idNo: this.waybillDetails.ydTaskDriverVO.idNo
			}).then(res => {
				console.log('司机用户信息', res)
				if (res.retCode == "0000000") {
					this.driverUserCode = res.rspBody.userCode;
				}
			})
			
			
			uni.$on("refreshWaybillDetails", (data) => {
				console.log('运单详情数据刷新', data);
				this.waybillDetails.senderDt = data.senderDt;
				this.waybillDetails.loadAmount = data.loadAmount;
				this.waybillDetails.loadImg = data.loadImg;
				this.waybillDetails.loadPoundImg = data.loadPoundImg;
				this.waybillDetails.receiverDt = data.receiverDt ? data.receiverDt : this.waybillDetails.receiverDt;
				this.waybillDetails.unloadAmount = data.unloadAmount ? data.unloadAmount : this.waybillDetails.unloadAmount;
				this.waybillDetails.unloadImg = data.unloadImg ? data.unloadImg : this.waybillDetails.unloadImg;
				this.waybillDetails.unloadPoundImg = data.unloadPoundImg ? data.unloadPoundImg : this.waybillDetails.unloadPoundImg;
			});
			uni.$on("refreshData_waybill", (data) => {
				this.waybillDetails.status = data.status ? data.status : this.waybillDetails.status;
				this.waybillDetails.senderDt = data.senderDt ? data.senderDt : this.waybillDetails.senderDt;
				this.waybillDetails.loadAmount = data.loadAmount ? data.loadAmount : this.waybillDetails.loadAmount;
				this.waybillDetails.loadImg = data.loadImg ? data.loadImg : this.waybillDetails.loadImg;
				this.waybillDetails.loadPoundImg = data.loadPoundImg ? data.loadPoundImg : this.waybillDetails.loadPoundImg;
				this.waybillDetails.receiverDt = data.receiverDt ? data.receiverDt : this.waybillDetails.receiverDt;
				this.waybillDetails.unloadAmount = data.unloadAmount ? data.unloadAmount : this.waybillDetails.unloadAmount;
				this.waybillDetails.unloadImg = data.unloadImg ? data.unloadImg : this.waybillDetails.unloadImg;
				this.waybillDetails.unloadPoundImg = data.unloadPoundImg ? data.unloadPoundImg : this.waybillDetails.unloadPoundImg;
			});
		},
		computed: {
			totalExit() {
				var amount = this.waybillDetails.orderDetailVO.wbQuotePrice/100 || 0;
				var vaShortLandedPrice = this.waybillDetails.orderDetailVO.vaShortLandedPrice/100 || 0;
				var cargoDamagePrice = this.waybillDetails.orderDetailVO.child.orderValueAddedVOS.cargoDamagePrice/100 || 0;
				return (amount + vaShortLandedPrice + cargoDamagePrice).toFixed(2)
			} 
		},
		methods: {
			getOrderDetails() {
				this.orderDetailInfo = this.waybillDetails.orderDetailVO;
				let orderAddressVOS = this.waybillDetails.orderDetailVO.child.orderAddressVOS;
				let snedAddressAry = [];
				let ariverAddressAry = [];
				if(orderAddressVOS && orderAddressVOS.length > 0) {
					for(let i in orderAddressVOS) {
						let serialnumber = orderAddressVOS[i].serialnumber
						if(serialnumber == 1 || serialnumber == 2 || serialnumber == 5 || serialnumber == 6 || serialnumber == 7) {
							snedAddressAry.push(orderAddressVOS[i]);
						}else {
							ariverAddressAry.push(orderAddressVOS[i]);
						}
					}
					this.newOrderAddressVOS = [...snedAddressAry, ...ariverAddressAry];
				}
			},
			getSettmentStatus() {
				utils.postForhhy("/tm/task/get_task_un_settle", {
					taskId: this.waybillDetails.taskId
				}).then(res => {
					console.log('结算状态日志', res)
					if (res.retCode == "0000000") {
						this.settmentStatus = res.rspBody;
					}
				})
			},
			jumpToEditWaybill() {
				if(this.settmentStatus == 1) {
					uni.showToast({
						title: '当前运单已结算，不可修改！',
						icon: 'none'
					})
					return false;
				}
				var waybillDetails = JSON.stringify(this.waybillDetails);
				uni.navigateTo({
					url: '../waybillEdit/waybillEdit?detailsInfo=' + waybillDetails
				})
			},
			agreementDetails(){
				uni.navigateTo({
					url: '/pages/allAgreement/agreementItems/index?taskId=' + this.waybillDetails.taskId
				})
			},
			payWaybill() {
				//支付运费
				uni.navigateTo({
					url: '../waybillPay/waybillPay'
				})
			},
			editWaybill() {
				//修改运费
				uni.navigateTo({
					url: '../editWaybill/editWaybill'
				})
			},
			sendAbnormal() {
				//上报异常
				uni.navigateTo({
					url: '../sendAbnormal/sendAbnormal'
				})
			},
			sendCommonent() {
				//服务评价
				uni.navigateTo({
					url: '../comments/comments'
				})
			},
			cancelOrder() {
				this.$refs.cancelPopup.open()
			},
			closeConfirmPopup() {
				this.$refs.cancelPopup.close()
			},
			calcelOrder() {
				uni.showLoading({
					title: '请稍候...',
				})
				let that = this;
					console.log('taskSId', that.waybillDetails.sid);
				utils.postRequest('/yd/task/shipperCancelYdTask?taskSId=' + that.waybillDetails.sid, {})
				.then(res=>{
					console.log('取消运单成功', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						this.$refs.cancelPopup.close()
						uni.showToast({
							title: '取消运单成功！',
							icon: 'none'
						})
						that.waybillDetails.status = 0;
						that.waybillDetails.statusDesc = '已取消';
						uni.$emit("refreshData_waybill");
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			goSupplyDetails() { //查看货源详情
				uni.navigateTo({
					url: '../../orderDetails/orderGoods?sid=' + this.waybillDetails.orderDetailVO.sid + '&multiTruck=' + this.waybillDetails.orderDetailVO.multiTruck
				})
			},
			showDriverVehicle(vehicle) { // 隐藏车牌号
				return vehicle;
				// if(!vehicle) return '';
				// return vehicle.substr(0, 1) + '*****';
			},
			showDriverName(name) { // 司机姓名
				return name;
				// if(!name) return '';
				// return name.substr(0, 1) + '师傅';
			},
			
			//银行卡号脱敏
			sensitive(accountName){
				if(accountName == '') {
					return '';
				}else {
					return accountName.replace(/^(.{4})(?:\d+)(.{4})$/, "$1 **** **** $2");
				}
			},
			
			showResult(result) {
				if (result == "计划中") {
					return "您的运单在计划中"
				} else if (result == "已完成") {
					return "您的运单已完成"
				} else if (result == "已取消") {
					return '您的运单已取消'
				}
			},
			showOrderStatus(flag) { // 1、计划中，5、已完成，0、已取消
				switch(this.waybillDetails.status) {
					case 0:
						return 'background: linear-gradient(-180deg, #AAAAAA 0%, #777777 100%);';
					default:
						return 'background: linear-gradient(180deg, #497FFB 0%, #1E52C4 100%);';
				}
			},
			showOrderStatusMsg(flag) {
				switch(this.waybillDetails.status) {
					case 0:
						return '已取消';
					case 1:
						return '已确认用车';
					case 2:
						return '在途';
					case 3:
						return '抵达';
					case 5:
						return '已完成';
				}
			},
			call(mobile) {
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
			},
			showAddressMsg(item) {
				if(item.areaCode == item.cityCode) {
					return item.province +item.area;
				}else {
					return item.province + item.city +item.area;
				}
			},
			showPriceItem(price1, price2) {
				let priceNum = (price1 ? Number(price1) : 0) + (price2 ? Number(price2) : 0);
				if(!priceNum) {
					return 0;
				}
				return (priceNum / 100).toFixed(2);
			},
			showLogisticsPopup() { // 展示物流轨迹弹窗
				this.$refs.logisticsPopup.open();
			},
			showLargeImage(imgUrl) { // 展示大图
				uni.previewImage({
					urls: [imgUrl],
					success: function(data) {
						console.log(data);
					},
					fail: function(err) {
						console.log(err);
					}
				});
			},
			jumpToBeginTask(item) {
				uni.navigateTo({
					url: '../../../ship/waybill/beginTask?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=list'
				})
			},
			jumpToArriveTask(item) {
				uni.navigateTo({
					url: '../../../ship/waybill/arriveTask?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=list'
				})
			},
			toTrack() {
				//查询轨迹
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					success() {
						var waybillDetails = that.waybillDetails;
						console.log(waybillDetails, 'aaa')
						uni.navigateTo({
							url: '/pages/ship/waybill/track?waybillDetails=' + JSON.stringify(waybillDetails) + '&driverUserCode=' + that.driverUserCode
						})
					},
					fail() {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
					}
				})
			},
			showAddressMsg(obj) { // 展示地区
				if(obj.provinceCode == obj.cityCode) {
					return obj.province
				}else if(obj.cityCode == obj.areaCode) {
					return obj.province + ' ' +obj.city;
				}else {
					let returnMsg = obj.province;
					returnMsg = obj.city ? returnMsg + ' ' + obj.city : returnMsg;
					returnMsg = obj.area ? returnMsg + ' ' + obj.area : returnMsg;
					return returnMsg;
				}
			},
			showAddressArea(item) { // 发货地
				let obj = {
					province: item.province,
					provinceCode: item.provinceCode,
					city: item.city,
					cityCode: item.cityCode,
					area: item.area,
					areaCode: item.areaCode,
				}
				return this.showAddressMsg(obj);
			},
			copyOrderNumber(text) { //复制货源号
				uni.setClipboardData({
					data: text,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			},
			showRemark() { // 备注
				let msg = '';
				let ary = this.orderDetailInfo.child.orderLoadFactorVOS;
				if(ary && ary.length > 0) {
					for(let i in ary) {
						msg = msg + ary[i].loadFactor + '、';
					}
					msg = msg.substring(0, msg.length -1);
				}
				let receiptTypeMsg = this.orderDetailInfo.receiptType == 1 ? '需要回单' : '不需要回单';
				msg = msg ? msg + '、' + receiptTypeMsg : receiptTypeMsg;
				if(this.orderDetailInfo.remark) {
					msg = msg + '、' + this.orderDetailInfo.remark;
				}
				msg = msg ? msg : '暂无备注';
				return msg;
			},
			showInformationPrice() { // 订金
				let obj = this.orderDetailInfo.child.orderQuoteVO;
				let price = obj && obj.informationPrice ? (obj.informationPrice/100).toFixed(2) : 0;
				return price;
			},
			showInformationType() {
				if(!this.waybillDetails.informationFlag) return '不退还';
				switch(this.waybillDetails.informationFlag) {
					case 1:
						return '退还';
					case 2:
						return '不退还';
				}
			},
			showPirceHint() {
				let informationFlag = this.waybillDetails.informationFlag ? this.waybillDetails.informationFlag : 2;
				let informationRefundFlag = this.waybillDetails.informationRefundFlag ? this.waybillDetails.informationRefundFlag : 0;
				let price = this.showInformationPrice();
				switch(informationFlag) {
					case 1:
						if(informationRefundFlag == 1) {
							return '(已退还至司机钱包)';
						}else if(informationRefundFlag == 2){
							return '(已转入您的账户)';
						}else {
							return '(已冻结司机' + price + '元)';
						}
					case 2:
						if(informationRefundFlag == 2) {
							return '(已转入您的账户)';
						}else {
							return '(已冻结司机' + price + '元，运单完成后转入您的账户)';
						}
				}
			},
			showPayPrice() { // 价格信息
				if(this.orderDetailInfo.wbQuotePrice && this.orderDetailInfo.wbQuotePrice > 0) {
					let obj = this.orderDetailInfo.child.orderQuoteVO;
					let price = this.orderDetailInfo.wbQuotePrice ? (this.orderDetailInfo.wbQuotePrice/100).toFixed(2) : 0;
					return price + '元/' + obj.quotePriceTypeName;
				}else {
					return '价格电议'
				}
			},
			showPayType() { // 支付方式
				if(this.orderDetailInfo.needInvoiceFlag) {
					return '线上支付，需要发票';
				}else {
					return '线下支付，不需要发票';
				}
			},
			showSendScope() { // 发布范围
				if(!this.orderDetailInfo.supply) {
					return '全平台';
				}else {
					let returnMsg = '';
					if(this.orderDetailInfo.supply == 9 || this.orderDetailInfo.supply == 1) {
						returnMsg = '全平台';
					}
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
							nameStr = returnMsg ? returnMsg + '，' + nameStr : nameStr;
							return nameStr;
						}
					}
					return returnMsg;
				}
			},
			showShiperName() { // 展示姓名
				let ary = this.orderDetailInfo.child.orderContactsVOS;
				if(ary && ary.length > 0) {
					let userName = ary[0].userName;
					return userName.substr(0, 1) + '先生';
				}
			},
			toCallUser(mobile) { // 拨打电话
				let platformMsg = uni.getSystemInfoSync().platform;
				if(platformMsg == 'android') {
					let that = this;
					plus.android.requestPermissions(
						['android.permission.CALL_PHONE'],
						function(resultObj) {
							var result = 0;
							for(let i = 0; i < resultObj.granted.length; i++) {
								var grantedPermission = resultObj.granted[i];
								console.log('已获取的权限', grantedPermission);
								result = 1;
							}
							for(let i = 0; i < resultObj.deniedPresent.length; i++) {
								var deniedPresentPermission = resultObj.deniedPresent[i];
								console.log('拒绝本次申请的权限', deniedPresentPermission);
								result = 0;
							}
							for(let i = 0; i < resultObj.deniedAlways.length; i++) {
								var deniedAlwaysPermission = resultObj.deniedAlways[i];
								console.log('永久拒绝申请的权限', deniedAlwaysPermission);
								result = -1;
							}
							console.log(result);
							that.makePhoneCall(result, mobile);
						}
					)
				}else {
					this.makePhoneCall(1, mobile);
				}
			},
			makePhoneCall(result, mobile) {
				console.log('触发');
				if(result == 1) {
					uni.makePhoneCall({
					    phoneNumber: mobile,
					});
				}else {
					uni.showToast({
						title: '请开启拨号权限',
						icon: 'none'
					})
				}
			},
			toRefund() {
				if(!utils.btnRepeat()) return false; // 防抖
				uni.showLoading({
					title: '请稍候...',
				})
				let that = this;
				utils.postRequest('/yd/task/information/refund', {sid: that.waybillDetails.sid})
				.then(res=>{
					console.log('取消运单成功', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						})
						that.waybillDetails.informationRefundFlag = 1;
						that.$forceUpdate();
						uni.$emit("refreshData_waybill");
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
				// informationFlag:1-定金可退；2-定金不可退'
				// informationRefundFlag:订金退还标志；1-已退
			},
			showFootBtn() {
				if(this.waybillDetails.shipperUserId != this.userInfo.userId) {
					return false;
				}else {
					let returnFlag = false;
					if(this.waybillDetails.status != 0 && this.waybillDetails.informationFlag && this.waybillDetails.informationFlag == 1 && this.waybillDetails.informationRefundFlag != 1) {
						returnFlag = true;
					}
					if(this.waybillDetails.status == 1) {
						returnFlag = true;
					}
					if(this.waybillDetails.status != 1 && this.settmentStatus != 1 &&  this.waybillDetails.orderDetailVO.needInvoiceFlag && this.waybillDetails.orderDetailVO.needInvoiceFlag == 1) {
						returnFlag = true;
					}
					return returnFlag;
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.waybillDetails {
		padding-top:24rpx;
		.waybillHead {
			width: 678rpx;
			background: #2B72F0;
			box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
			border-radius: 24rpx;
			margin: 0 auto;
			padding: 30rpx 48rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.headTitle {
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 32rpx;
			}
			.headStatus {
				display: flex;
				align-items: center;
				height: 32rpx;
				.msg {
					font-size: 32rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
				.rightIcon {
					width: 14rpx;
					height: 24rpx;
					margin-left: 20rpx;
				}
			}
		}
		.agreementBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24rpx 36rpx;
			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				line-height: 32rpx;
			}
			.statusBox {
				display: flex;
				align-items: center;
				.msg {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 32rpx;
				}
				.rightIcon {
					width: 20rpx;
					height: 20rpx;
				}
			}
		}
		.orderDetailsBox {
			width: 678rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
			border-radius: 24rpx;
			margin: 24rpx auto 0 auto;
			padding: 22rpx 0 24rpx 0;
			
			.callCol {
				flex-shrink: 0;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				line-height: 32rpx;
				padding-right: 80rpx;
				.callMsg {
					font-size: 36rpx;
					font-weight: 500;
					color: #10AB32;
					padding-right: 25rpx;
				}
				.callIcon {
					width: 36rpx;
					height: 36rpx;
				}
			}
			.orderAddressContent {
				margin: 0 0 48rpx 0;
				padding: 0 16rpx 0 34rpx;
				.addressBox {
					display: flex;
					.addressType {
						flex-shrink: 0;
						width: 40rpx;
						height: 40rpx;
						border-radius: 100%;
						line-height: 40rpx;
						text-align: center;
						font-size: 24rpx;
						color: #FFFFFF;
					}
					.addressMsg {
						padding-left: 16rpx;
						.area {
							font-size: 32rpx;
							font-weight: 500;
							color: #333333;
							line-height: 40rpx;
						}
						.addressDetails {
							padding-top: 16rpx;
							line-height: 24rpx;
							.msg + .msg {
								padding-left: 32rpx;
							}
							.msg {
								font-size: 24rpx;
								color: #666666;
							}
						}
					}
				}
				.addressLine {
					margin: 0 0 42rpx 54rpx;
					width: 574rpx;
					height: 2rpx;
					background-color: #E7E7E7;
				}
			}
			.boxTitle {
				margin-left: 32rpx;
				padding: 0 0 16rpx 0;
				border-bottom: 2rpx solid #E7E7E7;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.leftMsg {
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
					line-height: 32rpx;
				}
				.rightMsg {
					display: flex;
					align-items: center;
					padding-right: 24rpx;
					.copyIcon {
						width: 36rpx;
						height: 36rpx;
					}
					.copyMsg {
						font-size: 24rpx;
						color: #2B72F0;
						padding-right: 8rpx;
					}
					.showOrderNumber {
						font-size: 28rpx;
						color: #000000;
					}
				}
			}
			.imageGroup {
				margin-top:32rpx;
				display: flex;
				align-items: center;
				overflow-x: scroll;
				overflow-y: hidden;
				padding: 0 30rpx;
				.imageBox + .imageBox {
					margin-left: 56rpx;
				}
				.imageBox {
					.orderImage {
						width: 160rpx;
						height: 160rpx;
						background: #D8D8D8;
					}
					.imageMsg {
						margin-top:12rpx;
						font-size: 32rpx;
						color: #333;
						line-height: 32rpx;
						text-align: center;
					}
				}
			}
			.contentRow {
				display: flex;
				margin-top: 32rpx;
				.contentTitle {
					flex: 0 0 206rpx;
					flex-shrink: 0;
					padding: 0 22rpx;
					box-sizing: border-box;
					font-size: 32rpx;
					color: #333333;
					line-height: 32rpx;
				}
				.contentMsg {
					flex: 1;
					line-height: 32rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					word-break: break-all;
					.msgCol + .msgCol {
						padding-left: 16rpx;
					}
					.importMsg {
						color:#FC5C06 !important;
					}
					.hintMsg {
						color:#333 !important;
						font-size: 28rpx !important;
						font-weight: 400 !important;
					}
				}
			}
			.otherMsgRow {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 24rpx;
				padding: 0 28rpx 0 32rpx;
				.subMsg {
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
					line-height: 32rpx;
					// white-space: nowrap;
					// text-overflow: ellipsis;
					// overflow: hidden;
					// word-break: break-all;
					flex: 1;
				}
				.otherText {
					font-size: 20rpx;
					color: #333333;
					line-height: 32rpx;
				}
			}
		}
		
		.footBtnGroup {
			position: fixed;
			bottom: 0;
			left: 0;
			padding: 24rpx 104rpx 0 104rpx;
			box-sizing: border-box;
			width: 750rpx;
			height: 184rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
			display: flex;
			.cancelBtn + .cancelBtn {
				margin-left: 68rpx;
			}
			.cancelBtn {
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				background: #FC5C06;
				border-radius: 16rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
		}
		.hintBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			.title {
				width:560rpx;
				font-size: 32rpx;
				color: #777777;
				text-align: center;
				padding: 40rpx 0 34rpx 0;
				line-height: 44rpx;
			}
			.confirmBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top:2rpx solid #F3F3F3;
				.cancelBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #777777;
					text-align: center;
				}
				.groupLine {
					width: 2rpx;
					height: 94rpx;
					background-color: #F3F3F3;
				}
				.confirmBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #4AA2F3;
					text-align: center;
				}
			}
		}
		.logisticsBox {
			margin: 0 110rpx;
			padding: 32rpx 0;
			background-color: #FFF;
			width: 600rpx;
			min-height: 400rpx;
			max-height: 800rpx;
			border-radius: 12rpx;
			.listItem {
				display: flex;
				flex-direction: row;
				margin: 0 80rpx 80rpx;
				justify-content: flex-start;
				align-items: flex-start;
				height: 70rpx;
				
				.arriveStatus {
					flex-shrink: 0;
					font-size: 26rpx;
					color: #777777;
					width:90rpx;
				}
				.arriveView {
					flex-shrink: 0;
					margin: 0 48rpx;
					position: relative;
					.line {
						position: absolute;
						bottom: 80rpx;
						left: 15rpx;
						display: flex;
						flex-direction: column;
						.dot {
							width: 5rpx;
							height: 5rpx;
							background-color: #FFE7E7E7;
							margin: 5rpx 0;
						}
					}
				}
				.arriveIcon {
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.receiveIcon {
					width: 16rpx;
					height: 16rpx;
				}
				.receiveNote {
					flex: 1;
					display: flex;
					flex-direction: column;
					font-size: 24rpx;
					.date {
						color: #333333;
					}
					.note {
						color: #777777;
					}
				}
			}
		}
	}
</style>
