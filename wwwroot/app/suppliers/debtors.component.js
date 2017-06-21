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
var ng2_translate_1 = require('ng2-translate/ng2-translate');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var DebtorsListComponent = (function () {
    function DebtorsListComponent(dataService, storService, router, translate) {
        this.dataService = dataService;
        this.storService = storService;
        this.router = router;
        this.translate = translate;
        this.currentCompany = storService.getValue();
    }
    DebtorsListComponent.prototype.ngOnInit = function () {
        this.getDebtors();
    };
    DebtorsListComponent.prototype.getDebtors = function () {
        var _this = this;
        this.dataService.getDebtorsForSupplier(this.currentCompany.Id)
            .subscribe(function (debtors) { _this.debtors = debtors; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    DebtorsListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    DebtorsListComponent.prototype.navigate_to_add = function () {
        this.router.navigate(['SupplierHome/AddDebtor']);
    };
    DebtorsListComponent = __decorate([
        core_1.Component({
            selector: 'ic-debtors',
            templateUrl: '/templates/v0102/suppliers/debtors.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, storageService_1.StorageService, router_1.Router, ng2_translate_1.TranslateService])
    ], DebtorsListComponent);
    return DebtorsListComponent;
}());
exports.DebtorsListComponent = DebtorsListComponent;
// ***************************************************************************************
var AddDebtorComponent = (function () {
    function AddDebtorComponent(dataService, router, storService, helper) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.model = new CompanyViewModel_1.CompanyViewModel();
        this.EDS_Ok = false;
        this.legal_types = ["IP", "OAO", "ZAO", "OOO"];
        this.submit_click = function () {
            this.showProgress = true;
            this.add_company();
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
            .subscribe(function (company) { _this.companyFound = company; _this.searchMessage = null; }, function (errorObject) { _this.companyFound = null; _this.helper.showToast(document.getElementById('theToast'), 'Company not found.'); });
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
        this.dataService.attach_debtor(this.companyFound.Guid, this.currentCompany.Guid)
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
    AddDebtorComponent.prototype.test_rsa = function () {
        this.EDS_Name = '';
        this.EDS_Thumb = '';
        //*************************************** external code here
        //****************************************
    };
    AddDebtorComponent.prototype.dialogEDS_Show = function (_edsName, _edsThumb) {
        this.EDS_Name = _edsName;
        this.EDS_Thumb = _edsThumb;
        var dialog = document.getElementById('dialogEDS');
        if (dialog)
            dialog.open();
    };
    AddDebtorComponent.prototype.dialogEDS_Ok = function () {
        this.EDS_Ok = true;
        var dialog = document.getElementById('dialogEDS');
        if (dialog)
            dialog.close();
    };
    AddDebtorComponent = __decorate([
        core_1.Component({
            selector: 'ic-add-debtors',
            templateUrl: '/templates/v0102/suppliers/add-debtor.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], AddDebtorComponent);
    return AddDebtorComponent;
}());
exports.AddDebtorComponent = AddDebtorComponent;
