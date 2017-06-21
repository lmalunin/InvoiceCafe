import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { DictionaryService, dictItem } from './../dictService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { ContractViewModel } from '../models/ContractViewModel';
import { PersonViewModel } from '../models/PersonViewModel';
import { DZViewModel } from '../models/DZViewModel';
import { LotViewModel } from '../models/LotViewModel';

declare var moment: any;

@Component({
    selector: 'ic-lots-list',
    templateUrl: '/templates/v0102/suppliers/lots-list.tpl.html'
})
export class LotsListComponent implements OnInit {
    lots: LotViewModel[];
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private router: Router, private storService: StorageService, private dict: DictionaryService) {
        this.currentCompany = storService.getValue();
    }

    ngOnInit(): void {
        this.getLots();
    }

    getLots() {
        this.dataService.getLotsForSupplier(this.currentCompany.Guid)
            .subscribe(
            lots => { this.lots = lots; },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    lots_list(Id: number) {
        //var srcId: string = event.srcElement.id;
        //var contractGuid: string = srcId.split('_')[1];
        //if (contractGuid == undefined)
        //    return;

        //this.router.navigate(['/SupplierHome/Contract/', contractGuid]);
    }
}

