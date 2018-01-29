define("jquasi", [], function () {

    var jquasi = function () {
        var data, i;
        if (this instanceof jquasi) {
            data = arguments[0];
            if ('push' in data) {
                this.data = data;
            } else {
                this.data = [data];
            }
            for (i = 0; i < this.data.length; i++) {
                this[i] = this.data[i];
            }
            this.length = this.data.length;
            return;
        }
        var a = arguments[0];

        if (a instanceof jquasi) {
            var ret = [];
            a.each(function() {
                ret.push(this);
            });
            return $(ret);
        }
        if (typeof a === "string") {
            a = a.trim();
            if (a.substr(0, 1) === "<") {
                var tag = a.substr(1, a.indexOf("/") - 1);
                var el  = document.createElement(tag.toUpperCase());
                return new jquasi(el);
            } else {
                data    = [];
                var nls = document.querySelectorAll(a);
                for (i = 0; i < nls.length; i++) {
                    data.push(nls[i]);
                }
                return new jquasi(data);
            }
        }
        if (a instanceof HTMLElement) {
            return new jquasi(a);
        }

        if(typeof a === 'function') {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
                a();
            } else {
                document.addEventListener('DOMContentLoaded', a);
            }
        }

        // jQuery like object
        if (a.hasOwnProperty("length")) {
            var els = [];
            for(i = 0; i < a.length; i++) {
                els.push(a[i]);

            }
            return new jquasi(els);
        }

    };

    jquasi.prototype.each = function (cbk) {
        for (var i = 0; i < this.data.length; i++) {
            cbk.apply(this.data[i], [i]);
        }
    };

    jquasi.prototype.addClass    = function (className) {
        this.each(function () {
            this.className += " " + className + " ";
            this.className = this.className.trim();
        });
        return this;
    };
    jquasi.prototype.removeClass = function (className) {
        this.each(function () {
            var currentClassname = " " + this.className.split(" ").join("  ") + " ";
            this.className       = (currentClassname.split(" " + className + " ").join("  ").split("  ").join(" ")).trim();
            if (this.className === "") {
                this.removeAttribute("class");
            }
        });
        return this;
    };

    jquasi.prototype.hasClass = function(className) {
          return this.data.length? this.data[0].className.match(new RegExp(className.split("-").join('\\-'))) : false;
    };


    jquasi.prototype.toggleClass = function(className) {
        this.each(function() {
            var $this = jquasi(this);
            $this.hasClass(className)? $this.removeClass(className) :$this.addClass(className);
        });
        return this;
    };

    jquasi.prototype.attr = function (attrName, attrValue) {
        if (attrValue === undefined) {
            return this.data[0].getAttribute(attrName);
        }
        this.each(function () {
            this.setAttribute(attrName, attrValue);
        });

        return this;
    };

    jquasi.prototype.html = function (a) {
        if (a === undefined) {
            return this.data[0].innerHTML;
        } else {
            this.data[0].innerHTML = a;
            return this;
        }
    };

    jquasi.prototype.append = function (a) {
        a = a instanceof jquasi ? a.get(0) : a;
        this.data[0].appendChild(a);
        return this;
    };

    jquasi.prototype.clone = function () {
        return new jquasi(this.get(0).cloneNode(true));
    };

    jquasi.prototype.remove = function() {
        this.each(function() {
            this.parentNode && this.parentNode.removeChild(this);
        });
    };

    jquasi.prototype.empty = function () {
        this.each(function () {
            this.innerHTML = "";
        });
        return this;
    };

    jquasi.prototype.find = function (a) {
        var data = [];
        this.each(function () {
            var founds = this.querySelectorAll(a);
            for (var i = 0; i < founds.length; i++) {
                data.push(founds[i]);
            }
        });
        return new jquasi(data);
    };

    jquasi.prototype.get = function (index) {
        return this.data[index];
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

    jquasi.prototype.on = function (eventName, elOrCallback, callback) {
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

                        if (currentEl === this || currentEl === document.body) {
                            break;
                        }
                        currentEl = currentEl.parentNode;
                    }
                });
            });
        }
        return this;
    };

    jquasi.prototype.parent = function () {
        return jquasi(this[0].parentNode)
    };

    return jquasi;
});