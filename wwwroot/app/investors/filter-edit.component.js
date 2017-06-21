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
var SearchLotsViewModel_1 = require('../models/SearchLotsViewModel');
// ***************************************************************************************
var FilterEditComponent = (function () {
    function FilterEditComponent(dataService, route, router, storService, helper) {
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.storService = storService;
        this.helper = helper;
        this.pageTitle = 'Редактирование фильтра';
        this.submit_click = function () {
            var _this = this;
            this.errorMessages = new Array();
            this.dataService.addOrUpdateFilter(this.filter)
                .subscribe(function (res) { return _this.service_ok(res); }, function (errorObject) { return _this.process_error(errorObject); });
        };
        this.currentCompany = storService.getValue();
        this.showProgress = false;
        this.filter = new SearchLotsViewModel_1.SearchLotsViewModel();
    }
    FilterEditComponent.prototype.ngOnInit = function () {
        this.getFilter(this.route.snapshot.params['id']);
    };
    FilterEditComponent.prototype.getFilter = function (id) {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.getFilter(id)
            .subscribe(function (res) { _this.filterFound(res); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    FilterEditComponent.prototype.filterFound = function (filter) {
        this.filter = filter;
        this.filter.AddOrUpdate = 5;
    };
    FilterEditComponent.prototype.set_DebtorDealsDays = function (days) {
        if (days == undefined)
            return;
        this.filter.DebtorDealsDays_max = days;
    };
    FilterEditComponent.prototype.set_DZVerType = function (code) {
        if (code == undefined)
            return;
        this.filter.DZVerType = code;
    };
    FilterEditComponent.prototype.sliderDZDays_max = function (event) {
        this.filter.DZDays_max = parseInt(event.srcElement.immediateValue);
    };
    FilterEditComponent.prototype.sliderLotSum_max = function (event) {
        this.filter.LotSum_max = parseInt(event.srcElement.immediateValue);
    };
    FilterEditComponent.prototype.sliderLotDZPart_max = function (event) {
        this.filter.LotDZPart_max = parseInt(event.srcElement.immediateValue);
    };
    FilterEditComponent.prototype.sliderLotYearPercent_max = function (event) {
        this.filter.LotYearPercent_max = parseInt(event.srcElement.immediateValue);
    };
    FilterEditComponent.prototype.service_ok = function () {
        this.router.navigate(['InvestorHome/Lots']);
    };
    FilterEditComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        this.helper.showToast(document.getElementById('theToast'), "Ошибка сохранения");
        console.log(errorObject);
    };
    FilterEditComponent = __decorate([
        core_1.Component({
            selector: 'ic-filter-add',
            templateUrl: '/templates/v0102/investors/filters-update.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, storageService_1.StorageService, helperService_1.HelperService])
    ], FilterEditComponent);
    return FilterEditComponent;
}());
exports.FilterEditComponent = FilterEditComponent;
