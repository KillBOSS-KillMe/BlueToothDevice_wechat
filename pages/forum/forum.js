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
    this.setData({
      userInfo: app.globalData.userInfo
    })
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
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/forum`,
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
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 文章搜索，根据标题搜索
  getSearch(e) {
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/search`,
      method: 'POST',
      data: {
        title: e.detail.value
      },
      success: data => {
        wx.hideToast()
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
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
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
  // goQuanxian(e) {
  //   wx.navigateTo({
  //     url: `/pages/yh-quanxian/yh-quanxian?id=${e.currentTarget.dataset.id}`,
  //     success: function (res) { },
  //   })
  // },
  goDetail(e) {
    wx.navigateTo({
      url: `/pages/articleDetail/articleDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // goQuanxian(e) {
  //   // var userid = e.currentTarget.dataset.userid;
  //   // if (type==1){
  //   //   wx.navigateTo({
  //   //     url: '/pages/quanxian/quanxian',
  //   //     success: function(res) {},
  //   //     fail: function(res) {},
  //   //     complete: function(res) {},
  //   //   })
  //   // }else if (type==2){
  //   wx.navigateTo({
  //     url: '/pages/yh-quanxian/yh-quanxian',
  //   })
  //   // }
  // }
  // 进入设备页
  goDevicePage() {
    app.globalData.navAction = ['active', 'noActive', 'noActive', 'noActive']
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  // 进入论坛页
  goForumPage() {
    app.globalData.navAction = ['noActive', 'active', 'noActive', 'noActive']
    wx.redirectTo({
      url: '/pages/forum/forum'
    })
  },
  // 进入官网页
  goHomePage() {
    app.globalData.navAction = ['noActive', 'noActive', 'active', 'noActive']
    wx.redirectTo({
      url: '/pages/homePage/homePage'
    })
  },
  // 进入用户页
  goUserPage() {
    app.globalData.navAction = ['noActive', 'noActive', 'noActive', 'active']
    wx.redirectTo({
      url: '/pages/user/user'
    })
  },
  // 进入发帖页
  goNewAticle() {
    if (this.data.userInfo.forbidden_time != '') {
      wx.showToast({
        title: "您已被禁言",
        icon: 'none',
        duration: 2000
      });
      return false
    }
    wx.navigateTo({
      url: '/pages/newArticle/newArticle'
    })
  }
})