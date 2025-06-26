<template>
	<view>
		<view class="container">

			<view class="contentView">

				<view class="card-box" v-if="orderInfo.orderStatus == 1 && orderInfo.ext1 == 10 && isShow2 == 2 "
					@tap="cardTap">
					<image class="card-img"
						src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/SQcard.png"></image>
					<view class="card-text">上汽联名卡</view>
				</view>

				<image class="imageView" :src="statusImage"></image>
				<view class="reslutView">
					<text>{{statusText}}</text>
					<!-- <span>2020-12-12</span> -->
				</view>
				<view class="infoView" style="margin-top:30rpx;">
					<text>加油站</text>
					<label>{{orderInfo.stationSecondName}}</label>
				</view>
				<view class="infoView">
					<text>车牌号</text>
					<label>{{orderInfo.plateNo}}</label>
				</view>
				<view class="infoView">
					<text>订单号</text>
					<label>{{orderInfo.orderNo}}</label>
				</view>
				<view class="infoView">
					<text>油品型号</text>
					<label>{{orderInfo.fuelName}}</label>
				</view>
				<view class="infoView">
					<text>单价</text>
					<!--      <label wx:if="{{orderInfo.userCouponId > 0}}">{{orderInfo.fuelPrice}}元/{{orderInfo.fuelUnit}}</label>-->
					<!--      <label wx:if="{{orderInfo.userCouponId == 0}}">{{orderInfo.fuelCouponPrice}}元/{{orderInfo.fuelUnit}}</label>-->
					<!-- <label>{{orderInfo.fuelPrice}}元/{{orderInfo.fuelUnit}}</label> -->
					<!-- cardType 2 是油站支付  1车队支付 -->
					<label
						v-if="orderInfo.cardType == 2 && orderInfo.fuelSalePrice">{{orderInfo.fuelSalePrice}}元/{{orderInfo.fuelUnit}}</label>
					<label v-else>{{orderInfo.fuelPrice}}元/{{orderInfo.fuelUnit}}</label>
				</view>
				<view class="infoView" v-if="orderInfo.isGroupon > 0">
					<text>拼团后单价</text>
					<label>{{orderInfo.fuelCouponPrice==null?"0":orderInfo.fuelCouponPrice}}元/{{orderInfo.fuelUnit}}</label>
				</view>


				<!-- 加油新逻辑修改 -->
				<view class="infoView">
					<text>订单金额</text>
					<label>{{orderInfo.fuelAmount}}元</label>
				</view>


				<view class="infoView">
					<text>加油量</text>
					<label>{{orderInfo.fuelNum}}{{orderInfo.fuelUnit}}</label>
				</view>
				<view class="infoView" v-if="orderInfo.userCouponId > 0 && orderInfo.fuelCouponPrice">
					<text>优惠后单价</text>
					<label>{{orderInfo.fuelCouponPrice==null?"0":orderInfo.fuelCouponPrice}}元/{{orderInfo.fuelUnit}}</label>
				</view>
				<view class="infoView" v-if="orderInfo.couponAmount">
					<text>优惠金额</text>
					<label>{{orderInfo.couponAmount==null?'0':orderInfo.couponAmount}}元</label>
				</view>
				<!-- <view class="infoView" wx:if="{{orderInfo.userCouponId > 0}}">
      <text>优惠后加油量</text>
      <label>{{orderInfo.fuelCouponNum==null?"0":orderInfo.fuelCouponNum}}升</label>
    </view> -->
				<view class="infoView" v-if="orderInfo.isGroupon > 0">
					<text>拼团后加油量</text>
					<label>{{orderInfo.fuelCouponNum==null?"0":orderInfo.fuelCouponNum}}升</label>
				</view>

				<!-- <view class="infoView" wx:if="{{orderInfo.payType != '9' && orderInfo.stationType != 4}}">
      <text>积分</text>
      <label>+{{orderInfo.userPoints==null?"0":orderInfo.userPoints}}</label>
    </view> -->

				<!-- <view class="infoView">
      <text>交易总金额</text>
      <label>{{orderInfo.fuelAmount}}元</label>
    </view> -->

				<view class="infoView" v-if="orderInfo.payWay == 2">
					<text>油卡支付金额({{orderInfo.cardNo}})</text>
					<label>{{orderInfo.payType != '1'?orderInfo.beforeBalance:orderInfo.fuelCouponAmount?orderInfo.fuelCouponAmount:orderInfo.fuelAmount}}元</label>
				</view>
				<view class="infoView">
					<text>油卡所属公司</text>
					<label>{{orderInfo.compName}}</label>
				</view>
				<view class="infoView" v-if="orderInfo.payWay == 2">
					<text>油卡余额</text>
					<label>{{orderInfo.balance}}元</label>
				</view>

				<!-- <view class="infoView" v-if="orderInfo.couponFlag == 1">
      <text>总优惠金额</text>
      <label>{{orderInfo.couponAmount}}元</label>
    </view> -->
				<!-- <view class="infoView" wx:if="{{orderInfo.couponFlag == 1}}">
      <text>红包优惠金额</text>
      <label>{{redEnvelopeDiscount}}元</label>
    </view>
    <view class="infoView" wx:if="{{orderInfo.couponFlag == 1}}">
      <text>现金优惠金额</text>
      <label>{{cashDiscount}}元</label>
    </view> -->
				<view class="infoView" v-if="orderInfo.couponFlag == 1">
					<text>优惠后单价</text>
					<label>{{orderInfo.fuelCouponPrice}}元/{{orderInfo.fuelUnit}}</label>
				</view>


				<!-- 加油么订单新逻辑  -->
				<view class="infoView">
					<text>实际支付金额</text>
					<label>{{orderInfo.fuelCouponAmount}}元</label>
				</view>


				<!--    <view class="infoView {{orderInfo.payType != '1'?'':'disappear'}}">-->
				<!--      <text>银行卡支付金额</text>-->
				<!--      <label>{{orderInfo.bankPayAmount}}元</label>-->
				<!--    </view>-->
				<!--    <view class="infoView {{orderInfo.payType != '1'?'':'disappear'}}">-->
				<!--      <text>支付银行卡</text>-->
				<!--      <label>{{orderInfo.bankPayAccount}}</label>-->
				<!--    </view>-->
				<!-- <view class="infoView {{orderInfo.payType != '1'?'':disappear'}}">
      <text>备注</text>
      <label>{{orderInfo.stationPayRemark}}</label>
    </view> -->
			</view>
			<view class="tipsView">
				<image src="/static/images/jym/icon_about.png"></image>
				<text>{{btmtext}}</text>
			</view>
			<view class="backBtnView" @tap="clickToBack">返回首页</view>
		</view>

		<view class="bounced-box" v-if="show">
			<view class="black-box" @tap="cancelTap('1')"></view>
			<view class="bounced-content">
				<view class="content-box">
					<view class="contetn-reset">
						<img class="content-img" :src="payImg"></img>
					</view>
				</view>
				<view class="ok-btn" @tap="cancelTap('1')">关闭</view>
			</view>
		</view>

		<view class="bounced-box" v-if="show2">
			<view class="black-box" @tap="cancelTap('2')"></view>
			<view class="bounced-content">
				<view class="content-box" style="padding: 10rpx;">
					<view class="contetn-reset">
						<img class="content-img2"
							src="http://czb-promotion.oss-cn-shanghai.aliyuncs.com/sqhyk.png?Expires=3183164456&OSSAccessKeyId=LTAI4cc06OCAMpOu&Signature=kdMngvrNnMZYxVfYBHiTBNXF1hc%3D&id=0.00008881962437311912"></img>
					</view>

					<view class="payment-box">
						<view class="box1">
							<view>上汽卡号：</view>
							<view>{{cardNumber}}</view>
						</view>
						<view class="box1">
							<view>余额支付：</view>
							<view>{{balancePayment}}元</view>
						</view>
					</view>
				</view>
				<view class="ok-btn ok-btn2" @tap="cancelTap('2')">关闭</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	const api = require("@/config/api.js");
	const util = require("@/utils/jym-utils/util.js");
	var timer = null;
	var timer2 = null;

	export default {
		data() {
			return {
				orderInfo: '',
				oilNum: 0,
				statusImage: '',
				statusText: '',
				flag: "",
				btmtext: "",
				show: false,
				payImg: '',
				preferentialAmount: [],
				redEnvelopeDiscount: 0,
				cashDiscount: 0,
				isShow: false,
				cardNumber: '',
				balancePayment: '',
				show2: false,
				isShow2: 1,
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			console.log(options, "options");
			var that = this;
			let arr = [];
			let temp = JSON.parse(options.map);
			let redEnvelopeDiscount = 0; //红包总计

			let cashDiscount = 0; //现金总计

			if (temp.userCouponsAmount) {
				temp.userCouponsAmount.forEach(item => {
					console.log(item.couponType);

					if (item.couponType == 112) {
						redEnvelopeDiscount += item.amount;
					} else if (item.couponType == 113) {
						cashDiscount += item.amount;
					}
				});
			}

			that.orderInfo = JSON.parse(options.map);
			that.cashDiscount = cashDiscount;
			that.redEnvelopeDiscount = redEnvelopeDiscount;
			// console.log(that.data.preferentialAmount, "preferentialAmount");
			// console.log('nnnnnnnnnnnnnnnnn', options.isInputMoney, JSON.parse(options.map));
			console.log(that.orderInfo)
			if (options.isInputMoney == 1) {
				if (JSON.parse(options.flag) == '0' || JSON.parse(options.flag) == "") {
					this.getRefuelPayInfo(that.orderInfo.orderNo); //当没有返回联名卡图片的时候  轮询调用接口

					timer = setInterval(() => {
						setTimeout(() => {
							console.log('调用联名卡方法,获取联名卡')
							this.getRefuelPayInfo(that.orderInfo.orderNo);
						}, 0);
					}, 3000);
				} else {
					clearInterval(timer);
					uni.hideLoading();
				}
			}

			if (JSON.parse(options.map).orderStatus == '1') {
				that.statusImage = "/static/images/jym/icon_order_success.png";
				that.statusText = '支付成功';
				that.btmtext = "订单油费已经支付到油站账户，请按所选品种和金额完成加油";
			} else if (JSON.parse(options.map).orderStatus == '3') {
				that.statusImage = "/static/images/jym/icon_order_wait.png";
				that.statusText = '支付中';
				that.btmtext = "订单油费正在支付到油站账户，支付成功后请按所选品种和金额完成加油";
			} else {
				that.statusImage = "/static/images/jym/icon_order_fail.png";
				that.statusText = '支付失败';
				that.btmtext = "订单支付失败，请重新支付";
			}

			if (JSON.parse(options.flag) == '0') {
				that.statusImage = "/static/images/jym/icon_order_success.png";
				that.statusText = '支付成功';
				that.btmtext = "订单油费已经支付到油站账户，请按所选品种和金额完成加油";
			}

			if (JSON.parse(options.flag) == '6') {
				that.statusImage = "/static/images/jym/icon_order_wait.png";
				that.statusText = '支付中';
				that.btmtext = "";
			}

			if (JSON.parse(options.flag) == '1') {
				that.statusImage = "/static/images/jym/icon_order_fail.png";
				that.statusText = '支付失败';
				that.btmtext = "订单支付失败，请重新支付";
			}

			if (temp.ext1 && temp.ext1 == '10') {
				console.log('101010')
				that.getUrl(temp.orderNo)
			}
		},
		onBackPress(event) {
			uni.switchTab({
				url: '../../oilstationIndex/oilstationIndex'
			});
			console.log('返回')
			return true;
		},
		onUnload() {
			// wx.switchTab({
			//   url: '../../oilstationIndex/oilstationIndex',
			// })
			clearInterval(timer);
			uni.hideLoading();
		},

		methods: {
			checkCardFlagIsSite: function(flag) {
				if ("CC" == flag) {
					return false;
				} else if ("C2" == flag) {
					return false;
				} else {
					return true;
				}
			},

			getRefuelPayInfo(orderNo) {
				var that = this;
				var parm = {
					orderNo: orderNo
				};
				console.log('发送联名卡请求')
				util.postRequest(api.getRefuelPayInfo, parm).then(res => {
					console.log(res, "联名卡");

					if (res.retCode == "0000000") {
						if (res.rspBody.refuelPayInfo) {
							clearInterval(timer);
							
							uni.showLoading({
								title: '凭证生成中',
							})

							let interNum = 0
							let time = setInterval(() => {
								interNum++
								setTimeout(() => {
									console.log('轮询在')
									that.show = true;
									that.payImg = '';
									
									uni.hideLoading()

									if (interNum >= 1) {
										console.log(interNum, 'interNum')
										clearInterval(time)
										time = null
									}
									
									that.payImg = res.rspBody.refuelPayInfo;
									
								}, 2000)
							}, 2000)



						} else {
							uni.showLoading({
								title: '请稍候...'
							});
						}
					} else {}
				});
			},

			cardTap() {
				this.getUrl(this.orderInfo.orderNo)
			},

			getUrl(orderNo) {
				let params = {
					orderNo: orderNo
				}
				console.log(params)
				util.postRequest(api.getSqUrl, params).then(res => {
						console.log(res, "resgetUrl");
						if (!res.content) {
							console.log('!res.content');
							this.getInterval()
						} else {
							clearInterval(timer2)
							if (res.content) {
								let arr = res.content
								let list = arr.split('=')
								// console.log(list);
								// console.log(list[1].split('&'));
								// console.log(list[2].split('&'));
								let cardNumber = list[1].split('&')
								let balancePayment = list[2].split('&')
								this.show2 = true,
									this.cardNumber = cardNumber[0],
									this.balancePayment = balancePayment[0]
							}
						}
					})
					.catch(err => {
						clearInterval(timer2)
						console.log(err, 'errgetUrl');
					})
			},

			getInterval() {
				timer2 = setTimeout(() => {
					this.getUrl(this.orderInfo.orderNo)
				}, 500)
			},

			clickToBack() {
				uni.switchTab({
					url: '../../oilstationIndex/oilstationIndex'
				});
			},

			cancelTap(index) {
				console.log(index)
				if (index == 1) {
					clearInterval(timer);
					this.show = false;
				} else {
					clearInterval(timer2);
					this.show2 = false;
					this.isShow2 = 2
				}

			}

		}
	};
</script>
<style>
	@import "./addOilResult.css";
</style>
