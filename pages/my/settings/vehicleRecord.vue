<template>
  <view class="otherSettings">
    <view class="itemView">
      <view class="leftIcon">
        <image src="../../../static/images/freezeicon.png" class="icon1"></image>
      </view>
      <view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
        打开电池优化
        <text class="setting_btn" v-if="!isIgnoring" @click="openPower">快速设置</text>
        <text class="setting_btn" v-else>已设置</text>
      </view>
    </view>
    <!-- <view class="itemView">
      <view class="leftIcon">
        <image src="../../../static/images/freezeicon.png" class="icon1"></image>
      </view>
      <view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
        允许后台访问位置
        <text class="setting_btn" @click="openBackgroundPower">快速设置</text>
      </view>
    </view>
   <view class="itemView">
      <view class="leftIcon">
        <image src="../../../static/images/freezeicon.png" class="icon1"></image>
      </view>
      <view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
        开启后台获取位置
        <text class="setting_btn" @click="open">快速设置</text>
      </view>
    </view> -->
    <view class="itemView">
      <view class="leftIcon">
        <image src="../../../static/images/freezeicon.png" class="icon1"></image>
      </view>
      <view class="rightMsgBox" style="border-bottom: 1rpx solid #DDDDDD;">
        后台运行设置
        <text class="setting_btn" @click="setDialog">快速设置</text>
      </view>
    </view>
    <view class="live_img" v-if="showImg">
      <view class="box" v-if="phoneBrand == 'HUAWEI'">
        <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/app_live_gif/huawei.GIF" class="model_gif"></image>
        <view class="toast">一: 在自动管理中找到货运中国, 管理选项并关闭自动</view>
        <view class="toast" style="margin-bottom: 30rpx">二: 在弹出的弹窗中代开【允许自动启动】和【允许后台活动】权限, 确认即可</view>
        <view class="setting_btn" @click="closeDialog">快速设置</view>
      </view>
      <view class="box" v-else-if="phoneBrand == 'Xiaomi'">
        <image style="width: 400rpx;height:820rpx"
          src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/app_live_gif/xiaomi.GIF" class="model_gif"></image>
        <view class="toast">一: 在【设置】- 【应用管理】找到货运中国, 开启自启动</view>
        <view class="toast" style="margin-bottom: 30rpx">二: 在【省点策略】中选择【无限制】</view>
        <view class="setting_btn" @click="closeDialog">快速设置</view>
      </view>
      <view class="box" v-else-if="phoneBrand == 'OPPO'">
        <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/app_live_gif/oppo.GIF" class="model_gif"></image>
        <view class="toast" style="margin-bottom: 30rpx">一: 在【应用耗电管理】中找到货运中国, 开启 【允许后台活动】和【允许应用自启动】</view>
        <view class="setting_btn" @click="closeDialog">快速设置</view>
      </view>
      <view class="box" v-else-if="phoneBrand == 'vivo'">
        <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/app_live_gif/vivo.GIF" class="model_gif"></image>
        <view class="toast">一: 在自启动中找到货运中国, 开启后台启动即可</view>
        <view class="toast" style="margin-bottom: 30rpx">二: 在【电池管理】-【后台高耗电】找到货运中国, 点击允许后台高耗电即可</view>
        <view class="setting_btn" @click="closeDialog">快速设置</view>
      </view>
    </view>
  </view>
</template>

<script>
  // const hgService = uni.requireNativePlugin("HG-Background");
  const serviceLive = uni.requireNativePlugin("PhotoModule");
  var wxp_Amap = uni.requireNativePlugin("AMapModule");
  import * as service from "@/utils/service";
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
        phoneBrand: '',
        showImg: false,
        isIgnoring: false,
      }
    },
    onLoad() {
      var that = this;
      uni.getSystemInfo({
        success(res) {
          that.phoneBrand = res.brand
          console.log(res.brand) //手机牌子
          console.log(res.model) //手机型号
          console.log(res.screenWidth) //屏幕宽度
          console.log(res.screenHeight) //屏幕高度
        }
      });
      serviceLive.isIgnoringBatteryOptimizations(res => {
        that.isIgnoring = res.isIgnoring
      })

    },
    methods: {
      open() {
        wxp_Amap.start({ // {} 大括号内参数说明见下方
          setInterval: 300000, // 定位间隔，单位 ms，				 
          //300000 5分钟，	 1800000 30分钟， 	1200000 20分钟
          cacheEnable: true // 是否允许缓存，默认为true，既当位置不变时返回最后一次定位的地址，不是必须的
        }, res => {
          // 处理回调结果
          // result 为回调结果 见下方 start() 回调结果
          console.log(res);
          var userInfo = uni.getStorageSync("userInfo");
          // console.log('执行定位保存');
          userInfo = JSON.parse(userInfo);
          var userId = userInfo.userId;
		  var userCode = userInfo.attrs.userCode;
          var data = {
            latitude: res.lat,
            longitude: res.lng,
            userId: userId,
            address: res.address,
            provinceName: res.province,
            provinceCode: '',
            cityName: res.city,
            cityCode: '',
            areaName: res.district,
            areaCode: '',
            commonHtmlTitle: '实时上报定位',
			userCode: userCode
          };
		  
          ship.newRegisterPostRequest('/cd/user/location/save', data)
            .then(res => { 

            })
            .catch(err => {
              console.log(err)
            })
        })
      },
      openBackgroundPower() {
        let that = this
        serviceLive.getBackgroundLocationPower()
      },
      closeDialog() {
        let that = this
        that.showImg = false
        var main = plus.android.runtimeMainActivity(); //获取activity  
        var Intent = plus.android.importClass('android.content.Intent');
        var Settings = plus.android.importClass('android.provider.Settings');
        var intent = new Intent(Settings.ACTION_SETTINGS); //可设置表中所有Action字段  
        main.startActivity(intent);
      },
      setDialog() {
        let that = this
        that.showImg = true
      },
      openPower() {
        let that = this
        serviceLive.requestIgnoreBatteryOptimizations()
        setTimeout(() => {
          serviceLive.isIgnoringBatteryOptimizations(res => {
            that.isIgnoring = res.isIgnoring
          })
        }, 2000);

      },
      switch1Change(e) {
        // var main = plus.android.runtimeMainActivity(); //获取activity  
        // var powerManager = plus.android.importClass("android.os.PowerManager");
        // var power = new powerManager()
        // console.log(main.getPackageName())
        // console.log(power.isIgnoringBatteryOptimizations)
        // console.log(power.isIgnoringBatteryOptimizations(main.getPackageName()))
        // console.log(power)
        // var res = power.isIgnoringBatteryOptimizations(main.getPackageName())
        // console.log(res)
        // intent.setAction('android.settings.APPLICATION_DETAILS_SETTINGS');
        // console.log(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
        // console.log(Settings)
        // ACTION_APPLICATION_DETAILS_SETTINGS 系统详情
        // ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS
        // var uri = Uri.fromParts("package", main.getPackageName(), null);
        // var uri = Uri.parse("package:" + main.getPackageName())
        // intent.setData(uri);
        // main.startActivity(intent);
        // console.log('跳转')

        // var powerManager = plus.android.importClass("android.os.PowerManager");
        // // console.log(powerManager)
        // var main = plus.android.runtimeMainActivity(); //获取activity
        // var pkName = main.getPackageName();
        // var Uri = plus.android.importClass("android.net.Uri");
        // var Intent = plus.android.importClass('android.content.Intent');
        // var Settings = plus.android.importClass("android.provider.Settings");
        // var intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
        // intent.setData(Uri.parse("package:" + pkName));
        // // let power = powerManager.isIgnoringBatteryOptimizations(pkName)
        // // console.log(intent)
        // main.startActivity(intent);


        return
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
        //     var intent = new Intent('android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS');
        // // IGNORE_BATTERY_OPTIMIZATION_SETTINGS 电池优化

        //     intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
        //   } else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
        //     var intent = new Intent('android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS');
        //       intent.putExtra("app_package", pkName);
        //     intent.putExtra("app_uid", uid);
        //   } else { //(<21)其他--跳转到该应用管理的详情页  
        //     intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        //     var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
        //     intent.setData(uri);
        //   }
        //     // 跳转到该应用的系统通知设置页  
        //   main.startActivity(intent);
      },
    }
  }
</script>

<style lang="scss">
  .otherSettings {
    .live_img {
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;

      .box {
        margin-top: -190rpx;
        background: #FFFFFF;
        width: 78vw;
        border-radius: 20rpx;
        text-align: center;
        padding-top: 48rpx;
        padding-bottom: 48rpx;

        .model_gif {
          width: 400rpx;
          height: 430rpx;
        }

        .toast {
          letter-spacing: 3rpx;
          line-height: 30rpx;
          width: 78vw;
          text-align: left;
          font-size: 26rpx;
          padding: 24rpx 50rpx 0 50rpx;
          box-sizing: border-box;
        }

        .setting_btn {
          margin: 0 auto;
          width: 200rpx;
          padding: 15rpx 10rpx;
          border-radius: 10rpx;
          color: #fff;
          background: #02bc71;
        }

      }

    }

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

        .setting_btn {
          padding: 15rpx 10rpx;
          border-radius: 10rpx;
          color: #fff;
          background: #02bc71;
        }

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