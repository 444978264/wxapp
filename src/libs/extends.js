import options from '../utils/util';
import $router from '../utils/route';
import $http from './api';
import { TOKEN, getImg } from './api';
import _ from './deepcopy';
import shareConfig from '../config/share.config';
// 全局录音--唯一
const recorderManager = wx.getRecorderManager();
// 全局播放--唯一
const innerAudioContext = wx.createInnerAudioContext();

var config = {
    ...options,
    $http,
    //初次渲染开关，防止onLoad 和 onShow 中事件多次触发，在onReady 中 关闭
    $firstRender: true,
    // 播放    
    $play(url) {
        url = `${url}?time=${+new Date()}`;
        this.innerAudioContext.autoplay = true;
        this.innerAudioContext.src = url;
        this.innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        this.innerAudioContext.onError((res) => {
            console.log(res.errCode, res.errMsg)
        })
    },
    // 上传文件
    uploadFile(tempFilePath, data, cbk) {
        console.log('开始上传文件', "upload")
        wx.uploadFile({
            url: this.$http.uploadUrl,
            filePath: tempFilePath,
            name: 'file',
            formData: {
                ...data,
                token: TOKEN
            },
            success: res => {
                let result = JSON.parse(res.data);
                console.log(result)
                if (result.code <= -9999) {
                    this.removeItemSync('token');
                    this.$push('login');
                    return
                }
                if (result.code < 0) {
                    this.alert(result.msg)
                    return
                }
                console.log('上传成功，开始识别语音')
                cbk && cbk(result)
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    // 录音
    $recordStart(id, cbk) {
        const options = {
            duration: 15000,
            sampleRate: 16000,
            numberOfChannels: 1,
            encodeBitRate: 24000,
            format: 'aac',//'mp3',
            frameSize: 50
        }
        this.recorderManager.onStart(() => {
            console.log(this.$http.getImg('voice2.svg'))
            wx.showToast({
                title: '正在录音...',
                mask: true,
                icon: 'loading',
                image: '../../img/voice.png',
                duration: options.duration
            })
        })
        // 停止事件回调
        this.recorderManager.onStop((res) => {
            console.log('recorder stop', res)
            wx.hideToast();
            this.$loading.start({
                title: '开始识别语音'
            })
            const { tempFilePath } = res;
            this.uploadFile(tempFilePath, id, cbk)
        })

        // 检查是否获得录音权限
        wx.getSetting({
            success: res => {
                console.log(res);
                if (!res.authSetting['scope.record']) {
                    wx.authorize({
                        scope: 'scope.record',
                        success: () => {
                            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                            // this.recorderManager.start(options)
                        },
                        fail:err=>{
                            this.$message("未开启录音授权，无法进行录音", {
                                confirmText: '去开启',
                                success: () => {
                                    $router.push('404',{
                                        prop:'record'
                                    })
                                },
                                showCancel: true
                            })
                        }
                    })
                } else {
                    this.recorderManager.start(options)
                }
            }
        })
    },
    // 预加载---未实现
    $preLoad(path) {

    },
    // 设置导航
    $setBar(params) {
        wx.setNavigationBarColor({
            ...params,
            animation: {
                duration: 300,
                timingFunc: 'linear'
            }
        })
    },
    onReady: function () {
        this.$firstRender = false;
    },
    // 需要下拉刷新的函数需写在fetch中  并 由 $openRefresh=>true函数 来开启
    onPullDownRefresh: function () {
        if (!this.$openRefresh || !this.$openRefresh()) return;
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.fetch().then(() => {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        });
    },
    /**
     * 用户点击右上角分享
     */
    $shareParams: {
        title: '读口令拿红包',
        desc: '最具人气的口令红包小程序!',
        params: null,
        imageUrl: getImg('share_now.png'),
        path: '/pages/index/index',
        success: function (res) {
            console.log(res)
        },
    },
    onShareAppMessage: function () {
        wx.updateShareMenu({
            withShareTicket: true,
            success() {
                console.log("更新转发配置成功")
            }
        });
        let router = getCurrentPages();
        let len = router.length - 1;
        const route = router[len].route;
        let { title, desc, params, path, ...other } = this.$shareParams;
        // 当前页面是否在允许转发的配置里
        if (shareConfig.includes(route)) {
            path = route;
        }
        if (params) {
            params.recmd_userid = this.getItemSync('userid')
        } else {
            params = {};
            params.recmd_userid = this.getItemSync('userid')
        }
        let str = this.serialize(params);
        console.log(`${path}${str}`)
        return {
            title,
            desc,
            path: `${path}${str}`,
            ...other
        }
    }
}
export default function Init(params) {
    let init = _.extend(true, {}, config, params);
    // 不可放进config中，深拷贝会复制多个全局对象
    init.recorderManager = recorderManager;
    init.innerAudioContext = innerAudioContext;
    init.$router = $router;
    Page(init);
}