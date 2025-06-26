<template>
	<view>
		<view class="total">
			<view class="total-item first">
				<view class="">
					<text class="font-24">{{totalAll.helpCount || 0}}</text>
					<text class="font-16 pl-5">次</text>
				</view>
				<text class="font-14 pt-10">我帮别人</text>
			</view>
			<view class="total-item">
				<view class="">
					<text class="font-24">{{totalAll.helpMyCount || 0}}</text>
					<text class="font-16 pl-5">次</text>
				</view>
				<text class="font-14 pt-10">别人帮我</text>
			</view>
		</view>
		<view class="switch-box">
			<view class="switch-child" @click="switchEvent(1)">
				<view :class="[switchIndex==1?'switch-title':'switch-no-title']">帮助</view>
				<view :class="[switchIndex==1?'switch-select':'switch-no-select']"></view>
			</view>
			<view class="switch-child" @click="switchEvent(2)">
				<view :class="[switchIndex==2?'switch-title':'switch-no-title']">求助</view>
				<view :class="[switchIndex==2?'switch-select':'switch-no-select']"></view>
			</view>
		</view>
		<scroll :triggered="triggered" @refresh="refresh" @restore="restore" top-size="330rpx" @more="more">
			<view class="content-box" v-if="switchIndex==1">
				<view class="business-box" v-for="(item, index) in helpArr" :key="index">
					<view class="list-content">
						<view class="list-body">
							<view class="list-title">
								<view class="list-avatar">
									<image :src="item.avatar" class="avatar" v-if="item.avatar"></image>
									<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/track.png" class="avatar" v-else></image>
									<view class="avatar-text">
										<view class="avatar-title-text">
											<text class="font-10 color-font-second">{{item.userName ? item.userName : '匿名用户'}}</text>
										</view>
										<view class="hour">
											<text class="font-8 color-font-subSecond">{{item.dateDesc}}</text>
										</view>
									</view>
								</view>
								<view class="list-img">
									<view class=" font-12 help">
										已帮助
									</view>
								
								</view>
							</view>
							<text class="list-mid-text">
								<text class="font-13 color-paragraph">#{{item.typeName}}#</text>
								<text class="font-13">{{item.description}}</text>
							</text>
						</view>
					</view>
					<view class="list-content-img" v-if="item.facadeImage">
						<image :src="item.facadeImage" class="img" @click.stop="previewImage(item)"></image>
					</view>
					<view class="list-bottom helpMe">
						<image src="../../../static/images/address.png" class="address-icon" mode="widthFix"></image>
						<view class="font-8 color-tips">
							{{item.address}}
						</view>
					</view>
				</view>
				
			</view>
			
			<view class="content-box" v-if="switchIndex==2">
				
				<view class="user-box" v-for="(item, index) in helpMyArr" :key="index">
					
					<view class="list-content">
						<view class="list-body">
							<view class="list-title">
								<view class="list-avatar">
									<image :src="item.avatar" class="avatar" v-if="item.avatar"></image>
									<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/track.png" class="avatar" v-else></image>
									<view class="avatar-text">
										<view class="avatar-title-text">
											<text class="font-10 color-font-second">{{item.userName ? item.userName : '匿名用户'}}</text>
											<view class="avatar-titleFlag" :style="showStatus(item.solveFlag, 'color')">{{showStatus(item.solveFlag, 'msg')}}</view>
										</view>
										<view class="hour">
											<text class="font-8 color-font-subSecond">{{item.dateDesc}}</text>
										</view>
									</view>
								</view>
								<view class="content-icon">
									<!-- <view class="color-tips font-12 tips" :class="{'active': item.solveFlag == 1}">
											<view class="tips-text" v-if="item.solveFlag == 1">已解决</view>
											<view class="tips-text" v-if="item.solveFlag == 2">未解决</view>
											<view class="tips-text" v-if="item.solveFlag == 0">已关闭</view>
											<view class="tips-line">
												<view class="tips-line-1">
													
												</view>
												<view class="tips-line-2">
													
												</view>
											</view>
									</view> -->
									<view class="content-hang-close" @click="closeHelp(item, 2)">
										<image src="../../../static/images/close.png" mode="widthFix" class="close-icon"></image>							
									</view>
										
								</view>
							</view>
							<text class="list-mid-text">
								<text class="font-13 color-paragraph">#{{item.typeName}}#</text>
								<text class="font-13">{{item.description}}</text>
							</text>
						</view>
					</view>
					<view class="list-content-img" v-if="item.facadeImage">
						<image :src="item.facadeImage" class="img" @click.stop="previewImage(item)"></image>
					</view>
					<view class="list-bottom">
						<view class="font-8 color-tips location">
							<image src="../../../static/images/address.png" class="address-icon" mode="widthFix"></image>
							{{item.address}}
						</view>
						<view class="close-content">
							<view class=" font-12 success" @click="closeHelp(item, 0)" v-if="item.solveFlag == 2">
								已解决
							</view>
							<view class=" font-12 close" @click="closeHelp(item, 1)" v-if="item.solveFlag == 2">
								关闭
							</view>
						<!-- 	<view class=" font-12 delete" @click="closeHelp(item, 2)">
								删除
							</view> -->
						</view>
					</view>
				</view>
			</view>
			<view class="more-Box" v-if="noMore">没有更多了～</view>
		</scroll>
	</view>
</template>

<script>
	import scroll from "@/components/scroll1/scroll1.vue";
	import {postRequest} from "../../../utils/service.js";
	var commonHtmlTitle = '我的互助';
	export default {
		components: {
			scroll
		},
		data() {
			return {
				triggered: true,
				switchIndex: 1,
				params: {
					pageSize: 10,
					pageNum: 1,
					helpObject: 1,
					userId: '',
					commonHtmlTitle: commonHtmlTitle,
				},
				totalAll: {},
				helpArr: [],
				helpMyArr: [],
				noMore: false,
			}
		},
		onLoad() {
			//加载统计
			var _this = this;
			console.log(_this.params, '参数');
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				console.log(userInfo, 'asas')
				this.params.userId = JSON.parse(userInfo).userId
			} else {
				this.params.userId = ""
			}
			postRequest("/mu/help/total", {
				userId: this.params.userId,
				commonHtmlTitle: commonHtmlTitle,
			})
			.then(res => {
				console.log(res, '统计')
				if (res.retCode == "0000000") {
					_this.totalAll = res.rspBody
				}
			})
			.catch(err => {
				
			})
	
			
			//加载我的互助
			console.log(_this.params, '参数')
			postRequest("/mu/help/list", _this.params)
			.then(res => {
				console.log(res, '统计')
				if (res.retCode == "0000000") {
					_this.helpArr = res.rspBody.items;
					_this.noMore = res.rspBody.total > res.rspBody.items.length ? true : false
					
				}
			})
			.catch(err => {
				
			})
				
			
		},
		methods: {
			previewImage(item) {
				//预览
				var imgs = [];
				imgs.push(item.facadeImage);
				uni.previewImage({
					current:0, //预览图片的下标
					urls: imgs//预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			help(flag) {
				var _this = this;
				uni.getLocation({
					geocode: true,
					type: 'gcj02',
					success: function(res) {
						_this.triggered = false;
						_this._freshing = false;
						_this.params.longitude = res.longitude;
						_this.params.latitude = res.latitude;
						_this.params.helpObject = 1;
						//加载我的互助
						postRequest("/mu/help/list", _this.params)
						.then(res => {
							console.log(res, '统计')
							if (res.retCode == "0000000") {
								if (flag == 'refresh') {
									_this.helpArr = res.rspBody.items;
									_this.noMore = _this.params.pageSize > res.rspBody.items.length ? true : false
								} else {
									_this.helpArr = _this.helpArr.concat(res.rspBody.items);
									_this.noMore = _this.params.pageSize > res.rspBody.items.length ? true : false
								}
								
							}
						})
						.catch(err => {
							_this.triggered = false;
							_this._freshing = false;
						})
					}
				})
			},
			getHelp(flag) {
				var _this = this;
				uni.getLocation({
					geocode: true,
					type: 'gcj02',
					success: function(res) {
						_this.triggered = false;
						_this._freshing = false;
						_this.params.longitude = res.longitude;
						_this.params.latitude = res.latitude;
						_this.params.helpObject = 2;
						//加载我的求助
						postRequest("/mu/help/list", _this.params)
						.then(res => {
							console.log(res, '统计')
							if (res.retCode == "0000000") {
								if (flag == 'refresh') {
									_this.helpMyArr = res.rspBody.items
									_this.noMore = _this.params.pageSize  > res.rspBody.items.length ? true : false
								} else {
									_this.helpMyArr = _this.helpMyArr.concat(res.rspBody.items);
									_this.noMore = _this.params.pageSize  > res.rspBody.items.length ? true : false
								}
								
							}
						})
						.catch(err => {
							_this.triggered = false;
							_this._freshing = false;
						})
					}
				})
			},
			switchEvent(type){
				var switchIndex = this.switchIndex;
				if (switchIndex == type) return;
				this.noMore = false
				this.switchIndex = type;
				this.params.pageNum = 1;
				if (type == 1) {
					//帮助
					this.help('refresh');
				} else {
					//求助
					this.getHelp('refresh');
				}
			},
			restore() {
				this.triggered = 'restore';
			},
			refresh() {
				var switchIndex = this.switchIndex;
				if (this._freshing) return;
				this.params.pageNum = 1;
				this._freshing = true;
				if (switchIndex == 1) {
					this.help('refresh');
				} else {
					this.getHelp('refresh');
				}
			},
			more() {
				if (this.noMore) {
					return 
				}
				var switchIndex = this.switchIndex;
				if (this._freshing) return;
				this._freshing = true;
				this.params.pageNum++
				if (switchIndex == 1) {
					this.help('more');
				} else {
					this.getHelp('more');
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
			closeHelp(item, index) {
				var _this = this;
				//关闭帮助
				if (index == 0) {
					uni.showModal({
						title: '确定已解决？',
						success: function(res) {
							if (res.confirm) {
								postRequest("/mu/help/handle", {
									helpHandleType: 1,
									id: item.id,
									commonHtmlTitle: commonHtmlTitle,
								}).then(res => {
									console.log(res)
									if (res.retCode == "0000000") {
										uni.showToast({
											title:'成功',
											icon: 'none'
										})
										_this.refresh('refresh');
									} else {
										uni.showToast({
											title:res.retDesc,
											icon: 'none'
										})
									}
								})
							}
						}
					})
				}
				if (index == 1) {
					uni.showModal({
						title: '确定关闭？',
						success: function(res) {
							if (res.confirm) {
								postRequest("/mu/help/handle", {
									helpHandleType: 2,
									id: item.id,
									commonHtmlTitle: commonHtmlTitle
								}).then(res => {
									console.log(res)
									if (res.retCode == "0000000") {
										uni.showToast({
											title:'成功',
											icon: 'none'
										})
										_this.refresh('refresh');
									} else {
										uni.showToast({
											title:res.retDesc,
											icon: 'none'
										})
									}
								})
							}
						}
					})
				}
				if (index == 2) {
					uni.showModal({
						title: '确定删除？',
						success: function(res) {
							if (res.confirm) {
								postRequest("/mu/help/handle", {
									helpHandleType: 3,
									id: item.id,
									commonHtmlTitle: commonHtmlTitle
								}).then(res => {
									console.log(res)
									if (res.retCode == "0000000") {
										uni.showToast({
											title:'成功',
											icon: 'none'
										})
										_this.refresh('refresh');
									} else {
										uni.showToast({
											title:res.retDesc,
											icon: 'none'
										})
									}
								})
							}
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FBFBFB;
	}
	.total {
		background-color: rgba(0, 119, 255, 1);
		margin: 20rpx 32rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 210rpx;
		border-radius: 10rpx;
		.total-item {
			margin: 20rpx 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			flex: 1;
			height: 170rpx;
			color: #fff;
			&.first {
				border-right: 2px solid #fff;
			}
		}
	}
	.card-box{
		position: absolute;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: -40rpx;
		font-size: 28rpx;
		color: #333;
	}
	.card{
		width: 702rpx;
		height: 306rpx;
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
	}
	.lable-child{
		width: 113rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background-color: #E5E5E5;
		color: #3B3B3B;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
	}
	.card-content{
		color: #555;
		display: flex;
		align-items: center;
		
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
		background-color: #fff;
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
		font-size: 26rpx;
		color: #333;
		text-align: center;
		margin-bottom: 10rpx;
	}
	.switch-no-title{
		width: 168rpx;
		font-size: 26rpx;
		color: #666;
		text-align: center;
		margin-bottom: 10rpx;
	}
	.switch-select{
		width: 168rpx;
		background-color: rgba(255, 141, 2, 1);
		height: 8rpx;
	}
	.switch-no-select{
		width: 168rpx;
		background-color: #fff;
		height: 8rpx;
	}
	.content-box{
		background-color: #FBFBFB;
	}
	.user-box, .business-box{
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		flex-direction: column;
		padding: 20rpx 32rpx;
		background-color: #fff;
	}
	.user-img{
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		margin-right: 10rpx;
	}
	.user-name{
		color: #FF8D02;
		font-size: 24rpx;
	}
	.goCertification{
		margin-top: 80rpx;
		font-size: 24rpx;
		color: #333;
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
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 100%;
	}
	.content-icon {
		position: absolute;
		top: -20rpx;
		right: 0;
		z-index: 9999;
		display: flex;
		flex-direction: row;
		.content-hang-close {
			width: 60rpx;
			height: 56rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
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
	.list-img {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.list-content {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: center;
		width: 100%;
		
		.list-body {
			flex: 1;
			.list-title {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10px;
				position: relative;
				.list-avatar {
					display: flex;
					flex-direction: row;
					.avatar {
						margin-right: 10px;
					}
					.avatar-text {
						display: flex;
						flex-direction: column;
						justify-content: center;
						.avatar-title-text {
							display: flex;
							align-items: center;
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
							padding-top: 12rpx;
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
	.save, .close, .help, .success, .delete {
		width: 108rpx;
		height: 44rpx;
		border-radius: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.save {
		border: 1px solid rgba(0, 119, 255, 1);
		color: rgba(0, 119, 255, 1);
		margin-right: 30rpx;
	}
	.close {
		border: 1px solid rgba(255, 2, 31, 1);
		color: rgba(255, 2, 31, 1);
		margin-right: 20rpx;
	}
	.delete {
		border: 1px solid rgba(255, 2, 31, 1);
		color: rgba(255, 2, 31, 1);
		margin-right: 20rpx;
	}
	.success {
		border: 1px solid #0077FF;
		color: #0077FF;
		margin-right: 20rpx;
	}
	.help {
		border: 1px solid rgba(255, 141, 2, 1);
		color: rgba(255, 141, 2, 1);
	}
	.list-content-img {
		margin-top: 18rpx;
		display: flex;
		width: 100%;
		.img {
			width: 248rpx;
			height: 168rpx;
		}
	}
	.list-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		width: 100%;
		margin-top: 20rpx;
		&.helpMe {
			justify-content: flex-start;
		}
		.close-content {
			display: flex;
			flex-direction: row;
		}
	}
	.address-icon {
		width: 15rpx;
		margin-right: 10rpx;
	}
	.location {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.close-icon {
		width: 22rpx;
		height: 22rpx;
	}
	.more-Box{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10rpx;
	}
</style>
