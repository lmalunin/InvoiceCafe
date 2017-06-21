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
var CompanyViewModel_1 = require('../models/CompanyViewModel');
var dataService_1 = require('./../dataService');
var dictService_1 = require('./../dictService');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
// ***************************************************************************************
var DzAddComponent = (function () {
    function DzAddComponent(dataService, router, dictService) {
        this.dataService = dataService;
        this.router = router;
        this.dictService = dictService;
        this.model = new CompanyViewModel_1.CompanyViewModel();
        this.legal_types = [1, 2, 3, 4];
        this.submit_click = function () {
            this.showProgress = true;
            this.add_company();
        };
        this.register_ok = function (appForm) {
            this.showProgress = false;
        };
        this.set_legal_type = function (ind) {
            this.model.LegalForm = this.legal_types[ind];
        };
        this.initialize_model();
        this.showProgress = false;
    }
    DzAddComponent.prototype.initialize_model = function () {
        this.model.IsRezident = true;
        this.model.LegalForm = this.legal_types[1];
        this.model.AgentType = 2;
        this.model.CompanyName = "Свиньин и Ко";
        this.model.CompanyEmail = "pig@pisem.net";
        this.model.CompanyPhone = "+7 495 123-45-67";
        this.model.INN = "123456879012";
        this.model.OGRN = "1234533890123";
    };
    DzAddComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    DzAddComponent = __decorate([
        core_1.Component({
            selector: 'ic-dz-add',
            templateUrl: '/templates/v0102/suppliers/dz-add.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, dictService_1.DictionaryService])
    ], DzAddComponent);
    return DzAddComponent;
}());
exports.DzAddComponent = DzAddComponent;
