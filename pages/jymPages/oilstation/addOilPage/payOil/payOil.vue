<template>
	<view :style="{'height': height+'px','position': 'relative'}">
		<view class="topTitle">请选择支付方式</view>
		<view class="content">
			<!-- isInputMoney万金油加油方式   0扫码加油 1是我们的加油流程  -->
			<view v-if="orderInfo.stationType!=5 || orderInfo.isInputMoney==1">
				<view style="display: flex;flex-direction: column">
					<view class="cardContainer"
						:style="'background: ' + (cardInfo.cardType == 3?itemColor4:filter.checkCardFlagIsSite(cardInfo.cardFlag)==false?itemColor3:cardInfo.fuelType==1?itemColor:cardInfo.fuelType==2?itemColor1:itemColor2) + ';'">
						<view class="cellView1" @tap.stop="onTap1" :data-index="bindex"
							:style="'color: ' + (cardInfo.cardType == 3?textColor4:filter.checkCardFlagIsSite(cardInfo.cardFlag)==false?textColor3:cardInfo.fuelType==1?textColor:cardInfo.fuelType==2?textColor1:textColor2) + ';'">
							<view class="cellView1_img" hover-class="none" hover-stop-propagation="false">
								<image
									:style="'height:' + (cardInfo.cardType == 3?'60rpx':filter.checkCardFlagIsSite(cardInfo.cardFlag)==false?'120rpx':cardInfo.fuelType==1?'140rpx':cardInfo.fuelType==2?'130rpx':'130rpx')"
									:src="cardInfo.cardType==3?itemImg4:filter.checkCardFlagIsSite(cardInfo.cardFlag)==false?itemImg3:cardInfo.fuelType==1?itemImg:cardInfo.fuelType==2?itemImg1:itemImg2">
								</image>
							</view>
							<view class="leftView2">
								<view class="leftView_stationName">
									{{filter.checkCardFlagName(cardInfo.cardFlag)}}
								</view>
								<view class="leftView_compSecondName">
									卡号：{{cardInfo.cardNo}}
								</view>
								<view class="leftView_compSecondName" v-if="cardInfo.cardType!=3">
									{{cardInfo.compSecondName}}
								</view>
							</view>
							<view class="rightView2">
								<view class="rightView_view">
									<view class="amount">
										<view style="font-size: 28rpx;">￥</view>
										<view>
											{{filter.Amount(cardInfo.amount)[0]}}
										</view>
										<view style="font-size: 18rpx;">
											.{{filter.Amount(cardInfo.amount)[1]}}
										</view>
									</view>
									<view style="text-align: center;font-size: 24rpx;">
										余额
									</view>
								</view>
							</view>
							<view class="radio_mask"></view>
							<radio :checked="isChecked1" hover-stop-propagation="true"></radio>
						</view>
					</view>
				</view>
				<view class="cardContainerNeed" v-if="needRecharge!=0 && cardInfo.cardType!=3">
					<view class="cardContainerNeedtext">油卡余额不足，请先充值</view>
					<view class="rechargeButton">
						<view>
							至少需要充值：<text>￥{{needRecharge}}</text>
						</view>
						<!-- <view @tap.stop="onTapRecharge">
							去充值
						</view> -->
					</view>
				</view>
			</view>
			<!--  isInputMoney万金油加油方式   0扫码加油 1是我们的加油流程  -->
			<view v-for="(item, index) in carArr" :key="index"
				v-if="orderInfo.stationType==5 && !orderInfo.isInputMoney">
				<view style="display: flex;flex-direction: column">
					<view class="cardContainer"
						:style="'background: ' + (item.cardType == 3?itemColor4:filter.checkCardFlagIsSite(item.cardFlag)==false?itemColor3:item.fuelType==1?itemColor:item.fuelType==2?itemColor1:itemColor2) + ';'">
						<view class="cellView1" :data-num="index" @tap.stop="onTap5" :data-index="bindex"
							:data-cardFlag="item.cardFlag"
							:style="'color: ' + (item.cardType == 3?textColor4:filter.checkCardFlagIsSite(item.cardFlag)==false?textColor3:item.fuelType==1?textColor:item.fuelType==2?textColor1:textColor2) + ';'">
							<view class="cellView1_img" hover-class="none" hover-stop-propagation="false">
								<image
									:style="'height:' + (item.cardType == 3?'60rpx':filter.checkCardFlagIsSite(item.cardFlag)==false?'120rpx':item.fuelType==1?'140rpx':item.fuelType==2?'130rpx':'130rpx')"
									:src="item.cardType==3?itemImg4:filter.checkCardFlagIsSite(item.cardFlag)==false?itemImg3:item.fuelType==1?itemImg:item.fuelType==2?itemImg1:itemImg2">
								</image>
							</view>
							<view class="leftView2">
								<view class="leftView_stationName">
									{{filter.checkCardFlagName(item.cardFlag)}}
								</view>
								<view class="leftView_compSecondName">
									卡号：{{item.cardNo}}
								</view>
								<view class="leftView_compSecondName" v-if="item.cardType!=3">
									{{item.compSecondName}}
								</view>
							</view>
							<view class="rightView2">
								<view class="rightView_view">
									<view class="amount">
										<view style="font-size: 28rpx;">￥</view>
										<view>
											{{filter.Amount(item.amount)[0]}}
										</view>
										<view style="font-size: 18rpx;">
											.{{filter.Amount(item.amount)[1]}}
										</view>
									</view>
									<view style="text-align: center;font-size: 24rpx;">
										余额
									</view>
								</view>
							</view>
							<view class="radio_mask"></view>
							<radio :checked="isCheckedIndex == index" hover-stop-propagation="true"></radio>
						</view>
					</view>
				</view>
				<view class="cardContainerNeed" v-if="item.amount==0 && item.cardType!=3">
					<view class="cardContainerNeedtext">油卡余额不足，请先充值</view>
					<view class="rechargeButton">
						<view>
							至少需要充值：<text>￥{{ orderInfo.fuelAmount - item.amount}}</text>
						</view>
						<!-- <view @tap.stop="onTapRecharge">
							去充值
						</view> -->
					</view>
				</view>
			</view>


			<!-- orderInfo.stationType==1 || orderInfo.stationType == 4 ? false:true -->
			<!--
			<view class="cardContainer" style="background: linear-gradient(90deg, #C1DFC4 0%, #DEECDD 100%);">
				<view class="cardViewBody" @tap.stop="onTap3" data-status="88">
					<view class="cardContainerLeft">
						<image style="width: 100rpx;height: 104rpx;"
							src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_wx.png">
						</image>
					</view>
					<view class="cardContainerRight cardContainerCon" style="justify-content: center">
						<view class="cardContainerRightLine1">
							微信线上支付
						</view>
					</view>
					<view class="radio_mask"></view>
					<radio :checked="isChecked3" hover-stop-propagation="true"></radio>
				</view>
			</view>
			-->
			
			<!-- <view class="cardContainer"
				v-if="orderInfo.stationType==1 || orderInfo.stationType == 4 || orderInfo.stationType == 3 || orderInfo.stationType == 5 || orderInfo.showCard.cardType == 3 ?false:true"
				style="background-color:   #CBEAF2;">
				<view class="cardViewBody" @tap.stop="onTap2">
					<view class="cardContainerLeft">
						<image style="width: 100rpx;height: 104rpx;"
							src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_offline.png">
						</image>
					</view>
					<view class="cardContainerRight cardContainerCon" style="justify-content: center">
						<view class="cardContainerRightLine1">
							线下支付
						</view>
						<view class="cardContainerRightLine1" style="font-size: 20rpx;">
							现金或其他支付方式
						</view>
					</view>
					<view class="radio_mask"></view>
					<radio :checked="isChecked2" hover-stop-propagation="true"></radio>
				</view>
			</view> -->


		</view>
		<button @tap="clickToRefresh" v-if="needRecharge!=0" style="margin: 25rpx">已经充值？点此刷新</button>


		<!-- straightDown为平台直降价格（团油独有） -->
		<button @tap="getPayToken" :disabled="disabled" class="bottomButton"
			v-if="orderInfo.isUseCoupon == true && orderInfo.fuelCouponAmount">确认支付
			￥{{orderInfo.isUseCoupon == true ? (orderInfo.fuelCouponAmount - orderInfo.straightDown).toFixed(2):(orderInfo.fuelAmount-orderInfo.straightDown).toFixed(2)}}</button>

		     <!-- <button v-else @tap="getPayToken" :disabled="disabled" class="bottomButton">确认支付(非团油)
			￥{{(orderInfo.fuelAmount-orderInfo.straightDown).toFixed(2)}}</button> -->
			
			<button v-else @tap="getPayToken" :disabled="disabled" class="bottomButton">确认支付
				￥{{orderInfo.actualPayment}}</button>

		<!-- <button wx:if="{{orderInfo.fuelCouponAmount}}" bindtap="getPayToken" style="" class="bottomButton">确认支付
    ￥{{orderInfo.fuelCouponAmount}}</button>
    <button wx:else  bindtap="getPayToken" style="" class="bottomButton">确认支付
    ￥{{orderInfo.fuelAmount}}</button> -->
		<!-- 这里是选择油卡 -->
		<view class="commodity_screen" @tap="hideModal" v-if="isShowCardModel"></view>
		<view :animation="animationData" class="commodity_attr_box" v-if="isShowCardModel">
			<view class="showViewTitle">
				<image @tap="hideModal" src="/static/images/jym/icon_cancel.png"></image>
				<text>选择油卡</text>
				<image></image>
			</view>
			<scroll-view class="scrollView" scroll-y="true">
				<block v-for="(item, bindex) in cardList" :key="bindex">
					<view class="cardView" @tap="selectCardItem" :data-map="item">
						<view class="cardView1">
							<view class="card">
								<view class="cardType1">
									<image src="https://cargocn.oss-cn-beijing.aliyuncs.com/20200904170819.png"></image>
									<view>
										<text>{{item.userName}}</text>
										<text>{{item.plateNo}}</text>
									</view>
								</view>
								<view class="cardType2">
									{{filter.checkCardFlagName(cardInfo.cardFlag)}}
								</view>
							</view>
							<view class="cardAccountView">
								<view>
									<text>余额</text>
									<label>{{item.amount}}元</label>
								</view>
							</view>
							<view class="line3">
								<view class="numView">
									<view>
										<span>卡号</span>
										<text>{{item.cardNo}}</text>
									</view>
									<!-- <image mode="aspectFit" src="../../../images/icon_bankSelected.png"> </image> -->
								</view>
								<text style="color: white;font-size: 26rpx">{{item.compName}}</text>
							</view>

						</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<!-- 这里是输入支付密码 -->
		<view class="commodity_screen1" @tap="hideModal" v-if="payPwdshowModalStatus"></view>
		<view class="commodity_attr_box1" v-if="payPwdshowModalStatus">
			<view class="showViewTitle1">
				<image @tap="hideModal" src="/static/images/jym/icon_cancel.png"></image>
				<text>输入支付密码</text>
				<image></image>
			</view>
			<view class="scrollView1">
				<view style="padding-left: 60rpx;padding-right: 60rpx">
					<view class="input">
						<view v-for="(item, index) in Length" :key="index" class="input-content">
							<view class="input_circle" v-if="index < Value.length"></view>
						</view>
					</view>
				</view>
				<view class="password_container">
					<view v-for="(item,index) in passwordList" :key="index" class="password_item">
						<template v-if="index == 11">
							<image @click="deletePassword" class="delete_img"
								src="../../../../../static/images/delete.png"></image>
						</template>
						<template v-else>
							<view @click="changePassword(item)" class="number">{{item}}</view>
						</template>

					</view>
				</view>
			</view>
		</view>
		<!-- <view class="commodity_attr_box1" :style="{bottom: -scrollTop + 'px'}" v-if="payPwdshowModalStatus && isIOS">
			<view class="showViewTitle1">
				<image @tap="hideModal" src="/static/images/jym/icon_cancel.png"></image>
				<text>输入支付密码</text>
				<image></image>
			</view>
			<view class="scrollView1" style="margin-top:00rpx;">
				<view class="input" @tap="Tap">
					<view v-for="(item, index) in Length" :key="index" class="input-content">
						<view class="input_circle" v-if="index < Value.length"></view>
					</view>
				</view>
				<input class="hide_input" :password="true" :maxlength="Length" :focus="isFocus" @input="password_input2"
					v-model="Value" @blur="inputBlur" />
			</view>
		</view> -->
	</view>
</template>

<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>

<script>
	const api = require("@/config/api.js");
	const util = require("@/utils/jym-utils/util.js");
	const md5 = require("@/utils/jym-utils/md5.js");
	const app = getApp();
	export default {
		data() {
			return {
				passwordList: [
					1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, 1
				],
				isIOS: false,
				bindex: 0,
				isChecked1: true,
				isChecked2: false,
				isChecked3: false,
				isCheckedIndex: 0,
				cardId: 0,
				orderInfo: {},
				flag: 0,
				driverVerify: "1",
				vehicleVerify: "1",
				hasPayPassword: false,
				focus: false,
				Length: 6,
				//输入框个数
				// isFocus: true,
				isFocus: false,
				//聚焦
				Value: "",
				//输入的内容
				ispassword: true,
				//是否密文显示 true为密文， false为明文。
				payPwdshowModalStatus: false,
				bankInfo: {
					bankNo: '',
					account: '',
					bankCardName: '',
					bank: ''
				},
				bankNo: '',
				bankName: '选择银行卡进行组合支付',
				bankCardId: '',
				isShowCardModel: false,
				cardList: [],
				cardInfo: {},
				wechatCard: {},
				needRecharge: 0,
				isShowRecharge: false,
				payType: 1,
				//支付方式（新加）油卡支付1；电子账户混合支付2；绑定卡混合支付3；微信支付4
				payTypeList: [],
				paytoken: "",
				payTypeId: 120,
				//120油卡，122线下
				itemColor1: "#CEDFFD",
				itemColor: "#F8EABC",
				itemColor3: "#C1D5E9",
				itemColor4: "#81A1CB",
				itemColor2: "#CFE9EB",
				textColor1: "#567BC3",
				textColor: "#EDA137",
				textColor2: "#3CADB9",
				textColor3: "#205B9A",
				textColor4: "#034284",
				itemImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasolineCard.png",
				itemImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_dieselCard.png",
				itemImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasCard.png",
				itemImg3: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_teamCard.png",
				itemImg4: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/platform.png",
				isShowCount: 2,
				stationType: '',
				middleware: 1,
				//中间件判断弹框是否显示
				mapList: {},
				disabled: false,
				carArr: "",
				animationData: "",
				bankshowModalStatus: false,
				height: 0,
				timer: null,
				canSwip: false,
				scrollTop: 0
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			console.log(JSON.parse(options.map), "options");
			console.log(app)
			const that = this;
			if (uni.getSystemInfoSync().platform == 'ios') {
				that.isIOS = true;
			} else {
				that.isIOS = false;
			}
			let model = uni.getSystemInfoSync().platform
			console.log(model, "获取手机型号")
			this.flag = options.group;
			console.log(options);
			setTimeout(() => {
				this.height = uni.getSystemInfoSync().screenHeight
				//  console.log(uni.getSystemInfoSync())
				// console.log(this.height)
			}, 1000)

			uni.getStorage({
				key: 'driverInfo',
				success: function (res) {
					that.hasPayPassword = res.data.attrs.hasPayPassword == 1;
				}
			});

			if (options.group == 1) {
				const map = JSON.parse(options.map);
				console.log(map, "map");
				this.getOilstationDetail(map.opId, map.stationId);
				this.getCardList1(map.opId, map.cardId);
				this.orderInfo = map;
				console.log(this.orderInfo, "orderInfomap");
			} else {
				const map = JSON.parse(options.map); //长连接

				console.log(map, "长连接"); // isInputMoney万金油加油方式   0扫码加油 1是我们的加油流程 

				if (options.map != null && (map.isInputMoney == 1 && map.stationType == 5 || map.stationType != 5)) {
					const temp = map.showCard;
					let tempPrice = 0;

					if (temp.amount < parseFloat(map.fuelAmount)) {
						// const a = app.globalData.newToFixed(parseFloat(map.fuelAmount) - parseFloat(temp.amount), 2);
						const a = app.globalData.newToFixed(parseFloat(map.fuelAmount) - parseFloat(temp.amount), 2);
						tempPrice = parseFloat(a);
					} else {
						tempPrice = 0;
					}

					if (map.isUseCoupon) {
						if (temp.amount < parseFloat(map.fuelCouponAmount)) {
							const a = app.globalData.newToFixed(parseFloat(map.fuelCouponAmount) - parseFloat(temp
								.amount), 2);
							tempPrice = parseFloat(a);
						} else {
							tempPrice = 0;
						}
					} // map.isUseCoupon = true
					
					if(!map.actualPayment) {
						map.actualPayment = map.fuelAmount
					}
						

					console.log(map.payTypeList);
					console.log(temp);
					this.needRecharge = tempPrice;
					this.cardInfo = temp;
					this.orderInfo = map;
					this.payTypeList = map.payTypeList;
					console.log(this.orderInfo, "data.orderInfo");
				} else {
					uni.showModal({
						title: '提示',
						content: '车队卡不支持使用优惠券，请留意订单金额变动!',
						showCancel: false,

						success(res) {
							if (res.confirm) {} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}

					});
					 //判断万金油如果是扫码加油 如果优惠券字段（fuelCouponAmount）有值的话 判断isUseCoupon为true 默认取值fuelCouponAmount 否则取fuelAmount
					// if (map.fuelCouponAmount) {
					//     map.isUseCoupon = true
					//     // map.isUseCoupon = false
					// }
					
					if(!map.actualPayment) {
						map.actualPayment = map.fuelAmount
					}

					this.isChecked1 = false;
					this.orderInfo = map;
					this.mapList = map;
					this.getCardList2("1");
				}
			}
		},
		onPageScroll: function (object) {
			let that = this

			clearTimeout(that.timer) // 每次滚动前 清除一次

			that.canSwip = false;
			that.timer = setTimeout(function () {
				console.log(object)
				that.scrollTop = object.scrollTop;
				console.log('滚动结束了');
				that.canSwip = true;
			}, 200);
		},
		onBackPress(event) {
			let that = this;
			if (event.from === 'navigateBack') {  
                return false;  
            } 
			console.log("油类ID",that.stationType)
			if (that.orderInfo.stationType == 5) {
				uni.switchTab({
					url: '../../oilstationIndex/oilstationIndex'
				});
				console.log('万金油返回')
				return true;
			} else {
				console.log("普通返回")
				uni.navigateBack({
					delta: 1
				});
				return true;
			}

		},
		onShow: function () {
			const that = this;
			const pages = getCurrentPages();
			const currPage = pages[pages.length - 1]; // 当前页

			if (currPage.data != null) {
				if (currPage.data.recharge != "" && parseFloat(currPage.data.recharge) > 0) {
					// const orderInfo = that.data.orderInfo
					// let cardInfo = that.data.cardInfo
					// let tempPrice = 0
					// const newAmount = cardInfo.amount + parseFloat(currPage.data.recharge)
					// if(newAmount < parseFloat(orderInfo.fuelAmount)){
					//   tempPrice = parseFloat((parseFloat(orderInfo.fuelAmount) - newAmount).toFixed(2))
					// }else {
					//   tempPrice = 0
					// }
					// cardInfo.amount = newAmount
					//   that.needRecharge = tempPrice;
					//   that.cardInfo = cardInfo;
					//   that.isShow = true;
					that.getCardList();
				}
			}

			uni.getStorage({
				key: 'driverInfo',
				success: function (res) {
					that.driverVerify = res.data.attrs.driverVerify;
					that.vehicleVerify = res.data.attrs.driverVerify;
				}
			});
		},
		methods: {
			// 删除密码
			deletePassword() {
				let that = this;
				if (!that.Value.length) {
					console.log('密码为空')
					return
				}
				that.Value = that.Value.slice(0, that.Value.length - 1)
				console.log('qweqweqweqweqwe')
			},
			// 变更密码
			changePassword(key) {
				let that = this;
				if (key === "") {
					console.log(key)
					console.log('点击为空')
					return
				}
				if (that.Value.length >= 6) {
					console.log("密码大于6位时")
					return
				}
				that.Value += key.toString()
				console.log('改变密码')
				if (that.Value.length == 6) {
					that.checkPayPwd();
				}
			},
			inputBlur() {
				let that = this;
				console.log('输入框失去焦点')
				// that.isFocus = false;
			},
			onTap1() {
				var that = this; //只有车队卡支付才会转差价（价格才会与微信支付，线下支付不一致）

				if (this.orderInfo.showCard.cardType == 1) {
					that.isChecked1 = true;
					that.isChecked2 = false;
					that.isChecked3 = false;
					that.payTypeId = 120;
					that.middleware = 1;
					
					// //切换后的价格与切换前的价格一致就不弹框
					// var price = 0;

					// if (that.orderInfo.fuelAccuracyNum) {
					// 	price = that.orderInfo.fuelAccuracyNum * that.orderInfo.fuelPrice;
					// } else {
					// 	price = that.orderInfo.fuelNum * that.orderInfo.fuelPrice;
					// } // var price = (that.data.orderInfo.fuelAccuracyNum * that.data.orderInfo.fuelPrice)


					// console.log(price, "price");

					// if (app.globalData.newToFixed(price, 2) == that.orderInfo.fuelAmount) {
					// 	that.orderInfo.fuelAmount = app.globalData.newToFixed(price, 2);
					// 	that.isChecked1 = true;
					// 	that.isChecked2 = false;
					// 	that.isChecked3 = false;
					// 	that.payTypeId = 120;
					// 	that.middleware = 1;
					// 	return;
					// }

					// uni.showModal({
					// 	title: '提示',
					// 	content: '切换支付方式，请留意价格的变动',

					// 	success(res) {
					// 		if (res.confirm) {
					// 			that.orderInfo.fuelAmount = app.globalData.newToFixed(price, 2);
					// 			that.isChecked1 = true;
					// 			that.isChecked2 = false;
					// 			that.isChecked3 = false;
					// 			that.payTypeId = 120;
					// 			that.middleware = 1;
					// 		} else if (res.cancel) {
					// 			console.log('用户点击取消');
					// 			that.isChecked1 = false;
					// 		}
					// 	}

					// });
				} else {
					this.isChecked1 = true;
					this.isChecked2 = false;
					this.isChecked3 = false;
					this.payTypeId = 120;
					this.middleware = 1;
				}
			},

			onTap2() {
				var that = this; //只有车队卡支付才会转差价（价格才会与微信支付，线下支付不一致）

				if (this.orderInfo.stationType != 5 && this.orderInfo.showCard.cardType == 1 && this.middleware != 3 &&
					this.middleware != 2) {
						
					//切换后的价格与切换前的价格一致就不弹框
					var price = that.orderInfo.fuelNum * that.orderInfo.fuelBeforePrice;

					if (app.globalData.newToFixed(price, 2) == that.orderInfo.fuelAmount) {
						that.orderInfo.fuelAmount = app.globalData.newToFixed(price, 2);
						that.isChecked1 = false;
						that.isChecked2 = true;
						that.isChecked3 = false;
						that.payTypeId = 122;
						that.middleware = 2;
						return;
					}

					uni.showModal({
						title: '提示',
						content: '切换支付方式，请留意价格的变动',

						success(res) {
							if (res.confirm) {
								that.orderInfo.fuelAmount = app.globalData.newToFixed(price, 2);
								that.isChecked1 = false;
								that.isChecked2 = true;
								that.isChecked3 = false;
								that.payTypeId = 122;
								that.middleware = 2;
							} else if (res.cancel) {
								console.log('用户点击取消');
								that.isChecked2 = false;
							}
						}

					});
				} else {
					this.isChecked1 = false;
					this.isChecked2 = true;
					this.isChecked3 = false;
					this.payTypeId = 122;
					this.middleware = 2;
					this.isCheckedIndex = -1;
				}
			},

			onTap3(e) {
				console.log(e);
				var that = this; //只有车队卡支付才会转差价（价格才会与微信支付，线下支付不一致）

				if (this.orderInfo.stationType != 5 && this.orderInfo.showCard.cardType == 1 && this.middleware != 2 &&
					this.middleware != 3) {
					console.log("ififif"); //切换后的价格与切换前的价格一致就不弹框
					that.isChecked1 = false;
					that.isChecked2 = false;
					that.isChecked3 = true;
					that.payTypeId = 121;
					that.middleware = 3;
					
					// var price = that.orderInfo.fuelNum * that.orderInfo.fuelBeforePrice;

					// if (app.globalData.newToFixed(price, 2) == that.orderInfo.fuelAmount) {
					// 	that.orderInfo.fuelAmount = app.globalData.newToFixed(price, 2);
					// 	that.isChecked1 = false;
					// 	that.isChecked2 = false;
					// 	that.isChecked3 = true;
					// 	that.payTypeId = 121;
					// 	that.middleware = 3;
					// 	return;
					// }

					// uni.showModal({
					// 	title: '提示',
					// 	content: '切换支付方式，请留意价格的变动',

					// 	success(res) {
					// 		if (res.confirm) {
					// 			that.orderInfo.fuelAmount = app.globalData.newToFixed(price, 2);
					// 			that.isChecked1 = false;
					// 			that.isChecked2 = false;
					// 			that.isChecked3 = true;
					// 			that.payTypeId = 121;
					// 			that.middleware = 3;
					// 		} else if (res.cancel) {
					// 			console.log('用户点击取消');
					// 			that.isChecked3 = false;
					// 		}
					// 	}

					// });
				} else {
					console.log("else");
					this.isChecked1 = false;
					this.isChecked2 = false;
					this.isChecked3 = true;
					this.payTypeId = 121;
					this.middleware = 3;
					this.isCheckedIndex = -1;
					//选择微信支付时候 保持支付金额和平台卡支付金额一样 都是减掉优惠券金额
					this.orderInfo.isUseCoupon = true;
				}
			},

			onTap5(e) {
				console.log(e);
				let that = this;
				console.log(that.orderInfo);
				let orderInfo = that.orderInfo; // let num = e.currentTarget.dataset.num

				let cardflag = e.currentTarget.dataset.cardflag;

				if (cardflag == "PT") {
					orderInfo.isUseCoupon = true;
					that.orderInfo = orderInfo;
					// wx.showModal({
					//     title: '提示',
					//     content: '切换支付方式不使用优惠卷，请留意价格的变动',
					//     showCancel: false,
					//     success(res) {
					//         if (res.confirm) {
					//             orderInfo.isUseCoupon = true
					//             that.orderInfo = orderInfo;
					//         } else if (res.cancel) {
					//             console.log('用户点击取消')
					//         }
					//     }
					// })
				} else {
					orderInfo.isUseCoupon = false;
					that.orderInfo = orderInfo;
					// wx.showModal({
					//     title: '提示',
					//     content: '切换支付方式不使用优惠卷，请留意价格的变动',
					//     showCancel: false,
					//     success(res) {
					//         if (res.confirm) {
					//             orderInfo.isUseCoupon = false
					//             that.orderInfo = orderInfo;
					//         } else if (res.cancel) {
					//             console.log('用户点击取消')
					//         }
					//     }
					// })
				}

				this.isCheckedIndex = e.currentTarget.dataset.num;
				this.isChecked1 = false;
				this.isChecked2 = false;
				this.isChecked3 = false;
				this.payTypeId = 120;
			},

			onTapCard() {
				if (this.isShowCardModel) return;
				this.selectCard();
			},

			onTapRecharge() {
				// Boolean()
				console.log('_______', Boolean(uni.getStorageSync('driverInfo').attrs.driverVerify));

				if (uni.getStorageSync('driverInfo').attrs.driverVerify) {
					var cardInfo;

					if (this.orderInfo.stationType == 5 && this.orderInfo.isInputMoney == 0) {
						cardInfo = this.carArr[this.isCheckedIndex];
					} else {
						cardInfo = this.cardInfo;
					}

					uni.navigateTo({
						url: "../../../my/recharge/rechargeIndex/rechargeIndex?map=" + JSON.stringify(cardInfo) +
							"&isOpenFlag=1"
					});
					this.isShowCount = 2;
				} else {
					uni.showModal({
						title: '温馨提示',
						cancelText: '取消',
						confirmText: '去绑卡',
						content: "您还没绑卡，请先绑卡后再进行充值操作",
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url: "../../../my/bank/bankListPage/bankListPage"
								});
							} else { // wx.navigateBack({
								// 	delta: 0,
								// })
							}
						}
					});
				}
			},

			clickToRefresh() {
				this.getCardList();
			},

			clickToPay() {
				const isChecked1 = this.isChecked1;
				const isChecked2 = this.isChecked2;
				const isChecked3 = this.isChecked3;
				const needRecharge = this.needRecharge;
				const payTypeList = this.payTypeList;
				console.log(payTypeList, this.needRecharge);
				const userCouponId = this.orderInfo.userCouponId; //通过加油页面选择的车队卡或者通过万金油推送的支付选择的车队卡

				if (isChecked1 || this.isCheckedIndex != -1) {
					this.payType = 1;
				}

				if (isChecked2) {
					this.payType = 9;
					this.setToPay();
				}

				if (isChecked3) {
					this.payType = 4;
					this.setToPay2(); // var app = getApp()
					// app.wxOrderPay(11)
				}

				this.getCardList();

				if (isChecked1 && needRecharge > 0 && this.orderInfo.showCard.cardType != 3) {
					uni.showModal({
						title: '提示',
						content: "余额不足，请充值完再支付！",
						showCancel: false
					});
					return;
				} // if (userCouponId > 0 && isChecked1 && !payTypeList.includes(120)) {
				// 	util.showErrorToast("该优惠券暂不支持油卡支付！")
				// 	return
				// }
				// if (userCouponId > 0 && isChecked2 && !payTypeList.includes(122)) {
				// 	util.showErrorToast("该优惠券暂不支持线下支付！")
				// 	return
				// }


				this.showPayPwd();
			},

			checkPay(payTypeList, type) {
				let a = false;

				for (let i = 0; i < payTypeList.length; i++) {
					if (type == payTypeList[i]) {
						a = true;
						break;
					}
				}

				return a;
			},

			getOilstationDetail(userId, stationId) {
				let that = this;
				var parm = {
					id: stationId,
					userId: userId
				};
				uni.showLoading({
					title: '请稍后...'
				});
				util.postRequest(api.oilstationDetail, parm).then(function (res) {
					uni.hideLoading();

					if (res.retCode == '0000000') {
						that.orderInfo.stationType = res.rspBody.stationDetail.stationType;
						console.log(that.stationType);
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				});
			},

			getCardList1: function (id, cardId) {
				const that = this;
				var parma = {
					userId: id,
					stationComCard: 'stationCom'
				};
				util.postRequest(api.driverOilcardList, parma).then(function (res) {
					console.log(res);

					if (res.retCode == '0000000') {
						const temp = res.rspBody;
						let list = {};

						for (let i in temp) {
							if (temp[i].id == cardId) {
								list = temp[i];
							}
						}

						console.log(list);
						let map = that.orderInfo;
						let tempPrice = 0;

						if (list.amount < parseFloat(map.fuelAmount)) {
							const a = app.globalData.newToFixed(parseFloat(map.fuelAmount) - parseFloat(list
								.amount), 2);
							tempPrice = parseFloat(a);
						} else {
							tempPrice = 0;
						}

						that.needRecharge = tempPrice;
						that.cardInfo = list;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				});
			},

			getCardList2(index) {
				const that = this;
				let mapList = that.mapList;
				console.log(that.orderInfo, "orderInfo");
				let data = {
					stationComCard: 'stationCom',
					compId: mapList.stationId
				};
				util.postRequest(api.driverOilcardList, data).then(function (res) {
					console.log(res);

					if (res.retCode == '0000000') {
						var carArr = [];
						res.rspBody.map(item => {
							if (item.cardType == 3 || that.orderInfo.fuelType == item.fuelType) {
								carArr.push(item);
							}
						});
						console.log(carArr, "carArr");

						if (index == 1 && carArr[0].cardFlag == 'PT') {
							// orderInfo.isUseCoupon = true
							that.mapList.isUseCoupon = true;
						} else {
							that.mapList.isUseCoupon = false;
						}

						that.carArr = carArr;
						// that.carArr = res.rspBody;
						that.wechatCard = res.rspBody[0];
						that.orderInfo = mapList;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				});
			},

			// 获取PayToken
			getPayToken() {
				let list = {};
				let that = this;
				that.disabled = true;
				console.log(that.scrollTop)
				setTimeout(function () {
					that.disabled = false;
				}, 5000);
				console.log(this.isChecked3, "isChecked3"); //hasPayPassword  万金油没有设置支付密码

				if (this.isChecked3 == false && uni.getStorageSync('driverInfo').attrs.hasPayPassword == 0) {
					// uni.showModal({
					// 	title: '提示',
					// 	content: '未设置支付密码',
					// 	showCancel: false,

					// 	success(res) {
					// 		if (res.confirm) {
					// 			uni.navigateTo({
					// 				url: '/pages/my/settings/firstSetPassword',
					// 			})
					// 			// uni.navigateTo({
					// 			// 	url: '../../../my/pwdManager/setPayPwd/setPayPwd'
					// 			// });
					// 		} else if (res.cancel) {
					// 			console.log('用户点击取消');
					// 		}
					// 	}

					// });


					uni.showModal({
						title: '提示',
						content: '您尚未创建支付密码，请先创建支付密码再进行加油',
						showCancel: false,
						success: function () {
							console.log('跳转到设置密码')
							uni.navigateTo({
								url: '/pages/my/settings/firstSetPassword',
							})
						}
					})
					return

				}
				console.log(list)
				util.postRequest(api.getPayToken, list).then(function (res) {
					if (res.retCode == '0000000') {
						that.paytoken = res.rspBody;
						that.clickToPay();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				});
				// that.disabled = false;

				console.log(that.disabled);
				uni.removeStorageSync('couponId1');
				uni.removeStorageSync('couponId2');
			},

			getCardList: function () {
				const that = this;
				var stationId = that.orderInfo.stationId;
				var parma = {
					compId: stationId,
					stationComCard: 'stationCom'
				};
				util.postRequest(api.driverOilcardList, parma).then(function (res) {
					console.log(res);

					if (res.retCode == '0000000') {
						const list = res.rspBody;
						const cardInfo = that.cardInfo;
						const orderInfo = that.orderInfo;

						for (let i = 0; i < list.length; i++) {
							if (cardInfo.cardNo == list[i].cardNo) {
								console.log("@@@@@@@" + list[i].amount);
								cardInfo.amount = list[i].amount;
								var tempPrice;

								if (cardInfo.amount < parseFloat(orderInfo.fuelAmount)) {
									const a = app.globalData.newToFixed(parseFloat(orderInfo.fuelAmount) -
										parseFloat(cardInfo.amount), 2);
									tempPrice = parseFloat(a);
								} else {
									tempPrice = 0;
								} // if(orderInfo.isUseCoupon){
								//     tempPrice = orderInfo.fuelCouponAmount
								// }


								if (orderInfo.isUseCoupon) {
									if (cardInfo.amount < parseFloat(orderInfo.fuelCouponAmount)) {
										const a = app.globalData.newToFixed(parseFloat(orderInfo
											.fuelCouponAmount) - parseFloat(cardInfo.amount), 2);
										tempPrice = parseFloat(a);
									} else {
										tempPrice = 0;
									}
								}

								that.needRecharge = tempPrice;
								that.cardInfo = cardInfo;
							}
						}
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				});
			},
			hideModal: function () {
				// 隐藏遮罩层
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: "linear",
					delay: 0
				});
				this.animation = animation;
				animation.translateY(300).step();
				this.animationData = animation.export();
				setTimeout(function () {
					animation.translateY(0).step();
					this.animationData = animation.export();
					this.bankshowModalStatus = false;
					this.payPwdshowModalStatus = false;
					this.isShowCardModel = false;
				}.bind(this), 200);
			},
			selectCard: function () {
				// 显示遮罩层
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: "linear",
					delay: 0
				});
				this.animation = animation;
				animation.translateY(300).step();
				this.animationData = animation.export();
				this.isShowCardModel = true;
				setTimeout(function () {
					animation.translateY(0).step();
					this.animationData = animation.export();
				}.bind(this), 200);
			},
			showPayPwd: function () {
				// 显示遮罩层
				var isChecked3 = this.isChecked3;
				var isChecked2 = this.isChecked2;

				if (isChecked3) {
					return;
				}

				if (isChecked2) {
					return;
				}

				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: "linear",
					delay: 0
				});
				this.animation = animation;
				animation.translateY(0).step();
				this.animationData = animation.export();
				this.payPwdshowModalStatus = true;
				// this.isFocus = true;
				this.Value = '';
				setTimeout(function () {
					animation.translateY(0).step();
					this.animationData = animation.export();
				}.bind(this), 200);
			},
			selectCardItem: function (e) {
				const map = e.currentTarget.dataset.map;
				const orderInfo = this.orderInfo;

				if (map.amount < orderInfo.amount) {
					this.needRecharge = orderInfo.amount - map.amount;
				} else {
					this.needRecharge = 0;
				}

				this.cardInfo = map;
				this.hideModal();
			},
			clickToMixedPay: function () {
				var that = this;

				if (that.hasPayPassword == 1) {
					that.showPayPwd();
				} else {
					uni.navigateTo({
						url: '../../../my/pwdManager/setPayPwd/setPayPwd'
					});
				}
			},
			password_input2: function (e) {
				var that = this;
				console.log(that.Value);
				// var inputValue = e.detail.value;
				// that.Value = inputValue;

				if (that.Value.length == 6) {
					that.checkPayPwd();
				}
			},
			/*下面是密码输入框*/
			password_input: function (e) {
				var that = this; //console.log(e.detail.value);

				var inputValue = e.detail.value;
				that.Value = inputValue;

				if (that.Value.length == 6) {
					that.checkPayPwd();
				}
			},

			Tap() {
				var that = this;
				console.log('输入框获取焦点', that.isFocus)
				// setTimeout(()=> {
				// that.isFocus = true;
				// },10)
				if (that.isFocus) {
					that.isFocus = false;
					// that.isFocus = true;
				} else {
					that.isFocus = true;
				}

			},

			getFocus: function () {
				this.focus = !this.focus;
			},
			checkPayPwd: function (data) {
				var that = this;

				if (!/^[0-9]*$/.test(that.Value)) {
					uni.showToast({
						title: '请输入数字密码',
						duration: 2000,
						icon: 'none'
					});
				} else {
					// let passwordArr = [...that.Value].reverse()
					// let password = ""
					// passwordArr.forEach(item =>{
					// 	password += "" + item.toString()
					// })
					// console.log(password)
					var parm = {
						payPassword: that.Value
					};
					console.log(that.Value)
					util.postRequest(api.checkPayPwd, parm).then(function (res) {
						console.log(res);
						that.hideModal();
						uni.hideLoading();

						if (res.retCode == '0000000') {
							if (res.rspBody.check) {
								that.setToPay();
							} else {
								uni.showModal({
									title: '提示',
									content: "密码输入错误",
									showCancel: false,
									success: function () {
										that.Value = '';
										that.showPayPwd();
									}
								});
							}
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							});
						}
					});
				}
			},

			longEvent() {
				var page = getCurrentPages();
				var indexPage = page[0];
				indexPage.longEvent();
			},

			setToPay: function () {
				console.log("setToPay");
				const that = this;
				uni.showLoading({
					title: '支付中'
				}); // if(this.data.orderInfo.isInputMoney==1){
				//     if(!app.socketTask){
				//         that.longEvent();
				//     }
				// }

				const orderInfo = that.orderInfo;
				console.log(orderInfo,'orderInfoorderInfo');
				let isGroupon = '';

				if (that.flag == 1) {
					isGroupon = 1;
				} else {
					isGroupon = 0;
				}

				const data = {
					// userCouponId: orderInfo.userCouponId,
					userCouponIds: orderInfo.userCouponIds,
					fuelType: orderInfo.fuelType,
					fuelDictId: orderInfo.fuelDictId,
					fuelGunId: orderInfo.fuelGunId,
					cardId: orderInfo.cardId,
					stationId: orderInfo.stationId,
					// fuelPrice: orderInfo.fuelPrice,
					fuelNum: orderInfo.fuelNum,
					fuelAmount: orderInfo.fuelAmount,
					payToken: that.paytoken,
					payType: that.payType,
					payPassword: that.Value,
					id: orderInfo.id,
					isGroupon: isGroupon,
					fuelCouponNum: orderInfo.fuelCouponNum,
					fuelBeforePrice: orderInfo.fuelBeforePrice,
					fuelCouponAmount: orderInfo.fuelCouponAmount,
					fuelAccuracyNum: orderInfo.fuelAccuracyNum ,//bankCardId: orderInfo.bankCardId,//混合支付银行卡
					ext1:orderInfo.ext1,
					
					//加油订单新逻辑传参
					fuelPrice:orderInfo.fuelPrice,   //实际支付单价
					fuelGunPrice:orderInfo.fuelGunPrice,   //原单价
					//bankPayAmount: orderInfo.bankPayAmount,//混合支付金额

				};

				if (orderInfo.opId) {
					data.opId = orderInfo.opId;
				}

				if (orderInfo.stationType != 5 && that.orderInfo.showCard.cardType == 1 && that.payType != 1) {
					data.fuelPrice = orderInfo.fuelBeforePrice;
				}

				if (orderInfo.stationType == 4) {
					data.originFuelAmount = orderInfo.fuelAmount;
					// data.fuelAmount = orderInfo.depreciateAmount;
					data.depreciateAmount = orderInfo.straightDown;
					//如果有使用优惠券和现金券，需要减去直降的优惠价格
					data.fuelCouponAmount = orderInfo.fuelCouponAmount
				}

				if (orderInfo.fuelNo) {
					data.fuelNo = orderInfo.fuelNo;
				} //万金油支付不是通过加油页面选择的车队卡，而是通过在本页面选择的车队卡


				if (orderInfo.stationType == 5) {
					if (!orderInfo.isInputMoney) {
						data.cardId = that.carArr[that.isCheckedIndex].id;
						data.thirdOrderSn = orderInfo.orderSn;
					}

					data.outFuelNo = orderInfo.fuelNo;
				}
				uni.showLoading({
					title: '支付中'
				});
				
				console.log('data数据', data)
				util.postRequest(api.payForOil, data).then(function (res) {
					console.log(res, "支付");

					if (res.retCode == '0000000') { 
						if (that.payType == 9) {
							uni.showModal({
								title: '提示',
								content: '您可以采用支付宝、银联或现金等方式，将油款支付给油站。成功支付后，请将支付结果展示给油站工作人员查看',
								showCancel: false,
								success: function () {
									uni.redirectTo({
										url: '../addOilResult/addOilResult?map=' + JSON
											.stringify(res.rspBody.order) + '&flag=5' +
											'&isInputMoney=' + orderInfo.isInputMoney
									});
								}
							});
						} else {
							uni.redirectTo({
								url: '../addOilResult/addOilResult?map=' + JSON.stringify(res.rspBody
										.order) + '&flag=""' + '&isInputMoney=' + orderInfo
									.isInputMoney
							});
						}
					} else {
						uni.showModal({
							title: '提示',
							content: res.retDesc,
							showCancel: false
						});
					}
				});
			},
			// 微信支付
			setToPay2: function () {
				console.log("setToPay2");
				const that = this;
				uni.showLoading({
					title: '支付中'
				}); 
				// if(this.data.orderInfo.isInputMoney==1){
				//     if(!app.socketTask){
				//         that.longEvent();
				//     }
				// }

				const orderInfo = that.orderInfo;
				console.log(orderInfo, "orderInfo");
				let isGroupon = '';

				if (that.flag == 1) {
					isGroupon = 1;
				} else {
					isGroupon = 0;
				}

				uni.showLoading({
					title: '支付中'
				});
				// userCouponIds: [orderInfo.userCouponId].concat(orderInfo.checkValue),

				const data = {
					userCouponIds: orderInfo.userCouponIds ? orderInfo.userCouponIds : [
						orderInfo.userCouponId
					].concat(orderInfo.checkValue),
					fuelType: orderInfo.fuelType,
					fuelDictId: orderInfo.fuelDictId,
					fuelGunId: orderInfo.fuelGunId,
					cardId: orderInfo.cardId,
					stationId: orderInfo.stationId,
					// opId: orderInfo.opId,
					// fuelPrice: orderInfo.fuelPrice,
					fuelNum: orderInfo.fuelNum,
					fuelAmount: orderInfo.fuelAmount,
					payToken: that.paytoken,
					payType: that.payType,
					id: orderInfo.id,
					isGroupon: isGroupon,
					fuelCouponNum: orderInfo.fuelCouponNum,
					fuelBeforePrice: orderInfo.fuelBeforePrice,
					fuelAccuracyNum: orderInfo.fuelAccuracyNum ,// payPassword:123456,
					ext1: orderInfo.ext1,
					
					//加油订单新逻辑传参
					fuelPrice:orderInfo.fuelPrice,   //实际支付单价
					fuelGunPrice:orderInfo.fuelGunPrice,   //原单价
										
					//bankCardId: orderInfo.bankCardId,//混合支付银行卡
					//bankPayAmount: orderInfo.bankPayAmount,//混合支付金额

				};
				if(orderInfo.opId){
					data.opId = orderInfo.opId
				}

				if (orderInfo.stationType != 5 && that.orderInfo.showCard.cardType == 1 && that
					.payType != 1) {
					data.fuelPrice = orderInfo.fuelBeforePrice;
				}

				if (orderInfo.fuelNo) {
					data.fuelNo = orderInfo.fuelNo;
				} //万金油支付不是通过加油页面选择的车队卡，而是通过在本页面选择的车队卡


				if (orderInfo.stationType == 5) {
					if (!orderInfo.isInputMoney) {
						data.cardId = that.wechatCard.id;
						data.thirdOrderSn = orderInfo.orderSn;
					}

					data.outFuelNo = orderInfo.fuelNo;
				}
				if (orderInfo.stationType == 4) {
					data.originFuelAmount = orderInfo.fuelAmount;
					// data.fuelAmount = orderInfo.depreciateAmount;
					data.depreciateAmount = orderInfo.straightDown;
					//如果有使用优惠券和现金券，需要减去直降的优惠价格
					data.fuelCouponAmount = orderInfo.fuelCouponAmount
				}

				console.log(this.orderInfo);
				console.log(data, "111");
				// var timeStr = this.createTimeStamp(); // 支付请求
				util.postRequest(api.payForOil, data).then(function (res) {
						console.log(res);
						if (res.retCode == '0000000') {
							let data = res.rspBody.order;
							console.log("调取微信支付返回数据", data)
							// console.log(timeStr,data.wxParams.appid,data.wxParams.prepay_id)
							// var paySign = md5.hex_md5('appId=' + data.wxParams.appid +
							// 	'&nonceStr=' + data.wxParams.nonce_str +
							// 	'&package=prepay_id=' + data.wxParams.prepay_id +
							// 	'&signType=MD5&timeStamp=' + timeStr +
							// 	'&key=ladkfsak1asoiewqfas2dhiesd3fiaep');
							var orderInfo = {
								appid: res.rspBody.order.wxParams.appid,
								noncestr: res.rspBody.order.wxParams.nonce_str,
								package: 'Sign=WXPay',
								partnerid: res.rspBody.order.wxParams.mch_id,
								prepayid: res.rspBody.order.wxParams.prepay_id,
								timestamp: res.rspBody.order.wxParams.timestamp,
								sign: res.rspBody.order.wxParams.sign,
							}
							console.log(orderInfo,'orderInfo')
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: orderInfo,
								success: function (res) {
									console.log("微信支付成功", res);
									uni.showToast({
										title: '支付成功',
										icon: 'success',
										duration: 2000
									});
									uni.redirectTo({
										url: '../addOilResult/addOilResult?map=' +
											JSON.stringify(data) +
											'&flag=0' + '&isInputMoney=' +
											that.orderInfo.isInputMoney
									});
								},
								fail: function (res) {
									console.log(res)
									uni.showToast({
										title: '支付失败',
										icon: 'none',
										duration: 2000
									});
									let parms = {
										orderNo: data.orderNo,
										stationPayStatus: 2
									};
									util.postRequest(api.modifyPayStatus, parms)
										.then(function (res) {
											console.log(res);
											uni.redirectTo({
												url: '../addOilResult/addOilResult?map=' +
													JSON.stringify(
														data) +
													'&flag=1' +
													'&isInputMoney=' +
													orderInfo
													.isInputMoney
											});
											console.log("失败", res);
										});
								},
								'complete': function (res) {}
							});
						} else {
							uni.showModal({
								title: '提示',
								content: res.retDesc,
								showCancel: false
							});
						}
					}) // wx.setStorageSync('wxcode', res.code);
					.catch(err => {
						console.log(err)
					})
				//   var opid = t.getOpenId(res.code);
			}
		},
		//生成时间戳
		createTimeStamp: function () {
			return String(new Date().getTime());
		}
	}
</script>
<style>
	@import "./payOil.css";
</style>