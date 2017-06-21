// posts.js
var post_data = require('../../post_data/post_data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  // onShow: function(options) {
  //   if (this.data.selectPostId === null) return
  //   var reading = wx.getStorageSync("readCount")
  //   var count = reading[this.data.selectPostId] || this.data.postList[this.data.selectPostId].reading
    
  //   this.data.postList[this.data.selectPostId].reading = count
  //   this.setData({
  //     postList: post_data.postList
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postList: post_data.postList
    })
  },

  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postId
    wx.navigateTo({
      url: 'post-detail/detail?id=' + postId,
    })
  },

  onSwiperTap: function (event) {
    console.log('swiper-item', event.target.dataset)
  }

})