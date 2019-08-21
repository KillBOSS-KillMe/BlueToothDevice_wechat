// pages/shangchuan/shangchuan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  favorclick: function (e) {
         var likeFlag = false; //标志，避免多次发请求
         //避免多次点击
         if (likeFlag === true) {
             return false;
      
    }
         var that = this;
         if (e.currentTarget.dataset.userid == that.data.user_id) {
            //  that.Pop_show('/image/shebei1.png', '不能给自己评论点赞');
             return
      
    }
         var comment_id = e.currentTarget.dataset.id; //点击当前项的id
         var index = e.currentTarget.dataset.dex;
        var islike = e.currentTarget.dataset.islike;
         var message = this.data.talks;
         var timestamp = Date.parse(new Date());
         timestamp = timestamp / 1000;
         var zanInfo = {
             token: App.globalData.portConfig.token,
             timestamp: timestamp,
            comment_id: comment_id,
             cancel: islike,
           }
         var zanData = zanInfo;
         var postzanData = that.makePostData(zanData, that.data.key);
         wx.request({
             url: App.globalData.portConfig.HTTP_BASE_URL + '/comment/addLike', //点赞接口
             data: postzanData,
             method: 'POST',
            header: {
                 'content-type': 'application/x-www-form-urlencoded'

      },
             success: function (res) {
                 for (let i in message) {
                    if (i == index) {
                         if (message[i].is_like == 0) {
                             that.data.talks[index].is_like = 1
                             message[i].like_num = parseInt(message[i].like_num) + 1
              
            } else {
                             that.data.talks[index].is_like = 0
                             message[i].like_num = parseInt(message[i].like_num) - 1
              
            }
            
          }
          
        }
                that.setData({
                     talks: message

        })
                console.log("点赞成功", res);
        
        
      },
             complete: function (res) {
                 likeFlag = false;
        
      }
     })
   },

})