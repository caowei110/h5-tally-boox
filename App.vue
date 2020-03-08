<script>
	export default {
		onLaunch: function() {
			this.$store.dispatch('UserInfo',{})
			
		},
		 onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			/* this.$store.commit("SET_TOKEN", null);
			this.$store.commit("SET_USERINFO", {}); */
		},
		globalData: {
			test: ''
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	
	
	page {
	    background-color: #F4F5F6;
	    height: 100%;
	    font-size: 28upx;	
	    line-height: 1.8;
	}
	/* #endif*/
	

</style>

