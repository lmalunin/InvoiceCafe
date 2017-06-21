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
var PersonViewModel_1 = require('../models/PersonViewModel');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var UpdatePersonComponent = (function () {
    function UpdatePersonComponent(dataService, route, router, storService, helper) {
        var _this = this;
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this._person = new PersonViewModel_1.PersonViewModel();
        this.EDS_Ok = false;
        this.showProgress = false;
        this.FullPowersDocumentsNames = new Array();
        this.IdentityDocumentsNames = new Array();
        this.dataService.getPersonById(this.route.snapshot.params['id'])
            .subscribe(function (person) {
            _this._person = person;
            _this._person.DateOfBirth = moment(person.DateOfBirth).format('YYYY-MM-DD');
            _this._person.Company = storService.getValue();
            _this.FullPowersDocumentsNames = JSON.parse(_this._person.FullPowersDocumentsNames);
            _this.IdentityDocumentsNames = JSON.parse(_this._person.IdentityDocumentsNames);
        }, function (errorObject) { return _this.process_error(errorObject); });
    }
    UpdatePersonComponent.prototype.ngOnInit = function () { };
    UpdatePersonComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    UpdatePersonComponent = __decorate([
        core_1.Component({
            selector: 'ic-update-supplier',
            templateUrl: '/templates/v0102/suppliers/update-person.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], UpdatePersonComponent);
    return UpdatePersonComponent;
}());
exports.UpdatePersonComponent = UpdatePersonComponent;
