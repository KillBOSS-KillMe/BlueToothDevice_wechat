// pages/quanxian/quanxian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xuanzeidx: 1,  // 1本机 0蓝牙
    equipmentflag: false, // 选择设备
    fileflag: false, // 选择文件
    userInfo: "",
    title: '', //标题内容
    content: '',//正文内容
    images: [],
    tempFilePaths: [],
    lableLists: [],
    form: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取标签列表
    this.getLabelList()
  },
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
          if (this.lableLists.length > 0) {
            this.setData({
              form: this.lableLists[0]
            })
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
  // 图片上传
  chooseImage: function () {
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        this.uploadimg(imgurl)
        this.setData({
          tempFilePaths: this.data.tempFilePaths.concat(tempFilePaths)
        })
      }
    })
  },
  uploadimg(imgurl) {
    //上传图片
    wx.request({
      url: `${this.$parent.globalData.requestUrl}/Forum/upload_img`,
      method: 'POST',
      data: {
        img: imgurl
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          var resdata = JSON.parse(data.data);
          // this.data.img_arr[i],
          //   this.setData({
          //     'img.url': resdata.data.url
          //   })
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  deleImg(e) {
    var idx = e.currentTarget.dataset.idx
    var tempFilePaths = this.data.tempFilePaths
    tempFilePaths.splice(idx, 1)
    this.setData({
      tempFilePaths
    })
  },


  /**
   * 预览图片方法
   */
  listenerButtonPreviewImage: function (e) {
    let index = e.target.dataset.index;
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths[index],
      urls: that.data.tempFilePaths,
      success: function (res) {
      },
      fail: function () {
      }
    })
  },

  //选择用途后加样式
  select_use: function (e) {
    this.setData({
      'form.state': e.currentTarget.dataset.id,
    });
  },
  handleTitleblur(e) {
    this.setData({
      'form.title': e.detail.value
    })
  },
  handleContentblur(e) {
    this.setData({
      'form.content': e.detail.value
    })
  },


  submitForm(e) {
    if (this.data.form.title == "") {
      wx.showToast({
        title: '请输入标题',
        icon: "none"
      })
      return false
    }
    if (this.data.form.content == "") {
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
        uid: this.data.userInfo.uid,
        lable: this.data.form.label,
        title: this.data.form.title,
        content: this.data.form.content,
        file: '',
        img: ''
      },
      success(data) {
        data = app.null2str(data)
        if (data.code == 1) {
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })
  }


})


