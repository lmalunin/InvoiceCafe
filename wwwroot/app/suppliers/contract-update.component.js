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
var UrlObject = (function () {
    function UrlObject(_isVisible, _fileName, _getUrl, _deleteUrl) {
        this.isVisible = _isVisible;
        this.fileName = _fileName;
        this.getUrl = _getUrl;
        this.deleteUrl = _deleteUrl;
    }
    return UrlObject;
}());
var ContractUpdateComponent = (function () {
    function ContractUpdateComponent(dataService, route, router, storService, translate, helper, dict) {
        var _this = this;
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.storService = storService;
        this.translate = translate;
        this.helper = helper;
        this.dict = dict;
        this.dt_template = "YYYY-MM-DD";
        this.empty_guid = "00000000-0000-0000-0000-000000000000";
        if (this.translate.currentLang == "en") {
            this._dp_local = this.helper.DATE_PICKER_i18n_en;
            this._upl_local = this.helper.UPLOAD_i18n_en;
        }
        if (this.translate.currentLang == "ru") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }
        this.currentCompany = storService.getValue();
        this._FullPowersDocumentsNamesSupplier = new Array();
        this._FullPowersDocumentsNamesDebtor = new Array();
        this._FullPowersDocumentsNamesURLsSupplier = new Array();
        this._FullPowersDocumentsNamesURLsDebtor = new Array();
        this.selectedContract = new ContractViewModel_1.ContractViewModel();
        this.selectedContract.Debtors = new Array();
        var debtor = new CompanyViewModel_1.CompanyViewModel();
        debtor.Id = this.empty_guid;
        this.selectedContract.Debtors.push(debtor);
        this.selectedContract.DebtorSigners = new Array();
        var personVM = new PersonViewModel_1.PersonViewModel();
        personVM.Company = new CompanyViewModel_1.CompanyViewModel();
        personVM.Company.Id = this.empty_guid;
        this.selectedContract.DebtorSigners.push(personVM);
        this.selectedContract.Guid = this.route.snapshot.params['contractId'];
        this.dataService.getContractDetails(this.selectedContract.Guid.toString())
            .subscribe(function (data) {
            _this.selectedContract = data;
            _this._set_date(_this.selectedContract);
            _this.selectedDebtor = _this.selectedContract.DebtorSigners[0].Company;
            for (var key in data.DebtorSigners[0]) {
                if (key.match(/date/i)) {
                    _this.selectedContract.DebtorSigners[0][key] = moment(data.DebtorSigners[0]).format(_this.dt_template);
                }
                else {
                    _this.selectedContract.DebtorSigners[0][key] = data.DebtorSigners[0][key];
                }
            }
            _this._FullPowersDocumentsNamesSupplier = JSON.parse(_this.selectedContract.SupplierSigner.FullPowersDocumentsNames);
            for (var i in _this._FullPowersDocumentsNamesSupplier) {
                _this._FullPowersDocumentsNamesURLsSupplier.push(new UrlObject(true, _this._FullPowersDocumentsNamesSupplier[i], '/' + _this.selectedContract.SupplierSigner.GetDocsBaseUrl + '/' + _this.selectedContract.SupplierSigner.Id + "/" + _this._FullPowersDocumentsNamesSupplier[i], '/' + _this.selectedContract.SupplierSigner.DeleteDocsBaseUrl + '/' + _this.selectedContract.SupplierSigner.Id + "/" + _this._FullPowersDocumentsNamesSupplier[i]));
            }
            _this._FullPowersDocumentsNamesDebtor = JSON.parse(_this.selectedContract.DebtorSigners[0].FullPowersDocumentsNames);
            for (var i in _this._FullPowersDocumentsNamesDebtor) {
                _this._FullPowersDocumentsNamesURLsDebtor.push(new UrlObject(true, _this._FullPowersDocumentsNamesDebtor[i], '/' + _this.selectedContract.DebtorSigners[0].GetDocsBaseUrl + '/' + _this.selectedContract.DebtorSigners[0].Id + "/" + _this._FullPowersDocumentsNamesDebtor[i], '/' + _this.selectedContract.DebtorSigners[0].DeleteDocsBaseUrl + '/' + _this.selectedContract.DebtorSigners[0].Id + "/" + _this._FullPowersDocumentsNamesDebtor[i]));
            }
        }, function (errorObject) { return _this.process_error(errorObject); });
    }
    ContractUpdateComponent.prototype.ngOnInit = function () { };
    ContractUpdateComponent.prototype.ngAfterViewInit = function () { };
    ContractUpdateComponent.prototype.selected_debtor = function (debtor) {
        var _this = this;
        if (this.selectedContract.DebtorSigners[0].Company.Id == debtor.Id)
            return;
        this.selectedDebtor = debtor;
        this.dataService.getSubscriberForDebtor(debtor.Id)
            .subscribe(function (data) {
            for (var key in data) {
                if (key.match(/date/i)) {
                    _this.selectedContract.DebtorSigners[0][key] = moment(data[key]).format(_this.dt_template);
                }
                else {
                    _this.selectedContract.DebtorSigners[0][key] = data[key];
                }
            }
            _this._FullPowersDocumentsNamesURLsDebtor = new Array();
            _this._FullPowersDocumentsNamesDebtor = JSON.parse(_this.selectedContract.DebtorSigners[0].FullPowersDocumentsNames);
            for (var i in _this._FullPowersDocumentsNamesDebtor) {
                _this._FullPowersDocumentsNamesURLsDebtor.push(new UrlObject(true, _this._FullPowersDocumentsNamesDebtor[i], '/' + _this.selectedContract.DebtorSigners[0].GetDocsBaseUrl + '/' + _this.selectedContract.DebtorSigners[0].Id + "/" + _this._FullPowersDocumentsNamesDebtor[i], '/' + _this.selectedContract.DebtorSigners[0].DeleteDocsBaseUrl + '/' + _this.selectedContract.DebtorSigners[0].Id + "/" + _this._FullPowersDocumentsNamesDebtor[i]));
            }
            console.log(_this.selectedContract.DebtorSigners[0]);
        }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractUpdateComponent.prototype.selected_contractType = function (value) {
        if (this.selectedContract.ContractType == value.Id)
            return;
        this.selectedContract.ContractType = value.Id;
    };
    ContractUpdateComponent.prototype.selected_delivery_type = function (value) {
    };
    ContractUpdateComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
    };
    ContractUpdateComponent.prototype.delete_file_supplier = function (url) {
        var _this = this;
        this.dataService.delete_file(url)
            .subscribe(function (obj) {
            _this.person_document_deleted_ok(obj.fileName);
            if (_this._FullPowersDocumentsNamesSupplier.includes(obj.fileName)) {
                _this._FullPowersDocumentsNamesSupplier.splice(_this._FullPowersDocumentsNamesSupplier.indexOf(obj.fileName), 1);
            }
            if (_this._FullPowersDocumentsNamesSupplier && _this._FullPowersDocumentsNamesSupplier != []) {
                _this._FullPowersDocumentsNamesURLsSupplier = _this._FullPowersDocumentsNamesURLsSupplier.filter(function (item) { return item.fileName != obj.fileName; });
            }
        }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractUpdateComponent.prototype.delete_file_debtor = function (url) {
        var _this = this;
        this.dataService.delete_file(url)
            .subscribe(function (obj) {
            _this.person_document_deleted_ok(obj.fileName);
            if (_this._FullPowersDocumentsNamesDebtor.includes(obj.fileName)) {
                _this._FullPowersDocumentsNamesDebtor.splice(_this._FullPowersDocumentsNamesDebtor.indexOf(obj.fileName), 1);
            }
            if (_this._FullPowersDocumentsNamesDebtor && _this._FullPowersDocumentsNamesDebtor != []) {
                _this._FullPowersDocumentsNamesURLsDebtor = _this._FullPowersDocumentsNamesURLsDebtor.filter(function (item) { return item.fileName != obj.fileName; });
            }
        }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractUpdateComponent.prototype.person_document_deleted_ok = function (file) {
        this.showProgress = false;
        this.helper.showToast(document.getElementById('theToast'), 'Person\'s document ' + file + ' was deleted');
    };
    ContractUpdateComponent.prototype.calc_contract_duration = function (event) {
        var target = event.target || event.srcElement;
        if (this.selectedContract) {
            this.selectedContract[target.id] = new Date(event.detail.value);
            var d1 = moment(this.selectedContract.DateFrom);
            var d2 = moment(this.selectedContract.DateTo);
            this.selectedContract.Duration = d2.diff(d1, 'days');
        }
    };
    ContractUpdateComponent.prototype.update_contract = function () {
        var _this = this;
        this.showProgress = true;
        this.selectedContract.SupplierSigner.FullPowersDocumentsNames = JSON.stringify(this._FullPowersDocumentsNamesSupplier);
        this.selectedContract.DebtorSigners[0].FullPowersDocumentsNames = JSON.stringify(this._FullPowersDocumentsNamesDebtor);
        this.errorMessages = new Array();
        this.dataService.update_contract(this.selectedContract, this.selectedDebtor)
            .subscribe(function (appForm) {
            _this._set_date(appForm);
            _this.contract_updated_ok(appForm);
            _this.selectedContract = appForm;
            _this.toDownloadSupplierFPDN.nativeElement.files = [];
            _this.toDownloadDebtorFPDN.nativeElement.files = [];
            _this._FullPowersDocumentsNamesURLsSupplier.forEach(function (doc) { return doc.isVisible = true; });
            _this._FullPowersDocumentsNamesURLsDebtor.forEach(function (doc) { return doc.isVisible = true; });
        }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractUpdateComponent.prototype.contract_updated_ok = function (appForm) {
        this.showProgress = false;
        //this.helper.showToast(document.getElementById('theToast'), 'Contract\'s datas were updated');
        this.helper.showToast(this.theToast.nativeElement, 'Contract\'s datas were updated');
    };
    ContractUpdateComponent.prototype.before_file_upload = function (event) { };
    ContractUpdateComponent.prototype.upl_reject = function (event) { this.helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error); };
    ContractUpdateComponent.prototype.after_file_upload_supplier = function (event) {
        this._FullPowersDocumentsNamesSupplier.push(event.detail.xhr.responseText);
        this._FullPowersDocumentsNamesURLsSupplier.push(new UrlObject(false, event.detail.xhr.responseText, '/' + this.selectedContract.SupplierSigner.GetDocsBaseUrl + '/' + this.selectedContract.SupplierSigner.Id + "/" + event.detail.xhr.responseText, '/' + this.selectedContract.SupplierSigner.DeleteDocsBaseUrl + '/' + this.selectedContract.SupplierSigner.Id + "/" + event.detail.xhr.responseText));
    };
    ContractUpdateComponent.prototype.after_file_upload_debtor = function (event) {
        this._FullPowersDocumentsNamesDebtor.push(event.detail.xhr.responseText);
        this._FullPowersDocumentsNamesURLsDebtor.push(new UrlObject(false, event.detail.xhr.responseText, '/' + this.selectedContract.DebtorSigners[0].GetDocsBaseUrl + '/' + this.selectedContract.DebtorSigners[0].Id + "/" + event.detail.xhr.responseText, '/' + this.selectedContract.DebtorSigners[0].DeleteDocsBaseUrl + '/' + this.selectedContract.DebtorSigners[0].Id + "/" + event.detail.xhr.responseText));
    };
    ContractUpdateComponent.prototype._set_date = function (selectedContract) {
        selectedContract.DateOfSign = moment(selectedContract.DateOfSign).format(this.dt_template);
        selectedContract.DateFrom = moment(selectedContract.DateFrom).format(this.dt_template);
        selectedContract.DateTo = moment(selectedContract.DateTo).format(this.dt_template);
        selectedContract.DebtorObligationsDate = moment(selectedContract.DebtorObligationsDate).format(this.dt_template);
        selectedContract.SupplierDeliveryDate = moment(selectedContract.SupplierDeliveryDate).format(this.dt_template);
        selectedContract.PropertyRightsTransferDate = moment(selectedContract.PropertyRightsTransferDate).format(this.dt_template);
        selectedContract.SupplierSigner.AuthDateFrom = moment(selectedContract.SupplierSigner.AuthDateFrom).format(this.dt_template);
        selectedContract.SupplierSigner.AuthDateTo = moment(selectedContract.SupplierSigner.AuthDateTo).format(this.dt_template);
        selectedContract.DebtorSigners[0].AuthDateFrom = moment(selectedContract.DebtorSigners[0].AuthDateFrom).format(this.dt_template);
        selectedContract.DebtorSigners[0].AuthDateTo = moment(selectedContract.DebtorSigners[0].AuthDateTo).format(this.dt_template);
    };
    __decorate([
        core_1.ViewChild('toDownloadSupplierFPDN'), 
        __metadata('design:type', core_1.ElementRef)
    ], ContractUpdateComponent.prototype, "toDownloadSupplierFPDN", void 0);
    __decorate([
        core_1.ViewChild('toDownloadDebtorFPDN'), 
        __metadata('design:type', core_1.ElementRef)
    ], ContractUpdateComponent.prototype, "toDownloadDebtorFPDN", void 0);
    __decorate([
        core_1.ViewChild('theToast'), 
        __metadata('design:type', core_1.ElementRef)
    ], ContractUpdateComponent.prototype, "theToast", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ContractUpdateComponent.prototype, "_dp_local", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ContractUpdateComponent.prototype, "_upl_local", void 0);
    ContractUpdateComponent = __decorate([
        core_1.Component({
            selector: 'ic-contracts-details',
            templateUrl: '/templates/v0102/suppliers/contract-update.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, storageService_1.StorageService, ng2_translate_1.TranslateService, helperService_1.HelperService, dictService_1.DictionaryService])
    ], ContractUpdateComponent);
    return ContractUpdateComponent;
}());
exports.ContractUpdateComponent = ContractUpdateComponent;
