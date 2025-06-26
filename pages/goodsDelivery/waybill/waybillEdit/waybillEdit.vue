<template>
	<view class="waybillEdit">
		<view class="contentBox" v-if="waybillDetails.status == 2 || waybillDetails.status == 3">
		<!-- <view class="contentBox"> -->
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">装车量</view>
					<view class="syb">*</view>
				</view>
				<view class="rightContent">
					<input class="priceInput" type="digit" placeholder-style="font-size:28rpx;color:#AAA" maxlength="9" placeholder="请输入" v-model="loadAmount"  @input="changeHopePrice" @blur="blur"/>
					<view class="priceSyb">吨</view>
				</view>
			</view>
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">起运时间</view>
					<view class="syb">*</view>
				</view>
				<view style="flex: 1;">
					<uni-datetime-picker
					    type="datetime"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择'"
					    v-model="senderDt"
					    @change="changeLog"
						style="text-align: right;"
					/>
				</view>
			</view>
		</view>
		<view class="contentBox" v-if="waybillDetails.status == 3">
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">卸车量</view>
					<view class="syb">*</view>
				</view>
				<view class="rightContent">
					<input class="priceInput" type="digit" placeholder-style="font-size:28rpx;color:#AAA" maxlength="9" placeholder="请输入" v-model="unloadAmount"  @input="changeUnloadAmount" @blur="blur1"/>
					<view class="priceSyb">吨</view>
				</view>
			</view>
			<view class="contentRow flexRow">
				<view class="leftTitle">
					<view class="msg">到达时间</view>
					<view class="syb">*</view>
				</view>
				<view style="flex: 1;">
					<uni-datetime-picker
					    type="datetime"
						:border="false"
						:clear-icon="false"
						:placeholder="'请选择'"
					    v-model="receiverDt"
					    @change="changeReceiverLog"
						style="text-align: right;"
					/>
				</view>
			</view>
		</view>
		
		<!-- 图片上传 -->
		<view class="mainUpLoadBox" v-if="waybillDetails.status == 2 || waybillDetails.status == 3">
			<view class="mainBox">
				<text class="mainTitle">装车图片</text>
				<view class="pictureBox">
					<view class="imageUpLoadBox" v-if="loadImg">
						<image class="isUploadImg" :src="loadImg"></image>
						<view class="imageBtnGroup">
							<image class="btn" @click="toDeleteImage(1)" src="../../../../static/images/goodsDelivery/editWaybillDelete.png"></image>
							<image class="btn" @click="showBigImage(1)" src="../../../../static/images/goodsDelivery/editWaybillDetail.png"></image>
						</view>
					</view>
					<view class="imageUpLoadBox" v-if="!loadImg" @click="upFile(1)">
						<view class="upLoadBox">
							<image class="upLoadImg" src="../../../../static/images/goodsDelivery/box07.png"></image>
							<view class="upLoadHint">添加图片</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mainBox">
				<text class="mainTitle">装车磅单</text>
				<view class="pictureBox">
					<view class="imageUpLoadBox" v-if="loadPoundImg">
						<image class="isUploadImg" :src="loadPoundImg"></image>
						<view class="imageBtnGroup">
							<image class="btn" @click="toDeleteImage(2)" src="../../../../static/images/goodsDelivery/editWaybillDelete.png"></image>
							<image class="btn" @click="showBigImage(2)" src="../../../../static/images/goodsDelivery/editWaybillDetail.png"></image>
						</view>
					</view>
					<view class="imageUpLoadBox" v-if="!loadPoundImg" @click="upFile(2)">
						<view class="upLoadBox">
							<image class="upLoadImg" src="../../../../static/images/goodsDelivery/box07.png"></image>
							<view class="upLoadHint">添加图片</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mainUpLoadBox" v-if="waybillDetails.status == 3">
			<view class="mainBox" >
				<text class="mainTitle">卸车图片</text>
				<view class="pictureBox">
					<view class="imageUpLoadBox" v-if="unloadImg">
						<image class="isUploadImg" :src="unloadImg"></image>
						<view class="imageBtnGroup">
							<image class="btn" @click="toDeleteImage(3)" src="../../../../static/images/goodsDelivery/editWaybillDelete.png"></image>
							<image class="btn" @click="showBigImage(3)" src="../../../../static/images/goodsDelivery/editWaybillDetail.png"></image>
						</view>
					</view>
					<view class="imageUpLoadBox" v-if="!unloadImg" @click="upFile(3)">
						<view class="upLoadBox">
							<image class="upLoadImg" src="../../../../static/images/goodsDelivery/box07.png"></image>
							<view class="upLoadHint">添加图片</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mainBox" >
				<text class="mainTitle">卸车磅单</text>
				<view class="pictureBox">
					<view class="imageUpLoadBox" v-if="unloadPoundImg">
						<image class="isUploadImg" :src="unloadPoundImg"></image>
						<view class="imageBtnGroup">
							<image class="btn" @click="toDeleteImage(4)" src="../../../../static/images/goodsDelivery/editWaybillDelete.png"></image>
							<image class="btn" @click="showBigImage(4)" src="../../../../static/images/goodsDelivery/editWaybillDetail.png"></image>
						</view>
					</view>
					<view class="imageUpLoadBox" v-if="!unloadPoundImg" @click="upFile(4)">
						<view class="upLoadBox">
							<image class="upLoadImg" src="../../../../static/images/goodsDelivery/box07.png"></image>
							<view class="upLoadHint">添加图片</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="mainUpLoadBox" v-if="waybillDetails.status == 3">
			<view class="mainBox" >
				<text class="mainTitle">卸车回单</text>
				<view class="pictureBox">
					<view class="imageUpLoadBox" v-if="receiptImg">
						<image class="isUploadImg" :src="receiptImg"></image>
						<view class="imageBtnGroup">
							<image class="btn" @click="toDeleteImage(5)" src="../../../../static/images/goodsDelivery/editWaybillDelete.png"></image>
							<image class="btn" @click="showBigImage(5)" src="../../../../static/images/goodsDelivery/editWaybillDetail.png"></image>
						</view>
					</view>
					<view class="imageUpLoadBox" v-if="!receiptImg" @click="upFile(5)">
						<view class="upLoadBox">
							<image class="upLoadImg" src="../../../../static/images/goodsDelivery/box07.png"></image>
							<view class="upLoadHint">添加图片</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mainBox" ></view>
		</view>
		
		<view class="cancelBtn"  @click="cancelOrder"  v-if="waybillDetails.isSync == 1 && (waybillDetails.status == 2 || waybillDetails.status == 3)">
			取消运单
		<image class="goodsDetailsBtnIcon" src="../../../../static/images/goodsDelivery/icon_right.png"></image>
		</view>
		
		<view class="footBtnGroup" v-if="waybillDetails.status == 2 || waybillDetails.status == 3">
			<view class="saveBtn" @click="saveWaybillDetail()">确认信息</view>
		</view>
		
		<image class="noDataIcon" v-if="waybillDetails.status != 2 && waybillDetails.status != 3" src="../../../../static/images/goodsDelivery/noDataIcon.png"></image>
		<view class="noEditMsg" v-if="waybillDetails.status != 2 && waybillDetails.status != 3">暂无可修改信息</view>
		
		
		<uni-popup ref="cancelPopup" type="center">
			<view class="hintBox">
				<view class="title">确定取消运单吗？</view>
				<view class="confirmBtnGroup">
					<view class="cancelBtn" @tap="closeConfirmPopup()">再看看</view>
					<view class="groupLine"></view>
					<view class="confirmBtn" @tap="calcelOrder()">确认取消</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				noCheckWeightCoNames: '',
				waybillDetails: '',
				senderDt: '',
				loadAmount: '',
				loadImg: '',
				loadPoundImg: '',
				receiverDt: '',
				unloadAmount: '',
				unloadImg: '',
				unloadPoundImg: '',
				receiptImg: '',
			};
		},
		onLoad(options) {
			let userInfo = uni.getStorageSync("userInfo");
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			console.log('用户信息', this.userInfo);
			var detailsInfo = JSON.parse(options.detailsInfo);
			this.waybillDetails = detailsInfo;
			if(this.waybillDetails.status == 2 || this.waybillDetails.status == 3) {
				this.senderDt = this.waybillDetails.senderDt ? this.waybillDetails.senderDt : '';
				this.loadAmount = this.waybillDetails.loadAmount ? this.waybillDetails.loadAmount : '';
				this.loadImg = this.waybillDetails.loadImg ? this.waybillDetails.loadImg : '';
				this.loadPoundImg = this.waybillDetails.loadPoundImg ? this.waybillDetails.loadPoundImg : '';
				this.receiverDt = this.waybillDetails.receiverDt ? this.waybillDetails.receiverDt : '';
				this.unloadAmount = this.waybillDetails.unloadAmount ? this.waybillDetails.unloadAmount : '';
				this.unloadImg = this.waybillDetails.unloadImg ? this.waybillDetails.unloadImg : '';
				this.unloadPoundImg = this.waybillDetails.unloadPoundImg ? this.waybillDetails.unloadPoundImg : '';
				this.receiptImg = this.waybillDetails.receiptImg ? this.waybillDetails.receiptImg : '';
				console.log('运单信息', this.waybillDetails)
			}
			//获取某个公司是否需要放开重量判断
			this.getAll(); 
			
		},
		onReady() {
			console.log("修改121")
		},
		computed: {
		},
		methods: {
			async getAll() {
				try{
					var response = await utils.postRequestGetAll("/appText/getText", "noCheckWeightCoNames");
					console.log("noCheckWeightCoNames", response)
					if (response.retCode == "0000000") {
						this.noCheckWeightCoNames = response.rspBody;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			blur(e) {
				console.log(e);
				var val = e.detail.value;
				if (val == false) {
					console.log(val == true)
					this.loadAmount = "";
					this.$forceUpdate();
				} else {
					//获取运单中的托运公司
					var shipperComName = this.waybillDetails.shipperComName;
					var noCheckWeightCoNames = this.noCheckWeightCoNames;
					var regs = /^-?\d+$/
					var regs1 = /^(-?\d+)(\.\d+)?$/
					console.log(noCheckWeightCoNames, shipperComName);
					if (regs.test(val) || regs1.test(val)) {
						if (shipperComName && noCheckWeightCoNames && noCheckWeightCoNames.indexOf(shipperComName) > -1) {
							if (val - 99 > 0) {
							  this.loadAmount =  "";
							  uni.showToast({
							  	title: ' 装货重量不可以超过99吨',
								icon: 'none'
							  })
							  this.$forceUpdate();
							}
						} else {
							if (val - 39 > 0) {
							  this.loadAmount =  "";
							  uni.showToast({
							  	title: ' 装货重量不可以超过39吨',
								icon: 'none'
							  })
							  this.$forceUpdate();
							}
						}
						
					} else {
					  this.loadAmount =  ""
					  this.$forceUpdate();
					}
				}
				
			},
			blur1(e) {
				console.log(e);
				var val = e.detail.value;
				if (val == false) {
					console.log(val == true)
					this.unloadAmount = "";
					this.$forceUpdate();
				} else {
					//获取运单中的托运公司
					var shipperComName = this.waybillDetails.shipperComName;
					var noCheckWeightCoNames = this.noCheckWeightCoNames;
					var val = e.detail.value;
					var regs = /^-?\d+$/
					var regs1 = /^(-?\d+)(\.\d+)?$/
					
					if (regs.test(val) || regs1.test(val)) {
					  if (shipperComName && noCheckWeightCoNames && noCheckWeightCoNames.indexOf(shipperComName) > -1) {
					  	if (val - 99 > 0) {
					  	  this.unloadAmount =  "";
					  	  uni.showToast({
					  	  	title: ' 卸货重量不可以超过99吨',
					  		icon: 'none'
					  	  })
					  	  this.$forceUpdate();
					  	}
					  } else {
					  	if (val - 39 > 0) {
					  	  this.unloadAmount =  "";
					  	  uni.showToast({
					  	  	title: ' 卸货重量不可以超过39吨',
					  		icon: 'none'
					  	  })
					  	  this.$forceUpdate();
					  	}
					  }
					} else {
					  this.unloadAmount =  ""
					  this.$forceUpdate();
					}
				}
			}, 
			upFile(flag) { // 上传物品图片
				// uni.showLoading({
				// 	title: '请稍候...',
				// })
				var that = this;
				uni.chooseImage({
					count: 1, // 默认9  
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						console.log('选择的图片', res);
						console.log('选择的图片大小', res.tempFiles['0'].size);
						if(res.tempFiles['0'].size > (1048576 * 10)) { // 图片大于10mb则无法上传
							uni.showToast({
							    title: '上传的图片不能大于10MB',
								icon: 'none',
							    duration: 2000
							});
							return false;
						}
						var tempFilePaths = res.tempFilePaths;
						that.uploadFrontImage(tempFilePaths[0], flag);
					}
				})
			},
			uploadFrontImage(path, flag) {
				var that = this;
				utils.upLoadFile("/file/upload", path)
				.then(result => {
					console.log('上传结果', result);
					uni.hideLoading()
					if (result.retCode == '0000000') {
						switch(flag) {
							case 1:
								that.loadImg = result.rspBody[0].url;
								break;
							case 2:
								that.loadPoundImg = result.rspBody[0].url;
								break;
							case 3:
								that.unloadImg = result.rspBody[0].url;
								break;
							case 4:
								that.unloadPoundImg = result.rspBody[0].url;
								break;
							case 5:
								that.receiptImg = result.rspBody[0].url;
								break;
						}
					} else {
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '上传失败，请重试',
						icon: 'none'
					})
				})
			},
			saveWaybillDetail() { // 保存修改的信息
				if(!this.loadAmount) {
					uni.showToast({
						title: '请选择装车量',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.senderDt) {
					uni.showToast({
						title: '请选择起运时间',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				// if(!this.loadImg) {
				// 	uni.showToast({
				// 		title: '请选择装车图片',
				// 		icon: 'none',
				// 		duration: 3000
				// 	})
				// 	return false;
				// }
				if(!this.loadPoundImg) {
					uni.showToast({
						title: '请选择装车磅单',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.waybillDetails.status == 3) {
					if(!this.unloadAmount) {
						uni.showToast({
							title: '请选择卸车量',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
					if(!this.receiverDt) {
						uni.showToast({
							title: '请选择到达时间',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
					// if(!this.unloadImg) {
					// 	uni.showToast({
					// 		title: '请选择卸车图片',
					// 		icon: 'none',
					// 		duration: 3000
					// 	})
					// 	return false;
					// }
					if(!this.unloadPoundImg) {
						uni.showToast({
							title: '请选择卸车磅单',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
				}
				let creatDate = this.waybillDetails.createdDt.replace(/-/g, '/');
				creatDate = Date.parse(new Date(creatDate));
				let senderDate = this.senderDt.replace(/-/g, '/');
				senderDate = Date.parse(new Date(senderDate));
				if(creatDate > senderDate || creatDate == senderDate) {
					uni.showToast({
						title: '起运时间不得小于建单时间',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(this.waybillDetails.status == 3) {
					let receiverDate = this.receiverDt.replace(/-/g, '/');
					receiverDate = new Date(receiverDate);
					console.log('到达时间', receiverDate);
					if(senderDate > receiverDate || senderDate == receiverDate) {
						uni.showToast({
							title: '到达时间不得小于起运时间',
							icon: 'none',
							duration: 3000
						})
						return false;
					}
				}
				uni.showLoading({
					title: '请稍候...',
				})
				let params = {
					"sid": this.waybillDetails.sid,
					"loadAmount": this.loadAmount,
					"loadImg": this.loadImg,
					"loadPoundImg": this.loadPoundImg,
					"senderDt": this.senderDt,
					"receiverDt": this.waybillDetails.status == 3 ? this.receiverDt : undefined,
					"unloadAmount": this.waybillDetails.status == 3 ? this.unloadAmount : undefined,
					"unloadImg": this.waybillDetails.status == 3 && this.unloadImg ? this.unloadImg : undefined,
					"unloadPoundImg": this.waybillDetails.status == 3 && this.unloadPoundImg ? this.unloadPoundImg : undefined,
					"receiptImg": this.waybillDetails.status == 3 && this.receiptImg ? this.receiptImg : "",
				};
				console.log('修改参数', params);
				var that = this;
				utils.postRequest("/yd/task/shipper_edit_task", params)
				.then(res => {
					console.log('修改结果', res);
					uni.hideLoading()
					if(res.retCode == '0000000') {
						uni.showToast({
							title: '修改成功！',
							icon: 'success',
							duration: 3000
						})
						uni.$emit("refreshWaybillDetails", {
							"loadAmount": this.loadAmount,
							"loadImg": this.loadImg,
							"loadPoundImg": this.loadPoundImg,
							"senderDt": this.senderDt,
							"receiverDt": this.waybillDetails.status == 3 ? this.receiverDt : undefined,
							"unloadAmount": this.waybillDetails.status == 3 ? this.unloadAmount : undefined,
							"unloadImg": this.waybillDetails.status == 3 && this.unloadImg ? this.unloadImg : undefined,
							"unloadPoundImg": this.waybillDetails.status == 3 && this.unloadPoundImg ? this.unloadPoundImg : undefined,
						});
						setTimeout(() => {
							uni.$emit("refreshData_waybill");
							uni.navigateBack();
						}, 2000);
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err);
				})
			},
			
			//取消运单
			cancelOrder(){
				this.$refs.cancelPopup.open()
			},
			closeConfirmPopup() {
				this.$refs.cancelPopup.close()
			},
			
			calcelOrder() {
				uni.showLoading({
					title: '请稍候...',
				})
				let that = this;
					console.log('taskSId', that.waybillDetails.sid);
				utils.postRequest('/yd/task/shipperCancelYdTask?taskSId=' + that.waybillDetails.sid, {})
				.then(res=>{
					console.log('取消运单成功', res);
					uni.hideLoading();
					if(res.retCode == "0000000") {
						this.$refs.cancelPopup.close()
						uni.showToast({
							title: '取消运单成功！',
							icon: 'none'
						})
						that.waybillDetails.status = 0;
						that.waybillDetails.statusDesc = '已取消';
						uni.$emit("refreshData_waybill");
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			
			changeLog(e) {
			    this.senderDt = e;
			    console.log("选择的起运时间:", e);
			},
			changeReceiverLog(e) {
				this.receiverDt = e;
				console.log("选择的到达时间:", e);
			},
			toDeleteImage(flag) { // 删除图片
				switch(flag) {
					case 1:
						this.loadImg = '';
						break;
					case 2:
						this.loadPoundImg = '';
						break;
					case 3:
						this.unloadImg = '';
						break;
					case 4:
						this.unloadPoundImg = '';
						break;
					case 5:
					this.receiptImg = "";
				}
			},
			showBigImage(flag) { // 查看大图
				let ary = [];
				switch(flag) {
					case 1:
						ary.push(this.loadImg);
						break;
					case 2:
						ary.push(this.loadPoundImg);
						break;
					case 3:
						ary.push(this.unloadImg);
						break;
					case 4:
						ary.push(this.unloadPoundImg);
						break;
					case 5:
						ary.push(this.receiptImg);
						break;
				}
				uni.previewImage({
				    urls: ary,
				});
			},
			changeHopePrice(e) { // 固定价格输入限制
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 6){
						let num  = Number(e.detail.value.length) - 6;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 2;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.loadAmount = e.detail.value
				})
			},
			changeUnloadAmount() {
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 6){
						let num  = Number(e.detail.value.length) - 6;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 2;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.unloadAmount = e.detail.value
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F1F2F3;
	}
	.waybillEdit {
		padding-bottom:168rpx;
		.noDataIcon {
			display: block;
			width: 244rpx;
			height: 246rpx;
			margin:200rpx auto 20rpx auto;
		}
		.noEditMsg {
			font-size: 32rpx;
			color:#333;
			text-align: center;
		}
		.mainUpLoadBox {
			display: flex;
			padding:32rpx 32rpx 0 32rpx;
			margin:16rpx 16rpx 0 16rpx;
			background: #FFF;
			border-radius: 12rpx;
		}
		.mainBox {
			flex: 0 0 50%;
			&.mainBoxArriver {
				flex: 0 0 33%;
			}
			.mainTitle {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			.pictureBox {
				padding: 32rpx 0;
				display: flex;
				align-items: center;
				.imageUpLoadBox + .imageUpLoadBox {
					margin-left: 16rpx;
				}
				.imageUpLoadBox {
					width:210rpx;
					height: 240rpx;
					border-radius: 12rpx;
					overflow: hidden;
					box-sizing: border-box;
					border: 2rpx solid #979797;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					.isUploadImg {
						width:210rpx;
						height: 240rpx;
					}
					.upLoadBox {
						.upLoadImg {
							width:46rpx;
							height: 46rpx;
							display: block;
							margin:0 auto 16rpx auto;
						}
						.upLoadHint {
							font-size: 22rpx;
							color: #AAAAAA;
						}
					}
					.imageBtnGroup {
						width:210rpx;
						height: 240rpx;
						position: absolute;
						background-color: rgba(0, 0, 0, 0.4);
						display: flex;
						align-items: center;
						justify-content: center;
						.btn + .btn {
							margin-left: 48rpx;
						}
						.btn {
							width: 36rpx;
							height: 36rpx;;
						}
					}
				}
			}
		}
		.footBtnGroup {
			padding: 24rpx 60rpx;
			width:630rpx;
			background-color: #FFF;
			position: fixed;
			bottom: 0;
			box-shadow: 0px -2rpx 8rpx 0px rgba(0,0,0,0.1);
			border-radius: 24rpx 24rpx 0px 0px;
			.saveBtn {
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
		
		.cancelBtn {
			margin-top: 20rpx;
			margin-right: 10rpx;
			text-align: right;
			color: #AAAAAA;
			
			.goodsDetailsBtnIcon {
				width: 22rpx;
				height: 22rpx;
				margin-left:6rpx;
			}
		}
		
		.contentBox {
			margin: 16rpx 16rpx 0 16rpx;
			padding: 0 42rpx 0 42rpx;
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
				.uni-icons {
					display: none !important;
				}
				.uni-date-x {
					padding: 0 !important;
				}
				.uni-date__x-input {
					height: 56rpx !important;
					line-height: 56rpx !important;
					padding: 0 !important;
					font-size: 28rpx !important;
				}
				.input-placeholder {
					font-size: 28rpx !important;
					color: #707071 !important;
				}
				.rightContent {
					display: flex;
					align-items: center;
					.rightSelect + .rightSelect {
						margin-left: 20rpx;
					}
					.checkTime {
						height: 56rpx;
						line-height: 56rpx;
						margin-left: 24rpx;
						font-size: 28rpx;
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
		}
		
		
		.hintBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			.title {
				width:560rpx;
				font-size: 32rpx;
				color: #777777;
				text-align: center;
				padding: 40rpx 0 34rpx 0;
				line-height: 44rpx;
			}
			.confirmBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top:2rpx solid #F3F3F3;
				.cancelBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #777777;
					text-align: center;
				}
				.groupLine {
					width: 2rpx;
					height: 94rpx;
					background-color: #F3F3F3;
				}
				.confirmBtn {
					flex: 1;
					height: 94rpx;
					line-height: 94rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #4AA2F3;
					text-align: center;
				}
			}
		}
		
	}
</style>
