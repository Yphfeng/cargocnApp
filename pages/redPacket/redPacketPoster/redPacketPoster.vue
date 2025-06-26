<template>
  <view>
    <view class="container">
      <view class="top_header" :style="'top: ' + (statusBarHeight + 'px')">
        <image
          class="all_bg"
          @click="goBack"
          src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/left_arrow_white.png"
          mode="cover"
        />
      </view>
      <view class="poster_box">
        <view class="poster_avatar">
          <view class="av_name_box">
            <view class="avatar">
              <image :src="avatar" />
            </view>
            <view class="nickName">{{ userName }}</view>
          </view>
        </view>
        <view class="poster_bottom">
          <view class="poster_bottom_box">
            <view class="text_box">
              <view>{{ userName }}</view>
              <view>邀请你来货运中国领钱啦！</view>
              <view>每天都能无门槛领现金</view>
            </view>
            <view class="QR_code">
              <image :src="userQrCode" />
            </view>
          </view>
        </view>
      </view>
      <view class="save_btn" @click="drawShareImg">点击保存</view>
      <view class="circle" @click="drawShareImg">
        <view class="circle1"></view>
        <view class="circle2"></view>
        <view class="circle3"></view>
      </view>
      <canvas
        id="qrImgRedPoster"
        canvas-id="qrImgRedPoster"
        style="
          width: 80px;
          bottom: 30px;
          height: 80px;
          right: 30px;
          position: absolute;
          z-index: -10;
          opacity: 0;
        "
      >
        <view class="canvas-text"></view>
      </canvas>
      <canvas
        canvas-id="imgCanvas"
        style="
          width: 678rpx;
          top: 0;
          bottom: 0;
          height: 1126rpx;
          position: absolute;
          top: -9999999rpx;
          z-index: -1;
        "
      >
      </canvas>
      <image
        @click="drawShareImg"
        class="finger_icon"
        src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/finger_icon.png"
      />
    </view>
  </view>
</template>

<script>
// 生成二维码
import uQRCode from "@/uni_modules/Sansnn-uQRCode/js_sdk/u-qrcode";
import * as utils from "@/utils/service.js";
export default {
  components: {
    uQRCode,
  },
  data() {
    return {
      statusBarHeight: "",  //状态栏高度
      userInfo: {},
      userQrCode: "", //二维码
      codeText: "https://m.hyzgapp.com/code/hbyShare", //二维码参数
      userName: "",
      avatar: "",
      selectImgUrl:"https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/poster_bg.png", //海报背景图片
      imgUrl: "", //canvas海报生成图片的路径
    };
  },
  onLoad(options) {
    let that = this;
    let userInfo = uni.getStorageSync("userInfo");
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      that.userInfo = userInfo;
      that.codeText = `https://m.hyzgapp.com/code/hbyShare?shareCode=${userInfo.attrs.userCode}&shareType=1`;
    }
  },
  onShow() {
    let that = this;
    let res = uni.getSystemInfoSync(); ///微信api方法
    let H = res.statusBarHeight + 7;
    let userInfo = that.userInfo;
    // 处理用户昵称
    if (userInfo) {
      let tmpUserName = "";
      if (userInfo.userName) {
        tmpUserName = userInfo.userName;
      } else if (userInfo.attrs.nickName) {
        tmpUserName = userInfo.attrs.nickName;
      } else if (
        userInfo.attrs.nickname &&
        userInfo.attrs.nickname != "微信用户"
      ) {
        tmpUserName = userInfo.attrs.nickname;
      } else if (userInfo.mobile) {
        let reg = /^(\d{3})\d{4}(\d{4})$/;
        tmpUserName = userInfo.mobile.replace(reg, "$1****$2");
      } else {
        tmpUserName = "用户" + userInfo.userId;
      }
      this.userName = tmpUserName;
    }
    // 处理头像
    let avatar = "";
    if (userInfo.attrs.avatar) {
      avatar = userInfo.attrs.avatar;
    }
    that.statusBarHeight = H;
    that.avatar = avatar? avatar: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png";
    this.qrcode();
  },
  methods: {
    // 生成二维码
    qrcode() {
      let that = this;
      const ctxImg = uni.createCanvasContext("qrImgRedPoster");
      let qrValue = this.codeText;
      // 获取uQRCode实例，传入二维码内容和canvas上下文
      const uqrcode = new uQRCode(
        {
          text: qrValue,
          size: 80, //二维码大小
        },
        ctxImg
      );
      // 调用制作二维码方法
      uqrcode.make();
      // 调用绘制方法将二维码图案绘制到canvas上
      uqrcode.draw();
      setTimeout(() => {
        // 把二维码canvas上下文变成图片
        uni.canvasToTempFilePath({
          canvasId: "qrImgRedPoster",
          width: 80,
          height: 80,
          success: (res) => {
            let tempFilePath = res.tempFilePath;
            // 保存二维码图片路径
            that.userQrCode = tempFilePath;
          },
          fail: (err) => {},
          complete: () => {},
        });
      }, 500);
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 返回上一级页面。
      });
    },
    drawShareImg() {
      uni.showLoading({
        title: "海报生成中",
      });
      const ctx = uni.createCanvasContext("imgCanvas");
      let that = this;
      // 画海报背景图
      ctx.drawImage(that.selectImgUrl, 0, 0, uni.upx2px(678), uni.upx2px(1126));
      ctx.restore();
      
       // 画海报文案
      ctx.setFontSize(14);
      ctx.fillText("邀请你来货运中国领钱啦！", 25, 440);
      ctx.fillText("每天都能无门槛领现金", 25, 460);
      // 画用户名字
      ctx.font = 'bold 18px Arial';
      ctx.fillText(that.userName, 75, 45);
      ctx.fillText(that.userName, 25, 413);
      
     
      // 画二维码
      ctx.drawImage(
        that.userQrCode,
        240,
        397,
        uni.upx2px(140),
        uni.upx2px(140)
      );
      // 画圆
      ctx.arc(44, 36, 21, 0, 2 * Math.PI);
      ctx.clip();
      // 画头像
      ctx.drawImage(that.avatar, 18, 11, uni.upx2px(100), uni.upx2px(100));
      // h绘制并把canvas变成图片
      ctx.draw(true, () => {
        uni.canvasToTempFilePath({
          canvasId: "imgCanvas",
          success: function (res) {
            // 在H5平台下，tempFilePath 为 base64
            console.log(res);
            that.imgUrl = res.tempFilePath;
            // that.saveToMobile()
            // 上传到服务器变成网络图片，（保存到手机相册的图片url开头不可以是特殊字符）
            that.uploadImg(res.tempFilePath);
          },
        });
      });
    },
    saveToMobile(saveImgUrl) {
      let that = this;
      uni.downloadFile({
        url: saveImgUrl, //海报图片地址
        success: (res) => {
          console.log(res);
          // 保存到手机相册
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
              // that.isShare = false;
              uni.hideLoading();
              uni.showToast({
                title: "保存成功",
                icon: "none",
              });
            },
            fail: function (e) {
              uni.hideLoading();
              console.log(e);
              uni.showToast({
                title: "保存失败",
                icon: "none",
              });
            },
          });
        },
      });
    },
    uploadImg(image) {
      let that = this;
      uni.uploadFile({
        url: utils.ApiRootUrl + "/file/upload",
        filePath: image,
        name: "file",
        formData: {
          userType: "84",
        },
        success: function (res) {
          // that.isCanvas = false;
          console.log(res);
          // uni.hideLoading();
          let result = JSON.parse(res.data);
          that.saveImgUrl = result.rspBody[0].url;
          // that.isShare = true;
          that.saveToMobile(result.rspBody[0].url);
        },
        fail: function (res) {
          uni.showToast({
            title: "网络错误!",
            icon: "none",
          });
          uni.hideLoading();
        },
      });
    },
  },
};
</script>

<style lang="less">
.container{
    width   : 100vw;
    position: relative;
    height  : 1624rpx;
    // height: 100vh;
    background: linear-gradient(180deg, #FF0000 0%, rgba(255,255,255,0.37) 100%);
    overflow: hidden;
    
    .top_header {
        position       : fixed;
        width          : 100vw;
        // padding-left   : 32rpx;
        // top         : 105rpx;
        left           : 0;
        z-index        : 10;
        display        : flex;
        align-items    : center;
    
        image {
          width : 78rpx;
          height: 78rpx;
          padding-left: 32rpx;
          padding-right: 32rpx;
          display: block;
        }
    }
    .all_bg{
        width: 100vw;
        // height: 2450rpx;
        height: 1624rpx;
    }
    .level_bg{
        position: absolute;
        z-index: 1;
    }
    .poster_box{
        width: 678rpx;
        height: 1126rpx;
        margin: 27% auto;
        background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/poster_bg.png");
        background-size: contain;
        position: relative;
        .poster_avatar{
            width: 678rpx;
            z-index: 3;
            display: flex;
            height: 780rpx;
            .av_name_box{
                display: flex;
                height: 120rpx;
                // line-height: 120rpx;
                // align-items: center;
                width: 100%;
                // margin-top: 50rpx;
                position: absolute;
                top: 30rpx;
                .avatar{
                    margin-left: 40rpx;
                    margin-right: 30rpx;
                    image{
                        width: 100rpx;
                        height: 100rpx;
                        border-radius: 50%;
                    }
                    
                }
                .nickName{
                    font-weight: bold;
                    font-size: 36rpx;
                    margin-top: 30rpx;
                }
            }
        }
        .poster_bottom{
            width: 678rpx;
            z-index: 3;
            display: flex;
            // height: 306rpx;
            // position: absolute;
            // bottom: 150rpx;
            align-items: center;
            .poster_bottom_box{
                display: flex;
                // height: 120rpx;
                // line-height: 120rpx;
                // align-items: center;
                width: 100%;
                // margin-top: 50rpx;
                position: absolute;
                // top: 40rpx;
                bottom: 150rpx;
                .text_box{
                    flex: 1;
                    margin-left: 40rpx;

                    view:nth-child(1){
                        font-weight: bold;
                        line-height: 75rpx;
                        font-size: 36rpx;
                    }
                    view:nth-child(2){
                        font-size: 28rpx;
                        line-height: 50rpx;
                    }
                    view:nth-child(3){
                        font-size: 28rpx;
                    }
                }
                .QR_code{
                    width: 182rpx;
                    image{
                        width: 150rpx;
                        height: 150rpx;
                        // border-radius: 50%;
                    }
                }
            }
            
        }


        .poster_bg_share{
            position: absolute;           
            width: 678rpx;
            // height: 1126rpx;
            z-index: 2;
            // top:210rpx;
        }

       
    }
    .poster_share{
        position: absolute;
        top:-99999rpx
        // top: 30rpx;
    }
    .save_btn{
        text-align: center;
        line-height: 88rpx;
        color: white;
        font-size: 36rpx;
        font-weight: bold;
        position: absolute;
        bottom: 130rpx;
        width: 594rpx;
        height: 88rpx;
        background: linear-gradient(230deg, #F92848 0%, #FFAB65 100%);
        box-shadow: 0rpx 8rpx 20rx 0rpx rgba(254,174,111,0.43);
        border-radius: 94rpx;
        margin-left: 78rpx;
    }
    .circle {
        /*创建一个盒子*/
        width: 48rpx;
        height: 48rpx;
        transform: translate(-50%,-50%);
        // background-color: black;
        position: absolute;
        bottom: 40rpx;
        left: 650rpx;
        z-index: 101;
        right: 1rpx;
        

        .circle1,
        .circle2,
        .circle3
        {
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -50px 0 0 -50px; 
            /* transform: translate(-50%,-50%); *//*因为后面动画也会用到transfrom,因此此处的trasnfrom会被覆盖，因此不能transfrom*/
            width: 38rpx;
            height: 38rpx;
            border-radius: 50%;
            // background-color: rgb(255, 255, 255, 0.8);
            // background-color: black;
            border: 1rpx solid rgb(255, 255, 255, 0.8);
        } 
        .circle1 {
            animation: circle 3s linear infinite;
            -webkit-animation:circle 3s linear infinite;
        }
    
        .circle2 {
            animation: circle 3s linear 0.8s infinite;
            -webkit-animation: circle 3s linear 0.8s infinite;
        }
    
        .circle3 {
            animation: circle 3s linear 1.6s infinite;
            -webkit-animation: circle 3s linear 1.6s infinite;
        }
    
        @keyframes circle {
    
            /* Safari and Chrome */
            from {
                opacity: 1;
                transform: scale(0);
            }
    
            to {
                opacity: 0;
                transform: scale(3);
            }
        }
    }
    .finger_icon{
        position: absolute;
        z-index: 102;
        width: 84rpx;
        height: 100rpx;
        animation: finger 1.5s linear infinite;
        -webkit-animation: finger 1.5s linear infinite;
    }
    @keyframes finger {
        0%{
            right: 70rpx;
            bottom: 50rpx;
        }
        50%{
            right: 110rpx;
            bottom: 71rpx;
        }
        100%{
            right: 70rpx;
            bottom: 50rpx;
        }
    }
    .canvas-wrapper{
        position: absolute;
        top:-9999999999rpx;
        // top: 40;
        // z-index: -1;
        // display: none;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        // margin: 0 auto;

    }
}
</style>
