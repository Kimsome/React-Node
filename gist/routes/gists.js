const express = require('express');
// const fs = require('fs');

const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('gists');
});

router.get('/main', async(req, res, next) => {
    const search = req.query.search ? {
        $and: [{
                $or: [
                    { name: { $regex: new RegExp(req.query.search, 'i') } },
                    { code: { $regex: new RegExp(req.query.search, 'i') } }
                ]
            },
            { 'author_id': req.session.user.id }
        ]
    } : { 'author_id': req.session.user.id };

    const Gist = require("../model/Gist");
    const gists = await Gist.find(search).sort({ 'created_at': -1 });

    res.render('gists', {
        user: req.session.user,
        gists,
        search: req.query.search
    });
});

router.get('/modify/:id', async(req, res) => {
    // 在req里边，通过req.params访问到具体的值
    const id = req.params.id;
    const Gist = require("../model/Gist");
    // findById是model的方法，在mongoose的文档上可查询
    const gist = await Gist.findById(id);

    if (!gist) throw (new Error('not found'));
    if (gist.author_id != req.session.user.id) throw (new Error('只能修改自己的代码'));

    res.render('modify', { gist });
});

router.post('/update/:id', async(req, res) => {
    const id = req.params.id;
    const Gist = require("../model/Gist");
    const gist = await Gist.findById(id);
    console.log(id);
    if (!gist) throw (new Error('not found'));
    if (gist.author_id != req.session.user.id) throw (new Error('只能修改自己的代码'));

    if (!req.body.name) throw (new Error('名称不能为空'));
    if (!req.body.type) throw (new Error('类型不能为空'));
    if (!req.body.code) throw (new Error('代码不能为空'));

    gist.name = req.body.name;
    gist.type = req.body.type;
    gist.code = req.body.code;
    gist.author_id = req.session.user.id;
    gist.created_at = Date.now();

    // 调用save方法
    await gist.save();
    res.redirect('/gists/main');
});

router.get('/remove/:id', async(req, res) => {

    const id = req.params.id;
    const Gist = require('../model/Gist');
    console.log('no value');
    const gist = await Gist.findById(id);

    if (!gist) throw (new Error('not found'));
    if (gist.author_id != req.session.user.id) throw (new Error('只能删除自己的代码'));
    console.log('remove');
    await gist.deleteOne();

    res.redirect('/gists/main');
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