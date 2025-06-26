<template>
	<view class="container">
		<view class="member-list-li" v-for="(item,index) in bankArr" :id="item.id" :style="!item.showAll ? 'height:228rpx;transition: all 0.3s;' : 'height:740rpx;transition: all 0.3s;'">
			<view class="list-touch" :style="item.txtStyle ? item.txtStyle : commonStyle">
				<view style="flex: 1">
					<view class="member-box-name">
						<view class="member-title">
							<text>{{item.bank}}</text>
							<text style="padding-left: 20rpx;">{{checkName(item.accountName)}}</text>
						</view>
					</view>
					<view class="member-box-card"> 
						<view class="member-cardno">
							<view class="cardno-item" v-if="!item.showAll">
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
							</view>
							<view class="cardno-item" v-if="!item.showAll">
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
							</view>
							<view class="account" v-if="item.showAll" style="margin-right: 40rpx;">{{showFirst(item.account)}}</view>
							<view class="account" v-if="item.showAll" style="margin-right: 40rpx;">{{showSecond(item.account)}}</view>
							<view class="cardno-item">
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
							</view>
							<view class="account">
								<text>{{showAccount(item.account)}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="showAllBtn" @click="showAllMsg(item, index)">
					<image class="showIcon" :src="!item.showAll ? '../../../static/images/newBankList/packUpIcon.png' : '../../../static/images/newBankList/packOnIcon.png'"></image>
				</view>
			</view>
			<view class="bankDetails">
				<view class="detailList">
					<view class="title">持卡人</view>
					<view class="msg">{{checkName(item.accountName)}}</view>
				</view>
				<view class="detailList">
					<view class="title">身份证</view>
					<view class="msg">{{checkIdNo(item.idNo)}}</view>
				</view>
				<view class="detailList">
					<view class="title">手机号</view>
					<view class="msg">{{checkMobile(item.mobile)}}</view>
				</view>
				<view class="detailList">
					<view class="title">开户行名称</view>
					<view class="msg">{{item.bank}}</view>
				</view>
				<view class="deleteBankBtn" @click="deleteMember(index)">解除绑定</view>
			</view>
		</view>
		
		<view class="fix-bottom" @click="goAddBank">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/addBank.png" class="icon"></image>
			<view class="fix-text">添加银行卡</view>
		</view>
		<uni-popup ref="deletePop" type="center">
			<view class="arriveContent">
				<view class="content">是否删除该银行卡?</view>
				<view class="btn">
					<view class="item cancel" @click="cancel">取消</view>
					<view class="item confirm" @click="confirm">确认</view>
				</view>
			</view>
		</uni-popup>
		
		
	</view>
</template>


<script>
	import * as ship from "@/utils/ship";
	import noData from "@/components/noData"
	import UniMoreBox from "@/components/uni-morebox"
	export default {
		components: {
			noData,
			UniMoreBox
		},
		data() {
			return {
				isNoData: false,
				isNoMore: 'more',
				bankArr: [],
				delBtnWidth: 60, //删除按钮宽度单位（rpx）
				startX:'',
				commonStyle: "left: 0",
			}
		},
		onPullDownRefresh() {
			if (!ship.btnRepeat()) return;
			this.init();
		},
		onLoad() {
			var userRole = uni.getStorageSync("userRole");
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) return;
			var userId = userRole == 1 ? JSON.parse(userInfo).userId : JSON.parse(userInfo).userId;
			this.userId = userId;
		},
		onShow() {
			this.init();
		},
		methods: {
			showAccount(account) {
				return account.substr(account.length - 4, account.length);
			},
			showFirst(account) {
				return account.substr(0, 4);
			},
			showSecond(account) {
				return account.substr(4, 4);
			},
			async init() {
				try{
					var res = await ship.postRequest("/md/user-bank/userBankListByUserId", {
						userId: this.userId
					})
					uni.stopPullDownRefresh();
					console.log(res, 'sa是');
					if (res.retCode == "0000000") {
						this.bankArr = res.rspBody;
						for(let i in this.bankArr) {
							this.bankArr[i].showAll = false;
						}
					}
					this.$forceUpdate();
				}catch(e){
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			cancel() {
				this.$refs.deletePop.close();
			},
			async confirm() {
				this.$refs.deletePop.close();
				if (!ship.btnRepeat()) return;
				try{
					uni.showLoading({
						title: '删除中...'
					})
					var willDelIndex = this.willDelIndex;
					var bankArr = this.bankArr;
					var willDel = bankArr[willDelIndex];
					willDel.userId = this.userId;
					var res = await ship.postRequest("/md/user-bank/unbind/relation", willDel)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						bankArr.splice(willDelIndex, 1);
						this.bankArr = bankArr;
						this.$forceUpdate();
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading()
					//TODO handle the exception
				}
			},
			deleteMember(index) {
				this.willDelIndex = index;
				this.$refs.deletePop.open();
			},
			
			goAddBank() {
				var that = this;
				var bankArr = this.bankArr;
				bankArr.forEach(item => {
					item.txtStyle = "left: 0"
				})
				this.bankArr = bankArr;
				uni.navigateTo({
					url: '/pages/my/myBank/addBank',
					success() {
						that.$forceUpdate()
					}
				})
			},
			showAllMsg(item, key) {
				this.bankArr[key].showAll = !this.bankArr[key].showAll;
				this.$forceUpdate();
			},
			checkIdNo(msg) {
				let fontMsg = msg.substring(0,6)
				let lastMsg = msg.substring(msg.length - 4,msg.length);
				return fontMsg + '******' + lastMsg;
			},
			checkMobile(msg) {
				let fontMsg = msg.substring(0,3)
				let lastMsg = msg.substring(msg.length - 4,msg.length);
				return fontMsg + '****' + lastMsg;
			},
			checkName(msg) {
				if (!msg) return "";
				if (msg.length < 3) {
					let fontMsg = msg.substring(0,1)
					return fontMsg + '*'
				} 
				
				let fontMsg = msg.substring(0,1) + '*' + msg.substring(msg.length - 1, msg.length)
				return fontMsg;
			},
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background-color: #F3F3F3;
		min-height: 100vh;
		padding: 24rpx 32rpx;
		box-sizing: border-box;
	}
	.member-list-li{
	    margin-bottom: 24rpx;
		overflow: hidden;
		height: 228rpx;
		&:nth-child(3n + 1) {
			.list-touch {
				background-image: url(https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/bank_bg_1.png);
				background-size: cover;
			}
			
		}
		&:nth-child(3n + 2) {
			.list-touch {
				background-image: url(https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/bank_bg_2.png);
				background-size: cover;
			}
		
		}
		&:nth-child(3n + 3) {
			.list-touch {
				background-image: url(https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/bank_bg_3.png);
				background-size: cover;
			}
			
		}
		.list-touch{
			display: flex;
			align-items: center;
			height: 228rpx; 
			.showAllBtn {
				height: 228rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 44rpx;
				flex-shrink: 0;
				.showIcon {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}
	.bankDetails {
		height: 512rpx;
		background-color: #FFF;
		box-shadow: 0px 0px 16rpx 2rpx rgba(71,71,71,0.13);
		.detailList + .detailList {
			border-top: 2rpx solid #F0F0F0;
		}
		.detailList {
			margin-left: 44rpx;
			padding-right: 42rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				flex-shrink: 0;
				margin-right: 32rpx;
			}
			.msg {
				flex:1;
				text-align: right;
				font-size: 26rpx;
				font-weight: 400;
				color: #666666;
			}
		}
		.deleteBankBtn {
			margin: 10rpx auto 0 auto;
			width: 234rpx;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
			border-radius: 8rpx;
			background-color: #BCBCBC;
			text-align: center;
		}
	}
	
	.member-box-name {
		padding: 34rpx 64rpx;
		box-sizing: border-box;
		.member-title {
			color:#FFF;
		}
	}
	.member-box-card {
		padding: 34rpx 64rpx;
		box-sizing: border-box;
		.member-cardno {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.cardno-item {
				margin-right: 40rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				.dotted {
					width: 12rpx;
					height: 12rpx;
					background-color: #FFFFFF;
					border-radius: 12rpx;
					margin-right: 8rpx;
				}
			}
			.account {
				color:#FFF;
			}
		}
	}
	.fix-bottom {
		width: 100%;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding: 0 38rpx;
		height: 158rpx;
		box-sizing: border-box;
		border-radius: 8rpx;
		.icon {
			width: 38rpx;
			height: 38rpx;
			margin-right: 34rpx;
		}
		.fix-text {
			color: #333333;
			font-size: 32rpx;
		}
	}
	.arriveContent {
		width: calc(100vw - 128rpx);
		height: 290rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		.btn {
			height: 92rpx;
			display: flex;
			flex-direction: row;
			border-top: 1px solid #F3F3F3;
			.item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				&.cancel {
					color: #777777;
					border-right: 1px solid #F3F3F3;
				}
				&.confirm {
					color: #0171F9;
				}
			}
		}
		.content {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #777777;
			font-size: 32rpx;
		}
	}
</style>
