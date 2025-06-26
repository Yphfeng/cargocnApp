<template>
	<view class="handlingInstructions">
		<view class="mainTitle">装卸说明</view>
		<view class="btnGroup">
			<view
				class="btn"
				v-for="(item, index) in handingRequiredAry"
				:key="index"
				:class="checkhandingRequiredVal(item.sid) ? 'checkedBtn' : 'defaultBtn'"
				@click="chooseType(item)">
				{{item.typeName}}
			</view>
		</view>
		<textarea class="remarkInput" maxlength="200" v-model="remark" placeholder-style="font-size: 36rpx;color: #A1A1A1;text-align:center;line-height:218rpx;" placeholder="输入备注"/>
		<view class="comfirmBtn" @click="saveCostData()">确定</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				handingRequiredAry: [],
				handingRequiredVal: [],
				remark: '',
			};
		},
		onLoad() {
			uni.showLoading();
			this.getHandingRequiredInfo();
			let orderOtherData = getApp().globalData.handlingInstructions;
			this.handingRequiredVal = orderOtherData.handingRequiredVal.length > 0 ? [...orderOtherData.handingRequiredVal] : [];
			this.remark = orderOtherData.orderRemark ? orderOtherData.orderRemark : '';
		},
		onReady() {
		},
		methods: {
			getHandingRequiredInfo() { // 装载要求
				let that = this;
				utils.postRequest('/ts/goods/handingRequired/get')
				.then(res=>{
					console.log('装载要求', res);
					that.handingRequiredAry = res.rspBody.items;
				})
				.catch(err=>{
					console.log(err);
				})
				uni.hideLoading();
			},
			chooseType(item) {
				if(this.checkhandingRequiredVal(item.sid)) {
					for(let i in this.handingRequiredVal) {
						if(this.handingRequiredVal[i].sid == item.sid) {
							this.handingRequiredVal.splice(i, 1);
							break;
						}
					}
				}else {
					this.handingRequiredVal.push(item);
				}
			},
			checkhandingRequiredVal(val) {
				for(let i in this.handingRequiredVal) {
					if(this.handingRequiredVal[i].sid == val) {
						return true;
					}
				}
			},
			saveCostData() {
				getApp().globalData.handlingInstructions.handingRequiredVal = [];
				getApp().globalData.handlingInstructions.handingRequiredVal = this.handingRequiredVal;
				getApp().globalData.handlingInstructions.orderRemark = this.remark;
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.handlingInstructions {
		min-height:100vh;
		background-color: #FAFAFA;
		.mainTitle {
			padding: 48rpx 38rpx 4rpx 38rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #333333;
			line-height: 44rpx;
		}
		.btnGroup {
			display: flex;
			flex-wrap: wrap;
			padding: 0 24rpx;
			.btn {
				height: 72rpx;
				line-height: 72rpx;
				box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.22);
				border-radius: 8rpx;
				padding: 0 46rpx;
				font-size: 28rpx;
				font-weight: 500;
				margin: 20rpx 12rpx 0 12rpx;
			}
			.checkedBtn {
				background-color: #2B72F0;
				color:#FFF;
			}
			.defaultBtn {
				background-color: #FFF;
				color:#333;
			}
		}
		.remarkInput {
			height: 218rpx;
			border-radius: 16rpx;
			border: 2rpx solid #2B72F0;
			margin: 24rpx 36rpx 0 36rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333;
			line-height: 44rpx;
			padding: 20rpx;
		}
		.comfirmBtn {
			position: fixed;
			bottom: 180rpx;
			left: 175rpx;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #2B72F0;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
