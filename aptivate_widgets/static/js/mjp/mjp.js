/*! mjp v0.7.0 -deferred,-ajax | (c) 2013 mjp Marko Samastur */
(function () {
    function _forEach(func) {
        var l = this.length || 0, i = 0, rtn = null, prop = null;
        if (this.length !== undefined) {
            for(;i<l;i++) {
                rtn = func(i, this[i]);
                if (rtn === false) { // Break out on false
                    break;
                }
            }
        } else { // Object
            for(prop in this) {
                if (this.hasOwnProperty(prop)) {
                    rtn = func(i, this[prop]);
                    if (rtn === false) { // Break out on false
                        break;
                    }
                }
                i++;
            }
        }
        return this;
    }

    function extend() {
        var target = arguments[0], obj = null, i=1, k;
        for(; i<arguments.length; i++) {
            obj = arguments[i];
            for(k in obj) {
                if (obj.hasOwnProperty(k) && obj[k] !== null && obj[k] !== undefined) {
                    target[k] = obj[k];
                }
            }
        }
        return target;
    }

    function trim(txt) {
        var trimLeft = /^[\s\xA0]+/,
            trimRight = /[\s\xA0]+$/;
        return txt == null ?
            "" :
            txt.trim ?
                txt.trim() :
                txt.toString().replace(trimLeft, "").replace(trimRight, "");
    }

    // HTML "templating"
    function innerHTML(template) {
        var div = document.createElement("div");
        div.innerHTML = template;
        return div.removeChild(div.firstChild);
    }

    var fn = {
            each: _forEach,

            map: function (callback) {
                var mapped = [];
                this.each(function (i, el) {
                    mapped = mapped.concat(callback(i, el));
                });
                return mjp(mapped);
            },

            filter: function (callback) {
                var filtered = [];
                this.each(function (i, el) {
                    callback(i, el) && filtered.push(el);
                });
                return mjp(filtered);
            },

            html: function (value) {
                if (value) {
                    this.each(function (i, el) {
                        el.innerHTML = value;
                    });
                } else {
                    return this.length ? this[0].innerHTML : "";
                }
            }
        },

        // Main
        mjp = function (sel, context) {
            var raw_nodes = [], nodes = [],
                root = context || document,
                sel_type = typeof sel;

            if (sel_type === "string") {
                if (sel.slice(0, 1) === "<") {
                    raw_nodes = [innerHTML(sel)];
                } else if (sel.indexOf(",") > -1) { // Multiple selectors
                    // TODO: write test
                    sel = sel.split(",");
                    for(var i=0;i<sel.length;i++) {
                        // .slice.call() makes an array that can be concatenated
                        nodes = nodes.concat([].slice.call(
                                    root.querySelectorAll(trim(sel[i]))));
                    }
                } else {
                    raw_nodes = root.querySelectorAll(sel);
                }
            } else if (sel_type === "object") {
                if (sel.length !== undefined) {
                    if (Array.isArray(sel)) {
                        nodes = sel;
                    } else {
                        raw_nodes = sel;
                    }
                } else {
                    nodes = [sel];
                }
            }
            if (raw_nodes.length) {
                raw_nodes.forEach = _forEach;
                raw_nodes.forEach(function (i, node) {
                    nodes.push(node);
                });
            }
            // Add useful methods (TODO: create extend object method)
            extend(nodes, mjp.fn);
            return nodes;
        };

    mjp.fn = fn;
    mjp.trim = trim;
    mjp.extend = extend;

    // class functions (addClass, hasClass, removeClass)
    mjp.extend(mjp.fn, {
        hasClass: function(value) {
            var has = false, cls = "";
            this.each(function(i, el) {
                cls = " "+el.className+" ";
                if (cls.search(" "+value+" ") > -1) {
                    has = true;
                    return false;
                }
            });
            return has;
        },

       addClass: function(value) {
            this.each(function(i, el) {
                if (!mjp(el).hasClass(value)) {
                    el.className = mjp.trim(el.className) + " "+value;
                }
            });
            return this;
        },

        removeClass: function(value) {
            this.each(function(i, el) {
                var cls = " "+el.className+" ", new_cls = "";
                new_cls = cls.replace(" "+value+" ", "");
                if (new_cls !== cls) {
                    el.className = mjp.trim(new_cls);
                }
            });
            return this;
        }
    });

    mjp.handlers = {};

    function normalizeEvent(e) {
        var ev = {originalEvent: e,
                  timeStamp: (new Date()).getTime()},
            copy = ["type", "clientX", "clientY", "altKey", "ctrlKey", "shiftKey"];

        mjp(e).each(function (i, attr) { ev[attr] = e[attr]; });
        mjp(copy).each(function (i, attr) { ev[attr] = e[attr]; });

        ev.currentTarget = this;
        ev.target = e.target || e.srcElement;
        ev.charCode = e.charCode || e.keyCode;
        ev.eventPhase = this === ev.target ? 2 : 3;
        ev.relatedTarget = e.relatedTarget || e.fromElement || e.toElement;

        if (!e.preventDefault) {
            e.stopPropagation = function () { this.cancelBubble = true; };
            e.preventDefault = function () { this.returnValue = false; };
        }
        return e;
    }

    function getHandlerId() {
        var id;
        while((id=Math.ceil(Math.random()*10000)) in mjp.handlers) {}
        return id;
    }

    function wrapHandler(func) {
        var f = function (e) {
            var ev = normalizeEvent.call(this, e || window.event);
            return func.call(this, ev);
        };
        if (!func.mjp) {
            func.mjp = getHandlerId();
            mjp.handlers[func.mjp] = f;
        }
        return mjp.handlers[func.mjp];
    }

    function getHandler(func) {
        return func.mjp ? mjp.handlers[func.mjp] : func;
    }

    // Event handlers
    mjp.extend(mjp.fn, {
        on: function(ev_type, handler) {
            this.each(function (i, node) {
                if (node.addEventListener) {
                    node.addEventListener(ev_type, wrapHandler(handler));
                } else {  // For IE8
                    node.attachEvent("on"+ev_type, wrapHandler(handler));
                }
            });
            return this;
        },

        off: function (ev_type, handler) {
            this.each(function (i, node) {
                if (node.removeEventListener) {
                    node.removeEventListener(ev_type, getHandler(handler));
                } else { // For IE8
                    node.detachEvent("on"+ev_type, getHandler(handler));
                }
            });
        },

        trigger: function (ev_type) {
            this.each(function (i, node) {
                node[ev_type] && node[ev_type]();
            });
        }
    });

    return (window.mjp = window.$ = mjp);
})();
