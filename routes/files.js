var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var fs = require('fs');
var sanitize = require('sanitize-filename');
//router.use(express.json());

var upDir = path.resolve('./files/uploads');

router.get('/', function(req, res) {
    res.render('pages/files');
});

//router.post('/listfiles', function(req, res) { 
//  let fileList = fs.readdirSync(upDir);
//  res.send(fileList);
//});

router.get('/listfiles', function(req, res) { 
  let fileList = fs.readdirSync(upDir)
    .map(function(v) { 
        return { name:v,
          time:fs.statSync(upDir + '/' + v).mtime.getTime()
        }; 
    })
    .sort(function(a, b) { return b.time - a.time; })
    .map(function(v) { return v.name; });
  res.send(fileList);
});

router.get('/yeet/:yeetfile', function(req, res) {
  var yeetfile = sanitize(req.params['yeetfile']);
  fs.unlink(upDir + '/' + yeetfile, (err) => {
    if (err) {
    res.write('<script>alert("' + yeetfile + ' not found");</script>');
    res.write('<script>window.location = "/files"</script>');
    res.end();
    }
    res.write('<script>alert("' + yeetfile + ' deleted");</script>');
    res.write('<script>window.location = "/files"</script>');
    res.end();
  })
})

//multer file upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, upDir)
    }, 
    filename: function (req, file, cb) {
      cb(null, sanitize(file.originalname))
    }
  })      

var maxSize = 201 * 1024 * 1024;
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");       
    
router.post("/uppies",function (req, res) {
    upload(req,res, (err) => {
        if(err) {
            res.status(500);
            res.send(err);
        }
          res.status(201);
          res.send(":3");
        })
    })

router.get('/:reqfile', function(req, res) {
  var reqfile = sanitize(req.params['reqfile'])
  //console.log(req.params['reqfile'])
  //console.log(reqfile)
  res.sendFile(upDir + '/' + reqfile)
});

module.exports = router;