<template>
	<view class="newServiceDetails" :style="commitInputShow ? 'overflow: hidden;' : 'overflow-y: auto;'">
		<!-- <scroll-view
		:scroll-top="scrollTop"
		scroll-y="true"
		class="scrollViewBox"
		:style="scrollBoxHeight"
		refresher-enabled="true"
		refresher-threshold="100"
		upper-threshold="0"
		lower-threshold="0"
		scroll-with-animation="true"
		:refresher-triggered="refresherStatus"
		@refresherpulling="refresherpulling"
		@refresherrefresh="refresherrefresh"
		@refresherrestore="refresherrestore"
		@refresherabort="refresherabort"
		@scrolltoupper="upper"
		@scrolltolower="lower"> -->
			<view class="headBox">
				<!-- <i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777; font-size: 27px;"></i> -->
				<image class="uniIcon" @tap="backToFromPage()" src="../../../static/images/back.png"></image>
				服务站详情
				<view class="headRight" v-if="detailsObj.examStatus == 0 && detailsObj.verifiedStatus == 0 && isHasEdit && userRole == 1" @click="editService">
					<image src="../../../static/images/edit_title_right.png" class="memberMoreIcon"></image>
				</view>
			</view>
			<view class="serviceStationBox">
				<!-- <view class="business-box" v-if="detailsObj.businessLicense">
					<image class="business-img" :src="detailsObj.businessLicense"></image>
					<view class="business-name">已认证执照</view>
				</view> -->
				<view class="labelBox">
					<view class="labelTitle">站点名称：</view>
					<view class="labelContent">{{detailsObj.providerName}}</view>
				</view>
				<view class="labelBox">
					<view class="labelTitle">站点类别：</view>
					<view class="labelContent">{{detailsObj.typeName}}</view>
				</view>
				<!-- <view class="labelBox flex-start">
					<view class="labelTitle">
						站点标签：
					</view>
					<view class="labelContent" :class="{limitWidth: detailsObj.businessLicense}">
						<view class="stationLabel" v-for="(item, stationKey) in detailsObj.labelVOS" :key="stationKey">{{item.labelName}}</view>
					</view>
				</view> -->
				<view class="labelBox">
					<view class="labelTitle">认证状态：</view>
					<view class="labelContent">{{certification}}</view>
				</view>
				<view class="labelBox">
					<view class="labelTitle">物流线路：</view>
					<view class="labelContent">{{detailsObj.routeDetail}}</view>
				</view>
				
				<!-- <view class="labelSubBox" v-if="detailsObj.goodValue && detailsObj.goodValue.length > 0">
					<view class="labelTitle">
							卡友对Ta的印象：
					</view>
					
					<view class="labelContent" v-if="detailsObj.goodValue && detailsObj.goodValue.length > 0">
						<view class="stationLabel" v-for="(item, stationKey) in detailsObj.goodValue" :key="stationKey">
							{{item.evaluationName}}
							<text class="labelText">{{item.countNum}}</text>
						</view>
					</view>
				</view> -->
				<view class="addressMsgBox">
					<view class="addressMsg">
						<view class="address">{{detailsObj.address}}</view>
						<view class="distance">距离位置{{getDistance(detailsObj.latitude, detailsObj.longitude).toFixed(1)}}km</view>
						<!-- <view class="distance">距离位置{{getDistance(detailsObj.latitude, detailsObj.longitude, latitude, longitude).toFixed(1)}}km</view> -->
					</view>
					<view class="addressBtnGroup">
						<view class="navigationBtn" @click="openLocation(detailsObj)">
							<image class="btnImg" src="../../../static/images/bignavigationIcon.png"></image>
							<view class="btnText">导航</view>
						</view>
						<view class="callUsBtn" @click="makePhoneCall(detailsObj)">
							<image class="btnImg" src="../../../static/images/callUs.png"></image>
							<view class="btnText">电话</view>
						</view>
					</view>
				</view>
			</view>
			<!-- ============评价============ -->
			<view class="commentsBox">
				<view class="commentsChangeHead">
					<view class="changeBtn" @tap="showModel(1)" :style="checkFlag == 1 ? 'border-bottom:10rpx solid #FF7D4A;color:#333;' : 'border-bottom:10rpx solid #FFF;color:#777;'">服务站信息</view>
					<view class="changeBtn" @tap="showModel(2)" :style="checkFlag == 2 ? 'border-bottom:10rpx solid #FF7D4A;color:#333;' : 'border-bottom:10rpx solid #FFF;color:#777;'">评价</view>
				</view>
				<view class="commentsTransition first" v-show="checkFlag == 1">
					
					<view class="scrollBox">
						<view class="scrollImg" v-for="(item, scrollImgKey) in detailsObj.facadeImgsItem" :key="scrollImgKey">
							<image class="facadeImgs" :src="item" @tap="showBixImages(item)"></image>
						</view>
					</view>
					<view class="businessHours">营业时间：
					<text class="businessText">{{detailsObj.businessHours ? detailsObj.businessHours : '未设置'}}</text></view>
					<view class="businessHours">联系人：
					<text class="businessText">{{detailsObj.concatName ? detailsObj.concatName : '未设置'}}</text></view>
					<view class="businessHours describleTitle">服务站描述</view>
					<view class="describle">
						{{detailsObj.providerDescription ? detailsObj.providerDescription : '暂无描述'}}
					</view>
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
				</view>
				<view class="commentsTransition" v-show="checkFlag == 2">
					<view class="commentsTitle" style="margin-top:10rpx;" v-if="myCommentList">我的评价</view>
					<view class="commentsDetails" v-if="myCommentList">
						<view class="commentsAvatar">
							<image class="avatar" :src="myCommentList.avatar ? myCommentList.avatar : '../../../static/logo.png'"></image>
						</view>
						<view class="detailsBox">
							<view class="commentsNameBox">
								<view class="name" @click="toCommit(myCommentList)">{{myCommentList.userName}}</view>
								<view class="likeNum" @tap="commentslike(myCommentList, 2, 'my')">
									<image class="likeImg" :src="myCommentList.flagLikeNum ? '../../../static/images/detailsalready.png' : '../../../static/images/detailspraise.png'"></image>
									{{myCommentList.upvoteNum}}
								</view>
							</view>
							<view class="commentsDate">{{timeFn(myCommentList.createdDt)}}</view>
							<view class="commentsMsg">
								{{myCommentList.content}}
								<text class="topic" v-for="(vosItem, vosKey) in myCommentList.commentEvaluationVOS" :key="vosKey">#{{vosItem.evaluationName}}#</text>
							</view>
							<view class="commentImgBox">
								<view class="commentModeBox" v-for="(item, imgKey) in myCommentList.facadeImgsItem" :key="imgKey" v-if="imgKey != '3'" @tap="showBixImages(item)">
									<image class="commentImg" :src="item" mode="heightFix"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="commentsTitle" style="padding-top: 20rpx;">所有评价（{{detailsObj.commentNum}}）</view>
					<view class="commentsImpressionBox">
						<view
						class="impression"
						v-for="(item, evaluationKey) in detailsObj.commentEvaluationDetailList"
						:key="evaluationKey"
						:class="selectVal == item.commentEvaluationId ? 'onSelect' : 'notSelect'"
						@tap="toSelect(item.commentEvaluationId)">
						{{item.evaluationName}} ({{item.countNum}})
						</view>
					</view>
					<view class="noComments" v-if="commentList && commentList.length == 0">快来发表你的评论吧</view>
					<view class="commentsDetails" v-for="(item, detailsKey) in commentList" :key="detailsKey">
						<view class="commentsAvatar">
							<image class="avatar" :src="item.avatar ? item.avatar : '../../../static/logo.png'"></image>
						</view>
						<view class="detailsBox">
							<view class="commentsNameBox">
								<view class="name" @click="toCommit(item)">{{item.userName}}</view>
								<view class="likeNum" @tap="commentslike(item, 2, 'first')">
									<image class="likeImg" :src="item.flagLikeNum ? '../../../static/images/detailsalready.png' : '../../../static/images/detailspraise.png'"></image>
									{{item.upvoteNum}}
								</view>
							</view>
							<view class="commentsDate">{{timeFn(item.createdDt)}}</view>
							<view class="commentsMsg" @click="toCommit(item)">
								{{item.content}}
								<text class="topic" v-for="(vosItem, vosKey) in item.commentEvaluationVOS" :key="vosKey">#{{vosItem.evaluationName}}#</text>
							</view>
							<view class="commentImgBox">
								<view class="commentModeBox" v-for="(imgItem, imgKey) in item.facadeImgsItem" :key="imgKey" v-if="imgKey != '3'" @tap="showBixImages(imgItem)">
									<image  class="commentImg" :src="imgItem" mode="heightFix"></image>
								</view>
							</view>
							<view class="commentReplyBox" v-for="(replyList, replyKey) in item.replyItem" :key="replyKey">
								<view class="commentReply">
									<view class="replyAvatarBox">
										<image class="replyAvatar" :src="replyList.fromUserAvatar ? replyList.fromUserAvatar : '../../../static/logo.png'"></image>
									</view>
									<view class="replyDetails">
										<view class="commentsNameBox">
											<view class="replyName"  @click="toCommit(item, replyList)">{{replyList.fromUser}}</view>
											<view class="likeNum" @tap="commentslike(replyList, 3, 'second', item)">
												<image class="likeImg" :src="replyList.flagLikeNum ? '../../../static/images/detailsalready.png' : '../../../static/images/detailspraise.png'"></image>
												{{replyList.upvoteNum}}
											</view>
										</view>
										<view class="replyDate">{{timeFn(replyList.createdDt)}}</view>
										<view class="commentsMsg"  @click="toCommit(item, replyList)">
											<text class="replyTitle" v-if="replyList.toUserId">回复 </text>
											<text class="replyUser" v-if="replyList.toUserId">@{{replyList.toUser}}</text>
											<text class="replyTitle" v-if="replyList.toUserId">：</text>
											{{replyList.content}}
											<!-- <text class="topic" v-if="item.commentEvaluationVOS">#{{item.commentEvaluationVOS[0].evaluationName}}#</text> -->
										</view>
									</view>
								</view>
							</view>
							<view class="showReplyList" @tap="showSubComments(item, detailsKey)" v-show="item.replyNum > 0 && item.showMoreSubComment">
								{{!item.showSubComment ? '—— 展开' + item.replyNum + '条回复 ——' : '—— 查看更多回复 ——'}}
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
		<!-- </scroll-view> -->
		<view class="commentsFoot" :style="safeAreaHeight > 0 ? 'padding-bottom:60rpx;' : 'padding-bottom:22rpx;'">
			<view class="footBtn" @tap="likeChange(1)">
				<image class="footImg" :src="detailsObj.flagLike ? '../../../static/images/detailsalready.png' : '../../../static/images/detailspraise.png'"></image>
				{{detailsObj.upvoteNum}}
			</view>
			<view class="line"></view>
			<view class="footBtn" @tap="likeChange(2)">
				<image class="footImg" :src="detailsObj.flagUnlike ? '../../../static/images/detailsbadReview.png' : '../../../static/images/detailsstepOn.png'"></image>
				{{detailsObj.downvoteNum}}
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
		<!-- <view class="myMask" v-if="commitInputShow" @touchmove.stop.prevent="moveHandle">
			<uni-comments ref="comments" :commit="commitFocus" @submit="submit" v-if="commitInputShow" :hint="hint" @commentsBlur="commentsBlur" :commentBoxHeight="commentBoxHeight"></uni-comments>
		</view> -->
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	export default {
		data() {
			return {
				isHasEdit: false,
				serviceId: '',
				userInfo: '',
				longitude: '',
				latitude: '',
				detailsObj: {},
				facadeImgsItem: [
					"https://hyzg-app.oss-cn-beijing.aliyuncs.com/c8320bbb9c0a4f78abaf6969621f5096.PNG",
					"https://hyzg-app.oss-cn-beijing.aliyuncs.com/c8320bbb9c0a4f78abaf6969621f5096.PNG",
					"https://hyzg-app.oss-cn-beijing.aliyuncs.com/c8320bbb9c0a4f78abaf6969621f5096.PNG"
				],
				checkFlag: 1,
				testData: [0,1,2,3,4,5,6],
				scrollTop: 0,
				scrollBoxHeight: '',
				refresherStatus: true, // 下拉刷新状态
				refresherFreshing: false, // 避免重复下拉刷新
				isLoad: false,
				noData: false,
				selectVal: '',
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
				commentBoxHeight: 0,
				safeAreaHeight: 0,
				certification: '',
				userRole:'',
			};
		},
		onLoad(options) {
			this.userRole = uni.getStorageSync('userRole');
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				var userInfoObj = JSON.parse(userInfo);
				console.log(userInfoObj, 'asa')
					if (userInfoObj.attrs.driverVerify == 1 || userInfoObj.attrs.vehicleVerify == 1) {
						this.isHasEdit = true
					} else {
						this.isHasEdit = false;
					}			
			}
			console.log(this.isHasEdit,'this.isHasEdit')
			if(options.id) {
				this.serviceId = options.id;
				this.userInfo = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : '';
				this.getDetail();
				this.getMyCommentList();
				this.getCommentList();
			}else {
				uni.switchTab({
				    url: '/pages/my/index/index'
				});
			}
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
			this.longitude = getApp().globalData.longitude;
			this.latitude = getApp().globalData.latitude;
			let that = this;
			uni.onKeyboardHeightChange(res => {
				console.log('键盘高度', res);
				if (res.height == 0) {
					that.commitInputShow = false;
					that.commitFocus = false;
				}
			})
		},
		onReady() {
			console.log('设备信息', uni.getSystemInfoSync());
			// let obj = uni.getSystemInfoSync()
			// this.scrollBoxHeight = 'height:' + ((obj.windowHeight - obj.statusBarHeight) * 2) + 'rpx';
		},
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
			getLocationInfo(){
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						that.longitude = res.longitude;
						that.latitude = res.latitude;
					},
					fail: function(err) {
						that.longitude = 116.405285;
						that.latitude = 39.904989;
						// uni.showToast({
						// 	title: '位置信息获取失败',
						// 	icon: 'none'
						// })
					},
					complete: function(resp) {
						that.getDetail();
					},
				});
			},
			showDefaultImg(typeId) {
				if(typeId == 2) {
					return '../../../static/images/defaultWX.png'
				}else if(typeId == 3) {
					return '../../../static/images/defaultPJ.png'
				}else if(typeId == 4) {
					return '../../../static/images/defaultYQZ.png'
				}else if(typeId == 5) {
					return '../../../static/images/defaultTCC.png'
				}else if(typeId == 6) {
					return '../../../static/images/defaultWLY.png'
				}else if(typeId == 7) {
					return '../../../static/images/defaultQM.png'
				}else if(typeId == 8) {
					return '../../../static/images/defaultESC.png'
				}else if(typeId == 9) {
					return '../../../static/images/defaultJX.png'
				}else if(typeId == 10) {
					return '../../../static/images/defaultSS.png'
				}else if(typeId == 11) {
					return '../../../static/images/defaultQT.png'
				}else if(typeId == 12) {
					return '../../../static/images/defaultGC.png'
				}else if(typeId == 13) {
					return '../../../static/images/defaultFWQ.png'
				}else if(typeId == 14) {
					return '../../../static/images/defaultJCZ.png'
				}else {
					return '../../../static/images/serviceDefault.png'
				}
			},
			getDetail(){ // 获取服务站详情
				var that = this;
				let params = {
					id: that.serviceId,
					flagUserId: that.userInfo ? that.userInfo.userId : undefined,
				}
				console.log('服务站详情查询参数', params);
				utils.postRequest('/mu/provider/detail', params)
				.then(res=>{
					console.log('服务站详情', res);
					if(res.retCode == "0000000"){
						res.rspBody.facadeImgsItem = [];
						if(res.rspBody.facadeImgs){
							res.rspBody.facadeImgsItem = res.rspBody.facadeImgs.split(",");
						} else{
							res.rspBody.facadeImgsItem.push(that.showDefaultImg(res.rspBody.typeId));
						}
						var detailsObj = res.rspBody;
						var goodValue = detailsObj.commentEvaluationDetailList;
						if (goodValue.length > 0) {
							goodValue.sort(function(a, b) {
								return b.countNum - a.countNum
							})
							detailsObj.goodValue = goodValue.slice(0, 3);
						}
						console.log(detailsObj,'服务站详情')
						that.detailsObj = detailsObj;
						if(detailsObj.verifiedStatus == 0){
							that.certification = '未认证'
						} else if(detailsObj.verifiedStatus == 1){
							that.certification = '已驳回'
						} else if(detailsObj.verifiedStatus == 2){
							that.certification = '认证中'
						} else {
							that.certification = '已认证'
						}
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
			getMyCommentList() { // 我的评论
				let that = this;
				if(!that.userInfo) {
					return false;
				}
				utils.postRequest('/mu/providerComment/list', {
					providerId: that.serviceId,
					userId: that.userInfo.userId,
					flagUserId: that.userInfo ? that.userInfo.userId : undefined,
					pageSize: 1,
					pageNum: 1,
				})
				.then(res=>{
					console.log('我的评论列表详情', res);
					if(res.retCode=="0000000"){
						that.myCommentList = res.rspBody.items[0];
						that.myCommentList.replyItem = [];
						that.myCommentList.facadeImgsItem = [];
						if(that.myCommentList.facadeImgs) {
							that.myCommentList.facadeImgsItem = that.myCommentList.facadeImgs.split(',');
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
				let params = {
					providerId: that.serviceId,
					flagUserId: that.userInfo ? that.userInfo.userId : undefined,
					pageSize: that.pageSize,
					pageNum: that.pageNum,
					commentEvaluationId: that.selectVal
				}
				console.log('评论列表查询参数', params);
				utils.postRequest('/mu/providerComment/list', params)
				.then(res=>{
					console.log('评论列表详情', res);
					if(res.retCode=="0000000"){
						let ary = res.rspBody.items;
						let total = res.rspBody.total;
						for(let i in ary) {
							ary[i].replyItem = [];
							ary[i].facadeImgsItem = [];
							ary[i].showSubComment = false;
							ary[i].showMoreSubComment = true;
							ary[i].subCommentPage = 0;
							if(ary[i].facadeImgs) {
								ary[i].facadeImgsItem = ary[i].facadeImgs.split(',');
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
					providerId: that.serviceId,
					commentId: item.id,
					pageSize: 20,
					pageNum: that.commentList[key].subCommentPage,
					flagUserId: that.userInfo ? that.userInfo.userId : undefined,
				};
				console.log('2级回复查询参数', params);
				utils.postRequest('/mu/providerCommentReply/list', params)
				.then(res=>{
					console.log('查看更多2级回复', res);
					console.log('原有2级回复', that.commentList[key].replyItem);
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
							ary[i].facadeImgsItem = [];
							if(ary[i].facadeImgs) {
								ary[i].facadeImgsItem = ary[i].facadeImgs.split(',');
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
					providerId: that.serviceId,
					commentId: that.replyItem.id,
					parentReplyId: that.commitReplyItem ? that.commitReplyItem.id : null,
					// parentReplyId: that.commitReplyItem.parentReplyId,
					toUserId: that.commitReplyItem ? that.commitReplyItem.fromUserId : null,
					content: val,
				};
				console.log('回复提交参数', params);
				utils.postRequest('/mu/providerCommentReply/save', params)
				.then(res=>{
					console.log('回复', res);
					if(res.retCode=="0000000"){
						uni.showToast({
							title: '回复成功',
							icon: 'none'
						})
						for(let i in that.commentList) {
							console.log(that.commentList[i].id, that.replyItem.id)
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
									"fromUser": that.userInfo.userName,
									"fromUserAvatar": that.userInfo.attrs.avatar,
									"toUserId": that.commitReplyItem.fromUserId ? that.commitReplyItem.fromUserId : '',
									"toUser": that.commitReplyItem.fromUser ? that.commitReplyItem.fromUser : '',
									"content": val,
									"upvoteNum": 0,
									"flagLikeNum": 0,
								}
								that.commentList[i].replyItem.unshift(obj);
								console.log(that.commentList[i].replyItem);
								// if(that.commentList[i].showSubComment) {
									
								// }else {
								// 	that.commentList[i].commentNum++;
								// }
								break;
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
				var requestUrl = '';
				switch(flag) {
					case 1:
						if(that.detailsObj.flagUnlike ) {
							uni.showToast({
								title: '请取消倒赞后再进行操作！',
								icon: 'none'
							})
							return false;
						}
						apiType = 0;
						requestUrl = that.detailsObj.flagLike ? '/mu/providerEva/cancel' : '/mu/providerEva/save';
						break;
					case 2:
						if(that.detailsObj.flagLike) {
							uni.showToast({
								title: '请取消点赞后再进行操作！',
								icon: 'none'
							})
							return false;
						}
						apiType = 1;
						requestUrl = that.detailsObj.flagUnlike ? '/mu/providerEva/cancel' : '/mu/providerEva/save';
						break;
				}
				utils.postRequest(requestUrl, {
					providerId: that.serviceId,
					evaluationType: apiType
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
			commentslike(item, flag, type, parentItem) { // 列表--点赞/取消点赞
				let that = this;
				if(!this.userInfo) {
					uni.showToast({
						title: '请登录后再进行操作！',
						icon: 'none'
					})
					return false;
				}
				var apiFlag = flag;
				var requestUrl = item.flagLikeNum ? '/mu/providerCommentUpvote/cancel' : '/mu/providerCommentUpvote/save';
				let params = {
					commentId: type == 'second' ? parentItem.id : item.id,
					replyId: type == 'second' ? item.id : null,
				};
				console.log('点赞前参数', item);
				utils.postRequest(requestUrl, params)
				.then(res=>{
					if(res.retCode=="0000000"){
						// uni.showToast({
						// 	title: '操作成功',
						// })
						// 根据是否点赞的字段直接操作数组
						item.flagLikeNum = item.flagLikeNum ? 0 : 1;
						item.upvoteNum = item.flagLikeNum ? item.upvoteNum + 1 : item.upvoteNum - 1;
						if(type == 'my') {
							for(let i in that.commentList) {
								if(item.id == that.commentList[i].id) {
									that.commentList[i].flagLikeNum = item.flagLikeNum;
									that.commentList[i].upvoteNum = item.flagLikeNum ? that.commentList[i].upvoteNum + 1 : that.commentList[i].upvoteNum - 1;
								}
							}
						}
						if(type == 'first') {
							if(item.id == that.myCommentList.id) {
								that.myCommentList.flagLikeNum = item.flagLikeNum;
								that.myCommentList.upvoteNum = item.flagLikeNum ? that.myCommentList.upvoteNum + 1 : that.myCommentList.upvoteNum - 1;
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
				console.log('开始回复', commitReplyItem);
				this.repeatReply = true;
				this.hint = commitReplyItem ? '回复@' + commitReplyItem.fromUser : '回复@' + item.userName;
				this.replyItem = item;
				this.commitReplyItem = commitReplyItem ? commitReplyItem : {};
				this.commitInputShow = true;
				setTimeout(()=>{
					this.commitFocus = this.commitInputShow;
				}, 200);
				setTimeout(()=>{
					this.repeatReply = false;
				}, 2000);
				console.log(this.replyItem);
			},
			toSelect(val) { // 评价标签筛选
				this.selectVal = this.selectVal == val ? '' : val;
				this.pageNum = 1;
				this.getCommentList();
				this.$forceUpdate();
			},
			showModel(val) {
				if(this.checkFlag != val) {
					uni.pageScrollTo({
					    scrollTop: 0,
					    duration: 0
					});
					setTimeout(() => {
						this.checkFlag = val;
					}, 100)
				}
				// this.scrollGoTop();
				// this.checkFlag = this.checkFlag == val ? this.checkFlag : val;
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
			showBixImages(url) { // 预览图片
				uni.previewImage({ urls: [url] });
			},
			scrollGoTop() {
				this.scrollTop = 0;
				// this.$nextTick(function() {
				// 	this.scrollTop = 0
				// });
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
					url: '../../index/serviceDetails/detailsReply?type=service&id=' + this.serviceId + '&typeId=' + this.detailsObj.typeId
				})
			},
			getDistance(lat, lng){ // 获取距离公里数
				return utils.newGetDistance(lat, lng)
			},
			// getDistance(lat, lng, selfLatitude, selfLongitude){
			// 	return utils.getDistance(lat, lng, selfLatitude, selfLongitude)
			// },
			moveHandle() {
				
			},
			serviceCertification(){ // 去认证
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
			makePhoneCall(res){ // 联系服务站
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
			openLocation(res){ // 导航
				uni.openLocation({
					latitude: res.latitude,	//维度
					longitude: res.longitude, //经度
					name: res.address,	//目的地定位名称
					scale: 15,	//缩放比例
					address: res.address	//导航详细地址
				})
			},
			editService() {
				//编辑服务站
				uni.navigateTo({
					url: '../report/report?pageName=服务站编辑&detailsObj=' + JSON.stringify(this.detailsObj)
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
	.newServiceDetails {
		background-color: #F2F2F2;
		padding-top: 130rpx;
		// padding-bottom:68rpx;
		// min-height: 100vh;
		height: calc(100% - 88rpx);
		overflow-x: hidden;
		.myMask {  
			position: fixed;  
			top: 0;  
			left: 0;  
			width: 100%;  
			height: 100vh;  
			// background-color: rgba(0, 0, 0, 0.5);  
			z-index: 9999;  
		}
		.labelBox {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			font-size: 28rpx;
			line-height: 40rpx;
			letter-spacing: 1.75rpx;
			color: #333333;
			&.flex-start {
				align-items: flex-start;
				padding-bottom: 5rpx;
			}
			padding-bottom: 21rpx;
			.labelTitle {
				width: 150rpx;
				
			}
			.labelContent {
				flex: 1;
				flex-wrap: wrap;
				display: flex;
				flex-direction: row;
				&.limitWidth {
					width: 350rpx;
				}
			}
			.stationLabel {
				padding-bottom: 16rpx;
			}
			
		} 
		.labelSubBox {
			display: flex;
			flex-direction: column;
			.labelTitle {
				font-size: 28rpx;
				color: #333333;
				padding-bottom: 21rpx;
			}
			.labelContent {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding-bottom: 12rpx;
				.stationLabel {
					border: 1px solid #0077FF;
					color: #0077FF;
					border-radius: 8rpx;
					font-size: 26rpx;
					padding: 5rpx 18rpx;
					margin-bottom: 20rpx;
					box-sizing: border-box;
					.labelText {
						padding-left: 10rpx;
					}
				}
				
			}
		}
		.scrollBox {
			white-space: nowrap;
			margin-top: 20rpx;
			margin-bottom: 32rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 0 54rpx;
			box-sizing: border-box;
			.scrollImg {
				width:272rpx;
				height: 272rpx;
				margin-bottom: 16rpx;
				&:nth-child(odd) {
					margin-right:16rpx;
				}
				.facadeImgs {	
					max-width:272rpx;
					max-height: 272rpx;
				}
			}
		}
		.businessHours {
			font-size:28rpx;
			color:#333;
			margin:16rpx 0;
			padding: 0 54rpx;
			&.describleTitle {
				padding-bottom: 10rpx;
				
			}
			.businessText {
				color: #979797;
			}
		}
		.describle {
			font-size: 24rpx;
			color: #777777;
			border: 1px solid #979797;
			margin: 20rpx 50rpx;
			padding: 20rpx;
			position: relative;
			border-radius: 0 10rpx 10rpx 10rpx;
			&:before{
			        box-sizing: content-box;
			        width: 0px;
			        height: 0px;
			        position: absolute;
			        top: -8px;
			        left:0px;
			        padding:0;
			        border-bottom:4px solid #FFFFFF;
			        border-top:4px solid transparent;
			        border-left:4px solid #FFFFFF;
			        border-right:4px solid transparent;
			        display: block;
			        content:'';
			        z-index: 12;
			    }
			    &:after{
					
			        box-sizing: content-box;
			        width: 0px;
			        height: 0px;
			        position: absolute;
			        top: -10px;
			        left:-1px;
			        padding:0;
			        border-bottom:5px solid #979797;
			        border-top:5px solid transparent;
			        border-left:5px solid #979797;
			        border-right:5px solid transparent;
			        display: block;
			        content:'';
			        z-index:10
			    }
			
		}
		
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
			&.first {
				padding-bottom: 70rpx;
				
			}
		}
		.serviceStationBox {
			background-color: #ffffff;
			padding: 20rpx 30rpx 40rpx;
			position: relative;
			.business-box{
				position: absolute;
				right: 26rpx;
				top: 20rpx;
				display: flex;
				flex-direction: column;
				width: 164rpx;
				height: 148rpx;
				.business-img{
					width: 164rpx;
					height: 100rpx;
					border-radius: 8rpx 8rpx 0 0;
				}
				.business-name{
					height: 48rpx;
					background-color: rgba(0, 119, 255, 0.2);
					border-radius: 0 0 8rpx 8rpx;
					font-size: 22rpx;
					color: #333;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.stationLabel{
				border-radius: 8rpx;
				margin-right: 20rpx;
			}
			.addressMsgBox {
				margin-top:16rpx;
				padding:16rpx 0 0 0;
				border-top:2rpx solid #F2F2F2;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.addressMsg {
					width: 450rpx;
					.address {
						line-height: 36rpx;
						font-size: 26rpx;
						color: #333;
					}
					.distance {
						font-size: 26rpx;
						color: #777;
						margin-top:10rpx;
					}
				}
				.addressBtnGroup {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.btnImg {
						width:40rpx;
						height:40rpx;
						display: block;
						margin: 0 auto;
					}
					.btnText {
						font-size:24rpx;
						color:#777;
						text-align: center;
						margin-top:8rpx;
					}
					.navigationBtn {
						margin-right:60rpx;
					}
					.callUsBtn {}
				}
			}
		}
		.commentsBox {
			padding:0 40rpx 20rpx;
			margin-top:20rpx;
			background-color: #FFF;
			.commentsChangeHead {
				padding:20rpx 180rpx 20rpx 180rpx;
				display: flex;
				justify-content: space-between;
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
			.commentsImpressionBox {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				.impression {
					padding: 0 20rpx;
					height: 60rpx;
					line-height: 60rpx;
					background: #FFFFFF;
					border-radius: 10rpx;
					text-align: center;
					font-size:26rpx;
					margin:20rpx 20rpx 0 0;
				}
				.onSelect {
					border:2rpx solid #0077FF;
					color: #0077FF;
				}
				.notSelect {
					border:2rpx solid #FF7D4A;
					color: #FF7D4A;
				}
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
				border-bottom:2rpx solid #F2F2F2;
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
	.headBox {
		padding:70rpx 0 0 0;
		background-color: #FFFFFF;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size:34rpx;
		font-weight: 500;
		color:#333;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: 9999;
		// box-sizing: border-box;
		.headRight {
			position: absolute;
			right: 0;
			top:  70rpx;
		}
		.uniIcon {
			width: 22rpx;
			height: 40rpx;
			position: absolute;
			left:40rpx;
			margin-top:10rpx;
		}
		.memberMoreIcon {
			width: 42rpx;
			height: 42rpx;
			position: absolute;
			right:40rpx;
			margin-top:10rpx;
		}
	}
</style>
