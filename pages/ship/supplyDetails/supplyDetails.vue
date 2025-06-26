<template>
	<view>
	<view class="container" v-if="supplyDetails">
		<view :style="{height: statusBarHeight*2 + 'rpx'}" /> 
		<view class="head1"  :style="{height: '118rpx'}"/>
		<view class="head">
			<view :style="{height: statusBarHeight*2 + 'rpx'}" /> 
			<view class="backContent">
				<image src="../../../static/images/back.png" class="back" @click="back"></image>
				<text class="head-text">货源详情</text>
				<!-- <view @click="generate" class="share-whole">
					分享
				</view> -->
				<view  class="share-whole">
					
				</view>
			</view>
		</view>
		<view class="content">
			<view class="notice">{{supplyDetails.LoadingAndUnloadingMethods}}</view>
			<view class="addrContent">
				<view class="addrIcon">
					<view class="addrIcon-item" :class="{active: index + 1 == newOrderAddressVOS.length}" v-for="(item, index) in newOrderAddressVOS">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/zhuang_icon_round.png" class="start" v-if="item.serialnumber == 1 || item.serialnumber == 2 || item.serialnumber == 5 || item.serialnumber == 6 || item.serialnumber == 7"></image>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/xie_icon_2.png" class="end" v-else></image>
						<view class="dot" v-if="index < newOrderAddressVOS.length - 1">
							<view class="dotted" />
							<view class="dotted" />
							<view class="dotted" />
							<view class="dotted" />
							<view class="dotted" />
						</view>
					</view>
				</view>
				<view class="addrInfo">
					<view class="title" :class="{active: index + 1 == newOrderAddressVOS.length}" v-for="(item, index) in newOrderAddressVOS">
						<view class="addr_and_daohang">
							<view class="addr">
								{{showSendAddress(supplyDetails, item.serialnumber)}}
							</view>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/daohang.png" class="daohang" @click="toGd(item)"></image>
						</view>
					
						<view class="address">
							{{showAddress(item)}}
						</view>
					</view>
					
				</view>
			</view>
			<view class="pub-date">
					发布时间：{{supplyDetails.pushDate}}  {{supplyDetails.pushTime}}
			</view>
			<view class="userInfo">
				<view class="userContent" @click.stop="call(orderContactsVOS, supplyDetails.startSerialnumber)">
					<text>联系人：</text>
					<view class="pr-16 userName">{{supplyDetails.enterpriseName ? supplyDetails.enterpriseName : supplyDetails.goodsUserName}}</view>
				</view>
				<view class="call" @click="call(orderContactsVOS, supplyDetails.startSerialnumber)">
					点击拨号
					<image class="msgIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone1.png"></image>
				</view>
			</view>
			<view class="km-content">
				<view class="km-item">
					<text class="km-text">{{supplyDetails.estimatedDistance || 0}}km</text>
					<view class="flex-row">
						<text class="black">运输里程</text>
					</view>
				</view>
				<view class="seperate"/>
				<view class="km-item">
					<text class="km-text">{{supplyDetails.distance || 0}}km</text>
					<view class="flex-row">
						<text class="black">距装货地</text>
					</view>
					
				</view>
			</view>
		</view>
		<view class="content">	
			<view class="subTitle">
				车货信息
				<view class="copy" @click="copy(supplyDetails.orderNumber)">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/copy.png" class="copy-icon"></image>
					<text class="copy-title">复制</text>
					<text>{{supplyDetails.orderNumber}}</text>
				</view>
			</view>
			<view class="line"></view>
			<view class="item">
				<view class="label">
					车辆
				</view>
				<view class="labelContent">
					<view class="sub">
						{{supplyDetails.orderVehicleLength}} {{supplyDetails.orderVehicleModel}}
					</view>
					<view class="sub pl-10">
						<text>{{supplyDetails.multiTruck}}车</text>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">
					货物
				</view>
				<view class="labelContent">
					<view class="sub">
						<text class="goods">{{supplyDetails.goods}}</text>
						<text v-if="supplyDetails.volume">{{supplyDetails.volume || 0}}方</text>
						<text v-if="supplyDetails.weight">{{supplyDetails.weight || 0}}{{ showCargoUnit(supplyDetails.cargoUnit)}}</text>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">
					装货时间
				</view>
				<view class="labelContent">
					<view class="sub">
						<text style="line-height: 38rpx;">{{supplyDetails.loadDt}}</text>
					</view>
				</view>
			</view>
			<view class="item" v-if="showFleetname()">
				<view class="label">
					所属车队
				</view>
				<view class="labelContent">
					<view class="sub">
						<text class="fleet-text">{{showFleetname()}}</text>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">
					备注
				</view>
				<view class="labelContent">
					<view class="sub">
						<text class="remark-text">{{supplyDetails.hasRemark || "暂无"}}</text>
					</view>
				</view>
			</view>
		
		</view>
		
		<view class="content">
			<view class="subTitle">
				支付信息
			</view>
			<view class="line"></view>
			<view class="item">
				<view class="label">
					运费
				</view>
				<view class="labelContent">
					<view class="sub pay">
						<text v-if="supplyDetails.fixPriceFlag == 2">价格电议</text>
						<text v-if="supplyDetails.fixPriceFlag == 1">
							{{showQuotePrice(supplyDetails.fixPrice)}}元/{{orderQuoteVO.quotePriceTypeName}}
						</text>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">
					订金
				</view>
				<view class="labelContent">
					<view class="sub pay">
						<text v-if="supplyDetails.informationPrice > 0">{{supplyDetails.informationPrice}}元</text>
						<text v-else>无订金</text>
					</view>
					<view class="sub pay" style="margin-left: 20rpx;" v-if="supplyDetails.informationPrice > 0">
						<text>{{supplyDetails.informationFlag == 1 ? '可退' : '不可退'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="qrCode_content" v-if="supplyDetails && supplyDetails.sid">
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
					<text class="qr-price">{{showItemPrice(supplyDetails)}}</text>
					<text class="qr-pushDt">{{showPushDate(supplyDetails.createdDt)}}</text>
				</view>
				<view class="qr-tips">
				  <view class="qr-tips-content">备注：{{ showTips() }}</view>
				</view>
				<view class="qr-imgContent">
					<image :src="canvasUrl" class="qr-img"></image>
				</view>
				<view class="qr-comp">{{supplyDetails.enterpriseName}}</view>
				<view class="qr-text">>>扫一扫二维码，快速接单<<</view>
			</view>
			<view @click="quotePowerSavePhoto" class="qr-save">存至手机</view>
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
		<view class="fix-bottom">
			<view class="phone btn" @click="call(orderContactsVOS, supplyDetails.startSerialnumber)">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone2.png" class="fix-phone-icon"></image>
				电话联系
			</view>
			<view class="price btn" @click="goQuotation">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/fix-icon2.png" class="fix-phone-icon"></image>
				我要接单
			</view>
		</view>
		
			
		
	

		<uni-popup ref="confirmPopup1" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent">
					<view class="text">平台最低保证金为<text class="blue">{{marginPrice}}</text>元，您当前余额为<text
							class="blue">{{allAmountWithIn}}</text>元。请充值后再{{supplyDetails.fixPriceFlag == 1 ? '接单' : '报价'}}。
					</view>
					<view class="tips">
						<view class="subTitle">您充值到平台履约保证金账户的资金将用于：</view>
						<view class="tipItem">1.支付信息费（如有）</view>
						<view class="tipItem">2.支付运费担保金（可选）</view>
						<view class="tipItem">3.支付放空担保金（可选）</view>
						<view class="tipItem">4.支付违约金（如发生）</view>
					</view>
				</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="goCharge()">前往充值</view>
				</view>
			</view>
		</uni-popup>
		<view class="popup-box" v-if="isShare">
			<view class="black-box"></view>
			<view class="popup-content">
				<view class="popup-head">分享到</view>
				<view class="popup-row">
					<view class="popup-child" @click="shareEvent('WXSceneSession')">
						<image class="popup-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/weChat.png"
							mode=""></image>
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
	<uni-popup ref="bandAlert" type="center" :maskClick="false">
		<view class="hintBox verifyHintBox">
			<view class="title">温馨提示</view>
			<view class="alertContent">
				<view class="text">您有已过期的证件，请重新上传！</view>
			</view>
			<view class="bandBtnGroup">
				<view class="cancelBtn" @tap="cancelBand()">取消</view>
				<view class="cancelBtn" @tap="goRecharge()">确定</view>
			</view>
		</view>
	</uni-popup>
	<uni-popup ref="attestationAlert" type="center" :maskClick="false">
		<view class="hintBox attestationHintBox">
			<view class="title1">{{attestationMsg}}</view>
			<view class="alertContent">
				<view class="text">未完成认证，请认证后操作。</view>
			</view>
			<view class="bandBtnGroup1">
				<view class="cancelBtn1" @tap="cancelAttestation()">再看看</view>
				<view class="cancelBtn1" @tap="goAttestation()">去认证</view>
			</view>
		</view>
	</uni-popup>
	</view>
</template>

<script>
	import * as utils from "../../../utils/ship"
	import * as publicData from "@/utils/publicData";
	import * as dateUtil from "@/utils/utils"
	import mosoweCanvas from "../../../components/mosowe-canvas-image/mosowe-canvas-image.vue";
	import { ENV } from "@/utils/baseUrl.js"
	const PemissionModule = uni.requireNativePlugin("PemissionModule");
	export default {
		components: {
			mosoweCanvas: mosoweCanvas
		},
		data() {
			return {
				shopAddress: '',
				arrowImg: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/qr_arrow_right.png',
				canvasW: 0,
				canvasH: 0,
				subTitle: '标题',
				subTitle1: '标题1',
				canvasUrl: '',
				lists: [],
				newOrderAddressVOS: [],
				userId: '',
				statusBarHeight: 0,
				hasNotchInScreen: false,
				supplyDetails: null,
				allAmountWithOut: 0,
				allAmountWithIn: 0,
				marginPrice: 0,
				isShare: false,
				orderSid: "",
				isClose: true,
				imgArr: [],
				shareImgBc: [
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/appShareGoods1.png',
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/appShareGoods2.png',
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/appShareGoods3.png',
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/appShareGoods4.png',
				],
				shareTitle: '',
				attestationMsg:""
			}
		},
		onLoad(options) {
			var that = this;
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight;
			//判断是否是全面屏
			var hasNotchInScreen = plus.navigator.hasNotchInScreen();
			this.hasNotchInScreen = hasNotchInScreen;
			//从我的常跑线路进来的
			var sid = options.sid;
			that.orderSid = options.sid;
			that.orderNumber = options.orderNumber;
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userId = JSON.parse(userInfo).userId;
			}
			var isOpen = this.checkOpenGPSService();
			if (isOpen) {
				uni.getLocation({
					geocode: true,
					type: 'gcj02',
					success: function(res) {
						console.log(res, '定位地址');
						that.longitude = (res.longitude).toFixed(6)
						that.latitude = (res.latitude).toFixed(6)
						that.init(sid);
					},
					fail: function(res) {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
						that.init(sid);
					}
				})
			} else {
				that.longitude = 116.41667
				that.latitude = 39.91667
				that.init(sid);
			}
		
			
			setTimeout(() => {
				if (!that.longitude) {
					that.init(sid);
				}
			}, 1000)
			
			
			//10人随机
			var quoteNum = Math.floor(Math.random()*10+1);
			this.quoteNum = quoteNum;
			var images = [
				"/static/images/ship/avatar/avatar1.png",
				"/static/images/ship/avatar/avatar2.png",
				"/static/images/ship/avatar/avatar3.png",
				"/static/images/ship/avatar/avatar4.png",
				"/static/images/ship/avatar/avatar5.png",
				"/static/images/ship/avatar/avatar6.png",
				"/static/images/ship/avatar/avatar7.png",
				"/static/images/ship/avatar/avatar8.png",
				"/static/images/ship/avatar/avatar9.png",
				"/static/images/ship/avatar/avatar10.png",
				"/static/images/ship/avatar/avatar11.png",
				"/static/images/ship/avatar/avatar12.png",
			];
			var imgArr = [images[quoteNum], images[quoteNum + 1]];
			this.imgArr = imgArr;
		},
		onShow() {
			this.getRestPrice(); //获取钱包余额
			this.getMarginVODriver(); //获取最低保证金
		},
		methods: {
			checkOpenGPSService(){
				//定位权限判断
				let systemType = uni.getSystemInfoSync().platform;
				if(systemType ==='android'){
					var isOpen = PemissionModule.isLocationOpen();
					return isOpen;
					// return true;
				} else {
					return true;
				}
			},
			showCargoUnit(cargoUnit) {
				return dateUtil.showCargoUnit(cargoUnit);
			},
			showFleets() {
				var supplyDetails = this.supplyDetails;
				if (!supplyDetails) return "";
				var fleetSids = supplyDetails.fleetSids;
				if (!fleetSids) {
					fleetSids = "全平台"
				} else {
					if (fleetSids.length > 12) {
						fleetSids = fleetSids.substring(0, 12);
					}
				}
			
				return fleetSids
			},
			showTips() {
				var item = this.supplyDetails;
				var remark = item.hasRemark;
				return remark || "暂无"
			},
			showPushDate(date) {
				var d = date.split(" ")[0];
				var s = d.replace(/-/g, "/");
				return s;
			},
			showItemPrice(item) { // 展示货源价格
				if(item.fixPriceFlag == '1') {
					let fixPrice = item.fixPrice ? Number(item.fixPrice) / 100 : 0;
					return fixPrice + '元/' + item.quotePriceTypeName
				}else {
					return '价格电议';
				}
			},
			showSenderCity() { // 发货地
				var item = this.supplyDetails;
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
				var item = this.supplyDetails;
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
			beginCanvas () {
				console.log("绘制图片", this.$refs.mosoweCanvasComponents);
				this.$refs.mosoweCanvasComponents.createCanvas();
			},
			_canvasImage (e) {
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
			quotePowerSavePhoto() {
				var _this = this;
				dateUtil.savePower(() => {
					_this.saveToPhoto()
				})
			},
			saveToPhoto() {
				//货源二维码保存到手机
				let that = this;
				var orderDetailInfo = this.supplyDetails;
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
					this.ctx.textAlign = "left";
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
				let pushDt = orderDetailInfo.pushDate;
				pushDt = pushDt.replace(/-/g, "/");
				this.ctx.setFillStyle('#666666');
				this.ctx.font = "normal normal 12px PingFang SC";
				
				var leftX = this.canvasW - 108;
				this.ctx.fillText(pushDt, leftX, 134);
				
				//绘制备注
				var remark = this.showTips();
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
				this.ctx.setFillStyle('#EE6502');
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
						},
						fail: (err) => {
							console.log(err)
						}
					}, this);
				})
					
			
			},
			showFleetname() {
				var supplyDetails = this.supplyDetails;
				if (!supplyDetails) return "";
				var fleetSids = supplyDetails.fleetSids;
				if (!fleetSids) return "";
				
				
				return fleetSids || ''
			},
			showPushDtStyle() {
				var pushDt = this.supplyDetails.pushDt;
				var now = new Date();
				pushDt = pushDt.replace(/-/g, "/");
				pushDt = new Date(pushDt);
				var days = dateUtil.getDaysBetween(pushDt, now);
				if (days > 5) {
					return "font-weight: 600;color: red"
				}
				
			},
			cancelBand() {
				this.$refs.bandAlert.close();
				uni.navigateBack({
					delta: 1
				})
			},
			goRecharge() {
				this.$refs.bandAlert.close();
				uni.navigateBack();
				// var userInfo = uni.getStorageSync("userInfo");
				// if (!userInfo) {
				// 	uni.showModal({
				// 		title: '请登录后操作',
				// 		confirmText: '去登录',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				service.loginSelf(1);
				// 			}
				// 		}
				// 	})
				// 	return
				// }
				// var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				// var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				// var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				// var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				// if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 || faceVerify != 1 ) {
				// 	if (identityVerify !== 1 || faceVerify != 1) {
				// 		uni.navigateTo({
				// 			url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
				// 		})
				// 	} else if (driverVerify !== 1) {
				// 		uni.navigateTo({
				// 			url: '../../my/driverVerify/newDriverVerify'
				// 		})
				// 	} else if (vehicleVerify !== 1) {
				// 		uni.navigateTo({
				// 			url: '../../my/carVerify/newCarVerify'
				// 		})
				// 	}
						
					
				// }
			},
			showName(orderContactsVOS, number) {
				var orderAddress = this.supplyDetails.orderAddressVOS;
				var orderState = this.supplyDetails.orderState;
				var findIndex = orderAddress.findIndex(item => {
					return item.serialnumber == number
				})
				if (findIndex > -1) {
					var userName = orderAddress[findIndex].userName;
					if (!userName) {
						findIndex = orderContactsVOS.findIndex(item => {
							return item.serialnumber == number
						})
						
						 if (findIndex > -1) {
							var userName = orderContactsVOS[findIndex].userName;
							return orderState == 2 ? userName : userName.substring(0, 1) + '**' 
						 }
						
					} else {
						return orderState == 2 ? userName : userName.substring(0, 1) + '**' 
					}
					
				}
				
				
				
			},
			call(orderContactsVOS, number) {
				var findIndex = orderContactsVOS.findIndex(item => {
					return item.serialnumber == number
				})
				if (findIndex > -1) {
					var mobile = orderContactsVOS[findIndex].mobile;
					uni.showModal({
						title: '提示',
						content:'将获取您的电话权限以拨打电话',
						success: function(res) {
							if (res.confirm) {
								uni.makePhoneCall({
								    phoneNumber: mobile //仅为示例
								});
								publicData.addBuried("司机搜索货源拨打货主电话")
							}
						}
					})
					
				}
			},
			// 点击分享
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
				var api = '';
        var shareUrl = ""
				if(utils.ApiRootUrl.indexOf('test')>-1){
					api = 'test'
          shareUrl = "http://m-test.hyzgapp.com/#/share?sid="
				} else {
					api = 'pord'
          shareUrl = "http://m-test.hyzgapp.com/#/share?sid="
				}
				// 微信好友
				let summary = that.supplyDetails.goods + ','
				if (that.supplyDetails.volume) {
					summary += that.supplyDetails.volume + '方 '
				}
				if (that.supplyDetails.weight) {
					var cargoUnit = that.showCargoUnit(that.supplyDetails.cargoUnit);
					summary = summary + that.supplyDetails.weight + cargoUnit + ' '
				}
				if(that.supplyDetails.fixPriceFlag == '1'){
					summary = summary + that.showQuotePrice(that.supplyDetails.fixPrice) + '元/' + that.orderQuoteVO
					.quotePriceTypeName
				}else{
					// summary = summary + '按' + that.orderQuoteVO.quotePriceTypeName + '询价'
					summary = summary + ', 询价货源'
				}
				
				var orderAddressVOS = this.supplyDetails.orderAddressVOS;
				
				uni.getLocation({
					geocode: true,
					type: 'gcj02',
					success: function(res) {
						console.log(res, '定位地址');
						var longitude = (res.longitude).toFixed(6)
						var latitude = (res.latitude).toFixed(6)
						console.log("http://m.hyzgapp.com/#/share?sid=" + that.orderSid + "&multiTruck=" + that.supplyDetails.multiTruck + "&token=" + token + '&api=' + api  + '&longitude=' + longitude + '&latitude=' + latitude+ "&userCode=" + userCode )
						let randomNum = Math.floor(Math.random() * 4);
						uni.share({
							provider: "weixin",
							scene: type,
							// type: 0,
							// href: shareUrl + that.orderSid + "&supply=" + that.supplyDetails.supply + "&multiTruck=" + that.supplyDetails.multiTruck + "&token=" + token + '&api=' + api  + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode, //
							// title: that.supplyDetails.startAddr + ' ' + that.supplyDetails.endAddr,
							type: 5,
							miniProgram: {
								id: 'gh_f79ffe0e2b3e',
								path: '/pages/index/index/index?shareType=appGoods&' + 'orderSid=' + that.orderSid + '&userId=' + that.supplyDetails.userId,
								type: 0,
								webUrl: shareUrl + that.orderSid + "&supply=" + that.supplyDetails.supply + "&multiTruck=" + that.supplyDetails.multiTruck + "&token=" + token + '&api=' + api  + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode,
							},
							imageUrl: that.shareImgBc[randomNum],
							title: that.shareTitle,
							// title: "从  "+ that.showAddressMsg(orderAddressVOS[0], 'area') + '  到  ' + that.showAddressMsg(orderAddressVOS[orderAddressVOS.length - 1], 'area'),
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
			showShareTitle(response) {
				console.log('分享标题', response);
				console.log('地址', response.child.orderAddressVOS);
				let startAddress = response.child.orderAddressVOS[0];
				console.log('地址1', startAddress);
				let endAddress = response.child.orderAddressVOS[response.child.orderAddressVOS.length - 1];
				console.log('地址2', endAddress);
				let carLength = this.showOrderCarLength(response);
				let carType = this.showOrderCarType(response);
				let cargoTypeName4 = response.cargoTypeName4;
				this.shareTitle = this.replaceProvince(startAddress.province) + ' 到 ' +  this.replaceProvince(endAddress.province) + ' ' + carLength + ' ' + carType + ' ' + cargoTypeName4;
				this.shareTitle = response.cargoWeight ? this.shareTitle + ' ' + response.cargoWeight + '吨' : this.shareTitle;
				this.shareTitle = response.cargoVolume ? this.shareTitle + ' ' + response.cargoVolume + '方' : this.shareTitle;
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
			showOrderCarLength(response) { // 车长
				let ary = response.child.orderVehicleModelVOS;
				if(ary && ary.length > 0) {
					let msg = '';
					for(let i in ary) {
						msg = msg + ary[i].vehicleModel + '/';
					}
					return msg.substring(0, msg.length -1)
				}
			},
			showOrderCarType(response) { // 车型
				let ary = response.child.orderVehicleLengthVOs;
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
			debounce(func, wait, params) {
				var that = this;
				if (that.timer) clearTimeout(that.timer);
				that.timer = setTimeout(() => {
					func(params)
				}, wait)

			},
			getMarginVODriver() {
				utils.postRequest("/td/driver/home/getMarginVODriver", {
					version: 1
				}).then(res => {
					console.log(res, '最低保证金')
					if (res.retCode == "0000000") {
						this.marginPrice = res.rspBody.margin;
					}
				})
			},
			showSendAddress(item, index) { // 发货地
				
					var provinceName = 'provinceName' + index;
					var provinceCode = 'provinceCode' + index
					var cityName = 'cityName' + index;
					var cityCode = 'cityCode' + index;
					var areaName = 'areaName' + index;
					var areaCode = 'areaCode' + index;
					
					var obj = {
					 province: item[provinceName],
					 provinceCode: item[provinceCode],
					 city: item[cityName],
					 cityCode: item[cityCode],
					 area: item[areaName],
					 areaCode: item[areaCode],
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
			showAddress(obj) { // 展示地址
				let msg = '';
				var address = obj.address || "";
				return address;
			},
			getRestPrice() {
				utils.postRequest("/td/driver/home/getAccountBkDriver", {
					version: 1
				}).then(res => {
					console.log(res, '钱包余额')
					if (res.retCode == "0000000") {
						this.allAmountWithIn = (res.rspBody.allAmountWithIn) / 1000;
						this.allAmountWithOut = (res.rspBody.allAmountWithOut) / 1000;
					}
				})
			},
			showQuotePrice(price) {
				return publicData.showPrice(price, 100);
			},
			showAllPrice(price, info) {
				var allPrice = price - info*100;
				var quotePriceTypeName = this.orderQuoteVO.quotePriceTypeName;
				if (quotePriceTypeName == "趟") {
					return publicData.showPrice(allPrice, 100);
				} else {
					return publicData.showPrice(price, 100);
				}
				
				
			},
			
			async init(sid) {
				console.log('货源的sid', sid)
				var that = this;
				try {
					// that.$refs.bandAlert.open();
					var response = await utils.newQueryPostRequest('/td/circuit/getOrderRecord', {
						sid,
						orderNumber: that.orderNumber
					});
					console.log(response, '详情')
					var supplyDetails = {};
					if (response.retCode == "0000000") {
						var details = response.rspBody;
						that.showShareTitle(response.rspBody);
						supplyDetails = details;
						supplyDetails.needInvoiceFlag = details.needInvoiceFlag;
						var userId = this.userId;
						var platformOrderStatus = 0;
						var platformOrderText = '';
						var cargoSource = details.cargoSource;
						supplyDetails.sid = details.sid;
						supplyDetails.orderDriverBidSid = details.orderDriverBidSid;
						try {
							//报价状态
							var multiTruck = details.multiTruck;
							var orderQuotationStatus = details.orderQuotationStatus;
							this.orderQuotationStatus = orderQuotationStatus;
							var orderSecondState = details.orderSecondState;
							if (multiTruck > 1) {
								if (orderQuotationStatus == 2 || orderQuotationStatus > 4) {
									supplyDetails.orderStateText = '货源有效中'
								} else if (orderQuotationStatus == 1 || orderQuotationStatus == 0) {
									supplyDetails.orderStateText = "已接单"
								}  else  {
									supplyDetails.orderStateText = '货源有效中'
								}
							} else {
								if (orderQuotationStatus == undefined || (orderQuotationStatus == 3 && orderSecondState == 13) ) {
									supplyDetails.orderStateText = details.fixPriceFlag == 1 ? "货源有效中" : "报价中"
								} else if (orderQuotationStatus == 1 || orderQuotationStatus == 0) {
									supplyDetails.orderStateText = details.fixPriceFlag == 1 ? '已接单' : "已报价"
								} else if (orderQuotationStatus == 2 || orderQuotationStatus > 4) {
									supplyDetails.orderStateText = "已成交"
								} else if ( (orderQuotationStatus == 3 && orderSecondState != 13) || orderQuotationStatus == 4) {
									supplyDetails.orderStateText = "货源有效中"
								}
							}
							
							supplyDetails.orderQuotationStatus = orderQuotationStatus;
							
							//货源状态
							supplyDetails.orderSecondState = details.orderSecondState;

							//报价截止时间
							var endData = details.child.orderQuoteVO.quotePriceFinishDt;
							if (endData) {
								endData = endData.replace(/-/g, "/");
								var date1 = new Date(endData);
								var now1 = new Date();
								var nowStr = new Date().getTime();
								var dateStr = date1.getTime();
								var minuteDis = details.child.orderQuoteVO.quotePriceTime;
								var month = date1.getMonth() + 1;
								var nowDay = now1.getDate();
								var day = date1.getDate();
								var hour = date1.getHours();
								var minutes = date1.getMinutes();
								if (hour < 10) {
									hour = '0' + hour
								}

								if (minutes < 10) {
									minutes = '0' + minutes
								}
								console.log(day, nowDay, '当前的天1111');
								if (day != nowDay) {
									month = month < 10 ? '0' + month : month;
									day = day < 10 ? '0' + day : day;
									supplyDetails.quotePriceFinishDt = month + '-' + day + ' ' + hour + ":" + minutes
								} else {
									supplyDetails.quotePriceFinishDt = hour + ":" + minutes
								}
								supplyDetails.minuteDis = minuteDis;
							}

							//装卸地址
							var orderAddressVOS = details.child.orderAddressVOS,
								LoadingAndUnloadingMethods = "",
								loadingMethods = "";
							var startAddr = '',
								endAddr = "",
								unLoadingMethods = "",
								zhuangAddress = "",
								xieAddress = "",
								startSerialnumber = "",
								endSerialnumber = "";
							var startDistance = [], endDistance = [];
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
								that.newOrderAddressVOS = [...snedAddressAry, ...ariverAddressAry];
							}
							orderAddressVOS.forEach(atem => {
								if (atem.serialnumber == 1) {
									if (atem.latitude) {
										startDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										startDistance.push(atem.longitude)
									}
									
									loadingMethods = "一装"
									startSerialnumber = 1
								} else if (atem.serialnumber == 2) {
									loadingMethods = "二装"
								} else if (atem.serialnumber == 5) {
									loadingMethods = "三装"
								} else if (atem.serialnumber == 6) {
									loadingMethods = "四装"
								} else if (atem.serialnumber == 7) {
									loadingMethods = "五装"
								} else if (atem.serialnumber == 4) {
									endSerialnumber = 4
									if (atem.latitude) {
										endDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										endDistance.push(atem.longitude)
									}
								
									unLoadingMethods = "两卸"
								} else if (atem.serialnumber == 3) {
									endSerialnumber = 3
									if (atem.latitude) {
										endDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										endDistance.push(atem.longitude)
									}
		

									unLoadingMethods = "一卸"
								} else if (atem.serialnumber == 8) {
									unLoadingMethods = "三卸"
								} else if (atem.serialnumber == 9) {
									unLoadingMethods = "四卸"
								} else if (atem.serialnumber == 10) {
									unLoadingMethods = "五卸"
								}
							})
							//装卸货地址修改
							var orderAddressVOSLen = orderAddressVOS.length;
							if (orderAddressVOSLen) {
								var start_orderAddressVOS = orderAddressVOS[0];
								var end_orderAddressVOS = orderAddressVOS[orderAddressVOSLen - 1];
								var start_province = start_orderAddressVOS.province;
								var start_city = start_orderAddressVOS.city;
								var start_area = start_orderAddressVOS.area;
								var end_province = end_orderAddressVOS.province;
								var end_city = end_orderAddressVOS.city;
								var end_area = end_orderAddressVOS.area;
								var proText, cityText, areaText, startAddr1, startAddr2, endAddr1, endAddr2;
								if (start_province.indexOf("市") > -1) {
									proText = start_province.slice(0,-1);
									if (start_city.indexOf("区") > -1) {
										cityText = start_city.slice(0,-1)
									} else {
										cityText = start_city
									}
									
									zhuangAddress = start_orderAddressVOS.province + start_orderAddressVOS.city + start_orderAddressVOS.address
								} else {
									if (start_province.indexOf("省") > -1) {
										proText = start_province.slice(0,-1);
									} else {
										proText = start_province
									}
									if (start_city.indexOf("市") > -1) {
										cityText = start_city.slice(0,-1);
									} else {
										cityText = start_city
									}
									if (start_area && start_area.indexOf("区") > -1) {
										areaText = start_area.slice(0,-1)
									} else {
										areaText = start_area
									}
									if (cargoSource == "WX_ZKC") {
										startAddr1 = proText;
										startAddr2 = cityText;
										startAddr = proText + '-' + cityText
									} else {
										startAddr1 = cityText;
										startAddr2 = areaText;
										startAddr = cityText + '-' + areaText
									}
									zhuangAddress = start_orderAddressVOS.province + start_orderAddressVOS.city + start_orderAddressVOS.area + start_orderAddressVOS.address
								}
								if (end_province.indexOf('市') > -1) {
									//直辖市
									
									proText = end_province.slice(0,-1);
									
									if (end_city && end_city.indexOf("区") > -1) {
										cityText = end_city.slice(0,-1)
									} else {
										cityText = end_city
									}
									endAddr1 = proText
									endAddr2 = cityText
									endAddr = proText + '-' + cityText
									xieAddress = end_orderAddressVOS.province + end_orderAddressVOS.city + end_orderAddressVOS.address
									
								} else {
									if (end_province.indexOf("省") > -1) {
										proText = end_province.slice(0,-1);
									} else {
										proText = end_province
									}
									if (end_city && end_city.indexOf("市") > -1) {
										cityText = end_city.slice(0,-1);
									} else {
										cityText = end_city
									}
									if (end_area && end_area.indexOf("区") > -1) {
										areaText = end_area.slice(0,-1)
									} else {
										areaText = end_area
									}
									if (cargoSource == 'WX_ZKC') {
										endAddr1 = proText;
										endAddr2 = cityText;
										endAddr = proText + '-' + cityText
									} else {
										endAddr1 = cityText;
										endAddr2 = areaText;
										endAddr = cityText + '-' + areaText
									}
									xieAddress = end_orderAddressVOS.province + end_orderAddressVOS.city + end_orderAddressVOS.area + end_orderAddressVOS.address
								}
							}
							
							LoadingAndUnloadingMethods = loadingMethods + unLoadingMethods;
							supplyDetails.LoadingAndUnloadingMethods = LoadingAndUnloadingMethods;
							supplyDetails.zhuangAddress = zhuangAddress;
							supplyDetails.xieAddress = xieAddress;
							supplyDetails.startSerialnumber = startSerialnumber;
							supplyDetails.endSerialnumber = endSerialnumber;
							supplyDetails.orderAddressVOS = orderAddressVOS;
							//距离装货点的距离
							//当前位置离装货点的距离
							var distance = 0;
							if (this.latitude) {
								distance = publicData.getFlatternDistance(startDistance[0], startDistance[1], this.latitude, this.longitude);
							} else {
								distance = details.distance ? ((details.distance)/1000).toFixed(0) : 0;
							}
							supplyDetails.distance = Number(distance) || 0;
							
							//货主用户信息
							var orderContactsVOS = details.child.orderContactsVOS;
							var orderState = details.orderState;
							var orderQuoation = details.orderQuoation;
							var goodsUserName = '',
								enterpriseName;
							if (orderContactsVOS) {
								orderContactsVOS.forEach(item => {
									if (item.serialnumber == 1) {
										goodsUserName = item.userName;
									}
								})
							}	
							
							enterpriseName = details.enterpriseName;
							
							this.orderContactsVOS = orderContactsVOS;
							supplyDetails.goodsUserName = goodsUserName;
							supplyDetails.enterpriseName = enterpriseName;
							//货物信息相关
							var goodsTypeVO = details.cargoChild ? details.cargoChild.goodsTypeVO : [],
								goodArr = [];
							var cargoChild = details.cargoChild;
							// if (goodsTypeVO && goodsTypeVO.length > 0) {
							// 	goodsTypeVO.forEach(atem => {
							// 		var firstName = atem.typeName
							// 		if (atem.children) {
							// 			var atem1 = atem.children;
							// 			atem1.forEach(atem01 => {
							// 				var atem2 = atem01.children;
							// 				if (atem2) {
							// 					atem2.forEach(atem02 => {
							// 						var atem3 = atem02.children;
							// 						if (atem3) {
							// 							atem3.forEach(atem03 => {
							// 								var typeName = atem03.typeName;
							// 								var name = firstName + '-' +
							// 									typeName
							// 								goodArr.push(name)
							// 							})
							// 						}
							// 					})
							// 				}
							// 			})
							// 		}
							// 	})
							// }
							
							// var goods = goodArr.join(",");
							var goods = details.cargoTypeName4;
							

							//单位
							var weight = 0;
							var volume = 0;
							//车长
							var cargoChild = details.cargoChild;
							// if (cargoChild) {
							// 	weight = cargoChild.weight;
							// 	volume = cargoChild.volume;
							// }
							weight = details.cargoWeight || 0;
							volume = details.cargoVolume || 0;
							supplyDetails.goods = goods;
							supplyDetails.weight = weight;
							supplyDetails.volume = volume;
							
							//车长
							var vehicleLength1 = details.vehicleLength1;
							var vehicleLength2 = details.vehicleLength2;
							// 展示车长
							let orderVehicleLength = details.vehicleLength1 ? details.vehicleLength1 : '';
							if (vehicleLength1) {
								orderVehicleLength = vehicleLength1 == '-1' ? '不限车长' : orderVehicleLength + '米';
							}
							if (vehicleLength2) {
								orderVehicleLength = orderVehicleLength + '/' + vehicleLength2 + '米';
							}
							
							
							
							
							
							var vehicleModel1 = details.vehicleModel1;
							var vehicleModel2 = details.vehicleModel2;
							var vehicleModelArr = [];
							//判断是否有车型
							if (vehicleModel1) {
								vehicleModelArr.push(vehicleModel1);
							}
							if (vehicleModel2) {
								vehicleModelArr.push(vehicleModel2);
							}
							var orderVehicleModel = vehicleModelArr.join("/");
							supplyDetails.orderVehicleLength = orderVehicleLength;
							supplyDetails.orderVehicleModel = orderVehicleModel;

							//信息费用,默认是分，转化为元
							var orderQuoteVO = details.child.orderQuoteVO;
							var informationPrice = orderQuoteVO.informationPrice / 100;
						
							//图片

							var goodsUrl = details.cargoChild ? details.cargoChild.goodsUrl : '';
							if (goodsUrl) {
								goodsUrl = goodsUrl.split(',')
							}
							supplyDetails.informationPrice = informationPrice;
							
							//订金是否可退还
							var informationFlag = details.informationFlag;
							supplyDetails.informationFlag = informationFlag;
							supplyDetails.goodsUrl = goodsUrl;

							//最早，最晚装卸货时间
							var orderLoadTimeRecordVO = details.child.orderLoadTimeRecordVO;
							var earlyLoadDt = '',
								endLoadDt = "";
							if (orderLoadTimeRecordVO && orderLoadTimeRecordVO.length > 0) {
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
										var type = "", endType = "";
										if (nowDate - startDate == 0) {
											type = "今天"
											earlyLoadDt = hour + ':' + minutes;
										} else if (nowDate - startDate == -1) {
											type = "明天"
											earlyLoadDt = hour + ':' + minutes;
											
										} else if (nowDate - startDate == -2) {
											type = "后天"
											earlyLoadDt = hour + ':' + minutes;
											
										} else {
											earlyLoadDt = item.startDt;
										}
										
										if (nowDate - endDate == 0) {
											endType = "今天"
											endLoadDt = endHour + ':' + endMinutes
										} else if (nowDate - endDate == -1) {
											endType = "明天"
											endLoadDt = endHour + ':' + endMinutes
										} else if (nowDate - endDate == -2) {
											endType = "后天"
											endLoadDt = endHour + ':' + endMinutes
										} else {
											endLoadDt = item.endDt
										}
										// if (type == endType) {
										// 	supplyDetails.loadDt = type + earlyLoadDt + '-' + endLoadDt;
										// } else {
										// 	supplyDetails.loadDt = type + earlyLoadDt + '-' + endType + endLoadDt;
										// }
										supplyDetails.loadDt = type + earlyLoadDt
								
									}
								})
								
							}
							
							//支付方式
							var payType = details.child.orderQuoteVO.payType;
							supplyDetails.payType = payType;
							
							//温控
							supplyDetails.temperature = details.temperature;

							//是否固定价格货源
							supplyDetails.fixPriceFlag = details.fixPriceFlag;
							supplyDetails.fixPrice = details.fixPrice;
							//是否是冷藏
							supplyDetails.orderType = details.orderType;
							//装卸是否禁区
							supplyDetails.forbiddenZoneType = details.forbiddenZoneType;
							//报价的货物单位
							supplyDetails.quotePriceTypeName = details.child.orderQuoteVO.quotePriceTypeName;
							try {
								if (details.fleetSids) {
									var fleetSids = JSON.parse(supplyDetails.fleetSids);
									var fleetSidsArr = [];
									fleetSids.forEach(item => {
										fleetSidsArr.push(item.name)
									})
									supplyDetails.fleetSids = fleetSidsArr.join(";");
								}
							} catch (e) {
								//TODO handle the exception
							}
							//判断是否是车队货源
							supplyDetails.supply = details.supply;

							//判断是否是多车
							supplyDetails.multiTruck = details.multiTruck;
							
							//判断报价单的状态
							supplyDetails.orderQuoation = details.orderQuoation;
							
							var startAddress = details.child.orderAddressVOS[0].address;
							var endAddress = '';
							details.child.orderAddressVOS.map(val => {
								if (!endAddress && val.serialnumber == 3) {
									endAddress = val.address
								}
							})
							var startDt = "";
							var endDt = "";
							var startDt1 = '';
							var endDt1 = '';
							if (orderLoadTimeRecordVO && orderLoadTimeRecordVO.length > 0) {
								startDt = details.child.orderLoadTimeRecordVO[0].startDt;
								endDt = details.child.orderLoadTimeRecordVO[0].endDt;
								console.log(details)
								details.child.orderLoadTimeRecordVO.map(data => {
									if (!startDt1 && data.serialnumber == 3) {
										startDt1 = data.startHours;
										endDt1 = data.endHours;
									}
								})
							}
							
							var receiptType = details.receiptType;
							var fixPrice = details.fixPrice;
							var loadFactor = [];
							//备注
							var remark = details.remark || '';			
							//是否需要回单
							var receiptTypeText = details.receiptType == 1 ? '需要回单' : '不需要回单';
							if (details.child.orderLoadFactorVOS) {
								details.child.orderLoadFactorVOS.map((data, index) => {
									if (data.loadFactorCode == "diyHeight") {
										loadFactor.push("限高" + data.loadFactor + '米')
									} else if  (data.loadFactorCode == "diyLayer") {
										loadFactor.push("堆垛" + data.loadFactor + '层')
									} else if (data.loadFactorCode == "diyOther") {
										loadFactor.push(data.loadFactor)
									} else {
										loadFactor.push(data.loadFactor)
									}
								})
							}
						
							
							loadFactor = loadFactor.join("、");
							
							var hasRemark = [];
							if (remark) {
								hasRemark.push(remark)
							}
							if (loadFactor) {
								hasRemark.push(loadFactor)
							}
							hasRemark.push(receiptTypeText);
							var hasRemarkStr = hasRemark.join(",")
							supplyDetails.hasRemark = hasRemarkStr;
							
							//在途时效
							supplyDetails.estimatedTime = details.estimatedTime;
							//货源发布时间
							var pushDt = details.pushDt;
							pushDt = pushDt.replace(/-/g, "/");

							var mon = new Date(pushDt).getMonth() < 9 ? '0' + (new Date(pushDt).getMonth() + 1) : new Date(pushDt).getMonth() + 1;
							var year = new Date(pushDt).getFullYear();
							var day = new Date(pushDt).getDate() < 10 ? '0' + new Date(pushDt).getDate() : new Date(pushDt).getDate();
							
							var hour = new Date(pushDt).getHours() < 10 ? '0' + new Date(pushDt).getHours() : new Date(
								pushDt).getHours();
							var minute = new Date(pushDt).getMinutes() < 10 ? '0' + new Date(pushDt).getMinutes() :
								new Date(pushDt).getMinutes();
							supplyDetails.pushDate = year + '-' + mon + '-' + day;
							supplyDetails.pushTime = hour + ':' + minute;
							supplyDetails.startAddress = startAddress;
							supplyDetails.endAddress = endAddress;
							supplyDetails.startDt = startDt;
							supplyDetails.endDt = endDt;
							supplyDetails.startDt1 = startDt1;
							supplyDetails.endDt1 = endDt1;
							supplyDetails.receiptType = receiptType;
							supplyDetails.remark = remark;
							supplyDetails.loadFactor = loadFactor;
							console.log(supplyDetails, 'aaa')
							this.supplyDetails = supplyDetails;
							this.orderQuoteVO = orderQuoteVO;
							var content;
							var orderNumber = details.orderNumber;
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
							console.log("微信二维码", that.lists);
							setTimeout(() => {
								that.beginCanvas();//开始绘制二维码
							}, 200)
						} catch (e) {
							//TODO handle the exception
							console.log(e)
						}
					} else {
						this.bandMsg = response.retDesc;
						
						this.$refs.bandAlert.open();
						
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e)
				}

				// console.log('货源详情', this.supplyDetails);
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			goQuotation() {
				//去报价
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								utils.loginSelf(1);
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				var msg = [];
				if (identityVerify !== 1 || driverVerify !== 1 || vehicleVerify !== 1 || faceVerify != 1) {
					if (identityVerify !== 1 || faceVerify != 1) {
						msg.push("身份证")
					}
					if (driverVerify != 1) {
						msg.push("驾驶证")
					}
					if (vehicleVerify != 1) {
						msg.push("行驶证")
					}
					this.attestationMsg = "请认证" + msg.join(',') + '。'
					this.$refs.attestationAlert.open();
					// uni.showModal({
					// 	title: msg,
					// 	content: '未完成认证，请认证后操作。',
					// 	confirmText: '去认证',
					// 	cancelText: '再看看',
					// 	success: function(res) {
					// 		if (res.confirm) {
					// 			if (identityVerify !== 1 || faceVerify != 1) {
					// 				var userCode = JSON.parse(userInfo).attrs.userCode;
					// 				utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
					// 				.then(res=>{
					// 					console.log('用户详细信息', res);
					// 					uni.hideLoading();
					// 					if(res.retCode == "0000000") {
					// 						var idNo = res.rspBody.idNo;
					// 						if (idNo) {
					// 							uni.navigateTo({
					// 								url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
					// 							})
					// 						} else {
					// 							uni.navigateTo({
					// 								url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
					// 							})
					// 						}
											
					// 					}
					// 				})
					// 			} else if (driverVerify !== 1) {
					// 				uni.navigateTo({
					// 					url: '../../my/driverVerify/newDriverVerify'
					// 				})
					// 			} else if (vehicleVerify !== 1) {
					// 				uni.navigateTo({
					// 					url: "../../my/carVerify/newCarVerify?carType=" + "add"
					// 				})
					// 			}

					// 		}
					// 	}
					// })
					return
				}

				var marginPrice = parseFloat(this.marginPrice);
				var allAmountWithIn = parseFloat(this.allAmountWithIn);

				//判断保证金是否满足最低保证金
				if (allAmountWithIn < marginPrice) {
					//保证金判断
					this.$refs.confirmPopup1.open();
					return
				}
				uni.navigateTo({
					url: '../quotedPrice/quotedPrice?quoteDetails=' + JSON.stringify(this.supplyDetails)
				})
			},
			clearQuotation() {
				//取消报价
				var sid = this.supplyDetails.sid;
				var orderDriverBidSid = this.supplyDetails.orderDriverBidSid;
				uni.showModal({
					title: '确定取消吗？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading();
							utils.postRequest("/td/circuit/cancelBidding", {
									orderSid: sid,
									sid: orderDriverBidSid
								})
								.then(res => {
									console.log(res, '取消')
									uni.hideLoading();
									if (res.retCode == "0000000") {
										uni.showToast({
											title: '取消成功',
											icon: 'success'
										})
										uni.navigateBack({
											delta: 1
										})
										uni.$emit("refreshIndex1");
									} else {
										uni.showToast({
											title: res.retDesc,
											icon: 'none'
										})
									}
								})
								.catch(err => {
									uni.hideLoading();
								})
						}
					}
				})
			},
			prevImage(item) {
				//图片预览
				var i = [item];
				uni.previewImage({
					current: 0, //预览图片的下标
					urls: i //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			goCharge() {
				//去充值
				this.$refs.confirmPopup1.close();
				uni.navigateTo({
					url: '../../goodsDelivery/userCenter/userWallet/topUp'
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
			close() {
				this.isClose = false
			},
			goAttestation(){
				var userInfo = uni.getStorageSync("userInfo");
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify !== 1 || faceVerify != 1) {
					var userCode = JSON.parse(userInfo).attrs.userCode;
					utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
					.then(res=>{
						console.log('用户详细信息', res);
						this.$refs.attestationAlert.close()
						if(res.retCode == "0000000") {
							var idNo = res.rspBody.idNo;
							if (idNo) {
								uni.navigateTo({
									url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
								})
							} else {
								uni.navigateTo({
									url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
								})
							}
							
						}
					})
				} else if (driverVerify !== 1) {
					this.$refs.attestationAlert.close()
					uni.navigateTo({
						url: '../../my/driverVerify/newDriverVerify'
					})
				} else if (vehicleVerify !== 1) {
					this.$refs.attestationAlert.close();
					
					uni.navigateTo({
						url: "../../my/carVerify/carList"
					})
				}
			},
			cancelAttestation(){
				this.$refs.attestationAlert.close()
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

<style lang="scss" scoped>
	.statusBar {
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}
	.canvas {
		width: 307px;
		height: 444px;
		position: fixed;
		top: -10000px;
		z-index: -999;
		opacity: 0;
	}
	.pr-48 {
		padding-right: 48rpx;
	}

	.pl-20 {
		padding-left: 20rpx;
	}
	.pr-10 {
		padding-right: 10rpx;
	}
	.pl-10 {
		padding-left: 10rpx;
	}

	.pr-20 {
		padding-right: 20rpx;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	.yellow {
		color: #FF7700;
	}

	.container {
		background-color: #F3F3F3;
		padding-bottom: 200rpx;
		.fix-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			height: 176rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #FFFFFF;
			box-sizing: border-box;
			font-size: 32rpx;
			.btn {
				width: 278rpx;
				height: 80rpx;
				background-color: #0171F9;
				border-radius: 16rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				&.phone {
					background-color: #FC5C06;
					margin-right: 46rpx;
				}
			}
			.fix-phone-icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 12rpx;
			}
		}
	}
	.head {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: 999;
		background-color: #FFFFFF;
		.backContent {
			padding: 0 30rpx;
			height: 88rpx;
			line-height: 88rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFFFFF;
			box-sizing: border-box;
			.head-text {
				color: #333333;
				font-size: 40rpx;
				font-weight: 600;
			}
			.share-whole {
				position: relative;
				color: #333333;
				font-weight: 500;
				font-size: 32rpx;
			}
			.share {
				width: 40rpx;
				height: 42rpx;
			}
			.back {
				width: 25rpx;
				height: 35rpx;
			}
		}
	}
	.content {
		background-color: #FFFFFF;
		margin: 0 36rpx 24rpx;
		display: flex;
		flex-direction: column;
		border-radius: 24rpx;
		padding: 22rpx 0 22rpx 30rpx;
		box-sizing: border-box;
		position: relative;
		.subTitle {
			color: #333;
			font-size: 32rpx;
			font-weight: 600; 
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.copy {
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #000000;
				font-size: 28rpx;
				padding-right: 30rpx;
				box-sizing: border-box;
				font-weight: 400;
				.copy-icon {
					width: 36rpx;
					height: 36rpx;
				}
				.copy-title {
					color: #2B72F0;
					font-size: 24rpx;
					padding-right: 8rpx;
				}
			}
		}
		.line {
			width: calc(100vw - 102rpx);
			margin: 16rpx 0 32rpx 0;
			height: 1rpx;
			background-color: #E7E7E7;
		}
		.notice {
			position: absolute;
			top: 22rpx;
			right: 32rpx;
			z-index: 1;
			font-size: 28rpx;
			color: #333333;
		}
		.addrContent {
			display: flex;
			flex-direction: row;
			.addrIcon {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 40rpx;
				margin-right: 20rpx;
				.addrIcon-item {
					height: 130rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-top: 0;
				}
				.start {
					width: 40rpx;
					height: 44rpx;
				}

				.end {
					width: 40rpx;
					height: 44rpx;
				}

				.dotted {
					width: 6rpx;
					height: 6rpx;
					background-color: #D7D7D7;
					margin: 10rpx 0;
				}
			}

			.addrInfo {
				flex: 1;
				display: flex;
				flex-direction: column;
				.title {
					height: 130rpx;
					padding-top: 6rpx;
					box-sizing: border-box;
				}
				.addr_and_daohang {
					width: 430rpx;
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					padding: 0 32rpx 16rpx 0;
				}
				.addr {
					font-size: 30rpx;
					color: #222222;
					font-weight: 500;
					max-width: calc(100vw - 360rpx);
					box-sizing: border-box;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.address {
					font-size: 26rpx;
					color: #777777;
					line-height: 35rpx;
					padding-right: 40rpx;
					overflow: hidden;
					-webkit-line-clamp: 2;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}
			}
		}
		.pub-date {
			font-weight: bold;
			color: #333;
			font-size: 28rpx;
		}
		.userInfo {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
			color: #333333;
			font-size: 28rpx;
			padding-top: 32rpx;
			box-sizing: border-box;
			font-weight: 500;
			padding-right: 30rpx;
			.userContent {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				color: #333333;
				line-height: 32rpx;
				.userName {
					width: 300rpx;
					line-height: 32rpx;
				} 
			}
			.call {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 36rpx;
				color: #10AB32;
				.msgIcon {
					width: 36rpx;
					height: 36rpx;
					margin-left: 22rpx;
				}
			}
		}
		
		.km-content {
			flex: 1;
			height: 102rpx;
			background-color: #fafafa;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-top: 32rpx;
			margin-right: 30rpx;
			border-radius: 8rpx;
			padding: 10rpx 0;
			box-sizing: border-box;
			.seperate {
				width: 1px;
				height: 63rpx;
				background-color: #CBCBCB;
			}
			.km-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				.flex-row {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: baseline;
				}
				.km-text {
					padding-bottom: 10rpx;
					font-weight: 500;
					color: #000;
				}
				.black {
					color: #666;
					font-weight: bold;
					padding-right: 5rpx;
				}
			}
		}
		
		.item {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			font-size: 28rpx;
			&+.item {
				margin-top: 24rpx;
			}
			.label {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				color: #333333;
				width: 112rpx;
				line-height: 38rpx;
				margin-right: 82rpx;
			}
			.labelContent {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				.remark-text {
					font-weight: 500;
					line-height: 38rpx;

				}
				.fleet-text {
					
					line-height: 38rpx;
					font-weight: 500;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.sub {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					font-weight: 500;
					&.pay {
						color: #FC5C06;
					}
				}
				.goods {
					padding-right: 10rpx;
				}
				.row {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					flex-wrap: wrap;
					.text {
						line-height: 40rpx;

						&:first-child {
							padding-right: 20rpx;
						}
					}
				}

			}

		}
	}

	.pl-20 {
		padding-left: 20rpx;
	}

	.hintBox {
		background: #FFFFFF;
		border-radius: 12rpx;
		margin: 0 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		&.verifyHintBox {
			margin: 0 36rpx;
		}
		&.attestationHintBox{
			margin: 0 80rpx;
			border-radius: 24rpx;
		}
		.title {
			font-size: 30rpx;
			color: #777777;
			text-align: center;
			padding: 32rpx 0;
			font-weight: bold;
		}
		.title1 {
			font-size: 32rpx;
			color: #333333;
			text-align: center;
			padding: 32rpx 0;
			font-weight: bold;
		}

		.alertContent1 {
			flex: 1;
			width: 456rpx;
			padding: 0 114rpx;
			font-size: 32rpx;
			color: rgba(112, 112, 113, 1);

			.text {
				text-align: center;
				height: 92rpx;
				line-height: 40rpx;
			}
		}

		.alertContent {
			padding: 0 62rpx;
			font-size: 28rpx;
			color: rgba(112, 112, 113, 1);
			flex: 1;

			.text {
				display: flex;
				height: 84rpx;
				flex-wrap: wrap;
			}

			.blue {
				color: rgba(74, 162, 243, 1);
			}
		}
		.bandBtnGroup {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 32rpx 46rpx;
			box-sizing: border-box;
			.cancelBtn {
				width: calc(50vw - 50rpx);
				background-color: rgba(74, 162, 243, 1);
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 12rpx;
				&:first-child {
					margin-right: 20rpx;
				}
			}
		}
		.bandBtnGroup1 {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// padding: 0 0 46rpx;
			box-sizing: border-box;
			.cancelBtn1 {
				width: calc(50vw - 50rpx);
				// background-color: rgba(74, 162, 243, 1);
				border-top: 2rpx solid #F1F1F1;;
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				// color: rgba(255, 255, 255, 1);
				color: #000;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: bold;
				&:first-child {
					border-right: 2rpx solid #F1F1F1;;
				}
				&:last-child{
					color: #576B95;
				}
			}
		}
		.confirmBtnGroup {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 46rpx;

			.cancelBtn {
				width: calc(100vw - 120rpx);
				background-color: rgba(74, 162, 243, 1);
				flex: 1;
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 12rpx;
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

	.tips {
		display: flex;
		flex-direction: column;
		padding: 20rpx 0;
		color: #666666;

		.subTitle {
			font-size: 28rpx;
		}

		.tipItem {
			font-size: 26rpx;
			padding-top: 16rpx;
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

	.pr-20 {
		padding-right: 20rpx;
	}
	.name {
		font-size: 30rpx;
		font-weight: bold;
		color: #222222;
		margin-left: 16rpx;
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
			height: 50rpx;
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
	.daohang {
		width: 48rpx;
		height: 48rpx;
		margin-left: 10rpx;
	}
</style>
