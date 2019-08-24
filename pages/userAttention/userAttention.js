// pages/guanzhu/guanzhu.js

var app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    navbar: ['关注的人', '关注的帖子', '粉丝'],
    currentTab: 0,
    guanzhurenList:[],
    guanzhutieziList:[],
    fensiList:[]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      requestImgUrl: app.globalData.requestImgUrl,
      originalImgUrl: app.globalData.originalImgUrl
    })
    // 关注的人
    this.userFollow()
  },
  // 选择显示项
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
  // 关注的人
  userFollow() {
    if (this.data.guanzhurenList.length > 0) {
      return ''
    }
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_follow`,
      data: {
        uid: this.data.userInfo.id
      },
      method: "POST",
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          let guanzhurenList = data.data.data
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
            content: data.data.msg,
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
    wx.request({
      url: `${app.globalData.requestUrl}/User/follow_post`,
      data: {
        uid: this.data.userInfo.id
      },
      method: "POST",
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          this.setData({
            guanzhutieziLists: data.data.data
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
  // 粉丝
  fensiList() {
    if (this.data.fensiList.length > 0) {
      return ''
    }
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_fans`,
      data: {
        uid: this.data.userInfo.id
      },
      method: "POST",
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          let fensiList = data.data.data
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
  //选择用途后加样式
  select_use: function (e) {
    this.setData({
      state: e.currentTarget.dataset.key,
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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