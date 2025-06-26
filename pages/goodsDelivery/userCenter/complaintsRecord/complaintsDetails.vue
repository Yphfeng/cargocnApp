<template>
	<view class="complaintsDetails">
		<view class="waybillNum">运单号：HY1231231234</view>
		<uni-steps :active-color="'#4AA2F3'" :options="stepOPtion" :active="active"></uni-steps>
		<view class="flexRow">
			<view class="complaintsMsgBox">
				<view class="title">申请时间</view>
				<view class="msg">2021-08-12 14:34</view>
			</view>
			<view class="complaintsMsgBox">
				<view class="title">问题类型</view>
				<view class="msg">货物损失</view>
			</view>
		</view>
		<view class="complaintsMsgBox">
			<view class="title">保价情况</view>
			<view class="msg">申明价值¥5000.00</view>
		</view>
		<view class="msgLine"></view>
		<view class="complaintsMsgBox">
			<view class="title">备注</view>
			<view class="msg">这个货物到了之后发现少了</view>
		</view>
		<view class="complaintsMsgBox">
			<view class="title">照片</view>
			<view class="magImageList">
				<view class="img"></view>
				<view class="img"></view>
				<view class="img"></view>
			</view>
		</view>
		<view class="testBtn" @click="changeStep()">修改进度</view>
		<view class="evaluationBox" v-if="active > 1">
			<view class="subTitle" v-show="active == 2">您对本次投诉服务是否满意？</view>
			<view class="mainTitle" v-show="active > 2">满意度</view>
			<view class="satisfiedBox">
				<view class="imgBox"><image :class="evaluationVal > 0 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 0 ? likeImg : unLikeImg" @tap="changeEvaluationVal(1)"></image></view>
				<view class="imgBox"><image :class="evaluationVal > 1 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 1 ? likeImg : unLikeImg" @tap="changeEvaluationVal(2)"></image></view>
				<view class="imgBox"><image :class="evaluationVal > 2 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 2 ? likeImg : unLikeImg" @tap="changeEvaluationVal(3)"></image></view>
				<view class="imgBox"><image :class="evaluationVal > 3 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 3 ? likeImg : unLikeImg" @tap="changeEvaluationVal(4)"></image></view>
				<view class="imgBox"><image :class="evaluationVal > 4 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 4 ? likeImg : unLikeImg" @tap="changeEvaluationVal(5)"></image></view>
			</view>
			<view class="evaluationMsg" :style="evaluationVal > 3 ? 'color:#4AA2F3;' : 'color:#F29347;'">{{showSatisfiedMsg()}}</view>
			<view class="otherSatisfiedType">
				<view class="title">服务态度：</view>
				<view class="contentBox">
					<view class="evaluationSatisfied" v-if="active == 2 || attitudeVal == 1">
						<image class="satisfiedIcon" @tap="changeSatisfiedVal('attitude', 1)" :src="attitudeVal == 1 ? satisfiedPoorCheck : satisfiedPoor"></image>
						<view class="satisfiedMsg" :style="attitudeVal == 1 ? 'color:#F29347;' : 'color:#AAAAAA;'">差</view>
					</view>
					<view class="evaluationSatisfied" v-if="active == 2 || attitudeVal == 2">
						<image class="satisfiedIcon" @tap="changeSatisfiedVal('attitude', 2)" :src="attitudeVal == 2 ? satisfiedGeneralCheck : satisfiedGeneral"></image>
						<view class="satisfiedMsg" :style="attitudeVal == 2 ? 'color:#4AA2F3;' : 'color:#AAAAAA;'">一般</view>
					</view>
					<view class="evaluationSatisfied" v-if="active == 2 || attitudeVal == 3">
						<image class="satisfiedIcon" @tap="changeSatisfiedVal('attitude', 3)" :src="attitudeVal == 3 ? satisfiedGoodCheck : satisfiedGood"></image>
						<view class="satisfiedMsg" :style="attitudeVal == 3 ? 'color:#4AA2F3;' : 'color:#AAAAAA;'">超级赞</view>
					</view>
				</view>
			</view>
			<view class="otherSatisfiedType" style="margin-bottom:56rpx;">
				<view class="title">处理速度：</view>
				<view class="contentBox">
					<view class="evaluationSatisfied" v-if="active == 2 || speedVal == 1">
						<image class="satisfiedIcon" @tap="changeSatisfiedVal('speed', 1)" :src="speedVal == 1 ? satisfiedPoorCheck : satisfiedPoor"></image>
						<view class="satisfiedMsg" :style="speedVal == 1 ? 'color:#F29347;' : 'color:#AAAAAA;'">差</view>
					</view>
					<view class="evaluationSatisfied" v-if="active == 2 || speedVal == 2">
						<image class="satisfiedIcon" @tap="changeSatisfiedVal('speed', 2)" :src="speedVal == 2 ? satisfiedGeneralCheck : satisfiedGeneral"></image>
						<view class="satisfiedMsg" :style="speedVal == 2 ? 'color:#4AA2F3;' : 'color:#AAAAAA;'">一般</view>
					</view>
					<view class="evaluationSatisfied" v-if="active == 2 || speedVal == 3">
						<image class="satisfiedIcon" @tap="changeSatisfiedVal('speed', 3)" :src="speedVal == 3 ? satisfiedGoodCheck : satisfiedGood"></image>
						<view class="satisfiedMsg" :style="speedVal == 3 ? 'color:#4AA2F3;' : 'color:#AAAAAA;'">超级赞</view>
					</view>
				</view>
			</view>
			<view class="toComplaints"  v-if="active == 2" @tap="submitEvaluation()">发布评价</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 1,
				stepOPtion: [{title: '已提交'}, {title: '处理中'}, {title: '已完结'}, {title: '已评价'}],
				evaluationVal: 1, // 评分值
				likeImg: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/like.png',
				unLikeImg: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/unLike.png',
				attitudeVal: 2, //  服务态度
				speedVal: 2, // 处理速度
				satisfiedPoor: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedPoor.png',
				satisfiedPoorCheck: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedPoorCheck.png',
				satisfiedGeneral: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedGeneral.png',
				satisfiedGeneralCheck: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedGeneralCheck.png',
				satisfiedGood: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedGood.png',
				satisfiedGoodCheck: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedGoodCheck.png',
			};
		},
		methods: {
			changeStep() { // 测试用修改进度
				this.active = this.active > 3 ? 0 : this.active + 1;
				if(!this.active) {
					this.evaluationVal = 1;
					this.attitudeVal = 2;
					this.speedVal = 2;
				}
				this.$forceUpdate();
			},
			submitEvaluation() { // 发布评价
				this.active = 3;
			},
			changeSatisfiedVal(type, val) { // 服务态度选择
				if(this.active != 2) return false;
				switch(type) {
					case 'attitude':
						this.attitudeVal = val;
						break;
					case 'speed':
						this.speedVal = val;
						break;
				}
			},
			showSatisfiedMsg() { // 展示评价文案
				switch(this.evaluationVal) {
					case 1:
						return '很不满意';
					case 2:
						return '不满意';
					case 3:
						return '一般';
					case 4:
						return '满意';
					case 5:
						return '非常满意';
				}
			},
			changeEvaluationVal(val) { // 修改评价
				if(this.active != 2) return false;
				this.evaluationVal = val;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFF;
	}
	.complaintsDetails {
		.waybillNum {
			background-color: #FFF;
			padding: 40rpx 60rpx 78rpx 60rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
			line-height: 48rpx;
		}
		.flexRow {
			padding-top:10rpx;
			display: flex;
			.complaintsMsgBox {
				flex: 1;
			}
		}
		.complaintsMsgBox {
			margin-top:38rpx;
			padding-left: 60rpx;
			.title {
				font-size: 26rpx;
				color: #777777;
				line-height: 36rpx;
			}
			.msg {
				font-size: 28rpx;
				color: #333333;
				line-height: 40rpx;
				margin-top:20rpx;
			}
			.magImageList {
				margin-top:20rpx;
				display: flex;
				align-items: center;
				.img + .img {
					margin-left:26rpx;
				}
				.img {
					width: 148rpx;
					height: 128rpx;
					background: #D8D8D8;
				}
			}
		}
		.msgLine {
			margin-left:60rpx;
			margin-top:30rpx;
			width: 364rpx;
			height: 2rpx;
			background-color: #AAAAAA;
		}
		.evaluationBox {
			border-top:16rpx solid #F3F3F3;
			background-color: #FFF;
			padding: 38rpx 60rpx 24rpx 60rpx;
			margin-top:40rpx;
			.mainTitle {
				font-size: 32rpx;
				color: #333333;
				line-height: 44rpx;
			}
			.subTitle {
				font-size: 28rpx;
				color: #777777;
				line-height: 40rpx;
			}
			.satisfiedBox {
				margin-top: 30rpx;
				padding: 0 64rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.imgBox {
					width: 72rpx;
					height: 70rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.largeImg {
					width: 72rpx;
					height: 70rpx;
				}
				.smallImg {
					width: 56rpx;
					height: 54rpx;
				}
			}
			.evaluationMsg {
				margin: 16rpx 0 32rpx 0;
				text-align: center;
				font-size: 28rpx;
				line-height: 40rpx;
			}
			.otherSatisfiedType + .otherSatisfiedType {
				margin-top: 32rpx;
			}
			.otherSatisfiedType{
				display: flex;
				align-items: center;
				.title {
					font-size: 26rpx;
					color: #777777;
					line-height: 36rpx;
					margin-right:18rpx;
				}
				.contentBox {
					flex: 1;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.evaluationSatisfied {
						display: flex;
						align-items: center;
						.satisfiedIcon {
							width: 48rpx;
							height: 48rpx;
							margin-right: 20rpx;
						}
						.satisfiedMsg {
							font-size: 26rpx;
							line-height: 36rpx;
						}
					}
				}
			}
			.toComplaints {
				border-radius: 44rpx;
				height: 90rpx;
				line-height: 90rpx;
				box-shadow:  0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
				background-color: #4AA2F3;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
		}
		.testBtn {
			height: 60rpx;
			line-height: 60rpx;
			width: 160rpx;
			background-color: #4AA2F3;
			border-radius: 12rpx;
			margin: 40rpx auto 0 auto;
			font-size: 28rpx;
			color:#FFF;
			text-align: center;
		}
	}
</style>
