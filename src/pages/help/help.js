//help.js
//获取应用实例

Page({
  data: {
    num: 0,
    helpinfo: [
      {
        'title':'快点说怎么玩',
        'content':'你可以设置一个语音口令, 小伙伴们必须快速说出, 语音识别成功后才能领取红包。'
      },
      {
        'title': '快点说会收取服务费吗？',
        'content': '给单人发红包时收取2%的服务费'
      }
    ]
  },
  onLoad: function() {
    
  },
  checkDetails: function(e) {
    this.setData({
      num: e.currentTarget.dataset.num
    })
  }
})