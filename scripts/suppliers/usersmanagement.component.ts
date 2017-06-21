import { Component, OnInit } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { PersonViewModel } from '../models/PersonViewModel';
import { CompanyViewModel } from '../models/CompanyViewModel';

import './../rxjs-operators';

import { Router }    from '@angular/router';


@Component({
    selector: 'ic-users-management',
    templateUrl: '/templates/v0102/suppliers/usersmanagement.tpl.html'
})
export class UsersManagementComponent implements OnInit {

    private _persons: PersonViewModel[];
    errorMessages: Array<string>;
    private currentCompany: CompanyViewModel;

    constructor(private _dataService: DataService,
        private _storService: StorageService,
        private _router: Router,
        private _translate: TranslateService) {
        this.currentCompany = this._storService.getValue();
    }

    ngOnInit(): void {
        this.getAllUsersForCompany();
    }

    getAllUsersForCompany() {
        this._dataService.getAllUsersForCompany(this.currentCompany.Id)
            .subscribe(
            _persons => { this._persons = _persons },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    navigate_to_add() {
        this._router.navigate(['SupplierHome/AddPerson']);
    }

    navigate_to_update(id) {
        this._router.navigate(['SupplierHome/UpdatePerson', id]);
    }
}