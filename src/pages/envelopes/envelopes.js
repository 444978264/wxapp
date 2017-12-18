//envelopes.js
//获取应用实例
import extend from '../../libs/extends.js';
import api from '../../libs/api.js';

extend({
  data: {
    num: 0,
    pattern: ['娱乐模式','广告模式'],
    firstshow: true,
    isMore: false,
    logoUrl: '',
    command: '',
    bonus: '',
    phr: '',
    // 品牌名称
    brandName: '',
    regionArr: ['全国','按城市投放'],
    shade: false,
    // 保存投放城市
    curRegion: ['全国'],
    greater: false,
    // 保存广告详情
    details: [],
    modeType: 'et'
  },
  onLoad: function(option) {
    
  },
  // 保存投放城市
  saveCity() {
    this.getItem('deliveryCity', res => {
      this.setData({
        curRegion: res.data
      })
    });
  },
  // 保存广告详情
  saveDetails: function() {
    this.getItem('details', res => {
      this.setData({
        details: res.data
      })
    });
    
  },
  // 选择模式
  choosePattern: function(e) {
    var num = e.currentTarget.dataset.num;
    if(num == 0) {
      this.setData({
        num: num,
        firstshow: true,
        command: '',
        bonus: '',
        phr: '',
        modeType: 'et'
      })
    } else {
      this.setData({
        num: num,
        firstshow: false,
        command: '',
        bonus: '',
        phr: '',
        modeType: 'ad'
      })
    }
  },
  toHelp: function() {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  moreOption: function() {
    this.setData({
      isMore: !this.data.isMore
    })
  },
  imgUp: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
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
            var data = JSON.parse(res.data);
            if (data.code < 0) {
              this.alert(data.msg, "warn");
              return;
            }
            this.setData({
              logoUrl: data.result
            })
            wx.hideLoading();
          },
          fail: res => {
            console.log(res, "fail");
          }
        })
        
      }
    })
  },
  // 口令
  cmdInputEvent: function(e) {
    this.setData({
      command: e.detail.value
    })
  },
  // 总奖金
  bonusInputEvent: function (e) {
    this.setData({
      bonus: e.detail.value
    })
  },
  // 份数
  phrInputEvent: function (e) {
    this.setData({
      phr: e.detail.value
    })
  },
  checkVal: function() {
    if (this.data.command == '') {
      this.alert('请输入口令','warn');
      return false;
    }
    if (this.data.bonus == '') {
      this.alert('请输入总奖金', 'warn');
      return false;
    }
    if (this.data.phr == '') {
      this.alert('请输入总份数', 'warn');
      return false;
    }
    return true;
  },
  getbrandName: function(e) {
    this.setData({
      brandName: e.detail.value
    })
  },
  toEdit() {
    if (this.data.brandName == '') {
      this.alert('请填写品牌名称','warn');
      return;
    }
    this.$push('addetails');
  },
  chooseRegion: function() {
    this.setData({
      shade: true
    })
  },
  cancel: function() {
    this.setData({
      shade: false
    })
  },
  sureRegion(e) {
    var idx = e.currentTarget.dataset.idx;
    if(idx == 0) {
      this.setItem('deliveryCity', this.data.regionArr[0]);
      this.setData({
        curRegion: this.data.regionArr[0]
      })
    } else {
      wx.navigateTo({
        url: '../area/area'
      })
    }
    this.setData({
      shade: false
    })
  },
  generate: function() {
    var res = this.checkVal();
    if(!res) return;
    console.log(this.data.modeType,"modeType");
    if (this.data.modeType == 'ad') {
      var obj = {
        'type': 'ad',
        'amount': this.data.bonus,
        'total_count': this.data.phr,
        'title': this.data.command,
        'ad_content': this.data.details,
        'img': this.data.logoUrl,
        'area': this.data.curRegion,
        'brand_title': this.data.brandName
      }
    } else {
      var obj = {
        'type': '',
        'amount': this.data.bonus,
        'total_count': this.data.phr,
        'title': this.data.command
      }
    }

  console.log(obj,"obj");
    
    this.$http.sendRed(obj).then(res => {
      var obj = res.pay.result;
      var id = res.id;
      wx.requestPayment({
        'timeStamp': obj.timeStamp,
        'nonceStr': obj.nonceStr,
        'package': obj.package,
        'signType': obj.signType,
        'paySign': obj.paySign,
        'success': res => {
          this.$http.payCbk({
            red_log_id: id
          }).then(res => {
            wx.navigateTo({
              url: '../mypackets/mypackets'
            })
          })
          this.clearStorage();
        },
        'fail': res => {
          this.alert( res , 'warn');
        }
      })
    })
    
  },
  onShow: function () {
    this.saveDetails();
    this.saveCity();
  }
})