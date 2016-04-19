
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


var notes = sevenHigh;


var primes = [];

function addPrime(n) {

    // create the base prime
    var prime = { n: n };

    // get the existing coverage gap
    var uncovered = primes.length == 0 ? 1 : 1 - primes[primes.length - 1].sumCoverage;

    // take a smaller portion each time
    prime.addCoverage = uncovered * (1 / n);

    // get the sum
    prime.sumCoverage = (1 - uncovered) + prime.addCoverage;

    // add it to the list
    primes.push(prime);
}

function getPrimeFactors(n) {

    var factors = [];
    var max = n * n;

    for (var j = 0; j < primes.length; j++) {
        var prime = primes[j];

        // don't find above the limit
        if (prime.n > max) break;

        // found a factor
        if (n % prime.n == 0) factors.push(prime);
    }

    return factors;
}


var i = 2;

function next() {

    var factors = getPrimeFactors(i);

    if (factors.length == 0) addPrime(i);


    var count = notes.length;

    // get max coverage
    var coverage = primes[primes.length - 1].sumCoverage;

    var sum = 0;
    var index = 0;
    var max = coverage / count;

    var log = i % 10000 == 0;
    //log = true;
    var m = 0;

    // now examine each
    for (var j = 0; j < primes.length; j++) {
        var prime = primes[j];

        // log it
        //console.log(' --\t' + index + '\t' + prime.n); //prime.sumCoverage.toFixed(2)

        sum += prime.addCoverage;

        m++;

        if (sum > max) {

            if (log) console.log(index + '\t' + sum.toFixed(3) + '\t' + m);

            prime.noteIndex = index;

            // lower total coverage & reset the sum
            coverage -= sum;
            sum = 0;
            m = 0;

            // next index & recalc max
            index += 1;
            max = coverage / (count - index);
        }


    }

    if (log) console.log(index + '\t' + sum.toFixed(3) + '\t' + m);

    if (log) console.log('');
    i += 1;

    for (var l = 0; l < notes.length; l++) {
        var isActive = false;
        factors.forEach(function(f) {
            if (f.noteIndex == l) isActive = true;
        });

        var loud = isActive ? 0.2 : 0;

        var name = notes[l].octave + notes[l].note;
        pool.set(name, notes[l].freq, loud);
    }

}


//while (true) { next(); }

setInterval(next, 250);