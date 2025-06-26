<template>
	<view class="container">
		<view class="item" v-if="info.isAdmin || info.isOwner" @click="fleetMemberList">
			<text>管理成员</text>
			<image src="/static/images/newRightIcon.png" class="arrow-right"></image>
		</view>
		<view class="item" v-if="info.isAdmin || info.isOwner" @click="fleetAdd">
			<text>编辑车队</text>
			<image src="/static/images/newRightIcon.png" class="arrow-right"></image>
		</view>
		<!-- <view class="item">
			<text>资源分配方式</text>
			<picker class="subItem" :range="methods" :value="selectedIndex" @change="changeIndex">
				<text class="subItem-text">{{methods[selectedIndex]}}</text>
				<image src="/static/images/newRightIcon.png" class="arrow-right"></image>
			</picker>
			
		</view> -->
		<view class="item" @click="goUpImg" v-if="info.isAdmin == 1">
			<text>上传照片</text>
			<image src="/static/images/newRightIcon.png" class="arrow-right"></image>
		</view>
		<view class="fix-bottom" @click="fleetOut" v-if="info.isMember == 1">
			<text>退出车队</text>
		</view>
		<uni-popup ref="popupOut" type="center" :maskClick="true">
			<view class="out">
				<view class="title">温馨提示</view>
				<view class="text">确定退出车队吗？</view>
				<view class="bot">
					<view class="cancel" @click="cancelOut">取消</view>
					<view class="confirm" @click="confirmOut">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				methods: ["管理员分配", "自主分配"],
				selectedIndex: 0,
				customText: '',
				info: ''
			}
		},
		onLoad(options) {
			this.info = JSON.parse(options.info);
			this.customText = options.customText?options.customText:'';
		},
		methods: {
			changeIndex(e) {
				this.selectedIndex = e.detail.value;
			},
			goUpImg() {
				uni.navigateTo({
					url: './fleetUpImg?fleetId=' + this.info.id
				})
			},
			fleetAdd() {
				uni.navigateTo({
					url: '/pages/my/fleet/fleetCreate/fleetCreate?fleetDetail=' + JSON.stringify(this.info) + '&customText=' + this.customText
				})
			},
			fleetMemberList(){
				uni.navigateTo({
					url: '/pages/my/fleet/fleetMemberList/fleetMemberList?fleetDetail=' + JSON.stringify(this.info) + '&name=管理查看&type=check'
				})
			},
			fleetOut() {
				this.$refs.popupOut.open();
			},
			cancelOut() {
				this.$refs.popupOut.close();
			},
			confirmOut() {
				this.$refs.popupOut.close();
				var userInfo = uni.getStorageSync("userInfo");
				var userRole = uni.getStorageSync("userRole");
				if (!userInfo) return;
				var userCode = userRole == 1 ? JSON.parse(userInfo).attrs.userCode :  JSON.parse(userInfo).attrs.userCode;
				var fleetId = this.info.id;
				var status = 1; //已经加入成功的车队退出时传1
				var params = {
					userCode,
					status,
					fleetId,
				}
				uni.showLoading();
				let that = this;
				ship.postRequest("/cd/fleetWithUser/remove", params)
				.then(res => {
					console.log(res, 'asa')
					uni.hideLoading();
					if (res.retCode == '0000000') {
						uni.showToast({
							title: "退出成功",
							icon: 'none',
						})
						that.subscribeGroup();
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							})
						}, 1000)
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.hideLoading();
				})
			},
			subscribeGroup() { // 取消订阅群聊
				var groupId = this.info.code;
				let that = this;
				that.goEasy.im.unsubscribeGroup({
					groupId: groupId, //聊天对象的userId
					onSuccess: function () { //标记成功
						console.log("取消订阅成功") 
						that.goEasy.im.removeGroupConversation({
						    groupId: groupId,
						    onSuccess: function () { 
						        console.log("删除群聊成功"); 
						    },
						    onFailed: function (error) { 
						        console.log("删除群聊失败", error);
						    }
						});
					},
					onFailed: function (error) { //标记失败
						console.log("取消订阅失败", error);
					}
				});
			},
		}
	}
</script>
<style scoped lang="scss">
	.container {
		background-color: #F2F2F2;
		height: 100vh;
		padding-top: 16rpx;
		box-sizing: border-box;
		.arrow-right {
			width: 15rpx;
			height: 30rpx;
		}
		.item {
			background-color: #FFFFFF;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 60rpx;
			border-bottom: 2rpx solid rgba(151, 151, 151, 0.16);
			font-size: 28rpx;
			&:last-child {
				border-bottom: none;
			}
		}
		.subItem {
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			color: rgba(119, 119, 119, 1);
			font-size: 26rpx;
			.subItem-text {
				margin-right: 24rpx;
			}
		}
	}
	.fix-bottom {
		margin-top: 20rpx;
		width: 100vw;
		height: 104rpx;
		font-size: 28rpx;
		color: #FC2D2D;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
	}
	.out {
		width: calc(100vw - 64rpx);
		background-color: #FFFFFF;
		height: 352rpx;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		.title {
			font-size: 36rpx;
			color: #333333;
			font-weight: 500;
			padding: 48rpx 60rpx 0;
			box-sizing: border-box;
		}
		.text {
			padding: 0 60rpx;
			flex: 1;
			font-size: 32rpx;
			color: #333333;
			box-sizing: border-box;
			display: flex;
			align-items: center;
		}
		
		.bot {
			display: flex;
			flex-direction: row;
			height: 92rpx;
			border-top: 1px solid #F3F3F3;
			font-size: 32rpx;
			.cancel {
				flex: 1;
				border-right: 1px solid #F3F3F3;
				color: #777777;
				font-weight: 500;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.confirm {
				flex: 1;
				font-weight: 500;
				color: #4AA2F3;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
