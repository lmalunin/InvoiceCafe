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
var dataService_1 = require('./../dataService');
var storageService_1 = require('./../storageService');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var DzListComponent = (function () {
    function DzListComponent(dataService, storService) {
        this.dataService = dataService;
        this.storService = storService;
        this.currentCompany = storService.getValue();
    }
    DzListComponent.prototype.ngOnInit = function () {
        this.getDebtors();
    };
    DzListComponent.prototype.getDebtors = function () {
        var _this = this;
        this.dataService.getDebtorsForSupplier(this.currentCompany.Id)
            .subscribe(function (debtors) { _this.debtors = debtors; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    DzListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    DzListComponent = __decorate([
        core_1.Component({
            selector: 'ic-dz-list',
            templateUrl: '/templates/v0102/suppliers/dz-list.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, storageService_1.StorageService])
    ], DzListComponent);
    return DzListComponent;
}());
exports.DzListComponent = DzListComponent;
// ***************************************************************************************
var DzAddComponent = (function () {
    function DzAddComponent(dataService, router) {
        this.dataService = dataService;
        this.router = router;
        this.model = new CompanyViewModel_1.CompanyViewModel();
        this.legal_types = ["IP", "OAO", "ZAO", "OOO"];
        this.submit_click = function () {
            this.showProgress = true;
            this.add_company();
        };
        this.register_ok = function (appForm) {
            this.showProgress = false;
        };
        this.set_legal_type = function (ind) {
            this.model.LegalForm = this.legal_types[ind];
        };
        this.initialize_model();
        this.showProgress = false;
    }
    DzAddComponent.prototype.initialize_model = function () {
        this.model.IsRezident = true;
        this.model.LegalForm = this.legal_types[1];
        this.model.AgentType = 2;
        this.model.CompanyName = "Свиньин и Ко";
        this.model.CompanyEmail = "pig@pisem.net";
        this.model.CompanyPhone = "+7 495 123-45-67";
        this.model.INN = "123456879012";
        this.model.OGRN = "1234533890123";
    };
    DzAddComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    DzAddComponent = __decorate([
        core_1.Component({
            selector: 'ic-dz-add',
            templateUrl: '/templates/v0102/suppliers/dz-add.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router])
    ], DzAddComponent);
    return DzAddComponent;
}());
exports.DzAddComponent = DzAddComponent;
