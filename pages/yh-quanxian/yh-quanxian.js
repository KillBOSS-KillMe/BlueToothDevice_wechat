// pages/quanxian/quanxian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    luntanTxt: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    var that = this;
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/forum`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        post_id: id
      },
      method: "POST",
      success: res => {
        console.log(res);
        res = app.null2str(res.data)
        if (res.code == '1') {
          this.setData({
            luntanTxt: res.data,
          })
        } else {
          // wx.showModal({
          //   title: '',
          //   content: res.msg,
          //   showCancel: false
          // })
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
  // 删除
  adminDelete:function(){
    var that = this;
    wx.request({
      url: '${this.$parent.globalData.requestUrl}/del_post',
      headers:{
        'Content-Type':'application/json'
      },
      data:{
        post_id:that.data.id
      },
      method:"POST",
      success: res =>{
        wx.navigateBack({
          delta: 1,
        })
        this.userForhidden()
      }
    })
  },
  // 置顶
  adminTop:function(){
    var that = this;
    wx.request({
      url: '${this.$parent.globalData.requestUrl}/Forum/top',
      headers:{
        'Content-Type':'application/json'
      },
      data:{
        post_id:that.data.id
      },
      method:"POST",
      success: res =>{
        if(res.code == "1"){
          that.setData({
            adminTops:res.data
          })
        }else{
          wx.showToast({
            title: '置顶成功',
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data);
        // this.userForhidden()
      }
    })
  },
  // 加精
  adminJiajing: function () {
    var that = this;
    wx.request({
      url: '${this.$parent.globalData.requestUrl}/Forum/essence',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        post_id: that.data.id
      },
      method: "POST",
      success: res => {
        if (res.code == "1") {
          that.setData({
            adminJiajings: res.data
          })
        } else {
          wx.showToast({
            title: '加精成功',
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data);
        // this.userForhidden()
      }
    })
  },
})