<template>
	<view class="partnerGroup">
		<view class="groupHeadBox">
			<view class="groupBtn" @click="changeShowGroup(1)">
				<view class="btnMsg" :style="checkedGroup == 1 ? 'color:#333;' : 'color:#AAA'">我的托运人</view>
				<view class="btnLine" :style="checkedGroup == 1 ? 'background: #0171F9;box-shadow: 0px 2rpx 6rpx 0px rgba(0,0,0,0.11);' : 'background-color:rgba(255,255,255,0)'"></view>
			</view>
			<view class="groupBtn" @click="changeShowGroup(2)">
				<view class="btnMsg" :style="checkedGroup == 2 ? 'color:#333;' : 'color:#AAA'">我的承运人</view>
				<view class="btnLine" :style="checkedGroup == 2 ? 'background: #0171F9;box-shadow: 0px 2rpx 6rpx 0px rgba(0,0,0,0.11);' : 'background-color:rgba(255,255,255,0)'"></view>
			</view>
		</view>
		<view class="searchBox" @click="jumpToSearch">
			<view class="msg" :style="searchVal ? 'color:#333;' : 'color:#AEAEAE;'">{{searchVal ? searchVal : '可根据手机号搜索'}}</view>
			<image class="icon" src="../../../static/images/goodsDelivery/search.png"></image>
		</view>
		
		<view v-if="checkedGroup == 1">
			<view class="partnerList" v-for="(item, cIndex) in carrierData" :key="cIndex">
				<!-- <view class="partnerLogo"></view> -->
				<image class="partnerLogo" :src="item.avatar ? item.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png'"></image>
				<view class="partnerContent">
					<view class="contentMsg">
						<text class="name">{{item.userName ? item.userName : '暂无用户姓名'}}</text>
						<text class="mobile">{{item.mobile ? item.mobile : '暂无用户手机号'}}</text>
					</view>
					<view class="company">{{item.enterpriseName ? item.enterpriseName : '暂无企业名称'}}</view>
				</view>
			</view>
			<view class="loadingBox" v-show="carrierNoData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
			</view>
			<view class="loadingBox" v-show="carrierNoMore">没有更多了～</view>
			<view class="loadingBox" v-show="carrierLoading">
				<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
				努力加载中…
			</view>
		</view>
		
		<view v-if="checkedGroup == 2">
			<view class="partnerList" v-for="(item, sIndex) in shippingData" :key="sIndex">
				<image class="partnerLogo" :src="item.avatar ? item.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png'"></image>
				<view class="partnerContent">
					<view class="contentMsg">
						<text class="name">{{item.userName ? item.userName : '暂无用户姓名'}}</text>
						<text class="mobile">{{item.mobile ? item.mobile : '暂无用户手机号'}}</text>
					</view>
					<view class="company">{{item.enterpriseName ? item.enterpriseName : '暂无企业名称'}}</view>
				</view>
			</view>
			<view class="loadingBox" v-show="shippingNoData">
				<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
			</view>
			<view class="loadingBox" v-show="shippingNoMore">没有更多了～</view>
			<view class="loadingBox" v-show="shippingLoading">
				<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
				努力加载中…
			</view>
		</view>
		
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				checkedGroup: 1,
				searchVal: '',
				pageSize: 20,
				carrierPageNum: 1,
				carrierData: [],
				carrierLoading: false,
				carrierNoData: false,
				carrierNoMore: false,
				shippingPageNum: 1,
				shippingData: [],
				shippingLoading: false,
				shippingNoData: false,
				shippingNoMore: false,
				userInfo: {}
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
			uni.$on("refreshData_partner", (data) => {
				this.getPartnerData();
			});
		},
		onReady() {
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getPartnerData();
			this.carrierPageNum = 1;
			this.shippingPageNum = 1;
		},
		onReachBottom() { // 上拉加载
			console.log('上拉加载');
			switch(this.checkedGroup) {
				case 1:
					this.getMoreCarrier();
					break;
				case 2:
					this.getMoreShipping();
					break;
			}
		},
		methods: {
			getPartnerData() { // 初次请求列表
				let params = this.checkedGroup == 1 ? {
					"carrUserCode": this.userInfo.attrs.userCode,
					"pageNum": 1,
					"pageSize": 20,
				} : {
					"senderUserCode": this.userInfo.attrs.userCode,
					"pageNum": 1,
					"pageSize": 20,
				};
				this.carrierNoData = false;
				this.carrierNoMore = false;
				this.shippingNoData = false;
				this.shippingNoMore = false;
				switch(this.checkedGroup) {
					case 1:
						this.shippingData = [];
						break;
					case 2:
						this.carrierData = [];
						break;
				}
				let that = this;
				utils.postRequest('/yh/user/carr/sender/select/binding/users', params)
				.then(res=>{
					console.log('伙伴列表', res);
					if(res.retCode == '0000000') {
						switch(that.checkedGroup) {
							case 1:
								that.carrierData = res.rspBody.items;
								if(res.rspBody.total == 0) {
									that.carrierNoData = true;
								}else if(that.carrierData.length < 20) {
									that.carrierNoMore = true;
								}
								break;
							case 2:
								that.shippingData = res.rspBody.items;
								if(res.rspBody.total == 0) {
									that.shippingNoData = true;
								}else if(that.carrierData.length < 20) {
									that.shippingNoMore = true;
								}
								break;
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
			getMoreShipping() { // 承运人加载更多
				if(this.shippingNoData || this.shippingLoading) {
					return false;
				}
				this.shippingLoading = true;
				this.shippingPageNum++;
				let params = {
					"senderUserCode": this.userInfo.attrs.userCode,
					"pageNum": this.shippingPageNum,
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
								that.shippingData.push(items[i]);
							}
						}else {
							that.shippingNoMore = true;
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					that.shippingLoading = false;
				})
				.catch(err=>{
					that.shippingLoading = false;
				})
			},
			changeShowGroup(flag) {
				this.checkedGroup = flag;
				switch(this.checkedGroup) {
					case 1:
						if(this.carrierData.length == 0 && !this.carrierNoData) {
							this.getPartnerData();
						}
						break;
					case 2:
						if(this.shippingData.length == 0 && !this.shippingNoData) {
							this.getPartnerData();
						}
						break;
				}
			},
			jumpToSearch() {
				uni.navigateTo({
					url: './partnerSearch/partnerSearch?searchType=' + this.checkedGroup
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF;
	}
	.partnerGroup {
		padding-top: 196rpx;
		.groupHeadBox {
			padding: 0 0 32rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			top: 0;
			width: 100vw;
			.groupBtn + .groupBtn {
				margin-left: 145rpx;
			}
			.groupBtn {
				.btnMsg {
					font-size: 30rpx;
					font-weight: 500;
					line-height: 42rpx;
				}
				.btnLine {
					width: 60rpx;
					height: 6rpx;
					border-radius: 3rpx;
					margin: 2rpx auto 0 auto;
					
				}
			}
		}
		.searchBox {
			position: fixed;
			top: 82rpx;
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
	}
</style>
