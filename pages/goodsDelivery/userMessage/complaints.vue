<template>
	<view class="complaintsPage">
		<view class="complaintsDetailsBox">
			<view class="complaintsList">
				<view class="title">请选择你想要投诉的类型</view>
				<view class="aryData">
					<view
						class="carList"
						v-for="(item, index) in complaintsData"
						:key="index"
						@tap="chooseCarLongData(item)"
						:class="checkCarLongRepeat(item.sid) ? 'isChecked' : 'isDefault'">
						{{item.label}}
					</view>
				</view>
			</view>
			<textarea class="noteBox" v-model="remark" maxlength="200" placeholder-style="font-size: 24rpx;color:#AAAAAA" placeholder="填输入"/>
		</view>
		<view class="submitBtn" @click="toSubmit()">提交</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				complaintsData: [{
					label: '垃圾营销',
					sid: 1,
				}, {
					label: '涉黄信息',
					sid: 2,
				}, {
					label: '人身攻击',
					sid: 3,
				}, {
					label: '有害信息',
					sid: 4,
				}, {
					label: '违法信息',
					sid: 5,
				}, {
					label: '诈骗信息',
					sid: 6,
				}, {
					label: '其他',
					sid: 7,
				}],
				remark: '',
				checkedCarLongAry: [],
				groupId: '',
				userCode: '',
				isLoading: false
			};
		},
		onLoad(option) {
			console.log(option);
			this.groupId = option.groupId ? option.groupId : '';
			this.userCode = option.userCode ?  option.userCode : '';
		},
		methods: {
			chooseCarLongData(item) {
				if(this.checkCarLongRepeat(item.sid)) {
					for(let i in this.checkedCarLongAry) {
						if(this.checkedCarLongAry[i] == item.sid) {
							this.checkedCarLongAry.splice(i, 1);
							break;
						}
					}
				}else {
					this.checkedCarLongAry.push(item.sid);
				}
				this.$forceUpdate();
			},
			checkCarLongRepeat(val) { // 重复判断
				for(let i in this.checkedCarLongAry) {
					if(this.checkedCarLongAry[i] == val) {
						return true;
					}
				}
				// this.$forceUpdate();
			},
			toSubmit() {
				if(this.isLoading) return false;
				this.isLoading = true;
				uni.showLoading({
					title: '提交中'
				});
				console.log(this.checkedCarLongAry);
				let complaintType = this.checkedCarLongAry.length > 0 ? this.checkedCarLongAry.toString() : '';
				if(!complaintType && !this.remark) {
					uni.showToast({
						title: '请选择投诉内容',
						icon: 'none',
						duration: 3000
					})
					this.isLoading = false;
					return false;
				}
				let params = {
					"targetUserCode": this.userCode ? this.userCode : undefined,
					"targetGroupCode": this.groupId ? this.groupId : undefined,
					"complaintType": complaintType,
					"complaintContent": this.remark
				}
				console.log('投诉参数', params);
				utils.postRequest("/ps/imComplaint/add", params)
				.then(res=>{
					console.log('投诉回执', res);
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '感谢您的反馈，我们将尽快核实处理。',
							icon: 'none',
							duration: 3000
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2500);
					}else {
						this.isLoading = false;
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F3F3;
	}
	.complaintsPage {
		// padding-top: 20rpx;
		.complaintsDetailsBox {
			background-color: #FFF;
			padding: 20rpx 0;
			.complaintsList {
				padding: 20rpx 30rpx;
				.title {
					flex: 1;
					font-size: 32rpx;
					font-weight: bold;
					color: #222222;
				}
				.aryData {
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					.carList {
						margin: 22rpx 19rpx 0 19rpx;
						border-radius: 8rpx;
						text-align: center;
						font-size:24rpx;
						height: 52rpx;
						line-height: 52rpx;
						width: 124rpx;
					}
					.isDefault {
						border: 2rpx solid #979797;
						color:#777;
						.priceInput {
							color: #C2C2C9;
						}
						.inputSyb {
							color: #C2C2C9;
						}
					}
					.isChecked {
						background: #E0EFFD;
						color: #4AA2F3;
						border: 2rpx solid #4AA2F3;
						.priceInput {
							color: #4AA2F3;
						}
						.inputSyb {
							color: #4AA2F3;
						}
					}
				}
			}
			.noteBox {
				width: 654rpx;
				height: 180rpx;
				margin: 0 32rpx;
				background: #F4F4F4;
				border-radius: 12rpx;
				padding:20rpx;
				font-size: 22rpx;
				color: #333;
			}
		}
		.submitBtn {
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
