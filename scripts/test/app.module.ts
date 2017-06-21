import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PolymerElement } from '@vaadin/angular2-polymer';

import { TestComponent } from "./test.component";

import { DataService } from './../dataService';
import { StorageService } from './../storageService';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { HelperService } from './../helperService';
import { DictionaryService } from './../dictService';


@NgModule({
    providers: [
        DataService,
        StorageService,
        DictionaryService,
        HelperService
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        JsonpModule,
        TranslateModule.forRoot()
    ],
    declarations: [



        TestComponent
    ],
    bootstrap: [TestComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
