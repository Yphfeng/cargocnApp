<template>
	<view class="userCenter">
		<view class="settingImg">
			<image class="setting" src="../../../static/images/goodsDelivery/setting.png" @tap="jumpToSetting()">
			</image>
		</view>
		<view class="userMsgBox">
			<view class="avatar">
				<image :src="userInfo.attrs.avatar" class="notLoginIcon" v-if="userInfo && userInfo.attrs.avatar">
				</image>
				<image class="notLoginIcon" v-else src="../../../static/images/goodsDelivery/shipUserLogo.png"></image>
			</view>
			<view class="userMessage" v-if="userInfo">
				<view class="msgRow">
					<view class="userMobile">{{showUserMobile(userInfo.mobile)}}</view>
					<view v-if="!userInfo.attrs.identityVerify || !userInfo.attrs.faceVerify" class="notIdACMsg"
						@click="jumpToNextPage(1)">未认证</view>
					<image class="largeRightIcon" v-if="!userInfo.attrs.identityVerify || !userInfo.attrs.faceVerify"
						src="../../../static/images/goodsDelivery/icon_right.png"></image>
					<view v-if="userInfo.attrs.identityVerify && userInfo.attrs.faceVerify" class="identityVerifyMsgSyb">已实名
					</view>
				</view>
				<view class="msgRow">
					<!-- <view class="userMsg">铜牌</view> -->
					<view class="userMsg">货主号：{{userInfo.attrs.userCode}}</view>
				</view>
			</view>
			<view class="userMessage" v-if="!userInfo" @tap="toLogin">
				<view class="msgRow">
					<view class="unLogin">注册/登录</view>
					<image class="rightIcon"
						src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/blackRightIcon.png"></image>
				</view>
			</view>
		</view>
		<view v-if="userInfo && (!userInfo.attrs.identityVerify || !userInfo.attrs.faceVerify)" class="notIdACBox">
			<view class="hint">您还未实名认证，快去认证吧</view>
			<view class="btn" @click="jumpToNextPage(1)">去认证</view>
		</view>
		<view v-if="isMemberOpen">
			
			<view class="member" v-if="!isHasMember">
				<view class="tips">解锁搜车源、私域运力池会员特权></view>
				<view class="memberPage" @click="toMember">
					<view class="member_arrow">
						<view>去开通</view>
						<image src="/static/images/goodsDelivery/member_arrow_right.png" mode="widthFix" class="member_arrow_right"></image>
									
					</view>
					
				</view>
			</view>
			<view class="member hasMember" v-if="isHasMember" @click="toMember">
				
				<view v-if="isOverDate" class="overDate"><view class="overText">已到期</view></view>
				
			</view>
		</view>
		<view class="contentBorder">
			<view class="userContentBox">
				<view class="contentTitle">
					<view class="title">我的钱包</view>
					<view class="moreBtnGroup" @tap="jumpToUserWallet()">
						进入钱包
						<image class="moreIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
					</view>
				</view>
				<view class="walletBox">
					<view class="walletNum">
						<view class="num" style="padding-right:14rpx;">{{showPrice(walletAmount)}}</view>
						<view class="hint">余额（元）</view>
					</view>
					<view class="line"></view>
					<view class="walletNum">
						<view class="num">{{points}}</view>
						<view class="hint">积分</view>
					</view>
				</view>
			</view>
		</view>
		<view class="userContentBox" style="margin: 24rpx 16rpx 20rpx 16rpx;">
			<view class="contentTitle">
				<view class="title">其他服务</view>
			</view>
			<view class="otherServiceBox">
				<view class="serviceBtn" @click="jumpToNextPage(1)">
					<image class="icon" src="../../../static/images/goodsDelivery/userIcon1.png"></image>
					<view class="msg">实名认证</view>
				</view>
				<view class="serviceBtn" @click="jumpToNextPage(2)">
					<image class="icon" src="../../../static/images/goodsDelivery/userIcon2.png"></image>
					<view class="msg">企业认证</view>
				</view>
				<view class="serviceBtn" @click="jumpToNextPage(3)">
					<image class="icon" src="../../../static/images/goodsDelivery/userIcon3.png"></image>
					<view class="msg">帮助与客服</view>
				</view>
				<!-- <view class="serviceBtn" @click="jumpToNextPage(4)">
					<image class="icon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/hzServiceIcon4.png"></image>
					<view class="msg">投诉记录</view>
				</view> -->
				<view class="serviceBtn" @click="jumpToNextPage(5)">
					<image class="icon" src="../../../static/images/goodsDelivery/userIcon4.png"></image>
					<view class="msg">邀请好友</view>
				</view>
				<view class="serviceBtn" @click="jumpToNextPage(6)">
					<image class="icon" src="../../../static/images/goodsDelivery/userIcon5.png"></image>
					<view class="msg">输入邀请码</view>
				</view>
				<!-- <view class="serviceBtn" @click="goFleetCreate">
					<image class="icon-fleet" src="../../../static/images/creatCarTeam.png" mode="widthFix"></image>
					<view class="msg">我的车队</view>
				</view> -->
				<view class="serviceBtn" @click="goPartner">
					<image class="icon" src="../../../static/images/goodsDelivery/partnerIcon.png" mode="widthFix">
					</image>
					<view class="msg">伙伴圈</view>
				</view>
				<view class="serviceBtn" @click="showWxCode">
					<image class="icon" style="width: 50rpx;height: 50rpx;margin-top: 10rpx" src="../../../static/images/wx-cargo.png"></image>
					<view class="msg" style="margin-top: 10rpx">客服微信</view>
				</view>
				<view class="serviceBtn" @click="exchangeMember">
					<image class="icon" style="width: 50rpx;height: 50rpx;margin-top: 10rpx" src="../../../static/images/exchangeMember_icon.png"></image>
					<view class="msg" style="margin-top: 10rpx">会员激活</view>
				</view>
				<view class="serviceBtn" @click="testDuDu">
					<image class="icon" style="width: 50rpx;height: 50rpx;margin-top: 10rpx" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/ship_1.png" mode="widthFix"></image>
					<view class="msg">推广赚钱</view>
				</view>
				<view class="serviceBtn" @click="buyMember">
					<image class="icon" style="width: 50rpx;height: 50rpx;margin-top: 10rpx" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/ship_member.png" mode="widthFix"></image>
					<view class="msg">会员购买</view>
				</view>
				<!-- <view class="serviceBtn" @click="serviceStation">
					<image class="icon" style="width: 50rpx;height: 50rpx;margin-top: 10rpx" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/serviceStation.png" mode="widthFix"></image>
					<view class="msg">服务站</view>
				</view> -->
				<view class="serviceBtn" @click="jumpToWaybill">
					<image class="icon" style="width: 50rpx;height: 50rpx;margin-top: 10rpx" src="../../../static/images/shipWaybill.png" mode="widthFix"></image>
					<view class="msg">运单</view>
				</view>
			<!-- 	<view class="serviceBtn" @click="goPrint">
					<image class="icon" src="../../../static/images/goodsDelivery/partnerIcon.png" mode="widthFix"></image>
					<view class="msg">零担打印</view>
				</view> -->
			</view>
		</view>


		<!-- <view class="advertisingBox">
			广告模块
		</view> -->
		<view class="advImgList" v-if="leftRightObj && (leftRightObj[0].advUrl || leftRightObj[1].advUrl)">
			<image class="advImg" v-for="(item, index) in leftRightObj" :key="index" v-if="index == '0' || index == '2'"
				:src="item.advUrl" @click="jumpToApiUrl(item)"></image>
		</view>
		<image class="advertisingImage" :src="myBanner.advUrl" v-if="myBanner && myBanner.advUrl"
			@click="jumpToApiUrl(myBanner)"></image>

		<view class="serviceMobile" style="color: #338fe5" @click="requestPower">客服电话：400-016-0606</view>

		<view class="userVersionMsg" v-if="versionMsg">当前版本 v {{versionMsg}}</view>
		<uni-popup ref="certificationPopup" type="center">
			<view class="hintPopup">
				<view class="hintTitle">温馨提示</view>
				<view class="hintMsg">
					请完成实名认证
				</view>
				<view class="btn" @click="jumpToNextPage(1)">前往认证</view>
			</view>
		</uni-popup>
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
		<uni-popup ref="contentPop" type="center">
			<view class="member_info">
				<image src="/static/images/goodsDelivery/member-close.png" mode="widthFix" class="member_close" @click="closeToast"></image>
				<view class="title">提示</view>
				<view class="content" v-if="exchangeStatus == 0">{{exchangeStatusTitle}}</view>
				<view class="content" v-else>尊贵的VIP会员，您本次已成功激活 会员套餐，快去体验吧！</view>
				<view class="btn" @click="closeToast">确定</view>
			</view>
		</uni-popup>
		<view
      @click="closeMask"
      class="mask"
      :style="{ opacity: isShowTran ? 1 : 0 }"
      v-show="isShowWxCode"
    >
      <view
        class="dialog"
        @click.stop
        :style="{ bottom: isShowDialog ? '0' : '-100vh' }"
      >
        <image
          @click="closeMask"
          class="close_btn"
          src="../../../static/images/uploadReport/close.png"
        ></image>
        <image
          class="head_img"
          src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/head_cargo.png"
        ></image>
        <view class="dialog_nickname">菲菲</view>
        <view class="dialog_text">保存到手机后，打开微信扫码添加</view>
        <image
          class="qr_code"
          src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/qr_code_cargo.png"
        ></image>
        <view class="dialog_save_btn" @click="saveImg">保存</view>
				<view style="height: 50rpx"></view>
      </view>
    </view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	import * as utilsData from "@/utils/utils"
	var duduTaskModule = uni.requireNativePlugin("DuduTaskModule");
	export default {
		data() {
			return {
				isMemberOpen: false,
				userInfo: '',
				walletAmount: '',
				points: 0,
				advUrl: '',
				myBanner: '',
				leftRightObj: '',
				versionMsg: '',
				isShowWxCode: false,
				isShowTran: false,
				isShowDialog: false,
				isHasMember: 0, //是否是会员
				isOverDate: false, //会员是否过期
				memberKey: '', // 卡密
				exchangeStatus: null, // 兑换会员卡状态
				exchangeStatusTitle: '' // 兑换会员卡提示信息
			}
		},
		onLoad() {},
		onShow() {
			this.getLeftRightObj();
			this.getMyBannerObj();
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : undefined;
			console.log('用户信息', this.userInfo);
			if (!userInfo) {
				this.walletAmount = '';
				uni.navigateTo({
					url: '../../login/login/login'
				})
			} else {
				this.getAmountInfo();
				//获取积分信息
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					utils.postRequest("/yh/business/user/select/by/user/id?userId=" + this.userInfo.userId, {
						userId: this.userInfo.userId
					})
						.then(res => {
							console.log(res, '积分')
							if (res.retCode == "0000000") {
								this.points = res.rspBody.points;
							}
						}).catch(err => {
							console.log(err)
						})
				}
				
				
				//获取会员开关
				this.getMemberOpen();
				//获取会员信息
				this.getMemberInfo();

			}
			let that = this;
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				// console.log('应用版本号', wgtinfo.version);
				that.versionMsg = wgtinfo.version;
			})
		},
		onTabItemTap: function(e) {
			// console.log(e);
			// let that = this;
			// plus.cache.calculate(function(size) {  
			//     let sizeCache = parseInt(size);  
			//     if (sizeCache == 0) {  
			//         that.fileSizeString = "0B";  
			//     } else if (sizeCache < 1024) {  
			//         that.fileSizeString = sizeCache + "B";  
			//     } else if (sizeCache < 1048576) {  
			//         that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";  
			//     } else if (sizeCache < 1073741824) {  
			//         that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";  
			//     } else {  
			//         that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";  
			//     }
			// 	console.log('缓存大小', that.fileSizeString);
			// });  
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
					title:"兑换中。。。"
				})
				let  res = await utils.postRequest('/cp/member/log/cardActive',data)
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
			getMemberInfo() {
				var that = this;
				var userId = this.userInfo.userId;
				console.log(userId, 'aa')
				utils.postRequest("/cp/act/set/meal/queryByUser", {
					usersid: userId,
					setmchannel: "app",
					setmfree: 0,
				}).then(res => {
					console.log(res, 'aa11');
					if (res.retCode == "0000000") {
						var arr = res.rspBody;
						that.isHasMember = arr.length;
						if (arr.length > 0) {
							var setmoffdatetime = arr[0].setmoffdatetime;
							//判断是否过期
							var nowParse = new Date().getTime();
							setmoffdatetime = setmoffdatetime.replace(/-/g, '/');
							var setmoffdate = new Date(setmoffdatetime).getTime();
							var dayBetween = setmoffdate - nowParse;
							console.log(dayBetween, 'aaaaa')
							if (dayBetween > 0) {
								that.isOverDate = false;
							} else {
								that.isOverDate = true;
							}
						} else {
							
						}
						
						that.isOverDate = false;
					}
				}).catch(err => {
					console.log(err, 'aaaaaaa')
					
				})
			},
			saveImg() {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '将获取您的存储权限，以将二维码保存到您的相册',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: "请稍候...",
								mask: true,
							});
							uni.saveImageToPhotosAlbum({
								filePath:
									"https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/downImg-cargo.png",
								success: function () {
									console.log("save success");
									uni.hideLoading();
									uni.showToast({
										title: "保存成功",
										icon: "success",
									});
									that.closeMask();
								},
							});
						}
					}
				})
			
			},
			closeMask() {
				let that = this;
				that.isShowDialog = false;
				setTimeout(() => {
					that.isShowTran = false;
					setTimeout(() => {
						that.isShowWxCode = false;
					}, 100);
				}, 200);
			},
			showWxCode() {
				let that = this;
				that.isShowWxCode = true;
				setTimeout(() => {
					that.isShowTran = true;
					setTimeout(() => {
						that.isShowDialog = true;
					}, 100);
				}, 100);
			},
			requestPower() {
				var text = "我们将收集您的电话号码，便于您联系客服";
				publicData.requestPower(text, this.makePhone);
			},
			makePhone(){
				uni.makePhoneCall({
            phoneNumber:'400-016-0606' //仅为示例
       });
			},
			goFleetCreate() {
				//创建车队
				if (!utils.btnRepeat()) return false; // 防抖
				if (!publicData.getUserPermissions(1)) {
					this.$refs.certificationPopup.open();
					return false
				}; // 认证信息验证
				uni.navigateTo({
					url: '/pages/my/fleet/fleetList/fleetList'
				})
			},
			goPartner() {
				//创建车队
				if (!utils.btnRepeat()) return false; // 防抖
				if (!publicData.getUserPermissions(1)) {
					this.$refs.certificationPopup.open();
					return false
				}; // 认证信息验证
				uni.navigateTo({
					url: '../partnerGroup/partnerGroup'
				})
			},
			getLeftRightObj() {
				let params = {
					"locationCodeS": [
						"MY_SMALL_LEFT",
						"MY_BIG_LEFT",
						"MY_SMALL_RIGHT",
						"MY_BIG_RIGHT",
					]
				};
				let that = this;
				utils.postRequest('/ts/advertising/get_to_shipper', params)
					.then(function(res) {
						console.log('小广告数据', res);
						if (res.retCode == '0000000') {
							let items = res.rspBody;
							if (items && items.length > 0) {
								that.leftRightObj = items;
							}

						} else {
							console.log('广告图获取失败', res.retDesc);
						}
					})
					.catch(err => {
						console.log('广告图请求失败', res.retDesc);
					})
			},
			getMyBannerObj() {
				let params = {
					"locationCodeS": [
						"MY_SMALL_BANNER",
						"MY_BIG_BANNER"
					]
				};
				let that = this;
				utils.postRequest('/ts/advertising/get_to_shipper', params)
					.then(function(res) {
						console.log('大广告数据', res);
						if (res.retCode == '0000000') {
							let items = res.rspBody;
							if (items && items.length > 0) {
								that.myBanner = items[0];
							}

						} else {
							// console.log('广告图获取失败', res.retDesc);
						}
					})
					.catch(err => {
						// console.log('广告图请求失败', res.retDesc);
					})
			},
			getAmountInfo() {
				let that = this;
				utils.postRequest('/dw/wallet/getAmount')
					.then(res => {
						// console.log('钱包', res);
						if (res.retCode == '0000000') {
							that.walletAmount = res.rspBody.amount;
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none',
								duration: 3000
							})
						}
					})
					.catch(err => {
						console.log(err);
					})
			},
			showPrice(price) { // 金额展示
				return publicData.showPrice(price, 1000);
			},
			jumpToNextPage(flag) {
				if (!utils.btnRepeat()) return false; // 防抖
				if (!publicData.getUserPermissions()) return false; // 认证信息验证
				this.$refs.certificationPopup.close();
				switch (flag) {
					case 1:
						//判断是否有认证的身份证号码
						let that = this
						let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
						utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userInfo.attrs.userCode, {}, 'GET')
						.then(res => {
						  console.log('用户详细信息', res);
						  if (res.retCode == "0000000") {
							if (res.rspBody.idNo) {
							  uni.navigateTo({
								url: './identifyingUsers/identifyingUsers'
							  })
							} else {
							  uni.navigateTo({
								url: './identifyingUsers/identifyingNewUsers'
							  })
							}
						  } else {
							uni.navigateTo({
							  url: './identifyingUsers/identifyingNewUsers'
							})
						  }
						})
						break;
					case 2:
						uni.navigateTo({
							url: './enterpriseCertification/enterpriseCertification'
						});
						break;
					case 3:
						uni.navigateTo({
							url: '/pages/my/helpService/index'
						})
						break;
					case 4:
						// uni.navigateTo({
						// 	url: './complaintsRecord/complaintsRecord'
						// });
						break;
					case 5:
						uni.navigateTo({
							url: './invite/index'
						})
						break;
					case 6:
						uni.navigateTo({
							url: '/pages/my/invite/inviteCode?type=2'
						})
						break;
				}
			},
			showUserMobile(mobile) { // 隐藏用户手机号中间4位
				if (mobile) {
					return mobile.substr(0, 3) + '****' + mobile.substr(7);
				} else {
					return '未登录';
				}
			},
			jumpToUserWallet() {
				if (!utils.btnRepeat()) return false; // 防抖
				if (!publicData.getUserPermissions(1)) { // 认证信息验证
					this.$refs.certificationPopup.open();
					return false;
				}
				uni.navigateTo({
					url: 'userWallet/userWallet'
				})
			},
			toLogin() {
				if (!utils.btnRepeat()) return false; // 防抖
				let userRole = uni.getStorageSync('userRole');
				utils.loginSelf(userRole);
			},
			jumpToSetting() { // 测试用退出登录
				if (!utils.btnRepeat()) return false; // 防抖
				if (!publicData.getUserPermissions()) return false; // 认证信息验证
				uni.navigateTo({
					url: '../../my/settings/index'
				})
			},
			jumpToApiUrl(item) { // 跳转广告页的url
				let that = this;
				if (item.bigLinkUrl) {
					if (item.bigLinkType == 'route') {
						uni.navigateTo({
							url: item.bigLinkUrl
						})
					}
					if (item.bigLinkType == 'web') {
						getApp().globalData.promoteLinkUrl = item.bigLinkUrl;
						uni.navigateTo({
							url: '../../advertisingH5/advertisingH5'
						})
					}
				} else {
					uni.previewImage({
						urls: [item.bigAdvUrl],
						longPressActions: {
							itemList: ['保存图片'],
							success: function(data) {
								that.downFile(item.bigAdvUrl);
							},
							fail: function(err) {
								console.log(err.errMsg);
							}
						},
						success: function(data) {
							console.log(data);
						},
						fail: function(err) {
							console.log(err);
						}
					});
				}
			},
			downFile(imageUrl) {
				// 首先下载图片
				uni.downloadFile({
				  url: imageUrl,
				  success: downloadResult => {
				    if (downloadResult.statusCode === 200) {
				      // 下载成功，保存图片到系统相册
				      uni.saveImageToPhotosAlbum({
				        filePath: downloadResult.tempFilePath,
				        success: () => {
				          uni.showToast({
				            title: '图片保存成功'
				          });
				        },
				        fail: () => {
				          uni.showToast({
				            title: '图片保存失败',
				            icon: 'none'
				          });
				        }
				      });
				    }
				  },
				  fail: () => {
				    uni.showToast({
				      title: '图片下载失败',
				      icon: 'none'
				    });
				  }
				});
			},
			goPrint() { //打印
				uni.navigateTo({
					url: '/pages/goodsDelivery/LtlOrder/bleManager/bleConnect'
				})
			},
			testDuDu() {
				uni.navigateTo({
					url: "/pages/extension/extension_report/extension_report"
				})

			},
			buyMember() {
				uni.navigateTo({
					url: '/pages/goodsDelivery/shipPromote/memberPromote'
				})
			},
			toMember() {
				//跳转会员页
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage'
				})
			},
			//服务站跳转
			serviceStation(){
				console.log("服务站跳转");
				uni.navigateTo({
					url: '../../index/srevice/srevice'
				})
			},
			jumpToWaybill() {
				uni.navigateTo({
					url: '../waybill/waybill'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F3F3;
	}

	.userCenter {
		background-image: url(../../../static/images/goodsDelivery/userCenterBc.png);
		background-repeat: no-repeat;
		background-size: 750rpx 580rpx;
		min-height: 100vh;

		.settingImg {
			padding: 100rpx 40rpx 12rpx 0;
			display: flex;
			justify-content: flex-end;

			.setting {
				width: 40rpx;
				height: 46rpx;
			}
		}

		.userMsgBox {
			padding: 0 36rpx 32rpx 36rpx;
			display: flex;
			align-items: center;

			.avatar {
				width: 92rpx;
				height: 92rpx;
				border: 4rpx solid #FEFFFE;
				border-radius: 100%;
				overflow: hidden;
				// background: #DDDDDD;
				display: flex;
				align-items: center;
				justify-content: center;

				.notLoginIcon {
					width: 92rpx;
					height: 92rpx;
				}
			}

			.userMessage {
				flex: 1;
				padding-left: 36rpx;

				.msgRow+.msgRow {
					margin-top: 20rpx;
				}

				.msgRow {
					display: flex;
					align-items: center;

					.unLogin {
						font-size: 30rpx;
						color: #333333;
						line-height: 42rpx;
					}

					.rightIcon {
						width: 14rpx;
						height: 24rpx;
						margin-left: 14rpx
					}

					.userMobile {
						font-size: 40rpx;
						font-weight: bold;
						color: #FFF;
						line-height: 48rpx;
					}

					.notIdACMsg {
						padding: 0 12rpx 0 32rpx;
						font-size: 30rpx;
						color: #FFF;
					}

					.identityVerifyMsgSyb {
						margin-left: 32rpx;
						width: 108rpx;
						height: 46rpx;
						line-height: 46rpx;
						border-radius: 12rpx;
						border: 2rpx solid #FFF;
						font-size: 24rpx;
						color: #FFF;
						text-align: center;
					}

					.largeRightIcon {
						width: 24rpx;
						height: 24rpx;
					}

					.userMsg+.userMsg {
						margin-left: 94rpx;
					}

					.userMsg {
						font-size: 24rpx;
						color: #FFF;
						line-height: 34rpx;
					}
				}
			}
		}

		.notIdACBox {
			margin: 0 16rpx 24rpx 16rpx;
			padding: 0 24rpx 0 16rpx;
			height: 70rpx;
			background: rgba(255, 255, 255, 0.76);
			box-shadow: 0px 2rpx 10rpx 0px rgba(0, 178, 255, 0.12);
			border-radius: 12rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.hint {
				font-size: 24rpx;
				color: #0171F9;
			}

			.btn {
				width: 112rpx;
				height: 50rpx;
				line-height: 50rpx;
				background: #0171F9;
				border-radius: 12rpx;
				text-align: center;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}
		.member {
			width: calc(100vw - 36rpx);
			margin-left: 18rpx;
			height: 148rpx;
			background-image: url("/static/images/goodsDelivery/member_bg.png");
			background-position: 100%;
			background-size: cover;
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
			margin-bottom: 20rpx;
			&.hasMember {
				background-image: url("/static/images/goodsDelivery/my_has_member_icon.png");
			}
			.tips {
				margin-left: 32rpx;
				color: #9B9BA6;
				font-size: 28rpx;
				line-height: 44rpx;
				margin-bottom: 20rpx;
				
			}
			.overDate {
				width: calc(100vw - 36rpx);
				height: 148rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				color: #EDA27B;
				font-size: 28rpx;
				font-weight: 500;
				box-sizing: border-box;
				.overText {
					margin-right: 244rpx;
				}
			}
			.memberPage {
				height: 148rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				margin-right: 32rpx;
				.member_arrow {
					width: 162rpx;
					height: 48rpx;
					background-image: linear-gradient(to right, #F1D7C8, #F0A27C);
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					color: #422507;
					font-size: 28rpx;
					font-weight: 500;
					border-radius: 228rpx;
					.member_arrow_right {
						width: 28rpx;
						margin-left: 5rpx;
					}
				}
				
			}
			
		}

		.contentBorder {
			margin: 0 14rpx;
			padding: 2rpx;
			background: linear-gradient(to bottom, rgba(74, 162, 243, 0.37) 0%, rgba(192, 226, 252, 0) 35%, rgba(192, 226, 252, 0.1) 100%);
			border-radius: 12rpx;
		}

		.userContentBox {
			padding: 28rpx 28rpx 0 28rpx;
			background: #F9F9FB;
			box-shadow: 0px 2rpx 10rpx 0px rgba(120, 185, 214, 0.12);
			border-radius: 12rpx;

			.contentTitle {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.title {
					font-size: 30rpx;
					font-weight: 500;
					color: #333333;
					line-height: 42rpx;
				}

				.moreBtnGroup {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color: #AAAAAA;

					.moreIcon {
						width: 22rpx;
						height: 22rpx;
						margin-left: 20rpx;
					}
				}
			}

			.walletBox {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 40rpx 0;

				.walletNum {
					flex: 0.48;

					.num {
						text-align: center;
						font-size: 52rpx;
						font-weight: bold;
						color: #333333;
					}

					.hint {
						font-size: 26rpx;
						color: #AAAAAA;
						font-weight: 400;
						text-align: center;
						line-height: 36rpx;
					}
				}

				.line {
					width: 2rpx;
					height: 52rpx;
					background-color: #CAD4DA;
				}
			}

			.otherServiceBox {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				padding: 20rpx 0 12rpx;

				.serviceBtn {
					flex: 0 0 25%;
					margin-bottom: 22rpx;

					.icon {
						width: 80rpx;
						height: 68rpx;
						display: block;
						margin: 0 auto;
					}

					.icon-fleet {
						width: 80rpx;
						display: block;
						margin: 0 auto;
					}

					.msg {
						font-size: 24rpx;
						color: #646B73;
						line-height: 34rpx;
						text-align: center;
					}
				}
			}
		}

		.advertisingBox {
			margin: 0 16rpx;
			height: 234rpx;
			border-radius: 12rpx;
			background: linear-gradient(180deg, #74C1FD 0%, #4AA2F3 100%);
			line-height: 234rpx;
			font-size: 40rpx;
			color: #777;
			text-align: center;
		}

		.advertisingImage {
			margin: 0 16rpx 0 16rpx;
			height: 148rpx;
			width: 718rpx;
			border-radius: 12rpx;
			display: block;
		}

		.advImgList {
			margin: 0 16rpx 20rpx 16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.advImg {
				display: block;
				width: 342rpx;
				;
				height: 148rpx;
				border-radius: 12rpx;
			}
		}

		.userVersionMsg {
			// margin-top: 24rpx;
			// position: absolute;
			// bottom: 24rpx;
			// width: 100vw;
			text-align: center;
			font-size: 24rpx;
			color: #AAAAAA;
			line-height: 34rpx;
		}

		.hintPopup {
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 32rpx 28rpx 48rpx 28rpx;
			margin: 0 32rpx;
			width: 500rpx;
			box-sizing: border-box;

			.hintTitle {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				text-align: center;
			}

			.hintMsg {
				font-size: 28rpx;
				color: #707071;
				line-height: 40rpx;
				margin: 32rpx 0 112rpx 0;
				padding: 0 42rpx;
				text-align: center;

				.num {
					font-size: 28rpx;
					color: #4AA2F3;
				}
			}

			.btn {
				height: 88rpx;
				line-height: 88rpx;
				background-color: #4AA2F3;
				border-radius: 12rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}

		.serviceMobile {
			padding: 20rpx 20rpx 6rpx 20rpx;
			height: 50rpx;
			text-align: center;
			color: #777;
			font-size: 32rpx;
		}
	}
	.mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
    width: 100vw;
    height: 100vh;
    background: rgba(84, 84, 84, 0.58);
    opacity: 0;
    transition: opacity 0.2s;
    .dialog {
      position: absolute;
      width: 100vw;
      bottom: -100vh;
      left: 0;
      transition: bottom 0.2s;
      border-top-left-radius: 30rpx;
      border-top-right-radius: 30rpx;
      background: #ffffff;
      box-shadow: 0px 0px 16rpx 2rpx rgba(172, 203, 255, 0.19);
      text-align: center;
			overflow-y: scroll;
      .close_btn {
        position: absolute;
        width: 48rpx;
        height: 48rpx;
        top: 28rpx;
        right: 34rpx;
      }
      .head_img {
        margin-top: 50rpx;
        width: 136rpx;
        height: 136rpx;
        box-shadow: 0px 0px 12rpx 2rpx rgba(0, 0, 0, 0.14);
        border-radius: 50%;
        border: 6rpx solid #ffffff;
      }
      .dialog_nickname {
        margin-top: 20rpx;
        font-size: 40rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
      }
      .dialog_text {
        margin-top: 60rpx;
        font-size: 36rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .qr_code {
        margin-top: 66rpx;
        width: 240rpx;
        height: 240rpx;
      }
      .dialog_save_btn {
        margin: 66rpx auto 0 auto;
        width: 528rpx;
        height: 80rpx;
        background: #F75347;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        display: flex;
        justify-content: center;
        align-items: center;

				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;

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
