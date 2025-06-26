<template>
	<view class="newRoadDetails" :style="{overflow: commitInputShow ? 'hidden' : 'auto', 'padding-top': (statusBarHeight + 35) + 'px'}">
		<view class="newHeader">
			<view :style="{height: statusBarHeight + 'px'}"></view>
			<view class="headBox">
				<!-- <i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777; font-size: 27px;"></i> -->
				<image class="uniIcon" @tap="backToFromPage()" src="../../../static/images/back.png"></image>
				路况详情
				<view class="headRight" v-if="detailsObj.userId == userId && detailsObj.examStatus == 0" @click="editRoad">
					<image src="../../../static/images/edit_title_right.png" class="memberMoreIcon"></image>
				</view>
			</view>
		</view>
		<view class="serviceStationBox">
			<view class="mainCommentsBox">
				<view class="mainCommentsAvatar">
					<image class="mainAvatar" :src="detailsObj.avatar ? detailsObj.avatar : '../../../static/logo.png'"></image>
				</view>
				<view class="mainCommentsMsg">
					<view class="mainCommentsName">{{detailsObj.userName}}</view>
					<view class="mainCommentsTime">{{detailsObj.dateDesc}}</view>
				</view>
				<view class="solveBox guoqi" v-if="isGuoqi">
					<text  class="headSubText">已过期</text>
					
				</view>
			</view>
			
			<view class="mainCommentsContent">
				<text class="topic">#{{detailsObj.typeName}}#</text>
				{{detailsObj.description}}
			</view>
			<scroll-view class="scrollBox" scroll-x="true">
				<view class="scrollImg" v-for="(item, scrollImgKey) in detailsObj.facadeImgsItem" :key="scrollImgKey">
					<image class="facadeImgs" :src="item" @tap="showBixImages(item)"></image>
				</view>
			</scroll-view>
			<view class="commentsLocation">
				<image class="loacationIcon" src="../../../static/images/address.png"></image>
				{{detailsObj.address}}
			</view>
		</view>
		<!-- ============评价============ -->
		<view class="commentsBox">
			<view class="commentsChangeHead">
				<!-- <view class="changeBtn">评价</view> -->
			</view>
			<view class="commentsTransition">
				<view class="commentsTitle" style="margin-top:10rpx;" v-if="myCommentList">我的评价</view>
				<view class="commentsDetails" v-if="myCommentList">
					<view class="commentsAvatar">
						<image class="avatar" :src="myCommentList.avatar ? myCommentList.avatar : '../../../static/logo.png'"></image>
					</view>
					<view class="detailsBox">
						<view class="commentsNameBox">
							<view class="name" @click="toCommit(myCommentList)">{{myCommentList.userName}}</view>
							<view class="likeNum" @tap="commentslike(myCommentList, 2, 'my')">
								<image class="likeImg" :src="myCommentList.isLiked == 1 ? '../../../static/images/detailsalready.png' : '../../../static/images/detailspraise.png'"></image>
								{{myCommentList.likeNum}}
							</view>
						</view>
						<view class="commentsDate">{{timeFn(myCommentList.createdDt)}}</view>
						<view class="commentsMsg">{{myCommentList.content}}<!-- <text class="topic">#好好好#</text> --></view>
						<view class="commentImgBox">
							<view class="commentModeBox" v-for="(item, imgKey) in myCommentList.facadeImageItem" :key="imgKey" v-if="imgKey != '3'" @tap="showBixImages(item)">
								<image class="commentImg" :src="item" mode="heightFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="commentsTitle" style="margin-top:30rpx;">所有评价（{{detailsObj.commentNum}}）</view>
				<view class="noComments" v-if="commentList && commentList.length == 0">快来发表你的评论吧</view>
				<view class="commentsDetails" v-for="(item, detailsKey) in commentList" :key="detailsKey">
					<view class="commentsAvatar">
						<image class="avatar" :src="item.avatar ? item.avatar : '../../../static/logo.png'"></image>
					</view>
					<view class="detailsBox">
						<view class="commentsNameBox">
							<view class="name" @click="toCommit(item)">{{item.userName}}</view>
							<view class="likeNum" @tap="commentslike(item, 2, 'first')">
								<image class="likeImg" :src="item.isLiked == 1 ? '../../../static/images/detailsalready.png' : '../../../static/images/detailspraise.png'"></image>
								{{item.likeNum}}
							</view>
						</view>
						<view class="commentsDate">{{timeFn(item.createdDt)}}</view>
						<view class="commentsMsg" @click="toCommit(item)">{{item.content}}<!-- <text class="topic">#好好好#</text> --></view>
						<view class="commentImgBox">
							<view class="commentModeBox" v-for="(imgItem, imgKey) in item.facadeImageItem" :key="imgKey" v-if="imgKey != '3'" @tap="showBixImages(imgItem)">
								<image class="commentImg" :src="imgItem" mode="heightFix"></image>
							</view>
						</view>
						<view class="commentReplyBox" v-for="(replyList, replyKey) in item.replyItem" :key="replyKey">
							<view class="commentReply">
								<view class="replyAvatarBox">
									<image class="replyAvatar" :src="replyList.fromUserAvatar ? replyList.fromUserAvatar : '../../../static/logo.png'"></image>
								</view>
								<view class="replyDetails">
									<view class="commentsNameBox">
										<view class="replyName"  @click="toCommit(item, replyList)">{{replyList.fromUserName}}</view>
										<view class="likeNum" @tap="commentslike(replyList, 3, 'second')">
											<image class="likeImg" :src="replyList.isLiked == 1 ? '../../../static/images/detailsalready.png' : '../../../static/images/detailspraise.png'"></image>
											{{replyList.likeNum}}
										</view>
									</view>
									<view class="replyDate">{{timeFn(replyList.createdDt)}}</view>
									<view class="commentsMsg"  @click="toCommit(item, replyList)">
										<text class="replyTitle" v-if="replyList.toUserId">回复 </text>
										<text class="replyUser" v-if="replyList.toUserId">@{{replyList.toUserName}}</text>
										<text class="replyTitle" v-if="replyList.toUserId">：</text>
										{{replyList.content}}
										<!-- <text class="topic">#好好好#</text> -->
									</view>
								</view>
							</view>
						</view>
						<view class="showReplyList" @tap="showSubComments(item, detailsKey)" v-show="item.commentNum > 0 && item.showMoreSubComment">
							{{!item.showSubComment ? '—— 展开' + item.commentNum + '条回复 ——' : '—— 查看更多回复 ——'}}
						</view>
					</view>
				</view>
				<view style="height:160rpx;">
					<view class="loading-more" v-if="isLoad">
						<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
						<text class="loading-more-text">加载中...</text>
					</view>
					<view class="loading-more" v-if="noData && commentList.length != 0">
						<text class="loading-more-text">没有更多数据了</text>
					</view>
				</view>
			</view>
		</view>
		<view class="commentsFoot" :style="safeAreaHeight > 0 ? 'padding-bottom:60rpx;' : 'padding-bottom:22rpx;'">
			<view class="footBtn" @tap="likeChange(1)">
				<image class="footImg" :src="detailsObj.isLiked == 1 ? '../../../static/images/detailsalready.png' : '../../../static/images/detailspraise.png'"></image>
				{{detailsObj.likeNum}}
			</view>
			<view class="line"></view>
			<view class="footBtn" @tap="likeChange(2)">
				<image class="footImg" :src="detailsObj.isDisLiked == 1 ? '../../../static/images/detailsbadReview.png' : '../../../static/images/detailsstepOn.png'"></image>
				{{detailsObj.dislikeNum}}
			</view>
			<view class="line"></view>
			<view class="footBtn" @tap="jumpToReply()">
				<image class="footImg" src="../../../static/images/detailscomments.png"></image>
				评价
			</view>
		</view>
		<view class="myMask" v-if="commitInputShow" @touchmove.stop.prevent="moveHandle">
			<uni-comments ref="comments" :commit="commitFocus"  @submit="submit" v-if="commitInputShow" :hint="hint"></uni-comments>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	export default {
		data() {
			return {
				isGuoqi: false,
				statusBarHeight: 0,
				userId: '',
				serviceId: '',
				userInfo: '',
				longitude: '',
				latitude: '',
				detailsObj: {},
				isLoad: false,
				noData: false,
				commitInputShow: false,
				commitFocus: false,
				pageSize: 20,
				pageNum: 1,
				commentList: [],
				commentKey: '',
				myCommentList: '',
				hint: '',
				replyItem: {},
				commitReplyItem: {},
				repeatReply: false,
				safeAreaHeight: 0
			};
		},
		onLoad(options) {
			
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight;
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				this.userId = JSON.parse(userInfo).userId;
			}
			if(options.id) {
				this.serviceId = options.id;
				this.longitude = getApp().globalData.longitude;
				this.latitude = getApp().globalData.latitude;
				this.userInfo = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : '';
				this.getDetail();
				this.getMyCommentList();
				this.getCommentList();
			}else {
				uni.switchTab({
				    url: '/pages/roadCondition/index/newIndex'
				});
			}
			// this.timeFn('2021-05-08 18:06:14');
			uni.$on('refreshApi', (data) => {
				this.getDetail();
				this.getMyCommentList();
				this.getCommentList();
			})
			// console.log('设备信息', uni.getSystemInfoSync());
			let obj = uni.getSystemInfoSync();
			this.safeAreaHeight = obj.safeAreaInsets.bottom;
		},
		onShow() {
			let that = this;
			uni.onKeyboardHeightChange(res => {
				if (res.height == 0) {
					that.commitInputShow = false;
					that.commitFocus = false;
					// that.commentsBlur();
					// uni.hideKeyboard();
				}
			})
		},
		onReady() {},
		onPullDownRefresh() { // 下拉刷新
			console.log('refresh');
			this.noData = false;
			this.pageNum = 1;
			this.getDetail();
			this.getMyCommentList();
			this.getCommentList();
		},
		onReachBottom() { // 上拉加载
			this.lisOnLoad();
		},
		methods: {
			getDetail(){ // 获取主体详情
				var that = this;
				
				utils.postRequest('/mu/situation/detail', {
					id: that.serviceId,
				})
				.then(res=>{
					console.log('详情', res);
					if(res.retCode=="0000000"){
						that.detailsObj = res.rspBody;
						that.detailsObj.facadeImgsItem = [];
						if(that.detailsObj.facadeImage) {
							that.detailsObj.facadeImgsItem = that.detailsObj.facadeImage.split(',');
						}
						var setDate = new Date(res.rspBody.deadDt).getTime();
						var now = new Date().getTime();
						that.isGuoqi = setDate - now < 0;
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
			getMyCommentList() { // 我的评论
				let that = this;
				if(!that.userInfo) {
					return false;
				}
				utils.postRequest('/mu/situation/comment/list', {
					situationId: that.serviceId,
					isMyComment: 1,
					pageSize: 1,
					pageNum: 1,
				})
				.then(res=>{
					console.log('我的评论列表详情', res);
					if(res.retCode=="0000000"){
						that.myCommentList = res.rspBody.items[0];
						that.myCommentList.replyItem = [];
						that.myCommentList.facadeImageItem = [];
						if(that.myCommentList.facadeImage) {
							that.myCommentList.facadeImageItem = that.myCommentList.facadeImage.split(',');
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
			getCommentList(type) { // 评论列表
				var that = this;
				utils.postRequest('/mu/situation/comment/list', {
					situationId: that.serviceId,
					pageSize: that.pageSize,
					pageNum: that.pageNum,
				})
				.then(res=>{
					console.log('评论列表详情', res);
					if(res.retCode=="0000000"){
						let ary = res.rspBody.items;
						let total = res.rspBody.total;
						for(let i in ary) {
							ary[i].replyItem = [];
							ary[i].facadeImageItem = [];
							ary[i].showSubComment = false;
							ary[i].showMoreSubComment = true;
							ary[i].subCommentPage = 0;
							if(ary[i].facadeImage) {
								ary[i].facadeImageItem = ary[i].facadeImage.split(',');
							}
							if(type == 'onLoad') {
								that.commentList.push(ary[i])
							}
						}
						if(!type) {
							that.commentList = ary;
						}
						if(total == that.commentList.length) {
							that.noData = true;
						}
						that.isLoad = false;
						uni.hideLoading();
					} else{
						that.isLoad = false;
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					
				})
				uni.stopPullDownRefresh();
			},
			lisOnLoad() { // 加载
				if(this.noData || this.isLoad) {
					return false;
				}
				console.log('上拉加载');
				this.isLoad = true;
				this.pageNum++;
				this.getCommentList('onLoad');
			},
			showSubComments(item, key) { // 查看更多2级回复
				var that = this;
				console.log('操作前的对象', that.commentList[key]);
				that.commentList[key].showSubComment = true;
				that.commentList[key].subCommentPage++;
				let params = {
					commentId: item.id,
					pageSize: 20,
					pageNum: that.commentList[key].subCommentPage,
				};
				console.log('2级回复查询参数', params);
				utils.postRequest('/mu/situation/comment/reply/list', params)
				.then(res=>{
					console.log('查看更多2级回复', res);
					if(res.retCode == "0000000"){
						let total = res.rspBody.total;
						let ary = res.rspBody.items;
						if(total != 20) {
							that.commentList[key].showMoreSubComment = false;
						}
						for(let i in ary) {
							if( that.commentList[key].replyItem &&  that.commentList[key].replyItem.length > 0) {
								for(let a in that.commentList[key].replyItem) {
									if(that.commentList[key].replyItem[a].id == ary[i].id) {
										ary.splice(i, 1)
									}
								}
							}
							ary[i].facadeImageItem = [];
							if(ary[i].facadeImage) {
								ary[i].facadeImageItem = ary[i].facadeImage.split(',');
							}
							that.commentList[key].replyItem.push(ary[i]);
						}
						that.$forceUpdate();
						console.log('操作后的对象', that.commentList[key]);
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
			submit(val) { // 发表评论
				console.log('发送', val)
				var that = this;
				if (!val) {
					uni.showToast({
						title: '评论不能为空',
						icon: 'none'
					})
					return false;
				}
				let params = {
					commentId: that.replyItem.id,
					fromUserId: that.userInfo.userId,
					toUserId: that.commitReplyItem ? that.commitReplyItem.fromUserId : null,
					content: val
				};
				console.log('回复提交参数', params);
				utils.postRequest('/mu/situation/comment/reply/save', params)
				.then(res=>{
					console.log('回复', res);
					if(res.retCode=="0000000"){
						uni.showToast({
							title: '回复成功',
							icon: 'none'
						})
						for(let i in that.commentList) {
							if(that.commentList[i].id == that.replyItem.id) {
								var myDate = new Date();
								var year = myDate.getFullYear();
								var month = (myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
								var day = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate();
								var yearVal = year + '-' + month + '-' + day;
								var hours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();
								var minutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes();
								var seconds = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();
								var dayVal = hours + ':' + minutes + ':' + seconds;
								let obj = {
									"id": res.rspBody,
									"commentId": that.replyItem.id,
									// "createdDt": '刚刚',
									"createdDt": yearVal + ' ' + dayVal,
									"fromUserId": that.userInfo.userId,
									"fromUserName": that.userInfo.userName,
									"fromUserAvatar": that.userInfo.attrs.avatar,
									"toUserId": that.commitReplyItem.fromUserId ? that.commitReplyItem.fromUserId : '',
									"toUserName": that.commitReplyItem.fromUserName ? that.commitReplyItem.fromUserName : '',
									"content": val,
									"likeNum": 0,
									"isLiked": 0,
								}
								that.commentList[i].replyItem.unshift(obj);
								// if(that.commentList[i].showSubComment) {
									
								// }else {
								// 	that.commentList[i].commentNum++;
								// }
							}
						}
						console.log('我回复后的2级评论', that.commentList);
						that.$forceUpdate();
						that.commentsBlur();
					} else{
						that.commentsBlur();
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
			likeChange(flag) { // 主体(点赞/取消点赞 || 倒踩/取消倒赞)  通用函数
				let that = this;
				if(!that.userInfo) {
					uni.showToast({
						title: '请登录后再进行操作！',
						icon: 'none'
					})
					return false;
				}
				var apiFlag = 1;
				var apiType = '';
				var apiStatus = '';
				switch(flag) {
					case 1:
						if(that.detailsObj.isDisLiked == 1) {
							uni.showToast({
								title: '请取消倒赞后再进行操作！',
								icon: 'none'
							})
							return false;
						}
						apiType = 1;
						apiStatus = that.detailsObj.isLiked == 1 ? 0 : 1;
						break;
					case 2:
						if(that.detailsObj.isLiked == 1) {
							uni.showToast({
								title: '请取消点赞后再进行操作！',
								icon: 'none'
							})
							return false;
						}
						apiType = 0;
						apiStatus = that.detailsObj.isDisLiked == 1 ? 0 : 1;
						break;
				}
				utils.postRequest('/mu/situation/like/save', {
					situationId: that.serviceId,
					commentId: that.userInfo.userId,
					flag: apiFlag,
					type: apiType,
					status: apiStatus
				})
				.then(res=>{
					console.log('详情', res);
					if(res.retCode=="0000000"){
						// uni.showToast({
						// 	title: '操作成功',
						// })
						that.getDetail();
					} else{
						uni.showToast({
							title: res.retDesc ? res.retDesc : '货运同学开小差啦，请稍后再试~',
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('点赞报错', err);
				})
			},
			commentslike(item, flag, type) { // 列表--点赞/取消点赞
				let that = this;
				if(!this.userInfo) {
					uni.showToast({
						title: '请登录后再进行操作！',
						icon: 'none'
					})
					return false;
				}
				var apiFlag = flag;
				var apiType = 1;
				var apiStatus = item.isLiked == 1 ? 0 : 1;
				let params = {
					situationId: that.serviceId,
					commentId: type != 'second' ? item.id : null,
					commentReplyId: type == 'second' ? item.id : null,
					flag: apiFlag,
					type: apiType,
					status: apiStatus
				};
				console.log('点赞前参数', item);
				utils.postRequest('/mu/situation/like/save', params)
				.then(res=>{
					if(res.retCode=="0000000"){
						// uni.showToast({
						// 	title: '操作成功',
						// })
						// 根据是否点赞的字段直接操作数组
						item.isLiked = item.isLiked == 1 ? 0 : 1;
						item.likeNum = item.isLiked == 1 ? item.likeNum + 1 : item.likeNum - 1;
						if(type == 'my') {
							for(let i in that.commentList) {
								if(item.id == that.commentList[i].id) {
									that.commentList[i].isLiked = item.isLiked;
									that.commentList[i].likeNum = item.isLiked == 1 ? that.commentList[i].likeNum + 1 : that.commentList[i].likeNum - 1;
								}
							}
						}
						
						if(type == 'first') {
							if(item.id == that.myCommentList.id) {
								that.myCommentList.isLiked = item.isLiked;
								that.myCommentList.likeNum = item.isLiked ? that.myCommentList.likeNum + 1 : that.myCommentList.likeNum - 1;
							}
						}
						console.log('点赞后的参数', item);
						that.$forceUpdate();
					} else{
						that.$forceUpdate();
						uni.showToast({
							title: res.retDesc ? res.retDesc : '货运同学开小差啦，请稍后再试~',
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('点赞报错', err);
				})
			},
			commentsBlur() {
				this.replyItem = {};
				this.commitReplyItem = {};
				this.commitInputShow = false;
				this.commitFocus = false;
				this.$forceUpdate();
			},
			toCommit(item, commitReplyItem) { // 去回复
				if(!this.userInfo) {
					return false;
				}
				if(this.repeatReply == true) { // 防止重复点击唤起软键盘
					return false;
				}
				console.log('开始回复');
				this.repeatReply = true;
				this.hint = commitReplyItem ? '回复@' + commitReplyItem.fromUserName : '回复@' + item.userName;
				this.replyItem = item;
				this.commitReplyItem = commitReplyItem ? commitReplyItem : {};
				this.commitInputShow = true;
				setTimeout(()=>{
					this.commitFocus = this.commitInputShow;
				}, 200);
				setTimeout(()=>{
					this.repeatReply = false;
				}, 2000);
			},
			moveHandle() {
				
			},
			showBixImages(url) { // 预览图片
				uni.previewImage({ urls: [url] });
			},
			jumpToReply() { // 普通回复需跳转回复页面
				if(!this.userInfo) {
					uni.showToast({
						title: '请登录后再进行操作！',
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '../../index/serviceDetails/detailsReply?type=road&id=' + this.serviceId
				})
			},
			timeFn(dateVal) { // 列表时间展示转换
				dateVal = dateVal.replace(/-/g, "/");
				var dateStart = new Date(dateVal);
				let dataAry = dateVal.split(' ');
				let yearAry = dataAry[0].split('/');
			    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
			    var dateEnd = new Date();//获取当前时间
			    var dateDiff = dateEnd.getTime() - dateStart.getTime();//时间差的毫秒数
			    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
			    var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
			    var hours=Math.floor(leave1/(3600*1000))//计算出小时数
			    //计算相差分钟数
			    var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
			    var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
			    //计算相差秒数
			    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
			    var seconds=Math.round(leave3/1000)
			
			    var leave4=leave3%(60*1000)      //计算分钟数后剩余的毫秒数
			    var minseconds=Math.round(leave4/1000)
			    var timeFn = "耗时："+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒"+minseconds+"毫秒";
				if(dayDiff > 364) {
					return dataAry[0]
				}else if (dayDiff > 3) {
					return yearAry[1] + '-' + yearAry[2]
				}else if(dayDiff == 3) {
					return '三天前'
				}else if(dayDiff == 2) {
					return '两天前'
				}else if(dayDiff == 1) {
					return '昨天'
				}else if(dayDiff == 0 && hours > 0) {
					return hours + '小时前'
				}else if(dayDiff == 0 && hours == 0 && minutes > 0) {
					return minutes + '分钟前'
				}else {
					return '刚刚'
				}
			},
			editRoad() {
				//路况编辑
				uni.navigateTo({
					url: '../releaseRoad/releaseRoad?pageName=路况编辑&detailsObj=' + JSON.stringify(this.detailsObj)
				})
				
			},
			backToFromPage() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	.newRoadDetails {
		background-color: #F2F2F2;
		min-height: calc(100% - 68rpx);
		@keyframes opacityStyle {
		    0% {
		        opacity: 0;
		    }
		    100% {
		        opacity: 1;
		    }
		}
		.commentsTransition {
			animation: opacityStyle 1s;
		}
		.myMask {  
			position: fixed;  
			top: 0;  
			left: 0;  
			width: 100%;  
			height: 100%;  
			// background-color: rgba(0, 0, 0, 0.5);  
			z-index: 9999;  
		}
		.serviceStationBox {
			background-color: #FFF;
			padding: 20rpx 0 20rpx 40rpx;
			.scrollBox {
				white-space: nowrap;
				width: 100%;
				.scrollImg {
					width:290rpx;
					height: 200rpx;
					border-radius: 8rpx;
					overflow: hidden;
					display: inline-block;
					margin-right:16rpx;
					.facadeImgs {	
						max-width:290rpx;
						max-height: 200rpx;
					}
				}
			}
			.mainCommentsBox {
				display: flex;
				justify-content: space-between;
				padding-right:40rpx;
				.mainCommentsAvatar {
					width:80rpx;
					height: 80rpx;
					border-radius: 100%;
					overflow: hidden;
					.mainAvatar {
						max-width:80rpx;
						max-height: 80rpx;
					}
				}
				.mainCommentsMsg {
					flex: 1;
					padding-left:14rpx;
					.mainCommentsName {
						font-size:26rpx;
						color:#333;
						line-height: 36rpx;
					}
					.mainCommentsTime {
						font-size:24rpx;
						color:#777;
						line-height: 32rpx;
						margin-top:2rpx;
					}
				}
			}
			.mainCommentsContent {
				font-size:30rpx;
				color:#333;
				line-height: 42rpx;
				margin:10rpx 0;
				padding-right:40rpx;
				.topic {
					font-size:30rpx;
					color:#0077FF;
				}
			}
			.commentsLocation {
				font-size:24rpx;
				color:#777;
				.loacationIcon {
					width:22rpx;
					height: 27rpx;
				}
			}
		}
		.commentsBox {
			padding:0 40rpx 20rpx 40rpx;
			margin-top:20rpx;
			background-color: #FFF;
			.commentsChangeHead {
				padding:20rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				position:sticky;
				top:0rpx;
				z-index: 999;
				background-color: #FFF;
				.changeBtn {
					height: 20rpx;
					line-height: 20rpx;
					font-size:30rpx;
					font-weight:500;
				}
			}
			.commentsTitle {
				font-size:32rpx;
				font-weight:500;
				color:#333;
			}
			.noComments {
				font-size:26rpx;
				color:#AAAAAA;
				text-align: center;
				padding:40rpx 0;
			}
			.commentsDetails {
				display: flex;
				justify-content: space-between;
				margin-top:30rpx;
				padding-bottom:30rpx;
				border-bottom:1rpx solid #F2F2F2;
				.commentsAvatar {
					width:80rpx;
					height: 80rpx;
					border-radius: 100%;
					overflow: hidden;
					.avatar {
						max-width:80rpx;
						max-height: 80rpx;
					}
				}
				.detailsBox {
					flex: 1;
					padding-left:14rpx;
					.commentsNameBox {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.name {
							height: 42rpx;
							line-height: 42rpx;
							font-size: 30rpx;
							color:#507DAF;
						}
						.likeNum {
							font-size:24rpx;
							color:#AAAAA0;
							.likeImg {
								width:24rpx;
								height:24rpx;
								margin-right:10rpx;
							}
						}
					}
					.commentsDate {
						color: #777;
						font-size:26rpx;
						height: 36rpx;
						line-height: 36rpx;
						margin: 6rpx 0 10rpx 0;
					}
					.commentsMsg {
						line-height: 34rpx;
						color: #333;
						font-size:28rpx;
						margin: 0 0 14rpx 0;
						white-space: pre-wrap;
						.topic {
							color: #FF7D4A;
							font-size:28rpx;
						}
						.replyUser {
							color: #507DAF;
							font-size:28rpx;
						}
						.replyTitle {
							color: #333;
							font-size:28rpx;
							padding-right:6rpx;
						}
					}
					.commentImgBox {
						width:100%;
						// 576rpx
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.commentModeBox + .commentModeBox {
							margin-left:12rpx;
						}
						.commentModeBox {
							border-radius: 8rpx;
							overflow: hidden;
							width: 184rpx;
							height: 184rpx;
							display: flex;
							justify-content: center;
							background-color: #F2F6FC;
						}
						.commentImg {
							max-width: 184rpx;
							max-height: 184rpx;
						}
					}
					.commentReplyBox {
						.commentReply {
							display: flex;
							justify-content: space-between;
							margin-top:20rpx;
							.replyAvatarBox {
								width: 64rpx;
								height: 64rpx;
								border-radius: 100%;
								overflow: hidden;
								margin-right:30rpx;
								.replyAvatar {
									max-width: 64rpx;
									max-height: 64rpx;
								}
							}
							.replyDetails {
								flex: 1;
								padding-bottom: 18rpx;
								border-bottom: 2rpx solid #F2F2F2;
								.replyName {
									font-size:26rpx;
									color:#507DAF;
								}
								.replyDate {
									color: #777;
									font-size:22rpx;
									height: 32rpx;
									line-height: 32rpx;
									margin: 2rpx 0 8rpx 0;
								}
							}
						}
					}
					.showReplyList {
						color: #777;
						font-size:22rpx;
						padding-top:10rpx;
					}
				}
			}
			.user-box{
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;
				padding: 14rpx 0;
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
				}
			}
			.business-box{
				margin-top: 30rpx;
				display: flex;
				.business-img{
					width: 168rpx;
					height: 104rpx;
				}
				.business-content{
					margin-left: 30rpx;
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
			}
		}
		.commentsFoot {
			position: fixed;
			bottom: 0;
			left: 0;
			width:610rpx;
			background-color: #FBFBFB;
			padding: 22rpx 70rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.footBtn {
				font-size:24rpx;
				color:#AAAAA0;
				.footImg {
					width:36rpx;
					height:36rpx;
					margin-right:14rpx;
					margin-bottom:-10rpx;
				}
			}
			.line {
				width: 2rpx;
				height: 44rpx;
				background-color: #DEDEDE;
			}
		}
		.loading-more {
			display: flex;
		    align-items: center;
		    justify-content: center;
		    padding: 14px 0;
		    text-align: center;
		    flex-direction: row;
		}
		.loadingImg {
			width:40rpx;
			height: 40rpx;
			margin-right:15rpx;
		}
		.loading-more-text {
		    font-size: 28upx;
		    color: #999;
		}
	}
	.solveBox {
		padding:0 10rpx;
		height: 44rpx;
		line-height: 44rpx;
		font-size:26rpx;
		border-radius: 8rpx;
		margin-left: 20rpx;
		&.guoqi {
			background-color:#AAAAAA;
			color:#FFFFFF;
		}
	}
	.newHeader {
		width: 750rpx;
		background: #FFFFFF;
		position: fixed;
		z-index: 9999;
		top: 0;
		.headBox {
			height: 35px;
			font-size:34rpx;
			font-weight: 500;
			color:#333;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 0 40rpx;
			position: relative;
			.uniIcon {
				width: 22rpx;
				height: 40rpx;
				position: absolute;
				left:40rpx;
				top: 15rpx;
			}
			.memberMoreIcon {
				width: 42rpx;
				height: 42rpx;
				position: absolute;
				right:40rpx;
				top: 15rpx;
				
			}
		}
	
	}
</style>
