import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
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
    selector: 'ic-offer-details',
    templateUrl: '/templates/v0102/suppliers/offer-details.tpl.html'
})
export class OfferDetailsComponent implements OnInit {
    model: OfferViewModel;
    errorMessages: Array<string>;
    showProgress: boolean;

    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private storService: StorageService, private helper: HelperService) {
        this.currentCompany = storService.getValue();
        this.model = new OfferViewModel();
        this.model.Lot = new LotViewModel();
        this.model.Investor = new CompanyViewModel();
        this.model.Id = this.route.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.getOffer();
    }

    getOffer() {
        this.dataService.getOfferDetails(this.model.Id)
            .subscribe(
            offer => { this.model = offer; },
            errorObject => this.process_error(errorObject));
    }

    process_offer_click(res: number) {
        this.model.Status = res;
        this.dataService.processOffer(this.model)
            .subscribe(
            offer => { this.process_offer_ok(offer) },
            errorObject => this.process_error(errorObject));
    }

    process_offer_ok(offer: OfferViewModel) {
        this.model = offer;
        if (offer.Status == 10) {
            console.log(document.getElementById('theToast'));
            this.helper.showToast(document.getElementById('theToast'), "Оффер принят");
        }
        if (offer.Status == 20)
            this.helper.showToast(document.getElementById('theToast'), "Оффер отклонен");
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log("Error: ", errorObject);
    }
}
