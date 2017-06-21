import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { StorageService } from './../storageService';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { DictionaryService } from './../dictService';
import { HelperService } from './../helperService';

import { EDSLocalSignatureViewModel } from '../models/EDSLocalSignatureViewModel';
import { ClientDocumentViewModel } from '../models/ClientDocumentViewModel';

declare var jQuery: any;
declare var moment: any;

@Component({
    selector: 'ic-application',
    templateUrl: '/templates/v0102/suppliers/test.tpl.html'
})
export class TestComponent implements OnInit {
    @Input() _dp_local: Object;

    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;
    docsSigned: ClientDocumentViewModel[];

    constructor(private dataService: DataService, private storService: StorageService, private dict: DictionaryService, private helper: HelperService) {
        this.currentCompany = storService.getValue();
        this._dp_local = this.helper.DATE_PICKER_i18n_ru;
    }

    ngOnInit(): void {
    }

    process_date(event: any) {
        //console.log(event.detail.value);
        let d: Date = moment(event.detail.value);
        console.log(d);
    }

}
