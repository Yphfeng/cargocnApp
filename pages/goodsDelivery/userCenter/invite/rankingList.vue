<template>
	<view class="all">
		<view class="all-box">
			<image class="codeBackground" src="/static/images/goodsDelivery/codeBackground.png" mode=""></image>
		</view>
		<view class="content-box">
			<image class="codeTitle" src="/static/images/goodsDelivery/codeTitle.png" mode=""></image>
		</view>
		<view class="deliverySelectBox">
			<view class="selectBtn" :class="selectFlag == 1 ? 'leftBtnSelected' : 'leftBtnDefault'" @tap="changeDelivery(1)">
				<view class="select-title">货主</view>
				<view class="select-line" :style="selectFlag ==1?'opacity:1':'opacity:0'"></view>
			</view>
			<view class="selectBtn" :class="selectFlag == 2 ? 'rightBtnSelected' : 'rightBtnDefault'" @tap="changeDelivery(2)">
				<view class="select-title">司机</view>
				<view class="select-line" :style="selectFlag ==2?'opacity:1':'opacity:0'"></view>
			</view>
			<view
				class="deliverySelectBc"
				:style="selectFlag == 1 ? 'border-top-right-radius:12rpx;' : 'border-top-left-radius:12rpx;right:64rpx;'">
			</view>
		</view>
		<view
			class="mainBox"
			:style="selectFlag == 1 ? 'border-top-right-radius:12rpx;' : 'border-top-left-radius:12rpx;'"
			style="border-bottom-left-radius:12rpx;border-bottom-right-radius:12rpx;">
			<scroll-view v-if="recordArr.length != 0" scroll-y="true" style="height: 80%;" @scrolltolower="scrolltolower">
				<view class="">
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<!-- <view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view>
					<view class="data-child" v-for="item in recordArr">
						<view class="">{{item.mobile?setPhone(item.mobile):'-'}}</view>
						<view class="">{{item.invitationTime}}</view>
					</view> -->
				</view>
			</scroll-view>
			<view class="">
				<view class="invite-box" v-if="recordArr.length != 0">
					<view class="">成功邀请</view>
					<view class="invite-num">{{sumNum1+sumNum2}}名</view>
					<view class="">用户注册</view>
				</view>
				<view class="not-data" v-else>
					<image class="not-img" src="/static/images/goodsDelivery/notCode.png" mode=""></image>
					<view class="not-text">暂无用户注册</view>
				</view>
			</view>
		</view>
		<view class="" style="width: 100%; height: 30rpx;"></view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js"
	export default {
		data() {
			return {
				userInfo: {},
				selectFlag: 1,
				userRole: '',
				recordArr: [],
				pageSize: 20,
				pageNum: 1,
				total: 0,
				sumNum1: 0,
				sumNum2: 0,
			}
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			if(userInfo){
				this.userInfo = JSON.parse(userInfo)
			}
			this.userRole = uni.getStorageSync('userRole');
			this.recordArr =  [];
			this.rankItems(1); //获取
			this.rankItems2(2); //司机
			// this.rankItems(2);
		},
		// onPullDownRefresh() { // 下拉刷新
		// 	console.log('下拉刷新');
		// 	this.recordArr = [];
		// 	this.pageNum = 1;
		// 	this.rankItems();
		// },
		onReachBottom(){
			
		},
		methods:{
			scrolltolower(e){
				console.log(e)
				var that = this;
				if(e.target.direction == 'bottom'){
					if(that.total == that.recordArr.length){
						return;
					}
					that.pageNum = that.pageNum + 1;
					that.rankItems(that.selectFlag);
				}
			},
			setPhone(str){
				var pat=/(\d{3})\d*(\d{4})/
				var b=str.replace(pat,'$1****$2');
				return b
			},
			changeDelivery(flag) { // 发货车型选择
				if(this.selectFlag == flag){
					return;
				}
				this.selectFlag = this.selectFlag == flag ? this.selectFlag : flag;
				this.pageNum = 1;
				this.recordArr = [];
				this.rankItems(flag);
			},
			rankItems2(num) {
				var that = this;
				var params = {
					serviceType: num == 1 ? 20:10,
					invitationCode: that.userInfo.attrs.userCode,
					pageSize: that.pageSize,
					pageNum: that.pageNum,
				}
				console.log(params, '邀请码参数11')
				utils.postRequest('/yh/business/user/select/business/invitation/code', {
					serviceType: num == 1 ? 20:10,
					invitationCode: that.userInfo.attrs.userCode,
					pageSize: that.pageSize,
					pageNum: that.pageNum,
				})
				.then(res=>{
					if(res.retCode == "0000000"){
						console.log(res)
					
						if(num == 1){
							that.sumNum1 = Number(res.rspBody.total);
						} else {
							that.sumNum2 = Number(res.rspBody.total);
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err=>{
					
				})
			},
			rankItems(num, type){
				var that = this;
				that.recordArr = [];
				var params = {
					serviceType: num == 1 ? 20:10,
					invitationCode: that.userInfo.attrs.userCode,
					pageSize: that.pageSize,
					pageNum: that.pageNum,
				}
				console.log(params, '邀请码参数11')
				utils.postRequest('/yh/business/user/select/business/invitation/code', {
					serviceType: num == 1 ? 20:10,
					invitationCode: that.userInfo.attrs.userCode,
					pageSize: that.pageSize,
					pageNum: that.pageNum,
				})
				.then(res=>{
					if(res.retCode == "0000000"){
						console.log(res)
					
						if(num == 1){
							that.sumNum1 = Number(res.rspBody.total);
						} else {
							that.sumNum2 = Number(res.rspBody.total);
						}
						that.recordArr = that.recordArr.concat(res.rspBody.items);
						that.total = res.rspBody.total;
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err=>{
					
				})
				// uni.stopPullDownRefresh();
			}
		}
	}
</script>

<style lang="scss">
	.all{
		.all-box{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(360deg, #F29347 0%, #FFBD88 100%);
			opacity: 0.95;
			z-index: -1;
			.codeBackground{
				position: fixed;
				top: 0;
				left: 0;
				width: 292rpx;
				height: 316rpx;
			}
		}
		.content-box{
			display: flex;
			flex-direction: column;
			align-items: center;
			.codeTitle{
				width: 562rpx;
				height: 182rpx;
				margin-top: 86rpx;
			}
		}
		.deliverySelectBox {
			height: 100rpx;
			// margin: 0 64rpx;
			position: fixed;
			top: 300rpx;
			left: 64rpx;
			right: 0;
			// 718
			.selectBtn {
				font-weight: bold;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: flex-end;
			}
			.select-title{
				padding-bottom: 20rpx;
			}
			.select-line{
				width: 124rpx; 
				height: 4rpx; 
				background-color: #fff;
			}
			@keyframes leftSelectedAnimation {
			    0% {
			        color:rgba(51, 51, 51, 0.51);
			        height: 100rpx;
			        margin-top:13rpx;
			        box-shadow: -18rpx 64rpx -14rpx -6rpx rgba(0,0,0,0.11);
			        width:340rpx;
			        position: absolute;
			        z-index: 100;
			        border-top-left-radius:12rpx;
			    }
			    100% {
			        color: #fff;
			        height: 100rpx;
			        background: linear-gradient(-130deg, transparent 70rpx, #F27C47 0);
			        width:340rpx;
			        position: absolute;
			        z-index: 100;
			        border-top-left-radius:12rpx;
			    }
			}
			.leftBtnSelected {
				animation: leftSelectedAnimation 0.2s;
				color: #fff;
				height: 100rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
				background: linear-gradient(-130deg, transparent 70rpx, #F27C47 0);
				box-sizing: border-box;
				width:340rpx;
				position: absolute;
				z-index: 100;
				border-top-left-radius:12rpx;
			}
			.leftBtnDefault {
				color:rgba(51, 51, 51, 0.51);
				height: 88rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
				box-sizing: border-box;
				margin-top:13rpx;
				box-shadow: -18rpx 64rpx -14rpx -6rpx rgba(0,0,0,0.11);
				width:340rpx;
				position: absolute;
				z-index: 100;
				border-top-left-radius:12rpx;
			}
			@keyframes rightSelectedAnimation {
			    0% {
					height: 100rpx;
					margin-top:13rpx;
					box-shadow: -18rpx 64rpx -14rpx -6rpx rgba(0,0,0,0.11);
					width:340rpx;
					position: absolute;
					z-index: 100;
					border-top-right-radius:12rpx;
			    }
			    100% {
					color: #fff;
					height: 100rpx;
					background: linear-gradient(130deg, transparent 70rpx, #F27C47 0);
					width:340rpx;
					position: absolute;
					z-index: 100;
					border-top-right-radius:12rpx;
			    }
			}
			.rightBtnSelected {
				animation: rightSelectedAnimation 0.2s;
				color: #fff;
				right:64rpx;
				height: 100rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-end;
				background: linear-gradient(130deg, transparent 70rpx, #F27C47 0);
				width:340rpx;
				box-sizing: border-box;
				position: absolute;
				z-index: 100;
				border-top-right-radius:12rpx;
			}
			.rightBtnDefault {
				color:rgba(51, 51, 51, 0.51);
				right:64rpx;
				height: 88rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
				box-sizing: border-box;
				width: 340rpx;
				margin-top:13rpx;
				box-shadow: -18rpx 64rpx -14rpx -6rpx rgba(0,0,0,0.11);
				padding-top:6rpx;
				position: absolute;
				z-index: 100;
				border-top-right-radius:12rpx;
			}
			.deliverySelectBc {
				background-color: #ECECEC;
				height: 88rpx;
				margin-top:13rpx;
				width:590rpx;
				position: absolute;
				z-index: 99;
				box-shadow: -18rpx 64rpx -14rpx -6rpx rgba(0,0,0,0.11);
			}
		}
		.mainBox {
			margin-left: 64rpx;
			margin-right: 64rpx;
			padding:32rpx 30rpx;
			background-color: #F27C47;
			position: fixed;
			top: 400rpx;
			left: 0;
			right: 0;
			bottom: 30rpx;
			.data-child{
				display: flex;
				justify-content: space-between;
				color: #fff;
				border-bottom: 2rpx solid #FFAD6B;
				padding: 36rpx 0 12rpx 0;
				font-size: 24rpx;
			}
			.invite-box{
				display: flex;
				margin-top: 144rpx;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				color: #fff;
				.invite-num{
					color: #F3D272;
				}
			}
			.not-data{
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.not-img{
					width: 360rpx; 
					height: 228rpx;
					margin: 130rpx 0;
				}
				.not-text{
					font-size: 32rpx;
					color: #FFCDA4;
				}
			}
		}
	}
</style>
