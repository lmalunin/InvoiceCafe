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
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var LotViewModel_1 = require('../models/LotViewModel');
var OfferViewModel_1 = require('../models/OfferViewModel');
var OfferDetailsComponent = (function () {
    function OfferDetailsComponent(dataService, route, router, storService, helper) {
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.currentCompany = storService.getValue();
        this.model = new OfferViewModel_1.OfferViewModel();
        this.model.Lot = new LotViewModel_1.LotViewModel();
        this.model.Investor = new CompanyViewModel_1.CompanyViewModel();
        this.model.Id = this.route.snapshot.params['id'];
    }
    OfferDetailsComponent.prototype.ngOnInit = function () {
        this.getOffer();
    };
    OfferDetailsComponent.prototype.getOffer = function () {
        var _this = this;
        this.dataService.getOfferDetails(this.model.Id)
            .subscribe(function (offer) { _this.model = offer; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    OfferDetailsComponent.prototype.process_offer_click = function (res) {
        var _this = this;
        this.model.Status = res;
        this.dataService.processOffer(this.model)
            .subscribe(function (offer) { _this.process_offer_ok(offer); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    OfferDetailsComponent.prototype.process_offer_ok = function (offer) {
        this.model = offer;
        if (offer.Status == 10) {
            console.log(document.getElementById('theToast'));
            this.helper.showToast(document.getElementById('theToast'), "Оффер принят");
        }
        if (offer.Status == 20)
            this.helper.showToast(document.getElementById('theToast'), "Оффер отклонен");
    };
    OfferDetailsComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log("Error: ", errorObject);
    };
    OfferDetailsComponent = __decorate([
        core_1.Component({
            selector: 'ic-offer-details',
            templateUrl: '/templates/v0102/suppliers/offer-details.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], OfferDetailsComponent);
    return OfferDetailsComponent;
}());
exports.OfferDetailsComponent = OfferDetailsComponent;
