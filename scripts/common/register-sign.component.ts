import { Component, OnInit, Input } from '@angular/core';

import { SignFormViewModel } from '../models/SignFormViewModel';
import { CompanyViewModel } from '../models/CompanyViewModel';

import { DictionaryService, dictItem } from './../dictService';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { TranslateService } from 'ng2-translate/ng2-translate';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

declare var moment: any;

@Component({
    selector: 'ic-sign',
    templateUrl: '/templates/v0102/common/register-sign.tpl.html'
})
export class SignComponent implements OnInit {
    errorMessages: Array<string>;
    @Input() _upl_local: Object;
    @Input() _dp_local: Object;
    model: SignFormViewModel;
    currentStep = 1;

    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private router: Router, private storService: StorageService, private dict: DictionaryService,
        private helper: HelperService, private translate: TranslateService)
    {
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

    initialize_model() {
        this.model = new SignFormViewModel();
        this.model.Company = this.currentCompany;
        this.model.DirectorCitizenship = 'Russia';
    }

    ngOnInit(): void {
    }

    after_file_upload(event: any) {
        let controlName = event.srcElement.id;
        let serverFileName = event.detail.xhr.responseText;
        this.model[controlName] = serverFileName;
    }

    upl_reject(event: any) {
        var toast: any = document.getElementById('rejectToast');
        if (toast) {
            toast.text = event.detail.file.name + ' error: ' + event.detail.error;
            toast.open();
        }
    }

    set_tarif(item: dictItem) {
        this.model.Tarif = item.Id;
    }

    set_citizenship(val: string) {
        if (val == "RF_Yes")
            this.model.DirectorCitizenship = "Russia";
        else
            this.model.DirectorCitizenship = "";

        console.log(this.model.DirectorCitizenship);
    }

    set_caNum(i: number) {
        this.model.NumOfConractors = i;
    }

    set_caType(i: number) {
        this.model.TypeOfContractors = i;
    }

    moveToStep(step: number) {
        this.currentStep = step;
    }

    submit_click = function () {
        this.errorMessages = new Array<string>();
        this.dataService.add_signform(this.model)
            .subscribe(
            appForm => this.register_ok(appForm),
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
        this.helper.showToast(document.getElementById('theToast'), "Ошибка! Возможно запрос уже отправлен. Обратитесь к администратору.");
    }

    register_ok = function (appForm: SignFormViewModel) {
        this.showProgress = false;
        this.moveToStep(3);
    }
}
