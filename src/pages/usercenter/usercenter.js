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
  has_next: true,
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
  $openRefresh() {
    this.page = 1;
    this.has_next = true;
    return true;
  },
  toHelp() {
    this.$router.push('help');
  },
  toMybalance() {
    this.$router.push('withdrawals');
  },
  toMypacket() {
    this.$router.push('mypackets');
  },
  fetch() {
    return this.$http.friendsList({
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetch();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.has_next) return;
    this.page++;
    this.fetch();
  }
})