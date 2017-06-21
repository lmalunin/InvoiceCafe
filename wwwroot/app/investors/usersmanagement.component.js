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
var ng2_translate_1 = require('ng2-translate/ng2-translate');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var UsersManagementComponent = (function () {
    function UsersManagementComponent(_dataService, _storService, _router, _translate) {
        this._dataService = _dataService;
        this._storService = _storService;
        this._router = _router;
        this._translate = _translate;
        this.currentCompany = this._storService.getValue();
    }
    UsersManagementComponent.prototype.ngOnInit = function () {
        this.getAllUsersForCompany();
    };
    UsersManagementComponent.prototype.getAllUsersForCompany = function () {
        var _this = this;
        this._dataService.getAllUsersForCompany(this.currentCompany.Id)
            .subscribe(function (_persons) { _this._persons = _persons; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    UsersManagementComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    UsersManagementComponent.prototype.navigate_to_add = function () {
        this._router.navigate(['InvestorHome/AddPerson']);
    };
    UsersManagementComponent.prototype.navigate_to_update = function (id) {
        this._router.navigate(['InvestorHome/UpdatePerson', id]);
    };
    UsersManagementComponent = __decorate([
        core_1.Component({
            selector: 'ic-users-management',
            templateUrl: '/templates/v0102/investors/usersmanagement.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, storageService_1.StorageService, router_1.Router, ng2_translate_1.TranslateService])
    ], UsersManagementComponent);
    return UsersManagementComponent;
}());
exports.UsersManagementComponent = UsersManagementComponent;
