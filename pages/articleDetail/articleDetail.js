/*
 * @Author: luow 
 * @Date: 2019-10-28 14:35:57 
 * @Last Modified by: luow
 * @Last Modified time: 2019-10-28 15:43:10
 */
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
        uid: this.data.userInfo.id,
        post_id: id
      },
      method: "POST",
      success: data => {
        console.log(data)
        data = app.null2str(data)
        if (data.data.code == 1) {
          data = data.data.data[0]
          data['createTime'] = app.transformTime(data.createTime * 1000)
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
    if (this.data.userInfo.forbidden_time != '') {
      wx.showToast({
        title: "您已被禁言",
        icon: 'none',
        duration: 2000
      });
      return false
    }
    let articleDetail = this.data.articleDetail
    let urlData = `?type=comment&post_id=${articleDetail.pid}
    &id=${articleDetail.uid}&title=${articleDetail.title}`
    wx.navigateTo({
      url: `/pages/articleComment/articleComment${urlData}`,
    })
  },
  // 进入回复页
  goReply(e) {
    if (this.data.userInfo.forbidden_time != '') {
      wx.showToast({
        title: "您已被禁言",
        icon: 'none',
        duration: 2000
      });
      return false
    }
    let commentNode = e.currentTarget.dataset
    let articleDetail = this.data.articleDetail
    let urlData = `?type=reply&post_id=${articleDetail.pid}&commentid=${commentNode.commentid}&comment=${commentNode.content}&reply_uid=${commentNode.uid}`
    wx.navigateTo({
      url: `/pages/articleComment/articleComment${urlData}`,
    })
  },
  // 禁言
  runBanned() {
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/forbidden`,
      method: 'POST',
      data: {
        aid: this.data.userInfo.id,
        uid: this.data.articleDetail.uid,
        time: 1,
        nickname: this.data.userInfo.nickname
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          wx.showModal({
            title: '',
            content: '禁言成功'
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
  // 删除
  delArticle() {
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/del_post`,
      method: 'POST',
      data: {
        aid: this.data.userInfo.id,
        uid: this.data.articleDetail.uid,
        post_id: this.data.articleDetail.pid,
        title: this.data.articleDetail.title,
        nickname: this.data.articleDetail.nickname
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          app.globalData.delPostId = this.data.articleDetail.pid
          wx.showToast({
            title: "删除成功！",
            icon: 'success',
            duration: 2000,
            mask: true
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  // 置顶
  topping() {
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/top`,
      method: 'POST',
      data: {
        aid: this.data.userInfo.id,
        uid: this.data.articleDetail.uid,
        post_id: this.data.articleDetail.pid,
        title: this.data.articleDetail.title,
        nickname: this.data.userInfo.nickname
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          wx.showModal({
            title: '',
            content: '置顶成功'
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
  // 加精
  addBoutique() {
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/essence`,
      method: 'POST',
      data: {
        aid: this.data.userInfo.id,
        uid: this.data.articleDetail.uid,
        post_id: this.data.articleDetail.pid,
        title: this.data.articleDetail.title,
        nickname: this.data.userInfo.nickname
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          wx.showModal({
            title: '',
            content: '加精成功'
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
  // 长按删除评论
  delComment(e) {
    wx.showModal({
      title: '',
      content: '是否删除当前评论？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          // 删除评论执行
          this.runDelComment(e.currentTarget.dataset.commentid)
        }
      }
    })
  },
  // 长按删除回复
  delReply(e) {
    wx.showModal({
      title: '',
      content: '是否删除当前回复？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          // 删除回复执行
          this.runDelReply(e.currentTarget.dataset.commentid)
        }
      }
    })
  },
  // 删除评论执行
  runDelComment(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/del_comment`,
      method: 'POST',
      data: {
        id: id
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          // 刷新评论部分
          this.getCommentList(this.data.options.id)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  // 删除回复执行
  runDelReply(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/del_reply`,
      method: 'POST',
      data: {
        id: id
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          // 刷新评论部分
          this.getCommentList(this.data.options.id)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  // 文件下载
  downFile(e) {
    console.log(e)
    wx.showModal({
      title: '',
      content: '该项未购买，是否前往购买？',
      cancelText: '取消',
      confirmText: '去支付',
      success: res => {
        if (res.confirm) {
          // 执行下载
          let url = e.currentTarget.dataset.url
          console.log(url)
          this.runDownFile(url)
        }
        // else if(res.cancel){
        //   // 用户点击了取消属性的按钮，对应选择了'取消'
        //   that.setData({
        //     userSex:2
        //   })
        // } 
      }
    })
  },
  runDownFile(url) {
    wx.downloadFile({
      url: app.globalData.requestUrl + url,
      success: res => {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: result => {
            const savedFilePath = result.savedFilePath;
            console.log(savedFilePath)
            // 打开文件
            wx.openDocument({
              filePath: savedFilePath,
              success: function (res) {
                console.log('打开文档成功')
              },
            });
          },
          fail: e=> {
            console.info("保存一个文件失败")
          }
        })
      },
      fail: e=> {
        console.info("下载一个文件失败");
        if (fail) {
          fail(e);
        }
      }
    })
  },
  showImg(e) {
    let url = e.currentTarget.dataset.img
    wx.previewImage({
      current: [url], // 当前显示图片的http链接   
      urls: [url] // 需要预览的图片http链接列表   
    })
  },
  showImg1(e) {
    let index = e.currentTarget.dataset.index
    let commentList = this.data.commentList
    let imgNode = commentList[index].c_file
    let img = []
    let originalImgUrl = this.data.originalImgUrl
    for (let i = 0; i < imgNode.length; i++) {
      img.push(originalImgUrl + imgNode[i].file)
    }
    wx.previewImage({
      current: img, // 当前显示图片的http链接   
      urls: img // 需要预览的图片http链接列表   
    })
  },
  showImg2(e) {
    let index = e.currentTarget.dataset.index
    let replyindex = e.currentTarget.dataset.replyindex
    let commentList = this.data.commentList
    let imgNode = commentList[index].reply[replyindex].r_file
    let img = []
    let originalImgUrl = this.data.originalImgUrl
    for (let i = 0; i < imgNode.length; i++) {
      img.push(originalImgUrl + imgNode[i].file)
    }
    wx.previewImage({
      current: img, // 当前显示图片的http链接   
      urls: img // 需要预览的图片http链接列表   
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})