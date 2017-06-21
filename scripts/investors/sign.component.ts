import { Component, OnInit, Input } from '@angular/core';

import { SignFormViewModel } from '../models/SignFormViewModel';
import { CompanyViewModel } from '../models/CompanyViewModel';

import { DictionaryService, dictItem } from './../dictService';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { HelperService } from './../helperService';
import './../rxjs-operators';

import { Router, ActivatedRoute }    from '@angular/router';

declare var moment: any;

@Component({
    selector: 'ic-sign',
    templateUrl: '/templates/v0102/investors/sign.tpl.html'
})
export class SignComponent implements OnInit {
    errorMessages: Array<string>;
    @Input() _upl_local: Object;
    @Input() _dp_local: Object;
    model: SignFormViewModel;

    currentCompany: CompanyViewModel;

    constructor(private dataService: DataService, private router: Router, private storService: StorageService, private dict: DictionaryService, private helper: HelperService) {
        this.currentCompany = storService.getValue();
        this.initialize_model();

        this._dp_local = this.helper.DATE_PICKER_i18n_en;
        this._upl_local = this.helper.UPLOAD_i18n_en;
    }

    initialize_model() {
        this.model = new SignFormViewModel();
        this.model.Company = this.currentCompany;
        this.model.DirectorCitizenship = 'Russia';
    }

    ngOnInit(): void {
    }

    //before_file_upload(event: any) {
    //    console.log(event.srcElement);

    //    var timestamp: string = Date.now().toString();
    //    var server_file_name = timestamp + "_" + event.detail.file.name;    //create server file name = timestamp + local file name
    //    var control_name = event.srcElement.id;
    //    event.detail.formData.append(event.detail.file.name, server_file_name); //add parameter for server { "local file name" : "server file name" }
    //    this.model[control_name] = server_file_name;
    //    //console.log(this.model);
    //    //this.newDZ.DocumentsURLs.push(server_file_name);
    //}

    after_file_upload(event: any) {
        let controlName = event.srcElement.id;
        let serverFileName = event.detail.xhr.responseText;
        this.model[controlName] = serverFileName;
        //console.log('added ', serverFileName);
    }

    upl_reject(event: any) {
        var toast: any = document.getElementById('rejectToast');
        if (toast) {
            toast.text = event.detail.file.name + ' error: ' + event.detail.error;
            toast.open();
        }
    }

    set_tarif(ind: number) {
        this.model.Tarif = 1;
    }

    set_citizenship(val: string) {
        if (val == "RF_Yes")
            this.model.DirectorCitizenship = "Russia";
        else
            this.model.DirectorCitizenship = "";

        console.log(this.model.DirectorCitizenship);
    }

    submit_click = function () {
        this.errorMessages = new Array<string>();
        this.dataService.add_signform(this.model)
            .subscribe(
            appForm => this.register_ok(appForm),
            errorObject => this.process_error(errorObject));
    }

    process_error(errorObject: Object) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    }

    register_ok = function (appForm: SignFormViewModel) {
        this.showProgress = false;
        this.helper.showToast(document.getElementById('theToast'), "The application is successfully registered!");
    }
}
