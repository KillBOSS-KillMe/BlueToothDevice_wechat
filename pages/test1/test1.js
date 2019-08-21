Page({

  /**
   * 页面的初始数据
   */
  data: {
    optionList: [],

    movableViewInfo: {
      y: 0,
      showClass: 'none',
      data: {}
    },

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

  dragStart: function (event) {
    var startIndex = event.target.dataset.index
    console.log('获取到的元素为', this.data.optionList[startIndex])
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
    movableViewInfo.data = this.data.optionList[startIndex]
    movableViewInfo.showClass = "inline"

    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  },

  dragMove: function (event) {
    var optionList = this.data.optionList
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
    else if (readyPlaceIndex >= optionList.length) {
      readyPlaceIndex = optionList.length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = optionList[pageInfo.selectedIndex]

      optionList.splice(pageInfo.selectedIndex, 1)
      optionList.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', optionList[readyPlaceIndex])

    this.setData({
      movableViewInfo: movableViewInfo,
      optionList: optionList,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var optionList = [
      "段落1 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      "段落2 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      "段落3 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      "段落4 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      "段落5 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      "段落6 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      "段落7 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      "段落8 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      "段落9 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
    ]

    this.setData({
      optionList: optionList
    })
  },


})