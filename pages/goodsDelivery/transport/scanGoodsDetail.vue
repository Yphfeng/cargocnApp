<template>
	<view class="all">
		<view class="user-box">
			<!-- <view class="user-child">
				<view class="user-title">操作员</view>
				<view class="user-info">{{goodsObj.reqName}} {{goodsObj.mobile}}</view>
			</view>
			<view class="user-child">
				<view class="user-title">时间</view>
				<view class="user-info">{{goodsObj.reqDt}}</view>
			</view>
			<view class="user-child">
				<view class="user-title">地址</view>
				<view class="user-info">{{goodsObj.province + goodsObj.city + goodsObj.county + goodsObj.address}}</view>
			</view> -->
			<view class="">
				<view class="user-child">
					<view class="user-title">操作员</view>
					<view class="user-info">{{goodsObj.reqName}} {{goodsObj.mobile}}</view>
				</view>
				<view class="user-child">
					<view class="user-title">时间</view>
					<view class="user-info">{{goodsObj.reqDt}}</view>
				</view>
				<view class="user-child">
					<view class="user-title">地址</view>
					<view class="user-info">{{goodsObj.province + goodsObj.city + goodsObj.county + goodsObj.address}}</view>
				</view>
			</view>
			<view class="">
				<image class="userInfo-img" src="/static/images/goodsDelivery/userInfo.png" mode=""></image>
			</view>
		</view>
		
		<view class="table-box">
			<view class="table-child">
				<!-- <view class="table-title">货物明细({{tableArr.length}}件)</view> -->
				<view class="table-title">
					<view class="table-left">
						<view class="">{{surfaceNumber}}</view>
						<view class="table-num">（扫描成功{{tableArr.length}}件）</view>
					</view>
				</view>
				<view class="table-all">
					<view class="table-head">
						<view class="head-child">货物</view>
						<view class="head-child">数量</view>
						<view class="head-child">标签数</view>
						<view class="head-child">扫描成功数</view>
					</view>
					<view class="table-content" v-for="(item, idx) in tableArr">
						<view class="content-child">{{item.gdName}}</view>
						<view class="content-child">{{item.gdNumber}}</view>
						<view class="content-child">{{item.printNumber}}</view>
						<view class="content-child">{{item.successCount}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data(){
			return {
				ldeId: '',
				status: '',
				goodsObj: {},
				tableArr: [],
				surfaceNumber: 0,
			}
		},
		onLoad(options) {
			this.status = options.status;
			this.ldeId = options.ldeId;
			this.goodsObj = JSON.parse(options.map);
			this.surfaceNumber = options.surfaceNumber;
			console.log(this.goodsObj);
			this.findScanRecordDetail();
		},
		methods: {
			findScanRecordDetail(){
				utils.postRequest('/ld/ldebarcode/findScanRecordDetail', {
					ext1: this.ldeId,
					status: this.goodsObj.status,
					postBatchNo: this.goodsObj.postBatchNo,
				}).then(res=>{
					if(res.retCode == "0000000"){
						this.tableArr = res.rspBody;
					}
				})
				.catch(err=>{
					
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F1F4F9;
	}
	.all{
		padding-bottom: 140rpx;
		.user-box{
			margin: 20rpx 36rpx;
			padding: 0 38rpx;
			background-color: #fff;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.user-child{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 0;
				.user-title{
					width: 144rpx;
					font-size: 28rpx;
					font-weight: 600;
					color: #333;
				}
				.user-info{
					width: 294rpx;
					font-size: 24rpx;
					color: #666;
				}
			}
			.userInfo-img{
				width: 136rpx;
				height: 202rpx;
			}
		}
		.status-box{
			padding: 0 30rpx;
			.status-tips{
				color: #333;
				font-weight: 500;
				font-size: 32rpx;
			}
			.status-content{
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				margin-top: 30rpx;
				.status-child{
					color: #666;
					font-size: 26rpx;
					width: 200rpx;
					text-align: center;
					height: 70rpx;
					line-height: 70rpx;
					border: 1rpx solid #999;
					margin-bottom: 30rpx;
					border-radius: 10rpx;
				}
				.status-select{
					color: #fff;
					font-size: 26rpx;
					width: 200rpx;
					text-align: center;
					height: 70rpx;
					line-height: 70rpx;
					margin-bottom: 30rpx;
					border-radius: 10rpx;
					background-color: #4AA2F3;
				}
			}
		}
		.table-box{
			margin: 44rpx 0;
			.mar-box{
				margin-top: 30rpx;
			}
			.table-child{
				background: linear-gradient(180deg, #FFFFFF 0%, #F1F4F9 100%);
				margin-bottom: 44rpx;
				.table-title{
					padding: 34rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.table-left{
						display: flex;
						align-items: center;
						font-size: 32rpx;
						font-weight: 600;
						color: #333;
						.table-num{
							color: #666;
							font-size: 24rpx;
						}
					}
					.table-right{
						width: 112rpx;
						height: 44rpx;
						line-height: 44rpx;
						text-align: center;
						border-radius: 30rpx;
						color: #fff;
						font-size: 26rpx;
						background-color: #D05D40;
						margin-right: 20rpx;
					}
					.table-backgroud{
						background-color: #D7D7D7;
					}
				}
				.table-all{
					.table-head{
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: #444;
						font-weight: 500;
						border-bottom: 2rpx solid #ECECEC;
						padding: 20rpx 0;
						.head-child{
							flex: 1;
							text-align: center;
						}
					}
					.table-content{
						display: flex;
						align-items: center;
						font-size: 24rpx;
						color: #444;
						border-bottom: 2rpx solid #ECECEC;
						padding: 22rpx 0;
						.content-child{
							flex: 1;
							text-align: center;
							border-right: 1rpx solid #F3F3F3;
						}
					}
					.table-row{
						background-color: #DDE9FF;
					}
				}
			}
		}
		.btn-box{
			position: fixed;
			bottom: 30rpx;
			left: 30rpx;
			right: 30rpx;
			background-color: #4AA2F3;
			color: #fff;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 50rpx;
			text-align: center;
		}
	}
</style>
