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
var dataService_1 = require('./../dataService');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var AppComponent = (function () {
    function AppComponent(elementRef, dataService, translate) {
        this.elementRef = elementRef;
        this.dataService = dataService;
        this.translate = translate;
        this.userName = this.elementRef.nativeElement.getAttribute('userName');
        translate.setDefaultLang('en');
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
            templateUrl: '/templates/v0102/admins/app.tpl.html'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, dataService_1.DataService, ng2_translate_1.TranslateService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
