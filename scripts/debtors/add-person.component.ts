import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { PersonViewModel } from '../models/PersonViewModel';
//import { CompanyViewModel } from '../models/CompanyViewModel';
import { PolymerElement } from '@vaadin/angular2-polymer';

import './../rxjs-operators';

import { Router }    from '@angular/router';

@Component({
    selector: 'ic-add-supplier',
    templateUrl: '/templates/v0102/debtors/add-person.tpl.html'
})
export class AddPersonComponent implements OnInit {
    private _person = new PersonViewModel();

    errorMessages: Array<string>;
    showProgress: boolean;
    searchINN: string;
    searchMessage: string;

    EDS_Ok = false;
    EDS_Name: string;
    EDS_Thumb: string;

    FullPowersDocumentsNames: Array<string>;
    IdentityDocumentsNames: Array<string>;

    private FullPowersDocumentsNames_Last: string;
    private IdentityDocumentsNames_Last: string;

    @Input() _dp_local: Object;
    @Input() _upl_local: Object;

    constructor(
        private dataService: DataService,
        private router: Router,
        private storService: StorageService,
        private helper: HelperService,
        private translate: TranslateService) {

        this._person.PossibilityToExposeBid = false;
        this._person.PossibilityToExposeBidWithoutRestrictions = true;
        this._person.CounterOfferAcceptPossibility = false;
        this._person.CounterOfferAcceptPossibilityWithoutRestrictions = true;

        this.showProgress = false;
        this.searchMessage = null;

        this.FullPowersDocumentsNames = new Array<string>();
        this.IdentityDocumentsNames = new Array<string>();

        this.FullPowersDocumentsNames_Last = '';
        this.IdentityDocumentsNames_Last = '';

        this._person.Company = storService.getValue();

        if (this.translate.currentLang == "en") {
            this._dp_local = this.helper.DATE_PICKER_i18n_en;
            this._upl_local = this.helper.UPLOAD_i18n_en;
        }

        if (this.translate.currentLang == "ru") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }
    }

    ngOnInit() {

    }

    add_person() {
        this.showProgress = true;

        this._person.FullPowersDocumentsNames = JSON.stringify(this.FullPowersDocumentsNames);
        this._person.IdentityDocumentsNames = JSON.stringify(this.IdentityDocumentsNames);

        this.errorMessages = new Array<string>();
        this.dataService.add_person(this._person)
            .subscribe(
            appForm => this.person_registered_ok(appForm),
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    person_registered_ok = function (appForm: PersonViewModel) {
        this.showProgress = false;
        this.helper.showToast(document.getElementById('theToast'), 'Person was added');
    }

    set_legal_type = function (ind: number) {
        this.model.LegalForm = this.legal_types[ind];
    }

    dialogEDS_Show(_edsName: string, _edsThumb: string) {
        this.EDS_Name = _edsName;
        this.EDS_Thumb = _edsThumb;

        var dialog: any = document.getElementById('dialogEDS');
        if (dialog)
            dialog.open();
    }

    dialogEDS_Ok() {
        this.EDS_Ok = true;
        var dialog: any = document.getElementById('dialogEDS');
        if (dialog)
            dialog.close();
    }

    select_EDS(value: number): void {
        this._person.EDS_type = value;
    }

    upl_reject(event: any) {
        this.helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error);
    }

    before_file_upload(event: any) {

    }

    after_file_upload_FPDN(event: any) {
        this.FullPowersDocumentsNames.push(event.detail.xhr.responseText);
        console.log(event.detail.xhr.responseText);
        this.FullPowersDocumentsNames_Last = event.detail.xhr.responseText;
        console.log(this.FullPowersDocumentsNames_Last);
    }

    after_file_upload_IDN(event: any) {
        this.IdentityDocumentsNames.push(event.detail.xhr.responseText);
        console.log(event.detail.xhr.responseText);
        this.IdentityDocumentsNames_Last = event.detail.xhr.responseText;
        console.log(this.IdentityDocumentsNames_Last);
    }

    select_possibility(value: number): void {
        this._person.PossibilityType = value;
    }
}