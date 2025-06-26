<template>
	<view class="container">
		<view class="container_pic">
			<view class="title">
				身份证
			</view>
			<view class="picItem">
				<image src="../../../static/images/ship/idFrontImg.png" class="idFront idImg"></image>
				<image src="../../../static/images/ship/idBackImg.png" class="idFront idImg"></image>
			</view>
			<view class="title">
				驾驶证
			</view>
			<view class="picItem">
				<image src="../../../static/images/ship/licenseMainImgDR.png" class="idFront idImg"></image>
				<image src="../../../static/images/ship/licenseSubImgDR.png" class="idFront idImg"></image>
			</view>
			<view class="title">
				司机签名，从业资格证
			</view>
			<view class="picItem">
				<image src="../../../static/images/ship/background.png" class="idFront idImg"></image>
				<image src="../../../static/images/ship/background.png" class="idFront idImg"></image>
			</view>
		</view>
		<view class="container_pic">
			<view class="input_item">
				<view class="label"><text class="red">*</text>姓名</view>
				<view class="input">
					<input type="text" placeholder="请输入姓名" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>司机电话</view>
				<view class="input">
					<input type="text" placeholder="请输入司机电话" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>身份证号</view>
				<view class="input">
					<input type="text" placeholder="请输入身份证号" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>驾驶证号</view>
				<view class="input">
					<input type="text" placeholder="请输入驾驶证号" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label">准驾车型</view>
				<view class="input">
					<input type="text" placeholder="请输入准驾车型" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label">住址</view>
				<view class="input">
					<input type="text" placeholder="请输入住址" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>驾驶证发证机关</view>
				<view class="input">
					<input type="text" placeholder="请输入驾驶证发证机关" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>初次领证时间</view>
				<view class="input">
					<input type="text" placeholder="请输入初次领证时间" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>有效期起</view>
				<view class="input">
					<input type="text" placeholder="请输入初次领证时间" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>有效期止</view>
				<view class="input">
					<input type="text" placeholder="请输入初次领证时间" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>驾驶证从业资格证号</view>
				<view class="input">
					<input type="text" placeholder="请输入驾驶证从业资格证号" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>从业资格证有效期起</view>
				<view class="input">
					<input type="text" placeholder="请输入从业资格证有效期起" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>从业资格证有效期止</view>
				<view class="input">
					<input type="text" placeholder="请输入从业资格证有效期止" placeholder-class="holder" />
				</view>
			</view>
			<view class="input_item">
				<view class="label"><text class="red">*</text>认证状态</view>
				<view class="input">
					<input type="text" placeholder="请输入认证状态" placeholder-class="holder" />
				</view>
			</view>
		</view>
		<view class="fix-bottom">
			<view class="send">确定</view>
		</view>
		
	</view>
</template>

<script>
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		background-color: #F3F3F3;
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);  
		.container_pic {
			background-color: #FFFFFF;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
			padding: 0 32rpx 40rpx;
			&+.container_pic {
				padding-bottom: 120rpx;
			}
			.input_item {
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1px solid #D9D9D9;
				font-size: 28rpx;
				height: 90rpx;
				.label {
					
				}
				.input {
					flex: 1;
					text-align: right;
					.holder {
						font-size: 28rpx;
					}
				}
			}
		}
		.title {
			color: #333333;
			font-size: 28rpx;
			font-weight: 500;
			height: 100rpx;
			display: flex;
			align-items: center;
		}
		.picItem {
			display: flex;
			flex-direction: row;
			.idImg {
				flex: 1;
				height: 200rpx;
				&:first-child {
					margin-right: 20rpx;
				}
			}
		}
	}
	.fix-bottom {
		position: fixed;
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #4AA2F3;
		.send {
			border-radius: 24rpx 24rpx 0 0;
			height: 80rpx;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			width: 100vw;
		}
	}
</style>
