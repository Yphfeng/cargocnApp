<template>
	<view class="listItem">
		<view class="teamImage">
			<image :src="item.badgeImage ? item.badgeImage : '/static/images/goodsDelivery/fleet-head.png'" class="fleet-logo"></image>
		</view>
		<view class="teamDetails">
			<view class="detailTitle" v-if="userRole == 1">
				<view class="teamName">{{item.name}}</view>
				<view class="hasFocused" v-if="(selectTag == 5 && !item.isOwner) || (selectTag != 5 && item.isMember == 1)">已加入</view>
				<view class="focusBtn" v-if="selectTag !== 5 && item.isMember != 1 && item.verificationMethod" @click.stop="addFleet(item)"><text>+</text>加入</view>
			</view>
			<view class="detailTitle" v-if="userRole == 2">
				<view class="teamName">{{item.name}}</view>
				<!-- <view class="hasFocused" v-if="item.isCooperate == 1 && !item.isOwner" @click.stop="fleetOut(item)">已关注</view>
				<view class="focusBtn" v-if="!item.isOwner  && item.isCooperate != 1" @click.stop="addFleet(item)"><text>+</text>关注</view> -->
				<view class="hasFocused" v-if="item.isCooperate == 1 && !item.isOwner" @click.stop="newFleetOut(item)">已关注</view>
				<view class="focusBtn" v-if="!item.isOwner  && item.isCooperate != 1" @click.stop="newAddFleet(item)"><text>+</text>关注</view>
			</view>
			<view class="teamTagBox">
				<view class="tag" style="background: #F29D51;" v-if="item.memberNum">{{item.memberNum}}人</view>
				<view class="tag" style="background: #73A8E8;" v-if="item.cartLength">{{item.cartLength}}米</view>
				<view class="tag" style="background: #84D67A;" v-if="item.fleetAttributes">{{item.fleetAttributes}}</view>
			</view>
			<view class="teamIntroduce">{{item.introduction}}</view>
		</view>
		
		<uni-popup ref="com_popupOut" type="center" :maskClick="true">
			<view class="outFleetPopupBox">
				<view class="title">温馨提示</view>
				<view class="text">确定取消关注车队吗？</view>
				<view class="bot">
					<view class="cancel" @click.stop="cancelOut">取消</view>
					<view class="confirm" @click.stop="confirmOut">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		props: {
			item: {
				type: Object,
			},
			selectTag: {
				type: Number,
				default: 0,
			},
			userRole: {
				type: Number,
				default: 1,
			},
		},
		data() {
			return {
				popupOutItem: {},
			}
		},
		methods: {
			fleetOut(item) {
				//退出车队(车队删除成员)
				uni.$emit("fleetOut", item);
			},
			addFleet(item) {
				//加入车队
				uni.$emit("fleetAdd", item);
			},
			
			showPeopleNum(item) {
				var num = item.memberNum;
				if (item.isAdmin || item.isOwner) {
					return num;
				} else {
					if (num < 10) {
						return "10+"
					} else if ( num < 100) {
						return (parseInt(num/10) + 1)* 10 + '+'
					} else {
						var len = (num.toString()).length;
						var ten = Math.pow(10, (len - 2));
						
						return (parseInt(num/ten) + 1)*ten + '+'
					}
				}
			},
			newFleetOut(item) {
				this.popupOutItem = item;
				this.$refs.com_popupOut.open();
			},
			cancelOut() {
				this.$refs.com_popupOut.close();
			},
			confirmOut(item) {
				this.$refs.com_popupOut.close();
				var outItem = this.popupOutItem;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo || !outItem) return;
				var userCode = JSON.parse(userInfo).attrs.userCode;
				var fleetId = outItem.id;
				var status = 3;
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
							title: "已取消关注",
							icon: 'none',
						})
						that.popupOutItem.isCooperate = 0;
						that.$forceUpdate();
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
			async newAddFleet(item) {
				try{
					uni.showLoading();
					var res = await ship.postRequest("/cd/fleetWithUser/save", {fleetId: item.id, status: 3});
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '关注成功',
							icon: 'none'
						})
						item.isCooperate = 1;
						this.$forceUpdate();
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.listItem {
		display: flex;
		.outFleetPopupBox {
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
	}
	.teamImage {
		flex-shrink: 0;
		margin-right: 16rpx;
		border-radius: 12rpx;
		overflow: hidden;
		.fleet-logo {
			width: 184rpx;
			height: 184rpx;
		}
	}
	.teamDetails {
		flex: 1;
		height: 184rpx;
		.detailTitle {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 52rpx;
			.teamName {
				flex: 1;
				font-size: 30rpx;
				color: #333333;
				line-height: 42rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp:1;
			}
			.hasFocused {
				flex-shrink: 0;
				width: 104rpx;
				height: 48rpx;
				line-height: 48rpx;
				border-radius: 26rpx;
				border: 2rpx solid #AAAAAA;
				font-size: 26rpx;
				text-align: center;
				color: #AAAAAA;
				margin-left: 24rpx;
			}
			.focusBtn {
				flex-shrink: 0;
				width: 108rpx;
				height: 52rpx;
				line-height: 52rpx;
				background: #EBEFF2;
				border-radius: 26rpx;
				text-align: center;
				margin-left: 24rpx;
				font-size: 28rpx;
				color: #777777;
				text {
					font-size: 36rpx;
					color: #777777;
					font-weight:bold;
					padding-right: 4rpx;
				}
			}
		}
		.teamTagBox {
			display: flex;
			height: 42rpx;
			margin-top: 8rpx;
			.tag + .tag {
				margin-left: 16rpx;
			}
			.tag {
				min-width: 98rpx;
				padding: 0 16rpx;
				box-sizing: border-box;
				height: 42rpx;
				line-height: 42rpx;
				background: #F29D51;
				border-radius: 8rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
		}
		.teamIntroduce {
			padding-right: 32rpx;
			margin-top: 12rpx;
			font-size: 26rpx;
			color: #707071;
			line-height: 32rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp:2;
		}
		
	}
</style>
