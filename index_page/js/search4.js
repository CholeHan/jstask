(function() {
    function i(n) {
        this.conf = e(n, r),
        t(this)
    }
    var e = qboot.mix,
    t = qboot.createEvents,
    n = qboot.jsonp,
    r = {
        jsonp: "_callback",
        threshold: 6e5,
        timeout: 3e4
    };
    i.prototype = {
        addFilter: function(e) {
            this.conf.filter = e
        },
        get: function(t, r) {
            typeof t == "function" && (r = t, t = {});
            var i = e({
                params: t || {}
            },
            this.conf),
            s = r,
            o = this.conf.filter,
            u = this.conf.setup,
            a = this.conf.teardown,
            f = this;
            o && s && (s = function(e) {
                e = o.call(f, e),
                r(e)
            }),
            e(i, {
                callback: s
            }),
            this.fire("setup", i) && u && u(i),
            this.fire("request", i) && n(i.host, i.params,
            function(e) {
                i.callback && i.callback(e)
            },
            {
                jsonp: i.jsonp,
                timeout: i.timeout,
                threshold: i.threshold,
                cb: i.cb
            }),
            this.fire("teardown", i) && a && a(i)
        }
    },
    window.JsonpProvider = i
})(); (function() {
    function t(e, t, n, r) {
        t instanceof AppData ? this.appData = t: this.appData = new AppData(t, n, r),
        this.key = e
    }
    var e = qboot.mix;
    t.prototype = {
        set: function(e, t) {
            this.appData.set(this.key, e, t)
        },
        get: function(e) {
            return this.appData.get(this.key, e)
        },
        flush: function() {
            this.appData.remove(this.key)
        }
    },
    e(t, {
        NORMAL: 0,
        FLUSH: 1,
        QUITE: 2
    }),
    window.DataCache = t
})(); (function() {
    function e(e, t) {
        this.provider = e,
        this.cache = t
    }
    e.prototype = {
        update: function(e, t, n, r) {
            typeof e == "function" && (r = n, n = t, t = e, e = {});
            var i = this.provider,
            s = this.cache,
            o;
            s && DataCache.FLUSH == n && s.flush(),
            o = s && s.get(),
            s && DataCache.QUITE == n && i.get(e,
            function(e) {
                s.set(e, r)
            }),
            o == null ? i.get(e,
            function(e) {
                s && s.set(e, r),
                t(e)
            }) : t(o)
        }
    },
    window.DataAdapter = e
})(); (function(e) {
    "use strict";
    function t(e, t) {
        var n = (e & 65535) + (t & 65535),
        r = (e >> 16) + (t >> 16) + (n >> 16);
        return r << 16 | n & 65535
    }
    function n(e, t) {
        return e << t | e >>> 32 - t
    }
    function r(e, r, i, s, o, u) {
        return t(n(t(t(r, e), t(s, u)), o), i)
    }
    function i(e, t, n, i, s, o, u) {
        return r(t & n | ~t & i, e, t, s, o, u)
    }
    function s(e, t, n, i, s, o, u) {
        return r(t & i | n & ~i, e, t, s, o, u)
    }
    function o(e, t, n, i, s, o, u) {
        return r(t ^ n ^ i, e, t, s, o, u)
    }
    function u(e, t, n, i, s, o, u) {
        return r(n ^ (t | ~i), e, t, s, o, u)
    }
    function a(e, n) {
        e[n >> 5] |= 128 << n % 32,
        e[(n + 64 >>> 9 << 4) + 14] = n;
        var r, a, f, l, c, h = 1732584193,
        p = -271733879,
        d = -1732584194,
        v = 271733878;
        for (r = 0; r < e.length; r += 16) a = h,
        f = p,
        l = d,
        c = v,
        h = i(h, p, d, v, e[r], 7, -680876936),
        v = i(v, h, p, d, e[r + 1], 12, -389564586),
        d = i(d, v, h, p, e[r + 2], 17, 606105819),
        p = i(p, d, v, h, e[r + 3], 22, -1044525330),
        h = i(h, p, d, v, e[r + 4], 7, -176418897),
        v = i(v, h, p, d, e[r + 5], 12, 1200080426),
        d = i(d, v, h, p, e[r + 6], 17, -1473231341),
        p = i(p, d, v, h, e[r + 7], 22, -45705983),
        h = i(h, p, d, v, e[r + 8], 7, 1770035416),
        v = i(v, h, p, d, e[r + 9], 12, -1958414417),
        d = i(d, v, h, p, e[r + 10], 17, -42063),
        p = i(p, d, v, h, e[r + 11], 22, -1990404162),
        h = i(h, p, d, v, e[r + 12], 7, 1804603682),
        v = i(v, h, p, d, e[r + 13], 12, -40341101),
        d = i(d, v, h, p, e[r + 14], 17, -1502002290),
        p = i(p, d, v, h, e[r + 15], 22, 1236535329),
        h = s(h, p, d, v, e[r + 1], 5, -165796510),
        v = s(v, h, p, d, e[r + 6], 9, -1069501632),
        d = s(d, v, h, p, e[r + 11], 14, 643717713),
        p = s(p, d, v, h, e[r], 20, -373897302),
        h = s(h, p, d, v, e[r + 5], 5, -701558691),
        v = s(v, h, p, d, e[r + 10], 9, 38016083),
        d = s(d, v, h, p, e[r + 15], 14, -660478335),
        p = s(p, d, v, h, e[r + 4], 20, -405537848),
        h = s(h, p, d, v, e[r + 9], 5, 568446438),
        v = s(v, h, p, d, e[r + 14], 9, -1019803690),
        d = s(d, v, h, p, e[r + 3], 14, -187363961),
        p = s(p, d, v, h, e[r + 8], 20, 1163531501),
        h = s(h, p, d, v, e[r + 13], 5, -1444681467),
        v = s(v, h, p, d, e[r + 2], 9, -51403784),
        d = s(d, v, h, p, e[r + 7], 14, 1735328473),
        p = s(p, d, v, h, e[r + 12], 20, -1926607734),
        h = o(h, p, d, v, e[r + 5], 4, -378558),
        v = o(v, h, p, d, e[r + 8], 11, -2022574463),
        d = o(d, v, h, p, e[r + 11], 16, 1839030562),
        p = o(p, d, v, h, e[r + 14], 23, -35309556),
        h = o(h, p, d, v, e[r + 1], 4, -1530992060),
        v = o(v, h, p, d, e[r + 4], 11, 1272893353),
        d = o(d, v, h, p, e[r + 7], 16, -155497632),
        p = o(p, d, v, h, e[r + 10], 23, -1094730640),
        h = o(h, p, d, v, e[r + 13], 4, 681279174),
        v = o(v, h, p, d, e[r], 11, -358537222),
        d = o(d, v, h, p, e[r + 3], 16, -722521979),
        p = o(p, d, v, h, e[r + 6], 23, 76029189),
        h = o(h, p, d, v, e[r + 9], 4, -640364487),
        v = o(v, h, p, d, e[r + 12], 11, -421815835),
        d = o(d, v, h, p, e[r + 15], 16, 530742520),
        p = o(p, d, v, h, e[r + 2], 23, -995338651),
        h = u(h, p, d, v, e[r], 6, -198630844),
        v = u(v, h, p, d, e[r + 7], 10, 1126891415),
        d = u(d, v, h, p, e[r + 14], 15, -1416354905),
        p = u(p, d, v, h, e[r + 5], 21, -57434055),
        h = u(h, p, d, v, e[r + 12], 6, 1700485571),
        v = u(v, h, p, d, e[r + 3], 10, -1894986606),
        d = u(d, v, h, p, e[r + 10], 15, -1051523),
        p = u(p, d, v, h, e[r + 1], 21, -2054922799),
        h = u(h, p, d, v, e[r + 8], 6, 1873313359),
        v = u(v, h, p, d, e[r + 15], 10, -30611744),
        d = u(d, v, h, p, e[r + 6], 15, -1560198380),
        p = u(p, d, v, h, e[r + 13], 21, 1309151649),
        h = u(h, p, d, v, e[r + 4], 6, -145523070),
        v = u(v, h, p, d, e[r + 11], 10, -1120210379),
        d = u(d, v, h, p, e[r + 2], 15, 718787259),
        p = u(p, d, v, h, e[r + 9], 21, -343485551),
        h = t(h, a),
        p = t(p, f),
        d = t(d, l),
        v = t(v, c);
        return [h, p, d, v]
    }
    function f(e) {
        var t, n = "";
        for (t = 0; t < e.length * 32; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
        return n
    }
    function l(e) {
        var t, n = [];
        n[(e.length >> 2) - 1] = undefined;
        for (t = 0; t < n.length; t += 1) n[t] = 0;
        for (t = 0; t < e.length * 8; t += 8) n[t >> 5] |= (e.charCodeAt(t / 8) & 255) << t % 32;
        return n
    }
    function c(e) {
        return f(a(l(e), e.length * 8))
    }
    function h(e, t) {
        var n, r = l(e),
        i = [],
        s = [],
        o;
        i[15] = s[15] = undefined,
        r.length > 16 && (r = a(r, e.length * 8));
        for (n = 0; n < 16; n += 1) i[n] = r[n] ^ 909522486,
        s[n] = r[n] ^ 1549556828;
        return o = a(i.concat(l(t)), 512 + t.length * 8),
        f(a(s.concat(o), 640))
    }
    function p(e) {
        var t = "0123456789abcdef",
        n = "",
        r, i;
        for (i = 0; i < e.length; i += 1) r = e.charCodeAt(i),
        n += t.charAt(r >>> 4 & 15) + t.charAt(r & 15);
        return n
    }
    function d(e) {
        return unescape(encodeURIComponent(e))
    }
    function v(e) {
        return c(d(e))
    }
    function m(e) {
        return p(v(e))
    }
    function g(e, t) {
        return h(d(e), d(t))
    }
    function y(e, t) {
        return p(g(e, t))
    }
    function b(e, t, n) {
        return t ? n ? g(t, e) : y(t, e) : n ? v(e) : m(e)
    }
    typeof define == "function" && define.amd ? define(function() {
        return b
    }) : e.md5 = b
})(hao360); (function() {
    function a(r) {
        u && clearInterval(u),
        e(t,
        function(e) {
            e || (e = (new Date).getTime()),
            i = (new Date(e)).getTime(),
            o = s = (new Date).getTime(),
            f(r),
            u = setInterval(function() {
                f(null)
            },
            n)
        })
    }
    function f(e) {
        var t = (new Date).getTime(); ! o || Math.abs(t - o) > n * 3 ? a(e) : (o = t, Math.abs(i - s) > r && (t = i - s + t)),
        e && e(new Date(t))
    }
    var e = qboot.jsonp,
    t = "http://hao.360.cn/time.php",
    n = 6e4,
    r = 3e5,
    i = null,
    s = null,
    o = null,
    u = null,
    l = {
        getTime: f
    };
    window.TimeSVC = l
})(); (function() {
    var e = "http://cdn.website.h.qhimg.com/index.php?domain={domain}",
    t = function(e, t) {
        this.name = e,
        this.url = t;
        if (!t) return;
        this.init()
    };
    qboot.mix(t.prototype, {
        clearUrl: function() {
            var e = this.url,
            t = document.createElement("div");
            t.innerHTML = e.replace(/<[^>]*>/gi, ""),
            e = t.childNodes[0] ? t.childNodes[0].nodeValue || "": "",
            this.getUriData("protocol") || (e = "http://" + e),
            this.getUriData("path") || (e += "/"),
            e = e.replace(/[\"\<\>\']/g, ""),
            this.url = e;
            var n = this.name.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, ""),
            r = document.createElement("pre"),
            i = document.createTextNode(n);
            r.appendChild(i),
            this.name = r.innerHTML
        },
        buildSid: function() {
            var e = this.url;
            try {
                e = decodeURI(e)
            } catch(t) {}
            e = encodeURI(e),
            this.sid = hao360.md5(e)
        },
        getFavicon: function() {
            return e.replace("{domain}", this.getUriData("domain"))
        },
        getUriData: function(e) {
            var t = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
            n = ["source", "protocol", "authority", "userInfo", "user", "password", "domain", "port", "relative", "path", "directory", "file", "query", "anchor"],
            r = t.exec(this.url || ""),
            i = {};
            for (var s = 0,
            o = n.length; s < o; s++) {
                var u = n[s];
                i[u] = r[s] || ""
            }
            return e ? i[e] : i
        },
        init: function() {
            this.clearUrl(),
            this.domain = this.getUriData("domain"),
            this.favicon = this.getFavicon(),
            this.buildSid(),
            this.status = ""
        }
    }),
    qboot.mix(t, {
        getSid: function(e) {
            return (new t("", e)).sid
        }
    }),
    window.SiteEnt = t
})(); (function() {
    var e = function() {};
    e.prototype = {
        init: function() {},
        add: function() {},
        getOne: function() {},
        getAll: function() {},
        remove: function() {}
    },
    e.ERRORCODE = {
        NoError: 0,
        NameIsNull: 1001,
        UrlIsNull: 1002,
        NameLengthErr: 1003,
        UrlLengthErr: 1004,
        SiteIsExist: 1005,
        SidIsNull: 1006,
        SiteIsNotExist: 1007
    },
    window.mysiteProvider = e
})(); (function() {
    var e = function(e, t, n) {
        var r;
        if (t) {
            if (Array.prototype.indexOf) return Array.prototype.indexOf.call(t, e, n);
            r = t.length,
            n = n ? n < 0 ? Math.max(0, r + n) : n: 0;
            for (; n < r; n++) if (n in t && t[n] === e) return n
        }
        return - 1
    },
    t = {
        map: {},
        order: []
    },
    n = new AppData("api.hao.360.cn", HAO_CONFIG.mysite.r),
    r = function() {
        var e = [];
        for (var r = 0,
        i = t.order.length; r < i; r++) {
            var s = t.map[t.order[r]],
            o = {
                name: s.name,
                url: s.url,
                domain: s.domain
            };
            e.push(o)
        }
        n.set(HAO_CONFIG.mysite.api, e)
    },
    i = function(e) {
        t.order.push(e.sid),
        t.map[e.sid] = e,
        r()
    },
    s = function() {
        r()
    },
    o = function() {
        return n.get(HAO_CONFIG.mysite.api) || []
    },
    u = !1,
    a = mysiteProvider.ERRORCODE,
    f = new mysiteProvider;
    f.ERRORCODE = a,
    f.init = function() {
        if (u) return;
        var e = o();
        for (var t = 0,
        n = e.length; t < n; t++) {
            var r = e[t];
            this.add(new SiteEnt(r.name, r.url))
        }
        u = !0
    },
    f.add = function(e, n) {
        if (!e.name) {
            n(a.NameIsNull);
            return
        }
        if (!e.url) {
            n(a.UrlIsNull);
            return
        }
        if (!e.sid) {
            n(a.SidIsNull);
            return
        }
        if (t.map[e.sid]) {
            n(a.SiteIsExist);
            return
        }
        if (e.name.length > 36) {
            n(a.NameLengthErr);
            return
        }
        if (e.url.length > 247) {
            n(a.UrlLengthErr);
            return
        }
        i(e),
        n && n(a.NoError, e);
        return
    },
    f.getOne = function(e, n) {
        if (!e) {
            n(a.SidIsNull);
            return
        }
        if (!t.map[e]) {
            n(a.SiteIsNotExist);
            return
        }
        n && n(a.NoError, t.map[e]);
        return
    },
    f.getAll = function(e) {
        var n = [],
        r;
        for (var i = 0,
        s = t.order.length; i < s; i++) r = t.map[t.order[i]] || null,
        r && n.push(r);
        e && e(a.NoError, n);
        return
    },
    f.remove = function(n, r) {
        if (!n) {
            r(a.SidIsNull);
            return
        }
        if (!t.map[n]) {
            r(a.SiteIsNotExist);
            return
        }
        var i = t.map[n],
        o = e(n, t.order);
        i && o > -1 && (delete t.map[n], t.order.splice(o, 1)),
        s(),
        r && r(a.NoError, i);
        return
    },
    f.pushToMemory = function() {
        u = !1,
        this.init()
    },
    f.log = function() {
        console.log(t)
    },
    window.MySiteProviderLocal = f
})(); (function() {
    var e = function(e) {
        return Object.prototype.toString.call(e) === "[object Function]"
    },
    t = function(t) {
        if (!t || !e(t)) t = function() {};
        var n = this;
        return function(e, n) {
            var r = {
                errCode: e,
                res: n || null
            };
            t(r)
        }
    },
    n = function(e) {
        var t = MySiteProviderLocal;
        this.provider = t,
        this.ERRORCODE = this.provider.ERRORCODE,
        this.provider.init()
    };
    n.prototype.add = function(e, n, r) {
        var i = new SiteEnt(e, n);
        this.provider.add(i, t(r));
        return
    },
    n.prototype.getAll = function(e) {
        this.provider.getAll(t(e))
    },
    n.prototype.getOne = function(e, n) {
        this.provider.getOne(e, t(n))
    },
    n.prototype.remove = function(e, n) {
        this.provider.remove(e, t(n))
    },
    n.prototype.pushToMemory = function() {
        this.provider.pushToMemory()
    },
    window.MysiteSvc = n
})(); (function() {
    var e = qboot.mix,
    t = qboot.jsonp,
    n = {
        jsonp: "_callback",
        cluster: !1,
        cache: !1,
        storeObj: null,
        appData: "all"
    },
    r = {
        _requests: {},
        _task: null,
        prepare: function(e) {
            var t = this._requests;
            t[e.host] = t[e.host] || [],
            t[e.host].push(e);
            if (!this._task) {
                var n = this;
                this._task = setTimeout(function() {
                    n.send()
                })
            }
        },
        send: function() {
            var r = this._requests,
            i = [];
            for (var s in r) {
                var o = r[s] || [],
                u = [],
                a = {},
                f = {};
                for (var l = 0; l < o.length; l++) {
                    var c = o[l];
                    u.push(c.api),
                    c.api in f ? i.push(c) : (e(a, c.params,
                    function(e, t) {
                        return e == null && (e = []),
                        e instanceof Array || (e = [e]),
                        e.concat([t])
                    }), f[c.api] = c.callback)
                }
                u.length &&
                function(e, r, i) {
                    t(e, r,
                    function(e) {
                        for (var t in i) {
                            var n = i[t];
                            n && e && n(e[t])
                        }
                    },
                    {
                        jsonp: n.jsonp
                    })
                } (s, a, f)
            }
            delete this._requests,
            this._requests = {},
            clearTimeout(this._task),
            delete this._task;
            while (i.length) this.prepare(i.shift())
        }
    },
    i = {
        register: function(t, i) {
            if (i == null) throw new Error("call unknown api:" + apiconf);
            typeof i == "string" ? i = {
                host: i,
                api: arguments[2]
            }: i = e({},
            i),
            e(i, n);
            var s = new JsonpProvider(i);
            s.on("request",
            function(t) {
                var n = t.params;
                t.api && t.cluster && e(t.params, {
                    m: [t.api, t.v, t.r]
                }),
                t.cluster && (r.prepare(t), t.preventDefault())
            });
            var o;
            i.cache && (o = new DataCache(i.api, "api.hao.360.cn", i.r, i.storeObj));
            var u = new DataAdapter(s, o);
            return t.request = function(e, t, n, r) {
                u.update(e, t, n, r)
            },
            t.getApi = function() {
                return u
            },
            t.getCache = function() {
                return o
            },
            t.getDataProvider = function() {
                return s
            },
            t
        }
    };
    e(i, {
        CACHE_QUIET: DataCache.QUIET,
        CACHE_FLUSH: DataCache.FLUSH,
        CACHE_NORMAL: DataCache.NORMAL
    }),
    window.Bus = i
})(); (function() {
    function n(e) {
        this.config = e,
        this.init()
    }
    var e = qboot.mix,
    t = HAO_CONFIG.feedsConfig;
    e(n, {
        get: function(r, i, s, o, u) {
            var a = t[r];
            a.cluster = !0,
            a.cache = !0,
            conf = e(a, s, !0);
            var r = new n(conf);
            r.expires = u || (new Date).getTime() + a.expires;
            var f = conf.params || {};
            r.get(f, i, o)
        }
    }),
    e(n.prototype, {
        get: function(e, t, n) {
            this.request(e, t, n, this.expires)
        },
        init: function() {
            Bus.register(this, this.config)
        }
    }),
    qboot.mix(n, t,
    function(e, t, r) {
        return e ? e: function(e) {
            return function() {
                var t = Array.prototype.slice.call(arguments);
                return n.get.apply(null, [e].concat(t))
            }
        } (r)
    }),
    window.Feed = n
})(); (function() {
    function s(e, t, n, r, i) {
        n.length > 1 && n[2] < 0 && (n[2] = "&nbsp;" + v);
        var s = [r || "\u98ce\u5411\u4e0d\u5b9a", i || "\u5fae\u98ce"].join("\uff1a");
        return {
            icoCode: e,
            weather: t.length !== 1 ? t: "&nbsp;&nbsp;" + t,
            c: n.join("~"),
            wind: s
        }
    }
    var e = qboot.mix,
    t = HAO_CONFIG.weather,
    n = {
        province: [],
        city: {},
        town: {}
    },
    r = !1,
    i = function(e) {
        var n = e.params,
        r = n.code,
        i = n.grade;
        e.host = r || i ? t.cnd_host: t.host,
        e.host += i ? t.area.path: t.weather.path,
        n.app = "hao360"
    },
    o = ["\u4f18", "\u826f\u597d", "\u8f7b\u5ea6\u6c61\u67d3", "\u4e2d\u5ea6\u6c61\u67d3", "\u91cd\u5ea6\u6c61\u67d3", "\u4e25\u91cd\u6c61\u67d3"],
    u = [0, 1, 2, 3, 4, 4, 5, 5, 5, 5],
    a = {
        getWeather: function(e, n, r) {
            var o = Bus.register({},
            {
                jsonp: "_jsonp",
                setup: i,
                filter: function(e) {
                    var t = null,
                    n = (new Date(e.time * 1e3)).getHours(),
                    r = {
                        area: "\u5317\u4eac",
                        weather: {
                            today: {},
                            tomorrow: {}
                        }
                    },
                    i = hao360.todayObj || new Date,
                    o = i.getFullYear(),
                    u = i.getMonth(),
                    a = i.getDate(),
                    f = (new Date(o, u, a)).getTime(),
                    l = (new Date(o, u, a + 1)).getTime();
                    r.area = e.area[2][0],
                    r.code = e.area[2][1];
                    var c = {
                        prov: e.area[0][1],
                        city: e.area[1][1],
                        town: e.area[2][1]
                    },
                    h = !1,
                    p = !1;
                    for (var d = 0,
                    v = e.weather.length; d < v; d++) {
                        var m = e.weather[d],
                        g = m.date.split("-"),
                        y = (new Date(g[0], g[1] - 1, g[2])).getTime();
                        if (y == f || y == l) {
                            if (!m.info) return hao360.errMsg.push("weather no info. " + r.code),
                            {};
                            m.info.dawn || (m.info.dawn = ["0", "\u6674", "0"], hao360.errMsg.push("weather no info dawn. " + r.code)),
                            m.info.day || (m.info.day = ["0", "\u6674", "0"], hao360.errMsg.push("weather no info day. " + r.code)),
                            m.info.night || (m.info.night = ["0", "\u6674", "0"], hao360.errMsg.push("weather no info night. " + r.code))
                        }
                        y == f && (h = h || !0, n >= 18 ? (r.weather.today = s(m.info.night[0], m.info.night[1], [m.info.night[2]], m.info.night[3], m.info.night[4]), t = l) : n < 6 ? (r.weather.today = s(m.info.dawn[0], m.info.dawn[1], [m.info.dawn[2], m.info.day[2]], m.info.dawn[3], m.info.dawn[4]), t = (new Date(o, u, a, 6)).getTime()) : (r.weather.today = s(m.info.day[0], m.info.day[1], [m.info.day[2], m.info.night[2]], m.info.day[3], m.info.day[4]), t = (new Date(o, u, a, 18)).getTime())),
                        y == l && (p = p || !0, r.weather.tomorrow = s(m.info.day[0], m.info.day[1], [m.info.day[2], m.info.night[2]]))
                    }
                    if (!h || !p) r = null;
                    return {
                        a: c,
                        d: r,
                        e: t
                    }
                }
            });
            o.request({
                code: n || a.code,
                v: t.weather.v,
                param: "weather"
            },
            function(n) {
                if (n.d) {
                    var r = new AppData("api.hao.360.cn", t.weather.r);
                    r.set(t.weather.api, n.d, Math.min(n.e, (new Date).getTime() + t.weather.expires)),
                    a.setCode(n.a.town),
                    a.setArea(n.a),
                    e(n.d)
                }
            },
            r)
        },
        getArea: function(e, t, r, s) {
            e = e || "province";
            if (e != "province" && r && n[e][r]) {
                t(n[e][r]);
                return
            }
            if (e == "province" && n[e].length > 0) {
                t(n[e]);
                return
            }
            var o = Bus.register({},
            {
                jsonp: "_jsonp",
                setup: i
            });
            o.request({
                grade: e,
                code: r
            },
            t, s)
        },
        getPm25: function(t, n, r) {
            var i = Bus.register({},
            e(HAO_CONFIG.pm25, {
                jsonp: "_jsonp",
                filter: function(e) {
                    if (e.pm25 && e.pm25.pm25 && e.pm25.pm25.length == 2) return e.pm25
                }
            }));
            i.request({
                code: n || a.code,
                param: "pm25",
                v: HAO_CONFIG.pm25.v,
                app: "hao360"
            },
            function(e) {
                var n = null;
                if (e) {
                    var r = e.pm25[1].toString(),
                    i = /^(\d{4})(\d{2})(\d{2})(\d{2})/.exec(r),
                    s = (new Date(i[1], i[2] - 1, i[3], i[4])).getTime(),
                    a = e.pm25[0],
                    f = Math.floor(Math.max(0, a - 1) / 50),
                    l = typeof u[f] != "undefined" ? u[f] : u[u.length - 1]++,
                    c = o[f] || o[o.length - 1];
                    if ( + (new Date) - s < 144e5) var n = {
                        code: e.area[1],
                        level: c,
                        step: l,
                        pm25: a
                    }
                }
                t(n)
            },
            r)
        },
        getProvince: function(e, t) { ! r && a.loadChinaArea(),
            setTimeout(function() {
                a.getArea("province", e, t)
            },
            r ? 0 : 100)
        },
        getCity: function(e, t, n) {
            a.getArea("city", e, t, n)
        },
        getTown: function(e, t, n) {
            a.getArea("town", e, t, n)
        },
        loadChinaArea: function() {
            if (r) return;
            qboot.load("chinaAreaMap",
            function() {
                qboot.await(function() {
                    return window.QW && window.chinaAreaMap
                },
                function() {
                    var e, t, i, s;
                    for (var o = 0,
                    u = chinaAreaMap.length; o < u; o++) {
                        e = chinaAreaMap[o][1],
                        t = chinaAreaMap[o][0],
                        n.city[e] = [];
                        for (var a = 0,
                        f = chinaAreaMap[o][2].length; a < f; a++) {
                            i = chinaAreaMap[o][2][a][1],
                            s = chinaAreaMap[o][2][a][0],
                            n.town[i] = [];
                            for (var l = 0,
                            c = chinaAreaMap[o][2][a][2].length; l < c; l++) townName = chinaAreaMap[o][2][a][2][l][0],
                            townCode = "101" + chinaAreaMap[o][2][a][2][l][1],
                            n.town[i].push([townName, townCode]);
                            n.city[e].push([s, i])
                        }
                        n.province.push([t, e])
                    }
                    r = !0
                },
                null, 100, 50)
            })
        },
        setCode: function(e) {
            hao360.cityCode.set(e),
            a.code = e
        },
        local: {},
        setArea: function(e) {
            a.local = e,
            hao360.area.set(e)
        }
    };
    window.Weather = a
})(); (function() {
    var e = qboot.mix,
    t = HAO_CONFIG.iguess,
    n = hao360.mid,
    r = {
        OK: 0,
        EMPTY_DATA: 302,
        TIME_OUT: 301,
        NO_GUESS_DATA: 303,
        UNKNOW: -1,
        DEFAULT_DATA: -2
    },
    i = function(n, r, i) {
        var s = {};
        Bus.register(s, e({
            jsonp: "_callback"
        },
        e(t, i, !0), !0)),
        s.request(e({
            v: t.v
        },
        r, !0),
        function(e) {
            n && n(e)
        })
    },
    s = function(e, t) {
        t.errno == r.NO_GUESS_DATA && (t.noRefesh = !0),
        qboot.await(function() {
            return window.IGUESS_DEFAULT_DATA
        },
        function() {
            t.guess = IGUESS_DEFAULT_DATA.data,
            t.v = IGUESS_DEFAULT_DATA.v,
            e && e(t)
        })
    },
    o = {
        get: function(e, t, r) {
            t = t || 1,
            i(function(n) {
                if ((!n || !n.guess.length) && t === 1) {
                    s(e, n);
                    return
                }
                e && e(n)
            },
            {
                mid: n,
                pageno: t,
                c: "index",
                a: "index"
            },
            r)
        },
        getType: function(e, t, r) {
            i(function(e) {
                e && e.guess && e.guess[0] && t && t(e.guess[0])
            },
            {
                c: "index",
                a: "site",
                type: e,
                mid: n
            },
            r)
        }
    };
    o.ERRORS = r,
    window.IGuess = o
})(); (function() {
    var e = qboot.mix,
    t = {
        getOrder: function(t, n) {
            var r = e(HAO_CONFIG.channelOrder, n, !0),
            i = +(new Date),
            s = Bus.register({},
            e({
                cache: !0,
                filter: function(e) {
                    return e && e.errno == 0 ? e.tuijian: []
                }
            },
            r, !0));
            s.request({
                mid: hao360.mid,
                v: r.v
            },
            function(e) { (!e || !e.length) && s.getCache().flush(),
                t && t(e)
            },
            1, i + r.expires)
        },
        getChannel: function(t, n, r) {
            typeof t == "string" && (t = [t]);
            var i = t.sort().join(","),
            s = e(HAO_CONFIG.channelView, e({
                cb: "__jsonp_" + i
            },
            r, !0), !0);
            r && r._r && (s.host = s.d_host);
            var o = Bus.register({},
            s, !0);
            o.request({
                v: s.v,
                keys: i
            },
            function(e) {
                n && n(e)
            })
        }
    };
    window.Channel = t
})(); (function() {
    var e = qboot.mix,
    t = HAO_CONFIG.themeConfig,
    n = "blue",
    r = function() {
        e(t, {
            cache: !0,
            cluster: !0
        },
        !0),
        Bus.register(this, t)
    };
    r.prototype.getList = function(e) {
        this.request(this.params, e)
    },
    window.Theme = r
})(); (function() {
    function e(e) {
        var t = typeof e == "string" ? document.getElementById(e) : e;
        return t ? (t.status = 0 | t.getAttribute("data-rstatus"), t.eid = e.replace(/\-(\w)/ig,
        function(e, t) {
            return t.toUpperCase()
        }), t) : null
    }
    function u(e, n, i) {
        var o = e.callback;
        if (typeof o == "function") o(n.eid, n, i);
        else {
            if (i == r) return;
            var u = o.func,
            a = o.argv;
            for (var f = 0,
            l = a.length; f < l; f++) a[f] == "callback" && (a[f] = function(e) {
                i == t && (R(n).setData(e), s.fire("moduleDataLoaded", {
                    module: n.eid
                }))
            }),
            a[f] == "status" && (a[f] = i);
            typeof u == "function" && (u = [u, window]),
            u[0].apply(u[1], a),
            s.fire("moduleDataRequest", {
                module: n.eid
            })
        }
    }
    var t = DataCache.FLUSH,
    n = DataCache.QUITE,
    r = DataCache.NORMAL,
    i = hao360.cityCode.get(),
    s = {
        "weather-inner": {
            dataconf: HAO_CONFIG.weather.weather,
            callback: {
                func: Weather.getWeather,
                argv: ["callback", i, "status"]
            }
        },
        "iguess-wrap": {
            callback: {
                func: IGuess.get,
                argv: ["callback"]
            }
        }
    };
    qboot.createEvents(s);
    var o = {};
    s.on("moduleDataRequest",
    function(e) {
        o[e.module] = {
            startTime: +(new Date)
        }
    }),
    s.on("moduleDataLoaded",
    function(e) {
        var t = +(new Date),
        n = o[e.module]; ! n || (n.lt = t - n.startTime, delete n.startTime)
    }),
    hao360.moduleMonitorTime = o;
    var a = (new Date).getTime();
    TimeSVC.getTime(function(e) {
        var t = e.getTime(),
        n = new AppData("api.hao.360.cn");
        Math.abs(a - t) > 3e5 ? (hao360.todayObj = e, n.set("timeOffset", a - t)) : n.remove("timeOffset")
    }),
    setTimeout(function() {
        for (var i in s) {
            if (!e(i)) continue;
            var o = e(i),
            a = s[i];
            if (a.callback) {
                var f = r;
                if (o.status != R.STATUS_OK) f = t;
                else if (a.dataconf && a.dataconf.quietUpdateTime) {
                    var l = (new Date).getTime(),
                    c = new AppData("api.hao.360.cn", a.dataconf.r),
                    h = c.getUpdatedTime(a.dataconf.api);
                    h + a.dataconf.quietUpdateTime < l && (f = n)
                }
                if (f == r) continue; (function(e, t, n) {
                    e.requires ? qboot.load.apply(null, e.requires.concat(function() {
                        u(e, t, n)
                    })) : u(e, t, n)
                })(a, o, f)
            }
        }
    },
    20);
    var f = hao360.channelOrder,
    l = hao360.showedChannel;
    if (f) {
        for (var h = 0,
        p = f.length; h < p; h++)(function(e) {
            var t = "channel-" + e,
            n = "channelview-" + e,
            r = "channelloading-" + e,
            i = R(n);
            i.render(function(e) {
                hao360.g(r).style.display = "none",
                window.QW && Dom.fadeIn && W("#" + n).hide().fadeIn(),
                hao360.g(n).innerHTML = e,
                hao360.g(t).style.display = "block"
            })
        })(f[h]);
        for (c = 0, cl = l.length; c < cl; c++)(function(e) {
            var t = "channelview-" + e,
            n = R(t);
            if (!n) return;
            Channel.getChannel(e,
            function(t) {
                var r = t && t.data && t.data[e];
                n.setData(r)
            })
        })(l[c])
    }
})();