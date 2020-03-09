// pages/quanxian/quanxian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    userInfo: {},
    imgUrl: '',
    navAction: ['noActive', 'noActive', 'active', 'noActive']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      navAction: app.globalData.navAction,
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl
    })
    this.getList()
    return false
  },
  save() {
    console.log('wx.env', wx.env)
    wx.downloadFile({
      url: `${app.globalData.requestUrl}/upload/file/game/20191203/f3444e080d8954667476069afe9e9b85.bin`,
      success(res) {
        console.log(res)
        var savePath = wx.env.USER_DATA_PATH + "/aaa.jpg"
        wx.getFileSystemManager()
          .saveFile({//下载成功后保存到本地
            tempFilePath: res.tempFilePath,
            filePath: savePath,
            success(res2) {
              //获取了相册的访问权限，使用 wx.saveImageToPhotosAlbum 将图片保存到相册中
              wx.saveImageToPhotosAlbum({
                filePath: savePath,
                success: (res) => {
                  //保存成功弹出提示，告知一下用户
                  wx.showModal({
                    title: '文件已保存到手机相册',
                    content: '位于tencent/MicroMsg/WeiXin下 \r\n将保存的文件重命名改为[ .bin ]后缀即可',
                    confirmColor: '#0bc183',
                    confirmText: '知道了',
                    showCancel: false
                  })
                },
                fail(res) {
                  console.log(res)
                }
              })
            },
            fail(res) {
              console.log(res, 999)
            }
          })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  getList() {
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Official/official_type`,
      method: "POST",
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == '1') {
          this.setData({
            listData: data.data.data,
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
  // 进入游戏列表
  goGamedan(e) {
    wx.navigateTo({
      url: `/pages/gameList/gameList?id=${e.currentTarget.dataset.id}`
    })
  },
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
  }
})