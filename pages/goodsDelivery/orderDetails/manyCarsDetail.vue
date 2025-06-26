<template>
	<view class="manyCarsDetail">
		<!-- <view class="headMenuBox" v-if="showMenu">
			<view class="menuBtn" @click="closeOrder()">下架货源</view>
		</view> -->
		
		<view class="orderListBox">
			<view class="orderHead" v-if="orderDetailInfo.fixPriceFlag == '1'">
				{{orderDetailInfo.patNum ? '已成交' + orderDetailInfo.patNum + '单，' : ''}}
				{{showOrderStatus(orderDetailInfo.orderSecondState)}}
			</view>
			<view class="orderHead" v-if="orderDetailInfo.fixPriceFlag != '1'">
				{{showOrderStatus(orderDetailInfo.orderSecondState)}}
				{{orderDetailInfo.orderSecondState == 11 || orderDetailInfo.orderSecondState == 13 ? orderStateHintMsg : orderDetailInfo.orderSecondState == 12  ? '确认用车时间' : ''}}  {{countdownTime}}
			</view>
			<view class="newOrderBody" v-if="orderDetailInfo.sid">
				<view class="addressModel">
					<view class="addressMsg">{{newShowAddressMsg('fir', orderDetailInfo)}}</view>
					<image class="addressIcon" src="/static/images/newOrderDetails/addressIcon.png"></image>
					<view class="addressMsg" style="text-align: right;">{{newShowAddressMsg('sec', orderDetailInfo)}}</view>
				</view>
				<view class="goodsModel">
					<view class="goodsDetails">{{showNewGoodsMsg()}}</view>
					<view class="showMoreBtn" @click="goSupplyDetails">
						<view class="msg">货源详情</view>
						<image class="rightIcon" src="/static/images/goodsDelivery/icon_right.png"></image>
					</view>
				</view>
				<view class="operationModel">
					<view class="operationBtn" v-if="hasOrdereEffective() || orderDetailInfo.orderSecondState == 19" @click="closeOrder()">下架货源</view>
					<view class="operationBtn" v-if="orderDetailInfo.fixPriceFlag == '1' && (orderDetailInfo.orderSecondState == 11 || orderDetailInfo.orderSecondState == 12 || orderDetailInfo.orderSecondState == 14)" @click="jumpToAssignedDriver()">指派</view>
				</view>
				<view class="orderNumberBox" @click="copyOrderNumber(orderDetailInfo.orderNumber)">
					<view class="num">货源号：{{orderDetailInfo.orderNumber}}</view>
					<image class="copyIcon" src="/static/images/newOrderDetails/copyIcon.png"></image>
				</view>
			</view>
			<view class="shareBox">
				<view class="title">分享货源，更快成交</view>
				<view class="msgBox">
					<image class="shareIcon" src="/static/images/newOrderDetails/shareIcon.png"></image>
					<view class="msg" @click="generate">分享</view>
				</view>
			</view>
		</view>
		
		<view class="recLengthBox" v-if="selectFlag == 2 && totalNum">
			<image class="icon" src="/static/images/vehicleOptions/noticeIcon.png"></image>
			<view class="msg">已为您推荐{{totalNum}}位司机</view>
		</view>
		
		<view id="listSelect" class="newStickyBox" :style="selectBoxSticky" v-if="hasOrdereEffective()">
			<view class="deliverySelectBox" :class="selectFlag == 1 ? 'selectBc' : 'defaultBc'">
				<view class="selectBtn" @click="selectFlag = 1">
					已接单待确认
					<uni-badge class="uni-badge-left-margin" type="error" :max-num="99" :text="testListAry.length" absolute="rightTop" size="small">
					</uni-badge>
				</view>
				<view class="selectBtn" @click="selectFlag = 2">推荐司机</view>
			</view>
			<image class="forFreeIcon" src="/static/images/newOrderDetails/forFree.png"></image>
			<view class="selectBtnGroup" v-if="showListSelect()">
				<view class="selectBox" @click="showSelectPopup()" style="min-width: 168rpx;margin-right:20rpx;">
					<view class="msg" :style="selectCityParams.name ? 'color: #3489E9;' : 'color: #333;'">{{selectCityParams.name ? showSelectAddr(selectCityParams.name) : '地区'}}</view>
					<image class="selectIcon" :src="selectCityParams.name ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
				</view>
				<view class="refreshBtn" @click="getSearchfreenum()">刷新推荐</view>
			</view>
		</view>
		
		<view class="quotationModel" v-if="selectFlag == 1 && hasOrdereEffective()" :style="listSticky">
			<view class="quotationList" v-for="(item, dIndex) in testListAry" :key="dIndex" :style="!item.showAll ? 'height:250rpx;transition: all 0.3s;' : 'height:924rpx;transition: all 0.3s;'">
				<view class="quotationLine">
					<view class="name">
						<text>{{showDriverVehicle(item.vehicleNo)}}</text>
						<text>{{showDriverName(item.userName)}}</text>
					</view>
					<image class="checkedIcon" @click="checkList(item, dIndex)"
						:src="item.flag ? '/static/images/newOrderDetails/checked.png' : '/static/images/vehicleOptions/nCheck.png'">
					</image>
				</view>
				<view class="quotationLine">
					<view class="car">
						<text>{{showDriverCar(item.note)}}</text>
					</view>
					<view class="price">
						<text>¥{{(item.quotePrice / 100).toFixed(2)}}/</text>
						<text style="font-size: 28rpx;">{{orderChild.orderQuoteVO.quotePriceTypeName}}</text>
					</view>
				</view>
				<view class="quotationLine" style="margin-bottom: 32rpx;">
					<view class="dateMsg">
						<text class="title">截止确认用车</text>
						<text class="content">{{item.quotePriceFinishDt}}</text>
					</view>
					<view class="showAllBtn" v-if="!item.showAll" @click="showAllMsg(item, dIndex, true)">
						<view class="msg">展开</view>
						<image class="rightIcon" src="/static/images/goodsDelivery/icon_right.png"></image>
					</view>
				</view>
				<view class="carrierPriceDetails">
					<view class="priceDetailsBox">
						<view class="carrierTitle">付款信息</view>
						<view class="priceRow">
							<view class="rowTitle">运费报价</view>
							<view class="rowHint">{{orderDetailInfo.orderChild.orderQuoteVO.payType == 3 ? '线上支付' : '线下支付'}}</view>
							<view class="rowPrice" v-if="orderDetailInfo.fixPriceFlag == '1'">¥{{orderDetailInfo.fixPrice ? (orderDetailInfo.fixPrice/100).toFixed(2) : 0}}/{{orderChild.orderQuoteVO.quotePriceTypeName}}</view>
							<view class="rowPrice" v-if="orderDetailInfo.fixPriceFlag != '1'">¥{{orderDetailInfo.orderDriverBidVOS && orderDetailInfo.orderDriverBidVOS.length > 0 ? (orderDetailInfo.orderDriverBidVOS['0'].quotePrice/100).toFixed(2) : 0}}/{{orderChild.orderQuoteVO.quotePriceTypeName}}</view>
							
						</view>
						<view class="priceRow" v-if="!orderDetailInfo.fleetSids">
							<view class="rowTitle">平台技术服务费</view>
							<view class="rowHint">成交后从保证金扣除</view>
							<view class="rowPrice">¥{{orderDetailInfo.vaShortLandedPrice ? (orderDetailInfo.vaShortLandedPrice/100).toFixed(2) : '0' }}</view>
						</view>
						<view class="priceRow" v-if="!orderDetailInfo.fleetSids">
							<view class="rowTitle">平台担保服务费</view>
							<view class="rowHint">成交后从保证金扣除</view>
							<view class="rowPrice">¥{{orderChild.orderValueAddedVOS.cargoDamagePrice ? (orderChild.orderValueAddedVOS.cargoDamagePrice/100).toFixed(2) : '0' }}</view>
						</view>
						<view class="priceRow">
							<view class="rowTitle">实付款</view>
							<view class="rowTotal" v-if="orderChild.orderQuoteVO.quotePriceTypeName != '趟'">
								单价*承运量
								<text class="msgPrice" v-if="showPriceItem(orderDetailInfo.vaShortLandedPrice, orderChild.orderValueAddedVOS.cargoDamagePrice) && !orderDetailInfo.fleetSids"> + {{showPriceItem(orderDetailInfo.vaShortLandedPrice, orderChild.orderValueAddedVOS.cargoDamagePrice)}}元</text>
							</view>
							<view class="rowTotal" v-if="orderChild.orderQuoteVO.quotePriceTypeName == '趟'">¥{{showTotalExit(item)}}</view>
						</view>
					</view>
					<view class="priceDetailsBox">
						<view class="carrierTitle">收入信息</view>
						<view class="priceRow">
							<view class="rowTitle">信息费</view>
							<view class="rowPrice">¥{{item.informationPrice ? (item.informationPrice/100).toFixed(2) : 0}}</view>
						</view>
						<view class="driverMarginPrice">已冻结司机保证金{{item.informationPrice ? (item.informationPrice/100).toFixed(2) : 0}}元，运单完成后转入您的账户</view>
						<view class="priceRow">
							<view class="rowTitle">实收入</view>
							<view class="rowTotal">¥{{item.informationPrice ? (item.informationPrice/100).toFixed(2) : 0}}</view>
						</view>
					</view>
					<view class="unShowBtn" v-if="item.showAll" @click="showAllMsg(item, dIndex,  false)">收起</view>
				</view>
			</view>
			<view class="noData" v-if="testListAry.length == 0">暂无司机报价～</view>
		</view>
		
		<view class="recommendedModel" v-if="selectFlag == 2 && hasOrdereEffective()" :style="listSticky">
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
				<view class="toFreeSearchBtn" @click="getSearchfreenum()">开始试用</view>
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
						<view class="btnBox" @click="toCallUser(item, rIndex)">
							<image class="icon" src="/static/images/newFleetDetails/mobile.png"></image>
							<view class="msg">联系TA</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="sourceLoadingModel" v-if="selectFlag == 2 && showSourceLoading">
				<image class="loadingIcon" src="/static/images/newOrderDetails/sourceLoading.png"></image>
				<view class="loadingMsg">正在为您加载推荐司机...</view>
			</view>
			
			<view class="loadingBox" v-show="noData">
				<image class="noDataIcon" src="/static/images/vehicleOptions/newNodata.png"></image>
			</view>
			<view class="loadingBox" v-show="noData">
				暂无当前范围的推荐车源～
			</view>
		</view>
		
		<view class="footBtnGroup" v-if="testListAry.length > 0 && selectFlag == 1 && (orderDetailInfo.orderSecondState == 12 || orderDetailInfo.orderSecondState == 14)">
			<view class="btn internalBtn" v-if="testListAry.length > 0 && (orderDetailInfo.orderSecondState == 12 || orderDetailInfo.orderSecondState == 14)" @click="openConfirmPopup()">取消用车</view>
			<view class="btn externalBtn" v-if="testListAry.length > 0 && (orderDetailInfo.orderSecondState == 12 || orderDetailInfo.orderSecondState == 14)" @click="toUseCar()">确认用车</view>
		</view>
		
		<!-- 弹窗模块 -->
		<!-- 订单信息确认弹出框 -->
		<uni-popup ref="confirmPopup" type="center">
			<view class="hintBox">
				<view class="title">您已选中{{showCheckedNum()}}单，确定取消用车吗？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @click="confirmToCancel()">取消用车</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @click="closeConfirmPopup()">继续用车</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="confirmUsePopup" type="center">
			<view class="hintBox">
				<view class="title">您已选中{{showCheckedNum()}}单，确定确认用车吗？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @click="closeUseCarPopup()">取消</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @click="confirmUserCar()">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<view class="popup-box" v-if="isShare">
			<view class="black-box"></view>
			<view class="popup-content">
				<view class="popup-head">分享到</view>
				<view class="popup-row">
					<view class="popup-child" @click="shareEvent('WXSceneSession')">
						<image class="popup-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/weChat.png"
							mode="">
						</image>
						<view class="">微信好友</view>
					</view>
					<view class="popup-child" @click="shareEvent('WXSenceTimeline')">
						<image class="popup-img"
							src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/circleFriends.png" mode="">
						</image>
						<view class="">朋友圈</view>
					</view>
				</view>
				<view class="cancel-btn" @click="cancelShare">取消</view>
			</view>
		</view>
		
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
								<text class="msg" :style="selectedCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{item.name}}</text>
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
				selectFlag: 1,
				orderDetailInfo: {},
				orderChild: {},
				cargoChild: {},
				goodsTypeVO: [],
				sid: '',
				countdownTime: '',
				interval: '',
				orderStateHintMsg: '截止报价时间',
				isSendCar: false,
				allListChecked: false,
				testListAry: [], 
				loadAddress: [], // 装货地址
				unLoadAddress: [], // 卸货地址
				// webView: '',
				showMenu: false,
				isShare: false,
				goodsListData: '',
				selectBoxSticky: '',
				dateBoxSticky: '',
				listSticky: '',
				scrollTopHeight: '',
				recommendedList: [],
				userInfo: {},
				generatedTime: '', // 推荐时间
				showSourceLoading: false,
				hasLoadSource: false,
				noData: false,
				sourceParams: {}, // 智能推荐请求参数
				recommendedNumObj: {}, // 推荐次数及套餐相关
				searchfreenum: {}, // 免费推荐次数
				couponAccountType: {}, // 推荐充值单价
				rspMsg: '',
				myFleetData: [], // 我的车队
				userInfoName: '',
				smsObj: {
					amount: 0,
					noteVOS: [],
				},
				useCarTime: [],
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
				
				provinceArr: [],
				cityArr: [],
				selectedProvinceIndex: 0,
				selectedCityIndex: -1,
				popupDetails: 1,
				popupCityParams: {},
				selectCityParams: {},
				fleetBaseInfo: 0,
			}
		},
		onLoad(option) {
			getApp().globalData.sendOrder = {};
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			console.log('用户信息', this.userInfo);
			this.sid = option.sid;
			console.log('货源id', this.sid);
			// this.webView = this.$scope.$getAppWebview();
			uni.showLoading({
				title: '加载中'
			});
			this.getTimeConfData();
			this.getListRecord();
			// uni.$on("refreshData_index", (data) => {
			// 	console.log('数据刷新');
			// 	this.getListRecord();
			// });
			uni.$on("refreshData_orderDetails", (data) => {
				this.getListRecord();
			});
			uni.$on("smsSendSuccess", (data) => {
				this.openRspMsgPopup('群发短信成功～');
			});
			uni.$on("getNewCarSource", (data) => {
				this.getNewSourceInfo(1);
			});
			uni.$on("signleTopupDone", (data) => {
				this.openRspMsgPopup('充值成功～', 1);
			});
			this.getProvince();
			this.getMealBaseList(); // 会员套餐
		},
		onShow() {
			longEvent(this, () => {});
			var app = getApp();
			let that = this;
			app.globalData.consignorSocketTask.onMessage((res) => {
				console.log("收到服务器内容：" + res.data);
				let data = res.data;
				if(data.length > 10) {
					data = JSON.parse(data);
					if(data.business_type == 'order_message') {
						data.msgContent = JSON.parse(data.msgContent);
						console.log(data);
						if (data.msgContent.userType == "货主") {
							if(data.msgContent.orderSid == that.sid) {
								that.getListRecord(that.sid);
							}
						}
					}
				}
			});
		},
		onReady() {
			
			// this.$refs.noRecommendedNumPopup.open();
		},
		onPageScroll : function(e) {
			// 当滑动距离达到一定数值时动态修改模块样式，并调整列表与顶部的距离
			if(e.scrollTop > this.scrollTopHeight) {
				this.selectBoxSticky = 'position: fixed;top: 0;z-index: 100;background-color:#F3F3F3;transition: all 0.2s;';
				this.dateBoxSticky = 'position: fixed;top: 98rpx;z-index: 100;background-color:#FFF';
				this.listSticky = 'padding-top:236rpx;';
			}else {
				this.selectBoxSticky = '';
				this.dateBoxSticky = '';
				this.listSticky = '';
			}
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getListRecord();
		},
		onReachBottom() { // 上拉加载
			if(this.noData || this.noMore || this.isLoading) {
				return false;
			}
			this.toLoadCarInfo();
		},
		computed: {},
		onNavigationBarButtonTap(e) {
			console.log(e);
			this.showMenu = !this.showMenu;
		},
		methods: {
			timeOperation(startTime, timeVal, nowTime) { // 倒计时
				// console.log(startTime);
				var finishDate = new Date(startTime);
				var nowDate = new Date(nowTime);
				var dateDiff = finishDate - nowDate;//时间差的毫秒数
				// console.log(dateDiff);
				var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
				var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
				var hours=Math.floor(leave1/(3600*1000))//计算出小时数
				//计算相差分钟数
				var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
				var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
				//计算相差秒数
				var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
				var seconds=Math.round(leave3/1000)
				
				var leave4=leave3%(60*1000)      //计算分钟数后剩余的毫秒数
				var timeFn = "耗时："+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒";
				console.log(timeFn);
				this.showTime(hours, minutes, seconds, dayDiff);
			},
			showTime(hours, minutes, seconds, dayDiff){ // 倒计时，换算成秒
				// console.log(minutes, seconds);
				var time = (Number(dayDiff) * 24 * 3600) + (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
				console.log('倒计时总数', time);
				let that = this;
				if(time < 1) {
					that.countdownTime = '0 : 0';
					return false
				}
				that.interval = setInterval(function(){
					time = time - 1;
					var days = parseInt(time / 60 / 60 / 24);
					var hour = parseInt(time / 60 / 60 % 24);
					var minute = parseInt(time / 60 % 60);
					var second = parseInt(time % 60);
					if(minute == 0 && second == 0) {
						clearInterval(that.interval);
						// that.getListRecord();
						// return false;
						that.countdownTime = '';
						that.orderStateHintMsg = '系统统计报价中';
						return false;
					}
					if(hour > 0 && hour < 10) {
						hour = '0' + hour;
					}
					if(minute > 0 && minute < 10) {
						minute = '0' + minute;
					}
					if(second > 0 && second < 10) {
						second = '0' + second;
					}
					that.countdownTime = days + '天 ' + hour + ' : ' + minute + ' : ' + second;
				},1000);
				that.$forceUpdate();
			},
			getSourceInfo(flag) { // 获取已推荐列表
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
					console.log('推荐列表', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody;
						if(rspBody.carSourceVOS && rspBody.carSourceVOS.length > 0) {
							// for(let i in rspBody.carSourceVOS) {
							// 	rspBody.carSourceVOS[i].checked = false;
							// }
							// that.recommendedList = rspBody.carSourceVOS;
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
				console.log(items, 'asasa');
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
				console.log(this.allCarSourceList);
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
			getSearchfreenum() { // 根据免费次数做不同的操作
				// 有免费次数则获取最新推荐数据，没有没费次数则弹出去充值弹窗
				if(
					this.orderDetailInfo.orderSecondState != 11 &&
					this.orderDetailInfo.orderSecondState != 12 &&
					this.orderDetailInfo.orderSecondState != 13 &&
					this.orderDetailInfo.orderSecondState != 14 &&
					this.orderDetailInfo.orderSecondState != 16
				) {
					uni.showToast({
						title: '本功能仅限发布中的货源使用',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.orderDetailInfo.orderSecondState == 16 && (this.orderDetailInfo.multiTruck == 1 || !this.orderDetailInfo.multiTruck)) {
					uni.showToast({
						title: '本功能仅限发布中的货源使用',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.orderDetailInfo.fleetSids) {
					uni.showToast({
						title: '本功能仅限全平台发布的货源使用',
						icon: 'none',
						duration: 3000
					})
					return false;
				}else {
					// if(Number(this.searchfreenum.nowsurnum) > 0) {
					// 	this.getNewSourceInfo();
					// }else {
					// 	this.$refs.noRecommendedNumPopup.open();
					// }
					this.getNewSourceInfo();
				}
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
					console.log('推荐列表', res);
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
			jumpToUserMember() { // 跳转会员列表
				this.$refs.noSourceNumPopup.close();
				this.$refs.noFleetNumPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage?pageName=sourceIndex'
				})
			},
			showTotalExit(item) {
				var amount = item.quotePrice/100 || 0;
				if(!this.orderDetailInfo.fleetSids) {
					var vaShortLandedPrice = this.orderDetailInfo.vaShortLandedPrice/100 || 0;
					var cargoDamagePrice = this.orderChild.orderValueAddedVOS.cargoDamagePrice/100 || 0;
					return (amount + vaShortLandedPrice + cargoDamagePrice).toFixed(2);
				}else {
					return amount.toFixed(2);
				}
			},
			checkAllList() {
				this.allListChecked = !this.allListChecked;
				for(let i in this.testListAry) {
					this.testListAry[i].flag = this.allListChecked;
				}
			},
			checkList(item, key) {
				// console.log(item, key);
				this.testListAry[key + ''].flag = !this.testListAry[key + ''].flag;
				let checked = this.showCheckedNum();
				if(checked == this.testListAry.length) {
					this.allListChecked = true;
				}else {
					this.allListChecked = false;
				} 
				this.$forceUpdate();
			},
			showAllMsg(item, key, flag) {
				this.testListAry[key].showAll = flag;
				this.$forceUpdate();
			},
			showCheckedNum() {
				let num = 0;
				for(let n in this.testListAry) {
					if(this.testListAry[n].flag) {
						num = num + 1;
					}
				}
				return num;
			},
			getTimeConfData() { // 确认用车时长配置
				let that = this;
				utils.postRequest('/ts/timeConf/list',)
				.then(res=>{
					// console.log('用车时长配置', res);
					if(res.retCode == '0000000') {
						let ary = res.rspBody.items;
						that.useCarTime = ary['0'].duration;
						// console.log('用车时长', that.useCarTime);
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			getSelectorQuery() {
				let that = this;
				var query = uni.createSelectorQuery().in(this);
				query.select('#listSelect').boundingClientRect(data => {
				  console.log("节点信息" + data);
				  console.log("节点离页面顶部的距离为" + data.top);
					that.scrollTopHeight = data.top
				}).exec();
			},
			getListRecord(indexOrderSid) {
				uni.showLoading({
					title: '加载中'
				});
				let that = this;
				clearInterval(that.interval);
				let params = {
					sid: that.sid
				}
				console.log('询价详情查询参数', params);
				utils.newQueryPostRequest('/td/order/findListRecord', params)
				.then(res=>{
					console.log('询价详情', res);
					if(res.retCode == '0000000') {
						that.allListChecked = false;
						that.orderDetailInfo = res.rspBody;
						
						if(that.orderDetailInfo.wbNote) {
							that.orderDetailInfo.wbNote = that.orderDetailInfo.wbNote.replace(/\//g, '');
							that.orderDetailInfo.wbNote = JSON.parse(that.orderDetailInfo.wbNote);
							// console.log(that.orderDetailInfo.wbNote);
						}
						that.cargoChild = that.orderDetailInfo.cargoChild;
						that.goodsTypeVO = that.orderDetailInfo.cargoChild.goodsTypeVO;
						// console.log('货物详情', that.goodsTypeVO);
						that.orderChild = that.orderDetailInfo.orderChild;
						let orderContactsVOS = that.orderChild.orderContactsVOS;
						let orderAddressVOS = that.orderChild.orderAddressVOS;
						that.testListAry = [];
						let quotationSid = that.orderDetailInfo.orderDriverBidVOS ? that.orderDetailInfo.orderDriverBidVOS : [];
						if(quotationSid && quotationSid.length > 0) {
							for(let t in quotationSid) {
								quotationSid[t].flag = false;
								quotationSid[t].showAll = false;
								let obj = quotationSid[t];
								that.testListAry.push(obj);
							}
						}
						// console.log(that.testListAry);
						if(indexOrderSid) {
							uni.$emit('refreshData_index')
						}
						console.log('封装智能推荐请求参数');
						// 智能推荐请求参数
						let carModels = [];
						let orderVehicleModelVOS = that.orderChild.orderVehicleModelVOS;
						for(let m in orderVehicleModelVOS) {
							carModels.push(orderVehicleModelVOS[m].vehicleModel);
						}
						let carLengths = [];
						let orderVehicleLengthVOs = that.orderChild.orderVehicleLengthVOs;
						for(let l in orderVehicleLengthVOs) {
							carLengths.push(orderVehicleLengthVOs[l].vehicleLength + '');
						}
						let senderCode = '';
						let sendObj = orderAddressVOS['0'];
						if(sendObj.provinceCode == '310000' || sendObj.provinceCode == '110000' || sendObj.provinceCode == '500000' || sendObj.provinceCode == '120000') {
							senderCode = sendObj.areaCode;
						}else {
							senderCode = sendObj.cityCode;
						}
						let receiverCode = '';
						let receiverObj = orderAddressVOS[orderAddressVOS.length - 1]
						if(receiverObj.provinceCode == '310000' || receiverObj.provinceCode == '110000' || receiverObj.provinceCode == '500000' || receiverObj.provinceCode == '120000') {
							receiverCode = receiverObj.areaCode;
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
						if(
							that.orderDetailInfo.orderSecondState == 11 ||
							that.orderDetailInfo.orderSecondState == 12 ||
							that.orderDetailInfo.orderSecondState == 13 ||
							that.orderDetailInfo.orderSecondState == 14
							 // ||that.orderDetailInfo.orderSecondState == 16
						) {
							that.getSourceInfo(); // 获取已推荐列表
						}else {
							that.recommendedList = [];
						}
						if(that.orderDetailInfo.fixPriceFlag != '1') {
							if(that.orderDetailInfo.orderSecondState == 11 || that.orderDetailInfo.orderSecondState == 12 || that.orderDetailInfo.orderSecondState == 13) {
								let startTime = that.orderDetailInfo.orderSecondState == 11 || that.orderDetailInfo.orderSecondState == 13 ? that.orderChild.orderQuoteVO.quotePriceFinishDt : that.orderDetailInfo.orderDriverBidVOS['0'].quotePriceFinishDt;
								let systemTime = that.orderDetailInfo.systemTime;
								var platform = uni.getSystemInfoSync().platform;
								if (platform == "ios") { // 低版本的Safari无法解析new Date('XXXX-XX-XX')，但可以解析new Date('XXXX/XX/XX')格式的时间所以需要把“-”替换为“/”。
									startTime = startTime.replace(/-/g, '/');
									systemTime = systemTime.replace(/-/g, '/');
								}
								// console.log('startTime', startTime);
								let timeVal =  that.orderDetailInfo.orderSecondState == 11 || that.orderDetailInfo.orderSecondState == 13 ? that.orderChild.orderQuoteVO.quotePriceTime : that.useCarTime;
								that.timeOperation(startTime, timeVal, systemTime);
							}
						}
						that.timer = null;
						that.timer = setTimeout(() => {
						    that.getSelectorQuery();
						}, 1000)
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
			toUseCar() { // 确认用车
				if(this.isSendCar) return false;
				if(this.showCheckedNum() == 0) {
					uni.showToast({
						title: '请选择报价单',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				this.$refs.confirmUsePopup.open()
			},
			closeUseCarPopup() { // 关闭确认用车弹窗
				this.$refs.confirmUsePopup.close()
			},
			confirmUserCar() { // 确认用车
				if(this.isSendCar) return false;
				this.isSendCar = true;
				this.$refs.confirmUsePopup.close();
				let quotationsid = [];
				for(let i in this.testListAry) {
					if(this.testListAry[i].flag) {
						quotationsid.push(this.testListAry[i].sid)
					}
				}
				let that = this;
				let params = {
					sid: that.sid,
					quotationSid: quotationsid.toString(),
				}
				console.log('确认用车参数', params);
				utils.postRequest('/td/order/agreeBj', params)
				.then(res=>{
					console.log('确认用车结果', res);
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '确认用车成功！',
							icon: 'none',
							duration: 2000
						})
						setTimeout(() => {
							that.getListRecord();
							that.isSendCar = false;
							that.$forceUpdate();
						}, 2000);
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
						that.isSendCar = false;
						uni.hideLoading();
					}
				})
				.catch(err=>{
					that.isSendCar = false;
					console.log('确认用车失败', err);
					uni.hideLoading();
				})
			},
			confirmToCancel() { // 取消用车
				if(!utils.btnRepeat()) return false; // 防抖
				this.$refs.confirmPopup.close()
				uni.showLoading({
					title: '加载中'
				});
				let driverSid = [];
				for(let i in this.testListAry) {
					if(this.testListAry[i].flag) {
						driverSid.push(this.testListAry[i].sid)
					}
				}
				let that = this;
				let params = {
					sid: that.sid,
					quotationSid: driverSid.toString(),
				}
				console.log('取消用车参数', params);
				utils.postRequest('/td/order/cancelBj', params)
				.then(res=>{
					console.log('取消用车结果', res);
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '取消用车成功！',
							icon: 'none',
							duration: 2000
						})
						setTimeout(() => {
							that.getListRecord();
						}, 2000);
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
					console.log('取消用车失败', err);
					uni.hideLoading();
				})
			},
			changeCommonState() { // 存为常发货源
				if(!utils.btnRepeat()) return false; // 防抖
				if(this.orderDetailInfo.commonUseState == 1) return false;
				let params = {
					sid: this.orderDetailInfo.sid,
					commonUseState: 1,
				}
				let that = this;
				utils.postRequest('/td/order/commonUseState', params)
				.then(function (res) {
					console.log('保存常发结果', res);
					if(res.retCode == '0000000'){
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						that.orderDetailInfo.commonUseState = 1;
						uni.$emit("refreshData_commonlyUsed");
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
				})
			},
			getDistance(lat, lng) {
			  // 获取距离公里数
			  return service.newGetDistance(lat, lng);
			},
			
			showOrderStatusBc(flag) { // 根据不同的订单状态展示不同的头部颜色
				if(flag == 18) {
					return 'background: linear-gradient(-180deg, #AAAAAA 0%, #777777 100%);';
				}else {
					return 'background: linear-gradient(-180deg, #74C1FD 0%, #4AA2F3 100%);';
				}
			},
			showOrderStatus(status) { // 展示订单状态1询价中,  2已报价, 3已成交， 4、货主未点击同意，5没有报价，6货主取消
				switch(status) {
					case 11:
						return '待接单';
					case 12:
						return '已接单';
					case 13:
						return '询价中' ;
					case 14:
						return '已报价' ;
					case 15:
						return '已下架' ;
					case 16:
						return '已成交' ;
					case 17:
						return '未成交';
					case 18:
						return '未成交';
					case 19:
						return '待发布' ;
					default:
						return '未成交' ;
				}
			},
			showDriverVehicle(vehicle) { // 隐藏车牌号
				if(!vehicle) return '';
				if(this.orderDetailInfo.orderSecondState == 16) {
					return vehicle;
				}else {
					return vehicle.substr(0, 2) + '****';
				}
			},
			showDriverName(name) { // 司机姓名
				if(!name) return '';
				if(this.orderDetailInfo.orderSecondState == 16) {
					return name;
				}else {
					return name.substr(0, 1) + '师傅';
				}
			},
			showDriverCar(note) { // 展示司机车型车场
				let obj = JSON.parse(note);
				return obj.ext2 + '米' + ' ' + obj.ext1;
			},
			openConfirmPopup() { // 打开确认取消的弹出框
				if(!utils.btnRepeat()) return false; // 防抖
				if(this.showCheckedNum() == 0) {
					uni.showToast({
						title: '请选择报价单',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				this.$refs.confirmPopup.open()
			},
			closeConfirmPopup() { // 关闭确认取消的弹出框
				this.$refs.confirmPopup.close()
			},
			goSupplyDetails() { //查看货源详情
				uni.navigateTo({
					url: './orderGoods?sid=' + this.sid + '&multiTruck=' + this.orderDetailInfo.multiTruck
				})
			},
			showAddressMsg(item) {
				if(item.areaCode == item.cityCode) {
					return item.province +item.area;
				}else {
					return item.province + item.city +item.area;
				}
			},
			call(mobile) {
				console.log(mobile);
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
				publicData.addBuried("智能推荐拨打司机电话")
			},
			showPriceItem(price1, price2) {
				let priceNum = (price1 ? Number(price1) : 0) + (price2 ? Number(price2) : 0);
				console.log(priceNum);
				if(!priceNum) {
					return 0;
				}
				return (priceNum / 100).toFixed(2);
			},
			closeOrder() { // 关闭货源
				if(!utils.btnRepeat()) return false; // 防抖
				this.showMenu = false;
				if(this.testListAry.length > 0) {
					uni.showToast({
						title: '请将报价单处理完后再下架货源！',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				uni.showLoading({
					title: '加载中'
				});
				let that = this;
				let params = {
					sid: that.sid
				}
				utils.postRequest('/td/order/undercarriage', params)
				.then(res=>{
					console.log('订单取消', res);
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '下架货源成功！',
							icon: 'none',
							duration: 2000
						})
						uni.$emit("cancel_index");
						uni.navigateBack();
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
			},
			jumpToAssignedDriver() { // 跳转指派
				getApp().globalData.assignedDriverObj = '';
				uni.navigateTo({
					url: './assignedDetails?needInvoiceFlag=' + this.orderDetailInfo.needInvoiceFlag + '&orderNumber=' + this.orderDetailInfo.sid + '&multiTruck=' + this.orderDetailInfo.multiTruck
				})
			},
			newShowAddressMsg(flag, item) { // 展示地址
				let addressObj = {};
				let addAry = [];
				for(let i in item.orderChild.orderAddressVOS) {
					addAry.push(item.orderChild.orderAddressVOS[i]);
				}
				switch(flag) {
					case 'fir':
						addressObj = addAry['0'];
						// console.log('装货点', addressObj);
						break;
					case 'sec':
						addressObj = addAry[addAry.length - 1];
						// console.log('卸货点', addressObj);
						break;
				}
				if(addressObj && addressObj.cityCode && addressObj.cityCode == addressObj.areaCode) {
					return addressObj.province + '-' + addressObj.area;
				}else {
					return addressObj.province + '-' + addressObj.city + '-' + addressObj.area;
				}
			},
			showNewGoodsMsg() { // 展示货物信息
				let msg = '';
				let cargoChild = this.orderDetailInfo.cargoChild;
				let goodsTypeVO = this.orderDetailInfo.cargoChild.goodsTypeVO;
				let cargoUnit = this.orderDetailInfo.cargoUnit || '吨';
				let multiTruck = this.orderDetailInfo.multiTruck ? this.orderDetailInfo.multiTruck + '车' : '单车';
				msg = goodsTypeVO['0'].typeName + '-' + goodsTypeVO['0'].children['0'].children['0'].children['0'].typeName;
				msg = cargoChild.weight ? msg + ' ' + cargoChild.weight + cargoUnit : msg;
				msg = cargoChild.volume ? msg + ' ' + cargoChild.volume + '方' : msg;
				msg = msg + ' ' + multiTruck;
				msg = this.orderDetailInfo.fleetSids ? msg + ' ' + '车队发布' : msg + ' ' + '全平台发布';
				return msg;
			},
			generate() {
				this.isShare = true;
			},
			// 取消分享
			cancelShare() {
				this.isShare = false;
			},
			// 分享到微信好友或者朋友圈
			shareEvent(type) {
				var that = this;
				that.isShare = false;
				var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				console.log(userInfo);
				var token = userInfo.attrs.token;
				let userCode = userInfo.attrs.userCode;
				// 微信好友
				let summary = that.goodsListData;
				if (that.orderDetailInfo.fixPriceFlag == '1') {
					if(that.orderDetailInfo.fixPrice){
						summary = summary + that.orderDetailInfo.fixPrice / 100 + '元/' + that.orderChild.orderQuoteVO.quotePriceTypeName
					}
				} else {
					// summary = summary + '按' + that.orderQuoteVO.quotePriceTypeName + '询价'
					summary = summary + ', 询价货源'
				}
				var api = '';
				var shareUrl = ""
				if(utils.ApiRootUrl.indexOf('test')>-1){
					api = 'test'
					shareUrl = "http://m.hyzgapp.com/#/testShare?sid="
				} else {
					api = 'pord'
					shareUrl = "http://m.hyzgapp.com/#/share?sid="
				}
				uni.getLocation({
					geocode: true,
					success: function(res) {
						console.log(res, '定位地址');
						var longitude = (res.longitude).toFixed(6)
						var latitude = (res.latitude).toFixed(6)
						var supply = 1;
						console.log(that.orderDetailInfo)
						if(that.orderDetailInfo.fleetSids){
							let checkedCarGroup = [];
							checkedCarGroup = JSON.parse(that.orderDetailInfo.fleetSids);
							if(checkedCarGroup.length > 0) {
								supply = 2
							}
						}
						console.log("http://m.hyzgapp.com/#/share?sid=" + that.sid + "&token=" + token + '&api=' + api + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode);
						uni.share({
							provider: "weixin",
							scene: type,
							type: 0,
							href: shareUrl + that.sid + "&supply=" + supply +"&multiTruck=" + that.orderDetailInfo.multiTruck + "&token=" + token + '&api=' + api + '&longitude=' + longitude + '&latitude=' + latitude + "&userCode=" + userCode, //
							title: "从  "+ that.showAddressMsg(that.orderChild.orderAddressVOS[0], 'area') + '  到  ' + that.showAddressMsg(that
								.orderChild
								.orderAddressVOS[that.orderChild.orderAddressVOS.length - 1], 'area'),
							summary: summary,
							imageUrl: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/share_image.png",
							success: function(res) {
								console.log("success:" + JSON.stringify(res));
							},
							fail: function(err) {
								console.log("fail:" + JSON.stringify(err));
							}
						});
					},
					fail: function(res) {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
					}
				})
			},
			showGoodsMsg() { // 展示货物信息
				let ary = this.cargoChild.goodsTypeVO;
				// console.log(ary);
				let goodsTypeName = [];
				if (ary && ary.length > 0) {
					for (let i in ary) {
						let typeName = ary[i].children['0'].children['0'].children['0'].typeName;
						typeName = ary[i].typeName + '-' + typeName;
						goodsTypeName.push(typeName)
					}
					// console.log(goodsTypeName);
					let newAry = Array.from(new Set(goodsTypeName));
					// console.log(newAry);
					for (let i in newAry) {
						this.goodsListData = this.goodsListData + newAry[i] + '/';
					}
					this.goodsListData = this.goodsListData.slice(0, this.goodsListData.length - 1);
					if (this.cargoChild.weight) {
						
						var cargoUnit = this.orderDetailInfo.cargoUnit || '吨'
						this.goodsListData = this.goodsListData + ',' + this.cargoChild.weight + cargoUnit;
					}
					if (this.cargoChild.volume) {
						this.goodsListData = this.goodsListData + ',' + this.cargoChild.volume + '方';
					}
				}
			},
			openRspMsgPopup(msg, repeatFlag) {
				console.log('短信发送成功');
				if(!repeatFlag) {
					for(let c in this.recommendedList) {
						this.recommendedList[c].checked = false;
					}
				}
				
				this.rspMsg = msg;
				this.$refs.mainRspMsgPopup.open();
				setTimeout(()=>{
					this.$refs.mainRspMsgPopup.close();
				},3000)
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
			call(item) {
				console.log(item.driverPhone);
				this.carSourceInteraction(item);
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
					publicData.addBuried("智能推荐拨打司机电话")
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
			floatMul(arg1,arg2)   {     
			    var m=0,s1=arg1.toString(),s2=arg2.toString();     
			    try{m+=s1.split(".")[1].length}catch(e){}     
			    try{m+=s2.split(".")[1].length}catch(e){}     
			    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);     
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
				if(this.goEasy.getConnectionStatus() == 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
					uni.hideLoading();
					this.sendCustomMessage(item.userCode, avatar, userName, item.userId);
				}else {
					uni.hideLoading();
					this.sendCustomMessage(item.userCode, avatar, userName, item.userId);
					
				}
			},
			sendCustomMessage(userCode, avatar, userName, userId) {
				var im = this.goEasy.im;
				//创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
				var customMessage = im.createCustomMessage({
				    type:'order',  //字符串，可以任意自定义类型，比如红包'hongbao', 订单'order，处方'chufang'
				    payload: this.orderDetailInfo,
				    to : {
				        type : this.GoEasy.IM_SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
						id : userCode,
				        data:{"avatar": avatar, "name": userName, "userId": userId} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
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
			hasOrdereEffective() { // 是否有效货源
				if(
					this.orderDetailInfo.orderSecondState == 11 ||
					this.orderDetailInfo.orderSecondState == 12 ||
					this.orderDetailInfo.orderSecondState == 13 ||
					this.orderDetailInfo.orderSecondState == 14
					 // ||this.orderDetailInfo.orderSecondState == 16
				) {
					return true;
				}else {
					return false;
				}
			},
			driverMap(item) {
			    //跳转司机定位
			    let that = this;
			    // var userCode = item.userCode;
			    //司机定位
			  //   uni.navigateTo({
					// url: '/pages/ship/carSource/driverMap?userCode=' + userCode
			  //   })
				uni.navigateTo({
					url: '/pages/ship/carSource/driverMap?driverDetail=' + JSON.stringify(item)
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
					url: '../smsTopUp?typeNum=54'
				})
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
								that.recommendedList.checkStatus = 1;
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
			copyOrderNumber(text) { //复制货源号
				uni.setClipboardData({
					data: text,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			},
			showSelectPopup() { // 打开筛选弹窗
				this.$refs.sourceSelectPopup.open();
			},
			getProvince() { // 从本地缓存获取省市区数据，本地缓存没有则从接口获取，再存入缓存
				var provinceLocal = uni.getStorageSync("regionData");
				if(provinceLocal) {
					this.provinceArr = provinceLocal;
					this.pushDiyCityItem(this.provinceArr[0].code, 0);
				}else {
					let that = this;
					utils.postRequest('/ts/nationDict/getBasicData')
					.then(res => {
						if (res.retCode == "0000000") {
							var provinceArr = res.rspBody;
							that.provinceArr = provinceArr;
							that.pushDiyCityItem(provinceArr[0].code, 0);
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
			pushDiyCityItem(provinceCode, index) { // 根据传入的省或市code判断塞入 全市/全省
				var cities = this.provinceArr[index].cities;
				if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
					var coties = [{
						name: '全市',
						code: provinceCode
					}, ...cities]
				} else {
					var coties = [{
						name: '全省',
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
				this.pushDiyCityItem(provinceCode, index);
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
					this.selectedProvinceIndex = 0;
					this.selectedCityIndex = -1;
					this.pushDiyCityItem(this.provinceArr[0].code, 0);
					this.popupCityParams = {};
				}
			},
			toSelectSouce() { // 保存省市区数据
				if(this.selectedCityIndex == -1) {
					this.selectCityParams = {};
				}else {
					let code = this.cityArr[this.selectedCityIndex].code;
					let name = '';
					switch (code) {
						case '310000':
							name = '上海市';
							break;
						case '110000':
							name = '北京市';
							break;
						case '500000':
							name = '重庆市';
							break;
						case '120000':
							name = '天津市';
							break;
						default:
							name = this.cityArr[this.selectedCityIndex].name;
							break;
					}
					this.selectCityParams = {
						code: this.cityArr[this.selectedCityIndex].code,
						name: name,
					}
				}
				this.$refs.sourceSelectPopup.close();
				this.noData = false;
				this.showSourceLoading = true;
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
			showSenderAddr(str) {
				return str.substr(0, 2);
			},
			showReceiverAddr(str) {
				return str.substr(0, 2);
			},
			showSelectAddr(str) {
				return str.substr(0, 6);
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
			showListSelect() {
				if(this.selectFlag == 2) {
					if(this.recommendedList && this.recommendedList.length > 0) {
						return true;
					}else if(this.hasLoadSource && this.noData) {
						return true;
					}else {
						return false;
					}
					
				}else {
					return false;
				}
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
							console.log(index, that.recommendedList[index].isCollect);
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
								that.recommendedList[index].checkStatus = 1;
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
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.uni-page-head-ft {
		display: none !important;
	}
	
	.manyCarsDetail {
		padding-top: 28rpx;
		padding-bottom:238rpx;
		.headMenuBox {
			width: 205rpx;
			background: #333744;
			padding: 26rpx;
			position: absolute;
			right:16rpx;
			top:0;
			border-radius: 12rpx;
			.menuBtn {
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 44rpx;
				text-align: center;
			}
		}
		.msgIcon {
			margin-left: 32rpx;
			height: 40rpx;
			width: 40rpx;
		}
		.orderListBox {
			padding-top: 30rpx;
			.orderHead {
				border-radius:  24rpx 24rpx 0 0;
				padding: 0 40rpx;
				margin: 0 auto;
				width: 578rpx;
				height: 62rpx;
				line-height: 62rpx;
				box-sizing: border-box;
				background: #FEF8E3;
				text-align: center;
				font-size: 28rpx;
				color: #EF8732;
			}
			.newOrderBody {
				margin: 0 36rpx;
				background: #FFFFFF;
				box-shadow: 0px 0px 26rpx 2rpx rgba(140,186,255,0.25);
				border-radius: 24rpx;
				padding: 32rpx 16rpx 28rpx 16rpx;
				.addressModel {
					display: flex;
					align-items: center;
					.addressMsg {
						flex: 1;
						font-size: 30rpx;
						font-weight: 500;
						color: #333333;
						line-height: 44rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
					}
					.addressIcon {
						flex-shrink: 0;
						margin: 0 10rpx;
						width: 24rpx;
						height: 24rpx;
						display: block;
					}
				}
				.goodsModel {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 40rpx;
					.goodsDetails {
						padding: 0 18rpx;
						height: 50rpx;
						line-height: 50rpx;
						background: #FEF8E3;
						border-radius: 50rpx;
						font-size: 26rpx;
						font-weight: 500;
						color: #EF8732;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
					}
					.showMoreBtn {
						flex-shrink: 0;
						display: flex;
						align-items: center;
						margin-left: 10rpx;
						.msg {
							font-size: 28rpx;
							color: #666666;
							line-height: 44rpx;
						}
						.rightIcon {
							width: 18rpx;
							height: 18rpx;
							display: block;
							margin-left: 6rpx;
						}
					}
				}
				.orderNumberBox {
					margin-top: 10rpx;
					display: flex;
					align-items: center;
					.num {
						font-size: 24rpx;
						color: #666666;
						line-height: 44rpx;
					}
					.copyIcon {
						width: 22rpx;
						height: 22rpx;
						display: block;
						margin-left: 4rpx;
					}
				}
				.operationModel {
					margin-top: 44rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.operationBtn + .operationBtn {
						margin-left: 68rpx;
					}
					.operationBtn {
						width: 202rpx;
						height: 60rpx;
						border-radius: 8rpx;
						opacity: 1;
						border: 2rpx solid #2B72F0;
						line-height: 60rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #2B72F0;
						text-align: center;
					}
				}
			}
			.shareBox {
				margin: 12rpx 38rpx 0 42rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.title {
					font-size: 36rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
				}
				.msgBox {
					display: flex;
					align-items: center;
					.shareIcon {
						display: block;
						width: 28rpx;
						height: 28rpx;
						margin-right: 10rpx;
					}
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #558DF2;
						line-height: 44rpx;
					}
				}
			}
			.orderBody {
				margin: 0 36rpx;
				background: #FFFFFF;
				box-shadow: 0px 0px 26rpx 2rpx rgba(140,186,255,0.25);
				border-radius: 24rpx;
				.orderDriverBox {
					padding:24rpx 0;
					margin: 0 0 0 24rpx;
					.boxTitle {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-right: 24rpx;
						.title {
							font-size: 32rpx;
							font-weight: bold;
							color: #222222;
						}
						.orderNum {
							font-size: 24rpx;
							color: #222222;
						}
					}
					.addressMsgBox {
						.orderAddressBox {
							.commonStateBox {
								height: 50rpx;
								display: flex;
								align-items: center;
								margin: -10rpx 0;
								.commonStateLine {
									flex: 1;
									height: 2rpx;
									background-color: #F2F3F3;
									margin-right:16rpx;
									margin-left: 58rpx;
								}
								.commonBtn {
									height: 46rpx;
									line-height: 46rpx;
									border-radius: 48rpx 0 0 48rpx;
									width: 130rpx;
									border-top: 2rpx solid #4AA2F3;
									border-bottom: 2rpx solid #4AA2F3;
									border-left: 2rpx solid #4AA2F3;
									font-size: 24rpx;
									color: #4AA2F3;
									text-align: center;
								}
								.defaultCommon {
									height: 50rpx;
									line-height: 50rpx;
									border-radius: 48rpx 0 0 48rpx;
									width: 132rpx;
									background-color: #4AA2F3;
									font-size: 24rpx;
									color: #FFF;
									text-align: center;
								}
							}
							.addressModel {
								width: 656rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								padding-right: 24rpx;
								.addressType {
									width: 40rpx;
									height: 40rpx;
									line-height: 40rpx;
									border-radius: 12rpx;
									font-size: 28rpx;
									font-weight: 500;
									color: #FFFFFF;
									margin-right:18rpx;
									text-align: center;
								}
								.addressDetails {
									flex: 1;
									padding: 26rpx 0;
									.addressMsg {
										.nameBox {
											display: flex;
											align-items: center;
											// .name {
											// 	width:150rpx;
											// }
											// .tel {
											// 	flex: 1;
											// }
											.msg + .msg {
												margin-left:32rpx;
											}
											.msg {
												font-size: 30rpx;
												font-weight: bold;
												color: #222222;
											}
										}
										.address {
											margin-top:28rpx;
											line-height: 36rpx;
											font-size: 26rpx;
											color: #777777;
										}
									}
								}
							}
						}
						.goodsMsgBox {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.goodsMsgSyb {
								display: flex;
								align-items: center;
								flex-wrap: wrap;
								flex: 1;
								.sybList {
									padding: 0 20rpx;
									border-radius: 12rpx;
									border: 1rpx solid rgba(127, 127, 127, 0.5);
									height: 36rpx;
									line-height: 36rpx;
									margin-left:24rpx;
									font-size: 22rpx;
									color: #333333;
									margin-top: 12rpx;
								}
							}
							.goodsDetailsBtn {
								display: flex;
								align-items: center;
								font-size: 22rpx;
								color: #777777;
								flex-shrink: 0;
									margin-top: 12rpx;
								.goodsDetailsBtnIcon {
									width: 22rpx;
									height: 22rpx;
									margin-left:6rpx;
								}
							}
						}
					}
				}
			}
		}
		.footBtnGroup {
			position: fixed;
			bottom:0;
			width: 750rpx;
			padding: 42rpx 0 54rpx 0;
			background-color: #FFF;
			box-shadow: 0px -4rpx 16rpx 2rpx rgba(172,172,172,0.41);
			display: flex;
			justify-content: center;
			align-items: center;
			.btn + .btn {
				margin-left: 52rpx;
			}
			.internalBtn {
				width:202rpx;
				height: 76rpx;
				line-height: 76rpx;
				border-radius:104rpx;
				border:2rpx solid #2B72F0;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #2B72F0;
			}
			.externalBtn {
				width:266rpx;
				height: 76rpx;
				line-height: 76rpx;
				border-radius:104rpx;
				background-color: #2B72F0;
				box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
			.canntDoBtn {
				width:220rpx;
				height: 86rpx;
				line-height: 86rpx;
				border-radius:44rpx;
				border:2rpx solid #AAAAAA;
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #AAAAAA;
			}
		}
		.hintBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			.title {
				width:560rpx;
				font-size: 32rpx;
				color: #777777;
				text-align: center;
				padding: 40rpx 0 34rpx 0;
				line-height: 44rpx;
			}
			.confirmBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top:2rpx solid #F3F3F3;
				.cancelBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #777777;
					text-align: center;
				}
				.groupLine {
					width: 2rpx;
					height: 94rpx;
					background-color: #F3F3F3;
				}
				.confirmBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #4AA2F3;
					text-align: center;
				}
			}
		}
		.recLengthBox {
			margin: 20rpx 36rpx 0 36rpx;
			height: 60rpx;
			background: #FFEBBE;
			box-shadow: 0px 0px 38rpx 2rpx rgba(255,193,63,0.44);
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			padding: 0 26rpx;
			.icon {
				width: 27rpx;
				height: 35rpx;
				display: block;
				margin-right: 26rpx;
			}
			.msg {
				font-size: 24rpx;
				font-weight: 500;
				color: #F78B30;
				line-height: 44rpx;
			}
		}
		.newStickyBox {
			padding: 20rpx 36rpx 0 36rpx;
			box-sizing: border-box;
			width: 100vw;
			.forFreeIcon {
				width: 84rpx;
				height: 84rpx;
				display: block;
				position: absolute;
				z-index: 101;
				right: 12rpx;
				margin-top: -104rpx;
			}
			@keyframes bcChange {
			    0% {
					background-image: linear-gradient(60deg, #FFF 0, #FFF 50%, #E1E1E1 0, #E1E1E1 50%);
			    }
			    100% {
					background-image: linear-gradient(60deg, #E1E1E1 0, #E1E1E1 50%, #FFF 0, #FFF 50%);
			    }
			}
			.selectBc {
				background-image: linear-gradient(60deg, #FFF 0, #FFF 50%, #E1E1E1 0, #E1E1E1 50%);
			}
			.defaultBc {
				background-image: linear-gradient(60deg, #E1E1E1 0, #E1E1E1 50%, #FFF 0, #FFF 50%);
			}
			.deliverySelectBox {
				height: 78rpx;
				border-top-left-radius:36rpx;
		        border-top-right-radius:36rpx;
				overflow: hidden;
				display: flex;
				.selectBtn {
				    height: 78rpx;
					line-height: 78rpx;
					font-size: 32rpx;
					font-weight: 500;
				    flex: 0 0 50%;
					color: #333333;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.uni-badge-left-margin {
					margin: -28rpx 0 0 -15rpx;
				}
			}
			.selectBtnGroup {
				padding: 20rpx 0 0 0;
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
		.recommendedDate {
			border-bottom-left-radius:36rpx;
		    border-bottom-right-radius:36rpx;
			background-color: #FFF;
			margin: 0 36rpx;
			height: 78rpx;
			padding: 0 30rpx 0 26rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			width: 678rpx;
			.dateMsg {
				line-height: 44rpx;
				font-size: 28rpx;
				.title {
					color: #333333;
				}
				.msg {
					color:#2B72F0;
				}
			}
			.mapBtn {
				font-size: 28rpx;
				font-weight: 500;
				color: #2973FA;
				line-height: 44rpx;
			}
		}
		.quotationModel {
			padding: 0 36rpx;
			.quotationList {
				background: #FFFFFF;
				box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.36);
				margin: 20rpx 0 0 0;
				padding: 28rpx 44rpx 26rpx 50rpx;
				box-sizing: border-box;
				border-radius: 24rpx;
				overflow: hidden;
				.quotationLine {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name {
						line-height: 44rpx;
						text + text {
							padding-left: 20rpx;
						}
						text {
							font-size: 36rpx;
							font-weight: 500;
							color: #333333;
						}
					}
					.checkedIcon {
						display: block;
						width: 41rpx;
						height: 41rpx;
					}
					.car {
						line-height: 44rpx;
						text + text {
							padding-left: 10rpx;
						}
						text {
							font-size: 32rpx;
							color: #333333;
						}
					}
					.price {
						font-size: 40rpx;
						font-weight: bold;
						color: #EE5410;
						line-height: 44rpx;
					}
					.dateMsg {
						line-height: 44rpx;
						.title {
							font-size: 28rpx;
							color:#333;
						}
						.content {
							font-size: 28rpx;
							color:#2973FA;
							padding-left: 20rpx;
						}
					}
					.showAllBtn {
						display: flex;
						align-items: center;
						.msg {
							font-size: 28rpx;
							color: #666666;
							line-height: 44rpx;
						}
						.rightIcon {
							width: 18rpx;
							height: 18rpx;
							display: block;
							margin-left: 6rpx;
						}
					}
				}
				.quotationLine + .quotationLine {
					margin: 32rpx 0 0 0;
				}
				.carrierPriceDetails {
					// padding: 0 24rpx;
					.priceDetailsBox + .priceDetailsBox {
						margin-top:22rpx;
					}
					.priceDetailsBox {
						border-top: 2rpx solid #EFEFEF;
						padding-top: 18rpx;
						.carrierTitle {
							font-size: 32rpx;
							font-weight: 500;
							color: #222222;
							line-height: 44rpx;
							margin-bottom: 24rpx;
						}
						.driverMarginPrice {
							margin: 12rpx 0 24rpx 0;
							font-size: 24rpx;
							color: #777777;
							line-height: 34rpx;
						}
						.priceRow + .priceRow {
							margin-top: 20rpx
						}
						.priceRow {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.rowTitle {
								width: 210rpx;
								font-size: 26rpx;
								color: #333333;
								line-height: 36rpx;
							}
							.rowHint {
								flex:  1;
								font-size: 24rpx;
								color: #777777;
								line-height: 36rrpx
							}
							.rowPrice {
								font-size: 26rpx;
								color: #333333;
								line-height: 36rpx;
							}
							.rowTotal {
								font-size: 26rpx;
								font-weight: 500;
								color: #F29347;
								line-height: 36rpx;
								.msgPrice {
									font-size: 26rpx;
									font-weight: 500;
									color: #F29347;
								}
							}
						}
					}
					.unShowBtn {
						margin-top:32rpx;
						text-align: right;
						font-size: 26rpx;
						color: #777777;
						line-height: 36rpx;
					}
				}
			}
		}
		.recommendedModel {
			padding: 0 36rpx;
			.forFreeHintModel {
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
				margin-top:20rpx;
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
		}
		.mainDriverTitle {
			padding: 24rpx 16rpx 0 16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #222222;
				line-height: 44rpx;
			}
			.chooseAllBtn {
				display: flex;
				align-items: center;
				.btnMsg {
					font-size: 32rpx;
					color: #777777;
					line-height: 44rpx;
					padding-right: 16rpx;
				}
			}
		}
		.mainDriverTitle, .carrierCarList {
			.defaultCheckBtn {
				width: 34rpx;
				height: 34rpx;
				border: 2rpx solid #979797;
				border-radius:100%;
			}
			.checkedIcon {
				width: 38rpx;
				height: 38rpx;
			}
		}
		.carrierCarList {
			background: #FFFFFF;
			border-radius: 20rpx;
			margin: 20rpx 16rpx 0 16rpx;
			overflow: hidden;
			.driverDetailsBox {
				padding: 26rpx 24rpx;
				display: flex;
				.leftCheckedGroup {
					width: 38rpx;
					margin-right:32rpx;
				}
				.rightDetailsBox {
					flex: 1;
					.detailsMsgRow + .detailsMsgRow {
						margin-top: 12rpx;
					}
					.detailsMsgRow {
						height: 44rpx;
						display: flex;
						align-items: center;
						.text + .text {
							margin-left:12rpx;
						}
						.text {
							line-height: 44rpx;
						}
						.driverName {
							font-size: 32rpx;
							font-weight: 500;
							color: #222222;
						}
						.carMsg {
							font-size: 26rpx;
							color: #777777;
						}
						.offerPrice {
							font-size: 32rpx;
							font-weight: 500;
							color: #F29347;
							margin: 0 4rpx;
						}
						.offerSyb {
							font-size: 24rpx;
							color: #F29347;
						}
					}
					.flrxRow {
						justify-content: space-between;
						.confirmTime {
							font-size: 26rpx;
							color: #F29347;
							line-height: 36rpx;
						}
						.showMoreBtn {
							font-size: 26rpx;
							color: #777777;
							line-height: 36rpx;
							padding-left: 12rpx; // 扩大点击区域
						}
					}
				}
			}
			.carrierPriceDetails {
				padding: 0 24rpx;
				.priceDetailsBox + .priceDetailsBox {
					margin-top:22rpx;
				}
				.priceDetailsBox {
					border-top: 2rpx solid #EFEFEF;
					padding-top: 18rpx;
					.carrierTitle {
						font-size: 32rpx;
						font-weight: 500;
						color: #222222;
						line-height: 44rpx;
						margin-bottom: 24rpx;
					}
					.driverMarginPrice {
						margin: 12rpx 0 24rpx 0;
						font-size: 24rpx;
						color: #777777;
						line-height: 34rpx;
					}
					.priceRow + .priceRow {
						margin-top: 20rpx
					}
					.priceRow {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.rowTitle {
							width: 210rpx;
							font-size: 26rpx;
							color: #333333;
							line-height: 36rpx;
						}
						.rowHint {
							flex:  1;
							font-size: 24rpx;
							color: #777777;
							line-height: 36rrpx
						}
						.rowPrice {
							font-size: 26rpx;
							color: #333333;
							line-height: 36rpx;
						}
						.rowTotal {
							font-size: 26rpx;
							font-weight: 500;
							color: #F29347;
							line-height: 36rpx;
							.msgPrice {
								font-size: 26rpx;
								font-weight: 500;
								color: #F29347;
							}
						}
					}
				}
				.unShowBtn {
					margin-top:32rpx;
					text-align: right;
					font-size: 26rpx;
					color: #777777;
					line-height: 36rpx;
				}
			}
		}
		.checkCarNum {
			margin:24rpx;
			text-align: right;
			font-size: 26rpx;
			color: #222222;
			line-height: 36rpx;
		}
		.noData {
			margin:32rpx;
			text-align: center;
			font-size: 32rpx;
			color: #333;
		}
		.popup-box {
			.black-box {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: #000;
				opacity: 0.6;
				z-index: 99;
			}
			.popup-content {
				position: fixed;
				bottom: 30rpx;
				left: 24rpx;
				right: 24rpx;
				height: 330rpx;
				// height: 500rpx;
				background-color: #fff;
				z-index: 999;
				border-radius: 40rpx;
				padding: 30rpx 40rpx;
		
				.popup-head {
					color: #333;
					font-size: 28rpx;
					font-weight: bold;
				}
		
				.popup-row {
					display: flex;
					align-items: center;
					border-bottom: 2rpx solid #F6F6F6;
					padding: 30rpx 10rpx;
		
					.popup-child {
						font-size: 22rpx;
						color: #333;
						margin-right: 70rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
		
						.popup-img {
							width: 88rpx;
							height: 88rpx;
							margin-bottom: 14rpx;
						}
					}
				}
		
				.cancel-btn {
					display: flex;
					align-items: flex-end;
					justify-content: center;
					color: #777;
					height: 90rpx;
					font-size: 32rpx;
				}
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
		.toRolate {
			transform-origin:center center;
			transform: rotate(180deg);
			transition: transform 0.2s;
		}
	}
</style>
