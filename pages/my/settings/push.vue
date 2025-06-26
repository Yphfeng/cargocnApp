<template>
  <view class="otherSettings">
    <view class="itemView">
      <view class="leftIcon">
        <image src="../../../static/images/freezeicon.png" class="icon1"></image>
      </view>
      <view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
        开启推送消息勿扰
        <switch v-if="switchTag" checked @change="switch1Change" />
        <switch v-else @change="switch1Change" />
      </view>
    </view>
  </view>
</template>

<script>
  import {
    loginSelf
  } from "../../../utils/service.js";
  import * as utils from "@/utils/service.js";
  import * as ship from "@/utils/ship"
  export default {
    data() {
      return {
        version: '',
        switchTag: false,
		userInfo: null,
      }
    },
    onLoad() {
      var that = this;
      if (uni.getStorageSync('pushFlag') == 10) {
        that.switchTag = false
      } else if (uni.getStorageSync('pushFlag') == 20) {
        that.switchTag = true
        // uni.setStorageSync('pushFlag',10)
      }
	  var userInfo = uni.getStorageSync("userInfo");
	  this.userInfo = JSON.parse(userInfo);

    },
    methods: {
      switch1Change(e) {
        // 推送操作事件
        // var main = plus.android.runtimeMainActivity();
        //   var pkName = main.getPackageName();
        //   var uid = main.getApplicationInfo().plusGetAttribute("uid");
        //   var NotificationManagerCompat = plus.android.importClass("android.support.v4.app.NotificationManagerCompat");
        //   //android.support.v4升级为androidx
        //   if (NotificationManagerCompat == null) {
        //     NotificationManagerCompat = plus.android.importClass("androidx.core.app.NotificationManagerCompat");
        //   }
        //   //areNotificationsEnabled 保存安卓通知栏打开的状态返回值为true或false
        //   var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
        //   console.log(areNotificationsEnabled)
        //   var Intent = plus.android.importClass('android.content.Intent');
        //   var Build = plus.android.importClass("android.os.Build");
        //   //android 8.0引导  
        //   if (Build.VERSION.SDK_INT >= 26) {
        //     var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
        // // IGNORE_BATTERY_OPTIMIZATION_SETTINGS 电池优化

        //     intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
        //   } else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
        //     var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
        //       intent.putExtra("app_package", pkName);
        //     intent.putExtra("app_uid", uid);
        //   } else { //(<21)其他--跳转到该应用管理的详情页  
        //     intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        //     var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
        //     intent.setData(uri);
        //   }
        //     // 跳转到该应用的系统通知设置页  
        //   main.startActivity(intent);
        if (e.target.value) {
          //登录后注销推送信息
          var cid = plus.push.getClientInfo().clientid;
          ship.postRequest("/xxq/device/exp", {
            cid: cid,
			userId: this.userInfo.userId,
          }).then(res => {
            console.log(res)
            console.log("设备注销")
            uni.setStorageSync('pushFlag', 20)
          })
        } else {
			var deviceId = plus.push.getClientInfo().clientid;
          ship.postRequest("/xxq/device/reg", {
            cid: deviceId,
			userId: this.userInfo.userId,
          }).then(res => {
            console.log(deviceId, 'qwqw12')
            console.log('向后端推送设备ID')
            uni.setStorageSync('pushFlag', 10)
          })
        }
        //  console.log('switch1 发生 change 事件，携带值为', e.target.value)
      },
    }
  }
</script>

<style lang="scss">
  .otherSettings {
    .newHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 100rpx 20rpx 14rpx 20rpx;
      background-color: #FFF;

      .pageTitle {
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-size: 36rpx;
        color: #000;
      }

      .headerSaveBtn {
        height: 60rpx;
        line-height: 60rpx;
        font-size: 28rpx;
        color: #000;
      }
    }

    .itemView {
      background: white;
      display: flex;
      align-items: center;

      .leftIcon {
        flex: 0 0 100rpx;
        display: flex;
        justify-content: center;
      }

      .icon {
        height: 40rpx;
        width: 40rpx;
      }

      .icon1 {
        height: 32rpx;
        width: 34rpx;
      }

      .rightMsgBox {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 30rpx;
        height: 120rpx;

        text {
          color: #666666;
          font-size: 32rpx;
        }

        image {
          height: 30rpx;
          width: 30rpx;
        }
      }
    }

    .operation {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 88rpx;
      line-height: 88rpx;
      background-color: #FFF;
      color: #666666;
      font-size: 32rpx;
      text-align: center;
    }
  }
</style>