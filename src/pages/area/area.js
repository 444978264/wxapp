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
  idx: '',
  onLoad() {
    this.fetch();
  },
  $openRefresh() {
    return true;
  },
  showBtn(e) {
    this.idx = e.currentTarget.dataset.idx;
    var status = this.data.datas[this.idx].toggle;
    this.data.datas[this.idx].toggle = !status;
    this.setData({
      datas: this.data.datas
    })
  },
  selectAll(e) {
    this.idx = e.currentTarget.dataset.idx;
    this.data.datas[this.idx].toggle = true;
    var is_checked = this.data.datas[this.idx].checked;
    this.data.datas[this.idx].checked = !is_checked;
    for (var i = 0; i < this.data.datas[this.idx].city.length; i++) {
      if (!is_checked) {
        this.data.datas[this.idx].city[i].checked = true;
      } else {
        this.data.datas[this.idx].city[i].checked = false;
      }
    }
    this.setData({
      datas: this.data.datas
    })
  },
  checkCity(e) {
    var arr = [];
    var childidx = e.currentTarget.dataset.childidx;

    

    // var status = this.data.datas[this.idx].city[childidx].checked;
    // this.data.datas[this.idx].city[childidx].checked = !status;
    // for (var i = 0; i < this.data.datas[this.idx].city.length; i++) {
    //   arr.push(this.data.datas[this.idx].city[i].checked);
    // }
    // if (this.contains(arr, false)) {
    //   this.data.datas[this.idx].checked = false;
    // } else {
    //   this.data.datas[this.idx].checked = true;
    // }
    // this.setData({
    //   datas: this.data.datas
    // })
  },
  contains(arr, val) {  
    var i = arr.length;  
    while(i--) {
      if (arr[i] === val) {
        return true;
      }
    }  
    return false;  
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
        listData[i]['checked'] = false;
        for (var k = 0; k < listData[i].city.length; k ++) {
          listData[i].city[k]['checked'] = false;
        }
      }

      this.setData({
        datas: listData
      })
    });
  },
  delivery() {

    console.log(this.data.deliveryCity, "deliveryCity");


    if (this.data.deliveryCity.length == 0) {
      this.alert('请选择投放城市','warn');
      return;
    }

    

    return;

    this.setItem('deliveryCity', this.data.deliveryCity);
    this.goback();
  }
})