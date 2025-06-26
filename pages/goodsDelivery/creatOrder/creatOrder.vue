<template>
	<view class="newCreatPage">
		<view class="newHead">
			<image class="headBack" src="/static/images/newCeratOrder/pageBackIcon.png" @click="toBack"></image>
			<view class="pageName">发货</view>
		</view>

		<view class="creatOrder">
			<view class="creatOrderMainBox">
				<view class="orderAddressBox">
					<view class="addressModel">
						<view class="addressType" style="background-color: #0C0C0C;">装</view>
						<view class="addressDetails">
							<view class="addressContent" @click="showAddressPopup(1, 1, startAddress1)">
								<view class="noAddressInfo" v-if="!startAddress1.province">装货必填</view>
								<view class="addressArea" v-if="startAddress1.province">{{showAddressMsg(startAddress1, 'area')}}</view>
								<view class="addressDetailsInfo">
									<text v-if="startAddress1.address">{{startAddress1.address}}</text>
									<text style="padding-left: 32rpx;" v-if="startAddress1.userName">{{showAddressMsg(startAddress1, 'name')}}</text>
									<text style="padding-left: 16rpx;" v-if="startAddress1.mobile">{{showAddressMsg(startAddress1, 'mobile')}}</text>
								</view>
							</view>
							<view class="addAddressBox" @click="addDeliverGood(1)" v-show="!showLoadGoods2">
								<image class="addressStatusBtn" src="/static/images/newOrderDetails/addAddress.png"></image>
							</view>
						</view>
					</view>
					<view class="addressModel" v-show="showLoadGoods2">
						<view class="addressType" style="background-color: #0C0C0C;">装</view>
						<view class="addressDetails">
							<view class="addressContent"  @click="showAddressPopup(1, 2, startAddress2)">
								<view class="noAddressInfo" v-if="!startAddress2.province">装货必填</view>
								<view class="addressArea" v-if="startAddress2.province">{{showAddressMsg(startAddress2, 'area')}}</view>
								<view class="addressDetailsInfo">
									<text v-if="startAddress2.address">{{startAddress2.address}}</text>
									<text style="padding-left: 32rpx;" v-if="startAddress2.userName">{{showAddressMsg(startAddress2, 'name')}}</text>
									<text style="padding-left: 16rpx;" v-if="startAddress2.mobile">{{showAddressMsg(startAddress2, 'mobile')}}</text>
								</view>
							</view>
							<view class="addAddressBox" @click="deleteDeliverGood(1)">
								<image class="addressStatusBtn" src="/static/images/newOrderDetails/deleteAddress.png"></image>
							</view>
						</view>
					</view>
					<view class="addressModel">
						<view class="addressType" style="background-color: #F67979;">卸</view>
						<view class="addressDetails">
							<view class="addressContent" @click="showAddressPopup(2, 1, endAddress1)">
								<view class="noAddressInfo" v-if="!endAddress1.province">卸货必填</view>
								<view class="addressArea" v-if="endAddress1.province">{{showAddressMsg(endAddress1, 'area')}}</view>
								<view class="addressDetailsInfo">
									<text v-if="endAddress1.address">{{endAddress1.address}}</text>
									<text style="padding-left: 32rpx;" v-if="endAddress1.userName">{{showAddressMsg(endAddress1, 'name')}}</text>
									<text style="padding-left: 16rpx;" v-if="endAddress1.mobile">{{showAddressMsg(endAddress1, 'mobile')}}</text>
								</view>
							</view>
							<view class="addAddressBox" @click="addDeliverGood(2)" v-show="!showUnloadGoods2">
								<image class="addressStatusBtn" src="/static/images/newOrderDetails/addAddress.png"></image>
							</view>
						</view>
					</view>
					<view class="addressModel" v-show="showUnloadGoods2">
						<view class="addressType" style="background-color: #F67979;">卸</view>
						<view class="addressDetails">
							<view class="addressContent" @click="showAddressPopup(2, 2, endAddress2)">
								<view class="noAddressInfo" v-if="!endAddress2.province">卸货必填</view>
								<view class="addressArea" v-if="endAddress2.province">{{showAddressMsg(endAddress2, 'area')}}</view>
								<view class="addressDetailsInfo">
									<text v-if="endAddress2.address">{{endAddress2.address}}</text>
									<text style="padding-left: 32rpx;" v-if="endAddress2.userName">{{showAddressMsg(endAddress2, 'name')}}</text>
									<text style="padding-left: 16rpx;" v-if="endAddress2.mobile">{{showAddressMsg(endAddress2, 'mobile')}}</text>
								</view>
							</view>
							<view class="addAddressBox" @click="deleteDeliverGood(2)">
								<image class="addressStatusBtn" src="/static/images/newOrderDetails/deleteAddress.png"></image>
							</view>
						</view>
					</view>
					
					<!-- 联系人模块 -->
					<view class="inputBox" style="margin: 0;">
						<view class="largeHead">发货联系人</view>
						<view class="rightContent" @click="toChooseContact()">
							<text class="orderUserName">
								{{contactUser.user1.userName ? contactUser.user1.userName : defaultContact.userName}}
							</text>
							<text class="orderUserMobile">
								{{contactUser.user1.mobile ? contactUser.user1.mobile : defaultContact.mobile}}
							</text>
							<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="orderMsgInputBox newBorderBox">
				<view class="inputBox" @tap="jumpToCarType()">
					<view class="leftTitle">用车需求<view class="areaHint">必填</view></view>
					<view class="textContent">
						<view class="checkedText" v-if="vehicleModel">
							<text class="text">{{vehicleNumber + '车'}}</text>
							<text class="text">{{vehicleModel}}</text>
							<text class="text">{{vehicleLength}}</text>
						</view>
						<view class="goodsMsg" style="color:#666;'" v-if="!vehicleModel">请选择</view>
						<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
					</view>
				</view>
				<view class="inputBox" @tap="jumpToGoodsDetails()">
					<view class="leftTitle">货物信息</view>
					<view class="goodsContent">
						<view class="goodsMsg" :style="goodsListData ? 'color:#333;font-weight:500;' : 'color:#666;'">{{goodsListData ? goodsListData : '请填写'}}</view>
						<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
					</view>
				</view>
				<view class="inputBox" @tap="jumpToCostInformation()">
					<view class="leftTitle">费用信息</view>
					<view class="goodsContent">
						<view class="goodsMsg" style="color:#333;font-weight:500;">{{costInformationMsg}}</view>
						<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
					</view>
				</view>
				<view class="inputBox">
					<view class="leftTitle">装车时间</view>
					<view class="goodsContent" @tap="showTimePopup()">
						<text class="contentMsg" v-if="!newLoadTimeMsg" style="font-size: 28rpx;color:#C2C2C9;">请填写</text>
						<view class="loadTimeMsgBox" v-if="newLoadTimeMsg">
							<view class="loadTimeMsg">{{newLoadTimeMsg}}</view>
						</view>
						<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
					</view>
				</view>
				<view class="inputBox" @tap="jumpToCreatScope()">
					<view class="leftTitle">发布范围</view>
					<view class="textContent">
						<view class="checkedText">
							<text class="text">{{showCreatScope()}}</text>
						</view>
						<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
					</view>
				</view>
				<view class="inputBox" @tap="jumpToHandlingInstructions()">
					<view class="leftTitle">装卸说明</view>
					<view class="goodsContent">
						<view class="goodsMsg" style="color:#333;font-weight:500;" v-if="handingRequiredMsg">{{handingRequiredMsg}}</view>
						<view class="goodsMsg" style="color:#666;" v-if="!handingRequiredMsg">请填写</view>
						<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
					</view>
				</view>
				<view class="inputBox" @tap="jumpToElectron()">
					<view class="leftTitle">电子围栏</view>
					<view class="goodsContent">
						<view class="goodsMsg" style="color:#666;">{{electronText}}</view>
						<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
					</view>
				</view>
				
				<!-- <uni-collapse v-if="!checkScopeTypeRepeat(2)">
					<uni-collapse-item titleBorder="none" :show-animation="true" :border="false" :show-arrow="false">
						<template v-slot:title>
							<view class="inputBox" style="border-top:2rpx solid rgba(151, 151, 151, 0.16);">
								<view class="leftTitle">平台服务</view>
								<view class="goodsContent">
									<view class="goodsMsg" style="color:#333;font-weight:500;">{{guaranteeFlag == 1 ? '需要' : '不需要'}}</view>
									<image class="arrowIcon" src="../../../static/images/newCeratOrder/icon_right.png"></image>
								</view>
							</view>
						</template>
						<view class="orderMsgInputBox">
							<view class="inputBox" style="display: block;">
								<view class="leftTitle">技术服务费<text class="forFree" v-if="!guaranteeRate || Number(guaranteeRate) == 0">免费</text></view>
								<view class="goodsContent" style="margin-top:12rpx;" :style="!guaranteeRate || Number(guaranteeRate) == 0 ? 'justify-content: flex-start;' : ''">
									<view class="goodsMsg" style="color:#666;" v-if="Number(guaranteeRate) && Number(guaranteeRate) > 0">运费金额的{{guaranteeRate}}%，在运单成交时从您的保证金扣除至平台</view>
									<view class="goodsMsg" style="color:#666;" v-if="!guaranteeRate || Number(guaranteeRate) == 0">本单免收技术服务费</view>
								</view>
							</view>
							<view class="inputBox">
								<view class="leftTitle">保障服务<text class="titleHint">*</text></view>
								<view class="rightContent">
									<text class="contentMsg" style="color:#333;">服务费<text class="servicePriceNum">{{servicePrice}}</text>元</text>
								</view>
							</view>
							<view class="guaranteeBox" style="border: 2rpx solid #4AA2F3;">
								<view class="guaranteeHead guaranteeHeadChecked">
									<image class="guaranteeIcon" src="../../../static/images/goodsDelivery/valueAdded.png"></image>
									<view class="guaranteeHeadMsg">货运中国官方担保</view>
								</view>
								<view class="guaranteeCheckBox" @click="getDeclaredFocus()">
									<view class="checkMsg">我需要平台担保服务</view>
									<image v-show="guaranteeFlag == 1" class="checkedIcon" src="../../../static/images/goodsDelivery/checkPrice.png"></image>
									<view v-show="guaranteeFlag != 1" class="notCheckedIcon"></view>
								</view>
								<view class="guaranteeHintMsg">当司机责任造成货物损失，且超过10天未向货主支付货损金额时，平台将向货主支付实际货损金额。（平台收取货物声明价值{{serviceRate}}%的服务费）</view>
								<view class="declaredValueBox" @click="getDeclaredFocus()">
									<view class="declaredTitle">货物声明价值：</view>
									<view class="declaredContent">
										<input class="valueInput" :disabled="guaranteeFlag != 1" :focus="declaredFocus" maxlength="9" type="digit" placeholder="请输入1-500000" v-model="declaredValue" @input="changeDeclaredValue" />
										<text class="valueSyb">元</text>
									</view>
								</view>
							</view>
							<view class="guaranteeBox" :style="guaranteeFlag == 2 ? 'border: 2rpx solid #4AA2F3;' : 'border: 2rpx solid #979797;'">
								<view class="guaranteeCheckBox" @click="guaranteeFlag = 2, declaredValue = '', servicePrice = 0">
									<view class="checkMsg">我不需要平台担保服务</view>
									<image v-show="guaranteeFlag == 2 " class="checkedIcon" src="../../../static/images/goodsDelivery/checkPrice.png"></image>
									<view v-show="guaranteeFlag != 2" class="notCheckedIcon"></view>
								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse> -->
			</view>
			
			<!-- <view class="orderRulesBox">
				<view class="rulesMsg">若额外产生等候费/压车费/超吨费等需另外支付</view>
			</view> -->
			<view class="chekcedBtnBox">
				<view class="otherButton1" :class="needReceipt ? 'checkedButton' : 'defaultButton'"  @click="needReceipt = !needReceipt">
					回单
					<image class="checkedSyb" :src="needReceipt ? '/static/images/newCeratOrder/checkedIcon.png' : '/static/images/newCeratOrder/defaultCheckIcon.png'"></image>
				</view>
				<view class="otherButton2" :class="saveCommonly ? 'checkedButton' : 'defaultButton'"  @click="saveCommonly = !saveCommonly">
					存为常发
					<image class="checkedSyb" :src="saveCommonly ? '/static/images/newCeratOrder/checkedIcon.png' : '/static/images/newCeratOrder/defaultCheckIcon.png'"></image>
				</view>
			</view>
			<view class="footBtnGroup">
				<view class="footOtherBtn">
					<view class="newAgreementBox">
						<view class="section" @click="agreementFlag = !agreementFlag">
							<view v-show="!agreementFlag" class="btn"></view>
							<image v-show="agreementFlag" class="confirmAgreementIcon" src="../../../static/images/goodsDelivery/payCheckedIcon.png"></image>
						</view>
						<view class="agreementHint" @click="agreementFlag = !agreementFlag">我已阅读并同意</view>
						<view class="agreementDetails" @click.stop="agreementDetails">《运输合同》</view>
					</view>
				</view>
				<view class="externalBtn" @click="openConfirmPopup()">确认发布</view>
			</view>
		</view>
		<!-- 弹窗模块 -->
		
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
		
		<!-- 时间选择弹窗 -->
		<uni-popup ref="timePopup" type="bottom">
			<view class="timeBottomPopupBox">
				<view class="popupHead">
					<text class="title">请选择装货时间</text>
					<view class="cancelIconBox" @tap="closeTimePopup()">
						<image class="cancelIcon" src="../../../static/images/goodsDelivery/newCancel.png"></image>
					</view>
				</view>
				<view class="timePopup">
					<scroll-view class="leftCol" scroll-y="true">
						<view
							class="monthBox"
							v-for="(item, index) in monthData"
							:key="index"
							@tap="checkmonth(index)"
							:style="monthCheckVal == index ? 'background-color:#FFF;color:#4AA2F3;' : 'background-color:#F3F3F3;color:#777;'">
							{{showYearMsg(index, item.label, item.dateType)}}
						</view>
					</scroll-view>
					<scroll-view class="rightCol" scroll-y="true">
						<view
							class="hourBox"
							v-for="(item, index) in hourData"
							:key="index"
							@tap="chooseHour(index)"
							v-if="showHours(item)">
							<text class="msg" :style="startCheckedMonth == monthCheckVal && startHourCheckVal == index ? 'color:#4AA2F3;font-size: 30rpx;' : 'color:#333;font-size: 28rpx;'">{{item.hour}}{{item.syb}}{{item.min}}</text>
							<image v-show="startCheckedMonth == monthCheckVal && startHourCheckVal == index" class="checkHourIcon" src="../../../static/images/goodsDelivery/checkHour.png"></image>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="personContactPopup" type="center">
			<view class="editPersonMsg">
				<view class="title">发货联系人</view>
				<view class="popupInputBox">
					<input class="popupInput" maxlength="5" placeholder="请填写联系人姓名" v-model="personName" />
					<input class="popupInput" type="number" maxlength="11" placeholder="请填写手机号" v-model="personTel" />
				</view>
				<view class="popupBtn" @tap="savePersonContact()">确认</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="editAddressPopup" type="bottom">
			<view class="addressPopupBox">
				<view class="popupHeadBox">
					<view class="cancelBtn" @click="closeAddressPopup()">取消</view>
					<view class="popupTitle">编辑{{addressTypeKey == 1 ? '装货地' : '卸货地'}}</view>
					<view class="confirmBtn" @click="checkLongitude()">确定</view>
				</view>
				<view class="popupBodyBox">
					<view class="chooseRow" @click="chooseLocation()">
						<view class="chooseTitle">
							<view class="areaMsg" :style="addressPopupObj.province ? 'color: #000;' : 'color: #666;'">
								{{addressPopupObj.province ? showAddressMsg(addressPopupObj, 'area') : '请选择地区'}}
							</view>
							<view class="areaHint">必填</view>
						</view>
						<view class="chooseBtn">地图选择</view>
					</view>
					<view class="chooseRow">
						<input class="addressInput flexInput" type="text" placeholder="输入详情地址" :placeholder-style="placeholderStyle" v-model="addressPopupObj.address" @input="popupAddressChange"/>
						<!-- <view class="mapChooseBtn" @click="chooseLocation">地图选择</view> -->
						
						<view class="mapChooseBtn" @click="jumpToChooseArea">
							点击选择
							<image class="chooseIcon" src="/static/images/newOrderDetails/rightArrow.png"></image>
						</view>
					</view>
					<view class="chooseRow">
						<input class="addressInput colInput" type="text" maxlength="5" placeholder="输入姓名" :placeholder-style="placeholderStyle" v-model="addressPopupObj.userName"/>
						<view class="inputLine"></view>
						<input class="addressInput flexInput" type="number" maxlength="11" placeholder="输入手机号" :placeholder-style="placeholderStyle" v-model="addressPopupObj.mobile"/>
					</view>
					<!-- 62 108*3=324 92 -->
					<view class="historyAddressTitle">历史{{addressTypeKey == 1 ? '装货' : '卸货'}}地址</view>
					<scroll-view class="scrollHistory" :scroll-y="true" v-if="addressTypeKey == 1">
						<view class="historyAddressList" v-for="(item, index) in sendHisInfo" :key="index" @click="setAddressToPopup(item)">
							<image class="historyAddrIcon" src="/static/images/newFleetDetails/beidou.png"></image>
							<view class="historyAddrContent">
								<view class="hAArea">
									<text class="areaMsg">{{showPopupAddressMsg(item)}}</text>
									<text class="nameMobile" v-if="item.name">{{item.name}}</text>
									<text class="nameMobile" v-if="item.mobile">{{item.mobile}}</text>
								</view>
								<view class="hADetail" v-if="item.addressDetail">{{item.addressDetail}}</view>
							</view>
						</view>
						<view class="noHistoryAddress" v-if="sendHisInfo.length == 0">暂无历史地址～</view>
					</scroll-view>
					<scroll-view class="scrollHistory" :scroll-y="true" v-if="addressTypeKey == 2">
						<view class="historyAddressList" v-for="(item, index) in unLoadHisInfo" :key="index" @click="setAddressToPopup(item)">
							<image class="historyAddrIcon" src="/static/images/newFleetDetails/beidou.png"></image>
							<view class="historyAddrContent">
								<view class="hAArea">
									<text class="areaMsg">{{showPopupAddressMsg(item)}}</text>
									<text class="nameMobile" v-if="item.name">{{item.name}}</text>
									<text class="nameMobile" v-if="item.mobile">{{item.mobile}}</text>
								</view>
								<view class="hADetail" v-if="item.addressDetail">{{item.addressDetail}}</view>
							</view>
						</view>
						<view class="noHistoryAddress" v-if="unLoadHisInfo.length == 0">暂无历史地址～</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="electronAlert" type="center">
			<view class="electronAlert">
				<view class="title">提示</view>
				<view class="ele-content">{{electronMessage}}</view>
				<view class="ele-btn">
					<view class="cancel btn" @click="cancelElectron">取消</view>
					<view class="confirm btn" @click="jumpToElectron">确定</view>
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
				electronMessage: '',
				electronInfo: {
					zhuang: {},
					xie: {},
				}, //装卸货电子围栏信息
				saveCommonly: false,
				personName: '', // 发货联系人姓名
				personTel: '', // 发货联系人手机号
				value: '',
				agreementFlag: false,
				showLoadGoods2: false,
				showUnloadGoods2: false,
				
				// 车型车长
				vehicleModel: '',
				vehicleLength: '',
				vehicleNumber: '',
				
				// 货物信息
				goodsItem: [],
				goodsTypeVo: {},
				goodsListData: '',
				goodsRemark: '', //货物备注
				
				//装货点、卸货点
				startAddress1: {},
				endAddress1: {},
				startAddress2: {},
				endAddress2: {},
				
				// 联系人
				defaultContact: {},
				contactUser: {
					user1: {},
					user2: {},
					user3: {},
					user4: {},
				},
				
				// 是否需要回单
				needReceipt: false,
				
				// 装卸时间
				loadTimeVal: [],
				
				// 装载要求
				handingRequiredVal: [],
				handingRequiredMsg: '',
				
				// 信息费
				infoPrice: '',
				
				// 希望价格
				hopePrice: '',
				hopePriceSyb: '趟',
				
				// 担保服务
				guaranteeFlag: 0,
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
				
				// 报价方式
				quotationWay: '',
				fixPrice: '',
				needInvoiceFlag: '',
				
				showMyTemperatureValMsg: '',
				setGoodsName: '',//合同物品信息
				
				// 装货点相关
				allAreaInfo: [], // 所有省市区
				
				// 再来一单
				orderAgain: 0,
				
				// 发布范围
				creatScope: '',
				
				costInformationMsg: '',
				scrollTop: 0,
				estimatedDistance: '',
				otherShipping: { // 货源托运人
					userName: '',
					userId: ''
				},
				
				// 以下为测试装卸时间模块
				newLoadTimeMsg: '',
				monthData: [],
				hourData: [{
					hour: '全天',
					syb: '',
					min: ''
				}, {
					hour: '凌晨0:00-6:00',
					syb: '',
					min: ''
				}, {
					hour: '上午6:00-12:00',
					syb: '',
					min: ''
				}, {
					hour: '下午12:00-18:00',
					syb: '',
					min: ''
				}, {
					hour: '晚上18:00-24:00',
					syb: '',
					min: ''
				}],
				nowHours: 0, // 当前时间
				monthCheckVal: '0',
				startCheckedMonth: '0',
				startHourCheckVal: '0',
				addressDetail: {},
				isSendOrder: false,
				
				// 新版地址模块
				addressTypeKey: 0, // 装货地：1，卸货地：2。主要为判断装货地还是卸货地
				addressTypeNum: 0, // 装货地1：1，装货地2：2，卸货地1：1，卸货地2：2。主要为判断多装多卸
				addressPopupObj: {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
					address: '',
					userName: '',
					mobile: '',
					longitude: '',
					latitude: ''
				},
				placeholderStyle: 'font-size: 36rpx;font-weight: 500;color: #666;',
				historyAddressInfo: [],
				guaranteeCollapse: [1],
				sendHisInfo: [],
				unLoadHisInfo: [],
				informationFlag: '',
			};
		},
		onLoad(options) {
			// "screenHeight": 812,
			// "windowHeight": 724,
			let userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) {
				uni.navigateBack()
			}else {
				this.userInfo = userInfo ? JSON.parse(userInfo) : {};
				console.log('用户信息', this.userInfo);
				this.getTechSrvFeeInfo();
				let obj = getApp().globalData.defaultContact;
				if(!obj.userName || !obj.mobile) {
					getApp().globalData.defaultContact.userName = this.userInfo.userName;
					getApp().globalData.defaultContact.mobile = this.userInfo.mobile;
				}
				this.orderAgain = options.orderAgain ? options.orderAgain : 0;
				this.getDateInfo(); // 小时数据直接获取
				this.getSendHisAddress(); // 获取历史装货地址
				this.getUnloadingHisAddress(); // 获取历史卸货地址
				
			}
			uni.$on("electronSet", info => {
				console.log(info, "装卸电子围栏信息")
				var electronInfo = JSON.parse(info);
				this.electronInfo = electronInfo
			})
		},
		onUnload() {
			// uni.$off("upDataOrder");
			uni.$off("electronSet");
		},
		onShow() {
			this.vosPrice = '';
			this.bksPRice = '';
			this.getMarginVOShipper();
			this.getAccountBkShipper();
			this.getOrderInfo();
			this.getPopupAddressInfo();
			this.getElectronInfo(); //获取再来一单的电子围栏信息
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
		},
		computed: {
			zhuangAddr() {
				var startAddress1 = this.startAddress1;
				if (startAddress1.province) {
					var addr = JSON.parse((JSON.stringify(startAddress1)));
					var province = addr.province || "";
					var city = addr.city || "";
					var area = addr.area || "";
					var address = addr.address || "";
					return province + city + area + address
				} else {
					return ""
				}
			},
			xieAddr() {
				var endAddress1 = this.endAddress1;
				if (!endAddress1.province) return "";
				var endAddress2 = this.endAddress2;
				if (!endAddress2.province) {
					var addr = JSON.parse((JSON.stringify(endAddress1)));
					var province = addr.province || "";
					var city = addr.city || "";
					var area = addr.area || "";
					var address = addr.address || "";
					return province + city + area + address
				} else {
					var addr = JSON.parse((JSON.stringify(endAddress2)));
					var province = addr.province || "";
					var city = addr.city || "";
					var area = addr.area || "";
					var address = addr.address || "";
					return province + city + area + address
				}
			},
			electronText() {
				var electronInfo = this.electronInfo;
				if (!electronInfo) return "去设置";
				var zhuang = this.electronInfo.zhuang;
				var xie = this.electronInfo.xie;
				if ((zhuang && zhuang.fenceRadius > 0) || (xie && xie.fenceRadius > 0)) {
					return '已设置'
				} else {
					return '去设置'
				}
			}
		},
		watch: {
			zhuangAddr(newVal, oldVal) {
				var zhuang = this.electronInfo.zhuang || {};
				if (newVal != oldVal && Object.keys(zhuang).length > 0) {
					//修改了地址，弹出电子围栏提示框
					if (this.orderAgain) {
						if (oldVal) {
							this.electronMessage = "您修改了装货地址，是否更新电子围栏？"
							this.$refs.electronAlert.open();
						}
					} else {
						this.electronMessage = "您修改了装货地址，是否更新电子围栏？"
						this.$refs.electronAlert.open();
					}
					
				}
			},
			xieAddr(newVal, oldVal) {
				console.log(newVal, oldVal, "卸货地址");
				var xie = this.electronInfo.xie || {};
				if (newVal != oldVal && Object.keys(xie).length > 0) {
					if (this.orderAgain) {
						if (oldVal) {
							this.electronMessage = "您修改了卸货地址，是否更新电子围栏？"
							this.$refs.electronAlert.open();
						}
					} else {
						this.electronMessage = "您修改了卸货地址，是否更新电子围栏？"
						this.$refs.electronAlert.open();
					}
					
				}
			}
		},
		methods: {
			cancelElectron() {
				this.$refs.electronAlert.close()
			},
			jumpToElectron() {
				//跳转设置电子围栏页面
				this.$refs.electronAlert.close();
				var electronInfo = this.electronInfo;
				var zhuang = electronInfo.zhuang || {};
				console.log(electronInfo, "electronInfo");
				if (Object.keys(zhuang).length < 1) {
					this.upDataElectron(1)
				}
				var xie = electronInfo.xie || {};
				if (Object.keys(xie).length < 1) {
					this.upDataElectron(2)
				}
				setTimeout(() => {
					var electronInfo = this.electronInfo;
					console.log(electronInfo, "electronInfo电子围栏信息")
					uni.navigateTo({
						url: './electron/electron?electronInfo=' + JSON.stringify(electronInfo)
					})
				}, 500)
				
			},
			getOrderInfo() {
				// 同步全局数据
				this.showLoadGoods2 = getApp().globalData.showLoadGoods2;
				this.showUnloadGoods2 = getApp().globalData.showUnloadGoods2;
				
				// 其他订单数据在onLoad进行同步
				// console.log('下单页常用数据', getApp().globalData.orderOtherData);
				let orderOtherData = getApp().globalData.orderOtherData;
				this.needReceipt = orderOtherData.needReceipt ? orderOtherData.needReceipt : this.needReceipt;
				this.guaranteeFlag = orderOtherData.guaranteeFlag ? orderOtherData.guaranteeFlag : this.guaranteeFlag;
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
				this.hopePriceSyb = costInformation.hopePriceSyb ? costInformation.hopePriceSyb : '趟';
				this.quotationWay = costInformation.quotationWay;
				this.needInvoiceFlag = costInformation.needInvoiceFlag;
				this.informationFlag = costInformation.informationFlag;
				this.showCostInformation();
				
				let handlingInstructions = getApp().globalData.handlingInstructions;
				// console.log('装卸说明', handlingInstructions);
				this.handingRequiredVal = handlingInstructions.handingRequiredVal;
				this.goodsRemark = handlingInstructions.orderRemark;
				this.showHandingRequiredMsg();
				
				// 车型信息
				let obj = {};
				obj = getApp().globalData.carTypeVo;
				// console.log('全局车型', obj);
				this.vehicleNumber = Number(obj.vehicleNumber);
				this.vehicleModel = '';
				this.vehicleLength = '';
				if(obj.vehicleModel && obj.vehicleModel.length > 0) {
					for(let z in obj.vehicleModel) {
						this.vehicleModel = this.vehicleModel + obj.vehicleModel[z].typeName + '/';
					}
					this.vehicleModel = this.vehicleModel.slice(0, this.vehicleModel.length - 1);
				}
				if(obj.vehicleLength && obj.vehicleLength.length > 0) {
					let lengthSyb = '米';
					for(let z in obj.vehicleLength) {
						this.vehicleLength = this.vehicleLength + obj.vehicleLength[z].typeName + '/';
					}
					if(obj.vehicleLength[0].sid == 'longNoLimit') {
						this.vehicleLength = this.vehicleLength.slice(0, this.vehicleLength.length - 1);
					}else {
						this.vehicleLength = this.vehicleLength.slice(0, this.vehicleLength.length - 1) + lengthSyb;
					}
				}
				// 联系人
				this.defaultContact.userName = getApp().globalData.defaultContact.userName ? getApp().globalData.defaultContact.userName : '';
				this.defaultContact.mobile = getApp().globalData.defaultContact.mobile ? getApp().globalData.defaultContact.mobile : '';
				this.contactUser = getApp().globalData.contactUser;
				
				// 装卸时间
				this.monthCheckVal = getApp().globalData.monthCheckVal;
				this.startCheckedMonth = getApp().globalData.startCheckedMonth;
				this.startHourCheckVal = getApp().globalData.startHourCheckVal;
				
				this.getGlobalGoods();
				
				//地址信息
				console.log('地址信息', getApp().globalData.addressObject);
				this.startAddress1 = getApp().globalData.addressObject.loadGoods1;
				this.endAddress1 = getApp().globalData.addressObject.unloadGoods1;
				this.startAddress2 = getApp().globalData.addressObject.loadGoods2;
				this.endAddress2 = getApp().globalData.addressObject.unloadGoods2;
				// console.log('发货点', this.startAddress2);
				// console.log('卸货点', this.endAddress2);
				if(this.startAddress2.province) {
					this.showLoadGoods2 = true;
				}
				if(this.endAddress2.province) {
					this.showUnloadGoods2 = true;
				}
				// if(!this.startAddress1.address) {
				// 	this.startAddress1 = getApp().globalData.defauleAddress.loadGoods1;
				// }
				// if(!this.endAddress1.address) {
				// 	this.endAddress1 = getApp().globalData.defauleAddress.unloadGoods1;
				// }
				// console.log('默认地址信息', getApp().globalData.defauleAddress);
				
				// 发布范围
				this.creatScope = getApp().globalData.creatScope;
				console.log('发布范围', this.creatScope)
				if(this.checkScopeTypeRepeat(2)) {
					this.guaranteeFlag = 2;
				}
				// console.log('发布范围改变担保',this.guaranteeFlag);
				this.otherShipping.userName = getApp().globalData.otherShipping.userName ? getApp().globalData.otherShipping.userName : '';
				this.otherShipping.userId = getApp().globalData.otherShipping.userId ? getApp().globalData.otherShipping.userId : '';
				this.$forceUpdate();
			},
			getGlobalGoods() { // 获取货物
				let goodsVo = {};
				goodsVo = getApp().globalData.newGoodsObj;
				// console.log('货源信息', goodsVo);
				if(goodsVo.id) {
					this.goodsTypeVo = {
						id: goodsVo.id,
						name: goodsVo.name,
						goodsWeight: goodsVo.goodsWeight ? goodsVo.goodsWeight : '',
						goodsVolume: goodsVo.goodsVolume ? goodsVo.goodsVolume : '',
					}
					this.goodsListData = goodsVo.name;
					if(goodsVo.goodsWeight) {
						
						this.goodsListData = this.goodsListData + ',' + goodsVo.goodsWeight + '吨';
					}
					if(goodsVo.goodsVolume) {
						this.goodsListData = this.goodsListData + ',' + goodsVo.goodsVolume + '方';
					}
					// console.log('货物名称', this.goodsListData);
					// this.setGoodsName = goodsVo.name;
				}else {
					this.cargoUserFind();
				}
			},
			cargoUserFind() { // 货主查询货物
				let that = this;
				let params = {
					"userId": that.userInfo.userId,
					"userCode": that.userInfo.attrs.userCode,
				}
				// console.log('查询参数', params);
				utils.postRequest('/td/order/cargo/user/find', params)
				.then(res=>{
					uni.hideLoading();
					// console.log('我的货物', res);
					if(res.retCode == '0000000') {
						let goodsItem = res.rspBody;
						if(goodsItem && goodsItem.length > 0) {
							that.goodsItem = res.rspBody;
							let obj = goodsItem[0];
							getApp().globalData.newGoodsObj.id = obj.id;
							getApp().globalData.newGoodsObj.name = obj.cargoName;
							that.getGlobalGoods();
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			jumpTovalueAdded() {
				uni.navigateTo({
					url: './valueAdded/valueAdded'
				})
			},
			
			// ==================发货联系人==================
			savePersonContact() {
				if(!this.personName) {
					uni.showToast({
						title: '请填写联系人',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.personTel) {
					uni.showToast({
						title: '请填写联系电话',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if (!(/^1[3456789]\d{9}$/.test(this.personTel)) || this.personTel.length != 11){ // 手机正则表达式
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 3000
					})
					return;
				}
				let obj = {
					mobile: this.personTel,
					userIds: undefined,
					serialnumber: 1,
					userName: this.personName,
				}
				this.contactUser.user1 = {
					mobile: this.personTel,
					userIds: undefined,
					serialnumber: 1,
					userName: this.personName,
				};
				getApp().globalData.contactUser.user1 = obj;
				this.$refs.personContactPopup.close();
			},
			
			// ==================装卸时间==================
			showTimePopup() { // 展示装卸时间弹窗
				this.$refs.timePopup.open();
			},
			closeTimePopup() {
				this.$refs.timePopup.close();
			},
			getDateInfo() { // 获取日期时间数据
				var date1 = new Date();
				// console.log(date1);
				for(let i = 0, maxData = 5; i < maxData; i++) { // 装货时间长度限制5天
					let date2 = new Date(date1);
					date2.setDate(date1.getDate() + i);
					let year = date2.getFullYear() + '';
					let month = (date2.getMonth() + 1);
					month = month < 10 ? '0' + month : month;
					let date = date2.getDate();
					date = date < 10 ? '0' + date : date;
					let timeData = year + '年' + month + '月' + date + '日';
					let monthObj = {
						label: timeData
					}
					this.monthData.push(monthObj);
				}
				this.nowHours = date1.getHours();
				let obj = { // today,tomorrow
					label: "今天或明天",
					dateType: 'tt'
				}
				this.monthData.splice(1, 0, obj);
				
				// console.log('年月日数据', this.monthData);
				for(let i = 0; i < 25; i++) {
					let hours = i < 10 ? '0' + i : i;
					let monthObj1 = {
						hour: hours,
						syb: ':',
						min: '00'
					}
					this.hourData.push(monthObj1);
				}
				// 默认值及初始时间格式转换
				let monthMsg = this.showYearMsg(this.startCheckedMonth, this.monthData[this.startCheckedMonth].label);
				this.newLoadTimeMsg = monthMsg + ' ' + this.hourData[this.startHourCheckVal].hour + this.hourData[this.startHourCheckVal].syb + this.hourData[this.startHourCheckVal].min;
				this.saveDate();
			},
			showYearMsg(key, year) { // 删除年份前2位
				// console.log(key);
				let msg;
				switch(Number(key)) {
					case 0:
						msg = '今天';
						return msg;
					case 1:
						return year;
					case 2:
						msg = '明天' + year.slice(5);
						return msg;
					case 3:
						msg = '后天' + year.slice(5);
						return msg;
					case 4:
						return year.slice(5);
					case 5:
						return year.slice(5);
				}
			},
			showHours(item) { // 若选择今天，则不展示小于当前小时的数据
				if(this.nowHours == 24) {
					return true;
				}
				if(!item.syb) {
					if(this.monthCheckVal == '0') {
						let timeMsg = item.hour.substring(0,2);
						switch(timeMsg) {
							case '凌晨':
								if(this.nowHours > 6) {
									return false;
								}else {
									return true;
								}
								break;
							case '上午':
								if(this.nowHours > 12) {
									return false;
								}else {
									return true;
								}
								break;
							case '下午':
								if(this.nowHours > 18) {
									return false;
								}else {
									return true;
								}
								break;
							case '晚上':
								if(this.nowHours > 23) {
									return false;
								}else {
									return true;
								}
							default:
								return true;
						}
					}else if(this.monthCheckVal == '1') {
						if(item.hour == '全天') {
							return true;
						}else {
							return false;
						}
					}else {
						return true;
					}
				}else {
					if(this.monthCheckVal == '0') {
						if(item.hour < this.nowHours) {
							return false;
						}else {
							if(item.hour > this.nowHours) {
								return true;
							}else {
								return false;
							}
						}
					}else if(this.monthCheckVal == '1') {
						return false;
					}else  {
						return true;
					}
				}
			},
			chooseHour(key) { // 选择时分
				var platform = uni.getSystemInfoSync().platform;
				let startTime;
				startTime = this.monthData[this.monthCheckVal].label + ' ' + this.hourData[key].hour + ':' + this.hourData[key].min;
				startTime = startTime.replace(/年/, '-');
				startTime = startTime.replace(/月/, '-');
				startTime = startTime.replace(/日/, '');
				startTime = startTime + ':00';
				if (platform == "ios") { // 低版本的Safari无法解析new Date('XXXX-XX-XX')，但可以解析new Date('XXXX/XX/XX')格式的时间所以需要把“-”替换为“/”。
					startTime = startTime.replace(/-/g, '/');
				}
				let date = new Date(startTime);
				this.checkHour(key);
				this.$refs.timePopup.close();
			},
			checkHour(checkedKey) { // 匹配时分数据
				this.startHourCheckVal = checkedKey.toString();
				this.startCheckedMonth = this.monthCheckVal;
				let monthMsg = this.showYearMsg(this.startCheckedMonth, this.monthData[this.startCheckedMonth].label);
				this.newLoadTimeMsg = monthMsg + ' ' + this.hourData[this.startHourCheckVal].hour + this.hourData[this.startHourCheckVal].syb + this.hourData[this.startHourCheckVal].min;
				console.log(this.newLoadTimeMsg);
				// 将选择玩的年月日时分秒flag保存
				getApp().globalData.defaultContact.monthCheckVal = this.monthCheckVal;
				getApp().globalData.defaultContact.startCheckedMonth = this.startCheckedMonth;
				getApp().globalData.defaultContact.startHourCheckVal = this.startHourCheckVal;
				this.saveDate();
			},
			checkmonth(key) { // 选择月日
				if(this.monthCheckVal != key) {
					this.monthCheckVal = key;
				}
			},
			saveDate() { // 将日期转变格式用于保存并将选择的key保存在全局
				// console.log('年==>', this.monthData[this.startCheckedMonth].label);
				// console.log('时==>', this.hourData[this.startHourCheckVal].hour);
				// console.log('分==>', this.hourData[this.startHourCheckVal].min);
				let startDate, endDate;
				this.loadTimeVal = [];
				if(this.monthData[this.startCheckedMonth].dateType == 'tt') { // 今天或明天
					startDate = this.monthData['0'].label + ' 00:00:00';
					endDate = this.monthData['2'].label + ' 23:59:59';
					let submitAry = {
						"startDt": this.changeDate(startDate),
						"serialnumber": 1,
						"endDt": this.changeDate(endDate)
					};
					// console.log('选择的日期=>', submitAry);
					this.loadTimeVal.push(submitAry);
				}else {
					if(this.hourData[this.startHourCheckVal].syb) {
						startDate = this.monthData[this.startCheckedMonth].label + ' ' + this.hourData[this.startHourCheckVal].hour + ':00:00';
						endDate = this.monthData[this.startCheckedMonth].label + ' ' + this.hourData[this.startHourCheckVal].hour + ':00:00';
						let submitAry = {
							"startDt": this.changeDate(startDate),
							"serialnumber": 1,
							"endDt": this.changeDate(endDate)
						};
						console.log('选择的日期=>', submitAry);
						this.loadTimeVal.push(submitAry);
					}else { // 全天或上午、下午、晚上时间范围区间
						let checkedHour = this.hourData[this.startHourCheckVal].hour;
						if(checkedHour.length == 2) { // 全天
							startDate = this.monthData[this.startCheckedMonth].label + ' 00:00:00';
							endDate = this.monthData[this.startCheckedMonth].label + ' 23:59:59';
							let submitAry = {
								"startDt": this.changeDate(startDate),
								"serialnumber": 1,
								"endDt": this.changeDate(endDate)
							};
							console.log('选择的日期=>', submitAry);
							this.loadTimeVal.push(submitAry);
						}else { // 凌晨、上午、下午、晚上时间范围区间
							let hour = checkedHour.slice(2);
							let hourAry = hour.split('-');
							startDate = this.monthData[this.startCheckedMonth].label + ' ' + hourAry['0'] + ':00';
							endDate = this.monthData[this.startCheckedMonth].label + ' ' + hourAry['1'] + ':00';
							let submitAry = {
								"startDt": this.changeDate(startDate),
								"serialnumber": 1,
								"endDt": this.changeDate(endDate)
							};
							console.log('选择的日期=>', submitAry);
							this.loadTimeVal.push(submitAry);
						}
					}
				}
			},
			changeDate(str) {
				let dateMsg = str.replace(/年/g, '-');
				dateMsg = dateMsg.replace(/月/g, '-');
				return dateMsg = dateMsg.replace(/日/g, '');
			},
			// ==================费用信息==================
			showCostInformation() { // 展示费用信息
				let returnMsg = '';
				if(this.quotationWay == 1) {
					returnMsg = '固价' + this.hopePrice + '元/' + this.hopePriceSyb + '，';
				}else {
					returnMsg = '价格电议，' + this.hopePriceSyb + '，';
				}
				if(this.needInvoiceFlag == 1) {
					returnMsg = returnMsg + '线上支付';
				}else {
					returnMsg = returnMsg + '线下支付';
				}
				let infoPrice = this.infoPrice ? this.infoPrice : 0;
				returnMsg = returnMsg + '，订金' + infoPrice + '元';
				returnMsg = this.informationFlag == 1 ? returnMsg + '，退还' : returnMsg + '，不退还';
				this.costInformationMsg = returnMsg;
				// console.log(this.costInformationMsg);
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
				if(goodsVo.id) {
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
				console.log(lat1, lng1, lat2, lng2);
			 	if(!lat1 || !lng1 || !lat2 || !lng2) {
			 		return 0;
			 	}
			 	return service.getDistance(lat1, lng1, lat2, lng2);
			},
			getEstimatedDistance() { // 获取高德API路径规划距离，若没有取到则使用老的经纬度计算
				// console.log('防抖', utils.btnRepeat());
				// if(!utils.btnRepeat()) return false; // 防抖
				if(this.isSendOrder) return false;
				this.isSendOrder = true;
				uni.showLoading({
				    title: '加载中'
				});
				let addressAry = [];
				if(this.startAddress1.province) {
					addressAry.push(this.startAddress1);
				}
				if(this.startAddress2.province) {
					addressAry.push(this.startAddress2);
				}
				if(this.endAddress1.province) {
					addressAry.push(this.endAddress1);
				}
				if(this.endAddress2.province) {
					addressAry.push(this.endAddress2);
				}
				// console.log('地址信息', addressAry);
				let firstAddress = addressAry['0'];
				let origin = 'origin=' + firstAddress.longitude + ',' + firstAddress.latitude;
				let lastAddress = addressAry.pop();
				let destination = '&destination=' + lastAddress.longitude + ',' + lastAddress.latitude;
				let gdApiObj = 'key=3d7bc60f07018e1f3f9ad969f642d780&' + origin + destination + '&strategy=32' + '&show_fields=cost';
				let that = this;
				uni.request({
					url: 'https://restapi.amap.com/v5/direction/driving?' + gdApiObj,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						// console.log('驾车路线规划成功', res);
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
				
				let addressAry = [];
				if(this.startAddress1.province) {
					addressAry.push(this.startAddress1);
				}
				if(this.startAddress2.province) {
					addressAry.push(this.startAddress2);
				}
				if(this.endAddress1.province) {
					addressAry.push(this.endAddress1);
				}
				if(this.endAddress2.province) {
					addressAry.push(this.endAddress2);
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
				
				if(!this.startAddress1.province) {
					uni.showToast({
						title: '请选择装货点',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.endAddress1.province) {
					uni.showToast({
						title: '请选择卸货点',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				
				let carTypeVoObj = getApp().globalData.carTypeVo;
				// console.log(carTypeVoObj);
				if(!carTypeVoObj.vehicleModel || carTypeVoObj.vehicleModel.length == 0) {
					uni.showToast({
						title: '请选择车型',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!carTypeVoObj.vehicleLength || carTypeVoObj.vehicleLength.length == 0) {
					uni.showToast({
						title: '请选择车长',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				// console.log('车型车长', vehicleLength, vehicleModel );
				console.log(Number(this.servicePrice));
				if(this.guaranteeFlag == 1) {
					if(!this.declaredValue || !Number(this.declaredValue)) {
						uni.showToast({
							title: '请填写货物声明价值',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
					if(!Number(this.servicePrice)) {
						uni.showToast({
							title: '货物声明价值过低，请重新填写',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
				}
				if(!this.agreementFlag) {
					uni.showToast({
						title: '请阅读并同意货物运输协议',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.creatScope.creatScopeType || this.checkScopeTypeRepeat(1)) {
					if(this.bksPRice < this.vosPrice) {
						this.$refs.notEnoughPrice.open();
						return false;
					}
				}
				
				if(this.quotationWay == 1) {
					if(this.hopePriceSyb == '趟') {
						if(Number(this.hopePrice) < 300 || Number(this.hopePrice) == 300) {
							this.$refs.hopePriceHintPopup.open();
							return false;
						}
					}
				}
				//如果没有电子围栏，自动设置装卸地址为电子围栏
				
				// this.$refs.confirmPopup.open();
				this.getEstimatedDistance();
			},
			submitOrder() { // 提交订单
				let carTypeVoObj = getApp().globalData.carTypeVo;
				console.log(carTypeVoObj);
				let vehicleLength = [];
				let vehicleModel = [];
				for(let i in carTypeVoObj.vehicleLength) {
					let lObj = {};
					lObj = {
						sid: carTypeVoObj.vehicleLength[i].sid,
						vehicleLength: carTypeVoObj.vehicleLength[i].sid == 'longNoLimit' ? -1 : carTypeVoObj.vehicleLength[i].typeName,
						vehicleLengthCode: carTypeVoObj.vehicleLength[i].sid,
					}
					vehicleLength.push(lObj);
				}
				for(let i in carTypeVoObj.vehicleModel) {
					let mObj = {};
					mObj = {
						sid: carTypeVoObj.vehicleModel[i].sid,
						vehicleModel: carTypeVoObj.vehicleModel[i].typeName,
						vehicleModelCode: carTypeVoObj.vehicleModel[i].sid,
					}
					vehicleModel.push(mObj);
				}
				// console.log('车型车长', vehicleLength, vehicleModel );
				
				console.log('装货地', this.startAddress1);
				console.log('卸货地', this.endAddress1);
				let newAryString = [];
				if(this.startAddress1.province) {
					let objStr = {...this.startAddress1, 'serialnumber': 1};
					newAryString.push(objStr);
				}
				if(this.startAddress2.province) {
					let objStr = {...this.startAddress2, 'serialnumber': 2};
					newAryString.push(objStr);
				}
				if(this.endAddress1.province) {
					let objStr = {...this.endAddress1, 'serialnumber': 3};
					newAryString.push(objStr);
				}
				if(this.endAddress2.province) {
					let objStr = {...this.endAddress2, 'serialnumber': 4};
					newAryString.push(objStr);
				}
				let addressAry = [];
				for(let i in newAryString) {
					let newObj = newAryString[i];
					for(let key in newObj ) {
						if(newObj[key] == '') {
							delete newObj[key];
						}
					}
					addressAry.push(newObj);
				}
				let contactUser = [];
				if(this.contactUser.user1.userName) {
					contactUser.push(this.contactUser.user1)
				}
				if(this.contactUser.user2.userName) {
					contactUser.push(this.contactUser.user2)
				}
				if(this.contactUser.user3.userName) {
					contactUser.push(this.contactUser.user3)
				}
				if(this.contactUser.user4.userName) {
					contactUser.push(this.contactUser.user4)
				}
				let contactUserAry = []; // 联系人
				let contactObj = {};
				contactObj.userName = contactUser[0] ? contactUser[0].userName : this.defaultContact.userName;
				contactObj.mobile = contactUser[0] ? contactUser[0].mobile : this.defaultContact.mobile;
				contactObj.serialnumber = addressAry[0].serialnumber;
				contactObj.userid = 0;
				// console.log('修改后的信息', contactObj);
				contactUserAry.push(contactObj);
				// console.log('联系人信息', contactUserAry);
				let orderLoadFactorVOS = [];
				if(this.handingRequiredVal.length > 0) {
					for(let a in this.handingRequiredVal) {
						let obj = {};
						obj = {
							loadFactor: this.handingRequiredVal[a].typeName,
							loadFactorCode: this.handingRequiredVal[a].sid,
						}
						orderLoadFactorVOS.push(obj);
					}
				}
				this.declaredValue = this.guaranteeFlag == 1 ? Number(this.declaredValue).toFixed(2) : this.declaredValue;
				
				// 固定价格
				let hopeNumAry = '';
				let hopeTotal = '';
				if(this.quotationWay == 1) {
					this.hopePrice = this.hopePrice.toString();
					hopeNumAry = this.hopePrice.split('.');
					hopeTotal = Number(hopeNumAry['0']) * 100;
					if(hopeNumAry['1']) {
						if(hopeNumAry['1'].length == 1) {
							hopeNumAry['1'] = hopeNumAry['1'] + '0'
						}
						hopeTotal = hopeTotal + Number(hopeNumAry['1'])
					}
				}
				// 信息费
				let infoNumAry = '';
				let infoTotal = 0;
				if(this.infoPrice) {
					this.infoPrice = this.infoPrice.toString();
					infoNumAry = this.infoPrice.split('.');
					infoTotal = Number(infoNumAry['0']) * 100;
					if(infoNumAry['1']) {
						if(infoNumAry['1'].length == 1) {
							infoNumAry['1'] = infoNumAry['1'] + '0'
						}
						infoTotal = infoTotal + Number(infoNumAry['1'])
					}
				}
				
				// 声明价值
				let declaredNumAry = '';
				let declaredTotal = '';
				if(this.guaranteeFlag == 1) {
					this.declaredValue = this.declaredValue.toString();
					declaredNumAry = this.declaredValue.split('.');
					declaredTotal = Number(declaredNumAry['0']) * 100;
					if(declaredNumAry['1']) {
						if(declaredNumAry['1'].length == 1) {
							declaredNumAry['1'] = declaredNumAry['1'] + '0'
						}
						declaredTotal = declaredTotal + Number(declaredNumAry['1'])
					}
				}
				// console.log('声明价值', declaredTotal);
				// console.log('固定价格', this.hopePrice);
				let params = {
					cargoName: this.goodsTypeVo.name,
					cargoId: this.goodsTypeVo.id,
					cargoWeight: this.goodsTypeVo.goodsWeight ? this.goodsTypeVo.goodsWeight : undefined,
					cargoVolume: this.goodsTypeVo.goodsVolume ? this.goodsTypeVo.goodsVolume : undefined,
					remark: this.goodsRemark,
					orderType: 1,
					receiptType: this.needReceipt ? 1 : 0,
					fixPriceFlag: this.quotationWay == 1 ? 1 : 2,
					fixPrice: this.quotationWay == 1 ? hopeTotal : undefined,
					multiTruck: this.vehicleNumber ? Number(this.vehicleNumber) : 1,
					supply: this.creatScope.creatScopeType && this.creatScope.creatScopeType.length == 1 ? this.creatScope.creatScopeType[0] : 9,
					fleetSids: this.checkScopeTypeRepeat(2) ? JSON.stringify(this.creatScope.checkedGroup) : undefined,
					confirmType: 1, // 2022.6.1,需求改为固价货源均不需要货主确认司机的报价单
					estimatedDistance: Number(this.estimatedDistance).toFixed(0),
					needInvoiceFlag: this.needInvoiceFlag == 1 ? 1 : undefined, // 是否需要开票
					cargoSource: 'app',
					shipperVerify: 1,
					forbiddenZoneType: 0,
					informationFlag: this.informationFlag,
					child: {
						orderAddressVOS: addressAry, //装卸点地址
						orderContactsVOS: contactUserAry, // 联系人
						orderLoadFactorVOS: orderLoadFactorVOS, // 装载要求
						orderLoadTimeRecordVO: this.loadTimeVal,
						orderQuoteVO: {
							informationPrice: infoTotal,
							quotePriceTimeType: 1,
							quotePriceType: 1,
							quotePriceTypeName: this.hopePriceSyb ? this.hopePriceSyb : undefined
						}, // 价格集合
						orderValueAddedVOS: {
							cargoDamageFlag: this.guaranteeFlag == 1 ? 1 : 0,
							shortLandedFlag: 1,
							declaredValue: this.guaranteeFlag == 1 ? declaredTotal : undefined
						},
						orderVehicleLengthVOs: vehicleLength,
						orderVehicleModelVOS: vehicleModel
					},
				}
				
				//电子围栏
				var electronInfo = this.electronInfo;
				var zhuang = electronInfo.zhuang;
				var xie = electronInfo.xie;
				var orderFenceVOS = [];
				if (zhuang.fenceRadius > 0) {
					orderFenceVOS.push(zhuang)
				} else {
					//装货地址设置电子围栏
					orderFenceVOS.push({
						addressCenter: addressAry[0].address,
						longitude: addressAry[0].longitude,
						latitude: addressAry[0].latitude,
						fenceType: 1,
						fenceRadius: 10000,
					})
				}
				if (xie.fenceRadius > 0) {
					orderFenceVOS.push(xie)
				} else {
					//卸货地设置电子围栏
					orderFenceVOS.push({
						addressCenter: addressAry[addressAry.length - 1].address,
						longitude: addressAry[addressAry.length - 1].longitude,
						latitude: addressAry[addressAry.length - 1].latitude,
						fenceType: 2,
						fenceRadius: 10000,
					})
				}
				if (orderFenceVOS.length > 0) {
					params.orderFenceVOS = orderFenceVOS;
					params.child.orderFenceVOS = orderFenceVOS;
				}
				
				console.log('询价参数', params);
				// uni.hideLoading();
				let that = this;
				utils.postRequest('/td/order/normal/push', params)
				.then(res=>{
					console.log('询价成功', res);
					that.isSendOrder = false;
					if(res.retCode == '0000000') {
						// that.saveAddressToHistory();
						if(that.needInvoiceFlag == 1) {
							if(res.rspBody.createSyncFlag == 2) {
								uni.showToast({
									title: res.rspBody.successSyncDesc,
									icon: 'none',
									duration: 2000
								})
								return false
							}
						}
						uni.showToast({
							title: '您已成功发布！',
							icon: 'success',
							duration: 2000
						})
						if(that.saveCommonly) {
							that.changeCommonState(res.rspBody.sid)
						}
						setTimeout(() => {
							uni.hideLoading();
							uni.$emit("changeUserRefresh");
							publicData.deleteShipOrderDetails();
							// uni.switchTab({
							// 	url: '../index/index'
							// });
							uni.navigateBack();
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
					that.isSendOrder = false;
					console.log(err);
					uni.hideLoading();
				})
			},
			changeCommonState(sid) { // 存为常发货源
				// if(!utils.btnRepeat()) return false; // 防抖
				// if(this.orderDetailInfo.commonUseState == 1) return false;
				let params = {
					sid: sid,
					commonUseState: 1,
				}
				let that = this;
				utils.postRequest('/td/order/commonUseState', params)
				.then(function (res) {
					console.log('保存常发结果', res);
				})
				.catch(err=>{
				})
			},
			
			// ==================添加装货点==================
			addDeliverGood(flag) { // 新增装货点
				switch(flag) {
					case 1:
						if(this.startAddress1.province) {
							this.showLoadGoods2 = true;
							getApp().globalData.showLoadGoods2 = true;
						}else {
							uni.showToast({
								title: '请选择装货点1',
								icon: 'none',
								duration: 3000
							})
						}
						break;
					case 2:
						if(this.endAddress1.province) {
							this.showUnloadGoods2 = true;
							getApp().globalData.showUnloadGoods2 = true;
						}else {
							uni.showToast({
								title: '请选择卸货点1',
								icon: 'none',
								duration: 3000
							})
						}
						break;
				}
			},
			deleteDeliverGood(flag) { // 删除装/卸货点
				switch(flag) {
					case 1:
						this.showLoadGoods2 = false;
						getApp().globalData.addressObject.loadGoods2 = {};
						this.startAddress2 = {};
						break;
					case 2:
						this.showUnloadGoods2 = false;
						getApp().globalData.addressObject.unloadGoods2 = {};
						this.endAddress2 = {};
						break;
				}
			},
			
			// ==================装载要求类==================
			showHandingRequiredMsg() { // 展示装卸要求
			// 带雨布、需提供装卸、要求在途时效10小时、温控10℃-18℃、货主提供温度监控仪
				let msg = '';
				if(this.handingRequiredVal.length > 0) {
					for(let a in this.handingRequiredVal) {
						if(this.handingRequiredVal[a].sid == 'diyHeight') {
							msg = msg + '限高' + this.handingRequiredVal[a].typeName + '米、';
						}else if(this.handingRequiredVal[a].sid == 'diyLayer') {
							msg = msg + '堆垛' + this.handingRequiredVal[a].typeName + '层、';
						}else {
							msg = msg + this.handingRequiredVal[a].typeName + '、';
						}
					}
					msg = msg.slice(0, msg.length - 1);
				}
				if(this.goodsRemark) {
					msg = msg ? msg + '、' + this.goodsRemark : this.goodsRemark;
				}
				this.handingRequiredMsg = '';
				this.handingRequiredMsg = msg;
			},
			
			// ==================担保服务==================
			getDeclaredFocus() {
				if(this.guaranteeFlag == 1) return false; 
				this.guaranteeFlag = 1;
				setTimeout(()=>{
					this.declaredFocus = true;
				}, 100)
			},
			
			// ==================搜索地址相关==================
			jumpToChooseArea() {
				let areaObj = {
					province: this.addressPopupObj.province,
					provinceCode: this.addressPopupObj.provinceCode,
					city: this.addressPopupObj.city,
					cityCode: this.addressPopupObj.cityCode,
					area: this.addressPopupObj.area,
					areaCode: this.addressPopupObj.areaCode,
				}
				let areaMsg = JSON.stringify(areaObj);
				uni.navigateTo({ // 创建地址需根据点击的装货地或卸货地改变地址选择页的页面名称
					url: '/pages/chooseArea/chooseArea?addressTypeKey=' + this.addressTypeKey + '&addressTypeNum=' + this.addressTypeNum + '&areaMsg=' + areaMsg
				})
			},
			showAddressPopup(addressTypeKey,addressTypeNum) {
				this.addressTypeKey = addressTypeKey;
				this.addressTypeNum = addressTypeNum;
				this.addressPopupObj = {
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
					address: '',
					userName: '',
					mobile: '',
					longitude: '',
					latitude: ''
				};
				switch(this.addressTypeKey) {
					case 1:
						if(this.addressTypeNum == 1) {
							if(this.startAddress1.province) {
								this.addressPopupObj= {...this.startAddress1}
							}
						}else {
							if(this.startAddress2.province) {
								this.addressPopupObj= {...this.startAddress2}
							}
						}
						break;
					case 2:
						if(this.addressTypeNum == 1) {
							if(this.endAddress1.province) {
								this.addressPopupObj= {...this.endAddress1}
							}
						}else {
							if(this.endAddress2.province) {
								this.addressPopupObj= {...this.endAddress2}
							}
						}
						break;
				}
				this.$refs.editAddressPopup.open();
			},
			closeAddressPopup() {
				this.$refs.editAddressPopup.close();
			},
			getAddressLocation(flag) {
				let geoMsg = this.addressPopupObj.province;
				geoMsg = this.addressPopupObj.city ? geoMsg + this.addressPopupObj.city : geoMsg;
				geoMsg = this.addressPopupObj.area ? geoMsg + this.addressPopupObj.area : geoMsg;
				let that = this;
				uni.request({
					url: '	https://restapi.amap.com/v5/place/text?' + 'key=3d7bc60f07018e1f3f9ad969f642d780&keywords=' + geoMsg + this.addressPopupObj.address,
					method: 'GET',
					data: {},
					header: {},
					success: (res) => {
						console.log('第一次地址解析参数', geoMsg + this.addressPopupObj.address);
						console.log('第一次地址解析成功', res);
						let rspBody = res.data;
						if(rspBody.status == '1' && Number(rspBody.count) > 0) {
							let ary = res.data.pois;
							let locationAry = ary[0].location.split(',');
							let returnObj = {
								latitude: locationAry['1'],
								longitude: locationAry['0'],
							}
							if(flag == 1) {
								that.setMapLocationLon(returnObj);
							}else {
								that.saveLocationLon(returnObj);
							}
						}else {
							if(geoMsg) {
								uni.request({
									url: '	https://restapi.amap.com/v5/place/text?' + 'key=3d7bc60f07018e1f3f9ad969f642d780&keywords=' + geoMsg,
									method: 'GET',
									data: {},
									header: {},
									success: (resSec) => {
										console.log('第二次地址解析参数', geoMsg);
										console.log('第二次地址解析成功', resSec);
										let rspBody = resSec.data;
										if(rspBody.status == '1' && Number(rspBody.count) > 0) {
											let ary = resSec.data.pois;
											let locationAry = ary[0].location.split(',');
											let returnObj = {
												latitude: locationAry['1'],
												longitude: locationAry['0'],
											}
											if(flag == 1) {
												that.setMapLocationLon(returnObj);
											}else {
												that.saveLocationLon(returnObj);
											}
										}else {
											if(flag == 1) {
												that.setMapLocationLon('');
											}else {
												that.saveLocationLon('');
											}
										}
									},
									fail: (errSec) => {
										if(flag == 1) {
											that.setMapLocationLon('');
										}else {
											that.saveLocationLon('');
										}
									},
								});
							}else {
								if(flag == 1) {
									that.setMapLocationLon('');
								}else {
									that.saveLocationLon('');
								}
							}
						}
					},
					fail: (err) => {
						console.log('失败', err);
						if(flag == 1) {
							that.setMapLocationLon('');
						}else {
							that.saveLocationLon('');
						}
					},
				});
			},
			chooseLocation() { //地图选点
				let that = this;
				if(that.addressPopupObj.latitude && that.addressPopupObj.longitude) { // 有经纬度则直接调用api
					uni.chooseLocation({
						latitude: that.addressPopupObj.latitude,
						longitude: that.addressPopupObj.longitude,
						success: function(res) {
							console.log('地图选择的地址1', JSON.stringify(res))
							that.addrToDetail(res.address, res.longitude, res.latitude);
						},
					});
				}else { // 没有经纬度则拼接省市区及详细地址去获取经纬度
					if(that.addressPopupObj.province || that.addressPopupObj.address) {
						that.getAddressLocation(1);
					}else {
						uni.chooseLocation({
							success: function(res) {
								console.log('地图选择的地址4', JSON.stringify(res))
								that.addrToDetail(res.address, res.longitude, res.latitude);
							},
						});
					}
				}
			},
			setMapLocationLon(locationObj) {
				let that = this;
				if(locationObj) {
					uni.chooseLocation({
						latitude: locationObj.latitude,
						longitude: locationObj.longitude,
						success: function(res) {
							console.log('地图选择的地址2', JSON.stringify(res))
							that.addrToDetail(res.address, res.longitude, res.latitude);
						},
					});
				}else {
					uni.chooseLocation({
						success: function(res) {
							console.log('地图选择的地址3', JSON.stringify(res))
							that.addrToDetail(res.address, res.longitude, res.latitude);
						},
					});
				}
				uni.hideLoading();
			},
			addrToDetail(address, longitude, latitude) {
				uni.showLoading();
				console.log('地址', address);
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
							let provinceCode = (regeocode.addressComponent.adcode.substr(0,2)) + '0000';
							that.addressPopupObj.province = regeocode.addressComponent.province;
							that.addressPopupObj.provinceCode = provinceCode;
							that.addressPopupObj.area = regeocode.addressComponent.district;
							that.addressPopupObj.areaCode = regeocode.addressComponent.adcode;
							that.addressPopupObj.longitude = longitude;
							that.addressPopupObj.latitude = latitude;
							that.addressPopupObj.address = address;
							console.log(that.addressPopupObj);
							if(provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode == '120000') {
								that.addressPopupObj.city = regeocode.addressComponent.district;
								that.addressPopupObj.cityCode = regeocode.addressComponent.adcode;
								that.addressPopupObj.area = '';
								that.addressPopupObj.areaCode = '';
							}else {
								let cityCode = (regeocode.addressComponent.adcode.substr(0,4)) + '00';
								if(regeocode.addressComponent.city && regeocode.addressComponent.city.length > 0) {
									that.addressPopupObj.city = regeocode.addressComponent.city;
									that.addressPopupObj.cityCode = cityCode;
								}else {
									that.addressPopupObj.city = regeocode.addressComponent.district;
									that.addressPopupObj.cityCode = regeocode.addressComponent.adcode;
									that.addressPopupObj.area = '';
									that.addressPopupObj.areaCode = '';
								}
							}
						}else {
							uni.showToast({
							    title: '地址解析失败，请更换地址或重新选择！',
								icon: 'none',
							    duration: 3000
							});
						}
					},
					fail: (err) => {
						console.log('失败', err);
						uni.showToast({
						    title: '地址解析失败，请更换地址或重新选择！',
							icon: 'none',
						    duration: 3000
						});
					},
					complete: (com) => {
						uni.hideLoading();
					}
				});
			},
			checkLongitude() { // 检查经纬度
				console.log('检查经纬度');
				if(!this.addressPopupObj.province) {
					uni.showToast({
					    title: '请选择地区！',
						icon: 'none',
					    duration: 3000
					});
					return;
				};
				uni.showLoading();
				if(!this.addressPopupObj.longitude || !this.addressPopupObj.latitude) {
					this.getAddressLocation(2)
				}else {
					this.saveAddressEdit();
				}
			},
			saveLocationLon(obj) {
				let locationObj = obj;
				if(locationObj) {
					this.addressPopupObj.longitude = locationObj.longitude;
					this.addressPopupObj.latitude = locationObj.latitude;
				}
				console.log('经纬度', locationObj);
				this.saveAddressEdit();
			},
			saveAddressEdit() { // 保存地址
				console.log(this.addressPopupObj);
				// addressTypeKey: 0, // 装货地：1，卸货地：2。主要为判断装货地还是卸货地
				// addressTypeNum: 0, // 装货地1：1，装货地2：2，卸货地1：1，卸货地2：2。主要为判断多装多卸
				if(this.checkAddressStrRepeat(this.addressTypeKey)) { // 保存的地址是否于数组内有重复,检查通过为true，有重复为false
					this.saveAddressToHistory(this.addressTypeKey); // 点击确定后区分装卸货地址，将地址保存至历史地址
				}
				switch(this.addressTypeKey) {
					case 1:
						if(this.addressTypeNum == 1) {
							this.startAddress1 = {...this.addressPopupObj}
							getApp().globalData.addressObject.loadGoods1 = {...this.addressPopupObj};
							
						}else {
							this.startAddress2 = {...this.addressPopupObj}
							getApp().globalData.addressObject.loadGoods2 = {...this.addressPopupObj};
							
						}
						break;
					case 2:
						if(this.addressTypeNum == 1) {
							this.endAddress1 = {...this.addressPopupObj}
							getApp().globalData.addressObject.unloadGoods1 = {...this.addressPopupObj};
						}else {
							this.endAddress2 = {...this.addressPopupObj}
							getApp().globalData.addressObject.unloadGoods2 = {...this.addressPopupObj};
						}
						
						break;
				}
				this.$refs.editAddressPopup.close();
				uni.hideLoading();
				
			},
			upDataElectron(index) {
				var electronInfo = this.electronInfo;
				var zhuang = electronInfo.zhuang || {};
				var xie = electronInfo.xie || {};
				
				var startAddress1 = this.startAddress1;
				if (index == 1 && startAddress1.longitude) {
					zhuang.longitude = startAddress1.longitude;
					zhuang.latitude = startAddress1.latitude;
					zhuang.fenceType = 1;
					zhuang.addressCenter = startAddress1.address;
					
				} else {
					var endAddress1 = this.endAddress1;
					var endAddress2 = this.endAddress2;
					if (endAddress2.longitude) {
						xie.longitude = endAddress2.longitude;
						xie.latitude = endAddress2.latitude;
						xie.fenceType = 2;
						xie.addressCenter = endAddress2.address;
					} else if (endAddress1.longitude) {
						xie.longitude = endAddress1.longitude;
						xie.latitude = endAddress1.latitude;
						xie.fenceType = 2;
						xie.addressCenter = endAddress1.address;
					}
					
				}
				electronInfo.zhuang = zhuang;
				electronInfo.xie = xie;
				this.electronInfo = electronInfo;
				
			},
			checkAddressStrRepeat(addressTypeKey) {
				let addressAry = addressTypeKey == 1 ? [...this.sendHisInfo] : [...this.unLoadHisInfo];
				if(!addressAry || addressAry.length == 0) {
					return true;
				}else {
					let str = JSON.stringify(this.addressPopupObj);
					for(let i in addressAry) {
						let objStr = JSON.stringify({
							province: addressAry[i].provinceName ? addressAry[i].provinceName : '',
							provinceCode: addressAry[i].provinceCode ? addressAry[i].provinceCode : '',
							city: addressAry[i].cityName ? addressAry[i].cityName : '',
							cityCode: addressAry[i].cityCode ? addressAry[i].cityCode : '',
							area: addressAry[i].areaName ? addressAry[i].areaName : '',
							areaCode: addressAry[i].areaCode ? addressAry[i].areaCode : '',
							address: addressAry[i].addressDetail ? addressAry[i].addressDetail : '',
							userName: addressAry[i].name ? addressAry[i].name : '',
							mobile: addressAry[i].mobile ? addressAry[i].mobile : '',
							longitude: addressAry[i].longitude ? addressAry[i].longitude : '',
							latitude: addressAry[i].latitude ? addressAry[i].latitude : '',
						})
						if(str == objStr) {
							return false;
						}
					}
					return true;
				}
			},
			saveAddressToHistory(addressTypeKey) {
				let params = {
					provinceName: this.addressPopupObj.province ? this.addressPopupObj.province : undefined,
					provinceCode: this.addressPopupObj.provinceCode ? this.addressPopupObj.provinceCode : undefined,
					cityName: this.addressPopupObj.city ? this.addressPopupObj.city : undefined,
					cityCode: this.addressPopupObj.cityCode ? this.addressPopupObj.cityCode : undefined,
					areaName: this.addressPopupObj.area ? this.addressPopupObj.area : undefined,
					areaCode: this.addressPopupObj.areaCode ? this.addressPopupObj.areaCode : undefined,
					addressDetail: this.addressPopupObj.address ? this.addressPopupObj.address : undefined,
					name: this.addressPopupObj.userName ? this.addressPopupObj.userName : undefined,
					mobile: this.addressPopupObj.mobile ? this.addressPopupObj.mobile : undefined,
					longitude: this.addressPopupObj.longitude ? this.addressPopupObj.longitude : undefined,
					latitude: this.addressPopupObj.latitude ? this.addressPopupObj.latitude : undefined,
					shipperId: this.userInfo.userId,
					shipperUserCode: this.userInfo.attrs.userCode,
					addressFlag: addressTypeKey
				}
				console.log('保存地址参数', params);
				let that = this;
				utils.postRequest('/td/order/shipper/address/save', params)
				.then(function (res) {
					console.log('保存地址结果', res);
					uni.hideLoading();
					if(res.retCode == '0000000') {
						switch(addressTypeKey) {
							case 1:
								that.getSendHisAddress();
								// that.sendHisInfo.unshift(params)
								break;
							case 2:
								that.getUnloadingHisAddress();
								// that.unLoadHisInfo.unshift(params)
								break;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 5000
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			getSendHisAddress() { // 获取历史装货地址
				let params = {
					shipperId: this.userInfo.userId,
					addressFlag: 1,
					pageSize: 10
				}
				console.log('查询装货地址参数', params);
				let that = this;
				utils.postRequest('/td/order/shipper/address/find', params)
				.then(function (res) {
					// console.log('查询装货地址结果', res);
					uni.hideLoading();
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody.items;
						if(rspBody && rspBody.length > 0) {
							that.sendHisInfo = [...rspBody];
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 5000
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			getUnloadingHisAddress() { // 获取历史卸货地址
				// unLoadHisInfo: [],
				let params = {
					shipperId: this.userInfo.userId,
					addressFlag: 2,
					pageSize: 10
				}
				console.log('查询卸货地址参数', params);
				let that = this;
				utils.postRequest('/td/order/shipper/address/find', params)
				.then(function (res) {
					// console.log('查询卸货地址结果', res);
					uni.hideLoading();
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody.items;
						if(rspBody && rspBody.length > 0) {
							that.unLoadHisInfo = [...rspBody];
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 5000
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			getPopupAddressInfo() { // 将地址选择页保存的全局舒服赋值到弹窗地址
				let newAddressChooseSerial = getApp().globalData.newChooseAddressObj;
				if(newAddressChooseSerial && newAddressChooseSerial.province) {
					this.addressPopupObj.province = newAddressChooseSerial.province ? newAddressChooseSerial.province : '';
					this.addressPopupObj.provinceCode = newAddressChooseSerial.provinceCode ? newAddressChooseSerial.provinceCode : '';
					this.addressPopupObj.city = newAddressChooseSerial.city ? newAddressChooseSerial.city : '';
					this.addressPopupObj.cityCode = newAddressChooseSerial.cityCode ? newAddressChooseSerial.cityCode : '';
					this.addressPopupObj.area = newAddressChooseSerial.area ? newAddressChooseSerial.area : '';
					this.addressPopupObj.areaCode = newAddressChooseSerial.areaCode ? newAddressChooseSerial.areaCode : '';
					this.addressPopupObj.address = '';
					this.addressPopupObj.longitude = '';
					this.addressPopupObj.latitude = '';
					getApp().globalData.newChooseAddressObj = {};
				}
			},
			getElectronInfo() {
				let electronInfo = getApp().globalData.electronInfo;
				console.log(electronInfo, "再来一单的电子围栏信息")
				if (!electronInfo) return;
				this.electronInfo = electronInfo;
				getApp().globalData.electronInfo = null;
			},
			popupAddressChange(e) {
				this.addressPopupObj.longitude = '';
				this.addressPopupObj.latitude = '';
			},
			
			// ==================其他==================
			checkScopeTypeRepeat(val) { // 重复判断
				for(let i in this.creatScope.creatScopeType) {
					if(this.creatScope.creatScopeType[i] == val) {
						return true;
					}
				}
			},
			showCreatScope() { // 展示发布范围
				let creatScopeType = this.creatScope.creatScopeType;
				let typeMsg = '';
				if(creatScopeType && creatScopeType.length == 1) {
					let type = creatScopeType[0];
					if(type == 1) {
						typeMsg = '发布至全平台';
					}else {
						let ary = this.creatScope.checkedGroup;
						typeMsg = '发布至' + ary.length + '个车队';
					}
				}else {
					typeMsg = '发布至全平台';
					let ary = this.creatScope.checkedGroup;
					typeMsg = typeMsg + '，发布至' + ary.length + '个车队';
				}
				return typeMsg;
			},
			jumpToCostInformation() { // 选择费用说明
				uni.navigateTo({
				    url: './costInformation/costInformation'
				});
			},
			jumpToCreatScope() { // 发布范围
				uni.navigateTo({
				    url: './creatScope/creatScope'
				});
			},
			jumpToCarType() { // 选择车型
				uni.navigateTo({
				    url: '../carType/carType'
				});
			},
			jumpToHandlingInstructions() { // 装卸说明
				uni.navigateTo({
				    url: './handlingInstructions/handlingInstructions'
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
			getMarginVOShipper() { // 获取保证金
				utils.postRequest('/td/driver/home/getMarginVOShipper')
				.then(res=>{
					// console.log('保证金', res);
					this.vosPrice = res.rspBody.margin;
				})
				.catch(err=>{
					console.log(err);
				})
			},
			getAccountBkShipper() { // 获取余额
				utils.postRequest('/td/driver/home/getAccountBkShipper')
				.then(res=>{
					// console.log('余额', res);
					if(res.rspBody && res.rspBody.allAmountWithIn) {
						this.bksPRice = res.rspBody.allAmountWithIn / 1000;
					}else {
						this.bksPRice = 0;
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			closeHopePriceHintPopup() {
				this.$refs.hopePriceHintPopup.close();
			},
			toOpenOrderMsgConfirmPopup() {
				if(!utils.btnRepeat()) return false; // 防抖
				this.$refs.hopePriceHintPopup.close();
				// this.$refs.confirmPopup.open();
				this.getEstimatedDistance();
			},
			jumpToTopUp() {
				if(!utils.btnRepeat()) return false; // 防抖
				this.$refs.notEnoughPrice.close();
				uni.navigateTo({
				    url: '../userCenter/userWallet/topUp'
				});
			},
			jumpToGoodsDetails() { // 跳转物品选择
				uni.navigateTo({
				    url: './goodsDetails/goodsDetails'
				});
			},
			toChooseContact() { // 选择联系人
				// uni.navigateTo({
				//     url: '../personContact/personContact'
				// });
				this.personName = this.contactUser.user1.userName ? this.contactUser.user1.userName : this.defaultContact.userName;
				this.personTel = this.contactUser.user1.mobile ? this.contactUser.user1.mobile : this.defaultContact.mobile;
				this.$refs.personContactPopup.open();
			},
			checkHistoryRepeat(sid, history) {
				for(let i in history) {
					if(history[i].children['0'].children['0'].children['0'].sid == sid) {
						return true
					}
				}
			},
			showAddressMsg(item, flag) {
				// console.log(item)
				switch(flag) {
					case 'name':
						return item.userName;
					case 'mobile':
						return item.mobile;
					case 'area':
						if(item.provinceCode == item.cityCode) {
							return item.province
						}else if(item.cityCode == item.areaCode) {
							return item.province + '-' +item.city;
						}else {
							let returnMsg = item.province;
							returnMsg = item.city ? returnMsg + '-' + item.city : returnMsg;
							returnMsg = item.area ? returnMsg + '-' + item.area : returnMsg;
							return returnMsg;
						}
				}
			},
			showPopupAddressMsg(item) {
				// console.log(item)
				if(item.provinceCode == item.cityCode) {
					return item.provinceName
				}else if(item.cityCode == item.areaCode) {
					return item.provinceName + '-' +item.cityName;
				}else {
					let returnMsg = item.provinceName;
					returnMsg = item.cityName ? returnMsg + '-' + item.cityName : returnMsg;
					returnMsg = item.areaName ? returnMsg + '-' + item.areaName : returnMsg;
					return returnMsg;
				}
			},
			setAddressToPopup(item) {
				this.addressPopupObj.province = item.provinceName ? item.provinceName : '';
				this.addressPopupObj.provinceCode = item.provinceCode ? item.provinceCode : '';
				this.addressPopupObj.city = item.cityName ? item.cityName : '';
				this.addressPopupObj.cityCode = item.cityCode ? item.cityCode : '';
				this.addressPopupObj.area = item.areaName ? item.areaName : '';
				this.addressPopupObj.areaCode = item.areaCode ? item.areaCode : '';
				this.addressPopupObj.address = item.addressDetail ? item.addressDetail : '';
				this.addressPopupObj.userName = item.name ? item.name : '';
				this.addressPopupObj.mobile = item.mobile ? item.mobile : '';
				this.addressPopupObj.longitude = item.longitude ? item.longitude : '';
				this.addressPopupObj.latitude = item.latitude ? item.latitude : '';
				this.$forceUpdate();
			},
			saveOrderData() { // 关闭页面并保存订单信息
				getApp().globalData.orderOtherData = {
					needReceipt: this.needReceipt,
					declaredValue: this.declaredValue,
					guaranteeFlag: this.guaranteeFlag
				};
				uni.navigateBack()
			},
			clearOrderData() {// 关闭页面并删除订单信息
				console.log('关闭页面并删除订单信息');
				publicData.deleteShipOrderDetails();
				uni.navigateBack()
			},
			toBack() {
				this.$refs.saveOrderPopup.open();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FAFAFA;
	}
	.newCreatPage {
		padding-top: 168rpx;
		.newHead {
			position: fixed;
			z-index: 1;
			top: 0;
			width: 100vw;
			padding: 100rpx 0 0 0;
			height: 48rpx;
			background: #FFF;
			.headBack {
				position: absolute;
				width: 20rpx;
				height: 34rpx;
				left: 38rpx;
				top: 100rpx;
			}
			.pageName {
				line-height: 34rpx;
				font-size: 32rpx;
				font-weight: 600;
				color: #333333;
				text-align: center;
			}
		}
	}
	.creatOrder {
		padding-bottom:250rpx;
	}
	.creatOrder, .newCreatPage {
		.creatOrderMainBox {
			padding-top: 26rpx 0;
			background-color: #FFF;
			margin: 0 36rpx 20rpx 36rpx;
			box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
			border-radius: 24rpx;
			.orderAddressBox {
				padding: 0 28rpx;
				.addressModel {
					display: flex;
					justify-content: space-between;
					// align-items: center;
					padding: 26rpx 0;
					border-bottom:2rpx solid #F2F3F3;
					.addressType {
						flex-shrink: 0;
						width: 40rpx;
						height: 40rpx;
						line-height: 40rpx;
						border-radius: 100%;
						font-size: 24rpx;
						color: #FFFFFF;
						margin-right:20rpx;
						text-align: center;
					}
					.addressDetails {
						flex: 1;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.addressContent {
							flex: 1;
							padding-right: 24rpx;
							.noAddressInfo {
								line-height: 44rpx;
								font-size: 32rpx;
								color: #666;
							}
							.addressArea {
								line-height: 44rpx;
								font-size: 32rpx;
								font-weight: 500;
								color: #333333;
								display: -webkit-box;
								overflow: hidden;
								word-break: break-all;  /* break-all(允许在单词内换行。) */
								text-overflow: ellipsis;  /* 超出部分省略号 */
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1; /** 显示的行数 **/
							}
							.addressDetailsInfo {
								margin-top: 16rpx;
								min-height: 24rpx;
								font-size: 24rpx;
								color: #666666;
								line-height: 24rpx;
							}
							.contentProvince {
								height: 44rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								.newUserMsg {
									flex: 1;
									line-height: 44rpx;
									display: -webkit-box;
									overflow: hidden;
									word-break: break-all;  /* break-all(允许在单词内换行。) */
									text-overflow: ellipsis;  /* 超出部分省略号 */
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 1; /** 显示的行数 **/
									.name {
										font-size: 36rpx;
										font-weight: 600;
										color: #333333;
									}
									.mobile {
										font-size: 28rpx;
										font-weight: 400;
										color: #333333;
										margin-left: 20rpx;
									}
								}
								.addressListIcon {
									flex-shrink: 0;
									width: 36rpx;
									height: 34rpx;
									display: block;
								}
							}
							.contentDetail {
								font-size: 24rpx;
								font-weight: 400;
								color: #666666;
								margin-top: 10rpx;
							}
						}
						.addAddressBox {
							flex-shrink: 0;
							padding:0 22rpx;
							.addressStatusBtn {
								width: 30rpx;
								height: 30rpx;
							}
						}
					}
				}
			}
		}
		.inputBox + .inputBox {
			border-top:2rpx solid rgba(151, 151, 151, 0.16);
		}
		.inputBox {
			margin:0 30rpx;
			padding:26rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.largeHead {
				font-size: 32rpx;
				font-weight: 400;
				color: #333333;
				line-height: 44rpx;
				height: 44rpx;
				flex-shrink: 0;
				margin-right:32rpx;
			}
			.leftTitle {
				font-size: 30rpx;
				font-weight: 400;
				color: #000;
				line-height: 44rpx;
				height: 44rpx;
				flex-shrink: 0;
				margin-right:32rpx;
				display: flex;
				align-items: center;
				.areaHint {
					flex-shrink: 0;
					margin-left: 8rpx;
					width: 64rpx;
					height: 32rpx;
					line-height: 32rpx;
					border-radius: 56rpx;
					border: 2rpx solid #2B72F0;
					font-size: 16rpx;
					color: #2B72F0;
					text-align: center;
				}
				.titleHint {
					color:#FF3838;
					font-size: 24rpx;
					padding-left:2rpx;
					font-weight:bold;
					height: 44rpx;
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
					line-height: 44rpx;
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
						font-weight: 500;
						color: #333333;
						line-height: 44rpx;
					}
				}
				.goodsMsg {
					font-size: 28rpx;
					line-height: 44rpx;
				}
				.arrowIcon {
					width:10rpx;
					height: 20rpx;
					margin-left:20rpx;
					flex-shrink: 0;
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
					word-break: break-all;
				}
				.arrowIcon {
					width:10rpx;
					height: 20rpx;
					margin-left:20rpx;
					flex-shrink: 0;
				}
				.loadTimeMsgBox {
					padding-left: 32rpx;
					.loadTimeMsg {
						font-size: 26rpx;
						font-weight:500;
						color:#333;
						line-height: 44rpx;
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
				.orderUserName {
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
				}
				.orderUserMobile {
					font-size: 24rpx;
					font-weight: 400;
					color: #333333;
					padding-left: 20rpx;
				}
				.contentMsg {
					font-size:28rpx;
				}
				.arrowIcon {
					width:10rpx;
					height: 20rpx;
					margin-left:20rpx;
					flex-shrink: 0;
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
		.newBorderBox {
			box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
			border-radius: 24rpx;
			margin-left: 36rpx;
			margin-right: 36rpx;
		}
		.orderMsgInputBox {
			background-color: #FFF;
			padding-top: 12rpx;
			padding-bottom: 12rpx;
			margin-bottom: 20rpx;
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
		.orderRulesBox {
			padding: 0 36rpx 30rpx 36rpx;
			.rulesMsg {
				line-height: 34rpx;
				font-size:24rpx;
				color:#707071;
			}
		}
		.chekcedBtnBox {
			display: flex;
			padding: 0 36rpx;
			.otherButton1 {
				width: 136rpx;
				text-align: center;
				.checkedSyb {
					margin-left: 10rpx;
				}
			}
			.otherButton2 {
				width: 132rpx;
				padding:0 10rpx;
				margin-left: 40rpx;
				.checkedSyb {
					margin-left: 0rpx;
				}
			}
			.otherButton1, .otherButton2 {
				height: 56rpx;
				line-height: 56rpx;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-weight: 400;
				.checkedSyb {
					width: 24rpx;
					height: 24rpx;
					position: absolute;
					margin-top: 4rpx;
				}
			}
			.checkedButton {
				border: 2rpx solid #558DF2;
				color:#558DF2;
			}
			.defaultButton {
				border: 2rpx solid #7C7C7C;
				color:#7C7C7C;
			}
		}
		.footBtnGroup {
			padding: 0 36rpx 10rpx;
			width:678rpx;
			background-color: #FFF;
			position: fixed;
			bottom:0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 184rpx;
			.footOtherBtn {
				flex: 1;
				
				.newAgreementBox {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					height: 184rpx;
					.confirmAgreementIcon {
						width:26rpx;
						height: 26rpx;
					}
					.section {
						height: 184rpx;
						line-height: 184rpx;
						display: flex;
						flex-direction: row;
						align-items: center;
					}
					.btn {
						width:22rpx;
						height: 22rpx;
						border-radius:100%;
						border:2rpx solid #666;
					}
					.agreementHint {
						padding-left:8rpx;
						font-size: 26rpx;
						color: #666;
						font-weight:bold;
						height: 184rpx;
						line-height: 184rpx;
					}
					.agreementDetails {
						font-size: 26rpx;
						color: #333;
						font-weight:bold;
						height: 184rpx;
						line-height: 184rpx;
					}
				}
			}
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
				width:236rpx;
				height: 82rpx;
				line-height: 82rpx;
				border-radius:78rpx;
				background-color: #F67979;
				text-align: center;
				font-size: 36rpx;
				font-weight: 600;
				color: #FFFFFF;
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
		.editPersonMsg {
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 0 0 32rpx 0;
			.title {
				width:650rpx;
				padding: 40rpx 0 32rpx 0;
				line-height: 50rpx;
				border-bottom: 2rpx solid #DBDBDB;
				font-size: 36rpx;
				font-weight:bold;
				color: #222;
				text-align: center;
			}
			.popupInputBox {
				padding: 0 38rpx;
				.popupInput {
					font-size: 32rpx;
					color: #444444;
					height: 100rpx;
					border-bottom: 2rpx solid #F2F3F3;
				}
			}
			.popupBtn {
				flex: 1;
				height: 84rpx;
				line-height: 84rpx;
				border-radius: 48rpx;
				background: #4AA2F3;
				margin: 32rpx 38rpx 0 38rpx;
				color:#FFF;
				font-size: 32rpx;
				font-weight:500;
				text-align: center;
			}
		}
		.addressPopupBox {
			background-color: #FFF;
			border-top-left-radius: 24rpx;
			border-top-right-radius: 24rpx;
			padding: 48rpx 36rpx;
			box-sizing: border-box;
			height: calc(100vh - 148rpx);
			.scrollHistory {
				height: calc(100vh - 822rpx);
			}
			.popupHeadBox {
				display:flex;
				align-items: center;
				justify-content: space-between;
				.cancelBtn {
					font-size: 32rpx;
					color: #2B72F0;
					line-height: 40rpx;
				}
				.popupTitle {
					font-size: 40rpx;
					font-weight: 600;
					color: #333333;
				}
				.confirmBtn {
					width: 154rpx;
					height: 62rpx;
					line-height: 62rpx;
					background: #2B72F0;
					border-radius: 8rpx;
					font-size: 32rpx;
					color: #FFFFFF;
					text-align:center;
				}
			}
			.popupBodyBox {
				padding-top: 58rpx;
				.chooseRow + .chooseRow {
					border-top: 2rpx solid #E7E7E7;
				}
				.chooseRow {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 32rpx 0;
					.chooseTitle {
						flex: 1;
						display: flex;
						align-items: center;
						.areaMsg {
							font-size: 36rpx;
							font-weight: 500;
							line-height: 40rpx;
						}
						.areaHint {
							flex-shrink: 0;
							margin-left: 8rpx;
							width: 64rpx;
							height: 32rpx;
							line-height: 32rpx;
							border-radius: 56rpx;
							border: 2rpx solid #2B72F0;
							font-size: 16rpx;
							color: #2B72F0;
							text-align: center;
						}
					}
					.chooseBtn {
						padding-left: 32rpx;
						flex-shrink: 0;
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: #2B72F0;
						line-height: 44rpx;
					}
					.addressInput {
						height: 44rpx;
						font-size: 36rpx;
						font-weight: 500;
						color:#000;
					}
					.colInput {
						flex: 0 0 208rpx;
					}
					.flexInput {
						flex: 1;
					}
					.inputLine {
						flex-shrink: 0;
						width: 2rpx;
						height: 36rpx;
						background-color: #E7E7E7;
						margin-right: 80rpx;
					}
					.mapChooseBtn {
						flex-shrink: 0;
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
						line-height: 44rpx;
						margin-left: 32rpx;
						.chooseIcon {
							width: 14rpx;
							height: 24rpx;
							padding-left: 20rpx;
						}
					}
				}
				.historyAddressTitle {
					margin-top: 48rpx;
					font-size: 36rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
				}
				.historyAddressList {
					height: 168rpx;
					background: #FAFAFA;
					border-radius: 16rpx;
					padding: 0 40rpx;
					display: flex;
					align-items: center;
					margin-top: 32rpx;
					.historyAddrIcon {
						flex-shrink: 0;
						width: 33rpx;
						height: 44rpx;
					}
					.historyAddrContent {
						flex: 1;
						box-sizing: border-box;
						padding-left: 30rpx;
						.hAArea {
							line-height: 32rpx;
							.areaMsg {
								font-size: 32rpx;
								font-weight: 500;
								color: #333333;
								padding-right: 24rpx;
							}
							.nameMobile + .nameMobile {
								padding-left: 12rpx;
							}
							.nameMobile {
								font-size: 24rpx;
								color: #333333;
							}
						}
						.hADetail {
							margin-top: 24rpx;
							font-size: 24rpx;
							color: #333333;
							line-height: 28rpx;
						}
					}
				}
				.noHistoryAddress {
					margin-top: 32rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
				}
			}
		}
		.electronAlert {
			width: 552rpx;
			border-radius: 12rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #FFF;
			.title {
				font-size: 36rpx;
				font-weight: 500;
				color: #000;
				padding: 40rpx 0 26rpx;
			}
			.ele-content {
				font-size: 28rpx;
				font-weight: 500;
				color: #000000;
				padding-bottom: 46rpx;
			}
			.ele-btn {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				width: 552rpx;
				border-top: 2rpx solid #F1F1F1;
				height: 88rpx;
				.btn {
					flex: 1;
					width: 160rpx;
					height: 80rpx;
					font-size: 32rpx;
					font-weight: 400;
					display: flex;
					justify-content: center;
					align-items: center;
					&.cancel {
						border-right: 2rpx solid #F1F1F1;
						
						color: #666666;
						
					}
					&.confirm {
						color: #4EADF1;
					}
				}
			}
		}
	}
</style>
