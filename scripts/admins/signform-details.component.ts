import { Component, OnInit, Input } from '@angular/core';

import { DataService } from './../dataService';
import { DictionaryService, dictDocument, dictItem } from './../dictService';
import { HelperService } from './../helperService';

import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { SignFormViewModel } from '../models/SignFormViewModel';

declare var moment: any;

@Component({
    selector: 'ic-signform-details',
    templateUrl: '/templates/v0102/admins/sf-details.tpl.html'
})
export class SignFormDetailsComponent implements OnInit {
    @Input() _dp_local: Object;

    model: SignFormViewModel;
    errorMessages: Array<string>;
    showProgress: boolean;
    sfId: number;
    _dt: string;

    constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private dict: DictionaryService, private helper: HelperService) {
        this.initialize_model();
        this.sfId = this.route.snapshot.params['id'];
    }

    initialize_model() {
        this.model = new SignFormViewModel();
        this.model.Company = new CompanyViewModel();
    }

    ngOnInit(): void {
        this.dataService.getSignFormDetails(this.sfId)
            .subscribe(
            sf => { this.model = sf; console.log(sf); this._dt = moment(this.model.DirectorBDate).format('YYYY-MM-DD'); },
            errorObject => this.process_error(errorObject));
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
        this.dataService.accept_signform(this.model)
            .subscribe(
            appForm => this.accept_ok(appForm),
            errorObject => this.process_error(errorObject));
    }

    accept_ok = function (appForm: SignFormViewModel) {
        this.showProgress = false;
        var dialog: any = document.getElementById('successDialog');
        if (dialog)
            dialog.open();
    }
}