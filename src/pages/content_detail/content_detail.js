// test.js
import extend from '../../libs/extends.js';
extend({
    /**
     * 页面的初始数据
     */
    data: {
        result: null,
        second: 5,
        showBtn: false
    },
    id: null,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let { id } = options;
        this.id = id;
        let result = this.getItemSync('red_detail');
        result.article.content = JSON.parse(result.article.content);
        this.setData({ result })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onShow: function () {
        this.timer = setInterval(() => {
            let { second } = this.data;
            if (second < 2) {
                clearInterval(this.timer);
                this.setData({
                    showBtn: true
                }, () => {
                    wx.createSelectorQuery().select('#btn-back').boundingClientRect(function (rect) {
                        // 使页面滚动到底部
                        wx.pageScrollTo({
                            scrollTop: rect.bottom
                        })
                    }).exec()
                })
                return
            }
            second--;
            this.setData({ second });
        }, 1000)
    },
    onHide: function () {
        clearInterval(this.timer);
    },
    defaultTap() {
        let { result } = this.data;
        result.read = true;
        this.setItemSync('red_detail', result);
        this.goback();
    },
})