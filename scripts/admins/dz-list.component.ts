import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
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
    templateUrl: '/templates/v0102/admins/dz-list.tpl.html'
})
export class DZListComponent implements OnInit {
    dzlist: DZViewModel[];
    errorMessages: Array<string>;

    constructor(private dataService: DataService, private router: Router, private helper: HelperService) {
    }

    ngOnInit(): void {
        this.getItems();
    }

    getItems() {
        this.dataService.getDZForAdmin()
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
        this.router.navigate(['/AdminHome/DZ/', ind]);
    }
}

