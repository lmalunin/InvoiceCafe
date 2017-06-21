import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
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

// ***************************************************************************************
@Component({
    selector: 'ic-contracts-add',
    templateUrl: '/templates/v0102/suppliers/contracts-add.tpl.html'
})
export class ContractsAddComponent implements AfterViewInit {
    currentCompany: CompanyViewModel;
    @Input() _dp_local: Object;
    @Input() _upl_local: Object;

    model: ContractViewModel;
    debtors: CompanyViewModel[];
    selectedDebtor: CompanyViewModel;

    errorMessages: Array<string>;
    showProgress: boolean;

    currentStep: number;

    private _delivery_types = [1, 2, 3];

    _dt = new Array<string>();

    constructor(private dataService: DataService, private router: Router, private storService: StorageService,
        private helper: HelperService, private translate: TranslateService, private dict: DictionaryService) 
    {
        this.currentCompany = storService.getValue();
        this.initialize_model();
        this.showProgress = false;

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

    ngAfterViewInit(): void {
        this.getDebtors();
        //var combobox: any = document.getElementById('ff11');
        //combobox.items = ['Bohrium', 'Boron', 'Bromine', 'Cadmium', 'Caesium', 'Calcium'];
        //combobox.selectedValue = 'Bromine';
    }

    initialize_model() {
        this.model = new ContractViewModel();
        this.model.SupplierSigner = new PersonViewModel();
        this.selectedDebtor = new CompanyViewModel();
        this.model.DebtorSigners = new Array<PersonViewModel>();
        this.model.DebtorSigners.push(new PersonViewModel());
        this.model.IsCessionAcceptable = false;

        // тестовая инициализация



        this.model.ContractType = 2;
        this.model.ContractNumber = "123/34-2016АБ";
        this.model.ContractName = "Контракт на поставку хлебобулочных изделий";
        this._dt.push('2016-08-01');
        this._dt.push('2016-08-02');
        this._dt.push('2016-08-03');
        this._dt.push('2016-08-04');
        this._dt.push('2016-08-05');
        this._dt.push('2016-08-06');
        this._dt.push('2016-08-07');
        this._dt.push('2016-08-08');
        this._dt.push('2016-08-09');
        this._dt.push('2016-08-10');
        this.model.Duration = 2;
        this.model.ContractMatter = "Предмет договора";
        this.model.DeliveryType = 1;
        this.model.CounterClaimTerms = "Условия 1";
        this.model.MoneyBackTerms = "Условия 2";
        this.model.AcceptanceTerms = "Условия 3";
        this.model.PaymentTerms = "Условия 4";
        this.model.IsCessionAcceptable = true;
        this.model.SupplierSigner.FullName = "Подписантов Поставщик Иванович";
        this.model.SupplierSigner.AuthDocumentType = "Доверенность";
    }

    after_file_upload(event: any) {
        //console.log(event.srcElement.id,': ',event.detail.xhr.responseText);
        let serverFileName = event.detail.xhr.responseText;
        if (event.srcElement.id == "SupplierSigner_AuthScan") {
            this.model.SupplierSigner.AuthDocumentURL = serverFileName;
        }
        if (event.srcElement.id == "DebtorSigner0_AuthScan") {
            this.model.DebtorSigners[0].AuthDocumentURL = serverFileName;
        }    }

    upl_reject(event: any) {
        this.helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error);
    }

    getDebtors() {
        this.dataService.getDebtorsForSupplier(this.currentCompany.Id)
            .subscribe(
            debtors => { this.debtors = debtors; },
            errorObject => this.process_error(errorObject));
    }

    calc_contract_duration(event: any) {
        this.model[event.srcElement.id] = new Date(event.detail.value);

        let d1 = moment(this.model.DateFrom);
        let d2 = moment(this.model.DateTo);
        this.model.Duration = d2.diff(d1, 'days');
    }

    add_contract() {
        this.errorMessages = new Array<string>();
        this.dataService.add_contract(this.model)
            .subscribe(
            appForm => this.register_ok(appForm),
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        this.showProgress = false;
        console.log(errorObject);
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(fieldName + ": " + errorObject[fieldName][message]);
    }

    submit_click = function () {
        this.showProgress = true;
        //this.add_company();
        this.model.DateOfSign = new Date(this._dt[0]);
        this.model.DateFrom = new Date(this._dt[1]);
        this.model.DateTo = new Date(this._dt[2]);
        this.model.DebtorObligationsDate = new Date(this._dt[3]);
        this.model.SupplierDeliveryDate = new Date(this._dt[4]);
        this.model.PropertyRightsTransferDate = new Date(this._dt[5]);
        this.model.SupplierSigner.AuthDateFrom = new Date(this._dt[6]);
        this.model.SupplierSigner.AuthDateTo = new Date(this._dt[7]);
        this.model.DebtorSigners[0].AuthDateFrom = new Date(this._dt[8]);
        this.model.DebtorSigners[0].AuthDateTo = new Date(this._dt[9]);

        //console.log("submit");
        //var frm: any = document.getElementById('frm-add-contract');
        //console.log(frm);
        //frm.validate();
        this.add_contract();
    }

    register_ok = function (appForm: ContractViewModel) {
        this.showProgress = false;
        this.helper.showToast(document.getElementById('theToast'), "Invoice added");
    }

    set_contract_type = function (item: dictItem) {
        if (item == undefined || item == null)
            return;
        this.model.ContractType = item.Id;
    }

    set_delivery_type = function (item: dictItem) {
        if (item == undefined || item == null)
            return; 
        this.model.DeliveryType = item.Id;
    }

    setLegalForm(legalForm: dictItem) {

    }


    set_debtor = function (debtor: CompanyViewModel) {
        if (debtor == undefined || debtor == null)
            return;
        console.log(debtor);
        //this.selectedDebtor = this.debtors[ind];
        //this.model.DebtorSigners = new Array<PersonClass>();
        //var person = new PersonClass();
        //this.model.DebtorSigners.push(new PersonClass());
        var upl: any = document.getElementById('DebtorSigner0_AuthScan');
        if (upl)
            upl.files = new Array();

        this.selectedDebtor = debtor;
        if (debtor == null) {
            this.model.Debtors = null;
            this.model.DebtorSigners[0] = null;
            return;
        }

        this.model.Debtors = new Array<CompanyViewModel>();
        this.model.Debtors.push(this.selectedDebtor);
        this.model.DebtorSigners[0] = new PersonViewModel();
        this.model.DebtorSigners[0].Company = this.selectedDebtor;   
        this.model.DebtorSigners[0].FullName = "";    
        this.model.DebtorSigners[0].AuthDocumentType = "";    
    }

    moveToStep(step: number) {
        this.currentStep = step;
    }

    addDebtor() {
        this.router.navigate(['/SupplierHome/AddDebtor']);
    }
}