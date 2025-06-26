<template>
	<view class="comp" v-if="time_left_0" :style="{opacity:opc}">
		<web-view :src="weburl" v-if="time_left_0"></web-view>
		<image @click="close" v-if="canclose === '1' " class="close-icon" src="https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211213_24FAD85E72A74639BEE8B4E5D37DD6B6.png" mode=""></image>
	</view>
</template>

<script>
	let wv = null;
	export default{
		props:['time_left_0','weburl','canclose'],
		data(){
			return{
				opc:0
			}
		},
		created() {
			
		},
		watch:{
			time_left_0(val){
				
				this.webviewscale(val);
			}
		},
		methods:{
			close(){
				this.$parent.webshow = false;
			},
			webviewscale(val){
				console.log(val,'<-----');
				let self = this;
				if(!val){return}
				let currentWebview = this.$parent.$scope.$getAppWebview();			
				const query = uni.createSelectorQuery().in(this);
				let topHeight = 0;let bottomHeight = 0;let boxHeight = 0;
				query.select('.top-box').boundingClientRect(data => {
					topHeight = data.height; // 头部元素高度
				}).exec();
				query.select('.bottom-box').boundingClientRect(data => {
					bottomHeight = data.height; // 底部元素高度
				}).exec();
				uni.getSystemInfo({
					success(res) {
						boxHeight = res.windowHeight // 屏幕可用高度
					}
				});
				setTimeout(function() {
					let viewHeight = parseInt(boxHeight - topHeight - bottomHeight);
					console.log(viewHeight)
					wv = currentWebview.children()[0];
				    wv.setStyle({top:(boxHeight - topHeight - bottomHeight - 500) / 2,height: 500 ,width:300,position:'fixed',margin:'auto',borderRadius:100})
					console.log(wv);
					self.opc = 1;
				}, 500); //如果是页面初始化调用时，需要延时一下
			},
		}
	}
</script>

<style lang="less" scoped>
	.comp{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100vw;
		background-color: rgba(0,0,0,.75);
		height: 100vh;
		z-index: 100;
		transition: .5s;
		opacity: 0;
	}
	.close-icon{
		position: fixed;
		left: 0;
		right: 0;
		margin: auto;
		width: 68rpx;
		height: 68rpx;
		bottom: 100rpx;
		
	}
</style>
