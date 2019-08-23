


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
    groupList:[],
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
    let userInfo = app.globalData.userInfo
    // 获取用户信息
    if (Object.keys(userInfo).length == 0) {
      this.getUserInfo()
    } else {
      this.getGroupList()
    }
  },

  
  // groupList(){
  //   var group = [
  //     {"name":"图片"},
  //   ]
  // },
  getUserInfo() {
    // 查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            hasUserInfo: false
          })
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                userInfo: res.userInfo
              })
              if (res.userInfo) {
                // 提交用户信息
                this.setUserInfo(res.userInfo)
              }
            }
          })
        }
      }
    })
  },
  // 提交用户信息
  setUserInfo(userInfo) {
    wx.login({
      success: res => {
        if (res.code) {
          this.code = res.code
          wx.request({
            url: `${app.globalData.requestUrl}/Login/wxLogin`,
            method: 'POST',
            data: {
              code: res.code,
              avatarUrl: userInfo.avatarUrl,
              nickname: userInfo.nickName
            },
            success: data => {
              if (data.data.code == 1) {
                data = app.null2str(data.data.data)
                this.setData({
                  userInfo: data
                })
                app.globalData.userInfo = data
                // 获取分组
                this.getGroupList()
              } else {
                wx.showModal({
                  title: '',
                  content: data.data.errmsg
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
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
        floatingStr: false,
        newGroupNameData: ''
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
  addGroup() {
    wx.request({
      url: `${app.globalData.requestUrl}/FileGroup/addGroup`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        group: this.data.newGroupNameData
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.newGroup()
          // 获取分组
          this.getGroupList()
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  // 获取分组
  getGroupList() {
    wx.request({
      url: `${app.globalData.requestUrl}/FileGroup/queryGroup`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          data = data.data.data
          this.setData({
            groupList: data
          })
          if (data.length > 0) {
            this.getFlieList(data[0].id)
          }
        } else {
          // wx.showModal({
          //   title: '',
          //   content: data.data.msg
          // })
        }
      }
    })
  },
  setGroup(e) {
    this.getFlieList(e.currentTarget.dataset.id)
  },
  // 通过分组ID获取分组下数据包列表
  getFlieList(id) {
    // let id = e.disabled.id
    console.log(id)
    wx.request({
      url: `${app.globalData.requestUrl}/FileGroup/queryData`,
      method: 'POST',
      data: {
        gid: id
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          let i = 0
          data = data.data.data
          for(i in data) {
            data[i]['size'] = data[i].size/1000
            data[i]['size'] = data[i].size.toFixed(2)
            data[i]['str'] = '0'
          }
          this.setData({
            flieList: data
          })
        } else {
          // wx.showModal({
          //   title: '',
          //   content: data.data.msg
          // })
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
 