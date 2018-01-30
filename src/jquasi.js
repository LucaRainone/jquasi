define("jquasi", [], function () {

    function buildArrayFrom(el) {
        var ret = [];
        for(var i = 0; i < el.length; i++) ret.push(el[i]);
        return ret;
    }

    var doc = document;

    var jquasi = function () {

        var data, i;

        if (this instanceof jquasi) {
            data = arguments[0];

            this.data = "push" in data? data : [data];

            for (i = 0; i < this.data.length; i++)
                this[i] = this.data[i];

            this.length = this.data.length;

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
        if (arg1 instanceof HTMLElement) {
            return new jquasi(arg1);
        }

        if(typeof arg1 === 'function') {
            if (doc.attachEvent ? doc.readyState === "complete" : doc.readyState !== "loading"){
                arg1();
            } else {
                doc.addEventListener('DOMContentLoaded', arg1);
            }
        }

        // jQuery like object
        if (arg1.hasOwnProperty("length")) {

            return new jquasi(buildArrayFrom(arg1));
        }

    };

    jquasi.fn =jquasi.prototype;

    jquasi.fn.each = function (cbk) {
        for (var i = 0; i < this.data.length; i++) {
            cbk.apply(this.data[i], [i]);
        }
        return this;
    };

    jquasi.fn.addClass    = function (className) {
        this.each(function () {
            this.className += " " + className + " ";
            this.className = this.className.trim();
        });
        return this;
    };
    jquasi.fn.removeClass = function (className) {
        this.each(function () {
            var currentClassname = " " + this.className.split(" ").join("  ") + " ";
            this.className       = (currentClassname.split(" " + className + " ").join("  ").split("  ").join(" ")).trim();
            if (this.className === "") {
                this.removeAttribute("class");
            }
        });
        return this;
    };

    jquasi.fn.hasClass = function(className) {
          return this.data.length? this.data[0].className.match(new RegExp(className.split("-").join('\\-'))) : false;
    };


    jquasi.fn.toggleClass = function(className) {
        return this.each(function() {
            var $this = jquasi(this);
            $this.hasClass(className)? $this.removeClass(className) : $this.addClass(className);
        });
    };

    jquasi.fn.attr = function (attrName, attrValue) {
        if (attrValue === undefined) {
            return this.data[0].getAttribute(attrName);
        }
        this.each(function () {
            this.setAttribute(attrName, attrValue);
        });

        return this;
    };

    jquasi.fn.html = function (a) {
        if (a === undefined) {
            return this.data[0].innerHTML;
        }
        return this.each(function() {
            this.innerHTML = a;
        });

    };

    jquasi.fn.append = function (a) {
        a = a instanceof jquasi ? a.get(0) : a;
        this.data[0].appendChild(a);
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
        return index>=0? this.data[index] : this.data[this.data.length+index];
    };

    var _buildEvent = function (ev) {
        return {
            originalEvent   : ev,
            preventDefault  : function() {ev.preventDefault()},
            stopPropagation : function() {ev.stopPropagation()},
            altKey          : ev.altKey,
            shiftKey        : ev.shiftKey,
            ctrlKey         : ev.ctrlKey
        }
    };

    jquasi.fn.on = function (eventName, elOrCallback, callback) {
        var elementString;

        if (typeof elOrCallback === 'function') {
            callback = elOrCallback;
        } else {
            elementString = elOrCallback;
        }
        if (elementString === undefined) {
            this.each(function () {
                this.addEventListener(eventName, function (ev) {
                    if(callback.apply(this, [_buildEvent(ev)]) === false) {
                        ev.stopPropagation();
                        ev.preventDefault();
                    }
                });
            });
        } else {

            this.each(function () {
                this.addEventListener(eventName, function (ev) {
                    var $els = jquasi(this).find(elementString);
                    var els  = [];
                    $els.each(function () {
                        els.push(this);
                    });
                    var currentEl = ev.target;

                    while (currentEl) {

                        if (els.indexOf(currentEl) !== -1) {
                            if(callback.apply(currentEl, [_buildEvent(ev)]) === false) {
                                ev.stopPropagation();
                                ev.preventDefault();
                            }
                            break;
                        }

                        if (currentEl === this || currentEl === doc.body) {
                            break;
                        }
                        currentEl = currentEl.parentNode;
                    }
                });
            });
        }
        return this;
    };

    jquasi.fn.parent = function () {
        return jquasi(this[0].parentNode)
    };

    return jquasi;
});