<template>
<view class="jym-container">
  <view class="statusContent"><image class="statusImage" :src="statusImage"></image></view>
  <view class="contentView">
    <view class="statusView">
      <text>{{statusText}}</text>
      <label>{{orderInfo.createdDt}}</label>
    </view>
    <view class="itemView" style="margin-top:20rpx;">
	  <text v-if="orderInfo.rechargeType == 11">回收操作员</text>
      <text v-else>充值操作员</text>
      <label>{{orderInfo.opName}}</label>
    </view>
    <view class="itemView">
		<text v-if="orderInfo.rechargeType == 11">回收前金额</text>
      <text v-else>充值前金额</text>
      <label>{{orderInfo.beforeBalance}}元</label>
    </view>
    <view class="itemView">
		<text v-if="orderInfo.rechargeType == 11">回收后金额</text>
      <text v-else>充值后金额</text>
      <label>{{orderInfo.balance}}元</label>
    </view>
    <view class="itemView">
		<text v-if="orderInfo.rechargeType == 11">回收时间</text>
      <text v-else>充值时间</text>
      <label>{{orderInfo.createdDt}}</label>
    </view>
    <view class="itemView">
	<text v-if="orderInfo.rechargeType == 11">回收类型</text>
      <text v-else>充值类型</text>
      <label>{{orderInfo.rechargeType == '1'?'车队充值':orderInfo.rechargeType == '2'?'车队奖励' :orderInfo.rechargeType == '11' ? '车队回收' :'自助充值'}}</label>
    </view>
    <view class="lineView"></view>
    <view class="itemView">
		<text v-if="orderInfo.rechargeType == 11">回收金额</text>
      <text v-else>充值金额</text>
      <label>{{orderInfo.amount}}元</label>
    </view>
    <view class="itemView" v-if="orderInfo.rechargeType == 11">
      <text>回收状态</text>
      <label :style="'color:' + (orderInfo.status == '1'?'green':(orderInfo.status == '2'?'red':'orange')) + ';'">{{orderInfo.status == '1'?'回收成功':(orderInfo.status == '2'?'回收失败':'回收中')}}</label>
    </view>
	
	<view class="itemView" v-else>
	  <text>充值状态</text>
	  <label :style="'color:' + (orderInfo.status == '1'?'green':(orderInfo.status == '2'?'red':'orange')) + ';'">{{orderInfo.status == '1'?'充值成功':(orderInfo.status == '2'?'充值失败':'充值中')}}</label>
	</view>
  </view>

</view>
</template>

<script>

export default {
  data() {
    return {
      orderInfo: '',
      statusImage: '',
      statusText: '',
      payType: '',
      patText: ''
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.orderInfo = JSON.parse(options.map);
	if(JSON.parse(options.map).rechargeType && JSON.parse(options.map).rechargeType == 11) {
		if (JSON.parse(options.map).status == '1') {
		  that.statusImage = "/static/images/jym/icon_order_success.png";
			that.statusText = '回收成功';
		} else if (JSON.parse(options.map).status == '3') {
		  that.statusImage = "/static/images/jym/icon_order_wait.png";
			that.statusText = '回收中';
		} else {
		  that.statusImage = "/static/images/jym/icon_order_fail.png";
			that.statusText = '回收失败';
		}
	}else {
		if (JSON.parse(options.map).status == '1') {
		  that.statusImage = "/static/images/jym/icon_order_success.png";
		    that.statusText = '充值成功';
		} else if (JSON.parse(options.map).status == '3') {
		  that.statusImage = "/static/images/jym/icon_order_wait.png";
		    that.statusText = '充值中';
		} else {
		  that.statusImage = "/static/images/jym/icon_order_fail.png";
		    that.statusText = '充值失败';
		}
	}
    
  },
  methods: {}
};
</script>
<style scoped>
@import "./rechargeDetail.css";
</style>