<template>
<!--index.wxml-->
<view class="body">
	<view class="countContainer" style="margin-top: 50rpx;margin-bottom: 50rpx">剩余次数: {{count}}</view>
	<!--    <view class="countContainer" style="margin-top: 30rpx;margin-bottom: 30rpx">停止位置：{{luckPosition}}</view>-->
	<view class="frame_view">
		<view class="frame_row">
			<view class="frame_item" :style="'opacity:' + color[0]">
				<view class="coupon coupon1" v-if="images[0].optionType == 0">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_thanksJoin.png"></image>
					<text class="coupon_text coupon_text1">谢谢参与</text>
				</view>
				<view class="coupon" v-if="images[0].optionType == 1">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_luck_coupon.png"></image>
					<text class="coupon_Amount">￥{{images[0].coupon.couponMaxAmount}}</text>
					<text class="coupon_text">{{images[0].coupon.couponTypeName}}券</text>
				</view>
				<view v-if="images[0].optionType == 2">积分</view>
				<view v-if="images[0].optionType == 2">{{images[0].optionPrize}}</view>
			</view>
			<view class="frame_item" :style="'opacity:' + color[1]">
				<view class="coupon coupon1" v-if="images[1].optionType == 0">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_thanksJoin.png"></image>
					<text class="coupon_text coupon_text1">谢谢参与</text>
				</view>
				<view class="coupon" v-if="images[1].optionType == 1">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_luck_coupon.png"></image>
					<text class="coupon_Amount">￥{{images[1].coupon.couponMaxAmount}}</text>
					<text class="coupon_text">{{images[1].coupon.couponTypeName}}券</text>
				</view>
				<view v-if="images[1].optionType == 2">积分</view>
				<view v-if="images[1].optionType == 2">{{images[1].optionPrize}}</view>
			</view>
			<view class="frame_item" :style="'opacity:' + color[2]">
				<view class="coupon coupon1" v-if="images[2].optionType == 0">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_thanksJoin.png"></image>
					<text class="coupon_text coupon_text1">谢谢参与</text>
				</view>
				<view class="coupon" v-if="images[2].optionType == 1">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_luck_coupon.png"></image>
					<text class="coupon_Amount">￥{{images[2].coupon.couponMaxAmount}}</text>
					<text class="coupon_text">{{images[2].coupon.couponTypeName}}券</text>
				</view>
				<view v-if="images[2].optionType == 2">积分</view>
				<view v-if="images[2].optionType == 2">{{images[2].optionPrize}}</view>
			</view>
		</view>

		<view class="frame_row">
			<view class="frame_item" :style="'opacity:' + color[7]">
				<view class="coupon coupon1" v-if="images[7].optionType == 0">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_thanksJoin.png"></image>
					<text class="coupon_text coupon_text1">谢谢参与</text>
				</view>
				<view class="coupon" v-if="images[7].optionType == 1">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_luck_coupon.png"></image>
					<text class="coupon_Amount">￥{{images[7].coupon.couponMaxAmount}}</text>
					<text class="coupon_text">{{images[7].coupon.couponTypeName}}券</text>
				</view>
				<view v-if="images[7].optionType == 2">积分</view>
				<view v-if="images[7].optionType == 2">{{images[7].optionPrize}}</view>
			</view>
			<view class="frame_item" style="background-color: goldenrod" @tap="clickLuckFun">
				<image style="width: 100%;height: 100%;" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_luckGO.png"></image>
			</view>
			<view class="frame_item" :style="'opacity:' + color[3]">
				<view class="coupon coupon1" v-if="images[3].optionType == 0">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_thanksJoin.png"></image>
					<text class="coupon_text coupon_text1">谢谢参与</text>
				</view>
				<view class="coupon" v-if="images[3].optionType == 1">
					<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_luck_coupon.png"></image>
					<text class="coupon_Amount">￥{{images[3].coupon.couponMaxAmount}}</text>
					<text class="coupon_text">{{images[3].coupon.couponTypeName}}券</text>
				</view>
				<view v-if="images[3].optionType == 2">积分</view>
				<view v-if="images[3].optionType == 2">{{images[3].optionPrize}}</view>
			</view>
		</view>

		<view class="frame_row">
			<view class="frame_row">
				<view class="frame_item" :style="'opacity:' + color[6]">
					<view class="coupon coupon1" v-if="images[6].optionType == 0">
						<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_thanksJoin.png"></image>
						<text class="coupon_text coupon_text1">谢谢参与</text>
					</view>
					<view class="coupon" v-if="images[6].optionType == 1">
						<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_luck_coupon.png"></image>
						<text class="coupon_Amount">￥{{images[6].coupon.couponMaxAmount}}</text>
						<text class="coupon_text">{{images[6].coupon.couponTypeName}}券</text>
					</view>
					<view v-if="images[6].optionType == 2">积分</view>
					<view v-if="images[6].optionType == 2">{{images[6].optionPrize}}</view>
				</view>
				<view class="frame_item" :style="'opacity:' + color[5]">
					<view class="coupon coupon1" v-if="images[5].optionType == 0">
						<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_thanksJoin.png"></image>
						<text class="coupon_text coupon_text1">谢谢参与</text>
					</view>
					<view class="coupon" v-if="images[5].optionType == 1">
						<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_luck_coupon.png"></image>
						<text class="coupon_Amount">￥{{images[5].coupon.couponMaxAmount}}</text>
						<text class="coupon_text">{{images[5].coupon.couponTypeName}}券</text>
					</view>
					<view v-if="images[5].optionType == 2">积分</view>
					<view v-if="images[5].optionType == 2">{{images[5].optionPrize}}</view>
				</view>
				<view class="frame_item" :style="'opacity:' + color[4]">
					<view class="coupon coupon1" v-if="images[4].optionType == 0">
						<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_thanksJoin.png"></image>
						<text class="coupon_text coupon_text1">谢谢参与</text>
					</view>
					<view class="coupon" v-if="images[4].optionType == 1">
						<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_luck_coupon.png"></image>
						<text class="coupon_Amount">￥{{images[4].coupon.couponMaxAmount}}</text>
						<text class="coupon_text">{{images[4].coupon.couponTypeName}}券</text>
					</view>
					<view v-if="images[4].optionType == 2">积分</view>
					<view v-if="images[4].optionType == 2">{{images[4].optionPrize}}</view>
				</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
var api = require("../../../config/api.js");
var util = require("../../../utils/util.js"); //计数器
//计数器
var interval = null; //值越大旋转时间越长  即旋转速度
//值越大旋转时间越长  即旋转速度
var intime = 50;

export default {
  data() {
    return {
      color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      //9张奖品图片
      images: [],
      clickLuck: 'clickLuck',
      luckPosition: 3,
      stationId: 0,
      count: 0,
      btnConfirm: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      stationId: options.id
    });
    this.loadAnimation();
    this.getList();
  },
  methods: {
    getList() {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
      util.postRequest(api.getLottery, {
        "stationId": that.stationId
      }).then(function (res) {
        uni.hideLoading();
        console.log(res);

        if (res.retCode == '0000000') {
          that.setData({
            count: res.rspBody.restTimes,
            images: res.rspBody.options,
            color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
          });
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    requestClick() {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
      util.postRequest(api.clickLottery, {
        "stationId": that.stationId
      }).then(function (res) {
        uni.hideLoading();
        console.log(res);
        that.setData({
          clickLuck: 'clickLuck'
        });

        if (res.retCode == '0000000') {
          const body = res.rspBody;
          const optionColumn = body.optionColumn;
          let msg = '';

          if (body.optionType == 0) {
            msg = "很遗憾未中奖";
          } else if (body.optionType == 1) {
            msg = "恭喜获得：优惠券！请去[我的]--[优惠奖券]中查看";
          } else if (body.optionType == 2) {
            msg = "恭喜获得：" + body.optionPrize + "积分";
          }

          that.stopInfo(msg, optionColumn);
        } else if (res.retCode == '400') {
          uni.showModal({
            title: '提示',
            content: "您还不是该油站会员，暂不能参与抽奖",
            confirmText: "加入会员",
            cancelText: "取消",
            success: function (res) {
              if (res.confirm) {
                uni.navigateTo({
                  url: "../addVip/addVip?stationId=" + that.stationId
                });
              }
            }
          });
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
          console.log(res.retDesc);
        }
      });
    },

    stopInfo(msg, optionColumn) {
      const that = this;
      const images = that.images;
      let position = 0;

      for (let i = 0; i < images.length; i++) {
        if (images[i].optionColumn == optionColumn) {
          position = i;
        }
      } //清空计时器


      clearInterval(interval);
      var index = 0; //console.log(that.data.color[0]);
      //循环设置每一项的透明度

      interval = setInterval(function () {
        if (index > 7) {
          index = 0;
          that.color[7] = 0.5;
        } else if (index != 0) {
          that.color[index - 1] = 0.5;
        }

        that.color[index] = 1;
        that.setData({
          color: that.color
        });
        index++;
      }, intime);
      that.stop(position, msg);
    },

    requestClickInfo(id) {
      const that = this;
      uni.showLoading({
        title: '请稍候...'
      });
      util.postRequest(api.clickLotteryInfo, {
        "stationId": id
      }).then(function (res) {
        uni.hideLoading();
        console.log(res);

        if (res.retCode == '0000000') {} else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    //点击抽奖按钮
    clickLuckFun: function () {
      const that = this;
      const count = that.count;

      if (count == 0) {
        uni.showToast({
          title: "当前抽奖次数为0",
          icon: 'none'
        });
      } else {
        //设置按钮不可点击
        that.setData({
          clickLuck: 'notClickLuck'
        });
        that.requestClick();
      }
    },
    //也可以写成点击按钮停止抽奖
    // clickStop:function(){
    //   var stoptime = 2000;
    //   setTimeout(function () {
    //     e.stop(1);
    //   }, stoptime)
    // },
    stop: function (which, msg) {
      var e = this; //清空计数器

      clearInterval(interval); //初始化当前位置

      var current = -1;
      var color = e.color;

      for (var i = 0; i < color.length; i++) {
        if (color[i] == 1) {
          current = i;
        }
      } //下标从1开始


      var index = current + 1;
      e.stopLuck(which, index, intime, 10, msg);
    },

    /**
     * which:中奖位置
     * index:当前位置
     * time：时间标记
     * splittime：每次增加的时间 值越大减速越快
     */
    stopLuck: function (which, index, time, splittime, msg) {
      var e = this; //值越大出现中奖结果后减速时间越长

      var color = e.color;
      setTimeout(function () {
        //重置前一个位置
        if (index > 7) {
          index = 0;
          color[7] = 0.5;
        } else if (index != 0) {
          color[index - 1] = 0.5;
        } //当前位置为选中状态


        color[index] = 1;
        e.setData({
          color: color
        }); //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
        //直到旋转至中奖位置

        if (time < 400 || index != which) {
          //越来越慢
          splittime++;
          time += splittime; //当前位置+1

          index++;
          e.stopLuck(which, index, time, splittime, msg);
        } else {
          //1秒后显示弹窗
          setTimeout(function () {
            uni.showModal({
              title: '提示',
              content: msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  e.getList();

                  color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], e.setData({
                    btnConfirm: "/static/images/dianjichoujiang.png",
                    clickLuck: 'clickLuck'
                  });

                  e.loadAnimation();
                }
              }
            });
          }, 1000);
        }
      }, time); //console.log(time);
    },
    //进入页面时缓慢切换
    loadAnimation: function () {
      var e = this;
      var index = 0; // if (interval == null){

      interval = setInterval(function () {
        if (index > 7) {
          index = 0;
          e.color[7] = 0.5;
        } else if (index != 0) {
          e.color[index - 1] = 0.5;
        }

        e.color[index] = 1;
        e.setData({
          color: e.color
        });
        index++;
      }, 1000); // }
    }
  }
};
</script>
<style>
@import "./luckDraw.css";
</style>