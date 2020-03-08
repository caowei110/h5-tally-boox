import Vue from 'vue'
/* import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn') */

import config from '@/config/index.config.js'

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

/* Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
}) */

/**
 * 截取字符串
 */
Vue.filter('substr', function (dataStr, start, end) {
  if (!dataStr) {
    return '--'
  }
  if (!start) {
    start = 3
  }
  if (!end) {
    end = 3
  }
  var starStr = ''
  var starLength = dataStr.length - start - end;
  if (starLength > 3) {
    for (var i = 0; i < starLength; i++) {
      starStr += '*'
    }
  }else{
    starStr = "***"
  }
  return dataStr.substr(0, start) + starStr + dataStr.substr(-end)
})

Vue.filter('fileUri', function (uri) {
  if (!uri) {
    return ''
  }
  if (uri.indexOf('http://') == 0 || uri.indexOf('https://') == 0) {
    return uri
  }
  return config.imgBaseUrl + uri
})
/**
 * 动态路由
 */
Vue.filter('router-link', function (url) {
  if (url.indexOf('/') == 0) {
    return 'router-link'
  }
  return 'a-router-link'
})
