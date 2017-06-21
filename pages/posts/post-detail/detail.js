// detail.js
var post_data = require('../../../post_data/post_data.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false,
    isCollected: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id
    this.data.postId = postId
    var postData = post_data.postList[postId]
    this.setData({
      detail: postData
    })

    // this.syncReadingCount(postData)
    this.getCollectedStatus(postId)
    this.checkCurrentPlaying()
    this.onBackgroundMusic()
  },

  /**
   * 背景音樂播放按鈕
   */
  onAudioTap: function () {
    var isPlayingMusic = this.data.isPlayingMusic
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      app.globalData.g_playingMusicPostId = null
    } else {
      var music = this.data.detail.music
      app.globalData.g_playingMusicPostId = this.data.postId
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      })
    }

    isPlayingMusic = !isPlayingMusic
    app.globalData.g_isPlayingMusic = isPlayingMusic
    this.setData({
      isPlayingMusic: isPlayingMusic
    })
  },

  onCollectTap: function () {
    this.syncCollectedStatus()
  },

  onShareTap: function () {
    this.showActionSheet()
  },

  getCollectedStatus: function (postId) {
    var collection = wx.getStorageSync("collection")
    if (collection) {
      this.setData({
        isCollected: collection[postId]
      })
    } else {
      collection = {}
      collection[postId] = false
      wx.setStorageSync("collection", collection)
    }
  },

  syncReadingCount: function (detail) {
    var postId = detail.postId
    var reading = wx.getStorageSync("readCount") || {}
    var readCount = reading[postId] || detail.reading
    readCount = Number(readCount) + 1
    reading[postId] = readCount
    wx.setStorageSync("readCount", reading)
    console.log('readingCount', wx.getStorageSync("readCount"))
  },

  showToast(isCollected) {
    wx.showToast({
      title: isCollected ? "收藏成功" : "取消成功",
      icon: "success",
      duration: 1000
    })
  },

  showModal(isCollected, collection) {
    var self = this
    wx.showModal({
      title: '收藏',
      content: isCollected ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("collection", collection)
          self.setData({
            isCollected: isCollected
          })
        }
      }
    })
  },

  showActionSheet() {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      }
    })
  },

  /**
   * 更新本地收藏狀態
   */
  syncCollectedStatus: function () {
    var postId = this.data.postId
    var collection = wx.getStorageSync("collection")
    var isCollected = collection[postId]
    isCollected = !isCollected
    collection[postId] = isCollected
    this.showModal(isCollected, collection)
    // this.showToast(isCollected)
  },

  /**
   * 判斷當前背景音樂是否正在播放
   */
  checkCurrentPlaying() {
    if (app.globalData.g_isPlayingMusic && app.globalData.g_playingMusicPostId === this.data.postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
  },

  /**
   * 監聽背景音樂的播放/暫停/停止
   * 更新播放的狀態
   */
  onBackgroundMusic: function () {
    var self = this
    wx.onBackgroundAudioPlay(function () {
      app.globalData.g_isPlayingMusic = true
      self.setData({
        isPlayingMusic: true
      })
    })
    wx.onBackgroundAudioPause(function () {
      app.globalData.g_isPlayingMusic = false
      self.setData({
        isPlayingMusic: false
      })
    })
    wx.onBackgroundAudioStop(function () {
      app.globalData.g_isPlayingMusic = false
      self.setData({
        isPlayingMusic: false
      })
    })
  }
})