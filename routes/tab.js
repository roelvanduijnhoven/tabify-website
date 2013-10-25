var fs = require('fs');

exports.upload = function(req, res){
  fs.readFile(req.files.midi.path, function (err, data) {
    res.render('upload', {tab: data});
  });
};