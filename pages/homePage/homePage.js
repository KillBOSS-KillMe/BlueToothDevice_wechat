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

  },
  goGamedan(e) {
    wx.navigateTo({
      url: `/pages/gameList/gameList?id=${e.currentTarget.dataset.id}`
    })
  }
})