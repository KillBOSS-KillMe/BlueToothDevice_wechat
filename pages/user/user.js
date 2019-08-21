// pages/delete-jilu/delete-jilu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(opt) {
    console.log(app.globalData.userInfo)
    this.setData({
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
    return ''
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
  tieziTap(e) {
    wx.switchTab({
      url: `/pages/luntan/luntan?id=${e.currentTarget.dataset.id}`
    })
  }

})