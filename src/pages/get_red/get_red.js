// test.js
import extend from '../../libs/extends.js';
extend({
    /**
     * 页面的初始数据
     */
    $openRefresh: function () {
        // something extra to do 
        return true
    },
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
    $init() {
        this.getOne();
        this.fetch();
        this.getOneMine();
    },
    onLoad: function (options) {
        let { id } = options;
        this.red_log_id = id;
        this.$init();
    },
    onReady: function () {
        this.$firstRender = false;
        this.$setBar({
            frontColor: "#ffffff",
            backgroundColor: "#c33b25",
        })
    },
    startPlay(e) {
        let { url } = this.dataset(e);
        this.$play(url);
    },
    getOne() {
        this.$http.getOne({
            red_log_id: this.red_log_id
        }).then(result => {
            if (!result) return
            this.loading = false;
            this.setData({ result });
            this.setItem("red_detail", result);
        })
    },
    fetch() {
        return this.$http.getRedLog({
            red_log_id: this.red_log_id
        }).then(res => {
            if (!res) return
            this.setData({
                list: res
            });
        })
    },
    getOneMine() {
        this.$http.getOneMine({
            red_log_id: this.red_log_id
        }).then(res => {
            if (!res) return
            this.setData({
                mine: res
            })
        })
    },
    returnHome() {
        this.$router.reLaunch('index');
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (!this.$firstRender) {
            this.$init()
        }
    },
})