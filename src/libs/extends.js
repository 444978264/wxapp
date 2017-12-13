var config = {
    /**
     * 页面的初始数据
     */
    data: {
        val: '',
        voices: []
    },
    back() {
        push('download');
    },
    // 播放
    recordPlay(e) {
        var { url } = dataset(e);
        console.log(url);
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true;
        innerAudioContext.src = url;
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    // 录音
    recordStart() {

        recorderManager.onStart(() => {
            console.log('recorder start')
        })
        recorderManager.onResume(() => {
            console.log('recorder resume')
        })
        recorderManager.onPause(() => {
            console.log('recorder pause')
        })
        recorderManager.onStop((res) => {
            console.log('recorder stop', res)
            const { tempFilePath } = res;
            let { voices } = this.data;
            voices.push(tempFilePath);
            wx.uploadFile({
                url: 'http://v.yunruikj.com/voicedemo/inx.php',
                filePath: tempFilePath,
                name: 'file',
                success: res => {
                    console.log(res.data)
                },
                fail: err => {
                    console.log(err)
                }
            })
            this.setData({ voices })
        })
        recorderManager.onFrameRecorded((res) => {
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

        recorderManager.start(options)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // var val = wx.getStorageSync('emoji');
        // this.setData({ val });
        console.log(http)
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    willMount(params) {

    }
}
export default function Init(params) {
    
}