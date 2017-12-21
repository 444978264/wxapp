import extend from '../../libs/extends.js';

extend({
  data: {
    packetslist: [],
    has_next: false
  },
  page: 1,
  has_next: false,
  onload() {
    
  },
  $openRefresh() {
    this.has_next = true;
    this.page = 1;
    return true;
  },
  fetch() {
    return this.$http.myPacket({
      page: this.page,
      pagesize: 20
    }).then(res => {
      if (this.page <= 1) {
        this.setData({
          packetslist: []
        })
      }
      var list = this.data.packetslist.concat(res.result);
      this.setData({
        packetslist: list,
        
      })
      this.has_next = res.has_next;
    })
  },
  gotodetail(e) {
    var {idx} = this.dataset(e);
    this.$router.redirect('content',{
      id: idx
    })
  },
  //页面滑动到底部
  onReachBottom() {
    if (!this.has_next) return;
    this.page++
    this.fetch();
  },
  onShow() {
    this.fetch();
  }
})