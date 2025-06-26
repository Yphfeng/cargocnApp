<template>
<view class="container">
  <view class="selectView">
    <view @tap.stop="selectTap">
      <text>其他卡</text>
      <image src="/static/images/icon_bottom.png"></image>
    </view>
  </view>
  <view class="select_box">
    <view class="option_box" :style="'height:' + (show1?400:0) + 'rpx;'">
      <scroll-view class="scrollView" scroll-y="true" @scrolltoupper="scrollTop" @scrolltolower="scrollBottom">
        <block v-for="(item, index) in cardListArr" :key="index">
          <view class="cellView" @tap="selectItem" :data-map="item">
            <view class="leftView">
              <text>{{item.cardNo}}</text>
              <text>{{item.compName}}</text>
            </view>
            <view class="rightView">
              <text>{{item.plateNo}}</text>
              <text>{{item.userName}}</text>
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
  <view class="cardView">
    <view class="cardView1">
      <view class="card">
        <view class="cardType1">
          <image src="https://cargocn.oss-cn-beijing.aliyuncs.com/20200904170819.png"></image>
          <view>
            <text>{{showcard.userName}}</text>
            <text>{{showcard.plateNo}}</text>
          </view>
        </view>
        <view class="cardType2">
          <text>加油么加油卡</text>
          <text>{{showcard.compName}}</text>
        </view>
      </view>
      <view class="accountView">
        <text>余额(元)</text>
        <label>{{showcard.amount}}</label>
      </view>
      <view class="numView">卡号:{{showcard.cardNo}}</view>
    </view>
  </view>
  <view class="bottomView">
    <view>
      <canvas class="canvas-code" canvas-id="myQrcode" style="background:#fff;width: 200px;height: 200px;"></canvas>
    </view>
    <text>请向油站工作人员出示</text>
    <text>二维码进行加油</text>
  </view>
</view>
</template>

<script>
// pages/oilstation/showCard/showCard.js
// pages/oilstation/oilstationIndex/oilstationIndex.js
var api = require("../../../config/api.js");
var util = require("../../../utils/util.js");
import QRCode from "../../../utils/weapp-qrcode";

export default {
  data() {
    return {
      cardListArr: [],
      showcard: {},
      show1: false,
      aaa: "2"
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCardList();
  },
  methods: {
    getCardList: function () {
      var that = this;
      util.postRequest(api.driverOilcardList, {}).then(function (res) {
        console.log(res);

        if (res.retCode == '0000000') {
          that.setData({
            cardListArr: res.rspBody,
            showcard: res.rspBody[0]
          });
          that.getCardSecret(res.rspBody[0].id);
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },
    selectItem: function (e) {
      console.log(e.currentTarget.dataset.map);
      this.setData({
        show1: !this.show1,
        showcard: e.currentTarget.dataset.map
      });
      this.getCardSecret(e.currentTarget.dataset.map.id); // this.qrcode(e.currentTarget.dataset.map.id);
    },
    getCardSecret: function (id) {
      var that = this;
      uni.getLocation({
        success: function (res) {
          var parm = {
            id: id,
            latitude: res.latitude,
            longitude: res.longitude
          };
          util.postRequest(api.getCardSecret, parm).then(function (res) {
            console.log(res);

            if (res.retCode == '0000000') {
              that.qrcode(res.rspBody);
            } else {
              uni.showToast({
                title: res.retDesc,
                icon: 'none'
              });
            }
          });
        }
      });
    },
    qrcode: function (aa) {
      console.log(aa);
      new QRCode('myQrcode', {
        text: aa.toString(),
        width: 200,
        height: 200,
        padding: 12,
        // 生成二维码四周自动留边宽度，不传入默认为0
        correctLevel: QRCode.CorrectLevel.L,
        // 二维码可辨识度
        callback: res => {
          console.log(res.path);
          console.log(this.showcard.id); // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
        }
      });
    },
    selectTap: function () {
      this.setData({
        show1: !this.show1
      });
    }
  }
};
</script>
<style>
@import "./showCard.css";
</style>