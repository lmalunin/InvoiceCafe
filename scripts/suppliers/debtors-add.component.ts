import { Component, OnInit } from '@angular/core';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { TranslateService } from 'ng2-translate/ng2-translate';

import './../rxjs-operators';

import { Router }    from '@angular/router';

// ***************************************************************************************
@Component({
    selector: 'ic-add-debtors',
    templateUrl: '/templates/v0102/suppliers/debtors-add.tpl.html'
})
export class AddDebtorComponent {
    model = new CompanyViewModel();
    companyFound: CompanyViewModel;
    currentCompany: CompanyViewModel;

    errorMessages: Array<string>;
    showProgress: boolean;
    searchINN: string;
    searchMessage: string;

    EDS_Ok = false;
    EDS_Name: string;
    EDS_Thumb: string;

    private legal_types = [1, 2, 3, 4];

    constructor(private dataService: DataService, private router: Router, private storService: StorageService, private helper: HelperService) {
        this.currentCompany = storService.getValue();
        this.initialize_model();
        this.showProgress = false;
        this.searchMessage = null;
    }

    initialize_model() {
        this.model.IsRezident = true;
        this.model.LegalForm = this.legal_types[1];
        this.model.AgentType = 2;
        this.model.AddOrUpdate = 1;

        /*
        this.model.CompanyName = "Свиньин и Ко";
        this.model.CompanyEmail = "pig@pisem.net";
        this.model.CompanyPhone = "+7 495 123-45-67";
        this.model.INN = "123456879012";
        this.model.OGRN = "1234533890123";
        */
    }

    search_debtor() {
        this.dataService.getCompanyByINN(this.searchINN)
            .subscribe(
            company => this.innFound(company),
            errorObject => this.innNotFound());
    }

    innFound(company: CompanyViewModel) {
        this.model = company;
        this.model.AddOrUpdate = 5;
    }

    innNotFound() {
        this.helper.showToast(document.getElementById('theToast'), 'Компания с таким ИНН не найдена');
    }

    add_company() {
        this.errorMessages = new Array<string>();
        this.dataService.add_debtor(this.model)
            .subscribe(
            appForm => this.register_ok(appForm),
            errorObject => this.process_error(errorObject));
    }

    attach_debtor() {
        this.errorMessages = new Array<string>();
        this.dataService.attach_debtor(this.model.Guid, this.currentCompany.Guid)
            .subscribe(
            appForm => this.register_ok(appForm),
            errorObject => this.process_error(errorObject));
    }

    clean_companyFound() {
        this.companyFound = null;
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
        if (this.model.AddOrUpdate == 1)
            this.add_company();
        if (this.model.AddOrUpdate == 5)
            this.attach_debtor();
    }

    register_ok = function (appForm: CompanyViewModel) {
        this.showProgress = false;
        this.helper.showToast(document.getElementById('theToast'), 'Дебитор добавлен');
    }

    set_legal_type = function (ind: number) {
        this.model.LegalForm = this.legal_types[ind];
    }
}