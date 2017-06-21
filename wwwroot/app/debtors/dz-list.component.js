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
var DZListComponent = (function () {
    function DZListComponent(dataService, router, storService, helper, dict) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.dict = dict;
        this.currentCompany = storService.getValue();
    }
    DZListComponent.prototype.ngOnInit = function () {
        this.getItems();
    };
    DZListComponent.prototype.getItems = function () {
        var _this = this;
        this.dataService.getDZForDebtor(this.currentCompany.Guid)
            .subscribe(function (dzlist) { _this.dzlist = dzlist; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    DZListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    DZListComponent.prototype.dz_details = function (ind) {
        this.router.navigate(['/DebtorHome/DZ/', ind]);
    };
    DZListComponent.prototype.open_selected = function (event) {
        var srcId = event.srcElement.id;
        if (srcId == '')
            return;
        var Id = parseInt(srcId.split('_')[1]);
        this.router.navigate(['/DebtorHome/DZ/', Id]);
    };
    DZListComponent = __decorate([
        core_1.Component({
            selector: 'ic-dz-list',
            templateUrl: '/templates/v0102/debtors/dz-list.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService, helperService_1.HelperService, dictService_1.DictionaryService])
    ], DZListComponent);
    return DZListComponent;
}());
exports.DZListComponent = DZListComponent;
