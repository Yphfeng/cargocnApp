<template>
  <view class="container" v-if="info">
    <view class="header">
      <image class="arrow" @click="goBack" src="../../../static/images/ChinaTravel/arrow_bg.png"></image>
      <view class="earth" @click="goMap">
        <image src="../../../static/images/ChinaTravel/earth.png"></image>
        <view>您共点亮{{allCountNumber}}个城市</view>
      </view>
      <image class="rule" @click="previewImage(info.gameRule)" src="../../../static/images/ChinaTravel/rule.png">
      </image>
    </view>
    <image class="medal" @click="goMedal" src="../../../static/images/ChinaTravel/medal.png">
    </image>

    <view class="flipper" :class="flipTag ? 'transform_class' :''">
      <view class="front">
        <view class="front_content">
          <view class="image_container">
            <image class="circle_gray" src="../../../static/images/ChinaTravel/circle.png"></image>
            <image class="region_card" :src="info.image"></image>
          </view>
          <view class="badge_position" v-if="textLength <= 9">
            <view class="badge_text">{{info.city}}-{{info.county}}勋章</view>
          </view>
          <view class="badge_position_big" v-else>
            <view class="badge_text" v-if="textLength <=18">{{info.city}}-{{info.county}}</view>
            <view class="badge_text" v-else>{{info.county}}</view>
          </view>
          <view class="content_text">{{info.explainContent}}</view>
          <view class="bottom_icon">
            <image class="trans" @click="flipCard" src="../../../static/images/ChinaTravel/trans.png"></image>
            <view class="trans_text">— 点击翻转 点亮卡片 —</view>
          </view>
        </view>
      </view>
      <view class="back" v-if="showBack">
        <view class="back_content">
          <view class="image_container">
            <view class="light_img">
              <image class="light_img_1" src="../../../static/images/ChinaTravel/light.png"></image>
            </view>
            <image class="circle_gray" src="../../../static/images/ChinaTravel/circle.png"></image>
            <image class="region_card" :src="info.image"></image>
          </view>
          <view class="badge_position" v-if="textLength <= 9">
            <view class="badge_text">{{info.city}}-{{info.county}}勋章</view>
          </view>
          <view class="badge_position_big" v-else>
            <view class="badge_text" v-if="textLength <=18">{{info.city}}-{{info.county}}勋章</view>
            <view class="badge_text" v-else>{{info.county}}勋章</view>
          </view>
          <view class="content_text">这是您点亮的第 <text>{{info.number}}</text> 个城市勋章</view>
          <view class="content_text">您本周点亮城市 <text>{{getRegionNum}}</text> 个</view>
          <view class="light_time" :style="{'bottom': systemHeight > 680 ? '250rpx' : '150rpx'}">
            <view class="content_text_2">{{info.explainContent}}</view>
            <view class="light_up">
              <view class="light_left"></view>
              <view class="light_middle">点亮于 {{info.createDate.split(' ')[0]}}</view>
              <view class="light_right"></view>
            </view>
          </view>
          <view class="share_btn" @click="share">
            <view>嘚瑟一下</view>
          </view>
        </view>
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
      style="width: 375px;top: 0; bottom: 0; height: 812px; position: absolute; z-index: -10;opacity: 0;">
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
  import * as publicData from "@/utils/publicData.js";
  // 以下路径需根据项目实际情况填写
  import { pathToBase64, base64ToPath } from '@/js_sdk/mmmm-image-tools/index.js'
  
  import uQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/u-qrcode';
  // var bgAudioManager = uni.getBackgroundAudioManager()

  // import {
  //   pathToBase64,
  //   base64ToPath
  // } from '@/js_sdk/mmmm-image-tools/index.js'
  export default {
    data() {
      return {
        info: null,
        flipTag: false,
        isShare: false,
        imgUrl: "",
        systemWidth: 0,
        systemHeight: 0,
        isCanvas: false,
		isCanvasImg: false,
        textLength: 0, // 长度
        showBack: false,
        allCountNumber: 0,
        resArr: [],
        consoleList: [],
        latLngList: [],
		getRankNum: "",
		getRegionNum: ""
      }
    },
    onLoad(option) {
      let that = this
      that.info = JSON.parse(option.info)
      console.log(that.info)
      that.textLength = that.info.city.length + that.info.county.length + 1 + 2
      that.getAllProvince()
      uni.getSystemInfo({
        success: function (res) {
          that.systemWidth = res.screenWidth;
          that.systemHeight = res.screenHeight;
          that.isCanvas = true;
		  that.isCanvasImg = true;
          // that.generate()
        }
      });
    },
    methods: {
      getAllProvince() {
        let that = this
        var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
        service.newRegisterPostRequest("/dlzg/lightenchina/countProvince", {
          userCode: userInfo.attrs.userCode
        }).then(res => {
          let num = 0
          console.log(res)
          that.resArr = res.rspBody
          that.resArr.forEach(item => {
            num += item.countNumber
          });
          that.allCountNumber = num
        })
      },
      // 跳转到勋章墙
      goMedal() {
        uni.navigateTo({
          url: './medal'
        })
      },
      // 跳转到地图
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
      // 获取元素宽高
      getViewHW() {
        let that = this
        let info = uni.createSelectorQuery().in(this).select(".back");
        return new Promise((resolve, reject) => {
          info.boundingClientRect((data) => {
            console.log(data)
            // that.viewWidth = data.width
            // that.viewHeight = data.height
            console.log(data.width, data.height)
            console.log(that.systemWidth, that.systemHeight)
            resolve()
          }).exec(function (res) {
            // 注意：exec方法必须执行，即便什么也不做，否则不会获取到任何数据
          })
        })
      },
      // 查看图
      previewImage(url) {
        let that = this
        console.log(123123)
        var images = [url];
        console.log(images)
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
      // 取消分享
      shareCancel() {
        let that = this
        that.isShare = false
      },
      // 保存到手机
      saveImageToPhotosAlbumTap() {
        let that = this;
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
      // 点击嘚瑟一下
      share() {
        let that = this
        that.isShare = true

      },
      // 分享朋友圈
      shareEvent(type) {
        let that = this;
        that.isShare = false;
        uni.share({
          provider: "weixin",
          scene: type,
          type: 2,
          imageUrl: that.imgUrl,
          success: function (res) {
            console.log("success:" + JSON.stringify(res));
          },
          fail: function (err) {
            console.log("fail:" + JSON.stringify(err));
          }
        });
      },
      // 返回首页
      goBack() {
        let that = this
        uni.navigateBack();
      },
      // 翻转卡片
      async flipCard() {
        let that = this
        if (!service.btnRepeat()) return false; // 防抖
        console.log(that.info.gameRule)
		console.log(that.info)
        let data = that.info.data
        data.lightenDate = that.dateFormat(new Date())
		data.actSid = that.info.actSid
		console.log(data,'点亮参数')
        let res = await service.newRegisterPostRequest("/dlzg/lightenchina/lighten", data)
		// let getRankRes = await service.newRegisterPostRequest("/dlzg/lightenchina/getRank", {userCode: data.userCode,actSid: data.actSid}) 
		// that.getRankNum = getRankRes.rspBody
		let getRegionNumRes = await service.newRegisterPostRequest("/dlzg/lightenchina/getCurrentActCountyCount", {userCode: data.userCode,actSid: data.actSid})
		that.getRegionNum = getRegionNumRes.rspBody
		console.log(getRegionNumRes)
        res.rspBody.gameRule = that.info.gameRule
        that.info = res.rspBody
        that.getAllProvince()
        that.showBack = true
        that.flipTag = true
        that.generate()
      },
      generate() {
        var that = this;
        setTimeout(() => {
          const ctx = uni.createCanvasContext('imgCanvasChinaTravel');
		  const ctxImg = uni.createCanvasContext('qrImgCanvasChinaTravel');
          console.log(that.systemWidth);
          ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ChinaTravel_image/ChinaTravel_bg_2.png', 0, 0, 375, 812);
          ctx.restore()
          ctx.drawImage(that.info.image, 0, 130, 375, 243);
          ctx.restore()
          console.log(that.textLength)
          if (that.textLength > 9) {
            ctx.drawImage('../../../static/images/ChinaTravel/text_bg_big.png', 57.5, 399, 260, 82);
            ctx.restore()
            ctx.setFillStyle('#743C00')
            ctx.setFontSize(18);
            ctx.setTextAlign('center');
            let text = `${that.info.city}-${that.info.county}勋章`
            if (text.length > 18) {
              text = `${that.info.county}勋章`
            }
            let textNumber = Math.ceil(text.length / 9)
            let rowLength = 9
            for (let i = 0; i < textNumber; i++) {
              ctx.fillText(text.substring(rowLength * i, rowLength * (i + 1)), 187.5, 433 + i * 25)
            }
            ctx.restore();
            ctx.setFillStyle('#FFFFFF')
            ctx.setFontSize(18);
            ctx.setTextAlign('center');
            ctx.fillText(`这是您点亮的第 ${that.info.number} 个城市勋章`, 187.5, 515)
			ctx.fillText(`您共点亮 ${that.allCountNumber} 个城市`, 187.5, 545)
            ctx.restore();
          } else {
            ctx.drawImage('../../../static/images/ChinaTravel/text_bg.png', 82, 409, 211, 48);
            ctx.restore()
            ctx.setFillStyle('#743C00')
            ctx.setFontSize(18);
            ctx.setTextAlign('center');
            ctx.fillText(`${that.info.city}-${that.info.county}勋章`, 187.5, 439)
            ctx.restore();
            ctx.setFillStyle('#FFFFFF')
            ctx.setFontSize(18);
            ctx.setTextAlign('center');
            ctx.fillText(`这是您点亮的第 ${that.info.number} 个城市勋章`, 187.5, 485)
			ctx.fillText(`您共点亮 ${that.allCountNumber} 个城市`, 187.5, 515)
            ctx.restore();
          }
          ctx.setFillStyle('#FFDDDD')
          ctx.setFontSize(14);
          ctx.setTextAlign('center');
          let text = that.info.explainContent
          let copywritingLength = text.length
          let rowLength = 15
          let rowNumber = Math.ceil(copywritingLength / rowLength)
          for (let i = 0; i < rowNumber; i++) {
            console.log(text.substring(rowLength * i, rowLength * (i + 1)))
            ctx.fillText(text.substring(rowLength * i, rowLength * (i + 1)), 187.5, 592 + i * 20)
          }
          ctx.restore();
          ctx.beginPath()
          ctx.setStrokeStyle('#F27E7E')
          ctx.setLineWidth(1)
          ctx.moveTo(67, 656)
          ctx.lineTo(126, 656)
          ctx.moveTo(254, 656)
          ctx.lineTo(313, 656)
          ctx.stroke()
          ctx.restore();

          ctx.setFillStyle('#F27E7E')
          ctx.setFontSize(13);
          ctx.setTextAlign('center');
          ctx.fillText(`点亮于 ${that.info.createDate.split(' ')[0]} `, 192, 660)
          ctx.restore();
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
						
						ctx.drawImage(tempFilePath, 290, 730, 60, 60);
						ctx.restore();
						setTimeout(() => {
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
								  console.log(that.imgUrl);
								  that.imgUrl = res.tempFilePath;
							
								  console.log(that.imgUrl);
								  // that.uploadImg(res.tempFilePath);
								},
								fail: function (error) {
								  uni.hideLoading();
								  console.log(error)
								},
							  })
							})
						}, 500)
							
						
					  },
					  fail: err => {
						
					  },
					  complete: () => {
						
					  }
					});
			}, 500)  
			

          // ctx.fillRect(0, that.systemHeight - 110, that.systemWidth, that.systemHeight)
          // ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/ChninaTravelQrCode.png', that.systemWidth -
          //   88, that.systemHeight - 110 + 23, 64, 64);
          // ctx.restore();
          // ctx.setLineWidth(10);
          // ctx.setTextAlign('center');
          // ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/shareContent.png', (that.systemWidth -
          //   301) / 2, canvasHeight, 301, 400);
          // ctx.setFillStyle("#0171F9");
          // ctx.setFontSize(17);
          // var name = that.info.name;
          // ctx.fillText(name, that.systemWidth / 2, canvasHeight + 62);
          // ctx.setFillStyle("#333333");
          // ctx.setFontSize(17);
          // var shareCode = '车队号：' + that.info.code;
          // ctx.fillText(shareCode, that.systemWidth / 2, canvasHeight + 98);
          // //画二维码
          // ctx.drawImage(that.qrImg, (that.systemWidth - 206) / 2, canvasHeight + 140, 206, 206);
          // ctx.setFontSize(15);
         
        }, 500)
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
    }
  }
</script>

<style lang="scss" scoped>
  @keyframes rotateImg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .container {
    perspective: 1000;
    width: 100vw;
    height: 100vh;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    background-image: url('../../../static/images/ChinaTravel/all_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    // opacity: 0;
    .medal {
      position: fixed;
      right: 40rpx;
      top: 200rpx;
      width: 82rpx;
      height: 76rpx;
      z-index: 9999;
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

    .header {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999;
      height: 270rpx;
      width: 100vw;
      padding: 100rpx 40rpx;
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
        width: 82rpx;
        height: 76rpx;
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

    .flipper {
      transition: 0.6s;
      transform-style: preserve-3d;
      position: relative;
      width: 100vw;
      height: 100vh;

      .front {
        width: 100vw;
        height: 100vh;
        backface-visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;

        .front_content {
          padding-top: 150rpx;
          box-sizing: border-box;
          width: 100vw;
          height: 100vh;
          text-align: center;
          position: relative;

          .image_container {
            position: relative;
            margin: 0 auto;
            width: 556rpx;
            height: 556rpx;

            .circle_gray {
              position: absolute;
              left: 0;
              top: 0;
              width: 556rpx;
              height: 556rpx;
              z-index: 1;
              filter: grayscale(100%);
              filter: gray;
            }

            .region_card {
              width: 712rpx;
              height: 458rpx;
              position: absolute;
              left: 50%;
              bottom: 0;
              transform: translate(-50%, 0);
              z-index: 2;
              filter: grayscale(100%);
              filter: gray;
            }

            .region_name {
              position: absolute;
              left: 50%;
              top: 88rpx;
              transform: translate(-50%, 0);
              width: 174rpx;
              height: 102rpx;
              z-index: 3;
            }
          }

          .trans_text {
            font-size: 26rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 36px;
            text-shadow: 0 0 10rpx #FFF2D2;
          }

          .content_text {
            margin-top: 10rpx;
            display: inline-block;
            width: 542rpx;
            font-size: 32rpx;
            font-family: STYuanti-SC-Regular, STYuanti-SC;
            font-weight: 400;
            line-height: 44rpx;
            color: #FFDDDD;
          }

          .bottom_icon {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
            margin: 0 auto;
            bottom: 80rpx;

            .trans {
              display: block;
              padding-top: 100rpx;
              margin: 0 auto;
              width: 176rpx;
              height: 176rpx;


            }

          }



          .badge_position_big {
            width: 520rpx;
            height: 164rpx;
            display: inline-block;
            margin: 40rpx auto;
            position: relative;
            background-image: url('../../../static/images/ChinaTravel/text_bg_big.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            filter: grayscale(100%);
            filter: gray;

            .badge_text {
              width: 360rpx;
              text-align: center;
              margin-top: -8rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #707071;
            }
          }

          .badge_position {
            width: 422rpx;
            height: 94rpx;
            display: inline-block;
            margin: 40rpx auto;
            position: relative;
            background-image: url('../../../static/images/ChinaTravel/text_bg.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            filter: grayscale(100%);
            filter: gray;

            .badge_text {
              margin-top: -8rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #707071;
            }
          }
        }


      }

      .back {
        width: 100vw;
        height: 100vh;
        backface-visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        transform: rotateY(180deg);

        .back_content {
          padding-top: 150rpx;
          box-sizing: border-box;
          width: 100vw;
          height: 100vh;
          text-align: center;
          position: relative;

          .image_container {
            position: relative;
            margin: 0 auto;
            width: 556rpx;
            height: 556rpx;

            .light_img {
              position: absolute;
              width: 100vw;
              height: 980rpx;
              left: 50%;
              top: 50%;
              z-index: 1;
              transform: translate(-50%, -50%);

              .light_img_1 {
                width: 100vw;
                height: 980rpx;
                // animation: rotateImg 5s infinite linear;
              }


            }

            .circle_gray {
              position: absolute;
              left: 0;
              top: 0;
              width: 556rpx;
              height: 556rpx;
              z-index: 2;
            }

            .region_card {
              width: 712rpx;
              height: 458rpx;
              position: absolute;
              left: 50%;
              bottom: 0;
              transform: translate(-50%, 0);
              z-index: 3;
            }

            .region_name {
              position: absolute;
              left: 50%;
              top: 88rpx;
              transform: translate(-50%, 0);
              width: 174rpx;
              height: 102rpx;
              z-index: 3;
            }
          }

          .share_btn {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
            margin: 0 auto;
            bottom: 56rpx;
            width: 522rpx;
            height: 132rpx;
            background-image: url('../../../static/images/ChinaTravel/share_btn.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            view {
              margin-top: -20rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #7A4703;
            }
          }

          .light_time {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
            margin: 0 auto;
            bottom: 150rpx;

            .content_text_2 {
              margin: 0 auto;
              width: 542rpx;
              padding: 120rpx 60rpx 0 60rpx;
              box-sizing: border-box;
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #FFDDDD;
              line-height: 40rpx;
            }

            .light_up {
              width: 482rpx;
              margin: 0 auto;
              padding-top: 24rpx;
              padding-bottom: 106rpx;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .light_left {
                width: 118rpx;
                height: 2rpx;
                background: #F27E7E;
              }

              .light_middle {
                widows: 250rpx;
                text-align: center;
                font-size: 26rpx;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #F27E7E;
              }

              .light_right {
                width: 118rpx;
                height: 2rpx;
                background: #F27E7E;
              }
            }
          }


          .trans_text {
            margin-top: 40rpx;
            margin-bottom: 120rpx;
            font-size: 26rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 36rpx;
          }

          .trans {
            display: block;
            padding-top: 136rpx;
            margin: 0 auto;
            width: 176rpx;
            height: 176rpx;
          }

          .content_text {
            margin-top: 10rpx;

            font-size: 32rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 44rpx;

            text {
              color: #FFC17E;
            }

          }

          .badge_position {
            width: 422rpx;
            height: 94rpx;
            display: inline-block;
            margin: 40rpx auto;
            position: relative;
            background-image: url('../../../static/images/ChinaTravel/text_bg.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .badge_text {
              margin-top: -8rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #743C00;
            }
          }

          .badge_position_big {
            width: 520rpx;
            height: 164rpx;
            display: inline-block;
            margin: 40rpx auto;
            position: relative;
            background-image: url('../../../static/images/ChinaTravel/text_bg_big.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .badge_text {
              width: 360rpx;
              text-align: center;
              margin-top: -8rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #743C00;
            }
          }
        }
      }
    }

    .popup-box {
      .black-box {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000;
        opacity: 0.6;
        z-index: 99;
      }

      .popup-content {
        position: fixed;
        bottom: 30rpx;
        left: 24rpx;
        right: 24rpx;
        // height: 330rpx;
        height: 500rpx;
        background-color: #fff;
        z-index: 999;
        border-radius: 40rpx;
        padding: 30rpx 40rpx;

        .popup-head {
          color: #333;
          font-size: 28rpx;
          font-weight: bold;
        }

        .popup-row {
          display: flex;
          align-items: center;
          border-bottom: 2rpx solid #F6F6F6;
          padding: 30rpx 10rpx;

          .popup-child {
            font-size: 22rpx;
            color: #333;
            margin-right: 70rpx;
            display: flex;
            flex-direction: column;
            align-items: center;

            .popup-img {
              width: 88rpx;
              height: 88rpx;
              margin-bottom: 14rpx;
            }
          }
        }

        .cancel-btn {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          color: #777;
          height: 90rpx;
          font-size: 32rpx;
        }
      }
    }

    .transform_class {
      transform: rotateY(180deg);
    }


  }
</style>