<template>
	<view class="page">
		<view class="status-barHeight" :style="{height:(18+statusBarHeight)+'px'}"></view>
		<view class="flex-row flex-y-center">
		   <image @click="navback" src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210819_3B8ABFE9D69843C1889E722735C4259D.png" class="pre-img flex-grow-0" />
		   <view class="flex-grow-1 room-id" :class="{'isand':isand}">
			   {{info.name}}
		   </view>
		   <!-- <image style="width: 64rpx;height: 64rpx;margin-right: 24rpx;" v-if="myinfo.type == 1" @click="todevice" :src="blueth_status?'https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210819_8B1A60D2CACD4CE18DED1885DB3CEEEB.png':'https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210819_91A4B96C3D6145438DB236E2E3E40375.png'" class="setting" /> -->
		</view>
		<view class="flex-row flex-y-top">
			<view class="flex-grow-0 user-list">
				<view class="flex-row flex-y-center"  v-for="(item,index) in avatar_list" :key="index" v-if="index>4?false:true">
					<image catchtap="opensinguser" class="new-avatar flex-grow-0" :data-item="item" v-if="(index>3)?false:true" :src="item.avatar?item.avatar:''"  />
					<view class="user-num txt-center flex-grow-0" v-if="index==4">{{avatar_list.length}}</view>
					<view class="flex-grow-1 nickname" v-if="index<4">{{item.nickName}}</view>
				</view>
			</view>
			<view class="flex-grow-1 speaking-avatar txt-center">
				<image v-if="!isspeak&&!isothersepak" class="no" src="https://yogo-file-test.obs.cn-east-3.myhuaweicloud.com/home/img/20210820_1315851E5AB54B6A81EAADBD2970F791.png" />
				<image v-else class="no" style="width:232rpx;height:232rpx;border-radius:500rpx" :src="speakavatar" />
				<view class="ft20 txt-center" style="height: 80rpx;line-height: 80rpx;overflow: hidden;text-overflow: ellipsis;width: 100%;">{{(isspeak||isothersepak)?speaknickname:''}}</view>
			</view>
		</view>
		<view class="panel">
			<view class="distouch-box">
				<view class="msg-list" :scroll-into-view="'to'+viewId">
					<view class="flex-row flex-y-center view" v-for="(item,index) in msg_list" :key="index" :id="'to'+index+1">
						<text class="flex-grow-0" style="max-width: 540rpx;overflow-x: hidden;text-overflow: ellipsis;white-space: nowrap;overflow-y: hidden;">{{item.t}}</text>
						<text class="flex-grow-1 elediv" :class="{ban:(item.status == 2)}">{{(item.status == 1)?'来了':''}} {{(item.status == 2)?'被禁言':''}}  {{(item.status == 3)?item.roleTxt:''}} {{(item.status == 4)?'被移出群聊':''}}</text>
					</view>
				</view>
			</view>
			<view class="flex-row flex-x-center speak-panel flex-y-center" >
				<button type="default" hover-class="speak-active" @longpress="manualspeak" @touchstart="clicksatrt" @click="clickSpeakend" @touchend="speakend" @touchcancel="speakend">按住说话</button>
			</view>
		</view>
		<image v-if="isspeak&&myself" src="https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211201_899C79D9284D4D54B9C85F9BA99ADEC6.gif" class="sb-speaking"></image>
	</view>
</template>

<script>
	import blueth from '../index/bluetooth/index.js';
	import { app_RY_KEY,SERVER_URL} from '../index/config/index.js';
	import makeData from '../index/https/index.js';
	import { preload } from './preload.js';
	import Records from './record.js';
	import MessageBox from './messageBox.vue';
	import imstatus from './im.js';
	import permission from '../index/utils/permission.js';
	// import { init, connect ,getMessageByUId,quitChatRoom,disconnect,addReceiveMessageListener,addConnectionStatusListener,joinChatRoom,addTypingStatusListener,getChatRoomInfo} from '@rongcloud/imlib-uni';
	let RongYun = null;
	let app = null;
	// let brand = uni.getSystemInfoSync().brand;
	// console.log('品牌'+brand);
	
	init(app_RY_KEY);
	export default {
		components:{MessageBox},
		data() {
			return {
				webshow:false,
				weburl:'',
				canclose:'1',
				myself:false,
				blueth_status:false,
				statusBarHeight:0,
				speakavatar:null,
				speaknickname:'',
				isspeak:false,
				isothersepak:false,
				avatar_list:[],
				viewId:1,
				speakerid:null,
				msg_list:[],
				totalCount:0,
				myinfo:{
					type:1
				},
				info:{
					imToken:'',
					roomid:'207343223',
					name:'LOADING'
				},
				chatRoom:null,
				sysinfo:{ andr:'',ios:'' },
				isand:false,
				options:null,
				need_end_count:0,
				touchTime:0,
				scoketconnect:false
			};
		},
		created() {
			// console.log(getCurrentPages()[0].$route.fullPath);
			let self = this;
			
			disconnect();
			app = getApp();
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			return;
		},
		onLoad(options) {
			console.log('load');
			let self = this;
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			uni.setStorageSync('appId',options.appId);
			this.options = options;
			// uni.showLoading({
			// 	title:'加载中'
			// });
			this.blueth = new blueth(this);
			console.log('导航栏高度' +this.statusBarHeight);
			if(uni.getSystemInfoSync().platform == 'ios'){
				uni.loadFontFace({
				  family: 'DIN-BlackItalic', 
				  source: "url('data:font/woff;charset=utf-8;base64,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') format('woff')",
				  success: console.log,
				  fail: console.log,
				  timeout:6000,
				});
			}
		},
		onShow() {
			app = getApp();
			console.log(app.globalData.blue_status,'蓝牙状态');
			let self = this;
			(app.globalData.user_action = this.useraction );
			let options = self.options;
			if(self.scoketconnect){
				console.log('已存在scoket连接');
				return;
			}
			// uni.getSystemInfo({
			// 　　success: function(res) { // res - 各种参数
			// 　　    let info = uni.createSelectorQuery().select(".distouch-box");
			// 　　　  info.boundingClientRect(function(data) { //data - 各种参数
			// 			imstatus(addReceiveMessageListener,self,data.height);
			// 　　　  　	console.log(data.height,'-----------------------------------------------》')  // 获取元素宽度
			// 　　    }).exec()
			// 		preload(options,self).then((res)=>{
			// 			uni.setStorageSync('userinfo',{token:res.token,...res.data,channel_id:res.channel_id});
			// 			self.info.imToken = res.data.imToken;
			// 			self.info.roomid = res.channel_id.toString();
			// 			self.info.token = res.token;
			// 			self.info.openId = res.data.openId;
			// 			self.info.id = res.data.id;
			// 			self.info.name = options.groupName;
			// 			console.log(res.data,RongYun,'-<<<<<<<<<<<<<<<-');
			// 			Records(self,self.info).then(()=>{
			// 				console.log('<--step2---');
			// 			});
			// 			connect(res.data.imToken, (result) => {
			// 			  if (result.code === 0) {
			// 				console.log('连接成功',result, result.userId)
			// 				const targetId = res.channel_id.toString()
			// 				const messageCount = 1 // 获取历史消息的数量
			// 				joinChatRoom(targetId, messageCount,
			// 				({code}) => {
			// 					if(code === 0){
			// 						self.joinroom();
			// 						console.log(targetId, messageCount)
			// 						// 相关业务操作
			// 					}
			// 				})
			// 			  } else {
			// 				console.log('连接失败', result.code)
			// 			  }
			// 			  addConnectionStatusListener((status)=>{
			// 				  console.log(status,'------------------------addConnectionStatusListener-------------------');
			// 			  });
			// 			  uni.hideLoading();
			// 			});
			// 		});
			//     }
			// });	
			// console.log(addReceiveMessageListener,'-------------addReceiveMessageListener----------');		
			this.blueth_status = app.globalData.blue_status?true:false;
			
		},
		onReady() {
			app = getApp();
			console.log(app.globalData.blue_status,'蓝牙状态');
			console.log(uni.getStorageSync('bind_blueth'));
			!app.globalData.blue_status&&this.init(this.options);//蓝牙
			console.log(app.globalData.blue_status,'蓝牙状态');
			let self = this;
			(app.globalData.user_action = this.useraction );
			let options = self.options;
			if(self.scoketconnect){
				console.log('已存在scoket连接');
				return;
			}
			uni.getSystemInfo({
			　　success: function(res) { // res - 各种参数
			　　    let info = uni.createSelectorQuery().select(".distouch-box");
			　　　  info.boundingClientRect(function(data) { //data - 各种参数
						imstatus(addReceiveMessageListener,self,data.height);
			　　　  　	console.log(data.height,'-----------------------------------------------》')  // 获取元素宽度
			　　    }).exec()
					preload(options,self).then((res)=>{
						uni.setStorageSync('userinfo',{token:res.token,...res.data,channel_id:res.channel_id});
						self.info.imToken = res.data.imToken;
						self.info.roomid = res.channel_id.toString();
						self.info.token = res.token;
						self.info.openId = res.data.openId;
						self.info.id = res.data.id;
						self.info.name = options.groupName;
						console.log(res.data,RongYun,'-<<<<<<<<<<<<<<<-');
						Records(self,self.info).then(()=>{
							console.log('<--step2---');
						});
						connect(res.data.imToken, (result) => {
						  if (result.code === 0) {
							console.log('连接成功',result, result.userId)
							const targetId = res.channel_id.toString()
							const messageCount = 1 // 获取历史消息的数量
							joinChatRoom(targetId, messageCount,
							({code}) => {
								if(code === 0){
									self.joinroom();
									console.log(targetId, messageCount)
									// 相关业务操作
								}
							})
						  } else {
							console.log('连接失败', result.code)
						  }
						  addConnectionStatusListener((status)=>{
							  console.log(status,'------------------------addConnectionStatusListener-------------------');
						  });
						  uni.hideLoading();
						});
					});
			    }
			});	
			console.log(addReceiveMessageListener,'-------------addReceiveMessageListener----------');		
			this.blueth_status = app.globalData.blue_status?true:false;
			
		},
		onUnload() {
			let self = this;
			// console.log(self.chatRoom.quit);
			let currrentPage = getCurrentPages()[0].route;
			console.log(currrentPage,'---所在页面--',currrentPage.indexOf('/dutalk/room')!=-1);
			// if(currrentPage.indexOf('/dutalk/room')!=-1){return}
			self.isothersepak = false;
			const targetId = self.info.roomid;
			if(uni.getSystemInfoSync().platform == 'ios'){
				console.log('--ios--',self.records);
				self.records.exitRoom(()=>{
					console.log('资源释放');
				})
			}//安卓端要自己释放资源
			quitChatRoom(targetId,
			    ({code}) => {
					console.log('退出聊天室成功------');
					disconnect();
			        // 退出聊天室成功
			        if(code === 0){
						self.imquit();
			        }
			    }
			)     
		},
		
		methods:{
			clicksatrt(event){
				event.preventDefault()
				// uni.showToast({
				// 	title:'start',
				// 	duration:3000
				// });
			},
			imquit(){
				let self = this;
				uni.request({
					url:SERVER_URL+'/channel/quit',
					method:'POST',
					timeout:60000,
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data:makeData({ id:self.info.roomid }),
					success(res) {
					console.log('-------退出房间成功---------');
					if(res.data.result === 1){
						uni.showModal({
							title:'提示',
							content:res.data.msg,
							showCancel:!1
						})
						return;
					}
					    console.log(res,'退出成功');
					},
					fail(err) {
						console.log(err);
					}
				})
			},
			getnotice(){
				let self = this;
				uni.request({
					url:SERVER_URL+'/app-info/notice',
					method:'POST',
					timeout:60000,
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data:makeData({ id:self.info.roomid }),
					success(res) {
						if(res.data.result === 1){
							uni.showModal({
								title:'提示',
								content:res.data.msg,
								showCancel:!1
							})
							return;
						}
						res.data.data&&(self.webshow = true);
						res.data.data&&(self.weburl =  res.data.data.description); // 'http://192.168.6.164:4397/dutalk/')// 
						res.data.data&&(self.canclose = res.data.data.configKey);// 1 可以关闭，2 不可以关闭
						console.log(res.data.data,'公告栏');
					},
					fail(err) {
						console.log(err);
					}
				});
			},
			init(options){
				let self = this;
				app.globalData.blueth = new blueth(app);
				app.globalData.blueth.init().then((res)=>{
					console.log('--蓝牙模块初始化--');
					app.globalData.blueth.closeBlueth().then(()=>{
						console.log('-蓝牙连接关闭-');
						app.globalData.blueth.init().then((res)=>{
							let bind_blueth = uni.getStorageSync('bind_blueth');
							console.log(bind_blueth);
							if(bind_blueth&&!bind_blueth.blue_not_auto){
								console.log('自动连接蓝牙中....');
								app.globalData.blueth.connectBlueth(bind_blueth.deviceId).then(()=>{
								  console.log('开始订阅');
								  app.globalData.blueth.readBlueBuffer(bind_blueth.deviceId);
								  bind_blueth.link_status = true;
								  self.blueth_status = true;
								  uni.setStorageSync('bind_blueth',bind_blueth);
								  wx.showToast({
								    title: '蓝牙已连接',
								    icon:'none'
								  })
								});
							}
						});
					});
					
				});
				this.isand = true;
				return
			},
			manualspeak(e){
			  let self = this;
			  self.useraction(5);
			},
			speakend(e){
				let self = this;
				// e.preventDefault();
				console.log('----------------------end解除-----------------------');
				  // this.isspeak = false;
				console.log('---------------------end------------');
				self.isspeak&&self.myself&&self.useraction(6);
				for(let x=0;x<2;x++){
					setTimeout(()=>{
						self.isspeak&&self.myself&&self.useraction(6);
					},500*x);
				};
			},
			clickSpeakend(){
				let self = this;
				console.log('-----监听到点击事件------');
				// uni.showToast({
				// 	title:'end',
				// 	duration:3000
				// });
				setTimeout(()=>{
					self.useraction(6);
				},1000);
			},
			todevice(){
				uni.hideLoading();
				if(this.blueth_status){
					uni.navigateTo({
						url:'/pages/dutalk/room/blueStatus'
					});
					return
				}
				uni.openBluetoothAdapter({
					success(res) {
						console.log(res);
						uni.navigateTo({
							url:'/pages/dutalk/room/bluethAdv'
						});
					},
					fail(err) {
						uni.showToast({
							title:'未初始化蓝牙适配器,确保蓝牙已打开',
							icon:'none',
							duration:4000
						});
						console.log(err);
					}
				})
				
			},
			navback(){
				uni.navigateBack({});
			},
			speakreauest(roomid){
				let self = this;
				return new Promise((reslove)=>{
					uni.request({
						url:SERVER_URL+'/channel-user/speak',
						method:'POST',
						timeout:60000,
						header: {
							'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
						},
						data:makeData({ channelId:roomid }),
						success(res) {
							console.log(res,'<------说话请求成功');
							function speaking(){
								console.log('开始speaking请求');
								uni.request({
									url:SERVER_URL+'/channel-user/speaking',
									method:'POST',
									timeout:60000,
									header: {
										'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
									},
									data:makeData({ channelId:roomid }),
									success(res) {
									if(res.data.result === 1){
										uni.showToast({
											title:res.data.msg,
											icon:'none'
										});
										(res.data.msg == '已有人在说话')&&(self.isspeak = true);
										return;
									}
									self.isspeak = true;//是我自己在讲话
									let need_end_count = self.need_end_count;
									need_end_count++;
									self.need_end_count = need_end_count;
									self.myself = true;
									console.log('----开始请求speaking 并打开麦克风----');
									self.records&&self.records.microphoneOn((res)=>{
											console.log(res,'《------sepak--------');
											uni.setStorageSync('mic',res.data.microphone);
											if(!uni.getStorageSync('mic')){
												(res.result==-1)&&uni.showModal({
													title:'提示',
													content:'麦克风设置出错',
													success({confirm,cancel}) {
														console.log('麦克风设置出错！');
														confirm&&permission.gotoAppSetting();
													}
												});
												(res.result==1)&&uni.showModal({
													title:'提示',
													content:res.msg,
													success({confirm,cancel}) {
														// confirm&&permision.gotoAppPermissionSetting();
													}
												});
												self.useraction(6);//如果没麦克风的话结束
												return
											}
										});
										function alive(speaking){
											speaking&&uni.request({
												url:SERVER_URL+'/channel-user/speaking',
												method:'POST',
												timeout:60000,
												header: {
													'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
												},
												data:makeData({ channelId:self.info.roomid }),
												success(res) {
													if(res.data.result === 1){
														uni.showToast({
															title:res.data.msg,
															icon:'none',
															duration:3000
														})
														return;
													}
													setTimeout(()=>{
														alive(self.myself);
													},300);
													console.log('speaking',res,self.isspeak);
												}
											});
										}
										alive(self.myself);
									},
									fail(err) {
										console.log(err);
									}
								})
							}
							console.log(self.myself,'<------------------------------');
							if(res.data.result === 1){
								console.log('-------------myself---------------',self.myself);
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								});
								return
							}
							speaking();
						},
						fail(err) {
							console.log(err);
						}
					})
				});
			},
			sepakendaction(){
			  const self = this;
			  let roomid = self.info.roomid;
			  clearInterval(self.speaking_timeout);
			  uni.request({
			  	url:SERVER_URL+'/channel-user/speakEnd',
			  	method:'POST',
			  	timeout:60000,
			  	header: {
			  		'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
			  	},
			  	data:makeData({ channelId:self.info.roomid }),
				success(res) {
					if(res.data.result === 1){
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						});
						return;
					}
					let need_end_count = self.need_end_count;
					need_end_count--;
					self.isspeak = false;
					self.isothersepak = false;
					self.speaking_timeout = null;
					self.need_end_count = (need_end_count<=0)?0:need_end_count;
					// console.log('speakend',self.isspeak);
				}
				});
			},
			useraction(val){
			  const self = this;
			  let currrentPage = getCurrentPages()[ getCurrentPages().length - 1 ].route;
			  console.log('-----到这里了----',currrentPage,val);
			  if(currrentPage.indexOf('/dutalk/room')==-1){return}
			  let roomid = self.info.roomid;
			  if((val!=5)&&(val!=6)){return}
			  if(val == 5){
				 !self.myself&&self.speakreauest(roomid);
			  }
			  if(val == 6){
				self.records.microphoneOff(()=>{});
				self.records.playOff(()=>{
					console.log('---');
				});
				setTimeout(()=>{
					self.need_end_count = 0;
					self.myself = false;
					self.isspeak = false;
					self.sepakendaction();
				},0)
				// while((self.need_end_count == 0)&&((new Date().getTime() - time)<3000)){
				// 	console.log('----------测到有说话请求---------------');
				// 	if(((new Date().getTime() - time)>3000)||self.need_end_count>1){
						
				// 		break;
				// 	}
					
				// 	console.log('----------未测到有说话请求---------------');
				// }
				
			  }
			  
			},
			joinroom(){
			  const self = this;
			  let roomid = self.info.roomid;
			  uni.request({
			  	url:SERVER_URL+'/channel/join',
			  	method:'POST',
			  	timeout:60000,
			  	header: {
			  		'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
			  	},
			  	data:makeData({id:roomid}),
				success(res) {
					console.log('------加入成功！-----');
					if(res.data.result === 1){
						uni.showModal({
							title:'提示',
							content:res.data.msg,
							showCancel:!1
						})
						return;
					}
					res.data.onlineUserInfo&&(self.isothersepak = true);
					res.data.onlineUserInfo&&(self.speakavatar = res.data.onlineUserInfo.avatar);
				}
			  })
			}
		},
		
	}
</script>


<style lang="less" scoped>
@import url('./index.less');
.room-id{
	font-size: 56rpx;
	font-family: 'DIN-BlackItalic';
	font-weight: 100;
	color: #FFFFFF;
	text-align: left;
	padding-bottom: 6rpx;
	margin-right: 12rpx;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.isand{
	font-style: italic;
	font-weight: bold;
}
</style>
