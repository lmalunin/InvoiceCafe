import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PolymerElement } from '@vaadin/angular2-polymer';
import { AppComponent } from './app.component';
import { IndexComponent } from './index.component';

import { AddDebtorComponent } from './debtors-add.component';
import { DebtorsListComponent } from './debtors-list.component';

import { UsersManagementComponent } from "./usersmanagement.component";
import { AddPersonComponent } from "./add-person.component";
import { UpdatePersonComponent } from "./update-person.component";

import { LotsListComponent } from './lots-list.component';
import { OffersListComponent } from './offers-list.component';
import { OfferDetailsComponent } from './offer-details.component';
import { DealsListComponent } from './deals.component';
import { ContractsListComponent }      from './contracts-list.component';
import { ContractsAddComponent }      from './contracts-add.component';
import { ContractDetailsComponent }      from './contract-details.component';
import { ContractUpdateComponent }      from './contract-update.component';

import { SignComponent }      from '../common/register-sign.component';
import { RulesComponent }      from '../common/register-rules.component';
import { EdsComponent }      from '../common/register-eds.component';
import { ProfileComponent }      from '../common/profile.component';

import { TestComponent } from "./test.component";

import { CurrencyRurPipe } from './../pipes';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { HelperService } from './../helperService';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { DictionaryService } from './../dictService';
import { EDSService } from './../edsService';
import { routing } from './app.routing';
import { __platform_browser_private__, SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@NgModule({
    providers: [
        DataService,
        StorageService,
        DictionaryService,
        EDSService,
        HelperService,
        __platform_browser_private__.BROWSER_SANITIZATION_PROVIDERS,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        JsonpModule,
        TranslateModule.forRoot(),
        routing
    ],
    declarations: [
        AppComponent,
        IndexComponent,
        LotsListComponent,
        DebtorsListComponent,
        AddDebtorComponent,

        UsersManagementComponent,
        AddPersonComponent,
        UpdatePersonComponent,

        SignComponent,
        ContractsListComponent,
        ContractsAddComponent,
        ContractDetailsComponent,
        ContractUpdateComponent,
        OffersListComponent,
        OfferDetailsComponent,
        DealsListComponent,
        CurrencyRurPipe,
        RulesComponent,
        EdsComponent,
        ProfileComponent,

        PolymerElement('app-header-layout'),
        PolymerElement('app-header'),
        PolymerElement('app-toolbar'),

        PolymerElement('paper-card'),
        PolymerElement('paper-input'),
        PolymerElement('paper-slider'),
        PolymerElement('paper-button'),
        PolymerElement('paper-checkbox'),
        PolymerElement('paper-toast'),
        PolymerElement('paper-dialog'),
        PolymerElement('paper-radio-group'),
        PolymerElement('paper-radio-button'),
        PolymerElement('paper-toolbar'),
        PolymerElement('paper-fab'),

        PolymerElement('iron-autogrow-textarea'),
        //PolymerElement('iron-ajax'),
        //PolymerElement('iron-form'),

        PolymerElement('vaadin-date-picker'),
        PolymerElement('vaadin-upload'),
        //PolymerElement('vaadin-combo-box'), с объявлением некорректно работает vaadin-combo-box последней альфа версии, а без объявления - норм.

        PolymerElement('vaadin-grid'),

        TestComponent,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
