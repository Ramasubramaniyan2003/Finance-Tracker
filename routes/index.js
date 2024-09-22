var express = require('express');
var router = express.Router();



router.get('/', function(req, res) {
  res.render('login');
})

router.get('/dashboard', function (req, res) {
  res.render('dashboard');
})

router.get('/transaction', function(req, res) {
  res.render('transactions');
})

router.get('/category', function(req, res) {
  res.render('category');
});

router.get('/logout', (req, res) => {
  req.logout(err => {
      if (err) {
          return next(err);
      }
      res.redirect('/');
  });
});

module.exports = router;
