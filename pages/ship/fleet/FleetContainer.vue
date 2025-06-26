<template>
		<view class="scroller" :class="{pdTop: selectTag == 5}">
			<view class="request-loading-view" :class="{active: isNoData == 'loading'}">
				<view class="loading-view">
					<view class="loading"></view>
				</view>
				<text class="loading-text">加载中...</text>
			</view>
			<slot name="swiper"></slot>
			<view v-if="selectTag == 5" class="myFlag" :style="{top: activeAdvObj && activeAdvObj.info[0].advUrl ? '444rpx' : '284rpx'}">
				<view v-for="(item, index) in myData" class="flag-item" :class="{active: index == myIndex}" @click="changeFlag(index)">
					{{item.name}}
				</view>
			</view>
			<view v-else class="other-flag" />
			<view class="noData01" v-if="dataArr.length == 0 && isNoData != 'loading'">
				<noData></noData>
			</view>
			<view class="flleetListBox" v-for="(item, platformKey) in dataArr" :key="platformKey" @click="goFleetDetail(item)">
				<fleet-item :item="item" :selectTag="selectTag" :userRole="userRole"/></fleet-item>
			</view>
			<uni-morebox :isMore="isNoMore" :containerStyle="{'margin-top': '24rpx'}"></uni-morebox>
			<view style="height: 24rpx;" />
		</view>
</template>

<script>
	import FleetItem from "./item.vue";
	import UniMorebox from "@/components/uni-morebox.vue";
	import noData from "@/components/noData.vue";
	export default {
		components: {
			FleetItem,
			UniMorebox,
			noData
		},
		name: "FleetContainer",
		props: {
			activeAdvObj: {
				type: Object,
				default: null
			},
			dataArr: {
				type: Array,
				default: [],
			},
			userRole: {
				type: Number,
				default: 1,
			},
			selectTag: {
				type: Number,
				default: 0,
			},
			isNoMore: {
				type: String,
				default: "more",
			},
			isNoData: {
				type: String,
				default: 'loading',
			},
			myFlagShow: {
				type: Boolean,
				default: false,
			}
			
		},
		data() {
			return {
				myData: [],
				myIndex: 0,
			}
		},
		created() {
			// console.log(this.userRole, '用户信息11');
			var userRole = this.userRole;
			// console.log(userRole,'userRole')
			if (userRole == 1) {
				this.myData = [
					{name: '我加入的',id: 2},
					{name: '我创建的',id: 1},
					
				]
			} else {
				this.myData = [
					{name: '我创建的',id: 1},
					{name: '我加入的',id: 2},
					{name: '我关注的',id: 0},	
					// {name: '我关注的',id: 0},
					// {name: '我创建的',id: 1},
					// {name: '我加入的',id: 2},
				]
			}
			this.$forceUpdate();
		},
		methods: {
			goFleetDetail(data) {
				// console.log('qqq',data);
				// uni.navigateTo({
				// 	url: '/pages/goodsDelivery/fleetIndex/fleetDetails?info=' + JSON.stringify(data)
				// })
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(data)
				})
			},
			changeFlag(index) {
				// console.log(index,'车队',this.userRole)
				this.myIndex = index;
				//查询我创建的，我加入的车队
				uni.$emit("fetchMyFleet", index);
			},
		}
	}
</script>

<style scoped lang="scss">
	/deep/.uni-scroll-view ::-webkit-scrollbar { 
		display: none; 
		width: 0; 
		height: 0; 
		color: transparent; 
		background: transparent; 
	} 
	.scroller {
		position: relative;
		&.pdTop {
			padding-top: 90rpx;
			box-sizing: border-box;
		}
	}
	.flleetListBox + .flleetListBox {
		margin-top: 24rpx;
	}
	.flleetListBox {
		margin-left: 24rpx;
		margin-right: 24rpx;
		padding: 12rpx;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 8rpx 0px rgba(18,72,158,0.32);
		border-radius: 12rpx;
	}
	.other-flag {
		height: 22rpx;
	}
	.myFlag {
		position: fixed;
		left: 0;
		// top: 284rpx;
		top: 444rpx;
		width: 100vw;
		display: flex;
		flex-direction: row;
		padding: 0 24rpx;
		height: 90rpx;
		align-items: center;
		box-sizing: border-box;
		background-color: #FDFDFD;
		z-index: 9;
		.flag-item {
			font-size: 30rpx;
			color: rgba(119, 119, 119, 1);
			margin-right: 80rpx;
			font-weight: 500;
			&.active {
				color: rgba(1, 113, 249, 1);
			}
		}
	}
	.noData01 {
		flex: 1;
		height: 700rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.request-loading-view {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 0;
		transition: all .2s ease;
		overflow: hidden;
		&.active {
			height: 80rpx;
		}
	}
	.loading-text {
		font-size: 24rpx;
		color: #333333;
		margin-left: 10rpx;
	}
	.loading-view {
		margin: 10rpx;
		border-radius: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	/* 动画样式 */
	.loading {
		border: 5upx solid rgba(0, 0, 0, 0.01);
		border-radius: 50%;
		border-top: 5upx solid #ccc;
		border-right: 5upx solid #ccc;
		border-bottom: 5upx solid #ccc;
		width: 30upx;
		height: 30upx;
		-webkit-animation: spin 1.4s linear infinite;
		animation: spin 1.4s linear infinite;
	}
	
	@-webkit-keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
		}
	
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
	
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
	
		100% {
			transform: rotate(360deg);
		}
	}
</style>
