<template>
	<view class="selectPopupBox">
		<view class="selectPopuoBody">
			<view class="contentLeft">
				<scroll-view scroll-y="true" class="alertScroller" :scroll-into-view="scrollView" scroll-with-animation="true">
					<view class="scroll_item scroll_1" v-for="(item, index) in typeArr" :id="item.label">
						<view class="scroll_title">
							<text>{{item.title}}</text>
						</view>
						<view class="list">
							<view class="item" v-for="(atem, i) in item.data" @click="setChoose(index, i)" :class="{active: atem.isSelected}">
								{{atem.typeName}}
							</view>
						</view>
						
					</view>
				</scroll-view>
			</view>
			<view class="contentRight">
				<view class="top" :style="{height: (144 + isRightIndex*100 + 'rpx')}"></view>
				<view class="bottom" :style="{height: (totalHeight*2 - 144 - 168 - (isRightIndex + 1)*100 + 'rpx')}"></view>
				<view class="rightList">
					<view class="listItem" v-for="(item, index) in listTilArr" @click="changeScrollView(item, index)" :class="{active: item.isSelect}">
						<view class="text">{{item.title}}</view>
						<view class="dot" v-if="isRightIndex !== index && isRightIndex - 1 !== index"></view>
						<view class="line" v-if="item.isSelect" />
					</view>
				</view>
			
			</view>
		</view>
		<view class="popupSelectBtnGroup">
			<view class="resetBtn" @click="reset">重置</view>
			<view class="confirmBtn" @click="searchInfo">确定</view>
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		props: {
			params: {
				type: Object
			},
			typeArr: {
				type: Array,
			}
		},
		data() {
			return {
				listTilArr: [
					{
						label: 'B',
						title: '规模',
					},
					{
						label: 'C',
						title: '车长'
					},
					{
						label: 'D',
						title: '车型',
					},
					{
						label: 'E',
						title: '优势区域',
					},
					{
						label: 'F',
						title: '优势行业',
					},
					{
						label: 'G',
						title: '省份',
					},
					
				],
				isRightIndex: 0,
				scrollView: 'B', //锚点
				totalHeight: 0,
			}
		},
		created() {
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			var windowHeight = uni.getSystemInfoSync().windowHeight;
			var platform = uni.getSystemInfoSync().platform;
			console.log(platform);
			if (platform == "ios") {
				this.totalHeight = windowHeight;
			} else {
				this.totalHeight = windowHeight + statusBarHeight;
			}
			
			// console.log("更新1", this.addParams);
		},
		destroyed() {
			console.log("已销毁")
		},
		async mounted() {
			//获取车长车型接口
			console.log(this.typeArr, 'asas');
			var typeArr = this.typeArr;
			var keys = Object.keys(this.params);
			if (keys.length > 0) {
				var fleetAttributesList = this.params.fleetAttributesList;
				var memberRangeList = this.params.memberRangeList;
				var cartLengthList = this.params.cartLengthList;
				var modelList = this.params.modelList;
				var advantageAreaList = this.params.advantageAreaList;
				var advantageIndustryList = this.params.advantageIndustryList;
				var provinceNameList = this.params.provinceNameList;
				// if (fleetAttributesList && fleetAttributesList.length > 0) {
				// 	var data = typeArr[0].data;
				// 	fleetAttributesList.forEach(item => {
				// 		var findIndex = data.findIndex(atem => {
				// 			return atem.typeName == item
				// 		})
				// 		if (findIndex > -1) {
				// 			data[findIndex].isSelected = true;
				// 		}
				// 	})
				// 	typeArr[0].data = data;
				// } 
				if (memberRangeList && memberRangeList.length > 0) {
					var data = typeArr[0].data;
					memberRangeList.forEach(item => {
						var findIndex = data.findIndex(atem => {
							return atem.start == item.memberNumStart && atem.end == item.memberNumEnd
						})
						if (findIndex > -1) {
							data[findIndex].isSelected = true;
						} 
					})
					typeArr[0].data = data;
				} else {
					var data = typeArr[0].data;
					data.forEach(item => {
						item.isSelected = false
					})
					typeArr[0].data = data;
				}
				if (cartLengthList && cartLengthList.length > 0) {
					var data = typeArr[1].data;
					console.log(data, '车长111')
					cartLengthList.forEach(item => {
						var findIndex = data.findIndex(atem => {
							return atem.typeName == item
						})
						if (findIndex > -1) {
							data[findIndex].isSelected = true;
						}
					})
					typeArr[1].data = data;
				} else {
					var data = typeArr[1].data;
					data.forEach(item => {
						item.isSelected = false
					})
					typeArr[1].data = data;
				}
				if (modelList && modelList.length > 0) {
					var data = typeArr[2].data;
					modelList.forEach(item => {
						var findIndex = data.findIndex(atem => {
							return atem.typeName == item
						})
						if (findIndex > -1) {
							data[findIndex].isSelected = true;
						}
					})
					typeArr[2].data = data;
				} else {
					var data = typeArr[2].data;
					data.forEach(item => {
						item.isSelected = false
					})
					typeArr[2].data = data;
				}
				
				if (advantageAreaList && advantageAreaList.length > 0) {
					var data = typeArr[3].data;
					advantageAreaList.forEach(item => {
						var findIndex = data.findIndex(atem => {
							return atem.typeName == item
						})
						if (findIndex > -1) {
							data[findIndex].isSelected = true;
						}
					})
					typeArr[3].data = data;
				} else {
					var data = typeArr[3].data;
					data.forEach(item => {
						item.isSelected = false
					})
					typeArr[3].data = data;
				}
				
				if (advantageIndustryList && advantageIndustryList.length > 0) {
					var data = typeArr[4].data;
					advantageIndustryList.forEach(item => {
						var findIndex = data.findIndex(atem => {
							return atem.typeName == item
						})
						if (findIndex > -1) {
							data[findIndex].isSelected = true;
						}
					})
					typeArr[4].data = data;
				} else {
					var data = typeArr[4].data;
					data.forEach(item => {
						item.isSelected = false
					})
					typeArr[4].data = data;
				}
				if (provinceNameList && provinceNameList.length > 0) {
					var data = typeArr[5].data;
					provinceNameList.forEach(item => {
						var findIndex = data.findIndex(atem => {
							return atem.code == item
						})
						if (findIndex > -1) {
							data[findIndex].isSelected = true;
						}
					})
					typeArr[5].data = data;
				} else {
					var data = typeArr[5].data;
					data.forEach(item => {
						item.isSelected = false
					})
					typeArr[5].data = data;
				}
				
				this.typeArr = typeArr;
				this.$forceUpdate();
			}
			
		},
		methods: {
			reset() {
				//重置所有的参数
				var typeArr = this.typeArr;
				typeArr.forEach(item => {
					var label = item.label;
					if (label == 'A') {
						//类型
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								item.isSelected = false;
							}
						})
					}
					if (label == 'B') {
						//规模
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								item.isSelected = false;
							}
						})
						
					}
					if (label == "C") {
						//车长
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								item.isSelected = false;
							}
						})
						
					}
					if (label == 'D') {
						//车型
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								item.isSelected = false;
							}
						})
					}
					if (label == 'E') {
						//车型
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								item.isSelected = false;
							}
						})
					}
					if (label == 'F') {
						//车型
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								item.isSelected = false;
							}
						})
					}
					if (label == 'G') {
						//车型
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								item.isSelected = false;
							}
						})
					}
					
				})
				this.typeArr = typeArr;
				this.$forceUpdate();
				uni.$emit("resetSearch", {});
			},
			async getVehicleLen() {
				var that = this;
				var typeArr = this.typeArr;
				try{
					var res = await ship.postRequest("/ts/vehicle/length/get");
					console.log(res, '车长')
					if (res.retCode == "0000000") {
						var carLen = res.rspBody.items;
						typeArr[2].data = carLen;
						that.typeArr = typeArr;
						that.$forceUpdate();
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			async getVehicleType() {
				var that = this;
				var typeArr = this.typeArr;
				try{
					var res = await ship.postRequest("/ts/vehicle/type/get");
					console.log(res, '车型')
					if (res.retCode == "0000000") {
						var carType = res.rspBody.items;
						typeArr[3].data = carType;
						that.typeArr = typeArr;
						that.$forceUpdate();
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			setChoose(index, i) {
			
			   var typeArr = this.typeArr;
			   var isSelected = typeArr[index].data[i].isSelected;
			   var data = typeArr[index].data;
			   var title = typeArr[index].title;
			   if (title == '省份') {
				   data.forEach((atem, a) => {
						if (a == i) {
						   data[a].isSelected = !isSelected
						} else {
							data[a].isSelected = false
						}
				   })
			   } else {
				   data.forEach((atem, a) => {
						if (a == i) {
						   data[a].isSelected = !isSelected
						}
				   })
			   }
			   
			   typeArr[index].data = data;
			   this.typeArr = typeArr
			   this.$forceUpdate();			   
			},
			changeScrollView(item, index) { // 锚点定位
				var  listTilArr = this.listTilArr;
				var isSelect = listTilArr[index].isSelect;
				if (isSelect) {
					return
				}
				listTilArr[index].isSelect = !isSelect;
				for (var i =0; i < listTilArr.length; i ++) {
					if (index !== i) {
						listTilArr[i].isSelect = false
					}
				}
				this.listTilArr = listTilArr;
				this.scrollView = item.label;
				this.isRightIndex = index;
				console.log(this.scrollView);
				this.$forceUpdate();
			},
			searchInfo() {
				//删选，传递选择的参数
				var typeArr = this.typeArr;
				//筛选
				var cartLengthList = [], modelList = [], fleetAttributesList = [], memberRangeList = [], advantageAreaList = [], advantageIndustryList = [], provinceNameList = [];
				typeArr.forEach(item => {
					var label = item.label;
					if (label == 'A') {
						//类型
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								fleetAttributesList.push(item.typeName)
							}
						})
					}
					if (label == 'B') {
						//规模
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								memberRangeList.push({
									memberNumStart: item.start,
									memberNumEnd: item.end
								})
							}
						})
						
					}
					if (label == "C") {
						//车长
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								cartLengthList.push(item.typeName)
							}
						})
						
					}
					if (label == 'D') {
						//车型
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								modelList.push(item.typeName)
							}
						})
					}
					if (label == 'E') {
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								advantageAreaList.push(item.typeName)
							}
						})
					}
					if (label == 'F') {
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								advantageIndustryList.push(item.typeName)
							}
						})
					}
					if (label == 'G') {
						var data = item.data;
						data.forEach(item => {
							if (item.isSelected) {
								provinceNameList.push(item.typeName)
							}
						})
					}
				})
				var params1 = new Object();
				if (fleetAttributesList.length > 0) {
					params1.fleetAttributesList = fleetAttributesList;
				}
				if (cartLengthList.length > 0) {
					params1.cartLengthList = cartLengthList;
				}
				if (modelList.length > 0) {
					params1.modelList = modelList;
				}
				if (memberRangeList.length > 0) {
					params1.memberRangeList = memberRangeList;
				}
				if (advantageAreaList.length > 0) {
					params1.advantageAreaList = advantageAreaList;
				}
				if (advantageIndustryList.length > 0) {
					params1.advantageIndustryList = advantageIndustryList;
				}
				if (provinceNameList.length > 0) {
					params1.provinceNameList = provinceNameList;
				}
				
				
				uni.$emit("searchResult", params1);
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.selectPopupBox {
		background-color: #FFF;
		height: 100vh;
		width: 630rpx;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		.selectPopuoBody {
			display: flex;
			flex-direction: row;
			box-sizing: border-box;
			height: calc(100vh - 168rpx);
		}
		.popupSelectBtnGroup {
			padding: 40rpx 32rpx;
			box-shadow: 0px 4rpx 8rpx 0px rgba(0,0,0,0.5);
			background-color: #FFF;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			flex-shrink: 0;
			height: 168rpx;
			box-sizing: border-box;
			.resetBtn {
				width: 268rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #EDEFF1;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #969FB2;
				text-align: center;
			}
			.confirmBtn {
				width: 268rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #0171F9;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #FFF;
				text-align: center;
			}
		}
	}
	.contentLeft {
		flex: 1;
		padding: 140rpx 0;
		box-sizing: border-box;
		background-color: #FFFFFF;
		.alertScroller {
			height: calc(100vh - 308rpx);
		}
		.scroll_item {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			.list {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
			}
			.item {
				width: 190rpx;
				height: 60rpx;
				border: 1px solid #DDDDDD;
				border-radius: 8rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #969FB2;
				font-size: 24rpx;
				margin-left: 24rpx;
				margin-bottom: 24rpx;
				&.active {
					background-color: rgba(74, 162, 243, 1);
					color: #FFFFFF;
					border-color: rgba(74, 162, 243, 1);
				}
			}
		}
		.scroll_title {
			font-size: 28rpx;
			color: #333333;
			padding: 16rpx 26rpx 40rpx;
			.sub {
				font-size: 26rpx;
				color: #999999;
			}
		}
	}
	.contentRight {
		background-color: #FFFFFF;
		padding-top: 144rpx;
		width: 180rpx;
		display: flex;
		flex-direction: column;
		position: relative;
		.top {
			position: absolute;
			top: 0;
			right: 0;
			width: 180rpx;
			height: 144rpx;
			z-index: 9;
			background-color: #F2F2F2;
			border-radius: 0 0 0 20rpx;
			overflow: hidden;
		}
		.bottom {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 180rpx;
			height: calc(100vh - 412rpx);
			z-index: 9;
			background-color: #F2F2F2;
			border-radius: 20rpx 0 0 0;
			overflow: hidden;
		}
		.rightList {
			position: absolute;
			top: 144rpx;
			right: 0;
			z-index: 9;
			width: 180rpx;
		}
		.listItem {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #999999;
			font-size: 28rpx;
			height: 100rpx;
			position: relative;
			.line {
				position: absolute;
				right: 0;
				top: 26rpx;
				height: 44rpx;
				width: 8rpx;
				background-color: #4AA2F3;
				border-radius: 0 4rpx 4rpx 0;
				
			}
			&.active {
				background-color: #FFFFFF;
				color: #4AA2F3;
				
			}
			.text {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.dot {
				width: 40rpx;
				background-color: #D3D3D3;
				height: 1px;
			}
		}
	}
</style>
