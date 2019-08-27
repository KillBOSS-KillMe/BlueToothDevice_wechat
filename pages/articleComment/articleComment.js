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
    commentCon: ''
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
  },
  // 获取评论内容
  getCommentCon(e) {
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
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/comment`,
      method: 'POST',
      data: {
        post_id: this.data.options.post_id,
        id:  this.data.options.post_id,
        title: this.data.options.title,
        content: this.data.commentCon,
        uid: this.data.userInfo.id,
        nickname: this.data.userInfo.nickname,
        file: '',
        image: this.data.imgList
      },
      success(data) {
        data = app.null2str(data)
        if (data.data.code == 1) {
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
  // 图片删除
  deleImg(e) {
    var index = e.currentTarget.dataset.index
    var imgList = this.data.imgList
    imgList.splice(index, 1)
    this.setData({
      imgList: imgList
    })
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