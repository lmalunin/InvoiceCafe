"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var IndexComponent = (function () {
    function IndexComponent() {
    }
    IndexComponent.prototype.ngAfterContentInit = function () {
        // функции, используемые в коде ниже. потом все отрефакторить!!!
        // *************************************************************************************
        // *************************************************************************************
        /**
         * toggleSwiperInnerVideos
         * @description  toggle swiper videos on active slides
         */
        var toggleSwiperInnerVideos = function (swiper) {
            var prevSlide = jQuery(swiper.slides[swiper.previousIndex]), nextSlide = jQuery(swiper.slides[swiper.activeIndex]), videos;
            prevSlide.find("video").each(function () {
                this.pause();
            });
            videos = nextSlide.find("video");
            if (videos.length) {
                videos.get(0).play();
            }
        };
        /**
         * toggleSwiperCaptionAnimation
         * @description  toggle swiper animations on active slides
         */
        var toggleSwiperCaptionAnimation = function (swiper) {
            var prevSlide = jQuery(swiper.container), nextSlide = jQuery(swiper.slides[swiper.activeIndex]);
            prevSlide
                .find("[data-caption-animate]")
                .each(function () {
                var $this = jQuery(this);
                $this
                    .removeClass("animated")
                    .removeClass($this.attr("data-caption-animate"))
                    .addClass("not-animated");
            });
            nextSlide
                .find("[data-caption-animate]")
                .each(function () {
                var $this = jQuery(this), delay = $this.attr("data-caption-delay");
                setTimeout(function () {
                    $this
                        .removeClass("not-animated")
                        .addClass($this.attr("data-caption-animate"))
                        .addClass("animated");
                }, delay ? parseInt(delay) : 0);
            });
        };
        /**
     * makeParallax
     * @description  create swiper parallax scrolling effect
     */
        var makeParallax = function (el, speed, wrapper, prevScroll) {
            var scrollY = window.scrollY || window.pageYOffset;
            if (prevScroll != scrollY) {
                prevScroll = scrollY;
                el.addClass('no-transition');
                el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
                el.height();
                el.removeClass('no-transition');
                if (el.attr('data-fade') === 'true') {
                    var bound = el[0].getBoundingClientRect(), offsetTop = bound.top * 2 + scrollY, sceneHeight = wrapper.outerHeight(), sceneDevider = wrapper.offset().top + sceneHeight / 2.0, layerDevider = offsetTop + el.outerHeight() / 2.0, pos = sceneHeight / 6.0, opacity;
                    if (sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider) {
                        el[0].style["opacity"] = 1;
                    }
                    else {
                        if (sceneDevider - pos < layerDevider) {
                            opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);
                        }
                        else {
                            opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);
                        }
                        el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);
                    }
                }
            }
            requestAnimationFrame(function () {
                this.makeParallax(el, speed, wrapper, prevScroll);
            });
        };
        /**
     * getSwiperHeight
     * @description  calculate the height of swiper slider basing on data attr
     */
        var getSwiperHeight = function (object, attr) {
            var val = object.attr("data-" + attr), dim;
            if (!val) {
                return undefined;
            }
            dim = val.match(/(px)|(%)|(vh)$/i);
            if (dim.length) {
                switch (dim[0]) {
                    case "px":
                        return parseFloat(val);
                    case "vh":
                        return jQuery(window).height() * (parseFloat(val) / 100);
                    case "%":
                        return object.width() * (parseFloat(val) / 100);
                }
            }
            else {
                return undefined;
            }
        };
        /**
     * isScrolledIntoView
     * @description  check the element whas been scrolled into the view
     */
        var isScrolledIntoView = function (elem) {
            var $window = jQuery(window);
            return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
        };
        // *************************************************************************************
        // *************************************************************************************
        var owl = jQuery('.owl-carousel');
        if (owl.length) {
            var i;
            for (i = 0; i < owl.length; i++) {
                var c = jQuery(owl[i]), responsive = {};
                var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"], values = [0, 480, 768, 992, 1200], j, k;
                for (j = 0; j < values.length; j++) {
                    responsive[values[j]] = {};
                    for (k = j; k >= -1; k--) {
                        if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
                            responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"));
                        }
                        if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
                            responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"));
                        }
                        if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
                            responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"));
                        }
                    }
                }
                c.owlCarousel({
                    autoplay: c.attr("data-autoplay") === "true",
                    loop: c.attr("data-loop") !== "false",
                    items: 1,
                    dotsContainer: c.attr("data-pagination-class") || false,
                    navContainer: c.attr("data-navigation-class") || false,
                    mouseDrag: c.attr("data-mouse-drag") !== "false",
                    nav: c.attr("data-nav") === "true",
                    dots: c.attr("data-dots") === "true",
                    dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
                    animateOut: c.attr("data-animation-out") || false,
                    responsive: responsive,
                    navText: []
                });
            }
        }
        /**
          * Swiper 3.1.7
          * @description  Enable Swiper Slider
          */
        var swiper = jQuery('.swiper-slider');
        if (swiper.length) {
            var i;
            for (i = 0; i < swiper.length; i++) {
                var s = jQuery(swiper[i]);
                var pag = s.find(".swiper-pagination"), next = s.find(".swiper-button-next"), prev = s.find(".swiper-button-prev"), bar = s.find(".swiper-scrollbar"), parallax = s.parents('.rd-parallax').length, swiperSlide = s.find(".swiper-slide");
                for (j = 0; j < swiperSlide.length; j++) {
                    var $this = jQuery(swiperSlide[j]), url;
                    if (url = $this.attr("data-slide-bg")) {
                        $this.css({
                            "background-image": "url(" + url + ")",
                            "background-size": "cover"
                        });
                    }
                }
                swiperSlide.end()
                    .find("[data-caption-animate]")
                    .addClass("not-animated")
                    .end()
                    .swiper({
                    autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
                    direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
                    effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
                    speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
                    keyboardControl: s.attr('data-keyboard') === "true",
                    mousewheelControl: s.attr('data-mousewheel') === "true",
                    mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
                    nextButton: next.length ? next.get(0) : null,
                    prevButton: prev.length ? prev.get(0) : null,
                    pagination: pag.length ? pag.get(0) : null,
                    paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
                    paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
                        return '<span class="' + className + '">' + (index + 1) + '</span>';
                    } : null : null,
                    scrollbar: bar.length ? bar.get(0) : null,
                    scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
                    scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
                    loop: s.attr('data-loop') !== "false",
                    onTransitionStart: function (swiper) {
                        toggleSwiperInnerVideos(swiper);
                    },
                    onTransitionEnd: function (swiper) {
                        toggleSwiperCaptionAnimation(swiper);
                    },
                    onInit: function (swiper) {
                        toggleSwiperInnerVideos(swiper);
                        toggleSwiperCaptionAnimation(swiper);
                        var swiperParalax = s.find(".swiper-parallax");
                        for (var k = 0; k < swiperParalax.length; k++) {
                            var $this = jQuery(swiperParalax[k]), speed;
                            var isIEBrows = false;
                            if (parallax && !isIEBrows && !isMobile) {
                                if (speed = $this.attr("data-speed")) {
                                    makeParallax($this, speed, s, false);
                                }
                            }
                        }
                        jQuery(window).on('resize', function () {
                            swiper.update(true);
                        });
                    }
                });
                jQuery(window)
                    .on("resize", function () {
                    var mh = getSwiperHeight(s, "min-height"), h = getSwiperHeight(s, "height");
                    if (h) {
                        s.css("height", mh ? mh > h ? mh : h : h);
                    }
                })
                    .trigger("resize");
            }
        }
        /**
         * RD Parallax
         * @description Enables RD Parallax plugin
         */
        var rdParallax = jQuery('.rd-parallax');
        if (rdParallax.length) {
            var i;
            jQuery.RDParallax();
            //хак
            var isIE = false;
            var isMobile = false;
            if (!isIE && !isMobile) {
                jQuery(window).on("scroll", function () {
                    for (i = 0; i < rdParallax.length; i++) {
                        var parallax = jQuery(rdParallax[i]);
                        if (isScrolledIntoView(parallax)) {
                            parallax.find(".rd-parallax-inner").css("position", "fixed");
                        }
                        else {
                            parallax.find(".rd-parallax-inner").css("position", "absolute");
                        }
                    }
                });
            }
            jQuery("a[href='#']").on("click", function (event) {
                setTimeout(function () {
                    jQuery(window).trigger("resize");
                }, 300);
            });
        }
    };
    IndexComponent = __decorate([
        core_1.Component({
            selector: 'ic-index',
            templateUrl: '/templates/v0101/start/index.tpl.html'
        }), 
        __metadata('design:paramtypes', [])
    ], IndexComponent);
    return IndexComponent;
}());
exports.IndexComponent = IndexComponent;
