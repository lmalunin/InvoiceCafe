import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from './../dataService';
import { TranslateService } from 'ng2-translate/ng2-translate';

declare var jQuery: any;

@Component({
    selector: 'ic-application',
    templateUrl: '/templates/v0102/admins/app.tpl.html'
})
export class AppComponent implements AfterViewInit {
    userName: string = this.elementRef.nativeElement.getAttribute('userName')

    constructor(private elementRef: ElementRef, private dataService: DataService, private translate: TranslateService) {
        translate.setDefaultLang('en');
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
