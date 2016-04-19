
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

    return {oscillator: oscillator, amp: amp};
}

// Set the frequency of the oscillator and start it running.
function startTone( index, frequency, loud, ms)
{
    var o = getOscillator(index);

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

    var primes = generatePrimes(30);


    $('body').append('<input type="button" value="GO" id="btn0">');
    $('body').append('<div id="divN">0</div>');
    primes.forEach(function(prime, count) {
        $('body').append('<div id="div' + prime + '">-</div>');

    });


    var change = 0.02;

    $('#btn0').on('click', function() {
        var n = 110;
        setInterval(function() {
            setStep(n, 100);
            n += change;
            //change += 0.0001;
        }, 200);
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
            //p = (p * 1.5) - 0.5;

            p = p * 2 - 1;

            if (p < 0) p = 0;
        }

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