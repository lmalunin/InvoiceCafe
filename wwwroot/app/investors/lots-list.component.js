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
var storageService_1 = require('./../storageService');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var OfferViewModel_1 = require('../models/OfferViewModel');
var SearchLotsResults_1 = require('../models/SearchLotsResults');
var LotsListComponent = (function () {
    function LotsListComponent(dataService, router, helper, storService) {
        this.dataService = dataService;
        this.router = router;
        this.helper = helper;
        this.storService = storService;
        this.errorMessages = new Array();
        this.currentCompany = storService.getValue();
        this.numOfSelectedLots = 0;
        this.selectAll = false;
    }
    LotsListComponent.prototype.ngOnInit = function () {
        this.newOffer = new OfferViewModel_1.OfferViewModel();
        this.getFilters();
    };
    LotsListComponent.prototype.getFilters = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.getFiltersForInvestor(this.currentCompany.Id)
            .subscribe(function (res) { _this.filtersFound(res); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    LotsListComponent.prototype.filtersFound = function (filters) {
        this.filters = filters;
        this.numOfFilters = filters.length;
        this.currentFilter = filters[0];
        this.filterTitle = this.currentFilter.FilterName;
        this.getLots();
    };
    LotsListComponent.prototype.getLots = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.getLotsByFilter(this.currentFilter)
            .subscribe(function (lots) { _this.loadLotsToView(lots); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    LotsListComponent.prototype.loadLotsToView = function (lots) {
        this.lots = lots;
        this.numOfSelectedLots = 0;
        this.selectAll = false;
    };
    LotsListComponent.prototype.selectAllClicked = function () {
        for (var j = 0; j < this.lots.length; j++)
            this.lots[j].IsChecked = this.selectAll;
        if (this.selectAll)
            this.numOfSelectedLots = this.lots.length;
        else
            this.numOfSelectedLots = 0;
    };
    LotsListComponent.prototype.editFilter = function (id) {
        this.router.navigate(['/InvestorHome/EditFilter/', id]);
    };
    LotsListComponent.prototype.setFilter = function (i) {
        console.log(this.filters);
        console.log(i, this.filters[i]);
        if (i == -1) {
            this.currentFilter = null;
            this.filterTitle = "(без фильтра)";
        }
        else {
            this.currentFilter = this.filters[i];
            this.filterTitle = this.currentFilter.FilterName;
        }
        this.getLots();
    };
    LotsListComponent.prototype.lotsClicked = function () {
        var i = 0;
        for (var j = 0; j < this.lots.length; j++)
            if (this.lots[j].IsChecked)
                i++;
        this.numOfSelectedLots = i;
    };
    LotsListComponent.prototype.acceptLots = function () {
        this.newOffer = new OfferViewModel_1.OfferViewModel();
        var dialog = document.getElementById('acceptLotsDialog');
        if (dialog)
            dialog.open();
    };
    LotsListComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
    };
    LotsListComponent.prototype.lot_details = function (Id) {
        this.router.navigate(['/InvestorHome/Lot/', Id]);
    };
    LotsListComponent.prototype.filters_submit_click = function () {
        //console.log(this.filters);
        this.getLots();
    };
    LotsListComponent.prototype.makeOfferClick = function () {
        this.newOffer = new OfferViewModel_1.OfferViewModel();
        var dialog = document.getElementById('addLotDialog');
        if (dialog)
            dialog.open();
    };
    LotsListComponent.prototype.makeOffer = function () {
        var _this = this;
        var i;
        this.offers = new Array();
        for (i = 0; i < this.lots.length; i++) {
            if (!this.lots[i].IsChecked)
                continue;
            var offer = new SearchLotsResults_1.SearchLotsResults();
            offer = this.lots[i];
            if (this.newOffer.FullAccept) {
                offer.OfferDZPart = this.lots[i].DZPart;
                offer.OfferYearPercent = this.lots[i].LotYearPercent;
                offer.OfferType = 5;
            }
            else {
                offer.OfferDZPart = this.newOffer.DZPart;
                offer.OfferYearPercent = this.newOffer.YearPercent;
                offer.OfferType = 10;
            }
            this.offers.push(offer);
        }
        if (this.offers.length == 0) {
            console.log("No lots selected");
            return;
        }
        this.dataService.addOffers(this.offers)
            .subscribe(function (offers) { _this.makeOfferOk(offers); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    //makeOffer() {
    //    var i: number;
    //    var offer: OfferViewModel;
    //    this.offers = new Array<OfferViewModel>();
    //    for (i = 0; i < this.lots.length; i++) {
    //        if (!this.lots[i].IsChecked)
    //            continue;
    //        offer = new OfferViewModel();
    //        offer.Lot = new LotViewModel();
    //        offer.Lot.Id = this.lots[i].LotId;
    //        offer.Lot.DZPart = this.lots[i].DZPart;
    //        offer.Lot.Sum = this.lots[i].LotSum;
    //        offer.Lot.YearPercent = this.lots[i].LotYearPercent;
    //        offer.Lot.DZ = new DZViewModel();
    //        offer.Lot.DZ.Supplier = new CompanyViewModel();
    //        offer.Lot.DZ.Supplier.Id = this.lots[i].SupplierId;
    //        offer.Lot.DZ.Debtor = new CompanyViewModel();
    //        offer.Lot.DZ.Debtor.Id = this.lots[i].DebtorId;
    //        //избыточное заполнение, иначе модель ругается, разобраться позже
    //        offer.Lot.DZ.Sum = this.lots[i].LotSum; 
    //        offer.Lot.DZ.Days = this.lots[i].DZDays;
    //        offer.DZ = new DZViewModel();
    //        offer.DZ.Sum = this.lots[i].LotSum;
    //        offer.DZ.Days = this.lots[i].DZDays;
    //        if (this.newOffer.FullAccept) {
    //            offer.DZPart = offer.Lot.DZPart;
    //            offer.YearPercent = offer.Lot.YearPercent;
    //            offer.Type = 5;
    //        }
    //        else {
    //            offer.DZPart = this.newOffer.DZPart;
    //            offer.YearPercent = this.newOffer.YearPercent;
    //            offer.Type = 10;
    //        }
    //        this.offers.push(offer);
    //    }
    //    if (this.offers.length == 0) {
    //        console.log("No lots selected");
    //        return;
    //    }
    //    this.dataService.add_offers(this.offers)
    //        .subscribe(
    //        offers => { this.make_offer_ok(offers) },
    //        errorObject => this.process_error(errorObject));
    //}
    LotsListComponent.prototype.makeOfferOk = function (offers) {
        this.helper.showToast(document.getElementById('theToast'), "Оферты отправлены");
        this.getLots();
    };
    LotsListComponent = __decorate([
        core_1.Component({
            selector: 'ic-lots-list',
            templateUrl: '/templates/v0102/investors/lots-list.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, helperService_1.HelperService, storageService_1.StorageService])
    ], LotsListComponent);
    return LotsListComponent;
}());
exports.LotsListComponent = LotsListComponent;
