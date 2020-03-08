<template>
	<view>
		<view class="feedback-body">
			<view class="serial-num-find" >
				<form @submit="formSubmit">
					<view class="input-item">
						<view class="input-label">交易类型*</view>
						<view class="uni-input-con uni-input-radio">
							<radio-group name="income_type"  v-model="detailData.income_type">
								<label class="radio" v-for="v,index in incomeType " :key="index" style="margin-right: 40rpx;">
									<radio :value="v.id" :disabled="allDisable" :checked="index == detailData.income_type"/>
									{{v.name}}
								</label>
								
							</radio-group>
						</view>
					</view>
					<view class="input-item">
						<view class="input-label">交易类型*</view>
						<view class="uni-input-con uni-input-radio">
							<radio-group name="type"  v-model="detailData.type">
								<label class="radio" v-for="v,index in type " :key="index" style="margin-right: 40rpx;">
									<radio :value="v.id" :disabled="allDisable" :checked="index == detailData.type"/>
									{{v.name}}
								</label>
								
							</radio-group>
						</view>
					</view>
					<view class="input-item">
						<view class="input-label">工号*</view>
						<input class="uni-input-con" :disabled="allDisable" v-model="detailData.job_num" name="job_num" placeholder="请输入工号" />
					</view>
					<view class="input-item">
						<view class="input-label">商品名称*</view>
						<input class="uni-input-con" :disabled="allDisable" v-model="detailData.goods" name="goods" placeholder="请输入商品名称" />
					</view>
					<view class="input-item">
						<view class="input-label">单价*</view>
						<input class="uni-input-con" :disabled="allDisable" v-model="detailData.unit_price" name="unit_price" placeholder="请输入单价" />
					</view>
					<view class="input-item">
						<view class="input-label">数量*</view>
						<input class="uni-input-con" :disabled="allDisable" v-model="detailData.goods_num" name="goods_num" placeholder="请输入数量" />
					</view>
					<view class="input-item">
						<view class="input-label">金额小计</view>
						<input class="uni-input-con"  :value="amount" name="amount" disabled="true" />
					</view>
					<view class="input-item">
						<view class="input-label">操作员</view>
						<input class="uni-input-con" :value="user.name"  disabled="true"/>
						<input class="uni-input-con" style="display: none;" :value="user._id" name="modificat_id" disabled="true"/>
					</view>
					<view class="input-item">
						<view class="input-label">交易日期</view>
						<view class="page">
							<view @tap="toggleTab()" v-if="!allDisable">{{pickDateTime ? pickDateTime:'选择时间'}}</view>
							<view  v-else>{{pickDateTime ? pickDateTime:'选择时间'}}</view>
							<yu-datetime-picker @confirm="onConfirm" startYear="2000" ref="dateTime" name="deal_time" :value="detailData.deal_time" :isAll="true" :current="false"></yu-datetime-picker>
						</view>
					</view>
					<view class="input-item">
						<view class="input-label">交易图片 <button v-if="!allDisable" style="float: right;height: 60rpx;margin-top: 20rpx;font-size: 28rpx;" type="primary" size="mini" @click="upload">点击上传</button></view>
						<view>
							
							<image class="upload-preview" style="width: 100rpx;height: 100rpx;background: #ccc;" :src="detailData.goods_ava" mode="widthFix"></image>
						</view>
					</view>
					<view class="bom-btn" v-if="!allDisable">
						<button type="primary" class="btn-submit btn" form-type="submit">提交</button>
						<button type="primary" class="btn-submit btn" form-type="reset">重填</button>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import util from '@/common/utils.js'
	import yuDatetimePicker from "@/components/yu-datetime-picker/yu-datetime-picker.vue"
	export default {
		components: {
			yuDatetimePicker
		},
		data() {
			return {
				allDisable:false,
				type:[{id:'0',name:'微信'},{id:'1',name:'支付宝'},{id:"2",name:'现金'},],
				incomeType:[{id:'0',name:'收入'},{id:'1',name:'支出'}],
				pickDateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				id:'',
				detailData:{},
				user:this.$store.getters.userInfo || {},
			}
		},
		computed:{
			amount(){
				return this.detailData.unit_price*this.detailData.goods_num;
			}
		},
		onLoad(query){
			if(query && query.id){
				this.id = query.id;
				this.getById()
				console.log(query.disabled)
				if(query.disabled){
					this.allDisable = true
				}
			}
		},
		
		methods: {
			goMylist(){
				uni.switchTab({
					url: `../my-list/my-list`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			formSubmit(e){
				var params = e.detail.value;
				//todo 表单验证位置
				
				params.amount  = Number(params.amount)
				params.goods_num  = Number(params.goods_num)
				params.unit_price  = Number(params.unit_price)
				
				var momentTime = moment(this.pickDateTime, "YYYY-MM-DD HH:mm:ss")
				params.deal_year = momentTime.year();
				params.deal_month = momentTime.month()+1;				
				params.goods_ava = this.detailData.goods_ava;
				
				params.deal_time = this.pickDateTime;
				uni.showModal({
					content: '你确定要提交吗?',
					success: res => {
						if (res.confirm) {
							if(this.id){
								this.updateById(params)
							}else{
								this.add(params)
							}
							
						} else if (res.cancel) {
							return;
						}
					}
				});
			},
			add(formData){
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'add',
					data: {
						dbname: 'bill',
						data:formData
					}
				}).then((res)=>{
					console.log(res)
					uni.hideLoading()
					uni.showModal({
						content: `新增成功`,
						showCancel: false
					})
					this.goMylist()
				}).catch(err=>{
					uni.hideLoading()
					uni.showModal({
						content: `新增失败${err.message}`,
						showCancel: false
					})
				})
			},
			updateById(formData){
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'update',
					data: {
						dbname: 'bill',
						id: this.id,
						data:formData
					}
				}).then((res)=>{
					console.log(res)
					uni.hideLoading()
					uni.showModal({
						content: `修改成功`,
						showCancel: false
					})
					this.goMylist()
				}).catch(err=>{
					uni.hideLoading()
					uni.showModal({
						content: `修改失败${err.message}`,
						showCancel: false
					})
				})
			},
			
			getUserById(userId){
				uniCloud.callFunction({
					name: 'getById',
					data: {
						dbname: 'user',
						id: userId
					}
				}).then(res=>{
					uni.hideLoading()
					this.user = res.result.data[0];
					console.log(this.user)
				}).catch(err=>{
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			},
			getById(){
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'getById',
					data: {
						dbname: 'bill',
						id: this.id
					}
				}).then(res=>{
					uni.hideLoading()
					this.detailData = res.result.data[0];
					this.getUserById(this.detailData.modificat_id)
					this.pickDateTime =  this.detailData.deal_time;
					console.log(this.detailData)
				}).catch(err=>{
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			},
			toggleTab(item, index) {
				this.$refs.dateTime.show();
			},
			onConfirm(val) {
				this.pickDateTime = val.selectRes
				console.log(val);
			},
			upload() {
				new Promise((resolve, reject) => {
					uni.chooseImage({
						chooseImage: 1,
						success: res => {
							const path = res.tempFilePaths[0]
							const options = {
								filePath: path
							}
							resolve(options)
						},
						fail: () => {
							reject(new Error('Fail_Cancel'))
						}
					})
				}).then((options) => {
					uni.showLoading({
						title: '文件上传中...'
					})
					return uniCloud.uploadFile(options)
				}).then(res => {
					uni.hideLoading()
					// console.log(res);
					this.detailData.goods_ava= res.fileID;
					uni.showModal({
						content: '图片上传成功，已在下方展示',
						showCancel: false
					})
					this.imageSrc = res.fileID
				}).catch((err) => {
					uni.hideLoading()
					console.log(err);
					if (err.message !== 'Fail_Cancel') {
						uni.showModal({
							content: `图片上传失败，错误信息为：${err.message}`,
							showCancel: false
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
.feedback-body {
	background-color: #fff;
	padding: 20rpx 30rpx;
	.input-item {
		margin-bottom: 30rpx;
	}
	.uni-input-con {
		border: 2rpx solid #ccc;
		line-height: 40rpx;
		height: 60rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}
	.text-area-a {
		width: auto;
		background-color: #fff;
		padding: 10rpx;
	}
	.input-label {
		font-size: 32rpx;
		color: #000;
		line-height: 80rpx;
	}
	.uni-input-radio {
		border: 0;
	}
	.bom-btn {
		display: flex;
		flex-direction: row;
		-moz-column-gap: 40rpx; /* Firefox */
		-webkit-column-gap: 40rpx; /* Safari 和 Chrome */
		column-gap: 40rpx;
		justify-content: space-around;
		.btn {
			flex: 1;
			// width: 40%;
			margin-right: 20rpx;
			&:last-child {
				margin-right: 0;
				background-color: #f96d6d;
			}
		}
	}
}
</style>
