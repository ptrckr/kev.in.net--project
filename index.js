// Modules
const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const fs = require('fs')
const app = express()

// Paths
const root = __dirname
const views_path = path.join(root, 'views')
const public_path = path.join(root, 'public')
const img_path = path.join(public_path, 'img')

// Settings
app.set('view engine', 'pug')
app.set('views', views_path)

// Middleware
app.use(express.static(public_path))
app.use(favicon(path.join(public_path, 'favicon.ico')))

const getRandomImagePathFrom = (dir, cb) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      cb(err, null)
    } else {
      let images = []

      files.forEach(file => {
        if (path.extname(file) === '.jpg')
          images.push(file)
      })

      if (images.length > 0) {
        cb(null, images[Math.floor(Math.random() * images.length)])
      } else {
        cb('No images found.', null)
      }
    }
  })
}

app.get('/', (req, res, next) => {
  getRandomImagePathFrom(img_path, (err, img) => {
    if (err) {
      res.status(500).send(`Couldn't find any image to show.`)
    } else {
      const colors = img.match(/-([a-fA-F0-9]{6})_([a-fA-F0-9]{6})/)

      res.render('index', {
        picture: `/img/${img}`,
        color1: `#${colors[1]}`,
        color2: `#${colors[2]}`
      })
    }
  })
})

module.exports = {
  url: 'kev.in.net',
  app: app
}
