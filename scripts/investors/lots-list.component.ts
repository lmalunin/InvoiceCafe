import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import { HelperService } from './../helperService';
import { StorageService } from './../storageService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { ContractViewModel } from '../models/ContractViewModel';
import { PersonViewModel } from '../models/PersonViewModel';
import { DZViewModel } from '../models/DZViewModel';
import { LotViewModel } from '../models/LotViewModel';
import { OfferViewModel } from '../models/OfferViewModel';
import { SearchLotsViewModel } from '../models/SearchLotsViewModel';
import { SearchLotsResults } from '../models/SearchLotsResults';

declare var moment: any;

@Component({
    selector: 'ic-lots-list',
    templateUrl: '/templates/v0102/investors/lots-list.tpl.html'
})
export class LotsListComponent implements OnInit {
    currentCompany: CompanyViewModel;

    filters: SearchLotsViewModel[];
    numOfFilters: number;
    numOfSelectedLots: number;
    currentFilter: SearchLotsViewModel;
    filterTitle: string;
    selectAll: boolean;

    lots: SearchLotsResults[];
    newOffer: OfferViewModel;
    offers: SearchLotsResults[];

    errorMessages: Array<string>;

    constructor(private dataService: DataService, private router: Router, private helper: HelperService, private storService: StorageService) {
        this.errorMessages = new Array<string>();
        this.currentCompany = storService.getValue();
        this.numOfSelectedLots = 0;
        this.selectAll = false;
    }

    ngOnInit(): void {
        this.newOffer = new OfferViewModel();

        this.getFilters();
    }

    getFilters() {
        this.errorMessages = new Array<string>();
        this.dataService.getFiltersForInvestor(this.currentCompany.Id)
            .subscribe(
            res => { this.filtersFound(res) },
            errorObject => this.process_error(errorObject));
    }

    filtersFound(filters: SearchLotsViewModel[]) {
        this.filters = filters;
        this.numOfFilters = filters.length;
        this.currentFilter = filters[0];
        this.filterTitle = this.currentFilter.FilterName;
        this.getLots();
    }

    getLots() {
        this.errorMessages = new Array<string>();
        this.dataService.getLotsByFilter(this.currentFilter)
            .subscribe(
            lots => { this.loadLotsToView(lots) },
            errorObject => this.process_error(errorObject));
    }

    loadLotsToView(lots: SearchLotsResults[]) {
        this.lots = lots;
        this.numOfSelectedLots = 0;
        this.selectAll = false;
    }

    selectAllClicked() {
        for (let j = 0; j < this.lots.length; j++)
            this.lots[j].IsChecked = this.selectAll;
        if (this.selectAll)
            this.numOfSelectedLots = this.lots.length;
        else
            this.numOfSelectedLots = 0;
    }

    editFilter(id: number) {
        this.router.navigate(['/InvestorHome/EditFilter/', id]);
    }

    setFilter(i: number) {
        console.log(this.filters);
        console.log(i, this.filters[i]);
        if (i == -1) {
            this.currentFilter = null;
            this.filterTitle = "(без фильтра)";
        }
        else {
            this.currentFilter = this.filters[i];
            this.filterTitle = this.currentFilter.FilterName;
        }
        this.getLots();
    }

    lotsClicked() {
        let i = 0;
        for (let j = 0; j < this.lots.length; j++)
            if (this.lots[j].IsChecked)
                i++;
        this.numOfSelectedLots = i;
    }

    acceptLots() {
        this.newOffer = new OfferViewModel();
        var dialog: any = document.getElementById('acceptLotsDialog');
        if (dialog)
            dialog.open();
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
    }

    lot_details(Id: number) {
        this.router.navigate(['/InvestorHome/Lot/', Id]);
    }

    filters_submit_click() {
        //console.log(this.filters);
        this.getLots();
    }

    makeOfferClick() {
        this.newOffer = new OfferViewModel();
        var dialog: any = document.getElementById('addLotDialog');
        if (dialog)
            dialog.open();
    }

    makeOffer() {
        let i: number;
        this.offers = new Array<SearchLotsResults>();

        for (i = 0; i < this.lots.length; i++) {
            if (!this.lots[i].IsChecked)
                continue;

            var offer = new SearchLotsResults();
            offer = this.lots[i];
            if (this.newOffer.FullAccept) {
                offer.OfferDZPart = this.lots[i].DZPart;
                offer.OfferYearPercent = this.lots[i].LotYearPercent;
                offer.OfferType = 5;
            }
            else {
                offer.OfferDZPart = this.newOffer.DZPart;
                offer.OfferYearPercent = this.newOffer.YearPercent;
                offer.OfferType = 10;
            }

            this.offers.push(offer);
        }

        if (this.offers.length == 0) {
            console.log("No lots selected");
            return;
        }

        this.dataService.addOffers(this.offers)
            .subscribe(
            offers => { this.makeOfferOk(offers) },
            errorObject => this.process_error(errorObject));
    }

    //makeOffer() {
    //    var i: number;
    //    var offer: OfferViewModel;
    //    this.offers = new Array<OfferViewModel>();
    //    for (i = 0; i < this.lots.length; i++) {
    //        if (!this.lots[i].IsChecked)
    //            continue;
    //        offer = new OfferViewModel();

    //        offer.Lot = new LotViewModel();
    //        offer.Lot.Id = this.lots[i].LotId;
    //        offer.Lot.DZPart = this.lots[i].DZPart;
    //        offer.Lot.Sum = this.lots[i].LotSum;
    //        offer.Lot.YearPercent = this.lots[i].LotYearPercent;

    //        offer.Lot.DZ = new DZViewModel();
    //        offer.Lot.DZ.Supplier = new CompanyViewModel();
    //        offer.Lot.DZ.Supplier.Id = this.lots[i].SupplierId;
    //        offer.Lot.DZ.Debtor = new CompanyViewModel();
    //        offer.Lot.DZ.Debtor.Id = this.lots[i].DebtorId;

    //        //избыточное заполнение, иначе модель ругается, разобраться позже
    //        offer.Lot.DZ.Sum = this.lots[i].LotSum; 
    //        offer.Lot.DZ.Days = this.lots[i].DZDays;
    //        offer.DZ = new DZViewModel();
    //        offer.DZ.Sum = this.lots[i].LotSum;
    //        offer.DZ.Days = this.lots[i].DZDays;

    //        if (this.newOffer.FullAccept) {
    //            offer.DZPart = offer.Lot.DZPart;
    //            offer.YearPercent = offer.Lot.YearPercent;
    //            offer.Type = 5;
    //        }
    //        else {
    //            offer.DZPart = this.newOffer.DZPart;
    //            offer.YearPercent = this.newOffer.YearPercent;
    //            offer.Type = 10;
    //        }
    //        this.offers.push(offer);
    //    }

    //    if (this.offers.length == 0) {
    //        console.log("No lots selected");
    //        return;
    //    }

    //    this.dataService.add_offers(this.offers)
    //        .subscribe(
    //        offers => { this.make_offer_ok(offers) },
    //        errorObject => this.process_error(errorObject));
    //}

    makeOfferOk(offers: SearchLotsResults[]) {
        this.helper.showToast(document.getElementById('theToast'), "Оферты отправлены");
        this.getLots();
    }
}

