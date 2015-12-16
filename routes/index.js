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
        info.children = fs.readdirSync(filename).map(function (child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
}

if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    var util = require('util');
    console.log(util.inspect(dirTree(process.argv[2]), false, null));
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index',
        {
            title: 'Express',
            bannerText: "Welcome to Cobblestone Streaming",
            mediaFiles: dirTree("public/media").children
        });
});

module.exports = router;
