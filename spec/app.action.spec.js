define(['action'], function(Action) {
    describe('app.action test', function() {
        var isFun = function(obj) {
            return (typeof obj === 'function');
        };
        var isObj = function(obj) {
            return (typeof obj === 'object');
        };
        describe('test app.action', function() {
            it('Action.init should be a function', function() {
                expect(isFun(Action.sendAction)).toBe(true);
            });
            it('Action should be a object', function() {
                expect(isObj(Action)).toBe(true);
            });
        });

    });
});