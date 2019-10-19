// pages/user-tiezi/user-tiezi.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    articleList: [],
    articleListAll: [],
    requestImgUrl: '',
    originalImgUrl: ''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {    
    this.setData({
      userInfo: app.globalData.userInfo,
      requestImgUrl: app.globalData.requestImgUrl,
      originalImgUrl: app.globalData.originalImgUrl
    })
    this.getArticleList()
  },
  getArticleList() {
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_post`,
      data: {
        uid: this.data.userInfo.id,
        page: 0
      },
      method: "POST",
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          data = data.data.data
          let i = 0
          for (i in data) {
            data[i]['createTime'] = app.transformTime(data[i].createTime*1000)
          }
          let list = this.data.articleListAll.concat(data)
          this.setData({
            articleListAll: list,
            articleList: list
          })
        } else {
          // 无数据时
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 文章搜索，根据标题搜索
  getSearch(e) {
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/search`,
      method: 'POST',
      data: {
        title: e.detail.value
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.setData({
            articleList: data.data.data
          })
        } else {
          this.setData({
            articleList: this.data.articleListAll
          })
        }
      }
    })
  },
  // 文章收藏
  articleCollection(e) {
    let index = e.currentTarget.dataset.index
    let articleNode = this.data.articleList[index]
    let follow = e.currentTarget.dataset.follow
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/followPost`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        pid: articleNode.id,
        type: parseInt(follow)
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          if (follow == 0) {
            articleNode["is_follow"] = 1
            articleNode["follow"] = articleNode.follow + 1
          } else {
            articleNode["is_follow"] = 0
            articleNode["follow"] = articleNode.follow - 1
          }
          let articleList = this.data.articleList
          articleList[index] = articleNode
          this.setData({
            articleList: articleList
          })
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: `/pages/articleDetail/articleDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})