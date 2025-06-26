<template>
	<view class="sourceDetails">
		<!-- <view class="headOperationGroup" v-if="carInfo && carInfo.length > 0">
			<view class="mapBtn" @click="jumpToMap()">
				<image class="icon" src="/static/images/vehicleOptions/mapIcon.png"></image>
				<view class="msg">地图</view>
			</view>
		</view> -->
		<view class="carOptionList" v-for="(item, index) in carInfo" :key="index">
			<view class="leftContent">
				<!-- <image class="itemAvatar" :src="item.driverImage ? item.driverImage : '/static/images/goodsDelivery/shipUserLogo.png'"></image>
				<view class="hasSigning" v-if="item.signed == 1">签约</view> -->
				<view class="avatar-icon" v-if="item.isBindDevice == 1">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/box-avatar-first-1.png" class="box-avatar"></image>
					<view class="avatar-content">
						<image :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'" class="avatar"></image>					
						<view class="avatar-tips">
							<view class="avatar-tips-content">精选</view>
						</view>
					</view>
				</view>
				<view class="avatar-icon" v-if="item.isBindDevice != 1 && item.isBindZj == 1">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/box-bold-avatar.png" class="box-avatar"></image>
					<view class="avatar-content">
						<image :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'" class="avatar-bold"></image>					
						<view class="avatar-tips">
							<view class="avatar-tips-content bold">黄金</view>
						</view>
					</view>
				</view>
				<view class="avatar-icon-other" v-if="item.isBindDevice != 1 && item.isBindZj != 1">
					<image :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'" class="avatar-other"></image>
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
					<view class="checkBox">
						<image @click="toCheckSource(item)" class="checkIcon" :src="item.checked ? '/static/images/vehicleOptions/checkedIcon.png' : '/static/images/vehicleOptions/nCheck.png'"></image>
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
				<view class="itemLine"></view>
				<view class="itemBtnGroup">
					<view class="itemBtn" @click.stop="call(item)">
						<image class="btnIcon" src="/static/images/vehicleOptions/phoneIcon.png"></image>
						<view class="btnMsg">电话</view>
					</view>
					<view class="itemBtn" @click.stop="toChatDetails(item)">
						<image class="btnIcon" src="/static/images/vehicleOptions/msgIcon.png"></image>
						<view class="btnMsg">私信</view>
					</view>
				</view>
			</view>
			<!-- <view class="leftContent">
				<image class="itemAvatar" :src="item.driverImage ? item.driverImage : '/static/images/goodsDelivery/shipUserLogo.png'"></image>
				<view class="itemDetails">
					<view class="itemDriver">
						<text class="driverName" v-if="item.driverName">{{showName(item.driverName)}}</text>
						<text class="driverMobile">{{showPhone(item.driverPhone)}}</text>
					</view>
					<view class="itemDriver">
						<text class="driverCar">{{item.carLength ? item.carLength + '米' : ''}}{{item.carModel ? item.carModel : ''}}</text>
						<text class="itemAddress" v-if="item.sender && item.receiver">{{showSenderAddr(item.sender)}} - {{showReceiverAddr(item.receiver)}}</text>
					</view>
					<view class="addr itemDriver">
						<view class="beidou_text" v-if="beidouList.length > 0">
							<image src="/static/images/ship/beidou_icon.png" class="beidou_icon" v-if="beidouList[index].isBeiDou && showAddr(index)"></image>
							<image src="/static/images/ship/beidou_no_icon.png" class="beidou_no_icon" v-if="!beidouList[index].isBeiDou && showAddr(index)"></image>
						</view>
						
						<view class="addr_text">
							<text class="addr_text_addr">{{showAddr(index)}}</text>
						</view>
					</view>
					<view class="itemLine"></view>
					<view class="itemBtnGroup">
						<view class="itemBtn" @click.stop="call(item)">
							<image class="btnIcon" src="/static/images/vehicleOptions/phoneIcon.png"></image>
							<view class="btnMsg">电话</view>
						</view>
						<view class="itemBtn" @click="driverMap(item)">
							<image class="btnIcon" src="/static/images/vehicleOptions/MemberPositioning.png"></image>
							<view class="btnMsg">定位</view>
						</view>
						<view class="itemBtn" @click.stop="toChatDetails(item)">
							<image class="btnIcon" src="/static/images/vehicleOptions/msgIcon.png"></image>
							<view class="btnMsg">私信</view>
						</view>
					</view>
				</view>
			</view>
			<view class="rightContent">
				<view class="checkBox">
					<image @click="toCheckSource(item)" class="checkIcon" :src="item.checked ? '/static/images/vehicleOptions/checkedIcon.png' : '/static/images/vehicleOptions/nCheck.png'"></image>
				</view>
				<view class="priceTitle" v-if="item.expectedPrice">期望价格</view>
				<view class="priceNum" v-if="item.expectedPrice">{{item.expectedPrice}}/{{item.unit}}</view>
			</view> -->
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
		<view class="footBtnGroup" v-if="!noData">
			<view class="checkedBox">
				<image class="checkIcon" @click="newCheckAll()" :src="allCheckedFlag ? '/static/images/vehicleOptions/checked.png' : '/static/images/vehicleOptions/checkDefault.png'"></image>
				<view class="checkedMsg" @click="newCheckAll()" :style="allCheckedFlag ? 'color:#3888FF;' : 'color:#333;'">全选</view>
				<view class="checkedNumMsg" v-if="newCheckedItem && newCheckedItem.length > 0">已选中{{newCheckedItem.length}}条</view>
			</view>
			<image class="recommendedIcon" src="/static/images/newIndex/recommendedicon.png"></image>
			<view class="rightBtnBox">
				<view class="btn" style="background-color: #3888FF;" @click="openSMSPopup()">群发短信</view>
				<view class="btn" style="background: linear-gradient(90deg, #4368EA 0%, #BC3AEA 100%);" @click="openFleetPopup()">加入我的车队</view>
			</view>
		</view>
		
		<uni-popup ref="smsPopup" type="center">
			<view class="smsBox">
				<view class="smsContent">短信内容：{{userInfoName}}对您发布的车源有兴趣，快上货运中国联系他吧！</view>
				<view class="smsPrice">短信费用为<text style="color:#EE3E02;">0.1</text>元/条，本次共需充值<text style="color:#EE3E02;">{{smsObj.amount}}</text>元</view>
				<view class="popupBtnGroup">
					<view class="btn cancel" @click="closeSMSPopup()">取消</view>
					<view class="btn confirm" @click="jumpToSMSTopUp()">充值并发送</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="myFleetPopup" type="center">
			<view class="myFleetBox">
				<image class="popupCloseIcon" @click="closeFleetPopup()" src="/static/images/vehicleOptions/closePopupBtn.png"></image>
				<view class="popupTitle">选择您的车队</view>
				<scroll-view class="popupList" :scroll-y="true" :show-scrollbar="false">
					<view class="myFleetInfoBox" v-for="(item, fIndex) in myFleetData" :key="fIndex" @click="item.checked = !item.checked">
						<image class="checkIcon" :src="item.checked ? '/static/images/vehicleOptions/checkedIcon.png' : '/static/images/vehicleOptions/nCheck.png'"></image>
						<view class="fleetName">{{item.name}}</view>
					</view>
				</scroll-view>
				<view class="popupBtn" @click="toAddUserInFleet()">确定</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="fleetHintPopup" type="center">
			<view class="fleetHintBox">
				<image class="popupCloseIcon" @click="closeFleetHintPopup()" src="/static/images/vehicleOptions/closePopupBtn.png"></image>
				<view class="popupTitle">提示</view>
				<view class="hintMsg">您还没有创建车队</view>
				<view class="popupBtn" @click="jumpToCreatFleet()">去新建车队</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="mainRspMsgPopup" type="center">
			<view class="rspMsgBox">
				<view class="msgText">{{rspMsg}}</view>
			</view>
		</uni-popup>
		
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
	export default {
		data() {
			return {
				allCheckedFlag: false,
				carInfo: [],
				newCheckedItem: [],
				noData: false,
				noMore: false,
				isLoading: false,
				pageSize: 20,
				pageNum: 1,
				userInfo: {},
				userInfoName: '',
				smsObj: {
					amount: 0,
					noteVOS: [],
				},
				myFleetData: [],
				rspMsg: '',
				checkedCarItem: [],
				allCarSourceList: [],
				orderMsg: {},
				hasOrder: '',
				beidouList: [],
				addFleetFlag: '',
				pageFrom: '',
				fleetmemsize: '',
				mealBaseInfo: 0
			};
		},
		onLoad(option) {
			var that = this;
			this.pageFrom = option.pageFrom;
			
			if(option.hasOrder) {
				this.hasOrder = option.hasOrder;
				this.orderMsg = getApp().globalData.sendOrder;
			}
			this.addFleetFlag = option.addFleetFlag ? option.addFleetFlag : '';
			this.getUserInfo();
			this.allCarSourceList = getApp().globalData.confirmTotViewAry;
			//请求北斗定位接口
			var allCarSourceList = this.allCarSourceList;
			var beidouList = [];
			allCarSourceList.forEach(item => {
				beidouList.push(item.userId)
			})
			console.log(beidouList, 'aasda', allCarSourceList)
			//请求北斗信息
			utils.newQueryPostRequest("/olnanas/recommend/beidouPositioning", {
				userIds: beidouList,
			}).then(rsp => {
				console.log(rsp, 'assa');
				if (rsp.retCode == "0000000") {
					that.beidouList = rsp.rspBody
				} else {
					that.beidouList = [];
					// uni.showToast({
					// 	title: rsp.retDesc,
					// 	icon: 'none'
					// })
				}
			})
			uni.showLoading();
			this.toLoadCarInfo();
			uni.$on("smsSendSuccess", (data) => {
				this.openRspMsgPopup('群发短信成功～');
			});
			this.getMealBaseList(); // 会员套餐
		},
		onShow() {
			this.getMyFleetInfo();
		},
		onReachBottom() { // 上拉加载
			if(this.noData || this.noMore || this.isLoading) {
				return false;
			}
			this.toLoadCarInfo();
		},
		onBackPress(event){
			if (event.from == 'backbutton') {
				if(this.hasOrder) {
					uni.$emit("clearCheckedAryInOrder");
				}else {
					uni.$emit("clearCheckedAry");
				}
			}
		},
		methods: {
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
			getUserInfo() { // 获取用户信息
				this.userInfo = {};
				let userData = uni.getStorageSync("userInfo");
				console.log('用户信息', JSON.parse(userData));
				this.userInfo = userData ? JSON.parse(userData) : {};
			},
			toLoadCarInfo(flag) { // 懒加载
				this.isLoading = true;
				for(var i = 0; i < this.pageSize; i++) {
					if(this.allCarSourceList.length > 0) {
						this.allCarSourceList['0'].checked = false;
						this.carInfo.push(this.allCarSourceList['0']);
						this.allCarSourceList.splice('0', 1);
					}else {
						this.noMore = true;
						break;
					}
				}
				
				console.log('加载完后', this.allCarSourceList);
				this.isLoading = false;
			},
			newCheckAll() { // 当allCheckedFlag为true则再次按下为全部取消，allCheckedFlag为false则全为选中
				if(this.allCheckedFlag) {
					for(let i in this.carInfo) {
						this.carInfo[i].checked = false;
					}
					this.allCheckedFlag = false;
					this.newCheckedItem = [];
				}else {
					this.newCheckedItem = [];
					for(let i in this.carInfo) {
						this.carInfo[i].checked = true;
						this.newCheckedItem.push(this.carInfo[i]);
					}
					this.allCheckedFlag = true;
				}
			},
			openSMSPopup() {
				if(this.hasCheckedItem()) {
					this.userInfoName = this.userInfo.userName ? this.userInfo.userName.substr(0, 1) + '先生' : '用户' + this.showPhone(this.userInfo.mobile);
					this.smsObj = {
						amount: 0,
						noteVOS: [],
					}
					let topUpAry = [];
					for(let i in this.carInfo) {
						if(this.carInfo[i].checked) {
							topUpAry.push(this.carInfo[i]);
						}
					}
					// this.smsObj.amount = 0.1 * topUpAry.length;
					this.smsObj.amount = this.floatMul(0.1, topUpAry.length);;
					this.smsObj.noteVOS = topUpAry;
					this.$refs.smsPopup.open();
				}else {
					uni.showToast({
						title: '请选择车源',
						icon: 'none'
					})
				}
			},
			floatMul(arg1,arg2)   {     
			    var m=0,s1=arg1.toString(),s2=arg2.toString();     
			    try{m+=s1.split(".")[1].length}catch(e){}     
			    try{m+=s2.split(".")[1].length}catch(e){}     
			    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);     
			},
			closeSMSPopup() {
				this.$refs.smsPopup.close();
			},
			getMyFleetInfo() { // 获取车队列表
				let that = this;
				that.myFleetData = [];
				utils.newQueryPostRequest('/cd/fleet/list', { pageNum: 1, pageSize: 999, isMyFleet: 1, isOwner: 1 })
				.then(res=>{
					console.log('我的车队', res);
					if(res.retCode == '0000000') {
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								items[i].checked = false;
								// that.myFleetData.push(items[i]);
							}
							that.myFleetData = items;
						}
						// console.log(this.addFleetFlag);
						if(that.addFleetFlag && Number(that.addFleetFlag)) {
							console.log('打开车队弹窗');
							setTimeout(()=>{
								that.newCheckAll();
								that.addFleetFlag = '';
								setTimeout(()=>{
									that.openFleetPopup();
								}, 100)
							}, 100)
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			openFleetPopup() {
				// this.$refs.noSourceNumPopup.open();
				if(this.hasCheckedItem()) {
					if(this.myFleetData && this.myFleetData.length > 0) {
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
								if(that.fleetmemsize < that.newCheckedItem.length) {
									that.$refs.noSourceNumPopup.open();
								}else {
									that.$refs.myFleetPopup.open();
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
					}else {
						this.$refs.fleetHintPopup.open();
					}
				}else {
					uni.showToast({
						title: '请选择车源',
						icon: 'none'
					})
				}
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
			hasCheckedItem() { // 检查是否有选中的车源
				for(let i in this.carInfo) {
					if(this.carInfo[i].checked) {
						return true;
					}
				}
			},
			checkCarItemRepeat(userId) {
				for(let i in this.checkedCarItem) {
					if(this.checkedCarItem[i].userId == userId) {
						return true;
					}
				}
			},
			toAddUserInFleet() { // 邀请加入车队
				if(this.hasCheckedFleetChecked()) {
					this.checkedCarItem = [];
					for(let c in this.carInfo) {
						if(this.carInfo[c].checked) {
							if(this.checkedCarItem.length > 0) {
								if(!this.checkCarItemRepeat(this.carInfo[c].userId)) {
									this.checkedCarItem.push(this.carInfo[c])
								}
							}else {
								this.checkedCarItem.push(this.carInfo[c])
							}
						}
					}
					let checkedFleetItem = [];
					for(let f in this.myFleetData) {
						if(this.myFleetData[f].checked) {
							checkedFleetItem.push(this.myFleetData[f])
						}
					}
					console.log('选中的车源', this.checkedCarItem);
					console.log('选中的车队', checkedFleetItem);
					let paramsInfo = [];
					for(let a in this.checkedCarItem) {
						for(let b in checkedFleetItem) {
							let obj = {
								"commonUserId": this.userInfo.userId,
								"commonUserName": this.userInfo.userName ? this.userInfo.userName : undefined,
								"fleetId": checkedFleetItem[b].id,
								"fleetName": checkedFleetItem[b].name,
								"userId": this.checkedCarItem[a].userId,
								"userCode": this.checkedCarItem[a].userCode
							}
							paramsInfo.push(obj);
						}
					}
					this.batchInteraction();
					this.batchSendUserMsg();
					console.log('邀请参数', paramsInfo);
					let that = this;
					utils.postRequest('/cd/fleetWithUser/invite', paramsInfo)
					.then(function (res) {
						console.log('加入车队结果', res);
						if(res.retCode == '0000000'){
							that.$refs.myFleetPopup.close();
							setTimeout(()=>{
								that.openRspMsgPopup('已经把司机加入您的车队请稍后在车队查看');
							}, 700)
						} else{
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						console.log(err);
					})
				}else {
					uni.showToast({
						title: '请选择车队',
						icon: 'none'
					})
				}
			},
			openRspMsgPopup(msg) {
				for(let c in this.carInfo) {
					this.carInfo[c].checked = false;
				}
				this.newCheckedItem = [];
				this.allCheckedFlag = false;
				this.rspMsg = msg;
				this.$refs.mainRspMsgPopup.open();
				setTimeout(()=>{
					this.$refs.mainRspMsgPopup.close();
				},3000)
			},
			hasCheckedFleetChecked() {
				for(let i in this.myFleetData) {
					if(this.myFleetData[i].checked) {
						return true;
					}
				}
			},
			closeFleetPopup() {
				this.$refs.myFleetPopup.close();
			},
			closeFleetHintPopup() {
				this.$refs.fleetHintPopup.close();
			},
			jumpToCreatFleet() {
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify != 1 || faceVerify != 1) {
					uni.showToast({
						title: '请先实名认证',
						icon: 'none'
					})
					return;
				}
				uni.navigateTo({
					url: '/pages/my/fleet/fleetCreate/fleetCreate?type=create'
				})
			},
			jumpToSMSTopUp() {
				this.batchInteraction();
				this.batchSendUserMsg();
				getApp().globalData.smsObj = {
					amount: this.smsObj.amount,
					noteVOS: this.smsObj.noteVOS,
				}
				this.$refs.smsPopup.close();
				uni.navigateTo({
					url: '../smsTopUp?typeNum=31'
				})
			},
			call(item) {
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
					if (this.pageFrom == "manyCarsDetail") {
						publicData.addBuried("智能推荐拨打司机电话")
					} else {
						publicData.addBuried("货主搜索车源拨打司机电话")
					}

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
			toChatDetails(item) { // 跳转私聊
				console.log(item);
				uni.showLoading({
					title: '加载中'
				})
				let userData = uni.getStorageSync("userInfo");
				console.log('用户信息', JSON.parse(userData));
				let userInfo = userData ? JSON.parse(userData) : {};
				let userName = item.driverName ? item.driverName.substr(0, 1) + '**' : '';
				let avatar = item.driverImage ? item.driverImage : '../../../static/images/goodsDelivery/shipUserLogo.png';
				this.carSourceInteraction(item);
				this.toSendDriverMsg(item);
				if(this.goEasy.getConnectionStatus() == 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
					uni.hideLoading();
					if(this.orderMsg.sid) {
						this.sendCustomMessage(item.userCode, avatar, userName, item.userId);
					}else {
						uni.navigateTo({
							url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
						})
					}
				}else {
					uni.hideLoading();
					if(this.orderMsg.sid) {
						this.sendCustomMessage(item.userCode, avatar, userName, item.userId);
					}else {
						uni.navigateTo({
							url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
						})
					}
				}
			},
			sendCustomMessage(userCode, avatar, userName, userId) {
				var im = this.goEasy.im;
				//创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
				var customMessage = im.createCustomMessage({
				    type:'order',  //字符串，可以任意自定义类型，比如红包'hongbao', 订单'order，处方'chufang'
				    payload: this.orderMsg,
				    to : {
				        type : this.GoEasy.IM_SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
						id : userCode,
				        data:{"avatar": avatar, "name": userName, "userId": userId} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
				    },
					notification : { //APP在后台运行，或进程被杀掉，将会收到通知栏提醒
					    title : userName + '发来一条货源',
					    body : '[货源卡片]'
					}
				});
				//发送消息
				let that = this;
				im.sendMessage({
				    message: customMessage,
				    onSuccess: function (message) { //发送成功
						console.log('发送成功');
						uni.navigateTo({
							url: '../userMessage/chatDetails?receiverId=' + userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + userId
						})
				    },
				    onFailed: function (error) { //发送失败
						console.log('发送失败');
						uni.navigateTo({
							url: '../userMessage/chatDetails?receiverId=' + userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + userId
						})
				    }
				});
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
			batchSendUserMsg() { // 批量发送消息
				let userIdAry = [];
				for(let c in this.carInfo) {
					if(this.carInfo[c].checked) {
						userIdAry.push(this.carInfo[c].userId);
					}
				}
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
			batchInteraction() { // 批量互动接口
				let sidAry = [];
				for(let c in this.carInfo) {
					if(this.carInfo[c].checked) {
						let obj = {
							nowdataSid: this.carInfo[c].sid,
							batchNumber: this.carInfo[c].batchNumber,
							userCode: this.userInfo.attrs.userCode ? this.userInfo.attrs.userCode : undefined,
							userId: this.userInfo.userId ? this.userInfo.userId : undefined,
							personId: this.userInfo.attrs.personId ? this.userInfo.attrs.personId : undefined,
							name: this.userInfo.userName ? this.userInfo.userName : undefined,
							phone: this.userInfo.mobile ? this.userInfo.mobile : undefined,
							imgUrl: this.userInfo.attrs.avatar ? this.userInfo.attrs.avatar : undefined,
							
						}
						sidAry.push(obj);
					}
				}
				console.log('互动参数', sidAry)
				utils.postRequest('/cy/carSourceInteraction/add', sidAry)
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
			driverMap(item) {
			    //跳转司机定位
				uni.navigateTo({
					url: '/pages/ship/carSource/driverMap?driverDetail=' + JSON.stringify(item)
				})
			},
			toCheckSource(item) { // 单个选中
				item.checked = !item.checked;
				let repeatKey = this.checkItemRepeat(item.sid)
				if(repeatKey) {
					this.newCheckedItem.splice(repeatKey, 1)
				}else {
					this.newCheckedItem.push(item);
				}
				if(this.newCheckedItem.length == this.carInfo.length) {
					this.allCheckedFlag = true;
				}else {
					this.allCheckedFlag = false;
				}
			},
			checkItemRepeat(sid) { // 检查是否有重复
				if(this.newCheckedItem.length == 0) {
					return false;
				}
				for(let i in this.newCheckedItem) {
					if(this.newCheckedItem[i].sid == sid) {
						return i;
						break;
					}
				}
			},
			jumpToMap() {
				getApp().globalData.driverMarkers = [];
				getApp().globalData.driverMarkers = this.carInfo;
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						var longitude = res.longitude;
						var latitude = res.latitude;
						uni.navigateTo({
							url: '../orderDetails/driverMap?longitude=' + longitude + '&latitude=' + latitude
						})
					},
					fail: function() {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
					}
				})
				
			},
			showSenderAddr(str) {
				return str.substr(0, 4);
			},
			showReceiverAddr(str) {
				return str.substr(0, 4);
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
				return utilDate.findBeidouDateDesc(locationDate)
				// if (beidouList[index].isBeiDou == 1) {
				// 	//判断北斗定位时间和app定位时间哪个最新
				// 	return ''
				// } else {
				// 	// return utilDate.findFleetDateDesc(date);
				// 	return ''
				// }
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
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F1F4F9;
	}
	.sourceDetails {
		padding-bottom: 198rpx;
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
			margin: 20rpx 36rpx 0 36rpx;
			background-color: #FFF;
			box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
			border-radius: 24rpx;
			padding: 16rpx 22rpx 0 20rpx;
			display: flex;
			justify-content: space-between;
			.leftContent {
				flex-shrink: 1;
				flex: 0 0 136rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.avatar-icon {
				        margin-top: 16rpx;
				        width: 130rpx;
				        height: 102rpx;
				        display: flex;
				        flex-direction: column;
				        justify-content: center;
				        align-items: center;
				        position: relative;
				      }
				      .avatar-icon-other {
				          margin-top: 30rpx;
				          width: 92rpx;
				          height: 102rpx;
				      }
				      .avatar-other {
				        width: 40px;
				        height: 40px;
				        border-radius: 100%;
				      }
				      .box-avatar {
				          width: 130rpx;
				          height: 102rpx;
				      }
				      .avatar-content {
				        position: absolute;
				        top: 0;
				        right: 0;
				        z-index: 2;
				        width: 130rpx;
				        height: 102rpx;
				        display: flex;
				        justify-content: center;
				        align-items: center;
				        .avatar {
				            width: 68rpx;
				            height: 68rpx;
				            border-radius: 100%;
				            margin-left: 4rpx;
				        }
				        .avatar-bold {
				            width: 68rpx;
				            height: 68rpx;
				            border-radius: 100%;
				            margin-bottom: 2rpx;
				        }
				        .avatar-tips {
				            position: absolute;
				            bottom: 0;
				            left: 0;
				            width: 130rpx;
				            z-index: 2;
				            display: flex;
				            justify-content: center;
				            align-items: center;
				            .avatar-tips-content {
				                width: 74rpx;
				                height: 28rpx;
				                font-size: 16rpx;
				                border-radius: 70rpx;
				                background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/jingxuan-btn-icon.png");
				                background-size: cover;
				                display: flex;
				                justify-content: center;
				                align-items: center;
				                font-weight: 500;
				                color: #000;
				                &.bold {
				                    background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/bold-btn-icon.png");
				                
				                }
				            }
				        }
				      }
				.itemAvatar {
					width: 80rpx;
					height: 80rpx;
					display: block;
					border-radius: 100%;
					position: relative;
					z-index: 49;
				}
				.hasSigning {
					width: 62rpx;
					height: 20rpx;
					line-height: 20rpx;
					background: linear-gradient(180deg, #51A2FE 0%, #1081F9 100%);
					border-radius: 70rpx;
					font-size: 16rpx;
					font-weight: 500;
					color: #FFFFFF;
					text-align: center;
					margin: -16rpx auto 0 auto;
					position: relative;
					z-index: 50;
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
				padding-left: 20rpx;
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
					.checkBox {
						height: 41rpx;
						display: flex;
						justify-content: flex-end;
						.checkIcon {
							display: block;
							width: 41rpx;
							height: 41rpx;
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
				.itemLine {
					flex: 1;
					height: 1rpx;
					background-color: #E3E3E3;
					margin: 20rpx 0 0 0;
				}
				.itemBtnGroup {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					padding: 16rpx 0 24rpx 0;
					.itemBtn + .itemBtn {
						margin-left: 112rpx
					}
					.itemBtn {
						display:flex;
						align-items: center;
						.btnIcon {
							width: 48rpx;
							height: 48rpx;
							display: block;
						}
						.btnMsg {
							font-size: 28rpx;
							color: #000000;
							line-height: 33rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		// 	.leftContent {
		// 		display: flex;
		// 		flex: 1;
		// 		margin-right: 68rpx;
		// 		.itemAvatar {
		// 			border-radius: 100%;
		// 			width: 88rpx;
		// 			height: 88rpx;
		// 			display: block;
		// 			flex-shrink: 0;
		// 			margin-right:20rpx;
		// 		}
		// 		.itemDetails {
		// 			flex: 1;
		// 			padding-top: 4rpx;
		// 			.itemDriver {
		// 				line-height: 44rpx;
		// 				.driverName {
		// 					font-size: 32rpx;
		// 					font-weight: 500;
		// 					color: #333333;
		// 					padding-right: 22rpx;
		// 				}
		// 				.driverMobile {
		// 					font-size: 28rpx;
		// 					color: #333333;
		// 				}
		// 				.driverCar {
		// 					font-size: 24rpx;
		// 					font-weight: 500;
		// 					color: #333333;
		// 				}
		// 				.itemAddress {
		// 					font-size: 24rpx;
		// 					font-weight: 500;
		// 					color: #2B72F0;
		// 					padding-left:34rpx;
		// 				}
		// 			}
		// 			.addr {
		// 				display: flex;
		// 				flex-direction: row;
		// 				justify-content: flex-start;
		// 				align-items: flex-start;
		// 				line-height: 32rpx;
		// 				.beidou_text {
		// 					line-height: 32rpx;
		// 					height: 32rpx;
		// 					margin-right: 10rpx;
		// 				}
		// 				.beidou_no_icon {
		// 					width: 32rpx;
		// 					height: 32rpx;
		// 				}
		// 				.beidou_icon {
		// 					width: 24rpx;
		// 					height: 24rpx;
		// 				}
		// 				.addr_text {
		
		// 					flex: 1;
		// 					font-size: 24rpx;
		// 					color: rgba(0, 0, 0, 1);
		// 					.addr_text_addr {
		// 						 white-space: pre-wrap;
		// 						 line-height: 32rpx;
		// 					}
		// 				}
						
		// 			}
		// 			.itemLine {
		// 				flex: 1;
		// 				height: 1rpx;
		// 				background-color: #E3E3E3;
		// 				margin: 8rpx 0 10rpx 0;
		// 			}
		// 			.itemBtnGroup {
		// 				display: flex;
		// 				justify-content: space-between;
		// 				align-items: center;
		// 				.itemBtn {
		// 					.btnIcon {
		// 						width: 48rpx;
		// 						height: 48rpx;
		// 						display: block;
		// 					}
		// 					.btnMsg {
		// 						font-size: 20rpx;
		// 						color: #000000;
		// 						line-height: 23rpx;
		// 						margin-top: 4rpx;
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// 	.rightContent {
		// 		flex-shrink: 0;
		// 		.checkBox {
		// 			height: 41rpx;
		// 			display: flex;
		// 			justify-content: flex-end;
		// 			.checkIcon {
		// 				display: block;
		// 				width: 41rpx;
		// 				height: 41rpx;
		// 			}
		// 		}
		// 		.priceTitle {
		// 			font-size: 24rpx;
		// 			color: #666666;
		// 			line-height: 44rpx;
		// 			margin-top:32rpx;
		// 			text-align: right;
		// 		}
		// 		.priceNum {
		// 			font-size: 24rpx;
		// 			color: #666666;
		// 			line-height: 44rpx;
		// 			text-align: right;
		// 		}
		// 	}
		}
		.footBtnGroup {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			height: 178rpx;
			box-sizing: border-box;
			padding: 18rpx 32rpx 0 32rpx;
			background-color: #FFF;
			box-shadow: 0px -4rpx 16rpx 2rpx rgba(172,172,172,0.41);
			z-index: 100;
			.checkedBox {
				display: flex;
				align-items: center;
				.checkIcon {
					width: 32rpx;
					height: 32rpx;
					display: block;
				}
				.checkedMsg {
					font-size: 28rpx;
					font-weight: 600;
					line-height: 44rpx;
					padding: 0 24rpx 0 4rpx;
				}
				.checkedNumMsg {
					font-size: 24rpx;
					color: #333333;
					line-height: 44rpx;
					text-align: right;
				}
			}
			.recommendedIcon {
				width: 50rpx;
				height: 50rpx;
				position: absolute;
				right:30rpx;
				margin-top: 16rpx;
			    -webkit-animation: moving 1s linear infinite;
			    animation: moving 1s linear infinite;
			}
			@keyframes moving {
			    0% {
					right:30rpx;
					// animation-timing-function: cubic-bezier(0, .5, .5, 1);
					animation-timing-function: cubic-bezier(0.68, 0.42, 0.27, 1.55);
			    }
				50% {
					right:56rpx;
				}
			    100% {
			        right:30rpx;
			    }
			}
			.rightBtnBox {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top:6rpx;
				.btn + .btn {
					margin-left: 60rpx;
				}
				.btn {
					width: 260rpx;
					height: 76rpx;
					line-height: 76rpx;
					border-radius: 90rpx;
					font-size: 36rpx;
					font-weight: 500;
					color: #FFFFFF;
					text-align: center;
				}
			}
		}
		.smsBox {
			width: 552rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			.smsContent {
				padding: 44rpx 80rpx 0 80rpx;
				text-align: center;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				line-height: 33rpx;
			}
			.smsPrice {
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 28rpx;
				text-align: center;
				margin-top: 16rpx;
			}
			.popupBtnGroup {
				display: flex;
				border-top: 2rpx solid #F1F1F1;
				margin-top:34rpx;
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
		.myFleetBox {
			height: 590rpx;
			width: 464rpx;
			.popupCloseIcon {
				display: block;
				position: absolute;
				width: 40rpx;
				height: 40rpx;
				right: 18rpx;
				top:12rpx;
			}
			.popupTitle {
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #000000;
				line-height: 44rpx;
				padding-top: 30rpx;
			}
			.popupList {
				height: 348rpx;
				margin-top: 34rpx;
				.myFleetInfoBox + .myFleetInfoBox {
					margin-top:20rpx;
				}
				.myFleetInfoBox {
					margin-left:42rpx;
					margin-right:42rpx;
					height: 72rpx;
					background: #F2F2F2;
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					padding: 0 0 0 24rpx;
					.checkIcon {
						width: 28rpx;
						height: 28rpx;
						display: block;
						flex-shrink: 0;
						margin-right:56rpx;
					}
					.fleetName {
						font-size: 28rpx;
						font-weight: 400;
						color: #333333;
						line-height: 44rpx;
					}
				}
			}
			.popupBtn {
				margin: 34rpx auto 0 auto;
				background-color: #3888FF;
				width: 312rpx;
				height: 62rpx;
				line-height: 62rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
				border-radius: 16rpx;
			}
			.hintMsg {
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				line-height: 33rpx;
				margin-top: 16rpx;
				text-align: center;
			}
		}
		.fleetHintBox {
			height: 360rpx;
			width: 600rpx;
			.popupCloseIcon {
				display: block;
				position: absolute;
				width: 54rpx;
				height: 54rpx;
				right: 18rpx;
				top:12rpx;
			}
			.popupTitle {
				text-align: center;
				font-size: 44rpx;
				font-weight: 500;
				color: #333333;
				line-height: 52rpx;
				padding-top: 52rpx;
			}
			.popupBtn {
				margin: 66rpx auto 0 auto;
				background-color: #3888FF;
				width: 336rpx;
				height: 68rpx;
				line-height: 68rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
				border-radius: 16rpx;
			}
			.hintMsg {
				font-size: 36rpx;
				color: #333333;
				line-height: 42rpx;
				letter-spacing: 2rpx;
				margin-top: 16rpx;
				text-align: center;
			}
		}
		.myFleetBox, .fleetHintBox {
			background: #FFFFFF;
			border-radius: 24rpx;
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
