// login.js
import extend from '../../libs/extends.js';
extend({
  /**
   * 页面的初始数据
   */
  data: {
    motto: '立即 进入',
    userInfo: {},
    disabled: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$app.login(userInfo => {
      //更新数据
      this.setData({
        userInfo: this.$app.globalData.userInfo,
        disabled: false
      })
      if (getCurrentPages().length > 1) {
        this.goback();
      }else{
        this.$push('index');
      }
    })
  },
  defaultTap() {
    this.$push('index')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})