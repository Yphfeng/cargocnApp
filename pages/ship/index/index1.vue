<template>
	<view style="width: 100vw;height: 100vh;" class="shipIndex" :class="[{noScoller: isNoScroll}]">
		<view class="notLoagin" v-if="showGuide == 1">
		  <swiper
		    class="swiper"
		    :indicator-dots="false"
		    indicator-active-color="#3375F6"
			:disable-touch="true"
		  >
		    <block v-for="(item, index) in splashBanner" :key="index">
		      <swiper-item class="swiper-child">
		        <image :src="item.advUrl" class="swiper" mode="aspectFill" />
		        <view class="skip-box" @click="backTap">跳过</view>
		        <view class="swiper-text" v-if="index + 1 == splashBanner.length">
		          <view class="btn-box" @click="backTap">
                <view class="btn-i">{{advertiesTimeOutNum}}</view>
                <view class="btn-i">关闭</view>
              </view>
		        </view>
		      </swiper-item>
		    </block>
		  </swiper>
		</view>
    
		<view v-if="showGuide == 2">
		<!-- 	<view class="luck_draw" @mousemove="move" @touchmove.stop="move" :style="{ top: position.y + 'px', left: position.x + 'px' }" :class="hideFixedIcon ? 'hide_icon':''" v-if="showLuckDraw && avticeIconObj.luckDrawFlag" >
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/luckDraw.gif" @click="goLuckDraw" class="advers-close"></image>
				<image class="close_act" src="/static/images/ChinaTravel/close.png" @click="closeLuckDrawlAct"></image>
			</view>
			<view class="redPacket" @mousemove="move3" @touchmove.stop="move3" :style="{ top: position.y3 + 'px', left: position.x3 + 'px' }" :class="hideFixedIcon ? 'hide_icon':''" v-if="avticeIconObj.redPacketFlag" >
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/redPacket_index_icon.png" @click="goRedPacket" class="advers-close"></image>
				<image class="close_act" src="/static/images/ChinaTravel/close.png" @click="closeRedPacket"></image>
			</view>
			<view class="China_Travel" @mousemove="move2" @touchmove.stop="move2" :style="{ top: position.y2 + 'px', left: position.x2 + 'px' }" :class="hideFixedIcon ? 'hide_icon':''" v-if="ChinaTravelObj.show && avticeIconObj.ChinaTravelFlag" >
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ChinaTravel.png" @click="goBtnChinaTravel" class="advers-close"></image>
				<image class="close_act" src="/static/images/ChinaTravel/close.png" @click="closeChinaTravelAct"></image>
			</view> -->
			<view class="index" :class="[{noScoller: isAlert || isFleetAlert || isAlertShow || remindStatus}]">
				<view class="tabWhole">
					<view class="statusBarHeight" :style="{height: statusBarHeight*2 + 'rpx'}" /> 
					<view class="indexHead">
						<view class="positioning" @click="getLocation">
							<image class="positioningIcon" src="/static/images/ship/positioningIcon.png"></image>
							<view class="msg">{{addressLocation ? addressLocation : '请定位'}}</view>
						</view>
						<view class="side">
							<view class="taskBox" @click.stop="switchOnLine" :style="taskStatus == 1 || taskStatus == undefined ? 'background:#64BD70;' : 'background:#FFB661;'">
								<view class="taskLine" style="margin-right:22rpx;" v-if="taskStatus != 1 && taskStatus != undefined"></view>
								<view class="taskMsg">{{(taskStatus == 1 || taskStatus == undefined)  ? '可接单' : '忙碌'}}</view>
								<view class="taskLine" style="margin-left:12rpx;" v-if="taskStatus == 1 || taskStatus == undefined"></view>
							</view>
							<image class="scan-box" src="/static/images/ship/scan.png" mode="widthFix" @click="requestPower"></image>
							<view class="hintBox1" @click="showNews">
								<image class="hintBoxIcon" mode="widthFix" src="/static/images/ship/notice.png"></image>
								<view class="dotted"></view>
							</view>
						</view>
					</view>
					<view class="tabs-row">
						<view class="tabs" :class="{active: isTabIndex == 1}">
							<view class="tabItem" :class="{active: index == isTabIndex}" v-for="(item, index) in tabTitle" @click="switchTab(index)" :key="index">
								<text :class="{active: index + 1 == tabTitle.length}">{{item}}</text>
							</view>
						</view>
						<view class="waybill" @click="toWaybill">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/waybill-icon.png" class="waybill-icon"></image>
							<text>运单</text>
							<view class="dotted"></view>
						</view>
					</view>
					
				</view>
				
				
				<view class="tabContent" :style="{'padding-top': (180 + statusBarHeight*2) + 'rpx','min-height': tabContentHeight + 'rpx' }">
					<skeleton :loading="loading" :showAvatar="false"  :imgTitle="false" :column="skeleton1.column" :showColumn="true" flexType="center">
						<view>
							<view class="tabContentItem"  v-show="isTabIndex == 0">
								<!-- 	<view class="advs">
									<image src="../../../static/images/ship/adv.png" mode="aspectFill"  class="mainBanner" @click="goReport"></image>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adverties.gif"  class="advertiesGif"></image>
								</view> -->
								<view style="height: 26rpx;" />
								<!-- <view class="advs" v-if="mainBanner.advUrl">
									<image :src="mainBanner.advUrl" mode="aspectFill"  class="mainBanner" @click="showBigBanner(mainBanner, mainBanner.bigAdvUrl)"></image>
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adverties.gif"  class="advertiesGif"></image>
								</view> -->
								<view class="tips" v-if="isVerify">
									<view class="tipsText">您的资料还未认证，快去认证吧</view>
									<view class="btnContent">
										<view class="btnCheck" @click="goVerify">
											去认证
										</view>
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/tips-close.png" class="close" @click="closeVerify"></image>
									</view>
								</view>
								
								<view class="searchInfo">
									<view class="item start" @click="showPopUp(1)">
										<text v-if="showAddr(zhuang1)">{{showAddr(zhuang1)}}</text>
										<text class="default" v-else>选择装货地</text>
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_down_white.png" class="arrow_down_white"></image>
									</view>
									<view class="middle">到</view>
									<view class="item end" @click="showPopUp(2)">
										<text v-if="showAddr(xie1)">{{showAddr(xie1)}}</text>
										<text class="default" v-else>选择卸货地</text>
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_down_white.png" class="arrow_down_white"></image>
									</view>
								</view>
								<view class="searchInfo">
									<view class="chooseCar" @click="showCarAlert" v-if="dataParams02.vehicleLength">{{dataParams02.vehicleLength}}米{{dataParams02.vehicleModel}}</view>
									<view class="chooseCar default" @click="showCarAlert" v-else>
										选择车长车型
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_down_white.png" class="arrow_down_white"></image>
									</view>
									<view class="middle"></view>
									<view class="choose-btn" @click="toSearch(0)">搜货源</view>
								</view>
								
								<!-- 订单列表模块 -->
								<view>
									<view class="orderList" v-for="(item, index) in platformQuoteList" :key="index" @click="goDetail(item, 3)">
										<view class="platform">
											<view class="orderAddress">
												{{showSendAddress(item)}}
												<view class="notOngoing">
													<view class="notOngoing-content">
														<image class="addressStatus_1" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/notOngoing_2.png" mode="widthFix"></image>
														<text class="notOngoing-text" v-if="item.estimatedDistance && item.estimatedDistance != 0">{{item.estimatedDistance}}km</text>
													</view>
													
												</view>
												
												{{showArriveAddress(item)}}
													
											</view>
										
											<view class="orderContent">
													
												<view class="goodsItem_second_content">
													<text class="goodsType">{{showVehicleLength(item)}}</text>
													<text class="goodsType type_1"> {{showVehicleModel(item)}}</text>
													<text class="goodsType type_2">{{item.cargoTypeName4}}</text>							
													<text  v-if="item.cargoWeight" class="goodsType unit">{{item.cargoWeight}}{{showCargoUnit(item.cargoUnit)}}</text> 			
													<text v-if="item.cargoVolume" class="goodsType unit">{{item.cargoVolume}}方</text>
												</view>
												<view class="fixedPrice" v-if="item.fixPrice">
													¥{{showPrice(item.fixPrice)}}/{{item.quotePriceTypeName}}
												</view>
												<view class="fixedPrice" v-else>
													价格电议
												</view>
											</view>
											<view class="remark">备注：{{showRemark(item)}}</view>
											<view class="price-item">
												<text class="date">{{showPushDt(item.pushDt)}}</text>
												<view class="goPrice" @click="goDetail(item, 3)">去接单</view>
											</view>
										</view>	
										
										
									</view>
								
								</view>
								<view class="recond-content" v-if="recondArr.length > 0">
									<view class="recond-title">
										<view class="main">推荐货源</view>
										<view class="sub">该条线路无更多符合条件货源，为您推荐</view>
									</view>
									<view class="orderList" v-for="(item, index) in recondArr" :key="index" @click="goDetail(item, 3)">
										<view class="platform">
											
											<view class="orderAddress">
												
													{{showSendAddress(item)}}
													
													
												<view class="notOngoing">
													<view class="notOngoing-content">		
														<image class="addressStatus_1" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/notOngoing_2.png" mode="widthFix"></image>
														<text class="notOngoing-text" v-if="item.estimatedDistance && item.estimatedDistance != 0">{{item.estimatedDistance}}km</text>
													</view>
												</view>
												
													{{showArriveAddress(item)}}
													
													
											</view>
										
											
											<view class="orderContent">
													
												<view class="goodsItem_second_content">
													<text class="goodsType">{{showVehicleLength(item)}}</text>
													<text class="goodsType type_1"> {{showVehicleModel(item)}}</text>
													<text class="goodsType type_2">{{item.cargoTypeName4}}</text>							
													<text  v-if="item.cargoWeight" class="goodsType unit">{{item.cargoWeight}}{{showCargoUnit(item.cargoUnit)}}</text> 			
													<text v-if="item.cargoVolume" class="goodsType unit">{{item.cargoVolume}}方</text>
												</view>
												<view class="fixedPrice" v-if="item.fixPrice">
													¥{{showPrice(item.fixPrice)}}/{{item.quotePriceTypeName}}
												</view>
												<view class="fixedPrice" v-else>价格电议</view>
											</view>
											<view class="remark">备注：{{showRemark(item)}}</view>
											<view class="price-item">
												<text class="date">{{showPushDt(item.pushDt)}}</text>
												<view class="goPrice" @click="goDetail(item, 3)">去接单</view>
											</view>
											
										</view>	
										
									</view>
								</view>
								<view class="noData01" v-if="isNoData02 && recondArr.length < 1">
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/noData.png" class="noData" mode="widthFix"></image>
									<text>当前线路货物已被抢光，下次早点来哦～</text>
								</view>
								<view v-else><uni-morebox :isMore="isNoMore02" :text="moreBoxText" :containerStyle="{'padding': '24rpx 0', 'font-size': '28rpx'}"></uni-morebox></view>
								
							</view>
							<view class="tabContentItem"  v-show="isTabIndex == 1">
								<view style="height: 26rpx;" />
								<view class="tips" v-if="isVerify">
									<view class="tipsText">您的资料还未认证，快去认证吧</view>
									<view class="btnContent">
										<view class="btnCheck" @click="goVerify">
											去认证
										</view>
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/tips-close.png" class="close" @click="closeVerify"></image>
									</view>
								</view>
								<view class="searchInfo">
									<view class="item start" @click="showPopUp(1)">
										<text v-if="showAddr(zhuang2)">{{showAddr(zhuang2)}}</text>
										<text class="default" v-else>选择装货地</text>
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_down_white.png" class="arrow_down_white"></image>
									</view>
									<view class="middle">到</view>
									<view class="item end" @click="showPopUp(2)">
										<text v-if="showAddr(xie2)">{{showAddr(xie2)}}</text>
										<text class="default" v-else>选择卸货地</text>	
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_down_white.png" class="arrow_down_white"></image>
									</view>
								</view>
								<view class="searchInfo">
									<view class="chooseCar fleet" @click="showCarAlert" v-if="dataParams03.vehicleLength">
										<view class="inner">{{dataParams03.vehicleLength}}米{{dataParams03.vehicleModel}}</view>
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_down_white.png" class="arrow_down_white"></image>
									</view>
									<view class="chooseCar fleet default" @click="showCarAlert" v-else>
										<view class="inner">选择车长车型</view>
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_down_white.png" class="arrow_down_white"></image>
									</view>
									
									<input type="text" placeholder="输入车队/货源号搜索" placeholder-class="default" class="search-input" v-model="fleetName" :focus="inputFocus"
												@confirm="getPlatFormList('refresh','1')">
									
									<view class="choose-btn fleet" @click="toSearch(1)">搜货源</view>
								</view>
											
								<view class="orderList" v-for="(item, index) in fleetQuoteList" :key="index" @click="goDetail(item, 3)">
									
									<view class="platform">
										
										<view class="orderAddress">
											
												{{showSendAddress(item)}}
												
											<view class="notOngoing">
												<view class="notOngoing-content">					
													<image class="addressStatus_1" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/notOngoing_2.png" mode="widthFix"></image>
													<text class="notOngoing-text" v-if="item.estimatedDistance && item.estimatedDistance != 0">{{item.estimatedDistance}}km</text>
												</view>
											</view>
											
												{{showArriveAddress(item)}}
												
												
										</view>
									
										
										<view class="orderContent">
												
											<view class="goodsItem_second_content">
												<text class="goodsType">{{showVehicleLength(item)}}</text>
												<text class="goodsType type_1"> {{showVehicleModel(item)}}</text>
												<text class="goodsType type_2">{{item.cargoTypeName4}}</text>							
												<text  v-if="item.cargoWeight" class="goodsType unit">{{item.cargoWeight}}{{ showCargoUnit(item.cargoUnit) }}</text> 			
												<text v-if="item.cargoVolume" class="goodsType unit">{{item.cargoVolume}}方</text>
											</view>
										</view>
										<view class="fleet-remark-content">
											<view class="fleetName" v-if="item.fleetName">{{item.fleetName}}</view>
											<view class="fixedPrice" v-if="item.fixPrice">
												¥{{showPrice(item.fixPrice)}}/{{item.quotePriceTypeName}}
											</view>
											<view class="fixedPrice" v-else>
												价格电议
											</view>
											
										</view>
										<view class="fleet-remark">备注：{{showRemark(item)}}</view>
										<view class="price-item">
											<text class="date">{{showPushDt(item.pushDt)}}</text>
											<view class="goPrice" @click="goDetail(item, 3)">去接单</view>
										</view>
										
									</view>	
										
								</view>
						
								<view class="recond-content" v-if="total1 == fleetQuoteList.length && recondArr1.length > 0">
									
									<view class="recond-title">
										<view class="main">推荐货源</view>
										<view class="sub">该条线路无更多符合条件货源，为您推荐</view>
									</view>
								
									<view class="orderList" v-for="(item, index) in recondArr1" :key="index" @click="goDetail(item, 3)">
										
										<view class="platform">
											
											<view class="orderAddress">
												
												{{showSendAddress(item)}}
													
												
												<view class="notOngoing">
													<view class="notOngoing-content">					
														<image class="addressStatus_1" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/notOngoing_2.png" mode="widthFix"></image>
														<text class="notOngoing-text" v-if="item.estimatedDistance && item.estimatedDistance != 0">{{item.estimatedDistance}}km</text>
													</view>
												</view>
												
												{{showArriveAddress(item)}}
													
												
											</view>
										
			
											<view class="orderContent">
													
												<view class="goodsItem_second_content">
													<text class="goodsType">{{showVehicleLength(item)}}</text>
													<text class="goodsType type_1"> {{showVehicleModel(item)}}</text>
													<text class="goodsType type_2">{{item.cargoTypeName4}}</text>							
													<text  v-if="item.cargoWeight" class="goodsType unit">{{item.cargoWeight}}{{ showCargoUnit(item.cargoUnit) }}</text> 			
													<text v-if="item.cargoVolume" class="goodsType unit">{{item.cargoVolume}}方</text>
												</view>
												
											</view>
											<view class="fleet-remark-content">
												<view class="fleetName" v-if="item.fleetName">{{item.fleetName}}</view>
												<view class="fixedPrice" v-if="item.fixPrice">
													¥{{showPrice(item.fixPrice)}}/{{item.quotePriceTypeName}}
												</view>
												<view class="fixedPrice" v-else>
													价格电议
												</view>
											</view>
											<view class="fleet-remark">备注：{{showRemark(item)}}</view>
											<view class="price-item">
												<text class="date">{{showPushDt(item.pushDt)}}</text>
												<view class="goPrice" @click="goDetail(item, 3)">去接单</view>
											</view>
											
										</view>	
											
									</view>
								</view>
								<view class="noData01" v-if="isNoData04 && recondArr1.length < 1">
									<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/noData.png" class="noData" mode="widthFix"></image>
									<text>当前线路货物已被抢光，下次早点来哦～</text>
								</view>
								<view v-else>
									<uni-morebox :isMore="isNoMore04" :text="moreBoxText" :containerStyle="{'padding': '24rpx 0','font-size': '28rpx'}"></uni-morebox>
								</view>
							
							</view>
						</view>
					</skeleton>
				</view>
				
				<!--车型车长选择框-->	
				<uni-popup ref="newVehiclePopUp" type="bottom">
					<!--新增车辆-->
					<view class="newCar-pop">
						<view class="pop-newCar-title">选择车型</view>
						<view class="pop-newCar-subTitle">
							<text class="main">车长</text>
							<text class="sub">(单选)</text>
						</view>
						<scroll-view :scroll-y="true" :show-scrollbar="true" class="carLen-content">
							<view class="carLen-item" v-for="(item, index) in carLen" :key="item.id">
								<view class="carLen-item-inner" @click="switchCarLen(item, index)" :class="{active: index == alertVehicleIndex}">{{item.typeName}}米</view>
							</view>
						</scroll-view>
						<view class="randBox" />
						<view class="pop-newCar-subTitle">
							<text class="main">车型</text>
							<text class="sub">(单选)</text>
						</view>
						<scroll-view :scroll-y="true" :show-scrollbar="true" class="carLen-content">
							<view class="carLen-item" v-for="(item,index) in carType" :key="item.id">
								<view class="carLen-item-inner" @click="switchCarType(item, index)" :class="{active: index == alertCarTypeIndex}">{{item.typeName}}</view>
							</view>
						</scroll-view>
						<view class="addAlertCar"><view class="addAlertCar-btn" @click="addCarLenAndType">确定</view></view>
					</view>
				</uni-popup>
				<!--车型车长选择框-->
				<uni-popup ref="newVehiclePopUp1" type="bottom">
					<!--新增车辆-->
					<view class="newCar-pop">
						<view class="pop-newCar-title">选择车型</view>
						<view class="pop-newCar-subTitle">
							<text class="main">车长</text>
							<text class="sub">(单选)</text>
						</view>
						<scroll-view :scroll-y="true" :show-scrollbar="true" class="carLen-content">
							<view class="carLen-item" v-for="(item, index) in carFleetArr" :key="item.id">
								<view class="carLen-item-inner" @click="switchCarLen(item, index)" :class="{active: index == alertVehicleIndex1}">{{item.typeName}}米</view>
							</view>
						</scroll-view>
						<view class="randBox" />
						<view class="pop-newCar-subTitle">
							<text class="main">车型</text>
							<text class="sub">(单选)</text>
						</view>
						<scroll-view :scroll-y="true" :show-scrollbar="true" class="carLen-content">
							<view class="carLen-item" v-for="(item,index) in carFleetType" :key="item.id">
								<view class="carLen-item-inner" @click="switchCarType(item, index)" :class="{active: index == alertCarTypeIndex1}">{{item.typeName}}</view>
							</view>
						</scroll-view>
						<view class="addAlertCar"><view class="addAlertCar-btn" @click="addCarLenAndType">确定</view></view>
					</view>
				</uni-popup>
			
				
				<uni-popup ref="confirmPopup1" type="center">
					<view class="hintBox">
						<view class="title">温馨提示</view>
						<view class="alertContent1">
							<view class="text">平台最低保证金为<text class="blue">{{marginPrice}}</text>元，您当前余额为<text class="blue">{{allAmountWithIn}}</text>元。请充值后再报价。</view>
							<view class="tipsAlert">
								<view class="subTitle">您充值到平台履约保证金账户的资金将用于：</view>
								<view class="tipItem">1.支付信息费（如有）</view>
								<view class="tipItem">2.支付运费担保金（可选）</view>
								<view class="tipItem">3.支付放空担保金（可选）</view>
								<view class="tipItem">4.支付违约金（如发生）</view>
							</view>
						</view>
						<view class="confirmBtnGroup">
							<view class="cancelBtn" @tap="goCharge()">前往充值</view>
						</view>
					</view>
				</uni-popup>
				<uni-popup ref="pemissionPopUp" type="center" :maskClick="false">
					<view class="pemissionPop">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/lingdang.png" class="lingdang_notice"></image>
						<view class="alertContentNotice">
							<view class="title">温馨提示</view>
							<view class="text-content">
								<text class="text">为了更好向您基于地理位置的服务，请您开启定位权限，相关服务包括：推荐附近的服务、包括适合的线路、货源等。</text>
							</view>
						</view>
						<view class="confirmBtn" @click="showPemissionLocation1">
							知道了
						</view>
					</view>
				</uni-popup>
				
				<uni-popup ref="shipAlertPopup" type="center">
					<view class="shipAlertContext">
						<view class="text">提示</view>
						<view class="subText">{{shipData.cargoSource != 'WX_ZKC' ? 'App' : '小程序'}}发布货源，快去与货主确认信息吧</view>
						<view class="content">货源备注：{{shipData.remark || '暂无备注'}}</view>	
						<view class="confirmBtn" @tap="contactShip(shipData)">联系货主</view>
					</view>
				</uni-popup>
				<view class="firstContainer" v-if="isStep != 0">
					<image src="../../../static/images/ship/step-1.jpg" class="step-image" v-if="isStep == 1" @click="goNextStep"></image>
					<image src="../../../static/images/ship/step-2.jpg" class="step-image" v-if="isStep == 2" @click="goLastStep"></image>
					
				</view>
				<view class="adverties" v-if="remindStatus">
					<view class="adves-box">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/advers-close.png" class="advers-close" @click="closeAdvers"></image>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adveties.png" class="advertise-image" @click="goAdvertise"></image>
					</view>
					
				</view>
			</view>
		</view>
	</view>
	
</template>


<script>
	// 推荐再App.vue中使用
	const PACKAGE_INFO_KEY = '__package_info__'
	
	import * as service from "../../../utils/ship";
	import * as utilService from "@/utils/service"; 
	import * as utils from "../../../utils/utils";
	import * as publicData from "@/utils/publicData";
	import UniMorebox from "../../../components/uni-morebox.vue";
	import * as longLink from "@/longLink/consignorlongLink";
	import IMService from "@/utils/imservice.js";
	import carSource from "./carSource.vue";
	import businessCard from "./businessCard/businessCard.vue";
	import { mapActions } from 'vuex'
	import Skeleton from '@/components/J-skeleton/J-skeleton.vue';
	import newsAlert from "@/pages/ship/index/newsAlert";
	var wxScanModule = uni.requireNativePlugin("WxScanModule");
	var globalEvent = uni.requireNativePlugin('globalEvent');
	var wxp_Amap = uni.requireNativePlugin("AMapModule");
	const serviceLive = uni.requireNativePlugin("PhotoModule");
	const PemissionModule = uni.requireNativePlugin("PemissionModule");
	var screenWidth;
	var screenHeight;
	var screenWidth2;
	var screenHeight2;
	var screenWidth3;
	var screenHeight3;
	export default {
		components: {
			UniMorebox,
			carSource,
			Skeleton,
			businessCard
		},
		data() {
			return {
				moreBoxText: '',
				total1: 0,
				total: 0,
				recondArr: [],
				recondArr1: [],
				defaultRecondArr: [],
				defaultRecondArr1: [],
				zhuang1: [],
				xie1: [],
				zhuang2: [],
				xie2: [],
				alertVehicleIndex: -1,
				alertCarTypeIndex: -1,
				newVehiclePopUp: false,
				alertVehicleIndex1: -1,
				alertCarTypeIndex1: -1,
				newVehiclePopUp1: false,
				carFleetArr: [],
				carType: [],
				carLen: [],
				carFleetType: [],
				
				isNoScroll: false,
				shipData: new Object(),
				loading: true, //骨架屏是否显示
				skeleton1: {
					avatarSize: '52px',
					row: 7,
					showTitle: true,
					column: 7,
				},
				carSourceIndex: 1,
				setLocationFlag: false,
				showLuckDraw: false, // 是否有抽奖活动标识
				luckDrawData: {}, // 活动信息 
				advertiesTimeOutNum: 5,
				showGuide: 0,
				remindStatus: false,
				hintSwiperText: '',
				loadingFlag: false,
				goodsVal: [0, 0],
				goodsStartVal: [0, 0],
				goodsEndVal: [0, 0],
				goodsFleetVal: [0, 0],
				goodsFleetStartVal: [0, 0],
				goodsFleetEndVal: [0, 0],
				routeTimeout: null,
				waybillTimeout: null,
				userId: '',
				isHasNews: 0, //是否有最新消息
				addressLocation: '',
				isStep: 0,
				allAmountWithOut: 0,
				allAmountWithIn: 0,
				marginPrice: 0,
				isNoData02: false,
				isNoData03: false,
				isNoData04: false, //车队货源
				list02NoDataText: '',
				platformQuoteList: [], //平台货源
				fleetQuoteList: [], //车队货源
			
			
				dataParams02: {
					pageSize: 10,
					pageNum: 1,
					serial: 1,
					supply: 1,
				},
				dataParams03: {
					//车队货源
					pageSize: 10,
					pageNum: 1,
					serial: 1,
					supply: 2,
				},
				
				recordDataParams02: {
					pageSize: 10,
					pageNum: 1,
					serial: 1,
					supply: 1,
				},
				recordDataParams03: {
					//车队货源
					pageSize: 10,
					pageNum: 1,
					serial: 1,
					supply: 2,
				},
				
				listSelectBoxHeight: 0,
				isNoMore02: 'more',
				isNoMore04: 'more', //车队货源
				isVerify: true, //认证的提示
				isLoading: false, //判断是装货还是卸货
				loadingArray: [],
				unLoadingArray: [],
				loadingAddr: '',
				unLoadingAddr: '全国',
				loadingFleetArray: [],
				unLoadingFleetArray: [],
				loadingFleetAddr: '',
				unLoadingFleetAddr: '全国',
				timer: null,
				isAlert: false,
				isFleetAlert: false,
				currentIndex: 0,
				isAlertShow: false,
				provinceArr: [],
				provinceFleetArr: [],
				isSelectedArea: [],
				cityArr: [],
				areaArr: [],
				cityFleetArr: [],
				areaFleetArr: [],
				statusBarHeight: 0,
				tabContentHeight: 0,
				isSortUp: false, //排序规则
				isFleetSortUp: false, //车队排序规则
				isTabIndex: 0,
				tabTitle: [
					"全部货源",
					"车队货源",
				],
				
				route: [], //常跑线路
				selectFlag: 1,
				frozenFlag: true,
				startAddress: '',
				endAddress: '',
				hintRef: '',
				boxTransform: '',
				timer: null, //防抖
				isShow: true,
				stickHeight: 700,
				isHaveNewWaybill: false,
				hideFixedIcon: false, // 是否隐藏活动图标
				scrollTimer: null, // 滚动条防抖 
				ChinaTravelObj: { // 中国行对象
				  address: {}, // 地址
				  show: false, // 是否有活动
				  ChinaTravelInfo: {}, // 活动信息
				}, 
				avticeIconObj: {
					luckDrawFlag: true,
					ChinaTravelFlag: true,
					redPacketFlag:true,
				},
				annualBill:{
					dialogFlag:false,   //首页是否弹框
					flag:0
				},
				transportIdArr: [], //扫描面单id数组
				allArr: [],
				surfaceNumberArr: [],
				ldeId: '',
				codeArr: [],
				Audio: null,
				fleetName:'',
				inputFocus: false,
				//搜索货源判断是否首次加载
				isFirstLoadGood: true,
				position: {
					x: 0,
					y: 0,
					x2: 0,
					y2: 0,
					x3: 0,
					y3: 0,
				},
				taskStatus: undefined, //接单状态
			}
		},
		async onLoad(options) {
			var that = this;
			var platform = uni.getSystemInfoSync().platform;
			if(platform != 'ios'){
				//手动输入条形码
				uni.$on('codeRefresh', res => {
					console.log(res)
					if(!res.barCode){
						wxScanModule.scanActivity({}, (data) => {
							console.log('扫描结果', data)
						})
						setTimeout(()=>{
							var numCount = this.codeArr.length.toString();
							wxScanModule.getMessage({
								num: numCount
							}, (data) => {
								console.log('设置成功数', numCount)
							})
						}, 200)
					} else {
						if (that.codeArr.indexOf(res.barCode) > -1) {
							
						} else {
							that.codeArr.push(res.barCode);
							that.ldeId = res.ldeId;
							getApp().globalData.pransportCodeArr.push(res);
							if (that.transportIdArr.indexOf(res.ldeId) == -1) {
								that.transportIdArr.push(res.ldeId);
								that.surfaceNumberArr.push(res.surfaceNumber);
							}
							that.allArr.push(res);
						}
						wxScanModule.scanActivity({}, (data) => {
							console.log('扫描结果', data)
						})
						setTimeout(()=>{
							var numCount = this.codeArr.length.toString();
							wxScanModule.getMessage({
								num: numCount
							}, (data) => {
								console.log('设置成功数', numCount)
							})
						}, 200)
					}
				})
			}
			this.Audio = uni.createInnerAudioContext();
			this.Audio.autoplay = true;
			globalEvent.addEventListener('myEvent', function(e) {
			  console.log('myEvent'+JSON.stringify(e));
				if(e.code == 'isSingleBack'){
					if(that.transportIdArr.length == 0){
						wxScanModule.setFailText({
							text: '没有扫描结果，请重新扫描',
						}, (data) => {
							
						})
						return
					}
					that.getFindFirstLde();
				} else if(e.code == 'isMultipleBack') {
					if(that.transportIdArr.length == 0){
						wxScanModule.setFailText({
							text: '没有扫描结果，请重新扫描',
						}, (data) => {
							
						})
						return
					}
					var newArr = [];
					that.transportIdArr.map(val => {
						var obj = {
							ldeId: val,
						}
						var goodsArr = [];
						that.allArr.map(item => {
							if (val == item.ldeId) {
								goodsArr.push(item);
							}
						})
						obj.goodsArr = goodsArr;
						newArr.push(obj);
					})
					console.log('newArr', newArr);
					console.log('transportIdArr', that.transportIdArr);
					console.log('surfaceNumberArr', that.surfaceNumberArr);
					getApp().globalData.pransportCodeArr = newArr;
					uni.navigateTo({
						url: '/pages/goodsDelivery/transport/scanDetail?transportIdArr=' + JSON.stringify(that.transportIdArr) + '&surfaceNumberArr=' + JSON.stringify(that.surfaceNumberArr)
					});
					getApp().globalData.isScanAli = 1;
				} else if(e.code == 'isManualBack') {
					uni.navigateTo({
						url: "/pages/goodsDelivery/transport/inputCode"
					})
				} else {
					if(e.code && e.code.length>=18){
						if(e.code.substring(0, 2) === "HY"){
							if(that.codeArr.indexOf(e.code)>-1){
								wxScanModule.setFailText({
									text: '重复扫描',
								}, (data) => {
									
								})
								return;
							}
							that.codeArr.push(e.code);
							that.getCheckData(e.code);
						} else {
							wxScanModule.setFailText({
								text: '请确认条形码是否正确',
							}, (data) => {
								
							})
						}
					} else {
						wxScanModule.setFailText({
							text: '请确认条形码是否正确',
						}, (data) => {
							
						})
						that.playFaliMusic();
					}
				}
			});
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userInfo = JSON.parse(userInfo);
			}
			var isHaveSplashBanner = this.$store.state.isHaveSplashBanner;
			if (options.index != undefined) {
				this.isTabIndex = options.index
			}
			
			if (!userInfo || this.splashBanner.length < 1 || isHaveSplashBanner) {
				this.showGuide = 2;
				uni.showTabBar();
				//定位获取的温馨提示
				let isOpenLocation = that.checkOpenGPSService();
				console.log(isOpenLocation, '定位权限是否开启定位权限是否开启定位权限是否开启定位权限是否开启定位权限是否开启定位权限是否开启1121123');
				if (!isOpenLocation) {
					setTimeout(() => {
						that.$refs.pemissionPopUp.open();
					}, 1500)
					
				} else {
					publicData.checkVersion();
					that.setDialog();
					if (platform == "android") {
						//实时打卡
						that.getUserLocation()
					}
				}
				
				
			} else {
				if (!isHaveSplashBanner) {
					this.$store.commit("setSplashBannerStatus", true);
				}
				uni.hideTabBar();
				this.showGuide = 1;
				this.advertiesTimeOut = setInterval(() => {
					this.advertiesTimeOutNum --;
					if (this.advertiesTimeOutNum == 0) {
						clearInterval(this.advertiesTimeOut);
						this.showGuide = 2;
						this.setDialog()

						setTimeout(() => {
							uni.showTabBar();
							//检测是否有新版本更新
							publicData.checkVersion();
						}, 500)
						
					}
				}, 1000)
			}
		
			uni.$on("switchIndex1", (tabIndex = 0) => {
				console.log("switchIndex1",tabIndex);
				this.carSourceIndex = 1
				this.isTabIndex = tabIndex || 0;
				that.getPlatFormList("refresh", tabIndex || 0);
			})
			uni.$on("quoteDid", () => {
				//监听报价成功
				var that = this;
				this.isTabIndex = 0;
				that.getPlatFormList("refresh", this.isTabIndex);
				
			})
			
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			this.statusBarHeight = statusBarHeight;
			this.tabContentHeight = windowHeight*2
			
			//抽奖和点亮中国行拖拽
			uni.getSystemInfo({
			    success: function (res) {
					console.log(res,'resres')
					//抽奖
					that.position.x = res.safeArea.width - 70;
					that.position.y = res.safeArea.height -  200;
					screenWidth = res.safeArea.width * 2;
					screenHeight = res.safeArea.height;
					//点亮中国行
					that.position.x2 = res.safeArea.width - 70;
					that.position.y2 = res.safeArea.height -  100;
					screenWidth2 = res.safeArea.width * 2;
					screenHeight2 = res.safeArea.height;
					console.log(screenWidth,screenHeight)
					// 红包雨
					that.position.x3 = res.safeArea.width - 70;
					that.position.y3 = res.safeArea.height - 260;
					screenWidth3 = res.safeArea.width * 2;
					screenHeight3 = res.safeArea.height;
			    }
			});
			
			that.getAllSettings();
			let isOpenLocation = that.checkOpenGPSService();
			if (!isOpenLocation) {
				that.getPlatFormList("refresh", that.isTabIndex);
			} else {
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "ios") {
					that.initPlatform(); //平台货源
				}
				if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '将获取您的位置信息已向您展示距离最近的货源',
						success(res) {
							if (res.confirm) {
								that.initPlatform(); //平台货源
							} else {
								that.getPlatFormList("refresh", that.isTabIndex);
							}
						}
					})
				} else {
					that.initPlatform(); //平台货源
				}
			
				
			}
			
			
			uni.$on("search_index", (params, data) => {
				//登录成功后刷新数据
				console.log(params, 'searchParams11111111参数')
				uni.showLoading({
					title: '加载中'
				})
				if (!params) {
					that.searchParams = null;
								
				} else {
					if (Object.keys(params).length > 0) {
						that.searchParams = params;
					} else {
						that.searchParams = null;			
					}
				}
				
				that.searchData = data;
			})
			uni.$on("refreshData_index", () => {
				console.log('刷新112121212121212登录')
				//登录成功后刷新数据
				if (that.carSourceIndex == 0) {
					this.getSettingsInfo(); //初始化车源配置
					this.$refs.carSourceRef && this.$refs.carSourceRef.resetFresh();
					// this.$refs.businessCardRef && this.$refs.businessCardRef.resetFresh();
				} else {
					that.isTabIndex = 0;
					that.initParams();//初始化搜索条件
					that.$store.dispatch("getMainAdvertise"); //获取首页banner图片
					that.getAllSettings(); //初始化配置信息，平台货源
					var isOpen = that.checkOpenGPSService();
				
					that.getPlatFormList("refresh", that.isTabIndex);
					
					
					var userInfo = uni.getStorageSync("userInfo");
					if (userInfo) {
						var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
						var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
						var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
						this.userId = JSON.parse(userInfo).userId;
						console.log(identityVerify, driverVerify, vehicleVerify, '认证新消息1212121212');
						if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
							this.isVerify = true
						} else {
							this.isVerify = false
						}
					} else {
						this.isVerify = true
					}
					
				}
				
			})
			//刷新列表
			uni.$on("refreshIndex1", () => {
				var isTabIndex = this.isTabIndex;
				that.getPlatFormList("refresh", isTabIndex);
			})
			//分享刷新
			uni.$on("shareRefresh", () => {
				console.log('shareshareshareshareshareshareshareshareshareshare')
				that.switchTab(1);
			})
			
			//保存省市区数据
			uni.$on("saveAreaData", newChooseAddressObj => {
				console.log('index页面中的newChooseAddressObj',newChooseAddressObj);
				var isTabIndex = this.isTabIndex;
				var addressTypeKey = this.addressTypeKey;
				console.log(newChooseAddressObj, isTabIndex, addressTypeKey )
				if (isTabIndex == 0) {
					if (addressTypeKey == 1) {
						this.zhuang1 = newChooseAddressObj
					} else {
						this.xie1 = newChooseAddressObj
					}
				} else {
					if (addressTypeKey == 1) {
						this.zhuang2 = newChooseAddressObj
					} else {
						this.xie2 = newChooseAddressObj
					}
				}
				this.$forceUpdate();
			})
		},
		onUnload() {
			this.routeTimeout && clearInterval(this.routeTimeout);
			this.routeTimeout = null;
			this.waybillTimeout && clearInterval(this.waybillTimeout);
			this.waybillTimeout = null;
			// uni.removeStorageSync('fleetName');
			uni.removeStorage({
			    key: 'fleetName',
			    success: function (res) {
			        console.log('success');
			    }
			});
			console.log('onUnload')
		},
		onHide() {
			this.routeTimeout && clearInterval(this.routeTimeout);
			this.routeTimeout = null;
			this.waybillTimeout && clearInterval(this.waybillTimeout);
			this.waybillTimeout = null;
			// uni.removeStorageSync('fleetName');
			uni.removeStorage({
			    key: 'fleetName',
			    success: function (res) {
			        console.log('success');
			    }
			});
			console.log('onHide');
		},
		onReady() {
			//加载我发布的车源
			console.log("1212加载onready")
			this.getSettingsInfo(); //初始化车源配置
			this.$refs.carSourceRef.refresh();
			// this.$refs.businessCardRef.refresh();
			
		},
		onShow() {
			this.getConnectionStatus();
			//判断身份是否已认证
			var that = this;
			
			
			if(getApp().globalData.isScanAli == 1){
				wxScanModule.scanActivity({}, (data) => {
					console.log('扫描结果', data)
				})
				setTimeout(()=>{
					var numCount = this.codeArr.length.toString();
					wxScanModule.getMessage({
						num: numCount
					}, (data) => {
						console.log('设置成功数', numCount)
					})
				}, 200)
				getApp().globalData.isScanAli = 0;
			}
			//判断经纬度是否存在
			that.$store.dispatch('getMainAdvertise')
			
			console.log(uni.getStorageSync('fleetName'),'车队名称')
			//判断是否是加入车队过来的
			if (uni.getStorageSync('fleetName')) {
				that.carSourceIndex = 1;
				that.isTabIndex = 1
				that.fleetName = uni.getStorageSync('fleetName')
				that.getPlatFormList("refresh", 1)
			} else {
				// this.carSourceIndex = 0;
				// this.isTabIndex = 0;
				console.log(that.fleetName,'that.fleetName')
				that.fleetName = that.fleetName;
			}
			
			that.avticeIconObj.ChinaTravelFlag = true
			that.avticeIconObj.luckDrawFlag = true
			that.avticeIconObj.redPacketFlag=true
			that.getLuckDrawFlag() // 判断是否存在抽奖活动
			that.getChinaTravel() // 判断是否有中国行活动
			that.setBillDialog()
			uni.setStorageSync("longLink", 0);
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.taskStatus = JSON.parse(userInfo).attrs.taskStatus;
				console.log(this.taskStatus, '状态11111111111')
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				this.userId = JSON.parse(userInfo).userId;
				console.log(identityVerify, driverVerify, vehicleVerify, '认证新消息1212121212');
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
					this.isVerify = true
				} else {
					this.isVerify = false
				}
				
				//获取账户信息
				this.getRestPrice(); //获取钱包余额
				this.getMarginVODriver(); //获取最低保证金
			
				uni.stopPullDownRefresh();	
			} else {
				this.isVerify = true;
			}
		},
		onPullDownRefresh() {
			var that = this;
			this.recondArr = [];
			this.recondArr1 = [];
			this.isNoMore02 = "more";
			this.isNoMore04 = "more";
			var isTabIndex = this.isTabIndex;
			if (isTabIndex == 0) {
				//平台货源刷新
			
				if (!that.dataParams02.latitude) {
					var isLocationOpen = this.checkOpenGPSService();
					if (isLocationOpen) {
						uni.getLocation({
							geocode: true,
							 type: 'gcj02',
							success: function(res) {
								console.log(res, '定位地址');
								that.dataParams02.longitude = (res.longitude).toFixed(6)
								that.dataParams02.latitude = (res.latitude).toFixed(6)
								that.getPlatFormList("refresh", 0);
							},
							fail: function(res) {
								uni.showToast({
									title: '请打开定位',
									icon: 'none'
								})
								that.getPlatFormList("refresh", 0);
								
							}
						})
					} else {
						this.getPlatFormList("refresh", 0);
					}
				
				} else {
					this.getPlatFormList("refresh", 0);
				}
				
				
			} else if (isTabIndex == 1) {
				
				if (!that.dataParams03.latitude) {
					var isLocationOpen = this.checkOpenGPSService();
					if (isLocationOpen) {
						uni.getLocation({
							geocode: true,
							 type: 'gcj02',
							success: function(res) {
								console.log(res, '定位地址');
								that.dataParams03.longitude = (res.longitude).toFixed(6)
								that.dataParams03.latitude = (res.latitude).toFixed(6)
								that.getPlatFormList("refresh", 1);
							},
							fail: function(res) {
								uni.showToast({
									title: '请打开定位',
									icon: 'none'
								})
								that.getPlatFormList("refresh", 1);
								
							}
						})
					} else {
						this.getPlatFormList("refresh", 1);
					}
					
				} else {
					this.getPlatFormList("refresh", 1);
				}
				
			}
			that.getLuckDrawFlag()
		},
		onReachBottom() {
			var that = this;
		
			var isTabIndex = this.isTabIndex;
			var isNoMore02 = this.isNoMore02;
			var isNoMore04 = this.isNoMore04;
			if (isTabIndex == 0) {
				//平台货源
				console.log(isNoMore02, this.total,  this.isNoData02, "更多12")
				if  (isNoMore02 == "noMore" || this.isNoData02 || isNoMore02 == 'loading') {
					return
				}
				this.isNoMore02 = "loading";
				var platformQuoteList = this.platformQuoteList;
				var total = this.total;
				if (total == platformQuoteList.length) {
					if (this.recondArr.length < 1) {
						that.getRecondMore("refresh", isTabIndex)
					} else {
						that.getRecondMore("more", isTabIndex)
					}
					
				} else {
					that.getPlatFormList('more', isTabIndex);
				}
				
			} else if (isTabIndex == 1) {
				//车队货源
				if  (isNoMore04 == "noMore" || this.isNoData04 || isNoMore04 == 'loading') {
					return
				}
				this.isNoMore04 = "loading";
				var fleetQuoteList = this.fleetQuoteList;
				var total1 = this.total1;
				if (total1 == fleetQuoteList.length) {
					if (this.recondArr1.length < 1) {
						that.getRecondMore("refresh", isTabIndex)
					} else {
						that.getRecondMore("more", isTabIndex)
					}
				} else {
					that.getPlatFormList('more', isTabIndex);
				}
				
			
				
			}
		},
		computed: {
			routeLen() {
				var len = this.route.length || 0;
				return '常跑线路（' + len + '/10）'
			},
			mainBanner() {
				var mainBanner = this.$store.state.mainBanner;
				console.log('首页广告', mainBanner);
				if (mainBanner.length < 1) {
					var obj = {
						advUrl: ''
					}
					return obj
				} else {
					return mainBanner[0]
				}
				
			},
			splashBanner() {
				var splashBanner = this.$store.state.splashBanner;
				return splashBanner || []
				
			}
		},
	methods: {
		...mapActions(['getSettingsInfo', 'getCenterLocationInfo']),
		showCargoUnit(cargoUnit) {
			return utils.showCargoUnit(cargoUnit);
		},
		showCarAlert() {
			console.log("弹框")
			var isTabIndex = this.isTabIndex;
			if (isTabIndex == 1) {
				this.$refs.newVehiclePopUp1.open();
			} else {
				this.$refs.newVehiclePopUp.open();
			}
			
		},
		showPushDt(dt) {
			return utils.showPushDt(dt);
		},
		showAddr(addr) {
			var arr = [];
			if (addr.length < 1) return "";
			addr.forEach(atem => {
				console.log(atem, atem.areaName);
				var text = atem.chooseName;
				arr.push(text)
			})
			return arr.join("、")
			
		},
		addCarLenAndType() {
			var isTabIndex = this.isTabIndex;
			var dataParams02 = this.dataParams02;
			var dataParams03 = this.dataParams03;
			if (isTabIndex == 1) {
				if ((this.alertCarTypeIndex1 == -1 && this.alertVehicleIndex1 > -1) || (this.alertCarTypeIndex1 > -1 && this.alertVehicleIndex1 == -1)) {
					uni.showToast({
						title: '请选择完整车型车长',
						icon: 'none'
					})
					return
				}
				if (this.selectedCarTypeItem1) {
					this.dataParams03.vehicleLength = this.selectedCarLenItem1.typeName
					this.dataParams03.vehicleModel = this.selectedCarTypeItem1.typeName
				} else {
					this.dataParams03.vehicleLength && delete this.dataParams03.vehicleLength
					this.dataParams03.vehicleModel && delete this.dataParams03.vehicleModel 
				}
				this.$forceUpdate();
				this.$refs.newVehiclePopUp1.close();
				return;
			}
			if ((this.alertCarTypeIndex == -1 && this.alertVehicleIndex > -1) || (this.alertCarTypeIndex > -1 && this.alertVehicleIndex == -1)) {
				uni.showToast({
					title: '请选择完整车型车长',
					icon: 'none'
				})
				return
			}
			if (this.selectedCarTypeItem) {
				this.dataParams02.vehicleLength = this.selectedCarLenItem.typeName
				this.dataParams02.vehicleModel = this.selectedCarTypeItem.typeName
			} else {
				this.dataParams02.vehicleLength && delete this.dataParams02.vehicleLength
				this.dataParams02.vehicleModel && delete this.dataParams02.vehicleModel 
			}
			console.log("dataParams02",this.dataParams02)
			this.$forceUpdate();
			this.$refs.newVehiclePopUp.close();
			
		},
		switchCarType(item, index) {
			var isTabIndex = this.isTabIndex;
			if (isTabIndex == 1) {
				this.selectedCarTypeItem1 = index == this.alertCarTypeIndex1 ? null : item
				this.alertCarTypeIndex1 = index == this.alertCarTypeIndex1 ? -1 : index;
				
			} else {
				this.selectedCarTypeItem = index == this.alertCarTypeIndex ? null : item
				this.alertCarTypeIndex = index == this.alertCarTypeIndex ? -1 : index;
				
			}
			
		},
		switchCarLen(item, index) {
			var isTabIndex = this.isTabIndex;
			if (isTabIndex == 1) {
				
				this.selectedCarLenItem1 = index == this.alertVehicleIndex1 ? null : item
				this.alertVehicleIndex1 = index == this.alertVehicleIndex1 ? -1 : index;
				
			} else {
				this.selectedCarLenItem = index == this.alertVehicleIndex ? null : item
				this.alertVehicleIndex = index == this.alertVehicleIndex ? -1 : index;
				
			}
			
		},
		checkOpenGPSService(){
			//定位权限判断
			let systemType = uni.getSystemInfoSync().platform;
			if(systemType ==='android'){
				var isOpen = PemissionModule.isLocationOpen();
				return isOpen;
				// return true;
			} else {
				return true;
			}
		},
		showPemissionLocation1() {
			let that = this;
			var platform = uni.getSystemInfoSync().platform;
			that.$refs.pemissionPopUp.close();
			if (platform == "android") {
				PemissionModule.applyPemission(res => {
					console.log(res, '授权的结果')
					//授权成功
					//检测是否有新版本更新
					if (res.status == 1) {
						that.initPlatform();
						that.getUserLocation(); //保活
						uni.$emit("srevice-index", 1); //连续不断的打卡
					} else {
						that.getPlatFormList("refresh", that.isTabIndex);
					}
					
				})
			} else {
				that.initPlatform();
				that.getUserLocation(); //保活
				uni.$emit("srevice-index", 1); //连续不断的打卡
				publicData.checkVersion()
			}
		
		},
		showShipPopup(item) {
			//联系货主
			this.shipData = item;
			this.$refs.shipAlertPopup.open();
		},
		contactShip(data) {
			console.log(data, 'data');
			this.$refs.shipAlertPopup.close();
			if (!data.mobile1) return;
			//判断权限是否禁止
			var platform = uni.getSystemInfoSync().platform;
			if (platform == "android") {
				plus.android.requestPermissions(
					["android.permission.CALL_PHONE"], 
					function(resultObj) {
						var result = 0;
						for (var i = 0; i < resultObj.granted.length; i++) {
							var grantedPermission = resultObj.granted[i];
							console.log('已获取的权限：' + grantedPermission);
							result = 1
						}
						for (var i = 0; i < resultObj.deniedPresent.length; i++) {
							var deniedPresentPermission = resultObj.deniedPresent[i];
							console.log('拒绝本次申请的权限：' + deniedPresentPermission);
							result = 0
						}
						for (var i = 0; i < resultObj.deniedAlways.length; i++) {
							var deniedAlwaysPermission = resultObj.deniedAlways[i];
							console.log('永久拒绝申请的权限：' + deniedAlwaysPermission);
							result = -1
						}
						console.log(result);
						if(result == 1 || result == 0){
							uni.makePhoneCall({
								 phoneNumber: data.mobile1,//电话号码
							});
							publicData.addBuried("司机搜索货源拨打货主电话")
						}else{
							uni.showToast({
								title:"请开启拨号权限",
								icon:"none",
							})
						}
					},
					function(error) {
						console.log('申请权限错误：' + error.code + " = " + error.message);
					}
				);
			} else {
				
				uni.makePhoneCall({
					phoneNumber: data.mobile1,
				})
				publicData.addBuried("司机搜索货源拨打货主电话")
			}
		
			
			
		},
		
		initParams() {
			this.loadingArray = [];
			this.unLoadingArray = [];
			this.loadingFleetArray = [];
			this.unLoadingFleetArray = [];
		
		
			this.dataParams02 = {
				pageSize: 10,
				pageNum: 1,
				serial: 1,
				supply: 1,
			};
			this.dataParams03 = {
				//车队货源
				pageSize: 10,
				pageNum: 1,
				serial: 1,
				supply: 2,
			}
		},
		clearSearch() {
			this.fleetName = '';
			uni.removeStorage({
				key: 'fleetName',
				success: function(res) {
					console.log('success');
				}
			})
		},
		getUserLocation(){
			let that = this
			var userInfo = uni.getStorageSync("userInfo");
			if(that.setLocationFlag) return
			if(!userInfo) return
			wxp_Amap.start({ // {} 大括号内参数说明见下方
			  setInterval: 300000, // 定位间隔，单位 ms，				 
			  //300000 5分钟，	 1800000 30分钟， 	1200000 20分钟
			  cacheEnable: true // 是否允许缓存，默认为true，既当位置不变时返回最后一次定位的地址，不是必须的
			}, res => {
				that.setLocationFlag = true
			  // 处理回调结果
			  // result 为回调结果 见下方 start() 回调结果
			  console.log(res);
			  var userId = JSON.parse(userInfo).userId;
			  var userCode = JSON.parse(userInfo).attrs.userCode;
			  var data = {
			    latitude: res.lat,
			    longitude: res.lng,
			    userId: userId,
			    address: res.address,
			    provinceName: res.province,
			    provinceCode: '',
			    cityName: res.city,
			    cityCode: '',
			    areaName: res.district,
			    areaCode: '',
				userCode: userCode,
			    commonHtmlTitle: '实时上报定位'
			  };
			  
			  service.newRegisterPostRequest('/cd/user/location/save', data)
			    .then(res => {
			
			    })
			    .catch(err => {
			      console.log(err)
			    })
			})
		},
      async setBillDialog(){
        let that = this
        console.log("账单弹出框",that.annualBill.flag)
        if(!that.annualBill.flag){
          return false
        }
        if(!that.isThreeAuth(1)){
          return false
        }
        console.log("弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出弹出")
        var userInfo = uni.getStorageSync("userInfo");
        let data = {
          userCode: JSON.parse(userInfo).attrs.userCode,
          status: "0",
        }
        console.log("跳出页面");
        let res = await service.postRequest("/olnanas/year_bill/getData", data)
        console.log(res)
        //如果等于空则是首页弹框 一个用户只弹一次
        // if(res.rspBody.userCode) {
        //   uni.navigateTo({
        //     url:'../../index/AnnualBill/dialog'
        //   })
        // }	
      },
      // 判断弹窗是否弹出
      async setDialog(){
        let that = this
				var userInfo = uni.getStorageSync("userInfo");
        // 开屏广告结束 打开弹窗
        let ChinaTravelDialogTime = uni.getStorageSync("ChinaTravelDialogTime")
		    console.log('弹出账单')
        let data = {
          province: that.ChinaTravelObj.address.province ,
          city: that.ChinaTravelObj.address.city,
          county: that.ChinaTravelObj.address.district,
					userCode: JSON.parse(userInfo).attrs.userCode
        }
        let res = await service.newRegisterPostRequest("/dlzg/lightenchina/allRecord", data)
        let isClock = false
        if(res.retCode == "0000000"){
          if(res.rspBody.length){
            isClock = true
          }else{
            isClock = false  
          }
        }else{
          isClock = false
        }
        
        if(ChinaTravelDialogTime){
          if(new Date(ChinaTravelDialogTime -0).toDateString() === new Date().toDateString()){
            that.annualBill.flag = 1
			      console.log("弹出账单")
            that.setBillDialog()
          }else{
            setTimeout(() => {
              if(!isClock){
                that.goChinaTravel()
              }else{
                that.annualBill.flag = 1
                console.log("弹出账单")
                that.setBillDialog()
              }
            },1000)
          }
        }else{	  
          setTimeout(() => {
            if(!isClock){
                that.goChinaTravel()
            }else{
              that.annualBill.flag = 1
              console.log("弹出账单")
              that.setBillDialog()
            }
          },1000)
        }
      },
      // 中国行获取定位
      getChinaTravelLocation(){
        let that = this
        return new Promise((resolve,reject) => {
			var isLocationOpen = that.checkOpenGPSService();
			console.log(isLocationOpen, '中国阿萨啊');
			if (!isLocationOpen) {
				that.ChinaTravelObj.address = null
				resolve(false)
			} else {
				uni.getLocation({
					geocode: true,
					type: 'gcj02',
					success: function(res) {
						console.log(that.ChinaTravelObj)
						if (!that.ChinaTravelObj.address) {
						  that.ChinaTravelObj.address = {}
						}
						let address = res.address
						that.ChinaTravelObj.address.province = address.province.replace("市","");
						that.ChinaTravelObj.address.city = address.city
						that.ChinaTravelObj.address.district = address.district
						that.ChinaTravelObj.address.latitude = res.latitude
						that.ChinaTravelObj.address.longitude  = res.longitude
						resolve(true)
						console.log("中国行活动标识",that.ChinaTravelObj)
						console.log("中国行活动标识",res)
					},
					fail: function(res) {
						console.log('中国行获取定位失败')
						console.log(res)
						that.ChinaTravelObj.address = null
						resolve(false)
					}
				})
			}
		})
      },
		
      // 判断是否有中国行活动
      async getChinaTravel(){
        let that = this
        let TravelRes = await service.newRegisterPostRequest("/dlzg/lightenchina/getgame", {})
        if(TravelRes.rspBody){
          that.ChinaTravelObj.show = true
          that.ChinaTravelObj.ChinaTravelInfo = TravelRes.rspBody 
          console.log("获取用户位置信息")
          await that.getChinaTravelLocation()
        }else{
          that.ChinaTravelObj.show = false
          that.ChinaTravelObj.ChinaTravelInfo = {}
        }
        console.log("中国行活动标识",that.ChinaTravelObj)
        
      },
      // 判断是否有活动
      getLuckDrawFlag(){
        let that = this
        service.newRegisterPostRequest("/cj/awards/selectStatus", {}).then(res => {
          if(res.rspBody){
            that.luckDrawData = res.rspBody
            that.showLuckDraw = true
          }else{
            that.showLuckDraw = false
          }
          console.log("是否有抽奖活动标识",res)
        })
        
      },
      // 判断是否三证认证
      isThreeAuth(index){
        let that = this
        console.log("三证校验结果")
        var userInfo = uni.getStorageSync("userInfo");
        let flag = false
			  if (userInfo) {
          var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
          var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
          var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
          if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
			  if(!index){
				  uni.showToast({
				    title: index ? '' : '请在“我的”里面完成三项认证后参与活动',
				    icon: 'none'
				  })
			  }
            
            flag = false
          } else {
            flag = true
          }
        }
        return flag
      },
			// 跳转抽奖页面
			goLuckDraw(){
        let that = this
        console.log("跳转到抽奖页面")
        console.log("三证校验结果")
        var userInfo = uni.getStorageSync("userInfo");
			  if (userInfo) {
          var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
          var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
          var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
          if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
            uni.showToast({
              title: '您未完成认证,暂不能参与抽奖',
              icon: 'none'
            })
          } else {
            uni.navigateTo({
              url: '../../index/luckDraw/index'
            })
          }
        }
		},
      // 日期格式化
      dateFormat(date) {
        let format = 'yyyy-MM-dd hh:mm:ss';
        if (date != 'Invalid Date') {
          var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
          }
          if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
              format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
          return format;
        }
        return '';

      },
	  goAnnualBill(){
		  console.log('zhangdan')
		  uni.navigateTo({
		  	url:'../../index/AnnualBill/AnnualBill'
		  })
	  },
	  closeLuckDrawlAct(){
		  let that = this
		  that.avticeIconObj.luckDrawFlag = false
	  },
	  closeChinaTravelAct(){
		  let that = this
		  that.avticeIconObj.ChinaTravelFlag = false
	  },
	  closeRedPacket(){
		let that = this
		  that.avticeIconObj.redPacketFlag = false
	  },
      // 按钮跳转到点亮中国行页面
      async goBtnChinaTravel(){
        let that = this
        if(!service.btnRepeat()) return false; // 防抖
        // if(!that.isThreeAuth()){
        //   return false
        // }
        let info = that.ChinaTravelObj
        let loactionFlag = await that.getChinaTravelLocation()
        if(!loactionFlag){
          return
        }
        console.log(info)
        let userInfo = uni.getStorageSync("userInfo");
        let userCode = JSON.parse(userInfo).attrs.userCode;
        let data = {
          userCode: userCode, // 卡友号码
          gameId: info.ChinaTravelInfo.sid, // 活动ID
          latitude: info.address.latitude, // 经纬度
          longitude: info.address.longitude,
          province: info.address.province, // 省市区
          city: info.address.city,
          county: info.address.district
        }
        let res = await service.newRegisterPostRequest("/dlzg/lightenchina/getgame", {province: info.address.province})
        res.rspBody.province = info.address.province
        res.rspBody.city = info.address.city
        res.rspBody.county = info.address.district
        res.rspBody.image = res.rspBody.medalImage
        res.rspBody.data = data
        uni.navigateTo({
          url: '../../index/ChinaTravel/index?info=' + JSON.stringify(res.rspBody)
        })
      },
      // 跳转到点亮中国行页面
      goChinaTravel(){
        let that = this
        // if(!that.isThreeAuth()){
        //   return false
        // }
        // that.annualBill.flag = 1
        if(!that.ChinaTravelObj.show){
          console.log("活动不存在停止跳转")
          console.log("活动不存在停止跳转")
          console.log("活动不存在停止跳转")
          console.log("活动不存在停止跳转")
          console.log("活动不存在停止跳转")
          console.log("活动不存在停止跳转")
          return
        }
        let info = JSON.stringify(that.ChinaTravelObj)
        uni.setStorageSync("ChinaTravelDialogTime", Date.parse(new Date()) + "")
        console.log(uni.getStorageSync("ChinaTravelDialogTime"))
        // uni.navigateTo({
        //   url: '../../index/ChinaTravel/dialog?info=' + info
        // })
      },
			
			showNews() {
				uni.navigateTo({
					url: '/pages/goodsDelivery/userMessage/userMessage'
				})
				
			},
			showPrice(price) {
				return publicData.showPrice(price, 100)
			},
			getMarginVODriver() {
				service.postRequest("/td/driver/home/getMarginVODriver", {
					version: 1
				}).then(res => {
					
					if (res.retCode == "0000000") {
						this.marginPrice = res.rspBody.margin;
					}
				})
			},
			getRestPrice() {
				service.postRequest("/td/driver/home/getAccountBkDriver", {
					version: 1
				}).then(res => {
					
					if (res.retCode == "0000000") {
						this.allAmountWithIn = (res.rspBody.allAmountWithIn)/1000;
						this.allAmountWithOut = (res.rspBody.allAmountWithOut)/1000;
					}
				})
			},
			async getAllSettings() {
				//获取删选条件配置信息
				//初始化装货点数据
				var that = this;
				try{
					//省市数据存入缓存
					var provinceLocal = uni.getStorageSync("provinceLocal");
					var provinceArr = [];
					if (provinceLocal) {
						provinceArr = JSON.parse(provinceLocal)
					} else {
						var result = await service.postRequest("/ts/nationDict/getBasicData");
						provinceArr = result.rspBody;
						uni.setStorageSync("provinceLocal", JSON.stringify(provinceArr));
					}
					var carLenRes = await service.postRequest("/ts/vehicle/length/get"); //车长
					var carTypeRes = await service.postRequest("/ts/vehicle/type/get"); //车型
					var carLen = carLenRes.rspBody.items;
					var carType = carTypeRes.rspBody.items; 
					var initProvince = {
						name: '全国',
						cities: [{
							name: '全国'
						}]
					}
					provinceArr.unshift(initProvince);
					provinceArr.forEach((item, index, arr) => {
						var provinceName = item.name;
						var cities = item.cities;
						provinceName = provinceName.split('省')[0];
						 if (provinceName.indexOf("内蒙古自治区") > -1) {
							 provinceName = "内蒙古"
						 } else if (provinceName.indexOf("自治区") > -1) {
							 provinceName = provinceName.substring(0 ,2);
						 } else if (provinceName.indexOf("特别行政区") > -1) {
							 provinceName = provinceName.substring(0 ,2);
						 }
						 arr[index].provinceName = provinceName
						 //处理市
						 cities.forEach(atem => {
							 var cityName = atem.name;
							 if (cityName.indexOf("回族自治州") > -1) {
								 cityName = cityName.split('回族自治州')[0];
							 } else if (cityName.indexOf("蒙古自治州") > -1) {
								 cityName = cityName.split('蒙古自治州')[0];
							 } else if (cityName.indexOf("自治州") > -1) {
								 cityName = cityName.split('自治州')[0];
							 } else if (cityName.indexOf("地区") > -1) {
								 cityName = cityName.split('地区')[0];
							 } else if (cityName.indexOf("土家族苗族") > -1) {
								 cityName = cityName.split('土家族苗族')[0];
							 } else if (cityName.indexOf("市") > -1) {
								 cityName = cityName.split('市')[0];
							 }
							 
							 atem.cityName = cityName;
						 })
					})
					// console.log(provinceArr[0], '省')
					var firstArr = [{typeName: '不限'},]
					that.carLen = carLen;
					that.carType = carType;
					that.carFleetArr = carLen;
					that.carFleetType = carType;
					that.provinceArr = provinceArr;
					that.cityArr = provinceArr[0].cities;
					that.provinceFleetArr = provinceArr;
					that.cityFleetArr = provinceArr[0].cities;
					that.unLoadingArray = [];
					that.loadingArray = [];
					that.unLoadingFleetArray = [];
					that.loadingFleetArray = [];
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
				
				
			},
			initPlatform() {
				var that = this;
				var isTabIndex = this.isTabIndex;
				uni.getLocation({
					geocode: true,
					 type: 'gcj02',
					success: function(res) {
						console.log(res, '定位地址');
						that.dataParams02.longitude = (res.longitude).toFixed(6)
						that.dataParams02.latitude = (res.latitude).toFixed(6)
						var province = res.address.province;
						var city = res.address.city;
						that.addressLocation = city;
						that.getPlatFormList("refresh", isTabIndex);
						uni.stopPullDownRefresh();
					},
					fail: function(res) {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
						uni.stopPullDownRefresh();
					}
				})
			},
			async getRecondMore(type, tabIndex) {
				//获取推荐的货源
				var dataParams02;
				var zhuang1 = this.zhuang1;
				var zhuang2 = this.zhuang2;
				var xie1 = this.xie1;
				var xie2 = this.xie2
				var areaSearchList = [];
				var fleetSids = new Object();
				if (tabIndex == 0) {
					//平台推荐货源
					areaSearchList = zhuang1.concat(xie1);
					dataParams02 = this.recordDataParams02
				} else {
					//车队货源
					dataParams02 = this.recordDataParams03
					areaSearchList = zhuang2.concat(xie2);
					//获取我的所有车队和加入的车队
					var fleet = await service.newQueryPostRequest("/cd/fleet/list", {pageSize:1000,pageNum:1,isMyFleet:1, verificationStatus: 1});
					var fleetAll = fleet.rspBody.items;
					var fleetCodeList = [];
					if (fleetAll.length > 0) {
						fleetAll.forEach(item => {
							fleetCodeList.push(item.code)
						})
					}				
					dataParams02.fleetCodeList = fleetCodeList;
					
				}
				//加载平台货源
				try{
					if (type == "refresh") {
						dataParams02.pageNum = 1;
					} else {
						dataParams02.pageNum = dataParams02.pageNum + 1;
					}
				//判断如果是从加入车队后跳转过来的数据就搜索该车队下有效的货源列表
				console.log(uni.getStorageSync('fleetName'),'fleetName加入车队后跳转过来')
				if (this.fleetName && this.fleetName != '') {
					dataParams02.keyword = this.fleetName;
				} else {
					dataParams02.keyword = ""
				}
				
				if (tabIndex == 0) {
					dataParams02.keyword != undefined && delete dataParams02.keyword;
					this.recordDataParams02 = dataParams02;
				} else {
					dataParams02.keyword == "" && delete dataParams02.keyword;
					this.recordDataParams03 = dataParams02;
				}
				var params = Object.assign({}, {areaSearchList: areaSearchList}, dataParams02);
				console.log(params, '平台推荐推荐货源的参数', tabIndex);
				var platformQuote = await service.newQueryPostRequest("/td/circuit/getDriverPtmOrdersAround", params);
					console.log(platformQuote, '阿萨萨推荐')
					this.loadingFlag = false;
					this.isNoScroll = false;
					uni.hideLoading();
					// console.log(platformQuote, 'aa')
					if (platformQuote.retCode == "0000000") {
						var platformQuoteList = platformQuote.rspBody.items;
						// console.log(platformQuoteList,"platformQuoteList")
						console.log(platformQuote.rspBody, type, '平台推荐货源');
						if (tabIndex == 0) {
							if (type == 'refresh') {
								this.recondArr = platformQuoteList;
								var total = this.total;
								var platList = this.platformQuoteList;
								this.isNoMore02 = (platformQuoteList.length < 10) ? 'noMore' : 'more'
							}  else {
								this.recondArr = this.recondArr.concat(platformQuoteList);
								this.isNoMore02 = platformQuoteList.length < 10 ? 'noMore' : 'more'
							}
						
						} else {
							if (type == "refresh") {
								this.recondArr1 = platformQuoteList;
								var total1 = this.total1;
								var fleetQuoteList = this.fleetQuoteList;
								this.isNoData04 = (total1 < 1 && platformQuoteList.length < 1) ? true : false;
								this.isNoMore04 = (platformQuoteList.length < 10 && total1 == fleetQuoteList.length) ? 'noMore' : 'more'
							} else {
								this.recondArr1 = this.recondArr1.concat(platformQuoteList);
								this.isNoMore04 = platformQuoteList.length < 10 ? 'noMore' : 'more'
								
							}
							
						
						}
						
						uni.stopPullDownRefresh();
						
					} else {
						uni.showToast({
							title: platformQuote.retDesc,
							icon: 'none'
						})
					}
					this.loading = false; //骨架屏隐藏
				}catch(e){
					console.log(e);
					this.isNoScroll = false;
					this.loading = false; //骨架屏隐藏
					console.log(e)
					this.loadingFlag = false;
					this.isShow = true;
					console.log(e)
					uni.stopPullDownRefresh();
					//TODO handle the exception
					uni.hideLoading();
				}
			},
			async getRecondList(type, tabIndex) {
				//获取推荐的货源
				var dataParams02;
				var zhuang1 = this.zhuang1;
				var zhuang2 = this.zhuang2;
				var xie1 = this.xie1;
				var xie2 = this.xie2
				var areaSearchList = [];
				var fleetSids = new Object();
				if (tabIndex == 0) {
					//平台推荐货源
					areaSearchList = zhuang1.concat(xie1);
					dataParams02 = this.recordDataParams02
				} else {
					//车队货源
					dataParams02 = this.recordDataParams03
					areaSearchList = zhuang2.concat(xie2);
					//获取我的所有车队和加入的车队
					var fleet = await service.newQueryPostRequest("/cd/fleet/list", {pageSize:1000,pageNum:1,isMyFleet:1, verificationStatus: 1});
					var fleetAll = fleet.rspBody.items;
					var fleetCodeList = [];
					if (fleetAll.length > 0) {
						fleetAll.forEach(item => {
							fleetCodeList.push(item.code)
						})
					}				
					dataParams02.fleetCodeList = fleetCodeList;
					
				}
				//加载平台货源
				try{
					if (type == "refresh") {
						dataParams02.pageNum = 1;
					} else {
						dataParams02.pageNum = dataParams02.pageNum + 1;
					}
				//判断如果是从加入车队后跳转过来的数据就搜索该车队下有效的货源列表
				console.log(uni.getStorageSync('fleetName'),'fleetName加入车队后跳转过来')
				if (this.fleetName && this.fleetName != '') {
					dataParams02.keyword = this.fleetName;
				} else {
					dataParams02.keyword = ""
				}
				
				if (tabIndex == 0) {
					dataParams02.keyword != undefined && delete dataParams02.keyword;
					this.recordDataParams02 = dataParams02;
				} else {
					dataParams02.keyword == "" && delete dataParams02.keyword;
					this.recordDataParams03 = dataParams02;
				}
				var params = Object.assign({}, {areaSearchList: areaSearchList}, dataParams02);
				console.log(params, '平台推荐推荐货源的参数', tabIndex);
				var platformQuote = await service.newQueryPostRequest("/td/circuit/getDriverPtmOrdersAround", params);
				
					console.log(platformQuote, '阿萨萨推荐')
					this.loadingFlag = false;
					this.isNoScroll = false;
					uni.hideLoading();
					// console.log(platformQuote, 'aa')
					if (platformQuote.retCode == "0000000") {
						var platformQuoteList = platformQuote.rspBody.items;
						// console.log(platformQuoteList,"platformQuoteList")
						console.log(platformQuote.rspBody, type, '平台推荐货源');
						if (tabIndex == 0) {
							var platList = this.platformQuoteList;
							
							if (type == 'refresh') {
								
								this.recondArr = platformQuoteList;
				
							}  else {
								this.recondArr = this.recondArr.concat(platformQuoteList);
								
							}
						
						} else {
							var fleetQuoteList = this.fleetQuoteList;
							
							if (type == "refresh") {
								this.recondArr1 = platformQuoteList;

							} else {
								this.recondArr1 = this.recondArr1.concat(platformQuoteList);
								
								
							}
							
						
						}
						return platformQuoteList;
					} else {
						return [];
					}
					
				}catch(e){
					return [];
				}
			},
			showSendAddress(item) { // 发货地
				let obj = {
				 province: item.provinceName1,
				 provinceCode: item.provinceCode1 || "",
				 city: item.cityName1,
				 cityCode: item.cityCode1 || "",
				 area: item.areaName1,
				 areaCode: item.areaCode1 || "",
				}
				return this.showAddressMsg(obj);
			},
			showAddressMsg(obj) { // 展示地区if(obj.provinceCode == '310000' || obj.provinceCode == '110000' || obj.provinceCode == '500000' || obj.provinceCode == '120000') {
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
			showArriveAddress(item) { // 目的地
				let obj = {};
				if(item.provinceName10) {
					obj = {
						province: item.provinceName10,
						provinceCode: item.provinceCode10,
						city: item.cityName10,
						cityCode: item.cityCode10,
						area: item.areaName10,
						areaCode: item.areaCode10,
					}
				}else if(item.provinceName9){
					obj = {
						province: item.provinceName9,
						provinceCode: item.provinceCode9,
						city: item.cityName9,
						cityCode: item.cityCode9,
						area: item.areaName9,
						areaCode: item.areaCode9,
					}
				}
				else if(item.provinceName8){
					obj = {
						province: item.provinceName8,
						provinceCode: item.provinceCode8,
						city: item.cityName8,
						cityCode: item.cityCode8,
						area: item.areaName8,
						areaCode: item.areaCode8,
					}
				}
				else if(item.provinceName4){
					obj = {
						province: item.provinceName4,
						provinceCode: item.provinceCode4,
						city: item.cityName4,
						cityCode: item.cityCode4,
						area: item.areaName4,
						areaCode: item.areaCode4,
					}
				}
				else if(item.provinceName3){
					obj = {
						province: item.provinceName3,
						provinceCode: item.provinceCode3,
						city: item.cityName3,
						cityCode: item.cityCode3,
						area: item.areaName3,
						areaCode: item.areaCode3,
					}
				}
			   return this.showAddressMsg(obj);
			},
			
			//获取平台货源的数据
			async getPlatFormList(type, tabIndex) {
				var dataParams02;
				var zhuang1 = this.zhuang1;
				var zhuang2 = this.zhuang2;
				var xie1 = this.xie1;
				var xie2 = this.xie2
				var areaSearchList = [];
				var fleetSids = new Object();
				if (tabIndex == 0) {
					//平台货源
					areaSearchList = zhuang1.concat(xie1);
					dataParams02 = this.dataParams02
				} else {
					//车队货源
					dataParams02 = this.dataParams03
					areaSearchList = zhuang2.concat(xie2);
					//获取我的所有车队和加入的车队
					var fleet = await service.newQueryPostRequest("/cd/fleet/list", {pageSize:1000,pageNum:1,isMyFleet:1, verificationStatus: 1});
					// var relateFleet = await service.newQueryPostRequest("/cd/fleet/list", {pageSize:100,pageNum:1,isMyFleet:1,isOwner:0, verificationStatus: 1});
					// console.log(fleet, '飒飒说');
					var fleetAll = fleet.rspBody.items;
					var fleetCodeList = [];
					if (fleetAll.length > 0) {
						fleetAll.forEach(item => {
							fleetCodeList.push(item.code)
						})
					}
				
					dataParams02.fleetCodeList = fleetCodeList;
					
				}
				//加载平台货源
				try{
					if (type == "refresh") {
						dataParams02.pageNum = 1;
					} else {
						dataParams02.pageNum = dataParams02.pageNum + 1;
					}
				//判断如果是从加入车队后跳转过来的数据就搜索该车队下有效的货源列表
				console.log(uni.getStorageSync('fleetName'),'fleetName加入车队后跳转过来')
				if (this.fleetName && this.fleetName != '') {
					dataParams02.keyword = this.fleetName;
				} else {
					dataParams02.keyword = ""
				}
				
				if (tabIndex == 0) {
					dataParams02.keyword != undefined && delete dataParams02.keyword;
					this.dataParams02 = dataParams02;
				} else {
					dataParams02.keyword == "" && delete dataParams02.keyword;
					this.dataParams03 = dataParams02;
				}
				var params = Object.assign({}, {areaSearchList: areaSearchList}, dataParams02);
				console.log(params, '平台货源的参数', tabIndex);
				var platformQuote = await service.newQueryPostRequest("/td/circuit/getDriverPtmOrdersNew", params);
					console.log(platformQuote, '阿萨萨')
					this.loadingFlag = false;
					this.isNoScroll = false;
					// console.log(platformQuote, 'aa')
					if (platformQuote.retCode == "0000000") {
						var platformQuoteList = platformQuote.rspBody.items;
						// console.log(platformQuoteList,"platformQuoteList")
						console.log(platformQuoteList[0], '平台货源');
						if (tabIndex == 0) {
							this.total = platformQuote.rspBody.total;
							if (type == 'refresh') {
								this.platformQuoteList = platformQuoteList;
								
								if (!dataParams02.vehicleLength && !dataParams02.vehicleModel && areaSearchList.length < 1) {
									//没有搜索条件，请求数据
									if (platformQuoteList.length < 1) {
										this.isNoData02 = true;
										this.isNoMore02 = "more";
									} else if (platformQuoteList.length < 10) {
										this.isNoData02 = false;
										this.isNoMore02 = "noMore";
									} else {
										this.isNoData02 = false;
										this.isNoMore02 = "more";
										
									}
									this.moreBoxText = "选择出发城市，查询更多"
									uni.hideLoading();
									uni.stopPullDownRefresh();
									this.loading = false; //骨架屏隐藏
									return;
								}
								this.moreBoxText = "暂无更多数据,快去搜索吧"
							
								//获取推荐货源
								if (platformQuoteList.length < 1) {
									//设置推荐货源应该过滤的参数
									this.setFilterParams(tabIndex);
									var recondList = await this.getRecondList("refresh", tabIndex);
									console.log("recondList长度",recondList)
									if (recondList.length < 1) {
										this.isNoData02 = true;
										this.isNoMore02 = "more";
									} else if (recondList.length < 10) {
										this.isNoData02 = false;
										this.isNoMore02 = "noMore";
									} else {
										this.isNoData02 = false;
										this.isNoMore02 = "more";
									}
								} else if (platformQuoteList.length < 10) {
									this.isNoData02 = false;
									this.setFilterParams(tabIndex);
									var recondList = await this.getRecondList("refresh", tabIndex);
									if (recondList.length < 10) {
										this.isNoMore02 = "noMore";
									} else {
										this.isNoMore02 = "more";
									}
								} else {
									this.setFilterParams(tabIndex);
									this.isNoData02 = false;
									this.isNoMore02 = "more";
								}
							}else {
								this.platformQuoteList = this.platformQuoteList.concat(platformQuoteList);
								this.isNoData02 = false;
								if (!dataParams02.vehicleLength && !dataParams02.vehicleModel && areaSearchList.length < 1) {
									//没有搜索条件，请求数据
									if (platformQuoteList.length < 10) {
										this.isNoMore02 = "noMore";
									} else {
										if (this.platformQuoteList.length == 50) {
											this.isNoMore02 = "noMore";
										} else {
											this.isNoMore02 = "more";
										}
									}
									uni.hideLoading();
									uni.stopPullDownRefresh();
									this.loading = false; //骨架屏隐藏
									return;
								}
								
								if (platformQuoteList.length < 10) {
									this.setFilterParams(tabIndex);
									var recondList = await this.getRecondList("refresh", tabIndex);
									if (recondList.length < 10) {
										this.isNoMore02 = "noMore"
									} else {
										this.isNoMore02 = "more"
									}
								} else {
									this.setFilterParams(tabIndex);
									this.isNoMore02 = "more"
								}
							}
						} else {
							this.total1 = platformQuote.rspBody.total;
							if (type == "refresh") {
								this.fleetQuoteList = platformQuoteList;
								
								if (!dataParams02.vehicleLength && !dataParams02.vehicleModel && areaSearchList.length < 1 && !dataParams02.keyword ) {
									//没有搜索条件，请求数据
									if (platformQuoteList.length < 1) {
										this.isNoData04 = true;
										this.isNoMore04 = "more";
									} else if (platformQuoteList.length < 10) {
										this.isNoData04 = false;
										this.isNoMore04 = "noMore";
									} else {
										this.isNoData04 = false;
										this.isNoMore04 = "more";
									}
									this.moreBoxText = "选择出发城市，查询更多"
									uni.hideLoading();
									uni.stopPullDownRefresh();
									this.loading = false; //骨架屏隐藏
									return;
								}
								this.moreBoxText = "暂无更多数据,快去搜索吧"
								if (platformQuoteList.length < 1) {
									//设置推荐货源应该过滤的参数
									this.setFilterParams(tabIndex);
									var recondList = await this.getRecondList("refresh", tabIndex);
									console.log("recondList长度",recondList)
									if (recondList.length < 1) {
										this.isNoData04 = true;
										this.isNoMore04 = "more";
									} else if (recondList.length < 10) {
										this.isNoData04 = false;
										this.isNoMore04 = "noMore";
									} else {
										this.isNoData04 = false;
										this.isNoMore04 = "more";
									}
								} else if (platformQuoteList.length < 10) {
									this.isNoData04 = false;
									this.setFilterParams(tabIndex);
									var recondList = await this.getRecondList("refresh", tabIndex);
									if (recondList.length < 10) {
										this.isNoMore04 = "noMore";
									} else {
										this.isNoMore04 = "more";
									}
								} else {
									this.setFilterParams(tabIndex);
									this.isNoData04 = false;
									this.isNoMore04 = "more";
								}
							} else {
								this.isNoData04 = false
								this.fleetQuoteList = this.fleetQuoteList.concat(platformQuoteList);
								if (!dataParams02.vehicleLength && !dataParams02.vehicleModel && areaSearchList.length < 1) {
									//没有搜索条件，请求数据
									if (platformQuoteList.length < 10) {
										this.isNoMore04 = "noMore";
									} else {
										if (this.fleetQuoteList.length == 50) {
											
											this.isNoMore04 = "noMore";
										} else {
											
											this.isNoMore04 = "more";
										}
									}
									uni.hideLoading();
									uni.stopPullDownRefresh();
									this.loading = false; //骨架屏隐藏
									return;
								}
								if (platformQuoteList.length < 10) {
									this.setFilterParams(tabIndex);
									var recondList = await this.getRecondList("refresh", tabIndex);
									if (recondList.length < 10) {
										this.isNoMore04 = "noMore"
									} else {
										this.isNoMore04 = "more"
									}
								} else {
									this.setFilterParams(tabIndex);
									this.isNoMore04 = "more"
								}
							}
						}
						
						uni.stopPullDownRefresh();
					} else {
						uni.showToast({
							title: platformQuote.retDesc,
							icon: 'none'
						})
					}
					uni.hideLoading();
					this.loading = false; //骨架屏隐藏
				}catch(e){
					console.log(e);
					this.isNoScroll = false;
					this.loading = false; //骨架屏隐藏
					console.log(e)
					this.loadingFlag = false;
					this.isShow = true;
					console.log(e)
					uni.stopPullDownRefresh();
					//TODO handle the exception
					uni.hideLoading();
				}
				
			},
			setFilterParams(tabIndex) {
				//设置需过滤的参数
				var platformQuoteList = this.platformQuoteList;
				var fleetQuoteList = this.fleetQuoteList;
				var sidList = [];
				if (tabIndex == 0) {
					platformQuoteList.forEach(item => {
						sidList.push(item.sid)
					})
					this.recordDataParams02.notSidList = sidList
				} else {
					fleetQuoteList.forEach(item => {
						sidList.push(item.sid)
					})
					this.recordDataParams03.notSidList = sidList
				}
			},
			hintScroll() {
				let distance = '';
				var query = uni.createSelectorQuery().in(this);
				query.select('#hintSwiper').boundingClientRect(data => {
					console.log("节点信息" + JSON.stringify(data));
					// let dataObj = JSON.parse(JSON.stringify(data));
					distance = Number(data.width) * 2;
					console.log(distance);
					if(!distance) {
						return false;
					}
					let that = this;
					that.hintRef && clearInterval(that.hintRef);
					that.hintRef = setInterval(() => {
						distance = distance - 2;
						  // console.log(distance, 'aaa')
						// 如果位移超出最大可滑动距离，则回到起点
						  if((distance + (Number(data.width) * 2 + 200)) == 0) {
							distance = Number(data.width) * 2;
						  }
						 
						  that.boxTransform = 'transform:translateX(' + distance + 'rpx)';
						  that.$forceUpdate();
					}, 200)
				}).exec();
			},
			showVehicleLength(item) {
				//车长
				var vehicleLength1 = item.vehicleLength1;
				var vehicleLength2 = item.vehicleLength2;
				// 展示车长
				let orderVehicleLength = item.vehicleLength1 ? item.vehicleLength1 : '';
				orderVehicleLength = orderVehicleLength == '-1' ? '不限车长' : orderVehicleLength + '米';
				orderVehicleLength = item.vehicleLength2 ? orderVehicleLength + '/' + item.vehicleLength2 + '米' : orderVehicleLength;
				return orderVehicleLength
			},
			showVehicleModel(item) {
				var vehicleModel1 = item.vehicleModel1;
				var vehicleModel2 = item.vehicleModel2;
				var vehicleModelArr = [];
				//判断是否有车型
				if (vehicleModel1) {
					vehicleModelArr.push(vehicleModel1);
				}
				if (vehicleModel2) {
					vehicleModelArr.push(vehicleModel2);
				}
				var orderVehicleModel = vehicleModelArr.join("/");
				return orderVehicleModel
			},
			formatPlatformQuoteList(list, type, ref) {
				var platformQuoteList = [];
				if (list.length < 1) {
					platformQuoteList = list;
				}
				
				
				var dataArr = [];
				try{
					list.forEach(item => {
						
						
						//清除重复数据
						if (type == "listRecord") {
							var platformQuoteList_pingtai = this.platformQuoteList;
							var findIndex = platformQuoteList_pingtai.findIndex(atem => {
								return atem.sid == item.sid
							})
							console.log(findIndex)
							if (findIndex > -1) {
								return;
							}
							
						} else if (type == "listFleetRecord") {
							var platformQuoteList_fleet = this.fleetQuoteList;
							var clearedArr = [];
							
							var findIndex = platformQuoteList_fleet.findIndex(atem => {
								return atem.sid == item.sid
							})
							if (findIndex > -1) {
								return;
							}
							
						}
						var LoadingAndUnloadingMethods = "";
						// var orderAddressVOS = item.child.orderAddressVOS;
						
						//装卸方式
						var loadingMethods = "", unLoadingMethods = "";
						var cargoSource = item.cargoSource; //是否是小程序货源
						
						var provinceName2 = item.provinceName2 || "";
						
						var provinceName4 = item.provinceName4 || "";
					
						if (provinceName2) {
							loadingMethods = "二装"
						} else {
							loadingMethods = "一装"
						}
					
						
						if (provinceName4) {
							unLoadingMethods = "两卸";
						} else {
							unLoadingMethods = "一卸"
						}
						
						LoadingAndUnloadingMethods = loadingMethods + unLoadingMethods;
					
						//当前位置离装货点的距离
						var distance = 0;
						var latitude1 = item.latitude1;
						var longitude1 = item.longitude1;
						
						if (this.dataParams02.latitude) {
							distance = publicData.getFlatternDistance(latitude1, longitude1, this.dataParams02.latitude, this.dataParams02.longitude);
							distance = distance ? Number(distance) : 0;
						} else {
							distance = Number(item.distance) ? ((item.distance)/1000).toFixed(0) : 0;
						}
						
						//货主发布货源的时间
						var pushDt = item.pushDt;
						if (pushDt) {
							pushDt = pushDt.replace(/-/g, "/");
							var newDate = new Date();
							var nowDataYear = new Date().getFullYear();
							var nowDataMonth = new Date().getMonth() + 1;
							var nowDataDay = new Date().getDate();
							//明天的时间戳
							var day2 = new Date();
							day2.setTime(day2.getTime()+24*60*60*1000);
							var will2Year = day2.getFullYear();
							var will2Month = day2.getMonth() + 1;
							var will2Day = day2.getDate();
							//后天
							var day3 = new Date();
							day3.setTime(day3.getTime()+24*60*60*1000);
							var will3Year = day3.getFullYear();
							var will3Month = day3.getMonth() + 1;
							var will3Day = day3.getDate();
							var dateType = 0; //表示是今天
							var dateTime = "";
							var willDoData = new Date(pushDt);
							var willYear = willDoData.getFullYear();
							var willMonth = willDoData.getMonth() + 1;
							var willDay = willDoData.getDate();
							
							if (nowDataYear == willYear && nowDataMonth == willMonth && nowDataDay == willDay ) {
								//是今天
								dateType = 0;
							} else if (will2Year == willYear && will2Month == willMonth && will2Day == willDay) {
								dateType = 1; //明天
							} else if (will3Year == willYear && will3Month == willMonth && will3Day == willDay) {
								dateType = 2; //后天
							} else {
								dateType = 3; //其他时间
							}
							var hour = new Date(pushDt).getHours();
							var minutes = new Date(pushDt).getMinutes()
							if (hour < 10) {
								hour = '0' + hour
							}
							if (minutes < 10) {
								minutes = '0' + minutes
							}
							dateTime = hour + ':' +  minutes;
							if (dateType == 3) {
								dateTime = item.pushDt;
							}
						}
						
					
						//货物相关						
					
						var quotePriceTypeName = item.quotePriceTypeName || ""; //货物单位
							//单位

						//订单状态
						var orderState = item.orderState;
						var userId = this.userId;
						
						var orderQuotationStatus = item.orderQuotationStatus;
						
						//货源的状态
						var orderSecondState = item.orderSecondState;
						
						//判断是否是冷藏车还是普通
						var orderType = item.orderType;
						
						//货主信息
						var shipMobile = item.mobile1;
				
						//货源是否是固定价格的货源
						var fixPriceFlag = item.fixPriceFlag;
						
						var fixPrice = item.fixPrice;
						
						var multiTruck = item.multiTruck; //判断是单车还是多车货源
						//判断多车货源的报价单状态
						var orderQuoation = item.orderQuoation;
					
						//报价数和浏览数
						var fixPriceFlag = item.fixPriceFlag;
					
						var fleetName = item.fleetName;
						var cargoSource = item.cargoSource; //货源来源
						
						
						dataArr.push({
							orderQuoation,
							orderState,
							quotePriceTypeName,
							sid: item.sid,
							multiTruck,
							dateTime,
							pushDt,
							dateType,
							LoadingAndUnloadingMethods,
						
							sid: item.sid,
							orderState,
							orderQuotationStatus,
							orderSecondState,
							orderType,
							fixPriceFlag,
							fixPrice,
						
							
							fleetName,
							cargoSource,
							shipMobile,
							...item
						})
						
					})
					
				}catch(e){
					//TODO handle the exception
					console.log(e)
					
				}
				
				platformQuoteList = dataArr;
				if (type == "list02") {
					this.platformQuoteList = ref == 'refresh' ? platformQuoteList : this.platformQuoteList.concat(platformQuoteList)
					
				}  else if (type == 'fleet') {
					this.fleetQuoteList = ref == 'refresh' ? platformQuoteList : this.fleetQuoteList.concat(platformQuoteList)
					
				} else if (type == 'listRecord') {
				
					console.log("recondArr", platformQuoteList);
					this.recondArr = ref == 'refresh' ? platformQuoteList : this.recondArr.concat(platformQuoteList)
				} else if (type == "listFleetRecord") {
					
					this.recondArr1 = ref == 'refresh' ? platformQuoteList : this.recondArr1.concat(platformQuoteList)
				}
				// console.log(this.fleetQuoteList,'this.fleetQuoteList车队货源数据')
				this.isShow = true;
				this.$forceUpdate()
				
				
			},
			async switchTab(index) {
				var that = this;
				if (!service.btnRepeat()) return false;
				var statusBarHeight = this.statusBarHeight;
				console.log(index, 'switch121212111', this.loadingFlag)
				if (index == 0) {
					
					//加入骨架屏
					this.loading = true; //显示骨架屏
					
					this.isTabIndex = index;
					this.isNoScroll = true;
					var platformQuoteList = this.platformQuoteList;
					
					uni.showLoading({
						title: '加载中...'
					})
					//获取平台货源
					that.getPlatFormList('refresh', 0);
					
				} else if(index == 1) {
					this.isTabIndex = index;
					//加入骨架屏
					this.loading = true; //显示骨架屏
					this.isNoScroll = true;
					uni.showLoading({
						title: '加载中...'
					})
					//获取平台货源
					that.getPlatFormList('refresh', 1);
					
				} 
				
				//切换时候就清楚加入车队时候带过来的车队名字
					uni.removeStorage({
						key: 'fleetName',
						success: function(res) {
							console.log('success');
						}
					})
					this.fleetName = ''

			},
		
			async goQuotedPrice(index) {
				//去报价
				if (!service.btnRepeat()) return;
				var platformQuoteList = this.platformQuoteList;
				var item = platformQuoteList[index];
				if (item.quoteState == 1) {
					return;
				}
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, '用户信息');
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								service.loginSelf(1);
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 || faceVerify != 1 ) {
					uni.showModal({
						title: '请认证驾驶证，行驶证和身份证',
						content: '未完成认证，请认证后操作。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								if (identityVerify !== 1 || faceVerify != 1) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else if (driverVerify !== 1) {
									uni.navigateTo({
										url: '../../my/driverVerify/newDriverVerify'
									})
								} else if (vehicleVerify !== 1) {
									uni.navigateTo({
										url: '../../my/carVerify/newCarVerify'
									})
								}
								
							}
						}
					})
					return
				}
				
				var marginPrice = this.marginPrice;
				var allAmountWithIn = this.allAmountWithIn;
				//保证金判断
				if (allAmountWithIn < marginPrice) {
					//保证金判断
					this.$refs.confirmPopup1.open();
					return
				}
				var response = await service.newQueryPostRequest("/td/circuit/getOrderRecord", {
					sid: item.sid
				});
			
				if (response.retCode == "0000000") {
					if (response.rspBody.orderState != 1) {
						uni.showToast({
							title: '货源已无效',
							icon: 'none'
						})
						
						platformQuoteList.splice(index, 1);
						this.platformQuoteList = platformQuoteList;
						return;
					}
				}
				
				
				console.log(platformQuoteList, index, '路由');
				uni.navigateTo({
					url: '../quotedPrice/quotedPrice?quoteDetails=' + JSON.stringify(item)
				})
			},
			async goDetail(item, index) {
				//进入货源详情
				
				
				console.log('进入货源详情', item, index)
				
				if (!service.btnRepeat()) return;
				//判断是否三证认证
				//去认证
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								service.loginSelf(1);
							}
						}
					})
					return
				}
				var orderQuotationStatus = item.orderQuotationStatus;
				if (index == 2) {
					//判断是否已报价或已成交
					if ((orderQuotationStatus !== undefined && orderQuotationStatus <= 2) || orderQuotationStatus >= 3 ) {
						uni.navigateTo({
							url: '../supplyDetails/supplyGoods?sid=' + item.sid + '&distance=' + item.distance
						})
					} else {
						uni.navigateTo({
							url: '../supplyDetails/supplyDetails?sid=' + item.sid + '&status=' + index + '&distance=' + item.distance
						})
					}
				} else if (index == 1) {
					//判断是否已报价或已成交
					uni.navigateTo({
						url: '../supplyDetails/supplyGoods?sid=' + item.sid + '&distance=' + item.distance
					})
					
					
				} else if (index == 3) {
					console.log("进入阿撒大", item.unbrokenFlag);
					if (item.cargoSource == "WX_ZKC" || item.unbrokenFlag == 1) {
						this.shipData = item;
						this.$refs.shipAlertPopup.open();
						return;
					}
					
					if (item.orderSecondState == 15) {
						uni.showToast({
							title: '货源已下架，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					if (item.orderSecondState == 18) {
						uni.showToast({
							title: '货源已关闭，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					if (item.orderSecondState != 11 && item.orderSecondState != 13 && item.orderSecondState != 14 && item.orderQuotationStatus == undefined && item.multiTruck < 2) {
						uni.showToast({
							title: '货源已关闭，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					
					//判断是否已报价或已成交
					var multiTruck = item.multiTruck;
					var orderQuoation = item.orderQuotationStatus;
					if (multiTruck > 1) {
						if ((orderQuoation !== undefined && orderQuoation <= 2)) {
							uni.navigateTo({
								url: '../supplyDetails/supplyGoods?sid=' + item.sid + '&distance=' + item.distance
							})
						} else {
							uni.navigateTo({
								url: '../supplyDetails/supplyDetails?sid=' + item.sid + '&status=' + index + '&distance=' + item.distance
							})
						}
					} else {
						if ((orderQuoation !== undefined && orderQuoation <= 2) || orderQuoation > 4) {
							uni.navigateTo({
								url: '../supplyDetails/supplyGoods?sid=' + item.sid + '&distance=' + item.distance
							})
						} else {
							uni.navigateTo({
								url: '../supplyDetails/supplyDetails?sid=' + item.sid + '&status=' + index + '&distance=' + item.distance
							})
						}
					}
					
					
				}			
				
			},
			showPopUp(addressTypeKey) {
				this.addressTypeKey = addressTypeKey;
				var isTabIndex = this.isTabIndex;
				let areaObj;
				
				if (isTabIndex == 0) {
					areaObj = addressTypeKey == 1 ? this.zhuang1 : this.xie1 ;
					console.log('isTabIndex == 0',addressTypeKey,this.zhuang1, this.xie1);
				} else {
					areaObj = addressTypeKey == 1 ? this.zhuang2 : this.xie2
					console.log('isTabIndex else 0',addressTypeKey,this.zhuang2, this.xie2);
				}
				console.log('点击了选择装货或者卸货框',isTabIndex,areaObj)
				if (areaObj.length > 0) {
					let areaMsg = JSON.stringify(areaObj);
					console.log("areaMsg", areaMsg);
					uni.navigateTo({ // 创建地址需根据点击的装货地或卸货地改变地址选择页的页面名称
						url: '/pages/chooseArea/chooseDriverArea?addressTypeKey=' + this.addressTypeKey + '&areaMsg=' + areaMsg
					})
				} else {
					console.log('areaObj.length = 0')
					uni.navigateTo({ // 创建地址需根据点击的装货地或卸货地改变地址选择页的页面名称
						url: '/pages/chooseArea/chooseDriverArea?addressTypeKey=' + this.addressTypeKey
					})
				}
				
				
			},
			cancel() {
				this.isAlertShow = false
			},
		
		
	
			closeVerify() {
				this.isVerify = false
			},
			closeAdvers() {
				//关闭广告业
				this.remindStatus = false;
				uni.setStorageSync("remindStatus", 1);
			},
			goAdvertise() {
				//去认证
				this.remindStatus = false;
				uni.setStorageSync("remindStatus", 1);
				uni.navigateTo({
					url: '../../my/driverVerify/newDriverVerify'
				})
			},
			goVerify() {
				//去认证
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								service.loginSelf(1);
							}
						}
					})
					return
				}
				var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				var faceVerify = JSON.parse(userInfo).attrs.faceVerify;
				if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 || faceVerify != 1 ) {
					if (identityVerify !== 1 || faceVerify != 1) {
						//判断是新增还是编辑
						var userCode = JSON.parse(userInfo).attrs.userCode;
						service.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
						.then(res=>{
							console.log('用户详细信息', res);
							uni.hideLoading();
							if(res.retCode == "0000000") {
								var idNo = res.rspBody.idNo;
								if (idNo) {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
									})
								} else {
									uni.navigateTo({
										url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingNewUsers'
									})
								}
								
							}
						})
						
					} else if (driverVerify !== 1) {
						uni.navigateTo({
							url: '../../my/driverVerify/newDriverVerify'
						})
					} else if (vehicleVerify !== 1) {
						uni.navigateTo({
							url: '../../my/carVerify/newCarVerify'
						})
					}
						
					
				}
			},
			goCharge() {
				//去充值
				this.$refs.confirmPopup1.close();
				uni.navigateTo({
					url: '../../goodsDelivery/userCenter/userWallet/topUp'
				})
			},
			toSearch(index) {
				//进入搜索页面
				uni.showLoading({
					title: '加载中',
				})
				if (index == 0) {
					this.isNoMore02 = "more";
					this.recondArr = []
				} else {
					this.isNoMore04 = "more";
					this.recondArr1 = [];
				}
				this.getPlatFormList("refresh", index);				
			},
			goNextStep() {
				console.log('aaaa')
				this.isStep = 2
			},
			goLastStep() {
				//我知道了
				var that = this;
				this.isStep = 0
				uni.showTabBar();
				//判断是否是首次登录，如果是首次登录则弹出广告图片
				setTimeout(() => {
					//是否展示广告
					var remindStatus = uni.getStorageSync("remindStatus");
					if (remindStatus == 0) {
						//表示是第一次登录
						that.remindStatus = true;
					}
				}, 1000)
				
			},
			getLocation() {
				//获取定位
				var that = this;
				var platform = uni.getSystemInfoSync().platform
				if (platform == "ios") {
					uni.showLoading({
						title: '定位中'
					})
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: function(res) {
							uni.hideLoading();
							console.log(res, '自己的定位')
							that.addressLocation = res.address.city;
							that.getCenterLocationInfo();
						},
						fail(err) {
							console.log("AsasAsasAsasAsasAsasAsasAsasAsasAsasAsas",err)
							uni.hideLoading();
							uni.showToast({
								title: '请打开定位',
								icon: 'none'
							})
						}
						
					})
					return;
				}
				
				if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '将获取您的位置权限以显示最近的货源',
						success(res) {
							if (res.confirm) {
								uni.showLoading({
									title: '定位中'
								})
								uni.getLocation({
									type: 'gcj02',
									geocode: true,
									success: function(res) {
										uni.hideLoading();
										console.log(res, '自己的定位')
										that.addressLocation = res.address.city;
										that.getCenterLocationInfo();
									},
									fail(err) {
										console.log("AsasAsasAsasAsasAsasAsasAsasAsasAsasAsas",err)
										uni.hideLoading();
										uni.showToast({
											title: '请打开定位',
											icon: 'none'
										})
									}
									
								})
							}
						},
						fail: function(err) {
							console.log("AsasAsasAsasAsasAsasAsasAsasAsasAsasAsas",err)
						}
					})
				} else {
					uni.showLoading({
						title: '定位中'
					})
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: function(res) {
							uni.hideLoading();
							console.log(res, '自己的定位')
							that.addressLocation = res.address.city;
							that.getCenterLocationInfo();
						},
						fail(err) {
							console.log("AsasAsasAsasAsasAsasAsasAsasAsasAsasAsas",err)
							uni.hideLoading();
							uni.showToast({
								title: '请打开定位',
								icon: 'none'
							})
						}
						
					})
				}
				
			
				
			},
			goReport(){
				let that = this
				if(!that.reportIsThreeAuth()){
					return
				}
				uni.navigateTo({
					url: '/pages/index/report/report'
				})
			},
			reportIsThreeAuth(index){
				let that = this
				console.log("三证校验结果")
				var userInfo = uni.getStorageSync("userInfo");
				console.log(JSON.parse(userInfo))
				let flag = false
				if (userInfo) {
				  var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
				  var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
				  var vehicleVerify  = JSON.parse(userInfo).attrs.vehicleVerify;
				  var isFace  = JSON.parse(userInfo).attrs.faceVerify;
				  
				  if (identityVerify !== 1  || isFace !== 1) {
					uni.showToast({
					  title: '请您先完成实名认证再参与现金奖励活动哦~',
					  icon: 'none'
					})
					return flag
				  }
				if (driverVerify!== 1 ) {
					uni.showToast({
					  title: '请您先完成驾驶证认证再参与现金奖励活动哦~',
					  icon: 'none'
					})
					return flag
				  }
				if (vehicleVerify !== 1 ) {
					uni.showToast({
					  title: '请您先完成车辆认证再参与现金奖励活动哦~',
					  icon: 'none'
					})
					return flag
				  }
							if (identityVerify !== 1 || driverVerify!== 1 || vehicleVerify !== 1 ) {
					flag = false
				  } else {
					flag = true
				  }
				}
				return flag
			},
			showBigBanner(item, img) {
				if(item.bigLinkUrl) {
					if(item.bigLinkType == 'route') {
						uni.navigateTo({
							url: item.bigLinkUrl
						})
					}
					if(item.bigLinkType == 'web') {
						getApp().globalData.promoteLinkUrl = item.bigLinkUrl;
						uni.navigateTo({
							url: '../../advertisingH5/advertisingH5'
						})
					}
				}else {
					uni.previewImage({
						urls: [item.bigAdvUrl],
						success: function(data) {
							console.log(data);
						},
						fail: function(err) {
							console.log(err);
						}
					});
				}
			},
			backTap() {
			  uni.setStorageSync("firstGetInApp", "second");
			  this.advertiesTimeOut && clearInterval(this.advertiesTimeOut);
			  this.showGuide = 2;
			  //判断是否第一次登录
			  var remindStatus = uni.getStorageSync("remindStatus");
			  //为false说明第一次登录
			  if (remindStatus == 0) {
			  	 // uni.hideTabBar();
			  	 // this.isStep = 1
				 this.remindStatus = true
			  } else {
			  	//检测是否有新版本更新
			  	publicData.checkVersion();
			  }
			  setTimeout(() => {
			    uni.showTabBar();
			  }, 800);
        	this.setDialog()
			},
			toChangeGoEasyStatus() {
				// var userInfo = uni.getStorageSync("userInfo");
				// if (!userInfo) return;
				// userInfo = JSON.parse(userInfo);
				// if(this.goEasy.getConnectionStatus() == 'disconnected') {
				// 	console.log('goEasy登录');
				// 	getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
				// 	getApp().globalData.imService.connect(userInfo);
				// 	uni.$emit("refreshData_message"); // 更新会话列表，并重新订阅群聊
				// }else {
				// 	this.logout();
				// }
			},
			logout () { // 进入登录页需先退出断开goEasy链接
				let im = this.goEasy;
				let that = this;
			    im.disconnect({
			        onSuccess: function(){
			            console.log('断连成功')
			            getApp().globalData.imService = null;
						that.toChangeGoEasyStatus();
			        },
			        onFailed: function(error){
			            uni.showToast({
			                title:'断连失败'
			            })
			        }
			    });
			},
			playMusic(){
				let src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/success.mp3';
				//实例化声音  
				this.Audio.src = src; //音频地址  
				this.Audio.play(); //执行播放
			},
			playFaliMusic(){
				let src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/fail.mp3';
				this.Audio.src = src; //音频地址  
				this.Audio.play(); //执行播放
			},
			getCheckData(code){
				let that = this;
				var userRole = uni.getStorageSync("userRole");
				service.postRequest('/ld/ldebarcode/verify', {
					userId: that.userInfo.userId,
					serviceType: userRole==1?10:20,
					barCode: code,
				}).then(res=>{
					console.log('getCheckData', res)
					if(res.retCode == "0000000"){
						that.ldeId = res.rspBody.ldeId;
						getApp().globalData.pransportCodeArr.push(res.rspBody);
						if (that.transportIdArr.indexOf(res.rspBody.ldeId) == -1) {
							that.transportIdArr.push(res.rspBody.ldeId);
							that.surfaceNumberArr.push(res.rspBody.surfaceNumber);
						}
						that.playMusic();
						that.allArr.push(res.rspBody);
						var numCount = that.codeArr.length.toString();
						wxScanModule.getMessage({
							num: numCount
						}, (data) => {
							console.log('设置成功数', numCount)
						})
					} else {
						wxScanModule.setFailText({
							text: res.retDesc,
						}, (data) => {
							
						})
						that.playFaliMusic();
					}
				})
				.catch(err=>{
					
				})
			},
			//扫码
			goScan() {
				getApp().globalData.pransportCodeArr = [];
				this.surfaceNumberArr = [];
				this.transportIdArr = [];
				this.codeArr = [];
				this.allArr = [];
				var platform = uni.getSystemInfoSync().platform;
				if(platform == 'ios'){
					uni.navigateTo({
						url: '/pages/goodsDelivery/transport/scanCode'
					});
				} else {
					uni.showModal({
						title: '提示',
						content: '扫码需获取您的相机权限，用于通过货源码来查询货源信息',
						success: function(res) {
							if (res.confirm) {
								wxScanModule.scanActivity({}, (data) => {
									console.log('扫描结果', data)
								})
							}
						}
					})
					
					// uni.navigateTo({
					// 	url: '/pages/goodsDelivery/transport/scanCode'
					// });
				}
			},
			getFindFirstLde(){
				let that = this;
				service.postRequest("/ld/ldeccred/findLde", {
					sid: that.ldeId
				}).then(res => {
					console.log(res)
					if(res.retCode == "0000000"){
						var goodsArr = [];
						var labelNum = 0;
						res.rspBody.items[0].cargo.map(val=>{
							var goodText = val.gdName;
							if(val.gdWeight){
								goodText = goodText + ' ' + val.gdWeight + '吨';
							}
							if(val.gdVolume){
								goodText = goodText + ' ' + val.gdVolume + '方';
							}
							if(val.gdNumber){
								goodText = goodText + ' ' + val.gdNumber + '件';
							}
							if(val.printNumber){
								goodText = goodText + ' ' + val.printNumber + '张';
							}
							goodsArr.push(goodText);
							labelNum = labelNum + val.printNumber;
						});
						var map = {
							sid: res.rspBody.items[0].sid,
							surfaceNumber: res.rspBody.items[0].surfaceNumber,
							status2Text: res.rspBody.items[0].status2Text,
							originalNumber: res.rspBody.items[0].originalNumber,
							createdDt: res.rspBody.items[0].createdDt,
							updatedDt: res.rspBody.items[0].updatedDt,
							labelNum: labelNum,
							goodsArr: goodsArr,
							ldeId: res.rspBody.items[0].sid,
							batchNumber: res.rspBody.items[0].batchNumber,
							costA: res.rspBody.items[0].costA?res.rspBody.items[0].costA:'',
							costB: res.rspBody.items[0].costB?res.rspBody.items[0].costB:'',
							costC: res.rspBody.items[0].costC?res.rspBody.items[0].costC:'',
							costList: res.rspBody.items[0].costList?res.rspBody.items[0].costList:[],
							shipmentsAddress: {
								userName: res.rspBody.items[0].shipmentsAddress ? res.rspBody.items[0].shipmentsAddress.userName : '',
								mobile: res.rspBody.items[0].shipmentsAddress ? res.rspBody.items[0].shipmentsAddress.mobile : '',
								city: res.rspBody.items[0].shipmentsAddress ? res.rspBody.items[0].shipmentsAddress.city : '',
								addressText: res.rspBody.items[0].shipmentsAddress ? (res.rspBody.items[0].shipmentsAddress.province + '-' + res.rspBody.items[0].shipmentsAddress.city + '-' + res.rspBody.items[0].shipmentsAddress.area + ' ' + res.rspBody.items[0].shipmentsAddress.address) : '',
							},
							arriveAddress: {
								userName: res.rspBody.items[0].arriveAddress ? res.rspBody.items[0].arriveAddress.userName : '',
								mobile: res.rspBody.items[0].arriveAddress ? res.rspBody.items[0].arriveAddress.mobile : '',
								city: res.rspBody.items[0].arriveAddress ? res.rspBody.items[0].arriveAddress.city : '',
								addressText: res.rspBody.items[0].arriveAddress ? (res.rspBody.items[0].arriveAddress.province + '-' + res.rspBody.items[0].arriveAddress.city + '-' + res.rspBody.items[0].arriveAddress.area + ' ' + res.rspBody.items[0].arriveAddress.address) : '',
							},
						};
						getApp().globalData.isScanAli = 1;
						uni.navigateTo({
							url: '/pages/goodsDelivery/transport/transportMap?map=' + JSON.stringify(map)
						})
					}else{
					  
					}
				})
			},
			refreshCarSourceRef() {
				this.$refs.carSourceRef.refresh();
			},
			switchCarSourceIndex(index) {
				console.log(index,'顶部切换')
				var carSourceIndex = this.carSourceIndex;
				if (carSourceIndex == index) return;
				this.carSourceIndex = index;
				if (index == 0) {
					this.$refs.carSourceRef.refresh();
					// this.$refs.businessCardRef.refresh();
				} else {
					var tabIndex = this.tabIndex || 0;
					this.switchTab(tabIndex);
				}
			},
			getTabContent_carStyle() {
				var windowHeight = uni.getSystemInfoSync().windowHeight;
				var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
				var height = (windowHeight - statusBarHeight)* 2 - 158;
				var mrt = statusBarHeight*2 + 158;
				return "height:" + height + 'rpx;' + "margin-top:" + mrt + 'rpx'
				// return "margin-top:" + mrt + 'rpx'

			},
			getConnectionStatus() {
				let userData = uni.getStorageSync("userInfo");
				var userInfo = userData ? JSON.parse(userData) : {};
				console.log(this.goEasy.getConnectionStatus() == 'disconnected' ? 'GoEasy未连接' : 'GoEasy连接');
				if(this.goEasy.getConnectionStatus() === 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
				}
			},
			move(event) {
				console.log(event,'eventevent')
			      let vm = this;
				// console.log(event)
			      // if (vm.flags) {
			        var touch;
			        if (event.touches) {
			          touch = event.touches[0];
			        } else {
			          touch = event;
			        }
					console.log(event.touches)
			        // 定位滑块的位置
			        // vm.position.x = touch.screenX -25; 
			        // vm.position.y = touch.screenY -25;
					vm.position.x = touch.clientX -25;
					vm.position.y = touch.clientY -25;
									 // 限制滑块超出页面
			        // console.log('屏幕大小', screenWidth, screenHeight )
									 
					 console.log(vm.position.x,'vm.position.x')
					 console.log(screenWidth - touch.clientX,'screenWidth - touch.clientX')
			        if (vm.position.x < 0) {
			          vm.position.x = 0;
			        } else if (vm.position.x > screenWidth - touch.clientX) {
			          vm.position.x = screenWidth - touch.clientX ;
			        }
					console.log(vm.position.x,'vm.position.x结束')
			    },
			move2(event) {
					console.log(event,'eventevent')
				      let vm = this;
				        var touch;
				        if (event.touches) {
				          touch = event.touches[0];
				        } else {
				          touch = event;
				        }
						console.log(event.touches)
				        // 定位滑块的位置
						vm.position.x2 = touch.clientX -25;
						vm.position.y2 = touch.clientY -25;
						 console.log(vm.position.x2,'vm.position.x2')
						 console.log(screenWidth2 - touch.clientX,'screenWidth2 - touch.clientX')
				        if (vm.position.x2 < 0) {
				          vm.position.x2 = 0;
				        } else if (vm.position.x2 > screenWidth2 - touch.clientX) {
						  console.log(screenWidth2 - touch.clientX,'vm.position.x2')
				          vm.position.x2 = screenWidth2 - touch.clientX ;
				        }
						console.log(vm.position.x2,'vm.position.x结束')
			},
			move3(event) {
					console.log(event,'eventevent')
				      let vm = this;
				        var touch;
				        if (event.touches) {
				          touch = event.touches[0];
				        } else {
				          touch = event;
				        }
						console.log(event.touches)
				        // 定位滑块的位置
						vm.position.x3 = touch.clientX -25;
						vm.position.y3 = touch.clientY -25;
						 console.log(vm.position.x3,'vm.position.x2')
						 console.log(screenWidth3 - touch.clientX,'screenWidth2 - touch.clientX')
				        if (vm.position.x3 < 0) {
				          vm.position.x3 = 0;
				        } else if (vm.position.x3 > screenWidth3 - touch.clientX) {
						  console.log(screenWidth3 - touch.clientX,'vm.position.x2')
				          vm.position.x3 = screenWidth3 - touch.clientX ;
				        }
						console.log(vm.position.x3,'vm.position.x结束')
			},
			async switchOnLine() {
				var that = this;
				uni.showLoading();
				try{
					var res = await service.postRequest("/yh/user/verify/change/user/task/status", {
						taskStatus: that.taskStatus == 2 ? 1 : 2
					})
					uni.hideLoading();
					console.log(res, '更高')
					if (res.retCode == "0000000") {
						var userInfo = uni.getStorageSync("userInfo");
						if (userInfo) {
							var user = JSON.parse(userInfo);
							user.attrs.taskStatus = that.taskStatus == 2 ? 1 : 2;
							uni.setStorageSync("userInfo",JSON.stringify(user));
						}
						that.taskStatus = that.taskStatus == 2 ? 1 : 2;
						that.$forceUpdate();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			toWaybill() {
				//跳转运单
				uni.navigateTo({
					url: "/pages/ship/waybill/waybill"
				})
			},
			showRemark(item) {
				//备注
				var orderLoadFactorVOS = item.loadFactors;
				var remark = item.remark;
				var receiptTypeText = item.receiptType == 1 ? '需要回单' : '不需要回单';
				var hasRemark = [];
				if (orderLoadFactorVOS) {
					hasRemark.push(orderLoadFactorVOS)
				}
				if (remark) {
					hasRemark.push(remark)
				}
				hasRemark.push(receiptTypeText)
				return hasRemark.join(',')
				
			},
			requestPower() {
				var text = "为了您能通过拍照或相册扫码来访问车队或货源信息，我们将申请您的存储和相机权限"
				publicData.requestPower(text, this.scanCodeEvent)
			},
			scanCodeEvent(){
				var that = this;
				uni.scanCode({
					onlyFromCamera: false,
					success: function(res) {
						console.log(res)
						var data = decodeURIComponent(res.result);
						//判断是否扫的是货源二维码
						var searchObj = data.split("?")[1];
						var searchType = searchObj ?  searchObj.split('=')[0] : '';
						if (searchType == "orderNumber") {
							//确认扫描的是货源码，跳转货源详情
							var orderNumber = searchObj.split('=')[1];
							console.log(orderNumber, "orderNumber");
							service.newQueryPostRequest("/td/order/findListRecord", {
								orderNumber: orderNumber
							}).then(res => {
								console.log("res", res);
								if (res.retCode == "0000000") {
									var details = res.rspBody;
									var sid = details.sid;
									if (details.orderState == 1) {
										var userRole = uni.getStorageSync("userRole");
										if (userRole == 1) {
											uni.navigateTo({
											  url: '/pages/ship/supplyDetails/supplyDetails?sid=' + sid
											});
										} else {
											uni.navigateTo({
											  url: '/pages/goodsDelivery/orderDetails/orderDetails?sid=' + sid
											});
										}
									} else {
										uni.showToast({
											title: '该货源已关闭',
											icon: 'none'
										})
										var userRole = uni.getStorageSync("userRole");
										if (userRole == 1) {
											uni.switchTab({
											  url: '/pages/ship/index/index1'
											});
										} else {
											uni.switchTab({
											  url: '/pages/goodsDelivery/index/index'
											});
										}
									}
								} else {
									uni.showToast({
										title: res.retDesc,
										icon: 'none'
									})
								}
							})
							
							
						} else {
							//扫描的是其他码
							var resultObj = eval('('+data+')');
							console.log(resultObj, '扫码111111');
							
							if(resultObj.fleetId){
								uni.$emit("scanForResult", {
									fleetId: resultObj.fleetId,
									isScan: 1
								});
							}
						}
						
						
					},
					fail: function(err) {
						console.log(err)
					}
				});
			},
			
			//招募令
			// recruitmentEvent(){
			// 	console.log('navigateBack')
			// 	uni.navigateTo({
			// 		url: './recruitment'
			// 	})
			// },
			// goRedPacket(){
			// 	if(uni.getStorageSync('userRole')==1){
			// 		uni.navigateTo({
			// 			url:"/pages/redPacket/index/index?pageName=ship"
			// 		})
			// 	}
				
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.hide_icon{
		right: -80rpx !important;
		opacity: 0.6 !important;
	}
	.luck_draw{
		position: fixed;
		// right: 0;
		// bottom: 300rpx;
		
		z-index: 999 !important;
		opacity: 1;
		transition-property: opacity , right; 
		transition-duration:0.6s , 0.6s;
		image{
		  width: 160rpx;
		  height: 160rpx;
		}
		.close_act{
			   width: 30rpx;
			   height: 30rpx;
			   position: absolute;
			   z-index: 10;
			   right: 20rpx;
			   top: -20rpx;
		}
	}
	.redPacket{
		position: fixed;
			// right: 0;
			// bottom: 60rpx;
		z-index: 999;
		opacity: 1;
		transition-property: opacity , right; 
		transition-duration:0.6s , 0.6s;
		image{
			width: 160rpx;
			height: 160rpx;
		} 
		.close_act{
		   width: 30rpx;
		   height: 30rpx;
		   position: absolute;
		   z-index: 10;
		   right: 20rpx;
		   top: -20rpx;
		}
	}
	.annua-bill {
		position: fixed;
		right: 0;
		bottom: 300rpx;
		z-index: 99;
		opacity: 1;
		image{
		   width: 160rpx;
		  height: 160rpx;
		} 
	}
	.China_Travel{
		position: fixed;
			// right: 0;
			// bottom: 60rpx;
		z-index: 999;
		opacity: 1;
		transition-property: opacity , right; 
		transition-duration:0.6s , 0.6s;
		image{
			width: 160rpx;
			height: 160rpx;
		} 
		.close_act{
		   width: 30rpx;
		   height: 30rpx;
		   position: absolute;
		   z-index: 10;
		   right: 20rpx;
		   top: -20rpx;
		}
	}
	.mr-16 {
		margin-right: 16rpx;
	}
	.mb-20 {
		margin-bottom: 20rpx;
	}
	.pb-8 {
		padding-bottom: 8rpx;
	}
	.tabs-row {
		display: flex;
		flex-direction: row;
		margin: 0 36rpx;
		.waybill {
			margin-left: 16rpx;
			width: 152rpx;
			height: 80rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-weight: 500;
			color: #2C73F0;
			border: 2rpx solid #2973FA;
			border-radius: 16rpx;
			box-sizing: border-box;
			position: relative;
			.waybill-icon {
				width: 36rpx;
				height: 36rpx;
				margin-right: 6rpx;
			}
			.dotted {
				position: absolute;
				top: 12rpx;
				right: 6rpx;
				z-index: 1;
				width: 16rpx;
				height: 16rpx;
				border-radius: 100%;
				background-color: rgba(234, 45, 45, 1);
			}
		}
	}
	.tabs {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 78rpx;
		background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/ship_index_tabbar_bg.png");
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;
		flex: 1;
		box-shadow: 0 0 8rpx 0 #ACCBFF;
		border-radius: 24rpx;
		&.active {
			background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/ship_index_tabbar_bg_active.png");
		}
		.tabItem {
			flex: 1;
			height: 78rpx;
			color: rgba(102, 102, 102, 1);
			font-size: 32rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 400;
			color: #333;
			&.active {
				color: #FFFFFF;
				font-size: 36rpx;
				font-weight: 600;
			}
		}
	}
	.recruitment_box {
		padding: 0 36rpx;
		height: 150rpx;
		.img {
			width: 678rpx;
			height: 150rpx;
		}
	}
	
	.tabContent_car {
		background-color: #F1F4F9;
	}
	.searchInfo {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 0 36rpx;
		&+.searchInfo {
			margin-top: 24rpx;
		}
		.arrow_down_white {
			width: 20rpx;
			height: 12rpx;
		}
		.chooseCar {
			width: 296rpx;
			min-height: 80rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			border: 2rpx solid #2C74F1;
			padding-left: 24rpx;
			padding-right: 24rpx;
			color: #2C74F1;
			font-size: 28rpx;
			font-weight: 500;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			
			&.fleet {
				width: 220rpx;
				flex-wrap: nowrap;
				.inner {
					flex: 1;
					overflow: hidden;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					white-space: nowrap;
					margin-right: 20rpx;
				}
			}
			&.default {
				color: #666;
			}
		}
		.choose-btn {
			width: 296rpx;
			height: 80rpx;
			background: #2973FA;
			border-radius: 16rpx;
			font-weight: 600;
			font-size: 32rpx;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2rpx solid #2C74F1;
			&.fleet {
				width: 167rpx;
			}
		}
		.search-input {
			flex: 1;
			margin: 0 12rpx;
			height: 80rpx;
			border: 2rpx solid #2C74F1;
			padding: 18rpx 20rpx;
			border-radius: 16rpx;
			font-size: 24rpx;
			box-sizing: border-box;
		}
		.default {
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
		}
		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 296rpx;
			padding-left: 24rpx;
			padding-right: 24rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			border: 2rpx solid #2C74F1;
			height: 80rpx;
			color: #2C73F0;
			font-weight: 500;
			font-size: 28rpx;
			flex-wrap: nowrap;
			text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.middle {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.tabContent {
		box-sizing: border-box;
		background-color: #FFFFFF;
	}
	.tabContentItem {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		.tips {
			padding: 0 32rpx;
			background-color: rgba(242, 147, 71, 0.3);
			border-radius: 12rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			font-size: 24rpx;
			height: 70rpx;
			margin:0 36rpx 26rpx;
			box-sizing: border-box;
			.tipsText {
				color: rgba(242, 147, 71, 1);
			}
			.btnContent {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				align-items: center;
				.btnCheck {
					width: 112rpx;
					height: 50rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #FFFFFF;
					background-color: rgba(255, 119, 0, 1);
					border-radius: 12rpx;
					margin-right: 24rpx;
				}
				.close {
					width: 26rpx;
					height: 26rpx;
				}
			}
		}
	}
	.deliverView {
		margin: 0 16rpx;
		background-color: #FFFFFF;
		box-shadow: 0px 6px 10px -6px rgba(0, 0, 0, 0.15);
		border-radius: 10rpx;
		padding: 0 24rpx 34rpx 24rpx;
		box-sizing: border-box;
		.title {
			font-size: 28rpx;
			color: rgba(51, 51, 51, 1);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			height: 70rpx;
			box-sizing: border-box;
			.editIcon {
				width: 30rpx;
				height: 30rpx;
			}
		}
		.line {
			width: calc(100vw - 80rpx);
			height: 2rpx;
			background-image: linear-gradient(to right, rgba(202, 212, 218, 1), rgba(196, 210, 218, 0));
			margin-bottom: 24rpx;
		}
		
		.addContent {
			border: 1px solid #979797;
			border-radius: 12rpx;
			height: 84rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			color: #333333;
		}
	}
	.shipIndex {
		&.noScoller {
			overflow: hidden;
			height: 100vh;
		}
	}
	.index {
		background-color: #F1F4F9;
		overflow: visible;
		&.noScoller {
			overflow: hidden;
			height: 100vh;
		}
		.tabWhole {
			background-color: #FFFFFF;
			background-size: cover;
			width: 100vw;
			position: fixed;
			z-index: 99;
			left: 0;
			top: 0;
			
		}	
		.taskBox {
			width: 132rpx;
			height: 47rpx;
			border-radius: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 40rpx;
			.taskLine {
				width: 36rpx;
				height: 36rpx;
				background: #FFFFFF;
				border-radius: 36rpx;
			}
			.taskMsg {
				font-size: 22rpx;
				color: #FFFFFF;
			}
		}
		
		.indexHead {
			padding: 0 36rpx;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.positioning {
				display: flex;
				justify-content: center;
				align-items: center;
				.positioningIcon {
					width: 35rpx;
					height: 40rpx;
					margin-right:8rpx;
				}
				.msg {
					font-size:24rpx;
					color: #333333;
					font-weight: 500;
					font-family: PingFang SC-Medium, PingFang SC;
				}
			}
			.hintBox1 {
				font-size: 30rpx;
				color: #FFFFFF;
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				.hintBoxIcon {
					width: 45rpx;
				}
				.dotted {
					width: 16rpx;
					height: 16rpx;
					border-radius: 100%;
					background-color: red;
					position: absolute;
					right: -16rpx;
					top: -10rpx;
				}
			}
			.side {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				align-items: center;
				.scan-box {
					width: 38rpx;
					margin-right: 36rpx;

				}
			}
		} 
		.orderList {
			overflow: hidden;
			position: relative;
			box-sizing: border-box;
			padding: 24rpx 36rpx;
			border-bottom: 1rpx solid #979797;
			.orderAddress {
				width: calc(100vw - 72rpx);
				display: inline-block;
				vertical-align: middle;
				line-height: 44rpx;
				font-size: 36rpx;
				color: #333333;
				font-weight: 600;
				.notOngoing {
					color: #FC5C06;
					font-size: 24rpx;
					font-weight: 400;
					margin: 0 8rpx;
					display: inline-block;
					vertical-align: middle;
					.notOngoing-content {
						display: flex;
						flex-direction: column;
						align-items: center;
					}
				}
				.addressStatus_1 {
					width: 70rpx;
					height: 16rpx;
					margin-bottom: 4rpx;
				}
			}
			
			.orderContent {
				display: flex;
				flex-direction: row;
				.goodsItem_second_content {
					flex: 1;
					margin-top: 24rpx;
					color: #666666;
					font-size: 28rpx;
					flex-wrap: wrap;
					line-height: 38rpx;
					.goodsType {					
						&.type_1 {
							padding-left: 24rpx;
						}
						&.type_2 {
							padding-left: 34rpx;
						}
						&.unit {
							padding-left: 10rpx;
						}
					}
				}
				.fixedPrice {
					margin-top: 24rpx;
					font-size: 32rpx;
					color: #FC5C06;
					font-weight: 600;
					margin-left: 20rpx;
				}
			}
			.remark {
				margin-top: 24rpx;
				margin-bottom: 24rpx;
				font-weight: 500;
				color: #333333;
				font-size: 28rpx;
				width: calc(100vw - 230rpx);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.fleet-remark-content {
				display: flex;
				flex-direction: row;
				margin-top: 24rpx;
				align-items: center;
				font-size: 28rpx;
				.fixedPrice {
					font-size: 32rpx;
					color: #FC5C06;
					font-weight: 600;
					margin-left: 20rpx;
				}
				.fleetName {
					flex: 1;
					color: #666;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.fleet-remark {
				width: calc(100vw - 230rpx);
				color: #333333;
				font-weight: 500;
				margin-top: 24rpx;
				margin-bottom: 24rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				line-height: 38rpx;
				font-size: 28rpx;
				
			}
		
			.price-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				position: relative;
				.date {
					color: #666666;
					font-size: 24rpx;
				}
				.goPrice {
					position: absolute;
					right: 0;
					bottom: 0;
					width: 132rpx;
					height: 60rpx;
					background-color: #EE6502;
					border-radius: 12rpx;
					text-align: center;
					line-height: 60rpx;
					color: #fff;
					font-size: 28rpx;
					
				}
			}
			
		}
	}
	
	/*** 平台货源 **/
	.colarIcon {
		display: flex;
		flex-direction: column;
		.triangle {
		    width: 0px;
		    height: 0px;
		    border-width: 12rpx 7rpx;
		    border-color: transparent transparent rgba(96, 104, 114, 0.26);
		    border-style: solid;
		    display: inline-block;
			&.active {
				 border-color: transparent transparent rgba(96, 104, 114, 1);
			}
		}
		.rev-triangle {
			margin-top: 4rpx;
		    width: 0px;
		    height: 0px;
		    border-width: 12rpx 7rpx;
			border-color: rgba(96, 104, 114, 0.26) transparent transparent;
		    border-style: solid;
		    display: inline-block;
			&.active {
				 border-color: rgba(96, 104, 114, 1) transparent transparent;
			}
		}
	}
	
	.pr-16 {
		padding-right: 16rpx;
	}
	.pr-10 {
		padding-right: 10rpx;
	}
	.pr-24 {
		padding-right: 24rpx;
	}
	.pr-8 {
		padding-right: 8rpx;
	}
	.pr-6 {
		padding-right: 6rpx;
	}
	.pr-20 {
		padding-right: 20rpx;
	}
	.pemissionPop {
		background: #FFFFFF;
		border-radius: 24rpx;
		margin: 0 94rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		padding-top: 80rpx;
		box-sizing: border-box;
		height: 440rpx;
		.lingdang_notice {
			position: absolute;
			top: -80rpx;
			height: 135rpx;
			width: 139rpx;
			left: calc(50vw - 164rpx);
		}
		.alertContentNotice {
			flex: 1;
			padding: 0 36rpx;
			color: rgba(112, 112, 113, 1);
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			box-sizing: border-box;
			.title {
				display: flex;
				color: rgba(51, 51, 51, 1);
				font-size: 36rpx;
				font-weight: 500;
			}
			.text-content {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				.text {
					text-align: center;
					letter-spacing: 3rpx;
					line-height: 38rpx;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					font-size: 32rpx;
				}
			}
			.blue {
				color: rgba(74, 162, 243, 1);
			}
		}
		.confirmBtn {
			height: 90rpx;
			width: calc(100vw - 188rpx);
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 1px solid rgba(241, 241, 241, 1);
			font-size: 32rpx;
			font-weight: 500;
			color: rgba(78, 173, 241, 1);
		}
	}
	.shipAlertContext {
		width: calc(100vw - 196rpx);
		min-height: 336rpx;
		border-radius: 24rpx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;
		padding-top: 32rpx;
		.confirmBtn {
			height: 88rpx;
			width: calc(100vw - 196rpx);
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 1px solid rgba(241, 241, 241, 1);
			font-size: 32rpx;
			font-weight: 500;
			color: rgba(78, 173, 241, 1);
		}
		.text {
			line-height: 50rpx;
			color: rgba(51, 51, 51, 1);
			font-size: 36rpx;
		}
		.subText {
			font-size: 28rpx;
			color: rgba(51, 51, 51, 1);
			margin: 8rpx 0 16rpx;
		}
		.content {
			box-sizing: border-box;
			width: calc(100vw - 196rpx);
			flex: 1;
			line-height: 30rpx;
			font-size: 24rpx;
			color: rgba(102, 102, 102, 1);
			padding: 0 24rpx;
			text-align: left;
		}
	}
	.hintBox {
		background: #FFFFFF;
		border-radius: 12rpx;
		margin: 0 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		.title {
			font-size: 30rpx;
			color: #777777;
			text-align: center;
			padding: 32rpx 0;
			font-weight: bold;
		}
		.alertContent1 {
			padding: 0 62rpx;
			font-size: 28rpx;
			color: rgba(112, 112, 113, 1);
			flex: 1;
			.text {
				display: flex;
				height: 84rpx;
				flex-wrap: wrap;
			}
			.blue {
				color: rgba(74, 162, 243, 1);
			}
		}
		.confirmBtnGroup {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 46rpx;
			.cancelBtn {
				width: calc(100vw - 120rpx);
				background-color: rgba(74, 162, 243, 1);
				flex: 1;
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 12rpx;
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
	.quoteItem {
		min-height: 700rpx;
	}
	.noData01 {
		flex: 1;
		height: 610rpx;
		width: 692rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #666666;
		.noData {
			width: 692rpx;
		}
	}
	.advertise {
		height: 148rpx;
		width: 100%;
		margin-top:12rpx;
		position: relative;
		.btn {
			width: 124rpx;
			height: 34rpx;
			background-color: rgba(255, 176, 0, 1);
			color: 16rpx;
			color: #FFFFFF;
			font-size: 18rpx;
			border-radius: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			left: 70rpx;
			bottom: 30rpx;
		}
		.advertise01 {
			position: absolute;
			left: -16rpx;
			top: 0;
			height: 148rpx;
			width: 100vw;
		}
	}
	.stepWhole {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 100rpx;
		margin-bottom: 40rpx;
		.stepItem {
			position: relative;
			.text {
				position: absolute;
				top: 50rpx;
				left: -30rpx;
				color: rgba(119, 119, 119, 1);
				font-size: 22rpx;
				width: 100rpx;
			}
			.step01 {
				width: 32rpx;
				height: 32rpx;
			}
			.step02 {
				width: 30rpx;
				height: 30rpx;
			}
			.step03 {
				width: 32rpx;
				height: 30rpx;
			}
			.step04 {
				width: 30rpx;
				height: 28rpx;
			}
			.step05 {
				width: 26rpx;
				height: 30rpx;
			}
		}
		.line {
			 width: 92rpx;
			 margin: 0 12rpx;
			 display: flex;
			 justify-content: space-around;
			 align-items: center;
			 .dotted {
				 width: 20rpx;
				 height: 1px;
				 background-color: rgba(119, 119, 119, 1);
			 }
		}
	}
	.orderCode {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.orderNumber {
			padding: 0 44rpx 0 16rpx;
			height: 66rpx;
			background-image: url(../../../static/images/goodsDelivery/orderNumberBc.png);
			background-repeat: no-repeat;
			background-size: cover;
			font-size: 26rpx;
			color:#333;
			display: flex;
			justify-content: center;
			align-items: center;
			.orderNumberIcon {
				width:22rpx;
				height: 22rpx;
				margin-left:16rpx;
			}
		}
		.time {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			color: #333333;
			padding-right: 30rpx;
			.clock {
				width: 26rpx;
				height: 26rpx;
				margin-right: 10rpx;
			}
		}
		.orderStatusBox {
			height: 66rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 26rpx;
			color:#F29347;
			.forzenIcon {
				width:32rpx;
				height: 36rpx;
				margin-left:30rpx;
			}
			.orangeRightIcon {
				width: 12rpx;
				height: 22rpx;
				margin-left:12rpx;
			}
		}
		.isFrozen {
			padding-right:16rpx;
			background: linear-gradient(to top right, #FFF, #FFF, #FFF, #FFF, rgba(96, 203, 250, 0.54));
		}
		.notFrozen {
			padding-right:32rpx;
		}
	}
	.swiperHint {
		background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/indexHintSwiperBc%202.png');
		background-repeat: no-repeat;
		background-size: cover;
		height: 106rpx;
		margin-left: 16rpx;
		width: calc(100vw - 32rpx);
		box-sizing: border-box;
		padding-right: 160rpx;
		display: flex;
		align-items: center;
		.uni-noticebar__content--scrollable {
			height: 100%;
		}
		.hintScrollBox {
			overflow-x: auto;
			overflow-y: hidden;
		}
		.hint {
			line-height: 106rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			white-space:nowrap;
		}
	}
	.tipsAlert {
		display: flex;
		flex-direction: column;
		padding: 20rpx 0;
		color: #666666;
		.subTitle {
			font-size: 28rpx;
		}
		.tipItem {
			font-size: 26rpx;
			padding-top: 16rpx;
		}
	}
	.advs {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		margin-left: 36rpx;
		width: calc(100vw - 72rpx);
		box-sizing: border-box;
		border-radius: 24rpx;
		overflow: hidden;
		position: relative;
		margin-bottom: 28rpx;
		.mainBanner {
			width: 100%;
			height: 150rpx;
		}
		.advertiesGif {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			height: 100rpx;
			width: 100rpx;
		}
	}
	.orderListHead-time-text {
		color: #777777;
		font-size: 26rpx;
	}
	
	.priceMy {
		padding: 24rpx 0 24rpx 34rpx;
		height: 48rpx;
	}
	.quoteItem-orderStatusBox {
		position: absolute;
		bottom: 32rpx;
		right: 42rpx;
		color: #FFFFFF;
		font-weight: 500;
		font-size: 32rpx;
	}
	.adverties {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(34, 34, 34, .65);
		z-index: 9999;
		.adves-box {
			width: 640rpx;
			height: 566rpx;
			position: relative;
			.advertise-image {
				width: 640rpx;
				height: 566rpx;
			}
			.advers-close {
				width: 74rpx;
				height: 76rpx;
				position: absolute;
				top: -100rpx;
				right: 100rpx;
			}
		}
	}
	.step-image {
		width: 100vw;
		height: 100vh;
	}
	.firstContainer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
	}
	.notLoagin {
		.btn-box {
			position: absolute;
			bottom: 100rpx;
			right: 50rpx;
		  width: 200rpx;
		  background-color: #3375f6;
		  color: #fff;
		  display: flex;
		  flex-direction: row;
		  justify-content: space-around;

		  border-radius: 30rpx;
		  font-size: 30rpx;
		  height: 70rpx;
		  line-height: 70rpx;
		  padding: 10rpx;
		  box-sizing: border-box;
		  .btn-i {
			  flex: 1;
			  display: flex;
			  align-items: center;
			  justify-content: center;
			  &:first-child {
				  border-right: 1px solid #FFFFFF;
			  }
		  }
		}
		.swiper {
		  width: 750rpx;
		  height: 100vh;
		}
		.swiper-child {
		  position: relative;
		}
		.swiper-text {
		  position: absolute;
		  bottom: 0;
		  height: 20%;
		  left: 0;
		  right: 0;
		  display: flex;
		  flex-direction: column;
		  /* justify-content: center; */
		  align-items: center;
		}
		.swiper-title {
		  color: #333;
		  font-weight: bold;
		  font-size: 50rpx;
		}
		.swiper-content {
		  color: #777;
		  font-size: 40rpx;
		  margin-top: 60rpx;
		}
		/deep/ .uni-swiper-dots {
		  bottom: 50px !important;
		}
	}
	.newCar-pop {
		height: 80vh;
		display: flex;
		flex-direction: column;
		width: 100vw;
		background-color: #FFFFFF;
		border-radius: 24rpx 24rpx 0 0;
		.randBox {
			flex: 1;
		}
		.addAlertCar {
			margin: 92rpx 0 126rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.addAlertCar-btn {
				width: 400rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #2B72F0;
				border-radius: 16rpx;
				color: #FFFFFF;
				font-weight: 500;
				font-size: 32rpx;
			}
		}
		.pop-newCar-title {
			font-size: 40rpx;
			color: #333333;
			font-weight: 600;
			margin: 68rpx 0 14rpx;
			width: 100vw;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.pop-newCar-subTitle {
			width: 100vw;
			padding: 20rpx 36rpx 0;
			box-sizing: border-box;
			.main {
				font-size: 36rpx;
				color: #333333;
				font-weight: 500;
			}
			.sub {
				color: #666666;
				font-size: 24rpx;
				font-weight: 400;
			}
		}
		.carLen-content {
			height: 21vh;
			width: 100vw;
			padding: 0 10rpx;
			box-sizing: border-box;
			flex-wrap: wrap;
			margin-top: 30rpx;
			.carLen-item {
				width: 25%;
				height: 72rpx;
				padding: 0 26rpx;
				margin-bottom: 30rpx;
				display: inline-block;
				box-sizing: border-box;
				.carLen-item-inner {
					width: 100%;
					height: 72rpx;
					border-radius: 8rpx;
					box-shadow: 0 0 16rpx 2rpx rgba(172, 203, 255, 0.22);
					color: #333333;
					font-size: 28rpx;
					font-weight: 400;
					display: flex;
					justify-content: center;
					align-items: center;
					&.active {
						background-color: #4396F8;
						color: #FFFFFF;
					}
				}
				
			}
		}
		
	}
	.recond-content {
		.recond-title {
			display: flex;
			justify-content: flex-start;
			flex-direction: column;
			align-items: center;
			padding-top: 24rpx;
			box-sizing: border-box;
			height: 122rpx;
		}
		.main {
			font-size: 32rpx;
			font-weight: 500;
			color: #000000;
		}
		.sub {
			margin-top: 16rpx;
			font-size: 26rpx;
			color: #333333;
		}
	}
</style>
