var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* Turns a directory into json */
function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.extention = '';
        info.children = fs.readdirSync(filename).map(function (child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
        info.extention = filename.split('.').pop().toLowerCase();
    }

    return info;
}

if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    var util = require('util');
    console.log(util.inspect(dirTree(process.argv[2]), false, null));
}

/* GET home page. */
router.get('/getAlbumImage', function (req, res, next) {
    fs.access(req.query.dir + '/cover.jpg', function(err) {
       if (err) {
           console.log(err);
           res.send('/public/images/album-art-missing.png');
       } else {
           res.send(req.query.dir + '/cover.jpg');
       }
    });
});

router.get('/getAudioPlayer', function (req, res, next) {
   res.render('audioPlayer', {dir: '/public/media/Music', file: { path: req.query.file, type: 'audio/mpeg'}});
});

module.exports = router;
