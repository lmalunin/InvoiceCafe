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
var RulesComponent = (function () {
    function RulesComponent(dataService, storService, dict) {
        this.dataService = dataService;
        this.storService = storService;
        this.dict = dict;
        this.acceptRules = false;
        this.register_ok = function (res) {
            //this.showProgress = false;
            location.href = "/" + this.dict.get_HOME_PATH(this.currentCompany.AgentType) + "/Index";
        };
        this.currentCompany = storService.getValue();
    }
    RulesComponent.prototype.submit_click = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.accept_rules()
            .subscribe(function (res) { return _this.register_ok(res); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    RulesComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    RulesComponent = __decorate([
        core_1.Component({
            selector: 'ic-rules',
            templateUrl: '/templates/v0102/common/register-rules.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, storageService_1.StorageService, dictService_1.DictionaryService])
    ], RulesComponent);
    return RulesComponent;
}());
exports.RulesComponent = RulesComponent;
