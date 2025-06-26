<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area" @click="scan(scanObj)">
			<text class="title">点击开始扫码1</text>
		</view>
		<view v-if="value != '' ">扫码结果：{{value}}</view>
		<view class="text-area" @click="scan(scanObj2)">
			<text class="title">点击开始扫码2</text>
		</view>
		<view v-if="value2 != '' ">自定义返回参数名的扫码结果1：{{value2}}</view>
		<view class="text-area" @click="scan(scanObj3)">
			<text class="title">点击开始扫码3</text>
		</view>
		<view v-if="value3 != '' ">自定义返回参数名的扫码结果2：{{value3}}</view>
		<view class="text-area" @click="scan(scanObj5)">
			<text class="title">连续扫码</text>
		</view>
		<view class="text-area" @click="scan(scanObj4)">
			<text class="title">点击开始多条码扫码</text>
		</view>
		<view v-if="value4 != '' ">扫码结果：{{value4}}</view>
		<view class="text-area" @click="buildCode()">
			<text class="title">点击生成码图</text>
		</view>
		<view>
			<image :src="img"></image>
		</view>
	</view>
</template>

<script>
	// 获取 module
	var ScanModule = uni.requireNativePlugin("wss-scan")
	export default {
		data() {
			return {
				value: '',
				value2: '',
				value3: '',
				value4: '',
				scanObj: {
					// "scanType": ["QRCODE", "CODE93", "CODE128", "DATAMATRIX"],
					"scanMode": "Customized",
					"scanStyle": {
						"scanFrameSizePlus": {
							"width": 300,
							"height": 150
						},
						"scanFrameSize": 100,
						"scanBgColor": "#1fffffff",
						"scanText": "华为ScanKit扫码",
						"scanTitle": "扫一扫"
					},
				},
				scanObj2: {
					"scanType": ["QRCODE", "CODE93", "CODE128", "DATAMATRIX"],
					"scanKey": "wss1",
					"scanMode": "Customized",
					"scanStyle": {
						"scanFrameSize": 200,
						"scanText": "华为ScanKit扫码",
						"scanTitle": "扫一扫",
						"scanPhoto": "invisible",
						"scanCornerColor": "#ff0000",
						"scanCornerLength": 20,
						"scanCornerWidth": 5,
						"scanLingDuration": 2000
					},
					"scanRequestImage": "1"
				},
				scanObj3: {
					"scanType": ["QRCODE", "CODE93", "CODE128", "DATAMATRIX"],
					"scanKey": "wss2",
				},
				scanObj4: {
					"scanKey": "wss3",
					"scanMode": "MultiProcessor",
					"scanStyle": {
						"scanTitle": "扫一扫",
						"scanMultiTitle": "取消",
						"scanMultiText": "扫描到多个码，请选择一个打开",
						"scanPhoto": "visible",
						"scanLight": "invisible"
					},
				},
				scanObj6: {
					"content": "测试",
					"type": "QRCODE",
					"width": 300,
					"height": 300,
					"margin": 1,
					"background": "#00ffff",
					"color": "#000000"
				},
				scanObj5: {
					// "scanType": ["QRCODE"],
					"scanMode": "Customized",
					// "scanMode": "default",
					"scanStyle": {
						"scanFrameSizePlus": {
							"width": 350,
							"height": 300
						},
						"scanFrameSize": 200,
						"scanText": "华为ScanKit扫码",
						"scanTitle": "扫一扫",
						"scanPhoto": "invisible"
					},
					"scanContinuity": {
						"continue": "1",
						// "sleep": 2000,
						"sleep": 20
					}
				},
				img: '',
			}
		},
		onLoad() {

		},
		methods: {
			scan(v) {
				ScanModule.scan(v,
					(result) => {
						console.log(result);
						//ScanModule.stopScan();
						var ret = result.scanValue;
						this.img = result.scanImage;
						if (ret.sKey) {
							switch (ret.sKey) {
								case "wss1":
									this.value2 = ret.sValue;
									break;
								case "wss2":
									this.value3 = ret.sValue;
									break;
								case "wss3":
									this.value4 = ret.sValue;
									break;
							}
						} else {
							this.value = ret;
						}
						console.log(this.value)
						console.log(this.value2)
						console.log(this.value3)
						console.log(this.value4)
					})
			},
			buildCode() {
				ScanModule.buildCode(this.scanObj4,
					(result) => {
						this.img = result.codeImage
					})
			}
		}
	}
</script>
<style>
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.text-area{
		margin-top: 30rpx;
	}
</style>
