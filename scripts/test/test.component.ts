import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { StorageService } from './../storageService';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { DictionaryService } from './../dictService';

import { EDSLocalSignatureViewModel } from '../models/EDSLocalSignatureViewModel';
import { ClientDocumentViewModel } from '../models/ClientDocumentViewModel';

declare var jQuery: any;

@Component({
    selector: 'ic-test',
    templateUrl: '/templates/v0102/test/test.tpl.html'
})
export class TestComponent implements OnInit, AfterViewInit {
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;
    docsSigned: ClientDocumentViewModel[];

    constructor(private dataService: DataService, private storService: StorageService, private dict: DictionaryService) {
        this.currentCompany = new CompanyViewModel();
        this.currentCompany.CompanyName = "dd";
        this.currentCompany.Status = 5;
    }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        setTimeout(() => {
            var rdNavbar: any = jQuery('.rd-navbar');
            if (rdNavbar.length) {
                rdNavbar.RDNavbar({
                    stickUpClone: (rdNavbar.attr("data-stick-up-clone")) ? rdNavbar.attr("data-stick-up-clone") === 'true' : false
                });
                if (rdNavbar.attr("data-body-class")) {
                    document.body.className += ' ' + rdNavbar.attr("data-body-class");
                }
            }
        }, 0);
    }

}
