module.exports = {
    fred: function() {
        console.log('yo');
    }
};

var a = 2;

console.log({
    a: a,
    b: 3
});

a.then(function(a) {
    return a + 2;
}.bind(this));
