<template>
	<view class="page">
		<view class="title">发现设备</view>
		<view class="device-list" style="height:calc(100vh - 164rpx - 88rpx);">
		    <view class="items flex-row flex-y-center" @click="tobind" :data-item="JSON.stringify(item)" v-for="(item,index) in list" :key="index">
		        <image src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_99350580E3074B358C2772CD3D7E62BD.png" class="flex-grow-0" />
		        <view class="flex-grow-1 ft17">{{item.name}}</view>
		    </view>
		    <view class="searching flex-row flex-y-center">
		        <image src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210823_3FB87AD92E7841E48CADE42F51302F24.png" class="flex-grow-0" />
		        <view class="flex-grow-1">正在搜索</view>
		    </view>
		</view>
		<view class="err-msg" v-if="list.length == 0">暂时搜不到设备？请确保已经打开<text @click="openblue" style="color: #007AFF;">蓝牙</text>，设备电量充足，并在手机10米范围内</view>
	</view>
</template>

<script>
	let app = {};
	export default{
		data(){
			return{
				list:[]
			}
		},
		created() {
			
		},
		onShow(){
			let self = this;
			app = getApp();
			app.globalData.blueth&&app.globalData.blueth.closeBlueth().then(()=>{
				app.globalData.blueth.init().then((res)=>{
					app.globalData.blueth.startBluethSearch().then((res)=>{
						console.log(res.errMsg.split(':')[1] == 'ok');
						res&&(res.errMsg.split(':')[1] == 'ok')&&app.globalData.blueth.onSearching((list)=>{
							self.list = list;
						})
					})
				});
			});
		},
		created() {
			let self = this;
		},
		methods:{
			tobind(e){
				wx.navigateTo({
				  url: "/pages/dutalk/room/bindBlueth?item="+encodeURIComponent(e.currentTarget.dataset.item)
				})
			},
			openblue(){
				app.globalData.permision.gotoAppPermissionSetting();
			}
		}
	}
</script>

<style lang="less" scoped>
 @import url('./blueth.less');
</style>
