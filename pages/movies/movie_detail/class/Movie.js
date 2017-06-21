var util = require('../../../../utils/util.js')
class Movie {
  constructor(url) {
    this.url = url
  }

  getMovieData(cb) {
    this.cb = cb
    util.request(this.url, this.processData.bind(this))
  }

  processData(data) {
    if (!data) return

    var director = {
      avatar: '',
      name: '',
      id: ''
    }

    if (data.directors && data.directors.length) {
      var obj = data.directors[0]
      if (obj.avatars) {
        director.avatar = obj.avatars.large
      }
      director.name = obj.name
      director.id = obj.id
    }

    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join("、"),
      stars: util.convertToStar(data.rating.average),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastName(data.casts),
      castsInfo: util.convertToCasts(data.casts),
      summary: data.summary
    }
    this.cb(movie)
  }
}

export { Movie }