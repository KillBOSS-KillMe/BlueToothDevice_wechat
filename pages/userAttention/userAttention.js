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
      originalImgUrl: app.globalData.originalImgUrl,
      id: options.id
    })
    // 关注的人
    this.userFollow()
  },
  // 选择显示项
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.index
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
    wx.showToast({
      title: "数据加载中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_follow`,
      data: {
        uid: this.data.id
      },
      method: "POST",
      success: data => {
        wx.hideToast()
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
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 关注的帖子
  guanzhutieziLists() {
    if (this.data.guanzhutieziList.length > 0) {
      return ''
    }
    wx.showToast({
      title: "数据加载中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/follow_post`,
      data: {
        uid: this.data.id
      },
      method: "POST",
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == '1') {
          this.setData({
            guanzhutieziLists: data.data.data
          })
        } else {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 粉丝
  fensiList() {
    if (this.data.fensiList.length > 0) {
      return ''
    }
    wx.showToast({
      title: "数据加载中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_fans`,
      data: {
        uid: this.data.id
      },
      method: "POST",
      success: data => {
        wx.hideToast()
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
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
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
    let id = e.currentTarget.dataset.id
    let url = ''
    let index = e.currentTarget.dataset.index
    let guanzhurenList = this.data.guanzhurenList
    if (guanzhurenList[index].str == '0') {
      url = 'follow_cancel'
    } else {
      url = 'follow'
    }
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/${url}`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id,
        f_id: id
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          if (guanzhurenList[index].str == '0') {
            guanzhurenList[index].str = '1'
          } else {
            guanzhurenList[index].str = '0'
          }
          this.setData({
            guanzhurenList: guanzhurenList
          })
        } else {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 粉丝里面的关注
  focusTaps(e) {
    let id = e.currentTarget.dataset.id
    let url = ''
    let index = e.currentTarget.dataset.index
    let fensiList = this.data.fensiList
    if (fensiList[index].str == '0') {
      url = 'follow_cancel'
    } else {
      url = 'follow'
    }
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/${url}`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id,
        f_id: id
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          if (fensiList[index].str == '0') {
            fensiList[index].str = '1'
          } else {
            fensiList[index].str = '0'
          }
          this.setData({
            fensiList: fensiList
          })
        } else {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 进入帖子详情页
  goPostDetail(e) {
    wx.navigateTo({
      url: `/pages/articleDetail/articleDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 显示用户信息
  showUserInfo(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/userInfoShow/userInfoShow?id=${id}`,
    })
  },
})