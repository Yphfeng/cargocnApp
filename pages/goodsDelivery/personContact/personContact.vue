<template>
	<view class="personContact">
		<view class="contactDetails">
			<view class="detailType" style="background: #4AA2F3;">装</view>
			<view class="detailContent" @click="openConfirmPopup(1)">
				<view class="contentMsg">
					<view class="title">装货地联系人1</view>
					<view class="msg">
						{{contactUser.user1.mobile ? contactUser.user1.userName + contactUser.user1.mobile : defaultContact.userName + defaultContact.mobile}}
					</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		<view class="contactDetails" v-if="addressDetail.loadGoods2.address">
			<view class="detailType" style="background: #4AA2F3;">装</view>
			<view class="detailContent" @click="openConfirmPopup(2)">
				<view class="contentMsg">
					<view class="title">装货地联系人2</view>
					<view class="msg">
						{{contactUser.user2.mobile ? contactUser.user2.userName + contactUser.user2.mobile : defaultContact.userName + defaultContact.mobile}}
					</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		<view class="contactDetails">
			<view class="detailType" style="background: #F29347;">卸</view>
			<view class="detailContent" style="border-top:2rpx solid #F2F3F3" @click="openConfirmPopup(3)">
				<view class="contentMsg">
					<view class="title">卸货地联系人1</view>
					<view class="msg">
						{{contactUser.user3.mobile ? contactUser.user3.userName + contactUser.user3.mobile : defaultContact.userName + defaultContact.mobile}}
					</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		<view class="contactDetails" v-if="addressDetail.unloadGoods2.address">
			<view class="detailType" style="background: #F29347;">卸</view>
			<view class="detailContent" style="border-top:2rpx solid #F2F3F3" @click="openConfirmPopup(4)">
				<view class="contentMsg">
					<view class="title">卸货地联系人2</view>
					<view class="msg">
						{{contactUser.user4.mobile ? contactUser.user4.userName + contactUser.user4.mobile : defaultContact.userName + defaultContact.mobile}}
					</view>
				</view>
				<image class="rightIcon" src="../../../static/images/goodsDelivery/icon_right.png"></image>
			</view>
		</view>
		<view class="confirmBtn" @tap="saveContact()">确认</view>
		
		<uni-popup ref="confirmPopup" type="center">
			<view class="editPersonMsg">
				<view class="title">{{popupTitle}}</view>
				<view class="popupInputBox">
					<input class="popupInput" maxlength="5" placeholder="请填写联系人姓名" v-model="personName" />
					<input class="popupInput" type="number" maxlength="11" placeholder="请填写手机号" v-model="personTel" />
				</view>
				<view class="popupBtn" @tap="confirmContact()">确认</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	export default {
		data() {
			return {
				popupTitle: '',
				// 联系人
				defaultContact: {},
				contactUser: {
					user1: {},
					user2: {},
					user3: {},
					user4: {},
				},
				
				personName: '',
				personTel: '',
				saveFlag: '',
				addressDetail: {}
			};
		},
		onLoad() {
		},
		onShow() {
			this.addressDetail =  getApp().globalData.addressObject;
			// 联系人
			this.defaultContact = getApp().globalData.defaultContact;
			if(getApp().globalData.contactUser.user1.mobile) {
				this.contactUser.user1 = {
					userName: getApp().globalData.contactUser.user1.userName,
					mobile: getApp().globalData.contactUser.user1.mobile
				};
			}
			if(getApp().globalData.contactUser.user2.mobile) {
				this.contactUser.user2 = {
					userName: getApp().globalData.contactUser.user2.userName,
					mobile: getApp().globalData.contactUser.user2.mobile
				};
			}
			if(getApp().globalData.contactUser.user3.mobile) {
				this.contactUser.user3 = {
					userName: getApp().globalData.contactUser.user3.userName,
					mobile: getApp().globalData.contactUser.user3.mobile
				};
			}
			if(getApp().globalData.contactUser.user4.mobile) {
				this.contactUser.user4 = {
					userName: getApp().globalData.contactUser.user4.userName,
					mobile: getApp().globalData.contactUser.user4.mobile
				};
			}
		},
		methods: {
			openConfirmPopup(flag) { // 打开弹出框
				this.saveFlag = flag;
				switch(this.saveFlag) {
					case 1:
						this.popupTitle = '请填写装货联系人';
						this.personName = this.contactUser.user1.mobile ? this.contactUser.user1.userName : this.defaultContact.userName;
						this.personTel = this.contactUser.user1.mobile ? this.contactUser.user1.mobile : this.defaultContact.mobile;
						break;
					case 2:
						this.popupTitle = '请填写装货联系人';
						this.personName = this.contactUser.user2.mobile ? this.contactUser.user2.userName : this.defaultContact.userName;
						this.personTel = this.contactUser.user2.mobile ? this.contactUser.user2.mobile : this.defaultContact.mobile;
						break;
					case 3:
						this.popupTitle = '请填写卸货联系人';
						this.personName = this.contactUser.user3.mobile ? this.contactUser.user3.userName : this.defaultContact.userName;
						this.personTel = this.contactUser.user3.mobile ? this.contactUser.user3.mobile : this.defaultContact.mobile;
						break;
					case 4:
						this.popupTitle = '请填写卸货联系人';
						this.personName = this.contactUser.user4.mobile ? this.contactUser.user4.userName : this.defaultContact.userName;
						this.personTel = this.contactUser.user4.mobile ? this.contactUser.user4.mobile : this.defaultContact.mobile;
						break;
				}
				this.$refs.confirmPopup.open()
			},
			confirmContact() { // 保存输入的联系人
				if(!this.personName) {
					uni.showToast({
						title: '请填写联系人',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.personTel) {
					uni.showToast({
						title: '请填写联系电话',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if (!(/^1[3456789]\d{9}$/.test(this.personTel)) || this.personTel.length != 11){ // 手机正则表达式
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 3000
					})
					return;
				}
				switch(this.saveFlag) {
					case 1:
						this.contactUser.user1.userName = this.personName;
						this.contactUser.user1.mobile = this.personTel;
						break;
					case 2:
						this.contactUser.user2.userName = this.personName;
						this.contactUser.user2.mobile = this.personTel;
						break;
					case 3:
						this.contactUser.user3.userName = this.personName;
						this.contactUser.user3.mobile = this.personTel;
						break;
					case 4:
						this.contactUser.user4.userName = this.personName;
						this.contactUser.user4.mobile = this.personTel;
						break;
				}
				this.$refs.confirmPopup.close();
				this.$forceUpdate();
			},
			saveContact() { // 联系人保存到本地数据
				uni.showLoading({
					title: '加载中'
				});
				let obj1 = {
					mobile: this.contactUser.user1.mobile ? this.contactUser.user1.mobile : this.defaultContact.mobile,
					userIds: undefined,
					serialnumber: 1,
					userName: this.contactUser.user1.mobile ? this.contactUser.user1.userName : this.defaultContact.userName,
				}
				getApp().globalData.contactUser.user1 = obj1;
				if(this.addressDetail.loadGoods2.address) {
					let obj2 = {
						mobile: this.contactUser.user2.mobile ? this.contactUser.user2.mobile : this.defaultContact.mobile,
						userIds: undefined,
						serialnumber: 2,
						userName: this.contactUser.user2.mobile ? this.contactUser.user2.userName : this.defaultContact.userName,
					}
					getApp().globalData.contactUser.user2 = obj2;
				}
				
				let obj3 = {
					mobile: this.contactUser.user3.mobile ? this.contactUser.user3.mobile : this.defaultContact.mobile,
					userIds: undefined,
					serialnumber: 3,
					userName: this.contactUser.user3.mobile ? this.contactUser.user3.userName : this.defaultContact.userName,
				}
				getApp().globalData.contactUser.user3 = obj3;
				if(this.addressDetail.unloadGoods2.address) {
					let obj4 = {
						mobile: this.contactUser.user4.mobile ? this.contactUser.user4.mobile : this.defaultContact.mobile,
						userIds: undefined,
						serialnumber: 4,
						userName: this.contactUser.user4.mobile ? this.contactUser.user4.userName : this.defaultContact.userName,
					}
					getApp().globalData.contactUser.user4 = obj4;
				}
				
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF;
	}
	.personContact {
		padding-bottom: 128rpx;
		.contactDetails {
			padding: 0 48rpx 0 28rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.detailType {
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
				border-radius: 12rpx;
				font-size: 26rpx;
				color: #FFFFFF;
				text-align: center;
			}
			.detailContent {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:24rpx 0 24rpx 28rpx;
				.contentMsg {
					.title {
						font-size: 30rpx;
						font-weight: bold;
						color: #222222;
						line-height: 42rpx;
					}
					.msg {
						font-size: 28rpx;
						color: #444444;
						line-height: 40rpx;
						margin-top:26rpx;
					}
				}
				.rightIcon {
					width:36rpx;
					height: 36rpx;
				}
			}
		}
		.confirmBtn {
			width: 702rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: #4AA2F3;
			border-radius: 48rpx;
			margin: 0 24rpx;
			font-size: 36rpx;
			font-weight: 500;
			text-align: center;
			color: #FFFFFF;
			position: fixed;
			bottom: 32rpx;
		}
		.editPersonMsg {
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 0 0 32rpx 0;
			.title {
				width:650rpx;
				padding: 40rpx 0 32rpx 0;
				line-height: 50rpx;
				border-bottom: 2rpx solid #DBDBDB;
				font-size: 36rpx;
				font-weight:bold;
				color: #222;
				text-align: center;
			}
			.popupInputBox {
				padding: 0 38rpx;
				.popupInput {
					font-size: 32rpx;
					color: #444444;
					height: 100rpx;
					border-bottom: 2rpx solid #F2F3F3;
				}
			}
			.popupBtn {
				flex: 1;
				height: 84rpx;
				line-height: 84rpx;
				border-radius: 48rpx;
				background: #4AA2F3;
				margin: 32rpx 38rpx 0 38rpx;
				color:#FFF;
				font-size: 32rpx;
				font-weight:500;
				text-align: center;
			}
		}
	}
</style>
