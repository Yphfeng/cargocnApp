<template>
	<view>
		<view class="moreData" :style="containerStyle" v-show="isMore == 'more'">
		</view>
		<view class="moreData" :style="containerStyle" v-show="isMore == 'loading'">
			<view class="spinner">
			  <view class="spinner-container container1">
				<view class="circle1"></view>
				<view class="circle2"></view>
				<view class="circle3"></view>
				<view class="circle4"></view>
			  </view>
			  <view class="spinner-container container2">
				<view class="circle1"></view>
				<view class="circle2"></view>
				<view class="circle3"></view>
				<view class="circle4"></view>
			  </view>
			  <view class="spinner-container container3">
				<view class="circle1"></view>
				<view class="circle2"></view>
				<view class="circle3"></view>
				<view class="circle4"></view>
			  </view>
			</view>
			<text class="noText">加载中</text>
		</view>
		<view class="moreData" :style="containerStyle" v-show="isMore == 'noMore'">
			<view class="dotted dotted_left" />
			<text class="noText">{{text}}</text>
			<view class="dotted dotted_right" />
		</view>
	</view>
	
</template>

<script>
	export default {
		name:"UniMorebox",
		props: {
			containerStyle: {
				default: ''
			},
			isMore: {
				type: String,
				default: 'more'
			},
			text: {
				type: String,
				default: '无更多数据'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
	.moreData {
		display: flex;
		flex-direction: row;
		padding: 0 50rpx;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #777777;
		.noText {
			padding: 0 30rpx;
		}
		.dotted {
			flex: 1;
			height: 2rpx;
			&.dotted_left {
				background-image: linear-gradient(to right, #FFFFFF, #B0B9BF);
			}
			&.dotted_right {
				background-image: linear-gradient(to left, #FFFFFF, #B0B9BF);
			}
		}
		.spinner {
		  width: 20px;
		  height: 20px;
		  position: relative;
		}
		 
		.container1 > view, .container2 > view, .container3 > view {
		  width: 6px;
		  height: 6px;
		  background-color: #ccc;
		 
		  border-radius: 100%;
		  position: absolute;
		  -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
		  animation: bouncedelay 1.2s infinite ease-in-out;
		  -webkit-animation-fill-mode: both;
		  animation-fill-mode: both;
		}
		 
		.spinner .spinner-container {
		  position: absolute;
		  width: 100%;
		  height: 100%;
		}
		 
		.container2 {
		  -webkit-transform: rotateZ(45deg);
		  transform: rotateZ(45deg);
		}
		 
		.container3 {
		  -webkit-transform: rotateZ(90deg);
		  transform: rotateZ(90deg);
		}
		 
		.circle1 { top: 0; left: 0; }
		.circle2 { top: 0; right: 0; }
		.circle3 { right: 0; bottom: 0; }
		.circle4 { left: 0; bottom: 0; }
		 
		.container2 .circle1 {
		  -webkit-animation-delay: -1.1s;
		  animation-delay: -1.1s;
		}
		 
		.container3 .circle1 {
		  -webkit-animation-delay: -1.0s;
		  animation-delay: -1.0s;
		}
		 
		.container1 .circle2 {
		  -webkit-animation-delay: -0.9s;
		  animation-delay: -0.9s;
		}
		 
		.container2 .circle2 {
		  -webkit-animation-delay: -0.8s;
		  animation-delay: -0.8s;
		}
		 
		.container3 .circle2 {
		  -webkit-animation-delay: -0.7s;
		  animation-delay: -0.7s;
		}
		 
		.container1 .circle3 {
		  -webkit-animation-delay: -0.6s;
		  animation-delay: -0.6s;
		}
		 
		.container2 .circle3 {
		  -webkit-animation-delay: -0.5s;
		  animation-delay: -0.5s;
		}
		 
		.container3 .circle3 {
		  -webkit-animation-delay: -0.4s;
		  animation-delay: -0.4s;
		}
		 
		.container1 .circle4 {
		  -webkit-animation-delay: -0.3s;
		  animation-delay: -0.3s;
		}
		 
		.container2 .circle4 {
		  -webkit-animation-delay: -0.2s;
		  animation-delay: -0.2s;
		}
		 
		.container3 .circle4 {
		  -webkit-animation-delay: -0.1s;
		  animation-delay: -0.1s;
		}
		 
		@-webkit-keyframes bouncedelay {
		  0%, 80%, 100% { -webkit-transform: scale(0.0) }
		  40% { -webkit-transform: scale(1.0) }
		}
		 
		@keyframes bouncedelay {
		  0%, 80%, 100% {
			transform: scale(0.0);
			-webkit-transform: scale(0.0);
		  } 40% {
			transform: scale(1.0);
			-webkit-transform: scale(1.0);
		  }
		}
		
	}
</style>
