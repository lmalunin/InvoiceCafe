import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { CompanyViewModel } from '../models/CompanyViewModel';
import { StorageService } from './../storageService';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { HelperService } from './../helperService';

declare var jQuery: any;
@Component({
    selector: 'ic-application',
    templateUrl: '/templates/v0102/investors/app.tpl.html'
})
export class AppComponent implements AfterViewInit {
    currentCompany: CompanyViewModel;

    constructor(private elementRef: ElementRef, private storService: StorageService, private translate: TranslateService, private helper: HelperService) {
        this.currentCompany = new CompanyViewModel();

        helper.mapCompany(this.currentCompany, this.elementRef.nativeElement);

        this.storService.setValue(this.currentCompany);

        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(this.elementRef.nativeElement.getAttribute('_lang'));
    }

    ngAfterViewInit() {
        setTimeout(() => {
            var rdNavbar: any = jQuery('.rd-navbar');
            if (rdNavbar.length) {
                rdNavbar.RDNavbar({
                    stickUpClone: (rdNavbar.attr("data-stick-up-clone")) ? rdNavbar.attr("data-stick-up-clone") === 'true' : false
                });
                if (rdNavbar.attr("data-body-class")) {
                    document.body.className += ' ' + rdNavbar.attr("data-body-class");
                }
            }
        }, 0);
    }
}
