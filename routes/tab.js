

exports.upload = function(req, res){

    var fs = require('fs');

    var tab = require('tabify/lib/tab');
    var tabber = require('tabify/lib/tabber');
    var midiHelper = require('tabify/lib/midi-helper');
    var guitarHelper = require('tabify/lib/guitar-helper');

    fs.readFile(req.files.midi.path, function (err, data) {
        if (err) {
            res.render('upload', {tab: 'invalid tab'});
            return;
        }

        var guitar = guitarHelper.placeCapo(guitarHelper.standardTuning(), Number(req.body.capo));
        var sheet = new tab.Sheet(guitar);

        var midi = midiHelper.createFromRaw(data);
        tabber.usingMidi(sheet, midi);

        var params = {
            bars: 78
        }

        res.render('upload', {tab: tab.format(sheet, params), capo: Number(req.body.capo)});
    });
};