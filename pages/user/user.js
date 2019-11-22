// pages/delete-jilu/delete-jilu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    messageShow: false,
    navAction:  ['noActive', 'noActive', 'noActive', 'active']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(opt) {
    console.log(app.globalData.userInfo)
    this.setData({
      navAction: app.globalData.navAction,
      userInfo: app.globalData.userInfo
    })
    // console.log(this.data.userInfo)
    this.getMessage()
  },
  onShow() {
    // 更新用户信息
    this.upDateUserInfo()
  },
  // 更新用户信息
  upDateUserInfo() {
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_info`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id,
        f_id: null
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.setData({
            userInfo: data.data.data
          })
          app.globalData.userInfo = data.data.data
        }
      }
    })
  },
  // 获取是否存在新消息
  getMessage() {
    wx.request({
      url: `${app.globalData.requestUrl}/User/point`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code == "1") {
          this.setData({
            messageShow: true
          })
        } else {
          this.setData({
            messageShow: false
          })
        }
      }
    })
  },
  // 进入消息页
  // goMessageList() {

  // },
  newGroup() {
    if (this.data.floatingStr) {
      this.setData({
        floatingStr: false
      })
    } else {
      this.setData({
        floatingStr: true
      })
    }
  },
  newGroupName(e) {
    console.log(e.detail.value)
    this.setData({
      newGroupNameData: e.detail.value
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