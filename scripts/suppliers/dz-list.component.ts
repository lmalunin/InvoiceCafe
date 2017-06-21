import { Component, OnInit } from '@angular/core';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import './../rxjs-operators';

import { Router }    from '@angular/router';

@Component({
    selector: 'ic-dz-list',
    templateUrl: '/templates/v0102/suppliers/dz-list.tpl.html'
})
export class DzListComponent implements OnInit {
    debtors: CompanyViewModel[];
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private storService: StorageService) {
        this.currentCompany = storService.getValue();
    }

    ngOnInit(): void {
        this.getDebtors();
    }

    getDebtors() {
        this.dataService.getDebtorsForSupplier(this.currentCompany.Id)
            .subscribe(
            debtors => { this.debtors = debtors; },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }
}