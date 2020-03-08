import http from "./http.js";
import config from "@/config/index.config.js";

// 用户登录
export const postLogin = (data) => http.POSTformdata(`${config.baseUrl}/website-uaa/oauth/token`, data);
