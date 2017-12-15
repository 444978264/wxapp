import extend from '../../libs/extends.js';

extend({
  data: {
    packetslist: [],
    page: 1,
    scrollHeight: 0,
    scrollTop: 0,
    has_next: false
  },
  onload() {
    
  },
  loadMore() {
    this.$http.myPacket({
      page: this.data.page,
      pagesize: 20
    }).then(res => {
      if (this.page <= 1) {
        this.setData({
          packetslist: []
        })
      }
      var list = this.data.packetslist.concat(res.result);
      this.setData({
        packetslist: list
      })
      console.log(res.has_next,"res.has_next");

      this.setData({
        has_next: res.has_next
      });

      var page = this.data.page++;
      this.setData({
        page: page
      })
      console.log(this.data.page, "page");
      
    })
    
  },
  //页面滑动到底部
  bindDownLoad() {
    if (!this.data.has_next) return;
    this.loadMore();
    console.log("lower");
  },
  onShow() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          scrollHeight: res.windowHeight
        });
        this.loadMore();
      }
    });
  }
})