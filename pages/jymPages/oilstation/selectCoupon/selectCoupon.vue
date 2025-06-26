<template>
<view>
<view class="textContainer">可用优惠券({{listData1.length}})</view>
<view v-for="(item, index) in listData1"  :data-map="item">
    <radio-group class="checkboxlabel">
        <view class="listItemView" @click="onTapItem1" data-type="1" :data-id="item.id" :data-index="index" :data-userCouponId="item.userCouponId" :style="'background:url(' + (item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2) + ');background-size: 100% 196rpx;'">
            <view class="listItemViewLine1">
                <view class="listItemViewLine1Left">
                    <view v-if="item.couponType==110" class="flex row-center align-center carNoView2 cor child-num">
                        <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                            <text class="sell">￥</text>
                            {{item.couponItemVOList[0].reduceAmount}}
                            <text class="unit" selectable="false" space="false" decode="false">
                                /L</text>
                        </label>
                        <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                            <text class="sell">￥</text>
                            {{item.couponMaxAmount}}
                            <text class="unit" selectable="false" space="false" decode="false">
                                /L</text>
                        </label>
                        <label style="font-size:22rpx;font-weight:bold">{{item.couponTypeName}}券</label>
                    </view>
                    <view v-else-if="item.couponType==111" class="flex row-center align-center carNoView2 cor child-num">
                        <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                            <text class="sell">￥</text>
                            {{item.couponItemVOList[0].reduceAmount}}
                        </label>
                        <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                            <text class="sell">￥</text>
                            {{item.couponMaxAmount}}
                        </label>
                        <label style="font-size:22rpx;font-weight:bold">{{item.couponTypeName}}券</label>
                    </view>
					
					<view v-else-if="item.couponType==114" class="flex row-center align-center carNoView2 cor child-num">
						<label v-if="item.couponItemVOList.length==1"
							style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
							<!-- <text class="sell">￥</text> -->
							{{item.couponItemVOList[0].discount}}
						</label>
						<label style="font-size:22rpx;font-weight:bold">
							{{item.couponTypeName}}券
						</label>
					</view>

                    <view v-else class="flex row-center align-center carNoView2 cor child-num">
                        <label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                            <text class="sell">￥</text>
                            {{item.couponItemVOList[0].amount}}
                        </label>
                        <label style="font-size:22rpx;font-weight:bold">{{item.couponTypeName}}券</label>
                    </view>
                </view>
                <view class="listItemViewLine1Right">
                    <view class="listItemViewLine1Right_Head">
                        <view class="listItemViewLine1Right_Name">
							<!-- {{item.compSecondName}} -->
							{{item.couponName}}
						</view>
                        <view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                            {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}}
                        </view>
                    </view>
                    <view class="amountView">
						<view class="stand-type" :style="'color:' + (item.fuelType==1?'#F7A129':'#6AC5D0')" v-if="item.scope">{{item.scope}}</view>
                        <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-if="item.vaildStartDate">
                            {{item.vaildStartDate}}~{{item.vaildEndDate||'长期'}}
                        </view>
                        <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else-if="item.vaildEndDate">
                            至{{item.vaildEndDate||'长期'}}
                        </view>
                        <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else>
                            长期有效
                        </view>
                    </view>
                    <text class="couponDetails">{{item.couponDetails}}</text>

                    <view v-if="item.couponTypeName == '红包'  || item.couponTypeName == '折扣'" class="rules-use" @click.stop="showDialogBtn" :data-id="item.id">使用规则 >
                    </view>
                </view>
                <view class="listItemViewLine1Right2">
                    <label>
                        <view>
                            <radio :value="index" :checked="item.userCouponId==userCouponId"></radio>
                        </view>
                    </label>
                </view>
            </view>
        </view>
    </radio-group>
</view>



<view class="textContainer">不可用优惠券({{listData2.length}})</view>
<view v-for="(item, index) in listData2" :key="index" :data-map="item">
    <view class="listItemView" @click="onTapItem1" data-type="0" :data-id="item.id" :data-index="index" :style="'background:url(' + (item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2) + '); background-size: 100% 196rpx;'">
        <view class="listItemViewLine1">
            <view class="listItemViewLine1Left">
                <view v-if="item.couponType==110" class="flex row-center align-center carNoView2 cor child-num">
                    <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                        <text class="sell">￥</text>
                        {{item.couponItemVOList[0].reduceAmount}}
                        <text class="unit" selectable="false" space="false" decode="false">
                            /L</text>
                    </label>
                    <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                        <text class="sell">￥</text>
                        {{item.couponMaxAmount}}
                        <text class="unit" selectable="false" space="false" decode="false">
                            /L</text>
                    </label>
                    <label style="font-size:22rpx;font-weight:bold">{{item.couponTypeName}}券</label>
                </view>
                <view v-else-if="item.couponType==111" class="flex row-center align-center carNoView2 cor child-num">
                    <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                        <text class="sell">￥</text>
                        {{item.couponItemVOList[0].reduceAmount}}
                    </label>
                    <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                        <text class="sell">￥</text>
                        {{item.couponMaxAmount}}
                    </label>
                    <label style="font-size:22rpx;font-weight:bold">{{item.couponTypeName}}券</label>
                </view>
				
				<view v-else-if="item.couponType==114" class="flex row-center align-center carNoView2 cor child-num">
					<label v-if="item.couponItemVOList.length==1"
						style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
						<!-- <text class="sell">￥</text> -->
						{{item.couponItemVOList[0].discount}}
					</label>
					<label style="font-size:22rpx;font-weight:bold">
						{{item.couponTypeName}}券
					</label>
				</view>
								
                <view v-else class="flex row-center align-center carNoView2 cor child-num">
                    <label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                        <text class="sell">￥</text>
                        {{item.couponItemVOList[0].amount}}
                    </label>
                    <label style="font-size:22rpx;font-weight:bold">{{item.couponTypeName}}券</label>
                </view>
            </view>
            <view class="listItemViewLine1Right">
                <view class="listItemViewLine1Right_Head">
                    <view class="listItemViewLine1Right_Name">
						<!-- {{item.compSecondName}} -->
						{{item.couponName}}
					</view>
                    <view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                        {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}}
                    </view>
                </view>
                <view class="amountView">
					<view class="stand-type" :style="'color:' + (item.fuelType==1?'#F7A129':'#6AC5D0')" v-if="item.scope">{{item.scope}}</view>
                    <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-if="item.vaildStartDate">
                        {{item.vaildStartDate}}~{{item.vaildEndDate||'长期'}}
                    </view>
                    <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else-if="item.vaildEndDate">
                        至{{item.vaildEndDate||'长期'}}
                    </view>
                    <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else>
                        长期有效
                    </view>
                </view>
                <text class="couponDetails">{{item.couponDetails}}</text>
                   <view v-if="item.couponTypeName == '红包' || item.couponTypeName == '折扣'" class="rules-use"
                    @click.stop="showDialogBtn" :data-id="item.id">使用规则 >
					</view>

            </view>
        </view>
    </view>
</view>

<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal"></view>
<!-- 弹出层 -->
<view class="modalDlg" v-if="showModal">
    <view class="modal_top1">
        使用规则
    </view>

    <scroll-view scroll-y="true" style="height: 330px;overflow: hidden;">
        <!-- <view class="modal_top modal_con">{{rule}}</view> -->
		<view class="modal_top modal_con">
			<view class="modal-text">使用条件：</view>
			<view class="modal-text-right">{{ruleObj.rule1}}</view>
		</view>
		<view class="modal_top modal_con">
			<view class="modal-text">加油类型：</view>
			<view class="modal-text-right">{{ruleObj.fuelTypeName}}</view>
		</view>
		<view class="modal_top modal_con">
			<view class="modal-text">使用范围：</view>
			<view class="modal-text-right" v-if="!ruleObj.useStationList && !ruleObj.excludeStationList">全站通用券</view>
			<text class="modal-text-scope" v-else>
				<text v-for="item in ruleObj.useStationList">{{item.compSecondName}}{{index!=ruleObj.useStationList.length-1?',':''}}</text>
				<text v-if="ruleObj.excludeStationList">除</text>
				<text style="color: red;" v-for="item in ruleObj.excludeStationList">{{item.compSecondName}}{{index!=ruleObj.excludeStationList.length-1?',':''}}</text>
				<text v-if="ruleObj.excludeStationList">全站通用</text>
			</text>
		</view>
		<view class="modal_top modal_con">
			<view class="modal-text">时间范围：</view>
			<view class="modal-text-right" v-if="ruleObj.vaildStartDate && ruleObj.vaildEndDate">
				{{ruleObj.vaildStartDate + '~' + ruleObj.vaildEndDate}}</view>
			<view class="modal-text-right" v-else-if="ruleObj.vaildEndDate && !ruleObj.vaildEndDate">
				{{ruleObj.vaildStartDate + '~长期'}}</view>
			<view class="modal-text-right" v-if="!ruleObj.vaildStartDate && !ruleObj.vaildEndDate">长期有效</view>
		</view>
		<view class="modal_top modal_con">
			<view class="modal-text">注意事项：</view>
			<view class="modal-text-right" style="padding-bottom: 30rpx;">每笔订单限用一张优惠券；成功下单后优惠券即作废，申请退款后无法退券；</view>
		</view>
    </scroll-view>

    <view class="modal_btm">
        <!-- <view catchtap="cancel">取消</view> -->
        <!-- <button catchtap="confirm" open-type="share" data-item="{{item}}">确认</button> -->
        <view class="btnLeftContainer" @tap.stop="cancel">
            <text>我知道了</text>
        </view>
    </view>
</view>
</view>
</template>

<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>

<script>
var api = require("@/config/api.js");
var util = require("@/utils/jym-utils/util.js");

export default {
  data() {
    return {
      listData1: [],
      listData2: [],
      userCouponId: '',
      couponImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/coupon_cy.png",
      couponImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/coupon_qy.png",
      couponImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/coupon_yg.png",
      couponNav: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/coupon_nav_yellow.png",
      couponNav1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/coupon_nav_blue.png",
      couponNav2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/coupon_nav_green.png",
      couponColor: '#F7A129',
      couponColor1: '#6D9AED',
      couponColor2: '#ABDFE5',
      rule: '',
	  ruleObj: {},
      showModal: false,
      sign: 0,
      couponId: "",
      couponDetails: "",
      couponNo: "",
      fuelNo: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "options");
    this.userCouponId = options.userCouponId;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];

    if (options.couponDetails == "请选择") {
      prevPage.$vm.couponDetails = '';
    } else {
      prevPage.$vm.couponDetails = options.couponDetails;
    }

    console.log(options);
    this.requestCouponList(options.fuelType, options.fuelAmount, options.comId, options.cardType, options.fuelNo);
  },
  methods: {
    onTapItem1(e) {
      console.log(e);
      const withType = e.currentTarget.dataset.type;

      if (withType == 0) {
        uni.showToast({
          title: '不可用',
          icon: 'none'
        });
        return;
      }

      const index = e.currentTarget.dataset.index;
      const listData1 = this.listData1;
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
	  console.log(prevPage)
      if (listData1[index].userCouponId == this.userCouponId) {
        console.log(listData1[index]);
          // prevPage.couponDetails = '';
          prevPage.$vm.sign = 1;
          // prevPage.userCouponId = listData1[index].userCouponId;
          prevPage.$vm.userCouponId = '';
          prevPage.$vm.couponId = '';
      } else {
        // console.log(listData1[index]);
        // console.log(listData1[index].userCouponId);
          prevPage.$vm.couponDetails = listData1[index].couponDetails ? listData1[index].couponDetails : listData1[index].couponItemVOList[0].discount + '折';
		  console.log(listData1[index])
          prevPage.$vm.couponNo = listData1[index].couponNo;
          prevPage.$vm.couponId = listData1[index].userCouponId;
          prevPage.$vm.sign = 0;
          prevPage.$vm.fuelNo = listData1[index].fuelNo ? listData1[index].fuelNo : 0;
      }

      uni.navigateBack({
        delta: 1
      });
    },

    onTapItem2(e) {
      const index = e.currentTarget.dataset.index;
      uni.showToast({
        title: '暂不可用',
        icon: 'none'
      });
    },

    showDialogBtn: function (e) {
      console.log(e);
      let params = {
        id: e.currentTarget.dataset.id
      };
      util.postRequest(api.getCouponInfor, params).then(res => {
        if (res.retCode == '0000000') {
          this.rule = res.rspBody.rule;
		  this.ruleObj = res.rspBody;
            this.showModal = true;
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    cancel() {
      this.showModal = false;
    },

    requestCouponList(fuelType, fuelAmount, comId, cardType, fuelNo) {
      const that = this;
      const param = {
        "fuelType": fuelType,
        "fuelAmount": fuelAmount,
        "cardType": cardType,
        "fuelNo": fuelNo
      }; // if(cardType!=3){

      param.stationId = comId; // }

      util.postRequest(api.findUseCoupon, param).then(function (res) {
        console.log(res);

        if (res.retCode == '0000000') {
          that.listData1 = res.rspBody.yesCouponList;
            that.listData2 = res.rspBody.noCouponList;
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    }

  }
};
</script>
<style>
@import "./selectCoupon.css";
</style>