let TOKEN = wx.getStorageSync('token') || '';
const INFO = wx.getStorageSync('localInfo') || {};

//设置全局token
export const setToken = token => TOKEN = token;

//新的fetch---Promise封装 2017-08-01
const ajax = (url, params) => {
  var promise = new Promise((resolve, reject) => {
    // let { success, fail, ...other } = params;
    let result = Object.assign({
      url: url,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => resolve(res.data),
      fail: err => reject(err)
    }, params);

    if (!result.data) {
      result.data = {
        token: TOKEN
      };
    } else {
      result.data.token = TOKEN;
    }
    wx.request(result);
  });
  return promise.then(res => {
    if (res.code <= -9999) {
      console.log(res, 'promise')
      wx.navigateTo({
        url: '/pages/login/login',
        success: function (data) {
          console.log(data)
        },
        fail: function (err) {
          console.log(err)
        }
      })
      return false
    }
    if (res.code < 0) {
      wx.showToast({
        title: res.msg,
        icon: 'loading',
        image: '/img/tip.svg',
        duration: 2000
      })
      return false
    }
    if (res.simple_client && typeof res.result == 'object') {
      res.result.g_info = res.simple_client;
    }
    console.log(res, '源数据')
    return res.result
  }).catch(err => console.log(err, url, 'fail'))
}

//获取接口地址
export const getUrl = (c, a) => {
  return `https://mi.yunruikj.com/hx/index.php/apx/${c}/${a}`
  // return `http://www.yunruischedule.com:8888/apx/${c}/${a}`
}


//发送验证码
export const sendCode = params => ajax(getUrl('index', 'get_code'), params);

// 登陆
export const goLogin = params => ajax(getUrl('index', 'auth'), params);

// 获取图库列表
export const getList = (params) => ajax(getUrl('index', 'lst'), params);

//发送共享
export const sendMsg = params => ajax(getUrl('adm', 'add'), params);

//下载次数统计
export const loadCount = params => ajax(getUrl('index', 'download'), params);

// 获取所有相册
export const cameraLst = params => ajax(getUrl('gallery', 'lst'), params);

// 转发
export const share = params => ajax(getUrl('adm', 'share'), params);

// 加入分享
export const fromShare = params => ajax(getUrl('index', 'check_share'), params);

// 加入分享
export const getOneLst = params => ajax(getUrl('gallery', 'get_one'), params);

// 删除记录
export const del = params => ajax(getUrl('adm', 'del'), params);

// 删除成员
export const memberDel = params => ajax(getUrl('gallery', 'del_user'), params);

// 设置发布权限
export const setPublish = params => ajax(getUrl('gallery', 'auth_user'), params);