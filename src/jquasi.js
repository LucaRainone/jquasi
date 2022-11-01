define("jquasi", [], function () {

    function buildArrayFrom(el) {
        let ret = [];
        forEachAndFilter(el, function (el) {ret.push(el)});
        return ret;
    }

    function forEachAndFilter(el, cbk) {
        for (let i = 0; i < el.length; i++) {
            if (cbk(el[i]) === false) {
                el.splice(i, 1);
                i--;
            }
        }
    }

    let doc = document;
    let _id = 1;
    let objectId = function (obj) {
        return obj.jquasi || (obj.jquasi = _id++);
    };

    let jquasi = function () {

        let data, i;

        if (this instanceof jquasi) {
            data = arguments[0];

            data = "push" in data ? data : [data];

            for (i = 0; i < data.length; i++)
                this[i] = data[i];

            this.length = data.length;

            return;
        }
        let arg1 = arguments[0];

        if (arg1 instanceof jquasi)
            return $(buildArrayFrom(arg1));

        if (typeof arg1 === "string") {
            arg1 = arg1.trim();
            if (arg1.substring(0, 1) === "<") {
                let tag = arg1.substring(1, arg1.indexOf("/"));
                return new jquasi(doc.createElement(tag.toUpperCase()));
            } else {

                return new jquasi(buildArrayFrom(doc.querySelectorAll(arg1)));
            }
        }

        if (arg1 instanceof HTMLElement)
            return new jquasi(arg1);

        if (typeof arg1 === 'function') {
            if (doc.attachEvent ? doc.readyState === "complete" : doc.readyState !== "loading") {
                arg1();
            } else {
                doc.addEventListener('DOMContentLoaded', arg1);
            }
        }

        // jQuery-like object
        if (arg1.hasOwnProperty("length"))
            return new jquasi(buildArrayFrom(arg1));

    };

    jquasi.fn = jquasi.prototype;

    jquasi.fn.each = function (cbk) {

        for (let i = 0; i < this.length; i++)
            cbk.apply(this[i], [i, this[i]]);

        return this;
    };

    jquasi.fn.addClass = function (className) {
        this.each(function () {
            this.className = (this.className + " " + className + " ").trim();
        });
        return this;
    };

    jquasi.fn.removeClass = function (className) {
        this.each(function () {

            this.className = this.className.replace(new RegExp('(^|\\b)' + className.replace(/\s+/g, '|') + '(\\b|$)', 'gi'), ' ').trim();

        });
        return this;
    };

    jquasi.fn.hasClass = function (className) {
        return this.length ? this[0].className.match(new RegExp(className.split("-").join('\\-'))) : false;
    };


    jquasi.fn.toggleClass = function (className) {
        return this.each(function () {
            let $this = jquasi(this);
            $this.hasClass(className) ? $this.removeClass(className) : $this.addClass(className);
        });
    };

    jquasi.fn.attr = function (attrName, attrValue) {

        if (attrValue === undefined) {
            let attrValue = this[0].getAttribute(attrName);
            // for jquery compatibility
            return attrValue === null? undefined : attrValue;
        }
        this.each(function () {
            this.setAttribute(attrName, attrValue);
        });

        return this;
    };

    jquasi.fn.removeAttr = function(attrName) {
        this.each(function() {
            this.removeAttribute(attrName);
        });
        return this;
    };

    jquasi.fn.html = function (content) {

        if (content === undefined)
            return this[0].innerHTML;

        return this.each(function () {
            this.innerHTML = content;
            // js is not executed natively as jquery does
            $(this).find('script').each(function() {
                let cloned = $('<script/>')[0]
                cloned.text = this.innerHTML;
                let i = -1, attrs = this.attributes, attr;
                while ( ++i < attrs.length ) {
                    cloned.setAttribute( (attr = attrs[i]).name, attr.value );
                }
                $(this).parent()[0].replaceChild(cloned, this);
            })
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

    jquasi.fn.remove = function () {
        return this.each(function () {
            this.parentNode && this.parentNode.removeChild(this);
        });
    };

    jquasi.fn.empty = function () {
        return this.each(function () {
            this.innerHTML = "";
        });
    };

    jquasi.fn.find = function (a) {
        let data = [];
        this.each(function () {
            data = data.concat(buildArrayFrom(this.querySelectorAll(a)));
        });
        return new jquasi(data);
    };

    jquasi.fn.get = function (index) {
        return index >= 0 ? this[index] : this[this.length + index];
    };

    let _buildEvent = function (ev) {
        return {
            originalEvent: ev,
            preventDefault: function () {
                ev.preventDefault()
            },
            stopPropagation: function () {
                ev.stopPropagation();
                let id = objectId(ev.currentTarget);
                memPropagation[id] = 1;
                setTimeout(function () {
                    memPropagation[id] = 0;
                })
            },
            altKey: ev.altKey,
            shiftKey: ev.shiftKey,
            ctrlKey: ev.ctrlKey
        }
    };

    let memPropagation = {};
    let memNsEvents = {};
    let _getNamespaceEvent = function (str) {
        return str ? str.split(".", 2) : [undefined];
    };
    jquasi.fn.on = function (eventName, elOrCallback, callback) {

        let evNs = _getNamespaceEvent(eventName), elementString;
        let namespace = evNs[1] || "";

        eventName = evNs[0];

        if (typeof elOrCallback === 'function')
            callback = elOrCallback;
        else
            elementString = elOrCallback;

        let callAndCheckPropagationAndDefault = function (el, ev) {
            // in callback, return false means both stopPropagation and preventDefault
            if (callback.call(el, _buildEvent(ev)) === false) {
                ev.stopPropagation();
                ev.preventDefault();
            }
        };

        if (elementString === undefined) {
            this.each(function () {
                let objId = objectId(this), _listener;
                _listener = function (ev) {
                    callAndCheckPropagationAndDefault(this, ev);
                };

                if (!memNsEvents[objId]) memNsEvents[objId] = {};
                if (!memNsEvents[objId][eventName]) memNsEvents[objId][eventName] = [];
                memNsEvents[objId][eventName].push([namespace, callback, _listener, elementString]);
                this.addEventListener(eventName, _listener);
            });
        } else {

            this.each(function () {
                let _listener = function (ev) {
                    if (memPropagation[objectId(this)]) return;
                    let $els = jquasi(this).find(elementString);
                    let els = buildArrayFrom($els);
                    let currentEl = ev.target;

                    while (currentEl) {

                        if (els.indexOf(currentEl) !== -1) {
                            callAndCheckPropagationAndDefault(currentEl, ev);
                            break;
                        }

                        if (currentEl === this || currentEl === doc.body) {
                            break;
                        }

                        currentEl = currentEl.parentNode;
                    }
                };
                let objId = objectId(this);
                if (!memNsEvents[objId]) memNsEvents[objId] = {};
                if (!memNsEvents[objId][eventName]) memNsEvents[objId][eventName] = [];
                memNsEvents[objId][eventName].push([namespace, callback, _listener, elementString]);
                this.addEventListener(eventName, _listener, true); // use capture
            });
        }
        return this;
    };

    jquasi.fn.off = function (eventName, elOrCallback, callback) {
        let listeners;
        let evNs = _getNamespaceEvent(eventName), elementString;
        let namespace = evNs[1] || "";

        eventName = evNs[0];

        if (typeof elOrCallback === 'function')
            callback = elOrCallback;
        else
            elementString = elOrCallback;

        let _check = function (namespace, listener, elementString) {
            return (!namespace || namespace === listener[0]) && (!elementString || elementString === listener[3] || elementString === "**");
        };

        return this.each(function () {
            let el = this;
            let objId = objectId(this);

            if (!memNsEvents[objId])
                return;

            if (callback) {

                if ((listeners = memNsEvents[objId][eventName])) {
                    forEachAndFilter(listeners, function (listener) {
                        if (listener[1] === callback && elementString === listener[3]) {
                            el.removeEventListener(eventName, listener[2], !!elementString);
                            return false;
                        }
                    });
                }

            } else {

                if (!eventName) {
                    for (let evName in memNsEvents[objId]) {

                        forEachAndFilter(memNsEvents[objId][evName], function (listener) {
                            if (_check(namespace, listener, elementString)) {
                                el.removeEventListener(evName, listener[2], !!listener[3]);
                                return false;
                            }
                        });

                    }
                } else if ((listeners = memNsEvents[objId][eventName])) {
                    forEachAndFilter(listeners, function (listener) {
                        if (_check(namespace, listener, elementString)) {
                            el.removeEventListener(eventName, listener[2], !!listener[3]);
                            return false;
                        }
                    });
                }

            }

        });

    };

    jquasi.fn.parent = function () {
        return jquasi(this[0].parentNode)
    };

    jquasi.fn.css = function(attr, value) {
        return this.each(function() {
            this.style[attr] = value;
        });
    }

    return jquasi;
});