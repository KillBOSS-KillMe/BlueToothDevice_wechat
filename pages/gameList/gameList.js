// pages/quanxian/quanxian.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pinglunList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let id = options.id
    var that = this;
    wx.request({
      url: `${app.globalData.requestUrl}/Official/comment_list`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        game_id: '1'
      },
      method: "POST",
      success: res => {
        console.log(res);
        res = app.null2str(res.data)
        if (res.code == '1') {
          this.setData({
            pinglunList: res.data,
          })
        } else {
          wx.showModal({
            title: '',
            content: res.msg,
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

  }
})