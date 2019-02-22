! function(b, c) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = c(require("d3"), require("d3.chart"));
    else if ("function" == typeof define && define.amd) define(["d3", "d3.chart"], c);
    else {
        var d = "object" == typeof exports ? c(require("d3"), require("d3.chart")) : c(b.d3, b.d3.chart);
        for (var e in d)("object" == typeof exports ? exports : b)[e] = d[e]
    }
}(this, function(a, b) {
    return function(a) {
        function c(d) {
            if (b[d]) return b[d].exports;
            var e = b[d] = {
                exports: {},
                id: d,
                loaded: !1
            };
            return a[d].call(e.exports, e, e.exports, c), e.loaded = !0, e.exports
        }
        var b = {};
        return c.m = a, c.c = b, c.p = "", c(0)
    }([function(a, b, c) {
        "use strict";
        var d = c(1);
        d.Sankey = d, d.Base = c(4), d.Selection = c(6), d.Path = c(7), a.exports = d
    }, function(a, b, c) {
        "use strict";
        var d = c(2),
            e = c(3),
            f = c(4);
        a.exports = f.extend("Sankey", {
            initialize: function() {
                function b(b) {
                    var c = a.features.alignLabel;
                    return "function" == typeof c && (c = c(b)), "auto" === c && (c = b.x < a.features.width / 2 ? "start" : "end"), c
                }

                function c(b) {
                    return "function" == typeof a.features.colorNodes ? a.features.colorNodes(a.features.name(b), b) : a.features.colorNodes
                }

                function f(b) {
                    return "function" == typeof a.features.colorLinks ? a.features.colorLinks(b) : a.features.colorLinks
                }
                var a = this;
                a.d3.sankey = e(), a.d3.path = a.d3.sankey.link(), a.d3.sankey.size([a.features.width, a.features.height]), a.features.spread = !1, a.features.iterations = 32, a.features.nodeWidth = a.d3.sankey.nodeWidth(), a.features.nodePadding = a.d3.sankey.nodePadding(), a.features.alignLabel = "auto", a.layers.links = a.layers.base.append("g").classed("links", !0), a.layers.nodes = a.layers.base.append("g").classed("nodes", !0), a.on("change:sizes", function() {
                    a.d3.sankey.nodeWidth(a.features.nodeWidth), a.d3.sankey.nodePadding(a.features.nodePadding)
                }), a.layer("links", a.layers.links, {
                    dataBind: function(a) {
                        return this.selectAll(".link").data(a.links)
                    },
                    insert: function() {
                        return this.append("path").classed("link", !0)
                    },
                    events: {
                        enter: function() {
                            this.on("mouseover", function(b) {
                                a.trigger("link:mouseover", b)
                            }), this.on("mouseout", function(b) {
                                a.trigger("link:mouseout", b)
                            }), this.on("click", function(b) {
                                a.trigger("link:click", b)
                            })
                        },
                        merge: function() {
                            this.attr("d", a.d3.path).style("stroke", f).style("stroke-width", function(a) {
                                return Math.max(1, a.dy)
                            }).sort(function(a, b) {
                                return b.dy - a.dy
                            })
                        },
                        exit: function() {
                            this.remove()
                        }
                    }
                }), a.layer("nodes", a.layers.nodes, {
                    dataBind: function(a) {
                        return this.selectAll(".node").data(a.nodes)
                    },
                    insert: function() {
                        return this.append("g").classed("node", !0).attr("data-node-id", function(a) {
                            return a.id
                        })
                    },
                    events: {
                        enter: function() {
                            this.append("rect").attr("class", "allianceLogo"), this.append("rect").attr("class", "airlineLogo"), this.append("text").attr("dy", ".35em").attr("transform", null), this.on("mouseover", function(b) {
                                a.trigger("node:mouseover", b)
                            }), this.on("mouseout", function(b) {
                                a.trigger("node:mouseout", b)
                            }), this.on("click", function(b) {
                                a.trigger("node:click", b)
                            })
                        },
                        merge: function() {
                            this.attr("transform", function(a) {
                                return "translate(" + a.x + "," + a.y + ")"
                            }), this.selectAll("rect").filter(".allianceLogo").attr("height", function(a) {
                                return 15
                            }).attr("width", a.features.nodeWidth).style("fill", c).style("stroke", function(a) {
                                return d.rgb(c(a)).darker(2)
                            }), this.selectAll("rect").filter(".airlineLogo").attr("height", function(a) {
                                return a.name.indexOf("[") >= 0 ? 15 : a.dy
                            }).attr("width", a.features.nodeWidth).attr("x", function(a) {
                                return a.name.indexOf("[") >= 0 ? "start" === b(a) ? 15 : -15 : 0
                            }).style("fill", c).style("stroke", function(a) {
                                return d.rgb(c(a)).darker(2)
                            }), this.select("text").text(a.features.name).attr("y", function(a) {
                                return a.dy / 2
                            }).attr("x", function(a) {
                                return a.name.indexOf("[") >= 0 ? "start" === b(a) ? 35 : -20 : 20
                            }).attr("text-anchor", b)
                        },
                        exit: function() {
                            this.remove()
                        }
                    }
                })
            },
            transform: function(a) {
                var b = this;
                return b.data = a, b.d3.sankey.nodes(a.nodes).links(a.links).layout(b.features.iterations), this.features.spread && (this._spreadNodes(a), b.d3.sankey.relayout()), a
            },
            iterations: function(a) {
                return arguments.length ? (this.features.iterations = a, this.data && this.draw(this.data), this) : this.features.iterations
            },
            nodeWidth: function(a) {
                return arguments.length ? (this.features.nodeWidth = a, this.trigger("change:sizes"), this.data && this.draw(this.data), this) : this.features.nodeWidth
            },
            nodePadding: function(a) {
                return arguments.length ? (this.features.nodePadding = a, this.trigger("change:sizes"), this.data && this.draw(this.data), this) : this.features.nodePadding
            },
            spread: function(a) {
                return arguments.length ? (this.features.spread = a, this.data && this.draw(this.data), this) : this.features.spread
            },
            alignLabel: function(a) {
                return arguments.length ? (this.features.alignLabel = a, this.data && this.draw(this.data), this) : this.features.alignLabel
            },
            _spreadNodes: function(a) {
                var b = this,
                    c = d.nest().key(function(a) {
                        return a.x
                    }).entries(a.nodes).map(function(a) {
                        return a.values
                    });
                c.forEach(function(a) {
                    var c, e, f = d.sum(a, function(a) {
                            return a.dy
                        }),
                        g = (b.features.height - f) / a.length,
                        h = 0;
                    for (a.sort(function(a, b) {
                            return a.y - b.y
                        }), c = 0; c < a.length; ++c) e = a[c], e.y = h, h += e.dy + g
                })
            }
        })
    }, function(b, c) {
        b.exports = a
    }, function(a, b, c) {
        var d = c(2);
        d.sankey = function() {
            function h() {
                f.forEach(function(a) {
                    a.sourceLinks = [], a.targetLinks = []
                }), g.forEach(function(a) {
                    var b = a.source,
                        c = a.target;
                    "number" == typeof b && (b = a.source = f[a.source]), "number" == typeof c && (c = a.target = f[a.target]), b.sourceLinks.push(a), c.targetLinks.push(a)
                })
            }

            function i() {
                f.forEach(function(a) {
                    a.value = Math.max(d.sum(a.sourceLinks, q), d.sum(a.targetLinks, q))
                })
            }

            function j() {
                for (var c, a = f, d = 0; a.length;) c = [], a.forEach(function(a) {
                    a.x = d, a.dx = b, a.sourceLinks.forEach(function(a) {
                        c.push(a.target)
                    })
                }), a = c, ++d;
                l(d), m((e[0] - b) / (d - 1))
            }

            function l(a) {
                f.forEach(function(b) {
                    b.sourceLinks.length || (b.x = a - 1)
                })
            }

            function m(a) {
                f.forEach(function(b) {
                    b.x *= a
                })
            }

            function n(a) {
                function i() {
                    var a = d.min(b, function(a) {
                        return (e[1] - (a.length - 1) * c) / d.sum(a, q)
                    });
                    b.forEach(function(b) {
                        b.forEach(function(b, c) {
                            b.y = c, b.dy = b.value * a
                        })
                    }), g.forEach(function(b) {
                        b.dy = b.value * a
                    })
                }

                function j(a) {
                    function c(a) {
                        return p(a.source) * a.value
                    }
                    b.forEach(function(b, e) {
                        b.forEach(function(b) {
                            if (b.targetLinks.length) {
                                var e = d.sum(b.targetLinks, c) / d.sum(b.targetLinks, q);
                                b.y += (e - p(b)) * a
                            }
                        })
                    })
                }

                function k(a) {
                    function c(a) {
                        return p(a.target) * a.value
                    }
                    b.slice().reverse().forEach(function(b) {
                        b.forEach(function(b) {
                            if (b.sourceLinks.length) {
                                var e = d.sum(b.sourceLinks, c) / d.sum(b.sourceLinks, q);
                                b.y += (e - p(b)) * a
                            }
                        })
                    })
                }

                function l() {
                    b.forEach(function(a) {
                        var b, d, h, f = 0,
                            g = a.length;
                        for (a.sort(m), h = 0; h < g; ++h) b = a[h], d = f - b.y, d > 0 && (b.y += d), f = b.y + b.dy + c;
                        if (d = f - c - e[1], d > 0)
                            for (f = b.y -= d, h = g - 2; h >= 0; --h) b = a[h], d = b.y + b.dy + c - f, d > 0 && (b.y -= d), f = b.y
                    })
                }

                function m(a, b) {
                    return a.y - b.y
                }
                var b = d.nest().key(function(a) {
                    return a.x
                }).sortKeys(d.ascending).entries(f).map(function(a) {
                    return a.values
                });
                i(), l();
                for (var h = 1; a > 0; --a) k(h *= .99), l(), j(h), l()
            }

            function o() {
                function a(a, b) {
                    return a.source.y - b.source.y
                }

                function b(a, b) {
                    return a.target.y - b.target.y
                }
                f.forEach(function(c) {
                    c.sourceLinks.sort(b), c.targetLinks.sort(a)
                }), f.forEach(function(a) {
                    var b = 0,
                        c = 0;
                    a.sourceLinks.forEach(function(a) {
                        a.sy = b, b += a.dy
                    }), a.targetLinks.forEach(function(a) {
                        a.ty = c, c += a.dy
                    })
                })
            }

            function p(a) {
                return a.y + a.dy / 2
            }

            function q(a) {
                return a.value
            }
            var a = {},
                b = 24,
                c = 8,
                e = [1, 1],
                f = [],
                g = [];
            return a.nodeWidth = function(c) {
                return arguments.length ? (b = +c, a) : b
            }, a.nodePadding = function(b) {
                return arguments.length ? (c = +b, a) : c
            }, a.nodes = function(b) {
                return arguments.length ? (f = b, a) : f
            }, a.links = function(b) {
                return arguments.length ? (g = b, a) : g
            }, a.size = function(b) {
                return arguments.length ? (e = b, a) : e
            }, a.layout = function(b) {
                return h(), i(), j(), n(b), o(), a
            }, a.relayout = function() {
                return o(), a
            }, a.link = function() {
                function b(b) {
                    var c = b.source.x + b.source.dx,
                        e = b.target.x,
                        f = d.interpolateNumber(c, e),
                        g = f(a),
                        h = f(1 - a),
                        i = b.source.y + b.sy + b.dy / 2,
                        j = b.target.y + b.ty + b.dy / 2;
                    return "M" + c + "," + i + "C" + g + "," + i + " " + h + "," + j + " " + e + "," + j
                }
                var a = .5;
                return b.curvature = function(c) {
                    return arguments.length ? (a = +c, b) : a
                }, b
            }, a
        }, a.exports = d.sankey
    }, function(a, b, c) {
        "use strict";
        var d = c(2),
            e = c(5);
        a.exports = e("Sankey.Base", {
            initialize: function() {
                var a = this;
                a.features = {}, a.d3 = {}, a.layers = {}, a.base.attr("width") || a.base.attr("width", a.base.node().parentNode.clientWidth), a.base.attr("height") || a.base.attr("height", a.base.node().parentNode.clientHeight), a.features.margins = {
                    top: 1,
                    right: 1,
                    bottom: 6,
                    left: 1
                }, a.features.width = a.base.attr("width") - a.features.margins.left - a.features.margins.right, a.features.height = a.base.attr("height") - a.features.margins.top - a.features.margins.bottom, a.features.name = function(a) {
                    return a.name
                }, a.features.colorNodes = d.scale.category20c(), a.features.colorLinks = null, a.layers.base = a.base.append("g").attr("transform", "translate(" + a.features.margins.left + "," + a.features.margins.top + ")")
            },
            name: function(a) {
                return arguments.length ? (this.features.name = a, this.trigger("change:name"), this.root && this.draw(this.root), this) : this.features.name
            },
            colorNodes: function(a) {
                return arguments.length ? (this.features.colorNodes = a, this.trigger("change:color"), this.root && this.draw(this.root), this) : this.features.colorNodes
            },
            colorLinks: function(a) {
                return arguments.length ? (this.features.colorLinks = a, this.trigger("change:color"), this.data && this.draw(this.data), this) : this.features.colorLinks
            }
        })
    }, function(a, c) {
        a.exports = b
    }, function(a, b, c) {
        "use strict";
        var d = c(1);
        a.exports = d.extend("Sankey.Selection", {
            initialize: function() {
                function b() {
                    return a.features.selection && a.features.selection.length ? this.style("opacity", function(b) {
                        return a.features.selection.indexOf(b) >= 0 ? 1 : a.features.unselectedOpacity
                    }) : this.style("opacity", 1)
                }

                function c() {
                    var c = a.layers.base.selectAll(".node, .link").transition();
                    a.features.selection && a.features.selection.length || (c = c.delay(100)), b.apply(c.duration(50))
                }
                var a = this;
                a.features.selection = null, a.features.unselectedOpacity = .2, a.on("link:mouseover", a.selection), a.on("link:mouseout", function() {
                    a.selection(null)
                }), a.on("node:mouseover", a.selection), a.on("node:mouseout", function() {
                    a.selection(null)
                }), a.on("change:selection", c), this.layer("links").on("enter", b), this.layer("nodes").on("enter", b)
            },
            selection: function(a) {
                return arguments.length ? (this.features.selection = !a || a instanceof Array ? a : [a], this.trigger("change:selection"), this) : this.features.selection
            },
            unselectedOpacity: function(a) {
                return arguments.length ? (this.features.unselectedOpacity = a, this.trigger("change:selection"), this) : this.features.unselectedOpacity
            }
        })
    }, function(a, b, c) {
        "use strict";

        function e(a, b) {
            return a.source && a.target ? f(a, b) : g(a, b)
        }

        function f(a, b) {
            var c = [a];
            return b = b || "both", "source" != b && "both" != b || (c = c.concat(g(a.source, "source"))), "target" != b && "both" != b || (c = c.concat(g(a.target, "target"))), c
        }

        function g(a, b) {
            var c = [a];
            return b = b || "both", ("source" == b && a.sourceLinks.length < 2 || "both" == b) && a.targetLinks.forEach(function(a) {
                c = c.concat(f(a, b))
            }), ("target" == b && a.targetLinks.length < 2 || "both" == b) && a.sourceLinks.forEach(function(a) {
                c = c.concat(f(a, b))
            }), c
        }
        var d = c(6);
        a.exports = d.extend("Sankey.Path", {
            selection: function(a) {
                var b = this;
                return arguments.length ? (b.features.selection = !a || a instanceof Array ? a : [a], b.features.selection && b.features.selection.forEach(function(a) {
                    e(a).forEach(function(a) {
                        b.features.selection.push(a)
                    })
                }), b.trigger("change:selection"), b) : b.features.selection
            }
        })
    }])
});
