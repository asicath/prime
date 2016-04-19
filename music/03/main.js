
// Start off by initializing a new audioContext.
var audioContext =  createAudioContext();

function createAudioContext()
{
    var contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext);
    if (contextClass) {
        return new contextClass();
    } else {
        alert("Sorry. WebAudio API not supported. Try using the Google Chrome or Safari browser.");
        return null;
    }
}



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

    oscillator.start(0);

    return {oscillator: oscillator, amp: amp, atZero: true};
}

// Set the frequency of the oscillator and start it running.
function startTone( index, frequency, loud, ms)
{
    var o = getOscillator(index);

    if (o.atZero && loud == 0) return;

    if (loud == 0) o.atZero = true;
    else o.atZero = false;

    var now = audioContext.currentTime;
    var time = ms / 2000;

    o.oscillator.frequency.setValueAtTime(frequency, now);

    // Ramp up the gain so we can hear the sound.
    // We can ramp smoothly to the desired value.
    // First we should cancel any previous scheduled events that might interfere.
    o.amp.gain.cancelScheduledValues(now);
    // Anchor beginning of ramp at current value.
    o.amp.gain.setValueAtTime(o.amp.gain.value, now);
    o.amp.gain.linearRampToValueAtTime(loud, audioContext.currentTime + time);
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




$(function() {

    var primes = generatePrimes(100);


    $('body').append('<input type="button" value="GO" id="btn0">');

    for (var i = 1; i < 200; i++) {
        $('body').append('<input type="button" value="' + i + '" id="btn' + i + '" data-i="' + i + '">');
        $('#btn' + i).on('click', function() {
            var n = +$(this).data('i');
            setStep(n, 100);
        });
    }


    $('body').append('<div id="divN">0</div>');
    primes.forEach(function(prime, count) {
        $('body').append('<div id="div' + prime + '">-</div>');
    });


    var change = 0.1;

    $('#btn0').on('click', function() {
        var n = 1;
        setInterval(function() {
            setStep(n, 25);
            n += change;
            //change += 0.0001;
        }, 50);
    });

    function setStep(n, interval) {
        $('#divN').html(Math.floor(n*100)/100);

        var freq0 = 100;
        var freqInterval = 10;
        primes.forEach(function(prime, count) {
            setSingle(n, interval, prime, freq0 + freqInterval * count);
        });

    }

    function setSingle(n, interval, i, freq) {

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

        p = Math.max(p * 1.5 - 0.5, 0);


        var maxLoud = 0.1;
        var loud = p * maxLoud;


        startTone(i, freq, loud, interval);


        $('#div' + i).html(getPlus(p));
    }


});

var plusCache = [];
function getPlus(p) {

    var i = Math.floor(p*50);

    if (plusCache[i]) return plusCache[i];
    var s = "-";
    for (var j = 0; j < i; j++) {
        s += '+';
    }
    plusCache[i] = s;
    return s;
}