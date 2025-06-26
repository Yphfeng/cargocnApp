<template>
	<!--星星评价-->
	<view class="container">
		<!-- <view class="title">
			<image class="car-size" src="/static/images/star_car.png"></image>
			<text class="car-text">物流服务评价</text>
		</view> -->
		<view class="car_cen">
			<view class="car_top">
				<image src="/static/images/icon_user.png" class="user_image"></image>
				<text class="user_text">{{carrName}}</text>
			</view>
		
			<view class="car_xx">
				
				<view v-for="(atem, i) in stars" :key="i" @click="selectRight(i)">
					<image class="image" v-if="stars[i] < score" src="/static/images/star.png"
					  >
					  <image class="image" v-else src="/static/images/stars.png"
					    >
						<view class="item" style="left:20rpx"></view>
					</image>
				</view>
			</view>
		
			<view class="cen1">
				<view v-for="(item, idx) in rateList"   :key='idx'>
					<view :class="[item.selected ? 'textline2':'textline1']" class="textline"  @click="getTag(idx)"><text :class="[item.selected ? 'textline2_text':'textline1_text']">{{item.name}}</text></view>
				</view>
			</view>
		</view>
		<button class="primary-btn" v-if='flag' @click='bindSubmit'><text style="color: #FFFFFF;">保存提交</text></button>
	    <button class="primary-btn" v-else @click='back_click'><text style="color: #FFFFFF;">返回</text></button>
	</view>	
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				dis: false,
				flag: false,
				taskId: "",
				driverName: "",
				stars: [0, 1, 2, 3, 4],
				normalSrc: '/static/images/stars.png',
				selectedSrc: '/static/images/star.png',
				score: 0,
				scores: [],
				rateList: [
					{
					name: '货源充足',
					typeCode: 0,
					selected: false,
					},
					{
					name: '运费支付快',
					typeCode: 1,
					selected: false,
					},
					{
					name: '结算准确',
					typeCode: 2,
					selected: false,
					},
					{
					name: '装卸及时',
					typeCode: 3,
					selected: false,
					},
				],
				rateList1: [1],
				flag: 0,
				textline1: "textline1",
				textline2: "textline2",
				noteMaxLen: 100, // 最多放多少字
				info: "",
				noteNowLen: 0, //备注当前字数
				show: 0,
				selectIndex: 1,
			}
		},
		onLoad(options) {
			let that = this;
			var taskId = options.taskId;
			var carrName = options.carrName;
			this.taskId = taskId;
			this.carrName = carrName;
			
			let data = {
				type: 1
			}
			console.log("加载")
			// post('/am/commentTag/findCommentTagList', data, true).then(res => {
			// 	var rateList = res.items;
			// 	var arr = []
			// 	rateList.forEach(function(item, index, rateList) {
			// 		arr.push({
			// 			name: item.name,
			// 			typeCode: Number,
			// 			id: item.id
			// 		})
			// 	})
			// 	this.rateList = arr;
				
			this.getEvaluate()
			// }).catch(err => {
			// 	uni.showToast({
			// 		title: "获取失败",
			// 		icon: 'none',
			// 		duration: 5000,
			// 	})
			// });
		},
		methods: {
			// 获取标签
			getTag(idx) {
				if (!this.flag) {
					return
				}
				var index = idx
				var selected =  this.rateList[index].selected;
				
				this.rateList[index].selected = !selected
				
				this.rateList = this.rateList
		
			},
			// 提交清空当前值
			bindSubmit: function() {
		
				var that = this;
		
				if (!that.score) {
					uni.showToast({
						title: '请给物流评分',
						icon: 'none'
					})
					return;
				}
				var rateList = that.rateList;
				var list = [];
				rateList.forEach(atem => {
					if (atem.selected) {
						list.push(atem.name)
					}
				})
				var data = {
					"taskId": that.taskId,
					"total": this.score,
					"commentText": list.join(","),
					compName: that.carrName,
				}
				console.log("data", data);
				ship.postRequest('/po/eva/add', data).then(res => {
					uni.showToast({
						title: '评价成功',
						duration: 2000,
						icon: "success",
						success: function() {
							setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 2000) //延迟时间 
						}
					})
				}).catch(err => {
					console.log(err);
					uni.showToast({
						title: "获取失败",
						icon: 'none',
						duration: 5000,
					})
				});
			},
		
			//点击整颗星
			selectRight: function(i) {
				if (!this.flag) {
					return
				}
				var score = i
				console.log(i, 'asaaaa')
				this.score = score + 1;
			},
			back_click() {
				uni.navigateBack({
					delta: 1
				})
			},
			getEvaluate() {
				let that = this
		
				let data = {
					taskId: this.taskId,
				};
				ship.postRequest('/po/eva/find', data).then(result => {
					console.log(result, '获取的评价详情')
					var res = result.rspBody;
					if (res == undefined) {
						this.flag = true;
					
					} else {
						
						let tag = []
						if (res.commentText) {
							tag = res.commentText.split(",")
						}
						let rateList = that.rateList
						this.score = res.total;
						for (var i in tag) {
							console.log(tag[i])
							for (let j in rateList) {
								if (rateList[j].name == tag[i]) {
									that.rateList[j].selected = true;
									that.rateList = rateList	
								}
							}
						}
						this.flag = false;
						
						this.dis = true;
						this.$forceUpdate()
						
					}
				}).catch(err => {
					console.log(err, "错误信息")
					wx.showToast({
						title: err || "获取失败",
						icon: 'none',
						duration: 5000,
					})
				});
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
	}
	.comment1-description {
	    padding: 30rpx 0;
	    display: flex;
	    flex-direction: row;
	}
	
	.weui-cells_after-title {
	    width: 92%;
	    margin: 0 auto;
	    border: 1px solid #ddd;
	    margin-top: 100rpx;
	}
	
	page {
	    background: #FFF;
	}
	
	.weui-textarea {
	    background: #F2F2F2;
	}
	
	.weui-textarea-counter {
	    text-align: right;
	    padding-right: 60rpx;
	    padding-top: 30rpx;
	}
	
	.image {
	    height: 40rpx;
	    width: 40rpx;
	}
	
	.textline {
	    float: left;
	    height: 40rpx;
	    line-height: 40rpx;
	    margin-left: 80rpx;
	    min-width: 120rpx;
	    font-size: 30rpx;
	}
	
	.car_top {
	    height: 200rpx;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
	}
	
	.user_image {
	    width: 92rpx;
	    height: 92rpx;
	    margin-top: 20rpx;
	}
	
	.user_text {
	    font-size: 26rpx;
	    font-family: PingFang SC;
	    font-weight: 400;
	    margin-top: 10rpx;
	    color: #000000;
	}
	
	
	.car_cen {
	    margin: 0 20rpx;
	    height: 575rpx;
	    background: #F9FBFD;
	}
	
	.car_xx {
	    padding: 0 145rpx;
	    display: flex;
		flex-direction: row;
	    height: 150rpx;
	    justify-content: space-between;
	    align-items: center;
	}
	
	.cen1 {
	    display: flex;
	    flex-direction: row;
	    padding: 0 40rpx;
	    height: 150rpx;
	    flex-wrap: wrap;
	    justify-content: flex-start;
	    align-items: center;
	}
	
	.textline1 {
	    width: 180rpx;
	    height: 42rpx;
	    margin-left: 22rpx;
		margin-bottom: 20rpx;
	    line-height: 42rpx;
	    border: 1rpx solid #A7A5A5;
	    opacity: 1;
	    border-radius: 11rpx;
	    justify-content: center;
		align-items: center;
		display: flex;
	}
	
	.textline2 {
	    width: 180rpx;
	    height: 42rpx;
	    margin-left: 22rpx;
		margin-bottom: 20rpx;
	    line-height: 42rpx;
	    border: 1rpx solid #4989C8;
	    background: #4989C8;
	    opacity: 1;
	    border-radius: 11rpx;
	    justify-content: center;
		align-items: center;
		display: flex;
	   
	   
	}
	.textline2_text {
		 font-size: 18rpx;
		 font-family: PingFang SC;
		 font-weight: 400;
		 color: #fff;
	}
	.textline1_text {
		font-size: 18rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A7A5A5;
	}
	
	.cen {
	    text-align: center;
	    height: 80rpx;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	}
	
	.imgline {
	    margin-right: 80rpx;
	}
	
	.item-textarear {
	    background-color: #f1f2f2;
	    margin-left: 30rpx;
	    width: 690rpx;
	    border-radius: 16rpx;
	    height: 290rpx;
	    font-size: 32rpx;
	    text-align: left;
	    margin-top: 120rpx;
	}
	
	.item-textareas {
	    background-color: #f1f2f2;
	    margin-left: 30rpx;
	    padding-top: 30rpx;
	    width: 630rpx;
	    height: 260rpx;
	    font-size: 32rpx;
	    text-align: left;
	}
	
	.title {
	    justify-content: flex-start;
		align-items: center;
		flex-direction: row;
	    margin:0 30rpx;
	   
		height: 100rpx;
	}
	
	.item {
	    position: absolute;
	    top: 0rpx;
	    width: 60rpx;
	    height: 60rpx;
	}
	
	.car-size {
	    height: 30rpx;
	    width: 40rpx;
		margin-right: 30rpx;
	}
	.car-text {
		 font-size: 30rpx;
	}
	
	.primary-btn {
	    background: #2B72F0;
	    color: #fff;
	    width: 750rpx !important;
	    position: fixed;
	    bottom: 0;
	    border-radius: 0;
	    height: 90rpx;
	    line-height: 90rpx;
	    z-index: 999;
	    padding: 0 0 0 0 !important;
	}
</style>
