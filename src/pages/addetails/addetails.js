//addetails.js
//获取应用实例
import api from '../../libs/api.js';
import extend from '../../libs/extends.js';

extend({
  data: {
    shade: false,
    conType: ['添加文字', '添加图片'],
    list: [],
    // 创建第几个textarea
    idx: '',
    // 选择的是文字还是图片 0 文字 1 图片
    chooseType: '',
    addType: ''
  },
  onLoad: function() {
    
  },
  addCon() {
    this.setData({
      shade: true
    })
  },
  cancel: function () {
    this.setData({
      shade: false
    })
  },
  imgUp: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.addTextArea();
        var arealist = this.data.list;
        var index = this.data.idx;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        
        wx.showLoading({
          title: '上传中...',
          mask: true
        });
        wx.uploadFile({
          url: api.uploadImg,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            token: api.TOKEN
          },
          success: res => {
            wx.hideLoading();
            var data = JSON.parse(res.data);
            if (data.code < 0) {
              alert(data.msg,"warn");
              return;
            }
            arealist[index]['src'] = data.result;
            this.setData({
              list: arealist
            })
          },
          fail: res => {
            console.log(res, "fail");
          }
        })
      }
    })
  },
  addTextArea: function() {
    var conlist = this.data.list;
    this.setData({
      idx: this.data.list.length
    });
    if (this.data.chooseType == 0) {
      this.setData({
        addType: 'text'
      });
    } else {
      this.setData({
        addType: 'img'
      });
    }
    var obj = {
      'content': '',
      'src': '',
      'type': this.data.addType
    }
    conlist.push(obj);
    this.setData({
      list: conlist
    })
  },
  sureAdd(e) {
    var idx = e.currentTarget.dataset.idx;
    var conlist = this.data.list;
    this.setData({
      chooseType: idx
    });
    if(idx == 0) {
      this.addTextArea();
    } else {
      this.imgUp();
    }
    this.cancel();
  },
  // 删除
  deleteCon: function(e) {
    var idx = e.currentTarget.dataset.idx;
    console.log(idx,'idx');
    wx.showModal({
      title:'提示',
      content: '确定删除该条',
      success: res => {
        if(res.confirm) {
          var list = this.data.list;
          list.splice(idx, 1);
          this.setData({
            list: list
          })
        }
      }
    })
  },
  textAreaBlur: function(e) {
    var idx = e.currentTarget.dataset.idx;
    this.data.list[idx].content = e.detail.value;
    this.setData({
      list: this.data.list
    })
  },
  // 预览
  preview: function() {
    
  },
  // 完成
  finish: function() {
    var details = JSON.stringify(this.data.list);
    console.log(details,"details");
    this.setItem('details', details);
    this.goback();
  }

})