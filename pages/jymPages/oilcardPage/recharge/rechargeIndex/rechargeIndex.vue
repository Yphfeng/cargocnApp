<template>
<view>
<view class="jym-container">
  <view class="oilTypeView" @tap="selectOilCard">
    <text style="font-size: 30rpx">加油卡</text>
    <view style="display: flex;flex-direction: row;justify-content: flex-end;">
      <text style="margin-left:0rpx;font-size: 30rpx" v-if="showcard!=''">{{showcard.cardNo}}({{filter.checkCardFlagName(showcard.cardFlag)}})</text>
      <text style="margin-left:0rpx;font-size: 30rpx" v-if="showcard==''">请选择</text>
      <image src="/static/images/jym/icon_right.png"></image>
    </view>
  </view>
  <view class="AmountView">
    <view class="contentView">
      <span>充值金额</span>
      <view class="inputView">
        <text>¥</text>
        <input type="digit" :value="amount" @input="inputAmount"></input>
      </view>
      <button @tap="clickToPay">去充值</button>
      <view class="oilCardView" @tap="selectBankCard">
        <text>{{bankNo}}({{bankName}})</text>
        <image src="/static/images/jym/icon_right.png"></image>
      </view>
    </view>
  </view>
  <view>

    <!-- 这里是选择加油卡 -->
    <view class="commodity_screen" @tap="hideModal" v-if="oilshowModalStatus"></view>
    <view :animation="animationData" class="commodity_attr_box" v-if="oilshowModalStatus">
      <view class="showViewTitle">
        <image @tap="hideModal" src="/static/images/jym/icon_cancel.png"></image>
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
            <view style="font-size: 28rpx;color: white;margin-left: 30rpx;margin-bottom: 30rpx">{{item.compName}}</view>
          </view>
        </block>
      </scroll-view>
    </view>

    <!-- 这里是选择银行卡 -->
    <view class="commodity_screen" @tap="hideModal" v-if="bankshowModalStatus"></view>
    <view :animation="animationData" class="commodity_attr_box" v-if="bankshowModalStatus">
      <view class="showViewTitle">
        <image @tap="hideModal" src="/static/images/jym/icon_cancel.png"></image>
        <text>选择银行卡</text>
        <image></image>
      </view>
      <scroll-view class="scrollView" scroll-y="true">
        <block v-for="(item, bindex) in bankList" :key="bindex">
          <view class="bankItemView" @tap="selectBankItem" :data-map="item">
            <image class="bankHeadImage" src="https://cargocn.oss-cn-beijing.aliyuncs.com/20200904170819.png"></image>
            <view>
              <text>{{item.accountName}}({{item.bank}})</text>
              <text style="font-size:26rpx;">{{item.account}}</text>
            </view>
          </view>
        </block>
      </scroll-view>
    </view>

  </view>
</view>
<!-- 这里是输入支付密码 -->
<view class="commodity_screen1" @tap="hideModal" v-if="payPwdshowModalStatus"></view>
<view :animation="animationData" class="commodity_attr_box1" v-if="payPwdshowModalStatus">
  <view class="showViewTitle1">
    <image @tap="hideModal" src="/static/images/jym/icon_cancel.png"></image>
    <text>输入支付密码</text>
    <image></image>
  </view>
  <view class="scrollView1" style="margin-top:00rpx;">
    <view class="input" @tap="getFocus">
      <view v-for="(item, index) in Length" :key="index" class="input-content">
        <input :value="Value.length>=index+1?Value[index]:''" disabled :password="ispassword" @tap.stop="Tap"></input>
      </view>
    </view>

    <input name="password" password="true" class="password-input" :maxlength="Length" :focus="isFocus" @input="password_input" type="number"></input>

  </view>
</view>
</view>
</template>

<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>

<script>
// pages/oilstation/addOilPage/addOilIndex/addOilIndex.js
var api = require("@/config/api.js");
var util = require("@/utils/jym-utils/util.js");

export default {
  data() {
    return {
      checkSelect: -1,
      showcard: '',
      cardList: '',
      amount: '',
      oilshowModalStatus: false,
      oilTypeList: [{
        "id": 1,
        "version": 1,
        "stationId": 154,
        "fuelItemId": 1,
        "fuelName": "0号汽油",
        "fuelPrice": 555.00,
        "fuelUnit": "升"
      }, {
        "id": 2,
        "version": 1,
        "stationId": 154,
        "fuelItemId": 1,
        "fuelName": "0号汽油",
        "fuelPrice": 666.00,
        "fuelUnit": "升"
      }],
      bankName: '请选择银行卡',
      bankNo: '',
      bankId: '',
      bankList: [],
      bankshowModalStatus: false,
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
      isOpenFlag: '',
      couponMap: {},
      hasPayPassword: 0,
      animationData: "",
      recharge: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (options.map != null) {
      that.showcard = JSON.parse(options.map);
      this.getCardList();
    }

    if (options.isOpenFlag != null) {
      that.isOpenFlag = "1";
      this.getCardList();
    }

    if (options.couponMap != null) {
      that.couponMap = JSON.parse(options.couponMap);
      this.getCardList1();
    } // this.getBankList();

  },

  onShow() {
    const that = this;
    uni.getStorage({
      key: 'driverInfo',
      success: function (res) {
        console.log(res.data.attrs.hasPayPassword);
        that.hasPayPassword = res.data.attrs.hasPayPassword;
      }
    });

    if (!uni.getStorageSync('driverVerify')) {
      uni.showModal({
        title: '提示',
        content: '当前账户未认证，请完成认证后使用该功能！',
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({
              url: "../../../login/userVerify/userVerify?type=0"
            });
          } else {
            uni.navigateBack({
              delta: 0
            });
          }
        }
      });
    } else {
      this.getBankList();
    }
  },

  methods: {
    getCardList1: function () {
      var that = this;
      util.postRequest(api.driverOilcardList, {}).then(function (res) {
        console.log(res);

        if (res.retCode == '0000000') {
          console.log(that.couponMap);
          let couponMap = that.couponMap;
          let list = res.rspBody;
          let arr = [];

          for (let i in list) {
            if (couponMap.comId == list[i].compId && couponMap.fuelType == list[i].fuelType) {
              arr.push(list[i]);
            }
          }

          console.log(arr);
          that.cardList = arr;
            that.showcard = arr[0];
            that.checkSelect = 0;
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },
    inputAmount: function (e) {
      let value = this.validateNumber(e.detail.value);
      console.log(value);
      this.amount = value;
    },

    validateNumber(val) {
      val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符

      val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的

      val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数

      if (val.indexOf(".") < 0 && val != "") {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val);
      }

      return val;
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
      this.animationData = animation.export();
        this.oilshowModalStatus = true;
      setTimeout(function () {
        animation.translateY(0).step();
        this.animationData = animation.export();
      }.bind(this), 200);
    },
    selectBankCard: function () {
      // 显示遮罩层
      var animation = uni.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      });
      this.animation = animation;
      animation.translateY(300).step();
      this.animationData = animation.export();
        this.bankshowModalStatus = true;
      setTimeout(function () {
        animation.translateY(0).step();
        this.animationData = animation.export();
      }.bind(this), 200);
    },
    hideModal: function () {
      // 隐藏遮罩层
      var animation = uni.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      });
      this.animation = animation;
      animation.translateY(300).step();
      this.animationData = animation.export();
      setTimeout(function () {
        animation.translateY(0).step();
        this.animationData = animation.export();
          this.oilshowModalStatus = false;
          this.bankshowModalStatus = false;
          this.payPwdshowModalStatus = false;
      }.bind(this), 200);
    },

    /*下面是密码输入框*/
    password_input: function (e) {
      var that = this;
      var inputValue = e.detail.value;
      that.Value = inputValue;

      if (that.Value.length == 6) {
        that.hideModal();
        that.checkPayPwd();
      }
    },

    Tap() {
      var that = this;
      that.isFocus = true;
    },

    getFocus: function () {
      this.focus = !this.focus;
    },
    clickToPay: function () {
      const hasPayPassword = this.hasPayPassword;

      if (hasPayPassword == 1) {
        if (this.amount == "") {
          uni.showModal({
            title: '提示',
            content: '请输入正确金额',
            showCancel: false
          });
          return;
        }

        this.showPayPwd();
      } else {
        uni.showModal({
          title: '提示',
          content: '您尚未创建支付密码，请先创建支付密码再进行加油',
          showCancel: false,
          success: function () {
            uni.navigateTo({
              url: '../../pwdManager/setPayPwd/setPayPwd'
            });
          }
        });
      }
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
      this.animationData = animation.export();
        this.payPwdshowModalStatus = true;
        this.Value = '';
      setTimeout(function () {
        animation.translateY(0).step();
        this.animationData = animation.export();
      }.bind(this), 200);
    },
    checkPayPwd: function (data) {
      var that = this;

      if (!/^[0-9]*$/.test(that.Value)) {
        uni.showToast({
          title: '请输入数字密码',
          duration: 2000,
          icon: 'none'
        });
      } else {
        var parm = {
          payPassword: that.Value
        };
        util.postRequest(api.checkPayPwd, parm).then(function (res) {
          console.log(res);

          if (res.retCode == '0000000') {
            if (res.rspBody.check == true) {
              // that.hideModal();
              that.rechargeNet();
            } else {
              uni.showModal({
                title: '提示',
                content: "密码错误",
                showCancel: false
              });
            }
          } else {
            uni.showToast({
              title: res.retDesc,
              icon: 'none'
            });
          }
        });
      }
    },
    getCardList: function () {
      var that = this;
      util.postRequest(api.driverOilcardList, {}).then(function (res) {
        console.log(res);

        if (res.retCode == '0000000') {
          that.cardList = res.rspBody; // showcard: res.rspBody[0]
          res.rspBody.forEach(function (item, index) {
            //console.log(item); //这里的item就是从数组里拿出来的每一个每一组
            if (that.showcard.cardNo == item.cardNo) {
              that.checkSelect = index;
            }
          });
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },
    getBankList: function () {
      uni.showLoading({
        title: '请稍候...'
      });
      var that = this;
      util.postRequest(api.mixPayBankList, {}).then(function (res) {
        uni.hideLoading();
        console.log(res);

        if (res.retCode == '0000000') {
          var list = res.rspBody;

          if (list[0] == null) {
            console.log(111);
            uni.showModal({
              title: '提示',
              content: '您尚未绑定银行卡，请先绑定银行卡再进行充值',
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '../../bank/bankListPage/bankListPage'
                  });
                } else {
                  uni.navigateBack({
                    delta: 0
                  });
                }
              }
            });
          }

          that.bankList = list;
            that.bankName = list[0].bankCardName;
            that.bankNo = list[0].account;
            that.bankId = list[0].id;
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },
    selectItem: function (e) {
      var index = e.currentTarget.dataset.index;
      console.log(index);
      var that = this;
      that.checkSelect = e.currentTarget.dataset.index;
        that.showcard = that.cardList[index];
      that.hideModal();
    },
    selectBankItem: function (e) {
      var that = this;
      var map = e.currentTarget.dataset.map;
      that.bankName = map.bank;
        that.bankNo = map.account;
        that.bankId = map.id;
      that.hideModal();
    },
    rechargeNet: function () {
      const that = this;
      const couponMap = that.couponMap;
      let parma;

      if (couponMap != null) {
        parma = {
          cardId: this.showcard.id,
          amount: this.amount,
          payPassword: this.Value,
          bankCardId: this.bankId,
          userCouponId: couponMap.userCouponId
        };
      } else {
        parma = {
          cardId: this.showcard.id,
          amount: this.amount,
          payPassword: this.Value,
          bankCardId: this.bankId
        };
      }

      util.postRequest(api.oilcardTransfer, parma).then(function (res) {
        uni.hideLoading();
        console.log(res);
        const couponMap = that.couponMap;
        let msg;

        if (couponMap != null && couponMap.couponType == 111) {
          msg = "充值成功!红包券已派发到您账户，请至【优惠奖券】中查看";
        } else {
          msg = "充值成功";
        }

        if (res.retCode == '0000000') {
          uni.showModal({
            title: '提示',
            content: msg,
            showCancel: false,
            success: function () {
              const pages = getCurrentPages();
              const prevPage = pages[pages.length - 2];
              // prevPage.setData({
              //   recharge: that.amount
              // });
			  prevPage.recharge = that.amount;
              uni.navigateBack({
                delta: 1
              });
            }
          });
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
@import "./rechargeIndex.css";
</style>