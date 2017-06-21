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
var RulesComponent = (function () {
    function RulesComponent(storService) {
        this.storService = storService;
        this.currentCompany = storService.getValue();
    }
    RulesComponent = __decorate([
        core_1.Component({
            selector: 'ic-rules',
            templateUrl: '/templates/v0102/suppliers/rules.tpl.html'
        }), 
        __metadata('design:paramtypes', [storageService_1.StorageService])
    ], RulesComponent);
    return RulesComponent;
}());
exports.RulesComponent = RulesComponent;
