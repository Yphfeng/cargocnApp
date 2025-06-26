<template>
	<view class="themeCard">
		<canvas canvas-id="answerCanvas" class="answerCanvas" :style="{height: shareHeight*2 + 'rpx', width: shareWidth*2 + 'rpx'}"></canvas>
		<canvas canvas-id="canvas" style="width: 225px; height: 180px;position: absolute;top:-1000px"></canvas>
		<canvas canvas-id="mycardcanvas" :style="{width: '750rpx',height: saveHeight*2 + 'rpx'}" class="canvas-wrapper"></canvas>
		<view class="business-share" v-if="themeObj">
		    <view :class="[themeObj ? 'businessCard' + themeObj.theme : 'businessCard-1-1']" v-if="themeObj.theme != '4-1'">
		        <image :src="themeObj.styleImg" class="wx_card_bg"></image>
		        <view class="wx_card_inner">
		            <view class="name">{{themeObj.nickname}}</view>
		            <view class="type" :class="{'hide': carSourceInCard}">
		                <view class="type_small">开</view>
		                <view class="type_big pl-8">{{carSourceInCard.carLength}}米{{carSourceInCard.carModel}}</view>
		            </view>
		            <view class="card_carSource" :class="{'hide': carSourceInCard}">
		                <text class="type_small">找</text>
		                <view class="find_bold pl-8 pr-8">{{carSourceInCard.sender}}-{{carSourceInCard.receiver}}</view>
		                <text class="type_small">{{carSourceInCard.longTimeFlag ? '长期货源' : '临时货源'}}</text>
		            </view>
		            <view class="card_motto">
		                <view class="card_motto_text">{{themeObj.motto}}</view>
		                <view class="row align-center">
		                    <text>{{themeObj.mobile}}</text>
		                    <view class="phone"></view>
		                </view>
		            </view>
		            <view class="location">
		                <text class="city"></text>
		                <view class="address_detail" v-if="themeObj.address">
		                    <view class="address">{{themeObj.address}}</view>
		                    <view class="date">{{themeObj.trackTime}}</view>
		                    <view class="addr"></view>
		                </view>
		            </view>
		        </view>
		        <view class="avatar-content">
		            <image :src="themeObj.userAvatar" mode="aspectFill" class="wx_user"></image>
		            <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/wx_user_brand.png" class="wx_user_brand" v-if="themeObj.isBindDevice == 1"></image>
		        </view>
		    </view>
		    <view class="businessCard-1-1" v-else>
		        <image :src="themeObj.styleImg" class="wx_card_bg"></image>
		        <view class="wx_card_inner">
		            <view class="name">{{themeObj.nickname}}</view>
		            <view class="type" :class="{'hide': carSourceInCard}">
		                <view class="type_small">开</view>
		                <view class="type_big pl-8">{{carSourceInCard.carLength}}米{{carSourceInCard.carModel}}</view>
		            </view>
		            <view class="card_carSource"  :class="{'hide': carSourceInCard}">
		                <text class="type_small">找</text>
		                <view class="find_bold pl-8 pr-8">{{carSourceInCard.sender}}-{{carSourceInCard.receiver}}</view>
		                <text class="type_small">{{carSourceInCard.longTimeFlag ? '长期货源' : '临时货源'}}</text>
		            </view>
		            <view class="card_motto">
		                <view class="card_motto_text">{{themeObj.motto}}</view>
		                <view class="row align-center">
		                    <text>{{themeObj.mobile}}</text>
		                    <view class="phone"></view>
		                </view>
		            </view>
		            <view class="location" v-if="themeObj.theme != '1-4'">
		                <text class="city"></text>
		                <view class="address_detail" v-if="themeObj.address">
		                    <view class="address">{{themeObj.address}}</view>
		                    <view class="date">{{themeObj.trackTime}}</view>
		                    <view class="addr"></view>
		                </view>
		            </view>
		            <view class="location4" v-if="themeObj.address && themeObj.theme == '1-4'">
		                <text class="mi">我在</text>
		                <text class="address">{{themeObj.address}}</text>
		                <view class="addr"></view>
		            </view>
		        </view>
		        <view class="avatar-content">
		            <image :src="themeObj.userAvatar" mode="aspectFill" class="wx_user"></image>
		            <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/wx_user_brand.png" class="wx_user_brand" v-if="themeObj.isBindDevice == 1"></image>
		        </view>
		    </view>
		    <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/share_to_btn.png" class="share_to_btn"></image>
		</view>
		<view class="business" v-if="themeObj">
		    <view :class="themeObj ? ('businessCard-' + themeObj.theme) : 'businessCard-1-1'" v-if="themeObj.theme != '4-1'">
		        <image :src="themeObj.styleImg" class="wx_card_bg"></image>
		        <view class="wx_card_inner">
		            <view class="name">{{themeObj.nickname}}</view>
		            <view class="type" :class="{'hide': carSourceInCard}">
		                <view class="type_small">开</view>
		                <view class="type_big pl-8">{{carAndType}}</view>
		            </view>
		            <view class="card_carSource" :class="{'hide': carSourceInCard}">
		                <text class="type_small">找</text>
		                <view class="find_bold pl-8 pr-8">{{senderAndReceive}}</view>
		                <text class="type_small">{{carSourceInCard.longTimeFlag ? '长期货源' : '临时货源'}}</text>
		            </view>
		            <view class="card_motto">
		                <view class="card_motto_text">{{themeObj.motto}}</view>
		                <view class="row align-center">
		                    <text>{{themeObj.mobile}}</text>
		                    <view class="phone"></view>
		                </view>
		            </view>
		            <view class="location" v-if="themeObj.theme != '1-4'">
		                <text class="city" ></text>
		                <view class="address_detail" v-if="themeObj.address">
		                    <view class="address">{{themeObj.address}}</view>
		                    <view class="date">{{themeObj.trackTime}}</view>
		                    <view class="addr"></view>
		                </view>
		            </view>
		            <view class="location4" v-if="themeObj.address && themeObj.theme == '1-4'">
		                <text class="mi">我在</text>
		                <text class="address">{{themeObj.address}}</text>
		                <view class="addr"></view>
		            </view>
		        </view>
		        <view class="avatar-content answer_draw_canvas">
		            <image :src="themeObj.userAvatar" mode="aspectFill" class="wx_user"></image>
		            <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/wx_user_brand.png" class="wx_user_brand" v-if="themeObj.isBindDevice == 1"></image>
		        </view>
		    </view>
		    <view :class="[themeObj ? 'businessCard' + themeObj.theme : 'businessCard-1-1']" v-else>
		        <image :src="themeObj.styleImg" class="wx_card_bg"></image>
		        <view class="wx_card_inner">
		            <view class="name">
		                <text class="name-main">{{themeObj.nickname}}</text>
		                <text class="phone">{{themeObj.mobile}}</text>
		            </view>
		            <view class="type">
		                <view class="type-item" :class="{'hide': carSourceInCard}">
		                    <text class="type_small">开</text>
		                    <text class="type_big pl-8">{{carSourceInCard.carLength}}米{{carSourceInCard.carModel}}</text>
		                </view>
		                <view class="type-item" :class="{'hide': carSourceInCard}">
		                    <text class="type_small">找</text>
		                    <text class="type_big pl-8">{{carSourceInCard.sender}}-{{carSourceInCard.receiver}}</text>
		                </view>
		            </view>
		            <view class="card_motto">
		                <view class="card_motto_text">{{themeObj.motto}}</view>
		                <view class="location">
		                    <view class="addr"></view>
		                    <text>{{themeObj.address}}</text>
		                    <text class="time">{{themeObj.trackTime}}</text>
		                </view>
		            </view>
		        </view>
		    </view>
		</view>	
	</view>
</template>

<script>
	export default {
		name: "themeCard",
		props: {
			themeObj: {
				default: null,
				type: Object,
			},
			carSourceInCard: {
				default: null,
				type: Object,
			}
		},
		data() {
			return {
				shareWidth: 0,
				shareHeight: 0,
				saveHeight: 0,
			}
		},
		created() {
			
		},
		computed: {
			carAndType() {
				var themeObj = this.themeObj;
				if (!themeObj) return "";
				if (!themeObj.carLength) return "";
				return themeObj.carLength + '米' + themeObj.carModel
			},
			senderAndReceive() {
				var themeObj = this.themeObj;
				if (!themeObj) return "";
				if (!themeObj.sender) return "";
				return themeObj.sender + '-' + themeObj.receiver
			}
		},
		methods: {
			
			
		}
	}
</script>

<style lang="less">
	@import url("./theme/classic/classic-1.less");
	@import url("./theme/classic/classic-2.less");
	@import url("./theme/classic/classic-3.less");
	@import url("./theme/classic/classic-4.less");
	@import url("./theme/universe/universe-1.less");
	
	@import url("./theme/countryStyle/countryStyle-1.less");
	@import url("./theme/countryStyle/countryStyle-2.less");
	@import url("./theme/countryStyle/countryStyle-3.less");
	@import url("./theme/countryStyle/countryStyle-4.less");
	
	@import url("./theme/bigPicture/bigPicture-1.less");
	.themeCard {
	}
	
	.row {
	    display: flex;
	    flex-direction: row;
	}
	.align-center {
	    align-items: center;
	    
	}
	
	.business-share  {
	  position: absolute;
	  top: -9999px;
	  z-index: -9999;
	  width: 750rpx;
	  height: 600rpx;
	  .businessCard-share-innner {
	    height: 400rpx;
	    width: 750rpx;
	    position: relative;
	    margin: 0;
	    overflow: hidden;
	    .wx_card_bg {
	      height: 400rpx;
	      width: 750rpx;
	      border-radius: 24rpx 24rpx 0 0;
	    }
	    .wx_card_inner {
	      width: 750rpx;
	      border-radius: 24rpx 24rpx 0 0;
	      .name {
	        font-size: 28rpx;
	        font-weight: 400;
	        color: #FFFFFF;
	        line-height: 28rpx;
	        margin-bottom: 24rpx;
	      }
	      .type {
	        margin-bottom: 24rpx;
	        display: flex;
	        flex-direction: row;
	        align-items: center;
	        flex: 1;
	      }
	      .type_small {
	        font-size: 32rpx;
	        font-weight: 400;
	        color: #E3E3E3;
	        line-height: 40rpx;
	      }
	      .type_big {
	        font-size: 40rpx;
	        font-weight: bold;
	        color: #FFFFFF;
	        line-height: 40rpx;
	        display: flex;
	        flex-direction: row;
	        width: 350rpx;
	      }
	      .card_carSource {
	        margin-bottom: 92rpx;
	        display: flex;
	        flex-direction: row;
	        align-items: center;
	      }
	      .find_bold {
	        width: calc(~"100vw - 450rpx");
	        font-size: 40rpx;
	        font-weight: bold;
	        color: #FFFFFF;
	        line-height: 40rpx;
	      }
	    }
	    .avatar-content {
	      position: absolute;
	      top: 40rpx;
	      right: 30rpx;
	      width: 122rpx;
	      height: 122rpx;
	      border-radius: 122rpx;
	      z-index: 2;
	      display: flex;
	      justify-content: center;
	      align-items: center;
	      background-color: #FFFFFF;
	      .wx_user {
	        width: 118rpx;
	        height: 118rpx;
	        border-radius: 118rpx;
	      }
	    }
	  }
	  .answer_canvas {
	    margin-bottom: 0;
	  }
	  .share_to_btn {
	    width: 750rpx;
	    height: 200rpx;
	  }
	}

</style>