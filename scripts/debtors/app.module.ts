import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PolymerElement } from '@vaadin/angular2-polymer';
import { AppComponent } from './app.component';
import { IndexComponent } from './index.component';
import { DZListComponent } from './dz-list.component';
import { DZDetailsComponent} from './dz-details.component';
import { ContractDetailsComponent } from './contracts.component';

import { SignComponent }      from '../common/register-sign.component';
import { RulesComponent }      from '../common/register-rules.component';
import { EdsComponent }      from '../common/register-eds.component';
import { ProfileComponent }      from '../common/profile.component';

import { UsersManagementComponent } from "./usersmanagement.component";
import { AddPersonComponent } from "./add-person.component";
import { UpdatePersonComponent } from "./update-person.component";

import { CurrencyRurPipe, LabelDaysPipe } from './../pipes';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { DictionaryService } from './../dictService';
import { HelperService } from './../helperService';
import { EDSService } from './../edsService';
import { routing } from './app.routing';


@NgModule({
    providers: [
        DataService, StorageService, DictionaryService, HelperService, EDSService
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
        DZListComponent,
        DZDetailsComponent,
        ContractDetailsComponent,

        SignComponent,
        RulesComponent,
        EdsComponent,
        ProfileComponent,

        UsersManagementComponent,
        AddPersonComponent,
        UpdatePersonComponent,
        CurrencyRurPipe, LabelDaysPipe,

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

        PolymerElement('iron-autogrow-textarea'),
        PolymerElement('vaadin-date-picker'),
        PolymerElement('vaadin-upload'),
        PolymerElement('vaadin-grid')
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
