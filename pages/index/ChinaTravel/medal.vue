<template>
  <view class="container">
    <view class="header">
      <image class="arrow" @click="goBack" src="../../../static/images/ChinaTravel/arrow_bg.png"></image>
      <view class="earth" @click="goMap">
        <image src="../../../static/images/ChinaTravel/earth.png"></image>
        <view>您共点亮{{allCountNum}}个城市</view>
      </view>
      <view class="rule" @click="share">分享</view>
    </view>
    <view class="user_content">
      <view class="top">
        <view class="user_info">
          <view class="left">
            <view class="left_num">{{allCountList.length}} 个</view>
            <view class="left_name">勋章</view>
          </view>
          <view class="middle">
            <view class="bg"></view>
            <image :src="avatar"></image>
            <view class="go_light" v-if="ChinaTravelObj.show && isMy == 1" @click="goBtnChinaTravel">去点亮</view>
          </view>
          <view class="right">
            <view class="left_num">{{allCountNum}} 个</view>
            <view class="left_name">区县</view>
          </view>
        </view>
      </view>
      <view class="bottom">{{userName}}</view>
    </view>
    <scroll-view :scroll-y="true" lower-threshold="30" :style="{height: contentHeight - 50 + 'px'}"
      @scrolltolower="getList">
      <view class="user_medal">
        <view class="user_medal_item" v-for="(item,index) in allCountList" :key="index">
          <view class="image_container">
            <image class="circle" src="../../../static/images/ChinaTravel/light_card.png"></image>
            <image class="circle_card" :src="item.image"></image>
          </view>
          <view class="medal_title">{{item.provinceName}}</view>
          <view class="medal_details">全市{{item.countyCount}}个区县</view>
          <view class="medal_details">已点亮<text>{{item.countNumber}}</text>个</view>
        </view>
      </view>
    </scroll-view>
	<view class="toWxApplet" @longtap="toWxApplet">
		<view class="bgRadius"></view>
		<view class="wxCode" :style="{opacity: isQrShow ? 1 : 0}">
			<u-qrcode 
				ref="qrcode" 
				canvas-id="qrcode" 
				:value="uQRCode"
				:size="qrSize"
				:options="qrOptions"
				@complete="wxComplete($event)"
			></u-qrcode>
		</view>
		<view class="wx_content">
			<view>长按识别二维码,领取卡友专属福利</view>
		</view>
		
	</view>
    <view class="share_container" :style="{'bottom': isShare ? '30rpx' : '-610rpx'}">
      <view class="share_content">
        <view class="share_title">分享到</view>
        <view class="share_to">
          <view class="share_item">
            <image class="share_img" @click="shareEvent('WXSceneSession')"
              src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/weChat.png"></image>
            <view class="share_text">微信好友</view>
          </view>
          <view class="share_item">
            <image class="share_img" @click="shareEvent('WXSenceTimeline')"
              src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/circleFriends.png"></image>
            <view class="share_text">朋友圈</view>
          </view>
        </view>
        <view class="share_line"></view>
        <view class="share_to">
          <view class="share_item">
            <image class="share_img" @click="saveImageToPhotosAlbumTap"
              src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/saveImg.png"></image>
            <view class="share_text">保存到手机</view>
          </view>
        </view>
        <view class="share_line"></view>
        <view class="cancel" @click="shareCancel">取消</view>
      </view>
    </view>
    <canvas v-if="isCanvas" canvas-id="imgCanvasChinaTravel"
      style="width: 375px;top: 0; left: 0; height: 812px; position: absolute; z-index: -10;opacity: 0;">
      <view class="canvas-text"></view>
    </canvas>
    <canvas v-if="isAvatar" canvas-id="myCanvas"
      style="width: 100px;top: 0; bottom: 0; height: 100px; position: absolute; z-index: -10;opacity: 0;">
      <view class="canvas-text"></view>
    </canvas>
	<canvas id="qrImgCanvasChinaTravel" canvas-id="qrImgCanvasChinaTravel"
	  style="width: 80px;bottom: 30px; height: 80px;right:30px; position: absolute; z-index: -10;opacity: 0;">
	  <view class="canvas-text"></view>
	</canvas>
  </view>
</template>
<script>
  import * as service from "../../../utils/ship";
  import QRCode from '@/config/qrcode';
  import { pathToBase64, base64ToPath } from '@/js_sdk/mmmm-image-tools/index.js';
  import uQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/u-qrcode';
  import {WX_ORIGIN_ID} from "@/utils/baseUrl.js"
  export default {
	  components: {
		  uQRCode,
	  },
    data() {
      return {
		isQrShow: false,
		qrSize: 80,
		uQRCode: '',
		qrOptions: null,
        systemWidth: 0,
        systemHeight: 0,
        contentHeight: 0,
        allCountList: [],
        allCountNum: 0,
        isShare: false,
        isCanvas: false,
        isAvatar: false,
        userCode: "",
        userName: "",
        avatar: "",
        isGoBack: true,
        imgUrl: "",
        avatarImageUrl: "",
        ChinaTravelObj: { // 中国行对象
          address: {}, // 地址
          show: false, // 是否有活动
          ChinaTravelInfo: {}, // 活动信息
        },
        isMy: 0,
        info: null,
		    qrCodeImgPath: "",
      }
    },
    onLoad(option) {
      let that = this
      if (option.isMy) {
        that.isMy = option.isMy
      }
      let userInfo = uni.getStorageSync("userInfo");
      that.getChinaTravel()
      that.userCode = JSON.parse(userInfo).attrs.userCode;
      that.userName = JSON.parse(userInfo).userName;
	  
	  var mobile = JSON.parse(userInfo).mobile;
	  var usercode = JSON.parse(userInfo).attrs.userCode;
	  var qrValue = "https://m.hyzgapp.com/code/JYwechat?mobile=" + mobile +"&shareCode=" + usercode;
	  that.uQRCode = qrValue;
      that.avatar = JSON.parse(userInfo).attrs.avatar ? JSON.parse(userInfo).attrs.avatar :
        'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'
      that.qrOptions = {
		  text: uQRCode,
		  size: 80,
		  foreground: {
			  image: {
				  src: "/static/images/ship/appLogo.png",
			  }
		  }
		};
	  uni.getSystemInfo({
        success: function (res) {
          that.systemWidth = res.screenWidth;
          that.systemHeight = res.screenHeight;
          that.initData()
        }
      });
    },
	onShow(){
		let that = this
		setTimeout(() => {
			if(!that.allCountList.length){
				that.getList()
			}
		},3000)
	},
    // onBackPress() {
    //   let that = this
    //   // 强制更新不允许返回
    //   if (that.isGoBack) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    onReady() {
      let that = this
      that.initVh()
      uni.getSystemInfo({
        success: function (res) {
          that.systemWidth = res.screenWidth;
          that.systemHeight = res.screenHeight;
        }
      });
    },
    methods: {
		wxComplete(e) {
			console.log(e, 'as');
			if (e.success) {
				this.isQrShow = true;
			} else {
				this.isQrShow = false;
			}
		},
		//app长按跳转小程序
		toWxApplet() {
			console.log("长按121");
			var that = this;
			let userInfo = uni.getStorageSync("userInfo");
			var mobile = JSON.parse(userInfo).mobile;
			var usercode = JSON.parse(userInfo).attrs.userCode;
			var qrValue = "pages/index/releaseVehicle/releaseVehicle";
			plus.share.getServices(res => {
				console.log(res, '服务')
				this.sweixin = res.find(i => i.id === 'weixin')
				if (this.sweixin) {
					// 跳转到微信小程序
					this.sweixin.launchMiniProgram({
						id: WX_ORIGIN_ID, // 	关联微信小程序的原始ID（"g_"开头的字符串）
						path: qrValue, //	打开小程序的页面路径，不传默认跳转首页
						type: 0 // 	微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
					}, res => {
						console.log('成功唤起微信小程序');
					}, err => {
						console.log('失败');
					})
				} else {
					// 没有获取到微信分享服务
				}
			}, err => {
				// 获取分享服务列表失败
			});
		},
      // 判断是否有中国行活动
      async getChinaTravel() {
        let that = this
        let TravelRes = await service.newRegisterPostRequest("/dlzg/lightenchina/getgame", {})
        if (TravelRes.rspBody) {
          that.ChinaTravelObj.show = true
          that.ChinaTravelObj.ChinaTravelInfo = TravelRes.rspBody
          that.info = that.ChinaTravelObj
          console.log("获取用户位置信息")
          await that.getChinaTravelLocation()
        } else {
          that.ChinaTravelObj.show = false
          that.ChinaTravelObj.ChinaTravelInfo = {}
        }
        console.log("中国行活动标识", that.ChinaTravelObj)

      },
      // 中国行获取定位
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
      // 按钮跳转到点亮中国行页面
      async goBtnChinaTravel() {
        let that = this
        if (!service.btnRepeat()) return false; // 防抖
        // if (!that.isThreeAuth()) {
        //   return false
        // }
        let info = that.ChinaTravelObj
        let loactionFlag = await that.getChinaTravelLocation()
        if (!loactionFlag) {
          return
        }
        console.log(info)
        let userInfo = uni.getStorageSync("userInfo");
        let userCode = JSON.parse(userInfo).attrs.userCode;
        let data = {
          userCode: userCode, // 卡友号码
          gameId: info.ChinaTravelInfo.sid, // 活动ID
          latitude: info.address.latitude, // 经纬度
          longitude: info.address.longitude,
          province: info.address.province, // 省市区
          city: info.address.city,
          county: info.address.district
        }
        let res = await service.newRegisterPostRequest("/dlzg/lightenchina/getgame", {
          province: info.address.province
        })
        res.rspBody.province = info.address.province
        res.rspBody.city = info.address.city
        res.rspBody.county = info.address.district
        res.rspBody.image = res.rspBody.medalImage
        res.rspBody.data = data
        uni.navigateTo({
          url: '../../index/ChinaTravel/index?info=' + JSON.stringify(res.rspBody)
        })
      },
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
      // 取消分享
      shareCancel() {
        let that = this
        that.isShare = false
      },
      // 保存到手机
      async saveImageToPhotosAlbumTap() {
        let that = this;
        that.isShare = false;
        uni.showLoading({
          title: ''
        });
		    // await that.createQrcode()
			await that.createQrCodeImg();
        await that.handleAvatar()
        await that.generate()
        console.log('图片生成了')
        uni.saveImageToPhotosAlbum({
          filePath: that.imgUrl,
          success: function () {
            console.log('save success');

            uni.showToast({
              title: '保存成功',
              icon: 'success'
            })
          }
        });
      },
      // 点击分享
      share() {
        let that = this
        that.isShare = true
      },
      // 分享朋友圈
      async shareEvent(type) {
        let that = this;
        that.isShare = false;
        uni.showLoading({
          title: ''
        });
		    // await that.createQrcode()
			await that.createQrCodeImg();
        await that.handleAvatar()
        await that.generate()
        console.log('图片生成了')
        uni.share({
          provider: "weixin",
          scene: type,
          type: 2,
          imageUrl: that.imgUrl,
          success: function (res) {
            // uni.hideLoading()
            console.log("success:" + JSON.stringify(res));
          },
          fail: function (err) {
            console.log("fail:" + JSON.stringify(err));
          }
        });
      },
      // 获取打卡所有数
      async getAllCount() {
        let that = this
        let data = {
          userCode: that.userCode
        }
        let res = await service.newRegisterPostRequest("/dlzg/lightenchina/countProvince", data)
        console.log("获取所有打卡数")
        console.log(res)
        if (res.retCode == "0000000") {
          that.allCountList = res.rspBody
          console.log(res.rspBody)
          that.allCountList.forEach(item => {
            that.allCountNum += item.countNumber
          })
        }
      },
      // 初始化数据
      async initData() {
        let that = this
        that.getAllCount()
        that.getList()
      },
      goMap() {
        let that = this
        if (!service.btnRepeat()) return false; // 防抖
        if (that.allCountNumber <= 0) {
          uni.showToast({
            title: '您暂无点亮城市',
            duration: 2000
          });
          return
        }
        uni.navigateTo({
          url: './map'
        })
      },
      // 返回首页
      goBack() {
        let that = this
        console.log('返回上一级')
        // uni.switchTab({
        //   url: '/pages/ship/index/index1'
        // })
        uni.navigateBack();
      },
      async initVh() {
        let that = this
        let headerVh = await that.getViewHW('.header')
        let userInfoVh = await that.getViewHW('.user_content')
        console.log(that.systemHeight)
        that.contentHeight = that.systemHeight - headerVh.height - userInfoVh.height
        console.log(headerVh, userInfoVh)
        console.log(that.contentHeight)
      },
      async getList() {
        let that = this
        console.log("123123123")
      },
      // 获取元素宽高
      getViewHW(val) {
        let that = this
        let info = uni.createSelectorQuery().in(this).select(val);
        return new Promise((resolve, reject) => {
          info.boundingClientRect((data) => {
            let vhObj = {
              width: data.width,
              height: data.height
            }
            console.log(data)
            resolve(vhObj)
          }).exec(function (res) {
            // 注意：exec方法必须执行，即便什么也不做，否则不会获取到任何数据
          })
        })
      },
      handleAvatar() {
        let that = this
        that.isAvatar = true
        return new Promise((resolve) => {
          //先获取你的canvas 
          setTimeout(() => {
            let ctx = uni.createCanvasContext('myCanvas', this);
            ctx.save();
            ctx.beginPath(); //开始绘制
            //先画个圆   x,y是圆心的(x,y） 坐标 r是圆的半径 第四个参数是起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）  第五个参数是结束角，以弧度计  最后是绘图方向  默认是false，即顺时针
            ctx.arc(50, 50, 50, 0, Math.PI * 2, false);
            ctx.clip(); //画好了圆 开始剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
            // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
            //path 是用uni.getImageInfo 获取的地址
            ctx.drawImage(that.avatar, 0,
              0,
              100,
              100); // 推进去图片，必须是https图片
            ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制

            ctx.draw(true, (ret) => { // draw方法 把以上内容画到 canvas 中。
              uni.canvasToTempFilePath({ // 保存canvas为图片
                canvasId: 'myCanvas',
                quality: 1,
                complete: res => {
                  that.avatarImageUrl = res.tempFilePath
                  that.isAvatar = false
                  console.log("头像已经生成")
                  resolve()
                  // 在H5平台下，tempFilePath 为 base64, // 图片提示跨域 H5保存base64失败，APP端正常输出临时路径
                  //this.bg_Url = res.tempFilePath
                },
              })
            })
          }, 500)
        });
      },
      generate() {
        var that = this;
        that.isCanvas = true
        return new Promise((resolve) => {
          console.log("开始绘制图片")
          setTimeout(() => {
            console.log("开始绘制图片-1")
            const ctx = uni.createCanvasContext('imgCanvasChinaTravel');
            ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ChinaTravel_image/ChinaTravel_bg_1.png',
              0, 0,
              375, 812);
            ctx.restore()
            console.log("开始绘制图片-2")
            ctx.drawImage(that.avatarImageUrl, 157, 44, 60, 60);
            ctx.restore()
            console.log("开始绘制图片-3")
            ctx.setFillStyle('#FFFFFF')
            ctx.setFontSize(20)
            ctx.fillText(that.allCountList.length + " 个", 53, 70)
            ctx.fillText(that.allCountNum + " 个", 276, 70)
            ctx.restore()
            console.log("开始绘制图片-4")
            ctx.setFillStyle('#FFC0A0')
            ctx.setFontSize(16);
            ctx.setTextAlign('center');
            ctx.fillText(that.userName, 187.5, 130)
            ctx.restore()
            let dataList = that.allCountList.slice(0, 9)
            let dataListLength = dataList.length
            console.log("开始绘制图片-5")
            if (dataListLength > 0) {
              let i = 0
              for (let j = 0; j < 3; j++) {
                if (dataList[j]) {
                  const item = dataList[j];
                  ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ChinaTravel_image/light_card.png',
                    28 +
                    i *
                    125,
                    166, 75, 75);
                  ctx.restore()
                  ctx.drawImage(item.image, 20.5 + i * 125,
                    181, 90, 58);
                  ctx.restore()
                  ctx.setFillStyle('#FFFFFF')
                  ctx.setFontSize(12);
                  ctx.setTextAlign('center');
                  ctx.fillText(item.provinceName, 67.5 + i * 125, 255)
                  ctx.restore()
                  ctx.setFillStyle('#FF96A0')
                  ctx.setFontSize(11);
                  ctx.setTextAlign('center');
                  ctx.fillText(`全市${item.countyCount}个区县`, 67.5 + i * 125, 268 + 5)
                  ctx.fillText(`已点亮${item.countNumber}个`, 67.5 + i * 125, 281 + 5)
                  ctx.restore()
                  i++
                }
              }
            }
            if (dataListLength > 3) {
              let i = 0
              for (let j = 3; j < 6; j++) {
                if (dataList[j]) {
                  const item = dataList[j];
                  ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ChinaTravel_image/light_card.png',
                    28 +
                    i *
                    125,
                    312, 75, 75);
                  ctx.restore()
                  ctx.drawImage(item.image, 20.5 + i * 125,
                    327, 90, 58);
                  ctx.restore()
                  ctx.setFillStyle('#FFFFFF')
                  ctx.setFontSize(12);
                  ctx.setTextAlign('center');
                  ctx.fillText(item.provinceName, 67.5 + i * 125, 401)
                  ctx.restore()
                  ctx.setFillStyle('#FF96A0')
                  ctx.setFontSize(11);
                  ctx.setTextAlign('center');
                  ctx.fillText(`全市${item.countyCount}个区县`, 67.5 + i * 125, 414 + 5)
                  ctx.fillText(`已点亮${item.countNumber}个`, 67.5 + i * 125, 427 + 5)
                  ctx.restore()
                  i++
                }

              }
            }
            if (dataListLength > 6) {
              let i = 0
              for (let j = 6; j < dataList.length; j++) {
                if (dataList[j]) {
                  const item = dataList[j];
                  ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ChinaTravel_image/light_card.png',
                    28 +
                    i *
                    125,
                    458, 75, 75);
                  ctx.restore()
                  ctx.drawImage(item.image, 20.5 + i * 125,
                    473, 90, 58);
                  ctx.restore()
                  ctx.setFillStyle('#FFFFFF')
                  ctx.setFontSize(12);
                  ctx.setTextAlign('center');
                  ctx.fillText(item.provinceName, 67.5 + i * 125, 547)
                  ctx.restore()
                  ctx.setFillStyle('#FF96A0')
                  ctx.setFontSize(11);
                  ctx.setTextAlign('center');
                  ctx.fillText(`全市${item.countyCount}个区县`, 67.5 + i * 125, 560 + 5)
                  ctx.fillText(`已点亮${item.countNumber}个`, 67.5 + i * 125, 573 + 5)
                  ctx.restore()
                  i++
                }

              }
            }
        ctx.drawImage(that.qrCodeImgPath, 137.5,
          600, 100, 100);
        ctx.restore()
			  console.log("图片绘制完成")
			  ctx.draw(true, () => {
				uni.canvasToTempFilePath({
				  canvasId: 'imgCanvasChinaTravel',
				  // fileType: 'png',
				  // x: 0,
				  // y: 0,
				  // width: 300,
				  // height: 300,
				  // destWidth: 300,
				  // quality: 1,
				  success: function (res) {
					that.imgUrl = res.tempFilePath;
					that.isCanvas = false
					uni.hideLoading()
					resolve()
				  },
				  fail: function (error) {
					uni.hideLoading();
					console.log(error)
				  },
				})
			  })
           
          }, 500)
        })
      },
      async createQrcode() {
        let that = this;
        let userInfo = JSON.parse(uni.getStorageSync("userInfo"));
        console.log(userInfo)
        let url = `https://m.hyzgapp.com/code/JYwechat?mobile=${userInfo.mobile}&shareCode=${userInfo.attrs.userCode}`
            let res = await base64ToPath(QRCode.createQrCodeImg(encodeURI(url)))
        that.qrCodeImgPath = res
        return res
      },
	  async createQrCodeImg() {
		  var that = this;
		   const ctxImg = uni.createCanvasContext('qrImgCanvasChinaTravel');
		   //二维码生成
		   var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
		   var mobile = userInfo.mobile;
		   var usercode = userInfo.attrs.userCode;
		   var qrValue = "https://m.hyzgapp.com/code/JYwechat?mobile=" + mobile +"&shareCode=" + usercode;
		   const uqrcode = new uQRCode(
		         {
		           text: qrValue,
		   				  size: 80,
		   				  foreground: {
		   					  image: {
		   						  src: "/static/images/ship/appLogo.png",
		   					  }
		   
		   				  }
		         },
		         ctxImg
		       );
		       uqrcode.make();
		       uqrcode.draw();
			   setTimeout(() => {
					uni.canvasToTempFilePath({
			   		  canvasId: 'qrImgCanvasChinaTravel',
			   		  width: 80,
			   		  height: 80,
			   		  success: res => {
			   			console.log(res, '转哈');
			   			var tempFilePath = res.tempFilePath;
						that.qrCodeImgPath = tempFilePath;
			   		  },
			   		  fail: err => {
			   			
			   		  },
			   		  complete: () => {
			   			
			   		  }
			   		});
			   }, 500)  
		   		
	  }
    },
  }
</script>
<style lang="scss" scoped>
  .container {
    width: 100vw;
    height: 100vh;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    background: linear-gradient(180deg, #FF8600 0%, #D61023 100%);

	.toWxApplet {
		position: fixed;
		bottom: 0;
		width: 100vw;
		background-color: #FFFFFF;
		z-index: 2;
		.bgRadius {
			margin-top: -90rpx;
			width: 100vw;
			height: 100rpx;
			border: 1px solid #2B72F0;
			border-radius: 0 0 45% 45%/0 0 75% 75%;
			border-top: none;
			background-color: #2B72F0;
			transform: rotate(180deg);
		}
		
		.wxCode {
			position: fixed;
			bottom: 210rpx;
			left: 50%;
			margin-left: -80rpx;
			z-index: 2;
		}
		.wx_content {
			width: 100vw;
			height: 200rpx;
			background-color: #2B72F0;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
		}
		
	}
    .header {
      // position: absolute;
      // top: 0;
      // left: 0;
      // z-index: 9999;
      height: 210rpx;
      width: 100vw;
      padding: 130rpx 40rpx 80rpx 40rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .earth {
        width: 362rpx;
        height: 68rpx;
        background: rgba(51, 51, 51, 0.59);
        border-radius: 42px;
        display: flex;
        padding: 0 20rpx;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;

        image {
          width: 48rpx;
          height: 48rpx;
        }

        view {
          margin-left: 10rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
          font-size: 26rpx;
        }
      }

      .rule {
        font-size: 26rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
      }

      .arrow {
        width: 64rpx;
        height: 64rpx;
      }
    }

    .user_content {
      text-align: center;

      .top {
        .user_info {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 104rpx;
          box-sizing: border-box;
        }

        .left_num {
          font-size: 40rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
        }

        .left_name {
          padding-top: 10rpx;
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FF939D;
          line-height: 36rpx;
        }

        .middle {
          width: 144rpx;
          height: 144rpx;
          position: relative;

          .bg {
            width: 144rpx;
            height: 144rpx;
            background: #FFF571;
            border-radius: 50%;
            filter: blur(9rpx);
          }

          image {
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 50%;
            border: 4rpx solid #FFFFFF;
            transform: translate(-50%, -50%);
            width: 120rpx;
            height: 120rpx;
          }

          .go_light {
            position: absolute;
            width: 132rpx;
            height: 48rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            left: 50%;
            transform: translate(-50%, 0);
            bottom: -16rpx;
            background: #FFFFFF;
            box-shadow: 0px 4rpx 12rpx 0px #F9BB49;
            border-radius: 24rpx;
            font-size: 26rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #EF590E;
          }
        }

        .left {}
      }

      .bottom {
        padding: 24rpx 0;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFC0A0;
      }
    }

    .user_medal {
      display: flex;
      flex-wrap: wrap;
      width: 100vw;

      .user_medal_item {
        margin-top: 24rpx;
        width: 33.33vw;
        text-align: center;

        .medal_title {
          font-size: 24rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 34rpx;
        }

        .medal_details {
          font-size: 22rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FF96A0;
          line-height: 32rpx;

          text {
            color: #FFEBBD;
          }
        }

        .image_container {
          margin: 0 auto;
          width: 150rpx;
          height: 180rpx;
          position: relative;

          .circle {
            position: absolute;
            width: 150rpx;
            height: 150rpx;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
          }

          .circle_card {
            position: absolute;
            width: 180rpx;
            height: 116rpx;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
          }
        }


      }
    }

    .share_container {
      position: fixed;
      left: 0;
      // bottom: 30rpx;
      bottom: -610rpx;
      transition: bottom 0.4s;
      padding: 0 24rpx;
      width: 100vw;
      box-sizing: border-box;
      height: 556rpx;
		z-index: 3;
      .share_content {
        height: 556rpx;
        width: 100%;
        box-sizing: border-box;
        padding: 30rpx 40rpx;
        border-radius: 40rpx;
        background: #FFFFFF;

        .share_title {
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 40rpx;


        }

        .share_to {
          display: flex;
          margin-top: 20rpx;
          margin-left: 10rpx;

          .share_item {
            text-align: center;
            margin-right: 70rpx;

            .share_img {
              width: 88rpx;
              height: 88rpx;
            }

            .share_text {
              font-size: 22rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 32rpx;
            }
          }
        }

        .share_line {
          margin: 30rpx 0;
          height: 1px;
          width: 100%;
          background: #F6F6F6;
        }

        .cancel {
          margin-top: 40rpx;
          text-align: center;
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 44rpx;
        }
      }
    }
  }
</style>