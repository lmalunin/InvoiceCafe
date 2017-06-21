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
var storageService_1 = require('./../storageService');
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var dataService_1 = require('./../dataService');
var dictService_1 = require('./../dictService');
var TestComponent = (function () {
    function TestComponent(dataService, storService, dict) {
        this.dataService = dataService;
        this.storService = storService;
        this.dict = dict;
        this.currentCompany = new CompanyViewModel_1.CompanyViewModel();
        this.currentCompany.CompanyName = "dd";
        this.currentCompany.Status = 5;
    }
    TestComponent.prototype.ngOnInit = function () {
    };
    TestComponent.prototype.ngAfterViewInit = function () {
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
    TestComponent = __decorate([
        core_1.Component({
            selector: 'ic-test',
            templateUrl: '/templates/v0102/test/test.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, storageService_1.StorageService, dictService_1.DictionaryService])
    ], TestComponent);
    return TestComponent;
}());
exports.TestComponent = TestComponent;
