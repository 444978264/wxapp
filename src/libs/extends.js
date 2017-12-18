import options from '../utils/util';
import $http from './api';
import { TOKEN } from './api';
import _ from './deepcopy';
// 全局录音
const recorderManager = wx.getRecorderManager();
// 全局播放
const innerAudioContext = wx.createInnerAudioContext();
//全局app
let $app = getApp();

var config = {
    /**
     * 页面的初始数据
     */
    ...options,
    $app,
    $http,
    recorderManager,
    innerAudioContext,
    _PLAY:true,
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
                if (result.code <=-9999) {
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
                title:'正在录音...',
                mask:true,
                icon:'loading',
                image:'../../img/voice.png',
                duration: options.duration
            })
            // let s = options.duration;
            // this._timer = setInterval(()=>{
            //     if(s<2000){
            //         clearInterval(this._timer);
            //     }
            //     this.alert('正在录音', "", options.duration);
            // },1000)
            // this.alert('正在录音', "", options.duration); 
        })
        // this.recorderManager.onResume(() => {
        //     console.log('recorder resume')
        // })
        // this.recorderManager.onPause(() => {
        //     console.log('recorder pause')
        // })
        // this.recorderManager.onFrameRecorded((res) => {
        //     const { frameBuffer } = res;
        //     console.log('frameBuffer.byteLength', frameBuffer.byteLength)
        // })
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
                if (!res.authSetting['scope.record']) {
                    wx.authorize({
                        scope: 'scope.record',
                        success: () => {
                            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                            // this.recorderManager.start(options)
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
    // 需要下拉刷新的函数需写在fetch中  并 由 $openRefresh=>true函数 来开启
    onPullDownRefresh: function () {
        if (!this.$openRefresh || !this.$openRefresh()) return;
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.fetch().then(() => {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        });
    },
}
export default function Init(params) {
    Object.assign(params, config);
    Page(params);
}