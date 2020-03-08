<template>
	<view class="uni-header">
		<view class="uni-header-image" :style="{height: height + 'rpx',backgroundImage: 'url(' + backgroundUri + ')'}">
			<view class="uni-header-left">
				<slot name="left" />
			</view>
			<view class="uni-header-right">
				<slot name="right" />
			</view>
		</view>
		<view class="uni-header-content">
			<slot name="content" />
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			height: {
				type: Number,
				default: 400
			},
			backgroundUri: {
				type: String,
				default: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2305546665,1900906766&fm=26&gp=0.jpg"
			},
			isShowSearch:{
				type: Boolean,
				default: true
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.uni-header {
		// background: #fff;
		.uni-header-image {
			width: 100%;
			border-bottom-right-radius: 40rpx;
			border-bottom-left-radius: 40rpx;
			background-position: center center;
			background-size: cover;
			background-repeat: no-repeat;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.uni-header-left {
				color: #ffffff;
				font-size: 36rpx;
				margin-left: 40rpx;
				margin-top: 30rpx;
			}

			.uni-header-right {	
				margin-top: 0rpx;
				margin-right: 40rpx;
			}

		}

		.uni-header-content {
			background: #ffffff;
			border-radius: 8rpx;
			// padding: 40rpx 20rpx;
			margin: -60rpx 40rpx 20rpx;
			box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 0px 2px 0 rgba(0, 0, 0, 0.19);
		}
	}
</style>
