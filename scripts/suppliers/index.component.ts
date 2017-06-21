import { Component, ElementRef } from '@angular/core';
import { StorageService } from './../storageService';
import { CompanyViewModel } from '../models/CompanyViewModel';

@Component({
    selector: 'ic-index',
    templateUrl: '/templates/v0102/suppliers/index.tpl.html'
})
export class IndexComponent {
    currentCompany: CompanyViewModel;
    step1 = 0;
    step2 = 0;
    step3 = 0;
    numOfCompletedSteps = 0;

    constructor(private storService: StorageService) {
        this.currentCompany = storService.getValue();

        this.step1 = (this.currentCompany.RegisterSteps & 1) == 1 ? 1 : 0;
        this.step2 = (this.currentCompany.RegisterSteps & 2) == 2 ? 1 : 0;
        this.step3 = (this.currentCompany.RegisterSteps & 4) == 4 ? 1 : 0;

        this.numOfCompletedSteps = this.step1 + this.step2 + this.step3;
    }
}
