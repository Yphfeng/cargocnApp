<template>
	<view class="motto">
	  <view>
	      <textarea class="textarea" placeholder="最多输入100个字" v-model="introduction" maxlength="100" @input="input"  />
	    <view class="templete">
	      <view class="opt-item" :class="{active: introIndex == index}" v-for="(item, index) in introBtn"  @click="switchIndex(index)">{{item}}</view>
	    </view>
	  </view>
	
	  <view class="opt">
	    <view class="opt-item cancel" @click="clear">清空</view>
	    <view class="opt-item confirm" @click="confirm">确认</view>
	  </view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	export default {
		data() {
			return {
				userInfo: null,
				introduction: '',
				introBtn: ["模版一", "模版二", "模版三"],
				introInfo: [],
				introIndex: 0,
			}
		},
		onLoad(options) {
			var userInfo = wx.getStorageSync('userInfo');
			var introInfo = options.introInfo;
			this.introInfo = JSON.parse(introInfo);
			this.userInfo = JSON.parse(userInfo);
			this.introduction = options.introduction;
			this.introIndex = options.introIndex;
				
		},
		methods: {
			
			input(e) {
			    var val = e.detail.value.trim();
			    this.introduction = val.length > 100 ? val.substring(0,100) : val
			
			},
			clear() {
				this.setData({
					introduction: '',
				})
			},
			confirm() {
				var introduction = this.introduction;
				var userInfo = this.userInfo;
				var introInfo = this.introInfo
				var introIndex = this.introIndex;
				if (!introduction) {
				  introduction = introInfo[introIndex].content
				}
				ship.postRequest("/yh/business/user/modify/card/by/user", {
					introduction: introduction,
					userId: userInfo.userId,
				}).then(res => {
					console.log(res)
					if (res.retCode == "0000000") {
						wx.navigateBack({
						  delta: 1
						})
					}
				})
			},
			switchIndex(index) {
				
				var introInfo = this.introInfo;
				this.introduction = introInfo[index].content;
				this.introIndex = index;
				
			}
		}
		
	}
</script>

<style lang="scss" scoped>
.motto {
	background-color: #FAFAFA;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding-top: 48rpx;
	padding-bottom: 120rpx;
	box-sizing: border-box;
	.textarea {
		width: calc(100vw - 72rpx);
		height: 518rpx;
		background: #FFFFFF;
		box-shadow: 0 0 24rpx 0 rgba(0,0,0,0.06);
		border-radius: 16rpx;
		font-size: 28rpx;
		line-height: 28rpx;
		color: #333333;
		padding: 30rpx 36rpx;
    box-sizing: border-box;
    font-size: 24rpx;
	}
	.opt {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.opt-item {
		height: 80rpx;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
			&.cancel {
				width: 204rpx;
				background-color: #F2F3F5;
				color: #5C5C5C;
			}
			&.confirm {
				width: 278rpx;
				background-color: #2B72F0;
				margin-left: 72rpx;
				color: #FFFFFF;
			}	
		
		}
  }
  .templete {
    margin-top: 24rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .opt-item {
      width: 168rpx;
      height: 56rpx;
      background: #C8C8C8;
      border-radius: 8rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #FFFFFF;
      font-size: 28rpx;
      &.active {
        background-color: #5879F5;
      }
    }
  }
}

</style>