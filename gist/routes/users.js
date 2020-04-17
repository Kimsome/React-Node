const  GH_CLIENT_ID  =  '/** your client id **/';
const  GH_CLIENT_SECRET  =  '/** your client secret **/';
const  GH_CALLBACK  =  '/** your callback **/';

require('url-search-params-polyfill');
const axios = require('axios');
const querystring = require('querystring');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
    if (req.session.user) return res.redirect('/');

    const url = 'https://github.com/login/oauth/authorize' +
        '?client_id=' + encodeURIComponent(GH_CLIENT_ID) +
        '&redirect_uri=' + encodeURIComponent(GH_CALLBACK);

    res.render('login', { url });
});


router.get('/logout', async(req, res) => {
    if (req.session) await req.session.destroy();
    res.redirect('/');
});

router.get('/ghcallback', async(req, res) => {

    if (!req.query.code) res.status(500).send('bad code!');

    console.log("in callback");

    let params = new URLSearchParams();
    params.append("client_id", GH_CLIENT_ID);
    params.append("client_secret", GH_CLIENT_SECRET);
    params.append("code", req.query.code);
    params.append("redirect_uri", GH_CALLBACK);

    const { data } = await axios.post("https://github.com/login/oauth/access_token", params);
    if (data) {

        const acode = querystring.parse(data).access_token;
        axios.get('https://api.github.com/user', {
            params: {
                access_token: acode
            }
        }).then(function(response) {
            console.log("got user info", response.data);
            req.session.user = response.data;
            res.redirect('/');
        }).catch(function(error) {
            console.log(error);
        });
    }
})

module.exports = router;