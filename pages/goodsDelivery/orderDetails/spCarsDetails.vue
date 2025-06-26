<template>
	<view class="spCarsDetails">
		<view class="orderDetailsBox">
			<view class="addressModel">
				<view class="addressMsg">{{newShowAddressMsg('fir')}}</view>
				<image class="addressIcon" src="/static/images/newOrderDetails/addressIcon.png"></image>
				<view class="addressMsg">{{newShowAddressMsg('sec')}}</view>
			</view>
			<view class="shelvesBtn" v-if="hasOrdereEffective() || orderDetailInfo.orderSecondState == 19" @click="closeOrder()">下架货源</view>
			<view class="orderNumberBox" @click="copyOrderNumber(orderDetailInfo.orderNumber)">
				<view class="num">货源号：{{orderDetailInfo.orderNumber}}</view>
				<image class="copyIcon" src="/static/images/newOrderDetails/copyIcon.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import * as service from "@/utils/service.js";
	export default {
		data() {
			return {
				orderDetailInfo: {},
				orderAddressVOS: [],
				sid: ''
			};
		},
		onLoad(option) {
			this.sid = option.sid;
			console.log('货源id', this.sid);
			this.getListRecord();
		},
		methods: {
			getListRecord(indexOrderSid) { // 查询货源详情
				uni.showLoading({
					title: '加载中'
				});
				let that = this;
				let params = {
					sid: that.sid
				}
				console.log('询价详情查询参数', params);
				utils.newQueryPostRequest('/td/order/findListRecord', params)
				.then(res=>{
					console.log('询价详情', res);
					if(res.retCode == '0000000') {
						that.orderDetailInfo = res.rspBody;
						that.orderAddressVOS = that.orderDetailInfo.orderChild.orderAddressVOS;
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
			},
			copyOrderNumber(text) { //复制货源号
				uni.setClipboardData({
					data: text,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			},
			newShowAddressMsg(flag, ary) { // 展示地址
				let addressObjKey = '';
				switch(flag) {
					case 'fir':
						addressObjKey = '0';
						// console.log('装货点', addressObj);
						break;
					case 'sec':
						addressObjKey = this.orderAddressVOS.length - 1;
						// console.log('卸货点', addressObj);
						break;
				}
				return this.orderAddressVOS[addressObjKey].city;
			},
			hasOrdereEffective() { // 是否有效货源
				if(
					this.orderDetailInfo.orderSecondState == 11 ||
					this.orderDetailInfo.orderSecondState == 12 ||
					this.orderDetailInfo.orderSecondState == 13 ||
					this.orderDetailInfo.orderSecondState == 14 ||
					this.orderDetailInfo.orderSecondState == 16
				) {
					return true;
				}else {
					return false;
				}
			},
			closeOrder() { // 关闭货源
				if(!utils.btnRepeat()) return false; // 防抖
				uni.showLoading({
					title: '加载中'
				});
				let that = this;
				let params = {
					sid: that.sid
				}
				utils.postRequest('/td/order/undercarriage', params)
				.then(res=>{
					console.log('订单取消', res);
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '下架货源成功！',
							icon: 'none',
							duration: 2000
						})
						uni.$emit("cancel_index");
						uni.navigateBack();
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F1F4F9;
	}
	.spCarsDetails {
		padding-top: 24rpx;
		.orderDetailsBox {
			margin: 0 36rpx;
			padding: 18rpx 0 10rpx 0;
			background: #FFFFFF;
			box-shadow: 0px 0px 16rpx 2rpx rgba(172,203,255,0.19);
			border-radius: 24rpx;
			.addressModel {
				display: flex;
				align-items: center;
				.addressMsg {
					flex: 1;
					font-size: 30rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
				}
				.addressIcon {
					flex-shrink: 0;
					margin: 0 10rpx;
					width: 24rpx;
					height: 24rpx;
					display: block;
				}
			}
			.shelvesBtn {
				margin: 36rpx auto 0 auto;
				width: 238rpx;
				height: 56rpx;
				line-height: 56rpx;
				border-radius: 8rpx;
				border: 2rpx solid #2B72F0;
				font-size: 28rpx;
				font-weight: 500;
				color: #2B72F0;
				text-align: center;
			}
			.orderNumberBox {
				margin-top: 12rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.num {
					font-size: 24rpx;
					color: #666666;
					line-height: 44rpx;
				}
				.copyIcon {
					width: 22rpx;
					height: 22rpx;
					display: block;
					margin-left: 4rpx;
				}
			}
		}
	}
</style>
