<template>
<view>
<template name="empty-template">
  <view class="empty-layout">

    <image :src="src" mode="aspectFit" class="empty-img"></image>

    <text class="empty-text">{{prompt}}</text>

    <button class="empty-btn" @tap="emptyCallback" :data-type="emptyType" v-if="btnPrompt != null">{{btnPrompt}}</button>

  </view>
</template>
</view>
</template>


	<script>
		
		export default {
			props: []
		}
    </script>

									