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
var dictService_1 = require('./../dictService');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var ContractViewModel_1 = require('../models/ContractViewModel');
var PersonViewModel_1 = require('../models/PersonViewModel');
var DZViewModel_1 = require('../models/DZViewModel');
var LotViewModel_1 = require('../models/LotViewModel');
// ***************************************************************************************
var ContractDetailsComponent = (function () {
    function ContractDetailsComponent(dataService, route, router, storService, translate, helper, dict) {
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.storService = storService;
        this.translate = translate;
        this.helper = helper;
        this.dict = dict;
        this.add_dz_ok = function (appForm) {
            this.showProgress = false;
            //this.model.DZ.push(appForm);
            //this.clean_dz();
            this.getContract();
            this.helper.showToast(document.getElementById('theToast'), "Задолженность добавлена");
        };
        this.add_dz_error = function (errorObject) {
            this.showProgress = false;
            this.helper.showToast(document.getElementById('theToast'), "Ошибка добавления задолженности");
            this.process_error(errorObject);
        };
        this.add_lot_ok = function (appForm) {
            this.showProgress = false;
            this.getContract();
            this.helper.showToast(document.getElementById('theToast'), "Лот создан");
        };
        this.currentCompany = storService.getValue();
        this.initialize_model();
        this.contractGuid = this.route.snapshot.params['id'];
        if (this.translate.currentLang == "en") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }
        if (this.translate.currentLang == "ru") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }
        this.currentStep = 1; // шаг визарда
    }
    ContractDetailsComponent.prototype.ngAfterViewInit = function () {
        // не заработало
        //setTimeout(() => {
        //    var responsiveTabs: any = jQuery('.responsiveTabs');
        //    console.log(responsiveTabs);
        //    if (responsiveTabs.length) {
        //        var i;
        //        for (i = 0; i < responsiveTabs.length; i++) {
        //            var responsiveTabsItem = jQuery(responsiveTabs[i]);
        //            responsiveTabsItem.easyResponsiveTabs({
        //                type: responsiveTabsItem.attr("data-type") === "accordion" ? "accordion" : "default"
        //            });
        //        }
        //    }
        //}, 0);
    };
    ContractDetailsComponent.prototype.initialize_model = function () {
        this.model = new ContractViewModel_1.ContractViewModel();
        this.model.Supplier = new CompanyViewModel_1.CompanyViewModel();
        this.model.SupplierSigner = new PersonViewModel_1.PersonViewModel();
        this.model.DebtorSigners = new Array();
        this.model.DebtorSigners.push(new PersonViewModel_1.PersonViewModel());
        this.model.Debtors = new Array();
        this.model.Debtors.push(new CompanyViewModel_1.CompanyViewModel());
        this._dt = new Array(10);
        this.newDZ = new DZViewModel_1.DZViewModel();
        this.newLot = new LotViewModel_1.LotViewModel();
    };
    ContractDetailsComponent.prototype.ngOnInit = function () {
        this.getContract();
    };
    ContractDetailsComponent.prototype.getContract = function () {
        var _this = this;
        this.dataService.getContractDetails(this.contractGuid)
            .subscribe(function (contract) { _this.model = contract; _this.populate_data(); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractDetailsComponent.prototype.calc_contract_duration = function (event) {
        this.model[event.srcElement.id] = new Date(event.detail.value);
        var d1 = moment(this.model.DateFrom);
        var d2 = moment(this.model.DateTo);
        this.model.Duration = d2.diff(d1, 'days');
    };
    ContractDetailsComponent.prototype.populate_data = function () {
        var format = 'DD.MM.YYYY';
        this._dt = new Array(12);
        this._dt[0] = moment(this.model.DateOfSign).format(format);
        this._dt[1] = moment(this.model.DateFrom).format(format);
        this._dt[2] = moment(this.model.DateTo).format(format);
        this._dt[3] = moment(this.model.DebtorObligationsDate).format(format);
        this._dt[4] = moment(this.model.SupplierDeliveryDate).format(format);
        this._dt[5] = moment(this.model.PropertyRightsTransferDate).format(format);
        this._dt[6] = moment(this.model.SupplierSigner.AuthDateFrom).format(format);
        this._dt[7] = moment(this.model.SupplierSigner.AuthDateTo).format(format);
        this._dt[8] = moment(this.model.DebtorSigners[0].AuthDateFrom).format(format);
        this._dt[9] = moment(this.model.DebtorSigners[0].AuthDateTo).format(format);
        this.clean_dz();
        this._dt[10] = moment(this.newDZ.DateFrom).format(format);
        this._dt[11] = moment(this.newDZ.DateTo).format(format);
    };
    ContractDetailsComponent.prototype.show_details = function () {
        var dialog = document.getElementById('showDetailsDialog');
        if (dialog)
            dialog.open();
    };
    ContractDetailsComponent.prototype.clean_dz = function () {
        this.newDZ = new DZViewModel_1.DZViewModel();
        this.newDZ.ContractGuid = this.model.Guid;
        this.newDZ.Debtor = this.model.Debtors[0];
        this.newDZ.DocumentsURLs = new Array();
        this.newDZ.DateFrom = new Date();
        this.newDZ.DateTo = new Date();
        this.newDZ.Status = 1;
    };
    //before_file_upload(event: any) {
    //    var server_file_name = this.helper.processUploadFileName(event.detail.file.name);
    //    event.detail.formData.append("ServerFileName", server_file_name); //add parameter for server { "local file name" : "server file name" }
    //    this.newDZ.DocumentsURLs.push(server_file_name);
    //    console.log(server_file_name);
    //}
    ContractDetailsComponent.prototype.after_file_upload = function (event) {
        var serverFileName = event.detail.xhr.responseText;
        this.newDZ.DocumentsURLs.push(serverFileName);
        //console.log('added ', serverFileName);
    };
    ContractDetailsComponent.prototype.upl_reject = function (event) {
        this.helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error);
    };
    ContractDetailsComponent.prototype.showAddDzDialog = function () {
        var dialog = document.getElementById("addDzDialog");
        if (dialog) {
            dialog.open();
        }
    };
    ContractDetailsComponent.prototype.showAddLotDialog = function (ind) {
        this.newLot = new LotViewModel_1.LotViewModel();
        this.newLot.DZ = this.model.DZ[ind];
        this.newLot.ContractGuid = this.contractGuid;
        this.newLot.Sum = this.newLot.DZ.Sum;
        var dialog = document.getElementById('addLotDialog');
        if (dialog)
            dialog.open();
    };
    ContractDetailsComponent.prototype.addDz = function () {
        var _this = this;
        this.showProgress = true;
        this.errorMessages = new Array();
        this.dataService.add_dz(this.newDZ)
            .subscribe(function (appForm) { return _this.add_dz_ok(appForm); }, function (errorObject) { return _this.add_dz_error(errorObject); });
    };
    ContractDetailsComponent.prototype.addLot = function () {
        var _this = this;
        this.showProgress = true;
        this.errorMessages = new Array();
        this.dataService.add_lot(this.newLot)
            .subscribe(function (appForm) { return _this.add_lot_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractDetailsComponent.prototype.calc_dz_duration = function (event) {
        if (event.srcElement.id == 'newDZ_DateFrom') {
            this.newDZ.DateFrom = moment(event.detail.value).toDate();
        }
        if (event.srcElement.id == 'newDZ_DateTo') {
            this.newDZ.DateTo = moment(event.detail.value).toDate();
        }
        var d1 = moment(this.newDZ.DateFrom);
        var d2 = moment(this.newDZ.DateTo);
        //console.log(d1, d2);
        this.newDZ.Days = d2.diff(d1, 'days');
    };
    ContractDetailsComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ContractDetailsComponent.prototype, "_dp_local", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ContractDetailsComponent.prototype, "_upl_local", void 0);
    ContractDetailsComponent = __decorate([
        core_1.Component({
            selector: 'ic-contracts-details',
            templateUrl: '/templates/v0102/suppliers/contract-details.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, storageService_1.StorageService, ng2_translate_1.TranslateService, helperService_1.HelperService, dictService_1.DictionaryService])
    ], ContractDetailsComponent);
    return ContractDetailsComponent;
}());
exports.ContractDetailsComponent = ContractDetailsComponent;
