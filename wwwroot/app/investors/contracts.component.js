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
var helperService_1 = require('./../helperService');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var ContractViewModel_1 = require('../models/ContractViewModel');
var PersonViewModel_1 = require('../models/PersonViewModel');
var DZViewModel_1 = require('../models/DZViewModel');
var LotViewModel_1 = require('../models/LotViewModel');
// ***************************************************************************************
var ContractDetailsComponent = (function () {
    function ContractDetailsComponent(dataService, route, router, helper) {
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.helper = helper;
        this.initialize_model();
        this.contractGuid = this.route.snapshot.params['id'];
        this.lotId = this.route.snapshot.params['lotId'];
        this._dp_local = {
            today: 'сегодня',
            cancel: 'отмена',
            firstDayOfWeek: 1,
            monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
            weekdaysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
            formatDate: function (d) {
                return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('.');
            },
            formatTitle: function (monthName, fullYear) {
                return monthName + ' ' + fullYear;
            }
        };
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
        this._dt = new Array(10);
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
        this.newDZ = new DZViewModel_1.DZViewModel();
        this.newDZ.ContractGuid = this.model.Guid;
        this.newDZ.Debtor = this.model.Debtors[0];
        this.newDZ.DocumentsURLs = new Array();
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
    ContractDetailsComponent = __decorate([
        core_1.Component({
            selector: 'ic-contracts-details',
            templateUrl: '/templates/v0102/investors/contracts-details.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, helperService_1.HelperService])
    ], ContractDetailsComponent);
    return ContractDetailsComponent;
}());
exports.ContractDetailsComponent = ContractDetailsComponent;
