<template>
	<view class="myCollect">
		<view class="tabs-content">
			<view class="tabs" :class="isActiveIndex == 1 ? 'active' : ''">
				<view class="tab-item" :class="{active: isActiveIndex == 0}" @click="switchIndex(0)">收藏我的
				</view>
				<view class="tab-item" :class="{active: isActiveIndex == 1}" @click="switchIndex(1)">联系我的
				</view>
			</view>
		</view>
		<view>
			<noData v-if="emptyShow"></noData>
			<view class="list-item" v-for="item in list" v-key="item.id">
				<view class="avatar">
					<image :src="item.avatar" class="avatar"></image>
				</view>
				<view class="content">
					<view class="title">
						<view class="name">{{item.hideNickname}}</view>
						<view class="type">{{item.serviceType == 10 ? '司机' : '货主'}}</view>
					</view>
					<view class="date">
						{{isActiveIndex == 1 ? '联系时间：' : '收藏时间：'}}{{item.showDate}}
					</view>
				</view>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/wx_myCollect_phone.png"
					class="wx_myCollect_phone" @click="toContact(index)"></image>
			</view>
		</view>
	</view>
	
</template>

<script>
	import * as ship from "@/utils/ship";
	import * as utils from "@/utils/utils"
	import noData from "@/components/noData.vue";
	import uniMoreBox from "@/components/uni-morebox.vue"
	export default {
		components: {
			noData,
			uniMoreBox
		},
		data() {
			return {
				userInfo: null,
				isActiveIndex: 0,
				list: [],
				end: false,
				emptyShow: false,
				params: {
					pageNum: 1,
					pageSize: 10,
					toUserId: ''
				}
			}
		},
		onLoad() {
			var userInfo = wx.getStorageSync('userInfo');
			this.params.toUserId = JSON.parse(userInfo).userId;
			this.userInfo = JSON.parse(userInfo);
			uni.showLoading();
			this.refresh();
		},
		onPullDownRefresh() {
			
		},
		onReachBottom() {
			
		},
		methods: {
			refresh() {
			    var userInfo = this.userInfo;
				this.requesting = true;
				this.params.pageNum = 1;
				
				var params = this.params;
				var isActiveIndex = this.isActiveIndex;
				var url = "";
				if (isActiveIndex == 0) {
					url = "/cd/fleetWithUser/list"
					params.isBeenCollect = 1;
					params.commonUserCode = userInfo.attrs.userCode
				} else {
					url = "/yh/business/user/contact/log/list"
				}
				uni.showLoading();
				ship.postRequest(url, params)
				.then(res => {
					if (res.retCode == "0000000") {
						var items = res.rspBody.items;
						if (isActiveIndex == 0) {
							items.forEach(atem => {
								var nickname = atem.nickname;
								if  (nickname) {
									atem.hideNickname = nickname.slice(0, 1)  +  '*'
								}
								var createdDt = atem.createdDt;
								createdDt = createdDt.replace(/-/g, '/');
								var t = new Date(createdDt);
								atem.showDate = utils.dateFormat("YYYY-mm-dd HH:MM", t)
								
							})
						} else {
							items.forEach(atem => {
								var fromUserAvatar = atem.fromUserAvatar;
								var fromUserMobile = atem.fromUserMobile;
								var nickname = atem.nickname;
								atem.mobile = fromUserMobile;
								atem.avatar = fromUserAvatar;
								if  (nickname) {
									atem.hideNickname = nickname.slice(0, 1)  +  '*'
								} else {
									atem.hideNickname = fromUserMobile.slice(0, 3)  +  '****' + fromUserMobile.slice(-4)
								}
								var createDt = atem.createDt;
								createDt = createDt.replace(/-/g, '/');
								var t = new Date(createDt);
								atem.showDate = utils.dateFormat("YYYY-mm-dd HH:MM", t)
								
							})
						}
				
						this.list = items;
						this.requesting = false;
						this.emptyShow = items.length < 1 ? true : false;
						this.end = false;
					}
				})
				
			},
			more() {
				var userInfo = this.userInfo;
				var params = this.params;
				var pageNum = params.pageNum;
				pageNum ++
				this.requesting = true;
				this.params.pageNum = pageNum
				
				var isActiveIndex = this.isActiveIndex;
				var url = "";
				if (isActiveIndex == 0) {
					url = "/cd/fleetWithUser/list"
					params.isBeenCollect = 1;
					params.commonUserCode = userInfo.attrs.userCode
				} else {
					url = "/yh/business/user/contact/log/list"
				}
				ship.postRequest(url, params)
				.then(res => {
					if (res.retCode == "0000000") {
						var items = res.rspBody.items;
						if (items.length < 1) {
							this.requesting = false;
							this.end = true;
						  return;
						}
						if (isActiveIndex == 0) {
							items.forEach(atem => {
								var nickname = atem.nickname;
								var mobile = atem.mobile;
								if  (nickname) {
									atem.hideNickname = nickname.slice(0, 1)  +  '*'
								} else {
								  atem.hideNickname = mobile.slice(0, 3)  +  '****' + mobile.slice(-4)
								}
								var createdDt = atem.createdDt;
								createdDt = createdDt.replace(/-/g, '/');
								var t = new Date(createdDt);
								atem.showDate = utils.dateFormat("YYYY-mm-dd HH:MM", t)
								
							})
						} else {
							items.forEach(atem => {
								var fromUserAvatar = atem.fromUserAvatar;
								var fromUserMobile = atem.fromUserMobile;
								var nickname = atem.fromUserName;
								atem.mobile = fromUserMobile;
								atem.avatar = fromUserAvatar;
								if  (nickname) {
									atem.hideNickname = nickname.slice(0, 1)  +  '*'
								} else {
									atem.hideNickname = fromUserMobile.slice(0, 3)  +  '****' + fromUserMobile.slice(-4)
								}
								var createDt = atem.createDt;
								if (createDt) {
								  createDt = createDt.replace(/-/g, '/');
								  var t = new Date(createDt);
								  atem.showDate = utils.dateFormat("YYYY-mm-dd HH:MM", t)
								} else {
								  atem.showDate = ""
								}
								
							})
						}
						var list = this.list;
						this.list = list.concat(items);
						this.requesting = false;
						this.end = items.length < params.pageSize ? true : false
						
					}
				})
		
			},
			switchIndex(index) {
				
				this.isActiveIndex = index;
				this.list = []
				
				setTimeout(() => {
				  this.refresh();
				}, 500)
			},
			toContact(index) {
				//联系他
				var userInfo = this.userInfo;
				var list = this.list;
				var item = list[index];
				uni.makePhoneCall({
					phoneNumber: item.mobile,
					success: function () {
					}
				})
		
			},

		}
	}
</script>

<style lang="less" scoped>
	.tabs-content {
	  z-index: 99;
	  position: fixed;
	  top: 0;
	  left: 0;
	  background-color: #FFFFFF;
	  padding: 26rpx 36rpx;
	  box-sizing: border-box;
	}
	.tabs {
	  width: calc(100vw - 72rpx);
	  height: 39px;
	  background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/wx_myCollect_bg.png");
	  background-size: cover;
	  &.active {
	    background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/wx_myCollect_active_bg.png");
	  }
	  display: flex;
	  flex-direction: row;
	  .tab-item {
	    flex: 1;
	    height: 39px;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    font-size: 32rpx;
	    font-weight: 400;
	    color: #333333;
	    line-height: 44rpx;
	    &.active {
	      font-size: 32rpx;
	      font-weight: 600;
	      color: #FFFFFF;
	    }
	  }
	}
	.list-item {
	  border-radius: 12rpx;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  height: 160rpx;
	  background-color: #FFFFFF;
	  box-shadow: 0 0 28rpx 0 rgba(0,0,0,0.06);
	  margin: 0 36rpx;
	  padding:0 26rpx;
	  box-sizing: border-box;
	  &+.list-item {
	    margin-top: 24rpx;
	  }
	  .avatar {
	    width: 102rpx;
	    height: 102rpx;
	    border-radius: 102rpx;
	    background-color: #cccccc;
	    margin-right: 24rpx;
	  }
	  .content {
	    flex: 1;
	    display: flex;
	    flex-direction: column;  
	    .title {
	      display: flex;
	      flex-direction: row;
	      align-items: center;
	      margin-bottom: 24rpx;
	      .name {
	        font-size: 40rpx;
	
	        font-weight: 500;
	        color: #333333;
	        line-height: 40rpx;
	      }
	      .type {
	        font-size: 32rpx;
	        margin-left: 16rpx;
	        color: #333333;
	        line-height: 32rpx;
	      }
	    }
	    .date {
	      font-size: 28rpx;
	
	      color: #666666;
	      line-height: 40rpx;
	    }
	  }
	  .wx_myCollect_phone {
	    width: 36rpx;
	    height: 36rpx;
	  }
	}
</style>
