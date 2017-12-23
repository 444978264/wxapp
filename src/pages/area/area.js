//area.js
//获取应用实例
import extend from '../../libs/extends.js';

extend({
  data: {
    cityArr: [],
    datas: [],
    showCity: false,
    deliveryCity: []
  },
  onLoad() {
    this.fetch();
  },
  $openRefresh() {
    return true;
  },
  showBtn(e) {
    var idx = e.currentTarget.dataset.idx;
    var status = this.data.datas[idx].toggle;
    this.data.datas[idx].toggle = !status;
    this.setData({
      datas: this.data.datas
    })
  },
  checkboxChange(e) {
    this.setData({
      deliveryCity: e.detail.value
    })
  },
  fetch() {
    return this.$http.areaList().then(res => {
      var arr = [];
      for(var i = 0; i < res.length; i++) {
        var obj = {
          'province': res[i].name,
          'city': res[i].citys
        }
        arr.push(obj);
      }
      this.setData({
        cityArr: arr
      })
      var listData = this.data.cityArr;
      for (var i = 0; i < listData.length; i++) {
        listData[i]['toggle'] = false;
      }
      this.setData({
        datas: listData
      })
    });
  },
  delivery() {
    if (this.data.deliveryCity.length == 0) {
      this.alert('请选择投放城市','warn');
      return;
    }
    this.setItem('deliveryCity', this.data.deliveryCity);
    this.goback();
  }
})