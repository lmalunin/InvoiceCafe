import { Component, OnInit, Input, AfterViewInit  } from '@angular/core';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import { DictionaryService, dictItem } from './../dictService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { CompanyViewModel } from '../models/CompanyViewModel';
import { ContractViewModel } from '../models/ContractViewModel';
import { PersonViewModel } from '../models/PersonViewModel';
import { DZViewModel } from '../models/DZViewModel';
import { LotViewModel } from '../models/LotViewModel';

declare var moment: any;
declare var jQuery: any;

// ***************************************************************************************
@Component({
    selector: 'ic-contracts-details',
    templateUrl: '/templates/v0102/suppliers/contract-details.tpl.html'
})
export class ContractDetailsComponent implements OnInit, AfterViewInit {
    @Input() _dp_local: Object;
    @Input() _upl_local: Object;
    contractGuid: string;
    model: ContractViewModel;
    errorMessages: Array<string>;
    _dt: string[];
    showProgress: boolean;

    currentCompany: CompanyViewModel;
    currentStep: number;

    newDZ: DZViewModel;
    newLot: LotViewModel;
    EDS_Ok: boolean;
    EDS_Name: string;
    EDS_Thumb: string;

    constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router,
        private storService: StorageService, private translate: TranslateService, private helper: HelperService, private dict: DictionaryService)
    {
        this.currentCompany = storService.getValue();
        this.initialize_model();
        this.contractGuid = this.route.snapshot.params['id'];

        if (this.translate.currentLang == "en") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }

        if (this.translate.currentLang == "ru") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }

        this.currentStep = 1;  // шаг визарда
    }

    ngAfterViewInit() {
        // не заработало
        //setTimeout(() => {
        //    var responsiveTabs: any = jQuery('.responsiveTabs');
        //    console.log(responsiveTabs);
        //    if (responsiveTabs.length) {
        //        var i;
        //        for (i = 0; i < responsiveTabs.length; i++) {
        //            var responsiveTabsItem = jQuery(responsiveTabs[i]);
        //            responsiveTabsItem.easyResponsiveTabs({
        //                type: responsiveTabsItem.attr("data-type") === "accordion" ? "accordion" : "default"
        //            });
        //        }
        //    }
        //}, 0);
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

    calc_contract_duration(event: any) {
        this.model[event.srcElement.id] = new Date(event.detail.value);

        let d1 = moment(this.model.DateFrom);
        let d2 = moment(this.model.DateTo);
        this.model.Duration = d2.diff(d1, 'days');
    }

    populate_data() {
        let format: string = 'DD.MM.YYYY';

        this._dt = new Array<string>(12);
        this._dt[0] = moment(this.model.DateOfSign).format(format);
        this._dt[1] = moment(this.model.DateFrom).format(format);
        this._dt[2] = moment(this.model.DateTo).format(format);
        this._dt[3] = moment(this.model.DebtorObligationsDate).format(format);
        this._dt[4] = moment(this.model.SupplierDeliveryDate).format(format);
        this._dt[5] = moment(this.model.PropertyRightsTransferDate).format(format);
        this._dt[6] = moment(this.model.SupplierSigner.AuthDateFrom).format(format);
        this._dt[7] = moment(this.model.SupplierSigner.AuthDateTo).format(format);
        this._dt[8] = moment(this.model.DebtorSigners[0].AuthDateFrom).format(format);
        this._dt[9] = moment(this.model.DebtorSigners[0].AuthDateTo).format(format);

        this.clean_dz();

        this._dt[10] = moment(this.newDZ.DateFrom).format(format);
        this._dt[11] = moment(this.newDZ.DateTo).format(format);
    }

    show_details() {
        var dialog: any = document.getElementById('showDetailsDialog');
        if (dialog)
            dialog.open();
    }

    clean_dz() {
        this.newDZ = new DZViewModel();
        this.newDZ.ContractGuid = this.model.Guid;
        this.newDZ.Debtor = this.model.Debtors[0];
        this.newDZ.DocumentsURLs = new Array<string>();
        this.newDZ.DateFrom = new Date();
        this.newDZ.DateTo = new Date();
        this.newDZ.Status = 1;
    }

    //before_file_upload(event: any) {
    //    var server_file_name = this.helper.processUploadFileName(event.detail.file.name);
    //    event.detail.formData.append("ServerFileName", server_file_name); //add parameter for server { "local file name" : "server file name" }

    //    this.newDZ.DocumentsURLs.push(server_file_name);
    //    console.log(server_file_name);
    //}

    after_file_upload(event: any) {
        let serverFileName = event.detail.xhr.responseText;
        this.newDZ.DocumentsURLs.push(serverFileName);
        //console.log('added ', serverFileName);
    }

    upl_reject(event: any) {
        this.helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error);
    }

    showAddDzDialog() {
        let dialog: any = document.getElementById("addDzDialog");
        if (dialog) {
            dialog.open();
        }
    }

    showAddLotDialog(ind: number) {
        this.newLot = new LotViewModel();
        this.newLot.DZ = this.model.DZ[ind];
        this.newLot.ContractGuid = this.contractGuid;
        this.newLot.Sum = this.newLot.DZ.Sum;
        var dialog: any = document.getElementById('addLotDialog');
        if (dialog)
            dialog.open();
    }

    addDz() {
        this.showProgress = true;

        this.errorMessages = new Array<string>();
        this.dataService.add_dz(this.newDZ)
            .subscribe(
            appForm => this.add_dz_ok(appForm),
            errorObject => this.add_dz_error(errorObject));
    }

    add_dz_ok = function (appForm: DZViewModel) {
        this.showProgress = false;
        //this.model.DZ.push(appForm);
        //this.clean_dz();
        this.getContract();
        this.helper.showToast(document.getElementById('theToast'), "Задолженность добавлена");
    }

    add_dz_error = function (errorObject: Object) {
        this.showProgress = false;
        this.helper.showToast(document.getElementById('theToast'), "Ошибка добавления задолженности");
        this.process_error(errorObject)
    }

    addLot() {
        this.showProgress = true;
        this.errorMessages = new Array<string>();
        this.dataService.add_lot(this.newLot)
            .subscribe(
            appForm => this.add_lot_ok(appForm),
            errorObject => this.process_error(errorObject));
    }

    add_lot_ok = function (appForm: LotViewModel) {
        this.showProgress = false;
        this.getContract();
        this.helper.showToast(document.getElementById('theToast'), "Лот создан");
    }

    calc_dz_duration(event: any) {
        if (event.srcElement.id == 'newDZ_DateFrom') {
            this.newDZ.DateFrom = moment(event.detail.value).toDate();
        }
        if (event.srcElement.id == 'newDZ_DateTo') {
            this.newDZ.DateTo = moment(event.detail.value).toDate();
        }

        let d1 = moment(this.newDZ.DateFrom);
        let d2 = moment(this.newDZ.DateTo);
        //console.log(d1, d2);
        this.newDZ.Days = d2.diff(d1, 'days');
    }


    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }
}
