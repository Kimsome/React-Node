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

router.post('/save', async(req, res, next) => {
    // 测试fs
    // const content = fs.Promises.readFile("index.php");
    if (!req.body.name) throw (new Error('名称不能为空'));
    if (!req.body.type) throw (new Error('类型不能为空'));
    if (!req.body.code) throw (new Error('代码不能为空'));

    // 将片段保存到数据库
    const Gist = require('../model/Gist');

    const gist = new Gist({
        name: req.body.name,
        type: req.body.type,
        code: req.body.code,
        author_id: req.session.user.id,
        created_at: Date.now()
    });

    console.log(gist);
    await gist.save();
    res.send('saved');
});

module.exports = router;