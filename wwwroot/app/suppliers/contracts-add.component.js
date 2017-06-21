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
// ***************************************************************************************
var ContractsAddComponent = (function () {
    function ContractsAddComponent(dataService, router, storService, helper, translate, dict) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.translate = translate;
        this.dict = dict;
        this._delivery_types = [1, 2, 3];
        this._dt = new Array();
        this.submit_click = function () {
            this.showProgress = true;
            //this.add_company();
            this.model.DateOfSign = new Date(this._dt[0]);
            this.model.DateFrom = new Date(this._dt[1]);
            this.model.DateTo = new Date(this._dt[2]);
            this.model.DebtorObligationsDate = new Date(this._dt[3]);
            this.model.SupplierDeliveryDate = new Date(this._dt[4]);
            this.model.PropertyRightsTransferDate = new Date(this._dt[5]);
            this.model.SupplierSigner.AuthDateFrom = new Date(this._dt[6]);
            this.model.SupplierSigner.AuthDateTo = new Date(this._dt[7]);
            this.model.DebtorSigners[0].AuthDateFrom = new Date(this._dt[8]);
            this.model.DebtorSigners[0].AuthDateTo = new Date(this._dt[9]);
            //console.log("submit");
            //var frm: any = document.getElementById('frm-add-contract');
            //console.log(frm);
            //frm.validate();
            this.add_contract();
        };
        this.register_ok = function (appForm) {
            this.showProgress = false;
            this.helper.showToast(document.getElementById('theToast'), "Invoice added");
        };
        this.set_contract_type = function (item) {
            if (item == undefined || item == null)
                return;
            this.model.ContractType = item.Id;
        };
        this.set_delivery_type = function (item) {
            if (item == undefined || item == null)
                return;
            this.model.DeliveryType = item.Id;
        };
        this.set_debtor = function (debtor) {
            if (debtor == undefined || debtor == null)
                return;
            console.log(debtor);
            //this.selectedDebtor = this.debtors[ind];
            //this.model.DebtorSigners = new Array<PersonClass>();
            //var person = new PersonClass();
            //this.model.DebtorSigners.push(new PersonClass());
            var upl = document.getElementById('DebtorSigner0_AuthScan');
            if (upl)
                upl.files = new Array();
            this.selectedDebtor = debtor;
            if (debtor == null) {
                this.model.Debtors = null;
                this.model.DebtorSigners[0] = null;
                return;
            }
            this.model.Debtors = new Array();
            this.model.Debtors.push(this.selectedDebtor);
            this.model.DebtorSigners[0] = new PersonViewModel_1.PersonViewModel();
            this.model.DebtorSigners[0].Company = this.selectedDebtor;
            this.model.DebtorSigners[0].FullName = "";
            this.model.DebtorSigners[0].AuthDocumentType = "";
        };
        this.currentCompany = storService.getValue();
        this.initialize_model();
        this.showProgress = false;
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
    ContractsAddComponent.prototype.ngAfterViewInit = function () {
        this.getDebtors();
        //var combobox: any = document.getElementById('ff11');
        //combobox.items = ['Bohrium', 'Boron', 'Bromine', 'Cadmium', 'Caesium', 'Calcium'];
        //combobox.selectedValue = 'Bromine';
    };
    ContractsAddComponent.prototype.initialize_model = function () {
        this.model = new ContractViewModel_1.ContractViewModel();
        this.model.SupplierSigner = new PersonViewModel_1.PersonViewModel();
        this.selectedDebtor = new CompanyViewModel_1.CompanyViewModel();
        this.model.DebtorSigners = new Array();
        this.model.DebtorSigners.push(new PersonViewModel_1.PersonViewModel());
        this.model.IsCessionAcceptable = false;
        // тестовая инициализация
        this.model.ContractType = 2;
        this.model.ContractNumber = "123/34-2016АБ";
        this.model.ContractName = "Контракт на поставку хлебобулочных изделий";
        this._dt.push('2016-08-01');
        this._dt.push('2016-08-02');
        this._dt.push('2016-08-03');
        this._dt.push('2016-08-04');
        this._dt.push('2016-08-05');
        this._dt.push('2016-08-06');
        this._dt.push('2016-08-07');
        this._dt.push('2016-08-08');
        this._dt.push('2016-08-09');
        this._dt.push('2016-08-10');
        this.model.Duration = 2;
        this.model.ContractMatter = "Предмет договора";
        this.model.DeliveryType = 1;
        this.model.CounterClaimTerms = "Условия 1";
        this.model.MoneyBackTerms = "Условия 2";
        this.model.AcceptanceTerms = "Условия 3";
        this.model.PaymentTerms = "Условия 4";
        this.model.IsCessionAcceptable = true;
        this.model.SupplierSigner.FullName = "Подписантов Поставщик Иванович";
        this.model.SupplierSigner.AuthDocumentType = "Доверенность";
    };
    ContractsAddComponent.prototype.after_file_upload = function (event) {
        //console.log(event.srcElement.id,': ',event.detail.xhr.responseText);
        var serverFileName = event.detail.xhr.responseText;
        if (event.srcElement.id == "SupplierSigner_AuthScan") {
            this.model.SupplierSigner.AuthDocumentURL = serverFileName;
        }
        if (event.srcElement.id == "DebtorSigner0_AuthScan") {
            this.model.DebtorSigners[0].AuthDocumentURL = serverFileName;
        }
    };
    ContractsAddComponent.prototype.upl_reject = function (event) {
        this.helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error);
    };
    ContractsAddComponent.prototype.getDebtors = function () {
        var _this = this;
        this.dataService.getDebtorsForSupplier(this.currentCompany.Id)
            .subscribe(function (debtors) { _this.debtors = debtors; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractsAddComponent.prototype.calc_contract_duration = function (event) {
        this.model[event.srcElement.id] = new Date(event.detail.value);
        var d1 = moment(this.model.DateFrom);
        var d2 = moment(this.model.DateTo);
        this.model.Duration = d2.diff(d1, 'days');
    };
    ContractsAddComponent.prototype.add_contract = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.add_contract(this.model)
            .subscribe(function (appForm) { return _this.register_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractsAddComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        console.log(errorObject);
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(fieldName + ": " + errorObject[fieldName][message]);
    };
    ContractsAddComponent.prototype.setLegalForm = function (legalForm) {
    };
    ContractsAddComponent.prototype.moveToStep = function (step) {
        this.currentStep = step;
    };
    ContractsAddComponent.prototype.addDebtor = function () {
        this.router.navigate(['/SupplierHome/AddDebtor']);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ContractsAddComponent.prototype, "_dp_local", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ContractsAddComponent.prototype, "_upl_local", void 0);
    ContractsAddComponent = __decorate([
        core_1.Component({
            selector: 'ic-contracts-add',
            templateUrl: '/templates/v0102/suppliers/contracts-add.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService, helperService_1.HelperService, ng2_translate_1.TranslateService, dictService_1.DictionaryService])
    ], ContractsAddComponent);
    return ContractsAddComponent;
}());
exports.ContractsAddComponent = ContractsAddComponent;
