<template>
	<view class="driverDetailsPage">
		<view class="mainHeadBox">
			<view class="headBackBox" @click="toBack">
				<view class="backBtn">
					<image class="backIcon" src="/static/images/driverDetails/backIcon.png"></image>
				</view>
				<view class="backTitle">司机详情</view>
			</view>
			
			<view class="driverName">
				<text class="msg">{{detailsInfo.userName ? showName(detailsInfo.userName) : detailsInfo.mobile ? showMobile(detailsInfo.mobile) : ''}}</text>
				<text class="msg" v-if="detailsInfo.gender">{{detailsInfo.gender}}</text>
			</view>
			
			<view class="driverPositioning">
				<view class="positioningAddress">
					<image class="positioningIcon" src="/static/images/driverDetails/addressIcon.png" v-if="detailsInfo.address"></image>
					<view class="positioningAddressMsg" v-if="detailsInfo.address">{{detailsInfo.address}}</view>
				</view>
				<view class="time" v-if="detailsInfo.trackTime">{{showDate(detailsInfo.trackTime)}}</view>
			</view>
			
			<view class="driverAvatarMainBox">
				<view class="avatarBorder1" :class="animtionStart ? 'borderAmime1' : ''"></view>
				<view class="avatarBorder2" :class="animtionStart ? 'borderAmime2' : ''"></view>
				<view class="avatarBorder3" :class="animtionStart ? 'borderAmime3' : ''"></view>
				<view class="avatarBorder4" :class="animtionStart ? 'borderAmime4' : ''"></view>
				<view class="avatarBorder5" :class="animtionStart ? 'borderAmime5' : ''"></view>
				<!-- <view class="avatarBorder" :class="animtionStart ? 'borderAmime' : ''"></view> -->
				<view class="iconBox">
					<image class="avatarIcon" :src="detailsInfo.avatar ? detailsInfo.avatar : '/static/images/goodsDelivery/shipUserLogo.png'"></image>
				</view>
			</view>
			<view class="driverDetailsMsgBox">
				<view class="letMsgBox">
					<view class="msgModel">
						<view class="title" style="text-align: center;">车号</view>
						<view class="contentRow" style="height: 132rpx;">
							<view class="contentMsg">{{detailsInfo.plateNo ? showPlate(detailsInfo.plateNo) : '暂无数据'}}</view>
						</view>
						<image class="lineIcon1" src="/static/images/newIndex/detailsLine2.png"></image>
					</view>
					<view class="msgModel" style="margin-top:6rpx;">
						<view class="title">发布车源</view>
						<view class="contentRow" style="height: 88rpx;">
							<view class="contentMsg">{{detailsInfo.carSourceCount ? detailsInfo.carSourceCount : 0}}条</view>
						</view>
						<image class="lineIcon2" src="/static/images/newIndex/detailsLine3.png"></image>
					</view>
					<view class="msgModel" style="margin-top:20rpx;">
						<view class="title">车型车长</view>
						<view class="contentRow" style="height: 132rpx;">
							<view class="contentMsg" v-for="(item, index) in detailsInfo.userTagsOftenAreaAry" :key="index">{{item}}</view>
							<view class="contentMsg" v-if="!detailsInfo.userTagsOftenAreaAry">暂无数据</view>
						</view>
						<image class="lineIcon3" src="/static/images/newIndex/detailsLine1.png"></image>
					</view>
				</view>
				<view class="rightMsgBox">
					<view class="msgModel">
						<view class="title">区域偏好</view>
						<view class="contentRow" style="height: 132rpx;">
							<view class="contentMsg">{{detailsInfo.userTagsOftenArea ? detailsInfo.userTagsOftenArea : '暂无数据'}}</view>
						</view>
						<image class="lineIcon1" src="/static/images/newIndex/detailsLine2.png"></image>
					</view>
					<view class="msgModel" style="margin-top:6rpx;">
						<view class="title">线路偏好</view>
						<view class="contentRow" style="height: 88rpx;">
							<view class="contentMsg">{{detailsInfo.userTagsRoadTypes ? detailsInfo.userTagsRoadTypes : '暂无数据'}}</view>
						</view>
						<image class="lineIcon2" src="/static/images/newIndex/detailsLine3.png"></image>
					</view>
					<view class="msgModel" style="margin-top:20rpx;">
						<view class="title">货物偏好</view>
						<view class="contentRow" style="height: 138rpx;">
							<view class="contentMsg">{{detailsInfo.userTagsFavoriteCargo ? detailsInfo.userTagsFavoriteCargo : '暂无数据'}}</view>
						</view>
						<image class="lineIcon3" src="/static/images/newIndex/detailsLine1.png"></image>
					</view>
					<view class="msgModel otherModel" v-if="showPriceSensitivity">
						<view class="title">价格敏感度</view>
						<view class="contentRow" style="height: 88rpx;">
							<view class="contentMsg">{{detailsInfo.userTagsPriceSensitivity ? detailsInfo.userTagsPriceSensitivity : '暂无数据'}}</view>
						</view>
						<image class="lineIcon4" src="/static/images/newIndex/detailsLine4.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="mainContentBox">
			<view class="contentTitleBox">
				<image class="icon" src="/static/images/driverDetails/lineIcon.png"></image>
				<view class="msg">常跑线路</view>
			</view>
			<scroll-view class="contentDetailsBox" scroll-y="true">
				<view class="lineRow" v-for="(item, index) in userTagsCircuit" :key="index">
					<view class="lineMsg">{{item.sender}}</view>
					<view class="lineSyb"></view>
					<view class="lineMsg">{{showReceiver(item.receiver)}}</view>
				</view>
				<view v-if="userTagsCircuit && userTagsCircuit.length == 0" class="listNoDataHint">暂无数据</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import * as utilDate from "@/utils/utils";
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				animtionStart: false,
				encryption: '',
				detailsInfo: {},
				userTagsCircuit: [],
				showPriceSensitivity: ''
			};
		},
		onLoad(options) {
			if(options.id) {
				uni.showLoading();
				this.encryption = options.encryption; // 是否加密encryption==1则直接展示，否则加密
				this.getDriverDetailsInfo(options.id)
				this.showPriceSensitivity = options.showPriceSensitivity && Number(options.showPriceSensitivity) == 1 ? 1 : '';
			}
		},
		onReady() {
			this.animtionStart = true;
		},
		methods: {
			getDriverDetailsInfo(id) {
				console.log('司机id', id);
				let that = this;
				utils.postRequest('/yh/driver/select/driver/detail/with/tags', { userId: id })
				.then(function (res) {
					console.log('司机详情结果', res);
					if(res.retCode == '0000000'){
						that.detailsInfo = res.rspBody;
						if(that.detailsInfo.userTagsRoadTypes) { // 线路偏好
							that.detailsInfo.userTagsRoadTypes = that.detailsInfo.userTagsRoadTypes.replace(/,/g, '、');
						}
						if(that.detailsInfo.userTagsFavoriteCargo) { // 货物偏好
							that.detailsInfo.userTagsFavoriteCargo = that.detailsInfo.userTagsFavoriteCargo.replace(/,/g, '、');
						}
						if(that.detailsInfo.userTagsOftenArea) { // 区域偏好
							let ary = that.detailsInfo.userTagsOftenArea.split(',');
							let str = '';
							for(let i in ary) {
								if(i < 3) {
									str = str + ary[i] + '、';
								}
							}
							str = str.slice(0,-1);
							that.detailsInfo.userTagsOftenArea = str;
						}
						if(that.detailsInfo.userTagsCarModelAndLength) { // 车型车长
							that.detailsInfo.userTagsOftenAreaAry = [];
							let ary = that.detailsInfo.userTagsCarModelAndLength.split(',');
							for(let i in ary) {
								if(i < 2) {
									that.detailsInfo.userTagsOftenAreaAry.push(ary[i]);
								}
							}
						}
						if(that.detailsInfo.userTagsCircuit) {
							let ary = that.detailsInfo.userTagsCircuit.split(',');
							for(let i in ary) {
								let itemAry = ary[i].split('-');
								let obj = {
									sender: itemAry[0],
									receiver: itemAry[1],
								}
								that.userTagsCircuit.push(obj);
							}
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					uni.hideLoading();
					console.log('司机详情请求失败', res.retDesc);
				})
			},
			toBack() {
				uni.navigateBack();
			},
			showPlate(str) { // 车牌脱敏
				let lengthNum = str.length - 3;
				let sybStr = '';
				for(let i = 0; i < lengthNum; i++) {
					sybStr = sybStr + '*';
				}
				return str.substr(0, 2) + sybStr + str.substr(str.length - 1);
			},
			showName(str) { // 姓名脱敏
				if(str.length > 2) {
					return str.substr(0, 1) + '*' + str.substr(str.length - 1);
				}else {
					return str.substr(0, 1) + '*';
				}
			},
			showMobile(str) { // 手机号脱敏
				return str.substr(0, 3) + '****' + str.substr(7);
			},
			showReceiver(str) {
				return str;
				// if(Number(this.encryption) == 1) {
				// 	return str;
				// }else {
				// 	return '****';
				// }
			},
			showDate(locationDate) {
				return utilDate.findBeidouDateDesc(locationDate)
			},
		}
	}
</script>

<style lang="scss">
	.driverDetailsPage {
		.mainHeadBox {
			width: 750rpx;
			height: 1038rpx;
			background-image: url(@/static/images/driverDetails/headBc.png);
			background-repeat: no-repeat;
			background-size: cover;
			margin:0;
			.headBackBox {
				padding-top:108rpx;
				.backBtn {
					width:44rpx;
					height: 44rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					left: 24rpx;
					.backIcon {
						width: 16rpx;
						height: 30rpx;
					}
				}
				.backTitle {
					height: 44rpx;
					font-size: 40rpx;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 44rpx;
					text-align: center;
				}
			}
			.driverName {
				height: 44rpx;
				line-height: 44rpx;
				margin-top:54rpx;
				padding: 0 36rpx 0 36rpx;
				.msg + .msg {
					margin-left: 90rpx;
				}
				.msg {
					font-size: 60rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
			.driverPositioning {
				margin-top:66rpx;
				padding: 0 28rpx 0 34rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.positioningAddress {
					display: flex;
					align-items: center;
					padding-right: 20rpx;
					.positioningIcon {
						flex-shrink: 0;
						width: 42rpx;
						height: 50rpx;
						display: block;
						margin-right:12rpx;
					}
					.positioningAddressMsg {
						font-size: 36rpx;
						color: #FFFFFF;
						line-height: 44rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
						width: 450rpx;
					}
				}
				.time  {
					font-size: 28rpx;
					color: #FFFFFF;
					line-height: 44rpx;
					text-shadow: 0px 0px 12rpx #395EF2;
					flex-shrink: 0;
				}
			}
			.driverDetailsMsgBox {
				display: flex;
				justify-content: space-between;
				padding: 68rpx 26rpx 0 40rpx;
				.letMsgBox, .rightMsgBox {
					.msgModel {
						.title {
							font-size: 36rpx;
							font-weight: 500;
							color: #5CE6F9;
							line-height: 44rpx;
							text-shadow: 0px 0px 8rpx rgba(92, 230, 249, 0.71);
						}
						.contentRow {
							width: 160rpx;
							margin-top:2rpx;
							.contentMsg {
								font-size: 32rpx;
								color: #FFFFFF;
								line-height: 44rpx;
								text-align: center;
								word-break: break-all;
							}
						}
					}
					.otherModel {
						position: absolute;
						margin: -42rpx 0 0 -16rpx;
					}
				}
				.letMsgBox {
					.lineIcon1 {
						position: absolute;
						width: 124rpx;
						height: 109rpx;
						margin: -166rpx 0 0 152rpx;
					}
					.lineIcon2 {
						position: absolute;
						width: 70rpx;
						height: 20rpx;
						margin: -122rpx 0 0 152rpx;
					}
					.lineIcon3 {
						position: absolute;
						width: 113rpx;
						height: 66rpx;
						margin: -212rpx 0 0 152rpx;
					}
				}
				.rightMsgBox {
					.lineIcon1 {
						position: absolute;
						width: 124rpx;
						height: 109rpx;
						margin: -166rpx 0 0 -132rpx;
						transform: rotateY(-180deg);
					}
					.lineIcon2 {
						position: absolute;
						width: 70rpx;
						height: 20rpx;
						margin: -122rpx 0 0 -80rpx;
					}
					.lineIcon3 {
						position: absolute;
						width: 113rpx;
						height: 66rpx;
						margin: -216rpx 0 0 -122rpx;
						transform: rotateY(-180deg);
					}
					.lineIcon4 {
						position: absolute;
						width: 168rpx;
						height: 181rpx;
						margin: -282rpx 0 0 -180rpx;
					}
				}
			}
			.driverAvatarMainBox {
				width: 350rpx;
				height: 350rpx;
				margin: 114rpx 200rpx 0 200rpx;
				position: absolute;
				.avatarBorder1 {
					// width: 696rpx;
					// height: 696rpx;
					// margin: 0 0 0 0;
					width: 416rpx;
					height: 416rpx;
					margin: 70rpx 0 0 70rpx;
					border: 2rpx solid rgba(9, 226, 248, 0.3);
					border-radius: 100%;
					transform: scale(0.5, 0.5);
					transform-origin: 0 0;
					position: absolute;
					-webkit-animation: rotating 2.5s linear infinite;
					animation: rotating 2.5s linear infinite;
				}
				.avatarBorder2 {
					// width: 640rpx;
					// height: 640rpx;
					// margin: 14rpx 0 0 14rpx;
					width: 416rpx;
					height: 416rpx;
					margin: 70rpx 0 0 70rpx;
					border: 2rpx solid rgba(9, 226, 248, 0.3);
					border-radius: 100%;
					transform: scale(0.5, 0.5);
					transform-origin: 0 0;
					position: absolute;
					-webkit-animation: rotating 2.5s linear infinite;
					animation: rotating 2.5s linear infinite;
				}
				.avatarBorder3 {
					// width: 584rpx;
					// height: 584rpx;
					// margin: 28rpx 0 0 28rpx;
					width: 416rpx;
					height: 416rpx;
					margin: 70rpx 0 0 70rpx;
					border: 2rpx solid rgba(9, 226, 248, 0.3);
					border-radius: 100%;
					transform: scale(0.5, 0.5);
					transform-origin: 0 0;
					position: absolute;
					-webkit-animation: rotating 2.5s linear infinite;
					animation: rotating 2.5s linear infinite;
				}
				.avatarBorder4 {
					// width: 528rpx;
					// height: 528rpx;
					// margin: 42rpx 0 0 42rpx;
					width: 416rpx;
					height: 416rpx;
					margin: 70rpx 0 0 70rpx;
					border: 2rpx solid rgba(9, 226, 248, 0.3);
					border-radius: 100%;
					transform: scale(0.5, 0.5);
					transform-origin: 0 0;
					position: absolute;
					-webkit-animation: rotating 2.5s linear infinite;
					animation: rotating 2.5s linear infinite;
				}
				.avatarBorder5 {
					// width: 472rpx;
					// height: 472rpx;
					// margin: 56rpx 0 0 56rpx;
					width: 416rpx;
					height: 416rpx;
					margin: 70rpx 0 0 70rpx;
					
					border: 2rpx solid rgba(9, 226, 248, 0.3);
					border-radius: 100%;
					transform: scale(0.5, 0.5);
					transform-origin: 0 0;
					position: absolute;
					-webkit-animation: rotating 2.5s linear infinite;
					animation: rotating 2.5s linear infinite;
				}
				.avatarBorder {
					width: 416rpx;
					height: 416rpx;
					margin: 70rpx 0 0 70rpx;
					border: 2rpx solid rgba(9, 226, 248, 0.3);
					border-radius: 100%;
					transform: scale(0.5, 0.5);
					transform-origin: 0 0;
					position: absolute;
					-webkit-animation: rotating 2.5s linear infinite;
					animation: rotating 2.5s linear infinite;
				}
				.borderAmime1 {
					animation-delay:0.5s;
				}
				.borderAmime2 {
					animation-delay:1s;
				}
				.borderAmime3 {
					animation-delay:1.5s;
				}
				.borderAmime4 {
					animation-delay:2s;
				}
				.borderAmime5 {
					animation-delay:2.5s;
				}
				.borderAmime {
					animation-delay:0.5s;
				}
				@keyframes rotating {
				    0% {
				        width: 416rpx;
				        height: 416rpx;
				        margin: 70rpx 0 0 70rpx;
						opacity: 0; // 为避免动画效果100%时闪烁
				    }
					20% { // 
					   opacity: 1;
					}
					80% {
					   opacity: 1;
					}
				    100% {
				        width: 696rpx;
				        height: 696rpx;
						margin: 0 0 0 0;
						opacity: 0;
				    }
				}
				.iconBox {
					width: 416rpx;
					height: 416rpx;
					margin: 70rpx 0 0 70rpx;
					border-radius: 100%;
					transform: scale(0.5, 0.5);
					transform-origin: 0 0;
					position: absolute;
					overflow: hidden;
					background-color: #FFF;
					.avatarIcon {
						width: 416rpx;
						height: 416rpx;
					}
				}
			}
		}
		
		.mainContentBox {
			width: 750rpx;
			height: 586rpx;
			background-image: url(@/static/images/driverDetails/contentBc.png);
			background-repeat: no-repeat;
			background-size: 100%;
			margin:0;
			.contentTitleBox {
				padding: 24rpx 0 0 58rpx;
				display:flex;
				align-items: center;
				.icon {
					width: 44rpx;
					height: 50rpx;
					display: block;
					margin-right:18rpx;
				}
				.msg {
					font-size: 40rpx;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 44rpx;
				}
			}
			.contentDetailsBox {
				margin:30rpx auto 0 auto;
				width: 624rpx;
				height: 410rpx;
				border-radius: 24rpx;
				border: 2rpx solid rgba(76, 124, 244, 0.5);
				padding: 40rpx 0;
				box-sizing: border-box;
				.lineRow + .lineRow {
					margin-top: 28rpx;
				}
				.lineRow {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 30rpx;
					.lineMsg {
						width: 188rpx;
						font-size: 32rpx;
						color: #FFFFFF;
						line-height: 44rpx;
						text-align: center;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
					}
					.lineSyb {
						margin: 0 20rpx;
						width: 160rpx;
						height: 4rpx;
						background: #5CE6F9;
						box-shadow: 0px 0px 8rpx 2rpx rgba(57,94,242,1);
						border-radius: 4rpx;
					}
				}
				.listNoDataHint {
					font-size: 32rpx;
					color: #FFFFFF;
					line-height: 330rpx;
					text-align: center;
				}
			}
		}
	}
</style>
