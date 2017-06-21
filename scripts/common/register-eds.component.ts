import { Component, OnInit, ElementRef } from '@angular/core';
import { StorageService } from './../storageService';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { EDSService, LocalSignatureRequest, LocalSignatureResponse } from './../edsService';
import { DictionaryService, dictItem } from './../dictService';

import { EDSLocalSignatureViewModel } from '../models/EDSLocalSignatureViewModel';
import { ClientDocumentViewModel } from '../models/ClientDocumentViewModel';

declare var jQuery: any;

@Component({
    selector: 'ic-eds',
    templateUrl: '/templates/v0102/common/register-eds.tpl.html'
})
export class EdsComponent implements OnInit  {
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;
    localJLSSOk = false;
    localEDSData: EDSLocalSignatureViewModel;
    docsForSign: ClientDocumentViewModel[];

    showProgress: boolean;

    constructor(private dataService: DataService, private storService: StorageService, private edsService: EDSService, private dict: DictionaryService) {
        this.currentCompany = storService.getValue();
        this.localEDSData = new EDSLocalSignatureViewModel();
        this.showProgress = false;
    }

    ngOnInit(): void {
        this.getDocumentsForSign();
        this.checkLocalProvider();
    }

    checkLocalProvider() {
        this.edsService.checkLocalProvider()
            .subscribe(
            res => {
                console.log("Local crypto provider ver. " + res.version); this.localJLSSOk = true
            },
            errorObject => this.localJLSSOk = false);
    }

    getDocumentsForSign() {
        this.dataService.getEDSDocuments(this.currentCompany.Id, 1, 1)
            .subscribe(
            res => { this.docsForSign = res; },
            errorObject => this.process_error(errorObject));
    }

    submit_click() {
        this.errorMessages = new Array<string>();
        this.showProgress = true;
        this.edsService.prepareDraftForSignature(this.docsForSign[0].Id)
            .subscribe(
            res => this.processLocalSign(res),
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    processLocalSign = function (data: EDSLocalSignatureViewModel) {
        //this.showProgress = false;
        this.localEDSData = data;
        console.log("processLocalSign: ", this.localEDSData);

        let request = new LocalSignatureRequest();
        request.certificate = data.certificate;
        request.hash = data.message;

        this.edsService.localSign(request)
            .subscribe(
            res => this.localSignOk(res),
            errorObject => this.process_error(errorObject));
    }

    localSignOk = function (data: LocalSignatureResponse) {
        this.localEDSData.signature = data.signature;
        console.log("localSignOk: ", this.localEDSData);
        this.edsService.serverSign(this.localEDSData)
            .subscribe(
            res => this.serverSignOk(res),
            errorObject => this.process_error(errorObject));
    }

    serverSignOk = function (data: LocalSignatureResponse) {
        this.dataService.accept_eds()
            .subscribe(
            res => this.register_ok(res),
            errorObject => this.process_error(errorObject));
    }

    register_ok = function (res: string) {
        this.showProgress = false;
        location.href = "/" + this.dict.get_HOME_PATH(this.currentCompany.AgentType) + "/Index";
    }
}
