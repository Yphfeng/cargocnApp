<template>
	<view class="newFleetDetails">
		<view class="fleet-img-box">
			<view class="fleet-img-head">
				<image @click="toBack" class="fleet-back" src="/static/images/arrow_left_white.png" mode="widthFix"></image>
			</view>
			<view class="fleet-num-box" v-if="fleetInfo.isMember" @click="goMemberList(1)">
				<image class="fleet-num-img" src="/static/images/newFleetDetails/member.png" mode=""></image>
				<view class="fleet-num-msg">新访客次数{{fleetInfo.viewCountToday?fleetInfo.viewCountToday:0}}</view>
			</view>
			<image class="fleet-img" :src="fleetInfo.bgImg?fleetInfo.bgImg:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/fleetimg.png'" @click="upFile"></image>
		</view>
		
		<view class="fleet-info-all">
			<view class="fleet-info-box">
				<view class="info-head">
					<view class="info-img-box">
						<image class="info-img" :src="fleetInfo.badgeImage?fleetInfo.badgeImage:'/static/images/goodsDelivery/fleet-head.png'" mode="" @click="showLargeImage(fleetInfo.badgeImage)"></image>
					</view>
					<view class="fans-box">
						<view class="otherBtnGroup">
							<view class="fansOnFocus" v-if="userRole==2 && !fleetInfo.isMember && !fleetInfo.isCooperate" @click="focusTap">关注</view>
							<view class="fansHasFocus" v-if="userRole==2 && !fleetInfo.isMember && fleetInfo.isCooperate" @click="cancelFocusTap">已关注</view>
							<view class="fansOnFocus" v-if="userRole==1 && !fleetInfo.isMember && fleetInfo.verificationMethod" @click="joinFleet">加入</view>
							<view class="fansCall" v-if="!fleetInfo.isMember" @click="goMemberList(3)">联系</view>
						</view>
						<view class="fansMsg" @click="goMemberList(2)">
							<view class="fansTitle">关注货主</view>
							<view class="fans-box-num">{{fleetInfo.followCount?fleetInfo.followCount:0}}</view>
						</view>
					</view>
				</view>
				<view class="info-head-box">
					<view class="fleet-box">
						<view class="info-name">{{fleetInfo.name}}</view>
						<view class="info-content">
							<view class="info-content-child">
								<view class="info-num">车队号：{{fleetInfo.code}}</view>
								<view class="">{{fleetInfo.model}}{{fleetInfo.cartLength?'/' + fleetInfo.cartLength:''}}</view>
							</view>
						</view>
					</view>
					<view class="qrBox">
						<view @click="showWeChatQr" v-if="fleetInfo.qrcode">
							<image class="info-content-qrCode2" src="/static/images/newFleetDetails/wechatQr.png" mode=""></image>
							<view style="color:#333;font-size: 20rpx;text-align: center;margin-top: 6rpx;line-height: 28rpx;">加入微信</view>
						</view>
					</view>
				</view>
				<view class="content-box">
					<view class="content-child">
						<view class="contentTitle">车队简介：</view>
						<view class="contentMsg" :class="isMore ? '' : 'hiddenMsg'">{{fleetInfo.introduction?fleetInfo.introduction:'暂无简介'}}</view>
					</view>
					<view class="content-child" v-if="fleetInfo.slogan && isMore">
						<text class="contentTitle">车队口号：</text>
						<text class="contentMsg">{{fleetInfo.slogan}}</text>
					</view>
					<view class="content-child" v-if="fleetInfo.advantageArea && isMore">
						<text class="contentTitle">优势区域：</text>
						<text class="contentMsg">{{fleetInfo.advantageArea}}</text>
					</view>
					<view class="content-child" v-if="fleetInfo.route && isMore">
						<text class="contentTitle">优势路线：</text>
						<text class="contentMsg">{{fleetInfo.route}}</text>
					</view>
					<view class="content-child" v-if="(fleetInfo.advantageIndustry || customText) && isMore">
						<text class="contentTitle">优势行业：</text>
						<text class="contentMsg">{{customText && fleetInfo.advantageIndustry?(fleetInfo.advantageIndustry + ',' + customText):(fleetInfo.advantageIndustry && !customText)?fleetInfo.advantageIndustry:customText}}</text>
					</view>
					<view class="pack-up" v-if="(fleetInfo.slogan || fleetInfo.route || fleetInfo.advantageArea || fleetInfo.advantageIndustry || customText) && !isMore">
						<text class="pack-up-child" @click="moreTap(1)">查看更多</text>
					</view>
					<view class="pack-up" v-if="isMore">
						<view class="pack-up-child" @click="moreTap(0)">收起</view>
					</view>
				</view>
			</view>
			
			<view class="operationScrollBox">
				<view class="operationBtns" v-if="userRole==2"  @click="jumpToCreatOrder()">
					<image class="btnIcon" src="/static/images/newFleetDetails/sendGoods.png"></image>
					<view class="btnMsg">发货</view>
				</view>
				<view class="operationBtns" @click="goMap">
					<image class="btnIcon" src="/static/images/newFleetDetails/positionMap.png"></image>
					<view class="btnMsg">定位地图</view>
				</view>
				<view class="operationBtns" @click="share">
					<image class="btnIcon" src="/static/images/newFleetDetails/largePositionMap.png"></image>
					<view class="btnMsg">定位大屏</view>
				</view>
				<view class="operationBtns" @click="goQrCode">
					<image class="btnIcon" src="/static/images/newFleetDetails/QRCode.png"></image>
					<view class="btnMsg">车队码</view>
				</view>
				<view class="operationBtns"  @click="jumpToElegantDemeanour()">
					<image class="btnIcon" src="/static/images/newFleetDetails/elegantDemeanour.png"></image>
					<view class="btnMsg">车队风采</view>
				</view>
				<!-- <view class="operationBtns" v-if="fleetInfo.isMember" @click="jumpToDudu()">
					<image class="btnIcon" src="/static/images/newFleetDetails/dudu.png"></image>
					<view class="btnMsg">对讲机</view>
				</view> -->
				<view class="operationBtns" v-if="fleetInfo.isMember" @click="memberAdd">
					<image class="btnIcon" src="/static/images/newFleetDetails/newMember.png"></image>
					<view class="btnMsg">邀请</view>
				</view>
				<!-- <view class="operationBtns" v-if="fleetInfo.isMember" @click="jumpToGroupChat()">
					<image class="btnIcon" src="/static/images/newFleetDetails/groupChat.png"></image>
					<view class="btnMsg">群聊</view>
				</view> -->
				<view class="operationBtns" v-if="fleetInfo.isMember" @click.stop="goSetting">
					<image class="btnIcon" src="/static/images/newFleetDetails/setting.png"></image>
					<view class="btnMsg">设置</view>
				</view>
				<view class="operationBtns" v-if="fleetInfo.isAdmin || fleetInfo.isOwner" @click="goMemberVerify">
					<image class="btnIcon" src="/static/images/newFleetDetails/audit.png"></image>
					<view class="btnMsg">审核</view>
				</view>
			</view>
			
			<view class="member-head">
				<view class="fleetMemberNum">车队成员：{{fleetInfo.memberNum ? fleetInfo.memberNum : 1}}人</view>
			</view>
		</view>
		
		<view class="selectBtnGroup">
			<view class="searchMsgBox" @click="showSelectPopup(1)">
				<view class="msg" :style="selectCityParams.name ? 'color: #3489E9;' : 'color: #333;'">{{selectCityParams.name ? '定位：' + showSearchAddr(selectCityParams.name) : '地区'}}</view>
				<image class="selectIcon" :src="selectCityParams.name ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
			</view>
			<view class="searchMsgBox" @click="showSelectPopup(3)">
				<view class="msg" :style="selectStartCityParams.name ? 'color: #3489E9;' : 'color: #333;'">{{selectStartCityParams.name ? '始发：' + showSearchAddr(selectStartCityParams.name) : '常跑始发'}}</view>
				<image class="selectIcon" :src="selectStartCityParams.name ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
			</view>
			<view class="searchMsgBox" @click="showSelectPopup(4)">
				<view class="msg" :style="selectEndCityParams.name ? 'color: #3489E9;' : 'color: #333;'">{{selectEndCityParams.name ? '目的：' + showSearchAddr(selectEndCityParams.name) : '常跑目的'}}</view>
				<image class="selectIcon" :src="selectEndCityParams.name ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
			</view>
		</view>
		<view v-for="(item,index) in carSourceList" :key="index">
			<view class="car_source_item" v-if="item.serviceType == 10">
				<view class="listMsgBox">
					<view class="head">
						<view class="avatar-icon">
							<image class="avatar" :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
							<image class="vipIcon" src="/static/images/newFleetDetails/redVip.png" v-if="item.isBindDevice == 1"></image>
							<image class="vipIcon" src="/static/images/newFleetDetails/blueVip.png" v-if="item.isBindDevice != 1 && item.isBindZj == 1"></image>
						</view>
					
						<!-- <view class="order_receive_status" :class="{order_receive_status_2: item.taskStatus == 2}">
							<view></view>
							<text>{{item.taskStatus != 2 ? "可接单" : '忙碌'}}</text>
						</view> -->
						<view class="tags"  v-if="item.driverShowStatus">
							<image :src="item.driverShowStatusIcon" />
							<view >{{item.driverShowStatus}}</view>
						</view>
					</view>
					<view class="right_content">
						<view class="name_model">
							<view class="user_name">{{showName(item)}}</view>
							<view class="user_model">{{item.model?setModel(item.model):''}}</view>
						</view>
						<view class="name_model" style="margin-top: 16rpx"  v-if="driverDetailPermissions || item.circuitCombo">
							<view class="citys" v-if="item.circuitCombo"><text class="citys-label">常跑：</text>{{item.circuitCombo}}</view>
							<view class="details" @click="jumpToDriverDetails(item.userId, (fleetInfo.isOwner || fleetInfo.isAdmin) ? 1 : 0, (fleetInfo.isOwner || fleetInfo.isAdmin) ? 1 : 0)" v-if="driverDetailPermissions">
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
						<view class="name_model" style="margin-top: 16rpx" v-if="(item.tagShowArr && item.tagShowArr.length) || item.isContact">
							<view class="btn-content">
								<view class="btn-item" v-for="atem in item.tagShowArr">
									<text>{{atem.tagName}}</text>
								</view>
							</view>
							<view class="is_see" v-if="item.isContact">您今天查看过</view>
						</view>
					</view>
				</view>
				<view class="listBtnBox" v-if="trajectoryPermissions || collectionPermissions || callDriverPermissions">
					<view class="groupLine"></view>
					<view class="userListBtnGroup">
						<view class="btnBox" @click="toTrackSimple(item)" v-if="trajectoryPermissions">
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
			<view class="car_source_item car-ship" v-if="item.serviceType != 10">
				<view class="listMsgBox">
					<view class="head">
						<view class="avatar-icon">
							<image class="avatar" :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
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
		</view>
		
		<view class="loadingBox" v-show="noData">
			<image class="noDataIcon" src="/static/images/vehicleOptions/newNodata.png"></image>
		</view>
		<view class="loadingBox" v-show="noData">暂无数据～</view>
		<view class="loadingBox" v-show="noMore">
			{{(selectUserIdInfo && selectUserIdInfo.length > 0) || (selectedCityIndex == 0 && selectCityParams.name) || (selectedCityIndex > 0 && selectCityParams.name) ? '没有更多了～' : '选择出发城市，查询更多～'}}
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="/static/images/listLoading.png"></image>
			努力加载中…
		</view>
		
		<uni-popup ref="confirmPopup3" type="center">
			<view class="add_box">
				<view class="add_conten">
					<view class="tips">
						<view class="text">您还没有{{fleetInfo.cartLength}}米{{fleetInfo.model}}的车,</view>
						<view class="text" style="margin-top: 10rpx;">是否添加车辆?</view>
					</view>
					<view class="confirmAdd_box"  @click="addTo">
						<text class="confirmAdd">去添加</text>
					</view>
		
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="confirmPopup2" type="bottom">
			<view class="box_big">
				<view class="vehicle_infor">
					<view class="title">请填写您的车辆加入车队，我们还会根据 您的喜好，为您推荐优质的货源哦</view>
					<view class="vehicle_box">
						<view class="vehicle_content">
							<view class="left">车长车型:</view>
							<text class="right">{{fleetInfo.cartLength}}米{{fleetInfo.model}}</text>
						</view>
		
						<view class="vehicle_content">
							<view class="left">
								<text class="asterisk">*</text>
								<view>车牌号:</view> 
							</view>
							<view class="right">
								<input class="input" type="text" v-model="plateNoFleet" placeholder-style="font-size:26rpx;;"  placeholder="请填写您的车牌号" />
							</view>
						</view>
					</view>
		
					<view class="btn_box" @click="joinHand">
						<text class="join">加入车队</text>
					</view>
		
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="feetMemberHintPopup" type="center">
			<view class="fleetAddMsgPopUp">
				<view class="fleetAddMsg">{{memberHintMsg}}</view>
				<view class="fleetAddMsgBtn" @click="closeFleetMemberHintPopup">我知道了</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="sourceSelectPopup" type="top">
			<view class="sourceSelectBox">
				<view class="selectHead">
					<view class="selectBox" @click="showPopupDetails(1)">
						<view class="msg" :style="popupDetails == 1 ? 'color: #3489E9;' : 'color: #333;'">{{popupCityParams.name ? popupCityParams.name : '地区'}}</view>
						<image class="selectIcon" :class="popupDetails == 1 ? 'toRolate' : ''" :src="popupDetails == 1 ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
					</view>
					<view class="selectBox" @click="showPopupDetails(3)">
						<view class="msg" :style="popupDetails == 3 ? 'color: #3489E9;' : 'color: #333;'">{{popupStartCityParams.name ? popupStartCityParams.name : '常跑始发'}}</view>
						<image class="selectIcon" :class="popupDetails == 3 ? 'toRolate' : ''" :src="popupDetails == 3 ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
					</view>
					<view class="selectBox" @click="showPopupDetails(4)">
						<view class="msg" :style="popupDetails == 4 ? 'color: #3489E9;' : 'color: #333;'">{{popupEndCityParams.name ? popupEndCityParams.name : '常跑目的'}}</view>
						<image class="selectIcon" :class="popupDetails == 4 ? 'toRolate' : ''" :src="popupDetails == 4 ? '/static/images/newIndex/checkDown.png' : '/static/images/newIndex/defaultDown.png'"></image>
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
								<text class="msg" :style="selectedCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{item.showName ? item.showName : item.name}}</text>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="selectBody" v-if="popupDetails == 3">
					<view class="selectTitleItem">
						<view class="title">省份</view>
						<view class="title">城市</view>
					</view>
					<view class="selectAddressBox">
						<scroll-view class="province-item" style="flex: 0 0 260rpx;" :scroll-y="true">
							<view class="selectMsg" v-for="(item, index) in provinceArr" @click.stop="switchStartProIndex(index)">
								<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="selectedStartProvinceIndex == index"></image>
								<text class="msg" :style="selectedStartProvinceIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{replaceProvince(item.name)}}</text>
							</view>
						</scroll-view>
						<scroll-view class="province-item" :scroll-y="true">
							<view class="selectMsg" v-for="(item, index) in startCityArr" @click.stop="switchStartCityIndex(index)">
								<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="selectedStartCityIndex == index"></image>
								<text class="msg" :style="selectedStartCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{item.showName ? item.showName : item.name}}</text>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="selectBody" v-if="popupDetails == 4">
					<view class="selectTitleItem">
						<view class="title">省份</view>
						<view class="title">城市</view>
					</view>
					<view class="selectAddressBox">
						<scroll-view class="province-item" style="flex: 0 0 260rpx;" :scroll-y="true">
							<view class="selectMsg" v-for="(item, index) in provinceArr" @click.stop="switchEndProIndex(index)">
								<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="selectedEndProvinceIndex == index"></image>
								<text class="msg" :style="selectedEndProvinceIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{replaceProvince(item.name)}}</text>
							</view>
						</scroll-view>
						<scroll-view class="province-item" :scroll-y="true">
							<view class="selectMsg" v-for="(item, index) in endCityArr" @click.stop="switchEndCityIndex(index)">
								<image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" v-if="selectedEndCityIndex == index"></image>
								<text class="msg" :style="selectedEndCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">{{item.showName ? item.showName : item.name}}</text>
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
		
		<uni-popup ref="sharePopup" type="bottom">
			<view class="popup-content">
				<text class="popup-head">分享到</text>
				<view class="popup-row">
					<view class="popup-child" @click="shareEvent('WXSceneSession')">
						<image class="popup-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/weChat.png"
							mode=""></image>
						<text class="popup-child-text">微信好友</text>
					</view>
					<view class="popup-child" @click="shareEvent('WXSenceTimeline')">
						<image class="popup-img"
							src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/circleFriends.png" mode="">
						</image>
						<text class="popup-child-text">朋友圈</text>
					</view>
				</view>
				<view class="cancel-btn" @click="cancelShare"><text class="cancel-btn-text">取消</text></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	import * as ship from "@/utils/ship.js";
	import * as utilsData from "@/utils/utils";
	import * as publicData from "@/utils/publicData.js";
	import IMService from "@/utils/imservice.js";
	var duduTaskModule = uni.requireNativePlugin("DuduTaskModule");
	const { dateTimePicker} = require('@/utils/date.js');
	export default {
		data() {
			return {
				srcUrl: '',
				fleetId: 0,
				fleetInfo: {},
				customText: '',
				userRole: 0,
				isRepeat: false,
				total: 0,
				isMore: 0,
				GoEasy: '',
				goEasy: '',
				relShowHeight: '',
				relShowFlag: false,
				alertDriverTimeout: null,
				longitude: '',
				latitude: '',
				plateNoFleet:'',
				modelList:[],   //绑定车辆数据
				fleetmemsize: '',
				memberHintMsg: '',
				provinceArr: [],
				cityArr: [],
				selectedProvinceIndex: -1,
				selectedCityIndex: -1,
				popupDetails: 1,
				popupCityParams: {},
				selectCityParams: {},
				popupStartCityParams: {},
				selectStartCityParams: {},
				selectedStartProvinceIndex: -1,
				selectedStartCityIndex: -1,
				startCityArr: [],
				popupEndCityParams: {},
				selectEndCityParams: {},
				selectedEndProvinceIndex: -1,
				selectedEndCityIndex: -1,
				endCityArr: [],
				selectUserIdInfo: [],
				isAlertJoin: 0,
				myFleetData: [],
				rspMsg: '',
				willJoinFleetArr: [], //将要加入车队的司机
				userInfo: null,
				couponAccountObj: {},
				remainingNum: 0,
				mealBaseInfo: 0,
				fleetBaseInfo: 0,
				firstTouUp: 0,
				showCheckedNum: 0,
				
				pageNum: 1,
				pageSize: 10,
				noData: false,
				noMore: false,
				isLoading: false,
				allCheckedFlag: false,
				allCheckedNum: 0,
				carSourceList: [],
				isRoleMember: false,
				driverDetailPermissions: false,
				trajectoryPermissions: false,
				collectionPermissions: false,
				callDriverPermissions: false,
				fleetBaseInfo: 0,
			}
		},
		onLoad(options) {
			this.GoEasy = getApp().globalData.nvueGoeasy;
			this.goEasy = getApp().globalData.nvuegoeasy;
			let that = this;
			this.userRole = uni.getStorageSync('userRole') ? Number(uni.getStorageSync('userRole')) : 0; // 1为司机2为货主1
			console.log(options);
			// this.fleetId = 887;
			// this.fleetId = 267;
			// this.getFleetDetail();
			// this.getMemberList();
			if (options.info) {
				uni.showLoading();
				this.fleetId = JSON.parse(options.info).id;
				this.getProvince();
				this.getFleetDetail();
				this.getMealBaseList(); // 会员套餐
			}
			
			this.getSystemData();
			var ApiRootUrl = ship.ApiRootUrl;
			var QueryApiRootUrl = ship.QueryApiRootUrl;
			var userInfo = uni.getStorageSync("userInfo");
			this.userInfo = JSON.parse(userInfo);
			var userCode = JSON.parse(userInfo).attrs.userCode;
			var Authorization = JSON.parse(userInfo).attrs.token;
			var fleetId = JSON.parse(options.info).id;; //车队id
			var longitude = "121.453467";
			var latitude = "31.342177";
		// 	uni.showModal({
		// 		title: '提示',
		// 		content: '为了查询距离您最近的车队信息，将申请您的定位权限',
		// 		success(res) {
		// 			if (res.confirm) {
		// 				uni.getLocation({
		// 					type: 'gcj02',
		// 					geocode: true,
		// 					success: function(res) {
		// 						console.log("装卸地", res);
		// 						if (res.address) {
		// 							var province = res.address.province;
		// 							var sendAddr = "";
		// 							if (province == "上海市" || province == "北京市" || province == "天津市" || province == "重庆市") {
		// 								sendAddr = res.address.province + res.address.district + '人民政府';
		// 							} else {
		// 								sendAddr = res.address.province + res.address.city + '人民政府';
		// 							}
		// 							console.log("地址", sendAddr)
		// 						}
		// 						longitude = res.longitude;
		// 						latitude = res.latitude;
		// 						that.srcUrl = ship.fleetDetailMap + '?ApiRootUrl=' + ApiRootUrl + '&QueryApiRootUrl=' +
		// 							QueryApiRootUrl + '&Authorization=' +
		// 							Authorization + '&userCode=' + userCode + '&longitude=' + longitude + '&latitude=' +
		// 							latitude + '&fleetId=' + fleetId;
		// 						that.longitude = longitude;
		// 						that.latitude = latitude;
		// 						console.log(that.srcUrl)
		// 					},
		// 					fail: function(err) {
		// 						that.srcUrl = ship.fleetDetailMap + '?ApiRootUrl=' + ApiRootUrl + '&QueryApiRootUrl=' +
		// 							QueryApiRootUrl + '&Authorization=' +
		// 							Authorization + '&userCode=' + userCode + '&longitude=' + longitude + '&latitude=' +
		// 							latitude + '&fleetId=' + fleetId;
		// 						console.log(that.srcUrl)
		// 					}
		// 				})
		// 			}
		// 		}
		// 	})
		
			
			var pageSource = options.pageSource;
			this.pageSource = pageSource;
			if (pageSource == "carSettings") {
				//车型车长配置页面过来则弹窗显示最近的可接单司机
				uni.navigateTo({
					url: './alertDriverList?info=' + options.info
				})
			}
			
		},
		onShow() {},
		onPullDownRefresh() {
			this.noData = false;
			this.noMore = false;
			this.isLoading = false;
			this.carSourceList = [];
			this.pageNum = 1;
			this.getFleetDetail();
		},
		onReachBottom() {
			if(this.noData || this.noMore || this.isLoading) return;
			this.pageNum = this.pageNum + 1;
			this.getMemberListInfo();
		},
		onPageScroll(e) {},
		methods:{
			toMemberList() {
				//跳转成员列表
				var userInfo = uni.getStorageSync("userInfo");
				var userCode = JSON.parse(userInfo).attrs.userCode;
				var fleetId = this.fleetId;
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/fleetmemberList?userCode=' + userCode + '&fleetId=' +
						fleetId + '&type=detail'
				})
			},
			getSystemData() { // 获取设备最大高度
				uni.getSystemInfo({
					success: res => {
						console.log('设备信息', res);
						// let heightNum = res.windowHeight * 2
						let relHeightNum = res.screenHeight * 2
						this.relShowHeight = (relHeightNum - 500) + 'rpx';
						this.relShowFlag = true;
					}
				});
			},
			getFleetDetail(num) { // 车队详情
				var that = this;
				ship.newQueryPostRequest("/cd/fleet/list", {
						id: that.fleetId,
					})
					.then(res => {
						console.log("车队详情",res);
						if (res.retCode == "0000000") {
			
							that.fleetInfo = res.rspBody.items[0];
							that.customText = "";
							if (that.fleetInfo.advantageIndustry && that.fleetInfo.advantageIndustry.indexOf('*') > -
								1) {
								var advantageIndustryText = that.fleetInfo.advantageIndustry.split('*')
								that.fleetInfo.advantageIndustry = advantageIndustryText[0];
								that.customText = advantageIndustryText[1]
							}
							var total = that.fleetInfo.memberNum;
							var fleetInfo = that.fleetInfo;
							if (fleetInfo.isAdmin || fleetInfo.isOwner) {
								that.total = total;
							} else {
								if (total == 0) {
									 that.total = "0"
								} else if (total < 10) {
									that.total = "10+"
								} else if (total < 100) {
									that.total = (parseInt(total / 10) + 1) * 10 + '+'
								} else {
									var len = (total.toString()).length;
									var ten = Math.pow(10, (len - 2));
									console.log("计算", len, ten)
									that.total = (parseInt(total / ten) + 1) * ten + '+'
								}
							}
							that.getUserPermissions();
							if(that.fleetInfo.ext3 == "SUPER_FLEET") { // 超级车队则获取当前位置
								var platform = uni.getSystemInfoSync().platform
								if (platform == "ios") {
									that.superFleetGetLocation();
									that.isLoading = true;
									
								} else {
									if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
										uni.showModal({
											title: '提示',
											content: '为了按您的位置排序车队成员，将申请您的定位权限',
											success(res) {
												if (res.confirm) {
													that.superFleetGetLocation();
													that.isLoading = true;
												} else {
													that.getMemberListInfo();
												}
											}
										})
									} else {
										that.superFleetGetLocation();
										that.isLoading = true;
									}
								}
								
							}else {
								that.getMemberListInfo();
							}
						}
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
						console.log('车队详情获取失败', err);
					})
				uni.stopPullDownRefresh();
				that.$forceUpdate();
			},
			superFleetGetLocation() {
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						console.log( '当前定位', res);
						// that.selectCityParams = {
						// 	name: res.address.city
						// }
						// that.getMemberListInfo();
						that.getLocationArea(res.longitude, res.latitude);
					},
					fail: function(err) {
						that.isLoading = false;
						that.getMemberListInfo();
					}
				})
			},
			getLocationArea(longitude, latitude) {
				console.log('经纬度', longitude, latitude);
				let that = this;
				//根据地址搜索
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&location=' + longitude + ',' + latitude;
				console.log('搜索参数', parameters);
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('成功', res);
						if (res.statusCode == 200 && res.data.status == '1') {
							let regeocode = res.data.regeocode;
							let provinceCode = (regeocode.addressComponent.adcode.substr(0,3)) + '000'; // 省的code
							if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
								that.selectCityParams.name = regeocode.addressComponent.province;
								that.selectCityParams.code = provinceCode;
								that.selectedCityIndex = 0;
							}else {
								let cityCode = (regeocode.addressComponent.adcode.substr(0,2)) + regeocode.addressComponent.citycode
								that.selectCityParams.name = regeocode.addressComponent.city;
								that.selectCityParams.code = cityCode;
								that.selectedCityIndex = 999;
							}
							console.log(that.selectCityParams);
							that.$forceUpdate();
							that.getSelectIndex();
							that.isLoading = false;
							that.getMemberListInfo();
						}else {
							that.isLoading = false;
							that.getMemberListInfo();
						}
					},
					fail: (err) => {
						that.isLoading = false;
						that.getMemberListInfo();
						console.log('失败', err);
					},
				});
			},
			getSelectIndex() {
				if(this.provinceArr && this.provinceArr.length > 0) {
					let provinceCode = this.selectCityParams.code;
					if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
						for(let i in this.provinceArr) {
							if(this.provinceArr[i].code == provinceCode) {
								this.selectedProvinceIndex = i;
								this.selectedCityIndex = 0;
								this.pushDiyCityItem(this.selectCityParams.name, this.selectCityParams.code, i);
								break;
							}
						}
					}else {
						for(let i in this.provinceArr) {
							for(let c in this.provinceArr[i].cities) {
								if(this.provinceArr[i].cities[c].code == provinceCode) {
									this.selectedProvinceIndex = i;
									this.selectedCityIndex = c;
									this.pushDiyCityItem(this.selectCityParams.name, this.selectCityParams.code, i);
									break;
								}
							}
						}
					}
				}
			},
			getUserPermissions() {
				let fleetDetail = this.fleetInfo;
				let userRole = uni.getStorageSync("userRole");
				if (fleetDetail.fleetAttributes == "车型" || fleetDetail.fleetAttributes == "线路" || fleetDetail.fleetAttributes == "行业") {
					this.fleetInfo.ext3 = "SUPER_FLEET";
				}
				if(this.fleetInfo.ext3 == "SUPER_FLEET") { // 超级车队
					if(userRole == 2) {
						this.driverDetailPermissions = true;
						this.trajectoryPermissions = true;
						this.collectionPermissions = true;
						this.callDriverPermissions = true;
					}
					if(this.fleetInfo.isAdmin || this.fleetInfo.isOwner) {
						this.driverDetailPermissions = true;
						this.trajectoryPermissions = true;
						this.collectionPermissions = true;
						this.callDriverPermissions = true;
					}
				}else { // 一般车队
					if(this.fleetInfo.isAdmin || this.fleetInfo.isOwner) {
						this.driverDetailPermissions = true;
						this.trajectoryPermissions = true;
						this.callDriverPermissions = true;
					}else if(userRole == 2) {
						this.driverDetailPermissions = true;
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
				}
				if ((fleetDetail.isOwner || fleetDetail.isAdmin) && fleetDetail.ext3 == "SUPER_FLEET") {
					this.isAlertJoin = 8; //车队长/管理员看超级车队
				}
				console.log('权限', this.isAlertJoin);
			},
			upFile() {
				var that = this;
				if (that.fleetInfo.isAdmin || that.fleetInfo.isOwner) {
					uni.chooseImage({
						count: 1, // 默认9  
						crop: {
							width: 750,
							height: 350,
							quality: 100,
							resize: true
						},
						sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
						success: function(res) {
							console.log(res);
							// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
							var tempFilePaths = res.tempFilePaths
							console.log(tempFilePaths, '图片上传')
							that.uploadFrontImage(tempFilePaths[0]);
			
						}
					})
				}
			},
			uploadFrontImage(path) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				utils.upLoadFile("/file/upload", path)
					.then(result => {
						uni.hideLoading()
						if (result.retCode == '0000000') {
							that.fleetInfo.bgImg = result.rspBody.url;
							that.setBgImg();
							console.log(that.fleetInfo.bgImg);
						} else {
							uni.showToast({
								title: '上传失败，请重试',
								icon: 'none'
							})
						}
			
					}).catch(err => {
						uni.hideLoading()
					})
			},
			setBgImg() {
				var that = this;
				console.log(that.fleetInfo.id, that.fleetInfo.bgImg);
				ship.postRequest("/cd/fleet/save", {
						id: that.fleetInfo.id,
						bgImg: that.fleetInfo.bgImg,
					})
					.then(res => {
						console.log(res)
						if (res.retCode == "0000000") {
							that.getFleetDetail(1);
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			toBack() {
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					uni.navigateBack();
					return;
				}
				this.alertDriverTimeout && clearTimeout(this.alertDriverTimeout);
				if (this.pageSource == "carSettings") {
					uni.switchTab({
						url: '/pages/goodsDelivery/fleetIndex/fleetIndex'
					})
				} else {
					uni.navigateBack();
				}
			
			
			},
			goSetting() {
				uni.navigateTo({
					url: './fleetSetting?info=' + JSON.stringify(this.fleetInfo) + '&customText=' + this.customText
				})
			},
			goMemberList(type) {
				uni.navigateTo({
					url: './memberList?info=' + JSON.stringify(this.fleetInfo) + '&type=' + type
				})
			},
			showLargeImage(imgUrl) {
				imgUrl = imgUrl ? imgUrl : '/static/images/goodsDelivery/fleet-head.png';
				uni.previewImage({
					urls: [imgUrl],
					success: function(data) {
						console.log(data);
					},
					fail: function(err) {
						console.log(err);
					}
				});
			},
			focusTap() {
				if (this.isRepeat) {
					return;
				}
				this.isRepeat = true;
				uni.showLoading();
				ship.postRequest('/cd/fleetWithUser/save', {
					fleetId: this.fleetInfo.id,
					status: 3,
				})
				.then(res => {
					console.log(res)
					this.isRepeat = false;
					if (res.retCode === "0000000") {
						this.getFleetDetail(1);
						uni.showToast({
							title: '关注成功',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
					this.isRepeat = false;
				})
			},
			cancelFocusTap() {
				if (this.isRepeat) {
					return;
				}
				this.isRepeat = true;
				uni.showLoading();
				var userInfo = uni.getStorageSync("userInfo");
				var userCode = JSON.parse(userInfo).attrs.userCode;
				ship.postRequest('/cd/fleetWithUser/remove', {
					fleetId: this.fleetInfo.id,
					userCode: userCode,
					status: 3,
				})
				.then(res => {
					console.log(res)
					this.isRepeat = false;
					if (res.retCode === "0000000") {
						this.getFleetDetail(1);
						uni.showToast({
							title: '已取消',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
					this.isRepeat = false;
				})
			},
			
			joinFleet() {
				console.log(this.fleetInfo, 'fleetInfo')
				//判断加入的是不是超级车队
				if (this.fleetInfo.ext3 && this.fleetInfo.ext3 == 'SUPER_FLEET') {
					this.getCarList();
				} else {
					if(this.fleetInfo.ext3 == '平台') {
						this.effectiveSupply();
					}else {
						let params = {
							"usersid": this.fleetInfo.userId,
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
									if(that.fleetInfo.serviceType == 20) { // 车队长角色为货主
										that.memberHintMsg = '当前车队人数已经达到上限啦～快让车队创建人去充值会员吧';
										that.$refs.feetMemberHintPopup.open();
									}else { // 车队长角色为司机
										that.memberHintMsg = '当前车队已达到人数上限，不可加入，请直接联系管理员';
										that.$refs.feetMemberHintPopup.open();
									}
								}else {
									that.effectiveSupply();
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
					}
				}
			},
			
			//加入超级车队 判断是否有车辆
			getCarList(item){				
				var userInfo = uni.getStorageSync("userInfo");
				var driverId = JSON.parse(userInfo).attrs.driverId
				let data = {
					driverId: driverId,
					pageSize: 20,
					pageNum: 1,
				}
				console.log(data,'data')
				ship.postRequest("/yh/vehicle/select/list/by/driver", data).then(res=>{
					console.log(res,'res')
					if (res.retCode == '0000000') {
						this.modelList = res.rspBody.items;  //绑定的车辆
						// this.selectedCarList = item;   //选中要加入得超级车队数据
						//判断是否有车辆 有车就校验是否满足超级车队车型车长  不满足就去添加车辆
						if(res.rspBody.total == 0)	{ 
							// uni.hideTabBar();
							this.$refs.confirmPopup2.open();
						}else {
							this.getModel()
						}
										
					} else { 
						uni.showToast({
						  title: res.retDesc,
						  icon:'none'
						})
					}
				}).catch(err=>{
					
				})
			},
			
			//判断是否满足超级车队的车型车长
			getModel(){
				var fleetInfo = this.fleetInfo; 
				console.log(fleetInfo)
				//判断是否满足超级车队的车型车长
				let res = this.modelList.filter(val=>{
					if(val.ext1 == fleetInfo.model && val.vehicleLength == fleetInfo.cartLength) {
						return val;
					}
				})
				console.log(res,res.length,'length');
				// 大于0的时候说明有满足超级车队的车型车长
				if(res.length > 0) {
					//车辆的车长车型超级车队匹配  走车队审核校验
					this.addFleet(fleetInfo);
					
				}else {
					this.$refs.confirmPopup3.open();
				}
				
				
			},
			
			//走车队审核校验
			addFleet(item){
				console.log(item,'item')
				var fleetId = item.id;
				var userCode = this.userInfo.attrs.userCode;
				ship.postRequest("/cd/fleetWithUser/save", {fleetId: fleetId, userCode: userCode}).then(res=>{
					console.log(res,'resres')
					if(res.retCode == '0000000') {
						console.log(res,'0000000')
						// 车队是否需要审核    verifycationMethod - 验证方式：0-拒绝加入；1-无需验证；2-需要验证
						if(item.verificationMethod == 2) {
							uni.showToast({
								title:'申请成功啦，管理员审批通过后，会尽快通知您',
								icon:'none',
								duration:3500
							})
						}else if(item.verificationMethod == 1) {
							uni.navigateTo({
								url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(item)
							})
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none',
							duration:3000
						})
					}
				}).catch(err =>{
					console.log(err,'er')
					uni.showToast({
						title: err.retDesc,
						icon:'none'
					})
				})
			},
			
			//去添加车牌号
			addTo(){
				// uni.hideTabBar();
				this.$refs.confirmPopup3.close();
				this.$refs.confirmPopup2.open();
			},
			
			//加入车队
			joinHand(){
				var userInfo = uni.getStorageSync("userInfo");
				var infor = JSON.parse(userInfo);
				// var driverId = JSON.parse(userInfo).attrs.driverId
				console.log(this.plateNoFleet,this.plateNoFleet.length)
				if(this.plateNoFleet == "") {
					uni.showToast({
						title:'请输入车牌号',
						icon:'none'
					})
					return;
				}
				if(this.plateNoFleet.length > 8) {
					uni.showToast({
						title:'请输入正确车牌号',
						icon:'none'
					})
					return;
				}
				const plateNumber = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/
				if (!plateNumber.test(this.plateNoFleet)) {
					uni.showToast({
						title:'请输入正确车牌号',
						icon:'none'
					})
					return;
				}
				let res = this.modelList.filter(item=>{
					if(item.isDefault && item.isDefault == 1) {
						return item;
					}
				})
				
				let data = {
					 driverId:infor.attrs.driverId,
					 plateNo: this.plateNoFleet,
					 ext1: this.fleetInfo.model,
					 vehicleLength: this.fleetInfo.cartLength,
					 isDefault: 1,
					 personId: infor.attrs.personId,
					 userCode: infor.attrs.userCode,
					 userId: infor.userId,
					 userPhone: infor.mobile,
				}
				//判断司机是否有默认绑定的车辆  如果有就不传默认车辆参数 么有就传
				if(res.length == 0) {
					data.isDefault = 1;
				}
				
				console.log(data,'datadatadata')
				
				ship.postRequest('/yh/vehicle/save/bind/simple',data).then(res=>{
					console.log(res,'res')
					if(res.retCode == "0000000") {
						if(res.rspBody == 1) {
							this.$refs.confirmPopup2.close();
							// uni.showTabBar();
							uni.showToast({
								title:'加入成功'
							})							
						 this.plateNoFleet = "";
						 this.addFleet(this.fleetInfo);
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none'
						})
					}
				}).catch(err=>{
					console.log(err,'err')
					uni.showToast({
						title: err.retDesc,
						icon:'none'
					})	
				})
			},
			
			maskClick() {
				this.$refs.confirmPopup2.close();
				// uni.showTabBar();			
			},
			
			//判断是否存在有效的货源时
			async effectiveSupply() {
				console.log(this.fleetInfo, '判断是否存在有效的货源时')
				try {
					uni.showLoading();
					var code = this.fleetInfo.code;
					var res = await ship.postRequest("/cd/fleet/fleetGoods", {
						code: code
					});
					console.log(res, '判断是否有有效货源')
					uni.hideLoading();
					//有有效货源并且无需审核数据  直接跳转到车队货源页面
					if (res.rspBody == 1 && this.fleetInfo.verificationMethod == 1) {
						this.memberAddTap('1');
						uni.showToast({
							title: '已成功加入车队，3秒后为您跳转车队货源，快去找货吧~',
							icon: 'none',
							duration: 3000
						})
						uni.setStorageSync('fleetName', this.fleetInfo.name);
			
						setTimeout(() => {
							uni.switchTab({
								url: '../../ship/index/index1'
							})
						}, 3000)
			
					} else {
						this.memberAddTap();
					}
				} catch (e) {
					uni.hideLoading();
				}
			},
			
			memberAddTap(flag) {
				console.log('memberAddTap加入加入', this.fleetInfo)
				if (this.isRepeat) {
					return;
				}
				this.isRepeat = true;
				ship.postRequest('/cd/fleetWithUser/save', {
						fleetId: this.fleetInfo.id,
						userCode: this.userInfo.attrs.userCode
					})
					.then(res => {
						console.log(res)
						this.isRepeat = false;
						if (res.retCode === "0000000") {
							//如果是有效货源 并且不需要审核的数据 不走提示信息  直接跳转
							if (!flag) {
								this.getFleetDetail(1);
								if (this.fleetInfo.verificationMethod == 2) {
									uni.showToast({
										title: '已申请',
										icon: 'none'
									})
								} else if (this.fleetInfo.verificationMethod == 1) {
									uni.showToast({
										title: '加入成功',
										icon: 'none'
									})
								}
							}
			
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						this.isRepeat = false;
					})
			},
			showWeChatQr() { // 查看微信二维码
				uni.previewImage({
					urls: [this.fleetInfo.qrcode]
				})
			},
			goQrCode() { // 查看车队二维码
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/qrCode?info=' + JSON.stringify(this.fleetInfo)
				})
			},
			moreTap(status) {
				this.isMore = status;
				this.$forceUpdate();
			},
			jumpToCreatOrder() { // 下一步跳转创建订单页
				if (!ship.btnRepeat()) return false; // 防抖
				var newArr = getApp().globalData.creatScope.checkedGroup;
				newArr.push(this.fleetInfo)
				getApp().globalData.creatScope.checkedGroup = newArr;
				getApp().globalData.creatScope.creatScopeType = [2];
				uni.navigateTo({
					url: '../creatOrder/creatOrder'
				});
			},
			jumpToDudu() {
			
				//dudu对讲机埋点
				if (!ship.btnRepeat()) return;
				var platform = uni.getSystemInfoSync().platform;
				let groupName = this.fleetInfo.name;
				let groupCode = this.fleetInfo.code;
				let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
				let userData = uni.getStorageSync("userInfo");
				let userInfo = '',
					userId;
				if (Number(userRole) == 1) {
					userInfo = userData ? JSON.parse(userData) : {};
					let avatarObj = JSON.parse(userData);
					userInfo.attrs.avatar = avatarObj.attrs.avatar;
					userId = userInfo.userId;
				} else {
					userInfo = userData ? JSON.parse(userData) : {};
					userId = userInfo.userId;
				}
				let userName = userInfo.userName ? userInfo.userName.substr(0, 1) + '**' : '游客' + userInfo.userId;
				let userAvatar = userInfo.attrs.avatar ? userInfo.attrs.avatar :
					'https://hyzg-app.oss-cn-beijing.aliyuncs.com/shipUserLogo.png';
				if (platform == "ios") {
					uni.navigateTo({
						url: '../../dutalk/room/room?appId=cargocn' + '&mobile=' + userInfo.mobile + '&openId=' +
							userInfo.attrs.userCode + '&name=' + userName + '&avatar=' + userAvatar + '&groupId=' +
							groupCode + '&groupName=' + groupName
					})
				} else {
					duduTaskModule.goDuduTask({
						appId: 'cargocn',
						mobile: userInfo.mobile,
						openId: userInfo.attrs.userCode,
						name: userName,
						avatar: userAvatar,
						groupId: groupCode,
						groupName: groupName
					}, res => {
			
					})
				}
				var systemInfo = uni.getSystemInfoSync();
				console.log(systemInfo, 'aa');
			
				var dataParams = {
					userSid: userId,
					clientModel: systemInfo.model,
					osVersion: systemInfo.system,
					appVersion: systemInfo.version,
					pageName: "嘟嘟对讲机",
					clientType: 2,
				}
				var date = new Date();
				var format = utilsData.dateFormat("YYYY-mm-dd HH:MM:SS", date);
				dataParams.viewDt = format;
				console.log(dataParams, 'aa');
				ship.postRequest("/danas/pageViewLog/add", dataParams)
					.then(res => {
						console.log(res, '上报成功')
					})
			},
			jumpToGroupChat() { // 跳转群聊
				uni.showLoading({
					title: '加载中'
				})
				// console.log('车队详情', this.fleetInfo);
				let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
				let userData = uni.getStorageSync("userInfo");
				// console.log('用户信息', JSON.parse(userData));
				let userInfo = '';
				if (Number(userRole) == 1) {
					userInfo = userData ? JSON.parse(userData) : {};
					let avatarObj = JSON.parse(userData);
					userInfo.attrs.avatar = avatarObj.attrs.avatar;
				} else {
					userInfo = userData ? JSON.parse(userData) : {};
				}
				if (this.goEasy.getConnectionStatus() == 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy, this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
					this.toSubscribeGroup(userInfo);
				} else {
					this.toSubscribeGroup(userInfo);
				}
			},
			toSubscribeGroup(userInfo) {
				let avatar = userInfo.avatar ? userInfo.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png';
				let name = this.fleetInfo.name;
				let code = this.fleetInfo.code;
				var groupIds = [];
				groupIds.push(code);
				this.goEasy.im.subscribeGroup({
					groupIds: groupIds, //聊天对象的userId
					onSuccess: function() { //标记成功
						console.log("订阅成功")
						uni.hideLoading();
						uni.navigateTo({
							url: '../userMessage/groupChat?groupId=' + code + '&avatar=' + avatar +
								'&nickname=' + name + '&userId=' + userInfo.userId
						})
					},
					onFailed: function(error) { //标记失败
						uni.hideLoading();
						console.log("订阅失败", error);
					}
				});
			},
			memberAdd() {
				uni.navigateTo({
					url: './memberAdd?info=' + JSON.stringify(this.fleetInfo)
				})
			},
			goMemberVerify() {
				uni.navigateTo({
					url: '/pages/my/fleet/fleetMemberList/fleetMemberList?fleetDetail=' + JSON.stringify(this
						.fleetInfo) + '&type=check&name=卡友审核'
				})
			},
			toCityMap() {
				//跳转到具体某个市到视图
				let that = this;
				var provinceLocal = uni.getStorageSync("regionData"); //获取缓存中的省
				var userCode = this.userInfo.attrs.userCode;
				if (!provinceLocal) return;
				var fleetInfo = this.fleetInfo;
				uni.getLocation({
					type: 'gcj02',
					geocode: 'true',
					success: function(res) {
						console.log("省市", res);
						var longitude = res.longitude;
						var latitude = res.latitude;
						var province = res.address.province || ""
						var city = res.address.city || "";
						var findIndex = provinceLocal.findIndex(item => {
							return item.name == province;
						})
						console.log("findIndex", findIndex)
						if (findIndex > -1) {
							var provinceName = provinceLocal[findIndex].name;
							var provinceCode = provinceLocal[findIndex].code;
							console.log(provinceName, provinceCode)
							if (provinceCode == "110000" || provinceCode == "500000" || provinceCode ==
								"310000" || provinceCode == "120000") {
								var senderCode = provinceLocal[findIndex].code
								var senderName = provinceLocal[findIndex].name;
								uni.navigateTo({
									url: '/pages/goodsDelivery/fleetIndex/fleetPositionList?userCode=' +
										userCode + '&sender=' + senderName + '&senderCode=' +
										senderCode + "&provinceCode=" + provinceCode +
										'&provinceName=' + provinceName + '&fleetDetail=' + JSON
										.stringify(fleetInfo) + '&type=fleetSource'
								})
							} else {
								var cities = provinceLocal[findIndex].cities;
								var findCityIndex = cities.findIndex(item => {
									return item.name == city;
								})
								if (findCityIndex > -1) {
									var senderName = cities[findCityIndex].name;
									var senderCode = cities[findCityIndex].code;
									uni.navigateTo({
										url: '/pages/goodsDelivery/fleetIndex/fleetPositionList?userCode=' +
											userCode + '&sender=' + senderName + '&senderCode=' +
											senderCode + "&provinceCode=" + provinceCode +
											'&provinceName=' + provinceName + '&fleetDetail=' + JSON
											.stringify(fleetInfo) + '&type=fleetSource'
									})
								}
			
							}
			
			
						}
			
					},
					fail: function(err) {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
					}
				})
			},
			toShowMap() {
				let that = this;
				var provinceLocal = uni.getStorageSync("regionData"); //获取缓存中的省
				if (!provinceLocal) return;
				uni.getLocation({
					type: 'gcj02',
					geocode: 'true',
					success: function(res) {
						console.log("省市", res);
						var longitude = res.longitude;
						var latitude = res.latitude;
			
						var province = res.address.province || ""
						var city = res.address.city || "";
						var findIndex = provinceLocal.findIndex(item => {
							return item.name == province;
						})
						console.log("findIndex", findIndex)
						if (findIndex > -1) {
							var provinceName = provinceLocal[findIndex].name;
							var provinceCode = provinceLocal[findIndex].code;
							console.log(provinceName, provinceCode)
							if (provinceCode == "110000" || provinceCode == "500000" || provinceCode ==
								"310000" || provinceCode == "120000") {
								var senderCode = provinceLocal[findIndex].code
								var senderName = provinceLocal[findIndex].name;
								uni.navigateTo({
									url: './fleetLocationView?fleetDetail=' + JSON.stringify(that
											.fleetInfo) + '&longitude=' + longitude + '&latitude=' +
										latitude + '&selfCode=' + senderCode
								})
							} else {
								var cities = provinceLocal[findIndex].cities;
								var findCityIndex = cities.findIndex(item => {
									return item.name == city;
								})
								if (findCityIndex > -1) {
									var senderName = cities[findCityIndex].name;
									var senderCode = cities[findCityIndex].code;
									uni.navigateTo({
										url: './fleetLocationView?fleetDetail=' + JSON.stringify(that
												.fleetInfo) + '&longitude=' + longitude +
											'&latitude=' + latitude + '&selfCode' + senderCode
									})
								}
							}
						}
					},
					fail: function(err) {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
					}
				})
			},
			jumpToElegantDemeanour() {
				uni.navigateTo({
					url: './elegantDemeanour?id=' + this.fleetId
				})
			},
			closeFleetMemberHintPopup() {
				this.$refs.feetMemberHintPopup.close();
			},
			share() {
				this.$refs.sharePopup.open();
				this.$forceUpdate();
			},
			// 取消分享
			cancelShare() {
				let that = this;
				that.$refs.sharePopup.close();
				that.$forceUpdate();
			},
			// 分享到微信好友或者朋友圈
			shareEvent(type) {
				var that = this;
				that.$refs.sharePopup.close();
				var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				var api = '';
				var shareUrl = ""
				if(ship.ApiRootUrl.indexOf('test')>-1){
					api = 'test'
					shareUrl = "https://m-test.hyzgapp.com/#/fleetMap?fleetId="
				} else {
					api = 'pord'
					shareUrl = "https://m.hyzgapp.com/#/fleetMap?fleetId="
				}
				// 微信好友
				var fleetInfo = that.fleetInfo;
				let summary = fleetInfo.name + "车队在线监控地图【复制链接到浏览器打开】  链接";
				
				
				uni.getLocation({
					geocode: true,
					success: function(res) {
						console.log(res, '定位地址');
						var longitude = (res.longitude).toFixed(6)
						var latitude = (res.latitude).toFixed(6)
						var shareHref = shareUrl + fleetInfo.id + "&longitude=" + longitude + "&latitude=" + latitude +  '&api=' + api;
						
					
						uni.share({
							provider: "weixin",
							scene: type,
							type: 0,
							href: shareHref,
							// title: that.supplyDetails.startAddr + ' ' + that.supplyDetails.endAddr,
							title: summary,
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
			goMap() {
				var info = this.fleetInfo;
				var platform = uni.getSystemInfoSync().platform
				if (platform == "ios") {
					uni.getLocation({
						type: 'gcj02',
						success: function(res) {
							var longitude = res.longitude;
							var latitude = res.latitude;
							uni.navigateTo({
								url: './fleetLocationView?fleetDetail=' + JSON.stringify(info) + '&longitude=' + longitude + '&latitude=' + latitude
							})
						},
						fail: function(err) {
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
						content: '为了在地图上显示您周边的车队信息，将申请您的定位权限',
						success(res) {
							if (res.confirm) {
								uni.getLocation({
									type: 'gcj02',
									success: function(res) {
										var longitude = res.longitude;
										var latitude = res.latitude;
										uni.navigateTo({
											url: './fleetLocationView?fleetDetail=' + JSON.stringify(info) + '&longitude=' + longitude + '&latitude=' + latitude
										})
									},
									fail: function(err) {
										uni.showToast({
											title: '请打开定位',
											icon: 'none'
										})
									}
								})
							}
						}
					})
				} else {
					uni.getLocation({
						type: 'gcj02',
						success: function(res) {
							var longitude = res.longitude;
							var latitude = res.latitude;
							uni.navigateTo({
								url: './fleetLocationView?fleetDetail=' + JSON.stringify(info) + '&longitude=' + longitude + '&latitude=' + latitude
							})
						},
						fail: function(err) {
							uni.showToast({
								title: '请打开定位',
								icon: 'none'
							})
						}
					})
				}
				
			},
			showSelectPopup(flag) { // 打开筛选弹窗
				this.popupDetails = flag;
				this.$refs.sourceSelectPopup.open();
			},
			getProvince() { // 从本地缓存获取省市区数据，本地缓存没有则从接口获取，再存入缓存
				var provinceLocal = uni.getStorageSync("regionData");
				if(provinceLocal) {
					this.provinceArr = provinceLocal;
					// this.pushDiyCityItem(this.provinceArr[0].name, this.provinceArr[0].code, 0);
				}else {
					let that = this;
					ship.postRequest('/ts/nationDict/getBasicData')
					.then(res => {
						if (res.retCode == "0000000") {
							var provinceArr = res.rspBody;
							that.provinceArr = provinceArr;
							// that.pushDiyCityItem(provinceArr[0].name, provinceArr[0].code, 0);
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
			pushDiyCityItem(provinceName, provinceCode, index, flag) { // 根据传入的省或市code判断塞入 全市/全省
				var cities = this.provinceArr[index].cities;
				if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
					var coties = [{
						name: provinceName,
						showName: '全市',
						code: provinceCode
					}, ...cities]
				} else {
					var coties = [{
						name: provinceName,
						showName: '全省',
						code: provinceCode
					}, ...cities]
				}
				switch(flag) {
					case 1:
						this.cityArr = coties;
						break;
					case 3:
						this.startCityArr = coties;
						break;
					case 4:
						this.endCityArr = coties;
						break;
					default:
						this.cityArr = coties;
						this.startCityArr = coties;
						this.endCityArr = coties;
				}
			},
			switchProIndex(index) { // 选择省
				if (index == this.selectedProvinceIndex) return;
				this.selectedProvinceIndex = index;
				this.selectedCityIndex = -1;
				//切换城市
				this.popupCityParams = {
					code: this.provinceArr[index].code,
					name: this.provinceArr[index].name,
				}
				this.pushDiyCityItem(this.provinceArr[index].name, this.provinceArr[index].code, index, this.popupDetails);
			},
			switchCityIndex(index) { // 选择市
				this.selectedCityIndex = index;
				console.log(this.cityArr[index]);
				this.popupCityParams = {
					code: this.cityArr[index].code,
					name: this.cityArr[index].name,
				}
			},
			switchStartProIndex(index) { // 选择省
				if (index == this.selectedStartProvinceIndex) return;
				this.selectedStartProvinceIndex = index;
				this.selectedStartCityIndex = -1;
				//切换城市
				this.popupStartCityParams = {
					code: this.provinceArr[index].code,
					name: this.provinceArr[index].name,
				}
				this.pushDiyCityItem(this.provinceArr[index].name, this.provinceArr[index].code, index, this.popupDetails);
			},
			switchStartCityIndex(index) { // 选择市
				this.selectedStartCityIndex = index;
				console.log(this.startCityArr[index]);
				this.popupStartCityParams = {
					code: this.startCityArr[index].code,
					name: this.startCityArr[index].name,
				}
			},
			switchEndProIndex(index) { // 选择省
				if (index == this.selectedEndProvinceIndex) return;
				this.selectedEndProvinceIndex = index;
				this.selectedEndCityIndex = -1;
				//切换城市
				this.popupEndCityParams = {
					code: this.provinceArr[index].code,
					name: this.provinceArr[index].name,
				}
				this.pushDiyCityItem(this.provinceArr[index].name, this.provinceArr[index].code, index, this.popupDetails);
			},
			switchEndCityIndex(index) { // 选择市
				this.selectedEndCityIndex = index;
				console.log(this.endCityArr[index]);
				this.popupEndCityParams = {
					code: this.endCityArr[index].code,
					name: this.endCityArr[index].name,
				}
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
				var platform = uni.getSystemInfoSync().platform;
				if (platform == "ios") {
					uni.navigateTo({
						url: './map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + item.isContact
					})
					return;
				}
				if (plus.navigator.checkPermission('android.permission.ACCESS_FINE_LOCATION') === 'undetermined') {
					uni.showModal({
						title: '提示',
						content: '将获取您的定位权限以展示轨迹',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: './map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + item.isContact
								})
							}
						}
					})
				} else {
					uni.navigateTo({
						url: './map?index=0&dateTime=' + dateTime + '&endTime=' + endTime + '&selectedMapItem=' + JSON.stringify(item) + '&isFee=' + item.isContact
					})
				}
			
			
			},
			showName(item) {
				var that = this;
				var userName = item.userName;
				var userCode = item.userCode;
				if (userName) {
					if (item.isOwner && that.fleetInfo.fleetAttributes == '平台') {
						return '货运中国'
					} else if (that.fleetInfo.isAdmin || that.fleetInfo.isOwner) {
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
				return utilsData.findBeidouDateDesc(locationDate)
			},
			openRspMsgPopup(msg) {
				this.rspMsg = msg;
				this.$refs.mainRspMsgPopup.open();
				setTimeout(()=>{
					this.$refs.mainRspMsgPopup.close();
				},3000)
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
			jumpToDriverDetails(id, checkStatus, showPriceSensitivity) { // 跳转司机详情
				uni.navigateTo({
					url: '/pages/goodsDelivery/driverDetails/driverDetails?id=' + id + '&encryption=' + checkStatus + '&showPriceSensitivity=' + showPriceSensitivity
				})
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
			closeNoNumPopup() { // 关闭充值弹窗
				this.$refs.noSourceNumPopup.close();
				this.$refs.noSourceNumPopupFleet.close();
			},
			createTimeStr(dateTimeArray,dateTime){
				let timeStr = dateTimeArray[0][dateTime[0]]+'-'+dateTimeArray[1][dateTime[1]]+'-'+dateTimeArray[2][dateTime[2]]+' '+dateTimeArray[3][dateTime[3]]+":"+dateTimeArray[4][dateTime[4]];
				console.log(timeStr)
				return timeStr
			},
			// makePhoneCall(item) {
			// 	if (!ship.btnRepeat()) return;
				
			// 	uni.makePhoneCall({
			// 		phoneNumber: item.displayMobile ? item.displayMobile : item.mobile //仅为示例
			// 	});
			// 	publicData.addBuried("超级车队拨打电话")
				
			// },
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
			toResetSelectData() { // 重置选择的省市区
				this.selectedProvinceIndex = -1;
				this.selectedCityIndex = -1;
				this.cityArr = [];
				this.popupCityParams = {};
				this.selectedStartProvinceIndex = -1;
				this.selectedStartCityIndex = -1;
				this.startCityArr = [];
				this.popupStartCityParams = {};
				this.selectedEndProvinceIndex = -1;
				this.selectedEndCityIndex = -1;
				this.endCityArr = [];
				this.popupEndCityParams = {};
			},
			toSelectSouce() { // 保存省市区数据
				if(this.selectedProvinceIndex == -1 && this.selectedCityIndex == -1) {
					this.selectCityParams = {};
				}else if(this.selectedProvinceIndex != -1 && this.selectedCityIndex == -1) {
					this.selectedCityIndex = 0;
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
				// if(this.selectedCityIndex == -1) {
				// 	this.selectCityParams = {};
				// }else {
				// 	let name = this.getSelectCityName(this.cityArr[this.selectedCityIndex], this.cityArr[this.selectedCityIndex].code);
				// 	this.selectCityParams = {
				// 		code: this.cityArr[this.selectedCityIndex].code,
				// 		name: name,
				// 	}
				// }
				if(this.selectedStartProvinceIndex == -1 && this.selectedStartCityIndex == -1) {
					this.selectStartCityParams = {};
				}else if(this.selectedStartProvinceIndex != -1 && this.selectedStartCityIndex == -1) {
					this.selectedStartCityIndex = 0;
					this.selectStartCityParams = {
						code: this.provinceArr[this.selectedStartProvinceIndex].code,
						name: this.provinceArr[this.selectedStartProvinceIndex].name,
					}
				}else {
					this.selectStartCityParams = {
						code: this.startCityArr[this.selectedStartCityIndex].code,
						name: this.startCityArr[this.selectedStartCityIndex].name,
					}
				}
				// if(this.selectedStartCityIndex == -1) {
				// 	this.selectStartCityParams = {};
				// }else {
				// 	let name = this.getSelectCityName(this.startCityArr[this.selectedStartCityIndex], this.startCityArr[this.selectedStartCityIndex].code);
				// 	this.selectStartCityParams = {
				// 		code: this.startCityArr[this.selectedStartCityIndex].code,
				// 		name: name,
				// 	}
				// }
				if(this.selectedEndProvinceIndex == -1 && this.selectedEndCityIndex == -1) {
					this.selectEndCityParams = {};
				}else if(this.selectedEndProvinceIndex != -1 && this.selectedEndCityIndex == -1) {
					this.selectedEndCityIndex = 0;
					this.selectEndCityParams = {
						code: this.provinceArr[this.selectedEndProvinceIndex].code,
						name: this.provinceArr[this.selectedEndProvinceIndex].name,
					}
				}else {
					this.selectEndCityParams = {
						code: this.endCityArr[this.selectedEndCityIndex].code,
						name: this.endCityArr[this.selectedEndCityIndex].name,
					}
				}
				// if(this.selectedEndCityIndex == -1) {
				// 	this.selectEndCityParams = {};
				// }else {
				// 	let name = this.getSelectCityName(this.endCityArr[this.selectedEndCityIndex], this.endCityArr[this.selectedEndCityIndex].code);
				// 	this.selectEndCityParams = {
				// 		code: this.endCityArr[this.selectedEndCityIndex].code,
				// 		name: name,
				// 	}
				// }
				console.log('地区', this.selectCityParams);
				console.log('常跑始发', this.selectStartCityParams);
				console.log('常跑目的', this.selectEndCityParams);
				this.noData = false;
				this.noMore = false;
				this.isLoading = false;
				this.pageNum = 1;
				this.carSourceList = [];
				this.selectUserIdInfo = [];
				if(this.selectedStartCityIndex == -1 && this.selectedEndCityIndex == -1) {
					this.getMemberListInfo();
					this.$refs.sourceSelectPopup.close();
				}else {
					this.getSelectUserId();
				}
			},
			getSelectUserId() { // 如果有常发地址则需先根据常发地址获取userid集合
				let params = {
					sender: this.selectStartCityParams.name ? this.selectStartCityParams.name : undefined,
					senderCode: this.selectStartCityParams.code ? this.selectStartCityParams.code : undefined,
					receiver: this.selectEndCityParams.name ? this.selectEndCityParams.name : undefined,
					receiverCode: this.selectEndCityParams.code ? this.selectEndCityParams.code : undefined,
					fleetId: this.fleetInfo.id,
					source: 2,
					pageNum: 1,
					pageSize: 10,
				}
				console.log('获取userId参数', params);
				let that = this;
				ship.postRequest('/olnanas/recommend/getCarSourceBySender', params)
				.then(function (res) {
					that.$refs.sourceSelectPopup.close();
					console.log('获取userId结果', res);
					if(res.retCode == '0000000'){
						var carSourceVOS = res.rspBody.carSourceVOS;
						if(carSourceVOS && carSourceVOS.length > 0) {
							carSourceVOS.forEach(item => {
								that.selectUserIdInfo.push(item.userId)
							})
							that.getMemberListInfo();
						}else {
							that.noData = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					that.$refs.sourceSelectPopup.close();
					console.log(res.retDesc);
				})
			},
			getSelectCityName(obj, code) { // 修改选择的直辖市
				switch (code) {
					case '310000':
						return '上海市';
					case '110000':
						return '北京市';
					case '500000':
						return '重庆市';
					case '120000':
						return '天津市';
					default:
						return obj.name;
				}
			},
			getMemberListInfo() {
				if(this.isLoading) return;
				this.isLoading = true;
			    let params = {
			        "pageNum": this.pageNum,
			        "pageSize": this.pageSize,
			        "status": 1,
			        "fleetId": this.fleetInfo.id,
					"userIdList" : this.selectUserIdInfo && this.selectUserIdInfo.length > 0 ? this.selectUserIdInfo : undefined,
					"provinceName": this.selectedCityIndex == 0 && this.selectCityParams.name ? this.selectCityParams.name : undefined,
					"cityName": this.selectedCityIndex > 0 && this.selectCityParams.name ? this.selectCityParams.name : undefined,
					// "userId": this.userInfo.userId
					"commonUserCode": this.userInfo.attrs.userCode,
			    }
			    let that = this
				console.log('成员列表查询参数', params);
				ship.postRequest('/cd/fleetWithUser/list', params)
				.then(function (res) {
					// console.log('单次充值结果', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							that.carSourceList = [...that.carSourceList, ...items];
						}else {
							if(that.carSourceList.length == 0) {
								that.noData = true;
							}else {
								that.noMore = true;
							}
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
					console.log(res.retDesc);
				})
			},
			showSearchAddr(str) {
				return str.substr(0, 3);
			},
			toCallUser(item, index) { // 联系TA
				if(item.isContact == 1 || this.fleetInfo.isOwner) {
					this.checkCallPermissions(item, index);
				}else {
					uni.showLoading();
					let params = {
						fleetId: this.fleetInfo.id,
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
								that.carSourceList[index].isContact = 1;
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
					uni.showModal({
						title: '提示',
						content: '将获取您的电话权限以拨打电话',
						success: function(res) {
							if (res.confirm) {
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
							}
						}
					})
					
				}else {
					this.makePhoneCall(1, item, index);
				}
			},
			makePhoneCall(result, item, index) {
				let that = this;
				console.log('触发');
				if(result == 1) {
					
					uni.showModal({
						title:'提示',
						content: '申请获取您的电话权限，用于联系车队管理员审核使您快速加入车队',
						success: function(res) {
							if (res.confirm) {
								uni.makePhoneCall({
								    phoneNumber: item.mobile //仅为示例
								});
								let callMsg = that.fleetInfo.ext3 == "SUPER_FLEET" ? '超级车队拨打司机电话' : '车队拨打司机电话';
								publicData.addBuried(callMsg)
							}
						}
					})
				}else {
					uni.showToast({
						title: '请开启拨号权限',
						icon: 'none'
					})
				}
			},
			getRemainingPoint() { // 消费次数失败则获取消费次数并打开弹窗
				let params = {
					"usersid": this.fleetInfo.userId,
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
			checkCollectNum(item, index) { // 检查消费次数
				if(item.isContact == 1 || this.fleetInfo.isOwner) {
					this.checkFleetNumPopup(item, index);
				}else {
					uni.showLoading();
					let params = {
						fleetId: this.fleetInfo.id,
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
								that.carSourceList[index].isContact = 1;
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
					"usersid": this.fleetInfo.userId,
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
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F4F4F4;
	}
	.newFleetDetails{
		padding-bottom: 20rpx;

		.fleet-img-box{
			position: relative;
			.fleet-img-head{
				position: absolute;
				top: 100rpx;
				left: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 9;
				width: 62rpx;
				height: 62rpx;
				.fleet-back{
					width: 40rpx;
				}
			}
			.setting {
				width: 36rpx;
				height: 36rpx;
			}
			.fleet-num-box{
				position: absolute;
				top: 100rpx;
				right: 40rpx;
				display: flex;
				align-items: center;
				z-index: 9;
				padding: 0 8rpx 0 4rpx;
				box-sizing: border-box;
				width: 208rpx;
				height: 62rpx;
				.fleet-num-img{
					width: 52rpx;
					height: 52rpx;
					margin-right: 6rpx;
					flex-shrink: 0;
				}
				.fleet-num-msg {
					flex:1;
					font-size: 20rpx;
					color: #FFFFFF;
				}
			}
			.fleet-img{
				width: 750rpx;
				height: 350rpx;
			}
		}
		.fleet-info-all{
			.fleet-info-box{
				padding: 0 28rpx 32rpx 28rpx;
				background-color: #fff;
				border-top-left-radius: 16rpx;
				border-top-right-radius: 16rpx;
				.info-head{
					display: flex;
					justify-content: space-between;
					.info-img-box{
						width: 128rpx;
						height: 128rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-top: -44rpx;
						background-color: #fff;
						position: relative;
						z-index: 99;
						border-radius: 20rpx;
						flex-shrink: 0;
						.info-img{
							width: 120rpx;
							height: 120rpx;
							border-radius: 20rpx;
						}
					}
					.fans-box{
						flex:1;
						margin-left: 40rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.otherBtnGroup {
							display: flex;
							align-items: center;
							.fansOnFocus {
								width: 120rpx;
								height: 52rpx;
								line-height: 52rpx;
								background-color: #EF5757;
								text-align: center;
								font-size: 28rpx;
								font-weight: 500;
								color: #FFFFFF;
							}
							.fansHasFocus {
								width: 120rpx;
								height: 52rpx;
								line-height: 52rpx;
								background-color: #C2C2C2;
								text-align: center;
								font-size: 28rpx;
								font-weight: 500;
								color: #FFFFFF;
							}
							.fansCall {
								width: 120rpx;
								height: 52rpx;
								line-height: 52rpx;
								background-color: #3A96FC;
								text-align: center;
								font-size: 28rpx;
								font-weight: 500;
								color: #FFFFFF;
								margin-left: 32rpx;
							}
						}
						.fansMsg {
							padding: 12rpx 36rpx;
							color: #777;
							display: flex;
							flex-direction: column;
							align-items: center;
							.fansTitle {
								font-size: 26rpx;
								color: #666666;
								line-height: 30rpx;
							}
							.fans-box-num{
								font-size: 36rpx;
								color: #333;	
								font-weight: bold;
								margin-top: 10rpx;
							}
						}
					}
				}
				.info-head-box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 2rpx solid #E6E6E6;
					margin-top: 20rpx;
					padding-bottom: 12rpx;
					.fleet-box{
						flex: 1;
						.info-name{
							font-size: 44rpx;
							font-weight: 600;
							color: #333;
							line-height: 62rpx;
						}
						.info-content{
							color: #777;
							font-size: 24rpx;
							display: flex;
							align-items: center;
							margin-top: 2rpx;
							padding-bottom: 24rpx;
							justify-content: space-between;
							.info-content-child{
								display: flex;
								align-items: center;
								.info-num{
									padding-right: 40rpx;
								}
							}
						}
					}
					.qrBox {
						margin-right: 32rpx;
						flex-shrink: 0;
						display: flex;
					}
					.info-content-qrCode{
						width: 44rpx;
						height: 48rpx;
						display: block;
						margin: 0 auto;
					}
					.info-content-qrCode2{
						width: 60rpx;
						height: 48rpx;
						display: block;
						margin: 0 auto 0 auto;
					}
				}
				.content-box{
					padding-top: 24rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					color: #333;
					.content-child + .content-child {
						margin-top: 12rpx;
					}
					.content-child{
						display: flex;
						.contentTitle, .contentMsg {
							font-size: 28rpx;
							color: #333;
						}
						.contentTitle {
							flex-shrink: 0;
							font-size: 28rpx;
							color: #333;
							font-weight: 500;
							line-height: 33rpx;
						}
						.contentMsg {
							flex: 1;
							font-size: 24rpx;
							color: #333;
							line-height: 33rpx;
						}
						.hiddenMsg {
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
					.pack-up{
						display: flex;
						justify-content: flex-end;
						margin-top: 20rpx;
						.pack-up-child{
							color: #0171F9;
						}
					}
				}
				.operation-box{
					display: flex;
					margin-top: 32rpx;
					.operation-child{
						display: flex;
						align-items: flex-end;
						margin-right: 46rpx;
						font-size: 28rpx;
						color: #333;
						.operation-img-box{
							width: 72rpx;
							height: 72rpx;
							background-color: #F3F3F3;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 12rpx;
							.operation-img{
								width: 40rpx;
								height: 40rpx;
							}
						}
					}
				}
				.btn-box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 40rpx;
					.btn-child{
						width: 306rpx;
						height: 72rpx;
						text-align: center;
						line-height: 72rpx;
						color: #0171F9;
						border-radius: 8px;
						font-size: 28rpx;
						font-weight: 500;
						border: 2rpx solid #0171F9;
					}
				}
			}
			// 626 - 430 = 196
			.operationScrollBox {
				margin: 20rpx 34rpx 32rpx 34rpx;
				background: #FFFFFF;
				box-shadow: 0px 0px 18rpx 2rpx rgba(170,170,170,0.19);
				border-radius: 16rpx;
				padding: 68rpx 0 10rpx 0;
				display: flex;
				flex-wrap: wrap;
				.operationBtns {
					flex-shrink: 0;
					flex: 0 0 20%;
					display:flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin-bottom: 48rpx;
					.btnIcon {
						width: 56rpx;
						height: 56rpx;
					}
					.btnMsg {
						margin-top:4rpx;
						font-size: 24rpx;
						color: #000;
					}
				}
			}
			.member-head{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 34rpx;
				.fleetMemberNum {
					font-size: 40rpx;
					font-weight: 500;
					color: #333333;
					line-height: 40rpx;
				}
				.member-num{
					&.colorHide {
						color: #777777;
					}
					&.picTitle {
						border-bottom: 4rpx solid #FF9F21;
					}
				}
				.member-operation{
					display: flex;
					align-items: center;
					color: #333;
					font-size: 26rpx;
					.member-operation-child{
						display: flex;
						align-items: center;
						.member-operation-img{
							width: 32rpx;
							height: 32rpx;
							margin-right: 4rpx;
						}
						.member-operation-img1{
							width: 34rpx;
							height: 44rpx;
							margin-right: 10rpx;
						}
						.member-operation-child-msg {
							font-size: 28rpx;
							color: #333333;
						}
					}
					.spacing{
						margin-right: 56rpx;
					}
				}
			}
		}
		.member-box{
			// background-color: #fff;
			padding: 0 24rpx;
			.result-box{
				background-color: #fff;
				color: #333333;
				&.tabs {
					padding: 0 10rpx;
				}
				.request-loading-view {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 0;
					transition: all .2s ease;
					overflow: hidden;
					&.active {
						height: 80rpx;
					}
				}
				.loading-text {
					font-size: 24rpx;
					color: #333333;
					margin-left: 10rpx;
				}
				.loading-view {
					margin: 10rpx;
					border-radius: 20upx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				
				/* 动画样式 */
				.loading {
					border: 5upx solid rgba(0, 0, 0, 0.01);
					border-radius: 50%;
					border-top: 5upx solid #ccc;
					border-right: 5upx solid #ccc;
					border-bottom: 5upx solid #ccc;
					width: 30upx;
					height: 30upx;
					-webkit-animation: spin 1.4s linear infinite;
					animation: spin 1.4s linear infinite;
				}
				
				@-webkit-keyframes spin {
					0% {
						-webkit-transform: rotate(0deg);
					}
				
					100% {
						-webkit-transform: rotate(360deg);
					}
				}
				
				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
				
					100% {
						transform: rotate(360deg);
					}
				}
				.no-data{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.noDataImg {
						width: 200rpx;
						height: 200rpx;
					}
					.noDataText {
						padding-top: 20rpx;
						font-size: 28rpx;
						color: #666666;
					}
				}
				.member-child + .member-child {
					margin-top: 20rpx;
				}
				.member-child{
					display: flex;
					align-items: center;
					justify-content: space-between;
					// border-bottom: 2rpx solid #F2F2F2;
					box-sizing: border-box;
					padding: 22rpx 60rpx 24rpx 36rpx;
					height: 150rpx;
					border-radius: 12rpx;
					background-color: #FFF;
					box-shadow: 0px 0px 18rpx 2rpx rgba(117, 117, 117, 0.09);
					.opt {
						display: flex;
						flex-direction: column;
						justify-content: flex-end;
						align-items: flex-end;
						flex-shrink: 0;
						margin-left: 0;
						.opt-item {
							display: flex;
							flex-direction: row;
							.newOutItemBtn + .newOutItemBtn {
								margin-left: 46rpx;
							}
							.newOutItemBtn:first-child {
								margin-left: 0;
							}
							.newOutItemBtn {
								.btnImage {
									display: block;
									width: 48rpx;
									height: 48rpx;
									margin: 0 auto 4rpx auto;
								}
								.btnMsg {
									font-size: 20rpx;
									color: #666666;
									line-height: 23rpx;
									text-align: center;
								}
							}
						}
						
					}
					.user-info{
						flex: 1;
						.member-user{
							display: flex;
							align-items: center;
							color: #777;
							font-size: 28rpx;
							.user-name{
								font-weight: 600;
								font-size: 30rpx;
								color: #333;
								line-height: 44rpx;
								// width: 140rpx;
								// overflow: hidden;
								// text-overflow:ellipsis;
								// white-space: nowrap;
							}
							.user-role {
								line-height: 28rpx;
								font-size: 20rpx;
								color: #666666;
							}
							.member-phone{
								width: 36rpx;
								height: 36rpx;
								margin: 0 32rpx;
							}
							.user-address{
								width: 120rpx;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
							.user-address1{
								width: 120rpx;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
						}
						.memberAddress {
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: center;
							max-width: 280rpx;
							margin: 2rpx 0 0 0;
							.beidou_icon {
								width: 24rpx;
								height: 24rpx;
								line-height: 28rpx;
								margin-right: 10rpx;
							}
							.beidou_no_icon {
								width: 32rpx;
								height: 32rpx;
								line-height: 28rpx;
								margin-right: 10rpx;
							}
							.addr_text {
								flex: 1;
								line-height: 28rpx;
								font-size: 20rpx;
								color: #666666;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
						}
						.member-driver{
							display: flex;
							align-items: center;
							color: #333;
							font-size: 28rpx;
							font-weight: 500;
							margin: 10rpx 0 0 0;
							.member-car{
								margin-right: 18rpx;
							}
						}
						.status {
							height: 28rpx;
							line-height: 28rpx;
							display: flex;
							align-items: center;
							color: #5ECA7F;
							font-size: 20rpx;
							margin-left: 20rpx;
							&.active {
								color: #E2633B;
							}
							.dotted {
								width: 14rpx;
								height: 14rpx;
								border-radius: 100%;
								background-color: #5ECA7F;
								margin-right: 6rpx;
								&.active {
									background-color: #E2633B;
								}
							}
						}
					}
					.member-location{
						width: 137rpx;
						height: 64rpx;
						border-radius: 8rpx;
						border: 2rpx solid #333;
						color: #333;
						font-size: 26rpx;
						text-align: center;
						line-height: 64rpx;
						&:last-child {
							margin-left: 24rpx;
						}
					}
				}
			}
			.img-tabs {
				display: flex;
				flex-wrap: wrap;
				.img-tab-item {
					width: 224rpx;
					height: 280rpx;
					margin-right: 14rpx;
					margin-bottom: 14rpx;
					&:nth-child(3n+3) {
						margin-right: 0;
					}
				}
				.fleetImg {
					width: 224rpx;
					height: 280rpx;
				}
			}
			.visitors-box{
				display: flex;
				align-items: center;
				padding: 24rpx 16rpx;
				border-bottom: 2rpx solid #F2F2F2;
				color: #777;
				font-size: 28rpx;
				.user-name{
					width: 114rpx;
					font-size: 32rpx;
					color: #333;
					font-weight: 500;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.user-role {
					line-height: 28rpx;
					font-size: 20rpx;
					color: #666666;
				}
				.user-car{
					width: 184rpx;
				}
				.car-model{
					width: 190rpx;
				}
				.user-location{
					width: 182rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
		}
		.selectBtnGroup {
			padding: 16rpx 36rpx 0 36rpx;
			display: flex;
			align-items: center;
			.searchMsgBox + .searchMsgBox {
				margin-left: 18rpx;
			}
			.searchMsgBox {
				flex: 0 0 214rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 8rpx 18rpx 8rpx 18rpx;
				height: 50rpx;
				background: #FFFFFF;
				border-radius: 46rpx;
				.msg {
					font-size: 24rpx;
					font-weight: 500;
					color: #3489E9;
					line-height: 34rpx;
					margin-right: 12rpx;
					max-width: 142rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
				}
				.selectIcon {
					width: 24rpx;
					height: 12rpx;
				}
			}
		}
		.box_big {
			width: 750rpx;
			height: 754rpx;
			border-radius: 16rpx 16rpx 0 0;
			background: #FFFFFF;
			.vehicle_infor {
				background: #FFFFFF;
				border-radius: 16rpx;
				background: #FFFFFF;
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
			}
			.title {
				padding: 68rpx 52rpx 0 50rpx;
			}
			
			.vehicle_box {
				padding-top: 88rpx;
				padding-left: 74rpx;
			}
			.vehicle_content {
				padding-bottom: 38rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}
			.left {
				width: 180rpx;
				font-size: 36rpx;
				color: #333333;
				display: flex;
				justify-content: flex-end;
				padding-right: 10rpx;
			}
			.asterisk {
				color: #F35944;
			}
			.right {
				font-size: 32rpx;
				color: #666666;
			}
			.input {
				width: 416rpx;
				height: 60rpx;
				background: #FFFFFF;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				opacity: 1;
				border: 1px solid rgba(0, 0, 0, 0.2);
				padding: 0 10rpx;
			}
			.btn_box {
				width: 400rpx;
				height: 80rpx;
				background: #2973FA;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				opacity: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 118rpx 176rpx 124rpx 174rpx;
			}
			.join {		
				font-size: 32rpx;
				font-weight: 600;
				color: #FFFFFF;
			}
		}
		.add_box {
			width: 674rpx;
			height: 384rpx;
			border-radius: 24rpx;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.add_conten {
				height: 384rpx;
				/* margin-top: 64rpx; */
			}
					
			.tips {
				font-size: 40rpx;
				font-weight: 500;
				color: #000000;
				/* letter-spacing: 5rpx; */
				padding-top: 74rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
					
			}
					
			.confirmAdd_box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin: 58rpx 166rpx 0 164rpx;
				width: 344rpx;
				height: 72rpx;
				background: #2973FA;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
			}
					
			.confirmAdd {
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
		.sourceSelectBox {
			background-color: #FFF;
			padding:100rpx 0 66rpx 0;
			border-bottom-left-radius: 24rpx;
			border-bottom-right-radius: 24rpx;
			.selectHead {
				padding: 36rpx 34rpx;
				border-bottom: 2rpx solid #EAEAEA;
				display: flex;
				align-items: center;
				.selectBox + .selectBox {
					margin-left: 40rpx;
				}
				.selectBox {
					display: flex;
					align-items: center;
					.msg {
						font-size: 36rpx;
						font-weight: 500;
						line-height: 42rpx;
						margin-right: 8rpx;
						max-width: 180rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
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
			.selectBody {
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
		.car_source_item {
			margin: 24rpx 34rpx 0 34rpx;
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
				.tags{
					width: 137rpx;
					font-size: 20rpx;
					color: #333333;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					image{
						width: 29rpx;
						height: 27rpx;
						// vertical-align: top;
					}
                              
            	}
		
			}
		
			.right_content {
				padding-top: 18rpx;
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
			font-size:32rpx;
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
		}
		.popup-content {
			position: fixed;
			bottom: 30rpx;
			left: 24rpx;
			right: 24rpx;
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
			}
			.popup-child {
				margin-right: 70rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.popup-child-text {
				font-size: 22rpx;
				color: #333;
			}
			.popup-img {
				width: 88rpx;
				height: 88rpx;
				margin-bottom: 14rpx;
			}
			.cancel-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 90rpx;
			}
			.cancel-btn-text {
				color: #777;
				font-size: 32rpx;
			}
		}
		.fleetAddMsgPopUp {
			background-color: #FFFFFF;
			width: 630rpx;
			height: 384rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			padding: 62rpx 50rpx 60rpx;
			box-sizing: border-box;
			border-radius: 24rpx;
			.fleetAddMsg {
				font-size: 40rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 1);
				line-height: 58rpx;
			}
			.fleetAddMsgBtn {
				width: 344rpx;
				height: 72rpx;
				border-radius: 12rpx;
				background-color: rgba(43, 114, 240, 1);
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: 500;
			}
		}
	}
</style>
