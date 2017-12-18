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


// title	String	是	提示的内容	
// icon	String	否	图标，有效值 "success", "loading"	
// image	String	否	自定义图标的本地路径，image 的优先级高于 icon	1.1.0
// duration	Number	否	提示的延迟时间，单位毫秒，默认：1500	
// mask	Boolean	否	是否显示透明蒙层，防止触摸穿透，默认：false	
// success	Function	否	接口调用成功的回调函数	
// fail	Function	否	接口调用失败的回调函数	
// complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）

// showToast
export const alert = (title, type, time, success) => {
  switch (type) {
    case 'warn':
      return wx.showToast({
        title: title,
        image: '../../img/tip.svg',
        duration: 2000
      })
      break;
    default:
      return wx.showToast({
        title: title,
        icon: type || 'success',
        duration: time || 2000
      })
  }
}
// 显示loading
export const $loading = {
  start(params) {
    let init = params || {};
    init.mask = init.mask ? init.mask : true;
    wx.showLoading(init)
  },
  done() {
    wx.hideLoading();
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

// 数据缓存--sync 同步
export const setItem = (key, data, success) => wx.setStorage({ key, data, success });
export const setItemSync = wx.setStorageSync;
export const getItem = (key, success) => wx.getStorage({ key, success });
export const getItemSync = wx.getStorageSync;
export const getItems = (success, fail) => wx.getStorageInfo({ success, fail });
export const getItemsSync = wx.getStorageInfoSync;
export const removeItem = (key, success) => wx.removeStorage({ key, success });
export const removeItemSync = wx.removeStorageSync;
export const clearStorage = wx.clearStorage;
export const clearStorageSync = wx.clearStorageSync;




export default {
  formatTime,
  login,
  $loading,
  alert,
  dataset,
  $push: push,
  $redirect: redirect,
  $reLaunch: reLaunch,
  goback,
  setItem,
  setItemSync,
  getItem,
  getItemSync,
  getItems,
  getItemsSync,
  removeItem,
  removeItemSync,
  clearStorage,
  clearStorageSync
}