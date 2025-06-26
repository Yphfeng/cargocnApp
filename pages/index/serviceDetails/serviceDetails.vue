<template>
	<view>
		<swiper class="swiper" indicator-dots="false" interval="5000" duration="1000" autoplay="true">
			<block v-for="(item, index) in detailsObj.newFacadeImgs" :key="index">
				<swiper-item>
					<view style="width:750rpx;height: 306rpx;">
						<image :src="item" mode="aspectFill" />
					</view>
				</swiper-item>
			</block>
		</swiper>
		<view class="card-box">
			<view class="card">
				<view class="card-name">{{detailsObj.providerName}}</view>
				<view class="lable-box">
					<view style="display: flex; width: 500rpx;flex-wrap: wrap;">
						<view class="lable-child" v-for="item in detailsObj.labelVOS">{{item.labelName}}</view>
					</view>
					<view class="phone-box" @click="makePhoneCall(detailsObj)">
						<image class="phone-img" src="/static/images/tel.png"></image>
						<view class="">联系TA</view>
					</view>
				</view>
				<view class="card-content">
					<image class="time-img" src="../../../static/images/time.png" mode="widthFix"></image>
					<view class="">营业时间：{{detailsObj.businessHours?detailsObj.businessHours:'未设置'}}</view>
				</view>
				<view class="card-content">
					<image class="time-img" src="../../../static/images/address.png" mode="widthFix"></image>
					<view class="">距离位置{{getDistance(detailsObj.latitude, detailsObj.longitude, latitude, longitude).toFixed(2)}}km</view>
				</view>
				<view class="card-content">
					<view class="time-img"></view>
					<view class="">{{detailsObj.address}}</view>
				</view>
				<view class="operation-box">
					<view class="operation-child" @click="totalLikeEvent(0)">
						<image class="operation-img" :src="detailsObj.flagLike?'/static/images/already.png':'/static/images/praise.png'"></image>
						<view class="">{{detailsObj.upvoteNum}}</view>
					</view>
					<view class="operation-child" @click="totalLikeEvent(1)">
						<image class="operation-img" :src="detailsObj.flagUnlike?'/static/images/badReview.png':'/static/images/stepOn.png'"></image>
						<view class="">{{detailsObj.downvoteNum}}</view>
					</view>
					<view class="operation-child" @click="sendCallback">
						<image class="operation-img" src="/static/images/comments.png"></image>
						<view class="">{{detailsObj.commentNum}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="switch-box">
			<view class="switch-child" @click="switchEvent(1)">
				<view :class="[switchIndex==1?'switch-title':'switch-no-title']">服务站信息</view>
				<view :class="[switchIndex==1?'switch-select':'switch-no-select']"></view>
			</view>
			<view class="switch-child" @click="switchEvent(2)">
				<view :class="[switchIndex==2?'switch-title':'switch-no-title']">服务站评价</view>
				<view :class="[switchIndex==2?'switch-select':'switch-no-select']"></view>
			</view>
		</view>
		
		<view class="content-box" v-if="switchIndex==1">
			<view class="user-box">
				<view class="">
					<image class="user-img" :src="detailsObj.avatar ? detailsObj.avatar : '../../../static/logo.png'"></image>
				</view>
				<view class="user-name">
					<view class="">{{detailsObj.userName}}（上报人）</view>
					<view class="status-btn" v-if="!detailsObj.businessLicense" @click="serviceCertification">去认证</view>
				</view>
			</view>
			<view class="user-box" v-if="detailsObj.applyVerifiedUser">
				<view class="">
					<image class="user-img" :src="detailsObj.applyVerifiedUserAvatar ? detailsObj.applyVerifiedUserAvatar : '../../../static/logo.png'"></image>
				</view>
				<view class="user-name">{{detailsObj.applyVerifiedUser}}（认证人）</view>
			</view>
			<view class="business-box" v-if="detailsObj.businessLicense">
				<image class="business-img" :src="detailsObj.businessLicense"></image>
				<view class="business-content">
					<view class="business-name">营业执照</view>
					<view class="business-status">证件已认证</view>
				</view>
			</view>
		</view>
		
		<scroll :triggered="triggered" :top-size="heightHead" @refresh="refresh" @restore="restore" @more="more">
			<view style="padding-bottom: 120rpx;">
				<view class="content-box" v-if="switchIndex==2">
					<view class="user-box" v-for="item in commentArr" @tap="toReplyMsg(item)">
						<view class="">
							<image class="user-img" :src="item.avatar ? item.avatar : '../../../static/logo.png'"></image>
						</view>
						<view class="comments-box">
							<view class="comments-name">{{item.userName}}</view>
							<view class="comments-content">{{item.content}}</view>
							<view class="comments-time">
								<view class="">{{item.createdDt}}</view>
								<view class="like-box" @click="commentUpvoteStatus(item)">
									<image class="give-like" :src="item.flagLikeNum>0?'/static/images/already.png':'/static/images/praise.png'"></image>
									<view :class="[item.flagLike?'give-font':'']">{{item.upvoteNum}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="noComments" v-if="commentArr && commentArr.length == 0">快来发表你的评论吧</view>
				</view>
			</view>
		</scroll>
		<!-- 评论输入框 -->
		<uni-comments ref="comments" :commit="commit"  @submit="submit" v-if="commit" @commentsBlur="commentsBlur" ></uni-comments>
		<view class="navigation-box" @click="openLocation(detailsObj)">导航</view>
	</view>
</template>

<script>
	import scroll from "../../../components/scroll1/scroll1.vue"
	import * as utils from "@/utils/service.js";
	var app = getApp();
	var commonHtmlTitle = '服务站详情';
	export default {
		data() {
			return {
				// 轮播图
				movies: [
					{ url: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/banner1.png' },
					{ url: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/banner2.png' },
					{ url: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/banner3.png' }
				],
				switchIndex: 1,
				id: 0,
				detailsObj: {},
				longitude: 0,
				latitude: 0,
				triggered: true,
				_freshing: false,
				pageSize: 10,
				pageNum: 1,
				total: 0, //总条数
				noMore: false, //没有更多了
				heightHead: '',
				commit: false,
				commentArr: [],
				userId: '',
				replyId: '',
			}
		},
		components: {
		  scroll
		},
		onLoad(options){
			this.id = options.id;
			this.longitude = app.globalData.longitude;
			this.latitude = app.globalData.latitude;
			console.log(uni.getStorageSync("userInfo"));
			if(uni.getStorageSync("userInfo")){
				var userInfo = JSON.parse(uni.getStorageSync("userInfo"))
				this.userId = userInfo.userId;
			}
			
			uni.onKeyboardHeightChange(res => {
				console.log(res)
				if (res.height == 0) {
					this.commit = false
				}
			})
		},
		onShow() {
			this.getLocation();
		},
		methods: {
			commentsBlur() {
				this.replyId = '';
				this.$refs.comments.hint = '说点什么吧';
				this.commit = false;
			},
			getLocation(){
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						that.getDetail();
					},
					fail: function(err) {
						console.log(err)
						uni.showToast({
							title: '位置信息获取失败',
							icon: 'none'
						})
					}
				})
			},
			makePhoneCall(res){
				if(res.concatPhone){
					uni.makePhoneCall({
					    phoneNumber: res.concatPhone //仅为示例
					});
				} else{
					uni.showToast({
						title: '暂无联系电话',
						icon: 'none'
					})
				}
			},
			openLocation(res){
				uni.openLocation({
					latitude: res.latitude,	//维度
					longitude: res.longitude, //经度
					name: res.address,	//目的地定位名称
					scale: 15,	//缩放比例
					address: res.address	//导航详细地址
				})
			},
			switchEvent(type){
				this.switchIndex = type
				if(type==2){
					this.providerComment('refresh')
				}
			},
			getDetail(){
				var that = this;
				utils.postRequest('/mu/provider/detail', {
					id: that.id,
					flagUserId: this.userId,
					commonHtmlTitle: commonHtmlTitle
				})
				.then(res=>{
					console.log('服务站详情', res);
					if(res.retCode == "0000000"){
						console.log(res)
						if(res.rspBody.facadeImgs){
							res.rspBody.newFacadeImgs = res.rspBody.facadeImgs.split(",");
						} else{
							res.rspBody.newFacadeImgs = ['/static/images/serviceDefault.png'];
						}
						that.detailsObj = res.rspBody;
						var info1 = uni.createSelectorQuery().select(".switch-box");
						setTimeout(()=>{
							info1.boundingClientRect(function(item) { //data - 各种参数
								// console.log(item)
								that.heightHead = (item.bottom) + 'px';
						　　	}).exec();
						}, 200)
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch((err=>{
					console.log(err)
				}))
			},
			getDistance(lat, lng, selfLatitude, selfLongitude){
				return utils.getDistance(lat, lng, selfLatitude, selfLongitude)
			},
			providerComment(type){
				var that = this;
				var userInfo = '';
				if(uni.getStorageSync("userInfo")){
					userInfo = JSON.parse(uni.getStorageSync("userInfo"));
				}
				var data = {
					providerId: that.id,
					flagUserId: userInfo?userInfo.userId:'',
					pageSize: that.pageSize,
					pageNum: that.pageNum,
					commonHtmlTitle: commonHtmlTitle
				}
				utils.postRequest('/mu/providerComment/list', data)
				.then(res=>{
					console.log('评论列表', res)
					if(res.retCode == "0000000"){
						that.triggered = false;
						that._freshing = false;
						if(type == 'refresh'){
							that.commentArr = res.rspBody.items;
						} else{
							that.commentArr = that.commentArr.concat(res.rspBody.items);
						}
						console.log(that.commentArr);
						that.total = res.rspBody.total;
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			sendCallback() {
				//回复评论
				this.commit = true;
			},
			submit(val) {
				console.log('发送', val, this.detailsObj.id)
				var that = this;
				if (!val) {
					uni.showToast({
						title: '评论不能为空',
						icon: 'none'
					})
					return;
				}
				let postUrl = this.replyId ? '/mu/providerCommentReply/save' : '/mu/providerComment/save';
				let params = this.replyId ? {
					providerId: this.detailsObj.id,
					commentId: this.replyId,
					content: val,
					commonHtmlTitle: commonHtmlTitle
				} : {
					providerId: this.detailsObj.id,
					content: val,
					commonHtmlTitle: commonHtmlTitle
				};
				this.commentsBlur();
				utils.postRequest(postUrl, params)
				.then(res=>{
					if(res.retCode=="0000000"){
						uni.showToast({
							title: this.replyId ? '回复成功' : '评论成功',
							icon: 'none'
						})
						this.getDetail();
						this.switchIndex = 2;
						this.providerComment('refresh');
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			blur() {
				this.commit = false
			},
			giveLikeStatus(type){
				var that = this;
				// uni.showLoading({
				// 	title: '请稍后',
				// 	mask: true
				// })
				console.log(that.id, type);
				utils.postRequest('/mu/providerEva/save', {
					providerId: that.id,
					evaluationType: type,
					commonHtmlTitle: commonHtmlTitle
				})
				.then(res=>{
					uni.hideLoading()
					if(res.retCode=="0000000"){
						console.log(res);
						if(type==1){
							that.detailsObj.flagUnlike = true;
							that.detailsObj.downvoteNum = that.detailsObj.downvoteNum + 1;
						} else{
							that.detailsObj.flagLike = true;
							that.detailsObj.upvoteNum = that.detailsObj.upvoteNum + 1;
						}
						console.log(that.detailsObj);
						that.$forceUpdate()
					} else{
						console.log(res)
						uni.showToast({
							title: res.retDesc,
							icon: none
						})
					}
				})
				.catch(err=>{
				})
			},
			cancelGiveLike(type){
				var that = this;
				// uni.showLoading({
				// 	title: '请稍后',
				// 	mask: true
				// })
				console.log(type, that.id)
				utils.postRequest('/mu/providerEva/cancel', {
					providerId: that.id,
					evaluationType: type,
					commonHtmlTitle: commonHtmlTitle
				})
				.then(res=>{
					// uni.hideLoading()
					if(res.retCode=="0000000"){
						if(type==1){
							that.detailsObj.flagUnlike = false;
							that.detailsObj.downvoteNum = that.detailsObj.downvoteNum - 1;
						} else{
							that.detailsObj.flagLike = false;
							that.detailsObj.upvoteNum = that.detailsObj.upvoteNum - 1;
						}
						that.$forceUpdate()
					} else{
						console.log(res)
						uni.showToast({
							title: res.retDesc,
							icon: none
						})
					}
				})
				.catch(err=>{
					
				})
			},
			totalLikeEvent(type){
				var that = this;
				if(type==0){
					if(!that.detailsObj.flagLike){
						this.giveLikeStatus(0);
					} else{
						this.cancelGiveLike(0);
					}
				} else{
					if(!this.detailsObj.flagUnlike){
						this.giveLikeStatus(1);
					} else{
						this.cancelGiveLike(1);
					}
				}
			},
			commentUpvote(id){
				var that = this;
				// uni.showLoading({
				// 	title: '请稍后',
				// 	mask: true
				// });
				utils.postRequest('/mu/providerCommentUpvote/save', {
					commentId: id,
					commonHtmlTitle: commonHtmlTitle
				})
				.then(res=>{
					uni.hideLoading();
					if(res.retCode == "0000000"){
						that.commentArr.map(val=>{
							if(id == val.id){
								val.flagLikeNum = 1;
								val.upvoteNum = val.upvoteNum + 1;
							}
						})
						// uni.showToast({
						// 	title: '成功',
						// 	icon: 'none'
						// })
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			cancelCommentUpvote(id){
				var that = this;
				// uni.showLoading({
				// 	title: '请稍后',
				// 	mask: true
				// });
				utils.postRequest('/mu/providerCommentUpvote/cancel', {
					commentId: id,
					commonHtmlTitle: commonHtmlTitle
				})
				.then(res=>{
					// uni.hideLoading();
					console.log(res)
					if(res.retCode=="0000000"){
						that.commentArr.map(val=>{
							if(id == val.id){
								val.flagLikeNum = 0;
								val.upvoteNum = val.upvoteNum - 1;
							}
						})
						console.log(that.commentArr);
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			commentUpvoteStatus(item){
				if(item.flagLikeNum>0){
					this.cancelCommentUpvote(item.id)
				} else{
					this.commentUpvote(item.id)
				}
			},
			restore(){
				this.triggered = 'restore';
			},
			refresh(){
				if (this._freshing) return;
				this._freshing = true;
				// console.log('开始刷新')
				this.pageSize = 10;
				this.pageNum = 1;
				this.noMore = false;
				this.providerComment('refresh');
			},
			more(){
				if(this.total == this.commentArr.length){
					this.noMore = true;
					return;
				}
				// console.log('上拉加载');
				this.pageNum = this.pageNum + 1;
				this.providerComment('more');
			},
			serviceCertification(){
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						confirmText: '去登录',
						success: function(res) {
							if (res.confirm) {
								utils.loginSelf()
							}
						}
					})
					return false;
				}
				uni.navigateTo({
					url: "/pages/my/serviceStationCertification/index?id=" + this.detailsObj.id,
				})
			},
			toReplyMsg(item) { //定向回复
				console.log('被回复人', item);
				// let userInfo = uni.getStorageSync("userInfo");
				// if(item.userId == JSON.parse(userInfo).userId) {
				// 	return false;
				// }
				// this.commit = true;
				// setTimeout(()=>{
				// 	this.replyId = item.id;
				// 	this.$refs.comments.hint = '回复' + '@' + item.userName;
				// }, 500)
			}
		}
	}
</script>

<style>
	.swiper {
	    height: 306rpx;
	    width: 100%;
	}
	
	.swiper image {
	    height: 100%;
	    width: 100%;
	}
	.card-box{
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: -40rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
	}
	.card{
		width: 702rpx;
		background: #FFFFFF;
		box-shadow: 0px 4px 8px 0px rgba(192, 192, 192, 0.5);
		border-radius: 5px;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}
	.card-name{
		font-size: 32rpx;
		font-weight: 700;
	}
	.lable-box{
		display: flex;
		flex-wrap: wrap;
		margin: 10rpx 0;
		padding-top: 10rpx;
		justify-content: space-between;
		align-items: center;
	}
	.phone-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #666;
	}
	.phone-img{
		width: 44rpx;
		height: 48rpx;
	}
	.lable-child{
		width: 113rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		border-radius: 8rpx;
		color: #3375F6;
		background-color: #D1E3FC;
	}
	.card-content{
		color: #555;
		display: flex;
		align-items: center;
		padding-bottom: 24rpx;
	}
	.time-img{
		width: 26rpx;
		height: 26rpx;
		margin-right: 15rpx;
	}
	.switch-box{
		display: flex;
		color: #333;
		align-items: center;
		padding: 22rpx 0;
		margin-top: 20rpx;
	}
	.switch-child{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.switch-title{
		width: 168rpx;
		font-size: 30rpx;
		color: #333;
		text-align: center;
		margin-bottom: 10rpx;
		font-weight: bold;
	}
	.switch-no-title{
		width: 168rpx;
		font-size: 30rpx;
		color: #666;
		text-align: center;
		margin-bottom: 10rpx;
	}
	.switch-select{
		width: 168rpx;
		background-color: #0077FF;
		height: 8rpx;
		margin-top: 10rpx;
	}
	.switch-no-select{
		width: 168rpx;
		background-color: #fff;
		height: 8rpx;
		margin-top: 10rpx;
	}
	.content-box{
		margin: 0 46rpx;
		padding-bottom: 150rpx;
	}
	.user-box{
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		padding: 14rpx 0;
	}
	.user-img{
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		margin-right: 10rpx;
	}
	.user-name{
		color: #FF8D02;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.status-btn{
		width: 130rpx;
		height: 50rpx;
		color: #0077FF;
		border: 2rpx solid #0077FF;
		border-radius: 30rpx;
		text-align: center;
		line-height: 50rpx;
		font-size: 30rpx;
	}
	.business-img{
		width: 168rpx;
		height: 104rpx;
	}
	.business-box{
		margin-top: 30rpx;
		display: flex;
	}
	.business-name{
		font-size: 26rpx;
		color: #333;
	}
	.business-status{
		font-size: 24rpx;
		color: #666;
		margin-top: 10rpx;
	}
	.business-content{
		margin-left: 30rpx;
	}
	.goCertification{
		margin-top: 80rpx;
		font-size: 24rpx;
		color: #333;
	}
	.navigation-box{
		position: fixed;
		bottom: 36rpx;
		left: 70rpx;
		right: 70rpx;
		color: #fff;
		background-color: #FF8D02;
		border-radius: 50rpx;
		line-height: 74rpx;
		height: 74rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
	}
	.comments-box{
		width: 100%;
	}
	.comments-name{
		font-size: 20rpx;
		color: #333;
	}
	.comments-content{
		font-size: 24rpx;
		color: #333;
		padding: 7rpx 0;
	}
	.comments-time{
		color: #AAAAAA;
		font-size: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.give-like{
		width: 26rpx;
		height: 26rpx;
	}
	.give-font{
		color: #FF8D02;
	}
	.like-box{
		display: flex;
		align-items: center;
	}
	.operation-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	.operation-child {
		display: flex;
		align-items: center;
		color: #AAAAA0;
		font-size: 24rpx;
		margin-left: 58rpx;
	}
	
	.operation-img {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	.noComments {
		font-size:26rpx;
		color:#AAAAAA;
		text-align: center;
		padding:40rpx 0;
	}
</style>
