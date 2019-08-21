//logs.js
// const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    logs: [],
    luntanTxt: [],
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    wx.request({
      url: `http://192.168.1.168/Forum/forum`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        page: '1'
      },
      method: "POST",
      success: res => {
        res = app.null2str(res.data)
        if (res.code == '1') {
          this.setData({
            luntanTxt: res.data
          })
        } else {
          wx.showModal({
            title: '',
            content: res.msg,
            showCancel: false
          })
        }
        console.log(res.data);
      }
    })


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // var that = this;
    // // 显示加载图标
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
    // // 页数+1
    // page = page + 1;
    // wx.request({
    //   url: '.......' + page,
    //   method: "GET",
    //   // 请求头部
    //   header: {
    //     'content-type': 'application/text'
    //   },
    //   success: function (res) {
    //     // 回调函数
    //     var moment_list = that.data.moment;
    //     const oldData = that.data.moment;
    //     that.setData({
    //       moment: oldData.concat(res.data.data)
    //     })
    //     // 隐藏加载框
    //     wx.hideLoading();
    //   },

    // })

  },
  goQuanxian(e) {
    wx.navigateTo({
      url: `/pages/yh-quanxian/yh-quanxian?id=${e.currentTarget.dataset.id}`,
      success: function (res) { },
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: `/pages/tiezi-detail/tiezi-detail?id=${e.currentTarget.dataset.id}`,
      success: function (res) { },
    })
  },
  goQuanxian(e){
    // var userid = e.currentTarget.dataset.userid;
    // if (type==1){
    //   wx.navigateTo({
    //     url: '/pages/quanxian/quanxian',
    //     success: function(res) {},
    //     fail: function(res) {},
    //     complete: function(res) {},
    //   })
    // }else if (type==2){
      wx.navigateTo({
        url: '/pages/yh-quanxian/yh-quanxian',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    // }
  }
})
