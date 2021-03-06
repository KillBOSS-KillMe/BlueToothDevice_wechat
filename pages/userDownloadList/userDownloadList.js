// pages/user-xiazai/user-xiazai.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // getFlieList() {
    userInfo: {},
    flieList:[]
    },
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (this.data.guanzhurenList.length > 0) {
    //   return ''
    // }
    this.setData({
      userInfo: app.globalData.userInfo,
      id: options.id
    })
    wx.showToast({
      title: "数据加载中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/download_log`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        uid: this.data.id
      },
      method: "POST",
      success: res => {
        wx.hideToast()
        res = app.null2str(res.data)
        if (res.code == '1') {
          let flieList = res.data
          for (let i = 0; i < flieList.length; i++) {
            flieList[i]['createTime'] = app.transformTime(flieList[i].createTime * 1000)
          }
          this.setData({
            flieList: flieList
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          });
        }
        console.log(res.data);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})