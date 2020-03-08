<template>
	<view>
		<view class="header-content-tab">
			<view class="tab-item" v-for="(i, key) in rowList" :class="{ active: key == current }" @tap="currentTap(key, i)" :key="key">
				<view class="title-main">
					<view class="title">
						<image v-if="hasImage" :src="i.img" class="head-portrait"></image>
						<view>
							<text class="title-text">{{ i.title }}</text>
							<uni-icons
								class="u-icon"
								@click="iconClick(key)"
								v-if="hasIcon"
								color="#ccc"
								:type="key == slideIcon ? 'arrowdown' : 'arrowright'"
								size="24"
							></uni-icons>
						</view>
					</view>
					<view class="cont">{{ i.content }}</view>
				</view>
			</view>
			<view class="tab-item-more" v-if="hasRightMore">
				<uni-icons class="u-icon" @click="rightMore = !rightMore" color="#ccc" :type="rightMore ? 'arrowdown' : 'arrowright'" size="36"></uni-icons>
			</view>
		</view>
		<view class="bottom-more" v-if="rightMore">
			<view
				class="bottom-more-item"
				v-for="(colItem, colkey) in colList"
				:key="colkey"
				:class="{ cloactive: colkey == currentMore }"
				@click="currentTapMore(colkey,colItem)"	
			>
				{{ colItem.title }}
			</view>
			<button type="primary"  @click="rightMore =false">收起</button>
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
	components: {
		uniIcons
	},
	props: {
		tabList: {
			type: Array,
			default: []
		},
		hasIcon: {
			type: Boolean,
			default: false
		},
		hasImage: {
			type: Boolean,
			default: false
		},
		maxLength: {
			//横向个数，超出个数竖向排列,如果不想竖向排列请指定最大个数
			type: Number,
			default: 3
		}
	},
	data() {
		return {
			current: 0,
			currentMore: null,
			slideIcon: null,
			rightMore: false
		};
	},
	computed: {
		hasRightMore() {
			if (this.tabList.length > this.maxLength) {
				return true;
			}
			return false;
		},
		rowList() {
			if (!this.hasRightMore) {
				return this.tabList;
			}
			return this.pickList(true);
		},
		colList() {
			return this.pickList();
		}
	},
	methods: {
		pickList(row) {
			var temp = [];
			this.tabList.forEach(val => {
				if (row) {
					if (val.rowShow) {
						temp.push(val);
					}
				} else {
					if (!val.rowShow) {
						temp.push(val);
					}
				}
			});
			if (row && temp.length == 0) {
				return this.tabList.splice(this.maxLength - 1);
			}
			return temp;
		},
		currentTap(key,i) {
			this.current = key;
			this.currentMore = null;
			this.$emit('tabChange', key, i);
		},
		currentTapMore(key,colItem) {
			var newKey = null;
			if (this.hasRightMore) {
				var arr = this.rowList.concat(this.colList);
				
				// console.log(key)
				arr.forEach((val, k) => {
					if (val.field == colItem.field) {
						newKey = k;
					}
				});
			}
			this.current = null;
			this.currentMore = key;	
			console.log(this.currentMore);
			this.$emit('tabChange', newKey, colItem);
		},
		iconClick(key) {
			if (this.slideIcon == key) {
				this.slideIcon = null;
			} else {
				this.slideIcon = key;
				this.$emit('iconChange', key);
			}
		}
	}
};
</script>

<style lang="less">
.bottom-more {
	padding-top: 10rpx ;
	.bottom-more-item {
		line-height: 70rpx;
		border-bottom: 2rpx solid #ccc;
		padding-left: 40rpx;
		&.cloactive {
			background: #ccc;
			color: #0091ff;
			border-left: 4rpx solid #0091ff;
		}
	}
}
.header-content-tab {
	display: flex;
	flex-direction: row;
	border-bottom: 1px solid #ccc;
	.tab-item {
		flex: 1;
		text-align: center;
		position: relative;
		padding: 20px 0rpx;
		&::after {
			content: '';
			width: 2rpx;
			height: 80rpx;
			margin-top: -40upx;
			background-color: #dad8d8;
			position: absolute;
			top: 50%;
			right: 2rpx;
		}
		&:last-child {
			&::after {
				width: 0;
			}
		}
		&.active {
			.title-main .title {
				color: #0091ff;
			}
			&::before {
				content: '';
				width: 90%;
				height: 4rpx;
				background-color: #0091ff;
				position: absolute;
				bottom: 0;
				left: 5%;
			}
		}

		.title-main {
			.title {
				width: 100%;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, sans-serif;
				font-weight: 400;
				color: #000;
				.head-portrait {
					width: 55rpx;
					height: 55rpx;
					// border-radius: 50%;
					// background: rgba(216, 216, 216, 1);
					// border: 2rpx solid rgba(151, 151, 151, 1);
				}
				.title-text {
					// margin-right: 10rpx;
					margin-left: 10rpx;
				}
				.u-icon {
				}
			}
			.cont{
				font-size: 24rpx;
				color: #999;
			}
		}
	}
	.tab-item-more {
		width: 10%;
	}
}
</style>
