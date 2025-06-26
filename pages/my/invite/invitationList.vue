<template>
  <view class="all">
    <canvas v-if="isCanvas" canvas-id="imgCanvas"
      style="width: 750rpx;top: 0; bottom: 0; height: 100%; position: fixed; z-index: -1;">
      <view class="canvas-text"></view>
      <!-- <image class="img-box" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/invite.png" mode=""></image> -->
    </canvas>
    <!-- <image style="width: 100vw;height: 50vh;" :src="imgUrl" mode=""></image> -->
    <view class="background-box">
      <image class="img-box" :src="selectImgUrl" mode=""></image>
    </view>
    <view class="content-box">
      <view class="title-box">
        <view class="title">货运中国</view>
        <view class="title-child">卡车人的家 温暖 安全 信任 互助</view>
      </view>
      <view class="shareContent-box">
        <image class="content-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/shareContent.png" mode="">
        </image>
        <view class="share-box">
          <image class="user-img"
            :src="userInfo.attrs.avatar?userInfo.attrs.avatar:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'">
          </image>
          <view class="user-name">您的邀请总人数</view>
          <view class="share-num">{{total}}</view>
          <view class="invitation_list" v-if="dataList.length">
            <view class="invitation_header">
              <view class="phone">手机号</view>
              <view class="name">姓名</view>
              <view class="number">卡友号</view>
            </view>
            <scroll-view :scroll-y="true" class="invitation_container" @scrolltolower="initData">
              <view class="invitation_item" v-for="(item, index) in dataList" :key="index"
                :style="{'border-bottom': index == dataList.length - 1 ? '2rpx solid #D5DAE2' : 0}">
                <view class="phone">
                  <view style="margin-top: 4rpx">********</view>
                  <view>{{item.mobile.substring(item.mobile.length - 4)}}</view>
                </view>
                <view class="name">{{ item.userName ? item.userName.replace(item.userName.charAt(0), "*") : '' }}</view>
                <view class="number">{{ item.userCode }}</view>
              </view>
            </scroll-view>
          </view>
          <view v-else class="no_title">您暂无邀请人数,快去邀请吧~</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import * as utils from "@/utils/service.js"
  export default {
    data() {
      return {
        dataList: [],
        total: 0,
        imgUrl: '',
        systemWidth: 0,
        isShare: false,
        userInfo: {},
        isCanvas: false,
        selectImg: 0,
        imgMax: 0,
        selectImgUrl: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/invite1.png',
        pageSize: 10,
        pageNum: 0,
        hasNextPage: true
      }
    },
    onLoad() {
      let that = this;
      that.initData();
      var userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        that.userInfo = JSON.parse(userInfo)
      }
      uni.getSystemInfo({
        success: function (res) {
          that.systemWidth = res.screenWidth;
        }
      });
    },
	onPullDownRefresh() {
		if (this.refreshing) {
			return
		}
		this.refreshing = false;
		this.params.pageNum = 1;
		this.initData('refresh');
	},
	onReachBottom() {
		if (this.reMoreing || this.isNoMore) {
			return;
		}
		this.reMoreing = true;
		this.params.pageNum ++;
		this.initData('more');
		
	},
    methods: {
      // 获取邀请列表
      initData() {
        let that = this;
        if (!that.hasNextPage) {
          return
        }
        that.pageNum++
        utils
          .postRequest("/au/user/findMyInvitedUsers", {
            pageSize: that.pageSize,
            pageNum: that.pageNum,
          })
          .then((res) => {
			  uni.stopPullDownRefresh();
			  this.refreshing = false;
            if (res.retCode == "0000000") {
              console.log(res.rspBody.items)
              if (!res.rspBody.items.length) {
                that.hasNextPage = false
              } else {
                that.dataList = that.dataList.concat(res.rspBody.items)
                that.total = res.rspBody.total;
              }

            }
          })
		  .catch(err => {
			  uni.stopPullDownRefresh();
			  this.refreshing = false;
		  })
      },
    }
  }
</script>

<style lang="scss">
  .all {
    border-top: 10rpx solid #f2f2f2;
    box-sizing: border-box;

    .background-box {
      position: fixed;
      top: 10rpx;
      left: 0;
      right: 0;
      bottom: 0;

      .img-box {
        height: 100%;
        width: 100%;
      }
    }

    .content-box {
      position: fixed;
      top: 10rpx;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      z-index: 9;

      .title-box {
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
          font-weight: 900;
          font-size: 72rpx;
          color: #fff;
        }

        .title-child {
          font-size: 30rpx;
          color: #fff;
          margin-top: 40rpx;
        }
      }

      .shareContent-box {
        display: flex;
        justify-content: center;
        margin-top: 94rpx;
        position: relative;

        .content-img {
          width: 604rpx;
          height: 860rpx;
        }

        .share-box {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;

          .no_title {
            margin-top: 60rpx;
            font-size: 26rpx;
            color: #333;
          }

          .invitation_list {
            .invitation_header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 486rpx;
              height: 60rpx;
              text-align: center;
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              border: 2rpx solid #D5DAE2;
              border-bottom: 0;
              background: #c0d7f9;

              .phone {
                line-height: 60rpx;
                height: 60rpx;
                width: 200rpx;
                border-right: 2rpx solid #D5DAE2;
              }

              .name {
                line-height: 60rpx;
                width: 132rpx;
                height: 60rpx;
                border-right: 2rpx solid #D5DAE2;
              }

              .number {
                line-height: 60rpx;
                height: 60rpx;
                width: 150rpx;
              }
            }

            .invitation_container {
              height: 426rpx;
              width: 490rpx;
              border-bottom: 2rpx solid #D5DAE2;

              .invitation_item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 486rpx;
                height: 60rpx;
                text-align: center;
                font-size: 22rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                border: 2rpx solid #D5DAE2;

                .phone {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  line-height: 60rpx;
                  height: 60rpx;
                  width: 200rpx;
                  border-right: 2rpx solid #D5DAE2;
                }

                .name {
                  line-height: 60rpx;
                  width: 132rpx;
                  height: 60rpx;
                  border-right: 2rpx solid #D5DAE2;
                }

                .number {
                  line-height: 60rpx;
                  height: 60rpx;
                  width: 150rpx;
                }
              }
            }


          }

          .user-img {
            width: 140rpx;
            height: 140rpx;
            border-radius: 70rpx;
            margin-top: -70rpx;
          }

          .user-name {
            font-size: 28rpx;
            color: #333;
            margin-top: 30rpx;
          }

          .share-num {
            color: #0077FF;
            font-size: 100rpx;
            font-weight: bold;
            margin-top: 8rpx;
            line-height: 140rpx;
            font-family: Arial;
          }

          .share-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10rpx;
            margin-bottom: 20rpx;

            .btn-child {
              color: #fff;
              font-size: 30rpx;
              width: 160rpx;
              height: 60rpx;
              background-color: #83B2F7;
              border-radius: 4rpx;
              text-align: center;
              line-height: 60rpx;
            }
          }

          .share-tip {
            font-size: 24rpx;
            color: #777;
            margin-top: 32rpx;
          }

          .code-img {
            width: 200rpx;
            height: 200rpx;
          }

          .scan-box {
            color: #777;
            font-size: 24rpx;
            margin: 12rpx 0;
          }

          .share-tap {
            color: #fff;
            font-size: 30rpx;
            width: 160rpx;
            height: 60rpx;
            background-color: #83B2F7;
            border-radius: 4rpx;
            text-align: center;
            line-height: 60rpx;
          }

          .share-top {
            width: 548rpx;
            height: 144rpx;
            font-size: 26rpx;
            color: #333;
            line-height: 36rpx;
            margin-top: 20rpx;
          }
        }
      }
    }
  }
</style>