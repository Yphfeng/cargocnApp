<template>
  <view class="mask flex-center">
    <view class="content" v-if="info">
      <image class="bg_img" src="../../../static/images/ChinaTravel/dialog_bg.png"></image>
      <image class="close" @click="switchIndex" src="../../../static/images/ChinaTravel/close.png"></image>
      <image class="gif_left" src="../../../static/images/ChinaTravel/baozhu.gif"></image>
      <image class="gif_right" src="../../../static/images/ChinaTravel/baozhu.gif"></image>
      <view class="content_text">
        <view>{{info.ChinaTravelInfo.explain1}}</view>
        <view>{{info.ChinaTravelInfo.explain2}}</view>
        <view class="content_line"></view>
        <view>{{info.ChinaTravelInfo.explain3}}</view>
        <view>{{info.ChinaTravelInfo.explain4}}</view>
        <view class="card">
          <view class="title">{{info.ChinaTravelInfo.yearTitle}}</view>
          <view class="user_position" v-if="info.address">
            <template v-if="info.address.city">
              {{info.address.city}}-{{info.address.district}}
              <text>(当前位置)</text>
            </template>
          </view>
        </view>
        <view class="rule">
          <view @click="previewImage">活动规则</view>
          <image @click="previewImage" class="arrow" src="../../../static/images/ChinaTravel/arrow.png"></image>
        </view>
      </view>
      <image class="dialog_btn" @click="goChinaTravel" src="../../../static/images/ChinaTravel/dialog_btn.png"></image>
    </view>
  </view>
</template>

<script>
  import * as service from "../../../utils/ship";
  export default {
    data() {
      return {
        isGoBack: true,
        info: null
      }
    },
    onLoad(option) {
      let that = this
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.$vm.annualBill.flag = 1;
      that.info = JSON.parse(option.info)
      console.log(that.info)
    },
    onBackPress() {
      let that = this
      // 强制更新不允许返回
      if (that.isGoBack) {
        return true
      } else {
        return false
      }
    },
    methods: {
      // 判断是否三证认证
      isThreeAuth() {
        let that = this
        console.log("三证校验结果")
        var userInfo = uni.getStorageSync("userInfo");
        let flag = false
        if (userInfo) {
          var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
          var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
          var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
          if (identityVerify !== 1 || driverVerify !== 1 || vehicleVerify !== 1) {
            uni.showToast({
              title: '请在“我的”里面完成三项认证后参与活动',
              icon: 'none'
            })
            flag = false
          } else {
            flag = true
          }
        }
        return flag
      },
      // 查看图
      previewImage() {
        let that = this
        console.log(that.info.ChinaTravelInfo.gameRule)
        var images = [that.info.ChinaTravelInfo.gameRule];
        uni.previewImage({
          urls: images,
          indicator: 'none',
          // longPressActions: {
          //   itemList: ['发送给朋友', '保存图片', '收藏'],
          //   success: function (data) {
          //     console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
          //   },
          //   fail: function (err) {
          //     console.log(err.errMsg);
          //   }
          // }
        });
      },
      // 日期格式化
      dateFormat(date) {
        let format = 'yyyy-MM-dd hh:mm:ss';
        if (date != 'Invalid Date') {
          var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
          }
          if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
              format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
          return format;
        }
        return '';

      },
      getChinaTravelLocation() {
        let that = this
        return new Promise((resolve, reject) => {
          uni.getLocation({
            geocode: true,
            type: 'gcj02',
            success: function (res) {
              console.log(res)
              let address = res.address
              console.log("中国行活动标识", that.info)
              if (!that.info.address) {
                that.info.address = {}
              }
              that.info.address.province = address.province.replace("市", "");
              that.info.address.city = address.city
              that.info.address.district = address.district
              that.info.address.latitude = res.latitude
              that.info.address.longitude = res.longitude
              resolve(true)
              console.log("中国行活动标识", that.info)
              console.log("中国行活动标识", res)
            },
            fail: function (res) {
              console.log('中国行获取定位失败')
              console.log(res)
              that.info.address = null
              resolve(false)
              uni.showToast({
                title: '请打开定位',
                icon: 'none'
              })
            }
          })
        })

      },
      // 跳转到点亮中国行页面
      async goChinaTravel() {
        let that = this
        if (!service.btnRepeat()) return false; // 防抖
        if (!that.isThreeAuth()) {
          return
        }
        let loactionFlag = await that.getChinaTravelLocation()
        console.log(loactionFlag)
        if (!loactionFlag) {
          uni.showToast({
            title: '请打开定位',
            icon: 'none'
          })
          return
        }
        let userInfo = uni.getStorageSync("userInfo");
        let userCode = JSON.parse(userInfo).attrs.userCode;
        let data = {
          userCode: userCode, // 卡友号码
          gameId: that.info.ChinaTravelInfo.sid, // 活动ID
          latitude: that.info.address.latitude, // 经纬度
          longitude: that.info.address.longitude,
          province: that.info.address.province, // 省市区
          city: that.info.address.city,
          county: that.info.address.district,
        }
        let res = await service.newRegisterPostRequest("/dlzg/lightenchina/getgame", {
          province: that.info.address.province
        })
        // let res2 = await service.newRegisterPostRequest("/dlzg/lightenchina/lighten", data)
        res.rspBody.province = that.info.address.province
        res.rspBody.city = that.info.address.city
        res.rspBody.county = that.info.address.district
        res.rspBody.image = res.rspBody.medalImage
        res.rspBody.data = data
        // console.log(res.rspBody)
        // res2.rspBody.gameRule = that.info.ChinaTravelInfo.gameRule
        // console.log(res2.rspBody)
        uni.redirectTo({
          url: './index?info=' + JSON.stringify(res.rspBody)
        })
      },
      switchIndex() {
        let that = this
        that.isGoBack = false
        uni.navigateBack({
          delta: 1
        });
      },
    }
  }
</script>

<style>
  page {
    background: transparent;
  }

  .flex-center {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
    align-items: center;
  }

  .mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .65);
  }
</style>
<style lang="scss" scoped>
  .content {
    position: relative;
    width: 646rpx;
    height: 666rpx;

    .bg_img {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 646rpx;
      height: 696rpx;
    }

    .close {
      position: absolute;
      right: 18rpx;
      top: -60rpx;
      width: 44rpx;
      height: 44rpx;
    }

    .gif_left {
      position: absolute;
      left: -26rpx;
      top: 82rpx;
      width: 110rpx;
      height: 660rpx;
    }

    .gif_right {
      position: absolute;
      right: 0;
      top: 82rpx;
      width: 110rpx;
      height: 660rpx;
    }

    .dialog_btn {
      position: absolute;
      bottom: -66rpx;
      left: 100rpx;
      width: 420rpx;
      height: 166rpx;
    }

    .content_text {
      position: absolute;
      z-index: 1;
      top: 200rpx;
      width: 428rpx;
      left: 109rpx;
      font-size: 26rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #A71206;
      text-align: center;

      .content_line {
        width: 390rpx;
        height: 2rpx;
        background: #A71206;
        margin: 18rpx auto;
      }

      .card {
        color: #FFFFFF;
        background: #D74128;
        box-shadow: 0px 0px 10rpx 0px rgba(169, 8, 6, 0.72);
        border-radius: 16rpx;
        width: 320rpx;
        height: 90rpx;
        // box-sizing: border-box;
        padding: 8rpx 0;
        margin: 30rpx auto 10rpx auto;

        .title {
          font-size: 32rpx;
          font-weight: 600;
        }

        .user_position {
          margin-top: 6rpx;
          font-size: 32rpx;
          font-weight: 300;

          text {
            font-size: 24rpx;
          }
        }
      }

      .rule {
        font-size: 22rpx;
        font-family: STYuanti-SC-Regular, STYuanti-SC;
        font-weight: 400;
        color: #333333;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .arrow {
          margin-left: 10rpx;
          padding-top: 2rpx;
          padding-right: 34rpx;
          width: 10rpx;
          height: 20rpx;
        }
      }

      view {
        line-height: 41rpx;
      }
    }


  }
</style>