 :cursor="msgValue ? msgValue.length : undefined"<template>
	<view class="chatDetails" id="chatMainBox">
		<!-- <uni-popup ref="messagePopup" type="message">
		    <uni-popup-message type="info" message="本功能旨在为大家提供一个沟通物流业务的渠道。请文明聊天，不得发布违反中国相关法律的内容！" :duration="0"></uni-popup-message>
		</uni-popup> -->
		<view class="headHintBox">本功能旨在为大家提供一个沟通物流业务的渠道。请文明聊天，不得发布违反中国相关法律的内容！</view>

		<view class="chatMessageList" :style="boxPadding">
			<view class="msgTime" v-if="msgAry.length > 0">{{showTime(msgAry['0'].timestamp)}}</view>
			<view class="contentList" v-for="(item, mIndex) in msgAry" :key="mIndex" :style="item.senderId == userInfo.attrs.userCode ? 'flex-direction: row-reverse;' : 'flex-direction: row;'">
				<view class="avatarBox" :style="item.senderId == userInfo.attrs.userCode ? 'margin-left:22rpx;' : 'margin-right:22rpx;'">
					<image class="userAvatar" v-if="item.senderId != userInfo.attrs.userCode" :src="receiverAvatar ? receiverAvatar : '../../../static/images/goodsDelivery/shipUserLogo.png'"></image>
					<image class="userAvatar" v-if="item.senderId == userInfo.attrs.userCode" :src="userInfo.attrs.avatar ? userInfo.attrs.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png'"></image>
				</view>
				<view class="contentMsg" :style="item.senderId == userInfo.attrs.userCode ? 'padding-left:60rpx;' : 'padding-right:60rpx;'">
					<!-- <view class="name" :style="item.senderId == userInfo.attrs.userCode ? 'text-align:right;' : 'text-align:left;'">{{item.name}}</view> -->
					<view class="contentBox" :style="item.senderId == userInfo.attrs.userCode ? 'flex-direction: row-reverse;' : 'flex-direction: row;'">
						<view class="msgBox" v-if="item.type == 'text'" :style="item.senderId == userInfo.attrs.userCode ? 'background: #0171F9;flex-direction: row-reverse;' : 'background: #F3F3F4;flex-direction: row;'">
							<view class="isMsg" :style="item.senderId == userInfo.attrs.userCode ? 'color: #FFF;' : 'color: #333;'">{{item.payload.text}}</view>
						</view>
						<image class="msgImage" v-if="item.type == 'image'" mode="heightFix" :src="item.payload.url" @click="showLargeImage(item.payload.url)"></image>
						<view class="orderCard" v-if="item.type == 'order'" @click="jumpToOrderDetails(item.payload)">
							<view class="orderDetailsBox">
								<view class="orderAddress">
									<view class="addressMsg">{{newShowAddressMsg('fir', item.payload)}}</view>
									<view class="distanceBox">
										<view class="orderEstimatedDistance" v-if="item.payload.estimatedDistance">{{item.payload.estimatedDistance}}km</view>
										<image class="distanceIcon" src="/static/images/newChat/distanceIcon.png"></image>
									</view>
									<view class="addressMsg">{{newShowAddressMsg('sec', item.payload)}}</view>
								</view>
								<view class="orderCar">
									<text class="carMsg">{{showCarMsg(item.payload)}}</text>
									<text class="carMultiTruck">{{showCarMultiTruck(item.payload)}}</text>
								</view>
								<view class="orderGoods">
									<image class="goodsIcon" src="/static/images/newCeratOrder/commonlyGoods.png"></image>
									<view class="goodsMsg">{{showGoodsMsg(item.payload)}}</view>
								</view>
								<view class="orderPirce">¥{{showOrderPrice(item.payload.fixPrice)}}/{{item.payload.orderChild.orderQuoteVO.quotePriceTypeName}}</view>
							</view>
							<view class="toDetailsBtn">点击查看详情</view>
						</view>
						<image class="sendErrorIcon" v-if="item.sendError" :style="item.senderId == userInfo.attrs.userCode ? 'margin-right:18rpx;' : 'margin-left:18rpx;'" src="../../../static/images/goodsDelivery/sendErrorIcon.png"></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="chatMessageBox" :style="safeBottom" :class="showFunctionFlag ? 'showChatMessageBox' : 'hiddenChatMessageBox'">
			<view class="msgInputBox">
				<image class="inputIcon" src="../../../static/images/goodsDelivery/showOtherIcon.png" @click="showOtherFunction(!showFunctionFlag)"></image>
				<input class="msgInput" confirm-type="send" v-model="msgValue" :auto-blur="true" :cursor="cursorLength" @confirm="checkSendMsg" @focus="inputOnFocus"/>
				<view class="sendBtn" :class="msgValue || isSending ? 'canSend' : 'canntSend'" @touchend.prevent="checkSendMsg">
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
	import IMService from "@/utils/imservice.js";
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
				receiverId: '',
				receiverAvatar: '',
				receiverNickname: '',
				receiverUserId: '',
				isSending: false,
				cursorLength: ''
			};
		},
		onLoad(option) {
			console.log(this.goEasy.getConnectionStatus());
			let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
			let userData = uni.getStorageSync("userInfo");
			if(this.goEasy.getConnectionStatus() == 'disconnected') {
				uni.showLoading();
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
				setTimeout(()=> {
					this.markPrivateMessageAsRead();
					this.onPrivateMessageReceived();
					this.getMessage();
				}, 500)
			}
			if(Number(userRole) == 1) {
				this.userInfo = userData ? JSON.parse(userData) : {};
				let avatarObj = JSON.parse(userData);
				this.userInfo.attrs.avatar = avatarObj.attrs.avatar;
			}else {
				this.userInfo = userData ? JSON.parse(userData) : {};
			}
			console.log('用户信息', this.userInfo)
			console.log('私信对象', option)
			let that = this;
			uni.getSystemInfo({
			    success: function (res) {
			        console.log('设备信息', res);
					that.safeAreaInsets = res.safeAreaInsets;
					that.safeBottom = 'padding-bottom:' + that.safeAreaInsets.bottom + 'rpx;';
					that.changeStyle(116);
			    }
			});
			uni.onWindowResize((res) => {
			    console.log('变化后的窗口高度=' + res.size.windowHeight);
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
			// receiverId=' + item.lastMessage.receiverId + '&avatar=' + item.data.avatar + '&nickname=' + item.data.nickname
			that.receiverId = option.receiverId;
			that.receiverAvatar = option.avatar;
			that.receiverNickname = option.nickname ? option.nickname : '';
			that.receiverUserId = option.userId ? option.userId : '';
			console.log('对方信息', that.receiverId, that.receiverNickname, that.receiverUserId);
			
		},
		onShow() {
			this.markPrivateMessageAsRead();
			this.onPrivateMessageReceived();
			this.getMessage();
		},
		onReady() {
			let msg = this.receiverNickname ? this.showChatName(this.receiverNickname) : this.receiverUserId ? '游客' + this.receiverUserId : '游客';
			console.log(msg);
			uni.setNavigationBarTitle({
			    title: msg
			});
			// 初始化页面并请求到数据是需要将页面滚动到底部
			this.toScrollPage();
			// this.$refs.messagePopup.open();
		},
		onPullDownRefresh(e) {
			this.getMessage();
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: './complaints?userCode=' + this.receiverId
			})
		},
		onUnload() {
			this.markPrivateMessageAsRead();
			let imService = getApp().globalData.imService;
			if(imService) {
				imService.onNewPrivateMessageReceive =  (friendId, message)=> {};
			}
		},
		methods: {
			onPrivateMessageReceived() {
				let imService = getApp().globalData.imService;
				imService.onNewPrivateMessageReceive =  (friendId, message)=> {
					console.log('对方的ID', this.receiverId);
					console.log('IM收到消息', friendId,message);
					if (friendId === this.receiverId) {
						this.msgAry.push(message);
				        //聊天时，收到消息标记为已读
						//收到新消息，是滚动到最底部
						this.toScrollPage();
					}
				};
			},
			markPrivateMessageAsRead() { // 将会话消息设置为已读
				this.goEasy.im.markPrivateMessageAsRead({
					userId: this.receiverId,  //聊天对象的userCode
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
				let lastTimestamp = this.msgAry[0] ? this.msgAry[0].timestamp : Date.now();
				let that = this;
				this.goEasy.im.history({
				    userId: that.receiverId,  //对方userId
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
						console.log('聊天列表', that.msgAry);
						uni.hideLoading();
						uni.stopPullDownRefresh();
				    },
				    onFailed: function (error) { //获取失败
				        console.log('历史消息获取失败', error);
						uni.hideLoading();
						uni.stopPullDownRefresh();
				    },
				});
			},
			inputOnFocus(e) { // 输入框聚焦
				console.log('输入框聚焦', e);
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
				// 敏感词替换
				// console.log('替换前的文字', this.msgValue);
				// var sensitiveWords = /哈哈|嘿嘿|嘻嘻/;
				// var execObj = sensitiveWords.exec(this.msgValue);
				// console.log('*标长度', execObj);
				// var testObj = sensitiveWords.test(this.msgValue);
				// console.log('敏感词校验', testObj);
				// if (testObj) {
				// 	let sybLength = execObj.length; // *标长度
				// 	let syb = '';
				// 	for(let i = 0; i < (execObj.length + 1); i++) {
				// 		syb = syb + '*';
				// 	}
				// 	this.msgValue = this.msgValue.replace(sensitiveWords, syb);
				// 	console.log('替换后的文字', this.msgValue);
				// 	this.sendMessage();
				// }else {
				// 	console.log('last替换后的文字', this.msgValue);
				// }
				
				// console.log(this.goEasy.im);
				var im = this.goEasy.im;
				//创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
				let textMessage = im.createTextMessage({
				    text: this.msgValue, //消息内容
				    to : {
				        type : this.GoEasy.IM_SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
						id : this.receiverId,
				        data:{"avatar": this.receiverAvatar, "name": this.receiverNickname, "userId": this.receiverUserId} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
				    },
					notification : { //APP在后台运行，或进程被杀掉，将会收到通知栏提醒
					    title : this.receiverNickname + '发来一段消息',
					    body : this.msgValue.length > 45 ? this.msgValue.substr(0, 45) + '...' : this.msgValue
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
						that.msgValue = '';
						that.isSending = false;
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
						id : that.receiverId,
						type : that.GoEasy.IM_SCENE.PRIVATE,
						data : {
							name: that.receiverNickname,
							avatar: that.receiverAvatar,
							userId: that.receiverUserId
						}
					},
					file: res,
					onProgress :function (progress) {
						console.log(progress)
					},
					notification : {
						title : that.userInfo.userName + '发来一张图片',
						body : '[图片消息]'		// 字段最长 50 字符
					}
				});
				
				that.goEasy.im.sendMessage({
				    message: imageMessage,
				    onSuccess: function (message) { //发送成功
				      console.log("发送成功", message);
					  that.msgAry.push(message);
					  that.msgValue = '';
					  that.toScrollPage();
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
			showChatName(str) { // 姓名脱敏
				if(!str) return false;
				return str.substr(0, 1) + '**';
			},
			showCarMsg(item) {
				let orderVehicleModelVOS = item.orderChild.orderVehicleModelVOS;
				let orderVehicleLengthVOs = item.orderChild.orderVehicleLengthVOs;
				let modelMsg = '';
				for(let m in orderVehicleModelVOS) {
					modelMsg = modelMsg + orderVehicleModelVOS[m].vehicleModel + '/';
				}
				modelMsg = modelMsg.slice(0, modelMsg.length - 1);
				let lengthMsg = '';
				for(let l in orderVehicleLengthVOs) {
					lengthMsg = lengthMsg + orderVehicleLengthVOs[l].vehicleLength + '米/';
				}
				lengthMsg = lengthMsg.slice(0, lengthMsg.length - 1);
				return modelMsg + ' ' + lengthMsg;
			},
			showCarMultiTruck(item) {
				if(item.multiTruck) {
					return item.multiTruck + '车'
				}else{
					return '单车'
				}
			},
			showGoodsMsg(item) { // 展示货源货物
				let goodsVo = item.cargoChild.goodsTypeVO;
				let msg = '';
				msg = goodsVo['0'].typeName + goodsVo['0'].children['0'].children['0'].children['0'].typeName;
				msg = item.cargoChild.weight ? msg + ' ' + item.cargoChild.weight + '吨' : msg;
				msg = item.cargoChild.volume ? msg + ' ' + item.cargoChild.volume + '方' : msg;
				return msg;
			},
			showOrderPrice(price) { // 展示货源价格
				if(!price) {
					return 0;
				}else {
					let num = Number(price) / 100;
					return num;
				}
			},
			newShowAddressMsg(flag, item) { // 展示地址
				let addressObj = {};
				let addAry = [];
				for(let i in item.orderChild.orderAddressVOS) {
					addAry.push(item.orderChild.orderAddressVOS[i]);
				}
				switch(flag) {
					case 'fir':
						addressObj = addAry['0'];
						console.log('装货点', addressObj);
						break;
					case 'sec':
						addressObj = addAry[addAry.length - 1];
						console.log('卸货点', addressObj);
						break;
				}
				let provinceMsg = addressObj.province;
				let cityMsg = addressObj.city;
				let areaMsg = addressObj.area;
				
				if(addressObj && addressObj.cityCode && addressObj.cityCode == addressObj.areaCode) {
					return provinceMsg.substring(0,2) + '-' + areaMsg.substring(0,2);
				}else {
					return provinceMsg.substring(0,2) + '-' + cityMsg.substring(0,2) + '-' + areaMsg.substring(0,2);
				}
			},
			replaceProvince(name) { // 去除省的，省、市、自治区、维吾尔、壮族、回族
				let returnName = name.replace('省', '');
				returnName = returnName.replace('市', '');
				returnName = returnName.replace('自治区', '');
				returnName = returnName.replace('维吾尔', '');
				returnName = returnName.replace('壮族', '');
				returnName = returnName.replace('回族', '');
				return returnName;
			},
			async getDriverOrder(sid) {
				console.log('货源的sid', sid)
				var that = this;
				try {
					// that.$refs.bandAlert.open();
					var response = await utils.newQueryPostRequest('/td/circuit/getOrderRecord', {
						sid,
					});
					console.log(response, '详情')
					var supplyDetails = {};
					if (response.retCode == "0000000") {
						var details = response.rspBody;
						supplyDetails = details;
						supplyDetails.needInvoiceFlag = details.needInvoiceFlag;

						var platformOrderStatus = 0;
						var platformOrderText = '';
						supplyDetails.sid = details.sid;
						supplyDetails.orderDriverBidSid = details.orderDriverBidSid;
						try {
							//报价状态
							var multiTruck = details.multiTruck;
							var quoteStatus = this.quoteStatus;
							var orderQuotationStatus = details.orderQuotationStatus;
							var orderSecondState = details.orderSecondState;
							if (multiTruck > 1) {
								if (orderQuotationStatus == 2 || orderQuotationStatus > 4) {
									supplyDetails.orderStateText = '货源有效中'
								} else if (orderQuotationStatus == 1 || orderQuotationStatus == 0) {
									supplyDetails.orderStateText = "已接单"
								}  else  {
									supplyDetails.orderStateText = '货源有效中'
								}
							} else {
								if (orderQuotationStatus == undefined || (orderQuotationStatus == 3 && orderSecondState == 13) ) {
									supplyDetails.orderStateText = details.fixPriceFlag == 1 ? "货源有效中" : "报价中"
								} else if (orderQuotationStatus == 1 || orderQuotationStatus == 0) {
									supplyDetails.orderStateText = details.fixPriceFlag == 1 ? '已接单' : "已报价"
								} else if (orderQuotationStatus == 2 || orderQuotationStatus > 4) {
									supplyDetails.orderStateText = "已成交"
								} else if ( (orderQuotationStatus == 3 && orderSecondState != 13) || orderQuotationStatus == 4) {
									supplyDetails.orderStateText = "货源有效中"
								}
							}
							
							supplyDetails.orderQuotationStatus = orderQuotationStatus;
							
							//货源状态
							supplyDetails.orderSecondState = details.orderSecondState;
				
							//报价截止时间
							var endData = details.child.orderQuoteVO.quotePriceFinishDt;
							if (endData) {
								endData = endData.replace(/-/g, "/");
								var date1 = new Date(endData);
								var now1 = new Date();
								var nowStr = new Date().getTime();
								var dateStr = date1.getTime();
								var minuteDis = details.child.orderQuoteVO.quotePriceTime;
								var month = date1.getMonth() + 1;
								var nowDay = now1.getDate();
								var day = date1.getDate();
								var hour = date1.getHours();
								var minutes = date1.getMinutes();
								if (hour < 10) {
									hour = '0' + hour
								}
				
								if (minutes < 10) {
									minutes = '0' + minutes
								}
								console.log(day, nowDay, '当前的天1111');
								if (day != nowDay) {
									month = month < 10 ? '0' + month : month;
									day = day < 10 ? '0' + day : day;
									supplyDetails.quotePriceFinishDt = month + '-' + day + ' ' + hour + ":" + minutes
								} else {
									supplyDetails.quotePriceFinishDt = hour + ":" + minutes
								}
								supplyDetails.minuteDis = minuteDis;
							}
				
							//装卸地址
							var orderAddressVOS = details.child.orderAddressVOS,
								LoadingAndUnloadingMethods = "",
								loadingMethods = "";
							var startAddr = '',
								endAddr = "",
								unLoadingMethods = "",
								zhuangAddress = "",
								xieAddress = "",
								startSerialnumber = "",
								endSerialnumber = "";
							var startDistance = [], endDistance = [];
							orderAddressVOS.forEach(atem => {
								if (atem.serialnumber == 1) {
									if (atem.latitude) {
										startDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										startDistance.push(atem.longitude)
									}
									var province = atem.province;
									if (province.indexOf('市') > -1) {
										//直辖市
										startAddr = atem.province + '-' + atem.city
										zhuangAddress = atem.province + atem.city + atem.address;
									} else {
										startAddr = atem.province + '-' + atem.city + '-' + atem.area;
										zhuangAddress = atem.province + atem.city + atem.area + atem.address;
									}
									loadingMethods = "一装"
									startSerialnumber = 1
								} else if (atem.serialnumber == 2) {
									loadingMethods = "二装"
								} else if (atem.serialnumber == 4) {
									endSerialnumber = 4
									if (atem.latitude) {
										endDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										endDistance.push(atem.longitude)
									}
									var province = atem.province;
									if (province.indexOf('市') > -1) {
										//直辖市
										endAddr = atem.province + '-' + atem.city
										xieAddress = atem.province + atem.city + atem.address;
									} else {
										endAddr = atem.province + '-' + atem.city + '-' + atem.area;
										xieAddress = atem.province + atem.city + atem.area + atem.address;
									}
									unLoadingMethods = "两卸"
								} else if (atem.serialnumber == 3) {
									endSerialnumber = 3
									if (atem.latitude) {
										endDistance.push(atem.latitude)
									}
									if (atem.longitude) {
										endDistance.push(atem.longitude)
									}
									var province = atem.province;
									if (province.indexOf('市') > -1) {
										//直辖市
										endAddr = atem.province + '-' + atem.city
										xieAddress = atem.province + atem.city + atem.address;
									} else {
										endAddr = atem.province + '-' + atem.city + '-' + atem.area;
										xieAddress = atem.province + atem.city + atem.area + atem.address;
									}
				
									unLoadingMethods = "一卸"
								}
							})
							LoadingAndUnloadingMethods = loadingMethods + unLoadingMethods;
							supplyDetails.LoadingAndUnloadingMethods = LoadingAndUnloadingMethods;
							supplyDetails.startAddr = startAddr;
							supplyDetails.endAddr = endAddr;
							supplyDetails.zhuangAddress = zhuangAddress;
							supplyDetails.xieAddress = xieAddress;
							supplyDetails.startSerialnumber = startSerialnumber;
							supplyDetails.endSerialnumber = endSerialnumber;
							supplyDetails.orderAddressVOS = orderAddressVOS;
							//距离装货点的距离
							//当前位置离装货点的距离
							var distance = 0;
							if (this.latitude) {
								distance = publicData.getFlatternDistance(startDistance[0], startDistance[1], this.latitude, this.longitude);
							} else {
								distance = details.distance ? ((details.distance)/1000).toFixed(0) : 0;
							}
							supplyDetails.distance = Number(distance) || 0;
							
							//货主用户信息
							var orderContactsVOS = details.child.orderContactsVOS;
							var orderState = details.orderState;
							var orderQuoation = details.orderQuoation;
							var goodsUserName = '',
								enterpriseName;
							orderContactsVOS.forEach(item => {
								if (item.serialnumber == 1) {
									goodsUserName = item.userName;
								}
							})
							enterpriseName = details.enterpriseName;
							if (this.multiTruck < 2) {
								if (orderState !== 3) {
									goodsUserName = goodsUserName.substring(0, 1) + '**';
									enterpriseName = enterpriseName ? enterpriseName.substring(0, 2) + '****' : '';
								}
							} else {
								if (orderQuoation !== 2) {
									goodsUserName = goodsUserName.substring(0, 1) + '**';
									enterpriseName = enterpriseName ? enterpriseName.substring(0, 2) + '****' : '';
								}
							}
							this.orderContactsVOS = orderContactsVOS;
							supplyDetails.goodsUserName = goodsUserName;
							supplyDetails.enterpriseName = enterpriseName;
							//货物信息相关
							var goodsTypeVO = details.cargoChild.goodsTypeVO,
								goodArr = [];
							var cargoChild = details.cargoChild;
							goodsTypeVO.forEach(atem => {
								var firstName = atem.typeName
								if (atem.children) {
									var atem1 = atem.children;
									atem1.forEach(atem01 => {
										var atem2 = atem01.children;
										if (atem2) {
											atem2.forEach(atem02 => {
												var atem3 = atem02.children;
												if (atem3) {
													atem3.forEach(atem03 => {
														var typeName = atem03.typeName;
														var name = firstName + '-' +
															typeName
														goodArr.push(name)
													})
												}
											})
										}
									})
								}
							})
							var goods = goodArr.join(",");
				
							//单位
							var weight = cargoChild.weight;
							var volume = cargoChild.volume;
							supplyDetails.goods = goods;
							supplyDetails.weight = weight;
							supplyDetails.volume = volume;
							//车长
				
							var cargoChild = details.cargoChild;
							var orderVehicleLengthVOS = details.child.orderVehicleLengthVOs,
								orderVehicleLength = [];
							if (orderVehicleLengthVOS) {
								orderVehicleLengthVOS.forEach(atem => {
									orderVehicleLength.push(atem.vehicleLength)
								})
							}
				
							//车型
							var orderVehicleModelVOS = details.child.orderVehicleModelVOS,
								orderVehicleModel = [];
							if (orderVehicleModelVOS) {
								orderVehicleModelVOS.forEach(atem => {
									orderVehicleModel.push(atem.vehicleModel)
								})
							}
				
				
							orderVehicleLength = orderVehicleLength ? orderVehicleLength.join('/') : '';
							orderVehicleModel = orderVehicleModel ? orderVehicleModel.join("/") : '';
				
							supplyDetails.orderVehicleLength = orderVehicleLength;
							supplyDetails.orderVehicleModel = orderVehicleModel;
				
							//信息费用,默认是分，转化为元
							var orderQuoteVO = details.child.orderQuoteVO;
							var informationPrice = orderQuoteVO.informationPrice / 100;
							//备注
							var remark = details.cargoChild.remark;
							//是否需要回单
							var receiptTypeText = details.receiptType == 1 ? '需要回单' : '不需要回单';
							//图片
				
							var goodsUrl = details.cargoChild.goodsUrl;
							if (goodsUrl) {
								goodsUrl = goodsUrl.split(',')
							}
							supplyDetails.informationPrice = informationPrice;
							supplyDetails.remark = remark;
							supplyDetails.receiptTypeText = receiptTypeText;
							supplyDetails.goodsUrl = goodsUrl;
				
							//最早，最晚装卸货时间
							var orderLoadTimeRecordVO = details.child.orderLoadTimeRecordVO;
							var earlyLoadDt = '',
								earlyUnLoadDt = "",
								endLoadDt = '',
								endUnLoadDt = '';
							orderLoadTimeRecordVO.forEach(item => {
								if (item.serialnumber == 1) {
									var startDt = item.startDt;
									startDt = startDt.replace(/-/g, '/');
									var endDt = item.endDt;
									endDt = endDt.replace(/-/g, '/');
									var nowDate = new Date().getDate();
									var startDate = new Date(startDt).getDate();
									var endDate = new Date(endDt).getDate();
									var hour = new Date(startDt).getHours();
									var minutes = new Date(startDt).getMinutes();
									if (hour < 10) {
										hour = '0' + hour
									}
									if (minutes < 10) {
										minutes = '0' + minutes
									}
				
									var endHour = new Date(endDt).getHours();
									var endMinutes = new Date(endDt).getMinutes();
									if (endHour < 10) {
										endHour = '0' + endHour
									}
									if (endMinutes < 10) {
										endMinutes = '0' + endMinutes
									}
				
									console.log(nowDate, startDate, '日期');
									if (nowDate - startDate == 0) {
										if (hour < 12) {
											earlyLoadDt = "今天上午" + hour + ':' + minutes;
										} else {
											earlyLoadDt = "今天下午" + hour + ':' + minutes;
										}
										
										
									} else if (nowDate - startDate == -1) {
										if (hour < 12) {
											earlyLoadDt = "明天上午" + hour + ':' + minutes;
										} else {
											earlyLoadDt = "明天下午" + hour + ':' + minutes;
										}
									} else if (nowDate - startDate == -2) {
										if (hour < 12) {
											earlyLoadDt = "后天上午" + hour + ':' + minutes;
										} else {
											earlyLoadDt = "后天下午" + hour + ':' + minutes;
										}
									} else {
										earlyLoadDt = item.startDt;
									}
									if (nowDate - endDate == 0) {
										endLoadDt = "今天" + endHour + ':' + endMinutes
									} else if (nowDate - endDate == -1) {
										endLoadDt = "明天" + endHour + ':' + endMinutes
									} else if (nowDate - endDate == -2) {
										endLoadDt = "后天" + endHour + ':' + endMinutes
									} else {
										endLoadDt = item.endDt
									}
				
								} else if (item.serialnumber == 4) {
									earlyUnLoadDt = item.startHours;
									endUnLoadDt = item.endHours
				
								} else if (item.serialnumber == 3) {
									earlyUnLoadDt = item.startHours;
									endUnLoadDt = item.endHours
				
								}
							})
				
							//支付方式
							var payType = details.child.orderQuoteVO.payType;
							supplyDetails.payType = payType;
							supplyDetails.earlyLoadDt = earlyLoadDt;
							supplyDetails.endLoadDt = endLoadDt;
							supplyDetails.earlyUnLoadDt = earlyUnLoadDt;
							supplyDetails.endUnLoadDt = endUnLoadDt;
							//温控
							supplyDetails.temperature = details.temperature;
				
							//是否固定价格货源
							supplyDetails.fixPriceFlag = details.fixPriceFlag;
							supplyDetails.fixPrice = details.fixPrice;
							//是否是冷藏
							supplyDetails.orderType = details.orderType;
							//装卸是否禁区
							supplyDetails.forbiddenZoneType = details.forbiddenZoneType;
							//报价的货物单位
							supplyDetails.quotePriceTypeName = details.child.orderQuoteVO.quotePriceTypeName;
							try {
								if (details.fleetSids) {
									var fleetSids = JSON.parse(supplyDetails.fleetSids);
									var fleetSidsArr = [];
									fleetSids.forEach(item => {
										fleetSidsArr.push(item.name)
									})
									supplyDetails.fleetSids = fleetSidsArr.join(";");
								}
							} catch (e) {
								//TODO handle the exception
							}
							//判断是否是车队货源
							supplyDetails.supply = details.supply;
				
							//判断是否是多车
							supplyDetails.multiTruck = details.multiTruck;
							
							//判断报价单的状态
							supplyDetails.orderQuoation = details.orderQuoation;
							
							var startAddress = details.child.orderAddressVOS[0].address;
							var endAddress = '';
							details.child.orderAddressVOS.map(val => {
								if (!endAddress && val.serialnumber == 3) {
									endAddress = val.address
								}
							})
							var startDt = details.child.orderLoadTimeRecordVO[0].startDt;
							var endDt = details.child.orderLoadTimeRecordVO[0].endDt;
							var startDt1 = '';
							var endDt1 = '';
							console.log(details)
							details.child.orderLoadTimeRecordVO.map(data => {
								if (!startDt1 && data.serialnumber == 3) {
									startDt1 = data.startHours;
									endDt1 = data.endHours;
								}
							})
							var receiptType = details.receiptType;
							var fixPrice = details.fixPrice;
							var remark = details.cargoChild.remark;
							var loadFactor = [];
							details.child.orderLoadFactorVOS.map((data, index) => {
								if (data.loadFactorCode == "diyHeight") {
									loadFactor.push("限高" + data.loadFactor + '米')
								} else if  (data.loadFactorCode == "diyLayer") {
									loadFactor.push("堆垛" + data.loadFactor + '层')
								} else if (data.loadFactorCode == "diyOther") {
									loadFactor.push(data.loadFactor)
								} else {
									loadFactor.push(data.loadFactor)
								}
							})
							loadFactor = loadFactor.join("、");
				
							//在途时效
							supplyDetails.estimatedTime = details.estimatedTime;
							//货源发布时间
							var pushDt = details.pushDt;
							pushDt = pushDt.replace(/-/g, "/");
				
							var mon = new Date(pushDt).getMonth() + 1;
							var day = new Date(pushDt).getDate()
							var hour = new Date(pushDt).getHours() < 10 ? '0' + new Date(pushDt).getHours() : new Date(
								pushDt).getHours();
							var minute = new Date(pushDt).getMinutes() < 10 ? '0' + new Date(pushDt).getMinutes() :
								new Date(pushDt).getMinutes();
							supplyDetails.pushDate = mon + '月' + day + '日';
							supplyDetails.pushTime = hour + ':' + minute;
							supplyDetails.startAddress = startAddress;
							supplyDetails.endAddress = endAddress;
							supplyDetails.startDt = startDt;
							supplyDetails.endDt = endDt;
							supplyDetails.startDt1 = startDt1;
							supplyDetails.endDt1 = endDt1;
							supplyDetails.receiptType = receiptType;
							supplyDetails.remark = remark;
							supplyDetails.loadFactor = loadFactor;
							console.log(supplyDetails, 'aaa')
							return supplyDetails;
							
						} catch (e) {
							//TODO handle the exception
							return null;
						}
					} else {
						uni.showToast({
							title: response.retDesc,
							icon: 'none'
						})
						return null;
					}
					uni.hideLoading();
				} catch (e) {
					//TODO handle the exception
					console.log(e)
					uni.hideLoading();
					return null;
				}
				
			},
			async jumpToOrderDetails(item) { // 货主直接跳转，司机先查询货源状态，若失效则提示货源已失效，若还生效则跳转报价
				let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主
				if(Number(userRole) == 1) {
					uni.showLoading();
					var supplyDetails = await this.getDriverOrder(item.sid);
					if (!supplyDetails) return;
					uni.hideLoading();
					if (supplyDetails.orderSecondState == 15) {
						uni.showToast({
							title: '货源已下架，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					if (supplyDetails.orderSecondState == 18) {
						uni.showToast({
							title: '货源已关闭，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					if (supplyDetails.orderSecondState != 11 && supplyDetails.orderSecondState != 13 && supplyDetails.orderSecondState != 14 && supplyDetails.orderQuotationStatus == undefined && supplyDetails.multiTruck < 2) {
						uni.showToast({
							title: '货源已关闭，请查看其它货源吧~',
							icon: 'none'
						})
						return;
					}
					var multiTruck = supplyDetails.multiTruck;
					var orderQuoation = supplyDetails.orderQuotationStatus;
					if (multiTruck > 1) {
						if ((orderQuoation !== undefined && orderQuoation <= 2)) {
							uni.showToast({
								title: '当前货源已报价',
								icon: 'none'
							})
							return;
						}
					} else {
						if ((orderQuoation !== undefined && orderQuoation <= 2) || orderQuoation > 4) {
							uni.showToast({
								title: '当前货源已报价',
								icon: 'none'
							})
							return;
						}
					}
					
					// uni.navigateTo({
					// 	url: '/pages/ship/quotedPrice/quotedPrice?quoteDetails=' + JSON.stringify(supplyDetails)
					// })
					uni.navigateTo({
						url: '/pages/ship/supplyDetails/supplyDetails?sid=' + item.sid + '&status=3'
					})
					
				}else {
					uni.navigateTo({
					    url: '../orderDetails/manyCarsDetail?sid=' + item.sid
					});
				}
			},
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
						.orderCard {
							background: #FFFFFF;
							box-shadow: 0px 0px 20rpx 2rpx rgba(172,203,255,0.34);
							border-radius: 24rpx;
							width: 500rpx;
							.orderDetailsBox {
								padding: 40rpx 22rpx 16rpx 22rpx;
								.orderAddress {
									display: flex;
									align-items: center;
									.addressMsg {
										flex:1;
										font-size: 32rpx;
										font-weight: 500;
										color: #000000;
										line-height: 44rpx;
										white-space: nowrap;
										text-overflow: ellipsis;
										overflow: hidden;
										word-break: break-all;
									}
									.distanceBox {
										flex-shrink: 0;
										margin: 0 20rpx;
										.orderEstimatedDistance {
											font-size: 20rpx;
											color: #E5500E;
											margin-bottom:-8rpx;
										}
										.distanceIcon {
											display: block;
											width: 100rpx;
											height: 35rpx;
										}
									}
								}
								.orderCar {
									margin-top: 14rpx;
									line-height: 44rpx;
									word-break:break-all;
									.carMsg {
										font-size: 28rpx;
										color: #333333;
									}
									.carMultiTruck {
										padding-left: 20rpx;
										font-size: 32rpx;
										font-weight: bold;
										color: #E5500E;
									}
								}
								.orderGoods {
									display: flex;
									align-items: center;
									margin-top: 14rpx;
									.goodsIcon {
										display: block;
										width: 28rpx;
										height: 28rpx;
										margin-right:12rpx;
									}
									.goodsMsg {
										font-size: 28rpx;
										font-weight: 500;
										color: #333333;
										line-height: 44rpx;
									}
								}
								.orderPirce {
									font-size: 40rpx;
									font-weight: bold;
									color: #E5500E;
									line-height: 44rpx;
									text-align: right;
									margin-top: 14rpx;
								}
							}
							.toDetailsBtn {
								border-top: 2rpx solid #DCDCDC;
								padding: 14rpx 0;
								font-size: 28rpx;
								font-weight: 500;
								color: #000000;
								line-height: 44rpx;
								text-align: center;
							}
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
