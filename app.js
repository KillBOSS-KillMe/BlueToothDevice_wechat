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
    this.globalData.sysinfo = wx.getSystemInfoSync();
  },
  globalData: {
    userInfo: {},
    sysinfo: null,
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
  },
  
  getModel: function() { //获取手机型号
    return this.globalData.sysinfo["model"]
  },
  getWxVersion: function() { //获取微信版本号
    return this.globalData.sysinfo["version"]
  },
  getSystem: function() { //获取操作系统版本
    return this.globalData.sysinfo["system"]
  },
  getPlatform: function() { //获取客户端平台
    return this.globalData.sysinfo["platform"]
  },
  getSDKVersion: function() { //获取客户端基础库版本
    return this.globalData.sysinfo["SDKVersion"]
  },

  //toast提示
  toastTips: function(txt) {
    wx.showToast({
      title: txt
    })
  },
  //toast提示，可以设置等待时长
  toastTips1: function(txt, time) {
    wx.showToast({
      title: txt,
      duration: time
    })
  },
  toastTips2: function(txt) {
    wx.showToast({
      title: txt,
      icon: "loading"
    })
  },

  //弹窗提示
  showModal: function(txt) {
    wx.showModal({
      title: '提示',
      content: txt,
      showCancel: false,
    })
  },
  //弹窗提示,有确认按钮
  showModal1: function(txt) {
    wx.showModal({
      title: "提示",
      content: txt,
      showCancel: false,
      confirmText: "确定"
    })
  },
  //loading
  showLoading: function(txt) {
    wx.showLoading({
      title: txt,
      mask: true
    });
  },

  isBlank: function(str) {
    if (Object.prototype.toString.call(str) === '[object Undefined]') { //空
      return true
    } else if (
      Object.prototype.toString.call(str) === '[object String]' ||
      Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
      return str.length == 0 ? true : false
    } else if (Object.prototype.toString.call(str) === '[object Object]') {
      return JSON.stringify(str) == '{}' ? true : false
    } else {
      return true
    }

  },
  // 解析从设备获取的值
  getDiviceDataAnalysis(codeValue) {
    // frontCode ==>> 前导码
    // typeCod ==>> 请求类型(GET_SEQ=>0, PUT_SEQ=>1, ADD_DATA=>2)
    // pad ==>> pad
    // len ==>> len
    // num ==>> seq数量/data数量
    // seqList ==>> seq列表--数组
    // seqAllStr ==>> 所有的seq--字符串
    // seqListNode ==>> seq列表对象--JSON数组
    // seqListNode.id ==>> seq--id
    // seqListNode.isCur ==>> seq--isCur(isExist, isCurA, isCurB, isCurAll)
    // seqListNode.groupA ==>> seq--在A组的顺序
    // seqListNode.groupB ==>> seq--在B组的顺序
    // seqListNode.groupAll ==>> seq--在所有列表中的数据
    let dataNode = new Object()
    let seqList = new Array()
    let frontCode = ''
    let typeCode = parseInt(codeValue[16] + codeValue[17])
    let pad = codeValue[18] + codeValue[19]
    let len = codeValue[20] + codeValue[21] + codeValue[22] + codeValue[23]
    let num = parseInt(codeValue[24] + codeValue[25] + codeValue[26] + codeValue[27])
    let seqAllStr = codeValue.substring(28,codeValue.length);
    // 获取前导码
    for (let i = 0;i < 16; i++) {
      frontCode += codeValue[i]
    }
    // 通过所有的seq字符串获取seq列表数组
    for (let i = 0;i < num; i++) {
      seqList[i] = seqAllStr.substring(i * 24, i * 24 + 24);
    }
    // 数据填充
    dataNode = {
      frontCode: frontCode,
      typeCode: typeCode,
      pad: pad,
      len: len,
      num: num,
      seqList: seqList,
      seqAllStr: seqAllStr,
      seqListNode: []
    }
    // SEQ解析
    for (let i = 0; i < seqList.length; i++) {
      let id = ''
      // 数据提取
      let isCur = seqList[i][14] + seqList[i][15]
      let groupA8 = seqList[i][16] + seqList[i][17]
      let groupA9 = seqList[i][18] + seqList[i][19]
      let groupB9 = seqList[i][18] + seqList[i][19]
      let groupB10 = seqList[i][20] + seqList[i][21]
      let groupAll10 = seqList[i][20] + seqList[i][21]
      let groupAll11 = seqList[i][22] + seqList[i][23]
      // 16进制==>>2进制==>>数据补全
      isCur = parseInt(isCur, 16).toString(2).padStart(4, '0')
      groupA8 = parseInt(groupA8, 16).toString(2).padStart(8, '0')
      groupA9 = parseInt(groupA9, 16).toString(2).padStart(8, '0')
      groupB9 = parseInt(groupB9, 16).toString(2).padStart(8, '0')
      groupB10 = parseInt(groupB10, 16).toString(2).padStart(8, '0')
      groupAll10 = parseInt(groupAll10, 16).toString(2).padStart(8, '0')
      groupAll11 = parseInt(groupAll11, 16).toString(2).padStart(8, '0')
      // 生成ID数据
      for (let idlength = 0; idlength < 14; idlength++) {
        id += seqList[i][idlength]
      }
      // 获取A组顺序
      let groupA = groupA9.substring(6,groupA9.length) + groupA8;
      // 获取B组顺序
      let groupB = groupB10.substring(4,groupB10.length) + groupA9.substring(0, 6)
      // 获取本条seq在所有seq中的顺序
      let groupAll = groupAll11 + groupAll10.substring(0, 4)
      dataNode.seqListNode[i] = {
        id: id,
        isCur: isCur,
        isCurExist: isCur[0],
        isCurA: isCur[1],
        isCurB: isCur[2],
        isCurAll: isCur[3],
        groupA: groupA,
        groupB: groupB,
        groupAll: groupAll
      }
    }
    return dataNode
  },
  // 反编译deviceDataNode数据,获取可下发设备的数据
  setDiviceDataAnalysis(deviceDataNode) {
    console.log(deviceDataNode)
    // 初始化==>>默认值为前置码
    let codeValue = deviceDataNode.frontCode
    // 文档要求:下发数据时type为01,len为00,pad为00
    // 现在使用数据deviceDataNode中的原有值,查看反编译是否成功
    let len = deviceDataNode.len
    let pad = deviceDataNode.pad
    // let len = '00'
    // let pad = '00'
    let type = '00'
    // type为类型
    // 00 (type)[8] OPT_ID_GET_SEQ==>>GET方式，数据获取
    // 01 (type)[8] OPT_ID_PUT_SEQ==>>PUT方式，数据修改
    // 02 (type)[8] OPT_ID_ADD_DATA==>>ADD方式，数据新增
    // 将len，pad，type加入到结果字符串中
    codeValue += type
    codeValue += pad
    codeValue += len
    let num = deviceDataNode.num + ''
    // num ==>> seq数量, 使用padStart补全为4位的字符
    codeValue += num.padStart(4, '0')
    let seqListNode = deviceDataNode.seqListNode
    let seqListStr = ''
    
    // for (let i = 0; i < seqListNode.length; i++) {
    let i = 0
    for (i in seqListNode) {
      // 从deviceDataNode.seqListNode中拿到seq数据列表,反编译成16进制的字符串
      seqListStr += seqListNode[i].id
      let seqStr = parseInt(seqListNode[i].isCur, 2).toString(16).padStart(2, '0')
      seqListStr += seqStr
      // 通过文档规则对数据进行拆分
      let group8 = seqListNode[i].groupA.substring(2, seqListNode[i].groupA.length)
      let group9 = seqListNode[i].groupB.substring(4, seqListNode[i].groupB.length) + seqListNode[i].groupA.substring(0, 2)
      let group10 = seqListNode[i].groupAll.substring(8, seqListNode[i].groupAll.length) + seqListNode[i].groupB.substring(0, 4)
      let group11 = seqListNode[i].groupAll.substring(0, 8)
      // 2进制转16进制,用0补全两位
      group8 = parseInt(group8, 2).toString(16).padStart(2, '0')
      group9 = parseInt(group9, 2).toString(16).padStart(2, '0')
      group10 = parseInt(group10, 2).toString(16).padStart(2, '0')
      group11 = parseInt(group11, 2).toString(16).padStart(2, '0')
      seqListStr += group8
      seqListStr += group9
      seqListStr += group10
      seqListStr += group11
    }
    codeValue += seqListStr
    return codeValue
  }
})
