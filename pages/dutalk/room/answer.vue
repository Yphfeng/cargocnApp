<template>
	<view class="page">
		<view class="items" v-for="(item,index) in list" :key="index">
		    <view class="title">{{item.title}}</view>
		    <view class="flex-row flex-y-top mb24" v-for="(qitem,qindex) in item.qs" :key="qindex">
		        <view class="flex-grow-0 list-style">{{qindex+1}}.</view>
		        <view class="flex-grow-1 ">
		            <view class="ft16">{{qitem.b}}</view>
		            <view >{{qitem.l}}</view>
		        </view>
		    </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
				  {title:'为什么搜索不到我的硬件？',qs:[
				    {b:'确认你的硬件在手机10米范围内；',l:'当硬件远离手机后，手机无法找到硬件。'},
				    {b:'确认硬件电量充足；',l:'硬件没电后无法被扫描到。请注意及时更换电池。'},
				    {b:'确认硬件处于可连接状态。',l:'当硬件与别的手机连接时，将无法扫描到硬件。'},
				  ]},
				  {title:'为什么显示无法连接？',qs:[
				    {b:'确认硬件处于可连接状态；',l:'当硬件与别的手机连接时，将无法连接硬件。'},
				    {b:'确认你的硬件在手机10米范围内；',l:''},
				    {b:'确认硬件电量充足；',l:''},
				  ]},
				  {title:'硬件指示灯状态说明',qs:[
				    {b:'通电后，按任意按钮都会有灯光响应；',l:'当硬件远离手机后，手机无法找到硬件。'},
				    {b:'若按下按钮无灯光响应，说明硬件没电了，需要更换电池。',l:''}
				  ]},
				]
			};
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
    background-color: #F7F7F7;
    .items{
        padding: 42rpx 48rpx 16rpx 64rpx;
        margin-top: 24rpx;
        background-color: white;
        position: relative;
        z-index: 0;
        &:last-child{
          border-bottom: 36rpx solid #f7f7f7;
        }
        .mb24{
            margin-bottom: 24rpx;
        }
        .list-style{
            margin-right: 20rpx;
            font-weight: bold;
        }
        .title{
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #333333;
            height: 120rpx;
            line-height: 120rpx;
            margin-bottom: 32rpx;
        }
        .ft16{
            font-size: 32rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #333333;
            margin-bottom: 8rpx;
        }
    }
}
</style>
