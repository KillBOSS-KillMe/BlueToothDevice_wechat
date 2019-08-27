//app.js
// "pages/index/index",                       首页


// "pages/newArticle/newArticle",             发布文章
// "pages/articleDetail/articleDetail",       文章详情
// "pages/articleDetail/articleComment",      文章详情
// "pages/forum/forum",                       论坛
// "pages/gameList/gameList",                 游戏列表
// "pages/gameComment/gameComment",           游戏评论

// "pages/bluetooth/bluetooth",               蓝牙
// "pages/userMessage/userMessage",           消息列表

// "pages/homePage/homePage",                 官网
// "pages/upData/upData",                     数据上传
// "pages/search/search",                     搜搜
// "pages/user/user",                         用户==>>首页
// "pages/userAttention/userAttention",       用户 ==>> 关注
// "pages/userToppingList/userToppingList",   用户==>>置顶
// "pages/userAddFine/userAddFine",           用户==>>加精
// "pages/userDownloadList/userDownloadList", 用户==>>下载
// "pages/userAchievement/userAchievement",   用户==>>成就
// "pages/userDelete/userDelete",             用户==>>删除
// "pages/userArticle/userArticle",           用户==>>文章列表
// "pages/userBanned/userBanned",             用户==>>禁言
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
                key: "usermation",
                data: "userinfo"
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
    articleDetail: {},
    requestUrl: 'http://47.104.91.26',
    // 图片地址
    imgUrl: 'http://47.104.91.26',
    // 缩略图
    requestImgUrl: 'http://47.104.91.26/upload/tailor/',
    // 缩略图
    requestImgUrl: 'http://47.104.91.26/upload/tailor/',
    // 原图
    originalImgUrl: 'http://47.104.91.26/upload/img/',
    navAction: ['active', 'noActive', 'noActive', 'noActive']
  },
  /**
  * 时间戳转时间
  * @param {*} timestamp 要处理的数据
  */
  transformTime(timestamp = +new Date()) {
    if (timestamp) {
      var time = new Date(timestamp);
      var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
      var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
      var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
      var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
      var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
      var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
      return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
    } else {
      return '';
    }
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
