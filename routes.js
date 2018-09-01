const express = require('express');
const router = express.Router();
const views = __dirname + '/views'

router.use(function (req, res, next) {
  console.log(Date.now() + ' ' + req.path + ' ' + req.method)
  next()
})

router.get('/', function(req, res) {
  res.sendFile(views + '/index.html')
})

router.get('*', function(req,res) {
  res.sendFile(views +  '/404.html')
})

module.exports = router;
