<template>
	<view class="content">
		<view>
			<button @click="tryToVerify">异步</button>
			<button @click="testSyncFunc">同步</button>
			<button @click="close" style="position: relative;z-index: 99999;">关闭  湿答答</button>
			<button type="default" @click="init">测试</button>
			<button class="cContent" @click="topage">
				我就试试 
			</button>
			<button type="default" @longtap="sepak" @touchend="speakend" @touchcancel="speakend">长按说话</button>
			<button type="default" @click="sepak">点击说话</button>
			<button type="default" @click="speakend">关闭</button>
			<input type="text" style="border: 1px solid  red;height: 100px;" v-model="roomid" placeholder="房间号" />
		</view>
		<!-- <DJWebView alhpa="1" url="http://192.168.61.156:8080/web.html" style="width:750rpx;height:300px"></DJWebView> -->
		<!-- <view class="web-view">
		   <view class="top-box"></view>
		   <web-view v-if="webshow" :src="url"></web-view>
		   <view class="bottom-box"></view>
		</view> -->
	</view>
</template>

<script>
	// import * as RongIMLib from '@rongcloud/imlib-v4';
	// import RY from '../index/RY/index.js'; 
	// const im = RongIMLib.init({ appkey: app_RY_KEY });
	// const RongYun = new RY(im);
	// import { app_RY_KEY,SERVER_URL} from '../index/config/index.js';
	// import { init, connect } from '@rongcloud/imlib-uni'
	// init(app_RY_KEY);
	var wv;
	export default {
		data() {
			return {
				roomid:1999,
				title: 'Hello',
				url:'https://baidu.com',
				webshow:false
			}
		},
		onLoad() {
			let self = this;
			return;
			// let globalEvent = uni.requireNativePlugin('globalEvent');
			// globalEvent.addEventListener('socketConnectSuccess',(res)=>{
			// 	console.log(res,'scoket连接成功');
			// });
			// globalEvent.addEventListener('socketConnectFailure',(res)=>{
			// 	console.log(res,'scoket连接失败');
			// 	uni.showModal({
			// 		title:'',
			// 		content:"scoket连接失败",
			// 		showCancel:!1
			// 	});
			// });
			// self.records = uni.requireNativePlugin('DJRTCOpusModule');
			// self.records.initialize({userId:'1222121'+new Date().getTime(),roomId:1222,host:'192.168.6.162',port:'7777'},(res)=>{
			// 	console.log(res,'<------');
			// 	(Number(res.result) === 0)&&self.records.playOn(()=>{});
			// 	(Number(res.result) === 1)&&uni.showModal({
			// 		title:'提示',
			// 		content:"初始化失败",
			// 		showCancel:!1
			// 	});
				
			// });
			// plus.runtime.openURL('https://baidu.com');
			// const recorderManager = uni.getRecorderManager();
			// console.log(recorderManager);
			
		},
		created() {
			
		},
		onShow() {
			
		},
		methods: {
			speakend(){
				// this.records.microphoneOff((res)=>{
				// 	console.log(res,'《------off-----');
				// });
			},
			sepak(){
				// console.log(this.records);
				// this.records.microphoneOn((res)=>{
				// 	console.log(res,'《-----on------');
				// });
			},
			close(){
				this.webshow = false;
			},
			gotoNativePage(){
				this.captchaIns.gotoNativePage();
			},
			init() {
				// let  rtc = null;
				// // #ifdef APP-PLUS
				// 	rtc = uni.requireNativePlugin('TestModule')
				// // #endif
				console.log(rtc);
			},
			testSyncFunc(){
				this.captchaIns.testAsyncFunc({name:123},()=>{
					console.log('----');
				});
			},
			tryToVerify() {
				// console.log(this.captchaIns);
				// this.captchaIns.initialize();
				
			},
			topage(){
				console.log('----');
				// uni.navigateTo({
				// 	url:'/pages/room/blueStatus'
				// });
				// return;
				uni.navigateTo({
					url:'/pages/dutalk/room/room?appId=cargocn&mobile=18267832593&openId=92&name=bgng&avatar=https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg&groupId='+this.roomid+'&groupName=你好120啊'
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
