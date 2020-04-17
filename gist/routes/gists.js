const express = require('express');
// const fs = require('fs');

const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('gists');
});

router.get('/main', (req, res, next) => {
    // if (!req.session.user) return res.redirect('/users/login');
    res.render('gists', { user: req.session.user });
});

router.post('/save', (req, res, next) => {
    // const content = fs.Promises.readFile("index.php");
    if (!req.body.name) throw (new Error('名称不能为空'));
    if (!req.body.type) throw (new Error('类型不能为空'));
    if (!req.body.code) throw (new Error('代码不能为空'));

});

module.exports = router;