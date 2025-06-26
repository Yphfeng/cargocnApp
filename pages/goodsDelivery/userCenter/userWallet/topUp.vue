<template>
	<view class="topUp">
		<view class="walletHead">
			<view class="headBox">
				<image @tap="toBack" class="backIcon" src="../../../../static/images/back.png"></image>
				充值
			</view>
		</view>
		
		<view class="topUpDetails">
			<view class="topUpTypeBox">
				<view class="title">充值方式</view>
				<view class="content">
					<view class="type">
						<image class="wechatIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/wechatIcon.png"></image>
						<view class="msg">微信</view>
					</view>
					<view class="hint">当日限额8万元</view>
				</view>
			</view>
			<view class="topUpInputBox">
				<view class="title">充值金额</view>
				<view class="inputBox">
					<view class="leftCol">
						<image class="priceInputSyb" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/priceInputSyb.png"></image>
						<input class="priceInput" type="digit" v-model="priceNum"  :focus="focus" @input="priceChange"/>
					</view>
					<view class="hint">账户余额¥{{allAmountWithIn}}</view>
				</view>
			</view>
		</view>
		<view class="tips" v-if="userRole == 1">
			<view class="subTitle">您充值到平台履约保证金账户的资金将用于：</view>
			<view class="tipItem">1.支付信息费（如有）</view>
			<view class="tipItem">2.支付运费担保金（可选）</view>
			<view class="tipItem">3.支付放空担保金（可选）</view>
			<view class="tipItem">4.支付违约金（如发生）</view>
		</view>
		
		<view class="confirmBtn" @click="toGetPerpayId()">确认</view>
		
		<!-- <button @click="showPopup">展示弹窗</button> -->
		<uni-popup ref="hintPopup" type="center" :mask-click="false" background-color="rgba(0,0,0,0)">
			<view class="hintToast">
				<image class="toastIcon" :src="topUpStatus ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/toastSuccess.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/toastError.png'"></image>
				<view class="toastMsg">{{toastMsg}}</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as md5 from "@/utils/md5.js";
	const {KEYUTIL, KJUR, hextob64} = require('jsrsasign');
	export default {
		data() {
			return {
				isMemberOpen: false,
				focus: true,
				priceNum: '',
				topUpStatus: false,
				toastMsg: '',
				userRole: '',
			};
		},
		onLoad() {
			//获取开关
			this.getMemberOpen();
			this.userRole = uni.getStorageSync('userRole');
			setTimeout(() => {
				this.focus = true
			}, 1000)
		},
		onShow() {
			//获取账户余额
			this.$store.dispatch("getBalance");
			this.focus = true;
			this.$forceUpdate();
		},
		computed: {
			allAmountWithIn() {
				return this.$store.state.allAmountWithIn == '-' ? 0 : this.$store.state.allAmountWithIn
			}
		},
		methods: {
			getMemberOpen() {
				var that = this;
				utils.postRequest("/ts/PageSoftware/get", {
					softwareFunction: "member",
					pageNum: 1,
					pageSize: 10
				}).then(res => {
					console.log(res, '配置信息')
					var items = res.rspBody.items;
					if (items.length < 1) return;
					that.isMemberOpen = items[0].isOpen
				})
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
				     this.priceNum = e.detail.value
				    })
			
			},
			toGetPerpayId() { // 先下单后充值
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
				if(!this.priceNum || this.priceNum == "0.0" || this.priceNum == "0.00") {
					uni.showToast({
						title: '请输入充值金额',
						icon: 'none'
					})
					return false;
				}
				if (!utils.btnRepeat()) return;
				let params = {
					"amount": this.priceNum,
					"typeNum": this.userRole
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
						if (that.isMemberOpen) {
							that.toWechtPay(res.rspBody.prepay_id);
						} else {
							that.toWechtPay(res.rspBody);
						}
						
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
			toWechtPay(prepayid) {
				
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
						console.log('调用成功', res);
						that.topUpStatus = true;
						that.showPopup();
						that.$store.dispatch("getBalance");
						uni.$emit("refreshData_index");
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 2000)
					},
				    fail(e) {
						console.log('调用失败', e);
						that.topUpStatus = false;
						that.showPopup();
					}
				})
			},
			mapObjToKeyValue(obj, isSort = false) {
				let keys = Object.keys(obj);
				let str = "";
				
				if (isSort) keys.sort();
				keys.forEach(key => {
					if (obj.hasOwnProperty(key)) {
						str += `${key}=${obj[key]}&`;
					}
				});
				return str.replace(/&$/, "");
			},
			showPopup() {
				console.log('充值结果弹窗');
				this.toastMsg = this.topUpStatus ? '充值成功' : '充值失败';
			    this.$refs.hintPopup.open()
				setTimeout(()=>{
					this.$refs.hintPopup.close();
					
				}, 3000)
			},
			toBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.topUp {
		min-height: 100vh;
		background-color: #FFF;
		.walletHead {
			height: 206rpx;
			.headBox {
				padding: 106rpx 40rpx 0 30rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #333;
				line-height: 50rpx;
				text-align: center;
				.backIcon {
					width: 22rpx;
					height: 40rpx;
					position: absolute;
					left: 30rpx;
				}
			}
		}
		.topUpDetails {
			margin: 0 32rpx;
			box-shadow: 0px 0px 16rpx 0px rgba(0,0,0,0.18);
			border-radius: 12rpx;
			overflow: hidden;
			.topUpTypeBox {
				height: 142rpx;
				background: #F6F6F6;
				display: flex;
				align-items: center;
				.title {
					flex: 0 0 50%;
					padding-left:32rpx;
					font-size: 28rpx;
					color: #333333;
				}
				.content {
					flex: 0 0 50%;
					padding-left:32rpx;
					.type {
						display: flex;
						align-items: center;
						.wechatIcon {
							width: 34rpx;
							height: 28rpx;
							margin-right: 16rpx;
						}
						.msg {
							line-height: 40rpx;
							font-size: 28rpx;
							color: #00C800;
						}
					}
					.hint {
						font-size: 26rpx;
						color: #AAAAAA;
						line-height: 36rpx;
						margin-top: 12rpx;
					}
				}
			}
			.topUpInputBox {
				padding: 48rpx 32rpx 78rpx 32rpx;
				.title {
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
				}
				.inputBox {
					padding: 18rpx 0;
					border-bottom: 2rpx solid #EAEBEE;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.leftCol {
						flex: 1;
						display: flex;
						align-items: center;
						.priceInputSyb {
							width: 16rpx;
							height: 26rpx;
							margin-right:14rpx;
						}
						.priceInput {
							flex: 1;
							height: 66rpx;
							font-size: 48rpx;
							color: #333333;
						}
					}
					.hint {
						font-size: 26rpx;
						color: #AAAAAA;
						line-height: 36rpx;

					}
				}
			}
		}
		.confirmBtn {
			margin: 48rpx 32rpx 0 32rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: #4AA2F3;
			border-radius: 48rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
		.hintToast {
			min-width: 450rpx;
			background-color: rgba(51, 51, 51, 0.9);
			padding: 60rpx 0 40rpx 0;
			.toastIcon {
				width: 64rpx;
				height: 64rpx;
				display: block;
				margin:0 auto;
			}
			.toastMsg {
				margin-top:36rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				line-height: 40rpx;
				text-align: center;
			}
		}
	}
	.tips {
		display: flex;
		flex-direction: column;
		padding: 20rpx 32rpx;
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
