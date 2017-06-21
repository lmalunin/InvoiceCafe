import { Component, OnInit, Input } from '@angular/core';
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

declare var moment: any;

@Component({
    selector: 'ic-contracts-list',
    templateUrl: '/templates/v0102/suppliers/contracts-list.tpl.html'
})
export class ContractsListComponent implements OnInit {
    contracts: ContractViewModel[];
    errorMessages: Array<string>;
    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private router: Router, private storService: StorageService) {
        this.currentCompany = storService.getValue();
    }

    ngOnInit(): void {
        this.getContracts();
    }

    getContracts() {
        this.dataService.getContractsForSupplier(this.currentCompany.Id)
            .subscribe(
            contracts => { this.contracts = contracts; },
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    open_selected_contract(event: any) {
        var srcId: string = event.srcElement.id;
        var contractGuid: string = srcId.split('_')[1];
        if (contractGuid == undefined)
            return;

        //console.log("open: " + contractGuid);
        this.router.navigate(['/SupplierHome/Contract/', contractGuid]);
    }

    contract_details(guid: string) {
        this.router.navigate(['/SupplierHome/Contract/', guid]);
    }

    contract_update(contractId: string, debtorCompanyId: string) {
        this.router.navigate(['/SupplierHome/ContractUpdate/', contractId]);
    }

    navigate_to_add() {
        this.router.navigate(['/SupplierHome/AddContract/']);
    }
}

