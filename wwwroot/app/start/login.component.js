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
var LoginViewModel_1 = require('../models/LoginViewModel');
var dataService_1 = require('./../dataService');
var router_1 = require('@angular/router');
require('./../rxjs-operators');
var LoginComponent = (function () {
    function LoginComponent(dataService) {
        this.dataService = dataService;
        this.model = new LoginViewModel_1.LoginViewModel();
        this.submit_click = function () {
            this.login();
        };
    }
    LoginComponent.prototype.ngAfterContentInit = function () {
        /**
        * isScrolledIntoView
        * @description  check the element whas been scrolled into the view
        */
        var isScrolledIntoView = function (elem) {
            var $window = jQuery(window);
            return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
        };
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
    LoginComponent.prototype.login = function () {
        var _this = this;
        //if (!name) { return; }        
        this.errorMessages = new Array();
        this.dataService.processLogin(this.model)
            .subscribe(function (loginForm) { return _this.login_ok(loginForm); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    LoginComponent.prototype.login_ok = function (loginForm) {
        if (loginForm.IsOk && loginForm.mainRole == "ADMIN") {
            window.location.href = '/AdminHome/Index';
        }
        if (loginForm.IsOk && loginForm.mainRole == "SUPPLIER") {
            window.location.href = '/SupplierHome/Index';
        }
        if (loginForm.IsOk && loginForm.mainRole == "DEBTOR") {
            window.location.href = '/DebtorHome/Index';
        }
        if (loginForm.IsOk && loginForm.mainRole == "INVESTOR") {
            window.location.href = '/InvestorHome/Index';
        }
    };
    LoginComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log("Error: " + this.errorMessages[0]);
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'ic-register',
            templateUrl: '/templates/v0101/start/login.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
var LogoutComponent = (function () {
    function LogoutComponent(dataService, router) {
        var _this = this;
        this.dataService = dataService;
        this.router = router;
        this.model = new LoginViewModel_1.LoginViewModel();
        this.errorMessages = new Array();
        this.dataService.processLogout(this.model)
            .subscribe(function (loginForm) { return _this.logout_ok(); }, function (errorObject) { return _this.process_error(errorObject); });
    }
    LogoutComponent.prototype.logout_ok = function () {
        console.log("logout ok");
        window.location.href = '/Start/Index';
    };
    LogoutComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log("Error: " + this.errorMessages[0]);
    };
    LogoutComponent = __decorate([
        core_1.Component({
            selector: 'ic-register',
            templateUrl: '/templates/v0101/start/dummy.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router])
    ], LogoutComponent);
    return LogoutComponent;
}());
exports.LogoutComponent = LogoutComponent;
