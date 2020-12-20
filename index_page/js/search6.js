(function() {
    function r(t) {
        this.conf = e({
            wrapEl: "#search",
            tabsEl: ".tab>li",
            engsElWap: ".eng-list",
            defaultCate: "webpage",
            defaultEng: "somulti",
            cateChangeEvent: "click",
            engChangeEvent: "click",
            tabsOnClass: "on"
        },
        t, !0),
        e(this, this.conf),
        this._init()
    }
    var e = QW.ObjectH.mix,
    t = QW.CustEvent.createEvents,
    n = ObjectH.isArray;
    r.UI = function(t) {
        e(this, e(t, {
            kwEl: "#search-kw",
            sbtnEl: "#search-btn",
            logoShowEl: "#eng-logo",
            formEl: "#search-form"
        }), !0),
        this._init()
    },
    r.UI.prototype = {
        _init: function() {},
        selectTab: function(e) {
            W(this.tabsEl + "[data-cate]", W(this.wrapEl)).removeClass(this.tabsOnClass),
            W(this.tabsEl + "[data-cate=" + e + "]", W(this.wrapEl)).addClass(this.tabsOnClass)
        },
        updateForms: function(e, t, n) {
            var r = n[0],
            i = n[1],
            s = n[5] || n[2] + "\u641c\u7d22",
            o = n[3],
            u = n[4],
            a = u.split(";"),
            f = W(this.formEl);
            if (!f && W(this.kwEl, f)) return;
            var l = '<input type="hidden" name="$1" value="$2" />',
            c = e + "-" + t;
            W(".others-params input", f).forEach(function(e) {
                e.disabled = !0
            });
            if (W("." + c, f).length) W("." + c + " input", f).forEach(function(e) {
                e.disabled = !1
            });
            else {
                var h = W('<div class="others-params" style="display:none"></div>'),
                p = "";
                h.addClass(c),
                h.addClass("cates-" + e),
                a.forEach(function(e) {
                    var t = e.split(":");
                    p += l.replace("$1", t[0]).replace("$2", t[1])
                }),
                h.html(p),
                f.insert("afterbegin", h)
            }
            W(this.kwEl, f).attr("name", i).val(W(this.kwEl, f).val()).focus();
            var d = W(this.sbtnEl, f);
            d[0] && d[0].nodeName.toLowerCase() == "button" ? d[0].innerHTML = s: d.val(s),
            f.attr("action", r),
            W(this.logoShowEl, W(this.wrapEl)).length && W(this.logoShowEl, W(this.wrapEl)).attr("className", t).attr("href", o).attr("title", n[2])
        },
        rmHiddenInputs: function(e, t) {
            if (!W(this.formEl)) return;
            var n = this;
            e.forEach(function(e) {
                var r = W("." + t + "-" + e);
                r.length && W(n.formEl).removeChild(r)
            })
        },
        rmTabs: function(e) {
            n(e) || (e = [e]);
            var t = this;
            e.forEach(function(e) {
                W(W(".cates-" + e), t.formEl).length && W(t.formEl).removeChild(W(".cates-" + e))
            })
        },
        updateTabs: function(e, t) {
            if (!e) return;
            var n = W(this.formEl);
            if (!n) return;
            var r = this;
            e.forEach(function(e, i) {
                W(r.tabsEl + "[data-cate=" + e + "]", W(r.wrapEl)).attr("data-cate", t[i]),
                W(".cates-" + e, n).toggleClass("cates-" + e, "cates-" + t[i])
            })
        }
    };
    var i = ["change", "catechange", "error", "update"];
    e(r.prototype, {
        _init: function() {
            this.cate = this.defaultCate,
            this.eng = this.defaultByCate[this.cate],
            this.engid = [this.cate, this.eng].join("-"),
            this.lastEngOfCate = e(this.defaultByCate, {}),
            this.lastEngOfCate[this.cate] = this.eng,
            t(this, i),
            this.ui = new r.UI(this.conf)
        },
        _onUpdate: function(e, t, n) {
            e == "update" && t && this.ui.rmHiddenInputs(t, n)
        },
        _onUpdateCate: function(e, t, n) {
            switch (e) {
            case "removecate":
                this.ui.rmTabs(t);
                break;
            case "updatecate":
                this.ui.updateTabs(t, n)
            }
        },
        _onChangeCate: function() {
            this.ui.selectTab(this.cate)
        },
        _onChangeEng: function() {
            var e = this.engData[this.cate][this.eng];
            this.ui.updateForms(this.cate, this.eng, e)
        },
        getCate: function() {
            return this.cate
        },
        getEng: function() {
            return [this.cate, this.eng]
        },
        setCate: function(e, t, n) {
            return e == this.cate && !n || !this.engData[e] ? (this.fire("error", {
                code: "301",
                data: {
                    funcName: "setCate",
                    cate: this.cate,
                    eng: this.eng
                },
                msg: "\u9519\u8bef\u7684cate\u540d\u6216cate\u540d\u65e0\u53d8\u5316"
            }), this) : (this.cate = e, this.setEng(t || this.lastEngOfCate[e], e), this.fire("catechange", {
                cate: this.cate,
                eng: this.lastEngOfCate[this.cate],
                data: this.engData[this.cate]
            }) && this._onChangeCate(), this)
        },
        setEng: function(e, t, n) {
            var t = t || this.cate;
            return ! e || this.engid == [t, e].join("-") && !n ? (this.fire("error", {
                code: "302",
                data: {
                    funcName: "setEng",
                    cate: this.cate,
                    eng: this.eng
                },
                msg: "\u672a\u6307\u5b9a\u641c\u7d22\u5f15\u64ce\u540d\u6216\u6307\u5b9a\u7684\u641c\u7d22\u5f15\u64ce\u4e0e\u5f53\u524d\u6ca1\u53d8\u5316"
            }), this) : !this.engData[t] || !this.engData[t][e] ? (this.fire("error", {
                code: "404",
                data: {
                    funcName: "setEng",
                    cate: this.cate,
                    eng: this.eng
                },
                msg: "\u6ca1\u6709\u8be5\u641c\u7d22\u5f15\u64ce"
            }), this) : t != this.cate ? (this.setCate(t, e), this) : (this.eng = e, this.engid = [t, e].join("-"), this.lastEngOfCate[t] = this.eng, this.fire("change", {
                cate: this.cate,
                eng: this.eng,
                data: this.engData[this.cate][this.eng]
            }) && this._onChangeEng(), this)
        },
        set: function(e, t) {
            return this.setEng(e, t)
        },
        get: function() {
            return this.getEng()
        },
        setDefaults: function(t, n) {
            var r = {};
            if (cateof(t) == "string" && n) r[t] = n;
            else {
                if (cateof(t) != "object") return this.fire("error", {
                    code: "400",
                    data: {
                        funcName: "setDefaults",
                        cate: this.cate,
                        eng: this.eng
                    },
                    msg: "\u53c2\u6570\u9519\u8bef"
                }),
                this;
                r = e(r, t, !0)
            }
            for (var i in r) this.defaultByCate[i] && this.engData[i][r[i]] ? this.defaultByCate[i] = r[i] : this.fire("error", {
                code: "404",
                data: {
                    funcName: "setDefaults",
                    cate: this.cate,
                    eng: this.eng
                },
                msg: "\u6ca1\u6709\u5982\u4e0bcate\u6216\u641c\u7d22\u5f15\u64ce\uff1a" + [i, r[i]]
            });
            return this
        },
        update: function(e, t, n) {
            t = t || this.cate;
            var r = this,
            i = [];
            for (var s in e) {
                var o = s;
                if (!r.engData[t][s] || !n) r.engData[t][s] = e[s],
                i.push(o)
            }
            var u = n ? "add": "update";
            return this.fire("update", {
                action: u,
                keys: i
            }) && this._onUpdate(u, i, t),
            t == this.cate && i.indexOf(this.eng) != -1 && this.setEng(this.eng, this.cate, !0),
            this
        },
        updateParams: function(e, t) {
            var n = {},
            r = [],
            t = t || {};
            e.split(";").forEach(function(e) {
                var t = e.split(":");
                n[t[0]] = t[1]
            }),
            qboot.mix(n, t, !0);
            for (var i in n) r.push(i + ":" + n[i]);
            return r.join(";")
        },
        add: function(e, t) {
            this.update(e, t, !0)
        },
        remove: function(e, t) {
            t = t || this.cate;
            var r = this;
            if (!this.engData[t]) return this.fire("error", {
                code: "404",
                data: {
                    funcName: "remove",
                    cate: this.cate,
                    eng: this.eng
                },
                msg: "\u6ca1\u6709\u8be5\u5206\u7c7b\u7684\u641c\u7d22\u5f15\u64ce\u6570\u636e"
            }),
            this;
            n(e) || (e = [e]);
            var i = !0,
            s = [];
            return e.forEach(function(e) {
                r.eng == e && (r.fire("error", {
                    code: "405",
                    data: {
                        funcName: "remove",
                        cate: this.cate,
                        eng: this.eng
                    },
                    msg: "\u4e0d\u80fd\u5220\u9664\u5f53\u524d\u6b63\u5728\u4f7f\u7528\u7684\u641c\u7d22\u5f15\u64ce:" + e
                }), i = !1),
                r.engData[t][e] || (r.fire("error", {
                    code: "404",
                    data: {
                        funcName: "remove",
                        cate: this.cate,
                        eng: this.eng
                    },
                    msg: "\u6ca1\u6709\u8be5\u641c\u7d22\u5f15\u64ce:" + e
                }), i = !1),
                i && (delete r.engData[t][e], s.push(e)),
                i = !0
            }),
            this.fire("update", {
                action: "remove",
                keys: s
            }) && this._onUpdate("remove", s, t),
            this
        },
        addCate: function(e, t, n) {
            if (this.engData[e]) {
                this.fire("error", {
                    code: "409",
                    data: {
                        funcName: "addCate",
                        cate: this.cate,
                        eng: this.eng
                    },
                    msg: "\u5df2\u6709\u8be5\u5206\u7c7b\uff1a" + e
                });
                return
            }
            return this.defaultByCate[e] = t || "",
            this.engData[e] = {},
            n && this.add(n, e),
            this.fire("update", {
                action: "addcate",
                cates: e
            }) && this._onUpdateCate("addcate", e),
            this
        },
        removeCate: function(e) {
            arguments.length > 1 && (e = Array.prototype.slice.call(arguments)),
            n(e) || (e = [e]);
            var t = this,
            r = [];
            return e.forEach(function(e) {
                if (!t.engData[e]) {
                    t.fire("error", {
                        code: "404",
                        data: {
                            funcName: "removeCate",
                            cate: this.cate,
                            eng: this.eng
                        },
                        msg: "\u6ca1\u6709\u8be5\u5206\u7c7b\uff1a" + e
                    });
                    return
                }
                if (e == t.cate) {
                    t.fire("error", {
                        code: "405",
                        data: {
                            funcName: "removeCate",
                            cate: this.cate,
                            eng: this.eng
                        },
                        msg: "\u4e0d\u80fd\u5220\u9664\u5f53\u524d\u6b63\u5728\u4f7f\u7528\u7684\u5206\u7c7b" + e
                    });
                    return
                }
                delete t.defaultByCate[e],
                delete t.engData[e],
                r.push(e)
            }),
            this.fire("update", {
                action: "removecate",
                cates: r
            }) && this._onUpdateCate("removecate", r),
            this
        },
        updateCate: function(e, t) {
            var r = Array.prototype.slice.call(arguments);
            n(r[0]) || (r = [[r[0], r[1]]]);
            var i = this,
            s = [],
            o = [];
            return r.forEach(function(e) {
                var t = e[0],
                n = e[1]; ! t || !newcate ? i.fire("error", {
                    code: "400",
                    data: {
                        funcName: "updateCate",
                        cate: this.cate,
                        eng: this.eng
                    },
                    msg: "\u53c2\u6570\u9519\u8bef"
                }) : i.engData[t] ? i.engData[newcate] ? i.fire("error", {
                    code: "501",
                    data: {
                        funcName: "updateCate",
                        cate: this.cate,
                        eng: this.eng
                    },
                    msg: "\u4e0d\u80fd\u547d\u540d\u6210\u4ee5\u4e0b\u5206\u7c7b\uff0c\u56e0\u4e3a\u5206\u7c7b\u5df2\u5b58\u5728\uff1a" + n
                }) : t == i.cate ? i.fire("error", {
                    code: "405",
                    data: {
                        funcName: "updateCate",
                        cate: this.cate,
                        eng: this.eng
                    },
                    msg: "\u4e0d\u80fd\u66f4\u65b0\u6b63\u5728\u4f7f\u7528\u7684\u5206\u7c7b\uff1a" + t
                }) : (i.defaultByCate[newcate] = i.defaultByCate[t], i.engData[newcate] = i.engData[t], delete i.defaultByCate[t], delete i.engData[t], s.push(t), o.push(newcate)) : i.fire("error", {
                    code: "404",
                    data: {
                        funcName: "updateCate",
                        cate: this.cate,
                        eng: this.eng
                    },
                    msg: "\u6ca1\u6709\u8be5\u5206\u7c7b\uff1a" + t
                })
            }),
            this.fire("update", {
                action: "updatecate",
                cates: s
            }) && this._onUpdateCate("updatecate", s, o),
            this
        },
        _cateChangeListener: function() {
            if (!this.tabsEl) return;
            var e = this,
            t = this.wrapEl + " " + this.tabsEl + "[data-cate]";
            W(document).delegate(t, this.cateChangeEvent,
            function(t) {
                W(this).hasClass(e.tabsOnClass) || t.preventDefault(),
                e.setCate(W(this).attr("data-cate"))
            }).delegate(t, "mouseover",
            function(e) {
                W(this).addClass("hover")
            }).delegate(t, "mouseout",
            function(e) {
                W(this).removeClass("hover")
            })
        },
        _engChangeListener: function() {
            if (!this.engsElWap) return;
            var e = this,
            t = this.wrapEl + " " + this.engsElWap + " *[data-site]";
            W(document).delegate(t, this.engChangeEvent,
            function(t) {
                t.preventDefault(),
                e.setEng(W(this).attr("data-site"), W(this).attr("data-cate"))
            })
        },
        render: function(e, t, n) {
            var t = t || W(this.tabsEl + "." + this.tabsOnClass, W(this.wrapEl)).attr("data-cate") || this.cate,
            e = e || this.defaultByCate[t] || this.eng;
            return n !== !1 && this.wrapEl && (this._cateChangeListener(), this._engChangeListener()),
            this.setCate(t, e, !0).setEng(e, t, !0),
            this
        }
    }),
    QW.provide("SearchTab", r)
})();