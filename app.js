//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              wx.setStorage({
                key:"usermation",
                data:"userinfo"
              })
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: {},
    groupList: [],
    requestUrl: 'http://47.104.91.26',
    // 缩略图
    requestImgUrl: 'http://47.104.91.26/upload/tailor/',
    // 原图
    originalImgUrl: 'http://47.104.91.26/upload/img/',
  },
  /**
  * null => ''
  * @param {*} data 要处理的数据
  */
  null2str(data) {
    for (let x in data) {
      if (data[x] === null) { // 如果是null 把直接内容转为 ''
        data[x] = ''
      } else {
        if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
          data[x] = data[x].map(z => {
            return this.null2str(z)
          })
        }
        if (typeof (data[x]) === 'object') { // 是json 递归继续处理
          data[x] = this.null2str(data[x])
        }
      }
    }
    return data
  }
})
