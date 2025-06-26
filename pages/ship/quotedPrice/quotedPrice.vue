<template>
	<view class="container" :class="{active: hasNotchInScreen}" :style="{'padding-top': pdTop}" v-if="quoteDetails">
		<common-head :title="headText"></common-head>
		<view class="content">
			<view class="title">
				<view class="titleText">
					<image src="../../../static/images/xunjia-title.png" class="icon-title"></image>
					货源有效中
					<text class="pl-20"></text>
				</view>
			</view>
			<view class="subContent">
				<view class="item">
					<view class="label">
						<text class="text">承运车辆</text>
					</view>
					<view class="subLabel" @click="showSelectCar">
					  	<view>
					  		<text class="text">车辆</text>
					  		<text class="subText">（如需更改请点击选择）</text>
					  	</view>
					  	<view class="extra">
					  		<view v-if="chooseCar" class="vehicleText">{{chooseCar.plateNo}}</view>
							<view v-else class="defaultVehicleText">请选择</view>
					  		<image src="../../../static/images/newRightIcon.png" class="arraw_right"></image>
					  	</view>
					</view> 
					<view class="subLabel" @click="goBankPage" v-if="quoteDetails.needInvoiceFlag == 1" style="margin-top:18rpx;">
					  	<view>
					  		<text class="text">收款人</text>
					  	</view>
					  	<view class="extra">
					  		<view v-if="bankItem" class="vehicleText">{{checkName(bankItem.accountName) + '-' + bankItem.account}}</view>
							<view v-else class="defaultVehicleText">请选择</view>
					  		<image src="../../../static/images/newRightIcon.png" class="arraw_right"></image>
					  	</view>
					</view> 
					
					
				</view>
				<view class="dotted" />
				<!-- <view class="item">
					<view class="label">
						<text class="text">报价</text>
					</view>
					<view class="subLabel">
						<text class="text">订金</text>
						<view class="extra">
							{{(quoteDetails.informationPrice).toFixed(2)}}元
						</view>
					</view>
				</view> -->
			<!-- 	<view class="tips_quote">
					(将在报价后从保证金冻结<text>{{(quoteDetails.informationPrice).toFixed(2)}}</text>元，运单完成后转入货主账户)
				</view> -->
				
			<!-- 	<view class="item" v-if="quoteDetails.fixPriceFlag == 1">
					<view class="subLabel">
						<view>
							<text class="text">固定运费</text>
							<text class="subText02">（净运费=运费-订金）</text>
						</view>
						<view class="extra">
							<text class="text">{{showGdPrice(quoteDetails.fixPrice)}}</text>
							<text class="text1">元/{{quoteDetails.quotePriceTypeName}}</text>
						</view>
					</view>
				</view>
				<view class="total" v-if="quoteDetails.fixPriceFlag == 1">
					<text>净得运费</text>
					<text class="price" v-if="quoteDetails.quotePriceTypeName == '趟'">{{params.netFreightPrice}}</text>
					<text v-if="quoteDetails.quotePriceTypeName == '趟'">元/{{quoteDetails.quotePriceTypeName}}</text>
					<text v-if="quoteDetails.quotePriceTypeName != '趟'" class="price">{{showNodePrice(quoteDetails.informationPrice)}}</text>
				</view> -->
				<view class="dotted" />
				<view class="item" v-if="siqu">
					<view class="label">
						<text class="text">平台保障</text>
						<view class="tips">
							<text class="tipsText">（将在成交后从您的保证金转入平台账户）</text>
						</view>
					</view>
				</view>
				<view class="tipsLabel" @click="setTips(0)" :class="{active: isSetTips}" v-if="siqu">
					<view class="tipsTitle">
						<text>运费担保</text>
						<view class="choosePrice">
							<text>{{platformPrice}}元</text>
							<image src="../../../static/images/select.png" class="selectImg" v-if="!isSetTips"></image>
							<image src="../../../static/images/selected.png" class="selectImg" v-else></image>
						</view>
					</view>
					<view class="labelText">
						在司机无责情况下，货主无故拖延支付司机的运费超
						过10天，或无故克扣支付司机运费，平台将向司机支
						付全额运费或被克扣差额（平台收取运费金额
						<text class="num">{{platformPriceRate}}%</text>的服务费）
					</view>
				</view>
				<view class="tipsLabel" @click="setTips(1)" :class="{active: isSetEmptyTips}" v-if="siqu">
					<view class="tipsTitle">
						<text>放空担保</text>
						<view class="choosePrice">
							<text>{{emptyPrice}}元</text>
							<image src="../../../static/images/select.png" class="selectImg" v-if="!isSetEmptyTips"></image>
							<image src="../../../static/images/selected.png" class="selectImg" v-else></image>
						</view>
					</view>
					<view class="labelText">
						在司机无责情况下，货主无故放空，平台先行赔付，
						最高可赔付1000元。（平台收取<text class="num">{{emptyPrice}}</text>元服务费）
					</view>
				</view>
				<view class="total-bottom" v-if="siqu">
					<text class="totalTitle">支出服务费总计</text>
					<view class="totalSub">
						<text class="sub">{{total}}</text>元
					</view>
				</view>
				
			</view>
		</view>
		<view class="fix-bottom" v-if="quoteDetails.fixPriceFlag  != 0">
			<view class="argeement-box">
				<view class="agreementHint">接单即代表您同意</view>
				<view class="agreementDetails" @tap="agreementDetails">《货物运输协议》</view>
			</view>
			<view class="btn" @click="checkVehicleAndCompany">
				确定接单
			</view>
		</view>
		
		<uni-popup ref="confirmPopup" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent1">
					<view class="text">您钱包余额不足支付订金，请充值后再继续{{quoteDetails.fixPriceFlag  == 1 ? '接单' : '报价'}}</view>
					<view class="tipsAlert">
						<view class="subTitle">您充值到平台履约保证金账户的资金将用于：</view>
						<view class="tipItem">1.支付订金（如有）</view>
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
		<uni-popup ref="confirmPopup1" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent">
					<view class="text">平台最低保证金为<text class="blue">{{marginPrice}}</text>元，您当前余额为<text class="blue">{{allAmountWithIn}}</text>元。请充值后再报价。</view>
					<view class="tipsAlert">
						<view class="subTitle">您充值到平台履约保证金账户的资金将用于：</view>
						<view class="tipItem">1.支付订金（如有）</view>
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
		<uni-popup ref="confirmPopupQuotePrice" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent">
					<view class="text">{{tipsQuotePrice}}</view>
				</view>
				<view class="confirmBtnGroup confirmBtnGroup-price">
					<view class="priceCancelBtn" @tap="cancelQuote()">取消</view>
					<view class="priceConfirmBtn" @tap="confirmQuote()">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="confirmPopupQuotePeople" type="center">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="alertContent">
					<view class="text text1">{{tipsQuotePeople}}</view>
				</view>
				<view class="confirmBtnGroup confirmBtnGroup-price">
					<view class="priceCancelBtn" @tap="lookPeople()">去修改</view>
					<view class="priceConfirmBtn" @tap="confirmQuote()">继续接单</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="selectPopup" type="bottom">
			<view class="selectAlert" v-if="vehicleArr && vehicleArr.length > 0">
				<view class="opt">
					<view class="optCancel" @click="bindCancel">
						取消
					</view>
					<view class="optConfirm" @click="bindConfirm">
						确定
					</view>
				</view>
				<picker-view @change="bindPickerChange" class="picker-view">
				    <picker-view-column>
						<view class="selectItem" v-for="(item,i) in vehicleArr">
							<text class="p-20">{{item.plateNo}}</text>
							<text class="p-20">{{item.ext1}}</text>
							<text class="p-20">{{item.vehicleLength}}</text>
						</view>
					</picker-view-column>
					                 
				</picker-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "../../../utils/ship"
	import CommonHead from "@/components/commonHead"
	import * as publicData from "@/utils/publicData"
	export default {
		components: {
			CommonHead
		},
		data() {
			return {
				tipsQuotePeople: '',
				bankItem: null,
				chooseCar: null,
				headText: '我要报价',
				pdTop: 0,
				platformPrice: 0,
				platformPriceRate: '1',
				emptyPrice: 8.00,
				emptyPriceRate: '8元',
				isSetTips: false,
				isSetEmptyTips: false,
				index: 0,
				vehicleArr: [],
				quoteDetails: null,
				params: {
					vehicleNo: '京A1234',
					informationPrice: '',
					quotePrice: '',
					platformPriceFlag: 0,
					orderSid: '',
					netFreightPrice: '',
					emptyPriceFlag: 0,
					latitude: '',
					longitude: '',
				},
				allAmountWithIn: 0,
				allAmountWithOut: 0,
				marginPrice: 0,
				checkValue: '',
				agreementFlag: false,
				tipsQuotePrice: '',
			}
		},
		onLoad(options) {
			//判断是否是全面屏
			var that = this;
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			var pdTop = statusBarHeight*2 + 100;
			this.pdTop = pdTop + 'rpx';
			var hasNotchInScreen = plus.navigator.hasNotchInScreen();
			this.hasNotchInScreen = hasNotchInScreen;
			console.log(JSON.parse(options.quoteDetails), '报价参数')
			var quoteDetails = JSON.parse(options.quoteDetails);
			this.quoteDetails = quoteDetails;
			if (quoteDetails.fixPriceFlag != 0) {
				this.headText = '我要接单'
			} else {
				this.headText = '我要报价'
			}
			
			if (quoteDetails.fixPriceFlag == 1) {
				this.params.netFreightPrice = (quoteDetails.fixPrice/100 - quoteDetails.informationPrice).toFixed(2)
			}
			this.params.informationPrice = quoteDetails.informationPrice;
			
			this.params.orderSid = quoteDetails.sid;
			console.log(this.quoteDetails);
			//获取当前经纬度
			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					console.log(res, '经纬度')
					that.params.latitude = (res.latitude).toFixed(6);
					that.params.longitude = (res.longitude).toFixed(6);
				}
			})
			//获取车辆
			utils.postRequest("/td/circuit/getVehicleVO", {
				version: 1,
			}).then(res => {
				console.log(res, '车辆11')
				if (res.retCode == "0000000") {
					this.vehicleArr = res.rspBody.items;
					var arr = res.rspBody.items;
					if (res.rspBody.items.length > 0) {
						that.chooseCar = {
							...arr[0]
						}
					}
					
				}
				
			}).catch(err => {
				console.log(err, '获取车辆')
			})
			
			//通过报价计算技术服务费、担保服务费
			var quotePrice = quoteDetails.fixPriceFlag == 1 ? quoteDetails.fixPrice/100 : 0
			utils.postRequest("/td/driver/home/getTechServiceFee", {
				quotePrice: quotePrice*100
			}).then(res => {
				console.log(res, 'aa')
				if (res.retCode == "0000000") {
					var items = res.rspBody.items;
					var emptyPrice = (items[1].emptyPrice/100).toFixed(2)
					this.platformPrice = items[0].platformPrice > 0 ? (items[0].platformPrice/100).toFixed(2) : 0;
					this.emptyPrice = emptyPrice;
					this.platformPriceRate = (items[0].platformPriceRate*100).toFixed(2);
				}
			}).catch(err => {
				console.log(err)
			})
			
			//选择银行卡监听
			uni.$on("chooseBank", item => {
				this.bankItem = item.chooseItem;
				this.bankIndex = item.chooseIndex;
			})
			//获取银行卡列表
			var userRole = uni.getStorageSync("userRole");
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) return;
			var userId = userRole == 1 ? JSON.parse(userInfo).userId : JSON.parse(userInfo).userId;
			utils.postRequest("/md/user-bank/userBankListByUserId", {
				userId: userId
			}).then(res => {
				console.log(res, 'aa')
				if (res.retCode == "0000000") {
					var bankArr = res.rspBody;
					if (bankArr.length > 0) {
						this.bankItem = bankArr[0];
						this.bankIndex = 0;
						
					}
					
				}
			}).catch(err => {
				console.log(err)
			})
			
		},
		onShow() {
			this.getRestPrice(); //获取钱包余额
			this.getMarginVODriver(); //获取最低保证金
		},
		computed: {
			total() {
				var isSetTips = this.isSetTips;
				var isSetEmptyTips = this.isSetEmptyTips;
				var total = 0;
				if (isSetTips) {
					total += parseFloat(this.platformPrice)
				}
				if (isSetEmptyTips) {
					total += parseFloat(this.emptyPrice)
				}
				return total.toFixed(2)
			}
		},
		methods: {
			goBankPage() {
				//进入银行卡选择页面
				var bankItem = this.bankItem;
				var bankIndex = this.bankIndex;
				if (bankItem) {
					uni.navigateTo({
						url: '/pages/my/myBank/bankChoose?bankItem=' + bankItem + '&bankIndex=' + bankIndex
					})
				} else {
					uni.navigateTo({
						url: '/pages/my/myBank/bankChoose'
					})
				}
				
			},
			agreementDetails(){
				this.quoteDetails.plateNo = this.chooseCar.plateNo;
				this.quoteDetails.quotePrice = this.params.quotePrice;
				this.quoteDetails.weightVolume = '';
				if(this.quoteDetails.weight){
					this.quoteDetails.weightVolume = this.quoteDetails.weight + (this.quoteDetails.cargoUnit || '吨')
				}
				if(this.quoteDetails.volume){
					this.quoteDetails.weightVolume = this.quoteDetails.weightVolume + this.quoteDetails.volume + '方'
				}
				if(this.quoteDetails.fixPrice){
					this.quoteDetails.quotePrice = this.showGdPrice(this.quoteDetails.fixPrice)
				}
				uni.navigateTo({
					url: '/pages/allAgreement/agreementItems/index?quoteDetails=' + JSON.stringify(this.quoteDetails)
				})
				// uni.navigateTo({
				// 	url: "/pages/allAgreement/agreementItems/transportAgreement?taskId=" + this.waybillDetails.taskId
				// })
			},
			showSelectCar() {
				this.$refs.selectPopup.open();
			},
			showGdPrice(price) {
				return publicData.showPrice(price, 100);
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
			getRestPrice() {
				utils.postRequest("/td/driver/home/getAccountBkDriver", {
					version: 1
				}).then(res => {
					console.log(res, '钱包余额')
					if (res.retCode == "0000000") {
						this.allAmountWithIn = (res.rspBody.allAmountWithIn)/1000;
						this.allAmountWithOut = (res.rspBody.allAmountWithOut)/1000;
					}
				})
			},
			showNodePrice(price) {
				if (price) {
					price = price.toFixed(2);
					return '单价*承运量-' + price + '元'
				} else {
					return '单价*承运量'
				}
			},
			setTips(index) {
				var isSetTips = this.isSetTips;
				var isSetEmptyTips = this.isSetEmptyTips;
				if (index == 0) {
					this.isSetTips = !isSetTips;
					this.params.platformPriceFlag = this.isSetTips ? 1 : 0;
				} else {
					this.isSetEmptyTips = !isSetEmptyTips
					this.params.emptyPriceFlag = this.isSetEmptyTips ? 1 : 0;
				}
				
				
			},
			bindPickerChange: function(e) {
				
				console.log('picker发送选择改变，携带值为', e)
				var index = e.target.value;
				var vehicleArr = this.vehicleArr;
				this.index = index;
				this.isSelectedCar = vehicleArr[index];
			},
			priceChange(e) {
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
				     if(e.detail.value.length > 6){
				      let num  = Number(e.detail.value.length) - 6;
				      e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				     }else{
				      e.detail.value = parseFloat(e.detail.value);
				     }
				    }else if (e.detail.value.indexOf(".") == 0) {
				     // console.log('首位小数点情况')
				     e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
				     e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				    }else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
				        //去掉最后一位
				     let ary = e.detail.value.split('.');
				     let num = ary['1'].length - 2;
				     e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				    }
				    this.$nextTick(function(){
				     this.params.quotePrice = e.detail.value
				    })

			},
			
			priceInput(e) {
				console.log(e);
				var val = e.detail.value;
				var quoteDetails = this.quoteDetails;
				this.params.quotePrice = val;
				this.params.netFreightPrice = (val - quoteDetails.informationPrice).toFixed(2);
				if (this.params.netFreightPrice <= 0) {
					this.params.quotePrice = "";
					this.params.netFreightPrice = "计算中";
					this.platformPrice = 0;
					this.platformPriceRate = 0;
					if (val > 0) {
						uni.showToast({
							title: '报价金额不能低于订金',
							icon: 'none'
						})
					}
					return;
				}
				//通过报价计算技术服务费、担保服务费
				utils.postRequest("/td/driver/home/getTechServiceFee", {
					quotePrice: val*100
				}).then(res => {
					console.log(res, 'aa')
					if (res.retCode == "0000000") {
						var items = res.rspBody.items;
						var platformPrice = items[0].platformPrice > 0 ? (items[0].platformPrice / 100).toFixed(2) : 0;
						var platformPriceRate = ((items[0].platformPriceRate)*100).toFixed(2);
						var emptyPrice = (items[1].emptyPrice/100).toFixed(2)
						this.platformPrice = platformPrice;
						this.emptyPrice = emptyPrice;
						this.platformPriceRate = platformPriceRate;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			goCharge() {
				//跳转充值界面
				this.$refs.confirmPopup.close();
				this.$refs.confirmPopup1.close();
				uni.navigateTo({
					url: '../../goodsDelivery/userCenter/userWallet/topUp'
				})
			},
			cancelQuote() {
				this.$refs.confirmPopupQuotePrice.close();
			},
			toDriverEdit(msg) {
				var userInfo = uni.getStorageSync("userInfo");
				if (msg.indexOf("身份证") > -1) {
					var userCode = JSON.parse(userInfo).attrs.userCode;
					utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
					.then(res=>{
						console.log('用户详细信息', res);
						uni.hideLoading();
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
				} else if (msg.indexOf("驾驶证") > -1) {
					uni.navigateTo({
						url: "/pages/my/driverVerify/newDriverVerify"
					})
					
				} else if (msg.indexOf("行驶证") > -1) {
					var chooseCar = this.chooseCar;
					uni.navigateTo({
						url: '/pages/my/carVerify/newCarVerify?carInfo=' + JSON.stringify(chooseCar)
					})
				} else if (msg.indexOf("道路") > -1) {
					uni.navigateTo({
						url: '/pages/my/transportVerify/transportVerify'
					})
					
				} else if (msg.indexOf("从业") > -1) {
					uni.navigateTo({
						url: '/pages/my/transportVerify/transportVerify'
					})
				} else if (msg.indexOf("承运") > -1) {
					uni.navigateTo({
						url: '/pages/my/transportVerify/transportVerify'
					})
				}
			},
			checkName(msg) {
				if (!msg) return "";
				if (msg.length < 3) {
					let fontMsg = msg.substring(0,1)
					return fontMsg + '*'
				} 
				
				let fontMsg = msg.substring(0,1) + '*' + msg.substring(msg.length - 1, msg.length)
				return fontMsg;
			},
			confirmQuote() {
				//弹框确认报价
				let that = this;
				this.$refs.confirmPopupQuotePrice && this.$refs.confirmPopupQuotePrice.close();
				this.$refs.confirmPopupQuotePeople && this.$refs.confirmPopupQuotePeople.close();
				var quoteDetails = this.quoteDetails;
				var dataParams = this.dataParams;
				//接单
				console.log(dataParams, '报价参数')
				var platform = uni.getSystemInfoSync().platform;
				var multiTruck = this.quoteDetails.multiTruck;
				var title = '您确定接单吗？';
				if (platform == 'android') {		
					if (!utils.btnRepeat()) {
						return
					}
					uni.showLoading();
					var url;
					var multiTruck = quoteDetails.multiTruck;
					if (multiTruck && multiTruck > 1) {
						url = '/td/circuit/fixbiddingDC'
					} else {
						url = '/td/circuit/fixbidding'
					}
					console.log("撒打算的", dataParams)
					utils.postRequest(url, dataParams)
					.then(res => {
						console.log(res, "接单接口返回")
						uni.hideLoading();
						if (res.retCode == "513") {
							var msg = res.retDesc;
							uni.showModal({
								title: msg,
								cancelText: '取消',
								confirmText: '去认证',
								success: function(res) {
									console.log(res);
									if (res.confirm) {
										//判断身份证
										that.toDriverEdit(msg);
									}
								}
							})
							
							return;
						}
						if (res.retCode == "0000000") {
							uni.showToast({
								title: '接单成功',
								icon: 'success'
							});
							uni.$emit("quoteDid");
							setTimeout(() => {
								uni.navigateTo({
									url: '../waybill/waybill?type=quote'
								})
							}, 1000)
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: "none"
							})
						}
					})
					.catch(err => {
						uni.hideLoading();
					})
				} else {
					uni.showLoading();
					var url;
					var multiTruck = quoteDetails.multiTruck;
					if (multiTruck && multiTruck > 1) {
						url = '/td/circuit/fixbiddingDC'
					} else {
						url = '/td/circuit/fixbidding'
					}
					console.log(url , "撒打算的")
					utils.postRequest(url, dataParams)
					.then(res => {
						console.log(res)
						uni.hideLoading();
						if (res.retCode == "513") {
							var msg = res.retDesc;
							uni.showModal({
								title: msg,
								cancelText: '取消',
								confirmText: '去认证',
								success: function(res) {
									console.log(res);
									if (res.confirm) {
										//判断身份证
										that.toDriverEdit(msg);
									}
								}
							})
							
							return;
						}
						if (res.retCode == "0000000") {
							
							uni.showToast({
								title: '接单成功',
								icon: 'success'
							});
							uni.$emit("quoteDid");
							setTimeout(() => {
								
								if(quoteDetails.confirmType && quoteDetails.confirmType == 1) {
									uni.navigateTo({
										url: '../waybill/waybill?type=quote'
									})
								}else {
									uni.switchTab({
										url: '../index/index1',
									})
								}
							}, 1000)
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: "none"
							})
						}
					})
					.catch(err => {
						console.log(err, '阿萨')
						uni.hideLoading();
					})
				}
			
			},
			checkVehicleAndCompany() {
				var vehicleArr = this.vehicleArr;
				var index = this.index;
				var vehicleNo = "";
				if (vehicleArr.length < 1) {
					uni.showToast({
						title: '请选择车辆',
						icon: 'none'
					})
				} else {
					vehicleNo = vehicleArr[index].plateNo;
				}
				//网络货运判断托运人公司与车辆所属人是否一致
				var needInvoiceFlag = this.quoteDetails.needInvoiceFlag;
				if (needInvoiceFlag == 1) {
					var userInfo = uni.getStorageSync("userInfo");
					var driverId = JSON.parse(userInfo).attrs.driverId;
					utils.postRequest("/yh/vehicle/select/vehicle/detail", {
						driverId: driverId,
						plateNo: vehicleNo
					}).then(res => {
						console.log("判断是否一致", res)
						if (res.retCode == "0000000") {
							var ownerName = res.rspBody.ownerName;
							if (ownerName == this.quoteDetails.enterpriseName) {
								uni.showToast({
									title: '该车辆为货源发布托运公司车辆，不可接单！',
									icon: 'none'
								})
								return;
							}
							this.quoteFixedSend();
						}
					}).catch(err => {
						console.log("判断是否不一致", err)
					})
				} else {
					this.quoteFixedSend();
				}
				
			},
			quoteFixedSend() {
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
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 || faceVerify != 1 ) {
					
					uni.showModal({
						title: '请认证驾驶证，行驶证和身份证',
						content: '未完成认证，请认证后操作。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (identityVerify !== 1 || faceVerify != 1) {
									var userCode = JSON.parse(userInfo).attrs.userCode;
									utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
									.then(res=>{
										console.log('用户详细信息', res);
										uni.hideLoading();
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
									uni.navigateTo({
										url: '../../my/driverVerify/newDriverVerify'
									})
								} else if (vehicleVerify !== 1) {
									var chooseCar = this.chooseCar;
									uni.navigateTo({
										url: '/pages/my/carVerify/newCarVerify?carInfo=' + JSON.stringify(chooseCar)
									})
								}
								
							}
						}
					})
					return
				}
				
				var params = this.params;
				
				var marginPrice = parseFloat(this.marginPrice);
				var allAmountWithIn = parseFloat(this.allAmountWithIn);
				var allAmountWithOut = parseFloat(this.allAmountWithOut);
				var informationPrice = parseFloat(params.informationPrice);
				console.log(allAmountWithIn, allAmountWithOut)
				

				if (marginPrice <= informationPrice) {
					if (allAmountWithIn < informationPrice) {
						//信息费≥钱包金额
						this.$refs.confirmPopup.open();
						return
					}
				} else {
					if (allAmountWithIn < marginPrice) {
						//保证金判断
						this.$refs.confirmPopup1.open();
						return
					}
				}
				
				if (!params.latitude) {
					uni.showToast({
						title: '请先打开定位,再报价',
						icon: 'none'
					})
					return;
				}
				
				var vehicleArr = this.vehicleArr;
				var index = this.index;
				var vehicleNo = "", note = new Object();
				if (vehicleArr.length < 1) {
					uni.showToast({
						title: '请选择车辆',
						icon: 'none'
					})
				} else {
					vehicleNo = vehicleArr[index].plateNo;
					note = {
						ext1: vehicleArr[index].ext1,
						ext2: vehicleArr[index].vehicleLength, 
						ext3: vehicleArr[index].model,
					}
				}
				var quoteDetails = this.quoteDetails;
				var orderVehicleLength = quoteDetails.orderVehicleLength;
				var orderVehicleModel = quoteDetails.orderVehicleModel;
				var ext1 = vehicleArr[index].ext1;
				var vehicleLength = vehicleArr[index].vehicleLength;
				var orderType = quoteDetails.orderType;
				
				var idNo = JSON.parse(userInfo).attrs.idNo;
				var dataParams = {
					vehicleNo: vehicleNo,
					platformPriceFlag: params.platformPriceFlag,
					orderSid: params.orderSid,
					emptyPriceFlag: params.emptyPriceFlag,
					longitude: params.longitude,
					latitude: params.latitude,
					note: note ? JSON.stringify(note) : note,
					idNo: idNo,
				}
				
				
				if (quoteDetails.needInvoiceFlag == 1) {
					//网络货运的必须填写银行卡
					if (!this.bankItem) {
						uni.showToast({
							title: '请选择收款银行卡',
							icon: 'none'
						})
						return;
					}
					dataParams.payeeBankAccount = this.bankItem.account;
					dataParams.payeeBank = this.bankItem.bank;
					dataParams.payeeName = this.bankItem.accountName;
					dataParams.payeeMobile = this.bankItem.mobile;
					dataParams.payeeIdNo = this.bankItem.idNo;
				}
				
				
				this.dataParams = dataParams;
				
				if (quoteDetails.needInvoiceFlag == 1) {
					//判断收款人和司机是否同一人
					if (dataParams.payeeIdNo != idNo) {
						this.tipsQuotePeople = "当前收款人银行卡身份证号与实名认证不一致，请核实?"
						this.$refs.confirmPopupQuotePeople.open();
						return;
					}
				}
				
				if (orderType == 2) {
					//表示是冷藏车
					if (ext1 != '冷藏' && ext1 != '冷藏车') {
						// uni.showToast({
						// 	title: '当前车型不符合货源车型',
						// 	icon: 'none'
						// })
						this.tipsQuotePrice = "当前车型不符合货源车型,您确定接单吗？"
						this.$refs.confirmPopupQuotePrice.open();
						return;
					}
				} else {
					if (orderVehicleModel.indexOf(ext1) < 0) {
						// uni.showToast({
						// 	title: '当前车型不符合货源车型',
						// 	icon: 'none'
						// })
						this.tipsQuotePrice = "当前车型不符合货源车型,您确定接单吗？"
						this.$refs.confirmPopupQuotePrice.open();
						return;
					}
				}
				
				var orderVehicleLengthArr = orderVehicleLength.split("/");
				var findIndex = orderVehicleLengthArr.findIndex(item => {
					return parseFloat(item) <= parseFloat(vehicleLength)
				})
				console.log(orderVehicleLengthArr, vehicleLength)
				if (findIndex < 0) {
					// uni.showToast({
					// 	title: '当前车长不符合货源车型',
					// 	icon: 'none'
					// })
					this.tipsQuotePrice = "当前车长不符合货源车长,您确定接单吗？"
					this.$refs.confirmPopupQuotePrice.open();
					return;
				}
				
				console.log(dataParams, '报价参数')
				var platform = uni.getSystemInfoSync().platform;
				var multiTruck = this.quoteDetails.multiTruck;
				var title = '您确定接单吗？';
				if (platform == 'android') {
					uni.showModal({
						title: title,
						cancelText: '确定',
						confirmText: '取消',
						success: function(res) {
							if (!res.confirm) {
								if (!utils.btnRepeat()) {
									return
								}
								uni.showLoading();
								var url;
								var multiTruck = quoteDetails.multiTruck;
								if (multiTruck && multiTruck > 1) {
									url = '/td/circuit/fixbiddingDC'
								} else {
									url = '/td/circuit/fixbidding'
								}
								console.log("撒打算的", dataParams)
								utils.postRequest(url, dataParams)
								.then(res => {
									uni.hideLoading();
									if (res.retCode == "513") {
										var msg = res.retDesc;
										uni.showModal({
											title: msg,
											cancelText: '取消',
											confirmText: '去认证',
											success: function(res) {
												console.log(res);
												if (res.confirm) {
													//判断身份证
													that.toDriverEdit(msg);
												}
											}
										})
										
										return;
									}
									if (res.retCode == "0000000") {
										uni.showToast({
											title: '接单成功',
											icon: 'success'
										});
										uni.$emit("quoteDid");
										setTimeout(() => {
											if(quoteDetails.confirmType && quoteDetails.confirmType == 1) {
												uni.navigateTo({
													url: '../waybill/waybill?type=quote'
												})
											}else {
												uni.switchTab({
													url: '../index/index1',
												})
											}
										
										}, 1000)
									} else {
										uni.showToast({
											title: res.retDesc,
											icon: "none"
										})
									}
								})
								.catch(err => {
									uni.hideLoading();
								})
							}
						}
					})
				} else {
					
					uni.showModal({
						title: title,
						success: function(res) {
							if (res.confirm) {
								if (!utils.btnRepeat()) {
									return
								}
								uni.showLoading();
								var url;
								var multiTruck = quoteDetails.multiTruck;
								if (multiTruck && multiTruck > 1) {
									url = '/td/circuit/fixbiddingDC'
								} else {
									url = '/td/circuit/fixbidding'
								}
								console.log("撒打算的",dataParams)
								utils.postRequest(url, dataParams)
								.then(res => {
									console.log(res)
									uni.hideLoading();
									if (res.retCode == "513") {
										var msg = res.retDesc;
										uni.showModal({
											title: msg,
											cancelText: '取消',
											confirmText: '去认证',
											success: function(res) {
												console.log(res);
												if (res.confirm) {
													//判断身份证
													that.toDriverEdit(msg);
												}
											}
										})
										
										return;
									}
									if (res.retCode == "0000000") {
										uni.showToast({
											title: '接单成功',
											icon: 'success'
										});
										uni.$emit("quoteDid");
										setTimeout(() => {
											if(quoteDetails.confirmType && quoteDetails.confirmType == 1) {
												uni.navigateTo({
													url: '../waybill/waybill?type=quote'
												})
											}else {
												uni.switchTab({
													url: '../index/index1',
												})
											}
									
										}, 1000)
									} else {
										uni.showToast({
											title: res.retDesc,
											icon: "none"
										})
									}
								})
								.catch(err => {
									console.log(err, '阿萨')
									uni.hideLoading();
								})
							}
						}
					})
				}
			},
			bindConfirm() {
				if (this.vehicleArr.length > 0) {
					if (!this.isSelectedCar) {
						this.index = 0;
						this.chooseCar = {
							...this.vehicleArr[0]
						}
					} else {
						this.chooseCar = {
							...this.isSelectedCar
						}
					}
				}
				this.isSelectedCar = null;
				
				
				this.$refs.selectPopup.close();
			},
			bindCancel() {
				this.$refs.selectPopup.close();
			},
			lookPeople() {
				this.$refs.confirmPopupQuotePeople.close();
				uni.navigateTo({
					url: '/pages/my/myBank/myBankList'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		background-color: #F3F3F3;
		padding: 0 16rpx 168rpx;
		box-sizing: border-box;
		&.active {
			padding-bottom: 250rpx;
		}
		.content {
			background-color: #4AA2F3;
			border-radius: 24rpx 24rpx 12rpx 12rpx;
			overflow: hidden;
			box-shadow: 0 0 18rpx 0 rgba(0, 0, 0, 0.19);
		}
		.bottom {
			font-size: 24rpx;
			color: rgba(119, 119, 119, 1);
			padding: 32rpx 56rpx;
			.bottomItem {
				line-height: 34rpx;
			}
		}
		.argeement-box{
			display: flex;
			align-items: center;
			padding-bottom: 32rpx;
			padding-left: 52rpx;
			.argeement-btn {
				width:32rpx;
				height: 32rpx;
				border-radius:100%;
				border:2rpx solid #C2C2C9;
			}
			.confirmAgreementIcon {
				width:36rpx;
				height: 36rpx;
			}
			.agreementHint {
				padding-left:20rpx;
				font-size: 26rpx;
				color: #707071;
				font-weight:bold;
			}
			.agreementDetails {
				font-size: 26rpx;
				color: #4AA2F3;
				font-weight:bold;
			}
		}
		.fix-bottom {
			position: fixed;
			bottom: 0;
			padding-bottom: 0;  
			padding-bottom: constant(safe-area-inset-bottom);  
			padding-bottom: env(safe-area-inset-bottom);  
			left: 0;
			width: 100vw;
			background-color: #FFFFFF;
			border-radius: 24rpx 24rpx 0 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			height: 186rpx;
			.btn {
				margin-left: 52rpx;
				width: calc(100vw - 104rpx);
				height: 104rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				border-radius: 44rpx;
				background-color: rgba(74, 162, 243, 1);
				box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
			}
		}
		.title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			height: 88rpx;
			padding: 0 24rpx 0 32rpx;
			color: #FFFFFF;
			font-size: 28rpx;
			.titleText {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
			}
			.icon-title {
				width: 26rpx;
				height: 32rpx;
				margin-right: 24rpx;
			}
		}
		.subContent {
			padding: 0 32rpx;
			border-radius: 12rpx 12rpx 0 0;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: column;
			.tipsLabel {
				display: flex;
				flex-direction: column;
				font-size: 24rpx;
				color: #777777;
				line-height: 34rpx;
				margin-bottom: 32rpx;
				border: 2rpx solid #333333;
				border-radius: 12rpx;
				padding: 0 32rpx;
				&.active {
					background-color: rgba(239, 250, 254, 0.95);
					border-color: #4AA2F3;
					.tipsTitle {
						color: #4AA2F3;
					}
				}
				.tipsTitle {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;
					color: #333333;
					padding: 24rpx 0 20rpx;
					.choosePrice {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						.selectImg {
							width: 36rpx;
							height: 36rpx;
							margin-left: 10rpx;
						}
					}
				}
				
				.labelText {
					color: #333333;
					font-size: 24rpx;
					line-height: 34rpx;
					padding-bottom: 32rpx;
					.num {
						color: #4AA2F3;
					}
				}
			}
			.total-bottom  {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-end;
				font-size: 28rpx;
				color: #333333;
				width: calc(100vw - 96rpx);
				padding-bottom: 20rpx;
				.totalTitle {
					line-height: 40rpx;
				}
				.totalSub {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: baseline;
					line-height: 66rpx;
					.sub {
						font-size: 48rpx;
						color: #F29347;
						font-weight: bold;
						padding-right: 10rpx;
					}
				}
			}
			.tipsBootom {
				font-size: 24rpx;
				color: #777777;
				line-height: 34rpx;
			}
			.btnItem {
				border: 1px solid #979797;
				border-radius: 12rpx;
				color: #979797;
				height: 70rpx;
				padding:  0 38rpx;
				display: flex;
				justify-content: center;align-items: center;
				margin-bottom: 24rpx;
				&.active {
					border-color: #4AA2F3;
					color: #4AA2F3;
				}
			}
			.item {
				display: flex;
				flex-direction: column;
				width: calc(100vw - 96rpx);
				.selectItem {
					display: flex;
					flex-direction: row;
					.p-20 {
						padding: 0 20rpx;
					}
				}
				.label {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					padding: 32rpx 0;
					.text {
						font-size: 30rpx;
						color: #333333;
						font-weight: bolder;
					}
					.subText {
						font-size: 24rpx;
						color: #777777;
					}
					.tips {
						font-size: 24rpx;
						color: #777777;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
					}
				}
				.subLabel {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding-bottom: 24rpx;
					.text {
						color: #777777;
						font-size: 28rpx;
						font-weight: bold;
						
					}
					.subText {
						color: #4AA2F3;
						font-size: 24rpx;
					}
					.subText02 {
						color: #777777;
						font-size: 24rpx;
					}
				}
				.extra {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					color: #333333;
					font-size: 26rpx;
					font-weight: 500;
					.defaultVehicleText {
						color: #777777;
					}
					.arraw_right {
						width: 11rpx;
						height: 21rpx;
						margin-left: 10rpx;
					}
					.input_extra {
						text-align: center;
						border: 1px solid #777777;
						border-radius: 12rpx;
						width: 114rpx;
						height: 58rpx;
						margin-right: 14rpx;
					}
					.text {
						font-size: 30rpx;
						color: #333333;
						font-weight: 500;
					}
					.text1 {
						font-size: 26rpx;
						padding-left: 34rpx;
						color: #333333;
						font-weight: 500;
					}
				}
			}
			.dotted {
				height: 0;
				border-bottom: 1px solid #EFEFEF;
			}
		}
	}
	.tips_quote {
		font-size: 24rpx;
		color: #777777;
		padding-bottom: 36rpx;
	}
	.total {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		color: #333333;
		font-size: 28rpx;
		font-weight: bold;
		padding-bottom: 32rpx;
		.price {
			font-size: 48rpx;
			color: #F29347;
			padding: 0 20rpx;
		}
	}
	.hintBox {
		background: #FFFFFF;
		border-radius: 12rpx;
		margin: 0 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.title {
			font-size: 30rpx;
			color: #777777;
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
			.text1 {
				font-size: 32rpx;
			}
			.blue {
				color: rgba(74, 162, 243, 1);
			}
		}
		.confirmBtnGroup {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 46rpx;
			&.confirmBtnGroup-price {
				padding-bottom: 0;
				border-top: 2rpx solid rgba(243, 243, 243, 1);
				flex-direction: row;
				width: calc(100vw - 72rpx);
			}
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
			.priceCancelBtn {
				flex: 1;
				height: 94rpx;
				line-height: 94rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(119, 119, 119, 1);
				text-align: center;
			}
			.priceConfirmBtn {
				flex: 1;
				height: 94rpx;
				line-height: 94rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(1, 113, 249, 1);
				text-align: center;
				border-left: 2rpx solid rgba(243, 243, 243, 1);
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
	.selectAlert {
		height: 500rpx;
		background-color: #FFFFFF;
		.opt {
			height: 100rpx;
			width: 100vw;
			padding: 0 32rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			font-size: 28rpx;
			.optConfirm {
				color: rgba(74, 162, 243, 1);
			}
		}
		.picker-view {
			height: 400rpx;
			padding: 0 32rpx;
			.selectItem {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.p-20 {
					padding: 0 20rpx;
					font-size: 32rpx;
					color:#333;
				}
			}
		}
	}
	.tipsAlert {
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
</style>
