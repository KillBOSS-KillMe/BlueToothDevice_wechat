


//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    topNav: false,
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showDialog: false,
    testShowStr: false,
    flieList: [],
    hidden: true,
    flag: false,
    x: 0,
    y: 0,
    disabled: true,
    canScroll: true,
    // hei: 500,
    elements: [],
    showModalStatus: false,
    floatingStr: false,
    newGroupNameData: '',
    groupList:[
      {
        groupImg:"/image/xitongzu.png",
        groupName:"A组"
      }, {
        groupImg: "/image/xitongzu.png",
        groupName: "B组"
      }, {
        groupImg: "/image/xitongzu.png",
        groupName: "全部"
      }, {
        groupImg: "/image/zu.png",
        groupName: "视频"
      }, {
        groupImg: "/image/zu.png",
        groupName: "音频"
      },
    ],
    state: '',
    pageInfo: {
      rowHeight: 47,
      scrollHeight: 85,

      startIndex: null,
      scrollY: true,
      readyPlaceIndex: null,
      startY: 0,
      selectedIndex: null,
    }
  },
  //选择用途后加样式
  select_use: function (e) {
    console.log(1111111)
    this.setData({
      state: e.currentTarget.dataset.key,
    });
  },

  onLoad: function () {
    var that = this;
    // if (app.globalData.userInfo != null) {
    //   that.setUserInfo(app.globalData.userInfo);
    // // } else if (that.data.canIUse) {
    // //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // //   // 所以此处加入 callback 以防止这种情况
    // //   app.userInfoReadyCallback = res => {
    // //     that.setUserInfo(res.userInfo);
    // //   }
    // } else {
      // console.log(1111111)
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称 
            that.getUserInfo()
          }
        }
      })
      
    // }
    this.getFlieList()
  },
  setUserInfo(userInfo) {
    console.log(userInfo)
  },
  getFlieList() {
    var listData = [
      { "name": "小程序.bat", "max": "2.0M", "time": "2019-06-11 12:00", "type": "1", "id": "1", "str": '0' },
      { "name": "大程序，bat", "max": "2.0M", "time": "2019-06-11 12:00", "type": "1", "id": "1", "str": '0' },
      { "name": "小程序小程序", "max": "2.0M", "time": "2019-06-11 12:00", "type": "1", "id": "1", "str": '0' },
      { "name": "小程序小程序小程序", "max": "2.0M", "time": "2019-06-11 12:00", "type": "1", "id": "1", "str": '0' },
      { "name": "小程序小程序", "max": "2.0M", "time": "2019-06-11 12:00", "type": "1", "id": "1", "str": '0' }
    ]
    this.setData({
      flieList: listData
    }) 
  },
  // groupList(){
  //   var group = [
  //     {"name":"图片"},
  //   ]
  // },


  getUserInfo: function () {
    // wx.getUserInfo({
      
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: '${this.$parent.globalData.requestUrl}/Login/wxLogin',
              data: {
                code: res.code
              }
            })

            console.log(res.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })


        // success: res => {
        //   app.globalData.userInfo = res.userInfo
        //   this.setData({
        //     userInfo: res.userInfo,
        //     hasUserInfo: false
        //   })
        // }
    // })
  },

  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });

  },
  // 2.点击出现上下两个框
  clickTest(e) {
    let index = e.currentTarget.dataset.index
    let flieList = this.data.flieList
    console.log(index)
    console.log(flieList)
    if (flieList[index].str == '0') {
      // 由未选中=》选中
      flieList[index]["str"] = "1"
    } else {
      // 由选中=》未选中
      flieList[index]["str"] = "0"
      
    }
    this.setData({
      flieList: flieList
    })
  },


  // 底部导航
  chooseImg: function (e) {
    this.setData({
      curIdx: e.currentTarget.dataset.current
    })
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
  submitData() {
    console.log(this.data.newGroupNameData)
    return ''
    wx.request({
      url: `${this.$parent.globalData.requestUrl}/login`,
      method: 'POST',
      data: {
        newGroupNameData: this.data.newGroupNameData
      },
      success: data => {
        if (data.data.code == 1) {

        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },

  dragStart(event) {
    // event.currentTarget.dataset.index
    var startIndex = event.currentTarget.dataset.index
    console.log(startIndex)
    console.log('获取到的元素为', this.data.flieList[startIndex])
    // 初始化页面数据
    var pageInfo = this.data.pageInfo
    pageInfo.startY = event.touches[0].clientY
    pageInfo.readyPlaceIndex = startIndex
    pageInfo.selectedIndex = startIndex
    pageInfo.scrollY = false
    pageInfo.startIndex = startIndex

    this.setData({
      'movableViewInfo.y': pageInfo.startY - (pageInfo.rowHeight / 2)
    })
    // 初始化拖动控件数据
    var movableViewInfo = this.data.movableViewInfo
    movableViewInfo.data = this.data.flieList[startIndex]
    movableViewInfo.showClass = "inline"

    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  },

  dragMove: function (event) {
    var flieList = this.data.flieList
    var pageInfo = this.data.pageInfo
    // 计算拖拽距离
    var movableViewInfo = this.data.movableViewInfo
    var movedDistance = event.touches[0].clientY - pageInfo.startY
    movableViewInfo.y = pageInfo.startY - (pageInfo.rowHeight / 2) + movedDistance
    console.log('移动的距离为', movedDistance)

    // 修改预计放置位置
    var movedIndex = parseInt(movedDistance / pageInfo.rowHeight)
    var readyPlaceIndex = pageInfo.startIndex + movedIndex
    if (readyPlaceIndex < 0) {
      readyPlaceIndex = 0
    }
    else if (readyPlaceIndex >= flieList.length) {
      readyPlaceIndex = flieList.length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = flieList[pageInfo.selectedIndex]

      flieList.splice(pageInfo.selectedIndex, 1)
      flieList.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', flieList[readyPlaceIndex])

    this.setData({
      movableViewInfo: movableViewInfo,
      flieList: flieList,
      pageInfo: pageInfo
    })
  },

  dragEnd: function (event) {
    // 重置页面数据
    var pageInfo = this.data.pageInfo
    pageInfo.readyPlaceIndex = null
    pageInfo.startY = null
    pageInfo.selectedIndex = null
    pageInfo.startIndex = null
    pageInfo.scrollY = true
    // 隐藏movableView
    var movableViewInfo = this.data.movableViewInfo
    movableViewInfo.showClass = 'none'

    this.setData({
      pageInfo: pageInfo,
      movableViewInfo: movableViewInfo
    })
  },




})
// wx.showModal({
//   title: '提是否打开蓝牙？',
//   content: '永久关闭',
//   success(res) {
//     if (res.confirm) {
//       console.log('否')
//     } else if (res.cancel) {
//       console.log('是')
//     }
//   }
// })
  // showtip: function(){
  //   wx.showModel({
  //     title: "是否打开蓝牙？",
  //     content: "永久关闭",
  //     confirmText: "是",
  //     cancelText: "否",
  //   })
  // },
 