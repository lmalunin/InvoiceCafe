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
require('./../rxjs-operators');
var dataService_1 = require('./../dataService');
var storageService_1 = require('./../storageService');
var helperService_1 = require('./../helperService');
var router_1 = require('@angular/router');
// ***************************************************************************************
var AddFilter = (function () {
    function AddFilter(dataService, router, storService, helper) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.submit_click = function () {
            this.showProgress = true;
        };
        this.currentCompany = storService.getValue();
        this.showProgress = false;
    }
    AddFilter.prototype.initialize_model = function () {
    };
    AddFilter.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    AddFilter = __decorate([
        core_1.Component({
            selector: 'ic-filter-add',
            templateUrl: '/templates/v0102/investors/filter-add.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], AddFilter);
    return AddFilter;
}());
exports.AddFilter = AddFilter;
