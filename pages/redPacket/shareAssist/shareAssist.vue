<template>
	<view class="container">
        <image class="all_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_bg.png" mode="cover" />
        <view class="top_header" :style="{top: statusBarHeight+'px'}">
            <image class="all_bg" @click="goBack" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/red_btn.png" mode="cover" />
        </view>
        <view class="title">
            <view >呼朋唤友</view>
            <view >福利双赢</view>
        </view>
        <view class="rule">
            <view >
                <view >每成功邀请一位卡友助力，即</view>
                <view >可增加1次机会</view>
                <view >（邀请新用户认证行驶证后，你</view>
                <view >的红包金额会更大）</view>
                </view>
        </view>
        <view class="button" @click="toWxApplet">
            邀请好友助力
        </view>       
    </view>
</template>

<script>
    import {WX_ORIGIN_ID} from "@/utils/baseUrl.js";
    import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				statusBarHeight:"",
			}
		},
        onLoad(options){
            let res = uni.getSystemInfoSync()
            let H = res.statusBarHeight + 7 //状态栏高度
            this.statusBarHeight = H;
        },
        
		methods: {
			goBack() {
                uni.navigateBack({
                    delta: 1 // 返回上一级页面。
                })
            },
            toWxApplet() {
                // console.log("点击了分享按钮");
                let that = this;
                let userCode="";
                let userInfo = uni.getStorageSync("userInfo");
                if(userInfo){
                    userInfo=JSON.parse(userInfo);
                    userCode=userInfo.attrs.userCode
                    ship.postRequest('/hby/redPacketShareRecord/add', {
                        userId: userInfo.userId,
                        userCode: userCode
                    })
                }
                console.log(userInfo);
                let titleArr = [
                    "新用户行驶证认证后助力，金额翻10倍！",
                    "老铁，就差你了，咱们一起领包包！",
                    "帮我助力一下吧，非常感谢！",
                    "我的已到账，邀您一起玩！",
                    "据可靠线报，这场包包雨下的更大吆！",
                    "日积月累，从行动开始，点它！",
                    "买彩票不一定中，这个点开肯定中！",
                ];
                let imgUrlArr=[
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link1.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link4.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link2.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link7.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link3.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link6.jpg",   
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link5.jpg",
                ]
                let randomNum = Math.floor(Math.random() * 7);
                let qrValue = '/pages/index/index/index?shareCode=' + userCode + '&shareType=1';
                uni.share({
                    provider: 'weixin',
                    scene: "WXSceneSession",
                    type: 5,
                    imageUrl: imgUrlArr[randomNum],
                    title: '【货运中国】'+titleArr[randomNum],
                    miniProgram: {
                        id: WX_ORIGIN_ID,
                        path: qrValue,
                        type: 0, //微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
                        webUrl: 'https://m-test.hyzgapp.com/#/privacy'
                    },
                    success: ret => {
                        console.log(JSON.stringify(ret));
                    }
                });
            },
		}
	}
</script>

<style lang="less">
.container{

    width : 100vw;
    // height: 1624rpx;
    height: 100vh;
    position: relative;

    .all_bg {
      width : 100vw;
      height: 100vh;
    }

    .top_header {
      position       : fixed;
      width          : 100vw;
      z-index        : 10;
      display        : flex;
      align-items    : center;
  
      image {
        width : 48rpx;
        height: 48rpx;
        padding-left: 32rpx;
        padding-right: 32rpx;
        display: block;
      }
  
      .title {
        font-size  : 40rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color      : #FFFFFF;
        margin-left: 30vw;
        
      }
    }

    .title{
      position: absolute;
      width      : 100vw;
      text-align : center;
      top        : 170rpx;
      font-size: 120rpx;
      font-family: Alibaba PuHuiTi 2.0-95 ExtraBold, Alibaba PuHuiTi 20;
      font-weight: 600;
      line-height: 130rpx;
      color:#F62B11;
    }

    // .none_num{
    //   position: absolute;
    //   width      : 100vw;
    //   text-align : center;
    //   top        : 470rpx;
    //   font-size: 40rpx;
    //   font-family: PingFang SC-Medium, PingFang SC;
    //   font-weight: 500;
    //   line-height: 40rpx;
    //   color:#F62B11;
    // }

    .rule{
      position: absolute;
      width      : 100vw;
      text-align : center;
    //   display: flex;
    //   justify-content: center;
      align-items: center;
    //   height: 400rpx;
      top        : 500rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 38rpx;
      letter-spacing: 2rpx;
      color:#F62B11;
    }


    .button{
        position: absolute;
        text-align : center;
        bottom: 106rpx;
        width: 480rpx;
        height: 96rpx;
        line-height: 96rpx;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(180deg, #03DA6B 0%, #00B557 100%);
        font-size: 44rpx;
        font-weight: 500;
        box-shadow: 4rpx 6rpx 12rpx 0rpx rgba(15,199,104,0.4);
        border-radius: 16rpx ;
        color: #FFFFFF;
    }
}
</style>
