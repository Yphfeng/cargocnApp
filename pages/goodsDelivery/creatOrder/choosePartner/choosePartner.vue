<template>
	<view class="partnerGroup">
		<view class="searchBox">
			<input class="searchInput" maxlength="11" placeholder="可根据手机号搜索" placeholder-style="font-size: 28rpx;color: #B7B7B7;" v-model="searchValue"  @input="onInput" @confirm="getPartnerData()"/>
			<image class="icon" src="../../../../static/images/goodsDelivery/blueSearch.png" @click="getPartnerData()"></image>
		</view>
		
		<view>
			<view class="partnerList" v-for="(item, sIndex) in carrierData" :key="sIndex">
				<image class="partnerLogo" :src="item.avatar ? item.avatar : '../../../../static/images/goodsDelivery/shipUserLogo.png'"></image>
				<view class="partnerContent">
					<view class="contentView">
						<view class="contentMsg">
							<text class="name">{{item.userName ? item.userName : '暂无用户姓名'}}</text>
							<text class="mobile">{{item.mobile ? item.mobile : '暂无用户手机号'}}</text>
						</view>
						<view class="company">{{item.enterpriseName ? item.enterpriseName : '暂无企业名称'}}</view>
					</view>
					<view class="checkView" @click="toCheckUser(item)">
						<view class="checkedCircle" :style="checkedUser.userId == item.userId ? 'border: 2rpx solid #0171F9;' : 'border: 2rpx solid #979797;'">
							<view class="checkContent" :style="checkedUser.userId == item.userId ? 'background: #0171F9;' : 'background: #FFF;'"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="loadingBox" v-show="carrierNoData">
				<image class="noDataIcon" src="../../../../static/images/goodsDelivery/noDataIcon.png"></image>
			</view>
			<view class="loadingBox" v-show="carrierNoMore">没有更多了～</view>
			<view class="loadingBox" v-show="carrierLoading">
				<image class="loadingImg" src="../../../../static/images/listLoading.png"></image>
				努力加载中…
			</view>
		</view>
		
		<view class="saveBtn" @click="toSave()">确定</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				searchValue: '',
				pageSize: 20,
				carrierPageNum: 1,
				carrierData: [],
				carrierLoading: false,
				carrierNoData: false,
				carrierNoMore: false,
				userInfo: {},
				checkedUser: {
					userName: '',
					userId: ''
				},
				timeOutObj: ''
			};
		},
		onLoad() {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			console.log(this.userInfo);
			uni.showLoading({
				title: '加载中'
			})
			this.getPartnerData();
			
			this.checkedUser.userName = getApp().globalData.otherShipping.userName ? getApp().globalData.otherShipping.userName : '';
			this.checkedUser.userId = getApp().globalData.otherShipping.userId ? getApp().globalData.otherShipping.userId : '';
		},
		onReady() {
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getPartnerData();
		},
		onReachBottom() { // 上拉加载
			console.log('上拉加载');
			this.getMoreCarrier();
		},
		methods: {
			getPartnerData() { // 初次请求列表
				let params = {
					"carrUserCode": this.userInfo.attrs.userCode,
					"pageNum": 1,
					"pageSize": 20,
					"mobile": this.searchValue
				};
				this.carrierPageNum = 1;
				this.carrierNoData = false;
				this.carrierNoMore = false;
				this.carrierData = [];
				clearTimeout(this.timeOutObj);
				let that = this;
				console.log('伙伴参数', params);
				utils.postRequest('/yh/user/carr/sender/select/binding/users', params)
				.then(res=>{
					console.log('伙伴列表', res);
					if(res.retCode == '0000000') {
						that.carrierData = res.rspBody.items;
						if(res.rspBody.total == 0) {
							that.carrierNoData = true;
						}else if(that.carrierData.length < 20) {
							that.carrierNoMore = true;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					console.log(err)
					uni.hideLoading();
				})
				uni.stopPullDownRefresh();
			},
			getMoreCarrier() { // 托运人加载更多
				if(this.carrierNoData || this.carrierLoading) {
					return false;
				}
				this.carrierLoading = true;
				this.carrierPageNum++;
				let params = {
					"carrUserCode": this.userInfo.attrs.userCode,
					"pageNum": this.carrierPageNum,
					"pageSize": this.pageSize,
				}
				let that = this;
				utils.postRequest('/yh/user/carr/sender/select/binding/users', params)
				.then(function (res) {
					// console.log('列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								that.carrierData.push(items[i]);
							}
						}else {
							that.carrierNoMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.carrierLoading = false;
				})
				.catch(err=>{
					that.carrierLoading = false;
				})
			},
			toCheckUser(item) {
				this.checkedUser.userName = item.userName;
				this.checkedUser.userId = item.userId;
			},
			onInput(e) {
				clearTimeout(this.timeOutObj);
				let that = this;
				that.timeOutObj = setTimeout(() => {
					console.log('search');
					that.getPartnerData();
				}, 1000);
			},
			toSave() {
				if(!this.checkedUser.userId) {
					uni.showToast({
						title: '请选择托运人',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				getApp().globalData.otherShipping.userName = this.checkedUser.userName;
				getApp().globalData.otherShipping.userId = this.checkedUser.userId;
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF;
	}
	.partnerGroup {
		padding-top: 114rpx;
		.searchBox {
			position: fixed;
			top: 0;
			width: 686rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 32rpx;
			padding: 0 20rpx;
			height: 70rpx;
			background: #F2F2F2;
			border-radius: 8rpx;
			.searchInput {
				flex: 1;
				font-size: 28rpx;
				color:#333;
			}
			.msg {
				flex: 1;
				font-size: 28rpx;
			}
			.icon {
				flex-shrink: 0;
				width: 40rpx;
				height: 40rpx;
				margin-left:20rpx;
			}
		}
		.partnerList {
			padding-left:32rpx;
			display: flex;
			align-items: center;
			.partnerLogo {
				width: 112rpx;
				height: 112rpx;
				// background-color: #333;
				margin-right: 28rpx;
				flex-shrink: 0;
				border-radius: 100%;
			}
			.partnerContent {
				flex: 1;
				padding: 20rpx 0;
				border-bottom: 1rpx solid #DCDCDE;
				display: flex;
				align-items: center;
				.contentView {
					flex: 1;
					.contentMsg {
						.name {
							font-size: 32rpx;
							font-weight: 500;
							color: #333333;
							line-height: 44rpx;
						}
						.mobile {
							font-size: 28rpx;
							color: #777777;
							line-height: 40rpx;
							padding-left: 32rpx;
						}
					}
					.company {
						margin-top: 10rpx;
						font-size: 28rpx;
						color: #777777;
						line-height: 40rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
					}
				}
				.checkView {
					flex-shrink: 0;
					display: flex;
					align-items: center;
					padding: 0 48rpx 0 32rpx;
					.checkedCircle {
						width: 24rpx;
						height: 24rpx;
						border-radius: 100%;
						padding: 6rpx;
						.checkContent {
							width: 24rpx;
							height: 24rpx;
							border-radius: 100%;
						}
					}
				}
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
			padding:30rpx 30rpx 0 30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 1.5s linear infinite;
		        animation: rotating 1.5s linear infinite;
			}
			.noDataIcon {
				width: 244rpx;
				height: 246rpx;
				margin-top:50rpx;
			}
		}
		.saveBtn {
			position: fixed;
			bottom: 24rpx;
			width: 610rpx;
			left: 70rpx;
			height: 84rpx;
			line-height: 84rpx;
			background: #0171F9;
			border-radius: 42rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
