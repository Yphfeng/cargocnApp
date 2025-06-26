<template>
	<view class="businessCard">
		<view class="share_wx" @click="onShareBtn">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/share_wx_icon.png" class="share_wx_icon">
			</image>
			<text>分享至微信</text>
		</view>
		<view class="share_content">
			<view class="share_item" @click="toEdit">
				<view class="share_icon">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/card_edit_icon.png"
						class="share_icon_1"></image>
				</view>
				<text>编辑名片</text>
			</view>
			<view class="share_item" @click="toInMobile">
				<view class="share_icon">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/share_to_icon.png" class="share_icon_1">
					</image>
				</view>
				<text>分享至朋友圈</text>
			</view>
			<view class="share_item" @click="prevCard">
				<view class="share_icon">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/prev_card_icon.png"
						class="share_icon_1"></image>
				</view>
				<text>预览我的名片</text>
			</view>
		</view>
		<view class="line"></view>
		<view class="advBox">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/hby/hongbaoyu.png" @click="redPacket"
				mode="widthFix" class="adv"></image>
			<image @click="buyCargoBox" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/carGobanner_wechat.png"
				mode="widthFix" class="adv"></image>
			<!-- <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/adv.png"   mode="widthFix" class="adv"></image> -->
		</view>
		<view class="cargo-title" style="margin-top: 30rpx">
			<text class="label">我的常跑</text>
			<!-- <image src="{{taskStatus == 1 ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/onInLine.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/onUnLine.png'}}" mode="aspectFill" class="info-onLine"></image> -->
		</view>
		<view class="cargo-no-content">
			<view class="cargo-no-item">
				<view class="cargo-label">
					<view class="label">开</view>
					<view :class="['lenAndType' , params.carLength ? 'active' : 'default']" @click="showLenTypeDialog">
						{{params.carLength ? params.carCombo : '选择车型车长'}}
					</view>
				</view>
				<view class="saveSource" @click="saveCarSource">保存</view>
			</view>
			<view class="cargo-line"></view>
			<view class="cargo-no-item cargo-label">
				<view class="label">找</view>
				<view :class="['lenAndType' , params.carLength ? 'active' : 'default']" @click="showLineDialog"
					data-index="0">{{params.sender ? params.sender : '选择起始地'}}</view>
				<view class="middle-line"></view>
				<view :class="['lenAndType' , params.carLength ? 'active' : 'default']" @click="showLineDialog"
					data-index="1">{{params.receiver ? params.receiver : '选择目的地'}}</view>
				<text>的</text>
				<picker mode="selector" :range="period" :value="periodIndex" @change="showDateDialog">
					<view class="select-date">
						<text>{{period[periodIndex]}}</text>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/arrow_black_down.png"
							class="arrow_black_down"></image>
					</view>
				</picker>
				<view class="">货</view>
			</view>
		</view>
		<view class="my-card-content">
			<view class="card-title">
				<view>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/card-title-icon.png"
						class="card-title-icon"></image>
					<text class="label">我的名片数据</text>
				</view>
				<image
					:src="taskStatus == 1 ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/onInLine.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/onUnLine.png'"
					mode="aspectFill" class="info-onLine"></image>
			</view>
			<view class="card-inner">
				<view class="card-inner-item">
					<view class="dark">{{scanTotal || 0}}</view>
					<view class="light">
						<text>访问</text>
						<text style="padding-left: 20rpx">(人)</text>
					</view>
				</view>
				<view class="line-column"></view>
				<view class="card-inner-item">
					<view class="dark">{{collectTotal || 0}}</view>
					<view class="light">
						<text>收藏</text>
						<text style="padding-left: 20rpx">(人)</text>
					</view>
				</view>
			</view>
			<view class="card-line"></view>
			<view class="scanList" v-if="scanFirstItem && scanFirstItem.serviceType==20">
				<view class="card-sub-title">
					<view class="main">最近访客</view>
					<view class="sub">{{scanFirstItem.updateDt}}</view>
				</view>
				<view class="card-sub-inner">
					<view class="inner">
						<image v-if="scanFirstItem.companyLogo" :src="scanFirstItem.companyLogo" mode="aspectFit"
							class="card_avatar"></image>
						<image wx:else :src="scanFirstItem.fromUserAvatar" mode="aspectFit" class="card_avatar"></image>
						<view class="name">
							<view class="main">
								<text>{{scanFirstItem.nickname || scanFirstItem.fromUserMobile}}</text>
								<text v-if="scanFirstItem.personPosition">/{{scanFirstItem.personPosition}}</text>
							</view>
							<view class="sub" v-if="scanFirstItem.companyName">
								{{scanFirstItem.companyName}}
							</view>
						</view>
					</view>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/card_arrow_right.png"
						class="card_arrow_right"></image>
				</view>
				<view class="look-me">查看了你的名片</view>
			</view>
			<view class="scanList" v-if="scanFirstItem && scanFirstItem.serviceType == 10">
				<view class="card-sub-title">
					<view class="main">最近访客</view>
					<!-- <view class="sub">{{scanFirstItem.updateDt}}</view> -->
				</view>
				<view class="card-sub-inner">
					<view class="inner">
						<image :src="scanFirstItem.fromUserAvatar" class="card_avatar"></image>
						<view class="name">
							<view class="main">{{scanFirstItem.fromUserName}}</view>
						</view>
					</view>
					<view class="data">{{scanFirstItem.updateDt}}</view>
					<!-- <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/card_arrow_right.png" class="card_arrow_right"></image> -->
				</view>
				<view class="look-me">查看了你的名片</view>
			</view>
			<view class="look-more" bindtap="toCollect">
				<text>查看全部</text>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/more-down.png" class="more-down"></image>
			</view>
		</view>
		<view style="height: 30rpx"></view>
		<uni-popup ref="popup" type="bottom">
			<chooseCity ></chooseCity>
		</uni-popup>

	</view>
</template>

<script>
	import themeCard from "./themeCard.vue"
	import chooseCity from "@/components/chooseCity.nvue";
	import * as ship from "@/utils/ship.js"
	import * as utils from "@/utils/utils"
	export default {
		name: "businessCard",
		components: {
			themeCard,
			chooseCity
		},
		props: {

		},
		data() {
			return {
				businessShareWidth: 0,
				businessShareHeight: 0,
				introInfo: [{
						content: ""
					},
					{
						content: "本人非常熟悉***的交通路况，有*年的长途配送经验，熟知**地的发货收货流程，没有出现供任何交通事故，熟悉**市内及周边郊区道路。为人随和，工作踏实，欢迎货主联系。"
					},
					{
						content: "本人有*年的工作经验，驾驶技术熟练，对收发货流程熟悉，爱惜运输货物，具有高度敬业精神和团队精神，能吃苦耐劳，踏实肯干，欢迎货主联系"
					}
				],
				introIndex: 0,
				introBtn: ["模版一", "模版二", "模版三"],
				mnqrcode: '', //我的名片码
				scanList: [], //浏览记录
				allCountNumber: 0,
				avatar: '',
				mobile: '',
				address: '',
				trackTime: '',
				carSourceInCard: null,
				carSourceList: [],
				myLabelArr: [],
				personalImg: [],
				introduction: '',
				motto: '',
				nickname: '',
				userAvatar: '',
				userInfo: null,
				shareWidth: 0,
				shareHeight: 0,
				shareImage: '',
				shareBtnShow: false,
				taskStatus: 1,
				shareTips: false,
				styleImg: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/wx_card_bg.png",
				styleIndex: 0,
				theme: '1-1',
				wxBaseUserInfo: null,
				styleArr: [],
				themeList: [],
				period: ["长期", "近期"],
				periodIndex: 0,
				params: {
					userCode: "",
					userId: "",
					personId: "",
					driverId: "",
					driverName: "",
					driverPhone: "",
					driverImage: "",
					senderCode: "",
					sender: "",
					receiverCode: "",
					receiver: "",
					circuitCombo: "",
					carModel: "",
					carLength: "",
					carCombo: "",
					longTimeFlag: 1,
				},
				regionFlag: "",
			}
		},
		created() {
			//获取名片的list的标题
			this.getThemeTitle();
		},
		onLoad() {
			uni.$on('checkStartRegion', regionRes => {
				if (this.regionFlag == 'startRegion') {
					this.$refs.popup.close()
					console.log('startRegionRes', regionRes)
					this.params.sender = regionRes.provinceName + regionRes.cityName + regionRes.areaName;

				} else if (this.regionFlag == 'endRegion') {
					this.$refs.popup.close()
					console.log('endRegion', regionRes)
					this.params.receiver = regionRes.provinceName + regionRes.cityName + regionRes.areaName;
				}
				this.regionFlag = "";
			})
		},
		methods: {
			showLineDialog(e) {
				console.log('点击了地址选择器')
				let that = this
				let index = e.currentTarget.dataset.index
				if (index == 0) {
					this.regionFlag = 'startRegion';

				} else {
					this.regionFlag = 'endRegion';
				}
				this.$refs.popup.open()

			},
			async refresh() {
				var userInfo = uni.getStorageSync("userInfo");
				if (userInfo) {
					this.userInfo = JSON.parse(userInfo)
				}
				var styleArr = this.styleArr;
				if (styleArr.length < 1) {
					await this.getThemeTitle();
				}
				//获取我的所有标签
				this.getMyLabel();
				//获取用户的主题
				this.getTheme();
				//获取用户的常跑线路名片
				this.getMyCarSource();
				//获取浏览记录
				this.getScanList();
			},
			async getThemeTitle() {
				try {
					var res = await ship.postRequest("/yh/business/user/style/list", {
						styleLevel: 1
					})
					console.log(res)
					if (res.retCode == "0000000") {
						this.styleArr = res.rspBody

					} else {
						wx.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}

				} catch (error) {

				}
			},
			async getMyLabel() { // 获取我的所有标签
				let that = this
				let params = {
					userId: that.userInfo.userId,
					typeCodeList: ['OFTEN_AREA', 'ROAD_TYPE', 'FAVORITE_CARGO', "CUSTOM"],
					status: 1
				}
				let res = await request('/yh/upd/tags/find', params, "POST", false)
				let itemAry = res.rspBody.items;
				if (itemAry && itemAry.length > 0) {
					let vehArr = []
					let checkArr = []
					let myLabelArr = [];
					for (let i in itemAry) {
						if (itemAry[i].tagTypeCode == 'CUSTOM') {
							let obj = {
								tagName: itemAry[i].tagName,
								tagTypeName: itemAry[i].tagTypeName,
								tagTypeCode: itemAry[i].tagTypeCode,
							}
							vehArr.push(obj)
							myLabelArr.push(obj)
						} else {
							let obj = {
								tagName: itemAry[i].tagName,
								tagSid: itemAry[i].tagSid,
								tagTypeName: itemAry[i].tagTypeName,
								tagTypeCode: itemAry[i].tagTypeCode,
							}
							checkArr.push(obj)
							myLabelArr.push(obj)
						}
					}
					that.selfDefineArr = vehArr;
					that.hasCheckedItem = checkArr;
					that.myLabelArr = myLabelArr;

				}
			},
			async getTheme() {
				var userInfo = this.userInfo;
				console.log("获取用户的主题", userInfo);
				try {
					var res = await ship.postRequest("/yh/business/user/query/card/by/user", {
						userId: userInfo.userId
					})
					console.log(res)
					if (res.retCode == "0000000") {
						var styleLevel2Sid = res.rspBody.styleLevel2Sid;
						var styleImg = res.rspBody.styleImg;
						var styleLevel1Sid = res.rspBody.styleLevel1Sid;
						var theme = "1-1";
						if (styleLevel2Sid) {
							theme = styleLevel1Sid == 2 ? '2-1' : styleLevel2Sid
						}
						var address = (res.rspBody.provinceName || "") + (res.rspBody.cityName || "") + (res.rspBody
							.areaName || "");
						var trackTime = res.rspBody.trackTime;
						if (trackTime) {
							trackTime = utils.findBeidouDateDesc(trackTime)
						}
						var mobile = res.rspBody.mobile;
						if (mobile) {
							mobile = mobile.substr(0, 3) + '****' + mobile.substr(-4);
						}
						//个人风采
						var personalImg = res.rspBody.personalImg;
						if (personalImg) {
							personalImg = personalImg.split(',');
						} else {
							personalImg = []
						}
						//判断是否有主题
						var styleArr = this.styleArr;
						var index = res.rspBody.styleLevel1Sid > 0 ? res.rspBody.styleLevel1Sid - 1 : 0;

						ship.postRequest("/yh/business/user/style/list", {
							parentSid: styleArr[index].sid,
							styleLevel: 2,
						}).then(result => {
							console.log("内部风格", res)
							if (res.retCode == "0000000") {
								this.themeList = result.rspBody

							}
						})
						var userAvatar = res.rspBody.avatar
						var nickname = res.rspBody.nickname

						var introInfo = this.introInfo;
						introInfo[0].content = "我叫" + nickname + "，驾驶技术过硬，有吃苦耐劳的敬业精神。名片是我的找货信息，欢迎各大货主联系我。"
						//个人介绍
						var introduction = res.rspBody.introduction;
						if (!introduction) {
							var index = this.data.introIndex;
							introduction = introInfo[index].content;
						}
						var motto = res.rspBody.motto;
						this.introInfo = introInfo;
						var isBindDevice = res.rspBody.isBindDevice;
						this.userAvatar = userAvatar;
						this.nickname = nickname;
						this.introduction = introduction;
						this.motto = motto || "";
						this.address = address || "";
						this.trackTime = trackTime || "";
						this.taskStatus = res.rspBody.taskStatus || 1;
						this.mobile = mobile;
						this.personalImg = personalImg;
						this.carsourceSid = res.rspBody.carsourceSid || "";
						this.styleIndex = res.rspBody.styleLevel1Sid - 1 || 0;
						this.themeObj = {
							theme: theme,
							introInfo: introInfo,
							motto: motto,
							mnqrcode: res.rspBody.mnqrcode,
							trackTime: trackTime,
							address,
							nickname,
							userAvatar,
							isBindDevice,
							styleImg,
							mobile,
						}

					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.stopPullDownRefresh();
				} catch (error) {
					uni.stopPullDownRefresh();
				}
			},
			async getMyCarSource() {
				try {
					var carsourceSid = this.carsourceSid;
					var userId = this.userInfo.userId;
					var params = {
						userId: userId
					};
					if (carsourceSid) {
						params.sid = carsourceSid;
					}
					var res = await ship.postRequest("/olnanas/businessCarSource/getBusinessCarSource", params)
					console.log("我的车源信息", res);
					if (res.retCode == "0000000") {
						var carSourceInCard = null;
						var carSourceVOS = res.rspBody.carSourceVOS;
						if (carSourceVOS && carSourceVOS.length > 0) {
							carSourceInCard = carSourceVOS[0];
						} else {
							carSourceInCard = null
						}
						this.carSourceList = carSourceVOS || [];
						this.carSourceInCard = carSourceInCard;
					}
				} catch (error) {

				}
			},
			getScanList() {
				var toUserId = this.userInfo.userId;
				ship.postRequest("/yh/business/user/view/log/list", {
					pageSize: 6,
					pageNum: 1,
					toUserId: toUserId
				}).then(res => {
					console.log("获取浏览记录", res)
					if (res.retCode == "0000000") {
						this.scanList = res.rspBody.items;
						this.scanTotal = res.rspBody.total;
					}
				})
			},
			saveToMobile() {

			},
			onShareBtn() {

			},
			lookMore() {
				//查看更多
				console.log("查看更多")
				uni.navigateTo({
					url: './myCollect'
				})
			},
			clearText(text) {
				if (!text) return "";
				return text.replace(/省|市|区/g, '')
			},
			toCargoSource() {

			},
			showCardPop() {

			},
			setName(e) {
				//更换姓名
				console.log(e)
				var val = e.detail.value;
				var wxBaseUserInfo = this.data.wxBaseUserInfo;
				if (!val) {
					var params = {
						nickname: wxBaseUserInfo.nickName
					};
				} else {
					var params = {
						nickname: val
					};
				}
				this.setCard(params);
			},
			switchIntro(index) {
				var introInfo = this.introInfo;
				this.introduction = introInfo[index].content;
				this.introIndex = index;

			},
			chooseImg(avatar) {

			},
			goLabel() {
				uni.navigateTo({
					url: './label'
				})
			},
			toMotto() {
				uni.navigateTo({
					url: './motto'
				})
			},
			goIntro() {
				uni.navigateTo({
					url: './intro'
				})
			},
			showStylePopM(index) {
				//切换名片样式
				var userInfo = this.userInfo;
				if (!userInfo) {
					uni.showToast({
						title: '请先选择身份',
						icon: 'none'
					})
					return
				}
				var styleArr = this.styleArr;
				if (styleArr.length < 1) return;
				if (index == 3) {
					//使用大图作为名片主题
					var userInfo = this.userInfo;
					var userAvatar = this.userAvatar;
					if (!userAvatar) {
						wx.showToast({
							title: '请上传头像，才能使用大图作为背景主题',
							icon: 'none'
						})
						return;
					}
					ship.postRequest("/yh/business/user/modify/card/by/user", {
						styleImg: userAvatar,
						styleLevel2Sid: "4-1",
						styleLevel1Sid: "4",
						userId: userInfo.userId,
					}).then(res => {
						if (res.retCode == "0000000") {
							this.themeList = [];
							this.styleIndex = index;
							this.themeObj.theme = '4-1';
							this.themeObj.styleImg = userAvatar;
							this.styleLevel1Sid = '4';
							this.styleLevel2Sid = '4-1';

						} else {
							wx.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					return;
				}
				//获取名片的详情
				var item = styleArr[index];
				request("/yh/business/user/style/list", {
					parentSid: item.sid,
					styleLevel: 2,
				}, "POST", false).then(res => {
					console.log("内部风格", res)
					if (res.retCode == "0000000") {
						this.setData({
							styleIndex: index,
							themeList: res.rspBody
						})
						//使用第一张作为默认名片
						// this.setDefaultCard();
					}
				})
			},

		}
	}
</script>

<style lang="less" scoped>
	.businessCard {
		display: flex;
		flex-direction: column;
		width: 100vw;
		justify-content: flex-start;
		align-items: center;

		.share_wx {
			width: calc(~"100vw - 72rpx");
			margin: 0 auto;
			height: 80rpx;
			background-color: #03DA6B;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			.share_wx_icon {
				width: 46rpx;
				height: 46rpx;
				margin-right: 24rpx;
			}
		}

		.line {
			width: calc(~"100vw - 72rpx");
			margin: 0 auto;
			height: 1rpx;
			background-color: #D8D8D8;

		}

		.share_content {
			width: calc(~"100vw - 120rpx");
			margin: 32rpx auto 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.share_item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}

			.share_icon {
				width: 56rpx;
				height: 56rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 16rpx;
				font-size: 28rpx;
				color: #000000;

				.share_icon_1 {
					width: 56rpx;
					height: 56rpx;
				}
			}

		}

		.business-share {
			position: absolute;
			top: -9999px;
			z-index: -9999;
			width: 750rpx;
			height: 600rpx;

			.businessCard-share-innner {
				height: 400rpx;
				width: 750rpx;
				position: relative;
				margin: 0;
				overflow: hidden;

				.wx_card_bg {
					height: 400rpx;
					width: 750rpx;
					border-radius: 24rpx 24rpx 0 0;
				}

				.wx_card_inner {
					width: 750rpx;
					border-radius: 24rpx 24rpx 0 0;

					.name {
						font-size: 28rpx;
						font-weight: 400;

						line-height: 28rpx;
						margin-bottom: 24rpx;
					}

					.type {
						margin-bottom: 24rpx;
						display: flex;
						flex-direction: row;
						align-items: center;
						flex: 1;
					}

					.type_small {
						font-size: 32rpx;
						font-weight: 400;

						line-height: 40rpx;
					}

					.type_big {
						font-size: 40rpx;
						font-weight: bold;

						line-height: 40rpx;
						display: flex;
						flex-direction: row;
						width: 350rpx;
					}

					.card_carSource {
						margin-bottom: 92rpx;
						display: flex;
						flex-direction: row;
						align-items: center;
					}

					.find_bold {
						max-width: 320rpx;
						font-size: 40rpx;
						font-weight: bold;
						line-height: 40rpx;
					}
				}

				.avatar-content {
					position: absolute;
					top: 40rpx;
					right: 30rpx;
					width: 122rpx;
					height: 122rpx;
					border-radius: 122rpx;
					z-index: 2;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #FFFFFF;

					.wx_user {
						width: 118rpx;
						height: 118rpx;
						border-radius: 118rpx;
					}
				}
			}

			.answer_canvas {
				margin-bottom: 0;
			}

			.share_to_btn {
				width: 750rpx;
				height: 200rpx;
			}
		}

		.business {
			padding-top: 30rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
		}


		.cargo-no-content {
			display: flex;
			flex-direction: column;
			box-shadow: 0 0 28rpx 0 rgba(0, 0, 0, 0.06);
			margin: 0 auto;
			padding: 38rpx 36rpx;
			box-sizing: border-box;

			.cargo-line {
				width: calc(~"100vw - 148rpx");
				margin: 38rpx auto;
				height: 0;
				border-top: 1px solid #E3E3E3;
			}

			.middle-line {
				width: 26rpx;
				height: 0;
				border-top: 2px solid #000000;
			}

			.cargo-no-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;

				.cargo-label {
					display: flex;
					flex-direction: row;
					align-items: center;

					.label {
						color: #333333;
						font-size: 32rpx;
						margin-right: 22rpx;

					}
				}

				.lenAndType {
					width: 170rpx;
					height: 58rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					border: 2rpx solid #D6D6D6;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 24rpx;

					&.default {
						color: #999999;
					}

					&.active {
						color: #666666
					}
				}

				.saveSource {
					width: 168rpx;
					height: 56rpx;
					background: #5879F5;
					border-radius: 8rpx;
					margin-right: 38rpx;
					color: #FFFFFF;
					font-size: 28rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.select-date {
					width: 106rpx;
					height: 58rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					border: 2rpx solid #D6D6D6;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 24rpx;
					font-weight: 500;
					color: #5879F5;

					.arrow_black_down {
						width: 34rpx;
						height: 34rpx;
						margin-left: 4rpx;
					}
				}
			}
		}



		.share-btn {
			height: 90rpx;
			margin: 0 36rpx;
			margin-bottom: 32rpx;
			width: calc(100vw - 72rpx);

			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.share-item {
				width: 308rpx;
				height: 90rpx;
				background-size: cover;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				border-radius: 12rpx;

				&.save {
					background-color: #FC5E09;
				}

				&.share {
					background-color: #0074FF;
				}
			}
		}

		.scan {
			width: calc(100vw - 72rpx);
			margin: 0 36rpx 28rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.scan-pic {
				display: flex;
				flex-direction: row;
				align-items: center;

				.scan-num {
					margin-left: 26rpx;

					font-size: 26rpx;

					font-weight: 500;
					color: #666666;
					line-height: 32rpx;

				}

				.pic-item {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

					.pic {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50rpx;
						background-color: #cccccc;

						&+.pic {
							margin-left: -8rpx;
						}
					}
				}
			}

			.more {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 26rpx;
				font-weight: 500;
				color: #666666;
				line-height: 32rpx;

			}
		}

		.card_between {
			margin: 0 36rpx 32rpx;
			width: calc(100vw - 72rpx);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.card_between_title {

				font-size: 32rpx;

				font-weight: 400;
				color: #000000;
				line-height: 32rpx;
			}

			.switch_bg {
				width: 168rpx;
				height: 56rpx;
				background: #5879F5;
				border-radius: 8rpx;

				font-size: 28rpx;

				font-weight: 400;
				color: #FFFFFF;
				line-height: 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;

			}
		}

		.style_whole {
			width: 100vw;
			margin: 0 3rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			.style_item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 0 33rpx;
				box-sizing: border-box;
				position: relative;

				.style_box {
					height: 76rpx;
					width: 100%;
					margin-bottom: 16rpx;
					background-color: #cccccc;
					border-radius: 8rpx;
					position: relative;

					.bg {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: rgba(180, 195, 255, 0.5100);
						border-radius: 8rpx;
						z-index: 1;
					}
				}
			}
		}

		.adv {
			width: calc(100vw - 72rpx);
			margin: 0 36rpx;
			padding-bottom: 36rpx;

			.adv-img {
				width: calc(100vw - 72rpx);
				height: 130rpx;
			}
		}

		.cargo-title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin: 42rpx 36rpx;
			width: calc(100vw - 72rpx);

			.label {
				font-size: 36rpx;
				font-weight: 500;
				color: #000000;
				line-height: 36rpx;
			}

			.edit {
				width: 168rpx;
				height: 56rpx;
				background-color: #5879F5;
				border-radius: 8rpx;
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
			}
		}

		.cargo-content-list {
			display: flex;
			flex-direction: column;
			margin: 0 36rpx;
			background-color: #FFFFFF;
			width: calc(100vw - 72rpx);
			border-radius: 12rpx;

			.line {
				width: calc(100vw - 152rpx);
				height: 1rpx;
				background-color: #E3E3E3;
				margin-left: 40rpx;
			}

			.cargo-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 32rpx;
				box-sizing: border-box;

				.date {
					font-size: 32rpx;
					color: #333333;
					line-height: 36rpx;
				}

				.cargo-type {
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 32rpx;
					font-weight: 500;
					color: #5879F5;
					line-height: 36rpx;

					.cargo-type-inner {
						margin-right: 16rpx;
						width: 150rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.cargo-type-addr {
						width: calc(100vw - 510rpx);
						text-align: center;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}

				.cargo-btn {
					width: 104rpx;
					height: 72rpx;
					background-color: #5879F5;
					border-radius: 8rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 20rpx;
					color: #FFFFFF;
					line-height: 28rpx;
				}
			}
		}

		.info-title {
			width: calc(100vw - 72rpx);
			font-size: 36rpx;
			font-weight: 500;
			color: #000000;
			line-height: 36rpx;
			margin: 48rpx 36rpx 32rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.info-onLine {
				width: 132rpx;
				height: 47rpx;
			}
		}

		.info-content {
			display: flex;
			flex-direction: column;
			margin: 0 36rpx;
			background-color: #FFFFFF;
			padding: 40rpx 0 30rpx;
			box-sizing: border-box;
			border-radius: 8rpx;

			.line {
				height: 1rpx;
				background-color: #E3E3E3;
				margin: 40rpx;
			}

			.myMotto {
				display: flex;
				flex-direction: row;
				padding: 0 40rpx;
				box-sizing: border-box;

				.label {
					font-size: 32rpx;
					width: 150rpx;
					font-weight: 400;
					color: #666666;
					line-height: 36rpx;
				}

				.arrow_right_icon {
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 32rpx;
					flex: 1;
					justify-content: flex-end;
					color: #000000;
					line-height: 36rpx;

					.arrow_icon {
						width: 38rpx;
						height: 38rpx;
					}
				}
			}

			.info-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 0 40rpx;
				box-sizing: border-box;

				.label {
					font-size: 32rpx;
					width: 150rpx;
					font-weight: 400;
					color: #666666;
					line-height: 36rpx;
				}

				.info_input {
					flex: 1;
					text-align: right;
					font-size: 32rpx;
					color: #000000;
					line-height: 36rpx;
				}

				.arrow_right_icon {
					display: flex;
					flex-direction: row;
					align-items: center;
					flex: 1;
					justify-content: flex-end;
					font-size: 32rpx;
					color: #000000;
					line-height: 36rpx;

					.arrow_icon {
						width: 38rpx;
						height: 38rpx;
					}
				}

				.avatar-box {
					width: 120rpx;
					height: 120rpx;
					background-color: rgba(0, 0, 0, 0.49);
					border-radius: 8rpx;
					position: relative;

					.user-avatar {
						width: 120rpx;
						height: 120rpx;
						border-radius: 8rpx;
					}

					.wx_pic_content {
						position: absolute;
						left: 0;
						top: 0;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						width: 120rpx;
						height: 120rpx;
					}

					.wx_pic_add {
						width: 22rpx;
						height: 22rpx;
					}

					.wx_pic_text {
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 24rpx;
						padding-top: 12rpx;
					}
				}
			}

			.like_content {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				margin-top: 16rpx;
				flex-wrap: wrap;
				padding: 0 28rpx;
				box-sizing: border-box;

				.like_item {
					width: calc(25vw - 32rpx);
					padding: 0 12rpx;
					box-sizing: border-box;
					margin-bottom: 24rpx;

					.like_item_inner {
						height: 64rpx;
						background-color: #CAD5FF;
						border-radius: 8rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28rpx;
						color: #5879F5;
						line-height: 28rpx;
					}
				}
			}

			.intro_title {
				font-size: 32rpx;
				color: #666666;
				line-height: 36rpx;
				margin-bottom: 16rpx;
				padding: 0 40rpx;
				box-sizing: border-box;
			}

			.intro_textarea {
				height: 150rpx;
				border-radius: 16rpx;
				border: 2rpx solid #E3E3E3;
				padding: 10rpx;
				margin: 0 40rpx 16rpx;
				font-size: 24rpx;
			}

			.templete {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin: 0 50rpx;

				.templete_btn {
					width: 168rpx;
					height: 56rpx;
					background: #C8C8C8;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #FFFFFF;

					&+.templete_btn {
						margin-left: 24rpx;
					}

					&.active {
						background-color: #5879F5;
					}
				}
			}
		}

		.pic-title {
			font-size: 36rpx;
			margin: 32rpx 36rpx;
			font-weight: 500;
			color: #000000;
			line-height: 36rpx;
			width: calc(100vw - 72rpx);
		}

		.personalImg-list {
			margin-bottom: 40rpx;
		}

		.personalImg {
			width: calc(100vw - 72rpx);
			height: 340rpx;
			margin: 0 32rpx;

			&+.personalImg {
				margin-top: 24rpx;
			}
		}

		.pic-content {
			width: calc(100vw - 72rpx);
			margin: 0 36rpx;
			height: 172rpx;
			background: #FFFFFF;
			box-shadow: 0 0 28rpx 0 rgba(0, 0, 0, 0.06);
			border-radius: 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 36rpx;
			color: #5879F5;
			line-height: 28rpx;
		}


		.my-card-content {
			display: flex;
			flex-direction: column;
			background-color: #ffffff;
			margin: 24rpx 36rpx 0;
			border-radius: 16rpx;
			padding: 0 20rpx;
			box-sizing: border-box;
			box-shadow: 0 0 28rpx 0 rgba(0, 0, 0, 0.06);

			.card-title {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				// align-items: center;
				margin: 30rpx 0rpx 30rpx;

				.label {
					font-size: 32rpx;
					font-weight: 500;
					color: #000000;
					line-height: 36rpx;
				}

				.info-onLine {
					width: 132rpx;
					height: 47rpx;
				}

				.card-title-icon {
					width: 40rpx;
					height: 40rpx;
					margin-right: 16rpx;
					vertical-align: bottom;
				}
			}

			.card-inner {
				height: 92rpx;
				display: flex;
				flex-direction: row;

				.line-column {
					height: 92rpx;
					width: 1rpx;
					background-color: #DDDDDD;
				}

				.card-inner-item {
					flex: 1;
					height: 92rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.dark {
						font-weight: 600;
						color: #000000;
						font-size: 32rpx;
						line-height: 32rpx;
					}

					.light {
						padding-top: 24rpx;
						color: #666666;
						font-size: 28rpx;
					}
				}
			}

			.card-line {
				width: calc(~"100vw - 110rpx");
				margin: 38rpx auto;
				height: 0;
				border-top: 1px solid #E3E3E3;
			}

			.card-sub-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 48rpx;

				.main {
					font-weight: 500;
					color: #000000;
					font-size: 32rpx;
				}

				.sub {
					color: #666666;
					font-size: 28rpx;
				}
			}

			.card-sub-inner {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-start;
				height: 100rpx;

				.card_arrow_right {
					width: 84rpx;
					height: 84rpx;
				}

				.inner {
					display: flex;
					flex-direction: row;

					.card_avatar {
						width: 100rpx;
						height: 100rpx;
						border-radius: 100rpx;
					}

					.name {
						margin-left: 24rpx;
						padding-top: 6rpx;
						box-sizing: border-box;

						.main {
							font-weight: 500;
							color: #000000;
							font-size: 36rpx;
						}

						.sub {
							color: #666666;
							font-size: 24rpx;
							margin-top: 16rpx;
						}
					}
				}

				.data {
					height: 100rpx;
					padding-top: 6rpx;
				}
			}

			.look-me {
				color: #666666;
				font-size: 28rpx;
				margin-top: 6rpx;
				margin-left: 124rpx;
			}

			.look-more {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				margin: 15rpx 0 30rpx;

				.more-down {
					width: 40rpx;
					height: 40rpx;
					margin-left: 8rpx;
				}
			}
		}
	}
</style>
