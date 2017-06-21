import { Component, OnInit } from '@angular/core';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { TranslateService } from 'ng2-translate/ng2-translate';

import './../rxjs-operators';

import { Router }    from '@angular/router';

declare var cadesplugin: any;

@Component({
    selector: 'ic-debtors',
    templateUrl: '/templates/v0102/suppliers/debtors-list.tpl.html'
})
export class DebtorsListComponent implements OnInit {
    debtors: CompanyViewModel[];
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private storService: StorageService, private router: Router, private translate: TranslateService) {
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

    navigate_to_add() {
        this.router.navigate(['SupplierHome/AddDebtor']);
    }
}