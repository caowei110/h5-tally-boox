<template>
	<view class="data-pick">
		<view>
			<dyDatePicker timeType="year" :childValue="currentYear" @getData="getYearData" placeholder="请选择年份" minSelect="2000/01/01"
			 maxSelect="2025/12/31"></dyDatePicker>
		</view>
		<view class="main">
			<view class="user" v-if="userid">个人的</view>
			<view class="user" v-else>所有人的</view>
			<view>年度收入 : ¥{{parseFloat(amountAll.out).toFixed(2)}}</view>
			<view>年度支出 : ¥{{parseFloat(amountAll.in).toFixed(2)}}</view>
		</view>
	</view>
</template>

<script>
	import dyDatePicker from '@/components/dy-Date/dy-Date.vue'
	import moment from 'moment';
	export default {
		components: {
			dyDatePicker,
		},
		data() {
			return {
				userid: '',
				currentYear: "2020",
				amountAll: { in: 0,
					out: 0
				},
			};
		},
		onLoad(query) {
			if (query.id && query.id != '') {
				this.userid = query.id
				this.getGroupByYear(query.id)
			} else {
				this.getGroupByYear()
			}

		},
		methods: {
			getYearData(e) {
				this.currentYear = e;
				this.getGroupByYear(this.userid);
			},
			getGroupByYear(userid) {
				this.amountAll = { in: 0,
					out: 0
				};
				var reqData = {
					name: 'countByYear',
					data:{
						dbname: 'bill',
						mat: {
							year: moment(this.currentYear, "YYYY").year()
						}
					}
				}
				if (userid) {
					reqData.data.userid = userid;
					
				}
				uniCloud.callFunction(reqData).then((res) => {
					console.log(res)
					var result = res.result.data;

					result.forEach((item) => {
						if (item._id.income_type == '0') {
							this.amountAll.in = item.total_amount
						}
						if (item._id.income_type == '1') {
							this.amountAll.out = item.total_amount
						}
					})
					console.log(res)
				})
			},
		}
	}
</script>

<style lang="less">

</style>
