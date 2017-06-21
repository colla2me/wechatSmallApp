// more_movie.js
var app = getApp()
var util = require("../../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    navigationTitle: '',
    startCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.navigationTitle = options.category
    var dataUrl = app.globalData.baseUrl
    switch (options.category) {
      case '正在热映':
        dataUrl += 'movie/in_theaters'
        break
      case '即将上映':
        dataUrl += 'movie/coming_soon'
        break
      case '豆瓣Top250':
        dataUrl += 'movie/top250'
        break
    }

    dataUrl += "?apikey=0b2bdeda43b5688921839c8ecb20399b"

    this.data.reqUrl = dataUrl
 
    util.request(dataUrl, this.handleData)
  },

  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle
    })
  },
  
  onReachBottom: function () {
    var nextUrl = this.data.reqUrl + '&start=' + this.data.startCount + '&count=20'
    console.log('touch bottom', nextUrl)

    util.request(nextUrl, this.handleData)
  },

  onPullDownRefresh: function () {
    var dataUrl = this.data.reqUrl + '&start=0&count=20'
    this.data.movies = []
    util.request(dataUrl, this.handleData)
  },

  handleData: function (data) {
    var movies = []
    for (var i = 0, l = data.subjects.length; i < l; i++) {
      var subject = data.subjects[i]
      var average = subject.rating.average
      var stars = util.convertToStar(average)

      var movie = {
        title: subject.title,
        average: average,
        stars: stars,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(movie)
    }

    var allMovies = this.data.movies
    if (allMovies && allMovies.length) {
      allMovies = allMovies.concat(movies)
    } else {
      allMovies = movies
    }

    this.setData({
      movies: allMovies
    })

    this.data.startCount += movies.length
  }
})