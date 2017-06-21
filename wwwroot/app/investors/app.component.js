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
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var storageService_1 = require('./../storageService');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var helperService_1 = require('./../helperService');
var AppComponent = (function () {
    function AppComponent(elementRef, storService, translate, helper) {
        this.elementRef = elementRef;
        this.storService = storService;
        this.translate = translate;
        this.helper = helper;
        this.currentCompany = new CompanyViewModel_1.CompanyViewModel();
        helper.mapCompany(this.currentCompany, this.elementRef.nativeElement);
        this.storService.setValue(this.currentCompany);
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(this.elementRef.nativeElement.getAttribute('_lang'));
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        setTimeout(function () {
            var rdNavbar = jQuery('.rd-navbar');
            if (rdNavbar.length) {
                rdNavbar.RDNavbar({
                    stickUpClone: (rdNavbar.attr("data-stick-up-clone")) ? rdNavbar.attr("data-stick-up-clone") === 'true' : false
                });
                if (rdNavbar.attr("data-body-class")) {
                    document.body.className += ' ' + rdNavbar.attr("data-body-class");
                }
            }
        }, 0);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'ic-application',
            templateUrl: '/templates/v0102/investors/app.tpl.html'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, storageService_1.StorageService, ng2_translate_1.TranslateService, helperService_1.HelperService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
