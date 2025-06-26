<template>
	<view class="">
		<view class="btnItem" @click="sendMessage">
			发送消息
		</view>
		<view class="btnItem" >
			接受的小心：
		</view>
	</view>
</template>


<script>
	 import * as longLink from '@/longLink/longLink';

	export default {
		data() {
			return{ 
				val: '',
			}
		},
		onLoad() {
			
			this.connectSocketInit();
			
			// var userInfo = uni.getStorageSync("userInfo");
			// var mobile = JSON.parse(userInfo).mobile;
			// uni.connectSocket({
			//   url: 'wss://t1960315w7.51vip.biz/ws-message/'+ mobile,
			//   header: {
			// 	'content-type': 'application/json'
			//   },
			//   protocols: [],
			//   method: 'GET',
			//   success: function (res) {
			// 	console.log('WebSocket 连接成功', res);
			//   },
			//   fail: function (err) {
			// 	console.log(err);
			//   }
			// });
		
		},
		methods: {
			connectSocketInit() {
				var userInfo = uni.getStorageSync("userInfo");
				var mobile = JSON.parse(userInfo).userId;
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				//ws://t1960315w7.51vip.biz/ws-message/  丁健
				//ws://192.168.10.82:2235/ws-message/ dev
				console.log("ws://192.168.10.82:2235/ws-message/"+ mobile);
				var url = 'ws://192.168.10.82:2235/ws-message/' + mobile;
				this.socketTask = uni.connectSocket({
					url: url,
					header: {
					  'content-type': 'application/json'
					},
					protocols: [],
					method: 'GET',
					success: function (res) {
					  console.log('WebSocket 连接成功', res);
					},
					fail: function (err) {
					  console.log(err);
					  longEvent(self, complete);
					}
				});
 
				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				this.socketTask.onOpen((res) => {
					console.log("WebSocket连接正常打开中...！");
					this.is_open_socket = true;
					// 注：只有连接正常打开中 ，才能正常成功发送消息
					var data = {
						"business_type": "default", 
						"message_type": "system", 
						"msgContent": "内容", 
						"receiveUserSid": "18396837943", 
						"sendUserSid": "system"
					}
					this.socketTask.send({
						data: JSON.stringify(data),
						async success() {
							console.log("消息发送成功");
						},
					});
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.socketTask.onMessage((res) => {
						console.log("收到服务器内容：" + res.data);
						uni.showToast({
							title: res.data,
							icon: 'none'
						})
					});
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				this.socketTask.onClose(() => {
					console.log("已经被关闭了")
					this.connectSocketInit(); //	关闭了重启socket
				})
							
			
			},
			sendMessage() {
				var data = {
					"business_type": "default", 
					"message_type": "system", 
					"msgContent": "内容", 
					"receiveUserSid": "18396837943", 
					"sendUserSid": "system"
				}
				uni.sendSocketMessage({
				      data: data,
					  success: function(res) {
						  console.log(res, '发送成功')
					  }
				});
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.btnItem {
		width: calc(100vw - 80rpx);
		margin-left: 40rpx;
		background-color: rgba(74, 162, 243, 1);
		color: #FFFFFF;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
