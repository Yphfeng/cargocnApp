<template>
	<view>
		<!-- <canvas :style="'width:' + canvasWidth + 'px;height:' + canvasHeight + 'px ;position:absolute;top: -1000px;'" canvas-id="myCanvas"></canvas> -->
		<view class="jym-container">
			<!-- <swiper :current="tabCurrent" @animationfinish="animationFinish" class="scrollView" :style="'height:' + swipeHeight +'rpx'"> -->
			<!-- <swiper-item :item-id="0"> -->
			<!-- <scroll :requesting="requesting1" :empty-show="emptyShow1" style="height: 95vh;" :refresh-size="80" @refresh="refresh1"> -->
			<view class="advs" v-if="activeAdvObj && activeAdvObj.info[0].advUrl">
				<image :src="activeAdvObj.info[0].advUrl" mode="aspectFill" @click="showBigBanner(activeAdvObj.info[1], activeAdvObj.info[1].advUrl)" class="mainBanner"image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adverties.gif"  class="advertiesGif"></image>
			</view>
			<view style="height: 160rpx;"  v-if="activeAdvObj && activeAdvObj.info[0].advUrl"></view>
			<view v-show="tabCurrent == 0" style="width:100%" >
				<view v-for="(item, index) in listData1" :key="index" style="position: relative;" :data-map="item">
					<view class="listItemView" @tap="item.forward==1?onShare:onShare1" :data-item="item"
						:style="'background:url(' + (item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2) + ');' + 'background-size: 100% 196rpx'">
						<image class="listItemView_img" v-if="item.couponName=='转发奖励'?true:false"
							src="/static/images/jym/prize.png"></image>

						<view class="listItemViewLine1">
							<view class="listItemViewLine1Left">
								<view v-if="item.couponType==110" style="flex-direction: column;height: 100%;"
									class="flex flex-center row-center align-center carNoView2 cor">
									<label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponMaxAmount}}
										<text class="unit" selectable="false" space="false" decode="false">
											/L
										</text>
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>
								<view v-else-if="item.couponType==111" style="flex-direction: column;height: 100%;"
									class="flex flex-center row-center align-center carNoView2 cor">
									<label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponMaxAmount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>

								<!-- 折扣券 -->
								<view v-else-if="item.couponType==114" style="flex-direction: column;height: 100%;"
									class="flex flex-center row-center align-center carNoView2 cor">
									<label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<!-- <text class="sell">￥</text> -->
										{{item.couponMaxAmount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>


								<view v-else style="flex-direction: column;height: 100%;"
									class="flex flex-center row-center align-center carNoView2 cor">
									<label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponMaxAmount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>
							</view>
							<view class="listItemViewLine1Right">
								<view class="listItemViewLine1Right_Head">
									<view class="" style="display: flex; align-items: center;">
										<view class="listItemViewLine1Right_Name" v-if="item.couponName">
											<!-- {{item.scope}} -->
											{{item.couponName}}
										</view>
										<view class="typeName"
											:style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
											<!-- {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}} -->
											{{item.fuelTypeName ? item.fuelTypeName  : item.fuelNoName}}
										</view>
									</view>
									<view class="" style="font-size: 23rpx; display: flex; align-items: center;"
										:style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
										<view class="">
											<image v-if="item.fuelType==3" style="width: 30rpx;"
												src="/static/images/jym/distance3.png" mode="widthFix"></image>
											<image v-else style="width: 30rpx;" src="/static/images/jym/distance1.png"
												mode="widthFix"></image>
										</view>
										<view class="">{{item.distanceDesc}}</view>
									</view>
								</view>
								<view class="amountView">
									<view class="stand-type" :style="'color:' + (item.fuelType==1?'#F7A129':'#6AC5D0')">{{item.scope}}</view>
									<view
										:style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)"
										v-if="item.vaildStartDate">
										{{item.vaildStartDate}}~{{item.vaildEndDate||'长期'}}
									</view>
									<view
										:style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)"
										v-else-if="item.vaildEndDate">
										至{{item.vaildEndDate||'长期'}}
									</view>
									<view
										:style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)"
										v-else>
										长期有效
									</view>
									<image class="listItemView_img1" v-if="item.forward==1?true:false"
										:src="item.fuelType==1?couponForward:item.fuelType==2?couponForward1:couponForward2">
									</image>
								</view>
								<text class="couponDetails" v-if="item.couponTypeName != '现金'">{{item.couponDetails}}</text>
								<text class="couponDetails" v-else>可与其他券组合使用</text>
								<view v-if="item.couponTypeName == '红包' || item.couponTypeName == '折扣'"
									class="rules-use" @tap.stop="showDialogBtn" :data-id="item.id">使用规则 >
									<!-- <image src="../../../../images/icon_right.png" /> -->
								</view>

								
								<view class="listItemViewRight"
									:style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)"
									v-if="item.couponType != 113" @tap.stop="clickUse" :data-item="item">
									立即领取
								</view>
							
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal"></view>
		<!-- 弹出层 -->
		<view class="modalDlg" v-if="showModal">
			<view class="modal_top1">
				使用规则
			</view>

			<scroll-view scroll-y="true" style="height: 330px;overflow-y: hidden; width: 568rpx; padding: 0 20rpx;">
				<!-- <view class="modal_top modal_con">{{rule}}</view> -->
				<view class="modal_top modal_con">
					<view class="modal-text">使用条件：</view>
					<view class="modal-text-right">{{ruleObj.rule1}}</view>
				</view>
				<view class="modal_top modal_con">
					<view class="modal-text">加油类型：</view>
					<view class="modal-text-right">{{ruleObj.fuelTypeName}}</view>
				</view>
				<view class="modal_top modal_con">
					<view class="modal-text">使用范围：</view>
					<view class="modal-text-right" v-if="!ruleObj.useStationList && !ruleObj.excludeStationList">全站通用券</view>
					<text class="modal-text-scope" v-else>
						<text v-if="ruleObj.useStationList" v-for="(item, index) in ruleObj.useStationList">{{item.compSecondName}}{{index!=ruleObj.useStationList.length-1?',':''}}</text>
						<text v-if="ruleObj.excludeStationList">除</text>
						<text style="color: red;" v-if="ruleObj.excludeStationList" v-for="(item, index) in ruleObj.excludeStationList">{{item.compSecondName}}{{index!=ruleObj.excludeStationList.length-1?',':''}}</text>
						<text v-if="ruleObj.excludeStationList">全站通用</text>
					</text>
				</view>
				<view class="modal_top modal_con">
					<view class="modal-text">时间范围：</view>
					<view class="modal-text-right" v-if="ruleObj.vaildStartDate && ruleObj.vaildEndDate">
						{{ruleObj.vaildStartDate + '~' + ruleObj.vaildEndDate}}</view>
					<view class="modal-text-right" v-else-if="ruleObj.vaildEndDate && !ruleObj.vaildEndDate">
						{{ruleObj.vaildStartDate + '~长期'}}</view>
					<view class="modal-text-right" v-if="!ruleObj.vaildStartDate && !ruleObj.vaildEndDate">长期有效</view>
				</view>
				<view class="modal_top modal_con">
					<view class="modal-text">注意事项：</view>
					<view class="modal-text-scope" style="padding-bottom: 30rpx;">每笔订单限用一张优惠券；成功下单后优惠券即作废，申请退款后无法退券；每日限领{{ruleObj.scrambleNum}}张</view>
				</view>
			</scroll-view>

			<view class="modal_btm">
				<!-- <view catchtap="cancel">取消</view> -->
				<!-- <button catchtap="confirm" open-type="share" data-item="{{item}}">确认</button> -->
				<view class="btnLeftContainer" @tap.stop="cancel">
					<text>我知道了</text>
				</view>
			</view>
		</view>
		<view class="no-data-box" v-if="noData">
			<image class="noData"  src="/static/images/noData.png" mode="widthFix"></image>
			<view class="">暂无数据</view>
		</view>
		<view style="position: fixed; bottom: 80rpx; right: 10rpx" @click="goApp">
		  <image style="width: 80px; height: 80px;" src="/static/images/jym/community.png"></image>
		</view>
	</view>
</template>

<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>

<script>
	const app = getApp(); // pages/motorcade/motorcadeIndex/motorcadeIndex.js
	// pages/motorcade/motorcadeIndex/motorcadeIndex.js
	var api = require("@/config/api.js");
	var util = require("@/utils/jym-utils/util.js");
	var ctx = ""; // 用于获取canvas
	// 用于获取canvas
	var leftMargin = ""; //文字距离左边边距
	//文字距离左边边距
	var topMargin = ""; //文字距离右边边距
	//文字距离右边边距
	let pageStart = 1;
	import tab from "@/components/jym-components/tab/index";
	import scroll from "@/components/jym-components/scroll/index";
	import * as publicData from "@/utils/publicData";
	export default {
		data() {
			return {
				showModal: false,
				inputValue: null,
				tabTitles: ["未使用", "已使用", "已过期"],
				tabCurrent: 0,
				//当前选中的标签类型
				duration: 300,
				// swiper-item 切换过渡时间
				currentTab: 0,
				// 当前数据列索引
				categoryMenu: [],
				// 分类菜单数据, 字符串数组格式
				requesting1: false,
				forwardList: [],
				listData1: [],
				emptyShow1: false,
				requesting2: false,
				listData2: [],
				emptyShow2: false,
				requesting3: false,
				listData3: [],
				emptyShow3: false,
				onShare: "onShare",
				onShare1: "onShare1",
				imageUrl1: "https://cargocn.oss-cn-beijing.aliyuncs.com/6f576887869949f4a993ddc070044a2a.png",
				imageUrl2: "https://cargocn.oss-cn-beijing.aliyuncs.com/20200905213558.png",
				forwardId: 0,
				showModal: false,
				canvasWidth: '',
				// canvas宽度
				canvasHeight: '',
				// canvas高度
				imagePath: '',
				// 分享的图片路径
				couponImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/coupon_cy.png",
				couponImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/coupon_qy.png",
				couponImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/coupon_yg.png",
				couponForward: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_my_coupon_yellow.png",
				couponForward1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_my_coupon.png",
				couponForward2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_my_coupon_green.png",
				couponColor: '#F7A129',
				couponColor1: '#6D9AED',
				couponColor2: '#6ac5d0',
				rule: '' //使用规则
					,
				ruleObj: {},
				storageData: [],
				swipeHeight: 0,
				latitude: '',
				longitude: '',
				pageNum: 1,
				total: 0,
				noData: false,
				activeAdvObj: null,
				advList: [
					{typeName: '加油么领券', key: 'JYLQ', info: []}
				],
			};
		},

		components: {
			tab,
			scroll
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			that.$store.dispatch('getJymLQAdv').then(fleetAdvRes => {
				console.log(fleetAdvRes)
				that.advList.forEach((itemOne) => {
					fleetAdvRes.forEach(itemTwo =>{
						if(itemTwo.advLocation.indexOf(itemOne.key) != -1){
							itemOne.info.push(itemTwo)
						}
					})
				})
				that.setActiveAdv('加油么领券')
			})
			uni.getLocation({
				success: function(res) {
					console.log(res)
					that.latitude = res.latitude;
					that.longitude = res.longitude;
					that.requestList(1);
				},
				fail() {
					uni.showToast({
						title: '获取位置失败',
						icon: 'none'
					})
				}
			})

			// if (options.flag == 1) {
			//   uni.removeStorage({
			//     key: 'getCoupons',
			//     success: function (res) {
			//       that.storageData = [];
			//     }
			//   });
			// }
		},
		onPullDownRefresh: function() {
			this.pageNum = 1;
			console.log('hhhhhhhhh')
			this.requestList(1, 'refresh');
		},
		onReachBottom() {
			// 上拉加载
			if (this.total == this.listData1.length) {
				return;
			}
			this.pageNum = this.pageNum + 1;
			this.requestList(1, 'more');
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onHide() {
			//  let that = this; 
			// that.listData1 = []
			// that.listData2 = []
			// that.listData3 = []
		},
		onShow: function() {
			// let that = this;
			// that.listData1 = []
			// that.listData2 = []
			// that.listData3 = []
			// that.tabCurrent = 0;
			// }
		},
		methods: {
			showBigBanner(item, img) {
				if(item.linkType == 'not'){
					uni.previewImage({
						urls: [item.advUrl],
						success: function(data) {
							console.log(data);
						},
						fail: function(err) {
							console.log(err);
						}
					});
				}else if(item.linkType == 'route'){
					uni.navigateTo({
						url: item.linkUrl
					})
				}else{
					getApp().globalData.promoteLinkUrl = item.linkUrl;
					uni.navigateTo({
						url: '../../advertisingH5/advertisingH5'
					})
				}
			},
			setActiveAdv(typeName){
				let that = this 
				let activeAdvObj = {}
				that.advList.some(item => {
					if(item.typeName == typeName){
						activeAdvObj.typeName = item.typeName
						activeAdvObj.key = item.key
						activeAdvObj.info = ['','']
						item.info.forEach(infoItem => {
							if(infoItem.advLocation.indexOf('SMALL') != -1){
								activeAdvObj.info[0] = JSON.parse(JSON.stringify(infoItem))
							}
							if(infoItem.advLocation.indexOf('BIG') != -1){
								activeAdvObj.info[1] = JSON.parse(JSON.stringify(infoItem))
							}
						})
						return true
					}
				})
				that.activeAdvObj = activeAdvObj
				console.log('当前显示的广告当前显示的广告当前显示的广告当前显示的广告当前显示的广告',that.activeAdvObj)
			},
			goApp() {
			  publicData.goDriverApp()
			},
			clickUse(e) {
				console.log(e,'clickUse')
				var that = this;
				var parma = {
					id: e.currentTarget.dataset.item.id
				}
				console.log(parma);
				util.postRequest(api.getCoupon, parma).then(function(res) {
					console.log(res)
					if (res.retCode == '0000000') {
						// that.requestList(1);
						uni.showToast({
							title: '领取成功',
							icon: 'none'
						});
						console.log(res)
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				});
			},

			cancel() {
				this.showModal = false;
			},

			confirm() {
				this.showModal = false;
			},

			refresh1() {
				console.log('123dfdfdfgdfgsdfbsdfbvsdfbvsdfv')
				this.requestList(1);
			},

			refresh2() {
				this.requestList(2);
			},

			refresh3() {
				this.requestList(3);
			},

			requestList(status, type) {
				const parma = {
					stationInfo: {
						longitude: this.longitude,
						latitude: this.latitude,
					},
					size: 10,
					num: this.pageNum,
				};
				const that = this;
				console.log(parma)
				that.changeRequestStatus(status);
				util.postRequest(api.getCouponList, parma).then(function(res) {
					console.log(res)
					uni.stopPullDownRefresh()
					that.changeResponseStatus();

					if (res.retCode == '0000000') {
						const list = res.rspBody.items;
						that.total = res.rspBody.total;
						console.log(list);
						that.swipeHeight = (list.length + 2) * 196
						that.$forceUpdate()
						that.changeEmpty(status, list, type);
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				});
			},

			changeRequestStatus(status) {
				var that = this;

				if (status == 1) {
					that.requesting1 = true;
				} else if (status == 2) {
					that.requesting2 = true;
				} else {
					that.requesting3 = true;
				}
			},

			changeResponseStatus() {
				this.requesting1 = false;
				this.requesting2 = false;
				this.requesting3 = false;
			},

			changeEmpty(status, list, type) {
				if (status == 1) {
					if (list.length > 0) {
						this.emptyShow1 = false;
						// this.listData1 = list;
						if(type == 'refresh'){
							this.listData1 = []
							setTimeout(() => {
								this.listData1 = list;
							}, 200)
						} else {
							this.listData1 = this.listData1.concat(list);
						}

					} else {
						this.emptyShow1 = true;
						this.listData1 = [];
						this.noData = true;
					}
				} else if (status == 2) {
					if (list.length > 0) {
						this.emptyShow2 = false;
						this.listData2 = []
						setTimeout(() => {
							this.listData2 = list;
						}, 100)
					} else {
						this.emptyShow2 = true;
						this.listData2 = [];
					}
				} else {
					if (list.length > 0) {
						this.emptyShow3 = false;
						this.listData2 = []
						setTimeout(() => {
							this.listData3 = list;
						}, 100)
					} else {
						this.emptyShow3 = true;
						this.listData3 = [];
					}
				}
				this.$forceUpdate();
			},

			/**
			 * 弹窗
			 */
			showDialogBtn: function(e) {
				console.log(e);
				let params = {
					id: e.currentTarget.dataset.id
				};
				util.postRequest(api.getCouponInfor, params).then(res => {
					if (res.retCode == '0000000') {
						console.log(res.rspBody)
						this.rule = res.rspBody.rule;
						this.ruleObj = res.rspBody;
						this.showModal = true;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				}); // this.setData({
				//     showModal: true
				// })
			},

			/**
			 * 弹出框蒙层截断touchmove事件
			 */
			preventTouchMove: function() {
				return;
			},

			/**
			 * 隐藏模态对话框
			 */
			hideModal: function() {
				this.showModal = false;
			},

			/**
			 * 对话框取消按钮点击事件
			 */
			onCancel: function() {
				this.hideModal();
			},

			/**
			 * 对话框确认按钮点击事件
			 */
			onConfirm: function() {
				this.hideModal();
			},

			/**
			 * 获取输入框中输入的值
			 */
			inputChange: function(option) {
				/* 把文本框输入的内容方到 data 里面 */
				this.inputValue = option.detail.value;
			},
			preventTouchMove: function() {
				return;
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./market.css";
</style>
