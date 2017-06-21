import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PolymerElement } from '@vaadin/angular2-polymer';

import { RegisterComponent }      from './register.component';

import { DataService } from './../dataService';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { HelperService } from './../helperService';

@NgModule({
    providers: [
        DataService, HelperService
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        JsonpModule,
        TranslateModule.forRoot(),
    ],
    declarations: [
        RegisterComponent,
        PolymerElement('app-header-layout'),
        PolymerElement('app-header'),
        PolymerElement('app-toolbar'),
        PolymerElement('paper-card'),
        PolymerElement('paper-input'),
        PolymerElement('vaadin-date-picker'),
        PolymerElement('paper-slider'),
        PolymerElement('paper-button'),
        PolymerElement('paper-checkbox'),
        PolymerElement('paper-toast'),
        PolymerElement('paper-dialog'),
        PolymerElement('vaadin-upload'),
        PolymerElement('iron-autogrow-textarea')
    ],
    bootstrap: [RegisterComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
