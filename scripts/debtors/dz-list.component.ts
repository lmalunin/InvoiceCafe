import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { DictionaryService } from './../dictService';

import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { ContractViewModel } from '../models/ContractViewModel';
import { PersonViewModel } from '../models/PersonViewModel';
import { DZViewModel } from '../models/DZViewModel';
import { LotViewModel } from '../models/LotViewModel';

declare var moment: any;

@Component({
    selector: 'ic-dz-list',
    templateUrl: '/templates/v0102/debtors/dz-list.tpl.html'
})
export class DZListComponent implements OnInit {
    dzlist: DZViewModel[];
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private router: Router, private storService: StorageService, private helper: HelperService, private dict: DictionaryService) {
        this.currentCompany = storService.getValue();
    }

    ngOnInit(): void {
        this.getItems();
    }

    getItems() {
        this.dataService.getDZForDebtor(this.currentCompany.Guid)
            .subscribe(
            dzlist => { this.dzlist = dzlist; },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    dz_details(ind: number) {
        this.router.navigate(['/DebtorHome/DZ/', ind]);
    }

    open_selected(event: any) {
        var srcId: string = event.srcElement.id;
        if (srcId == '')
            return;
        var Id: number = parseInt(srcId.split('_')[1]);
        this.router.navigate(['/DebtorHome/DZ/', Id]);
    }
}

