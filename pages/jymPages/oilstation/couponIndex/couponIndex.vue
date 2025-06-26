<template>
<view class="container">
    <view class="topView">
        <view class="itemView" @tap.stop="selectTap" data-flag="1">
            <text :style="'color:' + item1SelectedColor">{{item1SelectText}}</text>
            <image :class="'select_img ' + show1&&'select_img_rotate'" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png"></image>
        </view>
    </view>
    <view class="select_box" @tap="clickDisappear" :style="'height:' + (show1 || show2?100:0) + 'vh;'">
        <view class="option_box" :style="'height:' + (show1?160:0) + 'rpx;'">
            <view :style="'color:' + (item1Status==1?item1SelectedColor:item1Color)" @tap.stop="clickItem" data-flag="1">
                距离最近
            </view>
            <view :style="'color:' + (item1Status==2?item1SelectedColor:item1Color)" @tap.stop="clickItem" data-flag="2">
                会员油站靠前
            </view>
        </view>
    </view>
    <scroll v-if="item1Status==1" class="scrollView" :requesting="requesting" :empty-show="emptyShow" end="false" :refresh-size="80" :top-size="80" @refresh="refresh">
        <view v-for="(item, index) in listData" :key="index" :data-map="item">
            <view class="listItemView" style="background:url({item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2});    background-size: 100% 196rpx;">
                <view class="listItemViewLine1">
                    <view class="listItemViewLine1Left">
                        <view v-if="item.couponType==110" style="flex-direction: column;height: 100%;" class="flex row-center align-center carNoView2 cor">
                            <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponItemVOList[0].reduceAmount}}
                                <text class="unit" selectable="false" space="false" decode="false">
                                    /L
                                </text>
                            </label>
                            <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponMaxAmount}}
                                <text class="unit" selectable="false" space="false" decode="false">
                                    /L
                                </text>
                            </label>
                            <label style="font-size:22rpx;font-weight:bold">
                                {{item.couponTypeName}}券
                            </label>
                        </view>
                         <view v-else-if="item.couponType==111" style="flex-direction: column;height: 100%;" class="flex row-center align-center carNoView2 cor">
                            <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponItemVOList[0].reduceAmount}}
                            </label>
                            <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponMaxAmount}}
                            </label>
                            <label style="font-size:22rpx;font-weight:bold">
                                {{item.couponTypeName}}券
                            </label>
                        </view>
                        <view v-else style="flex-direction: column;height: 100%;" class="flex row-center align-center carNoView2 cor">
                            <label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponItemVOList[0].amount}}
                            </label>
                            <label style="font-size:22rpx;font-weight:bold">
                                {{item.couponTypeName}}券
                            </label>
                        </view>
                    </view>
                    <view class="listItemViewLine1Right">
                        <view class="listItemViewLine1Right_Head">
                            <view class="listItemViewLine1Right_Name">
                                {{item.stationInfo.compSecondName}}
                            </view>
                            <view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                                {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}}
                            </view>
                            <view class="oilInfoLine2Right" @tap.stop="onTapNav" hover-stop-propagation="true" :data-map="item">
                                <image :src="item.fuelType==1?couponNav:item.fuelType==2?couponNav1:couponNav2"></image>
                                <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                                    {{filter.retainNumber(item.stationInfo.distance)}}km
                                </view>
                            </view>
                        </view>
                        <view class="amountView">
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
                        <view class="listItemViewRight" :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" @tap="onTapItem" :data-id="index">
                            立即领券
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </scroll>
    <scroll v-if="item1Status==2" class="scrollView" :requesting="requesting" empty-show="false" end="false" :refresh-size="80" :top-size="80" @refresh="refresh">
        <view class="textContainer">会员油站优惠券</view>
        <view v-for="(item, index) in membership" :key="index" :data-map="item">
            <view class="listItemView" style="background:url({item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2});    background-size: 100% 196rpx;">
                <view class="listItemViewLine1">
                    <view class="listItemViewLine1Left">
                        <view v-if="item.couponType!==112" style="flex-direction: column;height: 100%;" class="flex row-center align-center carNoView2 cor">
                            <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponItemVOList[0].reduceAmount}}
                            </label>
                            <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponMaxAmount}}
                            </label>
                            <label style="font-size:22rpx;font-weight:bold">
                                {{item.couponTypeName}}券
                            </label>
                        </view>
                        <view v-else style="flex-direction: column;height: 100%;" class="flex row-center align-center carNoView2 cor">
                            <label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponItemVOList[0].amount}}
                            </label>
                            <label style="font-size:22rpx;font-weight:bold">
                                {{item.couponTypeName}}券
                            </label>
                        </view>
                    </view>
                    <view class="listItemViewLine1Right">
                        <view class="listItemViewLine1Right_Head">
                            <view class="listItemViewLine1Right_Name">
                                {{item.stationInfo.compSecondName}}
                            </view>
                            <view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                                {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}}
                            </view>
                            <view class="oilInfoLine2Right" @tap.stop="onTapNav" hover-stop-propagation="true" :data-map="item">
                                <image :src="item.fuelType==1?couponNav:item.fuelType==2?couponNav1:couponNav2"></image>
                                <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                                    {{filter.retainNumber(item.stationInfo.distance)}}km
                                </view>
                            </view>
                        </view>
                        <view class="amountView">
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
                        <view class="listItemViewRight" :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" @tap="onTapItem" :data-id="index">
                            立即领券
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="textContainer">非会员油站优惠券</view>
        <view v-for="(item, index) in notMembership" :key="index" :data-map="item">
            <view class="listItemView" style="background:url({item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2});    background-size: 100% 196rpx;">
                <view class="listItemViewLine1">
                    <view class="listItemViewLine1Left">
                        <view v-if="item.couponType!==112" style="flex-direction: column;height: 100%;" class="flex row-center align-center carNoView2 cor">
                            <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponItemVOList[0].reduceAmount}}
                            </label>
                            <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponMaxAmount}}
                            </label>
                            <label style="font-size:22rpx;font-weight:bold">
                                {{item.couponTypeName}}券
                            </label>
                        </view>
                        <view v-else style="flex-direction: column;height: 100%;" class="flex row-center align-center carNoView2 cor">
                            <label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                                <text class="sell">￥</text>
                                {{item.couponItemVOList[0].amount}}
                            </label>
                            <label style="font-size:22rpx;font-weight:bold">
                                {{item.couponTypeName}}券
                            </label>
                        </view>
                    </view>
                    <view class="listItemViewLine1Right">
                        <view class="listItemViewLine1Right_Head">
                            <view class="listItemViewLine1Right_Name">
                                {{item.stationInfo.compSecondName}}
                            </view>
                            <view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                                {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}}
                            </view>
                            <view class="oilInfoLine2Right" @tap.stop="onTapNav" hover-stop-propagation="true" :data-map="item">
                                <image :src="item.fuelType==1?couponNav:item.fuelType==2?couponNav1:couponNav2"></image>
                                <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                                    {{filter.retainNumber(item.stationInfo.distance)}}km
                                </view>
                            </view>
                        </view>
                        <view class="amountView">
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
                        <view class="listItemViewRight" :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" @tap="onTapItem" :data-id="index">
                            立即领券
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </scroll>
</view>
</template>

<script module="filter" lang="wxs" src="../../../utils/normal.wxs"></script>

<script>
var api = require("../../../config/api.js");
var util = require("../../../utils/util.js");
import scroll from "../../../components/scroll/index";

export default {
  data() {
    return {
      listData: [],
      membership: [],
      notMembership: [],
      item1Arr: ["距离最近", "会员油站靠前"],
      item1Color: "#666666",
      item1SelectedColor: "#469DFC",
      item1Status: 1,
      item1SelectText: "距离最近",
      userId: '',
      requesting: false,
      emptyShow: false,
      couponImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/coupon_cy.png",
      couponImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/coupon_qy.png",
      couponImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/coupon_yg.png",
      couponNav: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/coupon_nav_yellow.png",
      couponNav1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/coupon_nav_blue.png",
      couponNav2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/coupon_nav_green.png",
      couponColor: '#F7A129',
      couponColor1: '#6D9AED',
      couponColor2: '#ABDFE5',
      show1: "",
      item2SelectedColor: ""
    };
  },

  components: {
    scroll
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    uni.getLocation({
      success: function (res) {
        console.log(res);
        that.requestList(res.latitude, res.longitude);
      }
    });
    uni.getStorage({
      key: 'driverInfo',
      success: function (res) {
        that.setData({
          userId: res.data.userId
        });
      }
    });
  },
  methods: {
    // 点击下拉显示框
    selectTap: function (e) {
      this.setData({
        show1: !this.show1,
        item1SelectedColor: "#469DFC",
        item2SelectedColor: "#666666"
      });
    },

    clickItem(e) {
      const item1Arr = this.item1Arr;
      const item1Status = this.item1Status;
      const flag = e.currentTarget.dataset.flag;

      if (flag != item1Status) {
        this.setData({
          item1Status: flag,
          item1SelectText: flag == 1 ? item1Arr[0] : item1Arr[1]
        });
        this.refresh();
      }

      this.setData({
        show1: false
      });
    },

    onTapItem: function (e) {
      // console.log( e.currentTarget.dataset)
      if (uni.getStorageSync('token') == "") {
        uni.showModal({
          title: "当前为未登录状态，请登录后操作,跳转登录页",
          // content:"跳转登录页？",
          icon: 'none',

          success(res) {
            if (res.confirm) {
              uni.reLaunch({
                url: '/pages/login/login/loginSelect/loginSelect'
              });
            }
          }

        });
        return;
      }

      const index = e.currentTarget.dataset.id;
      console.log(index);
      this.requestGet(index);
    },
    onTapObtain: function (e) {
      const index = e.currentTarget.dataset.id;
      console.log(index);
    },

    refresh() {
      const that = this;
      uni.getLocation({
        success: function (res) {
          that.requestList(res.latitude, res.longitude);
        }
      });
    },

    requestList(longitude, latitude) {
      uni.showLoading({
        title: '请稍候...'
      });
      const that = this;
      const parma = {
        stationInfo: {
          "longitude": latitude,
          "latitude": longitude
        },
        sortType: that.item1Status,
        size: 100,
        num: 1,
        userId: that.userId
      };
      that.setData({
        requesting: true,
        emptyShow: false
      });
      util.postRequest(api.getCouponList, parma).then(function (res) {
        console.log(res);
        uni.hideLoading();
        that.setData({
          requesting: false
        });

        if (res.retCode == '0000000') {
          const list = res.rspBody.allCoupon;
          const notMembership = res.rspBody.notMembership;
          const membership = res.rspBody.membership;
          const sortType = res.rspBody.sortType;

          if (sortType == 1) {
            if (list.length == 0) {
              that.setData({
                emptyShow: true,
                listData: []
              });
            } else {
              that.setData({
                emptyShow: false,
                listData: list
              });
            }
          } else {
            that.setData({
              membership: membership,
              notMembership: notMembership
            });
          }
        } else {
          uni.showModal({
            title: '提示',
            content: res.retDesc,
            showCancel: false
          });
        }
      });
    },

    requestGet(index) {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
      const list = that.listData;
      console.log(list);
      const param = {
        "fuelType": list[index].fuelType,
        "id": list[index].id,
        "comId": list[index].stationInfo.id
      };
      util.postRequest(api.getCoupon, param).then(function (res) {
        console.log(res);
        uni.hideLoading();

        if (res.retCode == '0000000') {
          uni.showToast({
            title: '领取成功',
            icon: 'none'
          }); //that.requestList()
        } else {
          uni.showModal({
            title: '提示',
            content: res.retDesc,
            showCancel: false
          });
        }
      });
    }

  }
};
</script>
<style>
@import "./couponIndex.css";
</style>