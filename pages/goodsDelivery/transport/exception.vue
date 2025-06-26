<template>
	<view class="container-exception">
		<view class="statusBar" :style="{height: statusBarHeight+ 'rpx'}"></view>
		<view class="head" :style="{top: statusBarHeight + 'rpx'}">
			<view class="back-box" :style="{top: statusBarHeight + 'rpx'}" @click="back">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/exp_arrow_left.png" class="back"></image>
			</view>
		</view>
		<view class="top" :class="{active: tabIndex == 1}" :style="{'top': (statusBarHeight + 80) + 'rpx'}">
			<view class="tabItem" :class="{active: tabIndex == 0}" @click="switchIndex(0)">异常上报</view>
			<view class="tabItem" :class="{active: tabIndex == 1}" @click="switchIndex(1)">异常列表</view>
		</view>
		<swiper class="swiper-box" :current="tabIndex" @change="switchChange">
			<swiper-item>
				<view class="box" :style="{'margin-top': (statusBarHeight + 160) + 'rpx'}">
					<view class="subTitle">
						<view class="subTime">
							
							<text class="tiem_text">异常发生时间：</text>
							<view class="datePick">
								<uni-datetime-picker
									type="datetime"
									:border="false"
									:clear-icon="false"
									:placeholder="'请选择'"
									v-model="params.exceptionDate"
									@change="changeExceptionTime"
									style="text-align: right;color: #666666;flex: 1;"
								/>
							</view>
						</view>
					</view>
					<view class="exp_thing">
						<view class="subThing">
							<text class="subThing-text">异常事件：</text>
							<view class="datePick">
								<picker
									mode = "selector"
									:range="typeArr"
									range-key="type"
									:value="exceptionIndex"
								    @change="changeException"
									style="text-align: right;color: #FFFFFF;font-weight: 500;"
								>
									<view class="datePick_content">
										{{exceptionName || "请选择"}}
										<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/arrow_right_white.png" class="arrow_right_white"></image>
									</view>
								</picker>
							</view>
						</view>
										
						<view class="textArea">
							<textarea class="textAreaContent" maxlength="50" placeholder-style="font-size: 28rpx;color: #D7D7D7;" placeholder="备注,最多可输入50字" v-model="params.remake"></textarea>
						</view>
						<view class="add_title">添加图片，最多可添加3张</view>
						<view class="areaBottom" v-if="fileList.length < 1">
							<view class="upFileWhole" @click="upFile">
								<image src="/static/images/goodsDelivery/carame.png" class="carameImg"></image>
							</view>
							
						</view>
						<view class="textAreaFile" v-else>
							
							<view class="imgList">
								<view class="imgItem" v-for="(item, index) in fileList" @click="prevImage(item)">
									<image :src='item.url' class="img" mode="aspectFit"></image>
									<image src="/static/images/ship/closePic.png" @click.stop="delPic(index)" class="closePic"></image>
									
								</view>
								<view class="imgItem" v-if="fileList.length < 3">
									<view class="upFileWhole" @click="upFile">
										<image src="/static/images/goodsDelivery/carame.png" class="carameImg"></image>
									</view>
								</view>
							</view>
						</view>
						<view class="fix-bottom">
							<view class="sendBtn" @click="send()">提交</view>
						</view>
					</view>
					
				</view>
			</swiper-item>
			<swiper-item>
				<scroll-view :refresher-enabled="true" scroll-y :lower-threshold="100" @scrolltolower="scrolltolower" @refresherpulling="onPulling"
            @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort" :refresher-triggered="triggered" class="scroll-box box" :style="{'margin-top': (statusBarHeight + 160) + 'rpx'}">
					<noData v-if="noData == 'noData'"></noData>
					<view v-for="item in exceptionArr" :key="item.sid" class="exItem">
						<view class="subTitle">
							<view class="subTime">
								<text class="tiem_text">异常发生时间：</text>
								<text class="t-r">{{item.exceptionDate}}</text>
							</view>
						</view>
						<view class="exp_thing">
							<view class="subThing">
								<text class="subThing-text">异常事件：</text>
								<view class="datePick">
									<picker
										:disabled="true"
										mode = "selector"
										:range="typeArr"
										range-key="type"
										:value="item.exceptionTypeName"
									    @change="changeException"
										style="text-align: right;color: #FFFFFF;font-weight: 500;"
									>
										<view class="datePick_content">
											{{item.exceptionTypeName}}
										</view>
									</picker>
								</view>
							</view>
							<view class="exp_item">
								<text class="t-l">异常上报时间</text>
								<text class="t-r">{{item.exceptionAppearDate}}</text>
							</view>	
							<view class="exp_item">
								<text class="t-l">上报人</text>
								<text class="t-r">{{showMobile(item.mobile)}}</text>
							</view>			
							<view class="textArea">
								<textarea :disabled="true" class="textAreaContent" maxlength="200" placeholder-style="font-size: 28rpx;color: #D7D7D7;" placeholder="备注,最多可输入50字" v-model="item.remake || '暂无备注'"></textarea>
							</view>
							
							<view class="textAreaFile">
								
								<view class="imgList">
									<view class="imgItem" v-for="(atem, index) in item.images" @click="prevImage(atem)">
										<image :src='atem.img' class="img" mode="aspectFit"></image>
									</view>
								</view>
							</view>
						</view>	
						
					</view>
					<uni-morebox :isMore="noMore" :containerStyle="{'margin-top': '24rpx'}"></uni-morebox>
				</scroll-view>
				
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship.js"
	import noData from "@/components/noData.vue"
	import UniMorebox from "@/components/uni-morebox.vue"
	export default {
		components: {
			noData,
			UniMorebox
		},
		data() {
			return {
				triggered: false,
				exceParams: {
					pageSize: 10,
					pageNum: 1,
				},
				exceptionArr: [],
				fileList: [],
				params: {
					exceptionDate: '',
					exceptionType: '',
					userId: '',
					userCode: '',
					mobile: '',
					ldeId: '',
					batchNumber: '',
					remake: '',
				},
				exceptionName: '',
				typeArr: [],
				exceptionIndex: 0,
				transportObg: null,
				statusBarHeight: 0,
				tabIndex: 0,
				noData: "loading",
				noMore: 'more',
			}
		},
		onLoad(options) {
			this._freshing = false;
			setTimeout(() => {
				this.triggered = true;
			}, 1000)
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight*2;
			var transportObg = options.transportObg;
			this.transportObg = JSON.parse(transportObg);
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				userInfo = JSON.parse(userInfo);
				console.log(userInfo, '哟ing户')
				this.params.userId = userInfo.userId;
				this.params.userCode = userInfo.attrs.userCode;
				this.params.mobile = userInfo.mobile;
				this.params.ldeId = this.transportObg.sid;
				this.params.batchNumber = this.transportObg.batchNumber
				this.exceParams.ldeId = this.transportObg.sid;
			}
			this.getType();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			switchIndex(index) {
				this.tabIndex = index;
			},
			showMobile(mobile) {
				return mobile.substr(0, 3) + '****' + mobile.substr(7, 4)
			},
			switchChange(e) {
				var current =  e.detail.current;
				this.tabIndex = e.detail.current;
				if (current == 1 && this.exceptionArr.length < 1) {
					//获取列表数据
					this.getExceptionArr("refresh");
				} 
			},
			onPulling(e) {
				console.log("onpulling", e);
			},
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				this.noData = "loading";
				this.getExceptionArr("refresh");
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
				console.log("onRestore");
			},
			onAbort() {
				console.log("onAbort");
			},
			scrolltolower(e) {
				if (this.noMore == "noMore" || this.noData == "loading") return;
				this.getExceptionArr("more");
			},
			async getExceptionArr(type) {
				try{
					var exceParams = this.exceParams;
					if (type == "refresh") {
						exceParams.pageNum = 1
					} else {
						exceParams.pageNum ++
					}
					this.exceParams = exceParams;
					var res = await ship.postRequest("/ld/exception/findVo", exceParams)
					console.log(res, '啊')
					this.triggered = false;
					this._freshing = false;
					if (res.retCode == "0000000") {
						
						var total = res.rspBody.total;
						this.noData = total < 1 ? "noData" : 'loaded';
						if (type == "refresh") {
							this.noMore = "more"
							this.exceptionArr = res.rspBody.items;
						} else {
							var exceptionArr = this.exceptionArr;
							this.noMore = res.rspBody.items.length < this.exceParams.pageSize ? 'noMore' : 'more';
							this.exceptionArr = exceptionArr.concat(res.rspBody.items);
						}

					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			async getType() {
				try{
					var res = await ship.postRequest("/ld/exception/getType")
					console.log(res)
					if (res.retCode == "0000000") {
						var typeArr = res.rspBody;
				
						this.typeArr = typeArr
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			changeExceptionTime(e) {
				console.log(e);
				this.params.exceptionDate = e
			},
			changeException(e) {
				console.log(e, '参数')
				var index = e.detail.value;
				var typeArr = this.typeArr;
				this.params.exceptionType = typeArr[index].id;
				this.exceptionName = typeArr[index].type
			},
			
			
			async send() {
				if (!ship.btnRepeat()) return;
				var transportObg = this.transportObg
				var fileList = this.fileList;
				var params = this.params;
				var images = [];
				if (fileList.length > 0) {
					fileList.forEach(item => {
						images.push({
							img: item.url
						})
					})
					params.images = images;
				}
				
				if (!params.exceptionDate) {
					uni.showToast({
						title: '请选择异常发生时间',
						icon: 'none'
					})
					return;
				}
				if (!params.exceptionType) {
					uni.showToast({
						title: '请选择异常事件',
						icon: 'none'
					})
					return;
				}
				
				
				try{
					uni.showLoading({
						title: '上报中...'
					})
					console.log(params, 'aaa')
					var res = await ship.postRequest("/ld/exception/save", params)
					console.log(res, 'asas')
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '上报成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					//TODO handle the exception
				}
				
            },
			jumpToList() {
				uni.navigateBack({
				    delta: 2
				});
			},
			upFile() {
				//上传图片
				var that = this;
				var num = 3 - that.fileList.length;
				uni.chooseImage({
					count: num,
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
				console.log(path);
				var that = this;
				ship.upLoadFile("/file/upload", path)
				.then(result => {
					console.log(result, 'fanhui')
					uni.hideLoading()
					if (result.retCode == '0000000') {
						console.log(result, '阿萨')
						that.fileList.push({
							url: result.rspBody[0].url
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
		}
	}
</script>

<style lang="scss">
	.container-exception {
		background-color: #F1F4F9;
		.container {
			background-color: #F3F3F3;
			min-height: 100vh;
			box-sizing: border-box;
			font-size: 28rpx;
		}
		.swiper-box {
			width: 100vw;
			height: 100vh;
			box-sizing: border-box;
		}
		.datePick {
			flex: 1;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			.datePick_content {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				.arrow_right_white {
					width: 30rpx;
					height: 30rpx;
				}
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
		}
		.statusBar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			background-color: #F1F4F9;
			z-index: 1;
		}
		.head {
			height: 80rpx;
			position: fixed;
			left: 0;
			z-index: 1;
			width: 100vw;
			background-color: #F1F4F9;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
		.scroll-box {
			&.box {
				height: calc(100vh - 240rpx);
			}
		}
		.box {
			border-radius: 12rpx;
			box-sizing: border-box;
			height: 100%;
			background-color: #FFFFFF;
			.exp_thing {
				position: relative;
				width: 100vw;
				flex: 1;
				padding-top: 144rpx;
				box-sizing: border-box;
				.subThing {
					position: absolute;
					top: -62rpx;
					left: 36rpx;
					width: calc(100vw - 72rpx);
					height: 168rpx;
					background-image: url(https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/exp_bg_3.png);
					background-size: 100% 100%;
					border-radius: 24rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 0 40rpx;
					box-sizing: border-box;
					.subThing-text {
						color: #FFFFFF;
						font-size: 40rpx;
						font-weight: 500;
					}
				}
			}
			.subTitle {
				background-color: #F1F4F9;
				color: rgba(119, 119, 119, 1);
				font-size: 28rpx;
				box-sizing: border-box;
				padding: 0 36rpx;
				height: 208rpx;
				.subTime {
					background-color: #FFFFFF;
					padding: 0 40rpx;
					box-sizing: border-box;
					height: 104rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.tiem_text {
						color: #333333;
						font-size: 28rpx;
						font-weight: 500;
					}
					.t-r {
						font-size: 28rpx;
						color: #666666;
						
					}
					
					
				}
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
				box-sizing: border-box;
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
					box-sizing: border-box;
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
					width: 178rpx;
					height: 178rpx;
					border-radius: 8rpx;
					background-color: #FAFAFA;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 20rpx;
					color: rgba(170, 170, 170, 1);
					position: relative;
				}
				.carameImg {
					width: 44rpx;
					height: 42rpx;
				}
			}
			.add_title {
				color: #333333;
				font-size: 28rpx;
				padding: 0 36rpx;
				margin: 74rpx 0 30rpx;
			}
			.textArea {
				margin: 0 36rpx;
				background-color: #FAFAFA;
				border-radius: 24rpx;
				min-height: 234rpx;
				padding: 16rpx 12rpx;
				font-size: 28rpx;
				display: flex;
				flex-direction: row;
				border: 1px solid #E1E1E1;
				.textAreaContent {
					flex: 1;
				}
			}
			.areaBottom {
				height: 178rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;
				.upFileWhole {
					width: 178rpx;
					height: 178rpx;
					border-radius: 8rpx;
					background-color: #FAFAFA;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 20rpx;
					color: rgba(170, 170, 170, 1);
					position: relative;
					margin: 0 36rpx;
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
		.exItem {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
		}
		.back-box {
			position: fixed;
			left: 20rpx;
			width: 80rpx;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.back {
				width: 20rpx;
				height: 38rpx;
			}
		}
		.top {
			position: fixed;
			left: 0;
			width: calc(100vw - 72rpx);
			margin-left: 36rpx;
			height: 78rpx;
			z-index: 99;
			background-image: url(https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/exp_icon_1.png);
			background-size: cover;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			&.active {
				background-image: url(https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/exp_icon_2.png);
			}
			.tabItem {
				flex: 1;
				color: #585858;
				display: flex;
				justify-content: center;
				align-items: center;
				&.active {
					color: #FFFFFF;
				}
				
			}
		}
		.exp_item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 32rpx;
			padding-left: 36rpx;
			padding-right: 36rpx;
			.t-l {
				color: #333333;
				font-size: 32rpx;
				font-weight: 500;
			}
			.t-r {
				font-size: 28rpx;
				color: #666666;
				
			}
		}
		.fix-bottom {
			position: fixed;
			bottom: 100rpx;
			left: 0;
			width: 100vw;
			z-index: 1;
			.sendBtn {
				background-color: #2B72F0;
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 16rpx;
				color: #FFFFFF;
				font-size: 36rpx;
				text-align: center;
				margin: 0 36rpx;
			}
		}
		.img {
			width: 180rpx;
			height: 180rpx;
		}
	}
	
</style>
