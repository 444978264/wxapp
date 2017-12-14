import options from '../utils/util';
import api from './api';
// 全局录音
const recorderManager = wx.getRecorderManager();
// 全局播放
const innerAudioContext = wx.createInnerAudioContext();
//全局app
var appInstance = getApp();

var config = {
    /**
     * 页面的初始数据
     */
    $app: appInstance,
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
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    // 上传文件
    uploadFile(tempFilePath, id, cbk) {
        console.log(id, api.uploadUrl);
        wx.uploadFile({
            url: api.uploadUrl,
            filePath: tempFilePath,
            name: 'file',
            formData: {
                red_log_id: id,
                token: api.TOKEN
            },
            success: res => {
                cbk && cbk(res)
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
            const { frameBuffer } = res
            console.log('frameBuffer.byteLength', frameBuffer.byteLength)
        })
        this.recorderManager.start(options)
    },
    _willMount(params) {
        console.log(params, this)
    }
}
Object.assign(config, options);
export default function Init(params) {
    Object.assign(params, config);
    params.$preLoad = function (data) {
        config._willMount(data)
    }
    Page(params);
}