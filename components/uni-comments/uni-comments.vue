<template>
	<!-- 评论输入框 -->
	<view class="commentinput-box u-f-ac u-f-jsa">
		<textarea
		maxlength="50"
		confirm-type="send"
		:auto-blur="autoBlur"
		:adjust-position="adjust"
		v-model="val"
		@input="inputChange"
		:placeholder="hint"
		@confirm="toSend"
		focus
		:focus="commit"
		@blur="inputOnBlur"
		@keyboardheightchange="onKeyboardheightchange"/>
		<view class="view-btn">
			<view class="sendText" @click="toSend">发送</view>
		</view>
   </view>
</template>

<script>
	export default{
		name: 'UniComments',
		data() {
			return {
				val: '',
				adjust: false,
				autoBlur: true,
				// hint: '说点什么吧'
			}
		},
		props: {
			commit: {
				default: false,
			},
			hint: {
				default: '',
			},
			commentBoxHeight: {
				default: 0,
			}
		},
		methods:{
			inputChange(e) {
				if(e.target.cursor == 50) {
					uni.showToast({
						title: '回复内容请在50个字以内！',
						icon: 'none'
					})
				}
			},
			toSend(){
				// 去除字符串内所有的空格：str = str.replace(/\s*/g,"");
				// 去除字符串内两头的空格：str = str.replace(/^\s*|\s*$/g,"");
				// 去除字符串内左侧的空格：str = str.replace(/^\s*/,"");
				// 去除字符串内右侧的空格：str = str.replace(/(\s*$)/g,"");
				// console.log(this.val);
				// let str = this.val;
				// this.val = str.replace(/\s*/g,"");
				this.$emit("submit",this.val.replace(/^\s*|\s*$/g,""))
				this.val = '';
			},
			inputOnFocus(event) {
				console.log('input聚焦', event);
			},
			inputOnBlur(event) {
				console.log('input失去聚焦', event);
				setTimeout(()=>{
					uni.hideKeyboard();
				}, 100);
			},
			onKeyboardheightchange(event) {
				console.log('键盘变化', event);
			}
			// onBlur(event) {
			// 	this.$emit("onBlur", 1)
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.commentinput-box{
		position: fixed;
		z-index: 9999;
		bottom: 0;
		left: 0;
		right: 0;
		height: 288rpx;
		box-sizing: border-box;
		padding: 20rpx;
		border-top: 1px solid rgba(204,204,204,.4);
		background-color: #fff;
		display: flex;
		align-items: center;
		textarea{
			border: 1px solid #EEEEEE;
			background: #EEEEEE;
			padding: 10rpx 0 10rpx 20rpx;
			flex: 1;
			margin-right:20rpx;
			height: 180rpx;
			border-radius: 30rpx;
		}
		.view-btn{
			width: 60px;
			height: 180rpx;
			display: flex;
			align-items: flex-end;
			.sendText {
				color:#FF7D4A;
				font-size: 32rpx;
				height: 68rpx;
				width: 60px;
				line-height: 68rpx;
				text-align: center;
			}
		}
	}
</style>
