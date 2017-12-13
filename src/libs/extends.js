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
    uploadFile(tempFilePath) {
        wx.uploadFile({
            url: api.uploadUrl,
            filePath: tempFilePath,
            name: 'file',
            success: res => {
                console.log(res.data)
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    // 录音
    $recordStart() {
        this.recorderManager.onStart(() => {
            console.log('recorder start')
        })
        this.recorderManager.onResume(() => {
            console.log('recorder resume')
        })
        this.recorderManager.onPause(() => {
            console.log('recorder pause')
        })
        this.recorderManager.onStop((res) => {
            console.log('recorder stop', res)
            const { tempFilePath } = res;
            let { voices } = this.data;
            voices.push(tempFilePath);
            this.uploadFile(tempFilePath)
            this.setData({ voices })
        })
        this.recorderManager.onFrameRecorded((res) => {
            const { frameBuffer } = res
            console.log('frameBuffer.byteLength', frameBuffer.byteLength)
        })
        const options = {
            duration: 5000,
            sampleRate: 8000,
            numberOfChannels: 1,
            encodeBitRate: 16000,
            format: 'mp3',
            frameSize: 50
        }
        this.recorderManager.start(options)
    },
    _willMount(params) {
        console.log(params,this)
    }
}
Object.assign(config, options);
export default function Init(params) {
    Object.assign(params, config);
    params.$preLoad = function(data){
        config._willMount(data)
    }
    Page(params);
}