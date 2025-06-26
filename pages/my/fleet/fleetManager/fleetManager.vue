<template>
	<view class="fleetManange">
		<view class="newHeader">
			<view class="headBox">
				<i class="uni-btn-icon uniBtn" @click="backToFromPage()" style="color: rgb(255, 255, 255); font-size: 27px;"></i>
			</view>
		</view>
		<view class="fleetNameBox">
			<view class="fleetLogoBox">
				<view class="fleetLogo" @click="prevImage">
					<image :src="fleetDetail.badgeImage" class="logoImg" v-if="fleetDetail.badgeImage"></image>
					<image :src="defaultAvatar" class="logoImg" v-else></image>
				</view>
			</view>
			<view class="nameBox">
				<scroll-view scroll-x class="name">{{fleetDetail.name}}</scroll-view>
				<view class="fleetNumBox">
					<view class="num">车队号：{{fleetDetail.code}}</view>
				</view>
				
			</view>
		</view>
		
		<view class="mainBox mainMsgBox">
			<view class="subHint">{{fleetDetail.slogan || "暂无"}}</view>
			<view class="mainTitle">主要车型</view>
			<view class="carTypeList" v-if="fleetDetail.model.length > 0">
				<view class="carType" v-for="item in fleetDetail.model">{{item}}</view>
			</view>
			<view class="carTypeList" v-else>
				<view class="noCarType">
					暂无
				</view>
			</view>
			<view class="mainTitle">主要线路</view>
			<view class="carLineList">
				<view class="carLine" v-if="fleetDetail.route">{{fleetDetail.route}}</view>
				<view class="carLine" v-else>暂无</view>
				
			</view>
		</view>
		<view class="mainBox">
			<view class="memberTitle">
				<view class="title">车队成员</view>
				
				<view class="num" @tap="jumpToMemberList('manager')">
					查看{{total}}名群成员
					<image class="moreIcon" src="../../../../static/images/newRightIcon.png"></image>
				</view>
			</view>
			<view class="memberBox">
				<view class="mamberList" v-for="item in fleetMember">
					<view class="mamberAvatar">
						<image :src="item.avatar" class="avatar" v-if="item.avatar"></image>
						<image src="../../../../static/logo.png" class="avatar" v-else></image>
					</view>
					<view class="mamberName">{{item.userName}}</view>
				</view>
			</view>
		</view>
		<view class="subHint" style="padding:0 32rpx 16rpx 32rpx;">车队设置</view>
		<view class="mainBox">
			<view class="settingList" @tap="jumpToEditTeam()" v-if="fleetDetail.isOwner == 1 || fleetDetail.isAdmin == 1">
				<view class="settingTitle">编辑车队</view>
				<image class="moreIcon" src="../../../../static/images/newRightIcon.png"></image>
			</view>
			<view class="settingList" @tap="jumpToMemberList('manager')">
				<view class="settingTitle">{{fleetDetail.isAdmin == 1 ? '管理查看' : '查看'}}</view>
				<image class="moreIcon" src="../../../../static/images/newRightIcon.png"></image>
			</view>
			<view class="settingList" @click="goMemberVerify()" v-if="fleetDetail.isOwner == 1 || fleetDetail.isAdmin == 1">
				<view class="settingTitle">卡友审核</view>
				<image class="moreIcon" src="../../../../static/images/newRightIcon.png"></image>
			</view>
			<view class="settingList" @click="goLocationView()">
				<view class="settingTitle">位置查看</view>
				<image class="moreIcon" src="../../../../static/images/newRightIcon.png"></image>
			</view>
		</view>
		<!-- <view class="exitTeamBtn">退出车队</view> -->
	</view>
</template>

<script>
	import * as utils from "../../../../utils/service.js"
	import * as ship from "../../../../utils/ship"
	var isClicking = false
	export default {
		data() {
			return {
				fleetDetail: null,
				total: 0,
				fleetMember: [],
				defaultAvatar: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/images/fleetAvatar.jpg',
			}
		},
		onLoad(options) {
			console.log(options, '参数')
			isClicking = false;
			var fleetDetail = JSON.parse(options.fleetDetail);
			this.fleetDetail = fleetDetail;
			uni.$on("editFleetDetail", res => {
				console.log(res, '变更的参数11', res.model)
				if (res.name) {
					this.fleetDetail.name = res.name;
				}
				if (res.badgeImage) {
					this.fleetDetail.badgeImage = res.badgeImage
				}
				if (res.model !== undefined) {
					this.fleetDetail.model = res.model ? res.model.split(',') : [];
				}
				if (res.slogan !== undefined) {
					this.fleetDetail.slogan = res.slogan;
				}
				if (res.route !== undefined) {
					this.fleetDetail.route = res.route
				} 
				if (res.verificationMethod !== undefined) {
					this.fleetDetail.verificationMethod = res.verificationMethod
				}
			})
			uni.$on("refreshMember", () => {
				//获取车队成员
				var params = {
					pageSize: 5,
					pageNum: 1,
					fleetId: fleetDetail.id,
					status: 1,
					count: false
				}
				console.log(params, '参数');
				ship.newQueryPostRequest("/cd/fleetWithUser/list", params).then(res => {
					console.log(res, '车队成员')
					if (res.retCode === "0000000") {
						this.total = res.rspBody.total;
						this.fleetMember = res.rspBody.items;
					}
				}).catch(err => {
					
				})
			})
			//获取车队成员
			var params = {
				pageSize: 5,
				pageNum: 1,
				fleetId: fleetDetail.id,
				status: 1,
				count: false
			}
			console.log(params, '参数');
			ship.newQueryPostRequest("/cd/fleetWithUser/list", params).then(res => {
				console.log(res, '车队成员')
				if (res.retCode === "0000000") {
					this.total = res.rspBody.total;
					this.fleetMember = res.rspBody.items;
				}
			}).catch(err => {
				
			})
		},
		onShow() {
			
		},
		onReady() {
			
		},
		onPullDownRefresh() {
		  // 下拉刷新
		  if (this.freshing) {
		    //当正在调用接口获取数据时，此时的下拉不做任何操作
		    return;
		  }
		  this.freshing = true;
		  //刷新成功
		  setTimeout(() => {
		    // console.log('下啦刷新id清空', this.idList);
		    uni.$emit("refreshMember")
			uni.stopPullDownRefresh();
			this.freshing = false;
		  }, 500);
		  // this.toRefresh();
		},
		methods: {
			backToFromPage() {
				uni.navigateBack()
			},
			jumpToEditTeam() {
				uni.navigateTo({
					url: '../fleetCreate/fleetCreate?type=edit&fleetInfo=' + JSON.stringify(this.fleetDetail)
				})
			},
			goFleetMember() {
				if (isClicking) {
					return 
				}
				isClicking = true
				uni.navigateTo({
					url: '../fleetMemberList/fleetMemberList'
				})
				setTimeout(() => {
					isClicking = false
				}, 1000)
			},
			goMemberVerify() {
				//卡友审核
				if (isClicking) {
					return 
				}
				isClicking = true
				uni.navigateTo({
					url: '../fleetMemberList/fleetMemberList?fleetDetail=' + JSON.stringify(this.fleetDetail) + '&type=check&name=卡友审核'
				})
				setTimeout(() => {
					isClicking = false
				}, 1000)
			},
			goLocationView(){
				if (isClicking) {
					return 
				}
				isClicking = true
				uni.navigateTo({
					url: '../locationView/locationView?fleetDetail=' + JSON.stringify(this.fleetDetail)
				})
				setTimeout(() => {
					isClicking = false
				}, 1000)
			},
			jumpToMemberList(flag) { // 'manage'为管理跳转
				var isAdmin = this.fleetDetail.isAdmin;
				var name = "";
				if (isAdmin == 1) {
					name = "管理查看"
				} else {
					name = "查看"
				}
				
				if (isClicking) {
					return 
				}
				isClicking = true
				
				uni.navigateTo({
					url: '../fleetMemberList/fleetMemberList?fleetDetail=' + JSON.stringify(this.fleetDetail) + '&name='+ name +'&type=check'
				})
				setTimeout(() => {
					isClicking = false
				}, 1000)
			},
			prevImage() {
				
				//预览图片
				var that = this;
				if (this.fleetDetail.badgeImage) {
					uni.previewImage({
						current: 0,
						urls:[this.fleetDetail.badgeImage]
					})
				} else {
					uni.previewImage({
						current: 0,
						urls:[that.defaultAvatar]
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2;
	}
	.fleetManange {
		.newHeader {
			width: 750rpx;
			padding:70rpx 0 0 0;
			height: 290rpx;
			background: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/topBackground.jpg');
			background-repeat: no-repeat;
			background-size:100% 100%;
			.uniBtn {
				 margin-left:40rpx;
			}
		}
		.fleetNameBox {
			margin-top:-64rpx;
			padding: 0 32rpx;
			display: flex;
			.fleetLogoBox {
				width:120rpx;
				height: 120rpx;
				background-color: #FFF;
				border-radius: 16rpx;
				padding: 4rpx;
				margin-right:20rpx;
				.fleetLogo {
					width:120rpx;
					height: 120rpx;
					background-color: #EFF3F4;
					border-radius: 16rpx;
					.logoImg {
						width:120rpx;
						height: 120rpx;
						border-radius: 16rpx;
					}
				}
			}
			.nameBox {
				flex: 1;
				.name {
					height: 48rpx;
					line-height: 48rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #FFF;
					width: calc(100vw - 200rpx);
					overflow-x: scroll;
					white-space: nowrap;
				}
				.fleetNumBox {
					display: flex;
					.num {
						padding:10rpx 32rpx;
						background: #FF9165;
						border-radius: 12rpx;
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 34rpx;
						margin-top:26rpx;
					}
				}
			}
		}
		.subHint {
			font-size: 24rpx;
			color: #777777;
		}
		.mainBox {
			margin-bottom:20rpx;
			background-color: #FFF;
			padding-left: 32rpx;
			padding-right: 32rpx;
			.mainTitle {
				font-size: 32rpx;
				color: #333333;
				padding-top:32rpx;
			}
			.carTypeList {
				display: flex;
				flex-wrap: wrap;
				.noCarType {
					margin: 16rpx 16rpx 0 0;
					color: #FF9165;
					font-size: 26rpx;
					font-weight: 500;
					
				}
				.carType {
					margin: 16rpx 16rpx 0 0;
					padding: 6rpx 32rpx;
					background: #FF9165;
					border-radius: 23rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 34rpx;
				}
			}
			.carLineList {
				display: flex;
				flex-wrap: wrap;
				.carLine {
					margin: 16rpx 16rpx 0 0;
					padding: 6rpx 0;
					font-size: 28rpx;
					font-weight: 500;
					color: #FF814E;
					line-height: 30rpx;
				}
			}
			.memberTitle {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:20rpx 0 26rpx 0;
				.title {
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
				}
				.num {
					display: flex;
					align-items: baseline;
					font-size: 22rpx;
					color: #777777;
					.moreIcon {
						width: 12rpx;
						height: 18rpx;
						margin-left:10rpx;
					}
				}
			}
			.memberBox {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				.mamberList {
					padding-bottom:24rpx;
					& + .mamberList {
						margin-left: 80rpx;
					}
					.mamberAvatar {
						width:72rpx;
						height:72rpx;
						border-radius: 100%;
						overflow: hidden;
						margin:0 auto;
						background-color: #F2F2F2;
						.avatar {
							width:72rpx;
							height:72rpx;
							border-radius: 100%;
						}
					}
					.mamberName {
						font-size: 24rpx;
						color: #333333;
						line-height: 34rpx;
						text-align: center;
						margin-top: 8rpx;
					}
				}
			}
			.settingList + .settingList {
				border-top: 2rpx solid rgba(242, 242, 242, 1);
			}
			.settingList {
				display: flex;
				justify-content: space-between;
				align-items: baseline;
				padding: 32rpx 0;
				.settingTitle {
					font-size: 32rpx;
					color: #333333;
					line-height: 44rpx;
				}
				.moreIcon {
					width: 16rpx;
					height: 26rpx;
				}
			}
		}
		.mainMsgBox {
			padding-top:78rpx;
			padding-bottom:32rpx;
			margin-top:-64rpx;
		}
		.exitTeamBtn {
			height: 120rpx;
			line-height: 120rpx;
			background: #FFFFFF;
			font-size: 34rpx;
			font-weight: 500;
			color: #FF5A75;
			text-align: center;
		}
	}
</style>
