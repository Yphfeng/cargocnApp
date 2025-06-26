<template>
	<view :style="{height: windowHeight}" class="noData-box" v-if="noData">
		  <image
			class="noData"
			src="/static/images/noData.png"
			mode="widthFix"
		  ></image>
		  <view class="">暂无数据</view>
		  <view class="fix-bottom" @click="addFleet" :class="{active: !isShowFleet}">
		  	<image src="../../../../static/images/fleetAdd-icon.png" class="fleetAddIcon" mode="aspectFit"></image>
		  	<text>申请加入车队</text>
		  </view>
		  <view class="hideCont" :class="{active: isShowFleet}">
		  	<image src="../../../../static/images/fixedImg.png" class="hideImg"></image>
		  </view>
	</view>
	<view v-else>
		<view class="list" :style="{'min-height': windowHeight}">
			<view class="listItem" v-for="(item, index) in listArr" :class="[{active: index%2 !== 0}, {defaultItem: item.verificationStatus !== 1}]" @click="manageFleet(item)">
				<view class="listTile">
					<view class="tilImg" @click.stop="prevImage(item)">
						<view class="imgWhole">
							<image :src="item.badgeImage" class="tilImgAvatar" v-if="item.badgeImage"></image>
							<image :src="defaultAvatar" class="tilImgAvatar" v-else></image>
						</view>
						
					</view>
					<view class="tilContent">
						<view class="tileManager" v-if="item.verificationStatus == 1">
							<view class="managerContent">
								{{item.isAdmin == 1 ? '管理' : '查看'}}
								<image src="../../../../static/images/arrow_right_white.png" class="icon" mode="aspectFit"></image>
							</view>
							<image src="../../../../static/images/label01.png" class="bg" mode="aspectFit" v-if="index%2 == 0"></image>
							<image src="../../../../static/images/label02.png" class="bg" mode="aspectFit" v-else></image>
						</view>
						<view class="tileManager" v-else>
							<view class="managerContent" @click.stop="removeFleet(item, index)">
								{{item.verificationStatus == 2 ? '撤回' : '删除'}}
								<image src="../../../../static/images/arrow_right_white.png" class="icon" mode="aspectFit"></image>
							</view>
							<image src="../../../../static/images/revoke.png" class="bg" mode="aspectFit"></image>
						</view>
						<view class="title">
							<view class="main" :class="[{active: index%2 !== 0}, {defaultMain: item.verificationStatus !== 1}]">
								{{item.name}}
							</view>
							<view class="sub">
								<view class="member">{{item.memberNum}}人</view>
								<view v-if="item.scale == 1">(小型车队)</view>
								<view v-if="item.scale == 2">(中型车队)</view>
								<view v-if="item.scale == 3">(大型车队)</view>
							</view>
						</view>
						<view class="subTitle">
							车队口号：{{item.slogan || "暂无"}}
						</view>
						<view class="subTitle">
							车队号：{{item.code}}
							<view class="status" v-if="item.verificationStatus == 2">审核中</view>
							<view class="status" v-if="item.verificationStatus == 0">已拒绝</view>
						</view>
					</view>
				</view>
				<view class="listSubTile">
					<view class="subItem">
						<view class="label">
							主要车型：
						</view>
						<view class="subContent" v-if="item.model.length < 1">
							<view class="subTextContent" :class="[{active: index%2 !== 0}, {defaultBtnItem: item.verificationStatus !== 1}]">
								暂无
							</view>
						</view>
						<view class="subContent" v-if="item.model.length > 0">
							<view class="btnItem" :class="[{active: index%2 !== 0}, {defaultBtnItem: item.verificationStatus !== 1}]" v-for="atem in item.model">
								{{atem}}
							</view>
						</view>
					</view>
					<view class="subItem last">
						<view class="label">
							主要线路：
						</view>
						<view class="subContent">
							<view class="subTextContent routeContent" :class="[{active: index%2 !== 0}, {defaultBtnItem: item.verificationStatus !== 1}]" v-if="item.route">
								{{item.route}}
							</view>
							
							<view class="subTextContent" :class="[{active: index%2 !== 0}, {defaultBtnItem: item.verificationStatus !== 1}]" v-else>
								暂无
							</view>
						</view>
					</view>
				</view>
				
			</view>
		
		</view>
		<view class="fix-bottom02">
			<text>共加入了{{total}}个车队。</text>
		</view>
		<view class="fix-bottom" @click="addFleet" :class="{active: !isShowFleet}">
			<image src="../../../../static/images/fleetAdd-icon.png" class="fleetAddIcon" mode="aspectFit"></image>
			<text>申请加入车队</text>
		</view>
		<view class="hideCont" :class="{active: isShowFleet}">
			<image src="../../../../static/images/fixedImg.png" class="hideImg"></image>
		</view>
	</view>
</template>

<script>
	import * as ship from "../../../../utils/ship"
	var defaultParams = {pageSize:1500,pageNum:1,isMyFleet:1,isOwner:0,}
	var isClicking = false;
	export default {
		data() {
			return {
				defaultAvatar: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/images/fleetAvatar.jpg',
				listArr: [],
				isShowFleet: true,
				timer: null,
				freshing: false, //是否正在刷新
				windowHeight: 0,
				noData: false,
				total: 0,
				addedFleetCount: 0,
				totalMember: 0,
				configVal1: 0, //允许加入车队的上线数
			}
		},
		async onLoad() {
			isClicking = false;
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			console.log(windowHeight, '高度')
			this.contentHeight = (windowHeight - 40)*2 + 'rpx';
			this.windowHeight = windowHeight*2 + 'rpx';
			this.getCountInfo();
			this.getPageInfo();
			uni.$on("refresFleetAddList", () => {
				this.getCountInfo();
				this.getPageInfo();
			})
			
			
		},
		
		onPageScroll(object) {
			// console.log('监听滚动', object)
			// console.log('开始滚动')
			// 只要滚动就清除状态
			this.timer && clearTimeout(this.timer)
			// 告知标识 -> 开始滚动
			this.isShowFleet = false
			// 检测是否停留了 N 秒
			// 如果停留则表示滚动结束
			// N: 500(定时器时间 毫秒) -> 0.5秒算停止滚动
			// 滚动后多长时间算停止滚动
			this.timer = setTimeout(() => {
				console.log('结束滚动')
				// 告知标识 -> 结束滚动
				this.isShowFleet = true; 
			}, 1000);
		},
		onPullDownRefresh() {
		  // 下拉刷新
		  if (this.freshing) {
		    //当正在调用接口获取数据时，此时的下拉不做任何操作
		    return;
		  }
		  this.freshing = true;
		  //刷新成功
		  setTimeout(() => {
		    this.listArr = [];
		    // console.log('下啦刷新id清空', this.idList);
		    this.getPageInfo();
		  }, 500);
		  // this.toRefresh();
		},
		onReachBottom() {
			console.log('loadMore');
		  // 上拉加载
		  // this.loadMore();
		},
		methods: {
			manageFleet(item) {
				//管理车队信息
				if (item.verificationStatus !== 1) {
					return;
				}
				if (isClicking) {
					return
				}
				isClicking = true;
				console.log(JSON.stringify(item), '参数')
				uni.navigateTo({
					url: '../fleetManager/fleetManager?fleetDetail=' + JSON.stringify(item)
				})
				setTimeout(() => {
					isClicking = false
				}, 1000)
			},
			//获取配置项
			async getCountInfo() {
				//获取列表的配置项
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				var userId = JSON.parse(userInfo).userId;
				try{
					var response = await ship.postRequest('/yh/business/user/select/by/user/id?userId=' + userId, {
						userId: userId
					});
					var levelName = response.rspBody.levelName;
					var result = await ship.newQueryPostRequest('/cd/fleetConfig/list', {
						configName: levelName,
					})
					console.log(result, '名称')
					var arr = result.rspBody;
					var findIndex = arr.findIndex(item => {
						var configType = item.configType;
						return configType.indexOf("JOIN") !== -1
					})
					if (findIndex > -1) {
						var configVal1 = arr[findIndex].configVal1; //允许加入车队的上限数
						this.configVal1 = configVal1;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			async getPageInfo() {
				//获取列表数据
				var that = this;
				try{
			
					var res = await ship.newQueryPostRequest("/cd/fleet/list", defaultParams);
					console.log(res, '车队列表')
					that.freshing = false;
					uni.stopPullDownRefresh();
				
					// console.log('idList数据', res);
					if (res.retCode == "0000000") {
						var listArr = res.rspBody.items;
						var resultArr = [];
						var totalMember = 0;
						var total = 0;
						var addedFleetCount = 0;
						listArr.forEach(item => {
							var arrItem = {...item};
							arrItem.model = item.model ? item.model.split(',') : [];
							totalMember += item.memberNum;
							if (item.verificationStatus == 1) {
								total ++
							}
							if (item.verificationStatus !== 0) {
								addedFleetCount ++
							}
							resultArr.push(arrItem);
						})
						that.listArr = resultArr;
						that.total = total;
						that.addedFleetCount = addedFleetCount;
						that.totalMember = totalMember;
						that.noData = res.rspBody.total == 0;
					} else if (res.retCode == "500") {
						
						uni.showToast({
							title: "货运同学开小差啦，请稍后再试~",
							icon: "none",
						});
						that.noData = true;
					} else {
						
						uni.stopPullDownRefresh();
						uni.showToast({
							title: res.retDesc,
							icon: "none",
						});
					}
					  
				}catch(e){
					
					uni.stopPullDownRefresh();
					console.log(e)
					uni.showToast({
						title: "货运同学开小差啦，请稍后再试~",
						icon: "none",
					});
					that.freshing = false;
				}
				
				  
				
			},
			addFleet() {
				//申请加入车队已加入和审核中的判断
				
				if (this.addedFleetCount >= this.configVal1) {
					uni.showToast({
						title: '加入的车队已达上限,无法继续加入',
						icon: 'none'
					})
					return;
				}
				if (isClicking) {
					return
				}
				isClicking = true;
				uni.navigateTo({
					url: '../fleetAdd/fleetAdd?type=create'
				})
				setTimeout(() => {
					isClicking = false;
				}, 1000)
			},
			removeFleet(item, index) {
				//撤回或删除申请
				var that = this;
				var userInfo = uni.getStorageSync("userInfo");
				var listArr = this.listArr;
				console.log(userInfo, '用户信息');
				var userCode = JSON.parse(userInfo).attrs.userCode;
				var fleetId = item.id;
				var str = "";
				if (item.verificationStatus == 0) {
					str = "确认删除吗？"
				} else {
					str = "确认撤回吗？"
				}
				var params = {
					fleetId: fleetId,
					userCode: userCode,
				}
				console.log(params, 'asa')
				uni.showModal({
					content: str,
					success: function(res) {
						if (res.confirm) {
							uni.showLoading();
							ship.postRequest("/cd/fleetWithUser/remove", params).then(res => {
								console.log(res, 'asa')
								uni.hideLoading();
								if (res.retCode == "0000000") {
									uni.showToast({
										title: '成功'
									});
									if (item.verificationStatus !== 0) {
										that.addedFleetCount = that.addedFleetCount - 1;
									}
									listArr.splice(index, 1);
									that.listArr = listArr;
									console.log(listArr.length < 1 , 'asas');
									that.noData = listArr.length < 1
									
									
									// uni.$emit("refresFleetAddList");
								} else {
									uni.showToast({
										title: res.retDesc,
										icon: 'none'
									})
								}
							}).catch(err => {
								uni.hideLoading();
							})
						}
					}
				})
			},
			prevImage(item) {
				var badgeImage = item.badgeImage;
				var that = this;
				if (badgeImage) {
					uni.previewImage({
						current: 0,
						urls: [badgeImage]
					})
				} else {
					uni.previewImage({
						current: 0,
						urls: [that.defaultAvatar]
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #000000;
	}
	.list {
		padding: 20rpx 28rpx 80rpx 28rpx;
		background-color: rgba(242, 242, 242, 1);
		overflow-x: hidden;
	}
	.listItem {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
		background-image: linear-gradient(180deg, rgba(255, 145, 101, 0.6), rgba(255, 255, 255, 0), rgba(255, 145, 101, 0.6));
		padding: 2rpx;
		box-sizing: border-box;
		border-radius: 12rpx;
		box-shadow: 0 0 12rpx 0 rgba(0, 0, 0, 0.18);
		
		&.active {
			background-image: linear-gradient(180deg, rgba(59, 151, 255, 1), rgba(255, 255, 255, 0), rgba(59, 151, 255, 1));
		}
		&.defaultItem {
			background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.18));
			
		}
		.listTile {
			display: flex;
			flex-direction: row;
			.tilImg {
				width: 154rpx;
				height: 154rpx;
				background-color: #FFFFFF;
				border-radius: 12rpx 0 0 12rpx;
				box-shadow: 0 0 12rpx 0 rgba(0, 0, 0, 0.18);
				position: relative;
				.imgWhole {
					position: absolute;
					left: -2rpx;
					top: -2rpx;
					width: 156rpx;
					height: 156rpx;
					z-index: 9;
					border-radius: 12rpx 0 0 12rpx;
					overflow: hidden;
				}
				.tilImgAvatar {
					width: 156rpx;
					height: 156rpx;
				}
			}
			.tilContent {
				flex: 1;
				background-color: rgba(255, 255, 255, 1);
				height: 154rpx;
				padding: 16rpx 24rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-start;
				position: relative;
				border-radius: 0 12rpx 12rpx 0;
				box-shadow: 0 0 12rpx 0 rgba(0, 0, 0, 0.18);
				.tileManager {
					position: absolute;
					right: -15rpx;
					bottom: 26rpx;
					width: 114rpx;
					height: 48rpx;
					color: #FFFFFF;
					font-size: 24rpx;
					font-weight: bold;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.icon {
						width: 30rpx;
					}
					.bg {
						width: 114rpx;
					}
					.managerContent {
						position: absolute;
						right: -15rpx;
						bottom: 0;
						z-index: 1;
						color: #FFFFFF;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						width: 114rpx;
						height: 53rpx;
						
					}
				}
				.title {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					padding-bottom: 15rpx;
					.main {
						color: rgba(255, 125, 74, 1);
						font-size: 30rpx;
						padding-right: 20rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						max-width: 250rpx;
						&.active {
							color: rgba(39, 137, 250, 1);
						}
						&.defaultMain {
							color: #333333;
						}
					}
					.sub {
						color: rgba(119, 119, 119, 1);
						font-size: 24rpx;
						line-height: 1;
						border-left: 1px solid rgba(151, 151, 151, 1);
						padding-left: 20rpx;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						.member {
							padding-right: 20rpx;
						}
					}
				}
				.subTitle {
					font-size: 24rpx;
					color: rgba(119, 119, 119, 1);
					width: 400rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					display: flex;
					flex-direction: row;
					align-items: center;
					.status {
						width: 136rpx;
						height: 46rpx;
						border-radius: 23rpx;
						color: #37CA7C;
						border: 1px solid #37CA7C;
						margin-left: 20rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
		.listSubTile {
			background-color: rgba(242, 242, 242, 1);
			display: flex;
			flex-direction: column;
			padding: 24rpx 0;
			border-radius: 0 0 12rpx 12rpx;
			font-size: 24rpx;
			.subItem {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: flex-start;
				&.last {
					margin-top: 12rpx;
					.label {
						width: 120rpx;
						height: 34rpx;
						
						margin: 0 20rpx;
						line-height: 34rpx;
					}
					.subContent {
						flex: 1;
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						align-items: flex-start;
						justify-content: flex-start;
						.subTextContent {
							flex: 1;
							color: rgba(255, 129, 78, 1);
							
							display: flex;
							justify-content: flex-start;
							align-items: flex-start;
							max-height: 68rpx;
							line-height: 34rpx;
							overflow: hidden;
							-webkit-line-clamp: 2;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							
							&.active {
								color: rgba(59, 151, 255, 1);
							}
							&.defaultBtnItem {
								border-color: transparent;
								color: rgba(119, 119, 119, 1);
								background-color: transparent;
							}
						}
					}
				}
				.label {
					width: 120rpx;
					height: 46rpx;
					line-height: 46rpx;
					margin: 0 20rpx;
				}
				.subContent {
					flex: 1;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-items: flex-start;
					.subTextContent {
						flex: 1;
						color: rgba(255, 129, 78, 1);
						display: flex;
						justify-content: flex-start;
						align-items: flex-start;
						max-height: 92rpx;
						line-height: 46rpx;
						overflow: hidden;
						-webkit-line-clamp: 2;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						
						&.active {
							color: rgba(59, 151, 255, 1);
						}
						&.defaultBtnItem {
							border-color: transparent;
							color: rgba(119, 119, 119, 1);
							background-color: transparent;
						}
						&.routeContent {
							padding-right: 20rpx;
						}
					}
					.btnItem {
						width: 112rpx;
						height: 46rpx;
						border-radius: 23rpx;
						color: rgba(255, 145, 101, 1);
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 16rpx;
						margin-bottom: 20rpx;
						border: 1px solid rgba(255, 145, 101, 1);
						&.active{
							border-color: rgba(59, 151, 255, 1);
							color: rgba(59, 151, 255, 1);
						}
						&.defaultBtnItem {
							border-color: rgba(119, 119, 119, 1);
							color: rgba(119, 119, 119, 1);
						}
					}
				}
			}
		}
		
	}
	.fix-bottom {
		position: fixed;
		
		height: 120rpx;
		bottom: 88rpx;
		right: 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #333333;
		font-size: 24rpx;
		z-index: 99;
		transition: all .3s ease-in;
		.fleetAddIcon {
			width: 88rpx;
		}
		&.active {
			transform: translateX(100rpx);
			opacity: 0;
		}
	}
	.hideImg {
		height: 112rpx;
		width: 28rpx;
	}
	.hideCont {
		position: fixed;
		right: 0;
		bottom: 60rpx;
		animation-delay: .3s;
		transition: all .3s ease-in;
		&.active {
			display: none;
		}
	}
	.fix-bottom02 {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 80rpx;
		width: 100%;
		padding: 0 24rpx;
		line-height: 80rpx;
		box-sizing: border-box;
		color: rgba(112, 112, 113, 1);
		font-size: 24rpx;
		background-color: rgba(242, 242, 242, 1);
		z-index: 9999;
	}
	.noData {
	  width: 400rpx;
	  margin-bottom: 30rpx;
	}
	.noData-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
