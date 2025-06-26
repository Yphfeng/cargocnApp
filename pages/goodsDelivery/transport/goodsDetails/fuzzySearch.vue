<template>
	<view class="fuzzySearch">
		<view class="searchHead">
			<view class="headBox">
				<image @tap="toBack" class="backIcon" src="../../../../static/images/back.png"></image>
				<view class="inputBox">
					<image class="rightSearch" src="../../../../static/images/goodsDelivery/search.png" @tap="toSearch()"></image>
					<input class="searchInput" type="text" confirm-type="search" v-model="searchVal" placeholder="请输入" @input="onInput" @confirm="toSearch()" />
					<view style="width: 36rpx;height: 36rpx;">
						<image v-show="searchVal" class="cancelSearchIcon" src="../../../../static/images/goodsDelivery/closeAddressPopup.png" @click="searchVal = '', toSearch()"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="searchHistoryBox">
			<text class="searchRecord">历史记录</text>
			<view class="banGoods" @tap="showHintPopup">
				<image class="banIcon" src="../../../../static/images/goodsDelivery/doubtIcon.png"></image>
				禁止运输货物
			</view>
		</view>
		<view class="historyBox historyBoxDefault">
			<view id="scrollBox" class="historyGoodsBox defaultGoods" v-if="goodsHistory && goodsHistory.length != 0">
				<view
					class="historyGoods"
					v-for="(item, index) in goodsHistory"
					:key="index"
					:style="checkHistoryRepeat(item.children['0'].children['0'].children['0'].sid) ? 'background: linear-gradient(90deg, #60B6FA 0%, #4AA2F3 100%);color: #FFF;' : 'background: #F4F4F4;color: #333;'"
					@tap="changeGoodsList(item.children['0'].children['0'].children['0'].sid, item)">
					{{item.typeName + '-'}}{{item.children['0'].children['0'].children['0'].typeName}}
				</view>
			</view>
			<view v-if="goodsHistory && goodsHistory.length == 0" style="line-height:44rpx;font-size: 24rpx;color:#777;">暂无历史记录</view>
			<view class="showMoreHistoryBtn" style="margin-left:16rpx;"  @tap="jumpToSearchGoods()">
				<view class="btnMsg">更多</view>
				<image class="showHistoryIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/showHistoryIcon.png"></image>
			</view>
		</view>
		
		<view class="searchListBox">
			<view class="listBox" v-for="(item, index) in searchInfo" :key="index">
				<view class="content" @click="chooseSearchItem(item)">
					<image class="contentIcon" src="../../../../static/images/goodsDelivery/search.png"></image>
					<view class="msg">
						<!-- {{item.typeName + '-'}} -->
						
						<!-- {{changeMsgColor(item.children['0'].children['0'].children['0'].typeName)}} -->
						<rich-text :nodes="changeMsgColor(item.typeName, item.children['0'].children['0'].children['0'].typeName)"></rich-text>
					<!-- {{showItemMsg(item)}} -->
					</view>
				</view>
			</view>
			<view class="listBox" v-show="noData && diyVal">
				<view class="content" @click="chooseDiyData">
					<image class="contentIcon" src="../../../../static/images/goodsDelivery/search.png"></image>
					<view class="msg">{{diyVal}}</view>
				</view>
				<view class="diyHint" @click="chooseDiyData">自定义货物</view>
			</view>
		</view>
		
		<view class="loadingBox" v-show="isLoading">
			<image class="loadingImg" src="../../../../static/images/goodsDelivery/listLoading.png"></image>
			正在加载中…
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				searchVal: '',
				searchInfo: [],
				noData: false,
				goodsTypeVo: [],
				goodsListData: [],
				showGoodsHistory: false,
				goodsHistory: [],
				historyInfo: [],
				isLoading: false,
				timeOutObj: '',
				diyVal: ''
			};
		},
		onLoad() {
			this.goodsHistory = uni.getStorageSync('sendGoodsData') ? uni.getStorageSync('sendGoodsData') : [];
			// console.log(this.goodsHistory);
		},
		onShow() {
			let obj = {};
			obj = getApp().globalData.goodsVo;
			let ary = [];
			let goodsTypeVo = getApp().globalData.goodsTypeVo;
			// if(goodsTypeVo.length > 0) {
			// 	ary = goodsTypeVo;
			// }else if(obj.sid) {
			// 	ary = obj.goodsVO.goodsTypeVO;
			// 	getApp().globalData.goodsTypeVo = obj.goodsVO.goodsTypeVO;
			// }
			ary = goodsTypeVo;
			// console.log('物品信息', ary);
			this.goodsTypeVo = [];
			this.goodsListData = [];
			if(ary.length > 0) {
				for(let i in ary) {
					this.goodsTypeVo.push(ary[i]);
					this.searchVal = this.goodsTypeVo['0'].children['0'].children['0'].children['0'].typeName;
				}
			}
		},
		methods: {
			onInput(e) {
				console.log(e);
				clearTimeout(this.timeOutObj);
				let that = this;
				that.timeOutObj = setTimeout(() => {
					console.log('search');
					that.toSearch();
				}, 1000);
			},
			chooseDiyData() { // 选择自定义货物
				let ary = [{
					typeName: '自定义',
					sid: 'diy1',
					children: [{
						typeName: '自定义',
						sid: 'diy2',
						children: [{
							typeName: '自定义',
							sid: 'diy3',
							children: [{
								typeName: this.searchVal,
								sid: 'diy4'
							}]
						}]
					}]
				}];
				// console.log('自定义数组', ary);
				getApp().globalData.goodsTypeVo = [];
				getApp().globalData.goodsTypeVo.push(ary['0']);
				this.toBack();
			},
			chooseSearchItem(item) { // 选择搜索到的货物
				this.searchVal = item.children['0'].children['0'].children['0'].typeName;
				getApp().globalData.goodsTypeVo = [];
				getApp().globalData.goodsTypeVo.push(item);
				this.toBack();
			},
			toSearch() { // 搜索
				// if(!utils.btnRepeat()) return false; // 防抖
				if(!this.searchVal) {
					this.searchInfo = []
					this.noData = false;
					this.diyVal = '';
					return false;
				}
				clearTimeout(this.timeOutObj);
				this.searchInfo = [];
				this.isLoading = true;
				let that = this;
				utils.postRequest('/ts/goods/type/getByTypeName?typeName=' + that.searchVal, {}, 'GET')
				.then(res=>{
					console.log('搜索详细', res);
					if(res.retCode == "0000000") {
						let items = res.rspBody.items;
						if(items && items.length == 0) {
							that.isLoading = false;
							that.diyVal = that.searchVal ? that.searchVal : '';
							that.noData = true;
						}else {
							for(let a in items) {
								for(let b in items[a].children) {
									for(let c in items[a].children[b].children) {
										for(let d in items[a].children[b].children[c].children) {
											let obj = {
												"state": items[a].state,
												"createdDt": items[a].createdDt,
												"version": items[a].version,
												"sid": items[a].sid,
												"createBy": items[a].createBy,
												"typeName": items[a].typeName,
												"typeLevel": items[a].typeLevel,
												"typeOrder": items[a].typeOrder,
												"parentSid": items[a].parentSid,
												"isDefault": items[a].isDefault,
												"children": [{
													"state": items[a].children[b].state,
													"createdDt": items[a].children[b].createdDt,
													"version": items[a].children[b].version,
													"sid": items[a].children[b].sid,
													"createBy": items[a].children[b].createBy,
													"typeName": items[a].children[b].typeName,
													"typeLevel": items[a].children[b].typeLevel,
													"typeOrder": items[a].children[b].typeOrder,
													"parentSid": items[a].children[b].parentSid,
													"isDefault": items[a].children[b].isDefault,
													"children": [{
														"state": items[a].children[b].children[c].state,
														"createdDt": items[a].children[b].children[c].createdDt,
														"version": items[a].children[b].children[c].version,
														"sid": items[a].children[b].children[c].sid,
														"createBy": items[a].children[b].children[c].createBy,
														"typeName": items[a].children[b].children[c].typeName,
														"typeLevel": items[a].children[b].children[c].typeLevel,
														"typeOrder": items[a].children[b].children[c].typeOrder,
														"parentSid": items[a].children[b].children[c].parentSid,
														"isDefault": items[a].children[b].children[c].isDefault,
														"children": [{
															"state": items[a].children[b].children[c].children[d].state,
															"createdDt": items[a].children[b].children[c].children[d].createdDt,
															"version": items[a].children[b].children[c].children[d].version,
															"sid": items[a].children[b].children[c].children[d].sid,
															"createBy": items[a].children[b].children[c].children[d].createBy,
															"typeName": items[a].children[b].children[c].children[d].typeName,
															"typeLevel": items[a].children[b].children[c].children[d].typeLevel,
															"typeOrder": items[a].children[b].children[c].children[d].typeOrder,
															"parentSid": items[a].children[b].children[c].children[d].parentSid,
															"isDefault": items[a].children[b].children[c].children[d].isDefault,
														}]
													}]
												}]
											}
											that.searchInfo.push(obj);
										}
									}
								}
							}
							that.isLoading = false;
							console.log(that.searchInfo);
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					that.isLoading = false;
					console.log(err);
				})
			},
			changeGoodsList(sid, item) { // 点击历史货物时判断是否有重复，有则做删除处理，无则做添加处理
				let key = this.checkHistoryRepeat(sid);
				if(key) {
					this.deleteGoods(key);
				}else {
					this.goodsTypeVo = [];
					this.goodsTypeVo.push(item);
					getApp().globalData.goodsTypeVo = this.goodsTypeVo;
					console.log(this.goodsTypeVo);
					this.searchVal = this.goodsTypeVo['0'].children['0'].children['0'].children['0'].typeName;
					this.toBack();
				}
				this.$forceUpdate();
			},
			showItemMsg(item) { // 展示货物名称，sid=12为绿通
				// console.log(item);
				let typeName = item.children['0'].children['0'].children['0'].typeName;
				return item.typeName + '-' + typeName;
			},
			checkHistoryRepeat(sid) {
				for(let i in this.goodsTypeVo) {
					if(this.goodsTypeVo[i].children['0'].children['0'].children['0'].sid == sid) {
						return i
					}
				}
			},
			toBack() {
				uni.navigateBack();
			},
			jumpToSearchGoods() {
				uni.navigateTo({
					url: './searchGoods'
				})
			},
			showHintPopup() {
				uni.navigateTo({
					url: '../../../allAgreement/carrierSpecification'
				})
			},
			changeMsgColor(typeName, msg) {
				var reg = new RegExp("(" + this.searchVal + ")", "g");
				var newstr = msg.replace(reg, "<span style='font-size:28rpx;color:#4AA2F3;'>$1</span>");
				var returnStr = "<span style='font-size:28rpx;color:#333;'>" + typeName + '-' + newstr + "</span>";
				return returnStr;
			}
		}
	}
</script>

<style lang="scss">
	.fuzzySearch {
		.searchHead {
			height: 206rpx;
			.headBox {
				padding: 106rpx 32rpx 0 30rpx;
				text-align: center;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.backIcon {
					width: 22rpx;
					height: 40rpx;
					margin-right:40rpx;
				}
				.inputBox {
					flex: 1;
					display: flex;
					align-items: center;
					padding: 0 20rpx;
					height: 70rpx;
					border-radius: 35rpx;
					border: 2rpx solid #4AA2F3;
					.rightSearch {
						width: 34rpx;
						height: 34rpx;
						margin-right:16rpx;
					}
					.searchInput {
						flex: 1;
						height: 100rpx;
						font-size: 30rpx;
						color: #333333;
						text-align: left;
					}
					.cancelSearchIcon {
						width: 36rpx;
						height: 36rpx;
					}
				}
			}
		}
		.searchHistoryBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top:24rpx;
			padding: 0 32rpx 0 44rpx;
			.searchRecord {
				font-size: 26rpx;
				color: #333333;
			}
			.banGoods {
				display: flex;
				align-items: center;
				font-size: 22rpx;
				color: #999999;
				.banIcon {
					width:22rpx;
					height: 22rpx;
					margin-right:10rpx;
				}
			}
		}
		.historyBox {
			overflow: hidden;
			padding: 14rpx 32rpx 0 44rpx;
			.showMoreHistoryBtn {
				display: flex;
				align-items: center;
				.btnMsg {
					font-size: 22rpx;
					color: #333333;
					line-height: 32rpx;
				}
				.showHistoryIcon {
					width: 22rpx;
					height: 20rpx;
					margin-left:6rpx;
					transform:rotate(270deg);
				}
			}
		}
		.historyBoxDefault {
			display: flex;
			justify-content: space-between;
			height: 44rpx;
			transition: height ease-out 0.3s;
		}
		.defaultGoods {
			max-height: 44rpx;
			flex-wrap: nowrap;
			overflow: hidden;
		}
		.historyGoodsBox {
			flex: 1;
			display: flex;
			justify-content: flex-start;
			align-content: flex-start;
			.historyGoods {
				height: 44rpx;
				line-height: 44rpx;
				padding: 0 24rpx;
				border-radius: 35rpx;
				margin-right: 16rpx;
				font-size: 22rpx;
				font-weight: 400;
				flex-shrink: 0;
			}
		}
		.searchListBox {
			padding:  34rpx 30rpx 0 32rpx;
			.listBox + .listBox {
				margin-top: 30rpx;
			}
			.listBox {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.content {
					flex: 1;
					display: flex;
					align-items: center;
					.contentIcon {
						width: 34rpx;
						height: 34rpx;
						margin-right:24rpx;
					}
					.msg {
						font-size: 28rpx;
						color: #333333;
						line-height: 40rpx;
					}
				}
				.diyHint {
					font-size: 28rpx;
					color: #AAAAAA;
					line-height: 40rpx;
					padding-left:32rpx;
				}
			}
		}
		.loadingBox {
			padding:30rpx;
			font-size:28rpx;
			color:#999;
			display: flex;
			justify-content: center;
			align-items: center;
			.loadingImg {
				width:36rpx;
				height: 36rpx;
				margin-right:20rpx;
		        -webkit-animation: rotating 2s infinite;
		        animation: rotating 2s infinite;
			}
			.noDataIcon {
				width: 244rpx;
				height: 246rpx;
				margin-top:200rpx;
			}
		}
		@keyframes rotating {
		    0% {
		        transform:rotate(0deg);
		    }
		    100% {
		        transform:rotate(360deg);
		    }
		}
	}
</style>
