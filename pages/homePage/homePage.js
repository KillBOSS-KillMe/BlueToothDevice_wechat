// pages/quanxian/quanxian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    userInfo: {},
    imgUrl: '',
    navAction:  ['noActive', 'noActive', 'active', 'noActive']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navAction: app.globalData.navAction,
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl
    })
    this.getList()
  },
  getList() {
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Official/official_type`,
      method: "POST",
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == '1') {
          this.setData({
            listData: data.data.data,
          })
        } else {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 进入游戏列表
  goGamedan(e) {
    wx.navigateTo({
      url: `/pages/gameList/gameList?id=${e.currentTarget.dataset.id}`
    })
  },
  // 进入设备页
  goDevicePage() {
    app.globalData.navAction = ['active', 'noActive', 'noActive', 'noActive']
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  // 进入论坛页
  goForumPage() {
    app.globalData.navAction = ['noActive', 'active', 'noActive', 'noActive']
    wx.redirectTo({
      url: '/pages/forum/forum'
    })
  },
  // 进入官网页
  goHomePage() {
    app.globalData.navAction = ['noActive', 'noActive', 'active', 'noActive']
    wx.redirectTo({
      url: '/pages/homePage/homePage'
    })
  },
  // 进入用户页
  goUserPage() {
    app.globalData.navAction = ['noActive', 'noActive', 'noActive', 'active']
    wx.redirectTo({
      url: '/pages/user/user'
    })
  }
})