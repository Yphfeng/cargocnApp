<template>
	<view class="mapCarSourceList" :class="{noScroll: isCollapse}">
		<view class="selected-content">
			<view class="selected-title">
				<view class="selected-item" v-for="(item, index) in chooseArr" :class="{active: item.active}" @click="showPop(index)">
					<text class="selected-title-text">{{item.value}}</text>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/icon_down.png" class="icon_down" v-if="!item.active"></image>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/icon_down_active.png" class="icon_down" v-else></image>
				</view>
			</view>
			<view class="selected-pop" :class="{active: isCollapse}" @touchmove.prevent @click.stop="closePop">
				<view class="pop-content" v-show="isActive == 0">
					<view class="pop-title">
						<view class="pop-title-item">省份</view>
						<view class="pop-title-item">城市</view>
					</view>
					<view class="pop-inner">
						<scroll-view class="province-item" :scroll-y="true">
							<view v-for="(item, index) in provinceArr" class="item-pop pl-34" @click.stop="switchProIndex(index)">
								<image src="" class="check" v-if="index == selectedProvinceIndex"></image>
								<text :class="{proActive: index == selectedProvinceIndex}">{{item.name}}</text>
							</view>
						</scroll-view>
						
						<scroll-view class="province-item" :scroll-y="true">
							<view v-for="(item, index) in cityArr" class="item-pop" @click.stop="switchCityIndex(index)">
								<text :class="{proActive: index == selectedCityIndex}">{{item.name}}</text>
							</view>
						</scroll-view>
					</view>
					<view class="pop-btn">
						<view class="pop-btn-item reset">重置</view>
						<view class="pop-btn-item look" @click="look">查看</view>
					</view>
				</view>
				<view class="pop-content" v-show="isActive == 1" @click.stop="hidePop()">
					<view class="status-item" :class="{active: index == statusIndex}" v-for="(item, index) in statusArr" @click.stop="switchStatus(index)">{{item}}</view>
					
				</view>
			</view>
		</view>
		<view class="list">
			<view class="noData01" v-if="carSourceList.length == 0 && isNoData != 'loading'">
				<noData></noData>
			</view>
			<view class="list-item" v-for="item in carSourceList">
				<view class="avatar-content">
					<view class="avatar">
						<image src="" class="avatar-icon"></image>
						<view class="dot">签约</view>
					</view>
					<view class="avatar-title">
						<view class="dot"/>
						<text>可接单</text>
					</view>
				</view>
				<view class="item-content">
					<view class="row">
						<view>
							<text class="name">{{item.driverName}}</text>
							<text class="nameType">（管理员）</text>
							<text class="lenAndType">{{showTypeAndLen(item)}}</text>
						</view>
						<view />
					</view>
					<view class="row mt-16">
						<view>
							<text class="route">常跑</text>
							<text class="addr">上海-北京等</text>
						</view>
					</view>
					<view class="row row-start">
						<view class="location-icon">
							<image src="/static/images/ship/beidou_icon.png" class="beidou_icon"></image>
							<!-- <image src="/static/images/ship/beidou_no_icon.png" class="beidou_no_icon"></image> -->
							<text>江苏省南通市****</text>
						</view>
						<view class="time">15分钟前</view>
					</view>
					<view class="row">
						<view class="btn-content">
							<view class="btn-item">绿通</view>
							<view class="btn-item">华中</view>
							<view class="btn-item">短途</view>
						</view>
					</view>
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
				},{
					name: '状态',
					value: '状态',
				}],
				provinceArr: [],
				cityArr: [],
				statusArr: ["已签约", "未签约"],
				carSourceList: [],
				isCollapse: false,
				isActive: 0,
				selectedProvinceIndex: -1,
				selectedCityIndex: -1,
				statusIndex: -1,
				params: {
					"sender": "",
					"senderCode": "",
					"source": 1,
					"pageSize": 10,
					"pageNum": 1
				},
				isNoData: 'loading',
				isMore: 'more',
				refreshing: false,
				
			}
		},
		onLoad(options) {
			this.getProvince();
			//加载默认的起始地
			console.log("携带的参数",options);
			if (options.sender) {
				this.params.sender = options.sender;
				this.params.senderCode = options.senderCode;
				var chooseArr =  this.chooseArr;
				chooseArr[0].value = options.sender;
				this.chooseArr = chooseArr;
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
			this.getData("more");
		},
		methods: {
			showTypeAndLen(item) {
				var carLength = item.carLength;
				var carModel = item.carModel;
				return carLength + '米' + carModel
			},
			async getData(type) {
				if (type == 'refresh') {
					this.params.pageSize = 1
				} else {
					this.params.pageSize ++
				}
				try{
					var res = await ship.newQueryPostRequest("/olnanas/recommend/getCarSourceBySender", this.params)
					uni.stopPullDownRefresh();
					uni.hideLoading();
					console.log(res, '车源列表数据')
					if (res.retCode == "0000000") {
						var carSourceVOS = res.rspBody.carSourceVOS;
						var len = carSourceVOS.length;
						if (type == "refresh") {
							this.carSourceList = carSourceVOS;
							
							if (len < 1) {
								this.isNoData = true;
								return;
							}
							this.isNoData = false;
							this.isMore = len < this.params.pageSize ? 'noMore' : 'more'
						} else {
							this.isNoData = false;
							this.isMore = len < this.params.pageSize ? 'noMore' : 'more'
							this.carSourceList = this.carSourceList.concat(carSourceVOS);
						}
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			look() {
				var selectedProvinceIndex = this.selectedProvinceIndex;
				var selectedCityIndex = this.selectedCityIndex;
				if (selectedCityIndex < 0) return;
				var cityArr = this.cityArr;
				this.chooseArr[0].value = cityArr[selectedCityIndex].name;
				this.params.sender = cityArr[selectedCityIndex].name;
				this.params.senderCode = cityArr[selectedCityIndex].code;
				this.getData("refresh");
			},
			async getProvince() {
				var provinceLocal = uni.getStorageSync("provinceLocal");
				if (!provinceLocal) {
					var res = await ship.postRequest("/ts/nationDict/getBasicData");
					var provinceArr = res.rspBody;
					this.provinceArr = provinceArr;
					this.cityArr = provinceArr[0].cities;	
					uni.setStorageSync("provinceLocal", JSON.stringify(provinceArr));
					return;
				}
				this.provinceArr = JSON.parse(provinceLocal);
				console.log(this.provinceArr[0], '啊啊啊啊')
				this.cityArr = this.provinceArr[0].cities;
			},
			
			showPop(index) {
				var isCollapse = this.isCollapse;
				if (isCollapse == index + 1) {
					this.isCollapse = 0;
					return
				}
				this.isActive = index;
				
				this.isCollapse = index + 1;
				
				
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
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "重庆市" || provinceName == "北京市") {
					var cities = provinceArr[index].cities;
					var coties = [{
						name: provinceName,
						code: provinceCode,
						isFour: true,
					}, ...cities]
					
					this.cityArr = coties;
				} else {
					this.cityArr =  provinceArr[index].cities
				}
				
			},
			switchCityIndex(index) {
				this.selectedCityIndex = index
			},
			closePop() {
				this.isCollapse = 0;
			},
			switchStatus(index) {
				this.statusIndex = index;
			}
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
		.selected-content {
			.selected-title {
				height: 100rpx;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				.selected-item {
					display: flex;
					flex-direction: row;
					align-items: center;
					&:last-child {
						margin-left: 80rpx;
					}
					.icon_down {
						width: 24rpx;
						height: 12rpx;
						margin-left: 12rpx;
					}
					.selected-title-text {
						color: #333333;
						font-size: 36rpx;
						font-weight: 500;
					}
				}
			}
			.selected-pop {
				position: fixed;
				top: 100rpx;
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
						width: 405rpx;
						display: flex;
						flex-direction: row;
						.pop-btn-item {
							flex: 1;
							display: flex;
							justify-content: center;
							align-items: center;
							font-weight: 500;
							&.reset {
								color: rgba(43, 114, 240, 1);
							}
							&.look {
								color: #FFFFFF;
								
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
						}
						.route {
							color: rgba(51, 51, 51, 1);
							font-size: 36rpx;
							line-height: 42rpx;
						}
						.addr {
							color: rgba(52, 137, 233, 1);
							font-size: 36rpx;
							margin-left: 10rpx;
							line-height: 42rpx;
						}
						.location-icon {
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: flex-start;
							color: rgba(51, 51, 51, 1);
							font-size: 36rpx;
							line-height: 42rpx;
							margin-top: 16rpx;
							.beidou_icon {
								width: 20rpx;
								height: 20rpx;
								margin-right: 8rpx;
							}
						}
						.time {
							color: rgba(102, 102, 102, 1);
							font-size: 28rpx;
							margin-left: 18rpx;
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
