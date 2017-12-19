//app.js
import { login, setToken } from 'libs/api'
import { redirect } from 'utils/util'
App({
  onLaunch: function (res) {
    console.log('this is launch', res)
    this.globalData.page = res.path;
    //调用API从本地缓存中获取数据
    // this.login();
  },
  login(fn) {
    this.getUserInfo((code, { encryptedData, iv }) => {
      let params = {
        code: code,
        encryptedData,
        iv
      };
      wx.setStorage({
        key: 'code',
        data: params
      })
      //更新数据
      login(params, fn)
    })
  },
  getUserInfo: function (cb) {
    var that = this
    let token = wx.getStorageSync('token');
    if (token) {
      // token存在就直接跳转index页面
      redirect('index')
    } else {
      //调用登录接口
      wx.getSetting({
        success: (config) => {
          wx.login({
            success: function (data) {
              // console.log(data.code) // 登陆凭证获取openid
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo;
                  console.log(res)
                  typeof cb == "function" && cb(data.code, res)
                }
              })
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    page: null
  },
})