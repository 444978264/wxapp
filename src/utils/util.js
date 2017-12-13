function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const FormatTime = formatTime;

// 重新登陆
export const login = () => {
  wx.navigateTo({
    url: '/pages/login/login',
    success: function (res) {
      console.log(res)
    },
    fail: function (err) {
      console.log(err)
    }
  })
}

// showToast
export const alert = (title, type) => {
  switch (type) {
    case 'warn':
      return wx.showToast({
        title: title,
        icon: 'loading',
        image: '/img/tip.svg',
        duration: 2000
      })
      break;
    default:
      return wx.showToast({
        title: title,
        icon: type || 'success',
        duration: 2000
      })
  }
}

// 获取dataset的值
export const dataset = e => e.currentTarget.dataset;

//跳转页面---保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
export const push = (path, params) => {
  var str = '';
  if (params) {
    const keys = Object.keys(params);
    str = keys.reduce((start, next) => {
      if (start == '') {
        return `?${next}=${params[next]}`
      }
      return `${start}&${next}=${params[next]}`
    }, '')
    console.log(str)
  }
  wx.navigateTo({
    url: `/pages/${path}/${path}${str}`,
  })
}
// 关闭当前页面，跳转到应用内的某个页面。
export const redirect = (path, params) => {
  var str = '';
  if (params) {
    const keys = Object.keys(params);
    str = keys.reduce((start, next) => {
      if (start == '') {
        return `?${next}=${params[next]}`
      }
      return `${start}&${next}=${params[next]}`
    }, '')
    console.log(str)
  }
  wx.redirectTo({
    url: `/pages/${path}/${path}${str}`,
  })
}
//关闭所有页面，打开到应用内的某个页面。
export const reLaunch = (path, params) => {
  var str = '';
  if (params) {
    const keys = Object.keys(params);
    str = keys.reduce((start, next) => {
      if (start == '') {
        return `?${next}=${params[next]}`
      }
      return `${start}&${next}=${params[next]}`
    }, '')
    console.log(str)
  }
  wx.reLaunch({
    url: `/pages/${path}/${path}${str}`,
  })
}

export const goback = id => {
  wx.navigateBack({
    delta: id || 1
  })
}
export default {
  formatTime,
  login,
  alert,
  dataset,
  $push: push,
  $redirect: redirect,
  $reLaunch: reLaunch,
  goback
}