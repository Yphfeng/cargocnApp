<template>
  <view class="bill">
    <view class="top-content">
      <swiper class="swiper" :vertical="true" :current="current" @change="changeSwiper" :disable-touch="disable">
        <swiper-item @touchmove.stop='stopTouchMove'>
          <view class="uni-bg-blue bg-public7">
            <view class="back-box Top-box">
              <image @click="goBack('0')" src="../../../static/images/bill/return.png" mode=""></image>
              <!-- <audio class="audio" @pause="pause('1')" @play="play('2')" :src="audioObj.src" :author="audioObj.author" sessionCategory="ambient"
                loop controls autoplay="autoplay" refs="audio"></audio> -->
              <image :src="audioimg" mode="" @click="audioTap(falgStatus)"></image>
            </view>

            <view class="dialog-left" :class="animationObj.list1 ? 'leftAnimation' : ''">
              <view class="left-content left-img1">
                <view class="content-box content-public1">
                  <view>亲爱的</view>
                  <view class="tag tag_sign1">
                    <view>{{User.userName}}({{UserInfor.userCode}})</view>
                  </view>
                  <view>2022是个不寻常的一年</view>
                </view>
              </view>
            </view>

            <view class="dialog-right" :class="animationObj.list2 ? 'leftAnimation2' : ''">
              <view class="right-content right-img1">
                <view class="content-box content-public2">
                  <view>油价上<text class="view-text">涨</text>,经济下<text class="view-text">滑</text></view>
                  <view>疫情反<text class="view-text">复</text>,需求锐减......</view>
                </view>
              </view>
            </view>

            <view class="dialog-left2" :class="animationObj.list3 ? 'leftAnimation' : ''">
              <view class="left-content left-img2">
                <view class="content-box content-public1">
                  <view>种种因素都是冲刷着货运行业</view>
                  <view>卡车人也经历了<text class="view-text">艰难</text>的一年</view>
                </view>
              </view>
            </view>

            <view class="dialog-right2" :class="animationObj.list4 ? 'leftAnimation2' : ''">
              <view class="right-content right-img2">
                <view class="content-box content-public2 content_text">
                  <view class="view-text">2022</view>
                  <view class="margin-box">
                    <view class="tag tag_sign2">
                      <view>货运中国</view>
                    </view>
                    与您一起经历了
                  </view>
                  <view>哪些难忘的事情?</view>
                </view>
              </view>
            </view>

            <view class="open-bill" @click="OpenBill">
              <view class="open-text">
                开启年度账单
              </view>
            </view>

            <view class="agreement-box">
              <view class="agreement-left">
                <checkbox-group @change="checkboxChange">
                  <label>
                    <checkbox :value="value" :checked="checked" />
                  </label>
                </checkbox-group>
              </view>

              <view class="agreement-right">
                <view>同意使用您的服务信息生成年度账单,</view>
                <view class="see">详情见 <text class="agreement" @click="jumpToAgreement">《用户协议》</text></view>
              </view>
            </view>
          </view>
        </swiper-item>

        <swiper-item>
          <view class="uni-bg-blue bg-public">
            <view class="back-box">
              <image @click="goBack('1')" src="../../../static/images/bill/return.png" mode=""></image>
            </view>
            <view class="bill-content" :class="animationObj[1] ? 'contentanimation' : ''">
              <view>亲爱的 <text class="sign3">{{User.userName}}</text> 您在</view>
              <view><text class="sign3">{{createdDt[0]}}</text>年<text class="sign3">{{createdDt[1]}}</text>月<text
                  class="sign3">{{createdDt[3][0]}}</text> 日</view>
              <view>与我们相遇,</view>
              <view>我们的故事就此开始...</view>
            </view>

            <view class="bottom-content btn-public">
              <image class="mouse_image"
                src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/slideUp.png" mode=""></image>
              <view class="tips">上滑，开启我们的故事</view>
            </view>

          </view>
        </swiper-item>

        <swiper-item>
          <view class="uni-bg-blue bg-public2">
            <view class="back-box">
              <image @click="goBack('2')" src="../../../static/images/bill/return.png" mode=""></image>
            </view>
            <view class="bill-content" :class="animationObj[2] ? 'contentanimation' : ''">
              <view>在这段时间里, 您一共</view>
              <view>登录货运中国<text class="sign">{{UserInfor.loginDays}}</text>天寻找货源</view>
              <view><text class="sign">{{maxLoginDay[0]}}</text>年 <text class="sign">{{maxLoginDay[1]}}</text> 月 <text
                  class="sign">{{maxLoginDay[2]}}</text> 日</view>
              <view>这天您一共使用货运中国<text class="sign">{{parseInt(UserInfor.maxLoginTime / 60)}}</text>分钟</view>
              <view class="text-tips">可以说是相当的“勤劳”!</view>
            </view>

            <view class="bottom-content btn-public2">
              <image class="mouse_image"
                src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/slideUp.png" mode=""></image>
            </view>
          </view>
        </swiper-item>

        <swiper-item>
          <view class="uni-bg-blue bg-public3">
            <view class="back-box">
              <image @click="goBack('3')" src="../../../static/images/bill/return.png" mode=""></image>
            </view>

            <view class="bill-content" :class="animationObj[3] ? 'contentanimation' : ''">
              <view>您一共接单<text class="sign3">{{UserInfor.orderNumber}}</text>次,</view>
              <view>或许这并不是一个让人满意的数字</view>
              <view>但请你相信,</view>
              <view>我们和您一起在努力！</view>
            </view>

            <view class="bottom-content btn-public3">
              <image class="mouse_image"
                src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/slideUp.png" mode=""></image>
            </view>
          </view>
        </swiper-item>

        <swiper-item>
          <view class="uni-bg-blue bg-public4">
            <view class="back-box">
              <image @click="goBack('4')" src="../../../static/images/bill/return.png" mode=""></image>
            </view>
            <view class="bill-content" :class="animationObj[4] ? 'contentanimation' : ''">
              <view><text class="sign">2021</text>年 <text class="sign">6</text> 月 <text class="sign">28</text>日,</view>
              <view>我们上线了“货运中国车队功能”</view>
              <view>卡友们能组建/加入车队</view>
              <view>帮助卡友们找到“咱卡友自己的组织”！</view>
              <view>目前，平台一共有超过<text class="sign">10000+</text></view>
              <view>各种类型的车队</view>
            </view>

            <view class="bottom-content btn-public4">
              <image class="mouse_image"
                src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/slideUp.png" mode=""></image>
            </view>

          </view>
        </swiper-item>

        <swiper-item>
          <view class="uni-bg-blue bg-public5">
            <view class="back-box">
              <image @click="goBack('5')" src="../../../static/images/bill/return.png" mode=""></image>
            </view>

            <view class="bill-content" :class="animationObj[5] ? 'contentanimation' : ''">
              <view>高速公路是祖国的大动脉</view>
              <view>卡车和卡车司机则是祖国的血液</view>
              <view>很多卡友和您一样</view>
              <view>坚守这个行业</view>
              <view>截止<text class="sign2">2022</text>年底，</view>
              <view>卡友们累计行驶超过<text class="sign2">36</text>亿公里</view>
              <view>相当于可以围绕地球<text class="sign2">89829</text>圈</view>
            </view>

            <view class="bottom-content btn-public5">
              <image class="mouse_image"
                src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/slideUp.png" mode=""></image>
            </view>
          </view>
        </swiper-item>


        <swiper-item>
          <view class="uni-bg-blue bg-public6">
            <view class="back-box">
              <image @click="goBack('6')" src="../../../static/images/bill/return.png" mode=""></image>
            </view>
            <view class="bill-content" :class="animationObj[6] ? 'contentanimation' : ''">
              <view>在“点亮中国行”活动中</view>
              <view>卡友们途径<text class="sign3">30</text>个省</view>
              <view>共点亮超过<text class="sign3">1800</text>个区县</view>
              <view>截止2022年12月31日;</view>
              <view>你共点亮<text class="sign3">{{UserInfor.cityCount}}</text>个区/县</view>
              <view>你共点亮<text class="sign3">{{UserInfor.provinceCount}}</text>个省</view>
            </view>

            <view class="bottom-content btn-public6">
              <image class="mouse_image"
                src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/slideUp.png" mode=""></image>
              <view class="tips">继续上滑，抽取你的新年开运签</view>
            </view>

          </view>
        </swiper-item>

        <swiper-item>
          <view class="uni-bg-blue bg-public9">
            <view class="father" :class="flipTag ? 'transform_class' :''">
              <view class="before">
                <view class="back-box">
                  <image @click="goBack('7')" src="../../../static/images/bill/return.png" mode=""></image>
                </view>

                <image class="sign_img" src="../../../static/images/bill/sign_img.png" alt=""></image>

                <view class="before_content">
                  <view>感谢<text class="user_sign">{{User.userName}}</text></view>
                  <view>和我们一起走过2022</view>
                </view>

                <view class="before_content2">
                  <view>我们也为您准备了一份</view>
                  <view>新年开运签</view>
                  <view>快来抽取属于您的</view>
                  <view>新年幸运</view>
                </view>

                <image class="chou" @click="luckDraw" src="../../../static/images/bill/draw2.png" alt=""></image>

              </view>

              <view class="after">
               <view class="back-box">
                  <image @click="goBack('7')" src="../../../static/images/bill/return.png" mode=""></image>
                </view>
                <image class="sign_img" src="../../../static/images/bill/sign_img.png" alt=""></image>

                <view class="user-infor">
                  <view class="user">用户{{UserInfor.userId}}</view>
                  <view class="Kayou">卡友号: {{UserInfor.userCode}}</view>
                </view>

                <view class="Lucky_sign">
                  <view class="text_content">
                    <view class="Lucky_text">{{UserInfor.explain.substring(2,3)}}</view>
                    <view class="Lucky_text2">{{UserInfor.explain.substring(0,1)}}</view>
                    <view class="Lucky_text3">{{UserInfor.explain.substring(3,4)}}</view>
                    <view class="Lucky_text4">{{UserInfor.explain.substring(1,2)}}</view>
                  </view>
                </view>

                <view class="bottom_img">
                  <view class="look_bill" @click="LookBack">回看账单</view>
                  <view class="share" @click="shareTap">保存</view>
                </view>

              </view>
            </view>
          </view>
        </swiper-item>

      </swiper>
    </view>
    <canvas v-if="isCanvas" canvas-id="myCanvas"
      style="width: 375px;top: 0; left: 0; height: 812px; position: fixed; z-index: -1;opacity: 0;">
      <view class="canvas-text"></view>
    </canvas>
  </view>
</template>

<script>
  import * as service from "../../../utils/ship"
  
  var bgAudioManager = uni.getBackgroundAudioManager();
  bgAudioManager.src = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/bgm%281%29.mp3';
  bgAudioManager.onCanplay(()=>{
	  bgAudioManager.play()
	  // setTimeout(()=>{
	  // 	   bgAudioManager.stop()
	  // },10000)
  })
  
 
  export default {
    data() {
      return {
        value: 1,
        checked: false,
        animationObj: {
          list1: false,
          list2: false,
          list3: false,
          list4: false,
          animationCon: false,
          0: false,
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        flipTag: false,
        screenWidth: 0,
        screenHeight: 0,
        isCanvas: false,
        current: 0,
        audioObj: {
          src: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/bgm%281%29.mp3',
        },
        audioimg: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/music.png', 
        disable: false,
        imgUrl: '',
        UserInfor: {},
        User: {},
        createdDt: [],
        maxLoginDay: [],
		falgStatus:false,
      }
    },
    onLoad() {
      this.User = JSON.parse(uni.getStorageSync("userInfo"))
      console.log(this.User);

      setTimeout(() => {
        this.animationObj.list1 = true;
      }, 500)

      setTimeout(() => {
        this.animationObj.list2 = true;
      }, 2000 - 500)

      setTimeout(() => {
        this.animationObj.list3 = true;
      }, 3000 - 500)

      setTimeout(() => {
        this.animationObj.list4 = true;
      }, 4000 - 500)

      this.getUserInfor();
	  
	  // if(this.audioimg == 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/music.png'){
		 //  this.play('2');
	  // }
	  

      uni.getSystemInfo({
        success: function (res) {
          console.log(res, 'getSystemInfo');
          this.screenWidth = res.screenWidth
          this.screenHeight = res.screenHeight;
          // this.isCanvas = true;	       
        }
      });
    },
	onShow() {
		 bgAudioManager.play()
	},
	onHide(){
		console.log('yincengyincneg')
		bgAudioManager.stop()
	},
	onUnload(){
		console.log('onUnloadonUnload')
		bgAudioManager.stop()
	},
    methods: {
		audioTap(flag){
			console.log(flag,'flagflag')
			this.falgStatus =! this.falgStatus
			//默认关闭图片  打开就播放
			if(!flag) {
				this.audioimg = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/music2.png'
				bgAudioManager.stop()
			}else {
				this.audioimg = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/music.png'
				bgAudioManager.play()
			}	
			
		},
      async getUserInfor() {
        let data = {
          userCode:this.User.attrs.userCode,
          // userCode: '480953',
          status: 1,
        }
        console.log(data);
        let res = await service.postRequest("/olnanas/year_bill/getData", data)
        console.log(res, 'getUserInforgetUserInfor');
        //注册日期
        if (res.rspBody.createdDt) {
          let arr = res.rspBody.createdDt.split('-')
          let arr2 = arr[2].split(' ')
          this.createdDt = arr
          this.createdDt.push(arr2)
        }
        //登录次数最多的一天
        if (res.rspBody.maxLoginDay) {
          let arr = res.rspBody.maxLoginDay.split('-')
          this.maxLoginDay = arr
        }
        this.UserInfor = res.rspBody
        console.log(this.UserInfor);

      },

      generatePoster() {
        this.isCanvas = true;
        console.log('分享');
        let that = this
        setTimeout(() => {
          let user = 9999
          let user2 = 89898989
          let text = `用户${this.UserInfor.userId}`
          let text2 = `卡友号：${this.UserInfor.userCode}`
          const ctx = uni.createCanvasContext('myCanvas');
          ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/share_img1.png', 0, 0, 375,
            812);
          ctx.restore()
          // ctx.drawImage('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/share_img2.png',702, 0, 375,110);
          // ctx.restore()

          ctx.setTextAlign('center');
          ctx.setFillStyle('#BB651F')
          ctx.setFontSize(16);
          ctx.fillText(text, 187.5, 286);
          ctx.restore()

          ctx.setFillStyle('#333333')
          ctx.setFontSize(14);
          ctx.fillText(text2, 187.5, 306);
          ctx.restore()

          ctx.setFontSize(36);
          ctx.setFillStyle('#9B5225')
          ctx.shadowColor = 'rgba(203,108,5, 0.2)';
          // 将阴影向右移动15px，向上移动10px
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillText(this.UserInfor.explain.substring(2, 3), 149, 405);
          ctx.fillText(this.UserInfor.explain.substring(0, 1), 228, 405);
          ctx.fillText(this.UserInfor.explain.substring(3, 4), 149, 485);
          ctx.fillText(this.UserInfor.explain.substring(1, 2), 228, 485);

          ctx.draw(true, () => {
            uni.canvasToTempFilePath({
              canvasId: 'myCanvas',
              success: function (res) {
                that.imgUrl = res.tempFilePath;
                console.log(this.imgUrl);

                // //保存手机在图片
                // uni.saveImageToPhotosAlbum({
                //   filePath: res.tempFilePath,
                //   success: function () {
                //     console.log('save success');
                //     uni.showToast({
                //       title: '保存成功',
                //       icon: 'success'
                //     })
                //   }
                // });
              },
              fail: function (error) {
                uni.hideLoading();
                console.log(error)
              },
            })
          })

        }, 500)
      },
      shareTap() {
        //保存手机在图片
        console.log("1111");
        console.log(this.imgUrl);
        uni.saveImageToPhotosAlbum({
          filePath: this.imgUrl,
          success: function () {
            console.log('save success');
            uni.showToast({
              title: '保存成功',
              icon: 'success'
            })
          }
        });
      },
      //回看账单
      LookBack() {
        console.log("回看");

        this.current = 0
      },
      //返回
      goBack(index) {
        console.log(index)
        uni.navigateBack({

        })
        bgAudioManager.stop()
      },
      pause(close) {
        console.log(close, "关闭");
        if (close == 1) {
          this.audioimg = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/music2.png'
        }
      },
      play(open) {
        if (open == 2) {
          this.audioimg = 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/music.png'
        }
      },
      OpenBill() {
        console.log('开启账单');
		console.log(this.checked,'this.checked');
        if (!this.checked) {
          uni.showToast({
            title: '请先勾选协议',
            icon: 'none'
          })
        } else {
			setTimeout(()=>{
				this.current = 1
			},500)
          
        }
      },
      checkboxChange(e) {
        if (e.detail.value.length == 1) {
          this.checked = true;
        }else {
          this.checked = false;
		}
      },

      changeSwiper(e) {
        this.current = e.detail.current
        this.animationObj[e.detail.current] = true
        this.$forceUpdate();
      },

      //抽
      luckDraw() {
        this.flipTag = true
        this.generatePoster()
      },

      //用户协议 
      jumpToAgreement() {
        uni.navigateTo({
          url: '../../allAgreement/privacy'
        });
      },

      //禁止滑动
      stopTouchMove() {
        if (!this.checked) {
          return false;
        }
      },
    },

  }
</script>



<style lang="scss" scoped>
  .bill {
    width: 100vw;
    height: 100vh;

    .top-content {
      height: 100vh;
      height: 100vh;

      .swiper {
        width: 100vw;
        height: 100vh;

        .bg-public {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/background.png');
        }

        .bg-public2 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/background2.png');
        }

        .bg-public3 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/background3.png');
        }

        .bg-public4 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/background4.png');
        }

        .bg-public5 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/background5.png');
        }

        .bg-public6 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/background6.png');
        }

        .bg-public7 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/background7.png');
        }

        .bg-public8 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/background7.png');
        }

        .bg-public9 {
          background-color: #000000;
          // background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/1111.png');
        }

        .btn-public {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/bottom_img1.png');
        }

        .btn-public2 {
          height: 738rpx !important;
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/bottom_img2.png');
        }

        .btn-public3 {
          height: 712rpx !important;
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/bottom_img3.png');
        }

        .btn-public4 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/bottom_img4.png');
        }

        .btn-public5 {
          height: 494rpx !important;
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/bottom_img5.png');
        }

        .btn-public6 {
          height: 594rpx !important;
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/bottom_img6.png');

          .tips {
            margin-top: 494rpx !important;
            ;
          }
        }


        .uni-bg-blue {
          height: 100vh !important;
          width: 100vw;
          position: relative;
          background-size: 100% 100%;
          background-repeat: no-repeat;

        }

        .back-box {
          margin-left: 40rpx;
          padding-top: 104rpx;


          image {
            width: 68rpx;
            height: 68rpx;
          }
        }

        .Top-box {
          display: flex;
          justify-content: space-between;
          margin-right: 46rpx;
        }

        .audio {
          width: 40rpx;
          position: absolute;
          top: 84rpx;
          right: 100rpx;
          opacity: 0;
          z-index: 1;
        }

        .dialog-left2 {
          margin-top: 40rpx;
          height: 10vh;
          width: 75vw;
          margin-left: -600rpx;
          transition: all 1s;
          opacity: 0.2;
        }



        .dialog-left {
          margin-top: 40rpx;
          height: 13vh;
          width: 75vw;
          margin-left: -600rpx;
          transition: all 1s;
          opacity: 0.2;
        }

        .leftAnimation {
          margin-left: 46rpx;
          opacity: 1;
        }



        .left-content {
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }

        .left-img1 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/dialog_box1.png');
          height: 220rpx;
          width: 568rpx;

          image {
            height: 220rpx;
            width: 568rpx;
          }

        }

        .left-img2 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/dialog_box3.png');
          height: 166rpx;
          width: 564rpx;

          image {
            height: 166rpx;
            width: 564rpx;
          }
        }

        .dialog-right2 {
          margin-top: 40rpx;
          height: 14vh;
          margin-right: -600rpx;
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          transition: all 1s;
          opacity: 0.2;
        }



        .dialog-right {
          margin-top: 50rpx;
          height: 10vh;
          margin-right: -600rpx;
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          opacity: 0.2;
          transition: all 1s;
        }

        .leftAnimation2 {
          margin-right: 55rpx;
          opacity: 1;
        }

        .right-content {
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }

        .right-img1 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/dialog_box2.png');
          height: 164rpx;
          width: 512rpx;

          image {
            height: 164rpx;
            width: 512rpx;
          }
        }

        .right-img2 {
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/dialog_box4.png');
          height: 250rpx;
          width: 594rpx;

          image {
            height: 250rpx;
            width: 594rpx;
          }
        }

        .content-public1 {
          padding-left: 88rpx;
        }

        .content-public2 {
          padding-left: 58rpx;

          // view {
          // 	line-height: 50rpx!important;
          // }
        }

        .content-box {
          padding-top: 32rpx;
          padding-bottom: 44rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;

          .content_text {
            view {
              line-height: 50rpx !important;
            }
          }

          view {
            line-height: 40rpx;
          }

          .tag {
            display: block;
            height: 70rpx;
            // background: #FF7700;
            border-radius: 16rpx;
            font-size: 28rpx;
            font-weight: 500;
            color: #FFFFFF;
            // line-height: 40rpx;												
          }

          .tag_sign1 {
            display: flex;
            align-items: center;

            view {
              height: 55rpx;
              line-height: 50rpx;
              border-radius: 16rpx;
              padding: 0 20rpx;
              border: 2rpx solid #333333;
              background: #FF7700;
            }
          }

          .tag_sign2 {
            display: flex;
            align-items: center;

            view {
              height: 55rpx;
              line-height: 55rpx;
              border-radius: 16rpx;
              padding: 0 20rpx;
              border: 2rpx solid #333333;
              font-size: 36rpx !important;
              background: #FF7700;
              margin-right: 10rpx;
            }
          }

          // .tag_sign2 {
          // 	width: 170rpx;
          // 	font-size: 36rpx!important;
          // 	display: flex;
          // 	align-items: center;
          // 	justify-content: center;
          // }

          .view-text {
            color: #FF7700;
            font-size: 36rpx;

          }

          .margin-box {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }

        .open-bill {
          margin-top: 10vh;
          background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/open_btn.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          height: 7vh;
          width: 76vw;
          margin-left: 90rpx;
          font-size: 36rpx;
          font-weight: 600;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;

          .open-text {
            line-height: 50rpx;
          }
        }

        .agreement-box {
          display: flex;
          justify-content: flex-start;
          font-size: 28rpx;
          font-weight: 400;
          color: #333333;
          margin-left: 94rpx;
          margin-top: 40rpx;

          .see {
            text-align: center;
          }

          .agreement {
            color: #0171F9;
            text-decoration: underline
          }

          .agreement-right {
            line-height: 40rpx;

            view {
              line-height: 40rpx;
            }
          }
        }

        .contentanimation {
          opacity: 1 !important;
        }

        .bill-content {
          width: 510rpx;
          margin-top: 80rpx;
          margin-left: 96rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          white-space: nowrap;
          transition: all 4s;
          opacity: 0;

          view {
            line-height: 70rpx;
          }

          .sign {
            color: #FF7700;
            font-size: 48rpx;
          }

          .sign2 {
            color: #0171F9;
            font-size: 48rpx;
          }

          .sign3 {
            color: #FFE700;
            font-size: 48rpx;
          }

        }

        .bottom-content {
          height: 706rpx;
          position: fixed;
          bottom: 0;
          right: 0;
          left: 0;
          background-size: 100% 100%;
          background-repeat: no-repeat;

          .tips {
            margin-top: 592rpx;
            text-align: center;
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
          }
        }


        //抽奖
        .father {
          // margin-top:27vh;
          transition: 0.6s;
          transform-style: preserve-3d;
          width: 100vw;
          height: 100vh;
          // height: 63vh;
          position: relative;
          // background-color: #e73d3d;

          .sign_img {
            height: 166rpx;
            width: 166rpx;
            // margin-top: 12vh;
            // margin-left: 292rpx;
            position: absolute;
            top: 24vh;
            left: 292rpx;
            right: 292rpx;
          }

          .before {
            backface-visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/1111.png');


            .before_content {
              position: absolute;
              top: 38vh;
              left: 240rpx;
              right: 238rpx;
              font-size: 28rpx;
              color: #BB651F;
              font-family: PingFangSC-Medium, PingFang SC;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
              height: 92rpx;
              width: 272rpx;

              .user_sign {
                color: #FF7700;
                font-weight: 800 !important;
                font-size: 30rpx;
                margin-left: 6rpx;
              }

              view {
                line-height: 40rpx;

              }
            }

            .chou {
              position: absolute;
              top: 62vh;
              left: 264rpx;
              right: 262rpx;

              height: 222rpx;
              width: 224rpx;
            }

            .before_content2 {
              position: absolute;
              top: 47vh;
              left: 230rpx;
              right: 238rpx;

              font-size: 28rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #BB651F;
              height: 192rpx;
              width: 292rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;

              view {
                line-height: 40rpx;
              }
            }

            // .img-box {
            // 	margin-top: 36rpx;
            // 	margin-left: 264rpx;
            // 	background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/draw2.png');
            // 	background-size: 100% 100%;
            // 	background-repeat: no-repeat;
            // 	width: 224rpx;
            // 	// height: 13vh;
            // 	height: 222rpx;
            // 	display: flex;
            // 	align-items: center;
            // 	justify-content: center;
            // 	font-size: 80rpx;
            // 	font-weight: 500;
            // 	color: #BB651F;
            // 	view {		
            // 		// margin-top: -2rpx;
            // 	}
            // }

          }

          .after {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            backface-visibility: hidden;
            transform: rotateY(180deg);
            background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/1111.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;

            .user-infor {
              position: absolute;
              top: 37vh;
              left: 260rpx;
              width: 230rpx;
              text-align: center;

              .user {

                font-size: 32rpx;
                font-weight: 500;
                color: #BB651F;
                line-height: 44rpx;

              }

              .Kayou {
                font-size: 28rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 40rpx
              }
            }

            .Lucky_sign {
              position: absolute;
              top: 45vh;
              left: 198rpx;
              right: 200rpx;

              background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/draw-background.png');
              background-repeat: no-repeat;
              background-size: 100% 100%;
              height: 352rpx;
              width: 352rpx;
              // margin-top: 52rpx;
              // margin-left: 26vw;
              font-size: 72rpx;
              font-weight: 500;
              color: #9B5225;
              z-index: -1;


              .text_content {
                height: 352rpx;
                width: 352rpx;
                position: relative;

                .Lucky_text {
                  position: absolute;
                  top: 60rpx;
                  left: 62rpx;
                  right: 238rpx;
                  z-index: 1;
                }

                .Lucky_text2 {
                  position: absolute;
                  left: 218rpx;
                  top: 60rpx;
                  right: 82rpx;
                  z-index: 1;
                }

                .Lucky_text3 {
                  position: absolute;
                  left: 62rpx;
                  top: 220rpx;
                  right: 238rpx;
                  z-index: 1;
                }

                .Lucky_text4 {
                  position: absolute;
                  top: 220rpx;
                  left: 218rpx;
                  right: 82rpx;
                  z-index: 1;
                }
              }


            }

            .bottom_img {
              position: absolute;
              top: 83vh;
              left: 96rpx;
              right: 96rpx;
              background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/btn.png');
              background-repeat: no-repeat;
              background-size: 100% 100%;
              height: 102rpx;
              width: 558rpx;
              // margin-top: 16vh;
              // margin-left: 96rpx;
              // position: relative;
              font-size: 32rpx;
              font-weight: normal;
              color: #FFFFFF;
              line-height: 36rpx;
              text-shadow: 0px 0px 12rpx rgba(147, 0, 0, 0.5);
            }

            .look_bill {
              position: absolute;
              top: 34rpx;
              left: 66rpx;
              bottom: 32rpx;
              height: 36rpx;
              z-index: 2;
            }

            .share {
              position: absolute;
              top: 34rpx;
              right: 98rpx;
              bottom: 32rpx;
              height: 36rpx;
              z-index: 2;
            }

          }
        }

        .transform_class {
          transform: rotateY(180deg);
        }

      }
    }

  }

  .mouse_image {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100rpx;
    margin: 0 auto;
    width: 62rpx;
    height: 68rpx;
    display: flex;
    justify-content: center;
    z-index: 121;
    animation: breathAn 1s linear infinite;
    margin-bottom: 30rpx;
  }

  @keyframes breathAn {

    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20rpx);
    }
  }
</style>