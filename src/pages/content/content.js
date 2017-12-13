// test.js
import extend from '../../libs/extends.js';
extend({
    /**
     * 页面的初始数据
     */
    data: {
        result:null,
    },
    id: null,
    loading: false,
    fetch() {
        if(this.loading)return 
        this.loading = true;
        console.log(this.id)
        this.$http.getOne({
            red_log_id: this.id
        }).then(result => {
            this.loading = false;
            this.setData({result})
            this.setItem('red_detail',result.article);
        })
    },
    getContent(e) {
        let { id } = this.dataset(e);
        this.$push('content', {
            id: id
        })
    },
    recording(){
        console.log('抢红包开始');
        this.$http.getRed({
            red_log_id:this.id
        }).then(res=>{
            console.log(res)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { id } = options;
        this.id = id;
        this.fetch();
        // this.$preLoad('hello world')
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})