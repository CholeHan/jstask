(function() {
    qboot = {
        poll: function(e, t, n, r, i) {
            t = t || 100,
            n == null && (n = Infinity);
            if (n <= 0) {
                r && r();
                return
            }
            e() !== !1 ? setTimeout(function() {
                qboot.poll(e, t, n - 1, r, i)
            },
            t) : i && i()
        },
        await: function(e, t, n, r, i) {
            qboot.poll(function() {
                return e() ? (t(), !1) : !0
            },
            r, i, n)
        },
        jsonp: function() {
            var e = {},
            t = 0,
            n = 6e5;
            return function(r, i, s, o) {
                typeof i != "object" && (o = s, s = i, i = null),
                o = qboot.mix(o || {},
                {
                    jsonp: "_callback",
                    timeout: 3e4,
                    threshold: n
                }),
                i && (r += (/\?/.test(r) ? "&": "?") + qboot.encodeURIJson(i));
                var u;
                u = e[r] = e[r] || o.cb || "__jsonp" + t+++"__",
                r += (/\?/.test(r) ? "&": "?") + o.jsonp + "=" + encodeURIComponent(u) + "&t=" + Math.floor((new Date).getTime() / o.threshold),
                window[u] || (window[u] = function() {
                    var e = [],
                    t = function(t, n) {
                        var r = e.shift();
                        r && r(t, n)
                    };
                    return t.add = function(t) {
                        e.push(t)
                    },
                    t
                } ());
                var a = setTimeout(function() {
                    window[u](null, {
                        status: "error",
                        reason: "timeout"
                    })
                },
                o.timeout);
                window[u].add(function(e, t) {
                    clearTimeout(a),
                    s && s(e, {
                        status: "ok"
                    })
                }),
                qboot.load({
                    path: r,
                    type: "js",
                    force: !0
                })
            }
        } (),
        encodeURIJson: function(e) {
            var t = [];
            for (var n in e) {
                if (e[n] == null) continue;
                if (e[n] instanceof Array) for (var r = 0; r < e[n].length; r++) t.push(encodeURIComponent(n) + "[]=" + encodeURIComponent(e[n][r]));
                else t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]))
            }
            return t.join("&")
        },
        mix: function(e, t, n) {
            n = n ||
            function(t, n, r) {
                return e[r] || r in e ? t: n
            },
            n === !0 && (n = function(e, t) {
                return t
            });
            for (var r in t) e[r] = n(e[r], t[r], r, e, t),
            e[r] === undefined && delete e[r];
            return e
        },
        createEvents: function(e) {
            var t = {},
            n = qboot.mix;
            return n(e, {
                on: function(e, n) {
                    t[e] = t[e] || [],
                    t[e].push(n)
                },
                fire: function(r, i) {
                    i = i || {},
                    n(i, {
                        type: r,
                        target: e,
                        preventDefault: function() {
                            i.returnValue = !1
                        }
                    });
                    var s = t[r] || [];
                    for (var o = 0; o < s.length; o++) s[o](i);
                    return i.returnValue !== !1
                }
            }),
            e
        }
    },
    qboot.cookie = {
        getRaw: function(e) {
            var t = new RegExp("(^| )" + e + "=([^;]*)(;|$)"),
            n = t.exec(document.cookie);
            return n ? n[2] || null: null
        },
        get: function(e) {
            var t = qboot.cookie.getRaw(e);
            return "string" == typeof t ? (t = decodeURIComponent(t), t) : null
        },
        setRaw: function(e, t, n) {
            n = n || {};
            var r = n.expires;
            "number" == typeof n.expires && (r = new Date, r.setTime(r.getTime() + n.expires)),
            document.cookie = e + "=" + t + (n.path ? "; path=" + n.path: "") + (r ? "; expires=" + r.toGMTString() : "") + (n.domain ? "; domain=" + n.domain: "") + (n.secure ? "; secure": "")
        },
        set: function(e, t, n) {
            qboot.cookie.setRaw(e, encodeURIComponent(t), n)
        },
        remove: function(e, t) {
            t = t || {},
            t.expires = new Date(0),
            qboot.cookie.setRaw(e, "", t)
        }
    },
    window.qboot = qboot
})(); (function() {
    function t() {
        this._resolves = [],
        this._readyState = t.PENDING,
        this._data = null
    }
    function n(e, n, r) {
        var r = r || t.FULFILLED;
        if (e._readyState != t.PENDING) return;
        e._readyState = r,
        e._data = n;
        for (var i = 0; i < e._resolves.length; i++) {
            var s = e._resolves[i];
            setTimeout(function() {
                s(n)
            })
        }
    }
    function r() {
        this.promise = new t
    }
    var e = qboot.mix;
    e(t.prototype, {
        then: function(e, n) {
            function o(r) {
                var o, u = s._readyState;
                return u === t.FULFILLED ? o = e ? e(r) : r: u === t.REJECTED && (o = n ? n(r) : r),
                t.isPromise(o) ? o.then(function(e) {
                    i.resolve(e)
                },
                function(e) {
                    i.reject(e)
                }) : u !== t.REJECTED || n ? i.resolve(o) : i.reject(o),
                o
            }
            var i = new r,
            s = this;
            return this._readyState === t.PENDING ? this._resolves.push(o) : setTimeout(function() {
                o(s._data)
            }),
            i.promise
        },
        otherwise: function(e) {
            return this.then(undefined, e)
        }
    }),
    e(t, {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2,
        isPromise: function(e) {
            return e != null && typeof e["then"] == "function"
        }
    }),
    e(r.prototype, {
        resolve: function(e) {
            return n(this.promise, e, t.FULFILLED)
        },
        reject: function(e) {
            return n(this.promise, e, t.REJECTED)
        }
    }),
    qboot.when = {
        defer: function() {
            return new r
        },
        isPromise: function(e) {
            return t.isPromise(e)
        },
        all: function(e) {
            var t = qboot.when.defer(),
            n = 0,
            r = [];
            for (var i = 0; i < e.length; i++) e[i].then(function(i) {
                r.push(i),
                n++,
                n >= e.length && t.resolve(r)
            });
            return t.promise
        },
        any: function(e) {
            var t = qboot.when.defer();
            for (var n = 0; n < e.length; n++) e[n].then(function(e) {
                t.resolve(e)
            });
            return t.promise
        },
        join: function() {
            return qboot.when.all(arguments)
        }
    }
})();
qboot.load = qboot.load || {},
qboot.load = function() {
    var e = document,
    t = window,
    n = {},
    r = {},
    i = function(e) {
        return e.constructor === Array
    },
    s = {
        mods: {}
    },
    o = e.getElementsByTagName("script"),
    u = o[o.length - 1],
    a,
    f = function(e) {
        if (e.clearAttributes) e.clearAttributes();
        else for (var t in e) e.hasOwnProperty(t) && t.toLowerCase() !== "parentnode" && delete e[t];
        e && e.parentNode && e.parentNode.removeChild(e),
        e = null
    },
    l = e.createElement("script").readyState ?
    function(e, t) {
        e.onreadystatechange = function() {
            var n = e.readyState;
            if (n === "loaded" || n === "complete") e.onreadystatechange = null,
            t.apply(this)
        }
    }: function(e, t) {
        e.addEventListener("load", t, !1)
    },
    c = function(t, i, s, o, a, h) {
        var p = u;
        if (!t) return;
        if (n[t]) {
            r[t] = !1;
            if (!o) {
                a && a(t, h);
                return
            }
        }
        if (r[t]) {
            setTimeout(function() {
                c(t, i, s, o, a, h)
            },
            1);
            return
        }
        r[t] = !0;
        var d;
        if (i === "js" || t.indexOf(".js") >= 0) d = e.createElement("script"),
        d.setAttribute("type", "text/javascript"),
        s && (d.charset = s),
        d.setAttribute("src", t),
        d.setAttribute("async", !0),
        l(d,
        function() {
            n[t] = !0,
            a && a(t, h),
            f(d)
        }),
        p.parentNode.insertBefore(d, p);
        else if (i === "css" || t.indexOf(".css") >= 0) {
            d = e.createElement("link"),
            d.setAttribute("type", "text/css"),
            s && (d.charset = s),
            d.setAttribute("rel", "stylesheet"),
            d.setAttribute("href", t),
            n[t] = !0,
            p.parentNode.insertBefore(d, p),
            a && a(t, h);
            return
        }
    },
    h = function(e) {
        if (!e || !i(e)) return;
        var t = 0,
        n, r = [],
        o = s.mods,
        u = [],
        a = {},
        f = function(e) {
            var t = 0,
            n, r;
            if (a[e]) return u;
            a[e] = !0;
            if (o[e].requires) {
                r = o[e].requires;
                for (; typeof(n = r[t++]) != "undefined";) o[n] ? (f(n), u.push(n)) : u.push(n);
                return u
            }
            return u
        };
        for (; typeof(n = e[t++]) != "undefined";) o[n] && o[n].requires && o[n].requires[0] && (u = [], a = {},
        r = r.concat(f(n))),
        r.push(n);
        return r
    },
    p = function(e) {
        if (!e || !i(e)) return;
        this.queue = e,
        this.current = null
    };
    return p.prototype = {
        _interval: 10,
        start: function() {
            var e = this;
            this.current = this.next();
            if (!this.current) {
                this.end = !0;
                return
            }
            this.run()
        },
        run: function() {
            var e = this,
            t, n = this.current;
            if (typeof n == "function") {
                n(),
                this.start();
                return
            }
            typeof n == "string" && (s.mods[n] ? (t = s.mods[n], c(t.path, t.type, t.charset, t.force,
            function(t) {
                e.start()
            },
            e)) : /\.js|\.css/i.test(n) ? c(n, "", "", "",
            function(e, t) {
                t.start()
            },
            e) : this.start())
        },
        next: function() {
            return this.queue.shift()
        }
    },
    a = function() {
        var e = [].slice.call(arguments),
        t,
        n = e[0];
        if (typeof n != "string" && typeof n != "function") {
            var r = n.name || n.path,
            i = n.callback || e[1];
            a.add(r, n),
            e[0] = r,
            e[1] = i
        }
        t = new p(h(e)),
        t.start()
    },
    a.add = function(e, t) {
        if (!e || !t || !t.path) return;
        s.mods[e] = t
    },
    a.delay = function() {
        var e = [].slice.call(arguments),
        n = e.shift();
        t.setTimeout(function() {
            a.apply(this, e)
        },
        n)
    },
    a.done = function() {
        var e = [].slice.call(arguments),
        t = 0,
        r;
        for (; r = e[t++];) typeof r == "string" && (s.mods[r] ? (mod = s.mods[r], n[mod.path] = !0) : /\.js|\.css/i.test(r) && (n[r] = !0))
    },
    a.css = function(t, n) {
        n = n || "qboot-inline-css";
        var r = e.getElementById(n);
        r || (r = e.createElement("style"), r.type = "text/css", r.id = n, e.getElementsByTagName("head")[0].appendChild(r)),
        r.styleSheet ? r.styleSheet.cssText = r.styleSheet.cssText + t: r.appendChild(e.createTextNode(t))
    },
    a
} ();
var JSON;
JSON || (JSON = {}),
function() {
    function f(e) {
        return e < 10 ? "0" + e: e
    }
    function quote(e) {
        return escapable.lastIndex = 0,
        escapable.test(e) ? '"' + e.replace(escapable,
        function(e) {
            var t = meta[e];
            return typeof t == "string" ? t: "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice( - 4)
        }) + '"': '"' + e + '"'
    }
    function str(e, t) {
        var n, r, i, s, o = gap,
        u, a = t[e];
        a && typeof a == "object" && typeof a.toJSON == "function" && (a = a.toJSON(e)),
        typeof rep == "function" && (a = rep.call(t, e, a));
        switch (typeof a) {
        case "string":
            return quote(a);
        case "number":
            return isFinite(a) ? String(a) : "null";
        case "boolean":
        case "null":
            return String(a);
        case "object":
            if (!a) return "null";
            gap += indent,
            u = [];
            if (Object.prototype.toString.apply(a) === "[object Array]") {
                s = a.length;
                for (n = 0; n < s; n += 1) u[n] = str(n, a) || "null";
                return i = u.length === 0 ? "[]": gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]": "[" + u.join(",") + "]",
                gap = o,
                i
            }
            if (rep && typeof rep == "object") {
                s = rep.length;
                for (n = 0; n < s; n += 1) typeof rep[n] == "string" && (r = rep[n], i = str(r, a), i && u.push(quote(r) + (gap ? ": ": ":") + i))
            } else for (r in a) Object.prototype.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": ": ":") + i));
            return i = u.length === 0 ? "{}": gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}": "{" + u.join(",") + "}",
            gap = o,
            i
        }
    }
    "use strict",
    typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function(e) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z": null
    },
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
        return this.valueOf()
    });
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap, indent, meta = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    rep;
    typeof JSON.stringify != "function" && (JSON.stringify = function(e, t, n) {
        var r;
        gap = "",
        indent = "";
        if (typeof n == "number") for (r = 0; r < n; r += 1) indent += " ";
        else typeof n == "string" && (indent = n);
        rep = t;
        if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number") return str("", {
            "": e
        });
        throw new Error("JSON.stringify")
    }),
    typeof JSON.parse != "function" && (JSON.parse = function(text, reviver) {
        function walk(e, t) {
            var n, r, i = e[t];
            if (i && typeof i == "object") for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r: delete i[n]);
            return reviver.call(e, t, i)
        }
        var j;
        text = String(text),
        cx.lastIndex = 0,
        cx.test(text) && (text = text.replace(cx,
        function(e) {
            return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice( - 4)
        }));
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"),
        typeof reviver == "function" ? walk({
            "": j
        },
        "") : j;
        throw new SyntaxError("JSON.parse")
    })
} (),
function() {
    var e = {},
    t = "ns";
    e.localStorage = {
        test: function() {
            try {
                return window.localStorage ? !0 : !1
            } catch(e) {
                return ! 1
            }
        },
        methods: {
            init: function(e) {},
            set: function(e, t, n) {
                try {
                    localStorage.setItem(e + t, n)
                } catch(r) {
                    throw r
                }
            },
            get: function(e, t) {
                return localStorage.getItem(e + t)
            },
            remove: function(e, t) {
                localStorage.removeItem(e + t)
            },
            clear: function(e) {
                if (!e) localStorage.clear();
                else for (var t = localStorage.length - 1,
                n; n = localStorage.key(t--);) n && n.indexOf(e) === 0 && localStorage.removeItem(n)
            }
        }
    },
    e.userData = {
        test: function() {
            try {
                return window.ActiveXObject && document.documentElement.addBehavior ? !0 : !1
            } catch(e) {
                return ! 1
            }
        },
        methods: {
            _owners: {},
            init: function(e) {
                if (!this._owners[e]) {
                    if (document.getElementById(e)) this._owners[e] = document.getElementById(e);
                    else {
                        var t = document.createElement("script"),
                        n = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                        t.id = e,
                        t.style.display = "none",
                        t.addBehavior("#default#userdata"),
                        n.insertBefore(t, n.firstChild),
                        this._owners[e] = t
                    }
                    try {
                        this._owners[e].load(e)
                    } catch(r) {}
                    var i = this;
                    window.attachEvent("onunload",
                    function() {
                        i._owners[e] = null
                    })
                }
            },
            set: function(e, t, n) {
                if (this._owners[e]) try {
                    this._owners[e].setAttribute(t, n),
                    this._owners[e].save(e)
                } catch(r) {
                    throw r
                }
            },
            get: function(e, t) {
                return this._owners[e] ? (this._owners[e].load(e), this._owners[e].getAttribute(t) || "") : ""
            },
            remove: function(e, t) {
                this._owners[e] && (this._owners[e].removeAttribute(t), this._owners[e].save(e))
            },
            clear: function(e) {
                if (this._owners[e]) {
                    var t = this._owners[e].XMLDocument.documentElement.attributes;
                    this._owners[e].load(e);
                    for (var n = 0,
                    r; r = t[n]; n++) this._owners[e].removeAttribute(r.name);
                    this._owners[e].save(e)
                }
            }
        }
    };
    var n = function() {
        return e.localStorage.test() ? e.localStorage.methods: e.userData.test() ? e.userData.methods: {
            init: function() {},
            get: function() {},
            set: function() {},
            remove: function() {},
            clear: function() {}
        }
    } (),
    r = {},
    i = function(e, r) {
        this._ns = t + "_" + e + "_",
        this._inited = !1,
        this.storeSvc = r ? {
            init: function(e) {
                r[e] = {}
            },
            get: function(e, t) {
                return r[e][t]
            },
            set: function(e, t, n) {
                r[e][t] = n
            },
            remove: function(e, t) {
                delete r[e][t]
            },
            clear: function(e) {
                delete r[e]
            }
        }: n,
        this._obj = r,
        this.storeSvc && !this._inited && this.storeSvc.init(this._ns)
    };
    i.serialize = function(e) {
        return JSON.stringify(e)
    },
    i.unserialize = function(e) {
        return JSON.parse(e)
    },
    i.prototype = {
        set: function(e, t) {
            try {
                return this.storeSvc.set(this._ns, e, i.serialize(t)),
                !0
            } catch(n) {
                return ! 1
            }
        },
        get: function(e) {
            try {
                return i.unserialize(this.storeSvc.get(this._ns, e))
            } catch(t) {}
        },
        remove: function(e) {
            try {
                this.storeSvc.remove(this._ns, e)
            } catch(t) {}
        },
        clear: function() {
            try {
                this.storeSvc.clear(this._ns)
            } catch(e) {}
        }
    },
    i.ins = function(e, t) {
        if (!r[e] || r[e]._obj != t) r[e] = new i(e, t);
        return r[e]
    },
    window.CacheSVC = i
} (); (function() {
    function e(e, t, n) {
        this.storage = CacheSVC.ins(e, n),
        this.signature = t,
        this.lastUpdate = null,
        this.dataFormatter = {
            getter: null,
            setter: null
        }
    }
    e.clear = function(e) {
        CacheSVC.ins(e).clear()
    },
    e.prototype = {
        setFormatter: function(e, t) {
            this.dataFormatter = {
                setter: e,
                getter: t
            }
        },
        set: function(e, t, n) {
            this.dataFormatter && this.dataFormatter.setter && (t = this.dataFormatter.setter(t)),
            this.lastUpdate = (new Date).getTime();
            var r = {
                value: t,
                signature: this.signature,
                lastUpdate: this.lastUpdate
            };
            n && (r.expires = n),
            this.storage.set(e, r)
        },
        get: function(e, t) {
            var n = this.storage.get(e);
            if (n && n.signature === this.signature && (t || !n.expires || (new Date).getTime() < n.expires)) return n = n.value,
            this.dataFormatter && this.dataFormatter.getter && (n = this.dataFormatter.getter(n)),
            n
        },
        remove: function(e) {
            this.storage.remove(e)
        },
        clear: function() {
            this.storage.clear()
        },
        getUpdatedTime: function(e) {
            var t = this.storage.get(e);
            return t && t.lastUpdate - 0
        },
        getExpires: function(e) {
            var t = this.storage.get(e);
            return t && t.expires
        }
    },
    window.AppData = e
})(); (function() {
    function HtmlData(e, t) {
        this.htmlNode = e,
        this.id = t || this.htmlNode.getAttribute("id").replace(/\-(\w)/ig,
        function(e, t) {
            return t.toUpperCase()
        })
    }
    function R(e) {
        var e = typeof e == "string" ? document.getElementById(e) : e;
        if (e) {
            var t = e.getAttribute("id");
            return rids[t] = rids[t] || new HtmlData(e),
            rids[t]
        }
    }
    var mix = qboot.mix,
    STATUS = {
        STATUS_READY: 1,
        STATUS_FAIL: 2,
        STATUS_OK: 3
    },
    rids = {},
    tmpl = function(s, o, f) {
        var patternExpr = /\{([^\{\}]*)\}/g,
        s = s.replace(patternExpr,
        function(s, a) {
            if (!a) return "";
            try {
                var r = eval("with(o){" + s + "}");
                return typeof r != "undefined" ? f ? f(r) : r: ""
            } catch(ex) {
                return s
            }
        });
        return s
    };
    HtmlData.DATA = {},
    HtmlData.prototype = {
        tmpl: tmpl,
        data2html: function() {
            var e = this.tmplNodeId;
            if ("string" != typeof e) return;
            var t = e.indexOf("{") > -1 ? e: document.getElementById(e).innerHTML,
            n = tmpl(t, HtmlData.DATA[this.id], this.tmplcb);
            this.htmlNode.innerHTML = n
        },
        setStatus: function(e) {
            this.htmlNode.setAttribute("data-rstatus", e)
        },
        getStatus: function() {
            return parseInt(this.htmlNode.getAttribute("data-rstatus"))
        },
        setData: function(e) {
            if (!e) return this;
            if (e.api && "string" == typeof e.api) var t = new AppData("api.hao.360.cn", e.r),
            e = t.get(e.api);
            return HtmlData.DATA[this.id] = e,
            this
        },
        getData: function() {
            return HtmlData.DATA[this.id]
        },
        doAwait: function() {
            var e = this;
            qboot.await(function() {
                return e.cond ? e.cond() : !!HtmlData.DATA[e.id]
            },
            function() {
                e.success ? e.success(HtmlData.DATA[e.id]) : setTimeout(function() {
                    e.data2html()
                },
                0),
                setTimeout(function() {
                    e.setStatus(HtmlData.STATUS_OK)
                },
                0)
            },
            function() {
                e.failer ? e.failer() : this.defaultData ? (e.data2html(e.defaultData), setTimeout(function() {
                    e.setStatus(HtmlData.STATUS_OK)
                },
                0)) : setTimeout(function() {
                    e.setStatus(HtmlData.STATUS_FAIL)
                },
                0)
            },
            e.step || 20, e.max || Infinity)
        },
        render: function(e, t, n) {
            return this.renderArgv = arguments,
            "function" == typeof e ? this.success = e: this.tmplNodeId = e,
            t && this.setData(t),
            mix(this, n, !0),
            this.setStatus(HtmlData.STATUS_READY),
            this.doAwait(),
            this.id
        },
        reRender: function(e, t, n) {
            var r = this.renderArgv;
            if (!r) return;
            return r[2] = r[2] || {},
            this.render(e || r[0], t || r[1], qboot.mix(r[2], n, 1))
        }
    },
    mix(HtmlData, STATUS),
    R.tmpl = tmpl,
    mix(R, STATUS),
    window.R = R
})(); (function() {
    var e = document.write;
    document.write = function(e) {};
    var t = {
        storeNS: "api.hao.360.cn",
        errMsg: [],
        docWrite: function(t) {
            e.apply ? e.apply(document, arguments) : e(t)
        },
        queryUrl: function(e, t) {
            e = e.replace(/^[^?=]*\?/ig, "").split("#")[0];
            var n = {};
            return e.replace(/(^|&)([^&=]+)=([^&]*)/g,
            function(e, t, r, i) {
                try {
                    r = decodeURIComponent(r)
                } catch(s) {}
                try {
                    i = decodeURIComponent(i)
                } catch(s) {}
                r in n ? n[r] instanceof Array ? n[r].push(i) : n[r] = [n[r], i] : n[r] = /\[\]$/.test(r) ? [i] : i
            }),
            t ? n[t] : n
        },
        lunar: function(e) {
            var t = function(e) {
                this.dateObj = e != undefined ? e: new Date,
                this.SY = this.dateObj.getFullYear(),
                this.SM = this.dateObj.getMonth(),
                this.SD = this.dateObj.getDate(),
                this.lunarInfo = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448, 84835],
                this.leapMonth = function(e) {
                    return this.lunarInfo[e - 1900] & 15
                },
                this.monthDays = function(e, t) {
                    return this.lunarInfo[e - 1900] & 65536 >> t ? 30 : 29
                },
                this.leapDays = function(e) {
                    return this.leapMonth(e) ? this.lunarInfo[e - 1900] & 65536 ? 30 : 29 : 0
                },
                this.lYearDays = function(e) {
                    var t, n = 348;
                    for (t = 32768; t > 8; t >>= 1) n += this.lunarInfo[e - 1900] & t ? 1 : 0;
                    return n + this.leapDays(e)
                },
                this.Lunar = function(e) {
                    var t, n = 0,
                    r = 0,
                    i = {},
                    s = new Date(1900, 0, 31),
                    o = (e - s) / 864e5;
                    i.dayCyl = o + 40,
                    i.monCyl = 14;
                    for (t = 1900; t < 2050 && o > 0; t++) r = this.lYearDays(t),
                    o -= r,
                    i.monCyl += 12;
                    o < 0 && (o += r, t--, i.monCyl -= 12),
                    i.year = t,
                    i.yearCyl = t - 1864,
                    n = this.leapMonth(t),
                    i.isLeap = !1;
                    for (t = 1; t < 13 && o > 0; t++) n > 0 && t == n + 1 && i.isLeap == 0 ? (--t, i.isLeap = !0, r = this.leapDays(i.year)) : r = this.monthDays(i.year, t),
                    i.isLeap == 1 && t == n + 1 && (i.isLeap = !1),
                    o -= r,
                    i.isLeap == 0 && i.monCyl++;
                    return o == 0 && n > 0 && t == n + 1 && (i.isLeap ? i.isLeap = !1 : (i.isLeap = !0, --t, --i.monCyl)),
                    o < 0 && (o += r, --t, --i.monCyl),
                    i.month = t,
                    i.day = o + 1,
                    i
                },
                this.cDay = function(e, t) {
                    var n = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"],
                    r = ["\u521d", "\u5341", "\u5eff", "\u5345", "\u3000"],
                    i;
                    e > 10 ? i = "\u5341" + n[e - 10] : e === 1 ? i = "\u6b63": i = n[e],
                    i += "\u6708";
                    switch (t) {
                    case 10:
                        i += "\u521d\u5341";
                        break;
                    case 20:
                        i += "\u4e8c\u5341";
                        break;
                    case 30:
                        i += "\u4e09\u5341";
                        break;
                    default:
                        i += r[Math.floor(t / 10)],
                        i += n[t % 10]
                    }
                    return i
                },
                this.solarDay2 = function() {
                    var e = new Date(this.SY, this.SM, this.SD),
                    t = this.Lunar(e),
                    n = this.cDay(t.month, parseInt(t.day, 10));
                    return t = null,
                    n
                }
            },
            n = new t(e);
            return n.solarDay2()
        },
        g: function(e) {
            return typeof e == "string" ? document.getElementById(e) : e
        },
        is360se: function() {
            var e = !1;
            try {
                e = external.twGetRunPath.toLowerCase().indexOf("360se") > -1 ? !0 : !1
            } catch(n) {}
            return t.is360se = function() {
                return e
            },
            e
        },
        is360se6: function() {
            var e = !1;
            try {
                e = external.GetRunPath(external.GetSID(window)).toLowerCase().indexOf("360se") > -1 ? !0 : !1
            } catch(n) {}
            return e || /(chrome)(?:.*)(360se)/.exec(navigator.userAgent.toLowerCase()) && (e = !0),
            t.is360se6 = function() {
                return e
            },
            e
        },
        is360ee: function() {
            var e = !1;
            try {
                e = external.GetRunPath(external.GetSID(window)).toLowerCase().indexOf("360chrome") > -1 ? !0 : !1
            } catch(n) {}
            return e || /(chrome)(?:.*)(360ee)/.exec(navigator.userAgent.toLowerCase()) && (e = !0),
            t.is360ee = function() {
                return e
            },
            e
        },
        _getInfo: function(e) {
            switch (e) {
            case "mid":
                var n, r;
                n = t.queryUrl(window.location.href, "mid");
                var i = new AppData("api.hao.360.cn"); ! n && i && (n = i.get("mid"));
                if (!n && t.is360se()) {
                    r = !0;
                    try {
                        n = external.GetSpecialData(external.twGetSecurityID(window)).split(",")[3]
                    } catch(s) {
                        t.errMsg.push(s.message)
                    }
                }
                if (!n && window.external) try {
                    external.GetSID !== undefined && (r = !0, n = external.GetMID(external.GetSID(window)))
                } catch(s) {
                    t.errMsg.push("external.GetSID:" + s.message)
                }
                if (!n && window.qhnv !== undefined) {
                    r = !0;
                    try {
                        n = window.qhnv.getMid()
                    } catch(s) {
                        t.errMsg.push(s.message)
                    }
                }
                return r && n && i.set("mid", n),
                n || "";
            default:
                return ""
            }
        },
        cityCode: {
            get: function() {
                var e = qboot.cookie.get("city_code"),
                n = new AppData("api.hao.360.cn", "sync");
                if (e) return n.set("cityCode", e),
                e;
                var r = n.get("cityCode");
                return r ? (t.cityCode.set(r), r) : ""
            },
            set: function(e, t) {
                var n = {
                    domain: "hao.360.cn",
                    expires: 31536e6
                };
                t = t || {},
                t = qboot.mix(t, n),
                qboot.cookie.set("city_code", e, t),
                (new AppData("api.hao.360.cn", "sync")).set("cityCode", e)
            }
        }
    };
    t.mid = t._getInfo("mid"),
    t.todayObj = function() {
        var e = new AppData("api.hao.360.cn");
        return new Date((new Date).getTime() - (e.get("timeOffset") || 0))
    } ();
    var n = HAO_CONFIG.weather.area,
    r = new AppData("api.hao.360.cn", n.r),
    i = n.api,
    s = {
        get: function(e) {
            var n = {},
            s = r.get(i);
            return s && s.town == t.cityCode.get() && (n = s),
            e ? n[e] : n
        },
        set: function(e) {
            r.set(i, e)
        }
    };
    t.area = s,
    qboot.cookie.set = function(e, t, n) {
        if (!/\.360\.cn$/.test(window.location.hostname)) return;
        n = n || {},
        n.path || (n.path = "/"),
        qboot.cookie.setRaw(e, encodeURIComponent(t), n)
    },
    HAO_CONFIG.channelOrder.r += t.mid,
    window.hao360 = t
})();