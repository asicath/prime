// Example showing how to produce a tone using Web Audio API.
// Load the file webaudio_tools.js before loading this file.
// This code will write to a DIV with an id="soundStatus".
var o = [];


function getOscillator(index) {

    var id = index.toString();

    // check cache
    if (o.hasOwnProperty(id)) return o[id];

    if( audioContext )
    {
        var oscillator = audioContext.createOscillator();
        fixOscillator(oscillator);
        oscillator.frequency.value = 440;
        var amp = audioContext.createGain();
        amp.gain.value = 0;

        // Connect oscillator to amp and amp to the mixer of the audioContext.
        // This is like connecting cables between jacks on a modular synth.
        oscillator.connect(amp);
        amp.connect(audioContext.destination);
        oscillator.start(0);

        o[id] = {oscillator: oscillator, amp: amp};

        return o[id];
    }
}

// Set the frequency of the oscillator and start it running.
function startTone( index, frequency, loud, ms)
{

    var time = ms / 2000;

    var o = getOscillator(index);
    var oscillator = o.oscillator;
    var amp = o.amp;

    var now = audioContext.currentTime;

    oscillator.frequency.setValueAtTime(frequency, now);

    // Ramp up the gain so we can hear the sound.
    // We can ramp smoothly to the desired value.
    // First we should cancel any previous scheduled events that might interfere.
    amp.gain.cancelScheduledValues(now);
    // Anchor beginning of ramp at current value.
    amp.gain.setValueAtTime(amp.gain.value, now);
    amp.gain.linearRampToValueAtTime(loud, audioContext.currentTime + time);
}

function stopTone(index, time)
{
    var oscillator = getOscillator(index);
    var now = audioContext.currentTime;
    amp.gain.cancelScheduledValues(now);
    amp.gain.setValueAtTime(amp.gain.value, now);
    amp.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + time);
}

function upDown(index,frequency) {

    return new Promise(function(resolve, reject) {
        startTone(index, frequency, 0.5, 1000);
        setTimeout(function() {
            startTone(index, frequency, 0, 1000);
            setTimeout(function() {
                resolve();
            }, 1000);
        }, 1000);
    });

}

function lowerFrom(index, freq, vol, interval) {
    startTone(index, freq, vol, interval);

    if (vol <= 0) return;

    setTimeout(function() {
        lowerFrom(index, freq, vol - 0.01, interval);
    }, interval);
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

var freqs = generatePrimes(200).slice(30);


$(function() {
    $('body').append('<input type="button" value="GO" id="btn0">');
    $('body').append('<div id="divN">0</div>');

    //var primes = [2, 3, 5, 7, 11, 13, 17, 19];
    var primes = generatePrimes(3);

    primes.forEach(function(prime, count) {
        $('body').append('<div id="div' + prime + '">-</div>');

    });


    var change = 0.1;

    $('#btn0').on('click', function() {
        var n = 1;
        setInterval(function() {
            setStep(n, 50);
            n += change;
            //change += 0.0001;
        }, 100);
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
            p = (p * 1.5) - 0.5;
            if (p < 0) p = 0;




            //p = Math.sin(Math.PI * p0 + Math.PI * 0.5);
            //if (p < 0) p = 0;

            //var p3 = p2 < 0 ? 0: p2;
            //var p3 = (p2 + 1) / 2;
            //p = p3;

            //p = Math.floor(p2 * 100) / 100;
            //$('#div' + i).html(p0 + '   ' + p2 + '   ' + p);



            //p = ((n % (i*2)) / (i * 2));

            //
        }


        var loud = p * maxLoud;
        startTone(i, freq, loud, interval);


        var s = "-";
        for (var j = 0; j < p*50; j++) {
           s += '+';
        }
        $('#div' + i).html(s);
    }


});