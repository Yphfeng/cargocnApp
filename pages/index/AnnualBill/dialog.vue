<template>
  <view class="mask flex-center">
    <view class="content">
      <image class="bg_img" src="../../../static/images/bill/dialog_bg.png"></image>
      <image class="close" @click="switchIndex" src="../../../static/images/bill/clone.png"></image>

      <view class="open" @click="OpenBill">
          <view>开启年度账单</view>
      </view>
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
		console.log(option)
      // let that = this
      // that.info = JSON.parse(option.info)
      // console.log(that.info)
    },
	onShow() {
		console.log('onShow')
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
		OpenBill(){
			uni.redirectTo({
				url:'./AnnualBill'
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
    height: 738rpx;
    // display: flex;
    // justify-content: center;
    margin-left: 84rpx;

    .bg_img {
      position: absolute;
      left: -20rpx;
      top: 0;
      right: 0;
      z-index: -1;
      width: 592rpx;
      height: 576rpx;
    }

    .close {
      position: absolute;
      right: 58rpx;
      top: -60rpx;
      width: 44rpx;
      height: 44rpx;
      z-index: 1;
    }

    .open {
        background-image: url('../../../static/images/bill/open_btn.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 106rpx;
        width: 574rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;

        position: absolute;
        right: 88rpx;
        top: 632rpx;

		display: flex;
		justify-content: center;
		align-items: center;

        view {
            line-height: 50rpx;
        }
        
    }

  }
</style>