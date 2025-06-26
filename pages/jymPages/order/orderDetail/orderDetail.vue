<template>
<view>
<view class="jym-container">
	<!-- 	<view style="position: absolute; top: 90rpx; left: 30rpx; z-index: 1111;">
			<image style=" width: 40rpx;height: 40rpx;" src="../../../images/icon_group_status.png"></image>
			<text>拼团中</text>
	</view> -->
	<image class="groupstatus" v-if="orderInfo.isGroupon==1?true:false" :src="statusImage1"></image>
	<view class="contentView">
		<view class="statusView">
			<image class="statusImage" :src="statusImage"></image>
			<text>{{statusText}}</text>
			<label v-if="orderInfo.orderStatus==1?true:false">{{orderInfo.finishDt}}</label>
			<label v-if="orderInfo.isGroupon==1&&orderInfo.orderStatus==3&&orderInfo.grouponStatus!=9&&orderInfo.payType!=9&&orderInfo.isGrouponCancel!= 1?true:false">剩:
				<text>{{newTime}}</text>

			</label>
		</view> 
		
		
		<view class="card-box" v-if="orderInfo.orderStatus == 1 && orderInfo.ext1 == 10"   @tap="cardTap">
			<image class="card-img" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/SQcard.png"></image>
			<view class="card-text">上汽联名卡</view>
		</view>
		
				
		<view class="itemView" style="margin-top:20rpx;">
			<text>加油站</text>
			<label>{{orderInfo.stationSecondName}}</label>
		</view>
		<view class="itemView">
		  <text>车牌号</text>
		  <label>{{orderInfo.plateNo}}</label>
		</view>
		<view class="itemView">
			<text>订单号</text>
			<label>{{orderInfo.orderNo}}</label>
		</view>
		<!--    <view class="itemView">-->
		<!--      <text>车牌号</text>-->
		<!--      <label>{{orderInfo.plateNo}}</label>-->
		<!--    </view>-->
		<view class="itemView">
			<text>油品型号</text>
			<label>{{orderInfo.fuelName}}</label>
		</view>
		<view class="itemView">
			<text>单价</text>

			<!-- 油站有促销价的时候用促销价（fuelSalePrice）  没有促销价用普通价格(fuelPrice) -->
			<label v-if="orderInfo.cardType == 2">{{orderInfo.fuelSalePrice ? orderInfo.fuelSalePrice.toFixed(2) : orderInfo.fuelPrice.toFixed(2)}}元/{{orderInfo.fuelUnit}}</label>
			<label v-else>{{orderInfo.fuelPrice.toFixed(2)}}元/{{orderInfo.fuelUnit}}</label>
		</view>
		<!-- <view class="itemView">
			<text>加油金额</text>
			<label>{{orderInfo.fuelAmount.toFixed(2)}}元</label>
		</view> -->
		
		<!-- 加油新逻辑 -->
		<view class="itemView">
			<text>订单金额</text>
			<label>{{orderInfo.fuelAmount}}元</label>
		</view>
				
		<view class="itemView" v-if="orderInfo.isGroupon==1?false:true">
			<text>加油量</text>
			<label>{{orderInfo.fuelNum.toFixed(2)}}{{orderInfo.fuelUnit}}</label>
		</view>
		<view class="itemView" v-if="orderInfo.isGroupon==1">
			<text>原价加油量</text>
			<label>{{orderInfo.fuelNum.toFixed(2)}}升</label>
		</view>

		
		<!-- <view class="itemView" v-if="orderInfo.couponFlag == 1">
			<text>总优惠金额</text>
			<label>{{orderInfo.couponAmount.toFixed(2)}}元</label>
		</view> -->
		<!-- <view class="itemView" v-if="orderInfo.couponFlag == 1">
			<text>红包优惠金额</text>
			<label>{{redEnvelopeDiscount}}元</label>
		</view>
		<view class="itemView" v-if="orderInfo.couponFlag == 1">
			<text>现金优惠金额</text>
			<label>{{cashDiscount}}元</label>
		</view> -->
		<view class="itemView" v-if="orderInfo.couponFlag == 1">
			<text>优惠后单价</text>
			<label>{{orderInfo.fuelCouponPrice.toFixed(2)}}元/{{orderInfo.fuelUnit}}</label>
		</view>
		<!-- <view class="itemView" v-if="orderInfo.couponFlag == 1">
			<text>实际支付金额</text>
			<label>{{orderInfo.fuelCouponAmount.toFixed(2)}}元</label>
		</view> -->


		<view class="itemView" v-if="(orderInfo.userCouponId > 0 || orderInfo.isGroupon == 1)  && orderInfo.fuelCouponPrice">
			<text>优惠后单价</text>
			<label style="color: #D93F31;">{{orderInfo.fuelCouponPrice==null?"0":orderInfo.fuelCouponPrice.toFixed(2)}}元/{{orderInfo.fuelUnit}}</label>
		</view>
		<view class="itemView" v-if="orderInfo.couponAmount">
			<text>优惠金额</text>
			<label style="color: #D93F31;">{{orderInfo.couponAmount==null?'0':orderInfo.couponAmount.toFixed(2)}}元</label>
		</view>
		<!-- <view class="itemView" wx:if="{{orderInfo.userCouponId > 0||orderInfo.isGroupon==1}}">
			<text>优惠后加油量</text>
			<label style="color: #D93F31;">{{orderInfo.fuelCouponNum==null?"0":orderInfo.fuelCouponNum}}升</label>
		</view> -->

		<!-- <view class="itemView" wx:if="{{orderInfo.payType != '9'||orderInfo.isGroupon==1?false:true}}">
			<text>积分</text>
			<label>+{{orderInfo.userPoints==null?"0":orderInfo.userPoints}}</label>
		</view> -->
		<view class="itemView" v-if="orderInfo.payWay != 2||orderInfo.isGroupon==1?false:true">
			<text>账户原金额</text>
			<label>{{orderInfo.beforeBalance.toFixed(2)}}元</label>
		</view>
		<view class="itemView" v-if="orderInfo.payWay != 2||orderInfo.isGroupon==1?false:true">
			<text>交易后金额</text>
			<label>{{orderInfo.balance.toFixed(2)}}元</label>
		</view>
		<!-- <view class="itemView" v-if="orderInfo.orderStatus!=1">
			<text>实际支付金额</text>
			<label style="color: #D93F31;">{{orderInfo.fuelCouponAmount?orderInfo.fuelCouponAmount.toFixed(2):Amount.toHide(orderInfo.fuelAmount)}}元</label>
		</view> -->
		<view class="lineView" v-if="orderInfo.orderStatus==1?true:false"></view>
		<view class="itemView" v-if="orderInfo.isGroupon==1?false:true">
			<text>支付方式</text>
			<label>{{patText}}</label>
		</view>
		<!--    <view class="itemView {{payType != '1'?'':'disappear'}}">-->
		<!--      <text>现金支付金额</text>-->
		<!--      <label>{{orderInfo.bankPayAmount}}元</label>-->
		<!--    </view>-->
		<!--    <view class="itemView {{payType != '1'?'':'disappear'}}">-->
		<!--      <text>现金支付账户</text>-->
		<!--      <label>{{orderInfo.bankPayAccount}}</label>-->
		<!--    </view>-->
		<view class="itemView" v-if="orderInfo.payWay != 2||orderInfo.isGroupon==1?false:true">
			<text>支付卡号</text>
			<label>{{orderInfo.cardNo}}</label>
		</view>
		
		<!-- 加油订单新逻辑修改 -->
		<view class="itemView" v-if="orderInfo.isGrouponCancel!=1?true:false">
			<!-- <text>交易金额</text> -->
			<text>实际支付金额</text>
			<label>¥{{orderInfo.fuelCouponAmount?orderInfo.fuelCouponAmount.toFixed(2):orderInfo.fuelAmount.toFixed(2)}}</label>
		</view>
		
		<view class="itemView">
		  <text>油卡所属公司</text>
		  <label>{{orderInfo.compName}}</label>
		</view>
		
		
		<view class="itemView" v-if="orderInfo.isGroupon==1&&orderInfo.orderStatus==1&&orderInfo.isGrouponCancel!=1?true:false">
			<text>加油状态</text>
			<label>{{orderInfo.fuelStatus==0?'未加油':'已加油'}}</label>
		</view>
		<view class="itemView" v-if="orderInfo.fuelStatus==1&&orderInfo.isGroupon==1&&orderInfo.orderStatus==1&&orderInfo.isGrouponCancel!=1?true:false">
			<text>加油时间</text>
			<label>{{orderInfo.fuelDt}}</label>
		</view>
		<view class="itemView" v-if="orderInfo.orderStatus==1&&orderInfo.isGrouponCancel!=1?true:false" style="min-height:60rpx;">
			<text>备注</text>
			<label>{{orderInfo.remark}}</label>
		</view>
		<view class="itemView" v-if="orderInfo.orderStatus > 3 && orderInfo.thirdOrderType == 0" style="min-height:60rpx;">
			<text>退款原因</text>
			<label>{{orderInfo.refundDesc}}</label>
		</view>
		<view class="itemView" v-if="orderInfo.orderStatus==7&&orderInfo.thirdOrderType == 0" style="min-height:60rpx;">
			<text>失败原因</text>
			<label>{{orderInfo.refundFailDesc}}</label>
		</view>

		<view class="itemView" v-if="orderInfo.isGrouponCancel==1?true:false">
			<text>取消原因：{{orderInfo.cancelReason}}</text>
			<label></label>
		</view>
	</view>
	<view class="contentView contentView1" v-if="orderInfo.isGroupon==1?true:false">
		<view class="itemView itemView1" v-if="orderInfo.isGroupon==1&&orderInfo.orderStatus==3?true:false">
			<view @tap="closeDD" v-if="orderInfo.grouponStatus==9||orderInfo.payType==9?false:true">
				<view>取消订单</view>
				<image class="select_img_rotate" mode="aspectFit" src="/static/images/jym/icon_right.png"></image>
			</view>
			<view @tap="getPay" v-if="orderInfo.grouponStatus==9||orderInfo.payType==9?false:true">
				<view>去支付</view>
				<image class="select_img_rotate" mode="aspectFit" src="/static/images/jym/icon_right.png"></image>
			</view>
			<view class hover-class="none" hover-stop-propagation="false" v-if="orderInfo.orderStatus==3&&orderInfo.twoUserId==undefined?true:false">
				<button open-type="share">
					<view>邀请拼团</view>
					<image class="select_img_rotate" mode="aspectFit" src="/static/images/jym/icon_right.png"></image>
				</button>
			</view>
		</view>
		<view class="itemView itemView1" v-if="orderInfo.isGroupon==1&&orderInfo.orderStatus==1&&orderInfo.isGrouponCancel!=1?true:false">
			<view class hover-class="none" hover-stop-propagation="false" v-if="orderInfo.orderStatus==1&&orderInfo.twoUserId==undefined?true:false">
				<button open-type="share">
					<view>邀请拼团</view>
					<image class="select_img_rotate" mode="aspectFit" src="/static/images/jym/icon_right.png"></image>
				</button>
			</view>
		</view>
		<view class="itemView itemView1" v-if="orderInfo.isGroupon==1&&orderInfo.orderStatus==2?true:false">
			<view @tap="closeDD" v-if="orderInfo.grouponStatus==9?false:true">
				<view>取消订单</view>
				<image class="select_img_rotate" mode="aspectFit" src="/static/images/jym/icon_right.png"></image>
			</view>
			<view @tap="getPay" v-if="orderInfo.grouponStatus==9?false:true">
				<view>重新支付</view>
				<image class="select_img_rotate" mode="aspectFit" src="/static/images/jym/icon_right.png"></image>
			</view>
			<view class hover-class="none" hover-stop-propagation="false" v-if="orderInfo.orderStatus==2&&orderInfo.twoUserId==undefined?true:false">
				<button open-type="share">
					<view>邀请拼团</view>
					<image class="select_img_rotate" mode="aspectFit" src="/static/images/jym/icon_right.png"></image>
				</button>
			</view>
		</view>
	</view>
	<view class="row return" v-if="(orderInfo.thirdOrderType == 0 || orderInfo.thirdOrderType == 1) && orderInfo.orderStatus ==1 && isShow" @tap="returnPrice">
			<view class="tips">注: 申请退款时间为一小时</view>
			<view class="itemView returnPrice" @tap="returnPrice">
				<text>申请退款</text>
			</view>
	</view>
	<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal"></view>
	<!-- 弹出层 -->
	<view class="modalDlg" v-if="showModal">
		<view class="modal_top modal_top1">
			提示
		</view>
		<view class="modal_top modal_con">确定要取消该订单</view>
		<view class="modal_btm">
			<view @tap.stop="cancel">取消</view>
			<button @tap.stop="confirm" :data-item="item">确认</button>
		</view>
	</view>
</view>

<view class="modal" v-if="hiddenModal">
	<view class="modal-cover"></view>
	<view class="modalContent">
		<view class="sub_title">确认要发起退款吗？</view>
		<view class="input-line">
			<textarea placeholder="请填写申请退款原因" maxlength="20" @input="input" type="text" :value="textvalue"></textarea>
		</view>
		<view class="refund-box">
			<view class="refund-cancel" @click="modalcancel">取消</view>
			<view class="refund-ok" @click="modalconfirm">确定</view>
		</view>
	</view>
</view>

<view class="bounced-box" v-if="show2">
	<view class="black-box" @tap="cancelTap"></view>
	<view class="bounced-content">
		<view class="content-box" style="padding: 10rpx;">
			<view class="contetn-reset">
				<img class="content-img2" src="http://czb-promotion.oss-cn-shanghai.aliyuncs.com/sqhyk.png?Expires=3183164456&OSSAccessKeyId=LTAI4cc06OCAMpOu&Signature=kdMngvrNnMZYxVfYBHiTBNXF1hc%3D&id=0.00008881962437311912"></img>
			</view>
			
			<view class="payment-box">
			  <view class="box1">
				<view>上汽卡号：</view>
				<view>{{cardNumber}}</view>
			  </view>
			  <view  class="box1">
				<view>余额支付：</view>
				<view>{{balancePayment}}元</view>
			  </view>
			</view>
		</view>
		<view class="ok-btn ok-btn2" @tap="cancelTap">关闭</view>
	</view>
</view>
</view>
</template>

<script module="Amount" lang="wxs" src="./Amount.wxs"></script>

<script>
// pages/order/orderDetail/orderDetail.js
var api = require("@/config/api.js");
var util = require("@/utils/jym-utils/util.js");
var timer2 = null;

export default {
  data() {
    return {
      orderInfo: '',
      statusImage: '',
      statusImage1: '',
      statusText: '',
      payType: '',
      patText: '',
      showModal: false,
      maxtime: "",
      countDownDay: 0,
      countDownHour: 0,
      countDownMinute: 0,
      countDownSecond: 0,
      newTime: "",
      hiddenModal: false,
      redEnvelopeDiscount: 0,
      cashDiscount: 0,
      textvalue: "",
	  show2:false,
	  cardNumber:'',
	  balancePayment:"",
    };
  },

  components: {},
  props: {},
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log('12345');
      console.log(this.orderInfo);
      var listData = {
        fuelType: this.orderInfo.fuelType,
        fuelDictId: this.orderInfo.fuelDictId,
        fuelGunId: this.orderInfo.fuelGunId,
        grouponNo: this.orderInfo.grouponNo,
        fuelName: encodeURIComponent(this.orderInfo.fuelName),
        stationId: this.orderInfo.stationId,
        opId: this.orderInfo.opId,
        fuelPrice: this.orderInfo.fuelPrice,
        fuelUnit: this.orderInfo.fuelUnit,
        fuelCouponPrice: this.orderInfo.fuelCouponPrice,
        fuelNum: this.orderInfo.fuelNum,
        fuelAmount: this.orderInfo.fuelAmount,
        fuelCouponNum: this.orderInfo.fuelCouponNum,
        couponAmount: this.orderInfo.couponAmount,
        oneOrderId: this.orderInfo.id,
        grouponUserType: 2,
        groupOnEndDt: this.orderInfo.groupOnEndDt
      };
      let a = JSON.stringify(listData);
      return {
        title: '您的好友邀请您参加拼团加油',
        path: 'pages/forward/group/group?data=' + JSON.stringify(listData),
        imageUrl: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_group.png",
        success: function (res) {
          console.log('跳转1');
          uni.showModal({
            title: '提示',
            content: '拼团邀请已发送，请到订单页面查看详情',
            showCancel: false,
            success: function () {
              console.log('跳转2');
              uni.switchTab({
                url: '../../oilstation/oilstationIndex/oilstationIndex'
              });
            }
          });
        }
      };
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
	console.log(options)
    let redEnvelopeDiscount = 0; //红包总计

    let cashDiscount = 0; //现金总计

    const temp = JSON.parse(options.map);
    console.log(temp, "temp");

    if (temp.userCouponsAmount) {
      temp.userCouponsAmount.forEach(item => {
        console.log(item.couponType);

        if (item.couponType == 112) {
          redEnvelopeDiscount += item.amount;
        } else if (item.couponType == 113) {
          cashDiscount += item.amount;
        }
      });
    }
	//付款成功的时间和成功后一小时的时间作比对   如果超过24小时就隐藏申请退款按钮
	if ((new Date().getTime() - (+new Date(temp.submitDt.replace(/-/g, '/')))) > 24 * 60 * 60 * 1000) {
		console.log("false");
		that.isShow = false;
	} else {
		console.log("true");
		that.isShow = true;
	}


    that.orderInfo = temp;
      that.payType = temp.payType;
      that.cashDiscount = cashDiscount;
      that.redEnvelopeDiscount = redEnvelopeDiscount;
    console.log(this.orderInfo);

    if (this.orderInfo.groupOnEndDt != undefined) {
      var totalSecond = Date.parse(new Date(this.orderInfo.groupOnEndDt.replace(/\-/g, "/"))) / 1000 - Date.parse(new Date()) / 1000;
      var interval = setInterval(function () {
        // 秒数
        var second = totalSecond; // 天数位

        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr; // 小时位

        var hr = Math.floor((second - day * 3600 * 24) / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr; // 分钟位

        var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr; // 秒位

        var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        this.countDownDay = dayStr;
          this.countDownHour = hrStr;
          this.countDownMinute = minStr;
          this.countDownSecond = secStr;
        let time = this.countDownHour + ':' + this.countDownMinute + ':' + this.countDownSecond; // var newTime = time.replace(/-/g, "/")

        this.newTime = time;
        totalSecond--;

        if (totalSecond < 0) {
          clearInterval(interval); // wx.showToast({
          // 	title: '拼团已结束',
          // });

          this.countDownDay = '00';
            this.countDownHour = '00';
            this.countDownMinute = '00';
            this.countDownSecond = '00';
        }
      }.bind(this), 1000);
    }
	console.log(this.orderInfo)

    if (temp.orderStatus == '1' && temp.isGroupon != "1") {
      that.statusImage = "/static/images/jym/icon_order_success.png";
        that.statusText = '支付成功';
    } else if (temp.orderStatus == '3') {
      that.statusImage = "/static/images/jym/icon_order_wait.png";
        that.statusText = '支付中';
    } else if (temp.orderStatus == 5) {
      that.statusImage = "/static/images/jym/icon_order_wait.png";
        that.statusText = '退款中';
    } else if (temp.orderStatus == 7) {
      that.statusImage = "/static/images/jym/icon_order_fail.png";
        that.statusText = '退款失败';
    } else if (temp.orderStatus == 6) {
      that.statusImage = "/static/images/jym/icon_order_success.png";
        that.statusText = '退款成功';
    } else {
      that.statusImage = "/static/images/jym/icon_order_fail.png";
        that.statusText = '支付失败';
    }

    if (temp.orderStatus == '1' && temp.twoUserId == undefined) {
      that.statusImage = "/static/images/jym/icon_order_success.png";
        that.statusImage1 = 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_groupIng.png';
        that.statusText = '支付成功';
    }

    if (temp.isGroupon == "1") {
      if (temp.orderStatus == '3') {
        if (temp.payType == '9') {
          that.statusImage = "/static/images/jym/icon_order_wait.png";
            that.statusImage1 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_group.png";
            that.statusText = '支付中';
        } else {
          that.statusImage = "/static/images/jym/icon_order_wait.png";
            that.statusImage1 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_groupIng.png";
            that.statusText = '待支付';
        }
      }
    }

    if (temp.grouponStatus == 9) {
      that.statusImage = "/static/images/jym/icon_order_close.png";
        that.statusImage1 = '';
        that.statusText = '已过期';
    }

    if (temp.grouponStatus == 0) {
      that.statusImage = "/static/images/jym/icon_order_close.png";
        that.statusText = '已取消';
    }

    if (temp.isGrouponCancel == 1) {
      that.statusImage = "/static/images/jym/icon_order_close.png";
        that.statusImage1 = '';
        that.statusText = '已取消';
    }

    if (temp.payType == '1') {
      that.patText = '油卡支付';
    } else if (temp.payType == '2') {
      that.patText = '联名卡-油卡混合支付';
    } else if (temp.payType == '3') {
      that.patText = '银行卡-油卡混合支付';
    } else if (temp.payType == '4') {
      that.patText = '微信支付';
    } else if (temp.payType == '9') {
      that.patText = '线下支付';
    }

    if (temp.twoUserId != undefined) {
      if (temp.orderStatus == '1' && temp.twoFuelOrderEntity.orderStatus != '1') {
        that.statusImage = "/static/images/jym/icon_order_success.png";
          that.statusImage1 = 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_groupIng.png';
          that.statusText = '支付成功';
      }
    }

    if (temp.twoUserId != undefined) {
      if (temp.orderStatus == '1' && temp.twoFuelOrderEntity.orderStatus == '1') {
        that.statusImage = "/static/images/jym/icon_order_success.png";
          that.statusImage1 = 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_group.png';
          that.statusText = '支付成功';
      }
    }
  },
  onReady: function () {},
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  methods: {
    confirm() {
      let that = this;
      let list = {
        grouponNo: this.orderInfo.grouponNo,
        oneOrderId: this.orderInfo.id,
        cancelGrouponType: 2,
        cancelPersonType: 2
      };
      util.postRequest(api.cancelGrouponOrder, list).then(function (res) {
        if (res.retCode == '0000000') {
          console.log(res);
          uni.showModal({
            title: '提示',
            content: "已取消订单",
            showCancel: false,
            success: function () {
              that.showModal = false;
              uni.navigateBack({
                delta: 1
              });
            }
          });
        } else {
          uni.showModal({
            title: '提示',
            content: "取消失败",
            showCancel: false
          });
        }
      });
    },

    cancel() {
      this.showModal = false;
    },

    closeDD() {
      this.showModal = true;
    },

    getPay() {
      var listData = {
        fuelType: this.orderInfo.fuelType,
        fuelDictId: this.orderInfo.fuelDictId,
        fuelGunId: this.orderInfo.fuelGunId,
        grouponNo: this.orderInfo.grouponNo,
        cardId: this.orderInfo.cardId,
        fuelName: this.orderInfo.fuelName,
        stationId: this.orderInfo.stationId,
        opId: this.orderInfo.opId,
        fuelPrice: this.orderInfo.fuelPrice,
        stationId: this.orderInfo.stationId,
        fuelUnit: this.orderInfo.fuelUnit,
        fuelCouponPrice: this.orderInfo.fuelCouponPrice,
        fuelNum: this.orderInfo.fuelNum,
        fuelAmount: this.orderInfo.fuelAmount,
        fuelCouponNum: this.orderInfo.fuelCouponNum,
        couponAmount: this.orderInfo.couponAmount,
        id: this.orderInfo.id
      };
      uni.navigateTo({
        url: '../../oilstation/addOilPage/payOil/payOil?map=' + JSON.stringify(listData) + "&group=" + 1
      });
    },

    returnPrice() {
      this.hiddenModal = true;
    },

    modalcancel() {
      this.hiddenModal = false;
        this.textvalue = '';
    },

    modalconfirm() {
      var orderInfo = this.orderInfo;
      var refundDesc = this.textvalue;

      if (!refundDesc) {
        uni.showToast({
          title: '请输入退款原因',
		  icon: 'none'
        });
        return;
      }

      this.hiddenModal = false;
      util.postRequest(api.returnPrice, {
        orderNo: orderInfo.orderNo,
        refundDesc: refundDesc
      }).then(res => {
        if (res.retCode == "0000000") {
          uni.showToast({
            title: '退款申请成功'
          });
          setTimeout(() => {
            uni.navigateBack({
              delta: 0
            });
          }, 1000);
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    input(e) {
      console.log(e);
      this.textvalue = e.detail.value;
    },
	
	cardTap(){
		let params = {
			orderNo:this.orderInfo.orderNo
		  }
		  util.postRequest(api.getSqUrl, params).then(res=>{
			console.log(res,"cardTap");
			if(!res.content) {
			  console.log('!res.content');
			  this.getInterval() 
			}else {
			  clearInterval(timer2)
			  if(res.content) {
				let arr = res.content
				let list = arr.split('=')
				let cardNumber =list[1].split('&')
				let balancePayment =list[2].split('&')
				  this.show2 = true,
				  this.cardNumber = cardNumber[0],
				  this.balancePayment = balancePayment[0]
			  }    
			}
		  })
		  .catch(err=>{
			clearInterval(timer2)
			console.log(err,'cardTap');
		  })
		},
	
	getInterval(){
		timer2 = setTimeout(() => {
		  this.cardTap(this.orderInfo.orderNo)
		}, 500)
	},

	cancelTap(){
		clearInterval(timer2)
		this.show2 = false;
	}

  }
};
</script>
<style>
@import "./orderDetail.css";
</style>