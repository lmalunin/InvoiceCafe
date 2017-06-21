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
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var dictService_1 = require('./../dictService');
var helperService_1 = require('./../helperService');
var RegisterFormViewModel_1 = require('../models/RegisterFormViewModel');
var AppComponent = (function () {
    function AppComponent(elementRef, storService, dataService, helper, translate, dict) {
        this.elementRef = elementRef;
        this.storService = storService;
        this.dataService = dataService;
        this.helper = helper;
        this.translate = translate;
        this.dict = dict;
        this.registerOk = function (appForm) {
            //this.element.nativeElement.scrollIntoView();
            this.showProgress = false;
            this.regSuccess = true;
            this.currentStep = 3;
            var top = document.getElementById('topSection');
            if (top) {
                top.scrollIntoView(top);
            }
        };
        this.model = new RegisterFormViewModel_1.RegisterFormViewModel();
        this.model.AgentType = this.elementRef.nativeElement.getAttribute('AgentType');
        this.model.IsNew = true;
        this.model.IsRezident = true;
        this.model.LegalForm = 1;
        this.currentStep = 1;
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(this.elementRef.nativeElement.getAttribute('_lang'));
        if (this.translate.currentLang == "en") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
        }
        if (this.translate.currentLang == "ru") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
        }
    }
    AppComponent.prototype.setAgentType = function (type) {
        this.model.AgentType = type;
    };
    AppComponent.prototype.setLegalForm = function (legalForm) {
        this.model.LegalForm = legalForm.Id;
    };
    AppComponent.prototype.setCurrentStep = function (step) {
        this.currentStep = step;
    };
    AppComponent.prototype.checkINN = function () {
        var _this = this;
        this.dataService.getCompanyByINN(this.model.INN)
            .subscribe(function (company) { _this.innFound(company); }, function (errorObject) { _this.innNotFound(); });
    };
    AppComponent.prototype.innFound = function (company) {
        this.helper.showToast(document.getElementById('theToast'), "Найдена компания: " + company.CompanyName);
        this.model.IsNew = false;
        this.model.IsRezident = company.IsRezident;
        this.model.LegalForm = company.LegalForm;
        this.model.AgentType = company.AgentType;
        this.model.CompanyName = company.CompanyName;
        this.model.CompanyEmail = company.CompanyEmail;
        this.model.CompanyPhone = company.CompanyPhone;
        this.model.INN = company.INN;
        this.model.OGRN = company.OGRN;
        this.model.OGRNIP = company.OGRNIP;
        var combo = document.getElementById('cmbLegalForm');
        for (var _i = 0, _a = combo.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.Id == this.model.LegalForm) {
                combo.selectedItem = item;
                break;
            }
        }
    };
    AppComponent.prototype.innNotFound = function () {
        this.helper.showToast(document.getElementById('theToast'), "Компания с таким ИНН не найдена");
    };
    AppComponent.prototype.submitClick = function () {
        this.model.PersonBirthDate = new Date(this.model.PersonBirthDate_str);
        this.registerNewUser();
    };
    AppComponent.prototype.registerNewUser = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.register_new_user(this.model)
            .subscribe(function (appForm) { return _this.registerOk(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
        //this.register_ok(this.model);
    };
    AppComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        this.helper.showToast(document.getElementById('theToast'), "Ошибка заполнения формы");
        this.currentStep = 1;
        console.log(errorObject);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AppComponent.prototype, "_dp_local", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'ic-register',
            templateUrl: '/templates/v0102/register/app.tpl.html'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, storageService_1.StorageService, dataService_1.DataService, helperService_1.HelperService, ng2_translate_1.TranslateService, dictService_1.DictionaryService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
