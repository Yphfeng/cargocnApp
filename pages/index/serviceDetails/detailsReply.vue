<template>
	<view class="detailsReply">
		<view class="newHeader">
			<view class="backBtn" @tap="backToFromPage()">取消</view>
			<view class="pageTitle">发评价</view>
			<view  class="headerSaveBtn" @tap="toSave()">发送</view>
		</view>
		<view class="replyInputBox">
			<textarea maxlength="100" class="replyInput" v-model="replyVal" :focus="inputFocus" auto-height placeholder="请输入评价..." @input="inputChange" @tap="inputFocus = true"/>
			<view class="hint">{{inputHint}}</view>
			<view class="uploadImgBox">
				<view class="addImgBtn" @tap="toUploadImg()" v-if="imagesAry && imagesAry.length != 3">
					<image class="addImg" src="../../../static/images/addImgIcon.png"></image>
				</view>
				<view class="submitImg" v-for="(item, index) in imagesAry" :key="index">
					<image class="selected-img" :src="item.url" @tap="showBixImages(item.url)"></image>
					<image class="select-cancel" @tap="cancelEvent(index)" src="/static/images/deleteImgIcon.png"></image>
				</view>
			</view>
		</view>
		<view class="impressionBox" v-if="queryItem.type == 'service'">
			<view class="impressionTitle">选择印象</view>
			<view class="impressionBtnGroup">
				<view
					class="impressionBtn"
					v-for="(item, index) in evaluationData"
					:key="index"
					:class="checkImpressionData(item.id) ? 'checkedBtn' : 'defaultBtn'"
					@tap="addImpression(item.id, index)">
					{{item.evaluationName}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js"
	
	export default {
		data() {
			return {
				isClicking: false,
				replyVal: '',
				userInfo: {},
				imagesAry: [],
				queryItem: '',
				evaluationData: [],
				checkedEvaluation: [],
				inputFocus: false,
				inputHint: 100
			}
		},
		onLoad(option) {
			this.isClicking = false;
			if(option.type) {
				this.queryItem = option;
				if(option.type == 'service') {
					this.getEvaluationInfo(option.typeId);
				}
			}
			let that = this;
			uni.onKeyboardHeightChange(res => {
				if (res.height == 0) {
					that.inputFocus = false
					uni.$emit("hideKeyBoard");
				}else {
					setTimeout(() => {
						this.inputFocus = true;
					}, 100)
				}
			})
		},
		onShow() {
			
		},
		onReady() {
			setTimeout(() => {
				this.inputFocus = true;
			}, 100)
		},
		methods: {
			inputChange(e) {
				console.log(e.target.cursor);
				this.inputHint = 100 - Number(e.target.cursor);
			},
			getEvaluationInfo(typeId) {
				let that = this;
				utils.postRequest('/mu/providerComment/evaluation/selectByTypeId', { typeId: typeId })
				.then(res=>{
					console.log('服务站评价标签', res);
					if(res.retCode == "0000000"){
						that.evaluationData = res.rspBody;
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch((err=>{
					console.log(err)
				}))
			},
			addImpression(val) { // 无重复则添加，有重复则删除，印象未多选
				let repeatFlag = this.checkImpressionData(val);
				if(repeatFlag) {
					for(let i in this.checkedEvaluation) {
						if(this.checkedEvaluation[i] == val) {
							this.checkedEvaluation.splice(i, 1);
							break;
						}
					}
				}else {
					if(this.checkedEvaluation && this.checkedEvaluation.length == 3) {
						uni.showToast({
							title: '最多选择3个标签!',
							icon: 'none'
						});
						return false;
					}
					this.checkedEvaluation.push(val);
				}
				this.$forceUpdate();
			},
			checkImpressionData(val) { // 是否当前印象已被选中
				let flag = false;
				for(let i in this.checkedEvaluation) {
					if(this.checkedEvaluation[i] == val) {
						flag = true;
						break;
					}
				}
				return flag;
			},
			toUploadImg() { // 上传图片
				var that = this;
				var num = 3 - that.imagesAry.length;
				uni.chooseImage({
					count: num,
					// 默认9  
					sizeType: ['compressed'],
					// 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['camera', 'album'],
					// 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
						var tempFilePaths = res.tempFilePaths;
						res.tempFilePaths.map(val=>{
							that.uploadImg(val);
						})
					}
				});
			},
			uploadImg(image) {
				uni.showLoading({
					title: '请稍候...'
				});
				var that = this;
				uni.uploadFile({
					url: utils.ApiRootUrl + '/file/upload',
					filePath: image,
					name: 'file',
					formData: {
						userType: '84'
					},
					success: function(res) {
						uni.hideLoading();
						var result = JSON.parse(res.data);
						if(result.retCode == '0000000'){
							var obj = {url: result.rspBody[0].url}
							that.imagesAry.push(obj);
						} else{
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							});
						}
					},
					fail: function(res) {
						uni.showToast({
							title: '网络错误!',
							icon: 'none'
						});
						uni.hideLoading();
					},
				});
			},
			showBixImages(url) { // 预览图片
				uni.previewImage({ urls: [url] });
			},
			toSave() { // 发表评价
				console.log('评价内容', this.replyVal);
				
				if (this.isClicking) {
					return
				}
				if (!this.replyVal) {
					uni.showToast({
						title: '评价不能为空',
						icon: 'none'
					})
					return false;
				}
				this.isClicking = true;
				
				var facadeImage = '';
				if(this.imagesAry && this.imagesAry.length > 0) {
					for(let i in this.imagesAry) {
						facadeImage = facadeImage + this.imagesAry[i].url + ',';
					}
					facadeImage = facadeImage.substr(0, facadeImage.length - 1);
				}
				// let str = this.replyVal;
				// this.replyVal = str.replace(/\s*/g,"");
				switch(this.queryItem.type) {
					case 'service':
						this.saveServiceComment(facadeImage);
						break;
					case 'road':
						this.saveRoadComment(facadeImage);
						break;
					case 'mutual':
						this.saveMutualComment(facadeImage);
						break;
				}
			},
			saveServiceComment(facadeImage) { // 服务站评价
				var that = this;
				let params = {
					providerId: that.queryItem.id,
					content: that.replyVal.replace(/^\s*|\s*$/g,""),
					facadeImgs: facadeImage,
					commentEvaluationIds: that.checkedEvaluation
				};
				console.log('评价提交参数', params);
				utils.postRequest('/mu/providerComment/save', params)
				.then(res=>{
					console.log('评价', res);
					if(res.retCode=="0000000"){
						let duration = 1500;
						uni.showToast({
							title: '评价成功',
							icon: 'none',
							duration: duration
						})
						uni.$emit("refreshApi");
						setTimeout(()=>{
							uni.navigateBack({});
							that.isClicking = false
						}, duration);
					} else{
						
						that.isClicking = false
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					this.isClicking = false;
					console.log(err)
				})
			},
			saveRoadComment(facadeImage) { // 路况评价
				var that = this;
				let params = {
					situationId: that.queryItem.id,
					content: that.replyVal.replace(/^\s*|\s*$/g,""),
					facadeImage: facadeImage
				};
				console.log('评价提交参数', params);
				utils.postRequest('/mu/situation/comment/save', params)
				.then(res=>{
					console.log('评价', res);
					if(res.retCode=="0000000"){
						let duration = 1500;
						uni.showToast({
							title: '评价成功',
							icon: 'none',
							duration: duration
						})
						uni.$emit("refreshApi");
						setTimeout(()=>{
							uni.navigateBack({});
							this.isClicking = false
						}, duration);
					} else{
						this.isClicking = false;
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					this.isClicking = false;
					console.log(err)
				})
			},
			saveMutualComment(facadeImage) { // 互助评价
				var that = this;
				let params = {
					helpId: that.queryItem.id,
					content: that.replyVal.replace(/^\s*|\s*$/g,""),
					facadeImage: facadeImage
				};
				console.log('评价提交参数', params);
				utils.postRequest('/mu/helpcomment/save', params)
				.then(res=>{
					console.log('评价', res);
					if(res.retCode=="0000000"){
						let duration = 1500;
						uni.showToast({
							title: '评价成功',
							icon: 'none',
							duration: duration
						})
						uni.$emit("refreshApi");
						setTimeout(()=>{
							uni.navigateBack({});
							this.isClicking = false;
						}, duration);
					} else{
						this.isClicking = false;
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					this.isClicking = false;
					console.log(err)
				})
			},
			
			backToFromPage() {
				uni.navigateBack({});
			},
			cancelEvent(index){ // 删除上传图片
				this.imagesAry.splice(index, 1); ;
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}
	.detailsReply {
		padding-top: 174rpx;
			.hint {
				text-align: right;
				font-size:28rpx;
				color:#777;
				padding-top:20rpx;
				padding-right:20rpx;
			}
		.newHeader {
			width:670rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:100rpx 40rpx 14rpx 40rpx;
			background-color: #FFF;
			position: fixed;
			z-index: 999;
			top: 0;
			.backBtn {
				font-size:30rpx;
				font-weight:bold;
				color:#333;
			}
			.pageTitle {
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size:36rpx;
				color:#333;
			}
			.headerSaveBtn {
				width:116rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size:28rpx;
				color:#FFF;
				text-align: center;
				background: #FF7D4A;
				border-radius: 32rpx;
			}
		}
		.replyInputBox {
			margin-top: 2rpx;
			padding: 30rpx 40rpx;
			background-color: #fff;
			.replyInput {
				min-height:120rpx;
				width:670rpx;
				font-size:28rpx;
				color:#333;
			}
			.uploadImgBox {
				padding-top:30rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.addImgBtn {
					border: 2rpx dashed #CBCBCB;
					padding:60rpx;
					margin-right:10rpx;
					.addImg {
						max-width: 102rpx;
						max-height: 102rpx;
					}
				}
				.submitImg + .submitImg {
					margin-left:10rpx;
				}
				.submitImg {
					width:224rpx;
					height: 224rpx;
					border: 2rpx solid #CBCBCB;
					.selected-img {
						max-width:224rpx;
						max-height: 224rpx;
					}
					.select-cancel {
						width:40rpx;
						height: 40rpx;
						position: absolute;
						margin-left:-40rpx;
					}
				}
			}
		}
		.impressionBox {
			margin-top:10rpx;
			padding: 30rpx 30rpx;
			background-color: #fff;
			.impressionTitle {
				font-size:34rpx;
				color:#333;
				padding-left:10rpx;
			}
			.impressionBtnGroup {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
			}
			.impressionBtn {
				padding:0 20rpx;
				height: 46rpx;
				line-height: 46rpx;
				border-radius: 24rpx;
				font-size:26rpx;
				margin:20rpx 10rpx 0 10rpx;
			}
			.defaultBtn {
				border: 2rpx solid #D3D3D3;
				color:#333;
			}
			.checkedBtn {
				border: 1px solid #FA6400;
				color:#FA6400;
			}
		}
	}
</style>