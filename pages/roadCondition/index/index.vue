<template>
	<view>
		<view class="service-head" :style="{'margin-top':barHeight+'px'}">
			<view class="searchBox" @click="jumpToSearch()">
				<image src="../../../static/images/search.png" mode="widthFix" class="search-img"></image>
				搜索地址
			</view>
			<view class="addServiceBtn" @click="goReleaseRoad">
				<image src="/static/images/addW.png" mode="widthFix" class="add-img"></image>
				上报
			</view>
			<!-- <view class="search-content">
				<input type="text" :value="keyword"  class="search-input" @confirm="getList('refresh')" @input="inputName" />
				<image src="../../../static/images/search.png" mode="widthFix" class="search-img"></image>
				<view class="search-btn">
					<view class="line">
					</view>
					<view class="search-text" @click="getList('refresh')">
						搜索
					</view>
				</view>
			</view>
			<view class="search-add" @click="goReleaseRoad">
				<image src="/static/images/add.png" mode="widthFix" class="add-img"></image>
				发布
			</view> -->
		</view>
		<!-- <scroll-view scroll-x="true" class="kite-classify-scroll">
			<view :class="[index==typeListArr.length-1?'margin-box':'', 'type-box']" v-for="(item, index) in typeListArr" @click="typeEvent(item.id)">
				<view :class="[typeId==item.id?'weight-box':'', 'type-name']">
					{{item.typeName}}
				</view>
				<view v-if="typeId==item.id" class="select-type"></view>
			</view>
			<image class="type-img" src="" mode="widthFix"></image>
		</scroll-view> -->
		<view class="newScrollBox">
			<view :class="[index==typeListArr.length-1?'margin-box':'', 'type-box']" v-for="(item, index) in typeListArr" @click="typeEvent(item.id)">
				<view :class="[typeId==item.id?'weight-box':'', 'type-name']">
					{{item.typeName}}
				</view>
				<view v-if="typeId==item.id" class="select-type"></view>
			</view>
			<image class="type-img" src="" mode="widthFix"></image>
		</view>
		<view class="tabsAll">
			<view class="screen-child1" @click="selectTap">
				<text class="screen-font">{{sofActive}}</text>
				<image mode="widthFix" class="screen-img" src="/static/images/dropDown.png"></image>
			</view>
			<view class="screen-child2" @click="mapTap">
				<text class="screen-font">{{!mapShow?'显示地图':'列表查看'}}</text>
			</view>
		</view>
		<scroll v-show="!mapShow" :triggered="triggered" :top-size="topSize" @refresh="refresh" @restore="restore" @more="more">
			<view class="dataHas" v-if="listArr.length == 0" :style="{height: contentHeight}">
				<image src="../../../static/images/noData.png" class="noData" mode="widthFix"></image>
				暂无数据
			</view>
			<view class="content-box" v-for="(item, index) in listArr">
				<view class="content-head">
					<view :class="[item.facadeImage?'width-box':'width-box1']" @click="goRoadDetails(item)">
						<view class="user-box">
							<image class="user-img" :src="item.avatar?item.avatar:'../../../static/logo.png'"></image>
							<view class="user-content">
								<view class="user-name">{{item.userName?item.userName:'匿名用户'}}</view>
								<view class="time-box">
									<view style="width: 100rpx;">{{item.dateDesc}}</view>
									<view class="address-box">
										<image class="address-img" src="../../../static/images/address.png" mode="widthFix">
										</image>
										<view class="address-text">{{item.address}}</view>
									</view>
								</view>
							</view>
						</view>
						<text class="content-text">
							<text class="content-prominent">#<text v-for="(child, index) in item.labelVOS">{{child.labelName}}{{index!=item.labelVOS.length-1?',':''}}</text>#</text>
							<text>{{item.description}}</text>
						</text>
					</view>
					<view v-if="item.facadeImage">
						<image class="service-img" :src="item.facadeImage" @click="previewImage(item)"></image>
					</view>
				</view>
				<view class="operation-box">
					<view class="operation-child" @click="situationStatusLike(1, 1, item)">
						<image class="operation-img" :src="item.isLiked==1?'/static/images/already.png':'/static/images/praise.png'"></image>
						<view class="">{{item.likeNum}}</view>
					</view>
					<view class="operation-child" @click="situationStatusLike(1, 0, item)">
						<image class="operation-img" :src="item.isDisLiked==1?'/static/images/badReview.png':'/static/images/stepOn.png'"></image>
						<view class="">{{item.dislikeNum}}</view>
					</view>
					<view class="operation-child" @click="sendCallback(item.id)">
						<image class="operation-img" src="../../../static/images/comments.png"></image>
						<view class="">{{item.commentNum}}</view>
					</view>
				</view>
			</view>
			<view class="more-Box" v-if="noMore">没有更多了～</view>
		</scroll>
		<view v-show="mapShow">
			<view class="maps" :style="{height:mapHeight}">
				<map class="map" :style="{height: mapHeight}" id="map" :longitude="longitude" :latitude="latitude"
					show-location="true" enable-rotate="false" @markertap="makertap" :markers="markers" @regionchange="bindregionchange">
					<cover-image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/locationOpt.png" @click="locationCenter" class="locationCenter"></cover-image>
					
				</map>
			</view>
			
			<view class="content-bottom">
				<view class="content-head">
					<view :class="[selectMarkers.facadeImage?'width-box':'width-box1']" @click="goRoadDetails(selectMarkers)">
						<view class="user-box">
							<image class="user-img" :src="selectMarkers.avatar?selectMarkers.avatar:'../../../static/logo.png'"></image>
							<view class="">
								<view class="user-name">{{selectMarkers.userName?selectMarkers.userName:'匿名用户'}}</view>
								<view class="time-box">
									<view class="">{{selectMarkers.dateDesc}}</view>
									<view class="address-box">
										<image class="address-img" src="../../../static/images/address.png" mode="widthFix">
										</image>
										<view class="address-text">{{selectMarkers.address}}</view>
									</view>
								</view>
							</view>
						</view>
						<text class="content-text">
							<text class="content-prominent">#<text v-for="(child, index) in selectMarkers.labelVOS">{{child.labelName}}{{index!=selectMarkers.labelVOS.length-1?',':''}}</text>#</text>
							<text>{{selectMarkers.description}}</text>
						</text>
					</view>
					<view v-if="selectMarkers.facadeImage">
						<image class="service-img" :src="selectMarkers.facadeImage" @click="previewImage(selectMarkers)"></image>
					</view>
				</view>
				<view class="operation-box">
					<view class="operation-child" @click="situationStatusLike(1, 1, selectMarkers)">
						<image class="operation-img" :src="selectMarkers.isLiked==1?'/static/images/already.png':'/static/images/praise.png'"></image>
						<view class="">{{selectMarkers.likeNum}}</view>
					</view>
					<view class="operation-child" @click="situationStatusLike(1, 0, selectMarkers)">
						<image class="operation-img" :src="selectMarkers.isDisLiked==1?'/static/images/badReview.png':'/static/images/stepOn.png'"></image>
						<view class="">{{selectMarkers.dislikeNum}}</view>
					</view>
					<view class="operation-child" @click="sendCallback(selectMarkers.id)">
						<image class="operation-img" src="../../../static/images/comments.png"></image>
						<view class="">{{selectMarkers.commentNum}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="release-box" @click="goReleaseRoad">
			<image class="release-img" src="/static/images/release.png"></image>
		</view> -->
		<!-- 评论输入框 -->
		<uni-comments :commit="commit"  @submit="submit" v-if="commit"></uni-comments>
	</view>
</template>

<script>
	import scroll from "../../../components/scroll1/scroll1.vue";
	import * as utils from "@/utils/service.js";
	var app = getApp();
	export default {
		data() {
			return {
				sofActive: '150km',
				barHeight: 25,
				latitude: 31.112873,
				longitude: 121.38176,
				scale: 10,
				markers: [],
				markersDataNotShow: "",
				subNvue: '',
				show: false,
				mapShow: true,
				triggered: true,
				_freshing: false,
				listArr: [],
				pageSize: 10,
				pageNum: 1,
				total: 0, //总条数
				noMore: false, //没有更多了
				typeListArr: [],
				typeId: '',
				distanceLimit: 100,
				mapCtx: null,
				selectMarkers: {},
				keyword: '',
				commit: false,
				selectId: '',
			}
		},
		components: {
			scroll
		},
		onShow() {
			var subNVue = uni.getSubNVueById('popup');
			subNVue.hide();
		},
		onLoad() {
			var that = this;
			uni.$on("hideKeyBoard", () => {
				this.commit = false
			})
			uni.onKeyboardHeightChange(res => {
				console.log(res)
				if (res.height == 0) {
					this.commit = false
				}
			})
			// #ifdef APP-PLUS
			var statusBarHeight = plus.navigator.getStatusbarHeight();
			var hasNotchInScreen = plus.navigator.hasNotchInScreen();
			console.log(statusBarHeight);
			this.barHeight = statusBarHeight;
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
			var platform = uni.getSystemInfoSync().platform;
			console.log(platform, '位置11')
			if (platform == "android") {
				if (hasNotchInScreen) {
					var height = (uni.getSystemInfoSync().windowHeight - 258 - 50)*2 + 'rpx';
				} else {
					var height = (uni.getSystemInfoSync().windowHeight - 258)*2 + 'rpx';
				}
				
			} else {
				var height = (uni.getSystemInfoSync().windowHeight - 252 - statusBarHeight)*2 + 'rpx';
			}
			var topSize = (statusBarHeight + 120)*2 + 'rpx'
			this.mapHeight = height;
			this.contentHeight = (height + 128)*2 + 'rpx'
			this.topSize = topSize;
			that.mapCtx = uni.createMapContext('map');
			this.subNVue = uni.getSubNVueById('popup'); // 通过 id 获取 nvue 子窗体 
			uni.$on('page-popup', (data) => {
				console.log(data)
				that.distanceLimit = data.item.value;
				that.sofActive = data.item.name
				console.log(that.distanceLimit, 'asad1');
				this.getList('refresh');
			})
			this.longitude = app.globalData.longitude;
			this.latitude = app.globalData.latitude;
			console.log(this.longitude, this.latitude, '撒打算')
			this.getList('refresh');
			this.getTypeList();
		},
		methods: {
			locationCenter() {
				//回到定位中心
				this.mapCtx.moveToLocation();
			},
			selectTap() {
				const subNVue = uni.getSubNVueById('popup');
				subNVue.show();
				
			},
			mapTap() {
				const subNVue = uni.getSubNVueById('popup');
				subNVue.hide();
				this.mapShow = !this.mapShow
			},
			situationStatusLike(type, status, item){
				var that = this;
				this.selectId = item.id;
				if(!item.id){
					return;
				}
				if(type==1){
					if(status==1 && item.isLiked == 1){
						that.situationLike(type, 1, 0);
					} else if(status==1 && item.isLiked == 0){
						that.situationLike(type, 1, 1);
					} else if(status==0 && item.isDisLiked == 1){
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
			situationLike(situationtype, type, num, id){
				var that = this;
				var data = {
					type: type,
					status: num,
					flag: situationtype,
				}
				if(situationtype == 1){
					data.situationId = that.selectId;
				} else{
					data.commentId = id;
				}
				console.log(data)
				utils.postRequest('/mu/situation/like/save', data)
				.then(res=>{
					if(res.retCode == "0000000"){
						//路况操作
						if(situationtype == 1){
							//点赞操作
							that.getList('refresh');
						} else{
							//评论点赞
							that.getList('refresh');
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
			blur() {
				this.commit = false
			},
			sendCallback(id) {
				//回复评论
				this.commit = true;
				this.selectId = id
				console.log('kkkkkkk')
			},
			submit(val) {
				console.log('发送', val)
				var that = this;
				if (!val) {
					uni.showToast({
						title: '评论不能为空',
						icon: 'none'
					})
					return;
				}
				this.commit = false;
				utils.postRequest('/mu/situation/comment/save', {
					situationId: this.selectId,
					content: val
				})
				.then(res=>{
					if(res.retCode=="0000000"){
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						})
						that.getList('refresh');
						//评论后更新数量
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
			inputName(e) {
				this.keyword = e.detail.value;
			},
			makertap: function(e) {
				var id = e.detail.markerId;
				var that = this;
				that.detail(id);
				
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
					userId: userId
				})
				.then(res=>{
					if(res.retCode=="0000000"){
						that.selectMarkers = res.rspBody
					} else{
						uni.showToast({
							title: res.retDesc
						})
					}
				})
				.catch(err=>{
					
				})
			},
			bindregionchange(e) {
				var that = this;
				var markersDataNotShow = this.listArr;
				var markers = this.markers;

				if (markersDataNotShow.length < 1) {
					return;
				}
				that.mapCtx.getRegion({
					success: function(res) {
						var northeast = res.northeast;
						var southwest = res.southwest;

						for (var i = 0; i < markersDataNotShow.length; i++) {
							if (southwest.latitude < markersDataNotShow[i].latitude && northeast.latitude >
								markersDataNotShow[i].latitude &
								southwest.longitude < markersDataNotShow[i].longitude && northeast.longitude >
								markersDataNotShow[i].longitude
							) {
								markers.push(markersDataNotShow[i]);
								markersDataNotShow.splice(i, 1);
							}
						}
						that.markers = markers;
						console.log(markers)
						that.markersDataNotShow = markersDataNotShow;
					}
				});
			},
			getTypeList(){
				var that = this;
				utils.postRequest('/mu/situationType/list')
				// utils.postRequest('/mu/situationLabel/selectByTypeId')
				.then(res=>{
					uni.$emit('page-top', 36+45+this.barHeight);
					if(res.retCode == "0000000"){
						res.rspBody.unshift({id: '', typeName: '全部'})
						that.typeListArr = res.rspBody;
						uni.$emit('list-popup', res.rspBody);
					} else{
						
					}
				})
				.catch(err=>{
					uni.$emit('page-top', 36+45+this.barHeight);
					console.log(err);
				})
			},
			typeEvent(id){
				this.typeId = id;
				this.getList('refresh');
			},
			getList(type){
				var that = this;
				var user = uni.getStorageSync("userInfo");
				
				var data = {
					pageSize: that.pageSize,
					pageNum: that.pageNum,
					typeId: that.typeId,
					distanceLimit: that.distanceLimit,
					longitude: that.longitude,
					latitude: that.latitude,
					keyword: that.keyword,
				};
				if (user) {
					var userInfo = JSON.parse(user);
					data.userId = userInfo.userId
				}
				console.log(data)
				utils.postRequest('/mu/situation/list', data)
				.then(res=>{
					console.log('路况icon',res)
					uni.$emit('page-top', 36+45+this.barHeight);
					that.triggered = false;
					that._freshing = false;
					if(res.retCode == "0000000"){
						if(type == 'refresh'){
							that.listArr = res.rspBody.items;
						} else{
							that.listArr = that.listArr.concat(res.rspBody.items);
						}
						that.total = res.rspBody.total;
						if(that.listArr[0]){
							that.selectMarkers =  that.listArr[0];
						}
						var markers = []
						console.log('标记点', that.listArr);
						//当前位置也要添加到地图marker
						var locationMy = [{
							iconPath: "/static/images/locationMy.png",
							width: 70,
							height: 70,
							longitude: that.longitude,
							latitude: that.latitude,
						}];
						that.markers = that.listArr.concat(locationMy);
					} else{
						console.log('hhhhhhhhhh')
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				})
				.catch(err=>{
					console.log(err);
					console.log('hhhhhhhhhh1111111')
					uni.$emit('page-top', 36+45+this.barHeight);
				})
			},
			previewImage(res){
				var images = [res.facadeImage];
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
				this.getList('refresh');
			},
			more(){
				if(this.total == this.listArr.length){
					this.noMore = true;
					return;
				}
				// console.log('上拉加载');
				this.pageNum = this.pageNum + 1;
				this.getList('more');
			},
			goReleaseRoad() {
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
				var isDriveAC = JSON.parse(userInfo).attrs.driverVerify;
				if (!isDriveAC) {
					uni.showModal({
						title: '请认证驾驶证',
						content: '货运中国社区只允许真实卡友发布信息，您必须认证驾驶证和行驶证后，才能使用发布功能。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../../my/driverVerify/newDriverVerify'
								})
							}
						}
					})
					return false;
				} 
				var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
				if (!vehicleVerify) {
					uni.showModal({
						title: '请认证行驶证',
						content: '货运中国社区只允许真实卡友发布信息，您必须认证驾驶证和行驶证后，才能使用发布功能。',
						confirmText: '去认证',
						cancelText: '再看看',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../../my/carVerify/newCarVerify'
								})
							}
						}
					})
					return false;
				}
				uni.navigateTo({
					url: "/pages/roadCondition/releaseRoad/releaseRoad"
				})
			},
			goRoadDetails(item) {
				uni.navigateTo({
					url: "/pages/roadCondition/roadDetails/roadDetails?id=" + item.id
				})
			},
			jumpToSearch() {
				let query = '?type=' + 'roadCondition'
				uni.navigateTo({
					url:'/pages/search/search' + query
				})
			}
		}
	}
</script>

<style>
	.all-box {
		background-color: #000;
		opacity: 0.4;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.top {
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 20rpx;
		box-sizing: border-box;
	}
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		display: none;
	}
	.kite-classify-scroll{
		padding-left:0rpx;
		overflow: hidden;
	 	white-space: nowrap;
		text-align: center;
	}
	.type-box{
		align-items: center;
		font-size: 30rpx;
		color: #333;
		display: inline-block;
		position: relative;
	}
	.type-img{
		width: 30rpx;  
		position: fixed;
		padding: 30rpx 0;
		right: 0;
		background-color: #fff;
	}
	.margin-box{
		margin-right: 40rpx;
	}
	.type-name{
		padding: 0 30rpx;
		height: 88rpx;
		line-height: 88rpx;
	}
	.weight-box{
		font-weight: bold;
	}
	.select-type{
		background-color: #0077FF;
		height: 8rpx;
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 99;
	}

	.screen-img {
		width: 20rpx;
		margin-right: 10rpx;
	}

	.display-none {
		display: none;
	}
	.content-box {
		padding: 20rpx 30rpx;
		z-index: -1;
		background-color: #fff;
	}
	.content-bottom {
		height: 256rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}

	.content-head {
		display: flex;
		justify-content: space-between;
	}
	.width-box{
		width: 480rpx;
	}
	.width-box1{
		width: 680rpx;
	}

	.user-box {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.user-img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		margin-right: 20rpx;
	}

	.user-name {
		font-size: 26rpx;
		color: #333333;
	}

	.user-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}
	.time-box {
		display: flex;
		font-size: 22rpx;
		padding: 20rpx 0;
		color: #777;
	}

	.address-box {
		display: flex;
		align-items: center;
		margin-left: 30rpx;
		width: 250rpx;
	}

	.address-img {
		width: 20rpx;
	}
	.address-text{
		width: 300rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.service-img {
		width: 172rpx;
		height: 116rpx;
	}

	.content-text {
		font-size: 30rpx;
		color: #333;
		line-height: 40rpx;
	}

	.content-prominent {
		color: #0077FF;
		flex-wrap: wrap;
	}

	.operation-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 24rpx;
	}

	.operation-child {
		display: flex;
		align-items: center;
		color: #AAAAA0;
		font-size: 30rpx;
		margin-left: 58rpx;
	}

	.operation-img {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	.release-box{
		position: fixed;
		bottom: 10rpx;
		right: 22rpx;
	}
	.release-img{
		width: 96rpx;
		height: 96rpx;
	}
	.more-Box{
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
	}
	.service-head{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		flex: 1;
	}
	.search-content {
		display: flex;
		flex-direction: row;
		flex: 1;
		position: relative;
		overflow: hidden;
	}
	.search-input {
		border: 1px solid #0077FF;
		border-radius: 10rpx;
		flex: 1;
		height: 72rpx;
		line-height: 72rpx;
		padding: 0 100rpx 0 60rpx;
		background-color: #fff;
		opacity: 0.7;
	}
	.search-btn {
		position: absolute;
		right: 0;
		top: 0;
		height: 72rpx;
		z-index: 99;
		width: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	/* .search-img {
		width: 32rpx;
		position: absolute;
		left: 20rpx;
		top: 20rpx;
		z-index: 99;
	} */
	.search-add {
		width: 120rpx;
		height: 52rpx;
		margin-left: 40rpx;
		border: 1px solid #0077FF;
		border-radius: 26rpx;
		display: flex;flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		font-weight: bold;
		font-size: 26rpx;
	}
	.add-img {
		width: 24rpx;
		margin-right: 10rpx;
	}
	.line {
		height: 42rpx;
		width: 1px;
		background-color: #0077FF;
	}
	.search-text {
		flex: 1;
		justify-content: center;
		align-items: center;
		display: flex;
		font-size: 28rpx;
		padding: 0 20rpx;
	}
	.tabsAll {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		padding: 0 40rpx;
		background-color: #fff;
	}
	.screen-child1{
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.screen-child2{
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}
	.screen-img{
		width: 20rpx;
		margin-right: 10rpx;
	}
	.screen-font{
		color: #333;
		font-size: 28rpx;
		font-weight: bold;
	}
	.map {
		width: 100%;
	}
	.locationCenter {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		width: 50rpx;
		height: 50rpx;
	}
	.dataHas {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #666;
		background-color: #fff;
		width: 100%;
	}
	.noData {
		width: 400rpx;
		margin-bottom: 30rpx;
	}
	.newScrollBox {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.searchBox {
		border-radius: 32rpx;
		background: rgba(245, 246, 246, 0.75);
		padding: 0 0 0 26rpx;
		height: 64rpx;
		line-height: 64rpx;
		flex: 1;
		font-size:28rpx;
		color:#aaa;
	}
	.search-img {
		width: 36rpx;
		height:36rpx;
		margin-bottom: -10rpx;
		margin-right:18rpx;
		/* position: absolute; */
		/* left: 20rpx;
		top: 20rpx;
		z-index: 99; */
	}
	.addServiceBtn {
		background: #FF7D4A;
		padding: 0 0 0 26rpx;
		padding:0 24rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 32rpx;
		font-size:28rpx;
		color:#FFF;
		margin-left: 40rpx;
		display: flex;
		align-items: center;
	}
</style>
