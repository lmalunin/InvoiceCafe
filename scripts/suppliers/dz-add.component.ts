import { Component, OnInit } from '@angular/core';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { DictionaryService } from './../dictService';
import { StorageService } from './../storageService';
import './../rxjs-operators';

import { Router }    from '@angular/router';

// ***************************************************************************************
@Component({
    selector: 'ic-dz-add',
    templateUrl: '/templates/v0102/suppliers/dz-add.tpl.html'
})
export class DzAddComponent {
    model = new CompanyViewModel();

    errorMessages: Array<string>;
    showProgress: boolean;

    private legal_types = [1, 2, 3, 4];

    constructor(private dataService: DataService, private router: Router, private dictService: DictionaryService) {
        this.initialize_model();
        this.showProgress = false;
    }

    initialize_model() {
        this.model.IsRezident = true;
        this.model.LegalForm = this.legal_types[1];
        this.model.AgentType = 2;

        this.model.CompanyName = "Свиньин и Ко";
        this.model.CompanyEmail = "pig@pisem.net";
        this.model.CompanyPhone = "+7 495 123-45-67";
        this.model.INN = "123456879012";
        this.model.OGRN = "1234533890123";
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
        this.add_company();
    }

    register_ok = function (appForm: CompanyViewModel) {
        this.showProgress = false;
    }

    set_legal_type = function (ind: number) {
        this.model.LegalForm = this.legal_types[ind];
    }
}