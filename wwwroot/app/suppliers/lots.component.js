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
var LotsListComponent = (function () {
    function LotsListComponent(dataService, router, storService) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.currentCompany = storService.getValue();
    }
    LotsListComponent.prototype.ngOnInit = function () {
        this.getLots();
    };
    LotsListComponent.prototype.getLots = function () {
        var _this = this;
        this.dataService.getLotsForSupplier(this.currentCompany.Guid)
            .subscribe(function (lots) { _this.lots = lots; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    LotsListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    LotsListComponent.prototype.lots_list = function (Id) {
        //var srcId: string = event.srcElement.id;
        //var contractGuid: string = srcId.split('_')[1];
        //if (contractGuid == undefined)
        //    return;
        //this.router.navigate(['/SupplierHome/Contract/', contractGuid]);
    };
    LotsListComponent = __decorate([
        core_1.Component({
            selector: 'ic-lots-list',
            templateUrl: '/templates/v0102/suppliers/lots-list.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService])
    ], LotsListComponent);
    return LotsListComponent;
}());
exports.LotsListComponent = LotsListComponent;
