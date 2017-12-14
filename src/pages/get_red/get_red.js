// test.js
import extend from '../../libs/extends.js';
extend({
    /**
     * 页面的初始数据
     */
    data: {
        result: null,
        show: false,
        list: [],
        mine: null
    },
    red_log_id: null,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { id } = options;
        this.red_log_id = id;
        // this.red_log_id = 271;
        this.getOne();
        this.fetch();
        this.getOneMine();
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#c33b25",
            animation: {
                duration: 300,
                timingFunc: 'linear'
            }
        })
    },
    startPlay(e) {
        let { url } = this.dataset(e);
        console.log(url);
        this.$play(url);
    },
    getOne() {
        this.$http.getOne({
            red_log_id: this.red_log_id
        }).then(result => {
            if (!result) return
            this.loading = false;
            this.setData({ result });
        })
    },
    fetch() {
        this.$http.getRedLog({
            red_log_id: this.red_log_id
        }).then(res => {
            if (!res) return
            this.setData({
                list: res
            });
            console.log(res)
        })
    },
    getOneMine() {
        this.$http.getOneMine({
            red_log_id:this.red_log_id    
        }).then(res => {
            if (!res) return
            this.setData({
                mine: res
            })
            console.log(res);
        })
    },
    returnHome() {
        this.$reLaunch('index');
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})