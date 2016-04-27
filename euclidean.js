




console.log(gcd(10, 1));


function gcd(a, b) {
    console.log(a + "," + b);
    if (b == 0)
        return a;
    else
        return gcd(b, a % b);
}
