<template>
	<view class="recommendDriver">
		<view class="forFreeHintModel" v-if="recommendedList && recommendedList.length == 0 && !showSourceLoading && !hasLoadSource">
			<view class="recommendedFreeHintModel">
				<view class="hintList">
					<image class="hintIcon" src="/static/images/newOrderDetails/freeSearch.png"></image>
					<view class="msg">精准找车发货</view>
				</view>
				<view class="hintList">
					<image class="hintIcon" src="/static/images/newOrderDetails/freePhone.png"></image>
					<view class="msg">电话、聊天、短信邀请接单</view>
				</view>
				<view class="hintList">
					<image class="hintIcon" src="/static/images/newOrderDetails/freeMember.png"></image>
					<view class="msg">邀请司机加入您的车队</view>
				</view>
			</view>
			<view class="toFreeSearchBtn" @click="getNewSourceInfo()">开始试用</view>
		</view>
		<view class="selectBtnGroup" v-if="recommendedList && recommendedList.length > 0 && !showSourceLoading">
			<view class="selectBox" @click="showSelectPopup()" style="min-width: 168rpx;margin-right:20rpx;">
				<view class="msg" :style="selectCityParams.name ? 'color: #3489E9;' : 'color: #333;'">{{selectCityParams.name ? showSelectAddr(selectCityParams.name) : '地区'}}</view>
				<image class="selectIcon" :src="selectCityParams.name ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
			</view>
			<view class="refreshBtn" @click="getNewSourceInfo()">刷新推荐</view>
		</view>
		<view class="recommendedDetalsModel" v-for="(item, rIndex) in recommendedList" :key="rIndex" v-if="recommendedList && recommendedList.length > 0 && !showSourceLoading">
			<view class="listBox">
				<view class="driverMsgModel">
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
				<view class="recOperationModel">
					<view class="contentBox">
						<view class="itemDriver">
							<text class="driverName" v-if="item.driverName">{{showName(item.driverName)}}</text>
							<text class="driverMobile" v-if="!item.driverName">{{showPhone(item.driverPhone)}}</text>
							<text class="driverCar">{{item.carLength ? item.carLength + '米' : ''}}{{item.carModel ? item.carModel : ''}}</text>
						</view>
					</view>
					<view class="driverMsg">
						<view class="itemAddress" v-if="item.sender && item.receiver">{{showListSenderAddr(item.sender)}} - {{showListReceiverAddr(item.receiver)}}</view>
						<view class="detailsBtn" @click="jumpToDriverDetails(item.userId, item.checkStatus)">
							<text class="msg">详情</text>
							<image class="icon" src="/static/images/newIndex/defaultRight.png"></image>
						</view>
					</view>
					<view class="itemDetails">
						<view class="addressDetailsBox" v-if="beidouList.length > 0">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_beidou.png" class="beidou_icon" v-if="beidouList[rIndex].isBeiDou == 4 && showAddr(rIndex)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_wx.png" class="beidou_icon" v-if="beidouList[rIndex].isBeiDou == 3 && showAddr(rIndex)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_box.png" class="beidou_icon" v-if="beidouList[rIndex].isBeiDou == 1 && showAddr(rIndex)"></image>
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_app.png" class="beidou_icon" v-if="beidouList[rIndex].isBeiDou == 2 && showAddr(rIndex)"></image>
							<view class="addr_text">{{showAddr(rIndex)}}</view>
						</view>
						<view class="sourceCheckedMsg">{{showDate(rIndex)}}</view>
					</view>
					<view class="driverSyb" v-if="item.tagList.ROAD_TYPE || item.tagList.OFTEN_AREA || item.tagList.FAVORITE_CARGO || item.checkStatus == 1">
						<view class="sybBox">
							<view class="sybList" v-if="item.tagList.FAVORITE_CARGO">{{item.tagList.FAVORITE_CARGO}}</view>
							<view class="sybList" v-if="item.tagList.OFTEN_AREA">{{item.tagList.OFTEN_AREA}}</view>
							<view class="sybList" v-if="item.tagList.ROAD_TYPE">{{item.tagList.ROAD_TYPE}}</view>
						</view>
						<view class="hasWatch">{{item.checkStatus == 1 ? '您查看过' : ''}}</view>
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
					<view class="btnBox" v-if="!item.isCollect" @click="checkCollectNum(item, rIndex)">
						<image class="icon" src="/static/images/newFleetDetails/collection.png"></image>
						<view class="msg collectionMsg">收藏TA</view>
					</view>
					<view class="btnBox" v-if="item.isCollect == 1">
						<image class="icon" src="/static/images/newFleetDetails/collectioned.png"></image>
						<view class="msg collectionMsg">已收藏</view>
					</view>
					<view class="btnBox" @click="toCallUser(item, index)">
						<image class="icon" src="/static/images/newFleetDetails/mobile.png"></image>
						<view class="msg">联系TA</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="sourceLoadingModel" v-if="showSourceLoading">
			<image class="loadingIcon" src="/static/images/newOrderDetails/sourceLoading.png"></image>
			<view class="loadingMsg">正在为您加载推荐司机...</view>
		</view>
		<view class="loadingBox" v-show="noData">
			<image class="noDataIcon" src="/static/images/vehicleOptions/newNodata.png"></image>
		</view>
		<view class="loadingBox" v-show="noData">
			暂无当前范围的推荐车源～
		</view>
		<view class="loadingBox" v-show="noMore">没有更多了～</view>
		
		<uni-popup ref="noRecommendedNumPopup" type="center">
			<view class="recommendedHintBox">
				<view class="hintTitle">提示</view>
				<view class="hintContent">您当天的免费次数已经用完啦，继续推荐请充值，<text class="price">{{couponAccountType.pointUnitPrice / 1000}}</text>元/次</view>
				<view class="popupBtnGroup">
					<view class="btn cancel" @click="closeNoRecommendedNum()">取消</view>
					<view class="btn confirm" @click="toTopUpRecommendedNum()">去充值</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="mainRspMsgPopup" type="center">
			<view class="rspMsgBox">
				<view class="msgText">{{rspMsg}}</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="toViewPopup" type="center">
			<view class="rspMsgBox">
				<view class="msgText">您勾选了{{showCheckedNumVal}}条，给您跳转至车源详情</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="noSourceNumPopup" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle">提示</view>
					<view class="mainContent">您今天剩余可查询车辆条数为{{remainingNum}}条，可点击下面了解详情</view>
					<view class="singleTouUpBtn" @click="jumpToSingleTopup()">
						<view class="msg" v-if="firstTouUp == 1">充值{{couponAccountObj.pointFirstPrice ? couponAccountObj.pointFirstPrice / 1000 : 0}}元，查看{{couponAccountObj.pointNum ? couponAccountObj.pointNum : 0}}条最新车源，去充值</view>
						<view class="msg" v-if="!firstTouUp">充值{{couponAccountObj.pointPrice ? couponAccountObj.pointPrice / 1000 : 0}}元，查看{{couponAccountObj.pointNum ? couponAccountObj.pointNum : 0}}条最新车源，去充值</view>
						<image class="sigleRightIcon" src="/static/images/vehicleOptions/sigleRight.png"></image>
					</view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">
						<view class="msg">开通会员，享{{mealBaseInfo ? mealBaseInfo : 0}}条车源/天推荐</view>
						<view class="toBuyBtn">
							<view class="btnText">去购买</view>
							<image class="membersRightIcon" src="/static/images/vehicleOptions/membersRight.png"></image>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="sourceSelectPopup" type="top">
			<view class="sourceSelectBox">
				<view class="selectHead">
					<view class="selectBox" @click="showPopupDetails(1)" style="min-width: 168rpx;margin-right:20rpx;">
						<view class="msg" :style="popupDetails == 1 ? 'color: #3489E9;' : 'color: #333;'">{{popupCityParams.name ? popupCityParams.name : '地区'}}</view>
						<image class="selectIcon" :class="popupDetails == 1 ? 'toRolate' : ''" :src="popupDetails == 1 ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
					</view>
				</view>
				<view class="selectBody" v-if="popupDetails == 1">
					<view class="selectTitleItem">
						<view class="title">省份</view>
						<view class="title">城市</view>
					</view>
					<view class="selectAddressBox">
						<scroll-view class="province-item" style="flex: 0 0 260rpx;" :scroll-y="true">
							<view class="selectMsg" v-for="(item, index) in provinceArr" @click.stop="switchProIndex(index)">
								<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="selectedProvinceIndex == index"></image>
								<text class="msg" :style="selectedProvinceIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{replaceProvince(item.name)}}</text>
							</view>
						</scroll-view>
						<scroll-view class="province-item" :scroll-y="true">
							<view class="selectMsg" v-for="(item, index) in cityArr" @click.stop="switchCityIndex(index)">
								<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="selectedCityIndex == index"></image>
								<text class="msg" :style="selectedCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{item.shwowName ? item.shwowName : item.name}}</text>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="pop-btn">
					<view class="pop-btn-item reset" @click.stop="toResetSelectData()">重置</view>
					<view class="pop-btn-item look" @click.stop="toSelectSouce()">查看</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="noFleetNumPopup" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoFleetNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle">提示</view>
					<view class="mainContent">您车队人数已经达到上限啦，快来点击下面了解详情吧</view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">
						<view class="msg">开通会员，可邀请{{fleetBaseInfo ? fleetBaseInfo : 0}}位司机加入您的车队</view>
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
	import * as utils from "@/utils/ship.js";
	import * as service from "@/utils/service.js";
	import {longEvent} from "../../../longLink/consignorlongLink.js";
	import IMService from "@/utils/imservice.js";
	import * as utilDate from "@/utils/utils";
	import * as publicData from "@/utils/publicData.js";
	const { dateTimePicker} = require('@/utils/date.js');
	export default {
		data() {
			return {
				sid: '',
				userInfo: {},
				showSourceLoading: false,
				noData: false,
				noMore: false,
				sourceParams: {}, // 智能推荐请求参数
				recommendedNumObj: {}, // 推荐次数及套餐相关
				searchfreenum: {}, // 免费推荐次数
				couponAccountType: {}, // 推荐充值单价
				recommendedList: [],
				beidouList: [],
				provinceArr: [],
				cityArr: [],
				selectedProvinceIndex: -1,
				selectedCityIndex: -1,
				popupDetails: 1,
				popupCityParams: {},
				selectCityParams: {},
				timer: null,
				allCarSourceList: [],
				remainingNum: 0,
				couponAccountObj: {},
				mealBaseInfo: 0,
				firstTouUp: 0,
				noMore:false,
				pageSize: 10,
				totalNum: 0, //推荐车源总数
				showCheckedNumVal: 0,
				isLoading: false,
				beidouList: [],
				rspMsg: '',
				hasLoadSource: false,
				fleetBaseInfo: 0,
			};
		},
		onLoad(options) {
			console.log(options);
			let userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) {
				uni.navigateBack()
			}else {
				this.userInfo = userInfo ? JSON.parse(userInfo) : {};
				this.sid = options.sid;
				this.getListRecord();
				this.getProvince();
			}
		},
		onReachBottom() { // 上拉加载
			if(this.noData || this.noMore || this.showSourceLoading) {
				return false;
			}
			this.toLoadCarInfo();
		},
		methods: {
			getListRecord() {
				uni.showLoading({
					title: '加载中'
				});
				let params = {
					sid: this.sid
				}
				let that = this;
				console.log('询价详情查询参数', params);
				utils.newQueryPostRequest('/td/order/findListRecord', params)
				.then(res=>{
					// console.log('询价详情', res);
					if(res.retCode == '0000000') {
						let orderDetailInfo = res.rspBody;
						let orderChild = orderDetailInfo.orderChild;
						let orderAddressVOS = orderChild.orderAddressVOS;
						console.log('封装智能推荐请求参数');
						// 智能推荐请求参数
						let carModels = [];
						let orderVehicleModelVOS = orderChild.orderVehicleModelVOS;
						for(let m in orderVehicleModelVOS) {
							carModels.push(orderVehicleModelVOS[m].vehicleModel);
						}
						let carLengths = [];
						let orderVehicleLengthVOs = orderChild.orderVehicleLengthVOs;
						for(let l in orderVehicleLengthVOs) {
							carLengths.push(orderVehicleLengthVOs[l].vehicleLength + '');
						}
						let senderCode = '';
						let sendObj = orderAddressVOS['0'];
						if(sendObj.provinceCode == '310000' || sendObj.provinceCode == '110000' || sendObj.provinceCode == '500000' || sendObj.provinceCode == '120000') {
							senderCode = sendObj.provinceCode;
						}else {
							senderCode = sendObj.cityCode;
						}
						let receiverCode = '';
						let receiverObj = orderAddressVOS[orderAddressVOS.length - 1]
						if(receiverObj.provinceCode == '310000' || receiverObj.provinceCode == '110000' || receiverObj.provinceCode == '500000' || receiverObj.provinceCode == '120000') {
							receiverCode = receiverObj.provinceCode;
						}else {
							receiverCode = receiverObj.cityCode;
						}
						that.sourceParams = {
							carModels: carModels,
							carLengths: carLengths,
							senderCode: senderCode,
							receiverCode: receiverCode,
							userCode: that.userInfo.attrs.userCode,
							userId: that.userInfo.userId,
							cargoSid: that.sid,
							type: 1
						}
						console.log('智能推荐请求参数', that.sourceParams);
						that.getSourceInfo(); // 获取已推荐列表
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
				uni.stopPullDownRefresh();
			},
			getSourceInfo(flag) { // 获取已推荐列表
				if(this.showSourceLoading) return; 
				this.showSourceLoading = true;
				this.allCarSourceList = [];
				this.recommendedList = [];
				this.noData = false;
				this.noMore = false;
				let params = {
					"userCode": this.userInfo.attrs.userCode,
					"cargoSid": this.sid,
					"locationCode": this.selectCityParams.code ? this.selectCityParams.code : undefined,
					"locationName": this.selectCityParams.code ? this.selectCityParams.name : undefined,
				}
				console.log('搜索参数',params);
				let that = this;
				utils.postRequest('/olnanas/recommend/selectCarSource', params)
				.then(res=>{
					// console.log('推荐列表', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody;
						if(rspBody.carSourceVOS && rspBody.carSourceVOS.length > 0) {
							that.allCarSourceList = rspBody.carSourceVOS;
							that.fetchBeidouList(that.allCarSourceList);
							that.totalNum = rspBody.carSourceVOS.length;
							that.toLoadCarInfo();
							that.hasLoadSource = true;
						}else {
							if(flag == 'search') {
								that.noData = true
								that.hasLoadSource = true;
							}
						}
						// that.generatedTime = rspBody.generatedTime ? rspBody.generatedTime : '';
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					that.showSourceLoading = false;
				})
				.catch(err=>{
					that.showSourceLoading = false;
					console.log('获取推荐列表失败', err);
				})
			},
			fetchBeidouList(items) {
				var that = this;
				var addrAddress = [];
				// console.log(items, 'asasa');
				if (items.length < 1) {
					that.beidouList = [];
					return;
				}
				items.forEach(atem => {
					addrAddress.push(atem.userId)
				})
				utils.newQueryPostRequest("/olnanas/recommend/beidouPositioning", {
					userIds: addrAddress
				}).then(res => {
					// console.log(res, '北斗定位')
					if (res.retCode == "0000000") {
						that.beidouList = res.rspBody;
					} else {
						that.beidouList = [];
						// uni.showToast({
						// 	title: res.retDesc,
						// 	icon: 'none'
						// })
					}
				}).catch(err => {
					console.log(err)
				})
			},
			showDate(index) {
				var beidouList = this.beidouList;
				if (!beidouList) return;
				if (!beidouList[index]) return '';
				var locationDate = beidouList[index].locationDate;
				if (!locationDate) return '';
				return utilDate.findBeidouDateDesc(locationDate)
			},
			showAddr(index) {
				var beidouList = this.beidouList;
				var carInfo = this.recommendedList;
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
			toLoadCarInfo() { // 懒加载
				console.log('懒加载开始');
				// console.log(this.allCarSourceList);
				if(this.allCarSourceList && this.allCarSourceList.length == 0) {
					return false;
				}
				if(this.noMore || this.noData) {
					return false;
				}
				this.isLoading = true;
				let userIds = [];
				for(var i = 0; i < this.pageSize; i++) {
					if(this.allCarSourceList.length > 0) {
						this.allCarSourceList['0'].checked = false;
						this.recommendedList.push(this.allCarSourceList['0']);
						userIds.push(this.allCarSourceList['0'].userId);
						this.allCarSourceList.splice('0', 1);
					}else {
						this.noMore = true;
						break;
					}
				}
				if(userIds.length > 0) {
					this.toSendMessageEvent(userIds);
				}else {
					this.isLoading = false;
				}
			},
			toSendMessageEvent(userIds) { // 货主翻页向司机推送查看消息
				let params = {
					eventType: 1,
					userIds: userIds
				}
				console.log('查看消息参数', params);
				let that = this;
				utils.postRequest('/xxq/message/event', params)
				.then(function (res) {
					console.log('查看消息结果', res);
					if(res.retCode == '0000000'){
						
					}else{
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
			getNewSourceInfo(flag) { // 获取新推荐列表
				this.allCarSourceList = [];
				this.recommendedList = [];
				this.totalNum = 0;
				this.showSourceLoading = true;
				this.hasLoadSource = true;
				// 刷新推荐重置筛选参数
				this.selectedProvinceIndex = 0;
				this.selectedCityIndex = -1;
				this.popupDetails = 1;
				this.popupCityParams = {};
				this.selectCityParams = {};
				this.noMore = false;
				this.noData = false;
				console.log('推荐参数', this.sourceParams);
				let that = this;
				utils.newQueryPostRequest('/olnanas/recommend/getCarSource', that.sourceParams)
				.then(res=>{
					// console.log('推荐列表', res);
					if(res.retCode == '0000000') {
						that.showSourceLoading = false;
						let rspBody = res.rspBody;
						if(rspBody.carSourceVOS && rspBody.carSourceVOS.length > 0) {
							that.allCarSourceList = rspBody.carSourceVOS;
							that.totalNum = rspBody.carSourceVOS.length;
							//加载北斗定位数据
							that.fetchBeidouList(rspBody.carSourceVOS);
							that.toLoadCarInfo();
						}else {
							that.noData = true;
						}
					}else{
						that.showSourceLoading = false;
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					console.log('获取推荐列表失败', err);
				})
			},
			showGeneratedTime(time) {
				let str = time;
				str = str.slice(5);
				str = str.substring(0, str.length - 3);
				str = str.replace('-', '/');
				return str;
			},
			closeNoRecommendedNum() { // 关闭弹窗
				this.$refs.noRecommendedNumPopup.close();
			},
			toTopUpRecommendedNum() { // 去充值
				getApp().globalData.smsObj = {
					amount: this.couponAccountType.pointUnitPrice / 1000,
					noteVOS: []
				}
				this.$refs.noRecommendedNumPopup.close();
				uni.navigateTo({
					url: '../smsTopUp?typeNum=41'
				})
			},
			getQueryByUser() { // 获取免费次数
				let that = this;
				utils.postRequest('/cp/cycle/act/set/meal/queryByUser', {usersid: this.userInfo.userId})
				.then(res=>{
					console.log('获取免费次数结果', res);
					if(res.retCode == '0000000') {
						that.recommendedNumObj = res.rspBody['0'];
						that.searchfreenum = that.recommendedNumObj.setmitemsMap.searchfreenum;
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					console.log('获取免费次数失败', err);
				})
			},
			getQueryPrice() { // 获取推荐次数充值单价
				let that = this;
				utils.postRequest('/cp/couponAccountType/list', {"level1": "车源"})
				.then(res=>{
					console.log('获取推荐次数充值单价结果', res);
					if(res.retCode == '0000000') {
						that.couponAccountType = res.rspBody['0'];
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					console.log('获取推荐次数充值单价失败', err);
				})
			},
			
			toSorting(arr){
			    var interval = parseInt(arr.length / 2);  //分组间隔设置
			    while(interval > 0){
			        for(var i = 0 ; i < arr.length ; i ++){
			            var n = i;
			            while(arr[n] < arr[n - interval] && n > 0){
			                var temp = arr[n];
			                arr[n] = arr[n - interval];
			                arr[n - interval] = temp;
			                n = n - interval;
			            }
			        }
			        interval = parseInt(interval / 2);
			    }
			    return arr;
			},
			jumpToUserMember() { // 跳转会员列表
				this.$refs.noSourceNumPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage?pageName=sourceIndex'
				})
			},
			showSelectPopup() { // 打开筛选弹窗
				this.$refs.sourceSelectPopup.open();
			},
			getProvince() { // 从本地缓存获取省市区数据，本地缓存没有则从接口获取，再存入缓存
				var provinceLocal = uni.getStorageSync("regionData");
				if(provinceLocal) {
					this.provinceArr = provinceLocal;
					// this.pushDiyCityItem(this.provinceArr[0].code, 0);
				}else {
					let that = this;
					utils.postRequest('/ts/nationDict/getBasicData')
					.then(res => {
						if (res.retCode == "0000000") {
							var provinceArr = res.rspBody;
							that.provinceArr = provinceArr;
							// that.pushDiyCityItem(provinceArr[0].code, 0);
							uni.setStorage({
								key: 'regionData',
								data: res.rspBody,
								success: function(saveRes) {
									// console.log('地区数据缓存成功！', saveRes);
									uni.setStorageSync('regionUpdate', 1)
								},
								fail: function(saveErr) {
									// console.log('地区数据缓存失败！', saveErr);
								}
							});
						} else {
							// console.log('地区接口异常：', res.retDesc);
						}
					})
					.catch(err => {
						// console.log('地区接口请求异常：', err);
					})
				}
			},
			pushDiyCityItem(provinceName, provinceCode, index) { // 根据传入的省或市code判断塞入 全市/全省
				var cities = this.provinceArr[index].cities;
				if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
					var coties = [{
						showName: '全市',
						name: provinceName,
						code: provinceCode
					}, ...cities]
				} else {
					var coties = [{
						showName: '全省',
						name: provinceName,
						code: provinceCode
					}, ...cities]
				}
				this.cityArr = coties;
			},
			switchProIndex(index) { // 选择省
				if (index == this.selectedProvinceIndex) return;
				this.selectedProvinceIndex = index;
				this.selectedCityIndex = -1;
				//切换城市
				var provinceArr = this.provinceArr;
				var provinceCode = provinceArr[index].code;
				var provinceName = provinceArr[index].name;
				this.popupCityParams = {
					code: provinceCode,
					name: provinceName,
				}
				this.pushDiyCityItem(provinceName, provinceCode, index);
			},
			switchCityIndex(index) { // 选择市
				this.selectedCityIndex = index;
				console.log(this.cityArr[index]);
				this.popupCityParams = {
					code: this.cityArr[index].code,
					name: this.cityArr[index].name,
				}
			},
			toResetSelectData() { // 重置选择的省市区
				if(this.selectedCityIndex != -1) { // 选择过市才重置
					this.selectedProvinceIndex = -1;
					this.selectedCityIndex = -1;
					this.cityArr = [];
					this.popupCityParams = {};
				}
			},
			toSelectSouce() { // 保存省市区数据
				if(this.selectedProvinceIndex == -1 && this.selectedCityIndex == -1) {
					this.selectCityParams = {};
				}else if(this.selectedProvinceIndex != -1 && this.selectedCityIndex == -1) {
					this.selectCityParams = {
						code: this.provinceArr[this.selectedProvinceIndex].code,
						name: this.provinceArr[this.selectedProvinceIndex].name,
					}
				}else {
					this.selectCityParams = {
						code: this.cityArr[this.selectedCityIndex].code,
						name: this.cityArr[this.selectedCityIndex].name,
					}
				}
				this.$refs.sourceSelectPopup.close();
				this.noData = false;
				this.getSourceInfo('search');
			},
			replaceProvince(name) { // 去除省的，省、市、自治区、维吾尔、壮族、回族
				let returnName = name.replace('省', '');
				returnName = returnName.replace('市', '');
				returnName = returnName.replace('自治区', '');
				returnName = returnName.replace('维吾尔', '');
				returnName = returnName.replace('壮族', '');
				returnName = returnName.replace('回族', '');
				return returnName;
			},
			showPopupDetails(flag) { // 切换popup展示
				this.popupDetails = flag;
			},
			showName(str) { // 展示司机姓名
				if(str) {
					return str.substr(0, 1) + '师傅';
				}
			},
			showPhone(str) { // 展示司机手机
				if(str) {
					let fir = str.substr(0, 3);
					let sec = str.substr(7, 4);
					return fir + '****' + sec;
				}
			},
			toCallUser(item, index) { // 联系TA
				if(item.checkStatus == 1) {
					this.checkCallPermissions(item, index);
				}else {
					uni.showLoading();
					let params = {
						"ownerUserCode": this.userInfo.attrs.userCode,
						"userId": this.userInfo.userId,
						"type": 1,
						"carSourceSid": [item.sid]
					}
					console.log('消费参数', params);
					let that = this;
					utils.postRequest('/olnanas/recommend/consumeNumber', params)
					.then(function (res) {
						console.log('消费结果', res);
						if(res.retCode == '0000000'){
							uni.hideLoading();
							if(res.rspBody < 0) {
								that.recommendedList[index].checkStatus = 1;
								that.checkCallPermissions(item, index);
							}else {
								console.log('消费次数失败');
								that.getRemainingPoint();
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
						console.log('消费请求失败', res.retDesc);
					})
				}
			},
			checkCallPermissions(item) {
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
							that.makePhoneCall(result, item);
						}
					)
				}else {
					this.makePhoneCall(1, item);
				}
			},
			makePhoneCall(result, item) {
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
			getRemainingPoint() { // 消费次数失败则获取消费次数并打开弹窗
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
						that.remainingNum = Number(noteStr.carsourcenum.nowsurnum);
						that.firstTouUp = Number(noteStr.carsourcenum.firstRecharge);
						that.getCouponAccountType(); // 获取推荐次数充值单价
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
			closeNoNumPopup() { // 关闭充值弹窗
				this.$refs.noSourceNumPopup.close();
			},
			getCouponAccountType() { // 单次充值配置
				let params = {
					"level1": "车源",
				}
				console.log('单次充值费参数', params);
				let that = this;
				utils.postRequest('/cp/couponAccountType/list', params)
				.then(function (res) {
					console.log('单次充值结果', res);
					if(res.retCode == '0000000'){
						that.couponAccountObj = {};
						that.couponAccountObj = res.rspBody && res.rspBody.length > 0 ? res.rspBody['0'] : {};
						that.getMealBaseList(); // 会员套餐
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('单次充值配置请求失败', res.retDesc);
				})
			},
			showListSenderAddr(str) {
				return str.substr(0, 4);
			},
			showListReceiverAddr(str) {
				return str.substr(0, 4);
			},
			jumpToDriverDetails(id, checkStatus) { // 跳转司机详情
				uni.navigateTo({
					url: '../driverDetails/driverDetails?id=' + id + '&encryption=' + 0
				})
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
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + item.checkStatus
				})
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
			checkCollectNum(item, index) { // 检查消费次数
				if(item.checkStatus == 1) {
					this.checkFleetNumPopup(item, index);
				}else {
					uni.showLoading();
					let params = {
						"ownerUserCode": this.userInfo.attrs.userCode,
						"userId": this.userInfo.userId,
						"type": 1,
						"carSourceSid": [item.sid]
					}
					console.log('消费参数', params);
					let that = this;
					utils.postRequest('/olnanas/recommend/consumeNumber', params)
					.then(function (res) {
						console.log('消费结果', res);
						if(res.retCode == '0000000'){
							if(res.rspBody < 0) {
								that.checkFleetNumPopup(item, index);
							}else {
								uni.hideLoading();
								console.log('消费次数失败');
								that.getRemainingPoint();
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
						console.log('消费请求失败', res.retDesc);
					})
				}
			},
			checkFleetNumPopup(item, index) { // 检查车队人数
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
							uni.hideLoading();
							that.$refs.noFleetNumPopup.open();
						}else {
							that.toCollectUser(item, index);
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
					console.log('剩余条数请求失败', res.retDesc);
				})
			},
			closeNoFleetNumPopup() { // 关闭充值弹窗
				this.$refs.noFleetNumPopup.close();
			},
			getMealBaseList() { // 会员套餐列表
				let params = {
					"setmfree": "0",
					"setmrole": "cargo",
					"setmchannel": "app",
					setmdisp: 1,
				}
				// console.log('会员套餐参数', params);
				let that = this;
				utils.postRequest('/cp/set/meal/base/list', params)
				.then(function (res) {
					console.log('会员套餐结果', res);
					if(res.retCode == '0000000'){
						let rspBody = res.rspBody;
						that.mealBaseInfo = 0;
						that.fleetBaseInfo = 0;
						if(rspBody && rspBody.length > 0) {
							let items = rspBody[rspBody.length - 1];
							let setmitemsJson = items.setmitems.replace(/\//g, '');
							let obj = JSON.parse(setmitemsJson);
							that.mealBaseInfo = Number(obj.carsourcenum.defval);
							that.fleetBaseInfo = Number(obj.fleetmemsize.defval);
							uni.hideLoading();
							that.$refs.noSourceNumPopup.open();
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
							that.recommendedList[index].isCollect = 1;
							that.recommendedList[index].checkStatus = 1;
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
			showSelectAddr(str) {
				return str.substr(0, 6);
			},
			jumpToSingleTopup() { // 单次充值
				getApp().globalData.smsObj = {
					amount: this.firstTouUp == 1 ? this.couponAccountObj.pointFirstPrice / 1000 : this.couponAccountObj.pointPrice / 1000,
					noteVOS: [],
					point: Number(this.couponAccountObj.pointNum)
				}
				this.$refs.noSourceNumPopup.close();
				uni.navigateTo({
					url: '../smsTopUp?typeNum=54'
				})
			},
		}
	}
</script>

<style lang="scss">
	.recommendDriver {
		min-height:100vh;
		background-color: #FAFAFA;
		.forFreeHintModel {
			padding-top: 120rpx;
			.recommendedFreeHintModel {
				border-radius: 0 0 24rpx 24rpx;
				background: #FFFFFF;
				overflow: hidden;
				.hintList + .hintList {
					padding-top: 36rpx !important;
					border-top: 1rpx solid #DCDCDC;
				}
				.hintList {
					margin-left: 58rpx;
					display: flex;
					align-items: center;
					padding-top: 22rpx;
					padding-bottom: 36rpx;
					.hintIcon {
						display: block;
						width: 44rpx;
						height: 44rpx;
						margin-right: 18rpx;
					}
					.msg {
						font-size: 32rpx;
						color: #333333;
						line-height: 44rpx;
					}
				}
			}
			.toFreeSearchBtn {
				width: 400rpx;
				height: 80rpx;
				background: #2B72F0;
				border-radius: 16rpx;
				margin: 250rpx auto 0 auto;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 80rpx;
				text-align: center;
			}
		}
		.recommendedDetalsModel {
			background: #FFFFFF;
			box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
			border-radius: 24rpx;
			margin:20rpx 32rpx 0 32rpx;
			.listBox {
				display: flex;
				padding: 18rpx 32rpx 32rpx 0;
			}
			.driverMsgModel {
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
			.recOperationModel {
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
							font-size: 35rpx;
							font-weight: 600;
							color: #333333;
							padding-right: 13rpx;
						}
						.driverMobile {
							font-size: 28rpx;
							font-weight: 400;
							color: #333333;
							padding-right: 13rpx;
						}
						.driverCar {
							font-size: 35rpx;
							color: #333333;
						}
					}
				}
				.driverMsg {
					margin-top: 20rpx;
					height: 48rpx;
					display:flex;
					justify-content: space-between;
					align-items: center;
					.itemAddress {
						font-size: 35rpx;
						font-weight: 500;
						color: #3888FF;
					}
					.detailsBtn {
						display:flex;
						align-items: center;
						height: 31rpx;
						.msg {
							font-size: 26rpx;
							font-weight: 500;
							color: #333333;
							padding-right:11rpx;
						}
						.icon {
							width: 13rpx;
							height: 23rpx;
						}
					}
				}
				.itemDetails {
					margin-top: 20rpx;
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
							font-size: 35rpx;
							color: #333333;
							line-height: 41rpx;
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
					margin-top: 22rpx;
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
		
		.sourceSelectBox {
			background-color: #FFF;
			padding:0 0 66rpx 0;
			border-bottom-left-radius: 24rpx;
			border-bottom-right-radius: 24rpx;
			.selectHead {
				padding: 36rpx 34rpx;
				border-bottom: 2rpx solid #EAEAEA;
				display: flex;
				align-items: center;
				// .selectBox + .selectBox {
				// 	margin-left: 80rpx;
				// }
				.selectBox {
					display: flex;
					align-items: center;
					.msg {
						font-size: 36rpx;
						font-weight: 500;
						line-height: 42rpx;
						margin-right: 12rpx;
					}
					.selectIcon {
						width: 27rpx;
						height: 15rpx;
					}
				}
			}
			.selectBody {
				padding: 32rpx 34rpx 20rpx 34rpx;
				.selectTitleItem {
					display: flex;
					.title {
						width: 260rpx;
						font-size: 36rpx;
						font-weight: 500;
						color: #333333;
						line-height: 42rpx;
					}
				}
				.selectAddressBox {
					display: flex;
					padding: 50rpx 0;
					// 
					.province-item {
						height: 670rpx;
						.selectMsg + .selectMsg {
							margin-top:26rpx;
						}
					}
				}
			}
			.selectBody, .checkedStatusGroup {
				.selectMsg {
					line-height: 38rpx;
					.check {
						width: 30rpx;
						height: 22rpx;
						margin-right: 10rpx;
					}
					.msg {
						font-size: 32rpx;
					}
				}
			}
			.checkedStatusGroup {
				padding: 32rpx 34rpx 80rpx 34rpx;
				display: flex;
				.selectMsg {
					width: 190rpx;
				}
			}
			.pop-btn {
				height: 78rpx;
				width: 666rpx;
				display: flex;
				flex-direction: row;
				background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_pop_bg.png");
				background-size: cover;
				background-repeat: no-repeat;
				background-position: 100%;
				border-radius: 25rpx;
				margin: 0 auto;
				.pop-btn-item {
					width: 50vw;
					display: flex;
					justify-content: center;
					align-items: center;
					font-weight: 500;
					&.reset {
						color: rgba(43, 114, 240, 1);
					}
					&.look {
						color: #FFFFFF;
						
					}
				}
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
					}
					.toBuyBtn {
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
		.rspMsgBox {
			width: 410rpx;
			padding: 20rpx;
			box-sizing: border-box;
			height: 222rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 20rpx 2rpx rgba(56,136,255,0.18);
			border-radius: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.msgText {
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #000000;
				line-height: 44rpx;
				letter-spacing: 2rpx;
			}
		}
		.recommendedHintBox {
			width: 552rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			.hintTitle {
				padding:40rpx 0 26rpx 0;
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
				line-height: 42rpx;
				letter-spacing: 2rpx;
				text-align: center;
			}
			.hintContent {
				padding: 0 50rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				line-height: 33rpx;
				letter-spacing: 2rpx;
				text-align: center;
				.price {
					font-size: 28rpx;
					font-weight: 500;
					color: #F04141;
				}
			}
			.popupBtnGroup {
				display: flex;
				border-top: 2rpx solid #F1F1F1;
				margin-top:50rpx;
				.btn + .btn {
					border-left: 2rpx solid #F1F1F1;
				}
				.btn {
					flex: 1;
					padding: 18rpx 0 26rpx 0;
					text-align: center;
					font-size: 32rpx;
					font-weight: 400;
					color: #666666;
					line-height: 38rpx;
				}
				.cancel {
					color:#666;
				}
				.confirm {
					color:#4EADF1;
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
		.sourceLoadingModel {
			border-bottom-left-radius:36rpx;
			border-bottom-right-radius:36rpx;
			padding: 154rpx 0 200rpx 0;
			.loadingIcon {
				display: block;
				width: 136rpx;
				height: 136rpx;
				margin: 0 auto 180rpx auto;
				-webkit-animation: rotating 1.5s linear infinite;
				animation: rotating 1.5s linear infinite;
			}
			.loadingMsg {
				font-size: 28rpx;
				color: #333333;
				line-height: 44rpx;
				text-align: center;
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
		.selectBtnGroup {
			padding: 20rpx 32rpx 0 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.refreshBtn {
				width: 176rpx;
				background: #F94B4B;
				height: 76rpx;
				line-height: 76rpx;
				border-radius: 90rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
			.selectBox {
				display: flex;
				align-items: center;
				.msg {
					font-size: 36rpx;
					font-weight: 500;
					line-height: 42rpx;
					margin-right: 12rpx;
				}
				.selectIcon {
					width: 27rpx;
					height: 15rpx;
				}
			}
		}
	}
</style>
