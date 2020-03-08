<template>
	<view class="content">
		<view v-if="hasLogin">
			<view class="tongji">
				<view class="tongji-main">
					<view class="data-pick">
						<!-- <button type="primary" size="mini">点击切换</button> -->

						<dyDatePicker timeType="month" @getData="getData" :childValue="currentMonth" placeholder="请选择月份" minSelect="2000/01/01"
						 maxSelect="2025/12/31"></dyDatePicker>
					</view>
					<view class="out-in">
						<text style="margin-right: 20rpx;">支出: ¥{{parseFloat(amountAll.out).toFixed(2)}}</text>
						<text>收入: ¥{{parseFloat(amountAll.in).toFixed(2)}}</text>
					</view>
				</view>
				<view class="tongji-right">
					<view style="margin-bottom: 20rpx;" @click="goStacs" class="tj-btn">统计 ></view>
					<button type="primary" @click="goDetail(null)">新增账单</button>

				</view>
			</view>
			<view class="acct-list-wrap">
				<view class="acct-list-item" v-for="v,key in goodsList" :key="key">
					<view class="ava">
						<view class="ava-box">
							<image class="image-tap" :src="v.goods_ava"
							 mode=""></image>
						</view>
					</view>
					<view class="con">
						<view class="tit">{{v.goods}}</view>
						<view class="use-time">{{v.deal_time}}</view>
					</view>
					<view class="income">

						<view class="de-income" v-if="v.income_type == '0'">{{parseFloat(v.amount).toFixed(2)}}</view>
						<view class="de-income" v-if="v.income_type == '1'">-{{parseFloat(v.amount).toFixed(2)}}</view>
						<view class="action">
							<button @click="goDetail(v._id)" type="primary" style="background-color: #09BB07; padding:0 10rpx;margin-right: 15rpx;"
							 size="mini">修改</button>
							<button @click="deleteById(v._id)" size="mini" style="background-color: #F76260;padding:0 10rpx;color: #fff;line-height: 2;">删除</button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-if="!hasLogin" @click="toLogin" style="margin-top: 100rpx;"><button type="primary">您还未登录，去登录</button></view>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>

<script>
	import moment from 'moment';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import dyDatePicker from '@/components/dy-Date/dy-Date.vue'
	export default {
		components: {
			dyDatePicker,
			uniLoadMore
		},
		data() {
			return {
				
				currentMonth: "2020-03",
				amountAll: { in: 0,
					out: 0
				},
				status: 'more',
				visible: true,
				imageSrc: '',
				goodsList: [],
				// array: ['全部交易类型','微信', '支付宝', '淘宝'],
				currentType: ['全部交易类型'],
				pageDTO: {
					current: 1,
					size: 12
				},

			}
		},
		onShow() {
			if (this.hasLogin) {
				this.goodsList = [];
				this.pageDTO.current = 1
				this.getList()
				this.getGroup();
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onReachBottom(e) {
			this.status = 'loading';
			this.pageDTO.current++;
			this.getList().then((res) => {
				console.log(res)
				if (res && res.length > 0) {
					this.status = 'more';

				} else {
					this.status = 'noMore';
				}
			}).catch((err) => {
				this.status = 'noMore';
			})

		},
		onLoad() {

		},
		computed: {
			userInfo(){
				return this.$store.getters.userInfo;
			},
			hasLogin() {

				return this.$store.getters.hasLogin;
			},
			cutYear() {
				var momentTime = moment(this.currentMonth, "YYYY-MM")
				return momentTime.year();
			},
			cutMonth() {
				var momentTime = moment(this.currentMonth, "YYYY-MM")
				return momentTime.month() + 1;
			}
		},
		methods: {
			goStacs(){
				uni.navigateTo({
					url: `../index/statistics?id=${this.userInfo._id}`,
					
				});
			},
			getData(e) {
				this.currentMonth = e;
				this.amountAll.in = 0;
				this.amountAll.out = 0;
				this.goodsList = [];
				this.getGroup();
				this.getList();
			},
			getGroup() {
				uniCloud.callFunction({
					name: 'count',
					data: {
						dbname: 'bill',
						userid: this.userInfo._id,
						mat: {
							year: this.cutYear,
							month: this.cutMonth
						}
					}
				}).then(res => {
					console.log(res)
					var result = res.result.data;
					result.forEach((item, key) => {
						if (item._id.income_type == '0') {
							this.amountAll.in = item.total_amount;
						}
						if (item._id.income_type == '1') {
							this.amountAll.out = item.total_amount;
						}
					})

				})
			},
			getList() {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '处理中...'
					})
					uniCloud.callFunction({
						name: 'get',
						data: {
							dbname: 'bill',
							userid: this.userInfo._id,
							page: this.pageDTO,
							mat: {
								year: this.cutYear,
								month: this.cutMonth
							}
						}
					}).then((res) => {
						uni.hideLoading()
						var rs = res.result.data;
						if (rs.length > 0) {
							this.goodsList.push(...rs);
						}
						resolve(rs)
						// console.log(res)
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: `查询失败，错误信息为：${err.message}`,
							showCancel: false
						})
						reject(err)
						// console.error(err)
					})
				})

			},
			deleteById(id) {
				var that = this;
				uni.showModal({
					content: '你确定要删除该条记录吗?',
					success: res => {
						if (res.confirm) {
							this.removeById(id)
						} else if (res.cancel) {
							return;
						}
					}
				});
			},
			removeById(id) {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'remove',
					data: {
						dbname: 'bill',
						id: id,
					}
				}).then((res) => {
					var that = this
					console.log(res)
					uni.hideLoading()
					uni.showModal({
						content: `删除成功`,
						showCancel: false,
						success() {
							this.getGroup();
							that.goodsList.forEach((item, key) => {
								if (item._id == id) {
									that.goodsList.splice(key, 1)
								}
							})
						}
					})

				}).catch(err => {
					uni.hideLoading()
					uni.showModal({
						content: `删除失败${err.message}`,
						showCancel: false
					})
				})
			},

			bindPickerChange(e) {
				this.currentType = this.array[e.detail.value];
			},
			toLogin() {
				uni.navigateTo({
					url: `../user/login`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			goDetail(id) {
				console.log(id)
				if (id) {
					uni.navigateTo({
						url: `../bill/bill-detail?id=${id}`,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				} else {
					uni.navigateTo({
						url: `../bill/bill-detail`,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}

			}


		}
	}
</script>

<style lang="less">
	.content {
		margin-bottom: 100rpx;

		.tongji {
			padding: 0 25rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 20rpx;

			.tongji-main {
				.data-pick {
					font-size: 32rpx;
				}

				.out-in {
					font-size: 26rpx;
					color: #999;
				}
			}

			.tongji-right {
				.tj-btn {
					line-height: 100%;
					vertical-align: bottom;
					border-left: 1rpx solid #999;
					padding-left: 30rpx;
				}
			}
		}

		.acct-list-wrap {
			background-color: #fff;
			padding: 0 25rpx;
			padding-top: 25rpx;

			.acct-list-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				margin-bottom: 15rpx;

				.ava {
					width: 15%;

					.ava-box {
						width: 75rpx;
						height: 75rpx;

						// margin: auto;
						.image-tap {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}
				}

				.con {
					padding-bottom: 30rpx;
					width: 60%;
					border-bottom: 2rpx solid #ccc;

					.tit {
						color: #000;
						font-size: 28rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.use-time {
						color: #999;
						font-size: 24rpx;
					}
				}

				.income {


					text-align: right;
					width: 35%;
					border-bottom: 2rpx solid #ccc;

					.de-income {
						font-size: 32rpx;
						font-weight: bold;
					}

					.action {}
				}
			}
		}
	}
</style>
