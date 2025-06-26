<template>
	<view class="mapCarSourceList" :class="{noScroll: isCollapse == -1}">

		<view class="header-box">
			<view class="statusBar" :style="{height: statusBarHeight + 'rpx'}" />
			<view class="header">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_left_arrow.png"
					class="car_source_left_arrow" @click="back"></image>
				<text>{{info ? info.name : '成员列表' }}</text>
			</view>
		</view>
		<view class="headerSendebox" :style="{height: (statusBarHeight + 88) + 'rpx'}" />

		<view class="selected-content">
			<view class="selected-title" :style="{top: (statusBarHeight + 86) + 'rpx'}" :class="{isVerse: type == 'carSource'}">
				<view class="selected-item" v-for="(item, index) in chooseArr" :style="{order: item.order}" @click="showPop(index)">
					<view class="selected-title-text"
						:class="{active: item.active}">{{item.value ? item.value : item.name}}</view>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/icon_down.png" class="icon_down"
						v-if="!item.active"></image>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/icon_down_active.png"
						class="icon_down" :class="{'icon_toggle' : item.isClick}"  v-else>
					</image>
				</view>
			</view>
			<view style="height: 88rpx;" />
			<view class="selected-pop" :style="{top: (statusBarHeight + 174) + 'rpx'}"
				:class="{active: isCollapse > -1}" @touchmove.prevent @click.stop="closePop">
				<view class="pop-content">
					<view class="pop-title">
						<view class="pop-title-item">省份</view>
						<view class="pop-title-item">城市</view>
					</view>
					<view class="pop-inner">
						<scroll-view class="province-item" :scroll-y="true">
							<view class="item-pop pl-34"  @click.stop="searchAllPro()">
								<text v-if="isCollapse === 0" :class="{proActive: locationParams.isAllPro}">全国</text>
								<text v-if="isCollapse === 1" :class="{proActive: senderParams.isAllPro}">全国</text>
								<text v-if="isCollapse === 2" :class="{proActive: receiverParams.isAllPro}">全国</text>
							</view>
							<view v-for="(item, index) in provinceArr" class="item-pop pl-34"
								@click.stop="switchProIndex(index)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
									class="check" v-if="index == selectedProvinceIndex"></image>
								<text :class="{proActive: index == selectedProvinceIndex}">{{item.name}}</text>
							</view>
						</scroll-view>

						<scroll-view class="province-item" :scroll-y="true">
							<view v-for="(item, index) in cityArr" class="item-pop"
								@click.stop="switchCityIndex(index)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
									class="check" v-if="index == selectedCityIndex"></image>
								<text :class="{proActive: index == selectedCityIndex}">{{item.name}}</text>
							</view>
						</scroll-view>
					</view>
					<view class="pop-btn">
						<view class="pop-btn-item reset" @click.stop="reset">重置</view>
						<view class="pop-btn-item look" @click.stop="look">查看</view>
					</view>
				</view>
				<!-- <view class="pop-content" v-show="isCollapse == 1" @click.stop="hidePop()">
					<view class="status-item" :class="{active: index == selectedStatusIndex}"
						v-for="(item, index) in statusArr" @click.stop="switchStatus(index)">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
							class="check" v-if="index == selectedStatusIndex"></image>
						{{item}}
					</view>
				</view> -->

			</view>
		</view>
		<view class="list">
			<view class="noData01" v-if="carSourceList.length == 0 && isNoData != 'loading'">
				<noData></noData>
			</view>
			<template v-for="(item,index) in carSourceList">
				<view class="car_source_item" v-if="item.serviceType == 10">
					<view class="listMsgBox">
						<view class="head">
							<view class="avatar-icon">
								<image class="avatar" :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
								<!-- <image class="vipIcon" src="/static/images/newFleetDetails/redVip.png" v-if="item.dataSrc == 1"></image>
								<image class="vipIcon" src="/static/images/newFleetDetails/blueVip.png" v-if="item.dataSrc == 4"></image> -->
								<image class="vipIcon" src="/static/images/newFleetDetails/redVip.png" v-if="item.isBindDevice == 1"></image>
								<image class="vipIcon" src="/static/images/newFleetDetails/blueVip.png" v-if="item.isBindDevice != 1 && item.isBindZj == 1"></image>
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
								<!-- <image v-if="item.isCheck" @click="isAllChecked(item,index)"
									src="../../../static/images/isPhone.png" />
								<image v-else @click="isAllChecked(item,index)"
									src="../../../static/images/isPnone_block.png" /> -->
							</view>
							<view class="name_model" style="margin-top: 16rpx"  v-if="isShowDetailBtn || item.circuitCombo">
								<view class="citys" v-if="item.circuitCombo"><text class="citys-label">常跑：</text>{{item.circuitCombo}}</view>
								<view class="details" @click="jumpToDriverDetails(item.userId, (info.isOwner || info.isAdmin) ? 1 : 0, (info.isOwner || info.isAdmin) ? 1 : 0)" v-if="isShowDetailBtn">
									<view>详情</view>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_right_blue_icon.png" />
								</view>
							</view>
							<view class="name_model" style="margin-top: 16rpx" v-if="item.address">
								<view class="address-icon-content">
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_beidou.png" class="beidou_icon" v-if="item.dataSrc == 4"></image>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_wx.png" class="beidou_icon" v-else-if="item.dataSrc == 3"></image>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_box.png" class="beidou_icon" v-else-if="item.dataSrc == 1"></image>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_app.png" class="beidou_icon" v-else></image>
								</view>
								<view class="address">{{showAddr(item)}}</view>
								<view class="times">{{showDate(item)}}</view>
							</view>
							<view class="name_model" style="margin-top: 16rpx"
								v-if="item.tagShowArr.length || item.isContact">
								<view class="btn-content">
									<view class="btn-item" v-for="atem in item.tagShowArr">
										<text>{{atem.tagName}}</text>
									</view>
								</view>
								<view class="is_see" v-if="item.isContact">您今天查看过</view>
							</view>
							<!-- <view class="right-opt-content" v-if="isAlertJoin != 5 && isAlertJoin != 1 && isAlertJoin != 2  && isAlertJoin != 8">
								<view class="line" />
								<view class="opt-content" v-if="isAlertJoin == 3">
									<view class="opt-item"/>
									<view class="opt-item"/>
									<view class="opt-item" @click="toTrackSimple(item)">
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png" class="point-icon"></image>
										<text>轨迹</text>
									</view>
								</view>
								<view class="opt-content" v-if="isAlertJoin == 4">
									<view class="opt-item"/>
									<view class="opt-item" @click="toTrackSimple(item)">
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png" class="point-icon"></image>
										<text>轨迹</text>
									</view>
									<view class="opt-item" @click="toChatDetails(item)">
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png" class="point-icon"></image>
										<text>私信</text>
									</view>
								</view>
								<view class="opt-content" v-if="isAlertJoin == 6">
									<view class="opt-item"/>
									<view class="opt-item"/>
									
									<view class="opt-item" @click="toChatDetails(item)">
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png" class="point-icon"></image>
										<text>私信</text>
									</view>
								</view>
								<view class="opt-content" v-if="isAlertJoin == 7">
									<view class="opt-item"  @click="toTrackSimple(item)">
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-location.png" class="point-icon"></image>
										<text>轨迹</text>
									</view>
									<view class="opt-item" @click="makePhoneCall(item)">
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-call.png" class="point-icon"></image>
										<text>电话</text>
									</view>
									<view class="opt-item" @click="toChatDetails(item)">
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png" class="point-icon"></image>
										<text>私信</text>
									</view>
								</view>
							</view> -->
						</view>
					</view>
					<view class="listBtnBox" v-if="trajectoryPermissions || collectionPermissions || callDriverPermissions">
						<view class="groupLine"></view>
						<view class="userListBtnGroup">
							<view class="btnBox" v-if="trajectoryPermissions" @click="toTrackSimple(item)">
								<image class="icon" src="/static/images/newFleetDetails/trajectory.png"></image>
								<view class="msg">轨迹</view>
							</view>
							<view class="btnBox" v-if="collectionPermissions && !item.isCollect" @click="checkCollectNum(item, index)">
								<image class="icon" src="/static/images/newFleetDetails/collection.png"></image>
								<view class="msg collectionMsg">收藏TA</view>
							</view>
							<view class="btnBox" v-if="collectionPermissions && item.isCollect == 1">
								<image class="icon" src="/static/images/newFleetDetails/collectioned.png"></image>
								<view class="msg collectionMsg">已收藏</view>
							</view>
							<view class="btnBox" v-if="callDriverPermissions" @click="toCallUser(item, index)">
								<image class="icon" src="/static/images/newFleetDetails/mobile.png"></image>
								<view class="msg">联系TA</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="car_source_item car-ship">
					<view class="listMsgBox">
						<view class="head">
							<view class="avatar-icon-other">
								<image :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png' " class="avatar-other"></image>
							</view>
						</view>
						<view class="right_content">
							<view class="name_model">
								<view class="user_name">{{showName(item)}}</view>
								<view class="user_type">{{item.isAdmin ? '(管理员-货主)' : '(货主)'}}</view>
							</view>
							
							<view class="name_model" style="margin-top: 16rpx" v-if="item.address">
								<view class="address-icon-content">
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_beidou.png" class="beidou_icon" v-if="item.dataSrc == 4"></image>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_wx.png" class="beidou_icon" v-else-if="item.dataSrc == 3"></image>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_box.png" class="beidou_icon" v-else-if="item.dataSrc == 1"></image>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/datasrc_app.png" class="beidou_icon" v-else></image>
								</view>
								<view class="address">{{showAddr(item)}}</view>
								<view class="times">{{showDate(item)}}</view>
							</view>
						</view>
					</view>
				</view>
			</template>

			<uni-morebox :isMore="isMore" :containerStyle="{'margin-top': '24rpx'}"></uni-morebox>
		</view>
		<!-- <view class="footBtnGroup" v-if="isAlertJoin == 1 || isAlertJoin == 2 || isAlertJoin == 8">
			<view class="checkedBox">
				<image class="checkIcon" @click="checkAllItem"
					:src="allCheckedFlag ? '/static/images/vehicleOptions/checked.png' : '/static/images/vehicleOptions/checkDefault.png'">
				</image>
				<view class="checkedMsg" :style="allCheckedFlag ? 'color:#3888FF;' : 'color:#333;'">全选</view>
				<view class="checkedNumMsg">已选中{{allCheckedNum}}条</view>
			</view>
			<view class="opt-content" v-if="isAlertJoin == 6">
				<view class="opt-item opt-item-1" @click="toTrack">
					<text class="opt-item-text">查轨迹</text>
				</view>
				<view class="opt-item opt-item-5" style="margin-left: 50px;" @click="toTrack">
					<text class="opt-item-text">私信</text>
				</view>
			</view>
			<view class="opt-content opt-between" v-if="isAlertJoin == 1 || isAlertJoin == 2 || isAlertJoin == 8">
				<view class="opt-item opt-item-1" @click="toTrack">
					<text class="opt-item-text">查轨迹</text>
				</view>
				<view class="opt-item opt-item-4" @click="toMyFleet">
					<text class="opt-item-text">加入我的车队</text>
					
					<view class="opt-showPoints">
						<image src="/static/images/newIndex/recommendedicon.png" class="opt-showPoints-icon"></image>
					</view>
				</view>
				<view class="opt-item opt-item-5" @click="toContact">
					<text class="opt-item-text">联系车辆</text>
				</view>
			</view>
		</view> -->
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
				<view class="popupTitle popupTitle1"><text class="popupTitle-text">提示</text></view>
				<view class="hintMsg"><text class="hintMsg-text">您还没有创建车队</text></view>
				<view class="popupBtn" @click="jumpToCreatFleet()"><text class="popupBtn-text">去新建车队</text></view>
			</view>
		</uni-popup>
		<uni-popup ref="mainRspMsgPopup" type="center">
			<view class="rspMsgBox">
				<view class="msgText"><text class="msgText-text">{{rspMsg}}</text></view>
			</view>
		</uni-popup>
		<uni-popup ref="toViewPopup" type="center">
			<view class="rspMsgBox">
				<view class="msgText"><text class="msgText-tips-text">您勾选了{{showCheckedNum}}条，给您跳转至联系方式</text></view>
			</view>
		</uni-popup>
		<uni-popup ref="noSourceNumPopupFleet" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle"><text class="mainTitle-noSource-text">提示</text></view>
					<view class="mainContent"><text class="mainContent-noSource-text">您车队人数已经达到上限啦～，快点击下面了解详情吧</text></view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">	
						<view class="msgFleet">
							<text class="msg-btn-text"  v-if="isRoleMember">升级会员，享{{fleetBaseInfo ? fleetBaseInfo : 0}}位司机加入您的车队</text>
							<text class="msg-btn-text"  v-else>开通会员，享{{fleetBaseInfo ? fleetBaseInfo : 0}}位司机加入您的车队</text>
						</view>
						<view class="toBuyBtn">
							<view class="btnText"><text class="btnText-text">去购买</text></view>
							<image class="membersRightIcon" src="/static/images/vehicleOptions/membersRight.png"></image>
						</view>
					</view>
					
				</view>
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
	</view>
</template>
<script>
	import * as ship from "@/utils/ship";
	import * as utilDate from "@/utils/utils.js"
	import UniMorebox from "@/components/uni-morebox.vue";
	import noData from "@/components/noData.vue";
	import * as publicData from "@/utils/publicData.js";
	const { dateTimePicker} = require('@/utils/date.js');
	export default {
		components: {
			UniMorebox,
			noData
		},
		data() {
			return {
				isRoleMember: false,
				allCheckedFlag: false,
				allCheckedNum: 0,
				showOpt: 0,
				chooseArr: [{
					name: '定位：',
					value: '',
					active: false,
					order: 3,
				}, {
					name: '常跑始发',
					value: '',
					active: false,
					order: 5,
				}, {
					name: '常跑目的',
					value: '',
					active: false,
					order: 6,
				}],
				provinceArr: [],
				cityArr: [],
				statusArr: ["可接单", "忙碌"],
				carSourceList: [],
				isCollapse: -1,
				selectedProvinceIndex: -1,
				selectedCityIndex: -1,
				selectedStatusIndex: -1,
				locationParams: {
					selectedProvinceIndex: -1,
					selectedCityIndex: -1,
				},
				senderParams: {
					selectedProvinceIndex: -1,
					selectedCityIndex: -1,
					sender: '',
					senderCode: '',
					source: 2,
					fleetId: '',
				},
				receiverParams: {
					selectedProvinceIndex: -1,
					selectedCityIndex: -1,
					receiver: '',
					receiverCode: '',
				},

				params: {
					status: 1,
					fleetId: '',
					"pageSize": 10,
					"pageNum": 1,
					source: '',
					count: false
				},
				defaultParams: {
					status: 1,
					sender: '',
					senderCode: '',
					selectedCityIndex: -1,
					selectedProvinceIndex: -1,
					fleetId: '',
				},
				isNoData: 'loading',
				isMore: 'more',
				refreshing: false,
				info: null,
				source: '',
				statusBarHeight: '',
				isAlertJoin: 0,
				myFleetData: [],
				rspMsg: '',
				willJoinFleetArr: [], //将要加入车队的司机
				userInfo: null,
				isShowDetailBtn: true,
				couponAccountObj: {},
				remainingNum: 0,
				mealBaseInfo: 0,
				firstTouUp: 0,
				showCheckedNum: 0,
				fleetmemsize: '',
				trajectoryPermissions: false,
				collectionPermissions: false,
				callDriverPermissions: false,
			}
		},
		async onLoad(options) {
			//加载默认的起始地
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight * 2
			var fleetDetail = options.fleetDetail;
			console.log("携带的参数", options);
			fleetDetail = JSON.parse(fleetDetail);
			this.senderParams.fleetId = fleetDetail.id;
			var userRole = uni.getStorageSync("userRole");
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : null;
			//判断用户身份
			
			//判断车队是否是平台车队
			if (fleetDetail.fleetAttributes == "车型" || fleetDetail.fleetAttributes == "线路" || fleetDetail.fleetAttributes == "行业") {
				fleetDetail.ext3 = "SUPER_FLEET";
			}
			this.info = fleetDetail;
			
			if(this.info.ext3 == "SUPER_FLEET") { // 超级车队
				if(userRole == 2) {
					this.trajectoryPermissions = true;
					this.collectionPermissions = true;
					this.callDriverPermissions = true;
				}
				if(this.info.isAdmin || this.info.isOwner) {
					this.trajectoryPermissions = true;
					this.collectionPermissions = true;
					this.callDriverPermissions = true;
				}
			}else { // 一般车队
				if(this.info.isAdmin || this.info.isOwner) {
					this.trajectoryPermissions = true;
					this.callDriverPermissions = true;
				}else if(userRole == 2) {
					this.trajectoryPermissions = true;
				}
			}
			
			if (!fleetDetail.isMember && userRole == 2 && fleetDetail.ext3 == "SUPER_FLEET") {
				this.isAlertJoin = 1; //游客-货主购买了套餐访问超级车队
			}
			if (fleetDetail.isMember && userRole == 2 && fleetDetail.ext3 == "SUPER_FLEET") {
				this.isAlertJoin = 2; //成员-货主购买了套餐访问超级车队
			}
			if (!fleetDetail.isMember && userRole == 2 && fleetDetail.ext3 != "SUPER_FLEET") {
				this.isAlertJoin = 3; //游客-货主看别人的普通车队
			}
			if (fleetDetail.isMember && userRole == 2 && fleetDetail.ext3 != "SUPER_FLEET") {
				this.isAlertJoin = 4; //成员-货主看别人的普通车队
			}
			if (!fleetDetail.isMember && userRole == 1) {
				this.isAlertJoin = 5; //游客-司机看车队
			}
			if (fleetDetail.isMember && !fleetDetail.isOwner && userRole == 1) {
				this.isAlertJoin = 6; //成员-司机看别人的车队
			}
			if ((fleetDetail.isOwner || fleetDetail.isAdmin) && fleetDetail.ext3 != "SUPER_FLEET") {
				this.isAlertJoin = 7; //货主/司机(车长或管理者)看自建的普通车队
				if (userRole == 1) {
					this.isShowDetailBtn = false
				}
			}
			if ((fleetDetail.isOwner || fleetDetail.isAdmin) && fleetDetail.ext3 == "SUPER_FLEET") {
				this.isAlertJoin = 8; //车队长/管理员看超级车队
			}
			if ((!fleetDetail.isOwner && !fleetDetail.isAdmin) && userRole == 1) {
				this.isShowDetailBtn = false ;//游客，成员司机看车队不能查看详情
			}
			console.log("as1", options);
			var type = options.type;
			this.type = type;
			var sender = options.sender;

			console.log(type, 'aaa');
			if (type == "carSource") {
				//来自车源线路地图
				var provinceName = options.provinceName;
				if (provinceName == "上海市" || provinceName == "重庆市" || provinceName == "天津市" || provinceName == "北京市") {

					this.defaultParams = {
						provinceName: options.provinceName,
						senderCode: options.senderCode,
						sender: options.sender,
						fleetId: fleetDetail.id,
					}
					this.senderParams.sender = options.sender;
					this.senderParams.senderCode = options.senderCode;
				} else {
					this.defaultParams = {
						provinceName: options.provinceName,
						senderCode: options.senderCode,
						sender: options.sender,
						fleetId: fleetDetail.id,

					}
					this.senderParams.sender = options.sender;
					this.senderParams.senderCode = options.senderCode;
				}
				this.params.fleetId = fleetDetail.id;
				var chooseArr = this.chooseArr;
				chooseArr[1].order = 10;
				chooseArr[2].order = 9;
				chooseArr[1].value = "常跑始发：" + options.sender;
				chooseArr[1].active = true;
				this.chooseArr = chooseArr;
				await this.getProvince();
				uni.showLoading();
				await this.getData('refresh');
			} else {
				//来自定位地图
				var provinceName = options.provinceName;
				if (provinceName == "上海市" || provinceName == "重庆市" || provinceName == "天津市" || provinceName == "北京市") {

					this.defaultParams = {
						provinceName: options.provinceName,
						cityName: options.provinceName,
						senderCode: options.senderCode,
						fleetId: fleetDetail.id,
						source: 1,
					}
					this.locationParams.cityName = options.provinceName;
					this.locationParams.provinceName = options.provinceName;
				} else {
					this.defaultParams = {
						provinceName: options.provinceName,
						cityName: options.sender,
						senderCode: options.senderCode,
						fleetId: fleetDetail.id,
						source: 2,
					}
					if (options.sender != options.provinceName) {
						this.locationParams.cityName = options.sender;
					}
					this.locationParams.provinceName = options.provinceName;
				}
				this.params.fleetId = fleetDetail.id;
				this.params.source = 1;
				var chooseArr = this.chooseArr;
				chooseArr[0].value = "定位：" + options.sender;
				chooseArr[0].active = true;
				this.chooseArr = chooseArr;
				await this.getProvince();
				uni.showLoading();
				await this.getData('refresh');
			}
			
			uni.$on("signleTopupDone", (data) => {
				this.openRspMsgPopup('充值成功～', 1);
			});
			this.getMealBaseList();
		},
		onShow() {
			this.getMyFleetInfo();
		},
		onPullDownRefresh() {
			if (this.isNoData == "loading") return;
			this.isNoData = 'loading';
			this.getData('refresh');
		},
		onReachBottom() {
			if (this.isMore == "loading" || this.isMore == "noMore") return;
			this.isMore = "loading";
			this.getData("more");
		},
		methods: {
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
			toMyFleet() {
				var that = this;
				if (!ship.btnRepeat()) return;
				var carSourceList = that.carSourceList;
				var info = this.info;
				//判断是否选择
				if (that.allCheckedNum < 1) {
					uni.showToast({
						title: '请选择司机查看',
						icon: 'none'
					})
					return;
				}
				var willJoinFleetArr = [];
				carSourceList.forEach(item => {
					if (item.isCheck) {
						willJoinFleetArr.push(item)
					}
				})
				
				that.willJoinFleetArr = willJoinFleetArr;
				
				var userRole = uni.getStorageSync("userRole");
				console.log("查看我的车队",info, userRole, willJoinFleetArr)
				if (!info.isAdmin && !info.isOwner && userRole == 2 && info.ext3 == "SUPER_FLEET") {
					uni.showLoading();
					this.determineView(1)
				} else {
					//判断车队是否到达上限
					this.getFleetUplimit(willJoinFleetArr);
				}
				
			},
			async getFleetMemberInfo() {
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
			getFleetMealBaseList() {
				//车队套餐请求
				let params = {
					"setmfree": "0",
					"setmrole": "cargo",
					"setmchannel": "app",
					setmdisp: 1,
				}
				// console.log('会员套餐参数', params);
				let that = this;
				ship.postRequest('/cp/set/meal/base/list', params)
				.then(function (res) {
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
							that.$forceUpdate();
							uni.hideLoading();
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
			async getFleetUplimit(newCheckedItem) {
				try{
					var userId = this.userInfo.userId;
					var result = await this.getFleetMemberInfo();
					console.log("会员套餐", result);
					
					await this.getFleetMealBaseList(); //获取会员套餐配置
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
					setTimeout(() => {
						if (nowsurnum < newCheckedItem.length) {
							//剩余条数不足，提醒去充值
							this.$refs.noSourceNumPopupFleet.open();
							return;
						}
						if (this.myFleetData.length > 0) {
							this.$refs.myFleetPopup.open();
						} else {
							this.$refs.fleetHintPopup.open();
						}
					}, 500)
				}catch(e){
					//TODO handle the exception
				}
			},
			async determineView(addFleetFlag) {// 确定查看
				let that = this;
				let dataParams = [];
				let fleetDetail = this.info;
				for(let i in this.willJoinFleetArr) {
					dataParams.push({
						fleetId: fleetDetail.id,
						userId: this.willJoinFleetArr[i].userId,
						contactUserId: that.userInfo.userId,
					})
					
				}
				this.showCheckedNum = this.willJoinFleetArr.length;
				console.log('消费参数', dataParams, this.willJoinFleetArr);
				var res = await ship.postRequest('/cd/contact/log/addBatch', dataParams)
				console.log('消费结果', res);
				if(res.retCode == '0000000'){
					if(res.rspBody > 0) {
						that.totView(addFleetFlag);
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
			},
			totView(addFleetFlag) { // 展示选中几条后跳转车源详情
				uni.hideLoading();
				var fleetDetail = this.info;
				var willJoinFleetArr = this.willJoinFleetArr;
				this.$refs.toViewPopup.open();
				setTimeout(()=>{
					this.$refs.toViewPopup.close();
					var carSourceList = this.carSourceList;
					carSourceList.forEach(item => {
						if (item.isCheck) {
							if (this.isAlertJoin != 8) {
								item.isContact = 1;
							}
							item.isCheck = false;
						}
					})
					this.carSourceList = carSourceList;
					this.allCheckedFlag = false;
					this.allCheckedNum = 0;
					uni.navigateTo({
						url: './fleetContactList?selectedMapArr=' + JSON.stringify(willJoinFleetArr) + "&fleetDetail=" +  JSON.stringify(fleetDetail) + '&isFee=1&addFleetFlag=' + addFleetFlag
					})
				},1500)
			},
			getRemainingPoint() { // 消费次数失败则获取消费次数并打开弹窗
				let params = {
					"usersid": this.userInfo.userId,
					"setmchannel": "app"
				}
				console.log('剩余条数费参数', params);
				let that = this;
				ship.postRequest('/cp/member/queryByUser', params)
				.then(function (res) {
					uni.hideLoading();
					console.log('剩余条数结果', res);
					if(res.retCode == '0000000'){
						let noteStr = res.rspBody.setmitems;
						noteStr = noteStr.replace(/\//g, '');
						noteStr = JSON.parse(noteStr);
						console.log('JSON剩余条数结果', noteStr);
						that.remainingNum = Number(noteStr.carsourcenum.nowsurnum);
						that.firstTouUp = Number(noteStr.carsourcenum.firstRecharge);
						that.getCouponAccountType(); // 单次充值配置
					} else{
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
					var len = this.checkedCarItem.length;
					let that = this;
					uni.showLoading();
					ship.postRequest('/cd/fleetWithUser/invite', paramsInfo)
						.then(function(res) {
							uni.hideLoading();
							console.log('加入车队结果', res);
							if (res.retCode == '0000000') {
								that.$refs.myFleetPopup.close();
								setTimeout(() => {
									that.openRspMsgPopup('成功把' + len + '名司机加入您的车队，请稍后在车队查看');
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
			calculationCheckNum() {
				let that = this
				let num = 0
				that.carSourceList.forEach(item => {
					if (item.serviceType == 10) {
						if (item.isCheck) {
							num += 1
						}
					}
				})
				that.allCheckedNum = num
			},
			isAllChecked(item, index) {
				let that = this
				if (item.isCheck) {
					that.$set(that.carSourceList[index], 'isCheck', false)
				} else {
					that.$set(that.carSourceList[index], 'isCheck', true)
				}
				let allChecFlag = true
				that.carSourceList.some(el => {
					if (el.serviceType == 10) {
						if (!el.isCheck) {
							allChecFlag = false
							return true
						}
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
				that.carSourceList.forEach(item => {
					if (item.serviceType == 10) {
						if (that.allCheckedFlag) {
							item.isCheck = true
						} else {
							item.isCheck = false
						}
					}
					
				})
				that.calculationCheckNum()
			},
			async toContact() {
				let that = this;
				if (!ship.btnRepeat()) return;
				var allCheckedNum = this.allCheckedNum;
				var fleetDetail = this.info;
				if (allCheckedNum < 1) {
					uni.showToast({
						title: '请选择司机查看',
						icon: 'none'
					})
					return;
				}
				let carSourceList = this.carSourceList;
				var willJoinFleetArr = [];
				carSourceList.forEach(item => {
					if (item.isCheck) {
						willJoinFleetArr.push(item)
					}
				})
				
				that.willJoinFleetArr = willJoinFleetArr;
				var isAlertJoin = this.isAlertJoin;
				if (isAlertJoin == 8) {
					this.showCheckedNum = this.willJoinFleetArr.length;
					this.totView();
				} else {
					this.determineView();
				}
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			makePhoneCall(item) {
				if (!ship.btnRepeat()) return;
				
				uni.makePhoneCall({
					phoneNumber: item.displayMobile ? item.displayMobile : item.mobile //仅为示例
				});
				publicData.addBuried("超级车队拨打电话")
				
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
			
			toTrackSimple(item) {
				
				if (!ship.btnRepeat()) return;
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
					url: './map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + item.isContact
				})
			},
			toTrack() {
				if (!ship.btnRepeat()) return;
				var allCheckedNum = this.allCheckedNum;
				if (allCheckedNum < 1) {
					uni.showToast({
						title: '请选择司机查看',
						icon: 'none'
					})
					return;
				}
				if (allCheckedNum > 1) {
					uni.showToast({
						title: '只能选择一个司机查看',
						icon: 'none'
					})
					return;
				}
				var carSourceList = this.carSourceList;
				var selectedItem;
				carSourceList.forEach(item => {
					if (item.isCheck) {
						selectedItem = item;
						return;
					}
				})
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
					url: './map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(selectedItem)
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
			createTimeStr(dateTimeArray,dateTime){
				let timeStr = dateTimeArray[0][dateTime[0]]+'-'+dateTimeArray[1][dateTime[1]]+'-'+dateTimeArray[2][dateTime[2]]+' '+dateTimeArray[3][dateTime[3]]+":"+dateTimeArray[4][dateTime[4]];
				console.log(timeStr)
				return timeStr
			},
			async getFleetUser() {
				try {
					var senderParams = this.senderParams;
					var receiverParams = this.receiverParams;
					var obj = {
						source: 2,
						pageNum: 1,
						pageSize: 10,
					}
					var params = Object.assign({}, obj, senderParams, receiverParams);
					var dataParams = utilDate.removeProperty(params);
					console.log("getCarSourceBySender",dataParams);
					var res = await ship.newQueryPostRequest("/olnanas/recommend/getCarSourceBySender", dataParams)
					console.log(res, '用户信息');
					if (res.retCode == "0000000") {
						var carSourceVOS = res.rspBody.carSourceVOS;
						var userIds = [];
						if (carSourceVOS.length < 1) {
							this.locationParams.userIdList = [];
							this.carSourceList = [];
							return false;
						};
						carSourceVOS.forEach(item => {
							userIds.push(item.userId)
						})
						this.locationParams.userIdList = userIds;
						return true;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
						this.locationParams.userIdList = [];
						this.carSourceList = [];
						return false;
					}
				} catch (e) {
					console.log(e, 'asa')
					return false;
					//TODO handle the exception
				}
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

			async getData(num) {
				
				var senderParams = this.senderParams;
				var locationParams = this.locationParams;
				var receiverParams = this.receiverParams;
				if (!senderParams.isAllPro || !receiverParams.isAllPro) {
					if (senderParams.selectedCityIndex != -1 && senderParams.selectedProvinceIndex != -1) {
						var isGetFleetUser = await this.getFleetUser();
						if (!isGetFleetUser) {
							uni.stopPullDownRefresh();
							uni.hideLoading();
							this.isNoData = true;
							this.isMore = "more"
							return;
						};
					} else if (receiverParams.selectedCityIndex != -1 && receiverParams.selectedProvinceIndex != -1) {
						var isGetFleetUser = await this.getFleetUser();
						if (!isGetFleetUser) {
							uni.stopPullDownRefresh();
							uni.hideLoading();
							this.isNoData = true;
							this.isMore = "more"
							return;
						};
					} else {
						locationParams.userIdList && delete locationParams.userIdList
					}
				} else {
					locationParams.userIdList && delete locationParams.userIdList
				}
				
				if (num == 'refresh') {
					this.params.pageNum = 1;
				} else {
					
					this.params.pageNum++;
				}
				try {
					console.log(this.params, 'asasas');
					var params = this.params;
					var setParams = Object.assign({}, params, locationParams);
					var toParams = utilDate.removeProperty(setParams);
					toParams.source = 1;
					console.log("cheeae1", toParams, params, locationParams, senderParams, receiverParams);
					var res = await ship.newQueryPostRequest("/cd/fleetWithUser/list", toParams)
					uni.stopPullDownRefresh();
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var carSourceVOS = res.rspBody.items;
						console.log("车队成员列表",carSourceVOS[0])
						carSourceVOS.forEach(item => {
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
						var len = carSourceVOS.length;
						if (num == "refresh") {
							this.carSourceList = carSourceVOS;
							if (len < 1) {
								this.isNoData = true;
								this.isMore = "more";
								return;
							}
							this.isNoData = false;

							this.isMore = len < this.params.pageSize ? 'noMore' : 'more'


						} else {
							this.isNoData = false;
							this.carSourceList = this.carSourceList.concat(carSourceVOS);
							
							if (this.type == "fleetSource") {
								if (this.locationParams.isAllPro && this.params.pageNum == 30) {
									this.isMore = 'noMore'
								} else {
									this.isMore = len < this.params.pageSize ? 'noMore' : 'more'
								}
							} else {
								if (this.senderParams.isAllPro && this.params.pageNum == 30) {
									this.isMore = 'noMore'
								} else {
									this.isMore = len < this.params.pageSize ? 'noMore' : 'more'
								}
							}
						}

					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				} catch (e) {
					console.log(e)
					uni.hideLoading();
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			async searchAllPro() {
				//全国点击
				var isCollapse = this.isCollapse;
				var locationParams = this.locationParams;
				var senderParams = this.senderParams;
				var receiverParams = this.receiverParams;
				if (isCollapse == 0) {
					this.selectedProvinceIndex = -1;
					this.selectedCityIndex = -1;
					// locationParams.selectedProvinceIndex = -1;
					// locationParams.selectedCityIndex = -1;
					// locationParams.provinceName != undefined && delete locationParams.provinceName
					// locationParams.cityName != undefined && delete locationParams.cityName
					// locationParams.areaName != undefined && delete locationParams.areaName
					locationParams.isAllPro = true;
					this.locationParams = locationParams;
					
				} else if (isCollapse == 1) {
					this.selectedProvinceIndex = -1;
					this.selectedCityIndex = -1;
					// senderParams.selectedProvinceIndex = -1;
					// senderParams.selectedCityIndex = -1;
					// senderParams.provinceName != undefined && delete senderParams.provinceName
					// senderParams.cityName != undefined && delete senderParams.cityName
					// senderParams.areaName != undefined && delete senderParams.areaName
					senderParams.isAllPro = true
					this.senderParams = senderParams;
				} else {
					this.selectedProvinceIndex = -1;
					this.selectedCityIndex = -1;
					// receiverParams.selectedProvinceIndex = -1;
					// receiverParams.selectedCityIndex = -1;
					// receiverParams.receiver != undefined && delete receiverParams.receiver
					// receiverParams.receiverCode != undefined && delete receiverParams.receiverCode
					receiverParams.isAllPro = true;
					this.receiverParams = receiverParams;
				}
				this.cityArr = [];
				
			},
			async reset() {
				var isCollapse = this.isCollapse;
				var locationParams = this.locationParams;
				var senderParams = this.senderParams;
				var receiverParams = this.receiverParams;
				if (isCollapse == 0) {
					
					if (this.type == "carSource") {
						this.locationParams.isAllPro = true;
						this.cityArr = [];
						this.selectedProvinceIndex = -1;
						this.selectedCityIndex = -1;
						locationParams.selectedProvinceIndex = -1;
						locationParams.selectedCityIndex = -1;
						locationParams.provinceName != undefined && delete locationParams.provinceName
						locationParams.cityName != undefined && delete locationParams.cityName
						locationParams.areaName != undefined && delete locationParams.areaName
						this.locationParams = locationParams;
					} else {
						this.locationParams.isAllPro = false;
						this.getProvince();
					}
				} else if (isCollapse == 1) {
					if (this.type == "carSource") {
						this.senderParams.isAllPro = false;
						this.getProvince();
					} else {
						this.senderParams.isAllPro = true;
						this.cityArr = [];
						this.selectedProvinceIndex = -1;
						this.selectedCityIndex = -1;
						senderParams.selectedProvinceIndex = -1;
						senderParams.selectedCityIndex = -1;
						senderParams.provinceName != undefined && delete senderParams.provinceName
						senderParams.cityName != undefined && delete senderParams.cityName
						senderParams.areaName != undefined && delete senderParams.areaName
						this.senderParams = senderParams;
					}
				} else {
					this.receiverParams.isAllPro = true;
					this.cityArr = [];
					this.selectedProvinceIndex = -1;
					this.selectedCityIndex = -1;
					receiverParams.selectedProvinceIndex = -1;
					receiverParams.selectedCityIndex = -1;
					receiverParams.receiver != undefined && delete receiverParams.receiver
					receiverParams.receiverCode != undefined && delete receiverParams.receiverCode
					this.receiverParams = receiverParams;
				
				}

			},
			async look() {
				var selectedProvinceIndex = this.selectedProvinceIndex;
				var selectedCityIndex = this.selectedCityIndex;
				if (this.type == "fleetSource") {
					//车队定位是入口
					if (this.isCollapse == 0) {
						if (!this.locationParams.isAllPro) {
							if (selectedProvinceIndex < 0) {
								uni.showToast({
									title: '请选择',
									icon: 'none'
								})
								return;
							};
							if (selectedCityIndex < 0) {
								uni.showToast({
									title: '请选择',
									icon: 'none'
								})
								return;
							};
							this.locationParams.selectedProvinceIndex = this.selectedProvinceIndex;
							this.locationParams.selectedCityIndex = this.selectedCityIndex;
						} else {
							this.locationParams.selectedProvinceIndex = -1;
							this.locationParams.selectedCityIndex = -1;
						}
						
						this.senderParams.selectedProvinceIndex = -1;
						this.senderParams.selectedCityIndex = -1;
						this.receiverParams.selectedProvinceIndex = -1;
						this.receiverParams.selectedCityIndex = -1;
						this.chooseArr[1].value = "";
						this.chooseArr[2].value = "";
					}
					if (this.isCollapse == 1) {
						this.senderParams.selectedProvinceIndex = this.selectedProvinceIndex;
						this.senderParams.selectedCityIndex = this.selectedCityIndex
					}
					if (this.isCollapse == 2) {
						this.receiverParams.selectedProvinceIndex = this.selectedProvinceIndex;
						this.receiverParams.selectedCityIndex = this.selectedCityIndex
					}
					if (this.isCollapse == 1 || this.isCollapse == 2) {
						if ((selectedProvinceIndex > -1 && selectedCityIndex < 0) || (selectedProvinceIndex < 0 &&
								selectedCityIndex > -1)) {
							uni.showToast({
								title: '请选择',
								icon: 'none'
							})
							return;
						}
					}

				} else {
					//常跑地图是入口
					if (this.isCollapse == 1) {
						if (!this.senderParams.isAllPro) {
							if (selectedProvinceIndex < 0) {
								uni.showToast({
									title: '请选择',
									icon: 'none'
								})
								return;
							};
							if (selectedCityIndex < 0) {
								uni.showToast({
									title: '请选择',
									icon: 'none'
								})
								return;
							};
							this.senderParams.selectedProvinceIndex = this.selectedProvinceIndex;
							this.senderParams.selectedCityIndex = this.selectedCityIndex;
						} else {
							this.senderParams.selectedProvinceIndex = -1;
							this.senderParams.selectedCityIndex = -1;
						}
						
						this.locationParams.selectedProvinceIndex = -1;
						this.locationParams.selectedCityIndex = -1;
						this.locationParams.provinceName && delete this.locationParams.provinceName
						this.locationParams.cityName && delete this.locationParams.cityName
						this.locationParams.areaName && delete this.locationParams.areaName
						this.locationParams.userIdList && delete this.locationParams.userIdList
						
						this.receiverParams.selectedProvinceIndex = -1;
						this.receiverParams.selectedCityIndex = -1;
						this.receiverParams.receiver = "";
						this.receiverParams.receiverCode = "";
						
						this.chooseArr[0].value = "";
						this.chooseArr[2].value = "";

					}

					if (this.isCollapse == 0 || this.isCollapse == 2) {
						if ((selectedProvinceIndex > -1 && selectedCityIndex < 0) || (selectedProvinceIndex < 0 &&
								selectedCityIndex > -1)) {
							uni.showToast({
								title: '请选择',
								icon: 'none'
							})
							return;
						}
					}
					if (this.isCollapse == 0) {
						this.locationParams.selectedProvinceIndex = this.selectedProvinceIndex;
						this.locationParams.selectedCityIndex = this.selectedCityIndex;
					}
					if (this.isCollapse == 2) {
						this.receiverParams.selectedProvinceIndex = this.selectedProvinceIndex;
						this.receiverParams.selectedCityIndex = this.selectedCityIndex
					}
					

				}
				var cityArr = this.cityArr;
				var provinceArr = this.provinceArr;
				var locationParams = this.locationParams;
				var senderParams = this.senderParams;
				var receiverParams = this.receiverParams;
				var isCollapse = this.isCollapse;
				if (isCollapse == 0) {
					//定位弹框
					var selectedLocationProIndex = locationParams.selectedProvinceIndex;
					var selectedLocationCityIndex = locationParams.selectedCityIndex;
					if (selectedLocationProIndex < 0 && selectedLocationCityIndex < 0) {
						this.chooseArr[0].value = this.locationParams.isAllPro ? "定位：全国" : '';
						this.chooseArr[0].isClick = false;
						locationParams.provinceName && delete locationParams.provinceName;
						locationParams.cityName && delete locationParams.cityName;
						locationParams.areaName && delete locationParams.areaName;
						locationParams.userIdList && delete locationParams.userIdList;
						this.isCollapse = -1;
						this.locationParams = locationParams;
						uni.showLoading();
						this.getData("refresh");
						return;
					}
					var proCode = provinceArr[selectedLocationProIndex].code;
					if (proCode == "110000" || proCode == "120000" || proCode == "500000" || proCode == "310000") {
						locationParams.provinceName = provinceArr[selectedLocationProIndex].name
						locationParams.cityName = provinceArr[selectedLocationProIndex].name
						if (cityArr[selectedLocationCityIndex].name == "全市") {
							locationParams.areaName && delete locationParams.areaName;
							this.chooseArr[0].value = "定位：" + locationParams.cityName;
						} else {
							console.log(cityArr, selectedLocationCityIndex);
							locationParams.areaName = cityArr[selectedLocationCityIndex].name;
							this.chooseArr[0].value = "定位：" + locationParams.areaName;
						}

					} else {
						locationParams.provinceName = provinceArr[selectedLocationProIndex].name;
						if (cityArr[selectedLocationCityIndex].name == "全省") {
							locationParams.cityName && delete locationParams.cityName
							this.chooseArr[0].value = "定位：" + locationParams.provinceName;
						} else {
							locationParams.cityName =  cityArr[selectedLocationCityIndex].name
							this.chooseArr[0].value = "定位：" + locationParams.cityName;
						}
						locationParams.areaName && delete locationParams.areaName;
					}
					console.log("定位的参数",locationParams);
					this.chooseArr[0].isClick = false;
					this.locationParams = locationParams;
				} else if (isCollapse == 1) {
					//常跑始发弹框
					var selectedSenderProIndex = senderParams.selectedProvinceIndex;
					var selectedSenderCityIndex = senderParams.selectedCityIndex;
					console.log("阿萨说" ,selectedSenderProIndex, selectedSenderCityIndex);
					if (selectedSenderProIndex == -1 && selectedSenderCityIndex == -1) {
						//定位视图没有选择常跑始发
						this.chooseArr[1].value = senderParams.isAllPro ? '常跑始发：全国' : "";
						this.chooseArr[1].isClick = false;
						senderParams.sender && delete senderParams.sender;
						senderParams.senderCode && delete senderParams.senderCode;
						this.isCollapse = -1;
						this.senderParams = senderParams;
						uni.showLoading();
						this.getData("refresh");
						return;
					}
					var proCode = provinceArr[selectedSenderProIndex].code;
					if (proCode == "110000" || proCode == "120000" || proCode == "500000" || proCode == "310000") {
						if (cityArr[selectedSenderCityIndex].name == "全市") {
							senderParams.sender = provinceArr[selectedSenderProIndex].name
							senderParams.senderCode = provinceArr[selectedSenderProIndex].code
							this.chooseArr[1].value = "常跑始发：" + provinceArr[selectedSenderProIndex].name;
							console.log("1")
						} else {
							senderParams.sender = cityArr[selectedSenderCityIndex].name;
							senderParams.senderCode = cityArr[selectedSenderCityIndex].code;
							this.chooseArr[1].value = "常跑始发：" + cityArr[selectedSenderCityIndex].name;
						}
					} else {
						if (cityArr[selectedSenderCityIndex].name == "全省") {
							senderParams.sender = provinceArr[selectedSenderProIndex].name;
							senderParams.senderCode = proCode;
							this.chooseArr[1].value = "常跑始发：" + provinceArr[selectedSenderProIndex].name;
							console.log("2")
						} else {
							senderParams.sender = cityArr[selectedSenderCityIndex].name;
							senderParams.senderCode = cityArr[selectedSenderCityIndex].code;
							this.chooseArr[1].value = "常跑始发：" + cityArr[selectedSenderCityIndex].name;
						}
					}
					this.chooseArr[1].isClick = false;
					this.senderParams = senderParams;
					console.log("c阿萨212", senderParams, selectedCityIndex, selectedProvinceIndex)
				} else {
					//常跑目的弹框
					var selectedSenderProIndex = receiverParams.selectedProvinceIndex;
					var selectedSenderCityIndex = receiverParams.selectedCityIndex;
					
					if (selectedSenderProIndex == -1 && selectedSenderCityIndex == -1) {
						//定位视图没有选择常跑始发
						this.chooseArr[2].value = receiverParams.isAllPro ? '常跑目的：全国' : "";
						this.chooseArr[2].isClick = false;
						receiverParams.receiver && delete receiverParams.receiver;
						receiverParams.receiverCode && delete receiverParams.receiverCode;
						this.isCollapse = -1;
						this.receiverParams = receiverParams;
						uni.showLoading();
						this.getData("refresh");
						return;
					}
					console.log("选择常跑目的",selectedSenderProIndex)
					var proCode = provinceArr[selectedSenderProIndex].code;
					if (proCode == "110000" || proCode == "120000" || proCode == "500000" || proCode == "310000") {
						if (cityArr[selectedSenderCityIndex].name == "全市") {
							receiverParams.receiver = provinceArr[selectedSenderProIndex].name
							receiverParams.receiverCode = provinceArr[selectedSenderProIndex].code
							this.chooseArr[2].value = "常跑目的：" + provinceArr[selectedSenderProIndex].name;
							console.log("1")
						} else {
							receiverParams.receiver = cityArr[selectedSenderCityIndex].name;
							receiverParams.receiverCode = cityArr[selectedSenderCityIndex].code;
							this.chooseArr[2].value = "常跑目的：" + cityArr[selectedSenderCityIndex].name;
							console.log("2")
						}
					} else {
						if (cityArr[selectedSenderCityIndex].name == "全省") {
							receiverParams.receiver = provinceArr[selectedSenderProIndex].name;
							receiverParams.receiverCode = proCode;
							this.chooseArr[2].value = "常跑目的：" + provinceArr[selectedSenderProIndex].name;
						}  else {
							receiverParams.receiver = cityArr[selectedSenderCityIndex].name;
							receiverParams.receiverCode = cityArr[selectedSenderCityIndex].code;
							this.chooseArr[2].value = "常跑目的：" + cityArr[selectedSenderCityIndex].name;
						}
						
					}
					this.chooseArr[2].isClick = false;
					this.receiverParams = receiverParams;
					console.log("c阿萨212", provinceArr[selectedSenderProIndex])
				}
				this.isCollapse = -1;
				this.$forceUpdate();
				uni.showLoading();
				await this.getData("refresh");

			},
			async getProvince() {
				var provinceLocal = uni.getStorageSync("provinceLocal");
				var provinceArr = JSON.parse(provinceLocal);
				this.provinceArr = provinceArr;
				if (this.type == "carSource") {
					var provinceName = this.defaultParams.provinceName;
					var cityName = this.defaultParams.sender;
					var cityCode = this.defaultParams.senderCode;
					var findIndex = provinceArr.findIndex(item => {
						return item.name == provinceName
					});
					console.log(findIndex, "1")
					if (findIndex < 0) {
						this.senderParams.selectedProvinceIndex = -1;
						this.selectedProvinceIndex = -1;
						var cities = this.provinceArr[0].cities;
						var proCode = this.provinceArr[0].code;
						var coties = [
							{name: '全省', proName: provinceName,code: proCode},
							...cities,
						]
						this.cityArr = coties;
						return;
					}
					this.selectedProvinceIndex = findIndex;
					this.senderParams.selectedProvinceIndex = findIndex;
					this.defaultParams.selectedProvinceIndex = findIndex;
					var proCode = provinceArr[findIndex].code;
					var cities = provinceArr[findIndex].cities;
					if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "北京市" || provinceName ==
						"重庆市") {
						var coties = [{
							name: "全市",
							proName: provinceName,
							code: proCode,
						}, ...cities]
					} else {
						var coties = [{
							name: "全省",
							proName: provinceName,
							code: proCode,
						}, ...cities]
					}
					this.cityArr = coties;
					var cityIndex = coties.findIndex(item => {
						return item.code == cityCode
					})
					console.log(cityIndex, "1")
					if (cityIndex < 0) {
						this.selectedCityIndex = -1;
						this.defaultParams.selectedCityIndex = -1;
						this.senderParams.selectedCityIndex = -1;
						return;
					}
					this.defaultParams.selectedCityIndex = cityIndex;
					this.senderParams.selectedCityIndex = cityIndex;
					this.selectedCityIndex = cityIndex;
					console.log("地址", this.senderParams);
					return;
				}
				var provinceName = this.defaultParams.provinceName;
				var cityName = this.defaultParams.cityName;
				var findIndex = provinceArr.findIndex(item => {
					return item.name == provinceName
				});
				console.log("asasasas", findIndex);
				if (findIndex < 0) {
					this.locationParams.selectedProvinceIndex = -1;
					this.selectedProvinceIndex = -1;
					var cities = this.provinceArr[0].cities;
					var proCode = this.provinceArr[0].code;
					var coties = [
						{name: '全省', proName: provinceName,code: proCode},
						...cities,
					]
					this.cityArr = coties;
					return;
				}
				var proCode = provinceArr[findIndex].code;
				this.selectedProvinceIndex = findIndex;
				this.locationParams.selectedProvinceIndex = findIndex;
				this.defaultParams.selectedProvinceIndex = findIndex;
				var cities = provinceArr[findIndex].cities;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "北京市" || provinceName == "重庆市") {
					var coties = [{
						name: "全市",
						proName: provinceName,
						code: proCode,
					}, ...cities]
					
					this.cityArr = coties;
					var cityIndex = 0;
				} else {
					var coties = [{
						name: "全省",
						proName: provinceName,
						code: proCode,
					}, ...cities]
					this.cityArr = coties;
					var cityIndex = coties.findIndex(item => {
						return item.name == "全省" ? item.proName == cityName : item.name == cityName
					})
				}
				console.log("cityIndex", cityIndex);
				if (cityIndex < 0) {
					this.selectedCityIndex = -1;
					return;
				}
				this.defaultParams.selectedCityIndex = cityIndex;
				this.locationParams.selectedCityIndex = cityIndex;
				this.selectedCityIndex = cityIndex;

				console.log("地址", this.locationParams);
			},

			showPop(index) {
				var chooseArr = this.chooseArr;
				var isCollapse = this.isCollapse;
				if (isCollapse == index) {
					this.isCollapse = -1;
					chooseArr[index].active = false;
					chooseArr[index].isClick = false;
					this.chooseArr = chooseArr;
					return
				}

				chooseArr.forEach((item, i) => {
					item.active = false;
				})
				chooseArr[index].active = true;
				chooseArr[index].isClick = true;
				this.chooseArr = chooseArr;
				this.isCollapse = index;
				if (index == 0) {
					if (this.locationParams.selectedProvinceIndex == -1 && this.locationParams.selectedCityIndex == -1) {
						this.locationParams.isAllPro = true;
						this.cityArr = [];
						this.selectedProvinceIndex = -1;
						this.selectedCityIndex = -1;
					} else {
						this.selectedProvinceIndex = this.locationParams.selectedProvinceIndex;
						this.selectedCityIndex = this.locationParams.selectedCityIndex;
						this.setAlertData();
					}
					
				}
				if (index == 1) {
					if (this.senderParams.selectedProvinceIndex == -1 && this.senderParams.selectedCityIndex == -1) {
						this.senderParams.isAllPro = true;
						this.cityArr = [];
						this.selectedProvinceIndex = -1;
						this.selectedCityIndex = -1;
					} else {
						this.selectedProvinceIndex = this.senderParams.selectedProvinceIndex;
						this.selectedCityIndex = this.senderParams.selectedCityIndex;
						this.setAlertData();
					}
				
				}
				if (index == 2) {
					if (this.receiverParams.selectedProvinceIndex == -1 && this.receiverParams.selectedCityIndex == -1) {
						this.receiverParams.isAllPro = true;
						this.cityArr = [];
						this.selectedProvinceIndex = -1;
						this.selectedCityIndex = -1;
					} else {
						this.selectedProvinceIndex = this.receiverParams.selectedProvinceIndex;
						this.selectedCityIndex = this.receiverParams.selectedCityIndex;
						this.setAlertData();
					}
					
				}
				this.$forceUpdate();
				console.log("项目", chooseArr);
			},
			setAlertData() {
				var selectedProvinceIndex = this.selectedProvinceIndex;
				if (selectedProvinceIndex < 0) return;
				var proArr = this.provinceArr;
				var provinceName = proArr[selectedProvinceIndex].name;
				var cities = proArr[selectedProvinceIndex].cities;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "北京市" || provinceName == "重庆市") {
					var coties = [{
						name: '全市',
						proName: provinceName,
					}, ...cities]
				} else {
					var coties = [{
						name: '全省',
						proName: provinceName,
					}, ...cities]
					var coties = coties
				}
				
				this.cityArr = coties;
			},
			hidePop() {
				this.isCollapse = -1;
				var chooseArr = this.chooseArr;
				chooseArr.forEach(item => {
					item.active = false;
					item.isClick = false
				})
				this.chooseArr = chooseArr;
			},
			noPop() {
				return false
			},
			switchProIndex(index) {
				if (index == this.selectedProvinceIndex) return;
				this.selectedProvinceIndex = index;
				this.selectedCityIndex = -1;
				//切换城市
				var provinceArr = this.provinceArr;
				var provinceName = provinceArr[index].name;
				if (this.isCollapse == 0) {
					// this.locationParams.selectedProvinceIndex = index;
					// this.locationParams.selectedCityIndex = -1;
					this.locationParams.isAllPro = false;
				} else if (this.isCollapse == 1) {
					// this.senderParams.selectedProvinceIndex = index;
					// this.senderParams.selectedCityIndex = -1;
					this.senderParams.isAllPro = false;
				} else {
					// this.receiverParams.selectedProvinceIndex = index;
					// this.receiverParams.selectedCityIndex = -1;
					this.receiverParams.isAllPro = false;
				}

				var cities = provinceArr[index].cities;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "北京市" || provinceName == "重庆市") {
					var coties = [{
						name: '全市',
						proName: provinceName
					}, ...cities]
				} else {
					var coties = [{
						name: '全省',
						proName: provinceName
					}, ...cities]
					var coties = coties
				}
				this.cityArr = coties;
			},
			switchCityIndex(index) {
				this.selectedCityIndex = index;
				// if (this.isCollapse == 0) {
				// 	this.locationParams.selectedCityIndex = index;
				// 	this.locationParams.isAllPro = false;
				// } else if (this.isCollapse == 2) {
				// 	this.senderParams.selectedCityIndex = index;
				// 	this.senderParams.isAllPro = false;
				// } else {
				// 	this.receiverParams.selectedCityIndex = index;
				// 	this.receiverParams.isAllPro = false;
				// }
			},
			closePop() {
				this.isCollapse = -1;
				var chooseArr = this.chooseArr;
				chooseArr.forEach(item => {
					item.active = false;
					item.isClick = false
				})
				this.chooseArr = chooseArr;
			},
			switchStatus(index) {
				var chooseArr = this.chooseArr;
				var selectedStatusIndex = this.selectedStatusIndex;
				if (selectedStatusIndex == index) {
					chooseArr[1].value = "";
					this.selectedStatusIndex = -1;
					
				} else {
					this.selectedStatusIndex = index;
					chooseArr[1].value = index == 0 ? '可接单' : '忙碌';
				}
				chooseArr[1].isClick = false;
				this.chooseArr = chooseArr;
				uni.showLoading();
				this.isCollapse = -1;
				this.getData("refresh");
			},
			
			jumpToDriverDetails(id, checkStatus, showPriceSensitivity) { // 跳转司机详情
				uni.navigateTo({
					url: '/pages/goodsDelivery/driverDetails/driverDetails?id=' + id + '&encryption=' + checkStatus + '&showPriceSensitivity=' + showPriceSensitivity
				})
			},
			closeNoNumPopup() { // 关闭充值弹窗
				this.$refs.noSourceNumPopup.close();
				this.$refs.noSourceNumPopupFleet.close();
				
			},
			getCouponAccountType() { // 单次充值配置
				let params = {
					"level1": "车源",
				}
				console.log('单次充值费参数', params);
				let that = this;
				ship.postRequest('/cp/couponAccountType/list', params)
				.then(function (res) {
					console.log('单次充值结果', res);
					if(res.retCode == '0000000'){
						that.couponAccountObj = {};
						that.couponAccountObj = res.rspBody && res.rspBody.length > 0 ? res.rspBody['0'] : {};
						uni.hideLoading();
						that.$refs.noSourceNumPopup.open();
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
			getMealBaseList() { // 会员套餐列表
				let params = {
					"setmfree": "0",
					"setmrole": "cargo",
					"setmchannel": "app",
					setmdisp: 1,
				}
				// console.log('会员套餐参数', params);
				let that = this;
				ship.postRequest('/cp/set/meal/base/list', params)
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
				this.$refs.noSourceNumPopupFleet.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage?pageName=sourceIndex'
				})
			},
			jumpToSingleTopup() { // 单次充值
				getApp().globalData.smsObj = {
					amount: this.firstTouUp == 1 ? this.couponAccountObj.pointFirstPrice / 1000 : this.couponAccountObj.pointPrice / 1000,
					noteVOS: [],
					point: Number(this.couponAccountObj.pointNum)
				}
				this.$refs.noSourceNumPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/smsTopUp?typeNum=54'
				})
			},
			toCallUser(item, index) { // 联系TA
				if(item.isContact == 1 || this.info.isOwner) {
					this.checkCallPermissions(item, index);
				}else {
					uni.showLoading();
					let params = {
						fleetId: this.info.id,
						userId: item.userId,
						contactUserId: this.userInfo.userId,

					}
					console.log('消费参数', params);
					let that = this;
					ship.postRequest('/cd/contact/log/addBatch', [params])
					.then(function (res) {
						console.log('消费结果', res);
						if(res.retCode == '0000000'){
							uni.hideLoading();
							if(res.rspBody > 0) {
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
			checkCallPermissions(item, index) {
				console.log(item);
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
							that.makePhoneCall(result, item, index);
						}
					)
				}else {
					this.makePhoneCall(1, item, index);
				}
			},
			makePhoneCall(result, item, index) {
				console.log('触发');
				this.carSourceList[index].isContact = 1;
				if(result == 1) {
					uni.makePhoneCall({
					    phoneNumber: item.mobile,
					});
					publicData.addBuried("车队拨打司机电话")
				}else {
					uni.showToast({
						title: '请开启拨号权限',
						icon: 'none'
					})
				}
			},
			checkCollectNum(item, index) { // 检查消费次数
				console.log('收藏对象', item);
				if(item.isContact == 1 || this.info.isOwner) {
					this.checkFleetNumPopup(item, index);
				}else {
					uni.showLoading();
					let params = {
						fleetId: this.info.id,
						userId: item.userId,
						contactUserId: this.userInfo.userId,
					
					}
					console.log('消费参数', params);
					let that = this;
					ship.postRequest('/cd/contact/log/addBatch', [params])
					.then(function (res) {
						console.log('消费结果', res);
						if(res.retCode == '0000000'){
							if(res.rspBody > 0) {
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
				ship.postRequest('/cp/member/queryByUser', params)
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
							that.$refs.noSourceNumPopupFleet.open();
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
					ship.postRequest('/cd/fleetWithUser/invite', [params])
					.then(function (res) {
						console.log('收藏结果', res);
						if(res.retCode == '0000000'){
							uni.showToast({
								title: '收藏成功',
								icon: 'none'
							})
							that.carSourceList[index].isCollect = 1;
							that.carSourceList[index].isContact = 1;
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
				ship.postRequest('/cd/fleet/list', params)
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
		box-sizing: border-box;

		&.noScroll {
			overflow: hidden;
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
				font-size: 40rpx;
				color: rgba(51, 51, 51, 1);
				font-weight: 600;
				line-height: 47rpx;
				.car_source_left_arrow {
					position: absolute;
					left: 38rpx;
					top: 30rpx;
					width: 16rpx;
					height: 30rpx;
				}
			}
		}

		.selected-content {
			.selected-title {
				background-color: #FAFAFA;
				box-sizing: border-box;
				padding:0 34rpx;
				position: fixed;
				top: 0;
				left: 0;
				height: 88rpx;
				width: 100vw;
				z-index: 9;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				&.isVerse {
					flex-direction: row-reverse;
				}
				.selected-item {
					display: flex;
					flex-direction: row;
					align-items: center;

					.icon_down {
						width: 24rpx;
						height: 12rpx;
						margin-left: 12rpx;
					}
					.icon_toggle {
						transform: rotate(180deg);
					}

					.selected-title-text {
						max-width: 150rpx;
						color: rgba(51, 51, 51, 1);
						font-size: 28rpx;
						font-weight: 500;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						&.active {
							color: rgba(52, 137, 233, 1);
						}
					}
				}
			}

			.selected-pop {
				position: fixed;
				top: 100rpx;
				left: 0;
				width: 100vw;
				height: 0;
				opacity: 0;
				overflow: hidden;
				background-color: rgba(84, 84, 84, 0.71);
				z-index: 99;

				&.active {
					opacity: 1;
					height: calc(100vh - 100rpx);
				}

				.pop-content {
					background-color: #FFFFFF;
					display: flex;
					flex-direction: column;
					align-items: center;

					.status-item {
						height: 80rpx;
						color: #rgba(51, 51, 51, 1);
						font-size: 28rpx;
						width: 100vw;
						padding-left: 34rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;

						&.active {
							color: rgba(43, 114, 240, 1);
							font-weight: 500;
						}

						.check {
							width: 30rpx;
							height: 22rpx;
							margin-right: 10rpx;
						}
					}

					.pop-title {
						width: 100vw;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						height: 108rpx;
						border-top: 1rpx solid rgba(234, 234, 234, 1);
						border-bottom: 1rpx solid rgba(234, 234, 234, 1);
						color: rgba(51, 51, 51, 1);
						font-size: 32rpx;
						font-weight: 500;
						.pop-title-item {
							width: 50vw;

							&:first-child {
								padding-left: 34rpx;
								box-sizing: border-box;
							}
						}
					}

					.pop-item {
						height: 50vh;
					}

					.pop-inner {
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						height: 50vh;
						width: 100vw;

						.item-pop {
							height: 80rpx;
							color: rgba(51, 51, 51, 1);
							font-size: 28rpx;
							box-sizing: border-box;
							display: flex;
							flex-direction: row;
							align-items: center;

							.check {
								width: 30rpx;
								height: 22rpx;
								margin-right: 10rpx;
							}

							.proActive {
								color: rgba(43, 114, 240, 1);
								font-weight: 500;
							}

						}

						.province-item {
							flex: 1;
							display: flex;
							flex-direction: column;
							align-items: center;
							height: 50vh;

							.pl-34 {
								padding-left: 34rpx;
								box-sizing: border-box;
							}
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
						margin-bottom: 66rpx;

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
			}

		}

		.list {
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

				.item-content {
					width: calc(100vw - 68rpx - 148rpx);
					display: flex;
					flex-direction: column;
					padding-top: 16rpx;
					box-sizing: border-box;

					.line {
						margin-right: 16rpx;
						margin-top: 20rpx;
						height: 1rpx;
						background-color: rgba(224, 224, 224, 1);

					}

					.row {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;

						&.row-start {
							justify-content: flex-start;
							align-items: flex-start;
						}

						&.mt-16 {
							margin-top: 16rpx;
						}

						&.row-opt {
							justify-content: flex-end;
							padding: 18rpx 20rpx 18rpx 0;
							box-sizing: border-box;

							.opt-item {
								flex: 1;
								display: flex;
								flex-direction: row;
								justify-content: center;
								align-items: center;
								font-size: 28rpx;
								color: rgba(0, 0, 0, 1);

								&.opt-first {
									display: flex;
									flex-direction: row;
									justify-content: flex-start;
									align-items: center;
								}

								&.opt-middle {
									display: flex;
									flex-direction: row;
									justify-content: center;
									align-items: center;
								}

								&.opt-last {
									display: flex;
									flex-direction: row;
									justify-content: flex-end;
									align-items: center;
								}

								.point-icon {
									width: 48rpx;
									height: 48rpx;
									margin-right: 10rpx;
								}
							}
						}

						.name {
							font-size: 28rpx;
							color: rgba(51, 51, 51, 1);
							font-weight: 600;
						}

						.nameType {
							color: rgba(102, 102, 102, 1);
							font-size: 24rpx;
							margin-left: 10rpx;
						}

						.lenAndType {
							color: rgba(51, 51, 51, 1);
							font-size: 32rpx;
							line-height: 38rpx;
							margin-left: 10rpx;
						}

						.route {
							color: rgba(51, 51, 51, 1);
							font-size: 36rpx;
							line-height: 42rpx;
							margin-right: 10rpx;
						}

						.addr {
							color: rgba(52, 137, 233, 1);
							font-size: 36rpx;
							line-height: 42rpx;
							font-weight: 500;
						}

						.location-icon {
							flex: 1;
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: flex-start;
							color: rgba(51, 51, 51, 1);
							font-size: 36rpx;
							line-height: 42rpx;

							.icon_content {
								height: 42rpx;
								display: flex;
								align-items: center;
								justify-content: center;
							}

							.beidou_icon {
								width: 20rpx;
								height: 20rpx;
								margin-right: 8rpx;
							}

							.beidou_no_icon {
								width: 32rpx;
								height: 32rpx;
								margin-right: 8rpx;
							}

							.addr-text {
								flex: 1;
								color: rgba(51, 51, 51, 1);
								font-size: 36rpx;
								padding-left: 2px;
								line-height: 42rpx;

							}
						}

						.time {
							color: rgba(102, 102, 102, 1);
							font-size: 28rpx;
							margin-left: 18rpx;
							padding-top: 8rpx;
							margin-right: 54rpx;
						}

					}

				}
			}

			.car_source_item {
				margin: 24rpx 0 0 0;
				background-color: #FFF;
				box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
				border-radius: 24rpx;
				.listMsgBox {
					display: flex;
					padding: 18rpx 32rpx 32rpx 0;
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
						justify-content: flex-end;
						.btnBox + .btnBox {
							margin-left: 80rpx;
						}
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
				.head {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 148rpx;
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
							z-index: 7;
						}
						.vipIcon {
							width: 34rpx;
							height: 34rpx;
							position: absolute;
							z-index: 8;
							margin: 52rpx 0 0 -36rpx;
						}
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
					flex: 1;
					box-sizing: border-box;
					.right-opt-content {
						.line {
							height: 1rpx;
							background-color: rgba(224, 224, 224, 1);
							margin-top: 20rpx;
						}
						.opt-content {
							height: 88rpx;
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
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
						.user_type {
							font-size: 24rpx;
							color: rgba(102, 102, 102, 1);
							margin-left: 20rpx;
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
						.citys-label {
							color: rgba(51, 51, 51, 1);
						}

						.details {
							margin-left: auto;
							font-size: 28rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 500;
							color: rgba(52, 137, 233, 1);
							display: flex;
							align-items: center;
							justify-content: center;
							image {
								margin-left: 10rpx;
								width: 10rpx;
								height: 20rpx;
								// transform: rotate(180deg);
							}
						}

						.beidou_icon {
							width: 34rpx;
							height: 34rpx
						}

						.address-icon-content {
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
						}

						.times {
							margin-left: auto;
							font-size: 24rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							color: #666666;
						}

						.btn-content {
							flex: 1;
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
							font-size: 24rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							color: #E8520D;
						}
					}
				}
			}
		}

		.popupTitle {
			padding-top: 30rpx;
			justify-content: center;
			align-items: center;
		}

		.popupTitle-text {
			font-size: 18px;
			font-weight: 500;
		}

		.fleetHintBox {
			height: 290rpx;
			justify-content: center;
			align-items: center;
		}
		.popupTitle1 {
			padding-top: 50rpx;
		}

		.myFleetBox {
			width: 464rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			height: 590rpx;
			justify-content: flex-start;
			align-items: center;
		}

		.fleetHintBox {
			width: 464rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
		}

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
		}

		.myFleetInfoBox {
			margin-top: 20rpx;
			flex-direction: row;
			align-items: center;
			justify-content: center;
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
			width: 380rpx;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}

		.checkIcon {
			width: 28rpx;
			height: 28rpx;
			display: block;
			flex-shrink: 0;
			margin-right: 16rpx;
		}

		.fleetName {
			flex: 1;
		}

		.fleetName-text {
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			line-height: 44rpx;
		}

		.popupBtn {
			margin: 34rpx auto 0 auto;
			background-color: #3888FF;
			width: 312rpx;
			height: 62rpx;
			border-radius: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.popupBtn-text {
			font-size: 14px;
			font-weight: 500;
			color: #FFFFFF;
		}

		.hintMsg {
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			line-height: 33rpx;
			margin-top: 16rpx;
			text-align: center;
		}
		.rspMsgBox-1 {
			width: calc(100vw - 76rpx);
			padding: 62rpx 32rpx 60rpx;
			box-sizing: border-box;
			height: 222rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 20rpx 2rpx rgba(56, 136, 255, 0.18);
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.rspMsgBox {
			width: calc(100vw - 76rpx);
			padding: 62rpx 32rpx 60rpx;
			box-sizing: border-box;
			height: 222rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 20rpx 2rpx rgba(56, 136, 255, 0.18);
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.msgText-text {
			text-align: center;
			font-size: 40rpx;
			font-weight: 500;
			color: #000000;
			line-height: 58rpx;
			letter-spacing: 2rpx;
		}
		
		.msgText-tips-text {
			text-align: center;
			font-size: 36rpx;
			color: rgba(0, 0, 0, 1);
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
		.msgFleet {
			width: 400rpx;
			text-align: center;		
		}
		.msgBtn-text {
			color: #FFFFFF;
			font-weight: 500;
			font-size: 32rpx;
		}

		.footBtnGroup {
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 4;
			width: 100vw;
			height: 200rpx;
			box-sizing: border-box;
			background-color: #FFF;
			box-shadow: 0px -4rpx 16rpx 2rpx rgba(172, 172, 172, 0.41);

			.checkedBox {
				padding-top: 24rpx;
				padding-bottom: 20rpx;
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
					padding: 0 12rpx 0 2rpx;
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

			.opt-content {
				width: 750rpx;
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				align-items: center;
				margin-bottom: 17px;
				padding: 0 18px;
				box-sizing: border-box;
			}

			.opt-between {
				justify-content: space-between;
			}

			.opt-item {
				border-radius: 45px;
				height: 38px;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.opt-item-1 {
				background-color: rgba(56, 136, 255, 1);
				width: 80px;
			}

			.opt-item-5 {
				background-color: rgba(236, 122, 63, 1);
				width: 94px;
			}

			.opt-item-6 {
				background-color: rgba(234, 167, 67, 1);
				width: 80px;
			}

			.opt-item-2 {
				background-color: rgba(234, 167, 67, 1);
				width: 80px;

			}

			.opt-item-4 {
				background-color: rgba(178, 90, 246, 1);
				width: 130px;
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
			 right:-30rpx;
			 animation-timing-function: cubic-bezier(1.55, 0.27, 0.42, 0.68);
			 // animation-timing-function: cubic-bezier(0.68, 0.42, 0.27, 1.55);
			   }
			50% {
			 right:-52rpx;
			}
			   100% {
				   right:-30rpx;
			   }
		   }
			.opt-showPoints-icon {
				width: 50rpx;
				height: 50rpx;

			}

			.opt-item-7 {
				width: 80px;
				background-image: linear-gradient(to right, rgba(234, 142, 67, 1), rgba(234, 106, 58, 1));
			}

			.opt-item-text {
				color: #FFFFFF;
				font-weight: 500;
				font-size: 18px;
			}

			.opt-item-text-second {
				font-size: 16px;
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
					text-align: center;
				}
				.msgFleet {
					font-size: 28rpx;
					font-weight: 500;
					color: #F0AB88;
					line-height: 44rpx;
					text-align: center;
					flex: 1;
					box-sizing: border-box;
					padding: 0 10rpx;
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
