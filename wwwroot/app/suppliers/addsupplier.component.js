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
var storageService_1 = require('./../storageService');
var helperService_1 = require('./../helperService');
var PersonViewModel_1 = require('../models/PersonViewModel');
var CompanyViewModel_1 = require('../models/CompanyViewModel');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var AddSupplierComponent = (function () {
    function AddSupplierComponent(dataService, router, storService, helper) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.person = new PersonViewModel_1.PersonViewModel();
        this.company = new CompanyViewModel_1.CompanyViewModel();
        this.EDS_Ok = false;
        this.register_ok = function (appForm) {
            this.showProgress = false;
            this.helper.showToast(document.getElementById('theToast'), 'Supplier added');
        };
        this.set_legal_type = function (ind) {
            this.model.LegalForm = this.legal_types[ind];
        };
        this.person.PossibilityToExposeBid = false;
        this.person.PossibilityToExposeBidWithoutRestrictions = true;
        this.person.CounterOfferAcceptPossibility = false;
        this.person.CounterOfferAcceptPossibilityWithoutRestrictions = true;
        this.showProgress = false;
        this.searchMessage = null;
        this.FullPowersDocumentsNames = new Array();
        this.IdentityDocumentsNames = new Array();
        this.FullPowersDocumentsNames_Last = '';
        this.IdentityDocumentsNames_Last = '';
    }
    AddSupplierComponent.prototype.ngOnInit = function () {
    };
    AddSupplierComponent.prototype.add_user = function () {
        var _this = this;
        this.showProgress = true;
        this.person.FullPowersDocumentsNames = JSON.stringify(this.FullPowersDocumentsNames);
        this.person.IdentityDocumentsNames = JSON.stringify(this.IdentityDocumentsNames);
        this.errorMessages = new Array();
        this.dataService.add_supplier(this.person)
            .subscribe(function (appForm) { return _this.register_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    AddSupplierComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    AddSupplierComponent.prototype.dialogEDS_Show = function (_edsName, _edsThumb) {
        this.EDS_Name = _edsName;
        this.EDS_Thumb = _edsThumb;
        var dialog = document.getElementById('dialogEDS');
        if (dialog)
            dialog.open();
    };
    AddSupplierComponent.prototype.dialogEDS_Ok = function () {
        this.EDS_Ok = true;
        var dialog = document.getElementById('dialogEDS');
        if (dialog)
            dialog.close();
    };
    AddSupplierComponent.prototype.select_EDS = function (value) {
        this.person.EDS_type = value;
    };
    AddSupplierComponent.prototype.upl_reject = function (event) {
        this.helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error);
    };
    AddSupplierComponent.prototype.before_file_upload = function (event) {
    };
    AddSupplierComponent.prototype.after_file_upload_FPDN = function (event) {
        this.FullPowersDocumentsNames.push(event.detail.xhr.responseText);
        console.log(event.detail.xhr.responseText);
        this.FullPowersDocumentsNames_Last = event.detail.xhr.responseText;
        console.log(this.FullPowersDocumentsNames_Last);
    };
    AddSupplierComponent.prototype.after_file_upload_IDN = function (event) {
        this.IdentityDocumentsNames.push(event.detail.xhr.responseText);
        console.log(event.detail.xhr.responseText);
        this.IdentityDocumentsNames_Last = event.detail.xhr.responseText;
        console.log(this.IdentityDocumentsNames_Last);
    };
    AddSupplierComponent = __decorate([
        core_1.Component({
            selector: 'ic-add-supplier',
            templateUrl: '/templates/v0102/suppliers/add-supplier.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], AddSupplierComponent);
    return AddSupplierComponent;
}());
exports.AddSupplierComponent = AddSupplierComponent;
