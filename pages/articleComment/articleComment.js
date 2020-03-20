// pages/articleComment/articleComment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    requestImgUrl: '',
    originalImgUrl: '',
    imgList: [],
    fileList: [],
    commentCon: '',
    placeholderText: '请输入评论内容',
    upStrt: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    // console.log(options)
    if (options.hasOwnProperty('replyname')){
      this.setData({
        placeholderText: `回复${options.replyname}`
      })
    }
    this.setData({
      options: options,
      userInfo: app.globalData.userInfo,
      requestImgUrl: app.globalData.requestImgUrl,
      originalImgUrl: app.globalData.originalImgUrl
    })
  },
  onHide() {
    // 批量删除无用冗余文件
    this.delAllFile()
  },
  // 批量删除无用冗余文件
  delAllFile() {
    // 如果评论发布成功，则不删除
    if (!this.data.upStrt) {
      return false
    }
    let fileList = this.data.fileList
    let imgList = this.data.imgList
    let delNode = []
    for (let i = 0; i < fileList.length; i++) {
      delNode.push({path: '', type: '2'})
    }
    for (let i = 0; i < imgList.length; i++) {
      delNode.push({path: '', type: '1'})
    }
    if (delNode.length <= 0) {
      return false
    }
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/del_all_file`,
      method: 'POST',
      data: {
        paths: delNode
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          imgList.splice(index, 1)
          this.setData({
            imgList: imgList
          })
          wx.showToast({
            title: "删除成功！",
            icon: 'success',
            duration: 2000,
            mask: true
          });
        } else {
          wx.showToast({
            title: "删除失败！",
            icon: 'none',
            duration: 2000,
            mask: true
          });
        }
      }
    })
  },
  // 获取评论内容
  getCommentCon(e) {
    var len = parseInt(e.detail.value.length);
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数
    });
    this.setData({
      commentCon: e.detail.value
    })
  },
  // 图片选择
  chooseImage: function () {
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        this.uploadimg(res.tempFiles)
      }
    })
  },
  // 文件选择
  chooseFile: function () {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res => {
        console.log(res)
        this.uploadfile(res.tempFiles)
      }
    })
  },
  // 文件上传
  uploadfile(fileNode) {
    //上传图片
    let i = 0
    for (let i = 0; i < fileNode.length; i++) {
      wx.uploadFile({
        url: `${app.globalData.requestUrl}/Forum/upload_file`,
        filePath: fileNode[i].path,
        name: 'file',
        formData: {
          name: fileNode[i].name,
          size: fileNode[i].size
        },
        success: data => {
          data = app.null2str(JSON.parse(data.data))
          if (data.code == 1) {
            let fileList = this.data.fileList
            fileList.push({filename: data.name, path: data.data, size: data.size})
            this.setData({
              fileList: fileList
            })
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    }
  },
  // 图片上传
  uploadimg(imgurlNode) {
    //上传图片
    let i = 0
    for (i in imgurlNode) {
      wx.uploadFile({
        url: `${app.globalData.requestUrl}/Forum/upload_img`,
        filePath: imgurlNode[i].path,
        name: 'image',
        formData: {},
        success: data => {
          data = app.null2str(data)
          let imgList = this.data.imgList
          imgList.push(data.data)
          console.log(imgList)
          this.setData({
            imgList: imgList
          })
        }
      });
    }
  },
  // 发布评论
  upComment() {
    // console.log(this.data.options)
    // console.log(this.data.userInfo)
    // console.log(this.data.imgList)
    // console.log(this.data.commentCon)
    if (this.data.commentCon == "") {
      wx.showToast({
        title: '请输入评论内容',
        icon: "none"
      })
      return false
    }
    let options = this.data.options
    let url = ''
    let upData = {}
    if (options.type == 'comment') {
      url = 'comment'
      // 评论数据整合
      upData = {
        post_id: options.post_id,
        id:  options.id,
        title: options.title,
        content: this.data.commentCon,
        uid: this.data.userInfo.id,
        nickname: this.data.userInfo.nickname,
        file: this.data.fileList,
        image: this.data.imgList
      }
    } else {
      // type=reply&
      // post_id=${articleDetail.pid}&
      // comment_id=${commentNode.comment_id}&
      // id=${commentNode.id}&
      // reply_id=${commentNode.id}
      url = 'reply'
      // 回复数据整合
      
      upData = {
        comment_id: options.commentid,
        post_id: options.post_id,
        id: options.reply_uid,
        reply_id: options.reply_uid,
        comment: options.comment,
        content: this.data.commentCon,
        uid: this.data.userInfo.id,
        nickname: this.data.userInfo.nickname,
        file: this.data.fileList,
        image: this.data.imgList
      }
    }
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/${url}`,
      method: 'POST',
      data: upData,
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          // 保存发布状态
          this.setData({
            upStrt: true
          })
          wx.showToast({
            title: "发布成功！",
            icon: 'success',
            duration: 2000,
            mask: true
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)
        }
      }
    })
  },
  // 文件删除
  deleFile(e) {
    var index = e.currentTarget.dataset.index
    var fileList = this.data.fileList
    let type = e.currentTarget.dataset.type
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/del_file`,
      method: 'POST',
      data: {
        path: fileList[index].path,
        type: type
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        console.log(data)
        if (data.data.code == 1) {
          fileList.splice(index, 1)
          this.setData({
            fileList: fileList
          })
          wx.showToast({
            title: "删除成功！",
            icon: 'success',
            duration: 2000,
            mask: true
          });
        } else {
          wx.showToast({
            title: "删除失败！",
            icon: 'none',
            duration: 2000,
            mask: true
          });
        }
      }
    })

  },
  // 图片删除
  deleImg(e) {
    var index = e.currentTarget.dataset.index
    var imgList = this.data.imgList
    let type = e.currentTarget.dataset.type
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/del_file`,
      method: 'POST',
      data: {
        path: imgList[index],
        type: type
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          imgList.splice(index, 1)
          this.setData({
            imgList: imgList
          })
          wx.showToast({
            title: "删除成功！",
            icon: 'success',
            duration: 2000,
            mask: true
          });
        } else {
          wx.showToast({
            title: "删除失败！",
            icon: 'none',
            duration: 2000,
            mask: true
          });
        }
      }
    })
    // var index = e.currentTarget.dataset.index
    // var imgList = this.data.imgList
    // wx.request({
    //   url: `${app.globalData.requestUrl}/Forum/del_file`,
    //   method: 'POST',
    //   data: {
    //     path: imgList[index]
    //   },
    //   success: data => {
    //     data = app.null2str(data)
    //     if (data.data.code == 1) {
    //       imgList.splice(index, 1)
    //       this.setData({
    //         imgList: imgList
    //       })
    //       wx.showToast({
    //         title: "删除成功！",
    //         icon: 'success',
    //         duration: 2000,
    //         mask: true
    //       });
    //     } else {
    //       wx.showToast({
    //         title: "删除失败！",
    //         icon: 'none',
    //         duration: 2000,
    //         mask: true
    //       });
    //     }
    //   }
    // })
  },
  // 图片预览
  previewImage: function (e) {
    let index = e.target.dataset.index;
    wx.previewImage({
      current: this.data.imgList[index],
      urls: [this.data.originalImgUrl + this.data.imgList[index]]
    })
  },

})