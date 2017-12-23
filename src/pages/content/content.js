// test.js
import extend from '../../libs/extends.js';
let app = getApp();
//全局app
extend({
    // $shareParams: {
    //     title: 'content',
    // },
    $openRefresh() {
        return true
    },
    data: {
        result: null,
        isNormal: true,
        agreement: true,
        canJoin: true
    },
    id: null,
    recmd_userid: null,
    loading: false,
    fetch() {
        if (this.loading) return
        this.loading = true;
        console.log(this.id)
        return this.$http.getOne({
            red_log_id: this.id
        }).then(result => {
            if (!result) return
            this.loading = false;
            this.setData({ result }, () => {
                // 查询当前所在地
                app.getLocation({
                    always: () => {
                        let { result, canJoin, isNormal } = this.data;
                        canJoin = this.checkJoin();
                        this.setData({
                            canJoin
                        })
                    }
                })
            });
            if (result.article && !this.checkRead()) {
                this.setItem('red_detail', result);
                this.setData({
                    isNormal: false
                })
            }
        })
    },
    checkJoin() {
        let { article } = this.data.result;
        // 不存在article为普通红包
        if (!article) return true;
        let { area } = article;
        let { location } = app.globalData;
        if (location == null && area !== '全国') {
            // 未开启定位
            this.$message("未开启定位授权，无法获取当前位置", {
                confirmText: '去开启',
                success: () => {
                    this.$router.push('404', {
                        from: 'content',
                        prop: 'location'
                    });
                },
                showCancel: true
            })
            return false
        } else if (area !== "全国" && !area.includes(location.addressComponent.city)) {
            //不在广告投放的区域范围内
            this.$message(`很遗憾，您当前所在城市（${location.addressComponent.city}）不在可抢范围内！该红包仅限${area}以上城市用户可抢。`, {
                confirmText: '知道了'
            })
            return false
        }
        return true
    },
    // 是否阅读过广告
    checkRead() {
        let result = this.getItemSync('red_detail');
        if (result && result.read) {
            // 如果已经阅读过广告了，清除缓存
            this.removeItem('red_detail');
            this.setData({
                isNormal: true
            })
            return true
        }
        return false
    },
    getDetail() {
        this.$router.push("content_detail");
    },
    recording() {
        if (!this.data.agreement) {
            this.alert('请同意下面说明', "warn")
            return
        }
        if (!this.data.canJoin) {
            this.alert('您不符合条件', "warn")
            return
        }
        if (!this.data.isNormal) {
            this.$router.push('content_detail')
            return
        }
        this.$recordStart({
            red_log_id: this.id
        }, res => {
            console.log(res)
            let params = {
                red_log_id: this.id,
                ai_id: res.result.id
            }
            this.$http.getRed(params).then(res => {
                if (!res) return
                this.$router.push('get_red', {
                    id: this.id
                })
                console.log(res)
            })
        });

    },
    stopRecord() {
        this.recorderManager.stop();
    },
    checkboxChange(value) {
        let { agreement } = this.data;
        this.setData({
            agreement: !agreement
        })
    },
    recmd() {
        if (this.recmd_userid == null || !this.recmd_userid) return
        this.$http.recmd({
            recmd_userid: this.recmd_userid
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { id, recmd_userid } = options;
        this.recmd_userid = recmd_userid ? recmd_userid : null;
        this.id = id;
        this.fetch();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (!this.$firstRender) {
            this.fetch();
        }
        this.recmd();
    }
})