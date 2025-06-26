<template>
	<view class="partnerSearch">
		<view class="searchBox">
			<input class="searchInput" maxlength="11" placeholder="可根据手机号搜索" placeholder-style="font-size: 28rpx;color: #B7B7B7;" v-model="searchValue"  @input="onInput" @confirm="toSearch()"/>
			<image class="icon" src="../../../../static/images/goodsDelivery/blueSearch.png" @click="toSearch()"></image>
		</view>
		<view class="searchDataList" v-for="(item, index) in partnerInfo" :key="index">
			<view class="content">
				<text class="name">{{item.userName ? item.userName : '暂无用户姓名'}}</text>
				<text class="mobile">{{item.mobile ? item.mobile : '暂无用户手机号'}}</text>
			</view>
			<view :class="userHasSet(item) ? 'defaultBtn' : 'setBtn'" @click="changeSetStatus(item)">{{userHasSet(item) ? '已添加' : '添加'}}</view>
		</view>
		<view class="loadingBox" v-show="noMore">没有更多了～</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../../static/images/listLoading.png"></image>
			努力加载中…
		</view>
		
		<uni-popup ref="sethintPopup" type="center">
			<view class="hintPopup">
				<view class="hintTitle">提示</view>
				<view class="hintMsg">{{hasSetFlag ? '是否取消关注当前用户？' : '是否关注当前用户？'}}</view>
				<view class="btn" @click="toSet()">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				searchValue: '',
				searchType: '',
				timeOutObj: '',
				noMore: false,
				isLoading: false,
				partnerInfo: [],
				changeUserCode: '',
				hasSetFlag: '',
				userInfo: {}
			};
		},
		onLoad(option) {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			console.log('用户信息', this.userInfo);
			this.searchType = option.searchType;
		},
		onShow() {
			
		},
		methods: {
			onInput(e) {
				// console.log(e);
				if(this.searchValue.length == 11) {
					clearTimeout(this.timeOutObj);
					let that = this;
					that.timeOutObj = setTimeout(() => {
						console.log('search');
						that.toSearch();
					}, 1000);
				}
			},
			toSearch() { // 搜索
				// if(!utils.btnRepeat()) return false; // 防抖
				console.log(this.searchValue, this.searchValue.length);
				if(!this.searchValue || this.searchValue.length != 11) {
					uni.showToast({
						title: '请输入正确的手机号！',
						icon: 'none',
					    duration: 2000
					});
					return false;
				}
				this.noMore = false;
				this.isLoading = true;
				clearTimeout(this.timeOutObj);
				let requestUrl = Number(this.searchType) == 1 ? '/yh/user/carr/sender/select/fuzzy/by/sender' : '/yh/user/carr/sender/select/fuzzy/by/carr';
				let that = this;
				utils.postRequest(requestUrl + '?mobile=' + that.searchValue, {})
				.then(res=>{
					console.log('搜索详细', res);
					if(res.retCode == "0000000") {
						let items = res.rspBody.items;
						if(items && items.length == 0) {
							that.isLoading = false;
							that.noMore = true;
						}else {
							that.isLoading = false;
							that.partnerInfo = items;
						}
					}else {
						that.isLoading = false;
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					that.isLoading = false;
					console.log(err);
				})
			},
			userHasSet(item) {
				switch(Number(this.searchType)) {
					case 1:
						if(item.carrUserCode) {
							return true;
						}else {
							return false;
						}
					case 2:
						if(item.senderUserCode) {
							return true;
						}else {
							return false;
						}
				}
			},
			changeSetStatus(item) {
				this.changeUserCode = item.userCode;
				switch(Number(this.searchType)) {
					case 1:
						this.hasSetFlag = item.carrUserCode;
						break;
					case 2:
						this.hasSetFlag = item.senderUserCode;
						break;
				}
				this.$refs.sethintPopup.open();
			},
			toSet() {
				uni.showLoading({
					title: '加载中'
				})
				let params = {
					senderUserCode: Number(this.searchType) == 1 ? this.changeUserCode : this.userInfo.attrs.userCode,
					carrUserCode: Number(this.searchType) == 2 ? this.changeUserCode : this.userInfo.attrs.userCode,
				};
				console.log('绑定参数', params);
				let that = this;
				let url = that.hasSetFlag ? '/yh/user/carr/sender/unbind' : '/yh/user/carr/sender/binding';
				utils.postRequest(url, params)
				.then(res=>{
					console.log('绑定结果', res);
					if(res.retCode == "0000000") {
						let obj = {}
						for(let i in that.partnerInfo) {
							if(that.partnerInfo[i].userCode == that.changeUserCode) {
								obj = that.partnerInfo[i];
							}
						}
						uni.hideLoading();
						that.$refs.sethintPopup.close();
						uni.$emit("refreshData_partner", obj);
						uni.navigateBack();
					}else {
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss">
	.partnerSearch {
		padding-top: 100rpx;
		.searchBox {
			position: fixed;
			top: 0;
			width: 686rpx;
			height: 70rpx;
			margin: 0 32rpx;
			padding: 0 20rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #0171F9;
			.searchInput {
				flex: 1;
				font-size: 28rpx;
				color:#333;
			}
			.icon {
				flex-shrink: 0;
				width: 42rpx;
				height: 40rpx;
				margin-left:20rpx;
			}
		}
		.searchDataList {
			padding: 0 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.content {
				.name {
					font-size: 30rpx;
					font-weight: 600;
					color: #333333;
					line-height: 42rpx;
				}
				.mobile {
					font-size: 26rpx;
					color: #777777;
					line-height: 42rpx;
					padding-left: 54rpx;
				}
			}
			.defaultBtn {
				width: 160rpx;
				height: 52rpx;
				line-height: 52rpx;
				border-radius: 8rpx;
				border: 2rpx solid #0171F9;
				font-size: 26rpx;
				font-weight: 600;
				color: #0171F9;
				text-align: center;
			}
			.setBtn {
				width: 164rpx;
				height: 56rpx;
				line-height: 56rpx;
				background: #0171F9;
				border-radius: 8rpx;
				border: 2rpx solid #0171F9;
				font-size: 26rpx;
				font-weight: 600;
				color: #FFFFFF;
				text-align: center;
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
		.hintPopup {
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 32rpx 28rpx 48rpx 28rpx;
			margin: 0 32rpx;
			min-width: 500rpx;
			.hintTitle {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				text-align: center;
				margin-bottom:32rpx;
			}
			.hintMsg {
				font-size: 28rpx;
				color: #707071;
				line-height: 40rpx;
				padding: 0 42rpx;
				text-align: center;
				.num {
					font-size: 28rpx;
					color: #4AA2F3;
				}
			}
			.btn {
				height: 88rpx;
				line-height: 88rpx;
				background-color: #4AA2F3;
				border-radius: 12rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				margin-top:112rpx;
			}
		}
	}
</style>
