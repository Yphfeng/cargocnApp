<template>
	<view class="smsTopUp">
		<view class="payTypeBox">
			<view class="payTypeTitle">充值方式</view>
			<view class="weChatMsg">
				<image class="typeIcon" src="/static/images/vehicleOptions/wechatIcon.png"></image>
				<view class="typeContent">
					<view class="title">微信</view>
					<view class="msg">当日限额8万元</view>
				</view>
			</view>
		</view>
		
		<view class="priceBox">
			<view class="title">充值金额</view>
			<view class="priceNum">¥ {{smsObj.amount}}</view>
			<view class="hint" v-if="typeNum == 31">短信费用为<text style="color:#EE3E02;">0.1</text>元/条，本次共需充值<text style="color:#EE3E02;">{{smsObj.amount}}</text>元</view>
		</view>
		<view class="confirmBtn" @click="toTouUp">确定</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as md5 from "@/utils/md5.js";
	const {KEYUTIL, KJUR, hextob64} = require('jsrsasign');
	export default {
		data() {
			return {
				smsObj: {},
				userInfo: {},
				typeNum: 0
			};
		},
		onLoad(option) {
			this.typeNum = option.typeNum ? Number(option.typeNum) : 0;
			let userData = uni.getStorageSync("userInfo");
			console.log('用户信息', JSON.parse(userData));
			this.userInfo = userData ? JSON.parse(userData) : {};
			this.smsObj = getApp().globalData.smsObj;
		},
		methods: {
			// toTouUp() {
			// 	uni.showLoading();
			// 	setTimeout(()=>{
			// 		uni.navigateBack()
			// 	}, 2000)
			// },
			toTouUp() { // 先下单后充值
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
				if (!utils.btnRepeat()) return;
				if(this.typeNum == 31) { // 31为短信充值
					var noteAry = this.smsObj.noteVOS;
					var noteVOS = []
					if(noteAry && noteAry.length > 0) {
						for(let i in noteAry) {
							let obj = {
								name: this.userInfo.userName ? this.userInfo.userName : undefined,
								mobile: this.userInfo.mobile,
								driverPhone: noteAry[i].driverPhone
							}
							noteVOS.push(obj);
						}
					}
					console.log('noteVOS', noteVOS);
				}
				
				let params = {
					"amount": this.smsObj.amount,
					"typeNum": this.typeNum,
					"noteVOS": this.typeNum == 31 ? noteVOS : undefined,
				}
				console.log('下单参数', params);
				uni.showLoading({
					title: '充值中...',
					mask: true,
				})
				let that = this;
				utils.postRequest('/dw/order/walletTopUp', params)
				.then(function (res) {
					console.log('下单结果', res)
					if(res.retCode == '0000000') {
						uni.hideLoading();
						that.toWechtPay(res.rspBody.prepay_id, res.rspBody.outTradeNo);
					}else {
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log((err))
				})
			},
			toWechtPay(prepayid, outTradeNo) {
				// 以下为SHA256withRSA加密
				var noncestr = Math.random().toString(36).substr(2, 15);
				var timestamp = Math.round(new Date().getTime()/1000);
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
				let signature = new KJUR.crypto.Signature({alg:"SHA256withRSA"});
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
						console.log('调用成功', Number(that.typeNum));
						switch(Number(that.typeNum)) {
							case 31:
								uni.$emit("smsSendSuccess");
								setTimeout(() => {
									uni.navigateBack()
								}, 100)
								break;
							case 41:
								uni.$emit("getNewCarSource");
								setTimeout(() => {
									uni.navigateBack()
								}, 100)
								break;
							case 54: // 单次充值
								that.buyNumber(outTradeNo);
								break;
						}
					},
				    fail(e) {
						console.log('调用失败', e);
						// that.topUpStatus = false;
						// that.showPopup();
					}
				})
			},
			buyNumber(outTradeNo) {
				let params = {
					"userId": this.userInfo.userId,
					"amount": this.smsObj.amount,
					"accountChannel": "app",
					"point": this.smsObj.point,
					"outTradeNo": outTradeNo
				}
				console.log('单次充值参数', params);
				let that = this;
				utils.postRequest('/dw/order/number_buy', params)
				.then(function (res) {
					console.log('单次充值结果', res);
					if(res.retCode == '0000000'){
						uni.$emit("signleTopupDone");
						setTimeout(() => {
							uni.navigateBack()
						}, 100)
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('单次充值请求失败', res.retDesc);
				})
				
			},
		}
	}
</script>

<style lang="scss">
	.smsTopUp {
		.payTypeBox {
			padding: 74rpx 38rpx 34rpx 38rpx;
			background-color: #F1F4F9;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.payTypeTitle {
				flex: 1;
				font-size: 32rpx;
				font-weight: 400;
				color: #333333;
				line-height: 44rpx;
			}
			.weChatMsg {
				flex-shrink: 0;
				display: flex;
				align-items: center;
				.typeIcon {
					width: 84rpx;
					height: 84rpx;
					display: block;
				}
				.typeContent {
					padding-left: 12rpx;
					.title {
						font-size: 32rpx;
						font-weight: 600;
						color: #333333;
						line-height: 44rpx;
					}
					.msg {
						font-size: 28rpx;
						color: #666666;
						line-height: 44rpx;
					}
				}
			}
		}
		.priceBox {
			border: 24rpx;
			padding:46rpx 38rpx;
			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				line-height: 44rpx;
			}
			.priceNum {
				font-size: 96rpx;
				font-family: DIN Alternate-Bold, DIN Alternate;
				font-weight: bold;
				color: #333333;
				padding: 16rpx 0;
				border-bottom: 1rpx solid #DADADA;
			}
			.hint {
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 28rpx;
				margin-top: 20rpx;
			}
		}
		.confirmBtn {
			position: fixed;
			bottom: 184rpx;
			left:175rpx;
			background-color: #3888FF;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
			border-radius: 16rpx;
		}
	}
</style>
