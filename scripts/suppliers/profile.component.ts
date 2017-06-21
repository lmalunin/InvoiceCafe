import { Component, OnInit, ElementRef } from '@angular/core';
import { StorageService } from './../storageService';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { EDSService, LocalSignatureRequest, LocalSignatureResponse } from './../edsService';

import { EDSLocalSignatureViewModel } from '../models/EDSLocalSignatureViewModel';
import { ClientDocumentViewModel } from '../models/ClientDocumentViewModel';

declare var jQuery: any;

@Component({
    selector: 'ic-eds',
    templateUrl: '/templates/v0102/suppliers/profile.tpl.html'
})
export class ProfileComponent implements OnInit {
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;
    docsSigned: ClientDocumentViewModel[];

    constructor(private dataService: DataService, private storService: StorageService, private edsService: EDSService) {
        this.currentCompany = storService.getValue();
    }

    ngOnInit(): void {
        this.getDocumentsSigned();
    }

    getDocumentsSigned() {
        this.dataService.getEDSDocuments(this.currentCompany.Id, 1, 30)
            .subscribe(
            res => { this.docsSigned = res; },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }
}
