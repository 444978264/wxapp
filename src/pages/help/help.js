//help.js
//获取应用实例
import extend from '../../libs/extends.js';
import api from '../../libs/api.js';

extend({
  data: {
    num: 0,
    helpinfo: []
  },
  onLoad: function() {
    
  },
  $openRefresh() {
    return true;
  },
  checkDetails: function(e) {
    this.setData({
      num: e.currentTarget.dataset.num
    })
  },
  fetch() {
    return this.$http.helpLst().then(res => {
      console.log(res,"res");
      this.setData({
        helpinfo: res
      })
    })
  },
  onShow() {
    this.fetch();
  }
})