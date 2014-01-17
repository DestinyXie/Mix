define(['home'], function() {
    describe('app.home', function() {
        var isFun = function(obj) {
            return (typeof obj === 'function');
        };
        var isObj = function(obj) {
            return (typeof obj === 'object');
        };

        it('UserMenus should be a function', function() {
            expect(isFun(UserMenus)).toBe(true);
        });

        describe('test App', function() {
            it('regExpObj should be a object', function() {
                expect(isObj(regExpObj)).not.toBe(false);
            });
        });
    });
});