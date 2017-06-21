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
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var DZViewModel_1 = require('../models/DZViewModel');
var DZDetailsComponent = (function () {
    function DZDetailsComponent(dataService, route, router, helper) {
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.helper = helper;
        this.accept_ok = function (appForm) {
            this.showProgress = false;
            this.helper.showToast(document.getElementById('theToast'), "Задолженность акцептована");
            this.model.Status = 5;
        };
        this.submit_click = function () {
            var _this = this;
            this.showProgress = true;
            this.errorMessages = new Array();
            this.dataService.accept_dz(this.model)
                .subscribe(function (appForm) { return _this.accept_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
        };
        this.initialize_model();
        this.dzId = this.route.snapshot.params['id'];
        this._dp_local = this.helper.DATE_PICKER_i18n_en;
    }
    DZDetailsComponent.prototype.initialize_model = function () {
        this.model = new DZViewModel_1.DZViewModel();
        this.model.Supplier = new CompanyViewModel_1.CompanyViewModel();
        this.model.Debtor = new CompanyViewModel_1.CompanyViewModel();
    };
    DZDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getDZDetails(this.dzId)
            .subscribe(function (dz) { _this.model = dz; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    DZDetailsComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DZDetailsComponent.prototype, "_dp_local", void 0);
    DZDetailsComponent = __decorate([
        core_1.Component({
            selector: 'ic-dz-details',
            templateUrl: '/templates/v0102/debtors/dz-details.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, helperService_1.HelperService])
    ], DZDetailsComponent);
    return DZDetailsComponent;
}());
exports.DZDetailsComponent = DZDetailsComponent;
