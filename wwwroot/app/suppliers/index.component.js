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
var IndexComponent = (function () {
    function IndexComponent(storService) {
        this.storService = storService;
        this.step1 = 0;
        this.step2 = 0;
        this.step3 = 0;
        this.numOfCompletedSteps = 0;
        this.currentCompany = storService.getValue();
        this.step1 = (this.currentCompany.RegisterSteps & 1) == 1 ? 1 : 0;
        this.step2 = (this.currentCompany.RegisterSteps & 2) == 2 ? 1 : 0;
        this.step3 = (this.currentCompany.RegisterSteps & 4) == 4 ? 1 : 0;
        this.numOfCompletedSteps = this.step1 + this.step2 + this.step3;
    }
    IndexComponent = __decorate([
        core_1.Component({
            selector: 'ic-index',
            templateUrl: '/templates/v0102/suppliers/index.tpl.html'
        }), 
        __metadata('design:paramtypes', [storageService_1.StorageService])
    ], IndexComponent);
    return IndexComponent;
}());
exports.IndexComponent = IndexComponent;
