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
var dictService_1 = require('./../dictService');
var helperService_1 = require('./../helperService');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var SignFormViewModel_1 = require('../models/SignFormViewModel');
var SignFormDetailsComponent = (function () {
    function SignFormDetailsComponent(dataService, route, router, dict, helper) {
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.dict = dict;
        this.helper = helper;
        this.submit_click = function () {
            var _this = this;
            this.showProgress = true;
            this.errorMessages = new Array();
            this.dataService.accept_signform(this.model)
                .subscribe(function (appForm) { return _this.accept_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
        };
        this.accept_ok = function (appForm) {
            this.showProgress = false;
            var dialog = document.getElementById('successDialog');
            if (dialog)
                dialog.open();
        };
        this.initialize_model();
        this.sfId = this.route.snapshot.params['id'];
    }
    SignFormDetailsComponent.prototype.initialize_model = function () {
        this.model = new SignFormViewModel_1.SignFormViewModel();
        this.model.Company = new CompanyViewModel_1.CompanyViewModel();
    };
    SignFormDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getSignFormDetails(this.sfId)
            .subscribe(function (sf) { _this.model = sf; console.log(sf); _this._dt = moment(_this.model.DirectorBDate).format('YYYY-MM-DD'); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    SignFormDetailsComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SignFormDetailsComponent.prototype, "_dp_local", void 0);
    SignFormDetailsComponent = __decorate([
        core_1.Component({
            selector: 'ic-signform-details',
            templateUrl: '/templates/v0102/admins/sf-details.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, dictService_1.DictionaryService, helperService_1.HelperService])
    ], SignFormDetailsComponent);
    return SignFormDetailsComponent;
}());
exports.SignFormDetailsComponent = SignFormDetailsComponent;
