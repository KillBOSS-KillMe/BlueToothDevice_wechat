// pages/quanxian/quanxian.js
// var until = require("../../utils/util.js")
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      id: "",
      luntanTxt: {},
      createTime:""
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    console.log(options)
    let id = options.id
    var that = this;
    wx.request({
      url: `${app.globalData.requestUrl}/User/post_info`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        post_id: id
      },
      method: "POST",
      success: res =>{
        that.setData({
          luntanTxt:res.data.data,
          // createTime: until.formatTime(res.data.data.createTime)
        })

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