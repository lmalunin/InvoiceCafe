
/**
 * @module       RD Navbar
 * @author       Evgeniy Gusarov
 * @see          https://ua.linkedin.com/pub/evgeniy-gusarov/8a/a40/54a
 * @version      2.1.6
 */
(function () {
	var m;
	m = "ontouchstart" in window;
	(function (d, p, l) {
		var n;
		n = function () {
			function c(a, b) {
				this.options = d.extend(!1, {}, this.Defaults, b);
				this.$element = d(a);
				this.$clone = null;
				this.$win = d(l);
				this.$doc = d(p);
				this.currentLayout = this.options.layout;
				this.loaded = !1;
				this.focusOnHover = this.options.focusOnHover;
				this.isStuck = this.cloneTimer = this.focusTimer = !1;
				this.initialize()
			}

			c.prototype.Defaults = {
				layout: "rd-navbar-static",
				deviceLayout: "rd-navbar-fixed",
				focusOnHover: !0,
				focusOnHoverTimeout: 100,
				linkedElements: ["html"],
				domAppend: !0,
				stickUp: !0,
				stickUpClone: !0,
				stickUpOffset: "100%",
				anchorNavSpeed: 400,
				anchorNavOffset: 0,
				anchorNavEasing: "swing",
				autoHeight: !0,
				responsive: {
					0: {
						layout: "rd-navbar-fixed",
						deviceLayout: "rd-navbar-fixed",
						focusOnHover: !1,
						stickUp: !1
					},
					992: {layout: "rd-navbar-static", deviceLayout: "rd-navbar-static", focusOnHover: !0, stickUp: !0}
				},
				callbacks: {
					onToggleSwitch: !1,
					onToggleClose: !1,
					onDomAppend: !1,
					onDropdownOver: !1,
					onDropdownOut: !1,
					onDropdownToggle: !1,
					onDropdownClose: !1,
					onStuck: !1,
					onUnstuck: !1,
					onAnchorChange: !1
				}
			};
			c.prototype.initialize = function () {
				this.$element.addClass("rd-navbar").addClass(this.options.layout);
				m && this.$element.addClass("rd-navbar--is-touch");
				this.setDataAPI(this);
				this.options.domAppend && this.createNav(this);
				this.options.stickUpClone && this.createClone(this);
				this.applyHandlers(this);
				this.offset = this.$element.offset().top;
				this.height = this.$element.outerHeight();
				this.loaded = !0;
				return this
			};
			c.prototype.resize = function (a, b) {
				var e, g;
				g = m ? a.getOption("deviceLayout") : a.getOption("layout");
				e = a.$element.add(a.$clone);
				g === a.currentLayout && a.loaded || (a.switchClass(e, a.currentLayout, g), null != a.options.linkedElements && d.grep(a.options.linkedElements, function (b, e) {
					return a.switchClass(b, a.currentLayout + "-linked", g + "-linked")
				}), a.currentLayout = g);
				a.focusOnHover = a.getOption("focusOnHover");
				return a
			};
			c.prototype.stickUp = function (a, b) {
				var e, g, f, c;
				g = a.getOption("stickUp");
				e = a.$doc.scrollTop();
				c = null != a.$clone ? a.$clone : a.$element;
				f = a.getOption("stickUpOffset");
				f = "string" === typeof f ? 0 < f.indexOf("%") ? parseFloat(f) * a.height / 100 : parseFloat(f) : f;
				if (g) {
					if (e >= f && !a.isStuck || e < f && a.isStuck)if (a.$element.add(a.$clone).find("[data-rd-navbar-toggle]").each(function () {
							d.proxy(a.closeToggle, this)(a, !1)
						}).end().find(".rd-navbar-submenu").removeClass("opened").removeClass("focus"), e >= f && !a.isStuck)"resize" === b.type ? a.switchClass(c, "", "rd-navbar--is-stuck") : c.addClass("rd-navbar--is-stuck"), a.isStuck = !0, a.options.callbacks.onStuck && a.options.callbacks.onStuck.call(a); else {
						if ("resize" === b.type)a.switchClass(c, "rd-navbar--is-stuck", ""); else c.removeClass("rd-navbar--is-stuck").one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", d.proxy(a.resizeWrap, a, b));
						a.isStuck = !1;
						a.options.callbacks.onUnstuck && a.options.callbacks.onUnstuck.call(a)
					}
				} else a.isStuck && (a.switchClass(c, "rd-navbar--is-stuck", ""), a.isStuck = !1, a.resizeWrap(b));
				return a
			};
			c.prototype.resizeWrap = function (a) {
				var b;
				if (null == this.$clone && !this.isStuck) {
					b = this.$element.parent();
					if (this.getOption("autoHeight"))return this.height = this.$element.outerHeight(), "resize" === a.type ? (b.addClass("rd-navbar--no-transition").css("height", this.height), b[0].offsetHeight, b.removeClass("rd-navbar--no-transition")) : b.css("height", this.height);
					b.css("height", "auto")
				}
			};
			c.prototype.createNav = function (a) {
				a.$element.find(".rd-navbar-dropdown, .rd-navbar-megamenu").each(function () {
					var a, e;
					a = d(this);
					e = this.getBoundingClientRect();
					e.left + a.outerWidth() >= l.innerWidth - 10 ? this.className += " rd-navbar-open-left" : 10 >= e.left - a.outerWidth() && (this.className += " rd-navbar-open-right");
					return a.hasClass("rd-navbar-megamenu") ? a.parent().addClass("rd-navbar--has-megamenu") : a.parent().addClass("rd-navbar--has-dropdown")
				}).parents("li").addClass("rd-navbar-submenu").append(d("<span/>", {"class": "rd-navbar-submenu-toggle"}));
				a.options.callbacks.onDomAppend && a.options.callbacks.onDomAppend.call(this);
				return a
			};
			c.prototype.createClone = function (a) {
				a.$clone = a.$element.clone().insertAfter(a.$element).addClass("rd-navbar--is-clone");
				return a
			};
			c.prototype.closeToggle = function (a, b) {
				var e, c, f;
				e = d(b.target);
				c = !1;
				b.target !== this && !e.parents("[data-rd-navbar-toggle]").length && (f = this.getAttribute("data-rd-navbar-toggle")) && (e = d(this).parents("body").find(f).add(d(this).parents(".rd-navbar")[0]), e.each(function () {
					if (!c)return c = !0 === (b.target === this || d.contains(this, b.target))
				}), c || (e.add(this).removeClass("active"), a.options.callbacks.onToggleClose && a.options.callbacks.onToggleClose.call(this, a)));
				return this
			};
			c.prototype.switchToggle = function (a, b) {
				var e;
				b.preventDefault();
				if (e = this.getAttribute("data-rd-navbar-toggle"))d("[data-rd-navbar-toggle]").not(this).each(function () {
					var a;
					if (a = this.getAttribute("data-rd-navbar-toggle"))return d(this).parents("body").find(a).add(this).add(-1 < d.inArray(".rd-navbar", a.split(/\s*,\s*/i)) ? d(this).parents("body")[0] : !1).removeClass("active")
				}), d(this).parents("body").find(e).add(this).add(-1 < d.inArray(".rd-navbar", e.split(/\s*,\s*/i)) ? d(this).parents(".rd-navbar")[0] : !1).toggleClass("active"), a.options.callbacks.onToggleSwitch && a.options.callbacks.onToggleSwitch.call(this, a);
				return this
			};
			c.prototype.dropdownOver = function (a, b) {
				var e;
				a.focusOnHover && (e = d(this), clearTimeout(b), e.addClass("focus").siblings().removeClass("opened").each(a.dropdownUnfocus), a.options.callbacks.onDropdownOver && a.options.callbacks.onDropdownOver.call(this, a));
				return this
			};
			c.prototype.dropdownTouch = function (a, b) {
				var e, c;
				e = d(this);
				clearTimeout(b);
				if (a.focusOnHover) {
					c = !1;
					e.hasClass("focus") && (c = !0);
					if (!c)return e.addClass("focus").siblings().removeClass("opened").each(a.dropdownUnfocus), !1;
					a.options.callbacks.onDropdownOver && a.options.callbacks.onDropdownOver.call(this, a)
				}
				return this
			};
			c.prototype.dropdownOut = function (a, b) {
				var e;
				a.focusOnHover && (e = d(this), e.one("mouseenter.navbar", function () {
					return clearTimeout(b)
				}), clearTimeout(b), b = setTimeout(d.proxy(a.dropdownUnfocus, this, a), a.options.focusOnHoverTimeout), a.options.callbacks.onDropdownOut && a.options.callbacks.onDropdownOut.call(this, a));
				return this
			};
			c.prototype.dropdownUnfocus = function (a) {
				d(this).find("li.focus").add(this).removeClass("focus");
				return this
			};
			c.prototype.dropdownClose = function (a, b) {
				var e;
				b.target === this || d(b.target).parents(".rd-navbar-submenu").length || (e = d(this), e.find("li.focus").add(this).removeClass("focus").removeClass("opened"), a.options.callbacks.onDropdownClose && a.options.callbacks.onDropdownClose.call(this, a));
				return this
			};
			c.prototype.dropdownToggle = function (a) {
				d(this).toggleClass("opened").siblings().removeClass("opened");
				a.options.callbacks.onDropdownToggle && a.options.callbacks.onDropdownToggle.call(this, a);
				return this
			};
			c.prototype.goToAnchor = function (a, b) {
				var e, c;
				c = this.hash;
				e = d(c);
				e.length && (b.preventDefault(), d("html, body").stop().animate({scrollTop: e.offset().top + a.getOption("anchorNavOffset") + 1}, a.getOption("anchorNavSpeed"), a.getOption("anchorNavEasing"), function () {
					return a.changeAnchor(c)
				}));
				return this
			};
			c.prototype.activateAnchor = function (a) {
				var b, e, c, f, h, k;
				k = this.$doc.scrollTop();
				h = this.$win.height();
				b = this.$doc.height();
				a = this.getOption("anchorNavOffset");
				if (k + h > b - 50)return b = d('[data-type="anchor"]').last(), b.length && b.offset().top >= k && (f = "#" + b.attr("id"), e = d('.rd-navbar-nav a[href^="' + f + '"]').parent(), e.hasClass("active") || (e.addClass("active").siblings().removeClass("active"), this.options.callbacks.onAnchorChange && this.options.callbacks.onAnchorChange.call(b[0], this))), b;
				h = d('.rd-navbar-nav a[href^="#"]').get();
				for (e in h)b = h[e], c = d(b), f = c.attr("href"), b = d(f), b.length && b.offset().top + a <= k && b.offset().top + b.outerHeight() > k && (c.parent().addClass("active").siblings().removeClass("active"), this.options.callbacks.onAnchorChange && this.options.callbacks.onAnchorChange.call(b[0], this));
				return null
			};
			c.prototype.getAnchor = function () {
				return history && history.state ? history.state.id : null
			};
			c.prototype.changeAnchor = function (a) {
				history && (history.state ? history.state.id !== a ? history.replaceState({anchorId: a}, null, a) : history.pushState({anchorId: a}, null, a) : history.pushState({anchorId: a}, null, a));
				return this
			};
			c.prototype.applyHandlers = function (a) {
				null != a.options.responsive && a.$win.on("resize.navbar", d.proxy(a.resize, a.$win[0], a)).on("resize.navbar", d.proxy(a.resizeWrap, a)).on("resize.navbar", d.proxy(a.stickUp, null != a.$clone ? a.$clone : a.$element, a)).on("orientationchange.navbar", d.proxy(a.resize, a.$win[0], a)).trigger("resize.navbar");
				a.$doc.on("scroll.navbar", d.proxy(a.stickUp, null != a.$clone ? a.$clone : a.$element, a)).on("scroll.navbar", d.proxy(a.activateAnchor, a));
				a.$element.add(a.$clone).find("[data-rd-navbar-toggle]").each(function () {
					var b;
					b = d(this);
					b.on("click", d.proxy(a.switchToggle, this, a));
					return b.parents("body").on("click", d.proxy(a.closeToggle, this, a))
				});
				a.$element.add(a.$clone).find(".rd-navbar-submenu").each(function () {
					var b, e;
					b = d(this);
					e = b.parents(".rd-navbar--is-clone").length ? a.cloneTimer : a.focusTimer;
					b.on("mouseleave.navbar", d.proxy(a.dropdownOut, this, a, e));
					b.find("> a").on("mouseenter.navbar", d.proxy(a.dropdownOver, this, a, e));
					b.find("> a").on("touchstart.navbar", d.proxy(a.dropdownTouch, this, a, e));
					b.find("> .rd-navbar-submenu-toggle").on("click", d.proxy(a.dropdownToggle, this, a));
					return b.parents("body").on("click", d.proxy(a.dropdownClose, this, a))
				});
				a.$element.add(a.$clone).find('.rd-navbar-nav a[href^="#"]').each(function () {
					return d(this).on("click", d.proxy(a.goToAnchor, this, a))
				});
				return a
			};
			c.prototype.switchClass = function (a, b, e) {
				a = a instanceof jQuery ? a : d(a);
				a.addClass("rd-navbar--no-transition").removeClass(b).addClass(e);
				a[0].offsetHeight;
				return a.removeClass("rd-navbar--no-transition")
			};
			c.prototype.setDataAPI = function (a) {
				var b, e, d, c;
				a = ["-", "-xs-", "-sm-", "-md-", "-lg-"];
				c = [0, 480, 768, 992, 1200];
				b = e = 0;
				for (d = c.length; e < d; b = ++e)this.$element.attr("data" + a[b] + "layout") && (this.options.responsive[c[b]] || (this.options.responsive[c[b]] = {}), this.options.responsive[c[b]].layout = this.$element.attr("data" + a[b] + "layout")), this.$element.attr("data" + a[b] + "device-layout") && (this.options.responsive[c[b]] || (this.options.responsive[c[b]] = {}), this.options.responsive[c[b]].deviceLayout = this.$element.attr("data" + a[b] + "device-layout")), this.$element.attr("data" + a[b] + "hover-on") && (this.options.responsive[c[b]] || (this.options.responsive[c[b]] = {}), this.options.responsive[c[b]].focusOnHover = "true" === this.$element.attr("data" + a[b] + "hover-on")), this.$element.attr("data" + a[b] + "stick-up") && (this.options.responsive[c[b]] || (this.options.responsive[c[b]] = {}), this.options.responsive[c[b]].stickUp = "true" === this.$element.attr("data" + a[b] + "stick-up")), this.$element.attr("data" + a[b] + "auto-height") && (this.options.responsive[c[b]] || (this.options.responsive[c[b]] = {}), this.options.responsive[c[b]].autoHeight = "true" === this.$element.attr("data" + a[b] + "auto-height")), this.$element.attr("data" + a[b] + "stick-up-offset") && (this.options.responsive[c[b]] || (this.options.responsive[c[b]] = {}), this.options.responsive[c[b]].stickUpOffset = this.$element.attr("data" + a[b] + "stick-up-offset"))
			};
			c.prototype.getOption = function (a) {
				var b, c;
				for (b in this.options.responsive)b <= l.innerWidth && (c = b);
				return null != this.options.responsive && null != this.options.responsive[c][a] ? this.options.responsive[c][a] : this.options[a]
			};
			return c
		}();
		d.fn.extend({
			RDNavbar: function (c) {
				var a;
				a = d(this);
				if (!a.data("RDNavbar"))return a.data("RDNavbar", new n(this, c))
			}
		});
		return l.RDNavbar = n
	})(window.jQuery, document, window);
	"undefined" !== typeof module && null !== module ? module.exports = window.RDNavbar : "function" === typeof define && define.amd && define(["jquery"], function () {
		return window.RDNavbar
	})
}).call(this);