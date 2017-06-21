import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
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
    selector: 'ic-dz-details',
    templateUrl: '/templates/v0102/debtors/dz-details.tpl.html'
})
export class DZDetailsComponent implements OnInit {
    @Input() _dp_local: Object;

    model: DZViewModel;
    errorMessages: Array<string>;
    _dt: string[];
    showProgress: boolean;
    dzId: number;

    constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private helper: HelperService) {
        this.initialize_model();
        this.dzId = this.route.snapshot.params['id'];

        this._dp_local = this.helper.DATE_PICKER_i18n_en;
    }

    initialize_model() {
        this.model = new DZViewModel();
        this.model.Supplier = new CompanyViewModel();
        this.model.Debtor = new CompanyViewModel();
    }

    ngOnInit(): void {
        this.dataService.getDZDetails(this.dzId)
            .subscribe(
            dz => { this.model = dz; },
            errorObject => this.process_error(errorObject));
    }

    accept_ok = function (appForm: DZViewModel) {
        this.showProgress = false;
        this.helper.showToast(document.getElementById('theToast'), "Задолженность акцептована");
        this.model.Status = 5;
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
        this.errorMessages = new Array<string>();
        this.dataService.accept_dz(this.model)
            .subscribe(
            appForm => this.accept_ok(appForm),
            errorObject => this.process_error(errorObject));
    }
}