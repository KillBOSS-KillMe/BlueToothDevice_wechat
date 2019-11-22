//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    inputValue: '', //搜索的内容
    souList:[],
    color: "rgba(66, 66, 66, 1)"
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  selFile: function () {
    // wx.navigateTo({
    //   url: '/pages/index/index'
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  //搜索框文本内容显示
  inputBind: function (e) {
    this.setData({
      souList: []
    })
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/FileGroup/searchData`,
      method: 'POST',
      data: {
        name: e.detail.value
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.setData({
            souList: data.data.data
          })
        } else {
          wx.showModal({
            title: '',
            content: data.data.errmsg
          })
        }
      }
    })
  }
})



