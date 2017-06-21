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
var DZListComponent = (function () {
    function DZListComponent(dataService, router, helper) {
        this.dataService = dataService;
        this.router = router;
        this.helper = helper;
    }
    DZListComponent.prototype.ngOnInit = function () {
        this.getItems();
    };
    DZListComponent.prototype.getItems = function () {
        var _this = this;
        this.dataService.getDZForAdmin()
            .subscribe(function (dzlist) { _this.dzlist = dzlist; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    DZListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    DZListComponent.prototype.dz_details = function (ind) {
        this.router.navigate(['/AdminHome/DZ/', ind]);
    };
    DZListComponent = __decorate([
        core_1.Component({
            selector: 'ic-dz-list',
            templateUrl: '/templates/v0102/admins/dz-list.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, helperService_1.HelperService])
    ], DZListComponent);
    return DZListComponent;
}());
exports.DZListComponent = DZListComponent;
