// test.js
import extend from '../../libs/extends.js';
extend({
    data: {
        result: null,
        isNormal: true
    },
    id: null,
    loading: false,
    fetch() {
        if (this.loading) return
        this.loading = true;
        console.log(this.id)
        this.$http.getOne({
            red_log_id: this.id
        }).then(result => {
            this.loading = false;
            this.setData({ result });
            if (result.article) {
                this.setData({
                    isNormal: false
                })
                this.setItem('red_detail', result);
            }
        })
    },
    getDetail() {
        this.push("content_detail");
    },
    recording() {
        if (!this.data.isNormal) return
        this.alert('开始录音')
        this.$recordStart(this.id, (res) => {
            console.log(res)
        });
        // this.$http.getRed({
        //     red_log_id: this.id
        // }).then(res => {
        //     console.log(res)
        // })
    },
    stopRecord() {
        this.alert('录音结束')
        this.recorderManager.stop();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { id } = options;
        this.id = id;
        this.fetch();
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
        let result = this.getItemSync('red_detail');
        if (result && result.read) {
            // 如果已经阅读过广告了，清除缓存
            this.removeItem('red_detail');
            this.setData({
                isNormal: true
            })
        }
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