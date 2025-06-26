<template>
	<view>
		<view class="page">
		    <view >
		        <image src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_82C422A5ED564160B2F5910CF0839E79.png" class="device-icon" />
		        <view class="electricity flex-row flex-y-center flex-x-center" :class="{dislink:!device.link_status}">
		            <view class="dott flex-grow-0"  :class="{dislink:!device.link_status}"></view>
		            <view class="flex-grow-0 status">{{device.link_status?'已连接':'未连接'}}</view>
		            <image v-if="device.link_status" class="flex-grow-0 left" :src="electricity[left]" />
		        </view>
		    </view>
		    <view class="panel-list">
		        <view class="items flex-row flex-y-center">
		            <view class="flex-grow-1 ft17 b ">设备名称</view>
		            <view class="flex-grow-0 ft17" style="padding-right:40rpx">{{device.name}}</view>
		        </view>
		         <view class="items flex-row flex-y-center">
		            <view class="flex-grow-1 ft17 b ">自动连接</view>
		            <view class="flex-grow-0 ft17" style="padding-right:40rpx">
		                <switch :checked="autolink" @change="switchchange"/>
		            </view>
		        </view>
		        <view class="items flex-row flex-y-center" style="margin-top:24rpx" @click="navto">
		            <view class="flex-grow-1 ft17 b ">常见问题</view>
		            <view class="flex-grow-0 ft17" style="padding-right:40rpx">
		                <image src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_12DFB60B376048D485E0C87A17A8ED91.png" class="navto" />
		            </view>
		        </view>
		    </view>
		    <view class="action">
		        <view class="dislink btn txt-center" @click="changelink">{{device.link_status?'断开连接':'连接设备'}}</view>
		        <view class="delete btn txt-center" @click="deletedevice">删除设备</view>
		    </view>
		</view>
	</view>
</template>

<script>
	let app = null;
	import blueth from '../index/bluetooth/index.js';
	export default {
		data() {
			return {
				electricity:[
				  'https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_815C64F456A84C539969BC93F66FB2EA.png',//100
				  'https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_170A27F3A4EE4D44A0001EA581BF55CF.png',//75
				  'https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_D426CA965DB0444294B13AC41F77E83A.png',//50
				  'https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_ABB15C31A8B549659A8E2FAD46EDC750.png'//25
				],
				left:0,
				autolink:true,//自动连接
				device:{}
			};
		},
		onLoad() {
			this.get_blue_th_state();
		},
		created() {
			 app = getApp();
		},
		methods:{
			navto(){
				console.log('----');
				uni.navigateTo({
					url:'/pages/dutalk/room/answer'
				});
			},
			get_blue_th_state(){
			  const self = this;
			  let device = uni.getStorageSync('bind_blueth');
			  console.log(device);
			  let emit_character_read = uni.getStorageSync('emit_character_read');
			  self.device = device;
			},
			switchchange(e){
			  // console.log(e);
			  let bind_blueth = uni.getStorageSync('bind_blueth');
			  bind_blueth.blue_not_auto = !e.detail.value;//不主动连接
			  uni.setStorageSync('bind_blueth', bind_blueth);
			  this.autolink =  e.detail.value;
			  e.detail.value&&this.changelink(true)//开关触发
			},
			resetvalue(bind_blueth){
			  this.device = bind_blueth;
			  uni.setStorageSync('bind_blueth', bind_blueth);
			},
			deletedevice(){
			  uni.showModal({
			    title:'',
			    content:'确定删除该设备？',
			    confirmColor:'#333333',
			    cancelColor:'#6b6868',
			    success(e){
			      if(e.confirm){
			        let bind_blueth = uni.getStorageSync('bind_blueth');
			        bind_blueth = null;
			        app.globalData.blueth.closeBlueth();
			        uni.setStorageSync('bind_blueth', bind_blueth);
					app.globalData.blue_status = false;
			        uni.navigateBack();
			      }
			    }
			  })
			  console.log(app.globalData);
			},
			changelink(manual){
			  const self = this;
			  let bind_blueth = uni.getStorageSync('bind_blueth');
			  console.log(bind_blueth);
			  if(!self.device.deviceId){
			    uni.navigateTo({url:'/pages/room/blueth',success(){uni.hideLoading()}})
			  }
			  if(!this.device.link_status){
			    uni.showLoading({
			      title: 'loading'
			    });
			    if(self.autolink||(!self.autolink&&!self.device.link_status)){
			      app.globalData.blueth = new blueth(app);
			      app.globalData.blueth.init().then((res)=>{
			        app.globalData.blueth.connectBlueth(self.device.deviceId).then(()=>{
			          app.globalData.blueth.readBlueBuffer(self.device.deviceId);
			          uni.hideLoading({
			            success: (res) => {},
			          });
			          bind_blueth.link_status = true;
			          self.resetvalue(bind_blueth);
			        });
			      });
			      return;
			    }
			    return;
			  }
			  if(manual === true){
			    console.log('...manual');
			    uni.hideLoading({
			      success: (res) => {},
			    });
			    return;
			  }//如果不是手动点击 通过自动连接开关的话 不做操作
			  console.log('准备断开');
			  app.globalData.blueth.dislinkBlueth(this.device.deviceId,()=>{
			    bind_blueth.link_status=false;
			    bind_blueth.blue_not_auto = true;
			    self.resetvalue(bind_blueth);
			  });
			}
		}
	}
</script>


<style lang="less" scoped>
@import url('./blueStatus.less');
</style>

