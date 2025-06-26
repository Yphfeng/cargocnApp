<template>
	<view class="mapCarSourceList" :class="{noScroll: isCollapse}">
		<view class="header-box">
			<view class="statusBar" :style="{height: statusBarHeight + 'rpx'}" />
			<view class="header">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_left_arrow.png" class="car_source_left_arrow" @click="back"></image>
				<text>{{pageSource == "driver" ? '车辆定位列表' : '车源列表'}}</text>
			</view>
			
		</view>
		<view class="headerSendebox" :style="{height: (statusBarHeight + 88) + 'rpx'}" />
		<view class="selected-content">
			<view class="selected-title" :style="{top: (statusBarHeight + 88) + 'rpx'}">
				<view class="selected-item" :class="{active: isCollapse}" @click="showPop()">
					<text class="selected-title-text" v-if="pageSource == 'driver' ">{{params.locationName ? params.cityName : '请选择'}}</text>
					<text class="selected-title-text" v-else>{{params.locationCode ? params.cityName : '请选择'}}</text>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/icon_down.png" class="icon_down" v-if="!isCollapse"></image>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/icon_down_active.png" class="icon_down" v-else></image>
				</view>
			</view>
			<view style="height: 100rpx;" />
			<view class="selected-pop" :style="{top: (statusBarHeight + 188) + 'rpx'}" :class="{active: isCollapse}" @touchmove.prevent @click.stop="closePop">
				<view class="pop-content">
					<view class="pop-title">
						<view class="pop-title-item">省份</view>
						<view class="pop-title-item">城市</view>
					</view>
					<view class="pop-inner">
						<scroll-view class="province-item" :scroll-y="true">
							<view v-for="(item, index) in provinceArr" class="item-pop pl-34" @click.stop="switchProIndex(index)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" class="check" v-if="index == selectedProvinceIndex"></image>
								<text :class="{proActive: index == selectedProvinceIndex}">{{item.name}}</text>
							</view>
						</scroll-view>
						
						<scroll-view class="province-item" :scroll-y="true">
							<view v-for="(item, index) in cityArr" class="item-pop" @click.stop="switchCityIndex(index)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" class="check" v-if="index == selectedCityIndex"></image>
								<text :class="{proActive: index == selectedCityIndex}" v-if="index == 0" >{{item.proName}}</text>
								<text :class="{proActive: index == selectedCityIndex}" v-else >{{item.name}}</text>
							</view>
						</scroll-view>
					</view>
					<view class="pop-btn">
						<view class="pop-btn-item reset" @click.stop="reset">重置</view>
						<view class="pop-btn-item look" @click.stop="look">查看</view>
					</view>
				</view>
				
			</view>
		</view>
		<view class="list">
			<view class="noData01" v-if="carSourceList.length == 0 && isNoData != 'loading'">
				<noData></noData>
			</view>
			<view class="list-item" v-for="(item, index) in carSourceList">
				<view class="avatar-content">
					<view class="avatar" v-if="item.driverImage">
						<image :src="item.driverImage" class="avatar-icon"></image>
						<!-- <view class="dot">签约</view> -->
					</view>
					<view class="avatar" v-else>
						<image src="/static/images/goodsDelivery/shipUserLogo.png" class="avatar-icon"></image>
						<!-- <view class="dot">签约</view> -->
					</view>
					<view class="avatar-title">
						<!-- <view class="dot"/> -->
						<!-- <text>可接单</text> -->
					</view>
				</view>
				<view class="item-content">
					<view class="row">
						<view>
							<text class="name">{{showName(item)}}</text>
							<!-- <text class="nameType">（管理员）</text> -->
							<text class="lenAndType" v-if="item.carLength">{{showTypeAndLen(item)}}</text>
						</view>
						<view />
					</view>
					<view class="row mt-20" v-if="showAddrList(item)">
						<view>
							<text class="addr">{{showAddrList(item)}}</text>
						</view>
					</view>
					<view class="row row-start" v-if="beidouList.length > 0 && beidouList[index]">
						<view class="location-icon">
							<view class="icon_content">
								<image src="/static/images/ship/beidou_icon.png" class="beidou_icon" v-if="beidouList[index].isBeiDou == 4 && showAddr(index)"></image>
								<image src="/static/images/ship/beidou_no_icon.png" class="beidou_no_icon" v-if="beidouList[index].isBeiDou == 2 && showAddr(index)"></image>
							</view>
							<text class="addr-text">{{showAddr(index)}}</text>
						</view>
						<view class="time">{{showDate(index)}}</view>
					</view>
				<!-- 	<view class="row">
						<view class="btn-content">
							<view class="btn-item">绿通</view>
							<view class="btn-item">华中</view>
							<view class="btn-item">短途</view>
						</view>
					</view> -->
				</view>
			</view>
			<uni-morebox :isMore="isMore" :containerStyle="{'margin-top': '24rpx'}"></uni-morebox>
		</view>
		
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	import UniMorebox from "@/components/uni-morebox.vue";
	import noData from "@/components/noData.vue";
	import * as utilDate from "@/utils/utils.js"
	export default {
		components: {
			UniMorebox,
			noData
		},
		data() {
			return {
				chooseArr: [{
					name: '城市',
					value: '',
				}],
				provinceArr: [],
				cityArr: [],
				statusArr: ["已签约", "未签约"],
				carSourceList: [],
				isCollapse: false,
				selectedProvinceIndex: -1,
				selectedCityIndex: -1,
				statusIndex: -1,
				params: {
					"source": 1,
				},
				defaultParams: {
					pageSize: 10,
					sender: '',
					senderCode: '',
					selectedCityIndex: -1,
					selectedProvinceIndex: -1,
				},
				isNoData: 'loading',
				isMore: 'more',
				refreshing: false,
				beidouList: [],
				dataTotal: [],
				pageSource: '',
				statusBarHeight: 0,
				userIds: [],
				driverTotalList: [],
				
			}
		},
		onLoad(options) {
			//加载默认的起始地
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight*2
			console.log("携带的参数",options);
			if (options.sender) {
				var pageSource = options.pageSource;
				this.pageSource = pageSource;
				if (pageSource == "driver") {
					this.params.userIds = JSON.parse(options.userIds);
					this.defaultParams.userIds = JSON.parse(options.userIds);
				} else {
					this.params.sender = options.sender;
					this.params.senderCode = options.senderCode;
					this.params.pageSize = 10;
					this.params.pageNum = 1;
				}
				this.defaultParams = {
					sender: options.sender,
					senderCode: options.senderCode,
					provinceName: options.provinceName,
					provinceCode: options.provinceCode,
					...this.defaultParams,
				}
				var chooseArr =  this.chooseArr;
				chooseArr[0].value = options.sender;
				this.chooseArr = chooseArr;
				this.getProvince();
				uni.showLoading();
				this.getData('refresh');
			}
		},
		onPullDownRefresh() {
			if (this.isNoData == "loading") return;
			this.isNoData = 'loading';
			this.getData('refresh');
		},
		onReachBottom() {
			if(this.isMore == "loading" || this.isMore == "noMore") return;
			this.isMore = "loading";
			if (this.pageSource == "driver") {
				this.fetchMoreDriverData();
				return;
			}
			this.getData("more");
			
		},
		methods: {
			fetchMoreDriverData() {
				var driverTotalList = this.driverTotalList;
				var carSourceList = this.carSourceList;
				var driverList = driverTotalList.splice(0, 10);
				this.carSourceList = carSourceList.concat(driverList);
				this.isMore = driverList.length < 10 ? 'noMore' : 'more';
				this.driverTotalList = driverTotalList;
				if (driverList.length > 0) {
					var addrAddress = [];
					driverList.forEach(atem => {
						addrAddress.push(atem.userId)
					})
					this.getBeidouAddr("more", addrAddress);
				}
				console.log("加载更多", driverList.length, this.params.pageSize);
				this.$forceUpdate();
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			showName(item) {
				var driverName = item.driverName;
				var driverPhone = item.driverPhone;
				if(driverName) {
					return driverName.substr(0, 1) + '师傅';
				} else {
					return driverPhone.substr(0, 3) + '****' + driverPhone.substr(-4)
				}
			},
			reset() {
				this.selectedProvinceIndex = -1;
				this.selectedProvinceIndex = -1;
				this.getProvince();
				this.params.provinceName = "";
				this.params.cityName = "";
				this.params.locationName != undefined && delete this.params.locationName;
				this.params.locationCode != undefined && delete this.params.locationCode;
				this.params.source = 1;
				if (this.pageSource == "driver") {
					this.params.userIds = this.defaultParams.userIds;
				}
			},
			showAddrList(item) {
				var sender = item.sender;
				var receiver = item.receiver;
				if (!sender || !receiver) return '';
				sender = sender.replace(/省|市/, "");
				receiver = receiver.replace(/省|市/, "");
				return sender + '-' + receiver
			},
			showTypeAndLen(item) {
				var carLength = item.carLength;
				var carModel = item.carModel;
				return carLength + '米' + carModel
			},
			getNextData() {
				var carSourceListTotal = this.carSourceListTotal;
				var carSourceList = carSourceListTotal.splice(0, 10);
				
				var len = carSourceList.length;
				if (len < 1) {
					this.isMore = 'noMore';
					return;
				}
				this.carSourceListTotal = carSourceListTotal;
				this.carSourceList = this.carSourceList.concat(carSourceList);
				this.isNoData = false;
				this.isMore = len < this.params.pageSize ? 'noMore' : 'more'
				var addrAddress = [];
				carSourceList.forEach(atem => {
					addrAddress.push(atem.userId)
				})
				console.log(len, 'aas');
				
				this.getBeidouAddr("more", addrAddress);
			},
			async getData(type) {
				if (type == 'refresh') {
					this.params.pageNum = 1
				} else {
					this.params.pageNum ++
				}
				var url = ""
				if (this.pageSource == "driver") {
					url = '/olnanas/recommend/getCarSourceByUserId'
				} else {
					url = "/olnanas/recommend/getCarSourceBySender"
				}
				try{
					console.log(this.params, 'asas');
					var res = await ship.newQueryPostRequest(url, this.params)
					uni.stopPullDownRefresh();
					uni.hideLoading();
					console.log(res, '车源列表数据')
					if (res.retCode == "0000000") {
						var carSourceVOS = res.rspBody.carSourceVOS;
						var len = carSourceVOS.length;
						if (type == "refresh") {
							
							if (carSourceVOS.length < 1) {
								this.isNoData = true;
								this.isMore = "more";
								this.carSourceList = [];
								return;
							}
							
							
							if (this.pageSource != "driver") {
								this.carSourceList = carSourceVOS;
								
								this.isNoData = false;
								this.isMore = len < this.params.pageSize ? 'noMore' : 'more';
								
								var addrAddress = [];
								this.carSourceList.forEach(atem => {
									addrAddress.push(atem.userId)
								})
								this.getBeidouAddr("refresh", addrAddress);
								
							} else {
								this.driverTotalList = carSourceVOS;
								var carSourceList = carSourceVOS.splice(0, 10);
								this.carSourceList = carSourceList;
								this.isNoData = false;
								this.isMore = carSourceList.length < this.params.pageSize ? 'noMore' : 'more';
								var addrAddress = [];
								carSourceList.forEach(atem => {
									addrAddress.push(atem.userId)
								})
								this.getBeidouAddr("refresh", addrAddress);
								
							}
						
							
							
							
						} else {
								this.isNoData = false;
								this.isMore = len < this.params.pageSize ? 'noMore' : 'more'
								this.carSourceList = this.carSourceList.concat(carSourceVOS);
								if (carSourceVOS.length > 0) {
									var addrAddress = [];
									carSourceVOS.forEach(atem => {
										addrAddress.push(atem.userId)
									})
									this.getBeidouAddr("more", addrAddress);
								}
						}
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					this.isNoData = true;
					uni.hideLoading();
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			look() {
				var selectedProvinceIndex = this.selectedProvinceIndex;
				var selectedCityIndex = this.selectedCityIndex;
				if (selectedProvinceIndex < 0 && selectedCityIndex > -1) {
					uni.showToast({
						title: '请选择省',
						icon: 'none'
					})
					return;
				};
				if (selectedCityIndex < 0 && selectedProvinceIndex > -1) {
					uni.showToast({
						title: '请选择市',
						icon: 'none'
					})
					return;
				};
				this.isCollapse = false;
				var cityArr = this.cityArr;
				if (selectedCityIndex > -1) {
					this.params.cityName = cityArr[selectedCityIndex].name;
					this.params.cityCode = cityArr[selectedCityIndex].code;
					if (this.pageSource == "driver") {
						this.params.source = 3;
						this.params.locationName = cityArr[selectedCityIndex].name;
						this.params.userIds != undefined && delete this.params.userIds;
					} else {
						this.params.locationCode = cityArr[selectedCityIndex].code;
					}
					
				}
				uni.showLoading();
				this.getData("refresh");
			},
			async getProvince() {
				var provinceLocal = uni.getStorageSync("provinceLocal");
				if (!provinceLocal) {
					var res = await ship.postRequest("/ts/nationDict/getBasicData");
					var provinceArr = res.rspBody;
					this.provinceArr = provinceArr;
					var cities = provinceArr[0].cities;
					var name = provinceArr[0].name;
					if (name == "上海市" || name == "天津市" || name == "重庆市" || name == "北京市") {
						cities.unshift({
							name: provinceArr[0].name,
							proName: "全市",
							code: provinceArr[0].code,
						})
					} else {
						cities.unshift({
							name: provinceArr[0].name,
							proName: "全省",
							code: provinceArr[0].code,
						})
					}
					this.cityArr = cities;	
					uni.setStorageSync("provinceLocal", JSON.stringify(provinceArr));
					return;
				}
				var provinceName = this.defaultParams.provinceName;
				var provinceCode = this.defaultParams.provinceCode;
				var senderCode = this.defaultParams.senderCode;
				var provinceArr = JSON.parse(provinceLocal);
				this.provinceArr = provinceArr;
				
				
				this.selectedProvinceIndex = -1;
				var cities = provinceArr[0].cities;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
					cities.unshift({
						name: provinceArr[0].name,
						proName: "全市",
						code: provinceArr[0].code,
					})
				} else {
					cities.unshift({
						name: provinceArr[0].name,
						proName: "全省",
						code: provinceArr[0].code,
					})
				}
				this.cityArr = cities;
				this.defaultParams.selectedProvinceIndex = -1;
				this.defaultParams.selectedCityIndex = -1;
				this.selectedCityIndex = -1;
			},
			
			showPop() {
				var isCollapse = this.isCollapse;
				
				this.isCollapse = !isCollapse;
				
				
			},
			hidePop() {
				this.isCollapse = false
			},
			noPop() {
				return false
			},
			switchProIndex(index) {
				if (index == this.selectedProvinceIndex) return;
				this.selectedProvinceIndex = index;
				this.selectedCityIndex = -1;
				//切换城市
				var provinceArr = this.provinceArr;
				var provinceName = provinceArr[index].name;
				var provinceCode = provinceArr[index].code;
				var cities = provinceArr[index].cities;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
					var coties = [{
						name: provinceName,
						proName: "全市",
						code: provinceCode,
					}, ...cities]
				} else {
					var coties = [{
						name: provinceName,
						proName: "全省",
						code: provinceCode,
					}, ...cities]
				}
				
				
				this.cityArr = coties;
			},
			switchCityIndex(index) {
				this.selectedCityIndex = index
			},
			closePop() {
				this.isCollapse = 0;
			},
			switchStatus(index) {
				this.statusIndex = index;
			},
			async getBeidouAddr(type, params) {
				var that = this;
				try{
					console.log(params, 'asas');
					var res = ship.newQueryPostRequest("/olnanas/recommend/beidouPositioning", {
						userIds: params
					}).then(res => {
						console.log(res, '北斗定位')
						if (res.retCode == "0000000") {
							if (type == "refresh") {
								that.beidouList = res.rspBody;
							} else {
								var beidouList = that.beidouList;
								that.beidouList = beidouList.concat(res.rspBody)
							}
							
						} else {
							that.beidouList = [];
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
				}catch(e){
					//TODO handle the exception
				}
			},
			showAddr(index) {
				var beidouList = this.beidouList;
				if (beidouList.length < 1) return '';
				if (!beidouList[index]) return '';
				var address = beidouList[index].address;
				if (address) {
					var reg = /.+?(县|区)/g
					var addr = address.match(reg);
					if (addr) {
						return addr[0]
					} else {
						return address
					}
				} else {
					return address
				}
			},
			showDate(index) {
				var beidouList = this.beidouList;
				if (!beidouList) return;
				if (!beidouList[index]) return '';
				var locationDate = beidouList[index].locationDate;
				if (!locationDate) return '';
				return utilDate.findBeidouDateDesc(locationDate)
				// if (beidouList[index].isBeiDou == 1) {
				// 	//判断北斗定位时间和app定位时间哪个最新
				// 	return ''
				// } else {
				// 	// return utilDate.findFleetDateDesc(date);
				// 	return ''
				// }
				
				
			},
		}
	}
</script>

<style scoped lang="scss">
	.mapCarSourceList {
		min-height: 100vh;
		background-color: #FAFAFA;
		display: flex;
		flex-direction: column;
		width: 100vw;
		padding: 0 34rpx;
		box-sizing: border-box;
		overflow: hidden;
		&.noScroll {
			overflow: hidden;
		}
		.header-box {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			z-index: 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #FFFFFF;
			.header {
				width: 100vw;
				height: 88rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				color: rgba(51, 51, 51, 1);
				.car_source_left_arrow {
					position: absolute;
					left: 38rpx;
					top: 30rpx;
					width: 16rpx;
					height: 30rpx;
				}
			}
		}
		.mt-20 {
			margin-top: 20rpx;
		}
		.selected-content {
			.selected-title {
				background-color: #FAFAFA;
				width: 100%;
				position: fixed;
				left: 0;
				z-index: 1;
				padding-left: 34rpx;
				height: 100rpx;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				box-sizing: border-box;
				.selected-item {
					display: flex;
					flex-direction: row;
					align-items: center;
					color: #333333;
					&.active {
						color: rgba(52, 137, 233, 1);
					}
					.icon_down {
						width: 24rpx;
						height: 12rpx;
						margin-left: 12rpx;
					}
					.selected-title-text {
						font-size: 36rpx;
						font-weight: 500;
					}
				}
			}
			.selected-pop {
				position: fixed;
				left: 0;
				width: 100vw;
				height: 0;
				opacity: 0;
				overflow: hidden;
				background-color: rgba(84, 84, 84, 0.71);
				z-index: 2;
				&.active {
					opacity: 1;
					height: calc(100vh - 100rpx);
				}
				.pop-content {
					background-color: #FFFFFF;
					display: flex;
					flex-direction: column;
					align-items: center;
					.status-item {
						height: 80rpx;
						color: #rgba(51, 51, 51, 1);
						font-size: 28rpx;
						width: 100vw;
						padding-left: 34rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						&.active {
							color: rgba(43, 114, 240, 1);
							font-weight: 500;
						}
					}
					.pop-title {
						width: 100vw;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						height: 108rpx;
						border-top: 1rpx solid rgba(234, 234, 234, 1);
						border-bottom: 1rpx solid rgba(234, 234, 234, 1);
						color: rgba(51, 51, 51, 1);
						font-size: 32rpx;
						font-weight: 500;
						.pop-title-item {
							width: 50vw;
							&:first-child {
								padding-left: 34rpx;
								box-sizing: border-box;
							}
						}
					}
					.pop-item {
						height: 50vh;
					}
					.pop-inner {
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						height: 50vh;
						width: 100vw;
						.item-pop {
							height: 80rpx;
							color: rgba(51, 51, 51, 1);
							font-size: 28rpx;
							box-sizing: border-box;
							display: flex;
							flex-direction: row;
							align-items: center;
							.check {
								width: 30rpx;
								height: 22rpx;
								margin-right: 10rpx;
							}
							.proActive {
								color: rgba(43, 114, 240, 1);
								font-weight: 500;
							}
							
						}
						.province-item {
							flex: 1;
							display: flex;
							flex-direction: column;
							align-items: center;
							height: 50vh;
							.pl-34 {
								padding-left: 34rpx;
								box-sizing: border-box;
							}
						}
					}
					.pop-btn {
						height: 78rpx;
						width: 666rpx;
						display: flex;
						flex-direction: row;
						background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_pop_bg.png");
						background-size: cover;
						background-repeat: no-repeat;
						background-position: 100%;
						border-radius: 25rpx;
						margin-bottom: 66rpx;
						.pop-btn-item {
							width: 50vw;
							height: 78rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							font-weight: 500;
							&.reset {
								color: rgba(43, 114, 240, 1);
							}
							&.look {
								color: #ffffff;
								
							}
						}
					}
				}
			}
			
		}
		.list {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			
			.list-item {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				background-color: #FFFFFF;
				width: calc(100vw - 68rpx);
				margin-bottom: 20rpx;
				box-shadow: 0 0 18rpx 2rpx rgba(106, 106, 106, 0.09);
				border-radius: 12rpx;
				.avatar-content {
					width: 148rpx;
					padding-top: 30rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					align-items: center;
					.avatar {
						width: 80rpx;
						height: 80rpx;
						position: relative;
						.avatar-icon {
							width: 80rpx;
							height: 80rpx;
							border-radius: 80rpx;
							background-color: #CCCCCC;
						}
						.dot {
							width: 60rpx;
							height: 20rpx;
							border-radius: 70rpx;
							background-image: linear-gradient(to bottom, #51A2FE, #1081F9);
							position: absolute;
							left: 10rpx;
							bottom:  0;
							z-index: 1;
							font-size: 16rpx;
							color: #FFFFFF;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
					.avatar-title {
						display: flex;
						flex-direction: row;
						color: #4ACD1B;
						font-size: 28rpx;
						margin-top: 10rpx;
						justify-content: center;
						align-items: center;
						&.active {
							color: #E2633B;
						}
						.dot {
							width: 14rpx;
							height: 14rpx;
							background-color: #4ACD1B;
							border-radius: 14rpx;
							margin-right: 6rpx;
							&.active {
								background-color: #E2633B;
							}
						}
					}
					
				}
				.item-content {
					width: calc(100vw - 68rpx - 148rpx);
					display: flex;
					flex-direction: column;
					padding-top: 16rpx;
					padding-bottom: 24rpx;
					box-sizing: border-box;
					.row {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						&.row-start {
							justify-content: flex-start;
							align-items: flex-start;
							margin-top: 18rpx;
						}
						&.mt-16 {
							margin-top: 16rpx;
						}
						.name {
							font-size: 28rpx;
							color: rgba(51, 51, 51, 1);
							font-weight: 600;
						}
						.nameType {
							color: rgba(102, 102, 102, 1);
							font-size: 24rpx;
							margin-left: 10rpx;
						}
						.lenAndType {
							color: rgba(51, 51, 51, 1);
							font-size: 32rpx;
							line-height: 38rpx;
							margin-left: 22rpx;
						}
						.addr {
							color: rgba(52, 137, 233, 1);
							font-size: 32rpx;
							line-height: 38rpx;
							font-weight: 500;
						}
						.location-icon {
							flex: 1;
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: flex-start;
							color: rgba(51, 51, 51, 1);
							font-size: 32rpx;
							.icon_content {
								display: flex;
								justify-content: flex-start;
								align-items: center;
								line-height: 38rpx;
								margin-right: 8rpx;
								height: 38rpx;
								width: 32rpx;
							}
							.beidou_icon {
								width: 20rpx;
								height: 20rpx;
							}
							.beidou_no_icon {
								width: 32rpx;
								height: 32rpx;
							}
							.addr-text {
								flex: 1;
								color: rgba(51, 51, 51, 1);
								font-size: 32rpx;
								line-height: 38rpx;
							}
						}
						.time {
							color: rgba(102, 102, 102, 1);
							font-size: 28rpx;
							margin-left: 18rpx;
							padding-top: 5rpx;
							margin-right: 28rpx;
						}
						.btn-content {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							margin-top: 18rpx;
							.btn-item {
								padding: 5rpx 10rpx;
								color: rgba(82, 131, 255, 1);
								border: 1px solid rgba(82, 131, 255, 1);
								border-radius: 8rpx;
								font-size: 24rpx;
								margin-right: 20rpx;
							}
						}
						
					}
					
				}
			}
		}
	}
</style>
