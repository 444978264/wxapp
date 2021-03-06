// test.js
import extend from '../../libs/extends.js';
import { temp_pop } from '../template/template';
import _ from '../../libs/deepcopy';
let config = _.extend({}, temp_pop, {
    // 分享配置
    // $shareParams: {
    //     title: '主页',
    // },
    // 打开刷新
    $openRefresh() {
        this.total();
        this.getDataSource();
        this.page = 1;
        this.has_next = true;
        return true
    },
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
    recmd_userid: null,
    page: 1,
    pagesize: 20,
    has_next: true,
    loading: false,
    recmd() {
        if (this.recmd_userid == null || !this.recmd_userid) return
        this.$http.recmd({
            recmd_userid: this.recmd_userid
        })
    },
    // 获取首页数据列表
    fetch() {
        if (!this.has_next) return
        this.loading = true;
        return this.$http.lst({
            page: this.page,
            pagesize: this.pagesize
        }).then(res => {
            if (!res) return
            this.loading = false;
            if (!res.result.length) return;
            let { list } = this.data;
            if (this.page > 1) {
                list = list.concat(res.result);
            } else {
                list = res.result;
            }
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
        })
    },
    getContent(e) {
        let { id, status } = this.dataset(e);
        if (status == 2) {
            this.$router.push('get_red', {
                id: id
            })
            return
        }
        this.checkMine(id)
    },
    // 检查是否抢过这个红包
    checkMine(id) {
        this.$http.getOneMine({
            red_log_id: id
        }).then(res => {
            this.loading = false;
            if (!res || res.status == 0) {
                this.$router.push('content', {
                    id: id
                })
                return
            }
            this.$router.push('get_red', {
                id: id
            })
        })
    },
    publishRed(e) {
        this.$router.push('envelopes');
    },
    $init() {
        this.getDataSource();
        this.fetch();
        this.total();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { recmd_userid } = options;
        this.recmd_userid = recmd_userid ? recmd_userid : null;
        this.$init();
        // if (this.getItemSync("already_pop")) return
        this.$message("为构建和谐网络环境，如发现以下行为，一经查处将立刻删除内容，严重者直接封禁账号处理，不予以复议。 1.不允许传播不文明及违法内容。2.不允许诱导分享。请仔细阅读，因违规造成的损失，本司概不负责。", {
            success: () => {
                // this.setItem("already_pop", true);
            }
        })
    },
    onShow: function () {
        if (!this.$firstRender) {
            this.$init();
        }
        this.recmd();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.loading) return
        this.fetch()
    }
})

extend(config);