<template>
	<div class="knowledge">
		<div class="box">
			<img class="top_box" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/topBackg.png"
				alt="" />
			<!-- <div > -->
			<img class="back_img" @click="goBack"
				src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/return_btn.png" alt="">
			<!-- </div> -->

			<img class="logo" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/logo_img.png"
				alt="" />
			<img class="earth" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/earth.png" alt="" />

			<div class="mask_box">
				<img class="mask_img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/mask_img.png"
					alt="" />
				<div class="text">宝藏箱</div>
			</div>

			<div class="content_box">
				<div class="item" :class="index % 2 == 0 ? 'left' : 'right'" v-for="(item,index) in imgList"
					:key="index">
					<img @click="tapUrl(item.index)" :src="item.image" alt="">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				imgList: [
					{
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img1.png',
						index: 1
					},
					{
						//法律法规
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img9.png',
						index: 9
					},
					{
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img4.png',
						index: 4
					},
					{
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img7.png',
						index: 7
					},
					{
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img8.png',
						index: 8
					},
					{
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img2.png',
						index: 2
					},
					{
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img3.png',
						index: 3
					},
					
					{
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img5.png',
						index: 5
					},
					{
						image: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img6.png',
						index: 6
					},
					
					// 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img4.png',
					// 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img7.png',
					// 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img8.png',
					// 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img2.png',
					// 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img3.png',
					// 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img5.png',
					// 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/annualBill/modular_img6.png'
				]
			};
		},
		methods: {
			tapUrl(index) {
				let that = this
				if (index == 1) {
				} else if (index == 2) {
					uni.showToast({
						title: '敬请期待',
						icon: 'none'
					})
					return
				} else if (index == 3) {
					uni.showToast({
						title: '敬请期待',
						icon: 'none'
					})
					return
				} else if (index == 4) {
				} else if (index == 5) {
					uni.showToast({
						title: '敬请期待',
						icon: 'none'
					})
					return
				} else if (index == 6) {
					uni.showToast({
						title: '敬请期待',
						icon: 'none'
					})
					return
				} else if (index == 7) {
				} else if (index == 8) {
				}else if (index == 9) {
				}
				uni.navigateTo({
					url: './treasure?index=' + index
				})
			},
			goBack() {
				uni.navigateBack({})
				// console.log('3333');
				// uni.postMessage({
				//   data: {
				//     type: "goBack"
				//   },
				// });
			}
		},
	};
</script>

<style lang="scss">
	.left {
		padding-right: 30rpx;
	}

	.right {
		padding-left: 30rpx;
	}

	.knowledge {
		width: 100vw;
		height: 100vh;
		background-color: #fff;

		.box {
			width: 100vw;
			height: 100vh;
			position: relative;

			.back_img {
				position: absolute;
				top: 126rpx;
				z-index: 2;
				left: 38rpx;
				right: 728rpx;
				width: 20rpx;
				height: 40rpx;
			}

			.top_box {
				/* height: 2.27rem; */
				height: 600rpx;
				width: 100vw;
			}

			.logo {
				position: absolute;
				top: 200rpx;
				left: 78rpx;
				right: 414rpx;
				width: 258rpx;
				height: 152rpx;
			}

			.earth {
				position: absolute;
				top: 90rpx;
				left: 378rpx;
				right: 0;
				height: 470rpx;
				width: 372rpx;
				z-index: 1;
			}

			.mask_box {
				position: absolute;
				height: 352rpx;
				top: 454rpx;
				left: 0;
				right: 0;

				.mask_img {
					height: 352rpx;
				}

				.text {
					width: 192rpx;
					height: 90rpx;
					font-size: 64rpx;
					font-weight: 500;
					color: #333333;
					position: absolute;
					top: 40rpx;
					left: 70rpx;
					right: 4.48rpx;
				}
			}

			.content_box {
				position: absolute;
				top: 600rpx;
				left: 0;
				z-index: 10;
				width: 100vw;
				display: flex;
				flex-wrap: wrap;
				padding: 0 46rpx;
				box-sizing: border-box;

				.item {
					width: 50%;
					padding-bottom: 70rpx;
					box-sizing: border-box;

					img {
						width: 100%;
					}
				}
			}

		}
	}
</style>
