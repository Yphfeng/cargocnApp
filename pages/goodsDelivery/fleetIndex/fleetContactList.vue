<template>
	<view class="mapCarSourceList">

		<view class="header-box">
			<view class="statusBar" :style="{height: statusBarHeight + 'rpx'}" />
			<view class="header">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_left_arrow.png"
					class="car_source_left_arrow" @click="back"></image>
				<text>联系方式</text>
			</view>
		</view>
		<view class="headerSendebox" :style="{height: (statusBarHeight + 88) + 'rpx'}" />

		<view class="list">
			<view class="noData01" v-if="selectedMapArr.length == 0 && isNoData != 'loading'">
				<noData></noData>
			</view>
			<template v-for="(item,index) in selectedMapArr">
				<view class="car_source_item" v-if="true">
					<view class="head">
						<view class="avatar-icon" v-if="item.isBindDevice == 1">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/box-avatar-first-1.png"
								class="box-avatar"></image>
							<view class="avatar-content-abs">
								<image
									:src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"
									class="avatar"></image>
								<view class="avatar-tips">
									<view class="avatar-tips-content">精选</view>
								</view>
							</view>
						</view>
						<view class="avatar-icon" v-else-if="item.isBindZj == 1">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/box-bold-avatar.png"
								class="box-avatar"></image>
							<view class="avatar-content-abs">
								<image
									:src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"
									class="avatar-bold"></image>
								<view class="avatar-tips">
									<view class="avatar-tips-content bold">黄金</view>
								</view>
							</view>
						</view>
						<view class="avatar-icon-other" v-else>
							<image
								:src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png' "
								class="avatar-other"></image>
						</view>
						<view class="order_receive_status" :class="{order_receive_status_2: item.taskStatus == 2}">
							<view></view>
							<text>{{item.taskStatus != 2 ? "可接单" : '忙碌'}}</text>
						</view>
					</view>
					<view class="right_content">
						<view class="name_model">
							<view class="user_name">{{showName(item)}}</view>
							<view class="user_model">{{item.model?setModel(item.model):''}}</view>
							<image v-if="item.isCheck" @click="isAllChecked(item,index)"
								src="../../../static/images/isPhone.png" />
							<image v-else @click="isAllChecked(item,index)"
								src="../../../static/images/isPnone_block.png" />
						</view>
						<view class="name_model" style="margin-top: 18rpx">
							<view class="citys" v-if="item.circuitCombo">{{item.circuitCombo}}</view>
							<view class="details"
								@click="jumpToDriverDetails(item.userId, 1, (info.isOwner || info.isAdmin) ? 1 : 0)">
								<view>详情</view>
								<image
									src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_right_blue_icon.png" />
							</view>
						</view>
						<view class="name_model" style="margin-top: 18rpx">
							<view class="address_icon_content">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_beidou.png" class="beidou_icon" v-if="item.dataSrc == 4"></image>
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_wx.png" class="beidou_icon" v-else-if="item.dataSrc == 3"></image>
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_box.png" class="beidou_icon" v-else-if="item.dataSrc == 1"></image>
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_app.png" class="beidou_icon" v-else></image>
							</view>

							<view class="address">{{showAddr(item)}}</view>
							<view class="times">{{showDate(item)}}</view>
						</view>
						<view class="name_model" style="margin-top: 22rpx">
							<view class="btn-content" v-if="item.tagShowArr.length">
								<view class="btn-item" v-for="atem in item.tagShowArr">
									<text>{{atem.tagName}}</text>
								</view>
							</view>
							<view class="is_see" v-if="item.isContact">您今天查看过</view>
						</view>
						<view class="dot" :style="{opacity: isAlertJoin != 5 ? 1 : 0 }" />

						<view class="row " v-if="isAlertJoin == 1">
							<view class="opt-item" />
							<view class="opt-item" @click="makePhoneCall(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-call.png"
									class="point-icon"></image>
								<text>电话</text>
							</view>

							<view class="opt-item" @click="toChatDetails(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png"
									class="point-icon"></image>
								<text>私信</text>
							</view>
						</view>
						<view class="row " v-if="isAlertJoin == 2">
							<view class="opt-item" />
							<view class="opt-item" />
							<view class="opt-item" @click="toTrack(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-location.png"
									class="point-icon"></image>
								<text>轨迹</text>
							</view>
						</view>
						<view class="row " v-if="isAlertJoin == 3">
							<view class="opt-item" />
							<view class="opt-item" @click="toTrack(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-location.png"
									class="point-icon"></image>
								<text>轨迹</text>
							</view>
							<view class="opt-item" @click="toChatDetails(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png"
									class="point-icon"></image>
								<text>私信</text>
							</view>
						</view>
						<view class="row " v-if="isAlertJoin == 4">
							<view class="opt-item" />
							<view class="opt-item" />
							<view class="opt-item" @click="toChatDetails(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png"
									class="point-icon"></image>
								<text>私信</text>
							</view>
						</view>
						<view class="row " v-if="isAlertJoin == 6">
							<view class="opt-item" @click="toTrack(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-location.png"
									class="point-icon"></image>
								<text>轨迹</text>
							</view>
							<view class="opt-item" @click="makePhoneCall(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-call.png"
									class="point-icon"></image>
								<text>电话</text>
							</view>
							<view class="opt-item" @click="toChatDetails(item)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png"
									class="point-icon"></image>
								<text>私信</text>
							</view>
						</view>
					</view>
				</view>
			</template>

			<uni-morebox :isMore="isMore" :containerStyle="{'margin-top': '24rpx'}"></uni-morebox>
		</view>
		<view class="footBtnGroup">
			<view class="checkedBox">
				<image class="checkIcon" @click="checkAllItem"
					:src="allCheckedFlag ? '/static/images/vehicleOptions/checked.png' : '/static/images/vehicleOptions/checkDefault.png'">
				</image>
				<view class="checkedMsg" :style="allCheckedFlag ? 'color:#3888FF;' : 'color:#333;'">全选</view>
				<view class="checkedNumMsg">已选中{{allCheckedNum}}条</view>
			</view>
			<view class="btn_list">
				<!-- <view class="see_line">群发短信</view> -->
				<view class="opt-item" />
				<view class="add_fleet opt-item" @click="toMyFleet">
					加入我的车队
					<view class="opt-showPoints">
						<image src="/static/images/newIndex/recommendedicon.png" class="opt-showPoints-icon"></image>
					</view>
				</view>
			</view>
			<!-- <image class="bounce_image" src="../../../static/images/hand_block.png" /> -->
		</view>
		<uni-popup ref="myFleetPopup" type="center">
			<view class="myFleetBox">
				<image class="popupCloseIcon" @click="closeFleetPopup()"
					src="/static/images/vehicleOptions/closePopupBtn.png"></image>
				<view class="popupTitle"><text class="popupTitle-text">选择您的车队</text></view>
				<scroll-view class="popupList" :scroll-y="true" :show-scrollbar="false">
					<view class="myFleetInfoBox" v-for="(item, fIndex) in myFleetData" :key="fIndex"
						@click="item.checked = !item.checked">
						<image class="checkIcon"
							:src="item.checked ? '/static/images/vehicleOptions/checkedIcon.png' : '/static/images/vehicleOptions/nCheck.png'">
						</image>
						<view class="fleetName"><text class="fleetName-text">{{item.name}}</text></view>
					</view>
				</scroll-view>
				<view class="popupBtn" @click="toAddUserInFleet()"><text class="popupBtn-text">确定</text></view>
			</view>
		</uni-popup>

		<uni-popup ref="fleetHintPopup" type="center">
			<view class="fleetHintBox">
				<image class="popupCloseIcon" @click="closeFleetHintPopup()"
					src="/static/images/vehicleOptions/closePopupBtn.png"></image>
				<view class="popupTitle"><text class="popupTitle-text">提示</text></view>
				<view class="hintMsg"><text class="hintMsg-text">您还没有创建车队</text></view>
				<view class="popupBtn" @click="jumpToCreatFleet()"><text class="popupBtn-text">去新建车队</text></view>
			</view>
		</uni-popup>
		<uni-popup ref="mainRspMsgPopup" type="center">
			<view class="rspMsgBox">
				<view class="msgText"><text class="msgText-text">{{rspMsg}}</text></view>
				
			</view>
		</uni-popup>
		<uni-popup ref="noSourceNumPopup" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle"><text class="mainTitle-noSource-text">提示</text></view>
					<view class="mainContent"><text class="mainContent-noSource-text">您车队人数已经达到上限啦～，快点击下面了解详情吧</text></view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car-source-nvue-bf-2.png" class="car-source-nvue-bf-2"></image>
						<view class="memberTouUpBtn-content">
							<view class="msg">
								<text class="msg-btn-text"  v-if="isRoleMember">升级会员，享{{mealBaseInfo ? mealBaseInfo : 0}}位司机加入您的车队</text>
								<text class="msg-btn-text"  v-else>开通会员，享{{mealBaseInfo ? mealBaseInfo : 0}}位司机加入您的车队</text>
							</view>
							<view class="toBuyBtn">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car-source-nvue-btn-1.png" class="car-source-nvue-btn-1"></image>
								<view class="toBuyBtn-content">
									<view class="btnText"><text class="btnText-text">去购买</text></view>
									<image class="membersRightIcon" src="/static/images/vehicleOptions/membersRight.png"></image>
																
								</view>
								
							</view>
						</view>
						
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	import * as utilDate from "@/utils/utils.js"
	import UniMorebox from "@/components/uni-morebox.vue";
	import noData from "@/components/noData.vue";
	import * as publicData from "@/utils/publicData.js";
	const {
		dateTimePicker,
		getMonthDay
	} = require('@/utils/date.js');
	export default {
		components: {
			UniMorebox,
			noData
		},
		data() {
			return {
				remainingNum: 0,
				mealBaseInfo: 0,
				allCheckedFlag: false,
				allCheckedNum: 0,
				showOpt: 0,
				isNoData: 'loading',
				isMore: 'more',
				refreshing: false,
				info: null,
				source: '',
				statusBarHeight: '',
				optionsParams: {},
				selectedMapArr: [],
				selectedMapTotal: [],
				myFleetData: [],
				rspMsg: '',
				willJoinFleetArr: [], //将要加入车队的司机
				isAlertJoin: 0,
				startYear: 2000,
				userInfo: null,
				isRoleMember: false,
			}
		},
		async onLoad(options) {
			//加载默认的起始地
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = JSON.parse(userInfo);
			
			var addFleetFlag = options.addFleetFlag;
			this.addFleetFlag = addFleetFlag;
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight * 2
			var selectedMapArr = JSON.parse(options.selectedMapArr);
			selectedMapArr.forEach(item => {
				var tagList = item.tagList;
				var tagShowArr = []
				if (tagList) {
					tagList.forEach(item => {
						if (item.tagTypeCode == "FAVORITE_CARGO") {
							tagShowArr.push(item)
						}
						if (item.tagTypeCode == "OFTEN_AREA") {
							tagShowArr.push(item)
						}
						if (item.tagTypeCode == "ROAD_TYPE") {
							tagShowArr.push(item)
						}
					})
				}
			
				item.tagShowArr = tagShowArr;
			})
			this.selectedMapTotal = selectedMapArr;
			var fleetDetail = options.fleetDetail;
			var info = JSON.parse(fleetDetail);
			var userRole = uni.getStorageSync("userRole");
			
			//判断车队是否是平台车队
			if (info.fleetAttributes == "车型" || info.fleetAttributes == "线路" || info.fleetAttributes == "行业") {
				info.ext3 = "SUPER_FLEET"
			}
			
			this.info = info;
			if (userRole == 2 && info.isAdmin != 1 && info.isOwner != 1 && info.ext3 == "SUPER_FLEET") {
				//游客，成员，超级车队
				this.isAlertJoin = 1
			}
			if (userRole == 2 && info.isMember != 1 && info.ext3 != "SUPER_FLEET") {
				//游客货主。普通车队
				this.isAlertJoin = 2
			}
			if (userRole == 2 && info.isMember == 1 && info.isOwner != 1 && info.isAdmin != 1 && info.ext3 !=
				"SUPER_FLEET") {
				//成员货主。普通车队
				this.isAlertJoin = 3
			}
			if (userRole == 1 && info.isMember == 1 && info.isOwner != 1 && info.isAdmin != 1) {
				//成员司机逛车队
				this.isAlertJoin = 4
			}
			if (userRole == 1 && info.isMember != 1) {
				//游客司机逛车队
				this.isAlertJoin = 5
			}
			if (info.isAdmin || info.isOwner) {
				//车队长，管理员逛车队
				this.isAlertJoin = 6
			}
			await this.getMyFleetInfo();
			await this.getInitData();

		},
		async onShow() {
			setTimeout(() => {
				if (this.myFleetData.length < 1) {
					this.getMyFleetInfo();
				}
			}, 1000)
		},
		onPullDownRefresh() {
			if (this.isNoData == "loading") return;
			this.isNoData = 'loading';
			this.getData("refresh")
		},
		onReachBottom() {
			if (this.isMore == "loading" || this.isMore == "noMore") return;
			this.isMore = "loading";
			this.getData("more")
		},
		methods: {
			jumpToDriverDetails(id, checkStatus, showPriceSensitivity) { // 跳转司机详情
				uni.navigateTo({
					url: '/pages/goodsDelivery/driverDetails/driverDetails?id=' + id + '&encryption=' +
						checkStatus + '&showPriceSensitivity=' + showPriceSensitivity
				})
			},
			async getMemberInfo() {
				var that = this;
				var userId = this.userInfo.userId;
				console.log(userId, 'aa')
				var res = await ship.postRequest("/cp/act/set/meal/queryByUser", {
					usersid: userId,
					setmchannel: "app",
					setmfree: 0,
				})
				if (res.retCode == "0000000") {
					var arr = res.rspBody;
					return arr.length > 0 ? arr[0] : null;
				} else {
					return null;
				}
			},
			async getInitData() {
				var selectedMapTotal = this.selectedMapTotal;
				var selectArr = selectedMapTotal.splice(0, 10);
				if (selectArr.length < 10) {
					this.isMore = "noMore"
				} else {
					this.isMore = "more"
				}
				var addFleetFlag = this.addFleetFlag;
				selectArr.forEach(item => {
					item.isCheck = addFleetFlag == 1 ? true : false;
				})
				
				this.allCheckedFlag = addFleetFlag == 1 ? true : false;
				this.allCheckedNum = addFleetFlag == 1 ? selectArr.length : 0;
				this.selectedMapArr = selectArr;
				if (addFleetFlag == 1) {
					//加入我的车队按钮进来
					//判断剩余条数够不够
					var userId = this.userInfo.userId;
					var result = await this.getMemberInfo();
					console.log("会员套餐", result);
					
					await this.getMealBaseList(); //获取会员套餐配置
					this.isRoleMember = result ? true : false; //判断是否是会员
					
					var rsp = await ship.postRequest("/cp/member/queryByUser", {
						"usersid": userId,
						"setmchannel": "app"
					})
					if (rsp.retCode != "0000000") {
						uni.showToast({
							title: rsp.retDesc,
							icon: 'none'
						})
						return;
					}
					var setmitems = rsp.rspBody.setmitems;
					var fleetmemsize = JSON.parse(setmitems).fleetmemsize;
					var nowsurnum = fleetmemsize.nowsurnum; //车队剩余条数
					this.remainingNum = nowsurnum;
					console.log(nowsurnum);
					this.willJoinFleetArr = [].concat(selectArr);
					setTimeout(() => {
						if (nowsurnum < selectArr.length) {
							//剩余条数不足，提醒去充值
							this.$refs.noSourceNumPopup.open();
							return;
						}
						
						if (this.myFleetData.length > 0) {
							this.$refs.myFleetPopup.open();
						} else {
							this.$refs.fleetHintPopup.open();
						}
					}, 500)
				}

			},
			async getMealBaseList() { // 会员套餐列表
				let params = {
					"setmfree": "0",
					"setmrole": "cargo",
					"setmchannel": "app",
					setmdisp: 1,
				}
				// console.log('会员套餐参数', params);
				let that = this;
				var res = await ship.postRequest('/cp/set/meal/base/list', params)
				console.log('会员套餐结果', res);
				if(res.retCode == '0000000'){
					let rspBody = res.rspBody;
					that.mealBaseInfo = 0;
					let defvalAry = [];
					if(rspBody && rspBody.length > 0) {
						for(let i in rspBody) {
							let setmitemsJson = rspBody[i].setmitems.replace(/\//g, '');
							let obj = JSON.parse(setmitemsJson);
							// console.log('测试参数' + i, obj);
							defvalAry.push(Number(obj.fleetmemsize.defval));
						}
						console.log(that.mealBaseInfo);
						let newAry = that.toSorting(defvalAry);
						that.mealBaseInfo = newAry && newAry.length > 0 ? newAry[newAry.length - 1] : 0;
					}
				} else{
					uni.showToast({
						title: res.retDesc,
						icon: 'none'
					})
				}
				
				
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
			closeNoNumPopup() { // 关闭充值弹窗
				this.$refs.noSourceNumPopup.close();
			},
			jumpToUserMember() { // 跳转会员列表
				this.$refs.noSourceNumPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage?pageName=sourceIndex'
				})
			},
			getData(type) {
				var selectedMapTotal = this.selectedMapTotal;
				if (type == "refresh") {
					var selectArr = selectedMapTotal.splice(0, 10);
					if (selectArr.length < 1) {
						this.isNoData = true;
						this.isMore = "more"
						return;
					}
					this.isNoData = false;
					if (selectArr.length < 10) {
						this.isMore = "noMore"
					} else {
						this.isMore = "more"
					}
					this.selectedMapArr = selectArr;
				} else {
					var selectedMapArr = this.selectedMapArr;
					var selectArr = selectedMapTotal.splice(0, 10);
					if (selectArr.length < 10) {
						this.isMore = "noMore"
					} else {
						this.isMore = "more"
					}
					this.selectedMapArr = this.selectedMapArr.concat(selectArr);

				}
			},
			calculationCheckNum() {
				let that = this
				let num = 0
				that.selectedMapArr.forEach(item => {
					if (item.isCheck) {
						num += 1
					}
				})
				that.allCheckedNum = num
			},
			isAllChecked(item, index) {
				let that = this
				if (item.isCheck) {
					that.$set(that.selectedMapArr[index], 'isCheck', false)
				} else {
					that.$set(that.selectedMapArr[index], 'isCheck', true)
				}
				let allChecFlag = true
				that.selectedMapArr.some(el => {
					if (!el.isCheck) {
						allChecFlag = false
						return true
					}
				})
				if (allChecFlag) {
					that.allCheckedFlag = true
				} else {
					that.allCheckedFlag = false
				}
				that.calculationCheckNum()
			},
			checkAllItem() {
				let that = this
				that.allCheckedFlag = !that.allCheckedFlag
				that.selectedMapArr.forEach(item => {
					if (that.allCheckedFlag) {
						item.isCheck = true
					} else {
						item.isCheck = false
					}
				})
				that.calculationCheckNum()
			},
			toContact() {
				let that = this
				console.log(this.optionsParams)
				let optionsParams = this.optionsParams
				// uni.navigateTo({
				//   url: '/pages/goodsDelivery/fleetIndex/fleetmemberList?userCode=' + optionsParams.userCode + '&sender=' +
				//     optionsParams.senderName + '&senderCode=' + optionsParams.senderCode + "&provinceCode=" +
				//     optionsParams.provinceCode + '&provinceName=' + optionsParams.provinceName + '&fleetId=' + optionsParams
				//     .fleetId + '&type=' + optionsParams.source
				// })
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/fleetmemberList?userCode=' + optionsParams.userCode +
						'&sender=' +
						optionsParams.sender +
						'&senderCode=' + optionsParams.senderCode + "&provinceCode=" + optionsParams.provinceCode +
						'&provinceName=' + optionsParams.provinceName +
						'&fleetId=' + optionsParams.fleetId + '&type=' + optionsParams.type
				})

			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			makePhoneCall(item) {
				if (!ship.btnRepeat()) return;
				uni.showModal({
					title: '提示',
					content: '将获取电话权限以拨打电话',
					success: function(res) {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: item.displayMobile ? item.displayMobile : item.mobile //仅为示例
							});
							publicData.addBuried("超级车队拨打电话")
						}
					}
				})
	
			},
			toChatDetails(item) {
				var userInfo = uni.getStorageSync("userInfo");
				var currentUserCode = JSON.parse(userInfo).attrs.userCode;
				if (currentUserCode == item.userCode) {
					uni.showToast({
						title: '您不能给自己发私信',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中'
				})
				console.log('车队详情', this.info);
				let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
				let userData = uni.getStorageSync("userInfo");
				console.log('用户信息', JSON.parse(userData));
				if (Number(userRole) == 1) {
					userInfo = userData ? JSON.parse(userData) : {};
					let avatarObj = JSON.parse(userData);
					userInfo.attrs.avatar = avatarObj.attrs.avatar;
				} else {
					userInfo = userData ? JSON.parse(userData) : {};
				}
				let userName = item.userName ? item.userName.substr(0, 1) + '**' : '';
				if (this.goEasy.getConnectionStatus() == 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy, this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
					uni.hideLoading();
					let avatar = item.avatar ? item.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png';
					uni.navigateTo({
						url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar +
							'&nickname=' +
							userName + '&userId=' + item.userId
					})
				} else {
					uni.hideLoading();
					let avatar = item.avatar ? item.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png';
					uni.navigateTo({
						url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar +
							'&nickname=' +
							userName + '&userId=' + item.userId
					})
				}
			},
			toTrack(item) {
				var obj = this.getPickerArr();

				var dateTimeArray = obj.dateTimeArray;
				var endTimeArray = obj.dateTimeArray;
				var dateTime = obj.dateTime;
				var startTime = [dateTime[0], dateTime[1], dateTime[2], 0, 0];
				var endTime = [dateTime[0], dateTime[1], dateTime[2], 23, 59];
				//获取当前日期

				var dateTime = this.createTimeStr(dateTimeArray, startTime);
				var endTime = this.createTimeStr(endTimeArray, endTime);
				uni.navigateTo({
					url: './map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON
						.stringify(item) + '&isFee=1'
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
			createTimeStr(dateTimeArray, dateTime) {
				let timeStr = dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[1][dateTime[1]] + '-' + dateTimeArray[2][
					dateTime[2]
				] + ' ' + dateTimeArray[3][dateTime[3]] + ":" + dateTimeArray[4][dateTime[4]];
				console.log(timeStr)
				return timeStr
			},
			showName(item) {
				var that = this;
				var userName = item.userName;
				var userCode = item.userCode;
				if (userName) {
					if (item.isOwner && that.info.fleetAttributes == '平台') {
						return '货运中国'
					} else if (that.info.isAdmin || that.info.isOwner) {
						return userName
					} else {
						return userName.slice(0, 1) + '*'
					}
				} else {
					return "卡友号：" + userCode
				}
			},
			setModel(str) {
				if (str.indexOf(',') > -1) {
					str = str.split(",")[0];
				}
				return str
			},
			showAddr(item) {
				var address = item.address;
				if (!address) return '';
				var reg = /.+?(县|区)/g
				var addrArr = address.match(reg);
				var addr = "";
				if (addrArr) {
					addr = addrArr[0]
				} else {
					addr = address
				}

				return addr;

			},
			showDate(item) {
				var locationDate = item.locationUpdatedDt;
				if (!locationDate) return '';
				return utilDate.findBeidouDateDesc(locationDate)
			},
			getMyFleetInfo() { // 获取车队列表
				let that = this;
				that.myFleetData = [];
				ship.newQueryPostRequest('/cd/fleet/list', {
						pageNum: 1,
						pageSize: 999,
						isMyFleet: 1,
						isOwner: 1
					})
					.then(res => {
						
						
						if (res.retCode == '0000000') {
							let items = res.rspBody.items;
							if (items && items.length > 0) {
								for (let i in items) {
									items[i].checked = false;
									// that.myFleetData.push(items[i]);
								}
								that.myFleetData = items;

							} else {
								that.myFleetData = [];
							}
						}
					})
					.catch(err => {
						console.log(err);
					})
			},
			async toMyFleet() {
				var that = this;
				if (!ship.btnRepeat()) return;
				if (this.myFleetData.length > 0) {
					//判断是否选择
					if (this.allCheckedNum < 1) {
						uni.showToast({
							title: '请选择司机',
							icon: 'none'
						})
						return
					};
					var selectedMapArr = that.selectedMapArr;
					var willJoinFleetArr = [];
					selectedMapArr.forEach(item => {
						if (item.isCheck) {
							willJoinFleetArr.push(item)
						}
					})
					that.willJoinFleetArr = willJoinFleetArr;
					//判断车队人数是否到达上限
					var userId = this.userInfo.userId;
					var result = await this.getMemberInfo();
					console.log("会员套餐", result);
					
					await this.getMealBaseList(); //获取会员套餐配置
					this.isRoleMember = result ? true : false; //判断是否是会员
					
					var rsp = await ship.postRequest("/cp/member/queryByUser", {
						"usersid": userId,
						"setmchannel": "app"
					})
					if (rsp.retCode != "0000000") {
						uni.showToast({
							title: rsp.retDesc,
							icon: 'none'
						})
						return;
					}
					var setmitems = rsp.rspBody.setmitems;
					var fleetmemsize = JSON.parse(setmitems).fleetmemsize;
					var nowsurnum = fleetmemsize.nowsurnum; //车队剩余条数
					this.remainingNum = nowsurnum;
					console.log(nowsurnum);
					if (nowsurnum < willJoinFleetArr.length) {
						//剩余条数不足，提醒去充值
						this.$refs.noSourceNumPopup.open();
						return;
					}
					this.$refs.myFleetPopup.open();
				} else {
					that.$refs.fleetHintPopup.open();
				}
			},
			hasCheckedFleetChecked() {
				for (let i in this.myFleetData) {
					if (this.myFleetData[i].checked) {
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
			toAddUserInFleet() { // 邀请加入车队
				if (this.hasCheckedFleetChecked()) {
					this.checkedCarItem = [];
					for (let c in this.willJoinFleetArr) {
						this.checkedCarItem.push(this.willJoinFleetArr[c])
					}
					let checkedFleetItem = [];
					for (let f in this.myFleetData) {
						if (this.myFleetData[f].checked) {
							checkedFleetItem.push(this.myFleetData[f])
						}
					}
					console.log('选中的车源', this.checkedCarItem);
					console.log('选中的车队', checkedFleetItem);
					let paramsInfo = [];
					for (let a in this.checkedCarItem) {
						for (let b in checkedFleetItem) {
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

					console.log('邀请参数', paramsInfo);
					let that = this;
					uni.showLoading();
					ship.postRequest('/cd/fleetWithUser/invite', paramsInfo)
						.then(function(res) {
							uni.hideLoading();
							console.log('加入车队结果', res);
							if (res.retCode == '0000000') {
								that.$refs.myFleetPopup.close();
								setTimeout(() => {
									that.openRspMsgPopup('已经把司机加入您的车队请稍后在车队查看');
								}, 700)
							} else {
								uni.showToast({
									title: res.retDesc,
									icon: 'none'
								})
							}
						})
						.catch(err => {
							uni.hideLoading();
							console.log(err);
						})
				} else {
					uni.showToast({
						title: '请选择车队',
						icon: 'none'
					})
				}
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
				this.$refs.fleetHintPopup.close();
				uni.navigateTo({
					url: '/pages/my/fleet/fleetCreate/fleetCreate?type=create'
				})
			},
			openRspMsgPopup(msg) {
				this.rspMsg = msg;
				this.$refs.mainRspMsgPopup.open();
				setTimeout(()=>{
					this.$refs.mainRspMsgPopup.close();
				},3000)
			},
		}
	}
</script>

<style scoped lang="scss">
	.mapCarSourceList {
		min-height: 100vh;
		background-color: #FAFAFA;
		display: flex;
		flex-direction: column;
		width: 100vw;
		padding: 0 34rpx;
		box-sizing: border-box;
		overflow: hidden;
		padding-bottom: 220rpx;

		&.noScroll {
			overflow: hidden;
		}

		.myFleetBox {
			height: 590rpx;

			.popupTitle {
				padding-top: 30rpx;
			}
		}

		.fleetHintBox {
			height: 290rpx;
			justify-content: center;
			align-items: center;

			.popupTitle {
				padding-top: 50rpx;
			}
		}

		.myFleetBox,
		.fleetHintBox {
			width: 464rpx;
			background: #FFFFFF;
			border-radius: 24rpx;

			.popupCloseIcon {
				display: block;
				position: absolute;
				width: 40rpx;
				height: 40rpx;
				right: 18rpx;
				top: 12rpx;
			}

			.popupTitle {
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #000000;
				line-height: 44rpx;
			}

			.popupList {
				height: 348rpx;
				margin-top: 34rpx;

				.myFleetInfoBox+.myFleetInfoBox {
					margin-top: 20rpx;
				}

				.myFleetInfoBox {
					margin-left: 42rpx;
					margin-right: 42rpx;
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
						margin-right: 56rpx;
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

		.rspMsgBox {
			width: calc(100vw - 120rpx);
			padding: 0 50rpx;
			box-sizing: border-box;
			height: 222rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 20rpx 2rpx rgba(56, 136, 255, 0.18);
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
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
			.msgBtn {
				width: 344rpx;
				height: 72rpx;
				border-radius: 12rpx;
				background-color: rgba(43, 114, 240, 1);
				display: flex;
				justify-content: center;
				align-items: center;
			}
			
			.msgBtn-text {
				color: #FFFFFF;
				font-weight: 500;
				font-size: 32rpx;
			}
		}

		.header-box {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			z-index: 9999;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #FFFFFF;

			.header {
				width: 100vw;
				height: 88rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				color: rgba(51, 51, 51, 1);

				.car_source_left_arrow {
					position: absolute;
					left: 38rpx;
					top: 30rpx;
					width: 16rpx;
					height: 30rpx;
				}
			}
		}

		.list {
			padding-bottom: 20rpx;
			box-sizing: border-box;
			// display: block;
			// display: flex;
			// flex-direction: column;
			// justify-content: center;
			// align-items: center;

			.list-item {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				background-color: #FFFFFF;
				width: calc(100vw - 68rpx);
				margin-bottom: 20rpx;
				box-shadow: 0 0 18rpx 2rpx rgba(106, 106, 106, 0.09);
				border-radius: 12rpx;

				.avatar-content {
					width: 148rpx;
					padding-top: 30rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					align-items: center;

					.avatar {
						width: 80rpx;
						height: 80rpx;
						position: relative;

						.avatar-icon {
							width: 80rpx;
							height: 80rpx;
							border-radius: 80rpx;
							background-color: #CCCCCC;
						}

						.dot {
							width: 60rpx;
							height: 20rpx;
							border-radius: 70rpx;
							background-image: linear-gradient(to bottom, #51A2FE, #1081F9);
							position: absolute;
							left: 10rpx;
							bottom: 0;
							z-index: 1;
							font-size: 16rpx;
							color: #FFFFFF;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}

					.avatar-title {
						display: flex;
						flex-direction: row;
						color: #4ACD1B;
						font-size: 28rpx;
						margin-top: 10rpx;
						justify-content: center;
						align-items: center;

						&.active {
							color: #E2633B;
						}

						.dot {
							width: 14rpx;
							height: 14rpx;
							background-color: #4ACD1B;
							border-radius: 14rpx;
							margin-right: 6rpx;

							&.active {
								background-color: #E2633B;
							}
						}
					}

				}
			}

			.car_source_item {
				display: flex;
				border-radius: 12rpx;
				width: 100%;
				box-sizing: border-box;
				margin-top: 24rpx;
				padding-right: 32rpx;
				background-color: #FFFFFF;
				box-shadow: 0 0 18rpx 2rpx rgba(106, 106, 106, 0.09);

				.head {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 148rpx;
					.avatar-icon {
						margin-top: 12rpx;
						width: 130rpx;
						height: 102rpx;
						justify-content: center;
						align-items: center;
						position: relative;
					}

					.avatar-icon-other {
						margin-top: 30rpx;
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

					.avatar-content-abs {
						position: absolute;
						top: 0;
						right: 0;
						z-index: 2;
						width: 130rpx;
						height: 102rpx;
						border-radius: 100%;
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

					.order_receive_status {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin-top: 10rpx;

						view {
							width: 14rpx;
							height: 14rpx;
							background: #4ACD1B;
							border-radius: 14rpx;
						}

						text {
							margin-left: 6rpx;
							font-size: 28rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							color: #4ACD1B;
						}
					}

					.order_receive_status_2 {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin-top: 10rpx;

						view {
							width: 14rpx;
							height: 14rpx;
							background: #E2633B;
						}

						text {
							margin-left: 6rpx;
							font-size: 28rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							color: #E2633B;
						}
					}

				}

				.right_content {
					box-sizing: border-box;
					flex: 1;
					padding-top: 16rpx;
					box-sizing: border-box;

					.dot {
						margin-top: 20rpx;
						height: 1rpx;
						background-color: rgba(224, 224, 224, 1);
					}

					.row {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						height: 84rpx;

						.opt-item {
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							font-size: 28rpx;
							color: rgba(0, 0, 0, 1);
							.point-icon {
								width: 48rpx;
								height: 48rpx;
								margin-right: 10rpx;
							}
						}

					}

					.name_model {
						display: flex;
						align-items: center;
						justify-content: flex-start;

						.user_name {
							font-size: 32rpx;
							font-family: PingFang SC-Semibold, PingFang SC;
							font-weight: 600;
							color: #333333;
							line-height: 38rpx;
						}

						.user_model {
							margin-left: 12rpx;
							font-size: 32rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							color: #333333;
							line-height: 38rpx;
						}

						image {
							margin-left: auto;
							width: 41rpx;
							height: 41rpx;
						}

						.citys {
							font-size: 32rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 500;
							color: #3489E9;
							line-height: 38rpx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							width: calc(100vw - 350rpx);
						}

						.details {
							margin-left: auto;
							font-size: 28rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 500;
							color: rgba(52, 137, 233, 1);
							display: flex;
							align-items: center;

							image {
								margin-left: 10rpx;
								width: 10rpx;
								height: 20rpx;
								// transform: rotate(180deg);
							}
						}

						.beidou_icon {
							margin-left: 0;
							width: 34rpx;
							height: 34rpx
						}



						.address_icon_content {
							height: 44rpx;
							line-height: 44rpx;
							display: flex;
							justify-content: center;
							align-items: center;
						}

						.address {
							font-size: 32rpx;
							font-weight: 400;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							padding-left: 8rpx;
							width: calc(100vw - 420rpx);
							line-height: 38rpx;
						}

						.times {
							margin-left: auto;
							font-size: 24rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							color: #666666;
						}

						.btn-content {
							display: flex;
							flex-direction: row;
							.btn-item {
								width: 98rpx;
								height: 42rpx;
								color: rgba(82, 131, 255, 1);
								border: 2rpx solid rgba(82, 131, 255, 1);
								border-radius: 8rpx;
								font-size: 24rpx;
								margin-right: 20rpx;
								box-sizing: border-box;
								font-weight: 500;
								display: flex;
								justify-content: center;
								align-items: center;

								&:last-child {
									margin-right: 0;
								}
							}
						}

						.is_see {
							margin-top: 5rpx;
							margin-left: auto;
							font-size: 24rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							color: #E8520D;
						}
					}
				}
			}
		}

		.footBtnGroup {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			height: 200rpx;
			box-sizing: border-box;
			background-color: #FFF;
			box-shadow: 0px -4rpx 16rpx 2rpx rgba(172, 172, 172, 0.41);
			z-index: 9;

			.checkedBox {
				padding-top: 18rpx;
				padding-left: 32rpx;
				box-sizing: border-box;
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

			.bounce_image {
				width: 50rpx;
				height: 50rpx;
				position: absolute;
				right: 20rpx;
				top: 80rpx;
				animation: bounce-up 1s linear infinite;
			}

			.btn_list {
				margin-top: 16rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100vw;
				box-sizing: border-box;
				padding: 0 52rpx;

				.opt-item {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 36rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					border-radius: 90rpx;
					height: 76rpx;
				}

				.see_line {
					width: 160rpx;
					background: #3888FF;
				}

				.add_fleet {
					background-color: rgba(178, 90, 246, 1);
					width: 260rpx;
					position: relative;
				}

				.opt-showPoints {
					position: absolute;
					right: -30rpx;
					bottom: 0;
					width: 43rpx;
					height: 76rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					animation: moving 1s linear infinite;
				}

				@keyframes moving {
					0% {
						right: -30rpx;
						animation-timing-function: cubic-bezier(1.55, 0.27, 0.42, 0.68);
						// animation-timing-function: cubic-bezier(0.68, 0.42, 0.27, 1.55);
					}

					50% {
						right: -52rpx;
					}

					100% {
						right: -30rpx;
					}
				}

				.opt-showPoints-icon {
					width: 50rpx;
					height: 50rpx;
				}

				.contact {
					width: 160rpx;
					background: linear-gradient(90deg, #EA8E43 0%, #EA6A3A 100%);
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
			.car-source-nvue-bf-2 {
				height: 92rpx;
				width: 578rpx;
			}
			.car-source-nvue-bf-1 {
				height: 80rpx;
				width: 578rpx;
			}
			.car-source-nvue-btn-1 {
				width: 128rpx;
				height: 48rpx;
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
				
				.memberTouUpBtn {
					height: 128rpx;
					padding: 0 18rpx 0 12rpx;
					margin: 50rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #31313F 0%, #1F1F28 100%);
					position: relative;
					.memberTouUpBtn-content {
						position: absolute;
						left: 0;
						top: 0;
						height: 128rpx;
						width: 578rpx;
						padding: 0 18rpx;
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						box-sizing: border-box;
					}
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #F0AB88;
						line-height: 44rpx;
						flex: 1;
						flex-wrap: wrap;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
					}
					.msg-btn-text {
						text-align: center;
					}
					.toBuyBtn {
						width: 128rpx;
						height: 48rpx;
						border-radius: 228rpx;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						background: linear-gradient(90deg, #F1D7C8 0%, #F0A27C 100%);
						position: relative;
						.toBuyBtn-content {
							position: absolute;
							left: 0;
							top: 0;
							width: 128rpx;
							height: 48rpx;
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
						}
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

	@keyframes bounce-up {
		25% {
			transform: translateX(20rpx);
		}

		50%,
		100% {
			transform: translateX(0);
		}

		75% {
			transform: translateX(-20rpx);
		}
	}
</style>
