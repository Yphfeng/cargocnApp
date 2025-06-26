<template>
	<view class="fleetSearch">
		<view class="flleetHead">
			<view class="backIconBox" @click="toBack()">
				<image class="backIcon" src="../../../static/images/goodsDelivery/whiteBackIcon.png"></image>
			</view>
			<view class="headBtnGroup">
				<!-- <view class="scanBox" @click="scanCodeEvent">
					<image class="scanCode" src="/static/images/goodsDelivery/scanCode.png"></image>
					<view class="scanLine"></view>
				</view> -->
				
				<view class="searchInputBox">
					<input class="searchInput" v-model="searchVal" :focus="inputFocus" @confirm="getFleetList()" placeholder-style="font-size:28rpx;color:#AEAEAE" :placeholder="inputHint"/>
					<image class="clearIcon" v-if="searchVal" @click="clearSearch()" src="../../../static/images/close2.png"></image>
				</view>
				
				<view class="searchIconBox" @click="getFleetList()">
					<image class="searchIcon" src="../../../static/images/goodsDelivery/search.png"></image>
				</view>
			</view>
		</view>
		
		<view class="flleetListBox" v-for="(item, index) in searchData" :key="index">
			<view class="listItem">
				<view class="teamImage" @click="jumpToFleetDetails(item)">
					<image :src="item.badgeImage ? item.badgeImage : '/static/images/goodsDelivery/fleet-head.png'" class="fleet-logo"></image>
				</view>
				<view class="teamDetails">
					<view class="detailTitle" v-if="userRole == 1">
						<view class="teamName" @click="jumpToFleetDetails(item)">{{item.name}}</view>
						<view class="hasFocused" v-if="item.isOwner || item.isMember == 1" @click="jumpToFleetDetails(item)">已加入</view>
						<view class="focusBtn" v-if="item.isMember != 1 && item.verificationMethod" @click.stop="joinFleet(item)"><text>+</text>加入</view>
					</view>
					<view class="detailTitle" v-if="userRole == 2">
						<view class="teamName" @click="jumpToFleetDetails(item)">{{item.name}}</view>
						<view class="hasFocused" v-if="item.isCooperate == 1 && !item.isOwner" @click.stop="fleetOut(item)">已关注</view>
						<view class="focusBtn" v-if="!item.isOwner  && item.isCooperate != 1" @click.stop="effectiveSupply(item)"><text>+</text>关注</view>
					</view>
					<view class="teamTagBox" @click="jumpToFleetDetails(item)">
						<view class="tag" style="background: #F29D51;" v-if="item.memberNum">{{item.memberNum}}人</view>
						<view class="tag" style="background: #73A8E8;" v-if="item.cartLength">{{item.cartLength}}米</view>
						<view class="tag" style="background: #84D67A;" v-if="item.fleetAttributes">{{item.fleetAttributes}}</view>
					</view>
					<view class="teamIntroduce" @click="jumpToFleetDetails(item)">{{item.introduction}}</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popupOut" type="center" :maskClick="true">
			<view class="out">
				<view class="title">温馨提示</view>
				<view class="text">确定{{userRole == 1 ? '退出' : '取消关注'}}车队吗？</view>
				<view class="bot">
					<view class="cancel" @click="cancelOut">取消</view>
					<view class="confirm" @click="confirmOut">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<view class="loadingBox" v-show="noData">
			<image class="noDataIcon" src="../../../static/images/goodsDelivery/noDataIcon.png"></image>
		</view>
		<view class="loadingBox" v-show="noMore">
			没有更多了～
		</view>
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../static/images/listLoading.png"></image>
			努力加载中…
		</view>
		<uni-popup ref="fleetAddMsgPopUp" type="center">
			<view class="fleetAddMsgPopUp">
				<view class="fleetAddMsg">当前车队人数已达上限，不可加入。</view>
				<view class="fleetAddMsgBtn" @click="closeFleetAddMsg">我知道了</view>
			</view>
		</uni-popup>
		<joinFleet ref="joinFleet"></joinFleet>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import joinFleet from "../../ship/fleet/joinFleet.vue"
	import { debounce1 } from "@/utils/utils.js"
	export default {
		components:{
			joinFleet
		},
		data() {
			return {
				outItem: {},
				searchVal: '',
				searchData: [],
				noData: false,
				noMore: false,
				isLoading: false,
				userRole: '',
				inputHint: '',
				inputFocus: false,
				pageNum: 1,
				pageSize: 10,
			};
		},
		onLoad(option) {
			this.userRole = uni.getStorageSync('userRole');
			if(option.hotKey) {
				this.inputHint = option.hotKey;
			}else {
				this.inputHint = '请输入';
			}
			this.getFleetList();
		},
		onReady() {
			this.inputFocus = true;
		},
		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getFleetList();
		},
		onReachBottom() { // 上拉加载
			console.log('上拉加载');
			this.fleetOnLoad();
		},
		methods: {
			closeFleetAddMsg() {
				this.$refs.fleetAddMsgPopUp.close();
			},
			joinFleet(item){
				var that = this;
				console.log(item,'item')
				that.optItem = item;
				that.fleetAddThrottle();
			},
			fleetAddThrottle: debounce1(function() {
				var that = this;
				var item = that.optItem;
				if(item.ext3 && item.ext3 == 'SUPER_FLEET') {
					this.$refs.joinFleet.getCarList(item);	
					
				}else {
					var serviceType = item.serviceType;
					var userRole = this.userRole;
					if (item.verificationMethod == 1 && item.ext3 !== "SUPER_FLEET" && item.ext3 !== "平台" && userRole == 1) {
						//司机申请其他人自建的无需审核的普通车队
						utils.postRequest("/cp/member/queryByUser", {
							usersid: item.userId,
							"setmchannel": "app"
						}).then(res => {
							console.log("判断", res);
							if (res.retCode == "0000000") {
								var setmitems = res.rspBody.setmitems;
								var fleetmemsize = JSON.parse(setmitems).fleetmemsize;
								var nowsurnum = fleetmemsize.nowsurnum; //车队剩余条数
								if (nowsurnum < 1) {
									that.$refs.fleetAddMsgPopUp.open();
									return;
								}
								that.effectiveSupply(item)
							} else {
								uni.showToast({
									title: res.retDesc,
									icon: 'none'
								})
							}
						}).catch(err => {
							
						})
					} else {
						that.effectiveSupply(item)
					}
				}
			}),
			getFleetList() {
				if(this.isLoading) return;
				this.noData = false;
				this.noMoreData = false;
				this.isLoading = true;
				this.pageNum = 1;
				let params = {
					"pageSize": this.pageSize,
					"pageNum": this.pageNum,
					"keyword": this.searchVal ? this.searchVal : this.inputHint
				}
				console.log('车队列表请求参数', params);
				utils.newQueryPostRequest('/cd/fleet/list', params)
				.then(res=>{
					console.log('车队列表', res);
					if(res.retCode == '0000000') {
						this.searchData = res.rspBody.items;
						if(this.searchData && this.searchData.length == 0) {
							this.noData = true;
						}else if(this.searchData && this.searchData.length < this.pageSize) {
							this.noMoreData = true;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					this.isLoading = false;
				})
				.catch(err=>{
					console.log(err);
					this.isLoading = false;
				})
				uni.stopPullDownRefresh();
			},
			fleetOnLoad() { // 地址列表加载
				if(this.noData || this.noMoreData || this.isLoading) {
					return false;
				}
				this.isLoading = true;
				this.pageNum++;
				let params = {
					"pageSize": this.pageSize,
					"pageNum": this.pageNum,
					"keyword": this.searchVal ? this.searchVal : this.inputHint
				}
				let that = this;
				utils.newQueryPostRequest('/cd/fleet/list', params)
				.then(function (res) {
					console.log('列表数据', res);
					if(res.retCode == '0000000'){
						let items = res.rspBody.items;
						if(items && items.length > 0) {
							for(let i in items) {
								that.searchData.push(items[i]);
							}
						}else {
							that.noMoreData = true;
						}
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					that.isLoading = false;
				})
				.catch(err=>{
					that.isLoading = false;
				})
			},
			fleetOut(item) { //退出车队(车队删除成员)
				this.outItem = item;
				this.$refs.popupOut.open();
			},
			toBack() {
				uni.navigateBack();
			},
			clearSearch() {
				this.searchVal = '';
				this.searchData = [];
				this.noData = false;
				this.noMore = false;
			},
			scanCodeEvent(){ // 扫码
				var that = this;
				uni.scanCode({
					onlyFromCamera: false,
					success: function(res) {
						console.log(res)
						var data = decodeURIComponent(res.result);
						var resultObj = eval('('+data+')');
						console.log('扫码', resultObj)
						if(resultObj.fleetId){
							uni.$emit("scanForResult", {
								fleetId: resultObj.fleetId,
								isScan: 1
							});
						}
					},
					fail: function(err) {
						console.log(err)
					}
				});
			},
			cancelOut() { // 关闭退出车队弹窗
				this.$refs.popupOut.close();
			},
			//判断是否存在有效的货源时
			async effectiveSupply(item){
				console.log(item,'判断是否存在有效的货源时')
				try{
					uni.showLoading();
					var code = item.code;
					var res = await utils.postRequest("/cd/fleet/fleetGoods", {code: code});
					console.log(res,'判断是否有有效货源222')	
					uni.hideLoading();
					//有有效货源并且无需审核数据  直接跳转到车队货源页面
				  if(res.rspBody == 1 && item.verificationMethod == 1) {	
					  this.addFleet(item,'1');
					  uni.showToast({
					  	title: '已成功加入车队，3秒后为您跳转车队货源，快去找货吧~',
					  	icon: 'none',
					  	duration: 3000
					  })
					  uni.setStorageSync('fleetName', item.name);
					  
					  setTimeout(() => {
					  	uni.switchTab({
					  		url:'../../ship/index/index1'
					  	})
					  }, 3000)				  
					  
				  }else {
					   this.addFleet(item);
				  }
				}catch(e) {
					uni.hideLoading();
				}
			},
			async addFleet(item,flag) { // 关注车队
				try{
					uni.showLoading();
					var fleetId = item.id;
					let params = {
						fleetId: fleetId,
						status: this.userRole == 1 ? undefined : 3,
					}
					console.log('关注or加入参数', params)
					var res = await utils.postRequest("/cd/fleetWithUser/save", params);
					console.log('关注or加入结果', res)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						//如果是加入车队功能满足要跳转的条件 就不提示加入成功
						if(!flag) {
							if(this.userRole == 1) {
								uni.showToast({
									title: item.verificationMethod == 1 ? '已加入' : '已申请',
									icon: 'none'
								})
							}else {
								uni.showToast({
									title: '关注成功',
									icon: 'none'
								})
							}
						}
						
						this.getFleetList(); //刷新
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
			confirmOut() { // 退出车队
				this.$refs.popupOut.close();
				var outItem = this.outItem;
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
				utils.postRequest("/cd/fleetWithUser/remove", params)
				.then(res => {
					console.log(res, 'asa')
					uni.hideLoading();
					if (res.retCode == '0000000') {
						uni.showToast({
							title: "操作成功",
							icon: 'none',
						})
						this.getFleetList(); //刷新
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.hideLoading();
					console.log(err);
				})
			},
			jumpToFleetDetails(item) {
				// uni.navigateTo({
				// 	url: '/pages/goodsDelivery/fleetIndex/fleetDetails?info=' + JSON.stringify(item)
				// })
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(item)
				})
			}
		}
	}
</script>

<style lang="scss">
	.fleetSearch {
		// padding-top:304rpx; // 190 + 24
		padding-top:214rpx; // 190 + 24
		.flleetHead {
			background: linear-gradient(0deg, #1E52C4 0%, #497FFB 100%);
			padding: 108rpx 0 12rpx 0;
			position: fixed;
			width: 100vw;
			top: 0;
			left: 0;
			height: 70rpx;
			z-index: 99;
			display: flex;
			align-items: center;
			.backIconBox {
				flex-shrink: 0;
				padding: 0 24rpx 0 32rpx;
				.backIcon {
					width: 48rpx;
					height: 48rpx;
				}
			}
			.headBtnGroup {
				flex: 1;
				height: 70rpx;
				margin: 0 32rpx 0 0;
				background: #FFFFFF;
				border-radius: 8rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.scanBox{
					display: flex;
					align-items: center;
					flex-shrink: 0;
					.scanCode{
						width: 40rpx;
						height: 40rpx;
						margin: 0 0 0 24rpx;
					}
					.scanLine{
						margin: 0 0 0 24rpx;
						width: 2rpx;
						height: 30rpx;
						background-color: #AEAEAE;
					}
				}
				.searchIconBox {
					height: 70rpx;
					padding: 0 24rpx;
					border-left: 2rpx solid #AEAEAE;
					flex-shrink: 0;
					display: flex;
					align-items: center;
					.searchIcon {
						width: 40rpx;
						height: 40rpx;
					}
				}
				.searchInputBox {
					height: 70rpx;
					padding: 0 24rpx;
					flex: 1;
					display: flex;
					align-items: center;
					.searchInput {
						flex: 1;
						font-size: 28rpx;
						color:#333;
					}
					.clearIcon {
						height: 40rpx;
						width: 40rpx;
						flex-shrink: 0;
					}
				}
			}
		}
		.flleetListBox + .flleetListBox {
			margin-top: 24rpx;
		}
		.flleetListBox {
			margin-left: 24rpx;
			margin-right: 24rpx;
			padding: 12rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 8rpx 0px rgba(18,72,158,0.32);
			border-radius: 12rpx;
		}
		.listItem {
			display: flex;
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
	}
	.fleetAddMsgPopUp {
		background-color: #FFFFFF;
		width: 630rpx;
		height: 384rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 62rpx 50rpx 60rpx;
		box-sizing: border-box;
		border-radius: 24rpx;
		.fleetAddMsg {
			font-size: 40rpx;
			font-weight: 500;
			color: rgba(0, 0, 0, 1);
			line-height: 58rpx;
		}
		.fleetAddMsgBtn {
			width: 344rpx;
			height: 72rpx;
			border-radius: 12rpx;
			background-color: rgba(43, 114, 240, 1);
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 500;
		}
	}
</style>
