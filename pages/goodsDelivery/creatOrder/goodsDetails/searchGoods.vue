<template>
	<view class="searchGoodsPage">
		<!-- 搜索跳转、物品的历史记录 -->
		<view class="goodsNameBox" id="searchHead">
			<view class="goodsSearchBox">
				<view class="searchMsg" v-if="goodsFlag && goodsFlag.length == 0">
					<image class="icon" src="../../../../static/images/goodsDelivery/search.png"></image>
					<text class="msg">搜索的物品</text>
				</view>
				<view class="selectedGoodsBox" v-if="goodsFlag && goodsFlag.length > 0">
					<view class="goodsList" v-for="(selectedItem, sIndex) in goodsFlag" :key="sIndex">
						<text class="name">{{selectedItem.typeName}}</text>
						<image class="deleteIcon" src="../../../../static/images/goodsDelivery/deleteGoods.png" @tap="deleteGoods(selectedItem, sIndex)"></image>
					</view>
				</view>
				<text class="searchHint">至多选择一项</text>
			</view>
			<view class="searchHistoryBox">
				<text class="searchRecord"></text>
				<view class="banGoods" @tap="showHintPopup">
					<image class="banIcon" src="../../../../static/images/goodsDelivery/doubtIcon.png"></image>
					禁止运输货物
				</view>
			</view>
			<view class="searchTypeGroup">
				<view
					class="typeBox"
					v-for="(item, index) in allGoodsData"
					:key="index"
					@tap="selectType(item)"
					:class="selectTypeFlag == item.sid ? 'typeChecked' : 'typeDefault'">
					{{item.typeName}}
					<view class="checkedLine" v-show="selectTypeFlag == item.sid"></view>
				</view>
			</view>
		</view>
		
		<!-- 主要搜索内容模块 -->
		<view class="searchDetails">
			<view class="categoryList" :style="bodyPaddingTop + bodyPaddingBottom">
				<view
					class="goodsCategory"
					v-for="(item, index) in categoryData"
					:key="index"
					@tap="chooseGoodsCategory(item)"
					:class="categoryFlag == item.sid ? 'categoryChecked' : 'categoryDefault'">
					<view class="categoryLine"></view>
					<view class="categoryMsg">{{item.typeName}}</view>
				</view>
			</view>
			<view class="contentModel" :style="bodyPaddingTop + bodyPaddingBottom">
				<view class="categoryDetails" v-for="(item, index) in goodsData" :key="index">
					<view class="subTitle">{{item.typeName}}</view>
					<view class="categoryNameBox">
						<view
							class="categoryName"
							v-for="(goodsItem, goodsKey) in item.children"
							:key="goodsKey"
							:class="checkRepeat(goodsItem.sid) ? 'categoryNameChecked' : 'categoryNameDefault'"
							@tap="chooseCategory(goodsItem, item)">
							{{goodsItem.typeName}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 物品保存模块 -->
		<view class="footBtnGroup" id="searchFoot">
			<view class="saveBtn" @tap="confirmGoodsMsg()">确认信息</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				selectTypeFlag: '',
				bodyPaddingTop: '',
				bodyPaddingBottom: '',
				bodyHeight: '',
				allGoodsData: [],
				categoryData: [],
				goodsData: [],
				goodsFlag: [],
				firstObj: {},
				secondObj: {},
				checkedGoodsFlag: [],
				categoryFlag: ''
			};
		},
		onLoad() {
			let obj1 = {
				a: 1
			}
			let obj2 = Object.assign({}, obj1);
			obj2.a = 2;
			console.log('原始obj',obj1);
			
			uni.showLoading({
			    title: '加载中'
			});
			this.getAllGoodsInfo();
		},
		onShow() {
			let ary = [];
			ary = getApp().globalData.goodsTypeVo;
			this.checkedGoodsFlag = [];
			this.goodsFla = [];
			if(ary.length > 0) {
				for(let i in ary) {
					this.checkedGoodsFlag.push(ary[i]);
					for(let a in ary[i].children) {
						for(let b in ary[i].children[a].children) {
							for(let c in ary[i].children[a].children[b].children) {
								this.goodsFlag.push(ary[i].children[a].children[b].children[c])
							}
						}
						
					}
				}
			}
		},
		onReady() { // 获取头部及底部fixed模块的高度，中间内容高度固定并给予获取到的模块的高度值相等的padding
			// uniapp BUG 多次使用SelectorQuery属性时uni.createSelectorQuery().in(this);的对象不可使用同一个，否则会重复获取第一个节点信息
			let that = this;
			var topQuery = uni.createSelectorQuery().in(this);
			topQuery.select('#searchHead').boundingClientRect(data => {
			  var headModelHeight = data.height;
			  // padding-top需加上头部的阴影距离12rpx
			  that.bodyPaddingTop = 'padding-top:' + (headModelHeight * 2 + 12) + 'rpx;';
			  // console.log('头部模块高度', that.bodyPaddingTop);
			}).exec();
			var bottomQuery = uni.createSelectorQuery().in(this);
			bottomQuery.select('#searchFoot').boundingClientRect(data => {
			  var footModelHeight = data.height;
			  // padding-bottom需加上底部的阴影距离8rpx 以及防止底部选择框贴底多加20rpx
			  that.bodyPaddingBottom = 'padding-bottom:' + (footModelHeight * 2 + 28) + 'rpx;';
			  // console.log('底部模块高度', that.bodyPaddingBottom);
			}).exec();
		},
		methods: {
			getAllGoodsInfo() {
				let params = {
					typeLevel: undefined,
					parentSid: undefined,
					typeName: undefined,
				}
				console.log('物品列表请求参数', params);
				utils.postRequest('/ts/goods/type/get', params)
				.then(res=>{
					// console.log('物品列表', res);
					if(res.retCode == '0000000') {
						this.allGoodsData = res.rspBody.items;
						this.selectTypeFlag = this.allGoodsData[0].sid;
						let obj = {
							sid: this.allGoodsData[0].sid,
							typeName: this.allGoodsData[0].typeName,
							typeLevel: this.allGoodsData[0].typeLevel,
							parentSid: this.allGoodsData[0].parentSid,
							isDefault: this.allGoodsData[0].isDefault,
							children: []
						};
						this.firstObj = Object.assign({}, obj);
						for(let i in this.allGoodsData[0].children) {
							this.categoryData.push(this.allGoodsData[0].children[i]);
						}
						this.secondObj = Object.assign({}, this.categoryData[0].children[0]);
						this.categoryFlag = this.categoryData[0].sid;
						for(let a in this.categoryData[0].children) {
							this.goodsData.push(this.categoryData[0].children[a]);
						}
						// for(let i in this.allGoodsData) {
						// 	if(this.allGoodsData[i].isDefault == 1) {
						// 		this.selectTypeFlag = this.allGoodsData[i].sid;
						// 		break;
						// 	}
						// }
						this.$forceUpdate();
					}else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
					uni.hideLoading();
				})
				.catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
			},
			selectType(item) { // 一级分类选择
				if(this.selectTypeFlag != item.sid) {
					let obj = {
						sid: item.sid,
						typeName: item.typeName,
						typeLevel: item.typeLevel,
						parentSid: item.parentSid,
						isDefault: item.isDefault,
						children: []
					};
					this.firstObj = Object.assign({}, obj);
					this.selectTypeFlag = item.sid;
					this.categoryData = [];
					this.goodsData = [];
					if(item.children) {
						for(let i in item.children) {
							this.categoryData.push(item.children[i]);
						}
						let obj2 = {
							sid: this.categoryData[0].sid,
							typeName: this.categoryData[0].typeName,
							typeLevel: this.categoryData[0].typeLevel,
							parentSid: this.categoryData[0].parentSid,
							isDefault: this.categoryData[0].isDefault,
							children: []
						};
						this.secondObj = Object.assign({}, obj2);
						this.categoryFlag = this.categoryData[0].sid;
						for(let a in this.categoryData[0].children) {
							this.goodsData.push(this.categoryData[0].children[a]);
						}
					}
					console.log(this.firstObj);
					console.log(this.secondObj);
					this.$forceUpdate();
				}
			},
			chooseGoodsCategory(item) { // 二级分类选择
				if(this.categoryFlag != item.sid) {
					let obj = {
						sid: item.sid,
						typeName: item.typeName,
						typeLevel: item.typeLevel,
						parentSid: item.parentSid,
						isDefault: item.isDefault,
						children: []
					};
					this.secondObj = Object.assign({}, obj);
					this.categoryFlag =  item.sid;
					this.goodsData = [];
					if(item.children) {
						for(let i in item.children) {
							this.goodsData.push(item.children[i]);
						}
					}
					this.$forceUpdate();
				}
			},
			deleteGoods(item, key) { // 删除已选中物品
				this.goodsFlag.splice(key, 1);
				this.checkedGoodsFlag.splice(key, 1);
				this.$forceUpdate();
			},
			chooseCategory(goodsItem, items) { // 四级物品选择(最多3个)
				this.goodsFlag = [];
				this.checkedGoodsFlag = [];
				this.goodsFlag.push(goodsItem);
				let firstObj = {
					sid: this.firstObj.sid,
					typeName: this.firstObj.typeName,
					typeLevel: this.firstObj.typeLevel,
					parentSid: this.firstObj.parentSid,
					isDefault: this.firstObj.isDefault,
					children: []
				};
				let secondObj = {
					sid: this.secondObj.sid,
					typeName: this.secondObj.typeName,
					typeLevel: this.secondObj.typeLevel,
					parentSid: this.secondObj.parentSid,
					isDefault: this.secondObj.isDefault,
					children: []
				};
				let thirdObj = {
					sid: items.sid,
					typeName: items.typeName,
					typeLevel: items.typeLevel,
					parentSid: items.parentSid,
					isDefault: items.isDefault,
					children: []
				};
				let fourthObj = {
					sid: goodsItem.sid,
					typeName: goodsItem.typeName,
					typeLevel: goodsItem.typeLevel,
					parentSid: goodsItem.parentSid,
					isDefault: goodsItem.isDefault,
				};
				thirdObj.children.push(fourthObj);
				secondObj.children.push(thirdObj);
				firstObj.children.push(secondObj)
				this.checkedGoodsFlag.push(firstObj);
				// if(this.checkRepeat(goodsItem.sid)) {
				// 	for(let i in this.goodsFlag) {
				// 		if(this.goodsFlag[i].sid == goodsItem.sid) {
				// 			this.goodsFlag.splice(i, 1);
				// 			break;
				// 		}
				// 	}
				// 	for(let b in this.checkedGoodsFlag) {
				// 		if(this.checkedGoodsFlag[b].sid == this.firstObj.sid) {
				// 			this.checkedGoodsFlag.splice(b, 1);
				// 			break;
				// 		}
				// 	}
				// }else {
				// 	if(this.goodsFlag.length == 3) {
				// 		uni.showToast({
				// 		    title: '最多选择3种物品',
				// 			icon: 'none',
				// 		    duration: 2000
				// 		});
				// 		return false;
				// 	}
				// 	this.goodsFlag.push(goodsItem);
				// 	let firstObj = {
				// 		sid: this.firstObj.sid,
				// 		typeName: this.firstObj.typeName,
				// 		typeLevel: this.firstObj.typeLevel,
				// 		parentSid: this.firstObj.parentSid,
				// 		isDefault: this.firstObj.isDefault,
				// 		children: []
				// 	};
				// 	let secondObj = {
				// 		sid: this.secondObj.sid,
				// 		typeName: this.secondObj.typeName,
				// 		typeLevel: this.secondObj.typeLevel,
				// 		parentSid: this.secondObj.parentSid,
				// 		isDefault: this.secondObj.isDefault,
				// 		children: []
				// 	};
				// 	let thirdObj = {
				// 		sid: items.sid,
				// 		typeName: items.typeName,
				// 		typeLevel: items.typeLevel,
				// 		parentSid: items.parentSid,
				// 		isDefault: items.isDefault,
				// 		children: []
				// 	};
				// 	let fourthObj = {
				// 		sid: goodsItem.sid,
				// 		typeName: goodsItem.typeName,
				// 		typeLevel: goodsItem.typeLevel,
				// 		parentSid: goodsItem.parentSid,
				// 		isDefault: goodsItem.isDefault,
				// 	};
				// 	thirdObj.children.push(fourthObj);
				// 	secondObj.children.push(thirdObj);
				// 	firstObj.children.push(secondObj)
				// 	this.checkedGoodsFlag.push(firstObj);
				// }
			},
			checkRepeat(val) { // 检查重复值
				if(this.goodsFlag.length > 0) {
					for(let i in this.goodsFlag) {
						if(this.goodsFlag[i].sid == val) {
							return true;
						}
					}
				}
			},
			confirmGoodsMsg() { // 确认物品信息
				console.log('确认物品信息', this.checkedGoodsFlag)
				getApp().globalData.goodsTypeVo = [];
				for(let i in this.checkedGoodsFlag) {
					getApp().globalData.goodsTypeVo.push(this.checkedGoodsFlag[i]);
				}
				uni.navigateBack();
			},
			showHintPopup() {
				uni.navigateTo({
					url: '../../../allAgreement/carrierSpecification'
				})
				// this.$refs.hintPopup.open();
			}
		}
	}
</script>

<style lang="scss">
	.searchGoodsPage {
		.goodsNameBox {
			padding: 16rpx 32rpx 0 32rpx;
			background-color: #FFF;
			position: fixed;
			top: 0;
			width: 686rpx;
			border-radius: 0px 0px 24rpx 24rpx;
			box-shadow: 0px 2rpx 12rpx -2rpx rgba(152,152,152,0.36);
			.goodsSearchBox {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 70rpx;
				background: #F0EFEF;
				border-radius: 35rpx;
				padding:0 20rpx;
				.searchMsg {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.icon {
						width:40rpx;
						height: 40rpx;
					}
					.msg {
						font-size: 28rpx;
						font-weight: 400;
						color: #AAAAAA;
						margin-left:22rpx;
					}
				}
				.selectedGoodsBox {
					display: flex;
					align-items: center;
					.goodsList + .goodsList {
						margin-left:16rpx;
					}
					.goodsList {
						padding: 6rpx 16rpx;
						background: linear-gradient(90deg, #60B6FA 0%, #4AA2F3 100%);
						border-radius: 35rpx;
						display: flex;
						align-items: center;
						.name {
							font-size: 22rpx;
							color: #FFFFFF;
						}
						.deleteIcon {
							width: 16rpx;
							height: 16rpx;
							margin-left:12rpx;
						}
					}
				}
				.searchHint {
					font-size: 20rpx;
					font-weight: 400;
					color: #999999;
				}
			}
			.searchHistoryBox {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top:24rpx;
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
			.searchTypeGroup {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				height: 100rpx;
				padding: 0 100rpx 0 100rpx;
				.typeBox {
					width: 98rpx;
					text-align: center;
					
					.checkedLine {
						width: 98rpx;
						height: 8rpx;
						background: #4AA2F3;
						box-shadow: 2rpx 0px 4rpx 0px rgba(68,154,224,0.36);
						border-radius: 0px 4rpx 4rpx 0px;
					}
				}
				.typeChecked {
					font-size: 34rpx;
					color: #333333;
					margin-bottom:6rpx;
				}
				.typeDefault {
					font-size: 30rpx;
					color: #777777;
					margin-bottom:14rpx;
				}
			}
		}
		.searchDetails {
			display: flex;
			height: 100vh;
			.categoryList {
				width: 180rpx;
				background: #F2F2F2;
				overflow-y: scroll;
				.goodsCategory {
					height: 120rpx;
					display: flex;
					align-items: center;
					.categoryLine {
						width: 8rpx;
						height: 44rpx;
						border-radius: 0px 4rpx 4rpx 0px;
						margin-right: 24rpx;
					}
					.categoryMsg {
						flex: 1;
						font-size: 32rpx;
						padding-right: 16rpx;
						line-height: 44rpx;
					}
				}
				.categoryDefault {
					background-color: #F2F2F2;
					.categoryLine {
						background: #F2F2F2;
					}
					.categoryMsg {
						color:#777777;
					}
				}
				.categoryChecked {
					background-color: #FFF;
					.categoryLine {
						background: #4AA2F3;
					}
					.categoryMsg {
						color:#333;
					}
				}
			}
			.contentModel {
				flex: 1;
				padding: 0 32rpx;
				background: #FFF;
				overflow-y: scroll;
				.categoryDetails {
					padding-top:40rpx;
					.subTitle {
						font-size: 28rpx;
						color: #333333;
					}
					.categoryNameBox {
						display: flex;
						flex-wrap: wrap;
						.categoryName {
							padding: 0 24rpx;
							font-size: 22rpx;
							margin-right:32rpx;
							border-radius: 35rpx;
							margin-top:20rpx;
						}
						.categoryNameChecked {
							height: 44rpx;
							line-height: 44rpx;
							background: linear-gradient(90deg, #60B6FA 0%, #4AA2F3 100%);
							color:#FFF;
						}
						.categoryNameDefault {
							height: 40rpx;
							line-height: 40rpx;
							border: 2rpx solid #777777;
							color:#777777;
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
	}
</style>
