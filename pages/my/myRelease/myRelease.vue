<template>
	<view class="myRelease">
		<view class="newHeader">
			<view :style="{height: statusBarHeight}"></view>
			<view class="headBox" v-if="!isEdit">
				<!-- <i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777; font-size: 27px;"></i> -->
				<image class="uniIcon" @tap="backToFromPage()" src="../../../static/images/back.png"></image>
				<view>我的发布</view>
				<image  src="../../../static/images/del.png" class="memberEditIcon" @click="doManagerEdit()"></image>
				
			</view>
			<view class="headContent" v-else>
				<!-- <i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777; font-size: 27px;"></i> -->
				<view class="left" @click="cancel">
					取消
				</view>
				<view>我的发布</view>
				<view class="right" @click="deleteInfo">
					删除
				</view>
			</view>
		</view>
		
		<view class="line"></view>
		<view class="releaseHead" :style="{top: tabBarTop + 'px'}">
			<view class="headBtn" :class="activity == 1 ? 'btnChecked' : 'btnDefault'" @tap="changeActivity(1)">服务站</view>
			<view class="headBtn" :class="activity == 2 ? 'btnChecked' : 'btnDefault'" @tap="changeActivity(2)">路况</view>
			<view class="headBtn" :class="activity == 3 ? 'btnChecked' : 'btnDefault'" @tap="changeActivity(3)">互助</view>
		</view>
		<view class="serviceModel" :style="{'padding-top': (tabBarTop + 45) + 'px'}" v-if="activity == 1">
			<view class="serviceItem" v-for="(item, index) in serviceList" :key="index">
				
				<view class="largeServiceBox" >
					<view class="serviceBox">
						<view class="serviceImg">
							<image  @click="previewImage(item)" :src="item.facadeImgs ? item.facadeImageAry['0'] : showDefaultImg(item.typeId)" mode="aspectFill"></image>
						</view>
						
						<view class="serviceContent">
							<view class="contentTitleBox">
								<view class="contentTitle" @click="jumpToDetails(item)">{{item.providerName}}</view>
								<view class="commentsDistance" @click="openLocation(item)">
									<text class="disTanceNum">{{getDistance(item.latitude, item.longitude).toFixed(1)}}km</text>
									<text class="disTanceSyb">｜</text>
									<image class="newnavigationIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/newnavigationIcon.png"></image>
									<text class="disTanceMsg">去这里</text>
								</view>
							</view>
							<view class="newLabelBox" @click="jumpToDetails(item)">
								{{showLableMsg(item)}}
							</view>
							<view class="impressionList" @click="jumpToDetails(item)">
								<view class="impressionListLabel" v-for="(comment, commentKey) in item.commentEvaluationDetailList" :key="commentKey"  v-if="commentKey < 4">{{comment.evaluationName}}</view>
							</view>
						</view>
					</view>
					<view class="contentAddress" @click="jumpToDetails(item)">
						<image class="addressIcon" src="../../../static/images/newlocationIcon.png"></image>
						<view class="addressMsg">{{item.address}}</view>
					</view>
					
				</view>
			</view>
			<view class="loadingBox" v-show="serviceNoMore">
				没有更多了~
			</view>
			<view class="noData-box" v-show="serviceNoData">
				<image class="noData" src="/static/images/noData.png" mode="widthFix"></image>
				<view class="">暂无数据</view>
			</view>
		</view>
		<view class="serviceModel" :style="{'padding-top': (tabBarTop + 45) + 'px'}" v-if="activity == 2">
			
			<view class="serviceItem" v-for="(item, index) in roadList" :key="index">
			
				<view class="roadBox" :class="{active: isEdit}">
					<image class="userAvatar" :src="item.avatar ? item.avatar : '/static/logo.png'"></image>
					<view class="commentsContentBox">
						<view class="commentsHead">
							<view class="commentsHeadNameBox" @click="jumpToDetails(item)">
								<text class="commentsHeadName">{{item.userName}}</text>
							</view>
							<view class="commentsDistance" @click="openLocation(item)">
								<text class="disTanceNum">{{getDistance(item.latitude, item.longitude).toFixed(1)}}km</text>
								<text class="disTanceSyb">｜</text>
								<image class="newnavigationIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/newnavigationIcon.png"></image>
								<text class="disTanceMsg">去这里</text>
							</view>
						</view>
						<view class="commentsSubStatus" v-if="item.isGuoqi">
							<text  class="headSubText">已过期</text>
						</view>
						<view class="commentsBody" @click="jumpToDetails(item)">
							<text class="commentsMsg">{{item.description}}</text>
						</view>
						<view class="commentsAddress" @click="jumpToDetails(item)">
							<view class="addressIcon">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/address.png"></image>
							</view>
							<text class="addressMsg">{{item.address}}</text>
						</view>
						<view class="commentsImageBox" v-if="item.facadeImageAry && item.facadeImageAry.length > 0">
							<image v-for="(imgItem, imgIndex) in item.facadeImageAry" :key="imgIndex" class="commentsImageList" :src="imgItem" @click="showBigImg(item, imgIndex)"></image>
						</view>
						<view class="commentsFoot">
							<view class="commentsTime" @click="jumpToDetails(item)">
								<image class="commentsTimeIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/time.png"></image>
								<text class="commentsTimeMsg">{{item.dateDesc}}</text>
							</view>
							<view class="commentsStatus">
								<view class="commentsStatusBox" @click="situationStatusLike(1, 1, item, index)">
									<image class="commentsStatusIcon" :src="item.isLiked == 1 ? '/static/images/already.png' : '/static/images/praise.png'"></image>
									<text class="commentsStatusMsg">{{item.likeNum}}</text>
								</view>
								<view class="commentsStatusBox" @click="situationStatusLike(1, 0, item, index)" style="margin-left:60rpx;">
									<image class="commentsStatusIcon" :src="item.isDisLiked == 1 ? '/static/images/badReview.png' : '/static/images/stepOn.png'"></image>
									<text class="commentsStatusMsg">{{item.dislikeNum}}</text>
								</view>
								<view class="commentsStatusBox" @click="jumpToDetails(item)" style="margin-left:60rpx;">
									<image class="commentsStatusIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/comments.png"></image>
									<text class="commentsStatusMsg">{{item.commentNum}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="checkMemberBox" :class="{active: isEdit}" :style="item.isChecked ? 'background-color:#FB4C4C;' : 'background-color:rgba(251, 76, 76, 0.41);'">
					<view v-if="!item.isChecked" @tap="toCheckMember(item, 2)" class="btnDefault"></view>
					<image v-if="item.isChecked" @tap="toCheckMember(item, 2)" class="btnChecked" src="../../../static/images/memberAuditChecked.png"></image>
				</view>
			</view>
			<view class="loadingBox" v-show="roadNoMore">
				没有更多了~
			</view>
			<view class="noData-box" v-show="roadNoData">
				<image class="noData" src="/static/images/noData.png" mode="widthFix"></image>
				<view class="">暂无数据</view>
			</view>
		</view>
		<view class="serviceModel" :style="{'padding-top': (tabBarTop + 45) + 'px'}" v-if="activity == 3">
			<view class="serviceItem" v-for="(item, index) in mutualList" :key="index">
				<view class="roadBox" :class="{active: isEdit}">
					<image class="userAvatar" :src="item.avatar ? item.avatar : '/static/logo.png'"></image>
					<view class="commentsContentBox">
						<view class="commentsHead">
							<view class="commentsHeadNameBox" @click="jumpToDetails(item)">
								<text class="commentsHeadName">{{item.userName}}</text>
							</view>
							<view class="commentsDistance" @click="openLocation(item)">
								<text class="disTanceNum">{{getDistance(item.latitude, item.longitude).toFixed(1)}}km</text>
								<text class="disTanceSyb">｜</text>
								<image class="newnavigationIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/newnavigationIcon.png"></image>
								<text class="disTanceMsg">去这里</text>
							</view>
						</view>
						<view class="commentsSubStatus">
							<view class="commentsStatusSyb" :style="showStatusBc(item.solveFlag)">
								<text class="commentsStatusSybMsg" :style="showStatus(item.solveFlag, 'color')">{{showStatus(item.solveFlag, 'msg')}}</text>
							</view>
							<text v-if="item.isGuoqi"  class="headSubText">已过期</text>
						</view>
						<view class="commentsBody" @click="jumpToDetails(item)">
							<text class="commentsMsg">{{item.description}}</text>
						</view>
						<view class="commentsAddress" @click="jumpToDetails(item)">
							<image class="addressIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/address.png"></image>
							<text class="addressMsg">{{item.address}}</text>
						</view>
						<view class="commentsImageBox" v-if="item.facadeImageAry && item.facadeImageAry.length > 0">
							<image v-for="(imgItem, imgIndex) in item.facadeImageAry" :key="imgIndex" class="commentsImageList" :src="imgItem" @click="showBigImg(item, imgIndex)"></image>
						</view>
						<view class="commentsFoot" @click="jumpToDetails(item)">
							<view class="commentsTime">
								<image class="commentsTimeIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/time.png"></image>
								<text class="commentsTimeMsg">{{item.dateDesc}}</text>
							</view>
							<view class="commentsStatus">
								<view class="commentsStatusBox" style="margin-left:60rpx;">
									<image class="commentsStatusIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/comments.png"></image>
									<text class="commentsStatusMsg">{{item.commentCount}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="checkMemberBox" :class="{active: isEdit}" :style="item.isChecked ? 'background-color:#FB4C4C;' : 'background-color:rgba(251, 76, 76, 0.41);'">
					<view v-if="!item.isChecked" @tap="toCheckMember(item, 3)" class="btnDefault"></view>
					<image v-if="item.isChecked" @tap="toCheckMember(item, 3)" class="btnChecked" src="../../../static/images/memberAuditChecked.png"></image>
				</view>
			</view>
			<view class="loadingBox" v-show="mutualNoMore">
				没有更多了~
			</view>
			<view class="noData-box" v-show="mutualNoData">
				<image class="noData" src="/static/images/noData.png" mode="widthFix"></image>
				<view class="">暂无数据</view>
			</view>
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
			正在加载中…
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	export default {
		data() {
			return {
				tabBarTop: 0,
				statusBarHeight: 0,
				willDoMember: [],
				isEdit: false,
				activity: 1,
				pageSize: 10,
				serviceList: [],
				servicePageNum: 1,
				roadList: [],
				roadPageNum: 1,
				mutualList: [],
				mutualPageNum: 1,
				isLoading: false,
				serviceNoMore: false,
				roadNoMore: false,
				mutualNoMore: false,
				facadeImageAry: [
					'../../../static/images/defaultJCZ.png',
					'../../../static/images/defaultJCZ.png',
					'../../../static/images/defaultJCZ.png'
				],
				serviceNoData: false,
				roadNoData: false,
				mutualNoData: false,
			};
		},
		onLoad() {
			this.getListInfo();
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight + 'px';
			this.tabBarTop = statusBarHeight + 35
		},
		onShow() {
			console.log()
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getListInfo();
		},
		onReachBottom() { // 上拉加载
			switch(this.activity) {
				case 1:
					this.serviceOnLoad();
					break;
				case 2:
					this.roadOnLoad();
					break;
				case 3:
					this.mutualOnLoad();
					break;
			}
		},
		onBackPress(){
			if (this.isEdit) {
				this.isEdit = false;
				return true
			}
		},
		methods: {
			getListInfo() { // 第一次请求 || 下拉刷新
				let url = '';
				let pageNum = 1;
				switch(this.activity) {
					case 1:
						url = '/mu/provider/mapList';
						this.servicePageNum = pageNum;
						this.serviceNoData = false;
						break;
					case 2:
						url = '/mu/situation/list';
						this.roadPageNum = pageNum;
						this.roadNoData = false;
						break;
					case 3:
						url = '/mu/help/list';
						this.mutualPageNum = pageNum;
						this.mutualNoData = false;
						break;
				}
				let params = {
					pageNum: pageNum,
					pageSize: this.pageSize,
					isMyPublish: 1
				}
				let that = this;
				utils.postRequest(url, params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						switch(that.activity) {
							case 1:
								that.serviceList = res.rspBody.items;
								if(that.serviceList && that.serviceList.length == 0) {
									that.serviceNoData = true;
								}
								that.serviceList.map(val=>{
									val.facadeImageAry = val.facadeImgs ? val.facadeImgs.split(",") : [];
									var setDate = new Date(val.deadDt).getTime();
									var now = new Date().getTime();
									val.isGuoqi = setDate - now < 0;
								})
								that.serviceNoMore = false;
								break;
							case 2:
								that.roadList = res.rspBody.items;
								if(that.roadList && that.roadList.length == 0) {
									that.roadNoData = true;
								}
								that.roadList.map(val=>{
									val.facadeImageAry = val.facadeImage ? val.facadeImage.split(",") : [];
									var setDate = new Date(val.deadDt).getTime();
									var now = new Date().getTime();
									val.isGuoqi = setDate - now < 0;
								})
								that.roadNoMore = false;
								break;
							case 3:
								that.mutualList = res.rspBody.items;
								if(that.mutualList && that.mutualList.length == 0) {
									that.mutualNoData = true;
								}
								that.mutualList.map(val=>{
									val.facadeImageAry = val.facadeImage ? val.facadeImage.split(",") : [];
									var setDate = new Date(val.deadDt).getTime();
									var now = new Date().getTime();
									val.isGuoqi = setDate - now < 0;
								})
								that.mutualNoMore = false;
								break;
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
				uni.stopPullDownRefresh();
			},
			serviceOnLoad() { // 服务站懒加载
				if(this.serviceNoMore || this.isLoading) {
					return false;
				}
				this.isLoading = true;
				this.servicePageNum++;
				let params = {
					pageNum: this.servicePageNum,
					pageSize: this.pageSize,
					isMyPublish: 1
				}
				let that = this;
				utils.postRequest('/mu/provider/mapList', params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								var deadDt = items[i].deadDt;
								//判断是否过期
								var setDate = new Date(deadDt).getTime();
								var now = new Date().getTime();
								items[i].isGuoqi = setDate - now < 0;
								items[i].facadeImageAry = items[i].facadeImgs ? items[i].facadeImgs.split(",") : [];
								that.serviceList.push(items[i]);
							}
						}else {
							that.serviceNoMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			roadOnLoad() { // 路况懒加载
				if(this.roadNoMore || this.isLoading) {
					return false;
				}
				this.isLoading = true;
				this.roadPageNum++;
				let params = {
					pageNum: this.roadPageNum,
					pageSize: this.pageSize,
					isMyPublish: 1
				}
				let that = this;
				utils.postRequest('/mu/situation/list', params)
				.then(function (res) {
					console.log('路况懒加载数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						
						if(items && items.length > 0) {
							console.log('有数据', items);
							for(let i in items) {
								//判断是否过期
								var setDate = new Date(deadDt).getTime();
								var now = new Date().getTime();
								items[i].isGuoqi = setDate - now < 0;
								items[i].facadeImageAry = items[i].facadeImage ? items[i].facadeImage.split(",") : [];
								that.roadList.push(items[i]);
							}
						}else {
							console.log('无数据');
							that.roadNoMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			mutualOnLoad() { // 互助懒加载
				if(this.mutualNoMore || this.isLoading) {
					return false;
				}
				this.isLoading = true;
				this.mutualPageNum++;
				let params = {
					pageNum: this.mutualPageNum,
					pageSize: this.pageSize,
					isMyPublish: 1
				}
				let that = this;
				utils.postRequest('/mu/help/list', params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								//判断是否过期
								var setDate = new Date(deadDt).getTime();
								var now = new Date().getTime();
								items[i].isGuoqi = setDate - now > 0;
								items[i].facadeImageAry = items[i].facadeImage ? items[i].facadeImage.split(",") : [];
								that.mutualList.push(items[i]);
							}
						}else {
							that.mutualNoMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			changeActivity(flag) { // 切换选项卡
				this.activity = this.activity == flag ? this.activity : flag;
				uni.pageScrollTo({
				    scrollTop: 0,
				    duration: 300
				});
				switch(this.activity) {
					case 1:
						if(this.serviceList && this.serviceList.length == 0) {
							this.getListInfo();
						}
						if (this.serviceList.length > 0) {
							var serviceList = this.serviceList;
							serviceList.forEach(item => {
								item.isChecked = false
							})
							this.willDoMember = [];
							this.serviceList = serviceList;
						}
						break;
					case 2:
						if(this.roadList && this.roadList.length == 0) {
							this.getListInfo();
						}
						if (this.roadList.length > 0) {
							var roadList = this.roadList;
							roadList.forEach(item => {
								item.isChecked = false
							})
							this.willDoMember = [];
							this.roadList = roadList;
						}
						break;
					case 3:
						if(this.mutualList && this.mutualList.length == 0) {
							this.getListInfo();
						}
						if (this.mutualList.length > 0) {
							var mutualList = this.mutualList;
							mutualList.forEach(item => {
								item.mutualList = false
							})
							this.willDoMember = [];
							this.mutualList = mutualList;
						}
						break;
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
			getDistance(lat, lng){
				return utils.newGetDistance(lat, lng)
			},
			showBigImg(item, index) {
			    uni.previewImage({
					current: index,
					urls: item.facadeImageAry,
			    });
			},
			previewImage(res){
				var images = [];
				if(res.facadeImgs){
					images = res.facadeImageAry;
				} else{
					images.push(this.showDefaultImg(res.typeId));
				}
				uni.previewImage({
					urls: images,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			showLableMsg(item) {
				let labelMsg = '';
				for(let i in item.labelVOS) {
					labelMsg = item.labelVOS[i].labelName + '/' + labelMsg;
				}
				return labelMsg.substring(0, labelMsg.length - 1);
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
			showStatus(status, flag) {
				switch(status) {
					case 0:
						return flag == 'color' ? 'color:#777777;' : '已关闭';
					case 1:
						return flag == 'color' ? 'color:#0077FF;' : '已解决';
					case 2:
						return  flag == 'color' ? 'color:#E02020;' : '未解决';
				}
			},
			showStatusBc(status) {
				switch(status) {
					case 0:
						return 'border:1px solid rgba(119, 119, 119, 0.2);';
					case 1:
						return 'border:1px solid rgba(0, 119, 255, 0.52);';
					case 2:
						return 'border:1px solid rgba(224, 32, 32, 0.39);';
				}
			},
			jumpToDetails(item) {
				if (this.isEdit) {
					return;
				}
				switch(this.activity) {
					case 1:
						uni.navigateTo({
							url:'/pages/index/serviceDetails/newServiceDetails?id=' + item.id
						})
						break;
					case 2:
						uni.navigateTo({
							url: "/pages/roadCondition/roadDetails/newRoadDetails?id=" + item.id
						})
						break;
					case 3:
						uni.navigateTo({
							url: "/pages/mutual/detail/mutualDetails?id=" + item.id,
						})
						break;
				}
			},
			situationStatusLike(type, status, item, index){
				var that = this;
				this.selectId = item.id;
				if(!item.id){
					return;
				}
				if(type==1){
					console.log(item.isDisLiked);
					if(status==1 && item.isLiked == 1){//取消点赞
						that.situationLike(type, 1, 0, item, index);
					} else if(status==1 && item.isLiked == 0){//点赞
						if(item.isDisLiked == 1) {
							uni.showToast({
								title: '请取消倒赞后再进行操作！',
								icon: 'none'
							})
							return false;
						}
						that.situationLike(type, 1, 1, item, index);
					} else if(status==0 && item.isDisLiked == 1){
						that.situationLike(type, 0, 0, item, index);
					} else if(status==0 && item.isDisLiked == 0){
						if(item.isLiked == 1) {
							uni.showToast({
								title: '请取消点赞后再进行操作！',
								icon: 'none'
							})
							return false;
						}
						that.situationLike(type, 0, 1, item, index);
					}
				} else{
					if(status==1&&item.isLiked==1){
						that.situationLike(type, 1, 0, item, index);
					} else{
						that.situationLike(type, 1, 1, item, index);
					}
				}
			},
			situationLike(situationtype, type, num, item, index){
				var that = this;
				var data = {
					type: type,
					status: num,
					flag: situationtype,
					commonHtmlTitle: '新建收货地址',
				}
				if(situationtype == 1){
					data.situationId = that.selectId;
				} else{
					data.commentId = item.id;
				}
				console.log(data)
				utils.postRequest('/mu/situation/like/save', data)
				.then(res=>{
					console.log(res)
					if(res.retCode == "0000000"){
						//路况操作
						if(situationtype == 1){
							//点赞操作
							if(type==1 && num==1 && !item.isLiked){
								item.likeNum = item.likeNum + 1;
								item.isLiked = 1;
								console.log(item)
							} else if(type==1){
								item.likeNum = item.likeNum - 1;
								item.isLiked = 0;
							}
							if(type==0 && num==1 && !item.isDisLiked){
								item.dislikeNum = item.dislikeNum + 1;
								item.isDisLiked = 1;
								console.log(item)
							} else if(type==0){
								item.dislikeNum = item.dislikeNum - 1;
								item.isDisLiked = 0;
							}
							that.$forceUpdate();
							// that.getList('refresh');
						} else{
							//评论点赞
							// that.getList('refresh');
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
			doManagerEdit() {
				this.isEdit = true
			},
			cancel() {
				this.isEdit = false
			},
			deleteInfo() {
				var that = this;
				var willDoMember = this.willDoMember;
				if (willDoMember.length < 1) {
					uni.showToast({
						title: '请选中需删选的项',
						icon: 'none'
					})
					return
				}
				var idList = [], url = '';
				if(this.activity == 1) {
					url = "/mu/provider/remove"
				} else if (this.activity == 2) {
					url = "/mu/situation/remove"
				} else {
					url = "/mu/help/remove"
				}
				uni.showModal({
					content: '确定删除吗？',
					confirmText: '确定',
					cancelText: '取消',
					success: function(res) {
						if (res.confirm) {
							willDoMember.forEach(item => {
								idList.push(item.id)
							});
							
							console.log(idList, 'asa')
							uni.showLoading();
							utils.postRequest(url, {
								idList: idList
							})
							.then(re => {
								uni.hideLoading();
								if (re.retCode == '0000000') {
									uni.showToast({
										title: '删除成功',
										icon: 'none'
									});
									that.isEdit = false;
									that.willDoMember = [];
									
									that.getListInfo();
								} else {
									uni.showToast({
										title: re.retDesc,
										icon: 'none'
									});
								}
							}) 
							.catch(err => {
								uni.hideLoading();
								uni.showToast({
									title: re.retDesc,
									icon: 'none'
								});
							})
						}
					}
				})
			},
			backToFromPage() {
				uni.navigateBack({
					delta: 1
				})
			},
			toCheckMember(item, index) {
				var title = "";
				if (index == 1) {
					title = "已认证的服务站无法删除";
					if (item.verifiedStatus == 1) {
						uni.showToast({
							title: title,
							icon: 'none'
						})
						return;
					}
				}
				var serviceList = this.serviceList;
				var mutualList = this.mutualList;
				var roadList = this.roadList;
				var willDoMember = this.willDoMember;
				var willDoList = [];
				if (index == 1) {
					willDoList = serviceList
				} else if (index == 2){
					willDoList = roadList
				} else {
					willDoList = mutualList;
				}
				console.log(willDoList, item)
				
				
				var findIndex = willDoList.findIndex(atem => {
					return item.id == atem.id
				})
				var isChecked = willDoList[findIndex].isChecked;
				if (isChecked) {
					var index = willDoMember.findIndex(atem => {
						return atem.id == item.id;
					})
					willDoMember.splice(index, 1);
					willDoList[findIndex].isChecked = false
				} else {
					willDoList[findIndex].isChecked = true;
					willDoMember.push(item);
				}
				console.log(willDoList, 'assa')
				if (index == 1) {
					this.serviceList = willDoList;
				} else if (index == 2){
					this.roadList = willDoList
				} else {
					this.mutualList = willDoList;
				}
				this.willDoMember = willDoMember;
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss">
	.myRelease {
		height: 100%;
		background-color: #F2F2F2;
		.line {
			height: 10rpx;
			background-color: #F2F2F2;
			position: fixed;
			top:0;
			width:100%;
			z-index: 999;
		}
		.releaseHead {
			position: fixed;
			width:590rpx;
			z-index: 9999;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin:0 0 2rpx 0;
			border-top: 4px solid #F6F6F6;
			background-color: #FFFFFF;
			height: 90rpx;
			padding:0  80rpx;
			.headBtn {
				height: 42rpx;
				line-height: 42rpx;
				min-width:100rpx;
				font-size:30rpx;
				text-align: center;
			}
			.btnDefault {
				border-bottom:8rpx solid #FFF;
				color:#777;
				font-weight:400;
			}
			.btnChecked {
				border-bottom: 8rpx solid #FF8d02;
				color:#333;
				font-weight:500;
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
			padding:30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
                -webkit-animation: rotating 2s infinite;
                animation: rotating 2s infinite;
			}
		}
		.serviceModel {
			padding-top:210rpx;
			
			.serviceItem {
				position: relative;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				background-color: #FFFFFF;
				margin-bottom: 10rpx;
				transition: all .5s ease;
				overflow-x: hidden;
			}
			.serviceItem + .serviceItem {
				margin-top:10rpx;
			}
			.largeServiceBox {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 30rpx;
			}
			.contentAddress {
				display: flex;
				justify-content: flex-start;
				margin-top:12rpx;
				.addressIcon {
					width:26rpx;
					height: 30rpx;
					margin-right:10rpx;
					image {
						max-width:100%;
						max-height:100%;
					}
				}
				.addressMsg {
					flex: 1;
					line-height: 34rpx;
					font-size: 24rpx;
					color:#777;
				}
			}
			.serviceBox {
				background-color: #FFF;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				flex: 1;
				.serviceImg {
					width: 160rpx;
					height: 160rpx;
					border-radius: 2rpx;
					overflow: hidden;
					image {
						max-width:100%;
						max-height:100%;
					}
				}
				.serviceContent {
					flex: 1;
					padding-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-start;
					.contentTitleBox {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						width: 100%;
						.contentTitle {
							height: 44rpx;
							line-height: 44rpx;
							font-size: 32rpx;
							color:#333;
							font-weight:bold;
							width:200rpx;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						.commentsDistance {
							flex: 1;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: flex-end;
							.disTanceNum {
								font-size:24rpx;
								color:#777;
								line-height: 42rpx;
							}
							.disTanceMsg {
								font-size:24rpx;
								color:#FF7D4A;
								line-height: 42rpx;
							}
							.disTanceSyb {
								font-size:24rpx;
								color:#777;
								line-height: 42rpx;
							}
							.newnavigationIcon {
								width: 20rpx;
								height: 20rpx;
								margin-right:10rpx;
							}
						}
					}
					.newLabelBox {
						margin-top:10rpx;
						font-size:28rpx;
						color:#777;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.impressionList {
						min-height: 36rpx;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						flex-wrap: wrap;
						.impressionListLabel + .impressionListLabel {
							margin-left:10rpx;
						}
						.impressionListLabel {
							margin-top:10rpx;
							padding: 0 10rpx;
							height: 36rpx;
							line-height: 36rpx;
							font-size:24rpx;
							color:#333;
							background: #F6F6F6;
							border-radius: 4rpx;
						}
					}
				}
			}
			.roadBox + .roadBox {
				margin-top:10rpx;
			}
			.roadBox {
				flex: 1;
				display: flex;
				justify-content: space-between;
				padding: 20rpx 30rpx;
				background-color: #fff;
				box-sizing: border-box;
				transition: all .5s ease;
				&.active {
					transform: translateX(-110rpx);
				}
				.userAvatar {
					height:80rpx;
					width:80rpx;
					border-radius:100%;
				}
				.commentsContentBox {
					flex: 1;
					padding: 0 0 0 20rpx;
					.commentsSubStatus {
						padding-top: 10rpx;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						.headSubText {
							font-size: 26rpx;
							background-color: #AAAAAA;
							border-radius: 8rpx;
							color: #FFFFFF;
							height: 44rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							width: 100rpx;
						}
						.commentsStatusSyb {
							height: 42rpx;
							padding:0 10rpx;
							border-radius: 8rpx;
							margin-right:16rpx;
						}
						.commentsStatusSybMsg {
							line-height: 42rpx;
							font-size:26rpx;
						}
					}
					.commentsHead {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.commentsHeadNameBox {
							flex: 1;
							height: 42rpx;
							display: flex;
							justify-content: flex-start;
						}
						.commentsHeadName {
							font-size:30rpx;
							color:#507DAF;
							line-height: 42rpx;
							text-overflow: ellipsis;
						}
						.commentsDistance {
							display: flex;
							align-items: center;
						}
						.disTanceNum {
							font-size:24rpx;
							color:#777;
							line-height: 42rpx;
						}
						.disTanceMsg {
							font-size:24rpx;
							color:#FF7D4A;
							line-height: 42rpx;
						}
						.disTanceSyb {
							font-size:24rpx;
							color:#777;
							line-height: 42rpx;
						}
						.newnavigationIcon {
							width: 20rpx;
							height: 20rpx;
							margin-right:10rpx;
						}
					}
					.commentsBody {
						margin: 12rpx 0;
					}
					.commentsMsg {
						line-height: 34rpx;
						font-size: 28rpx;
						color:#333;
						text-overflow: ellipsis;
						lines: 2;
					}
					.commentsAddress {
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}
					.addressIcon {
						width:20rpx;
						height:24rpx;
						margin-right:10rpx;
						image {
							max-width:100%;
							max-height:100%;
						}
					}
					.addressMsg {
						line-height: 36rpx;
						font-size:26rpx;
						color:#777;
						text-overflow: ellipsis;
						lines: 1;
						flex: 1;
					}
					.commentsImageBox {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin:20rpx 0 0 0;
					}
					.commentsImageList {
						width:100rpx;
						height:100rpx;
						margin-right: 10rpx;
					}
					.commentsFoot {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin:20rpx 0 0 0;
						.commentsTime {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							height: 34rpx;
						}
						.commentsTimeIcon {
							width:22rpx;
							height: 22rpx;
							margin-right:10rpx;
						}
						.commentsTimeMsg {
							line-height: 34rpx;
							font-size: 24rpx;
							color:#aaa;
						}
						.commentsStatus {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							height: 34rpx;
						}
						.commentsStatusBox {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							height: 34rpx;
						}
						.commentsStatusIcon {
							width: 24rpx;
							height: 24rpx;
							margin-right:10rpx;
						}
						.commentsStatusMsg {
							line-height: 34rpx;
							font-size: 24rpx;
							color:#aaa;
						}
					}
				}
			}
		}
	}
	.noData-box{
		width: 750rpx; 
		display: flex; 
		flex-direction: column; 
		color: #777; 
		align-items: center; 
		justify-content: center;
		background-color: #FFF;
	}
	.noData{
		width: 400rpx;
		margin-bottom: 30rpx;
	}
	.newHeader {
		width: 750rpx;
		background: #FFFFFF;
		position: fixed;
		z-index: 9999;
		top: 0;
		.headContent {
			height: 35px;
			font-size:34rpx;
			color:#333;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
		}
		.headBox {
			height: 35px;
			font-size:34rpx;
			font-weight: 500;
			color:#333;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
			.uniIcon {
				width: 22rpx;
				height: 40rpx;
		
			}
			.memberEditIcon {
				width: 33rpx;
				height: 31rpx;
			}
		}

	}
	
	.checkMemberBox {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: -110rpx;
		top: 0;
		z-index: 999;
		height: 100%;
		width: 110rpx;
		overflow: hidden;
		transition: all .5s ease;
		&.active {
			transform: translateX(-110rpx);
		}
		.btnDefault {
			width: 32rpx;
			height: 32rpx;
			border: 2rpx solid #FFFFFF;
			border-radius:100%;
		}
		.btnChecked {
			width: 36rpx;
			height: 36rpx;
		}
	}
</style>
