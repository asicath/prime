//

var config = {
    deltaPerSecond: 1,
    startAt: 1,
    interval: 10,
    freqBase: 100,
    freqIncr: 11,
    loudMax: 0.1,
    displayWidth: 50,
    numberOfPrimes: 100
};



$(function() {

    setPrimeCount(config.numberOfPrimes);

    var running = null;

    $('#btnStart').on('click', function() {
        if (running != null) clearInterval(running);
        config.deltaPerSecond = +$('#txtSpeed').val();
        config.startAt = +$('#txtStart').val();
        start();
    });

    $('#btnStop').on('click', function() {
        stop();
    });

    $('#btnFaster').on('click', function() {
        var c = Math.round((config.deltaPerSecond + 0.01) * 1000) / 1000;
        config.deltaPerSecond = c;
        calcDelta();
        $('#txtSpeed').val(config.deltaPerSecond.toString());
    });

    $('#btnSlower').on('click', function() {
        var c = Math.round((config.deltaPerSecond - 0.01) * 1000) / 1000;
        if (c <= 0) return;
        config.deltaPerSecond = c;
        calcDelta();
        $('#txtSpeed').val(config.deltaPerSecond.toString())
    });

});

function setPrimeCount(count) {
    // generate
    config.primes = generatePrimes(count);

    // prime display
    $('#display').html();
    $('#display').append('<div id="div1"></div>');
    config.primes.forEach(function(prime) {
        $('#display').append('<div id="div' + prime + '"></div>');
    });
}

var running = null;

function calcDelta() {
    config.delta = (config.deltaPerSecond / 1000) * config.interval;
}

function start() {
    // stop any existing loop
    if (running != null) {
        clearInterval(running);
        running = null;
    }

    var n = config.startAt;
    calcDelta();

    running = setInterval(function() {
        setStep(n);
        n += config.delta;
    }, config.interval);
}

function stop() {

    // stop the loop
    if (running != null) {
        clearInterval(running);
        running = null;
    }

    // silence each prime
    primes.forEach(function(i, count) {
        pool.set(i.toString(), 100, 0);
        //$('#div' + i).html(formatNumber(i, 4) + getPlus(0));
    });
}

function setStep(n) {

    var s0 = Math.floor(n).toString();
    var s1 = (Math.floor(n*100) % 100).toString();
    if (s1.length == 1) s1 = "0" + s1;
    $('#txtStart').val(s0 + '.' + s1);



    // the natural
    var p1 = calcMethods.getPercent_natural1(n);
    var loud1 = p1 * config.loudMax;
    pool.set('1', config.freqBase, loud1);
    displayPercent(1, n, p1, config.freqBase);


    var method = calcMethods.getPercent_natural;
    config.primes.forEach(function(i, count) {

        // find freq
        var freq = config.freqBase + config.freqIncr * (count+1);

        // find loudness
        var p = method(n, i);
        var loud = p * config.loudMax;

        pool.set(i.toString(), freq, loud);

        // display
        displayPercent(i, n, p, freq);
    });

}

var calcMethods = {};

calcMethods.getPercent_natural = function(n, i) {

    var d = (1/i);

    var r = n % i;

    // going down
    if (r <= d) {
        return 1 - (r / d)
    }

    // going up
    if (i - r <= d) {
        return 1 - ((i - r) / d);
    }

    return 0;
};

calcMethods.getPercent_natural1 = function(n) {

    var r = n - Math.floor(n);


    if (r == 0) return 0;

    else if (r <= 0.50) {
        return r / 0.50;
    }

    // going down
    else {
        return 1 - ((r - 0.5) / 0.5)
    }

    /*
    var d = 0.25;



    // going up
    if (r >= 0.25 && r <= 0.50) {
        return (r - 0.25) / d;
    }

    // going down
    else if (r > 0.5 && r <= 0.75) {
        return 1 - ((r - 0.5) / d)
    }
    */

    return 0;
};

function formatNumber(n, length) {
    var s = n.toString();
    while (s.length < length) {
        s = ' ' + s;
    }
    return s.replace(/\s/g, '&nbsp;');
}


var plusCache = [];

function getPlus(p) {

    var i = Math.floor(p*config.displayWidth);

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

function displayPercent(i, n, percent, freq) {
    // display
    var times = Math.floor(n / i);
    $('#div' + i).html(formatNumber(i, 4) + getPlus(percent) + formatNumber(times, 10) + '|' + formatNumber(Math.round(freq), 4));
}
