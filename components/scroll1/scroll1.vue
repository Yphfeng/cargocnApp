<template>
	<view >
		<scroll-view class="scroll-box" :style="'top: ' + topSize + ';bottom:' + bottomSize "
			scroll-y="true"
			refresher-enabled="true"
			:refresher-triggered="triggered"
			:refresher-threshold="150"
			:lower-threshold="50"
			@refresherrefresh="onRefresh" @refresherrestore="onRestore" @scrolltolower="onTolower">
			<slot></slot>
		</scroll-view>
	</view>
</template>

<script>
    export default {
        data() {
            return {
                // triggered: false
            }
        },
		props: {
		  // 加载中
		  triggered: {
		    // type: Boolean,
		    // default: false
		  },
		  // 顶部高度
		  topSize: {
		    type: String,
		    // default: '0rpx'
		  },
		  bottomSize: {
			  type: String,
		  }
		},
        onLoad() {
			
        },
        methods: {
            onRefresh() {
    //             if (this._freshing) return;
				// console.log('下拉开始')
    //             this._freshing = true;
    //             setTimeout(() => {
    //                 this.triggered = false;
    //                 this._freshing = false;
				// 	this.$emit('refresh');
    //             }, 1000)
				
				this.$emit('refresh');
				
            },
            onRestore() {
                // this.triggered = 'restore'; // 需要重置
    //             console.log("onRestore");
				// console.log('下拉结束')
				this.$emit('restore');
            },
			onTolower(e){
				// console.log('上拉加载')
				this.$emit('more');
			}

        }
    }
</script>

<style>
	.scroll-box{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}
</style>
