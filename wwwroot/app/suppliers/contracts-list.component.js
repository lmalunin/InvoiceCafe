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
require('./../rxjs-operators');
var router_1 = require('@angular/router');
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
    ContractsListComponent.prototype.contract_update = function (contractId, debtorCompanyId) {
        this.router.navigate(['/SupplierHome/ContractUpdate/', contractId]);
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
