




gcd(10, 5);


function gcd(a, b) {
    console.log(a + "," + b);
    if (b == 0)
        return a;
    else
        return gcd(b, a % b);
}
