import { $loading, removeItemSync, getItemSync, setItemSync } from '../utils/util';
import config from '../config/config';
import dev from '../is_develop';
export let TOKEN = getItemSync('token'); //|| '456456';//[123123,456456,789798]
const INFO = getItemSync('localInfo') || {};
const host = dev ? config.local : config.host;

//设置全局token
export const setToken = token => TOKEN = token;
//新的fetch---Promise封装 2017-08-01
let collections = [];
let lock = false;
const ajax = (url, params, config) => {
  let promise = new Promise((resolve, reject) => {
    let result = Object.assign({
      url: url,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: params,
      success: res => {
        $loading.done();
        if (lock) return
        // 从队列中删除这次请求
        collections.splice(task.idx, 1);        
        if (res.data.code <= -9999) {
          lock = true;
          removeItemSync('token');
          /***请求队列处理***/
          // 防止一个页面 多个请求 token失效 同时打开login页面 引起的错误  
          collections.forEach(function (t) {
            // 取消后面的所有请求
            t.abort();
          })
          collections = [];
          /**********************/
          wx.navigateTo({
            url: '/pages/login/login',
            success: function (data) {
              lock = false;
            },
            fail: function (err) {
              console.log(err)
            }
          })
          return false
        }
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
    $loading.start();
    let task = wx.request(result);
    // 请求队列
    collections.push(task);
    //设置对应的队列下标
    task.idx = collections.length - 1;
  });
  return promise.then(res => {
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
  return `${host}/red/${c}/${a}`
}
export const getImg = path => {
  return `${host}/static/red/${path}`
}


let uploadUrl = getUrl('index', 'ai_do');

let uploadImg = getUrl('index', 'upload');

// 生成语音红包
export const sendRed = (params, config) => ajax(getUrl('index', 'send_red'), params, config);
// 我的红包(发出)
export const myPacket = (params, config) => ajax(getUrl('index', 'my_lst'), params, config);
// 支付完成
export const payCbk = (params, config) => ajax(getUrl('index', 'pay_callback'), params, config);
// 我的余额
export const myBalance = (params, config) => ajax(getUrl('index', 'my_balance'), params, config);
// 帮助列表
export const helpLst = (params, config) => ajax(getUrl('index', 'help_lst'), params, config);

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
//获得红包日志
export const getRedLog = (params, config) => ajax(getUrl('index', 'lst_get_log'), params, config);
//获得个人单个红包获得的金额
export const getOneMine = (params, config) => ajax(getUrl('index', 'get_one_mine'), params, config);
// 登录
export const login = (params, config) => ajax(getUrl('index', 'auth'), params, config);
//邀请人
export const recmd = (params, config) => ajax(getUrl('index', 'recmd'), params, config);


export default {
  TOKEN,
  sendCode,
  setToken,
  getOne,
  lst,
  total,
  recmd,
  rich,
  winner,
  uploadUrl,
  getRed,
  getRedLog,
  getOneMine,
  uploadImg,
  sendRed,
  myPacket,
  payCbk,
  myBalance,
  getImg,
  helpLst
}