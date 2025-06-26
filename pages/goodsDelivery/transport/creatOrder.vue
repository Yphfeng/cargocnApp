<template>
	<view class="creatOrder" :class="confirmPopupShow ? 'scroll-lock' : ''">
		<view class="creatOrderMainBox">
			<view class="orderAddressBox">
				<view class="addressModel">
					<view class="addressType" style="background-color: #4AA2F3;">装</view>
					<view class="addressDetails">
						<view class="addressMsgHint" v-if="!startAddress1.address" @tap="jumpToNewAddress(1, 1)">请添加装货详细地址</view>
						<view class="addressContent" v-if="startAddress1.address" @tap="jumpToNewAddress(1, 1)">
							<!-- <view class="contentProvince">{{startAddress1.province}}-{{startAddress1.city}}-{{startAddress1.area}}</view> -->
							<view class="contentProvince">{{showAddressMsg(startAddress1, 'name')}}</view>
							<view class="contentDetail">{{showAddressMsg(startAddress1, 'area')}} {{startAddress1.address}}</view>
						</view>
						<view class="addAddressBox" @tap="jumpToNewAddress(1, 1)" v-show="!showLoadGoods2">
							<image class="aListIcon" src="../../../static/images/goodsDelivery/addressListIcon.png"></image>
						</view>
					</view>
				</view>
				<view class="addressModel" style="border-top:2rpx solid #F2F3F3">
					<view class="addressType" style="background-color: #F29347;">卸</view>
					<view class="addressDetails">
						<view class="addressMsgHint" v-if="!endAddress1.address" @tap="jumpToNewAddress(3, 2)">请添加卸货详细地址</view>
						<view class="addressContent" v-if="endAddress1.address" @tap="jumpToNewAddress(3, 2)">
							<!-- <view class="contentProvince">{{endAddress1.province}}-{{endAddress1.city}}-{{endAddress1.area}}</view> -->
							<view class="contentProvince">{{showAddressMsg(endAddress1, 'name')}}</view>
							<view class="contentDetail">{{showAddressMsg(endAddress1, 'area')}} {{endAddress1.address}}</view>
						</view>
						<view class="addAddressBox" @tap="jumpToNewAddress(3, 2)" v-show="!showUnloadGoods2">
							<image class="aListIcon" src="../../../static/images/goodsDelivery/addressListIcon.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="orderMsgInputBox">
			<view class="inputBox" v-for="(item, index) in allGoodsDetails">
				<view class="leftTitle">货物信息{{index>0?'(' + (index + 1) + ')':''}}
					<text class="titleHint" v-if="index==0">*</text>
					<view class="leftAdd" v-if="index==0" @click="addEvent">添加</view>
					<view class="leftRemove" v-else @click="removeEvent(index)">删除</view>
				</view>
				<view class="goodsContent" @tap="jumpToGoodsDetails(index)">
					<view class="goodsMsg" :style="item.goodsText ? 'color:#333;' : 'color:#C2C2C9;'">{{item.goodsText ? item.goodsText : '请填写'}}</view>
					<image class="arrowIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
			
			<view class="inputBox" style="border-top:2rpx solid rgba(151, 151, 151, 0.16);">
				<view class="leftTitle">回单</view>
				<view class="rightContent" style="display: flex;justify-content:flex-end; align-items: center;">
					<view class="priceSybBtn" :class="needReceipt ? 'priceSybBtnChecked' : 'priceSybBtnDefault'" @click="needReceipt = true">需要</view>
					<view class="priceSybBtn" :class="needReceipt ? 'priceSybBtnDefault': 'priceSybBtnChecked'" @click="needReceipt = false">不需要</view>
				</view>
			</view>
			<view class="inputBox" @tap="goSelectUser(1)">
				<view class="leftTitle">上游托运人</view>
				<view class="goodsContent">
					<view class="goodsMsg" style="color:#333;" v-if="shippingUser.userName">{{shippingUser.userName}}</view>
					<view class="goodsMsg" style="color:#C2C2C9;" v-if="!shippingUser.userName">请填写</view>
					<image class="arrowIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
			<view class="inputBox" @tap="goSelectUser(2)">
				<view class="leftTitle">下游承运人</view>
				<view class="goodsContent">
					<view class="goodsMsg" style="color:#333;" v-if="carrierUser.userName">{{carrierUser.userName}}</view>
					<view class="goodsMsg" style="color:#C2C2C9;" v-if="!carrierUser.userName">请填写</view>
					<image class="arrowIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
			<view class="inputBox">
				<view class="leftTitle">原始货物单号</view>
				<view class="goodsContent">
					<!-- <view class="goodsMsg" style="color:#333;" v-if="originalNumber">{{originalNumber}}</view> -->
					<input class="goodsMsgNum" maxlength="20" type="text" v-model="originalNumber" placeholder="请填写" />
					<!-- <view class="goodsMsg" style="color:#C2C2C9;" v-if="!originalNumber">请填写</view> -->
					<image class="arrowIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
			<view class="inputBox" @tap="goCostInfo()">
				<view class="leftTitle">费用信息</view>
				<view class="goodsContent">
					<view class="goodsMsg" style="color:#333;" v-if="costInformationMsg">{{costInformationMsg}}</view>
					<view class="goodsMsg" style="color:#C2C2C9;" v-if="!costInformationMsg">请填写</view>
					<image class="arrowIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
				</view>
			</view>
			<view class="inputBox">
				<textarea class="textareaBox" maxlength="15" v-model="remake" placeholder="备注请输入15字以内" placeholder-style="placeholderStyle" />
			</view>
		</view>
		<!-- <view class="orderRulesBox">
			<view class="rulesMsg">若额外产生等候费/压车费/超吨费等需另外支付</view>
			<view class="confirmAgreement">
				<view v-show="!agreementFlag" class="btn" @tap="agreementFlag = !agreementFlag"></view>
				<image v-show="agreementFlag" class="confirmAgreementIcon" src="../../../static/images/goodsDelivery/payCheckedIcon.png" @tap="agreementFlag = !agreementFlag"></image>
				<view class="agreementHint" @tap="agreementFlag = !agreementFlag">我已阅读并同意</view>
				<view class="agreementDetails" @tap="agreementDetails">《货物运输协议》</view>
			</view>
		</view> -->
		<view class="footBtnGroup">
			<!-- <view class="internalBtn" @tap="openConfirmPopup()">指定司机</view> -->
			<view class="externalBtn" @tap="submitOrder()">新建</view>
		</view>
		
		<!-- 弹窗模块 -->
		<!-- 订单信息确认弹出框 -->
		<uni-popup ref="confirmPopup" type="center" :mask-click="false">
			<view class="hintBox">
				<scroll-view class="scrollBox" :style="'height:' + scrollViewHeight + 'rpx;'" scroll-y="true" :show-scrollbar="true">
					<view class="title">请再次核对您的发货信息</view>
					<view class="content">
						<view class="popupAddressModel" v-if="startAddress1.address">
							<view class="addressType" style="background-color: #4AA2F3;">装</view>
							<view class="addressDetails">
								<view class="contentProvince">{{showAddressMsg(startAddress1, 'name')}}</view>
								<view class="contentDetail">{{showAddressMsg(startAddress1, 'area')}} {{startAddress1.address}}</view>
							</view>
						</view>
						<view class="popupAddressModel" v-if="endAddress1.address">
							<view class="addressType" style="background-color: #F29347;">卸</view>
							<view class="addressDetails">
								<view class="contentProvince">{{showAddressMsg(endAddress1, 'name')}}</view>
								<view class="contentDetail">{{showAddressMsg(endAddress1, 'area')}} {{endAddress1.address}}</view>
							</view>
						</view>
						<view class="confirmPopupMsgBox">
							<image class="leftIcon1" src="../../../static/images/goodsDelivery/box01.png"></image>
							<view class="rightMsg">
								<view class="msg" v-for="(item, index) in allGoodsDetails">{{item.goodsText}}</view>
							</view>
						</view>
						<view class="confirmPopupMsgBox" v-if="shippingUser.userId">
							<image class="leftIcon11" src="../../../static/images/goodsDelivery/box11.png"></image>
							<view class="rightMsg">
								<view class="msg">{{shippingUser.userId ? '托运人：' + shippingUser.userName : ''}}</view>
							</view>
						</view>
						<view class="confirmPopupMsgBox" v-if="carrierUser.userId">
							<image class="leftIcon11" src="../../../static/images/goodsDelivery/box11.png"></image>
							<view class="rightMsg">
								<view class="msg">{{carrierUser.userId ? '承运人：' + carrierUser.userName : ''}}</view>
							</view>
						</view>
						<view class="confirmPopupMsgBox" v-if="costInformationMsg">
							<image class="leftIcon9" src="../../../static/images/goodsDelivery/box09.png"></image>
							<view class="rightMsg">
								<view class="msg">{{costInformationMsg}}</view>
							</view>
						</view>
						<view class="confirmPopupMsgBox">
							<image class="leftIcon9" src="../../../static/images/goodsDelivery/box09.png"></image>
							<view class="rightMsg">
								<view class="msg">{{needReceipt ? '需要回单' : '不需要回单'}}</view>
							</view>
						</view>
						<view class="confirmPopupMsgBox" v-if="originalNumber">
							<image class="leftIcon9" src="../../../static/images/goodsDelivery/box09.png"></image>
							<view class="rightMsg">
								<view class="msg">原始货物单号：{{originalNumber}}</view>
							</view>
						</view>
						<view class="confirmPopupMsgBox">
							<image class="leftIcon5" src="../../../static/images/goodsDelivery/box05.png"></image>
							<view class="rightMsg">
								<view class="msg">{{remake ? remake : '无备注'}}</view>
							</view>
						</view>
					
						<view class="instructions">说明：为了更好的保护您的权益，请您再确认前仔细核对您的发货信息，尤其是地址和时效要求。当您与承运司机发生异议纠纷时，平台会参考您的发货信息来确定责任方，届时会扣除责任方保证金。如您核实完成，请选择确定并继续询价。</view>
					</view>
				</scroll-view>	
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @click="closeConfirmPopup()">我要修改信息</view>
					<view class="confirmBtn" @click="submitOrder()">我已经确定</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 是否保存订单信息弹出框 -->
		<uni-popup ref="saveOrderPopup" type="center">
			<view class="saveOrderBox">
				<view class="title">是否保存当前订单信息？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @click="clearOrderData()">取消</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @click="saveOrderData()">保存</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 保证金不足 -->
		<uni-popup ref="notEnoughPrice" type="center">
			<view class="hintPopup">
				<view class="hintTitle">温馨提示</view>
				<view class="hintMsg">
					平台最低保证金为
					<text class="num">{{vosPrice}}</text>
					元，您当前余额为
					<text class="num">{{bksPRice}}</text>
					。余额在运单结束后可提现。
				</view>
				<view class="hintMsg" style="margin-top:32rpx;">您充值到平台履约保证金账户的资金将用于：</view>
				<view class="hintMsg">1.支付技术服务费</view>
				<view class="hintMsg">2.支付货物担保金（可选）</view>
				<view class="hintMsg">3.支付违约金（如发生）</view>
				<view class="btn" @click="jumpToTopUp()">前往充值</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="hopePriceHintPopup" type="center">
			<view class="hintPopup">
				<view class="hintTitle">温馨提示</view>
				<view class="hintMsg" style="min-width: 400rpx;text-align: center;">运费低于市场价，请确认。</view>
				<view class="hintBtnGroup">
					<view class="btn" style="flex: 1;" @click="closeHopePriceHintPopup()">去修改</view>
					<view class="closePopupBtn" style="flex: 1;" @click="toOpenOrderMsgConfirmPopup()">我知道了</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="addAddressPopup" type="center">
			<view class="addressPopupBox">
				<image class="closeIcon" @tap="closeAddressPopup()" src="../../../static/images/goodsDelivery/closeAddressPopup.png"></image>
				<view class="addressTitle">{{searchFlag == 1 ? '添加装货地址' : '添加卸货地址'}}</view>
				<view class="addressBox" @tap="showAddressPopup()">
					<view class="title">地区</view>
					<view class="content" :style="addressArea ? 'color:#333;' : 'color:#CCC;'">{{addressArea ? addressArea : '点击选择'}}</view>
				</view>
				<view class="addressBox">
					<view class="title">详细地址</view>
					<view class="content" style="color:#CCC;" v-if="!addressDetailsMsg && !textareaFocus" @tap="textareaFocus = true">如街道、门牌号、小区、乡镇、村等</view>
					<textarea
						class="contentTextarea"
						v-model="addressDetailsMsg"
						:auto-height="true"
						:focus="textareaFocus"
						v-if="addressDetailsMsg || textareaFocus"
						@blur="textareaBlur"
					/>
					<view class="addressLocationBox" @tap="showLocationPopup()">
						<image class="locationIcon" src="../../../static/images/goodsDelivery/AddressPopupIcon.png"></image>
						<view class="msg">定位</view>
					</view>
				</view>
				<view class="saveAddressBtn" @click="saveAddressMsg()">保存</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="chooseAreaPopup" type="bottom">
			<view class="chooseAreaBox">
				<view class="areaPopupHead">
					<view class="checkedAreaBox">
						<view class="areaList" v-if="chooseAreaPopupData.length == 0">
							<view class="areaMsg checkedArea">全国</view>
							<view class="checkedLine"></view>
						</view>
						<view class="areaList" v-if="chooseAreaPopupData.length > 0" v-for="(item, selectindex) in chooseAreaPopupData" :key="selectindex" @tap="changeSelectFlag(selectindex)">
							<view class="areaMsg" :class="selectAreaFlag == selectindex ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
							<view :class="selectAreaFlag == selectindex ? 'checkedLine' : 'defaultLine'"></view>
						</view>
					</view>
					<image class="closeAreaPopupIcon" @tap="toCloseAreaPopup()" src="../../../static/images/goodsDelivery/closeAreaPopupIcon.png"></image>
				</view>
				<scroll-view :scroll-top="scrollTop" class="areaPopupBody" scroll-y="true" :show-scrollbar="true">
					<view v-if="areaSetp == '0'" class="detailsList" v-for="(item, provinceIndex) in allAreaInfo" :key="provinceIndex" @click="checkProvince(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[0] && chooseAreaPopupData[0].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="../../../static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
					<view v-if="areaSetp == '1'" class="detailsList" v-for="(item, cityIndex) in showCityInfo" :key="cityIndex" @click="checkCity(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[1] && chooseAreaPopupData[1].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="../../../static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
					<view v-if="areaSetp == '2'" class="detailsList" v-for="(item, areaIndex) in showAreaInfo" :key="areaIndex" @click="checkArea(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[2] && chooseAreaPopupData[2].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="../../../static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
		<uni-popup ref="locationPopup" type="center">
			<view class="locationAddressBox">
				<view class="locationPopupHead">
					<image class="locationBackIcon" @tap="toCloseLocationPopup()" src="../../../static/images/goodsDelivery/icon_right.png"></image>
					<view class="locationInputBox">
						<input class="locationInput" v-model="locationSearchVal" type="text" confirm-type="search" @confirm="checkSearchValThenSearch()"/>
						<view class="addressLocationBox" @click="checkSearchValThenSearch()">
							<image class="locationIcon" src="../../../static/images/goodsDelivery/AddressPopupIcon.png"></image>
							<view class="msg">定位</view>
						</view>
					</view>
				</view>
				<scroll-view class="locationScroll" :scroll-y="!searchBoxLoading" :show-scrollbar="true" @scrolltolower="addressOnload">
					<view class="addressSearchList" v-for="(item, index) in searchData" :key="index" @click="chooseAddress(item)" v-show="item.address && item.address.length > 0">
						<view class="listContent">
							<view class="name">{{item.name}}</view>
							<view class="msg">{{item.address}}</view>
						</view>
						<image class="searchComfirmIcon" src="../../../static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
					<view class="loadingBox" v-show="searchNoMoreData">没有更多了~</view>
				</scroll-view>
				<view class="popupLoadingBox" v-if="searchBoxLoading">
					<image class="loadingIcon" src="../../../static/images/goodsDelivery/listLoading.png"></image>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as service from "@/utils/service.js";
	import * as publicData from "@/utils/publicData.js";
	export default {
		data() {
			return {
				confirmPopupShow: false,
				batchNumber: '', // 批次号
				value: '',
				agreementFlag: false,
				showLoadGoods2: false,
				showUnloadGoods2: false,
				
				// 车型车长
				vehicleModel: '',
				vehicleLength: '',
				vehicleNumber: '',
				
				// 货物信息
				goodsTypeVo: [],
				goodsListData: '',
				goodsRemark: '', //货物备注
				
				//装货点、卸货点
				startAddress1: {},
				endAddress1: {},
				
				// 是否需要回单
				needReceipt: false,
				
				// 报价时长
				offerTimeAry: [],
				offerTimeVal: [0],
				checkedTimeVal: {},
				indicatorStyle: 'height:60rpx;',
				
				
				checkedTemperature: '',
				lowTemperature: '',
				highTemperature: '',
				temperatureMonitor: '',
				
				// 支付方式
				payTypeVal: {},
				payTypeData: [],
				checkedPayType: {},
				
				// 信息费
				infoPrice: '',
				
				// 希望价格
				hopePrice: '',
				hopePriceSyb: '趟',
				
				// 担保服务
				declaredValue: '',
				declaredFocus: false,
				servicePrice: 0,
				
				// 平台费率
				techSrvFeeData: [],
				guaranteeRate: '', // 担保费率
				serviceRate: '', // 服务费率
				
				// 保证金/余额
				vosPrice: '',
				bksPRice: '',
				userInfo: {},
				
				fixPrice: '',
				payType: '',
				needInvoiceFlag: '',
				oilRate: '',
				
				showMyTemperatureValMsg: '',
				setGoodsName: '',//合同物品信息
				
				// 装货点相关
				searchFlag: '',
				addressArea: '', // 地区msg
				addressDetailsMsg: '', // 详细地址
				allAreaInfo: [], // 所有省市区
				checkedAreaData: [], // 选中的省市区
				chooseAreaPopupData: [],
				selectAreaFlag: '', // 选中的省、市、区，标签
				showCityInfo: [], // 省市区弹出框展示的市
				showAreaInfo: [], // 省市区弹出框展示的区
				areaSetp: '0',
				textareaFocus: false,
				locationSearchVal: '',
				searchPageNum: 1,
				searchNoMoreData: false,
				searchData: [],
				searchBoxLoading: false,
				saveAddressObj: {},
				scrollViewHeight: '', // 确认信息scrollView高度
				
				// 再来一单
				orderAgain: 0,
				
				
				costInformationMsg: '',
				scrollTop: 0,
				needConfirm: '',
				estimatedDistance: '',
				shippingUser: { // 货源托运人
					userName: '',
					userId: ''
				},
				carrierUser: {// 货源承运人
					userName: '',
					userId: ''
				},
				
				addressDetail: {},
				
				
				allGoodsDetails: [{goodsText: ''}], //零担多个货物信息
				originalNumber: '', //原始货物单号
				remake: '', //备注
				costRecord: [], //自定义费用
				checkGoodsText: '', //核对弹框货物信息
				typeText: 'add',
				cargoArr: [],
			};
		},
		onLoad(options) {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			console.log('用户信息', this.userInfo);
			this.getBatchNumber();
			this.getTechSrvFeeInfo();
			this.orderAgain = options.orderAgain ? options.orderAgain : 0;
			if(userInfo) {
				this.getDefaultLoadAddress();
				this.getDefaultUnLoadAddress();
			}
		
			this.originalNumber = getApp().globalData.pransportGoods.originalNumber;
			this.remake = getApp().globalData.pransportGoods.remake;
			this.typeText = options.type;
			if(this.typeText == 'edit'){
				this.cargoArr = JSON.parse(options.cargo);
				console.log(this.cargoArr);
				this.allGoodsDetails = [];
				getApp().globalData.pransportGoods.allGoodsDetails = [];
				this.needReceipt = getApp().globalData.pransportGoods.needReceipt;
				this.cargoArr.map(val=>{
					this.toGoodsSearch(val);
				})
			}
		},
		onShow() {
			let that = this;
			this.shippingUser = getApp().globalData.pransportGoods.shippingUser.userId?getApp().globalData.pransportGoods.shippingUser:{};
			this.carrierUser = getApp().globalData.pransportGoods.carrierUser.userId?getApp().globalData.pransportGoods.carrierUser:{};
			var allGoodsDetails = getApp().globalData.pransportGoods.allGoodsDetails;
			this.checkGoodsText = '';
			if(allGoodsDetails.length>0){
				allGoodsDetails.map((val, idx)=>{
					let typeName = '';
					if(val.goodsTypeVO && val.goodsTypeVO.length>0){
						val.goodsTypeVO.map(item=>{
							typeName = item.children['0'].children['0'].children['0'].typeName;
							typeName = item.typeName + '-' + typeName;
						})
						if(val.weight){
							typeName = typeName + ',' + val.weight + '吨';
						}
						if(val.volume){
							typeName = typeName + ',' + val.volume + '方';
						}
						if(val.gdNumber){
							typeName = typeName + ',' + val.gdNumber + '件';
						}
						if(val.printNumber){
							typeName = typeName + ',' + val.printNumber + '张';
						}
						val.goodsText = typeName;
						this.allGoodsDetails[idx] = val;
						if(this.checkGoodsText){
							this.checkGoodsText = this.checkGoodsText + '；' + typeName;
						} else {
							this.checkGoodsText = typeName;
						}
					}
				})
				// this.allGoodsDetails = allGoodsDetails;
			}
			this.costInformationMsg = '';
			var assignPrice = getApp().globalData.pransportGoods.assignPrice;
			if(assignPrice.costA){
				this.costInformationMsg = '提货费' + assignPrice.costA + '元';
			} 
			if(assignPrice.costC){
				this.costInformationMsg = this.costInformationMsg + ',送货费' + assignPrice.costC + '元';
			}
			if(assignPrice.costB){
				this.costInformationMsg = this.costInformationMsg + ',运费' + assignPrice.costB + '元';
			}
			if(this.costInformationMsg && this.costInformationMsg.substring(0, 1) ==','){
				this.costInformationMsg = this.costInformationMsg.substr(1);
			}
			//费用信息处理
			var costRecord = getApp().globalData.pransportGoods.costRecord;
			this.costRecord = [];
			costRecord.map((val, index)=>{
				if(val.name && val.price){
					this.costRecord.push(val);
					if(!this.costInformationMsg){
						this.costInformationMsg = val.name + val.price + '元';
					} else {
						this.costInformationMsg = this.costInformationMsg + ',' + val.name + val.price + '元';
					}
				}
			})
			
			this.vosPrice = '';
			this.bksPRice = '';
			// 同步全局数据
			this.showLoadGoods2 = getApp().globalData.showLoadGoods2;
			this.showUnloadGoods2 = getApp().globalData.showUnloadGoods2;
			
			// 其他订单数据在onLoad进行同步
			// console.log('下单页常用数据', getApp().globalData.orderOtherData);
			let orderOtherData = getApp().globalData.orderOtherData;
			// this.needReceipt = orderOtherData.needReceipt ? orderOtherData.needReceipt : this.needReceipt;
			this.declaredValue = orderOtherData.declaredValue ? orderOtherData.declaredValue : this.declaredValue;
			if(this.declaredValue) {
				this.servicePrice = Number(this.declaredValue) * this.serviceRate / 100;
				this.servicePrice = this.servicePrice.toFixed(2);
			}
			if(this.orderAgain) {
				getApp().globalData.orderOtherData = {};
			}
			
			let costInformation = getApp().globalData.costInformation;
			// console.log('费用信息', costInformation);
			this.infoPrice = costInformation.infoPrice;
			this.hopePrice = costInformation.hopePrice;
			this.hopePriceSyb = costInformation.hopePriceSyb;
			this.checkedTimeVal = costInformation.checkedTimeVal;
			this.payType = costInformation.payType;
			this.needInvoiceFlag = costInformation.needInvoiceFlag;
			this.oilRate = costInformation.oilRate;
			this.needConfirm = costInformation.needConfirm;
			// console.log('确认报价状态', this.needConfirm);
			// if(!this.checkedTimeVal.quotationTime) {
			// 	this.getQuotationTime();
			// }else {
			// 	this.showCostInformation();
			// }
			
			// console.log('装卸时间', getApp().globalData.loadTimeData);
			
			// // 货物信息
			// let goodsVo = {};
			// goodsVo = getApp().globalData.pransportGoods.pransportGoodsVo;
			// console.log('货源信息', goodsVo.goodsTypeVO);
			// if(goodsVo.goodsTypeVO && goodsVo.goodsTypeVO.length!=0) {
			// 	this.goodsRemark = goodsVo.remark;
			// 	let ary = [];
			// 	ary = goodsVo.goodsTypeVO;
			// 	this.goodsTypeVo = [];
			// 	this.goodsListData = '';
			// 	console.log(ary);
			// 	if(ary && ary.length > 0) {
			// 		for(let i in ary) {
			// 			let typeName = ary[i].children['0'].children['0'].children['0'].typeName;
			// 			typeName = ary[i].typeName + '-' + typeName;
			// 			this.goodsTypeVo.push(typeName);
			// 		}
			// 		let newAry = Array.from(new Set(this.goodsTypeVo));
			// 		// console.log(newAry);
			// 		for(let i in newAry) {
			// 			this.goodsListData = this.goodsListData + newAry[i] + '/';
			// 		}
			// 		console.log(this.goodsListData, newAry);
			// 		this.goodsListData = this.goodsListData.slice(0, this.goodsListData.length - 1);
			// 		this.setGoodsName = this.goodsListData;
			// 		if(goodsVo.weight) {
			// 			this.goodsListData = this.goodsListData + ',' + goodsVo.weight + '吨';
			// 		}
			// 		if(goodsVo.volume) {
			// 			this.goodsListData = this.goodsListData + ',' + goodsVo.volume + '方';
			// 		}
			// 	}
			// }
			
			//地址信息
			this.startAddress1 = getApp().globalData.pransportGoods.startAddress;
			this.endAddress1 = getApp().globalData.pransportGoods.endAddress;
			if(!this.startAddress1.address) {
				this.startAddress1 = getApp().globalData.defauleAddress.loadGoods1;
			}
			if(!this.endAddress1.address) {
				this.endAddress1 = getApp().globalData.defauleAddress.unloadGoods1;
			}
		},
		onBackPress(event){ // 是否保存订单信息
			let that = this;
			if (event.from == 'backbutton') {
				this.$refs.saveOrderPopup.open();
			    return true; //阻止默认返回行为
			}
		},
		onReady() {
			this.allAreaInfo = uni.getStorageSync('regionData');
			if(this.allAreaInfo && this.allAreaInfo.length > 0) {
				for(let i in this.allAreaInfo) {
					if(this.allAreaInfo[i].code == '310000' || this.allAreaInfo[i].code == '110000' || this.allAreaInfo[i].code == '500000' || this.allAreaInfo[i].code == '120000') {
						this.allAreaInfo[i].name = this.allAreaInfo[i].name + '市';
					}
				}
			}
			let that = this;
			uni.getSystemInfo({
			    success: function (res) {
					console.log(res);
					// scrollView高度 = （可使用窗口高度 - 状态栏的高度） * 2换算为rpx - （弹窗框上下padding + 底部按钮高度 + 自定义减少的高度）
					that.scrollViewHeight = (res.windowHeight - res.statusBarHeight) * 2 - (64 + 72 + 100);
			    }
			});
		},
		methods: {
			toGoodsSearch(val) { // 搜索
				let that = this;
				utils.postRequest('/ts/goods/type/getByTypeName?typeName=' + val.gdName, {}, 'GET')
				.then(res=>{
					console.log('搜索详细', res);
					if(res.retCode == "0000000") {
						let items = res.rspBody.items;
						if(items && items.length == 0) {
							
						}else {
							for(let a in items) {
								for(let b in items[a].children) {
									for(let c in items[a].children[b].children) {
										for(let d in items[a].children[b].children[c].children) {
											let obj = {
												"state": items[a].state,
												"createdDt": items[a].createdDt,
												"version": items[a].version,
												"sid": items[a].sid,
												"createBy": items[a].createBy,
												"typeName": items[a].typeName,
												"typeLevel": items[a].typeLevel,
												"typeOrder": items[a].typeOrder,
												"parentSid": items[a].parentSid,
												"isDefault": items[a].isDefault,
												"children": [{
													"state": items[a].children[b].state,
													"createdDt": items[a].children[b].createdDt,
													"version": items[a].children[b].version,
													"sid": items[a].children[b].sid,
													"createBy": items[a].children[b].createBy,
													"typeName": items[a].children[b].typeName,
													"typeLevel": items[a].children[b].typeLevel,
													"typeOrder": items[a].children[b].typeOrder,
													"parentSid": items[a].children[b].parentSid,
													"isDefault": items[a].children[b].isDefault,
													"children": [{
														"state": items[a].children[b].children[c].state,
														"createdDt": items[a].children[b].children[c].createdDt,
														"version": items[a].children[b].children[c].version,
														"sid": items[a].children[b].children[c].sid,
														"createBy": items[a].children[b].children[c].createBy,
														"typeName": items[a].children[b].children[c].typeName,
														"typeLevel": items[a].children[b].children[c].typeLevel,
														"typeOrder": items[a].children[b].children[c].typeOrder,
														"parentSid": items[a].children[b].children[c].parentSid,
														"isDefault": items[a].children[b].children[c].isDefault,
														"children": [{
															"state": items[a].children[b].children[c].children[d].state,
															"createdDt": items[a].children[b].children[c].children[d].createdDt,
															"version": items[a].children[b].children[c].children[d].version,
															"sid": items[a].children[b].children[c].children[d].sid,
															"createBy": items[a].children[b].children[c].children[d].createBy,
															"typeName": items[a].children[b].children[c].children[d].typeName,
															"typeLevel": items[a].children[b].children[c].children[d].typeLevel,
															"typeOrder": items[a].children[b].children[c].children[d].typeOrder,
															"parentSid": items[a].children[b].children[c].children[d].parentSid,
															"isDefault": items[a].children[b].children[c].children[d].isDefault,
														}]
													}]
												}]
											}
											var goodsTypeVO = [];
											goodsTypeVO.push(obj)
											var newObj = {
												goodsTypeVO: goodsTypeVO,
												weight: val.gdWeight,
												volume: val.gdVolume,
												gdNumber: val.gdNumber,
												printNumber: val.printNumber,
												goodsText: '',
											}
											var typeName = obj.typeName + '-' + obj.children['0'].children['0'].children['0'].typeName;
											if(val.gdWeight){
												typeName = typeName + ',' + val.gdWeight + '吨';
											}
											if(val.gdVolume){
												typeName = typeName + ',' + val.gdVolume + '方';
											}
											if(val.gdNumber){
												typeName = typeName + ',' + val.gdNumber + '件';
											}
											if(val.printNumber){
												typeName = typeName + ',' + val.printNumber + '张';
											}
											newObj.goodsText = typeName;
											newObj.goodsPackingVO = [{
												sid: val.gdpPckingId,
												typeName: val.gdpPcking,
												checked: true,
											}],
											that.allGoodsDetails.push(newObj);
											getApp().globalData.pransportGoods.allGoodsDetails.push(newObj);
										}
									}
								}
							}
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					
				})
			},
			goCostInfo(){
				uni.navigateTo({
					url: '/pages/goodsDelivery/transport/costInfo'
				})
			},
			addEvent(){
				if(this.allGoodsDetails.length<4){
					this.allGoodsDetails.push({goodsText: ''});
					getApp().globalData.pransportGoods.allGoodsDetails.push({goodsText: ''});
					console.log(this.allGoodsDetails);
				} else {
					uni.showToast({
						title: '最多可添加四个货物',
						icon: 'none'
					})
				}
			},
			removeEvent(num){
				this.allGoodsDetails.splice(num, 1);
				getApp().globalData.pransportGoods.allGoodsDetails.splice(num, 1);
			},
			goSelectUser(type){
				uni.navigateTo({
					url: "/pages/goodsDelivery/transport/selectUser?type=" + type
				})
			},
			jumpTovalueAdded() {
				uni.navigateTo({
					url: './valueAdded/valueAdded'
				})
			},
			
			showPayType() { // 展示支付方式文案
				let returnMsg = '';
				switch(this.payType) {
					case 1:
						returnMsg = returnMsg + '线下支付';
						break;
					case 2:
						returnMsg = returnMsg + '线下支付' + '含' + this.oilRate + '%油卡';
						break;
					case 3:
						returnMsg = returnMsg + '线上支付';
						break;
				}
				if(this.needInvoiceFlag == 1) {
					returnMsg = returnMsg + '需要运输增值发票';
				}else {
					returnMsg = returnMsg + '不需要运输增值发票';
				}
				return returnMsg;
			},
			showTimeMsg(min) { // 根据分钟换算时间展示
				let time;
				if(min > 1440) {
					time = (min / 60 / 24);
					return Number(time).toFixed(0) + '天';
				}else if(min > 60) {
					time = (min / 60);
					return Number(time).toFixed(0) + '小时';
				}else if(min) {
					return Number(min).toFixed(0) + '分钟';
				}
			},
			
			// ==================合同相关==================
			agreementDetails(){
				var quoteDetails = {
					orderVehicleModel: this.vehicleModel,
					vehicleLength: this.vehicleLength,
					infoPrice: this.infoPrice,
					needReceipt: this.needReceipt,
					goodsListData: this.goodsListData,
					weightVolume: '',
					setGoodsName: this.setGoodsName,
					loadTimeVal: this.loadTimeVal,
					remark: this.goodsRemark,
				}
				let goodsVo = {};
				goodsVo = getApp().globalData.goodsVo;
				if(goodsVo.sid) {
					console.log(getApp().globalData.goodsVo);
					console.log(this.loadTimeVal);
					if(goodsVo.goodsVO.weight) {
						quoteDetails.weightVolume = goodsVo.goodsVO.weight + '吨';
					}
					if(goodsVo.goodsVO.volume) {
						quoteDetails.weightVolume = quoteDetails.weightVolume + goodsVo.goodsVO.volume + '方';
					}
				}
				uni.navigateTo({
					url: '/pages/allAgreement/agreementItems/index?quoteDetails=' + JSON.stringify(quoteDetails)
				})
				// uni.navigateTo({
				// 	url: "/pages/allAgreement/agreementItems/transportAgreement"
				// })
			},
			
			// ==================期望价格&&信息费输入限制==================
			changeDeclaredValue(e) { // 货物声明价值
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 6){
						let num  = Number(e.detail.value.length) - 6;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
						if(Number(e.detail.value) > 500000) {
							e.detail.value = 500000;
						}
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 2;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.declaredValue = e.detail.value;
					if(this.declaredValue) {
						console.log(Number(this.declaredValue), this.serviceRate);
						this.servicePrice = Number(this.declaredValue) * this.serviceRate / 100;
						this.servicePrice = this.servicePrice.toFixed(2);
					}else {
						this.servicePrice = 0;
					}
				})
			},
			
			 // ==================提交订单-询价发布==================
			 getDistance(lat1, lng1, lat2, lng2) { // 获取距离公里数
			 	if(!lat1 || !lng1 || !lat2 || !lng2) {
			 		return 0;
			 	}
			 	return service.getDistance(lat1, lng1, lat2, lng2);
			 },
			getEstimatedDistance() { // 获取高德API路径规划距离，若没有取到则使用老的经纬度计算
				if(!utils.btnRepeat()) return false; // 防抖
				uni.showLoading({
				    title: '加载中'
				});
				let addressAry = [];
				if(this.startAddress1.address) {
					addressAry.push(this.startAddress1);
				}
				if(this.endAddress1.address) {
					addressAry.push(this.endAddress1);
				}
				// console.log('地址信息', addressAry);
				let firstAddress = addressAry['0'];
				let origin = 'origin=' + firstAddress.longitude + ',' + firstAddress.latitude;
				let lastAddress = addressAry.pop();
				let destination = '&destination=' + lastAddress.longitude + ',' + lastAddress.latitude;
				let gdApiObj = 'key=3d7bc60f07018e1f3f9ad969f642d780&' + origin + destination + '&strategy=32' + '&show_fields=cost';
				let that = this;
				uni.request({
					url: '	https://restapi.amap.com/v5/direction/driving?' + gdApiObj,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('驾车路线规划成功', res);
						if(res.data.status == '1' && Number(res.data.count) > 0) {
							let routeObj = res.data.route;
							let pathsAry = routeObj.paths;
							let firstPath = pathsAry['0'];
							that.estimatedDistance = Number(firstPath.distance) / 1000;
						}else {
							that.estimatedDistance = that.getDistance(firstAddress.latitude, firstAddress.longitude, lastAddress.latitude, lastAddress.longitude);
						}
					},
					fail: (err) => {
						that.estimatedDistance = that.getDistance(firstAddress.latitude, firstAddress.longitude, lastAddress.latitude, lastAddress.longitude);
						console.log('驾车路线规划失败', err);
					},
					complete: (com) => {
						that.submitOrder();
					}
				});
			},
			openConfirmPopup() { // 确认订单
				if(!utils.btnRepeat()) return false; // 防抖
				// console.log('车型车长', vehicleLength, vehicleModel );
				let addressAry = [];
				if(this.startAddress1.address) {
					addressAry.push(this.startAddress1);
				}
				if(this.endAddress1.address) {
					addressAry.push(this.endAddress1);
				}
				// console.log('地址信息', addressAry);
				if(addressAry.length == 0) {
					uni.showToast({
						title: '请选择装卸点',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				
				if(!this.startAddress1.address) {
					uni.showToast({
						title: '请选择装货点',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.endAddress1.address) {
					uni.showToast({
						title: '请选择卸货点',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				var isNext = 0;
				console.log(this.allGoodsDetails);
				this.allGoodsDetails.map(val=>{
					if(val.goodsText){
						isNext = 1;
					}
				})
				if(!isNext){
					uni.showToast({
						title: '请选择货物',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				
				if(!this.agreementFlag) {
					uni.showToast({
						title: '请阅读并同意货物运输协议',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				
				this.confirmPopupShow = true;
				this.$refs.confirmPopup.open();
			},
			submitOrder() { // 提交订单
				let addressAry = [];
				if(this.startAddress1.address) {
					addressAry.push(this.startAddress1);
				}
				if(this.endAddress1.address) {
					addressAry.push(this.endAddress1);
				}
				// console.log('地址信息', addressAry);
				if(addressAry.length == 0) {
					uni.showToast({
						title: '请选择装卸点',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				
				if(!this.startAddress1.address) {
					uni.showToast({
						title: '请选择装货点',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.endAddress1.address) {
					uni.showToast({
						title: '请选择卸货点',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				var isNext = 0;
				console.log(this.allGoodsDetails);
				this.allGoodsDetails.map(val=>{
					if(val.goodsText){
						isNext = 1;
					}
				})
				if(!isNext){
					uni.showToast({
						title: '请选择货物',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				var cargo = [];
				this.allGoodsDetails.map(val=>{
					if(val.goodsText){
						let cargoObj = {
							gdName: val.goodsTypeVO[0].children[0].children[0].children[0].typeName,
							gdGoodsId: val.goodsTypeVO[0].children[0].children[0].children[0].sid,
							gdNumber: val.gdNumber.toString(),
							printNumber: val.printNumber.toString(),
							gdpPcking: val.goodsPackingVO[0].typeName,
							gdpPckingId: val.goodsPackingVO[0].sid,
						}
						if(val.weight){
							cargoObj.gdWeight = val.weight.toString();
						}
						if(val.volume){
							cargoObj.gdVolume = val.volume.toString();
						}
						cargo.push(cargoObj);
					}
				})
				var assignPrice = getApp().globalData.pransportGoods.assignPrice;
				let params = {
					shipmentsId: this.startAddress1.sid,
					arriveId: this.endAddress1.sid,
					cargo: cargo,
					costA: assignPrice.costA,
					costB: assignPrice.costB,
					costC: assignPrice.costC,
					receipt: this.needReceipt?1:0,
					remake: this.remake,
					upstreamId: this.shippingUser.userId,
					downstreamId: this.carrierUser.userId,
					userId: this.userInfo.userId,
					userCode: this.userInfo.attrs.userCode,
					costRecord: this.costRecord,
					originalNumber: this.originalNumber,
				}
				console.log(this.userInfo);
				console.log(params);
				uni.showLoading({
				    title: '加载中'
				});
				utils.postRequest('/ld/ldeccred/save', params)
				.then(res=>{
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '您已成功发布！',
							icon: 'success',
							duration: 2000
						})
						setTimeout(() => {
							uni.hideLoading();
							uni.$emit('transportRefresh');
							this.clearOrderData();
						}, 1000);
					}else{
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 5000
						})
					}
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
			},
			
			// ==================添加装货点==================
			getDefaultLoadAddress() { // 查询默认装货点
				let params = {
					"userId": this.userInfo.userId,
					"purpose": 1,
					"isDefault": 1,
					"pageNum": 1,
					"pageSize": 5,
				}
				utils.postRequest('/ts/user/address/get', params)
				.then(res=>{
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody;
						if(rspBody.total > 0) {
							let items = rspBody.items;
							this.startAddress1 = !this.startAddress1.address ? items['0'] : this.startAddress1;
							getApp().globalData.defauleAddress.loadGoods1 = items['0'];
						}
					}
				})
			},
			getDefaultUnLoadAddress() { // 查询默认卸货点
				let params = {
					"userId": this.userInfo.userId,
					"purpose": 2,
					"isDefault": 1,
					"pageNum": 1,
					"pageSize": 5,
				}
				utils.postRequest('/ts/user/address/get', params)
				.then(res=>{
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody;
						if(rspBody.total > 0) {
							let items = rspBody.items;
							this.endAddress1 = !this.endAddress1.address ? items['0'] : this.endAddress1;
							getApp().globalData.defauleAddress.unloadGoods1 = items['0'];
						}
					}
				})
			},
			
			// ==================温控范围==================
			showTemperature() { // 展示温度
				for(let i in this.temperatureAry) {
					if(this.temperatureAry[i].sid == this.checkedTemperature) {
						return this.temperatureAry[i].lowTemperature +  this.temperatureAry[i].unit + '~' + this.temperatureAry[i].highTemperature +  this.temperatureAry[i].unit;
					}
				}
			},
			
			
			// ==================担保服务==================
			getDeclaredFocus() {
				setTimeout(()=>{
					this.declaredFocus = true;
				}, 100)
				
			},
			
			// ==================搜索地址相关==================
			jumpToNewAddress(flag, purpose) { // 地址列表
				if(!utils.btnRepeat()) return false; // 防抖
				uni.navigateTo({
				    url: '../newAddress/addressList?purpose=' + purpose + '&serialNumber=' + flag + '&type=2'
				});
			},
			closeAddressPopup() {
				this.$refs.addAddressPopup.close();
			},
			showAddressPopup() {
				this.selectAreaFlag = '';
				this.areaSetp = '0';
				this.chooseAreaPopupData = this.checkedAreaData;
				// console.log(this.chooseAreaPopupData);
				if(this.chooseAreaPopupData.length == 2) {
					this.areaSetp = '1';
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == this.checkedAreaData['0'].code) {
							if(this.checkedAreaData['0'].code == '310000' || this.checkedAreaData['0'].code == '110000' || this.checkedAreaData['0'].code == '500000' || this.checkedAreaData['0'].code == '120000') {
								this.showCityInfo = this.allAreaInfo[i].cities['0'].areas;
								this.selectAreaFlag = 1;
								break;
							}else {
								this.showCityInfo = this.allAreaInfo[i].cities;
								this.selectAreaFlag = 1;
								break;
							}
						}
					}
				}else if(this.chooseAreaPopupData.length == 3) {
					this.areaSetp = '2';
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == this.checkedAreaData['0'].code) {
							this.showCityInfo = this.allAreaInfo[i].cities;
							console.log('市', this.showCityInfo);
						}
						for(let a in this.allAreaInfo[i].cities) {
							if(this.allAreaInfo[i].cities[a].code == this.checkedAreaData['1'].code) {
								console.log(this.allAreaInfo[i].cities[a].code ,this.checkedAreaData['1'].code);
								this.showAreaInfo = this.allAreaInfo[i].cities[a].areas;
								this.selectAreaFlag = 2;
								console.log('区', this.showAreaInfo);
								break;
							}
						}
					}
				}
				this.$refs.chooseAreaPopup.open();
			},
			toCloseAreaPopup() {
				this.$refs.chooseAreaPopup.close();
			},
			checkProvince(item) { // 选择省
				console.log('选择的省', item);
				this.chooseAreaPopupData = [];
				if(item.code == '310000' || item.code == '110000' || item.code == '500000' || item.code == '120000') {
					this.showCityInfo = item.cities['0'].areas;
				}else {
					this.showCityInfo = item.cities;
				}
				let obj = {
					"code": item.code,
					"name": item.name,
				};
				this.chooseAreaPopupData.push(obj);
				// if(this.chooseAreaPopupData.length == 0) {
				// 	let obj = {
				// 		"code": item.code,
				// 		"name": item.name,
				// 	};
				// 	this.chooseAreaPopupData.push(obj);
				// }else {
				// 	this.chooseAreaPopupData['0'] = {
				// 		"code": item.code,
				// 		"name": item.name,
				// 	};
				// }
				this.selectAreaFlag = 0;
				this.areaSetp = '1';
				this.scrollTop = 1;
				this.$nextTick(function() {
					this.scrollTop = 0;
					console.log(this.scrollTop)
				});
			},
			checkCity(item) { // 选择市
				console.log('选择的市', item);
				if(this.chooseAreaPopupData.length == 1) {
					let obj = {
						"code": item.code,
						"name": item.name,
					};
					this.chooseAreaPopupData.push(obj);
				}else {
					this.chooseAreaPopupData.pop();
					this.chooseAreaPopupData['1'] = {
						"code": item.code,
						"name": item.name,
					};
				}
				this.selectAreaFlag = 1;
				if(
					this.chooseAreaPopupData['0'].code == '310000' ||
					this.chooseAreaPopupData['0'].code == '110000' ||
					this.chooseAreaPopupData['0'].code == '500000' ||
					this.chooseAreaPopupData['0'].code == '120000'
				) {
					if(this.chooseAreaPopupData.length == 3) {
						this.chooseAreaPopupData.pop();
					}
					this.toSaveArea();
				}else {
					this.areaSetp = '2';
					this.showAreaInfo = item.areas;
				}
				this.scrollTop = 1;
				this.$nextTick(function() {
					this.scrollTop = 0;
					console.log(this.scrollTop)
				});
			},
			checkArea(item) {
				console.log('选择的区', item);
				if(this.chooseAreaPopupData.length == 2) {
					let obj = {
						"code": item.code,
						"name": item.name,
					};
					this.chooseAreaPopupData.push(obj);
				}else {
					this.chooseAreaPopupData['2'] = {
						"code": item.code,
						"name": item.name,
					};
				}
				this.selectAreaFlag = 2;
				this.toSaveArea();
			},
			toSaveArea() {
				this.checkedAreaData = [];
				this.checkedAreaData = this.chooseAreaPopupData;
				this.addressArea = '';
				for(let i in this.checkedAreaData) {
					this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
				}
				this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
				this.$refs.chooseAreaPopup.close();
			},
			changeSelectFlag(key) { // 切换选中的tab
				// console.log(key);
				// for(let i in this.checkedAreaData) {
				// 	console.log(i);
				// }
				if(this.selectAreaFlag != key){
					this.scrollTop = 1;
					this.$nextTick(function() {
						this.scrollTop = 0;
						console.log(this.scrollTop)
					});
				}
				this.selectAreaFlag = key;
				this.areaSetp = key.toString();
				
			},
			textareaBlur() { // 失去焦点
				if(!this.addressDetailsMsg) {
					this.textareaFocus = false;
				}
			},
			showLocationPopup() {
				this.searchBoxLoading = false;
				this.locationSearchVal = '';
				if(this.addressArea || this.addressDetailsMsg) {
					if(this.addressArea) {
						this.locationSearchVal = this.addressArea.replace(/-/g, '');
					}
					this.locationSearchVal = this.locationSearchVal + this.addressDetailsMsg;
					this.toSearch();
				}else {
					this.getUserLocation();
				}
				this.$refs.locationPopup.open();
			},
			checkSearchValThenSearch() { // 有搜索信息则直接搜索，无则定位本地后搜索
				if(this.locationSearchVal) {
					this.toSearch();
				}else {
					this.getUserLocation();
				}
			},
			getUserLocation() {
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function (res) {
						that.locationSearchVal = res.address.poiName;
						that.toSearch();
					},
					fail: function (err) {
						uni.hideLoading();
						uni.showModal({
						    title: '网络定位失败',
						    content: '请检查设备是否插入sim卡，是否开启移动网络或开启了wifi模块，请检查是否授予APP定位权限',
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
						            console.log('用户点击确定');
						        }
						    }
						});
					}
				});
			},
			toSearch() { // 搜索
				if(this.searchBoxLoading) {
					return false;
				}
				this.searchPageNum = 1;
				this.searchBoxLoading = true;
				this.searchNoMoreData = false;
				
				let that = this;
				//根据地址搜索
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&offset=30&extensions=all&' + 'page_num=' + that.searchPageNum + '&keywords=' + that.locationSearchVal;
				uni.request({
					url: 'https://restapi.amap.com/v5/place/text?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						// console.log('成功', res);
						let poisAry = res.data.pois;
						if(poisAry && poisAry.length < 20) {
							that.searchNoMoreData = true;
						}
						if(poisAry && poisAry.length > 0) {
							var newArr = poisAry.filter(item => item.name.indexOf("公交站") == -1);
							var newArr1 = newArr.filter(item => item.location);
							that.searchData = newArr1;
						}else {
							that.searchData = [];
						}
					},
					fail: (err) => {
						console.log('失败', err);
					},
					complete: (com) => {
						setTimeout(() => {
							that.searchBoxLoading = false;
						}, 500);
					}
				});
			},
			addressOnload() { // ,懒加载
				if(this.searchBoxLoading || this.searchNoMoreData) {
					return false;
				}
				this.searchBoxLoading = true;
				let that = this;
				that.searchPageNum = that.searchPageNum + 1;
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&offset=30&extensions=all&' + 'page_num=' + that.searchPageNum + '&keywords=' + that.locationSearchVal;
				uni.request({
					url: 'https://restapi.amap.com/v5/place/text?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('成功', res);
						let ary =  [];
						ary = res.data.pois;
						if(ary && ary.length < 20) {
							that.searchNoMoreData = true;
						}
						if(ary && ary.length > 0) {
							var newArr = ary.filter(item => item.name.indexOf('公交站') == -1);
							var newArr1 = newArr.filter(item => item.location);
							// console.log(newArr);
							for(let i in newArr1) {
								that.searchData.push(newArr[i]);
							}
						}
					},
					fail: (err) => {
						console.log('失败', err);
					},
					complete: (com) => {
						setTimeout(() => {
							that.searchBoxLoading = false;
						}, 500);
					}
				});
			},
			chooseAddress(item) { // 保存地址并覆盖省市区
				console.log(item);
				let cityCode = '';
				let cityName = '';
				this.checkedAreaData = [];
				let provinceObj = {
					name: item.pname,
					code: item.pcode,
				}
				this.checkedAreaData.push(provinceObj);
				if(item.pcode == '310000' || item.pcode == '110000' || item.pcode == '500000' || item.pcode == '120000') {
					let cityObj = {
						name: item.adname,
						code: item.adcode,
					};
					this.checkedAreaData.push(cityObj);
				}else {
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == item.pcode) {
							for(let a in this.allAreaInfo[i].cities) {
								for(let b in this.allAreaInfo[i].cities[a].areas) {
									if(this.allAreaInfo[i].cities[a].areas[b].code == item.adcode) {
										cityCode = this.allAreaInfo[i].cities[a].code;
										break;
									}
								}
							}
						}
					}
					cityName = item.cityname;
					let cityObj = {
						name: cityName,
						code: cityCode,
					};
					this.checkedAreaData.push(cityObj);
					let areaObj = {
						name: item.adname,
						code: item.adcode,
					};
					this.checkedAreaData.push(areaObj);
				}
				this.addressArea = '';
				for(let i in this.checkedAreaData) {
					this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
				}
				this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
				
				this.addressDetailsMsg = item.address;
				
				if(item.location) {
					let locationAry = item.location.split(',');
					this.saveAddressObj.longitude = locationAry && locationAry['0'] ? locationAry['0'] : '';
					this.saveAddressObj.latitude = locationAry && locationAry['1'] ? locationAry['1'] : '';
				}
				this.$refs.locationPopup.close();
			},
			toCloseLocationPopup() {
				this.$refs.locationPopup.close();
			},
			saveAddressMsg() { // 保存地址
				if(!this.addressArea) {
					uni.showToast({
						title: '请选择地区',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.addressDetailsMsg) {
					uni.showToast({
						title: '请填写详细地址',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				this.saveAddressObj.address = this.addressDetailsMsg;
				this.saveAddressObj.area = this.checkedAreaData['2'] && this.checkedAreaData['2'].code ? this.checkedAreaData['2'].name : this.checkedAreaData['1'].name;
				this.saveAddressObj.areaCode = this.checkedAreaData['2'] && this.checkedAreaData['2'].code ? this.checkedAreaData['2'].code : this.checkedAreaData['1'].code;
				this.saveAddressObj.city = this.checkedAreaData['1'].name;
				this.saveAddressObj.cityCode = this.checkedAreaData['1'].code;
				this.saveAddressObj.province = this.checkedAreaData['0'].name;
				this.saveAddressObj.provinceCode = this.checkedAreaData['0'].code;
				this.saveAddressObj.serialnumber = this.searchFlag;
				console.log(this.saveAddressObj);
				if(!this.saveAddressObj.longitude || !this.saveAddressObj.latitude) {
					this.getAddressLocation()
				}else {
					this.saveAddressToGlobal();
				}
			},
			getAddressLocation() {
				let geoMsg = this.saveAddressObj.province;
				geoMsg = geoMsg + (this.saveAddressObj.cityCode == this.saveAddressObj.areaCode ? this.saveAddressObj.city : this.saveAddressObj.city + this.saveAddressObj.area);
				geoMsg = geoMsg + this.saveAddressObj.address;
				let parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&keywords=' + geoMsg;
				// console.log('解析传参', parameters);
				let that = this;
				uni.request({
					url: '	https://restapi.amap.com/v5/place/text?' + parameters,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('地址解析成功', res);
						let rspBody = res.data;
						if(rspBody.status == '1' && Number(rspBody.count) > 0) {
							let ary = res.data.pois;
							let locationAry = ary[0].location.split(',');
							that.saveAddressObj.longitude = locationAry['0'];
							that.saveAddressObj.latitude = locationAry['1'];
							that.saveAddressToGlobal();
						}else {
							parameters = 'key=3d7bc60f07018e1f3f9ad969f642d780&keywords=' + that.saveAddressObj.province + that.saveAddressObj.city + that.saveAddressObj.area;
							uni.request({
								url: '	https://restapi.amap.com/v5/place/text?' + parameters,
								method: 'GET',
								data: {},
								header: {},
								success: (res) => {
									console.log('地址解析成功', res);
									let rspBody = res.data;
									if(rspBody.status == '1' && Number(rspBody.count) > 0) {
										let ary = res.data.pois;
										let locationAry = ary[0].location.split(',');
										that.saveAddressObj.longitude = locationAry['0'];
										that.saveAddressObj.latitude = locationAry['1'];
										that.saveAddressToGlobal();
									}else {
										that.saveAddressToGlobal();
									}
								},
								fail: (err) => {
									console.log('失败', err);
									that.saveAddressToGlobal();
								},
							});
						}
					},
					fail: (err) => {
						console.log('失败', err);
						that.saveAddressToGlobal();
					},
				});
			},
			saveAddressToGlobal() { // 保存数据至本地
				console.log(this.saveAddressObj);
				if(this.searchFlag == 1 || this.searchFlag == 2) {
					if(this.searchFlag == 1) {
						getApp().globalData.pransportGoods.startAddress = this.saveAddressObj;
						this.startAddress1 = this.saveAddressObj;
					}
				}else {
					if(this.searchFlag == 3) {
						getApp().globalData.pransportGoods.endAddress = this.saveAddressObj;
						this.endAddress1 = this.saveAddressObj;
					}
				}
				this.$refs.addAddressPopup.close();
				this.$forceUpdate();
			},
			
			jumpToCostInformation() { // 选择费用说明
				uni.navigateTo({
				    url: './costInformation/costInformation'
				});
			},
			toChoosePartner() { // 选择托运人
				uni.navigateTo({
				    url: './choosePartner/choosePartner'
				});
			},
			lossChange(event) { // 控制货物声明价值
				// console.log(event);
				if(this.declaredValue < 1) {
					this.declaredValue = '';
				}
				if(this.declaredValue > 500000) {
					this.declaredValue = 500000;
				}
			},
			getBatchNumber() { // 是否有批次号，无则重新获取
				this.batchNumber = getApp().globalData.batchNumber;
				if(!this.batchNumber) {
					utils.postRequest('/td/deliver-good/get-batch-number')
					.then(res=>{
						// console.log('批次号获取结果', res);
						this.batchNumber = res.rspBody.batchNumber;
						getApp().globalData.batchNumber = res.rspBody.batchNumber;
					})
					.catch(err=>{
						console.log('批次号获取失败', err);
					})
				}
			},
			getTechSrvFeeInfo() { // 平台费率
				let that = this;
				utils.postRequest('/td/driver/home/getShipperTechServiceFeeDHVO')
				.then(res=>{
					// console.log('平台费率', res);
					that.techSrvFeeData = res.rspBody.items;
					that.guaranteeRate = Number(that.techSrvFeeData['0'].shipperJSPriceRate) * 100;
					that.serviceRate = Number(that.techSrvFeeData['0'].shipperDBPriceRate) * 100;
					if(that.declaredValue) {
						that.servicePrice = Number(that.declaredValue) * that.serviceRate / 100;
						that.servicePrice = that.servicePrice.toFixed(2);
					}
				})
				.catch(err=>{
					console.log('平台费率获取失败', err);
				})
			},
			closeHopePriceHintPopup() {
				this.$refs.hopePriceHintPopup.close();
			},
			toOpenOrderMsgConfirmPopup() {
				this.$refs.hopePriceHintPopup.close();
				this.$refs.confirmPopup.open();
			},
			jumpToTopUp() {
				if(!utils.btnRepeat()) return false; // 防抖
				this.$refs.notEnoughPrice.close();
				uni.navigateTo({
				    url: '../userCenter/userWallet/topUp'
				});
			},
			closeConfirmPopup() { // 关闭确认订单的弹出框
				this.confirmPopupShow = false;
				this.$refs.confirmPopup.close();
			},
			jumpToGoodsDetails(num) { // 跳转物品选择
				getApp().globalData.pransportGoods.pransportGoodsVo = this.allGoodsDetails[num];
				uni.navigateTo({
				    url: '/pages/goodsDelivery/transport/goodsDetails/goodsDetails?num=' + num
				});
			},
			checkHistoryRepeat(sid, history) {
				for(let i in history) {
					if(history[i].children['0'].children['0'].children['0'].sid == sid) {
						return true
					}
				}
			},
			showAddressMsg(item, flag) {
				switch(flag) {
					case 'name':
						return item.userName + '  ' + item.mobile;
					case 'area':
						if(item.areaCode == item.cityCode) {
							return item.province + '-' +item.area;
						}else {
							return item.province + '-' + item.city + '-' +item.area;
						}
				}
			},
			saveOrderData() { // 关闭页面并保存订单信息
				getApp().globalData.pransportGoods.originalNumber = this.originalNumber;
				getApp().globalData.pransportGoods.remake = this.remake;
				uni.navigateBack()
			},
			clearOrderData() {// 关闭页面并删除订单信息
				console.log('关闭页面并删除订单信息');
				getApp().globalData.pransportGoods = {
					shippingUser: {}, //上游托运
					carrierUser: {}, //下游承运
					goodsArr: [], //物品信息
					pransportGoodsType: [], //货物信息
					pransportGoodsVo: {}, //零担货源信息
					allGoodsDetails: [],
					startAddress: {}, //装货地址
					endAddress: {}, //卸货地址
					costRecord: [], //费用信息数组,
					assignPrice: {}, //指定的费用
					originalNumber: '', //原始货物单号
					remake: '', //备注
				}
				uni.navigateBack()
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.scroll-lock{ 
		position: fixed; 
		top: 0; 
		left: 0; 
		z-index: 99; 
		width: 100%; 
		height: 100%; 
	}
	.creatOrder {
		padding-bottom:138rpx;
		.creatOrderMainBox {
			padding-top: 26rpx 0;
			background-color: #FFF;
			margin-bottom: 16rpx;
			.orderAddressBox {
				padding: 0 28rpx;
				.addressModel {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 26rpx 0;
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
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0 26rpx;
						.addressContent {
							flex: 1;
							.contentProvince {
								font-size: 28rpx;
								font-weight: 500;
								color: #333333;
							}
							.contentDetail {
								font-size: 26rpx;
								color: #777777;
								margin-top:24rpx;
							}
						}
						.addressMsg {
							width:360rpx;
							.nameBox {
								display: flex;
								align-items: center;
								.name {
									width:150rpx;
								}
								.tel {
									flex: 1;
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
						.addressMsgHint {
							font-size:28rpx;
							color:#777;
							display: flex;
							align-items: center;
						}
						.addAddressBox {
							width:120rpx;
							text-align: center;
							border-left: 2rpx solid #F2F3F3;
							min-height: 88rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							.aListIcon {
								flex-shrink: 0;
								margin-left: 30rpx;
								width: 40rpx;
								height: 42rpx;
							}
							.addBtn {
								height: 40rpx;
								border-radius: 22rpx;
								border: 2rpx solid #979797;
								padding:0 12rpx;
								display: flex;
								align-items: center;
								.addSyb {
									font-size: 30rpx;
									color: #9A9A9A;
									margin-right:6rpx;
									line-height: 40rpx;
								}
								.addMsg {
									line-height: 40rpx;
									font-size: 22rpx;
									color: #9A9A9A;
								}
							}
						}
					}
				}
			}
		}
		
		.rotating {
			display: block;
			transform:rotate(90deg);
		}
		.inputBox + .inputBox {
			border-top:2rpx solid rgba(151, 151, 151, 0.16);
		}
		.inputBox {
			margin:0 30rpx;
			padding:24rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.placeholderStyle{
				font-size: 28rpx;
				color: #707071;
			}
			.textareaBox{
				background-color: #F9FAF9;
				border-radius: 12rpx;
				height: 148rpx;
				padding: 24rpx;
				font-size: 28rpx;
				width: 100%;
				color: #666;
			}
			.leftTitle {
				font-size: 28rpx;
				color: #707071;
				height: 40rpx;
				line-height: 40rpx;
				flex-shrink: 0;
				margin-right:32rpx;
				display: flex;
				align-items: center;
				.titleHint {
					color:#FF3838;
					font-size: 32rpx;
					padding-left:8rpx;
					font-weight:bold;
					height: 44rpx;
				}
				.leftAdd{
					color: #0171F9;
					font-size: 26;
					margin-left: 8rpx;
				}
				.leftRemove{
					color: #FB3E5E;
					font-size: 26rpx;
					margin-left: 20rpx;
				}
			}
			.textContent {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				overflow: hidden;
				.checkedText {
					flex: 1;
					line-height: 40rpx;
					white-space:nowrap;
					overflow:hidden;
					text-overflow:ellipsis;
					word-break: break-all;
					text-align: right;
					.text + .text {
						margin-left: 8rpx;
					}
					.text {
						font-size: 28rpx;
						color: #333333;
						font-weight: 400;
						line-height: 40rpx;
					}
				}
				.goodsMsg {
					font-size: 28rpx;
					line-height: 40rpx;
				}
				.arrowIcon {
					width:22rpx;
					height: 22rpx;
					margin-left:20rpx;
				}
			}
			.goodsContent {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.goodsMsg {
					font-size: 28rpx;
					line-height: 40rpx;
					display: flex;
					justify-content: flex-end;
					flex-wrap: wrap;
					flex: 1;
					&.goodsTextEnd{
						text-align: right;
					}
				}
				.goodsMsgNum{
					font-size: 28rpx;
					line-height: 40rpx;
					text-align: right;
				}
				.arrowIcon {
					width:22rpx;
					height: 22rpx;
					margin-left:20rpx;
				}
				.loadTimeMsgBox {
					padding-left: 32rpx;
					.loadTimeMsg {
						font-size: 26rpx;
						line-height: 40rpx;
					}
				}
			}
			.rightContent {
				flex: 1;
				text-align: right;
				padding-left: 32rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
				line-height: 40rpx;
				.contentMsg {
					font-size:28rpx;
				}
				.arrowIcon {
					width:22rpx;
					height: 22rpx;
					margin-left:20rpx;
				}
				.hopePriceInput {
					font-size:28rpx;
					color:#F29347;
					border: none;
					flex: 1;
				}
				.servicePriceNum {
					color:#4AA2F3;
					font-size:28rpx;
					padding-left:4rpx;
				}
			}
		}
		.orderMsgInputBox {
			background-color: #FFF;
			padding: 8rpx 30rpx;
			margin-bottom: 16rpx;
			.boxTitle {
				padding-top: 28rpx;
				font-size: 32rpx;
				color:#222;
				font-weight: bold;
				display: flex;
				align-items: center;
				.boxTitleBorder {
					border-radius: 6rpx;
					width:6rpx;
					height: 32rpx;
					margin-right:12rpx;
					background-color: #4AA2F3;
				}
			}
			.temperatureChooseBox {
				border-top:2rpx solid rgba(151, 151, 151, 0.16);
				margin:0 30rpx;
				padding-top:24rpx;
				font-size: 28rpx;
				color: #707071;
				height: 40rpx;
				line-height: 40rpx;	
			}
			
			.temperatureList {
				margin:0 30rpx;
				padding:24rpx 0;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.checkedTemperature {
					width: 180rpx;
					height: 88rpx;
					background: linear-gradient(90deg, rgba(81, 230, 229, 0.83) 0%, #4AA2F3 100%);
					.msgColor {
						color: #FFF;
					}
				}
				.defaultTemperature {
					width: 176rpx;
					height: 84rpx;
					border: 2rpx solid #C2C2C9;
					.msgColor {
						color: #C2C2C9;
					}
				}
				.temperatureBox + .temperatureBox {
					margin-left:32rpx;
				}
				.temperatureBox {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 14rpx 0 14rpx 20rpx;
					border-radius: 12rpx;
					.lowTemperatureIcon {
						width:32rpx;
						height: 36rpx;
					}
					.highTemperatureIcon {
						width:40rpx;
						height: 40rpx;
					}
					.selfTemperatureIcon {
						width:26rpx;
						height: 48rpx;
					}
					.temperatureContent {
						flex: 1;
						height: 62rpx;
						.contentTitle {
							font-size: 24rpx;
							text-align: center;
							line-height: 34rpx;
						}
						.contentmsg {
							font-size: 20rpx;
							text-align: center;
							line-height: 28rpx;
						}
						.userTemperature {
							font-size: 24rpx;
							text-align: center;
							line-height: 62rpx;
						}
					}
				}
			}
			.guaranteeBox + .guaranteeBox {
				margin-top: 38rpx;
				margin-bottom:48rpx;
				border-radius: 12rpx;
			}
			.guaranteeBox {
				border-radius: 20rpx;
				margin-top: 24rpx;
				overflow: hidden;
				margin-left:20rpx;
				margin-right: 20rpx;
				.guaranteeHead {
					height: 90rpx;
					padding-left:24rpx;
					display: flex;
					align-items: center;
					.guaranteeIcon {
						width: 26rpx;
						height: 32rpx;
						margin-right:40rpx;
					}
					.guaranteeHeadMsg {
						font-size: 32rpx;
						font-weight: bold;
						color: #FFFFFF;
					}
				}
				.guaranteeHeadChecked {
					background: linear-gradient(317deg, #1179E9 0%, #65B7FF 100%);
				}
				.guaranteeHeadDefault {
					background: linear-gradient(90deg, #AAAAAA 0%, #777777 100%);
				}
				.guaranteeCheckBox {
					padding: 20rpx 24rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.checkMsg {
						font-size: 28rpx;
						color: #777777;
					}
					.checkedIcon {
						width: 36rpx;
						height: 36rpx;
					}
					.notCheckedIcon {
						width: 32rpx;
						height: 32rpx;
						border: 2rpx solid #979797;
						border-radius:100%;
					}
				}
				.guaranteeHintMsg {
					font-size: 28rpx;
					color: #AAAAAA;
					line-height: 40rpx;
					padding: 0 24rpx;
				}
				.declaredValueBox {
					padding: 38rpx 24rpx;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					.declaredTitle {
						font-size: 28rpx;
						color: #707071;
						line-height: 40rpx;
					}
					.declaredContent {
						display: flex;
						justify-content: flex-end;
						align-items: flex-start;
						.valueInput {
							width: 220rpx;
							height: 40rpx;
							padding-bottom:10rpx;
							border-bottom: 2rpx solid #AAAAAA;
							font-size: 28rpx;
							color: #F29347;
							text-align: center;
						}
						.valueSyb {
							font-size: 28rpx;
							color: #5B5C5D;
							line-height: 40rpx;
							padding-left:32rpx;
						}
					}
				}
			}
		}
		.priceSybBtn + .priceSybBtn {
			margin-left:20rpx;
		}
		.priceSybBtnDefault {
			padding: 0 32rpx;
			height: 52rpx;
			line-height: 52rpx;
			border-radius: 12rpx;
			border: 2rpx solid #C2C2C9;
			text-align: center;
			font-size: 28rpx;
			color: #777777;
		}
		.priceSybBtnChecked {
			padding: 0 32rpx;
			height: 52rpx;
			line-height: 52rpx;
			border-radius: 12rpx;
			border: 2rpx solid #4AA2F3;
			text-align: center;
			font-size: 28rpx;
			color: #4AA2F3;
			background-color: #E0EFFD;
		}
		.orderRulesBox {
			padding: 0 32rpx 30rpx 32rpx;
			.rulesMsg {
				line-height: 34rpx;
				font-size:24rpx;
				color:#707071;
			}
			.confirmAgreement {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-top: 16rpx;
				.confirmAgreementIcon {
					width:36rpx;
					height: 36rpx;
				}
				.btn {
					width:32rpx;
					height: 32rpx;
					border-radius:100%;
					border:2rpx solid #C2C2C9;
				}
				.agreementHint {
					padding-left:20rpx;
					font-size: 26rpx;
					color: #707071;
					font-weight:bold;
				}
				.agreementDetails {
					font-size: 26rpx;
					color: #4AA2F3;
					font-weight:bold;
				}
			}
		}
		.footBtnGroup {
			padding: 24rpx 60rpx;
			width:630rpx;
			background-color: #FFF;
			position: fixed;
			bottom:0;
			// display: flex;
			// justify-content: center;
			// align-items: center;
			.internalBtn {
				width:280rpx;
				height: 90rpx;
				line-height: 90rpx;
				border-radius:44rpx;
				background-color: #F29347;
				box-shadow: 0 4rpx 8rpx 0 rgba(255, 147, 27, 0.5);
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				margin-right:60rpx;
			}
			.externalBtn {
				// width:280rpx;
				height: 90rpx;
				line-height: 90rpx;
				border-radius:44rpx;
				background-color: #4AA2F3;
				box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
		.hintBox {
			margin-left:32rpx;
			margin-right:32rpx;
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 32rpx;
			width: 622rpx;
			
			.title {
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
				text-align: center;
			}
			.scrollBox {
				
			}
			.content {
				padding: 0 60rpx 40rpx 60rpx;
				.popupAddressModel + .popupAddressModel {
					border-top:2rpx solid #F2F3F3;
				}
				.popupAddressModel {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 26rpx 0;
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
						flex-shrink: 0;
					}
					.addressDetails {
						flex: 1;
						padding: 0 24rpx;
						.contentProvince {
							font-size: 28rpx;
							font-weight: 500;
							color: #333333;
						}
						.contentDetail {
							font-size: 26rpx;
							color: #777777;
							margin-top:24rpx;
						}
					}
				}
				.nameBorder {
					padding-bottom:30rpx;
					border-bottom: 2rpx solid #777777;
				}
				.confirmPopupMsgBox {
					margin-top:30rpx;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					.leftIcon1 {
						width: 36rpx;
						height: 36rpx;
						margin-right: 44rpx;
						flex-shrink: 0;
					}
					.leftIcon2 {
						width: 44rpx;
						height: 30rpx;
						margin-right: 36rpx;
						flex-shrink: 0;
					}
					.leftIcon8 {
						width: 36rpx;
						height: 42rpx;
						margin-right: 44rpx;
						flex-shrink: 0;
					}
					.leftIcon3 {
						width: 38rpx;
						height: 36rpx;
						margin-right: 42rpx;
						flex-shrink: 0;
					}
					.leftIcon4 {
						width: 36rpx;
						height: 38rpx;
						margin-right: 44rpx;
						flex-shrink: 0;
					}
					.leftIcon6 {
						width: 36rpx;
						height: 38rpx;
						margin-right: 44rpx;
						flex-shrink: 0;
					}
					.leftIcon9 {
						width: 36rpx;
						height: 42rpx;
						margin-right: 44rpx;
						flex-shrink: 0;
					}
					.leftIcon11 {
						width: 36rpx;
						height: 39rpx;
						margin-right: 44rpx;
						flex-shrink: 0;
					}
					.leftIcon12 {
						width: 36rpx;
						height: 34rpx;
						margin-right: 44rpx;
						flex-shrink: 0;
					}
					.leftIcon5 {
						width: 32rpx;
						height: 34rpx;
						margin-right: 48rpx;
						flex-shrink: 0;
					}
					.rightMsg {
						flex: 1;
						.msg {
							font-size: 26rpx;
							color: #707071;
							line-height: 34rpx;
							word-break: break-all;
							.msgText {
								font-size: 26rpx;
								color: #707071;
							}
						}
						.bigMsg {
							font-size: 28rpx;
							color: #333333;
							line-height: 40rpx;
						}
					}
					.leftIcon10 {
						width: 36rpx;
						height: 46rpx;
						margin-right: 44rpx;
					}
				}
				.instructions {
					font-size: 24rpx;
					color: #777777;
					padding:30rpx 0 0 0;
					line-height: 34rpx;
				}
			}
			.confirmBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 24rpx;
				.cancelBtn {
					width: 252rpx;
					height: 72rpx;
					line-height: 72rpx;
					border-radius: 44rpx;
					border: 2rpx solid #4AA2F3;
					font-size: 28rpx;
					font-weight: bold;
					color: #4AA2F3;
					text-align: center;
				}
				.confirmBtn {
					width: 256rpx;
					height: 76rpx;
					line-height: 76rpx;
					background: #4AA2F3;
					border-radius: 44rpx;
					font-size: 28rpx;
					font-weight: bold;
					color: #FFFFFF;
					text-align: center;
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
				border-bottom: 2rpx solid #EAEAEA;
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
		.saveOrderBox {
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
		.picker-view{
			width: 750rpx;
			height: 300rpx;
		}
		.item{
			height:60rpx;
			line-height: 60rpx;
			align-items: center;
			justify-content: center;
			text-align: center;
		}
		.hintPopup {
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 32rpx 28rpx 48rpx 28rpx;
			margin: 0 32rpx;
			.hintTitle {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				text-align: center;
				margin-bottom: 32rpx;
			}
			.hintMsg {
				font-size: 28rpx;
				color: #707071;
				line-height: 40rpx;
				padding: 0 42rpx;
				.num {
					font-size: 28rpx;
					color: #4AA2F3;
				}
			}
			.hintBtnGroup {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top:100rpx;
			}
			.closePopupBtn {
				height: 84rpx;
				line-height: 84rpx;
				border-radius: 12rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				border: 2rpx solid #4AA2F3;
				color: #4AA2F3;
			}
			.btn {
				height: 88rpx;
				line-height: 88rpx;
				background-color: #4AA2F3;
				border-radius: 12rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				margin-right:20rpx;
			}
		}
		.addressPopupBox {
			margin-left: 54rpx;
			margin-right: 54rpx;
			background-color: #FFF;
			border-radius: 16rpx;
			padding-bottom: 28rpx;
			width: 642rpx;
			.closeIcon {
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				right: 24rpx;
				margin-top:-30rpx;
			}
			.addressTitle {
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
				line-height: 44rpx;
				letter-spacing: 2rpx;
				padding: 30rpx 0 28rpx 0;
				text-align: center;
			}
			.saveAddressBtn {
				margin: 30rpx 32rpx 0 32rpx;
				height: 94rpx;
				line-height: 94rpx;
				background: #4AA2F3;
				border-radius: 12rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				letter-spacing: 2rpx;
				text-align: center;
			}
			.addressBox + .addressBox {
				border-bottom: 1rpx solid #F2F2F2;
			}
			.addressBox {
				border-top: 1rpx solid #F2F2F2;
				padding: 24rpx 32rpx  28rpx 32rpx;
				display: flex;
				align-items: flex-start;
				.title {
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
					letter-spacing: 2rpx;
					width: 150rpx;;
				}
				.content {
					flex: 1;
					font-size: 30rpx;
					line-height: 42rpx;
				}
				.contentTextarea {
					width: 338rpx;
					flex: 1;
					font-size: 30rpx;
					color:#333;
				}
				.addressLocationBox {
					padding-left:32rpx;
					.locationIcon {
						display: block;
						width: 32rpx;
						height: 32rpx;
						margin:0 auto 10rpx auto;
					}
					.msg {
						width: 58rpx;
						text-align: center;
						font-size: 26rpx;
						color: #4AA2F3;
						line-height: 36rpx;
					}
				}
			}
		}
		.chooseAreaBox {
			background-color: #FFF;
			height: 900rpx;
			.checkedArea {
				color:#4AA2F3;
			}
			.defaultArea {
				color:#333;
			}
			.areaPopupHead {
				padding: 0 36rpx 0 28rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #E3E3E3;
				height: 92rpx;
				.checkedAreaBox {
					display: flex;
					align-items: center;
					.areaList + .areaList {
						margin-left: 36rpx;
					}
					.areaList {
						min-width:100rpx;
						text-align: center;
						padding-top: 22rpx;
						.areaMsg {
							font-size: 28rpx;
							line-height: 40rpx;
							margin-bottom:22rpx;
							max-width:200rpx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							word-break: break-all;
						}
						.checkedLine {
							height: 6rpx;
							background: #4AA2F3;
							border-radius: 2rpx;
						}
						.defaultLine {
							height: 6rpx;
							background: #FFF;
							border-radius: 2rpx;
						}
					}
				}
				.closeAreaPopupIcon {
					width: 24rpx;
					height: 24rpx;
				}
			}
			
			.areaPopupBody {
				height: 808rpx;
				.detailsList + .detailsList {
					border-top: 2rpx solid #E3E3E3;
				}
				.detailsList {
					height: 72rpx;
					padding: 0 36rpx 0 28rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.detailsMsg {
						font-size: 28rpx;
						line-height: 40rpx;
					}
					.areaRightIcon {
						width: 18rpx;
						height: 32rpx;
					}
				}
			}
		}
		.locationAddressBox {
			margin-left: 54rpx;
			margin-right: 54rpx;
			background-color: #FFF;
			border-radius: 16rpx;
			width: 642rpx;
			.locationPopupHead {
				display: flex;
				align-items: center;
				padding: 20rpx 18rpx 20rpx 24rpx;
				border-bottom: 1rpx solid #E3E3E3;
				.locationBackIcon {
					width: 32rpx;
					height: 32rpx;
					transform:rotate(180deg);
					margin-right:32rpx;
				}
				.locationInputBox {
					flex: 1;
					height: 66rpx;
					background: #F5F6F8;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					padding: 0 24rpx;
					box-sizing: border-box;
					.locationInput{
						flex: 1;
						font-size: 28rpx;
						color:#333;
					}
					.addressLocationBox {
						padding-left: 30rpx;
						display: flex;
						align-items: center;
						.locationIcon {
							width: 30rpx;
							height: 30rpx;
							margin-right:14rpx;
						}
						.msg {
							font-size: 26rpx;
							color: #4AA2F3;
							line-height: 36rpx;
						}
					}
				}
			}
			.locationScroll {
				height: 700rpx;
				.addressSearchList + .addressSearchList {
					border-top: 1rpx solid #E3E3E3;
				}
				.addressSearchList {
					padding: 18rpx 24rpx 20rpx 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.listContent {
						flex: 1;
						.name {
							font-size: 32rpx;
							color: #333333;
							line-height: 44rpx;
							letter-spacing: 2rpx;
						}
						.msg {
							font-size: 24rpx;
							color: #777777;
							line-height: 34rpx;
						}
					}
					.searchComfirmIcon {
						width: 18rpx;
						height: 32rpx;
						margin-left: 30rpx;
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
					width: 244rpx;
					height: 246rpx;
					margin-top:50rpx;
				}
			}
			.popupLoadingBox {
				height: 700rpx;
				width: 642rpx;
				margin-top:-700rpx;
				position: absolute;
				z-index: 999;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: rgba(255,255,255,0.6);
				border-bottom-right-radius: 16rpx;
				border-bottom-left-radius: 16rpx;
				.loadingIcon {
					width:36rpx;
					height: 36rpx;
					-webkit-animation: rotating 1.5s linear infinite;
					animation: rotating 1.5s linear infinite;
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
		.forFree {
			padding: 4rpx 14rpx;
			font-size: 26rpx;
			color: #FC2D2D;
			line-height: 36rpx;
			background-color: #FFD8D8;
			border-radius: 12rpx;
			margin-left:32rpx;
		}
		.timeBottomPopupBox {
			background: #FFFFFF;
			overflow: hidden;
			.popupHead {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 36rpx;
				border-bottom: 2rpx solid #EAEAEA;
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
			.timePopup {
				display: flex;
				height: 560rpx;
				.leftCol {
					width: 240rpx;
					height: 560rpx;
					background-color:#F3F3F3;
					.monthBox {
						height: 140rpx;
						line-height: 140rpx;
						text-align: center;
						font-size: 30rpx;
						font-weight: 500;
					}
				}
				.rightCol {
					flex: 1;
					height: 560rpx;
					.hourBox {
						height: 90rpx;
						padding: 0 46rpx 0 68rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.msg {
							font-weight: 500;
						}
						.checkHourIcon {
							width: 26rpx;
							height: 20rpx;
						}
					}
				}
			}
		}
	}
</style>
