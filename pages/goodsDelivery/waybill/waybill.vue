
<template>
	<view class="waybillPage">
		
		<view class="waybillHead">
			<view class="newHeadSearch">
				<view class="backBtn" @click="toBack">
					<image src="/static/images/arrow_left_white.png"></image>
				</view>
				<view class="searchBox" @click="showPopUp(3)">
					<image class="searchIcon" v-if="!showSearchMsg()" src="../../../static/images/goodsDelivery/search.png"></image>
					<view class="searchMsg" :style="showSearchMsg() ? 'color:#333;' : 'color:#AAA;'">{{showSearchMsg() ? showSearchMsg() : '查询'}}</view>
				</view>
			</view>
			
		<!--  :style="selectBoxSticky"	 -->
			<view class="selectBox" >
				<view class="selectBtn" v-for="(item, index) in selectData" :key="index" @tap="changeListStatus(item.value)">
					<view :class="selectFlag == item.value ? 'checkedBtnMsg' : 'btnMsg'">{{item.label}}</view>
					<view class="btnLine" :style="selectFlag == item.value ? 'background-color:#FFF;' : ''"></view>
				</view>
			</view>
		</view>	
		<view class="selected-All" style="top: 276rpx">
			<picker mode="date" fields="month" :value="createdDt" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="search_date" :class="{'addr': createdDt}">
					{{createdDt ? createdDt : '请选择月份'}}
					<image src="/static/images/arrow_down.png" class="arrow_down_search"></image>
				</view>
			</picker>
			<view v-if="selectFlag == 1">运单数{{planListDataTotal}}个</view>
			<view v-if="selectFlag == 2">运单数{{inTransitDataTotal}}个</view>
			<view v-if="selectFlag == 3">运单数{{arrivedDataTotal}}个</view>
			<view v-if="selectFlag == 4">运单数{{doneListDataTotal}}个</view>
			<view v-if="selectFlag == 5">运单数{{cancelListDataTotal}}个</view>
			<view v-if="selectFlag == 6">运单数{{allListDataTotal}}个</view>
		</view>
		
		<view v-show="selectFlag == 6" class="order-content">
			<!-- 列表模块 -->
			<view class="orderListBox" v-for="(item, index) in allListData" :key="index">
				<view class="orderHead">
					<view class="waybillNum">
						运单号：{{item.taskId}}
						<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
					</view>
					<view class="waybillStatus">{{item.statusDesc}}</view>
				</view>
				<view class="orderBody">
					<view class="orderContentBox" @tap="jumpToOrderDetails(item)">
						<view class="orderAddressBox">
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
							<view class="orderStatus">
								<view class="distanceMsg" v-if="item.orderDetailVO.estimatedDistance && Number(item.orderDetailVO.estimatedDistance) > 0">{{item.orderDetailVO.estimatedDistance}}km</view>
								<image class="statusIcon" src="../../../static/images/goodsDelivery/ongoing.png"></image>
							</view>
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
						</view>
						<view class="orderGoods">
							<view class="goodsMsg">
								<view class="msgBox">
									<!-- <text class="title">装货时间：</text>
									<text class="msg">{{item.orderDetailVO.child.orderLoadTimeRecordVO['0'].startDt}}</text> -->
									<text class="title">接单时间：</text>
									<text class="msg">{{item.createdDt}}</text>
								</view>
								<view class="msgBox">
									<text class="title">货物信息：</text>
									<text class="msg">{{showGoodsMsg(item)}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="driverMsgBox">
						<view class="driverDetailBox">
							<view class="driverMsg">
								<text class="title">{{showDriverName(item.ydTaskDriverVO.userName)}}</text>
								<image class="msgIcon" src="../../../static/images/goodsDelivery/callIcon.png" @click.stop="call(item.ydTaskDriverVO.phone)"></image>
							</view>
							<view class="carMsg" @tap="jumpToOrderDetails(item)">
								<text class="msg">{{item.ydTaskDriverVO.vehicleNo ? item.ydTaskDriverVO.vehicleNo : '暂无车牌'}}</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleLength}}米</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleType}}</text>
							</view>
						</view>
						<view class="orderPriceBox">
							<view class="goodsPrice" v-if="item.shipperUserId == userInfo.userId">
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">¥</text>
								<text class="orderPriceNum" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
									{{item.orderDetailVO.wbQuotePrice ? Number(item.orderDetailVO.wbQuotePrice)/100 : 0}}{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName ? '/' : ''}}
								</text>
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
								<text class="orderPriceNum" v-else>价格电议</text>
							</view>
							<view class="notUser" v-if="item.shipperUserId != userInfo.userId">托运单</view>
						</view>
					</view>
					<view style="margin-top:12rpx;display: flex;justify-content: flex-end;align-items: center;" v-if="item.shipperUserId == userInfo.userId">
						<view class="waybillBtn load-complete-btn" v-if="item.isSync == 1 && item.status == 1" @click.stop="jumpToBeginTask(item)">起运</view>
						<view class="waybillBtn load-complete-btn" v-if="item.isSync == 1 && item.status == 2" @click.stop="jumpToArriveTask(item)">到达</view>
					</view>
				</view>
			</view>
			<view class="loadingBox" v-show="allNoData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
				<text>{{isSelectedDate ? '所选月份无运单，查看更多请选择时间' : '暂无数据'}}</text>
			</view>
			<view class="loadingBox" v-show="allNoMore">
				<text>{{isSelectedDate ? '仅展示所选择月份运单，无更多数据' : '无更多数据~'}}</text>
			</view>
		</view>
		
		<view v-show="selectFlag == 1" class="order-content">
			<!-- 列表模块 -->
			<view class="orderListBox" v-for="(item, index) in planListData" :key="index">
				<view class="orderHead">
					<view class="waybillNum">
						运单号：{{item.taskId}}
						<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
					</view>
					<view class="waybillStatus">{{item.statusDesc}}</view>
				</view>
				<view class="orderBody">
					<view class="orderContentBox" @tap="jumpToOrderDetails(item)">
						<view class="orderAddressBox">
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
							<view class="orderStatus">
								<view class="distanceMsg" v-if="item.orderDetailVO.estimatedDistance && Number(item.orderDetailVO.estimatedDistance) > 0">{{item.orderDetailVO.estimatedDistance}}km</view>
								<image class="statusIcon" src="../../../static/images/goodsDelivery/ongoing.png"></image>
							</view>
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
						</view>
						<view class="orderGoods">
							<view class="goodsMsg">
								<view class="msgBox">
									<text class="title">接单时间：</text>
									<text class="msg">{{item.createdDt}}</text>
								</view>
								<view class="msgBox">
									<text class="title">货物信息：</text>
									<text class="msg">{{showGoodsMsg(item)}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="driverMsgBox">
						<view class="driverDetailBox">
							<view class="driverMsg">
								<text class="title">{{showDriverName(item.ydTaskDriverVO.userName)}}</text>
								<image class="msgIcon" src="../../../static/images/goodsDelivery/callIcon.png" @click.stop="call(item.ydTaskDriverVO.phone)"></image>
							</view>
							<view class="carMsg" @tap="jumpToOrderDetails(item)">
								<text class="msg">{{item.ydTaskDriverVO.vehicleNo ? item.ydTaskDriverVO.vehicleNo : '暂无车牌'}}</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleLength}}米</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleType}}</text>
							</view>
						</view>
						<view class="orderPriceBox">
							<view class="goodsPrice" v-if="item.shipperUserId == userInfo.userId">
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">¥</text>
								<text class="orderPriceNum" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
									{{item.orderDetailVO.wbQuotePrice ? Number(item.orderDetailVO.wbQuotePrice)/100 : 0}}{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName ? '/' : ''}}
								</text>
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
								<text class="orderPriceNum" v-else>价格电议</text>
							</view>
							<view class="notUser" v-if="item.shipperUserId != userInfo.userId">托运单</view>
						</view>
					</view>
					<view style="margin-top:12rpx;display: flex;justify-content: flex-end;align-items: center;" v-if="item.shipperUserId == userInfo.userId">
						<view class="waybillBtn load-complete-btn" v-if="item.isSync == 1 && item.status == 1" @click.stop="jumpToBeginTask(item)">起运</view>
					</view>
				</view>
			</view>
			<view class="loadingBox" v-show="planNoData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
				<text>{{isSelectedDate ? '所选月份无运单，查看更多请选择时间' : '暂无数据'}}</text>
			</view>
			<view class="loadingBox" v-show="planNoMore">
				<text>{{isSelectedDate ? '仅展示所选择月份运单，无更多数据' : '无更多数据~'}}</text>
			</view>
		</view>
		
		<view v-show="selectFlag == 2" class="order-content">
			<!-- 列表模块 -->
			<view class="orderListBox" v-for="(item, index) in inTransitData" :key="index">
				<view class="orderHead">
					<view class="waybillNum">
						运单号：{{item.taskId}}
						<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
					</view>
					<view class="waybillStatus">{{item.statusDesc}}</view>
				</view>
				<view class="orderBody">
					<view class="orderContentBox" @tap="jumpToOrderDetails(item)">
						<view class="orderAddressBox">
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
							<view class="orderStatus">
								<view class="distanceMsg" v-if="item.orderDetailVO.estimatedDistance && Number(item.orderDetailVO.estimatedDistance) > 0">{{item.orderDetailVO.estimatedDistance}}km</view>
								<image class="statusIcon" src="../../../static/images/goodsDelivery/ongoing.png"></image>
							</view>
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
						</view>
						<view class="orderGoods">
							<view class="goodsMsg">
								<view class="msgBox">
									<text class="title">接单时间：</text>
									<text class="msg">{{item.createdDt}}</text>
								</view>
								<view class="msgBox">
									<text class="title">货物信息：</text>
									<text class="msg">{{showGoodsMsg(item)}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="driverMsgBox">
						<view class="driverDetailBox">
							<view class="driverMsg">
								<text class="title">{{showDriverName(item.ydTaskDriverVO.userName)}}</text>
								<image class="msgIcon" src="../../../static/images/goodsDelivery/callIcon.png" @click.stop="call(item.ydTaskDriverVO.phone)"></image>
							</view>
							<view class="carMsg" @tap="jumpToOrderDetails(item)">
								<text class="msg">{{item.ydTaskDriverVO.vehicleNo ? item.ydTaskDriverVO.vehicleNo : '暂无车牌'}}</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleLength}}米</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleType}}</text>
							</view>
						</view>
						<view class="orderPriceBox">
							<view class="goodsPrice" v-if="item.shipperUserId == userInfo.userId">
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">¥</text>
								<text class="orderPriceNum" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
									{{item.orderDetailVO.wbQuotePrice ? Number(item.orderDetailVO.wbQuotePrice)/100 : 0}}{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName ? '/' : ''}}
								</text>
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
								<text class="orderPriceNum" v-else>价格电议</text>
							</view>
							<view class="notUser" v-if="item.shipperUserId != userInfo.userId">托运单</view>
						</view>
					</view>
					<view style="margin-top:12rpx;display: flex;justify-content: flex-end;align-items: center;" v-if="item.shipperUserId == userInfo.userId">
						<view class="waybillBtn load-complete-btn" v-if="item.isSync == 1 && item.status == 2" @click.stop="jumpToArriveTask(item)">到达</view>
					</view>
				</view>
			</view>
			<view class="loadingBox" v-show="inTransitNoData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
				<text>{{isSelectedDate ? '所选月份无运单，查看更多请选择时间' : '暂无数据'}}</text>
			</view>
			<view class="loadingBox" v-show="inTransitNoMore">
				<text>{{isSelectedDate ? '仅展示所选择月份运单，无更多数据' : '无更多数据~'}}</text>
			</view>
			
		</view>
		
		<view v-show="selectFlag == 3" class="order-content">
			<!-- 列表模块 -->
			<view class="orderListBox" v-for="(item, index) in arrivedData" :key="index">
				<view class="orderHead">
					<view class="waybillNum">
						运单号：{{item.taskId}}
						<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
					</view>
					<view class="waybillStatus">{{item.statusDesc}}</view>
				</view>
				<view class="orderBody">
					<view class="orderContentBox" @tap="jumpToOrderDetails(item)">
						<view class="orderAddressBox">
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
							<view class="orderStatus">
								<view class="distanceMsg" v-if="item.orderDetailVO.estimatedDistance && Number(item.orderDetailVO.estimatedDistance) > 0">{{item.orderDetailVO.estimatedDistance}}km</view>
								<image class="statusIcon" src="../../../static/images/goodsDelivery/ongoing.png"></image>
							</view>
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
						</view>
						<view class="orderGoods">
							<view class="goodsMsg">
								<view class="msgBox">
									<text class="title">接单时间：</text>
									<text class="msg">{{item.createdDt}}</text>
								</view>
								<view class="msgBox">
									<text class="title">货物信息：</text>
									<text class="msg">{{showGoodsMsg(item)}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="driverMsgBox">
						<view class="driverDetailBox">
							<view class="driverMsg">
								<text class="title">{{showDriverName(item.ydTaskDriverVO.userName)}}</text>
								<image class="msgIcon" src="../../../static/images/goodsDelivery/callIcon.png" @click.stop="call(item.ydTaskDriverVO.phone)"></image>
							</view>
							<view class="carMsg" @tap="jumpToOrderDetails(item)">
								<text class="msg">{{item.ydTaskDriverVO.vehicleNo ? item.ydTaskDriverVO.vehicleNo : '暂无车牌'}}</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleLength}}米</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleType}}</text>
							</view>
						</view>
						<view class="orderPriceBox">
							<view class="goodsPrice" v-if="item.shipperUserId == userInfo.userId">
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">¥</text>
								<text class="orderPriceNum" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
									{{item.orderDetailVO.wbQuotePrice ? Number(item.orderDetailVO.wbQuotePrice)/100 : 0}}{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName ? '/' : ''}}
								</text>
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
								<text class="orderPriceNum" v-else>价格电议</text>
							</view>
							<view class="notUser" v-if="item.shipperUserId != userInfo.userId">托运单</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loadingBox" v-show="arrivedNoData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
				<text>{{isSelectedDate ? '所选月份无运单，查看更多请选择时间' : '暂无数据'}}</text>
			</view>
			<view class="loadingBox" v-show="arrivedNoMore">
				<text>{{isSelectedDate ? '仅展示所选择月份运单，无更多数据' : '无更多数据~'}}</text>
			</view>
			
		</view>
		
		<view v-show="selectFlag == 4" class="order-content">
			<!-- 列表模块 -->
			<view class="orderListBox" v-for="(item, index) in doneListData" :key="index">
				<view class="orderHead">
					<view class="waybillNum">
						运单号：{{item.taskId}}
						<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
					</view>
					<view class="waybillStatus">{{item.statusDesc}}</view>
				</view>
				<view class="orderBody">
					<view class="orderContentBox" @tap="jumpToOrderDetails(item)">
						<view class="orderAddressBox">
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
							<view class="orderStatus">
								<view class="distanceMsg" v-if="item.orderDetailVO.estimatedDistance && Number(item.orderDetailVO.estimatedDistance) > 0">{{item.orderDetailVO.estimatedDistance}}km</view>
								<image class="statusIcon" src="../../../static/images/goodsDelivery/ongoing.png"></image>
							</view>
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
						</view>
						<view class="orderGoods">
							<view class="goodsMsg">
								<view class="msgBox">
									<text class="title">接单时间：</text>
									<text class="msg">{{item.createdDt}}</text>
								</view>
								<view class="msgBox">
									<text class="title">货物信息：</text>
									<text class="msg">{{showGoodsMsg(item)}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="driverMsgBox">
						<view class="driverDetailBox">
							<view class="driverMsg">
								<text class="title">{{showDriverName(item.ydTaskDriverVO.userName)}}</text>
								<image class="msgIcon" src="../../../static/images/goodsDelivery/callIcon.png" @click.stop="call(item.ydTaskDriverVO.phone)"></image>
							</view>
							<view class="carMsg" @tap="jumpToOrderDetails(item)">
								<text class="msg">{{item.ydTaskDriverVO.vehicleNo ? item.ydTaskDriverVO.vehicleNo : '暂无车牌'}}</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleLength}}米</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleType}}</text>
							</view>
						</view>
						<view class="orderPriceBox">
							<view class="goodsPrice" v-if="item.shipperUserId == userInfo.userId">
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">¥</text>
								<text class="orderPriceNum" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
									{{item.orderDetailVO.wbQuotePrice ? Number(item.orderDetailVO.wbQuotePrice)/100 : 0}}{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName ? '/' : ''}}
								</text>
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
								<text class="orderPriceNum" v-else>价格电议</text>
							</view>
							<view class="notUser" v-if="item.shipperUserId != userInfo.userId">托运单</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loadingBox" v-show="doneNoData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
				<text>{{isSelectedDate ? '所选月份无运单，查看更多请选择时间' : '暂无数据'}}</text>
			</view>
			<view class="loadingBox" v-show="doneNoMore">
				<text>{{isSelectedDate ? '仅展示所选择月份运单，无更多数据' : '无更多数据~'}}</text>
			</view>
			
		</view>
		
		<view v-show="selectFlag == 5" class="order-content">
			<!-- 列表模块 -->
			<view class="orderListBox" v-for="(item, index) in cancelListData" :key="index">
				<view class="orderHead">
					<view class="waybillNum">
						运单号：{{item.taskId}}
						<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
					</view>
					<view class="waybillStatus" style="color:#777;">{{item.statusDesc}}</view>
				</view>
				<view class="orderBody">
					<view class="orderContentBox" @tap="jumpToOrderDetails(item)">
						<view class="orderAddressBox">
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
							<view class="orderStatus">
								<view class="distanceMsg" v-if="item.orderDetailVO.estimatedDistance && Number(item.orderDetailVO.estimatedDistance) > 0">{{item.orderDetailVO.estimatedDistance}}km</view>
								<image class="statusIcon" src="../../../static/images/goodsDelivery/ongoing.png"></image>
							</view>
							<view class="addressMsg">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
						</view>
						<view class="orderGoods">
							<view class="goodsMsg">
								<view class="msgBox">
									<text class="title">接单时间：</text>
									<text class="msg">{{item.createdDt}}</text>
								</view>
								<view class="msgBox">
									<text class="title">货物信息：</text>
									<text class="msg">{{showGoodsMsg(item)}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="driverMsgBox">
						<view class="driverDetailBox">
							<view class="driverMsg">
								<text class="title">{{showDriverName(item.ydTaskDriverVO.userName)}}</text>
								<image class="msgIcon" src="../../../static/images/goodsDelivery/callIcon.png" @click.stop="call(item.ydTaskDriverVO.phone)"></image>
							</view>
							<view class="carMsg" @tap="jumpToOrderDetails(item)">
								<text class="msg">{{item.ydTaskDriverVO.vehicleNo ? item.ydTaskDriverVO.vehicleNo : '暂无车牌'}}</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleLength}}米</text>
								<text class="msg">{{item.ydTaskDriverVO.vehicleType}}</text>
							</view>
						</view>
						<view class="orderPriceBox">
							<view class="goodsPrice" v-if="item.shipperUserId == userInfo.userId">
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">¥</text>
								<text class="orderPriceNum" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
									{{item.orderDetailVO.wbQuotePrice ? Number(item.orderDetailVO.wbQuotePrice)/100 : 0}}{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName ? '/' : ''}}
								</text>
								<text class="priceSyb" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
								<text class="orderPriceNum" v-else>价格电议</text>
							</view>
							<view class="deleteOrderBtn" v-if="item.shipperUserId == userInfo.userId" @click="openConfirmPopup(item, index)">删除</view>
							<view class="notUser" v-if="item.shipperUserId != userInfo.userId">托运单</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loadingBox" v-show="cancelNoData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
				<text>{{isSelectedDate ? '所选月份无运单，查看更多请选择时间' : '暂无数据'}}</text>
			</view>
			<view class="loadingBox" v-show="cancelNoMore">
				<text>{{isSelectedDate ? '仅展示所选择月份运单，无更多数据' : '无更多数据~'}}</text>
			</view>
			
		</view>
		
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
			努力加载中…
		</view>
		<view class="sendbox"></view>
		
		<uni-popup ref="deletePopup" type="center">
			<view class="hintBox">
				<view class="title">是否删除该运单？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="closeConfirmPopup()">取消</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @tap="deleteOrder()">确认删除</view>
				</view>
			</view>
		</uni-popup>
		
		
		<uni-popup ref="goodsPopup" type="top">
			<view class="topPopupBox">
				<view class="searchContent">
					<view class="searchBox" @click="showPopUp(3)">
						<image class="searchIcon" src="../../../static/images/goodsDelivery/search.png"></image>
						<text class="searchMsg">运单号查询</text>
					</view>
				</view>
				<view class="item">
					<view class="label">车牌号</view>
					<view class="itemInputBox">
						<input v-model="params.carNo" maxlength="20" style="text-align: right; 28rpx;color: #333;" placeholder="请填写" placeholder-style="font-size: 28rpx;color: #AAA;"/>
						<image v-if="params.carNo" @click="params.carNo = ''" src="../../../static/images/close2.png" class="arrow_down"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">司机姓名</view>
					<view class="itemInputBox">
						<input v-model="params.driverName" maxlength="10" style="flex: 1;text-align: right; font-size: 28rpx;color: #333;" placeholder="请填写" placeholder-style="font-size: 28rpx;color: #AAA;"/>
						<image v-if="params.driverName" @click="params.driverName = ''" src="../../../static/images/close2.png" class="arrow_down"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">运单号</view>
					<view class="itemInputBox">
						<input v-model="params.taskId" maxlength="20" style="flex:1;text-align: right; font-size: 28rpx;color: #333;" placeholder="请填写" placeholder-style="font-size: 28rpx;color: #AAA;"/>
						<image v-if="params.taskId" @click="params.taskId = ''" src="../../../static/images/close2.png" class="arrow_down"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">装货地</view>
					<view class="selectWhole">
						
						<view v-if="startAddr.length > 0" @click="showPopUp(1)">
							<text class="addr">{{showAddr(startAddr)}}</text>
						</view>
						<view v-else @click="showPopUp(1)">
							<text>请选择装货地</text>
						</view>
						<image v-if="startAddr.length > 0" @click="startAddr = []" src="../../../static/images/close2.png" class="arrow_down"></image>
						<image v-if="startAddr.length == 0" @click="showPopUp(1)" src="../../../static/images/arrow_down.png" class="arrow_down"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">卸货地</view>
					<view class="selectWhole">
						<view v-if="arriveAddr.length > 0" @click="showPopUp(2)">
							<text class="addr">{{showAddr(arriveAddr)}}</text>
						</view>
						<view v-else @click="showPopUp(2)">
							<text>请选择卸货地</text>
						</view>
						<image v-if="arriveAddr.length > 0" @click="arriveAddr = []" src="../../../static/images/close2.png" class="arrow_down"></image>
						<image v-if="arriveAddr.length == 0" @click="showPopUp(2)" src="../../../static/images/arrow_down.png" class="arrow_down"></image>
					</view>
				</view>
				<view class="popupBtnGroup">
					<view class="btnItem reset" @tap="reset()">重置</view>
					<view class="btnItem find" @tap="find()">查询</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="startPopup" type="bottom">
			<view class="bottomPopupBox">
				<view class="popupHead">
					<text class="title">选择地区</text>
					<view class="cancelIconBox" @tap="closePopup()">
						<image class="cancelIcon" src="../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="listAlertWhole">
					<picker-view   :value="goodsVal" @change="bindGoodsChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in provinceArr" :key="index">{{item.name}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in cityArr" :key="index">{{item.name}}</view>
						</picker-view-column>
						<!-- <picker-view-column>
							<view class="item" v-for="(item,index) in areaArr" :key="index">{{item.name}}</view>
						</picker-view-column> -->
					</picker-view>
					
				</view>
				<view class="popupBtnGroup">
					<view class="comfirmBtn" @tap="selectType()">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as publicData from "@/utils/publicData.js";
	import {longEvent} from "../../../longLink/consignorlongLink.js";
	import noData from "@/components/noData"
	import UniMoreBox from "@/components/uni-morebox"
	export default {
		components: {
			noData,
			UniMoreBox
		},
		data() {
			return {
				isSelectedDate: false, //时间删选后只查询当前月数据
				isLoading: false,
				pageNum: 1,
				pageSize: 20,
				noData: false,
				noMore: false,
				selectFlag: 6,
				selectData: [{
					label: '全部',
					value: 6
				},{
					label: '计划',
					value: 1
				}, {
					label: '在途',
					value: 2
				}, {
					label: '抵达',
					value: 3
				}, {
					label: '取消',
					value: 5
				}],
				// , {
				// 	label: '完成',
				// 	value: 4
				// }
				allListData: [],
				allListDataTotal: 0,
				allPageNum: 1,
				allNoMore: false,
				allNoData: false,
				
				planListData: [],
				planListDataTotal: 0,
				planPageNum: 1,
				planNoMore: false,
				planNoData: false,
				
				inTransitData: [],
				inTransitDataTotal: 0,
				inTransitPageNum: 1,
				inTransitNoMore: false,
				inTransitNoData: false,
				
				arrivedData: [],
				arrivedDataTotal: 0,
				arrivedPageNum: 1,
				arrivedNoMore: false,
				arrivedNoData: false,
				
				doneListData: [],
				doneListDataTotal: 0,
				donePageNum: 1,
				doneNoMore: false,
				doneNoData: false,
				cancelListData: [],
				cancelListDataTotal: 0,
				cancelPageNum: 1,
				cancelNoMore: false,
				cancelNoData: false,
				
				popupObj: {},
				popupKey: '',
				provinceArr: [],
				cityArr: [],
				areaArr: [],
				goodsVal: [0, 0, 0],
				startAddr: [],
				arriveAddr: [],
				addrType: 1,
				params: {
					senderProvince: '',
					senderCity: '',
					senderArea: '',
					receiverProvince: '',
					receiverCity: '',
					receiverArea: '',
					createdDt: '',
					carNo: '',
					driverName: '',
					taskId: '',
					createdDtStart: '',
					createdDtEnd: '',
				},
				createdDt: '',
				userInfo: {}
			};
		},
		onLoad() {
			this.getWaybillInfo();
			uni.$on("refreshData_waybill", (data) => {
				this.getWaybillInfo();
			});
			this.getAreaData();;
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onShow() {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getWaybillInfo();
		},
		onReachBottom() { // 上拉加载
			console.log('上拉加载');
			this.getListOnLoad();
		},
		onReady() {
		},
		methods: {
			changeLog(e) {
			    this.params.createdDt = e;
			    console.log("选择的起运时间:", e);
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindDateChange: function(e) {
				   var val = e.target.value;
				   var fullYear = val.split('-')[0];
				   var fullMonth = val.split('-')[1];
				   var days = new Date(fullYear, fullMonth, 0).getDate();
				   var createdDtStart = val + '-01'
				   var createdDtEnd = val + '-' + days
				   this.createdDt = e.target.value;
				   this.params.createdDtStart = createdDtStart;
				   this.params.createdDtEnd = createdDtEnd;
				   this.isSelectedDate = true;
					this.getWaybillInfo();
			},
			async getAreaData() {
				var result = await utils.postRequest("/ts/nationDict/getBasicData");
				var provinceArr = result.rspBody;
				var cityArr = provinceArr[0].cities
				var areaArr = provinceArr[0].cities[0].areas
				this.provinceArr = provinceArr;
				this.cityArr = cityArr;
				this.areaArr = areaArr;
			},
			getWaybillInfo() {
				this.isLoading = true;
				let that = this;
				let pageNum = 1;
				that.noData = false;
				that.noMore = false;
				let status = '';
				switch(that.selectFlag) {
					case 1:
						status = 1;
						that.planPageNum = 1;
						that.planNoMore = false;
						that.planNoData = false;
						break;
					case 2:
						status = 2;
						that.inTransitPageNum = 1;
						that.inTransitNoMore = false;
						that.inTransitNoData = false;
						break;
					case 3:
						status = 3;
						that.arrivedPageNum = 1;
						that.arrivedNoMore = false;
						that.arrivedNoData = false;
						break;
					case 4:
						status = 5;
						that.donePageNum = 1;
						that.doneNoMore = false;
						that.doneNoData = false;
						break;
					case 5:
						status = 0;
						that.cancelPageNum = 1;
						that.cancelNoMore = false;
						that.cancelNoData = false;
						break;
					case 6:
						status = '';
						that.allPageNum = 1;
						that.allNoMore = false;
						that.allNoData = false;
						break;
				}
				let params = {
					senderProvince: that.params.senderProvince,
					senderCity: that.params.senderCity,
					senderArea: that.params.senderArea ? that.params.senderArea : '',
					receiverProvince: that.params.receiverProvince,
					receiverCity: that.params.receiverCity,
					receiverArea: that.params.receiverArea ? that.params.receiverArea : '',
					carNo: that.params.carNo, // 车牌号
					driverName: that.params.driverName, // 司机姓名
					createdDt: that.params.createdDt ? that.params.createdDt + ' 00:00:00' : undefined, // 接单时间
					taskId: that.params.taskId, // 运单号
					status: status,
					pageNum: pageNum,
					pageSize: that.pageSize
				}
				if (that.isSelectedDate) {
					params.createdDtStart = that.params.createdDtStart || undefined
					params.createdDtEnd = that.params.createdDtEnd || undefined
				} else {
					params.createdDtStart && delete params.createdDtStart
					params.createdDtEnd && delete params.createdDtEnd
				}
				console.log('运单查询参数', params);
				utils.postRequest('/yd/task/getShipperYdTaskByParam', params)
				.then(res=>{
					that.isLoading = false;
					console.log('运单列表', res);
					if(res.retCode == '0000000') {
						var items = res.rspBody.items;
						switch(that.selectFlag) {
							case 1:
								that.planListData = res.rspBody.items;
								that.planListDataTotal = res.rspBody.total;
								if(that.planListData.length == 0) {
									that.planNoData = true;
									that.planNoMore = false;
								}else if(that.planListData.length < that.pageSize) {
									that.planNoMore = true;
								}
								console.log('运单列表', that.planListData['0']);
								break;
							case 2:
								that.inTransitData = res.rspBody.items;
								that.inTransitDataTotal = res.rspBody.total;
								if(that.inTransitData.length == 0) {
									that.inTransitNoData = true;
									that.inTransitNoMore = false;
								}else if(that.inTransitData.length < that.pageSize) {
									that.inTransitNoMore = true;
								}
								console.log('运单列表', that.inTransitData['0']);
								break;
							case 3:
								that.arrivedData = res.rspBody.items;
								that.arrivedDataTotal = res.rspBody.total;
								if(that.arrivedData.length == 0) {
									that.arrivedNoData = true;
									that.arrivedNoMore = false;
								}else if(that.arrivedData.length < that.pageSize) {
									that.arrivedNoMore = true;
								}
								console.log('运单列表', that.arrivedData['0']);
								break;
							case 4:
								that.doneListData = res.rspBody.items;
								that.doneListDataTotal = res.rspBody.total;
								if(that.doneListData.length == 0) {
									that.doneNoData = true;
									that.doneNoMore = false;
								}else if(that.doneListData.length < that.pageSize) {
									that.doneNoMore = true;
								}
								console.log('运单列表', that.doneListData['0']);
								break;
							case 5:
								that.cancelListData = res.rspBody.items;
								that.cancelListDataTotal = res.rspBody.total;
								if(that.cancelListData.length == 0) {
									that.cancelNoData = true;
									that.cancelNoMore = false;
								}else if(that.cancelListData.length < that.pageSize) {
									that.cancelNoMore = true;
								}
								console.log('运单列表', that.cancelListData['0']);
								break;
							case 6:
								that.allListData = res.rspBody.items;
								that.allListDataTotal = res.rspBody.total;
								if(that.allListData.length == 0) {
									that.allNoData = true;
									that.allNoMore = false;
								}else if(that.allListData.length < that.pageSize) {
									that.allNoMore = true;
								}
								console.log('运单列表', that.allListData['0']);
								break;
						}
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
					that.isLoading = false;
					console.log(err);
					uni.hideLoading();
				})
				uni.stopPullDownRefresh();
			},
			getListOnLoad() {
				let pageNum, status;
				switch(this.selectFlag) {
					case 1:
						if(this.planNoMore || this.isLoading) {
							return false;
						}else {
							this.planPageNum++;
							pageNum = this.planPageNum;
							status = 1;
							break;
						}
					case 2:
						if(this.inTransitNoMore || this.isLoading) {
							return false;
						}else {
							this.inTransitPageNum++;
							pageNum = this.inTransitPageNum;
							status = 2;
							break;
						}
					case 3:
						if(this.arrivedNoMore || this.isLoading) {
							return false;
						}else {
							this.arrivedPageNum++;
							pageNum = this.arrivedPageNum;
							status = 3;
							break;
						}
					case 4:
						if(this.doneNoMore || this.isLoading) {
							return false;
						}else {
							this.donePageNum++;
							pageNum = this.donePageNum;
							status = 5;
							break;
						}
					case 5:
						if(this.cancelNoMore || this.isLoading) {
							return false;
						}else {
							this.cancelPageNum++;
							pageNum = this.cancelPageNum;
							status = 0;
							break;
						}
					case 6:
						if(this.allNoMore || this.isLoading) {
							return false;
						}else {
							this.allPageNum++;
							pageNum = this.allPageNum;
							status = '';
							break;
						}
				}
				this.isLoading = true;
				let that = this;
				let params = {
					senderProvince: that.params.senderProvince,
					senderCity: that.params.senderCity,
					senderArea: that.params.senderArea ? that.params.senderArea : '',
					receiverProvince: that.params.receiverProvince,
					receiverCity: that.params.receiverCity,
					receiverArea: that.params.receiverArea ? that.params.receiverArea : '',
					carNo: that.params.carNo, // 车牌号
					driverName: that.params.driverName, // 司机姓名
					createdDt: that.params.createdDt ? that.params.createdDt + ' 00:00:00' : undefined, // 接单时间
					taskId: that.params.taskId, // 运单号
					status: status,
					pageNum: pageNum,
					pageSize: that.pageSize,
				}
				if (this.isSelectedDate) {
					params.createdDtStart = this.params.createdDtStart || undefined
					params.createdDtEnd = this.params.createdDtEnd || undefined
				}
				utils.postRequest('/yd/task/getShipperYdTaskByParam', params)
				.then(function (res) {
					console.log('懒加载列表数据', res);
					that.isLoading = false;
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
 
						if(items && items.length > 0) {
							for(let i in items) {
								switch(that.selectFlag) {
									case 1:
										that.planListData.push(items[i]);
										break;
									case 2:
										that.inTransitData.push(items[i]);
										break;
									case 3:
										that.arrivedData.push(items[i]);
										break;
									case 4:
										that.doneListData.push(items[i]);
										break;
									case 5:
										that.cancelListData.push(items[i]);
										break;
									case 6:
										that.allListData.push(items[i]);
										break;
								}
							}
						}else {
							switch(that.selectFlag) {
								case 1:
									that.planNoMore = true;
									break;
								case 2:
									that.inTransitNoMore = true;
									break;
								case 3:
									that.arrivedNoMore = true;
									break;
								case 4:
									that.doneNoMore = true;
									break;
								case 5:
									that.cancelNoMore = true;
									break;
								case 6:
									that.allNoMore = true;
									break;
							}
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			comments(item) {
				uni.navigateTo({
					url: '../userCenter/complaintsRecord/commentsWaybill?taskId=' + item.taskId + '&shipperUserId=' + item.shipperUserId + '&driverUserId=' + item.driverUserId
				})
			},
			changeListStatus(flag) { // 订单状态切换，当切换不同tab时将滑动距离重置为0
			console.log(flag,'flag')
				if(this.selectFlag != flag) {
					this.isSelectedDate = false;
					this.selectFlag = flag;
					//清除日期
					this.createdDt = "";
					this.params.createdDtStart = "";
					this.params.createdDtEnd = "";
					switch(this.selectFlag) {
						case 1:
							this.planListData = [];
							this.getWaybillInfo();
							// if(this.planListData.length == 0 && !this.planNoData) {
							// 	this.getWaybillInfo();
							// }
							break;
						case 2:
							this.inTransitData = [];
							this.getWaybillInfo();
							// if(this.doneListData.length == 0 && !this.doneNoData) {
							// 	this.getWaybillInfo();
							// }
							break;
						case 3:
							this.arrivedData = [];
							this.getWaybillInfo();
							// if(this.cancelListData.length == 0 && !this.cancelNoData) {
							// 	this.getWaybillInfo();
							// }
							break;	
						case 4:
							this.doneListData = [];
							this.getWaybillInfo();
							// if(this.doneListData.length == 0 && !this.doneNoData) {
							// 	this.getWaybillInfo();
							// }
							break;
						case 5:
							this.cancelListData = [];
							this.getWaybillInfo();
							// if(this.cancelListData.length == 0 && !this.cancelNoData) {
							// 	this.getWaybillInfo();
							// }
							break;
					}
					uni.pageScrollTo({
					    scrollTop: 0,
					    duration: 100
					});
				}
			},
			showGoodsMsg(item) { // 展示货物信息
				if(!item || !item.cargoName) {
					return '/';
				}else {
					let returnMsg = item.cargoName;
					if(item.cargoWeight) {
						var cargoUnit = item.cargoUnit || "吨"
						returnMsg = returnMsg+ ',' + item.cargoWeight + cargoUnit;
					}
					if(item.cargoVolume) {
						returnMsg = returnMsg + ',' + item.cargoVolume + '方';
					}
					return returnMsg;
				}
			},
			closeConfirmPopup() { // 关闭确认取消的弹出框
				this.$refs.deletePopup.close()
			},
			openConfirmPopup(item, key) {
				this.popupObj = item;
				console.log('运单对象', this.popupObj);
				this.popupKey = key;
				this.$refs.deletePopup.open()
			},
			deleteOrder() { // 删除取消状态的运单
				if(!utils.btnRepeat()) return false; // 防抖
				console.log(this.popupObj);
				let item = this.popupObj;
				let key = this.popupKey;
				uni.showLoading({
					title: '请稍候...',
				})
				let that = this;
				utils.postRequest('/yd/task/remove?taskSId=' + item.sid, {})
				.then(res=>{
					console.log('删除运单信息', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						this.$refs.deletePopup.close()
						uni.showToast({
							title: '删除成功！',
							icon: 'none'
						})
						that.cancelListData.splice(key, 1);
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			// showOrderStatusBc() { // 根据不同的订单状态展示不同的头部颜色
			// 	if(this.selectFlag == 5) {
			// 		return 'background: linear-gradient(-180deg, #AAAAAA 0%, #777777 100%);';
			// 	}else {
			// 		return 'background: linear-gradient(-180deg, #74C1FD 0%, #4AA2F3 100%);';
			// 	}
			// },
			jumpToOrderDetails(item) {
				if(!utils.btnRepeat()) return false; // 防抖
				var waybillDetails = JSON.stringify(item);
				uni.navigateTo({
					url: './waybillDetails/waybillDetails?detailsInfo=' + waybillDetails
				})
			},
			showPopUp(index) {
				if(!utils.btnRepeat()) return false; // 防抖
				this.addrType = index;
				if (index !== 3) {
					this.goodsVal = [0, 0, 0];
					this.$refs.startPopup.open();
				} else {
					this.$refs.goodsPopup.open();
				}
				
			},
			showAddr(addr) {
				var str = [];
				addr.forEach(item => {
					str.push(item.name)
				})
				return str.join("-")
			},
			bindGoodsChange(e) {
				console.log(e)
				var provinceArr = this.provinceArr;
				var goodsVal = this.goodsVal;
				var val = e.detail.value;
				var proIndex = val[0];
				var cityIndex = val[1];
				var areaIndex = val[2];
				if (goodsVal[0] !== proIndex) {
					this.cityArr = provinceArr[proIndex].cities;
					this.areaArr = provinceArr[proIndex].cities[0].areas
					this.goodsVal = [proIndex, 0, 0]
				} else if (goodsVal[1] !== cityIndex) {
					this.areaArr = provinceArr[proIndex].cities[cityIndex].areas;
					this.goodsVal = [proIndex, cityIndex, 0]
				} else {
					this.goodsVal = [proIndex, cityIndex, areaIndex]
				}
			},
			selectType() {
				var index = this.addrType;
				this.closePopup();
				if (index == 1) {
					//装货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					var areaArr = this.areaArr;
					this.startAddr = [{
						name: provinceArr[goodsVal[0]].name,
						code: provinceArr[goodsVal[0]].code
					},{
						name: cityArr[goodsVal[1]].name,
						code: cityArr[goodsVal[1]].code
					}]
				} else if (index == 2) {
					//表示是卸货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					var areaArr = this.areaArr;
					this.arriveAddr = [{
						name: provinceArr[goodsVal[0]].name,
						code: provinceArr[goodsVal[0]].code
					},{
						name: cityArr[goodsVal[1]].name,
						code: cityArr[goodsVal[1]].code
					}]
				
				} else {
					
				}
			},
			reset() {
				if(!utils.btnRepeat()) return false; // 防抖
				this.startAddr = [];
				this.arriveAddr = [];
				this.goodsVal = [0, 0, 0];
				this.params = {
					senderProvince: '',
					senderCity: '',
					senderArea: '',
					receiverProvince: '',
					receiverCity: '',
					receiverArea: '',
					createdDt: '',
					carNo: '',
					driverName: '',
					taskId: '',
				}
			},
			find() {
				if(!utils.btnRepeat()) return false; // 防抖
				this.$refs.goodsPopup.close();
				var startAddr = this.startAddr;
				var arriveAddr = this.arriveAddr;
				var params = this.params;
				if (startAddr.length > 0) {
					this.params.senderProvince = startAddr[0].name;
					this.params.senderCity = startAddr[1].name;
				}else {
					this.params.senderProvince = '';
					this.params.senderCity = '';
				}
				if (arriveAddr.length > 0) {
					this.params.receiverProvince = arriveAddr[0].name;
					this.params.receiverCity = arriveAddr[1].name;
				}else {
					this.params.receiverProvince = '';
					this.params.receiverCity = '';
				}
				this.cancelListData = [];
				this.doneListData = [];
				this.planListData = [];
				this.planNoData = false;
				this.doneNoData = false;
				this.cancelNoData = false;
				this.getWaybillInfo();
			},
			closePopup() {
				if (this.addrType !== 3) {
					this.$refs.startPopup.close();
				} else {
					this.$refs.goodsPopup.close();
				}
				
			},
			showDriverName(name) { // 司机姓名
				if(!name) return '';
				return name;
				// return name.substr(0, 1) + '师傅';
			},
			copy(text) {
				//复制货源号
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
			call(mobile) {
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
			},
			showAddress(ary, flag) { // 展示地址
				let msg = '';
				let obj = '';
				switch(flag) {
					case 1:
						obj = ary && ary.length > 0 ? ary[0] : obj;
						break;
					case 3:
						// obj = ary && ary.length > 0 ? ary[ary.length - 1] : obj;
						let newAry = [];
						for(let i in ary) {
							if(ary[i].serialnumber == 3 || ary[i].serialnumber == 4 || ary[i].serialnumber == 8 || ary[i].serialnumber == 9 || ary[i].serialnumber == 10) {
								newAry.push(ary[i]);
							}
						}
						obj = newAry && newAry.length > 0 ? newAry[newAry.length - 1] : obj;
						break;
				}
				if(obj.provinceCode == '310000' || obj.provinceCode == '110000' || obj.provinceCode == '500000' || obj.provinceCode == '120000') {
					if(obj.provinceCode == obj.cityCode) {
						return obj.province;
					}else {
						let returnMsg = obj.province;
						returnMsg = obj.city ? returnMsg + ' ' + obj.city : returnMsg;
						return returnMsg;
					}
				}else {
					if(!obj.cityCode) {
						return obj.province
					}else if(obj.cityCode == obj.areaCode) {
						return obj.city;
					}else {
						let returnMsg = obj.city;
						returnMsg = obj.area ? returnMsg + ' ' + obj.area : returnMsg;
						return returnMsg;
					}
				}
				// if(obj.provinceCode == obj.cityCode) {
				// 	return obj.province
				// }else if(obj.cityCode == obj.areaCode) {
				// 	return obj.province + ' ' +obj.city;
				// }else {
				// 	let returnMsg = obj.province;
				// 	returnMsg = obj.city ? returnMsg + ' ' + obj.city : returnMsg;
				// 	returnMsg = obj.area ? returnMsg + ' ' + obj.area : returnMsg;
				// 	return returnMsg;
				// }
			},
			showSearchMsg() { // 运单查询条件展示
				let searchMsg = '';
				searchMsg = this.params.carNo ? '车牌号：' + this.params.carNo + '；' : searchMsg;
				searchMsg = this.params.driverName ? searchMsg + '司机姓名：' + this.params.driverName + '；' : searchMsg;
				searchMsg = this.params.taskId ? searchMsg + '运单号：' + this.params.taskId + '；' : searchMsg;
				searchMsg = this.params.senderProvince ? searchMsg + '装货点：' + this.params.senderProvince + '-' + this.params.senderCity + '；' : searchMsg;
				searchMsg = this.params.receiverProvince ? searchMsg + '卸货点：' + this.params.receiverProvince + '-' + this.params.receiverCity + '；' : searchMsg;
				searchMsg = this.params.createdDt ? searchMsg + '接单时间：' + this.params.createdDt + '；' : searchMsg;
				return searchMsg;
			},
			jumpToBeginTask(item) {
				var orderNumber = item.orderNumber;
				var userId = item.shipperUserId;
				console.log(orderNumber, "orderNumber")
				utils.postRequest("/td/order/fence/select", {orderNumber: orderNumber, userId: userId}).then(res => {
					console.log(res, "起运")
					if (res.retCode == "0000000") {
						var orderFenceVOS = res.rspBody;
						item.orderFenceVOS = orderFenceVOS;
						uni.navigateTo({
							url: '../../ship/waybill/beginTask?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=list'
						})
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
			},
			jumpToArriveTask(item) {
				var orderNumber = item.orderNumber;
				var userId = item.shipperUserId;
				console.log(orderNumber, "orderNumber")
				utils.postRequest("/td/order/fence/select", {orderNumber: orderNumber, userId: userId}).then(res => {
					console.log(res, "起运")
					if (res.retCode == "0000000") {
						var orderFenceVOS = res.rspBody;
						item.orderFenceVOS = orderFenceVOS;
						uni.navigateTo({
							url: '../../ship/waybill/arriveTask?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=list'
						})
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				
			},
			toBack() {
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.waybillPage {
		padding-top: 366rpx;
		.waybillBtn + .waybillBtn {
			margin-left: 30rpx;
		}
		.waybillBtn {
			width:156rpx;
			height: 54rpx;
			line-height: 54rpx;
			border-radius: 29rpx;
			border: 2rpx solid rgba(198, 198, 198, 1);
			font-size: 24rpx;
			color: #333333;
			text-align: center;
			&.load-complete-btn {
				color: #0171F9;
				border-color: #0171F9;
			}
		}
		.waybillHead {
			height: 276rpx;
			width: 100vw;
			background-image: url('../../../static/images/goodsDelivery/waybillHeadBc.png');
			background-size: 100%;
			background-repeat: no-repeat;
			position: fixed;
			top: 0;
			z-index: 99;
			box-sizing: border-box;
			padding-top:118rpx;
		}
		.newHeadSearch {
			display: flex;
			.backBtn {
				flex-shrink: 0;
				width: 40rpx;
				height: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-left: 32rpx;
				image {
					height: 40rpx;
				}
			}
		}
				
		.searchBox {
			flex: 1;
			background: #FFF;
			border-radius: 30rpx;
			height: 60rpx;
			margin: 0 32rpx 32rpx 32rpx;
			padding: 0 32rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.searchIcon {
				width:34rpx;
				height: 34rpx;
			}
			.searchMsg {
				font-size: 24rpx;
				line-height: 60rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
			}
		}
		.selectBox {
			box-sizing: border-box;
			padding:0 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.selectBtn {
				.btnMsg {
					font-size: 28rpx;
					text-align: center;
					line-height: 42rpx;
					color:#FFF;
				}
				.checkedBtnMsg {
					font-size: 30rpx;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 42rpx;
					text-align: center;
				}
				.btnLine {
					width:100rpx;
					height: 8rpx;
					margin-top:16rpx;
					border-radius: 4rpx 4rpx 0 0;
				}
			}
		}
		@keyframes showList {
		    0% {
				opacity: 0;
		    }
		    100% {
				opacity: 1;
		    }
		}
		.orderListBox {
			animation: showList 0.3s;
			margin:20rpx 16rpx 0 16rpx;
			border-radius: 12rpx;
			padding:20rpx 32rpx 34rpx 32rpx;
			background-color: #FFF;
			box-shadow: 0px 0px 18rpx 0px rgba(0,0,0,0.19);
			.orderHead {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.waybillNum {
					flex: 1;
					font-size: 24rpx;
					color:#333;
					display: flex;
					align-items: center;
					height: 34rpx;
					// line-height: 34rpx;
					.orderHeadIcon {
						width: 22rpx;
						height: 22rpx;
						margin:-8rpx 0 0 16rpx;
					}
				}
				.waybillStatus {
					font-size: 26rpx;
					font-weight: 500;
					color: #FF7700;
					line-height: 36rpx;
				}
			}
			.orderBody {
				padding-right: 26rpx;
				.driverMsgBox {
					padding: 30rpx 0 0 0;
					display: flex;justify-content: space-between;
					align-items: center;
					.driverDetailBox {
						flex: 1;
						.driverMsg {
							height: 44rpx;
							display: flex;
							align-items: center;
							.title {
								font-size: 32rpx;
								font-weight: 500;
								color: #333333;
							}
							.msgIcon {
								width: 40rpx;
								height: 40rpx;
								margin-left: 32rpx;
							}
						}
						.carMsg {
							margin-top: 16rpx;
							height: 40rpx;
							display: flex;
							align-items: center;
							.msg {
								font-size: 28rpx;
								color: #222;
							}
							.msg + .msg {
								margin-left:20rpx;
							}
						}
					}
					.orderPriceBox {
						.goodsPrice {
							text-align: right;
							font-size: 48rpx;
							vertical-align:bottom;
							text-align: center;
							.priceSyb {
								font-size: 28rpx;
								color: #F29347;
							}
							.orderPriceNum {
								font-weight: 500;
								color: #F29347;
							}
						}
						.deleteOrderBtn {
							width: 162rpx;
							height: 60rpx;
							line-height: 60rpx;
							border-radius: 30rpx;
							border: 2rpx solid #333333;
							box-sizing: border-box;
							text-align: center;
							font-size: 24rpx;
							color: #333333;
							margin-top: 16rpx;
						}
						.notUser {
							font-size: 28rpx;
							font-weight: 500;
							color: #0171F9;
							line-height: 40rpx;
							text-align: right;
						}
					}
					
				}
				.orderContentBox {
					padding: 12rpx 0 0 0;
					.orderAddressBox {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.orderStatus {
							width:98rpx;
							margin: 0 16rpx;
							flex-shrink: 0;
							.distanceMsg {
								font-size: 24rpx;
								font-weight: 500;
								color: #F29347;
								line-height: 34rpx;
								text-align: center;
							}
							.statusIcon {
								width:98rpx;
								height: 18rpx;
								display: block;
								margin:0 auto;
							}
						}
						.addressMsg {
							flex: 1;
							font-size: 36rpx;
							color: #333333;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							word-break: break-all;
						}
					}
					.orderGoods {
						padding-top:32rpx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						.goodsMsg {
							flex: 1;
							.msgBox + .msgBox {
								margin-top: 10rpx;
							}
							.msgBox {
								.title {
									font-size: 24rpx;
									font-weight: 400;
									color: #777;
								}
								.msg {
									font-size: 24rpx;
									font-weight: 400;
									color: #333;
								}
							}
						}
					}
				}
			}
		}
		.loadingBox {
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			flex-direction: column;
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
				width: 244rpx;
				height: 246rpx;
				margin-top:50rpx;
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
		.topPopupBox {
			background: #FFFFFF;
			overflow: hidden;
			padding: 100rpx 40rpx 40rpx;
			display: flex;
			flex-direction: column;
			.searchBox {
				background-color: red;
				flex: 1;
				background: #F5F5F5;
				border-radius: 35rpx;
				height: 54rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 0 24rpx;
				margin-bottom: 28rpx;
				margin-left: 0;
				.searchIcon {
					width:34rpx;
					height: 34rpx;
				}
				.searchMsg {
					font-size: 24rpx;
					color:#AAA;
				}
			}
			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 76rpx;
				border: 1px solid #979797;
				border-radius: 24rpx;
				box-sizing: border-box;
				margin-bottom: 24rpx;
				padding: 0 28rpx;
				.label {
					color: #222222;
					font-weight: 500;
					font-size: 28rpx;
				}
				.itemInputBox {
					display: flex;
					align-items: center;
				}
				.selectWhole {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					color: #AAAAAA;
					font-size: 28rpx;
					.addr {
						color: #333333;
					}
				}
				.arrow_down {
					width: 30rpx;
					height: 30rpx;
					padding-left: 12rpx;
				}
			}
			.popupBtnGroup {
				padding: 0;
				margin-top: 8rpx;
				display: flex;
				overflow: hidden;
				border-radius: 36rpx;
				.btnItem {
					flex: 1;
					height: 72rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					display: flex;
					justify-content: center;
					align-items: center;
					&.reset {
						background-color: #F29347;
					}
					&.find {
						background-color: #4AA2F3;
					}
				}
			}
		}
		.bottomPopupBox {
			background: #FFFFFF;
			border-radius: 36rpx 36rpx 0px 0px;
			overflow: hidden;
			.popupHead {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 36rpx;
				.title {
					height: 110rpx;
					line-height: 110rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
				}
				.cancelIconBox {
					height: 110rpx;
					width: 110rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.cancelIcon {
						width:18rpx;
						height: 18rpx;
					}
				}
			}
			.picker-view {
				height: 400rpx;
				.item {
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.popupBtnGroup {
				padding: 24rpx 36rpx;
				.comfirmBtn {
					height: 96rpx;
					line-height: 96rpx;
					background: #4AA2F3;
					border-radius: 48rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #FFFFFF;
					text-align: center;
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
	}
	.sendbox {
		margin-top: 20rpx;
		width: 100vw;
		height: 10rpx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.selected-All {
	    display: flex;
	    flex-direction: row;
	    justify-content: space-between;
	    align-items: center;
	    padding: 0 24rpx;
	    box-sizing: border-box;
	    height: 100rpx;
	    position: fixed;
	    background-color: #F3F3F3;
	    width: 100vw;
		z-index: 1;
		
	}
	.arrow_down_search {
	    width: 48rpx;
	    height: 48rpx;
	}
	.search_date {
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	}
	
</style>
