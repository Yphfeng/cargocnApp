<template>
	<view class="all">
		<view class="searchHead">
			<view style="width: 150rpx; flex-direction: row; align-items: center;" @click="backToFromPage">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/back.png" style="width: 22rpx;" mode="widthFix"></image>
			</view>
			<view class="" style="font-weight: 500; font-size: 32rpx; color: #333; flex: 1; justify-content: center; display: flex; align-items: center;">
				<view class="">货运中国</view>
				<view class="head-dot"></view>
				<view class="">标签码</view>
			</view>
			<view style="width: 150rpx; flex-direction: row; text-align: right; align-items: center;"></view>
		</view>
		<view class="code-box">
			<view class="code-table">
				<view class="enterprise-box line-height">
					<view class="enterprise-name">发货人所属企业</view>
					<view class="code-img">
						<tki-barcode
							ref="barcode"
							onval
							:val="code"
							:load-make="true"
							:opations="barOpations"/>
						<view class="code-font">{{code}}</view>
					</view>
				</view>
				<view class="address-box line-height">
					<view class="address-row-text">四川省成都市四川省成都市四川省成都市</view>
					<view class="address-row-num">1/2</view>
				</view>
				<view class="user-box line-height">
					<view class="receive-text">收</view>
					<view class="">
						<view class="user-info">
							<view class="user-name">张三</view>
							<view class="">15680874818</view>
						</view>
						<view class="user-address">上海市闵行区虹桥正荣中心</view>
					</view>
				</view>
				<view class="goods-text-box line-height">
					<view class="goods-text">货物</view>
					<view class="goods-content line-right">
						<view class="goods-content-text">冰箱</view>
						<view class="goods-text">
							<view class="goods-text-child">重量</view>
							<view class="goods-text-child">体积</view>
						</view>
					</view>
					<view class="goods-content-num">1kg</view>
				</view>
				<view class="note-box line-height">
					<view class="note-text">备注</view>
					<view class="note-content">轻拿轻放，小心磕碰</view>
				</view>
				<view class="tips-box">
					<view class="tips-box-child">请使用货运中国APP</view>
					<view class="tips-box-child">或者零担扫码小程序扫码</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tkiBarcode from '@/components/tki-barcode/tki-barcode'
	
	export default {
	    components: {
	        tkiBarcode
	    },
	    data() {
	        return {
	            code: '',
	            barOpations: {
	                height: 130,
					width: 3,
	                displayValue: false
	            }
	        }
	    },
		onLoad() {
			this.init();
		},
	    methods: {
	        init () {
	            setTimeout(() => {
	                this.code = '12345678905678111222' // 生成一维码和二维码
					console.log('llllllllll')
	            }, 300)
	        },
			backToFromPage() {
				uni.navigateBack({
					
				})
			},
	    }
	}
</script>

<style lang="scss">
	.all{
		.searchHead {
			padding:0 40rpx 14rpx 40rpx;
			justify-content: space-between;
			display: flex;
			align-items: flex-end;
			z-index: 99;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			height: 135rpx;
			box-sizing: border-box;
			background-color: #fff;
			.head-dot{
				width: 5rpx;
				height: 5rpx;
				border-radius: 50%;
				background-color: #333;
				margin: 0 5rpx;
			}
		}
		.code-box{
			margin-top: 135rpx;
			padding: 34rpx 40rpx;
			.code-table{
				border: 2rpx solid #EAEAEA;
				border-radius: 8rpx;
				box-sizing: border-box;
				.line-height{
					border-bottom: 2rpx solid #EAEAEA;
				}
				.enterprise-box{
					display: flex;
					align-items: center;
					padding: 30rpx;
					.enterprise-name{
						font-size: 30rpx;
						font-weight: 500;
						color: #333;
					}
					.code-img{
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						margin-left: 30rpx;
						.code-font{
							font-size: 25rpx;
							color: #333;
						}
					}
				}
				.address-box{
					display: flex;
					align-items: center;
					.address-row-text{
						width: 334rpx;
						padding: 26rpx 30rpx;
						font-size: 30rpx;
						font-weight: 500;
						color: #333;
						border-right: 2rpx solid #EAEAEA;
					}
					.address-row-num{
						width: 334rpx;
						padding: 26rpx 30rpx;
						font-size: 30rpx;
						font-weight: 500;
						color: #777;
						text-align: right;
					}
				}
				.user-box{
					display: flex;
					align-items: center;
					padding: 26rpx 30rpx;
					.receive-text{
						background-color: #FF7700;
						color: #fff;
						font-size: 28rpx;
						font-weight: 500;
						border-radius: 10rpx;
						padding: 8rpx;
						margin-right: 30rpx;
					}
					.user-info{
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
						.user-name{
							margin-right: 40rpx;
						}
					}
					.user-address{
						margin-top: 25rpx;
						font-size: 26rpx;
						color: #777;
					}
				}
				.goods-text-box{
					display: flex;
					align-items: center;
					.goods-text{
						width: 118rpx;
						padding: 26rpx 0;
						text-align: center;
						color: #777;
						font-size: 26rpx;
					}
					.goods-content{
						display: flex;
						align-items: center;
						justify-content: center;
						width: 334rpx;
						font-size: 26rpx;
						color: #333;
						font-weight: 500;
						border-left: 2rpx solid #EAEAEA;
						.goods-content-text{
							padding: 26rpx 0;
							width: 216rpx;
							text-align: center;
						}
						.goods-text{
							border-left: 2rpx solid #EAEAEA;
							padding: 26rpx 0;
							width: 118rpx;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							.goods-text-child{
								line-height: 36rpx;
							}
						}
					}
					.goods-content-num{
						width: 216rpx;
						text-align: center;
						padding: 26rpx 0;
						font-size: 26rpx;
						color: #333;
						font-weight: 500;
					}
					.line-right{
						border-right: 2rpx solid #EAEAEA;
					}
				}
				.note-box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.note-text{
						width: 118rpx;
						padding: 26rpx 0;
						text-align: center;
						color: #777;
						font-size: 26rpx;
					}
					.note-content{
						font-size: 26rpx;
						color: #333;
						margin-right: 34rpx;
					}
				}
				.tips-box{
					padding: 26rpx 0;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.tips-box-child{
						font-size: 30rpx;
						font-weight: 500;
						color: #333;
						line-height: 42rpx;
					}
				}
			}
		}
	}
</style>
