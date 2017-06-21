import { Component, OnInit } from '@angular/core';
import './../rxjs-operators';

import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { Router }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { SearchLotsViewModel } from '../models/SearchLotsViewModel';

// ***************************************************************************************
@Component({
    selector: 'ic-filter-add',
    templateUrl: '/templates/v0102/investors/filters-update.tpl.html'
})
export class FiltersAddComponent {
    currentCompany: CompanyViewModel;
    filter: SearchLotsViewModel;

    errorMessages: Array<string>;
    showProgress: boolean;

    pageTitle = 'Добавление фильтра';

    constructor(private dataService: DataService, private router: Router, private storService: StorageService, private helper: HelperService) {
        this.currentCompany = storService.getValue();
        this.showProgress = false;
        this.filter = new SearchLotsViewModel();
        this.filter.CompanyId = this.currentCompany.Id.toString();
        this.filter.DZDays_min = 0;
        this.filter.DZDays_max = 5;
        this.filter.LotSum_min = 0;
        this.filter.LotSum_max = 100000;
        this.filter.LotDZPart_min = 1;
        this.filter.LotDZPart_max = 80;
        this.filter.LotYearPercent_min = 1;
        this.filter.LotYearPercent_max = 10;
        this.filter.DebtorDealsDays_min = 0;
        this.filter.DebtorDealsDays_max = 30;
        this.filter.DZVerType = 5;

        this.filter.AddOrUpdate = 1;
    }

    set_SupplierDealsDays(days: number) {
        this.filter.SupplierDealsDays_max = days;
    }

    set_DZVerType(code: number) {
        this.filter.DZVerType = code;
    }

    sliderDZDays_max(event) {
        this.filter.DZDays_max = parseInt(event.srcElement.immediateValue);
    }

    sliderLotSum_max(event) {
        this.filter.LotSum_max = parseInt(event.srcElement.immediateValue);
    }

    sliderLotDZPart_max(event) {
        this.filter.LotDZPart_max = parseInt(event.srcElement.immediateValue);
    }

    sliderLotYearPercent_max(event) {
        this.filter.LotYearPercent_max = parseInt(event.srcElement.immediateValue);
    }

    submit_click = function () {
        this.errorMessages = new Array<string>();
        this.dataService.addOrUpdateFilter(this.filter)
            .subscribe(
            res => this.service_ok(res),
            errorObject => this.process_error(errorObject));
    }

    service_ok() {
        this.router.navigate(['InvestorHome/Lots']);
    }

    process_error(errorObject: Object) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        this.helper.showToast(document.getElementById('theToast'), "Ошибка сохранения");
        console.log(errorObject);
    }
}