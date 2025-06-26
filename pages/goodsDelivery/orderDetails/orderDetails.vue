<template>
	<view class="orderDetails">
		<view class="recommendedModel" v-if="orderDetailInfo.shipperSid == userInfo.userId && isConventionalOrder && orderDetailInfo.orderState == 1" @click="jumpToRecommendDriver">
			<view class="recommendedTitle">推荐司机</view>
			<image class="forFreeIcon" src="/static/images/newOrderDetails/forFree.png"></image>
			<view class="recommendedMoreBtn">
				点击查看
				<image class="moreIcon" src="/static/images/newOrderDetails/arrowIcon.png"></image>
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
							<text class="msg" v-if="item.mobile">{{item.mobile}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="otherMsgRow">
				<view class="subMsg">发布至：{{showSendScope()}}</view>
			</view> -->
			<view class="otherMsgRow">
				<view class="subMsg">联系发货人</view>
				<view class="callCol" @click="toCallUser()">
					<text class="callMsg">{{showShiperName()}}</text>
					<text class="callMsg">点击拨号</text>
					<image class="callIcon" src="/static/images/newOrderDetails/callIcon.png"></image>
				</view>
			</view>
			<view class="otherMsgRow">
				<view class="otherText">运输里程约：{{orderDetailInfo.estimatedDistance}}公里</view>
				<view class="otherText">发布时间：{{orderDetailInfo.createdDt}}</view>
			</view>
		</view>
		<view class="electron" v-if="orderDetailInfo && orderDetailInfo.sid">
			<text>电子围栏</text>
			<view class="icon-right" @click="editElectronInfo">
				<text>点击查看</text>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/icon_black_right.png" class="icon_black_right"></image>
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
				<view class="contentTitle">车辆</view>
				<view class="contentMsg">
					<text class="msgCol">{{showOrderCarLength()}}</text>
					<text class="msgCol">{{showOrderCarType()}}</text>
					<text class="msgCol">{{orderDetailInfo.multiTruck ? orderDetailInfo.multiTruck : 1}}车</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="contentTitle">装货时间</view>
				<view class="contentMsg">
					<text class="msgCol">{{showOrderLoadTime()}}</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="contentTitle">货物</view>
				<view class="contentMsg">
					<text class="msgCol">{{orderDetailInfo.cargoTypeName4}}</text>
					<text class="msgCol" v-if="orderDetailInfo.cargoWeight">{{orderDetailInfo.cargoWeight}}{{ showCargoUnit(orderDetailInfo.cargoUnit) }}</text>
					<text class="msgCol" v-if="orderDetailInfo.cargoVolume">{{orderDetailInfo.cargoVolume}}方</text>
				</view>
			</view>
			<view class="contentRow">
				<view class="contentTitle">发布至</view>
				<view class="contentMsg">{{showSendScope()}}</view>
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
					<text class="msgCol importMsg" v-if="showInformationPrice()">{{showInformationPrice()}}元</text>
					<text class="msgCol importMsg" v-else>无订金</text>
					<text class="msgCol">{{showInformationType()}}</text>
				</view>
			</view>
			<!-- <view class="contentRow">
				<view class="contentTitle">平台担保</view>
				<view class="contentMsg">
					{{orderDetailInfo.orderChild.orderValueAddedVOS.cargoDamageFlag == 1 ? '需要平台担保' : '不需要平台担保'}}
					<text class="msgCol importMsg" v-if="orderDetailInfo.orderChild.orderValueAddedVOS.cargoDamageFlag == 1">
						{{orderDetailInfo.orderChild.orderValueAddedVOS.cargoDamagePrice ? orderDetailInfo.orderChild.orderValueAddedVOS.cargoDamagePrice / 100 : 0}}元
					</text>
					{{orderDetailInfo.orderChild.orderValueAddedVOS.cargoDamageFlag == 1 ? '担保费' : ''}}
				</view>
			</view> -->
		</view>
		<view class="qrCode_content" v-if="orderDetailInfo && orderDetailInfo.sid">
			<view class="qrCode-title">货源码</view>
			<view class="qrCode_bg">
				<view style="height: 38rpx" />
				<view class="fleets">
				  <view class="fleets-icon">>></view>
				  <view class="fleets-content">{{ showFleets() }}</view>
				  <view class="fleets-icon">&lt;&lt;</view>
				</view>
				<view class="qr-citys">
					<view class="qr-citys-content">
						<text class="qr-item">{{showSenderCity()}}</text>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/qr_arrow_right.png" class="qr_arrow_right qr-item"></image>
						<text class="qr-item">{{showReceiverCity()}}</text>
					</view>
					
				</view>
				<view class="qr-lines" />
				<view class="qr-price-row">
					<text class="qr-price">{{showItemPrice(orderDetailInfo)}}</text>
					<text class="qr-pushDt">{{showPushDate(orderDetailInfo.createdDt)}}</text>
				</view>
				<view class="qr-tips">
				  <view class="qr-tips-content">备注：{{ showRemark() }}</view>
				</view>
				<view class="qr-imgContent">
					<image :src="canvasUrl" class="qr-img"></image>
				</view>
				<view class="qr-comp">{{orderDetailInfo.enterpriseName}}</view>
				<view class="qr-text">>>扫一扫二维码，快速接单<<</view>
			</view>
			<view @click="saveToPhoto" class="qr-save">存至手机</view>
		</view>
		
		<view v-if="lists.length > 0">
			<mosoweCanvas
				ref="mosoweCanvasComponents" 
				@canvasImage="_canvasImage" 
				:lists="lists" 
				height="300" 
				width="300"
			/>
		</view>
		
		<canvas id="my-canvas" canvas-id="my-canvas" class="canvas"></canvas>
		<view class="footBtnGroup" v-if="orderDetailInfo.shipperSid == userInfo.userId && orderDetailInfo.orderState == 1">
			<view class="btnBox" style="background-color: #FC5C06;" v-if="hasOrdereEffective()" @click="jumpToAssignedDriver()">
				<image class="icon" src="/static/images/newOrderDetails/assignedIcon.png"></image>
				<text class="msg">指派</text>
			</view>
			<view class="btnBox" style="background-color: #2B72F0;" v-if="hasOrdereEffective()" @click="closeOrder()">
				<image class="icon" src="/static/images/newOrderDetails/closeOrderIcon.png"></image>
				<text class="msg">下架</text>
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
	import * as service from "@/utils/service.js";
	import {longEvent} from "../../../longLink/consignorlongLink.js";
	import IMService from "@/utils/imservice.js";
	import * as utilDate from "@/utils/utils";
	import * as publicData from "@/utils/publicData.js";
	import mosoweCanvas from "../../../components/mosowe-canvas-image/mosowe-canvas-image.vue";
	import { ENV } from "@/utils/baseUrl.js"
	export default {
		components: {
			mosoweCanvas: mosoweCanvas
		},
		data() {
			return {
				arrowImg: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/qr_arrow_right.png',
				canvasW: 0,
				canvasH: 0,
				subTitle: '标题',
				subTitle1: '标题1',
				canvasUrl: '',
				lists: [],
				electronInfo: null,
				orderDetailInfo: {},
				userInfo: {},
				sid: '',
				orderNumber: '',
				isConventionalOrder: true, // 是否常规订单
				isShare: false,
				newOrderAddressVOS: [],
				shareImgBc: [
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/appShareGoods1.png',
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/appShareGoods2.png',
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/appShareGoods3.png',
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/appShareGoods4.png',
				],
				shareTitle: '',
			};
		},
		onLoad(options) {
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) {
				uni.navigateBack()
			}else {
				this.userInfo = JSON.parse(userInfo);
				console.log(this.userInfo);
				// uni.showLoading();
				// this.getHandingRequiredInfo();
				this.sid = options.sid;
				this.orderNumber = options.orderNumber;
				var sid = options.sid;
				this.getListRecord()
			}
			
			// this.canvas = uni.createCanvasContext("canvas", this);
			
			
			uni.$on("electronSet", electronInfo => {
				var electronInfo = JSON.parse(electronInfo);
				var zhuang = electronInfo.zhuang;
			
				var xie = electronInfo.xie;
				
				var orderFenceVOS = [];
				var orderNumber = this.orderDetailInfo.orderNumber;
				if (zhuang && zhuang.fenceRadius != undefined) {
					zhuang.orderNumber = orderNumber;
					orderFenceVOS.push(zhuang)
				}
				if (xie && xie.fenceRadius != undefined) {
					xie.orderNumber = orderNumber;
					orderFenceVOS.push(xie)
				}
				this.electronInfo = orderFenceVOS;
				var sid = this.orderDetailInfo.sid;
				console.log(orderFenceVOS, orderNumber, sid, "orderFenceVOS")
				var params1 = {orderFenceVOS: orderFenceVOS, orderNumber: orderNumber, sid: sid}
				console.log(params1, "params");
				utils.postRequest("/td/order/fence/edit", {orderFenceVOS: orderFenceVOS, orderNumber: orderNumber, sid: sid})
				.then(res => {
					console.log(res, "修改电子围栏");
					if (res.retCode == "0000000") {
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
					
					
			})
		},
		onShow() {
			longEvent(this, () => {});
			var app = getApp();
			let that = this;
			app.globalData.consignorSocketTask.onMessage((res) => {
				console.log("收到服务器内容：" + res.data);
				let data = res.data;
				if(data.length > 10) {
					data = JSON.parse(data);
					if(data.business_type == 'order_message') {
						data.msgContent = JSON.parse(data.msgContent);
						console.log(data);
						if (data.msgContent.userType == "货主") {
							if(data.msgContent.orderSid == that.sid) {
								that.getListRecord(that.sid);
							}
						}
					}
				}
			});
		},
		onNavigationBarButtonTap(e) {
			console.log(e);
			// this.showMenu = !this.showMenu;
			this.generate();
		},
		onUnload() {
			uni.$off("electronSet");
		},
		methods: {
			showCargoUnit(cargoUnit) {
				return utilDate.showCargoUnit(cargoUnit);
			},
			showFleets() {
				var supplyDetails = this.orderDetailInfo;
				if (!supplyDetails) return "";
				var fleetSids = supplyDetails.fleetSids;
				var text = "";
				var fleetSidsArr = [], fleet = [];
				if (!fleetSids) {
					text = "全平台"
				} else {
					fleetSidsArr = JSON.parse(fleetSids);
					fleetSidsArr.forEach(atem => {
						fleet.push(atem.name)
					})
					text = fleet.join(',')
					if (text.length > 12) {
						text = text.substring(0, 12);
					}
				}
				
				return text
			},
			showFleetname() {
				var supplyDetails = this.orderDetailInfo;
				if (!supplyDetails) return "";
				var fleetSids = supplyDetails.fleetSids;
				if (!fleetSids) return "";
				
				
				return fleetSids || ''
			},
			showPushDate(date) {
				var d = date.split(" ")[0];
				var newstr = d.replace(/-/g, "/");
				return newstr;
			},
			showItemPrice(item) { // 展示货源价格
				if(item.fixPriceFlag == '1') {
					let fixPrice = item.fixPrice ? Number(item.fixPrice) / 100 : 0;
					return fixPrice + '元/' + item.quotePriceTypeName
				}else {
					return '价格电议';
				}
			},
		
			showReceiverCity() {
				var newOrderAddressVOS = this.newOrderAddressVOS;
				if (!newOrderAddressVOS) return "";
				var len = newOrderAddressVOS.length;
				var item = newOrderAddressVOS[len - 1];
				var citys = this.showAddressArea(item);
				return citys
			},
			beginCanvas () {
				console.log("绘制图片", this.$refs.mosoweCanvasComponents);
				this.$refs.mosoweCanvasComponents.createCanvas();
			},
			_canvasImage (e) {
				console.log("二维码信息", e);
				this.canvasUrl = e;
			},
			//   **
			//  * 绘制圆角矩形
			//* @param { Object } ctx - canvas组件的绘图上下文
			//* @param { Number } x - 矩形的x坐标
			//* @param { Number } y - 矩形的y坐标
			//* @param { Number } w - 矩形的宽度
			//* @param { Number } h - 矩形的高度
			//* @param { Number } r - 矩形的圆角半径
			//* @param { String } [c = 'transparent'] - 矩形的填充色
			//* /
			drawRoundRect(ctx, x, y, w, h, r, c = '#fff') {
				if (w < 2 * r) { r = w / 2; }
				if (h < 2 * r) { r = h / 2; }

				ctx.beginPath();
				ctx.fillStyle = c;

				ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
				ctx.moveTo(x + r, y);
				ctx.lineTo(x + w - r, y);
				ctx.lineTo(x + w, y + r);

				ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
				ctx.lineTo(x + w, y + h - r);
				ctx.lineTo(x + w - r, y + h);

				ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
				ctx.lineTo(x + r, y + h);
				ctx.lineTo(x, y + h - r);

				ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
				ctx.lineTo(x, y + r);
				ctx.lineTo(x + r, y);

				ctx.fill();
				ctx.closePath();
			},
			drawRoundImg(ctx, path,x, y ,w, h) {
				ctx.drawImage(path, x, y, w, h)
			},
			drawDashLine(ctx,x1,y1,x2,y2,dashLength){
			    ctx.setStrokeStyle("#4073E6")//线条颜色
			    ctx.setLineWidth(1)//线条宽度
			    var dashLen = dashLength,
			    xpos = x2 - x1, //得到横向的宽度;
			    ypos = y2 - y1, //得到纵向的高度;
			    numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen); 
			    //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
			    for(var i=0; i<numDashes; i++){
			     if(i % 2 === 0){
			         ctx.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i); 
			         //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
			      }else{
			          ctx.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
			      }
			    }
			    ctx.stroke();
			},
			saveToPhoto() {
				//货源二维码保存到手机
				let that = this;
				var orderDetailInfo = this.orderDetailInfo;
				this.ctx = uni.createCanvasContext('my-canvas', this);
				this.canvasW = 307;
				this.canvasH = 444;
				//设置画布大小
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);
				//设置画布背景透明
				this.ctx.setFillStyle('rgba(255, 255, 255, 0)')
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, 16, '#D9D9D9')
				let hW = uni.upx2px(500);
				let headerImg = this.canvasUrl;
				let arrowImg = this.arrowImg;
				let hW1 = 130;
				let hH = 130;
				//绘制背景图片
				var bgUrl = "https://hyzg-app.oss-cn-beijing.aliyuncs.com/qrCode_bg_new.jpg";
				this.drawRoundImg(this.ctx, bgUrl, 0, 0, this.canvasW, this.canvasH);
				
				//绘制二维码
				this.drawRoundImg(this.ctx, headerImg, 88, 195, hW1, hH);
				
				//绘制车队名称
				var fleets = this.showFleets();
				// var fleets = "啊实打实大阿达撒大声地啊大大阿达是啊实打实大师"
				if (fleets.length > 12) {
					fleets = fleets.substring(0, 12)
				}
						
				var fleets_content = fleets
				this.ctx.setFontSize(16);
				this.ctx.font = "normal bold 16px PingFang SC";
				this.ctx.setFillStyle('#FC5C06');
				this.ctx.textAlign = 'center';
				var fleets_content_len = this.ctx.measureText(fleets_content).width;
				this.ctx.fillText(fleets_content,  this.canvasW/2, 50);
				
							
				var fleets_left_icon = ">>"
				this.ctx.setFontSize(14);
				this.ctx.font = "normal normal 14px PingFang SC";
				this.ctx.setFillStyle('#EE6502');
				this.ctx.textAlign = 'left';
				var fleets_left_icon_size = this.ctx.measureText(fleets_left_icon).width;
				
				this.ctx.fillText(fleets_left_icon,  this.canvasW/2 - fleets_content_len/2 - fleets_left_icon_size - 5, 50);	
				
				var fleets_right_icon = "<<"
				this.ctx.setFontSize(14);
				this.ctx.textAlign = 'left';
				this.ctx.font = "normal normal 14px PingFang SC";
				this.ctx.setFillStyle('#EE6502');
				this.ctx.fillText(fleets_right_icon,  this.canvasW/2 + fleets_content_len/2 + 5, 50);
				//绘制起始点
				var senderCity = this.showSenderCity();
				var receiverCity = this.showReceiverCity();
				//绘制箭头
				//去除空格后文字的长度
				let senderCitySize = senderCity.replace(' ', "").length;
				let receiverCitySize = receiverCity.replace(' ', "").length;
				let senderWidth = this.ctx.measureText(senderCity).width;
				let recerverWidth = this.ctx.measureText(receiverCity).width;
				console.log("大小", senderCitySize*14,receiverCitySize*14, 265 - senderWidth - recerverWidth - 79);
				if (265 - senderWidth - recerverWidth - 79 < 0) {
					//绘制发货位置和箭头
					this.ctx.setFontSize(14);
					this.ctx.setFillStyle('#000000');
					this.ctx.fillText(senderCity, 37, 75);
					let leftDear = 37 + senderCitySize*14 + 16;
					this.drawRoundImg(this.ctx, arrowImg, leftDear, 65, 25, 8);
					var lastSunStrIndex = 0; //每次开始截取的字符串的索引
					var contentWidth = leftDear + 25 + 16;
					var initHeight = 75; //绘制字体距离canvas顶部初始的高度
					//初始坐标
					var measureX = leftDear + 25 + 16;
					for (let i = 0; i < receiverCity.length; i++) {
						contentWidth += 14;
						console.log("循环",contentWidth, 265 - leftDear - 25 - 16);
						if (contentWidth > 265) {
							this.ctx.fillText(receiverCity.substring(lastSunStrIndex, i), measureX, initHeight) //绘制未截取的部分
							contentWidth = 0;
							lastSunStrIndex = i;
							measureX = 37;
						}
						if (i == receiverCity.length - 1) {
							this.ctx.fillText(receiverCity.substring(lastSunStrIndex, i + 1), 37, initHeight + 20);
						}
			 
					}
					
					
				} else {
					//一行绘制地址
					this.ctx.setFontSize(14);
					this.ctx.setFillStyle('#000000');
					this.ctx.textAlign = "left";
					this.ctx.fillText(senderCity, 37, 85);
					let leftDear = 37 + senderCitySize*14 + 16;
					this.ctx.textAlign = "left";
					this.drawRoundImg(this.ctx, arrowImg, leftDear, 75, 25, 8);
					let receiverLeft = leftDear + 25 + 16;
					this.ctx.textAlign = "left";
					this.ctx.fillText(receiverCity, receiverLeft, 85);
					
				}
				//绘制虚线
				this.drawDashLine(this.ctx, 28, 107, 279, 107, 5);
				
				//绘制价格	
				var price = this.showItemPrice(orderDetailInfo);
				this.ctx.setFillStyle('#FC5C06');
				this.ctx.font = "normal bold 16px PingFang SC";
				this.ctx.fillText(price, 37, 135);
				//绘制发布日期
				let pushDt = this.showPushDate(orderDetailInfo.createdDt);
				this.ctx.setFillStyle('#666666');
				this.ctx.font = "normal normal 12px PingFang SC";
				
				var leftX = this.canvasW - 108;
				this.ctx.fillText(pushDt, leftX, 134);
				
				//绘制备注
				var remark = this.showRemark();
				// var remark = "阿萨斯大叔大婶大叔大婶大萨达四大四大啊实打实大时代阿达阿达"
				if (remark.length > 15) {
					remark = remark.substring(0, 15) + '...'
				}
				var remarkContent = "备注：" + remark;
				this.ctx.setFillStyle('#FC5C06');
				this.ctx.font = "normal bold 12px PingFang SC";
				this.ctx.fillText(remarkContent, 37, 164);
				//设置公司名称
				var enterpriseName =  orderDetailInfo.enterpriseName;
				let enterpriseHeight = this.ctx.measureText(enterpriseName).height;
				console.log(enterpriseHeight, "公司名称的高度");
				if (enterpriseName) {
					this.ctx.setFillStyle('#333333');
					this.ctx.font = "normal bold 14px PingFang SC";
					var enterpriseNameWidth = enterpriseName.length * 14;
					var enterWidth = this.canvasW / 2 - enterpriseNameWidth / 2;
					this.ctx.fillText(enterpriseName, enterWidth, 375);
				}
				
				//绘制提示
				this.ctx.setFillStyle('#FC5C06');
				this.ctx.font = "normal normal 12px PingFang SC";
				var tips = ">>扫一扫二维码，快速接单<<";
				var tipsWidth = 160;
				var showTipsWidth = this.canvasW / 2 - tipsWidth / 2;
				this.ctx.fillText(tips, showTipsWidth, 420);
				this.ctx.draw(true, () => {
					// 将canvas 变成图片方便发送给好友或者保存
					uni.canvasToTempFilePath({
						canvasId: 'my-canvas',
						fileType: 'jpg',
						x: 0,
						y: 0,
						complete: (res) => {
							that.canvasImg = res.tempFilePath;
							uni.showModal({
								title: '提示',
								content: '将获取您的存储权限以保存数据',
								success: function(result) {
									if (result.confirm) {
										uni.saveImageToPhotosAlbum({
											filePath: res.tempFilePath,
											success: function() {
												uni.showToast({
													title: '保存成功',
													icon: 'none'
												})
											},
											fail: function(err) {
												console.log(err)
												uni.showToast({
													title: '请授予图片保存权限',
													icon: 'none'
												})
											}
										})
									}
								}
							})
						
						}
					}, this);
				})
		

			},
			editElectronInfo() {
				var electronInfo = this.electronInfo;
				console.log(electronInfo, "electronInfo")
				var zhuang,xie;
				electronInfo.forEach(item => {
					if (item.fenceType == 1) {
						zhuang = item
					} else {
						xie = item
					}
				})
				var electron = {
					zhuang: zhuang,
					xie: xie,
				}
				var orderDetailInfo = this.orderDetailInfo;
				var shipperSid = orderDetailInfo.shipperSid;
				console.log(electron, "electron")
				uni.navigateTo({
					url: '/pages/goodsDelivery/creatOrder/electron/electron?shipperSid='+ shipperSid +'&source=edit&electronInfo=' + JSON.stringify(electron)
				})
			},
			checkhandingRequiredVal(val) {
				for(let i in this.handingRequiredVal) {
					if(this.handingRequiredVal[i].sid == val) {
						return true;
					}
				}
			},
			getListRecord(indexOrderSid) {
				uni.showLoading({
					title: '加载中'
				});
				let that = this;
				let params = {
					sid: that.sid,
					orderNumber: that.orderNumber,
				}
				console.log('询价详情查询参数', params);
				utils.newQueryPostRequest('/td/order/findListRecord', params)
				.then(res=>{
					console.log('询价详情', res);
					if(res.retCode == '0000000') {
						let orderDetailInfo = res.rspBody;
						that.orderDetailInfo = orderDetailInfo;
						that.electronInfo = res.rspBody.orderFenceVOS;
						var content;
						var orderNumber = orderDetailInfo.orderNumber;
						if(ENV == "development") {
							content = "https://m-test.hyzgapp.com/#/share?orderNumber=" + orderNumber;
						} else {
							content = "https://m-test.hyzgapp.com/#/share?orderNumber=" + orderNumber;
						}
						
						that.lists = [
							{
								type: 'qr',
								content: content, 
								width: 300, 
								height: 300, 
								x: 0, 
								y: 0,
							}
						]
						// console.log("微信二维码", this.lists);
						setTimeout(() => {
							that.beginCanvas();//开始绘制二维码
						}, 200)
						let snedAddressAry = [];
						let ariverAddressAry = [];
						let orderAddressVOS = orderDetailInfo.orderChild.orderAddressVOS;
						if(orderAddressVOS && orderAddressVOS.length > 0) {
							for(let i in orderAddressVOS) {
								let serialnumber = orderAddressVOS[i].serialnumber
								if(serialnumber == 1 || serialnumber == 2 || serialnumber == 5 || serialnumber == 6 || serialnumber == 7) {
									snedAddressAry.push(orderAddressVOS[i]);
								}else {
									ariverAddressAry.push(orderAddressVOS[i]);
								}
							}
							that.newOrderAddressVOS = [...snedAddressAry, ...ariverAddressAry];
						}
						if(indexOrderSid) {
							uni.$emit('refreshData_index')
						}
						that.getConventionalOrderStatus();
						that.showShareTitle();
						
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
				uni.stopPullDownRefresh();
			},
			getConventionalOrderStatus() { // 是否展示智能推荐
				if(
					this.orderDetailInfo.orderSecondState != 11 &&
					this.orderDetailInfo.orderSecondState != 12 &&
					this.orderDetailInfo.orderSecondState != 13 &&
					this.orderDetailInfo.orderSecondState != 14 &&
					this.orderDetailInfo.orderSecondState != 16
				) {
					this.isConventionalOrder = false;
				}
				if(this.orderDetailInfo.orderSecondState == 16 && (this.orderDetailInfo.multiTruck == 1 || !this.orderDetailInfo.multiTruck)) {
					this.isConventionalOrder = false;
				}
				if(this.orderDetailInfo.fleetSids) {
					this.isConventionalOrder = false;
				}
				// 不限车型车长则无法使用智能推荐
				let orderVehicleModelVOS = this.orderDetailInfo.orderChild.orderVehicleModelVOS;
				let orderVehicleLengthVOs = this.orderDetailInfo.orderChild.orderVehicleLengthVOs;
				if(orderVehicleModelVOS && orderVehicleModelVOS[0] && orderVehicleModelVOS[0].vehicleModelCode == 'typeNoLimit') {
					this.isConventionalOrder = false;
				}else if(orderVehicleLengthVOs && orderVehicleLengthVOs[0] && orderVehicleLengthVOs[0].vehicleLengthCode == 'longNoLimit') {
					this.isConventionalOrder = false;
				}
			},
			
			showSenderCity() { // 发货地
				var item = this.orderDetailInfo;
				let obj = {
					province: item.provinceName1,
					provinceCode: item.provinceCode1,
					city: item.cityName1,
					cityCode: item.cityCode1,
					area: item.areaName1,
					areaCode: item.areaCode1,
				}
				return this.showAddressDetail(obj);
			},
			showReceiverCity() { // 目的地
				var item = this.orderDetailInfo;
				let obj = {};
				if(item.provinceName10) {
					obj = {
						province: item.provinceName10,
						provinceCode: item.provinceCode10,
						city: item.cityName10,
						cityCode: item.cityCode10,
						area: item.areaName10,
						areaCode: item.areaCode10,
					}
				}else if(item.provinceName9){
					obj = {
						province: item.provinceName9,
						provinceCode: item.provinceCode9,
						city: item.cityName9,
						cityCode: item.cityCode9,
						area: item.areaName9,
						areaCode: item.areaCode9,
					}
				}
				else if(item.provinceName8){
					obj = {
						province: item.provinceName8,
						provinceCode: item.provinceCode8,
						city: item.cityName8,
						cityCode: item.cityCode8,
						area: item.areaName8,
						areaCode: item.areaCode8,
					}
				}
				else if(item.provinceName4){
					obj = {
						province: item.provinceName4,
						provinceCode: item.provinceCode4,
						city: item.cityName4,
						cityCode: item.cityCode4,
						area: item.areaName4,
						areaCode: item.areaCode4,
					}
				}
				else if(item.provinceName3){
					obj = {
						province: item.provinceName3,
						provinceCode: item.provinceCode3,
						city: item.cityName3,
						cityCode: item.cityCode3,
						area: item.areaName3,
						areaCode: item.areaCode3,
					}
				}
				return this.showAddressDetail(obj);
			},
			showAddressDetail(obj) { // 展示地区
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
			showOrderCarLength() { // 车长
				let ary = this.orderDetailInfo.orderChild.orderVehicleModelVOS;
				if(ary && ary.length > 0) {
					let msg = '';
					for(let i in ary) {
						msg = msg + ary[i].vehicleModel + '/';
					}
					return msg.substring(0, msg.length -1)
				}
			},
			showOrderCarType() { // 车型
				let ary = this.orderDetailInfo.orderChild.orderVehicleLengthVOs;
				if(ary && ary[0].vehicleLengthCode == 'longNoLimit') {
					return '不限车长';
				}else if(ary && ary.length > 0) {
					let msg = '';
					for(let i in ary) {
						msg = msg + ary[i].vehicleLength + '米/';
					}
					return msg.substring(0, msg.length -1)
				}
			},
			showRemark() { // 备注
				let msg = '';
				let ary = this.orderDetailInfo.orderChild.orderLoadFactorVOS;
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
				let obj = this.orderDetailInfo.orderChild.orderQuoteVO;
				let price = obj && obj.informationPrice ? (obj.informationPrice/100).toFixed(2) : 0;
				return price;
			},
			showInformationType() {
				let obj = this.orderDetailInfo.orderChild.orderQuoteVO;
				let price = obj && obj.informationPrice ? (obj.informationPrice/100).toFixed(2) : 0;
				if (price == 0) return "";
				if(!this.orderDetailInfo.informationFlag) return '不退还';
				switch(this.orderDetailInfo.informationFlag) {
					case 1:
						return '退还';
					case 2:
						return '不退还';
				}
			},
			showPayPrice() { // 价格信息
				if(this.orderDetailInfo.fixPriceFlag == '1') {
					let obj = this.orderDetailInfo.orderChild.orderQuoteVO;
					let price = this.orderDetailInfo.fixPrice ? (this.orderDetailInfo.fixPrice/100).toFixed(2) : 0;
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
				let ary = this.orderDetailInfo.orderChild.orderContactsVOS;
				if(ary && ary.length > 0) {
					let userName = ary[0].userName;
					return userName.substr(0, 1) + '先生';
				}
			},
			toCallUser() { // 拨打电话
				let ary = this.orderDetailInfo.orderChild.orderContactsVOS;
				if(ary && ary.length > 0) {
					let platformMsg = uni.getSystemInfoSync().platform;
					if(platformMsg == 'android') {
						let that = this;
						uni.showModal({
							title:'提示',
							content:'将获取您的电话权限以拨打电话',
							success: function(res) {
								if (res.confirm) {
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
											that.makePhoneCall(result, ary[0].mobile);
										}
									)
								}
							}
						})
						
					}else {
						this.makePhoneCall(1, ary[0].mobile);
					}
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
			jumpToRecommendDriver() {
				console.log(this.sid);
				uni.navigateTo({
					url: './recommendDriver?sid=' + this.sid
				})
			},
			hasOrdereEffective() { // 是否有效货源
				if(
					this.orderDetailInfo.orderSecondState == 11 ||
					this.orderDetailInfo.orderSecondState == 12 ||
					this.orderDetailInfo.orderSecondState == 13 ||
					this.orderDetailInfo.orderSecondState == 14
					 // ||this.orderDetailInfo.orderSecondState == 16
				) {
					return true;
				}else {
					return false;
				}
			},
			closeOrder() { // 关闭货源
				if(!utils.btnRepeat()) return false; // 防抖
				uni.showLoading({
					title: '加载中'
				});
				let that = this;
				let params = {
					sid: that.sid
				}
				utils.postRequest('/td/order/undercarriage', params)
				.then(res=>{
					console.log('订单取消', res);
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '下架货源成功！',
							icon: 'none',
							duration: 2000
						})
						uni.$emit("cancel_index");
						uni.navigateBack();
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
			jumpToAssignedDriver() { // 跳转指派
				getApp().globalData.assignedDriverObj = '';
				uni.navigateTo({
					url: './assignedDetails?needInvoiceFlag=' + this.orderDetailInfo.needInvoiceFlag + '&orderNumber=' + this.orderDetailInfo.sid + '&multiTruck=' + this.orderDetailInfo.multiTruck + '&enterpriseName=' + this.orderDetailInfo.enterpriseName
				})
			},
			// 分享到微信好友或者朋友圈
			shareEvent(type) {
				var that = this;
				that.isShare = false;
				var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				console.log(userInfo);
				var token = userInfo.attrs.token;
				let userCode = userInfo.attrs.userCode;
				// 微信好友
				let summary = that.orderDetailInfo.cargoTypeName4;
				if (that.orderDetailInfo.fixPriceFlag == '1') {
					if(that.orderDetailInfo.fixPrice){
						summary = summary + that.orderDetailInfo.fixPrice / 100 + '元/' + that.orderDetailInfo.orderChild.orderQuoteVO.quotePriceTypeName
					}
				} else {
					// summary = summary + '按' + that.orderQuoteVO.quotePriceTypeName + '询价'
					summary = summary + ', 价格电议'
				}
				var api = '';
				var shareUrl = ""
				if(utils.ApiRootUrl.indexOf('test')>-1){
					api = 'test'
					shareUrl = "http://m-test.hyzgapp.com/#/share?sid="
				} else {
					api = 'pord'
					shareUrl = "http://m-test.hyzgapp.com/#/share?sid="
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
						let randomNum = Math.floor(Math.random() * 4);
						uni.share({
							provider: "weixin",
							scene: type,
							type: 5,
							miniProgram: {
								id: 'gh_f79ffe0e2b3e',
								path: '/pages/index/index/index?shareType=appGoods&' + 'orderSid=' + that.sid + '&userId=' + userInfo.userId,
								type: 0, // 0-正式版； 1-测试版； 2-体验版
								webUrl: shareUrl + that.sid + "&supply=" + supply +"&multiTruck=" + that.orderDetailInfo.multiTruck + "&token=" + token + '&api=' + api + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode,
							},
							imageUrl: that.shareImgBc[randomNum],
							title: that.shareTitle,
							// type: 0,
							// href: shareUrl + that.sid + "&supply=" + supply +"&multiTruck=" + that.orderDetailInfo.multiTruck + "&token=" + token + '&api=' + api + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode, //
							// title: "从  "+ that.showAddressMsg(that.orderDetailInfo.orderChild.orderAddressVOS[0], 'area') + '  到  ' + that.showAddressMsg(that.orderDetailInfo.orderChild.orderAddressVOS[that.orderDetailInfo.orderChild.orderAddressVOS.length - 1], 'area'),
							// summary: summary,
							// imageUrl: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/share_image.png",
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
			showShareTitle() {
				let startAddress = this.orderDetailInfo.orderChild.orderAddressVOS[0];
				let endAddress = this.orderDetailInfo.orderChild.orderAddressVOS[this.orderDetailInfo.orderChild.orderAddressVOS.length - 1];
				let carLength = this.showOrderCarLength();
				let carType = this.showOrderCarType();
				let cargoTypeName4 = this.orderDetailInfo.cargoTypeName4;
				this.shareTitle = this.replaceProvince(startAddress.province) + ' 到 ' +  this.replaceProvince(endAddress.province) + ' ' + carLength + ' ' + carType + ' ' + cargoTypeName4;
				this.shareTitle = this.orderDetailInfo.cargoWeight ? this.shareTitle + ' ' + this.orderDetailInfo.cargoWeight + this.showCargoUnit(this.orderDetailInfo.cargoUnit) : this.shareTitle;
				this.shareTitle = this.orderDetailInfo.cargoVolume ? this.shareTitle + ' ' + this.orderDetailInfo.cargoVolume + '方' : this.shareTitle;
				console.log('分享标题', this.shareTitle);
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
			generate() {
				this.isShare = true;
			},
			// 取消分享
			cancelShare() {
				this.isShare = false;
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
			showOrderLoadTime() { // 展示装货时间
				let orderLoadTimeRecordVO = this.orderDetailInfo.orderChild.orderLoadTimeRecordVO;
				if(orderLoadTimeRecordVO && orderLoadTimeRecordVO.length > 0) {
					return orderLoadTimeRecordVO[0].startDt;
				}else {
					return '暂无装货时间';
				}
			}
		}
	}
</script>

<style lang="scss">
	.canvas {
		width: 307px;
		height: 444px;
		position: fixed;
		top: -10000px;
		z-index: -999;
		opacity: 0;
	}
	.orderDetails {
		min-height:100vh;
		background-color: #FAFAFA;
		box-sizing: border-box;
		padding-top: 24rpx;
		padding-bottom: 224rpx;
		.recommendedModel {
			width: 678rpx;
			height: 102rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
			border-radius: 24rpx;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 52rpx 0 46rpx;
			box-sizing: border-box;
			.recommendedTitle {
				font-size: 28rpx;
				font-weight: 600;
				color: #333333;
				line-height: 32rpx;
			}
			.forFreeIcon {
				width: 84rpx;
				height: 84rpx;
				display: block;
				position: absolute;
				z-index: 101;
				left: 6rpx;
				margin-top: -34rpx;
			}
			.recommendedMoreBtn {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				font-weight: 500;
				color: #FC5C06;
				line-height: 32rpx;
				.moreIcon {
					width: 14rpx;
					height: 22rpx;
					display: block;
					margin-left:10rpx;
				}
			}
		}
		.qrCode_content {
			width: 678rpx;
			height: 1100rpx;
			margin: 20rpx auto; 
			background-color: #FFFFFF;
			box-shadow: 0 0 16rpx 0 rgba(172,203,255,0.19);
			border-radius: 24rpx;
			.qrCode-title {
				font-weight: 600;
				color: #333333;
				font-size: 32rpx;
				padding: 24rpx 30rpx;
				box-sizing: border-box;
			}
			.qr-save {
				width: 400rpx;
				height: 80rpx;
				background: #2B72F0;
				border-radius: 16rpx;
				margin: 32rpx auto;
				font-weight: 500;
				color: #FFFFFF;
				font-size: 32rpx;
				text-align: center;
				line-height: 80rpx;
			}
		}
		.qrCode_bg {
			width: 614rpx;
			height: 888rpx;
			margin: 0 auto; 
			background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/qrCode_bg_new.jpg");
			background-size: cover;
			.fleets {
				height: 96rpx;
				text-align: center;
				color: #FC5C06;
				font-size: 16px;
				font-weight: 500;
				padding: 0 22px;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}
			.fleets-content {
			    max-width: 200px;
			    overflow: hidden;
			    text-overflow: ellipsis;
			    white-space: nowrap;
			}
			.fleets-icon {
			    color: #EE6502;
			    font-weight: 400;
			}
			.qr-citys {
				padding: 0 74rpx;
				box-sizing: border-box;
				height: 84rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				.qr-citys-content {
					line-height: 42rpx;
					font-size: 14px;
					color: #000000;
				}
			}
			.qr_arrow_right {
				display: inline-block;
				width: 50rpx;
				height: 18rpx;
				margin: 0 20rpx;
			}
			.qr-lines {
				height: 2rpx;
				margin: 0 56rpx;
				border-bottom: 1px dotted #4073E6;
			}
			.qr-price-row {
				padding: 24rpx 74rpx;
				box-sizing: border-box;
				line-height: 1;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
			}
			.qr-price {
				font-weight: 500;
				color: #FC5C06;
				font-size: 32rpx;
			}
			.qr-tips {
			    padding: 0 74rpx 28rpx;
			    box-sizing: border-box;
			    line-height: 1;
			    display: flex;
			    flex-direction: row;
			    align-items: center;
			    font-weight: 500;
			    color: #FC5C06;
			    font-size: 24rpx;
			}
			.qr-tips-content {
			    overflow: hidden;
			    text-overflow: ellipsis;
			    white-space: nowrap;
			}
			.qr-imgContent {
				width: 260rpx;
				height: 260rpx;
				margin: 48rpx auto 44rpx;
			}
			.qr-img {
				width: 260rpx;
				height: 260rpx;
			}
			.qr-comp {
				min-height: 30rpx;
				font-weight: 500;
				color: #333333;
				font-size: 28rpx;
				margin: 0 74rpx;
				padding-top: 34rpx;
				text-align: center;
			}
			.qr-pushDt {
				color: #666666;
				font-size: 24rpx;
			}
			.qr-text {
				font-weight: 500;
				color: #FC5C06;
				font-size: 24rpx;
				margin: 54rpx 74rpx 0;
				text-align: center;
			}
			
			
		}
		.orderDetailsBox {
			width: 678rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
			border-radius: 24rpx;
			margin: 24rpx auto 0 auto;
			padding: 22rpx 0 24rpx 0;
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
				.callCol {
					flex-shrink: 0;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					line-height: 32rpx;
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
			width: 100vw;
			height: 184rpx;
			background-color: #FFF;
			padding: 24rpx 0 0 0;
			display: flex;
			justify-content: center;
			.btnBox + .btnBox {
				margin-left: 48rpx;
			}
			.btnBox {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 278rpx;
				height: 80rpx;
				border-radius: 16rpx;
				.icon {
					width: 48rpx;
					height: 48rpx;
				}
				.msg {
					font-size: 32rpx;
					font-weight: 500;
					color: #FFFFFF;
					padding-left: 16rpx;
				}
			}
		}
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
	}
	.electron {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		font-size: 32rpx;
		color: #000;
		padding: 24rpx 32rpx 0;
		box-sizing: border-box;
		.icon-right {
			display: flex;
			flex-direction: row;
			align-items: center;
			.icon_black_right {
				width: 32rpx;
				height: 32rpx;
				margin-left: 10rpx;
			}
		}
	}
</style>
