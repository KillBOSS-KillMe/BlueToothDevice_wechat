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
    originalImgUrl: '',
    upStrt: false
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
        path: imgList[index]
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
  // 获取标签列表
  getLabelList() {
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/label`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        page: 0
      },
      success: data => {
        wx.hideToast()
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
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 图片选择
  chooseImage(e) {
    let type = e.currentTarget.dataset.type
    if (type == 'image') {
      // 图片选择
      wx.chooseImage({
        count: 9 - this.data.imgList.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.uploadimg(res.tempFiles)
        }
      })
    } else {
      // 文件选择
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: res => {
          this.uploadfile(res.tempFiles) 
        }
      })
    }
  },
  // 文件上传
  uploadfile(fileNode) {
    //上传图片
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
            fileList.push({name: data.name, filename: data.name, path: data.data, size: data.size})
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
  // 图片上传
  uploadimgsssss(imgurlNode, type, url) {
    //上传图片
    let i = 0
    for (i in imgurlNode) {
      // if (type == 'image') {
      //   if (imgurlNode[i].size > 500000000) {
      //     wx.showToast({
      //       title: `第${i + 1}张图片大于5M`,
      //       icon: 'none',
      //       duration: 2000
      //     })
      //     return false
      //   }
      // } else {
      //   if (imgurlNode[i].size > 500000000) {
      //     wx.showToast({
      //       title: `第${i + 1}个bin文件大于5M`,
      //       icon: 'none',
      //       duration: 2000
      //     })
      //     return false
      //   }
      // }
      wx.uploadFile({
        url: `${app.globalData.requestUrl}/Forum/${url}`,
        filePath: imgurlNode[i].path,
        name: type,
        formData: {
          name: imgurlNode[i].name,
        },
        success: data => {
          data = app.null2str(data)
          if (type == 'image') {
            let imgList = this.data.imgList
            imgList.push(data.data)
            this.setData({
              imgList: imgList
            })
          } else {
            data = JSON.parse(data.data)
            if (data.code == 1) {
              data = data.data
              let fileList = this.data.fileList
              let fileNameList = this.data.fileNameList
              let fileName = ''
              let size = ''
              if (type == "file") {
                fileName = imgurlNode[i].name
                size = imgurlNode[i].size
              } else {
                fileName = data.split('/').pop()
              }
              fileList.push({'name': fileName, 'path': data, 'size': size})
              fileNameList.push(fileName)
              this.setData({
                fileNameList: fileNameList,
                fileList: fileList
              })
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 4000
              })
            }
              
          }
          
        }
      });
    }
  },
  // 图片删除
  deleImg(e) {
    var index = e.currentTarget.dataset.index
    let url = this.data.imgList[index]
    this.runDelFile(url, 'img')
  },
  // 文件删除
  deleFile(e) {
    var index = e.currentTarget.dataset.index
    let url = this.data.fileList[index].path
    this.runDelFile(url, 'file')
  },
  runDelFile(url, type) {
    if (type == 'file') {
      type = '2'
    } else {
      type = '1'
    }
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/del_file`,
      method: 'POST',
      data: {
        path: url,
        type: type
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          if (type == '2') {
            let fileList = this.data.fileList
            fileList.splice(index, 1)
            this.setData({
              fileList: fileList
            })
          } else {
            let imgList = this.data.imgList
            imgList.splice(index, 1)
            this.setData({
              imgList: imgList
            })
          }
          
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
  
  // 图片预览
  previewImage: function (e) {
    let index = e.target.dataset.index;
    wx.previewImage({
      current: this.data.imgList[index],
      urls: [this.data.originalImgUrl + this.data.imgList[index]]
    })
  },

  //选择用途后加样式
  selectLabel: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      label: this.data.lableLists[index],
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
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/insert_post`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        label: this.data.label.label,
        title: this.data.article.title,
        content: this.data.article.content,
        file: this.data.fileList,
        image: this.data.imgList
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.setData({
            // 页面隐藏时，控制文件不被删除
            upStrt: true
          })
          wx.showToast({
            title: "发布成功！",
            icon: 'success',
            duration: 2000,
            mask: true
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      }
    })
  }


})


