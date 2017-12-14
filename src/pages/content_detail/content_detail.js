// test.js
import extend from '../../libs/extends.js';
extend({
    /**
     * 页面的初始数据
     */
    data: {
        result: null,
        second:1,
        showBtn: false
    },
    id:null,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let { id } = options;
        this.id = id;
        let result = this.getItemSync('red_detail');
        this.setData({ result })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.timer = setInterval(() => {
            let { second } = this.data;
            if (second < 2) {
                clearInterval(this.timer);
                this.setData({
                    showBtn: true
                })
                return
            }
            second--;
            this.setData({ second });
        }, 1000)
    },
    defaultTap() {
        // this.$redirect('content', {
        //     read: true,
        //     id:this.id
        // })
        let {result} = this.data;
        result.read = true;
        this.setItemSync('red_detail',result);
        this.goback();
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})