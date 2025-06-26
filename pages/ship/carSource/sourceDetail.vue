<template>
	<view class="car-detail">
		<view class="car-title-box" v-if="detail">
			<view class="box-title">
				<view class="addr-box">
					<view class="addr">{{showCity(detail.sender)}}</view>
					<view class="line-box">
						<view class="date">{{showTime(detail.refDt)}}发布</view>
						<image src="/static/images/ship/car-source-line.png" mode="widthFix" class="car-source-line"></image>
						<view class="date">{{showDate(detail.refDt)}}</view>
					</view>
					<view class="addr">{{showCity(detail.receiver)}}</view>
				</view>
				<view class="sub-text" v-if="detail.expectedPrice">
					<text>期望价格</text>
					<view class="price-info">{{detail.expectedPrice}}/{{detail.unit}}</view>
				</view>
			</view>
			<view class="box-info">
				<view class="info-title">
					<view class="main">求{{detail.carModel}}/{{detail.carLength}}米货源</view>
					<view class="sub" v-if="detail.longTimeFlag">长期有效</view>
					<view class="sub" v-else>{{showZhuanghuoTime(detail.indateEnd)}}点前可以装货</view>
				</view>
				<view class="close-btn" @click="closeSource">关闭</view>
			</view>
		</view>
		<view class="car-box-content">
			<noData v-if="carDriverArr.length < 1"></noData>
			<view class="car-box-item" v-for="item in carDriverArr">
				<view class="car-box-row">
					<view class="user-info">
						<image :src="item.imgUrl" class="avatar" v-if="item.imgUrl"></image>
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png" class="avatar" v-else></image>
						<view class="contact-info">
							<text class="name">{{showName(item.name)}}</text>
							<text class="mobile">{{showMobile(item.phone)}}</text>
						</view>
					</view>
					<view class="date-whole">
						<text class="year">{{showYear(item.createdDt)}}</text>
						<text class="date">{{showDate(item.createdDt)}}</text>
						<text class="time">{{showTime(item.createdDt)}}</text>
					</view>
				</view>
				<view class="contact-text">{{showName(item.name)}}，对您的车源有兴趣可直接联系</view>
				<view class="phone" @click="call(item.phone)">
					<image src="/static/images/ship/car-phone.png" mode="widthFix" class="car-phone"></image>
					<view>电话</view>
				</view>
			</view>
			<uni-morebox :isMore="isMore" :containerStyle="{'margin-top': '20rpx'}"></uni-morebox>
		</view>
		<uni-popup type="center" :maskClick="false" ref="closePopup">
			<view class="popup-box">
				<view class="popup-content">确定要关闭车源吗？</view>
				<view class="pop-bottom">
					<view class="pop-cancel pop-bootom-btn" @click="cancel">取消</view>
					<view class="pop-confirm pop-bootom-btn" @click="confirmClose">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/utils"
	import * as ship from "@/utils/ship"
	import UniMorebox from "@/components/uni-morebox.vue"
	import noData from "@/components/noData.vue"
	export default {
		components: {
			UniMorebox,
			noData
		},
		data() {
			return {
				carDriverArr: [],
				detail: {},
				params: {
					nowdataSid: '',
					batchNumber: '',
					userCode: '',
					userId: '',
					personId: '',
					name: '',
					phone: '',
					imgUrl: '',
					pageSize: 10,
					pageNum: 1,
				},
				isMore: 'more',
			}
		},
		onLoad(options) {
			var carSourceNewsSid = options.carSourceNewsSid;
			if (carSourceNewsSid) {
				
				this.init(carSourceNewsSid); //初始化车源信息
				var params = {
					nowdataSid: carSourceNewsSid,
					pageSize: 10,
					pageNum: 1,
				}
				this.params = params;
				//获取聊过的列表
				this.refresh();
			} else {
				var detail = options.detail;
				this.detail = JSON.parse(detail);
				console.log(this.detail, '耍啊啊啊啊')
				var params = {
					nowdataSid: this.detail.sid,
					pageSize: 10,
					pageNum: 1,
				}
				this.params = params;
				//获取聊过的列表
				this.refresh();
			}
			
		},
		onPullDownRefresh() {
			this.refresh();
		},
		onReachBottom() {
			if (this.isMore == "loading" || this.isMore == "noMore") return;
			this.isMore = "loading";
			this.loadMore();
		},
		methods: {
			showName(name) {
				if (!name) return ''
				return name.slice(0, 1) + '先生'
			},
			showMobile(mobile) {
				if (!mobile) return '';
				return mobile.slice(0, 3) + '****' + mobile.slice(-4);
			},
			showYear(date) {
				if (!date) return;
				var dat = date.replace(/-/g, "/");
				var dateTime = new Date(dat);
				var year = dateTime.getFullYear();
				return year
			},
			showDate(date) {
				if (!date) return;
				var dat = date.replace(/-/g, "/");
				var dateTime = new Date(dat);
				var month = dateTime.getMonth() < 9 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1)
				var day = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
				return month + '-' + day
			},
			showTime(date) {
				if (!date) return;
				var dat = date.replace(/-/g, "/");
				var dateTime = new Date(dat);
				var hours = dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()
				var minutes = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
				return hours + ':' + minutes
			},
 			showCity(city) {
				if (!city) return '';
				var subCity = city.replace(/省|市|区/, "");
				return subCity;
			},
			showZhuanghuoTime(date) {
				if (!date) return ''; 
				var newD = date.replace(/-/g, '/');
				var dateParse = new Date(newD);
				var month = (dateParse.getMonth()+1) < 10 ? '0' + (dateParse.getMonth() + 1) : dateParse.getMonth() + 1;
				var day = dateParse.getDate() < 10 ? '0' + dateParse.getDate() : dateParse.getDate();
				var hour = dateParse.getHours() < 10 ? '0' + dateParse.getHours() : dateParse.getHours();
				var minutes = dateParse.getMinutes() < 10 ? '0' + dateParse.getMinutes() : dateParse.getMinutes();
				return month + '-' + day + ' ' + (hour+1)
			},
			closeSource() {
				//关闭车源
				this.$refs.closePopup.open();
			},
			confirmClose() {
				var that = this;
				var willCloseCarSource = this.detail;
				if (!ship.btnRepeat()) return;
				this.cancel();
				uni.showLoading();
				ship.postRequest("/cy/carSource/remove", {
					sid: willCloseCarSource.sid,
					circuitCombo: willCloseCarSource.circuitCombo,
					carCombo: willCloseCarSource.carCombo,
					longTimeFlag: willCloseCarSource.longTimeFlag,
				}).then(res => {
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '关闭成功',
							icon: 'none'
						})
						var pages = getCurrentPages();
						let prevPage = pages[pages.length - 2]; //上一页页面实例 
						prevPage.$vm.refreshCarSourceRef();
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 500)
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log(err)
					uni.hideLoading();
				})
			},
			cancel() {
				this.$refs.closePopup.close();
			},
			async init(sid) {
				try{
					var res = await ship.postRequest("/cy/carSource/show_by_sid", {sid: sid})
					if (res.retCode == "0000000") {
						console.log(res.rspBody, '车源信息');
						this.detail = res.rspBody;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			async refresh() {
				try{
					this.params.pageNum = 1;
					console.log(this.params, 'aaaaa');
					var res = await ship.postRequest("/cy/carSourceInteraction/show", this.params)
					console.log(res, 'aaaa')
					uni.stopPullDownRefresh();
					if (res.retCode == "0000000") {
						var rsp = res.rspBody.items;
						this.carDriverArr = rsp;
						this.isMore = rsp.length > 0 && rsp.length < this.params.pageSize ? 'noMore' : 'more'
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
						this.isMore = "more";
					}
				}catch(e){
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			async loadMore() {
				try{
					this.params.pageNum ++;
					console.log(this.params, 'aaaaa');
					var res = await ship.postRequest("/cy/carSourceInteraction/show", this.params)
					console.log(res, 'aaaa')
					uni.stopPullDownRefresh();
					if (res.retCode == "0000000") {
						var rsp = res.rspBody.items;
						this.carDriverArr = this.carDriverArr.concat(rsp);
						this.isMore = rsp.length < this.params.pageSize ? 'noMore' : 'more';
					} else {
						this.isMore = "more";
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					this.isMore  = "more";
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			call(mobile) {
				if (!mobile) return;
				//打电话后。记录撩过的信息
				let userData = uni.getStorageSync("userInfo");
				console.log('用户信息', JSON.parse(userData)); 
				var userInfo = userData ? JSON.parse(userData) : {};
				let avatarObj = JSON.parse(userData);
				var selfUserCode = userInfo.attrs.userCode;
				if (selfUserCode != this.detail.userCode) {
					var params = {
						nowdataSid: this.detail.sid,
						batchNumber: this.detail.batchNumber,
						userCode: userInfo.attrs.userCode,
						userId: userInfo.userId,
						personId: userInfo.attrs.personId,
						name: userInfo.userName,
						phone: userInfo.mobile,
						imgUrl: avatarObj.attrs.avatar,
					}
					console.log(params, 'aaa')
					//非自己才添加撩人信息
					ship.postRequest("/cy/carSourceInteraction/add", params)
					.then(res => {
						console.log(res)
					})
				}
				
				
				let platformMsg = uni.getSystemInfoSync().platform;
				if(platformMsg == 'android') {
					let that = this;
					plus.android.requestPermissions(
						['android.permission.CALL_PHONE'],
						function(resultObj) {
							var result = 0;
							for(let i = 0; i < resultObj.granted.length; i++) {
								var grantedPermission = resultObj.granted[i];
								console.log('已获取的权限', grantedPermission);
								result = 1;
							}
							for(let i = 0; i < resultObj.deniedPresent.length; i++) {
								var deniedPresentPermission = resultObj.deniedPresent[i];
								console.log('拒绝本次申请的权限', deniedPresentPermission);
								result = 0;
							}
							for(let i = 0; i < resultObj.deniedAlways.length; i++) {
								var deniedAlwaysPermission = resultObj.deniedAlways[i];
								console.log('永久拒绝申请的权限', deniedAlwaysPermission);
								result = -1;
							}
							console.log(result);
							that.toCall(result, mobile);
						}
					)
				}else {
					this.toCall(1, mobile);
				}
			},
			toCall(result, mobile) {
				console.log('触发');
				if(result == 1) {
					uni.makePhoneCall({
					    phoneNumber: mobile,
					});
				}else {
					uni.showToast({
						title: '请开启拨号权限',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.car-detail {
		min-height: 100vh;
		background-color: #F1F4F9;
		.popup-box {
			background-color: #FFFFFF;
			width: 480rpx;
			height: 282rpx;
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			.popup-content {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				color: rgba(51, 51, 51, 1);
				font-size: 28rpx;
				font-weight: 500;
			}
			.pop-bottom {
				display: flex;
				flex-direction: row;
				width: 480rpx;
				height: 90rpx;
				border-top: 1px solid rgba(241, 241, 241, 1);
				.pop-cancel {
					color: rgba(102, 102, 102, 1);
					border-right: 1px solid rgba(241, 241, 241, 1);
				}
				.pop-confirm {
					color: rgba(78, 173, 241, 1);
				}
				.pop-bootom-btn {
					font-size: 28rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex: 1;
				}
			}
		}
		.car-title-box {
			height: 212rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			background-color: #FBFCFD;
			margin: 0 34rpx;
			padding: 0 26rpx;
			border-radius: 24rpx 24rpx 0 0;
			border-bottom: 1px solid #E2E2E2;
			background-image: linear-gradient(to bottom, #FFFFFF, rgba(255,255,255,0));
			.box-title {
				margin-top: 28rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.sub-text {
					position: relative;
					.price-info {
						position: absolute;
						top: 35rpx;
						right: 0;
						color: #D74848;
						font-size: 28rpx;
						display: flex;
						flex-wrap: nowrap;
						white-space: nowrap;
					}
				}
				.addr-box {
					display: flex;
					flex-direction: row;
					align-items: center;
					.addr {
						font-size: 32rpx;
						color: #000000;
						font-weight: 600;
						line-height: 44rpx;
					}
					.line-box {
						margin: 0 16rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						color: #666666;
						font-size: 24rpx;
						.car-source-line {
							width: 114rpx;
						}
					}
				}
			}
			.box-info {
				margin-bottom: 44rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.info-title {
					display: flex;
					flex-direction: row;
					align-items: center;
					.main {
						color: #333333;
						font-size: 28rpx;
						font-weight: 500;
					}
					.sub {
						color: #727272;
						font-size: 24rpx;
						margin-left: 24rpx;
						font-weight: 400;
					}
				}
				.close-btn {
					width: 118rpx;
					height: 43rpx;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #2973FA;
					border: 1px solid #2973FA;
					font-size: 24rpx;
					font-weight: 400;
				}
			}
		}
		.car-box-content {
			display: flex;
			flex-direction: column;
			margin: 0 34rpx;
			.car-box-item {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 26rpx 32rpx 24rpx 34rpx;
				box-sizing: border-box;
				background-color: #FFFFFF;
				margin-top: 20rpx;
				height: 218rpx;
				position: relative;
				border-radius: 24rpx;
				.phone {
					position: absolute;
					right: 32rpx;
					bottom: 54rpx;
					display: flex;
					z-index: 99;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 20rpx;
					color: #666666;
					font-weight: 400;
					line-height: 23rpx;
					.car-phone {
						width: 48rpx;
					}
				}
				.contact-text {
					color: #333333;
					font-size: 28rpx;
					line-height: 44rpx;
					font-weight: 400;
				}
				.car-box-row {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: flex-start;
					.user-info {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						margin-top: 10rpx;
						.avatar {
							width: 90rpx;
							height: 90rpx;
							border-radius: 90rpx;
							margin-right: 18rpx;
						}
						.contact-info {
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: flex-start;
							.name {
								font-size: 36rpx;
								color: #333333;
								font-weight: 500;
								line-height: 44rpx;
							}
							.mobile {
								font-size: 30rpx;
								color: #666666;
								font-weight: 400;
								line-height: 44rpx;
							}
						}
					}
					.date-whole {
						line-height: 44rpx;
						color: #666666;
						font-size: 24rpx;
						.year {
							padding-right: 10rpx;
						}
						.date {
							padding-right: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
