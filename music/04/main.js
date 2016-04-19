
var audioContext = new (window.AudioContext || window.webkitAudioContext)();




var o = [];

function getOscillator(index) {
    // check cache
    var id = index.toString();
    if (o.hasOwnProperty(id)) return o[id];

    // cache for later and return
    o[id] = createOscillatorWithAmp();
    return o[id];
}

function createOscillatorWithAmp() {
    // create the oscillator
    var oscillator = audioContext.createOscillator();

    // Add missing functions to make the oscillator compatible with the later standard.
    if (typeof oscillator.start == 'undefined') oscillator.start = function(when) { oscillator.noteOn(when); }
    if (typeof oscillator.stop == 'undefined') oscillator.stop = function(when) { oscillator.noteOff(when); }
    oscillator.frequency.value = 440;

    // create the amp
    var amp = audioContext.createGain();
    amp.gain.value = 0;

    // Connect oscillator to amp and amp to the mixer of the audioContext.
    // This is like connecting cables between jacks on a modular synth.
    oscillator.connect(amp);
    amp.connect(audioContext.destination);

    oscillator.start();

    return {oscillator: oscillator, amp: amp, atZero: true};
}

// Set the frequency of the oscillator and start it running.
function setTone(index, frequency, loud)
{
    var o = getOscillator(index);

    if (o.atZero && loud == 0) return;

    if (loud == 0) o.atZero = true;
    else o.atZero = false;

    o.oscillator.frequency.value = frequency;
    o.amp.gain.value = loud;
}

function generatePrimes(count) {
    var n = 2;
    var a = [];
    while (a.length < count) {

        if (isPrime(n, a)) {
            a.push(n);
        }

        n++;
    }
    return a;
}

function isPrime(n, primes) {
    for (var i = 0; i < primes.length; i++) {
        if (n % primes[i] == 0) return false;
    }
    return true;
}


var primes = generatePrimes(200);

$(function() {

    $('body').append('<input type="button" value="STOP" id="btnStop">');
    $('body').append('<input type="button" value="START" id="btnStart">');

    $('body').append('<input type="text" value="1" id="txtStart">');
    $('body').append('<input type="text" value="0.01" id="txtSpeed">');

    $('body').append('<input type="button" value="FASTER" id="btnFaster">');
    $('body').append('<input type="button" value="SLOWER" id="btnSlower">');

    $('body').append('<br><br>');
    /*
    for (var i = 1; i < 200; i++) {
        $('body').append('<input type="button" value="' + i + '" id="btn' + i + '" data-i="' + i + '">');
        $('#btn' + i).on('click', function() {
            var n = +$(this).data('i');
            setStep(n, 100);
        });
    }
    */

    // prime display
    primes.forEach(function(prime, count) {
        $('body').append('<div id="div' + prime + '"></div>');
    });



    var running = null;
    var change = 0.01;
    $('#btnStart').on('click', function() {

        if (running != null) clearInterval(running);

        change = +$('#txtSpeed').val();
        var n = +$('#txtStart').val();
        running = setInterval(function() {
            setStep(n);
            n += change;
        }, 10);
    });

    $('#btnStop').on('click', function() {
        if (running != null) clearInterval(running);
        primes.forEach(function(i, count) {
            setTone(i, 100, 0);

            $('#div' + i).html(formatNumber(i, 4) + getPlus(0));
        });
    });

    $('#btnFaster').on('click', function() {
        var c = Math.round((change + 0.01) * 1000) / 1000;
        change = c;

        $('#txtSpeed').val(change.toString());
    });

    $('#btnSlower').on('click', function() {
        var c = Math.round((change - 0.01) * 1000) / 1000;
        if (c <= 0) return;
        change = c;
        $('#txtSpeed').val(change.toString())
    });

});

function setStep(n) {
    $('#txtStart').val(Math.floor(n*100)/100);

    var freq0 = 100;
    var freqInterval = 5;
    primes.forEach(function(i, count) {

        var freq = freq0 + freqInterval * count;

        //var p = getSingle_exact(n, i);
        var p = getSingle_exp(n, i);

        var maxLoud = 0.1;
        var loud = p * maxLoud;

        setTone(i, freq, loud);

        var times = Math.floor(n / i);
        $('#div' + i).html(formatNumber(i, 4) + getPlus(p) + times);
    });

}

function getSingle_exp(n, i) {
    var maxLoud = 0.1;
    var p;
    if (n == 0 || n < i/2) {
        p = 0;
    }
    else {
        var p0 = ((n % i) * 2) / i;
        if (p0 > 1) p0 = 1 - (p0 - 1);

        p = 1 - p0;
        p = p * p * p;
        p = (p * 1.50) - 0.50;

        //p = p * 2 - 1;

        if (p < 0) p = 0;
    }

    return p;
}

// only starts to go up once the previous numberhas been hit, will be back down again before its done
function getSingle_exact(n, i) {

    // default to silent
    var p = 0;

    // determine if we are in sound making range
    var r = n % i;

    // going down
    if (r < 1) {
        // 0 to 1;
        p = 1 - r;
    }

    // going up
    else if (r > i - 1) {
        // 1 to 0
        p = 1 - (i - r);
    }

    //p = Math.max(p * 1.5 - 0.5, 0);

    return p;
}

function formatNumber(n, length) {
    var s = n.toString();
    while (s.length < length) {
        s = ' ' + s;
    }
    return s.replace(/\s/g, '&nbsp;');
}

var plusCache = [];
function getPlus(p) {

    var i = Math.floor(p*50);

    if (plusCache[i]) return plusCache[i];
    var s = "|";
    for (var j = 0; j < 50; j++) {
        if (p > 0 && j <= i) s += '+';
        else s += '&nbsp;';
    }
    s += '|';
    plusCache[i] = s;
    return s;
}