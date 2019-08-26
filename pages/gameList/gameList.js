const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    selGameList: [],
    downloadStr: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl
    })
    this.getList(options.id)
  },
  // 获取游戏列表
  getList(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/Official/catalog`,
      method: "POST",
      data: {
        type_id: id
      },
      success: data => {
        console.log(data)
        data = app.null2str(data)
        if (data.data.code == '1') {
          data = data.data.data
          let i = 0
          for (i in data) {
            data[i]['str'] = '0'
          }
          this.setData({
            listData: data,
          })
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  selGame(e) {
    let index = e.currentTarget.dataset.index
    let gameStr = this.data.listData[index].str
    let listData = this.data.listData
    let selGameList = this.data.selGameList
    if (this.data.downloadStr) {
      if (gameStr == '1') {
        listData[index]['str'] = '0'
        let i = 0
        for (i in selGameList) {
          if (listData[index].id == selGameList[i].id) {
            // 在选中对象数组中删除该项
            selGameList.splice(i, 1)
          }
        }
      } else {
        listData[index]['str'] = '1'
        selGameList.push(listData[index])
      }
      this.setData({
        listData: listData,
        selGameList: selGameList
      })
    } else {
      // 没有在下载状态下，进入项目详情
      let dataNode = this.data.listData[index]
      wx.navigateTo({
        url: `/pages/gameDetail/gameDetail?id=${dataNode.id}&name=${dataNode.name}&img=${dataNode.img}&c_num=${dataNode.c_num}&d_num=${dataNode.d_num}`
      })
    }
    
  },
  // 下载按钮点击的事件
  download() {
    // 选中的项目大于0项，执行下载
    if (this.data.selGameList.length > 0) {
      // 此时进行递归下载
    } else {
      // 等于0项，修改按钮状态
      if (this.data.downloadStr) {
        this.setData({
          downloadStr: false,
          selGameList: []
        })
        return false
      } else {
        this.setData({
          downloadStr: true
        })
      }
    }
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

  }
})