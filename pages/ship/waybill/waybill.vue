<template>
	<view class="waybill">
	
			<view class="topHead">
				<view class="headSearch">
					<image src="../../../static/images/arrow_left_white.png" class="back" mode="widthFix" @click="backPage"></image>
					<view class="searchBox" @click="showPopUp(3)">
						<view class="searchMsg" v-if="!showSearchMsg()">运单号查询</view>
						<view class="searchMsg active" v-else>{{showSearchMsg()}}</view>
						
						<image class="searchIcon" src="../../../static/images/goodsDelivery/search.png"></image>
					</view>
				</view>
				
				<view class="selectBox">
					<view class="selectBtn" v-for="(item, index) in selectData" :key="index" @tap="changeListStatus(item.value)">
						<view class="btnMsg" :style="currentIndex == item.value ? 'font-weight: 500;font-size: 30rpx' : ''">{{item.label}}</view>
						<view class="btnLine" :style="currentIndex == item.value ? 'background-color:#ffffff;' : ''"></view>
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
				<view v-if="currentIndex == 0">运单数{{listDoingTotal}}个</view>
				<view v-if="currentIndex == 1">运单数{{listStartIngTotal}}个</view>
				<view v-if="currentIndex == 2">运单数{{listEndIngTotal}}个</view>
				<view v-if="currentIndex == 3">运单数{{listCompleteTotal}}个</view>
				<view v-if="currentIndex == 4">运单数{{listCancelTotal}}个</view>
			</view>
			
			<view class="listWhole" :style="{height: contentHeight + 'rpx'}">
				<view v-show="currentIndex == 0" class="swiper-item">
					<!-- 列表模块 -->
					<view class="noData" v-if="listDoing.length < 1">
						<noData v-if="isSelectedDate" text="所选月份无运单，查看更多请选择时间"></noData>
						<noData v-else></noData>
					</view>
					<view id="content-wrap2">
						<view class="orderListBox" v-for="(item, index) in listDoing" :key="index" @tap="jumpToOrderDetails(item)">
							<view class="orderHead head04">
								<view class="waybillNum">
									运单号：{{item.taskId}}
									<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
								</view>
								<view class="status0">{{item.statusDesc}}</view>
							</view>
							<view class="orderBody">
								<view class="orderContentBox">
									<view class="orderAddressBox">
										<view class="addressMsg first">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
										<view class="orderStatus">
											<view v-if="item.orderDetailVO.estimatedDistance" class="km">{{item.orderDetailVO.estimatedDistance}}km</view>
											<image class="statusIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/nogoing.png"></image>
										</view>
										<view class="addressMsg last">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
									</view>
									<view class="orderGoods">
										<view class="goodsMsg">
											<!-- <view class="msgBox">
												<text class="title">装货时间：</text>
												<text class="msg">{{showAddrStartTime(item.orderDetailVO.child.orderLoadTimeRecordVO)}}</text>
											</view> -->
											<view class="msgBox">
												<text class="title">接单时间：</text>
												<text class="msg">{{item.createdDt}}</text>
											</view>
											<view class="msgBox">
												<text class="title">货物信息：</text>
												<text class="msg">{{showGoodsInfo(item)}}</text>
											</view>
										</view>
									</view>
									<view class="orderDriverBox">
										<view class="driverMsgBox">
											<view class="driverMsg">
												<text class="title">{{showGoodsName(item)}}</text>
											
												<image class="msgIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone.png" @click.stop="call(item.contactPhone)"></image>
											</view>
										</view>
										<view class="fixedPrice" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
											<text class="price-1">¥</text>
											<text class="price-2">{{showPrice(item.orderDetailVO)}}</text>
											<text class="price-4">/</text>
											<text class="price-3">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
										</view>	
										<view class="fixedPrice" v-else>
											<text class="price-2">价格电议</text>
										</view>	
									</view>
									<view class="goodsPriceBox">
										<view class="carItem">
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleNo}}</text>
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleLength}}米</text>
											<text>{{item.ydTaskDriverVO.vehicleType}}</text>
										</view>
										
	<!-- 									<view class="waybillBtn load-complete-btn" v-if="item.statusDesc == '已确认用车'" @click.stop="goLoadPage(item)">装货</view> -->
										<view class="waybillBtn load-complete-btn" v-if="item.status == 1" @click.stop="loadAlertStart(item)">起运</view>
										<view class="waybillBtn load-complete-btn" v-if="item.status == 2" @click.stop="receive(item)">到达</view>
									</view>
								</view>
							</view>
						</view>
						<view class="moreBox" v-if="isSelectedDate">
							<uni-more-box :isMore="isNoMore0" text="仅展示所选择月份运单，无更多数据"></uni-more-box>
						</view>
						<view class="moreBox" v-else>
							<uni-more-box :isMore="isNoMore0"></uni-more-box>
						</view>
					</view>
				</view>
				<view v-show="currentIndex == 1" class="swiper-item">
					
					<!-- 列表模块 -->
					<view class="noData" v-if="isNoData1">
						<noData v-if="isSelectedDate" text="所选月份无运单，查看更多请选择时间"></noData>
						<noData v-else></noData>
					</view>
					<view id="content-wrap0">
						
						<view class="orderListBox" v-for="(item, index) in listStartIng" :key="index" @tap="jumpToOrderDetails(item)">
							<view class="orderHead head04">
								<view class="waybillNum">
									运单号：{{item.taskId}}
									<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
								</view>
								<view class="status0">{{item.statusDesc}}</view>
							</view>
							<view class="orderBody">
								<view class="orderContentBox">
									<view class="orderAddressBox">
										<view class="addressMsg first">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
										<view class="orderStatus">
											<view v-if="item.orderDetailVO.estimatedDistance" class="km">{{item.orderDetailVO.estimatedDistance}}km</view>
											<image class="statusIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/nogoing.png"></image>
										</view>
										<view class="addressMsg last">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
									</view>
									<view class="orderGoods">
										<view class="goodsMsg">
											<view class="msgBox">
												<text class="title">接单时间：</text>
												<text class="msg">{{item.createdDt}}</text>
											</view>
											<view class="msgBox">
												<text class="title">货物信息：</text>
												<text class="msg">{{showGoodsInfo(item)}}</text>
											</view>
										</view>
									</view>
									<view class="orderDriverBox">
										<view class="driverMsgBox">
											<view class="driverMsg">
												<text class="title">{{showGoodsName(item)}}</text>
											
												<image class="msgIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone.png" @click.stop="call(item.contactPhone)"></image>
											</view>
										</view>
										<view class="fixedPrice" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
											<text class="price-1">¥</text>
											<text class="price-2">{{showPrice(item.orderDetailVO)}}</text>
											<text class="price-4">/</text>
											<text class="price-3">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
										</view>	
										<view class="fixedPrice" v-else>
											<text class="price-2">价格电议</text>
										</view>	
									</view>
									<view class="goodsPriceBox">
										<view class="carItem">
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleNo}}</text>
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleLength}}米</text>
											<text>{{item.ydTaskDriverVO.vehicleType}}</text>
										</view>
								
										<view class="waybillBtn load-complete-btn" @click.stop="loadAlertStart(item)">起运</view>
									</view>
								</view>
							</view>
						</view>
						<view class="moreBox" v-if="isSelectedDate">
							<uni-more-box :isMore="isNoMore1" text="仅展示所选择月份运单，无更多数据"></uni-more-box>
						</view>
						<view class="moreBox" v-else>
							<uni-more-box :isMore="isNoMore1"></uni-more-box>
						</view>
					</view>
					
				</view>
				<view v-show="currentIndex == 2" class="swiper-item">
					
					<!-- 列表模块 -->
					<view class="noData" v-if="isNoData2">
						<noData v-if="isSelectedDate" text="所选月份无运单，查看更多请选择时间"></noData>
						<noData v-else></noData>
					</view>
					<view id="content-wrap0">
						
						<view class="orderListBox" v-for="(item, index) in listEndIng" :key="index" @tap="jumpToOrderDetails(item)">
							<view class="orderHead head04">
								<view class="waybillNum">
									运单号：{{item.taskId}}
									<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
								</view>
								<view class="status0">{{item.statusDesc}}</view>
							</view>
							<view class="orderBody">
								<view class="orderContentBox">
									<view class="orderAddressBox">
										<view class="addressMsg first">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
										<view class="orderStatus">
											<view v-if="item.orderDetailVO.estimatedDistance" class="km">{{item.orderDetailVO.estimatedDistance}}km</view>
											<image class="statusIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/nogoing.png"></image>
										</view>
										<view class="addressMsg last">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
									</view>
									<view class="orderGoods">
										<view class="goodsMsg">
											<view class="msgBox">
												<text class="title">接单时间：</text>
												<text class="msg">{{item.createdDt}}</text>
											</view>
											<view class="msgBox">
												<text class="title">货物信息：</text>
												<text class="msg">{{showGoodsInfo(item)}}</text>
											</view>
										</view>
									</view>
									<view class="orderDriverBox">
										<view class="driverMsgBox">
											<view class="driverMsg">
												<text class="title">{{showGoodsName(item)}}</text>
											
												<image class="msgIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone.png" @click.stop="call(item.contactPhone)"></image>
											</view>
										</view>
										<view class="fixedPrice" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
											<text class="price-1">¥</text>
											<text class="price-2">{{showPrice(item.orderDetailVO)}}</text>
											<text class="price-4">/</text>
											<text class="price-3">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
										</view>	
										<view class="fixedPrice" v-else>
											<text class="price-2">价格电议</text>
										</view>	
									</view>
									<view class="goodsPriceBox">
										<view class="carItem">
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleNo}}</text>
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleLength}}米</text>
											<text>{{item.ydTaskDriverVO.vehicleType}}</text>
										</view>
								
										<view class="waybillBtn load-complete-btn" @click.stop="receive(item)">到达</view>
									</view>
								</view>
							</view>
						</view>
						
						<view class="moreBox" v-if="isSelectedDate">
							<uni-more-box :isMore="isNoMore2" text="仅展示所选择月份运单，无更多数据"></uni-more-box>
						</view>
						<view class="moreBox" v-else>
							<uni-more-box :isMore="isNoMore2"></uni-more-box>
						</view>
						
					</view>
					
				</view>
				<view v-show="currentIndex == 3">
					
					<!-- 列表模块 -->
					<view class="noData" v-if="isNoData3">
						<noData v-if="isSelectedDate" text="所选月份无运单，查看更多请选择时间"></noData>
						<noData v-else></noData>
					</view>
					<view id="content-wrap1">
						<view class="orderListBox" v-for="(item, index) in listComplete" :key="index" @tap="jumpToOrderDetails(item)">
							<view class="orderHead head04">
								<view class="waybillNum">
									运单号：{{item.taskId}}
									<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
								</view>
								<view class="status0">卸货完成</view>
							</view>
							<view class="orderBody">
								<view class="orderContentBox">
									<view class="orderAddressBox">
										<view class="addressMsg first">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
										<view class="orderStatus">
											<view v-if="item.orderDetailVO.estimatedDistance" class="km">{{item.orderDetailVO.estimatedDistance}}km</view>
											<image class="statusIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/nogoing.png"></image>
										</view>
										<view class="addressMsg last">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
									</view>
									<view class="orderGoods">
										<view class="goodsMsg">
											<view class="msgBox">
												<text class="title">接单时间：</text>
												<text class="msg">{{item.createdDt}}</text>
											</view>
											<view class="msgBox">
												<text class="title">货物信息：</text>
												<text class="msg">{{showGoodsInfo(item)}}</text>
											</view>
										</view>
									</view>
									<view class="orderDriverBox">
										<view class="driverMsgBox">
											<view class="driverMsg">
												<text class="title">{{showGoodsName(item)}}</text>
											
												<image class="msgIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone.png" @click.stop="call(item.contactPhone)"></image>
											</view>
										</view>
									</view>
									<view class="goodsPriceBox">
										<view class="carItem">
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleNo}}</text>
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleLength}}米</text>
											<text>{{item.ydTaskDriverVO.vehicleType}}</text>
										</view>
										<view class="fixedPrice" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
											<text class="price-1">¥</text>
											<text class="price-2">{{showPrice(item.orderDetailVO)}}</text>
											<text class="price-4">/</text>
											<text class="price-3">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
										</view>
										<view class="fixedPrice" v-else>
											<text class="price-2">价格电议</text>
										</view>	
										<!-- <view class="waybillBtn load-cancel-btn" @click.stop="comments(item)">评价</view> -->
									</view>
								</view>
							</view>
						</view>
						
						<view class="moreBox" v-if="isSelectedDate">
							<uni-more-box :isMore="isNoMore3" text="仅展示所选择月份运单，无更多数据"></uni-more-box>
						</view>
						<view class="moreBox" v-else>
							<uni-more-box :isMore="isNoMore3"></uni-more-box>
						</view>
						
					</view>
					
				</view>
				<view v-show="currentIndex == 4" class="swiper-item">
					
					<!-- 列表模块 -->
					<view class="noData" v-if="listCancel.length < 1">
						<noData v-if="isSelectedDate" text="所选月份无运单，查看更多请选择时间"></noData>
						<noData v-else></noData>
					</view>
					<view id="content-wrap2">
						<view class="orderListBox" v-for="(item, index) in listCancel" :key="index" @tap="jumpToOrderDetails(item)">
							<view class="orderHead head04">
								<view class="waybillNum">
									运单号：{{item.taskId}}
									<image class="orderHeadIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/orderHeadIcon.png" @click.stop="copy(item.taskId)"></image>
								</view>
								<view class="status">已取消</view>
							</view>
							<view class="orderBody">
								<view class="orderContentBox">
									<view class="orderAddressBox">
										<view class="addressMsg first">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 1)}}</view>
										<view class="orderStatus">
											<view v-if="item.orderDetailVO.estimatedDistance" class="km">{{item.orderDetailVO.estimatedDistance}}km</view>
											<image class="statusIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/nogoing.png"></image>
										</view>
										<view class="addressMsg last">{{showAddress(item.orderDetailVO.child.orderAddressVOS, 3)}}</view>
									</view>
									<view class="orderGoods">
										<view class="goodsMsg">
											<view class="msgBox">
												<text class="title">接单时间：</text>
												<text class="msg">{{item.createdDt}}</text>
											</view>
											<view class="msgBox">
												<text class="title">货物信息：</text>
												<text class="msg">{{showGoodsInfo(item)}}</text>
											</view>
										</view>
									</view>
									<view class="orderDriverBox">
										<view class="driverMsgBox">
											<view class="driverMsg">
												<text class="title">{{showGoodsName(item)}}</text>
											
												<!-- <image class="msgIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/phone.png" @click.stop="call(item.transportContractVO.senderPhone)"></image> -->
											</view>
										</view>
									</view>
									<view class="goodsPriceBox">
										<view class="carItem">
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleNo}}</text>
											<text class="pr-20">{{item.ydTaskDriverVO.vehicleLength}}米</text>
											<text>{{item.ydTaskDriverVO.vehicleType}}</text>
										</view>
										<view class="fixedPrice" v-if="item.orderDetailVO.wbQuotePrice && item.orderDetailVO.wbQuotePrice > 0">
											<text class="price-1">¥</text>
											<text class="price-2">{{showPrice(item.orderDetailVO)}}</text>
											<text class="price-4">/</text>
											<text class="price-3">{{item.orderDetailVO.child.orderQuoteVO.quotePriceTypeName}}</text>
										</view>
										<view class="fixedPrice" v-else>
											<text class="price-2">价格电议</text>
										</view>	
										<!-- <view class="waybillBtn" @click.stop="deleteTask(item)">删除</view> -->
									</view>
								</view>
							</view>
						</view>
						<view class="moreBox" v-if="isSelectedDate">
							<uni-more-box :isMore="isNoMore4" text="仅展示所选择月份运单，无更多数据"></uni-more-box>
						</view>
						<view class="moreBox" v-else>
							<uni-more-box :isMore="isNoMore4"></uni-more-box>
						</view>
					</view>
					
				</view>
				<!-- 底部加载信息模块 -->
				<view class="listLoadingBox"></view>
				<view class="sendbox"></view>
			</view>
		
		<!-- <uni-popup ref="startArrive" type="center">
			<view class="arriveContent" v-if="currentIndex == 0">
				<view class="content">是否确认起运?</view>
				<view class="btn">
					<view class="item cancel" @click="cancelArrive">取消</view>
					<view class="item confirm" @click="confirmStart">确认</view>
				</view>
			</view>
			<view class="arriveContent" v-if="currentIndex == 1">
				<view class="content">是否确认到达?</view>
				<view class="btn">
					<view class="item cancel"  @click="cancelArrive">取消</view>
					<view class="item confirm" @click="confirmArrive">确认</view>
				</view>
			</view>
		</uni-popup> -->
		<uni-popup ref="goodsPopup" type="top">
			<view class="topPopupBox">
				<view class="searchContent">
					<view class="searchBox">
						<image class="searchIcon" src="../../../static/images/goodsDelivery/search.png"></image>
						<text class="searchMsg">运单号查询</text>
					</view>
				</view>
				<view class="item">
					<view class="label">发货联系人</view>
					<view class="selectWhole">
						<input type="text" class="inputLabel" v-model="params.senderUserName" placeholder="请输入发货联系人" />
						<image src="/static/images/clear.png" class="clearIcon" @click="clear(1)" v-if="params.senderUserName"></image>
					</view>
				</view>
			<!-- 	<view class="item">
					<view class="label">接单时间</view>
					<view class="selectWhole">
						<picker mode="date" fields="day" :value="params.createdDt" :start="startDate" :end="endDate" @change="bindDateChange">
						    <view :class="params.createdDt ? 'addr' : ''">{{params.createdDt ? params.createdDt : '请选择发布时间'}}</view>
						</picker>
						<image src="/static/images/clear.png" class="clearIcon" @click="clear(2)" v-if="params.createdDt"></image>
					</view>
				</view> -->
				
				<view class="item">
					<view class="label">装货地</view>
					<view class="selectWhole" @click="showPopUp(1)">
						<view v-if="startAddr.length > 0">
							<text class="addr">{{showAddr(startAddr)}}</text>
						</view>
						<view v-else>
							<text>请选择装货地</text>
						</view>
						<image src="../../../static/images/arrow_down.png" class="arrow_down" v-if="startAddr.length < 1"></image>
						<image src="/static/images/clear.png" class="clearIcon" @click.stop="clear(3)" v-else></image>
					</view>
				</view>
				<view class="item">
					<view class="label">卸货地</view>
					<view class="selectWhole" @click="showPopUp(2)">
						<view v-if="arriveAddr.length > 0">
							<text class="addr">{{showAddr(arriveAddr)}}</text>
						</view>
						<view v-else>
							<text>请选择卸货地</text>
						</view>
						<image src="../../../static/images/arrow_down.png" class="arrow_down" v-if="arriveAddr.length<1"></image>
						<image src="/static/images/clear.png" class="clearIcon" @click.stop="clear(4)" v-else></image>
					</view>
				</view>
				<view class="item">
					<view class="label">运单号</view>
					<view class="selectWhole">
						<input type="text" class="inputLabel" v-model="params.taskId" placeholder="请输入运单号" />
						<image src="/static/images/clear.png" class="clearIcon" @click="clear(5)" v-if="params.taskId" ></image>
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
	import * as ship from "@/utils/ship"
	import noData from "@/components/noData"
	import UniMoreBox from "@/components/uni-morebox"
	
	var transportModule = uni.requireNativePlugin("TransportModule");
	export default {
		components: {
			noData,
			UniMoreBox
		},
		data() {
			return {
				createdDt: '',
				isSelectedDate: false, //时间删选后只查询当前月数据
				clicking: false,
				contentHeight: '',
				currentIndex: 0,
				selectData: [
				{
					label: '全部',
					value: 0
				},
				{
					label: '计划',
					value: 1
				},
				{
					label: '在途',
					value: 2
				},
				{
					label: '抵达',
					value: 3
				}, {
					label: '取消',
					value: 4
				}],
				selectBoxSticky: '',
				listDoing: [], //全部
				listDoingTotal: 0,
				listComplete: [], //抵达
				listCompleteTotal: 0,
				listCancel: [], //取消
				listCancelTotal: 0,
				listStartIng: [], //计划
				listStartIngTotal: 0,
				listEndIng: [], //在途
				listEndIngTotal: 0,
				isNoData0: false,
				isNoData1: false,
				isNoData2: false,
				isNoData3: false,
				isNoData4: false,
				isNoMore0: 'more',
				isNoMore1: 'more',
				isNoMore2: 'more',
				isNoMore3: 'more',
				isNoMore4: 'more',
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
					senderUserName: '',
					createdDt: '',
					taskId: '',
					createdDtStart: '',
					createdDtEnd: '',
				},
				page0: {
					pageSize: 20,
					pageNum: 1,
					
				},
				page1: {
					pageSize: 20,
					pageNum: 1,
					
				},
				page2: {
					pageSize: 20,
					pageNum: 1,
					
				},
				page3: {
					pageSize: 20,
					pageNum: 1,
					
				},
				page4: {
					pageSize: 20,
					pageNum: 1,
				},
				statusBarHeight: 44,
				scroll1: 0,
				scroll2: 0,
				scroll3: 0,
				
			};
		},
		async onLoad(options) {

			this.quote = options.type;
			var windowWidth = uni.getSystemInfoSync().windowWidth;
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight
			//初始化装卸货地，日期删选条件
			var result = await ship.postRequest("/ts/nationDict/getBasicData");
			var provinceArr = result.rspBody;
			var cityArr = provinceArr[0].cities
		
			this.provinceArr = provinceArr;
			this.cityArr = cityArr;
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			console.log(windowHeight, 'aa')
			this.contentHeight = windowHeight*2 - 276 - 100;
			
			//交委打卡
			uni.$on("locationData", params => {		
				console.log(params, '收到的数据111')
				//打卡发送交委
				transportModule.send(params, response => {
					
				})
			})

		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
		},
		onShow() {
			var _this = this;
			var currentIndex = this.currentIndex;
			this.getList('refresh', currentIndex);
			var jiaoweiParams = uni.getStorageSync("jiaoweiParams");
			var shipperComName = uni.getStorageSync("shipperComName");
			var platForm = uni.getSystemInfoSync().platform;
			var env = ship.env;
			console.log(jiaoweiParams, 'jiaoweixinxi')
			if (platForm == "android" && jiaoweiParams && env == 'pro') {
				var jiaoweiObj = JSON.parse(jiaoweiParams);
				if (shipperComName.indexOf("福建成达") > -1) {
					transportModule.auth({
						appId: 'uni.UNIWNQ0000',
						appSecurity: 'c56052dba4c347389cfed2cf94623d47ddad91f99c484e909ee125fe8552c8e4',
						enterpriseSenderCode: '350923921813c0398947',
						environment: 'release'
					}, res => {
						transportModule.start(jiaoweiObj, response => {
							
						})
					})
				} else if (shipperComName.indexOf("观达") > -1) {
					transportModule.auth({
						appId: 'uni.UNIWNQ0000',
						appSecurity: '810bedcc0ad347de9d1bf523384c4524fc6e7ee51d2c4c5babfcdb2ba88e729e9b333da5fb914df58cce8c34c18cf16a4c4a659e0a2142b7940b99d18fc1ca39',
						enterpriseSenderCode: '3400000192',
						environment: 'release'
					}, res => {
						transportModule.start(jiaoweiObj, response => {
							
						})
					})
				} else if (shipperComName.indexOf("货道") > -1) {
					transportModule.auth({
						appId: 'uni.UNIWNQ0000',
						appSecurity: '8f3ab15146a543fe9cce90a7418a2f655d6ca199bdeb4e3aa61006d37bff0cffe8b0b20450e2434496d458f8b03e97109afbd8f426a44011841e7a772699942f',
						enterpriseSenderCode: '3400000063',
						environment: 'release'
					}, res => {
						transportModule.start(jiaoweiObj, response => {
							
						})
					})
				} else if (shipperComName.indexOf("榆林") > -1) {
					transportModule.auth({
						appId: 'uni.UNIWNQ0000',
						appSecurity: '4fd0776dad0f4312a24075245b89028f41cbfb862f9642faa1ec488be9303419',
						enterpriseSenderCode: '6110044',
						environment: 'release'
					}, res => {
						transportModule.start(jiaoweiObj, response => {
							
						})
					})
				}
				
				
				_this.servalTimeout = clearInterval(_this.servalTimeout);
				_this.servalTimeout = setInterval(() => {
					//打卡发送交委
					var jiaowei = uni.getStorageSync("jiaoweiParams");
					if (!jiaowei) {
						_this.servalTimeout = clearInterval(_this.servalTimeout);
					} else {
						var jiaoweiOBJ = JSON.parse(jiaowei);
						transportModule.send(jiaoweiOBJ, response => {
							
						})
					}
					
				}, 120000)
			} else {
				_this.servalTimeout = clearInterval(_this.servalTimeout);
			}
			
			
		},
		onPullDownRefresh() {
			var currentIndex = this.currentIndex;
			var listDoing = this.listDoing;
			var listComplete = this.listComplete;
			var listCancel = this.listCancel;
			this.getList('refresh', currentIndex);
		},
		onReachBottom() {
			var currentIndex = this.currentIndex;
			var isNoMore1 = this.isNoMore1;
			var isNoMore2 = this.isNoMore2;
			var isNoMore3 = this.isNoMore3;
			var isNoMore4 = this.isNoMore4;
			var isNoMore0 = this.isNoMore0;
			if (currentIndex == 0 && isNoMore0 == "more") {
				
				this.isNoMore0 = "loading"
				this.getList("more", currentIndex)
			}
			if (currentIndex == 1 && isNoMore1 == "more") {
				
				this.isNoMore1 = "loading"
				this.getList("more", currentIndex)
			}
			if (currentIndex == 2 && isNoMore2 == "more") {
				
				this.isNoMore2 = "loading"
				this.getList("more", currentIndex)
			}
			if (currentIndex == 3 && isNoMore3 == "more") {
				this.isNoMore3 = "loading"
				this.getList("more", currentIndex)
			}
			if (currentIndex == 4 && isNoMore4 == "more") {
				this.isNoMore4 = "loading"
				this.getList("more", currentIndex)
			}
		},
		onBackPress() {
			if (this.quote == "quote") {
				return true
			} else {
				return false
			}
		},
		methods: {
			backPage() {
				if (this.quote == "quote") {
					uni.switchTab({
						url: '../index/index1'
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
				
			},
			clear(index) {
				if (index == 1) {
					this.params.senderUserName = ""
				} else if (index == 2) {
					this.params.createdDt = ""
				} else if (index == 3) {
					this.params.senderProvince = ""
					this.params.senderCity = "";
					this.params.senderArea = "";
					this.startAddr= [];
				} else if (index == 4) {
					this.params.receiverProvince = ""
					this.params.receiverCity = "";
					this.params.receiverArea = ""
					this.arriveAddr = [];
				} else {
					this.params.taskId = ""
				}
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
				//设置日期信息
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
				var currentIndex = this.currentIndex;
				this.getList("refresh", currentIndex);
			},
			showSearchMsg() { // 运单查询条件展示
			    let searchMsg = '';
			    searchMsg = this.params.senderUserName ? '发货联系人：' + this.params.senderUserName + '；' : searchMsg;
			    searchMsg = this.params.createdDt ? searchMsg + '接单时间：' + this.params.createdDt + '；' : searchMsg;
			    searchMsg = this.params.senderProvince ? searchMsg + '装货点：' + this.params.senderProvince + '-' + this.params.senderCity + '；' : searchMsg;
			    searchMsg = this.params.receiverProvince ? searchMsg + '卸货点：' + this.params.receiverProvince + '-' + this.params.receiverCity + '；' : searchMsg;
			    searchMsg = this.params.taskId ? searchMsg + '运单号：' + this.params.taskId + '；' : searchMsg;
			    return searchMsg;
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
			},
			showGoodsName(item) {
				var gender = item.gender;
				var shipperComName = item.shipperComName;
				if (shipperComName) return shipperComName;
				var userName = item.shipperUserName;
				var subName = gender == "男" ? '先生' : '女士';
				return userName.substring(0, 1) + subName;
			},
			showAddrStartTime(timeArr) {
				var findIndex = timeArr.findIndex(item => {
					return item.serialnumber == 1 || item.serialnumber == 2
				})
				return timeArr[findIndex].startDt
			},
			showGoodsInfo(item) {
				var transportContractVO = item.transportContractVO;
				var weight =  transportContractVO.cargoWeight || 0;
				var volume =  transportContractVO.cargoVolume || 0;
				var str = item.goodsName;
				
				if (weight) {
					str += ' ' + weight + '吨'
				}
				if (volume){
					str += ' ' + volume + '方'
				}
				return str
			},
			showPrice(item) {
				return (item.wbQuotePrice/100).toFixed(2)
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
			deleteTask(task) {
				//删除运单
				uni.showModal({
					title: '确定删除吗?',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中'
							})
							ship.postRequest("/yd/task/remove?taskSId=" + task.taskId)
							.then(res => {
								uni.hideLoading()
								if (res.retCode == "0000000") {
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									})
									uni.$emit("delRefresh");
									
								} else {
									uni.showToast({
										title: res.retDesc,
										icon: 'none'
									})
								}
							}).catch(err => {
								uni.hideLoading()
							})
						}
					}
				})
			},
			async getList(type, status) {
				//获取运单列表
				var currentIndex = status !== undefined ? status : this.currentIndex;
				var params = this.params;
				params.shipperUserName = params.senderUserName;
				var dataParams;
				if (currentIndex == 0) {
					this.page0.status !== undefined && delete this.page0.status;
					if(type == 'refresh') {
						this.page0.pageNum = 1
					} else {
						this.page0.pageNum ++
					}
					dataParams = Object.assign({}, params, this.page0);
				} else if (currentIndex == 1) {
					this.page1.status = 1;
					if(type == 'refresh') {
						this.page1.pageNum = 1
					} else {
						this.page1.pageNum ++
					}
					dataParams = Object.assign({},params, this.page1);
				} else if (currentIndex == 2) {
					this.page2.status = 2
					if(type == 'refresh') {
						this.page2.pageNum = 1
					} else {
						this.page2.pageNum ++
					}
					dataParams = Object.assign({},params, this.page2);
				} else if (currentIndex == 3) {
					this.page3.status = 3
					if(type == 'refresh') {
						this.page3.pageNum = 1
					} else {
						this.page3.pageNum ++
					}
					dataParams = Object.assign({},params, this.page3);
				} else {
					this.page4.status = 0;
					if(type == 'refresh') {
						this.page4.pageNum = 1
					} else {
						this.page4.pageNum ++
					}
					dataParams = Object.assign({},params, this.page4);
				}
				if (!dataParams.createdDt) {
					delete dataParams.createdDt
				}
				if (dataParams.createdDt) {
					dataParams.createdDt = dataParams.createdDt + ' ' + '00:00:00';
				}
				if (!this.isSelectedDate) {
					dataParams.createdDtStart && delete dataParams.createdDtStart
					dataParams.createdDtEnd && delete dataParams.createdDtEnd
				}
				
				console.log(dataParams, '参数11', params,this.page0)
				try{
					var res = await ship.postRequest("/yd/task/getDriverYdTaskByParam", dataParams);
					console.log(res.rspBody, '再撒上');
					// console.log(uni.getStorageSync("userInfo"))
					uni.stopPullDownRefresh();
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var items = res.rspBody.items;
						if (currentIndex == 0) {
							if (type == "refresh") {
								this.listDoingTotal = res.rspBody.total;
								this.listDoing = res.rspBody.items;
								this.isNoData0 = res.rspBody.items.length > 0 ? false : true;
								this.isNoMore0 = res.rspBody.items.length > 0 && res.rspBody.items.length < this.page1.pageSize ? 'noMore' : 'more'
								var total = res.rspBody.total;
								uni.setStorageSync("planWaybillTotal", total);
							} else {
								this.listDoing = this.listDoing.concat(res.rspBody.items)
								this.isNoData0 = false
								this.isNoMore0 = res.rspBody.items.length < this.page0.pageSize ? 'noMore' : 'more'
							}
						} else if (currentIndex == 1) {
							if (type == "refresh") {
								this.listStartIngTotal = res.rspBody.total;
								this.listStartIng = res.rspBody.items;
								this.isNoData1 = res.rspBody.items.length > 0 ? false : true;
								this.isNoMore1 = res.rspBody.items.length > 0 && res.rspBody.items.length < this.page1.pageSize ? 'noMore' : 'more'
							} else {
								this.listStartIng = this.listStartIng.concat(res.rspBody.items)
								this.isNoData1 = false
								this.isNoMore1 = res.rspBody.items.length < this.page1.pageSize ? 'noMore' : 'more'
							}
						} else if (currentIndex == 2) {
							if (type == "refresh") {
								this.listEndIngTotal = res.rspBody.total;
								this.listEndIng = res.rspBody.items;
								this.isNoData2 = res.rspBody.items.length > 0 ? false : true;
								this.isNoMore2 = res.rspBody.items.length > 0 && res.rspBody.items.length < this.page2.pageSize ? 'noMore' : 'more'
							} else {
								this.listEndIng = this.listEndIng.concat(res.rspBody.items)
								this.isNoData2 = false
								this.isNoMore2 = res.rspBody.items.length < this.page2.pageSize ? 'noMore' : 'more'
							}
						} else if (currentIndex == 3) {
							if (type == "refresh") {
								this.listCompleteTotal = res.rspBody.total;
								this.listComplete = res.rspBody.items;
								this.isNoData3 = res.rspBody.items.length > 0 ? false : true;
								this.isNoMore3 = res.rspBody.items.length > 0 && res.rspBody.items.length < this.page3.pageSize ? 'noMore' : 'more'
							} else {
								this.listComplete = this.listComplete.concat(res.rspBody.items)
								this.isNoData3 = false
								this.isNoMore3 = res.rspBody.items.length < this.page3.pageSize ? 'noMore' : 'more'
							}
						} else {
							if (type == "refresh") {
								this.listCancelTotal = res.rspBody.total;
								this.listCancel = res.rspBody.items;
								this.isNoData4 = res.rspBody.items.length > 0 ? false : true;
								this.isNoMore4 = res.rspBody.items.length > 0 && res.rspBody.items.length < this.page4.pageSize ? 'noMore' : 'more'
							} else {
								this.listCancel = this.listCancel.concat(res.rspBody.items)
								this.isNoData4 = false;
								this.isNoMore4 = res.rspBody.items.length < this.page4.pageSize ? 'noMore' : 'more'
							}
						}
					} else {
						this.isNoData0 = true;
						this.isNoData1 = true;
						this.isNoData2 = true;
						this.isNoData3 = true;
						this.isNoData4 = true;
					}
					
				}catch(e){
					console.log(e)
					//TODO handle the exception
					uni.stopPullDownRefresh()
				}
			},
			changeListStatus(flag) { // 订单状态切换，当切换不同tab时将滑动距离重置为0
				if(this.currentIndex != flag) {
					this.isSelectedDate = false;
					this.currentIndex = flag;
					//清除日期
					this.createdDt = "";
					this.params.createdDtStart = "";
					this.params.createdDtEnd = "";
					this.getList('refresh', flag);
				}
			},
			showOrderStatusBc() { // 根据不同的订单状态展示不同的头部颜色
				if(this.currentIndex == 2) {
					return 'background: linear-gradient(-180deg, #AAAAAA 0%, #777777 100%);';
				} else { 
					return 'background: linear-gradient(-180deg, #74C1FD 0%, #4AA2F3 100%);';
				}
				// switch(this.selectFlag) {
				// 	case 1:
				// 		return 'background: linear-gradient(-180deg, #74C1FD 0%, #4AA2F3 100%);';
				// 	case 2:
				// 		return 'background: linear-gradient(-180deg, #FFBD88 0%, #F29347 100%);';
				// 	case 3:
				// 		return 'background: linear-gradient(-180deg, #6CE3AD 0%, #4DD0A1 100%);';
				// 	case 4:
				// 		return 'background: linear-gradient(-180deg, #6CE3AD 0%, #4DD0A1 100%);';
				// 	case 5:
				// 		return 'background: linear-gradient(-180deg, #AAAAAA 0%, #777777 100%);';
				// }
			},
			jumpToOrderDetails(item) {
				var waybillDetails = JSON.stringify(item);
				uni.navigateTo({
					url: './waybillDetails?waybillDetails=' + waybillDetails
				})
			},
			comments(item) {
				uni.navigateTo({
					url: '../../goodsDelivery/userCenter/complaintsRecord/commentsWaybill?taskId=' + item.taskId + '&shipperUserId=' + item.shipperUserId + '&driverUserId=' + item.driverUserId
				})
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
					
					this.goodsVal = [proIndex, 0]
				} else if (goodsVal[1] !== cityIndex) {
					
					this.goodsVal = [proIndex, cityIndex]
				} else {
					this.goodsVal = [proIndex, cityIndex]
				}
			},
			showPopUp(index) {
				this.addrType = index;
				if (index !== 3) {
					var provinceArr = this.provinceArr;
					
					this.cityArr = provinceArr[0].cities;
					this.goodsVal = [0, 0, 0];
					this.$refs.startPopup.open();
				} else {
					this.$refs.goodsPopup.open();
				}
				
			},
			reset() {
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
					senderUserName: '',
					createdDt: '',
					taskId: '',
					
				}
				this.find();
			},
			find() {
				this.$refs.goodsPopup.close();
				var startAddr = this.startAddr;
				var arriveAddr = this.arriveAddr;
				var params = this.params;
				if (startAddr.length > 0) {
					this.params.senderProvince = startAddr[0].name;
					this.params.senderCity = startAddr[1].name;
				}
				if (arriveAddr.length > 0) {
					this.params.receiverProvince = arriveAddr[0].name;
					this.params.receiverCity = arriveAddr[1].name;
				}
				var currentIndex = this.currentIndex;
				this.getList("refresh", currentIndex);
			},
			selectType() {
				var index = this.addrType;
				this.closePopup();
				if (index == 1) {
					//装货
					var goodsVal = this.goodsVal;
					var provinceArr = this.provinceArr;
					var cityArr = this.cityArr;
					
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
			showAddr(addr) {
				var str = [];
				addr.forEach(item => {
					str.push(item.name)
				})
				return str.join("-")
			},
			closePopup() {
				if (this.addrType !== 3) {
					this.$refs.startPopup.close();
				} else {
					this.$refs.goodsPopup.close();
				}
				
			},
			call(mobile) {
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
			},
			goLoadPage(item) {
				uni.navigateTo({
					url: './loadingTask?sid=' + item.sid + '&pageFrom=list'
				})
			},
			loadAlertStart(item) {
				var orderNumber = item.orderNumber;
				var userId = item.shipperUserId
				console.log(orderNumber, "orderNumber")
				ship.postRequest("/td/order/fence/select", {orderNumber: orderNumber, userId: userId}).then(res => {
					console.log(res, "起运")
					if (res.retCode == "0000000") {
						var orderFenceVOS = res.rspBody;
						item.orderFenceVOS = orderFenceVOS;
						uni.navigateTo({
							url: './beginTask?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=list'
						})
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				
			},
			
			receive(item) {
				//抵达
				if (item.status != 2 && item.isSync == 1) {
					uni.showToast({
						title: '请先起运',
						icon: 'none'
					})
					return;
				}
				var orderNumber = item.orderNumber;
				var userId = item.shipperUserId;
				ship.postRequest("/td/order/fence/select", {orderNumber: orderNumber, userId: userId}).then(res => {
					if (res.retCode == "0000000") {
						var orderFenceVOS = res.rspBody;
						item.orderFenceVOS = orderFenceVOS;
						uni.navigateTo({
							url: './arriveTask?waybillDetail=' + JSON.stringify(item) + '&sid=' + item.sid + '&isSync=' + item.isSync + '&pageFrom=list'
						})
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				
				
			},
			cancelArrive() {
				this.$refs.startArrive.close();
			},
			unLoadImg(item) {
				//卸货完成
				if (item.status != 3 && item.isSync == 1) {
					uni.showToast({
						title: '请先抵达',
						icon: 'none'
					})
					return;
				}
				uni.navigateTo({
					url: './unLoadingTask?item=' + JSON.stringify(item)
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.pr-20 {
		padding-right:  20rpx;
	}
	.waybill {
		min-height: 100vh;
		background-color: rgba(243, 243, 243, 1);
		
		.back {
			width: 40rpx;
		}
		.back1 {
			width: 20rpx;
		}
		.topHead {
			height: 276rpx;
			width: 100vw;
			background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/waybill_top_bg.png");
			background-size: cover;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9;
		}
		.headSearch {
			padding:0 40rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100vw;
			box-sizing: border-box;
			z-index: 9;
			height: 60rpx;
			&.radius {
				border-radius: 0 0 24rpx 24rpx;
			}
		}
		.searchBox {
			flex: 1;
			background: #FFFFFF;
			border-radius: 30rpx;
			height: 60rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-left: 20rpx;
			padding-left: 32rpx;
			box-sizing: border-box;
			.searchIcon {
				width:34rpx;
				height: 34rpx;
				margin-right: 32rpx;
			}
			.searchMsg {
				font-size: 24rpx;
				color:#AAA;
				width: calc(100vw - 250rpx);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				&.active {
					color: #333333;
				}
			}
		}
		.selectBox {
			height: 84rpx;
			width: 100vw;
			padding: 0 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			z-index: 99;
			box-sizing: border-box;
			.selectBtn {
				height: 80rpx;
				display: flex;
				flex-direction: column;
				.btnMsg {
					font-size: 28rpx;
					text-align: center;
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #FFFFFF;
				}
				.btnLine {
					width:100rpx;
					height: 8rpx;
					border-radius: 4rpx ;
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
		.listWhole {
			background-color: #F3F3F3;
			box-sizing: border-box;
			padding-top: 386rpx;
		}
		.orderListBox {
			margin:0 16rpx;
			height: 416rpx;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
			box-sizing: border-box;
			border-radius: 12rpx;
			box-shadow: 0 0 18rpx 0 rgba(0, 0, 0, 0.19);
			background-color: #FFFFFF;
			.orderHead {
				height: 85rpx;
				display: flex;
				padding:0 32rpx;
				justify-content: space-between;
				align-items: center;
				.status0 {
					color: #FF7700;
				}
				&.head00 {
				
				}
				&.head01 {
				
				}
				&.head02 {
					
				}
				&.head03 {
					color: #777777;
					font-size: 26rpx;
					font-weight: 500;
				}
				&.head04 {
					color: #777777;
					font-size: 26rpx;
					font-weight: 500;
				}
				.waybillNum {
					flex: 1;
					height: 78rpx;
					font-size: 24rpx;
					color:#333333;
					display: flex;
					align-items: center;
					.orderHeadIcon {
						width: 22rpx;
						height: 22rpx;
						margin:0 0 0 20rpx;
					}
				}
				.payDone {
					background: linear-gradient(180deg, #6CE3AD 0%, #4DD0A1 100%);
					border-radius: 24rpx 24rpx 0px 0px;
					padding: 0 30rpx;
					font-size: 24rpx;
					height: 78rpx;
					line-height: 78rpx;
					color: #FFFFFF;
				}
			}
			.orderBody {
				.orderDriverBox {
					margin: 28rpx 32rpx 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.driverMsgBox {
						.driverMsg {
							display: flex;
							align-items: center;
							flex-direction: row;
							.title {
								font-size: 32rpx;
								color:#333;
								font-weight: 500;
								 overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								max-width: 300rpx;
							}
							.msgIcon {
								margin-left: 32rpx;
								height: 40rpx;
								width: 40rpx;
							}
						}
						.driverMsg {
							height: 44rpx;
							display: flex;
							align-items: center;
						}
						.carMsg {
							margin-top: 12rpx;
							height: 40rpx;
							display: flex;
							align-items: center;
							.msg + .msg {
								margin-left:20rpx;
							}
						}
					}
				}
				.orderContentBox {
					.orderAddressBox {
						padding: 0 32rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						
						.orderStatus {
							width:120rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							.statusIcon {
								width:98rpx;
								height: 18rpx;
								margin:0 16rpx;
							}
							.status {
								color: rgba(119, 119, 119, 1);
								font-size: 22rpx;
								padding-top: 5rpx;
							}
						}
						.addressMsg {
							font-size: 40rpx;
							font-weight: 500;
							color: #333333;
							width: 300rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							&.first {
								text-align: left;
							}
							&.last {
								text-align: right;
							}
						}
					}
					.orderGoods {
						padding: 30rpx 32rpx 0;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						.goodsMsg {
							flex: 1;
							.msgBox + .msgBox {
								margin-top: 20rpx;
							}
							.msgBox {
								.title {
									font-size: 26rpx;
									font-weight: 400;
									color: #777;
								}
								.msg {
									font-size: 26rpx;
									font-weight: 400;
									color: #333;
								}
							}
						}
					}
					.fixedPrice {
						font-size: 28rpx;
						color: #F29347;
						position: absolute;
						right: 48rpx;
						font-weight: 500;
						.price-2 {
							font-family: 'Price font';
							font-size: 48rpx;
							
						}
					}
					.goodsPriceBox {
						padding:0 32rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.carItem {
							font-size: 28rpx;
							color: #222222;
						}
						.waybillBtn {
							width:162rpx;
							height: 60rpx;
							line-height: 60rpx;
							border-radius: 30rpx;
							border: 2rpx solid #333333;
							font-size: 24rpx;
							color: #333333;
							text-align: center;
							&.load-complete-btn {
								color: #0171F9;
								border-color: #0171F9;
							}
							&.load-cancel-btn {
								color: #333333;
								border-color: #333333;
							}
							&.active {
								border-color: #4AA2F3;
								color: #4AA2F3;
							}
						}
					}
				}
			}
		}
		.listLoadingBox {
			height: 48rpx;
		}
	}
	.topPopupBox {
		background: #FFFFFF;
		border-radius: 36rpx 36rpx 0px 0px;
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
				.clearIcon {
					width: 50rpx;
					height: 50rpx;
				}
				.inputLabel {
					font-size: 28rpx;
					text-align: right;
					color: #333333;
				}
				.arrow_down {
					width: 30rpx;
					height: 30rpx;
				}
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
	.noData {
		height: 400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.moreBox {
		padding-top: 20rpx;
	}
	.arriveContent {
		width: calc(100vw - 128rpx);
		height: 290rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		.btn {
			height: 92rpx;
			display: flex;
			flex-direction: row;
			border-top: 1px solid #F3F3F3;
			.item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				&.cancel {
					color: #777777;
					border-right: 1px solid #F3F3F3;
				}
				&.confirm {
					color: #0171F9;
				}
			}
		}
		.content {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #777777;
			font-size: 32rpx;
		}
	}
	.km {
		font-size: 24rpx;
		color: #F29347;
	}
	.sendbox {
		width: 100vw;
		height: 10rpx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
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
	.list-all {
	    padding-top: 15rpx;
	}

</style>
