

exports.upload = function(req, res){

    var fs = require('fs');
    var midiParser = require('midifile');
    var tab = require('tabify/lib/tab');
    var midiHelper = require('tabify/lib/midi-helper');
    var bufferHelper = require('tabify/lib/buffer-helper');
    var guitarHelper = require('tabify/lib/guitar-helper');

    fs.readFile(req.files.midi.path, function (err, data) {
        if (err) {
            res.render('upload', {tab: 'invalid tab'});
            return;
        }

        var bufferedMidi = bufferHelper.toArrayBuffer(data);
        var midi = new midiParser(bufferedMidi);

        var guitar = guitarHelper.placeCapo(guitarHelper.standardTuning(), Number(req.body.capo));
        var sheet = new tab.Sheet(guitar.length);

        var notes = midiHelper.getNotes(midi);
        for (var i in notes) {
            var note = notes[i];
            var string = guitarHelper.bestStringToPlay(guitar, note);

            if (!string) {
                process.stdout.write("\nSong is unplayable using this (tuned) guitar\n\n");
                return;
            }

            sheet.place(string, guitarHelper.fretToPlayNoteOn(guitar, string, note));
            sheet.rest();
        }

        res.render('upload', {tab: tab.format(sheet, 80), capo: Number(req.body.capo)});
    });
};