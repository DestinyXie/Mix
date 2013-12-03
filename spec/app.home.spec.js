describe('app.home', function() {
    var App = require('app.home');
    var isFun = function(obj) {
        return (typeof obj === 'function');
    };
    var isObj = function(obj) {
        return (typeof obj === 'object');
    };

    it('App.init should be a function', function() {
        expect(isFun(App.init));
    });

    describe('test App', function() {
        it('App should be a object', function() {
            expect(isObj(App));
        });
    });

});