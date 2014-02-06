/*!
 * simplate-js v1.1
 * Copyright 2010, Michael Morton
 *
 * MIT Licensed - See LICENSE.txt
 */

 /**
 * @class Simplate
 *
 * Simplate is powerful javascript templating function that greatly expands upon the printf concept.
 * With a normal string substitution you define a format string with `$0` or `{0}` and pass in your
 * arguments to get placed in the same order – first argument to 0, second argument to 1 and so on.
 * Simplate takes this and says "Hey, this is javascript, everything is an object" and works upon
 * passing in an object and scope and allowing you to use the properties in a normal manner.
 *
 * But wait – there’s more! What if you want to run a little javascript here or there like a
 * conditional statement or quick loop? You can do that too! And Simplates within Simplates
 * within Simplates? Indeed, to your heart’s content.
 *
 * ###Define:
 *     var myTemplate = new Simplate( [ 'string', 'string', 'string'] );
 *
 * ###Usage:
 *     var content = myTemplate.apply(myObject, scope);
 *
 * ###Formatting Options:
 * `{%=   %}` – Evaluates contents and returns the result directly.
 *
 * `{%:   %}` – Evaluates contents and returns the result as HTML encoded.
 *
 * `{%!   %}` – Expects the contents to return a Simplate which is then applied with the same arguments as the current Simplate.
 *
 * `{%$   %}` – Same as `{%= %}` but is performed with a silent try/catch granting safe execution.
 *
 * `{%    %}` – Evaluates the contents as executable code
 *
 * Inside all Simplate formatters the `$` object refers to the passed in object and `$$` refers to the scope. You then use normal javascript dot notation to access the properties of `$` and `$$`.
 *
 * For a concrete example we want to create a list item for each item in a feed. Each item has a `$key` property and a `Description` property.
 *
 *     var rowTemplate = new Simplate([
 *         '<li data-key="{%= $.$key %}">{%: $.Description %}</li>'
 *     ]);
 *
 *     var feed = [
 *         {$key: 1, Description: "Row 1"},
 *         {$key: 2, Description: "Row 2"},
 *         {$key: 3, Description: "Row 3"}
 *     ]; // data from outside, array of objects with $key and Description
 *
 *     var listNode = document.createElement('ul');
 *     for (var i = 0; i < feed.length; i++)
 *     {
 *         var htmlString = rowTemplate.apply(feed[i], this);
 *         dojo.place(listNode, htmlString, 'last'); // converts HTML string to DOM
 *     }
 *
 *     // listNode may now be appended to document with all three rows
 *
 *
 * For a more in depth discussion including different ways of stating the contents please look
 * at the demo page at github:
 * [https://github.com/Saleslogix/simplate](https://github.com/Saleslogix/simplate)
 *
 */

/**
 * @method constructor
 * Creates a new Simplate object.
 * @param {String[]/String} template The string of text or an array of strings to be joined that act as the template in which values are to be injected.
 */

/**
 * @method make
 *
 * @return {String} Final string value with values injected.
 */

/**
 * @method apply
 *
 * @return {String} Final string value with values injected.
 */
(function() {
    var trimRE = /^\s+|\s+$/g,
        testRE = /(,)/,
        escQuoteRE = /'/g,
        escNewLineRE = /\n/g,
        entAmpRE = /&/g,
        entLtRE = /</g,
        entGtRE = />/g,
        entQuotRE = /"/g,
        cache = {},
        cacheRE = {},
        useCompatibleParser = ('is,ie'.split(testRE).length != 3),
        options = {
            cacheMarkup: true,
            tags: {
                begin: "{%",
                end: "%}"
            },
            allowWith: false
        },
        root = this;

    var mix = function(left, middle, right) {
        if (right) for (var rightProp in right) left[rightProp] = right[rightProp];
        if (middle) for (var middleProp in middle) left[middleProp] = middle[middleProp];
        return left;
    };

    var encode = function(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(entAmpRE, '&amp;')
            .replace(entLtRE, '&lt;')
            .replace(entGtRE, '&gt;')
            .replace(entQuotRE, '&quot;');
    };

    var escape = function(val) {
        return val
            .replace(escQuoteRE, '\\\'')
            .replace(escNewLineRE, '\\n');
    };

    var trim = function(val) {
        return val.replace(trimRE, '');
    };
        
    var parse = function(markup, o) {

        var tagBegin = o.tags.begin,
            tagEnd = o.tags.end,
            fragments = [],
            at = 0;

        if (!useCompatibleParser)
        {
            var key = tagBegin + tagEnd,
                regex = cacheRE[key] || (cacheRE[key] = new RegExp(tagBegin + '(.*?)' + tagEnd));
            
            fragments = markup.split(regex);
            return fragments;
        }

        var nextBegin = 0,
            nextEnd = 0,
            markers = [];

        while ((nextBegin = markup.indexOf(tagBegin, nextEnd)) != -1 &&
               (nextEnd = markup.indexOf(tagEnd, nextBegin)) != -1)
        {
            markers[markers.length] = nextBegin;
            markers[markers.length] = nextEnd;
        }

        for (var i = 0; i < markers.length; i++)
        {
            fragments[fragments.length] = markup.substr(at, markers[i] - at);
            at = markers[i] + ((i % 2) ? tagEnd.length : tagBegin.length);
        }

        fragments.push(markup.substr(at));

        return fragments;
    };

    var setCache = function(markup, fn) {
        cache[markup] = fn;
    };

    var getCache = function(markup) {
        return cache[markup];
    };

    var make = function(markup, o) {
        var mixedOptions, fragments, i, x, control, source, fn;

        mixedOptions = mix({}, o, options);

        if (markup.join) {
            markup = markup.join('');
        }

        if (mixedOptions.cacheMarkup && cache[markup]) {
            return cache[markup];
        }

        fragments = parse(markup, mixedOptions);

        /* code fragments */
        for (i = 1; i < fragments.length; i += 2) {
            if (fragments[i].length > 0) {
                control = fragments[i].charAt(0);
                source = fragments[i].substr(1);

                switch (control) {
                    case '=':
                        fragments[i] = '__results.push(' + source + ');';
                        break;
                    case ':':
                        fragments[i] = '__results.push(__simplate.encode(' + source + '));';
                        break;
                    case '!':
                        fragments[i] = '__results.push(' + trim(source) + '.apply(__data, __container));';
                        break;
                    default:
                        break;
                }
            }
        }

        for (x = 0; x < fragments.length; x += 2) {
            fragments[x] = '__results.push(\'' + escape(fragments[x]) + '\');';
        }

        fragments.unshift(
            'var __results = [], $ = __data, $$ = __container, __simplate = Simplate;',
            mixedOptions.allowWith ? 'with ($ || {}) {' : ''
        );

        fragments.push(
            mixedOptions.allowWith ? '}': '',
            'return __results.join(\'\');'
        );

        try
        {
            fn = new Function('__data, __container', fragments.join(''));
        }
        catch (e)
        {
            fn = function(values) { return e.message; };
        }

        if (mixedOptions.cacheMarkup) {
            cache[markup] = fn;
            return cache[markup];
        } else {
            return fn;
        }
    };

    var Simplate = function(markup, o) {
        this.fn = make(markup, o);
    };

    mix(Simplate, {
        options: options,
        encode: encode,
        make: make,
        setCache: setCache,
        getCache: getCache
    });

    mix(Simplate.prototype, {
        apply: function(data, container) {
            return this.fn.call(container || this, data, container || data);
        }
    });

    if (typeof exports !== 'undefined') {
        // Server
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Simplate;
        }

        exports.Simplate = Simplate;
    } else {
        // Browser (use AMD if avail)
        if (typeof define === 'function' && define.amd) {
            define('Simplate', [], function() {
                return Simplate;
            });
        }
    }

    root.Simplate = Simplate;
})();
