// FF00FF00FF00FF0000040500000401020304050001000100100001020304050002
// 00030800000102030405000300020430000102030405000400000C2000

// type值对应==>>GET,PUT,ADD  三种类别的请求方式
// 00 (type)[8] OPT_ID_GET_SEQ==>>GET方式，数据获取
// 01 (type)[8] OPT_ID_PUT_SEQ==>>PUT方式，数据修改
// 02 (type)[8] OPT_ID_ADD_DATA==>>ADD方式，数据新增

// 问题1：00 (isCurExist、isCurA、isCurB、isCurAll)[7] 值的下发，文档中给值不明确
// 解决方法：把两位数（00）转译成二进制数，理想状态为4位    位数不足的情况下在前面补上0
// 问题2：01 00 (a组顺序)[8][9]
//       00 10 (b组顺序)[9][10]
//       10 00 (全体组顺)[10][11]
//       三组顺序的生成方式
// 解决方法：排序通过seq数据存在的顺序，a组顺序，b组顺序，全体组顺表示是否存在于a组，b组。全体组都包含
//       （可能存在于a组，也可能存在于b组，可能a组b组都存在）



// 问题3：对序列号属性进行写操作
//   01 (type)[8] OPT_ID_PUT_SEQ
//   对数据进行拼装包含：前导码，type，pad，len，num，n条seq
//   新增：num+=1
//         n条seq增加一条
//   删除：num-=1
//         n条seq删除一条
// 问题4：设置游戏数据接口
//   02 (type)[8] OPT_ID_ADD_DATA
//   对数据进行拼装包含：前导码，type，pad，len，num，n条data


// FF 00 FF 00 FF 00 FF 00 (前导码)[0]-[7]
// 00 (type)[8]
// 04 (pad)[9]
// 05 00 (len)[10][11]
// 00 04 (num)[12][13]
// 01 02 03 04 05 00 01 00 01 00 10 00 (SEQ0)[14]--[25]
// 01 02 03 04 05 00 02 00 03 08 00 00 (SEQ1)[26]--[38]
// 01 02 03 04 05 00 03 00 02 04 30 00 (SEQ2)[39]--[50]
// 01 02 03 04 05 00 04 00 00 0C 20 00 (SEQ3)[51]--[62]


// SEQ0解析：
// 01 02 03 04 05 00 01 00 01 00 10 00 (SEQ0)[14]--[25]
// 01 02 03 04 05 00 01  (id)[0]-[6]
// 00 (isCurExist、isCurA、isCurB、isCurAll)[7]
// 01 00 (a组顺序)[8][9]
// 00 10 (b组顺序)[9][10]
// 10 00 (全体组顺)[10][11]

// a组顺序：
// 01 00 (a组顺序)[8][9]
// [8]==>>01==>>00 00 00 01 (16进制>>2进制)
// [9]==>>00==>>00 00 00 00 (16进制>>2进制)
// a组顺序===>>> 00 00 00 00 01


// b组顺序：
// 10 10 (b组顺序)[9][10]
// [9]==>>00==>>00 00 00 00 (16进制>>2进制)
// [10]==>>10==>>00 01 00 00 (16进制>>2进制)
// b组顺序===>>> 00 00 00 00 00

// 全体组顺序：
// 10 11 (全体组顺序)[10][11]
// [10]==>>10==>>00 01 00 00  (16进制>>2进制)
// [11]==>>00==>>00 00 00 00 (16进制>>2进制)
// 全体组顺序===>>> 00 00 00 00 00 01




// 对序列号属性进行写操作
// FF 00 FF 00 FF 00 FF 00 (前导码)[0]-[7]
// 01 (type)[8] OPT_ID_PUT_SEQ
// 00 (pad)[9]
// 00 00 (len)[10][11]
// 00 04 (num)[12][13]
// 01 02 03 04 05 00 01 00 01 00 10 00 (SEQ0)[14]--[25]
// 01 02 03 04 05 00 02 00 03 08 00 00 (SEQ1)[26]--[38]
// 01 02 03 04 05 00 03 00 02 04 30 00 (SEQ2)[39]--[50]
// 01 02 03 04 05 00 04 00 00 0C 20 00 (SEQ3)[51]--[62]
// that.setData({
//   textLog: log0,
// });
function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  }
}

const app = getApp()
var utils = require("../../utils/util.js");
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
    groupList: [],
    deviceGroupList: [
      { 'id': 'a', 'group': 'A组' },
      { 'id': 'b', 'group': 'B组' },
      { 'id': 'all', 'group': '全部' }
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
    },
    navAction: ['active', 'noActive', 'noActive', 'noActive'],
    deviceId: '',
    name: '',
    serviceId: '',
    deviceData: {},
    originalData: {},
    orderA: [],
    orderB: [],
    orderAll: [],
    readCharacteristicId: '',
    listType: 'a',
    hideGroup: 1001
  },


  onLoad: function () {
    this.setData({
      navAction: app.globalData.navAction
    })
    let userInfo = app.globalData.userInfo
    console.log(userInfo)
    // 获取用户信息
    console.log(userInfo.hasOwnProperty("id"))
    if (!userInfo.hasOwnProperty("id")) {
    // if (Object.keys(userInfo).length == 0) {
      this.getUserInfo()
    } else {
      this.setData({
        hasUserInfo: false
      })
      // 获取全局分组列表
      let groupList = app.globalData.groupList
      if (groupList.length > 0) {
        this.setData({
          groupList: groupList
        })
      } else {
        // 获取分组列表
        this.getGroupList()
      }
    }

  },
  onShow() {
    if (wx.setKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: true,
        success: function (res) {
          //console.log('保持屏幕常亮')
        }
      })
    }
    let a = 'FF00FF00FF00FF000004050000040102030405000100010010000102030405000200030800000102030405000300020430000102030405000400000C2000'
    // let a = 'FF00FF00FF00FF000000000000040102030405000108010010000102030405000202030800000102030405000300020430000102030405000404000c2000'
    let deviceData = app.getDiviceDataAnalysis(a)
    this.setData({
      originalData: deviceData,
      deviceData: deviceData
    })
    this.getGroupingList()
    return false
    // 获取到连接的设备服务信息
    let deviceNode = app.globalData.deviceNode
    console.log(deviceNode)
    if (Object.keys(deviceNode).length > 0) {
      var devid = decodeURIComponent(deviceNode.deviceId);
      var devname = decodeURIComponent(deviceNode.name);
      var devserviceid = decodeURIComponent(deviceNode.serviceId);
      // 设备名==>>devname
      // n设备UUID==>>devid
      // n服务UUID==>>devserviceid
      this.setData({
        deviceId: devid,
        name: devname,
        serviceId: devserviceid
      });
      // //获取特征值
      this.getBLEDeviceCharacteristics();
    } else {
      wx.showModal({
        title: '',
        content: '是否前往设备连接页面？',
        cancelText: '否',
        confirmText: '是',
        success(res) {
          if (res.confirm) {
            // 用户点击了确定属性的按钮，对应选择了'去连接'
            // 跳转
            wx.navigateTo({
              url: `/pages/deviceLink/deviceLink`
            })
          }
          // else if(res.cancel){
          //   // 用户点击了取消属性的按钮，对应选择了'取消'
          // } 
        }
      })
    }
  },
  // 进入设备连接页
  linkDevice() {
    wx.navigateTo({
      url: `/pages/deviceLink/deviceLink`
    })
  },
  // 新建数据
  newDeviceData() {
    let deviceData = this.data.deviceData
    let seqListNode = deviceData.seqListNode
    let num = deviceData.num
    // 如果该数据不存在某一组，则给该组的顺序数据赋值为1001
    let hideGroup = this.data.hideGroup
    let listType = this.data.listType
    let idList = seqListNode.map(seqListNode =>  parseInt(seqListNode.id))
    let groupA = seqListNode.map(seqListNode =>  parseInt(seqListNode.groupA))
    let groupB = seqListNode.map(seqListNode =>  parseInt(seqListNode.groupB))
    let groupAll = seqListNode.map(seqListNode =>  parseInt(seqListNode.groupAll))
    let dataId = Math.max.apply(null, idList) + 1
    // 1001转2进制===>>>代表在A组或者B组中不存在
    // let dataGroupA = parseInt(Math.max.apply(null, groupA), 2) + 1
    // let dataGroupB = parseInt(Math.max.apply(null, groupB), 2) + 1
    let dataGroupA = num
    let dataGroupB = num
    let dataGroupAll = parseInt(Math.max.apply(null, groupAll), 2) + 1
    if (listType == 'a') {
      dataGroupA = num
      dataGroupB = hideGroup
      dataGroupAll = hideGroup
      
    } else if (listType == 'b') {
      dataGroupA = hideGroup
      dataGroupB = num
      dataGroupAll = hideGroup
    } else if (listType == 'all') {
      dataGroupA = hideGroup
      dataGroupB = hideGroup
      dataGroupAll = num
    }
    dataId = dataId.toString().padStart(14, '0')
    dataGroupA = dataGroupA.toString(2).padStart(10, '0')
    dataGroupB = dataGroupB.toString(2).padStart(10, '0')
    dataGroupAll = dataGroupAll.toString(2).padStart(12, '0')
    let newSeq = {
      groupA: dataGroupA,
      groupANum: parseInt(dataGroupA, 2),
      groupAll: dataGroupAll,
      groupAllNum: parseInt(dataGroupAll, 2),
      groupB: dataGroupB,
      groupBNum: parseInt(dataGroupB, 2),
      id: dataId,
      isCur: "0000",
      isCurA: "0",
      isCurAll: "0",
      isCurB: "0",
      isCurExist: "0"
    }
    seqListNode.push(newSeq)
    deviceData['num'] = num + 1
    deviceData['seqListNode'] = seqListNode
    // deviceData['num'] = deviceData.num + 1
    console.log(deviceData)
    this.setData({
      deviceData: deviceData
    })
    // 获取分组数据列表
    this.getGroupingList()
  },
  // 设备数据删除事件
  delDeviceData(e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({ //使用模态框提示用户进行操作
      title: '',
      content: '确认删除当前数据？',
      success: res => {
        if (res.confirm) {
          this.delDeviceDataRun(id)
        }
      }
    })
  },
  // 执行删除操作
  delDeviceDataRun(id) {

    let deviceData = this.data.deviceData
    let seqListNode = deviceData.seqListNode
    let listType = this.data.listType
    if (listType == 'all') {
      for (let i = 0; i < seqListNode.length; i++) {
        if (seqListNode[i].id == id) {
          seqListNode.splice(i, 1);
        }
      }
    } else {
      let hideGroup = this.data.hideGroup
      for (let i = 0; i < seqListNode.length; i++) {
        if (seqListNode[i].id == id) {
          if (listType == 'a') {
            seqListNode[i]['groupA'] = hideGroup.toString(2).padStart(10, '0')
            seqListNode[i]['groupANum'] = parseInt(seqListNode[i].groupA)
          } else {
            seqListNode[i]['groupB'] = hideGroup.toString(2).padStart(10, '0')
            seqListNode[i]['groupBNum'] = parseInt(seqListNode[i].groupB)
          }
        }
      }
    }
    deviceData['seqListNode'] = seqListNode
    console.log(deviceData)
    this.setData({
      deviceData: deviceData
    })
    // 获取分组数据列表
    this.getGroupingList()
  },
  //清空log日志
  startClear: function () {
    var that = this;
    that.setData({
      textLog: ""
    });
  },
  //返回蓝牙是否正处于链接状态
  onBLEConnectionStateChange: function (onFailCallback) {
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
      return res.connected;
    });
  },
  //断开与低功耗蓝牙设备的连接
  closeBLEConnection: function () {
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.deviceId
    })
    that.setData({
      connected: false,

    });
    wx.showToast({
      title: '连接已断开',
      icon: 'success'
    });
    setTimeout(function () {
      wx.navigateBack();
    }, 2000)
  },
  //获取蓝牙设备某个服务中的所有 characteristic（特征值）
  getBLEDeviceCharacteristics() {
    // var that = this;
    console.log('特征值读取-----------------------------------')
    console.log(`deviceId-----${this.data.deviceId}`)
    console.log(`serviceId-----${this.data.serviceId}`)
    wx.getBLEDeviceCharacteristics({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      success: res => {
        console.log(res)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {//该特征值是否支持 read 操作
            // var log = this.data.textLog + "该特征值支持 read 操作:" + item.uuid + "\n";
            this.setData({
              // textLog: log,
              readCharacteristicId: item.uuid
            });
          }
          if (item.properties.write) {//该特征值是否支持 write 操作
            // var log = this.data.textLog + "该特征值支持 write 操作:" + item.uuid + "\n";
            this.setData({
              // textLog: log,
              writeCharacteristicId: item.uuid,
              canWrite: true
            });

          }
          if (item.properties.notify || item.properties.indicate) {//该特征值是否支持 notify或indicate 操作
            // var log = this.data.textLog + "该特征值支持 notify 操作:" + item.uuid + "\n";
            this.setData({
              // textLog: log,
              notifyCharacteristicId: item.uuid,
            });
            this.notifyBLECharacteristicValueChange();
          }

        }

      },
      fail: function (err) {
        console.log(err)
      },
    })
    // that.onBLECharacteristicValueChange();   //监听特征值变化
  },
  //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
  //注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性
  notifyBLECharacteristicValueChange: function () {
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.notifyCharacteristicId,
      success: function (res) {
        var log = that.data.textLog + "notify启动成功" + res.errMsg + "\n";
        console.log('notifyBLECharacteristicValueChange')
        console.log(res)
        that.setData({
          textLog: log,
        });
        that.onBLECharacteristicValueChange();   //监听特征值变化
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: 'notify启动失败',
          mask: true
        });
        setTimeout(function () {
          wx.hideToast();
        }, 2000)
      }
    })
  },
  // 值获取----值获取----值获取----值获取----值获取----值获取----值获取----值获取----
  //监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
  onBLECharacteristicValueChange: function () {
    var that = this;
    wx.readBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.notifyCharacteristicId,
      success(res) {
        console.log(res)
        // console.log(res)
        // var resValue = utils.ab2hext(res.value); //16进制字符串
        // console.log(resValue)
        // let deviceData = app.getDiviceDataAnalysis(resValue)
        // console.log(deviceData)
        // that.setData({
        //   deviceData: deviceData
        // })
        wx.onBLECharacteristicValueChange(function (res) {
          console.log(res)
          var resValue = utils.ab2hext(res.value); //16进制字符串
          if (resValue.indexOf("FF00FF00FF00FF00") != -1) {
            console.log('getData========>>>>>>' + resValue)
            let deviceData = app.getDiviceDataAnalysis(resValue)
            that.setData({
              originalData: deviceData,
              deviceData: deviceData
            })
            this.getGroupingList()
          }

        });
      }
    })

    // wx.onBLECharacteristicValueChange(function (res) {
    //   // console.log(res)
    //   var resValue = utils.ab2hext(res.value); //16进制字符串
    //   console.log(resValue)
    //   let deviceData = app.getDiviceDataAnalysis(resValue)
    //   // console.log(deviceData)
    //   that.setData({
    //     deviceData: deviceData
    //   })
    //   wx.readBLECharacteristicValue({
    //     deviceId: that.data.deviceId,
    //     serviceId: that.data.serviceId,
    //     characteristicId: that.data.notifyCharacteristicId,
    //     success (res) {

    //       // console.log(res)
    //       // var resValue = utils.ab2hext(res.value); //16进制字符串
    //       // console.log(resValue)
    //       // let deviceData = app.getDiviceDataAnalysis(resValue)
    //       // console.log(deviceData)
    //       // that.setData({
    //       //   deviceData: deviceData
    //       // })
    //     }
    //   })
    // });
  },
  //orderInput
  orderInput: function (e) {
    this.setData({
      orderInputStr: e.detail.value
    })
  },

  //发送指令
  // sentOrder:function(){
  //   var that = this; 
  //   var orderStr = that.data.orderInputStr;//指令
  //   console.log(`获取指令==>>${orderStr}`)
  //   let order = utils.stringToBytes(orderStr);
  //   console.log(`指令==>>${orderStr}字符串转byte==>>${order}`)
  //   that.writeBLECharacteristicValue(order);
  // },

  //向低功耗蓝牙设备特征值中写入二进制数据。
  //注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性
  writeBLECharacteristicValue: function (order) {
    order = utils.stringToBytes(order);
    var that = this;
    let byteLength = order.byteLength;
    console.log(`执行指令的字节长度==>>${byteLength}`)
    var log = that.data.textLog + "当前执行指令的字节长度:" + byteLength + "\n";
    that.setData({
      textLog: log,
    });
    // console.log(`${that.data.deviceId}===${that.data.serviceId}===${that.data.writeCharacteristicId}===${order.slice(0, 20)}`)
    // console.log('=========================')
    // console.log(order)
    // console.log(utils.ab2hext(order))
    // return false
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.writeCharacteristicId,
      // 这里的value是ArrayBuffer类型
      // value: order.slice(0, 20),
      value: order,
      success: function (res) {
        wx.hideLoading()
        console.log('============特征值中写入反馈结果============')
        console.log(res)
        // if (byteLength > 20) {
        //   setTimeout(function(){
        //     // that.writeBLECharacteristicValue(order.slice(20, byteLength));
        //   },150);
        // }
        var log = that.data.textLog + "写入成功：" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
        that.onShow()
      },

      fail: function (res) {
        wx.hideLoading()
        console.log('========================')
        console.log(res)
        var log = that.data.textLog + "写入失败" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
      }

    })
  },
  // 更新数据到硬件
  upDeviceData() {
    // FF00FF00FF00FF0000040500000401020304050001000100100001020304050002
    // 00030800000102030405000300020430000102030405000400000C2000
    // let a = 'FF00FF00FF00FF000004050000040102030405000100010010000102030405000200030800000102030405000300020430000102030405000400000C2000'
    // let deviceData = app.getDiviceDataAnalysis(a)

    // 显示loading图标
    wx.showLoading({
      title: '数据写入中',
    })
    let deviceData = this.data.deviceData
    console.log(deviceData)
    let originalData = this.data.originalData
    let type = ""
    if (deviceData.seqListNode > originalData.seqListNode) {
      type = '02'
    } else if (deviceData.seqListNode <= originalData.seqListNode) {
      type = '01'
    }
    let upData = app.setDiviceDataAnalysis(deviceData, type)
    console.clear()
    console.log(`发送数据字符串===>>>${upData}`)
    this.writeBLECharacteristicValue(upData)
  },





  // 原有基本操作-----以上部分为蓝牙相关
  // 获取用户信息
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
                console.log('=============')
                console.log(data)
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
  //选择用途后加样式
  select_use: function (e) {
    this.setData({
      state: e.currentTarget.dataset.key,
    });
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
          app.globalData.groupList = data
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
    this.setData({
      listType: e.currentTarget.dataset.id
    })
    let listType = this.data.listType
    if (listType == 'a' || listType == 'b' || listType == 'all') {
      // 获取分组数据列表
      this.getGroupingList()
    } else {
      // 从服务器获取数据
      this.getFlieList(listType)
    }
  },
  // 获取分组数据列表
  getGroupingList(deviceData) {
    if (!deviceData) {
      deviceData = this.data.deviceData
    }
    if (this.data.listType == 'a') {
      // 通过json中的groupANum大小来排序reverse为倒叙操作
      if (deviceData.seqListNode.length > 0) {
        deviceData['listA'] = deviceData.seqListNode.sort(compare("groupANum")).reverse();
      }
      let orderA = []
      let i = 0
      for (i in deviceData.listA) {
        orderA.push(deviceData.listA[i].groupA)
      }
      this.setData({
        orderA: orderA,
        deviceData: deviceData
      })
    } else if (this.data.listType == 'b') {
      if (deviceData.seqListNode.length > 0) {
        deviceData['listB'] = deviceData.seqListNode.sort(compare("groupBNum")).reverse();
      }
      let orderB = []
      let i = 0
      for (i in deviceData.listB) {
        orderB.push(deviceData.listB[i].groupB)
      }
      this.setData({
        orderB: orderB,
        deviceData: deviceData
      })
    } else if (this.data.listType == 'all') {
      if (deviceData.seqListNode.length > 0) {
        deviceData['listAll'] = deviceData.seqListNode.sort(compare("groupAllNum")).reverse();
      }
      let orderAll = []
      let i = 0
      for (i in deviceData.listAll) {
        orderAll.push(deviceData.listAll[i].groupAll)
      }
      this.setData({
        orderAll: orderAll,
        deviceData: deviceData
      })
    }
    // 排序部分生成
    this.setGroupNum()
  },
  // 通过分组ID获取分组下数据包列表
  getFlieList(id) {
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
          for (i in data) {
            data[i]['size'] = data[i].size / 1000
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
    // console.log(startIndex)
    // console.log('获取到的元素为', this.data.deviceData.seqListNode[startIndex])
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
    let thisShowList = []
    if (this.data.listType == 'a') {
      thisShowList = this.data.deviceData.listA
    } else if (this.data.listType == 'b') {
      thisShowList = this.data.deviceData.listB
    } else if (this.data.listType == 'all') {
      thisShowList = this.data.deviceData.listAll
    }
    movableViewInfo.data = thisShowList[startIndex]
    movableViewInfo.showClass = "inline"

    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  },

  dragMove: function (event) {
    var seqListNode = this.data.deviceData.seqListNode
    var pageInfo = this.data.pageInfo
    // 计算拖拽距离
    var movableViewInfo = this.data.movableViewInfo
    var movedDistance = event.touches[0].clientY - pageInfo.startY
    movableViewInfo.y = pageInfo.startY - (pageInfo.rowHeight / 2) + movedDistance
    // console.log('移动的距离为', movedDistance)

    // 修改预计放置位置
    var movedIndex = parseInt(movedDistance / pageInfo.rowHeight)
    var readyPlaceIndex = pageInfo.startIndex + movedIndex
    if (readyPlaceIndex < 0) {
      readyPlaceIndex = 0
    }
    else if (readyPlaceIndex >= seqListNode.length) {
      readyPlaceIndex = seqListNode.length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = seqListNode[pageInfo.selectedIndex]

      seqListNode.splice(pageInfo.selectedIndex, 1)
      seqListNode.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', flieList[readyPlaceIndex])
    let deviceData = this.data.deviceData
    deviceData['seqListNode'] = seqListNode
    this.setData({
      movableViewInfo: movableViewInfo,
      deviceData: deviceData,
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
    // 排序部分生成
    this.setGroupNum()
  },
  // 排序部分生成
  setGroupNum() {
    if (this.data.listType == 'a') {
      let listA = this.data.deviceData.listA
      let orderA = this.data.orderA
      let deviceData = this.data.deviceData
      let i = 0
      for (i in listA) {
        listA[i]['groupA'] = orderA[i]
        listA[i]['groupANum'] = parseInt(orderA[i], 2)
      }
      deviceData['listA'] = listA
      this.setData({
        deviceData: deviceData
      })
    } else if (this.data.listType == 'b') {
      let listB = this.data.deviceData.listB
      let orderB = this.data.orderB
      let deviceData = this.data.deviceData
      let i = 0
      for (i in listB) {
        listB[i]['groupB'] = orderB[i]
        listB[i]['groupBNum'] = parseInt(orderB[i], 2)
      }
      deviceData['listB'] = listB
      this.setData({
        deviceData: deviceData
      })
    } else if (this.data.listType == 'all') {
      let listAll = this.data.deviceData.listAll
      let orderAll = this.data.orderAll
      let deviceData = this.data.deviceData
      let i = 0
      for (i in listAll) {
        listAll[i]['groupAll'] = orderAll[i]
        listAll[i]['groupAllNum'] = parseInt(orderAll[i], 2)
      }
      deviceData['listAll'] = listAll
      this.setData({
        deviceData: deviceData
      })
    }
    this.matchGroup()
  },
  // 把拖拽后的数据写入seqListNode中
  matchGroup() {
    let deviceData = this.data.deviceData
    let seqListNode = deviceData.seqListNode
    let listA = deviceData.listA
    let listB = deviceData.listB
    let listAll = deviceData.listAll
    let i = 0
    for (i in seqListNode) {
      let a = 0, b = 0, all = 0
      for (a in listA) {
        if (seqListNode[i].id == listA[a].id) {
          seqListNode[i]['groupA'] = listA[a].groupA
          seqListNode[i]['groupANum'] = listA[a].groupANum
        }
      }
      for (b in listB) {
        if (seqListNode[i].id == listB[b].id) {
          seqListNode[i]['groupB'] = listB[b].groupB
          seqListNode[i]['groupBNum'] = listB[b].groupBNum
        }
      }
      for (all in listAll) {
        if (seqListNode[i].id == listAll[all].id) {
          seqListNode[i]['groupAll'] = listAll[all].groupAll
          seqListNode[i]['groupAllNum'] = listAll[all].groupAllNum
        }
      }
    }
    deviceData['seqListNode'] = seqListNode
    this.setData({
      deviceData: deviceData
    })
  },
  // 进入设备页
  goDevicePage() {
    app.globalData.navAction = ['active', 'noActive', 'noActive', 'noActive']
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  // 进入论坛页
  goForumPage() {
    app.globalData.navAction = ['noActive', 'active', 'noActive', 'noActive']
    wx.redirectTo({
      url: '/pages/forum/forum'
    })
  },
  // 进入官网页
  goHomePage() {
    app.globalData.navAction = ['noActive', 'noActive', 'active', 'noActive']
    wx.redirectTo({
      url: '/pages/homePage/homePage'
    })
  },
  // 进入用户页
  goUserPage() {
    app.globalData.navAction = ['noActive', 'noActive', 'noActive', 'active']
    wx.redirectTo({
      url: '/pages/user/user'
    })
  }
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

