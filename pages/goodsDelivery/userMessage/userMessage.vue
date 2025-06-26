<template>
	<view class="userMessage">
		<!-- <view class="headSearch">
			<view class="searchBox">
				<input class="searchInput" maxlength="11" placeholder="江浙沪专线" placeholder-style="font-size: 28rpx;color: #B7B7B7;" v-model="searchValue"  @input="onInput" @confirm="toSearch()"/>
				<image class="icon" src="../../../static/images/goodsDelivery/search.png" @click="toSearch()"></image>
			</view>
		</view> -->
		<!-- <view class="testBtnGroup"> -->
			<!-- <view class="assignedBtn" @click="subscribeChannel()">订阅</view>
			<view class="assignedBtn" @click="toPubSub()">PubSub</view> -->
			<!-- <view class="assignedBtn" @click="deleteChat()">删除会话</view> -->
		<!-- </view> -->
		<view class="messageRow" @click="jumpToMemberList(1)" v-if="fansMag">
			<view class="iconCol">
				<image class="newIcon" src="../../../static/images/newUserMessage/fansIcon.png"></image>
			</view>
			<view class="contentCol">
				<view class="leftMsg">
					<view class="title">新的朋友</view>
					<view class="msg">{{fansMag}}</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		
		<view class="messageRow" @click="jumpToMemberList(2)" v-if="unimsg">
			<view class="iconCol">
				<image class="newIcon" src="../../../static/images/newUserMessage/interactiveIcon.png"></image>
			</view>
			<view class="contentCol">
				<view class="leftMsg">
					<view class="title">互动消息</view>
					<view class="msg">{{unimsg}}人最近访问了你的车队</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		
		<view class="messageRow" @click="jumpToAuthentication(1)">
			<view class="iconCol">
				<image class="newIcon" src="../../../static/images/newUserMessage/msgCar.png"></image>
			</view>
			<view class="contentCol">
				<view class="leftMsg">
					<view class="title">物流消息</view>
					<view class="msg">{{logisticsInfo ? logisticsInfo : '暂无新消息'}}</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		<view class="messageRow" @click="jumpToAuthentication(2)">
			<view class="iconCol">
				<image class="newIcon" src="../../../static/images/newUserMessage/accountIcon.png"></image>
			</view>
			<view class="contentCol">
				<view class="leftMsg">
					<view class="title">账户消息</view>
					<view class="msg">{{accountInfo ? accountInfo : '暂无新消息'}}</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		<view class="messageRow" @click="jumpToNoticeMessage()" v-if="userRole == 1">
			<view class="iconCol">
				<image class="newIcon" src="../../../static/images/newUserMessage/assistantIcon.png"></image>
			</view>
			<view class="contentCol">
				<view class="leftMsg">
					<view class="title">货运中国小助手<image class="sybIcon" src="../../../static/images/newUserMessage/officialSyb.png"></image></view>
					<view class="msg">{{assistantMsg ? assistantMsg : '暂无新消息'}}</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		
		<view class="messageRow" v-for="(item, cindex) in conversations" :key="cindex" @click="jumpToChatDetails(item)" v-if="item.userId != 'cargoSystemAdmin'">
			<view class="iconCol">
				<image class="userIcon" v-if="item.type != 'group'" :src="item.data.avatar"></image>
				<image class="userIcon" v-if="item.type == 'group'" src="../../../static/images/goodsDelivery/fleet-head.png"></image>
			</view>
			<view class="contentCol">
				<view class="leftMsg">
					<view class="title" v-if="item.type != 'group'">{{showUserName(item)}}<text class="userCompany" v-if="item.data.company">{{item.data.company}}</text></view>
					<view class="title" v-if="item.type == 'group'">{{item.data.name ? item.data.name : item.data.nickname}}<text class="userCompany" v-if="item.data.company">{{item.data.company}}</text></view>
					<view class="msg" v-if="item.lastMessage.type == 'text'">{{item.lastMessage.payload.text}}</view>
					<view class="msg" v-if="item.lastMessage.type == 'image'">[图片消息]</view>
					<view class="msg" v-if="item.lastMessage.type == 'order'">[自定义消息]</view>
				</view>
				<view class="rightMsgBox">
					<view class="unreadSyb" v-if="item.unread">{{item.unread}}</view>
					<view class="time">{{showTime(item.lastMessage.timestamp)}}</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import IMService from "@/utils/imservice.js";
	export default {
		data() {
			return {
				searchValue: '',
				timeOutObj: '',
				logisticsInfo: '',
				accountInfo: '',
				interactiveInfo: '',
				userInfo: '',
				conversations: [],
				fansMag: '',
				unimsg: 0,
				toSubscribeGroupFlag: false,
				assistantMsg: '',
				userRole: ''
			};
		},
		onLoad() {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			console.log('用户信息', this.userInfo);
			this.toSubscribeGroupFlag = true; // 生命周期第一次需要重新订阅群聊
			let that = this;
			uni.$on("refreshData_message", (data) => {
				console.log('数据刷新');
				that.toSubscribeGroupFlag = true; // 生命周期第一次需要重新订阅群聊
				that.fansMag = '';
				that.unimsg = 0;
				that.conversations = [];
			});
			
		},
		onShow() {
			this.userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
			if(this.goEasy.getConnectionStatus() == 'disconnected') {
				
				let userData = uni.getStorageSync("userInfo");
				let userInfo = '';
				if(Number(this.userRole) == 1) {
					userInfo = userData ? JSON.parse(userData) : {};
					let avatarObj = JSON.parse(userData);
					userInfo.attrs.avatar = avatarObj.attrs.avatar;
				}else {
					userInfo = userData ? JSON.parse(userData) : {};
				}
				getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
				getApp().globalData.imService.connect(userInfo);
			}
			this.getNews();
			this.getAccountNews();
			this.getUnimsg();
			this.getFansmag();
			if(this.userRole == 1) {
				this.getAssistantMsg();
			}
			uni.showLoading();
			//监听会话列表变化
			let im = this.goEasy.im;
			let imService = this.GoEasy;
			let self = this;
			im.on(imService.IM_EVENT.CONVERSATIONS_UPDATED, (content) => {
				self.renderConversations(content);
			});
			im.on(imService.IM_EVENT.GROUP_MESSAGE_RECEIVED, (content) => {
				// self.renderConversations(content);
				console.log('群收到消息', content);
			});
			//加载会话列表
			im.latestConversations({
				onSuccess: function (result) {
					let content = result.content;
					self.renderConversations(content);
					uni.hideLoading();
				},
				onFailed: function (error) {
					//获取失败
					uni.hideLoading()
					console.log("失败获取", error);
				}
			});
		},
		onPullDownRefresh() {
			this.getNews();
			this.getAccountNews();
			this.getUnimsg();
			this.getFansmag();
		},
		onUnload() {
			var userRole = uni.getStorageSync("userRole");
			if (userRole == 2) {
				uni.showTabBarRedDot({
				  index: 3,
				});
			}
			
		},
		methods: {
			getAssistantMsg() {
				let that = this;
				utils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 1, types: [6] })
				.then(res=>{
					console.log('小助手消息', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody;
						if(rspBody.total > 0) {
							let ary = rspBody.items;
							that.assistantMsg = ary['0'].content;
						}else {
							that.assistantMsg = '';
						}
					}else {
						that.assistantMsg = '';
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					that.assistantMsg = '';
					console.log(err)
				})
			},
			getNews() {
				let that = this;
				utils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 1, msgType:1, types: [1] })
				.then(res=>{
					// console.log('物流消息', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody;
						if(rspBody.total > 0) {
							let ary = rspBody.items;
							that.logisticsInfo = ary['0'].content;
						}else {
							that.logisticsInfo = '';
						}
					}else {
						that.logisticsInfo = '';
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					that.logisticsInfo = '';
					console.log(err)
				})
			},
			getAccountNews() {
				let that = this;
				utils.postRequest("/td/msg/select", { pageNum: 1, pageSize: 1, msgType:1, types: [3,5] })
				.then(res=>{
					console.log('账户消息', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody;
						if(rspBody.total > 0) {
							let ary = rspBody.items;
							that.accountInfo = ary['0'].content;
						}else {
							that.accountInfo = '';
						}
					}else {
						that.accountInfo = '';
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					that.logisticsInfo = '';
					console.log(err)
				})
			},
			
			getUnimsg() {
				let that = this;
				utils.postRequest("/cd/unimsg/list", {})
				.then(res=>{
					console.log('互动消息', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody ? res.rspBody : [];
						if(rspBody && rspBody.length > 0) {
							that.unimsg = rspBody.length;
						}
					}else {
						// uni.showToast({
						// 	title: res.retDesc,
						// 	icon: 'none'
						// })
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			getFansmag() {
				let that = this;
				utils.postRequest("/cd/fansmag/list", {})
				.then(res=>{
					console.log('粉丝消息', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody ? res.rspBody : [];
						if(rspBody && rspBody.length > 0) {
							that.fansMag = rspBody[0].msg;
						}
						
					}else {
						// uni.showToast({
						// 	title: res.retDesc,
						// 	icon: 'none'
						// })
					}
					uni.stopPullDownRefresh();
				})
				.catch(err=>{
					uni.stopPullDownRefresh();
					console.log(err)
				})
			},
			onInput(e) {
				console.log(e);
				if(this.searchValue.length == 11) {
					clearTimeout(this.timeOutObj);
					let that = this;
					that.timeOutObj = setTimeout(() => {
						console.log('search');
						that.toSearch();
					}, 1000);
				}
			},
			toSearch() { // 搜索
				clearTimeout(this.timeOutObj);
				console.log('搜索');
			},
			jumpToAuthentication(index) {
				uni.navigateTo({
					url: '/pages/ship/news/news?index=' + index
				})
			},
			jumpToNoticeMessage() {
				uni.navigateTo({
					url: './noticeMessage'
				})
			},
			jumpToChatDetails(item) {
				let name = item.data.name ? item.data.name : item.data.nickname ? item.data.nickname : '';
				if(item.type == 'group') {
					let groupId = item.groupId ? item.groupId : '';
					uni.navigateTo({
						url: 'groupChat?groupId=' + groupId + '&avatar=' + item.data.avatar + '&nickname=' + name
					})
				}else {
					let userId = item.data.userId ? item.data.userId : '';
					uni.navigateTo({
						url: 'chatDetails?receiverId=' + item.userId + '&avatar=' + item.data.avatar + '&nickname=' + name + '&userId=' + userId
					})
				}
			},
			renderConversations(content){
				console.log('会话列表', content);
				this.conversations = content.conversations || [];
				if(this.conversations && this.conversations.length > 0) {
					let groupIds = [];
					for(let i in this.conversations) {
						if(this.conversations[i].userId == 'cargoSystemAdmin') {
							groupIds.push(this.conversations[i].lastMessage.payload.text)
						}
					}
					if(groupIds.length > 0) {
						this.testSubscribeGroup(groupIds);
					}
				}
				if(this.toSubscribeGroupFlag && this.conversations && this.conversations.length > 0) {
					this.subscribeGroup();
				}
				// let unreadTotal = content.unreadTotal;
				// this.setUnreadAmount(unreadTotal);
			},
			subscribeGroup(groupId) { // 订阅群聊
				let groupIds = [];
				for(let i in this.conversations) {
					if(this.conversations[i].type == 'group') {
						groupIds.push(this.conversations[i].groupId);
					}
				}
				console.log(groupIds);
				this.goEasy.im.subscribeGroup({
					groupIds:groupIds, //聊天对象的userId
					onSuccess: function () { //标记成功
						console.log("订阅成功") 
					},
					onFailed: function (error) { //标记失败
						console.log("订阅失败", error);
					}
				});
				this.toSubscribeGroupFlag = false;
			},
			setUnreadAmount (unreadTotal) {
				this.unreadTotal = unreadTotal;
				if(this.unreadTotal > 0) {
					uni.setTabBarBadge({
						index: 0,
						text: this.unreadTotal.toString()
					});
				}else{
					uni.removeTabBarBadge({
						index: 0
					});
				}
			},
			jumpToMemberList(flag) { // 跳转粉丝、访客列表
				uni.navigateTo({
					url: './userGroupMembers?type=' + flag
				})
			},
			showTime(time) {
				var date = new Date(time);     //1. js获取当前时间
				// console.log(date);
				var y = date.getFullYear();
				var m = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
				var d = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
				var h = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
				var f = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
				var s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				var formatdate = m + '-' + d + ' ' + h + ":" + f;
				return formatdate;
			},
			testSubscribeGroup(groupIds) { // 订阅群聊
				let im = this.goEasy.im;
				let that = this;
				im.subscribeGroup({
					groupIds: groupIds, //聊天对象的userId
					onSuccess: function () { //标记成功
						console.log("订阅成功");
						// uni.showToast({
						// 	title: '邀请成功',
						// 	icon: 'none',
						// 	duration: 3000
						// })
						that.deleteMessage('cargoSystemAdmin');
					},
					onFailed: function (error) { //标记失败
						console.log("订阅失败", error);
					}
				});
			},
			deleteMessage(userId) { // 删除私信
			    this.goEasy.im.removePrivateConversation({
			        userId: userId, 
			        onSuccess: function () { 
			            console.log("Remove private conversation successfully."); 
			        },
			        onFailed: function (error) { 
			            console.log("Failed to remove private conversation, code:" + error.code + " content:" + error.content);
			        }
			    });
			},
			showUserName(item) {
				if(item.data.name) {
					return this.showChatName(item.data.name);
				}
				if(item.data.nickname) {
					return this.showChatName(item.data.nickname);
				}
				if(item.data.userId) {
					return '游客' + item.data.userId;
				}
				return '游客'
			},
			showChatName(str) { // 姓名脱敏
				if(!str) return false;
				return str.substr(0, 1) + '**';
			},
			subscribeChannel() { // 接收&订阅 群发消息
				var pubsub = this.goEasy.pubsub;
				pubsub.subscribe({
				    channel: "test_channel",
				    onMessage: function (message) {
				        console.log("Channel:" + message.channel + " content:" + message.content);
				    },
				    onSuccess: function () {
				        console.log("Channel订阅成功。");
				    },
				    onFailed: function (error) {
				        console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
				    }
				});
			},
			toPubSub() { // 发送群发消息
				var pubsub = this.goEasy.pubsub;
				pubsub.publish({
				    channel: "test_channel",
				    message: "测试群发!",
				    onSuccess:function(res){
				        console.log("消息发布成功", res);
				    },
				    onFailed: function (error) {
				        console.log("消息发送失败", error);
				    }
				});
			},
			deleteChat() { // 删除会话
				let friendId = 'H19167';
				this.goEasy.im.removePrivateConversation({
				    userId:friendId, 
				    onSuccess: function () { 
				        console.log("Remove private conversation successfully."); 
				    },
				    onFailed: function (error) { 
				        console.log("Failed to remove private conversation, code:" + error.code + " content:" + error.content);
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	.userMessage {
		.headSearch {
			padding: 32rpx;
			border-bottom: 2rpx solid #DDDDDD;
			.searchBox {
				height: 70rpx;
				background: #F3F3F4;
				border-radius: 8rpx;
				padding: 0 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.searchInput {
					flex: 1;
					font-size: 28rpx;
					color:#333;
				}
				.icon {
					flex-shrink: 0;
					width: 42rpx;
					height: 40rpx;
					margin-left:20rpx;
				}
			}
		}
		.messageRow {
			padding: 0 0 0 32rpx;
			display: flex;
			align-items: center;
			.iconCol {
				flex-shrink: 0;
				margin-right: 28rpx;
				width: 112rpx;
				height: 112rpx;
				border-radius: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				overflow: hidden;
				.newIcon {
					width: 112rpx;
					height: 112rpx;
					border-radius: 100%;
				}
				.userIcon {
					width: 112rpx;
					height: 112rpx;
				}
			}
			.contentCol {
				flex: 1;
				border-bottom: 2rpx solid #DCDCDE;
				padding: 32rpx 48rpx 30rpx 0;
				display: flex;
				align-items: center;
				.rightIcon {
					width: 28rpx;
					height: 28rpx;
					margin-left: 64rpx;
					flex-shrink: 0;
				}
				.leftMsg {
					flex: 1;
					.title {
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
						line-height: 44rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp:1;
						.sybIcon {
							width: 60rpx;
							height: 30rpx;
							margin-left: 12rpx;
						}
						.userCompany {
							font-size: 24rpx;
							font-weight: 500;
							color: #333333;
							padding-left:24rpx;
						}
					}
					.msg {
						font-size: 26rpx;
						color: #777;
						line-height: 36rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp:1;
						margin-top: 6rpx;
					}
				}
				.rightMsgBox {
					flex-shrink: 0;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.unreadSyb {
						width: 44rpx;
						height: 44rpx;
						line-height: 44rpx;
						border-radius: 100%;
						background: #FC2D2D;
						text-align: center;
						font-size: 24rpx;
						font-weight: 500;
						color: #FFFFFF;
						margin-bottom:6rpx;
					}
					.time {
						font-size: 26rpx;
						color: #777777;
						line-height: 36rpx;
					}
				}
			}
		}
		.textSendBtnGroup {
			display: flex;
			justify-content: center;
			align-items: center;
			.btn + .btn {
				margin-left:32rpx;
			}
			.btn {
				font-size: 28rpx;
				text-align: center;
				padding: 0 32rpx;
				height: 64rpx;
				line-height: 64rpx;
				border-radius: 52rpx;
				color:#FFF;
				background: #0171F9;
				border: 2rpx solid #0171F9;
			}
		}
		.testBtnGroup {
			display: flex;
			justify-content: center;
			align-items: center;
			.assignedBtn {
				width: 200rpx;
				margin:16rpx;
				background-color: #000000;
				color:#FFF;
				line-height: 80rpx;
				font-size: 32rpx;
				text-align: center;
				border-radius: 24rpx;
			}
		}
	}
</style>
