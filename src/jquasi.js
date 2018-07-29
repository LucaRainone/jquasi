define("jquasi", [], function () {

    function buildArrayFrom(el) {
        var ret= [];
        forEach(el, ret.push.bind(ret));
        return ret;
    }

    function forEach(el, cbk) {
        for(var i = 0; i < el.length; i++) cbk(el[i]);
    }

    var doc = document;
    var _id = 1;
    var objectId = function(obj) {
        return obj.jquasi || (obj.jquasi = _id++);
    };

    var jquasi = function () {

        var data, i;

        if (this instanceof jquasi) {
            data = arguments[0];

            data = "push" in data? data : [data];

            for (i = 0; i < data.length; i++)
                this[i] = data[i];

            this.length = data.length;

            return;
        }
        var arg1 = arguments[0];

        if (arg1 instanceof jquasi)
            return $(buildArrayFrom(arg1));

        if (typeof arg1 === "string") {
            arg1 = arg1.trim();
            if (arg1.substr(0, 1) === "<") {
                var tag = arg1.substr(1, arg1.indexOf("/") - 1);
                return new jquasi(doc.createElement(tag.toUpperCase()));
            } else {

                return new jquasi(buildArrayFrom(doc.querySelectorAll(arg1)));
            }
        }

        if (arg1 instanceof HTMLElement)
            return new jquasi(arg1);

        if(typeof arg1 === 'function') {
            if (doc.attachEvent ? doc.readyState === "complete" : doc.readyState !== "loading"){
                arg1();
            } else {
                doc.addEventListener('DOMContentLoaded', arg1);
            }
        }

        // jQuery-like object
        if (arg1.hasOwnProperty("length"))
            return new jquasi(buildArrayFrom(arg1));

    };

    jquasi.fn =jquasi.prototype;

    jquasi.fn.each = function (cbk) {

        for (var i = 0; i < this.length; i++)
            cbk.apply(this[i], [i]);

        return this;
    };

    jquasi.fn.addClass    = function (className) {
        this.each(function () {
            this.className = ( this.className+ " " + className + " ").trim();
        });
        return this;
    };

    jquasi.fn.removeClass = function (className) {
        this.each(function () {

            this.className = this.className.replace(new RegExp('(^|\\b)' + className.replace(/\s+/g,'|') + '(\\b|$)', 'gi'), ' ').trim();

        });
        return this;
    };

    jquasi.fn.hasClass = function(className) {
          return this.length? this[0].className.match(new RegExp(className.split("-").join('\\-'))) : false;
    };


    jquasi.fn.toggleClass = function(className) {
        return this.each(function() {
            var $this = jquasi(this);
            $this.hasClass(className)? $this.removeClass(className) : $this.addClass(className);
        });
    };

    jquasi.fn.attr = function (attrName, attrValue) {

        if (attrValue === undefined)
            return this[0].getAttribute(attrName);

        this.each(function () {
            this.setAttribute(attrName, attrValue);
        });

        return this;
    };

    jquasi.fn.html = function (a) {

        if (a === undefined)
            return this[0].innerHTML;

        return this.each(function() {
            this.innerHTML = a;
        });

    };

    jquasi.fn.append = function (a) {
        a = a instanceof jquasi ? a.get(0) : a;
        this[0].appendChild(a);
        return this;
    };

    jquasi.fn.clone = function () {
        return new jquasi(this.get(0).cloneNode(true));
    };

    jquasi.fn.remove = function() {
        return this.each(function() {
            this.parentNode && this.parentNode.removeChild(this);
        });
    };

    jquasi.fn.empty = function () {
        return this.each(function () {
            this.innerHTML = "";
        });
    };

    jquasi.fn.find = function (a) {
        var data = [];
        this.each(function () {
            data = data.concat(buildArrayFrom(this.querySelectorAll(a)));
        });
        return new jquasi(data);
    };

    jquasi.fn.get = function (index) {
        return index>=0? this[index] : this[this.length+index];
    };

    var _buildEvent = function (ev) {
        return {
            originalEvent   : ev,
            preventDefault  : function() {ev.preventDefault()},
            stopPropagation : function() {
                ev.stopPropagation();
                var id = objectId(ev.currentTarget);
                memPropagation[id] = 1;
                setTimeout(function() {
                    memPropagation[id] = 0;
                })
            },
            altKey          : ev.altKey,
            shiftKey        : ev.shiftKey,
            ctrlKey         : ev.ctrlKey
        }
    };

    var memPropagation = {};
    var memNsEvents = {};
    var _getNamespaceEvent = function(str) {
        return str.split(".",2);
    };
    jquasi.fn.on = function (eventName, elOrCallback, callback) {

        var evNs = _getNamespaceEvent(eventName), elementString;
        var namespace = evNs[1] || "";

        eventName = evNs[0];

        if (typeof elOrCallback === 'function')
            callback = elOrCallback;
        else
            elementString = elOrCallback;

        var callAndCheckPropagationAndDefault = function(el, ev) {
            // in callback, return false means both stopPropagation and preventDefault
            if(callback.call(el, _buildEvent(ev)) === false) {
                ev.stopPropagation();
                ev.preventDefault();
            }
        };

        if (elementString === undefined) {
            this.each(function () {
                var objId = objectId(this), _listener;
                _listener =  function (ev) {
                    callAndCheckPropagationAndDefault(this,ev);
                };

                if(!memNsEvents[objId]) memNsEvents[objId] = {};
                if(!memNsEvents[objId][eventName]) memNsEvents[objId][eventName] = [];
                memNsEvents[objId][eventName].push([namespace, callback, _listener, elementString]);
                this.addEventListener(eventName,_listener);
            });
        } else {

            this.each(function () {
                var _listener = function (ev) {
                    if(memPropagation[objectId(this)]) return ;
                    var $els = jquasi(this).find(elementString);
                    var els  = buildArrayFrom($els);
                    var currentEl = ev.target;

                    while (currentEl) {

                        if (els.indexOf(currentEl) !== -1) {
                            callAndCheckPropagationAndDefault(currentEl,ev);
                            break;
                        }

                        if (currentEl === this || currentEl === doc.body) {
                            break;
                        }

                        currentEl = currentEl.parentNode;
                    }
                };
                var objId = objectId(this);
                if(!memNsEvents[objId]) memNsEvents[objId] = {};
                if(!memNsEvents[objId][eventName]) memNsEvents[objId][eventName] = [];
                memNsEvents[objId][eventName].push([namespace, callback, _listener, elementString]);
                this.addEventListener(eventName, _listener, true); // use capture
            });
        }
        return this;
    };

    jquasi.fn.off = function(eventName, elOrCallback, callback) {
        var listeners;
        var evNs = _getNamespaceEvent(eventName), elementString;
        var namespace = evNs[1] || "";

        eventName = evNs[0];

        if (typeof elOrCallback === 'function')
            callback = elOrCallback;
        else
            elementString = elOrCallback;

        return this.each(function() {
            var el = this;
            var objId = objectId(this);

            if(!memNsEvents[objId])
                return ;

            if(callback) {

                if((listeners = memNsEvents[objId][eventName])) {
                    forEach(listeners, function(listener) {
                        if(listener[1] === callback && elementString === listener[3]) {
                            el.removeEventListener(eventName, listener[2], !!elementString);
                        }
                    });
                }

            } else {

                if((listeners = memNsEvents[objId][eventName])) {
                    forEach(listeners, function(listener) {
                        if(namespace === listener[0] && elementString === listener[3]) {
                            el.removeEventListener(eventName, listener[2], !!elementString);
                        }
                    });
                }

            }
        })
    };

    jquasi.fn.parent = function () {
        return jquasi(this[0].parentNode)
    };

    return jquasi;
});