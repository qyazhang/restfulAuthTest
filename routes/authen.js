var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/signup', function (req, res, next) {

    var fs = require('fs');
    var obj;
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
    });
    // var obj = fs.readFileSync('users.json').toJSON();
    // var obj = JSON.parse(contents);

    var id = req.body.user_id;
    var passwd = req.body.password;
    console.log(id);
    console.log(passwd);

    if (id.length < 6 || id.length > 20 || id === null) {
        res.status(400).json({message: "Account creation failed", cause: "required user_id and password"});
        return;
    }

    if (passwd === null || passwd.length < 8 || passwd.length > 20) {
        res.status(401).json({
            message: "Account creation failed",
            cause: "required user_id and password"
        });
        return;
    }

    var pattern1 = /[\x00-\x1f]+/g;
    var pattern2 = /\x7f+/g;

    if (pattern1.test(passwd) || pattern2.test(passwd) === 0x7F) {
        res.status(402).json({message: "Account creation failed", cause: "required user_id and password"});
        return;
    }

    if (Object.keys(obj).length !== 0) {
        var keys = Object.keys(obj);

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === id) {
                res.status(403).json({message: "Account creation failed", cause: "already same user_id is used"});
                return;
            }
        }
    }


    var b = new Buffer(passwd);
    var encodePasswd = b.toString('base64');
    obj.push({
        [id]: {
            passward: [encodePasswd]
        }
    })

});

module.exports = router;
