<template>
<view>
<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal"></view>
<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal1"></view>
<!-- 弹出层 -->
<view class="modalDlg" v-if="showModal">
  <view class="modal_top modal_top1">提示</view>
  <view class="modal_top modal_con">确定发起拼团</view>
  <view class="modal_btm">
    <view @tap.stop="cancel">取消</view>
    <button @tap.stop="confirm" :data-item="item">确认</button>
  </view>
</view>
<view class="modalDlg" v-if="showModal1">
  <view class="modal_top modal_top1">提示</view>
  <view class="modal_top modal_con">发起成功，还差1人，邀请好友来拼团</view>
  <view class="modal_btm">
    <view @tap.stop="cancel1">取消</view>
    <button @tap.stop="confirm1" open-type="share" :data-item="item">确认</button>
  </view>
</view>
<view class="divLine"></view>
<view class="topView">
  <image src="/static/images/jym/icon_oilstation_press.png"></image>
  <text>{{stationName}}</text>
</view>
<block v-if="showCard.cardNo!=''">
  <view class="cardContainer" @tap="selectOilCard" :style="'background: ' + ( filter.checkCardFlagIsSite(showCard.cardFlag)==false?itemColor3:showCard.fuelType==1?itemColor:showCard.fuelType==2?itemColor1:showCard.fuelType==3?itemColor2:itemColor4) + ';'">
    <view class="cellView" :data-index="bindex" :style="'color: ' + (filter.checkCardFlagIsSite(showCard.cardFlag)==false?textColor3:showCard.fuelType==1?textColor:showCard.fuelType==2?textColor1:showCard.fuelType==3?textColor2:textColor4) + ';'">
      <view class="cellView1_img" hover-class="none" hover-stop-propagation="false">
        <image :style="'height:' + (showCard.cardType == 3?'60rpx':filter.checkCardFlagIsSite(showCard.cardFlag)==false?'120rpx':showCard.fuelType==1?'140rpx':showCard.fuelType==2?'130rpx':'130rpx') + ';width:' + (showCard.fuelType==3?'130rpx':'150rpx')" :src="filter.checkCardFlagIsSite(showCard.cardFlag)==false?itemImg3:showCard.fuelType==1?itemImg:showCard.fuelType==2?itemImg1:showCard.fuelType==3?itemImg2:itemImg4">
        </image>
      </view>
      <view class="leftView">
        <view class="leftView_stationName">
          {{filter.checkCardFlagName(showCard.cardFlag)}}
          <image :src="showCard.cardType == 3?arrow2:filter.checkCardFlagIsSite(showCard.cardFlag)==false?arrow:showCard.fuelType==1?arrow1:showCard.fuelType==2?arrow2:arrow3">
          </image>
        </view>
        <view class="leftView_compSecondName">
          卡号：{{showCard.cardNo}}
        </view>
        <view class="leftView_compSecondName" v-if="showCard.cardType!=3">
          {{showCard.compSecondName}}
        </view>
		<view class="leftView_compSecondName">
		  车牌号：{{showCard.plateNo}}
		</view>
      </view>
      <view class="rightView">
        <view>
          <view class="rightView_view">

            <view class="amount">
              <view style="font-size: 28rpx;">￥</view>
              <view>
                {{filter.Amount(showCard.amount)[0]}}
              </view>
              <view style="font-size: 18rpx;">
                .{{filter.Amount(showCard.amount)[1]}}
              </view>
            </view>
            <view style="text-align: center;font-size: 24rpx;">
              余额
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</block>
<view class="color333Size30Title" style="margin-top: 20rpx">油品类型</view>
<view class="parent">
  <block v-for="(item, index) in typeList" :key="index" class="parent">
    <view :class="item.isSelect?'childSelect':'child'" @tap="onTapType" :data-index="index">
      {{item.typeName}}
    </view>
  </block>
</view>
<view class="color333Size30Title" style="margin-top: 10rpx">油品型号</view>
<view class="parent">
  <block v-for="(item, index) in normList" :key="index" class="parent">
    <view :class="item.isSelect?'childSelect':'child'" @tap="onTapNorm" :data-index="index">
      {{item.typeName}}
    </view>
  </block>
</view>
<view class="color333Size30Title" style="margin-top: 20rpx" v-if="flag==2?false:false">
  选择枪号
</view>
<view class="color333Size30Title" style="margin-top: 20rpx" v-else-if="numberList.length==0||flag==2?false:true">
  选择枪号
</view>
<view class="parent" v-if="flag==2?false:true">
  <block v-for="(item, index) in numberList" :key="index" class="parent">
    <view :class="item.isSelect?'childSelect':'child'" @tap="onTapGun" :data-index="index">
      {{item.gunName}}
    </view>
  </block>
</view>
<view class="unitView" style="margin-top: 20rpx">
	
	<!-- 加油订单新逻辑 -->
	<!-- 当优惠价＜原价时候展示这个 flagPrice = 2 -->
	  <view v-if="flagPrice == 2">
	    <view style="color: red;font-weight: 600;">
	      <text>优惠价：</text>
	       <!-- <text >{{oilPriceInfo.fuelSalePrice}}</text> -->
		  <text >{{oilPriceInfo.fuelPrice}}</text>
	      <text> 元</text>
	  </view>
	  <view style="text-decoration:line-through;">
	    <text>单价：</text>
	    <!-- <text>{{oilPriceInfo.fuelPrice}}</text> -->
	    <text >{{oilPriceInfo.fuelGunPrice}}</text>
	    <text>元</text>
	  </view>
	  </view>
	  
	  <!-- 优惠价≥原价 -->
	   <view v-if="flagPrice == 3">
	    <text>单价：</text>
	    <!-- <text style="color: red;">{{oilPriceInfo.fuelSalePrice}}</text> -->
	    <text style="color: red;">{{oilPriceInfo.fuelPrice}}</text>
	    <text> 元</text>
	  </view>
	
	<!-- 优惠价无值或≤0 -->
	  <view v-if="flagPrice == 1">
	    <text>单价：</text>
	    <text
	      style="color: red;">{{oilPriceInfo.fuelPrice}}</text>
	    <text>元</text>
	  </view>
	
	
  <!-- <view>
    <text>单价：</text> -->
    <!--!isUseCoupon&&flag!=2 不是优惠券和拼团      oilPriceInfo.fuelSalePrice 优惠价      oilPriceInfo.fuelPrice 普通价格-->
    <!-- <text
      style="color: red;">{{(filter.prcieFiltering(showCard.cardFlag) && !isUseCoupon&&flag!=2)?(oilPriceInfo.fuelSalePrice==''? oilPriceInfo.fuelPrice :oilPriceInfo.fuelSalePrice):(oilPriceInfo.fuelPrice==''?'0.00':oilPriceInfo.fuelPrice)}}</text>
    <text>元</text> -->
  <!--  <text style="color: red;">{{oilPriceInfo.fuelPrice}}</text>
    <text>元</text>
  </view> -->
  
  <view v-if="(flag==2 && stationType != 4)?true:false">
    <text>拼团后单价：</text>
    <text style="color: red;">{{oilPriceInfo.fuelGrouponPrice}}</text>
    <text>元</text>
  </view>
  
  <!-- v-if="{{isUseCoupon}}" -->
   <!-- 实际应付金额÷加油量，四舍五入 -->
  <view v-if="isUseCoupon && calTotalCoupon.fuelCouponPrice">
    <text>券后优惠价：</text>
    <text style="color: red;">{{calTotalCoupon.fuelCouponPrice}}</text>
    <text>元</text>
  </view>
  
</view>
<view class="unitView" style="margin-top: 20rpx">订单金额</view>
<view class="inputView">
  <text>¥</text>
  <input @input="inputAmount" style="font-size: 40rpx;" placeholder-class="placeholderinput" v-if="flag==2?true:false" :value="amount" type="digit" :disabled="isInputAmount" :maxlength="10" :placeholder="'最低拼团金额'+minConsumeAmount+'元'" @confirm="confirmAmount" hold-keyboard="true" auto-blur="true" :focus="amountFocus" confirm-type="done" adjust-position="false" @blur="blurPrice"></input>
  <input @input="inputAmount" type="digit" v-if="flag==2?false:true" :value="amount" :disabled="isInputAmount" :maxlength="10" placeholder="请输入金额" @confirm="confirmAmount" hold-keyboard="true" :focus="amountFocus" @blur="confirmAmount" confirm-type="done" adjust-position="false" auto-blur="true"></input>
</view>

<view class="unitView" style="margin-top: 20rpx">加油量</view>
<view class="inputView">
  <text>{{oilPriceInfo.fuelUnit}}</text>
  <input @input="inputNumber" v-if="flag==2?true:false" style="font-size: 40rpx;" placeholder-class="placeholderinput" :disabled="isInputNumber" :value="oilNum" type="digit" :maxlength="10" placeholder="请输入数量"></input>
  <input @input="inputNumber" v-if="flag==2?false:true" :disabled="isInputNumber" :value="oilNum" type="digit" :maxlength="10" placeholder="请输入数量" hold-keyboard="false"></input>
</view>

 <view class="parent1" style="margin-top: 20rpx" v-if="showCard.cardType != 1"> 
    <text>优惠价应支付金额：</text>
    <text
      style="color: red;">{{concessionalRate}}</text>
    <text>元</text>
  </view>
  

<!-- v-if="{{(flag ==2 || stationType == 4 || showCard.cardType!=3)?false:true}}" -->
<view class="couponView" v-if="(flag ==2 || showCard.cardType!=3)?false:true" @tap="selectCoupon" data-status="1">
  <view class="couponViewLeft">
    <image class="coupons-img" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/coupon_img.png"></image>
    <!-- <view class="coupon">券</view>优惠券 -->
    <view class="coupons-text">优惠券</view>
  </view>
  <view class="couponViewRight">
    <text v-if="couponDetails==''">请选择</text>
    <text style v-if="couponDetails!=''">{{couponDetails}}</text>
  </view>
  <image src="/static/images/jym/icon_right.png"></image>
</view>
<!-- v-if="{{(flag==2 || stationType == 4 || showCard.cardType!=3)?false:true && cashYesCouponList.length > 0 }}" -->
<view class="couponView" v-if="(flag==2  || showCard.cardType!=3)?false:true && cashYesCouponList.length > 0" @tap="selectCoupon" data-status="2">
  <view class="couponViewLeft">
    <image class="coupons-img" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/cash_coupon.png"></image>
    <view class="coupons-text">现金券</view>
  </view>
  <view class="couponViewRight">
    <text v-if="cashCouponDetails==''">请选择</text>
    <text style v-if="cashCouponDetails!=''">{{cashCouponDetails}}</text>
  </view>
  <image src="/static/images/jym/icon_right.png"></image>
</view>


<!-- {{isUseCoupon && calTotalCoupon.couponAmount}}" -->
<view class="unitView" style="margin-top: 20rpx" v-if="calTotalCoupon.couponAmount">
  <view>
    <text>共节省：</text>
    <text style="color: red;">{{totalSavings}}</text>
    <text>元</text>
  </view>
  <!-- <view>
    <text>优惠后加油：</text>
    <text style="color: red;">{{calTotalCoupon.fuelCouponNum}}</text>
    <text>升</text>
  </view> -->
</view>
<view class="unitView" style="margin-top: 20rpx" v-if="flag==2?true:false">
  <view>
    <text>共节省：</text>
    <text style="color: red;">{totalSavings}}</text>
    <text>元</text>
  </view>
  <!-- <view>
    <text>优惠后加油：</text>
    <text style="color: red;">{{calTotalCoupon.fuelCouponNum}}</text>
    <text>升</text>
  </view> -->
</view>

<!-- v-if="(flag ==2 || showCard.cardType !=3 )?false:true" -->
<view class="parent1" style="margin-top: 20rpx" > 
    <text>实际应付金额：</text>
    <!-- 判断优惠券金额是否有值  没有值 就用优惠价应支付金额  有值就是优惠价应支付金额 - 优惠券优惠金额 -->
    <text
      style="color: red;">{{actualPayable}}</text>
    <text> 元</text>
</view>

<view class="unitView" style="margin-top: 20rpx" v-if="stationType==4 && straightDown">
  <view>
    <text>平台直降：</text>
    <text style="color: red;">{{straightDown}}</text>
    <text>元</text>
  </view>
</view>
<view v-if="flag==2?false:true" class="bottomButton" style="padding-bottom: 50rpx;">
	<view  v-if="stationType == 4">
		  <!-- 团油：中石油站点 -->
		<view class="tips" v-if="ext1 && ext1 == 10">
		  <view class="tipsTitle"><text class="red">提示</text>：</view>
		  <view class="tipsContent">本站是“<text class="red">团油</text>”合作站。请和加油员说：用<text class="red">上汽联名卡</text>支付，并告知对方您手机号后4位。</view>
		</view>
		
		<view class="tips" v-else>
		  <view class="tipsTitle"><text class="red">提示</text>：</view>
		  <view class="tipsContent">本站是“<text class="red">团油</text>”合作站。告知加油员，已通过<text class="red">团油</text>支付。并告知对方您<text class="red">手机号后4位</text>。</view>
		</view>
	</view>
	
  <!-- <view class="tips" v-if="stationType == 4">
    <view class="tipsTitle"><text class="red">提示</text>：</view>
    <view class="tipsContent">本站是“<text class="red">团油</text>”合作站。告知加油员，已通过<text class="red">团油</text>支付。并告知对方您<text class="red">手机号后4位</text>。</view>
  </view> -->
  <!-- 万金油 中石油 -->
  <view class="tips" v-if="stationType == 5 && isInputMoney == 1">
    <view class="tipsTitle"><text class="red">提示</text>：</view>
    <view class="tipsContent">站点来自“<text class="red">万金油</text>”。请和加油员说：用<text class="red">上汽联名卡</text>支付。</view>
  </view>

  
  
  <view @tap="clickToPay" class="bottomSave">去支付</view>
</view>
<view v-if="flag==2?true:false" class="bottomButton">
  <view @tap="clickToPay" class="bottomSave">确定</view>
</view>
<!-- 这里是选择加油卡 -->
<view class="commodity_screen" @tap="hideModal" v-if="showModalStatus"></view>
<!-- :animation="animationData" -->
<view class="commodity_attr_box" v-if="showModalStatus">
  <view class="showViewTitle">
    <image @tap="hideModal" src="/static/images/jym/icon_cancel.png"></image>
    <text>选择加油卡</text>
    <image></image>
  </view>
  <scroll-view class="scrollView" scroll-y="true">
    <block v-for="(item, bindex) in cardList" :key="bindex">
      <view class="cardContainer" :style="'background: ' + (filter.checkCardFlagIsSite(item.cardFlag)==false?itemColor3:item.fuelType==1?itemColor:item.fuelType==2?itemColor1:item.fuelType==3?itemColor2:itemColor4) + ';'">
        <view class="cellView " @tap="selectItem" :data-index="bindex" :style="'color: ' + (filter.checkCardFlagIsSite(item.cardFlag)==false?textColor3:item.fuelType==1?textColor:item.fuelType==2?textColor1:item.fuelType==3?textColor2:textColor4) + ';'">
          <view class="cellView1_img" hover-class="none" hover-stop-propagation="false">
            <image :style="'height:' + (item.cardType == 3?'60rpx':filter.checkCardFlagIsSite(item.cardFlag)==false?'120rpx':item.fuelType==1?'140rpx':item.fuelType==2?'130rpx':'130rpx')" :src="filter.checkCardFlagIsSite(item.cardFlag)==false?itemImg3:item.fuelType==1?itemImg:item.fuelType==2?itemImg1:item.fuelType==3?itemImg2:itemImg4">
            </image>
          </view>

          <view class="leftView">
            <view class="leftView_stationName">
              {{filter.checkCardFlagName(item.cardFlag)}}
            </view>
            <view class="leftView_compSecondName">
              卡号：{{item.cardNo}}
            </view>
            <view class="leftView_compSecondName" v-if="item.cardType!=3">
              {{item.compSecondName}}
            </view>
			<view class="leftView_compSecondName">
			  车牌号：{{item.plateNo}}
			</view>
          </view>
          <view class="rightView">
            <view>
              <view class="rightView_view" style="display: flex;justify-content: center;">

                <view class="amount">
                  <view style="font-size: 28rpx;">￥</view>
                  <view>
                    {{filter.Amount(item.amount)[0]}}
                  </view>
                  <view style="font-size: 18rpx;">
                    .{{filter.Amount(item.amount)[1]}}
                  </view>
                </view>

                <view style="text-align: center;font-size: 24rpx; ">
                  余额
                </view>
                <checkbox :checked="checkSelect==bindex?true:false"></checkbox>
              </view>
            </view>
          </view>
        </view>
      </view>
    </block>
  </scroll-view>
</view>
</view>
</template>

<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>
<script>
	var api = require('@/config/api.js');
	var util = require('@/utils/jym-utils/util.js');
	const app = getApp();
	export default {
		data() {
			return {
				showModal1: false,
				amountFocus: false,
				bindex: 0,
				checkSelect: 0,
				typeList: [],
				normList: [],
				numberList: [],
				amount: "",
				oilNum: "",
				showModalStatus: false,
				showModal: false,
				cardList: '',
				flag: 0,
				index: 10,
				secret: "",
				isMembership: false,
				showCard: {
				    id: 0,
				    cardNo: "",
				    userName: "",
				    cardFlag: "",
				    amount: 0,
				    fuelType: 0,
				    cardType: 0,
				    fuelNo: 0,
				    compName: '',
					plateNo:'',
				},
				isInputMoney: 0, //等于1是联名卡支付，需要获取支付凭证
				userCouponId: '', //优惠券使用id
				focus: false,
				Length: 6, //输入框个数
				isFocus: true, //聚焦
				Value: "", //输入的内容
				ispassword: true, //是否密文显示 true为密文， false为明文。
				payPwdshowModalStatus: false,
				hasPayPassword: 0,
				cardNo: 0,
				typeId: 0,
				normId: 0,
				gunId: 0,
				oilPriceInfo: {
				    fuelPrice: 0.00,
				    fuelSalePrice: 0.00,
				    fuelGrouponPrice: 0.00,
				    fuelUnit: "",
				    id: 0
				},
				fuelAccuracyNum: '',
				couponDetails: "",
				cashCouponDetails: '',  //现金券优惠金额
				couponNo: "",
				couponId: 0,
				isUseCoupon: false,
				calTotalCoupon: {
				    fuelCouponNum: 0, //优惠后加油量
				    fuelCouponAmount: 0, //优惠后加油金额
				    couponAmount: 0, //优惠金额
				    fuelCouponPrice: 0, //优惠后单价
				    fuelGrouponPrice: 0, //拼团后单价
				    couponFlag: 0, //是不是有优惠。。。0是没有优惠
				    fuelPrice: 0,
				    fuelNum: 0,
				    fuelAmount: 0,
				    remark: "",
				    payTypeList: [],
				    userCouponsAmount: []
				},
				fuelsList: [],
				stationId: 0,
				opId: 0,
				sign: 0,
				stationName: "",
				payToken: "",
				ddlist: {},
				isInputAmount: true,
				isInputNumber: true,
				itemColor1: "#CEDFFD",
				itemColor: "#F8EABC",
				itemColor3: " #C1D5E9",
				itemColor4: "#81A1CB",
				itemColor2: "#CFE9EB",
				textColor1: "#567BC3",
				textColor: "#EDA137",
				textColor2: "#3CADB9",
				textColor3: "#205B9A",
				textColor4: "#034284",
				arrow: '/static/images/jym/icon_arrow_bottom_cd.png',
				arrow1: '/static/images/jym/icon_arrow_bottom_cy.png',
				arrow2: '/static/images/jym/icon_arrow_bottom_qy.png',
				arrow3: '/static/images/jym/icon_arrow_bottom_yq.png',
				itemImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasolineCard.png",
				itemImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_dieselCard.png",
				itemImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasCard.png",
				itemImg3: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_teamCard.png",
				itemImg4: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/platform.png",
				cashYesCouponList: [],  //现金券数据
				bastCoupon: [],   //优惠最大额度
				cashCouponId: '',  //现金券id
				checkValue: [],
				isCheck: false,
				preferentialAmount: 0,
				cashCouponDetails2: 0,
				depreciateAmount:0,
				straightDown: 0, //团油直降金额
				ext1:'',
				flagPrice:0,   //判断展示加油价还是展示优惠价
				concessionalRate:0,   //优惠价应支付金额
				totalSavings:0,  //共节省
				actualPayable:0,   //实际应付金额
			}
		},
		 /**
		  * 生命周期函数--监听页面显示
		  */
		 onUnload() {
		     console.log("onUnload");
		     // 返回按钮点击,进行一些打点操作
		     // WxLog.send({
		     //     name: 'N**',
		     // });
		 },
		 onShow: function () {
		     const that = this
		     uni.getStorage({
		         key: 'driverInfo',
		         success: function (res) {
		             that.hasPayPassword = res.data.attrs.hasPayPassword;
		         },
		     })
			 console.log(uni.getStorageSync('driverInfo'))
		     const pages = getCurrentPages()
		     const currPage = pages[pages.length - 1] // 当前页
		 	
		     if (that.couponDetails != "" || that.cashCouponDetails != "") {
		         that.couponDetails = that.couponDetails == undefined ? '请选择' : that.couponDetails;
		             that.couponNo = that.couponNo;
		             that.couponId = that.couponId == undefined ? '' : that.couponId;
		             that.cashCouponDetails = that.cashCouponDetails;
		             that.cashCouponId = that.cashCouponId == undefined ? '' : that.cashCouponId;
		             that.checkValue = that.checkValue;
		             that.isCheck = that.isCheck;
		             that.cashCouponDetails2 = that.cashCouponDetails2;
		         // console.log(this.couponDetails, this.cashCouponDetails)
		         var fuelPrice = that.oilPriceInfo.fuelPrice
		         var fuelSalePrice = that.oilPriceInfo.fuelSalePrice
		         var showCard = that.showCard
		         var amount = that.amount
		         var typeId = that.typeId
		         var normId = that.normId
		         // console.log(showCard.cardFlag, fuelSalePrice, "jjj");
		         if (that.checkCardFlagIsSite(showCard.cardFlag) && fuelSalePrice) {
		             console.log(amount, fuelSalePrice, that.couponId, typeId, normId);
		             that.requestCalTotal(amount, fuelSalePrice, that.couponId, typeId, normId)
		         } else {
		             that.requestCalTotal(amount, fuelPrice, that.couponId, typeId, normId)
		         }
		     }
		     // sign 1是优惠券  2是现金券
		     if (that.sign == 1 || that.sign == 2) {
		         console.log(that.sign, "11");
		         var amount = that.amount
		         var fuelPrice = that.oilPriceInfo.fuelPrice
		         var fuelSalePrice = that.oilPriceInfo.fuelSalePrice
		         var typeId = that.typeId
		         let oilNum = ''
		         // oilNum = app.globalData.newToFixed(amount / fuelSalePrice, 3);
		         oilNum = that.formatDecimal((amount / fuelPrice), 3)
		         // console.log(amount, fuelSalePrice, oilNum, amount / fuelSalePrice)
		         if (that.sign == 1) {
		             that.isUseCoupon = false;
		                 that.oilNum = oilNum;
		                 that.couponDetails = "请选择";
		                 that.userCouponId = '';
		                 that.couponId = '';
		         } else if (that.sign == 2) {
		             that.isUseCoupon = false;
		                 that.oilNum = oilNum;
		                 // that.couponDetails = "请选择";
		                 // that.userCouponId = '';
		                 that.cashCouponDetails = "请选择";
		                 that.cashCouponId = '';
		         }
		         console.log(amount, fuelSalePrice, that.couponId, typeId, normId, "999");
		         that.requestCalTotal(amount, fuelSalePrice, that.couponId, typeId, normId)
		     }
		     if (that.showCard != null) {
		         that.requestRefreshSelectCard();
		     }
		 },
		 // 转发
		 onShareAppMessage: function (res) {
		     console.log(this.ddlist)
		     var listData = {
		         fuelType: this.ddlist.fuelType,
		         fuelDictId: this.ddlist.fuelDictId,
		         fuelGunId: this.ddlist.fuelGunId,
		         grouponNo: this.ddlist.grouponNo,
		         fuelName: encodeURIComponent(this.ddlist.fuelName),
		         stationId: this.ddlist.stationId,
		         opId: this.ddlist.opId,
		         fuelPrice: this.ddlist.fuelPrice,
		         fuelUnit: this.ddlist.fuelUnit,
		         fuelCouponPrice: this.ddlist.fuelCouponPrice,
		         fuelNum: this.ddlist.fuelNum,
		         fuelAmount: this.ddlist.fuelAmount,
		         fuelCouponNum: this.ddlist.fuelCouponNum,
		         couponAmount: this.ddlist.couponAmount,
		         oneOrderId: this.ddlist.id,
		         grouponUserType: 2,
		         groupOnEndDt: this.ddlist.groupOnEndDt
		     }
		     return {
		         title: '您的好友邀请您参加拼团加油',
		         path: 'pages/forward/group/group?data=' + JSON.stringify(listData),
		         imageUrl: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_group.png",
		         success: function (res) {
		             this.showModal = false;
		                 this.showModal1 = false;
		             uni.showModal({
		                 title: '提示',
		                 content: '拼团邀请已发送，请到订单页面查看详情',
		                 showCancel: false,
		                 success: function () {
		                     uni.switchTab({
		                         url: '../../oilstationIndex/oilstationIndex',
		                     })
		                 }
		             })
		 	
		         },
		         fail: function () {
		             // 转发失败之后的回调
		             uni.switchTab({
		                 url: '../../oilstationIndex/oilstationIndex',
		             })
		         }
		     }
		 },
		methods: {
			checkCardFlagIsSite(flag) {
			    // console.log(flag);
			    //CT天然气  CC柴油
			    if ("CC" == flag || "C2" == flag) {
			        return false
			    } else if ("CC" == flag || "CT" == flag) {
			        return false;
			    } else {
			        return true
			    }
			},
			formatDecimal(num, decimal) {
			    num = num.toString()
			    let index = num.indexOf('.')
			    if (index !== -1) {
			        num = num.substring(0, decimal + index + 1 + 1)
			        // console.log(num);
			    } else {
			        num = num.substring(0)
			    }
			    return app.globalData.newToFixed(parseFloat(num), decimal)
			},
				
				
			inputAmount(e) {
			    // console.log(Number(this.cashCouponDetails2) + Number(this.preferentialAmount));
			    //优惠券满减金额 + 现金券满减金额  不能大于加油金额
			    if (Number(this.cashCouponDetails2) + Number(this.preferentialAmount) > Number(e.detail.value)) {
			        this.cashCouponId = '';
			            this.cashCouponDetails = '';
			            this.checkValue = [];
			    }
			    if (this.normId == 0) {
			        uni.showModal({
			            title: '提示',
			            content: '请选择油品型号',
			            showCancel: false
			        })
			        return;
			    }
			    // console.log(this.oilPriceInfo);
			    const value = e.detail.value
				console.log('valuevalue',value)
				var concessionalRate = 0;  //优惠价应支付金额
			    if (value == "") {
						this.oilNum = "";
			            this.amount = "";
			            this.couponId = 0;
			            this.couponDetails = "";
			            this.cashCouponId = '';
			            this.cashCouponDetails = '';
			            this.checkValue = [];
						this.calTotalCoupon.fuelCouponNum = 0;
			            this.calTotalCoupon.couponAmount = 0;
						this.concessionalRate = 0;
						this.actualPayable = 0;
			    } else {
					var oilPriceInfo =  this.oilPriceInfo
			        var fuelPrice = this.oilPriceInfo.fuelPrice
			        var fuelSalePrice = this.oilPriceInfo.fuelPrice
			        var fuelGrouponPrice = this.oilPriceInfo.fuelGrouponPrice
			        var showCard = this.showCard
			        var amount = this.checkAmountText(value)				
			        var oilNum;
			        var fuelAccuracyNum;
					var actualPayable = 0;								
					console.log('oilPriceInfooilPriceInfo',oilPriceInfo)			
			        console.log(this.flag,'this.flag ') 
					
			        if (this.checkCardFlagIsSite(showCard.cardFlag) && fuelSalePrice) {	
						console.log("加油新逻辑 加油量=订单金额÷原价")
						//加油新逻辑 加油量=订单金额÷原价
						oilNum = this.formatDecimal((amount / oilPriceInfo.fuelGunPrice), 3)
			        } else {	
						console.log("加油量=订单金额÷原价")
						// 加油量=订单金额÷原价
						oilNum = this.formatDecimal((amount / oilPriceInfo.fuelGunPrice), 3)
			        }
					
					 // 计算优惠价应支付金额    优惠价应支付金额=（订单金额÷原价）*优惠价，无优惠价时，优惠价=原价、          
					concessionalRate = app.globalData.newToFixed(((amount / oilPriceInfo.fuelGunPrice) * oilPriceInfo.fuelPrice), 2)
		
					//当选择车队卡的时候手动计算实际应付金额，平台卡的时候会调用接口 接口有返回
					if(showCard.cardType == 1) {
						actualPayable = app.globalData.newToFixed(((amount / oilPriceInfo.fuelGunPrice) * oilPriceInfo.fuelPrice),2)
					}
					console.log(concessionalRate,'计算优惠价应支付金额1');
								
								
			        if (this.flag == 2) {
			            let oilNum1 = this.formatDecimal((amount / fuelGrouponPrice), 3);
			            this.calTotalCoupon.fuelCouponNum = oilNum1;
			            oilNum = this.formatDecimal((amount / fuelPrice), 3);
			            fuelAccuracyNum = this.formatDecimal((amount / fuelPrice), 6);
			        }
			        var amount1;
			        // this.checkCardFlagIsSite(showCard.cardFlag) && !fuelSalePrice
			        if (this.checkCardFlagIsSite(showCard.cardFlag) && fuelSalePrice) {
			            amount1 = app.globalData.newToFixed(oilNum * fuelSalePrice, 2)
			        } else {
			            amount1 = app.globalData.newToFixed(oilNum * fuelPrice, 2);
				
			        }
				
			        if (this.flag == 2) {
			            let amount2 = app.globalData.newToFixed(this.calTotalCoupon.fuelCouponNum * fuelGrouponPrice, 2);
			            amount1 = app.globalData.newToFixed(this.calTotalCoupon.fuelCouponNum * fuelPrice, 2);
			            let amount3 = app.globalData.newToFixed(amount1 - amount2, 2);
			            this.calTotalCoupon.couponAmount = amount3;
			        }
					
					this.amount = amount;
					this.oilNum = oilNum;
					this.fuelAccuracyNum = fuelAccuracyNum;
					this.concessionalRate = concessionalRate;
					this.actualPayable = actualPayable
					console.log(this.oilNum,'加油量')
					console.log(showCard,'showCardshowCard')
					
					// var showCard = this.showCard
			        if (showCard.cardType == 3) {
			            console.log("输入触发");
			            this.requestCouponList()
			        }
				
				
			    }
			},
			inputNumber(e) {
			    const value = e.detail.value
				var concessionalRate = 0;   //优惠价应支付金额：
				
			    //判断如果不选择油品型号 不能输入
			    if (this.normId == 0) {
			        uni.showModal({
			            title: '提示',
			            content: '请选择油品型号',
			            showCancel: false
			        })
			        return;
			    }
								
			    if (value == "") {
						this.oilNum = "";
			            this.amount = "";
						this.calTotalCoupon.fuelCouponNum = 0;
			            this.calTotalCoupon.couponAmount = 0;
						this.concessionalRate = 0;
						this.actualPayable = 0;
			    } else {
					var oilPriceInfo =  this.oilPriceInfo
			        var fuelPrice = this.oilPriceInfo.fuelPrice
			        // var fuelSalePrice = this.oilPriceInfo.fuelSalePrice
			        var fuelSalePrice = this.oilPriceInfo.fuelPrice
			        var fuelGrouponPrice = this.oilPriceInfo.fuelGrouponPrice
			        var showCard = this.showCard
			        var oilNum = this.checkInputText(value)
			        var amount;
					var actualPayable = 0;
					
			        if (this.checkCardFlagIsSite(showCard.cardFlag) && fuelSalePrice) {
			            // amount = app.globalData.newToFixed(oilNum * fuelSalePrice, 2);
						
						// 订单金额=加油量*原价
						amount = app.globalData.newToFixed(oilNum * oilPriceInfo.fuelGunPrice, 2);
			        } else {
			            amount = app.globalData.newToFixed(oilNum * oilPriceInfo.fuelGunPrice, 2);
			        }
			        console.log(amount,'amountamount1');
					
			        if (this.flag == 2) {
			            amount = app.globalData.newToFixed(oilNum * fuelPrice, 2);
			        }
					
					//计算优惠价应支付金额   
					// 加油订单新逻辑 ----优惠价应支付金额=（订单金额÷原价）*优惠价，无优惠价时，优惠价=原价
					if(fuelPrice) {
						concessionalRate = app.globalData.newToFixed((oilNum * oilPriceInfo.fuelPrice), 2)
					}else {
						concessionalRate = app.globalData.newToFixed((oilNum * oilPriceInfo.fuelGunPrice), 2)
					}
					console.log(concessionalRate,"计算优惠价应支付金额");
					
					//当选择车队卡 和先输入加油量的时候手动计算实际应付金额，平台卡的时候会调用接口 接口有返回
					// if(showCard.cardType == 1) {
						actualPayable = app.globalData.newToFixed((oilNum  * oilPriceInfo.fuelPrice),2)
					// }
								
			        var oilNum1;
			        //有油站卡 并且有有促销价就走促销价格    
			        if (this.checkCardFlagIsSite(showCard.cardFlag) && fuelSalePrice) {
			            // fuelSalePrice 促销价   fuelPrice普通价
			            oilNum1 = app.globalData.newToFixed(amount / fuelSalePrice, 3);
			        } else {
			            oilNum1 = app.globalData.newToFixed(amount / fuelPrice, 3);
			        }
					
			        if (this.flag == 2) {
			            let oilNum2 = app.globalData.newToFixed(amount / fuelGrouponPrice, 3);
			            this.calTotalCoupon.fuelCouponNum = oilNum2;
			        }
			        if (this.flag == 2) {				
			            let amount1 = app.globalData.newToFixed(this.calTotalCoupon.fuelCouponNum * fuelGrouponPrice, 2);
			            let amount2 = app.globalData.newToFixed(this.calTotalCoupon.fuelCouponNum * fuelPrice, 2);
			            console.log(amount1, amount2)
			            let amount3 = app.globalData.newToFixed(amount2 - amount1, 2);
			            this.calTotalCoupon.couponAmount = amount3;
			        }
			        this.amount = amount;
			        this.oilNum = oilNum;
					this.concessionalRate = concessionalRate;
					this.actualPayable = actualPayable;
					
					if (showCard.cardType == 3) {
					    console.log("输入触发");
					    this.requestCouponList()
					}
					
					console.log(this.amount,'this.amountthis.amount')
			    }
			},
			checkInputText(text) {
			    const reg = /^(\.*)(\d+)(\.?)(\d{0,3}).*$/g;
			    if (reg.test(text)) { //正则匹配通过，提取有效文本
			        text = text.replace(reg, '$2$3$4');
			    } else { //正则匹配不通过，直接清空
			        text = '';
			    }
			    console.log(text)
			    return text; //返回符合要求的文本（为数字且最多有带2位小数）
			},
			checkAmountText(text) {
			    const reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
			    if (reg.test(text)) { //正则匹配通过，提取有效文本
			        text = text.replace(reg, '$2$3$4');
			    } else { //正则匹配不通过，直接清空
			        text = '';
			    }
			    return text; //返回符合要求的文本（金额带2位小数）
			},
			selectCoupon(e) {
			    let status = e.currentTarget.dataset.status
			    const typeId = this.typeId;
			    const comId = this.stationId;
			    // const fuelAmount = this.amount;
				const fuelAmount = this.concessionalRate;  //优惠券可使用的金额根据优惠价后应支付的金额
			    const showCard = this.showCard;
			    const fuelType = showCard.fuelType;
			    const cardType = showCard.cardType;
			    const fuelNo = this.normId
			    let userCouponId = this.userCouponId
			    let couponDetails = this.couponDetails == undefined ? '请选择' : this.couponDetails
			    let cashCouponDetails = this.cashCouponDetails == undefined ? '请选择' : this.cashCouponDetails
			    let cashCouponId = this.cashCouponId  //现金券id
			    let couponAmount = this.calTotalCoupon.couponAmount
			    let isCheck = this.isCheck
			    console.log(userCouponId)
			    console.log(this.oilPriceInfo.fuelSalePrice);
			    console.log(cashCouponId);
			    if (typeId == 0) {
			        uni.showToast({
			            title: '请先选择油品',
			            icon: 'none'
			        })
			        return
			    }
			    if (fuelAmount == 0) {
			        uni.showToast({
			            title: '请先输入价格',
			            icon: 'none'
			        })
			        return
			    }
			    if (status == 1) {
			        uni.navigateTo({
			            url: '../../selectCoupon/selectCoupon?fuelType=' + typeId + "&comId=" + comId + "&fuelAmount=" + fuelAmount +
			                "&cardType=" + cardType + "&fuelNo=" + fuelNo + "&userCouponId=" + userCouponId + "&couponDetails=" + couponDetails,
			        })
			    } else if (status == 2) {
			        uni.navigateTo({
			            url: '../../cashCoupon/cashCoupon?fuelType=' + typeId + "&comId=" + comId + "&fuelAmount=" + fuelAmount +
			                "&cardType=" + cardType + "&fuelNo=" + fuelNo + "&userCouponId=" + userCouponId + "&cashCouponDetails=" + cashCouponDetails + '&cashCouponId=' + cashCouponId + "&isCheck=" + isCheck + "&couponAmount=" + couponAmount,
			        })
			    }
				
			},
			//查询优惠券
			requestCouponList() {
			    const that = this;
			    const showCard = that.showCard;
			    var fuelSalePrice = that.oilPriceInfo.fuelSalePrice
			    var amount = that.amount
			    var typeId = that.typeId
			    var normId = that.normId
			    let param = {
			        fuelType: that.typeId,
			        // fuelAmount: that.amount,
					fuelAmount: that.concessionalRate,
			        stationId: that.stationId,
			        cardType: showCard.cardType,
			        fuelNo: that.normId
			    }
			    // if (cardType != 3) {
			    //     param.comId = that.stationId
			    // }
				console.log(param,'requestCouponList');
			    util.postRequest(api.findUseCoupon, param).then(function (res) {
			        console.log(res);
			        if (res.retCode == '0000000') {
			            let best = {}
			            let userCouponId = ''
			            if (res.rspBody.best) {
			                best = res.rspBody.best
			                userCouponId = res.rspBody.best.userCouponId
			            }
				
			            that.cashYesCouponList = res.rspBody.cashYesCouponList;
			                // that.couponDetails = JSON.stringify(best) == '{}' ? '' : best.couponDetails;   //优惠券优惠金额
							that.couponDetails = JSON.stringify(best) == '{}' ? '' : best.couponDetails ? best.couponDetails : best.couponItemVOList[0].discount + '折';   //优惠券优惠金额
							// 
							console.log(that.couponDetails, "优惠券详情")
							console.log(best,"优惠券")
							console.log('hahahhahhhhhhhhhhhhhhhh',that.couponDetails)
			                that.preferentialAmount = JSON.stringify(best) == '{}' ? 0 : best.couponItemVOList[0].amount;
			                that.bastCoupon = res.rspBody.best;
			                that.couponId = JSON.stringify(best) == '{}' ? '' : best.userCouponId;
			            console.log(that.preferentialAmount, "preferentialAmount");
			            //输入时候查询优惠金额
			            that.requestCalTotal(amount, fuelSalePrice, userCouponId, typeId, normId)
			        } else {
			            uni.showToast({
			                title: res.retDesc,
			                icon: 'none'
			            })
			        }
			    });
			},
				
				
				
			showPayPwd() {
			    // 显示遮罩层
			    var animation = uni.createAnimation({
			        duration: 200,
			        timingFunction: "linear",
			        delay: 0
			    })
			    this.animation = animation
			    animation.translateY(0).step()
			    this.animationData = animation.export();
			        this.payPwdshowModalStatus = true;
			        this.Value = '';
			    setTimeout(function () {
			        animation.translateY(0).step()
			        this.animationData = animation.export();
			    }.bind(this), 200)
			},
			selectOilCard() {
			    // 显示遮罩层
			    var animation = uni.createAnimation({
			        duration: 200,
			        timingFunction: "linear",
			        delay: 0
			    })
			    this.animation = animation
			    animation.translateY(300).step()
			    this.animationData = animation.export();
			        this.showModalStatus = true;
			    setTimeout(function () {
					console.log('================>')
			        animation.translateY(0).step()
			        this.animationData = animation.export();
			    }.bind(this), 200)
			},
			hideModal(e) {
			    // 隐藏遮罩层
			    var animation = uni.createAnimation({
			        duration: 200,
			        timingFunction: "linear",
			        delay: 0
			    })
			    this.animation = animation
			    animation.translateY(300).step()
			    this.animationData = animation.export();
			    setTimeout(function () {
			        animation.translateY(0).step()
			        this.animationData = animation.export();
			            this.showModalStatus = false;
			            this.payPwdshowModalStatus = false;
			    }.bind(this), 200)
			},
				
			//选择加油卡
			selectItem(e) {
			    console.log(222);
			    const index = e.currentTarget.dataset.index;
			    const cardNo = this.showCard.cardNo;
			    console.log(index);
			    console.log(cardNo);
			    if (this.cardList[index].cardNo != cardNo) {
			        let typeList = this.typeList
			        for (let i = 0; i < typeList.length; i++) {
			            typeList[i].isSelect = false;
			            var childDictList = typeList[i].childDictList;
			            for (let j = 0; j < childDictList.length; j++) {
			                childDictList[j].isSelect = false;
			            }
			        }
			        this.checkSelect = index;
			            this.showCard = this.cardList[index];
			            this.normList = [];
			            this.numberList = [];
			            this.isUseCoupon = false;
			            this.oilPriceInfo = {
			                fuelPrice: 0.00,
			                fuelSalePrice: 0.00,
			                fuelGrouponPrice: 0.00,
			                fuelUnit: "",
			                id: 0
			            };
			            this.couponNo = '';
			            this.oilNum = "";
			            this.amount = "";
			            this.isInputAmount = true;
			            this.isInputNumber = true;
			            this.typeId = 0;
			            this.normId = 0;
			            this.calTotalCoupon = {
			                fuelGrouponPrice: 0,
			                couponAmount: 0,
			                fuelCouponNum: 0
			            };
			            this.typeList = typeList;
						this.concessionalRate = 0;
						this.actualPayable = 0;
			        this.requestOilType()
			    }
			    this.hideModal();
			},
				
			//选择油品类型
			onTapType(e) {
			    const index = e.currentTarget.dataset.index;
			    let typeList = this.typeList
			    const typeId = this.typeId
			    const showCard = this.showCard
			    this.normId = 0;
			        // this.isInputAmount = true;
			        // this.isInputNumber = true;
			    //平台卡单独处理
			    if (showCard.cardType == 3) {
			        // if (typeList[index].id == typeId) return
			        for (let i = 0; i < typeList.length; i++) {
			            typeList[i].isSelect = i == index;
			        }
			        // typeList[index].childDictList.map((val, index)=>{
			        //     if(index==0){
			        //         val.isSelect = true
			        //     } else{
			        //         val.isSelect = false
			        //     }
			        // })
			        console.log(typeList[index].childDictList);
			        this.typeList = typeList;
			            this.normList = typeList[index].childDictList;
			            this.typeId = typeList[index].id;
			            this.numberList = [];
			            this.oilPriceInfo = {
			                fuelPrice: 0.00,
			                fuelSalePrice: 0.00,
			                fuelGrouponPrice: 0.00,
			                fuelUnit: "",
			                id: 0
			            };
			            this.couponDetails = "";
			            this.couponNo = "";
			            this.couponId = 0;
			            this.isUseCoupon = false;
			            this.cashCouponDetails = '';
			            this.cashCouponId = '';
			            this.calTotalCoupon = {
			                fuelGrouponPrice: 0,
			                couponAmount: 0,
			                fuelCouponNum: 0
			            };
			            this.amount = '';
			            this.oilNum = "";
			            this.checkValue = [];
			        if (this.normList.length == 1) {
			            this.onTapNorm(0)
			        }
			        return;
			    }
			    if (typeList[index].id == showCard.fuelType) {
			        if (typeList[index].id == typeId) return
			        for (let i = 0; i < typeList.length; i++) {
			            typeList[i].isSelect = i == index;
			        }
			        this.typeList = typeList;
			            this.normList = typeList[index].childDictList;
			            this.typeId = typeList[index].id;
			            this.numberList = [];
			            this.oilPriceInfo = {
			                fuelPrice: 0.00,
			                fuelSalePrice: 0.00,
			                fuelGrouponPrice: 0.00,
			                fuelUnit: "",
			                id: 0
			            };
			            this.couponDetails = "";
			            this.couponNo = "";
			            this.couponId = 0;
			            this.isUseCoupon = false;
			            this.cashCouponDetails = '';
			            this.cashCouponId = '';
			            this.calTotalCoupon = {
			                fuelGrouponPrice: 0,
			                couponAmount: 0,
			                fuelCouponNum: 0
			            };
			            this.amount = '';
			            this.oilNum = "";
			        console.log(this.normList)
			    } else {
			        util.showErrorToast("请选择与油卡一致的种类")
			    }
			},
				
			//选择油品型号
			onTapNorm(e) {
			    const index = e == 0 ? 0 : e.currentTarget.dataset.index
			    let normList = this.normList
			    const normId = this.normId
			    console.log(normId)
			    console.log(normList[index].id)
			    if (normList[index].id == normId) return
			    for (let i = 0; i < normList.length; i++) {
			        normList[i].isSelect = i == index
			    }
			    const typeId = this.typeId;
			    this.normList = normList;
			        this.normId = normList[index].id;
			        this.oilNo = normList[index].typeName.replace('#', "");
			        this.numberList = [];
			        this.oilPriceInfo = {
			            fuelPrice: 0.00,
			            fuelSalePrice: 0.00,
			            fuelUnit: "",
			            id: 0
			        };
			        this.couponDetails = "";
			        this.couponNo = "";
			        this.couponId = 0;
			        this.isUseCoupon = false;
			        this.calTotalCoupon = {
			            fuelGrouponPrice: 0,
			            couponAmount: 0,
			            fuelCouponNum: 0
			        };
			        this.amount = '';
			        this.oilNum = "";
			    this.requestOilGun(typeId, normList[index].id)
			    this.requestOilPrice(typeId, normList[index].id)
				
				
			},
			onTapGun(e) {
			    const index = e.currentTarget.dataset.index;
			    let numberList = this.numberList
			    for (let i = 0; i < numberList.length; i++) {
			        numberList[i].isSelect = i == index
			    }
			    this.numberList = numberList;
			        this.gunId = numberList[index].id;
			    var stationType = this.stationType;
			    this.isInputAmount = false;
			        this.amountFocus = true;
				
				
			},
			getCardList() {
			    const that = this;
			    var showCard = that.showCard
			    var stationId = that.stationId
			    console.log(showCard)
			    var parma = {
			        compId: stationId,
			        stationComCard: 'stationCom',
			        isAddFuelPickCardList: 1   //用于区分
			    }
			    util.postRequest(api.driverOilcardList, parma).then(function (res) {
					console.log(res,'res卡列表')
			        if (res.retCode == '0000000') {
			            if (that.stationType == 1) {
			                let arr = []
			                for (let i in res.rspBody) {
			                    if ((res.rspBody[i].cardType == 1 || res.rspBody[i].cardType == 3) && res.rspBody[i].status == 1) {
			                        arr.push(res.rspBody[i])
			                    }
			                }
			                if (arr.length == 1) {
			                    const temp = arr[0]
			                    showCard["id"] = temp.id
			                    showCard["cardNo"] = temp.cardNo
			                    showCard["userName"] = temp.userName
			                    showCard["amount"] = temp.amount
			                    showCard["cardFlag"] = temp.cardFlag
			                    showCard["fuelType"] = temp.fuelType
			                    showCard["cardType"] = temp.cardType
			                    showCard["compName"] = temp.compName
			                    showCard["compSecondName"] = temp.compSecondName
								showCard["plateNo"] = temp.plateNo
			                    that.cardList = arr;
			                        that.showCard = temp;
			                        that.cardNo = temp.cardNo;
				
			                } else {
			                    that.selectOilCard()
			                    that.cardList = arr;
			                }
			            } else {
			                let arr = []
			                for (let i in res.rspBody) {
			                    if (res.rspBody[i].status == 1) {
			                        arr.push(res.rspBody[i])
			                    }
			                }
			                const temp = arr[0]
			                showCard["id"] = temp.id
			                showCard["cardNo"] = temp.cardNo
			                showCard["userName"] = temp.userName
			                showCard["amount"] = temp.amount
			                showCard["cardFlag"] = temp.cardFlag
			                showCard["fuelType"] = temp.fuelType
			                showCard["cardType"] = temp.cardType
			                showCard["compName"] = temp.compName
			                showCard["compSecondName"] = temp.compSecondName
							showCard["plateNo"] = temp.plateNo
			                if (arr.length == 1) { } else {
			                    that.selectOilCard()
			                }
			                that.cardList = arr;
			                    that.showCard = temp;
			                    that.cardNo = temp.cardNo;
			            }
			        } else {
			            uni.showToast({
			                title: res.retDesc,
			                icon: 'none'
			            })
			        }
			    });
			},
			requestRefreshSelectCard() {
			    const that = this;
			    var showCard = that.showCard
			    var stationId = that.stationId
			    var parma = {
			        compId: stationId,
			        stationComCard: 'stationCom'
			    }
			    util.postRequest(api.driverOilcardList, parma).then(function (res) {
			        // console.log(res);
			        if (res.retCode == '0000000') {
			            for (let i = 0; i < res.rspBody.length; i++) {
			                if (showCard.cardNo == res.rspBody[i].cardNo) {
			                    showCard.amount = res.rspBody[i].amount
			                }
			            }
			            that.showCard = showCard;
			        }
			    });
			},
			requestOilType() {
			    const that = this
			    uni.showLoading({
			        title: '请稍候...',
			    })
			    const parma = {
			        "stationId": that.stationId
			    }
			    var showCard = this.showCard
			    util.postRequest(api.getSiteInfo, parma).then(function (res) {
			        // console.log(res);
			        uni.hideLoading();
			        if (res.retCode == '0000000') {
			            const list = res.rspBody.FUEL_TYPE;
			            let typeList = []
			            if (list != null) {
			                for (let i = 0; i < list.length; i++) {
			                    let bean = {}
			                    bean.id = list[i].id
			                    bean.typeName = list[i].typeName
			                    let childList = []
			                    const childDictList = list[i].childDictList
			                    for (let j = 0; j < childDictList.length; j++) {
			                        let child = {}
			                        child.typeName = childDictList[j].typeName
			                        child.id = childDictList[j].id
			                        bean.isSelect = true
			                        childList.push(child)
			                    }
			                    bean.childDictList = childList
			                    if (list[i].id == showCard.fuelType && showCard.cardType != 3) {
			                        that.index = i;
			                        bean.isSelect = true
			                    } else {
			                        bean.isSelect = false
			                    }
			                    if (showCard.cardType == 3 && list.length == 1) {
			                        that.index = i;
			                        bean.isSelect = true
			                    }
			                    typeList.push(bean)
			                    // console.log(typeList)
			                }
			            }
			            // console.log(typeList, that.index)
			            if (that.index == 10) {
			                that.typeList = typeList;
			            } else {
			                that.typeList = typeList;
			                    that.normList = typeList[that.index].childDictList;
			                    that.typeId = typeList[that.index].id;
			                    that.numberList = [];
			                    that.oilPriceInfo = {
			                        fuelPrice: 0.00,
			                        fuelSalePrice: 0.00,
			                        fuelGrouponPrice: 0.00,
			                        fuelUnit: "",
			                        id: 0
			                    };
			                    that.couponDetails = "";
			                    that.couponNo = "";
			                    that.couponId = 0;
			                    that.isUseCoupon = false;
			                    that.calTotalCoupon = {
			                        fuelGrouponPrice: 0,
			                        couponAmount: 0,
			                        fuelCouponNum: 0
			                    };
			                    that.amount = '';
			                    that.oilNum = "";
			            }
			            // console.log('list', list[0])
			            // if(list.length==1 && that.normList.length==1){
			            //     that.onTapNorm(0)     
			            // }
			            if (that.normList.length == 1) {
			                that.onTapNorm(0)
			            }
			        } else {
			            uni.showToast({
			                title: res.retDesc,
			                icon: 'none'
			            })
			        }
			    });
			},
			requestOilGun(fuelType, fuelDictId) {
			    const that = this
			    uni.showLoading({
			        title: '请稍候...',
			    })
			    const parma = {
			        "stationId": that.stationId,
			        "fuelType": fuelType,
			        "fuelDictId": fuelDictId
			    };
			    util.postRequest(api.getOilGun, parma).then(function (res) {
			        console.log(res);
			        uni.hideLoading();
			        if (res.retCode == '0000000') {
			            const list = res.rspBody;
			            let numberList = []
			            if (list != null) {
			                for (let i = 0; i < list.length; i++) {
			                    let bean = {}
			                    bean.id = list[i].id
			                    bean.gunName = list[i].gunName
			                    bean.fuelType = list[i].fuelType
			                    bean.fuelDictId = list[i].fuelDictId
			                    bean.isSelect = false
			                    numberList.push(bean)
			                }
			            }
			            console.log(numberList)
			            that.numberList = numberList;
				
			        } else {
			            uni.showToast({
			                title: res.retDesc,
			                icon: 'none'
			            })
			        }
			    });
			},
				
			requestOilPrice(fuelType, fuelDictId) {
			    const that = this
			    uni.showLoading({
			        title: '请稍候...',
			    })
			    const parma = {
			        "stationId": that.stationId,
			        "fuelType": fuelType,
			        "fuelDictId": fuelDictId,
			        "cardId": that.showCard.id,
			    };
			    var stationType = this.stationType;
			    util.postRequest(api.getOilList, parma).then(function (res) {
			        console.log(res);
			        uni.hideLoading();
			        if (res.retCode == '0000000') {
			            let temp = res.rspBody[0]
			            console.log(temp)
			            if (that.flag == 2) {
			                if (temp != null) {
			                    if (temp.fuelGrouponPrice == '') {
			                        console.log(that.typeList)
			                        uni.showModal({
			                            title: '提示',
			                            content: '该油品未设置拼团价,请选择其他油品',
			                            showCancel: false
			                        })
			                        if (stationType != 4) {
			                            that.isInputAmount = true;
			                                that.isInputNumber = true;
			                        }
			                        return
			                    } else {
			                        let oilPriceInfo = that.oilPriceInfo
									let flagPrice = 0
			                        oilPriceInfo.fuelPrice = temp.fuelPrice
			                        oilPriceInfo.fuelSalePrice = temp.fuelSalePrice
			                        oilPriceInfo.fuelGrouponPrice = temp.fuelGrouponPrice
			                        oilPriceInfo.fuelUnit = temp.fuelUnit
			                        oilPriceInfo.id = temp.id
			                        oilPriceInfo.fuelBeforePrice = temp.fuelBeforePrice,
			                            oilPriceInfo.fuelSettlePrice = temp.fuelSettlePrice,
			                            oilPriceInfo.invoiceFlag = temp.invoiceFlag,
			                            oilPriceInfo.fuelNo = temp.ext1
										oilPriceInfo.fuelGunPrice = temp.fuelGunPrice
										
									// fuelGunPrice     原价
									// fuelPrice   优惠价
						            if(!oilPriceInfo.fuelPrice && oilPriceInfo.fuelPrice <=  0) {
						                //优惠价无值或≤0  展示原价
						                flagPrice = 1
						            }else if(oilPriceInfo.fuelPrice< oilPriceInfo.fuelGunPrice) {
						                // 优惠价＜原价    展示优惠价
						                flagPrice = 2
						            }else if(oilPriceInfo.fuelPrice >= oilPriceInfo.fuelGunPrice) {
						                // 优惠价≥原价   展示优惠价
						                flagPrice = 3
						            }
									that.flagPrice = flagPrice	
			                        that.oilPriceInfo = oilPriceInfo;
									
			                        if (stationType != 4) {
			                            that.isInputAmount = false;
			                                that.isInputNumber = false;
			                        }
			                    }
			                } else {
			                    let oilPriceInfo = that.oilPriceInfo
			                    uni.showModal({
			                        title: '提示',
			                        content: '油站暂无该油品,请选择其他油品',
			                        showCancel: false
			                    })
			                    that.oilPriceInfo = oilPriceInfo;
			                        that.isInputAmount = true;
			                        that.isInputNumber = true;
			                    return
			                }
			            } else {
							let flagPrice = 0;
			                let oilPriceInfo = that.oilPriceInfo
			                oilPriceInfo.fuelPrice = temp.fuelPrice
			                oilPriceInfo.fuelSalePrice = temp.fuelSalePrice
			                oilPriceInfo.fuelGrouponPrice = temp.fuelGrouponPrice
			                oilPriceInfo.fuelUnit = temp.fuelUnit
			                oilPriceInfo.id = temp.id
			                oilPriceInfo.fuelBeforePrice = temp.fuelBeforePrice,
			                    oilPriceInfo.fuelSettlePrice = temp.fuelSettlePrice,
			                    oilPriceInfo.invoiceFlag = temp.invoiceFlag,
			                    oilPriceInfo.fuelNo = temp.ext1
								oilPriceInfo.fuelGunPrice = temp.fuelGunPrice
								
							// fuelGunPrice     原价
				            // fuelPrice   优惠价
				            if(!oilPriceInfo.fuelPrice && oilPriceInfo.fuelPrice <=  0) {
				                //优惠价无值或≤0  展示原价
				                flagPrice = 1
				            }else if(oilPriceInfo.fuelPrice< oilPriceInfo.fuelGunPrice) {
				                // 优惠价＜原价    展示优惠价
				                flagPrice = 2
				            }else if(oilPriceInfo.fuelPrice >= oilPriceInfo.fuelGunPrice) {
				                // 优惠价≥原价   展示优惠价
				                flagPrice = 3
				            }
										
			                if (stationType != 4) {
			                    that.isInputAmount = false;
			                        that.isInputNumber = false;
			                }
			                that.oilPriceInfo = oilPriceInfo;
							that.flagPrice = flagPrice
			            }
			        } else {
			            uni.showToast({
			                title: res.retDesc,
			                icon: 'none'
			            })
			        }
			    });
			},
				
			//查询优惠多少接口
			requestCalTotal(fuelAmount, fuelPrice, userCouponId, fuelType, fuelDictId) {
				console.log(fuelAmount, fuelPrice, userCouponId, fuelType, fuelDictId,'查询优惠多少接口查询优惠多少接口')
			    const that = this
			    let arr1 = that.couponId == 0 || that.couponId == undefined ? '' : that.couponId
			    let arr = that.checkValue
			    let sing = 1
				let totalSavings = 0;
				let actualPayable = 0;
				let isUseCoupon = false;
			    uni.showLoading({
			        title: '请稍候...',
			    })
			    that.userCouponId = userCouponId;
			    const parma = {
			        // "fuelAmount": fuelAmount,
					"fuelAmount":that.concessionalRate,
			        "fuelPrice": fuelPrice,
			        "userCouponIds": [arr1].concat(arr),
			        "fuelType": fuelType,
			        "fuelDictId": fuelDictId,
			        "stationId": that.stationId,
			    };
			    if (!that.sign && that.fuelNo) {
			        parma.fuelNo = that.fuelNo;
			    }
			    console.log(parma, "券参数");
			    let calTotalCoupon = that.calTotalCoupon;
			    util.postRequest(api.calCouponPrice, parma).then(function (res) {
			        console.log(res, "res");
			        uni.hideLoading();
			        if (res.retCode == '0000000') {
			            //优惠金额计算逻辑：   加油金额 - 现金券  * 折扣率
			            //判断不管是先选择的折扣券还是现金券  都是按照逻辑计算，如果减去现金券  折扣券不满足使用规则  就弹框提示他
			            if (res.rspBody.userCouponsAmount) {
			                let obj = {
			                    112: 0,
			                    113: 0,
			                    114: 0,
			                }
			                res.rspBody.userCouponsAmount.forEach(item => {
			                    obj[item.couponType]++
			                })
				
			                if(that.couponId != "" && obj[113] && !obj[112]&& !obj[114]) {
			                    sing = 2
			                }else if(obj[113] || obj[114]) {
			                    console.log("113 114共存");
			                }
				
			                if (sing == 2) {
			                    uni.showModal({
			                        title: '提示',
			                        content: '您使用现金券后，已不符合折扣券使用条件。',
			                        showCancel: false,
			                        success(res) {
			                            if (res.confirm) {
			                                that.couponDetails = '请选择';
			                                    that.couponId = '';
				
			                            }
			                        }
			                    })
			                }
			            }
			            
			            calTotalCoupon.fuelNum = res.rspBody.fuelNum
			            calTotalCoupon.fuelAmount = res.rspBody.fuelAmount
			            calTotalCoupon.fuelPrice = res.rspBody.fuelPrice
			            calTotalCoupon.remark = res.rspBody.remark
			            // calTotalCoupon.fuelCouponPrice = res.rspBody.fuelCouponPrice
			            calTotalCoupon.fuelGrouponPrice = res.rspBody.fuelGrouponPrice
			            calTotalCoupon.couponAmount = res.rspBody.couponAmount
			            calTotalCoupon.fuelCouponNum = res.rspBody.fuelCouponNum
			            calTotalCoupon.payTypeList = res.rspBody.payTypeList
			            calTotalCoupon.fuelCouponAmount = res.rspBody.fuelCouponAmount
			            calTotalCoupon.userCouponsAmount = res.rspBody.userCouponsAmount
			            let oilNum = ''
			            // oilNum = app.globalData.newToFixed(calTotalCoupon.fuelAmount / calTotalCoupon.fuelPrice, 3);
						
						// 共节省 = 如果有用券就是( 订单金额-优惠价应支付金额 -券优惠金额 )  ，没用券就是(订单金额-优惠价应支付金额 ) 
						if(res.rspBody.couponAmount) {
							totalSavings =  app.globalData.newToFixed((that.amount -  that.concessionalRate) + res.rspBody.couponAmount,2);
							actualPayable = app.globalData.newToFixed((that.concessionalRate - res.rspBody.couponAmount),2)
						}else {
							totalSavings = app.globalData.newToFixed(that.amount -  that.concessionalRate,2);
							actualPayable = that.concessionalRate
						}
						console.log(totalSavings,'共节省')
						console.log(that.calTotalCoupon, "1111calTotalCouponcalTotalCoupon");
						console.log(that.oilNum,'that.oilNum')
						console.log(actualPayable,'actualPayable')
						
						//计算券后优惠价
						console.log(res.rspBody.userCouponIds.length,'是否用券')
						if(res.rspBody.userCouponIds.length != 0 && that.oilNum) {
							isUseCoupon = true;
							calTotalCoupon.fuelCouponPrice = app.globalData.newToFixed((actualPayable / that.oilNum),2) 	
						}else {
							isUseCoupon = false;
							calTotalCoupon.fuelCouponPrice = 0;
							 
						}
										
										
			            that.calTotalCoupon = calTotalCoupon;
						that.isUseCoupon = isUseCoupon;
						// that.oilNum = oilNum;
						that.totalSavings = totalSavings;
						that.actualPayable = actualPayable;
						
			            console.log(that.calTotalCoupon, "3333calTotalCoupon");
			            if (that.sign == 1 || that.sign == 2) {
			                // that.isUseCoupon = false;
			                    that.isUseCoupon = true;
			            }
			        } else {
			            console.log("error");
			            that.cashCouponDetails = '';
			                that.checkValue = [];
			                that.cashCouponId = '';
			            uni.showToast({
			                title: res.retDesc,
			                icon: 'none'
			            })
			        }
			    });
			},
			getQueryString(url, name) {
			    var reg = new RegExp('(^|&|/?)' + name + '=([^&|=?]*)(&|=?|$)', 'i')
			    var r = url.substr(1).match(reg)
			    if (r != null) {
			        return r[2] + '='
			    }
			    return null;
			},
			getStation() {
			    let that = this
			    if (uni.getStorageSync('token') == "") {
			        uni.showModal({
			            title: "当前为未登录状态，请登录后操作,跳转登录页",
			            // content:"跳转登录页？",
			            icon: 'none',
			            success(res) {
			                if (res.confirm) {
			                    uni.reLaunch({
			                        url: '/pages/login/login/loginSelect/loginSelect',
			                    })
			                }
			            },
			        });
			        return
			    }
			    uni.getLocation({
			        success: function (res1) {
			            console.log(that.secret)
			            var parm = {
			                secret: that.secret,
			                latitude: res1.latitude,
			                longitude: res1.longitude,
			            }
			            util.postRequest(api.getoilstationInfoByQrcode, parm).then(function (res) {
			                console.log('res', res);
			                if (res.retCode == '0000000') {
			                    let isMembership = res.rspBody.isMembership
			                    let map = res.rspBody
			                    that.isMembership = isMembership;
			                    util.postRequest(api.driverOilcardList, {}).then(function (res) {
			                        if (res.retCode == '0000000') {
			                            let list = res.rspBody
			                            for (let i in list) {
			                                if (list[i].cardType == 1) {
			                                    that.isMembership = true;
			                                }
			                            }
			                            console.log(map.stationDetail.stationType, that.isMembership)
			                            if (map.stationDetail.stationType == 1 && that.isMembership == false) {
			                                uni.showModal({
			                                    title: '提示',
			                                    content: "您的账户没有车队卡，暂无法在主营油站加油，请与车队联系开卡事宜",
			                                    showCancel: false,
			                                    success: function () {
			                                        uni.switchTab({
			                                            url: '../../oilstationIndex/oilstationIndex',
			                                        })
			                                    }
			                                })
			                                return
			                            }
			                            if (that.isMembership == true) {
			                                that.stationId = map.stationDetail.id;
			                                    that.thirdPartyId = map.stationDetail.thirdPartyId;
			                                    that.stationName = map.stationDetail.compSecondName;
			                                    that.stationType = map.stationDetail.stationType;
			                                    that.payToken = map.payToken;
			                                    that.opId = map.user.id;
			                                    that.fuelsList = map.fuelsList;
			                                that.requestOilType()
			                                that.getCardList()
			                            } else {
			                                uni.showModal({
			                                    title: '提示',
			                                    content: "您不是本站会员，请开通油站会员卡",
			                                    showCancel: false,
			                                    success: function () {
			                                        uni.navigateTo({
			                                            url: "../../addVip/addVip?stationId=" + map.stationDetail.id
			                                        })
			                                    }
			                                })
			                            }
			                        } else {
			                            uni.showToast({
			                                title: res.retDesc,
			                                icon: 'none'
			                            })
			                        }
			                    });
				
			                } else {
			                    uni.showModal({
			                        title: '提示',
			                        content: res.retDesc,
			                        showCancel: false,
			                        success: function () {
			                            uni.switchTab({
			                                url: '../../oilstationIndex/oilstationIndex',
			                            })
			                        }
				
			                    })
			                }
			            });
			        },
			    })
			},
			/**
			 * 生命周期函数--监听页面加载
			 */
			onLoad: function (options) {
			    console.log(options)
			    let that = this
			    //在此函数中获取扫描普通链接二维码参数
			    let q = decodeURIComponent(options.q)
			    if (q) {
			        this.secret = that.getQueryString(q, 'result');
			    }
			    this.isInputMoney = options.isInputMoney ? options.isInputMoney : 0;
			    if (this.secret != null) {
			        this.getStation()
			    } else if (options.sign == 1) {
			        const map = JSON.parse(options.map)
			        this.stationId = map.stationDetail.id;
			            this.stationName = map.stationDetail.compSecondName;
			            this.stationType = map.stationDetail.stationType;
			            this.payToken = map.payToken;
			            this.opId = map.user.id;
			            this.flag = options.flag;
			            this.fuelsList = map.fuelsList;
			            this.minConsumeAmount = options.minConsumeAmount;
			        this.requestOilType()
			        this.getCardList()
			    } else {
			        const stationId = options.stationId;
			        const stationType = options.stationType;
			        var driverInfo = uni.getStorageSync('driverInfo');
			        this.stationId = stationId;
			            this.stationType = stationType;
			            // this.opId = driverInfo.userId;
			            this.flag = options.flag;
			            this.minConsumeAmount = options.minConsumeAmount;
			        console.log('hhhh', stationId)
			        if (stationId) {
			            this.getOilstationDetail(stationId, driverInfo.userId);
			        }
			    }
			},
				
				
				
			getOilstationDetail(id, userId) {
			    var that = this;
			    uni.getLocation({
					type: 'gcj02',
			        success: function (res) {
			            var parm = {
			                id: id,
			                stationType: that.stationType,
			                userId: userId,
			                latitude: res.latitude,
			                longitude: res.longitude,
			            }
			            util.postRequest(api.oilstationDetail, parm).then(function (res) {
			                console.log(res);
			                if (res.retCode == '0000000') {
			                    that.fuelsList = res.rspBody.fuelsList;
			                        that.stationName = res.rspBody.stationDetail.compSecondName;
			                        that.stationType = res.rspBody.stationDetail.stationType;
			                        that.thirdPartyId = res.rspBody.stationDetail.thirdPartyId;
									that.ext1 =  res.rspBody.stationDetail.ext1
			                    that.requestOilType()
			                    that.getCardList()
				
			                } else {
			                    uni.showToast({
			                        title: res.retDesc,
			                        icon: 'none'
			                    })
			                }
			            });
			        },
					fail: function(err) {
						uni.showToast({
							title: '请打开定位',
							icon: 'none'
						})
					}
			    })
			},
			checkCardName(flag) {
			    let str = "";
			    if ("CC" == flag) {
			        str = "车队柴油卡"
			    } else if ("YC" == flag) {
			        str = "油站柴油卡"
			    } else if ("YQ" == flag) {
			        str = "油站汽油卡"
			    } else if ("YG" == flag) {
			        str = "油站天然气卡"
			    } else {
			        str = "车队柴油卡"
			    }
			    return str;
			},
				
			clickToPay: function () {
				let that = this;
			    let price = ''
				var actualPayment = 0;
				var concessionalRate = that.concessionalRate;
				var calTotalCoupon = that.calTotalCoupon;
				
			    // if (this.hasPayPassword == 1) {
			        if (this.amount == "") {
			            uni.showModal({
			                title: '提示',
			                content: '请输入正确金额',
			                showCancel: false
			            })
			            return;
			        }
			        if (this.typeId == 0) {
			            uni.showModal({
			                title: '提示',
			                content: '请选择油品',
			                showCancel: false
			            })
			            return;
			        }
			        if (this.normId == 0) {
			            uni.showModal({
			                title: '提示',
			                content: '请选择油品型号',
			                showCancel: false
			            })
			            return;
			        }
			        if (this.stationType == 4 && this.amount < 5) {
			            uni.showToast({
			                title: '加油金额必须大于5元',
			                icon: 'none'
			            })
			            return
			        }
			        if (this.isUseCoupon && this.calTotalCoupon.fuelCouponPrice <= 0) {
			            uni.showToast({
			                title: '优惠后单价必须大于0',
			                icon: 'none'
			            })
			            return;
			        }
				
			        if (this.amount < this.calTotalCoupon.couponAmount) {
			            uni.showToast({
			                title: '满' + this.calTotalCoupon.couponAmount + '元才可使用此券',
			                icon: 'none'
			            })
			            return;
			        }
				
				
			        // this.calTotalCoupon.fuelPrice != null ? this.calTotalCoupon.fuelPrice : this.oilPriceInfo.fuelPrice
			        console.log(this.calTotalCoupon);
			        if (this.calTotalCoupon.fuelPrice != null) {
			            price = this.calTotalCoupon.fuelPrice
			            console.log(price);
			        } else if (this.showCard.cardType == 2) {
			            if (this.oilPriceInfo.fuelSalePrice && this.oilPriceInfo.fuelSalePrice != 0) {
			                price = this.oilPriceInfo.fuelSalePrice
			            } else {
			                price = this.oilPriceInfo.fuelPrice
			            }
			        } else {
			            price = this.oilPriceInfo.fuelPrice
			        }
			        console.log(price, "price", app.globalData.newToFixed(this.amount, 2));
					
					//重新计算去支付的金额（实际支付金额 = 优惠价应支付金额减去优惠券满减金额  没用券就等于实际支付金额）
					 if(this.calTotalCoupon.couponAmount && this.calTotalCoupon.couponAmount > 0) {
						actualPayment =  app.globalData.newToFixed((concessionalRate - this.calTotalCoupon.couponAmount),2)
					}else {
						actualPayment = concessionalRate
					}
								
								
			        const data = {
			            userCouponId: this.couponId == 0 ? '' : this.couponId,
			            fuelType: this.typeId,
			            fuelDictId: this.normId,
			            fuelGunId: this.gunId,
			            cardId: this.showCard.id,
			            stationId: this.stationId,
			            opId: this.opId ? this.opId : 0,			            
			            fuelNum: this.oilNum,
			            fuelAmount: app.globalData.newToFixed(this.amount, 2),  //订单金额
						actualPayment:actualPayment,   //实际支付金额
			            fuelAccuracyNum: this.fuelAccuracyNum,
			            payToken: this.payToken,
			            showCard: this.showCard,
			            stationType: this.stationType,
			            payTypeList: this.calTotalCoupon.payTypeList,
			            depreciateAmount: this.depreciateAmount ? this.depreciateAmount : 0,
			            fuelBeforePrice: this.oilPriceInfo.fuelBeforePrice,
			            isUseCoupon: this.isUseCoupon,
			            // isUseCoupon: (this.sign == 1 || this.sign == 2 || this.sign == 0) ? true : false,
			            fuelCouponAmount: this.calTotalCoupon.fuelCouponAmount,
			            fuelNo: this.fuelNo,
			            fuelSettlePrice: this.oilPriceInfo.fuelSettlePrice,
			            invoiceFlag: this.oilPriceInfo.invoiceFlag,
			            isInputMoney: this.isInputMoney,
			            cashCouponId: this.cashCouponId == 0 ? "" : this.cashCouponId,
			            cashCouponDetails: this.cashCouponDetails,
			            checkValue: this.checkValue,
						straightDown: this.straightDown,
						ext1:this.ext1,
						fuelSalePrice:this.oilPriceInfo.fuelSalePrice,
						fuelGunPrice: this.oilPriceInfo.fuelGunPrice,
						// fuelPrice: price,
						fuelPrice: this.oilPriceInfo.fuelPrice
			        }
			        if (this.stationType == 5) {
			            data.fuelNo = this.oilPriceInfo.fuelNo;
			        }
					console.log('======>', this.stationType, this.depreciateAmount)
					// if (this.stationType == 4 && this.depreciateAmount){
					// 	data.fuelAmount = this.depreciateAmount;
					// }
			        console.log(data, "datadata");
			        if (this.flag == 2) {
			            this.showModal = true;
			            console.log(this.showModal)
			        } else {
			            console.log(data, "data去支付");
			            uni.navigateTo({
			                url: '../payOil/payOil?map=' + JSON.stringify(data),
			            })
			        }
				
				
			        // uni.removeStorageSync('couponId1');
			        // uni.removeStorageSync('couponId2');
				
			    // } else {
			    //     uni.showModal({
			    //         title: '提示',
			    //         content: '您尚未创建支付密码，请先创建支付密码再进行加油',
			    //         showCancel: false,
			    //         success: function () {
				// 			console.log('跳转到设置密码')
			    //             uni.navigateTo({
				// 				url: '/pages/my/settings/firstSetPassword',
				// 			})
			    //         }
			    //     })
			    // }
			},
			confirm1() {
			    this.showModal1 = false;
			        this.showModal = false;
			    setTimeout(function () {
			        uni.switchTab({
			            url: '../../../order/orderIndex/orderIndex',
			        })
			    }, 2000);
				
			},
			confirm() {
			    let that = this
			    const list = {
			        fuelType: this.typeId,
			        fuelDictId: this.normId,
			        fuelGunId: this.gunId,
			        cardId: this.showCard.id,
			        stationId: this.stationId,
			        opId: this.opId,
			        fuelCouponPrice: this.oilPriceInfo.fuelGrouponPrice,
			        fuelPrice: this.oilPriceInfo.fuelPrice,
			        fuelNum: this.oilNum,
			        fuelAmount: this.amount,
			        fuelCouponNum: this.calTotalCoupon.fuelCouponNum,
			        couponAmount: this.calTotalCoupon.couponAmount,
			        oneOrderId: "",
			        grouponUserType: 1,
			        payToken: this.payToken,
			        showCard: this.showCard,
			        payTypeList: this.calTotalCoupon.payTypeList
			    }
			    console.log(list)
			    // return
			    util.postRequest(api.launchAgroup, list).then(function (res) {
			        if (res.retCode == '0000000') {
			            console.log(res)
			            that.showModal = false;
			                that.showModal1 = true;
			                that.ddlist = res.rspBody.orderEntity;
			            if (that.ddlist != []) {
			                that.showModal = false;
			            }
			        } else {
			            uni.showModal({
			                title: '提示',
			                content: res.retDesc,
			                showCancel: false,
			            })
			            that.showModal = false;
			        }
			    });
			},
			cancel() {
			    this.showModal = false;
			        this.showModal1 = false;
				
			},
			cancel1() {
			    this.showModal = false;
			        this.showModal1 = false;
			    setTimeout(function () {
			        uni.switchTab({
			            url: '../../../order/orderIndex/orderIndex',
			        })
			    }, 2000);
				
			},
			confirmAmount() {
				console.log('-------->', '失去焦点')
			    //金额确认后查询直降金额
				var that = this;
			    var amount = this.amount;
			    if (!amount) {
			        uni.showToast({
			            title: '请输入金额',
			            icon: 'none'
			        })
			        return;
			    }
			    var reg = /^[+-]?[0-9]+(\.[0-9]{1,4})?$/;
			    if (!reg.test(amount)) {
			        uni.showToast({
			            title: '金额只能输入数字',
			            icon: 'none'
			        })
			        return;
			    }
			    if (this.stationType != 4) {
			        this.amountFocus = false;
			            this.oilNumFocus = true;
			        return
			    }
			    if (amount < 5) {
			        uni.showToast({
			            title: '加油金额必须大于5元',
			            icon: 'none'
			        })
			        return;
			    }
				
			    var data = {
			        gasId: this.thirdPartyId,
			        oilNo: this.oilNo,
			        amountGun: amount,
			    }
			    console.log(amount)
				return;
				 // 后端说这个接口不在调用  不然会提示api调用异常
			    util.postRequest(api.fallDownPrice, data)
			        .then(res => {
			            if (res.retCode == "0000000") {
			                console.log(res, 'jine1')
							let depreciateAmount = amount
							// res.rspBody.depreciateAmount = 7.02;
							if (res.rspBody.depreciateAmount) {
								depreciateAmount = amount - res.rspBody.depreciateAmount;
								that.straightDown = res.rspBody.depreciateAmount;
							}
			                that.isInputNumber = false;
			                    that.amountFocus = false;
			                    that.oilNumFocus = true;
			                    that.depreciateAmount = depreciateAmount;
								
								
								console.log('===========>', that.depreciateAmount);
				
			            } else {
			                uni.showToast({
			                    title: res.retDesc,
			                    icon: 'none',
			                })
			            }
			        })
			},
		}
	}
</script>
<style>
@import "./addOilIndex.css";
</style>