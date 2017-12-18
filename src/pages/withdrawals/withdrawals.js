//withdrawals.js
//获取应用实例
import extend from '../../libs/extends.js';
import api from '../../libs/api.js';

extend({
  data: {
    balance: 0,
    mobile: '',
    extractmoney: 0
  },
  $openRefresh() {
    return true;
  },
  moneyInputEvent(e) {
    this.setData({
      extractmoney: e.detail.value
    })
  },
  mobileInputEvent(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  checkAll() {
    this.setData({
      extractmoney: this.data.balance
    })    
  },
  validatemobile(mobile) {
    if (mobile.length == 0) {
      this.alert('请输入手机号','warn');
      return false;
    }
    if (mobile.length != 11) {
      this.alert('手机号长度错误', 'warn');
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      this.alert('手机号有误！', 'warn');
      return false;
    }
    return true;
  },
  validatemoney() {
    var extractmoney = parseInt(this.data.extractmoney);
    var balance = parseInt(this.data.balance);

    if (extractmoney > balance) {
      this.alert('请不要超过余额', 'warn');
      return false;
    }
    return true;
  },
  withdrawals() {
    var mobileresult = this.validatemobile(this.data.mobile);
    if (!mobileresult) return;
    var moneyresult = this.validatemoney();
    if (!moneyresult) return;

    console.log('提现成功');
    
    // console.log(this.data.extractmoney,"extractmoney");
    // console.log(this.data.mobile, "mobile");

  },
  fetch() {
    return this.$http.myBalance({
      token: api.TOKEN
    }).then(res => {
      this.setData({
        balance: res.amount
      })
    })
  },
  onShow() {
    this.fetch();
  }
})