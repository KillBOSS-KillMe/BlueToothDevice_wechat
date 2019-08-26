// pages/quanxian/quanxian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    userInfo: {},
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl
    })
    this.getList()
  },
  getList() {
    wx.request({
      url: `${app.globalData.requestUrl}/Official/official_type`,
      method: "POST",
      success: data => {
        console.log(data)
        data = app.null2str(data)
        if (data.data.code == '1') {
          this.setData({
            listData: data.data.data,
          })
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  // 进入游戏列表
  goGamedan(e) {
    wx.navigateTo({
      url: `/pages/gameList/gameList?id=${e.currentTarget.dataset.id}`
    })
  }
})