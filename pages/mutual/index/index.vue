<template>
	<view class="container">
	
		<view class="searchBar" :style="{'padding-top':barHeight+'px'}">
			<view class="search-content">
				<input type="text" v-model="params.searchWord" @confirm="searchKeyWord" class="search-input" />
				<image src="../../../static/images/search.png" mode="widthFix" class="search-img"></image>
				<view class="close-search" @click="clearInput" v-if="params.searchWord">
					<image src="../../../static/images/search-close.png" mode="widthFix" class="search-close"></image>
				</view>
				<view class="search-btn" @click="searchKeyWord">
					<view class="line">
					</view>
					<view class="search-text">
						搜索
					</view>
				</view>
			</view>
			<view class="search-add" @click="pub">
				<image src="../../../static/images/add.png" mode="widthFix" class="add-img"></image>
				发布
			</view>
		</view>
		<scroll-view scroll-x="true" class="kite-classify-scroll" show-scrollbar="false">
			<view :class="[index==typeArr.length-1?'margin-box':'', 'type-box']" v-for="(item, index) in typeArr" @click="switchTabs(index)">
				<view :class="[item.active ?'weight-box':'', 'type-name']">
					{{item.typeName}}
				</view>
				<view v-if="tabIndex==index" class="select-type"></view>
			</view>
			<image class="type-img" src="/static/images/icon_right.png" mode="widthFix"></image>
		</scroll-view>
		<view class="tabsAll">
			<view class="screen-child1" @click="selectTap2">
				<text class="screen-font">{{sofActive}}</text>
				<image mode="widthFix" class="screen-img" src="/static/images/dropDown.png"></image>
			</view>
			<view class="screen-child2" @click="mapTap">
				<text class="screen-font">{{!mapShow?'显示地图':'列表查看'}}</text>
			</view>
		</view>
		<view v-show="!mapShow">
			<scroll :triggered="triggered" :top-size="topSize" @refresh="refresh" @restore="restore" @more="more">
				<view class="dataHas" v-if="avatarList.length == 0 && loadComplete" :style="{height: contentHeight}">
					<image src="../../../static/images/noData.png" class="noData" mode="widthFix"></image>
					暂无数据
				</view>
				<view class="" v-else>
					<view v-for="(item, index) in avatarList" :key="index" @click="goDetail(item)">
						<view class="list">
							<view class="list-body">
								<view class="list-body-content">
									<view class="list-title">
										<view class="list-avatar">
											<image :src="item.avatar" class="avatar" v-if="item.avatar"></image>
											<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/track.png" mode="" class="avatar" v-else></image>
											<view class="avatar-text">
												<view class="avatar-title-text">
													<text>{{item.userName ? item.userName : '匿名用户'}}</text>
												</view>
												<view class="hour">
													<view class="subDate"><text class="subColor">{{item.dateDesc}}</text></view>
													<view class="subAddress">
														<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/address.png" class="address-icon" mode="widthFix"></image>
														<text class="subColor" style="color: #0077FF;">距离{{item.upvoteNum}}km</text>
													</view>
					
												</view>
											</view>
										</view>
									</view>
									<text class="list-mid-text">
										<text class="font-14 color-paragraph typeName">#{{item.typeName}}#</text>
										<text class="font-14">{{item.description}}</text>
									</text>
								</view>
								<view class="list-body-img">
									<view class="color-tips font-12 tips" :class="{'active': item.solveFlag == 1 || item.solveFlag == 0}">
											<view class="tips-text" v-if="item.solveFlag == 1">已解决</view>
											<view class="tips-text" v-else-if="item.solveFlag == 2">未解决</view>
											<view class="tips-text" v-else>已关闭</view>
											<view class="tips-line">
												<view class="tips-line-1">
													
												</view>
												<view class="tips-line-2">
													
												</view>
											</view>
									</view>
									<image :src="item.facadeImage" class="img" v-if="item.facadeImage" @click.stop="previewImage(item)"></image>
								</view>
							</view>
								
							<view class="list-bottom">
								<view class="list-bottom-left">
									<image src="../../../static/images/address.png" class="location-icon" mode="widthFix"></image>
									<view class="font-12 color-paragraph distance" style="color: #777; width: 500rpx; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
										{{item.address}}
									</view>
								</view>
								<view class="list-bottom-right">
									<view class="hang font-12 color-main">
										{{item.commentCount || 0}}帮助
									</view>
								</view>
							</view>
						</view>	
					</view>
					<view class="more-Box" v-if="noMore">没有更多了～</view>
				</view>
			</scroll>
		</view>
		<view v-show="mapShow" class="maps-content">
			<view class="">
				<view class="maps" :style="{height:mapHeight}">
					<map 
						id="map"
						:style="{height:mapHeight}" 
						class="map" 
						:latitude="latitude" 
						:longitude="longitude" 
						:markers="markers"
						@markertap="markertap"
					>
					<cover-image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/locationOpt.png" @click="locationCenter" class="locationCenter"></cover-image>
					
					</map>
				</view>
				<view class="listMap" v-if="avatarListOne" @click="makerToDetail">
					<view class="list">
						<view class="list-body">
							<view class="list-body-content">
								<view class="list-title">
									<view class="list-avatar">
										<image :src="avatarListOne.avatar" class="avatar" v-if="avatarListOne.avatar"></image>
										<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/track.png" class="avatar" v-else></image>
										<view class="avatar-text">
											<view class="avatar-title-text">
												<text>{{avatarListOne.userName ? avatarListOne.userName : '匿名用户'}}</text>
											</view>
											<view class="hour">
												<view class="subDate"><text class="subColor">{{avatarListOne.dateDesc}}</text></view>
												<view class="subAddress">
													<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/address.png" class="address-icon" mode="widthFix"></image>
													<text class="subColor" style="color: #0077FF;">距离{{avatarListOne.upvoteNum}}km</text>
												</view>
									
											</view>
										</view>
									</view>
								</view>
								<text class="list-mid-text">
									<text class="font-13 color-paragraph typeName">#{{avatarListOne.typeName}}#</text>
									<text class="font-13">{{avatarListOne.description}}</text>
								</text>
							</view>
							<view class="list-body-img">
								<view class="color-tips font-12 tips" :class="{'active': avatarListOne.solveFlag == 1 || avatarListOne.solveFlag == 0}">
										<view class="tips-text" v-if="avatarListOne.solveFlag == 1">已解决</view>
										<view class="tips-text" v-else-if="avatarListOne.solveFlag == 2">未解决</view>
										<view class="tips-text" v-else>已关闭</view>
										<view class="tips-line">
											<view class="tips-line-1">
												
											</view>
											<view class="tips-line-2">
												
											</view>
										</view>
								</view>
								<image :src="avatarListOne.facadeImage" class="img" v-if="avatarListOne.facadeImage"></image>
							</view>
						</view>
							
						<view class="list-bottom">
							<view class="list-bottom-left">
								<image src="../../../static/images/address.png" class="location-icon" mode="widthFix"></image>
								<view class="font-12 color-paragraph distance" style="color: #777;width: 500rpx; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
									{{avatarListOne.address}}
								</view>
							</view>
							<view class="list-bottom-right">
								<view class="hang font-12 color-main" v-if="avatarListOne.solveFlag !== 1">
									{{avatarListOne.commentCount || 0}}帮助
								</view>
								<view class="hang font-12 color-main" v-else>
									去帮助
								</view>
							</view>
						</view>
					</view>	
				</view>	
			</view>
		</view>
	</view>
</template>

<script>
	import scroll from "@/components/scroll1/scroll1.vue"
	import {postRequest} from "../../../utils/service.js";
	import * as utils from "@/utils/service.js";
	export default {
		data() {
			return {
				scale: 10,
				typeArr: [],
				typeNameActive: '全部分类',
				sofActive: '未解决',
				avatarListOne: null,
				tabIndex: 0,
				topSize: '0',
				typeArr: [],
				barHeight: 25,
				isShow: false,
				mapShow: true,
				triggered: true,
				_freshing: false,
				defaultIndex:[0,0],
				loadComplete: false,
				avatarList: [],
				id:0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 39.909,
				longitude: 116.39742,
				markers: [],
				params: {
					pageSize: 10,
					pageNum: 1,
					typeId: '',
					latitude: '',
					longitude: '',
					solveFlag: 2,
					searchWord: '',
				},
				total: 0,
				noMore: false,
				
			}
		},
		components: {
			scroll
		},
		//页面滚动到底部的事件
		onReachBottom(){
		 //下拉刷新
			console.log('滚动到底部')
		},
		computed: {
			marker() {
				return this.markers.slice(0)
			}
		},
		onShow() {
			
			var subNVue = uni.getSubNVueById('popup2');
			subNVue.hide();
		},
		onLoad() {
			var _this = this;
			this.mapContext = uni.createMapContext('map');
			this.loadComplete = false;
			// #ifdef APP-PLUS
			var statusBarHeight = plus.navigator.getStatusbarHeight();
			this.barHeight = statusBarHeight;
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
			//获取所有的分类
			postRequest('/mu/helptype/find')
			.then(res => {
				console.log(res)
				if (res.retCode == "0000000") {
					var arr = [{
						typeName: '全部',
						active: true
					}]
					this.typeArr = arr.concat(res.rspBody);
				}
			}).catch(err => {
				console.log(err)
			})
			this.query('refresh');
			var platform = uni.getSystemInfoSync().platform;
			var hasNotchInScreen = plus.navigator.hasNotchInScreen();
			console.log(hasNotchInScreen, '是否是刘海平')
			if (platform == "android") {
				if (hasNotchInScreen) {
					var height = (uni.getSystemInfoSync().windowHeight - 258 - 50);
				} else {
					var height = (uni.getSystemInfoSync().windowHeight - 258);
				}
				
			} else {
				var height = (uni.getSystemInfoSync().windowHeight - 252 - statusBarHeight);
			}
			
			var topSize = (statusBarHeight + 120)*2 + 'rpx'
			console.log(uni.getSystemInfoSync().windowHeight)
			this.mapHeight = height*2 + 'rpx';
			this.topSize = topSize;
			this.contentHeight = (height + 128)*2 + 'rpx'
			uni.$on('refreshData_mutual',() => {
					this.query('refresh');
				})
			uni.$on('page-popup2', (data) => {
				var index = data.index;
				var item = data.item;
				console.log(data, 'aca')
				if (index == 1) {
					var value = data.item.value;
					if (value == 3) {
						this.params.solveFlag && delete this.params.solveFlag
					} else {
						this.params.solveFlag = data.item.value;
					}
					this.sofActive = data.item.name;
				} else {
					this.params.typeId = data.item.id
				}
				console.log('jhhhhhhhh', data)
				this.query('refresh');
				var subNVue = uni.getSubNVueById('popup2');
				subNVue.hide();
			})
			uni.$on('page-map2', (data) => {
				uni.getLocation({
					geocode:true,
					type: 'gcj02',
					success: function(res) {
						_this.mapShow = data;
					}
				})
			})
		},
		methods: {
			locationCenter() {
				//回到定位中心
				this.mapContext.moveToLocation();
			},
			switchTabs(index) {
				//切换tab标签
				this.tabIndex = index;
				var typeArr = this.typeArr;
				var id = typeArr[index].id;
				var params = this.params;
				typeArr.forEach(item => {
					if (item.id == id) {
						item.active = true;
						params.typeId = id;
						
					} else {
						item.active = false
					}
				})
				this.typeArr = typeArr;
				this.params = params;
				this.query('refresh')
				
			},
			previewImage(item) {
				//预览图片
				//uniapp预览轮播图
				var imgs = [];
				imgs.push(item.facadeImage);
				uni.previewImage({
					current:0, //预览图片的下标
					urls: imgs//预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			getSystemStatusBarHeight:function(){
				//获取系统状态栏高度
				// #ifdef APP-PLUS
				var height = plus.navigator.getStatusbarHeight();
				this.barHeight = height;
				// #endif
				// #ifdef H5
				this.barHeight = 0;
				// #endif
			},
			query(flag) {
				var _this = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(result) {
						_this.triggered = false;
						_this._freshing = false;
						if (!_this.params.typeId) {
							delete _this.params.typeId
						}
						_this.$forceUpdate();
						console.log(result, '参数', _this.params)
						_this.params.longitude = result.longitude;
						_this.params.latitude = result.latitude;
						_this.latitude = result.latitude;
						_this.longitude = result.longitude;
						
						postRequest("/mu/help/list", _this.params)
						.then(res => {
							uni.$emit('page-top2', 36+45+this.barHeight);
							console.log(res, 'ass')
							if (res.retCode == "0000000") {
								if (flag == 'refresh') {
									_this.avatarList = res.rspBody.items;
									if (res.rspBody.length < 1) {
										_this.avatarListOne = null;
										_this.total = 0;
									} else {
										_this.avatarListOne = res.rspBody.items[0];
										_this.total = res.rspBody.total;
										_this.noMore = _this.params.pageSize  > res.rspBody.length ? true : false;
									}
								} else {
									
									var rspBody = res.rspBody.items;
									if (rspBody.length < 1) {
										_this.noMore = false;
									} else if (rspBody.length < _this.params.pageSize) {
										_this.noMore = true;
										_this.avatarList = _this.avatarList.concat(rspBody);
									} else {
										_this.noMore = false;
										_this.avatarList = _this.avatarList.concat(rspBody);
									}
								}
							} else {
								uni.showToast({
									title:res.retDesc
								})
							}
							var avatarList = _this.avatarList;
							var arr = [];
							avatarList.forEach(item => {
								if (!item.iconPath) {
									item.iconPath = "/static/images/locationIcon.png";
								}
								item.width = 70;
								item.height = 70;
								arr.push(item);
							})
							var myLocation = {
								iconPath: "/static/images/locationMy.png",
								width: 50,
								height: 50,
								longitude: result.longitude,
								latitude: result.latitude,
							}
							arr.push(myLocation);
							console.log(arr, '标记点');
							_this.markers = arr;
							_this.loadComplete = true;
							_this.$forceUpdate();
							
						}).catch(err => {
							console.log(err)
							_this.triggered = false;
							_this._freshing = false;
							_this.loadComplete = true;
						})
						
					},
					fail: function() {
						_this.triggered = false;
						_this._freshing = false;
						uni.showToast({
							title: "请打开定位"
						})
					}
				})
			},
			selectTap2() {
				console.log('点击未解决')
				const subNVue = uni.getSubNVueById('popup2');
				subNVue.show();
			},
			mapTap() {
				const subNVue = uni.getSubNVueById('popup2');
				subNVue.hide();
				this.mapShow = !this.mapShow
			},
			restore(){
				console.log('asd')
				this.triggered = 'restore';
			},
			refresh(){
				console.log('下拉刷新')
				if (this._freshing) return;
				this._freshing = true;
				this.params.pageNum = 1;
				this.query('refresh');
			},
			more(){
			if(this.total == this.avatarList.length){
					this.noMore = true;
					return;
				}
				// console.log('上拉加载');
				this.params.pageNum = this.params.pageNum + 1;
				this.query('more');
			},
			showList() {
				this.isShow = !this.isShow
				
			},
			pub() {
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
					url:"../publish/index"
				})
			},
			goDetail(item) {
				//去互助详情
				console.log('互助详情1')
				var id = item.id;
				uni.navigateTo({
					url: "../detail/detail?id=" + id + "&latitude=" + this.latitude + "&longitude=" + this.longitude,
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
			searchKeyWord() {
				//点击搜索
				var _this = this;
				uni.hideKeyboard();//隐藏软键盘
				postRequest("/mu/help/list", {searchWord: this.params.searchWord})
				.then(res => {
					uni.$emit('page-top2', 36+45+this.barHeight);
					console.log(res, 'ass')
					if (res.retCode == "0000000") {
						
						_this.avatarList = res.rspBody.items;
						if (res.rspBody.length < 1) {
							_this.avatarListOne = null;
							_this.total = 0;
						} else {
							_this.avatarListOne = res.rspBody.items[0];
							_this.total = res.rspBody.total;
							_this.noMore = _this.params.pageSize  > res.rspBody.length ? true : false;
						}
						
					} else {
						uni.showToast({
							title:res.retDesc
						})
					}
					var avatarList = _this.avatarList;
					var arr = [];
					avatarList.forEach(item => {
						if (!item.iconPath) {
							item.iconPath = "/static/images/locationIcon.png";
							item.width = 100
							item.height = 100
						}
						arr.push(item);
					})
					var myLocation = {
						iconPath: "/static/images/locationMy.png",
						width: 50,
						height: 50,
						longitude: result.longitude,
						latitude: result.latitude,
					}
					arr.push(myLocation);
					console.log(arr, '标记点');
					_this.markers = arr;
					_this.loadComplete = true;
					_this.$forceUpdate();
					
				}).catch(err => {
					console.log(err)
					_this.triggered = false;
					_this._freshing = false;
					_this.loadComplete = true;
				})
			},
			//地图marker点击事件
			markertap(item) {
				
				console.log(item, '点击事件')
				var markerId = item.detail.markerId;
				if (!markerId) return;
				var avatarList = this.avatarList;
				var findIndex = avatarList.findIndex(item => {
					return item.id == markerId
				})
				console.log(findIndex, avatarList[findIndex])
				this.avatarListOne = avatarList[findIndex];
				this.$forceUpdate();
			},
			makerToDetail() {
				var id = this.avatarListOne.id;
				uni.navigateTo({
					url: "../detail/detail?id=" + id + "&latitude=" + this.latitude + "&longitude=" + this.longitude,
				})
			},
			clearInput() {
				this.params.searchWord = ""
			}
			
		}
	}
	
</script>

<style lang="scss">
	.top{
		height: 108rpx;
		background-color: #FFFFFF;
		.top-extra {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			z-index: 1;
		}
	}
	.container {
		background-color: #FBFBFB;
	}
	.kite-classify-scroll{
		overflow: hidden;
	 	white-space: nowrap;
		text-align: center;
	}
	.margin-box{
		padding-right: 40rpx;
	}
	.type-name{
		padding: 0 30rpx;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #FFFFFF;
	}
	.type-box{
		align-items: center;
		font-size: 30rpx;
		color: #333;
		display: inline-block;
		background-color: #FFFFFF;
	}
	.weight-box{
		font-weight: bold;
	}
	.avatar {
		width: 30px;
		height: 30px;
		border-radius: 100%;
	}
	
	.listMap {
		height: 128px;
		box-sizing: border-box;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.select-type{
		background-color: #0077FF;
		height: 8rpx;
		margin-top: -8rpx;
		width: 100%;
	}
	/deep/.uni-scroll-view::-webkit-scrollbar {
	    /* 隐藏滚动条，但依旧具备可以滚动的功能 */
	    display: none
	}
	.list {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
		color: #333333;
		background-color: #FFFFFF;
		padding: 0 30rpx;
	}

	.list-body {
		flex: 1;
		display: flex;
		flex-direction: row;
		.list-body-content {
			flex: 1;
			padding-top: 20rpx;
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
							color: #333;
							font-size: 26rpx;
						}
						.hour {
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: flex-start;
							padding-top: 4rpx;
						}
					}
				}
			}
			.list-mid-text {
				overflow: hidden;
				-webkit-line-clamp: 3;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
			}
		}
		.list-body-img {
			display: flex;
			flex-direction: column;
			width: 172rpx;
			justify-content: flex-start;
			align-items: center;
			margin-left: 10rpx;
			.list-img {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				
			}
			.img {
				width: 86px;
				height: 58px;
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
			}
		}
	}

	.list-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx 0;
		.list-bottom-left {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			.distance {
				letter-spacing: 3rpx;
			}
		}
	}
	.color-light {
		color: rgba(119, 119, 119, 1);
	}
	.maps-content {
	
	}
	.map {
		width: 100%;
	}
	.send-btn {
		height: 26px;
		width: 57px;
		border: 1px solid rgba(0, 119, 255, 1);
		color: rgba(0, 119, 255, 1);
		border-radius: 13px;
		justify-content: center;
		align-items: center;
		display: flex;
	}
	.uni-list-item__container {
		padding: 20rpx 30rpx;
	}
	.hang {
		letter-spacing: 1.5rpx;
	}
	.hang2 {
		
		position: absolute;
		right: 0;
		bottom: 0;
	}
	.top-tabs {
		width: 100%;
		height: 88rpx;
		background-color: #fff;
	}
	.top-content {
		width: 100%;
		height: 500px;
		background-color: rgba(216, 216, 216, 0.5);
	}
	.more-Box{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10rpx;
	}
	.address-icon {
		width: 20rpx;
		margin-right: 10rpx;
		margin-left: 44rpx;
	}
	.location-icon {
		width: 24rpx;
		margin-right: 10rpx;
	}
	.subColor {
		color: #777777;
		font-size: 22rpx;
	}
	.subDate {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100rpx;
		word-break: break-all;
		white-space: nowrap;
	}
	.subAddress {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 200rpx;
		word-break: break-all;
		white-space: nowrap;
		display: flex;
		align-items: center;
	}
	.uni-list-item {
		background-color: #FFFFFF;
	}
	.uni-scroll-view {
		background-color: #FBFBFB;
	}
	.dataHas {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #666;
		background-color: #fff;
		width: 100%;
		.noData {
			width: 400rpx;
			margin-bottom: 30rpx;
		}
	}
	.type-img{
		width: 30rpx;  
		position: fixed;
		padding: 30rpx 0;
		right: 0;
		background-color: #fff;
	}
	.searchBar {
		padding: 0 40rpx;
		display: flex;
		flex-direction: row;
		background-color: #fff;
		justify-content: space-around;
		align-items: center;
		.search-add {
			width: 120rpx;
			height: 52rpx;
			margin-left: 40rpx;
			border: 1px solid #0077FF;
			border-radius: 26rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			font-weight: bold;
			color: #333333;
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
			
		}
		.search-img {
			width: 32rpx;
			position: absolute;
			left: 20rpx;
			top: 20rpx;
			
		}
		.add-img {
			width: 24rpx;
			margin-right: 10rpx;
		}
	}
	
	.tabsBar {
		background-color: #fff;
		white-space: nowrap;
		text-align: center;
		.tab-item {
			padding: 0 30rpx;
			height: 80rpx;
			width: 100rpx;
			border-bottom: 4px solid #fff;
			font-size: 28rpx;
			color: #333333;
			&.active {
				border-bottom: 4px solid #0077FF;
				font-weight: bold;
			}
		}
	}
	.close-search {
		position: absolute;
		top: 0;
		right: 100rpx;
		z-index: 999;
		width: 72rpx;
		height: 72rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.search-close {
			width: 30rpx;
			height: 30rpx;
		}
	}
	.tabsAll {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		padding: 0 40rpx;
		background-color: #FFFFFF;
	}
	.screen-child1{
		flex-direction: row;
		align-items: center;
		justify-content: center;
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
	.locationCenter {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		width: 50rpx;
		height: 50rpx;
	}
</style>
