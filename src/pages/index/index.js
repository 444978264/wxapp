// test.js
import extend from '../../libs/extends.js';
import { temp_pop } from '../template/template';
import _ from '../../libs/deepcopy';
let config = _.extend({}, temp_pop, {
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        totalResult: {
            access_count: '--',
            all_get_count: '--',
            total: '--'
        },
    },
    page: 1,
    pagesize: 20,
    has_next: true,
    loading: false,
    // 获取首页数据列表
    fetch() {
        if (!this.has_next) return
        this.loading = true;
        this.$http.lst({
            page: this.page,
            pagesize: this.pagesize
        }, ).then(res => {
            if (!res) return
            this.loading = false;
            let { list } = this.data;
            list = list.concat(res.result);
            this.setData({ list });
            this.page++;
            this.has_next = res.has_next;
        })
    },
    total() {
        this.$http.total().then(res => {
            if (!res) return
            this.setData({
                totalResult: res
            })
            console.log(res)
        })
    },
    getContent(e) {
        let { id, status } = this.dataset(e);
        if (status == 2) {
            this.$push('get_red', {
                id: id
            })
            return
        }
        // this.$push('content', {
        //     id: id
        // })
        this.checkMine(id)
    },
    // 检查是否抢过这个红包
    checkMine(id) {
        this.$http.getOneMine({
            red_log_id: id
        }).then(res => {
            //token失效处理
            if (!res.code && res.type == "sos") return;
            if (!res) {
                this.$push('content', {
                    id: id
                })
                return
            }
            this.$push('get_red', {
                id: id
            })
        })
    },
    publishRed(e) {
        console.log('发红包去咯')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetch();
        this.total();
        this.getDataSource();
        // this.$preLoad('hello world')
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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

extend(config);