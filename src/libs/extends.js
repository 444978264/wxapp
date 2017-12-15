import options from '../utils/util';
import api from './api';
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
    recorderManager,
    innerAudioContext,
    $http: api,
    // 播放    
    $play(url) {
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
        console.log(data, api.uploadUrl);
        console.log(this.$http.uploadUrl, "upload")
        wx.uploadFile({
            url: this.$http.uploadUrl,
            filePath: tempFilePath,
            name: 'file',
            formData: {
                ...data,
                token: this.$http.TOKEN
            },
            success: res => {
                console.log(res);
                cbk && cbk(JSON.parse(res.data))
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
            numberOfChannels: 2,
            encodeBitRate: 24000,
            format: 'aac',//'mp3',
            frameSize: 50
        }
        this.recorderManager.onStart(() => {
            console.log('recorder start')
        })
        this.recorderManager.onResume(() => {
            console.log('recorder resume')
        })
        this.recorderManager.onPause(() => {
            console.log('recorder pause')
        })
        // 停止事件回调
        this.recorderManager.onStop((res) => {
            console.log('recorder stop', res)
            const { tempFilePath } = res;
            this.uploadFile(tempFilePath, id, cbk)
        })
        this.recorderManager.onFrameRecorded((res) => {
            const { frameBuffer } = res;
            console.log('frameBuffer.byteLength', frameBuffer.byteLength)
        })
        this.recorderManager.start(options)
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
    }
}
export default function Init(params) {
    // Object.assign(params, config);
    Page(_.extend({}, params, config));
}