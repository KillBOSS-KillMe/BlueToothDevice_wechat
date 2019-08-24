// pages/quanxian/quanxian.js
// var until = require("../../utils/util.js")
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo: {},
      articleDetail: {},
      requestImgUrl: '',
      originalImgUrl: ''
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      requestImgUrl: app.globalData.requestImgUrl,
      originalImgUrl: app.globalData.originalImgUrl
    })
    wx.request({
      url: `${app.globalData.requestUrl}/User/post_info`,
      data: {
        post_id: options.id
      },
      method: "POST",
      success: data =>{
        console.log(data)
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.setData({
            articleDetail: data.data.data[0]
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
  // getluntanTxt() {
  //   var that = this
  //   wx.getStorage({
  //     key: 'token',
  //     success: function (res) {
  //       wx.request({
  //         url: `http://192.168.1.168/User/post_info`,
  //         data: {
  //           post_id:"1"
  //         },
  //         method: "POST",
  //         header: {
  //           'content-type': 'application/json', // 默认值
  //           'token': res.data
  //         },
  //         success(res) {
  //           console.log(res)
  //           that.setData({
  //             luntanTxt: res.data
  //           })
  //         }
  //       })
  //     },
  //   })
  // }
  })