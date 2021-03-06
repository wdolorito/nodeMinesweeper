const express = require('express')
const app = express()
const server = require('http').createServer(app)
const router = require('./routes')
const bodyParser = require('body-parser')
const fs = require('fs')
let port = 3000
app.use(express.static(__dirname + '/static'))
app.use(bodyParser.urlencoded({ extended: true }))

try {
  port = fs.readFileSync(__dirname + '/port', 'utf8')
  console.log('input port: ' + port)
} catch(error) {
  console.log(error.stack)
}

app.use('/', router)

server.listen(port, () => {
  console.log('Live at Port ' + port)
})
