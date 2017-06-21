import { Component, ElementRef } from '@angular/core';
import { StorageService } from './../storageService';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { DataService } from './../dataService';

@Component({
    selector: 'ic-rules',
    templateUrl: '/templates/v0102/suppliers/rules.tpl.html'
})
export class RulesComponent {
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;
    acceptRules = false;

    constructor(private dataService: DataService, private storService: StorageService) {
        this.currentCompany = storService.getValue();
    }

    submit_click() {
        this.errorMessages = new Array<string>();
        this.dataService.accept_rules()
            .subscribe(
            res => this.register_ok(res),
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    register_ok = function (res: string) {
        //this.showProgress = false;
        location.href = "/SupplierHome/Index";
    }
}
