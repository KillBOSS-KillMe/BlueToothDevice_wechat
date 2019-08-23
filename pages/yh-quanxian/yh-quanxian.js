// pages/quanxian/quanxian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    item: {
      title: '双马尾成为了最佳减龄利器？',
      label: '时尚',
      content: '除了小朋友，为什么日常生活中很少有人扎双马尾？ 很村？装嫩？有病？ 请快抛开你对它的偏见吧！低位双马尾高位双马尾编发双马尾...',
      avatarUrl: '/image/luntan1.jpg',
      nickname: '你的我的',
      createTime: '2019-12-21 12:00',
      see: 200,
      comment: 100,
      follow: 10,
      file: [
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        },
        {
          file: '/image/luntan1.jpg'
        }
      ]

    },
    flag: false,//控制弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    var that = this;
    wx.request({
      url: `${app.globalData.requestUrl}/Forum/forum`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        post_id: id
      },
      method: "POST",
      success: res => {
        console.log(res);
        res = app.null2str(res.data)
        if (res.code == '1') {
          this.setData({
            luntanTxt: res.data,
          })
        } else {
          // wx.showModal({
          //   title: '',
          //   content: res.msg,
          //   showCancel: false
          // })
        }

      }
    })
  },
  // 长按删除评论
  deleComment(){
    this.setData({
      flag: true
    })
  },
  hideDeleBlock() {
    this.setData({
      flag: false
    })
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

  },
  // 删除
  adminDelete:function(){
    var that = this;
    wx.request({
      url: '${this.$parent.globalData.requestUrl}/del_post',
      headers:{
        'Content-Type':'application/json'
      },
      data:{
        post_id:that.data.id
      },
      method:"POST",
      success: res =>{
        wx.navigateBack({
          delta: 1,
        })
        this.userForhidden()
      }
    })
  },
  // 置顶
  adminTop:function(){
    var that = this;
    wx.request({
      url: '${this.$parent.globalData.requestUrl}/Forum/top',
      headers:{
        'Content-Type':'application/json'
      },
      data:{
        post_id:that.data.id
      },
      method:"POST",
      success: res =>{
        if(res.code == "1"){
          that.setData({
            adminTops:res.data
          })
        }else{
          wx.showToast({
            title: '置顶成功',
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data);
        // this.userForhidden()
      }
    })
  },
  // 加精
  adminJiajing: function () {
    var that = this;
    wx.request({
      url: '${this.$parent.globalData.requestUrl}/Forum/essence',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        post_id: that.data.id
      },
      method: "POST",
      success: res => {
        if (res.code == "1") {
          that.setData({
            adminJiajings: res.data
          })
        } else {
          wx.showToast({
            title: '加精成功',
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data);
        // this.userForhidden()
      }
    })
  },
})