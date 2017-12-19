// login.js
import extend from '../../libs/extends.js';
extend({
  /**
   * 页面的初始数据
   */
  data: {
    motto: '进入',
    userInfo: {},
    disabled: true
  },
  loading: false,
  /**
   * 生命周期函数--监听页面加载
   */
  init() {
    if (this.loading) return;
    this.$loading.start({
      title: '正在登录中...'
    })
    this.loading = true;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.$app.login(userInfo => {
      this.loading = false;
      wx.hideNavigationBarLoading() //完成停止加载
      //更新数据
      this.setData({
        userInfo: this.$app.globalData.userInfo,
        disabled: false
      })
      if (getCurrentPages().length > 1) {
        this.goback();
      } else {
        this.$redirect('index');
      }
    })
  },
  onLoad: function (options) {
    this.init();
  },
  defaultTap() {
    this.$push('index')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  }
})