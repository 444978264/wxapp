//area.js
//获取应用实例
import extend from '../../libs/extends.js';

extend({
  data: {
    cityArr: [
      { 'province': '北京', 'city': ['北京'] },
      { 'province': '河北', 'city': ['石家庄', '唐山', '秦皇岛','邯郸','邢台','保定'] },
      { 'province': '山西', 'city': ['太原', '大同', '阳泉','长治','晋城','朔州'] }
    ],
    datas: [],
    showCity: false,
    deliveryCity: []
  },
  onLoad: function() {
    var listData = this.data.cityArr;
    for (var i = 0; i < listData.length; i++) {
      listData[i]['toggle'] = false;
    }
    this.setData({
      datas: listData
    })
  },
  showBtn: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var status = this.data.datas[idx].toggle;
    this.data.datas[idx].toggle = !status;
    this.setData({
      datas: this.data.datas
    })
  },
  checkboxChange: function(e) {
    this.setData({
      deliveryCity: e.detail.value
    })
  },
  delivery: function() {
    if (this.data.deliveryCity.length == 0) {
      alert('请选择投放城市','warn');
      return;
    }
    this.setItem('deliveryCity', this.data.deliveryCity);
    this.goback();
  }
})