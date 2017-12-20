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
    data: null,
    friendsList: [],
    show: false
  },
  page: 1,
  has_next: false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  toHelp() {
    wx.navigateTo({
      url: '../help/help'
    })
  },
  toMybalance() {
    wx.navigateTo({
      url: '../withdrawals/withdrawals'
    })
  },
  toMypacket() {
    wx.navigateTo({
      url: '../mypackets/mypackets'
    })
  },
  getMyfriendsList() {
    this.$http.friendsList({
      page: this.page,
      pagesize: 20
    }).then(res => {
      this.setData({
        friendsList: res.result
      })
      this.has_next = res.has_next;
    })
  },
  checkCode() {
    this.setData({
      show: true
    })
  },
  hideCode() {
    this.setData({
      show: false
    })
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
    this.getMyfriendsList();
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
    if(!this.has_next) return;
    this.page++;
    this.getMyfriendsList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})