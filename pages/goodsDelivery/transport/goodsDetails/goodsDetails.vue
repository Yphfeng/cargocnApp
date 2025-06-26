<template>
	<view class="goodsDetailsChange">
		<!-- 搜索跳转、物品的历史记录 -->
		<view class="goodsNameBox">
			<view class="goods-all">
				<view class="goodsSearchBox" @tap="jumpToFuzzySearch()">
					<view class="searchMsg" v-if="goodsTypeVo && goodsTypeVo.length == 0">
						<image class="icon" src="../../../../static/images/goodsDelivery/search.png"></image>
						<text class="msg">搜索的物品</text>
					</view>
					<view class="selectedGoodsBox" v-if="goodsTypeVo && goodsTypeVo.length > 0">
						<view class="goodsList" v-for="(selectedItem, sIndex) in goodsTypeVo" :key="sIndex">
							<text class="name">{{selectedItem.typeName + '-'}}{{selectedItem.children['0'].children['0'].children['0'].typeName}}</text>
							<!-- <image class="deleteIcon" src="../../../../static/images/goodsDelivery/deleteGoods.png" @tap="deleteGoods(sIndex)"></image> -->
						</view>
					</view>
					<text class="searchHint">至多选择一项</text>
				</view>
				<view class="goods-box" v-if="isSearch">
					<input class="goods-input" :focus="true"  type="text" confirm-type="search" v-model="searchVal" placeholder="请输入" @input="onInput" @blur="onBlur" @confirm="toSearch()" />
					<view class="goods-child" v-if="searchInfo.length!=0" v-for="(item, index) in searchInfo" :key="index" @click="chooseSearchItem(item)">
						<rich-text :nodes="changeMsgColor(item.typeName, item.children['0'].children['0'].children['0'].typeName)"></rich-text>
					</view>
					<view class="goods-child" v-if="diyVal" @click="chooseDiyData">
						<view>{{diyVal}}</view>
						<view class="diyHint">自定义货物</view>
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
				<view id="scrollBox" class="historyGoodsBox defaultGoods" v-if="goodsHistory && goodsHistory.length > 0">
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
			
		</view>
		
		<!-- 物品的数量、重量、体积 -->
		<view class="mainBox">
			<text class="mainTitle">重量/体积</text>
			<text class="subTitle">（必填一项）</text>
			<view class="goodsNumList">
				<text class="title">
					<text>重量</text>
					<text class="titleHint">*</text>
				</text>
				<view class="numOperation">
					<image style="margin-right:20rpx;" class="numBtn" src="../../../../static/images/goodsDelivery/MinusIcon.png" @tap="numberMinus(1)"></image>
					<view class="numBox">
						<input
						:adjust-position="false"
						class="numInput"
						maxlength="7"
						type="digit"
						placeholder-style="font-size: 22rpx;color:#AAAAAA"
						placeholder="请输入"
						v-model="goodsWeight"
						@input="onInputChang($event, 1)"/>
						<text class="measuringUnit">吨</text>
					</view>
					<image style="margin-left:20rpx;" class="numBtn" src="../../../../static/images/goodsDelivery/plusIcon.png" @tap="numberPlus(1, 49)"></image>
				</view>
			</view>
			<view class="goodsNumList">
				<text class="title">
					<text>体积</text>
					<text class="titleHint">*</text>
				</text>
				<view class="numOperation">
					<image style="margin-right:20rpx;" class="numBtn" src="../../../../static/images/goodsDelivery/MinusIcon.png" @tap="numberMinus(2)"></image>
					<view class="numBox">
						<input
						:adjust-position="false"
						class="numInput"
						maxlength="7"
						type="digit"
						placeholder-style="font-size: 22rpx;color:#AAAAAA"
						placeholder="请输入"
						v-model="goodsVolume"
						@input="onInputChang($event, 2)"/>
						<text class="measuringUnit">方</text>
					</view>
					<image style="margin-left:20rpx;" class="numBtn" src="../../../../static/images/goodsDelivery/plusIcon.png" @tap="numberPlus(2, 140)"></image>
				</view>
			</view>
			<view class="goodsNumList">
				<text class="title">
					<text>数量</text>
					<text class="titleHint">*</text>
				</text>
				<view class="numOperation">
					<image style="margin-right:20rpx;" class="numBtn" src="../../../../static/images/goodsDelivery/MinusIcon.png" @tap="numberMinus(3)"></image>
					<view class="numBox">
						<input
						:adjust-position="false"
						class="numInput"
						maxlength="7"
						type="number"
						placeholder-style="font-size: 22rpx;color:#AAAAAA"
						placeholder="请输入"
						v-model="gdNumber"
						@input="onInputChang($event, 3)"/>
						<text class="measuringUnit">件</text>
					</view>
					<image style="margin-left:20rpx;" class="numBtn" src="../../../../static/images/goodsDelivery/plusIcon.png" @tap="numberPlus(3, 500)"></image>
				</view>
			</view>
			<view class="goodsNumList">
				<text class="title">
					<text>打印</text>
					<text class="titleHint">*</text>
				</text>
				<view class="numOperation">
					<image style="margin-right:20rpx;" class="numBtn" src="../../../../static/images/goodsDelivery/MinusIcon.png" @tap="numberMinus(4)"></image>
					<view class="numBox">
						<input
						:adjust-position="false"
						class="numInput"
						maxlength="7"
						type="number"
						placeholder-style="font-size: 22rpx;color:#AAAAAA"
						placeholder="请输入"
						v-model="printNumber"
						@input="onInputChang($event, 4)"/>
						<text class="measuringUnit">张</text>
					</view>
					<image style="margin-left:20rpx;" class="numBtn" src="../../../../static/images/goodsDelivery/plusIcon.png" @tap="numberPlus(4, 500)"></image>
				</view>
			</view>
			<!-- <view class="goodsNumberHint">多个装货点的总物品重量、体积</view> -->
			<view class="goodsNumberHint"></view>
		</view>
		
		<!-- 包装方式 -->
		<view class="mainBox">
			<text class="mainTitle">包装方式</text>
			<view class="packagingBox">
				<view
					class="packagingList"
					v-for="(item,index) in packagingData"
					:key="index"
					:class="item.checked ? 'packagingChecked' : 'packagingDefault'"
					@tap="checkPacking(item.sid)">
					{{item.typeName}}
				</view>
				<!-- <view class="packagingList packagingDefault">
					自己输入
				</view> -->
			</view>
		</view>
		
		<!-- 物品照片与备注 -->
		<!-- <view class="mainBox">
			<text class="mainTitle">物品照片与备注</text>
			<view class="pictureBox">
				<view class="imageUpLoadBox">
					<image class="isUploadImg" v-if="goodsImage" :src="goodsImage" @click="upFile"></image>
					<view class="upLoadBox" v-if="!goodsImage" @click="upFile">
						<image class="upLoadImg" src="../../../../static/images/goodsDelivery/box07.png"></image>
						<view class="upLoadHint">添加图片</view>
					</view>
				</view>
				<textarea class="noteBox" v-model="remark" placeholder-style="font-size: 22rpx;color:#AAAAAA" placeholder="填写您的其他需求"/>
				
			</view>
		</view> -->
		
		<view class="footBtnGroup">
			<view class="saveBtn" @tap="saveGoodsDetails()">确认信息</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				goodsWeight: '',
				goodsVolume: '',
				gdNumber: '', //数量
				printNumber: '', //打印数量
				
				packagingData: [],
				historyPackagingData: [],
				goodsTypeVo: [],
				goodsListData: [],
				goodsImage: '',
				remark: '',
				showGoodsHistory: false,
				goodsHistory: [],
				historyInfo: [],
				isSearch: false,
				
				searchVal: '',
				searchInfo: [],
				timeOutObj: '',
				diyVal: '',
				
				goodsNum: 0,
			};
		},
		onLoad(options) {
			this.goodsNum = Number(options.num);
			this.goodsHistory = uni.getStorageSync('sendGoodsData') ? uni.getStorageSync('sendGoodsData') : [];
			// console.log(this.goodsHistory);
			this.getGoodsPackingInfo();
		},
		onShow() {
			let that = this;
			let obj = getApp().globalData.pransportGoods.pransportGoodsVo;
			console.log('货源信息', obj);
			let chooseGoods = getApp().globalData.pransportGoods.pransportGoodsType;
			console.log('选择的货物', chooseGoods);
			// if(obj.sid) {
			// 	if(chooseGoods.length == 0) {
			// 		getApp().globalData.pransportGoods.pransportGoodsType = obj.goodsVO.goodsTypeVO;
			// 		chooseGoods = obj.goodsTypeVO;
			// 	}
			// }
			if(chooseGoods.length == 0){
				if(obj.goodsTypeVO && obj.goodsTypeVO.length>0){
					chooseGoods = obj.goodsTypeVO;
				}
			}
			this.goodsTypeVo = chooseGoods && chooseGoods.length > 0 ? chooseGoods : [];
			console.log('展示的货物', this.goodsTypeVo);
			let goodsPackingVO = obj.goodsPackingVO;
			if(goodsPackingVO && goodsPackingVO.length > 0) {
				for(let i in goodsPackingVO) {
					this.historyPackagingData.push(goodsPackingVO[i]);
				}
			}
			if(obj.weight) {
				this.goodsWeight = obj.weight;
			}
			if(obj.volume) {
				this.goodsVolume = obj.volume;
			}
			if(obj.gdNumber) {
				this.gdNumber = obj.gdNumber;
			}
			if(obj.printNumber) {
				this.printNumber = obj.printNumber;
			}
			if(obj.remark) {
				this.remark = obj.remark;
			}
			if(obj.goodsUrl) {
				this.goodsImage = obj.goodsUrl;
			}
		},
		onReady() {
		},
		onBackPress(event){ // 是否保存订单信息
			if (event.from == 'backbutton') {
				getApp().globalData.pransportGoods.pransportGoodsType = [];
			    uni.navigateBack({
			        delta: 1
			    });
			    return true; //阻止默认返回行为
			}
		},
		methods: {
			setDataGoods(){
				let ary = [];
				let goodsTypeVo = getApp().globalData.pransportGoods.pransportGoodsType;
				ary = goodsTypeVo;
				// console.log('物品信息', ary);
				this.goodsTypeVo = [];
				this.goodsListData = [];
				if(ary.length > 0) {
					for(let i in ary) {
						this.goodsTypeVo.push(ary[i]);
					}
				}
			},
			onInput(e) {
				console.log(e);
				clearTimeout(this.timeOutObj);
				let that = this;
				that.timeOutObj = setTimeout(() => {
					console.log('search');
					that.toSearch();
				}, 1000);
			},
			onBlur(e){
				setTimeout(()=>{
					this.isSearch = false;
				}, 300)
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
				getApp().globalData.pransportGoods.pransportGoodsType = [];
				getApp().globalData.pransportGoods.pransportGoodsType.push(ary['0']);
				this.setDataGoods();
				this.isSearch = false;
			},
			chooseSearchItem(item) { // 选择搜索到的货物
				this.searchVal = item.children['0'].children['0'].children['0'].typeName;
				console.log(item);
				getApp().globalData.pransportGoods.pransportGoodsType = [];
				getApp().globalData.pransportGoods.pransportGoodsType.push(item);
				this.setDataGoods();
				this.isSearch = false;
			},
			changeMsgColor(typeName, msg) {
				var reg = new RegExp("(" + this.searchVal + ")", "g");
				var newstr = msg.replace(reg, "<span style='font-size:28rpx;color:#4AA2F3;'>$1</span>");
				var returnStr = "<span style='font-size:28rpx;color:#333;'>" + typeName + '-' + newstr + "</span>";
				return returnStr;
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
			checkHistoryRepeat(sid) {
				for(let i in this.goodsTypeVo) {
					if(this.goodsTypeVo[i].children['0'].children['0'].children['0'].sid == sid) {
						return i
					}
				}
			},
			changeGoodsList(sid, item) { // 点击历史货物时判断是否有重复，有则做删除处理，无则做添加处理
				let key = this.checkHistoryRepeat(sid);
				if(key) {
					this.deleteGoods(key);
				}else {
					this.goodsTypeVo = [];
					this.goodsTypeVo.push(item);
					getApp().globalData.pransportGoods.pransportGoodsType = this.goodsTypeVo;
					// if(this.goodsTypeVo.length > 3) {
					// 	uni.showToast({
					// 	    title: '最多选择3种物品',
					// 		icon: 'none',
					// 	    duration: 2000
					// 	});
					// 	return false;
					// }else {
					// 	this.goodsTypeVo.push(item);
					// 	getApp().globalData.goodsTypeVo = this.goodsTypeVo;
					// }
				}
				this.$forceUpdate();
			},
			onInputChang(e, index){
				if(index == 1 || index == 2){
					if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
						e.detail.value = e.detail.value.replace(/-/g, "");
						if(e.detail.value.length > 7){
							let num  = Number(e.detail.value.length) - 7;
							e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
						}else{
							e.detail.value = parseFloat(e.detail.value);
						}
					}else if (e.detail.value.indexOf(".") == 0) {
						// console.log('首位小数点情况')
						e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
						e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
					}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
					    //去掉最后一位
						let ary = e.detail.value.split('.');
						console.log(ary);
						let num = ary['1'].length - 2;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}
				} else {
					e.detail.value = parseInt(e.detail.value);
				}
				this.$nextTick(function(){
					if(index == 1){
						this.goodsWeight = e.detail.value;
						if(this.goodsWeight > 100000 || this.goodsWeight == 100000) {
							this.goodsWeight = 99999;
						}
					} else if(index == 2){
						this.goodsVolume = e.detail.value;
						if(this.goodsVolume > 100000 || this.goodsVolume == 100000) {
							this.goodsVolume = 99999;
						}
					} else if(index == 3){
						this.gdNumber = e.detail.value;
						if(this.gdNumber > 500 || this.gdNumber == 500) {
							this.gdNumber = 500;
						}
					} else {
						this.printNumber = e.detail.value;
						if(this.printNumber > 500 || this.printNumber == 500) {
							this.printNumber = 500;
						}
					}
				})
			},
			getGoodsPackingInfo() { // 获取包装方式
				let that = this;
				utils.postRequest('/ts/goods/packing/get')
				.then(res=>{
					// console.log('包装方式', res);
					// console.log('历史包装方式', that.historyPackagingData);
					that.packagingData = res.rspBody.items;
					for(let i in that.packagingData) {
						that.packagingData[i].checked = false;
					}
					if(that.historyPackagingData && that.historyPackagingData.length > 0) {
						for(let i in that.packagingData) {
							for(let a in that.historyPackagingData) {
								if(that.packagingData[i].sid == that.historyPackagingData[a].sid) {
									that.packagingData[i].checked = true;
								}
							}
						}
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			checkPacking(sid) { // 选择包装方式，2次点击为取消
				for(let i in this.packagingData) {
					if(this.packagingData[i].sid == sid) {
						this.packagingData[i].checked = true;
					}else {
						this.packagingData[i].checked = false;
					}
				}
				this.$forceUpdate();
			},
			numberMinus(flag) { // 减法，最小不能小于1
				switch(flag) {
					case 1:
						if(Number(this.goodsWeight) == 0 || Number(this.goodsWeight) < 0) {
							this.goodsWeight = 0;
						}else {
							let num = (this.goodsWeight * 100).toFixed(0);
							console.log(num);
							if(num < 100) {
								this.goodsWeight = 0;
							}else {
								num = num - 100;
								console.log(num);
								this.goodsWeight = num / 100;
							}
						}
						break;
					case 2:
						if(Number(this.goodsVolume) == 0 || Number(this.goodsVolume) < 0) {
							return false;
						}else {
							let num = (this.goodsVolume * 100).toFixed(0);
							console.log(num);
							if(num < 100) {
								this.goodsVolume = 0;
							}else {
								num = num - 100;
								console.log(num);
								this.goodsVolume = num / 100;
							}
						}
						break;
					case 3:
						if(Number(this.gdNumber) == 0 || Number(this.gdNumber) < 0) {
							return false;
						}else {
							let num = (this.gdNumber * 100).toFixed(0);
							console.log(num);
							if(num < 100) {
								this.gdNumber = 0;
							}else {
								num = num - 100;
								console.log(num);
								this.gdNumber = num / 100;
							}
						}
						break;
					case 4:
						if(Number(this.printNumber) == 0 || Number(this.printNumber) < 0) {
							return false;
						}else {
							let num = (this.printNumber * 100).toFixed(0);
							console.log(num);
							if(num < 100) {
								this.printNumber = 0;
							}else {
								num = num - 100;
								console.log(num);
								this.printNumber = num / 100;
							}
						}
						break;
				}
			},
			numberPlus(flag, maxNum) { // 加法，最大不能大于？？
				switch(flag) {
					case 1:
						if(this.goodsWeight > maxNum || this.goodsWeight == maxNum) {
							return false;
						}
						this.goodsWeight = Number(this.goodsWeight) + 1;
						break;
					case 2:
						if(this.goodsVolume > maxNum || this.goodsVolume == maxNum) {
							return false;
						}
						this.goodsVolume = Number(this.goodsVolume) + 1;
						break;
					case 3:
						if(this.gdNumber > maxNum || this.gdNumber == maxNum) {
							return false;
						}
						this.gdNumber = Number(this.gdNumber) + 1;
						break;
					case 4:
						if(this.printNumber > maxNum || this.printNumber == maxNum) {
							return false;
						}
						this.printNumber = Number(this.printNumber) + 1;
						break;
				}
			},
			jumpToSearchGoods() {
				uni.navigateTo({
					url: './searchGoods'
				})
			},
			jumpToFuzzySearch() {
				// uni.navigateTo({
				// 	url: './fuzzySearch'
				// })
				this.isSearch = true;
			},
			deleteGoods(key) { // 删除已选中物品
				this.goodsTypeVo.splice(key, 1);
				getApp().globalData.pransportGoods.pransportGoodsType = this.goodsTypeVo;
				this.$forceUpdate();
			},
			upFile() { // 上传物品图片
				var that = this;
				uni.chooseImage({
					count: 1, // 默认9  
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						console.log('选择的图片', res);
						console.log('选择的图片大小', res.tempFiles['0'].size);
						if(res.tempFiles['0'].size > (1048576 * 10)) { // 图片大于10mb则无法上传
							uni.showToast({
							    title: '上传的图片不能大于10MB',
								icon: 'none',
							    duration: 2000
							});
							return false;
						}
						var tempFilePaths = res.tempFilePaths;
						that.uploadFrontImage(tempFilePaths[0]);
						// if(res.tempFiles['0'].size > 1048576) { // 图片大于1mb则压缩
						// 	uni.compressImage({
						// 	  src: tempFilePaths[0],
						// 	  quality: 80,
						// 	  success: res => {
						// 	    console.log('压缩后', res)
						// 	  }
						// 	})
						// }else {
						// 	that.uploadFrontImage(tempFilePaths[0]);
						// }
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					}
				})
			},
			uploadFrontImage(path) {
				var that = this;
				// uni.showLoading({
				// 	title: '请稍候...',
				// })
				utils.upLoadFile("/file/upload", path)
				.then(result => {
					console.log('上传结果', result);
					uni.hideLoading()
					if (result.retCode == '0000000') {
						that.goodsImage = result.rspBody[0].url;
					} else {
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						})
					}
					
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '上传失败，请重试',
						icon: 'none'
					})
				})
			},
			saveGoodsDetails() { // 保存物品信息并在本地存储
				if(!utils.btnRepeat()) return false; // 防抖
				if(this.goodsTypeVo && this.goodsTypeVo.length == 0) {
					uni.showToast({
						title: '请选择货物',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.goodsWeight && !this.goodsVolume) {
					uni.showToast({
						title: '请至少填写重量/体积其中一项',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.gdNumber){
					uni.showToast({
						title: '请填写数量',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(!this.printNumber){
					uni.showToast({
						title: '请填写打印张数',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				let pData = [];
				for(let i in this.packagingData) {
					if(this.packagingData[i].checked) {
						pData.push(this.packagingData[i]);
					}
				}
				if(pData && pData.length == 0) {
					uni.showToast({
						title: '请选择包装方式',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				// uni.showLoading({
				// 	title: '请稍候...',
				// })
				var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
				
				 if (regStr.test(this.remark)) {
				    this.remark = this.remark.replace(regStr, "");
				 }
				getApp().globalData.pransportGoods.pransportGoodsType = [];
				getApp().globalData.pransportGoods.pransportGoodsVo = {
					goodsTypeVO: this.goodsTypeVo,
					goodsPackingVO: pData,
					remark: this.remark,
					specify: undefined,
					weight: this.goodsWeight,
					volume: this.goodsVolume,
					goodsUrl: this.goodsImage,
					gdNumber: this.gdNumber,
					printNumber: this.printNumber,
				}
				var childGoods = getApp().globalData.pransportGoods.pransportGoodsVo;
				getApp().globalData.pransportGoods.allGoodsDetails[this.goodsNum] = childGoods;
				console.log(getApp().globalData.pransportGoods.allGoodsDetails);
				uni.navigateBack();
				// console.log(getApp().globalData.pransportGoods.pransportGoodsVo);
				// let params  = {
				// 	batchNumber: getApp().globalData.batchNumber,
				// 	goodsVO: {
				// 		goodsTypeVO: this.goodsTypeVo,
				// 		goodsPackingVO: pData,
				// 		remark: this.remark,
				// 		specify: undefined,
				// 		weight: this.goodsWeight,
				// 		volume: this.goodsVolume,
				// 		goodsUrl: this.goodsImage
				// 	}
				// }
				// console.log('保存参数', params);
				// utils.postRequest('/hy/cargo/addCargo', params)
				// .then(res=>{
				// 	console.log('保存成功', res);
				// 	uni.hideLoading()
				// 	if(res.retCode == '0000000') {
				// 		getApp().globalData.goodsTypeVo = [];
				// 		getApp().globalData.goodsVo = {};
				// 		getApp().globalData.goodsVo = res.rspBody;
				// 		uni.navigateBack();
				// 	}else{
				// 		uni.showToast({
				// 			title: res.retDesc,
				// 			icon: 'none',
				// 			duration: 3000
				// 		})
				// 	}
				// })
				// .catch(err=>{
				// 	uni.hideLoading()
				// 	console.log(err);
				// })
			},
			showHintPopup() {
				uni.navigateTo({
					url: '../../../allAgreement/carrierSpecification'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F1F2F3;
	}
	.goodsDetailsChange {
		padding-bottom:168rpx;
		.goodsNameBox {
			padding: 16rpx 32rpx;
			background-color: #FFF;
			.goods-all{
				position: relative;
				.goodsSearchBox {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 70rpx;
					background: #F0EFEF;
					border-radius: 35rpx;
					padding:0 20rpx;
					.searchMsg {
						flex: 1;
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
						flex: 1;
						display: flex;
						align-items: center;
						.goodsList + .goodsList {
							margin-left:16rpx;
						}
						.goodsList {
							padding: 0 16rpx;
							background: linear-gradient(90deg, #60B6FA 0%, #4AA2F3 100%);
							border-radius: 35rpx;
							height: 44rpx;
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
				.goods-box{	
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					border: 2rpx solid #4AA2F3;
					border-radius: 32rpx;
					box-shadow: 0rpx 4rpx 18rpx 0px rgba(24, 81, 192, 0.17);
					padding: 0 20rpx;
					font-size: 28rpx;
					color: #333;
					z-index: 99;
					background-color: #fff;
					.goods-input{
						padding: 16rpx 12rpx;
						font-size: 28rpx;
					}
					.goods-child{
						border-top: 2rpx solid #F0F0F0;
						padding: 30rpx 12rpx;
						display: flex;
						justify-content: space-between;
						.diyHint {
							font-size: 28rpx;
							color: #AAAAAA;
							line-height: 40rpx;
							padding-left:32rpx;
						}
					}
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
			.historyBox {
				padding-top:14rpx;
				overflow: hidden;
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
			.historyBoxOnshow {
				height: 332rpx;
				transition: height ease-in 0.3s;
			}
			.historyBoxDefault {
				display: flex;
				justify-content: space-between;
				height: 44rpx;
				transition: height ease-out 0.3s;
			}
			.moreGoods {
				height: 300rpx;
				overflow-y: scroll;
				flex-wrap: wrap;
				.historyGoods {
					margin-bottom: 14rpx;
				}
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
		}
		.mainBox {
			padding:32rpx 40rpx 0 40rpx;
			margin:16rpx 16rpx 0 16rpx;
			background: #FFF;
			border-radius: 12rpx;
			.goodsNumList {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top:40rpx;
				.title {
					font-size: 32rpx;
					font-weight: 400;
					color: #333333;
					display: flex;
					align-items: center;
					.titleHint{
						color:#FF3838;
						padding-left:8rpx;
					}
				}
				.numOperation {
					display: flex;
					justify-content: space-between;
					align-items: center;
					min-width: 240rpx;
					.numBox {
						display: flex;
						justify-content: center;
						align-items: center;
						flex: 1;
						.num {
							font-size: 28rpx;
							font-weight: bold;
							color: #333333;
							margin-right:20rpx;
						}
						.numInput {
							flex: 1;
							width: 50rpx;
							font-size: 28rpx;
							font-weight: bold;
							color: #333333;
							margin-right:20rpx;
							border: none;
							text-align: center;
						}
						.measuringUnit {
							font-size: 24rpx;
							color: #C2C2C9;
						}
					}
					.numBtn {
						width:28rpx;
						height: 28rpx;
					}
				}
			}
			.goodsNumberHint {
				font-size: 22rpx;
				color: #AAA;
				margin-top:32rpx;
				text-align: right;
				padding-bottom:12rpx;
			}
			.mainTitle {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			.subTitle {
				font-size: 28rpx;
				color: #777;
			}
			.packagingBox {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				padding-top:20rpx;
				.packagingList:nth-child(3n) {
					margin-right: 0;
				}
				.packagingList {
					margin-right:92rpx;
					margin-bottom:32rpx;
					text-align: center;
					font-size: 24rpx;
					padding:0 20rpx;
					border-radius: 35rpx;
				}
				.packagingDefault {
					min-width:102rpx;
					height: 42rpx;
					line-height: 42rpx;
					color: #333333;
					border: 2rpx solid #777777;
				}
				.packagingChecked {
					min-width:106rpx;
					height: 46rpx;
					line-height: 46rpx;
					color: #FFFFFF;
					background: linear-gradient(90deg, rgba(81, 230, 229, 0.83) 0%, #4AA2F3 100%);
				}
			}
			.pictureBox {
				padding: 32rpx 0;
				display: flex;
				justify-content: space-between;
				.imageUpLoadBox {
					width:210rpx;
					height: 240rpx;
					border-radius: 12rpx;
					border: 2rpx solid #979797;
					margin-right:16rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					.isUploadImg {
						width:210rpx;
						height: 240rpx;
					}
					.upLoadBox {
						.upLoadImg {
							width:46rpx;
							height: 46rpx;
							display: block;
							margin:0 auto 16rpx auto;
						}
						.upLoadHint {
							font-size: 22rpx;
							color: #AAAAAA;
						}
					}
				}
				.noteBox {
					flex: 1;
					height: 180rpx;
					background: #F4F4F4;
					border-radius: 12rpx;
					padding:32rpx;
					font-size: 22rpx;
					color: #333;
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
