// pages/guanzhu/guanzhu.js

var app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['关注的人', '关注的帖子', '粉丝'],
    currentTab: 0,
    guanzhurenList:[],
    guanzhutieziList:[],
    fensiList:[]
  },
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      // 关注的人
      this.userFollow()
    } else if (index == 1) {
      // 关注的帖子
      this.guanzhutieziLists()
    } else {
      // 2  粉丝
      this.fensiList()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.userFollow()
  },
  // 关注的人
  userFollow() {
    if (this.data.guanzhurenList.length > 0) {
      return ''
    }
    wx.request({
      url: `http://192.168.1.168/User/user_follow`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        uid: '1'
      },
      method: "POST",
      success: res => {
        res = app.null2str(res.data)
        if (res.code == '1') {
          let guanzhurenList = res.data
          let i = 0
          for (i in guanzhurenList) {
            guanzhurenList[i]["str"] = "0"
          }
          this.setData({
            guanzhurenList: guanzhurenList
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
  // 关注的帖子
  guanzhutieziLists() {
    if (this.data.guanzhutieziList.length > 0) {
      return ''
    }
    var that = this;
    wx.request({
      url: `http://192.168.1.168/User/follow_post`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        uid: '1'
      },
      method: "POST",
      success: res => {
        res = app.null2str(res.data)
        if (res.code == '1') {
          this.setData({
            guanzhutieziLists: res.data
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
  // 粉丝
  fensiList() {
    if (this.data.fensiList.length > 0) {
      return ''
    }
    wx.request({
      url: `http://192.168.1.168/User/user_fans`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        uid: '2'
      },
      method: "POST",
      success: res => {
        res = app.null2str(res.data)
        if (res.code == '1') {
          let fensiList = res.data
          let i = 0
          for (i in fensiList) {
            fensiList[i]["str"] = "0"
          }
          this.setData({
            fensiList: fensiList
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
  //选择用途后加样式
  select_use: function (e) {
    this.setData({
      state: e.currentTarget.dataset.key,
    });
  },
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

// 关注
  focusTap(e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    var guanzhurenList = this.data.guanzhurenList
    if (guanzhurenList[index].str == '0') {
      guanzhurenList[index].str = '1'
    } else {
      guanzhurenList[index].str = '0'
    }
    console.log(guanzhurenList)
    this.setData({
      guanzhurenList: guanzhurenList
    })
  },
  // 粉丝里面的关注
  focusTaps(e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    var fensiList = this.data.fensiList
    if (fensiList[index].str == '0') {
      fensiList[index].str = '1'
    } else {
      fensiList[index].str = '0'
    }
    console.log(fensiList)
    this.setData({
      fensiList: fensiList
    })
  },

  
})