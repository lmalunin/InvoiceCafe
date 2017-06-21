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
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var DZViewModel_1 = require('../models/DZViewModel');
var LotViewModel_1 = require('../models/LotViewModel');
var LotDetailsComponent = (function () {
    function LotDetailsComponent(dataService, route, router) {
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.submit_click = function () {
            this.showProgress = true;
            this.accept_lot();
        };
        this.initialize_model();
        this.lotId = this.route.snapshot.params['id'];
    }
    LotDetailsComponent.prototype.initialize_model = function () {
        this.model = new LotViewModel_1.LotViewModel();
        this.model.DZ = new DZViewModel_1.DZViewModel();
        this.model.DZ.Supplier = new CompanyViewModel_1.CompanyViewModel();
        this.model.DZ.Debtor = new CompanyViewModel_1.CompanyViewModel();
    };
    LotDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getLotDetails(this.lotId)
            .subscribe(function (lot) { _this.model = lot; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    LotDetailsComponent.prototype.accept_lot = function () {
        this.errorMessages = new Array();
        //this.dataService.accept_lot(this.model)
        //    .subscribe(
        //    appForm => this.accept_ok(appForm),
        //    errorObject => this.process_error(errorObject));
    };
    LotDetailsComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LotDetailsComponent.prototype, "_dp_local", void 0);
    LotDetailsComponent = __decorate([
        core_1.Component({
            selector: 'ic-lot-details',
            templateUrl: '/templates/v0102/investors/lot-details.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router])
    ], LotDetailsComponent);
    return LotDetailsComponent;
}());
exports.LotDetailsComponent = LotDetailsComponent;
