import store from "@/store"
import vue from 'vue'


function HTTP(obj, config) {

	let defaultConfig = {
		isRes: false,
		loading: false
	}

	config = { ...defaultConfig,
		...config
	}


	// 如果需要显示loading,mask防止点击穿透
	config.loading && uni.showLoading({
		title: '加载中',
		mask: true
	});
	// let token = uni.getStorageSync("token");
	let token = store.getters.token;

	return new Promise((resolve, reject) => {
		let options = {
			url: "",
			sslVerify: false,
			method: "GET",
			data: {},
			dataType: "json",
			header: {
				"Authorization": token ? 'Bearer ' + token : 'Basic d2ViLWFwcDp0bHc2ODg=',
				"Content-Type": "application/json",
				"X-requested-With": "XMLHttpRequest",
				"Accept": "application/json, text/plain, */*"
			},
			success: (res) => {
				uni.hideLoading();
				// 状态码为200
				if (res.statusCode == 200) {
					let data = res.data;
					resolve(data || true)
				} else {
					uni.showToast({
						title: "HTTP:状态码异常！",
						icon: "none",
					})
					if (res.statusCode == 401) {
						uni.showModal({
							content: '您还未登录，去登录？',
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url:'/pages/login/login'
									})
								} else if (res.cancel) {
									return
								}
							}
						});
					}

					reject(res.data);
				}
			},
			fail: (err) => {
				//清除token
				store.dispatch('Token', null);
				console.log(store.token)
				uni.hideLoading();
				uni.showToast({
					title: "网络异常，请稍后再试!",
					icon: "none",
				})
				reject(err);
			},
			complete: () => {}
		}

		options = { ...options,
			...obj
		};
		const OPENID = uni.getStorageSync("openId");
		if (OPENID) options["header"]["openId"] = OPENID;
		if (options.method == "PUT") options["header"]["Content-Type"] = "application/json";

		if (options.url && options.method) {
			wx.request(options);
		} else {
			wx.showToast({
				title: 'HTTP：缺失参数',
				icon: "none",
				duration: 2000
			})
		}
	})

}


export default {
	GET(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "GET"
		}, config);
	},
	POST(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "POST"
		}, config);
	},
	PUT(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "PUT",

		}, config);
	},
	POSTformdata(url, data = {}, config) {
		let token = store.getters.token;
		return HTTP({
			url,
			data,
			method: "POST",
			header: {
				"Authorization": token ? 'Bearer ' + token : 'Basic d2ViLWFwcDp0bHc2ODg=',
				"Content-Type": "application/x-www-form-urlencoded",
				"X-requested-With": "XMLHttpRequest",
				"Accept": "application/json, text/plain, */*"
			},
		}, config);
	}
}
