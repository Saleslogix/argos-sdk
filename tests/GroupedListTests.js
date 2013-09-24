define('tests/GroupedListTests', ['dojo/query','dojo/dom-class', 'dojo/text!./feeds/GroupListFeed.json', 'Sage/Platform/Mobile/GroupedList'], function(query, domClass, jsonFeed, GroupedList) {
return describe('Sage.Platform.Mobile.GroupedList', function() {

    var list = new GroupedList();
    beforeEach(function() {
        list.destroy();
        list = new GroupedList();
    });


    it('Can return base group tag', function() {
        var group = list.getGroupForEntry(null);

        expect(group.tag).toEqual(1);
        expect(group.title).toEqual('Default');
    });

    it('Can added collapsed class to untoggled node', function() {
        var node = document.createElement('div');
        list.toggleGroup({$source: node});

        expect(domClass.contains(node, 'collapsed')).toEqual(true);
    });
    it('Can remove collapsed class from toggled node', function() {
        var node = document.createElement('div');

        domClass.add(node, 'collapsed');

        list.toggleGroup({$source: node});

        expect(domClass.contains(node, 'collapsed')).toEqual(false);
    });

    it('Can construct list items from feed', function() {
        var feed = JSON.parse(jsonFeed);

        list.processFeed(feed);

        expect(query('> ul > li', list.contentNode).length).toEqual(feed['$totalResults']);
    });

    it('Can split list items into groups', function() {
        var feed = JSON.parse(jsonFeed);

        list.getGroupForEntry = function(entry) {
            return {
                tag: entry.view ? 0 : 1,
                title: entry.view ? 'Views' : 'Actions'
            }
        };

        list.processFeed(feed);

        expect(query('> ul', list.contentNode).length).toEqual(2);
    });


});
});
