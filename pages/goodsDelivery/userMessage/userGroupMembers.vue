<template>
	<view class="userGroupMembers">
		<view class="member-box" v-for="item in userArr">
			<image class="user-img" :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'"></image>
			<view class="user-box">
				<view class="user-name">
					<view class="">{{item.userName ? showChatName(item.userName) : '游客' + item.userId}}</view>
				</view>
				<view class="user-company" v-if="item.createdDt">{{item.createdDt}}</view>
			</view>
			<view class="user-btn" @click="makePhoneCall(item)">联系</view>
			<view class="user-btn" style="margin-left: 20rpx;" @click="toChatDetails(item)">私信</view>
		</view>
		
		<view class="loadingBox" v-show="listNoData">
			<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
		</view>
		<view class="loadingBox" v-show="noMore">
			没有更多了～
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
			努力加载中…
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js"
	export default {
		components: {
		},
		data() {
			return {
				userArr: [],
				total: 0,
				pageNum: 1,
				pageSize: 20,
				listType: 0,
				userRole: 0,
				listNoData: false,
				noMore: false,
				isLoading: false,
			}
		},
		onLoad(options) {
			let that = this;
			that.listType = options.type;
			that.userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
			that.fleetWithUserList();
		},
		onPullDownRefresh() {
			this.pageNum = 1;
			this.userArr = [];
			this.listNoData = false;
			this.noMore = false;
			this.fleetWithUserList();
		},
		onReachBottom() {
			if(!this.listNoData && !this.noMore){
				this.isLoading = true;
				this.pageNum = this.pageNum + 1;
				this.fleetWithUserList();
			}
		},
		onReady() {
			if(this.listType == 1){
				uni.setNavigationBarTitle({
					title:'粉丝'
				})
			} else if(this.listType == 2){
				uni.setNavigationBarTitle({
					title:'访客'
				})
			}
		},
		methods:{
			toChatDetails(item) { // 跳转私聊
				let userName = item.userName ? item.userName.substr(0, 1) + '**' : '游客' + item.userId;
				let avatar = item.avatar ? item.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png';
				uni.navigateTo({
					url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
				})
			},
			fleetWithUserList(type){
				let url = this.listType == 1 ? '/cd/fansmag/list' : '/cd/unimsg/list';
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				console.log('查询参数', params);
				let that = this;
				utils.postRequest(url, params)
				.then(res=>{
					console.log('列表数据', res);
					if(res.retCode == '0000000') {
						let rspBody = res.rspBody ? res.rspBody : [];
						if(that.pageNum == 1 && rspBody && rspBody.length == 0) {
							that.listNoData = true;
						}
						if(rspBody && rspBody.length > 0) {
							for(let i in rspBody) {
								that.userArr.push(rspBody[i]);
							}
						}
						if(rspBody.length < that.pageSize) {
							that.noMore = true;
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.stopPullDownRefresh();
					that.isLoading = false;
				})
				.catch(err=>{
					console.log(err)
					uni.stopPullDownRefresh();
					that.isLoading = false;
				})
			},
			makePhoneCall(item){
				uni.makePhoneCall({
				    phoneNumber: item.displayMobile ? item.displayMobile : item.mobile //仅为示例
				});
			},
			showChatName(str) { // 姓名脱敏
				if(!str) return false;
				return str.substr(0, 1) + '**';
			}
		}
	}
</script>

<style lang="scss">
	.userGroupMembers{
		border-top: 2rpx solid #E3E3E3;
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
						margin-left: 80rpx;
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
		@keyframes rotating {
		    0% {
		        transform:rotate(0deg);
		    }
		    100% {
		        transform:rotate(360deg);
		    }
		}
		.loadingBox {
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 1.5s linear infinite;
		        animation: rotating 1.5s linear infinite;
			}
			.noDataIcon {
				width: 244rpx;
				height: 246rpx;
				margin-top:50rpx;
			}
		}
	}
</style>
