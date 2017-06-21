import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PolymerElement } from '@vaadin/angular2-polymer';

import { AppComponent }   from './app.component';
import { IndexComponent }      from './index.component';
import { CompaniesListComponent }      from './companies-list.component';
import { SignFormDetailsComponent }      from './signform-details.component';
import { DZListComponent }      from './dz-list.component';
import { DZDetailsComponent}      from './dz-details.component';

import { DictionaryService } from './../dictService';
import { DataService } from './../dataService';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { HelperService } from './../helperService';

import { routing } from './app.routing';

import { CurrencyRurPipe } from './../pipes';

@NgModule({
    providers: [
        DataService, DictionaryService, HelperService
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
        AppComponent, IndexComponent,
        CompaniesListComponent, SignFormDetailsComponent, DZListComponent, DZDetailsComponent,

        CurrencyRurPipe,

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
