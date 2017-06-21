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
var edsService_1 = require('./../edsService');
var EDSLocalSignatureViewModel_1 = require('../models/EDSLocalSignatureViewModel');
var EdsComponent = (function () {
    function EdsComponent(dataService, storService, edsService) {
        this.dataService = dataService;
        this.storService = storService;
        this.edsService = edsService;
        this.localJLSSOk = false;
        this.processLocalSign = function (data) {
            var _this = this;
            //this.showProgress = false;
            this.localEDSData = data;
            console.log("processLocalSign: ", this.localEDSData);
            var request = new edsService_1.LocalSignatureRequest();
            request.certificate = data.certificate;
            request.hash = data.message;
            this.edsService.localSign(request)
                .subscribe(function (res) { return _this.localSignOk(res); }, function (errorObject) { return _this.process_error(errorObject); });
        };
        this.localSignOk = function (data) {
            var _this = this;
            this.localEDSData.signature = data.signature;
            console.log("localSignOk: ", this.localEDSData);
            this.edsService.serverSign(this.localEDSData)
                .subscribe(function (res) { return _this.serverSignOk(res); }, function (errorObject) { return _this.process_error(errorObject); });
        };
        this.serverSignOk = function (data) {
            console.log("sign ok");
        };
        this.currentCompany = storService.getValue();
        this.localEDSData = new EDSLocalSignatureViewModel_1.EDSLocalSignatureViewModel();
    }
    EdsComponent.prototype.ngOnInit = function () {
        this.getDocumentsForSign();
        this.checkLocalProvider();
    };
    EdsComponent.prototype.checkLocalProvider = function () {
        var _this = this;
        this.edsService.checkLocalProvider()
            .subscribe(function (res) {
            console.log("Local crypto provider ver. " + res.version);
            _this.localJLSSOk = true;
        }, function (errorObject) { return _this.localJLSSOk = false; });
    };
    EdsComponent.prototype.getDocumentsForSign = function () {
        var _this = this;
        this.dataService.getEDSDocuments(this.currentCompany.Id, 1, 0)
            .subscribe(function (res) { _this.docsForSign = res; }, function (errorObject) { return _this.process_error(errorObject); });
    };
    EdsComponent.prototype.submit_click = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.edsService.prepareDraftForSignature(this.docsForSign[0].Id)
            .subscribe(function (res) { return _this.processLocalSign(res); }, function (errorObject) { return _this.process_error(errorObject); });
    };
    EdsComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    EdsComponent = __decorate([
        core_1.Component({
            selector: 'ic-eds',
            templateUrl: '/templates/v0102/suppliers/eds.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, storageService_1.StorageService, edsService_1.EDSService])
    ], EdsComponent);
    return EdsComponent;
}());
exports.EdsComponent = EdsComponent;
