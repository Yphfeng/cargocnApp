<template>
	<view class="advertisingH5">
		<web-view
			v-if="srcUrl"
			style="position: fixed; top: 80; left: 0; right: 0; bottom: 0;"
			:webview-styles="webviewStyles"
			:src="srcUrl">
		</web-view>
	</view>
</template>

<script>
	var wv;//计划创建的webview
	export default {
		data() {
			return {
				canBack: false,
				webviewStyles: {
				    progress: false
				},
				srcUrl: ''
			}
		},
		onLoad(option) {
			this.srcUrl = getApp().globalData.promoteLinkUrl;
			// let webUrl = getApp().globalData.promoteLinkUrl;
			// // #ifdef APP-PLUS
			// 	wv = plus.webview.create("","custom-webview",{
			// 		plusrequire:"none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
			// 		'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
			// 		top:uni.getSystemInfoSync().statusBarHeight + 44 //放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
			//     })
			//     wv.loadURL(webUrl)
			//     var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
			//     currentWebview.append(wv);//一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
			//     setTimeout(function() {
			// 		let styleObj = wv.getStyle();
			// 		let styleHeight = styleObj.height - (uni.getSystemInfoSync().statusBarHeight + 44);
			// 		wv.getStyle({height: styleHeight});
			// 		console.log(wv.getStyle())
			//     }, 1000);//如果是首页的onload调用时需要延时一下，二级页面无需延时，可直接获取
			// // #endif
		},
		onBackPress(e) {
			if(wv && this.canBack) {
				wv.back();
				return true;
			}
			return false;
		},
		onReady() {
			wv = this.$scope.$getAppWebview()
			let that = this;
			wv.addEventListener(
				'progressChanged',
				function(e) {
					wv.canBack(function(e) {
						that.canBack = e.canBack;
					});
				},
				false
			);
		},
		methods: {
		}
	}
</script>

<style>

</style>
