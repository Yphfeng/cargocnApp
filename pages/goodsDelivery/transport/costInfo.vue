<template>
	<view class="costInformation">
		<view class="pageTitle">费用信息</view>
		<view class="contentBox">
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">提货费</view>
					<!-- <view class="syb">*</view> -->
				</view>
				<view class="rightContent">
					<input class="priceInput" type="digit" placeholder-style="font-size:28rpx;color:#AAA" maxlength="9" placeholder="请输入" v-model="costA"  @input="changeAssignPrice($event, 1)"/>
					<view class="priceSyb">元</view>
				</view>
			</view>
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">送货费</view>
				</view>
				<view class="rightContent">
					<input class="priceInput" type="digit" placeholder-style="font-size:28rpx;color:#AAA" maxlength="9" placeholder="请输入" v-model="costC"  @input="changeAssignPrice($event, 2)"/>
					<view class="priceSyb">元</view>
				</view>
			</view>
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">运费</view>
				</view>
				<view class="rightContent">
					<input class="priceInput" type="digit" placeholder-style="font-size:28rpx;color:#AAA" maxlength="9" placeholder="请输入" v-model="costB"  @input="changeAssignPrice($event, 3)"/>
					<view class="priceSyb">元</view>
				</view>
			</view>
			<view class="contentRow flexRow" v-for="(item, index) in priceArr">
				<view class="leftTitle">
					<!-- <view class="syb">*</view> -->
					<input class="customInput" maxlength="5" type="text" placeholder-style="font-size:28rpx;color:#AAA" placeholder="自定义" v-model="item.name"  @input="changeInfoName($event, index)"/>
				</view>
				<!-- <view class="rightContent">
					<view class="selectBtn rightSelect" :class="quotationWay == 2 ? 'selectChecked' : 'selectDefault'" @click="changeQuotation(2)">询价</view>
					<view class="selectBtn rightSelect" :class="quotationWay == 1 ? 'selectChecked' : 'selectDefault'" @click="changeQuotation(1)">固价</view>
				</view> -->
				<view class="rightContent">
					<input class="priceInput" type="digit" placeholder-style="font-size:28rpx;color:#AAA" maxlength="9" placeholder="请输入" v-model="item.price"  @input="changeInfoPrice($event, index)"/>
					<view class="priceSyb">元</view>
				</view>
			</view>
			<view class="custom-box">
				<view class="custom-text" @click="addCustom">+添加自定义费用</view>
			</view>
		</view>
		
		<view class="saveBtn" @click="saveOrderData()">确认信息</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				infoPrice: '',
				priceArr: [],
				costA: '', //提货费
				costB: '', //运费
				costC: '', //送货费
			};
		},
		onLoad() {
			var costRecord = getApp().globalData.pransportGoods.costRecord;
			var assignPrice = getApp().globalData.pransportGoods.assignPrice;
			if(costRecord.length>0){
				this.priceArr = costRecord;
			}
			if(assignPrice.costA){
				this.costA = assignPrice.costA;
			}
			if(assignPrice.costB){
				this.costB = assignPrice.costB;
			}
			if(assignPrice.costC){
				this.costC = assignPrice.costC;
			}
		},
		onShow() {
			
		},
		methods: {
			addCustom(){
				if(this.priceArr.length>=4){
					uni.showToast({
						title: '最多可添加四个自定义费用',
						icon: 'none',
					})
					return
				}
				this.priceArr.push({
					name: '',
					price: '',
				})
			},
			changeInfoName(e, index){
				this.$nextTick(function(){
					// this.infoPrice = e.detail.value
					this.priceArr[index].name = e.detail.value
				})
			},
			changeAssignPrice(e, index){
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 6){
						let num  = Number(e.detail.value.length) - 6;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 2;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					// this.infoPrice = e.detail.value
					if(index == 1){
						this.costA = e.detail.value;
					} else if(index == 2){
						this.costC = e.detail.value;
					} else{
						this.costB = e.detail.value;
					}
				})
			},
			changeInfoPrice(e, index) { // 信息费输入限制
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 6){
						let num  = Number(e.detail.value.length) - 6;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 2;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					// this.infoPrice = e.detail.value
					this.priceArr[index].price = e.detail.value
				})
			},
			saveOrderData() {
				var isNext = 0;
				this.priceArr.map(val=>{
					if((val.name && val.price) || (!val.name && !val.price)){
						
					} else {
						isNext = 1;
					}
				})
				if(isNext == 1){
					uni.showToast({
						title: '自定义费用必须包含名称和金额',
						icon: 'none'
					})
					return;
				}
				getApp().globalData.pransportGoods.assignPrice = {
					costA: this.costA,
					costB: this.costB,
					costC: this.costC,
				};
				getApp().globalData.pransportGoods.costRecord = this.priceArr;
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.costInformation {
		padding-bottom:134rpx;
		.pageTitle {
			padding: 32rpx 0;
			line-height: 66rpx;
			font-size: 48rpx;
			font-weight: 500;
			color: #333333;
			text-align: center;
		}
		.contentBox {
			margin: 0 16rpx 0 16rpx;
			padding: 0 42rpx 42rpx 42rpx;
			background: #FFFFFF;
			border-radius: 12rpx;
			.flexRow {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.contentRow + .contentRow {
				border-top: 2rpx solid #F2F3F3;
			}
			.contentRow {
				padding: 30rpx 0 30rpx 0;
				.leftTitle {
					display: flex;
					.msg {
						font-size: 28rpx;
						color: #707071;
						line-height: 40rpx;
					}
					.syb {
						color:#FF3838;
						font-size: 32rpx;
						padding-left:8rpx;
						font-weight:bold;
					}
					.customInput{
						width: 160rpx;
						height: 56rpx;
						background: #F4F4F4;
						border-radius: 12rpx;
						font-size: 28rpx;
						color:#333;
						padding: 0 10rpx;
					}
				}
				.selectChecked {
					background: #E0EFFD;
					border: 2rpx solid #4AA2F3;
					color: #4AA2F3;
				}
				.selectDefault {
					border: 2rpx solid #C2C2C9;
					color: #777777;
				}
				.selectBtn {
					border-radius: 8rpx;
					height: 52rpx;
					line-height: 52rpx;
					font-size: 28rpx;
					padding: 0 32rpx;
				}
				.rightContent {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					.rightSelect + .rightSelect {
						margin-left: 20rpx;
					}
					.priceInput {
						width: 160rpx;
						height: 56rpx;
						background: #F4F4F4;
						border-radius: 12rpx;
						font-size: 28rpx;
						color:#333;
						text-align: center;
						padding: 0 10rpx;
					}
					.priceSyb {
						height: 56rpx;
						line-height: 56rpx;
						margin-left: 24rpx;
						font-size: 28rpx;
						color: #707071;
					}
					.listBtn:nth-child(3n) {
						margin-right:0;
					}
					.listBtn {
						width: 152rpx;
						margin-top:20rpx;
						margin-right:82rpx;
						.selectBtn {
							text-align: center;
						}
					}
				}
			}
			.custom-box{
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 50rpx;
				.custom-text{
					width: 250rpx;
					text-align: center;
					padding: 20rpx;
					border-radius: 20rpx;
					background-color: #F3F3F3;
					font-size: 25rpx;
					color: #AAA;
				}
			}
		}
		.saveBtn {
			position: fixed;
			bottom: 24rpx;
			left:60rpx;
			right:60tpx;
			width: 630rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius:44rpx;
			background-color: #4AA2F3;
			box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
</style>
