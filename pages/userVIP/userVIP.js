// pages/userVIP/userVIP.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    price: {},
    item: 3,
    thisIndex: 1,
    remainingTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(this.data.userInfo)
    if (this.data.userInfo.member_time != "") {
      let userInfo = this.data.userInfo
      let remainingTime = userInfo.member_time * 1000 - +new Date()
      console.log(remainingTime)
      if (remainingTime > 0) {
        this.setData({
          remainingTime: app.formatDuring(remainingTime)
        })
      } else {
        this.setData({
          remainingTime: ''
        })
      }
    }

    this.getVipPrice()
    // this.getUserInfo()
  },

  dealTap: function(e) {
    var index = e.currentTarget.dataset.index + 1;
    console.log(index)
    this.setData({
      thisIndex: index
    });
  },
  // 获取文章列表
  getVipPrice() {
    wx.showToast({
      title: "数据加载中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/apiMember/memberPrice`,
      method: 'POST',
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          let price = {
            price: data.data.data.price,
            permanent: data.data.data.permanent
          }
          this.setData({
            price: price
          })
        } else {
          wx.showToast({
            title: "无更多数据",
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  pay() {
    let userInfo = this.data.userInfo
    let data = {
      openid: userInfo.openid,
      uid: userInfo.id,
    }
    if (this.data.thisIndex > this.data.item) {
      // console.log('包年')
      data.num = 0
      data.is_forever = 1
    } else {
      // console.log(`包月--${this.data.thisIndex}个月`)
      data.num = this.data.thisIndex
      data.is_forever = 0
    }
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/apiMember/buyMember`,
      method: 'POST',
      data: data,
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          data = data.data.data
          wx.showToast({
            title: "数据提交中...",
            icon: 'loading',
            duration: 1000000
          });
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': data => {
              console.log(data)
              wx.hideToast()
              wx.showToast({
                title: '充值成功',
                icon: 'none',
                duration: 2000
              })
              // 刷新用户信息
              this.getUserInfo()
              // 两秒后返回上一页
              setTimeout(e => {
                wx.navigateBack({
                  changed: true
                })
              }, 2000)
            },
            'fail': data => {
              console.log(data)
              wx.showToast({
                title: '',
                content: '充值失败',
                showCancel: false
              })
            }
          })
        } else {
          wx.showToast({
            title: "无更多数据",
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 刷新用户信息
  getUserInfo() {
    wx.showToast({
      title: "数据更新中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_info`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          app.globalData.userInfo = data.data.data
          this.setData({
            userInfo: data.data.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})