const starSrc = '/images/icon/star.png'
const noneStarSrc = '/images/icon/none-star.png'

function convertToStar(average) {
  var stars = []
  var score = Math.floor(Math.round(average) * 0.5)
  for (var j = 0; j < score; j++) {
    stars.push(starSrc)
  }
  while (stars.length < 5) {
    stars.push(noneStarSrc)
  }
  return stars
}

function convertToCastName(casts) {
  var arr = []
  casts.forEach(function(cast){
    arr.push(cast.name)
  })
  return arr.join(" / ")
}

function convertToCasts(casts) {
  var arr = []
  casts.forEach(function (cast) {
    var obj = {
      avatar: cast.avatars ? cast.avatars.large : '',
      name: cast.name
    }
    arr.push(obj)
  })
  return arr
}

function request(url, callback) {
  wx.showNavigationBarLoading()
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "application/xml"
    },
    success: function (res) {
      callback && callback(res.data)
    },
    complete: function () {
      // wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }
  })
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  request: request,
  formatTime: formatTime,
  convertToStar: convertToStar,
  convertToCasts: convertToCasts,
  convertToCastName: convertToCastName
}
