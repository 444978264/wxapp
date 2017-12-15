// login.js
import extend from '../../libs/extends.js';

extend({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    disabled: false,
    lst: [],
    data: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.getUserInfo(userInfo => {
    //   //更新数据
    //   this.setData({
    //     userInfo: userInfo
    //   })
    // })
  },
  // init() {
  //   wx.showLoading({
  //     mask: true
  //   })
  //   cameraLst().then(res => {
  //     if (!res) return;
  //     console.log(res)
  //     if (!this.gallery_id) {
  //       //获取上次浏览记录
  //       let { last_visited } = res.g_info;
  //       this.gallery_id = last_visited;
  //     }
  //     this.setData({
  //       lst: res.result,
  //       data: res.g_info
  //     })
  //     wx.hideLoading();
  //   })
  // },
  toHelp: function() {
    wx.navigateTo({
      url: '../help/help'
    })
  },
  toMybalance: function() {
    wx.navigateTo({
      url: '../withdrawals/withdrawals'
    })
  },
  toMypacket: function () {
    wx.navigateTo({
      url: '../mypackets/mypackets'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  chooseItem(e) {
    const { id } = dataset(e);
    console.log(id)
    redirect('download', {
      gallery_id: id
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})