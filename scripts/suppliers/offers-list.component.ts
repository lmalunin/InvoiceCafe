﻿import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { DictionaryService, dictItem } from './../dictService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { ContractViewModel } from '../models/ContractViewModel';
import { PersonViewModel } from '../models/PersonViewModel';
import { DZViewModel } from '../models/DZViewModel';
import { LotViewModel } from '../models/LotViewModel';
import { OfferViewModel } from '../models/OfferViewModel';

declare var moment: any;

@Component({
    selector: 'ic-lots-list',
    templateUrl: '/templates/v0102/suppliers/offers-list.tpl.html'
})
export class OffersListComponent implements OnInit {
    errorMessages: Array<string>;
    offers: OfferViewModel[];
    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private router: Router, private storService: StorageService, private dict: DictionaryService) {
        this.currentCompany = storService.getValue();
    }

    ngOnInit(): void {
        this.getOffers();
    }

    getOffers() {
        this.dataService.getOffersForSupplier(this.currentCompany.Guid)
            .subscribe(
            offers => { this.offers = offers; },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    offer_details(Id: any) {
        this.router.navigate(['/SupplierHome/Offer/', Id]);
    }
}

