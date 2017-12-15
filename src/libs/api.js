export let TOKEN = wx.getStorageSync('token'); //|| '456456';//[123123,456456,789798]
const INFO = wx.getStorageSync('localInfo') || {};

//设置全局token
export const setToken = token => TOKEN = token;

//新的fetch---Promise封装 2017-08-01
const ajax = (url, params, config) => {
  var promise = new Promise((resolve, reject) => {
    let result = Object.assign({
      url: url,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: params,
      success: res => {
        wx.hideLoading();
        resolve(res.data)
      },
      fail: err => reject(err)
    }, config);
    if (!result.data) {
      result.data = {
        token: TOKEN
      };
    } else {
      result.data.token = TOKEN;
    }
    console.log(result.data)
    //显示loading
    wx.showLoading({
      mask: true
    });
    wx.request(result);
  });
  return promise.then(res => {
    if (res.code <= -9999) {
      console.log(res.msg)
      wx.navigateTo({
        url: '/pages/login/login',
        success: function (data) {
          console.log(data)
        },
        fail: function (err) {
          console.log(err)
        }
      })
      return {
        type: 'sos',
        code: false
      }
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
  return `https://wss.yunruikj.com/red/${c}/${a}`
  // return `http://www.yunruischedule.com:8888/red/${c}/${a}`
}

let uploadUrl = getUrl('index', 'ai_do');

let uploadImg = getUrl('index', 'upload');

// 生成语音红包
export const sendRed = (params, config) => ajax(getUrl('index', 'send_red'), params, config);
// 我的红包(发出)
export const myPacket = (params, config) => ajax(getUrl('index', 'my_lst'), params, config);
// 支付完成
export const payCbk = (params, config) => ajax(getUrl('index', 'pay_callback'), params, config);

//发送验证码
export const sendCode = (params, config) => ajax(getUrl('index', 'get_code'), params, config);
//红包详情
export const getOne = (params, config) => ajax(getUrl('index', 'get_one'), params, config);
//红包列表
export const lst = (params, config) => ajax(getUrl('index', 'lst'), params, config);
//今日统计
export const total = (params, config) => ajax(getUrl('index', 'total'), params, config);
//今日土豪
export const rich = (params, config) => ajax(getUrl('index', 'rich'), params, config);
//手气最佳
export const winner = (params, config) => ajax(getUrl('index', 'winner'), params, config);
//获得红包
export const getRed = (params, config) => ajax(getUrl('index', 'get_red'), params, config);
//获得红包
export const recognize = (params, config) => ajax(getUrl('index', 'ai_do'), params, config);
//获得红包日志
export const getRedLog = (params, config) => ajax(getUrl('index', 'lst_get_log'), params, config);
//获得个人单个红包获得的金额
export const getOneMine = (params, config) => ajax(getUrl('index', 'get_one_mine'), params, config);

export const login = (params, fn, config) => ajax(getUrl('index', 'auth'), params, config).then(res => {
  setToken(res.token)
  console.log(TOKEN)
  fn && fn(res);
  wx.setStorageSync("token", res.token);
});


export default {
  TOKEN,
  sendCode,
  setToken,
  getOne,
  lst,
  total,
  rich,
  winner,
  uploadUrl,
  getRed,
  getRedLog,
  getOneMine,
  uploadImg,
  sendRed,
  myPacket,
  payCbk
}