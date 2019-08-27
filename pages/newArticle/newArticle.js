const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xuanzeidx: 1,  // 1本机 0蓝牙
    equipmentflag: false, // 选择设备
    fileflag: false, // 选择文件
    userInfo: {},
    lableLists: [],
    label: {},
    imgList: [],
    fileList: [],
    fileNameList: [],
    article: {},
    requestImgUrl: '',
    originalImgUrl: ''
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
    // 获取标签列表
    this.getLabelList()
  },
  // 获取标签列表
  getLabelList() {
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/label`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        page: 0
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.setData({
            lableLists: data.data.data
          })
          if (this.data.lableLists.length > 0) {
            this.setData({
              label: this.data.lableLists[0]
            })
            console.log(this.data.label)
          }
        } else {
          // wx.showModal({
          //   title: '',
          //   content: data.data.msg
          // })
        }
      }
    })
  },
  // 图片选择
  chooseImage(e) {
    let type = e.currentTarget.dataset.type
    let url = ''
    if (type == 'image') {
      url = 'upload_img'
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.uploadimg(res.tempFiles, type, url)
        }
      })
    } else {
      url = 'upload_file'
      wx.chooseMessageFile({
        count: 9,
        type: 'all',
        success: res => {
          this.uploadimg(res.tempFiles, type, url)
        }
      })
    }
  },
  // 图片上传
  uploadimg(imgurlNode, type, url) {
    //上传图片
    let i = 0
    for (i in imgurlNode) {
      wx.uploadFile({
        url: `${app.globalData.requestUrl}/Forum/${url}`,
        filePath: imgurlNode[i].path,
        name: type,
        formData: {},
        success: data => {
          data = app.null2str(data)
          if (type == 'image') {
            let imgList = this.data.imgList
            imgList.push(data.data)
            this.setData({
              imgList: imgList
            })
          } else {
            console.log(data)
            data = JSON.parse(data.data)
            data = data.data
            let fileList = this.data.fileList
            let fileNameList = this.data.fileNameList
            console.log(data)
            let fileName = data.split('/').pop()
            console.log(data, fileName)
            fileList.push(data)
            fileNameList.push(fileName)
            this.setData({
              fileNameList: fileNameList,
              fileList: fileList
            })
          }
          
        }
      });
    }

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
  // 图片删除
  deleFile(e) {
    var index = e.currentTarget.dataset.index
    var fileNameList = this.data.fileNameList
    var fileList = this.data.fileList
    fileNameList.splice(index, 1)
    fileList.splice(index, 1)
    this.setData({
      fileNameList: fileNameList,
      fileList: fileList
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

  //选择用途后加样式
  select_use: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      label: this.lableLists[index],
    });
  },
  handleTitleblur(e) {
    this.setData({
      'article.title': e.detail.value
    })
  },
  handleContentblur(e) {
    this.setData({
      'article.content': e.detail.value
    })
  },
  // 发布帖子
  submitForm(e) {
    console.log(this.data.article)
    console.log(this.data.label)
    // return false
    if (this.data.article.title == "") {
      wx.showToast({
        title: '请输入标题',
        icon: "none"
      })
      return false
    }
    if (this.data.article.content == "") {
      wx.showToast({
        title: '请输入帖子内容',
        icon: "none"
      })
      return false
    }
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/insert_post`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        label: this.data.label.id,
        title: this.data.article.title,
        content: this.data.article.content,
        file: this.data.fileList,
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
  }


})


