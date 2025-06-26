<template>
<view>
<view class="textContainer">可用优惠券({{listData1.length}})</view>
<view>
    <checkbox-group class="checkboxlabel" @change="checkboxChange">
        <!-- <view class="listItemView" bindtap="onTapItem3" data-type="1" data-index="{{index}}" -->
        <label v-for="(item, index) in listData1" :key="index" class="listItemView" :data-map="item" @tap="onTapItem3" data-type="1" :data-index="index" :data-userCouponId="item.userCouponId" :style="'background:url(' + (item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2) + ');background-size: 100% 196rpx;'">
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
                            <!-- {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}} -->
                            {{item.fuelTypeName ? item.fuelTypeName  : item.fuelNoName}}
                        </view>
                    </view>
                    <view class="amountView">
						<view class="stand-type" :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">全站通用券</view>
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
					<text class="couponDetails" v-if="item.couponTypeName != '现金'">{{item.couponDetails}}</text>
					<text class="couponDetails" v-else>可与其他券组合使用</text>
                </view>
                <view class="listItemViewLine1Right2">
                    <label>
                        <view>
                            <!-- <radio value="{{index}}" checked="{{item.userCouponId==userCouponId}}" /> -->
                            <checkbox :value="item.userCouponId" :checked="item.isChecked"></checkbox>
                        </view>
                    </label>
                </view>
            </view>
        </label>
    </checkbox-group>
</view>
<view class="textContainer">不可用优惠券({{listData2.length}})</view>
<view v-for="(item, index) in listData2" :key="index" :data-map="item">
    <view class="listItemView" @tap="3" data-type="0" :data-index="index" :style="'background:url( ' + (item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2) + ');background-size: 100% 196rpx;'">
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
                    <view class="listItemViewLine1Right_Name">{{item.compSecondName}}</view>
                    <view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                        <!-- {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}} -->
                        {{item.fuelTypeName ? item.fuelTypeName  : item.fuelNoName}}
                    </view>
                </view>
                <view class="amountView">
					<view class="stand-type">全站通用券</view>
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
                <text class="couponDetails" v-if="item.couponTypeName != '现金'">{{item.couponDetails}}</text>
                <text class="couponDetails" v-else>可与其他券组合使用</text>
            </view>
        </view>
    </view>
</view>

<view @tap="determine" class="bottomSave">确 定</view>
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
      couponColor2: '#6ac5d0',
      checkValue: [],
      maps: {},
      namestr: 0,
      sign: 0,
      isCheck: "",
      cashCouponDetails: "",
      cashCouponDetails2: "",
      cashCouponId: "",
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
    this.userCouponId = options.cashCouponId;
      this.maps = options;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];

    if (options.cashCouponDetails == "请选择") {
      prevPage.$vm.cashCouponDetails = '';
    } else {
      prevPage.$vm.cashCouponDetails = options.cashCouponDetails;
    }

    console.log(options);
    this.requestCouponList(options.fuelType, options.fuelAmount, options.comId, options.cardType, options.fuelNo);
  },
  methods: {
    onTapItem3(e) {
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
      console.log(listData1);
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];

      if (listData1[index].userCouponId == this.userCouponId) {
        console.log(listData1[index].userCouponId);
        prevPage.$vm.sign = 2;
          prevPage.$vm.userCouponId = this.checkValue.toString();
          prevPage.$vm.checkValue = this.checkValue;
          prevPage.$vm.isCheck = listData1[index].checked;
      } else {
        console.log(listData1[index]);
        let list = listData1;
        let arr = this.checkValue;
        let namestr = 0; //计算券总额

        list.forEach(item => {
          item.couponItemVOList.forEach(val => {
            arr.forEach(item2 => {
              if (item.userCouponId == item2) {
                namestr += parseFloat(val.amount);
              }
            });
          });
        });
        console.log(listData1[index], "checked");
          // prevPage.cashCouponDetails: listData1[index].couponItemVOList[0].amount + '元',
          // prevPage.cashCouponId: listData1[index].userCouponId,
          prevPage.$vm.cashCouponDetails = namestr.toFixed(2) + '元';
          prevPage.$vm.cashCouponDetails2 = namestr.toFixed(2);
          prevPage.$vm.cashCouponId = this.checkValue.toString();
          prevPage.$vm.sign = 0;
          prevPage.$vm.checkValue = this.checkValue;
          prevPage.$vm.fuelNo = listData1[index].fuelNo ? listData1[index].fuelNo : 0;
		  // prevPage.isCheck = listData1[index].checked;
        this.namestr = namestr;
      }
    },

    onTapItem2(e) {
      const index = e.currentTarget.dataset.index;
      uni.showToast({
        title: '暂不可用',
        icon: 'none'
      });
    },

    checkboxChange(e) {
      console.log(e);
      this.checkValue = e.detail.value;
    },

    determine() {
      let maps = this.maps;
      let checkValue = this.checkValue;
      console.log(checkValue, "checkValue");
      let fuelAmount = maps.fuelAmount; //加油总额

      let couponAmount = maps.couponAmount; //优惠券优惠总额

      let namestr = this.namestr; //现金券总额
      // console.log(Number(couponAmount) + Number(namestr), Number(fuelAmount));

      if (couponAmount && (Number(couponAmount) + Number(namestr)) >= Number(fuelAmount)) {
        console.log("有优惠券");
        uni.showToast({
          title: "优惠总额不能大于加油金额",
          icon: 'none'
        });
      } else if (Number(namestr) >= Number(fuelAmount)) {
        console.log("有现金券");
        uni.showToast({
          title: "优惠总额不能大于加油金额",
          icon: 'none'
        });
      } else {
        console.log("无现金券");
        uni.navigateBack({
          delta: 1
        });
      }
    },

    //查询券列表数据
    requestCouponList(fuelType, fuelAmount, comId, cardType, fuelNo) {
      const that = this;
      const param = {
        "fuelType": fuelType,
        "fuelAmount": fuelAmount,
        "cardType": cardType,
        "fuelNo": fuelNo
      };
      param.stationId = comId;
      console.log(param);
      util.postRequest(api.findUseCoupon, param).then(function (res) {
        console.log(res);

        if (res.retCode == '0000000') {
          let userCouponId = that.userCouponId.split(",");
          let cashYesCouponList = res.rspBody.cashYesCouponList; //实现多选 如果userCouponId有值的话 就让cashYesCouponList数据里面增加一个isChecked

          if (that.userCouponId) {
            cashYesCouponList.forEach(item => {
              userCouponId.forEach(val => {
                if (item.userCouponId == val) {
                  item.isChecked = true;
                }
              });
            });
          }

          that.listData1 = cashYesCouponList;
            that.listData2 = res.rspBody.cashNoCouponList;
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
@import "./cashCoupon.css";
</style>