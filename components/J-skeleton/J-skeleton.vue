<template>
  <view>
    <view v-if="loading" class="skeleton" :class="{ animate: animate }"  :style="{ justifyContent: flexType}">
		<!-- 轮播图 -->
		<view
		  v-if="imgTitle"
		  class="skeleton-imgTitle"
		  style="width: 100%;border-radius: 10px;height: 100px;display: block;"
		>
		</view>
		<!-- 头像图 -->
		<view
			v-if="showAvatar && !imgTitle"
			class="skeleton-avatar"
			v-for="(item, index) in nameRow"
			:key="index"
			:class="[avatarShape]"
			:style="{ width: avatarSize, height: avatarSize}"
		>
		</view>
		<!-- 文字条 -->
		<view class="skeleton-content" v-if="showTitle  && !imgTitle">
			<view  class="skeleton-title" :style="{ width: titleWidth }"></view>
			<view class="skeleton-rows">
				<view
					class="skeleton-row-item"
					v-for="(item, index) in rowList"
					:key="index"
					:style="{ width: item.width }"
				>
				</view>
			</view>
		</view>
		<view v-else style="height: 24rpx;"></view>
		<!--list列表 -->
		<view class="skeleton-list" v-if="showColumn">
			<view class="skeleton-list-rows">
				<view
					class="skeleton--list-row-item"
					v-for="(item, index) in columnList"
					:key="index"
					:style="{ width: item.width, 'margin-bottom': '20rpx' }"
				>
					<!-- <view class="item-title"></view> -->
					<view class="item-content">
						<view class="item-1 item-list"></view>
						<view class="item-2">
							<view class="item-left item-list"/>
							<view class="item-right item-list"/>
						</view>
						<view class="item-2">
							<view class="item-left item-list"/>
							<view class="item-right item-list"/>
						</view>
					</view>
				</view>
			</view>
		</view>
    </view>
    <view v-else><slot></slot></view>
  </view>
</template>

<script>
const DEFAULT_ROW_WIDTH = '100%'
const DEFAULT_LAST_ROW_WIDTH = '60%'
const DEFAULT_LAST_COLUMN_WIDTH = '100%'


export default {
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
		imgTitle: {
			type: Boolean,
			default: false,
		},
		nameRow:{
			type: Number,
			default: 1,
		},
		flexType:{
			type: String,
			default: 'flex-start', // center	居中	√		space-between	两端对齐	√		space-around	子元素拉手分布	√		flex-start	居左		flex-end	居右
		},
		showAvatar: {
			type: Boolean,
			default: true,
		},
		avatarSize: {
			type: String,
			default: '50px',
		},
		avatarShape: {
			type: String,
			default: 'round', // square | round
		},
		showTitle: {
			type: Boolean,
			default: false,
		},
		titleWidth: {
			type: String,
			default: '40%',
		},
		row: {
			type: Number,
			default: 3,
		},
		column: {
			type: Number,
			default: 3,
		},
		showColumn: {
			type: Boolean,
			default: false,
		},
		animate: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {}
	},
	computed: {
		rowList() {
			let list = []
			for (let i = 0; i < this.row; i++) {
				list.push({
					width: i === this.row - 1 && i !== 0 ? DEFAULT_LAST_ROW_WIDTH : DEFAULT_ROW_WIDTH,
				})
			}
			return list
		},
		columnList() {
			let list = []
			for (let i = 0; i < this.column; i++) {
				list.push({
					width: DEFAULT_LAST_COLUMN_WIDTH,
				})
			}
			return list
		}
	},
}
</script>

<style scoped>
.skeleton {
  display: flex;
  flex-direction: column;
  margin: 0 18px 18px;
  --bg-color: #f2f3f5;
  --list-bg-color: #ffffff;
  --row-height: 18px;
  --row-margin-top: 18px;
  --column-height: 150px;
}
.skeleton-imgTitle {
	flex-wrap: wrap;
	background: var(--list-bg-color);
	margin: 10px auto;
	
}
.skeleton-avatar {
  flex-shrink: 0;
  background: var(--bg-color);
  margin-right: 8px;
}
.skeleton-avatar.round {
  border-radius: 50%;
}

.skeleton-content, .skeleton-list {
  width: 100%;
}
.skeleton-title {
  background-color: var(--bg-color);
  height: var(--row-height);
}

.skeleton-title + .skeleton-rows {
  margin-top: var(--row-margin-top);
}

.skeleton-row-item {
  background-color: var(--bg-color);
  height: var(--row-height);
}
.skeleton--list-row-item {
	background-color: var(--bg-color);
	height: var(--column-height);
	border-radius: 16rpx;
	padding: 0 36rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}
.item-title {
	background-color: var(--list-bg-color);
	padding: 20rpx 36rpx;
	width: 80%;
}
.item-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.item-list {
	background-color: var(--list-bg-color);
	padding: 15rpx 0;
}
.item-1 {
	width: 70%;
}
.item-2 {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.item-left {
	width: 50%;
}
.item-right {
	width: 30%;
}
.skeleton-row-item:not(:first-child) {
  margin-top: var(--row-margin-top);
}

.skeleton.animate {
  animation: skeleton-blink 1.2s ease-in-out infinite;
}

@keyframes skeleton-blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
