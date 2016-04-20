$(function() {

    var loud = 0.3;



    var sevenHigh = [
        {octave: 4, note: "A", freq: 440},
        {octave: 4, note: "B", freq: 493.88},
        {octave: 5, note: "C", freq: 523.25 },
        {octave: 5, note: "D", freq: 587.33 },
        {octave: 5, note: "E", freq: 659.26 },
        {octave: 5, note: "F", freq: 698.46 },
        {octave: 5, note: "G", freq: 783.99 }

    ];

    var sevenLow = [
        {octave: 3, note: "A", freq: 220.00},
        {octave: 3, note: "B", freq: 246.94},
        {octave: 4, note: "C",  freq: 261.63},
        {octave: 4, note: "D", freq: 293.66},
        {octave: 4, note: "E", freq: 329.63},
        {octave: 4, note: "F", freq: 349.23},
        {octave: 4, note: "G", freq: 392.00}
    ];

    var three = [
        {octave: 4, note: "C",  freq: 261.63},
        {octave: 4, note: "D", freq: 293.66},
        {octave: 4, note: "E", freq: 329.63},
        {octave: 4, note: "F", freq: 349.23}
    ];



    var twelve = [
        {octave: 3, note: "A", freq: 220.00},
        {octave: 3, note: "A#", freq: 233.08},
        {octave: 3, note: "B", freq: 246.94},
        {octave: 4, note: "C",  freq: 261.63},
        {octave: 4, note: "C#", freq: 277.18},
        {octave: 4, note: "D", freq: 293.66},
        {octave: 4, note: "D#", freq: 311.13},
        {octave: 4, note: "E", freq: 329.63},
        {octave: 4, note: "F", freq: 349.23},
        {octave: 4, note: "F#", freq: 369.99},
        {octave: 4, note: "G", freq: 392.00},
        {octave: 4, note: "G#", freq: 415.30}
    ];


    var notes = sevenLow;


    function formatNumber(n, length) {
        var s = n.toString();
        while (s.length < length) {
            s = ' ' + s;
        }
        return s.replace(/\s/g, '&nbsp;');
    }


    var n = 2;

    function next() {

        $('#n').html('&nbsp;&nbsp;&nbsp;' + formatNumber(n, 4));

        var ranges = range.getRangeAt(n, notes.length);
        var factors = range.getPrimeFactors(n);



        // reset isActive
        for (var i = 0; i < notes.length; i++) {
            notes[i].isActive = false;
            notes[i].factor = 0;
        }

        // find any that are active
        for (var i = 0; i < factors.length; i++) {
            var f = factors[i];
            if (f == n) continue;
            for (var j = 0; j < ranges.length; j++) {
                if (f >= ranges[j].min && f <= ranges[j].max) {
                    notes[j].isActive = true;
                    notes[j].factor = f;
                }
            }
        }

        // set the tones, and display
        for (var l = 0; l < notes.length; l++) {
            var note = notes[l];

            var loud = note.isActive ? 0.2 : 0;

            var name = note.note + note.octave;
            pool.set(name, note.freq, loud);

            // display
            var displayValue = "&nbsp;&nbsp;&nbsp;&nbsp;";
            if (note.isActive) {
                //displayValue = "++++";
                displayValue = formatNumber(note.factor, 4);
            }

            displayValue += '|';

            var r = ranges[l];
            if (typeof r !== 'undefined') {
                displayValue += ' ' + r.sum.toFixed(2);
                displayValue += ' ' + formatNumber(r.min, 4) + '-' + formatNumber(r.max, 4);
                displayValue += ' ' + r.count;
            }



            $('#' + name + ' .value').html(displayValue);
        }

        n += 1;
    }

    function setupDisplay() {
        $('#display').append('<div id="n"></div>')
        for (var l = 0; l < notes.length; l++) {
            var note = notes[l];
            var name = note.note + note.octave;
            $('#display').append('<div id="' + name + '"><div>' + name + '|<span class="value">test</span></div></div>');
        }
    }


    function addDelay() {

        var v = Math.random() * 50 - 25;

        var t = Math.floor(400 + v);

        setTimeout(function() {
            next();
            addDelay();
        }, t);
    }


    setupDisplay();
    addDelay();
});


//while (true) { next(); }

//setInterval(addDelay, 50);