<template>
	<view class="all">
		<view class="noData01" v-if="userArr.length == 0">
			<noData></noData>
		</view>
		<view class="member-box" v-for="item in userArr">
			<image class="user-img" :src="item.avatar?item.avatar:'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'" mode=""></image>
			<view class="user-box">
				<view class="user-name">
					<view class="" v-if="item.isOwner && info.fleetAttributes == '平台'">货运中国</view>
					<view class="" v-else>{{item.userName ? showChatName(item.userName) : item.userId ? '游客' + item.userId : '游客'}}</view>
					<view class="owner-text" v-if="listType==3 && item.isOwner==1">创建人</view>
				</view>
				<view class="user-company" v-if="item.enterpriseName">{{item.enterpriseName}}</view>
				<view class="user-company" v-if="item.createdDt">{{item.createdDt}}</view>
			</view>
			<view class="user-btn" v-if="listType!=3 &&(info.isAdmin || info.isOwner)" @click="makePhoneCall(item)">联系</view>
			<view class="user-btn" v-if="listType==3 && ((userRole == 1 && info.allowDriverContact) || (userRole == 2 && info.allowConsignorContact))" @click="makePhoneCall(item)">联系</view>
			<!-- <view class="user-btn" v-if="(listType==2 && info.isMember) || listType!=2" style="margin-left: 20rpx;" @click="toChatDetails(item)">私信</view> -->
			<!-- <view class="user-btn" v-if="listType!=3 &&(info.isAdmin || info.isOwner)" style="margin-left: 20rpx;" @click="toChatDetails(item)">私信</view> -->
			<!-- <view class="user-btn" v-if="listType==3 && ((userRole == 1 && info.allowDriverContact) || (userRole == 2 && info.allowConsignorContact))" style="margin-left: 20rpx;" @click="toChatDetails(item)">私信</view> -->
			
		</view>
		<uni-morebox :isMore="isNoMore" :containerStyle="{'height': '90rpx', 'line-height': '90rpx'}"></uni-morebox>
	</view>
</template>

<script>
	import noData from "@/components/noData.vue";
	import UniMorebox from "@/components/uni-morebox.vue";
	import * as ship from "@/utils/ship.js"
	import IMService from "@/utils/imservice.js";
	export default {
		components: {
			noData,
			UniMorebox
		},
		data() {
			return {
				info: {},
				userArr: [],
				total: 0,
				pageNum: 1,
				pageSize: 10,
				listType: 0,
				userRole: 0,
				isNoMore: 'more',
			}
		},
		onLoad(options) {
			let that = this;
			that.info = JSON.parse(options.info);
			that.listType = options.type;
			that.userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
			if(options.type == 1){
				uni.setNavigationBarTitle({
					title:'访客'
				})
			} else if(options.type == 2){
				uni.setNavigationBarTitle({
					title:'粉丝'
				})
			} else {
				uni.setNavigationBarTitle({
					title:'管理员'
				})
			}
			that.fleetWithUserList(options.type);
		},
		onPullDownRefresh() {
			let that = this;
			that.pageNum = 1;
			that.userArr = [];
			that.fleetWithUserList(that.listType);
		},
		onReachBottom() {
			let that = this;
			console.log(that.userArr.length, that.total);
			if(that.userArr.length != that.total){
				that.pageNum = that.pageNum + 1
				that.fleetWithUserList(that.listType);
			}
		},
		methods:{
			toChatDetails(item) { // 跳转私聊
				console.log(item);
				if(this.currentUserCode == item.userCode){
					uni.showToast({
						title: '您不能给自己发私信',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中'
				})
				console.log('车队详情', this.info);
				let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
				let userData = uni.getStorageSync("userInfo");
				console.log('用户信息', JSON.parse(userData));
				let userInfo = '';
				if(Number(userRole) == 1) {
					userInfo = userData ? JSON.parse(userData) : {};
					let avatarObj = JSON.parse(userData);
					userInfo.attrs.avatar = avatarObj.attrs.avatar;
				}else {
					userInfo = userData ? JSON.parse(userData) : {};
				}
				let userName = item.userName ? item.userName.substr(0, 1) + '**' : '';
				let avatar = item.avatar ? item.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png';
				if(this.goEasy.getConnectionStatus() == 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
					uni.hideLoading();
					uni.navigateTo({
						url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
					})
				}else {
					uni.hideLoading();
					uni.navigateTo({
						url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
					})
				}
				
			},
			makePhoneCall(item){
				uni.showModal({
					title:'提示',
					content: '申请获取您的电话权限，用于联系车队管理员审核使您快速加入车队',
					success: function(res) {
						if (res.confirm) {
							uni.makePhoneCall({
							    phoneNumber: item.displayMobile ? item.displayMobile : item.mobile //仅为示例
							});
						}
					}
				})
				
			},
			setUserName(str){
				if (!str) return;
				var nameArr =  str.split("");
				var symbol = '';
				nameArr.map((val, index)=>{
					if(index!=0){
						symbol = symbol + "*"
					}
				})
				return str.substring(0,1)+ symbol
			},
			setEnterpriseName(str) {
				if (!str) return;
				return str.substring(0,2)+ '***'
			},
			fleetWithUserList(type){
				let that = this;
				console.log(this.info,'asas')
				if(that.userArr.length>0){
					that.isNoMore = 'loading';
				}
				if(type == 2 || type == 3){
					let obj = {
						fleetId: that.info.id,
						pageNum: that.pageNum,
						pageSize: that.pageSize,
						count: false
					}
					if(type == 2){
						obj.status = 3;
					}
					if(type == 3){
						obj.isAdmin = 1;
					}
					console.log('请求参数', obj);
					ship.newQueryPostRequest('/cd/fleetWithUser/list', obj)
					.then(res=>{
						console.log('列表参数', res);
						if(res.retCode == "0000000"){
							var items = res.rspBody.items;
							var info = this.info;
							items.forEach(a => {
								//访客限制
								var userName = a.userName;
								var enterpriseName = a.enterpriseName;
								if (this.listType == 2) {
									//粉丝
									if (this.info.isAdmin != 1 && this.info.isOwner != 1) {
										a.userName = that.setUserName(userName);
										a.enterpriseName = that.setEnterpriseName(enterpriseName)
									}
								}
								if (this.listType == 1) {
									//访客
									a.userName = that.setUserName(userName);
									a.enterpriseName = that.setEnterpriseName(enterpriseName)
									
								}
								if (this.listType == 3) {
									//管理员
									a.userName = that.setUserName(userName);
									a.enterpriseName = that.setEnterpriseName(enterpriseName)
									
								}
							})
							that.total = res.rspBody.total;
							that.userArr = that.userArr.concat(res.rspBody.items);
							if(that.userArr.length < res.rspBody.total || res.rspBody.total == 0){
								that.isNoMore = 'more';
							} else {
								that.isNoMore = 'noMore';
							}
							console.log(that.userArr);
						}
					})
					.catch(err=>{
						console.log(err)
					})
				} else {
					ship.newQueryPostRequest('/cd/fleetViewLog/findPerUser', {
						fleetId: that.info.id,
						pageNum: that.pageNum,
						pageSize: that.pageSize,
					})
					.then(res=>{
						console.log(res);
						if(res.retCode == "0000000"){
							that.total = res.rspBody.total;
							var items = res.rspBody.items;
							var info = this.info;
							items.forEach(a => {
								//访客限制
								var userName = a.userName;
								var enterpriseName = a.enterpriseName;
								if (this.listType == 2) {
									//粉丝
									if (this.info.isAdmin != 1 && this.info.isOwner != 1) {
										a.userName = that.setUserName(userName);
										a.enterpriseName = that.setEnterpriseName(enterpriseName)
									}
								}
								if (this.listType == 1) {
									//访客
									a.userName = that.setUserName(userName);
									a.enterpriseName = that.setEnterpriseName(enterpriseName)
									
								}
							})
							that.userArr = that.userArr.concat(items);
							if(that.userArr.length < res.rspBody.total || res.rspBody.total == 0){
								that.isNoMore = 'more';
							} else {
								that.isNoMore = 'noMore';
							}
							console.log(that.userArr);
						}
					})
					.catch(err=>{
						console.log(err)
					})
				}
				uni.stopPullDownRefresh();
			},
			showChatName(str) { // 姓名脱敏
				if(!str) return false;
				return str.substr(0, 1) + '**';
			}
		}
	}
</script>

<style lang="scss">
	.all{
		border-top: 2rpx solid #E3E3E3;
		.noData01 {
			flex: 1;
			height: 700rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.member-box{
			display: flex;
			align-items: center;
			padding: 28rpx 16rpx;
			.user-img{
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
			}
			.user-box{
				flex: 1;
				padding: 0 22rpx;
				.user-name{
					font-size: 30rpx;
					color: #333;
					font-weight: 600;
					display: flex;
					align-items: center;
					.owner-text{
						color: #0171F9;
						font-size: 28rpx;
						font-weight: 400;
						margin-left: 50rpx;
					}
				}
				.user-company{
					color: #777;
					font-size: 26rpx;
					margin-top: 4rpx;
				}
			}
			.user-btn{
				width: 130rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				color: #0171F9;
				border: 2rpx solid #0171F9;
				border-radius: 8rpx;
				font-size: 26rpx;
			}
		}
	}
</style>
