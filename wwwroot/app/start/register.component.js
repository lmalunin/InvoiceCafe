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
var RegisterFormViewModel_1 = require('../models/RegisterFormViewModel');
var dataService_1 = require('./../dataService');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var helperService_1 = require('./../helperService');
require('./../rxjs-operators');
var RegisterComponent = (function () {
    function RegisterComponent(dataService, element, translate, helper) {
        this.dataService = dataService;
        this.element = element;
        this.translate = translate;
        this.helper = helper;
        this.legal_types = [1, 2, 3, 4];
        this.agent_types = [1, 2, 3];
        this.submit_click = function () {
            this.showProgress = true;
            this.model.PersonBirthDate = new Date(this.model.PersonBirthDate_str);
            //console.log(this.model);
            this.register_new_user();
        };
        this.register_ok = function (appForm) {
            //this.element.nativeElement.scrollIntoView();
            this.showProgress = false;
            this.regSuccess = true;
            var top = document.getElementById('topSection');
            if (top) {
                top.scrollIntoView(top);
            }
        };
        this.set_legal_type = function (ind) {
            this.model.LegalForm = this.legal_types[ind];
        };
        this.set_agent_type = function (ind) {
            this.model.AgentType = this.agent_types[ind];
        };
        this.initialize_model();
        this.showProgress = false;
        this.regSuccess = false;
        this._dp_local = this.helper.DATE_PICKER_i18n_en;
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        //translate.use('en');
        translate.use(this.element.nativeElement.getAttribute('_lang'));
    }
    RegisterComponent.prototype.ngOnInit = function () { };
    RegisterComponent.prototype.ngAfterContentInit = function () {
    };
    RegisterComponent.prototype.initialize_model = function () {
        this.model = new RegisterFormViewModel_1.RegisterFormViewModel();
        this.model.IsNew = true;
        this.model.IsRezident = true;
        this.model.LegalForm = this.legal_types[1];
        this.model.AgentType = this.agent_types[0];
    };
    RegisterComponent.prototype.check_inn = function () {
        var _this = this;
        this.dataService.getCompanyByINN(this.searchINN)
            .subscribe(function (company) { _this.inn_found(company); }, function (errorObject) { _this.inn_notfound(); });
    };
    RegisterComponent.prototype.inn_found = function (company) {
        this.helper.showToast(document.getElementById('theToast'), "Company found: " + company.CompanyName);
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
        console.log(this.model.LegalForm);
    };
    RegisterComponent.prototype.inn_notfound = function () {
        this.helper.showToast(document.getElementById('theToast'), "Company not found");
        //this.initialize_model();
    };
    RegisterComponent.prototype.register_new_user = function () {
        var _this = this;
        this.errorMessages = new Array();
        this.dataService.register_new_user(this.model)
            .subscribe(function (appForm) { return _this.register_ok(appForm); }, function (errorObject) { return _this.process_error(errorObject); });
        //this.register_ok(this.model);
    };
    RegisterComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RegisterComponent.prototype, "_dp_local", void 0);
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'ic-register',
            templateUrl: '/templates/v0102/start/register.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, core_1.ElementRef, ng2_translate_1.TranslateService, helperService_1.HelperService])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
