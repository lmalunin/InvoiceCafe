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
var AppComponent = (function () {
    function AppComponent(elementRef) {
        this.elementRef = elementRef;
        this.companyName = this.elementRef.nativeElement.getAttribute('companyName');
        this.companyType = this.elementRef.nativeElement.getAttribute('companyType');
        if (this.companyType == "-") {
            this.isAuth = false;
            this.loginTitle = "Вход";
            this.loginUrl = "/Start/Login";
        }
        else {
            this.isAuth = true;
            this.loginTitle = "Выход";
            this.loginUrl = "/Start/Logout";
            if (this.companyType == "SUPPLIER")
                this.homeLink = "SupplierHome";
            if (this.companyType == "INVESTOR")
                this.homeLink = "InvestorHome";
            if (this.companyType == "DEBTOR")
                this.homeLink = "DebtorHome";
            if (this.companyType == "ADMIN")
                this.homeLink = "AdminHome";
        }
    }
    AppComponent.prototype.ngAfterContentInit = function () {
        var rdNavbar = jQuery('.rd-navbar');
        var owl = jQuery('.owl-carousel');
        /**
        * RD Navbar
        * @description Enables RD Navbar plugin
        */
        if (rdNavbar.length) {
            rdNavbar.RDNavbar({
                stickUpClone: (rdNavbar.attr("data-stick-up-clone")) ? rdNavbar.attr("data-stick-up-clone") === 'true' : false
            });
            if (rdNavbar.attr("data-body-class")) {
                document.body.className += ' ' + rdNavbar.attr("data-body-class");
            }
        }
        /**
         * Owl carousel
         * @description Enables Owl carousel plugin
         */
        console.log(owl.length);
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
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'ic-application',
            templateUrl: '/templates/v0101/start/app.tpl.html'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
