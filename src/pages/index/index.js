// test.js
import { dataset, alert, push, redirect } from '../../utils/util.js';
import http from '../../libs/api.js';
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        totalResult: {
            access_count: '--',
            all_get_count: '--',
            total: '--'
        }
    },
    page: 1,
    pagesize: 20,
    has_next: true,
    loading: false,
    fetch() {
        if (!this.has_next) return
        this.loading = true;
        http.lst({
            page: this.page,
            pagesize: this.pagesize
        }, ).then(res => {
            this.loading = false;
            let { list } = this.data;
            list = list.concat(res.result);
            this.setData({ list });
            this.page++;
            this.has_next = res.has_next;
        })
    },
    total() {
        http.total().then(res => {
            this.setData({
                totalResult: res
            })
            console.log(res)
        })
    },
    publishRed() {
        console.log('发红包去咯')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetch();
        this.total();
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
        if (this.loading) return
        this.fetch()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})