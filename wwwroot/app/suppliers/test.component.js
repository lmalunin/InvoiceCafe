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
var storageService_1 = require('./../storageService');
var dataService_1 = require('./../dataService');
var dictService_1 = require('./../dictService');
var helperService_1 = require('./../helperService');
var TestComponent = (function () {
    function TestComponent(dataService, storService, dict, helper) {
        this.dataService = dataService;
        this.storService = storService;
        this.dict = dict;
        this.helper = helper;
        this.currentCompany = storService.getValue();
        this._dp_local = this.helper.DATE_PICKER_i18n_ru;
    }
    TestComponent.prototype.ngOnInit = function () {
    };
    TestComponent.prototype.process_date = function (event) {
        //console.log(event.detail.value);
        var d = moment(event.detail.value);
        console.log(d);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TestComponent.prototype, "_dp_local", void 0);
    TestComponent = __decorate([
        core_1.Component({
            selector: 'ic-application',
            templateUrl: '/templates/v0102/suppliers/test.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, storageService_1.StorageService, dictService_1.DictionaryService, helperService_1.HelperService])
    ], TestComponent);
    return TestComponent;
}());
exports.TestComponent = TestComponent;
