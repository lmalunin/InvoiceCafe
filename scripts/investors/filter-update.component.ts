import { Component, OnInit, AfterViewInit } from '@angular/core';
import './../rxjs-operators';

import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { Router, ActivatedRoute }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { SearchLotsViewModel } from '../models/SearchLotsViewModel';

// ***************************************************************************************
@Component({
    selector: 'ic-filter-add',
    templateUrl: '/templates/v0102/investors/filters-update.tpl.html'
})
export class FilterUpdateComponent implements OnInit {
    currentCompany: CompanyViewModel;
    filter: SearchLotsViewModel;

    errorMessages: Array<string>;
    showProgress: boolean;

    pageTitle = 'Редактирование фильтра';

    constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private storService: StorageService, private helper: HelperService) {
        this.currentCompany = storService.getValue();
        this.showProgress = false;
        this.filter = new SearchLotsViewModel();
    }

    ngOnInit(): void {
        this.getFilter(this.route.snapshot.params['id']);
    }

    getFilter(id: number) {
        this.errorMessages = new Array<string>();
        this.dataService.getFilter(id)
            .subscribe(
            res => { this.filterFound(res) },
            errorObject => this.process_error(errorObject));
    }

    filterFound(filter: SearchLotsViewModel) {
        this.filter = filter;
        this.filter.AddOrUpdate = 5;
    }

    set_SupplierDealsDays(days: any) {
        if (days == undefined)
            return;
        if (this.filter.SupplierDealsDays_max != 0 && this.filter.SupplierDealsDays_max == days) {
            //раз одинаковые значения, то скорее всего кликнули второй раз, значит обнуляем. потом придумать более надежный способ с проверкой состояния
            this.filter.SupplierDealsDays_max = 0;
            return;
        }
        this.filter.SupplierDealsDays_max = days;
    }

    set_DZVerType(code: number) {
        if (code == undefined)
            return;
        if (this.filter.DZVerType != 0 && this.filter.DZVerType == code) {
            //раз одинаковые значения, то скорее всего кликнули второй раз, значит обнуляем. потом придумать более надежный способ с проверкой состояния
            this.filter.DZVerType = 0;
            return;
        }
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