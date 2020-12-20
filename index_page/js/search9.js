(function() {
    var a = {
        VERSION: "1.1.3",
        RELEASE: "2012-05-02",
        PATH: function() {
            var a = document.getElementsByTagName("script");
            return a[a.length - 1].src.replace(/(^|\/)[^\/]+\/[^\/]+$/, "$1")
        } (),
        namespace: function(b, c) {
            var d = b.split("."),
            e = 0,
            f;
            b.indexOf(".") == 0 && (e = 1, c = c || a),
            c = c || window;
            for (; f = d[e++];) c[f] || (c[f] = {}),
            c = c[f];
            return c
        },
        noConflict: function() {
            var b = window.QW;
            return function() {
                return window.QW = b,
                a
            }
        } (),
        loadJs: function(a, b, c) {
            c = c || {};
            var d = document.getElementsByTagName("head")[0] || document.documentElement,
            e = document.createElement("script"),
            f = !1;
            e.src = a,
            c.charset && (e.charset = c.charset),
            e.onerror = e.onload = e.onreadystatechange = function() { ! f && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") && (f = !0, b && b(), e.onerror = e.onload = e.onreadystatechange = null, d.removeChild(e))
            },
            d.insertBefore(e, d.firstChild)
        },
        loadJsonp: function() {
            var b = new Date * 1;
            return function(c, d, e) {
                e = e || {};
                var f = "QWJsonp" + b++,
                g = e.callbackReplacer || /%callbackfun%/ig;
                window[f] = function(a) {
                    d && d(a),
                    window[f] = null
                },
                g.test(c) ? c = c.replace(g, f) : c += (/\?/.test(c) ? "&": "?") + "callback=" + f,
                a.loadJs(c, e.oncomplete, e)
            }
        } (),
        loadCss: function(a) {
            var b = document.getElementsByTagName("head")[0] || document.documentElement,
            c = document.createElement("link");
            c.rel = "stylesheet",
            c.type = "text/css",
            c.href = a,
            b.insertBefore(c, b.firstChild)
        },
        error: function(a, b) {
            throw b = b || Error,
            new b(a)
        }
    };
    window.QW = a
})(),
function() {
    function a(a, b, c) {
        for (var d in b) if (c || !(d in a)) a[d] = b[d];
        return a
    }
    function b(a) {
        return !! a && a.constructor == Object
    }
    function c() {
        for (var a = 0; a < h.length; a++) {
            var b = h[a].callback,
            c = h[a].moduleNames.split(/\s*,\s*/g),
            d = !0;
            for (var f = 0; f < c.length; f++) {
                var g = e[c[f]];
                if (g.loadStatus != 2 && (g.loadedChecker ? !g.loadedChecker() : !QW[c[f]])) {
                    d = !1;
                    break
                }
            }
            d && (b(), h.splice(a, 1), a--)
        }
    }
    function d() {
        function a() {
            b.loadStatus = 2,
            c(),
            isLoading = !1,
            d()
        }
        var b = g[0];
        if (!isLoading && b) {
            isLoading = !0,
            g.splice(0, 1);
            var e = b.loadedChecker;
            e && e() ? a() : f(b.url.replace(/^\/\//, QW.PATH), a)
        }
    }
    var e = {},
    f = QW.loadJs,
    g = [],
    h = [];
    isLoading = !1;
    var i = {
        provideDomains: [QW],
        provide: function(a, c) {
            if (typeof a == "string") {
                var d = i.provideDomains;
                for (var e = 0; e < d.length; e++) d[e][a] || (d[e][a] = c)
            } else if (b(a)) for (e in a) i.provide(e, a[e])
        },
        addConfig: function(c, d) {
            if (typeof c == "string") {
                var f = a({},
                d);
                f.moduleName = c,
                e[c] = f
            } else if (b(c)) for (var g in c) i.addConfig(g, c[g])
        },
        use: function(a, b) {
            var c = {},
            f = [],
            i = a.split(/\s*,\s*/g),
            j,
            k,
            l,
            m,
            n;
            while (i.length) {
                var o = {};
                for (j = 0; j < i.length; j++) {
                    var p = i[j];
                    if (!p || QW[p]) continue;
                    if (!c[p]) {
                        if (!e[p]) throw "Unknown module: " + p;
                        if (e[p].loadStatus != 2) {
                            var q = e[p].loadedChecker;
                            if (q && q()) continue;
                            c[p] = e[p]
                        }
                        var r = ["requires", "use"];
                        for (k = 0; k < r.length; k++) {
                            var s = e[p][r[k]];
                            if (s) {
                                var t = s.split(",");
                                for (l = 0; l < t.length; l++) o[t[l]] = 0
                            }
                        }
                    }
                }
                i = [];
                for (j in o) i.push(j)
            }
            for (j in c) f.push(c[j]);
            for (j = 0, m = f.length; j < m; j++) {
                if (!f[j].requires) continue;
                for (k = j + 1; k < m; k++) if ((new RegExp("(^|,)" + f[k].moduleName + "(,|$)")).test(f[j].requires)) {
                    var u = f[k];
                    f.splice(k, 1),
                    f.splice(j, 0, u),
                    j--;
                    break
                }
            }
            var v = -1,
            w = -1;
            for (j = 0; j < f.length; j++) n = f[j],
            !n.loadStatus && (new RegExp("(^|,)" + n.moduleName + "(,|$)")).test(a) && (v = j),
            n.loadStatus == 1 && (new RegExp("(^|,)" + n.moduleName + "(,|$)")).test(a) && (w = j);
            if (v != -1 || w != -1) h.push({
                callback: b,
                moduleNames: a
            });
            else {
                b();
                return
            }
            for (j = 0; j < f.length; j++) n = f[j],
            n.loadStatus || (n.loadStatus = 1, g.push(n));
            d()
        }
    };
    QW.ModuleH = i,
    QW.use = i.use,
    QW.provide = i.provide
} (),
QW.Browser = function() {
    var a = window.navigator,
    b = a.userAgent.toLowerCase(),
    c = /(msie|webkit|gecko|presto|opera|safari|firefox|chrome|maxthon|android|ipad|iphone|webos|hpwos)[ \/os]*([\d_.]+)/ig,
    d = {
        platform: a.platform
    };
    b.replace(c,
    function(a, b, c) {
        var e = b.toLowerCase();
        d[e] || (d[e] = c)
    }),
    d.opera && b.replace(/opera.*version\/([\d.]+)/,
    function(a, b) {
        d.opera = b
    });
    if (d.msie) {
        d.ie = d.msie;
        var e = parseInt(d.msie, 10);
        d["ie" + e] = !0
    }
    return d
} ();
if (QW.Browser.ie) try {
    document.execCommand("BackgroundImageCache", !1, !0)
} catch(e) {} (function() {
    var a = {
        trim: function(a) {
            return a.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "")
        },
        mulReplace: function(a, b) {
            for (var c = 0; c < b.length; c++) a = a.replace(b[c][0], b[c][1]);
            return a
        },
        format: function(a, b) {
            var c = arguments;
            return a.replace(/\{(\d+)\}/ig,
            function(a, b) {
                var d = c[(b | 0) + 1];
                return d == null ? "": d
            })
        },
        tmpl: function() {
            var a = "sArrCMX",
            b = a + '.push("',
            c = {
                js: {
                    tagG: "js",
                    isBgn: 1,
                    isEnd: 1,
                    sBgn: '");',
                    sEnd: ";" + b
                },
                "if": {
                    tagG: "if",
                    isBgn: 1,
                    rlt: 1,
                    sBgn: '");if',
                    sEnd: "{" + b
                },
                elseif: {
                    tagG: "if",
                    cond: 1,
                    rlt: 1,
                    sBgn: '");} else if',
                    sEnd: "{" + b
                },
                "else": {
                    tagG: "if",
                    cond: 1,
                    rlt: 2,
                    sEnd: '");}else{' + b
                },
                "/if": {
                    tagG: "if",
                    isEnd: 1,
                    sEnd: '");}' + b
                },
                "for": {
                    tagG: "for",
                    isBgn: 1,
                    rlt: 1,
                    sBgn: '");for',
                    sEnd: "{" + b
                },
                "/for": {
                    tagG: "for",
                    isEnd: 1,
                    sEnd: '");}' + b
                },
                "while": {
                    tagG: "while",
                    isBgn: 1,
                    rlt: 1,
                    sBgn: '");while',
                    sEnd: "{" + b
                },
                "/while": {
                    tagG: "while",
                    isEnd: 1,
                    sEnd: '");}' + b
                }
            };
            return function(d, e) {
                var f = -1,
                g = [],
                h = [[/\{strip\}([\s\S]*?)\{\/strip\}/g,
                function(a, b) {
                    return b.replace(/[\r\n]\s*\}/g, " }").replace(/[\r\n]\s*/g, "")
                }], [/\\/g, "\\\\"], [/"/g, '\\"'], [/\r/g, "\\r"], [/\n/g, "\\n"], [/\{[\s\S]*?\S\}/g,
                function(a) {
                    a = a.substr(1, a.length - 2);
                    for (var b = 0; b < i.length; b++) a = a.replace(i[b][0], i[b][1]);
                    var d = a;
                    /^(.\w+)\W/.test(d) && (d = RegExp.$1);
                    var e = c[d];
                    if (e) {
                        if (e.isBgn) var h = g[++f] = {
                            tagG: e.tagG,
                            rlt: e.rlt
                        };
                        if (e.isEnd) {
                            if (f < 0) throw new Error("Unexpected Tag: " + a);
                            h = g[f--];
                            if (h.tagG != e.tagG) throw new Error("Unmatch Tags: " + h.tagG + "--" + d)
                        } else if (!e.isBgn) {
                            if (f < 0) throw new Error("Unexpected Tag:" + a);
                            h = g[f];
                            if (h.tagG != e.tagG) throw new Error("Unmatch Tags: " + h.tagG + "--" + d);
                            if (e.cond && !(e.cond & h.rlt)) throw new Error("Unexpected Tag: " + d);
                            h.rlt = e.rlt
                        }
                        return (e.sBgn || "") + a.substr(d.length) + (e.sEnd || "")
                    }
                    return '",(' + a + '),"'
                }]],
                i = [[/\\n/g, "\n"], [/\\r/g, "\r"], [/\\"/g, '"'], [/\\\\/g, "\\"], [/\$(\w+)/g, 'opts["$1"]'], [/print\(/g, a + ".push("]];
                for (var j = 0; j < h.length; j++) d = d.replace(h[j][0], h[j][1]);
                if (f >= 0) throw new Error("Lose end Tag: " + g[f].tagG);
                d = "var " + a + "=[];" + b + d + '");return ' + a + '.join("");';
                var k = new Function("opts", d);
                return arguments.length > 1 ? k(e) : k
            }
        } (),
        contains: function(a, b) {
            return a.indexOf(b) > -1
        },
        dbc2sbc: function(b) {
            return a.mulReplace(b, [[/[\uff01-\uff5e]/g,
            function(a) {
                return String.fromCharCode(a.charCodeAt(0) - 65248)
            }], [/\u3000/g, " "], [/\u3002/g, "."]])
        },
        byteLen: function(a) {
            return a.replace(/[^\x00-\xff]/g, "--").length
        },
        subByte: function(b, c, d) {
            return a.byteLen(b) <= c ? b: (d = d || "", c -= a.byteLen(d), b.substr(0, c).replace(/([^\x00-\xff])/g, "$1 ").substr(0, c).replace(/[^\x00-\xff]$/, "").replace(/([^\x00-\xff]) /g, "$1") + d)
        },
        capitalize: function(a) {
            return a.slice(0, 1).toUpperCase() + a.slice(1)
        },
        camelize: function(a) {
            return a.replace(/\-(\w)/ig,
            function(a, b) {
                return b.toUpperCase()
            })
        },
        decamelize: function(a) {
            return a.replace(/[A-Z]/g,
            function(a) {
                return "-" + a.toLowerCase()
            })
        },
        encode4Js: function(b) {
            return a.mulReplace(b, [[/\\/g, "\\u005C"], [/"/g, "\\u0022"], [/'/g, "\\u0027"], [/\//g, "\\u002F"], [/\r/g, "\\u000A"], [/\n/g, "\\u000D"], [/\t/g, "\\u0009"]])
        },
        escapeChars: function(b) {
            return a.mulReplace(b, [[/\\/g, "\\\\"], [/"/g, '\\"'], [/\r/g, "\\r"], [/\n/g, "\\n"], [/\t/g, "\\t"]])
        },
        encode4Http: function(a) {
            return a.replace(/[\u0000-\u0020\u0080-\u00ff\s"'#\/\|\\%<>\[\]\{\}\^~;\?\:@=&]/g,
            function(a) {
                return encodeURIComponent(a)
            })
        },
        encode4Html: function(a) {
            var b = document.createElement("pre"),
            c = document.createTextNode(a);
            return b.appendChild(c),
            b.innerHTML
        },
        encode4HtmlValue: function(b) {
            return a.encode4Html(b).replace(/"/g, "&quot;").replace(/'/g, "&#039;")
        },
        decode4Html: function(b) {
            var c = document.createElement("div");
            return c.innerHTML = a.stripTags(b),
            c.childNodes[0] ? c.childNodes[0].nodeValue || "": ""
        },
        stripTags: function(a) {
            return a.replace(/<[^>]*>/gi, "")
        },
        evalJs: function(a, b) {
            return (new Function("opts", a))(b)
        },
        evalExp: function(a, b) {
            return (new Function("opts", "return (" + a + ");"))(b)
        },
        queryUrl: function(a, b) {
            a = a.replace(/^[^?=]*\?/ig, "").split("#")[0];
            var c = {};
            return a.replace(/(^|&)([^&=]+)=([^&]*)/g,
            function(a, b, d, e) {
                d = decodeURIComponent(d),
                e = decodeURIComponent(e),
                d in c ? c[d] instanceof Array ? c[d].push(e) : c[d] = [c[d], e] : c[d] = /\[\]$/.test(d) ? [e] : e
            }),
            b ? c[b] : c
        },
        decodeURIJson: function(b) {
            return a.queryUrl(b)
        }
    };
    QW.StringH = a
})(),
function() {
    function a(a) {
        return a != null && a.constructor != null ? Object.prototype.toString.call(a).slice(8, -1) : ""
    }
    var b = QW.StringH.escapeChars,
    c = {
        isString: function(b) {
            return a(b) == "String"
        },
        isFunction: function(b) {
            return a(b) == "Function"
        },
        isArray: function(b) {
            return a(b) == "Array"
        },
        isArrayLike: function(a) {
            return !! a && typeof a == "object" && a.nodeType != 1 && typeof a.length == "number"
        },
        isObject: function(a) {
            return a !== null && typeof a == "object"
        },
        isPlainObject: function(b) {
            return a(b) == "Object"
        },
        isWrap: function(a, b) {
            return !! a && !!a[b || "core"]
        },
        isElement: function(a) {
            return !! a && a.nodeType == 1
        },
        set: function(a, b, d) {
            if (c.isArray(b)) for (var e = 0; e < b.length; e++) c.set(a, b[e], d[e]);
            else if (c.isPlainObject(b)) for (e in b) c.set(a, e, b[e]);
            else if (c.isFunction(b)) {
                var f = [].slice.call(arguments, 1);
                f[0] = a,
                b.apply(null, f)
            } else {
                var g = b.split(".");
                e = 0;
                for (var h = a,
                i = g.length - 1; e < i; e++) h = h[g[e]];
                h[g[e]] = d
            }
            return a
        },
        get: function(a, b, d) {
            if (c.isArray(b)) {
                var e = [],
                f;
                for (f = 0; f < b.length; f++) e[f] = c.get(a, b[f], d)
            } else {
                if (c.isFunction(b)) {
                    var g = [].slice.call(arguments, 1);
                    return g[0] = a,
                    b.apply(null, g)
                }
                var h = b.split(".");
                e = a;
                for (f = 0; f < h.length; f++) {
                    if (!d && e == null) return;
                    e = e[h[f]]
                }
            }
            return e
        },
        mix: function(a, b, d) {
            if (c.isArray(b)) {
                for (var e = 0,
                f = b.length; e < f; e++) c.mix(a, b[e], d);
                return a
            }
            for (e in b) if (d || !(a[e] || e in a)) a[e] = b[e];
            return a
        },
        dump: function(a, b) {
            var c = {};
            for (var d = 0,
            e = b.length; d < e; d++) if (d in b) {
                var f = b[d];
                f in a && (c[f] = a[f])
            }
            return c
        },
        map: function(a, b, c) {
            var d = {};
            for (var e in a) d[e] = b.call(c, a[e], e, a);
            return d
        },
        keys: function(a) {
            var b = [];
            for (var c in a) a.hasOwnProperty(c) && b.push(c);
            return b
        },
        values: function(a) {
            var b = [];
            for (var c in a) a.hasOwnProperty(c) && b.push(a[c]);
            return b
        },
        create: function(a, b) {
            var d = function(a) {
                a && c.mix(this, a, !0)
            };
            return d.prototype = a,
            new d(b)
        },
        stringify: function(d) {
            if (d == null) return null;
            d.toJSON && (d = d.toJSON());
            var e = a(d).toLowerCase();
            switch (e) {
            case "string":
                return '"' + b(d) + '"';
            case "number":
            case "boolean":
                return d.toString();
            case "date":
                return "new Date(" + d.getTime() + ")";
            case "array":
                var f = [];
                for (var g = 0; g < d.length; g++) f[g] = c.stringify(d[g]);
                return "[" + f.join(",") + "]";
            case "object":
                if (c.isPlainObject(d)) {
                    f = [];
                    for (g in d) f.push('"' + b(g) + '":' + c.stringify(d[g]));
                    return "{" + f.join(",") + "}"
                }
            }
            return null
        },
        encodeURIJson: function(a) {
            var b = [];
            for (var c in a) {
                if (a[c] == null) continue;
                if (a[c] instanceof Array) for (var d = 0; d < a[c].length; d++) b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c][d]));
                else b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]))
            }
            return b.join("&")
        }
    };
    QW.ObjectH = c
} (),
function() {
    var a = {
        map: function(a, b, c) {
            var d = a.length,
            e = new Array(d);
            for (var f = 0; f < d; f++) f in a && (e[f] = b.call(c, a[f], f, a));
            return e
        },
        forEach: function(a, b, c) {
            for (var d = 0,
            e = a.length; d < e; d++) d in a && b.call(c, a[d], d, a)
        },
        filter: function(a, b, c) {
            var d = [];
            for (var e = 0,
            f = a.length; e < f; e++) e in a && b.call(c, a[e], e, a) && d.push(a[e]);
            return d
        },
        some: function(a, b, c) {
            for (var d = 0,
            e = a.length; d < e; d++) if (d in a && b.call(c, a[d], d, a)) return ! 0;
            return ! 1
        },
        every: function(a, b, c) {
            for (var d = 0,
            e = a.length; d < e; d++) if (d in a && !b.call(c, a[d], d, a)) return ! 1;
            return ! 0
        },
        indexOf: function(a, b, c) {
            var d = a.length;
            c |= 0,
            c < 0 && (c += d),
            c < 0 && (c = 0);
            for (; c < d; c++) if (c in a && a[c] === b) return c;
            return - 1
        },
        lastIndexOf: function(a, b, c) {
            var d = a.length;
            c |= 0;
            if (!c || c >= d) c = d - 1;
            c < 0 && (c += d);
            for (; c > -1; c--) if (c in a && a[c] === b) return c;
            return - 1
        },
        contains: function(b, c) {
            return a.indexOf(b, c) >= 0
        },
        clear: function(a) {
            a.length = 0
        },
        remove: function(a, b) {
            var c = -1;
            for (var d = 1; d < arguments.length; d++) {
                var e = arguments[d];
                for (var f = 0; f < a.length; f++) e === a[f] && (c < 0 && (c = f), a.splice(f--, 1))
            }
            return c
        },
        unique: function(b) {
            var c = [],
            d = null,
            e = Array.indexOf || a.indexOf;
            for (var f = 0,
            g = b.length; f < g; f++) e(c, d = b[f]) < 0 && c.push(d);
            return c
        },
        reduce: function(a, b, c) {
            var d = a.length,
            e = 0;
            if (arguments.length < 3) {
                var f = 0;
                for (; e < d; e++) if (e in a) {
                    c = a[e++],
                    f = 1;
                    break
                }
                if (!f) throw new Error("No component to reduce")
            }
            for (; e < d; e++) e in a && (c = b(c, a[e], e, a));
            return c
        },
        reduceRight: function(a, b, c) {
            var d = a.length,
            e = d - 1;
            if (arguments.length < 3) {
                var f = 0;
                for (; e > -1; e--) if (e in a) {
                    c = a[e--],
                    f = 1;
                    break
                }
                if (!f) throw new Error("No component to reduceRight")
            }
            for (; e > -1; e--) e in a && (c = b(c, a[e], e, a));
            return c
        },
        expand: function(a) {
            return [].concat.apply([], a)
        },
        toArray: function(a) {
            var b = [];
            for (var c = 0; c < a.length; c++) b[c] = a[c];
            return b
        },
        wrap: function(a, b) {
            return new b(a)
        }
    };
    QW.ArrayH = a
} (),
function() {
    var a = QW.ArrayH.contains,
    b = {
        union: function(b, c) {
            var d = [];
            for (var e = 0,
            f = c.length; e < f; e++) a(b, c[e]) || d.push(c[e]);
            return b.concat(d)
        },
        intersect: function(b, c) {
            var d = [];
            for (var e = 0,
            f = c.length; e < f; e++) a(b, c[e]) && d.push(c[e]);
            return d
        },
        minus: function(b, c) {
            var d = [];
            for (var e = 0,
            f = b.length; e < f; e++) a(b, c[e]) || d.push(b[e]);
            return d
        },
        complement: function(a, c) {
            return b.minus(a, c).concat(b.minus(c, a))
        }
    };
    QW.HashsetH = b
} (),
function() {
    var a = {
        format: function(a, b) {
            b = b || "yyyy-MM-dd";
            var c = a.getFullYear().toString(),
            d = {
                M: a.getMonth() + 1,
                d: a.getDate(),
                h: a.getHours(),
                m: a.getMinutes(),
                s: a.getSeconds()
            };
            b = b.replace(/(y+)/ig,
            function(a, b) {
                return c.substr(4 - Math.min(4, b.length))
            });
            for (var e in d) b = b.replace(new RegExp("(" + e + "+)", "g"),
            function(a, b) {
                return d[e] < 10 && b.length > 1 ? "0" + d[e] : d[e]
            });
            return b
        }
    };
    QW.DateH = a
} (),
function() {
    var a = {
        methodize: function(a, b) {
            return b ?
            function() {
                return a.apply(null, [this[b]].concat([].slice.call(arguments)))
            }: function() {
                return a.apply(null, [this].concat([].slice.call(arguments)))
            }
        },
        mul: function(a, b) {
            var c = b == 1,
            d = b == 2,
            e = b == 3;
            return c ?
            function() {
                var b = arguments[0];
                if (! (b instanceof Array)) return a.apply(this, arguments);
                if (b.length) {
                    var c = [].slice.call(arguments);
                    return c[0] = b[0],
                    a.apply(this, c)
                }
            }: function() {
                var b = arguments[0];
                if (b instanceof Array) {
                    var c = [].slice.call(arguments),
                    f = [],
                    g = 0,
                    h = b.length,
                    i;
                    for (; g < h; g++) {
                        c[0] = b[g],
                        i = a.apply(this, c);
                        if (d) i != null && (f = f.concat(i));
                        else if (e) {
                            if (i !== undefined) return i
                        } else f.push(i)
                    }
                    return e ? undefined: f
                }
                return a.apply(this, arguments)
            }
        },
        rwrap: function(a, b, c, d) {
            return c == null && (c = 0),
            function() {
                var e = a.apply(this, arguments);
                if (d && e !== undefined) return e;
                if (c >= 0) e = arguments[c];
                else if (c == "this" || c == "context") e = this;
                return b ? new b(e) : e
            }
        },
        hook: function(a, b, c) {
            if (b == "before") return function() {
                var d = [].slice.call(arguments);
                if (!1 !== c.call(this, d, a, b)) return a.apply(this, d)
            };
            if (b == "after") return function() {
                var d = [].slice.call(arguments),
                e = a.apply(this, d);
                return c.call(this, e, a, b)
            };
            throw new Error("unknow hooker:" + b)
        },
        bind: function(a, b) {
            var c = [].slice,
            d = c.call(arguments, 2),
            e = function() {},
            f = function() {
                return a.apply(this instanceof e ? this: b || {},
                d.concat(c.call(arguments)))
            };
            return e.prototype = a.prototype,
            f.prototype = new e,
            f
        },
        lazyApply: function(a, b, c, d, e) {
            e = e ||
            function() {
                return ! 0
            };
            var f = function() {
                var d = e();
                d == 1 && a.apply(b, c || []),
                (d == 1 || d == -1) && clearInterval(g)
            },
            g = setInterval(f, d);
            return g
        }
    };
    QW.FunctionH = a
} (),
function() {
    var a = QW.ObjectH.mix,
    b = QW.ObjectH.create,
    c = {
        createInstance: function(a) {
            var c = b(a.prototype);
            return a.apply(c, [].slice.call(arguments, 1)),
            c
        },
        extend: function(b, c) {
            function d(b) {
                var c = function() {};
                c.prototype = b[0].prototype;
                for (var d = 1; d < b.length; d++) {
                    var e = b[d];
                    a(c.prototype, e.prototype)
                }
                return new c
            }
            var e = b.prototype;
            return b.prototype = d([].slice.call(arguments, 1)),
            b.$super = c,
            a(b.prototype, e, !0),
            b
        }
    };
    QW.ClassH = c
} (),
function() {
    var a = QW.FunctionH,
    b = QW.ObjectH.create,
    c = QW.ObjectH.isPlainObject,
    d = function() {},
    e = {
        rwrap: function(c, e, f) {
            var g = b(c);
            f = f || "operator";
            for (var h in c) {
                var i = f,
                j = c[h];
                j instanceof Function && (typeof i != "string" && (i = f[h] || ""), "queryer" == i ? g[h] = a.rwrap(j, e, "returnValue") : "operator" == i ? c instanceof d ? g[h] = a.rwrap(j, e, "this") : g[h] = a.rwrap(j, e, 0) : "gsetter" == i && (c instanceof d ? g[h] = a.rwrap(j, e, "this", !0) : g[h] = a.rwrap(j, e, 0, !0)))
            }
            return g
        },
        gsetter: function(a, e) {
            var f = b(a);
            e = e || {};
            for (var g in e) f[g] = function(a, b) {
                return function() {
                    var d = arguments.length;
                    return d -= b,
                    c(arguments[b]) && d++,
                    f[a[Math.min(d, a.length - 1)]].apply(this, arguments)
                }
            } (e[g], a instanceof d ? 0 : 1);
            return f
        },
        mul: function(c, d) {
            var e = b(c);
            d = d || {};
            var f = 0,
            g = 1,
            h = 2,
            i = 3;
            for (var j in c) {
                var k = c[j];
                if (k instanceof Function) {
                    var l = d;
                    typeof l != "string" && (l = d[j] || ""),
                    "getter" == l || "getter_first" == l || "getter_first_all" == l ? e[j] = a.mul(k, g) : "getter_all" == l ? e[j] = a.mul(k, f) : "gsetter" == l ? e[j] = a.mul(k, i) : e[j] = a.mul(k, h);
                    if ("getter" == l || "getter_first_all" == l) e[j + "All"] = a.mul(k, f)
                }
            }
            return e
        },
        methodize: function(b, c, e) {
            var f = new d;
            for (var g in b) {
                var h = b[g];
                h instanceof Function ? f[g] = a.methodize(h, c) : e && (f[g] = h)
            }
            return f
        }
    };
    QW.HelperH = e
} (),
function() {
    var a = QW.ObjectH.mix,
    b = QW.ArrayH.indexOf,
    c = function(b, c, d) {
        this.target = b,
        this.type = c,
        a(this, d || {})
    };
    a(c.prototype, {
        target: null,
        currentTarget: null,
        type: null,
        returnValue: undefined,
        preventDefault: function() {
            this.returnValue = !1
        }
    });
    var d = {
        on: function(a, c, e) {
            var f = a.__custListeners && a.__custListeners[c];
            return f || (d.createEvents(a, c), f = a.__custListeners && a.__custListeners[c]),
            b(f, e) > -1 ? !1 : (f.push(e), !0)
        },
        un: function(a, c, d) {
            var e = a.__custListeners && a.__custListeners[c];
            if (!e) return ! 1;
            if (d) {
                var f = b(e, d);
                if (f < 0) return ! 1;
                e.splice(f, 1)
            } else e.length = 0;
            return ! 0
        },
        fire: function(b, e, f) {
            if (e instanceof c) {
                var g = a(e, f);
                e = e.type
            } else g = new c(b, e, f);
            var h = b.__custListeners && b.__custListeners[e];
            h || (d.createEvents(b, e), h = b.__custListeners && b.__custListeners[e]),
            e != "*" && (h = h.concat(b.__custListeners["*"] || [])),
            g.returnValue = undefined,
            g.currentTarget = b;
            var i = g.currentTarget;
            if (i && i["on" + g.type]) var j = i["on" + g.type].call(i, g);
            for (var k = 0; k < h.length; k++) h[k].call(i, g);
            return g.returnValue !== !1 && (j !== !1 || g.returnValue !== undefined)
        },
        createEvents: function(a, b) {
            b = b || [],
            typeof b == "string" && (b = b.split(","));
            var c = a.__custListeners;
            c || (c = a.__custListeners = {});
            for (var d = 0; d < b.length; d++) c[b[d]] = c[b[d]] || [];
            return c["*"] = c["*"] || [],
            a
        }
    },
    e = function() {
        this.__custListeners = {}
    },
    f = QW.HelperH.methodize(d);
    a(e.prototype, f),
    c.createEvents = function(b, c) {
        return d.createEvents(b, c),
        a(b, f)
    },
    QW.CustEvent = c,
    QW.CustEventTargetH = d,
    QW.CustEventTarget = e
} (),
function() {
    function a() {
        return ! 0
    }
    function b(b, c) {
        var d = [],
        e = 0;
        if (c == a) {
            if (b instanceof Array) return b.slice(0);
            for (var f = b.length; e < f; e++) d[e] = b[e]
        } else for (var g; g = b[e++];) c(g) && d.push(g);
        return d
    }
    function c(a) {
        var b = a.children || a.childNodes,
        c = b.length,
        d = [],
        e = 0;
        for (; e < c; e++) b[e].nodeType == 1 && d.push(b[e]);
        return d
    }
    function d(a) {
        return document.getElementById(a)
    }
    function e(a, b, c) {
        if (b == "n") return ! 0;
        if (typeof a == "number") var d = a;
        else {
            var e = a.parentNode;
            if (e.__queryStamp != q) {
                var f = {
                    nextSibling: e.firstChild
                },
                g = 1;
                while (f = f.nextSibling) f.nodeType == 1 && (f.__siblingIdx = g++);
                e.__queryStamp = q,
                e.__childrenNum = g - 1
            }
            c ? d = e.__childrenNum - a.__siblingIdx + 1 : d = a.__siblingIdx
        }
        switch (b) {
        case "even":
        case "2n":
            return d % 2 == 0;
        case "odd":
        case "2n+1":
            return d % 2 == 1;
        default:
            if (!/n/.test(b)) return d == b;
            var h = b.replace(/(^|\D+)n/g, "$11n").split("n"),
            i = h[0] | 0,
            j = d - h[1] | 0;
            return i * j >= 0 && j % i == 0
        }
    }
    function f(c, d) {
        if (!d && p[c]) return p[c];
        var e = [],
        f = k(c),
        g = /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/g,
        h = [];
        f = f.replace(/\:([\w\-]+)(\(([^)]+)\))?/g,
        function(a, b, c, d, f) {
            return e.push([b, d]),
            ""
        }).replace(/^\*/g,
        function(a) {
            return h.push("el.nodeType==1"),
            ""
        }).replace(/^([\w\-]+)/g,
        function(a) {
            return h.push('(el.tagName||"").toUpperCase()=="' + a.toUpperCase() + '"'),
            ""
        }).replace(/([\[(].*)|#([\w\-]+)|\.([\w\-]+)/g,
        function(a, b, c, d) {
            return b || c && '[id="' + c + '"]' || d && '[className~="' + d + '"]'
        }).replace(g,
        function(a, b, c, d, e) {
            var f = m._attrGetters[b] || 'el.getAttribute("' + b + '")';
            return h.push(m._operators[c || ""].replace(/aa/g, f).replace(/vv/g, e || "")),
            ""
        });
        if (!/^\s*$/.test(f)) throw "Unsupported Selector:\n" + c + "\n-" + f;
        for (var i = 0,
        j; j = e[i]; i++) {
            if (!m._pseudos[j[0]]) throw "Unsupported Selector:\n" + j[0] + "\n" + f;
            h.push('__SltPsds["' + j[0] + '"](el,"' + (j[1] != null ? l(j[1]) : "") + '",i,els)')
        }
        return h.length ? d ? new Function("els", "var els2=[];for(var i=0,el;el=els[i];i++){if(" + h.join("&&") + ") els2.push(el);} return els2;") : p[c] = new Function("el, i, els", "return " + h.join("&&") + ";") : d ?
        function(c) {
            return b(c, a)
        }: p[c] = a
    }
    function g(a, b) {
        if (o && /^((^|,)\s*[.\w-][.\w\s\->+~]*)+$/.test(b)) {
            var c = a.id,
            d, e = [],
            f;
            if (!c && a.parentNode) {
                d = a.id = "__QW_slt_" + r++;
                try {
                    f = a.querySelectorAll("#" + d + " " + b)
                } finally {
                    a.removeAttribute("id")
                }
            } else f = a.querySelectorAll(b);
            for (var g = 0,
            h; h = f[g++];) e.push(h);
            return e
        }
        return null
    }
    function h(a, b) {
        s++;
        var e = g(a, b);
        if (e) return e;
        var k = i(b),
        l = [a],
        m,
        p,
        q,
        r;
        while (r = k[0]) {
            if (!l.length) return [];
            var t = r[0];
            e = [];
            if (t == "+") {
                B = f(r[1]);
                for (m = 0; p = l[m++];) while (p = p.nextSibling) if (p.tagName) {
                    B(p) && e.push(p);
                    break
                }
                l = e,
                k.splice(0, 1)
            } else {
                if (t != "~") break;
                B = f(r[1]);
                for (m = 0; p = l[m++];) {
                    if (m > 1 && p.parentNode == l[m - 2].parentNode) continue;
                    while (p = p.nextSibling) p.tagName && B(p) && e.push(p)
                }
                l = e,
                k.splice(0, 1)
            }
        }
        var u = k.length;
        if (!u || !l.length) return l;
        for (var v = 0,
        w; sltor = k[v]; v++) if (/^[.\w-]*#([\w-]+)/i.test(sltor[1])) {
            w = RegExp.$1,
            sltor[1] = sltor[1].replace("#" + w, "");
            break
        }
        if (v < u) {
            var x = d(w);
            if (!x) return [];
            for (m = 0, q; q = l[m++];) if (!q.parentNode || n(q, x)) return e = j(q, [x], k.slice(0, v + 1)),
            !e.length || v == u - 1 ? e: h(x, k.slice(v + 1).join(",").replace(/,/g, " "));
            return []
        }
        var y = function(a) {
            return a.getElementsByTagName(z)
        },
        z = "*",
        A = "";
        b = k[u - 1][1],
        b = b.replace(/^[\w\-]+/,
        function(a) {
            return z = a,
            ""
        }),
        o && (b = b.replace(/^[\w\*]*\.([\w\-]+)/,
        function(a, b) {
            return A = b,
            ""
        })),
        A && (y = function(a) {
            return a.querySelectorAll(z + "." + A)
        });
        if (u == 1) {
            if (k[0][0] == ">") {
                y = c;
                var B = f(k[0][1], !0)
            } else B = f(b, !0);
            e = [];
            for (m = 0; q = l[m++];) e = e.concat(B(y(q)));
            return e
        }
        k[k.length - 1][1] = b,
        e = [];
        for (m = 0; q = l[m++];) e = e.concat(j(q, y(q), k));
        return e
    }
    function i(a) {
        var b = [],
        c = /(^|\s*[>+~ ]\s*)(([\w\-\:.#*]+|\([^\)]*\)|\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\6|)\s*\])+)(?=($|\s*[>+~ ]\s*))/g,
        d = k(a).replace(c,
        function(a, c, d, e) {
            return b.push([k(c), d]),
            ""
        });
        if (!/^\s*$/.test(d)) throw "Unsupported Selector:\n" + a + "\n--" + d;
        return b
    }
    function j(a, c, d) {
        var e = d[0],
        g = d.length,
        h = !e[0],
        i = [],
        j = [],
        k = [],
        l = "";
        for (var n = 0; n < g; n++) {
            e = d[n],
            i[n] = f(e[1], n == g - 1),
            j[n] = m._relations[e[0]];
            if (e[0] == "" || e[0] == "~") k[n] = !0;
            l += e[0] || " "
        }
        c = i[g - 1](c);
        if (l == " ") return c;
        if (/[+>~] |[+]~/.test(l)) {
            function o(b) {
                var c = [],
                d = g - 1,
                e = c[d] = b;
                for (; d > -1; d--) {
                    if (d > 0) e = j[d](e, i[d - 1], a);
                    else {
                        if (h || e.parentNode == a) return ! 0;
                        e = null
                    }
                    while (!e) {
                        if (++d == g) return ! 1;
                        k[d] && (e = c[d - 1], d++)
                    }
                    c[d - 1] = e
                }
            }
            return b(c, o)
        }
        var p = [];
        for (var n = 0,
        q, r; q = r = c[n++];) {
            for (var s = g - 1; s > 0; s--) if (! (q = j[s](q, i[s - 1], a))) break;
            q && (h || q.parentNode == a) && p.push(r)
        }
        return p
    }
    var k = QW.StringH.trim,
    l = QW.StringH.encode4Js,
    m = {
        queryStamp: 0,
        _operators: {
            "": "aa",
            "=": 'aa=="vv"',
            "!=": 'aa!="vv"',
            "~=": 'aa&&(" "+aa+" ").indexOf(" vv ")>-1',
            "|=": 'aa&&(aa+"-").indexOf("vv-")==0',
            "^=": 'aa&&aa.indexOf("vv")==0',
            "$=": 'aa&&aa.lastIndexOf("vv")==aa.length-"vv".length',
            "*=": 'aa&&aa.indexOf("vv")>-1'
        },
        _pseudos: {
            "first-child": function(a) {
                return ! (a = a.previousSibling) || !a.tagName && !a.previousSibling
            },
            "last-child": function(a) {
                return ! (a = a.nextSibling) || !a.tagName && !a.nextSibling
            },
            "only-child": function(a) {
                var b;
                return ! ((b = a.previousSibling) && (b.tagName || b.previousSibling) || (b = a.nextSibling) && (b.tagName || b.nextSibling))
            },
            "nth-child": function(a, b) {
                return e(a, b)
            },
            "nth-last-child": function(a, b) {
                return e(a, b, !0)
            },
            "first-of-type": function(a) {
                var b = a.tagName,
                c = a;
                while (c = c.previousSlibling) if (c.tagName == b) return ! 1;
                return ! 0
            },
            "last-of-type": function(a) {
                var b = a.tagName,
                c = a;
                while (c = c.nextSibling) if (c.tagName == b) return ! 1;
                return ! 0
            },
            "only-of-type": function(a) {
                var b = a.parentNode.childNodes;
                for (var c = b.length - 1; c > -1; c--) if (b[c].tagName == a.tagName && b[c] != a) return ! 1;
                return ! 0
            },
            "nth-of-type": function(a, b) {
                var c = 1,
                d = a;
                while (d = d.previousSibling) d.tagName == a.tagName && c++;
                return e(c, b)
            },
            "nth-last-of-type": function(a, b) {
                var c = 1,
                d = a;
                while (d = d.nextSibling) d.tagName == a.tagName && c++;
                return e(c, b)
            },
            empty: function(a) {
                return ! a.firstChild
            },
            parent: function(a) {
                return !! a.firstChild
            },
            not: function(a, b) {
                return ! f(b)(a)
            },
            enabled: function(a) {
                return ! a.disabled
            },
            disabled: function(a) {
                return a.disabled
            },
            checked: function(a) {
                return a.checked
            },
            focus: function(a) {
                return a == a.ownerDocument.activeElement
            },
            indeterminate: function(a) {
                return a.indeterminate
            },
            input: function(a) {
                return /input|select|textarea|button/i.test(a.nodeName)
            },
            contains: function(a, b) {
                return (a.textContent || a.innerText || "").indexOf(b) >= 0
            }
        },
        _attrGetters: function() {
            var a = {
                "class": "el.className",
                "for": "el.htmlFor",
                href: 'el.getAttribute("href",2)'
            },
            b = "name,id,className,value,selected,checked,disabled,type,tagName,readOnly,offsetWidth,offsetHeight,innerHTML".split(",");
            for (var c = 0,
            d; d = b[c]; c++) a[d] = "el." + d;
            return a
        } (),
        _relations: {
            "": function(a, b, c) {
                while ((a = a.parentNode) && a != c) if (b(a)) return a;
                return null
            },
            ">": function(a, b, c) {
                return a = a.parentNode,
                a != c && b(a) ? a: null
            },
            "+": function(a, b, c) {
                while (a = a.previousSibling) if (a.tagName) return b(a) && a;
                return null
            },
            "~": function(a, b, c) {
                while (a = a.previousSibling) if (a.tagName && b(a)) return a;
                return null
            }
        },
        selector2Filter: function(a) {
            return f(a)
        },
        test: function(a, b) {
            return f(b)(a)
        },
        filter: function(a, b, c) {
            var c = c || document,
            d = k(b).split(",");
            if (d.length < 2) return j(c || document, a, i(b));
            var e = j(c || document, a, i(d[0]));
            if (e.length == a.length) return e;
            for (var f = 0,
            g; g = a[f++];) g.__QWSltFlted = 0;
            for (f = 0, g; g = e[f++];) g.__QWSltFlted = 1;
            var h = a,
            l;
            for (var m = 1; m < d.length; m++) {
                l = [];
                for (f = 0, g; g = h[f++];) g.__QWSltFlted || l.push(g);
                h = l,
                e = j(c || document, h, i(d[m]));
                for (f = 0, g; g = e[f++];) g.__QWSltFlted = 1
            }
            var n = [];
            for (f = 0, g; g = a[f++];) g.__QWSltFlted && n.push(g);
            return n
        },
        query: function(a, b) {
            m.queryStamp = q++,
            a = a || document;
            var c = g(a, b);
            if (c) return c;
            var d = k(b).split(",");
            c = h(a, d[0]);
            for (var e = 1,
            f; f = d[e]; e++) {
                var i = h(a, f);
                c = c.concat(i)
            }
            return c
        },
        one: function(a, b) {
            var c = m.query(a, b);
            return c[0]
        }
    };
    window.__SltPsds = m._pseudos;
    var n, o; (function() {
        var a = document.createElement("div");
        a.innerHTML = '<div class="aaa"></div>',
        o = a.querySelectorAll && a.querySelectorAll(".aaa").length == 1,
        n = a.contains ?
        function(a, b) {
            return a != b && a.contains(b)
        }: function(a, b) {
            return a.compareDocumentPosition(b) & 16
        }
    })();
    var p = {},
    q = 0,
    r = 0,
    s = 0;
    QW.Selector = m
} (),
function() {
    var a = QW.Selector,
    b = QW.Browser,
    c = {
        query: function(b, c) {
            return a.query(c || document.documentElement, b)
        },
        getDocRect: function(a) {
            a = a || document;
            var c = a.defaultView || a.parentWindow,
            d = a.compatMode,
            e = a.documentElement,
            f = c.innerHeight || 0,
            g = c.innerWidth || 0,
            h = c.pageXOffset || 0,
            i = c.pageYOffset || 0,
            j = e.scrollWidth,
            k = e.scrollHeight;
            return d != "CSS1Compat" && (e = a.body, j = e.scrollWidth, k = e.scrollHeight),
            d && !b.opera && (g = e.clientWidth, f = e.clientHeight),
            j = Math.max(j, g),
            k = Math.max(k, f),
            h = Math.max(h, a.documentElement.scrollLeft, a.body.scrollLeft),
            i = Math.max(i, a.documentElement.scrollTop, a.body.scrollTop),
            {
                width: g,
                height: f,
                scrollWidth: j,
                scrollHeight: k,
                scrollX: h,
                scrollY: i
            }
        },
        create: function() {
            var a = document.createElement("div"),
            b = {
                option: [1, '<select multiple="multiple">', "</select>"],
                optgroup: [1, '<select multiple="multiple">', "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                thead: [1, "<table>", "</table>"],
                tbody: [1, "<table>", "</table>"],
                tfoot: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                th: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                _default: [0, "", ""]
            },
            c = /<(\w+)/i;
            return function(d, e, f) {
                var g = f && f.createElement("div") || a,
                h = g,
                i = (c.exec(d) || ["", ""])[1],
                j = b[i] || b._default,
                k = j[0];
                g.innerHTML = j[1] + d + j[2];
                while (k--) g = g.firstChild;
                var l = g.firstChild;
                if (!l || !e) {
                    while (h.firstChild) h.removeChild(h.firstChild);
                    return l
                }
                f = f || document;
                var m = f.createDocumentFragment();
                while (l = g.firstChild) m.appendChild(l);
                return m
            }
        } (),
        pluckWhiteNode: function(a) {
            var b = [],
            d = 0,
            e = a.length;
            for (; d < e; d++) c.isElement(a[d]) && b.push(a[d]);
            return b
        },
        isElement: function(a) {
            return !! a && a.nodeType == 1
        },
        ready: function(a, c) {
            c = c || document;
            if (/complete/.test(c.readyState)) a();
            else if (c.addEventListener) ! b.ie && "interactive" == c.readyState ? a() : c.addEventListener("DOMContentLoaded", a, !1);
            else {
                var d = function() {
                    d = new Function,
                    a()
                }; (function() {
                    try {
                        c.body.doScroll("left")
                    } catch(a) {
                        return setTimeout(arguments.callee, 1)
                    }
                    d()
                })(),
                c.attachEvent("onreadystatechange",
                function() {
                    "complete" == c.readyState && d()
                })
            }
        },
        rectContains: function(a, b) {
            return a.left <= b.left && a.right >= b.right && a.top <= b.top && a.bottom >= b.bottom
        },
        rectIntersect: function(a, b) {
            var c = Math.max(a.top, b.top),
            d = Math.min(a.right, b.right),
            e = Math.min(a.bottom, b.bottom),
            f = Math.max(a.left, b.left);
            return e >= c && d >= f ? {
                top: c,
                right: d,
                bottom: e,
                left: f
            }: null
        },
        createElement: function(a, b, c) {
            c = c || document;
            var d = c.createElement(a);
            if (b) for (var e in b) d[e] = b[e];
            return d
        },
        insertCssText: function(a) {
            var b = document.createElement("style");
            return b.type = "text/css",
            b.styleSheet ? b.styleSheet.cssText = a: b.appendChild(document.createTextNode(a)),
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(b)
        }
    };
    QW.DomU = c
} (),
function() {
    var a = QW.ObjectH,
    b = QW.StringH,
    c = QW.DomU,
    d = QW.Browser,
    e = QW.Selector,
    f = e.selector2Filter,
    g = function(b, d) {
        return "string" == typeof b ? b.indexOf("<") == 0 ? c.create(b, !1, d) : (d || document).getElementById(b) : a.isWrap(b) ? arguments.callee(b[0]) : b
    },
    h = function(a) {
        return String(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
    },
    i = function(a, b) {
        if (/px$/.test(b) || !b) return parseInt(b, 10) || 0;
        var c = a.style.right,
        d = a.runtimeStyle.right,
        e;
        return a.runtimeStyle.right = a.currentStyle.right,
        a.style.right = b,
        e = a.style.pixelRight || 0,
        a.style.right = c,
        a.runtimeStyle.right = d,
        e
    },
    j = {
        outerHTML: function() {
            var a = document.createElement("div");
            return function(b, c) {
                b = g(b);
                if ("outerHTML" in b) return b.outerHTML;
                a.innerHTML = "";
                var d = c && c.createElement("div") || a;
                return d.appendChild(b.cloneNode(!0)),
                d.innerHTML
            }
        } (),
        hasClass: function(a, b) {
            return a = g(a),
            (new RegExp("(?:^|\\s)" + h(b) + "(?:\\s|$)")).test(a.className)
        },
        addClass: function(a, b) {
            a = g(a),
            j.hasClass(a, b) || (a.className = a.className ? a.className + " " + b: b)
        },
        removeClass: function(a, b) {
            a = g(a),
            j.hasClass(a, b) && (a.className = a.className.replace(new RegExp("(?:^|\\s)" + h(b) + "(?=\\s|$)", "ig"), ""))
        },
        replaceClass: function(a, b, c) {
            a = g(a),
            j.hasClass(a, b) ? a.className = a.className.replace(new RegExp("(^|\\s)" + h(b) + "(?=\\s|$)", "ig"), "$1" + c) : j.addClass(a, c)
        },
        toggleClass: function(a, b, c) {
            c = c || "",
            j.hasClass(a, b) ? j.replaceClass(a, b, c) : j.replaceClass(a, c, b)
        },
        show: function() {
            function a(a) {
                if (!b[a]) {
                    var c = document.createElement(a),
                    d = document.body;
                    j.insertSiblingBefore(d.firstChild, c),
                    display = j.getCurrentStyle(c, "display"),
                    j.removeChild(d, c),
                    d = c = null;
                    if (display === "none" || display === "") display = "block";
                    b[a] = display
                }
                return b[a]
            }
            var b = {};
            return function(b, c) {
                b = g(b);
                if (!c) {
                    var d = b.style.display;
                    d === "none" && (d = b.style.display = ""),
                    d === "" && j.getCurrentStyle(b, "display") === "none" && (d = a(b.nodeName))
                }
                b.style.display = c || d
            }
        } (),
        hide: function(a) {
            a = g(a),
            a.style.display = "none"
        },
        wrap: function(a, b) {
            a = g(a),
            b = g(b, a.ownerDocument),
            a.parentNode.insertBefore(b, a),
            b.appendChild(a)
        },
        unwrap: function(a) {
            a = g(a);
            var b = a.parentNode;
            if (b && b.tagName != "BODY") {
                var c = b.parentNode;
                while (b.firstChild) c.insertBefore(b.firstChild, b);
                c.removeChild(b)
            }
        },
        empty: function(a) {
            a = g(a);
            while (a.firstChild) a.removeChild(a.firstChild)
        },
        toggle: function(a, b) {
            j.isVisible(a) ? j.hide(a) : j.show(a, b)
        },
        isVisible: function(a) {
            return a = g(a),
            !!(a.offsetHeight + a.offsetWidth && j.getStyle(a, "display") != "none")
        },
        getXY: function() {
            var a = function(a, b) {
                var c = parseInt(j.getCurrentStyle(a, "borderTopWidth"), 10) || 0,
                e = parseInt(j.getCurrentStyle(a, "borderLeftWidth"), 10) || 0;
                return d.gecko && /^t(?:able|d|h)$/i.test(a.tagName) && (c = e = 0),
                b[0] += e,
                b[1] += c,
                b
            };
            return document.documentElement.getBoundingClientRect ?
            function(a) {
                var b = a.ownerDocument,
                e = c.getDocRect(b),
                f = e.scrollX,
                g = e.scrollY,
                h = a.getBoundingClientRect(),
                i = [h.left, h.top],
                j,
                k,
                l;
                d.ie && (k = b.documentElement.clientLeft, l = b.documentElement.clientTop, j = b.compatMode, j == "BackCompat" && (k = b.body.clientLeft, l = b.body.clientTop), i[0] -= k, i[1] -= l);
                if (g || f) i[0] += f,
                i[1] += g;
                return i
            }: function(b) {
                var e = [b.offsetLeft, b.offsetTop],
                f = b.parentNode,
                g = b.ownerDocument,
                h = c.getDocRect(g),
                i = !!(d.gecko || parseFloat(d.webkit) > 519),
                k = 0,
                l = 0;
                while (f = f.offsetParent) e[0] += f.offsetLeft,
                e[1] += f.offsetTop,
                i && (e = a(f, e));
                if (j.getCurrentStyle(b, "position") != "fixed") {
                    f = b;
                    while (f = f.parentNode) {
                        k = f.scrollTop,
                        l = f.scrollLeft,
                        d.gecko && j.getCurrentStyle(f, "overflow") !== "visible" && (e = a(f, e));
                        if (k || l) e[0] -= l,
                        e[1] -= k
                    }
                }
                return e[0] += h.scrollX,
                e[1] += h.scrollY,
                e
            }
        } (),
        setXY: function(a, b, c) {
            a = g(a),
            b = parseInt(b, 10),
            c = parseInt(c, 10),
            isNaN(b) || j.setStyle(a, "left", b + "px"),
            isNaN(c) || j.setStyle(a, "top", c + "px")
        },
        setSize: function(a, b, c) {
            a = g(a),
            b = parseFloat(b, 10),
            c = parseFloat(c, 10);
            if (isNaN(b) && isNaN(c)) return;
            var d = j.borderWidth(a),
            e = j.paddingWidth(a);
            isNaN(b) || j.setStyle(a, "width", Math.max( + b - d[1] - d[3] - e[1] - e[3], 0) + "px"),
            isNaN(c) || j.setStyle(a, "height", Math.max( + c - d[0] - d[2] - e[0] - e[2], 0) + "px")
        },
        setInnerSize: function(a, b, c) {
            a = g(a),
            b = parseFloat(b, 10),
            c = parseFloat(c, 10),
            isNaN(b) || j.setStyle(a, "width", b + "px"),
            isNaN(c) || j.setStyle(a, "height", c + "px")
        },
        setRect: function(a, b, c, d, e) {
            j.setXY(a, b, c),
            j.setSize(a, d, e)
        },
        setInnerRect: function(a, b, c, d, e) {
            j.setXY(a, b, c),
            j.setInnerSize(a, d, e)
        },
        getSize: function(a) {
            return a = g(a),
            {
                width: a.offsetWidth,
                height: a.offsetHeight
            }
        },
        getRect: function(a) {
            a = g(a);
            var b = j.getXY(a),
            c = b[0],
            d = b[1],
            e = a.offsetWidth,
            f = a.offsetHeight;
            return {
                width: e,
                height: f,
                left: c,
                top: d,
                bottom: d + f,
                right: c + e
            }
        },
        nextSibling: function(a, b) {
            var c = f(b || "");
            a = g(a);
            do a = a.nextSibling;
            while (a && !c(a));
            return a
        },
        previousSibling: function(a, b) {
            var c = f(b || "");
            a = g(a);
            do a = a.previousSibling;
            while (a && !c(a));
            return a
        },
        previousSiblings: function(a, b) {
            var c = f(b || ""),
            d = [];
            a = g(a);
            while (a = a.previousSibling) c(a) && d.push(a);
            return d.reverse()
        },
        nextSiblings: function(a, b) {
            var c = f(b || ""),
            d = [];
            a = g(a);
            while (a = a.nextSibling) c(a) && d.push(a);
            return d
        },
        siblings: function(a, b) {
            var c = f(b || ""),
            d = a.parentNode.firstChild,
            e = [];
            while (d) a != d && c(d) && e.push(d),
            d = d.nextSibling;
            return e
        },
        ancestorNode: function(a, b) {
            var c = f(b || "");
            a = g(a);
            do a = a.parentNode;
            while (a && !c(a));
            return a
        },
        parentNode: function(a, b) {
            return j.ancestorNode(a, b)
        },
        ancestorNodes: function(a, b) {
            var c = f(b || ""),
            d = [];
            a = g(a);
            while (a = a.parentNode) c(a) && d.push(a);
            return d.reverse()
        },
        firstChild: function(a, b) {
            var c = f(b || "");
            a = g(a).firstChild;
            while (a && !c(a)) a = a.nextSibling;
            return a
        },
        lastChild: function(a, b) {
            var c = f(b || "");
            a = g(a).lastChild;
            while (a && !c(a)) a = a.previousSibling;
            return a
        },
        contains: function(a, b) {
            return a = g(a),
            b = g(b),
            a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16)
        },
        insertAdjacentHTML: function(a, b, c) {
            a = g(a);
            if (a.insertAdjacentHTML) a.insertAdjacentHTML(b, c);
            else {
                var d = a.ownerDocument.createRange(),
                e;
                d.setStartBefore(a),
                e = d.createContextualFragment(c),
                j.insertAdjacentElement(a, b, e)
            }
        },
        insertAdjacentElement: function(a, b, c) {
            a = g(a),
            c = g(c);
            if (a.insertAdjacentElement) a.insertAdjacentElement(b, c);
            else switch (String(b).toLowerCase()) {
            case "beforebegin":
                a.parentNode.insertBefore(c, a);
                break;
            case "afterbegin":
                a.insertBefore(c, a.firstChild);
                break;
            case "beforeend":
                a.appendChild(c);
                break;
            case "afterend":
                a.parentNode.insertBefore(c, a.nextSibling || null)
            }
            return c
        },
        insert: function(a, b, c) {
            j.insertAdjacentElement(a, b, c)
        },
        insertTo: function(a, b, c) {
            j.insertAdjacentElement(c, b, a)
        },
        appendChild: function(a, b) {
            return g(a).appendChild(g(b))
        },
        appendTo: function(a, b) {
            return g(b).appendChild(g(a))
        },
        prepend: function(a, b) {
            return a = g(a),
            a.insertBefore(g(b), a.firstChild)
        },
        prependTo: function(a, b) {
            return j.prepend(b, a)
        },
        insertSiblingBefore: function(a, b) {
            return a = g(a),
            a.parentNode.insertBefore(g(b), a)
        },
        insertSiblingAfter: function(a, b) {
            a = g(a),
            a.parentNode.insertBefore(g(b), a.nextSibling || null)
        },
        insertBefore: function(a, b, c) {
            return g(a).insertBefore(g(b), c && g(c) || null)
        },
        insertAfter: function(a, b, c) {
            return g(a).insertBefore(g(b), c && g(c).nextSibling || null)
        },
        insertParent: function(a, b) {
            return j.insertSiblingBefore(a, b),
            j.appendChild(b, a)
        },
        replaceNode: function(a, b) {
            return a = g(a),
            a.parentNode.replaceChild(g(b), a)
        },
        replaceChild: function(a, b, c) {
            return g(a).replaceChild(g(b), g(c))
        },
        removeNode: function(a) {
            return a = g(a),
            a.parentNode.removeChild(a)
        },
        removeChild: function(a, b) {
            return g(a).removeChild(g(b))
        },
        get: function(b, c) {
            return b = g(b),
            a.get.apply(null, arguments)
        },
        set: function(b, c, d) {
            b = g(b),
            a.set.apply(null, arguments)
        },
        getAttr: function(a, b, c) {
            return a = g(a),
            b in a && "href" != b ? a[b] : a.getAttribute(b, c || a.nodeName == "A" && b.toLowerCase() == "href" && 2 || null)
        },
        setAttr: function(a, b, c, d) {
            a = g(a);
            if ("object" != typeof b) b in a ? a[b] = c: a.setAttribute(b, c, d || null);
            else for (var e in b) j.setAttr(a, e, b[e])
        },
        removeAttr: function(a, b, c) {
            return a = g(a),
            a.removeAttribute(b, c || 0)
        },
        query: function(a, b) {
            return a = g(a),
            e.query(a, b || "")
        },
        one: function(a, b) {
            return a = g(a),
            e.one(a, b || "")
        },
        getElementsByClass: function(a, b) {
            return a = g(a),
            e.query(a, "." + b)
        },
        getValue: function(a) {
            return a = g(a),
            a.value
        },
        setValue: function(a, b) {
            g(a).value = b
        },
        getHtml: function(a) {
            return a = g(a),
            a.innerHTML
        },
        setHtml: function() {
            var a = /<(?:object|embed|option|style)/i,
            b = function(a, b) {
                j.empty(a),
                j.appendChild(a, c.create(b, !0))
            };
            return function(c, d) {
                c = g(c);
                if (!a.test(d)) try {
                    c.innerHTML = d
                } catch(e) {
                    b(c, d)
                } else b(c, d)
            }
        } (),
        encodeURIForm: function(a, b) {
            a = g(a),
            b = b ||
            function(a) {
                return ! 1
            };
            var c = [],
            d = a.elements,
            e = d.length,
            f = 0,
            h = function(a, b) {
                c.push(encodeURIComponent(a) + "=" + encodeURIComponent(b))
            };
            for (; f < e; ++f) {
                a = d[f];
                var i = a.name;
                if (a.disabled || !i || b(a)) continue;
                switch (a.type) {
                case "text":
                case "hidden":
                case "password":
                case "textarea":
                    h(i, a.value);
                    break;
                case "radio":
                case "checkbox":
                    a.checked && h(i, a.value);
                    break;
                case "select-one":
                    a.selectedIndex > -1 && h(i, a.value);
                    break;
                case "select-multiple":
                    var j = a.options;
                    for (var k = 0; k < j.length; ++k) j[k].selected && h(i, j[k].value)
                }
            }
            return c.join("&")
        },
        isFormChanged: function(a, b) {
            a = g(a),
            b = b ||
            function(a) {
                return ! 1
            };
            var c = a.elements,
            d = c.length,
            e = 0,
            f = 0,
            h;
            for (; e < d; ++e, f = 0) {
                a = c[e];
                if (b(a)) continue;
                switch (a.type) {
                case "text":
                case "hidden":
                case "password":
                case "textarea":
                    if (a.defaultValue != a.value) return ! 0;
                    break;
                case "radio":
                case "checkbox":
                    if (a.defaultChecked != a.checked) return ! 0;
                    break;
                case "select-one":
                    f = 1;
                case "select-multiple":
                    h = a.options;
                    for (; f < h.length; ++f) if (h[f].defaultSelected != h[f].selected) return ! 0
                }
            }
            return ! 1
        },
        cloneNode: function(a, b) {
            return g(a).cloneNode(b || !1)
        },
        removeStyle: function(a, c) {
            a = g(a);
            var d = b.camelize(c),
            e = j.cssHooks[d];
            e ? e.remove(a) : a.style.removeProperty ? a.style.removeProperty(b.decamelize(c)) : a.style.removeAttribute(d)
        },
        getStyle: function(a, c) {
            a = g(a),
            c = b.camelize(c);
            var d = j.cssHooks[c],
            e;
            return d ? e = d.get(a) : e = a.style[c],
            !e || e == "auto" ? null: e
        },
        getCurrentStyle: function(a, c, e) {
            a = g(a);
            var f = b.camelize(c),
            h = j.cssHooks[f],
            i;
            if (h) i = h.get(a, !0, e);
            else if (d.ie) i = a.currentStyle[f];
            else {
                var k = a.ownerDocument.defaultView.getComputedStyle(a, e || null);
                i = k ? k.getPropertyValue(b.decamelize(c)) : null
            }
            return ! i || i == "auto" ? null: i
        },
        setStyle: function(a, c, d) {
            a = g(a);
            if ("object" != typeof c) {
                var e = b.camelize(c),
                f = j.cssHooks[e];
                f ? f.set(a, d) : a.style[e] = d
            } else for (var h in c) j.setStyle(a, h, c[h])
        },
        borderWidth: function() {
            var a = {
                thin: 2,
                medium: 4,
                thick: 6
            },
            b = function(b, c) {
                var d = j.getCurrentStyle(b, c);
                return d = a[d] || parseFloat(d),
                d || 0
            };
            return function(a) {
                return a = g(a),
                [b(a, "borderTopWidth"), b(a, "borderRightWidth"), b(a, "borderBottomWidth"), b(a, "borderLeftWidth")]
            }
        } (),
        paddingWidth: function(a) {
            return a = g(a),
            [i(a, j.getCurrentStyle(a, "paddingTop")), i(a, j.getCurrentStyle(a, "paddingRight")), i(a, j.getCurrentStyle(a, "paddingBottom")), i(a, j.getCurrentStyle(a, "paddingLeft"))]
        },
        marginWidth: function(a) {
            return a = g(a),
            [i(a, j.getCurrentStyle(a, "marginTop")), i(a, j.getCurrentStyle(a, "marginRight")), i(a, j.getCurrentStyle(a, "marginBottom")), i(a, j.getCurrentStyle(a, "marginLeft"))]
        },
        tmpl: function(a, c) {
            return a = g(a),
            b.tmpl(a.innerHTML, c)
        },
        cssHooks: function() {
            var a = {
                "float": {
                    get: function(a, b, c) {
                        if (b) {
                            var d = a.ownerDocument.defaultView.getComputedStyle(a, c || null);
                            return d ? d.getPropertyValue("cssFloat") : null
                        }
                        return a.style.cssFloat
                    },
                    set: function(a, b) {
                        a.style.cssFloat = b
                    },
                    remove: function(a) {
                        a.style.removeProperty("float")
                    }
                }
            };
            if (d.ie) {
                a["float"] = {
                    get: function(a, b) {
                        return a[b ? "currentStyle": "style"].styleFloat
                    },
                    set: function(a, b) {
                        a.style.styleFloat = b
                    },
                    remove: function(a) {
                        a.style.removeAttribute("styleFloat")
                    }
                };
                var b = document.createElement("div"),
                c;
                b.innerHTML = "<a href='#' style='opacity:.55;'>a</a>",
                c = b.getElementsByTagName("a")[0];
                if (c && !/^0.55$/.test(c.style.opacity)) {
                    var e = /alpha\([^)]*\)/i,
                    f = /opacity=([^)]*)/;
                    a.opacity = {
                        get: function(a, b) {
                            return f.test((b && a.currentStyle ? a.currentStyle.filter: a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "": b ? "1": ""
                        },
                        set: function(a, b) {
                            var c = a.style,
                            d = a.currentStyle;
                            c.zoom = 1;
                            var f = "alpha(opacity=" + b * 100 + ")",
                            g = d && d.filter || c.filter || "";
                            c.filter = e.test(g) ? g.replace(e, f) : g + " " + f
                        },
                        remove: function(a) {
                            var b = a.style,
                            c = a.currentStyle,
                            d = c && c.filter || b.filter || "";
                            e.test(d) && (b.filter = d.replace(e, "")),
                            b.removeAttribute("opacity")
                        }
                    }
                }
            }
            return a
        } ()
    };
    j.g = g,
    QW.NodeH = j
} (),
function() {
    var a = QW.ObjectH,
    b = a.mix,
    c = a.isString,
    d = a.isArray,
    e = Array.prototype.push,
    f = QW.NodeH,
    g = f.g,
    h = f.query,
    i = f.one,
    j = QW.DomU.create,
    k = function(a) {
        if (!a) return null;
        if (a instanceof k) return a;
        var b = arguments[1];
        if (c(a)) {
            if (/^</.test(a)) {
                var f = j(a, !0, b).childNodes,
                i = [];
                for (var l = 0,
                m; m = f[l]; l++) i[l] = m;
                return new k(i)
            }
            return new k(h(b, a))
        }
        a = g(a, b);
        if (this instanceof k) this.core = a,
        d(a) ? (this.length = 0, e.apply(this, a)) : (this.length = 1, this[0] = a);
        else return new k(a)
    };
    k.one = function(a) {
        if (!a) return null;
        var b = arguments[1];
        return c(a) ? /^</.test(a) ? new k(j(a, !1, b)) : new k(i(b, a)) : (a = g(a, b), d(a) ? new k(a[0]) : new k(a))
    },
    k.pluginHelper = function(a, c, d, e) {
        var f = QW.HelperH;
        a = f.mul(a, c);
        var g = f.rwrap(a, k, c);
        d && (g = f.gsetter(g, d)),
        b(k, g, e);
        var h = f.methodize(a, "core");
        h = f.rwrap(h, k, c),
        d && (h = f.gsetter(h, d)),
        b(k.prototype, h, e)
    },
    b(k.prototype, {
        first: function() {
            return k(this[0])
        },
        last: function() {
            return k(this[this.length - 1])
        },
        item: function(a) {
            return k(this[a])
        },
        filter: function(a, b) {
            return a === !0 ? k(this.core) : a === !1 ? k([]) : (typeof a == "string" && (a = QW.Selector.selector2Filter(a)), k(ArrayH.filter(this, a, b)))
        }
    }),
    QW.NodeW = k
} (),
function() {
    function a(a) {
        var c = b.getTarget(a),
        d = document;
        return c && (d = c.ownerDocument || c.document || (c.defaultView || c.window) && c || document),
        d
    }
    var b = {
        getPageX: function(c) {
            c = c || b.getEvent.apply(b, arguments);
            var d = a(c);
            return "pageX" in c ? c.pageX: c.clientX + (d.documentElement.scrollLeft || d.body.scrollLeft) - 2
        },
        getPageY: function(c) {
            c = c || b.getEvent.apply(b, arguments);
            var d = a(c);
            return "pageY" in c ? c.pageY: c.clientY + (d.documentElement.scrollTop || d.body.scrollTop) - 2
        },
        getDetail: function(a) {
            return a = a || b.getEvent.apply(b, arguments),
            a.detail || -(a.wheelDelta || 0)
        },
        getKeyCode: function(a) {
            return a = a || b.getEvent.apply(b, arguments),
            "keyCode" in a ? a.keyCode: a.charCode || a.which || 0
        },
        stopPropagation: function(a) {
            a = a || b.getEvent.apply(b, arguments),
            a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
        },
        preventDefault: function(a) {
            a = a || b.getEvent.apply(b, arguments),
            a.preventDefault ? a.preventDefault() : a.returnValue = !1
        },
        getCtrlKey: function(a) {
            return a = a || b.getEvent.apply(b, arguments),
            a.ctrlKey
        },
        getShiftKey: function(a) {
            return a = a || b.getEvent.apply(b, arguments),
            a.shiftKey
        },
        getAltKey: function(a) {
            return a = a || b.getEvent.apply(b, arguments),
            a.altKey
        },
        getTarget: function(a) {
            a = a || b.getEvent.apply(b, arguments);
            var c = a.srcElement || a.target;
            return c && c.nodeType == 3 && (c = c.parentNode),
            c
        },
        getRelatedTarget: function(a) {
            a = a || b.getEvent.apply(b, arguments);
            if ("relatedTarget" in a) return a.relatedTarget;
            if (a.type == "mouseover") return a.fromElement;
            if (a.type == "mouseout") return a.toElement
        },
        getEvent: function(a, b) {
            if (a) return a;
            if (b) {
                if (b.document) return b.document.parentWindow.event;
                if (b.parentWindow) return b.parentWindow.event
            }
            if (window.event) return window.event;
            var c = arguments.callee;
            do
            if (/Event/.test(c.arguments[0])) return c.arguments[0];
            while (c = c.caller)
        },
        _EventPro: {
            stopPropagation: function() {
                this.cancelBubble = !0
            },
            preventDefault: function() {
                this.returnValue = !1
            }
        },
        standardize: function(a) {
            a = a || b.getEvent.apply(b, arguments),
            "target" in a || (a.target = b.getTarget(a)),
            "relatedTarget" in a || (a.relatedTarget = b.getRelatedTarget(a)),
            "pageX" in a || (a.pageX = b.getPageX(a), a.pageY = b.getPageY(a)),
            "detail" in a || (a.detail = b.getDetail(a)),
            "keyCode" in a || (a.keyCode = b.getKeyCode(a));
            for (var c in b._EventPro) a[c] == null && (a[c] = b._EventPro[c]);
            return a
        }
    };
    QW.EventH = b
} (),
function() {
    function a(a, b, d, e) {
        return g.get(a, b + (e ? "." + e: ""), d) ||
        function(f) {
            if (!e || e && h._EventHooks[e][b](a, f, d)) return c(a, f, d, b)
        }
    }
    function b(a, b, d, e, f) {
        return g.get(a, d + (f ? "." + f: ""), e, b) ||
        function(g) {
            var i = [],
            j = g.srcElement || g.target;
            if (!j) return;
            j.nodeType == 3 && (j = j.parentNode);
            while (j && j != a) i.push(j),
            j = j.parentNode;
            i = QW.Selector.filter(i, b, a);
            for (var k = 0,
            l = i.length; k < l; ++k) { (!f || f && h._DelegateHooks[f][d](i[k], g || window.event, e)) && c(i[k], g, e, d);
                if (i[k].parentNode && i[k].parentNode.nodeType == 11) {
                    g.stopPropagation ? g.stopPropagation() : g.cancelBubble = !0;
                    break
                }
            }
        }
    }
    function c(a, b, c, d) {
        return h.fireHandler.apply(null, arguments)
    }
    var d = QW.NodeH.g,
    e = QW.ObjectH.mix,
    f = QW.EventH.standardize,
    g = function() {
        var a = 1,
        b = "__QWETH_id";
        return {
            get: function(a, c, d, e) {
                var f = a[b] && this[a[b]];
                if (f && d[b]) return f[c + d[b] + (e || "")]
            },
            add: function(c, d, e, f, g) {
                d[b] || (d[b] = a++),
                f[b] || (f[b] = a++);
                var h = this[d[b]] || (this[d[b]] = {});
                h[e + f[b] + (g || "")] = c
            },
            remove: function(a, c, d, e) {
                var f = a[b] && this[a[b]];
                f && d[b] && delete f[c + d[b] + (e || "")]
            },
            removeEvents: function(a, c) {
                var d = a[b] && this[a[b]];
                if (d) {
                    var e = new RegExp("^[a-zA-Z.]*" + (c || "") + "\\d+$");
                    for (var f in d) e.test(f) && (h.removeEventListener(a, f.split(/[^a-zA-Z]/)[0], d[f]), delete d[f])
                }
            },
            removeDelegates: function(a, c, d) {
                var e = a[b] && this[a[b]];
                if (e) {
                    var f = new RegExp("^([a-zA-Z]+\\.)?" + (c || "") + "\\d+.+");
                    for (var g in e) if (f.test(g) && (!d || g.substr(g.length - d.length) == d)) {
                        var i = g.split(/\d+/)[0].split("."),
                        j = h._DelegateCpatureEvents.indexOf(i[1] || i[0]) > -1;
                        h.removeEventListener(a, g.split(/[^a-zA-Z]/)[0], e[g], j),
                        delete e[g]
                    }
                }
            }
        }
    } (),
    h = {
        _EventHooks: {},
        _DelegateHooks: {},
        _DelegateCpatureEvents: "change,focus,blur",
        fireHandler: function(a, b, c, d) {
            return b = f(b),
            b.userType = d,
            c.call(a, b)
        },
        addEventListener: function() {
            return document.addEventListener ?
            function(a, b, c, d) {
                a.addEventListener(b, c, d || !1)
            }: function(a, b, c) {
                a.attachEvent("on" + b, c)
            }
        } (),
        removeEventListener: function() {
            return document.removeEventListener ?
            function(a, b, c, d) {
                a.removeEventListener(b, c, d || !1)
            }: function(a, b, c) {
                a.detachEvent("on" + b, c)
            }
        } (),
        on: function(b, c, e) {
            if (c && c.indexOf(",") > -1) {
                var f = c.split(",");
                for (var i = 0; i < f.length; i++) h.on(b, f[i], e);
                return
            }
            b = d(b);
            var j = h._EventHooks[c];
            if (j) for (var i in j) {
                var k = a(b, i, e, c);
                g.add(k, b, i + "." + c, e),
                i == c ? h.addEventListener(b, i, k) : h.on(b, i, k)
            } else k = a(b, c, e),
            h.addEventListener(b, c, k),
            g.add(k, b, c, e)
        },
        un: function(b, c, e) {
            if (c && c.indexOf(",") > -1) {
                var f = c.split(",");
                for (var i = 0; i < f.length; i++) h.un(b, f[i], e);
                return
            }
            b = d(b);
            if (!e) return g.removeEvents(b, c);
            var j = h._EventHooks[c];
            if (j) for (var i in j) {
                var k = a(b, i, e, c);
                i == c ? h.removeEventListener(b, i, k) : h.un(b, i, k),
                g.remove(b, i + "." + c, e)
            } else k = a(b, c, e),
            h.removeEventListener(b, c, k),
            g.remove(b, c, e)
        },
        once: function(a, b, c) {
            a = d(a);
            var e = function() {
                c.apply(this, arguments),
                h.un(a, b, e)
            };
            h.on(a, b, e)
        },
        delegate: function(a, c, e, f) {
            if (e && e.indexOf(",") > -1) {
                var i = e.split(",");
                for (var j = 0; j < i.length; j++) h.delegate(a, c, i[j], f);
                return
            }
            a = d(a);
            var k = h._DelegateHooks[e],
            l = h._DelegateCpatureEvents.indexOf(e) > -1;
            if (k) for (var j in k) {
                var m = b(a, c, j, f, e);
                g.add(m, a, j + "." + e, f, c),
                j == e ? h.addEventListener(a, j, m, l) : h.delegate(a, c, j, m)
            } else m = b(a, c, e, f),
            h.addEventListener(a, e, m, l),
            g.add(m, a, e, f, c)
        },
        undelegate: function(a, c, e, f) {
            if (e && e.indexOf(",") > -1) {
                var i = e.split(",");
                for (var j = 0; j < i.length; j++) h.undelegate(a, c, i[j], f);
                return
            }
            a = d(a);
            if (!f) return g.removeDelegates(a, e, c);
            var k = h._DelegateHooks[e],
            l = h._DelegateCpatureEvents.indexOf(e) > -1;
            if (k) for (var j in k) {
                var m = b(a, c, j, f, e);
                j == e ? h.removeEventListener(a, j, m, l) : h.undelegate(a, c, j, m),
                g.remove(a, j + "." + e, f, c)
            } else m = b(a, c, e, f),
            h.removeEventListener(a, e, m, l),
            g.remove(a, e, f, c)
        },
        fire: function() {
            return document.dispatchEvent ?
            function(a, b) {
                var c = null,
                d = a.ownerDocument || a;
                return /mouse|click/i.test(b) ? (c = d.createEvent("MouseEvents"), c.initMouseEvent(b, !0, !0, d.defaultView, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null)) : (c = d.createEvent("Events"), c.initEvent(b, !0, !0, d.defaultView)),
                a.dispatchEvent(c)
            }: function(a, b) {
                return a.fireEvent("on" + b)
            }
        } ()
    };
    h._defaultExtend = function() {
        var a = function(a) {
            function b(a) {
                h[a] = function(b, c) {
                    c ? h.on(b, a, c) : b[a] ? b[a]() : h.fire(b, a)
                }
            }
            for (var c = 0,
            d = a.length; c < d; ++c) b(a[c])
        };
        a("submit,reset,click,focus,blur,change,select".split(",")),
        h.hover = function(a, b, c) {
            a = d(a),
            h.on(a, "mouseenter", b),
            h.on(a, "mouseleave", c || b)
        };
        var b = navigator.userAgent;
        /firefox/i.test(b) && (h._EventHooks.mousewheel = h._DelegateHooks.mousewheel = {
            DOMMouseScroll: function(a, b) {
                return ! 0
            }
        }),
        e(h._EventHooks, {
            mouseenter: {
                mouseover: function(a, b) {
                    var c = b.relatedTarget || b.fromElement;
                    if (!c || !(a.contains ? a.contains(c) : a == c || a.compareDocumentPosition(c) & 16)) return ! 0
                }
            },
            mouseleave: {
                mouseout: function(a, b) {
                    var c = b.relatedTarget || b.toElement;
                    if (!c || !(a.contains ? a.contains(c) : a == c || a.compareDocumentPosition(c) & 16)) return ! 0
                }
            }
        }),
        e(h._DelegateHooks, h._EventHooks);
        if (!document.addEventListener) {
            function c(a) {
                switch (a.type) {
                case "checkbox":
                case "radio":
                    return a.checked;
                case "select-multiple":
                    var b = [],
                    c = a.options;
                    for (var d = 0; d < c.length; ++d) c[d].selected && b.push(c[d].value);
                    return b.join(",");
                default:
                    return a.value
                }
            }
            function f(a, b) {
                var d = b.target || b.srcElement;
                if (c(d) != d.__QWETH_pre_val) return ! 0
            }
            e(h._DelegateHooks, {
                change: {
                    focusin: function(a, b) {
                        var d = b.target || b.srcElement;
                        d.__QWETH_pre_val = c(d)
                    },
                    deactivate: f,
                    focusout: f,
                    click: f
                },
                focus: {
                    focusin: function(a, b) {
                        return ! 0
                    }
                },
                blur: {
                    focusout: function(a, b) {
                        return ! 0
                    }
                }
            })
        }
    },
    h._defaultExtend(),
    QW.EventTargetH = h
} (),
function() {
    function a(a, b) {
        var d = a.__jssData;
        if (!d) {
            var e = a.getAttribute("data-jss");
            e ? d = a.__jssData = c("{" + e + "}") : b && (d = a.__jssData = {})
        }
        return d
    }
    var b = QW.ObjectH.mix,
    c = QW.StringH.evalExp,
    d = {};
    b(d, {
        rules: {},
        addRule: function(a, c) {
            var e = d.rules[a] || (d.rules[a] = {});
            b(e, c, !0)
        },
        addRules: function(a) {
            for (var b in a) d.addRule(b, a[b])
        },
        removeRule: function(a) {
            var b = d.rules[a];
            return b ? (delete d.rules[a], !0) : !1
        },
        getRuleData: function(a) {
            return d.rules[a]
        },
        setRuleAttribute: function(a, b, c) {
            var e = {};
            e[b] = c,
            d.addRule(a, e)
        },
        removeRuleAttribute: function(a, b) {
            var c = d.rules[a];
            return c && attributeName in c ? (delete c[attributeName], !0) : !1
        },
        getRuleAttribute: function(a, b) {
            var c = d.rules[a] || {};
            return c[b]
        }
    });
    var e = {
        getOwnJss: function(b, c) {
            var d = a(b);
            return d && c in d ? d[c] : undefined
        },
        getJss: function(b, c) {
            var e = a(b);
            if (e && c in e) return e[c];
            var f = d.getRuleData,
            g = b.id;
            if (g && (e = f("#" + g)) && c in e) return e[c];
            var h = b.name;
            if (h && (e = f("@" + h)) && c in e) return e[c];
            var i = b.className;
            if (i) {
                var j = i.split(" ");
                for (var k = 0; k < j.length; k++) if ((e = f("." + j[k])) && c in e) return e[c]
            }
            var l = b.tagName;
            return l && (e = f(l)) && c in e ? e[c] : undefined
        },
        setJss: function(b, c, d) {
            var e = a(b, !0);
            e[c] = d
        },
        removeJss: function(b, c) {
            var d = a(b);
            return d && c in d ? (delete d[c], !0) : !1
        }
    };
    QW.Jss = d,
    QW.JssTargetH = e
} (),
function() {
    var a = "queryer",
    b = "operator",
    c = "getter_all",
    d = "getter_first",
    e = "getter_first_all";
    QW.NodeC = {
        getterType: d,
        arrayMethods: "map,forEach,toArray".split(","),
        wrapMethods: {
            g: a,
            one: a,
            query: a,
            getElementsByClass: a,
            outerHTML: d,
            hasClass: d,
            addClass: b,
            removeClass: b,
            replaceClass: b,
            toggleClass: b,
            show: b,
            hide: b,
            toggle: b,
            isVisible: d,
            getXY: e,
            setXY: b,
            setSize: b,
            setInnerSize: b,
            setRect: b,
            setInnerRect: b,
            getSize: e,
            getRect: e,
            nextSibling: a,
            previousSibling: a,
            nextSiblings: a,
            previousSiblings: a,
            siblings: a,
            ancestorNode: a,
            ancestorNodes: a,
            parentNode: a,
            firstChild: a,
            lastChild: a,
            contains: d,
            insertAdjacentHTML: b,
            insertAdjacentElement: b,
            insert: b,
            insertTo: b,
            appendChild: b,
            appendTo: b,
            insertSiblingBefore: b,
            insertSiblingAfter: b,
            insertBefore: b,
            insertAfter: b,
            replaceNode: b,
            replaceChild: b,
            removeNode: b,
            empty: b,
            removeChild: b,
            get: e,
            set: b,
            getAttr: e,
            setAttr: b,
            removeAttr: b,
            getValue: e,
            setValue: b,
            getHtml: e,
            setHtml: b,
            encodeURIForm: d,
            isFormChanged: d,
            cloneNode: a,
            getStyle: e,
            getCurrentStyle: e,
            setStyle: b,
            removeStyle: b,
            borderWidth: d,
            paddingWidth: d,
            marginWidth: d,
            tmpl: e,
            wrap: b,
            unwrap: b,
            prepend: b,
            prependTo: b,
            getOwnJss: e,
            getJss: e,
            setJss: b,
            removeJss: b,
            forEach: b
        },
        gsetterMethods: {
            val: ["getValue", "setValue"],
            html: ["getHtml", "setHtml"],
            attr: ["", "getAttr", "setAttr"],
            css: ["", "getCurrentStyle", "setStyle"],
            size: ["getSize", "setInnerSize"],
            xy: ["getXY", "setXY"]
        }
    }
} (),
function() {
    var a = QW.HelperH.methodize,
    b = QW.ObjectH.mix;
    b(Object, QW.ObjectH),
    b(QW.ArrayH, QW.HashsetH),
    b(Array, QW.ArrayH),
    b(Array.prototype, a(QW.ArrayH)),
    b(QW.FunctionH, QW.ClassH),
    b(Function, QW.FunctionH),
    b(Date, QW.DateH),
    b(Date.prototype, a(QW.DateH)),
    b(String, QW.StringH),
    b(String.prototype, a(QW.StringH))
} (),
function() {
    var a = QW.ObjectH.mix,
    b = QW.HelperH.methodize,
    c = QW.HelperH.rwrap,
    d = QW.NodeC,
    e = QW.NodeH,
    f = QW.EventTargetH,
    g = QW.JssTargetH,
    h = QW.DomU,
    i = QW.NodeW;
    i.pluginHelper(e, d.wrapMethods, d.gsetterMethods),
    i.pluginHelper(f, "operator"),
    i.pluginHelper(g, d.wrapMethods, {
        jss: ["", "getJss", "setJss"]
    });
    var j = QW.ObjectH.dump(QW.ArrayH, d.arrayMethods);
    j = b(j),
    j = c(j, i, d.wrapMethods),
    a(i.prototype, j);
    var k = QW.Dom = {};
    a(k, [h, e, f, g])
} (),
function() {
    var a = function(a, b) {
        var c = (a.getAttribute && a.getAttribute("data--ban")) | 0;
        if (c) {
            if (!a.__BAN_preTime || new Date - a.__BAN_preTime > c) return a.__BAN_preTime = new Date * 1,
            !0;
            return
        }
        return ! 0
    };
    QW.EventTargetH._DelegateHooks.click = QW.EventTargetH._EventHooks.click = {
        click: a
    },
    QW.EventTargetH._EventHooks.submit = {
        submit: a
    }
} (),
QW.g = QW.NodeH.g,
QW.W = QW.NodeW,
QW.ObjectH.mix(window, QW),
QW.ModuleH.provideDomains.push(window),
function() {
    function a(a) {
        this.options = a,
        this._initialize()
    }
    var b = QW.ObjectH.mix,
    c = QW.ObjectH.encodeURIJson,
    d = QW.NodeH.encodeURIForm,
    e = QW.CustEvent;
    b(a, {
        STATE_INIT: 0,
        STATE_REQUEST: 1,
        STATE_SUCCESS: 2,
        STATE_ERROR: 3,
        STATE_TIMEOUT: 4,
        STATE_CANCEL: 5,
        defaultHeaders: {
            "Content-type": "application/x-www-form-urlencoded UTF-8",
            "X-Requested-With": "XMLHttpRequest"
        },
        EVENTS: ["succeed", "error", "cancel", "complete"],
        XHRVersions: ["Microsoft.XMLHTTP"],
        getXHR: function() {
            var b = a.XHRVersions;
            if (window.ActiveXObject) while (b.length > 0) try {
                return new ActiveXObject(b[0])
            } catch(c) {
                b.shift()
            } else if (window.XMLHttpRequest) return new XMLHttpRequest;
            return null
        },
        request: function(b, c, d, e) {
            if (b.constructor == Object) var f = new a(b);
            else typeof c == "function" && (e = d, d = c, b && b.tagName == "FORM" ? (e = e || b.method, c = b, b = b.action) : c = ""),
            f = new a({
                url: b,
                method: e,
                data: c,
                onsucceed: function() {
                    d.call(this, this.requester.responseText)
                }
            });
            return f.send(),
            f
        },
        get: function(b, c, d) {
            var e = [].slice.call(arguments, 0);
            return e.push("get"),
            a.request.apply(null, e)
        },
        post: function(b, c, d) {
            var e = [].slice.call(arguments, 0);
            return e.push("post"),
            a.request.apply(null, e)
        }
    }),
    b(a.prototype, {
        url: "",
        method: "get",
        async: !0,
        user: "",
        pwd: "",
        requestHeaders: null,
        data: "",
        useLock: 0,
        timeout: 3e4,
        isLocked: 0,
        state: a.STATE_INIT,
        send: function(b, e, f) {
            var g = this;
            if (g.isLocked) throw new Error("Locked.");
            g.isProcessing() && g.cancel();
            var h = g.requester;
            if (!h) {
                h = g.requester = a.getXHR();
                if (!h) throw new Error("Fail to get HTTPRequester.")
            }
            b = b || g.url,
            e = (e || g.method || "").toLowerCase(),
            e != "post" && (e = "get"),
            f = f || g.data,
            typeof f == "object" && (f.tagName == "FORM" ? f = d(f) : f = c(f)),
            f && e != "post" && (b += (b.indexOf("?") != -1 ? "&": "?") + f),
            g.user ? h.open(e, b, g.async, g.user, g.pwd) : h.open(e, b, g.async);
            for (var i in g.requestHeaders) h.setRequestHeader(i, g.requestHeaders[i]);
            g.isLocked = 0,
            g.state = a.STATE_INIT,
            g.async && (g._sendTime = new Date, g.useLock && (g.isLocked = 1), this.requester.onreadystatechange = function() {
                var a = g.requester.readyState;
                a == 4 && g._execComplete()
            },
            g._checkTimeout()),
            e == "post" ? (f || (f = " "), h.send(f)) : h.send(null),
            g.async || g._execComplete("timeout")
        },
        isSuccess: function() {
            var a = this.requester.status;
            return ! a || a >= 200 && a < 300 || a == 304
        },
        isProcessing: function() {
            var a = this.requester ? this.requester.readyState: 0;
            return a > 0 && a < 4
        },
        get: function(a, b) {
            this.send(a, "get", b)
        },
        post: function(a, b) {
            this.send(a, "post", b)
        },
        cancel: function() {
            var b = this;
            return b.requester && b.isProcessing() ? (b.state = a.STATE_CANCEL, b.requester.abort(), b._execComplete(), b.fire("cancel"), !0) : !1
        },
        _initialize: function() {
            var c = this;
            e.createEvents(c, a.EVENTS),
            b(c, c.options, 1),
            c.requestHeaders = b(c.requestHeaders || {},
            a.defaultHeaders)
        },
        _checkTimeout: function() {
            var b = this;
            b.async && (clearTimeout(b._timer), this._timer = setTimeout(function() {
                b.requester && !b.isProcessing() && (b.state = a.STATE_TIMEOUT, b.requester.abort(), b._execComplete("timeout"))
            },
            b.timeout))
        },
        _execComplete: function() {
            var b = this,
            c = b.requester;
            c.onreadystatechange = new Function,
            b.isLocked = 0,
            clearTimeout(this._timer),
            b.state != a.STATE_CANCEL && b.state != a.STATE_TIMEOUT && (b.isSuccess() ? (b.state = a.STATE_SUCCESS, b.fire("succeed")) : (b.state = a.STATE_ERROR, b.fire("error"))),
            b.fire("complete")
        }
    }),
    QW.provide("Ajax", a)
} (),
function() {
    var a = QW.Ajax,
    b = QW.NodeW;
    a.Delay = 1e3,
    a.prototype.opResults = function(a) {
        var b = this;
        if (!b.isSuccess()) return alert("\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002"),
        {
            isop: !0,
            err: "inter"
        };
        var c = b.requester.responseText;
        try {
            var d = (new Function("return (" + c + ");"))()
        } catch(e) {
            return alert("\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002"),
            {
                isop: !0,
                err: "inter"
            }
        }
        d.isop = !0;
        switch (d.err) {
        default:
            d.isop = !1
        }
        return d
    },
    a.prototype.execJs = function() {
        QW.StringH.execJs(this.requester.responseText)
    };
    var c = {
        ajaxForm: function(b, c) {
            var d = {
                data: b,
                url: b.action,
                method: b.method
            };
            typeof c == "function" ? d.onsucceed = function() {
                c.call(this, this.requester.responseText)
            }: (d.onsucceed = a.opResults, QW.ObjectH.mix(d, c || {},
            !0)),
            (new a(d)).send()
        }
    };
    b.pluginHelper(c, "operator")
} (),
function() {
    function a(a) {
        a.step(),
        a.isPlaying() && (a._interval = window.setInterval(function() {
            a.step()
        },
        a.frameTime))
    }
    function b(a) {
        window.clearInterval(a._interval)
    }
    function c(a, b) {
        a.per = b,
        a._startDate = new Date * 1 - b * a.dur,
        a.byStep && (a._totalStep = a.dur / a.frameTime, a._currentStep = b * a._totalStep)
    }
    var d = QW.CustEvent,
    e = QW.ObjectH.mix,
    f = function(a, b, g) {
        e(this, g),
        e(this, {
            animFun: a,
            dur: b,
            byStep: !1,
            per: 0,
            frameTime: 28,
            _status: 0
        }),
        c(this, this.per),
        d.createEvents(this, f.EVENTS)
    };
    f.EVENTS = "beforeplay,play,step,pause,resume,end,reset".split(","),
    e(f.prototype, {
        isPlaying: function() {
            return this._status == 1
        },
        play: function() {
            var b = this;
            return b.isPlaying() && b.pause(),
            c(b, 0),
            b.fire("beforeplay") ? (b._status = 1, b.fire("play"), a(b), !0) : !1
        },
        step: function(a) {
            var b = this;
            a != null ? c(b, a) : (b.byStep ? a = b._currentStep++/b._totalStep:a=(new Date-b._startDate)/b.dur, this.per = a),
            this.per > 1 && (this.per = 1),
            b.animFun(this.per),
            b.fire("step");
            if (this.per >= 1) {
                this.end();
                return
            }
        },
        end: function() {
            c(this, 1),
            this.animFun(1),
            this._status = 2,
            b(this),
            this.fire("end")
        },
        pause: function() {
            this._status = 4,
            b(this),
            this.fire("pause")
        },
        resume: function() {
            c(this, this.per),
            this._status = 1,
            this.fire("resume"),
            a(this)
        },
        reset: function() {
            c(this, 0),
            this.animFun(0),
            this.fire("reset")
        }
    }),
    QW.provide("Anim", f)
} (),
function() {
    function a(a, b) {
        for (var c in a) {
            var d = new RegExp(c, "i");
            if (d.test(b)) return a[c]
        }
        return null
    }
    var b = QW.NodeH,
    c = QW.ObjectH.mix,
    d = c,
    e = b.g,
    f = b.getCurrentStyle,
    g = b.setStyle,
    h = QW.DomU.isElement,
    i = QW.ArrayH.forEach,
    j = QW.ArrayH.map,
    k = QW.Anim,
    l = function(a, b, d) {
        this.el = a,
        this.attr = d,
        c(this, b)
    };
    c(l.prototype, {
        getValue: function() {
            return f(this.el, this.attr)
        },
        setValue: function(a, b) {
            g(this.el, this.attr, a + b)
        },
        getUnit: function() {
            if (this.unit) return this.unit;
            var a = this.getValue(),
            b = ["zIndex", "fontWeight", "opacity", "lineHeight"];
            if (a) {
                var c = a.toString().replace(/^[+-]?[\d\.]+/g, "");
                if (c && c != a) return c
            }
            return b.contains(this.attr.camelize()) ? "": "px"
        },
        init: function() {
            var a, b, c;
            null != this.from ? a = parseFloat(this.from) : a = parseFloat(this.getValue()) || 0,
            b = parseFloat(this.to),
            c = this.by != null ? parseFloat(this.by) : b - a,
            this.from = a,
            this.by = c,
            this.unit = this.getUnit()
        },
        action: function(a) {
            var b = this.unit,
            c;
            typeof this.end != "undefined" && a >= 1 ? c = this.end: (c = this.from + this.by * this.easing(a), c = c.toFixed(6)),
            this.setValue(c, b)
        }
    });
    var m = function(a, b, c) {
        var e = new l(a, b, c);
        d(this, e)
    };
    m.MENTOR_CLASS = l,
    c(m.prototype, {
        getValue: function() {
            return this.el[this.attr] | 0
        },
        setValue: function(a) {
            this.el[this.attr] = Math.round(a)
        }
    },
    !0);
    var n = function(a, b, c) {
        var e = new l(a, b, c);
        d(this, e)
    };
    n.MENTOR_CLASS = l,
    c(n.prototype, {
        parseColor: function(a) {
            var b = {
                rgb: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
                hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
                hex3: /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i
            };
            if (a.length == 3) return a;
            var c = b.hex.exec(a);
            return c && c.length == 4 ? [parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16)] : (c = b.rgb.exec(a), c && c.length == 4 ? [parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10)] : (c = b.hex3.exec(a), c && c.length == 4 ? [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16)] : [0, 0, 0]))
        },
        init: function() {
            var a, b, c, d = this.parseColor;
            null != this.from ? a = this.from: a = this.getValue(),
            a = d(a),
            b = this.to || [0, 0, 0],
            b = d(b),
            c = this.by ? d(this.by) : j(b,
            function(b, c) {
                return b - a[c]
            }),
            this.from = a,
            this.to = b,
            this.by = c,
            this.unit = ""
        },
        getValue: function() {
            var a = f(this.el, this.attr);
            return this.parseColor(a)
        },
        setValue: function(a) {
            typeof a == "string" ? g(this.el, this.attr, a) : g(this.el, this.attr, "rgb(" + a.join(",") + ")")
        },
        action: function(a) {
            var b = this,
            c;
            typeof this.end != "undefined" && a >= 1 ? c = this.end: c = this.from.map(function(c, d) {
                return Math.max(Math.floor(c + b.by[d] * b.easing(a)), 0)
            }),
            this.setValue(c)
        }
    },
    !0);
    var o = {
        color$: n,
        "^scroll": m,
        ".*": l
    },
    p = function(b, c, f, g) {
        b = e(b);
        if (!h(b)) throw new Error(["Animation", "Initialize Error", "Element Not Found!"]);
        f = f || p.DefaultEasing,
        g = typeof g == "function" ? g: p.DefaultEasing;
        var j = [];
        for (var l in c) {
            var m = a(o, l);
            agent = new m(b, c[l], l);
            if (!agent) continue;
            agent.init(),
            agent.easing = agent.easing || g,
            j.push(agent)
        }
        var n = new k(function(a) {
            i(j,
            function(b) {
                b.action(a)
            })
        },
        f);
        d(this, n)
    };
    p.MENTOR_CLASS = k,
    p.DefaultEasing = function(a) {
        return a
    },
    p.DefaultDur = 500,
    QW.provide({
        ElAnim: p,
        ScrollAnim: p,
        ColorAnim: p
    })
} (),
function() {
    var a = {
        easeNone: function(a) {
            return a
        },
        easeIn: function(a) {
            return a * a
        },
        easeOut: function(a) {
            return a * (2 - a)
        },
        easeBoth: function(a) {
            return (a /= .5) < 1 ? .5 * a * a: -0.5 * (--a * (a - 2) - 1)
        },
        easeInStrong: function(a) {
            return a * a * a * a
        },
        easeOutStrong: function(a) {
            return - ((a -= 1) * a * a * a - 1)
        },
        easeBothStrong: function(a) {
            return (a /= .5) < 1 ? .5 * a * a * a * a: -0.5 * ((a -= 2) * a * a * a - 2)
        },
        elasticIn: function(a) {
            if (a == 0) return 0;
            if (a == 1) return 1;
            var b = .3,
            c = b / 4;
            return - (Math.pow(2, 10 * (a -= 1)) * Math.sin((a - c) * 2 * Math.PI / b))
        },
        elasticOut: function(a) {
            if (a == 0) return 0;
            if (a == 1) return 1;
            var b = .3,
            c = b / 4;
            return Math.pow(2, -10 * a) * Math.sin((a - c) * 2 * Math.PI / b) + 1
        },
        elasticBoth: function(a) {
            if (a == 0) return 0;
            if ((a /= .5) == 2) return 1;
            var b = .3 * 1.5,
            c = b / 4;
            return a < 1 ? -0.5 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - c) * 2 * Math.PI / b) : Math.pow(2, -10 * (a -= 1)) * Math.sin((a - c) * 2 * Math.PI / b) * .5 + 1
        },
        backIn: function(a) {
            var b = 1.70158;
            return a * a * ((b + 1) * a - b)
        },
        backOut: function(a) {
            var b = 1.70158;
            return (a -= 1) * a * ((b + 1) * a + b) + 1
        },
        backBoth: function(a) {
            var b = 1.70158;
            return (a /= .5) < 1 ? .5 * a * a * (((b *= 1.525) + 1) * a - b) : .5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2)
        },
        bounceIn: function(b) {
            return 1 - a.bounceOut(1 - b)
        },
        bounceOut: function(a) {
            return a < 1 / 2.75 ? 7.5625 * a * a: a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
        },
        bounceBoth: function(b) {
            return b < .5 ? a.bounceIn(b * 2) * .5 : a.bounceOut(b * 2 - 1) * .5 + .5
        }
    };
    QW.provide("Easing", a)
} (),
function() {
    function a(a, b, d, e, f) {
        a = c(a);
        var g = a.__preAnim;
        g && g.isPlaying() && g.pause();
        var h = new QW.ElAnim(a, b, e || 400, f);
        return d && h.on("end",
        function() {
            d.call(a, null)
        }),
        h.play(),
        a.__preAnim = h,
        h
    }
    var b = QW.NodeH,
    c = b.g,
    d = b.show,
    e = b.hide,
    f = b.isVisible,
    g = b.getCurrentStyle,
    h = b.getSize,
    i = b.setStyle,
    j = {
        animate: function(b, c, d, e, f) {
            return a(b, c, e, d, f)
        },
        fadeIn: function(b, c, e, h) {
            var i = 0;
            return f(b) ? i = g(b, "opacity") : d(b),
            a(b, {
                opacity: {
                    from: i,
                    to: b.__animOpacity || 1
                }
            },
            e, c, h)
        },
        fadeOut: function(b, c, d, f) {
            return d = d ||
            function() {
                e(b),
                i(b, "opacity", b.__animOpacity)
            },
            b.__animOpacity = b.__animOpacity || g(b, "opacity"),
            a(b, {
                opacity: {
                    to: 0
                }
            },
            d, c, f)
        },
        fadeToggle: function(a, b, c, d) {
            return j[f(a) ? "fadeOut": "fadeIn"](a, b, c, d)
        },
        slideUp: function(b, c, d, f) {
            var g = h(b).height;
            return d = d ||
            function() {
                e(b),
                i(b, "height", b.__animHeight + "px")
            },
            b.__animHeight = b.__animHeight || g,
            a(b, {
                height: {
                    from: g,
                    to: 0
                }
            },
            d, c, f)
        },
        slideDown: function(b, c, e, g) {
            var i = 0;
            return f(b) ? i = h(b).height: d(b),
            a(b, {
                height: {
                    from: i,
                    to: b.__animHeight || h(b).height
                }
            },
            e, c, g)
        },
        slideToggle: function(a, b, c, d) {
            return j[f(a) ? "slideUp": "slideDown"](a, b, c, d)
        },
        shine4Error: function(b, c, d, e) {
            return a(b, {
                backgroundColor: {
                    from: "#f33",
                    to: "#fff",
                    end: ""
                }
            },
            d, c, e)
        }
    };
    QW.NodeW.pluginHelper(j, "operator"),
    QW.Dom && QW.ObjectH.mix(QW.Dom, j)
} ();