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
var dictService_1 = require('./../dictService');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var CompaniesListComponent = (function () {
    function CompaniesListComponent(dataService, router, helper, dict) {
        this.dataService = dataService;
        this.router = router;
        this.helper = helper;
        this.dict = dict;
    }
    CompaniesListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getSignforms()
            .subscribe(function (sforms) { _this.model = sforms; console.log(_this.model); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    CompaniesListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    CompaniesListComponent.prototype.sf_details = function (Id) {
        this.router.navigate(['/AdminHome/SignForm/', Id]);
    };
    CompaniesListComponent = __decorate([
        core_1.Component({
            selector: 'ic-compaines-list',
            templateUrl: '/templates/v0102/admins/companies-list.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, helperService_1.HelperService, dictService_1.DictionaryService])
    ], CompaniesListComponent);
    return CompaniesListComponent;
}());
exports.CompaniesListComponent = CompaniesListComponent;
