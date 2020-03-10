const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    selGameList: [],
    downloadStr: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options,
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getList(this.data.options.id)
  },

  // 获取游戏列表
  getList(id) {
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Official/catalog`,
      method: "POST",
      data: {
        type_id: id
      },
      success: data => {
        wx.hideToast()
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
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  selGame(e) {
    let index = e.currentTarget.dataset.index
    let gameStr = this.data.listData[index].str
    let listData = this.data.listData
    let dataNode = this.data.listData[index]
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
        let isBuy = e.currentTarget.dataset.isbuy



        // if (isBuy == '0') {
        //   wx.showModal({
        //     title: '',
        //     content: '该项未购买，是否前往购买？',
        //     cancelText:'取消',
        //     confirmText:'去支付',
        //     success: res => {
        //       if(res.confirm){
        //         // 用户点击了确定属性的按钮，对应选择了'去支付'
        //         // 跳转
        //         let listData = JSON.stringify(this.data.listData)

        //         wx.navigateTo({
        //           url: `/pages/gameBuy/gameBuy?list=${listData}`
        //         })
        //       } 
        //       // else if(res.cancel){
        //       //   // 用户点击了取消属性的按钮，对应选择了'取消'
        //       //   that.setData({
        //       //     userSex:2
        //       //   })
        //       // } 
        //     }
        //   })
        //   return false
        // }
        listData[index]['str'] = '1'
        selGameList.push(listData[index])
      }
      this.setData({
        listData: listData,
        selGameList: selGameList
      })
    } else {
      // 没有在下载状态下，进入项目详情
      // let dataNode = this.data.listData[index]
      wx.navigateTo({
        url: `/pages/gameDetail/gameDetail?id=${dataNode.id}&name=${dataNode.name}&introduce=${dataNode.introduce}&img=${dataNode.img}&c_num=${dataNode.c_num}&d_num=${dataNode.d_num}`
      })
    }

  },
  // 下载按钮点击的事件
  download() {
    //先检查相册访问授权情况
    // wx.getSetting({
    //   success: (res) => {
    //     //检查是否有访问相册的权限，如果没有则通过wx.authorize方法授权
    //     if (!res.authSetting['scope.writePhotosAlbum']) {
    //       wx.authorize({
    //         scope: 'scope.writePhotosAlbum',
    //         success: (res) => {
    //           //用户点击允许获取相册信息后进入下载保存逻辑
    //         }
    //       })
    //     } else {
    //     }
    //   }
    // });


    // 选中的项目大于0项，执行下载
    if (this.data.selGameList.length > 0) {
      // 此时进行递归下载
      let selGameList = this.data.selGameList
      let did = ''
      let i = 0
      for (i in selGameList) {
        did += selGameList[i].id
        did += ','
      }
      did = did.substring(0, did.length - 1)
      var stemManager = wx.getFileSystemManager()
      wx.request({
        url: `${app.globalData.requestUrl}/Official/download`,
        method: "POST",
        data: {
          did: did,
          uid: this.data.userInfo.id,
        },
        success(res) {
          if (res.data.code == 1) {
          var list = res.data.data || []
            Promise.all(list.map(item => {
              return new Promise((resolve, reject) => {
                wx.downloadFile({
                  url: `${app.globalData.requestUrl}${item.file}`,
                  success(res) {
                    // console.log(wx.env.USER_DATA_PATH)
                    var savePath = `${wx.env.USER_DATA_PATH}/${item.name}.bin`
                    stemManager.saveFile({
                      tempFilePath: res.tempFilePath,
                      filePath: savePath,
                      success(data) {
                        resolve(data)
                      },
                    })
                  },
                })
              })
            })).then(res => {
              //保存成功弹出提示，告知一下用户
              wx.showModal({
                title: '文件下载成功',
                content: '位于tencent/MicroMsg/wxanewfiles下',
                confirmColor: '#0bc183',
                confirmText: '知道了',
                showCancel: false,
                success(res) {
                  if(res.confirm) {
                    wx.navigateBack()
                  }
                }
              })
            }).catch(data => {
              wx.showToast({
                title: '下载错误，请重试',
                icon: 'none'
              })
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })

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
  onReady: function() {

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