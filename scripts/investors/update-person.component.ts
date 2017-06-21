import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { PersonViewModel } from '../models/PersonViewModel';
//import { CompanyViewModel } from '../models/CompanyViewModel';
import { PolymerElement } from '@vaadin/angular2-polymer';
import {UUID} from 'angular2-uuid';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

declare var moment: any;

interface IUrlObject {
    isVisible: boolean;
    fileName: string;
    getUrl: string;
    deleteUrl: string;
}

class UrlObject {
    isVisible: boolean;
    fileName: string;
    getUrl: string;
    deleteUrl: string;

    constructor(_isVisible: boolean, _fileName: string, _getUrl: string, _deleteUrl: string) {
        this.isVisible = _isVisible;
        this.fileName = _fileName;
        this.getUrl = _getUrl;
        this.deleteUrl = _deleteUrl;
    }
}

@Component({
    selector: 'ic-update-supplier',
    templateUrl: '/templates/v0102/investors/update-person.tpl.html'
})
export class UpdatePersonComponent implements OnInit, AfterViewInit {

    _person = new PersonViewModel();

    errorMessages: Array<string>;
    showProgress: boolean;
    searchINN: string;
    searchMessage: string;

    EDS_Ok = false;
    EDS_Name: string;
    EDS_Thumb: string;

    private _FullPowersDocumentsNames: Array<string>;
    private _IdentityDocumentsNames: Array<string>;

    private _FullPowersDocumentsNames_Last: string;
    private _IdentityDocumentsNames_Last: string;

    private _FullPowersDocumentsNamesURLs: Array<IUrlObject>;
    private _IdentityDocumentsNamesURLs: Array<IUrlObject>;

    @ViewChild('toDownloadFPDN') toDownloadFPDN: ElementRef;
    @ViewChild('toDownloadIDN') toDownloadIDN: ElementRef;

    @Input() _dp_local: Object;
    @Input() _upl_local: Object;

    constructor(
        private _dataService: DataService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _storService: StorageService,
        private _helper: HelperService,
        private translate: TranslateService) {

        if (this.translate.currentLang == "en") {
            this._dp_local = this._helper.DATE_PICKER_i18n_en;
            this._upl_local = this._helper.UPLOAD_i18n_en;
        }

        if (this.translate.currentLang == "ru") {
            this._dp_local = this._helper.DATE_PICKER_i18n_ru;
            this._upl_local = this._helper.UPLOAD_i18n_ru;
        }

        this.showProgress = false;

        this._FullPowersDocumentsNames = new Array<string>();
        this._IdentityDocumentsNames = new Array<string>();

        this._FullPowersDocumentsNamesURLs = new Array<IUrlObject>();
        this._IdentityDocumentsNamesURLs = new Array<IUrlObject>();

        this._dataService.getPersonById(this._route.snapshot.params['id'])
            .subscribe(
            person => {
                this._person = person;
                this._person.DateOfBirth = moment(person.DateOfBirth).format('YYYY-MM-DD');
                this._person.Company = _storService.getValue();

                this._FullPowersDocumentsNames = JSON.parse(this._person.FullPowersDocumentsNames);
                this._IdentityDocumentsNames = JSON.parse(this._person.IdentityDocumentsNames);

                for (var i in this._FullPowersDocumentsNames) {
                    this._FullPowersDocumentsNamesURLs.push(new UrlObject(
                        true,
                        this._FullPowersDocumentsNames[i],
                        '/' + this._person.GetDocsBaseUrl + '/' + this._person.Id + "/" + this._FullPowersDocumentsNames[i],
                        '/' + this._person.DeleteDocsBaseUrl + '/' + this._person.Id + "/" + this._FullPowersDocumentsNames[i]
                    ));
                }

                for (var i in this._IdentityDocumentsNames) {
                    this._IdentityDocumentsNamesURLs.push(new UrlObject(
                        true,
                        this._IdentityDocumentsNames[i],
                        '/' + this._person.GetDocsBaseUrl + '/' + this._person.Id + "/" + this._IdentityDocumentsNames[i],
                        '/' + this._person.DeleteDocsBaseUrl + '/' + this._person.Id + "/" + this._IdentityDocumentsNames[i]
                    ));
                }
                debugger;
            },
            errorObject => this.process_error(errorObject));
    }

    //Functions

    select_EDS(value: number): void {
        this._person.EDS_type = value;
    }

    select_possibility(value: number): void {
        this._person.PossibilityType = value;
    }

    delete_file(url: string): void {
        this._dataService.delete_file(url)
            .subscribe(
            obj => {
                this.person_document_deleted_ok(obj.fileName);

                if (this._FullPowersDocumentsNames.includes(obj.fileName)) {
                    this._FullPowersDocumentsNames.splice(this._FullPowersDocumentsNames.indexOf(obj.fileName), 1);
                }

                if (this._IdentityDocumentsNames.includes(obj.fileName)) {
                    this._IdentityDocumentsNames.splice(this._IdentityDocumentsNames.indexOf(obj.fileName), 1);
                }

                if (this._FullPowersDocumentsNames && this._FullPowersDocumentsNames != []) {
                    this._FullPowersDocumentsNamesURLs = this._FullPowersDocumentsNamesURLs.filter(item => item.fileName != obj.fileName);
                }

                if (this._IdentityDocumentsNames && this._IdentityDocumentsNames != []) {
                    this._IdentityDocumentsNamesURLs = this._IdentityDocumentsNamesURLs.filter(item => item.fileName != obj.fileName);
                }
            },
            errorObject => this.process_error(errorObject)
            );
    }

    update_person() {
        this.showProgress = true;

        this._person.FullPowersDocumentsNames = JSON.stringify(this._FullPowersDocumentsNames);
        this._person.IdentityDocumentsNames = JSON.stringify(this._IdentityDocumentsNames);
        this.errorMessages = new Array<string>();
        this._dataService.update_person(this._person)
            .subscribe(
            appForm => {
                this.person_updated_ok(appForm);
                this._person = appForm;
                this._person.DateOfBirth = moment(appForm.DateOfBirth).format('YYYY-MM-DD');

                this.toDownloadFPDN.nativeElement.files = [];
                this.toDownloadIDN.nativeElement.files = [];

                this._FullPowersDocumentsNamesURLs.forEach(doc => doc.isVisible = true);
                this._IdentityDocumentsNamesURLs.forEach(doc => doc.isVisible = true);
            },
            errorObject => this.process_error(errorObject));
    }

    //Callbacks

    ngOnInit() { }

    ngAfterViewInit(): void { }

    before_file_upload(event: any) { }

    after_file_upload_FPDN(event: any) {
        this._FullPowersDocumentsNames.push(event.detail.xhr.responseText);
        this._FullPowersDocumentsNames_Last = event.detail.xhr.responseText;

        this._FullPowersDocumentsNamesURLs.push(new UrlObject(
            false,
            event.detail.xhr.responseText,
            '/' + this._person.GetDocsBaseUrl + '/' + this._person.Id + "/" + event.detail.xhr.responseText,
            '/' + this._person.DeleteDocsBaseUrl + '/' + this._person.Id + "/" + event.detail.xhr.responseText
        ));
    }

    after_file_upload_IDN(event: any) {
        this._IdentityDocumentsNames.push(event.detail.xhr.responseText);
        this._IdentityDocumentsNames_Last = event.detail.xhr.responseText;

        this._IdentityDocumentsNamesURLs.push(new UrlObject(
            false,
            event.detail.xhr.responseText,
            '/' + this._person.GetDocsBaseUrl + '/' + this._person.Id + "/" + event.detail.xhr.responseText,
            '/' + this._person.DeleteDocsBaseUrl + '/' + this._person.Id + "/" + event.detail.xhr.responseText
        ));
    }

    upl_reject(event: any) { this._helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error); }

    dialogEDS_Ok() {
        this.EDS_Ok = true;
        var dialog: any = document.getElementById('dialogEDS');
        if (dialog)
            dialog.close();
    }

    dialogEDS_Show(_edsName: string, _edsThumb: string) {
        this.EDS_Name = _edsName;
        this.EDS_Thumb = _edsThumb;

        var dialog: any = document.getElementById('dialogEDS');
        if (dialog)
            dialog.open();
    }

    person_document_deleted_ok(file: string) {
        this.showProgress = false;
        this._helper.showToast(document.getElementById('theToast'), 'Person\'s document ' + file + ' was deleted');
    }

    person_updated_ok(appForm: PersonViewModel) {
        this.showProgress = false;
        this._helper.showToast(document.getElementById('theToast'), 'Person\'s data were updated');
    }

    process_error(errorObject: Object) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }
}