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
  selectAll(e) {
    var idx = e.currentTarget.dataset.idx;
    var allStatus = this.data.datas[idx].checked;
    this.data.datas[idx].checked = !allStatus;
    this.data.datas[idx].toggle = true;
    for (var i = 0; i < this.data.datas[idx].city.length; i++) {
      if (!allStatus) {
        this.data.datas[idx].city[i].checked = true;
        this.data.deliveryCity.push(this.data.datas[idx].city[i].name);
      } else {
        this.data.datas[idx].city[i].checked = false;
        for (var j = 0; j < this.data.deliveryCity.length; j++) {
          if (this.data.deliveryCity[j] == this.data.datas[idx].city[i].name) {
            this.data.deliveryCity.splice(j, 1);
          }
        }
      }
    }
    this.setData({
      datas: this.data.datas,
      deliveryCity: this.data.deliveryCity
    })
  },
  checkCity(e) {
    var arr = [];
    var childidx = e.currentTarget.dataset.childidx;
    var val = e.currentTarget.dataset.cityname;
    var parentIdx;
    for(var i = 0; i < this.data.datas.length; i++) {
      for (var j = 0; j < this.data.datas[i].city.length; j++) {
        if (this.data.datas[i].city[j].name == val) {
          parentIdx = i;
        }
      }
    }
    var childStatus = this.data.datas[parentIdx].city[childidx].checked;
    this.data.datas[parentIdx].city[childidx].checked = !childStatus;
    for (var k = 0; k < this.data.datas[parentIdx].city.length; k++) {
      arr.push(this.data.datas[parentIdx].city[k].checked);
    }
    var res = this.contains(arr , false);
    if (res) {
      this.data.datas[parentIdx].checked = false;
    } else {
      this.data.datas[parentIdx].checked = true;
    }
    this.setData({
      datas: this.data.datas
    })
  },
  contains(arr , val) {
    for (var i = 0; i < arr.length; i++) {
      if (val === arr[i]) {
        return true;
      }
    }
    return false;
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
        for (var j = 0; j < listData[i].city.length; j++) {
          listData[i].city[j]['checked'] = false;
        }
      }
      this.setData({
        datas: listData
      })
    });
  },
  // 删除数组中的""
  removeByValue(arr) {
    for(var i= 0; i < arr.length; i++) {
      if (arr[i] == "") {
          arr.splice(i, 1);
        }
    }
  },
  delivery() {
    if (this.data.deliveryCity.length == 0) {
      this.alert('请选择投放城市','warn');
      return;
    }
    this.removeByValue(this.data.deliveryCity);
    console.log(this.data.deliveryCity, "deliveryCity");
    this.setItem('deliveryCity', this.data.deliveryCity);
    this.goback();
  }
})