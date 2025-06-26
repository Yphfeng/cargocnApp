<template>
	<view class="complaintsDetails">
		<view class="container">
			<view class="waybillNum">运单号：{{taskId}}</view>
			<view class="evaluationBox">
				<view class="subTitle">您对本次服务是否满意？</view>
				<view class="satisfiedBox">
					<view class="imgBox"><image :class="evaluationVal > 0 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 0 ? likeImg : unLikeImg" @tap="changeEvaluationVal(1)"></image></view>
					<view class="imgBox"><image :class="evaluationVal > 1 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 1 ? likeImg : unLikeImg" @tap="changeEvaluationVal(2)"></image></view>
					<view class="imgBox"><image :class="evaluationVal > 2 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 2 ? likeImg : unLikeImg" @tap="changeEvaluationVal(3)"></image></view>
					<view class="imgBox"><image :class="evaluationVal > 3 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 3 ? likeImg : unLikeImg" @tap="changeEvaluationVal(4)"></image></view>
					<view class="imgBox"><image :class="evaluationVal > 4 ? 'largeImg' : 'smallImg'" :src="evaluationVal > 4 ? likeImg : unLikeImg" @tap="changeEvaluationVal(5)"></image></view>
				</view>
				<view class="evaluationMsg" :style="evaluationVal > 3 ? 'color:#4AA2F3;' : 'color:#F29347;'">{{showSatisfiedMsg()}}</view>
				<view class="subTitle">不满意的原因</view>
				<view class="list">
					<view class="item" v-for="(item, index) in listArr">
						<view class="btnItem" :class="{active: item.isSelected}" @click="changeBtn(index)">{{item.labelName}}</view>
					</view>
				</view>	
				<view class="inputWhole">
					<textarea placeholder="有什么想说的吗" class="textArea" v-model="textArea" :disabled="isCommonts"></textarea>
					<view class="inputExtra">
						<view class="pic" @click="addPic">
							<image src="../../../../static/images/goodsDelivery/carame.png" class="carame"></image>
							<view class="caremaText">添加照片</view>
							<view class="tine">0/3</view>
						</view>
						<view class="num">
							0/200
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fix-bottom" v-if="!isCommonts">
			<view class="btn" @tap="submitEvaluation()">发布评价</view>
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	export default {
		data() {
			return {
				isCommonts: false,
				active: 3,
				evaluationVal: 0, // 评分值
				likeImg: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/like.png',
				unLikeImg: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/unLike.png',
				satisfiedPoor: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedPoor.png',
				satisfiedPoorCheck: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedPoorCheck.png',
				satisfiedGeneral: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedGeneral.png',
				satisfiedGeneralCheck: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedGeneralCheck.png',
				satisfiedGood: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedGood.png',
				satisfiedGoodCheck: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/satisfiedGoodCheck.png',
				listArr: [],
				textArea: '',
				taskId: '',
				shipperUserId: '',
				driverUserId: '',
			};
		},
		async onLoad(options) {
			//获取评价的标签
			try{
				var userRole = uni.getStorageSync("userRole");
				//获取标签列表
				var res = await ship.postRequest("/pf/scmd-label/list", {
					labelType: userRole == 1 ? 0 : 1,  //0是评货主的,1是评司机的
				})
				console.log(res, '标签列表')
				if (res.retCode == "0000000") {
					this.listArr = res.rspBody;
				}
				//获取是否已经评论
				var taskId = options.taskId;
				this.shipperUserId = options.shipperUserId;
				this.driverUserId = options.driverUserId;
				this.taskId = taskId;
				var response = await ship.postRequest("/pf/scmd-account-log/list", {
					"taskId": taskId,
					"scoreType": this.userRole == 1 ? 0 : 1, 
				})
				console.log(response)
				if (response.retCode == "0000000" && response.rspBody.length > 0) {
					//说明已经评论
					this.isCommonts = true;
					var rspResult = response.rspBody[0];
					this.evaluationVal = rspResult.scoreValue;
					this.textArea = rspResult.scoreContent;
					this.shipperUserId = rspResult.shipperUserId
					this.driverUserId = rspResult.driverUserId;
					var listArr = this.listArr;
					var scmdLabelVOS = rspResult.scmdLabelVOS;
					if (scmdLabelVOS.length > 0) {
						scmdLabelVOS.forEach(item => {
							var findIndex = listArr.findIndex(atem => {
								return atem.sid == item.sid
							})
							if (findIndex > -1) {
								listArr[findIndex].isSelected = true
							}
						})
						this.listArr = listArr;
					}
					
				} else {
					this.isCommonts = false
				}
			}catch(e){
				//TODO handle the exception
				console.log(e)
			}
		},
		methods: {
			async submitEvaluation() { // 发布评价
			try{
				var listArr = this.listArr;
				var sidArr = [];
				listArr.forEach(item => {
					if (item.isSelected) {
						sidArr.push(item.sid);
					}
				})
				var res = await ship.postRequest("/pf/scmd-account-log/add", {
					taskId: this.taskId,
					shipperUserId: this.shipperUserId,
					driverUserId: this.driverUserId,
					scoreValue: this.evaluationVal,
					scoreType: this.userRole == 1 ? 0 : 1, //0是司机对货主的评价，1是货主对司机的评价
					scoreContent: this.textArea,
					scoreImg: "https://www.baidu.com",
					labelSids: sidArr
				})
				console.log(res)
				if (res.retCode == "0000000") {
					uni.showToast({
						title: '评价成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1000)
				} else {
					uni.showToast({
						title: res.retDesc,
						icon: 'none',
					})
				}
			}catch(e){
				//TODO handle the exception
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
				if (this.isCommonts) return;
				this.evaluationVal = val;
			},
			changeBtn(index) {
				if (this.isCommonts) return;
				var listArr = this.listArr;
				var isSelected = listArr[index].isSelected;
				 listArr[index].isSelected = !isSelected;
				 this.listArr = listArr
				 this.$forceUpdate();
			},
			addPic() {
				//添加照片
				uni.chooseImage({
					count: 3,
					crop: {
						width: 80,
						height: 80,
					},
					success: function(res) {
						console.log(res, '图片')
					}
					
				})
			}
		}
	}
</script>

<style lang="scss">

	.complaintsDetails {
		height: 100vh;
		background-color: #F3F3F3;
		padding: 20rpx 16rpx;
		box-sizing: border-box;
		.container {
			background-color: #FFFFFF;
			border-radius: 12rpx;
			padding-bottom: 32rpx;
		}
		.waybillNum {
			padding: 40rpx 32rpx 24rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
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
			.subTitle {
				font-size: 24rpx;
				color: #777777;
				padding: 0 32rpx 36rpx;
			}
			.list {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 0 20rpx;
				.item {
					width: 33.33%;
					padding: 0 12rpx;
					box-sizing: border-box;
					.btnItem {
						height: 48rpx;
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						border: 1px solid #AAAAAA;
						color: #777777;
						font-size: 22rpx;
						border-radius: 24rpx;
						margin-bottom: 24rpx;
						box-sizing: border-box;
						&.active {
							background-color: #4AA2F3;
							border-color: #4AA2F3;
							color: #FFFFFF;
						}
					}
				}
			}
			.inputWhole {
				height: 416rpx;
				margin: 0 32rpx;
				background-color: #F7F8F9;
				position: relative;
				border-radius: 12rpx;
				padding: 32rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				.textArea {
					flex: 1;
				}
				
				.inputExtra {
					height: 180rpx;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.pic {
						width: 180rpx;
						height: 180rpx;
						border: 1px  dotted #979797;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						border-radius: 12rpx;
						position: relative;
						.tine {
							position: absolute;
							right: 8rpx;
							bottom: 8rpx;
							color: rgba(170, 170, 170, 1);
							font-size: 20rpx;
						}
						.carame {
							width: 54rpx;
							height: 42rpx;
						}
						.caremaText {
							color: #AAAAAA;
							font-size: 20rpx;
							padding-top: 10rpx;
						}
					}
					.num {
						font-size: 24rpx;
						color: #AAAAAA;
					}
				}
			}
			.satisfiedBox {
				margin-top: 36rpx;
				padding: 0 106rpx;
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
			
		}
	}
	.fix-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 136rpx;
		width: 100vw;
		background-color: #FFFFFF;
		border-radius: 24rpx 24rpx 0 0;
		box-shadow: 0 -2rpx 18rpx 0 rgba(0, 0, 0, 0.12);
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);  
		
		.btn {
			height: 104rpx;
			width: calc(100vw - 104rpx);
			border-radius: 44rpx;
			color: #4AA2F3;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
			background-color: #4AA2F3;
			box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.evaluationMsg {
		margin: 16rpx 0 32rpx 0;
		text-align: center;
		font-size: 28rpx;
		line-height: 40rpx;
	}

</style>
