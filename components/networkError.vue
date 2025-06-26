<template>
	<view class="networkError">
		<!-- 通用网络异常弹窗 -->
		<uni-popup ref="errorPopup" type="center">
			<view class="errorBox">
				<view class="title">温馨提示</view>
				<view class="content">
					感谢您使用货运中国先行赔付服务，我们将和承运司机一起竭诚保护您的货物安全，若在运输过程中发生损失，您最高可获得声明价值
					<text class="msg">3000</text>
					元的赔偿。
				</view>
				<view class="content">
					服务费=
					<text class="msg">声明价值*标准服务费率（0.6%）</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: 'networkError',
		data() {
			return {
			};
		}
	}
</script>

<style lang="scss">
	.networkError {
		
	}
</style>
