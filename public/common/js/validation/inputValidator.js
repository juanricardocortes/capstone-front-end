function validate (e) {
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k >= 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}