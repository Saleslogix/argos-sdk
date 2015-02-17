define('tests/Groups/DateTimeSectionTests', [
    'moment',
    'argos/Groups/DateTimeSection'
], function(moment, DateTimeSection) {
    return describe('Sage.Platform.Mobile.Groups.DateTimeSection', function() {
        it('can get a default section', function() {
            var dts = new DateTimeSection();
            expect(dts.getDefaultSection().key).toBe("Unknown");
        });

        it('can get a section', function() {
            var dts = new DateTimeSection();
            dts.groupByProperty = 'Test';
            expect(dts.getSection({}).key).toBe('Unknown');
            expect(dts.getSection({'Test': moment()}).key).toBe('Today');
            expect(dts.getSection()).toBe(null);

            dts.groupByProperty = '';
            expect(dts.getSection({})).toBe(null);

            expect(dts.getGroupSection()).toBe(undefined);

            dts.groupByProperty = 'Test';
            expect(dts.getOrderByQuery()).toBe('Test desc');
            dts.sortDirection = 'asc';
            expect(dts.getOrderByQuery()).toBe('Test asc');
        });

        it('can get a section by key', function() {
            var dts = new DateTimeSection();
            dts.init();
            expect(dts.getSectionByKey('Foo').key).toBe('Unknown');
        });

        it('can get section key', function() {
            var dts = new DateTimeSection();
            dts.init();
            expect(dts.getSectionKey(null)).toBe('Unknown');
        });

        it('can use a momentLang', function() {
            var dts = new DateTimeSection();
            dts.init();
            dts.momentLang = 'en';
            expect(dts.getSectionKey(moment())).toBe('Today');
        });

        it('should be today', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment();
            value = moment();
            expect(dts.getSectionKey(value)).toEqual("Today");
            value.add(1, 'days');
            expect(dts.getSectionKey(value)).not.toBe("Today");
        });

        it('should be tomorrow', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment();

            value = moment().add(1, 'days').startOf('day');
            expect(dts.getSectionKey(value)).toEqual("Tomorrow");

            value.endOf('day');
            expect(dts.getSectionKey(value)).toEqual("Tomorrow");

            value.add(1, 'days');
            expect(dts.getSectionKey(value)).not.toBe("Tomorrow");
        });

        it('should be yesterday', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment();

            value = moment().subtract(1, 'days').startOf('day');
            expect(dts.getSectionKey(value)).toEqual("Yesterday");

            value.endOf('day');
            expect(dts.getSectionKey(value)).toEqual("Yesterday");

            value.add(1, 'days');
            expect(dts.getSectionKey(value)).not.toBe("Yesterday");
        });

        it('should be later this week', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().startOf('week');// start of the week

            value = dts.currentDate.clone().startOf('day').add({ days: 2, seconds: 1});
            expect(dts.getSectionKey(value)).toEqual("LaterThisWeek");

            value = dts.currentDate.clone().endOf('week').subtract(1, 'seconds');
            expect(dts.getSectionKey(value)).toEqual("LaterThisWeek");

            // tomorrow is excluded from "LaterThisWeek" ensure it doesn't get added
            value = dts.currentDate.clone().add(1, 'days');
            expect(dts.getSectionKey(value)).not.toBe("LaterThisWeek");

            // yesterday is excluded from "LaterThisWeek" ensure it doesn't get added
            value = dts.currentDate.clone().subtract(1, 'days');
            expect(dts.getSectionKey(value)).not.toBe("LaterThisWeek");
        });

        it('should be earlier this week', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().endOf('week');// end of the week

            value = dts.currentDate.clone().subtract(2, 'days').startOf('day');
            expect(dts.getSectionKey(value)).toEqual("EarlierThisWeek");

            value = dts.currentDate.clone().startOf('week').add(1, 'seconds');
            expect(dts.getSectionKey(value)).toEqual("EarlierThisWeek");

            // tomorrow is excluded from "EarlierThisWeek" ensure it doesn't get added
            value = dts.currentDate.clone().add(1, 'days');
            expect(dts.getSectionKey(value)).not.toBe("EarlierThisWeek");

            // yesterday is excluded from "LaterThisWeek" ensure it doesn't get added
            value = dts.currentDate.clone().subtract(1, 'days');
            expect(dts.getSectionKey(value)).not.toBe("EarlierThisWeek");
        });

        it('should be next week', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().startOf('week');

            value = dts.currentDate.clone().add({weeks: 1, seconds: 1});
            expect(dts.getSectionKey(value)).toEqual("NextWeek");

            value = dts.currentDate.clone().add(1, 'weeks').endOf('week').subtract(1, 'seconds');
            expect(dts.getSectionKey(value)).toEqual("NextWeek");

            // Move to the end of the week, and check to ensure tomorrow doesn't show up as next week
            value = dts.currentDate.clone().add(1, 'days');
            dts.currentDate.endOf('week');
            expect(dts.getSectionKey(value)).not.toBe("NextWeek");
        });

        it('should be last week', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().startOf('week').add(2, 'days');

            value = dts.currentDate.clone().subtract({weeks: 1});
            expect(dts.getSectionKey(value)).toEqual("LastWeek");

            value = dts.currentDate.clone().subtract(1, 'weeks').startOf('week').add(1, 'seconds');
            expect(dts.getSectionKey(value)).toEqual("LastWeek");

            // Move to the start of the week, ensure yesterday doesn't end up in last week
            value = dts.currentDate.clone().subtract(1, 'days');
            dts.currentDate.startOf('week');
            expect(dts.getSectionKey(value)).not.toBe("LastWeek");

            // Move to the start of the year, ensure last week takes precedence over last year
            value = dts.currentDate.clone().startOf('year').add(1, 'week').add(2, 'days');
            dts.currentDate.startOf('week');
            expect(dts.getSectionKey(value)).not.toBe("LastWeek");
        });

        it('should be later this month', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().startOf('month').add(2, 'days');

            value = dts.currentDate.clone().endOf('month').subtract(1, 'second');
            expect(dts.getSectionKey(value)).toEqual("LaterThisMonth");
        });

        it('should be earlier this month', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().endOf('month').subtract(2, 'days');

            value = dts.currentDate.clone().startOf('month').add(1, 'second');
            expect(dts.getSectionKey(value)).toEqual("EarlierThisMonth");
        });

        it('should be next month', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().startOf('month').add(2, 'days');

            value = dts.currentDate.clone().startOf('month').add({months: 1, days: 1});
            expect(dts.getSectionKey(value)).toEqual("NextMonth");
        });

        it('should be last month', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().endOf('month').subtract(2, 'days');

            value = dts.currentDate.clone().startOf('month').subtract({months: 1}).add(1, 'second');
            expect(dts.getSectionKey(value)).toEqual("LastMonth");
        });

        it('should be earlier this year', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().month(5).startOf('month').add(2, 'days');

            value = dts.currentDate.clone().startOf('month').subtract({months: 1, days: 1});
            expect(dts.getSectionKey(value)).toEqual("EarlierThisYear");
        });

        it('should be later this year', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().startOf('year').endOf('month').subtract(2, 'days');

            value = dts.currentDate.clone().endOf('month').add({months: 1, days: 1});
            expect(dts.getSectionKey(value)).toEqual("LaterThisYear");
        });

        it('should be past year', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().month(5).endOf('month').subtract(2, 'days');

            value = dts.currentDate.clone().startOf('year').subtract({days: 1});
            expect(dts.getSectionKey(value)).toEqual("PastYear");

            // Check that last month takes precedent over past year
            dts.currentDate = dts.currentDate.clone().month(0).endOf('month').subtract(2, 'days');
            value = dts.currentDate.clone().startOf('year').subtract({days: 1});
            expect(dts.getSectionKey(value)).not.toEqual("PastYear");
        });

        it('should be next year', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().subtract(2, 'months');

            value = dts.currentDate.clone().endOf('year').add({months: 1});
            expect(dts.getSectionKey(value)).toEqual("NextYear");
        });

        it('should be future', function() {
            var dts = new DateTimeSection(), value;
            dts.currentDate = moment().subtract(2, 'months');

            value = dts.currentDate.clone().endOf('year').add({years: 1, months: 1});
            expect(dts.getSectionKey(value)).toEqual("Future");
        });
    });
});

