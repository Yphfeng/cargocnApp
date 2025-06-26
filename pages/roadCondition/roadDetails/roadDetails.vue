<template>
	<view>
		<view class="head-box">
			<view class="user-box">
				<view class="">
					<image class="user-img" :src="detailInfo.avatar?detailInfo.avatar:'../../../static/logo.png'"></image>
				</view>
				<view class="user-info">
					<view class="">
						<view class="user-name">{{detailInfo.userName}}</view>
						<view class="user-time">{{detailInfo.dateDesc}}</view>
					</view>
				</view>
			</view>
			<view class="">
				<view class="" style="padding: 20rpx 0;">
					<text class="content-box">
						<text class="content-prominent">#<text v-for="(child, index) in detailInfo.labelVOS">{{child.labelName}}{{index!=detailInfo.labelVOS.length-1?',':''}}</text>#</text>
						<text>{{detailInfo.description}}</text>
					</text>
				</view>
				<view class="" v-if="detailInfo.facadeImage">
					<image class="road-img" @tap="showBigImg(detailInfo.facadeImage)" :src="detailInfo.facadeImage"></image>
				</view>
				<view class="address-box">
					<image class="screen-img" src="../../../static/images/address.png" mode="widthFix"></image>
					<view class="">{{detailInfo.address}}</view>
				</view>
			</view>
		</view>
		<view class="evaluation-box">
			<view class="evaluation-head">
				<view class="evaluation-title">
					<view class="evaluation-text">全部评价</view>
					<view class="">{{total}}</view>
				</view>
				<view class="evaluation-title">
					<view class="evaluation-line"></view>
					<view class="evaluation-line1"></view>
				</view>
			</view>
			<!-- <scroll-view class="scroll-box" :top-size="heightHead" style="flex:1;"
			:scroll-y="true"
			refresher-enabled="true"
			:refresher-triggered="triggered"
			:refresher-threshold="150"
			:lower-threshold="50"
			@refresherrefresh="loadRefresh()" @refresherrestore="loadRestore()" @scrolltolower="loadMore()">
				<view class="items-box" v-if="commentArr && commentArr.length > 0" v-for="item in commentArr">
					<view class="">
						<image class="items-img" :src="item.avatar?item.avatar:'../../../static/logo.png'"></image>
					</view>
					<view class="items-all">
						<view class="items-name">{{item.userName}}</view>
						<view class="items-content">{{item.content}}</view>
						<view class="items-time">
							<view class="time-num">{{item.createdDt}}</view>
							<view class="praise-box" @click="situationStatusLike(2, 1, item)">
								<image class="items-praise" :src="item.isLiked==1?'/static/images/already.png':'/static/images/praise.png'"></image>
								<view :class="[item.isLiked==1?'item-num':'item-num1']">{{item.likeNum}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="noComments" v-if="commentArr && commentArr.length == 0">快来发表你的评论吧</view>
			</scroll-view> -->
			<scroll v-show="scrollBoxShow" :triggered="triggered" :top-size="heightHead" :bottom-size="'40px'" @refresh="loadRefresh" @restore="loadRestore" @more="loadMore">
				<view class="items-box" v-if="commentArr && commentArr.length > 0" v-for="item in commentArr">
					<view class="">
						<image class="items-img" :src="item.avatar?item.avatar:'../../../static/logo.png'"></image>
					</view>
					<view class="items-all">
						<view class="items-name">{{item.userName}}</view>
						<view class="items-content">{{item.content}}</view>
						<view class="items-time">
							<view class="time-num">{{item.createdDt}}</view>
							<view class="praise-box" @click="situationStatusLike(2, 1, item)">
								<image class="items-praise" :src="item.isLiked==1?'/static/images/already.png':'/static/images/praise.png'"></image>
								<view :class="[item.isLiked==1?'item-num':'item-num1']">{{item.likeNum}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="noComments" v-if="commentArr && commentArr.length == 0">快来发表你的评论吧</view>
			</scroll>
		</view>
		<view class="operation">
			<view class="operation-child border-line" @click="situationStatusLike(1, 1)">
				<image class="operation-img" :src="detailInfo.isLiked==1?'/static/images/already.png':'/static/images/praise.png'"></image>
				<view class="">{{detailInfo.likeNum}}</view>
			</view>
			<view class="operation-child border-line" @click="situationStatusLike(1, 0)">
				<image class="operation-img" :src="detailInfo.isDisLiked==1?'/static/images/badReview.png':'/static/images/stepOn.png'"></image>
				<view class="">{{detailInfo.dislikeNum}}</view>
			</view>
			<view class="operation-child" @click="sendCallback">
				<image class="operation-img" src="../../../static/images/comments.png"></image>
				<view class="">{{detailInfo.commentNum}}</view>
			</view>
		</view>
		<!-- 评论输入框 -->
		<uni-comments :commit="commit"  @submit="submit" v-if="commit" @commentsBlur="commentsBlur"></uni-comments>
	</view>
</template>

<script>
	import scroll from "../../../components/scroll1/scroll1.vue"
	import * as utils from "@/utils/service.js";
	var commonHtmlTitle = '路况详情';
	export default {
		data() {
			return {
				detailInfo: {},
				commit: false,
				commentArr: [],
				triggered: true,
				_freshing: false,
				heightHead: '',
				pageSize: 10,
				pageNum: 1,
				total: 0, //总条数
				noMore: false, //没有更多了
				scrollBoxShow: false
			}
		},
		components: {
		  scroll
		},
		onLoad(options){
			this.detail(options.id);
			uni.onKeyboardHeightChange(res => {
				console.log(res)
				if (res.height == 0) {
					this.commit = false
					uni.$emit("hideKeyBoard");
				}
				
			})
		},
		methods: {
			commentsBlur() {
				this.commit = false
			},
			detail(id){
				var that = this;
				var userId = ''
				if(uni.getStorageSync("userInfo")){
					var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
					userId = userInfo.userId;
				}
				utils.postRequest('/mu/situation/detail', {
					id: id,
					userId: userId,
					commonHtmlTitle: commonHtmlTitle
				})
				.then(res=>{
					console.log('详情', res);
					if(res.retCode=="0000000"){
						this.detailInfo = res.rspBody;
						console.log(this.detailInfo);
						this.commentList('refresh', res.rspBody.id);
						setTimeout(()=>{
							let info = uni.createSelectorQuery().select(".evaluation-box");
							info.boundingClientRect(function(data) { //data - 各种参数
								that.heightHead = data.top + 65 + 'px';
							}).exec()
						}, 300)
						setTimeout(()=>{
							this.scrollBoxShow = true;
						}, 600)
					} else{
						uni.showToast({
							title: res.retDesc
						})
					}
				})
				.catch(err=>{
					
				})
			},
			showBigImg(image) {
				var imgArr = [];
				imgArr.push(image);
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				});

			},
			commentList(type, id){
				var that = this;
				var userId = ''
				if(uni.getStorageSync("userInfo")){
					var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
					userId = userInfo.userId;
				}
				var data = {
					situationId: id,
					pageSize: that.pageSize,
					pageNum: that.pageNum,
					userId: userId,
					commonHtmlTitle: commonHtmlTitle
				}
				console.log(data)
				utils.postRequest('/mu/situation/comment/list', data)
				.then(res=>{
					that.triggered = false;
					that._freshing = false;
					console.log('下啦刷新状态', that.triggered);
					if(res.retCode=="0000000"){
						if(type == 'refresh'){
							that.commentArr = res.rspBody.items;
						} else{
							that.commentArr = that.commentArr.concat(res.rspBody.items);
						}
						that.total = res.rspBody.total;
						console.log(that.commentArr);
					} else{
						
					}
				})
				.catch(err=>{
					
				})
			},
			sendCallback() {
				//回复评论
				this.commit = true;
			},
			submit(val) {
				console.log('发送', val)
				if (!val) {
					uni.showToast({
						title: '评论不能为空',
						icon: 'none'
					})
					return;
				}
				this.commit = false;
				utils.postRequest('/mu/situation/comment/save', {
					situationId: this.detailInfo.id,
					content: val,
					commonHtmlTitle: commonHtmlTitle
				})
				.then(res=>{
					if(res.retCode=="0000000"){
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						})
						uni.$emit("refreshData_road");
						this.commentList('refresh', this.detailInfo.id);
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
			situationLike(situationtype, type, num, id){
				var that = this;
				var data = {
					type: type,
					status: num,
					flag: situationtype,
					commonHtmlTitle: commonHtmlTitle
				}
				if(situationtype == 1){
					data.situationId = that.detailInfo.id;
				} else{
					data.commentId = id;
				}
				console.log(data)
				utils.postRequest('/mu/situation/like/save', data)
				.then(res=>{
					if(res.retCode == "0000000"){
						//路况操作
						uni.$emit("refreshData_road");
						if(situationtype == 1){
							//点赞操作
							if(type==1 && num==1){
								that.detailInfo.isLiked = 1;
								that.detailInfo.likeNum = that.detailInfo.likeNum + 1;
							} else if(type==1 && num==0){ //取消点赞操作
								that.detailInfo.isLiked = 0;
								that.detailInfo.likeNum = that.detailInfo.likeNum - 1;
							} else if(type==0 && num==1){ //点踩操作
								that.detailInfo.isDisLiked = 1;
								that.detailInfo.dislikeNum = that.detailInfo.dislikeNum + 1;
							} else{
								that.detailInfo.isDisLiked = 0; //取消点踩操作
								that.detailInfo.dislikeNum = that.detailInfo.dislikeNum - 1;
							}
						} else{
							//评论点赞
							if(type==1 && num==1){
								that.commentArr.map(val=>{
									if(val.id == id){
										val.isLiked = 1;
										val.likeNum = val.likeNum + 1
									}
								})
							} else if(type==1 && num==0){//评论取消点赞
								that.commentArr.map(val=>{
									if(val.id == id){
										val.isLiked = 0;
										val.likeNum = val.likeNum - 1
									}
								})
							}
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					
				})
			},
			situationStatusLike(type, status, item){
				var that = this;
				if(!that.detailInfo.id){
					return;
				}
				if(type==1){
					if(status==1 && that.detailInfo.isLiked == 1){
						that.situationLike(type, 1, 0);
					} else if(status==1 && that.detailInfo.isLiked == 0){
						that.situationLike(type, 1, 1);
					} else if(status==0 && that.detailInfo.isDisLiked == 1){
						that.situationLike(type, 0, 0);
					} else{
						that.situationLike(type, 0, 1);
					}
				} else{
					if(status==1&&item.isLiked==1){
						that.situationLike(type, 1, 0, item.id);
					} else{
						that.situationLike(type, 1, 1, item.id);
					}
				}
			},
			blur() {
				this.commit = false
			},
			loadRestore(){
				this.triggered = 'restore';
			},
			loadRefresh(){
				if (this._freshing) return;
				this._freshing = true;
				this.pageSize = 10;
				this.pageNum = 1;
				this.noMore = false;
				this.commentList('refresh', this.detailInfo.id);
			},
			loadMore(){
				if(this.total == this.commentArr.length){
					this.noMore = true;
					return;
				}
				// console.log('上拉加载');
				this.pageNum = this.pageNum + 1;
				this.commentList('more', this.detailInfo.id);
			},
			lower(e) {
			    console.log(e)
			},
		}
	}
</script>

<style>
	.head-box{
		padding: 18rpx 32rpx;
		box-sizing: border-box;
		background-color: #fff;
	}
	.user-box{
		display: flex;
		box-sizing: border-box;
	}
	.user-img{
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
	}
	.user-info{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 20rpx;
		box-sizing: border-box;
	}
	.user-name{
		font-size: 26rpx;
		color: #333;
	}
	.user-time{
		font-size: 22rpx;
		color: #666;
		margin-top: 10rpx;
	}
	.user-status{
		width: 108rpx;
		height: 42rpx;
		font-size: 24rpx;
		color: #0077FF;
		border: 1rpx solid #0077FF;
		text-align: center;
		line-height: 42rpx;
		border-radius: 24rpx;
		box-sizing: border-box;
	}
	.content-prominent{
		color: #0077FF;
	}
	.content-box{
		font-size: 32rpx;
		color: #333;
	}
	.road-img{
		width: 248rpx;
		height: 168rpx;
		margin-bottom: 20rpx;
	}
	.screen-img{
		width: 20rpx;
		margin-right: 10rpx;
	}
	.address-box{
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #666;
	}
	.evaluation-box{
		border-top: 8rpx solid #FBFBFB;
		box-sizing: border-box;
	}
	.evaluation-head{
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin: 0 14rpx;
		padding: 10rpx 0;
	}
	.evaluation-title{
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
	}
	.evaluation-text{
		width: 150rpx;
		text-align: center;
		height: 88rpx;
		line-height: 88rpx;
	}
	.evaluation-line{
		width: 150rpx;
		height: 8rpx;
		background-color: #FF8D02;
	}
	.evaluation-line1{
		width: 150rpx;
		height: 8rpx;
	}
	.items-all{
		width: 100%;
		border-bottom: 1rpx solid #EFEFEF;
		padding-bottom: 15rpx;
	}
	.items-img{
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		margin-right: 20rpx;
	}
	/* .items-box:last-child {
		padding: 18rpx 30rpx 88rpx 30rpx;
	} */
	.items-box{
		padding: 18rpx 30rpx 0 30rpx;
		display: flex;
	}
	.items-praise{
		width: 26rpx;
		height: 26rpx;
	}
	.items-time{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 10rpx;
	}
	.items-name{
		font-size: 22rpx;
		color: #333;
	}
	.items-content{
		font-size: 26rpx;
		padding: 10rpx 0;
	}
	.time-num{
		font-size: 22rpx;
		color: #AAAAAA;
	}
	.item-num{
		font-size: 24rpx;
		margin-left: 15rpx;
		color: #FF8D02;
	}
	.item-num1{
		font-size: 24rpx;
		margin-left: 15rpx;
		color: #666;
	}
	.item-no-num{
		font-size: 24rpx;
		margin-left: 15rpx;
		color: #666;
	}
	.praise-box{
		display: flex;
		align-items: center;
	}
	.operation{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #FBFBFB;
	}
	.operation-child{
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		color: #AAAAA0;
		height: 40rpx;
	}
	.border-line{
		border-right: 1rpx solid #DEDEDE;
	}
	.operation-img{
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
