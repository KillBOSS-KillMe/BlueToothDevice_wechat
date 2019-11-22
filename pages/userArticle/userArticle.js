//logs.js
// const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    logs: [],
    articleListAll: [],
    articleList: [],
    requestImgUrl: '',
    originalImgUrl: '',
    pageNum: 1,
    navAction:  ['noActive', 'active', 'noActive', 'noActive']
  },
  onLoad: function () {
    
    // 获取文章列表
    // this.getArticleList()
  },
  onShow() {
    this.setData({
      navAction: app.globalData.navAction,
      userInfo: app.globalData.userInfo,
      requestImgUrl: app.globalData.requestImgUrl,
      originalImgUrl: app.globalData.originalImgUrl,
      pageNum: 1,
      articleListAll: [],
      articleList: []
    })
    // 获取文章列表
    this.getArticleList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getArticleList()
  },
  // 获取文章列表
  getArticleList() {
    wx.showToast({
      title: "数据加载中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_post`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        page: this.data.pageNum
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          let pageNum = this.data.pageNum + 1
          this.setData({
            pageNum: pageNum
          })
          data = data.data.data
          
          let list = this.data.articleListAll.concat(data)
          let i = 0
          for (i in list) {
            list[i]['createTime'] = app.transformTime(list[i].createTime * 1000)
            if (app.globalData.delPostId == list[i].id) {
              list.splice(i, 1)
            }
          }
          this.setData({
            articleListAll: list,
            articleList: list
          })
        } else {
          wx.showToast({
            title: "无更多数据",
            icon: 'none',
            duration: 2000
          });
          // wx.showModal({
          //   title: '',
          //   content: data.data.msg
          // })
        }
      }
    })
  },
  // 文章收藏
  articleCollection(e) {
    let index = e.currentTarget.dataset.index
    let articleNode = this.data.articleList[index]
    let follow = e.currentTarget.dataset.follow
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/followPost`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        pid: articleNode.id,
        type: parseInt(follow)
      },
      success: data => {
        wx.hideToast()
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
  // 查看大图
  showImg(e) {
    let url =  e.currentTarget.dataset.img
    wx.previewImage({
      current: [url], // 当前显示图片的http链接   
      urls: [url] // 需要预览的图片http链接列表   
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: `/pages/articleDetail/articleDetail?id=${e.currentTarget.dataset.id}`
    })
  }
})