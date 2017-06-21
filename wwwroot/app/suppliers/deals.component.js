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
var DealsListComponent = (function () {
    function DealsListComponent(dataService, router, storService) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.currentCompany = storService.getValue();
    }
    DealsListComponent.prototype.ngOnInit = function () {
        this.getDeals();
    };
    DealsListComponent.prototype.getDeals = function () {
        var _this = this;
        this.dataService.getDealsForSupplier(this.currentCompany.Guid)
            .subscribe(function (deals) { _this.deals = deals; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    DealsListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    DealsListComponent.prototype.open_selected = function (event) {
        var srcId = event.srcElement.id;
        var Id = parseInt(srcId.split('_')[1]);
        console.log(Id);
        if (Id == undefined || isNaN(Id))
            return;
        //this.router.navigate(['/InvestorHome/Lot/', Id]);
    };
    DealsListComponent = __decorate([
        core_1.Component({
            selector: 'ic-deals-list',
            templateUrl: '/templates/v0102/suppliers/deals-list.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService])
    ], DealsListComponent);
    return DealsListComponent;
}());
exports.DealsListComponent = DealsListComponent;
