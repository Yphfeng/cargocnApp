<template>
<view>
<view class="topView">
  <image src="/static/images/icon_oilstation_press.png"></image>
  <text>{{stationName}}</text>
</view>
<view class="cardView" @tap="selectOilCard">
  <text v-if="showCard.cardNo!=''">{{showCard.cardNo}}</text>
  <text v-if="showCard.cardNo==''">请选择</text>
  <view class="cardViewRight">
    <text v-if="showCard.cardNo!=''">{{filter.checkCardFlagName(showCard.cardFlag)}}</text>
    <text v-if="showCard.cardNo==''">请选择</text>
    <image src="/static/images/icon_right.png"></image>
  </view>
</view>
<view class="divLine"></view>
<view class="balanceView">
  <text>当前余额：</text>
  <text style="color: red;font-size: 35rpx">{{showCard.amount}}</text>
  <text>元</text>
</view>
<view class="color333Size30Title" style="margin-top: 20rpx">油品类型</view>
<view class="divLine"></view>
<view class="parent">
  <block v-for="(item, index) in typeList" :key="index" class="parent">
    <view :class="item.isSelect?'childSelect':'child'" @tap="group==2?'':'onTapType'" :data-index="index">{{item.typeName}}</view>
  </block>
</view>
<view class="color333Size30Title" style="margin-top: 10rpx">油品型号</view>
<view class="parent">
  <block v-for="(item, index) in normList" :key="index" class="parent">
    <view :class="item.isSelect?'childSelect':'child'" @tap="group==2?'':'onTapNorm'" :data-index="index">{{item.typeName}}</view>
  </block>
</view>
<view class="divLine"></view>
<view class="unitView" style="margin-top: 20rpx">
  <view>
    <text>单价：</text>
    <text style="color: red;">{{(filter.checkCardFlagIsSite(showCard.cardFlag) && !isUseCoupon&&flag!=2)?(oilPriceInfo.fuelSalePrice==''?'0.00':oilPriceInfo.fuelSalePrice):(oilPriceInfo.fuelPrice==''?'0.00':oilPriceInfo.fuelPrice)}}</text>
    <text>元</text>
  </view>
 
  <view v-if="flag==2?true:false">
    <text>拼团后单价：</text>
    <text style="color: red;">{{oilPriceInfo.fuelGrouponPrice}}</text>
    <text>元</text>
  </view>
  <view v-if="isUseCoupon">
    <text>优惠后单价：</text>
    <text style="color: red;">{{calTotalCoupon.fuelCouponPrice}}</text>
    <text>元</text>
  </view>
</view>
<view class="color333Size30Title" style="margin-top: 20rpx" v-if="numberList.length>0">选择枪号</view>
<view class="parent">
  <block v-for="(item, index) in numberList" :key="index" class="parent">
    <view :class="item.isSelect?'childSelect':'child'" @tap="onTapGun" :data-index="index">{{item.gunName}}</view>
  </block>
</view>
<view class="color333Size30Title" style="margin-top: 20rpx">加油金额</view>
<view class="inputView">
  <text>¥</text>
  <input @input="{{group==2?'':'inputAmount'}}" :value="amount" type="digit" :disabled="isInputAmount" :maxlength="10" placeholder="请输入金额"></input>
</view>
<view class="unitView" style="margin-top: 10rpx">
  <view>
    <text>加油量(升)：</text>
    <view class="inputView">
      <input @input="{{group==2?'':'inputNumber'}}" :disabled="isInputNumber" :value="oilNum" type="digit" :maxlength="10" placeholder="请输入数量"></input>
    </view>
  </view>
</view>
<view class="divLine"></view>
<view class="couponView" v-if="flag==2?false:true" @tap="selectCoupon">
  <view class="couponViewLeft">优惠券</view>
  <view class="couponViewRight">
    <text v-if="couponNo==''">请选择</text>
    <text style v-if="couponNo!=''">{{couponDetails}}</text>
  </view>
  <image src="/static/images/icon_right.png"></image>
</view>
<view class="divLine"></view>
<view class="unitView" style="margin-top: 20rpx" v-if="isUseCoupon">
  <view>
    <text>共节省：</text>
    <text style="color: red;">{{calTotalCoupon.couponAmount}}</text>
    <text>元</text>
  </view>
  <view>
    <text>优惠后加油：</text>
    <text style="color: red;">{{calTotalCoupon.fuelCouponNum}}</text>
    <text>升</text>
  </view>

</view>
<view class="unitView" style="margin-top: 20rpx" v-if="flag==2?true:false">
  <view>
    <text>共节省：</text>
    <text style="color: red;">{{calTotalCoupon.couponAmount}}</text>
    <text>元</text>
  </view>
  <view>
    <text>优惠后加油：</text>
    <text style="color: red;">{{calTotalCoupon.fuelCouponNum}}</text>
    <text>升</text>
  </view>

</view>
<button @tap="clickToPay" style v-if="flag==2?true:false" class="bottomButton">去支付</button>

<!-- 这里是选择加油卡 -->
<view class="commodity_screen" @tap="hideModal" v-if="showModalStatus"></view>
<view :animation="animationData" class="commodity_attr_box" v-if="showModalStatus">
  <view class="showViewTitle">
    <image @tap="hideModal" src="/static/images/icon_cancel.png"></image>
    <text>选择加油卡</text>
    <image></image>
  </view>
  <scroll-view class="scrollView" scroll-y="true">
    <block v-for="(item, bindex) in cardList" :key="bindex">
      <view class="cardContainer">
        <view class="cellView" @tap="selectItem" :data-index="bindex">
          <view class="leftView">
            <text>卡号</text>
            <label>{{item.cardNo}}({{filter.checkCardFlagName(item.cardFlag)}})</label>
          </view>
          <view class="rightView">
            <view>
              <view class="leftView">
                <text style="text-align: right;">当前余额</text>
                <label style="text-align: right;">{{item.amount}}</label>
              </view>
            </view>
            <checkbox :checked="checkSelect==bindex?true:false"></checkbox>
          </view>
        </view>
        <view style="font-size: 28rpx;color: white;margin-left: 30rpx;margin-bottom: 30rpx">{{item.compSecondName}}</view>
      </view>
    </block>
  </scroll-view>
</view>
</view>
</template>

<script module="filter" lang="wxs" src="../../../../utils/normal.wxs"></script>

<script>
var api = require("../../../../config/api.js");
var util = require("../../../../utils/util.js");
const app = getApp();

export default {
  data() {
    return {
      typeList: [],
      normList: [],
      numberList: [],
      amount: "",
      oilNum: "",
      showModalStatus: false,
      showModal: false,
      cardList: '',
      flag: 0,
      group: 0,
      index: 0,
      showCard: {
        id: 0,
        cardNo: "",
        userName: "",
        cardFlag: "",
        amount: 0,
        fuelType: 0,
        cardType: 0,
        fuelNo: 0,
        compName: ''
      },
      focus: false,
      Length: 6,
      //输入框个数
      isFocus: true,
      //聚焦
      Value: "",
      //输入的内容
      ispassword: true,
      //是否密文显示 true为密文， false为明文。
      payPwdshowModalStatus: false,
      hasPayPassword: 0,
      groupList: {},
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
      couponDetails: "",
      couponNo: "",
      couponId: 0,
      isUseCoupon: false,
      calTotalCoupon: {
        fuelCouponNum: 0,
        //优惠后加油量
        fuelCouponAmount: 0,
        //优惠后加油金额
        couponAmount: 0,
        //优惠金额
        fuelCouponPrice: 0,
        //优惠后单价
        fuelGrouponPrice: 0,
        //拼团后单价
        couponFlag: 0,
        //是不是有优惠。。。0是没有优惠
        fuelPrice: 0,
        fuelNum: 0,
        fuelAmount: 0,
        remark: "",
        payTypeList: []
      },
      fuelsList: [],
      stationId: 0,
      opId: 0,
      stationName: "",
      payToken: "",
      ddlist: {},
      isInputAmount: true,
      isInputNumber: true,
      animationData: "",
      checkSelect: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const map = JSON.parse(options.map)
    // console.log(map)
    let list = "";
    list = app.globalData.ddlist;
    let map = list.orderEntity;
    let temp = list.cards;
    console.log(map);
    this.setData({
      stationId: map.stationId,
      stationName: map.stationSecondName,
      opId: map.userId,
      groupList: map,
      flag: options.flag,
      group: options.group,
      oilNum: map.fuelNum,
      amount: map.fuelAmount,
      oilPriceInfo: {
        fuelPrice: map.fuelPrice,
        fuelGrouponPrice: map.fuelCouponPrice
      },
      "calTotalCoupon.fuelCouponNum": map.fuelCouponNum,
      "calTotalCoupon.couponAmount": map.couponAmount
    });
    this.requestOilType();
    this.getCardList(temp); // return
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    uni.getStorage({
      key: 'driverInfo',
      success: function (res) {
        console.log(res);
        that.setData({
          hasPayPassword: res.data.attrs.hasPayPassword
        });
      }
    });
    const pages = getCurrentPages();
    const currPage = pages[pages.length - 1]; // 当前页

    if (currPage.data.couponDetails != "") {
      that.setData({
        couponDetails: currPage.data.couponDetails,
        couponNo: currPage.data.couponNo,
        couponId: currPage.data.couponId
      });
      var fuelPrice = this.oilPriceInfo.fuelPrice;
      var fuelSalePrice = this.oilPriceInfo.fuelSalePrice;
      var showCard = this.showCard;
      var amount = this.amount;
      var typeId = this.typeId;
      var normId = this.normId;

      if (this.checkCardFlagIsSite(showCard.cardFlag)) {
        that.requestCalTotal(amount, fuelSalePrice, currPage.data.couponId, typeId, normId);
      } else {
        that.requestCalTotal(amount, fuelPrice, currPage.data.couponId, typeId, normId);
      }
    }

    if (that.showCard != null) {
      that.requestRefreshSelectCard();
    }
  },
  methods: {
    checkCardFlagIsSite: function (flag) {
      if ("CC" == flag || "C2" == flag) {
        return false;
      } else {
        return true;
      }
    },
    inputAmount: function (e) {
      const value = e.detail.value;

      if (value == "") {
        this.setData({
          oilNum: "",
          amount: ""
        });
        this.setData({
          "calTotalCoupon.fuelCouponNum": 0,
          "calTotalCoupon.couponAmount": 0
        });
      } else {
        var fuelPrice = this.oilPriceInfo.fuelPrice;
        var fuelSalePrice = this.oilPriceInfo.fuelSalePrice;
        var fuelGrouponPrice = this.oilPriceInfo.fuelGrouponPrice;
        console.log(fuelPrice, fuelSalePrice, fuelGrouponPrice);
        var showCard = this.showCard;
        var amount = this.checkInputText(value);
        var oilNum;

        if (this.checkCardFlagIsSite(showCard.cardFlag)) {
          oilNum = app.globalData.newToFixed(amount / fuelSalePrice, 2);
        } else {
          oilNum = app.globalData.newToFixed(amount / fuelPrice, 2);
        }

        if (this.flag == 2) {
          let oilNum1 = app.globalData.newToFixed(amount / fuelGrouponPrice, 2);
          this.setData({
            "calTotalCoupon.fuelCouponNum": oilNum1
          });
          oilNum = app.globalData.newToFixed(amount / fuelPrice, 2);
        }

        var amount1;

        if (this.checkCardFlagIsSite(showCard.cardFlag)) {
          amount1 = app.globalData.newToFixed(oilNum * fuelSalePrice, 2);
        } else {
          amount1 = app.globalData.newToFixed(oilNum * fuelPrice, 2);
        }

        if (this.flag == 2) {
          let amount2 = app.globalData.newToFixed(oilNum / fuelGrouponPrice, 2);
          amount1 = app.globalData.newToFixed(oilNum / fuelPrice, 2);
          let amount3 = app.globalData.newToFixed(amount2 - amount1, 2);
          this.setData({
            "calTotalCoupon.couponAmount": amount3
          });
        }

        this.setData({
          amount,
          oilNum
        });
      }
    },

    inputNumber(e) {
      const value = e.detail.value;

      if (value == "") {
        this.setData({
          oilNum: "",
          amount: ""
        });
        this.setData({
          "calTotalCoupon.fuelCouponNum": 0,
          "calTotalCoupon.couponAmount": 0
        });
      } else {
        var fuelPrice = this.oilPriceInfo.fuelPrice;
        var fuelSalePrice = this.oilPriceInfo.fuelSalePrice;
        var fuelGrouponPrice = this.oilPriceInfo.fuelGrouponPrice;
        var showCard = this.showCard;
        var oilNum = this.checkInputText(value);
        var amount;

        if (this.checkCardFlagIsSite(showCard.cardFlag)) {
          amount = app.globalData.newToFixed(oilNum * fuelSalePrice, 2);
        } else {
          amount = app.globalData.newToFixed(oilNum * fuelPrice, 2);
        }

        if (this.flag == 2) {
          let amount1 = app.globalData.newToFixed(oilNum / fuelGrouponPrice, 2);
          amount = app.globalData.newToFixed(oilNum / fuelPrice, 2);
          let amount3 = app.globalData.newToFixed(amount2 - amount1, 2);
          this.setData({
            "calTotalCoupon.couponAmount": amount3
          });
        }

        var oilNum1;

        if (this.checkCardFlagIsSite(showCard.cardFlag)) {
          oilNum1 = app.globalData.newToFixed(amount / fuelSalePrice, 2);
        } else {
          oilNum1 = app.globalData.newToFixed(amount / fuelPrice, 2);
        }

        if (this.flag == 2) {
          let oilNum2 = app.globalData.newToFixed(amount / fuelGrouponPrice, 2);
          this.setData({
            "calTotalCoupon.fuelCouponNum": oilNum2
          });
        }

        this.setData({
          amount,
          oilNum
        });
      }
    },

    checkInputText(text) {
      const reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;

      if (reg.test(text)) {
        //正则匹配通过，提取有效文本
        text = text.replace(reg, '$2$3$4');
      } else {
        //正则匹配不通过，直接清空
        text = '';
      }

      return text; //返回符合要求的文本（为数字且最多有带2位小数）
    },

    selectCoupon() {
      const typeId = this.typeId;
      const comId = this.stationId;
      const fuelAmount = this.amount;
      const showCard = this.showCard;
      const fuelType = showCard.fuelType;
      const cardType = showCard.cardType;
      const fuelNo = this.normId;
      console.log(fuelNo);

      if (typeId == 0) {
        uni.showToast({
          title: '请先选择油品',
          icon: 'none'
        });
        return;
      }

      if (fuelAmount == 0) {
        uni.showToast({
          title: '请先输入价格',
          icon: 'none'
        });
        return;
      }

      uni.navigateTo({
        url: '../../selectCoupon/selectCoupon?fuelType=' + typeId + "&comId=" + comId + "&fuelAmount=" + fuelAmount + "&cardType=" + cardType + "&fuelNo=" + fuelNo
      });
    },

    showPayPwd: function () {
      // 显示遮罩层
      var animation = uni.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      });
      this.animation = animation;
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export(),
        payPwdshowModalStatus: true,
        Value: ''
      });
      setTimeout(function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export()
        });
      }.bind(this), 200);
    },
    selectOilCard: function () {
      // 显示遮罩层
      var animation = uni.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      });
      this.animation = animation;
      animation.translateY(300).step();
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      });
      setTimeout(function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export()
        });
      }.bind(this), 200);
    },
    hideModal: function (e) {
      // 隐藏遮罩层
      var animation = uni.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      });
      this.animation = animation;
      animation.translateY(300).step();
      this.setData({
        animationData: animation.export()
      });
      setTimeout(function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export(),
          showModalStatus: false,
          payPwdshowModalStatus: false
        });
      }.bind(this), 200);
    },
    selectItem: function (e) {
      const index = e.currentTarget.dataset.index;
      const cardNo = this.cardNo;

      if (this.cardList[index].cardNo != cardNo) {
        let typeList = this.typeList;

        for (let i = 0; i < typeList.length; i++) {
          typeList[i].isSelect = false;
          var childDictList = typeList[i].childDictList;

          for (let j = 0; j < childDictList.length; j++) {
            childDictList[j].isSelect = false;
          }
        }

        this.setData({
          checkSelect: index,
          showCard: this.cardList[index],
          normList: [],
          numberList: [],
          isUseCoupon: false,
          oilPriceInfo: {
            fuelPrice: 0.00,
            fuelSalePrice: 0.00,
            fuelGrouponPrice: 0.00,
            fuelUnit: "",
            id: 0
          },
          couponNo: '',
          oilNum: "",
          amount: "",
          isInputAmount: true,
          isInputNumber: true,
          typeId: 0,
          normId: 0,
          calTotalCoupon: {
            fuelGrouponPrice: 0,
            couponAmount: 0,
            fuelCouponNum: 0
          },
          typeList
        });
      }

      this.hideModal();
    },

    onTapType(e) {
      const index = e.currentTarget.dataset.index;
      let typeList = this.typeList;
      const typeId = this.typeId;
      const showCard = this.showCard;

      if (typeList[index].id == showCard.fuelType) {
        if (typeList[index].id == typeId) return;

        for (let i = 0; i < typeList.length; i++) {
          typeList[i].isSelect = i == index;
        }

        this.setData({
          typeList,
          normList: typeList[index].childDictList,
          typeId: typeList[index].id,
          numberList: [],
          oilPriceInfo: {
            fuelPrice: 0.00,
            fuelSalePrice: 0.00,
            fuelGrouponPrice: 0.00,
            fuelUnit: "",
            id: 0
          },
          couponDetails: "",
          couponNo: "",
          couponId: 0,
          isUseCoupon: false,
          calTotalCoupon: {
            fuelGrouponPrice: 0,
            couponAmount: 0,
            fuelCouponNum: 0
          },
          amount: '',
          oilNum: ""
        });
      } else {
        util.showErrorToast("请选择与油卡一致的种类");
      }
    },

    onTapNorm(e) {
      const index = e.currentTarget.dataset.index;
      let normList = this.normList;
      const normId = this.normId;
      console.log(normId);
      console.log(normList[index].id);
      if (normList[index].id == normId) return;

      for (let i = 0; i < normList.length; i++) {
        normList[i].isSelect = i == index;
      }

      const typeId = this.typeId;
      this.setData({
        normList,
        normId: normList[index].id,
        numberList: [],
        oilPriceInfo: {
          fuelPrice: 0.00,
          fuelSalePrice: 0.00,
          fuelUnit: "",
          id: 0
        },
        couponDetails: "",
        couponNo: "",
        couponId: 0,
        isUseCoupon: false,
        calTotalCoupon: {
          fuelGrouponPrice: 0,
          couponAmount: 0,
          fuelCouponNum: 0
        },
        amount: '',
        oilNum: ""
      });
      this.requestOilGun(typeId, normList[index].id);
      this.requestOilPrice(typeId, normList[index].id);
    },

    onTapGun(e) {
      const index = e.currentTarget.dataset.index;
      let numberList = this.numberList;

      for (let i = 0; i < numberList.length; i++) {
        numberList[i].isSelect = i == index;
      }

      this.setData({
        numberList,
        gunId: numberList[index].id
      });
    },

    getCardList: function (temp1) {
      var showCard = this.showCard;
      console.log(temp1);
      const temp = temp1[0];
      showCard["id"] = temp.id;
      showCard["cardNo"] = temp.cardNo;
      showCard["userName"] = temp.userName;
      showCard["amount"] = temp.amount;
      showCard["cardFlag"] = temp.cardFlag;
      showCard["fuelType"] = temp.fuelType;
      showCard["cardType"] = temp.cardType;
      showCard["compName"] = temp.compName;
      showCard["compSecondName"] = temp.compSecondName;
      this.setData({
        cardList: temp1,
        showCard: temp,
        cardNo: temp.cardNo
      });
    },

    requestRefreshSelectCard() {
      const that = this;
      var showCard = that.showCard;
      var stationId = that.stationId;
      var parma = {
        compId: stationId,
        stationComCard: 'stationCom'
      };
      util.postRequest(api.driverOilcardList, parma).then(function (res) {
        console.log(res);

        if (res.retCode == '0000000') {
          for (let i = 0; i < res.rspBody.length; i++) {
            if (showCard.cardNo == res.rspBody[i].cardNo) {
              showCard.amount = res.rspBody[i].amount;
            }
          }

          that.setData({
            showCard
          });
        }
      });
    },

    requestOilType() {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
      const parma = {
        "stationId": that.stationId
      };
      util.postRequest(api.getSiteInfo, parma).then(function (res) {
        console.log(res);
        uni.hideLoading();

        if (res.retCode == '0000000') {
          const list = res.rspBody.FUEL_TYPE;
          let typeList = [];
          console.log(that.groupList);
          let fuelType = that.groupList.fuelType;
          let fuleNo = that.groupList.fuelDictId;
          console.log(fuelType, fuleNo);

          if (list != null) {
            for (let i = 0; i < list.length; i++) {
              let bean = {};
              bean.id = list[i].id;
              bean.typeName = list[i].typeName;
              let childList = [];
              const childDictList = list[i].childDictList;

              for (let j = 0; j < childDictList.length; j++) {
                let child = {};
                child.typeName = childDictList[j].typeName;
                child.id = childDictList[j].id;

                if (childDictList[j].id == fuleNo) {
                  child.isSelect = true;
                } else {
                  child.isSelect = false;
                }

                childList.push(child);
              }

              bean.childDictList = childList;

              if (list[i].id == fuelType) {
                that.setData({
                  index: i
                });
                bean.isSelect = true;
              } else {
                bean.isSelect = false;
              }

              typeList.push(bean);
              console.log(typeList);
            }
          }

          that.setData({
            typeList,
            normList: typeList[that.index].childDictList
          });
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    requestOilGun(fuelType, fuelDictId) {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
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
          let numberList = [];

          if (list != null) {
            for (let i = 0; i < list.length; i++) {
              let bean = {};
              bean.id = list[i].id;
              bean.gunName = list[i].gunName;
              bean.fuelType = list[i].fuelType;
              bean.fuelDictId = list[i].fuelDictId;
              bean.isSelect = false;
              numberList.push(bean);
            }
          }

          that.setData({
            numberList
          });
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    requestOilPrice(fuelType, fuelDictId) {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
      const parma = {
        "stationId": that.stationId,
        "fuelType": fuelType,
        "fuelDictId": fuelDictId,
        "cardId": that.showCard.id
      };
      util.postRequest(api.getOilList, parma).then(function (res) {
        console.log(res);
        uni.hideLoading();

        if (res.retCode == '0000000') {
          const temp = res.rspBody[0];
          console.log(temp);

          if (temp != null) {
            let oilPriceInfo = that.oilPriceInfo;
            oilPriceInfo.fuelPrice = temp.fuelPrice;
            oilPriceInfo.fuelSalePrice = temp.fuelSalePrice;
            oilPriceInfo.fuelGrouponPrice = temp.fuelGrouponPrice;
            oilPriceInfo.fuelUnit = temp.fuelUnit;
            oilPriceInfo.id = temp.id;
            that.setData({
              oilPriceInfo,
              isInputAmount: false,
              isInputNumber: false
            });
          }
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    requestCalTotal(fuelAmount, fuelPrice, userCouponId, fuelType, fuelDictId) {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
      const parma = {
        "fuelAmount": fuelAmount,
        "fuelPrice": fuelPrice,
        "userCouponId": userCouponId,
        "fuelType": fuelType,
        "fuelDictId": fuelDictId,
        "stationId": that.stationId
      };
      util.postRequest(api.calCouponPrice, parma).then(function (res) {
        console.log(res);
        uni.hideLoading();

        if (res.retCode == '0000000') {
          let calTotalCoupon = that.calTotalCoupon;
          calTotalCoupon.fuelNum = res.rspBody.fuelNum;
          calTotalCoupon.fuelAmount = res.rspBody.fuelAmount;
          calTotalCoupon.fuelPrice = res.rspBody.fuelPrice;
          calTotalCoupon.remark = res.rspBody.remark;
          calTotalCoupon.fuelCouponPrice = res.rspBody.fuelCouponPrice;
          calTotalCoupon.fuelGrouponPrice = res.rspBody.fuelGrouponPrice;
          calTotalCoupon.couponAmount = res.rspBody.couponAmount;
          calTotalCoupon.fuelCouponNum = res.rspBody.fuelCouponNum;
          calTotalCoupon.payTypeList = res.rspBody.payTypeList;
          that.setData({
            calTotalCoupon,
            isUseCoupon: true
          });
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    checkCardName(flag) {
      let str = "";

      if ("CC" == flag) {
        str = "车队柴油卡";
      } else if ("YC" == flag) {
        str = "油站柴油卡";
      } else if ("YQ" == flag) {
        str = "油站汽油卡";
      } else if ("YG" == flag) {
        str = "油站天然气卡";
      } else {
        str = "车队柴油卡";
      }

      return str;
    },

    getPay() {
      var listData = {
        fuelType: this.groupList.fuelType,
        fuelDictId: this.groupList.fuelDictId,
        fuelGunId: this.groupList.fuelGunId,
        grouponNo: this.groupList.grouponNo,
        cardId: this.showCard.id,
        fuelName: this.groupList.fuelName,
        stationId: this.groupList.stationId,
        opId: this.groupList.opId,
        fuelPrice: this.groupList.fuelPrice,
        stationId: this.groupList.stationId,
        fuelUnit: this.groupList.fuelUnit,
        fuelCouponPrice: this.groupList.fuelCouponPrice,
        fuelNum: this.groupList.fuelNum,
        fuelAmount: this.groupList.fuelAmount,
        fuelCouponNum: this.groupList.fuelCouponNum,
        couponAmount: this.groupList.couponAmount,
        id: this.groupList.id
      };
      console.log(listData.cardId);
      uni.navigateTo({
        url: '../payOil/payOil?map=' + JSON.stringify(listData) + "&group=" + 1
      });
    },

    clickToPay: function () {
      if (this.group == 2) {
        this.getPay();
      } else if (this.hasPayPassword == 1) {
        if (this.amount == "") {
          uni.showModal({
            title: '提示',
            content: '请输入正确金额',
            showCancel: false
          });
          return;
        }

        if (this.typeId == 0) {
          uni.showModal({
            title: '提示',
            content: '请选择油品',
            showCancel: false
          });
          return;
        }

        if (this.normId == 0) {
          uni.showModal({
            title: '提示',
            content: '请选择油品型号',
            showCancel: false
          });
          return;
        }

        const data = {
          userCouponId: this.couponId,
          fuelType: this.typeId,
          fuelDictId: this.normId,
          fuelGunId: this.gunId,
          cardId: this.showCard.id,
          stationId: this.stationId,
          opId: this.opId,
          fuelPrice: this.calTotalCoupon.fuelPrice != null ? this.calTotalCoupon.fuelPrice : this.oilPriceInfo.fuelPrice,
          fuelNum: this.oilNum,
          fuelAmount: this.amount,
          payToken: this.payToken,
          showCard: this.showCard,
          payTypeList: this.calTotalCoupon.payTypeList
        };
        console.log(data); // return

        if (this.flag == 2) {
          this.setData({
            showModal: true
          });
          console.log(this.showModal);
        } else {
          uni.navigateTo({
            url: '../payOil/payOil?map=' + JSON.stringify(data)
          });
        }
      } else {
        uni.showModal({
          title: '提示',
          content: '您尚未创建支付密码，请先创建支付密码再进行加油',
          showCancel: false,
          success: function () {
            uni.navigateTo({
              url: '../../../my/pwdManager/setPayPwd/setPayPwd'
            });
          }
        });
      }
    }
  }
};
</script>
<style>
@import "./addOilIndex.css";
</style>