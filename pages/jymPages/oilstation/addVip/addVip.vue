<template>
<view>
<view class="topTitle" style="margin-bottom: 50rpx">请选择要开通的会员卡类型</view>
<view class="parent">
    <block v-for="(item, index) in typeList" :key="index" class="parent">
        <view :class="item.isSelect?'childSelect':'child'" @tap="onTapType" :data-index="index">{{item.typeName}}卡</view>
    </block>
</view>
<button @tap="clickButton" style="margin-top: 300rpx" class="bottomButton">确定</button>
</view>
</template>

<script>
var api = require("../../../config/api.js");
var util = require("../../../utils/util.js");

export default {
  data() {
    return {
      stationId: 0,
      personId: 0,
      typeList: []
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const stationId = options.stationId;
    this.setData({
      stationId: stationId
    });
    const that = this;
    uni.getStorage({
      key: 'driverInfo',
      success: function (res) {
        that.setData({
          personId: res.data.attrs.personId
        });
      }
    });
    this.requestOilInfo();
  },

  onUnload() {
    uni.switchTab({
      url: '../../oilstationIndex/oilstationIndex'
    });
  },

  methods: {
    onTapType(e) {
      const index = e.currentTarget.dataset.index;
      let typeList = this.typeList;
      typeList[index].isSelect = !typeList[index].isSelect;
      this.setData({
        typeList
      });
    },

    clickButton() {
      const typeList = this.typeList;
      let fuelTypes = [];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].isSelect) {
          fuelTypes.push(typeList[i].id);
        }
      }

      this.requestVip(fuelTypes);
    },

    requestOilInfo() {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
      const parma = {
        "stationId": that.stationId,
        "rootCode": "FUEL_TYPE"
      };
      util.postRequest(api.getInfo, parma).then(function (res) {
        console.log(res);
        uni.hideLoading();

        if (res.retCode == '0000000') {
          const list = res.rspBody;
          let typeList = [];

          if (list != null) {
            for (let i = 0; i < list.length; i++) {
              let bean = {};
              bean.id = list[i].id;
              bean.typeName = list[i].typeName;
              bean.isSelect = false;
              typeList.push(bean);
            }
          }

          that.setData({
            typeList: typeList
          });
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    requestVip(fuelTypes) {
      uni.showLoading({
        title: '请稍候...'
      });
      const parma = {
        "personId": this.personId,
        "compId": this.stationId,
        "fuelTypes": fuelTypes
      };
      util.postRequest(api.addVip, parma).then(function (res) {
        console.log(res);
        uni.hideLoading();

        if (res.retCode == '0000000') {
          uni.showModal({
            title: '提示',
            content: "恭喜！油卡已开通成功！",
            showCancel: false,
            success: function () {
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
@import "./addVip.css";
</style>