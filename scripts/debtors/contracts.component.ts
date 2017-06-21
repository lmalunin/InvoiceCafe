import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../dataService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { ContractViewModel } from '../models/ContractViewModel';
import { PersonViewModel } from '../models/PersonViewModel';
import { DZViewModel } from '../models/DZViewModel';
import { LotViewModel } from '../models/LotViewModel';

declare var moment: any;


// ***************************************************************************************
@Component({
    selector: 'ic-contracts-details',
    templateUrl: '/templates/v0102/debtors/contracts-details.tpl.html'
})
export class ContractDetailsComponent implements OnInit {
    @Input() _dp_local: Object;
    contractGuid: string;
    dzId: number;
    model: ContractViewModel;
    errorMessages: Array<string>;
    _dt: string[];
    showProgress: boolean;

    newDZ: DZViewModel;
    newLot: LotViewModel;

    constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {
        this.initialize_model();
        this.contractGuid = this.route.snapshot.params['id'];
        this.dzId = this.route.snapshot.params['dzId'];

        this._dp_local = {
            today: 'сегодня',
            cancel: 'отмена',
            firstDayOfWeek: 1,
            monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
            weekdaysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
            formatDate: function (d) {
                return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('.');
            },
            formatTitle: function (monthName, fullYear) {
                return monthName + ' ' + fullYear;
            }
        };
    }

    initialize_model() {
        this.model = new ContractViewModel();
        this.model.Supplier = new CompanyViewModel();
        this.model.SupplierSigner = new PersonViewModel();
        this.model.DebtorSigners = new Array<PersonViewModel>(); this.model.DebtorSigners.push(new PersonViewModel());
        this.model.Debtors = new Array<CompanyViewModel>(); this.model.Debtors.push(new CompanyViewModel());
        this._dt = new Array<string>(10);

        this.newDZ = new DZViewModel();
        this.newLot = new LotViewModel();
    }

    ngOnInit(): void {
        this.getContract();

    }

    getContract() {
        this.dataService.getContractDetails(this.contractGuid)
            .subscribe(
            contract => { this.model = contract; this.populate_data() },
            errorObject => this.process_error(errorObject));
    }

    populate_data() {
        this._dt = new Array<string>(10);
        this._dt[0] = moment(this.model.DateOfSign).format('YYYY-MM-DD');
        this._dt[1] = moment(this.model.DateFrom).format('YYYY-MM-DD');
        this._dt[2] = moment(this.model.DateTo).format('YYYY-MM-DD');
        this._dt[3] = moment(this.model.DebtorObligationsDate).format('YYYY-MM-DD');
        this._dt[4] = moment(this.model.SupplierDeliveryDate).format('YYYY-MM-DD');
        this._dt[5] = moment(this.model.PropertyRightsTransferDate).format('YYYY-MM-DD');
        this._dt[6] = moment(this.model.SupplierSigner.AuthDateFrom).format('YYYY-MM-DD');
        this._dt[7] = moment(this.model.SupplierSigner.AuthDateTo).format('YYYY-MM-DD');
        this._dt[8] = moment(this.model.DebtorSigners[0].AuthDateFrom).format('YYYY-MM-DD');
        this._dt[9] = moment(this.model.DebtorSigners[0].AuthDateTo).format('YYYY-MM-DD');

        this.newDZ = new DZViewModel();
        this.newDZ.ContractGuid = this.model.Guid;
        this.newDZ.Debtor = this.model.Debtors[0];
        this.newDZ.DocumentsURLs = new Array<string>();
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }
}