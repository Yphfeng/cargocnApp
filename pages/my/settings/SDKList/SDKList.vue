<template>
	<view class="container">
		<view class="info">
			当你使用第三方提供的服务时，我们会在获得或确保第三方获得你的授权同意后，以及其他符合法律法规规定的情形下共享对应信息。你可以通过本清单中列举的相关信息了解第三方会如何处理你的个人信息。我们也会对第三方获取个人信息的行为进行严格约束，以保护你的个人信息安全。
		</view>
		<view class="info">
			为保障货运中国稳定运行或实现相关功能，我们还可能会接入由第三方提供的软件开发包（SDK）实现前述目的。我们对接入的相关第三方SDK同时在以下清单中列明。你可以通过目录中提供的链接或者路径查看第三方的数据使用和保护规则。请注意，第三方SDK可能由于版本升级、策略调整等原因导致其个人信息处理类型发生变化，请以其公示的官方说明为准。
		</view>
		<view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">消息推送</view>
			<view class="items_title">功能类型: <text class="items_name"> 消息推送</text></view>
			<view class="items_title">控件名称: <text class="items_name"> 个推</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 推送业务相关信息</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 推送</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 无</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://www.getui.com/privacy')">
					[链接]</text>
          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">一键登录</view>
			<view class="items_title">功能类型: <text class="items_name"> 手机号一键登录</text></view>
			<view class="items_title">控件名称: <text class="items_name"> d-cloud</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 为用户提供便捷的一键登录服务</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 读取手机号及手机状态</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 手机号</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://dev.dcloud.net.cn/policy/unilogin.html')">
					[链接]</text>
          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">地图类</view>
			<view class="items_title">功能类型: <text class="items_name"> 地图类</text></view>
			<view class="items_title">控件名称: <text class="items_name"> 高德地图</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 地图定位展示及导航等</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 当前用户位置</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 经纬度</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://lbs.amap.com/pages/privacy/')">
					[链接]</text>
          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">支付类</view>
			<view class="items_title">功能类型: <text class="items_name"> 支付类</text></view>
			<view class="items_title">控件名称: <text class="items_name"> 微信支付</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 微信移动支付</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 个人常用设备信息</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 身份证、银行卡</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/getting_started/how_to_read.html')">
					[链接]</text>
          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">安全认证类</view>
			<view class="items_title">功能类型: <text class="items_name"> 安全认证类</text></view>
			<view class="items_title">控件名称: <text class="items_name"> 百度人脸识别</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 用户认证时活体认证</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 摄像头</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 人像</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://cloud.baidu.com/doc/Agreements/s/Kjwvy245m')">
					[链接]</text>
          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">证件识别类</view>
			<view class="items_title">功能类型: <text class="items_name"> 证件识别类</text></view>
			<view class="items_title">控件名称: <text class="items_name"> 百度/微信OCR识别</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 快速识别证件信息</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 摄像头</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 身份证、行驶证</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://cloud.baidu.com/doc/Agreements/s/Kjwvy245m')">
					[链接]</text>
          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">框架类</view>
			<view class="items_title">功能类型: <text class="items_name"> 框架类</text></view>
			<view class="items_title">控件名称: <text class="items_name"> 二维码扫描</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 扫描二维码/条形码信息</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 摄像头</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 无</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" >
					无</text>          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">互动类</view>
			<view class="items_title">功能类型: <text class="items_name"> 互动类</text></view>
			<view class="items_title">控件名称: <text class="items_name"> Goeasy</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 群聊私聊</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 键盘</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 无</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://www.goeasy.io/cn/serviceterm.html')">
					[链接]</text>
          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">交委相关</view>
			<view class="items_title">功能类型: <text class="items_name"> 交委相关</text></view>
			<view class="items_title">控件名称: <text class="items_name"> 轨迹上报</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 交通部要求网络货运单需要上报轨迹等信息</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 当前用户位置</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 经纬度、手机号、车牌号、运单号</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://www.mot.gov.cn/zhengcejiedu/wangluopthyjd/meitibaodao/201909/t20190910_3249658.html')">
					[链接]</text>
          </view>
		</view>
    <view class="SDK_item">
			<view class="items_title" style="margin-bottom: 20rpx;">语音类</view>
			<view class="items_title">功能类型: <text class="items_name"> 语音类</text></view>
			<view class="items_title">控件名称: <text class="items_name"> 嘟嘟对讲机</text></view>
			<view class="items_title">使用目的: <text class="items_name"> 群聊语音输入</text></view>
			<view class="items_title">设备权限共享信息: <text class="items_name"> 麦克风</text></view>
			<view class="items_title">收集个人信息类型: <text class="items_name"> 手机号</text></view>
			<view class="items_title">隐私政策: 
        <text class="items_name" style="color: #0077FF" @click="goSDKDetails('https://h5.omwchat.com/agreement.html')">
					[链接]</text>
          </view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {}
		},
		onLoad() {
			console.log('123123213123123')
		},
		methods: {
			goSDKDetails(url){
				let that = this
					uni.navigateTo({
							url: './SDKListDetails?url=' + url
				});
			},
		},
	}
</script>
<style>
	.SDK_item {
		margin-bottom: 50rpx;
	}

	.items_title {
		font-weight: bold;
		font-size: 30rpx;
		margin-bottom: 10rpx;
	}

	.items_name {
		margin-left: 20rpx;
		font-size: 30rpx;
		font-weight: 400 !important;
	}

	.container {
		width: 100%;
		padding: 50rpx;
		box-sizing: border-box;
	}

	.info {
		padding-bottom: 30rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 50rpx;
	}
</style>
