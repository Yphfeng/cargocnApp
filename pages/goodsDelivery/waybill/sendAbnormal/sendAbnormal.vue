<template>
	<view class="container">
		<view class="box">
			<view class="title">选择您遇到的问题：</view>
			<view class="subTitle">
				<text>司机问题</text>
				<image src="../../../../static/images/goodsDelivery/icon_down.png" class="iconDown"></image>
			</view>
			<view class="qContent">
				<view class="qItem" v-for="(item, index) in driverList" :class="{active: item.isSelected}" @click="chooseDriver(index)">{{item.text}}</view>
			</view>
			<view class="subTitle last">
				<text>收到的货物有问题</text>
			</view> 
			<view class="qContent last">
				<view class="qItem" v-for="(item, index) in goodsList" :class="{active: item.isSelected}" @click="chooseGoods(index)">{{item.text}}</view>
			</view>
			<view class="textArea" :class="{active: fileList.length > 0}">
				<textarea class="textAreaContent" maxlength="200" placeholder-style="font-size: 24rpx;color: #AAAAAA;" placeholder="请输入您要上报的问题" v-model="proContent"></textarea>
				<view class="areaBottom" v-if="fileList.length < 1">
					<view class="upFileWhole" @click="upFile">
						<image src="../../../../static/images/goodsDelivery/carame.png" class="carameImg"></image>
						<text class="carameText">添加照片</text>
						<view class="tips">0/3</view>
					</view>
					<view class="extra">0/200</view>
				</view>
				<view class="textAreaFile" v-else>
					<view class="extra">0/200</view>
					<view class="imgList">
						<view class="imgItem" v-for="(item, index) in fileList" @click="prevImage(item)">
							<image :src='item.url' class="img" mode="aspectFit"></image>
							<image src="../../../../static/images/ship/closePic.png" @click.stop="delPic(index)" class="closePic"></image>
							
						</view>
						<view class="imgItem" v-if="fileList.length < 3">
							<view class="upFileWhole" @click="upFile">
								<image src="../../../../static/images/goodsDelivery/carame.png" class="carameImg"></image>
								<text class="carameText">添加照片</text>
								<view class="tips">0/3</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fix-bottom">
			<view class="sendBtn" @click="send()">提交</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js"
	export default {
		data() {
			return {
				driverList: [
					{text: '司机晚点到达卸货地', isSelected: false}, 
					{text: '司机并未到达卸货地', isSelected: false},
				],
				goodsList: [
					{text: '货物损坏', isSelected: false}, 
					{text: '人车不符', isSelected: false},
					{text: '货物错误/质量问题', isSelected: false},
				],
				proContent: '',
				fileList: [],
			}
		},
		methods: {
			chooseDriver(index) {
				var driverList = this.driverList;
				var isSelected = driverList[index].isSelected;
				driverList[index].isSelected = !isSelected
				this.driverList = driverList;
			},
			chooseGoods(index) {
				var  goodsList = this.goodsList;
				var isSelected = goodsList[index].isSelected;
				goodsList[index].isSelected = !isSelected
				this.goodsList = goodsList;
			},
			send() {
				var driverList = this.driverList;
				var driveProblems = []
				driverList.forEach(item => {
					if (item.isSelected) {
						driveProblems.push(item.text)
					}
				})
				var goodsList = this.goodsList;
				var goodsProblems = [];
				goodsList.forEach(item => {
					if (item.isSelected) {
						goodsProblems.push(item.text);
					}
				})
				
				var driverStr = driveProblems.join(",");
				var goodsStr = goodsProblems.join(',');
				var desc = '<div>';
				
				if (driverStr) {
					desc += '<p>司机问题:</p><p>' + driverStr +'</p>'
				}
				if (goodsStr) {
					desc += '<p>收到的货物有问题:</p><p>'+goodsStr+ '</p>'
				}
				var proContent = this.proContent;
				if (proContent) {
					desc += '<p>'+ proContent +'</p>'
				}
				var fileList = this.fileList;
				if (fileList.length > 0) {
					fileList.forEach(item => {
						desc += '<br/><img src="' + item.url + '" style="width: 100rpx;height:100rpx" mode="aspectFit" />'
					})
					
				}
				desc +='</div>';
				
				
				var rand = '';
				for (var i =0; i < 8; i ++) {
					rand += Math.floor(Math.random()*10)
				}
				var uuid = 'WSrPAG9o' + rand; 
				console.log(uuid, '阿萨达');
				utils.postOnesRequest('https://ones.cargocn.com:3443/project/api/project/team/44jWCdAT/tasks/add2', {
					tasks: [{
						uuid: uuid, //当前用户的uuid
						assign: 'WSrPAG9o',//当前用户的uuid
						owner: 'WSrPAG9o',//当前用户的uuid
						parent_uuid:"",
						project_uuid: 'LLNBzLwSHIwS45dM',
						issue_type_uuid: 'VSSBe32Z',
						summary: '测试工单',
						desc: desc,
						priority: 'Nyf7k8ZU',
						field_values:[
							{
								field_uuid: "field012",  //当前用户的uuid  
								type:1,
								value: "Nyf7k8ZU"          
							}
						],
						watchers:["WSrPAG9o"]
					}]
				})
				.then(res=>{
					console.log('ones======>', res)
					if (res.statusCode == 200) {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
						
					}
				})
				.catch(err=>{
					console.log('ones======>', err)
				})
            },
			jumpToList() {
				uni.navigateBack({
				    delta: 2
				});
			},
			upFile() {
				//上传图片
				var that = this;
				uni.chooseImage({
					count: 3,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						console.log(res)
						var tempFilePaths = res.tempFilePaths
						for (var i =0 ; i < tempFilePaths.length ; i++) {
							var tempFilePath = tempFilePaths[i];
							that.uploadFrontImage(tempFilePath)
						}
						
						
					}
				})
			},
			uploadFrontImage(path) {
				console.log(path, utils);
				var that = this;
				utils.upLoadFile("/file/upload", path)
				.then(result => {
					console.log(result, 'fanhui')
					uni.hideLoading()
					if (result.retCode == '0000000') {
						that.fileList.push({
							url: result.rspBody.url
						});	
					} else {
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						})
					}
					
				}).catch(err => {
					uni.hideLoading()
				})
			},
			prevImage(item) {
				//预览图片
				uni.previewImage({
					urls: [item.url]
				})
			},
			delPic(index) {
				var fileList = this.fileList;
				fileList.splice(index, 1);
				this.fileList = fileList
			}
			// send() {
			// 	utils.postOnesRequest('https://ones.cargocn.com:3443/project/api/project/team/44jWCdAT/tasks/add2', {
			// 		tasks: [{
			// 			uuid: 'WSrPAG9o12345669', //当前用户的uuid
			// 			assign: 'WSrPAG9o',//当前用户的uuid
			// 			owner: 'WSrPAG9o',//当前用户的uuid
			// 			parent_uuid:"",
			// 			project_uuid: 'LLNBzLwSHIwS45dM',
			// 			issue_type_uuid: 'VSSBe32Z',
			// 			summary: '测试工单',
			// 			desc: '<div><p>文字</p><br/><img src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/guide1.png" /></div>',
			// 			priority: 'Nyf7k8ZU',
			// 			field_values:[
			// 				{
			// 					field_uuid: "field012",  //当前用户的uuid  
			// 					type:1,
			// 					value: "Nyf7k8ZU"          
			// 				}
			// 			],
			// 			watchers:["WSrPAG9o"]
			// 		}]
			// 	})
			// 	.then(res=>{
			// 		console.log('ones======>', res)
			// 	})
			// 	.catch(err=>{
			// 		console.log('ones======>', err)
			// 	})
			// }
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background-color: #F3F3F3;
		min-height: 100vh;
		padding: 20rpx 16rpx;
		box-sizing: border-box;
	}
	.box {
		background-color: #FFFFFF;
		padding: 0 32rpx 32rpx;
		border-radius: 12rpx;
		.title {
			color: rgba(51, 51, 51, 1);
			font-size: 28rpx;
			font-weight: bold;
			padding: 42rpx 0 32rpx;
		}
		.subTitle {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			color: rgba(119, 119, 119, 1);
			font-size: 24rpx;
			padding-bottom: 30rpx;
			.iconDown {
				width: 31rpx;
				height: 24rpx;
			}
			&.last {
				padding-top: 32rpx;
			}
		}
		.qContent {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			flex-wrap: wrap;
			align-items: center;
			padding: 0 30rpx;
			border-bottom: 1px solid rgba(242, 243, 243, 1);
			&.last {
				border-bottom: none;
			}
			.qItem {
				height: 48rpx;
				line-height: 48rpx;
				border: 1px solid #AAAAAA;
				color: #777777;
				border-radius: 24rpx;
				font-size: 22rpx;
				padding: 0 20rpx;
				margin-bottom: 32rpx;
				margin-right: 32rpx;
				&.active {
					background-color: #4AA2F3;
					color: #FFFFFF;
					border-color: #4AA2F3;
				}
			}
		}
		.textAreaFile {
			padding-top: 24rpx;
			.imgList {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				.imgItem {
					margin: 0 12rpx;
					position: relative;
					.closePic {
						position: absolute;
						width: 48rpx;
						height: 44rpx;
						right: 0;
						top: 0;
						z-index: 99;
					}
				}
				
			}
			.upFileWhole {
				width: 180rpx;
				height: 180rpx;
				border-radius: 12rpx;
				border: 1px dashed rgba(151, 151, 151, 1);
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 20rpx;
				color: rgba(170, 170, 170, 1);
				position: relative;
				.tips {
					position: absolute;
					right: 8rpx;
					bottom: 8rpx;
					color: rgba(170, 170, 170, 1);
					font-size: 20rpx;
				}
			}
			.carameImg {
				width: 44rpx;
				height: 42rpx;
			}
			.extra {
				font-size: 24rpx;
				color: rgba(170, 170, 170, 1);
				text-align: right;
				padding-bottom: 24rpx;
			}
		}
		.textArea {
			background-color: rgba(249, 250, 249, 1);
			border-radius: 12rpx;
			min-height: 416rpx;
			padding: 32rpx;
			font-size: 24rpx;
			display: flex;
			flex-direction: column;
			&.active {
				padding: 32rpx 12rpx;
			}
			.textAreaContent {
				flex: 1;
			}
			.areaBottom {
				height: 180rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;
				.upFileWhole {
					width: 180rpx;
					height: 180rpx;
					border-radius: 12rpx;
					border: 1px dashed rgba(151, 151, 151, 1);
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 20rpx;
					color: rgba(170, 170, 170, 1);
					position: relative;
					.tips {
						position: absolute;
						right: 8rpx;
						bottom: 8rpx;
						color: rgba(170, 170, 170, 1);
						font-size: 20rpx;
					}
				}
				.carameImg {
					width: 44rpx;
					height: 42rpx;
				}
				.extra {
					font-size: 24rpx;
					color: rgba(170, 170, 170, 1);
				}
			}
		}
	}
	.fix-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #FFFFFF;
		box-shadow: 0px -2rpx 18rpx 0px rgba(0,0,0,0.12);
		border-radius: 24rpx 24rpx 0px 0px;
		width: 100vw;
		padding: 23rpx 55rpx;
		box-sizing: border-box;
		.sendBtn {
			background-color: #4AA2F3;
			box-shadow: 0 4rpx 8rpx 0 rgba(38, 158, 255, 0.5);
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 44rpx;
			color: #FFFFFF;
			font-size: 36rpx;
			text-align: center;
		}
	}
	.img {
		width: 180rpx;
		height: 180rpx;
	}
</style>
