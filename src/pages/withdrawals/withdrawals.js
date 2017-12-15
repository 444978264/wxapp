//withdrawals.js
//获取应用实例
import { alert } from '../../utils/util.js';

Page({
  data: {
    balance: 200,
    mobile: '',
    extractmoney: 0
  },
  moneyInputEvent: function(e) {
    this.setData({
      extractmoney: e.detail.value
    })
  },
  mobileInputEvent: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  checkAll: function() {
    this.setData({
      extractmoney: this.data.balance
    })    
  },
  validatemobile: function (mobile) {
    if (mobile.length == 0) {
      alert('请输入手机号','warn');
      return false;
    }
    if (mobile.length != 11) {
      alert('手机号长度错误', 'warn');
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      alert('手机号有误！', 'warn');
      return false;
    }
    return true;
  },
  validatemoney: function() {
    if (this.data.extractmoney > this.data.balance) {
      alert('请不要超过余额', 'warn');
      return false;
    }
    return true;
  },
  withdrawals: function() {
    var mobileresult = this.validatemobile(this.data.mobile);
    if (!mobileresult) return;
    var moneyresult = this.validatemoney();
    if (!moneyresult) return;
    
    console.log(this.data.extractmoney,"extractmoney");
    console.log(this.data.mobile, "mobile");

  }
})