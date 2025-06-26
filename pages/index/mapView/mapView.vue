<template>
	<view>
		<scroll-view scroll-x="true" class="kite-classify-scroll">
			<view :class="['type-box', index==newLabelArr.length-1?'margin-box':'']" v-for="(item, index) in newLabelArr" @click="typeEvent(item.id)">
				<view :class="[newLabelId==item.id?'weight-box':'', 'type-name']">
					{{item.typeName}}
				</view>
				<view :class="[newLabelId==item.id?'select-type':'select-type1']"></view>
			</view>
			<image class="type-img" src="/static/images/icon_right.png" mode="widthFix"></image>
		</scroll-view>
		<!-- <view class="tabs">
			
		</view> -->
		<map class="map" :style="{height: mapHeight}" id="map" :longitude="longitude" :latitude="latitude" show-location="tue" :scale="scale" @markertap="makertap"
		 :markers="markers" @regionchange="bindregionchange">
			<cover-image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/locationOpt.png" @click="locationCenter" class="locationCenter"></cover-image>
			
		</map>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js"
	export default {
		data() {
			return {
				latitude: 0,
				longitude: 0,
				scale: 10,
				markers: [],
				markersDataNotShow: "",
				newLabelArr: [],
				newLabelId: '',
				topHeight: 0,
				mapHeight: 0,
				distanceLimit: 100,
				userRole: '',
			}
		},
		onLoad() {
			// this.mapContext = uni.createMapContext('map');
			this.getSystemStatusBarHeight();
			var that = this;
			that.userRole = uni.getStorageSync('userRole');
			
			uni.$on('page-popup1', (data) => {
				console.log(data)
				that.distanceLimit = data
				that.getList();
			})
			this.getUserLocation();
			this.getList();
			this.getLabelList();
		},
		beforeDestroy() {
			uni.$off('page-popup1');
			uni.$off('page-index');
		},
		onReady(){
			this.mapContext = uni.createMapContext('map');
		},
		methods: {
			getSystemStatusBarHeight(){
				//获取系统状态栏高度
				var height = plus.navigator.getStatusbarHeight();
				var windowHeight = uni.getSystemInfoSync().windowHeight;
				this.barHeight = height;
				// this.mapHeight = (windowHeight - 90) + 'px';
				this.mapHeight = (windowHeight - 40) + 'px';
				
				console.log(height);
			},
			makertap: function(e) {
				console.log(e);
				var id = e.detail.markerId;
				var that = this;
				console.log(e, '渲染的1111');
				this.getDetail(id)
			},
			getDetail(id){
				var that = this;
				utils.postRequest('/mu/provider/detail', {
					id: id
				})
				.then(res=>{
					if(res.retCode == "0000000"){
						var detailsObj = res.rspBody;
						var data = {
							latitude: that.latitude,
							longitude: that.longitude,
						}
						var item = {
							address: data,
							data: detailsObj,
						}
						console.log(item, '数据111')
						uni.$emit('page-items', item);
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
			bindregionchange(e) {
				console.log('变化1111');
				var that = this;
				var markersDataNotShow = this.markersDataNotShow;
				var markers = this.markers;
			
				if (markersDataNotShow.length < 1) {
					return;
				}
			
				that.mapContext.getRegion({
					success: function(res) {
						console.log(res);
						var northeast = res.northeast;
						var southwest = res.southwest;
			
						for (var i = 0; i < markersDataNotShow.length; i++) {
							if (southwest.latitude < markersDataNotShow[i].latitude && northeast.latitude > markersDataNotShow[i].latitude &
								southwest.longitude < markersDataNotShow[i].longitude && northeast.longitude > markersDataNotShow[i].longitude
							) {
								markers.push(markersDataNotShow[i]);
								markersDataNotShow.splice(i, 1);
							}
						}
						that.markers = markers;
						that.markersDataNotShow = markersDataNotShow;
					}
				});
			},
			locationCenter() {
				this.mapContext.moveToLocation();
			},
			getUserLocation() {
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						console.log(res);
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						that.getList();
					},
					fail: function(err) {
						uni.showToast({
							title: '位置信息获取失败',
							icon: 'none'
						})
					}
				});
			},
			typeEvent(id) {
				this.newLabelId = id;
				this.getList();
			},
			getList(){
				var that = this;
				var data = {
					latitude: that.latitude,
					longitude: that.longitude,
					typeId: that.newLabelId,
				};
				utils.postRequest('/mu/provider/list', data)
				.then(function (response) {
					console.log('得到数据')
					if(response.retCode == "0000000"){
						console.log(response, 'asaa')
						that.serverArr = response.rspBody.items;
						var result = response.rspBody.items[0];
						// console.log(that.serverArr);
						console.log(that.mapContext.$getAppMap().clearOverlays())
						that.mapContext.getRegion({
							success: function(res) {
								console.log(res)
								var markers = [];
								var northeast = res.northeast;
								var southwest = res.southwest;
								var markersDataNotShow = that.serverArr;
								for (var i = 0; i < markersDataNotShow.length; i++) {
									if (southwest.latitude < markersDataNotShow[i].latitude && northeast.latitude > markersDataNotShow[i].latitude &
										southwest.longitude < markersDataNotShow[i].longitude && northeast.longitude > markersDataNotShow[i].longitude
									) {
										markers.push(markersDataNotShow[i]);
										markersDataNotShow.splice(i, 1);
									}
								}
								that.markers = markers;
								that.markersDataNotShow = markersDataNotShow;
								var locationMy = {
									iconPath: "/static/images/locationMy.png",
									width: '100upx',
									height: '100upx',
									longitude: that.longitude,
									latitude: that.latitude,
								}
								that.markers = that.markers.concat(locationMy);
				
								var item = {
									address: data,
									data: result,
								}
								console.log(item, '数据11111', result)
								uni.$emit('page-items', item);
							}
						})
					} else{
						uni.showToast({
							title: response.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			getLabelList(){
				var that = this;
				utils.postRequest('/mu/providerType/list').then(res=>{
					uni.$emit('page-top', 36+45+this.barHeight);
					if(res.retCode == "0000000"){
						res.rspBody.unshift({id: '', typeName: '全部'})
						that.newLabelArr = res.rspBody;
						console.log(that.newLabelArr);
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				})
				.catch(err=>{
					uni.$emit('page-top', 36+45+this.barHeight);
				})
			},
		}
	}
</script>

<style>
	.map {
		width: 100%;
	}
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		display: none;
	}
	.kite-classify-scroll{
		overflow: hidden;
	 	white-space: nowrap;
		height: 88rpx;
	}
	.tabs {
		height: 80rpx;
	}
	.type-img{
		width: 40rpx;  
		top: 10rpx;
		position: fixed;
		padding: 10rpx 0;
		right: 0;
		background-color: #fff;
	}
	.type-box{
		align-items: center;
		font-size: 28rpx;
		color: #333;
		display: inline-block;
		height: 80rpx;
	}
	.margin-box{
		margin-right: 50rpx;
	}
	.type-name{
		padding: 0 30rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
	.weight-box{
		font-weight: bold;
	}
	.select-type{
		background-color: #0077FF;
		height: 8rpx;
		width: 100%;
	}
	.select-type1{
		background-color: #fff;
		height: 8rpx;
		width: 100%;
	}
	.locationCenter {
		position: absolute;
		right: 20rpx;
		bottom: 500rpx;
		width: 50rpx;
		height: 50rpx;
	}
</style>
