import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const TOKEN = uni.getStorageSync("token") || "";
const OPENID = uni.getStorageSync("openId") || "";
const USER_INFO = uni.getStorageSync("userInfo") || {};
const CUSTOMER_INFO = uni.getStorageSync("customerInfo") || {};
const LOGIN_INFO = uni.getStorageSync("loginInfo") || {};

const store = new Vuex.Store({
	state: {
		// 是否強制登录
		forcedLogin: false,
		// 前端token
		token: TOKEN,
		// 用户openid
		openId: OPENID,
		// 用户信息 头像 昵称
		userInfo: {},
		// 用户的商户信息
		customerInfo: CUSTOMER_INFO,
		// 用户登录信息
		loginInfo: {},
	
	},
	getters: {
		// 用户是否登录
		hasLogin: state => {
			
			if (state.userInfo && state.userInfo._id) {
				return true;
			} else {
				return false
			}
		},
		userInfo: state => {
			return state.userInfo;
		}
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
			uni.setStorageSync("token", token);
		},
		SET_OPENID(state, openId) {
			state.openId = openId;
			uni.setStorageSync("openId", openId);
		},
		SET_USERINFO(state, userInfo) {
			state.userInfo = userInfo;
			uni.setStorageSync("userInfo", userInfo);
		},
		SET_CUSTOMERINFO(state, customerInfo) {
			state.customerInfo = customerInfo;
			uni.setStorageSync("customerInfo", customerInfo);
		},
		SET_LOGOUT(state) {
			state.token = "";
			uni.setStorageSync("token", "");
		}
	},
	actions: {
		Token({commit},data){
			commit('SET_TOKEN',data)
		},
		UserInfo({commit},data){
			commit('SET_USERINFO',data)
		},
	}
})

export default store
