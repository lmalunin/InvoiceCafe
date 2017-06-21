import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { HelperService } from './../helperService';
import { DictionaryService, dictItem } from './../dictService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

import { SignFormViewModel } from '../models/SignFormViewModel';

declare var moment: any;

@Component({
    selector: 'ic-compaines-list',
    templateUrl: '/templates/v0102/admins/companies-list.tpl.html'
})
export class CompaniesListComponent implements OnInit {
    model: SignFormViewModel[];
    errorMessages: Array<string>;

    constructor(private dataService: DataService, private router: Router, private helper: HelperService, private dict: DictionaryService) {
    }

    ngOnInit(): void {
        this.dataService.getSignforms()
            .subscribe(
            sforms => { this.model = sforms; console.log(this.model) },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    sf_details(Id: number) {
        this.router.navigate(['/AdminHome/SignForm/', Id]);
    }
}

