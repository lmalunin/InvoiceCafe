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
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var ContractViewModel_1 = require('../models/ContractViewModel');
var PersonViewModel_1 = require('../models/PersonViewModel');
var DZViewModel_1 = require('../models/DZViewModel');
var LotViewModel_1 = require('../models/LotViewModel');
var ContractsListComponent = (function () {
    function ContractsListComponent(dataService, router, storService) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.currentCompany = storService.getValue();
    }
    ContractsListComponent.prototype.ngOnInit = function () {
        this.getContracts();
    };
    ContractsListComponent.prototype.getContracts = function () {
        var _this = this;
        this.dataService.getContractsForSupplier(this.currentCompany.Id)
            .subscribe(function (contracts) { _this.contracts = contracts; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractsListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    ContractsListComponent.prototype.open_selected_contract = function (event) {
        var srcId = event.srcElement.id;
        var contractGuid = srcId.split('_')[1];
        if (contractGuid == undefined)
            return;
        //console.log("open: " + contractGuid);
        this.router.navigate(['/SupplierHome/Contract/', contractGuid]);
    };
    ContractsListComponent.prototype.contract_details = function (guid) {
        this.router.navigate(['/SupplierHome/Contract/', guid]);
    };
    ContractsListComponent.prototype.navigate_to_add = function () {
        this.router.navigate(['/SupplierHome/AddContract/']);
    };
    ContractsListComponent = __decorate([
        core_1.Component({
            selector: 'ic-contracts-list',
            templateUrl: '/templates/v0102/suppliers/contracts-list.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService])
    ], ContractsListComponent);
    return ContractsListComponent;
}());
exports.ContractsListComponent = ContractsListComponent;
// ***************************************************************************************
var ContractDetailsComponent = (function () {
    function ContractDetailsComponent(dataService, route, router, storService, helper) {
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.add_dz_ok = function (appForm) {
            this.showProgress = false;
            //this.model.DZ.push(appForm);
            //this.clean_dz();
            this.getContract();
            this.helper.showToast(document.getElementById('theToast'), "Invoice added");
        };
        this.add_dz_error = function (errorObject) {
            this.showProgress = false;
            this.helper.showToast(document.getElementById('theToast'), "Error");
            this.process_error(errorObject);
        };
        this.add_lot_ok = function (appForm) {
            this.showProgress = false;
            this.getContract();
            this.helper.showToast(document.getElementById('theToast'), "Lot added");
        };
        this.currentCompany = storService.getValue();
        this.initialize_model();
        this.contractGuid = this.route.snapshot.params['id'];
        this._dp_local = this.helper.DATE_PICKER_i18n_en;
        this._upl_local = this.helper.UPLOAD_i18n_en;
        this.EDS_Ok = false;
    }
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
    ContractDetailsComponent.prototype.populate_data = function () {
        this._dt = new Array(12);
        this._dt[0] = moment(this.model.DateOfSign).format('YYYY-MM-DD');
        this._dt[1] = moment(this.model.DateFrom).format('YYYY-MM-DD');
        this._dt[2] = moment(this.model.DateTo).format('YYYY-MM-DD');
        this._dt[3] = moment(this.model.DebtorObligationsDate).format('YYYY-MM-DD');
        this._dt[4] = moment(this.model.SupplierDeliveryDate).format('YYYY-MM-DD');
        this._dt[5] = moment(this.model.PropertyRightsTransferDate).format('YYYY-MM-DD');
        this._dt[6] = moment(this.model.SupplierSigner.AuthDateFrom).format('YYYY-MM-DD');
        this._dt[7] = moment(this.model.SupplierSigner.AuthDateTo).format('YYYY-MM-DD');
        this._dt[8] = moment(this.model.DebtorSigners[0].AuthDateFrom).format('YYYY-MM-DD');
        this._dt[9] = moment(this.model.DebtorSigners[0].AuthDateTo).format('YYYY-MM-DD');
        this.clean_dz();
        this._dt[10] = moment(this.newDZ.DateFrom).format('YYYY-MM-DD');
        this._dt[11] = moment(this.newDZ.DateTo).format('YYYY-MM-DD');
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
    ContractDetailsComponent.prototype.add_dz = function () {
        var _this = this;
        this.showProgress = true;
        this.newDZ.DateFrom = new Date(this._dt[10]);
        this.newDZ.DateTo = new Date(this._dt[11]);
        this.errorMessages = new Array();
        this.dataService.add_dz(this.newDZ)
            .subscribe(function (appForm) { return _this.add_dz_ok(appForm); }, function (errorObject) { return _this.add_dz_error(errorObject); });
    };
    ContractDetailsComponent.prototype.add_lot_click = function (ind) {
        this.newLot = new LotViewModel_1.LotViewModel();
        this.newLot.DZ = this.model.DZ[ind];
        this.newLot.ContractGuid = this.contractGuid;
        this.newLot.Sum = this.newLot.DZ.Sum;
        var dialog = document.getElementById('addLotDialog');
        if (dialog)
            dialog.open();
    };
    ContractDetailsComponent.prototype.add_lot = function () {
        var _this = this;
        this.showProgress = true;
        this.errorMessages = new Array();
        this.dataService.add_lot(this.newLot)
            .subscribe(function (appForm) { return _this.add_lot_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    ContractDetailsComponent.prototype.calc_dz_duration = function (event) {
        if (event.srcElement.id == 'newDZ.DateFrom')
            this._dt[10] = moment(event.detail.value).format('YYYY-MM-DD');
        if (event.srcElement.id == 'newDZ.DateTo')
            this._dt[11] = moment(event.detail.value).format('YYYY-MM-DD');
        var d1 = moment(this._dt[10]);
        var d2 = moment(this._dt[11]);
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
            templateUrl: '/templates/v0102/suppliers/contracts-details.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], ContractDetailsComponent);
    return ContractDetailsComponent;
}());
exports.ContractDetailsComponent = ContractDetailsComponent;
// ***************************************************************************************
var ContractsAddComponent = (function () {
    function ContractsAddComponent(dataService, router, storService, helper) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
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
            //console.log(item);
            this.model.ContractType = item.Id;
        };
        this.set_delivery_type = function (item) {
            this.model.DeliveryType = item.Id;
        };
        this.set_debtor = function (debtor) {
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
        this._dp_local = this.helper.DATE_PICKER_i18n_en;
        this._upl_local = this.helper.UPLOAD_i18n_en;
    }
    ContractsAddComponent.prototype.ngOnInit = function () {
        this.getDebtors();
    };
    ContractsAddComponent.prototype.initialize_model = function () {
        this.model = new ContractViewModel_1.ContractViewModel();
        this.model.SupplierSigner = new PersonViewModel_1.PersonViewModel();
        this.selectedDebtor = new CompanyViewModel_1.CompanyViewModel();
        this.model.DebtorSigners = new Array();
        this.model.DebtorSigners.push(new PersonViewModel_1.PersonViewModel());
        this.model.IsCessionAcceptable = false;
        // тестовая инициализация
        //this.model.ContractType = 2;
        //this.model.ContractNumber = "123/34-2016АБ";
        //this.model.ContractName = "Контракт на поставку хлебобулочных изделий";
        //this._dt.push('2016-08-01');
        //this._dt.push('2016-08-02');
        //this._dt.push('2016-08-03');
        //this._dt.push('2016-08-04');
        //this._dt.push('2016-08-05');
        //this._dt.push('2016-08-06');
        //this._dt.push('2016-08-07');
        //this._dt.push('2016-08-08');
        //this._dt.push('2016-08-09');
        //this._dt.push('2016-08-10');
        //this.model.Duration = 2;
        //this.model.ContractMatter = "Предмет договора";
        //this.model.DeliveryType = 1;
        //this.model.CounterClaimTerms = "Условия 1";
        //this.model.MoneyBackTerms = "Условия 2";
        //this.model.AcceptanceTerms = "Условия 3";
        //this.model.PaymentTerms = "Условия 4";
        //this.model.IsCessionAcceptable = true;
        //this.model.SupplierSigner.FullName = "Подписантов Поставщик Иванович";
        //this.model.SupplierSigner.AuthDocumentType = "Доверенность";
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
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], ContractsAddComponent);
    return ContractsAddComponent;
}());
exports.ContractsAddComponent = ContractsAddComponent;
