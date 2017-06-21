// movie_detail.js
var app = getApp()
import { Movie } from 'class/Movie.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    var url = app.globalData.baseUrl + 'movie/subject/' + options.id
    var movie = new Movie(url)
    movie.getMovieData(function (data) {
      self.setData({
        movie: data
      })
      console.log('data', data)
    })
  },

  viewMoviePostImg: function (event) {
    var src = event.currentTarget.dataset.src
    wx.previewImage({
      urls: [src],
      current: src
    })
  },

  viewCastingAvatar: function (event) {
    var src = event.currentTarget.dataset.src
    var urls = this.data.movie.castsInfo.map(function (cast) {
      return cast.avatar
    })
    wx.previewImage({
      urls: urls,
      current: src
    })
  }
})