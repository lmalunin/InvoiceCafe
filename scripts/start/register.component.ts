import { Component, ViewChild, Input, OnInit, AfterContentInit, ElementRef } from '@angular/core';
import { RegisterFormViewModel } from '../models/RegisterFormViewModel';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { HelperService } from './../helperService';

import './../rxjs-operators';

@Component({
    selector: 'ic-register',
    templateUrl: '/templates/v0102/start/register.tpl.html'
})
export class RegisterComponent implements OnInit, AfterContentInit  {
    @Input() _dp_local: Object;

    model: RegisterFormViewModel;

    errorMessages: Array<string>;
    showProgress: boolean;
    regSuccess: boolean;
    isNew: boolean;
    searchINN: string;

    private legal_types = [1, 2, 3, 4];
    private agent_types = [1, 2, 3];

    constructor(private dataService: DataService, private element: ElementRef, private translate: TranslateService, private helper: HelperService) {
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

    ngOnInit() { }

    ngAfterContentInit() {
    }

    initialize_model() {
        this.model = new RegisterFormViewModel();
        this.model.IsNew = true;
        this.model.IsRezident = true;
        this.model.LegalForm = this.legal_types[1];
        this.model.AgentType = this.agent_types[0];
    }

    check_inn() {
        this.dataService.getCompanyByINN(this.searchINN)
            .subscribe(
            company => { this.inn_found(company) },
            errorObject => { this.inn_notfound() });
    }

    inn_found(company: CompanyViewModel) {
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
    }

    inn_notfound() {
        this.helper.showToast(document.getElementById('theToast'), "Company not found");
        //this.initialize_model();
    }

    register_new_user() {      
        this.errorMessages = new Array<string>();

        this.dataService.register_new_user(this.model)
            .subscribe(
            appForm => this.register_ok(appForm),
            errorObject => this.process_error(errorObject));
        //this.register_ok(this.model);
    }

    process_error(errorObject: Object) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    submit_click = function () {
        this.showProgress = true;

        this.model.PersonBirthDate = new Date(this.model.PersonBirthDate_str);
        //console.log(this.model);
        this.register_new_user();
    }

    register_ok = function (appForm: RegisterFormViewModel) {
        //this.element.nativeElement.scrollIntoView();

        this.showProgress = false;
        this.regSuccess = true;

        var top: any = document.getElementById('topSection');
        if (top) { top.scrollIntoView(top); }
    }

    set_legal_type = function (ind: number) {
        this.model.LegalForm = this.legal_types[ind];
    }

    set_agent_type = function (ind: number) {
        this.model.AgentType = this.agent_types[ind];
    }
}