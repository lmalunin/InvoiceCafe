import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
import { Observable }     from 'rxjs/Observable';
declare var moment: any;
declare var jQuery: any;


interface IUrlObject {
    isVisible: boolean;
    fileName: string;
    getUrl: string;
    deleteUrl: string;
}

class UrlObject {
    isVisible: boolean;
    fileName: string;
    getUrl: string;
    deleteUrl: string;

    constructor(_isVisible: boolean, _fileName: string, _getUrl: string, _deleteUrl: string) {
        this.isVisible = _isVisible;
        this.fileName = _fileName;
        this.getUrl = _getUrl;
        this.deleteUrl = _deleteUrl;
    }
}

@Component({
    selector: 'ic-contracts-details',
    templateUrl: '/templates/v0102/suppliers/contract-update.tpl.html'
})
export class ContractUpdateComponent implements OnInit, AfterViewInit {

    private dt_template: string = "YYYY-MM-DD";
    private empty_guid: string = "00000000-0000-0000-0000-000000000000";
    errorMessages: Array<string>;
    showProgress: boolean;

    currentCompany: CompanyViewModel;
    selectedDebtor: CompanyViewModel;
    selectedContract: ContractViewModel;

    private _FullPowersDocumentsNamesSupplier: Array<string>;
    private _FullPowersDocumentsNamesDebtor: Array<string>;
    private _FullPowersDocumentsNamesURLsSupplier: Array<IUrlObject>;
    private _FullPowersDocumentsNamesURLsDebtor: Array<IUrlObject>;
    private FullPowersDocumentsNames_Last: string;
    private IdentityDocumentsNames_Last: string;

    @ViewChild('toDownloadSupplierFPDN') toDownloadSupplierFPDN: ElementRef;
    @ViewChild('toDownloadDebtorFPDN') toDownloadDebtorFPDN: ElementRef;
    @ViewChild('theToast') theToast: ElementRef;

    @Input() _dp_local: Object;
    @Input() _upl_local: Object;

    constructor(
        private dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private storService: StorageService,
        private translate: TranslateService,
        private helper: HelperService,
        private dict: DictionaryService) {

        if (this.translate.currentLang == "en") {
            this._dp_local = this.helper.DATE_PICKER_i18n_en;
            this._upl_local = this.helper.UPLOAD_i18n_en;
        }

        if (this.translate.currentLang == "ru") {
            this._dp_local = this.helper.DATE_PICKER_i18n_ru;
            this._upl_local = this.helper.UPLOAD_i18n_ru;
        }

        this.currentCompany = storService.getValue();

        this._FullPowersDocumentsNamesSupplier = new Array<string>();
        this._FullPowersDocumentsNamesDebtor = new Array<string>();
        this._FullPowersDocumentsNamesURLsSupplier = new Array<IUrlObject>();
        this._FullPowersDocumentsNamesURLsDebtor = new Array<IUrlObject>();


        this.selectedContract = new ContractViewModel();
        this.selectedContract.Debtors = new Array<CompanyViewModel>();
        let debtor = new CompanyViewModel();
        debtor.Id = this.empty_guid;
        this.selectedContract.Debtors.push(debtor);

        this.selectedContract.DebtorSigners = new Array<PersonViewModel>();
        let personVM = new PersonViewModel();
        personVM.Company = new CompanyViewModel();
        personVM.Company.Id = this.empty_guid;
        this.selectedContract.DebtorSigners.push(personVM);

        this.selectedContract.Guid = this.route.snapshot.params['contractId'];

        this.dataService.getContractDetails(this.selectedContract.Guid.toString())
            .subscribe(
            data => {
                this.selectedContract = data;
                this._set_date(this.selectedContract);
                this.selectedDebtor = this.selectedContract.DebtorSigners[0].Company;
                for (var key in data.DebtorSigners[0]) {
                    if (key.match(/date/i)){
                        this.selectedContract.DebtorSigners[0][key] = moment(data.DebtorSigners[0]).format(this.dt_template);
                    } else {
                        this.selectedContract.DebtorSigners[0][key] = data.DebtorSigners[0][key];
                    }  
                }

                this._FullPowersDocumentsNamesSupplier = JSON.parse(this.selectedContract.SupplierSigner.FullPowersDocumentsNames);

                for (var i in this._FullPowersDocumentsNamesSupplier) {
                    this._FullPowersDocumentsNamesURLsSupplier.push(new UrlObject(
                        true,
                        this._FullPowersDocumentsNamesSupplier[i],
                        '/' + this.selectedContract.SupplierSigner.GetDocsBaseUrl + '/' + this.selectedContract.SupplierSigner.Id + "/" + this._FullPowersDocumentsNamesSupplier[i],
                        '/' + this.selectedContract.SupplierSigner.DeleteDocsBaseUrl + '/' + this.selectedContract.SupplierSigner.Id + "/" + this._FullPowersDocumentsNamesSupplier[i]
                    ));
                }

                this._FullPowersDocumentsNamesDebtor = JSON.parse(this.selectedContract.DebtorSigners[0].FullPowersDocumentsNames);

                for (var i in this._FullPowersDocumentsNamesDebtor) {
                    this._FullPowersDocumentsNamesURLsDebtor.push(new UrlObject(
                        true,
                        this._FullPowersDocumentsNamesDebtor[i],
                        '/' + this.selectedContract.DebtorSigners[0].GetDocsBaseUrl + '/' + this.selectedContract.DebtorSigners[0].Id + "/" + this._FullPowersDocumentsNamesDebtor[i],
                        '/' + this.selectedContract.DebtorSigners[0].DeleteDocsBaseUrl + '/' + this.selectedContract.DebtorSigners[0].Id + "/" + this._FullPowersDocumentsNamesDebtor[i]
                    ));
                }
            },
            errorObject => this.process_error(errorObject));
    }

    ngOnInit(): void { }

    ngAfterViewInit() { }

    selected_debtor(debtor: CompanyViewModel) {
        if (this.selectedContract.DebtorSigners[0].Company.Id == debtor.Id ) return;
        this.selectedDebtor = debtor;

        this.dataService.getSubscriberForDebtor(debtor.Id)
            .subscribe(
                    data => {          
                        for (var key in data) {
                            if (key.match(/date/i)) {
                                this.selectedContract.DebtorSigners[0][key] = moment(data[key]).format(this.dt_template);
                            } else {
                                this.selectedContract.DebtorSigners[0][key] = data[key];
                            }    
                        }
                        
                        this._FullPowersDocumentsNamesURLsDebtor = new Array<IUrlObject>();
                        this._FullPowersDocumentsNamesDebtor = JSON.parse(this.selectedContract.DebtorSigners[0].FullPowersDocumentsNames);
                        for (var i in this._FullPowersDocumentsNamesDebtor) {
                            this._FullPowersDocumentsNamesURLsDebtor.push(new UrlObject(
                                true,
                                this._FullPowersDocumentsNamesDebtor[i],
                                '/' + this.selectedContract.DebtorSigners[0].GetDocsBaseUrl + '/' + this.selectedContract.DebtorSigners[0].Id + "/" + this._FullPowersDocumentsNamesDebtor[i],
                                '/' + this.selectedContract.DebtorSigners[0].DeleteDocsBaseUrl + '/' + this.selectedContract.DebtorSigners[0].Id + "/" + this._FullPowersDocumentsNamesDebtor[i]
                            ));
                        }
                        console.log(this.selectedContract.DebtorSigners[0]);
                    },
                    errorObject => this.process_error(errorObject));
    }

    selected_contractType(value: ContractViewModel) {
        if (this.selectedContract.ContractType == value.Id) return;
        this.selectedContract.ContractType = value.Id;
    }

    selected_delivery_type(value: number) {

    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
    }

    delete_file_supplier(url: string): void {
        this.dataService.delete_file(url)
            .subscribe(
            obj => {
                this.person_document_deleted_ok(obj.fileName);
                if (this._FullPowersDocumentsNamesSupplier.includes(obj.fileName)) {
                    this._FullPowersDocumentsNamesSupplier.splice(this._FullPowersDocumentsNamesSupplier.indexOf(obj.fileName), 1);
                }

                if (this._FullPowersDocumentsNamesSupplier && this._FullPowersDocumentsNamesSupplier != []) {
                    this._FullPowersDocumentsNamesURLsSupplier = this._FullPowersDocumentsNamesURLsSupplier.filter(item => item.fileName != obj.fileName);
                }
            },
            errorObject => this.process_error(errorObject)
            );
    }

    delete_file_debtor(url: string): void {
        this.dataService.delete_file(url)
            .subscribe(
            obj => {
                this.person_document_deleted_ok(obj.fileName);
                if (this._FullPowersDocumentsNamesDebtor.includes(obj.fileName)) {
                    this._FullPowersDocumentsNamesDebtor.splice(this._FullPowersDocumentsNamesDebtor.indexOf(obj.fileName), 1);
                }

                if (this._FullPowersDocumentsNamesDebtor && this._FullPowersDocumentsNamesDebtor != []) {
                    this._FullPowersDocumentsNamesURLsDebtor = this._FullPowersDocumentsNamesURLsDebtor.filter(item => item.fileName != obj.fileName);
                }
            },
            errorObject => this.process_error(errorObject)
            );
    }

    person_document_deleted_ok(file: string) {
        this.showProgress = false;
        this.helper.showToast(document.getElementById('theToast'), 'Person\'s document ' + file + ' was deleted');
    }

    calc_contract_duration(event: any) {
        let target = event.target || event.srcElement;
        if (this.selectedContract) {
            this.selectedContract[target.id] = new Date(event.detail.value);

            let d1 = moment(this.selectedContract.DateFrom);
            let d2 = moment(this.selectedContract.DateTo);
            this.selectedContract.Duration = d2.diff(d1, 'days');
        }
    }

    update_contract() {
        this.showProgress = true;

        this.selectedContract.SupplierSigner.FullPowersDocumentsNames = JSON.stringify(this._FullPowersDocumentsNamesSupplier);
        this.selectedContract.DebtorSigners[0].FullPowersDocumentsNames = JSON.stringify(this._FullPowersDocumentsNamesDebtor);
        this.errorMessages = new Array<string>();
        this.dataService.update_contract(this.selectedContract, this.selectedDebtor)
            .subscribe(
            appForm => {
                this._set_date(appForm);
                this.contract_updated_ok(appForm);
                this.selectedContract = appForm;

                this.toDownloadSupplierFPDN.nativeElement.files = [];
                this.toDownloadDebtorFPDN.nativeElement.files = [];

                this._FullPowersDocumentsNamesURLsSupplier.forEach(doc => doc.isVisible = true);
                this._FullPowersDocumentsNamesURLsDebtor.forEach(doc => doc.isVisible = true);
            },
            errorObject => this.process_error(errorObject));
    }

    contract_updated_ok(appForm: ContractViewModel) {
        this.showProgress = false;
        //this.helper.showToast(document.getElementById('theToast'), 'Contract\'s datas were updated');
        this.helper.showToast(this.theToast.nativeElement, 'Contract\'s datas were updated');
    }

    before_file_upload(event: any) { }

    upl_reject(event: any) { this.helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error); }

    after_file_upload_supplier(event: any) {
        this._FullPowersDocumentsNamesSupplier.push(event.detail.xhr.responseText);
        this._FullPowersDocumentsNamesURLsSupplier.push(new UrlObject(
            false,
            event.detail.xhr.responseText,
            '/' + this.selectedContract.SupplierSigner.GetDocsBaseUrl + '/' + this.selectedContract.SupplierSigner.Id + "/" + event.detail.xhr.responseText,
            '/' + this.selectedContract.SupplierSigner.DeleteDocsBaseUrl + '/' + this.selectedContract.SupplierSigner.Id + "/" + event.detail.xhr.responseText
        ));
    }

    after_file_upload_debtor(event: any) {
        this._FullPowersDocumentsNamesDebtor.push(event.detail.xhr.responseText);
        this._FullPowersDocumentsNamesURLsDebtor.push(new UrlObject(
            false,
            event.detail.xhr.responseText,
            '/' + this.selectedContract.DebtorSigners[0].GetDocsBaseUrl + '/' + this.selectedContract.DebtorSigners[0].Id + "/" + event.detail.xhr.responseText,
            '/' + this.selectedContract.DebtorSigners[0].DeleteDocsBaseUrl + '/' + this.selectedContract.DebtorSigners[0].Id + "/" + event.detail.xhr.responseText
        ));
    }

    private _set_date(selectedContract: ContractViewModel) {
        selectedContract.DateOfSign = moment(selectedContract.DateOfSign).format(this.dt_template);
        selectedContract.DateFrom = moment(selectedContract.DateFrom).format(this.dt_template);
        selectedContract.DateTo = moment(selectedContract.DateTo).format(this.dt_template);
        selectedContract.DebtorObligationsDate = moment(selectedContract.DebtorObligationsDate).format(this.dt_template);
        selectedContract.SupplierDeliveryDate = moment(selectedContract.SupplierDeliveryDate).format(this.dt_template);
        selectedContract.PropertyRightsTransferDate = moment(selectedContract.PropertyRightsTransferDate).format(this.dt_template);
        selectedContract.SupplierSigner.AuthDateFrom = moment(selectedContract.SupplierSigner.AuthDateFrom).format(this.dt_template);
        selectedContract.SupplierSigner.AuthDateTo = moment(selectedContract.SupplierSigner.AuthDateTo).format(this.dt_template);
        selectedContract.DebtorSigners[0].AuthDateFrom = moment(selectedContract.DebtorSigners[0].AuthDateFrom).format(this.dt_template);
        selectedContract.DebtorSigners[0].AuthDateTo = moment(selectedContract.DebtorSigners[0].AuthDateTo).format(this.dt_template);
    }
}