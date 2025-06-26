<template>
	<view class="creatScope">
		<view class="mainTitle">
			发布范围
			<text class="subTitle">（必填，单选）</text>
		</view>
		<view class="btnGroup">
			<view class="btn" :class="checkTypeRepeat(1) ? 'checkedBtn' : 'defaultBtn'" @click="toCheckType(1)">全平台</view>
			<view class="btn" :class="checkTypeRepeat(2) ? 'checkedBtn' : 'defaultBtn'" @click="toCheckType(2)">定向车队</view>
		</view>
		<view class="checkFleetBox" v-if="checkTypeRepeat(2)">
			<view class="changeFleetTypeBox">
				<view class="checkBtn" @click="checkedFleetType = 0">
					<view class="msg" :style="!checkedFleetType ? 'color:#000;' : 'color:#333;'">我创建的车队</view>
					<view class="line" :style="!checkedFleetType ? 'background-color:#FC5C06;' : 'background-color:#FFF;'"></view>
				</view>
				<view class="checkBtn" @click="checkedFleetType = 1">
					<view class="msg" :style="checkedFleetType == 1 ? 'color:#000;' : 'color:#333;'">我关注的车队</view>
					<view class="line" :style="checkedFleetType == 1 ? 'background-color:#FC5C06;' : 'background-color:#FFF;'"></view>
				</view>
			</view>
			<swiper class="listSwiper" :current="checkedFleetType">
				<swiper-item>
					<scroll-view class="listScrollView" :scroll-y="true">
						<view class="listBox" v-for="(item, index) in myFleetList" :key="index" @click="toCheckMyFleet(item, index)">
							<view class="checkBox">
								<view class="checkBtn" :style="checkRepeat(item) ? 'border-color:#2B72F0' : 'border-color:#000000;'">
									<view class="checkedBc" v-if="checkRepeat(item)"></view>
								</view>
							</view>
							<view class="rightContent">
								<image class="fleetAvatar" :src="item.badgeImage ? item.badgeImage : '/static/images/goodsDelivery/fleet-head.png'"></image>
								<view class="fleetName">{{item.name}}</view>
							</view>
						</view>
						<view class="loadingBox" v-show="myNoData">
							<image class="noDataIcon" src="/static/images/vehicleOptions/newNodata.png"></image>
						</view>
						<view class="loadingBox" v-show="myNoData">
							暂无当前范围的车源～
						</view>
						<view class="loadingBox" v-show="myNoMore">没有更多了～</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view class="listScrollView" :scroll-y="true">
						<view class="listBox" v-for="(item, index) in cooperateFleet" :key="index" @click="toCheckCooperateFleet(item, index)">
							<view class="checkBox">
								<view class="checkBtn" :style="checkRepeat(item) ? 'border-color:#2B72F0' : 'border-color:#000000;'">
									<view class="checkedBc" v-if="checkRepeat(item)"></view>
								</view>
							</view>
							<view class="rightContent">
								<image class="fleetAvatar" :src="item.badgeImage ? item.badgeImage : '/static/images/goodsDelivery/fleet-head.png'"></image>
								<view class="fleetName">{{item.name}}</view>
							</view>
						</view>
						<view class="loadingBox" v-show="cooperateNoData">
							<image class="noDataIcon" src="/static/images/vehicleOptions/newNodata.png"></image>
						</view>
						<view class="loadingBox" v-show="cooperateNoData">
							暂无当前范围的车源～
						</view>
						<view class="loadingBox" v-show="cooperateNoMore">没有更多了～</view>
					</scroll-view>
				</swiper-item>
			</swiper>
			<view class="checkNumBox">{{checkedGroup.length > 0 ? '已选中' + checkedGroup.length + '个车队' : ''}}</view>
		</view>
		<view class="comfirmBtn" @click="saveOrderData()">确定</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				checkedGroup: [],
				checkedFleetType: 0,
				myFleetList: [],
				myNoData: false,
				myNoMore: false,
				myLoadFlag: false,
				cooperateFleet: [],
				cooperateNoData: false,
				cooperateNoMore: false,
				pageNum: 1,
				pageSize: 999,
				myPageNum: 1, 
				myPageSize: 999,
				checkedType: [1]
			};
		},
		onLoad() {
			let creatScope = getApp().globalData.creatScope;
			this.checkedType = creatScope.creatScopeType;
			this.checkedGroup = creatScope.checkedGroup;
			uni.showLoading()
			this.getMyFleetInfo();
			this.getCooperateFleetInfo();
		},
		onReady() {
		},
		methods: {
			toCheckType(val) {
				if(this.checkTypeRepeat(val)) {
					for(let i in this.checkedType) {
						if(this.checkedType[i] == val) {
							this.checkedType.splice(i, 1);
							break;
						}
					}
				}else {
					this.checkedType.push(val);
				}
			},
			checkTypeRepeat(val) { // 重复判断
				for(let i in this.checkedType) {
					if(this.checkedType[i] == val) {
						return true;
					}
				}
			},
			toCheckMyFleet(item, index) {
				this.myFleetList[index].checkFlag = !item.checkFlag;
				this.toCheckGroup(item);
			},
			toCheckCooperateFleet(item, index) {
				this.cooperateFleet[index].checkFlag = !item.checkFlag;
				this.toCheckGroup(item);
			},
			toCheckGroup(item) {
				if(this.checkRepeat(item)) {
					for(let i in this.checkedGroup) {
						if(this.checkedGroup[i].code == item.code) {
							this.checkedGroup.splice(i, 1);
							break;
						}
					}
				}else {
					this.checkedGroup.push(item);
				}
			},
			checkRepeat(item) { // 重复判断
				for(let i in this.checkedGroup) {
					if(this.checkedGroup[i].code == item.code) {
						return true;
					}
				}
			},
			getMyFleetInfo() { // 我的车队
				let that = this;
				utils.newQueryPostRequest('/cd/fleet/list', { pageNum: that.myPageNum, pageSize: that.myPageSize, isMyFleet: 1, isOwner: 1 })
				.then(res=>{
					uni.hideLoading();
					// console.log('我的车队', res);
					if(res.retCode == '0000000') {
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							that.myFleetList = items;
						}
						if(that.myFleetList.length == 0) {
							that.myNoData = true;
						}else if(that.myFleetList.length < that.myPageSize) {
							that.myNoMore = true;
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			getCooperateFleetInfo() { // 我的合作车队
				let that = this;
				utils.newQueryPostRequest('/cd/fleet/list', { pageNum: that.pageNum, pageSize: that.pageSize, isMyJoinFleetAndMyCooperateFleet: 1 })
				.then(res=>{
					uni.hideLoading();
					// console.log('我的合作车队', res);
					if(res.retCode == '0000000') {
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							that.cooperateFleet = items;
						}
						if(that.cooperateFleet.length == 0) {
							that.cooperateNoData = true;
						}else if(that.cooperateFleet.length < that.pageSize) {
							that.cooperateNoMore = true;
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			saveOrderData() { // 关闭页面并保存订单信息
				if(this.checkedType.length == 0) {
					uni.showToast({
						title: '请选择发布范围',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if(this.checkTypeRepeat(2)) {
					if(this.checkedGroup.length == 0) {
						uni.showToast({
							title: '请选择车队',
							icon: 'none',
							duration: 2000
						})
						return false;
					}
					getApp().globalData.creatScope.checkedGroup = this.checkedGroup;
				}
				getApp().globalData.creatScope.creatScopeType = this.checkedType;
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss">
	.creatScope {
		min-height:100vh;
		background-color: #FAFAFA;
		.mainTitle {
			padding: 48rpx 38rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #333333;
			line-height: 44rpx;
			.subTitle {
				font-size: 24rpx;
				color: #666666;
			}
		}
		.btnGroup {
			display: flex;
			justify-content: center;
			align-items: center;
			.btn + .btn {
				margin-left: 120rpx;
			}
			.btn {
				font-size: 32rpx;
				font-weight: 500;
				text-align: center;
				border-radius: 16rpx;
				width: 225rpx;
				height: 65rpx;
				line-height: 65rpx;
				border: 2rpx solid #2B72F0;
			}
			.checkedBtn {
				background-color: #2B72F0;
				color:#FFF;
			}
			.defaultBtn {
				background-color: #FFF;
				color:#2B72F0;
			}
		}
		.checkFleetBox {
			padding: 32rpx 0;
			margin: 24rpx 36rpx 0 36rpx;
			background-color: #FFF;
			border-radius: 24rpx;
			box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
			.changeFleetTypeBox {
				padding: 0 48rpx;
				margin-bottom: 24rpx;
				display: flex;
				align-items: center;
				.checkBtn + .checkBtn {
					margin-left: 80rpx;
				}
				.checkBtn {
					display: flex;
					flex-direction: column;
					align-items: center;
					.msg {
						font-size: 32rpx;
						line-height: 44rpx;
					}
					.line {
						width: 156rpx;
						height: 8rpx;
						border-radius: 60rpx;
						margin-top: 8rpx;
					}
				}
			}
			.listSwiper {
				height: 640rpx;
				.listScrollView {
					height: 640rpx;
					.listBox {
						margin-left: 80rpx;
						display: flex;
						.checkBox {
							flex-shrink: 0;
							width:40rpx;
							height: 128rpx;
							display: flex;
							align-items: center;
						}
						.checkBtn {
							flex-shrink: 0;
							width:36rpx;
							height:36rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							border-width: 2rpx;
							border-style: solid;
							border-radius: 100%;
							.checkedBc {
								width: 28rpx;
								height: 28rpx;
								background: #2B72F0;
								border-radius: 100%;
							}
						}
						.rightContent {
							flex: 1;
							height: 128rpx;
							margin-left: 40rpx;
							border-bottom: 2rpx solid #CBCBCB;
							display: flex;
							align-items: center;
							.fleetAvatar {
								flex-shrink: 0;
								width: 80rpx;
								height: 80rpx;
								border-radius: 8rpx;
								display: block;
							}
							.fleetName {
								padding: 32rpx;
								width: 400rpx;
								font-size: 32rpx;
								color: #333333;
								line-height: 44rpx;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								word-break: break-all;
							}
						}
					}
				}
			}
			.checkNumBox {
				margin-top: 48rpx;
				padding: 0 32rpx;
				font-size: 28rpx;
				color: #333333;
				height: 28rpx;
				line-height: 28rpx;
				text-align: right;
			}
		}
		.comfirmBtn {
			margin: 130rpx 175rpx 0 175rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #2B72F0;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
		.loadingBox {
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.noDataIcon {
				width: 252rpx;
				height: 252rpx;
				margin-top:50rpx;
			}
		}
	}
</style>
