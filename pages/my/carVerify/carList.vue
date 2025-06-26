<template>
	<view class="container" >
		<!-- <view class="sendBox" />
		<view class="title">
			<view class="plateNo">车牌号</view>
			<view class="isVerify">是否认证</view>
			<view class="item">车型车长</view>
			<view class="opt" />
		</view> -->
		<view class="noData" v-if="noData" :style="{height: windowHeight + 'rpx'}">
			暂无数据
		</view> 
		<scroll v-else :triggered="triggered" :top-size="topSize" :bottom-size="bottomSize" @refresh="refresh"
			@restore="restore" @more="more" >
			<view v-for="(item, index) in carList" v-if="carList.length > 0" style="margin-bottom: 22rpx;">
			<!-- @touchmove="(val) =>touchMove(val,index)"  @touchstart="(val) => touchStart(val,index)"  @touchend="(val) => touchEnd(val,index)" -->
				<view class="carList_item" @click="carInfoClick(item)">
					<!-- <view class="left_icon">
						<image class="image" src="../../../static/images/ship/vehicle_icon.png"></image>
					</view> -->
					<view class="vehicle_content">
						<view class="infor_box">
							<view class="carInfo_box">
								<view class="carId">{{item.plateNo}}</view> 
								<view class="carLength">{{item.ext1}}/{{item.vehicleLength}}米</view>
							</view>
							<view class="authentication_box">
								<image :src="item.status ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newCarVerify/auditT.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/auditF.png'" class="image"></image>
								<text class="text" style="font-size: 24rpx;">{{item.status ? '已认证' : '未认证'}}</text>
								<!-- <image class="delete_icon" data-index="{{index}}" data-item="{{item}}" bindtap="showPopUp" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/ship/close2.png"></image> -->
							</view>
						</view>
						<view class="line"></view>
						<view class="infor">
							<view class="SetDefault" :class="item.isDefault == 1 ? 'selected' : 'no_selected'" @click.stop="setDefault(item)">
								<image class="image" v-if="item.isDefault == 1" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/ship/selected.png"></image>
								<image class="image" v-else src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/ship/no_selected1.png"></image>
								<view class="text" >设为默认运输车辆</view>
							</view>
							<view class="SetDefault remove_bind" @click.stop="showPopUp(item, index)" >
								<image class="image"  src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/ship/bind_icon.png"></image>
								<view class="text white_color">解除绑定</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll>
		<view class="carAddView">
			<button @click="carAddClick">添加车辆</button>
		</view>
		<uni-popup ref="confirmPopup" type="center">
			<view class="popupConfirmBox">
				<view class="content">确认解除绑定？</view>
				<view class="btnGroup">
					<view class="btn cancel" @click="closeConfirmPopup()">取消</view>
					<view class="btn confirm" @click="confirmUnBind">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		postRequest
	} from "../../../utils/service.js"
	import * as ship from "@/utils/ship";
	import scroll from "@/components/scroll1/scroll1.vue";
	var commonHtmlTitle = '车辆列表';
	import {
		mapActions
	} from 'vuex'
	export default {
		components: {
			scroll
		},
		data() {
			return {

				windowHeight: 0,
				bottomSize: '200rpx',
				topSize: '40rpx',
				noData: false,
				carList: [],
				triggered: true,
				_freshing: false,
				params: {
					pageSize: 20,
					pageNum: 1,
				},
				total: 0,

				leftStyle: 0,
				delBtnWidth: 220,
				isIndex: -1,
				clientX: 0,

				startX: 0,
				startY: 0,
			}
		},
		onShow() {
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			console.log(windowHeight, 'gaod1')
			this.windowHeight = (windowHeight - 100) * 2
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) return;
			var userRole = uni.getStorageSync("userRole");
			if (userRole == 1) {
				this.params.driverId = JSON.parse(userInfo).attrs.driverId
			} else {
				this.params.driverId = JSON.parse(userInfo).attrs.driverId
			}
			this.getCarList('refresh');
		},
		onUnload(){
			console.log('返回返回')
			uni.switchTab({
				url: '../index/index'
			})
		},
		methods: {
			...mapActions(['getSettingsInfo', "getVehicleSettingsInfo", "getRouterSettingsInfo"]),

			showPopUp(item, index) {
				console.log(this.isIndex,'isIndex')
				//解除绑定
				this.willUnbindItem = item;
				this.willUnbindIndex = index;
				this.$refs.confirmPopup.open();
			},
			closeConfirmPopup() {
				this.isIndex = -1,
				this.$refs.confirmPopup.close();
			},
			confirmUnBind() {
				//确认解除绑定
				this.closeConfirmPopup();
				if (!ship.btnRepeat()) return;
				uni.showLoading();
				var willUnbindItem = this.willUnbindItem;
				var driverId = this.params.driverId
				ship.postRequest("/yh/vehicle/remove/bidding", {
					"driverId": driverId,
					"id": willUnbindItem.id,
					"plateNo": willUnbindItem.plateNo
				}).then(res => {
					console.log(res, '解除111')
					if (res.rspBody == 1) {
						uni.hideLoading();
						uni.showToast({
							title: '解绑成功',
							icon: 'none'
						})
						var carList = this.carList;
						var willUnbindIndex = this.willUnbindIndex;
						carList.splice(willUnbindIndex, 1);
						this.carList = carList;
						this.getVehicleSettingsInfo(); //刷新首页的展示
					}
				})

			},
			showCarInfo(item) {
				var str = ""
				if (item.ext1) {
					str += item.ext1
				}
				if (item.vehicleLength) {
					str += '/' + item.vehicleLength
				}
				return str
			},
			restore() {
				console.log('asd')
				this.triggered = 'restore';
			},
			refresh() {
				console.log('下拉刷新', this._freshing)
				if (this._freshing) return;
				this._freshing = true;
				this.$forceUpdate();
				this.params.pageNum = 1;
				this.getCarList('refresh');
			},
			more() {
				if (this.total == this.carList.length) {
					this.noMore = true;
					return;
				}
				// console.log('上拉加载');
				this.params.pageNum = this.params.pageNum + 1;
				this.getCarList('more');
			},
			//这里是车辆
			getCarList: function(flag) {
				var that = this;
				that.isIndex = -1;
				console.log(that.params, '参数')
				ship.postRequest("/yh/vehicle/select/list/by/driver", that.params).then(function(res) {
					console.log(res, '车辆列表');
					that.triggered = false;
					that._freshing = false;
					that.noData = res.rspBody.total < 1 ? true : false;
					that.total = res.rspBody.total;
					if (res.retCode == '0000000') {
						if (flag == "refresh") {
							that.carList = res.rspBody.items;
							console.log(that.carList)
							that.noMore = false;
						} else {
							that.carList = that.carList.concat(res.rspBody.items);
							that.noMore = res.rspBody.items.length < that.params.pageSize ? true : false;
						}

					} else {
						that.noData = true
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					that.triggered = false;
					that._freshing = false;

					console.log(err, 'asa')
				})
			},
			carInfoClick: function(item) {
				console.log(item, 'asa')
				//  uni.navigateTo({
				// url: '/pages/my/carVerify/carDetailNew?carInfo=' + JSON.stringify(item),
				//  })
				uni.navigateTo({
					url: './newCarVerify?carInfo=' + JSON.stringify(item)
				})
			},
			carAddClick: function() {
				let that = this
				let isHaveDefault = 0
				that.carList.some(item => {
					if(item.isDefault){
						isHaveDefault = 1
						return true
					}
				})
				// uni.navigateTo({
				//   url: './index',
				// })
				console.log(isHaveDefault)
				uni.navigateTo({
					url: './newCarVerify?isHaveDefault=' + isHaveDefault +'&carType=' + 'add'
				})
			},

			// // 开始移动时
			// touchStart(val, index) {
			// 	console.log(val, index, 'touchStart')
			// 	// this.isIndex = index;
			// 	this.startX = val.touches[0].clientX;
			// 	this.startY = val.touches[0].clientY;
			// },

			// touchMove(val, index) {
			// 	console.log(val, index)
			// 		if (val.touches[0].clientX > 100) {
			// 			this.isIndex = index;
			// 		}
			// },

			// //结束移动
			// touchEnd(val, index) {
			// 	const {
			// 		leftStyle
			// 	} = this;
			// 	const {
			// 		delBtnWidth
			// 	} = this;
			// 	console.log(val, index,'touchEnd')
			// 	let deltaX = val.changedTouches[0].clientX - this.startX;
			// 	let deltaY = val.changedTouches[0].clientY - this.startY;
			// 	console.log(deltaX,deltaY)
				
			// 	if (Math.abs(deltaX) > Math.abs(deltaY)) {
			// 		if (deltaX <  -10) {
			// 			console.log("左滑")
			// 			this.isIndex = index;
			// 		} else if(deltaX > 10) {
			// 			console.log("右滑")
			// 			this.isIndex = -1;
			// 		}
			// 	} else {
			// 		console.log("上下方向滑动")
			// 		this.isIndex = -1;
			// 	}

			// 	// 如果停止滑动的距离大于二分之一则直接弹出删除按钮，不然则left为0
			// 	if (-leftStyle > delBtnWidth / 2) {
			// 		this.leftStyle = -delBtnWidth;
			// 	} else {
			// 		this.leftStyle = 0;
			// 	}
			// },

			setDefault(val) {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '是否要设置为默认车辆?',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: '是的', // 确认按钮文字  
					success: function(res) {
						if (res.confirm) {
							that.defaultVehicle(val)
						} else {

						}
					}
				})
			},

			defaultVehicle(val) {
				var that = this;
				var userInfo = uni.getStorageSync("userInfo");
				var infor = JSON.parse(userInfo);
				console.log(infor, 'inforinfor')
				let data = {
					driverId: infor.attrs.driverId,
					plateNo: val.plateNo,
					ext1: val.ext1,
					vehicleLength: val.vehicleLength,
					isDefault: 1,
					personId: infor.attrs.personId,
					userCode: infor.attrs.userCode,
					userId: infor.userId,
					userPhone: infor.mobile,
				}
				console.log(data, 'data')
				ship.postRequest('/yh/vehicle/save/bind/simple', data).then(res => {
					console.log(res, 'res')
					if (res.retCode == '0000000') {
						that.getCarList('refresh');
						uni.showToast({
							title: '设置成功',
							icon: 'none'
						})

					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log(err, 'err')
					uni.showToast({
						title: err.retDesc,
						icon: 'none'
					})
				})
			},

		}
	}
</script>

<style lang="scss" >
	body{
		background: #FAFAFA;
	}
	.sendBox {
		height: 20rpx;
		background-color: #F1F4F9;
	}

	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 32rpx;
		line-height: 44px;
		font-weight: 500;
		color: #333333;
		padding: 28rpx 26rpx 34rpx 0;
		margin-left: 36rpx;

		// background-color: red;
		.plateNo {
			width: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.isVerify {
			width: 150rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.opt {
			width: 116rpx;
			height: 44rpx;
			line-height: 44rpx;
			font-size: 20rpx;
			text-align: center;
		}
	}

	.carList_item {
		width: calc(100vw - 72rpx);
		height       : 256rpx;
		background   : #FFFFFF;
		// background   : pink;
		box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(106,106,106,0.09);
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		margin       : 0 auto;
		display      : flex;
		position     : relative;

		.remove {
			position   : absolute;
			top        : 0;
			right      : -300rpx;
			opacity    : 1;
			z-index    : 0;
			width      : 204rpx;
			height     : 202rpx;
			line-height: 202rpx;
			font-size  : 40rpx;
			text-align : center;
			color      : #FFFFFF;
			background : #F35944;
		}

		.remove2 {
			position     : absolute;
			top          : 0;
			right        : 0;
			opacity      : 1;
			z-index      : 3;
			width        : 204rpx;
			height       : 202rpx;
			line-height  : 202rpx;
			font-size    : 40rpx;
			text-align   : center;
			color        : #FFFFFF;
			background   : #F35944;
			transition   : all 1s;
			border-radius: 0 24rpx 24rpx 0;
		}

		.logo_bgc {
			width   : 138rpx;
			height  : 78rpx;
			position: absolute;
			top     : 90rpx;
			right   : 108rpx;
			bottom  : 34rpx;
		}


		.left_icon {
			display    : flex;
			align-items: center;

			.image {
			height: 74rpx;
			width : 74rpx;
			}
		}

		.vehicle_content {
			// color     : #FFFFFF;
			padding   : 8rpx 24rpx 0  28rpx;
			box-sizing: border-box;
			width     : 100%;



			.infor_box {
				display        : flex;
				align-items    : center;
				// justify-content: flex-start;
				justify-content: space-between;
				width          : 100%;
				// padding-right  : 28rpx;
				margin-bottom: 34rpx;
				margin-top: 36rpx;


				.authentication_box {
					// margin-left: auto;
					display    : flex;
					align-items: center;

					.image {
					width : 28rpx;
					height: 28rpx;
					}

					.text {
					font-size    : 32rpx;
					font-weight  : 500;
					// color        : #FFFFFF;
					padding-left : 12rpx;
					}

				}

				.delete_icon {
					width : 48rpx;
					height: 48rpx;
				}
				.carInfo_box{
					display: flex;
					align-items: center;
					.carId{
					font-size: 36rpx;
					font-weight: bold;
					}
					.carLength{
					font-size: 28rpx;
					margin-left: 16rpx;
					}
				}
			}
		

			.infor {
				display        : flex;
				align-items    : center;
				justify-content: space-between;
				width          : 100%;
				margin-top     : 16rpx;
				// padding-right  : 24rpx;

				.SetDefault {
					height: 60rpx;
					display    : flex;
					align-items: center;
					justify-content: center;
					font-size: 32rpx;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					border: 2rpx solid #5585F4;
					// margin-bottom: 35rpx;
					margin-top: 15rpx;

				}

				.image {
					height: 30rpx;
					width : 30rpx;

				}

				.text {
					// font-size   : 28rpx;
					font-weight : 400;
					// color       : #FFFFFF;
					padding-left: 6rpx;
				}

				.edit {
					height     : 48rpx;
					width      : 48rpx;
					// position: absolute;
					// top: 136rpx;
					// right: 24rpx;
					// bottom: 32rpx;
					// z-index: 3;
				}

			}


			.line{
				width: 630rpx;
				height: 0rpx;
				border-top: 1rpx solid #E0E0E0;
				}
				.remove_bind{
				width: 218rpx;
				background: #5585F4;
				color: #FFFFFF;
				}
				.selected{
				width: 332rpx;
				color: #FFFFFF;
				background: #5585F4;
				}
				.no_selected{
				width: 332rpx;
				color: #5585F4;
				background-color: #FFFFFF;
			}

		}

	}

	.carListItem {
		margin-left: 36rpx;
		padding: 24rpx 26rpx 24rpx 0;
		background: white;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		font-size: 28rpx;
		border-bottom: 1rpx solid #E7E7E7;
		color: #666666;
		line-height: 44rpx;

		&:last-child {
			border-bottom: 'none'
		}

		.carNoView1 {
			width: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.carNoView2 {
			width: 150rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.carNoView3 {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.opt {
			width: 116rpx;
			height: 44rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 20rpx;
			background-color: #E6E6E6;
			border-radius: 224rpx;
			color: #666666;
		}
	}

	.carAddView {
		height: 200rpx;
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
		// background: #F1F4F9;
		background: #FAFAFA;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.carAddView button {
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: #2B72F0;
		border: none;
		width: 400rpx;
		height: 80rpx;
		border-radius: 16rpx;
		color: white;
		font-size: 32rpx;
		font-weight: 500;
	}

	.noData {
		justify-content: center;
		align-items: center;
		display: flex;
	}

	.popupConfirmBox {
		width: 480rpx;
		background-color: #FFF;
		border-radius: 24rpx;

		.content {
			padding: 82rpx 0 70rpx 0;
			height: 40rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			text-align: center;
		}

		.btnGroup {
			display: flex;
			border-top: 2rpx solid #F1F1F1;

			.btn+.btn {
				border-left: 2rpx solid #F1F1F1;
			}

			.btn {
				flex: 0 0 50%;
				padding: 22rpx 0 28rpx 0;
				font-size: 28rpx;
				line-height: 33rpx;
				text-align: center;

				&.cancel {
					color: #666666;
				}

				&.confirm {
					color: #4EADF1;
				}
			}
		}
	}
</style>
