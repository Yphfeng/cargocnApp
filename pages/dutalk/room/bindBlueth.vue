<template>
	<view class="page">
		<view class="title">确认绑定</view>
		<view class="device-list">
		    <view class="searching flex-row flex-y-center">
		        <view class="flex-grow-1 ft17" >{{device.name}}</view>
		        <view class="flex-grow-0 ft16" :class="{'active':isbind}">{{!isbind?'待确认':'已连接'}}</view>
		    </view>
		</view>
		<image src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_D1A480A2FCDA4EB1A07EE17527635293.png" class="device-icon" />
		<view class="flex-row flex-y-center flex-x-center">
		    <view class="flex-grow-0 desc">请在</view>
		    <view class="flex-grow-0 desc active">{{lefttime}}s</view>
		    <view class="flex-grow-0 desc">内单击侧按键，确认绑定</view>
		</view>
		<view class="bind-success txt-center" v-if="successshow">
		    <image src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_99C23F52A8D94CF2A1408440FE350A1E.png" />
		    <view class="ft16">绑定成功</view>
		</view>
	</view>
</template>

<script>
	let app = null;
	export default {
		data() {
			return {
				cannotbind:false,
				lefttime:15,
				isbind:false,
				successshow:false,
				device:null,
				blueth:null
			};
		},
		created() {
		},
		onLoad(options){
			app = getApp();
			let self = this;
			uni.showLoading({});
			// console.log(options.item);
			self.device = JSON.parse(decodeURIComponent(options.item));
			let blueth = app.globalData.blueth;
			self.blueth = blueth;
			blueth.connectBlueth(self.device.deviceId).then(()=>{
			  blueth.readBlueBuffer(self.device.deviceId);
			  uni.hideLoading({
			    success: (res) => {},
			  });
			  for(let x=0;x<15;x++){
			    const t = setTimeout(()=>{
			       if(x == 0){
			         self.closeBind();
			       }
			       if(self.isbind){
			         clearTimeout(t);
			       }else{
					   self.lefttime = x
			       }
			     },15000 - x*1000)
			  }
			});
			app.globalData.user_action = self.getUserAction;
		},
		methods:{
			getUserAction(value){
				console.log(value);
				let self = this;
				if((value == 3)&&!self.cannotbind&&!self.isbind){
				  self.isbind = true;
				  self.successshow = true;
				  app.globalData.blue_status = true;//蓝牙绑定状态
				  wx.setStorageSync('bind_blueth',Object.assign(self.device,{link_status:true}));
				  setTimeout(()=>{
					self.successshow = true;
				    uni.navigateBack({
				    	delta:3
				    })
				  },2000);
				}
				
			},
			closeBind(){
			  if(this.isbind){
			    return;
			  }
			  let deviceID = this.device.deviceId;
			  let blueth = this.blueth;
			  this.cannotbind = true;
			  blueth.getDeviceState(deviceID).then((res)=>{
			    blueth.dislinkBlueth(deviceID,()=>{
			      uni.showToast({
			        title: '啊呀，绑定超时了',
			        icon:'none',
			        duration:5000
			      });
			      setTimeout(()=>{
			        uni.navigateBack();
			      },2000)
			    });
			  })
			}
		}
	}
</script>

<style lang="less" scoped>
@import url('./bindBlueth.less');
</style>
