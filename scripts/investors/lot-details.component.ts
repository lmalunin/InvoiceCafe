import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { ContractViewModel } from '../models/ContractViewModel';
import { PersonViewModel } from '../models/PersonViewModel';
import { DZViewModel } from '../models/DZViewModel';
import { LotViewModel } from '../models/LotViewModel';

declare var moment: any;

@Component({
    selector: 'ic-lot-details',
    templateUrl: '/templates/v0102/investors/lot-details.tpl.html'
})
export class LotDetailsComponent implements OnInit {
    @Input() _dp_local: Object;

    model: LotViewModel;
    errorMessages: Array<string>;
    _dt: string[];
    showProgress: boolean;
    lotId: number;

    constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {
        this.initialize_model();
        this.lotId = this.route.snapshot.params['id'];
    }

    initialize_model() {
        this.model = new LotViewModel();
        this.model.DZ = new DZViewModel();
        this.model.DZ.Supplier = new CompanyViewModel();
        this.model.DZ.Debtor = new CompanyViewModel();
    }

    ngOnInit(): void {
        this.dataService.getLotDetails(this.lotId)
            .subscribe(
            lot => { this.model = lot },
            errorObject => this.process_error(errorObject));
    }

    accept_lot() {
        this.errorMessages = new Array<string>();
        //this.dataService.accept_lot(this.model)
        //    .subscribe(
        //    appForm => this.accept_ok(appForm),
        //    errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    submit_click = function () {
        this.showProgress = true;
        this.accept_lot();
    }
}