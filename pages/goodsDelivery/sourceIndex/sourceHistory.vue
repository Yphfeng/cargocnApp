<template>
	<view class="sourceHistory">
		<view class="noticeBox">
			<image class="noticeIcon" src="/static/images/vehicleOptions/noticeIcon.png"></image>
			<uni-notice-bar
				v-if="hintSwiperText"
				background-color="transparent"
				color="#F78B30"
				:speed="50"
				scrollable="true"
				single="true"
				:text="hintSwiperText">
			</uni-notice-bar>
		</view>
		<view class="carOptionList" v-for="(item, index) in carInfo" :key="index">
			<view class="listMsgBox">
				<view class="leftContent">
					<view class="avatar-icon">
						<image class="avatar" :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
						<image class="vipIcon" src="/static/images/newFleetDetails/redVip.png" v-if="item.isBindDevice == 1"></image>
						<image class="vipIcon" src="/static/images/newFleetDetails/blueVip.png" v-if="item.isBindDevice != 1 && item.isBindZj == 1"></image>
					</view>
					<view class="driverStatusBox">
						<view class="statusIcon" :style="item.taskStatus == 1 ? 'background-color: #4ACD1B;' : 'background-color: #E2633B;'"></view>
						<view class="statusMsg" :style="item.taskStatus == 1 ? 'color: #4ACD1B;' : 'color: #E2633B;'">{{item.taskStatus == 1 ? '可接单' : '忙碌'}}</view>
					</view>
				</view>
				<view class="rightContent">
					<view class="contentBox">
						<view class="itemDriver">
							<text class="driverName" v-if="item.driverName">{{showName(item.driverName)}}</text>
							<text class="driverMobile" v-if="!item.driverName">{{showPhone(item.driverPhone)}}</text>
							<text class="driverCar">{{item.carLength ? item.carLength + '米' : ''}}{{item.carModel ? item.carModel : ''}}</text>
						</view>
					</view>
					<view class="driverMsg">
						<view class="itemAddress" v-if="item.sender && item.receiver">{{showListSenderAddr(item.sender)}} - {{showListReceiverAddr(item.receiver)}}</view>
						<view class="detailsBtn" @click="jumpToDriverDetails(item.userId, 1)">
							<text class="msg">详情</text>
							<image class="icon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_right_blue_icon.png"></image>
						</view>
					</view>
					<view class="itemDetails">
						<view class="addressDetailsBox" v-if="beidouList.length > 0">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_beidou.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 4 && showAddr(index)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_wx.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 3 && showAddr(index)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_box.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 1 && showAddr(index)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_app.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 2 && showAddr(index)"></image>
							<view class="addr_text">{{showAddr(index)}}</view>
						</view>
						<view class="sourceCheckedMsg">{{showDate(index)}}</view>
					</view>
					<view class="driverSyb" v-if="item.tagList.ROAD_TYPE || item.tagList.OFTEN_AREA || item.tagList.FAVORITE_CARGO">
						<view class="sybBox">
							<view class="sybList" v-if="item.tagList.FAVORITE_CARGO">{{item.tagList.FAVORITE_CARGO}}</view>
							<view class="sybList" v-if="item.tagList.OFTEN_AREA">{{item.tagList.OFTEN_AREA}}</view>
							<view class="sybList" v-if="item.tagList.ROAD_TYPE">{{item.tagList.ROAD_TYPE}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="listBtnBox">
				<view class="groupLine"></view>
				<view class="userListBtnGroup">
					<view class="btnBox" @click="toTrackSimple(item)">
						<image class="icon" src="/static/images/newFleetDetails/trajectory.png"></image>
						<view class="msg">轨迹</view>
					</view>
					<view class="btnBox" v-if="!item.isCollect" @click="openFleetPopup(item, index)">
						<image class="icon" src="/static/images/newFleetDetails/collection.png"></image>
						<view class="msg collectionMsg">收藏TA</view>
					</view>
					<view class="btnBox" v-if="item.isCollect == 1">
						<image class="icon" src="/static/images/newFleetDetails/collectioned.png"></image>
						<view class="msg collectionMsg">已收藏</view>
					</view>
					<view class="btnBox" @click="toCallUser(item)">
						<image class="icon" src="/static/images/newFleetDetails/mobile.png"></image>
						<view class="msg">联系TA</view>
					</view>
				</view>
			</view>
		</view>
		<view class="loadingBox" v-show="noData">
			<image class="noDataIcon" src="/static/images/vehicleOptions/newNodata.png"></image>
		</view>
		<view class="loadingBox" v-show="noData">
			暂无联系记录～
		</view>
		<view class="loadingBox" v-show="noMore">没有更多了～</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="/static/images/listLoading.png"></image>
			努力加载中…
		</view>
		
		<uni-popup ref="noSourceNumPopup" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle">提示</view>
					<view class="mainContent">您车队人数已经达到上限啦，快来点击下面了解详情吧</view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">
						<view class="msg">开通会员，可邀请{{mealBaseInfo ? mealBaseInfo : 0}}位司机加入您的车队</view>
						<view class="toBuyBtn">
							<view class="btnText">去购买</view>
							<image class="membersRightIcon" src="/static/images/vehicleOptions/membersRight.png"></image>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import IMService from "@/utils/imservice.js";
	import * as utils from "@/utils/ship.js";
	import * as utilDate from "@/utils/utils.js"
	import * as publicData from "@/utils/publicData.js";
	const { dateTimePicker} = require('@/utils/date.js');
	export default {
		data() {
			return {
				hintSwiperText: '只展示今日已查看过的车源。',
				carInfo: [],
				noData: false,
				noMore: false,
				isLoading: false,
				pageSize: 20,
				pageNum: 1,
				userInfo: {},
				userInfoName: '',
				beidouList: [],
				fleetmemsize: '',
				mealBaseInfo: 0
			};
		},
		onLoad(option) {
			this.getUserInfo();
			this.getMealBaseList(); // 会员套餐
		},
		onShow() {},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getOptionInfo();
		},
		onReachBottom() { // 上拉加载
			if(this.noData || this.noMore || this.isLoading) {
				return false;
			}
			this.loadOptionInfo();
		},
		methods: {
			getUserInfo() { // 获取用户信息
				this.userInfo = {};
				let userData = uni.getStorageSync("userInfo");
				console.log('用户信息', JSON.parse(userData));
				this.userInfo = userData ? JSON.parse(userData) : {};
				if(userData) {
					this.getOptionInfo();
				}
			},
			getOptionInfo() { // 车源列表
				if(this.isLoading) return false;
				this.noMore = false;
				this.noData = false;
				this.isLoading = true;
				this.pageNum = 1;
				this.carInfo = [];
				let params = {
					"ownerUserCode": this.userInfo.attrs.userCode,
					"pageSize": this.pageSize,
					"pageNum": this.pageNum,
					"type": 1
				}
				console.log('列表查询参数', params);
				let that = this;
				utils.newQueryPostRequest('/olnanas/recommend/historyCarSource', params)
				.then(function (res) {
					console.log('车源列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.carSourceVOS;
						if(items && items.length > 0) {
							for(let i in items) {
								items[i].checked = false;
							}
							that.carInfo = items;
							// if(that.carInfo.length < that.pageSize) {
							// 	that.noMore = true;
							// }
							var addrAddress = [];
							items.forEach(atem => {
								addrAddress.push(atem.userId)
							})
							
							console.log(addrAddress, '地址')
							utils.newQueryPostRequest("/olnanas/recommend/beidouPositioning", {
								userIds: addrAddress
							}).then(res => {
								console.log(res, '北斗定位')
								if (res.retCode == "0000000") {
									that.beidouList = res.rspBody;
								} else {
									that.beidouList = [];
									// uni.showToast({
									// 	title: res.retDesc,
									// 	icon: 'none'
									// })
								}
							})
						}else {
							that.noData = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
				uni.stopPullDownRefresh();
			},
			loadOptionInfo(flag) { // 懒加载
				this.isLoading = true;
				this.pageNum++;
				let params = {
					"ownerUserCode": this.userInfo.attrs.userCode,
					"pageSize": this.pageSize,
					"pageNum": this.pageNum,
					"type": 1
				}
				let that = this;
				utils.newQueryPostRequest('/olnanas/recommend/historyCarSource', params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.carSourceVOS;
						if(items && items.length > 0) {
							for(let i in items) {
								items[i].checked = false;
								that.carInfo.push(items[i]);
							}
							//获取北斗或app定位的地址
							var addrAddress = [];
							items.forEach(atem => {
								addrAddress.push(atem.userId)
							})
							
							console.log(addrAddress, '地址')
							utils.newQueryPostRequest("/olnanas/recommend/beidouPositioning", {
								userIds: addrAddress
							}).then(res => {
								console.log(res, '北斗定位')
								if (res.retCode == "0000000") {
									that.beidouList = res.rspBody;
								} else {
									that.beidouList = [];
									// uni.showToast({
									// 	title: res.retDesc,
									// 	icon: 'none'
									// })
								}
							})
						}else {
							that.noMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			floatMul(arg1,arg2)   {     
			    var m=0,s1=arg1.toString(),s2=arg2.toString();     
			    try{m+=s1.split(".")[1].length}catch(e){}     
			    try{m+=s2.split(".")[1].length}catch(e){}     
			    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);     
			},
			
			getMealBaseList() { // 会员套餐列表
				let params = {
					"setmfree": "0",
					"setmrole": "cargo",
					"setmchannel": "app",
					setmdisp: 1,
				}
				console.log('会员套餐参数', params);
				let that = this;
				utils.postRequest('/cp/set/meal/base/list', params)
				.then(function (res) {
					console.log('会员套餐结果', res);
					if(res.retCode == '0000000'){
						let rspBody = res.rspBody;
						that.mealBaseInfo = 0;
						let defvalAry = [];
						if(rspBody && rspBody.length > 0) {
							let items = rspBody[rspBody.length - 1];
							let setmitemsJson = items.setmitems.replace(/\//g, '');
							let obj = JSON.parse(setmitemsJson);
							that.mealBaseInfo = Number(obj.fleetmemsize.defval);
							console.log('套餐可加入车队人数', that.mealBaseInfo);
							// uni.hideLoading();
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('会员套餐请求失败', res.retDesc);
				})
			},
			toCallUser(item) {
				console.log(item.driverPhone);
				this.carSourceInteraction(item);
				this.toSendDriverMsg(item);
				let platformMsg = uni.getSystemInfoSync().platform;
				if(platformMsg == 'android') {
					let that = this;
					plus.android.requestPermissions(
						['android.permission.CALL_PHONE'],
						function(resultObj) {
							var result = 0;
							for(let i = 0; i < resultObj.granted.length; i++) {
								var grantedPermission = resultObj.granted[i];
								console.log('已获取的权限', grantedPermission);
								result = 1;
							}
							for(let i = 0; i < resultObj.deniedPresent.length; i++) {
								var deniedPresentPermission = resultObj.deniedPresent[i];
								console.log('拒绝本次申请的权限', deniedPresentPermission);
								result = 0;
							}
							for(let i = 0; i < resultObj.deniedAlways.length; i++) {
								var deniedAlwaysPermission = resultObj.deniedAlways[i];
								console.log('永久拒绝申请的权限', deniedAlwaysPermission);
								result = -1;
							}
							console.log(result);
							that.toCall(result, item);
						}
					)
				}else {
					this.toCall(1, item);
				}
			},
			toCall(result, item) {
				console.log('触发');
				if(result == 1) {
					uni.makePhoneCall({
					    phoneNumber: item.driverPhone,
					});
					publicData.addBuried("货主搜索车源拨打司机电话")
				}else {
					uni.showToast({
						title: '请开启拨号权限',
						icon: 'none'
					})
				}
			},
			showName(str) {
				if(str) {
					return str.substr(0, 1) + '师傅';
				}
			},
			showPhone(str) {
				if(str) {
					let fir = str.substr(0, 3);
					let sec = str.substr(7, 4);
					return fir + '****' + sec;
				}
			},
			toSendDriverMsg(item) { // 发送消息
				let userIdAry = [];
				userIdAry.push(item.userId);
				let params = {
					"ownerUserCode": this.userInfo.attrs.userCode ? this.userInfo.attrs.userCode : undefined,
					"userIds": userIdAry,
				}
				console.log('发消息参数', params);
				utils.postRequest('/olnanas/recommend/iconMessage', params)
				.then(function (res) {
					console.log('发消息结果', res);
					if(res.retCode == '0000000'){
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('互动失败', err);
				})
			},
			carSourceInteraction(item) { // 互动接口
				let params = [{
					nowdataSid: item.sid,
					batchNumber: item.batchNumber,
					userCode: this.userInfo.attrs.userCode ? this.userInfo.attrs.userCode : undefined,
					userId: this.userInfo.userId ? this.userInfo.userId : undefined,
					personId: this.userInfo.attrs.personId ? this.userInfo.attrs.personId : undefined,
					name: this.userInfo.userName ? this.userInfo.userName : undefined,
					phone: this.userInfo.mobile ? this.userInfo.mobile : undefined,
					imgUrl: this.userInfo.attrs.avatar ? this.userInfo.attrs.avatar : undefined,
					
				}]
				console.log('互动参数', params);
				utils.postRequest('/cy/carSourceInteraction/add', params)
				.then(function (res) {
					console.log('互动结果', res);
					if(res.retCode == '0000000'){
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('互动失败', err);
				})
			},
			showListSenderAddr(str) {
				return str.substr(0, 4);
			},
			showListReceiverAddr(str) {
				return str.substr(0, 4);
			},
			showDate(index) {
				var beidouList = this.beidouList;
				var carInfo = this.carInfo;
				if (!beidouList) return;
				if (!beidouList[index]) return '';
				var locationDate = beidouList[index].locationDate;
				if (!locationDate) return '';
				return utilDate.findBeidouDateDesc(locationDate);
			},
			showAddr(index) {
				var beidouList = this.beidouList;
				var carInfo = this.carInfo;
				var userId = carInfo[index].userId;
				if (beidouList.length < 1) return '';
				var findIndex = beidouList.findIndex(item => {
					return item.userId == userId
				})
				if (findIndex > -1) {
					var address = beidouList[findIndex].address;
					if (address) {
						var reg = /.+?(县|区)/g
						var addr = address.match(reg);
						if (addr) {
							return addr[0]
						} else {
							return address
						}
					} else {
						return address || ""
					}
				} else {
					return ""
				}
			},
			isBeidou(index) {
				//判断是否是北斗定位
				var beidouList = this.beidouList;
				if (beidouList.length < 1) return false;
				if (!beidouList[index]) return false; 
				return beidouList[index].isBeiDou;
			},
			jumpToDriverDetails(id, checkStatus) { // 跳转司机详情
				uni.navigateTo({
					url: '../driverDetails/driverDetails?id=' + id + '&encryption=' + checkStatus
				})
			},
			jumpToUserMember() { // 跳转会员列表
				this.$refs.noSourceNumPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage?pageName=sourceIndex'
				})
			},
			closeNoNumPopup() { // 关闭充值弹窗
				this.$refs.noSourceNumPopup.close();
			},
			createTimeStr(dateTimeArray,dateTime){
				let timeStr = dateTimeArray[0][dateTime[0]]+'-'+dateTimeArray[1][dateTime[1]]+'-'+dateTimeArray[2][dateTime[2]]+' '+dateTimeArray[3][dateTime[3]]+":"+dateTimeArray[4][dateTime[4]];
				console.log(timeStr)
				return timeStr
			},
			toTrackSimple(item) {
				if (!utils.btnRepeat()) return;
				var obj = this.getPickerArr();		 
				var dateTimeArray=obj.dateTimeArray;
				var endTimeArray = obj.dateTimeArray;
				var dateTime = obj.dateTime;
				var startTime = [dateTime[0], dateTime[1], dateTime[2], 0, 0];
				var endTime = [dateTime[0], dateTime[1], dateTime[2], 23, 59];
				//获取当前日期
				var dateTime = this.createTimeStr(dateTimeArray,startTime);
				var endTime= this.createTimeStr(endTimeArray,endTime);
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "ios") {
					uni.navigateTo({
						url: '/pages/goodsDelivery/fleetIndex/map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + 1
					})
					return;
				}
				if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '将获取您的定位权限以查看轨迹',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/goodsDelivery/fleetIndex/map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + 1
								})
							}
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/goodsDelivery/fleetIndex/map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + 1
					})
				}
			
				
			},
			//获取日期的picker显示
			getPickerArr(date) {
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let datenow = new Date();
				let endYear = datenow.getFullYear();
				let obj = dateTimePicker(this.startYear, endYear, date);
				// 精确到分的处理，将数组的秒去掉
				let lastArray = obj.dateTimeArray.pop();
				let lastTime = obj.dateTime.pop();
				return obj
			},
			toCollectUser(item, index) { // 收藏用户
				uni.showLoading();
				let cardFleetItem = getApp().globalData.cardFleetItem;
				if(cardFleetItem.id) {
					let params = {
						"commonUserId": this.userInfo.userId,
						"commonUserName": this.userInfo.userName ? this.userInfo.userName : this.userInfo.mobile,
						"fleetId": cardFleetItem.id,
						"fleetName": cardFleetItem.name,
						"userId": item.userId,
						"userCode": item.userCode
					}
					console.log('收藏', params);
					let that = this;
					utils.postRequest('/cd/fleetWithUser/invite', [params])
					.then(function (res) {
						console.log('收藏结果', res);
						if(res.retCode == '0000000'){
							uni.showToast({
								title: '收藏成功',
								icon: 'none'
							})
							that.carInfo[index].isCollect = 1;
							that.$forceUpdate();
						} else{
							uni.hideLoading();
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						uni.hideLoading();
						console.log('收藏请求失败', res.retDesc);
					})
				}else {
					this.getMyCardFleetInfo(item, index);
				}
			},
			getMyCardFleetInfo(item, index) {
				let params = {
					"commonUserId": this.userInfo.userId,
					"currentUserCode": this.userInfo.attrs.userCode,
					"isOwner": 1,
					"isMyFleet": 1,
					"isCardFleet": 1
				}
				let that = this;
				utils.postRequest('/cd/fleet/list', params)
				.then(function (res) {
					console.log('卡片车队结果', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							getApp().globalData.cardFleetItem = items[0];
							that.toCollectUser(item, index);
						}else {
							uni.hideLoading();
							uni.showToast({
								title: '名片夹查询异常，请联系管理员',
								icon: 'none'
							})
						}
					} else{
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log('卡片车队请求失败', res.retDesc);
				})
			},
			openFleetPopup(item, index) {
				let params = {
					"usersid": this.userInfo.userId,
					"setmchannel": "app"
				}
				console.log('剩余条数费参数', params);
				let that = this;
				utils.postRequest('/cp/member/queryByUser', params)
				.then(function (res) {
					console.log('剩余条数结果', res);
					if(res.retCode == '0000000'){
						let noteStr = res.rspBody.setmitems;
						noteStr = noteStr.replace(/\//g, '');
						noteStr = JSON.parse(noteStr);
						console.log('JSON剩余条数结果', noteStr);
						that.fleetmemsize = Number(noteStr.fleetmemsize.nowsurnum);
						if(that.fleetmemsize < 1) {
							that.$refs.noSourceNumPopup.open();
						}else {
							that.toCollectUser(item, index);
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('剩余条数请求失败', res.retDesc);
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F1F4F9;
	}
	.sourceHistory {
		padding-bottom: 20rpx;
		.noticeBox {
			margin: 40rpx 36rpx 0 36rpx;
			padding: 8rpx 58rpx 8rpx 26rpx;
			background: #FFEBBE;
			box-shadow: 0px 0px 38rpx 2rpx rgba(255,193,63,0.44);
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			.noticeIcon {
				flex-shrink: 0;
				width: 27rpx;
				height: 35rpx;
				margin-right:24rpx;
			}
		}
		.headOperationGroup {
			padding: 20rpx 36rpx 0 36rpx;
			display: flex;
			align-items: center;
			.mapBtn {
				display: flex;
				align-items: center;
				.icon {
					display: block;
					width: 30rpx;
					height: 40rpx;
					margin-right: 8rpx;
				}
				.msg {
					font-size: 24rpx;
					color: #333333;
					line-height: 28rpx;
				}
			}
		}
		.carOptionList {
			margin: 20rpx 34rpx 0 34rpx;
			background-color: #FFF;
			box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
			border-radius: 24rpx;
			.listMsgBox {
				display: flex;
				padding: 18rpx 32rpx 32rpx 0;
				.leftContent {
					flex-shrink: 0;
					flex: 0 0 148rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					.avatar-icon {
					    margin-top: 12rpx;
					    width: 80rpx;
					    height: 86rpx;
					    flex-direction: column;
					    justify-content: center;
					    position: relative;
						.avatar {
							width: 80rpx;
							height: 80rpx;
							border-radius: 100%;
							z-index: 9;
						}
						.vipIcon {
							width: 34rpx;
							height: 34rpx;
							position: absolute;
							z-index: 10;
							margin: 52rpx 0 0 -36rpx;
						}
					}
					.driverStatusBox {
						display: flex;
						align-items: center;
						margin-top:8rpx;
						.statusIcon {
							width: 14rpx;
							height: 14rpx;
							border-radius: 100%;
							margin-right: 6rpx
						}
						.statusMsg {
							font-size: 28rpx;
							line-height: 33rpx;
						}
					}
				}
				.rightContent {
					flex: 1;
					.contentBox {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.itemDriver {
							line-height: 44rpx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							word-break: break-all;
							.driverName {
								font-size: 32rpx;
								font-weight: 600;
								color: #333333;
								padding-right: 13rpx;
							}
							.driverMobile {
								font-size: 32rpx;
								font-weight: 400;
								color: #333333;
								padding-right: 13rpx;
							}
							.driverCar {
								font-size: 32rpx;
								color: #333333;
							}
						}
					}
					.driverMsg {
						margin-top: 18rpx;
						height: 44rpx;
						display:flex;
						justify-content: space-between;
						align-items: center;
						.itemAddress {
							font-size: 32rpx;
							font-weight: 500;
							color: #3489E9;
						}
						.detailsBtn {
							display:flex;
							align-items: center;
							height: 31rpx;
							.msg {
								font-size: 28rpx;
								font-weight: 500;
								color: #3489E9;
								padding-right:11rpx;
							}
							.icon {
								width: 13rpx;
								height: 23rpx;
							}
						}
					}
					.itemDetails {
						margin-top: 18rpx;
						display: flex;
						.addressDetailsBox {
							flex: 1;
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: center;
							.beidou_icon {
								width: 34rpx;
								height: 34rpx;
								flex-shrink: 0;
								padding-right:10rpx;
							}
							.addr_text {
								font-size: 32rpx;
								color: #333333;
								line-height: 38rpx;
								// flex: 0 0 345rpx;
								// white-space: pre-wrap;
								width: 345rpx;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								word-break: break-all;
							}
						}
						.sourceCheckedMsg {
							flex-shrink: 0;
							font-size: 26rpx;
							color: #666666;
							line-height: 41rpx;
						}
					}
					.driverSyb {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 20rpx;
						.sybBox {
							display: flex;
							.sybList + .sybList {
								margin-left: 22rpx
							}
							.sybList {
								width: 108rpx;
								height: 46rpx;
								line-height: 46rpx;
								border-radius: 9rpx;
								border: 2rpx solid #5283FF;
								font-size: 26rpx;
								font-weight: 500;
								color: #5283FF;
								text-align: center;
								box-sizing: border-box;
							}
						}
						.hasWatch {
							font-size: 26rpx;
							color: #E8520D;
							line-height: 48rpx;
						}
					}
				}
			}
			.listBtnBox {
				.groupLine {
					margin: 0 28rpx 0 92rpx;
					height: 2rpx;
					background-color: #E0E0E0;
				}
				.userListBtnGroup {
					padding: 30rpx 52rpx;
					display: flex;
					justify-content: space-between;
					.btnBox {
						display: flex;
						align-items: center;
						.icon {
							width: 48rpx;
							height: 48rpx;
						}
						.msg {
							font-size: 28rpx;
							color: #333333;
							padding-left: 8rpx;
						}
						.collectionMsg {
							min-width: 92rpx;
						}
					}
				}
			}
		}
		@keyframes rotating {
		    0% {
		        transform:rotate(0deg);
		    }
		    100% {
		        transform:rotate(360deg);
		    }
		}
		.loadingBox {
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 1.5s linear infinite;
		        animation: rotating 1.5s linear infinite;
			}
			.noDataIcon {
				width: 252rpx;
				height: 252rpx;
				margin-top:50rpx;
			}
		}
		.noSourceNumBox {
			width: 630rpx;
			.closeIcon {
				width: 48rpx;
				height: 48rpx;
				display: block;
				margin: 0 0 10rpx 582rpx;
			}
			.msgBox {
				width: 630rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				box-sizing: border-box;
				padding: 38rpx 0;
				.mainTitle {
					font-size: 40rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
				}
				.mainContent {
					margin-top: 30rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
					padding: 0 54rpx;
				}
				.singleTouUpBtn {
					height: 80rpx;
					padding: 0 18rpx 0 26rpx;
					margin: 44rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #E55516 0%, #EE9456 100%);
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 44rpx;
					}
					.sigleRightIcon {
						height: 30rpx;
						width: 30rpx;
						display: block;
					}
				}
				.memberTouUpBtn {
					height: 92rpx;
					padding: 0 18rpx 0 12rpx;
					margin: 20rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #31313F 0%, #1F1F28 100%);
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #F0AB88;
						line-height: 44rpx;
						text-align: center;
					}
					.toBuyBtn {
						flex-shrink: 0;
						margin-left: 6rpx;
						width: 128rpx;
						height: 48rpx;
						border-radius: 228rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: linear-gradient(90deg, #F1D7C8 0%, #F0A27C 100%);
						.btnText {
							font-size: 28rpx;
							font-weight: 500;
							color: #422507;
						}
						.membersRightIcon {
							width: 28rpx;
							height: 28rpx;
							display: block;
						}
					}
				}
			}
		}
	}
</style>
