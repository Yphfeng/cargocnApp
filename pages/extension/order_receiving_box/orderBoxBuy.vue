<template>
	<view class="orderBoxBuy">
		<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/back_white.png" class="back" @click="back">
		</image>
		<view class="centerBox">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/order_box_bg_1.png" class="order_box_bg"
				mode="widthFix"></image>
			<view class="tips">
				<view class="tips-item" @click="toBuyedList">
					<text>购买</text>
					<text>记录</text>
				</view>
				<view class="tips-item" @click="toExtension">
					<text>推广</text>
					<text>赚钱</text>
				</view>
			</view>
		</view>
		<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/order_box_title_img_1.png" mode="widthFix"
			class="order_box_title_img"></image>
		<!-- <view class="list-item" v-for="item in arr" :id="item.id">
			<view class="list-title">{{item.title}}</view>
			<view class="list-content">{{item.content}}</view>
		</view> -->

		<view class="buy_item" id="buyBox">
			<view class="buy_title">支付押金</view>
			<view class="buy_tips">
				<!-- <view class="buy_tips_label">服务类型</view> -->
				<view class="buy_tips_content">
					<view class="buy_tips_content_item" v-for="(item, index) in goodsTypeAllArr"
						@click="switchPrice(index)">
						<image
							:src="index == priceIndex ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/selected.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/select.png'"
							class="select_icon"></image>
						<view class="select_label">{{item.goodsName}}：¥{{item.priceTotal}}</view>
					</view>
				</view>
			</view>
			<view class="buy_send">
				<view class="buy_send_btn" @click="buySend">支付</view>
			</view>
		</view>
		<view class="bottom-fixed" v-if="!isBottom">

			<view class="type-title">支付押金</view>

			<view class="send">
				<view class="type-content">
					<view class="type-item" v-for="(item, index) in goodsTypeAllArr" @click="switchPrice(index)">
						<image
							:src="index == priceIndex ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/selected.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/select.png'"
							class="select_icon"></image>
						<view class="select_label">{{item.goodsName}}：¥{{item.priceTotal}}</view>
					</view>
				</view>
				<view class="payment_box">
					<view class="send-btn" @click="buySend">支付</view>
				</view>
				
			</view>
			
		</view>
		
		<uni-popup ref="popup" type="bottom">
			<view class="addressPop" v-if="!addrItem">
				<view class="title">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/back_black.png" class="back_black"
						@click="popBack"></image>
					添加收货地址
				</view>
				<view class="addr_item">
					<view class="addr_label">收货人</view>
					<view class="sendBox" />
					<input type="text" placeholder="填写收货人姓名" v-model="addrParams.cargoReceiver" class="input"
						placeholder-class="placeholer">
				</view>
				<view class="addr_item">
					<view class="addr_label">手机号</view>
					<view class="sendBox" />
					<input type="number" placeholder="填写正确的收货人号码" v-model="addrParams.phone" class="input"
						placeholder-class="placeholer">
				</view>
				<view class="addr_item">
					<view class="addr_label">所在地区</view>
					<view class="sendBox" />
					<view class="input" :class="[regionText?'region-text':'placeholder-class2']"
						style="margin-left: 5rpx;" @tap="openRegionPopup()">{{regionText?regionText:'请选择'}}</view>
				</view>
				<view class="addr_item addr_area">
					<view class="addr_label">详细地址</view>
					<textarea class="textArea" v-model="addrParams.detailAddress" placeholder="输入地址"></textarea>
				</view>
				<view class="addr_btn" @click="addressSave">保存</view>
			</view>
			<view v-else class="addressPop">
				<view class="title">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/back_black.png" class="back_black"
						@click="popBack"></image>
					选择收货地址
				</view>
				<view class="addr_content" @click="toAddressList">
					<view v-if="addrItem">
						<view class="mainTitle">
							{{addrItem.provinceName + addrItem.cityName + addrItem.areaName + addrItem.detailAddress}}
						</view>
						<view class="subTitle"><text
								class="pr-26">{{addrItem.cargoReceiver}}</text><text>{{addrItem.phone}}</text></view>
					</view>
					<view v-else class="chooseAddr">请选择</view>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_right_black.png"
						class="arrow_right_black"></image>
				</view>
				<view class="addr_btn" @click="toGetPerpayId">确定</view>
			</view>
		</uni-popup>
		<uni-popup ref="newRegionPopup" type="bottom">
			<chooseRegion :checkedRegionObj="checkedRegionObj"></chooseRegion>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship.js"
	import * as md5 from "@/utils/md5.js";
	const {
		KEYUTIL,
		KJUR,
		hextob64
	} = require('jsrsasign');
	import chooseRegion from "@/components/chooseRegion.vue"
	export default {
		components: {
			chooseRegion
		},
		data() {
			return {
				checkedRegionObj: {},
				region: [],
				regionVal: [0, 0, 0],
				regionText: '',
				userInfo: null,
				addrItem: null,
				address: "1212",
				page_top: 0,
				windowHeight: 0,
				isBottom: false,
				userRole: 1,
				arr: [{
						title: '01.卡车智能盒',
						content: '安装卡车智能盒，24小时自动搜索货源接单',
						id: "index01"
					},
					{
						title: '02.长期货主',
						content: '直接对接并加入上游货主车队，运价更合理，生意有保障',
						id: "index02"
					},
					{
						title: '03.平台保障',
						content: '平台全面保障，解决卡友被克扣拖欠运费的问题',
						id: "index03"
					},
					{
						title: '04.卡友之家',
						content: '加油，维修，路况，天气，互助，卡车人的家',
						id: "index04"
					},
				],
				goodsTypeArr: [],
				goodsTypeAllArr: [],
				priceIndex: 0,
				goodsNum: 1,
				addrParams: {
					cargoReceiver: '',
					phone: '',
					provinceCode: '',
					provinceName: '',
					cityCode: '',
					cityName: '',
					areaCode: '',
					areaName: '',
					detailAddress: ''

				}
			}
		},
		onLoad() {
			this.userRole = uni.getStorageSync("userRole");
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userInfo = JSON.parse(userInfo);
			}
			this.getType(); //获取商品
			this.getRegionInfo();
			uni.$on("checkStartRegion", item => {
				console.log('装货地', item);
				this.addrParams.provinceName = item.provinceName;
				this.addrParams.provinceCode = item.provinceCode;
				this.addrParams.cityName = item.cityName;
				this.addrParams.cityCode = item.cityCode;
				if (item.areaName) {
					this.addrParams.areaName = item.areaName;
					this.addrParams.areaCode = item.areaCode;
				}
				this.regionText = item.provinceName + ' ' + item.cityName + ' ' + item.areaName || "";
				this.checkedRegionObj = {
					"provinceName": item.provinceName,
					"provinceCode": item.provinceCode,
					"cityName": item.cityName,
					"cityCode": item.cityCode,
					"areaName": item.areaName,
					"areaCode": item.areaCode,
				}
				this.$refs.newRegionPopup.close();
			})

			uni.$on("closeRegionPopup", item => {
				this.$refs.newRegionPopup.close();
			})
		},
		onReady() {
			let that = this;
		},
		onPageScroll(e) {
			console.log(e);
			var windowHeight = this.windowHeight;
			var scrollTop = e.scrollTop;
			var page_top = this.page_top;
			var isBottom = this.isBottom;
			if (scrollTop + windowHeight > page_top) {
				if (isBottom) return;
				this.isBottom = true
			} else {
				if (!isBottom) return;
				this.isBottom = false
			}
		},
		methods: {
			toExtension() {
				uni.navigateTo({
					url: '../extension_report/extension_report'
				})
			},

			inputNum(e) {
				console.log(e)
				this.goodsNum = e.detail.value
			},
			del() {
				var goodsNum = this.goodsNum;
				if (goodsNum == 1) return;
				this.goodsNum--
			},
			add() {
				var goodsNum = this.goodsNum;
				this.goodsNum++
			},
			switchPrice(index) {
				this.priceIndex = index;
			},
			async getType() {
				let that = this;
				try {
					var res = await ship.postRequest("/dw/commodity/get", {
						"goodsTypeCode": "GOOD_TYPE_BOX"

					})
					if (res.retCode == "0000000") {
						var items = res.rspBody.items;
						items.forEach(atem => {
							var sid = atem.sid;
							if (sid == "3") {
								atem.priceTotal = atem.goodsSalePrice * 1
							} else if (sid == "4") {
								atem.priceTotal = atem.goodsSalePrice * 1
							} else if (sid == "5") {
								atem.priceTotal = atem.goodsSalePrice * 2
							} else if (sid == "6") {
								atem.priceTotal = atem.goodsSalePrice * 10
							}
						})
						this.goodsTypeArr = items.slice(0, 2);
						this.goodsTypeAllArr = items;
						var windowHeight = uni.getSystemInfoSync().windowHeight;
						this.windowHeight = windowHeight;
						setTimeout(() => {
							const query = uni.createSelectorQuery().in(that);
							query.select("#buyBox").boundingClientRect(data => {
								console.log(data);
								that.page_top = data.top;
							}).exec();
						}, 100)
					}
					console.log("goodsType", res)
				} catch (e) {
					//TODO handle the exception
				}
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			setAddr(item) {
				this.addrItem = item;
			},
			async buySend() {
				//获取收货地址列表
				var priceIndex = this.priceIndex;
				var goodsTypeAllArr = this.goodsTypeAllArr;
				var chooseItem = goodsTypeAllArr[priceIndex];
				var sid = chooseItem.sid;
				if (sid == "3") {
					this.goodsNum = 1
				} else if (sid == "4") {
					this.goodsNum = 1
				} else if (sid == "5") {
					this.goodsNum = 2
				} else if (sid == "6") {
					this.goodsNum = 10
				}
				uni.showLoading();
				await this.getAddress();
				uni.hideLoading();
				this.$refs.popup.open();
			},
			async getAddress() {
				let that = this;
				var userRole = this.userRole,
					url = "";
				if (userRole == 1) {
					var res = await ship.postRequest('/au/shipping/address/findVO', {
						pageSize: that.pageSize,
						pageNum: that.pageNum,
					})

					console.log(res.rspBody.items);
					if (res.retCode == '0000000') {
						var items = res.rspBody.items;
						this.addrItem = items[0] || null;
					}
				} else {
					var userInfo = uni.getStorageSync("userInfo");
					var userBusinessId = JSON.parse(userInfo).attrs.userBusinessId;
					console.log(userBusinessId, '用户userBusinessId')
					var res = await ship.postRequest('/business/shipping/address/select?userBusinessId=' +
						userBusinessId, {
							userBusinessId: userBusinessId
						}, 'GET')


					console.log(res.rspBody.items);
					if (res.retCode == '0000000') {
						var items = res.rspBody;
						this.addrItem = items[0] || null;
					}


				}
			},
			popBack() {
				this.$refs.popup.close();
			},
			toAddressList() {
				uni.navigateTo({
					url: './addressList'
				})
			},
			deletAddress(items) {
				console.log("删除", items);
				var addrItem = this.addrItem;
				var findIndex = -1;
				if (this.userRole == 1) {
					findIndex = items.findIndex(atem => {
						return atem.id == addrItem.id
					})
				} else {
					findIndex = items.findIndex(atem => {
						return atem.sid == addrItem.sid
					})
				}
				console.log("删除", items, findIndex);
				if (findIndex > -1) return;
				this.addrItem = items[0];

			},
			toBuyedList() {
				uni.navigateTo({
					url: './orderBoxBuyList'
				})
			},
			toGetPerpayId() {
				//充值
				var that = this;
				var addrItem = this.addrItem;
				var userInfo = this.userInfo;
				var goodsTypeAllArr = this.goodsTypeAllArr;
				var priceIndex = this.priceIndex;
				if (!addrItem) {
					uni.showToast({
						title: '请选择收货地址',
						icon: 'none'
					})
				};
				if (!userInfo) return;
				//判断是否安装微信
				var isWeixin = plus.runtime.isApplicationExist({
					pname: 'com.tencent.mm',
					action: 'weixin://'
				});
				if (!isWeixin) {
					uni.showToast({
						title: '请安装微信',
						icon: 'none'
					})
					return
				}
				if (!ship.btnRepeat()) return;
				uni.showLoading({
					title: '支付中...',
					mask: true,
				})
				var priceItem = goodsTypeAllArr[priceIndex];
				var params = {
					amount: priceItem.priceTotal,
					typeNum: 61,
					orderNoteVO: {
						userId: userInfo.userId,
						userCode: userInfo.attrs.userCode,
						userPhone: userInfo.mobile,
						userName: userInfo.userName || "",
						goodsTotalOriginPrice: priceItem.priceTotal,
						goodsTotalSalePrice: priceItem.priceTotal,
						purchaseChannel: 'app',
						dataChannel: 'app',
						orderNoteDetailVOList: [{
							goodsSid: priceItem.sid,
							goodsName: priceItem.goodsName,
							goodsPrice: priceItem.goodsSalePrice,
							goodsSalePrice: priceItem.goodsSalePrice,
							goodsValue: priceItem.goodsValue,
							goodsNum: that.goodsNum,

						}]
					},
					orderNoteAddressVO: {
						consigneeName: addrItem.cargoReceiver,
						consigneePhone: addrItem.phone,
						consigneeProvince: addrItem.provinceName,
						consigneeProvinceCode: addrItem.provinceCode,
						consigneeCity: addrItem.cityName,
						consigneeCityCode: addrItem.cityCode,
						consigneeArea: addrItem.areaName,
						consigneeAreaCode: addrItem.areaCode,
						consigneeAddr: addrItem.detailAddress
					}
				}
				console.log(params);

				ship.postRequest('/dw/order/walletTopUp', params)
					.then(function(res) {
						console.log('下单结果', res)
						if (res.retCode == '0000000') {
							uni.hideLoading();
							that.payParams = res.rspBody;
							that.toWechtPay(res.rspBody.prepay_id);
						} else {

							uni.hideLoading();
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						uni.hideLoading();
						console.log((err))
					})

			},

			toWechtPay(prepayid) {
				if (!prepayid) return;
				// 一下为原始商户号交易
				// var noncestr = Math.random().toString(36).substr(2, 15);
				// var timestamp = Math.round(new Date().getTime()/1000);
				// let orderInfo = {
				// 	"appid": "wxff21ca63335c4c42", // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
				// 	"noncestr": noncestr, // 随机字符串
				// 	"package": "Sign=WXPay", // 固定值
				// 	"partnerid": "1611910119", // 微信支付商户号
				// 	"prepayid": prepayid, // 统一下单订单号 
				// 	"timestamp": timestamp, // 时间戳（单位：秒）
				// };
				// let keyValueStr = this.mapObjToKeyValue(orderInfo, true);
				// // 真正的二次加密
				// let sign = md5.hex_md5(keyValueStr).toUpperCase().substr(0, 32);
				// orderInfo.sign = sign;
				// console.log(orderInfo);

				// 以下为SHA256withRSA加密
				var noncestr = Math.random().toString(36).substr(2, 15);
				var timestamp = Math.round(new Date().getTime() / 1000);
				let orderInfo = {
					"appid": "wxff21ca63335c4c42", // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
					"noncestr": noncestr, // 随机字符串
					"package": "Sign=WXPay", // 固定值
					"partnerid": "1614679593", // 微信支付商户号
					"prepayid": prepayid, // 统一下单订单号 
					"timestamp": timestamp, // 时间戳（单位：秒）
				};
				let newkeyValueStr = "wxff21ca63335c4c42" + '\n' + timestamp + '\n' + noncestr + '\n' + prepayid + '\n';
				// 方式1: 先建立 key 对象, 构建 signature 实例, 传入 key 初始化 -> 签名
				let priK = "-----BEGIN PRIVATE KEY-----\n" +
					"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcPS+ELl7sU8sV\n" +
					"uZX7gE8o8hYjUTiSQGEbW5xYmuwb8qyfPJienobd4F6ky02EKcAPGPI4idu0gOnw\n" +
					"fx7Ny+5s7Pzo4CsaC6pWwySxEK4FR9qKn8KI1p/tYfThkiTgIxISVdNkNeRSxbsm\n" +
					"qfWoknSbDUfkNLI7XjLq/USD6EnFHG7wRy35NpL8uIF2eHkwHqZcFqd9Qg0ynIto\n" +
					"pdiNjYmZJEfAlA2oZ8lzgekM13UMCISDMesJJRI1poOp9cZPOS9CEnQuoQKj8PuD\n" +
					"HtzPSu9rTZxtdkGXrotyJbw5u+rRuE9ADPMKZ6lG/WHbR/7FcF4yYRFC/ha1wP6p\n" +
					"FhCwW/rDAgMBAAECggEAFbjzNtZcBnM9VKc5Y9UD+cXm6RTZv5MaANjIUvT01Mza\n" +
					"udoAM6TvKHM44ogq3R5BEzwip/Dw+py8djwTjbjPi27UgyOZHLiJ1ITq2YwLnfm4\n" +
					"VHPtfBGvNHq07Iq9mF3dKnHMp9Wo74ERNH8O+9F2LtTggmGwMqrX2tWgLGJ85DP6\n" +
					"45P5RLJ3Si71L7uIS58tSjai/gKC9ul37ORX95LNTuZ+St9P9w+Zxm7D+twBGc6T\n" +
					"0ZORQ0q3PvUnbb2Hnx3RJZuamKxicDNsOZhNG6lhG8rl3ZGwpxXTl18Qi7QXZdbd\n" +
					"+VjiYgRQqPEYV/PGzUYskUmLgs/GOqPTvcm+3yyOAQKBgQDyZqtT/vTcYE1IYqeV\n" +
					"34icpWAMMHmwLaHVmLk1u7ysGSQQoxaajG5SmWOzKTViMf0TGWcZF1WTupneQFIJ\n" +
					"BeUV83uMDLVl6xAB9ym+NHD4Yo2nBj70OuqhcAI+ScGyTCyOO1x1t/Ff1H4Q6kLy\n" +
					"AsUqu+ixUo4JOjsXyUNPpHl7xwKBgQDomDpkaAylAEpMI6ELlf49TV6jWoFavsiy\n" +
					"ZFlvBVmLDmyu0tAHxIvOsTmt52+KYkuJfIJ4U43PNNr3rJyOhzZOZinomMXJNr7m\n" +
					"BXENVsrijVf43q3eH61QI54b7UJV6RmLJgCADwdKMIbehhWTDjHIFAKj4q8Pms7W\n" +
					"Vci/bQQxJQKBgQC1I7/4HthALr7RztdJCif+Vx61PSxSWWdMRLpyyv4s5QSsYhMs\n" +
					"HrD6jKGSasL3xD9IHH2MpIFQyerdyNcE4yDUDIVQnNaZeNUXgunwtyOMmakdHW/B\n" +
					"9p0LUrZ6cYeLg5zwFK/9UB3R7OrgHQ815pgMXSuABx8ZCijKl53zUAdwVQKBgClx\n" +
					"Pi43r9ESbSqFyqMC1archzk53gRqK95FLP4wCNVS+6BmpXRM29A3GZzXuLMCco0L\n" +
					"pz+DO6gotb8dfUOT6eQsJdlwpwUEAR2A6LTEux+EqaEJJBeIs1utDPXS31fpUYjO\n" +
					"e5ZVlynr3Yv2fg+Wnt4UWqgSsrhoD+R2om8hIHcVAoGAT1vyJ8VHJzcSfabNkOGG\n" +
					"KXUUq81kGUtqRLaAy5ZM/Q667NQF2BxFsYNrcdxRY6QJQ/UXLdqU/TTOO2D1COW/\n" +
					"FXBenV5vdsEgLOzdGX9a3/7A65cgG2LWdnANUtnLoy7OY/wiY61geKciJGCygmtq\n" +
					"lnpyUc9Vym4GLxkl7HxWE3w=\n" +
					"-----END PRIVATE KEY-----";
				var key = KEYUTIL.getKey(priK);
				// 创建 Signature 对象
				let signature = new KJUR.crypto.Signature({
					alg: "SHA256withRSA"
				});
				// 传入key实例, 初始化signature实例
				signature.init(key);
				// 传入待签明文
				signature.updateString(newkeyValueStr);
				// 签名, 得到16进制字符结果
				let a = signature.sign();
				let signMsg = hextob64(a);
				orderInfo.sign = signMsg;
				// console.log('new对象', orderInfo);
				let that = this;
				uni.requestPayment({
					"provider": "wxpay",
					"orderInfo": orderInfo,
					success(res) {
						console.log('调用成功', res);
						uni.showLoading();
						that.toServerPay();
					},
					fail(e) {
						console.log('调用失败', e);
					}
				})
			},
			toServerPay() {
				var that = this;

				var payParams = that.payParams;
				ship.postRequest("/dw/buy/box/add", payParams).then(res => {
					console.log(res, '购买成功')
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '支付成功',
							icon: 'none'
						})
						this.$refs.popup.close();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}

				}).catch(err => {
					console.log(err, "套餐购买失败")
					uni.hideLoading();
				})
			},
			getRegionInfo() {
				let that = this;
				ship.postRequest('/ts/nationDict/getBasicData', {})
					.then(res => {
						that.region = res.rspBody;
						that.secondAry = that.region[0].cities;
						that.thirdAry = that.region[0].cities[0].areas;
					})
					.catch(err => {
						console.log(err);
					})
			},
			regionChange(e) {
				console.log(e);
				this.regionVal = e.detail.value;
				let key1 = this.regionVal[0];
				this.secondAry = this.region[key1].cities;
				let key2 = this.regionVal[1];
				this.thirdAry = this.region[key1].cities[key2].areas;
			},
			openRegionPopup() {
				this.$refs.newRegionPopup.open();
			},
			chooseRegion() { // 选择地区
				let key1 = this.regionVal[0];
				let key2 = this.regionVal[1];
				let key3 = this.regionVal[2];
				console.log(this.region[key1], key2, key3);
				this.regionText = this.region[key1].name + ' ' + this.region[key1].cities[key2].name + ' ' + this.region[
					key1].cities[key2].areas[key3].name;
				this.addrParams.provinceCode = this.region[key1].code;
				this.addrParams.provinceName = this.region[key1].name;
				this.addrParams.cityCode = this.region[key1].cities[key2].code;
				this.addrParams.cityName = this.region[key1].cities[key2].name;
				this.addrParams.areaCode = this.region[key1].cities[key2].areas[key3].code;
				this.addrParams.areaName = this.region[key1].cities[key2].areas[key3].name;
				console.log(this.provinceCode, this.cityCode, this.areaCode);
				this.$refs.regionPopup.close();
				this.$forceUpdate();
			},
			addressSave() {
				let that = this;
				if (!that.addrParams.cargoReceiver) {
					uni.showToast({
						title: '请输入收货人',
						icon: 'none',
					})
					return;
				}
				if (!that.addrParams.phone) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none',
					})
					return;
				}
				if (!that.regionText) {
					uni.showToast({
						title: '请选择地区',
						icon: 'none',
					})
					return;
				}
				if (!that.addrParams.detailAddress) {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none',
					})
					return;
				}
				uni.showLoading({
					title: '请稍后...',
					mask: true
				})
				var data = that.addrParams;
				console.log('收货地址保存参数', data)
				var userRole = this.userRole;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				if (userRole == 1) {

					ship.postRequest('/au/shipping/address/save', data)
						.then(res => {
							console.log('司机保存收货地址', res)
							uni.hideLoading();
							if (res.retCode == '0000000') {
								uni.showToast({
									title: '保存成功',
									icon: 'none'
								})
								this.addrParams = {
									cargoReceiver: '',
									phone: '',
									provinceCode: '',
									provinceName: '',
									cityCode: '',
									cityName: '',
									areaCode: '',
									areaName: '',
									detailAddress: ''

								}
								this.regionText = "";
								this.getAddress();
							} else {
								uni.showToast({
									title: res.resDesc,
									icon: 'none'
								})
							}
						})
						.catch(err => {
							console.log(err);
						})
				} else {

					// console.log(userInfo)
					var url = '/business/shipping/address/add'
					data.userBusinessId = JSON.parse(userInfo).attrs.userBusinessId;
					ship.postRequest(url, data)
						.then(res => {
							console.log('货主保存收货地址', res)
							uni.hideLoading();
							if (res.retCode == '0000000') {
								uni.showToast({
									title: '保存成功',
									icon: 'none'
								})
								this.addrParams = {
									cargoReceiver: '',
									phone: '',
									provinceCode: '',
									provinceName: '',
									cityCode: '',
									cityName: '',
									areaCode: '',
									areaName: '',
									detailAddress: ''

								}
								this.getAddress();
							} else {
								uni.showToast({
									title: res.resDesc,
									icon: 'none'
								})
							}
						})
						.catch(err => {
							console.log(err);
						})
				}

			},

		}
	}
</script>

<style lang="scss" scoped>
	.orderBoxBuy {
		background-image: linear-gradient(90deg, #424564 0%, #242746 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);

		/* 兼容 iOS >= 11.2 */
		.back {
			position: absolute;
			top: 100rpx;
			left: 50rpx;
			width: 16rpx;
			height: 30rpx;
			z-index: 2;
		}

		.centerBox {
			width: 100vw;
			height: 880rpx;
			position: relative;

			.tips {
				position: absolute;
				right: 0;
				top: 394rpx;

				.tips-item {
					background-image: linear-gradient(180deg, #8794CB 0%, #282D4F 100%);
					box-shadow: 0 0 8rpx 0 #111111;
					font-size: 28rpx;
					color: #ffffff;
					letter-spacing: 3rpx;
					line-height: 36rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-radius: 8rpx;
					padding: 8rpx 10rpx 8rpx 16rpx;

					&:first-child {
						margin-bottom: 32rpx;
					}
				}
			}
		}

		.order_box_bg {
			width: 100vw;
		}

		.order_box_title_img {
			width: 100vw;
			margin-bottom: 6rpx;
		}

		.list-item {
			margin-top: 24rpx;
			width: calc(100vw - 116rpx);
			background-image: linear-gradient(135deg, #6874A9 0%, #20223E 100%);
			box-shadow: 4rpx 4rpx 8rpx 0 rgba(0, 0, 0, 0.2500);
			border-radius: 8rpx;
			height: 214rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 30rpx;
			box-sizing: border-box;

			.list-title {
				font-size: 36rpx;
				color: #ffffff;
				font-weight: 500;
				line-height: 36rpx;
				letter-spacing: 1rpx;
				margin-bottom: 20rpx;
			}

			.list-content {
				font-weight: 400;
				color: #ffffff;
				line-height: 44rpx;
				letter-spacing: 3rpx;
				font-size: 32rpx;
			}
		}

		.buy_item {
			margin-top: 32rpx;
			width: calc(100vw - 108rpx);
			// background-image: linear-gradient(90deg, #424564 0%, #242746 100%);
			// box-shadow: 4rpx 4rpx 8rpx 0 rgba(0, 0, 0, 0.2500), inset 0 8rpx 8rpx 4rpx #1B1D3A;
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.buy_title {
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 36rpx;
				letter-spacing: 2rpx;
				padding: 36rpx 0;
			}

			.buy_tips {
				display: flex;
				flex-direction: row;
				// justify-content: space-between;
				// justify-content:flex-start;

				.buy_tips_label {
					font-size: 28rpx;
					color: #ffffff;
					padding-left: 32rpx;
					padding-right: 32rpx;
					box-sizing: border-box;
				}

				.buy_tips_content {
					// flex: 1;
					display: flex;
					// flex-direction: column;
					justify-content: flex-start;
					flex-wrap: wrap;

					.buy_tips_content_item {
						display: flex;
						flex-direction: row;
						align-items: center;
						font-size: 28rpx;
						font-weight: 500;
						color: #FFDB5B;
						

						&+.buy_tips_content_item {
							margin-top: 22rpx;
						}

						.select_icon {
							width: 32rpx;
							height: 32rpx;
							margin-right: 12rpx;
						}
					}
				}

			}

			.buy_send {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 32rpx 0 24rpx;

				.buy_send_btn {
					width: 324rpx;
					height: 64rpx;
					background: linear-gradient(180deg, #8794CB 0%, #282D4F 100%);
					box-shadow: 0 0 8rpx 0 rgba(17, 17, 17, 0.3100);
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 64rpx;

					font-size: 32rpx;

					font-weight: 500;
					color: #FFFFFF;
					line-height: 36rpx;
					letter-spacing: 2rpx;

				}
			}
		}

		.bottom-fixed {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			background-image: linear-gradient(to right, rgba(64, 67, 98, 1), rgba(36, 37, 65, 1));
			box-shadow: 0 -4rpx 12rpx 0 rgba(101, 113, 165, 0.3700);
			display: flex;
			flex-direction: column;
			padding: 0 24rpx 0 42rpx;
			box-sizing: border-box;
			z-index: 1;

			.type-title {
				color: #ffffff;
				letter-spacing: 1rpx;
				font-size: 36rpx;

				font-weight: 500;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				padding-top: 20rpx;
				padding-bottom: 32rpx;
				box-sizing: border-box;
			}

			.send {
				// display: flex;
				// flex-direction: row;
				// justify-content: space-between;
				// align-items: flex-end;
				// flex-wrap: wrap;
				padding-bottom: 56rpx;
				box-sizing: border-box;
				margin-top: 24rpx;

				.type-content {
					flex: 1;
					display: flex;
					flex-direction: column;

					.type-item {
						display: flex;
						flex-direction: row;
						font-size: 28rpx;
						font-weight: 500;
						color: #FFDB5B;

						&+.type-item {
							margin-top: 24rpx;
						}

						.select_icon {
							width: 32rpx;
							height: 32rpx;
							margin-right: 14rpx;
						}
					}

				}
				
				.payment_box {
					display: flex;
					justify-content: center;
					margin-top: 20rpx;
					.send-btn {
						width: 324rpx;
						height: 64rpx;
						background-image: linear-gradient(180deg, #8794CB 0%, #282D4F 100%);
						box-shadow: 0 0 8rpx 0 rgba(17, 17, 17, 0.3100);
						display: flex;
						justify-content: center;
						align-items: center;
						color: #ffffff;
						font-size: 32rpx;
						font-weight: 500;
						line-height: 36rpx;
						letter-spacing: 2rpx;
						border-radius: 76rpx;
						margin-right: 14rpx;
						margin-bottom: 8rpx;
						text-align: center;
					}
				}

				
			}
		}

		.addressPop {
			width: 100vw;
			height: 90vh;
			background-color: #ffffff;
			border-radius: 24rpx 24rpx 0 0;
			display: flex;
			flex-direction: column;
			align-items: center;

			.title {
				width: 100vw;
				text-align: center;
				font-size: 40rpx;
				font-weight: 600;
				color: #333333;
				line-height: 40rpx;
				position: relative;
				padding-top: 40rpx;
				box-sizing: border-box;

				.back_black {
					position: absolute;
					left: 38rpx;
					top: 44rpx;
					width: 16rpx;
					height: 30rpx;
				}

			}

			.addr_item {
				width: calc(100vw - 34rpx);
				margin-right: 0 34rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				margin-top: 40rpx;

				&.addr_area {
					align-items: flex-start;

					.addr_label {
						padding-top: 12rpx;
					}
				}

				.sendBox {
					width: 20rpx;
				}

				.placeholder-class2 {
					color: #999;
					font-size: 28rpx;

				}

				.region-text {
					color: #333;
					font-size: 28rpx;

				}

				.addr_label {
					width: 190rpx;
					margin-left: 38rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
					line-height: 40rpx;
					box-sizing: border-box;
				}

				.placeholer {
					color: #999999;
				}

				.input {
					flex: 1;
					padding: 16rpx 0;
					border-bottom: 1rpx solid #E7E7E7;
					font-weight: 400;
					font-size: 28rpx;
				}

				.textArea {
					flex: 1;
					height: 120rpx;
					background: #F9F9F9;
					border-radius: 16rpx;
					padding: 12rpx 20rpx;
					box-sizing: border-box;

					font-size: 28rpx;

					font-weight: 400;
					color: #999999;
					line-height: 40rpx;
				}
			}

			.addr_btn {
				width: 400rpx;
				height: 80rpx;
				background: #2B72F0;
				border-radius: 16rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				font-size: 32rpx;

				font-weight: 500;
				color: #FFFFFF;
				line-height: 44rpx;
				margin-top: 48rpx;

			}

			.addr_content {
				display: flex;
				flex-direction: row;
				width: calc(100vw - 72rpx);
				background: #FFFFFF;
				box-shadow: 0 0 34rpx 0 rgba(0, 0, 0, 0.0600);
				justify-content: space-between;
				align-items: center;
				margin-bottom: 90rpx;
				margin-top: 48rpx;
				padding: 32rpx 52rpx 32rpx 46rpx;
				box-sizing: border-box;

				.arrow_right_black {
					width: 16rpx;
					height: 30rpx;
				}

				.mainTitle {
					font-size: 40rpx;

					font-weight: 500;
					color: #333333;
					line-height: 40rpx;
					margin-bottom: 16rpx;

				}

				.subTitle {

					font-size: 32rpx;

					font-weight: 400;
					color: #666666;
					line-height: 40rpx;

				}

				.pr-26 {
					padding-right: 26rpx;
				}
			}

		}

	}
</style>
