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
var SignFormViewModel_1 = require('../models/SignFormViewModel');
var dictService_1 = require('./../dictService');
var dataService_1 = require('./../dataService');
var storageService_1 = require('./../storageService');
var helperService_1 = require('./../helperService');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var SignComponent = (function () {
    function SignComponent(dataService, router, storService, dict, helper, translate) {
        this.dataService = dataService;
        this.router = router;
        this.storService = storService;
        this.dict = dict;
        this.helper = helper;
        this.translate = translate;
        this.currentStep = 1;
        this.submit_click = function () {
            var _this = this;
            this.errorMessages = new Array();
            this.dataService.add_signform(this.model)
                .subscribe(function (appForm) { return _this.register_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
        };
        this.register_ok = function (appForm) {
            this.showProgress = false;
            this.moveToStep(3);
        };
        this.currentCompany = storService.getValue();
        this.initialize_model();
        if (this.translate.currentLang == "en") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }
        if (this.translate.currentLang == "ru") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }
    }
    SignComponent.prototype.initialize_model = function () {
        this.model = new SignFormViewModel_1.SignFormViewModel();
        this.model.Company = this.currentCompany;
        this.model.DirectorCitizenship = 'Russia';
    };
    SignComponent.prototype.ngOnInit = function () {
    };
    SignComponent.prototype.after_file_upload = function (event) {
        var controlName = event.srcElement.id;
        var serverFileName = event.detail.xhr.responseText;
        this.model[controlName] = serverFileName;
    };
    SignComponent.prototype.upl_reject = function (event) {
        var toast = document.getElementById('rejectToast');
        if (toast) {
            toast.text = event.detail.file.name + ' error: ' + event.detail.error;
            toast.open();
        }
    };
    SignComponent.prototype.set_tarif = function (item) {
        this.model.Tarif = item.Id;
    };
    SignComponent.prototype.set_citizenship = function (val) {
        if (val == "RF_Yes")
            this.model.DirectorCitizenship = "Russia";
        else
            this.model.DirectorCitizenship = "";
        console.log(this.model.DirectorCitizenship);
    };
    SignComponent.prototype.set_caNum = function (i) {
        this.model.NumOfConractors = i;
    };
    SignComponent.prototype.set_caType = function (i) {
        this.model.TypeOfContractors = i;
    };
    SignComponent.prototype.moveToStep = function (step) {
        this.currentStep = step;
    };
    SignComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
        this.helper.showToast(document.getElementById('theToast'), "Ошибка! Возможно запрос уже отправлен. Обратитесь к администратору.");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SignComponent.prototype, "_upl_local", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SignComponent.prototype, "_dp_local", void 0);
    SignComponent = __decorate([
        core_1.Component({
            selector: 'ic-sign',
            templateUrl: '/templates/v0102/common/register-sign.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.Router, storageService_1.StorageService, dictService_1.DictionaryService, helperService_1.HelperService, ng2_translate_1.TranslateService])
    ], SignComponent);
    return SignComponent;
}());
exports.SignComponent = SignComponent;
