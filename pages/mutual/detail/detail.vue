<template>
	<view class="container">
		<view class="map">
			<scroll class="content" :triggered="triggered" top-size="10rpx" @refresh="refreshData" @restore="restore" @more="more" bottomSize="144rpx">
				<view class="list listMap">
					
					<!-- <view class="hang tips color-tips font-12" :class="{'active': detail.solveFlag == 1}">
							<view class="tips-text">{{detail.solveFlag == 1 ? '已解决': '未解决'}}</view>
							<view class="tips-line">
								<view class="tips-line-1">
									
								</view>
								<view class="tips-line-2">
									
								</view>
							</view>
					</view> -->
					
					<view class="list-content">
						<view class="list-body">
							<view class="list-title">
								<view class="list-avatar">
									<image :src="detail.avatar" class="avatar" v-if="detail.avatar"></image>
									<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/track.png" class="avatar" v-else></image>
									<view class="avatar-text">
										<view class="avatar-title-text">
											<text>{{detail.userName ? detail.userName : '匿名用户'}}</text>
											<view class="avatar-titleFlag" :style="showStatus(detail.solveFlag, 'color')">{{showStatus(detail.solveFlag, 'msg')}}</view>
										</view>
										<view class="hour">
											<view class="subDate"><text class="pr-20 color-tips">{{detail.dateDesc}}</text></view>
											<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/address.png" class="address-icon" mode="widthFix"></image>
											<view class="subAddress">
												<text class="address">距离{{getDistance(detail.latitude, detail.longitude).toFixed(1)}}km</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<text class="list-mid-text">
								<text class="font-13 color-paragraph">#{{detail.typeName}}#</text>
								<text class="font-13">{{detail.description}}</text>
							</text>
						</view>
					</view>
					<view class="list-img" v-if="detail.facadeImage">
						<image :src="detail.facadeImage" class="img" @click="previewImage"></image>
					</view>
				
					<view class="list-bottom">
						<view class="font-12 color-paragraph" style="display: flex; align-items: center; color: #777;">
							<image src="../../../static/images/address.png" class="location-icon" mode=""></image>
							{{detail.address}}
						</view>
					</view>
				</view>
				<view class="comment">
					<view class="title">
						<view class="title-text">
							全部评价
						</view>
						<text class="pl-20">{{total}}</text>
					</view>
					<view class="list-comment">
						<view class="list-item" v-for="(item, index) in firstComment" :key="index">
							<view class="list-main">
								<image :src="item.avatar" class="avatar" v-if="item.avatar"></image>
								<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/track.png" class="avatar" v-else></image>
								<view class="list-content">
									<text class="font-10 user-name">{{item.userName ? item.userName : '匿名用户'}}</text>
									<text class="font-12">{{item.content}}</text>
								</view>
							</view>
							<view class="sub-comments">
								<text class="font-9 time">{{item.createdDt}}</text>
								<view class="iconDZ-content yes" @click="zan(index)" v-if="item.commentUpvoteFlag !== 0">
									<image src="../../../static/images/already.png" class="already-iconDZ"></image><text class="font-12">{{item.upvoteNum}}</text>
								</view>
								<view class="iconDZ-content no" @click="zan(index)" v-else>
									<image src="../../../static/images/praise.png" class="already-iconDZ"></image><text class="font-12">{{item.upvoteNum}}</text>
								</view>
							</view>
						</view>
						<view class="more-Box" v-if="noMore">没有更多了～</view>
						<view class="noComments" v-if="firstComment && firstComment.length == 0">快来发表你的评论吧</view>
					</view>
				</view>
			</scroll>
		</view>
		
		<view class="bottom">
			<view class="send" @click="sendCallback">
				我来回复
			</view>
			<view class="call" @click="call">
				<image src="../../../static/images/tel.png" class="contact"></image>
				<text class="call-text">联系TA</text>
			</view>
		</view>
		<!-- 评论输入框 -->
		<uni-comments :commit="commit"  @submit="submit" v-if="commit"></uni-comments>
	</view>
	
</template>

<script>
	import {postRequest, getDistance} from "../../../utils/service.js"
	import scroll from "@/components/scroll1/scroll1.vue"; 
	var commonHtmlTitle = '互助详情';
	export default {
		components: {
			scroll
		},
		data() {
			return {
				latitude: 0,
				longitude: 0,
				commit: false,
				triggered: true,
				_freshing: false,
				
				firstComment: [],
				avatarList: [],
				detail: {},
				total: 0,
				noMore: false,
				params: {
					pageNum: 1,
					pageSize: 15,
					paramsId: '',
					userId: '',
					commonHtmlTitle: commonHtmlTitle,
				}
				
			}
		},
		onPullDownRefresh() {
			console.log('下拉111')
			setTimeout(function(){
				uni.stopPullDownRefresh();
			}, 3000);
		},
		onLoad(options) {
			var id = options.id;
			this.params.paramsId = id;
			this.params.pageNum = 1;
			this.longitude = options.longitude;
			this.latitude = options.latitude;
			var userInfo = uni.getStorageSync("userInfo");
			console.log(userInfo, '用户信息')
			if (userInfo) {
				this.params.userId = JSON.parse(userInfo).userId
			}
			uni.onKeyboardHeightChange(res => {
				console.log(res)
				if (res.height == 0) {
					this.commit = false
				}
			})
			this.query(id);
			this.queryComments(id);
			//监听键盘关闭事件
			
		},
		methods: {
			getDistance(lat, lng){
				return getDistance(lat, lng, this.latitude, this.longitude)
			},
			previewImage() {
				//预览图片
				var detail = this.detail; //获取当前页面的轮播图数据
				//uniapp预览轮播图
				var imgs = [];
				imgs.push(detail.facadeImage);
				uni.previewImage({
					current:0, //预览图片的下标
					urls: imgs//预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			refreshData() {
				//刷新列表
				this.params.pageNum = 1;
				this.refresh('refresh');
				this.query(this.params.paramsId);
			},
			refresh(flag) {
				//获取评论列表
				if (this._freshing) return;
				this._freshing = true;
				console.log(this.params, '评论的参数')
				postRequest('/mu/helpcomment/list', this.params)
				.then(res => {
					this.triggered = false;
					this._freshing = false;
					if (flag == "refresh") {
						this.firstComment = res.rspBody.items;
						this.noMore = true
					} else {
						this.firstComment = this.firstComment.concat(res.rspBody.items);
						this.noMore = this.params.pageSize > res.rspBody.items.length
						
					}
					console.log(res, '评论列表')
					
				})
				.catch(err => {
					this.triggered = false;
					this._freshing = false;
				})
			},
			restore(){
				console.log('asd')
				this.triggered = 'restore';
			},
			
			query(id) {
				postRequest("/mu/help/detail",{id: id, longitude: this.longitude, latitude: this.latitude, commonHtmlTitle: commonHtmlTitle})
				.then(res => {
					console.log(res, '详情111')
					if (res.retCode == "0000000") {
						this.detail = res.rspBody
					}
				})
				.catch(err => {
					console.log(err)
				})
			},
			queryComments(id) {
				//获取评论列表
				this.params.helpId = id;
				postRequest('/mu/helpcomment/list', this.params)
				.then(res => {
					console.log(res, '评论列表')
					this.total = res.rspBody.total;
					this.firstComment = res.rspBody.items;
				})
				.catch(err => {
					
				})
			},
			pub() {
				uni.navigateTo({
					url:"../publish/index"
				})
			},
			goDetail() {
				//去互助详情
				console.log('互助详情1')
				uni.navigateTo({
					url: "../detail/detail"
				})
			},
			onSelected(res){
				uni.showToast({
					icon:'none',
					title:'控制台查看筛选结果'
				})
			},
			dateChange(d){
			   uni.showToast({
				   icon:'none',
				   title:d
			   })
			},
			zan(index) {
				//点赞
				var _this = this;
				var firstComment = this.firstComment;
				console.log(index, firstComment)
				var commentUpvoteFlag = firstComment[index].commentUpvoteFlag;
				if (commentUpvoteFlag !== 0) {
					//取消点赞
					postRequest("/mu/helpcommentupvote/cancel", {
						commentId: firstComment[index].id,
						commonHtmlTitle: commonHtmlTitle,
					}).then(res => {
						if (res.retCode == "0000000") {
						
							firstComment[index].commentUpvoteFlag = 0;
							firstComment[index].upvoteNum = firstComment[index].upvoteNum - 1;
							_this.firstComment = firstComment;
							
						} else {
							uni.showToast({
								title: res.retDesc
							})
						}
					}).catch(err => {
						console.log(err)
					})
				} else {
					console.log('点赞111111111')
					//点赞
					postRequest("/mu/helpcommentupvote/save", {
						commentId: firstComment[index].id,
						commonHtmlTitle: commonHtmlTitle,
					}).then(res => {
						console.log(res, '点赞成功')
						if (res.retCode == "0000000") {
						
							firstComment[index].commentUpvoteFlag = 1;
							firstComment[index].upvoteNum = firstComment[index].upvoteNum + 1;
							_this.firstComment = firstComment;
							
						} else {
							uni.showToast({
								title: res.retDesc
							})
						}
					}).catch(err => {
						console.log(err)
					})
				}
			},
			sendCallback() {
				//回复评论
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showToast({
						title: '请登录后评论',
						icon: 'none'
					})
				}
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
				var _this = this;
				this.commit = false;
				uni.showLoading();
				postRequest('/mu/helpcomment/save', {
					helpId: _this.detail.id,
					content: val,
					commonHtmlTitle: commonHtmlTitle,
				}).then(res => {
					uni.hideLoading();
					if (res.retCode == '0000000') {
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						})
						uni.$emit("refreshData_mutual");
						this.commit = false;
						//评论后刷新评论
						_this.queryComments(_this.params.paramsId);
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				}).catch(err => {
					uni.hideLoading();
				})
			},
			more(){
				//评论更多
			if(this.noMore){
					return;
				}
				// console.log('上拉加载');
				this.params.pageNum = this.params.pageNum + 1;
				this.refresh('more');
			},
			call() {
				if (this.detail) {
					uni.makePhoneCall({
					 	
					 	// 手机号
					    phoneNumber: this.detail.mobile, 
					
						// 成功回调
						success: (res) => {
							console.log('调用成功!')	
						},
					
						// 失败回调
						fail: (res) => {
							console.log('调用失败!')
						}
						
					 });
				}
				
			},
			
			showStatus(status, flag) {
				switch(status) {
					case 0:
						return flag == 'color' ? 'background-color:rgba(119, 119, 119, 0.2);color:#777777;' : '已关闭';
					case 1:
						return flag == 'color' ? 'background-color:rgba(0, 119, 255, 0.2);color:#0077FF;' : '已解决';
					case 2:
						return  flag == 'color' ? 'background-color:rgba(224, 32, 32, 0.2);color:#E02020;' : '未解决';
				}
			},
			
		}
	}
</script>

<style lang="scss">
	.listMap {
		padding: 20rpx 30rpx;
		position: relative;
	}
	.list {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 100%;
	}
	.list-img {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		margin-bottom: 10px;
		margin-top: 20rpx;
		.img {
			width: 124px;
			height: 84px;
		}
	}
	.list-item {
		padding-top: 14rpx;
	}
	.list-content {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: center;
		
		.list-body {
			flex: 1;
			.list-title {
				display: flex;
				flex-direction: row;
				margin-bottom: 10px;
				.list-avatar {
					display: flex;
					flex-direction: row;
					.avatar {
						margin-right: 10px;
					}
					.avatar-text {
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						.avatar-title-text {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							font-size: 26rpx;
							.avatar-titleFlag {
									margin-left:40rpx;
									height: 42rpx;
									width:100rpx;
									border-radius: 8rpx;
									line-height: 42rpx;
									font-size:26rpx;
									text-align: center;
									color:#fff;
							}
						}
						.hour {
							display: flex;
							flex-direction: row;
							align-items: center;
							font-size: 22rpx;
							.address {
								color: #0077FF;
							}
						}
					}
				}
			}
			.list-mid-text {
				display: flex;
				flex-wrap: wrap;
			}
		}
	}
	.list-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 10px;
	}
	.comment {
		.title {
			height: 80rpx;
			line-height: 80rpx;
			margin-bottom: 20rpx;
			padding: 0 30rpx;
			color: rgba(51, 51, 51, 1);
			font-size: 28rpx;
			.title-text {
				border-bottom: 3px solid rgba(255, 141, 2, 1);
				display: inline-block;
				padding: 10px 0;
			}
		}
		.sub-comments {
			display: flex;
			flex-direction: row;
			margin-left: 100rpx;
			padding-right: 30rpx;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid rgba(239, 239, 239, 1);
			padding-bottom: 5px;
			margin-top: 10rpx;
			.time {
				color: #AAAAAA;
			}
		}
	}
	.list-main {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0 30rpx;
		.avatar {
			width: 30px;
			height: 30px;
		}
		.list-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			margin-left: 20rpx;
		}
	}
	.bottom {
		height: 144rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		.send {
			flex: 1;
			display: flex;
			background-color: rgba(255, 141, 2, 1);
			height: 64rpx;
			margin: 0 32rpx;
			border-radius: 32rpx;
			justify-content: center;
			align-items: center;
			color: #fff;
		}
		.call {
			margin-right: 44rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.call-text {
				color: #777777;
				font-size: 24rpx;
				font-weight: bold;
			}
		}
	}
	.address-icon {
		width: 20rpx;
		height: 10px;
	}
	.location-icon {
		width: 13px;
		height: 16px;
		margin-right: 5px;
	}
	.user-name {
		padding-bottom: 12rpx;
	}
	.hang {
		position: absolute;
		top: 0;
		right: 40rpx;
	}
	.tips {
		height: 56rpx;
		width: 88rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.tips-text {
			height: 18px;
			background-color: red;
			width: 44px;
			color: #fff;
			text-align: center;
			line-height: 18px;
		}
		&.active {
			.tips-text {
				color: rgba(112, 112, 112, 1);
				background-color: #ccc;
			}
			.tips-line-1 {
				 
				border-top: 11px solid #ccc; 
				border-right: 22px solid transparent; 
			}
			.tips-line-2 {
				
				border-top: 11px solid #ccc; 
				border-left: 22px solid transparent; 
			}
		}
		.tips-line {
			display: flex;
			flex-direction: row;
		}
		.tips-line-1 {
			flex: 1;
			width: 0;
			height: 0; 
			border-top: 11px solid red; 
			border-right: 22px solid transparent; 
		}
		.tips-line-2 {
			flex: 1;
			width: 0;
			height: 0; 
			border-top: 11px solid red; 
			border-left: 22px solid transparent; 
			
		}
	}
	.iconDZ-content {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		&.no {
			color: rgba(170, 170, 170, 1)
		}
		&.yes {
			color: #FF8D02;
		}
	}
	.already-iconDZ {
		width: 26rpx;
		height: 26rpx;
		margin-right: 20rpx;
	}
	.iconDZ {
		width: 24rpx;
		height: 24rpx;
		margin-right: 20rpx;
	}
	.contact {
		width: 44rpx;
		height: 48rpx;
	}
	.more-Box{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
	}
	.subDate {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 150rpx;
		word-break: break-all;
		white-space: nowrap;
	}
	.subAddress {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 200rpx;
		white-space: nowrap;
	}
	.noComments {
		font-size:26rpx;
		color:#AAAAAA;
		text-align: center;
		padding:40rpx 0;
	}
</style>
