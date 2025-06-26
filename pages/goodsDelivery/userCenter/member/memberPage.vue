<template>
	<view class="memberPage">
		<view class="header">
			<view class="header_bg">
				<view class="back_content" @click="back">
					<image src="/static/images/goodsDelivery/member_back.png" mode="widthFix" class="back"></image>
				</view>
				<view class="member_title">
					<image src="/static/images/goodsDelivery/member_icon.png" mode="widthFix" class="member_icon"></image>
					<view class="history" @click="goHistory">
						<image src="/static/images/goodsDelivery/member_history_icon.png" mode="widthFix" class="member_history_icon"></image>
						<text>购买记录</text>
					</view>
				</view>
				<view class="member_title" style="position: absolute;z-index: 10;right: 0rpx;margin-top: -1rpx;" >
					<view class="history" style="margin-left: auto;width: 210rpx;" @click="exchangeMember">
						<image src="/static/images/goodsDelivery/member_card.png" style="width: 36rpx;height: 36rpx;" mode="widthFix" class="member_history_icon"></image>
						<text>实体卡激活</text>
					</view>
				</view>
			</view>
			
			<view class="head_content">
				
				<image :src="showAvatar()" mode="widthFix" class="avatar" :style="getAvatarHeight()"></image>
				
				
				<view class="info" :style="getAvatarHeight()">
					<text class="main_title">{{userInfo.userName}}</text>
					<view class="sub" v-if="memberInfo && memberInfo.setmfree != 1">
						<text>{{memberInfo.setmname}}：</text>
						<text>{{overDate()}}</text>
					</view>
					<text class="sub" v-else>普通用户</text>
				</view>
			</view>
		</view>
		<scroll-view class="center_view" :scroll-y="true">
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
				<view class="notice" @click="showPopup()">
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
		<uni-popup ref="exchange" type="center">
			<view class="popup-box" style="height: 450rpx;margin-top: 54rpx;background-repeat: no-repeat;background-size: 100% 100%;">
				<view class="notice" style="display: block;width: 100%;padding: 68rpx 70rpx 0 70rpx;text-align: center;box-sizing: border-box;">
					<view>请输入您实体卡的卡密，用于</view>
					<view style="margin-top: 20rpx;">激活您的货主会员</view>
					<view class="member_input" style="margin-top: 40rpx;">
						<view class="msg">卡密: </view>
						<input class="priceInput" v-model="memberKey" @input="priceChange"/>
					</view>
					<view class="member_input">
						<view class="msg"></view>
						<view class="bg"></view>
					</view>
					<view class="fix-btn" style="margin: 40rpx auto 0 auto;" @click="handleExchange">
						<text class="btn-text">确认激活</text>
					</view>
				</view>
				<image src="/static/images/goodsDelivery/member-close.png" mode="widthFix" class="member-close" @click="closeExchange"></image>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="center">
			<view class="popup-box">
				<view class="notice">
					<image src="/static/images/goodsDelivery/help_icon.png" mode="widthFix" class="help_icon"></image>
					<text>同时购买多个套餐，时间如何计算？</text>
				</view>
				<view class="pop-content">
					您好，已经是会员用户，在购买同等级套 餐时，时间顺延。升级会员时，则您当前 会员时间也会升级为新会员套餐。
				</view>
				<image src="/static/images/goodsDelivery/member-close.png" mode="widthFix" class="member-close" @click="closePopup"></image>
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
	import * as ship from "@/utils/ship"
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
				fromPage: '',
				memberKey: '',
				exchangeStatus: null,
				exchangeStatusTitle: ''
			}
		},
		onLoad(option) {
			this.fromPage = option.pageName ? option.pageName : '';
			var userInfo = uni.getStorageSync("userInfo");
			console.log(userInfo, 'aaaaaaaaaa');
			if (!userInfo) return;
			this.userInfo = JSON.parse(userInfo);
			this.init(); //初始化套餐配置
			
		},
		onShow() {
			this.getMemberInfo(); //获取我的套餐
		},
		methods: {
			closeToast(){
				let that = this
				that.$refs.contentPop.close()
			},
			async handleExchange(){
				let that = this
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				console.log(userInfo)
				let data = {
					cardPassword: that.memberKey,
					activeUserSid: userInfo.userId
				}
				if(!data.cardPassword){
				  uni.showToast({
					title: '请输入正确卡密',
					icon: 'none'
				  })
				  return
				}
				console.log(data)
				uni.showLoading({
					title:"兑换中"
				})
				let  res = await ship.postRequest('/cp/member/log/cardActive',data)
				uni.hideLoading()
				console.log(res)
				if(res.retCode == '0000000'){
					that.exchangeStatus = 1
          that.memberKey = ""
					that.$refs.exchange.close()
					that.getMemberInfo()
				}else{
					that.exchangeStatus = 0
					that.exchangeStatusTitle = res.retDesc
				}
				that.$refs.contentPop.open()
			},
			priceChange(val){
				let that = this;
				that.$nextTick(() => {
					that.memberKey = that.memberKey.replace(/[^\w_]/g,'');
				})
			},
			closeExchange(){
				let that = this
        that.memberKey = ""
				that.$refs.exchange.close()
			},
			exchangeMember(){
				let that = this
				that.$refs.exchange.open()
			},
			toMemberPolicy() {
				uni.navigateTo({
					url: '/pages/allAgreement/memberPolicy'
				})
			},
			overDate() {
				var memberInfo = this.memberInfo; 
				 var nowParse = new Date().getTime();
				 var setmoffdatetime = memberInfo.setmoffdatetime;
				 setmoffdatetime = setmoffdatetime.replace(/-/g, '/');
				 var setmoffdate = new Date(setmoffdatetime).getTime();
				 var dayBetween = setmoffdate - nowParse;
				 console.log(dayBetween, 'aaaaa')
				 if (dayBetween > 0) {
				 	return '有效期至' + memberInfo.setmoffdatetime;
				 } else {
				 	return "已到期";
				 }
			},
			showAvatar() {
				var memberInfo = this.memberInfo;
				if (memberInfo) {
					var setmcode = memberInfo.setmcode;
					console.log(setmcode, 'aaa');
					if (setmcode == "202204131313271490000050000010000000077002900017630") {
						//月套餐
						return 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/goodsDelivery/member-avatar_1.png'
					} else if (setmcode == "202204131313271490000050000010000000077002900017631") {
						return 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/goodsDelivery/member-avatar_2.png'
					} else if (setmcode == "202204131313271490000050000010000000077002900017632") {
						return 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/goodsDelivery/member-avatar_3.png'
					} else if (setmcode == "202204131313271490000050000010000000077002900017633") {
						return 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/goodsDelivery/member-avatar_4.png'
					} else if (setmcode == '202204131313271490000050000010000000077002900017634') {
						return 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/goodsDelivery/member-avatar_5.png'
					} else if (setmcode == '202204131313271490000050000010000000077002900017635') {
						return 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/goodsDelivery/member-avatar_6.png'
					} else {
						return 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/goodsDelivery/member-avatar_0.png'
					}
				} else {
					return '/static/images/goodsDelivery/member-avatar_0.png'
				}
			},
			getAvatarHeight() {
				var memberInfo = this.memberInfo;
				if (memberInfo) {
					var setmcode = memberInfo.setmcode;
					// console.log(setmcode, 'aaa');
					if (setmcode == "202204131313271490000050000010000000077002900017630") {
						//月套餐
						return 'height:241rpx'
					} else if (setmcode == "202204131313271490000050000010000000077002900017631") {
						return 'height: 227rpx'
					} else if (setmcode == "202204131313271490000050000010000000077002900017632") {
						return 'height: 235rpx'
					} else if (setmcode == "202204131313271490000050000010000000077002900017633") {
						return 'height: 257rpx'
					} else if (setmcode == '202204131313271490000050000010000000077002900017634') {
						return 'height: 260rpx'
					} else if (setmcode == '202204131313271490000050000010000000077002900017635') {
						return 'height: 268rpx'
					} else {
						return 'height: 244rpx'
					}
				} else {
					return 'height: 244rpx'
				}
			},
			back() {
				console.log('back')
				uni.navigateBack({
					delta: 1
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
			switchIndex(index) {
				this.activeIndex = index;
			},
			goHistory() {
				uni.navigateTo({
					url: './buyHistory'
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
			showPopup() {
				this.$refs.popup.open();
			},
			closePopup() {
				this.$refs.popup.close();
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
				// let params = {
				// 	"amount": this.priceNum,
				// 	"typeNum": this.userRole
				// }
				// console.log('下单参数', params);
				// uni.showLoading({
				// 	title: '充值中...',
				// 	mask: true,
				// })
				// let that = this;
				// utils.postRequest('/dw/order/walletTopUp', params)
				// .then(function (res) {
				// 	console.log('下单结果', res)
				// 	if(res.retCode == '0000000') {
				// 		uni.hideLoading();
				// 		that.toWechtPay(res.rspBody);
				// 	}else {
				// 		uni.hideLoading();
				// 		uni.showToast({
				// 			title: res.retDesc,
				// 			icon: 'none'
				// 		})
				// 	}
				// })
				// .catch(err=>{
				// 	uni.hideLoading();
				// 	console.log((err))
				// })
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
						
						that.$nextTick(function(){
							if(that.fromPage) {
								setTimeout(()=>{
									uni.navigateBack();
								}, 1500)
							}
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

<style scoped lang="scss">
	.memberPage {
		.scroll_x {
			::-webkit-scrollbar{
				width: 0;
				height: 0;
				color: transparent;
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
		
		.header {
			width: 100vw;
			height: 562rpx;
			background-color: #1E1F27;
			position: relative;
		}
		.header_bg {
			width: 100vw;
			height: 512rpx;
			background-image: url("/static/images/goodsDelivery/member_top_bg.png");
			background-position: 100%;
			background-size: cover;
			padding-top: 112rpx;
			box-sizing: border-box;
			.back_content {
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
				margin-left: 42rpx;
				position: relative;
				z-index: 2;
				.back {
					width: 16rpx;
				}
			}
			.member_title {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				height: 82rpx;
				margin-top: 36rpx;
				padding: 0 36rpx 0 32rpx;
				.member_icon {
					width: 382rpx;
				}
				.history {
					width: 180rpx;
					height: 66rpx;
					border-radius: 104rpx;
					background-image: linear-gradient(to right, #F1D9CA, #F1A47E);
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					color: #000000;
					font-size: 26rpx;
					font-weight: 400;
					.member_history_icon {
						width: 24rpx;
						margin-right: 8rpx;
					}
				}
			}
		}
		.head_content {
			position: absolute;
			top: 274rpx;
			left: 0;
			z-index: 1;
			height: 268rpx;
			width: 100vw;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 0 26rpx;
			box-sizing: border-box;
			.avatar {
				width: 226rpx;
				transform: scale(2.5);
			}
			.info {
				height: 268rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				color: #FFFFFF;
				padding-left: 20rpx;
				.main_title {
					font-size: 40rpx;
					font-weight: 600;
				}
				.sub {
					font-size: 24rpx;
					margin-top: 24rpx;
				}
			}
		}
		.center_view {
			height: calc(100vh - 794rpx);
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
				// background-image: url("/static/images/goodsDelivery/power_bg.png");
				// background-position: 100%;
				// background-size: contain;
				// background-repeat: no-repeat;
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
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 1;
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
  .member_info{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 618rpx;
    height: 400rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
	text-align: center;
	.member_close{
		width: 48rpx;
		position: absolute;
		top: -68rpx;
		right: 0;
		z-index: 1;
	}
    .title{
	
      margin-top: 40rpx;
      font-size: 44rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    .content{
		line-height: 44rpx;
      margin: 32rpx auto 32rpx auto;
      text-align: center;
      width: 546rpx;
      height: 88rpx;
      font-size: 36rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
    }
    .btn{
      display: flex;
      justify-content: center;
      align-items: center;
		margin: 50rpx auto 0 auto;
	  width: 400rpx;
	  height: 80rpx;
    background: #2B72F0;
    border-radius: 16rpx;
	  font-size: 32rpx;
	  font-family: PingFang SC-Medium, PingFang SC;
	  font-weight: 500;
	  color: #FFFFFF;
    }
  }
</style>
