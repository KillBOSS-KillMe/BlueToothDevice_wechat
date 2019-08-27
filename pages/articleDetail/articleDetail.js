// pages/quanxian/quanxian.js
// var until = require("../../utils/util.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    userInfo: {},
    articleDetail: {},
    commentList: [],
    requestImgUrl: '',
    originalImgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      userInfo: app.globalData.userInfo,
      requestImgUrl: app.globalData.requestImgUrl,
      originalImgUrl: app.globalData.originalImgUrl
    })
    
    // 获取文章详情
    this.getArticleList(options.id)
    // this.getCommentList(options.id)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCommentList(this.data.options.id)
  },
  // 获取文章详情
  getArticleList(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/User/post_info`,
      data: {
        post_id: id
      },
      method: "POST",
      success: data => {
        // console.log(data)
        data = app.null2str(data)
        if (data.data.code == 1) {
          data = data.data.data[0]
          data['createTime'] = app.transformTime(data.createTime)
          // 文章内容存入全局，在评论回复页使用
          app.globalData.articleDetail = data
          this.setData({
            articleDetail: data
          })
        }
      }
    })
  },
  // 获取文章评论
  getCommentList(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/User/post_comment`,
      data: {
        post_id: id,
        page: 0
      },
      method: "POST",
      success: data => {
        console.log(data)
        data = app.null2str(data)
        if (data.data.code == 1) {
          data = data.data.data
          let i = 0
          for (i in data) {
            data[i]['createTime'] = app.transformTime(data[i].createTime)
            let y = 0
            for (y in data[i].reply) {
              data[i].reply[y]['createTime'] = app.transformTime(data[i].reply[y].createTime)
            }
          }
          this.setData({
            commentList: data
          })
        }
      }
    })
  },
  // 收藏与取消收藏
  articleCollection(e) {
    let articleNode = this.data.articleDetail
    let follow = e.currentTarget.dataset.follow
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/followPost`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        pid: articleNode.pid,
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
          this.setData({
            articleDetail: articleNode
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
  // 进入评论页
  goComment() {
    let articleDetail = this.data.articleDetail
    let urlData = `?type=comment&post_id=${articleDetail.pid}
    &id=${articleDetail.uid}&title=${articleDetail.title}`
    wx.navigateTo({
      url: `/pages/articleComment/articleComment${urlData}`,
    })
  },
  // 进入回复页
  goReply(e) {
    let commentNode = e.currentTarget.dataset
    let articleDetail = this.data.articleDetail
    let urlData = `?type=reply&post_id=${articleDetail.pid}&commentid=${commentNode.commentid}&comment=${commentNode.content}&reply_uid=${commentNode.uid}`
    wx.navigateTo({
      url: `/pages/articleComment/articleComment${urlData}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
})