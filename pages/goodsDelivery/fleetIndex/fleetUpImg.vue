<template>
	<view class="container">
		<view style="background-color: #FFFFFF;padding: 32rpx 0 0 32rpx;">
			<view class="mainTitle" v-if="qrCodeImage">车队二维码</view>
			<view class="pic-container">
				<view class="picItem" v-if="qrCodeImage">
					<image :src="qrCodeImage" class="add-img" mode="aspectFill" @click="prevImageEvent(qrCodeImage)"></image>
					<view class="delete" @click="deleteQrImage()">x</view>
					<!-- <text class="success">审核通过</text> -->
				</view>
			</view>
		</view>
		<view class="row" v-if="!qrCodeImage">
			<view class="mainTitle">上传车队二维码</view>
			<view class="addPic" @click="addPic(1)">
				<view class="add-item">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/carame.png" class="carame"></image>
					<text class="carame-text">添加照片</text>
				</view>
			</view>
		</view>
		<view style="background-color: #FFFFFF;padding: 32rpx 0 0 32rpx;">
			<view class="mainTitle" v-if="imgArr && imgArr.length > 0">车队照片</view>
			<view class="pic-container">
				<view class="picItem" v-for="item in imgArr">
					<image :src="item.fleetImage" class="add-img" mode="aspectFill" @click="prevImageEvent(item.fleetImage)"></image>
					<view class="delete" @click="deletePic(item)">x</view>
					<text v-if="item.verifyStatus == 1 || item.verifyStatus == 3" class="success">审核通过</text>
					<text v-if="item.verifyStatus == 0" class="willCheck">待审核</text>
					<text v-if="item.verifyStatus == 2" class="noSuccess">审核不通过</text>
					<view class="noPass" v-if="item.verifyStatus== 2" @click="prevImageEvent(item.fleetImage)">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/noPassing.png" class="noImg"></image>
					</view>
					<view class="checking" v-if="item.verifyStatus== 0" @click="prevImageEvent(item.fleetImage)">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/passing.png" class="noImg"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="row" v-if="imgArr.length<20">
			<view class="mainTitle">上传车队照片</view>
			<view class="addPic" @click="addPic(2)">
				<view class="add-item">
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/carame.png" class="carame"></image>
					<text class="carame-text">添加照片</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				imgArr: [],
				qrCodeImage: ''
			}
		},
		onLoad(options) {
			var fleetId = options.fleetId;
			this.fleetId = fleetId;
			this.init(fleetId);
			this.fleetDetail();
		},
		methods: {
			prevImageEvent(img){
				uni.previewImage({
					urls: [img]
				})
			},
			async init(fleetId) {
				try{
					var res = await ship.newQueryPostRequest("/cd/fleetImage/list", {
						fleetId: fleetId
					})
					if (res.retCode == "0000000") {
						this.imgArr = res.rspBody
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					console.log(res, '车队图片')
				}catch(e){
					//TODO handle the exception
				}
			},
			addPic(flag) {
				//添加照片
				var that = this;
				uni.chooseImage({
					count: 1,
					success: function(res) {
						console.log(res)
						var imgPath = res.tempFilePaths;
						uni.showLoading({
							title: '上传中...'
						})
						that.loadImg(imgPath[0], flag);
					},
					fail: function(err) {
						
					}
				})
			},
			async loadImg(path, flag) {
				try{
					var imgArr = this.imgArr;
					var res = await ship.upLoadFile("/file/upload", path);
					console.log(res);
					if (res.retCode == "0000000") {
						var imgPath = res.rspBody[0].url;
						switch(flag) {
							case 1:
								this.submitImage(imgPath);
								break;
							case 2:
								this.saveImg(imgPath);
								break;
						}
					} else {
						uni.hideLoading();
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			
			async saveImg(imgPath) {
				try{
					var res = await ship.postRequest("/cd/fleetImage/add", {
						fleetId: this.fleetId,
						fleetImage: imgPath,
						verifyStatus: 3
					})
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '添加成功',
							icon: 'none'
						})
						this.init(this.fleetId);
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
			},
			async deletePic(item) {
				uni.showLoading({
					title: '删除中...'
				})
				try{
					var res = await ship.postRequest("/cd/fleetImage/remove", {
						id: item.id
					})
					uni.hideLoading();
					console.log(res)
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						this.init(this.fleetId);
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					console.log(e)
					//TODO handle the exception
				}
			},
			async submitImage(imgPath) {
				console.log('开始保存');
				try{
					uni.showLoading({
						title: '提交中',
					})
					let params = {
						id: this.fleetId,
						qrcode: imgPath
					}
					console.log('参数', params);
					let that = this;
					var res = await ship.postRequest("/cd/fleet/save", params);
					console.log('保存结果', res);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						that.fleetDetail(that.fleetId);
						uni.$emit("editFleetDetail");
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
					
				}catch(e){
					uni.hideLoading();
					console.log('二维码上传失败', e);
				}
			},
			async deleteQrImage() {
				try{
					uni.showLoading({
						title: '提交中',
					})
					let params = {
						id: this.fleetId,
						qrcode: ''
					}
					console.log('参数', params);
					let that = this;
					var res = await ship.postRequest("/cd/fleet/save", params);
					console.log('保存结果', res);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						that.fleetDetail(that.fleetId);
						uni.$emit("editFleetDetail");
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
					
				}catch(e){
					uni.hideLoading();
					console.log('二维码上传失败', e);
				}
			},
			fleetDetail(num){
				var that = this;
				ship.newQueryPostRequest("/cd/fleet/list", {
					id: that.fleetId,
				})
				.then(res=>{
					if(res.retCode == "0000000"){
						let items = res.rspBody.items;
						that.qrCodeImage = items['0'].qrcode ? items['0'].qrcode : '';
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err=>{
					
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	page{
		background-color: #F4F4F4;
	}
	.container {
		background-color: #F2F2F2;
		padding-top: 16rpx;
		box-sizing: border-box;
		min-height: 100vh;
		.pic-container {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 0 30rpx 0 0;
			
			box-sizing: border-box;
			.picItem {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				margin-bottom: 32rpx;
				width: 320rpx;
				position: relative;
				&:nth-child(2n + 1) {
					margin-right: calc(100vw - 702rpx);
				}
				.success {
					color: #2DA955;
				}
				.noSuccess {
					color: rgba(252, 45, 45, 1);
				}
				.willCheck {
					color: rgba(119, 119, 119, 1);
				}
				.delete {
					position: absolute;
					right: 0;
					top: 0;
					width: 40rpx;
					height: 40rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-top-right-radius: 12rpx;
					background-color: rgba(0, 0, 0, .85);
					color: #FFFFFF;
					z-index: 99;
				}
			}
		}
		.add-img {
			width: 320rpx;
			height: 400rpx;
			margin-bottom: 16rpx;
			border-radius: 12rpx;
		}
		.noPass {
			position: absolute;
			top: 0;
			left: 0;
			width: 320rpx;
			height: 400rpx;
			background-color: rgba(252, 45, 45, .24);
			z-index: 9;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 12rpx;
			.noImg {
				width: 80rpx;
				height: 80rpx;
			}
		}
		.checking {
			position: absolute;
			top: 0;
			left: 0;
			width: 320rpx;
			height: 400rpx;
			background-color: rgba(51, 51, 51, .54);
			z-index: 9;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 12rpx;
			.noImg {
				width: 80rpx;
				height: 80rpx;
			}
		}
		.row {
			background-color: #FFFFFF;
			padding: 0 0 32rpx 32rpx;
			box-sizing: border-box;
		}
		.mainTitle {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
			line-height: 33rpx;
			margin-bottom: 12rpx;
		}
		.addPic {
			background-color: #F9F9FA;
			border-radius: 12rpx;
			width: 320rpx;
			height: 400rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.add-item {
				width: 160rpx;
				height: 136rpx;
				border: 2rpx dotted #979797;
				border-radius: 12rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.carame {
					width: 54rpx;
					height: 42rpx;
					margin-bottom: 10rpx;
				}
				.carame-text {
					color: #AAAAAA;
					font-size: 20rpx;
				}
			}
		}
	}
</style>
