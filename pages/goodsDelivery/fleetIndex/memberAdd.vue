<template>
	<view class="all">
		<view class="searchAdd">
			<input type="number" v-model="mobile" maxlength="11" @input="onInput" class="input-box" placeholder="请输入手机号" />
			<image class="search-img" src="/static/images/searchAdd.png" mode="" @click="selectUser"></image>
		</view>
		<view class="user-box" v-if="userInfoObj.id">
			<view class="user-name">{{userInfoObj.userName}}</view>
			<view class="user-phone">{{userInfoObj.mobile}}</view>
			<view class="user-add" @click="checkFleetAdminMemberStatus()">邀请</view>
		</view>
		
		<uni-popup ref="noSourceNumPopup" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle">提示</view>
					<view class="mainContent">您车队人数已经达到上限啦，快来点击下面了解详情吧</view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">
						<view class="msg">开通会员，可邀请{{mealBaseInfo ? mealBaseInfo : 0}}位司机加入您的车队</view>
						<view class="toBuyBtn">
							<view class="btnText">去购买</view>
							<image class="membersRightIcon" src="/static/images/vehicleOptions/membersRight.png"></image>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="feetMemberHintPopup" type="center">
			<view class="fleetAddMsgPopUp">
				<view class="fleetAddMsg">{{memberHintMsg}}</view>
				<view class="fleetAddMsgBtn" @click="closeFleetMemberHintPopup">我知道了</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship.js"
	export default {
		data (){
			return {
				mobile: '',
				userInfoObj: {},
				fleetId: 0,
				userRole: 0,
				info: {},
				userInfo: {},
				fleetmemsize: '',
				mealBaseInfo: 0,
				memberHintMsg: ''
			}
		},
		onLoad(options) {
			let that = this;
			that.fleetId = JSON.parse(options.info).id;
			that.info = JSON.parse(options.info);
			console.log(that.info);
			that.userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			this.getMealBaseList(); // 会员套餐
		},
		methods: {
			onInput(){
				this.userInfoObj = {};
				if(this.mobile.length>10){
					this.selectUser();
				}
			},
			selectUser(){
				let that = this;
				console.log(that.mobile);
				if(!that.mobile){
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return
				}
				if(that.mobile.length < 11){
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return
				}
				ship.postRequest('/yh/business/user/select/user/info/by/mobile', {
					mobile: that.mobile,
				})
				.then(res=>{
					console.log('用户', res)
					if(res.retCode == "0000000"){
						that.userInfoObj = res.rspBody;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					
				})
			},
			getMealBaseList() { // 会员套餐列表
				let params = {
					"setmfree": "0",
					"setmrole": "cargo",
					"setmchannel": "app",
					setmdisp: 1,
				}
				console.log('会员套餐参数', params);
				let that = this;
				ship.postRequest('/cp/set/meal/base/list', params)
				.then(function (res) {
					console.log('会员套餐结果', res);
					if(res.retCode == '0000000'){
						let rspBody = res.rspBody;
						that.mealBaseInfo = 0;
						let defvalAry = [];
						if(rspBody && rspBody.length > 0) {
							let items = rspBody[rspBody.length - 1];
							let setmitemsJson = items.setmitems.replace(/\//g, '');
							let obj = JSON.parse(setmitemsJson);
							that.mealBaseInfo = Number(obj.fleetmemsize.defval);
							console.log('套餐可加入车队人数', that.mealBaseInfo);
							// uni.hideLoading();
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('会员套餐请求失败', res.retDesc);
				})
			},
			checkFleetAdminMemberStatus() { // 套餐二期权限判断
				if( this.info.ext3 && (this.info.ext3 == 'SUPER_FLEET' || this.info.ext3 == '平台')) {
					this.memberUserAdd();
				}else {
					let params = {
						"usersid": this.info.userId,
						"setmchannel": "app"
					}
					console.log('剩余条数费参数', params);
					let that = this;
					ship.postRequest('/cp/member/queryByUser', params)
					.then(function (res) {
						console.log('剩余条数结果', res);
						if(res.retCode == '0000000'){
							let noteStr = res.rspBody.setmitems;
							noteStr = noteStr.replace(/\//g, '');
							noteStr = JSON.parse(noteStr);
							console.log('JSON剩余条数结果', noteStr);
							that.fleetmemsize = Number(noteStr.fleetmemsize.nowsurnum);
							if(that.fleetmemsize < 1) {
								if(that.info.isOwner) { // 当前为车队长
									if(that.info.serviceType == 20) { // 车队长角色为货主
										that.$refs.noSourceNumPopup.open();
									}else { // 车队长角色为司机
										that.memberHintMsg = '您当前车队人数达到最大上限。需要扩充人数，请联系400-016-0606';
										that.$refs.feetMemberHintPopup.open();
									}
								}else if(that.info.isAdmin) { // 当前为管理员
									if(that.info.serviceType == 20) { // 车队长角色为货主
										that.memberHintMsg = '当前车队人数已经达到上限啦～快让车队创建人去充值会员吧';
										that.$refs.feetMemberHintPopup.open();
									}else { // 车队长角色为司机
										that.memberHintMsg = '您当前车队人数达到最大上限。需要扩充人数，请联系400-016-0606';
										that.$refs.feetMemberHintPopup.open();
									}
								}else if(that.info.isMember) { // 当前为成员
									that.memberHintMsg = '当前车队人数已经达到上限啦～快让车队创建人去充值会员吧';
									that.$refs.feetMemberHintPopup.open();
								}
							}else {
								that.memberUserAdd();
							}
						} else{
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						console.log('剩余条数请求失败', res.retDesc);
					})
				}
			},
			closeFleetMemberHintPopup() {
				this.$refs.feetMemberHintPopup.close();
			},
			memberUserAdd(){
				let that = this;
				uni.showLoading({
					title: '请稍后...',
					mask: true,
				})
				console.log(that.info, 'asasasas', that.userInfo);
				console.log({
					fleetId: that.fleetId,
					userId: that.userInfoObj.id,
					userCode: that.userInfoObj.userCode,
					commonUserId: this.userInfo.userId,
					commonUserName: this.userInfo.userName,
					fleetName: that.info.name
				})
				ship.postRequest('/cd/fleetWithUser/save', {
					fleetId: that.fleetId,
					userId: that.userInfoObj.id,
					userCode: that.userInfoObj.userCode,
					commonUserId: this.userInfo.userId,
					commonUserName: this.userInfo.userName,
					fleetName: that.info.name
				})
				.then(res=>{
					uni.hideLoading();
					console.log(res, res.retCode)
					if(res.retCode == "0000000"){
						if(that.info.isAdmin || that.info.isOwner){
							that.getMemberConnectionStatus();
						} else {
							if(that.info.verificationMethod){
								if(that.info.verificationMethod==1){
									that.getMemberConnectionStatus();
								} else {
									uni.showToast({
										title: '已邀请',
										icon: 'none'
									})
								}
							} else {
								uni.showToast({
									title: '该车队不允许加入',
									icon: 'none'
								})
							}
						}
						uni.$emit('memberRefresh');
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
				})
			},
			getMemberConnectionStatus() {
				let avatar = this.userInfoObj && this.userInfoObj.avatar ? this.userInfoObj.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png';
				let params = {
					"appkey": "PR-c3630a3901384a47813a7f5151a12926",
					"type": "text",
					"senderId": "cargoSystemAdmin",
					"senderData": {"avatar":"../../../static/images/goodsDelivery/fleet-head.png", 'name':'cargoSystemAdmin'},
					"to": {
					    "type": "private",
					    "id": this.userInfoObj.userCode,
					    "data": {"avatar": avatar, "name": this.userInfoObj.userName}
					},
					"payload": this.info.code
				}
				uni.request({
					url: 'http://rest-hangzhou.goeasy.io/v2/im/message',
					data: params,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
					},
					success: function(res) {
						console.log('请求成功', res);
						uni.showToast({
							title: '邀请成功',
							icon: 'none'
						})
						setTimeout(()=>{
							uni.navigateBack()
						}, 1000)
					},
					fail: function(err) {
						console.log('请求失败', err)
					}
				});
			},
			jumpToUserMember() { // 跳转会员列表
				this.$refs.noSourceNumPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage?pageName=sourceIndex'
				})
			},
			closeNoNumPopup() { // 关闭充值弹窗
				this.$refs.noSourceNumPopup.close();
			},
		}
	}
</script>

<style lang="scss">
	.all{
		.searchAdd{
			position: relative;
			.input-box{
				border: 2rpx solid #0171F9;
				margin: 0 32rpx;
				padding: 16rpx 20rpx;
				border-radius: 8rpx;
				font-size: 28rpx;
			}
			.search-img{
				position: absolute;
				width: 42rpx;
				height: 40rpx;
				top: 16rpx;
				right: 52rpx;
			}
		}
		.user-box{
			margin-top: 48rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			.user-name{
				width: 144rpx;
				font-size: 30rpx;
				color: #333;
				font-weight: 600;
			}
			.user-phone{
				width: 380rpx;
				color: #777;
				font-size: 26rpx;
			}
			.user-add{
				width: 164rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				color: #0171F9;
				border: 2rpx solid #0171F9;
				border-radius: 8rpx;
				font-size: 26rpx;
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
		.noSourceNumBox {
			width: 630rpx;
			.closeIcon {
				width: 48rpx;
				height: 48rpx;
				display: block;
				margin: 0 0 10rpx 582rpx;
			}
			.msgBox {
				width: 630rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				box-sizing: border-box;
				padding: 38rpx 0;
				.mainTitle {
					font-size: 40rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
				}
				.mainContent {
					margin-top: 30rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
					padding: 0 54rpx;
				}
				.singleTouUpBtn {
					height: 80rpx;
					padding: 0 18rpx 0 26rpx;
					margin: 44rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #E55516 0%, #EE9456 100%);
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 44rpx;
					}
					.sigleRightIcon {
						height: 30rpx;
						width: 30rpx;
						display: block;
					}
				}
				.memberTouUpBtn {
					height: 92rpx;
					padding: 0 18rpx 0 12rpx;
					margin: 20rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #31313F 0%, #1F1F28 100%);
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #F0AB88;
						line-height: 44rpx;
						text-align: center;
					}
					.toBuyBtn {
						flex-shrink: 0;
						margin-left: 6rpx;
						width: 128rpx;
						height: 48rpx;
						border-radius: 228rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: linear-gradient(90deg, #F1D7C8 0%, #F0A27C 100%);
						.btnText {
							font-size: 28rpx;
							font-weight: 500;
							color: #422507;
						}
						.membersRightIcon {
							width: 28rpx;
							height: 28rpx;
							display: block;
						}
					}
				}
			}
		}
	}
</style>
