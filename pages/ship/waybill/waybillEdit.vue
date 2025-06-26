<template>
	<view class="container" v-if="waybillDetail.status == 1">
		<noData></noData>
	</view>
	<view class="content" v-else-if="waybillDetail.status == 2">
		<view class="img-box">
			<view class="imgs" @click="upFile(0)">
				<view class="bg-default" v-if="!params.loadImg">
					<view class="bg">
						<view class="btn">去上传</view>
					</view>
				</view>
				<image :src="params.loadImg" v-else class="img"></image>
				<text class="text">装车图片</text>
			</view>
			<view class="imgs">
				<view class="bg-default" v-if="!params.loadPoundImg" @click="upFile(1)">
					<view class="bg">
						<view class="btn">去上传</view>
					</view>
				</view>
				<image :src="params.loadPoundImg" v-else class="img" @click="upFile(1)"></image>
				<text class="text">装车磅单</text>
			</view>
		</view>
		<view class="input-whole">
			<view>装车量：</view>
			<input v-model="params.loadAmount" class="input" type="digit" @input="input" @blur="blur" placeholder="请填写" />
			<view class="dun">吨</view>
		</view>
		<view class="fix-bottom" @click="editLoadPan">
			修改
		</view>
	</view>
	<view class="content" v-else>
		<view class="img-box">
			<view class="imgs" @click="upFile(0)">
				<view class="bg-default" v-if="!params.loadImg">
					<view class="bg">
						<view class="btn">去上传</view>
					</view>
				</view>
				<image :src="params.loadImg" v-else class="img"></image>
				<text class="text">装车图片</text>
			</view>
			<view class="imgs">
				<view class="bg-default" v-if="!params.loadPoundImg" @click="upFile(1)">
					<view class="bg">
						<view class="btn">去上传</view>
					</view>
				</view>
				<image :src="params.loadPoundImg" v-else class="img" @click="upFile(1)"></image>
				<text class="text">装车磅单</text>
			</view>
		</view>
		<view class="img-box">
			<view class="imgs">
				<view class="bg-default" v-if="!unParams.unloadImg" @click="upFile(2)">
					<view class="bg">
						<view class="btn">去上传</view>
					</view>
				</view>
				<image :src="unParams.unloadImg" v-else class="img" @click="upFile(2)"></image>
				<text class="text">卸车图片</text>
			</view>
			<view class="imgs">
				<view class="bg-default" v-if="!unParams.unloadPoundImg" @click="upFile(3)">
					<view class="bg">
						<view class="btn">去上传</view>
					</view>
				</view>
				<image :src="unParams.unloadPoundImg" v-else class="img" @click="upFile(3)"></image>
				<text class="text">卸车磅单</text>
			</view>
		</view>
		<view class="img-box">
			<view class="imgs">
				<view class="bg-default" v-if="!unParams.receiptImg" @click="upFile(4)">
					<view class="bg">
						<view class="btn">去上传</view>
					</view>
				</view>
				<image :src="unParams.receiptImg" v-else class="img" @click="upFile(4)"></image>
				<text class="text">卸车回单</text>
			</view>
			<view class="imgs"></view>
		</view>
		<view class="input-whole">
			<view>装车量：</view>
			<input v-model="params.loadAmount" class="input" type="digit" @input="input" @blur="blur" placeholder="请填写" />
			<view class="dun">吨</view>
		</view>
		<view class="input-whole">
			<view>卸车量：</view>
			<input v-model="unParams.unloadAmount" type="digit" @input="input1" @blur="blur1" class="input" placeholder="请填写"  />
			<view class="dun">吨</view>
		</view>
		
		<view class="fix-bottom" @click="editLoadPan">
			修改
		</view>
	</view>
</template>

<script>
	const dateTimePicker = require('./dateTimePicker.js')
	import * as ship from "@/utils/ship";
	var transportModule = uni.requireNativePlugin("TransportModule");
	import noData from "@/components/noData.vue"
	export default {
		components: {
			noData,
		},
		data() {
			return {
				noCheckWeightCoNames: '',
				params: {
					loadImg: '',
					loadPoundImg: '',
					sid: '',
					loadAmount: '',
				},
				unParams: {
					unloadImg: '',
					unloadPoundImg: '',
					unloadAmount: '',
					receiptImg: '',
				}
			}
		},
		onLoad(options) {
			var _this = this;
			this.params.sid = options.sid;
			this.pageFrom = options.pageFrom;
			this.isSync = options.isSync;
			this.waybillDetail = JSON.parse(options.waybillDetail);
			this.params = {
				loadImg: this.waybillDetail.loadImg || "",
				loadPoundImg: this.waybillDetail.loadPoundImg || "",
				sid: this.waybillDetail.sid,
				loadAmount: this.waybillDetail.loadAmount
			}
			this.unParams = {
				unloadImg: this.waybillDetail.unloadImg || "",
				unloadPoundImg: this.waybillDetail.unloadPoundImg || "",
				unloadAmount: this.waybillDetail.unloadAmount || "",
				receiptImg: this.waybillDetail.receiptImg || "",
			}
			//获取某个公司是否需要放开重量判断
			this.getAll(); 
			
		},
		methods: {
			async getAll() {
				try{
					var response = await ship.postRequestGetAll("/appText/getText", "noCheckWeightCoNames");
					console.log("noCheckWeightCoNames", response)
					if (response.retCode == "0000000") {
						this.noCheckWeightCoNames = response.rspBody;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			input(e) {
				console.log(e, 'aaa');
				var val = e.detail.value;
				var text = val.replace(/-/g, "");
				console.log(text)
				this.params.loadAmount = text;
			},
			blur(e) {
				console.log(e);
				var val = e.detail.value;
				if (val == false) {
					console.log(val == true)
					this.params.loadAmount = "";
					this.$forceUpdate();
				} else {
					//获取运单中的托运公司
					var shipperComName = this.waybillDetail.shipperComName;
					var noCheckWeightCoNames = this.noCheckWeightCoNames;
					var regs = /^-?\d+$/
					var regs1 = /^(-?\d+)(\.\d+)?$/
					console.log(noCheckWeightCoNames, shipperComName);
					if (regs.test(val) || regs1.test(val)) {
						if (shipperComName && noCheckWeightCoNames && noCheckWeightCoNames.indexOf(shipperComName) > -1) {
							if (val - 99 > 0) {
							  this.params.loadAmount =  "";
							  uni.showToast({
							  	title: ' 装货重量不可以超过99吨',
								icon: 'none'
							  })
							  this.$forceUpdate();
							}
						} else {
							if (val - 39 > 0) {
							  this.params.loadAmount =  "";
							  uni.showToast({
							  	title: ' 装货重量不可以超过39吨',
								icon: 'none'
							  })
							  this.$forceUpdate();
							}
						}
						
					} else {
					  this.params.loadAmount =  ""
					  this.$forceUpdate();
					}
				}
				
			}, 
			input1(e) {
				console.log(e, 'aaa');
				var val = e.detail.value;
				var text = val.replace(/-/g, "");
				console.log(text)
				this.unParams.unloadAmount = text;
			},
			blur1(e) {
				console.log(e);
				var val = e.detail.value;
				if (val == false) {
					console.log(val == true)
					this.unParams.unloadAmount = "";
					this.$forceUpdate();
				} else {
					//获取运单中的托运公司
					var shipperComName = this.waybillDetail.shipperComName;
					var noCheckWeightCoNames = this.noCheckWeightCoNames;
					var val = e.detail.value;
					var regs = /^-?\d+$/
					var regs1 = /^(-?\d+)(\.\d+)?$/
					
					if (regs.test(val) || regs1.test(val)) {
					  if (shipperComName && noCheckWeightCoNames && noCheckWeightCoNames.indexOf(shipperComName) > -1) {
					  	if (val - 99 > 0) {
					  	  this.unParams.unloadAmount =  "";
					  	  uni.showToast({
					  	  	title: ' 卸货重量不可以超过99吨',
					  		icon: 'none'
					  	  })
					  	  this.$forceUpdate();
					  	}
					  } else {
					  	if (val - 39 > 0) {
					  	  this.unParams.unloadAmount =  "";
					  	  uni.showToast({
					  	  	title: ' 卸货重量不可以超过39吨',
					  		icon: 'none'
					  	  })
					  	  this.$forceUpdate();
					  	}
					  }
					} else {
					  this.unParams.unloadAmount =  ""
					  this.$forceUpdate();
					}
				}
			}, 
			
			upFile(flag) {
				//文件上传
				var that = this;
				uni.chooseImage({
					count: 1, // 默认9  
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						var tempFiles = res.tempFiles;
						var size = tempFiles[0].size;
						if (size - 1024*1024*2 > 0) {
							uni.showToast({
								title:"上传文件过大，请重新上传！",
								icon: 'none'
							})
							return;
						}
						console.log(res, '驾驶证')
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
						var tempFilePaths = res.tempFilePaths
					
						that.uploadIdcard(tempFilePaths[0], flag);
						
						
					},
					fail: function(err) {
						console.log(err, 'asd')
					}
				})
			},
			uploadIdcard(file, flag) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				ship.upLoadFile("/file/upload", file)
				.then(res => {
					console.log(res);
					uni.hideLoading();
					if (res.retCode == "0000000") {
						if (flag == 0) {
							that.params.loadImg = res.rspBody[0].url
						} else if (flag == 1) {
							that.params.loadPoundImg = res.rspBody[0].url
						} else if (flag == 2) {
							that.unParams.unloadImg = res.rspBody[0].url
						} else if (flag == 3) {
							that.unParams.unloadPoundImg = res.rspBody[0].url
						} else {
							that.unParams.receiptImg = res.rspBody[0].url
						}
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err => {
					uni.hideLoading();
				})
			},
			async editLoadPan() {
				var _this = this;
				var params = this.params;
				var unParams = this.unParams;
				var rel = new Object();
				if (this.waybillDetail.status == 2) {
					if (!params.loadImg) {
						uni.showToast({
							title: '请上传装车图片',
							icon: 'none'
						})
						return;
					}
					if (!params.loadPoundImg) {
						uni.showToast({
							title: '请上传装车磅单',
							icon: 'none'
						})
						return;
					}
					if (!params.loadAmount) {
						uni.showToast({
							title: '请输入装车量',
							icon: 'none'
						})
						return;
					}
					rel = params;
				} else {
					if (!params.loadImg) {
						uni.showToast({
							title: '请上传装车图片',
							icon: 'none'
						})
						return;
					}
					if (!params.loadPoundImg) {
						uni.showToast({
							title: '请上传装车磅单',
							icon: 'none'
						})
						return;
					}
					if (!unParams.unloadImg) {
						uni.showToast({
							title: '请上传卸车图片',
							icon: 'none'
						})
						return;
					}
					if (!unParams.unloadPoundImg) {
						uni.showToast({
							title: '请上传卸车磅单',
							icon: 'none'
						})
						return;
					}
					if (!params.loadAmount) {
						uni.showToast({
							title: '请输入装车量',
							icon: 'none'
						})
						return;
					}
					if (!unParams.unloadAmount) {
						uni.showToast({
							title: '请输入卸车量',
							icon: 'none'
						})
						return;
					}
					rel = Object.assign({}, params, unParams);
				}
			
				if (!ship.btnRepeat()) return;
				uni.showLoading();
				console.log(rel, '参数');
				try{
					var res = await ship.postRequest("/yd/task/shipper_edit_task", rel)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							})
						}, 1500)
					}
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom: 100rpx;
	}
	.img-box {
		display: flex;
		flex-direction: row;
		padding: 0 30rpx;
		.imgs {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: #707071;
			font-size: 28rpx;
			justify-content: center;
			align-items: center;
			
			.text {
				padding: 16rpx 0 28rpx;
			}
			&:first-child {
				margin-right: 18rpx;
			}
			.img {
				width: 100%;
				height: 228rpx;
				border: 1px solid #0171F9;
				border-radius: 12rpx;
			}
		}
	}
	.input-whole {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 0 30rpx;
		border-top: 1px solid #F1F1F1;
		padding: 24rpx 0;
		font-size: 32rpx;
		color: #333333;
		font-weight: 500;
		.input {
			flex: 1;
			text-align: right;
		}
		.picker {
			flex: 1;
			.lableBox {
				flex: 1;
				text-align: right;
				font-size: 28rpx;
				color: #333333;
				font-weight: 400;
			}
		}
	}
	.fix-bottom {
		position: fixed;
		bottom: 24rpx;
		left: 70rpx;
		width: calc(100vw - 140rpx);
		height: 84rpx;
		border-radius: 42rpx;
		background-color: #0171F9;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.bg-default {
		width: 100%;
		flex: 1;
		height: 228rpx;
		background-color: #F1F6FF;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 12rpx;
		.bg {
			width: 198rpx;
			height: 172rpx;
			background-image: url(https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/loadBgImg.png);
			background-size: cover;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.btn {
			width: 132rpx;
			height: 68rpx;
			background-color: #0171F9;
			border-radius: 34rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			font-size: 28rpx;
		}
	}
	.dun {
		padding-left: 20rpx;
		font-size: 28rpx;
		color: #707071;
	}
</style>
