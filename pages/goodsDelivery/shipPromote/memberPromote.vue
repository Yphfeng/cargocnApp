<template>
	<view class="memberPromote">
		<view class="backBtn" @click="toBack">
			<image class="icon" src="../../../static/images/driverDetails/backIcon.png"></image>
		</view>
		<image class="newMemberHeadTitle" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/newMemberHeadTitle.png"></image>
		<view class="titleHint">VIP会员可享权益</view>
		<image class="newMemberArrow" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/newMemberArrow.png"></image>
		<view class="rightsInterestsBox">
			<view class="contentBox" style="padding: 0 30rpx 0 30rpx;">
				<view class="mun">01</view>
				<view class="msg">专属运力池</view>
			</view>
			<view class="contentBox" style="padding: 0 30rpx 0 30rpx;">
				<view class="mun">02</view>
				<view class="msg">精准搜车源</view>
			</view>
			<view class="contentBox" style="padding: 0 16rpx 0 26rpx;">
				<view class="mun">03</view>
				<view class="msg">货源优先推送</view>
			</view>
			<view class="contentBox" style="padding: 0 18rpx 0 26rpx;">
				<view class="mun">04</view>
				<view class="msg">专属1对1服务</view>
			</view>
		</view>
		<view class="subHint" style="margin: 16rpx 0 0 0;">急找车</view>
		<view class="subHint" style="margin: 32rpx 0 48rpx 0;">旺季找车难？帮您智能秒找车</view>
		<view class="subHint" style="margin: 0 0 0 0;">囤运力</view>
		<view class="subHint" style="margin: 32rpx 0 0 0;">车队卡车等您来找，拉到个人</view>
		<view class="subHint" style="margin: 0 0 0 0;">车队，培养自己的运力</view>
		<view class="showPopupBtn" @click="toShowPopup">购买会员</view>
		<uni-popup ref="bugMemberPopup" type="bottom">
			<view class="memberPopupBox">
				<view class="closePopupBtn"><image class="icon" @click="toClosePopup" src="../../../static/images/vehicleOptions/closePopupIconWhite.png"></image></view>
				<scroll-view class="center_view" :scroll-y="true" >
					<view class="title">
						<image src="/static/images/goodsDelivery/member_taocan_left.png" mode="widthFix" class="member_taocan_left"></image>
						<text class="title-text">选择VIP会员套餐</text>
						<image src="/static/images/goodsDelivery/member_taocan_right.png" mode="widthFix" class="member_taocan_right"></image>
					</view>
					
					<scroll-view :scroll-x="true" class="scroll_x" :scroll-y="false">
						<view class="dataWhole">
							<view v-for="(item, index) in dataArr" class="dataItem" :class="{active: activeIndex == index}" @click="switchIndex(index)">
								
								<view v-if="item.setmdisc" class="tip_dotted">
									{{showSetmdisc(item.setmdisc)}}折
								</view>
								<view class="dataInner">
									<view class="name">{{item.setmname}}</view>
									<view style="flex: 1"/>
									<view class="otherPrice">
										<text class="unit">¥</text>
										<text class="priceNow">{{showfeePrice(item)}}</text>
									</view>
									<view style="flex: 1"/>
									<view class="price" :style="{opacity: item.setmdisc ? 1 : 0}">
										¥{{showPrice(item.setmfee)}}
										<view class="dotted" />
									</view>
								</view>
								
							</view>
						</view>
					</scroll-view>
					<!--特权-->
					<view class="title">
						<image src="/static/images/goodsDelivery/member_taocan_left.png" mode="widthFix" class="member_taocan_left"></image>
						<text class="title-text">特权对比</text>
						<image src="/static/images/goodsDelivery/member_taocan_right.png" mode="widthFix" class="member_taocan_right"></image>
					</view>
					<view class="power_list">
						<view class="power_item power_title">
							<view class="power_item_1 power_inner">套餐</view>
							<view class="power_item_2 power_inner">价格</view>
							<view class="power_item_3 power_inner">车队人数</view>
							<view class="power_item_4 power_inner">每天查看车源条数</view>
							<view class="line" />
						</view>
						<view class="power_item" v-for="item in powerList">
							<view class="power_item_1 power_inner">{{item.setmname}}</view>
							<view class="power_item_2 power_inner">{{showfeePrice(item)}}</view>
							<view class="power_item_3 power_inner">{{showPeopleNum(item.setmitems)}}</view>
							<view class="power_item_4 power_inner">{{showCarSourceNum(item.setmitems)}}</view>
							<view class="line" />
						</view>
					</view>
					<!--帮助中心-->
					<view class="title">
						<image src="/static/images/goodsDelivery/member_taocan_left.png" mode="widthFix" class="member_taocan_left"></image>
						<text class="title-text">帮助中心</text>
						<image src="/static/images/goodsDelivery/member_taocan_right.png" mode="widthFix" class="member_taocan_right"></image>
					</view>
					<view class="help">
						<view class="notice" @click="showHintPopup()">
							<image src="/static/images/goodsDelivery/help_icon.png" mode="widthFix" class="help_icon"></image>
							<text>同时购买多个套餐，时间如何计算？</text>
						</view>
						<view class="toMeiqia" @click="helpService">
							<text>客服咨询</text>
							<image src="/static/images/goodsDelivery/meiqia_right.png" mode="widthFix" class="meiqia_right"></image>
						</view>
					</view>
					<view style="height: 30rpx" />
				</scroll-view>
				<view class="fix-bottom">
					<view class="fix-btn" @click="toGetPerpayId">
						<text class="btn-price-text" v-if="dataArr.length > 0">¥{{showfeePrice(dataArr[activeIndex])}}</text>
						<text class="btn-text">确认协议并支付</text>
					</view>
					<view class="fix-tips" @click="toMemberPolicy">
						<text class="tips-text">支付即同意</text>
						<text class="tips-palicy">《会员协议》</text>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="hintPopup" type="center">
			<view class="popup-box">
				<view class="notice">
					<image src="/static/images/goodsDelivery/help_icon.png" mode="widthFix" class="help_icon"></image>
					<text>同时购买多个套餐，时间如何计算？</text>
				</view>
				<view class="pop-content">
					您好，已经是会员用户，在购买同等级套 餐时，时间顺延。升级会员时，则您当前 会员时间也会升级为新会员套餐。
				</view>
				<image src="/static/images/goodsDelivery/member-close.png" mode="widthFix" class="member-close" @click="closeHintPopup"></image>
			</view>
		</uni-popup>
		<uni-popup ref="contentPop" type="center">
			<view class="member_info">
				<image src="/static/images/goodsDelivery/member-close.png" mode="widthFix" class="member_close" @click="closeToast"></image>
				<view class="title">提示</view>
				<view class="content" v-if="exchangeStatus == 0">{{exchangeStatusTitle}}</view>
				<view class="content" v-else>尊贵的VIP会员，您本次已成功激活 会员套餐，快去体验吧！</view>
				<view class="btn" @click="closeToast">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship.js";
	import * as md5 from "@/utils/md5.js";
	const {KEYUTIL, KJUR, hextob64} = require('jsrsasign');
	export default {
		data() {
			return {
				dataArr: [],
				powerList: [],
				activeIndex: 0,
				userInfo: null,
				memberInfo: null,
				payParams: {},
				memberKey: '',
				exchangeStatus: null,
				exchangeStatusTitle: ''
			};
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) {
				uni.navigateBack()
			}else {
				this.userInfo = JSON.parse(userInfo);
				this.init(); //初始化套餐配置
				this.getMemberInfo(); //获取我的套餐
			}
		},
		onReady() {
		},
		methods: {
			toBack() {
				uni.navigateBack()
			},
			toShowPopup() {
				this.$refs.bugMemberPopup.open();
			},
			toClosePopup() {
				this.$refs.bugMemberPopup.close();
			},
			async init() {
				//获取套餐列表
				uni.showLoading();
				try{
					var res = await ship.postRequest("/cp/set/meal/base/list", {
						setmrole: 'cargo',
						setmdisp: 1,
					})
					uni.hideLoading();
					console.log(res, '套餐')
					if (res.retCode == "0000000") {
						var rspBody = res.rspBody;
						var arr = [];
						rspBody.forEach(item => {
							if (item.setmfree != 1) {
								arr.push(item)
							}
						})
						this.dataArr = arr;
						this.powerList = res.rspBody;
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			getMemberInfo() {
				var that = this;
				var userId = this.userInfo.userId;
				console.log(userId, 'aa')
				ship.postRequest("/cp/act/set/meal/queryByUser", {
					usersid: userId,
					setmchannel: "app",
					setmfree: 0,
				}).then(res => {
					console.log(res, 'aa');
					if (res.retCode == "0000000") {
						var arr = res.rspBody;
						that.memberInfo = arr.length > 0 ? arr[0] : null;
					}
				})
			},
			showfeePrice(item) {
				//判断是否有折扣
				if (item.setmdisc) {
					var setmfeedisc = item.setmfeedisc || 0;
					return setmfeedisc/1000
				} else {
					//没有折扣价取原价
					var setmfee = item.setmfee || 0;
					return setmfee/1000
				}
			},
			showPrice(price) {
				if (!price) {
					return '0'
				} else {
					return price/1000
				}
			},
			showSetmdisc(setmdisc) {
				return setmdisc * 10
			},
			showPeopleNum(peopleNum) {
				try{
					var people = JSON.parse(peopleNum);
					var carsourcenum = people.fleetmemsize;
					return carsourcenum.defval + '人'
				}catch(e){
					//TODO handle the exception
					return ''
				}
			},
			showCarSourceNum(peopleNum) {
				try{
					var people = JSON.parse(peopleNum);
					var fleetmemsize = people.carsourcenum;
					return fleetmemsize.defval + '条/天'
				}catch(e){
					//TODO handle the exception
					return ''
				}
			},
			switchIndex(index) {
				this.activeIndex = index;
			},
			toMemberPolicy() {
				uni.navigateTo({
					url: '/pages/allAgreement/memberPolicy'
				})
			},
			helpService() {
				var userCode =JSON.parse(uni.getStorageSync("userInfo")).attrs.userCode
				var userRole =JSON.parse(uni.getStorageSync("userRole")) == 1 ? '司机' : '货主'
				plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
					var appversion = wgtinfo.version
					uni.getSystemInfo({
						success(res) {
							var phoneversion = res.brand + '-' + res.model
							uni.navigateTo({
								url: '/pages/my/index/onlineService?appversion=' + appversion + '&phoneversion=' + phoneversion + '&userCode=' + userCode + '&userRole=' + userRole
							})
						}
					});
					
				})
			},
			showHintPopup() {
				this.$refs.hintPopup.open();
			},
			closeHintPopup() {
				this.$refs.hintPopup.close();
			},
			closeToast(){
				let that = this
				that.$refs.contentPop.close()
			},
			toGetPerpayId() {
				//充值
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
				let that = this;
				var memberInfo = this.memberInfo;
				var dataArr = this.dataArr;
				var activeIndex = this.activeIndex;
				var url = "", params = new Object();
				var setmfeedisc = dataArr[activeIndex].setmfeedisc; //折扣价
				var setmdisc = dataArr[activeIndex].setmdisc;  //折扣
				var setmfee = dataArr[activeIndex].setmfee  //原价
				var setmcode = dataArr[activeIndex].setmcode; //套餐代码
				var amount = 0;
				if (setmdisc) {
					amount = setmfeedisc/1000
				} else {
					amount = setmfee/1000
				}
				if (!memberInfo) {
					//套餐购买
					params = {
						amount: amount,
						typeNum: 51,
						payeeType: setmcode,
					}
				} else {
					var nowParse = new Date().getTime();
					var setmoffdatetime = memberInfo.setmoffdatetime;
					setmoffdatetime = setmoffdatetime.replace(/-/g, '/');
					var setmoffdate = new Date(setmoffdatetime).getTime();
					var dayBetween = setmoffdate - nowParse; 
					if (dayBetween > 0) {
						var memSetmcode = memberInfo.setmcode;
						if (setmcode == memSetmcode) {
							//买相同的套餐，续费
							params = {
								amount: amount,
								typeNum: 52,
								payeeType: setmcode,
							}
						} else {
							//升级套餐
							if (memSetmcode > setmcode) {
								uni.hideLoading();
								//不能购买等级低的套餐
								uni.showToast({
									title: '不能购买低等级的套餐',
									icon: 'none'
								})
								return;
							}
							
							params = {
								amount: amount,
								typeNum: 53,
								payeeType: setmcode,
							}
						}
					} else {
						//套餐过期后购买
						
						params = {
							amount: amount,
							typeNum: 51,
							payeeType: setmcode,
						}
					}
				}
				
				ship.postRequest('/dw/order/walletTopUp', params)
				.then(function (res) {
					console.log('下单结果', res)
					if(res.retCode == '0000000') {
						uni.hideLoading();
						that.payParams = res.rspBody;
						that.toWechtPay(res.rspBody.prepay_id);
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
				if (!prepayid) return;
				
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
				var memberInfo = this.memberInfo;
				var dataArr = this.dataArr;
				var activeIndex = this.activeIndex;
				var url = "", params = new Object();
				var setmfeedisc = dataArr[activeIndex].setmfeedisc; //折扣价
				var setmdisc = dataArr[activeIndex].setmdisc;  //折扣
				var setmfee = dataArr[activeIndex].setmfee  //原价
				var amount = 0;
				if (setmdisc) {
					amount = setmfeedisc/1000
				} else {
					amount = setmfee/1000
				}
				if (!memberInfo) {
					//套餐购买
					url = "/cp/act/set/meal/purchase";
					params = {
						amount: amount,
						typeNum: 51,
						usersid: that.userInfo.userId,
						setmchannel: 'app',
						setmcode: dataArr[activeIndex].setmcode,
						serialnumber: that.payParams.outTradeNo,
					}
				} else {
					var nowParse = new Date().getTime();
					var setmoffdatetime = memberInfo.setmoffdatetime;
					setmoffdatetime = setmoffdatetime.replace(/-/g, '/');
					var setmoffdate = new Date(setmoffdatetime).getTime();
					var dayBetween = setmoffdate - nowParse; 
					if (dayBetween > 0) {
						var setmcode = dataArr[activeIndex].setmcode;
						var memSetmcode = memberInfo.setmcode;
						if (setmcode == memSetmcode) {
							//买相同的套餐，续费
							url = "/cp/act/set/meal/renewal"
							params = {
								amount: amount,
								typeNum: 52,
								usersid: that.userInfo.userId,
								setmchannel: 'app',
								setmcode: dataArr[activeIndex].setmcode,
								serialnumber: that.payParams.outTradeNo,
							}
						} else {
							//升级套餐
							url = '/cp/act/set/meal/upgrade'
							params = {
								amount: amount,
								typeNum: 53,
								usersid: that.userInfo.userId,
								setmchannel: 'app',
								setmcode: dataArr[activeIndex].setmcode,
								serialnumber: that.payParams.outTradeNo,
							}
						}
					} else {
						//套餐过期后购买
						url = "/cp/act/set/meal/purchase";
						params = {
							amount: amount,
							typeNum: 51,
							usersid: that.userInfo.userId,
							setmchannel: 'app',
							setmcode: dataArr[activeIndex].setmcode,
							serialnumber: that.payParams.outTradeNo,
						}
					}
				}
				ship.postRequest(url, params).then(res => {
					console.log(res, '套餐购买成功')
					uni.hideLoading();
					if (res.retCode == "0000000") {
						that.getMemberInfo();
						uni.showToast({
							title: '支付成功',
							icon: 'none'
						})
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
		}
	}
</script>

<style lang="scss">
	.memberPromote {
		background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/newMemberBc.png');
		background-repeat: no-repeat;
		background-size: 100% 1624rpx;
		width: 100vw;
		height: 1624rpx;
		box-sizing: border-box;
		padding-top:120rpx;
		.backBtn {
			width: 40rpx;
			height: 40rpx;
			margin:0 0 0 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.icon {
				width: 20rpx;
				height: 34rpx;
			}
		}
		.newMemberHeadTitle {
			width: 100vw;
			height: 294rpx;
			display: block;
			margin-top:-20rpx;
		}
		.titleHint {
			margin:60rpx 0 12rpx 0;
			font-size: 28rpx;
			font-weight: 500;
			color: #ECBB78;
			line-height: 40rpx;
			text-align: center;
		}
		.newMemberArrow {
			width: 38rpx;
			height: 50rpx;
			display: block;
			margin: 0 auto;
		}
		.rightsInterestsBox {
			display: flex;
			flex-wrap: wrap;
			padding: 14rpx 51rpx 0 51rpx;
			.contentBox {
				width: 275rpx;
				height: 120rpx;
				background: #342F2C;
				border-radius: 8rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0 24rpx 32rpx 24rpx;
				.mun {
					font-size: 40rpx;
					font-weight: 500;
					color: #ECBB78;
				}
				.msg {
					font-size: 28rpx;
					font-weight: 500;
					color: #ECBB78;
				}
			}
		}
		.subHint {
			font-size: 40rpx;
			color: #ECBB78;
			line-height: 52rpx;
			text-align: center;
		}
		.showPopupBtn {
			width: 522rpx;
			height: 86rpx;
			background: linear-gradient(180deg, #F9DB9F 0%, #E9B571 100%);
			border-radius: 134rpx;
			margin: 100rpx auto 0 auto;
			font-size: 40rpx;
			font-weight: 500;
			color: #000000;
			line-height: 86rpx;
			text-align: center;
		}
		.memberPopupBox {
			.closePopupBtn {
				padding:0 34rpx 12rpx 0;
				display: flex;
				justify-content: flex-end;
				.icon {
					width: 62rpx;
					height:62rpx;
				}
			}
			.center_view {
				height: calc(100vh - 780rpx);
				width: 100vw;
				background-image: linear-gradient(to bottom, #252633, #1B1B20);
				.title {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					margin-top: 40rpx;
					font-weight: 600;
					font-size: 40rpx;
					line-height: 47rpx;
					height: 56rpx;
					.member_taocan_left {
						width: 72rpx;
						margin-right: 26rpx;
					}
					.member_taocan_right {
						width: 72rpx;
						margin-left: 26rpx;
					}
					.title-text {
						color: #F0A986;
						background-image: linear-gradient(to right,#F1CFBD, #F0A986);
						background-clip: text;
					}
				}
				.scroll_x {
					white-space: nowrap;
					.dataWhole {
						height: 280rpx;
						padding-top: 30rpx;
						box-sizing: border-box;
					}
					.dataItem {
						width: 206rpx;
						height: 250rpx;
						margin-right: 10rpx;
						display: inline-block;
						box-sizing: border-box;
						background-image: url("/static/images/goodsDelivery/taocan_bg_default.png");
						background-position: 100%;
						background-size: cover;
						position: relative;
						overflow: visible;
						.tip_dotted {
							position: absolute;
							top: -20rpx;
							right: -5rpx;
							width: 74rpx;
							height: 28rpx;
							border-radius: 84rpx;
							background-image: linear-gradient(to right, rgba(235, 99, 71, 1), rgba(234, 77, 68, 1));
							font-size: 20rpx;
							color: #FFFFFF;
							display: flex;
							justify-content: center;
							align-items: center;
							z-index: 1;
							font-weight: 500;
						}
						&.active {
							background-image: url("/static/images/goodsDelivery/taocan_bg_active.png");
							.dataInner {
								.name {
									color: #60463A;
								}
								.otherPrice {
									color: #411D0D;
								}
								.price {
									color: rgba(65, 29, 13, 0.87);
									.dotted {
										background-color: rgba(65, 29, 13, 0.87)
									}
								}
							}
							
						}
						&:first-child {
							margin-left: 36rpx;
						}
						&:last-child {
							margin-right: 36rpx;
						}
						.dataInner {
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							width: 206rpx;
							height: 250rpx;
							padding: 6rpx;
							box-sizing: border-box;
							.name {
								height: 40rpx;
								line-height: 40rpx;
								font-size: 20rpx;
								color: #CCBAA5;
								font-weight: 500;
							}
							.otherPrice {
								display: flex;
								flex-direction: row;
								justify-content: center;
								align-items: baseline;
								font-weight: 500;
								color: #CCBAA5;
								
								.unit {
									font-size: 28rpx;
								}
								.priceNow {
									font-size: 65rpx;
									line-height: 100rpx;
								}
							}
							
							.price {
								margin-bottom: 16rpx;
								color: #817E7A;
								font-size: 40rpx;
								font-weight: 400;
								position: relative;
								
								.dotted {
									position: absolute;
									width: 100%;
									height: 2rpx;
									left: 0;
									top: 25rpx;
									background-color: rgba(129, 126, 122, 1);
									z-index: 1;
								}
							}
						}
						
					}
				}
				.power_list {
					margin: 32rpx 36rpx 0;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border: 2rpx solid  #805C50;
					background-color: #282833;
					border-radius: 24rpx;
					padding: 22rpx 26rpx 28rpx;
					color: rgba(242, 205, 183, 1);
					font-size: 28rpx;
					font-weight: 600;
					position: relative;
					box-sizing: border-box;
					&::after {
						content: "";
						position: absolute;
						left: 190rpx;
						top: 22rpx;
						bottom: 28rpx;
						width: 1rpx;
						background-image: linear-gradient(to bottom, rgba(115, 95, 90, 1), rgba(228, 185, 165, 1), rgba(138, 101, 88, 1));
						z-index: 1;
					}
					.power_item {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						width: calc(100vw - 122rpx);
						position: relative;
						&:last-child {
							.line {
								height: 0;
							}
						}
						.line {
							position: absolute;
							left: 0;
							right: 0;
							bottom: 0;
							height: 2rpx;
							width: calc(100vw - 122rpx);
							background-image: linear-gradient(to right, rgba(115, 95, 90, 1), rgba(228, 185, 165, 1), rgba(138, 101, 88, 1));
							background-position: 100%;
							background-size: cover;
							z-index: 9;
						}
						&.power_title {
							font-size: 24rpx;
						}
						.power_inner {
							display: flex;
							justify-content: center;
							align-items: center;
							height: 80rpx;
							&.power_item_1 {
								width: 164rpx;
							}
							&.power_item_2 {
								flex: 1;
							}
							&.power_item_3 {
								flex: 1;
							}
							&.power_item_4 {
								width: 192rpx;
							}
						}
					}
				}
				.help {
					height: 198rpx;
					background-color: rgba(39, 39, 50, 1);
					margin: 22rpx 36rpx 0;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-radius: 24rpx;
					
					.notice {
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						color: rgba(240, 169, 134, 1);
						font-size: 32rpx;
						font-weight: 600;
						.help_icon {
							width: 50rpx;
							margin-right: 10rpx;
						}
					}
					.toMeiqia {
						width: 370rpx;
						height: 62rpx;
						margin-top: 24rpx;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						color: rgba(241, 176, 144, 1);
						font-size: 32rpx;
						font-weight: 600;
						background-color: rgba(28, 28, 33, 1);
						border-radius: 140rpx;
						box-sizing: border-box;
						position: relative;
						.meiqia_right {
							width: 10rpx;
							margin-left: 12rpx;
						}
						&::before {
							content: " ";
							position: absolute;
							z-index: 1;
							top: 0;
							left: 0;
							width: 200%;
							height: 200%;
							border: 2rpx solid #C89F8D;
							border-radius: 140rpx;
							transform-origin: 0 0;
							transform: scale(0.5);
						}
					}
				}
			}
			
			.fix-bottom {
				width: 100vw;
				height: 232rpx;
				background-color: #272732;
				box-shadow: 0 -6rpx 48rpx 2rpx #69594A; 
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.fix-btn {
					background-image: url("/static/images/goodsDelivery/member_fix_icon.png");
					background-position: 100%;
					background-size: cover;
					width: calc(100vw - 112rpx);
					height: 110rpx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					color: #000000;
					font-weight: 600;
					.btn-price-text {
						font-size: 48rpx;
					}
					.btn-text {
						padding-left: 26rpx;
						font-size: 40rpx;
						
					}
				}
				.fix-tips {
					margin-top: 28rpx;
					color: #898998;
					font-size: 20rpx;
					.tips-palicy {
						font-weight: 500;
					}
				}
			}
		}
		.popup-box {
			width: calc(100vw - 72rpx);
			height: 344rpx;
			// border: 4rpx solid #805C50;
			position: relative;
			// background-color: #282833;
			background-image: url("/static/images/goodsDelivery/member_alert_bg.png");
			background-position: 100%;
			background-size: cover;
			border-radius: 24rpx;
			.notice {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				color: rgba(240, 169, 134, 1);
				font-size: 32rpx;
				font-weight: 600;
				padding: 48rpx 54rpx 44rpx;
				box-sizing: border-box;
				.help_icon {
					width: 50rpx;
					margin-right: 10rpx;
				}
				.member_input{
					width: 500rpx;
					display: flex;
					align-items: center;
					.msg{
						width: 120rpx;
					}
					.priceInput{
						flex: 1;
						height: 66rpx;
						font-size: 48rpx;
						color: #FFFFFF;
					}
					.bg{
						flex: 1;
						height: 2rpx;
						background-image: linear-gradient(to right,#735F5A,#E4B9A5,#8A6558);
					}
				}
				.fix-btn {
					background-image: url("/static/images/goodsDelivery/member_fix_icon.png");
					background-position: 100%;
					background-size: cover;
					width:478rpx;
					height: 83rpx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					color: #000000;
					font-weight: 600;
					.btn-price-text {
						font-size: 48rpx;
					}
					.btn-text {
						padding-left: 26rpx;
						font-size: 40rpx;
						
					}
				}
			}
			.pop-content {
				color: #F0A986;
				font-size: 32rpx;
				line-height: 38rpx;
				letter-spacing: 2rpx;
				padding: 0 68rpx 0 34rpx;
				box-sizing: border-box;
			}
			.member-close {
				width: 48rpx;
				position: absolute;
				top: -68rpx;
				right: 0;
				z-index: 1;
			}
			
			
		}
	}
</style>
