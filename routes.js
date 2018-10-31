const express = require('express');
const router = express.Router();
const views = __dirname + '/views'

const credentials = require(__dirname + '/gmail-credentials.json')
const send = require('gmail-send')({
  user: credentials.user,
  pass: credentials.pass,
  to:   credentials.user,
})

router.use(function (req, res, next) {
  console.log(Date() + ' ' + req.path + ' ' + req.method)
  next()
})

router.get('/', function(req, res) {
  res.sendFile(views + '/index.html')
})

router.post('/', function(req, res) {
  console.log(req.body)
})

router.get('*', function(req,res) {
  res.sendFile(views +  '/404.html')
})

module.exports = router;
