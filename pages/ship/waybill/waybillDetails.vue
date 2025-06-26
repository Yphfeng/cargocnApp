<template>
	<view v-if="waybillDetails">
		<view class="orderListBox">
			<view class="orderHead">
				当前状态：
				<view class="head-text" @click="showNotes">
					{{showStatus(waybillDetails)}}
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_right_white_1.png" class="arrow-right"></image>
				</view>
		<!-- 		<view class="cancelOpt">
					<view class="cancelBtn" @click="cancelOrder" v-if="waybillDetails.status == 1">取消运单</view>
					<view class="edit" @click="editOrder(waybillDetails)" v-if="waybillDetails.isSync == 1">修改</view>
				</view> -->
			</view>
			
			<view class="orderBox">
				<view class="addrInfo" v-for="(item, index) in newOrderAddressVOS">
						<view class="addr_icon_content">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/zhuang_icon_round.png" class="addr_icon" v-if="item.serialnumber == 1 || item.serialnumber == 2 || item.serialnumber == 5 || item.serialnumber == 6 || item.serialnumber == 7"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/xie_icon_2.png" class="addr_icon" v-else></image>
						</view>
						<view class="title">
							<view class="addr_and_daohang">
								<view class="addr">
									{{showSendAddress(item)}}
								</view>
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/daohang.png" class="daohang" @click="toGd(item)"></image>
							</view>
							<view class="address">
								{{showAddress(item)}}
							</view>
							<view class="userInfo">
								<text>{{item.userName}}</text>
								<view class="mobile" @click="callPhone(item.mobile)" v-if="item.mobile">
									{{item.mobile}}
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone1.png" class="mobile_icon"></image>
								</view>
							</view>
							<view class="addr_line" v-if="index + 1 != newOrderAddressVOS.length" />
						</view>
					</view>
				
			</view>
			
			<view class="orderBody">
				<view class="boxTitle">
					<view class="title">
						车货信息
					</view>
					<view class="subTitle" @click="copy(waybillDetails.orderNumber)">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/copy.png" class="copy"></image>
						<text class="copy-text">复制</text>
						<text>{{waybillDetails.orderNumber}}</text>
					</view>
				</view>
				<view class="list-item">
					<view class="label">发货联系人</view>
					<view>{{waybillDetails.shipperComName || waybillDetails.shipperUserName}}</view>
					<view class="call" @click="callPhone(waybillDetails.contactPhone)">
						<text>点击拨号</text>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone1.png" class="phone"></image>
					</view>
				</view>
				<view class="list-item">
					<view  class="label">车辆</view>
					<view>{{waybillDetails.transportContractVO.vehicleNo}}</view>
				</view>
				<view class="list-item" v-if="waybillDetails.account">
					<view  class="label">银行卡</view>
					<view>{{waybillDetails.accountName || ""}} {{waybillDetails.account}}</view>
				</view>
				<view class="list-item">
					<view  class="label">货物</view>
					<view class="goods-item">
						<text>{{waybillDetails.orderDetailVO.cargoName}}</text> 
						<text class="unit" v-if="waybillDetails.orderDetailVO.cargoWeight">{{waybillDetails.orderDetailVO.cargoWeight}}吨</text>
						<text class="unit" v-if="waybillDetails.orderDetailVO.cargoVolume">{{waybillDetails.orderDetailVO.cargoVolume}}方</text>
					</view>
				</view>
				<view class="list-item remark-content">
					<view  class="label">备注</view>
					<view class="remark">{{showRemark(waybillDetails)}}</view>
				</view>
			</view>
			
			
			<view class="orderBody">
				<view class="boxTitle">
					<view class="title">
						支付信息
					</view>
				</view>
				<view class="list-item remark-content">
					<view class="price-label">运费</view>
					<view class="price-content">
						<text class="note">{{waybillDetails.orderDetailVO.needInvoiceFlag == 1 ? '线上支付' : '线下支付'}}</text>
						<text class="note">{{waybillDetails.orderDetailVO.needInvoiceFlag == 1 ? '需要发票' : '不需要发票'}}</text>
						
						<text class="note type" v-if="waybillDetails.orderDetailVO.wbQuotePrice && waybillDetails.orderDetailVO.wbQuotePrice > 0">{{showQuotePrice(waybillDetails.orderDetailVO.wbQuotePrice)}}元/{{waybillDetails.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
						<text class="note type" v-else>价格电议</text>
					</view>
				</view>
				<view class="list-item list-price-item remark-content">
					<view class="price-label">订金</view>
					<view class="price-content" v-if="showInfoPrice(waybillDetails.orderDetailVO.wbInformationPrice) > 0">
						<text class="note type">{{showInfoPrice(waybillDetails.orderDetailVO.wbInformationPrice)}}元</text>
						<text class="note type">{{waybillDetails.informationFlag == 1 ? '退还' : '不退还'}}</text>
						<text style="color: #333;font-weight: 400;font-size: 28rpx;" v-if="waybillDetails.informationFlag == 1 && waybillDetails.informationRefundFlag == 0">(已冻结您的{{showInfoPrice(waybillDetails.orderDetailVO.wbInformationPrice)}}元，待货主退还)</text>
						<text style="color: #333;font-weight: 400;font-size: 28rpx;" v-if="waybillDetails.informationRefundFlag == 1">(已退还至您的钱包)</text>
						<text style="color: #333;font-weight: 400;font-size: 28rpx;" v-if="waybillDetails.informationFlag != 1 && waybillDetails.informationRefundFlag == 0">(已冻结司机{{showInfoPrice(waybillDetails.orderDetailVO.wbInformationPrice)}}元，在运单到达后将转入货主钱包)</text>
						<text style="color: #333;font-weight: 400;font-size: 28rpx;" v-if="waybillDetails.informationRefundFlag == 2">(已转至货主钱包)</text>
					</view>
					<view class="price-content" v-else>
						<text class="note type">无订金</text>
					</view>
				</view>
				<!-- <view class="list-item list-price-item remark-content" v-if="showDanPrice()">
					<view class="price-label" style="line-height: 40rpx;">担保</view>
					<view class="price-content">
						<view v-if="getEmptyPrice()" style="line-height: 40rpx;"><text>放空担保</text><text class="type" style="padding-left: 10rpx;">{{getEmptyPrice()}}元</text></view>
						<view v-if="getPlatformPrice()"  style="line-height: 40rpx;"><text>平台担保</text><text class="type" style="padding-left: 10rpx;">{{getPlatformPrice()}}元</text></view>
						
					</view>
				</view> -->
				<view style="height: 48rpx;" />
			</view>
			<view class="orderBody" v-if="waybillDetails.senderDt">
				<view class="boxTitle">
					<view class="title">
						运输信息
					</view>
				</view>
				<view class="list-item">
					<view class="price-label">起始时间</view>
					<view class="price-content">
						{{showDate(waybillDetails.senderDt)}}
					</view>
				</view>
				<view class="list-item" v-if="waybillDetails.receiverDt">
					<view class="price-label">到达时间</view>
					<view class="price-content">
						{{showDate(waybillDetails.receiverDt)}}
					</view>
				</view>
				<view class="list-item" v-if="waybillDetails.loadAmount">
					<view class="price-label">起运量</view>
					<view class="price-content">
						{{waybillDetails.loadAmount}}吨
					</view>
				</view>
				<view class="list-item" v-if="waybillDetails.unloadAmount">
					<view class="price-label">到达量</view>
					<view class="price-content">
						{{waybillDetails.unloadAmount}}吨
					</view>
				</view>
				<view style="height: 48rpx;" />
			</view>
			<view class="orderBody" style="margin-bottom: 0;" v-if="isPicture">
				<view class="boxTitle">
					<view class="title">
						图片
					</view>
				</view>
				<view class="boxImgWhole">
					<view class="boxItem" @click="prev(waybillDetails.loadImg)" v-if="waybillDetails.loadImg">
						<view class="boxImage">
							<image :src="waybillDetails.loadImg" class="waybillImg" mode="aspectFill"></image>
						</view>
						<view class="imgText">
							装车图片
						</view>
					</view>
					<view class="boxItem" @click="prev(waybillDetails.loadPoundImg)" v-if="waybillDetails.loadPoundImg">
						<view class="boxImage">
							<image :src="waybillDetails.loadPoundImg" class="waybillImg"></image>
						</view>
						<view class="imgText">
							装车磅单
						</view>
					</view>
					<view class="boxItem" v-if="waybillDetails.unloadImg">
						<view class="boxImage" @click="prev(waybillDetails.unloadImg)">
							<image :src="waybillDetails.unloadImg" class="waybillImg"></image>
						</view>
						<view class="imgText">
							卸车图片
						</view>
					</view>
					<view class="boxItem" v-if="waybillDetails.unloadPoundImg">
						<view class="boxImage" @click="prev(waybillDetails.unloadPoundImg)">
							<image :src="waybillDetails.unloadPoundImg" class="waybillImg"></image>
						</view>
						<view class="imgText">
							卸车磅单
						</view>
					</view>
					<view class="boxItem" v-if="waybillDetails.receiptImg">
						<view class="boxImage" @click="prev(waybillDetails.receiptImg)">
							<image :src="waybillDetails.receiptImg" class="waybillImg"></image>
						</view>
						<view class="imgText">
							卸车回单
						</view>
					</view>
				</view>
				
			</view>
			
			<view class="xieyi">
				<view class="title">
					货物运输协议
				</view>
				<view class="subTitle" @tap="agreementDetails">
					<text>已签署</text>
					<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
			
		</view>
		<view class="fix-bottom" v-if="waybillDetails.isSync == 1 || waybillDetails.status == 1 || waybillDetails.status == 3">
		
			<view class="fixItem cancel" @click="editOrder(waybillDetails)" v-if="waybillDetails.isSync == 1 && waybillDetails.status != 1">
					修改
			</view>
			<view class="fixItem cancel" @click="commment(waybillDetails)" v-if="waybillDetails.status == 3">
					{{waybillDetails.isEvaluate == 1 ? '已评价' : '评价'}}
			</view>
			
			<view class="fixItem pay" @click="cancelOrder" v-if="waybillDetails.status == 1">
				取消运单
			</view>
			
		</view>
		<uni-popup ref="notes" type="center">
			<view class="listView">
				<view class="listItem" v-for="(item, index) in trackArr">
					<view class="arriveStatus" :style="{'color': index == 0 ? '#4AA2F3' : '#777777'}">
						{{item.operation}}
					</view>
					<view class="arriveView">
						<view class="arriveIcon" :style="item.isSected ? 'border-radius: 10rpx;width:32rpx;height:32rpx;background-color:#4AA2F3;' : 'border-radius: 6rpx;width:24rpx;height:24rpx;background-color:#CECECE;'">
							<image src="../../../static/images/goodsDelivery/receive_selected.png" class="receiveIcon" v-if="item.isSected"></image>
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
			</view>
		</uni-popup>
		<uni-popup ref="confirmPopup" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent">
					<view class="text">建议您再收到运费后在完成运单！</view>
				</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn cancel" @tap="cancel()">取消</view>
					<view class="cancelBtn confirm" @tap="confirmOrder()">确定完成</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="confirmPopup1" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent">
					<view class="text">确定取消运单吗？</view>
				</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn cancel" @tap="cancel()">取消</view>
					<view class="cancelBtn confirm" @tap="cancelOrderConfirm()">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	import * as publicData from "@/utils/publicData";
	import * as utilDate from "@/utils/date.js";
	export default {
		data() {
			return {
				newOrderAddressVOS: [],
				trackArr: [],
				score: 0,
				goodsArr: "",
				status: 0,
				isJiesuan: 0,
			}
		},
		async onLoad(options) {
			
			var waybillDetails = JSON.parse(options.waybillDetails);
			var shipperSid = waybillDetails.orderDetailVO.shipperUserId;
			this.waybillDetails = waybillDetails;
			var orderAddressVOS = waybillDetails.orderDetailVO.child.orderAddressVOS;
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
			
			console.log(this.waybillDetails,'运单详情')
			
			this.goodsArr = waybillDetails.goodsName;
			//获取评分
			ship.postRequest("/pf/scmd-account/list", {
				userId: shipperSid,
				scoreType: 0
			}).then(res => {
				console.log(res, '啊啊是')
				if (res.retCode == "0000000" && res.rspBody.length > 0) {
					
				} else {
					this.score = 0;
				}
			})
			//获取运单操作日志
			ship.postRequest("/yd/task/getLog", {
				nowdataSid: waybillDetails.sid
			}).then(res => {
				console.log(res, '运单日志')
				if (res.retCode == "0000000") {
					this.trackArr = res.rspBody
				}
			})
			
			this.mainHeight = uni.getSystemInfoSync().windowHeight - 144;
			console.log(this.mainHeight, '屏幕的高度')
			//判断该运单是否已结算
			ship.postForhhy("/tm/task/get_task_un_settle", {
				taskId: waybillDetails.taskId
			}).then(res => {
				console.log(res, '是否已结算数据')
				this.isJiesuan = res.rspBody
			})
		},
		computed: {
			isPicture() {
				if (!this.waybillDetails) return false;
				return this.waybillDetails.loadPoundImg || this.waybillDetails.loadImg || this.waybillDetails.unloadPoundImg || this.waybillDetails.unloadImg || this.waybillDetails.receiptImg
			}
		},
		methods: {
			toTrack() {
				//查询轨迹
				//判断是否打开定位
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					success() {
						var waybillDetails = that.waybillDetails;
						console.log(waybillDetails, 'aaa')
						uni.navigateTo({
							url: './track?waybillDetails=' + JSON.stringify(waybillDetails)
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
			showDate(date) {
				if (!date) return "";
				var da = date.replace(/-/g, "/");
				var daArr = da.split(':');
				return daArr[0] + ':' + daArr[1];
			},
			showQuotePrice(price) {
				return publicData.showPrice(price, 100);
			},
			agreementDetails(){
				uni.navigateTo({
					url: '/pages/allAgreement/agreementItems/index?taskId=' + this.waybillDetails.taskId
				})
				// uni.navigateTo({
				// 	url: "/pages/allAgreement/agreementItems/transportAgreement?taskId=" + this.waybillDetails.taskId
				// })
			},
			showStatus(details) {
				if (details.status == 0) {
					return "已取消"
				} else if (details.status == 5) {
					return "已卸货完成"
				} else {
					return details.statusDesc
				}
				
			},
			showDanPrice() {
				var waybillDetails = this.waybillDetails;
				var wbEmptyPrice = waybillDetails.orderDetailVO.wbEmptyPrice;
				var wbPlatformPrice = waybillDetails.orderDetailVO.wbPlatformPrice;
				return wbEmptyPrice && wbPlatformPrice
			},
			getEmptyPrice() {
				var waybillDetails = this.waybillDetails;
				var wbEmptyPrice = waybillDetails.orderDetailVO.wbEmptyPrice;
				var bEmptyPrice = wbEmptyPrice ? (wbEmptyPrice/100).toFixed(2) : 0
				return bEmptyPrice
			},
			getPlatformPrice() {
				var waybillDetails = this.waybillDetails;
				var wbPlatformPrice = waybillDetails.orderDetailVO.wbPlatformPrice;
				var bEmptyPrice = wbPlatformPrice ? (wbPlatformPrice/100).toFixed(2) : 0
				return bEmptyPrice
			},
			sensitive(accountName){
				if(accountName == '') {
					return '';
				}else {
					return accountName.replace(/^(.{4})(?:\d+)(.{4})$/, "$1 **** **** $2");
				}
			},
			
			showGoodsName(item) {
				var orderVo = item.orderDetailVO;
				var addr = orderVo.child.orderContactsVOS;
				var gender = item.gender;
				var findIndex = addr.findIndex(item => {
					return item.serialnumber == 1 || item.serialnumber == 2
				})
				var name = addr[findIndex].userName;
				var subName = gender == '男' ? '先生' : '女士';
				return name.substring(0, 1) + subName;
			},
			showInfoPrice(price) {
				return publicData.showPrice(price, 100);
			},
			showPlatePrice(orderDetail) {
				var wbInformationPrice = orderDetail.wbInformationPrice || 0;
				var wbQuotePrice = orderDetail.wbQuotePrice || 0;
				var price = Number(wbQuotePrice) - Number(wbInformationPrice);
				
				return publicData.showPrice(price, 100);
			},
			showTotal(price) {
				var wbPlatformPrice = price.orderDetailVO.wbPlatformPrice || 0;
				var wbEmptyPrice = price.orderDetailVO.wbEmptyPrice || 0;
				var all = Number(wbPlatformPrice) + Number(wbEmptyPrice)
				return publicData.showPrice(all, 100);
			},
			showZhuangName(orderChild) {
				
				var orderAddressVOS = orderChild.orderAddressVOS;
				
				var findIndex = orderAddressVOS.findIndex(item => {
					return item.serialnumber == 1
				})
				
				var province = orderAddressVOS[findIndex].province || ""
				var city = orderAddressVOS[findIndex].city || ""
				var area = orderAddressVOS[findIndex].area || ""
				
				return province + " " + city + " " +  area;
				
			},
			showXieName(orderChild) {
				var orderAddressVOS = orderChild.orderAddressVOS;
				var findIndex = orderAddressVOS.findIndex(item => {
					return item.serialnumber == 4 || item.serialnumber == 3
				})
				if (findIndex < 0) {
					return "";
				} else {
					var province = orderAddressVOS[findIndex].province || ""
					var city = orderAddressVOS[findIndex].city || ""
					var area = orderAddressVOS[findIndex].area || ""
					
					return province + " " + city + " " +  area;
				}
			
			},
			showSendAddress(item) { // 发货地
					var obj = {
					 province: item.province,
					 provinceCode: item.provinceCode,
					 city: item.city,
					 cityCode: item.cityCode,
					 area: item.area,
					 areaCode: item.areaCode,
					}
				
				
				return this.showAddressMsg(obj);
			},
			showAddressMsg(obj) { // 展示地区
				if(obj.provinceCode == obj.cityCode) {
				 return obj.province
				}else if(obj.cityCode == obj.areaCode) {
				 return obj.province + '-' +obj.city;
				}else {
				 let returnMsg = obj.province;
				 returnMsg = obj.city ? returnMsg + '-' + obj.city : returnMsg;
				 returnMsg = obj.area ? returnMsg + '-' + obj.area : returnMsg;
				 return returnMsg;
				}
			},
			showAddress(obj) { // 展示地址
				let msg = '';
				var address = obj.address || "";
				return address;
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
			complete() {
				//一键完成
				this.$refs.confirmPopup.open()
				
			},
			showNodePrice(price) {
				if (price) {
					var s = publicData.showPrice(price, 100);
					return '单价*承运量-' + s + '元'
				} else {
					return '单价*承运量'
				}
			},
			cancelOrder() {
				this.$refs.confirmPopup1.open()
			},
			async cancelOrderConfirm() {
				try{
					if (!ship.btnRepeat()) return;
					this.$refs.confirmPopup1.close();
					var taskSId = this.waybillDetails.sid
					console.log(taskSId, '运单货源的sid')
					var res = await ship.postRequest("/yd/task/driverCancelYdTask?taskSId=" + taskSId, {
						taskSId: taskSId
					})
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '取消成功',
							icon: 'success'
						})
						setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
						}, 1000)
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			goSupplyDetails(details) {
				//查看货源详情
				var status = details.status;
				uni.navigateTo({
					url: '../supplyDetails/supplyGoods?sid=' + details.orderSid + "&status=" + status
				})
				
				
			},
			sendAbnormal() {
				//上报异常
				uni.navigateTo({
					url: '../../goodsDelivery/waybill/sendAbnormal/sendAbnormal'
				})
			},
			sendCommonent() {
				//服务评价
				uni.navigateTo({
					url: '../comments/comments'
				})
			},
			copy(number) {
				uni.setClipboardData({
					data: number, //要被复制的内容
					success: function() {
							uni.showToast({
								title: '复制成功',
								duration: 2000,
								icon: 'none'
							});
							//以下就可自定义操作了~
						},
						fail: function(err) {
							uni.showToast({
								title: '复制失败',
								duration: 2000,
								icon: 'none'
							});
						}
				});
			},
			showRemark(item) {
				
				var remark = item.transportContractVO.remark;
				var receiptTypeText = item.orderDetailVO.receiptType == 1 ? '需要回单' : '不需要回单';
				var hasRemark = [];
				
				if (remark) {
					hasRemark.push(remark)
				}
				hasRemark.push(receiptTypeText)
				return hasRemark.join(',')
			},
			async sendService() {
				//在线客服跳转美洽
				var waybillDetails = this.waybillDetails;
				var userInfo = uni.getStorageSync("userInfo");
				console.log(waybillDetails, userInfo);
				var ydTaskDriverVO = waybillDetails.ydTaskDriverVO;
				var taskId = waybillDetails.taskId;
				var driverName = ydTaskDriverVO.userName;
				var phone = ydTaskDriverVO.phone;
				var waystyle =  "";
				if (waybillDetails.status == 1) {
					waystyle = "计划中"
				} else if (waybillDetails.status == 5) {
					waystyle = "已完成"
				} else if (waybillDetails.status == 0) {
					waystyle = "已取消"
				}
				var comment = "";
				var userId = JSON.parse(userInfo).userId;
				var res = await ship.postRequest('/yh/business/user/select/by/user/id?userId=' + userId, {
					userId: userId
				});
				console.log(res, '用户信息')
				if (res.retCode == "0000000") {
					var countObj = res.rspBody
					comment = countObj.levelName
				}
				var orderAddressVOS = waybillDetails.orderDetailVO.child.orderAddressVOS;
					
				var findIndex = orderAddressVOS.findIndex(item => {
					return item.serialnumber == 1 || item.serialnumber == 2
				})
				var address = orderAddressVOS[findIndex].province + orderAddressVOS[findIndex].city + orderAddressVOS[findIndex].area + orderAddressVOS[findIndex].address
				uni.navigateTo({
					url: '../../my/index/onlineService?name=' + driverName + '&address=' + address + '&tel=' + phone + '&waystyle=' + waystyle + '&waynumber=' + taskId + '&comment=' + comment
				})
				
			},
			cancel() {
				this.$refs.confirmPopup.close();
				this.$refs.confirmPopup1.close();
			},
			async confirmOrder() {
				try{
					if (!ship.btnRepeat()) {
						return
					}
					this.$refs.confirmPopup.close();
					var taskSId = this.waybillDetails.sid;
					var quotationSid = this.waybillDetails.quotationSid;
					console.log(taskSId, quotationSid, '参数')
					
					var res = await ship.postRequest("/yd/task/finishYdTask?taskSId=" + taskSId + '&quotationSid=' + quotationSid, {
						taskSId: taskSId,
						quotationSid: quotationSid,
					})
					console.log(res)
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '完成成功',
							icon: 'success'
						})
						setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
						}, 1000)
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			call(child, index) {
				console.log(child, 'asas');
				var addr = child.orderAddressVOS;
				var status = this.waybillDetails.status;
				var mobile;
				if (status == 0) return;
				if (index == 0) {
					var findIndex = addr.findIndex(item => {
						return item.serialnumber == 1
					})
					mobile = addr[findIndex].mobile
				} else {
					var findIndex = addr.findIndex(item => {
						return item.serialnumber == 4
					})
					if (findIndex < 0) {
						findIndex = addr.findIndex(item => {
							return item.serialnumber == 3
						})
					}
					if (findIndex < 0) {
						mobile = "";
					} else {
						mobile = addr[findIndex].mobile
					}
				}
				if (!mobile) return;
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
			},
			callPhone(phone) {
				uni.makePhoneCall({
				    phoneNumber: phone,
				});
			},
			showPhone(addr, index) {
				var status = this.waybillDetails.status;
				if (status== 0) return;
				if (index == 0) {
					var findIndex = addr.findIndex(item => {
						return item.serialnumber == 1 || item.serialnumber == 2
					})
					var mobile = addr[findIndex].mobile;
					return mobile
				} else {
					var findIndex = addr.findIndex(item => {
						return item.serialnumber == 3 || item.serialnumber == 4
					})
					var mobile = addr[findIndex].mobile;
					return mobile
				}
			},
			showNotes() {
				this.$refs.notes.open();
			},
			prev(img) {
				uni.previewImage({
					current:0, //预览图片的下标
					urls:[img] //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			goLoadPage() {
				//去装货页面
				var item = this.waybillDetails;
				uni.navigateTo({
					url: './loadingTask?sid=' + item.sid + '&pageFrom=detail'
				})
			},
			loadAlertStart() {
				this.status = 0;
				var item = this.waybillDetails;
				uni.navigateTo({
					url: './beginTask?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=detail'
				})
			},
			receive(item) {
				//抵达
				this.status = 1;
				var item = this.waybillDetails;
				var status = item.status;
				if (status != 2 && item.isSync == 1) {
					uni.showToast({
						title: '请先起运',
						icon: 'none'
					})
					return;
				}
				uni.navigateTo({
					url: './arriveTask?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=detail'
				})
			},
		
			unLoadImg() {
				var item = this.waybillDetails;
				//卸货完成
				var status = item.status;
				if (status != 3 && item.isSync == 1) {
					uni.showToast({
						title: '请先抵达后在卸货',
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: './unLoadingTask?item=' + JSON.stringify(item) + '&pageFrom=detail'
				})
			},
			editOrder(item) {
				if (this.isJiesuan) {
					uni.showToast({
						title: '该运单已结算，无法修改',
						icon: 'none'
					})
					return;
				}
				uni.navigateTo({
					url: './waybillEdit?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=detail'
				})
			},
			commment(task) {
				console.log("task", task);
				var shipperComName = task.shipperComName || task.shipperUserName || "";
				//评价运单
				uni.navigateTo({
					url: '/pages/ship/waybill/comments?taskId=' + task.taskId + "&carrName=" + shipperComName,
					
				})
			},
			toGd(item) {
				let _this = this;
				console.log("supplyDetails", item)
				var text = this.showAddressMsg(item); 
				_this.shopAddress = text + (item.address || "");
				// 判断系统安装的地图应用有哪些, 并生成菜单按钮
				let _mapName = [{
						title: "高德地图",
						name: 'amap',
						androidName: 'com.autonavi.minimap',
						iosName: 'iosamap://'
					},
					{
						title: "百度地图",
						name: 'baidumap',
						androidName: 'com.baidu.BaiduMap',
						iosName: 'baidumap://'
					},
					{
						title: "苹果地图",
						name: 'applemap',
						androidName: 'com.apple.Maps',
						iosName: 'maps://'
					},
					{
						title: "腾讯地图",
						name: 'qqmap',
						androidName: 'com.tencent.map',
						iosName: 'qqmap://'
					},
				]
				// 根据真机安装的地图软件 生成操作菜单
				let buttons = []
				let platform = uni.getSystemInfoSync().platform
				platform === 'android' && _mapName.forEach(item => {
					if (plus.runtime.isApplicationExist({
							pname: item.androidName
						})) {
						buttons.push(item)
					}
				})
				platform === 'ios' && _mapName.forEach(item => {
					console.log(item)
					if (plus.runtime.isApplicationExist({
							action: item.iosName
						})) {
						buttons.push(item)
					}
				})
				if (buttons.length) {
					plus.nativeUI.actionSheet({ //选择菜单
						title: "选择地图应用",
						cancel: "取消",
						buttons: buttons
					}, function(e) {
						console.log("地图选择", e);
						let _map = buttons[e.index - 1]
						_this.openURL(_map, platform, item)
					})
				} else {
					//跳转应用市场
					uni.showToast({
						title: '请安装地图软件',
						icon: 'none'
					})
					return
				}
			},
			// 打开第三方应用
			openURL(map, platform, item) {
				console.log(map, platform);
				let _defaultUrl = {
					android: {
						"amap": `amapuri://route/plan/?sid=&did=&dlat=${item.latitude}&dlon=${item.longitude}&dname=${this.shopAddress}&dev=0&t=0`,
						'baidumap': `baidumap://map/direction?destination=name:${this.shopAddress}|latlng:${item.latitude},${item.longitude}&coord_type=wgs84&mode=driving&src=andr.baidu.openAPIdemo"`,
						'qqmap': `qqmap://map/routeplan?tocoord=${item.latitude},${item.longitude}&to=${this.shopAddress}&from=${this.selfAddress}&fromcoord=${this.selfLatitude},${this.selfLongitude}&type=drive`
					},
					ios: {
						"amap": `iosamap://path?sourceApplication=万年青&dlat=${item.latitude}&dlon=${item.longitude}&dname=${this.shopAddress}&dev=0&t=0`,
						// 'amap': `iosamap://viewMap?sourceApplication=万年青&poiname=${this.shopAddress}&lat=${item.latitude}&lon=${item.longitude}&dev=0`,
						'baidumap': `baidumap://map/direction?origin=我的位置&destination=name:${this.shopAddress}|latlng:${item.latitude},${item.longitude}&mode=driving&src=ios.baidu.openAPIdemo`,
						'applemap': `maps://?q=${this.shopAddress}&daddr=${this.shopAddress}&z=10&t=m&dirflg=d`,
						'qqmap': `qqmap://map/routeplan?tocoord=${item.latitude},${item.longitude}&to=${this.shopAddress}&from=${this.selfAddress}&fromcoord=${this.selfLatitude},${this.selfLongitude}&type=drive`
					}
				}
				let newurl = encodeURI(_defaultUrl[platform][map.name]);
				plus.runtime.openURL(newurl, function(res) {
					uni.showModal({
						content: res.message
					})
				}, map.androidName ? map.androidName : '');
			},
			
			
		}
	}
</script>

<style scoped lang="scss">
	.rightIcon {
		width: 25rpx;
		height: 25rpx;
	}
	.fix-bottom {
		padding: 24rpx 64rpx 0;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 184rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: flex-start;
		background-color: #FFFFFF;
		box-sizing: border-box;
		&.fix-bottom2 {
			align-items: flex-start;
			justify-content: center;
		}
		.fixItem {
			flex: 1;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			&.cancel {
				background-color: #2B72F0;	
			}
			&.pay {
				background-color: #2B72F0;
			}
			&+.fixItem {
				margin-left: 68rpx;
			}
		}
		.fixItem1 {
			width: 542rpx;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			&.cancel {
				background-color: #FC5C06;	
			}
			&.pay {
				background-color: #2B72F0;
			}
		}
	}
	.listView {
		border-radius: 12rpx;
		background-color: #FFFFFF;
		padding-top: 40rpx;
		.listItem {
			display: flex;
			flex-direction: row;
			margin: 0 40rpx;
			justify-content: flex-start;
			align-items: flex-start;
			height: 70rpx;
			margin-bottom: 40rpx;
			.arriveStatus {
				font-size: 26rpx;
				color: #777777;
				width: 120rpx;
			}
			.arriveView {
				margin: 0 84rpx;
				position: relative;
				flex: 1;
				.line {
					position: absolute;
					bottom: 40rpx;
					left: 10rpx;
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
				width: 32rpx;
				height: 32rpx;
			}
			.receiveNote {
				width: 250rpx;
				display: flex;
				flex-direction: column;
				font-size: 24rpx;
				.date {
					color: #333333;
				}
				.note {
					padding-top: 5rpx;
					color: #777777;
				}
			}
		}
	}
	.orderBox {
		padding: 24rpx 0 36rpx;
		border-radius: 24rpx;
		background-color: #FFFFFF;
		margin-bottom: 24rpx;
		box-sizing: border-box;
		box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
		.info {
			display: flex;
			flex-direction: row;
			padding-top: 22rpx;
			box-sizing: border-box;
			.info-icon {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				.zhuang, .xie {
					width: 40rpx;
					height: 40rpx;
					border-radius: 40rpx;
					color: #fff;
					font-size: 24rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.zhuang {
					background-color: #000000;
					margin-bottom: 15rpx;
				}
				.xie {
					background-color: RGBA(244, 58, 58, 1);
					margin-top: 15rpx;
				}
				.icon-box {
					width: 6rpx;
					height: 6rpx;
					background-color: #F2F3F3;
					margin: 4rpx 0;
					
				}
			}
			.info-content {
				flex: 1;
				margin-left: 20rpx;
				.title {
					color: #222222;
					font-weight: bold;
					display: flex;
					flex-direction: row;
					align-items: center;
					.name {
						font-size: 32rpx;	
					}
					.phone {
						font-size: 30rpx;
						margin-left: 32rpx;
					}
				}
				.msgIcon {
					height: 28rpx;
					width: 28rpx;
					margin-left: 32rpx;
				}
				.subTitle {
					margin-top: 18rpx;
					font-size: 26rpx;
					color: #777777;
					line-height: 40rpx;
					min-height: 90rpx;
					&.last {
						min-height: 50rpx;
					}
				}
			}
		}
	}
	.boxImgWhole {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 32rpx 0 26rpx;
		box-sizing: border-box;
		width: calc(100vw - 144rpx);
		overflow-x: scroll;
		.boxItem {
			width: 160rpx;
			height: 160rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-right: 26rpx;
			&:last-child {
				margin-right: 0;
			}
			.boxImage {
				width: 160rpx;
				height: 160rpx;
				background-color: #F3F3F3;
				border-radius: 16rpx;
				overflow: hidden;
			}
			.imgText {
				font-size: 32rpx;
				color: #333;
				margin-top: 12rpx;
			}
			
		}
	}
	.boxTitle {
		flex-direction: row;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #E7E7E7;
		height: 70rpx;
		.toTrack {
			height: 64rpx;
			width: 196rpx;
			border-radius: 8rpx;
			color: #FFFFFF;
			font-weight: 500;
			font-size: 28rpx;
			display: flex;
			flex-direction: row;
			overflow: hidden;
			.text {
				height: 64rpx;
				flex: 1;
				background-image: linear-gradient(to bottom, #4076F0, #245ACA);
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.title {
			font-size: 32rpx;
			color: #222222;
			font-weight: bold;
			.waybillAddr {
				width: 100rpx;
				height: 25rpx;
			}
		}
		.subTitle {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: #000000;
			padding-right: 22rpx;
			box-sizing: border-box;
			.copy {
				width: 36rpx;
				height: 36rpx;
			}
			.copy-text {
				color: #2B72F0;
				font-size: 24rpx;
				padding-right: 5rpx;
			}
			.rightIcon {
				margin-left: 8rpx;
			}
			.locationShow {
				width: 42rpx;
				height: 10rpx;
				margin: 0 10rpx;
			}
		}
	}
	.orderListBox {
		padding:24rpx 36rpx 0 36rpx;
		box-sizing: border-box;
		padding-bottom: 184rpx;
		background-color: #FAFAFA;
		.orderHead {
			width: calc(100vw - 72rpx);
			height: 92rpx;
			padding:0 48rpx;
			border-radius: 24rpx;
			font-size: 32rpx;
			color:#FFF;
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin:0 auto 24rpx;
			background: #2B72F0;
			position: relative;
			box-sizing: border-box;
			.head-text {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.arrow-right {
				width: 10rpx;
				height: 20rpx;
				margin-left: 20rpx;
			}
		}
		.orderBody {
			background-color: #FFF;
			box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
			border-radius: 12rpx;
			margin-bottom: 24rpx;
			padding-left: 30rpx;
			box-sizing: border-box;
			.list-item {
				margin-top: 32rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #333333;
				font-weight: 500;
				font-size: 32rpx;
				line-height: 32rpx;
				&:last-child {
					padding-bottom: 22rpx;
					box-sizing: border-box;
				}
				&.remark-content {
					align-items: flex-start;
				}
				&.list-price-item {
					margin-top: 48rpx;
				}
				.label {
					font-weight: 400;
					color: #333333;
					font-size: 32rpx;
					width: 170rpx;
					text-align: left;
				}
				.price-label {
					font-weight: 400;
					color: #333333;
					font-size: 32rpx;
					width: 176rpx;
					text-align: left;
				}
				.price-content {
					flex: 1;
					font-size: 32rpx;
					font-weight: 500;
				}
				.note {
					margin-right: 10rpx;
				}
				.type {
					color: #FC5C06;
				}
				.remark {
					width: calc(100vw - 310rpx);
					font-weight: 500;
				}
				.call {
					margin-left: 40rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					font-weight: 500;
					color: #10AB32;
					font-size: 36rpx;
					.phone {
						width: 36rpx;
						height: 36rpx;
						margin-left: 24rpx;
					}
				}
				.goods-item {
					display: flex;
					flex-direction: row;
					align-items: center;
					.unit {
						padding-left: 10rpx;
						box-sizing: border-box;
					}
				}
			}
			
			.orderContentBox {
				padding: 32rpx;
				.orderAddressBox {
					padding: 0 32rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.orderStatus {
						font-size: 20rpx;
						font-weight: 400;
						color: #777;
					}
					.addressMsg {
						font-size: 32rpx;
						font-weight: 400;
						color: #333333;
					}
				}
				.orderGoods {
					padding-top:32rpx;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.goodsMsg {
						.msgBox + .msgBox {
							margin-top: 10rpx;
						}
						.msgBox {
							.title {
								font-size: 24rpx;
								font-weight: 400;
								color: #777;
							}
							.msg {
								font-size: 24rpx;
								font-weight: 400;
								color: #333;
							}
						}
					}
					.goodsPrice {
						text-align: right;
						font-size: 48rpx;
						font-weight: 500;
						color: #F29347;
					}
				}
			}
		}
	}
	.listLoadingBox {
		height: 48rpx;
	}
	.hintBox {
		width: calc(100vw - 64rpx);
		background: #FFFFFF;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 352rpx;
		box-sizing: border-box;
		.title {
			font-size: 36rpx;
			color: #333333;
			padding: 48rpx 60rpx 40rpx;
			font-weight: bold;
		}
		.alertContent {
			font-size: 32rpx;
			color: #333333;
			flex: 1;
			padding: 0 60rpx;
			.text {
				display: flex;
				height: 84rpx;
				flex-wrap: wrap;
			}
		}
		.confirmBtnGroup {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top: 1px solid #F3F3F3;
			.cancelBtn {
				flex: 1;
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				display: flex;
				justify-content: center;
				align-items: center;
				&.cancel {
					border-right: 1px solid #F3F3F3;
					color: #777777;
				}
				&.confirm {
					color: #4AA2F3;
				}
			}
		}
	}
	.waybillImg {
		width: 160rpx;
		height: 160rpx;
	}
	.xieyi {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		font-weight: 500;
		color: #333333;
		font-size: 32rpx;
		.subTitle {
			font-size: 28rpx;
		}
	}
	.arriveContent {
		width: calc(100vw - 128rpx);
		height: 290rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		.btn {
			height: 92rpx;
			display: flex;
			flex-direction: row;
			border-top: 1px solid #F3F3F3;
			.item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				&.cancel {
					color: #777777;
					border-right: 1px solid #F3F3F3;
				}
				&.confirm {
					color: #0171F9;
				}
			}
		}
		.content {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #777777;
			font-size: 32rpx;
		}
	}
	
	
	.addrInfo {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		.addr_icon_content {
			width: 90rpx;
			text-align: center;
			.addr_icon {
				width: 40rpx;
				height: 40rpx;
			}
		}
		.title {
			padding-top: 6rpx;
			box-sizing: border-box;
			width: calc(100vw - 150rpx);
			.addr_line {
				width: calc(100vw - 178rpx);
				height: 1px;
				background-color: #E7E7E7;
				margin: 32rpx 0;
			}
		}
		.addr_and_daohang {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			padding: 0 32rpx 16rpx 0;
		}
		.addr {
			max-width: calc(100vw - 250rpx);
			font-size: 32rpx;
			color: #222222;
			font-weight: 500;
			box-sizing: border-box;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.address {
			font-size: 28rpx;
			color: #666;
			line-height: 42rpx;
			padding-right: 40rpx;
			overflow: hidden;
			-webkit-line-clamp: 2;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}
	}
	
	.userInfo {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 28rpx;
		color: #666666;
		.mobile {
			color: #10AB32;
			margin-left: 8rpx;
			font-weight: 500;
			display: flex;
			flex-direction: row;
			align-items: center;
			.mobile_icon {
				width: 24rpx;
				height: 24rpx;
				margin-left: 24rpx;
			}
		}
	}
	.daohang {
		width: 48rpx;
		height: 48rpx;
		margin-left: 10rpx;
	}
	
</style>
