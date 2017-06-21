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
var helperService_1 = require('./../helperService');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
// ***************************************************************************************
var AddDebtorComponent = (function () {
    function AddDebtorComponent(dataService, router, storService, helper) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.model = new CompanyViewModel_1.CompanyViewModel();
        this.EDS_Ok = false;
        this.legal_types = [1, 2, 3, 4];
        this.submit_click = function () {
            this.showProgress = true;
            if (this.model.AddOrUpdate == 1)
                this.add_company();
            if (this.model.AddOrUpdate == 5)
                this.attach_debtor();
        };
        this.register_ok = function (appForm) {
            this.showProgress = false;
            this.helper.showToast(document.getElementById('theToast'), 'Дебитор добавлен');
        };
        this.set_legal_type = function (ind) {
            this.model.LegalForm = this.legal_types[ind];
        };
        this.currentCompany = storService.getValue();
        this.initialize_model();
        this.showProgress = false;
        this.searchMessage = null;
    }
    AddDebtorComponent.prototype.initialize_model = function () {
        this.model.IsRezident = true;
        this.model.LegalForm = this.legal_types[1];
        this.model.AgentType = 2;
        this.model.AddOrUpdate = 1;
        /*
        this.model.CompanyName = "Свиньин и Ко";
        this.model.CompanyEmail = "pig@pisem.net";
        this.model.CompanyPhone = "+7 495 123-45-67";
        this.model.INN = "123456879012";
        this.model.OGRN = "1234533890123";
        */
    };
    AddDebtorComponent.prototype.search_debtor = function () {
        var _this = this;
        this.dataService.getCompanyByINN(this.searchINN)
            .subscribe(function (company) { return _this.innFound(company); }, function (errorObject) { return _this.innNotFound(); });
    };
    AddDebtorComponent.prototype.innFound = function (company) {
        this.model = company;
        this.model.AddOrUpdate = 5;
    };
    AddDebtorComponent.prototype.innNotFound = function () {
        this.helper.showToast(document.getElementById('theToast'), 'Компания с таким ИНН не найдена');
    };
    AddDebtorComponent.prototype.add_company = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.add_debtor(this.model)
            .subscribe(function (appForm) { return _this.register_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    AddDebtorComponent.prototype.attach_debtor = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.attach_debtor(this.model.Guid, this.currentCompany.Guid)
            .subscribe(function (appForm) { return _this.register_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    AddDebtorComponent.prototype.clean_companyFound = function () {
        this.companyFound = null;
    };
    AddDebtorComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    AddDebtorComponent = __decorate([
        core_1.Component({
            selector: 'ic-add-debtors',
            templateUrl: '/templates/v0102/suppliers/debtors-add.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], AddDebtorComponent);
    return AddDebtorComponent;
}());
exports.AddDebtorComponent = AddDebtorComponent;
