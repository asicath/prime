
var range = (function() {

    var exports = {};

    var primes = [];
    var upTo = 1;

    function createPrimesTo(n) {
        while (n > upTo) {
            upTo += 1;
            if (isPrime(upTo)) addPrime(upTo);
        }
    }

    function isPrime(n) {

        var max = Math.floor(Math.sqrt(n));

        for (var j = 0; j < primes.length; j++) {
            var prime = primes[j];

            // don't find above the limit
            if (prime.n > max) return true;

            // found a factor
            if (n % prime.n == 0) return false;
        }

        return true;
    }

    function addPrime(n) {

        // create the base prime
        var prime = {n: n};

        // get the existing coverage gap
        var uncovered = primes.length == 0 ? 1 : 1 - primes[primes.length - 1].sumCoverage;

        // take a smaller portion each time
        prime.addCoverage = uncovered * (1 / n);

        // get the sum
        prime.sumCoverage = (1 - uncovered) + prime.addCoverage;

        // add it to the list
        primes.push(prime);
    }

    exports.getPrimeFactors = function(n) {

        var factors = [];
        var max = n * n;

        for (var j = 0; j < primes.length; j++) {
            var prime = primes[j];

            // don't find above the limit
            if (prime.n > max) break;

            // found a factor
            if (n % prime.n == 0) factors.push(prime.n);
        }

        return factors;
    };

    exports.getRangeAt = function(n, intervalCount) {

        // make sure we've got enough primes
        createPrimesTo(n);

        // find the max prime for this number
        var iMax = primes.length - 1;
        while (primes[iMax].n > n) { // ?? Could make this sqrt n
            iMax -= 1;
        }

        // get max coverage
        var coverage = primes[iMax].sumCoverage;
        var max = coverage / intervalCount;

        var ranges = [];
        var current = null;
        var prime;

        // now examine each
        for (var i = 0; i <= iMax; i++) {
            prime = primes[i];

            if (current == null) current = {
                min: prime.n,
                count: 0,
                sum: 0
            };

            current.count += 1;
            current.sum += prime.addCoverage;

            if (current.sum > max) {

                // lower total coverage & reset the sum
                coverage -= current.sum;

                current.max = prime.n;
                ranges.push(current);
                current = null;

                // next index & recalc max
                max = coverage / (intervalCount - ranges.length);
            }
        }

        if (current != null) {
            current.max = prime.n;
            ranges.push(current);
            current = null;
        }

        return ranges;
    };

    return exports;
})();
