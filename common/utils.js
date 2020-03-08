export default {
	 data_string(str, value) {
		if (value == "yyyy-MM-dd hh:mm:ss") {
			var d = eval('new ' + str.substr(1, str.length - 2));
			var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
			for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
			return ar_date.slice(0, 3).join('-') + ' ' + ar_date.slice(3).join(':');

			function dFormat(i) {
				return i < 10 ? "0" + i.toString() : i;
			}
		} else if (value == "yyyy-MM-dd") {
			var d = eval('new ' + str.substr(1, str.length - 2));
			var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
			for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
			return ar_date.join('-');

			function dFormat(i) {
				return i < 10 ? "0" + i.toString() : i;
			}
		}
	},
	/**
	 * 模板替换
	 * @param data 数据源
	 * @param template 模板内容
	 * @returns {*}
	 */
	templateReplace(data, template) {
		if (!template) {
			return
		}
		if (template === 'true') {
			return true
		}
		if (template === 'false') {
			return false
		}

		function getEval(t) {
			var variate = t.replace('${', '').replace('}', '')
			try {
				var value = eval('data.' + variate)
				if (value === undefined) {
					return t
				}
				return value
			} catch (e) {}
		}

		var reg = /\${(\w|\.|\d|\[|]+)*}/g
		var matchReg = template.match(reg)
		if (matchReg && matchReg.length == 1 && matchReg[0] == template) {
			return getEval(template)
		}

		return template.replace(reg, (t) => {
			return getEval(t)

		})
	},


	/* 
	 * 将cityNo 转 cityName
	 * cityData:原数据
	 * cityNo：二级地区编码
	 */
	getCityName(cityData, cityNo) {
		if (!cityNo) return;
		if (!(cityData instanceof Array)) return;
		// 9112
		cityNo += "";
		for (let i = 0; i < cityData.length; i++) {
			let sheng = cityData[i];
			for (let j = 0; j < sheng.children.length; j++) {
				let shi = sheng.children[j];
				if (shi.value == cityNo) {
					// 使用return 终止循环
					return `${sheng.label}-${shi.label}`;
				}
			}
		}
	},

	/* 
	 * obj 转 params字符串参数  
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = "";
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},

	/* 
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || "/";
		let paramsStr = "";
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += "?");
		url += paramsStr;
		return url;
	},

	/* 
	 * 获取url字符串参数
	 */
	getRequestParameters(locationhref) {
		let href = locationhref || "";
		let theRequest = new Object();
		let str = href.split("?")[1];
		if (str != undefined) {
			let strs = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},

	/* 
	 * 银行卡每四位空格
	 */
	formatCardNo(cardNo) {
		cardNo += "";
		return cardNo.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
	},

	/**
	 * 乘法，解决js精度损失问题
	 * @param {*} arg1 
	 * @param {*} arg2 
	 */
	accMul(arg1, arg2) {
		arg1 = arg1 || 0;
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	},
}
