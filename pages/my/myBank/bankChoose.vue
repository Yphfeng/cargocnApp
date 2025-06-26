<template>
	<view class="container">
		<view class="content">
			<view class="member-list-li clearfix" v-for="(item,index) in bankArr" :id="item.id" @click="chooseBank(index)" :class="{chooseActive: index == chooseIndex}">
				<view class="touch-list list-touch clearfix" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :data-index="index" :style="item.txtStyle ? item.txtStyle : commonStyle">
					<view class="member-box-name clearfix">
						<view class="member-title phone">
							{{item.bank}}
							 <text style="padding-left: 20rpx;">{{checkName(item.accountName)}}</text>
						</view>
					</view>
					<view class="member-box-card">
						<view class="member-cardno">
							<view class="cardno-item">
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
							</view>
							<view class="cardno-item">
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
							</view>
							<view class="cardno-item">
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
								<view class="dotted" />
							</view>
							<view class="account">{{showAccount(item.account)}}</view>
						</view>
					</view>
				</view>
				<view class="touch-list list-delete" @click.stop= "deleteMember(index)" >
					删除
				</view>
			</view>
		</view>
		<view class="fix-bottom">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/addBank.png" class="icon"></image>
			<view class="fix-text" @click="goAddBank">添加银行卡</view>
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
				chooseIndex: -1,
			}
		},
		onPullDownRefresh() {
			if (!ship.btnRepeat()) {
				uni.stopPullDownRefresh();
				return
			};
			this.init();
		},
		onLoad(options) {
			var userRole = uni.getStorageSync("userRole");
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) return;
			var userId = userRole == 1 ? JSON.parse(userInfo).userId : JSON.parse(userInfo).userId;
			this.userId = userId;
			this.chooseIndex = options.bankIndex == undefined ? -1 : options.bankIndex;
		},
		onShow() {
			this.chooseIndex = -1;
			this.init();
		},
		methods: {
			checkName(msg) {
				if (!msg) return "";
				if (msg.length < 3) {
					let fontMsg = msg.substring(0,1)
					return fontMsg + '*'
				} 
				
				let fontMsg = msg.substring(0,1) + '*' + msg.substring(msg.length - 1, msg.length)
				return fontMsg;
			},
			showAccount(account) {
				return account.substr(account.length - 4, account.length);
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
					}
					this.$forceUpdate();
				}catch(e){
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			
			touchS: function (e) {
				// console.log('touchS')
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX
					console.log(this.startX)
				}
			},
			touchM: function (e) {
				 // console.log('touchM')
				if (e.touches.length == 1) {
					//手指移动时水平方向位置
					var moveX = e.touches[0].clientX;
					//手指起始点位置与移动期间的差值
					var disX = this.startX - moveX;
					var delBtnWidth = this.delBtnWidth;
					var txtStyle = "";
					if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
						txtStyle = "left:0px";
					} else if(disX > 0){//移动距离大于0，文本层left值等于手指移动距离
						txtStyle = "left:-" + disX + "px";
						if (disX >= delBtnWidth) {
							//控制手指移动距离最大值为删除按钮的宽度
							txtStyle = "left:-" + delBtnWidth + "px";
						}
					}
					//获取手指触摸的是哪一项
					var index = e.currentTarget.dataset.index;
					var list = this.bankArr;
					list[index].txtStyle = txtStyle;
					console.log(list[index].txtStyle)
					//更新列表的状态
					this.bankArr = list;
					this.$forceUpdate();
				}
			},
			touchE: function (e) {
				// console.log('touchE')
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					//触摸开始与结束，手指移动的距离
					var disX = this.startX - endX;
					var delBtnWidth = this.delBtnWidth;
					//如果距离小于删除按钮的1/2，不显示删除按钮
					var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
					//获取手指触摸的是哪一项
					var index = e.currentTarget.dataset.index;
					var list = this.bankArr;
					list[index].txtStyle = txtStyle;
					console.log(list[index].txtStyle)
					//更新列表的状态{
					this.bankArr = list
					this.$forceUpdate();
				}
			},
			cancel() {
				this.$refs.deletePop.close();
			},
			chooseBank(index) {
				this.chooseIndex = index;
				var bankArr = this.bankArr;
				var chooseItem = bankArr[index];
				uni.navigateBack({
					delta: 1
				})
				var chooseObj = {
					chooseItem,
					chooseIndex: index,
				}
				uni.$emit("chooseBank", chooseObj);
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
			}
		}
	}
</script>

<style scoped lang="scss">
	.noData {
		margin-bottom: 20rpx;
	}
	.container {
		background-color: #F3F3F3;
		min-height: 100vh;
		padding: 24rpx 32rpx 200rpx;
		box-sizing: border-box;
		overflow-x: hidden;
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
	}
	.fix-text {
		color: #333333;
		font-size: 32rpx;
	}
	.member-list-li{
	    position: relative; 
	    margin-bottom: 24rpx;
	    border: 1px solid #EEEEEE;
	    color: #fff;
		overflow: hidden;
		height: 228rpx;
		width: 100%;
		box-sizing: border-box;
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
	}
	.touch-list{
	    position: absolute; 
	    top:0;
	    overflow: hidden;
	}
	.list-touch{
		height: 228rpx;
	    position: relative;
	    width: 100%;   
	    z-index: 5;    
	    transition: left 0.2s ease-in-out;   
	    white-space:nowrap;   
	    overflow:hidden;
	    text-overflow:ellipsis;
	}
	.list-delete{
	    right: 0; 
	    width: 70px;
	    height: 228rpx;
	    background-color: #EA5863;
	    color: #fff;
	    font-size: 28rpx;
	    font-weight: bold;
		line-height: 228rpx;
		text-align: center;
	}
	.member-box-name {
		padding: 34rpx 96rpx;
		box-sizing: border-box;
	}
	.member-box-card {
		padding: 34rpx 96rpx 0;
		box-sizing: border-box;
	}
	.member-cardno {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.cardno-item {
		margin-right: 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.dotted {
		width: 12rpx;
		height: 12rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		margin-right: 8rpx;
	}
	.member-box-card {
		
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
