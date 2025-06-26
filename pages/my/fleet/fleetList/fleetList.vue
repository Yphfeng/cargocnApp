<template>
	<view class="container">
		<view class="tabs">
			<view class="tabItem" v-for="(item, index) in tabArr" @click="switchTab(index)">
				<view class="tabText" :class="{active: tabIndex == index}">{{item}}</view>
			</view>
		</view>
		<view v-if="tabIndex == 0">
			<view :style="{height: windowHeight}" class="noData-box" v-if="noData">
				  <image
					class="noData"
					src="/static/images/noData.png"
					mode="widthFix"
				  ></image>
				  <view class="">暂无数据</view>
				  <view class="fix-bottom" @click="addFleet" :class="{active: !isShowFleet}">
					<image src="../../../../static/images/fleetAdd-icon.png" class="fleetAddIcon" mode="aspectFit"></image>
					<text>组建新车队</text>
				  </view>
				  <view class="hideCont" :class="{active: isShowFleet}">
					<image src="../../../../static/images/fixedImg.png" class="hideImg"></image>
				  </view>
			</view>
			<view v-else >
				<view class="list" scroll-y :style="{'min-height': windowHeight}">
					<view class="listItem" v-for="(item, index) in listArr" :class="{active: index%2 !== 0}" @click="manageFleet(item)">
						<view class="listTile">
							<view class="tilImg" @click.stop="prevImage(item)">
								<view class="imgWhole">
									<image :src="item.badgeImage" class="tilImgAvatar" v-if="item.badgeImage"></image>
									<image :src="defaultAvatar" class="tilImgAvatar" v-else></image>
								</view>
								
							</view>
							<view class="tilWhole">
								<view class="tilContent">
									<view class="tileManager">
										<view class="managerContent">
											管理
											<image src="../../../../static/images/arrow_right_white.png" class="icon" mode="aspectFit"></image>
										</view>
										<image src="../../../../static/images/label01.png" class="bg" mode="aspectFit" v-if="index%2 == 0"></image>
										<image src="../../../../static/images/label02.png" class="bg" mode="aspectFit" v-else></image>
									</view>
									<view class="title">
										<view class="main" :class="{active: index%2 !== 0}">
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
										车队号：{{item.code || "暂无"}}
									</view>
								</view>
							</view>
							
						</view>
						<view class="listSubTotleTile">
							<view class="listSubTile">
								<view class="subItem">
									<view class="label">
										主要车型：
									</view>
									<view class="subContent" v-if="item.model.length < 1">
										<view class="subTextContent">
											暂无
										</view>
									</view>
									<view class="subContent" v-if="item.model.length > 0">
										<view class="btnItem" :class="{active: index%2 !== 0}" v-for="atem in item.model">
											{{atem}}
										</view>
									</view>
								</view>
								<view class="subItem last">
									<view class="label">
										主要线路：
									</view>
									<view class="subContent">
										<view class="subTextContent routeContent" :class="{active: index%2 !== 0}" v-if="item.route">
											{{item.route}}
										</view>
										
										<view class="subTextContent" :class="{active: index%2 !== 0}" v-else>
											暂无
										</view>
									</view>
								</view>
							</view>
						</view>
						
						
					</view>
				</view>
				<view class="fix-bottom02">
					<text>共组建了{{total}}个车队，共计{{totalMember}}卡友加入</text>
				</view>
				<view class="fix-bottom" @click="addFleet" :class="{active: !isShowFleet}">
					<image src="../../../../static/images/fleetAdd-icon.png" class="fleetAddIcon" mode="aspectFit"></image>
					<text>组建新车队</text>
				</view>
				<view class="hideCont" :class="{active: isShowFleet}">
					<image src="../../../../static/images/fixedImg.png" class="hideImg"></image>
				</view>
			</view>
		</view>
		<view v-if="tabIndex == 1">
			<view :style="{height: windowHeight}" class="noData-box" v-if="noData">
				  <image
					class="noData"
					src="/static/images/noData.png"
					mode="widthFix"
				  ></image>
				  <view class="">暂无数据</view>
				  <view class="fix-bottom" @click="addMemberFleet" :class="{active: !isShowFleet}">
					<image src="../../../../static/images/fleetAdd-icon.png" class="fleetAddIcon" mode="aspectFit"></image>
					<text>添加合作车队</text>
				  </view>
				  <view class="hideCont" :class="{active: isShowFleet}">
					<image src="../../../../static/images/fixedImg.png" class="hideImg"></image>
				  </view>
			</view>
			<view v-else >
				<view class="list" scroll-y :style="{'min-height': windowHeight}">
					<view class="listItem" v-for="(item, index) in listMemberArr" :class="{active: index%2 !== 0}">
						<view class="listTile">
							<view class="tilImg" @click.stop="prevImage(item)">
								<view class="imgWhole">
									<image :src="item.badgeImage" class="tilImgAvatar" v-if="item.badgeImage"></image>
									<image :src="defaultAvatar" class="tilImgAvatar" v-else></image>
								</view>
								
							</view>
							<view class="tilWhole">
								<view class="tilContent">
									<view class="tileManager">
										<view class="managerContent" @click.stop="del(item, index)">
											删除
											<image src="../../../../static/images/arrow_right_white.png" class="icon" mode="aspectFit"></image>
										</view>
										<image src="../../../../static/images/label01.png" class="bg" mode="aspectFit" v-if="index%2 == 0"></image>
										<image src="../../../../static/images/label02.png" class="bg" mode="aspectFit" v-else></image>
									</view>
									<view class="title">
										<view class="main" :class="{active: index%2 !== 0}">
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
										车队号：{{item.code || "暂无"}}
									</view>
								</view>
							</view>
							
						</view>
						<view class="listSubTotleTile">
							<view class="listSubTile">
								<view class="subItem">
									<view class="label">
										主要车型：
									</view>
									<view class="subContent" v-if="item.model.length < 1">
										<view class="subTextContent">
											暂无
										</view>
									</view>
									<view class="subContent" v-if="item.model.length > 0">
										<view class="btnItem" :class="{active: index%2 !== 0}" v-for="atem in item.model">
											{{atem}}
										</view>
									</view>
								</view>
								<view class="subItem last">
									<view class="label">
										主要线路：
									</view>
									<view class="subContent">
										<view class="subTextContent routeContent" :class="{active: index%2 !== 0}" v-if="item.route">
											{{item.route}}
										</view>
										
										<view class="subTextContent" :class="{active: index%2 !== 0}" v-else>
											暂无
										</view>
									</view>
								</view>
							</view>
						</view>
						
						
					</view>
				</view>
				<view class="fix-bottom02">
					<text>共添加了{{total}}个车队，共计{{totalMember}}卡友加入</text>
				</view>
				<view class="fix-bottom" @click="addMemberFleet" :class="{active: !isShowFleet}">
					<image src="../../../../static/images/fleetAdd-icon.png" class="fleetAddIcon" mode="aspectFit"></image>
					<text>添加合作车队</text>
				</view>
				<view class="hideCont" :class="{active: isShowFleet}">
					<image src="../../../../static/images/fixedImg.png" class="hideImg"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as ship from "../../../../utils/ship"
	var defaultParams = {pageSize:1500,pageNum:1,isMyFleet:1,isOwner:1}
	var defaultMemberParams = {pageSize:1500,pageNum:1,isMyCooperateFleet: 1} 
	export default {
		data() {
			return { 
				defaultAvatar: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/images/fleetAvatar.jpg',
				listArr: [],
				listMemberArr: [],
				isShowFleet: true,
				timer: null,
				freshing: false, //是否正在刷新
				windowHeight: 0,
				noData: false,
				total: 0,
				totalMember: 0,
				configVal1: 0,
				tabArr: ['我的车队', '我的合作车队'],
				tabIndex: 0,
			}
		},
		onLoad() {
			uni.$on("refresFleetList", () => {
				
					var index = this.tabIndex;
					if (index == 0) {
						this.getPageInfo("refresh");
					} else {
						this.fetchMemberList('refresh');
					}
			
			})
		},
		onShow() {
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			console.log(windowHeight, '高度')
			this.windowHeight = (windowHeight*2 - 180) + 'rpx';
			var index = this.tabIndex;
			if (index == 0) {
				this.getPageInfo("refresh");
			} else {
				this.fetchMemberList('refresh');
			}
		},
		
		onPageScroll(object) {
			console.log('监听滚动', object)
			    console.log('开始滚动')
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
				}, 500);
		},
		onPullDownRefresh() {
		  // 下拉刷新
		  if (this.freshing) {
		    //当正在调用接口获取数据时，此时的下拉不做任何操作
		    return;
		  }
		  this.freshing = true;
		  if (this.tabIndex == 0) {
			  setTimeout(() => {
			    // console.log('下啦刷新id清空', this.idList);
			    this.getPageInfo("refresh");
			  }, 500);
		  } else {
			  setTimeout(() => {
			    // console.log('下啦刷新id清空', this.idList);
			    this.fetchMemberList("refresh");
			  }, 500);
		  }
		},
		methods: {
			manageFleet(item) {
				//管理车队信息
				console.log(JSON.stringify(item), '参数')
				uni.navigateTo({
					url: '../fleetManager/fleetManager?fleetDetail=' + JSON.stringify(item)
				})
			},
		
			async fetchMemberList(type) {
				console.log('请求');
				var that = this;
				try{
					
					var res = await ship.newQueryPostRequest("/cd/fleet/list", defaultMemberParams);
					console.log(res, '车队列表')
					that.freshing = false;
					uni.stopPullDownRefresh();
					// console.log('idList数据', res);
					if (res.retCode == "0000000") {
						var listArr = res.rspBody.items;
						var resultArr = [];
						var totalMember = 0;
						listArr.forEach(item => {
							var arrItem = {...item};
							arrItem.model = item.model ? item.model.split(',') : [];
							totalMember += item.memberNum;
							resultArr.push(arrItem);
						})
						if (type == "refresh") {
							that.listMemberArr = resultArr;
						} else {
							that.listMemberArr = that.listArr.concat(resultArr);
						}
						
						that.total = res.rspBody.total;
						that.totalMember = totalMember;
						that.noData = res.rspBody.total == 0;
					} else if (res.retCode == "500") {
						
						uni.showToast({
							title: "货运同学开小差啦，请稍后再试~",
							icon: "none",
						});
						that.noData = true;
					} else {
						
						uni.showToast({
							title: res.retDesc,
							icon: "none",
						});
					}
					  
				}catch(e){
					uni.stopPullDownRefresh();
					uni.showToast({
						title: "货运同学开小差啦，请稍后再试~",
						icon: "none",
					});
					that.noData = true;
					console.log(e)
					//TODO handle the exception
					that.triggered = false;
					that.freshing = false;
				}
			},
			async getPageInfo(type) {
				//获取列表数据
				console.log('请求', defaultParams);
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
						listArr.forEach(item => {
							var arrItem = {...item};
							arrItem.model = item.model ? item.model.split(',') : [];
							totalMember += item.memberNum;
							resultArr.push(arrItem);
						})
						if (type == "refresh") {
							that.listArr = resultArr;
						} else {
							that.listArr = that.listArr.concat(resultArr);
						}
						
						that.total = res.rspBody.total;
						that.totalMember = totalMember;
						that.noData = res.rspBody.total == 0;
					} else if (res.retCode == "500") {
						
						uni.showToast({
							title: "货运同学开小差啦，请稍后再试~",
							icon: "none",
						});
						that.noData = true;
					} else {
						
						uni.showToast({
							title: res.retDesc,
							icon: "none",
						});
					}
					  
				}catch(e){
					uni.stopPullDownRefresh();
					uni.showToast({
						title: "货运同学开小差啦，请稍后再试~",
						icon: "none",
					});
					that.noData = true;
					console.log(e)
					//TODO handle the exception
					that.triggered = false;
					that.freshing = false;
				}
				
				  
				
			},
			addMemberFleet() {
				//加入合作车队
				uni.navigateTo({
					url: '../fleetAdd/fleetAdd?type=create&state=addMember'
				})
			},
			addFleet() {
				//组件新车队
				uni.navigateTo({
					url: '../fleetCreate/fleetCreate?type=create'
				})
			},
			del(item,index) {
				var that = this;
				//删除车队
				var url = "/cd/fleetWithUser/remove";
				var userInfo = uni.getStorageSync("userInfo");
				var userCode = JSON.parse(userInfo).attrs.userCode;
				var params = {
					fleetId: item.id,
					userCode: userCode,
				}
				uni.showModal({
					title: '确定删除吗？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading();
							console.log(params, '数据1')
							ship.postRequest(url, params)
							.then(res => {
								console.log(res, 'asa')
								uni.hideLoading();
								if (res.retCode == '0000000') {
									uni.showToast({
										title: '删除成功',
										icon: 'none',
									})
									setTimeout(() => {
										var index = that.tabIndex;
										if (index == 0) {
											that.getPageInfo("refresh");
										} else {
											that.fetchMemberList('refresh');
										}
									}, 500)
									
									
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
			switchTab(index) {
				this.tabIndex = index;
				if (index == 0) {
					this.getPageInfo("refresh");
				} else {
					this.fetchMemberList('refresh');
				}
			},
			prevImage(item) {
				//预览
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
	.list {
		padding: 20rpx 28rpx 80rpx 28rpx;
		background-color: rgba(242, 242, 242, 1);
		box-sizing: border-box;
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
		.listTile {
			display: flex;
			flex-direction: row;
			border-radius: 12rpx;
			
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
			.tilWhole {
			
				height: 154rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				box-sizing: border-box;
			}
			.tilContent {	
				flex: 1;
				background-color: rgba(255, 255, 255, 1);
				padding: 16rpx 24rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-start;
				position: relative;
				box-shadow: 0 4rpx 16rpx -6rpx rgba(185, 185, 185, 0.85);
				border-radius: 0 12rpx 12rpx 0;
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
				}
			}
		}
		.listSubTotleTile {
			
		}
		.listSubTile {
			background-color: rgba(242, 242, 242, 1);
			display: flex;
			flex-direction: column;
			padding: 24rpx 0;
			border-radius: 0 0 12rpx 12rpx;
			font-size: 24rpx;
			.subItem {
				flex: 1;
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
						&.routeContent {
							padding-right: 20rpx;
						}
					}
					.btnItem {
						width: 112rpx;
						height: 46rpx;
						border-radius: 23rpx;
						color: #FF9165;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 16rpx;
						margin-bottom: 20rpx;
						border: 1rpx solid #FF9165;
						&.active{
							border-color: #3B97FF;
							color: #3B97FF;
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
	.container {
		padding-top: 100rpx;
		box-sizing: border-box;
	}
	.tabs {
		position: fixed;
		top: 0;
		left: 0;
		height: 100rpx;
		width: 100vw;
		display: flex;
		flex-direction: row;
		z-index: 999;
		background-color: #FFFFFF;
		padding: 20rpx 0;
		box-sizing: border-box;
		.tabItem {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			&:first-child {
				border-right: 2px solid #979797;
			}
			.tabText {
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				border-bottom: 2px solid #FFFFFF;
				&.active {
					border-bottom-color: #4AA2F3;
				}
			}
		}
		
	}
</style>
