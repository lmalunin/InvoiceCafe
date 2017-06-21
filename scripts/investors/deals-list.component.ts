import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { DealViewModel } from '../models/DealViewModel';

declare var moment: any;

@Component({
    selector: 'ic-deals-list',
    templateUrl: '/templates/v0102/investors/deals-list.tpl.html'
})
export class DealsListComponent implements OnInit {
    errorMessages: Array<string>;
    deals: DealViewModel[];
    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private router: Router, private storService: StorageService) {
        this.currentCompany = storService.getValue();
    }

    ngOnInit(): void {
        this.getDeals();
    }

    getDeals() {
        this.dataService.getDealsForInvestor(this.currentCompany.Guid)
            .subscribe(
            deals => { this.deals = deals; },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    open_selected(event: any) {
        var srcId: string = event.srcElement.id;
        var Id: number = parseInt(srcId.split('_')[1]);
        console.log(Id);
        if (Id == undefined || isNaN(Id))
            return;

        //this.router.navigate(['/InvestorHome/Lot/', Id]);
    }
}

