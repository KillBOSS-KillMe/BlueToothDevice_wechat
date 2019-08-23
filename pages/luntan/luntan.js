//logs.js
// const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    logs: [],
    luntanTxt: [{
      title: '双马尾成为了最佳减龄利器？',
      label: '时尚',
      content: '除了小朋友，为什么日常生活中很少有人扎双马尾？ 很村？装嫩？有病？ 请快抛开你对它的偏见吧！低位双马尾高位双马尾编发双马尾...',
      avatarUrl: '/image/luntan1.jpg',
      nickname: '你的我的',
      createTime: '2019-12-21 12:00',
      see: 200,
      comment: 100,
      follow: 10,
      file: [
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        }
      ]
      
    }],
  },
  onLoad: function() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.getArticleList()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
  getArticleList() {
    
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/forum`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        page: 0
      },
      success: data => {
        console.log(data)
        data = app.null2str(data)
        if (data.data.code == 1) {
          // this.setData({
      //         luntanTxt: res.data
      //       })
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  goQuanxian(e) {
    wx.navigateTo({
      url: `/pages/yh-quanxian/yh-quanxian?id=${e.currentTarget.dataset.id}`,
      success: function(res) {},
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: `/pages/tiezi-detail/tiezi-detail?id=${e.currentTarget.dataset.id}`,
      success: function(res) {},
    })
  },
  goQuanxian(e) {
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
    })
    // }
  }
})