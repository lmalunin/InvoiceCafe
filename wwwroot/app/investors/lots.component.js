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
var DZViewModel_1 = require('../models/DZViewModel');
var OfferViewModel_1 = require('../models/OfferViewModel');
var SearchLotsViewModel_1 = require('../models/SearchLotsViewModel');
var LotsListComponent = (function () {
    function LotsListComponent(dataService, router, helper) {
        this.dataService = dataService;
        this.router = router;
        this.helper = helper;
    }
    LotsListComponent.prototype.ngOnInit = function () {
        this.newOffer = new OfferViewModel_1.OfferViewModel();
        this.filters = new SearchLotsViewModel_1.SearchLotsViewModel();
        this.filters.useFilters = false;
        this.filters.bySupplierName = false;
        this.filters.bySupplierDealsSum = false;
        this.filters.bySupplierDealsDate = false;
        this.filters.byDebtorName = false;
        this.filters.byDebtorDealsSum = false;
        this.filters.byDebtorDealsDate = false;
        this.filters.byDZDays = false;
        this.filters.byDZVerType = false;
        this.filters.byLotSum = false;
        this.filters.byLotDZPart = false;
        this.filters.byLotYearPercent = false;
        this.filters.DZVerType = 10;
        this.getLots();
    };
    LotsListComponent.prototype.getLots = function () {
        var _this = this;
        this.dataService.getLotsByFilter(this.filters)
            .subscribe(function (lots) { _this.lots = lots; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    LotsListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    LotsListComponent.prototype.lot_details = function (Id) {
        this.router.navigate(['/InvestorHome/Lot/', Id]);
    };
    LotsListComponent.prototype.filters_submit_click = function () {
        //console.log(this.filters);
        this.getLots();
    };
    LotsListComponent.prototype.make_offer_click = function () {
        this.newOffer = new OfferViewModel_1.OfferViewModel();
        var dialog = document.getElementById('addLotDialog');
        if (dialog)
            dialog.open();
    };
    LotsListComponent.prototype.make_offer = function () {
        var _this = this;
        var i;
        var offer;
        this.offers = new Array();
        for (i = 0; i < this.lots.length; i++) {
            if (!this.lots[i].IsChecked)
                continue;
            offer = new OfferViewModel_1.OfferViewModel();
            offer.Lot = this.lots[i];
            offer.DZ = new DZViewModel_1.DZViewModel();
            offer.Lot.DZ.Sum = 1; //hack
            offer.DZ.Sum = 1; //hack
            offer.DZ.Days = 1; //hack
            if (this.newOffer.FullAccept) {
                offer.DZPart = offer.Lot.DZPart;
                offer.YearPercent = offer.Lot.YearPercent;
                offer.Type = 5;
            }
            else {
                offer.DZPart = this.newOffer.DZPart;
                offer.YearPercent = this.newOffer.YearPercent;
                offer.Type = 10;
            }
            this.offers.push(offer);
        }
        if (this.offers.length == 0) {
            console.log("No lots selected");
            return;
        }
        this.dataService.add_offers(this.offers)
            .subscribe(function (offers) { _this.make_offer_ok(offers); }, function (errorObject) { return _this.process_error(errorObject); });
        //var grid: any = document.getElementById('lotsGrid');
        //if (!grid)
        //    return;
        //this.offers = new Array<OfferViewModel>();
        //for (var i of grid.selection.selected()) {
        //    var offer = new OfferViewModel();
        //    offer.Lot = this.lots[i];
        //    if (this.newOffer.FullAccept) {
        //        offer.DZPart = offer.Lot.DZPart;
        //        offer.YearPercent = offer.Lot.YearPercent;
        //        offer.Type = 5;
        //    }
        //    else {
        //        offer.DZPart = this.newOffer.DZPart;
        //        offer.YearPercent = this.newOffer.YearPercent;
        //        offer.Type = 10;
        //    }
        //    this.offers.push(offer);
        //}
        //this.dataService.add_offers(this.offers)
        //    .subscribe(
        //    offers => { this.make_offer_ok(offers) },
        //    errorObject => this.process_error(errorObject));
    };
    LotsListComponent.prototype.make_offer_ok = function (offers) {
        this.helper.showToast(document.getElementById('theToast'), "Оферты отправлены");
        this.getLots();
    };
    LotsListComponent = __decorate([
        core_1.Component({
            selector: 'ic-lots-list',
            templateUrl: '/templates/v0102/investors/lots-list.tpl.html',
            styles: ["\n        #investors-lots-list {\n            width: 77%;\n        }\n\n        #investors-lots-filters {\n            width: 23%;\n            padding: 12px;\n            box-sizing: border-box;\n        }\n\n        #investors-lots-filters paper-card {\n            margin-bottom: 12px;\n        }\n\n        #investors-lots {\n            height: 1600px;\n            border: 1px solid #ddd;\n            margin: 20px 0;\n        }\n        "]
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, helperService_1.HelperService])
    ], LotsListComponent);
    return LotsListComponent;
}());
exports.LotsListComponent = LotsListComponent;
