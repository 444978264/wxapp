// test.js
import extend from '../../libs/extends.js';
extend({
    $openRefresh() {
        return true
    },
    data: {
        result: null,
        isNormal: true,
        agreement: true
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
        this.$push("content_detail");
    },
    recording() {
        if (!this.data.agreement) {
            this.alert('请同意下面说明', "warn")
            return
        }
        if (!this.data.isNormal) {
            this.$push('content_detail')
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
                this.$push('get_red', {
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
        this.$http.recmd({
            recmd_userid: this.recmd_userid
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { id, recmd_userid } = options;
        this.recmd_userid = recmd_userid
        this.id = id;
        this.fetch();
        this.recmd();
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
        this.fetch();
        this.recmd();
        let result = this.getItemSync('red_detail');
        if (result && result.read) {
            // 如果已经阅读过广告了，清除缓存
            this.removeItem('red_detail');
            this.setData({
                isNormal: true
            })
        }
    },
})