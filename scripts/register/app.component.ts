import { Component, ElementRef, Input } from '@angular/core';

import { StorageService } from './../storageService';
import { DataService } from './../dataService';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { DictionaryService, dictItem } from './../dictService';
import { HelperService } from './../helperService';

import { RegisterFormViewModel } from '../models/RegisterFormViewModel';
import { CompanyViewModel } from '../models/CompanyViewModel';

declare var jQuery: any;
@Component({
    selector: 'ic-register',
    templateUrl: '/templates/v0102/register/app.tpl.html'
})
export class AppComponent {
    model: RegisterFormViewModel;
    currentStep: number;

    errorMessages: Array<string>;
    showProgress: boolean;
    regSuccess: boolean;
    isNew: boolean;

    @Input() _dp_local: Object;

    constructor(private elementRef: ElementRef, private storService: StorageService, private dataService: DataService,
        private helper: HelperService, private translate: TranslateService, private dict: DictionaryService)
    {
        this.model = new RegisterFormViewModel();
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

    setAgentType(type: number) {
        this.model.AgentType = type;
    }

    setLegalForm(legalForm: dictItem) {
        this.model.LegalForm = legalForm.Id;
    }

    setCurrentStep(step: number) {
        this.currentStep = step;
    }

    checkINN() {
        this.dataService.getCompanyByINN(this.model.INN)
            .subscribe(
            company => { this.innFound(company) },
            errorObject => { this.innNotFound() });
    }

    innFound(company: CompanyViewModel) {
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

        let combo: any = document.getElementById('cmbLegalForm');
        for (let item of combo.items) {
            if (item.Id == this.model.LegalForm) {
                combo.selectedItem = item;
                break;
            }
        }
    }

    innNotFound() {
        this.helper.showToast(document.getElementById('theToast'), "Компания с таким ИНН не найдена");
    }

    submitClick() {
        this.model.PersonBirthDate = new Date(this.model.PersonBirthDate_str);
        this.registerNewUser();
    }

    registerNewUser() {
        this.errorMessages = new Array<string>();

        this.dataService.register_new_user(this.model)
            .subscribe(
            appForm => this.registerOk(appForm),
            errorObject => this.process_error(errorObject));
        //this.register_ok(this.model);
    }

    registerOk = function (appForm: RegisterFormViewModel) {
        //this.element.nativeElement.scrollIntoView();

        this.showProgress = false;
        this.regSuccess = true;
        this.currentStep = 3;

        var top: any = document.getElementById('topSection');
        if (top) { top.scrollIntoView(top); }
    }

    process_error(errorObject: Object) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        this.helper.showToast(document.getElementById('theToast'), "Ошибка заполнения формы");
        this.currentStep = 1;
        console.log(errorObject);
    }
}
