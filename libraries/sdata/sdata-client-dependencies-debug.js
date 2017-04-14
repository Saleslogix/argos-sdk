/*!
 * 
 */
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
window.Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
};// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

window.parseUri = function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

window.parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};
// The Top-Level Namespace
/*global Sage $ alert*/
window.Sage = (function() {
    var apply = function(a, b, c)
    {
        if (a && c) for (var n in c) a[n] = c[n];
        if (a && b) for (var n in b) a[n] = b[n];
        return a;
    };
    var namespace = function(name, scope)
    {
        var parts = name.split('.');
        var o = scope || (parts[0] !== 'Sage' ? this : window);
        for (var i = 0; i < parts.length; i++) o = (o[parts[i]] = o[parts[i]] || {__namespace: true});
        return o;
    };
    var iter = function(o, cb, scope)
    {
        if (isArray(o))
        {
            var l = o.length;
            for (var i = 0; i < l; i++)
                cb.call(scope || o[i], i, o[i]);
        }
        else
            for (var n in o)
                if (o.hasOwnProperty(n))
                    cb.call(scope || o[n], n, o[n]);
    };
    var isArray = function(o)
    {
        return Object.prototype.toString.call(o) == '[object Array]';
    };
    return {
        config: {
            win: window || {},
            doc: document
        },
        apply: apply,
        namespace: namespace,
        each: iter,
        isArray: isArray,
        __namespace: true
    };
}());
/*
    Make a new Class:
    var Person = Sage.Class.define({
		constructor: function(str) {
	    	this.name = str;
		},
		iAm: function() {
	    	return this.name;
		}
	});

	To create a class which inherits from an already existing one
	just call the already-existing class' extend() method: **
	var Knight = Person.extend({
		iAm: function() {
			return 'Sir ' + this.base();
		},
		joust: function() {
		    return 'Yaaaaaa!';
		}
	});
	Notice the Knight's iAm() method has access to it's 'super'
	via this.base();

	** differs from the Ext method of having to pass in the parent,
	** ours defines the extend() method directly on every defined class
*/
/*global Sage $ alert*/
if(window.Sage) {
    (function(S) {
        var INITIALIZING = false,
            // straight outta base2
            OVERRIDE = /xyz/.test(function(){xyz;}) ? /\bbase\b/ : /.*/;

        // The base Class placeholder
        S.Class = function(){};
        // Create a new Class that inherits from this class
        S.Class.define = function define(prop) {
            var base = this.prototype;
            // Instantiate a base class (but only create the instance)
            INITIALIZING = true;
            var prototype = new this();
            INITIALIZING = false;

            var wrap = function(name, fn) {
                return function() {
                    var tmp = this.base;
                    // Add a new .base() method that is the same method
                    // but on the base class
                    this.base = base[name];
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this.base = tmp;
                    return ret;
                };
            };

            // Copy the properties over onto the new prototype
            var hidden = ['constructor'],
                i = 0,
                name;

            for (name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] === "function" &&
                typeof base[name] === "function" &&
                OVERRIDE.test(prop[name]) ? wrap(name, prop[name]) : prop[name];
            }

            while (name = hidden[i++])
                if (prop[name] != base[name])
                    prototype[name] = typeof prop[name] === "function" &&
                        typeof base[name] === "function" &&
                        OVERRIDE.test(prop[name]) ? wrap(name, prop[name]) : prop[name];

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the initialize method
                if ( !INITIALIZING && this.constructor ) {
                    this.constructor.apply(this, arguments);
                }
            }
            // Populate the constructed prototype object
            Class.prototype = prototype;
            // Enforce the constructor to be what we expect
            Class.constructor = Class;
            // And make this class 'define-able'
            Class.define = define;
            Class.extend = Class.define; // sounds better for inherited classes
            return Class;
        };
    }(window.Sage));
}
/*global Sage $ alert*/
if(window.Sage) {
    (function(S) {
        // place the Deferred class into Sage.Utility
        S.namespace('Utility');

        S.Utility.Deferred = function(fn, args, scope) {
            var that = this, id,
            c = function() {
                clearInterval(id);
                id = null;
                fn.apply(scope, args || []);
            };
            that.delay = function(n) {
                that.cancel();
                // an named interval that can be cancelled
                id = setInterval(c, n);
            };
            that.cancel = function() {
                if(id) {
                    clearInterval(id);
                    id = null;
                }
            };
        };
    }(window.Sage));
}
// Event class is instantiated by the Evented class. Probably no need
// to call this directly

/*global Sage $ alert*/
if(window.Sage) {
    (function(S) {
        var SLICE = Array.prototype.slice,
            TRUE = true, FALSE = false,
            WIN = S.config.win,
            TARGETED = function(f,o,scope) {
                return function() {
                    if(o.target === arguments[0]){
                        f.apply(scope, SLICE.call(arguments, 0));
                    }
                };
            },
            BUFFERED = function(f,o,l,scope) {
                l.task = new S.Utility.Deferred();
                return function(){
                    l.task.delay(o.buffer, f, scope, SLICE.call(arguments, 0));
                };
            },
            SINGLE = function(f,ev,fn,scope) {
                return function(){
                    ev.removeListener(fn, scope);
                    return f.apply(scope, arguments);
                };
            },
            DELAYED = function(f,o,l,scope) {
                return function() {
                    var task = new S.Utility.Deferred();
                    if(!l.tasks) {
                        l.tasks = [];
                    }
                    l.tasks.push(task);
                    task.delay(o.delay || 10, f, scope, SLICE.call(arguments, 0));
                };
            };
        // place the Event class in Utility
        S.namespace('Utility');

        S.Utility.Event = Sage.Class.define({
            constructor: function(obj, name) {
                this.name = name;
                this.obj = obj;
                this.listeners = [];
            },
            addListener: function(fn, scope, options){
                var that = this,l;
                scope = scope || that.obj;
                if(!that.isListening(fn, scope)) {
                    l = that.createListener(fn, scope, options);
                    if(that.firing) {
                        that.listeners = that.listeners.slice(0);
                    }
                    that.listeners.push(l);
                }
            },
            createListener: function(fn, scope, o) {
                o = o || {};
                scope = scope || this.obj;
                var l = {
                    fn: fn,
                    scope: scope,
                    options: o
                }, h = fn;
                if(o.target){
                    h = TARGETED(h, o, scope);
                }
                if(o.delay){
                    h = DELAYED(h, o, l, scope);
                }
                if(o.single){
                    h = SINGLE(h, this, fn, scope);
                }
                if(o.buffer){
                    h = BUFFERED(h, o, l, scope);
                }
                l.fireFn = h;
                return l;
            },
            findListener: function(fn, scope){
                var list = this.listeners,
                i = list.length,l;
                scope = scope || this.obj;
                while(i--) {
                    l = list[i];
                    if(l) {
                        if(l.fn === fn && l.scope === scope){
                            return i;
                        }
                    }
                }
                return -1;
            },
            isListening: function(fn, scope){
                return this.findListener(fn, scope) !== -1;
            },
            removeListener: function(fn, scope){
                var that = this, index, l, k,
                result = FALSE;
                if((index = that.findListener(fn, scope)) !== -1) {
                    if (that.firing) {
                        that.listeners = that.listeners.slice(0);
                    }
                    l = that.listeners[index];
                    if(l.task) {
                        l.task.cancel();
                        delete l.task;
                    }
                    k = l.tasks && l.tasks.length;
                    if(k) {
                        while(k--) {
                            l.tasks[k].cancel();
                        }
                        delete l.tasks;
                    }
                    that.listeners.splice(index, 1);
                    result = TRUE;
                }
                return result;
            },
            // Iterate to stop any buffered/delayed events
            clearListeners: function() {
                var that = this,
                l = that.listeners,
                i = l.length;
                while(i--) {
                    that.removeListener(l[i].fn, l[i].scope);
                }
            },
            fire: function(){
                var that = this,
                listeners = that.listeners,
                len = listeners.length,
                i = 0, l, args;
                if(len > 0) {
                    that.firing = TRUE;
                    args = SLICE.call(arguments, 0);
                    for (; i < len; i++) {
                        l = listeners[i];
                        if(l && l.fireFn.apply(l.scope || that.obj || 
                            WIN, args) === FALSE) {
                            return (that.firing = FALSE);
                        }
                    }
                }
                that.firing = FALSE;
                return TRUE;
            }
        }); // end S.Event class
    }(window.Sage));
}
/*
    var Employee = Sage.Evented.extend({
        constructor: function(c) {
            this.name = c.name;
            this.events = {
                quit: true
            };
            this.base(c);
        }
    });

    var Dev = new Employee({
        name: "Rob",
        listeners: {
            quit: function() {console.log(this.name + ' has quit!'); }
        }
    });
*/

/*global Sage $ alert*/
if(window.Sage) {
    (function(S) {
        var SLICE = Array.prototype.slice,
            TRUE = true, FALSE = false,
            // do not include these
            FILTER = /^(?:scope|delay|buffer|single)$/,
            EACH = S.each;

        S.Evented = S.Class.define({
            constructor: function(config) {
                var that = this,
                e = that.events;
                if(config && config.listeners) {
                    that.addListener(config.listeners);
                }
                that.events = e || {};
            },
            fireEvent: function() {
                var that = this,
                args = SLICE.call(arguments, 0),
                eventName = args[0].toLowerCase(),
                result = TRUE,
                current = this.events[eventName],
                b,c,
                q = that.eventQueue || [];
                // TODO: evaluate use of deferring events
                if (that.eventsSuspended === TRUE) {
                    q.push(args);
                }
                if (typeof current === 'object') {
                    if(current.bubble) {
                        if(current.fire.apply(current, args.slice(1)) === FALSE) {
                            return FALSE;
                        }
                        b = that.getBubbleTarget && that.getBubbleTarget();
                        if(b && b.enableBubble) {
                            c = b.events[eventName];
                            if(!c || typeof c !== 'object' || !c.bubble) {
                                b.enableBubble(eventName);
                            }
                            return b.fireEvent.apply(b, args);
                        }
                    } else {
                        // remove the event name
                        args.shift();
                        result = current.fire.apply(current, args);
                    }
                }
                return result;
            },
            addListener : function(eventName, fn, scope, o){
                var that = this, e, oe, ce;
                if (typeof eventName === 'object') {
                    o = eventName;
                    for (e in o){
                        oe = o[e];
                        if (!FILTER.test(e)) {
                            that.addListener(e, oe.fn || oe, oe.scope ||
                                o.scope, oe.fn ? oe : o);
                        }
                    }
                } else {
                    eventName = eventName.toLowerCase();
                    ce = that.events[eventName] || TRUE;
                    if (typeof ce === 'boolean') {
                        that.events[eventName] = ce = new S.Utility.Event(that, eventName);
                    }
                    ce.addListener(fn, scope, typeof o === 'object' ? o : {});
                }
            },
            removeListener : function(eventName, fn, scope) {
                var ce = this.events[eventName.toLowerCase()];
                if (typeof ce === 'object') {
                    ce.removeListener(fn, scope);
                }
            },
            purgeListeners : function(){
                var events = this.events,evt,key;
                for(key in events) {
                    evt = events[key];
                    if(typeof evt === 'object') {
                        evt.clearListeners();
                    }
                }
            },
            addEvents : function(o){
                var that = this, arg, i;
                that.events = that.events || {};
                if (typeof o === 'string') {
                    arg = arguments;
                    i = arg.length;
                    while(i--) {
                        that.events[arg[i]] = that.events[arg[i]] || TRUE;
                    }
                } else {
                    Sage.apply(that.events, o);
                }
            },
            hasListener : function(eventName){
                var e = this.events[eventName.toLowerCase()];
                return typeof e === 'object' && e.listeners.length > 0;
            },
            suspendEvents : function(queueSuspended){
                this.eventsSuspended = TRUE;
                if(queueSuspended && !this.eventQueue){
                    this.eventQueue = [];
                }
            },
            resumeEvents : function(){
                var that = this,
                queued = that.eventQueue || [];
                that.eventsSuspended = FALSE;
                delete that.eventQueue;
                // use jquery's each method
                EACH(queued, function(e) {
                    that.fireEvent.apply(that, e);
                });
            }
        }); //end S.Evented

        S.Evented.prototype.on = S.Evented.prototype.addListener;
        S.Evented.prototype.un = S.Evented.prototype.removeListener;
    }(window.Sage));
}
