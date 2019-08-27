// pages/delete-jilu/delete-jilu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    navAction:  ['noActive', 'noActive', 'noActive', 'active']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(opt) {
    console.log(app.globalData.userInfo)
    this.setData({
      navAction: app.globalData.navAction,
      userInfo: app.globalData.userInfo
    })
    // console.log(this.data.userInfo)
  },
  newGroup() {
    if (this.data.floatingStr) {
      this.setData({
        floatingStr: false
      })
    } else {
      this.setData({
        floatingStr: true
      })
    }
  },
  newGroupName(e) {
    console.log(e.detail.value)
    this.setData({
      newGroupNameData: e.detail.value
    })
  },
  submitData(){
    console.log(this.data.newGroupNameData)
    // return ''
    wx.request({
      url: `${this.$parent.globalData.requestUrl}/login`,
      method: 'POST',
      data: {
        newGroupNameData: this.data.newGroupNameData
      },
      success: data => {
        if (data.code == "1") {
          that.setData({
            userIdindex:res.data
          })

        this.userForhidden()
        } else {
          wx.showModal({
            title: '',
            content: data.msg
          })
        }
      }
    })
    // if (this.data.floatingStr) {
    //   this.setData({
    //     floatingStr: false
    //   })
    // } else {
    //   this.setData({
    //     floatingStr: true
    //   })
    // }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  // 渲染数据方法
  // renderList: function() {
  //   var that = this
  //   var a = wx.getStorageSync('key')
  //   wx.request({
  //     url: '你的地址',
  //     data: {
  //      //你需要传的参数
  //       page: that.data.current
  //     },
  //     method: 'post',
  //     header: {
  //       "content-type": "applocation/json"  
  //     },
  //     success: function(res) {
  //       console.log(res.data.userMsgList)
  //       that.setData({
  //         item: res.data.userMsgList
  //       })
  //     }
  //   })
  // },
  // 点击任意一条消息后小圆点消失
  viewDetails: function (e) {
    // console.log(e)
    var that = this
    // console.log(e.currentTarget.id)
    //发送请求给后台，告诉他用户点击的这条消息状态要改变
    wx.request({
      url: 'http://192.168.1.168/User/point',
      method: "POST",
      // data: {
      //   id: e.currentTarget.id
      // },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.code == "1") {
          this.setData({
            viewDetails: res.data
          })
          console.log(viewDetails)
        }
      }
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