import {Injectable} from '@angular/core';
import { CompanyViewModel } from './models/CompanyViewModel';

@Injectable()
export class StorageService {
    private currentCompany: CompanyViewModel;

    constructor() { }

    setValue(Company) {
        this.currentCompany = Company;
    }

    getValue() {
        return this.currentCompany;
    }
}