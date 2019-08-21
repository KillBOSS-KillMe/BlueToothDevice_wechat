//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputValue: '', //搜索的内容
    souList:[{
      name:'搜索结果1'
    },{
      name:'搜索结果2'
    },{
      name:'搜索结果3'
    },{
      name:'搜索结果4'
    }],
    color: "rgba(66, 66, 66, 1)"
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  jump: function () {
    // wx.navigateTo({
    //   url: '/pages/index/index'
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({ 
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // jump(){
  //   this.setData({
  //   })
  // }
  //搜索框文本内容显示
  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
    console.log('bindInput' + this.data.inputValue)

  },
  /**
  * 搜索执行按钮
  */
  query: function (event) {

    var that = this

    /**
     * 提问帖子搜索API
     * keyword string 搜索关键词 ; 这里是 this.data.inputValue
     * start int 分页起始值 ; 这里是 0
     */
    wx.request({
      url: 'https://localhost/proj_online_class/server/public/index.php/forum/forum/get_issue_search/' + this.data.inputValue + /0/,
      data: {
        inputValue: this.data.inputValue
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var searchData = res.data
        that.setData({
          searchData
        })

        /**
         * 把 从get_issue_searchAPI 
         * 获取 提问帖子搜索 的数据 设置缓存
         */
        wx.setStorage({
          key: 'searchLists',
          data: {
            searchLists: res.data
          }
        })

        /**
         * 设置 模糊搜索
         */
        if (!that.data.inputValue) {
          //没有搜索词 友情提示
          wx.showToast({
            title: '请重新输入',
            duration: 2000,
          })
        } else if (searchData.search.length == 0) {
          //搜索词不存在 友情提示
          wx.showToast({
            title: '关键词不存在',
            duration: 2000,
          })
        } else {
          //提取题目关键字 与搜索词进行匹配
          var searchIndex = searchData.search.length
          var d = 0;
          for (var i = 0; i <= searchIndex - 1; i++) {

            var searchTitle = searchData.search[d].title
            console.log(searchTitle)
            d = d + 1;

            for (var x = 0; x <= searchTitle.length; x++) {
              for (var y = 0; y <= searchTitle.length; y++) {
                var keyWord = searchTitle.substring(x, y);
                console.log(keyWord)
              }
            }

            /**
             * 根据关键词 跳转到 search搜索页面
             */
            wx.navigateTo({
              url: '../search/search',
            })
          }
        }



      }
    })
  }
})



