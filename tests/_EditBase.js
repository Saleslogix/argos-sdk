define('tests/_EditBase', ['dojo/_base/lang', 'argos/_EditBase'], function(lang, _EditBase) {
    return describe('Sage.Platform.Mobile._EditBase', function() {
        it('Can diff simple changes', function() {
            var left, right, base;

            base = new _EditBase();

            left = {
                a: '123',
                b: '456',
                c: true
            };

            right = {
                a: '123',
                b: '456',
                c: true
            };

            expect(base.diffs(left, right)).toEqual([]); // equal, no diffs

            left.a = 'abc';

            expect(base.diffs(left, right)).toEqual(['a']);// a is different

            right.b = 'def';

            expect(base.diffs(left, right)).toEqual(['a', 'b']); // a and b are both different
            base.destroy();
        });

        it('Can diff more complex changes', function() {
            var left, right, date, base;
            base = new _EditBase({idProperty: '$key'});

            date = new Date();
            date.setMilliseconds(1);

            left = {
                a: '123',
                b: '456',
                c: true,
                d: date,
                e: {
                    '$key': 'id1'
                }
            };

            right = {
                a: '123',
                b: '456',
                c: true,
                d: date,
                e: {
                    '$key': 'id1'
                }
            };

            expect(base.diffs(left, right)).toEqual([]); // equal, no diffs

            left.d = new Date();
            left.d.setMilliseconds(5);

            expect(base.diffs(left, right)).toEqual(['d']);// d is a different date

            right.e.$key = 'id2';

            expect(base.diffs(left, right)).toEqual(['d', 'e.$key']);// e object has a different key

            base.destroy();
        });
    });
});

