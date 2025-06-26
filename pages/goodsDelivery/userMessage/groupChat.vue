<template>
	<view class="chatDetails" id="chatMainBox">
		<!-- <uni-popup ref="messagePopup" type="message">
		    <uni-popup-message type="info" message="本功能旨在为大家提供一个沟通物流业务的渠道。请文明聊天，不得发布违反中国相关法律的内容！" :duration="0"></uni-popup-message>
		</uni-popup> -->
		<view class="headHintBox">本功能旨在为大家提供一个沟通物流业务的渠道。请文明聊天，不得发布违反中国相关法律的内容！</view>
		
		<view class="chatMessageList" :style="boxPadding">
			<view class="msgTime" v-if="msgAry.length > 0">{{showTime(msgAry['0'].timestamp)}}</view>
			<view class="contentList" v-for="(item, mIndex) in msgAry" :key="mIndex" :style="item.senderId == userInfo.attrs.userCode ? 'flex-direction: row-reverse;' : 'flex-direction: row;'">
				<view class="avatarBox" :style="item.senderId == userInfo.attrs.userCode ? 'margin-left:22rpx;' : 'margin-right:22rpx;'">
					<image class="userAvatar" v-if="item.senderId != userInfo.attrs.userCode" :src="item.senderData && item.senderData.avatar ? item.senderData.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png'"></image>
					<image class="userAvatar" v-if="item.senderId == userInfo.attrs.userCode" :src="userInfo.attrs.avatar ? userInfo.attrs.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png'"></image>
				</view>
				<view class="contentMsg" :style="item.senderId == userInfo.attrs.userCode ? 'padding-left:60rpx;' : 'padding-right:60rpx;'">
					<view class="name" :style="item.senderId == userInfo.attrs.userCode ? 'text-align:right;' : 'text-align:left;'">{{showChatName(item.senderData)}}</view>
					<view class="contentBox" :style="item.senderId == userInfo.attrs.userCode ? 'flex-direction: row-reverse;' : 'flex-direction: row;'">
						<view class="msgBox" v-if="item.type == 'text'" :style="item.senderId == userInfo.attrs.userCode ? 'background: #0171F9;flex-direction: row-reverse;' : 'background: #F3F3F4;flex-direction: row;'">
							<view class="isMsg" :style="item.senderId == userInfo.attrs.userCode ? 'color: #FFF;' : 'color: #333;'">{{item.payload.text}}</view>
						</view>
						<image class="msgImage" v-if="item.type == 'image'" mode="heightFix" :src="item.payload.url" @click="showLargeImage(item.payload.url)"></image>
						<image class="sendErrorIcon" v-if="item.sendError" :style="item.senderId == userInfo.attrs.userCode ? 'margin-right:18rpx;' : 'margin-left:18rpx;'" src="../../../static/images/goodsDelivery/sendErrorIcon.png"></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="chatMessageBox" :style="safeBottom" :class="showFunctionFlag ? 'showChatMessageBox' : 'hiddenChatMessageBox'">
			<view class="msgInputBox">
				<image class="inputIcon" src="../../../static/images/goodsDelivery/showOtherIcon.png" @click="showOtherFunction(!showFunctionFlag)"></image>
				<input class="msgInput" confirm-type="send" v-model="msgValue" :auto-blur="true" :cursor="cursorLength" @confirm="checkSendMsg" @focus="inputOnFocus"/>
				<view class="sendBtn" :class="msgValue ? 'canSend' : 'canntSend'" @touchend.prevent="checkSendMsg">
					<tsxt class="msg" v-if="!isSending">发送</tsxt>
					<image class="loadingImg" v-if="isSending" src="../../../static/images/listLoading.png"></image>
				</view>
				<!-- <image class="inputIcon" src="../../../static/images/goodsDelivery/emojiIcon.png"></image> -->
			</view>
			 
			<view class="otherFunctionBox">
				<view class="functionModelList" v-for="(item, findex) in fModeInfo" :key="findex" @click="toSendImage(item.type)">
					<view class="fImageBox">
						<image :style="item.imgStyle" :src="item.image"></image>
					</view>
					<view class="fTitle">{{item.title}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				userInfo: '',
				msgValue: '',
				safeAreaInsets: {},
				safeBottom: '',
				showFunctionFlag: false,
				fModeInfo: [{
					image: '../../../static/images/goodsDelivery/photoAlbum.png',
					imgStyle: 'height:48rpx;width:60rpx;',
					title: '照片',
					type: 'picture'
				}, {
					image: '../../../static/images/goodsDelivery/takingPictures.png',
					imgStyle: 'height:50rpx;width:58rpx;',
					title: '拍摄',
					type: 'camera'
				}],
				msgAry: [],
				pageSize: 20,
				msgNoMore: false,
				boxPadding: '',
				keyboardHeight: '',
				receiverAvatar: '',
				receiverNickname: '',
				groupId: '',
				firstInPage: true,
				isSending: false,
				cursorLength: ''
			};
		},
		onLoad(option) {
			let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
			let userData = uni.getStorageSync("userInfo");
			if(Number(userRole) == 1) {
				this.userInfo = userData ? JSON.parse(userData) : {};
				let avatarObj = JSON.parse(userData);
				this.userInfo.attrs.avatar = avatarObj.attrs.avatar;
			}else {
				this.userInfo = userData ? JSON.parse(userData) : {};
			}
			console.log('私信对象', option)
			let that = this;
			that.receiverAvatar = option.avatar;
			that.receiverNickname = option.nickname;
			that.groupId = option.groupId ? option.groupId : '';
			console.log(that.receiverAvatar, that.receiverNickname, that.groupId);
			uni.getSystemInfo({
			    success: function (res) {
			        console.log('设备信息', res);
					that.safeAreaInsets = res.safeAreaInsets;
					that.safeBottom = 'padding-bottom:' + that.safeAreaInsets.bottom + 'rpx;';
					that.changeStyle(116);
			    }
			});
			uni.onWindowResize((res) => {
			    // console.log('变化后的窗口高度=' + res.size.windowHeight);
				that.toScrollPage();
			})
			uni.onKeyboardHeightChange(res => {
				console.log('键盘高度', res.height);
				if(res.height) {
					that.safeBottom = '';
				}else {
					that.safeBottom = 'padding-bottom:' + that.safeAreaInsets.bottom + 'rpx;';
				}
			})
			
		},
		onShow() {
			if(this.goEasy.getConnectionStatus() == 'disconnected') {
				let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
				let userData = uni.getStorageSync("userInfo");
				let userInfo = '';
				if(Number(userRole) == 1) {
					userInfo = userData ? JSON.parse(userData) : {};
					let avatarObj = JSON.parse(userData);
					userInfo.attrs.avatar = avatarObj.attrs.avatar;
				}else {
					userInfo = userData ? JSON.parse(userData) : {};
				}
				getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
				getApp().globalData.imService.connect(userInfo);
			}
			this.markGroupMessageAsRead();
			this.onPrivateMessageReceived();
			this.getMessage();
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.receiverNickname
			});
			// this.$refs.messagePopup.open();
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: './complaints?groupId=' + this.groupId
			})
		},
		onPullDownRefresh(e) {
			this.getMessage();
		},
		onUnload() {
			this.markGroupMessageAsRead();
			let imService = getApp().globalData.imService;
			if(imService){
				imService.onNewGroupMessageReceive = function () {};
			}
		},
		methods: {
			onPrivateMessageReceived() { // 监听群消息更新
				let im = this.goEasy.im;
				let imService = this.GoEasy;
				let that = this;
				im.on(imService.IM_EVENT.GROUP_MESSAGE_RECEIVED, (content) => {
					console.log('群收到消息', content);
					if (content.groupId === that.groupId) {
						that.msgAry.push(content);
						that.toScrollPage();
					}
				});
			},
			markGroupMessageAsRead() { // 将会话消息设置为已读
				this.goEasy.im.markGroupMessageAsRead({
					groupId: this.groupId,  //聊天对象的userId
					onSuccess: function () { //标记成功
						console.log("标记成功") 
					},
					onFailed: function (error) { //标记失败
						console.log("标记失败", error);
					}
				});
			},
			getMessage() { // 查询聊天消息
				let firstLoadFlag = this.msgAry.length == 0 ? true : false;
				let lastTimestamp = firstLoadFlag ? Date.now() : this.msgAry[0].timestamp;
				let that = this;
				this.goEasy.im.history({
				    groupId: that.groupId,  //对方userId
				    lastTimestamp: lastTimestamp, //查询发送时间小于（不包含）该时间的历史消息，可用于分页和分批拉取聊天记录，默认为当前时间
				    limit: that.pageSize, //可选项，返回的消息条数，默认为10条，最多30条
				    onSuccess: function (result) { 
				        //单聊历史消息result示例
				        console.log('历史消息获取成功', result);
						let contentAry = result.content;
						if(!contentAry || contentAry.length < that.pageSize) {
							that.msgNoMore = true;
						}
						if(contentAry && contentAry.length > 0) {
							if(firstLoadFlag) {
								that.msgAry = contentAry;
							}else {
								contentAry = contentAry.reverse();
								for(let i in contentAry) {
									that.msgAry.unshift(contentAry[i]);
								}
							}
						}
						if(that.firstInPage) {
							// 初始化页面并请求到数据是需要将页面滚动到底部
							that.toScrollPage();
							that.firstInPage = false;
						}
						console.log('聊天列表', that.msgAry);
						uni.stopPullDownRefresh();
				    },
				    onFailed: function (error) { //获取失败
				        console.log('历史消息获取失败', error);
						uni.stopPullDownRefresh();
				    },
				});
			},
			inputOnFocus(e) { // 输入框聚焦
				this.cursorLength = e.detail.value ? e.detail.value.length : '';
				if(this.showFunctionFlag) {
					this.showOtherFunction(false);
				}
			},
			showOtherFunction(flag) { // 展示其他功能模块
				
				this.showFunctionFlag = flag;
				if(this.showFunctionFlag) {
					this.changeStyle(380);
					this.toScrollPage();
				}else {
					this.changeStyle(116);
				}
				this.$forceUpdate();
			},
			toScrollPage() {
				this.$nextTick(function(){
					uni.pageScrollTo({
						scrollTop: 2000000,
						duration : 10
					})
				});
			},
			checkSendMsg() { // 检查字符串
				if(!this.msgValue || this.isSending) return false;
				let that = this;
				that.isSending = true;
				utils.postRequest("/sens/words/replace", { words: that.msgValue })
				.then(res=>{
					console.log('返回结果', res);
					if(res.retCode == '0000000') {
						that.msgValue = res.rspBody
						that.sendMessage();
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
						that.isSending = false;
					}
				})
				.catch(err=>{
					that.isSending = false;
					console.log(err)
				})
			},
			sendMessage() {
				var im = this.goEasy.im;
				//创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
				let textMessage = im.createTextMessage({
				    text: this.msgValue, //消息内容
				    to : {
				        type : this.GoEasy.IM_SCENE.GROUP,
						id : this.groupId,
				        data:{"avatar": this.receiverAvatar, "name": this.receiverNickname} 
				    },
					notification : { //APP在后台运行，或进程被杀掉，将会收到通知栏提醒
					    title : this.receiverNickname + '发来一段群消息',
					    body : this.msgValue
					}
				});
				console.log('textMessage', textMessage);
				//发送消息
				let that = this;
				im.sendMessage({
				    message:textMessage,
				    onSuccess: function (message) { //发送成功
						console.log("发送成功", message);
						that.msgAry.push(message);
						that.isSending = false;
						that.msgValue = '';
						setTimeout(()=>{
							that.toScrollPage();
						}, 30)
					  // uni.hideKeyboard();
				    },
				    onFailed: function (error) { //发送失败
						that.isSending = false;
							console.log('发送失败', error);
				    }
				});
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
			toSendImage(type) { // 发送图片或拍摄
				let that = this;
				switch(type) {
					case 'picture':
						uni.chooseImage({
						    count: 1, //默认9
						    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
						    sourceType: ['album'], //从相册选择
						    success: function (res) {
								that.sendPicture(res);
								that.showOtherFunction(false);
						    }
						});
						break;
					case 'camera':
						uni.chooseImage({
						    count: 1, //默认9
						    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
						    sourceType: ['camera'], //使用相机
						    success: function (res) {
								that.sendPicture(res);
								that.showOtherFunction(false);
						    }
						});
						break;
				}
			},
			sendPicture(res) { // 发送图片
				//发送消息
				let that = this;
				let imageMessage = that.goEasy.im.createImageMessage({
					to : {
						id : that.groupId,
						type : that.GoEasy.IM_SCENE.GROUP,
						data : {
							name: that.receiverNickname,
							avatar: that.receiverAvatar
						}
					},
					file: res,
					onProgress :function (progress) {
						console.log(progress)
					},
					notification : {
						title : that.ureceiverNickname + '发来一张图片',
						body : '[图片消息]'		// 字段最长 50 字符
					}
				});
				
				that.goEasy.im.sendMessage({
				    message: imageMessage,
				    onSuccess: function (message) { //发送成功
				      console.log("发送成功", message);
					  that.msgAry.push(message);
					  that.msgValue = '';
					  setTimeout(()=>{
					  	that.toScrollPage();
					  }, 50)
				    },
				    onFailed: function (error) { //发送失败
				      console.log('发送失败', error);
				    }
				});
			},
			
			showLargeImage(imgUrl) { // 展示大图
				uni.previewImage({
					urls: [imgUrl],
					success: function(data) {
						console.log(data);
					},
					fail: function(err) {
						console.log(err);
					}
				});
			},
			changeStyle(num) {
				let bottomBoxHeight = num;
				if(this.safeAreaInsets.bottom) {
					
					this.boxPadding = 'padding-bottom:' + (this.safeAreaInsets.bottom / 2 + this.safeAreaInsets.bottom + bottomBoxHeight) + 'rpx;';
				}else {
					this.boxPadding = 'padding-bottom:' + bottomBoxHeight + 'rpx;';
				}
			},
			showChatName(item) { // 姓名脱敏
				let str = '';
				if(item.name) {
					str = item.name;
					return str.substr(0, 1) + '**';
				}
				if(!item.name) {
					if(item.userId) {
						return '游客' + item.userId
					}else {
						return '游客'
					}
				}
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF;
	}
	::-webkit-scrollbar { // 隐藏scroll-view滚动条
		width: 0 !important;
		height: 0 !important;
		color: transparent !important;
		display: none !important;
	}
	.chatDetails {
		box-sizing: border-box;
		.headHintBox {
			background-color: #F2F6FC;
			padding: 20rpx 30rpx;
			border-color: #eee;
			border-style: solid;
			border-width: 2rpx;
			font-size: 28rpx;
			color:#909399;
			line-height: 1;
		}
		.chatMessageList {
			box-sizing: border-box;
			padding: 22rpx 24rpx;
			.msgTime {
				font-size: 26rpx;
				color: #777777;
				line-height: 36rpx;
				text-align: center;
			}
			.contentList {
				display: flex;
				margin-top: 24rpx;
				.avatarBox {
					flex-shrink: 0;
					.userAvatar {
						width: 72rpx;
						height: 72rpx;
						border-radius: 100%;
					}
				}
				.contentMsg {
					flex: 1;
					.name {
						font-size: 26rpx;
						color: #777777;
						line-height: 36rpx;
					}
					.contentBox {
						display: flex;
						align-items: center;
						.msgBox {
							padding: 14rpx 24rpx;
							border-radius: 16rpx;
							width:fit-content;
							display: flex;
							.isMsg {
								font-size: 32rpx;
								line-height: 44rpx;
								white-space:normal;
								word-break:break-all;
							}
						}
						.msgImage {
							max-width: 200rpx;
							max-height: 200rpx;
						}
						.sendErrorIcon {
							width: 40rpx;
							height: 44rpx;
							flex-shrink: 0;
						}
					}
				}
			}
		}
		.showChatMessageBox {
			height: 380rpx;
		}
		.hiddenChatMessageBox {
			height: 116rpx;
		}
		.chatMessageBox {
			overflow: hidden;
			background-color: #FFF;
			border-top: 1rpx solid #DDDDDD;
			width: 100vw;
			position: fixed;
			bottom: 0;
			z-index: 9999;
			.msgInputBox {
				display: flex;
				padding: 18rpx 32rpx;
				justify-content: space-between;
				align-items: center;
				box-sizing: border-box;
				height: 116rpx;
				.msgInput {
					flex: 1;
					height: 80rpx;
					background: #F3F3F4;
					border-radius: 8rpx;
					padding: 0 20rpx;
					font-size: 32rpx;
					color: #333333;
					margin: 0 28rpx;
				}
				.inputIcon {
					flex-shrink: 0;
					width: 56rpx;
					height: 56rpx;
				}
				@keyframes rotating {
				    0% {
				        transform:rotate(0deg);
				    }
				    100% {
				        transform:rotate(360deg);
				    }
				}
				.sendBtn {
					width: 154rpx;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.msg {
						font-size: 32rpx;
						color: #F4F4F4;
						letter-spacing: 4rpx;
					}
					.loadingImg {
						width:36rpx;
						height: 36rpx;
						-webkit-animation: rotating 1.5s linear infinite;
						animation: rotating 1.5s linear infinite;
					}
				}
				.canSend {
					background: #0171F9;
				}
				.canntSend {
					background: #AAAAAA;
				}
			}
			.otherFunctionBox {
				padding-top: 28rpx;
				padding-left:52rpx;
				padding-right:52rpx;
				padding-bottom:60rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				overflow: hidden;
				box-sizing: border-box;
				height: 264rpx;
				.functionModelList:nth-child(4n) {
					margin-right:0;
				}
				.functionModelList {
					margin-right:66rpx;
					.fImageBox {
						width: 112rpx;
						height: 112rpx;
						background: #F8F8F8;
						border-radius: 8rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.fTitle {
						font-size: 26rpx;
						color: #55565E;
						line-height: 36rpx;
						text-align: center;
						margin-top: 28rpx;
					}
				}
			}
		}
	}
</style>
