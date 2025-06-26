<template>
	<view class="page">
		<view style="height: 152rpx;width: 100vw;" class="flex-row flex-y-center">
			<!-- <image @click="navback" :style="{'marginTop':'calc(180rpx + '+statusBarHeight+'px)'}" src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210819_3B8ABFE9D69843C1889E722735C4259D.png" class="pre-img flex-grow-0" /> -->
		</view>
	    <view class="title txt-center">欢迎使用嘟嘟按钮</view>
	    <view class="ft17 txt-center">嘟嘟按钮你有我有 开车聊天得心应手</view>
	    <view class="device" :style="{'height':'calc(100vh - 346rpx - 372rpx - '+statusBarHeight+'px)'}">
	        <image src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_6B1FD428E8814B65B180CB0769DEE8C5.png" />
	    </view>
	    <view class="bottom-panel">
	        <view class="flex-grow flex-y-center btn" @click="navto" data-pass="1" data-url="/pages/dutalk/room/blueth">
	            <view class="flex-grow-1 ft18">绑定设备</view>
	            <image src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_84FAE4F819444CDF8EA7319A7FDEF5F0.png" class="flex-grow-0 icon"></image>
	        </view>
	        <view class="flex-row flex-y-center flex-x-center qs" @click="navto" data-url="/pages/dutalk/room/answer">
	            <image class="fkex-grow-0" src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_1C18760E9A9D4139AF7E31AC45F84A4A.png" />
	            <text class="flex-grow-0">常见问题</text>
	        </view>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight:0,
			};
		},
		created() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			console.log(this.statusBarHeight,uni.getSystemInfoSync());
			
		},
		onLoad() {
			
		},
		methods:{
			navback(){
				uni.navigateBack({});
			},
			navto(e){
				console.log(e.currentTarget.dataset.pass,e.currentTarget.dataset.url);
				wx.navigateTo({
				  url: e.currentTarget.dataset.url,
				  fail(err){
					  console.log(err);
				  }
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page,
		block,
		view,
		scroll-view,
		swiper,
		movable-view,
		icon,
		text,
		progress,
		button,
		checkbox,
		form,
		input,
		label,
		picker,
		picker-view,
		radio,
		slider,
		switch,
		textarea,
		navigator,
		audio,
		image,
		video,
		map,
		canvas,
		contact-button {
		  box-sizing: border-box;
		  margin: 0;
		  padding: 0;
		  font-family: PingFangSC-Semibold, PingFang SC;
		  border: 0;
		}
		::-webkit-scrollbar {
		  /*滚动条整体样式*/
		  width: 0px;
		  /*高宽分别对应横竖滚动条的尺寸*/
		  height: 0px;
		}
		::-webkit-scrollbar-thumb {
		  /*滚动条里面小方块*/
		  border-radius: 0px;
		  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		  background: white;
		}
		::-webkit-scrollbar-track {
		  /*滚动条里面轨道*/
		  box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
		  border-radius: 0px;
		  background: #ededed;
		}
		input {
		  caret-color: #999999;
		  border: none;
		  outline: none;
		}
		.pages {
		  background-color: white;
		  padding-bottom: 50rpx;
		}
		.flex {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		}
		.flex-row {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  -webkit-box-orient: horizontal;
		  flex-direction: row;
		  width: 100%;
		}
		.flex-col {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  -webkit-box-orient: vertical;
		  flex-direction: column;
		}
		.flex-grow-0 {
		  min-width: 0;
		  -webkit-box-flex: 0;
		  -ms-flex-positive: 0;
		  flex-grow: 0;
		  -ms-flex-negative: 0;
		  flex-shrink: 0;
		}
		.flex-grow-1 {
		  min-width: 0;
		  -webkit-box-flex: 1;
		  -ms-flex-positive: 1;
		  flex-grow: 1;
		  -ms-flex-negative: 1;
		  flex-shrink: 1;
		}
		.flex-x-center {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  -webkit-box-pack: center;
		  -ms-flex-pack: center;
		  justify-content: center;
		}
		.flex-x-spacebetween {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  justify-content: space-between;
		}
		.flex-x-spacearound {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  justify-content: space-around;
		}
		.flex-x-start {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  justify-content: flex-start;
		}
		.flex-x-end {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  justify-content: flex-end;
		}
		.flex-y-center {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  -webkit-box-align: center;
		  -ms-flex-align: center;
		  -ms-grid-row-align: center;
		  align-items: center;
		}
		.flex-y-top {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  -webkit-box-align: start;
		  -ms-flex-align: start;
		  -ms-grid-row-align: flex-start;
		  align-items: flex-start;
		}
		.flex-y-bottom {
		  display: -webkit-box;
		  display: -webkit-flex;
		  display: flex;
		  -webkit-box-align: end;
		  -ms-flex-align: end;
		  -ms-grid-row-align: flex-end;
		  align-items: flex-end;
		}
		.bg-img {
		  background-position: 50% 50%;
		  background-repeat: no-repeat;
		  background-size: 100%;
		  background-color: transparent;
		}
		.txt-center {
		  text-align: center;
		}
		.txt-right {
		  text-align: right;
		}
		.t-left {
		  text-align: left;
		}
		.pre-img{
			width: 46rpx;
			height: 46rpx;
		}
		.status-barHeight{
			width: 100%;
		}
.page{
    width: 100vw;
    height: 100vh;
    background: linear-gradient(180deg, #383857 0%, #151617 100%);
	.pre-img{
		margin-left: 32rpx;
	}
    .title{
        font-size: 48rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;

    }
    .ft17{
        font-size: 34rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 16rpx;
    }
    .device{
        width: 100%;
        position: relative;
		height: 800rpx;
        >image{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 100%;
            height: 428rpx;
        }
    }
    .bottom-panel{
        height: 372rpx;
        >.btn{
            width: 500rpx;
            height: 132rpx;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
            border-radius: 83rpx;
            // border: 2rpx solid rgba(255, 255, 255, 0.08);
            padding: 0 70rpx 0 80rpx;
            margin: auto;
            >.ft18{
                font-size: 36rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
            }
            >.icon{
                width: 80rpx;
                height: 80rpx;
            }
        }
        >.qs{
            margin-top: 152rpx;
            >text{
                font-size: 28rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.3);
            }
            >image{
                width: 32rpx;
                height: 32rpx;
                margin-right: 6rpx;
            }
        }
    }
}
</style>
