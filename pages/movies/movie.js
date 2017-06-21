// movie.js
var app = getApp()
var util = require("../../utils/util.js")
var api = app.globalData.baseUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    search: {},
    inputValue: '',
    searchListShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var filter = "?start=0&count=5&apikey=0b2bdeda43b5688921839c8ecb20399b"
    var inTheaterUrl = api + "movie/in_theaters" + filter
    var comingSoonUrl = api + "movie/coming_soon" + filter
    var top250Url = api + "movie/top250" + filter

    this.getDoubanData(inTheaterUrl, 'inTheaters', '正在热映')
    this.getDoubanData(comingSoonUrl, 'comingSoon', '即将上映')
    this.getDoubanData(top250Url, 'top250', '豆瓣Top250')
  },

  onInputFocus: function (event) {
    this.setData({
      searchListShow: true
    })
  },

  onInputChange: function (event) {
    var value = event.detail.value
    if (!value || value.trim() === '') {
      console.log('输入不合法')
      return
    }
    this.setData({
      inputValue: value
    })
    var searchUrl = api + "movie/search?&apikey=0b2bdeda43b5688921839c8ecb20399b&q=" + value
    this.getDoubanData(searchUrl, 'search', '')
  },

  onCancelSearch: function (event) {
    this.setData({
      search: {},
      inputValue: '',
      searchListShow: false
    })
  },

  onMovieTap: function (event) {
    wx.navigateTo({
      url: 'movie_detail/movie_detail?id=' + event.currentTarget.dataset.id
    })
  },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more_movie/more_movie?category=' + category
    })
  },

  getDoubanData: function (url, key, title) {
    var self = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        console.log('res', res)
        self.handleData(res.data, key, title)
      }
    })
  },

  handleData: function (data, key, title) {
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
    var obj = this.data
    obj[key].title = title
    obj[key].movies = movies
    this.setData(obj)
  }
})